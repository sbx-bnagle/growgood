import { DurableObject } from "cloudflare:workers";

// -----------------------------
// Durable Object for unique order numbers
// -----------------------------
export class OrdernoCounter extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx.blockConcurrencyWhile(async () => {
      this.count = (await this.ctx.storage.get("count")) || 0;
      this.pendingOrders = (await this.ctx.storage.get("pendingOrders")) || {};
    });
  }

  async increment(clientId = "global") {
    if (!this.pendingOrders[clientId]) {
      this.count++;
      this.pendingOrders[clientId] = this.count;
      await this.ctx.storage.put("count", this.count);
      await this.ctx.storage.put("pendingOrders", this.pendingOrders);
    }
    return this.pendingOrders[clientId];
  }

  async clear(clientId = "global") {
    delete this.pendingOrders[clientId];
    await this.ctx.storage.put("pendingOrders", this.pendingOrders);
  }
}

// -----------------------------
// CORS helper
// -----------------------------
function withCors(response, cors) {
  Object.entries(cors).forEach(([k, v]) => response.headers.set(k, v));
  return response;
}

// -----------------------------
// Order confirmation email builder
// -----------------------------
function buildOrderEmail(name, orderno, lineItems, address) {
  var itemRows = "";
  for (var i = 0; i < lineItems.length; i++) {
    itemRows += "<tr>" +
      "<td style='padding: 8px; border-bottom: 1px solid #eee;'>" + lineItems[i].name + "</td>" +
      "<td style='padding: 8px; border-bottom: 1px solid #eee; text-align: center;'>" + lineItems[i].qty + "</td>" +
      "</tr>";
  }

  return "<!DOCTYPE html>" +
    "<html>" +
    "<body style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>" +
    "<h1 style='color: #2e7d32;'>Thank you for your order, " + name + "!</h1>" +
    "<p>Your order has been received and is being processed.</p>" +
    "<h2 style='color: #2e7d32;'>Order #" + orderno + "</h2>" +
    "<table style='width: 100%; border-collapse: collapse; margin-bottom: 20px;'>" +
    "<thead>" +
    "<tr style='background-color: #f5f5f5;'>" +
    "<th style='padding: 8px; text-align: left;'>Item</th>" +
    "<th style='padding: 8px; text-align: center;'>Qty</th>" +
    "</tr>" +
    "</thead>" +
    "<tbody>" +
    itemRows +
    "</tbody>" +
    "</table>" +
    "<h3 style='color: #2e7d32;'>Shipping To</h3>" +
    "<p>" +
    (address.line1 || "") + "<br>" +
    (address.line2 ? address.line2 + "<br>" : "") +
    (address.city || "") + ", " + (address.state || "") + " " + (address.postal_code || "") + "<br>" +
    (address.country || "") +
    "</p>" +
    "<p style='margin-top: 30px; color: #666; font-size: 14px;'>If you have any questions about your order please reply to this email.</p>" +
    "<p style='color: #666; font-size: 14px;'>Thank you for supporting Grow Good Gardens!</p>" +
    "</body>" +
    "</html>";
}

// -----------------------------
// Main Worker
// -----------------------------
export default {
  async fetch(request, env, ctx) {
    var url = new URL(request.url);
    var cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    try {

      // ============================
      // CREATE CHECKOUT SESSION
      // ============================
      if (url.pathname === "/create-checkout" && request.method === "POST") {
        var body = await request.json();
        var clientId = body.client_id || "global";

        // Get unique order number
        var id = env.ORDERNO_COUNTER.idFromName("global");
        var stub = env.ORDERNO_COUNTER.get(id);
        var orderno = await stub.increment(clientId);

        // Format date for D1
        var now = new Date();
        var day = String(now.getDate()).padStart(2, "0");
        var month = String(now.getMonth() + 1).padStart(2, "0");
        var year = now.getFullYear();
        var dateDisplay = day + "-" + month + "-" + year;

        // Insert initial order row
        await env.KIT_ORDERS.prepare(
          "INSERT OR IGNORE INTO orders_received (orderno, date_display, plan, status) VALUES (?, ?, ?, 'pending')"
        ).bind(orderno, dateDisplay, body.plan || "default").run();

        // Build Stripe line items
        var items = [
          { qty: parseInt(body.qty) || 0, price: "price_1T47FRPyPymBAlkqJXlA4bX0" },
          { qty: parseInt(body.qtyII) || 0, price: "price_1T4o8ZPyPymBAlkqxyprD0mb" },
          { qty: parseInt(body.qtyIII) || 0, price: "price_1T4o8rPyPymBAlkqpjMSR6u1" },
        ];

        var params = new URLSearchParams();
        params.append("mode", "payment");
        params.append("success_url", body.success_url || "https://growgoodgardens.com/success");
        params.append("cancel_url", body.cancel_url || "https://growgoodgardens.com/cancel");
        params.append("billing_address_collection", "required");
        params.append("phone_number_collection[enabled]", "true");
        params.append("customer_creation", "always");
        params.append("metadata[orderno]", orderno.toString());
        params.append("shipping_options[0][shipping_rate]", "shr_1T9AoaPyPymBAlkqOoZbavw0");
        params.append("shipping_address_collection[allowed_countries][]", "US");

        var key = 0;
        for (var idx = 0; idx < items.length; idx++) {
          if (items[idx].qty > 0) {
            params.append("line_items[" + key + "][price]", items[idx].price);
            params.append("line_items[" + key + "][quantity]", items[idx].qty);
            key++;
          }
        }

        // Call Stripe
        var stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + env.STRIPE_SECRET_KEY,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        });

        var stripeData = await stripeRes.json();
        if (!stripeRes.ok) {
          console.error("Stripe error:", JSON.stringify(stripeData));
          return withCors(
            new Response(
              JSON.stringify({ error: stripeData.error?.message || "Stripe error" }),
              { status: 400 }
            ),
            cors
          );
        }

        return withCors(
          new Response(JSON.stringify({ url: stripeData.url, orderno: orderno }), { status: 200 }),
          cors
        );
      }

      // ============================
      // STRIPE WEBHOOK
      // ============================
      if (url.pathname === "/webhook" && request.method === "POST") {
        var bodyText = await request.text();
        var event = JSON.parse(bodyText);

        if (event.type === "checkout.session.completed") {
          var session = event.data.object;
          var orderno = session.metadata?.orderno;

          if (!orderno) {
            return withCors(new Response("No orderno in metadata", { status: 400 }), cors);
          }

          // Fetch the full session from Stripe with expansions
          var expandParams = new URLSearchParams();
          expandParams.append("expand[]", "line_items");
          expandParams.append("expand[]", "customer");

          var stripeRes = await fetch(
            "https://api.stripe.com/v1/checkout/sessions/" + session.id + "?" + expandParams.toString(),
            {
              headers: {
                Authorization: "Bearer " + env.STRIPE_SECRET_KEY,
              },
            }
          );

          var fullSession = await stripeRes.json();

          if (!stripeRes.ok) {
            console.error("Stripe session fetch error:", JSON.stringify(fullSession));
            throw new Error("Stripe API error: " + (fullSession.error?.message || "unknown"));
          }

          // Extract customer fields
          var customerDetails = fullSession.customer_details || {};
          var customerName = customerDetails.name || "Unknown";
          var customerEmail = customerDetails.email || "";
          if (!customerEmail) {
            throw new Error("Customer email missing.");
          }
          var customerPhone = customerDetails.phone || "";

          // Shipping address
          var shippingDetails = null;
          if (fullSession.collected_information && fullSession.collected_information.shipping_details) {
            shippingDetails = fullSession.collected_information.shipping_details;
          } else if (fullSession.shipping_details) {
            shippingDetails = fullSession.shipping_details;
          } else if (fullSession.shipping) {
            shippingDetails = fullSession.shipping;
          }

          var shippingAddress;
          if (shippingDetails && shippingDetails.address) {
            shippingAddress = shippingDetails.address;
            if (shippingDetails.name) {
              customerName = shippingDetails.name;
            }
          } else {
            shippingAddress = customerDetails.address || {};
            console.log("No shipping address found, using billing address as fallback.");
          }

          // Build line items list
          var lineItemsData = fullSession.line_items?.data || [];
          var lineItems = [];
          for (var i = 0; i < lineItemsData.length; i++) {
            lineItems.push({
              name: lineItemsData[i].description,
              qty: lineItemsData[i].quantity,
            });
          }

          // Create tasks object
          var tasks = {
            "planned":false,
            "documented":false,
            "batched":false,
            "labeled":false,
            "packaged":false,
            "shipped":false,
            "confirmed":false
          }

          // Update order in D1
          await env.KIT_ORDERS.prepare(
            "UPDATE orders_received SET status = 'paid', customer = ?, email = ?, phone = ?, address = ?, items = ?, tasks = ? WHERE orderno = ?"
          ).bind(
            customerName,
            customerEmail,
            customerPhone,
            JSON.stringify(shippingAddress),
            JSON.stringify(lineItems),
            JSON.stringify(tasks),
            parseInt(orderno)
          ).run();

          // Clear the pending order counter slot
          var doId = env.ORDERNO_COUNTER.idFromName("global");
          var doStub = env.ORDERNO_COUNTER.get(doId);
          await doStub.clear(session.client_reference_id || "global");

          console.log("Order " + orderno + " updated successfully.");

          // Add customer to Resend Mailing List audience
          var audienceRes = await fetch("https://api.resend.com/audiences/d88cdc9b-033d-4d6e-93c7-8b0c26df1c16/contacts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + env.RESEND_API_KEY,
            },
            body: JSON.stringify({
              email: customerEmail,
              first_name: customerName.split(" ")[0] || customerName,
              last_name: customerName.split(" ").slice(1).join(" ") || "",
              unsubscribed: false,
            }),
          });

          var audienceData = await audienceRes.json();
          if (!audienceRes.ok) {
            console.error("Resend audience error:", JSON.stringify(audienceData));
          } else {
            console.log("Resend audience contact added:", customerEmail);
          }

          // Send order confirmation email via Resend
          var emailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + env.RESEND_API_KEY,
            },
            body: JSON.stringify({
              from: "Grow Good Gardens <orders@growgoodgardens.com>",
              to: customerEmail,
              subject: "Your Order Confirmation - Order #" + orderno,
              html: buildOrderEmail(customerName, orderno, lineItems, shippingAddress),
            }),
          });

          var emailData = await emailRes.json();
          if (!emailRes.ok) {
            console.error("Resend email error:", JSON.stringify(emailData));
          } else {
            console.log("Order confirmation email sent to:", customerEmail);
          }
        }

        return withCors(new Response("ok", { status: 200 }), cors);
      }

      return withCors(new Response("Not found", { status: 404 }), cors);

    } catch (err) {
      console.error("Worker error:", err.message, err.stack);
      return withCors(
        new Response(JSON.stringify({ error: err.message }), { status: 500 }),
        cors
      );
    }
  }
};
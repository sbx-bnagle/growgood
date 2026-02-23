---
layout: page
title: Preplanned
permalink: /preplanned/
---

# Pre-planned kits for your DIY garden project

## Kits for all conditions. Scale up or down and replace your yard or add some green to your small space with a container garden.

<br>

Our kits are designed to implemented in large and small spaces with options for all sun, soil, or water conditions. Our kits are modular and are designed to work well in multiple configurations to accommodate varying conditions. 

<br>

### Garden kit plants

Our plants come as clearly labeled plugs that are ready for the ground
- how they're delivered (time, packaging)
- what's a plug (pic)
- how long with they keep before being planted
- returns/unhealthy plants

<br>

### Garden guide

- Layout and arrangement instructions with options to pair with additional kits
- Planting instructions to ensure your plants health
- Maintenance instructions for longterm growth
- General plant info

download sample guide

<br>

Don&rsquo;t hesitate to [reach out](#) with any questions about which kit is right for you.



<br><br>


## The kits

<br><br>




## Simple Test Button
<a href='https://buy.stripe.com/test_eVq28tb0JbSVfg3dqpc7u00'>TEST BUY</a>

<br><br>




## Test Button With Quantities
<label for="quantity">Quantity:</label>
<input type="number" id="item-quantity" value="1" min="1">
<button id="checkout-button">Buy Now</button>


<script>
  document.getElementById('checkout-button').addEventListener('click', async () => {
    const qty = document.getElementById('item-quantity').value; 
    const response = await fetch('https://stripe-payment-link.fagan-leah.workers.dev'+qty);
    const { url } = await response.json();    
    window.location.href = url;
  });
</script>


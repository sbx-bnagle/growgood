---
layout: kits
title: Garden Kits
permalink: /preplanned/
---


<br><br><br>



<h2>Our Plants</h2>
<p class='gridlist-intro'>A selection of perennials chosen for upper midwest gardens</p>
<ul class='gridlist-icons'>
   <li>
      <img src='/assets/images/spot-map.gif'>
      Native and climate-adapted to the upper midwest
   </li>
   <li>
      <img src='/assets/images/spot-gardening.gif'>
      Low maintenance perennials
   </li>
   <li>
      <img src='/assets/images/spot-caterpillar.gif'>
      Pollinator and wildlife friendly
   </li>
   <li>
      <img src='/assets/images/spot-bird.gif'>
      Habitat forming for birds and the local ecosystem
   </li>
   <li>
      <img src='/assets/images/spot-snowman.gif'>
      Maintains seasonal interest year round
   </li>
   <li>
      <img src='/assets/images/spot-grill.gif'>
      Well-behaved in home gardens
   </li>
   <li>
      <img src='/assets/images/spot-modular.gif'>
      Sized to your space, from parkway gardens to full backyards
   </li>
   <li>
      <img src='/assets/images/spot-cutting.gif'>
      Grow something that benefits you, your neighbors, and the ecosystem around you
   </li>
</ul>


<hr>


## What You Get


<div class='left'>
   <h3>Curated Plant Selection</h3>
   <p>Our plants come as clearly labeled plugs that are ready for the ground.</p>
   <ul>
      <li>how they're delivered (time, packaging)</li>
      <li>clearly labeled</li>
      <li>what's a plug (pic)</li>
      <li>don't guarantee exact plant, based on availability. See current batch</li>
   </ul>
</div>


<div class='right'>
   <h3>Detailed Instructions</h3>
   <p>Each kit comes with detailed instructions on how to install and care for your garden.</p>
   <ul>
      <li>Layout and arrangement instructions with options to pair with additional kits</li>
      <li>Planting instructions to ensure your plants health</li>
      <li>Maintenance instructions for longterm growth</li>
      <li>General plant info</li>
   </ul>
   <br>
   <a class='download button'>Download sample guide</a>
</div>

<div class='full'>
   <img class='rounded' src='/assets/images/plug_anim.gif'>
</div>

<br>

<div class='left'>
   <img class='rounded' src='/assets/images/pots.png'>
</div>

<div class='right'>
   <h2>For All</h2>
   <h3>Priced for Accessibility</h3>
   <p>Our kits are predesigned and ordered in volume, so you get professional results without the custom design cost.</p><br>
   <h3>Install it Yourself</h3>
   <p>Every kit comes with detailed step-by-step instructions for bed preparation, planting, and long-term care. No experience necessary.</p>
</div>


<hr>

{% include faq.html set="kits" %}


<br>

<div class='cta-services banner rounded'>
   <h2>Custom Garden Design & Consulting</h2>
   <p>We also offer custom garden design, on-site consulting, and contractor referrals for installation.</p>
   <a href='{{ site.url }}/services' class='button'>See Our Services</a>
   <p>or <a href='#contact'>get in touch</a> to talk through your project</p>
</div>


{%- comment -%}
  Kit checkout. The FAQ accordion script that used to live here has been
  removed — accordion behaviour is now handled by assets/js/faq.js, loaded
  below. Content for the FAQ comes from _data/faqs.yml.
{%- endcomment -%}
<script>

	compilePlan = function(){
		let planString = '';
		const squares = document.getElementsByClassName('plotter__sq');
		for (const sq of squares) {
		  const entry = sq.dataset.y + '-' + sq.dataset.x + '-' + sq.dataset.type + ',';
		  planString = planString + entry;
		}
		return planString;
	}


  document.getElementById('checkout-button').addEventListener('click', async () => {
    const qty = document.getElementById('item-quantity').value;
    const qtyII = document.getElementById('item2-quantity').value;
    const qtyIII = document.getElementById('item3-quantity').value;

    const plan = compilePlan();

    // Generate a unique client_reference_id for this session
    const clientId = crypto.randomUUID();

    let workerUrl = "https://stripe-payment-link.fagan-leah.workers.dev/create-checkout";
    let postData = {
        client_id: clientId,  // send this to the worker
        qty: qty,
        qtyII: qtyII,
        qtyIII: qtyIII,
        plan: plan,
        success_url: "https://growgoodgardens.com/success",
        cancel_url: "https://growgoodgardens.com/cancel"
    };

    fetch(workerUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
    })
    .then(res => res.json())
    .then(data => {
        if (data.url) window.location.href = data.url;
        else console.error("Stripe Error:", data.error);
    })
    .catch(err => console.error("Fetch Error:", err));
  });
</script>

<script src="{{ site.url }}/assets/js/faq.js"></script>


{% include gardenolator.html %}

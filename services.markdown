---
layout: page
title: Custom DIY
permalink: /services
---

{% include coming-soon.html %}

# Custom Design & Consulting Services

<p class='deck'>
  For Chicagoland and the upper midwest.
  <img class='services__map' src='{{ site.url }}/assets/images/gg_map.png'>
</p>

<button class='gg_button'>Get in touch to talk through your project.</button>

<br>

<div class="carousel-wrap">
  <div class="main-image" id="mainImg">
    <div class="arrow arrow-prev disabled" id="prevBtn">
      <img src='/assets/images/arrow-bw.svg'>
    </div>
    <div class="arrow arrow-next" id="nextBtn">
      <img src='/assets/images/arrow-bw.svg'>
    </div>
  </div>
  <div class="thumbs" id="thumbs"></div>
</div>


___

<p class='deck'>
  We work with homeowners, renters, and community groups to design gardens that are beautiful, ecologically sound, and suited to where you actually live. Every project starts with a conversation.
</p>

{% 
  include card.html 
  title = "Custom Garden Design" 
  blurb = "We design gardens tailored to your space, your conditions, and your taste. You'll receive a planting plan that tells you exactly what to plant and where, along with the plants themselves, sourced and delivered to your door. Whether you have a small urban plot or a full backyard, we'll put together a design that works for you."
  dest = "custom"
  link = "Learn More"
  color = "purple"
%}

{% 
  include card.html 
  title = "Site Assessment & Consultation" 
  blurb = "Not sure what will grow in your space? We'll come out and take a look. We assess soil conditions, light exposure, and drainage to make sure the plants we recommend are the right fit for your site. A site visit takes the guesswork out of gardening and sets your garden up for long-term success."
  dest = "consult"
  link = "Learn More"
  color = "gold"
%}

{% 
  include card.html 
  title = "Contractor Referrals" 
  blurb = "We design and supply. For installation, we work with a network of trusted local contractors we're happy to connect you with. If you'd prefer to install the garden yourself, we'll make sure you have everything you need to do it with confidence."
  dest = "referral"
  link = "Learn More"
  color = "red"
%}

{% 
  include card.html 
  title = "Community Projects" 
  blurb = "We work with neighborhood groups, park districts, block clubs, and schools to bring gardens to shared spaces. Whether you're planning a community planting, organizing a plant sale, or looking for someone to lead a workshop or give a talk, we're glad to help. Get in touch and tell us what you have in mind."
  dest = "community"
  link = "Learn More"
  color = "green"
%}




___




<div class='faq'>
   <h2>FAQ</h2>
   <ul>
      <li>
         <div class='faq_q' aria-expanded='false' aria-controls='faq-1'>
            How long with they keep before being planted?
         </div>
         <div class='faq_a hidden' id='faq-1'>
            Answers!
         </div>
      </li>
      <li>
         <div class='faq_q' aria-expanded='false' aria-controls='faq-2'>
            Returns/unhealthy plants?
         </div>
         <div class='faq_a hidden' id='faq-2'>
            Answers!
         </div>
      </li>
      <li>
         <div class='faq_q' aria-expanded='false' aria-controls='faq-3'>
            Where are plants sourced from?
         </div>
         <div class='faq_a hidden' id='faq-3'>
            Answers!
         </div>
      </li>
      <li>
         <div class='faq_q' aria-expanded='false' aria-controls='faq-4'>
            Why the long lead times?
         </div>
         <div class='faq_a hidden' id='faq-4'>
            Answers!
         </div>
      </li>
      <li>
         <div class='faq_q' aria-expanded='false' aria-controls='faq-5'>
            Which growing zones?
         </div>
         <div class='faq_a hidden' id='faq-5'>
            Answers!
         </div>
      </li>
      <li>
         <div class='faq_q' aria-expanded='false' aria-controls='faq-6'>
            What types of plants are in your kits?
         </div>
         <div class='faq_a hidden' id='faq-6'>
            Answers!
         </div>
      </li>
      <li>
         <div class='faq_q' aria-expanded='false' aria-controls='faq-9'>
            Are your plants native to the upper midwest?
         </div>
         <div class='faq_a hidden' id='faq-9'>
            Answers!
         </div>
      </li>
      <li>
         <div class='faq_q' aria-expanded='false' aria-controls='faq-10'>
            Can I mix kits in the same garden?
         </div>
         <div class='faq_a hidden' id='faq-10'>
            Answers!
         </div>
      </li>
      <li>
         <div class='faq_q' aria-expanded='false' aria-controls='faq-11'>
            How much maintenance do these gardens require?
         </div>
         <div class='faq_a hidden' id='faq-11'>
            Answers!
         </div>
      </li>
      <li>
         <div class='faq_q' aria-expanded='false' aria-controls='faq-12'>
            When is the best time to plant?
         </div>
         <div class='faq_a hidden' id='faq-12'>
            Answers!
         </div>
      </li>
      <li>
         <div class='faq_q' aria-expanded='false' aria-controls='faq-13'>
            What if some plants don't survive?
         </div>
         <div class='faq_a hidden' id='faq-13'>
            Answers!
         </div>
      </li>
      <li>
         <div class='faq_q' aria-expanded='false' aria-controls='faq-15'>
            Are these plants safe for pets and children?
         </div>
         <div class='faq_a hidden' id='faq-15'>
            Answers!
         </div>
      </li>     
   </ul>
</div>

___

## Ready to get started?

We're flexible and happy to talk through whatever you have in mind, big or small. 

<button class='gg_button'>Get in touch</button>


<script src="{{site.url}}/assets/js/carousel.js"></script>
<style>
  .carousel-wrap { 
  	grid-column: 1/-1;
    width: 100%; 
    margin: 0 auto;  
  }

  .main-image { 
    width: 100%; 
    aspect-ratio: 2/1;  
    border-radius: 8px; 
    overflow: hidden; 
    position: relative;
  }

  .slide { 
    position: absolute; 
    inset: 0; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); 
    will-change: transform; 
    background-color: #00f348;
  }

  .slide img { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
    display: block; 
    transition: all .5s ease-in;
  }

  .slide-label { 
    font-size: 13px;  
  }

  .slide.current { 
    transform: translateX(0); 
  }

  .slide.current img {
    opacity: 1;
    transition: all .351s ease-in;
  }

  .slide.enter-from-right { 
    transform: translateX(100%); 
  }

  .slide.enter-from-right img { 
    opacity: 0; 
  }

  .slide.enter-from-left { 
    transform: translateX(-100%); 
  }

  .slide.enter-from-left img { 
    opacity: 0; 
  }

  .slide.exit-to-left { 
    transform: translateX(-100%); 
  }

  .slide.exit-to-left img { 
    opacity: 0; 
  }

  .slide.exit-to-right { 
    transform: translateX(100%); 
  }

  .slide.exit-to-right img {  
    opacity: 0; 
  }

  .arrow { 
    position: absolute; 
    top: 50%; 
    transform: translateY(-50%); 
    z-index: 10; 
    width: 27px; 
    height: 27px; 
    border-radius: 50%; 
    border: 2px solid #f0efeb; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    cursor: pointer; 
    transition: opacity 0.15s; 
  }

  .arrow.disabled { 
    opacity: 0.4; 
    pointer-events: none; 
  }

  .arrow-prev { 
    left: 12px; 
  }

  .arrow-prev img {
    transform: rotate(180deg);
  }

  .arrow-next { 
    right: 12px; 
  }

  .arrow svg { 
    width: 16px; 
    height: 16px; 
    stroke: var(--color-text-primary); 
    fill: none; 
    stroke-width: 2; 
    stroke-linecap: round; 
    stroke-linejoin: round; 
  }

  .thumbs { 
    display: flex; 
    gap: 8px; 
    margin-top: 10px; 
    overflow-x: auto; 
    padding-bottom: 4px; 
  }

  .thumb { 
    width: 72px; 
    height: 48px; 
    flex-shrink: 0; 
    border-radius: 4px; 
    overflow: hidden; 
    cursor: pointer; 
    border: 2px solid transparent; 
    background: var(--color-background-secondary); 
    transition: border-color 0.15s; 
  }

  .thumb img { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
    display: block; 
  }

  .thumb.active { 
    border-color: color(neutral, XXX); 
  }

  .thumb:hover:not(.active) { 
    border-color: var(--color-border-secondary); 
  }

  .thumb-placeholder { 
    width: 100%; 
    height: 100%; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 10px; 
    color: var(--color-text-tertiary); 
  }

  .order-image {
    padding: bl(4) 0 bl(6) bl(4);

  }

  .order-image .carousel-wrap {
    border-radius: 8px;
    position: sticky;
    top: 92px;
  }
</style>


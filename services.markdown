---
layout: service
title: Services
permalink: /services
---

{% include coming-soon.html %}

# Custom Garden Design & Consulting Services

<p class='deck'>
  For Chicagoland and the upper midwest.
  <img class='services__map' src='{{ site.url }}/assets/images/gg_map.png'>
</p>

<a href='#contact' class='gg_button'>Get in touch to talk through your project.</a>

___

<p class='deck'>
  We work with homeowners, renters, and community groups to design gardens that are beautiful, ecologically sound, and suited to where you actually live. Every project starts with a conversation.
</p>

{%- comment -%}
  Full service grid. Cards are defined in _data/services.yml — edit there.
{%- endcomment -%}
{% for service in site.data.services %}
{% include card.html
   title = service.title
   blurb = service.blurb
   dest  = service.dest
   link  = service.link
   color = service.color %}
{% endfor %}

___

{% include faq.html set="services" %}

___

{% include cta.html %}

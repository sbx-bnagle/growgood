---
layout: service
title: Services
permalink: /services
---

{% include coming-soon.html %}

# Custom garden design & consulting services

<p class='deck'>
  For Chicagoland and the Upper Midwest.
  <img class='services__map' src='{{ site.url }}/assets/images/gg_map.png' alt='Map of the United States with the Upper Midwest highlighted'>
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
{% include gg/card.html
   title = service.title
   blurb = service.blurb
   dest  = service.dest
   link  = service.link
   color = service.color %}
{% endfor %}

___

{% include gg/faq.html set="services" %}

___

{% include gg/cta.html %}

---
layout: page
title: Search Results
permalink: /search/
---



<!--  -->
<!-- [
  {% for post in site.posts %}
    {
      "title": {{ post.title | jsonify }},
      "url": {{ post.url | jsonify }},
      "date": {{ post.date | date: "%Y-%m-%d" | jsonify }},
      "content": {{ post.content | strip_html | strip_newlines | remove_chars | jsonify }}
    }{% unless forloop.last %},{% endunless %}
  {% endfor %}
] -->

<div class="header-search">
  <form class="header-search-form" action="/search/" method="get">
    <input type="text" id="search-box" name="query">
    <input type="submit" value="search">
  </form>
</div>


<ul id="search-results"></ul>

<script>
  // Template to generate the JSON to search
  window.store = {
    {% for post in site.posts %}
      "{{ post.url | slugify }}": {
        "title": "{{ post.title | xml_escape }}",
        "author": "{{ post.author | xml_escape }}",
        "category": "{{ post.category | xml_escape }}",
        "content": {{ post.content | strip_html | strip_newlines | jsonify }},
        "url": "{{ post.url | xml_escape }}"
      }
      {% unless forloop.last %},{% endunless %}
    {% endfor %}
  };
</script>

<script src="{{site.url}}/assets/js/lunr.min.js"></script>
<script async src="{{site.url}}/assets/js/journal-search.js"></script>
---
title: Modal
path_slug: modal
layout: component
category: ui
iframe_height: medium
---

{% include_relative _notes.md %}

<div class="cf">
	<a href="{{ site.baseurl }}/component/{{ page.path_slug }}/example.html" target="_blank" class="example-link">Open example in new window</a>
</div><!--/.cf-->

<iframe {% if page.iframe_height %}class="h-{{ page.iframe_height }}"{% endif %} src="{{ site.baseurl}}/component/{{ page.path_slug }}/example.html"></iframe>

<h3>HTML</h3>

<div class="code-block">
<button class="copy-clipboard" data-clipboard-action="copy" data-clipboard-target=".copy-html-snippet-1">Copy to clipboard</button>
<div class="copy-html-snippet-1">
{% highlight html %}
<script>
	/* Add to <head> */
	// Remove no-js and add 'js' to the HTML
	document.documentElement.className = document.documentElement.className.replace('no-js', ' ');
	document.documentElement.className += ' js ';
</script>
{% endhighlight %}
</div>
</div>

This component requires a `js` class to be present on the `html` element to fully function. If you're using a script like [Modernizr](http://modernizr.com), it will handle this for you. If not, you'll need to add the above script to the `head` of the document. Adding it into the `head` will assure there will be no jumpiness in the UI while the JavaScript and CSS are loading.

{% include partials/html-component.md %}

<h3>SCSS <span class="link"><a href="vendor/css/scss/modal.scss" target="_blank">Plugin</a> | <a href="vendor/css/scss/flexbox-mixins.scss" target="_blank">Mixins</a></span></h3>

<div class="code-block">
<button class="copy-clipboard" data-clipboard-action="copy" data-clipboard-target=".copy-scss-snippet">Copy to clipboard</button>
<div class="copy-scss-snippet">
{% highlight scss %}
{% include_relative vendor/css/scss/modal.scss %}
{% endhighlight %}
</div>
</div>

<h3>JS <span class="link"><a href="component-usage.js" target="_blank">Usage</a> | <a href="vendor/js/modal.js" target="_blank">Plugin</a> | <a href="vendor/js/modal.hash.click.js" target="_blank">Extension</a></span></h3>
  
{% include partials/js-component.md %}

{% include_relative _apis.md %}

<h3>Browser Compatibility</h3>

{% include_relative _support.md %}

<h3>Resources</h3>

{% include_relative _resources.md %}

var disqus_shortname = 'c24w-blog',
	disqus_identifier = window.location.pathname,
	disqus_url = window.location.host + window.location.pathname;

(function() {
	var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
	dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
	(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
})();
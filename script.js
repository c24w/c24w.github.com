var pathHash = '/#!/';
var tagPath = pathHash + 'tag/';
var namePath = pathHash + 'name/';
var pagePath = pathHash + 'page/';
var json; // JSON
var projects; // JSON
var content;
var showing;
var showingPrefix;
var title;

function loadPage(page) {
	var p = json.pages[page.toLowerCase()];
	if (p != null)
		content.innerHTML = '<table class="section gradient" cellpadding="0" cellspacing="0">'
						  + '<tr><td class="info">'
						  + '<h2>' + p.title + '</h2>'
						  + '<p>' + p.content + '</p>'
						  + '</td></tr></table>';
}

function loadAllProjects() {
	for (var i = 0; i < projects.length; i++)
		addProject(projects[i], null, true, false, false, false);
}

function loadProjectsWithTags(tag) {
	for (var i = 0; i < projects.length; i++) {
		var proj = projects[i];
		if (hasTag(proj, tag))
			addProject(proj, tag, true, false, false, false);
	}
}

function loadProjectWithName(name) {
	for (var i = 0; i < projects.length; i++) {
		var proj = projects[i];
		if (proj.name.toLowerCase() == name.toLowerCase()) {
			addProject(projects[i], null, false, true, true, true);
			break;
		}
	}
}

function addProject(p, tagToHighlight, showName, showInfo, showCreated, showLink) {
	var d = document.createElement('div'); // IE <table> innerHTML is read only, div is helper -.-
	var html = '<table class="section gradient" cellpadding="0" cellspacing="0">'
			 + '<tr><td class="info">'
			 + (showName ? ('<h2><a href="' + namePath + encodeForURL(p.name) + '">' + p.name + '</a></h2>') : '')
			 + '<p>' + p.desc + '</p>'
			 + (showInfo && p.info != undefined ? '<p>' + p.info + '</p>' : '')
			 + '</td>'
			 + '<td class="thumb" title="Go to ' + p.name + '">'
			 + getThumbsHTML(p)
			 + '</td></tr>'
			 + '<tr><td class="tags">'
			 + getTagsHTML(p.tags, tagToHighlight) + '</td><td class="date">'
			 + (showCreated ? 'Created: ' + getDateHTML(p) : '');
	+ '</td></tr>'
	+ '</table>';
	d.innerHTML = html;
	content.appendChild(d);
}

function getDateHTML(p) {
	var d = p.created;
	for (var e in d) {
		if (e == undefined)
			return '';
	}

	return d[0] + '/' + d[1] + '/' + d[2];
}
/*
function getThumbsHTML(p){
	var su = p.shortURL != undefined;
	var lu = p.longURL != undefined;
	return ( su ? '<a href="' + p.shortURL + '">' : lu ? '<a href="' + p.longURL + '">' : '' )
		 + '<img src="' + (
							p.thumbs[0] != undefined && !isBlankString(p.thumbs[0])
							  ? json.resources.thumbURL + p.thumbs[0] + '" onerror="thumbError(this)">'
							  : json.resources.defaultThumb + '">' 
						  )
		 + ( su || lu ? '</a>' : '' );
}*/

function getThumbsHTML(p) {
	var temp = document.createElement('div');
	// image tag
	var img = document.createElement('img');
	var baseURL = json.resources.thumbURL;
	var iSrc = json.resources.defaultThumb;
	var i = 0;
	var t = p.thumbs;
	if (t != undefined && t.length > 0) {
		for (; i < t.length; i++) {
			var t2 = t[i];
			if (t2 != undefined && !isBlankString(t2)) {
				iSrc = baseURL + t2;
				i++;
				break;
			}
		}
	}
	img.src = iSrc;
	for (; i < t.length; i++) {
		var t2 = t[i];
		if (t2 != undefined && !isBlankString(t2)) {
			img.setAttribute('onmouseover', 'this.src=\'' + baseURL + t2 + '\'');
			img.setAttribute('onmouseout', 'this.src=\'' + iSrc + '\'');
			break;
		}
	}
	// anchor tag
	var a = document.createElement('a');
	var su = p.shortURL, lu = p.longURL;
	var aSrc;
	if (su != undefined && !isBlankString(su))
		aSrc = su;
	else if (lu != undefined && !isBlankString(lu))
		aSrc = lu;
	// append
	if (aSrc != null) {
		a.href = aSrc;
		a.appendChild(img);
		temp.appendChild(a);
	}
	else temp.appendChild(img);
	return temp.innerHTML;
}

function getTagsHTML(tagArray, highlightTag) {
	var html = '';
	tagArray.sort(sortIgnoreCase);
	for (var i = 0; i < tagArray.length; i++) {
		var tag = tagArray[i];
		var isFirst = (i == 0 ? ' first' : '');
		if (highlightTag != null && tag.toLowerCase() == highlightTag.toLowerCase())
			html += '<a href="' + pathHash + '" class="highlighted tag' + isFirst + '">' + tag + '</a>';
		else
			html += '<a href="' + tagPath + encodeForURL(tag) + '" class="tag' + isFirst + '">' + tag + '</a>';
	}
	return html;
}

function sortIgnoreCase(x, y) {
	var a = x.toLowerCase(), b = y.toLowerCase();
	return a < b ? -1 : a > b ? 1 : 0;
}

function hasTag(project, requiredTag) {
	for (var i = 0; i < project.tags.length; i++) {
		var tag = project.tags[i].toLowerCase();
		if (tag == requiredTag.toLowerCase())
			return true;
	}
	return false;
}

function encodeForURL(name) {
	return encodeURIComponent(name).replace(/%20/g, '_');
}

function decodeFromURL(encoded) {
	return decodeURIComponent(encoded.replace(/_/g, ' '));
}

function setShowing(prefix, message) {
	showingPrefix.innerHTML = prefix;
	showing.innerHTML = message;
}

function setTitle(titleSuffix) {
	document.title = title + (titleSuffix != null ? ' | ' + titleSuffix : '');
}

function isBlankString(str) {
	var s = str;
	s = s.trim ? s.trim() : s.replace(/\s+/, '');
	return s.length == 0;
}

function capitalise(s) {
	return s.replace(/(^\w|\s+\w)/g, function (m) { return m.toUpperCase() });
}

function writeError(msg, cause) {
	content.innerHTML = '<div class="error">' + msg + '</div>';
}

function check404(cause, type) {
	if (isBlankString(content.innerHTML)) {
		var msg, c = cause;
		if (isBlankString(cause)) {
			msg = '<p>No ' + type + ' specified in URL path</p>';
			c = 'Undefined ' + capitalise(type);
		}
		else {
			switch (type) {
				case 'tag': msg = '<p>I haven\'t used <em>' + cause + '</em> in any of my creations!<br>What does it do?</p>'; break;
				case 'name': msg = '<p>I haven\'t created anything called <em>' + cause + '</em>!<br>Perhaps I\'ll look into it.</p><p>If this used to exist, it may have been renamed.</p>'; break;
				case 'page': msg = '<p>There is no page called <em>' + cause + '</em>!<br>Should there be?</p>';
			}
		}
		setShowing(c, '404');
		writeError('<div class="section">' + msg + '</section>')
		setTitle('404');
	}
}

function resetURL() {
	if ("replaceState" in history)
		history.replaceState('', document.title, '/');
}

function loadFromURL() {
	content.innerHTML = '';
	var fullPath = (window.location.pathname + window.location.hash), fp = fullPath.toLowerCase();
	if (fp.indexOf(tagPath) == 0) {
		var tags = escapeChars(decodeFromURL(fullPath.substring(tagPath.length)));
		loadProjectsWithTags(tags);
		setShowing('Tag:', tag);
		setTitle('Tag: ' + tag);
		check404(tags, 'tag');
	}
	else if (fp.indexOf(namePath) == 0) {
		var name = escapeChars(decodeFromURL(fullPath.substring(namePath.length)));
		setShowing('Name:', name);
		setTitle(name);
		loadProjectWithName(name);
		check404(name, 'name');
		window.scrollTo(0, 0);
	}
	else if (fp.indexOf(pagePath) == 0) {
		var page = capitalise(escapeChars(decodeFromURL(fullPath.substring(pagePath.length))));
		setShowing('Page:', page);
		setTitle(capitalise(page));
		loadPage(page);
		check404(page, 'page');
		window.scrollTo(0, 0);
	}
	else {
		loadAllProjects();
		setShowing('Showing:', 'Everything');
		setTitle(null);
		if ("replaceState" in history) // remove hashPath
			history.replaceState('', document.title, '/');
	}
}

window.onload = function () {
	$.getJSON('/data.json', function (jsonData) {
		projects = jsonData.projects;
		json = jsonData;
		startHashListener();
		loadFromURL();
	})
	.error(function (a, b, c) { alert('Error loading projects\n' + c) });
	title = document.title
	content = document.getElementById('content');
	var e = document.getElementById('second');
	showingPrefix = e.getElementsByTagName('div')[0];
	showing = e.getElementsByTagName('div')[1];
	document.getElementById('header').onmousedown = function () { return false };
}

function thumbError(img) {
	img.src = json.base64.defaultThumb;
	img.removeAttribute('onerror', 0);
}

function startHashListener() {
	if (window.onhashchange) window.onhashchange = function () { loadFromURL(); }
	else {
		$.getScript('http://yourjavascript.com/7223275314/jquery.ba-hashchange.min.js', function () {
			$(window).hashchange(function () {
				loadFromURL();
			})
		})
		.error(function () { alert('Error listening to hash') });
	}
}

function escapeChars(string) {
	return string.replace(/&((#(34|38|39|60|62|160|161|162|163|164|165|166|167|168|169|170|171|172|173|174|175|176|177|178|179|180|181|182|183|184|185|186|187|188|189|190|191|192|193|194|195|196|197|198|199|200|201|202|203|204|205|206|207|208|209|210|211|212|213|214|215|216|217|218|219|220|221|222|223|224|225|226|227|228|229|230|231|232|233|234|235|236|237|238|239|240|241|242|243|244|245|246|247|248|249|250|251|252|253|254|255|338|339|352|353|376|402|710|732|913|914|915|916|917|918|919|920|921|922|923|924|925|926|927|928|929|931|932|933|934|935|936|937|945|946|947|948|949|950|951|952|953|954|955|956|957|958|959|960|961|962|963|964|965|966|967|968|969|977|978|982|8194|8195|8201|8204|8205|8206|8207|8211|8212|8216|8217|8218|8220|8221|8222|8224|8225|8226|8230|8240|8242|8243|8249|8250|8254|8260|8364|8465|8472|8476|8482|8501|8592|8593|8594|8595|8596|8629|8656|8657|8658|8659|8660|8704|8706|8707|8709|8711|8712|8713|8715|8719|8721|8722|8727|8730|8733|8734|8736|8743|8744|8745|8746|8747|8756|8764|8773|8776|8800|8801|8804|8805|8834|8835|8836|8838|8839|8853|8855|8869|8901|8968|8969|8970|8971|9001|9002|9674|9824|9827|9829|9830))|Aacute|aacute|Acirc|acirc|acute|aelig|AElig|Agrave|agrave|alefsym|Alpha|alpha|amp|and|ang|apos|Aring|aring|asymp|Atilde|atilde|auml|Auml|bdquo|Beta|beta|brvbar|bull|cap|Ccedil|ccedil|cedil|cent|chi|Chi|circ|clubs|cong|copy|crarr|cup|curren|Dagger|dagger|dArr|darr|deg|delta|Delta|diams|divide|eacute|Eacute|ecirc|Ecirc|egrave|Egrave|empty|emsp|ensp|Epsilon|epsilon|equiv|Eta|eta|eth|ETH|Euml|euml|euro|exist|fnof|forall|frac12|frac14|frac34|frasl|gamma|Gamma|ge|gt|harr|hArr|hearts|hellip|Iacute|iacute|Icirc|icirc|iexcl|Igrave|igrave|image|infin|int|iota|Iota|iquest|isin|Iuml|iuml|kappa|Kappa|Lambda|lambda|lang|laquo|lArr|larr|lceil|ldquo|le|lfloor|lowast|loz|lrm|lsaquo|lsquo|lt|macr|mdash|micro|middot|minus|mu|Mu|nabla|nbsp|ndash|ne|ni|not|notin|nsub|ntilde|Ntilde|Nu|nu|Oacute|oacute|Ocirc|ocirc|OElig|oelig|Ograve|ograve|oline|omega|Omega|Omicron|omicron|oplus|or|ordf|ordm|Oslash|oslash|Otilde|otilde|otimes|Ouml|ouml|para|part|permil|perp|Phi|phi|pi|Pi|piv|plusmn|pound|prime|Prime|prod|prop|Psi|psi|quot|radic|rang|raquo|rArr|rarr|rceil|rdquo|real|reg|rfloor|rho|Rho|rlm|rsaquo|rsquo|sbquo|Scaron|scaron|sdot|sect|shy|Sigma|sigma|sigmaf|sim|spades|sub|sube|sum|sup1|sup|sup2|sup3|supe|szlig|Tau|tau|there4|Theta|theta|thetasym|thinsp|THORN|thorn|tilde|times|trade|Uacute|uacute|uArr|uarr|Ucirc|ucirc|Ugrave|ugrave|uml|upsih|Upsilon|upsilon|Uuml|uuml|weierp|xi|Xi|Yacute|yacute|yen|Yuml|yuml|Zeta|zeta|zwj|zwnj);/g, function (entity) {
		return entity.replace(/&/, '&amp;');
	}).replace(/</g, "&lt;");
}

(function () {
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-37229798-1']);
	_gaq.push(['_trackPageview']);

	(function () {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
})();
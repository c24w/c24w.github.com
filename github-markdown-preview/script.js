$(function executeScript() {

	function beforeSend(request) {
		request.setRequestHeader('Content-Type', 'text/x-markdown');
	}

	function success(data) {
		data = data.replace(/\%0A/g,'<br>');
		data = decodeURIComponent(data);
		preview = $('#preview');
		preview.html(data);
	}

	function getMarkdown() {
		var markdown = $('#markdown')[0].value;
		if (markdown) {
			$.ajax({
				type: "POST",
				beforeSend: beforeSend,
				url: 'https://api.github.com/markdown/raw',
				data: markdown,
				success: success
			});
		}
	}

	$('#previewBtn').click(getMarkdown);

});

// $.get('https:api.github.com/repos/c24w/JavaScript-Testing-Framework/readme', function (data) { console.log(atob(data.content.replace(/\n/g,''))) });
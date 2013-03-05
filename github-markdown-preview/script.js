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
				data: encodeURIComponent(markdown),
				success: success
			});
		}
	}

	$('#previewBtn').click(getMarkdown);

});
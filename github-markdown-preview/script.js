$(function executeScript() {

	var markdown = prompt('Data:');

	$.ajax({
		type: "POST",
		beforeSend: beforeSend,
		url: 'https://api.github.com/markdown/raw',
		data: markdown,
		success: success
	});

	function beforeSend(request) {
		request.setRequestHeader('Content-Type', 'text/x-markdown');
	}

	function success(data) {
		preview = $('#preview');
		preview.html(data);
	}

});
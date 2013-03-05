$(function executeScript() {

	var markdown = prompt('Data:');

	$.post('https://api.github.com/markdown/raw', markdown, requestSuccess, 'text/html');

	function requestSuccess(data) {
		preview = $('#preview');
		preview.html(data);
	}

});
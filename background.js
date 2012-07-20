$(document).ready(function(){
	foobar();
});

function foobar() {
	chrome.extension.sendMessage(null, {"foo": "bar"});
	window.setTimeout( foobar, 10000)
}
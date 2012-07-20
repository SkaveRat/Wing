$(document).ready(function() {
	chrome.extension.onMessage.addListener(function(message){
		console.log(message);
	});
	console.log("loaded");
});
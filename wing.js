$(document).ready(function() {
	console.log("Loaded Frontend");
	var frontend = new WingFrontend();
	chrome.extension.onMessage.addListener(function(message){
		if(message.initialUserHome) {
			frontend.processInitialHomeTimeline(message.initialUserHome);
		}
		if(message.userHome) {
			frontend.processHomeTimeline(message.userHome);
		}
	});
});
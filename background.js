$(document).ready(function(){
	var backend = new WingBackend(localStorage['oauth_token'], localStorage['oauth_token_secret']);
	backend.getUserHome(function(data){
		chrome.extension.sendMessage(null, {"initialUserHome": data});
		console.log("FOO");
		console.log(backend);
		updateTimeline(backend);
	});
});


/**
 * Update the timeline
 * @param backend
 */
function updateTimeline(backend) {
	backend.updateTimeline(function(data){
		chrome.extension.sendMessage(null, {"userHome": data});
	});
	window.setTimeout( function(){updateTimeline(backend)}, 30000)
}

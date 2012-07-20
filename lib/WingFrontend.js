var WingFrontend;

WingFrontend = function() {
	var that;

	/**
	 * Take Data and display it in the home timeline
	 * @param data Array of Tweet Data
	 */
	function processInitialHomeTimeline(data) {
		var homeTimeline = $('#home');
		$.each(data, function(index, item){
			if(index == 0)
				localStorage['last_id'] = item.id_str;
			var tweet = $('<div class="tweet"></div>');
			tweet.text(item.text);
			homeTimeline.append(tweet);
		});
	};

	function processHomeTimeline(data) {
		var homeTimeline = $('#home');
		console.log(data);
		$.each(data, function(index, item){
			if(index + 1 == data.length)
				localStorage['last_id'] = item.id_str;
			var tweet = $('<div class="tweet"></div>');
			tweet.text(item.text);
			homeTimeline.prepend(tweet);
		});
	}

	that = {
		processInitialHomeTimeline: processInitialHomeTimeline,
		processHomeTimeline: processHomeTimeline
	};
	return that;
}
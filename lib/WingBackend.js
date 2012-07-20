var WingBackend;

/**
 * Creates new OAuth REST object for a twitter user
 * @param token The OAuth Token
 * @param secret The OAuth Token Secret
 * @return WingBackend Object
 * @constructor
 */
WingBackend = function(token, secret) {
	var that;

	/**
	 * Fetch the Home Timeline of the user
	 * @param callback function, called on successfull fetch
	 */
	function getUserHome(callback) {
		var accessor = {
			consumerSecret:"LNZPFPJxUI0ki4ewIPFYTUTf6qqmEWtwbrP2GbWLFY",
			tokenSecret: secret
		};

		var message = {
			action:"https://api.twitter.com/1/statuses/home_timeline.json?include_entities=true",
			method:"GET",
			parameters: [
				["oauth_token", token],
				["oauth_consumer_key", "153NGRtZKMYSmdKPbUx3eA"],
				["oauth_signature_method", "HMAC-SHA1"],
				["oauth_version", "1.0"]
			]
		};

		OAuth.setTimestampAndNonce(message);
		OAuth.SignatureMethod.sign(message, accessor);

		var authHeader = {
			"Authorization": _getAuthHeader(message)
		}

		$.ajax("https://api.twitter.com/1/statuses/home_timeline.json", {
			"data": {"include_entities": "true"},
			"crossDomain": true,
			"method": "GET",
			"headers": authHeader,
			"success": function(data) {
				console.log("getUserHome successfull");
				callback(data);
			},
			"error": function(xhr, err) {
				console.log("getUserHome Error: " + err);
			}
		})
	};

	/**
	 *
	 * @param callback function for successfull data fetching
	 */
	function updateTimeline(callback) {
		var accessor = {
			consumerSecret:"LNZPFPJxUI0ki4ewIPFYTUTf6qqmEWtwbrP2GbWLFY",
			tokenSecret: secret
		};

		var message = {
			action:"https://api.twitter.com/1/statuses/home_timeline.json?include_entities=true&since_id=" + localStorage['last_id'],
			method:"GET",
			parameters: [
				["oauth_token", token],
				["oauth_consumer_key", "153NGRtZKMYSmdKPbUx3eA"],
				["oauth_signature_method", "HMAC-SHA1"],
				["oauth_version", "1.0"]
			]
		};

		OAuth.setTimestampAndNonce(message);
		OAuth.SignatureMethod.sign(message, accessor);

		var authHeader = {
			"Authorization": _getAuthHeader(message)
		}

		$.ajax("https://api.twitter.com/1/statuses/home_timeline.json", {
			"data": {"include_entities": "true", "since_id": localStorage['last_id']},
			"crossDomain": true,
			"method": "GET",
			"headers": authHeader,
			"success": function(data) {
				console.log("updateTimeline successfull");
				console.log(data);
				callback(data);
			},
			"error": function(xhr, err) {
				console.log("updateTimeline Error: " + err);
			}
		})
	}

	/**
	 * Creates the header String for oauth autheorization
	 * @param message
	 * @return Auth Header String
	 * @private
	 */
	function _getAuthHeader(message) {
		var headerString = "OAuth ";
		$.each(message.parameters, function(index, value){
			if(index >= 1)
				headerString += ", ";
			headerString = headerString + value[0] + "=\"" + encodeURIComponent(value[1]) + "\"";
		});
		return headerString;
	};

	that = {
		getUserHome: getUserHome,
		updateTimeline: updateTimeline
	};
	return that;
};
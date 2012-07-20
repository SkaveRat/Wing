var Wing;

/**
 * Creates new OAuth REST object for a twitter user
 * @param token The OAuth Token
 * @param secret The OAuth Token Secret
 * @return Wing Object
 * @constructor
 */
Wing = function Wing(token, secret) {
	var that;

	function getUserHome() {
		var accessor = {
			consumerSecret:"LNZPFPJxUI0ki4ewIPFYTUTf6qqmEWtwbrP2GbWLFY",
			tokenSecret: secret
		};

		var message = {
			action:"https://api.twitter.com/1/statuses/home_timeline.json?include_entities=true",
			method:"GET",
			"parameters": [
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
				console.log("success");
				console.log(data);
			},
			"error": function(xhr, err) {
				console.log("error: " + err);
			}
		})
	};

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
		getUserHome: getUserHome
	};
	return that;
};
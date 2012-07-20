var WingOptions;

WingOptions = function () {

	var that;

	var preAccessOauthToken;
	var preAccessOauthTokenSecret;

	/**
	 * turns an URL to an hash.
	 * Example: foo=bar&baz=fizz =>
	 * { foo: bar, baz: fizz }
	 * @param url
	 * @return {Object}
	 * @private
	 */
	function _url2hash(url) {
		var hash = {};
		var pairs = url.split("&");
		$.each(pairs, function(index, pair){
			var kv = pair.split("=");
			hash[kv[0]] = kv[1];
		});
		return hash;
	};

	function getRequestToken() {

		var message = {
			action:"https://api.twitter.com/oauth/request_token",
			method:"POST",
			parameters:[
				["oauth_callback", "oob"],
				["oauth_consumer_key", "153NGRtZKMYSmdKPbUx3eA"],
				["oauth_signature_method", "HMAC-SHA1"]
			]
		};

		var accessor = {
			consumerSecret:"LNZPFPJxUI0ki4ewIPFYTUTf6qqmEWtwbrP2GbWLFY", //AKA consumer key
			tokenSecret:""//"LNZPFPJxUI0ki4ewIPFYTUTf6qqmEWtwbrP2GbWLFY" //AKA cnsumer secret
		};

		OAuth.setTimestampAndNonce(message);

		OAuth.SignatureMethod.sign(message, accessor);

		var parameterMap = OAuth.getParameterMap(message.parameters);

		$.post(message.action, parameterMap, _processRequestToken);

	}

	function _processRequestToken(data) {
		var responseParts = _url2hash(data);
		preAccessOauthToken = responseParts.oauth_token;
		preAccessOauthTokenSecret = responseParts.oauth_token_secret;
		$('#requestAccess').attr("href","https://api.twitter.com/oauth/authenticate?oauth_token=" + responseParts.oauth_token);
		$('#requestAccess').text("KLICK HERE");
		$('#pin').bind('blur', _processAuth);
	};

	function _processAuth(evnt) {
		var pin = $('#pin').val();
		var message = {
			action:"https://api.twitter.com/oauth/access_token",
			method:"POST",
			parameters:[
				["oauth_token", preAccessOauthToken],
				["oauth_consumer_key", "153NGRtZKMYSmdKPbUx3eA"],
				["oauth_signature_method", "HMAC-SHA1"],
				["oauth_verifier", pin]
			]
		};

		var accessor = {
			consumerSecret:"LNZPFPJxUI0ki4ewIPFYTUTf6qqmEWtwbrP2GbWLFY", //AKA consumer key
			tokenSecret: preAccessOauthTokenSecret //"LNZPFPJxUI0ki4ewIPFYTUTf6qqmEWtwbrP2GbWLFY" //AKA cnsumer secret
		};
		OAuth.setTimestampAndNonce(message);
		OAuth.SignatureMethod.sign(message, accessor);
		var parameterMap = OAuth.getParameterMap(message.parameters);
		$.post(message.action, parameterMap, _processAccessToken);
	};

	function _processAccessToken(data) {
		var parsedData = _url2hash(data);

		localStorage['screen_name'] = parsedData.screen_name;
		localStorage['oauth_token'] = parsedData.oauth_token;
		localStorage['oauth_token_secret'] = parsedData.oauth_token_secret;
		localStorage['user_id'] = parsedData.user_id;
	}

	function getAuthHeader(message) {
		var headerString = "OAuth ";
		$.each(message.parameters, function(index, value){
			if(index >= 1)
				headerString += ", ";
			headerString = headerString + value[0] + "=\"" + encodeURIComponent(value[1]) + "\"";
		});
		return headerString;
	};

	that = {
		getRequestToken:getRequestToken,
		getAuthHeader: getAuthHeader
	};
	return that;
}
$(document).ready(function(){
	var wing = new WingOptions();

	if(!localStorage['user_id']) {
		var b = $('#requestToken');
		b.bind('click', wing.getRequestToken);
	}else{
		$('#token').text(localStorage['oauth_token']);
		var accessor = {
			consumerSecret:"LNZPFPJxUI0ki4ewIPFYTUTf6qqmEWtwbrP2GbWLFY",
			tokenSecret: localStorage['oauth_token_secret']
		};
		var message = {
			action:"https://api.twitter.com/1/statuses/home_timeline.json?include_entities=true",
			method:"GET",
			"parameters": [
				["oauth_token", localStorage['oauth_token']],
				["oauth_consumer_key", "153NGRtZKMYSmdKPbUx3eA"],
				["oauth_signature_method", "HMAC-SHA1"],
				["oauth_version", "1.0"]
			]
		};
		OAuth.setTimestampAndNonce(message);
		OAuth.SignatureMethod.sign(message, accessor);

		var authHeader = {
			"Authorization": wing.getAuthHeader(message)
		}
		console.log(authHeader);
		$.ajax("https://api.twitter.com/1/statuses/home_timeline.json", {
			"data": {"include_entities": "true"},
			"crossDomain": true,
			"method": "GET",
			"headers": authHeader,
			"success": function(data) {
				console.log("success");
			},
			"error": function(xhr, err) {
				console.log("error: " + err);
			}
		})
	}
});

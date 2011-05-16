RIA.Twitter = new Class({
	generateTweetButton: function(article) {
		/*
		*	@description:
		*		Generate a Twitter Tweet Button (once only) for an Article	
		*/
		try {
			var articleId = article.get("id"), header = article.getElement("h2").get("text"), tw, twContainer = new Element("span", {"class":"twitter-tweet"}), tweetHash = article.get("data-tweet-hash"), url = article.get("data-url");
		
			tw = new Element("a", {
				"href":"http://twitter.com/share",
				"class":"twitter-share-button",
				"data-lang":"en",
				"data-url":"http://www.google.co.uk",//url+articleId,
				"data-count":"none",
				"data-text":"I like Google",//header+" "+tweetHash,
				"html":"Tweet"
			}).inject(twContainer);

			twContainer.inject(article.getElement(".social"),"top");
		
			var tweet_button = new twttr.TweetButton(tw);
			tweet_button.render();
			tweet_button = articleId = header = tweetHash = tw = twContainer = url = null;			

		} catch(e) {
			Log.error({method:"generateTweetButton()", error:e});
		}
	},
	eventTweet: function(href) {
		/*
		*	@description:
		*		Method hook from Facebook Like action (edge.create).
		*/
		Log.info("Tweet : "+href);
		_gaq.push(['_trackEvent', 'Twitter', 'Tweet', href, null]);
	}
});
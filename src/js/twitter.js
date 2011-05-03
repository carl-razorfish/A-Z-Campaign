RIA.Twitter = new Class({
	generateTweetButton: function(article) {
		/*
		*	@description:
		*		Generate a Twitter Tweet Button (once only) for an Article	
		*/
		if(!article.getElement("p.twitter-tweet")) {
			var articleId = article.get("id"), header = article.getElement("h2").get("text"), tw, twContainer = new Element("p", {"class":"twitter-tweet"}), tweetHash = article.get("data-tweet-hash");
			
			tw = new Element("a", {
				"href":"http://twitter.com/share",
				"class":"twitter-share-button",
				"data-lang":"en",
				"data-url":"http://a-z-campaign.appspot.com/"+articleId,
				"data-count":"none",
				"data-text":header+" "+tweetHash,
				"html":"Tweet"
			}).inject(twContainer);

			twContainer.inject(article.getElement("nav"),"bottom");
			
			var tweet_button = new twttr.TweetButton(tw);
			tweet_button.render();
			tweet_button = articleId = tw = twContainer = null;			
		}
	}
});
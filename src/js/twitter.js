RIA.Twitter = new Class({
	generateTweetButton: function(article) {
		/*
		*	@description:
		*		Generate a Twitter Tweet Button (once only) for an Article	
		*/
		
		if(!twttr) return;
		
		var id = article.get("id"), 
		h = article.getElement("h2").get("text"), 
		t = new Element("a"), 
		c = new Element("span", {"class":"twitter-tweet"}), 
		a = article.get("data-tweet-hash"), 
		u = article.get("data-url"),
		s = article.getElement(".social"),
		tb = null;
	
		t.set({
			"href":"http://twitter.com/share",
			"class":"twitter-share-button",
			"data-lang":"en",
			"data-url":"http://www.google.co.uk",//u+id,
			"data-count":"none",
			"data-text":"I like Google",//h+" "+a,
			"html":"Tweet"
		}).inject(c);

		c.inject(s,"top");
	
		tb = new twttr.TweetButton(t);
		tb.render();
		tb = id = h = a = t = c = u = s = null;
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
RIA.Twitter = new Class({
	generateTweet: function(article) {
		/*
		*	@description:
		*		Generate a custom Twitter Tweet Button (once only) for an Article, that we can track with Google Analytics.
		*		Note that the RIA custom HTML version will already exist in the page for every article, we just need to create the event listener and adjust some data
		*/
		try {
			var tb = article.getElement(".tweet-button a"), 
			url = "http://twitter.com/share?_="+new Date().getTime()+"&count=none&original_referrer="+encodeURIComponent(window.location.href)+"&lang=en&text="+encodeURIComponent(tb.get("data-tweet"))+"&url="+encodeURIComponent(tb.get("data-url"));
			tb.set("href", url).addEvent("click", this.eventTweet.bind(this));		
			tb = url = null;
		} catch(e) {
			if(Browser.ie) alert("generateTweet() error : "+e.message);
			Log.error({message:"RIA.Twitter : generateTweet()", error:e});
		}
	},
	eventTweet: function(e) {
		/*
		*	@description:
		*		Method hook from Twitter Tweet LAUNCH BUTTON action
		*/
		try {
			e.preventDefault();		
			var t = e.targetTouches ? e.targetTouches[0].target : e.target, 
			u = t.get("data-url"),
			w = 550,
			h = 450,
			l = Math.round((this.viewport.x / 2)-(w/2)),
			n=window.open(t.get("href"),"twitter_tweet","left="+l+",top=0,width="+w+",height="+h+",personalbar=0,toolbar=0,scrollbars=1,resizable=1");
			if(n) n.focus();
		
			_gaq.push(['_trackEvent', 'Twitter', 'Tweet', u, null]);
		
			t = u = w = h = l = n = null;
		} catch(e) {
			if(Browser.ie) alert("eventTweet() error : "+e.message);
			Log.error({method:"eventTweet()", error:e});
		}
	}
});
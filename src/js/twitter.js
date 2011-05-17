RIA.Twitter = new Class({
	generateTweet: function(article) {
		/*
		*	@description:
		*		Generate a Twitter Tweet Button (once only) for an Article	
		*/
		/*
		*	@description:
		*		Generate a custom Twitter Tweet Button (once only) for an Article, that we can track with Google Analtics
		*/
		var h = article.getElement("h2").get("text"), 
		a = article.get("data-tweet-hash"), 
		u = article.get("data-url"),
		url = "http://twitter.com/share?_="+new Date().getTime()+"&count=none&original_referrer="+encodeURIComponent(u)+"&lang=en&text="+encodeURIComponent(h+" "+a)+"&url="+encodeURIComponent(u),
		tb = new Element("span").addClass("twitter-tweet tb"),
		ta = new Element("a", {
			"data-ga-url":u,
			"href":url,
			"target":"_blank",
			"rel":"external",
			"events":{
				"click":this.eventTweet.bind(this)
			}
		}),
		tt = new Element("span").set({text:"Tweet"});
		
		tt.inject(ta);
		ta.inject(tb);
		
		tb.inject(article.getElement(".social"),"top");
		
		h = a = u = url = tb = ta = tt = null;
	},
	eventTweet: function(e) {
		/*
		*	@description:
		*		Method hook from Facebook Like action (edge.create).
		*/
		e.preventDefault();
		
		var t = e.targetTouches ? e.targetTouches[0].target : e.target, 
		u = t.get("data-ga-url"),
		w = 550,
		h = 450,
		l = Math.round((this.viewport.x / 2)-(w/2)),
		n=window.open(t.get("href"),"twitter_tweet","left="+l+",top=0,width="+w+",height="+h+",personalbar=0,toolbar=0,scrollbars=1,resizable=1");
		if(n) n.focus();
		
		Log.info("Tracking Twitter Tweet : "+u);
		_gaq.push(['_trackEvent', 'Twitter', 'Tweet', u, null]);
		
		t = u = w = h = l = n = null;
	}
});
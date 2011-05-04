RIA.GA = new Class({
	GA_trackEvent: function(category, action, label, value) {
		/*
		*	@description:
		*		Manually track a custom event with GA
		*/
		try {
			_gaq.push(['_trackEvent', category, action, label, value]);
			Log.info("GA_trackEvent() : "+category+" : "+action+" : "+label);
		} catch(e) {
			Log.error({method:"GA_trackEvent()", error:e});
		}
	},
	GA_trackPageview: function(url, action) {
		/*
		*	@description:
		*		Manually track a Page View with GA
		*		This is principally used for when a User scrolls to an Alphabet content, which is considered a page, whilst within the 'All' view
		*/
		try {
			var path = url;
			if(action) path += ("/" + action);
			_gaq.push(['_trackPageview', path]);
			Log.info("GA_trackPageview() : "+path);
		} catch(e) {
			Log.error({method:"GA_trackPageview()", error:e});
		}
	}
});
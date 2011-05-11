RIA.Facebook = new Class({
	generateLikeButton: function(article) {
		/*
		*	@description:
		*		Generate a Facebook Like Button (once only) for an Article	
		*/
		try {
			var articleId = article.get("id"), fb, fbContainer = new Element("p", {"class":"facebook-like"});

			fb = document.id(document.createElement("fb:like")); // Call document.id on the variable we have just created to use Moo's Element extendables
			fb.set({
				"href":"http://www.google.co.uk",//"http://a-z-campaign.appspot.com/"+articleId,
				"show_faces":false,
				"width":450,
				"height":80,
				"font":"arial",
				"ref":""//"a-to-z-mcdonalds-"+articleId
			}).inject(fbContainer);

			fbContainer.inject(article.getElement("nav"),"bottom");
		
			/*
			*	Generate the FB Like button
			*/
			if(FB) FB.XFBML.parse(fbContainer);

			articleId = fb = fbContainer = null;

		} catch(e) {
			Log.error({method:"generateLikeButton()", error:e});
		}
	},
	initFacebook: function() {
		/*
		*	Hook from Facebook's fbAsyncInit function. Fired once the FB library has loaded
		*/
		FB.Event.subscribe('edge.create', this.eventEdgeCreate.bind(this));
		FB.Event.subscribe('edge.remove', this.eventEdgeRemove.bind(this));
	},
	eventEdgeCreate: function(href, widget) {
		/*
		*	@description:
		*		Method hook from Facebook Like action (edge.create).
		*/
		_gaq.push(['_trackEvent', 'Facebook', 'Like', href, null]);
	},
	eventEdgeRemove: function(href, widget) {
		/*
		*	@description:
		*		Method hook from Facebook Unlike action (edge.remove).
		*/
		_gaq.push(['_trackEvent', 'Facebook', 'Unlike', href, null]);
	}
});
RIA.Facebook = new Class({
	generateLikeButton: function(article) {
		/*
		*	@description:
		*		Generate a Facebook Like Button (once only) for an Article	
		*/
		//Log.info("Generating FB Like Button")
		
		var articleId = article.get("id"), fb, fbContainer = new Element("span", {"class":"facebook-like"}), url = article.get("data-url");

		fb = document.id(document.createElement("fb:like")); // Call document.id on the variable we have just created to use Moo's Element extendables
		fb.set({
			"href":url+articleId,
			"layout":"button_count",
			"show_faces":"false",
			"send":"true",
			"width":150,
			"height":80,
			"font":"arial",
			"ref":"a-to-z-mcdonalds-"+articleId
		}).inject(fbContainer);

		fbContainer.inject(article.getElement(".social"),"bottom");
	
		/*
		*	Generate the FB Like button
		*/
		if(FB) FB.XFBML.parse(fbContainer);

		articleId = fb = fbContainer = url = null;

	},
	initFacebook: function() {
		/*
		*	Hook from Facebook's fbAsyncInit function. Fired once the FB library has loaded
		*/
		FB.Event.subscribe('edge.create', this.eventEdgeCreate.bind(this));
		FB.Event.subscribe('edge.remove', this.eventEdgeRemove.bind(this));
		FB.Event.subscribe('message.send', this.eventMessageSend.bind(this));
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
	},
	eventMessageSend: function(href, widget) {
		/*
		*	@description:
		*		Method hook from Facebook Send action (message.send).
		*/
		_gaq.push(['_trackEvent', 'Facebook', 'Message', href, null]);
	}
});
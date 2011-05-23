RIA.Facebook = new Class({
	generateLike: function(article) {
		/*
		*	@description:
		*		Generate a Facebook Like Button (once only) for an Article	
		*/
		
		var id = article.get("id"), 
		l = document.id(document.createElement("fb:like")), 
		c = new Element("span", {"class":"facebook-like"}), 
		u = article.get("data-url"),
		s = article.getElement(".social");

		l.set({
			"href":u,
			"layout":"button_count",
			"show_faces":"false",
			"send":"true",
			"width":150,
			"height":80,
			"font":"arial",
			"ref":"a-to-z-mcdonalds-"+id
		}).inject(c);

		c.inject(s,"bottom");
	
		/*
		*	Generate the FB Like button
		*/
		if(FB) FB.XFBML.parse(c);

		id = l = c = u = s = null;

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
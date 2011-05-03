RIA.Facebook = new Class({
	generateLikeButton: function(article) {
		/*
		*	@description:
		*		Generate a Facebook Like Button (once only) for an Article	
		*/
		if(!article.getElement("p.facebook-like")) {
			
			var articleId = article.get("id"), fb, fbContainer = new Element("p", {"class":"facebook-like"});

			fb = document.createElement("fb:like");
			fb.setAttribute("href","http://a-z-campaign.appspot.com/"+articleId);
			fb.setAttribute("show_faces",false);
			fb.setAttribute("width",450);
			fb.setAttribute("height",80);
			fb.setAttribute("font","arial");
			fb.setAttribute("ref","a-to-z-mcdonalds-"+articleId);
			
			fbContainer.appendChild(fb);
			fbContainer.inject(article.getElement("nav"),"bottom");
			
			/*
			*	Generate the FB Like button
			*/
			FB.XFBML.parse(fbContainer);

			articleId = fb = fbContainer = null;
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
		this.GA_trackEvent('Facebook', 'Like', href, null);
	},
	eventEdgeRemove: function(href, widget) {
		/*
		*	@description:
		*		Method hook from Facebook Unlike action (edge.remove).
		*/
		this.GA_trackEvent('Facebook', 'Unlike', href, null);
	}
});
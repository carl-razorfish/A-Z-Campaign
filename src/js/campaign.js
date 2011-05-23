/*
*	@description: 	The main Campaign Class
*	@version: 		3
*	@author: 		Stuart Thorne
*/
RIA.AZCampaign = new Class({
	Implements:[
		Options,
		RIA.Facebook,
		RIA.Twitter,
		RIA.EventListeners,
		RIA.Movie
	],
	options:{
		binaryGIF:"data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
		alpha:null,
		categories:null,
		category:null,
		eventTypes:{
			"touchstart":"Touch",
			"click":"Mouse",
			"keyup":"Keyboard"
		}
	},
	initialize: function(options, init) {
		try {
			this.setOptions(options);

			document.getElement("body").addClass("js");
		
			if(Browser.Platform.ios) {
				this.iOSAlphabetMenu = document.id("alpha-menu");
				this.iOSAlphabet = document.id("alphabet-ios");
				this.iOSAlphabet.setStyle("display","block");
				document.id("alphabet").setStyle("display","none");				
			}
					
			this.articles = document.getElements("article");
			this.navigation = document.getElements("#navigation a");
			this.navPanel = document.id("navigation");
			this.shellWidth = document.id("shell").getWidth();
			this.headerH1 = document.getElement("h1");
		
			this.navOffsetTop = this.navPanel.offsetTop;
			this.navAlphabetHeight = document.id("alphabet").getSize().y;
		
			// [ST]TODO: manual increase here, as the vertical offset doesn't quite prevent the bottom of fact content hidden beneath the top nav from being loaded
			this.scrollVerticalOffset = this.navPanel.getSize().y;
		
			this.headerH1Offset = this.headerH1.getSize().y;
		
			this.getContentInViewport();
		
			this.scrollFx = new Fx.Scroll(window, {
				offset: {y: -this.scrollVerticalOffset}, // the -y negative offset here means that the Article content won't scroll behind the Category navigation which is fixed to the top of the viewport
				duration:1000,
				transition:"sine:in:out",
				link:"cancel", // linking is set to cancel, so that if a new scroll action is requested by the user any current scroll action is cancelled immediately
				onStart: function(e) {
					this.addPinNavEventListener();
					this.removeScrollEventListener();
				}.bind(this),
				onComplete: function(e) {
					this.getContentInViewport({trackScroll:false});
					this.addScrollEventListener();
					this.removePinNavEventListener();
				}.bind(this),
				onCancel: function(e) {
					this.getContentInViewport({trackScroll:false});
					this.addScrollEventListener();
					this.removePinNavEventListener();
				}.bind(this)
			});
		
			/*
			*	If we've linked from an Article only page, we may have a hash.
			*	The hash will hide the top of the content behind the nav, however, so scroll to it.
			*	This problem won't occur with JavaScript enabled, as the page will jump to the appropriate content using the hash anchor
			*/
		
			if(window.location.hash) {
				this.scrollToArticle(document.id(window.location.hash.substring(1)));
			}
		
			this.addEventListeners();

		} catch(e) {
			Log.error({method:"RIA.AZCampaign v3 : initialize() : Error : ", error:e});
		}
	},
	pinNavPanel: function(gotViewport) {
		/*
		*	@description:
		*		Pin the Nav Panel x coordinate, in case the window has been resized along the x axis
		*		Pin the Nav Panel y coordinate, in case the window has scrolled such that the H1 header is out of view
		*		[ST]TODO: we only need to call this function once, under 2 conditions; if the viewport.scrollTop is less than the H1 height when scrolling up, or vice versa
		*	@arguments:
		*		gotViewport[Boolean]: If this method has been called from getContentInViewport(), for example, we will have just got the viewport dimensions. 
		*			Therefore do not cause an unnecessary DOM lookup
		*/

		if(!gotViewport) {
			this.viewport = window.getSize(); 
			this.scrollTop = window.getScroll().y;
		}
		
		// [ST] TODO: we have a hard-coded pixel adjustment value here
		if(this.viewport.x > this.shellWidth) {
			this.navPanel.setStyle("left",((this.viewport.x - this.shellWidth) / 2)-30+"px");
		}
		
		if(this.scrollTop <= this.headerH1Offset) {
			if(!Browser.Platform.ios) this.navPanel.setStyle("top",this.headerH1Offset-this.scrollTop+"px");
			//[ST]TODO: hide nav cutoff

		}
		else if(this.scrollTop > this.headerH1Offset) {
			if(!Browser.Platform.ios) this.navPanel.setStyle("top","0px");
			//[ST]TODO: show nav cutoff

		}

	},
	getContentInViewport: function(eventObj) {
		/*
		*	@description:
		*		Establish which content is visible in the viewport		
		*/
		if(Browser.ie) {
			//alert("getContentInViewport("+referrer+")");
		} else {
			Log.info("getContentInViewport("+referrer+")");
		}
		this.viewport = window.getSize();
		this.scrollTop = window.getScroll().y;
		var articleCoords;
		
		this.pinNavPanel(true);
		
		this.articles.each(function(article) {
			articleCoords = article.getCoordinates();
			
			/*
			if(Browser.ie) {
				alert("article top : "+articleCoords.top+", viewport.y.scrollTop : "+(this.viewport.y+this.scrollTop)+", article bottom : "+articleCoords.bottom+", vert offset : "+(this.scrollTop+this.scrollVerticalOffset))
			}
			*/
				
			// If the Article is not in the viewport... [ST]TODO: adjust the second condition for the top nav, as Fact article content bottom may be hidden behind the nav but considered "in view"
			if((articleCoords.top >= this.viewport.y+this.scrollTop) || (articleCoords.bottom <= (this.scrollTop+this.scrollVerticalOffset))) {
			
				
				article.store("inviewport",false);
				
			} 
			else {
				/*
				*	If the Article is not recorded as being in the viewport, load the Article (once) and track it (once)
				*/

				if(!article.retrieve("inviewport") || article.retrieve("inviewport") == false) {
					article.store("inviewport",true);
					
					if(!article.retrieve("loaded") || article.retrieve("loaded") == false) {
						this.loadArticle(article);
						article.store("loaded",true);
					}
				
					Log.info("getContentInViewport() : Tracking page view for article "+article.get("id")+" : "+article.retrieve("inviewport"));
					_gaq.push(['_trackPageview', "/"+article.get("id")+"/scrolled"]);
					
					/*
					*	Only track a UI Scroll event if the user has manually scrolled, and not used the Fx.Scroll via the navigation
					*/
					if(!eventObj || eventObj.trackScroll != false) {
						_gaq.push(['_trackEvent', 'UI', 'Scroll', article.get("id").toUpperCase(), null]);
					}						
				}								
			}				
		},this);


		this.setNavPositionForiOs();
		
		articleCoords = null;
	},
	loadArticle: function(article) {
		/*
		*	@description:
		*		Load an Article
		*/
		
		Log.info("loadArticle("+article.get("id")+")");
		//if(Browser.ie) alert("loading article "+article.get("id"));
		
		//[ST]TODO: is this still required?
		article.removeClass("inactive");
		
		var c = article.getElement(".container"), 
		i = null, 
		s, 
		w, 
		h, 
		a, 
		ic = article.getElement(".content-image"),
		ib;
		
		if(ic) { 
			s = ic.get("data-main-src"),
			w = ic.get("data-main-width"),
			h = ic.get("data-main-height"),
			a = ic.get("data-alt"),
			ib = ic.getElement(".image-bg");
			
			ic.adopt(
				i = new Element("img", {
					"src":s,
					"width":w,
					"height":h,
					"alt":a,
					events:{
						"load": this.loadImage.pass([article],this)
					}
				})
			);

		}	
		
		this.generateLike(article);
		
		this.generateTweet(article);
		
		c = ic = ib = i = s = w = h = a = null;
	},
	loadImage: function(article) {
		
		//if(Browser.ie) alert("loadImage for "+article.get("id"));
		try {
			var ib = article.getElement(".image-bg");
			ib.removeClass("loading");		
			if(Browser.Platform.ios) {
				ib.addClass("-webkit-fade-out");
			} else {
				ib.set("morph", {duration:500});
				ib.morph({"opacity":0});					
			}
		} catch(e) {
			if(Browser.ie) alert("loadImage() error : "+e.message);
			Log.error({method:"loadImage()", error:e});
		}
	},
	filter: function(filter, eventType) {
		/*
		*	@description:
		*		Check to see if we have a category that matches the required filter
		*		Else check to see if we have an article that matches the required filter
		*/
		if(!filter) return;
		var element = document.id(filter);
		if(element) {
			this.scrollToArticle(element, eventType);
		}
		element = null;
	},
	scrollToArticle: function(articleElement, eventType) {
		/*
		*	@description:
		*		If the selected Alpha exists, scroll to it's top coordinate
		*/

		var articleId = articleElement.get("id"), articleCoords;

		/*
		*	Hide all Article content whilst we scroll. We switch back on the relevant content later...
		*/
		this.articles.each(function(art) {
			// hide the content for iOS only ??
		},this);
	
		/*
		*	Now get the Element Position, in case we have removed any CSS classes for filtered out content in filterInAll()
		*/
		articleCoords = articleElement.getCoordinates();
	
		/*
		*	Reset the Fx.Transition duration in case the chain has been cancelled and we are starting a new scroll
		*/
		this.scrollFx.options.duration = 1000;
		if(articleCoords.top < this.scrollTop) {
			this.scrollFx.options.duration += Math.floor(Math.PI*((this.scrollTop - articleCoords.top)/10));
		} else {
			this.scrollFx.options.duration += Math.floor(Math.PI*((articleCoords.top - this.scrollTop)/10));
		}
		/*
		*	Scroll to the selected Alpha
		*/
	
		this.scrollFx.stop().toElement(articleId, 'y');	
	
		_gaq.push(['_trackEvent', 'AlphabetNavigation', (this.options.eventTypes[eventType]||"Select"), articleId.toUpperCase(), null]);
			
		articleId = articleCoords = null;
	},
	setNavPositionForiOs: function() {
		/*
		*	@description:
		*		For Apple iOS (Safari Webkit) only, reset the position of the navigation using webkitTransform
		*/
		return;
		if(!Browser.Platform.ios) return;
		this.navPanel.style.webkitTransform = "translateY("+(this.navOffsetTop + this.scrollTop)+"px)";
	}
});
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
		fxDuration:{
			desktop:200,
			ios:800
		},
		binaryGIF:"data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
		alpha:null,
		categories:null,
		category:null,
		eventTypes:{
			"touchstart":"Touch",
			"click":"Mouse",
			"keyup":"Keyboard"
		},
		movie:{
			inView:false
		}
	},
	initialize: function(options, init) {
		try {
			this.setOptions(options);
			
			document.getElement("body").addClass("js");
		
			this.articles = document.getElements("article");
			this.navPanel = document.id("navigation");
			this.shellWidth = document.id("shell").getWidth();
			this.headerH1 = document.getElement("h1");
			this.youtubeLink = document.id("youtube-link");
			this.movieContainer = document.id("movie");
			
			this.generateTweet(this.movieContainer);
			this.generateLike(this.movieContainer);
			
			this.movieSWFContainer = document.id("movie-container");
			this.navOffsetTop = this.navPanel.offsetTop;
			this.navAlphabetHeight = document.id("alphabet").getSize().y;
		
			// [ST]TODO: manual increase here, as the vertical offset doesn't quite prevent the bottom of fact content hidden beneath the top nav from being loaded
			this.scrollVerticalOffset = -50;//this.navPanel.getSize().y;
		
			this.headerH1Offset = 112;//this.headerH1.getSize().y;
		
			this.articleImages = new Object();
			
			
			
			
			this.getContentInViewport();
		
			this.scrollFx = new Fx.Scroll(window, {
				offset: {y: this.scrollVerticalOffset}, // the -y negative offset here means that the Article content won't scroll behind the navigation which is fixed to the top of the viewport
				duration:(Browser.Platform.ios ? this.options.fxDuration.ios : this.options.fxDuration.desktop),
				transition:"sine:in:out",
				link:"cancel", // linking is set to cancel, so that if a new scroll action is requested by the user any current scroll action is cancelled immediately
				onStart: function(e) {
					this.addPinNavEventListener();
					this.removeScrollEventListener();
				}.bind(this),
				onComplete: function(e) {
					this.getContentInViewport();
					this.addScrollEventListener();
					this.removePinNavEventListener();
				}.bind(this),
				onCancel: function(e) {
					this.getContentInViewport();
					this.addScrollEventListener();
					this.removePinNavEventListener();
				}.bind(this)
			});
		
			this.addEventListeners();
			//this.loadMovie();
			
		} catch(e) {
			if(Browser.ie) {
				alert("initialize() error : "+e.message);
			}
			Log.error({method:"initialize() : Error : ", error:e});	
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
		try {
			if(!gotViewport) {
				this.getViewport();
			}

			if(!Browser.ie6 && (this.viewport.x > this.shellWidth)) {
				this.navPanel.setStyle("left",((this.viewport.x - this.shellWidth) / 2)+"px");
			}
		
			if(this.scrollTop <= this.headerH1Offset) {
				if(Browser.Platform.ios) {
					this.setNavPositionForiOs(0);
				} else {
					this.navPanel.setStyle("top",this.headerH1Offset-this.scrollTop+"px");
				}

	            this.navPanel.removeClass("scroll");
				
			}
			else if(this.scrollTop > this.headerH1Offset) {
				if(Browser.Platform.ios) {
					this.setNavPositionForiOs(112);
				} 
				else if(Browser.ie6) {
					this.navPanel.setStyle("top",this.scrollTop+"px");
				}
				else {
					this.navPanel.setStyle("top","0px");
				}
			
				this.navPanel.addClass("scroll");
			}
		} catch(e) {
			if(Browser.ie) alert("pinNavPanel() error : "+e.message);
			Log.error({method:"pinNavPanel() : Error : ", error:e});	
		}
	},
	getContentInViewport: function(eventObj) {
		/*
		*	@description:
		*		Establish which content is visible in the viewport		
		*/
		try {
			this.getViewport();
		
			var articleCoords;
		
		
			this.pinNavPanel(true);
		
		
			this.articles.each(function(article) {
				articleCoords = article.getCoordinates();
				// If the Article is not in the viewport... [ST]TODO: adjust the second condition for the top nav, as Fact article content bottom may be hidden behind the nav but considered "in view"
				if((articleCoords.top >= this.viewport.y+this.scrollTop) || (articleCoords.bottom <= (this.scrollTop+this.scrollVerticalOffset))) {
					article.store("inviewport",false);
				} else {
					/*
					*	If the Article is not recorded as being in the viewport, load the Article (once) and track it (once)
					*/

					if(!article.retrieve("inviewport") || article.retrieve("inviewport") == false) {
						article.store("inviewport",true);
					
						if(!article.retrieve("loaded") || article.retrieve("loaded") == false) {
							this.loadArticle(article);
							article.store("loaded",true);
						}
						/*
						*	MCDCOUK-1787[ST]: Do not track an additional page view when we are on a fact page, as it is duplication
						*/
						if(!this.options.alpha || this.options.alpha == "") {
							//Log.info("_trackPageview("+article.get("id")+"/scrolled)");
							_gaq.push(['_trackPageview', "/"+article.get("id")+"/scrolled"]);
						}
					
					}								
				}				
			},this);

			articleCoords = null;
		} catch(e) {
			if(Browser.ie) alert("getContentInViewport() error : "+e.message);
			Log.error({method:"getContentInViewport() : Error : ", error:e});	
		}
	},
	loadArticle: function(article) {
		/*
		*	@description:
		*		Load an Article
		*/
		try {
			var ic = article.getElement(".content-image");
		
			if(ic) { 
				ic.adopt(this.createImage(article));
			}	
		
			this.generateTweet(article);
		
			ic = null;
		} catch(e) {
			if(Browser.ie) alert("loadArticle() error : "+e.message);
			Log.error({method:"loadArticle() : Error : ", error:e});	
		}
	},
	createImage: function(article) {
		try {
			var ic = article.getElement(".content-image"),
			s = ic.get("data-main-src"),
			w = ic.get("data-main-width"),
			h = ic.get("data-main-height"),
			a = ic.get("data-alt"),
			i = null;
		
		
			return i = new Element("img", {
				"src":s,
				"width":w,
				"height":h,
				"alt":a,
				events:{
					"load": this.loadImage.pass([article],this)
				}
			});
		} catch(e) {
			if(Browser.ie) alert("createImage() error : "+e.message);
			Log.error({method:"createImage() : Error : ", error:e});	
		}
	},
	loadImage: function(article) {
		try {
			var ib = article.getElement(".image-bg"), ic = article.getElement(".content-image");

			ib.removeClass("loading");		
		    if(!Browser.ie) {
				if(Browser.Platform.ios) {
					/*
					*	[ST]TODO: the webkit fade is killing iPad and iPhone browser instances. Try deleting the element after the fade transition?
					*/
					//ib.addClass("-webkit-fade-out");
					ib.destroy();
					this.generateLike(article);
				} else {
					ib.set("morph", {fps:100, duration:200, onComplete: function() {
						this.generateLike(article);
					}.bind(this)});
					ib.morph({"opacity":0});							
				}				
			} else {
				ib.set("morph", {fps:100, duration:200, onComplete: function(){
					this.generateLike(article);
				}.bind(this)});
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
	scrollToArticle: function(article, eventType) {
		/*
		*	@description:
		*		If the selected Alpha exists, scroll to it's top coordinate
		*/

		var articleId = article.get("id"), articleCoords;
	
		/*
		*	Now get the Element Position, in case we have removed any CSS classes for filtered out content in filterInAll()
		*/
		articleCoords = article.getCoordinates();
	
		/*
		*	Reset the Fx.Transition duration in case the chain has been cancelled and we are starting a new scroll
		*/
		this.scrollFx.options.duration = (Browser.Platform.ios ? this.options.fxDuration.ios : this.options.fxDuration.desktop);
		if(articleCoords.top < this.scrollTop) {
			this.scrollFx.options.duration += Math.floor(Math.PI*((this.scrollTop - articleCoords.top)/10));
		} else {
			this.scrollFx.options.duration += Math.floor(Math.PI*((articleCoords.top - this.scrollTop)/10));
		}
		/*
		*	Scroll to the selected Alphabet Fact article
		*	If scrolling to "A", just go straight to the top of the Window
		*/
		if(article.get("id") == "a") {
			this.scrollFx.stop().toTop();
		} else {
			this.scrollFx.stop().toElement(articleId, 'y');	
		}
	
		_gaq.push(['_trackEvent', 'AlphabetNavigation', (this.options.eventTypes[eventType]||"Select"), articleId.toUpperCase(), null]);
			
		articleId = articleCoords = null;
	},
	setNavPositionForiOs: function(top) {
		/*
		*	@description:
		*		For Apple iOS (Safari Webkit) only, reset the position of the navigation using webkitTransform
		*/

		if(!Browser.Platform.ios) return;
		this.navPanel.style.webkitTransform = "translateY("+(this.scrollTop-top)+"px)";
	},
	getViewport: function() {
		try {
			this.viewport = window.getSize();
			this.scrollTop = window.getScroll().y;
			if(Browser.Platform.ios) { //&& window.devicePixelRatio != "undefined" && window.devicePixelRatio >= 2 ) {
				this.viewport.x = window.innerWidth;
				this.viewport.y = window.innerHeight
			}
		} catch(e) {
			if(Browser.ie) alert("getViewport() error : "+e.message);
			Log.error({method:"getViewport()", error:e});
		}
	}
});
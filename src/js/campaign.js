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
		RIA.Util,
		RIA.EventListeners,
		RIA.NavigationPanels
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
	initialize: function(options) {
		try {
			this.setOptions(options);
			document.getElement("body").addClass("js");
			
			this.articles = document.getElements("article");			
			this.navigation = document.getElements("#navigation, ul.categories");
			this.navPanel = document.id("navigation");
			this.shellWidth = document.id("shell").getWidth();
			this.headerH1 = document.getElement("h1");
			this.navOffsetTop = this.navPanel.offsetTop;
			this.navArticles = document.getElements("#navigation #alphabet a");
			this.navCategories = document.getElements("#navigation #categories a, article .categories a");
			
			this.navAll = document.getElements("#navigation a, article .categories a");
			
			this.navCategoryHeight = document.id("categories").getSize().y;
			this.navAlphabetHeight = document.id("alphabet").getSize().y;
			
			this.scrollVerticalOffset = this.navPanel.getSize().y;
			this.headerH1Offset = this.headerH1.getSize().y;
			
			this.getContentInViewport();
			
			this.scrollFx = new Fx.Scroll(window, {
				offset: {y: -this.scrollVerticalOffset}, // the -y negative offset here means that the Article content won't scroll behind the Category navigation which is fixed to the top of the viewport
				duration:1000,
				transition:"sine:in:out",
				link:"cancel", // linking is set to cancel, so that if a new scroll action is requested by the user any current scroll action is cancelled immediately
				onStart: function(e) {
					this.pinNavPanel();
					this.addPinNavEventListener();
					this.removeScrollEventListener();
				}.bind(this),
				onComplete: function(e) {
					this.scrollFx.options.duration = 1000;
					this.getContentInViewport({trackScroll:false});
					this.addScrollEventListener();
					this.removePinNavEventListener();
				}.bind(this),
				onCancel: function(e) {
					this.scrollFx.options.duration = 1000;
					this.getContentInViewport({trackScroll:false});
					this.addScrollEventListener();
					this.removePinNavEventListener();
				}.bind(this)
			});
			
			/*
			*	Don't add all event listeners if the Alpha Article & URL is present. Just add the resize event listener
			*/			
			if(!this.options.alpha || this.options.alpha == "") {
				this.addEventListeners();
			} else {
				window.addEvent("resize", this.onWindowResize.bind(this));
			}
			
			/*
			*	If we've linked from an Article only page, we will have a hash.
			*	The hash will hide the top of the content behind the nav, however, so scroll to it.
			*	This problem won't occur with JavaScript enabled, as the page will jump to the appropriate content using the hash anchor
			*/
			
			if(window.location.hash) {
				this.scrollToArticle(document.id(window.location.hash.substring(1)));
			}
			
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
		if(!gotViewport) this.viewport = this.getViewport();

		if(this.viewport.w > this.shellWidth) {
			this.navPanel.setStyle("left",((this.viewport.w - this.shellWidth) / 2)-35+"px");
		}
		
		if(this.viewport.scrollTop <= this.headerH1Offset) {
			this.navPanel.setStyle("top",this.headerH1Offset-this.viewport.scrollTop+"px");
			this.navPanel.getElement('.shadow').setStyle("display","none");
		}
		else if(this.viewport.scrollTop > this.headerH1Offset) {
			this.navPanel.setStyle("top","0px");
			this.navPanel.getElement('.shadow').setStyle("display","block");
		}

	},
	getContentInViewport: function(eventObj) {
		/*
		*	@description:
		*		Establish which content is visible in the viewport		
		*/
		
		this.viewport = this.getViewport();
		var articleCoords;
		
		this.pinNavPanel(true);
		
		this.articles.each(function(article) {
			articleCoords = article.getCoordinates();
			
			// If the Article is not in the viewport...
			if((articleCoords.top > this.viewport.h+this.viewport.scrollTop) || (articleCoords.bottom < this.viewport.scrollTop)) {
				
				// hide and unload content
				if(article.retrieve("inviewport")) {
					if(article.retrieve("filteredin") != false) {
						//this.handleContent(article, false);
					}
				}
				
				article.store("inviewport",false);
				
			} 
			else {
				/*
				*	If the Article is not recorded as being in the viewport, load the Article (once) and track it (once)
				*/

				if(article.retrieve("filteredin") != false) {
					this.loadArticle(article);
					/*
					*	[ST]TODO: we're essentially repeating ourselves here, do we need handleContent...? The NAV is not switching back on by just using loadArticle()
					*/
					
					if(!article.retrieve("inviewport") || article.retrieve("inviewport") == false) {
						//Log.info("getContentInViewport() : Tracking page view for article "+article.get("id")+" : "+article.retrieve("inviewport"));
						_gaq.push(['_trackPageview', "/"+article.get("id")+"/scrolled"]);
						
						/*
						*	Only track a UI Scroll event if the user has manually scrolled, and nto used the Fx.Scroll via the navigation
						*/
						if(!eventObj || eventObj.trackScroll != false) {
							_gaq.push(['_trackEvent', 'UI', 'Scroll', article.get("id").toUpperCase(), null]);
						}						
					}
				}
				
				article.store("inviewport",true);
				
				
				/*
				*	If the Article does not yet have a Facebook Like Button, generate one (once)
				*/
				if(!article.retrieve("likebutton:generated")) {
					this.generateLikeButton(article);
					article.store("likebutton:generated",true);
				}
				
				
				/*
				*	If the Article does not yet have a Twitter Tweet Button, generate one (once)
				*/
				if(!article.retrieve("tweetbutton:generated")) {
					this.generateTweetButton(article);
					article.store("tweetbutton:generated",true);
				}
				
								
			}				
		},this);


		this.setNavPositionForiOs();
		
		articlePosY = null;
	},
	loadArticle: function(article) {
		/*
		*	@description:
		*		Load an Article
		*/
		var c = article.getElement(".container"), 
		i = null, 
		s, 
		w, 
		h, 
		a, 
		ic = article.getElement(".content-image");
		
		if(ic) { 
			i = ic.getElement("img");
			s = ic.get("data-main-src"),
			w = ic.get("data-main-width"),
			h = ic.get("data-main-height"),
			a = ic.get("data-alt");
		
			/*
			*	If we do not yet have a main content image then create one
			*/
			if(!i) {
				ic.adopt(
					i = new Element("img", {
						"src":s,
						"width":w,
						"height":h,
						"alt":a
					})
				);
			}
		}

		if(!Browser.Platform.ios) {
			c.morph({'opacity':1});
		} else {
			c.setStyle('opacity',1);
		}	
		
		c = ic = i = s = w = h = a = null;
	},
	filter: function(filter, eventType) {
		/*
		*	@description:
		*		Check to see if we have a category that matches the required filter
		*		Else check to see if we have an article that matches the required filter
		*/
		if(this.options.keyCodes[filter]) {
			//Log.info("filter() : keyCode found : "+filter);
			this.filterByCategory(this.options.keyCodes[filter], eventType);
		}
		else if(this.options.categories[filter]) {
			//Log.info("filter() : category found : "+filter);
			this.filterByCategory(filter, eventType);
		}
		else if(document.id(filter)) {
			//Log.info("filter() : article found : "+filter);
			this.scrollToArticle(document.id(filter), eventType);
		}
	},
	scrollToArticle: function(articleElement, eventType) {
		/*
		*	If the selected Alpha exists (e.g. from keyboard onKeyUp, if the keyCode is valid)
		*/

		var articleId = articleElement.get("id"), articleCoords;

		/*
		*	Hide all Article content whilst we scroll. We switch back on the relevant content later...
		*/
		this.articles.each(function(art) {
			//this.handleContent(art, false);
		},this);
	
		/*
		*	If the selected Alpha is not a member of the currently selected category, then reset the menus 
		*/
		if(this.options.categories[this.options.category] && this.options.categories[this.options.category].indexOf(articleId) === -1) {
			
			this.articles.each(function(article) {
				article.removeClass("inactive");
				article.store("filteredin",true);
				
				article.setStyles({
					"display":"block",
					"height":article.getComputedSize().totalHeight
				});
				
			},this);

			this.setNavState("all");
		} 
		/*
		*	Now get the Element Position, in case we have removed any CSS classes for filtered out content in filterInAll()
		*/
		articleCoords = articleElement.getCoordinates();
	
		/*
		*	Reset the Fx.Transition duration in case the chain has been cancelled and we are starting a new scroll
		*/
		this.scrollFx.options.duration = 1000;
		if(articleCoords.top < this.viewport.scrollTop) {
			this.scrollFx.options.duration += this.velocityCurve(this.viewport.scrollTop, articleCoords.top);
		} else {
			this.scrollFx.options.duration += this.velocityCurve(articleCoords.top, this.viewport.scrollTop);
		}
		/*
		*	Scroll to the selected Alpha
		*/
	
		this.scrollFx.toElement(articleId, 'y');	
	
		_gaq.push(['_trackEvent', 'AlphabetNavigation', (this.options.eventTypes[eventType]||"Select"), articleId.toUpperCase(), null]);
			
		articleId = articleCoords = null;
	},
	filterByCategory: function(category, eventType) {
		/*
		*	@description:
		*		Filter content by Category
		*/

		/*
		*	If the User selects a category we are already on, do not apply transitions
		*/
		if(this.options.category === category) return;

		this.options.category = category;

		this.setNavState(this.options.category);
		
		/*
		*	For each of the Articles...
		*/
		this.articles.each(function(article, index) {
			/*
			*	If the Article ID is included in our Category Array, filter it in
			*/			
			if(this.options.categories[category].contains(article.get("id"))) {
				article.removeClass("inactive");
				if(this.navArticles[index]) this.navArticles[index].removeClass("inactive");
				article.reveal();
				article.store("filteredin",true);
			}				
			/*
			*	Else the Article ID is not included in our Category Array, so filter it out
			*/	
			else { 
				if(this.navArticles[index]) this.navArticles[index].addClass("inactive");
				article.dissolve();
				article.store("filteredin",false);
			}			
		},this);
	
		/*
		*	Reset any Window scroll position
		*/
		this.scrollFx.toTop();	

		
		/*
		*	Track the Category Navigation usage with GA
		*/
		_gaq.push(['_trackEvent', 'CategoryNavigation', (this.options.eventTypes[eventType]||"Select"), this.options.category, null]);
	},
	setNavPositionForiOs: function() {
		/*
		*	@description:
		*		For Apple iOS (Safari Webkit) only, reset the position of the navigation using webkitTransform
		*/
		if(!Browser.Platform.ios) return;
		this.navPanel.style.webkitTransform = "translateY("+(this.navOffsetTop + this.viewport.scrollTop)+"px)";
	}
});
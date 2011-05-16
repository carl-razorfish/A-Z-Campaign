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
			
			this.pinNavPanel();
			
			this.storeArticleData();
			
			this.getContentInViewport();
			
			this.scrollFx = new Fx.Scroll(window, {
				offset: {y: -this.scrollVerticalOffset}, // the -y negative offset here means that the Article content won't scroll behind the Category navigation which is fixed to the top of the viewport
				duration:1000,
				transition:"sine:in:out",
				link:"cancel", // linking is set to cancel, so that if a new scroll action is requested by the user any current scroll action is cancelled immediately
				onStart: function(e) {
					this.navPanel.setStyle("top","0px");
					this.removeScrollEventListener();
				}.bind(this),
				onComplete: function(e) {
					this.scrollFx.options.duration = 1000;
					this.getContentInViewport({trackScroll:false});
					this.addScrollEventListener();
				}.bind(this),
				onCancel: function(e) {
					this.scrollFx.options.duration = 1000;
					this.getContentInViewport({trackScroll:false});
					this.addScrollEventListener();
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
	pinNavPanel: function() {
		/*
		*	@description:
		*		Pin the Nav Panel x coordinate, in case the window has been resized along the x axis
		*/
		var viewportWidth = this.getViewportWidth();
		if(viewportWidth > this.shellWidth) {
			this.navPanel.setStyle("left",((viewportWidth - this.shellWidth) / 2)-35+"px");
		}
		viewportWidth = null;
	},
	storeArticleData: function() {
		/*
		*	@description:
		*		Store data against each Article
		*/
		try {
			this.articles.each(function(article){
				article.ria = {
					accordionFx: new Fx.Accordion(article.getElements('.question'), article.getElements('.answer'), {
	    				display: -1,
	    				alwaysHide: true,
						opacity: false,
						duration:500,
						onActive: function(toggler, handler) {
							toggler.addClass("open");
						},
						onBackground: function(toggler, handler) {
							toggler.removeClass("open");
						}
					})
				}
				
				article.set('reveal', {duration: 'long', link:'cancel'});
				
			},this);
		} catch(e) {
			Log.error({method:"RIA.AZCampaign : storeArticleData()", error:e});
		}
	},
	getContentInViewport: function(eventObj) {
		/*
		*	@description:
		*		Establish which content is visible in the viewport		
		*/
		var viewport = this.getViewport(), articleCoords;
	
		if(viewport.scrollTop <= this.headerH1.getSize().y) {
			this.navPanel.setStyle("top",this.headerH1.getSize().y-viewport.scrollTop+"px");
			this.navPanel.getElement('.shadow').setStyle("display","none");
		}
		else if(viewport.scrollTop > this.headerH1.getSize().y) {
			this.navPanel.setStyle("top","0px");
			this.navPanel.getElement('.shadow').setStyle("display","block");
		}
		this.articles.each(function(article) {
			articleCoords = article.getCoordinates();
			
			// If the Article is not in the viewport...
			if((articleCoords.top > viewport.h+viewport.scrollTop) || (articleCoords.bottom < viewport.scrollTop)) {
				
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
						Log.info("getContentInViewport() : Tracking page view for article "+article.get("id")+" : "+article.retrieve("inviewport"));
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
				}
				article.store("likebutton:generated",true);
				
				/*
				*	If the Article does not yet have a Twitter Tweet Button, generate one (once)
				*/
				if(!article.retrieve("tweetbutton:generated")) {
					this.generateTweetButton(article);
				}
				article.store("tweetbutton:generated",true);
								
			}				
		},this);


		this.setNavPositionForiOs();
		
		viewport = articlePosY = null;
	},
	loadArticle: function(article) {
		/*
		*	@description:
		*		Load an Article
		*/
		var container = article.getElement(".container"),
		mainImageContainer = article.getElement(".content-image");
		
		if(mainImageContainer) { 
			var mainImage = mainImageContainer.getElement("img"),
			mainImageSrc = mainImageContainer.get("data-main-src"),
			mainImageWidth = mainImageContainer.get("data-main-width"),
			mainImageHeight = mainImageContainer.get("data-main-height"),
			letterImageSrc = mainImageContainer.get("data-letter-src"),
			letterImageWidth = mainImageContainer.get("data-letter-width"),
			letterImageHeight = mainImageContainer.get("data-letter-height"),
			mainImageAlt = mainImageContainer.get("data-alt");
		
			/*
			*	If we do not yet have a main content image then create one
			*/
			if(!mainImage) {
				mainImageContainer.adopt(
					mainImage = new Element("img", {
						"src":mainImageSrc,
						"width":mainImageWidth,
						"height":mainImageHeight,
						"alt":mainImageAlt
					})
				);
				/*
				,
					letterImage = new Element("img", {
						"src":letterImageSrc,
						"width":letterImageWidth,
						"height":letterImageHeight,
						"alt":mainImageAlt
					})
				*/
			}
		}

		if(!Browser.Platform.ios) {
			container.morph({'opacity':1});
		} else {
			container.setStyle('opacity',1);
		}	
		
		//container = mainImageContainer = mainImage = mainImageSrc = mainImageWidth = mainImageHeight = mainImageAlt = null;
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
		try {
			var viewport = this.getViewport(), articleId = articleElement.get("id"), articleCoords;

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
			if(articleCoords.top < viewport.scrollTop) {
				this.scrollFx.options.duration += this.velocityCurve(viewport.scrollTop, articleCoords.top);
			} else {
				this.scrollFx.options.duration += this.velocityCurve(articleCoords.top, viewport.scrollTop);
			}
			/*
			*	Scroll to the selected Alpha
			*/
		
			this.scrollFx.toElement(articleId, 'y');	
		
			_gaq.push(['_trackEvent', 'AlphabetNavigation', (this.options.eventTypes[eventType]||"Select"), articleId.toUpperCase(), null]);
				
			viewport = articleId = articleCoords = null;
		} catch(e) {
			Log.error({method:"RIA.AZCampaign : scrollToArticle()", error:e});
		}
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
		*		For Apploe iOS (Safari Webkit) only, reset the position of the navigation using webkitTransform
		*/
		if(!Browser.Platform.ios) return;
		var yPos = (this.navOffsetTop + document.body.scrollTop), translateYCurrent = this.navPanel.style.webkitTransform.substring(11);
		translateYCurrent = translateYCurrent.replace("px)","");
		if(translateYCurrent == "") translateYCurrent = 0;
		this.navPanel.style.webkitTransform = "translateY("+yPos+"px)";
	}
});
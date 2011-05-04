RIA.AZCampaign = new Class({
	Implements:[
		Options,
		RIA.Facebook,
		RIA.Twitter,
		RIA.GA,
		RIA.Util,
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
			
			this.navOffsetTop = this.navPanel.offsetTop;
			this.navArticles = document.getElements("#navigation #alphabet a");
			this.navCategories = document.getElements("#navigation #categories a, article .categories a");
			
			this.navCategoryHeight = document.id("categories").getSize().y;
			
			this.pinNavPanel();
			
			this.storeArticleData();
			
			this.getContentInViewport();
			
			
			
			this.scrollFx = new Fx.Scroll(window, {
				offset: {y: -this.navCategoryHeight}, // the -y negative offset here means that the Article content won't scroll behind the Category navigation which is fixed to the top of the viewport
				duration:1000,
				transition:"sine:in:out",
				link:"cancel", // linking is set to cancel, so that if a new scroll action is requested by the user any current scroll action is cancelled immediately
				onStart: function(e) {
					this.removeScrollEventListener();
				}.bind(this),
				onComplete: function(e) {
					this.scrollFx.options.duration = 1000;
					this.getContentInViewport();
					this.addScrollEventListener();
					this.setNavPositionForiOs();
				}.bind(this),
				onCancel: function(e) {
					this.scrollFx.options.duration = 1000;
					this.getContentInViewport();
					this.addScrollEventListener();
					this.setNavPositionForiOs();
				}.bind(this)
			});
			
			/*
			*	Don't add any event listeners if the Alpha Article & URL is present
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
			Log.error({method:"RIA.AZCampaign : initialize() : Error : ", error:e});
		}
	},
	addEventListeners: function() {
		/*
		*	@description:
		*		Add all event listeners
		*/
		// Add mouse window resize event listener
		window.addEvent("resize", this.onWindowResize.bind(this));
		
		// Add mouse navigation event listener
		this.navigation.addEvent("click", this.mouseAndTouchNavigationEvent.bind(this));
		
		// Add keyboard navigation event listener
		document.addEvent("keyup", this.keyboardNavigationEvent.bind(this));
		
		// Add document scroll event listener
		this.addScrollEventListener();
	},
	keyboardNavigationEvent: function(e) {
		/*
		*	@description:
		*		Handle keyboard navigation.
		*	@conditions:
		*		This should only be available if we are in the "all" view, i.e. not just a single article selected. We determine this by checking to see if the 'alpha' option is available or not
		*		Only allow keyboard interaction if the command buttons are not in use
		*/
		if(!e.control && !e.shift && !e.meta && !this.options.alpha) {
			this.filter(e.key, e.type);
		}
	},
	addScrollEventListener: function() {
		/*
		*	@description:
		*		The scroll event listener is separated as we need to disable the onScroll event whilst scrolling to an element. Otherwise we'll constantly be checking content as we scroll
		*/
		this.getContentBind = this.getContentInViewport.bind(this);
		document.addEvent("scroll", this.getContentBind);
	},
	removeScrollEventListener: function() {
		/*
		*	@description:
		*		The scroll event listener is separated as we need to disable the onScroll event whilst scrolling to an element. Otherwise we'll constantly be checking content as we scroll
		*/
		document.removeEvent("scroll", this.getContentBind);
	},
	onWindowResize: function() {
		/*
		*	@description:
		*		Callback from the window onResize event listener
		*/
		this.pinNavPanel();
		this.getContentInViewport();
	},
	pinNavPanel: function() {
		/*
		*	@description:
		*		Pin the Nav Panel x coordinate, in case the window has been resized along the x axis
		*/
		var viewportWidth = this.getViewportWidth();
		if(viewportWidth > this.shellWidth) {
			this.navPanel.setStyle("left",((viewportWidth - this.shellWidth) / 2)+"px");
		}
		viewportWidth = null;
	},
	getContentInViewport: function() {
		/*
		*	@description:
		*		Establish which content is visible in the viewport		
		*/
		try {
			var viewport = this.getViewport(), articlePosY;
		
			this.articles.each(function(article) {
				articlePosY = article.getPosition().y;
				// If the Article is not in the viewport...
				if((articlePosY > viewport.h+viewport.scrollTop) || ((articlePosY+article.getSize().y) < viewport.scrollTop)) {
					article.store("inviewport",false);
				} 
				else {
					/*
					*	If the Article is not recorded as being in the viewport, load the Article (once) and track it (once)
					*/
					if(!article.retrieve("inviewport")) {
						this.loadArticle(article);
						this.GA_trackPageview("/"+article.get("id"), "scrolled");						
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

			viewport = articlePosY = null;
		} catch(e) {
			Log.error({method:"getContentInViewport()", error:e});
		}
	},
	loadArticle: function(article) {
		/*
		*	@description:
		*		Load an Article
		*/
		var container = article.getElement(".container"),
		header = article.getElement("h2"),
		letterImage = header.getElement("img"),
		mainImageContainer = article.getElement(".content-image"), 
		mainImage = mainImageContainer.getElement("img"),
		mainImageSrc = mainImageContainer.get("data-main-src"),
		mainImageWidth = mainImageContainer.get("data-main-width"),
		mainImageHeight = mainImageContainer.get("data-main-height"),
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
		}
		
		/*
		*	If we do not yet have a letter image then create one
		*/
		if(!letterImage) {		
			letterImage = new Element("img", {
				"src":header.get("data-src"),
				"width":header.get("data-width"),
				"height":header.get("data-height"),
				"alt":header.get("data-alt")
			}).inject(header, "top");
		}
	
		if(!Browser.Platform.ios) {
			container.morph({'opacity':1});
		} else {
			container.setStyle('opacity',1);
		}	
		
		container = mainImageContainer = mainImage = mainImageSrc = mainImageWidth = mainImageHeight = mainImageAlt = header = letterImage = null;
	},
	filter: function(filter, eventType) {
		/*
		*	@description:
		*		Check to see if we have a category that matches the required filter
		*		Else check to see if we have an article that matches the required filter
		*/
		try {
			if(this.options.keyCodes[filter]) {
				this.filterByCategory(this.options.keyCodes[filter], eventType);			
			} 
			else if(document.id(filter)) {
				this.scrollToArticle(document.id(filter), eventType);
			}
			article = null;
		} catch(e) {
			Log.error({method:"filter()", error:e});
		}
	},
	mouseAndTouchNavigationEvent: function(e) {
		/*
		*	@description:
		*		Add mouse and touch (iOS) event listeners	
		*/
		try {
			e.preventDefault();
			var target = e.targetTouches ? e.targetTouches[0].target : e.target;
			var targetCategory = target.getAttribute("data-category");

			if(targetCategory) {			
				this.filter(targetCategory, e.type);
			}
			target = targetCategory = null;
		} catch(e) {
			Log.error({method:"clickOrTouchNavigationEvent()", error:e});
		}
	},
	scrollToArticle: function(articleElement, eventType) {
		/*
		*	If the selected Alpha exists (e.g. from keyboard onKeyUp, if the keyCode is valid)
		*/
		try {
			var viewport = this.getViewport(), articleId = articleElement.get("id"), articlePos;

			/*
			*	Hide all Article content whilst we scroll. We switch back on the relevant content later...
			*/
			this.articles.each(function(art) {
				//art.addClass("inactive");
			},this);
		
			/*
			*	If the selected Alpha is not a member of the currently selected category, then reset the menus 
			*/
			if(this.options.categories[this.options.category] && this.options.categories[this.options.category].indexOf(articleId) === -1) {
				this.filterInAll();
				this.setCategoryNavState();
				this.setAlphaNavState("all");
			} 
			/*
			*	Now get the Element Position, in case we have removed any CSS classes for filtered out content in filterInAll()
			*/
			articlePos = articleElement.getPosition();
		
			/*
			*	Reset the Fx.Transition duration in case the chain has been cancelled and we are starting a new scroll
			*/
			this.scrollFx.options.duration = 1000;
			if(articlePos.y < viewport.scrollTop) {
				this.scrollFx.options.duration += this.velocityCurve(viewport.scrollTop, articlePos.y);
			} else {
				this.scrollFx.options.duration += this.velocityCurve(articlePos.y, viewport.scrollTop);
			}
			/*
			*	Scroll to the selected Alpha
			*/
		
			this.scrollFx.toElement(articleId, 'y');	
		
			this.GA_trackEvent('AlphabetNavigation', (this.options.eventTypes[eventType]||"Select"), articleId.toUpperCase(), null);
				
			articleElement = viewport = articleId = articlePos = null;
		} catch(e) {
			Log.error({method:"goToArticle()", error:e});
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
		try {
			if(this.options.category === category) return;

			this.options.category = category;
		
			this.setAlphaNavState();
		
			/*
			*	Set the Category navigation
			*/
			this.setCategoryNavState(category);
		
			/*
			*	For each of the Articles...
			*/
			this.articles.each(function(article, index) {
				article.removeClass("active").removeClass("inactive");
				/*
				*	If the Article ID is not included in our Category Array, filter it out
				*/				
				if(this.options.categories[category].indexOf(article.get("id")) === -1) {
					this.navArticles[index].addClass("inactive");
					this.filterFx(article, false, false);
					/*
					*	[ST]TODO: problem here with unloading category filtered content
					*/
					this.handleContent(article, false);
				}
				/*
				*	Else the Article ID is included in our Category Array, so filter it in
				*/
				else { 
					this.navArticles[index].removeClass("inactive");
					this.filterFx(article, true, false);
					/*
					*	[ST]TODO: problem here with loading category filtered content
					*/
					this.handleContent(article, true);
				}			
			},this);
		
			/*
			*	Reset any Window scroll position
			*/
			this.scrollFx.toTop();	
		
			/*
			*	Track the Category Navigation usage with GA
			*/
			this.GA_trackEvent('CategoryNavigation', (this.options.eventTypes[eventType]||"Select"), this.options.category, null);
			category = eventType = null;
		} catch(e) {
			Log.error({method:"filterByCategory()", error:e});
		}
	},
	filterFx: function(article, show, set) {
		/*
		*	@description:
		*		Apply a filter Fx against an Article
		*/
		try {
			if(show && set) {
				/*
				*	Set the height immediately, so we can scroll to that element and it will be there
				*/
				article.setStyle("overflow","");
				article.ria.filterFx.set({
					'height': article.ria.h,
				    'opacity': 1,
					'marginBottom':article.ria.marginBottom,
					'paddingTop':article.ria.paddingTop,
					'paddingBottom':article.ria.paddingBottom
				});
			} else {
				if(!show) {
					(function() {
						article.setStyle("overflow","");
					}).delay(1000);				
				} else {
					article.setStyle("overflow","hidden");
				}
			
				article.ria.filterFx.start({
					'height': (show ? article.ria.h : 0),
				    'opacity': (show ? 1 : 0),
					'marginBottom':(show ? article.ria.marginBottom : 0),
					'paddingTop':(show ? article.ria.paddingTop : 0),
					'paddingBottom':(show ? article.ria.paddingBottom : 0)
				});				
			}

		} catch(e) {
			Log.error({method:"filterFx()", error:e});
		}
	},
	storeArticleData: function() {
		/*
		*	@description:
		*		Store data against each Article
		*/
		try {
			this.articles.each(function(article){
				article.ria = {
					w:article.getSize().x,
					h:article.getSize().y,
					marginBottom:article.getStyle("marginBottom"),
					paddingTop:article.getStyle("paddingTop"),
					paddingBottom:article.getStyle("paddingBottom"),
					filterFx: new Fx.Morph(article, {
	   		 			duration: 500,
						link:"cancel",
			    		transition: "sine:in:out"
					}),
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
				if(article.hasClass("inactive")) {
					article.setStyle("height",0);
				}
			},this);
		} catch(e) {
			Log.error({method:"storeArticleData()", error:e});
		}
	},
	filterInAll: function() {
		/*
		*	@description:
		*		Shows all Alpha content immediately
		*/
		try {
			this.articles.each(function(article) {
				article.removeClass("active").removeClass("inactive");
				this.filterFx(article, true, true);
			},this);
		} catch(e) {
			Log.error({method:"filterInAll()", error:e});
		}
	},
	handleContent: function(article, show) {
		/*
		*	@description:
		*		Load the content, e.g. image, for a specific Article
		*/
		
		Log.info("handleContent");
		try {
			var container = article.getElement(".container"), nav = article.getElement("nav"), mainImageContainer = article.getElement(".content-image"), mainImage;
			mainImage = mainImageContainer.getElement("img");

			/*
			*	[ST]TODO: Depending on how large all of the content images are, we may not need to do UNloading
			*	[ST]TODO: If we do need unloading and lazy loading, add a load event for the image so that it is adopted once it's loaded
			*/

			if(show === true) {
				if(!mainImage) {
					mainImageContainer.adopt(
						mainImage = new Element("img", {
							"src":mainImageContainer.get("data-main-src"),
							"width":mainImageContainer.get("data-main-width"),
							"height":mainImageContainer.get("data-main-height"),
							"alt":mainImageContainer.get("data-alt")
						})
					);
				} else {
					mainImage.set("src",mainImageContainer.get("data-main-src"));
					mainImage.set("width",mainImageContainer.get("data-main-width"));
					mainImage.set("height",mainImageContainer.get("data-main-height"));
				}
			
				nav.setStyle('visibility','visible');
				
				if(!Browser.Platform.ios) {
					container.morph({'opacity':1});
				} else {
					container.setStyle('opacity',1);
				}	

				this.generateLikeButton(article);
				this.generateTweetButton(article);

			} else {
				if(container.getStyle("opacity") != 0) {
					container.setStyle('opacity',0);
				}
				if(nav.getStyle('visibility') != "hidden") {
					nav.setStyle('visibility','hidden');
				}
				if(mainImage) {
					if(mainImage.get("src") != this.options.binaryGIF) {
						Log.info("Unloading content image for article "+article.get("id"));
						mainImage.set("src",this.options.binaryGIF);
					}				
				}
			}
		
			container = nav = mainImage = mainImageContainer = null;
		} catch(e) {
			Log.error({method:"handleContent()", error:e});
		}
	},
	setNavPositionForiOs: function() {
		try {
			if(!Browser.Platform.ios) return;
			var yPos = (this.navOffsetTop + document.body.scrollTop), translateYCurrent = this.navPanel.style.webkitTransform.substring(11);
			translateYCurrent = translateYCurrent.replace("px)","");
			if(translateYCurrent == "") translateYCurrent = 0;
			this.navigationPanel.style.webkitTransform = "translateY("+yPos+"px)";
		} catch(e) {
			Log.error({method:"setNavPositionForiOs()", error:e});
		}
	}
});
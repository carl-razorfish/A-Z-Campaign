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
		keyCodes:{
			"65":"a","66":"b","67":"c","68":"d","69":"e","70":"f","71":"g","72":"h","73":"i","74":"j","75":"k","76":"l","77":"m","78":"n","79":"o","80":"p","81":"q",
			"82":"r","83":"s","84":"t","85":"u","86":"v","87":"w","88":"x","89":"y","90":"z"
		},
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
			this.navigationPanel = document.id("navigation");
			this.shell = document.id("shell");
			this.setNavigationPanelPosition();
			
			// we must set a local variable for the original navigation Element offsetTop. Later on we'll need to add this to current position of the nav
			this.navOffsetTop = this.navigationPanel.offsetTop;
			this.navArticles = document.getElements("#navigation #alphabet a");
			this.navCategories = document.getElements("#navigation #categories a, article .categories a");
			this.storeArticleData();
			
			this.scrollFx = new Fx.Scroll(window, {
				offset: {x: 0, y: -50}, // the y offset here means that the Article content won't scroll behind the Category navigation which is fixed to the top of the viewport
				duration:1000,
				transition:"sine:in:out",
				link:"cancel",
				onStart: function(e) {
					this.removeScrollGetContentListener();
				}.bind(this),
				onComplete: function(e) {
					this.scrollFx.options.duration = 1000;
					this.getContentWithinViewport();
					this.addScrollGetContentListener();
					this.setNavPositionForiOs();
				}.bind(this),
				onCancel: function(e) {
					this.scrollFx.options.duration = 1000;
					this.getContentWithinViewport();
					this.addScrollGetContentListener();
					this.setNavPositionForiOs();
				}.bind(this)
			});
			
			this.getContentWithinViewport();

			//	If we have received an alpha filter, then we are just showing that Article
			//	So, do not enable the event listeners	
			document.id("content").addEvents({
				"click": function(e) {
					if(e.target.hasClass("info")) {
						e.preventDefault();
						var parent = e.target.getParent("article");		
						if(parent.hasClass("questions")) {
							parent.removeClass("questions");
						} else {
							parent.addClass("questions");
						}
					}
				}.bind(this)
			});
			
			if(!this.options.alpha || this.options.alpha == "") {
				this.addEventListeners();
				this.addScrollGetContentListener();
			} else {
				window.addEvent("resize", this.windowResizeEvent.bind(this));
			}
			
			/*
			*	If we've linked from an Article only page, we will have a hash.
			*	The hash will hide the top of the content behind the nav, however, so scroll to it.
			*	This problem won't occur with JavaScript enabled, as the page will jump to the appropriate content using the hash anchor
			*/
			if(window.location.hash) {
				this.goToArticle(document.id(window.location.hash.substring(1)));
			}

		} catch(e) {
			Log.error({method:"RIA.AZCampaign : initialize() : Error : ", error:e});
		}
	},
	setNavigationPanelPosition: function() {
		try {
			var viewportWidth = this.getViewport().w, shellWidth = this.shell.getWidth();
			if(viewportWidth > shellWidth) {
				this.navigationPanelOffsetLeft = ((viewportWidth - shellWidth) / 2);
				this.navigationPanel.setStyle("left",this.navigationPanelOffsetLeft+"px");
			}		
		} catch(e) {
			Log.error({method:"setNavigationPanelPosition()", error:e});
		}
	},
	handleContent: function(article, show) {
		/*
		*	@description:
		*		Load the content, e.g. image, for a specific Article
		*/
		try {
			var container = article.getElement(".container"), nav = article.getElement("nav"), mainImageContainer = article.getElement(".content-image"), mainImage;
			

			/*
			*	[ST]TODO: Depending on how large all of the content images are, we may not need to do UNloading
			*	[ST]TODO: If we do need unloading and lazy loading, add a load event for the image so that it is adopted once it's loaded
			*/

			if(show === true) {
				if(mainImageContainer) {
					
					mainImage = mainImageContainer.getElement("img");
					
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
						//Log.info("Unloading content image for article "+article.get("id"));
						mainImage.set("src",this.options.binaryGIF);
					}				
				}
			}
		
			container = nav = mainImage = mainImageContainer = null;
		} catch(e) {
			Log.error({method:"handleContent()", error:e});
		}
	},
	storeArticleData: function() {
		try {
			this.articles.each(function(article){
				article.ria = {
					inView:false,
					w:Math.floor(parseFloat(article.getStyle("width"))),
					h:Math.floor(parseFloat(article.getStyle("height"))),
					marginBottom:article.getStyle("marginBottom"),
					paddingTop:article.getStyle("paddingTop"),
					paddingBottom:article.getStyle("paddingBottom"),
					filterFx: new Fx.Morph(article, {
	   		 			duration: 1000,
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
					/*
					*	[ST]TODO: Inactive Article elements do not appear to have the full, correct height set, apparently as the getStyle() method is not including HEADER and NAV elements in the calculation.
					*	So reset the Article height by including the HEADER and NAV element heights
					*	Not only is this ugly and unelegant, it's also a maintenance overhead - find a fix
					*/
					article.ria.h = (article.ria.h+Math.floor(parseFloat(article.getElement("header").getStyle("height")))+Math.floor(parseFloat(article.getElement("nav").getStyle("height"))));
					/*
					*	And then set it to zero ready for the first animation
					*/
					article.setStyle("height",0);
				}
			},this);
		} catch(e) {
			Log.error({method:"storeArticleData()", error:e});
		}
	},
	filterFx: function(article, show, set) {

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
	addEventListeners: function() {
		/*
		*	@description:
		*		Add event listeners
		*/
		try {
			this.navigation.addEvent("click", this.selectEvent.bind(this));
			// keep the onKeyUp event listener native, as we don't like Moo's extended features
			if(document.addEventListener) {
				document.addEventListener("keyup", this.keyboardEvent.bind(this), false);
			} else if(document.attachEvent) {
				document.attachEvent("keyup", this.keyboardEvent.bind(this), false);
			}
			window.addEvent("resize", this.windowResizeEvent.bind(this));
			if(Browser.Platform.ios) {	
				document.addEvent("scroll", this.setNavPositionForiOs.bind(this));			
			}
		} catch(e) {
			Log.error({method:"addEventListeners()", error:e});
		}
	},
	removeEventListeners: function() {
		try {
			this.navigation.removeEvents();
			this.removeScrollGetContentListener();
		} catch(e) {
			Log.error({method:"removeEventListeners()", error:e});
		}
	},
	addScrollGetContentListener: function() {
		try {
			this.getContentBind = this.getContentWithinViewport.bind(this);
			document.addEvent("scroll", this.getContentBind);
		} catch(e) {
			Log.error({method:"addScrollGetContentListener()", error:e});
		}
	},
	removeScrollGetContentListener: function() {
		try {
			document.removeEvent("scroll", this.getContentBind);
			this.getContentBind = null;
		} catch(e) {
			Log.error({method:"removeScrollGetContentListener()", error:e});
		}
	},
	keyboardEvent: function(e) {
		try {
			var target = e.target;
			if(!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey && !this.options.alpha) {
				/*
				*	DO NOT PREVENT DEFAULT KEYBOARD OPERATION
				*	Although we have filtered out the command keys, there may be specific User config
				*/
				this.filter(this.options.keyCodes[e.keyCode], e.type);
			}
			target = null;
		} catch(e) {
			Log.error({method:"keyboardEvent()", error:e});
		}
	},
	selectEvent: function(e) {
		try {
			e.preventDefault();
			var target = e.targetTouches ? e.targetTouches[0].target : e.target;
			var targetCategory = target.getAttribute("data-category");

			if(targetCategory) {			
				this.filter(targetCategory, e.type);
			}
			target = targetCategory = null;
		} catch(e) {
			Log.error({method:"selectEvent()", error:e});
		}
	},
	filter: function(filter, eventType) {
		/*
		*	@description:
		*		Check to see if we have a category that matches the required filter
		*		Else check to see if we have an article that matches the required filter
		*/
		try {
			var article = document.id(filter);
			if(this.options.categories[filter]) {
				this.filterByCategory(filter, eventType);			
			} 
			else if(article) {
				this.goToArticle(article, eventType);
			}
			article = null;
		} catch(e) {
			Log.error({method:"filter()", error:e});
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
	setCategoryNavState: function(filter) {
		/*
		*	@description:
		*		Handles the Category menu nav state
		*/
		try {
			this.navCategories.each(function(category) {
				category.removeClass("active").removeClass("inactive");
				if(category.get("data-category").test(filter)) category.addClass("active");
			},this);
		} catch(e) {
			Log.error({method:"setCategoryNavState()", error:e});
		}
	},
	setAlphaNavState: function(filter) {
		/*
		*	@description:
		*		Handles the Alpha menu nav state
		*/
		try {
			this.navArticles.each(function(alpha) {
				if(filter == "all") {
					alpha.removeClass("inactive").addClass("active");
				}
				else if(alpha.get("data-category").test(filter)){
					alpha.removeClass("inactive").addClass("active");
				} 
				else {
					alpha.removeClass("active").addClass("inactive");
				}
			},this);
		} catch(e) {
			Log.error({method:"setAlphaNavState()", error:e});
		}
	},
	goToArticle: function(articleElement, eventType) {
		/*
		*	If the selected Alpha exists (e.g. from keyboard onKeyUp, if the keyCode is valid)
		*/
		try {
			var viewport = this.getViewport(), articleId = articleElement.get("id"), articlePos;

			/*
			*	Hide all Article content whilst we scroll. We switch back on the relevant contnt later...
			*/
			this.articles.each(function(art) {
				this.handleContent(art, false);
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
	getScrollVelocity: function(y1, y2) {
		/*
		*	@description:
		*		We don't want a constant Fx.Transition time duration. This is because we could be scrolling from one letter to the next, or from A to Z, for example
		*		and the scroll speed looks weird. So instead we'll slow the scroll speed down depending on the distance to travel.
		*		Calculate the pixel distance between the two y coordinates provided, and return a time curve for sine:in:out Fx.Transition
		*/
		try {
			return Math.floor(Math.PI*((y1 - y2)/10));
			y1 = y2 = null;
		} catch(e) {
			Log.error({method:"getScrollVelocity()", error:e});
		}
	},
	getContentWithinViewport: function() {
		try {
			var viewport = this.getViewport(),articlePos;
		
			this.articles.each(function(article) {
			
				articlePos = article.getPosition();
			
				var articleTop = articlePos.y, articleBottom = (articlePos.y+article.ria.h), required = false;
		
				/*
				*	This will check that any of the Article is in the viewport.
				*/
				while (articleTop < articleBottom) {
					articleTop+=10;
					if(articleTop >= viewport.scrollTop && articleTop <= (viewport.scrollTop+viewport.h)) {
						required = true;					
						break;
					}
				}
		
				if(required) {
					this.articleIsInView(article);
				} else {				
					this.articleIsNotInView(article);
				}

				articleTop = articleBottom = required = null;
			},this);

			viewport = articlePos = null;
		} catch(e) {
			Log.error({method:"getContentWithinViewport()", error:e});
		}
	},
	articleIsInView: function(article) {
		/*
		*	We may have scrolled via a Category selection, so although the article may be in view it may be hidden
		*	Check the height of the Article to see if it's greater than 50 px (TODO: find a robust way to handle this), if it is we show and track the content
		*/
		try {
			if(!article.ria.inView) {
				var floatHeight = parseFloat(article.getStyle("height")), articleId = article.get("id");
				if(floatHeight > 50) {
					this.handleContent(article, true);
					this.GA_trackEvent('UI', 'Scroll', articleId.toUpperCase(), null);
					this.GA_trackPageview("/"+articleId, "scrolled");
				}
				floatHeight = articleId = null;
				article.ria.inView = true;
			}
		} catch(e) {
			Log.error({method:"articleIsInView()", error:e});
		}
	},
	articleIsNotInView: function(article) {
		try {
			if(article.ria.inView) {
				this.handleContent(article, false);	
				article.ria.inView = false;	
			}
		} catch(e) {
			Log.error({method:"articleIsNotInView()", error:e});
		}
	},
	setNavPositionForiOs: function() {
		try {
			if(!Browser.Platform.ios) return;
			var yPos = (this.navOffsetTop + document.body.scrollTop), translateYCurrent = this.navigationPanel.style.webkitTransform.substring(11);
			translateYCurrent = translateYCurrent.replace("px)","");
			if(translateYCurrent == "") translateYCurrent = 0;
			this.navigationPanel.style.webkitTransform = "translateY("+yPos+"px)";
		} catch(e) {
			Log.error({method:"setNavPositionForiOs()", error:e});
		}
	},
	windowResizeEvent: function() {
		/*
		*	@description:
		*		onResize event handler
		*/
		try {
			this.setNavigationPanelPosition();
			this.getContentWithinViewport();
		} catch(e) {
			Log.error({method:"windowResizeEvent()", error:e});
		}
	},
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
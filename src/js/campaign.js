RIA.AZCampaign = new Class({
	Implements:[Options],
	options:{
		binaryGIF:"data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
		alpha:null,
		categories:null,
		category:null,
		keyCodes:{
			"65":"a","66":"b","67":"c","68":"d","69":"e","70":"f","71":"g","72":"h","73":"i","74":"j","75":"k","76":"l","77":"m","78":"n","79":"o","80":"p","81":"q",
			"82":"r","83":"s","84":"t","85":"u","86":"v","87":"w","88":"x","89":"y","90":"z"
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
		var viewportWidth = RIA.Util.getViewport().w, shellWidth = this.shell.getWidth();
		if(viewportWidth > shellWidth) {
			this.navigationPanelOffsetLeft = ((viewportWidth - shellWidth) / 2);
			this.navigationPanel.setStyle("left",this.navigationPanelOffsetLeft+"px");
		}		
	},
	handleContent: function(article, showHide) {
		/*
		*	@description:
		*		Load the content, e.g. image, for a specific Article
		*/
		Log.info("handleContent("+article.get("id")+")");
		var container = article.getElement(".container"), nav = article.getElement("nav"), mainImageContainer = article.getElement(".content-image"), mainImage;
		mainImage = mainImageContainer.getElement("img");

		if(showHide === true) {
			if(!mainImage) {
				mainImageContainer.adopt(
					mainImage = new Element("img", {
						"src":mainImageContainer.get("data-main-src"),
						"width":mainImageContainer.get("data-main-width"),
						"height":mainImageContainer.get("data-main-height"),
						"alt":mainImageContainer.get("data-alt")
					})
				);
			}
			
			nav.setStyle('visibility','visible');
			mainImage.set("src",mainImageContainer.get("data-main-src"));
			mainImage.set("width",mainImageContainer.get("data-main-width"));
			mainImage.set("height",mainImageContainer.get("data-main-height"));
			if(!Browser.Platform.ios) {
				container.morph({'opacity':1});
			} else {
				container.setStyle('opacity',1);
			}	

			this.createFacebookLikeButton(article);
			this.createTwitterTweetButton(article);

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
		
	},
	storeArticleData: function() {
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
				*	So reset the Article height by including the HEADER and NAV elements
				*	Not only is this ugly and unlegant, it's also a maintenance overhead - find a fix
				*/
				article.ria.h = (article.ria.h+Math.floor(parseFloat(article.getElement("header").getStyle("height")))+Math.floor(parseFloat(article.getElement("nav").getStyle("height"))));
				/*
				*	And then set it to zero ready for the first animation
				*/
				article.setStyle("height",0);
			}
		},this);
	},
	filterFx: function(article, show, set) {
		
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
	},
	addEventListeners: function() {
		/*
		*	@description:
		*		Add event listeners
		*/
		
		this.navigation.addEvent("click", this.selectEvent.bind(this));
		// keep the onKeyUp event listener native, as we don't like Moo's extended features
		if(document.addEventListener) {
			document.addEventListener("keyup", this.keyboardEvent.bind(this), false);
		} else {
			document.attachEvent("keyup", this.keyboardEvent.bind(this), false);
		}
		window.addEvent("resize", this.windowResizeEvent.bind(this));
		if(Browser.Platform.ios) {	
			document.addEvent("scroll", this.setNavPositionForiOs.bind(this));			
		}
	},
	removeEventListeners: function() {
		this.navigation.removeEvents();
		this.removeScrollGetContentListener();
	},
	addScrollGetContentListener: function() {
		this.getContentBind = this.getContentWithinViewport.bind(this);
		document.addEvent("scroll", this.getContentBind);
	},
	removeScrollGetContentListener: function() {
		document.removeEvent("scroll", this.getContentBind);
		this.getContentBind = null;
	},
	keyboardEvent: function(e) {
		if(!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
			/*
			*	DO NOT PREVENT DEFAULT KEYBOARD OPERATION
			*	Although we have filtered out the command keys, there may be specific User config
			*/
			this.filter(this.options.keyCodes[e.keyCode]);
		}
	},
	selectEvent: function(e) {		
		e.preventDefault();
		var targetCategory = e.targetTouches ? e.targetTouches[0].target.getAttribute("data-category") : e.target.getAttribute("data-category");

		if(targetCategory) {			
			this.filter(targetCategory);
		}
		targetCategory = null;

	},
	filter: function(filter) {
		if(this.options.categories[filter]) {
			this.filterByCategory(filter);			
		} 
		else if(document.id(filter)) {
			this.goToArticle(document.id(filter));
		}
	},
	filterByCategory: function(category) {
		/*
		*	@description:
		*		Filter content by Category
		*/
		
		/*
		*	If the User selects a category we are already on, do not apply transitions
		*/
		if(this.options.category === category) return;

		this.setAlphaNavState();

		this.options.category = category;
		
		this.GA_trackEvent('CategoryNavigation', 'Select', this.options.category, null);
		
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
			}
			/*
			*	Else the Article ID is included in our Category Array, so filter it in
			*/
			else { 
				this.navArticles[index].removeClass("inactive");
				this.filterFx(article, true, false);
			}			
		},this);
		
		/*
		*	Reset any Window scroll position
		*/
		this.scrollFx.toTop();	
	},
	filterInAll: function() {
		/*
		*	@description:
		*		Shows all Alpha content immediately
		*/
		this.articles.each(function(article) {
			article.removeClass("active").removeClass("inactive");
			this.filterFx(article, true, true);
		},this);
	},
	setCategoryNavState: function(filter) {
		/*
		*	@description:
		*		Handles the Category menu nav state
		*/
		this.navCategories.each(function(category) {
			category.removeClass("active").removeClass("inactive");
			if(category.get("data-category").test(filter)) category.addClass("active");
		},this);
	},
	setAlphaNavState: function(filter) {
		/*
		*	@description:
		*		Handles the Alpha menu nav state
		*/
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
	},
	goToArticle: function(articleElement) {
		/*
		*	If the selected Alpha exists (e.g. from keyboard onKeyUp, if the keyCode is valid)
		*/
		var viewport = RIA.Util.getViewport(), articleId = articleElement.get("id"), articlePos;

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
		*	Create a velocity curve, based on distance to the required Alpha content
		*/
		/*
		*	Reset the Fx.Transition duration in case the chain has been cancelled and we are starting a new scroll
		*/
		this.scrollFx.options.duration = 1000;
		if(articlePos.y < viewport.scrollTop) {
			this.scrollFx.options.duration += this.getScrollVelocity(viewport.scrollTop, articlePos.y);
		} else {
			this.scrollFx.options.duration += this.getScrollVelocity(articlePos.y, viewport.scrollTop);
		}
		/*
		*	Scroll to the selected Alpha
		*/
		
		this.scrollFx.toElement(articleId, 'y');	
		
		this.GA_trackEvent('AlphabetNavigation', 'Select', articleId.toUpperCase(), null);
				
		articleElement = viewport = articleId = articlePos = null;
	},
	getScrollVelocity: function(a, b) {
		/*
		*	Calculate the pixel distance between the two y coordinates provided, and apply return a time curve for sine:in:out Fx.Transition
		*/
		return Math.floor(Math.PI*((a - b)/10));
		a = b = null;
	},
	getContentWithinViewport: function(event) {
		Log.info("getContentWithinViewport()");
		var viewport = RIA.Util.getViewport(),articlePos;
		
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
				
			articleTop = articleBottom = null;
		},this);
		
		viewport = articlePos = null;
	},
	articleIsInView: function(article) {
		/*
		*	We may have scrolled via a Category selection, so although the article may be in view it may be hidden
		*	Check the height of the Article to see if it's greater than 50 px (TODO: find a robust way to handle this), if it is we show and track the content
		*/
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
	},
	articleIsNotInView: function(article) {
		if(article.ria.inView) {
			this.handleContent(article, false);	
			article.ria.inView = false;	
		}
	},
	setNavPositionForiOs: function() {
		if(!Browser.Platform.ios) return;
		var yPos = (this.navOffsetTop + document.body.scrollTop), translateYCurrent = this.navigationPanel.style.webkitTransform.substring(11);
		translateYCurrent = translateYCurrent.replace("px)","");
		if(translateYCurrent == "") translateYCurrent = 0;
		this.navigationPanel.style.webkitTransform = "translateY("+yPos+"px)";
	},
	createFacebookLikeButton: function(article) {
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
			
			FB.XFBML.parse(fbContainer, function(){
				//Log.info("parsed fb:like button");
			}.bind(this));

			articleId = fb = fbContainer = null;
		}
	},
	createTwitterTweetButton: function(article) {
		if(!article.getElement("p.twitter-tweet")) {
			var articleId = article.get("id"), header = article.getElement("h2").get("text"), tw, twContainer = new Element("p", {"class":"twitter-tweet"}), tweetHash = article.get("data-tweet-hash");
			
			tw = new Element("a", {
				"href":"http://twitter.com/share",
				"class":"twitter-share-button",
				"data-lang":"en",
				"data-url":"http://a-z-campaign.appspot.com/"+articleId,
				"data-count":"none",
				"data-text":header+" "+tweetHash,
				"html":"Tweet"
			}).inject(twContainer);

			twContainer.inject(article.getElement("nav"),"bottom");
			
			var tweet_button = new twttr.TweetButton(tw);
			tweet_button.render();
			tweet_button = articleId = tw = twContainer = null;			
		}
	},
	windowResizeEvent: function() {
		this.setNavigationPanelPosition();
		this.getContentWithinViewport();
	},
	initFacebook: function() {
		/*
		*	Hook from fbAsyncInit
		*/
		FB.Event.subscribe('edge.create', this.FBEvent_EdgeCreate.bind(this));
		FB.Event.subscribe('edge.remove', this.FBEvent_EdgeRemove.bind(this));
	},
	FBEvent_EdgeCreate: function(href, widget) {
		/*
		*	@description:
		*		Method hook from Facebook Like action (edge.create).
		*/
		this.GA_trackEvent('Facebook', 'Like', href, null);
	},
	FBEvent_EdgeRemove: function(href, widget) {
		/*
		*	@description:
		*		Method hook from Facebook Unlike action (edge.remove).
		*/
		this.GA_trackEvent('Facebook', 'Unlike', href, null);
	},
	GA_trackEvent: function(category, action, label, value) {
		_gaq.push(['_trackEvent', category, action, label, value]);
		Log.info("GA_trackEvent() : "+category+" : "+action+" : "+label);
	},
	GA_trackPageview: function(url, action) {
		var path = url;
		if(action) path += ("/" + action);
		_gaq.push(['_trackPageview', path]);
		Log.info("GA_trackPageview() : "+path);
	}
});
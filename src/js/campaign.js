RIA.AZCampaign = new Class({
	Implements:[Options],
	options:{
		alpha:null,
		categories:null,
		category:null,
		filter:null,
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
				offset: {x: 0, y: -100}, // the y offset here means that the Article content won't scroll behind the Category navigation which is fixed to the top of the viewport
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
				}.bind(this)
			});
			
			this.navFX = new Fx.Tween(this.navigation, {
				fps:50,
				duration:1000,
				transition:"sine:in:out",
				link:"cancel"
			});

			this.getContentWithinViewport();

			/*
			*	If we have received an alpha filter, then we are just showing that Article
			*	So, do not enable the event listeners	
			*/
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
		} catch(e) {
			Log.info("RIA.AZCampaign : init() : Error : "+e.message)
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
		var container = article.getElement(".container"), nav = article.getElement("nav"), mainImage = article.getElement(".content-image img");
		
		if(showHide === true) {
			if(!article.getElement("iframe")) {
				this.createFacebookLikeButton(article);
			}
			nav.setStyle('visibility','visible');
			mainImage.set("src",mainImage.get("data-main-src"));
			if(!Browser.Platform.ios) {
				container.tween('opacity',1);
			} else {
				container.setStyle('opacity',1);				
			}	
			
		}
		else {
			container.setStyle('opacity',0);
			nav.setStyle('visibility','hidden');
			mainImage.set("src",mainImage.get("data-loading-src"));
		}
		
		container = nav = null;
		
	},
	storeArticleData: function() {
		this.articles.each(function(article){
			article.ria = {
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
				accordionFx: new Fx.Accordion($$('.question'), $$('.answer'), {
    				display: -1,
    				alwaysHide: true,
					opacity: false,
					duration:500
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
	filterFx: function(article, inOrOut, set) {
		
		if(inOrOut && set) {
			/*
			*	Set the height immediately, so we can scroll to that element and it will be there
			*/
			article.ria.filterFx.set({
				'height': article.ria.h,
			    'opacity': 1,
				'marginBottom':article.ria.marginBottom,
				'paddingTop':article.ria.paddingTop,
				'paddingBottom':article.ria.paddingBottom
			});
		} else {
			article.ria.filterFx.start({
			    'height': (inOrOut ? article.ria.h : 0),
			    'opacity': (inOrOut ? 1 : 0),
				'marginBottom':(inOrOut ? article.ria.marginBottom : 0),
				'paddingTop':(inOrOut ? article.ria.paddingTop : 0),
				'paddingBottom':(inOrOut ? article.ria.paddingBottom : 0)
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
		window.addEventListener("keyup", this.keyboardEvent.bind(this), false);
		window.addEvent("resize", this.windowResizeEvent.bind(this));	
		window.addEvent("scroll", this.setNavPosition.bind(this));			
	},
	removeEventListeners: function() {
		this.navigation.removeEvents();
		this.removeScrollGetContentListener();
	},
	addScrollGetContentListener: function() {
		this.getContentBind = this.getContentWithinViewport.bind(this);
		window.addEvent("scroll", this.getContentBind);
	},
	removeScrollGetContentListener: function() {
		window.removeEvent("scroll", this.getContentBind);
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
		*	If the selected Category filter matches one we have...
		*/
		this.setAlphaNavState();

		this.options.category = category;
		
		
		/*
		*	Set the Catrgory navigation
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
				this.handleContent(article, false);
				this.filterFx(article, false, false);
			}
			/*
			*	Else the Article ID is included in our Category Array, so filter it in
			*/
			else { 
				this.filterFx(article, true, false);
				this.handleContent(article, false);
				this.navArticles[index].removeClass("inactive");
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
			if(category.id.test(filter)) category.addClass("active");
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
			else if(alpha.id == "nav-alpha-"+filter){
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
		var viewport = RIA.Util.getViewport(),articlePos;
		
		this.articles.each(function(article) {
			articlePos = article.getPosition();
			/*
			*	This will check that the very top of the Article is inside the viewport.
			*	It will check that a large proportion of the Article is in the viewport, not just the top y position of the Article
			*	[ST]TODO: Ensure that we are loading/unloading when necessary, e.g. filtered out content should be uncloaded even though it's coordinates are within the viewport range
			*/
			if((articlePos.y >= viewport.scrollTop && articlePos.y <= (viewport.scrollTop+viewport.h)) || (((articlePos.y+article.ria.h) >= viewport.scrollTop) && (articlePos.y+article.ria.h) <= (viewport.scrollTop+viewport.h))) {
				this.handleContent(article, true);
			} else {
				this.handleContent(article, false);
			}
		},this);
		
		viewport = articlePos = null;
	},
	setNavPosition: function() {
		if(Browser.Platform.ios) {
			this.navFX.set("top",(this.navOffsetTop+document.body.scrollTop));
		}
	},
	createFacebookLikeButton: function(article) {
		if(!article.getElement("iframe")) {
			var articleId = article.get("id"),iframe;
			iframe = new Element("iframe", {
				"src":"http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fa-z-campaign.appspot.com/"+articleId+"&amp;layout=standard&amp;show_faces=true&amp;width=450&amp;action=like&amp;font&amp;colorscheme=light&amp;height=80&amp;ref=a-to-z-mcdonalds-"+articleId,
				"scrolling":"no",
				"frameborder":0,
				"allowTransparency":"true",
				"style":"border:none; overflow:hidden; width:450px; height:80px;"
			}).inject(article.getElement("nav"),"bottom");

		}
	},
	windowResizeEvent: function() {
		this.setNavigationPanelPosition();
		this.getContentWithinViewport();
	}
});
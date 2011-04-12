RIA.AZCampaign = new Class({
	Implements:[Options],
	options:{
		filter:null,
		scrollMultiplier:100, // milliseconds
		keyCodes:{
			"65":"a",
			"66":"b",
			"67":"c",
			"68":"d",
			"69":"e",
			"70":"f",
			"71":"g",
			"72":"h",
			"73":"i",
			"74":"j",
			"75":"k",
			"76":"l",
			"77":"m",
			"78":"n",
			"79":"o",
			"80":"p",
			"81":"q",
			"82":"r",
			"83":"s",
			"84":"t",
			"85":"u",
			"86":"v",
			"87":"w",
			"88":"x",
			"89":"y",
			"90":"z"
		}
	},
	initialize: function(options) {
		try {
			this.setOptions(options);
			this.articles = document.getElements("article");			
			this.navigation = document.id("navigation");
			// we must set a local variable for the original nav offsetTop. Later on we'll need to add this to current position of the nav
			this.navOffsetTop = this.navigation.offsetTop;
			this.navAlpha = document.getElements("#navigation #alphabet a");
			this.navCategories = document.getElements("#navigation #categories a");
			this.storeArticleData();
			this.setInitialImageState();
			this.addEventListeners();
			this.addScrollGetContentListener();
			this.createNumericKeyCodes();
			
			this.scrollFx = new Fx.Scroll(window, {
				duration:1000,
				transition:"sine:in:out",
				link:"cancel",
				onStart: function(e) {
					this.removeScrollGetContentListener();
				}.bind(this),
				onComplete: function(e) {
					/*
					*	Reset the duration, in case is has changed velocity
					*/
					this.scrollFx.options.duration=1000;
					this.getContentWithinViewport();
					this.addScrollGetContentListener();
				}.bind(this)
			});
			
			this.navFX = new Fx.Tween(this.navigation, {
				fps:100,
				duration:700,
				transition:"sine:out",
				link:"chain"
			});
			
			this.getContentWithinViewport();
		} catch(e) {
			Log.info("RIA.AZCampaign : init() : Error : "+e.message)
		}
	},
	setInitialImageState: function() {
		/*
		*	@description:
		*		With JS enabled, we only want images currently within the visible viewport to be loaded
		*		Set all images to the loading state initially
		*/
		var contentImage;
		this.articles.each(function(article) {
			//Log.info(article.getPosition());
			contentImage = article.getElement(".content-image img");
			contentImage.set({
				"src":contentImage.get("data-loading-src"),
				"width":contentImage.get("data-loading-width"),
				"height":contentImage.get("data-loading-height"),
				"class":contentImage.get("data-loading-class")
			});
		},this);
		contentImage = null;
	},
	showContent: function(article) {
		/*
		*	@description:
		*		Load the content, e.g. image, for a specific Article
		*/
		article.ria.state = "loaded";
		//Log.info("Loaded Article "+article.get("id"));
		var contentImage = article.getElement(".content-image img");
		contentImage.set({
			"src":contentImage.ria.original.src,
			"width":contentImage.ria.original.w,
			"height":contentImage.ria.original.h
		}); 
		contentImage.removeClass("loading");
		
		contentImage = null;
	},
	hideContent: function(article){
		/*
		*	@description:
		*		Unload the content, e.g. image, for a specific Article
		*/
		article.ria.state = "unloaded";
		//Log.info("Unloaded Article "+article.get("id"));
		var contentImage = article.getElement(".content-image img");
		contentImage.set({
			"src":contentImage.get("data-loading-src"),
			"width":contentImage.get("data-loading-width"),
			"height":contentImage.get("data-loading-height")
		}); 
		contentImage.addClass("loading");	
		
		contentImage = null;
	},
	createNumericKeyCodes: function(){
		/*
		*	@description:
		*		Categories will be assigned a numeric value from a 1-based index.
		*		Because we can never be certain how many categories will exist, or the order of Category items
		*		we must programatically create the keyCode references.
		*		This assumes the JS this.options.categories Array is provided in the correct sort order by the Python web application
		*/
		var counter = 49; // start at keyCode 49 for number 1
		Object.each(this.options.categories, function(value,key) {
			this.options.keyCodes[""+counter] = key;
			counter++;
		},this);
		counter = null;
	},
	storeArticleData: function() {
		var contentImage;
		this.articles.each(function(article){
			contentImage = article.getElement("img");
			article.ria = {
				state:"unloaded",
				required:true,
				w:Math.floor(parseFloat(article.getStyle("width"))),
				h:Math.floor(parseFloat(article.getStyle("height"))),
				marginBottom:article.getStyle("marginBottom"),
				paddingTop:article.getStyle("paddingTop"),
				paddingBottom:article.getStyle("paddingBottom"),
				filterFx: new Fx.Morph(article, {
   		 			duration: 'long',
					link:"cancel",
		    		transition: "sine:in:out"
				})
			}
			contentImage.ria = {
				original:{
					src:contentImage.get("src"),
					w:contentImage.get("width"),
					h:contentImage.get("height")					
				}
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
		
		contentImage = null;
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
			this.hideContent(article);
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
		this.navigation.addEventListener("click", this.selectEvent.bind(this));		
		// keep the onKeyUp event listener native, as we don't like Moo's extended features
		window.addEventListener("keyup", this.keyboardEvent.bind(this), false);
		window.addEvent("resize", this.getContentWithinViewport.bind(this));	
		window.addEvent("scroll", this.setNavPosition.bind(this));	
	},
	addScrollGetContentListener: function() {
		this.getContentBind = this.getContentWithinViewport.bind(this);
		window.addEvent("scroll", this.getContentBind);
	},
	removeScrollGetContentListener: function() {
		window.removeEvent("scroll", this.getContentBind);
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
		if(e.target.getAttribute("data-category")) {
			e.preventDefault();
			this.filter(e.target.getAttribute("data-category"));
		}
	},
	filter: function(filter) {
		if(this.options.categories[filter]) {
			this.filterByCategory(filter);			
		} else {
			this.goToAlphabet(filter);
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
		if(this.options.categories[category]) {
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
					article.ria.required = false;
					this.filterFx(article, false, false);
				}
				/*
				*	Else the Article ID is included in our Category Array, so filter it in
				*/
				else { 
					article.ria.required = true;
					
					Log.info(article.get("id") + " : state : " + article.ria.state + " : required : " + article.ria.required);
					
					this.filterFx(article, true, false);
					document.id("nav-alpha-"+article.get("id")).addClass("active");
				}
				
			},this);
			
			/*
			*	Reset any Window scroll position
			*/
			this.scrollFx.toTop();
		}		
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
			category.removeClass("active");
			category.removeClass("inactive");
			if(category.id == "nav-category-"+filter) category.addClass("active");
		},this);
	},
	setAlphaNavState: function(filter) {
		/*
		*	@description:
		*		Handles the Alpha menu nav state
		*/
		this.navAlpha.each(function(alpha) {
			if(filter == "all") {
				alpha.removeClass("inactive");
				alpha.addClass("active");
			}
			else if(alpha.id == "nav-alpha-"+filter){
				alpha.removeClass("inactive");
				alpha.addClass("active");
			} 
			else {
				alpha.removeClass("active")
				alpha.addClass("inactive");
			}
		},this);
	},
	goToAlphabet: function(alpha) {
		/*
		*	If the selected Alpha exists (e.g. from keyboard onKeyUp, if the keyCode is valid)
		*/
		var viewport = RIA.Util.getViewport(), article = document.id(alpha);
		if(article) {
			/*
			*	If the selected Alpha is not a member of the currently selected category, then reset the menus 
			*/
			if(this.options.categories[this.options.category] && this.options.categories[this.options.category].indexOf(alpha) === -1) {
				this.filterInAll();
				this.setCategoryNavState();
				this.setAlphaNavState("all");
			} 
			/*
			*	Create a velocity curve, based on distance to the required Alpha content
			*/
			if(article.getPosition().y < viewport.scrollTop) {
				this.scrollFx.options.duration += Math.floor(Math.PI*((viewport.scrollTop - article.getPosition().y)/10));
			} else {
				this.scrollFx.options.duration += Math.floor(Math.PI*((article.getPosition().y - viewport.scrollTop)/10));
			}
			/*
			*	Scroll to the selected Alpha
			*/
			this.scrollFx.toElement(alpha, 'y');			
		}
		viewport = article = null;
	},
	getContentWithinViewport: function(event) {
		var viewport = RIA.Util.getViewport(),articlePos;
		//Log.info("getContentWithinViewport()");
		this.articles.each(function(article) {
			articlePos = article.getPosition();
			/*
			*	This will check that the very top of the Article is inside the viewport.
			*	It will check that a large proportion of the Article is in the viewport, not just the top y position of the Article
			*	[ST]TODO: Ensure that we are loading/unloading when necessary, e.g. filtered out content should be uncloaded even though it's coordinates are within the viewport range
			*/
			if((articlePos.y >= viewport.scrollTop && articlePos.y <= (viewport.scrollTop+viewport.h)) || (((articlePos.y+article.ria.h) >= viewport.scrollTop) && (articlePos.y+article.ria.h) <= (viewport.scrollTop+viewport.h))) {
				
				//Log.info(article.get("id") + " : state : " + article.ria.state + " : required : " + article.ria.required);

				if(article.ria.state != "loaded") this.showContent(article);				
			} else {

				this.hideContent(article);
			}
		},this);
		
		viewport = articlePos = null;
	},
	setNavPosition: function() {
		//Log.info("setNavPosition()");
		if(!Browser.Platform.ios) {
			if(this.navigation && this.navOffsetTop) this.navigation.style.top = this.navOffsetTop+document.body.scrollTop+"px";
		} else if(this.navFX && this.navOffsetTop) {
			this.navFX.start("top",(this.navOffsetTop+document.body.scrollTop));
		}
	}
});
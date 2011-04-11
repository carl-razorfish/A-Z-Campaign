RIA.AZCampaign = {
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
	init: function(obj) {
		try {
			if(obj) Object.merge(this.options, obj);
			this.articles = document.getElements("article");
			this.navigation = document.id("navigation");
			this.navAlpha = document.getElements("#navigation #alphabet a");
			this.navCategories = document.getElements("#navigation #categories a");
			this.storeArticleData();
			this.collectArticleTags();			
			this.addEventListeners();
			
			this.createNumericKeyCodes();
			
			this.scrollFX = new Fx.Scroll(window, {
				duration:1000,
				transition:"sine:in:out",
				link:"cancel"
			});
			
			/*
			*	if(this.options.filter && this.options.filter != "") this.filter(this.options.filter);
			*/
			
		} catch(e) {
			Log.info("RIA.AZCampaign : init() : Error : "+e.message)
		}
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
		this.articles.each(function(article){
			article.ria = {
				w:Math.floor(parseFloat(article.getStyle("width"))),
				h:Math.floor(parseFloat(article.getStyle("height"))),
				marginBottom:article.getStyle("marginBottom"),
				paddingTop:article.getStyle("paddingTop"),
				paddingBottom:article.getStyle("paddingBottom"),
				filterFx: new Fx.Morph(article, {
   		 			duration: 'long',
					link:"cancel",
		    		transition: Fx.Transitions.Sine.easeOut
				})
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
	collectArticleTags: function() {
		var articleTags = new Array(),articleId;
		
		/*
		*	For each of the Articles on the page...
		*/
		this.articles.each(function(article){
			/*
			*	Get the Article ID
			*/
			articleId = article.get("id");
			
			/*
			*	Get all of the data tags assigned to the Article, and split them by the pipe separator into an Array
			*/
			articleTags = article.getAttribute("data-tags").split("|");
			
			/*
			*	For each tag, assign the Article ID to the corresponding Tags Array
			*/
			Array.each(articleTags, function(tag) {
				/*
				*	Don't push the Article ID to the Tags Array if it's already indexed (already exists)
				*/
				if(this.options.categories[tag]) {
					this.options.categories[tag].include(articleId);
				}
			},this);
		},this);
		
		/*
		*	Clean up
		*/
		articleId = articleTags = null;
	},
	addEventListeners: function() {
		this.navigation.addEventListener("click", this.selectEvent.bind(this), false);
		
		window.addEventListener("keydown", function(e) {
			if(!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) this.filter(this.options.keyCodes[e.keyCode]);
		}.bind(this),false);
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
		*	If the selected Category filter matches one we have...
		*/
		this.setAlphaNavState();
		if(this.options.categories[category]) {
			this.scrollFX.toTop();
			this.setCategoryNavState(category);
			/*
			*	Reset any Window scroll position
			*/
			
			
			/*
			*	For each of the Articles...
			*/
			this.articles.each(function(article, index) {
				article.removeClass("active").removeClass("inactive");
				/*
				*	If the Article ID is not included in our Category Array, filter it out
				*/
				if(this.options.categories[category].indexOf(article.get("id")) === -1) {
					this.filterFx(article, false, false);
				}
				/*
				*	Else the Article ID is included in our Category Array, so filter it in
				*/
				else { 
					this.filterFx(article, true, false);
					document.id("nav-alpha-"+article.get("id")).addClass("active");
				}
				
			},this);
		}
		
		
	},
	filterInAll: function() {
		this.articles.each(function(article) {
			article.removeClass("active").removeClass("inactive");
			this.filterFx(article, true, true);
		},this);
	},
	setCategoryNavState: function(filter) {
		this.navCategories.each(function(category) {
			category.removeClass("active");
			category.removeClass("inactive");
			if(category.id == "nav-category-"+filter) category.addClass("active");
		},this);
	},
	setAlphaNavState: function(filter) {
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
		this.filterInAll();
		this.setCategoryNavState();
		this.setAlphaNavState("all");
		this.scrollFX.toElement(alpha, 'y');
	}
}
RIA.AZCampaign = {
	options:{
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
		if(obj) Object.merge(this.options, obj);
		this.articles = document.getElements("article");
		this.navigation = document.getElementById("navigation");
		this.storeArticleData();
		this.collectArticleTags();
		this.addEventListeners();
		this.createNumericKeyCodes();
		this.scrollFX = new Fx.Scroll(window, {
			duration:1000,
			transition:"sine:out",
			link:"chain"
		});
		if(this.options.filter && this.options.filter != "") this.filter(this.options.filter);
	},
	createNumericKeyCodes: function(){
		var counter = 49; // start at keyCode 49 for number 1
		Object.each(this.options.categories, function(value,key) {
			this.options.keyCodes[""+counter] = key;
			counter++;
		},this);
		counter = null;
		Log.info(this.options.keyCodes);
	},
	storeArticleData: function() {
		this.articles.each(function(article){
			article.ria = {
				id:article.getAttribute("id"),
				w:parseFloat(article.getStyle("width")),
				h:parseFloat(article.getStyle("height")),
				offsetTop:article.offsetTop,
				marginBottom:article.getStyle("marginBottom"),
				paddingTop:article.getStyle("paddingTop"),
				paddingBottom:article.getStyle("paddingBottom"),
				filterFx: new Fx.Morph(article, {
   		 			duration: 'long',
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
			articleId = article.getAttribute("id");
			
			/*
			*	Get all of the data tags assigned to the Article, and split them by the pipe separator into an Array
			*/
			articleTags = article.getAttribute("data-tags").split("|");
			
			/*
			*	For each tag, assign the Article ID to the corresponding Tags Array
			*/
			for(var j=0,m=articleTags.length; j<m; j++) {
				var currentTag = articleTags[j];
				/*
				*	Don't push the Article ID to the Tags Array if it's already indexed (already exists)
				*/
				if(this.options.categories[currentTag] && this.options.categories[currentTag].indexOf(articleId) === -1) {
					this.options.categories[currentTag].push(articleId)
				}
			}
		},this);
		/*
		*	Clean up
		*/
		i = l = articleId = articleTags = null;
	},
	addEventListeners: function() {
		this.navigation.addEventListener("click", this.selectEvent.bind(this), false);
		
		window.addEventListener("keydown", function(e) {
			if(!e.ctrlKey && !e.shiftKey && !e.altKey) this.filter(this.options.keyCodes[e.keyCode]);
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
		var articleId;
		
		/*
		*	If the selected Category filter matches one we have...
		*/
		if(this.options.categories[category]) {
			/*
			*	Reset any Window scroll position
			*/
			this.scrollFX.toTop();
			/*
			*	For each of the Articles...
			*/
			for(var i=0,l=this.articles.length; i<l; i++) {
				/*
				*	Get the Article ID
				*/
				articleId = this.articles[i].ria.id;
				/*
				*	If the Article ID is not included in our Category Array, filter it out
				*/
				if(this.options.categories[category].indexOf(articleId) === -1) {
					this.filterFx(this.articles[i],false)
				}
				/*
				*	Else the Article ID is included in our Category Array, so filter it in
				*/
				else { 
					this.filterFx(this.articles[i], true)				
				}
			}
		}
		i = l = articleId = null;
	},
	filterInAll: function() {
		for(var i=0,l=this.articles.length; i<l; i++) {
			this.filterFx(this.articles[i], true, true);
		}
		article = i = l = null;
	},
	goToAlphabet: function(alpha) {
		var article = document.getElementById(alpha);		
		if(article) {
			this.filterInAll();
			this.scrollFX.start(0,article.ria.offsetTop);
		}
		alpha = article = null;
	}
}
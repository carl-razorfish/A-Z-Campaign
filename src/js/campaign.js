RIA.AZCampaign = {
	options:{

	},
	init: function(obj) {
		if(obj) Object.merge(this.options, obj);
		this.articles = document.getElementsByTagName("article");
		this.navigation = document.getElementById("navigation");
		this.collectArticleTags();
		this.addEventListeners();
		if(this.options.filter && this.options.filter != "") this.filter(this.options.filter)
	},
	fxFilterOut: function(articleId) {
		var myEffect = new Fx.Morph(articleId, {
   		 	duration: 'long',
		    transition: Fx.Transitions.Sine.easeOut
		});
		myEffect.start({
		    'height': 0,
		    'opacity': 0
		});
	},
	fxFilterIn: function(articleId) {
		var myEffect = new Fx.Morph(articleId, {
   		 	duration: 'long',
		    transition: Fx.Transitions.Sine.easeOut
		});
		myEffect.start({
		    'height': 525,
		    'opacity': 1
		});
	},
	collectArticleTags: function() {
		var articleTags = new Array(),articleId;
		
		/*
		*	For each of the Articles on the page...
		*/
		for(var i=0,l=this.articles.length; i<l; i++) {
			/*
			*	Get the Article ID
			*/
			articleId = this.articles[i].getAttribute("id");
			
			/*
			*	Get all of the data tags assigned to the Article, and split them by the pipe separator into an Array
			*/
			articleTags = this.articles[i].getAttribute("data-tags").split("|");
			
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
		}
		/*
		*	Clean up
		*/
		i = l = articleId = articleTags = null;
	},
	addEventListeners: function() {
		this.navigation.addEventListener("click", this.selectEvent.bind(this), false);
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
		var articleId,children=new Array(),childTag;
		
		/*
		*	If the Category filtrer selected matches one we have...
		*/
		if(this.options.categories[category]) {
			/*
			*	Reset any Window scroll position
			*/
			window.scrollTo(0,0);
			/*
			*	For each of the Articles...
			*/
			for(var i=0,l=this.articles.length; i<l; i++) {
				/*
				*	Get the Article ID
				*/
				articleId = this.articles[i].getAttribute("id");
				/*
				*	If the Article ID is not included in our Category Array, filter it out
				*/
				if(this.options.categories[category].indexOf(articleId) === -1) {
					//this.articles[i].className = "filter-out";
					this.fxFilterOut(articleId)
				}
				/*
				*	Else the Article ID is included in our Category Array, so filter it in
				*/
				else { 
					this.filterInByCategory(this.articles[i], category);
					
				}
			}
		}
		i = l = articleId = children = null;
	},
	filterInByCategory: function(article, category) {
		var children,childTag;
		
		this.fxFilterIn(article)
		
		if(article.className === "filter-out") article.className = "filter-in";
		/*
		*	Get child Section elements
		*/
		children = article.getElementsByTagName("section");
		/*
		*	Iterate through the children to decide whether they should be displayed or not
		*/
		for(var i=0,l=children.length; i<l; i++) {
			childTag = children[i].getAttribute("data-tags");
			if(childTag === category) {
				children[i].style.display = "";
			} else {
				children[i].style.display = "none";
			}
		}
		i = l = children = childTag = article = category = null;
	},
	filterInAll: function(article) {
		var children = article.getElementsByTagName("section");
		for(var i=0,l=children.length; i<l; i++) {
			children[i].style.display = "";
		}
		chilren = article = i = l = null;
	},
	goToAlphabet: function(alpha) {
		var article = document.getElementById(alpha),posY;
		this.fxFilterIn(article)
		if(article) {
			this.filterInAll(article);
			if(article.className == "filter-out") article.className = "filter-in";
			posY = article.offsetTop;
			window.scrollTo(0,posY);
		}
		article = posY = null;
	}
}
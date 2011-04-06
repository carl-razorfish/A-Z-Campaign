RIA.AZCampaign = {
	options:{

	},
	init: function(obj) {
		if(obj) Object.merge(this.options, obj);
		this.articles = document.querySelectorAll("article");
		this.navigation = document.getElementById("navigation");
		this.collectArticleTags();
		this.addEventListeners();
		if(this.options.filter && this.options.filter != "") this.filter(this.options.filter)
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
		e.preventDefault();
		if(e.target.getAttribute("data-category")) {
			this.filterByCategory(e.target.getAttribute("data-category"));
		}
		else if(e.target.getAttribute("href")) {
			this.goToAlphabet(e.target.getAttribute("href"));
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
		
		this.updateWindowLocation(category);
		
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
					this.articles[i].className = "filter-out";
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
		this.updateWindowLocation(alpha);
		if(article) {
			this.filterInAll(article);
			if(article.className == "filter-out") article.className = "filter-in";
			posY = article.offsetTop;
			window.scrollTo(0,posY);
		}
		article = posY = null;
		
		
	},
	updateWindowLocation: function(urlPath) {
		//window.location.pathname = "/";
	}
}
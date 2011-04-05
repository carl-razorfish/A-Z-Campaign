RIA.AZCampaign = {
	options:{

	},
	init: function(obj) {
		if(obj) Object.merge(this.options, obj);
		this.articles = document.querySelectorAll("article");
		this.navigation = document.getElementById("navigation");
		this.collectArticleTags();
		this.addEventListeners();
		if(this.options.filter && this.options.filter != "") this.filterByTag(this.options.filter)
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
		Log.info(this.options.categories);
	},
	addEventListeners: function() {
		this.navigation.addEventListener("click", this.selectEvent.bind(this), false);
	},
	selectEvent: function(e) {
		var target = e.target,tag;
		if(target.getAttribute("href")) {
			tag = target.getAttribute("href").substring(1)
			this.filterByTag(tag);
		}
		target = tag = null;
	},
	filterByTag: function(category) {
		var articleId;
		if(this.options.categories[category]) {
			for(var i=0,l=this.articles.length; i<l; i++) {
				articleId = this.articles[i].getAttribute("id");
				if(this.options.categories[category].indexOf(articleId) === -1)
					this.articles[i].className = "filter-out";
				else if(this.articles[i].className == "filter-out") 
					this.articles[i].className = "filter-in";
			}
		}
		i = l = articleId = null;
	}
}
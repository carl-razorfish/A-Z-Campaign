RIA.NavigationPanels = new Class({
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
			Log.error({method:"RIA.NavigationPanels : setAlphaNavState()", error:e});
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
			Log.error({method:"RIA.NavigationPanels : setCategoryNavState()", error:e});
		}
	}
});
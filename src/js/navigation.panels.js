RIA.NavigationPanels = new Class({	
	setNavState: function(filter) {
		this.navAll.each(function(nav) {
			if(filter == "all") {
				this.options.category = "";
				if(["planet","food","people","community","london2012"].contains(nav.get("data-category"))) {
					nav.removeClass("active");
				} else {
					nav.removeClass("inactive").addClass("active");
				}
			}
			else if(nav.get("data-category") && nav.get("data-category").test(filter)){
				nav.removeClass("inactive").addClass("active");
			} 
			else {
				nav.removeClass("active").addClass("inactive");
			}
		},this);
	}
});
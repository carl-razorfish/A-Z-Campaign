RIA.EventListeners = new Class({
	addEventListeners: function() {
		/*
		*	@description:
		*		Add all event listeners
		*/
		// Add mouse window resize event listener
		window.addEvent("resize", this.onWindowResize.bind(this));
		
		// Add mouse navigation event listener
		this.navigation.addEvent("click", this.mouseAndTouchNavigationEvent.bind(this));
		
		// Add keyboard navigation event listener
		document.addEvent("keyup", this.keyboardNavigationEvent.bind(this));
		
		// Add Question & Answer select event listener
		document.id("content").addEvent("click",this.qandaEventListener.bind(this));
		
		// Add document scroll event listener
		this.addScrollEventListener();
	},
	addScrollEventListener: function() {
		/*
		*	@description:
		*		The scroll event listener is separated as we need to disable the onScroll event whilst scrolling to an element. Otherwise we'll constantly be checking content as we scroll
		*/
		this.getContentBind = this.getContentInViewport.bind(this);
		document.addEvent("scroll", this.getContentBind.pass([{trackScroll:true}],this));
	},
	removeScrollEventListener: function() {
		/*
		*	@description:
		*		The scroll event listener is separated as we need to disable the onScroll event whilst scrolling to an element. Otherwise we'll constantly be checking content as we scroll
		*/
		document.removeEvent("scroll", this.getContentBind);
	},
	qandaEventListener: function(e) {
		/*
		*	@description:
		*		Add event listener for the Question & Answer section 'reveal'
		*/
		if(e.target.hasClass("info")) {
			e.preventDefault();
			var parent = e.target.getParent("article");		
			if(parent.hasClass("questions")) {
				parent.removeClass("questions");
			} else {
				parent.addClass("questions");
			}
		}
	},
	mouseAndTouchNavigationEvent: function(e) {
		/*
		*	@description:
		*		Add mouse and touch (iOS) event listeners	
		*/
		e.preventDefault();
		var target = e.targetTouches ? e.targetTouches[0].target : e.target;
		var targetCategory = target.getAttribute("data-category");

		if(targetCategory) {
			this.filter(targetCategory, e.type);
		}
		target = targetCategory = null;
	},
	keyboardNavigationEvent: function(e) {
		/*
		*	@description:
		*		Handle keyboard navigation.
		*	@conditions:
		*		This should only be available if we are in the "all" view, i.e. not just a single article selected. We determine this by checking to see if the 'alpha' option is available or not
		*		Only allow keyboard interaction if the command buttons are not in use
		*/
		if(!e.control && !e.shift && !e.meta && !this.options.alpha) {
			this.filter(e.key, e.type);
		}
	},
	onWindowResize: function() {
		/*
		*	@description:
		*		Callback from the window onResize event listener
		*/
		this.pinNavPanel();
		this.getContentInViewport();
	}
});
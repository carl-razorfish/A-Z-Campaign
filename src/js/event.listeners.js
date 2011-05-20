RIA.EventListeners = new Class({
	addEventListeners: function() {
		/*
		*	@description:
		*		Add all event listeners
		*/
		// Add mouse window resize event listener
		window.addEvent("resize", this.onWindowResize.bind(this));
		
		// Add orientation change event listener
		window.addEvent("orientationchange", this.onOrientationChange.bind(this));
		
		// Add mouse & touch navigation event listener
		//this.navigation.addEvent("click", this.pointerEvent.bind(this));
		if(!this.options.alpha || this.options.alpha == "") {
			this.navPanel.addEvent("click", this.pointerEvent.bind(this));
		}
		
		// Add keyboard navigation event listener
		this.addKeyboardEventListeners();
		
		// Add document scroll event listener
		this.addScrollEventListener();
		
		// add movie launch event listener
		this.headerH1.addEvent("click", this.launchMovie.bind(this));
		
		
		if(this.iOSAlphabet && this.iOSAlphabetMenu) {
			this.iOSAlphabet.addEvent("touchstart", function(e) {
				this.iOSAlphabetMenu.swapClass("invisible","visible").focus();
			}.bind(this));
			this.iOSAlphabet.addEvent("click", function(e) {
				this.iOSAlphabetMenu.swapClass("invisible","visible").focus();
			}.bind(this));
			this.iOSAlphabetMenu.addEvent("change", this.iOSMenuEvent.bind(this));
		}
	},
	addKeyboardEventListeners: function() {
		/*
		*	@description:
		*		Add keyboard event listeners
		*/
		this.keyboardBind = this.keyboardEvent.bind(this);
		document.addEvent("keyup", this.keyboardBind);
	},
	removeKeyboardEventListeners: function() {
		/*
		*	@description:
		*		Remove keyboard event listeners
		*/
		document.removeEvent("keyup", this.keyboardBind);
		
	},
	addScrollEventListener: function() {
		/*
		*	@description:
		*		The scroll event listener is separated as we need to disable the onScroll event whilst scrolling to an element. Otherwise we'll constantly be checking content as we scroll
		*/
		this.getContentBind = this.getContentInViewport.bind(this);
		window.addEvent("scroll", this.getContentBind);
	},
	removeScrollEventListener: function() {
		/*
		*	@description:
		*		The scroll event listener is separated as we need to disable the onScroll event whilst scrolling to an element. Otherwise we'll constantly be checking content as we scroll
		*/
		window.removeEvent("scroll", this.getContentBind);
	},
	addPinNavEventListener: function() {
		/*
		*	@description:
		*		Evaluate the Nav Panel pinned position regardless of scroll of Fx.Scroll.
		*		Add this event only whilst we are using Fx.Scroll, and remove onComplete
		*/
		this.pinNavPanelBind = this.pinNavPanel.bind(this);
		window.addEvent("scroll", this.pinNavPanelBind);
	},
	removePinNavEventListener: function() {
		/*
		*	@description:
		*		Evaluate the Nav Panel pinned position regardless of scroll of Fx.Scroll.
		*		Add this event only whilst we are using Fx.Scroll, and remove onComplete
		*/
		window.removeEvent("scroll", this.pinNavPanelBind);
	},
	pointerEvent: function(e) {
		/*
		*	@description:
		*		Add mouse and touch (iOS) event listeners	
		*/
		e.preventDefault();
		var t = e.targetTouches ? e.targetTouches[0].target : e.target, c = null;
		c = t.getAttribute("data-category");
		if(c) {
			this.filter(c, e.type);
		}
		t = c = null;
	},
	iOSMenuEvent: function(e) {
		e.preventDefault();
		var target = e.target.value;
		
		this.iOSAlphabetMenu.swapClass("visible","invisible").blur();
		(function() {
			this.filter(target, "touch");
		}.bind(this)).delay(500);
	},
	keyboardEvent: function(e) {
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
		this.getContentInViewport();
	},
	onOrientationChange: function() {
		/*
		*	@description:
		*		Callback from orientation change
		*/
		var b = document.getElement("body");
		if(window.orientation) {
			if(window.orientation == 90 || orientation == -90) {
				b.removeClass("portrait").addClass("landscape");
				this.scrollVerticalOffset = (this.navCategoryHeight+this.navAlphabetHeight+20);
			} else {
				b.removeClass("landscape").addClass("portrait");
				this.scrollVerticalOffset = this.navCategoryHeight;
			}
		} else {
			b.removeClass("landscape").addClass("portrait");
			this.scrollVerticalOffset = this.navCategoryHeight;
		}
		b = null;
	}
});
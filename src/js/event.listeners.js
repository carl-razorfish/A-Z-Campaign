RIA.EventListeners = new Class({
	addEventListeners: function() {
		/*
		*	@description:
		*		Add all event listeners
		*/
		// Add mouse window resize event listener
		window.addEvent("resize", this.onWindowResize.bind(this));
		
		// Add mouse & touch navigation event listener, only if we are not on an Alphabet Fact page
		if(!this.options.alpha || this.options.alpha == "") {
			this.navPanel.getElements("a").addEvents({
				"click":this.pointerEvent.bind(this),
				"touchstart":this.pointerEvent.bind(this)
			});
		}
		
		document.id("close").addEvents({
			"click":this.closeMovie.bind(this),
			"touchstart":this.closeMovie.bind(this)
		});
		
		// Add keyboard navigation event listener
		this.addKeyboardEventListeners();
		
		// Add document scroll event listener
		this.addScrollEventListener();
		
		this.loadEventBind = this.loadEvent.bind(this)
		window.addEvent("load", this.loadEventBind);

		this.addMovieEventListener();
		
	},
	loadEvent: function() {
		this.loadMovie();
		window.removeEvent("load", this.loadEventBind);
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
		if(t.nodeName == "#text") {
			t = t.parentNode;
		}
		c = t.get("data-category");
		if(c) {
			this.filter(c, e.type);
		}
		t = c = null;
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
		if(this.mask) {
			this.mask.setStyles({"width":this.viewport.x+"px"});
		}
		if(this.movieContainer && this.options.movie.inView) {
			var leftPos = (this.viewport.x - this.shellWidth) < 0 ? 0 : (this.viewport.x - this.shellWidth)/2;
			this.movieContainer.setStyle("left",leftPos+"px");
		}
	}
});
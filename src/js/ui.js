RIA.UI = {
	init: function() {
		try {
			this.nav = document.id("navigation");
			this.navOffsetTop = this.nav.offsetTop;
			this.addEventListeners();
		
			this.navFX = new Fx.Tween(this.nav, {
				fps:100,
				duration:700,
				transition:"sine:out",
				link:"chain"
			});
		} catch(e) {
			Log.info("RIA.UI : init() : Error : "+e.message)
		}
	},
	addEventListeners: function() {
		window.addEventListener("scroll", this.windowScroll.bind(this), false);
	},
	windowScroll: function(e) {
		if(!Browser.Platform.ios) {
			this.nav.style.top = this.navOffsetTop+document.body.scrollTop+"px";
		} else {
			this.navFX.start("top",(this.navOffsetTop+document.body.scrollTop));
		}
	}
}
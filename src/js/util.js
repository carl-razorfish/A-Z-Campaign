RIA.Util = new Class({
	getViewport: function() {
		return {
			w:this.getViewportWidth(),
			h:this.getViewportHeight(),
			scrollTop:this.getViewportScrollTop()
		}	
	},
	getViewportWidth: function() {
		return (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0);
	},
	getViewportHeight: function() {
		return (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0);
	},
	getViewportScrollTop: function() {
		return (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
	},
	velocityCurve: function(y1, y2) {
		/*
		*	@description:
		*		Calculate the pixel distance between the two y coordinates provided, and return a time curve for sine:in:out Fx.Transition
		*	@additional_description
		*		We don't want a constant Fx.Transition time duration. This is because we could be scrolling from one letter to the next, or from A to Z, for example
		*		and the scroll speed looks too fast over great distances set at 1000ms. So instead we'll slow the scroll speed down depending on the distance to travel.
		*/
		return Math.floor(Math.PI*((y1 - y2)/10));
		y1 = y2 = null;
	}
});
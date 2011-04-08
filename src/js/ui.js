RIA.UI = {
	init: function() {
		this.shell = document.id("shell");
		this.nav = document.id("navigation");
		this.navOffsetTop = this.nav.offsetTop;
		this.addEventListeners();
		
		this.navFX = new Fx.Tween(this.nav, {
			fps:100,
			duration:700,
			transition:"sine:out",
			link:"chain"
		});
	},
	addEventListeners: function() {
		window.addEventListener("scroll", this.windowScroll.bind(this),false);
	},
	windowScroll: function(e) {
		if(!Browser.Platform.ios) {
			this.nav.style.top = this.navOffsetTop+document.body.scrollTop+"px";
		} else {
			this.navFX.start("top",(this.navOffsetTop+document.body.scrollTop));
		}
	},
	bodyIOSTouchStart: function(e) {
		this.originalPos = {x:e.targetTouches[0].clientX, y:e.targetTouches[0].clientY};
		this.startPos = {x:e.targetTouches[0].clientX, y:e.targetTouches[0].clientY};
		document.body.addEventListener("touchmove", this.bodyIOSTouchMove.bind(this),false);
	},
	bodyIOSTouchMove: function(e) {
		e.preventDefault();
		var translateY;
		Log.info("this.shell.offsetTop: "+this.shell.offsetTop);
		this.currentPos = {x:e.targetTouches[0].clientX, y:e.targetTouches[0].clientY};
		this.newPos = {
			x:this.originalPos.x-this.currentPos.x,
			y:this.originalPos.y-this.currentPos.y
		}
		translateY = document.body.style.webkitTransform;
		translateY = (translateY != "") ? translateY.substring(11) : "0";
		translateY = translateY.replace(")px","");
		translateY = parseFloat(translateY);
		document.body.style.webkitTransition = "all 1s ease-in-out";
		document.body.style.webkitTransform = "translateY("+(this.newPos.y-translateY)+"px)";
		this.originalPos = this.currentPos;
	}
}
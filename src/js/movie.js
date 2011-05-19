RIA.Movie = new Class({
	launchMovie: function() {
		
		this.mask = new Element('div', {
			'class': 'mask',
			'id': 'mask',
			events: {
				click: function(event){
					this.closeMovie();
				}.bind(this)
			}
		}).inject(document.body);
		this.mask.setStyle("opacity","0").set("morph",{
			duration:500,
			onStart: function() {
				if(this.mask.getStyle("opacity") > 0) {
					document.id("movie").childNodes[0].destroy();
				} else {
					this.createMovie();
					this.track("http://www.youtube.com/v/-hyZL4YLmXA");
				}	
			}.bind(this),
			onComplete: function() {
				if(this.mask.getStyle("opacity") == 0) {
					this.mask.dispose();
				} else {
					// do nothing
				}				
			}.bind(this)
		})
		this.mask.morph({opacity:"0.7"});
	},
	closeMovie: function() {
		if(!this.mask) return;		
		this.mask.morph({opacity:"0", duration:500});		
	},
	createMovie: function() {
		this.movie = new Swiff("http://www.youtube.com/v/-hyZL4YLmXA?hl=en&fs=1&showinfo=0&showsearch=0&rel=0&iv_load_policy=3&autoplay=1&loop=0&hd=1", {
			container:"movie",
			width:700,
			height:450,
			params:{
				allowScriptAccess:"always",
				quality:"high",
				wmode:"transparent"
			}			
		});
		Log.info(this.movie);
	},
	track: function(urlPath) {
		var url = urlPath||"";
		_gaq.push(['_trackEvent', 'Movie', 'AtoZ', url, null]);
		url = null;
	}
});
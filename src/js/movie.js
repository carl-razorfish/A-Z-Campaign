/*
*	Global function callback from YouTube Player
*/
function onYouTubePlayerReady(ytplayer) {
	if(RIA.Campaign) {
		RIA.Campaign.onYouTubePlayerReady(ytplayer);
	}	
}

/*
*	Global function callback from YouTube Player
*/
function onytplayerStateChange(newState) {
	if(RIA.Campaign) {
		RIA.Campaign.onytplayerStateChange(newState);
	}
}

/*
*	Global function callback from YouTube Player
*/
function onPlaybackQualityChange(quality) {
	if(RIA.Campaign) {
		RIA.Campaign.onPlaybackQualityChange(quality);
	}
}

RIA.Movie = new Class({
	options:{
		youtube:{
			states:{
				"-1":"Unstarted",
				"0":"Ended",
				"1":"Playing",
				"2":"Paused",
				//"3":"Buffering",
				//"5":"Video cued"
			},
			quality:{
				"small":"Small", 
				"medium":"Medium",
				"large":"Large",
				"hd720":"HD720",
				"hd1080":"HD1080",
				"highres":"High res"
			}
		}
	},
	loadMovie: function() {
		this.movie = new Swiff(this.movieContainer.get("data-movie-uri"), {
			container:this.movieContainer,
			id:"movie-swf",
			width:700,
			height:500,
			params:{
				movie:this.movieContainer.get("data-movie-uri")
			}
		});
		
		this.movie = document.id("movie-swf");
		
	},
	closeMovie: function() {
		/*
		*	@description:
		*		
		*/
		this.addKeyboardEventListeners();
		if(this.movie && this.movie.pauseVideo) this.movie.pauseVideo();
		this.movieContainer.setStyle("visibility","hidden");
		this.mask.morph({opacity:"0"});	
	},
	createMask: function() {
		this.removeKeyboardEventListeners();
		if(!this.mask) {
			this.mask = new Element('div', {
				'class': 'mask',
				'id': 'mask',
				events: {
					click: function(event){
						this.closeMovie();
					}.bind(this)
				}
			}).inject(document.body);
			
		}	
		this.mask.setStyle("opacity","0").set("morph",{
			duration:400,
			onComplete: function(mask) {
				if(mask.getStyle("opacity") > 0) {
					this.movieContainer.setStyle("left",((this.viewport.x - this.shellWidth) / 2)+50+"px");
					this.movieContainer.setStyle("visibility","visible");
				} else {
					this.movieContainer.setStyle("left","-10000em");
					this.movieContainer.setStyle("visibility","hidden");
				}
				
			}.bind(this)
		}).morph({opacity:"0.7"});
	},
	trackYTSWF: function(action) {
		Log.info("trackYTSWF("+action+")");
		if(!action) return;
		var source = this.movieContainer ? this.movieContainer.get("data-movie-uri") : "movie src unknown";
		_gaq.push(['_trackEvent', 'YouTubeSWFMovie', action, source, null]);
		source = null;
	},
	trackHTML5: function(action) {
		Log.info("trackHTML5("+action+")");
		_gaq.push(['_trackEvent', 'YouTubeHTML5Movie', action, this.movieHTML5.getElements("source")[0].src, null]);
	},
	onYouTubePlayerReady: function(playerId) {
		/*
		*	@description:
		*		Hook from YT onYouTubePlayerReady(playerId) method
		*/
		this.addMovieEventListener();
		
		if(document.addEventListener) {
			this.movie.addEventListener("onStateChange", "onytplayerStateChange", false);
			this.movie.addEventListener("onPlaybackQualityChange", "onPlaybackQualityChange", false);			
		} else if(document.attachEvent) {
			this.movie.attachEvent("onStateChange", "onytplayerStateChange");
			this.movie.attachEvent("onPlaybackQualityChange", "onPlaybackQualityChange");
		}
	},
	onytplayerStateChange: function(newState) {
		/*
		*	@description:
		*		This event is fired whenever the player's state changes. 
		*	@arguments:
		*		Possible values are:
		*	 		unstarted (-1)
		*			ended (0)
		*			playing (1)
		*			paused (2)
		*			buffering (3)
		*			video cued (5).
		*		When the SWF is first loaded it will broadcast an unstarted (-1) event. 
		*		When the video is cued and ready to play it will broadcast a video cued event (5).
		*/
		if(this.options.youtube.states[newState]) {
			this.trackYTSWF(this.options.youtube.states[newState]);
		}
	},
	onPlaybackQualityChange: function(newQuality) {
		/*
		*	Possible values are "small", "medium", "large", "hd720", "hd1080", and "highres".
		*/
		var quality = "Quality: "+this.options.youtube.quality[newQuality]||"Unknown quality";		
		this.trackYTSWF(quality);
		quality = null;
	},
	addMovieEventListener: function() {
		this.youtubeLink.addEvent("click", this.createMask.bind(this));
	}
});
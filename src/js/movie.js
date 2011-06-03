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
				"2":"Paused"
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
		try {
			//Log.info("loadMovie()");
			
			this.movie = new Swiff(this.movieContainer.get("data-movie-uri"), {
				container:this.movieSWFContainer,
				id:"movie-swf",
				width:640,
				height:385, // 360 + 25px for the controls
				params:{
					movie:this.movieContainer.get("data-movie-uri")
				}
			});
		
			this.movie = document.id("movie-swf");
			
			
		} catch(e) {
			Log.error({method:"RIA.Movie : loadMovie()", error:e});
		}		
	},
	closeMovie: function() {
		/*
		*	@description:
		*		
		*/
		try {
			this.addKeyboardEventListeners();
			if(this.movie && this.movie.pauseVideo) this.movie.pauseVideo();
			this.movieContainer.setStyle("visibility","hidden");
			if(Browser.Platform.ios) {
				this.mask.setStyles({opacity:"0"});
				this.doMovieContainer(false);
			} else {
				this.mask.morph({opacity:"0"});	
			}
		} catch(e) {
			Log.error({method:"RIA.Movie : closeMovie()", error:e});
		}
	},
	createMask: function() {
		try {
			this.removeKeyboardEventListeners();
			if(!this.mask) {
				this.mask = new Element('div', {
					'class': 'mask',
					'id': 'mask',
					"styles":{
						"opacity":0,
						"width":this.viewport.x+"px"
					},
					events: {
						click: function(event){
							this.closeMovie();
						}.bind(this)
					}
				}).inject(document.body);
				
				this.mask.set("morph",{
					duration:400,
					onComplete: function(mask) {
						if(mask.getStyle("opacity") > 0) {
							this.doMovieContainer(true);
						} else {
							this.doMovieContainer(false);
						}
			
					}.bind(this)
				});
			}	
			
			if(Browser.Platform.ios) {
				this.mask.setStyles({opacity:"0.7"});
				this.doMovieContainer(true);
			} else {
				this.mask.morph({opacity:"0.7"});
			}
			
		} catch(e) {
			Log.error({method:"RIA.Movie : createMask()", error:e});
		}
	},
	doMovieContainer: function(show) {
		try {
			if(show) {
				this.movieContainer.setStyle("left",((this.viewport.x - this.shellWidth) / 2)+"px");
				this.movieContainer.setStyle("visibility","visible");
			} else {
				this.movieContainer.setStyle("left","-10000em");
				this.movieContainer.setStyle("visibility","hidden");
			}
		} catch(e) {
			Log.error({method:"RIA.Movie : doMovieContainer()", error:e});
		}
	},
	trackYTSWF: function(action) {
		try {
			//Log.info("trackYTSWF("+action+")");
			if(!action) return;
			var source = this.movieContainer ? this.movieContainer.get("data-movie-uri") : "movie src unknown";
			_gaq.push(['_trackEvent', 'YouTubeSWFMovie', action, source, null]);
			source = null;
		} catch(e) {
			Log.error({method:"RIA.Movie : trackYTSWF()", error:e});
		}
	},
	onYouTubePlayerReady: function(playerId) {
		/*
		*	@description:
		*		Hook from YT onYouTubePlayerReady(playerId) method
		*/
		//Log.info("onYouTubePlayerReady");
		try {
		
			this.movie.addEventListener("onStateChange", "onytplayerStateChange");
			this.movie.addEventListener("onPlaybackQualityChange", "onPlaybackQualityChange");			

		} catch(e) {
			Log.error({method:"RIA.Movie : onYouTubePlayerReady()", error:e});
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
		try {
			if(this.options.youtube.states[newState]) {
				this.trackYTSWF(this.options.youtube.states[newState]);
			}
		} catch(e) {
			Log.error({method:"RIA.Movie : onytplayerStateChange()", error:e});
		}
	},
	onPlaybackQualityChange: function(newQuality) {
		/*
		*	Possible values are "small", "medium", "large", "hd720", "hd1080", and "highres".
		*/
		try {
			var quality = "Quality: "+this.options.youtube.quality[newQuality]||"Unknown quality";		
			this.trackYTSWF(quality);
			quality = null;
		} catch(e) {
			Log.error({method:"RIA.Movie : onPlaybackQualityChange()", error:e});
		}
	},
	addMovieEventListener: function() {
		try {
			this.youtubeLink.addEvent("click", this.launchEvent.bind(this));
			this.youtubeLink.addEvent("touchstart", this.launchEvent.bind(this));
		} catch(e) {
			Log.error({method:"RIA.Movie : addMovieEventListener()", error:e});
		}
	},
	launchEvent: function(e) {
		try {
			e.preventDefault();
			this.createMask();
		} catch(e) {
			Log.error({method:"RIA.Movie : launchEvent()", error:e});
		}
	},
	pinMovie: function() {
		try {
			if(this.mask) {
				this.mask.setStyle("width",this.viewport.x+"px");
			}
			
			if(this.movieContainer) {
				this.movieContainer.setStyle("left",((this.viewport.x - this.shellWidth) / 2)+"px");
			}
		} catch(e) {
			Log.error({method:"RIA.Movie : pinMovie()", error:e});
		}
	}
});


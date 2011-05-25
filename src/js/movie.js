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
		try {
			Log.info("loadMovie()");
			
			this.movie = new Swiff(this.movieContainer.get("data-movie-uri"), {
				container:this.movieContainer,
				id:"movie-swf",
				width:640,
				height:360,
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
					events: {
						click: function(event){
							this.closeMovie();
						}.bind(this)
					}
				}).inject(document.body);
				
				this.mask.setStyle("opacity","0").set("morph",{
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
			} else {
				this.mask.morph({opacity:"0.7"});
			}
			
		} catch(e) {
			Log.error({method:"RIA.Movie : createMask()", error:e});
		}
	},
	doMovieContainer: function(show) {
		Log.info("doMovieContainer");
		try {
			if(show) {
				this.movieContainer.setStyle("left",((this.viewport.x - this.shellWidth) / 2)+50+"px");
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
			Log.info("trackYTSWF("+action+")");
			if(!action) return;
			var source = this.movieContainer ? this.movieContainer.get("data-movie-uri") : "movie src unknown";
			_gaq.push(['_trackEvent', 'YouTubeSWFMovie', action, source, null]);
			source = null;
		} catch(e) {
			Log.error({method:"RIA.Movie : trackYTSWF()", error:e});
		}
	},
	trackHTML5: function(action) {
		try {
			Log.info("trackHTML5("+action+")");
			_gaq.push(['_trackEvent', 'YouTubeHTML5Movie', action, this.movieHTML5.getElements("source")[0].src, null]);
		} catch(e) {
			Log.error({method:"RIA.Movie : trackHTML5()", error:e});
		}
	},
	onYouTubePlayerReady: function(playerId) {
		/*
		*	@description:
		*		Hook from YT onYouTubePlayerReady(playerId) method
		*/
		Log.info("onYouTubePlayerReady");
		try {
			
		
			if(document.addEventListener) {
				this.movie.addEventListener("onStateChange", "onytplayerStateChange", false);
				this.movie.addEventListener("onPlaybackQualityChange", "onPlaybackQualityChange", false);			
			} else if(document.attachEvent) {
				this.movie.attachEvent("onStateChange", "onytplayerStateChange");
				this.movie.attachEvent("onPlaybackQualityChange", "onPlaybackQualityChange");
			}
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
		Log.info("launchEvent");
		try {
			e.preventDefault();
			this.createMask();
		} catch(e) {
			Log.error({method:"RIA.Movie : launchEvent()", error:e});
		}
	},
	pinMovie: function() {
		try {
			if(this.movieContainer) {
				this.movieContainer.setStyle("left",((this.viewport.x - this.shellWidth) / 2)+"px");
			}
		} catch(e) {
			Log.error({method:"RIA.Movie : pinMovie()", error:e});
		}
	}
});
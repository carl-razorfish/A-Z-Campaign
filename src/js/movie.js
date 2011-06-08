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
				//,"3":"Buffering",
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
			if(!Browser.Platform.ios && Browser.Plugins.Flash.version <= 0) return;
			
			this.movie = new Swiff(this.movieContainer.get("data-movie-uri"), {
				container:this.movieSWFContainer,
				id:"movie-swf",
				width:630,
				height:385, // 360 + 25px for the controls
				params:{
					"movie":this.movieContainer.get("data-movie-uri"),
					"allowfullscreen":"true"
				}
			});
		
			this.movieSWF = document.id("movie-swf");
		} catch(e) {
			Log.error({method:"RIA.Movie : loadMovie()", error:e});
		}		
	},
	closeMovie: function() {
		/*
		*	@description:
		*		
		*/
		this.addKeyboardEventListeners();			
		/*
		*	If the video is currently in play or buffering, pause it
		*/
		if(this.movieSWF && this.movieSWF.pauseVideo && this.movieSWF.getPlayerState) {
			var playerState = this.movieSWF.getPlayerState()||-2;
			if(playerState == 1 || playerState == 3) {
				this.movieSWF.pauseVideo();
			}
		} else {
			//Log.info("Movie.pauseVideo is not supported, or player state was "+this.options.youtube.states[playerState]);
		}
		this.movieContainer.setStyle("visibility","hidden");
		if(Browser.Platform.ios) {
			(function() {
				this.mask.setStyles({opacity:"0"});
			}.bind(this)).delay(500)
			this.doMovieContainer(false);				
		} else {
			this.mask.morph({opacity:"0"});					
		}
		playerState = null;
	},
	createMask: function() {
		try {
			this.removeKeyboardEventListeners();
			
			if(!this.mask) {
				this.mask = document.id("mask");
				this.mask.set({
					'class': 'mask',
					'id': 'mask',
					"styles":{
						"opacity":0,
						"width":this.viewport.x+"px"
					},
					events: {
						"click": function(e){
							e.preventDefault();
							this.closeMovie();
						}.bind(this),
						"touchstart": function(e){
							e.preventDefault();
							this.closeMovie();
						}.bind(this)
					},
					"morph":{
						fps:100,
						duration:200,
						onComplete: function(mask) {
							/*
							*	Browser.Platform.ios will not run this
							*/
							if(mask.getStyle("opacity") > 0) {
								this.doMovieContainer(true);
							} else {
								this.doMovieContainer(false);
							}
						}.bind(this)
					}
				});

			}	
			
			if(Browser.Platform.ios) {
				/*
				*	[ST] there's a bug when repeatedly opening and closing the video (and mask) where the viewport.x appears to reset to zero, so check it
				*/
				if(this.viewport.x == 0) this.viewport.x = window.innerWidth;
				
				this.mask.setStyles({opacity:"0.7","width":this.viewport.x+"px"});
				(function() {
					this.doMovieContainer(true);
				}.bind(this)).delay(500);
			} else {
				this.mask.morph({opacity:"0.7","width":this.viewport.x+"px"});
			}
			
		} catch(e) {
			Log.error({method:"RIA.Movie : createMask()", error:e});
		}
	},
	doMovieContainer: function(show) {
		/*
		*	@description:
		*		Show/Hide the movie container
		*		If it's Apple iOS we have previously deleted the SWF from the hide action, so recreate it if it's a show action
		*/
		try {
			if(Browser.Platform.ios && show) {
				this.loadMovie();
			}
		
			if(this.movieContainer) {
				if(show) {
					this.options.movie.inView = true;
					var leftPos = (this.viewport.x - this.shellWidth) < 0 ? 0 : (this.viewport.x - this.shellWidth)/2;
					this.movieContainer.setStyle("left",leftPos+"px");
					this.movieContainer.setStyle("visibility","visible");
				} else {
					this.options.movie.inView = false;
					this.movieContainer.setStyle("left","-10000em");
					this.movieContainer.setStyle("visibility","hidden");
					/*
					*	The pause and getPlayerState methods do not work, so just bin it
					*/
					if(Browser.Platform.ios) {
						this.movieSWF.destroy();
					}
				}
			}
		} catch(e) {
			Log.error({method:"RIA.Movie : doMovieContainer()", error:e});
		}
	},
	trackYTSWF: function(action) {
		try {
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
		*		Hook from YT onYouTubePlayerReady(playerId) method.
		*		Uses YouTube's API proprietary addEventListener method (http://code.google.com/apis/youtube/js_api_reference.html#Adding_event_listener)
		*/
		this.movieSWF.addEventListener("onStateChange", "onytplayerStateChange");
		this.movieSWF.addEventListener("onPlaybackQualityChange", "onPlaybackQualityChange");
		
		/*
		*	Only add the event listener to launch the overlay if the YouTube Player is ready
		*	This way, the link will act as a link to YouTube if Flash or HTML5 executions do not work on the device
		*/
		//this.addMovieEventListener();
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
		var quality = "Quality: "+this.options.youtube.quality[newQuality]||"Unknown quality";		
		this.trackYTSWF(quality);
		quality = null;
	},
	addMovieEventListener: function() {
		
		this.launchEventBind = this.launchEvent.bind(this);
		
		this.youtubeLink.addEvents({
			"click":this.launchEventBind,
			"touchstart":this.launchEventBind
		});
	},
	removeMovieEventListener: function() {
		this.youtubeLink.removeEvents({
			"click":this.launchEventBind,
			"touchstart":this.launchEventBind
		});
	},
	launchEvent: function(e) {
		e.preventDefault();
		this.createMask();
	}
});
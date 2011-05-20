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
				"3":"Buffering",
				"5":"Video cued"
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
	launchMovie: function() {
		
		this.removeKeyboardEventListeners();
		
		
		this.movieContainer = document.id("movie");
		this.movieContainer.setStyle("display","block");
		this.movieHTML5 = document.id("movie-html5");
		
		if(this.movieHTML5 && document.addEventListener) {
			this.movieHTML5.addEventListener('ended', this.trackHTML5.pass(["Ended"],this),false);
			this.movieHTML5.addEventListener('playing', this.trackHTML5.pass(["Playing"],this),false);			
			this.movieHTML5.addEventListener('pause', this.trackHTML5.pass(["Paused"],this),false);			
			this.movieHTML5.addEventListener('volumechange', this.trackHTML5.pass(["Volume change"],this),false);
			this.movieHTML5.addEventListener('error', this.trackHTML5.pass(["Error"],this),false);
		} else if (this.movieHTML5 && document.attachEvent) {
			this.movieHTML5.attachEvent('ended', this.trackHTML5.pass(["Ended"],this));		
			this.movieHTML5.attachEvent('playing', this.trackHTML5.pass(["Playing"],this));			
			this.movieHTML5.attachEvent('pause', this.trackHTML5.pass(["Paused"],this));			
			this.movieHTML5.attachEvent('volumechange', this.trackHTML5.pass(["Volume change"],this));
			this.movieHTML5.attachEvent('error', this.trackHTML5.pass(["Error"],this));
		}
		
		this.movieSWF = document.id("movie-swf");
		
		/*
		this.movieUnsupported = document.id("movie-unsupported");
		if(Browser.Plugins.Flash && Browser.Plugins.Flash.version >= 10) {
			if(this.movieHTML5) this.movieHTML5.setStyle("display","none");
			this.movieSWF.setStyle("display","block");
			this.movieUnsupported.setStyle("display","none");
		} else if(document.createElement("video").canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') != ""){
			if(this.movieHTML5) this.movieHTML5.setStyle("display","block");
			this.movieSWF.setStyle("display","none");
			this.movieUnsupported.setStyle("display","none");
		} else {
			this.movieUnsupported.setStyle("display","block");
		}
		*/
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
			duration:400
		}).morph({opacity:"0.7"});
	
		
	},
	closeMovie: function() {
		/*
		*	@description:
		*		
		*/
		this.addKeyboardEventListeners();
		if(this.ytplayer) this.ytplayer.pauseVideo();
		if(this.movieHTML5) this.movieHTML5.pause();
		this.movieContainer.setStyle("display","none");
		this.mask.morph({opacity:"0"});	
	},
	trackYTSWF: function(action) {
		Log.info("trackYTSWF("+action+")");
		_gaq.push(['_trackEvent', 'YouTubeSWFMovie', action, this.movieSWF.getElement("param[name=movie]").value, null]);
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
		this.ytplayer = document.id("movie-swf");
		this.ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
		this.ytplayer.addEventListener("onPlaybackQualityChange", "onPlaybackQualityChange");
		
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
		var state = this.options.youtube.states[newState]||"Unknown state";		
		this.trackYTSWF(state);
		state = null;
	},
	onPlaybackQualityChange: function(newQuality) {
		/*
		*	Possible values are "small", "medium", "large", "hd720", "hd1080", and "highres".
		*/
		var quality = "Quality: "+this.options.youtube.quality[newQuality]||"Unknown quality";		
		this.trackYTSWF(quality);
		quality = null;
	}
});
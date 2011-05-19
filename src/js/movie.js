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
			}
		}
	},
	launchMovie: function() {
		
		
		
		// [ST]TODO: remove all navigation event listeners (incomplete 2011-05-19)
		this.removeEventListeners();
		
		
		this.movieContainer = document.id("movie");
		this.movieContainer.setStyle("display","block");
		this.movieHTML5 = document.id("movie-html5");
		
		if(document.addEventListener) {
			this.movieHTML5.addEventListener('ended',function() {
				Log.info("ended native event");
				this.trackHTML5("Ended");
			}.bind(this),false);
		
			this.movieHTML5.addEventListener('playing',function() {
				Log.info("playing native event");
				this.trackHTML5("Playing");
			}.bind(this),false);
			
			this.movieHTML5.addEventListener('pause',function() {
				Log.info("paused native event");
				this.trackHTML5("Paused");
			}.bind(this),false);
			
			this.movieHTML5.addEventListener('volumechange',function() {
				Log.info("volumechange native event");
				this.trackHTML5("Volume change");
			}.bind(this),false);

			
		} else if (document.attachEvent) {
			this.movieHTML5.attachEvent('ended',function() {
				Log.info("ended native event");
				this.trackHTML5("Ended");
			}.bind(this));
		
			this.movieHTML5.attachEvent('playing',function() {
				Log.info("playing native event");
				this.trackHTML5("Playing");
			}.bind(this));
			
			this.movieHTML5.attachEvent('pause',function() {
				Log.info("paused native event");
				this.trackHTML5("Paused");
			}.bind(this));
			
			this.movieHTML5.attachEvent('volumechange',function() {
				Log.info("volumechange native event");
				this.trackHTML5("Volume change");
			}.bind(this));

		}
		

		
		this.movieSWF = document.id("movie-swf");
		Log.info(this.movieSWF.toElement);
		this.movieUnsupported = document.id("movie-unsupported");

		if(Browser.Plugins.Flash && Browser.Plugins.Flash.version >= 10) {
			this.movieHTML5.setStyle("display","none");
			this.movieSWF.setStyle("display","block");
			this.movieUnsupported.setStyle("display","none");
		} else if(document.createElement("video").canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') != ""){
			this.movieHTML5.setStyle("display","block");
			this.movieSWF.setStyle("display","none");
			this.movieUnsupported.setStyle("display","none");
		} else {
			this.movieUnsupported.setStyle("display","block");
		}
		
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
		// [ST]TODO: reinstate all navigation event listeners
		if(this.ytplayer) this.ytplayer.pauseVideo();
		if(this.movieHTML5) this.movieHTML5.pause();
		this.movieContainer.setStyle("display","none");
		this.mask.morph({opacity:"0"});	
	},
	trackYT: function(action) {
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
		this.ytplayer.playVideo();
		this.ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
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
		this.trackYT(state);
		state = null;
	}
});
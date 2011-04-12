RIA.Util = {
	getViewport: function() {
		return {
			h:(window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0),
			scrollTop:(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0)
		}	
	}
}
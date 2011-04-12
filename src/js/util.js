RIA.Util = {
	getViewport: function() {
		return {
			w:(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0),
			h:(window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0),
			scrollLeft:(window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0),
			scrollTop:(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0)
		}	
	}
}
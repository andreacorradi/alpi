;(function(window, undefined) {

	window.APP = {}

	APP.init = function() {
		APP.data = new Data()
		APP.peakchart = new Peakchart()
		APP.scrollyTelling = new ScrollyTelling()
		APP.ui = new Ui()
		APP.data.init()
		APP.ui.init()
	}

	$(document).ready(function() {
		console.log('ready')
		APP.init()
	})

})(window)
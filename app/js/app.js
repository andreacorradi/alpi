;(function(window, undefined) {

	window.APP = {}

	APP.init = function() {
		APP.peakchart = new Peakchart()
		APP.ui = new Ui()
		APP.peakchart.init()
		APP.ui.init()
	}

	$(document).ready(function() {
		console.log('ready')
		APP.init()
	})

})(window)
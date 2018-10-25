;(function(window, undefined) {

	window.APP = {}

	APP.colors = {
		"All": "#333333",
		"FR": "#F0015B", //rododendro
		"IT": "#0433F5", //genziana
		"CH": "green", //grass
		"AT": "#F8B803", //arnica
		"DE": "blue",
		"LI": "cyan",
		"SI": "pink"
	}

	APP.init = function() {
		APP.data = new Data()
		APP.peakchart = new Peakchart()
		APP.peakinfo = new Peakinfo()
		APP.scrollyTelling = new ScrollyTelling()
		APP.ui = new Ui()
		APP.data.init()
	}

	$(document).ready(function() {
		console.log('ready')
		APP.init()
	})

})(window)
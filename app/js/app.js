;(function(window, undefined) {

	window.APP = {}

	APP.timeline =  ['explore', 'tour']

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

	APP.state = 'explore'
	APP.peaksInWindow = 1000 //visible peaks, initialised to 1000 as random value


	APP.switchState = function() {
		APP.stator.go(this.name)
	}

	APP.init = function() {
		APP.stator = new window.States()
		APP.stator.start({ html5: false })

		APP.data = new Data()
		APP.peakchart = new Peakchart()
		APP.peakinfo = new Peakinfo()
		APP.scrollyTelling = new ScrollyTelling()
		APP.ui = new Ui()
		
		APP.data.init()
		APP.stator.go(APP.state)
	}

	$(document).ready(function() {
		console.log('ready')
		APP.init()
		document.getElementById("peakinfo").style.display = 'none'
	})

})(window)
;(function(window, undefined) {

	window.APP = {}

	APP.highlight = [
		{
			mode: 'height',
			steps: [
				{
					step: '1',
					mountain: ['Cima d\'Asta', 'Klosterwappen', 'Céüse'],
					caption: 'Questa è l\'unica montagna di granito dell\'area dolomitica.'
				},
				{
					step: '2',
					mountain: ['Céüse'],
					caption: 'Questa è la cima più piatta delle Alpi.'
				},
			]
		},
		{
			mode: 'lat',
			steps: [
				{
					step: '1',
					mountain: ['Mont Charvin'],
					caption: 'Questa è la montagna più a Ovest delle Alpi.'
				},
				{
					step: '2',
					mountain: ['Klosterwappen'],
					caption: 'Questa è la montagna più a Est delle Alpi.'
				},
			]
		}
	]

	APP.init = function() {
		APP.peakchart = new Peakchart()
		APP.scrollyTelling = new ScrollyTelling()
		APP.ui = new Ui()
		APP.peakchart.init()
		APP.scrollyTelling.init()
		APP.ui.init()
	}

	$(document).ready(function() {
		console.log('ready')
		APP.init()
	})

})(window)
;(function(window, undefined) {

	window.APP = {}

	APP.highlight = [
		{
			mode: 'height',
			steps: [
				{
					step: '1',
					mountain: [{name: 'Rimpfischhorn', rank: 13}, {name: 'Cima Cadin di San Lucano', rank: 710}, {name: 'Mürtschenstock', rank: 1110}],
					caption: 'Queste montagne sanno di banana.'
				},
				{
					step: '2',
					mountain: [{name: 'Grand Tournalin', rank: 204}],
					caption: 'Questa è la cima più appuntita delle Alpi: vietato sedersi in cima per i poveri di spirito.'
				},
				{
					step: '3',
					mountain: m => m.height > 4000,
					caption: 'Questa è la cima degli stronzi.'
				}
			]
		},
		{
			mode: 'lat',
			steps: [
				{
					step: '1',
					mountain: ['Mont Chalancha'],
					caption: 'Questa è la montagna più a Ovest delle Alpi.'
				},
				{
					step: '2',
					mountain: ['Klosterwappen'],
					caption: 'Questa è la montagna più a Est delle Alpi.'
				}
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
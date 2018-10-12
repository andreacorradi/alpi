const highlightData = [
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
				caption: 'Ci sono * cime sopra i 4000 metri.'
			}
		]
	},
	{
		mode: 'lat',
		steps: [
			{
				step: '1',
				mountain: [{name: 'Mont Chalancha', rank: 1446}],
				caption: 'Questa è la montagna più a Ovest delle Alpi.'
			},
			{
				step: '2',
				mountain: [{name: 'Klosterwappen', rank: 1479}],
				caption: 'Questa è la montagna più a Est delle Alpi.'
			},
			{
				step: '3',
				mountain: m => m.height > 4000,
				caption: 'Ci sono * cime sopra i 4000 metri.'
			}
		]
	}
]
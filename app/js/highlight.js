const highlightData = [
	{
		mode: 'height',
		steps: [
			{
				mountain: [{name: 'Rimpfischhorn', rank: 13}, {name: 'Cima Cadin di San Lucano', rank: 710}, {name: 'Mürtschenstock', rank: 1110}],
				caption: 'Queste montagne sanno di banana.'
			},
			{
				mountain: [{name: 'Grand Tournalin', rank: 204}],
				caption: 'Questa è la cima più appuntita delle Alpi: vietato sedersi in cima per i poveri di spirito.'
			},
			{
				mountain: m => m.height > 4000,
				caption: 'Ci sono * cime sopra i 4000 metri.'
			},
			{
				mountain: m => m.height < 4000 && m.height > 3000,
				caption: 'Ci sono * cime fra i 3000 e i 4000 metri.'
			}
		]
	},
	{
		mode: 'lat',
		steps: [
			{
				mountain: [{name: 'Mont Chalancha', rank: 1446}],
				caption: 'Questa è la montagna più a Ovest delle Alpi.'
			},
			{
				mountain: [{name: 'Klosterwappen', rank: 1479}],
				caption: 'Questa è la montagna più a Est delle Alpi.'
			},
			{
				mountain: m => m.height > 4000,
				caption: 'Ci sono * cime sopra i 4000 metri.'
			}
		]
	},
	{
		mode: 'drop',
		steps: [
			{
				mountain: [{name: 'Mont Chalancha', rank: 1446}],
				caption: 'Questa è la montagna più a Ovest delle Alpi.'
			},
			{
				mountain: [{name: 'Klosterwappen', rank: 1479}],
				caption: 'Questa è la montagna più a Est delle Alpi.'
			},
			{
				mountain: m => m.height > 4000,
				caption: 'Ci sono * cime sopra i 4000 metri.'
			}
		]
	},
	{
		mode: 'firstascent',
		steps: [
			{
				mountain: [{name: 'Mont Chalancha', rank: 1446}],
				caption: 'Questa è la montagna più a Ovest delle Alpi.'
			},
			{
				mountain: [{name: 'Klosterwappen', rank: 1479}],
				caption: 'Questa è la montagna più a Est delle Alpi.'
			},
			{
				mountain: m => m.height > 4000,
				caption: 'Ci sono * cime sopra i 4000 metri.'
			}
		]
	}
]
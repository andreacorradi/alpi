function Data() {

	var self = this

	filterValue = 'All'
	orderValue = 'height'

	const countrySel = document.getElementById("country-sel")
	const orderSel = document.getElementById("order-sel")
	const orderPars = ['height', 'lat', 'drop']
	let mountains = []
	let dataset = []
	let countries = []
	let filterField = 'country'
	let selHighlight = highlightData

	self.init = function() {
		d3.csv("./../scraper/output/mountains.csv", (m) => {
			return {
				rank: +m.Rank,
				mountain: m.Mountain,
				mountainLink: m.MountainLink,
				mountainImgSrc: m.MountainImgSrc,
				height: +m.Height,
				drop: +m.Drop,
				lat: +m.lat,
				lon: +m.lon,
				range: m.Range,
				region: m.Region,
				country: generateCountryField(m.Country),
				firstascent: +m.Firstascent
			}
		})
		.then(function(_mountains) {
			//if (error) throw error
			mountains = _mountains
			countries = getUniqueValuesOfKey(_mountains, 'country')
			countries.unshift('All')
			APP.ui.populateSel(countrySel, countries)
			APP.ui.populateSel(orderSel, orderPars)
			dataset = self.prepareData()
			APP.peakchart.updateTriangle(dataset)
			selHighlight = self.prepareHighlight()
			APP.scrollyTelling.initScrollingSet(selHighlight)
		})
	}

	// filter by country, sort by mode and add info about previous data point
	self.prepareData = function(options = {}) {
		filterField = options.filterField || filterField
		filterValue = options.filterValue || filterValue
		orderValue = options.orderValue || orderValue
		let selectedMountains = filterSortData(mountains, filterField, filterValue, orderValue)
		dataset = addPrevPointData(selectedMountains)
		return dataset
	}

	// filter by mode and by country
	self.prepareHighlight = function(options = {}) {
		filterValue = options.filterValue || filterValue
		orderValue = options.orderValue || orderValue
		let selHighlightMode = highlightData.filter((h) => h.mode === orderValue)[0].steps

		// se una funzione è passata nella proprietà mountain, la valuto generando un array
		let valHighlight = []
		selHighlightMode.forEach((s) => {
			if (!_.isArray(s.mountain)) {
				const mountainArr = dataset.filter(s.mountain).map(m => {return {name: m.mountain, rank: m.rank}})
				valHighlight.push({step: s.step, mountain: mountainArr, caption: s.caption})
			} else valHighlight.push(s)
		})

		let selHighlight = []
		if (filterValue === 'All') {
			selHighlight = valHighlight
		} else {
			valHighlight.forEach((s) => {
				let mountainsInCountry = []
				s.mountain.forEach((p) => {
					let matchedPeak
					dataset.forEach((m) => {
						if (_.isEqual({name: m.mountain, rank: m.rank}, p)) {
							matchedPeak = m
							if (matchedPeak !== undefined && (matchedPeak.country.includes(filterValue) || filterValue === 'All')) {
								mountainsInCountry.push(p)
							}
						}
					})
				})
				selHighlight.push({step: s.step, mountain: mountainsInCountry, caption: s.caption})
			})
		}

		// removes the entries with no mountains and appends a step number
		let selHighlightNotEmpty = selHighlight.filter((h) => h.mountain.length !== 0)
		selHighlightNotEmpty.forEach((h, i) => {
			h.step = (i+1).toString()
		})
		return selHighlightNotEmpty
	}

	function objIncludes(arrOfObj, obj) {
		let res = arrOfObj.filter((e) => _.isEqual(e, obj))
		if (res.length > 0) return true
		else return false
	}

	function filterSortData(_data, filterField, filterValue, sortField) {
		return _data
			.filter((d) => {
				if (filterValue === 'All') return d
				else return d[filterField].includes(filterValue)
			})
			.sort((a,b) => {
				if (sortField === 'lat') return a[sortField] - b[sortField]
				else return b[sortField] - a[sortField]
			})
	}

	function addPrevPointData(_data) { //takes a dataset and adds to each record some height and drop info of the previous record
		let temp = null
		return _data.map((m, i) => {
			let obj = Object.assign({}, m)
			if (i !== 0) {
				obj.previous = {
					height: temp.height,
					drop: temp.drop
				}	
			}
			temp = m
			return obj
		})
	}

	function getUniqueValuesOfKey(array, key){ 
		let countries = []
	  array.forEach((el, i) => {
	  	el[key].forEach((c) => {
	  		if (!countries.includes(c)) {
	  			countries.push(c)
	  		}
	  	})
	  })
	  return countries
	}

	function generateCountryField(str) {
		const arr = str.split('/')
		return arr
	}

	return self

}
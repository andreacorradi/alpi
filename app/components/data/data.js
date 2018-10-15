function Data() {

	var self = this

	self.filterValue = 'All'
	self.orderValue = 'height'

	const countrySel = document.getElementById("country-sel")
	const orderSel = document.getElementById("order-sel")
	const orderPars = ['height', 'lat', 'drop']
	let mountains = []
	let dataset = []
	let countries = []
	let filterField = 'country'
	self.selHighlight = highlightData

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
			countries.unshift("All")
			APP.ui.populateSel(countrySel, countries)
			APP.ui.populateSel(orderSel, orderPars)
			let fullDataset = self.prepareData()
			APP.peakchart.updateTriangle(fullDataset)
			self.selHighlight = self.prepareHighlight()
			APP.scrollyTelling.initScrollingSet()
			APP.scrollyTelling.init()
		})
	}

	self.prepareData = function(options = {}) {
		filterField = options.filterField || filterField
		self.filterValue = options.filterValue || self.filterValue
		self.orderValue = options.orderValue || self.orderValue
		let selectedMountains = filterSortData(mountains, filterField, self.filterValue, self.orderValue)
		dataset = addPrevPointData(selectedMountains)
		return dataset
	}

	self.prepareHighlight = function(options = {}) {
		self.filterValue = options.filterValue || self.filterValue
		self.orderValue = options.orderValue || self.orderValue
		if (self.filterValue === 'All') {
			console.log('selHighlight: ', highlightData.filter((h) => h.mode === self.orderValue)[0].steps)
			return highlightData.filter((h) => h.mode === self.orderValue)[0].steps
		} else {
			const selHighlightMode = highlightData.filter((h) => h.mode === self.orderValue)[0].steps
			const selHighlight = []
			selHighlightMode.forEach((s) => {
				if (_.isArray(s.mountain)) {
					let mountainsInCountry = []
					s.mountain.forEach((p) => {
						let matchedPeak
						dataset.forEach((m) => {
							if (_.isEqual({name: m.mountain, rank: m.rank}, p)) {
								matchedPeak = m
								if (matchedPeak !== undefined && (matchedPeak.country.includes(self.filterValue) || self.filterValue === 'All')) {
									mountainsInCountry.push(p)
								}
							}
						})
					})
					selHighlight.push({step: s.step, mountain: mountainsInCountry, caption: s.caption})
				} else {
					selHighlight.push(s) // mountain è una funzione, ritorno s così com'è
				}
			})
			const selHighlightNotEmpty = selHighlight.filter((h) => h.mountain.length !== 0)
			console.log('selHighlightNotEmpty: ', selHighlightNotEmpty) 
			return selHighlightNotEmpty
		}
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
function Data() {

	var self = this

	self.filterValue = 'All'
	self.orderValue = 'height'

	const countrySel = document.getElementById("country-sel")
	const orderSel = document.getElementById("order-sel")
	const orderPars = ['height', 'lat', 'drop']
	let mountains = []
	let countries = []
	let filterField = 'country'

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
		})
	}

	self.prepareData = function(options = {}) {
		filterField = options.filterField || filterField
		self.filterValue = options.filterValue || self.filterValue
		self.orderValue = options.orderValue || self.orderValue
		let selectedMountains = filterSortData(mountains, filterField, self.filterValue, self.orderValue)
		let dataset = addPrevPointData(selectedMountains)
		return dataset
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
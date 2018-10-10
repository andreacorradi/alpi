function Peakchart() {

	var self = this

	const container = document.getElementById("peaks-container")
	const countrySel = document.getElementById("country-sel")
	const orderSel = document.getElementById("order-sel")
	const svg = document.getElementById("peaks-chart")

	const angleThreshold = 100 //to avoid flat connections between mountains
	const transDuration = 1000
	const lowOpacity = 0.02
	const highOpacity = 0.8

	const countryColors = { 
		IT: 'purple',
		CH: 'green',
		FR: 'red',
		DE: 'blue',
		AT: 'orange',
		LI: 'cyan',
		SI: 'pink'
	}

	const countryCouples = ["FR/IT", "CH/IT",	"CH/FR", "AT/IT",	"AT/CH", "AT/DE",	"IT/SI", "CH/LI",	"AT/LI", "AT/SI"]

	let svgW = svg.clientWidth
	let containerH = container.clientHeight

	let mountains = null
	let dataLength = 0

	let filterField = 'country'
	let countries = []
	self.filterValue = 'All'
	self.orderValue = 'height'

	let scaleY = {}

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
			scaleY = d3.scaleLinear()
				.domain([0, 4808])
				.range([10, containerH - 10])
			generateGradients()
			//drop-downs population
			countries = getUniqueValuesOfKey(mountains, 'country')
			countries.unshift("All")
			APP.ui.populateSel(countrySel, countries)
			const orderPars = ['height', 'lat', 'drop']
			APP.ui.populateSel(orderSel, orderPars)
			self.updateTriangle({})
		})
	}

	self.updateTriangle = function(options) {
		mountains = options.mountains || mountains
		filterField = options.filterField || filterField
		self.filterValue = options.filterValue || self.filterValue
		self.orderValue = options.orderValue || self.orderValue
		let selectedMountains = filterSortData(mountains, filterField, self.filterValue, self.orderValue)
		let data = addPrevPointData(selectedMountains)
		console.log(data)
		dataLength = data.length
		let span = svgW / dataLength
		//const maxH = d3.max(data, d => d.height)
		APP.ui.zoomBox('0') //when data are filtered or sorted the zoom comes back to zero
		let triangles = d3.select('svg').selectAll('polygon')
	    .data(data)
	  triangles
	  	.attr('class', (d) => assignColorClass(d))
    	.attr('points', (d, i) => calcPoints(d, i, 0, span))
	  	.transition()
	  	.duration(transDuration)
  		.attr('points', (d, i) => calcPoints(d, i, 1, span))
	  let newTriangles = triangles
		  .enter().append('polygon')
		  	.attr('class', (d) => assignColorClass(d))
		  	.attr('points', (d, i) => calcPoints(d, i, 0, span))
		  	.on('click', (d) => console.log(d.mountain + ', ' + d.height))
		  	.transition()
	  		.duration(transDuration)
		  	.attr('points', (d, i) => calcPoints(d, i, 1, span))
		triangles.exit().remove()
	}

	self.greaterThan = function(par) {
		return mountains.filter(m => m.height > par)
	}

	self.zoomSvgTriangle = function(targetW) {
		svg.clientWidth = targetW
		const newSpan = targetW / dataLength
		d3.selectAll('polygon')
			.attr('points', (d, i) => calcPoints(d, i, 0, newSpan))
			.attr('points', (d, i) => calcPoints(d, i, 1, newSpan))
	}

	self.highlightTriangle = function(subset) {
		let mountainArr = []
		if (_.isArray(subset)) mountainArr = subset
		else { mountainArr = mountains.filter(subset).map(m => {return {name: m.mountain, rank: m.rank}})	}
		d3.selectAll('polygon')
			.style('fill-opacity', (d, i) => {
				if (objIncludes(mountainArr, {name: d.mountain, rank: d.rank})) {
					return highOpacity
				} else return lowOpacity
			})
	}
	self.resetlightTriangle = function() {
		d3.selectAll('polygon')
			.style('fill-opacity', 0.3)
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

	function calcPoints(d, i, step, span) { //computation of of the two baseline vertexes of the triangle
		let H = 0
		step === 1 ? H = scaleY(d.height) : H = 0
		let x_sub = 0
		const base = span/2
		const altezza = d.drop
		const x_add = (base * (d.height - altezza))/altezza
		if (i !== 0) {
			const altezza_b = d.previous.drop - (d.previous.height - d.height)
			if (altezza_b > angleThreshold) {
				x_sub = (base * (d.previous.height - d.previous.drop))/altezza_b
			} else x_sub = 0
		}
		const points = (i*span - span/2 - x_sub) + ',' + containerH + ' ' + i*span + ',' + (containerH - H) + ' ' + (i*span + span/2 + x_add) + ',' + containerH
		return points
	}

	function assignColorClass(el) {
		if (el.country.length === 1) {
			return 'triangle ' + countryColors[el.country]
		}	else {
			const gradientClass = el.country[0].toLowerCase() + '-' + el.country[1].toLowerCase()
			return 'triangle ' + gradientClass
		}
	}

	function generateCountryField(str) {
		const arr = str.split('/')
		return arr
	}

	function generateGradients() {
  	countryCouples.forEach((c) => {
  		const identifier = c.split('/')[0].toLowerCase() + '-' + c.split('/')[1].toLowerCase()
  		d3.select('svg defs').append('linearGradient')
	      .attr("id", identifier + "-gradient")
	      .attr("x1", "0%").attr("y1", "0%")
      	.attr("x2", "100%").attr("y2", "0%")
	    .selectAll("stop")
	      .data([
	        {offset: "0%", color: countryColors[c.split('/')[0]]},
	        {offset: "100%", color: countryColors[c.split('/')[1]]}
	      ])
	    .enter().append("stop")
	      .attr("offset", function(d) { return d.offset })
	      .attr("stop-color", function(d) { return d.color })
  	})
  }

	return self

}
function Peakchart() {

	var self = this

	const container = document.getElementById("peaks-container")
	const countrySel = document.getElementById("country-sel")
	const orderSel = document.getElementById("order-sel")
	const svg = document.getElementById("peaks-chart")

	const angleThreshold = 100 //to avoid flat connections between mountains
	const transDuration = 1000

	let svgW = svg.clientWidth
	let containerH = container.clientHeight

	let mountains = null
	let dataLength = 0

	let filterValue = 'All'
	let orderValue = 'height'
	let filterField = 'country'

	const scaleY = d3.scaleLinear()
		.domain([0, 4808])
		.range([10, containerH - 10])


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
				country: m.Country,
				firstascent: +m.Firstascent
			}
		})
		.then(function(_mountains) {
			//if (error) throw error
			mountains = _mountains
			//drop-downs population
			const countries = getUniqueValuesOfKey(mountains, 'country')
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
		filterValue = options.filterValue || filterValue
		orderValue = options.orderValue || orderValue
		let selectedMountains = filterSortData(mountains, filterField, filterValue, orderValue)
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
		  	.transition()
	  		.duration(transDuration)
		  	.attr('points', (d, i) => calcPoints(d, i, 1, span))
		triangles.exit().remove()
	}

	self.zoomSvgTriangle = function(targetW) {
		svg.clientWidth = targetW
		const newSpan = targetW / dataLength
		d3.selectAll('polygon')
			.attr('points', (d, i) => calcPoints(d, i, 0, newSpan))
			.attr('points', (d, i) => calcPoints(d, i, 1, newSpan))
	}


	function filterSortData(_data, filterField, filterValue, sortField) {
		return _data
			.filter((d) => {
				if (filterValue === 'All') return d
				else return d[filterField] === filterValue
			})
			.sort((a,b) => b[sortField] - a[sortField])
	}

	function getUniqueValuesOfKey(array, key){ 
	  return array.reduce(function(carry, item){
	    if(item[key] && !~carry.indexOf(item[key])) carry.push(item[key])
	    return carry
	  }, [])
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
		switch (el.country) {
			case 'IT':
				return 'triangle orange'
				break
			case 'CH':
				return 'triangle green'
				break
			default:
				return 'triangle'
				break
		}
	}


	return self

}
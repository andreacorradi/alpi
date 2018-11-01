function Peakchart() {

	var self = this

	const container = document.getElementById("peaks-container")
	const svg = document.getElementById("peaks-chart")

	const angleThreshold = 100 //to avoid flat connections between mountains
	const transDuration = 1000
	const lowOpacity = 0.02
	const stdOpacity = 0.3
	const highOpacity = 0.8

	const countryCouples = ["FR/IT", "CH/IT",	"CH/FR", "AT/IT",	"AT/CH", "AT/DE",	"IT/SI", "CH/LI",	"AT/LI", "AT/SI"]

	let svgW = svg.clientWidth
	let containerH = container.clientHeight

	let dataset = []
	self.dataLength = 0
	let scaleY = {}
	

	self.updateTriangle = function(_dataset) {
		dataset = _dataset
		console.log(dataset)
		scaleY = d3.scaleLinear()
			.domain([0, 4808])
			.range([0, containerH - 40])
		generateGradients()
		self.dataLength = dataset.length
		let span = svgW / self.dataLength
		let triangles = d3.select('svg').selectAll('polygon')
	    .data(dataset)
	  triangles
	  	// .attr('class', (d) => assignColorClass(d))
	  	.attr('class', 'triangle')
	  	.style('fill', (d) => assignColor(d))
    	.attr('points', (d, i) => calcPoints(d, i, 0, span))
	  	.transition()
	  	.duration(transDuration)
  		.attr('points', (d, i) => calcPoints(d, i, 1, span))
	  let newTriangles = triangles
		  .enter().append('polygon')
		  	// .attr('class', (d) => assignColorClass(d))
		  	.attr('class', 'triangle')
		  	.style('fill', (d) => assignColor(d))
		  	.attr('points', (d, i) => calcPoints(d, i, 0, span))
		  	.on('click', (d) => {
					getPeakData(d)
		  	})
		  	.transition()
	  		.duration(transDuration)
		  	.attr('points', (d, i) => calcPoints(d, i, 1, span))
		triangles.exit().remove()
	}

	async function getPeakData(peak) {
	  const uri = 'http://en.wikipedia.org/' + peak.mountainLink
	  let promise = new Promise((resolve, reject) => {
	    setTimeout(() => resolve("done!"), 1000)
	  })
	 //  let promise = fetch(uri).then((response) => {
		//   response.text().then((text) => {
		//     console.log(text)
		//     return text
		//   })
		// })

	  let result = await promise
	  APP.peakinfo.init(peak, result)
	  APP.peakinfo.open()
	}

	self.zoomSvgTriangle = function(targetW) {
		svg.clientWidth = targetW
		const newSpan = targetW / self.dataLength
		d3.selectAll('polygon')
			.attr('points', (d, i) => calcPoints(d, i, 0, newSpan))
			.attr('points', (d, i) => calcPoints(d, i, 1, newSpan))
	}

	self.highlightTriangle = function(subset) {
		d3.selectAll('polygon')
			.style('fill-opacity', (d, i) => {
				if (objIncludes(subset, {name: d.mountain, rank: d.rank})) {
					return highOpacity
				} else return lowOpacity
			})
	}

	self.resetlightTriangle = function() {
		d3.selectAll('polygon')
			.style('fill-opacity', stdOpacity)
	}

	self.calcPar = function(subset) {
		let mountainArr = []
		if (!_.isArray(subset)) mountainArr = dataset.filter(subset)
		return mountainArr.length
	}


	function objIncludes(arrOfObj, obj) {
		let res = arrOfObj.filter((e) => _.isEqual(e, obj))
		if (res.length > 0) return true
		else return false
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
			return 'triangle ' + APP.colors[el.country]
		}	else {
			const gradientClass = el.country[0].toLowerCase() + '-' + el.country[1].toLowerCase()
			return 'triangle ' + gradientClass
		}
	}

	function assignColor(el) {
		if (el.country.length === 1) {
			return APP.colors[el.country]
		}	else {
			const gradientClass = el.country[0].toLowerCase() + '-' + el.country[1].toLowerCase()
			return 'url(#' + gradientClass + '-gradient)'
		}
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
	        {offset: "0%", color: APP.colors[c.split('/')[0]]},
	        {offset: "100%", color: APP.colors[c.split('/')[1]]}
	      ])
	    .enter().append("stop")
	      .attr("offset", function(d) { return d.offset })
	      .attr("stop-color", function(d) { return d.color })
  	})
  }

	return self

}
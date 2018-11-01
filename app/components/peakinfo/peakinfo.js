function Peakinfo() {
	
	let self = this

	const peakinfo = document.getElementById("peakinfo")
	const peakinfoUi = document.getElementById("peakinfo-ui")
	const zoombutton = document.getElementById("zoom-map")
	const containerW = document.getElementById('info-map').offsetWidth
	const containerH = document.getElementById('info-map').offsetHeight
	const strokeW = 0.5
	const circleSize = 6

	let rangePeaks = []
	let regionPeaks = []
	let selectedPeak = {}
	const propertyArr = ['height', 'drop', 'firstascent']
	const propertyNaming = {
		'height': 'Height',
		'drop': 'Drop',
		'firstascent': 'First ascent'
	}
	const countryLabels = {
		"FR": "France",
		"IT": "Italy",
		"CH": "Switzerland",
		"AT": "Austria",
		"DE": "Germany",
		"LI": "Lichtenstein",
		"SI": "Slovenia"
	}

	self.init = function(peak, info) {
		console.log(info)
		peakinfo.style.display = 'block'
		selectedPeak = peak
		assignColor(selectedPeak)
		fillHeader(peak)

		//Montagne del range/region
		rangePeaks = APP.data.returnPeakSubset('rangeac', peak.rangeac)
		regionPeaks = APP.data.returnPeakSubset('region', peak.region)
		console.log('regionPeaks: ', regionPeaks)

		document.getElementById("zoom-map-button").querySelector('.button#zoom-map').innerHTML = 'ZOOM on ' + peak.region
		generateMap(peak)
		propertyArr.forEach((par) => generateChart(regionPeaks, peak, par))

		peakinfoUi.querySelector('#icon-close').onclick = function(e) {
			close()
		}
	}

	self.open = function() {
		peakinfoUi.style.display = 'block'
		document.getElementById("scrollytelling").style.display = 'none'
		peakinfo.style.transform = 'translateY(0%)'
	}

	function close() {
		peakinfo.style.transform = 'translateY(100%)'
		peakinfo.style.display = 'none'
		peakinfoUi.style.display = 'none'
		document.getElementById("scrollytelling").style.display = 'block'
		d3.selectAll('.info-detail .detail-chart svg.svg-chart').remove()
		d3.selectAll('#info-map svg.svg-map').remove()
	}

	function fillHeader(peak) {
		peakinfo.querySelector('.info-title').innerHTML = peak.mountain
		if (peak.country.length > 1) peakinfo.querySelector('.info-country').innerHTML = 'Country: ' + countryLabels[peak.country[0]] + ' / ' + countryLabels[peak.country[1]]
		else peakinfo.querySelector('.info-country').innerHTML = 'Country: ' + countryLabels[peak.country[0]]
		peakinfo.querySelector('.info-region').innerHTML = 'Region: ' + peak.region
		//peakinfo.querySelector('.info-range').innerHTML = 'Range: ' + peak.rangeac
	}

	function assignColor(el) {
		if (el.country.length === 1) {
			peakinfo.style.background = APP.colors[el.country]
			zoombutton.style.color = APP.colors[el.country]
			peakinfoUi.style.background = APP.colors[el.country]
		}	else {
			peakinfo.style.backgroundImage = 'linear-gradient(' + APP.colors[el.country[0]] + ',' + APP.colors[el.country[1]] + ')'
			zoombutton.style.color = APP.colors[el.country[0]]
			peakinfoUi.style.background = APP.colors[el.country[0]]
		}
	}

	function generateChart(data, peak, par) {
		//console.log('data: ', data)
		data.sort((a,b) => b[par] - a[par])
		const pos = data.findIndex(d => d.rank === peak.rank) + 1

		const title = document.getElementById('info-detail').querySelector('#info-' + par + ' .detail-title')
		const dida = document.getElementById('info-detail').querySelector('#info-' + par + ' .detail-dida')
		if (par === 'firstascent') {
			if (peak[par] === 0) title.innerHTML = propertyNaming[par] + ': N/A'
			else title.innerHTML = propertyNaming[par] + ': ' + peak[par]
		} else title.innerHTML = propertyNaming[par] + ': ' + peak[par] + ' m'
		dida.innerHTML = pos + ' / ' + data.length + ' peaks in ' + peak.region

		let svgChart = d3.select('#info-detail #info-' + par + ' .detail-chart')
			.append('svg')
			.attr('class', 'svg-chart')
			.attr('width', '100%')
			.attr('height', '100%')
		const contW = document.getElementById('info-detail').querySelector('#info-' + par + ' .detail-chart').offsetWidth
		const contH = document.getElementById('info-detail').querySelector('#info-' + par + ' .detail-chart').offsetHeight
		const maxPar = d3.max(data, (p) => p[par])
		const minPar = d3.min(data, (p) => {
			if (par === 'firstascent') return 1700
			else return p[par]
		})
		//console.log(par + ' max: ' + maxPar, par + ' min: ' + minPar)
		const scalePar = d3.scaleLinear()
			.domain([0, maxPar])
			.range([contH, 0])
		let rectW = 1
		const span = contW / data.length 
		if (span > 2) rectW = span - 2
		svgChart.selectAll('rect')
			.data(data)
			.enter()
			.append('rect')
				.attr('x', (r, i) => i * span)
				.attr('y', (r) => {
					if (r[par] === 0) {
						return contH - 1
					}	else return scalePar(r[par])
				})
				.attr('width', rectW)
				.attr('height', (r) => {
					if (r[par] === 0) return 1
					else return contH - scalePar(r[par])
				})
				.style('fill', 'white')
				.style('fill-opacity', (r) => {
					if (r.rank === peak.rank) { return 1 } else return 0.2
				})
	}

	function generateMap(peak) {
		let svgMap = d3.select('#info-map')
			.append('svg')
			.attr('class', 'svg-map')
			.attr('width', '100%')
			.attr('height', '100%')
		d3.json('components/peakinfo/assets/eu.json').then((eu) => {
		  const geo = topojson.feature(eu, eu.objects.europe).features		  
		  //console.log('geoJSON: ', topojson.feature(eu, eu.objects.europe))

	  	const projection = d3.geoMercator()
	  		.center([10.063906390639055, 47.39485102807158])
			  .scale(1240)
			  .translate([containerW/2, containerH/2])

			const path = d3.geoPath()
  			.projection(projection)

		  const eu_states = svgMap.append('g').selectAll('path')
		    .data(geo)
		    .enter().append('path')
		      .attr('d', (d) => path(d))
		      .style('fill', 'none')		  
		      .style('stroke', 'white')
		      .style('stroke-width', strokeW)

		  const peaks = svgMap.append('g').selectAll('circle')
		    .data(regionPeaks)
		    .enter().append('circle')
		      .attr('cx', (d) => {
		      	if(d.lon !== NaN && d.lat !== NaN) return projection([d.lon, d.lat])[0]
		      })
		      .attr('cy', (d) => {
		      	if(d.lon !== NaN && d.lat !== NaN) return projection([d.lon, d.lat])[1]
		      })
		      .attr('r', (d) => {
		      	if (d.rank === peak.rank) return circleSize
		      	else return 1
		      })
		      .attr('class', (d) => {
		      	if (d.rank === peak.rank) return 'selected'
		      })

		  zoombutton.onclick = function(e) {
		  	if (e.target.className==='button') {
		  		e.target.classList.add('zoomed')
		  		e.target.innerHTML = 'ZOOM out'
					let coords = []
					d3.selectAll('circle').each((c) => coords.push({x: projection([c.lon, c.lat])[0], y: projection([c.lon, c.lat])[1]}))
					const xMin = d3.min(coords, (p) => p.x)
					const xMax = d3.max(coords, (p) => p.x)
					const yMin = d3.max(coords, (p) => p.y)
					const yMax = d3.min(coords, (p) => p.y)
					const boundingBox = [[xMin, yMin], [xMax, yMax]]
					const zScale = .5 / Math.max((boundingBox[1][0] - boundingBox[0][0]) / containerW, (boundingBox[1][1] - boundingBox[0][1]) / containerH)
					const zTransform = [(containerW - zScale * (boundingBox[1][0] + boundingBox[0][0])) / 2, (containerH - zScale * (boundingBox[1][1] + boundingBox[0][1])) / 2]
					svgMap.selectAll('g')
						.transition()
						.duration(750)
						.attr("transform", "translate(" + zTransform + ")scale(" + zScale + ")")
					svgMap.selectAll('path')
						.transition()
						.duration(750)
						.style('stroke-width', strokeW / zScale)
					svgMap.selectAll('circle')
						.transition()
						.duration(750)
						.style('r', circleSize / zScale)
		  	} else {
		  		e.target.classList.remove('zoomed')
		  		e.target.innerHTML = 'ZOOM on ' + peak.region
		  		svgMap.selectAll('g')
						.transition()
						.duration(750)
						.attr("transform", "")
					svgMap.selectAll('path')
						.transition()
						.duration(750)
						.style('stroke-width', strokeW)
					svgMap.selectAll('circle')
						.transition()
						.duration(750)
						.style('r', (d) => {
							if (d.rank === peak.rank) return circleSize
		      		else return 1
						})
		  	}
		  }   

		})

	}

	return self
}
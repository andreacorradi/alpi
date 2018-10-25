function Peakinfo() {
	
	let self = this

	const peakinfo = document.getElementById("peakinfo")

	let rangePeaks = []
	let regionPeaks = []
	let selectedPeak = {}
	const propertyArr = ['height', 'drop', 'firstascent']
	const propertyNaming = {
		'height': 'Height',
		'drop': 'Drop',
		'firstascent': 'First ascent'
	}

	self.init = function(peak) {
		selectedPeak = peak
		assignBkgdColor(selectedPeak)
		fillHeader(peak)

		//Montagne del range/region
		rangePeaks = APP.data.returnPeakSubset('rangeac', peak.rangeac)
		regionPeaks = APP.data.returnPeakSubset('region', peak.region)
		console.log('regionPeaks: ', regionPeaks)

		propertyArr.forEach((par) => generateChart(regionPeaks, peak, par))

		peakinfo.querySelector('#info-close').onclick = function(e) {
			close()
		}
	}

	self.open = function() {
		peakinfo.style.transform = 'translateY(0%)'
	}

	function close() {
		peakinfo.style.transform = 'translateY(100%)'
		d3.selectAll('.info-detail .detail-chart svg').remove()
	}

	function fillHeader(peak) {
		peakinfo.querySelector('.info-title').innerHTML = peak.mountain
		if (peak.country.length > 1) peakinfo.querySelector('.info-country').innerHTML = 'Country: ' + peak.country[0] + ' / ' + peak.country[1]
		else peakinfo.querySelector('.info-country').innerHTML = 'Country: ' + peak.country[0]
		peakinfo.querySelector('.info-region').innerHTML = 'Region: ' + peak.region
		peakinfo.querySelector('.info-range').innerHTML = 'Range: ' + peak.rangeac
	}

	function generateChart(data, peak, par) {
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
			.attr('width', '100%')
			.attr('height', '100%')
		const containerW = document.getElementById('info-detail').querySelector('#info-' + par + ' .detail-chart').offsetWidth
		const containerH = document.getElementById('info-detail').querySelector('#info-' + par + ' .detail-chart').offsetHeight
		const maxPar = d3.max(data, (p) => p[par])
		const minPar = d3.min(data, (p) => {
			if (par === 'firstascent') return 1700
			else return p[par]
		})
		console.log(par + ' max: ' + maxPar, par + ' min: ' + minPar)
		const scalePar = d3.scaleLinear()
			.domain([0, maxPar])
			.range([containerH, 0])
		const span = containerW / data.length 
		const rectW = span - 2
		svgChart.selectAll('rect')
			.data(data)
			.enter()
			.append('rect')
				.attr('x', (r, i) => i * span)
				.attr('y', (r) => {
					if (r[par] === 0) {
						return containerH - 1
					}	else return scalePar(r[par])
				})
				.attr('width', rectW)
				.attr('height', (r) => {
					if (r[par] === 0) return 1
					else return containerH - scalePar(r[par])
				})
				.style('fill', 'white')
				.style('fill-opacity', (r) => {
					if (r.rank === peak.rank) { return 1 } else return 0.2
				})
	}

	function assignBkgdColor(el) {
		if (el.country.length === 1) {
			peakinfo.style.background = APP.colors[el.country]
		}	else {
			peakinfo.style.backgroundImage = 'linear-gradient(' + APP.colors[el.country[0]] + ',' + APP.colors[el.country[1]] + ')'
		}
	}

	return self
}
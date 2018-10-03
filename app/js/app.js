const slider = document.getElementById("zoomslider")
const output = document.getElementById("demo")
const main = document.getElementById("main-container")
const container = document.getElementById("peaks-container")
const countrySel = document.getElementById("country-sel")
const orderSel = document.getElementById("order-sel")
const svg = document.getElementById("peaks-chart")

const angleThreshold = 100

let svgW = svg.clientWidth
let containerW = container.clientWidth
let containerH = container.clientHeight

let selCountry = 'All'
let selOrder = 'height'

let dataLenght

const scaleY = d3.scaleLinear()
	.domain([0, 4808])
	.range([0, containerH])

function init() {

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
	.then(function(mountains) {
		//if (error) throw error
		//console.log(mountains)

		const countries = getUniqueValuesOfKey(mountains, 'country')
		countries.unshift("All")
		populateSel(countrySel, countries)
		const orderPars = ['height', 'lat', 'drop']
		populateSel(orderSel, orderPars)

		// let skyline = d3.select('svg').append('path')
		// updateLine(selCountry, selOrder)

		let skyline = d3.select('svg')
		updateTriangle(selCountry, selOrder)


		// function updateLine(filterValue, orderValue) {

		// 	let selectedMountains = filterSortData(mountains, 'country', filterValue, orderValue)
		// 	let data = []
		// 	selectedMountains.forEach((m, i) => {
		// 		let summit = Object.assign({}, m)
		// 		summit.side = "summit"
		// 		data.push(summit)
		// 		let drop = Object.assign({}, m)
		// 		drop.side = "drop"
		// 		data.push(drop)
		// 	})
		// 	console.log(data)
		// 	dataLenght = data.length
		// 	let span = svgW / data.length

		// 	const lineGround = d3.line()
		// 		.x((d, i) => i*span)
		// 		.y((d, i) => containerH)

		// 	const line = d3.line()
		//     .x((d, i) => i*span)
		//     .y((d) => {	if (d.side === "summit") { return containerH - d.height/10 } else { return containerH - (d.height - d.drop)/10 } })
			
		// 	zoomBox(container, '0')
		// 	slider.value = 1

		//   skyline
		//     .datum(data)
		//     .attr('d', lineGround)
		//   	.transition()
	 //  		.duration(1000)
		//     .attr('d', line)
		//     .style('fill', 'none')
		//     .style('stroke', 'black')
		// 		.style('stroke-width', 1)

		// 	let points = d3.select('svg').selectAll("circle")
		//     .data(data)

		//   points
		//     	.attr("cx", (d, i) => i*span)
		//     	.attr("cy", containerH)
		//   	.transition()
		//   	.duration(1000)
		// 	    .attr("cy", (d) => {	if (d.side === "summit") { return containerH - d.height/10 } else { return containerH - (d.height - d.drop)/10 } })

		//   let newPoints = points
		// 	  .enter().append("circle")
		// 	    .attr("cx", (d, i) => i*span)
		// 	    .attr("cy", containerH)
		// 	  	.transition()
		//   		.duration(1000)
		// 	    .attr("cy", (d) => {	if (d.side === "summit") { return containerH - d.height/10 } else { return containerH - (d.height - d.drop)/10 } })
		// 	    .attr("r", (d) => {	if (d.side === "summit") { return 2 } else { return 2 } })
		// 	    .style('fill', (d) => {	if (d.side === "summit") { return 'black' } else { return 'blue' } })

		// 	points.exit().remove()

		// 	output.innerHTML = slider.value
		// }



		function updateTriangle(filterValue, orderValue) {

			let selectedMountains = filterSortData(mountains, 'country', filterValue, orderValue)
			let temp = null
			let data = selectedMountains.map((m, i) => {
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
			console.log(data)
			dataLenght = data.length
			let span = svgW / data.length

			const maxH = d3.max(data, d => d.height)

			zoomBox(container, '0')
			slider.value = 1

			let triangles = d3.select('svg').selectAll('polygon')
		    .data(data)

		  triangles
	    	.attr('points', (d, i) => calcPoints(d, i, 0))
		  	.transition()
		  	.duration(1000)
	  		.attr('points', (d, i) => calcPoints(d, i, 1))

		  let newTriangles = triangles
			  .enter().append('polygon')
			  	.attr('points', (d, i) => calcPoints(d, i, 0))
			    .style('fill', 'blue')
			    .style('fill-opacity', 0.1)
			    .style('stroke', 'none')
			  	.transition()
		  		.duration(1000)
			  	.attr('points', (d, i) => calcPoints(d, i, 1))

			triangles.exit().remove()


			function calcPoints(d, i, step) {
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

			// let points = d3.select('svg').selectAll("circle")
		 //    .data(data)

		 //  points
		 //    	.attr("cx", (d, i) => i*span)
		 //    	.attr("cy", containerH)
		 //  	.transition()
		 //  	.duration(1000)
			//     .attr("cy", (d) => {	if (d.side === "summit") { return containerH - scaleY(d.height) } else { return containerH - scaleY(d.height - d.drop) } })

		 //  let newPoints = points
			//   .enter().append("circle")
			//     .attr("cx", (d, i) => (i*span) + span/2)
			//     .attr("cy", containerH)
			//   	.transition()
		 //  		.duration(1000)
			//     .attr("cy", (d) => containerH - scaleY(d.height - d.drop))
			//     .attr("r", 2)
			//     .style('fill', 'black')

			// points.exit().remove()

			output.innerHTML = slider.value
		}




		slider.oninput = function(e) {
		  output.innerHTML = e.target.value
		  zoomBox(container, e.target.value)
		  //zoomSvgLine(svg, containerW, dataLenght)
		  zoomSvgTriangle(svg, containerW, dataLenght)
		}

		countrySel.onchange = function(e) {
			selCountry = e.target.options[e.target.selectedIndex].value
			//updateLine(selCountry, selOrder)
			updateTriangle(selCountry, selOrder)
		}

		orderSel.onchange = function(e) {
			selOrder = e.target.options[e.target.selectedIndex].value
			//updateLine(selCountry, selOrder)
			updateTriangle(selCountry, selOrder)
		}

	})

}

init()


function zoomBox(container, magnification) {
	container.style.width = 100 + (parseInt(magnification)) + '%'
	containerW = container.clientWidth
  const mainW = main.clientWidth
  const offsetW = (containerW - mainW) / 2
  main.scrollLeft = offsetW
}

function zoomSvgLine(svg, targetW, dataLength) {
	svg.clientWidth = targetW
	const newSpan = targetW / dataLength
	const lineGround = d3.line()
	    .x((d, i) => i*newSpan)
	    .y((d, i) => containerH)
	const newLine = d3.line()
	    .x((d, i) => i*newSpan)
	    .y((d) => {	if (d.side === "summit") { return containerH - d.height/10 } else { return containerH - (d.height - d.drop)/10 } })
	d3.select('path')
		.attr('d', lineGround)
		.attr('d', newLine)
	d3.select('svg').selectAll("circle")
		.attr("cx", (d, i) => i*newSpan)
}

function zoomSvgTriangle(svg, targetW, dataLength) {
	svg.clientWidth = targetW
	const newSpan = targetW / dataLength
	function calcPoints(d, i, step) {
		let H = 0
		step === 1 ? H = scaleY(d.height) : H = 0
		let x_sub = 0
		const base = newSpan/2
		const altezza = d.drop
		const x_add = (base * (d.height - altezza))/altezza
		if (i !== 0) {
			const altezza_b = d.previous.drop - (d.previous.height - d.height)
			if (altezza_b > angleThreshold) {
				x_sub = (base * (d.previous.height - d.previous.drop))/altezza_b
			} else x_sub = 0
		}
		const points = (i*newSpan - newSpan/2 - x_sub) + ',' + containerH + ' ' + i*newSpan + ',' + (containerH - H) + ' ' + (i*newSpan + newSpan/2 + x_add) + ',' + containerH
		return points
	}
	d3.selectAll('polygon')
		.attr('points', (d, i) => calcPoints(d, i, 0))
		.attr('points', (d, i) => calcPoints(d, i, 1))
}

function filterSortData(data, filterField, filterValue, sortField) {
	return data
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

function populateSel(select, arr) {
	arr.forEach((c) => {
		const option = document.createElement("option")
		option.appendChild(document.createTextNode(c))
		select.appendChild(option)
	})
}

// $(window).on('resize', () => {
// })
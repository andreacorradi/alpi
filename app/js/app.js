const slider = document.getElementById("zoomslider")
const output = document.getElementById("demo")
const main = document.getElementById("main-container")
const container = document.getElementById("peaks-container")
const countrySel = document.getElementById("country-sel")
const svg = document.getElementById("peaks-chart")

let svgW = svg.clientWidth
let containerW = container.clientWidth
let containerH = container.clientHeight

let dataLenght

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
		countries.forEach((c) => {
			const option = document.createElement("option")
			option.appendChild(document.createTextNode(c))
			countrySel.appendChild(option)
		})

		let skyline = d3.select('svg').append("path")

		update('All')

		function update(filterValue) {

			let selectedMountains = filterSortData(mountains, 'country', filterValue, 'lat')
			let data = []
			selectedMountains.forEach((m, i) => {
				let summit = Object.assign({}, m)
				summit.side = "summit"
				data.push(summit)
				let drop = Object.assign({}, m)
				drop.side = "drop"
				data.push(drop)
			})
			console.log(data)
			dataLenght = data.length
			let span = svgW / data.length

			const lineGround = d3.line()
				.x((d, i) => i*span)
				.y((d, i) => containerH)

			const line = d3.line()
		    .x((d, i) => i*span)
		    .y((d) => {	if (d.side === "summit") { return containerH - d.height/10 } else { return containerH - (d.height - d.drop)/10 } })
			
			zoomBox(container, '0')
			slider.value = 1

		  skyline
		    .datum(data)
		    .attr('d', lineGround)
		  	.transition()
	  		.duration(1000)
		    .attr('d', line)
		    .style('fill', 'none')
		    .style('stroke', 'black')
				.style('stroke-width', 1)

			let points = d3.select('svg').selectAll("circle")
		    .data(data)

		  points
		    	.attr("cx", (d, i) => i*span)
		    	.attr("cy", containerH)
		  	.transition()
		  	.duration(1000)
			    .attr("cy", (d) => {	if (d.side === "summit") { return containerH - d.height/10 } else { return containerH - (d.height - d.drop)/10 } })

		  let newPoints = points
			  .enter().append("circle")
			    .attr("cx", (d, i) => i*span)
			    .attr("cy", containerH)
			  	.transition()
		  		.duration(1000)
			    .attr("cy", (d) => {	if (d.side === "summit") { return containerH - d.height/10 } else { return containerH - (d.height - d.drop)/10 } })
			    .attr("r", 2)
			    .style('fill', (d) => {	if (d.side === "summit") { return 'blue' } else { return "black" } })

			points.exit().remove()

			output.innerHTML = slider.value
		}

		slider.oninput = function(e) {
		  output.innerHTML = e.target.value
		  zoomBox(container, e.target.value)
		  zoomSvg(svg, containerW, dataLenght)
		}

		countrySel.onchange = function(e) {
			const selCountry = e.target.options[e.target.selectedIndex].value
			update(selCountry)
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

function zoomSvg(svg, targetW, dataLength) {
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

function filterSortData(data, filterField, filterValue, sortField) {
	return data
		.filter((d) => {
			if (filterValue === 'All') return d
			else return d[filterField] === filterValue
		})
		.sort((a,b) => a[sortField] - b[sortField])
}

function getUniqueValuesOfKey(array, key){
  return array.reduce(function(carry, item){
    if(item[key] && !~carry.indexOf(item[key])) carry.push(item[key])
    return carry
  }, [])
}

// $(window).on('resize', () => {
// })
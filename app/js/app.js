const slider = document.getElementById("myRange")
const output = document.getElementById("demo")
const main = document.getElementById("main-container")
const container = document.getElementById("peaks-container")
const svg = document.getElementById("peaks-chart")

const data = d3.range(200)

let svgW = svg.getBoundingClientRect().width
let containerW = container.clientWidth
const span = svgW / data.length


function init() {
	console.log(containerW, svgW)
	d3.select('svg')
	.selectAll('line')
	.data(data)
	.enter()
	.append('line')
		.attr('x1', (i) => i*span)
		.attr('y1', 0)
		.attr('x2', (i) => i*span)
		.attr('y2', (i) => i)
		.style('stroke', 'black')
		.style('stroke-width', 1)

	output.innerHTML = slider.value
}

init()

slider.oninput = function(e) {
  output.innerHTML = e.target.value
  zoomBox(container, e.target.value)
  zoomSvg(svg, containerW)
}

function zoomBox(container, magnification) {
	container.style.width = 100 + (parseInt(magnification)) + '%'
	containerW = container.clientWidth
  const mainW = main.clientWidth
  const offsetW = (containerW - mainW) / 2
  main.scrollLeft = offsetW
}

function zoomSvg(svg, targetW) {
	svg.clientWidth = targetW
	const newSpan = targetW / data.length
	d3.selectAll('line')
		.attr('x1', (i) => i*newSpan)
		.attr('x2', (i) => i*newSpan)
}


// $(window).on('resize', () => {
// })
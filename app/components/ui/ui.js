function Ui() {

	var self = this

	const slider = document.getElementById("zoomslider")
	const output = document.getElementById("demo")
	const main = document.getElementById("main-container")
	const container = document.getElementById("peaks-container")
	const countrySel = document.getElementById("country-sel")
	const orderSel = document.getElementById("order-sel")

	self.init = function() {
		slider.oninput = function(e) {
		  output.innerHTML = e.target.value
		  self.zoomBox(e.target.value)
		  APP.peakchart.zoomSvgTriangle(container.clientWidth)
		}
		countrySel.onchange = function(e) {
			let selCountry = e.target.options[e.target.selectedIndex].value
			APP.peakchart.updateTriangle({filterValue: selCountry})
		}
		orderSel.onchange = function(e) {
			let selOrder = e.target.options[e.target.selectedIndex].value
			APP.peakchart.updateTriangle({orderValue: selOrder})
		}
	}

	self.zoomBox = function(magnification) {
		container.style.width = 100 + (parseInt(magnification)) + '%'
		const containerW = container.clientWidth
	  const mainW = main.clientWidth
	  const offsetW = (containerW - mainW) / 2
	  main.scrollLeft = offsetW
	  slider.value = magnification
	  output.innerHTML = slider.value
	}

	self.populateSel = function(select, arr) {
		arr.forEach((c) => {
			const option = document.createElement("option")
			option.appendChild(document.createTextNode(c))
			select.appendChild(option)
		})
	}

	return self

}
function Ui() {

	var self = this

	const slider = document.getElementById("zoomslider")
	const output = document.getElementById("demo")
	const main = document.getElementById("main-container")
	const container = document.getElementById("peaks-container")
	const countrySel = document.getElementById("country-sel")
	const dummyCountry = document.getElementById("dummy-country")
	const orderSel = document.getElementById("order-sel")

	self.init = function() {
		initView()
		slider.oninput = function(e) {
		  output.innerHTML = e.target.value
		  self.zoomBox(e.target.value)
		  APP.peakchart.zoomSvgTriangle(container.clientWidth)
		}
		countrySel.onchange = function(e) {
			resizeSelect(e.target.options[e.target.selectedIndex].innerHTML)
			updateView(e, 'filter')
		}
		orderSel.onchange = function(e) {
			updateView(e, 'order')
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

	function updateView(e, field) {
		initView()
		let currentDataset = []
		let currentHighlight = []
		let selPar = e.target.options[e.target.selectedIndex].value
		let selContent = e.target.options[e.target.selectedIndex].innerHTML
		changeUiColor(APP.colors[selPar])
		//setSelectSize(selContent)
		if (field === 'filter') {
			currentDataset = APP.data.prepareData({filterValue: selPar})
			currentHighlight = APP.data.prepareHighlight({filterValue: selPar})
		} else {
			currentDataset = APP.data.prepareData({orderValue: selPar})
			currentHighlight = APP.data.prepareHighlight({orderValue: selPar})
		}
		APP.peakchart.updateTriangle(currentDataset)
		APP.scrollyTelling.initScrollingSet(currentHighlight)
	}

	function initView() {
		window.scrollTo(pageXOffset, 0)
		APP.peakchart.resetlightTriangle()
		self.zoomBox('0') //when data are filtered or sorted the zoom comes back to zero
	}

	function changeUiColor(color) {
		document.getElementsByTagName("header")[0].style.background = color
		document.getElementsByClassName("slider")[0].style.background = color
	}

	function resizeSelect(width) {
		dummyCountry.innerHTML = width
		countrySel.style.width = (20 + dummyCountry.offsetWidth) + 'px'
	}

	return self

}
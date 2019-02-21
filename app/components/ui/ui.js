function Ui() {

	var self = this

	const slider = document.getElementById("zoomslider")
	const output = document.getElementById("demo")
	const main = document.getElementById("main-container")
	const container = document.getElementById("peaks-container")
	const countrySel = document.getElementById("country-sel")
	const dummyCountry = document.getElementById("dummy-country")
	const orderSel = document.getElementById("order-sel")
	const svg = document.querySelector("svg#peaks-chart")
	const arrow = document.querySelector(".layer#ui #arrow")
	const progress = document.querySelector(".layer#ui #slider-progress")

	let interactionTh = 50

	self.init = function() {
		initView()
		setZoomScale()
		//sliderAnimation()
		slider.oninput = function(e) {
			output.innerHTML = e.target.value
			// checkThreshold() and enable/disable peak selection
			if (APP.peaksInWindow < interactionTh) {
				svg.style.pointerEvents = "all"
				APP.peakchart.setIntLightTriangle()
			} else {
				svg.style.pointerEvents = "none"
				APP.peakchart.resetlightTriangle()
			}
			e.target.value > 1 ? arrow.style.display = "none" : arrow.style.display = "block"
			self.zoomBox(e.target.value)
			APP.peakchart.zoomSvgTriangle(container.clientWidth)
		}
		countrySel.onchange = function(e) {
			resizeSelect(e.target.options[e.target.selectedIndex].innerHTML)
			document.querySelector("button#switch-mode").style.background = APP.colors[e.target.options[e.target.selectedIndex].value]
			updateView(e, 'filter')
		}
		orderSel.onchange = function(e) {
			updateView(e, 'order')
		}
		main.onscroll = function(e) {
			sliderIndicatorPosition()
		}
	}

	function sliderIndicatorSize(ratio) {
		const newWidth = Math.floor(ratio*100)
		newWidth < 80 ? progress.style.borderRadius = 0 : progress.style.borderRadius = '1rem'
		progress.style.width = newWidth + '%'
	}

	function sliderIndicatorPosition() {
		const offsetScroll = Math.floor((main.scrollLeft / container.clientWidth)*100)
		progress.style.left = offsetScroll + '%'
	}

	self.zoomBox = function(magnification) {
		//console.log('magnification: ', magnification)
		container.style.width = 100 + (parseInt(magnification)) + '%'
		const containerW = container.clientWidth
	  const mainW = main.clientWidth
	  const offsetW = (containerW - mainW) / 2
		main.scrollLeft = offsetW
	  slider.value = magnification
		output.innerHTML = slider.value
		sliderIndicatorSize(mainW/containerW)
	}

	function updateView(e, field) {
		initView()
		let currentDataset = []
		let currentHighlight = []
		let selPar = e.target.options[e.target.selectedIndex].value
		let selContent = e.target.options[e.target.selectedIndex].innerHTML
		changeUiColor(APP.colors[selPar])
		if (field === 'filter') {
			currentDataset = APP.data.prepareData({filterValue: selPar})
			if (APP.state === 'tour') {
				currentHighlight = APP.data.prepareHighlight({filterValue: selPar})
			}
		} else {
			currentDataset = APP.data.prepareData({orderValue: selPar})
			if (APP.state === 'tour') {
				currentHighlight = APP.data.prepareHighlight({orderValue: selPar})
			}
		}
		APP.peakchart.updateTriangle(currentDataset)
		setZoomScale()
		if (APP.state === 'tour') {
			APP.scrollyTelling.initScrollingSet(currentHighlight)
		}
	}

	function initView() {
		window.scrollTo(pageXOffset, 0)
		APP.peakchart.resetlightTriangle()
		self.zoomBox('0') //when data are filtered or sorted the zoom comes back to zero
		arrow.style.display = "block"
		document.querySelector("svg#peaks-chart").style.pointerEvents = "none"
	}

	function changeUiColor(color) {
		document.getElementsByTagName("header")[0].style.background = color
		// document.getElementsByClassName("slider")[0].style.background = color
		document.getElementById("slider-bkgd").style.background = color
		progress.style.background = color
	}

	function resizeSelect(width) {
		dummyCountry.innerHTML = width
		countrySel.style.width = (20 + dummyCountry.offsetWidth) + 'px'
	}

	function setZoomScale() { //sets slider zoom scale in order to have targetSpan px span between displayed peaks when zoom is max
		const targetSpan = 20
		const span = main.offsetWidth / APP.peakchart.dataLength
		const targetW = 20 * APP.peakchart.dataLength
		if (targetW > main.offsetWidth) {
			slider.style.opacity = 1
			slider.style.pointerEvents = 'all'
			const newMaxSlider = (targetW / main.offsetWidth) * 100 - 100
			slider.setAttribute("max", newMaxSlider)
		} else {
			slider.style.opacity = 0.25
			slider.style.pointerEvents = 'none'
		}
	}

	return self

}
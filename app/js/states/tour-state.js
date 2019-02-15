window.TourState = function () {

    let self = this
    let modeButton = document.querySelector("button#switch-mode")
    const stateName = {
			name: "explore"
		}
		const changeState = APP.switchState.bind(stateName)

		function prepareScene() {
			APP.ui.zoomBox(0) //set zoom level to 0
			APP.peakchart.zoomSvgTriangle(document.getElementById("peaks-container").clientWidth) //bring traiangles' zoom level to 0
			document.querySelector("#control .slidecontainer input").style.pointerEvents = "none"
			document.querySelector("#control .slidecontainer").style.opacity = .1
			document.querySelector("svg#peaks-chart").style.pointerEvents = "none"
			modeButton.innerHTML = "let's scroll"
			modeButton.style.pointerEvents = "none"
		}

    self.enter = function (option) {
			APP.state = 'tour'
			prepareScene()
			const selHighlight = APP.data.prepareHighlight()
			APP.scrollyTelling.initScrollingSet(selHighlight)
			modeButton.addEventListener('click', changeState)
    }

    self.leave = function (option) {
			modeButton.removeEventListener('click', changeState)
			APP.peakchart.resetlightTriangle()
			APP.scrollyTelling.reset()
    }

    return self

}
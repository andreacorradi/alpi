window.ExploreState = function () {

	let self = this
	const modeButton = document.querySelector("button#switch-mode")
  const stateName = {
    name: "tour"
	}
	const changeState = APP.switchState.bind(stateName)

	function prepareScene() {
		APP.peakinfo.close()
		document.querySelector("#control .slidecontainer input").style.pointerEvents = "all"
		document.querySelector("#control .slidecontainer").style.opacity = 1
		document.querySelector("svg#peaks-chart").style.pointerEvents = "all"
		document.querySelector("button#switch-mode").innerHTML = "tour"
		modeButton.innerHTML = "start " + stateName.name
	}

  self.enter = function (option) {
		APP.state = 'explore'
		prepareScene()
		modeButton.addEventListener('click', changeState)
	}
	
  self.leave = function (option) {
		modeButton.removeEventListener('click', changeState)
  }

  return self

}
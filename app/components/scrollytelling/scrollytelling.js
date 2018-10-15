function ScrollyTelling() {

	var self = this
	let highlightSet = []

	self.init = function() {
		const scroller = scrollama()
		scroller
		  .setup({
		  	offset: 0.9,
		    step: '.tour-caption' // class name of trigger steps
		  })
		  .onStepEnter(handleStepEnter)
		  .onStepExit(handleStepExit)
		APP.data.selHighlight = APP.data.prepareHighlight()
	}

	function handleStepEnter(e) {
	  console.log('enter ' + e.index)
	  const highlightObj = APP.data.selHighlight[e.index]
	  APP.peakchart.highlightTriangle(highlightObj.mountain)
  	fillCaption(e.index)
	}

	function handleStepExit(e) {
	  console.log('exit ' + e.index)
	  if (e.index === 0 && e.direction === "up") APP.peakchart.resetlightTriangle() 
	}

	function fillCaption(step) {
		const selHighlightMode = highlightData.filter((h) => h.mode === APP.data.orderValue)[0].steps
		const caption = selHighlightMode[step].caption
		const el = d3.select('#scrollytelling .tour-caption[data-step="' + (step) + '"]')
		el.text(caption)
	}

	return self

}
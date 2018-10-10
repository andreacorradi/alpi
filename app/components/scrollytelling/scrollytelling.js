function ScrollyTelling() {

	var self = this

	self.init = function() {
		// instantiate the scrollama
		const scroller = scrollama()
		scroller
		  .setup({
		  	offset: 0.9,
		    step: '.tour-caption' // class name of trigger steps
		  })
		  .onStepEnter(handleStepEnter)
		  .onStepExit(handleStepExit)

		function handleStepEnter(e) {
		  console.log('enter ' + e.element.dataset.step)
		  const highlightObj = filterHighlight(e.element.dataset.step)
		  if (!highlightObj.hasOwnProperty('mountainFuncKey')) {
	  		APP.peakchart.highlightTriangle(highlightObj.mountain)
		  } else {
				const funcName = APP.peakchart[highlightObj.mountainFuncKey]
				const objToHighlight = funcName()
		  	const peaksToHighlight = objToHighlight.map(m => {
		  		return {name: m.mountain, rank: m.rank}
		  	})
		  	APP.peakchart.highlightTriangle(peaksToHighlight)
		  }
	  	fillCaption(e.element.dataset.step)
		}
		function handleStepExit(e) {
		  console.log('exit ' + e.element.innerHTML)
		  //APP.peakchart.resetlightTriangle()
		}

		function filterHighlight(step) {
			const selHighlightMode = APP.highlight.filter((h) => h.mode === APP.peakchart.orderValue)[0].steps
			return selHighlightMode[step]
		}
		function fillCaption(step) {
			const selHighlightMode = APP.highlight.filter((h) => h.mode === APP.peakchart.orderValue)[0].steps
			const caption = selHighlightMode[step].caption
			const el = d3.select('#scrollytelling .tour-caption[data-step="' + (step) + '"]')
			el.text(caption)
		}
	}

	return self

}
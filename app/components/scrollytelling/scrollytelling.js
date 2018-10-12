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
		  console.log('enter ' + e.index)
		  const highlightObj = filterHighlight(e.index)
		  APP.peakchart.highlightTriangle(highlightObj.mountain)
	  	fillCaption(e.index)
		}
		function handleStepExit(e) {
		  console.log('exit ' + e.index)
		  if (e.index === 0 && e.direction === "up") APP.peakchart.resetlightTriangle() 
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
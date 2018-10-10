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
		  const obj = filterHighlight(e.element.dataset.step)
	  	APP.peakchart.highlightTriangle(obj.mountain)
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
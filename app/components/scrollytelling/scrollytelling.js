function ScrollyTelling() {

	var self = this

	//const scrollingContainer = document.getElementById("scroll-container")

	self.init = function() {
		const scroller = scrollama()
		scroller
		  .setup({
		  	offset: 0.9,
		    step: '.tour-caption' // class name of trigger steps
		  })
		  .onStepEnter(handleStepEnter)
		  .onStepExit(handleStepExit)
	}

	self.initScrollingSet = function() {
		resetScrollingSet()
		d3.select('#scrollytelling #scroll-container').selectAll('.tour-caption')
			.data(APP.data.selHighlight)
			.enter()
			.append('div')
				.attr('class', 'tour-caption')
				.attr('data-step', (d, i) => i.toString())
		self.init()
	}

	function resetScrollingSet() {
		d3.select('#scrollytelling #scroll-container').selectAll('.tour-caption').remove()
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
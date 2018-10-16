function ScrollyTelling() {

	var self = this

	//const scrollingContainer = document.getElementById("scroll-container")

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

	function resetScrollingSet() {
		d3.select('#scrollytelling #scroll-container').selectAll('.tour-caption').remove()
	}

	function handleStepEnter(e) {
	  console.log('enter ' + e.index)
	  const highlightObj = APP.data.selHighlight[e.index]
	  APP.peakchart.highlightTriangle(highlightObj.mountain, e.index)
  	fillCaption(highlightObj.mountain, e.index)
	}

	function handleStepExit(e) {
	  console.log('exit ' + e.index)
	  if (e.index === 0 && e.direction === "up") APP.peakchart.resetlightTriangle() 
	}

	function fillCaption(subset, step) {
		const el = d3.select('#scrollytelling .tour-caption[data-step="' + (step) + '"]')
		const caption = APP.data.selHighlight[step].caption
		let currCaption
		if (_.isArray(subset)) currCaption = caption
		else { currCaption = caption.split('*')[0] + APP.peakchart.calcPar(subset) + caption.split('*')[1] }
		el.text(currCaption)
	}

	return self

}
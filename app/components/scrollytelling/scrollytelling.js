function ScrollyTelling() {

	var self = this

	let highlightObjSet = highlightData

	self.initScrollingSet = function(set) {
		highlightObjSet = set
		console.log('highlightObjSet: ', highlightObjSet)
		resetScrollingSet()
		d3.select('#scrollytelling #scroll-container').selectAll('.tour-caption')
			.data(highlightObjSet)
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
	  const highlightEls = highlightObjSet[e.index].mountain
	  APP.peakchart.highlightTriangle(highlightEls)
  	fillCaption(e.index)
	}

	function handleStepExit(e) {
	  console.log('exit ' + e.index)
	  if (e.index === 0 && e.direction === "up") APP.peakchart.resetlightTriangle() 
	}

	function fillCaption(step) {
		const el = d3.select('#scrollytelling .tour-caption[data-step="' + (step) + '"]')
		const caption = highlightObjSet[step].caption
		let currCaption
		if (!caption.includes('*')) currCaption = caption
		else currCaption = caption.split('*')[0] + highlightObjSet[step].mountain.length + caption.split('*')[1]
		el.text(currCaption)
	}

	return self

}
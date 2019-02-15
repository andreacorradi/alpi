function ScrollyTelling() {

	var self = this

	let highlightObjSet = highlightData

	self.initScrollingSet = function(set) {
		highlightObjSet = set
		console.log('highlightObjSet: ', highlightObjSet)
		self.reset()
		d3.select('#scrollytelling #scroll-container').selectAll('.tour-caption-wrapper')
			.data(highlightObjSet)
			.enter()
			.append('div')
				.attr('class', 'tour-caption-wrapper')
				.attr('data-step', (d, i) => i.toString())
			.append('div')
				.attr('class', 'tour-caption')
		self.init()
	}

	self.init = function() {
		const scroller = scrollama()
		scroller
		  .setup({
		  	offset: 0.9,
		    step: '.tour-caption-wrapper' // class name of trigger steps
		  })
		  .onStepEnter(handleStepEnter)
			.onStepExit(handleStepExit)
		console.log('scroller', scroller)
	}

	self.reset = function() {
		d3.select('#scrollytelling #scroll-container').selectAll('.tour-caption-wrapper').remove()
	}

	function handleStepEnter(e) {
		console.log('enter ' + e.index)
		if (e.index === 0) {
			document.querySelector("button#switch-mode").style.pointerEvents = "all"
			document.querySelector("button#switch-mode").innerHTML = "end tour"
		}
	  const highlightEls = highlightObjSet[e.index].mountain
	  APP.peakchart.highlightTriangle(highlightEls)
  	fillCaption(e.index)
	}

	function handleStepExit(e) {
		console.log('exit ' + e.index, pageYOffset)
	  if (pageYOffset <= 100) APP.peakchart.resetlightTriangle() 
	}

	function fillCaption(step) {
		const el = d3.select('#scrollytelling .tour-caption-wrapper[data-step="' + (step) + '"] .tour-caption')
		const caption = highlightObjSet[step].caption
		let currCaption
		if (!caption.includes('*')) currCaption = caption
		else currCaption = caption.split('*')[0] + highlightObjSet[step].mountain.length + caption.split('*')[1]
		el.text(currCaption)
	}

	return self

}
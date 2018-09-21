const fs = require('fs')
const wiki = require('wikijs').default

const ranges = ['List_of_mountains_of_the_Alps_above_3000_m', 'List_of_mountains_of_the_Alps_(2500–2999_m)', 'List_of_mountains_of_the_Alps_(2000–2499_m)']
 
function download(range) {
	wiki()
		.page(range)
	  .then(page => page.html())
	  .then(response => {
	  	fs.writeFileSync(`./output/${range}.html`, response)
	  })
}

ranges.forEach(download)
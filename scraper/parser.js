const fs = require('fs')
const cheerio = require('cheerio')
const d3 = require('d3')
const axios = require('axios')

const inputDir = './output'
const header = []
let mountains = []
let promises = []
let errFlag = false

function createHeader(file) {
	const html = fs.readFileSync(`${inputDir}/${file}`, 'utf-8')
	const $ = cheerio.load(html)
	const headerEls = $('.mw-parser-output table.wikitable').eq(2).find('tr').eq(0).children()
	headerEls.each((i, el) => {
		// .slice(0, -1) removes the carriage return, .replace(/ *\[[^)]*\] */g, "") removes the content between [], .replace(/ *\([^)]*\) */g, "") removes the content between ()
		header.push($(el).text().slice(0, -1).replace(/ *\[[^)]*\] */g, "").replace(/ *\([^)]*\) */g, ""))
	})
}

function extractPeaks(file) {
	//console.log(file)
	const html = fs.readFileSync(`${inputDir}/${file}`, 'utf-8')
	const $ = cheerio.load(html)
	let records
	if (file === 'List_of_mountains_of_the_Alps_above_3000_m.html') {
		records = $('.mw-parser-output table.wikitable').eq(2).find('tr:not(:first-child)')
	} else {
		records = $('table.wikitable tr:not(:first-child)')
	}
	records.each((i, el) => {
		let mountain = {}

		let promise = new Promise((resolve, reject) => {
			
			$(el).find('td').each((j, sel) => {
				const field = header[j]
				switch(j) {
			    case (0):
		        mountain[field] = parseInt($(sel).text().slice(0, -1))
		        break
		      case (1):
		        mountain[field] = $(sel).text().slice(0, -1)
		        const link = $(sel).find('a').attr('href')
		        

		        const uri = 'https://en.wikipedia.org' + link
			      const instance = axios.create({
						  baseURL: uri,
						  timeout: 5000
						})
		        instance.get(uri)
						  .then(function (response) {
						  	// const $ = cheerio.load(response.body)
						  	console.log(mountain['Mountain'])
								mountain['MountainLink'] = link
						    mountain['MountainImgSrc'] = 'puppa'
						  })
						  .catch(function (err) {
						  	if (!errFlag) {
						    	// console.log("pheeeeeeega!", err, mountain)
						  	}
						  	errFlag = true
						  	mountain['MountainLink'] = 'stocazzo'
						  })
		        break
		      case (2):
		        mountain[field] = parseInt($(sel).text().slice(0, -1))
		        break
		      case (3):
		        mountain[field] = parseInt($(sel).text().slice(0, -1))
		        break
	       	case (4):
		        mountain['lat'] = $(sel).find('.latitude').text()
		        mountain['lon'] = $(sel).find('.longitude').text()
	        break
			    default:
		        mountain[field] = $(sel).text().slice(0, -1)
				}
			})
			resolve(mountain)
		  
		})

		mountains.push(promise)

		//console.log(mountain)
		//mountains.push(mountain)
	})
}

function init() {
	const files = fs
		.readdirSync(inputDir)
		.filter(d => d.includes('.html'))

	createHeader(files[2])
	//console.log(header)
	files.map(extractPeaks)

	Promise.all(mountains)
		.then((mountains) => {
			const rankedMountains = mountains.filter((m) => {
				return Number.isInteger(m.Rank)
			})
			rankedMountains.sort((x, y) => {
				return d3.ascending(x.Rank, y.Rank);
			})
			console.log(rankedMountains)
			const output = d3.csvFormat(rankedMountains)
			fs.writeFileSync('./output/mountains.csv', output)
		})

}

init()
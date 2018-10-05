//1605 mountains, 54 without rank > 1551 ranked mountains
const fs = require('fs')
const cheerio = require('cheerio')
const d3 = require('d3')
const request = require('request')
var parseDMS = require('parse-dms')

const inputDir = './output'
const header = []
let mountains = []
let promises = []
let errFlag = false
let retry = []

function createHeader(file) {
	const html = fs.readFileSync(`${inputDir}/${file}`, 'utf-8')
	const $ = cheerio.load(html)
	const headerEls = $('.mw-parser-output table.wikitable').eq(2).find('tr').eq(0).children()
	headerEls.each((i, el) => {
		// .slice(0, -1) removes the carriage return, .replace(/ *\[[^)]*\] */g, "") removes the content between [], .replace(/ *\([^)]*\) */g, "") removes the content between ()
		header.push($(el).text().slice(0, -1).replace(/ *\[[^)]*\] */g, "").replace(/ *\([^)]*\) */g, ""))
	})
}

function extractImg(resolve, mountain, link) {
	const uri = 'https://en.wikipedia.org' + link
  request(uri, { timeout: 15000 }, (err, response, body) => {
  	if (err) {
  		console.log('ERR', mountain['Rank'] + '/1551', mountain['Mountain'])
  		mountain['MountainImgSrc'] = 'Error'
  		retry.push(link)
  	} else {
  		console.log('OK', mountain['Rank'] + '/1551', mountain['Mountain'])
  		const $ = cheerio.load(body)
			const imgThumbSrc = 'https:' + $('table.infobox.vcard .image img').attr('src')
  		//console.log(imgThumbSrc)
  		mountain['MountainImgSrc'] = imgThumbSrc
  	}
  	resolve(mountain)
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
	records
		.filter((k, el) => { 
			return $(el).find('td:first-child').text().slice(0, -1) !== '' //removes unranked peaks
		})
		.each((i, el) => {
			let mountain = {}
			let promise = new Promise((resolve, reject) => {
				$(el).find('td').each((j, sel) => {
					const field = header[j]
					switch(j) {
				    case (0):
			        mountain[field] = parseInt($(sel).text().slice(0, -1))
			        break
			      case (1):
			        mountain[field] = $(sel).text().slice(0, -1).replace(/ *\[[^)]*\] */g, "")
			        const link = $(sel).find('a').attr('href')
			        if ( link.includes('&action=edit') ) {
			        	mountain['MountainLink'] = 'noPage'
			        	mountain['MountainImgSrc'] = 'noImg'
			        	resolve(mountain)
			        } else {
				        mountain['MountainLink'] = link
				        extractImg(resolve, mountain, link)
			        }
			        break
			      case (2):
			        mountain[field] = parseInt($(sel).text().slice(0, -1))
			        break
			      case (3):
			        mountain[field] = parseInt($(sel).text().slice(0, -1))
			        break
		       	case (4):
		       	const DMScoord = [ $(sel).find('.latitude').text(), $(sel).find('.longitude').text() ]
			        mountain['lat'] = parseDMS( DMScoord[0] ).lat
			        mountain['lon'] = parseDMS( DMScoord[1] ).lon
		        break
				    default:
			        mountain[field] = $(sel).text().slice(0, -1)
					}
				})		  
			}) //with peak images
			mountains.push(promise) //with peak images
			// mountains.push(mountain) //without peak images
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
			console.log(retry.length, retry)
			const rankedMountains = mountains.filter((m) => {
				return Number.isInteger(m.Rank)
			})
			rankedMountains.sort((x, y) => {
				return d3.ascending(x.Rank, y.Rank);
			})
			//console.log(rankedMountains)
			const output = d3.csvFormat(rankedMountains)
			fs.writeFileSync('./output/mountains.csv', output)
		})

}

init()
const axios = require('axios')

const uri = 'https://en.wikipedia.org' //+ link
const instance = axios.create({
  baseURL: uri,
  timeout: 100000
})
instance.get(uri)
  .then(function (response) {
  	//const $ = cheerio.load(response.body)
    console.log('puppa')
  })
  .catch(function (err) {
    console.log("pheeeeeeega!", err)
  })
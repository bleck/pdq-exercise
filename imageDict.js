const parser = require('node-html-parser')
const axios = require('axios')

// Constants
const aboutUsURL = "https://www.pdq.com/about-us"
const queryForImages = ".imghvr-fade img"
const imageFilterText = "-fun"

// Data store
let dict

// Function to reduce array like ["foo=1", "foo=2"] to {foo: 1, foo: 2}
const arrToObj = (obj, item) => {
	obj[item[1].split("=")[1]] = item[0].split("=")[1]
	return obj
}

const initDB = async () => {
  let imageDict
  try{
    const aboutUsHTMLRequest = await axios.get(aboutUsURL)
    // Parse the response, and then query for the images
    const parsedHTML = parser.parse(aboutUsHTMLRequest.data)
    const images = parsedHTML.querySelectorAll(queryForImages)
    // Convert array of HTML elements and convert them to an object
    dict = images
    .filter(i => !i.rawAttrs.includes(imageFilterText))
    .map(i => 
        i.rawAttrs
        .replace(/"/g, "")
        .split(" "))
    .reduce(arrToObj, {})
  } catch(e){
    
  }
}

const getImage = (k) => {
  return dict[k]
}

initDB()
  .then(() => {
    console.log("Image data loaded...")
  })
  .catch(e => console.log("Failed to get images, further debugging needed", e))

module.exports = getImage
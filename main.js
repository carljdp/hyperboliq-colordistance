const path = require('path')
const Jimp = require('jimp')

const inputImageRelativePath = path.join('testData')
const inputImageFilename = path.join('input.jpg')
const inputImageUri = path.join(__dirname, inputImageRelativePath, inputImageFilename) 

async function getImageFromDisk(fileName) {
  try {
    const readResult = await Jimp.read(fileName)
    return readResult
  } catch (error) {
    console.error(error)
    process.exit()
  }
}

// MAIN
async function main() {
  console.log('\n[MOSAIC] Strating ..')

  // get image & dimensions
  let inputImage = await getImageFromDisk(inputImageUri)
  console.log(`[MOSAIC] Input Image Dimensions: ${inputImage.bitmap.width}w x ${inputImage.bitmap.height}h`)

  // resize or crop to an easy to use size


  // divide `input.jpg` into a 20x20 grid of _parts_


  // get average RGB for each input image part


  // get average RGB for each tile image


  // substitute each part of `input.jpg` with the closest matching tile (from tiles folder)


  // save as new  `output.jpg`


  console.log('[MOSAIC] End.\n')
}

// RUN
main()

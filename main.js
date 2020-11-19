const path = require('path')
const Jimp = require('jimp')

const inputImageRelativePath = path.join('testData')
const inputImageFilename = 'input.jpg'
const inputImageUri = path.join(__dirname, inputImageRelativePath, inputImageFilename) 

const desiredPartsInWidth = 20
const desiredPartsInHeight = 20

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
  let inputImageOriginal = await getImageFromDisk(inputImageUri)
  console.log(`[MOSAIC] Input Image Dimensions (original):   ${inputImageOriginal.bitmap.width}w x ${inputImageOriginal.bitmap.height}h`)

  // resize or crop to an easy to use size
  const normalizedInputImageWidth = (Math.ceil(inputImageOriginal.bitmap.width / desiredPartsInWidth) * desiredPartsInWidth)
  const normalizedInputImageHeight = (Math.ceil(inputImageOriginal.bitmap.height / desiredPartsInHeight) * desiredPartsInHeight)
  const inputImageNormalized = inputImageOriginal.cover(normalizedInputImageWidth, normalizedInputImageHeight)
  console.log(`[MOSAIC] Input Image Dimensions (normalized): ${inputImageNormalized.bitmap.width}w x ${inputImageNormalized.bitmap.height}h`)

  // divide `input.jpg` into a 20x20 grid of _parts_


  // get average RGB for each input image part


  // get average RGB for each tile image


  // substitute each part of `input.jpg` with the closest matching tile (from tiles folder)


  // save as new  `output.jpg`


  console.log('[MOSAIC] End.\n')
}

// RUN
main()

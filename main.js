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

function getAverageRgb(jimp) {

  const pixelCount = jimp.bitmap.width * jimp.bitmap.height
  let totalR = 0
  let totalG = 0
  let totalB = 0

  jimp.scan(0, 0, jimp.bitmap.width, jimp.bitmap.height, function(x, y, idx) {
    totalR += Math.pow(this.bitmap.data[idx + 0], 2)
    totalG += Math.pow(this.bitmap.data[idx + 1], 2)
    totalB += Math.pow(this.bitmap.data[idx + 2], 2)
  })

  const sRgb = {
    r: Math.sqrt(totalR/pixelCount),
    g: Math.sqrt(totalG/pixelCount),
    b: Math.sqrt(totalB/pixelCount)
  }

  return sRgb 
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

  // divide `input.jpg` into a 20x20 grid of parts
  const partWidth = inputImageNormalized.bitmap.width / desiredPartsInWidth
  const partHeight = inputImageNormalized.bitmap.height / desiredPartsInHeight
  console.log(`[MOSAIC] Tile Image Dimensions (normalized):   ${partWidth}w x  ${partHeight}h`)
  let gridPart = []
  for (let row = 0; row < desiredPartsInHeight; row++) {
    if (!gridPart[row]) gridPart[row] = []
    for (let column = 0; column < desiredPartsInWidth; column++) {

      part = inputImageNormalized.clone().crop( 
        column * partWidth, 
        row * partHeight, 
        partWidth,
        partHeight
      )
      gridPart[row][column] = {
        jimp: part,
        averageRgb: getAverageRgb(part)
      }
    }
  }
  console.log(`[MOSAIC] Tile [0][0] average RGB: ${JSON.stringify(gridPart[0][0].averageRgb)}`)
  console.log(`[MOSAIC] Tile [0][1] average RGB: ${JSON.stringify(gridPart[0][1].averageRgb)}`)


  // get average RGB for each tile image


  // substitute each part of `input.jpg` with the closest matching tile (from tiles folder)


  // save as new  `output.jpg`


  console.log('[MOSAIC] End.\n')
}

// RUN
main()

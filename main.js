const path = require('path')
const fs = require('fs')
const Jimp = require('jimp')

const inputImageRelativePath = path.join('testData')
const inputImageFilename = 'input.jpg'
const inputImageUri = path.join(__dirname, inputImageRelativePath, inputImageFilename)


const tilesDirRelativePath = path.join('testData/tiles')

const desiredPartsInWidth = 24
const desiredPartsInHeight = 32
const upScaleInput = 3

const SUPPORTED_IMAGE_EXTENTIONS = /\.(jpe?g|png|bmp|tiff|gif|)$/ig

async function getImageFromDisk(fileName) {
  try {
    const readResult = await Jimp.read(fileName)
    return readResult
  } 
  catch (error) {
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

async function getListOfFileNamesInDir(dir) {

  try {
    const readResult = await fs.promises.readdir(dir)
    return readResult
  } 
  catch (error) {
    console.error(error)
    process.exit()
  }
}

function convertRgbToXyz(rgb) {
  // Pseudo code from: http://www.easyrgb.com/en/math.php

  let R = rgb.r / 255
  let G = rgb.g / 255
  let B = rgb.b / 255

  if ( R > 0.04045 ) 
    R = Math.pow( ((R + 0.055) / 1.055), 2.4 )
  else 
    R = R / 12.92
  if ( G > 0.04045 ) 
    G = Math.pow( ((G + 0.055) / 1.055), 2.4 )
  else 
    G = G / 12.92
  if ( B > 0.04045 ) 
    B = Math.pow( ((B + 0.055) / 1.055), 2.4 )
  else 
    B = B / 12.92

  R = R * 100
  G = R * 100
  B = R * 100

  let X = R * 0.4124 + G * 0.3576 + B * 0.1805
  let Y = R * 0.2126 + G * 0.7152 + B * 0.0722
  let Z = R * 0.0193 + G * 0.1192 + B * 0.9505

  return {x:X, y:Y, z:Z}
}

function convertXyzToRgb(xyz) {
  // Pseudo code from: http://www.easyrgb.com/en/math.php

  let X = xyz.x / 100
  let Y = xyz.y / 100
  let Z = xyz.z / 100

  let R = X *  3.2406 + Y * -1.5372 + Z * -0.4986
  let G = X * -0.9689 + Y *  1.8758 + Z *  0.0415
  let B = X *  0.0557 + Y * -0.2040 + Z *  1.0570

  if (R > 0.0031308) 
    R = 1.055 * (Math.pow(R, 1/2.4)) - 0.055
  else
    R = 12.92 * R

  if (G > 0.0031308) 
    G = 1.055 * (Math.pow(G, 1/2.4)) - 0.055
  else
    G = 12.92 * G

  if (B > 0.0031308) 
    B = 1.055 * (Math.pow(B, 1/2.4)) - 0.055
  else
    B = 12.92 * B

  R = R * 255
  G = G * 255
  B = B * 255

  return {r:R, g:G, b:B}
}

function convertXyzToCieLab(xyz) {
  // Pseudo code from: http://www.easyrgb.com/en/math.php

  let referenceX = 1
  let referenceY = 1
  let referenceZ = 1

  let X = xyz.x / referenceX
  let Y = xyz.y / referenceY
  let Z = xyz.z / referenceZ

  if ( X > 0.008856 ) X = Math.pow(X, (1/3))
  else
    X = ( 7.787 * X ) + ( 16 / 116 )

  if ( Y > 0.008856 ) Y = Math.pow(Y, (1/3))
  else
    Y = ( 7.787 * Y ) + ( 16 / 116 )

  if ( Z > 0.008856 ) Z = Math.pow(Z, (1/3))
  else
    Z = ( 7.787 * Z ) + ( 16 / 116 )

  let cieL = (116 * Y) - 16
  let cieA = 500 * (X - Y)
  let cieB = 200 * (Y - Z)

  const cieLab = {
    l: cieL,
    a: cieA,
    b: cieB
  }
  return cieLab
}

function convertCieLabToXyz(cieLab) {
  // Pseudo code from: http://www.easyrgb.com/en/math.php

  let referenceX = 1
  let referenceY = 1
  let referenceZ = 1

  let Y = ( cieLab.l + 16 ) / 116
  let X = cieLab.a / 500 + Y
  let Z = Y - cieLab.b / 200

  if (Math.pow(Y, 3)  > 0.008856 ) 
    Y = Math.pow(Y, 3)
  else
    Y = ( Y - 16 / 116 ) / 7.787

  if (Math.pow(X, 3)  > 0.008856 ) 
    X = Math.pow(X, 3)
  else
    X = ( X - 16 / 116 ) / 7.787

  if (Math.pow(Z, 3)  > 0.008856 ) 
    Z = Math.pow(Z, 3)
  else
    Z = ( Z - 16 / 116 ) / 7.787

  X = X * referenceX
  Y = Y * referenceY
  Z = Z * referenceZ

  const Xyz = {
    x: X,
    y: Y,
    z: Z
  }

  return Xyz
}

/**
 * Get color distance (CIE-L*ab color space)
 * @param {*} cie1 CIE-L*ab color1
 * @param {*} cie2 CIE-L*ab color2
 */
function deltaE(cie1, cie2) {
  return Math.sqrt(
    Math.pow((cie1.l - cie2.l), 2) + 
    Math.pow((cie1.a - cie2.a), 2) + 
    Math.pow((cie1.b - cie2.b), 2)
  )
}

// MAIN
async function main() {
  console.log('\n[MOSAIC] Starting ..')

  // get image & dimensions
  let inputImageOriginal = (await getImageFromDisk(inputImageUri)).scale(upScaleInput)
  console.log(`[MOSAIC] Input image dimensions: ${inputImageOriginal.bitmap.width}w x ${inputImageOriginal.bitmap.height}h (upscaled by ${upScaleInput})`)
  console.log(`[MOSAIC]  to be divided into ${desiredPartsInWidth} parts wide, by ${desiredPartsInHeight} parts high`)


  // resize or crop to an easy to use size
  const normalizedInputImageWidth = (Math.ceil(inputImageOriginal.bitmap.width / desiredPartsInWidth) * desiredPartsInWidth)
  const normalizedInputImageHeight = (Math.ceil(inputImageOriginal.bitmap.height / desiredPartsInHeight) * desiredPartsInHeight)
  const inputImageNormalized = inputImageOriginal.cover(normalizedInputImageWidth, normalizedInputImageHeight)
  console.log(`[MOSAIC]  rezised (to fit tiles): ${inputImageNormalized.bitmap.width}w x ${inputImageNormalized.bitmap.height}h`)


  // divide `input.jpg` into a 20x20 grid of parts
  const partWidth = inputImageNormalized.bitmap.width / desiredPartsInWidth
  const partHeight = inputImageNormalized.bitmap.height / desiredPartsInHeight
  console.log(`[MOSAIC] Part dimensions: ${partWidth}w x  ${partHeight}h`)
  console.log(`[MOSAIC] Analyzing input image..`)
  process.stdout.write('[MOSAIC]  ')
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
      const averageRgb = getAverageRgb(part)
      const cieLab = convertXyzToCieLab(convertRgbToXyz(averageRgb))
      gridPart[row][column] = {
        jimp: part,
        averageRgb,
        cieLab
      }
    }
    process.stdout.write('.')
  }
  process.stdout.write('\n')
  //console.log(`[MOSAIC] Part [0][0] average RGB: ${JSON.stringify(gridPart[0][0].averageRgb)}; width: ${gridPart[0][0].jimp.bitmap.width}, height: ${gridPart[0][0].jimp.bitmap.height}`)
  //console.log(`[MOSAIC] Part [0][1] average RGB: ${JSON.stringify(gridPart[0][1].averageRgb)}; width: ${gridPart[0][1].jimp.bitmap.width}, height: ${gridPart[0][1].jimp.bitmap.height}`)


  // get average RGB for each tile image
  console.log(`[MOSAIC] Analyzing tile images..`)
  process.stdout.write('[MOSAIC]  ')
  const allFilesInDir = await getListOfFileNamesInDir(path.join(__dirname, tilesDirRelativePath))
  const supportedFilesInDir = allFilesInDir.filter( fileName => {
    return (fileName.match(SUPPORTED_IMAGE_EXTENTIONS) !== null)
  })
  let poolOfPromises = supportedFilesInDir.map( async imageFileName => {
    try {
      const tileImage = await getImageFromDisk(path.join(__dirname, tilesDirRelativePath, imageFileName))
      const tileImageNormalized = tileImage.cover(partWidth, partHeight)
      const averageRgb = getAverageRgb(tileImageNormalized)
      const cieLab = convertXyzToCieLab(convertRgbToXyz(averageRgb))
      process.stdout.write('.')
      return {
        fileName: imageFileName,
        path: path.join(__dirname, tilesDirRelativePath),
        jimp: tileImageNormalized,
        averageRgb,
        cieLab
      }
    } catch (error) {
      console.error(error)
      process.exit()
    }
  })
  let poolOfTiles
  try {
    poolOfTiles = await Promise.all(poolOfPromises)
    process.stdout.write('\n')
  } catch (error) {
    console.error(error)
    process.exit()
  }
  //console.log(`[MOSAIC] Tile [0] average RGB: ${JSON.stringify(poolOfTiles[0].averageRgb)}; width: ${poolOfTiles[0].jimp.bitmap.width}, height: ${poolOfTiles[0].jimp.bitmap.height}`)
  //console.log(`[MOSAIC] Tile [1] average RGB: ${JSON.stringify(poolOfTiles[1].averageRgb)}; width: ${poolOfTiles[1].jimp.bitmap.width}, height: ${poolOfTiles[1].jimp.bitmap.height}`)


  // substitute each part of `input.jpg` with the closest matching tile (from tiles folder)
  console.log(`[MOSAIC] Composing new output image..`)
  let canvas = new Jimp(inputImageNormalized.bitmap.width, inputImageNormalized.bitmap.height)
  process.stdout.write('[MOSAIC]  ')
  for (let row = 0; row < desiredPartsInHeight; row++) {
    for (let column = 0; column < desiredPartsInWidth; column++) {

      const targetCieLab = gridPart[row][column].cieLab
      
      const bestMatch = poolOfTiles
        .map( (tile, idx) => {
          return {
            distance: deltaE(gridPart[row][column].cieLab, tile.cieLab),
            //jimp: tile.jimp,
            tileId: idx
          }
        }).sort( (a, b) => a.distance - b.distance)[0]

      //console.log(`For part [${row}][${column}] bestMatch is tile [${bestMatch.tileId}]`)
      canvas = canvas.composite(poolOfTiles[bestMatch.tileId].jimp, column * partWidth, row * partHeight)
    }
    process.stdout.write('.')
  }
  process.stdout.write('\n')
  console.log(`[MOSAIC] Output Image Dimensions (normalized): ${canvas.bitmap.width}w x ${canvas.bitmap.height}h`)


  // save as new  `output.jpg`
  canvas.write(path.join(__dirname, 'output.jpg'))
  console.log('[MOSAIC] Done.\n')
}

// RUN
main()

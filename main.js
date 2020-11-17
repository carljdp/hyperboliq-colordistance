const Jimp = require('jimp')

const RELATIVE__INPUT_IMAGE = './testData/input.jpg'
const RELATIVE__TILES_DIR = './testData/nautilus'

console.log('[MOSAIC] Strating ..\n')

// See if we can read images & print the dimensions
const readImageDone = Jimp.read(RELATIVE__INPUT_IMAGE)
  .then(image => {
    console.log(`Dimensions: ${image.bitmap.width}w x ${image.bitmap.height}h`)
  })
  .catch(err => {
    console.error(err);
  });

Promise.all([readImageDone]).then( () => {console.log('\n[MOSAIC] End.')})
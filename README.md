# hyperboliq-mosaic

---  

## Kata | Challenge  
  
> You can download this image dataset that should work pretty well: https://drive.google.com/drive/folders/1kLMG1pa3xV_TwK0DnibSbjYrj_hjGttf  
> 
> Program should take a large image, and a folder with tile images as input params  
>  
> 1. Calculate avg RGB for each tile image (Avg R, Avg G, Avg B)  
> 2. Divide our input image in 20x20 parts. (You can change this however you like)  
> 3. Calculate the avg RGB for each of the 400 parts in our input image.  
> 4. Calculate the distance between every tile (AVG RGB) and every part of our image (AVG RGB):  
>  
> We don't want to use euclidian distance to calculate our distances between colours since this does not take human colour perception into account  
> 
> Instead let's use `Delta E * CIE` and then use these transformations to go from RGB-> CIE-L*ab to do the calculation. Also see http://www.easyrgb.com/en/math.php  
> 5. Choose the tiles with the smallest distance, resize them and replace that image part with the tile  
> 6. Save output image  

## To do | Work in Progress

- [x] read `input.jpg`, & get its dimensions
- [x] resize/crop `input.jpg` to be an easy to use size
- [x] divide `input.jpg` into a 20x20 grid of _parts_
- [x] get average RGB for each input image part
- [x] get average RGB for each tile image
- [ ] substitute each part of `input.jpg` with the closest matching tile (from tiles folder)
- [ ] save as new  `output.jpg`

---

# Developer Guide

## Prerequisites
- Node.js runtime (latest LTS)
- Git

From your home or Projects directory:
- `git clone https://github.com/carljdp/hyperbolic-mosaic.git` (clone repo)
- `cd hyperboliq-mosaic`
- `npm install` (install dependencies)
- `npm start` (start script)


## Test data
Sample images taken from caltec-101 dataset (101_ObjectCategories/nautilus)
- `./testData/input.jpg` - the target-image to be generated
- `./testData/tiles/*.jpg` - images to use as tiles for generating the target-image


philip wolmerans, tzaneen, cape town, via flippe
farm steer app
# hyperboliq-mosaic

---  

## Kata | Challenge  
  
> You can download this image dataset that should work pretty well: https://drive.google.com/drive/folders/1kLMG1pa3xV_TwK0DnibSbjYrj_hjGttf  
> 
> Program should take a large image, and a folder with tile images as input params  
>  
> [ ] Calculate avg RGB for each tile image (Avg R, Avg G, Avg B)  
> [ ] Divide our input image in 20x20 parts. (You can change this however you like)  
> [ ] Calculate the avg RGB for each of the 400 parts in our input image.  
> [ ] Calculate the distance between every tile (AVG RGB) and every part of our image (AVG RGB):  
>  
> We don't want to use euclidian distance to calculate our distances between colours since this does not take human colour perception into account  
> 
> Instead let's use `Delta E * CIE` and then use these transformations to go from RGB-> CIE-L*ab to do the calculation. Also see http://www.easyrgb.com/en/math.php  
> [ ] Choose the tiles with the smallest distance, resize them and replace that image part with the tile  
> [ ] Save output image  

---

## TODO | Tasks | WIP
- [ ] // TODO ..

---

## Prerequisites (to run/test localy)
### Test Files
These files are xpected in the working directory 
- `./input.jpg`
- `./tiles/*.jpg` (more images to use as tiles)

### Runtime
- Node.js

# Note


All images in this dir will base64 into R/gen/image.ts file, and pack into js file when build. 

Support image file name end with '@2x', '@3x' to defined the image's scale. Default image scale is 1.

Use in js: {packageName}.R.image.xxx

Don't put large images here, don't forget to compress the image.

If you don't want the image files to be built into js, you can put them to 'assets', and load with url like : 'assets/xxx.png'

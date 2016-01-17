# Note


All image in this dir will base64 to R/gen/image.ts file, and pack into js file when build. 

Support image file name end with '@2x', '@3x' to defined the image's scale. Default image scale was 1.

Use result in js: {packageName}.R.image.xxx

Don't put large image here, don't forget compress the image.

If you don't want the image build into js, you can put the image to assets, and load with url like : 'assets/xxx.png'
tsc -p ./
babel dist/android-web-widget.js -o test/android-web-widget.es5.js -s
babel .outjs/ts.js -o .outjs/ts.es5.js -s
node build_sdk_res.js
tsc -p ./
babel ../dist/android-ui.js -o ../dist/android-ui.es5.js -s
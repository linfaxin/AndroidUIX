node build_sdk_res.js
../buildtool/typescript/bin/tsc -p ./
../node_modules/.bin/babel ../dist/android-ui.js -o ../dist/android-ui.es5.js -s --presets=es2015
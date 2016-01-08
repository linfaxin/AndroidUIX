
packageName="sample.app";

# sdk path relate with gen/R/xxx.ts
dReference="../../../dist/android-ui.d.ts";

node build_res.js $packageName $dReference
tsc -p ./
babel build/main.js -o build/main.es5.js -s
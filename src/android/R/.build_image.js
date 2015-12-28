
var fs = require('fs');

var path = 'image@x3';
var dirImageData = {};
var files = fs.readdirSync(path);
files.forEach(function(fileName){
    var base64 = fs.readFileSync(path+'/'+fileName, 'base64');
    var name = fileName.split('.')[0];
    dirImageData[name] = 'data:image/png;base64,' + base64;
});

var str = `module android.R.image_base64 {
    export var x3 = ${JSON.stringify(dirImageData, null, 8)};
}`;

fs.writeFile('image_base64.ts', str, 'utf-8');
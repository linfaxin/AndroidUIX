
var fs = require('fs');

var path = 'image@x3';
var dirImageData = {};
var files = fs.readdirSync(path);
files.forEach(function(fileName){
    var base64 = fs.readFileSync(path+'/'+fileName, 'base64');
    var name = fileName.split('.')[0];
    dirImageData[name] = 'data:image/png;base64,' + base64;
});


var exportLines = '';
for(var k of Object.keys(dirImageData)){
    console.log('export:'+k);
    exportLines += `
    export var ${k} = new NetImage(x3.${k}, 3);`;
}

var str =
`///<reference path="../../androidui/image/NetImage.ts"/>
module android.R.image_base64 {
    import NetImage = androidui.image.NetImage;
    var x3 = ${JSON.stringify(dirImageData, null, 8)};
    ${exportLines}
}`;

fs.writeFile('image_base64.ts', str, 'utf-8');

var args = process.argv.slice(2);
var packageName = args[0];
var SDKReferencePath = args[1];

var fs = require('fs');
buildLayout();
buildValues();
buildImage();
buildID();

function buildImage(){
    var path = 'res/image@x3';
    var dirImageData = {};
    var files = fs.readdirSync(path);
    files.forEach(function(fileName){
        var splits = fileName.split('.');
        var name = fileName.split('.')[0];
        var fileSuffixes = splits[splits.length-1];
        var base64 = fs.readFileSync(path+'/'+fileName, 'base64');
        if(fileSuffixes == 'png'){
            dirImageData[name] = 'data:image/png;base64,' + base64;
        }else if(fileSuffixes == 'jpg'){
            dirImageData[name] = 'data:image/jpg;base64,' + base64;
        }else if(fileSuffixes == 'gif'){
            dirImageData[name] = 'data:image/gif;base64,' + base64;
        }else if(fileSuffixes == 'webp'){
            dirImageData[name] = 'data:image/webp;base64,' + base64;
        }
    });


    var exportLines = '';
    for(var k of Object.keys(dirImageData)){
        //console.log('export:'+k);
        exportLines += `
    export var ${k} = new NetImage(x3.${k}, 3);`;
    }

    var str =
        `///<reference path="${SDKReferencePath}"/>
module ${packageName}.R.image_base64 {
    import NetImage = androidui.image.NetImage;
    var x3 = ${JSON.stringify(dirImageData, null, 8)};
    ${exportLines}
}`;

    fs.writeFile('gen/R/image_base64.ts', str, 'utf-8');
}

function buildLayout(){
    var path = 'res/layout';
    var layoutData = {};
    var files = fs.readdirSync(path);
    files.forEach(function(fileName){
        var splits = fileName.split('.');
        if(splits[splits.length-1] != 'html') return;//must end with '.html'
        var html = fs.readFileSync(path+'/'+fileName, 'utf-8');
        var name = splits[0];
        layoutData[name] = html;
    });


    var parsedLines = '';
    for(var k of Object.keys(layoutData)){
        //console.log('export:'+k);
        parsedLines += `
    const _${k} = parse2html(_layout_data.${k});`;
    }
    var exportLines = '';
    for(var k of Object.keys(layoutData)){
        //console.log('export:'+k);
        exportLines += `
        static get ${k}(){return <HTMLElement>_${k}.cloneNode(true);}`;
    }

    var str =
        `module ${packageName}.R {
    const _layout_data = ${JSON.stringify(layoutData, null, 8)};
    const _tempDiv = document.createElement('div');
    function parse2html(s):HTMLElement{
        _tempDiv.innerHTML = s;
        return <HTMLElement>_tempDiv.firstElementChild;
    }
    ${parsedLines}
    export class layout{
        ${exportLines}
    }
}`;

    fs.writeFile('gen/R/layout.ts', str, 'utf-8');
}

function buildValues(){
    var path = 'res/values';
    var files = fs.readdirSync(path);
    var allHtml = '';

    files.forEach(function(fileName){
        var splits = fileName.split('.');
        if(splits[splits.length-1] != 'html') return;//must end with '.html'
        var html = fs.readFileSync(path+'/'+fileName, 'utf-8');
        var name = splits[0];

        allHtml += `
<!-- ${name}.html -->
${html}

`;
    });

    var str = `///<reference path="${SDKReferencePath}"/>
module ${packageName}.R {
    android.content.res.Resources.buildResourcesElement.innerHTML = \`${allHtml}\`;
}`;

    fs.writeFile('gen/R/resources.ts', str, 'utf-8');
}

function buildID(){
    //TODO parse html & generate ids to 'id.ts'
}
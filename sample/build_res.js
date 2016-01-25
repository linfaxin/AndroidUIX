
var args = process.argv.slice(2);
var packageName = args[0];
var SDKReferencePath = args[1];

var fs = require('fs');
var jsdom = require('jsdom');

if(!fs.existsSync('gen')) fs.mkdirSync('gen');
if(!fs.existsSync('gen/R'))fs.mkdirSync('gen/R');

buildLayout();
buildValues();
buildImage();

function buildImage(){
    var path = 'res/image';
    if(!fs.existsSync(path)) return;
    var dirImageData = {};
    var ninePatchImages = [];

    var files = fs.readdirSync(path);
    files.forEach(function(fileName){
        var splits = fileName.split('.');
        var nameWithRadio = fileName.split('.')[0];

        var fileSuffixes = splits[splits.length-1];
        if(fileSuffixes !== 'png' && fileSuffixes !== 'jpg' && fileSuffixes !== 'gif' && fileSuffixes !== 'webp'){
            return;//not support
        }

        var name = nameWithRadio;
        var radio = Number.parseInt(name.split('@').pop()[0]);//..@3x
        if(Number.isInteger(radio)) name = name.substring(0, name.lastIndexOf('@'));
        else radio = 1;

        if(fileName.substring(nameWithRadio.length).indexOf('.9.')===0) ninePatchImages.push(name);

        var base64Data = fs.readFileSync(path+'/'+fileName, 'base64');
        var radioArray = dirImageData[name] || (dirImageData[name]=[]);
        if(radioArray[radio]){
            throw Error('already defined a same radio image: ' + fileName);
        }
        radioArray[radio] = `data:image/${fileSuffixes};base64,${base64Data}`;
    });

    var exportLines = '';
    for(var k of Object.keys(dirImageData)){
        //console.log('export:'+k);
        exportLines +=
            `        static get ${k}(){
            return imageCache.${k} || (imageCache.${k}=findRatioImage(data.${k}));
        }
`;
    }
    if(exportLines.length == 0) return;//no image

    var str =
        `///<reference path="${SDKReferencePath}"/>
module ${packageName}.R {
    import NetImage = androidui.image.NetImage;

    //index=ratio, index-0 alway null, index-3 = @x3
    var data = ${JSON.stringify(dirImageData, null, 8)};
    var imageCache = {
        ${Object.keys(dirImageData).join(':null,\n        ')+':null'}
    };

    function findRatioImage(array:string[]):NetImage {
        if(array[window.devicePixelRatio]) return new NetImage(array[window.devicePixelRatio], window.devicePixelRatio);
        for(let i=array.length; i>=0; i--){
            if(array[i]){
                return new NetImage(array[i], i);
            }
        }
        throw Error('Not find radio image. May something error in build.')
    }
    export class image_base64{
${exportLines}
    }
}`;

    fs.writeFile('gen/R/image_base64.ts', str, 'utf-8');


    var exportImage_tsLines = '';
    for(var k of Object.keys(dirImageData)){
        if(ninePatchImages.indexOf(k)===-1){
            exportImage_tsLines += `
        static get ${k}(){return new NetDrawable(image_base64.${k})}`;
        }else{
            exportImage_tsLines += `
        static get ${k}(){return new NinePatchDrawable(image_base64.${k})}`;
        }
    }
    var image_ts =
        `///<reference path="${SDKReferencePath}"/>
///<reference path="image_base64.ts"/>
module ${packageName}.R {
    import NetDrawable = androidui.image.NetDrawable;
    import NinePatchDrawable = androidui.image.NinePatchDrawable;

    export class image{
${exportImage_tsLines}
    }
    android.content.res.Resources.buildDrawableFinder = (refString:string)=>{
        return image[refString];
    }
}`;
    fs.writeFile('gen/R/image.ts', image_ts, 'utf-8');
}

function buildLayout(){
    var definedIds = {};

    function xml2html(html){
        var doc = jsdom.jsdom(html, {
            parsingMode : 'xml'
        });
        var document = doc.defaultView.document;
        travelElement(document.documentElement);
        return document.documentElement.outerHTML;
    }

    function travelElement(ele){
        if(ele){
            //android:id="@+id/xx" ==> id="xx",
            var id = ele.getAttribute('android:id');
            ele.removeAttribute('android:id');
            if(id){
                if(id.startsWith('@+id/')) id = id.substring('@+id/'.length);
                if(id.startsWith('@id/')) id = id.substring('@id/'.length);
                ele.setAttribute('id', id);
                definedIds[id] = id;
            }

            //remove xmlns & xmlns:android, no need when run
            ele.removeAttribute('xmlns');
            ele.removeAttribute('xmlns:android');

            for(var child of Array.from(ele.children)){
                travelElement(child);
            }
        }
    }

    function writeToIdFile(){
        var str =
            `///<reference path="${SDKReferencePath}"/>
module ${packageName}.R {
    export var id = ${JSON.stringify(definedIds, null, 8)};
}`;
        fs.writeFile('gen/R/id.ts', str, 'utf-8');
    }


    var path = 'res/layout';
    if(!fs.existsSync(path)) return;
    var layoutData = {};
    var files = fs.readdirSync(path);
    files.forEach(function(fileName){
        var splits = fileName.split('.');
        var fileSuffixes = splits[splits.length-1];

        if(fileSuffixes != 'html' && fileSuffixes != 'xml') return;//must end with '.html/.xml'
        var html = fs.readFileSync(path+'/'+fileName, 'utf-8');
        html = xml2html(html);
        var name = splits[0];
        layoutData[name] = html;
    });


    var exportLines = '';
    for(var k of Object.keys(layoutData)){
        exportLines += `
        static ${k} = '@layout/${k}';`;
    }


    var str =
        `///<reference path="${SDKReferencePath}"/>
module ${packageName}.R {
    const _layout_data = ${JSON.stringify(layoutData, null, 8)};
    const _tempDiv = document.createElement('div');

    export class layout{
        static getLayoutData(layoutRef:string):HTMLElement{
            if(!layoutRef) return null;
            layoutRef = layoutRef.replace('/', '.').split('.').pop();
            if(!_layout_data[layoutRef]) return null;
            _tempDiv.innerHTML = _layout_data[layoutRef];
            let data = <HTMLElement>_tempDiv.firstElementChild;
            _tempDiv.removeChild(data);
            return data;
        }
        ${exportLines}
    }
    android.content.res.Resources.buildLayoutFinder = (refString:string)=>{
        return layout.getLayoutData(refString)
    }
}`;

    fs.writeFile('gen/R/layout.ts', str, 'utf-8');

    writeToIdFile();
}

function buildValues(){
    var path = 'res/values';
    if(!fs.existsSync(path)) return;
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
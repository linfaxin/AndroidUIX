var fs = require('fs');
var jsdom = require('jsdom');

buildLayout();
buildImage();

function buildImage(){
    var path = 'res/image';
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


    var str =
        `///<reference path="../../androidui/image/NetImage.ts"/>
module android.R {
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

    fs.writeFile('android/R/image_base64.ts', str, 'utf-8');


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
        `///<reference path="../../androidui/image/NetDrawable.ts"/>
///<reference path="../../androidui/image/NinePatchDrawable.ts"/>
///<reference path="image_base64.ts"/>
module android.R {
    import NetDrawable = androidui.image.NetDrawable;
    import NinePatchDrawable = androidui.image.NinePatchDrawable;

    const density = android.content.res.Resources.getDisplayMetrics().density;
    export class image{
${exportImage_tsLines}

    }
}`;
    fs.writeFile('android/R/image.ts', image_ts, 'utf-8');
}

function buildLayout(){

    var definedIds = {};

    function xml2html(html){
        var doc = jsdom.jsdom(html, {
            parsingMode : 'xml'
        });
        var document = doc.defaultView.document;
        travelElement(document.documentElement);
        if(document.documentElement.tagName=='resources') return;
        return document.documentElement.outerHTML;
    }

    function travelElement(ele){
        if(ele){
            //android:id="@+id/xx" ==> id="xx",
            var id = ele.getAttribute('android:id') || ele.getAttribute('id');
            ele.removeAttribute('android:id');
            if(id){
                if(id.startsWith('@+id/')) id = id.substring('@+id/'.length);
                if(id.startsWith('@id/')) id = id.substring('@id/'.length);
                if(id.startsWith('android:')) id = id.substring('android:'.length);
                ele.setAttribute('id', 'android:' + id);
                definedIds[id] = 'android:' + id;
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
        var exportLines = '';
        for(var k of Object.keys(definedIds)){
            exportLines += `
        static ${k} = '${definedIds[k]}';`;
        }
        var str =
            `module android.R {
    export class id {
        ${exportLines}
    };
}`;
        fs.writeFile('android/R/id.ts', str, 'utf-8');
    }


    var path = 'res/layout';
    var layoutData = {};
    var files = fs.readdirSync(path);
    files.forEach(function(fileName){
        var splits = fileName.split('.');
        var fileSuffixes = splits[splits.length-1];

        if(fileSuffixes != 'html' && fileSuffixes != 'xml') return;//must end with '.html/.xml'
        var html = fs.readFileSync(path+'/'+fileName, 'utf-8');
        html = xml2html(html);
        if(!html) return;
        var name = splits[0];
        layoutData[name] = html;
    });


    var exportLines = '';
    for(var k of Object.keys(layoutData)){
        exportLines += `
        static ${k} = '@android:layout/${k}';`;
    }

    var str =
        `module android.R {
    const _layout_data = ${JSON.stringify(layoutData, null, 8)};
    const _tempDiv = document.createElement('div');

    export class layout{
        static getLayoutData(layoutName:string):HTMLElement{
            if(!layoutName) return null;
            if(!_layout_data[layoutName]) return null;
            _tempDiv.innerHTML = _layout_data[layoutName];
            let data = <HTMLElement>_tempDiv.firstElementChild;
            _tempDiv.removeChild(data);
            return data;
        }
        ${exportLines}
    }
}`;

    fs.writeFile('android/R/layout.ts', str, 'utf-8');
    writeToIdFile();
}

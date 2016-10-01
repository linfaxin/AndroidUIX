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
///<reference path="../../androidui/image/ChangeImageSizeDrawable.ts"/>
///<reference path="image_base64.ts"/>
module android.R {
    import NetDrawable = androidui.image.NetDrawable;
    import ChangeImageSizeDrawable = androidui.image.ChangeImageSizeDrawable;
    import NinePatchDrawable = androidui.image.NinePatchDrawable;

    const density = android.content.res.Resources.getDisplayMetrics().density;
    export class image{
${exportImage_tsLines}

        //scale images
        static get spinner_48_outer_holo(){ return new ChangeImageSizeDrawable(image.spinner_76_outer_holo, 48 * density, 48 * density)}
        static get spinner_48_inner_holo(){ return new ChangeImageSizeDrawable(image.spinner_76_inner_holo, 48 * density, 48 * density)}
        static get spinner_16_outer_holo(){ return new ChangeImageSizeDrawable(image.spinner_76_outer_holo, 16 * density, 16 * density)}
        static get spinner_16_inner_holo(){ return new ChangeImageSizeDrawable(image.spinner_76_inner_holo, 16 * density, 16 * density)}

        static get rate_star_small_off_holo_light(){ return new ChangeImageSizeDrawable(image.rate_star_big_half_holo_light, 16 * density, 16 * density)}
        static get rate_star_small_half_holo_light(){ return new ChangeImageSizeDrawable(image.rate_star_big_off_holo_light, 16 * density, 16 * density)}
        static get rate_star_small_on_holo_light(){ return new ChangeImageSizeDrawable(image.rate_star_big_on_holo_light, 16 * density, 16 * density)}
    }
    
    // load these image when init
    image_base64.actionbar_ic_back_white;
    image_base64.btn_default_normal_holo_light;
    image_base64.dropdown_background_dark;
    image_base64.editbox_background_normal;
    image_base64.ic_menu_moreoverflow_normal_holo_dark;
    image_base64.menu_panel_holo_dark;
    image_base64.menu_panel_holo_light;
    image_base64.popup_bottom_bright;
    image_base64.popup_center_bright;
    image_base64.popup_full_bright;
    image_base64.popup_top_bright;
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
            `module android.R {
    export const id = ${JSON.stringify(definedIds, null, 8)};
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

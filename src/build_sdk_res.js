var fs = require('fs');
buildLayout();
buildImage();
buildID();

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
}`;
    fs.writeFile('android/R/image.ts', image_ts, 'utf-8');
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
}`;

    fs.writeFile('android/R/layout.ts', str, 'utf-8');
}

function buildID(){
    //TODO parse html & generate ids to 'id.ts'
}
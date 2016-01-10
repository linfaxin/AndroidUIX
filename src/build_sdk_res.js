var fs = require('fs');
buildLayout();
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
        `///<reference path="../../androidui/image/NetImage.ts"/>
module android.R.image_base64 {
    import NetImage = androidui.image.NetImage;
    var x3 = ${JSON.stringify(dirImageData, null, 8)};
    ${exportLines}
}`;

    fs.writeFile('android/R/image_base64.ts', str, 'utf-8');
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
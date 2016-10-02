"use strict";

var SDKReferencePath = "../androidui-sdk/android-ui.d.ts";

var fs = require('fs');
var jsdom = require('jsdom');


const definedIds = new Set();
const definedDrawables = new Set();
const definedLayouts = new Set();
const definedColors = new Set();
const definedArrays = new Set();
const definedStrings = new Set();
const definedBools = new Set();
const definedInts = new Set();
const definedDimens = new Set();
const definedFractions = new Set();
const definedStyles = new Set();

buildResource();

function buildResource(){
    const resPath = 'res';
    if(!fs.existsSync(resPath)) return;
    if(!fs.existsSync('gen')) fs.mkdirSync('gen');

    const resData = {};
    fs.readdirSync(resPath).forEach(function(resSubDirName){
        if(resSubDirName.indexOf('.')===0) return;
        const packedDir = packDir(resPath + '/' + resSubDirName);
        if(packedDir){
            resData[resSubDirName] =  packedDir;
        }
    });

    const resDataStr =`
module R {
    export const _res_data = ${JSON.stringify(resData, null, 8)};
}
`;
    fs.writeFile('gen/res_data.ts', resDataStr, 'utf-8');


    let idObjStr = '{\n';
    for(let id of definedIds){
        idObjStr += `        ${id} : '${id}',\n`
    }
    idObjStr += '    }';

    let layoutObjStr = '{\n';
    for(let layout of definedLayouts){
        layoutObjStr += `        ${layout} : '@layout/${layout}',\n`
    }
    layoutObjStr += '    }';

    let arrayObjStr = '{\n';
    for(let array of definedArrays){
        arrayObjStr += `        ${array} : '@array/${array}',\n`
    }
    arrayObjStr += '    }';

    let colorObjStr = '{\n';
    for(let color of definedColors){
        colorObjStr += `        ${color} : '@color/${color}',\n`
    }
    colorObjStr += '    }';

    let intObjStr = '{\n';
    for(let i of definedInts){
        intObjStr += `        ${i} : '@int/${i}',\n`
    }
    intObjStr += '    }';

    let fractionObjStr = '{\n';
    for(let i of definedFractions){
        fractionObjStr += `        ${i} : '@fractions/${i}',\n`
    }
    fractionObjStr += '    }';

    let styleObjStr = '{\n';
    for(let style of definedStyles){
        styleObjStr += `        ${style.replace(new RegExp("\\.", "g"), "_")} : '@style/${style}',\n`
    }
    styleObjStr += '    }';

    let drawableClassStr = '{\n';
    for(let image of definedDrawables){
        drawableClassStr += `        static get ${image}():Drawable {return Resources.getSystem().getDrawable('${image}')}\n`
    }
    drawableClassStr += '    }';

    let stringClassStr = '{\n';
    for(let str of definedStrings){
        stringClassStr += `        static get ${str}():string {return Resources.getSystem().getString('${str}')}\n`
    }
    stringClassStr += '    }';

    let boolClassStr = '{\n';
    for(let b of definedBools){
        boolClassStr += `        static get ${b}():boolean {return Resources.getSystem().getBoolean('${b}')}\n`
    }
    boolClassStr += '    }';

    const RStr =`
///<reference path="${SDKReferencePath}"/>
///<reference path="res_data.ts"/>

module R {
    import Resources = android.content.res.Resources;
    import Drawable = android.graphics.drawable.Drawable;
    import NetDrawable = androidui.image.NetDrawable;
    import NinePatchDrawable = androidui.image.NinePatchDrawable;
    import NetImage = androidui.image.NetImage;
    
    export const id = ${idObjStr};
    
    export const layout = ${layoutObjStr};
    
    export const style = ${styleObjStr};
    
    export const color = ${colorObjStr};
    
    export const array = ${arrayObjStr};
    
    export const integer = ${intObjStr};
    
    export const fraction = ${fractionObjStr};
    
    export class drawable ${drawableClassStr}
    
    export class string_ ${stringClassStr}
    
    export class bool ${boolClassStr}

    const res_data = R._res_data;
    function resDirSpecMatch(spec:string):boolean {
        spec = spec.toLocaleLowerCase();

        let ratio = window.devicePixelRatio;
        if(ratio===0.75 && spec==='ldpi') return true;
        if(ratio===1 && spec==='mdpi') return true;
        if(ratio===1.5 && spec==='hdpi') return true;
        if(ratio===2 && spec==='xhdpi') return true;
        if(ratio===3 && spec==='xxhdpi') return true;
        if(ratio===4 && spec==='xxxhdpi') return true;

        let dpi = ratio * 160;
        if(spec === dpi + 'dpi') return true;

        let xdp = document.documentElement.offsetWidth;
        let ydp = document.documentElement.offsetHeight;
        let minDP = Math.min(xdp, ydp);
        let maxDP = Math.max(xdp, ydp);
        if(spec==='xlarge' && maxDP > 960 && minDP > 720) return true;
        if(spec==='large' && maxDP > 640 && minDP > 480) return true;
        if(spec==='normal' && maxDP > 470 && minDP > 320) return true;
        if(spec==='small' && maxDP > 426 && minDP > 320) return true;

        if(spec==='port' && ydp > xdp) return true;
        if(spec==='land' && xdp > ydp) return true;

        if(spec === xdp + 'x' + ydp || spec === ydp + 'x' + xdp) return true;

        let swMatch = spec.match(/sw(d*)dp/);
        if(swMatch && parseInt(swMatch[1]) >= minDP) return true;

        let wMatch = spec.match(/w(d*)dp/);
        if(wMatch && parseInt(wMatch[1]) >= xdp) return true;

        let hMatch = spec.match(/h(d*)dp/);
        if(hMatch && parseInt(hMatch[1]) >= ydp) return true;

        const lang = navigator.language.toLocaleLowerCase().split('-')[0];
        if(lang === spec) return true;
        if(spec.startsWith('r')){//rCN
            const specArea = spec.substring(1);
            const langArea = navigator.language.toLocaleLowerCase().split('-')[1];
            if(langArea === specArea) return true;
        }
    }
    
    const matchDirNamesCache = {};
    function findMatchDirNames(baseDirName:string):string[] {
        if(matchDirNamesCache[baseDirName]) return matchDirNamesCache[baseDirName];
        let matchDirNames = [];
        for(let dirName in res_data){
            if(dirName==baseDirName || dirName.startsWith(baseDirName+'-')){
                matchDirNames.push(dirName);
            }
        }

        matchDirNames = matchDirNames.sort((a:string, b:string):number=>{
            let bSplits = b.split('-');
            bSplits.shift();
            let bMatchTimes = 0;
            for(let split of bSplits){
                if(resDirSpecMatch(split)) bMatchTimes++;
            }

            let aSplits = a.split('-');
            aSplits.shift();
            let aMatchTimes = 0;
            for(let split of aSplits){
                if(resDirSpecMatch(split)) aMatchTimes++;
            }

            return bMatchTimes - aMatchTimes;
        });
        matchDirNamesCache[baseDirName] = matchDirNames;
        return matchDirNames;
    }
    
    const imageFileCache = new Map<String, NetImage>();
    function findImageFile(fileName:string):Drawable {

        //find in drawable dir
        for(let dirName of findMatchDirNames('drawable')) {
            let dir = res_data[dirName];
            if (dirName === 'drawable'){ // find ratio image first :  xxx@2x.png, xxx@3x.png
                function findImageWithRatioName(ratio:number){
                    let fileNameWithRatio = fileName + '@' + ratio + 'x';
                    let key = dirName + '/' + fileNameWithRatio;
                    let netImage = imageFileCache.get(key);
                    if (!netImage) {
                        let fileStr = dir[fileNameWithRatio];
                        if(fileStr && fileStr.startsWith('data:image')) {
                            netImage = new NetImage(fileStr, ratio);
                            imageFileCache.set(key, netImage);
                        }
                    }
                    if (netImage) return new NetDrawable(netImage);

                    // nine patch image
                    let fileNameWithNinePatch = fileName + '@' + ratio + 'x' + '.9';
                    key = dirName + '/' + fileNameWithNinePatch;
                    netImage = imageFileCache.get(key);
                    if (!netImage) {
                        let fileStr = dir[fileNameWithNinePatch];
                        if (fileStr && fileStr.startsWith('data:image')) {
                            netImage = new NetImage(fileStr, ratio);
                            imageFileCache.set(key, netImage);
                        }
                    }
                    if (netImage) return new NinePatchDrawable(netImage);
                    return null;
                }

                let ratioDrawable = findImageWithRatioName(window.devicePixelRatio);
                if (!ratioDrawable && window.devicePixelRatio !== 3) ratioDrawable = findImageWithRatioName(3);
                if (!ratioDrawable && window.devicePixelRatio !== 2) ratioDrawable = findImageWithRatioName(2);
                if (!ratioDrawable && window.devicePixelRatio !== 4) ratioDrawable = findImageWithRatioName(4);
                if (!ratioDrawable && window.devicePixelRatio !== 1) ratioDrawable = findImageWithRatioName(1);
                if (!ratioDrawable && window.devicePixelRatio !== 5) ratioDrawable = findImageWithRatioName(5);
                if (!ratioDrawable && window.devicePixelRatio !== 6) ratioDrawable = findImageWithRatioName(6);
                return ratioDrawable;
            }

            let ratio = 1;
            if(dirName.includes('-')) {
                if (dirName.includes('-ldpi')) ratio = 0.75;
                else if (dirName.includes('-mdpi')) ratio = 1;
                else if (dirName.includes('-hdpi')) ratio = 1.5;
                else if (dirName.includes('-xhdpi')) ratio = 2;
                else if (dirName.includes('-xxhdpi')) ratio = 3;
                else if (dirName.includes('-xxxhdpi')) ratio = 4;
            }

            let key = dirName + '/' + fileName;
            let netImage = imageFileCache.get(key);
            if (!netImage) {
                let fileStr = dir[fileName];
                if(fileStr && fileStr.startsWith('data:image')) {
                    netImage = new NetImage(fileStr, ratio);
                    imageFileCache.set(key, netImage);
                }
            }
            if (netImage) return new NetDrawable(netImage);

            let fileNameWithNinePatch = fileName+'.9';
            key = dirName + '/' + fileNameWithNinePatch;
            netImage = imageFileCache.get(key);
            if (!netImage) {
                let fileStr = dir[fileNameWithNinePatch];
                if (fileStr && fileStr.startsWith('data:image')) {
                    netImage = new NetImage(fileStr, ratio);
                    imageFileCache.set(key, netImage);
                }
            }
            if (netImage) return new NinePatchDrawable(netImage);
        }
    }

    const _tempDiv = document.createElement('div');
    function findXmlFile(baseDirName:string, fileName:string):HTMLElement {
        for(let dirName of findMatchDirNames(baseDirName)){
            let dir = res_data[dirName];
            if(dir[fileName]){
                _tempDiv.innerHTML = dir[fileName];
                let data = <HTMLElement>_tempDiv.firstElementChild;
                _tempDiv.removeChild(data);
                return data;
            }
        }
    }

    function findResourcesValue(valueType:string, valueName:string):HTMLElement {
        for(let dirName of findMatchDirNames('values')){
            let dir = res_data[dirName];
            if(dir[valueType] && dir[valueType][valueName]){
                _tempDiv.innerHTML = dir[valueType][valueName];
                let data = <HTMLElement>_tempDiv.firstElementChild;
                _tempDiv.removeChild(data);
                return data;
            }
        }
    }
    
    if('_AppBuildValueFinder' in android.content.res.Resources){
        android.content.res.Resources._AppBuildImageFileFinder = (refString:string):Drawable => {
            if(refString.startsWith('@drawable/')){
                refString = refString.substring('@drawable/'.length);
            }
            return findImageFile(refString);
        };
        android.content.res.Resources._AppBuildXmlFinder = (refString:string):HTMLElement =>{
            if(!refString.startsWith('@')){
                throw Error('refString must starts with @, current: ' + refString);
            }
            refString = refString.substring(1);//remove @
            let splits = refString.split('/');
            if(splits.length!=2) throw Error('refString must have one \\'/\\', current: ' + refString);
            return findXmlFile(splits[0], splits[1]);
        };
        android.content.res.Resources._AppBuildValueFinder = (refString:string):HTMLElement =>{
            if(!refString.startsWith('@')){
                throw Error('refString must starts with @, current: ' + refString);
            }
            refString = refString.substring(1);//remove @
            let splits = refString.split('/');
            if(splits.length!=2) throw Error('refString must have one \\'/\\', current: ' + refString);

            return findResourcesValue(splits[0], splits[1]);
        };
        
    }else{
        throw Error('Error: sdk version is too old. Please update your androidui sdk.');
    }
    
}
`;
    fs.writeFile('gen/R.ts', RStr, 'utf-8');
}

function packDir(resSubDirPath) {
    const dirPack = {};
    if(resSubDirPath === 'res/drawable' || resSubDirPath.indexOf('res/drawable-') ===0 ) {//drawable
        traverseFile(resSubDirPath, function (filePath) {
            const fileName = filePath.split('/').pop();
            const splits = fileName.split('.');
            if(splits.length <= 1) return;
            const fileSuffixes = splits[splits.length-1];
            const fileNameNoSuf = fileName.substring(0, fileName.length - 1 - fileSuffixes.length);

            switch (fileSuffixes){
                case 'png':
                case 'jpg':
                case 'gif':
                case 'webp':
                    let imageFilePureName = fileNameNoSuf;
                    if(imageFilePureName.endsWith('.9')){
                        imageFilePureName = imageFilePureName.substring(0, imageFilePureName.length - 2);
                    }
                    if(imageFilePureName.endsWith('@1x') || imageFilePureName.endsWith('@2x') || imageFilePureName.endsWith('@3x')
                        || imageFilePureName.endsWith('@4x') || imageFilePureName.endsWith('@5x') || imageFilePureName.endsWith('@6x')){
                        imageFilePureName = imageFilePureName.substring(0, imageFilePureName.length - 3);
                    }
                    definedDrawables.add(imageFilePureName);
                    const base64Data = fs.readFileSync(filePath, 'base64');
                    dirPack[fileNameNoSuf] = `data:image/${fileSuffixes};base64,${base64Data}`;
                    break;

                case 'xml':
                    const document = readXmlFile(filePath);
                    definedDrawables.add(fileNameNoSuf);
                    dirPack[fileNameNoSuf] = document.documentElement.outerHTML;
                    break;
                default:
                    console.warn('Not support file in res dir. skip :' + filePath);
            }
        });

    }else if(resSubDirPath === 'res/layout' || resSubDirPath.indexOf('res/layout-') === 0) {//layout
        traverseFile(resSubDirPath, function (filePath) {
            const fileName = filePath.split('/').pop();
            const splits = fileName.split('.');
            if (splits.length <= 1) return;
            const fileSuffixes = splits[splits.length - 1];
            const fileNameNoSuf = fileName.substring(0, fileName.length - 1 - fileSuffixes.length);
            if (fileSuffixes == 'xml') {
                const document = readXmlFile(filePath);
                parseLayoutDoc(document.documentElement);
                definedLayouts.add(fileNameNoSuf);
                dirPack[fileNameNoSuf] = document.documentElement.outerHTML;
            }else if (fileSuffixes == 'html') {
                const document = readHtmlFile(filePath);
                var rootNode = document.body.firstElementChild;
                parseLayoutDoc(rootNode);
                definedLayouts.add(fileNameNoSuf);
                dirPack[fileNameNoSuf] = rootNode.outerHTML;
            }else{
                console.warn('Not support file in res dir. skip :' + filePath);
            }
        });

    }else if(resSubDirPath === 'res/color' || resSubDirPath.indexOf('res/color-') === 0) {//color
        traverseFile(resSubDirPath, function (filePath) {
            const fileName = filePath.split('/').pop();
            const splits = fileName.split('.');
            if (splits.length <= 1) return;
            const fileSuffixes = splits[splits.length - 1];
            const fileNameNoSuf = fileName.substring(0, fileName.length - 1 - fileSuffixes.length);
            if (fileSuffixes == 'xml') {
                const document = readXmlFile(filePath);
                definedColors.add(fileNameNoSuf);
                dirPack[fileNameNoSuf] = document.documentElement.outerHTML;
            }else{
                console.warn('Not support file in res dir. skip :' + filePath);
            }
        });

    }else if(resSubDirPath === 'res/values' || resSubDirPath.indexOf('res/values-') === 0) {//color
        traverseFile(resSubDirPath, function (filePath) {
            const fileName = filePath.split('/').pop();
            const splits = fileName.split('.');
            if (splits.length <= 1) return;
            const fileSuffixes = splits[splits.length - 1];
            if(fileSuffixes=='xml') {
                const document = readXmlFile(filePath);
                readResourcesXmlToPack(document.documentElement, filePath, dirPack);
            }else if(fileSuffixes=='html') {
                console.warn('No longer support html file to defined resource. skip :' + filePath);
            }else{
                console.warn('Not support file in res dir. skip :' + filePath);
            }
        });

    }else{
        console.error('Resources file can only put in res/drawable, res/layout, res/color or res/values : ' +  resSubDirPath);
        return;
    }
    return dirPack;

}

function readXmlFile(filePath) {
    let xml = fs.readFileSync(filePath, 'utf-8');
    xml = xml.replace(new RegExp("\\\\n", "g"), "\n");
    xml = xml.replace(new RegExp("\\\\r", "g"), "\r");
    xml = xml.replace(new RegExp("\\\\t", "g"), "\t");
    const doc = jsdom.jsdom(xml, {parsingMode : 'xml'});
    return doc.defaultView.document;
}
function readHtmlFile(filePath) {
    let html = fs.readFileSync(filePath, 'utf-8');
    html = html.replace(new RegExp("\\\\n", "g"), "\n");
    html = html.replace(new RegExp("\\\\r", "g"), "\r");
    html = html.replace(new RegExp("\\\\t", "g"), "\t");
    const doc = jsdom.jsdom(html, {parsingMode : 'html'});
    return doc.defaultView.document;
}

function readResourcesXmlToPack(doc, filePath, resPack) {
    if(doc.tagName.toLowerCase() == 'resources'){
        for(let child of Array.from(doc.children)){
            let resType = child.tagName.toLowerCase();
            if(resType == 'item'){
                resType = child.getAttribute('type');
            }
            let resName = child.getAttribute('name');
            if(!resName){
                console.error('Resources need attribute \'name\', file:' + filePath + ', xml:'+child.outerHTML);
                return;
            }
            switch (resType) {
                case 'id':
                    definedIds.add(resName);
                    continue;
                case 'color':
                    definedColors.add(resName);
                    break;
                case 'drawable':
                    definedDrawables.add(resName);
                    break;
                case 'array':
                case 'string-array':
                case 'integer-array':
                    resType = 'array';
                    definedArrays.add(resName);
                    break;
                case 'string':
                    definedStrings.add(resName);
                    break;
                case 'bool':
                    definedBools.add(resName);
                    break;
                case 'integer':
                    definedInts.add(resName);
                    break;
                case 'dimen':
                    definedDimens.add(resName);
                    break;
                case 'fraction':
                    definedFractions.add(resName);
                    break;
                case 'style':
                    definedStyles.add(resName);
                    break;
                default:
                    console.error('Not support resources type:' + resType + ', xml: ' + child.outerHTML);
                    return;
            }
            resPack[resType] = resPack[resType] || {};

            resPack[resType][resName] = child.outerHTML
                .replace(new RegExp("<style", "g"), "<android-style")
                .replace(new RegExp("</style>", "g"), "</android-style>");
        }
        return resPack;

    }else{
        console.error('Resources xml file\'s root tag must be \'resources\'. file:' + filePath);
    }
}

function parseLayoutDoc(doc) {
    travelElement(doc);
    function travelElement(ele){
        if(ele){
            //id="@+id/xx" ==> android:id="xx",
            let id = ele.getAttribute('android:id') || ele.getAttribute('id');
            ele.removeAttribute('id');
            if(id){
                if(id.startsWith('@+id/')) id = id.substring('@+id/'.length);
                if(id.startsWith('@id/')) id = id.substring('@id/'.length);
                ele.setAttribute('android:id', id);
                definedIds.add(id);
            }

            //@+id/xx => xx
            for(let attr of Array.from(ele.attributes)){
                if(attr.value.startsWith('@+id/')){
                    ele.setAttribute(attr.name, attr.value.substring('@+id/'));
                }else if(attr.value.startsWith('@id/')){
                    ele.setAttribute(attr.name, attr.value.substring('@id/'));
                }
            }

            //remove xmlns & xmlns:android, no need when run
            ele.removeAttribute('xmlns');
            ele.removeAttribute('xmlns:android');

            for(var child of Array.from(ele.children)){
                travelElement(child);
            }
        }
    }
}


function traverseFile(path, callback) {
    if(path.indexOf('.')===0) return;
    if(fs.statSync(path).isDirectory()){
        const dirs = fs.readdirSync(path);
        dirs.forEach(function(fileName){
            const dirPath = path + '/' + fileName;
            traverseFile(dirPath, callback);
        });

    } else{
        callback(path);
    }
}
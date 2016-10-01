
///<reference path="../androidui-sdk/android-ui.d.ts"/>
///<reference path="res_data.ts"/>

module R {
    import Resources = android.content.res.Resources;
    import Drawable = android.graphics.drawable.Drawable;
    import NetDrawable = androidui.image.NetDrawable;
    import NinePatchDrawable = androidui.image.NinePatchDrawable;
    import NetImage = androidui.image.NetImage;
    
    export const id = {
        android_tip : 'android_tip',
        rotate_repeat : 'rotate_repeat',
        translate_repeat : 'translate_repeat',
        scale_repeat : 'scale_repeat',
        alpha_repeat : 'alpha_repeat',
        anim_set : 'anim_set',
        btn_open_dialog : 'btn_open_dialog',
        btn_show_popup : 'btn_show_popup',
        btn_click : 'btn_click',
        btn_long_click : 'btn_long_click',
        open_activity_intent : 'open_activity_intent',
        open_activity_result : 'open_activity_result',
        console_tv : 'console_tv',
        item_child_layout : 'item_child_layout',
        item_child_text : 'item_child_text',
        gridView : 'gridView',
        item_layout : 'item_layout',
        item_text : 'item_text',
        open_activity_normal : 'open_activity_normal',
        open_activity_float : 'open_activity_float',
        listView : 'listView',
        picker : 'picker',
        prll : 'prll',
        text1 : 'text1',
        text2 : 'text2',
        text3 : 'text3',
        text4 : 'text4',
        text5 : 'text5',
        text6 : 'text6',
        text7 : 'text7',
        alignLeft : 'alignLeft',
        alignTop : 'alignTop',
        viewPager : 'viewPager',
        page_bg : 'page_bg',
        page_text : 'page_text',
    };
    
    export const layout = {
        activity_main : '@layout/activity_main',
        sample_animation : '@layout/sample_animation',
        sample_base_widget : '@layout/sample_base_widget',
        sample_button : '@layout/sample_button',
        sample_contacte : '@layout/sample_contacte',
        sample_drawerlayout : '@layout/sample_drawerlayout',
        sample_edittext : '@layout/sample_edittext',
        sample_expand_listview_item : '@layout/sample_expand_listview_item',
        sample_framelayout : '@layout/sample_framelayout',
        sample_gridview : '@layout/sample_gridview',
        sample_gridview_item : '@layout/sample_gridview_item',
        sample_htmlview : '@layout/sample_htmlview',
        sample_imageview : '@layout/sample_imageview',
        sample_life_callback : '@layout/sample_life_callback',
        sample_linearlayout : '@layout/sample_linearlayout',
        sample_listview : '@layout/sample_listview',
        sample_listview_item : '@layout/sample_listview_item',
        sample_picker : '@layout/sample_picker',
        sample_pullrefreshload : '@layout/sample_pullrefreshload',
        sample_pullrefreshload_item : '@layout/sample_pullrefreshload_item',
        sample_relativelayout : '@layout/sample_relativelayout',
        sample_textview : '@layout/sample_textview',
        sample_viewpager : '@layout/sample_viewpager',
        sample_viewpager_gallery : '@layout/sample_viewpager_gallery',
        sample_viewpager_page : '@layout/sample_viewpager_page',
    };
    
    export const style = {
        page_text : '@style/page_text',
        btn_custom1 : '@style/btn_custom1',
        btn_custom1_pressed : '@style/btn_custom1_pressed',
        btn_custom1_disable : '@style/btn_custom1_disable',
        line_spit : '@style/line_spit',
        textStyle : '@style/textStyle',
        editStyle : '@style/editStyle',
        imageStyle : '@style/imageStyle',
    };
    
    export const color = {
        btn_color : '@color/btn_color',
        white : '@color/white',
        light_gray : '@color/light_gray',
        red : '@color/red',
        red_press : '@color/red_press',
        red_disable : '@color/red_disable',
        green : '@color/green',
        green_press : '@color/green_press',
    };
    
    export const array = {
        spinner_array : '@array/spinner_array',
    };
    
    export const integer = {
    };
    
    export const fraction = {
    };
    
    export class drawable {
        static get btn_bg():Drawable {return Resources.getSystem().getDrawable('btn_bg')}
        static get icon_alert():Drawable {return Resources.getSystem().getDrawable('icon_alert')}
    }
    
    export class string_ {
    }
    
    export class bool {
    }

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
            if(splits.length!=2) throw Error('refString must have one \'/\', current: ' + refString);
            return findXmlFile(splits[0], splits[1]);
        };
        android.content.res.Resources._AppBuildValueFinder = (refString:string):HTMLElement =>{
            if(!refString.startsWith('@')){
                throw Error('refString must starts with @, current: ' + refString);
            }
            refString = refString.substring(1);//remove @
            let splits = refString.split('/');
            if(splits.length!=2) throw Error('refString must have one \'/\', current: ' + refString);

            return findResourcesValue(splits[0], splits[1]);
        };
        
    }else{
        throw Error('Error: sdk version is too old. Please update your androidui sdk.');
    }
    
}

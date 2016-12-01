/**
 * Created by linfaxin on 15/10/5.
 * This is AndroidUI's impl
 */
///<reference path="../../util/DisplayMetrics.ts"/>
///<reference path="../../content/Context.ts"/>
///<reference path="../../graphics/drawable/Drawable.ts"/>
///<reference path="../../R/layout.ts"/>
///<reference path="TypedArray.ts"/>

module android.content.res {
    import DisplayMetrics = android.util.DisplayMetrics;
    import Drawable = android.graphics.drawable.Drawable;
    import Color = android.graphics.Color;
    import SynchronizedPool = android.util.Pools.SynchronizedPool;

    export class Resources {
        private static instance = new Resources();

        private displayMetrics:DisplayMetrics;
        private context:Context;

        //value set in app's R.ts
        static _AppBuildDrawableFinder: (refString:string)=>Drawable = null;
        static _AppBuildXmlFinder: (refString:string)=>HTMLElement = null;
        static _AppBuildValueFinder: (refString:string)=>HTMLElement = null;

        constructor(context?:Context) {
            this.context = context;

            window.addEventListener('resize', ()=>{
                if(this.displayMetrics){
                    this.fillDisplayMetrics(this.displayMetrics);
                }
            });
        }

        static getSystem():Resources {
            return Resources.instance;
        }

        private static from(context:Context){
            return context.getResources();
        }

        static getDisplayMetrics():DisplayMetrics {
            return Resources.instance.getDisplayMetrics();
        }

        getDisplayMetrics():DisplayMetrics {
            if(this.displayMetrics) return this.displayMetrics;
            this.displayMetrics = new DisplayMetrics();
            this.fillDisplayMetrics(this.displayMetrics);
            return this.displayMetrics;
        }
        private fillDisplayMetrics(displayMetrics:DisplayMetrics){
            let density = window.devicePixelRatio;

            displayMetrics.xdpi = window.screen.deviceXDPI || DisplayMetrics.DENSITY_DEFAULT;
            displayMetrics.ydpi = window.screen.deviceYDPI || DisplayMetrics.DENSITY_DEFAULT;
            displayMetrics.density = density;
            displayMetrics.densityDpi = density * DisplayMetrics.DENSITY_DEFAULT;
            displayMetrics.scaledDensity = density;

            let contentEle = this.context ? this.context.androidUI.androidUIElement : document.documentElement;
            displayMetrics.widthPixels = contentEle.offsetWidth * density;
            displayMetrics.heightPixels = contentEle.offsetHeight * density;
        }

        /**
         * @param refString @drawable/xxx, @android:drawable/xxx
         */
        getDrawable(refString:string):Drawable {
            if (refString.startsWith('@android:drawable/')) {
                const imageName = refString.substring('@android:drawable/'.length);
                const d = android.R.drawable[imageName] || android.R.image[imageName];
                if (d) return d;
            }
            if (refString.startsWith('@android:color/')) {
                refString = refString.substring('@android:color/'.length);
                let color = android.R.color[refString];
                if (color instanceof ColorStateList) {
                    color = (<ColorStateList>color).getDefaultColor();
                }
                return new android.graphics.drawable.ColorDrawable(color);
            }

            if(!refString.startsWith('@')){
                refString = '@drawable/' + refString;
            }
            if(Resources._AppBuildDrawableFinder){
                let drawable = Resources._AppBuildDrawableFinder(refString);
                if(drawable) return drawable;
            }

            throw new Error("NotFoundException: Resource " + refString + " is not found");
        }


        /**
         * @param refString @color/xxx @android:color/xxx
         */
        getColor(refString:string):number {
            if(refString.startsWith('@android:color/')){
                let color = android.R.color[refString.substring('@android:color/'.length)];
                if(color instanceof ColorStateList){
                    color = (<ColorStateList>color).getDefaultColor();
                }
                if (color != null) {
                    return color;
                }

            }

            if(!refString.startsWith('@')){
                refString = '@color/' + refString;
            }
            let color = ResourcesCache.getColor(refString);
            if (color != null) return color;

            let ele = this.getValue(refString);
            if(ele) {
                let text = ele.innerText;
                if(text.startsWith('@android:color/') || text.startsWith('@color/')){
                    color = this.getColor(text);
                } else {
                    color = Color.parseColor(text);
                }
                ResourcesCache.setColor(refString, color);
                return color;
            }
            ele = this.getXml(refString);
            if(ele){
                let colorList = ColorStateList.createFromXml(this, ele);
                if(colorList) {
                    color = colorList.getDefaultColor();
                    ResourcesCache.setColor(refString, color);
                    return color;
                }
            }

            throw new Error("NotFoundException: Resource " + refString + " is not found");
        }

        /**
         * @param refString @color/xxx @android:color/xxx
         */
        getColorStateList(refString:string):ColorStateList {
            if(refString.startsWith('@android:color/')){
                let color = android.R.color[refString.substring('@android:color/'.length)];
                if(typeof color === "number"){
                    color = ColorStateList.valueOf(color);
                }
                if (color) return color;
            }

            if(!refString.startsWith('@')){
                refString = '@color/' + refString;
            }
            let colorList = ResourcesCache.getColorStateList(refString);
            if (colorList) return colorList;

            let ele = this.getXml(refString);
            if(ele){
                colorList = ColorStateList.createFromXml(this, ele);
                ResourcesCache.setColorStateList(refString, colorList);
                return colorList;
            }
            ele = this.getValue(refString);
            if(ele){
                let text = ele.innerText;
                if(text.startsWith('@android:color/') || text.startsWith('@color/')){
                    colorList = this.getColorStateList(text);
                } else {
                    colorList = ColorStateList.valueOf(Color.parseColor(text));
                }
                ResourcesCache.setColorStateList(refString, colorList);
                return colorList;
            }

            throw new Error("NotFoundException: Resource " + refString + " is not found");
        }

        /**
         * Retrieve a dimensional for a particular resource reference.  Unit
         * conversions are based on the current {@link DisplayMetrics} associated
         * with the resources.
         *
         * @return Resource dimension value multiplied by the appropriate
         * metric.
         *
         * @throws NotFoundException Throws NotFoundException if the given ID does not exist.
         *
         * @see #getDimensionPixelOffset
         * @see #getDimensionPixelSize
         */
        getDimension(refString:string, baseValue=0): number {
            if(!refString.startsWith('@')) refString = '@dimen/' + refString;
            let ele = this.getValue(refString);
            if(ele){
                let text = ele.innerText;
                return android.util.TypedValue.complexToDimension(text, baseValue, this.getDisplayMetrics());
            }
            throw new Error("NotFoundException: Resource " + refString + " is not found");
        }

        /**
         * Retrieve a dimensional for a particular resource reference for use
         * as an offset in raw pixels.  This is the same as
         * {@link #getDimension}, except the returned value is converted to
         * integer pixels for you.  An offset conversion involves simply
         * truncating the base value to an integer.
         *
         * @return Resource dimension value multiplied by the appropriate
         * metric and truncated to integer pixels.
         *
         * @throws NotFoundException Throws NotFoundException if the given ID does not exist.
         *
         * @see #getDimension
         * @see #getDimensionPixelSize
         */
        getDimensionPixelOffset(refString:string, baseValue=0): number {
            if(!refString.startsWith('@')) refString = '@dimen/' + refString;
            let ele = this.getValue(refString);
            if(ele){
                let text = ele.innerText;
                return android.util.TypedValue.complexToDimensionPixelOffset(text, baseValue, this.getDisplayMetrics());
            }
            throw new Error("NotFoundException: Resource " + refString + " is not found");
        }

        getDimensionPixelSize(refString:string, baseValue=0): number {
            if(!refString.startsWith('@')) refString = '@dimen/' + refString;
            let ele = this.getValue(refString);
            if(ele){
                let text = ele.innerText;
                return android.util.TypedValue.complexToDimensionPixelSize(text, baseValue, this.getDisplayMetrics());
            }
            throw new Error("NotFoundException: Resource " + refString + " is not found");
        }

        getBoolean(refString:string):boolean {
            if(!refString.startsWith('@')) refString = '@bool/' + refString;
            let ele = this.getValue(refString);
            if(ele){
                let text = ele.innerText;
                return text == 'true'
            }
            throw new Error("NotFoundException: Resource " + refString + " is not found");
        }

        getInteger(refString:string):number {
            if(!refString.startsWith('@')) refString = '@integer/' + refString;
            let ele = this.getValue(refString);
            if(ele){
                return parseInt(ele.innerText);
            }
            throw new Error("NotFoundException: Resource " + refString + " is not found");
        }

        getIntArray(refString:string):number[] {
            if(!refString.startsWith('@')) refString = '@array/' + refString;
            let ele = this.getValue(refString);
            if(ele){
                let intArray:number[] = [];
                for(let child of Array.from(ele.children)){
                    intArray.push(parseInt((<HTMLElement>child).innerText));
                }
                return intArray;
            }
            throw new Error("NotFoundException: Resource " + refString + " is not found");
        }

        getFloat(refString:string):number {
            return this.getDimension(refString);
        }

        /**
         * @param refString @string/xxx @android:string/xxx
         */
        getString(refString:string):string {
            if(refString.startsWith('@android:string/')) {
                let s = android.R.string[refString.substring('@android:string/'.length)];
                if(s) return s;
            }

            if(!refString.startsWith('@')) refString = '@string/' + refString;
            let value = ResourcesCache.getString(refString);
            if (value) return value;
            let ele = this.getValue(refString);
            if(ele){
                value = ele.innerText;
                ResourcesCache.setString(refString, value);
            }
            throw new Error("NotFoundException: Resource " + refString + " is not found");
        }

        /**
         * @param refString @array/xxx @android:array/xxx
         */
        getStringArray(refString:string):string[] {
            if(!refString.startsWith('@')) refString = '@array/' + refString;
            let ele = this.getValue(refString);
            if(ele){
                let stringArray:string[] = [];
                for(let child of Array.from(ele.children)){
                    stringArray.push((<HTMLElement>child).innerText);
                }
                return stringArray;
            }
            throw new Error("NotFoundException: Resource " + refString + " is not found");
        }

        /**
         * @param refString @layout/xxx, @android:layout/xxx
         */
        getLayout(refString:string):HTMLElement {
            if(!refString || !refString.trim().startsWith('@')) return null;

            if(refString.startsWith('@android:layout/')){
                let layout = android.R.layout.getLayoutData(refString.substring('@android:layout/'.length));
                if (layout) return layout;
            }

            if(!refString.startsWith('@')) refString = '@layout/' + refString;
            let ele = this.getXml(refString);
            if(ele) return ele;
            throw new Error("NotFoundException: Resource " + refString + " is not found");
        }

        getStyleAsMap(refString:string):Map<string, string> {
            if (!refString) return null;
            if(refString.startsWith('@android:attr/')){
                let map = android.R.attr.getAttrMap(refString.substring('@android:attr/'.length));
                if (map) return map;
            }

            if(!refString.startsWith('@')){
                refString = '@style/' + refString;
            }
            let styleMap = ResourcesCache.getStyleMap(refString);
            if (styleMap) return styleMap;
            styleMap = new Map<string, string>();

            const parseStyle = (refString:string)=>{
                let styleXml = this.getValue(refString);
                if(!styleXml) return;
                let [stylePrefix, styleName] = refString.split('/');
                //merge attr 'parent'
                let parent = styleXml.getAttribute('parent');
                if(parent){
                    if(!parent.startsWith('@')){
                        parent = stylePrefix + parent;
                    }
                    parseStyle(parent);
                }

                //merge attr name's parent
                if(styleName.includes('.')){
                    let parts = styleName.split('.');
                    parts.shift();
                    let nameParent = parts.join('.');
                    parseStyle(stylePrefix + nameParent);
                }

                for(let item of Array.from(styleXml.children)){
                    let name = (<Element>item).getAttribute('name');
                    if(name){
                        styleMap.set(name, (<HTMLElement>item).innerText);
                    }
                }
            };

            parseStyle(refString);

            ResourcesCache.setStyleMap(refString, styleMap);
            return styleMap;
        }

        /**
         * Return an Xml file through which you can read a generic XML
         * resource for the given resource.
         * @param refString @layout/xxx, @drawable/xxx, @color/xxx
         */
        getXml(refString:string):HTMLElement {
            if(Resources._AppBuildXmlFinder) return Resources._AppBuildXmlFinder(refString);
        }

        /**
         * Return the raw data associated with a resource reference string.
         * @param refString @string/xxx, @color/xxx, @array/xxx, ...
         * @param resolveRefs If true, a resource that is a reference to another
         *                    resource will be followed so that you receive the
         *                    actual final resource data.  If false, the TypedValue
         *                    will be filled in with the reference itself.
         */
        getValue(refString:string, resolveRefs=true):HTMLElement {
            if(Resources._AppBuildValueFinder){
                let ele = Resources._AppBuildValueFinder(refString);
                if(!ele) return null;
                if(resolveRefs && ele.children.length === 0) {
                    let str = ele.innerText;
                    if(str.startsWith('@')) {
                        return this.getValue(refString, true) || ele;
                    }
                }
                return ele;
            }
        }



        /**
         * Retrieve a set of basic attribute values from an AttributeSet, not
         * performing styling of them using a theme and/or style resources.
         *
         * @param attrs The specific attributes to be retrieved.
         * @return Returns a TypedArray holding an array of the attribute values.
         * Be sure to call {@link TypedArray#recycle() TypedArray.recycle()}
         * when done with it.
         *
         * @see Theme#obtainStyledAttributes(AttributeSet, int[], int, int)
         */
        public obtainAttributes(attrs:HTMLElement):TypedArray {
            return TypedArray.obtain(this, attrs);
        }



        static set buildDrawableFinder(value){
            throw Error('Error: old build tool not support. Please update your build-tool.');
        }
        static set buildLayoutFinder(value){
            throw Error('Error: old build tool not support. Please update your build-tool.');
        }
        static get buildResourcesElement(){
            throw Error('Error: old build tool not support. Please update your build-tool.');
        }

    }

    class ResourcesCache {
        private static styleMapCache = new Map<string, Map<string, string>>();
        static getStyleMap(refString:string):Map<string, string> {
            const map = ResourcesCache.styleMapCache.get(refString);
            return map ? new Map(map) : null;
        }
        static setStyleMap(refString:string, value:Map<string, string>):void {
            ResourcesCache.styleMapCache.set(refString, new Map(value));
        }

        private static stringCache = new Map<string, string>();
        static getString(refString:string):string {
            const v = ResourcesCache.stringCache.get(refString);
            return v ? v : null;
        }
        static setString(refString:string, value:string):void {
            ResourcesCache.stringCache.set(refString, value);
        }

        private static colorCache = new Map<string, number>();
        static getColor(refString:string):number {
            const v = ResourcesCache.colorCache.get(refString);
            return v ? v : null;
        }
        static setColor(refString:string, value:number):void {
            ResourcesCache.colorCache.set(refString, value);
        }

        private static colorStateListCache = new Map<string, ColorStateList>();
        static getColorStateList(refString:string):ColorStateList {
            const v = ResourcesCache.colorStateListCache.get(refString);
            return v ? v : null;
        }
        static setColorStateList(refString:string, value:ColorStateList):void {
            ResourcesCache.colorStateListCache.set(refString, value);
        }

        static clearCache():void {
            ResourcesCache.styleMapCache.clear();
        }
    }

    window.addEventListener('resize', ()=>{
        ResourcesCache.clearCache();
    });
}
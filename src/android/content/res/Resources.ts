/**
 * Created by linfaxin on 15/10/5.
 * Androidui's impl
 */
///<reference path="../../util/DisplayMetrics.ts"/>
///<reference path="../../content/Context.ts"/>
///<reference path="../../graphics/drawable/Drawable.ts"/>
///<reference path="../../R/layout.ts"/>
///<reference path="TypedArray.ts"/>

module android.content.res{
    import DisplayMetrics = android.util.DisplayMetrics;
    import Drawable = android.graphics.drawable.Drawable;
    import Color = android.graphics.Color;
    import SynchronizedPool = android.util.Pools.SynchronizedPool;
    import ColorDrawable = android.graphics.drawable.ColorDrawable;

    export class Resources{
        private static instance = new Resources();
        // Pool of TypedArrays targeted to this Resources object.
        mTypedArrayPool:SynchronizedPool<TypedArray> = new SynchronizedPool<TypedArray>(5);

        private displayMetrics:DisplayMetrics;
        private context:Context;

        //value set in app's R.ts
        static _AppBuildImageFileFinder: (refString:string)=>Drawable = null;
        static _AppBuildXmlFinder: (refString:string)=>HTMLElement = null;
        static _AppBuildValueFinder: (refString:string)=>HTMLElement = null;

        constructor(context?:Context) {
            this.context = context;

            // FIXME will memory leak (Activity ref with window)
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

        private getDefStyle(refString:string):any{
            if(refString.startsWith('@android:attr/')){
                refString = refString.substring('@android:attr/'.length);
                return android.R.attr[refString];
            }
        }

        /**
         * @param refString @drawable/xxx, @android:drawable/xxx
         */
        getDrawable(refString:string):Drawable {
            if(refString.startsWith('@android:drawable/')){
                refString = refString.substring('@android:drawable/'.length);
                return android.R.drawable[refString] || android.R.image[refString];
            }
            if(refString.startsWith('@android:color/')){
                refString = refString.substring('@android:color/'.length);
                let color = android.R.color[refString];
                if(color instanceof ColorStateList){
                    color = (<ColorStateList>color).getDefaultColor();
                }
                return new ColorDrawable(color);
            }

            if(Resources._AppBuildImageFileFinder){
                let drawable = Resources._AppBuildImageFileFinder(refString);
                if(drawable) return drawable;
            }

            if(!refString.startsWith('@')){
                refString = '@drawable/' + refString;
            }
            let ele = this.getXml(refString);
            if(ele){
                return Drawable.createFromXml(this, ele);
            }
            ele = this.getValue(refString);
            if(ele){
                let text = ele.innerText;
                if(text.startsWith('@android:drawable/') || text.startsWith('@drawable/')
                    || text.startsWith('@android:color/') || text.startsWith('@color/')){
                    return this.getDrawable(text);
                }
                return Drawable.createFromXml(this, ele);
            }

            throw new Error("NotFoundException: Resource " + refString + " is not found");
        }


        /**
         * @param refString @color/xxx @android:color/xxx
         */
        getColor(refString:string):number {
            if(refString.startsWith('@android:color/')){
                refString = refString.substring('@android:color/'.length);
                let color = android.R.color[refString];
                if(color instanceof ColorStateList){
                    color = (<ColorStateList>color).getDefaultColor();
                }
                return color;

            }else{
                if(!refString.startsWith('@color/')){
                    refString = '@color/' + refString;
                }
                let ele = this.getValue(refString);
                if(ele){
                    let text = ele.innerText;
                    if(text.startsWith('@android:color/') || text.startsWith('@color/')){
                        return this.getColor(text);
                    }
                    return Color.parseColor(text);
                }
                ele = this.getXml(refString);
                if(ele){
                    let colorList = ColorStateList.createFromXml(this, ele);
                    if(colorList) return colorList.getDefaultColor();
                }
            }

            throw new Error("NotFoundException: Resource " + refString + " is not found");
        }

        /**
         * @param refString @color/xxx @android:color/xxx
         */
        getColorStateList(refString:string):ColorStateList {
            if(refString.startsWith('@android:color/')){
                refString = refString.substring('@android:color/'.length);
                let color = android.R.color[refString];
                if(typeof color === "number"){
                    color = ColorStateList.valueOf(color);
                }
                return color;

            } else {
                if(!refString.startsWith('@color/')){
                    refString = '@color/' + refString;
                }
                let ele = this.getXml(refString);
                if(ele){
                    return ColorStateList.createFromXml(this, ele);
                }
                ele = this.getValue(refString);
                if(ele){
                    let text = ele.innerText;
                    if(text.startsWith('@android:color/') || text.startsWith('@color/')){
                        return this.getColorStateList(text);
                    }
                    return ColorStateList.valueOf(Color.parseColor(text));
                }
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
            if(!refString.startsWith('@dimen/')) refString = '@dimen/' + refString;
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
            if(!refString.startsWith('@dimen/')) refString = '@dimen/' + refString;
            let ele = this.getValue(refString);
            if(ele){
                let text = ele.innerText;
                return android.util.TypedValue.complexToDimensionPixelOffset(text, baseValue, this.getDisplayMetrics());
            }
            throw new Error("NotFoundException: Resource " + refString + " is not found");
        }

        getDimensionPixelSize(refString:string, baseValue=0): number {
            if(!refString.startsWith('@dimen/')) refString = '@dimen/' + refString;
            let ele = this.getValue(refString);
            if(ele){
                let text = ele.innerText;
                return android.util.TypedValue.complexToDimensionPixelSize(text, baseValue, this.getDisplayMetrics());
            }
            throw new Error("NotFoundException: Resource " + refString + " is not found");
        }

        getBoolean(refString:string):boolean {
            if(!refString.startsWith('@bool/')) refString = '@bool/' + refString;
            let ele = this.getValue(refString);
            if(ele){
                let text = ele.innerText;
                return text == 'true'
            }
            throw new Error("NotFoundException: Resource " + refString + " is not found");
        }

        getInteger(refString:string):number {
            if(!refString.startsWith('@integer/')) refString = '@integer/' + refString;
            let ele = this.getValue(refString);
            if(ele){
                return parseInt(ele.innerText);
            }
            throw new Error("NotFoundException: Resource " + refString + " is not found");
        }

        getIntArray(refString:string):number[] {
            if(!refString.startsWith('@array/')) refString = '@array/' + refString;
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
            if(refString.startsWith('@android:string/')){
                refString = refString.substring('@android:string/'.length);
                return android.R.string_[refString];
            }

            if(!refString.startsWith('@string/')) refString = '@string/' + refString;
            let ele = this.getValue(refString);
            if(ele){
                return ele.innerText;
            }
            throw new Error("NotFoundException: Resource " + refString + " is not found");
        }

        /**
         * @param refString @array/xxx @android:array/xxx
         */
        getStringArray(refString:string):string[] {
            if(!refString.startsWith('@array/')) refString = '@array/' + refString;
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
                refString = refString.substring('@android:layout/'.length);
                return android.R.layout.getLayoutData(refString);

            }

            if(!refString.startsWith('@layout/')) refString = '@layout/' + refString;
            let ele = this.getXml(refString);
            if(ele) return ele;
            throw new Error("NotFoundException: Resource " + refString + " is not found");
        }

        /**
         * @param refString @anim/xxx, @android:anim/xxx
         */
        getAnimation(refString:string):android.view.animation.Animation {
            if(!refString || !refString.trim().startsWith('@')) return null;
            if(refString.startsWith('@android:anim/')){
                refString = refString.substring('@android:anim/'.length);
                return android.R.anim[refString];
            }
            // if(refString.startsWith('@anim/')){
            //     refString = refString.substring('@anim/'.length);
            //     return window.R.anim[refString];
            // }
        }

        private getStyleAsMap(refString:string):Map<string, string>{
            if(!refString.startsWith('@style/')){
                refString = '@style/' + refString;
            }
            let styleMap = new Map<string, string>();

            const parseStyle = (refString:string)=>{
                let styleXml = this.getValue(refString);
                if(!styleXml) return;
                //merge attr 'parent'
                let parent = styleXml.getAttribute('parent');
                if(parent){
                    if(!parent.startsWith('@style/')){
                        parent = '@style/' + parent;
                    }
                    parseStyle(parent);
                }

                //merge attr name's parent
                let styleName = refString.substring('@style/'.length);
                if(styleName.includes('.')){
                    let parts = styleName.split('.');
                    parts.shift();
                    let nameParent = parts.join('.');
                    parseStyle('@style/' + nameParent);
                }

                for(let item of Array.from(styleXml.children)){
                    let name = (<Element>item).getAttribute('name');
                    if(name){
                        styleMap.set(name, (<HTMLElement>item).innerText);
                    }
                }
            };

            parseStyle(refString);
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
                if(resolveRefs && ele.children.length==0){
                    let str = ele.innerText;
                    if(str.startsWith('@')){
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
        /**
         * Retrieve styled attribute information.
         */
        public obtainStyledAttributes(attrs:HTMLElement, defStyleAttr:Map<string, string>):TypedArray {
            return TypedArray.obtain(this, attrs, defStyleAttr);
        }



        static set buildDrawableFinder(value){
            throw Error('Error: old build tool not support. Please update your build_res.js file.');
        }
        static set buildLayoutFinder(value){
            throw Error('Error: old build tool not support. Please update your build_res.js file.');
        }
        static get buildResourcesElement(){
            throw Error('Error: old build tool not support. Please update your build_res.js file.');
        }

    }
}
/**
 * Created by linfaxin on 15/10/5.
 * Androidui's impl
 */
///<reference path="../../util/DisplayMetrics.ts"/>
///<reference path="../../content/Context.ts"/>
///<reference path="../../graphics/drawable/Drawable.ts"/>
///<reference path="../../R/layout.ts"/>

module android.content.res{
    import DisplayMetrics = android.util.DisplayMetrics;
    import Drawable = android.graphics.drawable.Drawable;

    export class Resources{
        private static instance = new Resources();

        private displayMetrics:DisplayMetrics;
        private context:Context;

        constructor(context?:Context) {
            this.context = context;
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
            let displayMetrics = this.displayMetrics;
            let density = window.devicePixelRatio;

            displayMetrics.xdpi = window.screen.deviceXDPI || DisplayMetrics.DENSITY_DEFAULT;
            displayMetrics.ydpi = window.screen.deviceYDPI || DisplayMetrics.DENSITY_DEFAULT;
            displayMetrics.density = density;
            displayMetrics.densityDpi = density * DisplayMetrics.DENSITY_DEFAULT;
            displayMetrics.scaledDensity = density;

            displayMetrics.widthPixels = document.documentElement.offsetWidth * density;
            displayMetrics.heightPixels = document.documentElement.offsetHeight * density;

            return displayMetrics;
        }

        private getObjectRef(refString:string):any{
            if(refString.startsWith('@')) refString = refString.substring(1);
            if(refString == 'null') return null;
            //support like @android.R.drawable.xxx
            try {
                return (<any>window).eval(refString);
            } catch (e) {
                console.log(e);
            }
        }

        static buildAttrFinder: (refString:string)=>any;
        getAttr(refString:string):any{
            if(refString.startsWith('@android:attr/')){
                refString = refString.substring('@android:attr/'.length);
                return android.R.attr[refString];

            }else if(Resources.buildAttrFinder && refString.startsWith('@attr/')){
                return Resources.buildAttrFinder(refString);

            }else if(refString.startsWith('@')){
                return this.getObjectRef(refString);
            }
            return null;
        }

        static buildDrawableFinder: (refString:string)=>Drawable;
        /**
         * @param refString @drawable/xxx, @android:drawable/xxx, @android.R.drawable.xxx
         */
        getDrawable(refString:string):Drawable {
            if(refString.startsWith('@android:drawable/')){
                refString = refString.substring('@android:drawable/'.length);
                return android.R.drawable[refString] || android.R.image[refString];

            }else if(Resources.buildDrawableFinder && refString.startsWith('@drawable/')){
                refString = refString.substring('@drawable/'.length);
                return Resources.buildDrawableFinder(refString);

            }else if(refString.startsWith('@')){
                return this.getObjectRef(refString);
            }
        }

        getColor(refString:string):number {
            let s = this.getString(refString);
            return android.graphics.Color.parseColor(s);
        }

        getColorStateList(refString:string):ColorStateList {
            if(refString.startsWith('@android:color/')){
                refString = refString.substring('@android:color/'.length);
                return android.R.color[refString];

            }else if(refString.startsWith('@')){
                return this.getObjectRef(refString);
            }
            //TODO app color list defined
        }

        /**
         * @param refString @string/xxx @android:string/xxx
         */
        getString(refString:string, notFindValue=refString):string {
            if(!refString || !refString.startsWith('@')) return notFindValue;
            if(refString.startsWith('@android:string/')){
                refString = refString.substring('@android:string/'.length);
                return android.R.string_[refString];
            }

            let referenceArray = [];
            let attrValue = refString;
            while(attrValue && attrValue.startsWith('@')){//ref value
                let reference = this.getReference(attrValue, false);
                if(!reference) return notFindValue;
                if(referenceArray.indexOf(reference)>=0) throw Error('findReference Error: circle reference');
                referenceArray.push(reference);

                attrValue = (<HTMLElement>reference).innerText;
            }
            return attrValue;
        }

        /**
         * @param refString @array/xxx @android:array/xxx
         */
        getTextArray(refString:string):string[] {
            if(!refString || !refString.startsWith('@')) return null;
            let reference = this.getReference(refString, false);
            if(reference instanceof HTMLElement){
                let array = [];
                for(let ele of Array.from(reference.children)){
                    if(ele instanceof HTMLElement) array.push(ele.innerText);
                }
                return array;
            }
            return null;
        }



        static buildLayoutFinder: (refString:string)=>HTMLElement;
        /**
         * @param refString @layout/xxx, @android:layout/xxx, @android.R.layout.xxx
         */
        getLayout(refString:string):HTMLElement {
            if(!refString || !refString.trim().startsWith('@')) return null;


            //find in document
            let reference = this.getReference(refString, true);
            if(reference) return <HTMLElement>reference.firstElementChild;

            if(refString.startsWith('@android:layout/')){
                return android.R.layout.getLayoutData(refString);

            }else if(Resources.buildLayoutFinder && refString.startsWith('@layout/')){
                return Resources.buildLayoutFinder(refString);

            }else if(refString.startsWith('@')){
                return this.getObjectRef(refString);
            }

        }
        

        private static emptySelectorNode = document.createElement('resources');
        static buildResourcesElement:HTMLElement = document.createElement('resources');
        static SDKResourcesElement:HTMLElement = document.createElement('resources');
        private getReference(refString:string, cloneNode=true):Element {
            if(refString) refString = refString.trim();
            if(refString && refString.startsWith('@')){
                refString = refString.substring(1);
                let [tagName, ...refIds] = refString.split('/');
                if(!refIds || refIds.length===0) return null;

                let resourcesElement = Resources.buildResourcesElement;
                if(tagName.startsWith('android:')){
                    tagName = tagName.substring('android:'.length);
                    resourcesElement = Resources.SDKResourcesElement;
                }
                if(!tagName.startsWith('android-')) tagName = 'android-'+tagName;

                //@android:style/btn1/pressed => SDKResourcesElement: resources android-style#btn1 #pressed
                //@style/btn1/pressed => buildResourcesElement: resources android-style#btn1 #pressed
                let q = 'resources '+tagName + '#' + (<any>refIds).join(' #');

                let rootElement = this.context ? this.context.androidUI.rootResourceElement : Resources.emptySelectorNode;
                let el = rootElement.querySelector(q) || resourcesElement.querySelector(q);
                if(!el) return null;
                return cloneNode ? <Element>el.cloneNode(true) : el;
            }
            return null;
        }



    }
}
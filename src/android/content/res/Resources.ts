/**
 * Created by linfaxin on 15/10/5.
 */
///<reference path="../../util/DisplayMetrics.ts"/>
///<reference path="../../content/Context.ts"/>

module android.content.res{
    import DisplayMetrics = android.util.DisplayMetrics;

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

            displayMetrics.widthPixels = window.innerWidth * density;
            displayMetrics.heightPixels = window.innerHeight * density;

            return displayMetrics;
        }


        getString(refString:string):string {
            if(!refString || !refString.startsWith('@')) return refString;
            let referenceArray = [];
            let attrValue = refString;
            while(attrValue && attrValue.startsWith('@')){//ref value
                let reference = this.getReference(attrValue, false);
                if(referenceArray.indexOf(reference)>=0) throw Error('findReference Error: circle reference');
                referenceArray.push(reference);

                attrValue = (<HTMLElement>reference).innerText;
            }
            return attrValue;
        }

        getLayout(refString:string):HTMLElement {
            let reference = this.getReference(refString, true);
            return reference ? <HTMLElement>reference.firstElementChild : null;
        }
        

        private static emptySelectorNode = document.createElement('resources');
        static buildResourcesElement:HTMLElement = document.createElement('resources');
        private getReference(refString:string, cloneNode=true):Element {
            if(refString) refString = refString.trim();
            if(refString && refString.startsWith('@')){
                refString = refString.substring(1);
                let [tagName, ...refIds] = refString.split('/');
                if(!refIds || refIds.length===0) return null;

                if(!tagName.startsWith('android-')) tagName = 'android-'+tagName;
                //@style/btn1/pressed => resources android-style#btn1 #pressed
                let q = 'resources '+tagName + '#' + (<any>refIds).join(' #');
                let rootElement = this.context ? this.context.androidUI.rootResourceElement : Resources.emptySelectorNode;
                let el = rootElement.querySelector(q) || Resources.buildResourcesElement.querySelector(q) || document.querySelector(q);
                return cloneNode ? <Element>el.cloneNode(true) : el;
            }
            return null;
        }



    }
}
/**
 * Created by linfaxin on 15/11/26.
 */
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/graphics/drawable/ColorDrawable.ts"/>
///<reference path="../../android/content/res/ColorStateList.ts"/>
///<reference path="../../android/content/res/Resources.ts"/>
///<reference path="../../android/content/Context.ts"/>
///<reference path="AttrValueParser.ts"/>


module androidui.attr {
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import Gravity = android.view.Gravity;
    import Drawable = android.graphics.drawable.Drawable;
    import ColorDrawable = android.graphics.drawable.ColorDrawable;
    import Color = android.graphics.Color;
    import ColorStateList = android.content.res.ColorStateList;
    import Resources = android.content.res.Resources;
    import Context = android.content.Context;
    import TypedValue = android.util.TypedValue;

    export class AttrBinder {
        private host:View|ViewGroup.LayoutParams;
        private attrChangeMap:Map<string, (newValue:any)=>void>;
        private attrStashMap:Map<string, ()=>any>;
        private classAttrBindList:AttrBinder.ClassBinderMap[] = [];
        private objectRefs = [];
        private mContext:Context;

        constructor(host:View|ViewGroup.LayoutParams){
            this.host = host;
        }

        addClassAttrBind(classAttrBind:AttrBinder.ClassBinderMap):void {
            if (classAttrBind) {
                this.classAttrBindList.push(classAttrBind);
            }
        }

        addAttr(attrName:string, onAttrChange:(newValue:any)=>void, stashAttrValueWhenStateChange?:()=>any):void {
            if(!attrName) return;
            attrName = attrName.toLowerCase();
            if(onAttrChange){
                if (!this.attrChangeMap) {
                    this.attrChangeMap = new Map<string, (newValue:any)=>void>();
                }
                this.attrChangeMap.set(attrName, onAttrChange);
            }
            if(stashAttrValueWhenStateChange) {
                this.attrStashMap = new Map<string, ()=>any>();
                this.attrStashMap.set(attrName, stashAttrValueWhenStateChange);
            }
        }

        onAttrChange(attrName:string, attrValue:any, context:Context):void {
            this.mContext = context;
            if(!attrName) return;
            attrName = attrName.toLowerCase();
            let onAttrChangeCall = this.attrChangeMap && this.attrChangeMap.get(attrName);
            if(onAttrChangeCall) {
                onAttrChangeCall.call(this.host, attrValue, this.host);
            }
            for(let classAttrBind of this.classAttrBindList) {
                classAttrBind.callSetter(attrName, this.host, attrValue, this);
            }
        }

        /**
         * @returns {string} undefined if not set get callback on addAttr
         */
        getAttrValue(attrName:string):string {
            if(!attrName) return undefined;
            attrName = attrName.toLowerCase();
            let getAttrCall = this.attrStashMap && this.attrStashMap.get(attrName);
            let value;
            if(getAttrCall){
                value = getAttrCall.call(this.host);
            } else {
                for(let classAttrBind of this.classAttrBindList) {
                    value = classAttrBind.callGetter(attrName, this.host);
                    if (value) break;
                }
            }
            if(value == null) return null;
            if(typeof value === "number" || typeof value === "boolean" || typeof value === "string") return value+'';
            return this.setRefObject(value);
        }


        private getRefObject(ref:string):any{
            if(ref && ref.startsWith('@ref/')){
                ref = ref.substring('@ref/'.length);
                let index = Number.parseInt(ref);
                if(Number.isInteger(index)){
                    return this.objectRefs[index];
                }
            }
        }

        private setRefObject(obj:any):string{
            let index = this.objectRefs.indexOf(obj);
            if(index>=0) return '@ref/'+index;
            this.objectRefs.push(obj);
            return '@ref/'+(this.objectRefs.length-1);
        }


        /**
         * @param value
         * @returns {[left, top, right, bottom]}
         */
        parsePaddingMarginLTRB(value):string[]{
            value = (value + '');
            let parts = [];
            for(let part of value.split(' ')){
                if(part) parts.push(part);
            }
            let ltrb: Array<any>;
            switch (parts.length){
                case 1 : ltrb = [parts[0], parts[0], parts[0], parts[0]]; break;
                case 2 : ltrb = [parts[1], parts[0], parts[1], parts[0]]; break;
                case 3 : ltrb = [parts[1], parts[0], parts[1], parts[2]]; break;
                case 4 : ltrb = [parts[3], parts[0], parts[1], parts[2]]; break;
            }
            if (ltrb) {
                ltrb = ltrb.map((v) => this.parseDimension(v));
                return ltrb;
            }
            throw Error('not a padding or margin value : '+value);

        }

        parseEnum(value, enumMap:Map<string,number>, defaultValue:number):number {
            if(Number.isInteger(value)){
                return value;
            }
            if(enumMap.has(value)){
                return enumMap.get(value);
            }
            return defaultValue;
        }

        parseBoolean(value, defaultValue = true):boolean{
            if(value===false) return false;
            else if(value===true) return true;
            let res = this.mContext ? this.mContext.getResources() : Resources.getSystem();
            if (typeof value === "string") {
                return AttrValueParser.parseBoolean(res, value, defaultValue);
            }
            return defaultValue;
        }

        parseGravity(s:string, defaultValue=Gravity.NO_GRAVITY):number {
            let gravity = Number.parseInt(s);
            if(Number.isInteger(gravity)) return gravity;

            return Gravity.parseGravity(s, defaultValue);
        }

        parseDrawable(s:string):Drawable{
            if(!s) return null;
            if((<any>s) instanceof Drawable) return <Drawable><any>s;
            if(s.startsWith('@ref/')){
                let refObj = this.getRefObject(s);
                if(refObj) return refObj;
            }
            let res = this.mContext ? this.mContext.getResources() : Resources.getSystem();
            s = (s + '').trim();
            return AttrValueParser.parseDrawable(res, s);
        }

        parseColor(value:string, defaultValue?:number):number{
            let color = Number.parseInt(value);
            if(Number.isInteger(color)) return color;
            let res = this.mContext ? this.mContext.getResources() : Resources.getSystem();
            color = AttrValueParser.parseColor(res, value, defaultValue);
            if(isNaN(color)){
                return Color.BLACK;
            }
            return color;
        }

        parseColorList(value:string):ColorStateList{
            if(!value) return null;
            if((<any>value) instanceof ColorStateList) return <ColorStateList><any>value;
            if(typeof value == 'number') return ColorStateList.valueOf(<number><any>value);
            if(value.startsWith('@ref/')){
                let refObj = this.getRefObject(value);
                if(refObj) return refObj;
            }
            let res = this.mContext ? this.mContext.getResources() : Resources.getSystem();
            return AttrValueParser.parseColorStateList(res, value);
        }

        parseInt(value, defaultValue = 0):number{
            if(typeof value == 'number') return <number><any>value;
            let res = this.mContext ? this.mContext.getResources() : Resources.getSystem();
            return AttrValueParser.parseInt(res, value, defaultValue);
        }

        parseFloat(value, defaultValue = 0):number{
            if(typeof value == 'number') return <number><any>value;
            let res = this.mContext ? this.mContext.getResources() : Resources.getSystem();
            return AttrValueParser.parseFloat(res, value, defaultValue);
        }

        parseDimension(value, defaultValue = 0, baseValue = 0):number{
            if(typeof value == 'number') return <number><any>value;
            let res = this.mContext ? this.mContext.getResources() : Resources.getSystem();
            return AttrValueParser.parseDimension(res, value, defaultValue, baseValue);
        }

        parseNumberPixelOffset(value, defaultValue = 0, baseValue = 0):number{
            if(typeof value == 'number') return <number><any>value;
            let res = this.mContext ? this.mContext.getResources() : Resources.getSystem();
            return AttrValueParser.parseDimensionPixelOffset(res, value, defaultValue, baseValue);
        }

        parseNumberPixelSize(value, defaultValue = 0, baseValue = 0):number{
            if(typeof value == 'number') return <number><any>value;
            let res = this.mContext ? this.mContext.getResources() : Resources.getSystem();
            return AttrValueParser.parseDimensionPixelSize(res, value, defaultValue, baseValue);
        }

        parseString(value, defaultValue?:string):string{
            let res = this.mContext ? this.mContext.getResources() : Resources.getSystem();
            if(typeof value === 'string') {
                return AttrValueParser.parseString(res, value, defaultValue);
            }
            return defaultValue;
        }

        parseStringArray(value):string[] {
            if(typeof value === 'string') {
                if(value.startsWith('@ref/')){
                    let refObj = this.getRefObject(value);
                    if(refObj) return refObj;
                }
                let res = this.mContext ? this.mContext.getResources() : Resources.getSystem();
                return AttrValueParser.parseTextArray(res, value);
            }
            return null;
        }

    }

    export module AttrBinder {
        export class ClassBinderMap {
            binderMap:Map<string, ClassBinderValue>;
            constructor(copyBinderMap?: Map<string, androidui.attr.AttrBinder.ClassBinderValue>) {
                this.binderMap = new Map<string, ClassBinderValue>(copyBinderMap);
            }

            set(key:string, value?:androidui.attr.AttrBinder.ClassBinderValue):ClassBinderMap {
                this.binderMap.set(key.toLowerCase(), value);
                return this;
            }

            get(key:string):androidui.attr.AttrBinder.ClassBinderValue {
                return this.binderMap.get(key.toLowerCase());
            }

            private callSetter(attrName:string, host:android.view.View|android.view.ViewGroup.LayoutParams, attrValue:any, attrBinder:AttrBinder):void {
                if (!attrName) return;
                let value = this.get(attrName);
                if (value) {
                    value.setter.call(host, host, attrValue, attrBinder);
                }
            }
            private callGetter(attrName:string, host:android.view.View|android.view.ViewGroup.LayoutParams): any {
                if (!attrName) return;
                let value = this.get(attrName);
                if (value) {
                    return value.getter.call(host, host);
                }
            }
        }

        export interface ClassBinderValue {
            setter:(host:android.view.View|android.view.ViewGroup.LayoutParams, attrValue:any, attrBinder:AttrBinder) => void;
            getter?:(host:android.view.View|android.view.ViewGroup.LayoutParams) => any;
        }
    }
}
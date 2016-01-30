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
        private attrChangeMap = new Map<string, (newValue:any)=>void>();
        private attrStashMap = new Map<string, ()=>any>();
        private objectRefs = [];
        private mContext:Context;

        constructor(host:View|ViewGroup.LayoutParams){
            this.host = host;
        }

        addAttr(attrName:string, onAttrChange:(newValue:any)=>void, stashAttrValueWhenStateChange?:()=>any):void {
            if(!attrName) return;
            attrName = attrName.toLowerCase();
            if(onAttrChange) this.attrChangeMap.set(attrName, onAttrChange);
            if(stashAttrValueWhenStateChange) this.attrStashMap.set(attrName, stashAttrValueWhenStateChange);
        }

        onAttrChange(attrName:string, attrValue:any, context:Context):void {
            this.mContext = context;
            if(!attrName) return;
            attrName = attrName.toLowerCase();
            let onAttrChangeCall = this.attrChangeMap.get(attrName);
            if(onAttrChangeCall) onAttrChangeCall.call(this.host, attrValue);
        }

        getAttrValue(attrName:string):any {
            if(!attrName) return null;
            attrName = attrName.toLowerCase();
            let getAttrCall = this.attrStashMap.get(attrName);
            if(getAttrCall){
                let value = getAttrCall.call(this.host);
                if(value==null) return null;
                if(typeof value === "number") return value+'';
                if(typeof value === "boolean") return value+'';
                if(typeof value === "string") return value;
                return this.setRefObject(value);
            }
            return null;
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
            switch (parts.length){
                case 1 : return [parts[0], parts[0], parts[0], parts[0]];
                case 2 : return [parts[1], parts[0], parts[1], parts[0]];
                case 3 : return [parts[1], parts[0], parts[1], parts[2]];
                case 4 : return [parts[3], parts[0], parts[1], parts[2]];
            }
            throw Error('not a padding or margin value : '+value);

        }

        parseBoolean(value, defaultValue = true):boolean{
            if(value===false || value ==='false' || value === '0') return false;
            else if(value===true || value ==='true' || value === '1' || value === '') return true;
            return defaultValue;
        }
        parseGravity(s:string, defaultValue=Gravity.NO_GRAVITY):number {
            let gravity = Number.parseInt(s);
            if(Number.isInteger(gravity)) return gravity;

            gravity = Gravity.NO_GRAVITY;
            try {
                let parts = s.split("|");
                parts.forEach((part)=> {
                    let g = Gravity[part.toUpperCase()];
                    if (Number.isInteger(g)) gravity |= g;
                });
            } catch (e) {
                console.error(e);
            }
            if(Number.isNaN(gravity) || gravity===Gravity.NO_GRAVITY) gravity = defaultValue;
            return gravity;
        }
        parseDrawable(s:string):Drawable{
            if(!s) return null;
            if((<any>s) instanceof Drawable) return <Drawable><any>s;
            s = (s + '').trim();
            if(s.startsWith('@')){
                let refObj = this.getRefObject(s);
                if(refObj) return refObj;

                return Resources.getSystem().getDrawable(s);

            }else if(s.startsWith('url(')){
                s = s.substring('url('.length);
                if(s.endsWith(')')) s = s.substring(0, s.length-1);
                return new androidui.image.NetDrawable(s);

            }else{
                try {
                    let color = this.parseColor(s);
                    return new ColorDrawable(color);
                } catch (e) {
                }
            }
            return null;
        }
        parseColor(value:string, defaultValue?:number):number{
            let color = Number.parseInt(value);
            if(Number.isInteger(color)) return color;

            try {
                if(value.startsWith('@')) {
                    return Resources.getSystem().getColor(value);

                } else {
                    if (value.startsWith('#') && value.length === 4) {//support parse #333
                        value = '#' + value[1] + value[1] + value[2] + value[2] + value[2] + value[2];
                    }
                    return Color.parseColor(value);
                }


            } catch (e) {
                if(defaultValue==null) throw e;
            }
            return defaultValue;
        }
        parseColorList(value:string):ColorStateList{
            if(!value) return null;
            if((<any>value) instanceof ColorStateList) return <ColorStateList><any>value;
            if(value.startsWith('@')){
                let refObj = this.getRefObject(value);
                if(refObj) return refObj;

                return Resources.getSystem().getColorStateList(value);

            }else {
                try {
                    let color = this.parseColor(value);
                    return ColorStateList.valueOf(color);
                } catch (e) {
                    console.log(e);
                }
            }
            return null;
        }

        parseNumber(value, defaultValue = 0, baseValue = 0):number{
            if(typeof value === 'string' && value.startsWith('@')){
                value = Resources.getSystem().getString(value);
            }
            try {
                return TypedValue.complexToDimensionPixelSize(value, baseValue);
            } catch (e) {
                return defaultValue;
            }
        }

        parseString(value, defaultValue?:string):string{
            if(typeof value === 'string'){
                if(value.startsWith('@')){
                    return Resources.getSystem().getString(value);
                }
                return value;
            }
            return defaultValue;
        }

        parseTextArray(value):string[] {
            value += '';
            if(value.startsWith('@')){
                return Resources.getSystem().getTextArray(value);

            }else{
                try {
                    let json = JSON.parse(value);
                    if(json instanceof Array) return json;
                } catch (e) {
                }
            }
            return null;
        }

    }
}
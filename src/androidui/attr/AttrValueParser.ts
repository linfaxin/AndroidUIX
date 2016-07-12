/**
 * Created by linfaxin on 16/7/12.
 */

module androidui.attr {
    /**
     * helper for parse attribute's value
     */
    export class AttrValueParser {

        static parseString(r:android.content.res.Resources, value:string, defValue=value):string {
            if(value.startsWith('@')){
                try {
                    return r.getString(value);
                } catch (e) {
                    console.warn(e);
                }
            }
            return defValue;
        }


        static parseBoolean(r:android.content.res.Resources, value:string, defValue:boolean):boolean {
            if(value.startsWith('@')){
                try {
                    return r.getBoolean(value);
                } catch (e) {
                    console.warn(e);
                }
            }
            if(value ==='false' || value === '0') return false;
            else if(value ==='true' || value === '1' || value === '') return true;
            return defValue;
        }

        static parseInt(r:android.content.res.Resources, value:string, defValue:number):number {
            if(value.startsWith('@')){
                try {
                    return r.getInteger(value);
                } catch (e) {
                    console.warn(e);
                }
            }
            let v = parseInt(value);
            if(isNaN(v)) return defValue;
            return v;
        }


        static parseFloat(r:android.content.res.Resources, value:string, defValue:number):number {
            if(value.startsWith('@')){
                try {
                    return r.getFloat(value);
                } catch (e) {
                    console.warn(e);
                }
            }
            let v = parseFloat(value);
            if(isNaN(v)) return defValue;
            return v;
        }

        static parseColor(r:android.content.res.Resources, value:string, defValue:number):number {
            try {
                if(value.startsWith('@')) {
                    return r.getColor(value);
                } else {
                    return android.graphics.Color.parseColor(value);
                }
            } catch (e) {
                console.warn(e);
            }
            return defValue;
        }

        static parseColorStateList(r:android.content.res.Resources, value:string):android.content.res.ColorStateList {
            if(value.startsWith('@')){
                return r.getColorStateList(value);

            }else {
                try {
                    let color = android.graphics.Color.parseColor(value);
                    return android.content.res.ColorStateList.valueOf(color);
                } catch (e) {
                    console.warn(e);
                }
            }
            return null;
        }

        static parseDimension(r:android.content.res.Resources, value:string, defValue:number):number {
            if(value.startsWith('@')){
                try {
                    return r.getDimension(value);
                } catch (e) {
                    console.warn(e);
                    return defValue;
                }
            }
            try {
                return android.util.TypedValue.complexToDimension(value);
            } catch (e) {
                console.warn(e);
            }
            return defValue;
        }

        static parseDimensionPixelOffset(r:android.content.res.Resources, value:string, defValue:number):number {
            if(value.startsWith('@')){
                try {
                    return r.getDimensionPixelOffset(value);
                } catch (e) {
                    console.warn(e);
                    return defValue;
                }
            }
            try {
                return android.util.TypedValue.complexToDimensionPixelOffset(value);
            } catch (e) {
                console.warn(e);
            }
            return defValue;
        }

        static parseDimensionPixelSize(r:android.content.res.Resources, value:string, defValue:number):number {
            if(value.startsWith('@')){
                try {
                    return r.getDimensionPixelSize(value);
                } catch (e) {
                    console.warn(e);
                    return defValue;
                }
            }
            try {
                return android.util.TypedValue.complexToDimensionPixelSize(value);
            } catch (e) {
                console.warn(e);
            }
            return defValue;
        }

        static parseDrawable(r:android.content.res.Resources, value:string):android.graphics.drawable.Drawable {
            if(value.startsWith('@')){
                try {
                    return r.getDrawable(value);
                } catch (e) {
                    console.warn(e);
                }

            }else if(value.startsWith('url(')){
                value = value.substring('url('.length);
                if(value.endsWith(')')) value = value.substring(0, value.length-1);
                return new androidui.image.NetDrawable(value);

            }else{
                try {
                    let color = android.graphics.Color.parseColor(value);
                    return new android.graphics.drawable.ColorDrawable(color);
                } catch (e) {
                }
            }
            return null;
        }

        static parseTextArray(r:android.content.res.Resources, value:string):string[] {
            if(value.startsWith('@')){
                return r.getStringArray(value);

            }else{
                //support for json array
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
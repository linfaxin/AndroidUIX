/**
 * Created by linfaxin on 16/1/4.
 * lite impl of Android Bundle
 */

module android.os{
    export class Bundle{
        constructor(copy?:Bundle){
            if(copy) Object.assign(this, copy);
        }

        get(key:string, defaultValue:any){
            if(this.containsKey(key)){
                return this[key];
            }
            return defaultValue;
        }

        put(key:string, value:any){
            this[key] = value;
        }

        containsKey(key:string){
            return key in this;
        }
    }
}
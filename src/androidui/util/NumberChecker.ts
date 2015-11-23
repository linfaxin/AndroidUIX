/**
 * Created by linfaxin on 15/11/24.
 */
module androidui.util{
    export class NumberChecker{
        static warnNotNumber(...n:number[]):boolean {
            try {
                this.assetNotNumber(...n);
            } catch (e) {
                console.error(e);
                return true;
            }
            return false;
        }
        static assetNotNumber(...ns:number[]) {
            if(!this.checkIsNumber()){
                throw Error('assetNotNumber : ' + ns);
            }
        }
        static checkIsNumber(...ns:number[]):boolean {
            if(ns==null) return false;
            for(let n of ns){
                if(n==null || Number.isNaN(n)) return false;
            }
            return true;
        }
    }
}
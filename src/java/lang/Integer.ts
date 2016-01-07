/**
 * Created by linfaxin on 15/11/13.
 */
module java.lang{
    export class Integer{
        static MIN_VALUE = Number.MIN_SAFE_INTEGER;
        static MAX_VALUE = Number.MAX_SAFE_INTEGER;

        static parseInt(value:string):number {
            return Number.parseInt(value);
        }

        static toHexString(n:number):string {
            if(!n) return n+'';
            return n.toString(16);
        }
    }
}
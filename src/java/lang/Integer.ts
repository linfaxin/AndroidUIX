/**
 * Created by linfaxin on 15/11/13.
 */
module java.lang{
    export class Integer{
        static MIN_VALUE = -0x80000000;
        static MAX_VALUE = 0x7fffffff;

        static parseInt(value:string):number {
            return Number.parseInt(value);
        }

        static toHexString(n:number):string {
            if(!n) return n+'';
            return n.toString(16);
        }
    }
}
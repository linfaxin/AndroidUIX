/**
 * Created by linfaxin on 15/11/13.
 */
module java.lang{
    export class Float{
        static MIN_VALUE = Number.MIN_VALUE;
        static MAX_VALUE = Number.MAX_VALUE;

        static parseFloat(value:string):number {
            return Number.parseFloat(value);
        }
    }
}
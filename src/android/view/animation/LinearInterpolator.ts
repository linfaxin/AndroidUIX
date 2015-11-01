/**
 * Created by linfaxin on 15/11/1.
 */
///<reference path="Interpolator.ts"/>

module android.view.animation{
    export class LinearInterpolator implements Interpolator{
        getInterpolation(input:number):number {
            return input;
        }
    }
}
/**
 * Created by linfaxin on 15/11/1.
 */
///<reference path="Interpolator.ts"/>

module android.view.animation{
    export class AccelerateDecelerateInterpolator implements Interpolator{
        getInterpolation(input:number):number {
            return (Math.cos((input + 1) * Math.PI) / 2) + 0.5;
        }
    }
}
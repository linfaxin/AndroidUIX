/**
 * Created by linfaxin on 15/11/1.
 */
///<reference path="Interpolator.ts"/>

module android.view.animation {
    export class AccelerateInterpolator implements Interpolator {
        private mFactor:number;
        private mDoubleFactor:number;

        constructor(factor = 1) {
            this.mFactor = factor;
            this.mDoubleFactor = factor * 2;
        }

        getInterpolation(input:number):number {

            if (this.mFactor == 1.0) {
                return input * input;
            } else {
                return Math.pow(input, this.mDoubleFactor);
            }
        }
    }
}
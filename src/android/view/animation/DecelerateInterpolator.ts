/**
 * Created by linfaxin on 15/11/1.
 */
///<reference path="Interpolator.ts"/>

module android.view.animation {
    export class DecelerateInterpolator implements Interpolator {
        private mFactor:number;

        constructor(factor = 1) {
            this.mFactor = factor;
        }

        getInterpolation(input:number):number {
            let result;
            if (this.mFactor == 1.0) {
                result = (1.0 - (1.0 - input) * (1.0 - input));
            } else {
                result = (1.0 - Math.pow((1.0 - input), 2 * this.mFactor));
            }
            return result;
        }
    }
}
/**
 * Created by linfaxin on 15/11/1.
 */
///<reference path="Interpolator.ts"/>

module android.view.animation {
    export class OvershootInterpolator implements Interpolator {
        private mTension:number;

        constructor(tension = 2) {
            this.mTension = tension;
        }

        getInterpolation(t:number):number {
            // _o(t) = t * t * ((tension + 1) * t + tension)
            // o(t) = _o(t - 1) + 1
            t -= 1.0;
            return t * t * ((this.mTension + 1) * t + this.mTension) + 1.0;
        }
    }
}
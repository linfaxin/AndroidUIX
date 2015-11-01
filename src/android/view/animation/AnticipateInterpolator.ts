/**
 * Created by linfaxin on 15/11/1.
 */
///<reference path="Interpolator.ts"/>

module android.view.animation{
    export class AnticipateInterpolator implements Interpolator{
        private mTension:number;

        constructor(tension=2) {
            this.mTension = tension;
        }

        getInterpolation(t:number):number {
            // a(t) = t * t * ((tension + 1) * t - tension)
            return t * t * ((this.mTension + 1) * t - this.mTension);
        }
    }
}
/**
 * Created by linfaxin on 15/11/1.
 */
///<reference path="Interpolator.ts"/>

module android.view.animation{
    export class AnticipateOvershootInterpolator implements Interpolator{
        private mTension:number;

        constructor(tension=2, extraTension=1.5) {
            this.mTension = tension * extraTension;
        }

        private static a(t:number, s:number):number{
            return t * t * ((s + 1) * t - s);
        }
        private static o(t:number, s:number):number{
            return t * t * ((s + 1) * t + s);
        }


        getInterpolation(t:number):number {
            // a(t, s) = t * t * ((s + 1) * t - s)
            // o(t, s) = t * t * ((s + 1) * t + s)
            // f(t) = 0.5 * a(t * 2, tension * extraTension), when t < 0.5
            // f(t) = 0.5 * (o(t * 2 - 2, tension * extraTension) + 2), when t <= 1.0
            if (t < 0.5) return 0.5 * AnticipateOvershootInterpolator.a(t * 2.0, this.mTension);
            else return 0.5 * (AnticipateOvershootInterpolator.o(t * 2.0 - 2.0, this.mTension) + 2.0);
        }
    }
}
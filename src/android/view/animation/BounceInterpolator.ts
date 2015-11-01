/**
 * Created by linfaxin on 15/11/1.
 */
///<reference path="Interpolator.ts"/>

module android.view.animation {
    export class BounceInterpolator implements Interpolator {
        private static bounce(t:number):number {
            return t * t * 8.0;
        }

        getInterpolation(t:number):number {
            // _b(t) = t * t * 8
            // bs(t) = _b(t) for t < 0.3535
            // bs(t) = _b(t - 0.54719) + 0.7 for t < 0.7408
            // bs(t) = _b(t - 0.8526) + 0.9 for t < 0.9644
            // bs(t) = _b(t - 1.0435) + 0.95 for t <= 1.0
            // b(t) = bs(t * 1.1226)
            t *= 1.1226;
            if (t < 0.3535) return BounceInterpolator.bounce(t);
            else if (t < 0.7408) return BounceInterpolator.bounce(t - 0.54719) + 0.7;
            else if (t < 0.9644) return BounceInterpolator.bounce(t - 0.8526) + 0.9;
            else return BounceInterpolator.bounce(t - 1.0435) + 0.95;
        }

    }
}
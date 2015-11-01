/**
 * Created by linfaxin on 15/11/1.
 */
///<reference path="Interpolator.ts"/>

module android.view.animation{
    export class CycleInterpolator implements Interpolator{
        private mCycles:number;
        constructor(mCycles:number) {
            this.mCycles = mCycles;
        }

        getInterpolation(input:number):number {
            return (Math.sin(2 * this.mCycles * Math.PI * input));
        }
    }
}
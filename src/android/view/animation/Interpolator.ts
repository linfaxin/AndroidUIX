/**
 * Created by linfaxin on 15/10/17.
 */
module android.view.animation{
    export interface Interpolator{
        getInterpolation(input:number):number;
    }
}
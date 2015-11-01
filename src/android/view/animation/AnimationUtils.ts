/**
 * Created by linfaxin on 15/11/1.
 */
///<reference path="../../os/SystemClock.ts"/>

module android.view.animation{
    import SystemClock = android.os.SystemClock;

    export class AnimationUtils{
        static currentAnimationTimeMillis():number {
            return SystemClock.uptimeMillis();
        }
    }
}
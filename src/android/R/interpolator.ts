/**
 * Created by linfaxin on 16/1/10.
 */
///<reference path="../view/animation/Interpolator"/>
///<reference path="../view/animation/AccelerateDecelerateInterpolator"/>
///<reference path="../view/animation/AccelerateInterpolator"/>
///<reference path="../view/animation/AnticipateInterpolator"/>
///<reference path="../view/animation/AnticipateOvershootInterpolator"/>
///<reference path="../view/animation/BounceInterpolator"/>
///<reference path="../view/animation/CycleInterpolator"/>
///<reference path="../view/animation/DecelerateInterpolator"/>
///<reference path="../view/animation/LinearInterpolator"/>
///<reference path="../view/animation/OvershootInterpolator"/>

module android.R{
    import Interpolator = android.view.animation.Interpolator;
    import AccelerateDecelerateInterpolator = android.view.animation.AccelerateDecelerateInterpolator;
    import AccelerateInterpolator = android.view.animation.AccelerateInterpolator;
    import AnticipateInterpolator = android.view.animation.AnticipateInterpolator;
    import AnticipateOvershootInterpolator = android.view.animation.AnticipateOvershootInterpolator;
    import BounceInterpolator = android.view.animation.BounceInterpolator;
    import CycleInterpolator = android.view.animation.CycleInterpolator;
    import DecelerateInterpolator = android.view.animation.DecelerateInterpolator;
    import LinearInterpolator = android.view.animation.LinearInterpolator;
    import OvershootInterpolator = android.view.animation.OvershootInterpolator;

    export class interpolator {
        static accelerate_cubic = new AccelerateInterpolator(1.5);
        static accelerate_decelerate = new AccelerateDecelerateInterpolator();
        static accelerate_quad = new AccelerateInterpolator();
        static accelerate_quint = new AccelerateInterpolator(2.5);
        static anticipate_overshoot = new AnticipateOvershootInterpolator();
        static anticipate = new AnticipateInterpolator();
        static bounce = new BounceInterpolator();
        static cycle = new CycleInterpolator(1);
        static decelerate_cubic = new DecelerateInterpolator(1.5);
        static decelerate_quad = new DecelerateInterpolator();
        static decelerate_quint = new DecelerateInterpolator(2.5);
        static linear = new LinearInterpolator();
        static overshoot = new OvershootInterpolator();
    }
}
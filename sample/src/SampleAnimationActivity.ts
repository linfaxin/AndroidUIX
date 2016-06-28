
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>

module sample.app {
    import Activity = android.app.Activity;
    import ActionBarActivity = android.app.ActionBarActivity;
    import TextView = android.widget.TextView;
    import Button = android.widget.Button;
    import View = android.view.View;
    import LinearLayout = android.widget.LinearLayout;
    import Gravity = android.view.Gravity;
    import Log = android.util.Log;
    import Color = android.graphics.Color;
    import ColorStateList = android.content.res.ColorStateList;
    import Animation = android.view.animation.Animation;



    export class SampleAnimationActivity extends ActionBarActivity {
        onCreate():void {
            super.onCreate();
            this.setTitle('Animation');
            this.setContentView(R.layout.sample_animation);

            let rotateView = this.findViewById('rotate_repeat');
            let rotateAnimation = new android.view.animation.RotateAnimation(
                0, 360, Animation.RELATIVE_TO_SELF, 0.5, Animation.RELATIVE_TO_SELF, 0.5);
            rotateAnimation.setRepeatCount(Animation.INFINITE);
            rotateAnimation.setDuration(1000);
            rotateAnimation.setInterpolator(new android.view.animation.LinearInterpolator());
            rotateView.startAnimation(rotateAnimation);

            let transView = this.findViewById('translate_repeat');
            let density = android.content.res.Resources.getDisplayMetrics().density;
            let transAnimation = new android.view.animation.TranslateAnimation(-100 * density, 100 * density, 50 * density, -50 * density);
            transAnimation.setRepeatCount(Animation.INFINITE);
            transAnimation.setRepeatMode(Animation.REVERSE);
            transAnimation.setDuration(1000);
            transView.startAnimation(transAnimation);

            let scaleView = this.findViewById('scale_repeat');
            let scaleAnimation = new android.view.animation.ScaleAnimation(
                0.5, 1.5, 0.5, 1.5, Animation.RELATIVE_TO_SELF, 0.5, Animation.RELATIVE_TO_SELF, 0.5);
            scaleAnimation.setRepeatCount(Animation.INFINITE);
            scaleAnimation.setRepeatMode(Animation.REVERSE);
            scaleAnimation.setDuration(1000);
            scaleView.startAnimation(scaleAnimation);

            let alphaView = this.findViewById('alpha_repeat');
            let alphaAnimation = new android.view.animation.AlphaAnimation(1, 0.1);
            alphaAnimation.setRepeatCount(Animation.INFINITE);
            alphaAnimation.setRepeatMode(Animation.REVERSE);
            alphaAnimation.setDuration(500);
            alphaView.startAnimation(alphaAnimation);

            let animSetView = this.findViewById('anim_set');
            let animSet = new android.view.animation.AnimationSet();
            animSet.addAnimation(rotateAnimation);
            animSet.addAnimation(transAnimation);
            animSet.addAnimation(scaleAnimation);
            animSet.addAnimation(alphaAnimation);
            animSetView.startAnimation(animSet);

        }
    }
}
/**
 * Created by linfaxin on 16/1/10.
 */
///<reference path="../view/animation/Animation.ts"/>
///<reference path="../view/animation/AlphaAnimation.ts"/>
///<reference path="../view/animation/TranslateAnimation.ts"/>
///<reference path="../view/animation/ScaleAnimation.ts"/>
///<reference path="../view/animation/AnimationSet.ts"/>
///<reference path="interpolator.ts"/>

module android.R {
    import Animation = android.view.animation.Animation;
    import AlphaAnimation = android.view.animation.AlphaAnimation;
    import TranslateAnimation = android.view.animation.TranslateAnimation;
    import ScaleAnimation = android.view.animation.ScaleAnimation;
    import AnimationSet = android.view.animation.AnimationSet;

    export class anim{
        static get activity_close_enter():Animation {
            let alpha = new AlphaAnimation(1, 1);
            alpha.setDuration(300);
            alpha.setFillBefore(true);
            alpha.setFillEnabled(true);
            alpha.setFillAfter(true);
            return alpha;
        }
        static get activity_close_exit():Animation {
            let animSet = new AnimationSet();
            let alpha = new AlphaAnimation(1, 0);
            alpha.setDuration(300);
            alpha.setFillBefore(true);
            alpha.setFillEnabled(true);
            alpha.setFillAfter(true);
            alpha.setInterpolator(R.interpolator.decelerate_cubic);

            let scale = new ScaleAnimation(1, 0.8, 1, 0.8, Animation.RELATIVE_TO_PARENT, 0.5, Animation.RELATIVE_TO_PARENT, 0.5);
            scale.setDuration(300);
            scale.setFillBefore(true);
            scale.setFillEnabled(true);
            scale.setFillAfter(true);
            scale.setInterpolator(R.interpolator.decelerate_cubic);

            animSet.addAnimation(alpha);
            animSet.addAnimation(scale);
            return animSet;
        }

        static get activity_open_enter():Animation {
            let animSet = new AnimationSet();
            let alpha = new AlphaAnimation(0, 1);
            alpha.setDuration(300);
            alpha.setFillBefore(false);
            alpha.setFillEnabled(true);
            alpha.setFillAfter(true);
            alpha.setInterpolator(R.interpolator.decelerate_cubic);

            let scale = new ScaleAnimation(0.8, 1, 0.8, 1, Animation.RELATIVE_TO_PARENT, 0.5, Animation.RELATIVE_TO_PARENT, 0.5);
            scale.setDuration(300);
            scale.setFillBefore(false);
            scale.setFillEnabled(true);
            scale.setFillAfter(true);
            scale.setInterpolator(R.interpolator.decelerate_cubic);

            animSet.addAnimation(alpha);
            animSet.addAnimation(scale);
            return animSet;
        }

        static get activity_open_exit():Animation {
            let alpha = new AlphaAnimation(1, 0);
            alpha.setDuration(300);
            alpha.setFillBefore(false);
            alpha.setFillEnabled(true);
            alpha.setFillAfter(true);
            alpha.setInterpolator(R.interpolator.decelerate_quint);
            return alpha;
        }

        static get activity_close_enter_ios():Animation {
            let anim = new TranslateAnimation(Animation.RELATIVE_TO_PARENT, -0.25, Animation.RELATIVE_TO_PARENT, 0, 0, 0, 0, 0);
            anim.setDuration(300);
            return anim;
        }
        static get activity_close_exit_ios():Animation {
            let anim = new TranslateAnimation(Animation.RELATIVE_TO_PARENT, 0, Animation.RELATIVE_TO_PARENT, 1, 0, 0, 0, 0);
            anim.setDuration(300);
            return anim;
        }

        static get activity_open_enter_ios():Animation {
            let anim = new TranslateAnimation(Animation.RELATIVE_TO_PARENT, 1, Animation.RELATIVE_TO_PARENT, 0, 0, 0, 0, 0);
            anim.setDuration(300);
            return anim;
        }

        static get activity_open_exit_ios():Animation {
            let anim = new TranslateAnimation(Animation.RELATIVE_TO_PARENT, 0, Animation.RELATIVE_TO_PARENT, -0.25, 0, 0, 0, 0);
            anim.setDuration(300);
            return anim;
        }


        static get dialog_enter():Animation {
            let animSet = new AnimationSet();
            let alpha = new AlphaAnimation(0, 1);
            alpha.setDuration(150);
            alpha.setInterpolator(R.interpolator.decelerate_cubic);

            let scale = new ScaleAnimation(0.9, 1, 0.9, 1, Animation.RELATIVE_TO_PARENT, 0.5, Animation.RELATIVE_TO_PARENT, 0.5);
            scale.setDuration(220);
            scale.setInterpolator(R.interpolator.decelerate_quint);

            animSet.addAnimation(scale);
            animSet.addAnimation(alpha);
            return animSet;
        }

        static get dialog_exit():Animation {
            let animSet = new AnimationSet();
            let alpha = new AlphaAnimation(1, 0);
            alpha.setDuration(150);
            alpha.setInterpolator(R.interpolator.decelerate_cubic);

            let scale = new ScaleAnimation(1, 0.9, 1, 0.9, Animation.RELATIVE_TO_PARENT, 0.5, Animation.RELATIVE_TO_PARENT, 0.5);
            scale.setDuration(220);
            scale.setInterpolator(R.interpolator.decelerate_quint);

            animSet.addAnimation(scale);
            animSet.addAnimation(alpha);
            return animSet;
        }

        static get fade_in():Animation {
            let alpha = new AlphaAnimation(0, 1);
            alpha.setDuration(500);
            alpha.setInterpolator(R.interpolator.decelerate_quad);
            return alpha;
        }

        static get fade_out():Animation {
            let alpha = new AlphaAnimation(1, 0);
            alpha.setDuration(400);
            alpha.setInterpolator(R.interpolator.accelerate_quad);
            return alpha;
        }

        static get toast_enter():Animation {
            let alpha = new AlphaAnimation(0, 1);
            alpha.setDuration(500);
            alpha.setInterpolator(R.interpolator.decelerate_quad);
            return alpha;
        }

        static get toast_exit():Animation {
            let alpha = new AlphaAnimation(1, 0);
            alpha.setDuration(500);
            alpha.setInterpolator(R.interpolator.accelerate_quad);
            return alpha;
        }

        static get grow_fade_in():Animation {
            let animSet = new AnimationSet();
            let alpha = new AlphaAnimation(0, 1);
            alpha.setDuration(150);
            alpha.setInterpolator(R.interpolator.decelerate_cubic);

            let scale = new ScaleAnimation(0.9, 1, 0.9, 1, Animation.RELATIVE_TO_SELF, 0.5, Animation.RELATIVE_TO_SELF, 0);
            scale.setDuration(220);
            scale.setInterpolator(R.interpolator.decelerate_quint);

            animSet.addAnimation(scale);
            animSet.addAnimation(alpha);
            return animSet;
        }
        static get grow_fade_in_center():Animation {
            let animSet = new AnimationSet();
            let alpha = new AlphaAnimation(0, 1);
            alpha.setDuration(150);
            alpha.setInterpolator(R.interpolator.decelerate_cubic);

            let scale = new ScaleAnimation(0.9, 1, 0.9, 1, Animation.RELATIVE_TO_SELF, 0.5, Animation.RELATIVE_TO_SELF, 0.5);
            scale.setDuration(220);
            scale.setInterpolator(R.interpolator.decelerate_quint);

            animSet.addAnimation(scale);
            animSet.addAnimation(alpha);
            return animSet;
        }
        static get grow_fade_in_from_bottom():Animation {
            let animSet = new AnimationSet();
            let alpha = new AlphaAnimation(0, 1);
            alpha.setDuration(150);
            alpha.setInterpolator(R.interpolator.decelerate_cubic);

            let scale = new ScaleAnimation(0.9, 1, 0.9, 1, Animation.RELATIVE_TO_SELF, 0.5, Animation.RELATIVE_TO_SELF, 1);
            scale.setDuration(220);
            scale.setInterpolator(R.interpolator.decelerate_quint);

            animSet.addAnimation(scale);
            animSet.addAnimation(alpha);
            return animSet;
        }
        static get shrink_fade_out():Animation {
            let animSet = new AnimationSet();
            let alpha = new AlphaAnimation(1, 0);
            alpha.setDuration(150);
            alpha.setInterpolator(R.interpolator.decelerate_cubic);

            let scale = new ScaleAnimation(1, 0.9, 1, 0.9, Animation.RELATIVE_TO_SELF, 0.5, Animation.RELATIVE_TO_SELF, 0);
            scale.setDuration(220);
            scale.setInterpolator(R.interpolator.decelerate_quint);

            animSet.addAnimation(scale);
            animSet.addAnimation(alpha);
            return animSet;
        }
        static get shrink_fade_out_center():Animation {
            let animSet = new AnimationSet();
            let alpha = new AlphaAnimation(1, 0);
            alpha.setDuration(150);
            alpha.setInterpolator(R.interpolator.decelerate_cubic);

            let scale = new ScaleAnimation(1, 0.9, 1, 0.9, Animation.RELATIVE_TO_SELF, 0.5, Animation.RELATIVE_TO_SELF, 0.5);
            scale.setDuration(220);
            scale.setInterpolator(R.interpolator.decelerate_quint);

            animSet.addAnimation(scale);
            animSet.addAnimation(alpha);
            return animSet;
        }
        static get shrink_fade_out_from_bottom():Animation {
            let animSet = new AnimationSet();
            let alpha = new AlphaAnimation(1, 0);
            alpha.setDuration(150);
            alpha.setInterpolator(R.interpolator.decelerate_cubic);

            let scale = new ScaleAnimation(1, 0.9, 1, 0.9, Animation.RELATIVE_TO_SELF, 0.5, Animation.RELATIVE_TO_SELF, 1);
            scale.setDuration(220);
            scale.setInterpolator(R.interpolator.decelerate_quint);

            animSet.addAnimation(scale);
            animSet.addAnimation(alpha);
            return animSet;
        }

    }
}
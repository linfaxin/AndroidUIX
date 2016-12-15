/*
 * Copyright (C) 2006 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

///<reference path="../../../android/graphics/RectF.ts"/>
///<reference path="../../../android/os/Handler.ts"/>
///<reference path="../../../android/util/TypedValue.ts"/>
///<reference path="../../../java/lang/Long.ts"/>
///<reference path="../../../java/lang/Runnable.ts"/>
///<reference path="../../../android/view/animation/AccelerateDecelerateInterpolator.ts"/>
///<reference path="../../../android/view/animation/AnimationUtils.ts"/>
///<reference path="../../../android/view/animation/DecelerateInterpolator.ts"/>
///<reference path="../../../android/view/animation/Interpolator.ts"/>
///<reference path="../../../android/view/animation/Transformation.ts"/>

module android.view.animation {
import RectF = android.graphics.RectF;
import Handler = android.os.Handler;
import TypedValue = android.util.TypedValue;
import Long = java.lang.Long;
import Runnable = java.lang.Runnable;
import AccelerateDecelerateInterpolator = android.view.animation.AccelerateDecelerateInterpolator;
import AnimationUtils = android.view.animation.AnimationUtils;
import DecelerateInterpolator = android.view.animation.DecelerateInterpolator;
import Interpolator = android.view.animation.Interpolator;
import Transformation = android.view.animation.Transformation;
/**
 * Abstraction for an Animation that can be applied to Views, Surfaces, or
 * other objects. See the {@link android.view.animation animation package
 * description file}.
 */
export abstract class Animation {

    /**
     * Repeat the animation indefinitely.
     */
    static INFINITE:number = -1;

    /**
     * When the animation reaches the end and the repeat count is INFINTE_REPEAT
     * or a positive value, the animation restarts from the beginning.
     */
    static RESTART:number = 1;

    /**
     * When the animation reaches the end and the repeat count is INFINTE_REPEAT
     * or a positive value, the animation plays backward (and then forward again).
     */
    static REVERSE:number = 2;

    /**
     * Can be used as the start time to indicate the start time should be the current
     * time when {@link #getTransformation(long, Transformation)} is invoked for the
     * first animation frame. This can is useful for short animations.
     */
    static START_ON_FIRST_FRAME:number = -1;

    /**
     * The specified dimension is an absolute number of pixels.
     */
    static ABSOLUTE:number = 0;

    /**
     * The specified dimension holds a float and should be multiplied by the
     * height or width of the object being animated.
     */
    static RELATIVE_TO_SELF:number = 1;

    /**
     * The specified dimension holds a float and should be multiplied by the
     * height or width of the parent of the object being animated.
     */
    static RELATIVE_TO_PARENT:number = 2;

    /**
     * Requests that the content being animated be kept in its current Z
     * order.
     */
    static ZORDER_NORMAL:number = 0;

    /**
     * Requests that the content being animated be forced on top of all other
     * content for the duration of the animation.
     */
    static ZORDER_TOP:number = 1;

    /**
     * Requests that the content being animated be forced under all other
     * content for the duration of the animation.
     */
    static ZORDER_BOTTOM:number = -1;

    private static USE_CLOSEGUARD:boolean = false;//SystemProperties.getBoolean("log.closeguard.Animation", false);

    /**
     * Set by {@link #getTransformation(long, Transformation)} when the animation ends.
     */
    mEnded:boolean = false;

    /**
     * Set by {@link #getTransformation(long, Transformation)} when the animation starts.
     */
    mStarted:boolean = false;

    /**
     * Set by {@link #getTransformation(long, Transformation)} when the animation repeats
     * in REVERSE mode.
     */
    mCycleFlip:boolean = false;

    /**
     * This value must be set to true by {@link #initialize(int, int, int, int)}. It
     * indicates the animation was successfully initialized and can be played.
     */
    mInitialized:boolean = false;

    /**
     * Indicates whether the animation transformation should be applied before the
     * animation starts. The value of this variable is only relevant if mFillEnabled is true;
     * otherwise it is assumed to be true.
     */
    mFillBefore:boolean = true;

    /**
     * Indicates whether the animation transformation should be applied after the
     * animation ends.
     */
    mFillAfter:boolean = false;

    /**
     * Indicates whether fillBefore should be taken into account.
     */
    mFillEnabled:boolean = false;

    /**
     * The time in milliseconds at which the animation must start;
     */
    mStartTime:number = -1;

    /**
     * The delay in milliseconds after which the animation must start. When the
     * start offset is > 0, the start time of the animation is startTime + startOffset.
     */
    mStartOffset:number = 0;

    /**
     * The duration of one animation cycle in milliseconds.
     */
    mDuration:number = 0;

    /**
     * The number of times the animation must repeat. By default, an animation repeats
     * indefinitely.
     */
    mRepeatCount:number = 0;

    /**
     * Indicates how many times the animation was repeated.
     */
    mRepeated:number = 0;

    /**
     * The behavior of the animation when it repeats. The repeat mode is either
     * {@link #RESTART} or {@link #REVERSE}.
     *
     */
    mRepeatMode:number = Animation.RESTART;

    /**
     * The interpolator used by the animation to smooth the movement.
     */
    mInterpolator:Interpolator;

    /**
     * The animation listener to be notified when the animation starts, ends or repeats.
     */
    mListener:Animation.AnimationListener;

    /**
     * Desired Z order mode during animation.
     */
    private mZAdjustment:number = 0;

    /**
     * Desired background color behind animation.
     */
    private mBackgroundColor:number = 0;

    /**
     * scalefactor to apply to pivot points, etc. during animation. Subclasses retrieve the
     * value via getScaleFactor().
     */
    private mScaleFactor:number = 1;

    /**
     * Don't animate the wallpaper.
     */
    private mDetachWallpaper:boolean = false;

    private mMore:boolean = true;

    private mOneMoreTime:boolean = true;

    mPreviousRegion:RectF = new RectF();

    mRegion:RectF = new RectF();

    mTransformation:Transformation = new Transformation();

    mPreviousTransformation:Transformation = new Transformation();

    //private guard:CloseGuard = CloseGuard.get();

    private mListenerHandler:Handler;

    private mOnStart:Runnable;

    private mOnRepeat:Runnable;

    private mOnEnd:Runnable;

    /**
     * Creates a new animation with a duration of 0ms, the default interpolator, with
     * fillBefore set to true and fillAfter set to false
     */
    constructor() {
        this.ensureInterpolator();
    }

    //protected clone():Animation  {
    //    const animation:Animation = <Animation> super.clone();
    //    animation.mPreviousRegion = new RectF();
    //    animation.mRegion = new RectF();
    //    animation.mTransformation = new Transformation();
    //    animation.mPreviousTransformation = new Transformation();
    //    return animation;
    //}

    /**
     * Reset the initialization state of this animation.
     *
     * @see #initialize(int, int, int, int)
     */
    reset():void  {
        this.mPreviousRegion.setEmpty();
        this.mPreviousTransformation.clear();
        this.mInitialized = false;
        this.mCycleFlip = false;
        this.mRepeated = 0;
        this.mMore = true;
        this.mOneMoreTime = true;
        this.mListenerHandler = null;
    }

    /**
     * Cancel the animation. Cancelling an animation invokes the animation
     * listener, if set, to notify the end of the animation.
     * 
     * If you cancel an animation manually, you must call {@link #reset()}
     * before starting the animation again.
     * 
     * @see #reset() 
     * @see #start() 
     * @see #startNow() 
     */
    cancel():void  {
        if (this.mStarted && !this.mEnded) {
            this.fireAnimationEnd();
            this.mEnded = true;
            //this.guard.close();
        }
        // Make sure we move the animation to the end
        this.mStartTime = Long.MIN_VALUE;
        this.mMore = this.mOneMoreTime = false;
    }

    /**
     * @hide
     */
    detach():void  {
        if (this.mStarted && !this.mEnded) {
            this.mEnded = true;
            //this.guard.close();
            this.fireAnimationEnd();
        }
    }

    /**
     * Whether or not the animation has been initialized.
     *
     * @return Has this animation been initialized.
     * @see #initialize(int, int, int, int)
     */
    isInitialized():boolean  {
        return this.mInitialized;
    }

    /**
     * Initialize this animation with the dimensions of the object being
     * animated as well as the objects parents. (This is to support animation
     * sizes being specified relative to these dimensions.)
     *
     * <p>Objects that interpret Animations should call this method when
     * the sizes of the object being animated and its parent are known, and
     * before calling {@link #getTransformation}.
     *
     *
     * @param width Width of the object being animated
     * @param height Height of the object being animated
     * @param parentWidth Width of the animated object's parent
     * @param parentHeight Height of the animated object's parent
     */
    initialize(width:number, height:number, parentWidth:number, parentHeight:number):void  {
        this.reset();
        this.mInitialized = true;
    }

    /**
     * Sets the handler used to invoke listeners.
     * 
     * @hide
     */
    setListenerHandler(handler:Handler):void  {
        if (this.mListenerHandler == null) {
            const inner_this=this;
            this.mOnStart = {
                run():void  {
                    if (inner_this.mListener != null) {
                        inner_this.mListener.onAnimationStart(inner_this);
                    }
                }
            };
            this.mOnRepeat = {
                run():void  {
                    if (inner_this.mListener != null) {
                        inner_this.mListener.onAnimationRepeat(inner_this);
                    }
                }
            };
            this.mOnEnd = {
                run():void  {
                    if (inner_this.mListener != null) {
                        inner_this.mListener.onAnimationEnd(inner_this);
                    }
                }
            };
        }
        this.mListenerHandler = handler;
    }

    /**
     * Sets the acceleration curve for this animation. Defaults to a linear
     * interpolation.
     *
     * @param i The interpolator which defines the acceleration curve
     * @attr ref android.R.styleable#Animation_interpolator
     */
    setInterpolator(i:Interpolator):void  {
        this.mInterpolator = i;
    }

    /**
     * When this animation should start relative to the start time. This is most
     * useful when composing complex animations using an {@link AnimationSet }
     * where some of the animations components start at different times.
     *
     * @param startOffset When this Animation should start, in milliseconds from
     *                    the start time of the root AnimationSet.
     * @attr ref android.R.styleable#Animation_startOffset
     */
    setStartOffset(startOffset:number):void  {
        this.mStartOffset = startOffset;
    }

    /**
     * How long this animation should last. The duration cannot be negative.
     * 
     * @param durationMillis Duration in milliseconds
     *
     * @throws java.lang.IllegalArgumentException if the duration is < 0
     *
     * @attr ref android.R.styleable#Animation_duration
     */
    setDuration(durationMillis:number):void  {
        if (durationMillis < 0) {
            throw Error(`new IllegalArgumentException("Animation duration cannot be negative")`);
        }
        this.mDuration = durationMillis;
    }

    /**
     * Ensure that the duration that this animation will run is not longer
     * than <var>durationMillis</var>.  In addition to adjusting the duration
     * itself, this ensures that the repeat count also will not make it run
     * longer than the given time.
     * 
     * @param durationMillis The maximum duration the animation is allowed
     * to run.
     */
    restrictDuration(durationMillis:number):void  {
        // If we start after the duration, then we just won't run.
        if (this.mStartOffset > durationMillis) {
            this.mStartOffset = durationMillis;
            this.mDuration = 0;
            this.mRepeatCount = 0;
            return;
        }
        let dur:number = this.mDuration + this.mStartOffset;
        if (dur > durationMillis) {
            this.mDuration = durationMillis - this.mStartOffset;
            dur = durationMillis;
        }
        // If the duration is 0 or less, then we won't run.
        if (this.mDuration <= 0) {
            this.mDuration = 0;
            this.mRepeatCount = 0;
            return;
        }
        // overflows after multiplying them.
        if (this.mRepeatCount < 0 || this.mRepeatCount > durationMillis || (dur * this.mRepeatCount) > durationMillis) {
            // Figure out how many times to do the animation.  Subtract 1 since
            // repeat count is the number of times to repeat so 0 runs once.
            this.mRepeatCount = Math.floor((durationMillis / dur)) - 1;
            if (this.mRepeatCount < 0) {
                this.mRepeatCount = 0;
            }
        }
    }

    /**
     * How much to scale the duration by.
     *
     * @param scale The amount to scale the duration.
     */
    scaleCurrentDuration(scale:number):void  {
        this.mDuration = Math.floor((this.mDuration * scale));
        this.mStartOffset = Math.floor((this.mStartOffset * scale));
    }

    /**
     * When this animation should start. When the start time is set to
     * {@link #START_ON_FIRST_FRAME}, the animation will start the first time
     * {@link #getTransformation(long, Transformation)} is invoked. The time passed
     * to this method should be obtained by calling
     * {@link AnimationUtils#currentAnimationTimeMillis()} instead of
     * {@link System#currentTimeMillis()}.
     *
     * @param startTimeMillis the start time in milliseconds
     */
    setStartTime(startTimeMillis:number):void  {
        this.mStartTime = startTimeMillis;
        this.mStarted = this.mEnded = false;
        this.mCycleFlip = false;
        this.mRepeated = 0;
        this.mMore = true;
    }

    /**
     * Convenience method to start the animation the first time
     * {@link #getTransformation(long, Transformation)} is invoked.
     */
    start():void  {
        this.setStartTime(-1);
    }

    /**
     * Convenience method to start the animation at the current time in
     * milliseconds.
     */
    startNow():void  {
        this.setStartTime(AnimationUtils.currentAnimationTimeMillis());
    }

    /**
     * Defines what this animation should do when it reaches the end. This
     * setting is applied only when the repeat count is either greater than
     * 0 or {@link #INFINITE}. Defaults to {@link #RESTART}. 
     *
     * @param repeatMode {@link #RESTART} or {@link #REVERSE}
     * @attr ref android.R.styleable#Animation_repeatMode
     */
    setRepeatMode(repeatMode:number):void  {
        this.mRepeatMode = repeatMode;
    }

    /**
     * Sets how many times the animation should be repeated. If the repeat
     * count is 0, the animation is never repeated. If the repeat count is
     * greater than 0 or {@link #INFINITE}, the repeat mode will be taken
     * into account. The repeat count is 0 by default.
     *
     * @param repeatCount the number of times the animation should be repeated
     * @attr ref android.R.styleable#Animation_repeatCount
     */
    setRepeatCount(repeatCount:number):void  {
        if (repeatCount < 0) {
            repeatCount = Animation.INFINITE;
        }
        this.mRepeatCount = repeatCount;
    }

    /**
     * If fillEnabled is true, this animation will apply the value of fillBefore.
     *
     * @return true if the animation will take fillBefore into account
     * @attr ref android.R.styleable#Animation_fillEnabled
     */
    isFillEnabled():boolean  {
        return this.mFillEnabled;
    }

    /**
     * If fillEnabled is true, the animation will apply the value of fillBefore.
     * Otherwise, fillBefore is ignored and the animation
     * transformation is always applied until the animation ends.
     *
     * @param fillEnabled true if the animation should take the value of fillBefore into account
     * @attr ref android.R.styleable#Animation_fillEnabled
     *
     * @see #setFillBefore(boolean)
     * @see #setFillAfter(boolean)
     */
    setFillEnabled(fillEnabled:boolean):void  {
        this.mFillEnabled = fillEnabled;
    }

    /**
     * If fillBefore is true, this animation will apply its transformation
     * before the start time of the animation. Defaults to true if
     * {@link #setFillEnabled(boolean)} is not set to true.
     * Note that this applies when using an {@link
     * android.view.animation.AnimationSet AnimationSet} to chain
     * animations. The transformation is not applied before the AnimationSet
     * itself starts.
     *
     * @param fillBefore true if the animation should apply its transformation before it starts
     * @attr ref android.R.styleable#Animation_fillBefore
     *
     * @see #setFillEnabled(boolean)
     */
    setFillBefore(fillBefore:boolean):void  {
        this.mFillBefore = fillBefore;
    }

    /**
     * If fillAfter is true, the transformation that this animation performed
     * will persist when it is finished. Defaults to false if not set.
     * Note that this applies to individual animations and when using an {@link
     * android.view.animation.AnimationSet AnimationSet} to chain
     * animations.
     *
     * @param fillAfter true if the animation should apply its transformation after it ends
     * @attr ref android.R.styleable#Animation_fillAfter
     *
     * @see #setFillEnabled(boolean) 
     */
    setFillAfter(fillAfter:boolean):void  {
        this.mFillAfter = fillAfter;
    }

    /**
     * Set the Z ordering mode to use while running the animation.
     * 
     * @param zAdjustment The desired mode, one of {@link #ZORDER_NORMAL},
     * {@link #ZORDER_TOP}, or {@link #ZORDER_BOTTOM}.
     * @attr ref android.R.styleable#Animation_zAdjustment
     */
    setZAdjustment(zAdjustment:number):void  {
        this.mZAdjustment = zAdjustment;
    }

    /**
     * Set background behind animation.
     *
     * @param bg The background color.  If 0, no background.  Currently must
     * be black, with any desired alpha level.
     */
    setBackgroundColor(bg:number):void  {
        this.mBackgroundColor = bg;
    }

    /**
     * The scale factor is set by the call to <code>getTransformation</code>. Overrides of 
     * {@link #getTransformation(long, Transformation, float)} will get this value
     * directly. Overrides of {@link #applyTransformation(float, Transformation)} can
     * call this method to get the value.
     * 
     * @return float The scale factor that should be applied to pre-scaled values in
     * an Animation such as the pivot points in {@link ScaleAnimation} and {@link RotateAnimation}.
     */
    protected getScaleFactor():number  {
        return this.mScaleFactor;
    }

    /**
     * If detachWallpaper is true, and this is a window animation of a window
     * that has a wallpaper background, then the window will be detached from
     * the wallpaper while it runs.  That is, the animation will only be applied
     * to the window, and the wallpaper behind it will remain static.
     *
     * @param detachWallpaper true if the wallpaper should be detached from the animation
     * @attr ref android.R.styleable#Animation_detachWallpaper
     */
    setDetachWallpaper(detachWallpaper:boolean):void  {
        this.mDetachWallpaper = detachWallpaper;
    }

    /**
     * Gets the acceleration curve type for this animation.
     *
     * @return the {@link Interpolator} associated to this animation
     * @attr ref android.R.styleable#Animation_interpolator
     */
    getInterpolator():Interpolator  {
        return this.mInterpolator;
    }

    /**
     * When this animation should start. If the animation has not startet yet,
     * this method might return {@link #START_ON_FIRST_FRAME}.
     *
     * @return the time in milliseconds when the animation should start or
     *         {@link #START_ON_FIRST_FRAME}
     */
    getStartTime():number  {
        return this.mStartTime;
    }

    /**
     * How long this animation should last
     *
     * @return the duration in milliseconds of the animation
     * @attr ref android.R.styleable#Animation_duration
     */
    getDuration():number  {
        return this.mDuration;
    }

    /**
     * When this animation should start, relative to StartTime
     *
     * @return the start offset in milliseconds
     * @attr ref android.R.styleable#Animation_startOffset
     */
    getStartOffset():number  {
        return this.mStartOffset;
    }

    /**
     * Defines what this animation should do when it reaches the end.
     *
     * @return either one of {@link #REVERSE} or {@link #RESTART}
     * @attr ref android.R.styleable#Animation_repeatMode
     */
    getRepeatMode():number  {
        return this.mRepeatMode;
    }

    /**
     * Defines how many times the animation should repeat. The default value
     * is 0.
     *
     * @return the number of times the animation should repeat, or {@link #INFINITE}
     * @attr ref android.R.styleable#Animation_repeatCount
     */
    getRepeatCount():number  {
        return this.mRepeatCount;
    }

    /**
     * If fillBefore is true, this animation will apply its transformation
     * before the start time of the animation. If fillBefore is false and
     * {@link #isFillEnabled() fillEnabled} is true, the transformation will not be applied until
     * the start time of the animation.
     *
     * @return true if the animation applies its transformation before it starts
     * @attr ref android.R.styleable#Animation_fillBefore
     */
    getFillBefore():boolean  {
        return this.mFillBefore;
    }

    /**
     * If fillAfter is true, this animation will apply its transformation
     * after the end time of the animation.
     *
     * @return true if the animation applies its transformation after it ends
     * @attr ref android.R.styleable#Animation_fillAfter
     */
    getFillAfter():boolean  {
        return this.mFillAfter;
    }

    /**
     * Returns the Z ordering mode to use while running the animation as
     * previously set by {@link #setZAdjustment}.
     * 
     * @return Returns one of {@link #ZORDER_NORMAL},
     * {@link #ZORDER_TOP}, or {@link #ZORDER_BOTTOM}.
     * @attr ref android.R.styleable#Animation_zAdjustment
     */
    getZAdjustment():number  {
        return this.mZAdjustment;
    }

    /**
     * Returns the background color behind the animation.
     */
    getBackgroundColor():number  {
        return this.mBackgroundColor;
    }

    /**
     * Return value of {@link #setDetachWallpaper(boolean)}.
     * @attr ref android.R.styleable#Animation_detachWallpaper
     */
    getDetachWallpaper():boolean  {
        return this.mDetachWallpaper;
    }

    /**
     * <p>Indicates whether or not this animation will affect the transformation
     * matrix. For instance, a fade animation will not affect the matrix whereas
     * a scale animation will.</p>
     *
     * @return true if this animation will change the transformation matrix
     */
    willChangeTransformationMatrix():boolean  {
        // assume we will change the matrix
        return true;
    }

    /**
     * <p>Indicates whether or not this animation will affect the bounds of the
     * animated view. For instance, a fade animation will not affect the bounds
     * whereas a 200% scale animation will.</p>
     *
     * @return true if this animation will change the view's bounds
     */
    willChangeBounds():boolean  {
        // assume we will change the bounds
        return true;
    }

    /**
     * <p>Binds an animation listener to this animation. The animation listener
     * is notified of animation events such as the end of the animation or the
     * repetition of the animation.</p>
     *
     * @param listener the animation listener to be notified
     */
    setAnimationListener(listener:Animation.AnimationListener):void  {
        this.mListener = listener;
    }

    /**
     * Gurantees that this animation has an interpolator. Will use
     * a AccelerateDecelerateInterpolator is nothing else was specified.
     */
    protected ensureInterpolator():void  {
        if (this.mInterpolator == null) {
            this.mInterpolator = new AccelerateDecelerateInterpolator();
        }
    }

    /**
     * Compute a hint at how long the entire animation may last, in milliseconds.
     * Animations can be written to cause themselves to run for a different
     * duration than what is computed here, but generally this should be
     * accurate.
     */
    computeDurationHint():number  {
        return (this.getStartOffset() + this.getDuration()) * (this.getRepeatCount() + 1);
    }

    /**
     * Gets the transformation to apply at a specified point in time. Implementations of this
     * method should always replace the specified Transformation or document they are doing
     * otherwise.
     *
     * @param currentTime Where we are in the animation. This is wall clock time.
     * @param outTransformation A transformation object that is provided by the
     *        caller and will be filled in by the animation.
     * @param scale Scaling factor to apply to any inputs to the transform operation, such
     *        pivot points being rotated or scaled around.
     * @return True if the animation is still running
     */
    getTransformation(currentTime:number, outTransformation:Transformation, scale?:number):boolean  {
        if(scale!=null) this.mScaleFactor = scale;

        if (this.mStartTime == -1) {
            this.mStartTime = currentTime;
        }
        const startOffset:number = this.getStartOffset();
        const duration:number = this.mDuration;
        let normalizedTime:number;
        if (duration != 0) {
            normalizedTime = (<number> (currentTime - (this.mStartTime + startOffset))) / <number> duration;
        } else {
            // time is a step-change with a zero duration
            normalizedTime = currentTime < this.mStartTime ? 0.0 : 1.0;
        }
        const expired:boolean = normalizedTime >= 1.0;
        this.mMore = !expired;
        if (!this.mFillEnabled)
            normalizedTime = Math.max(Math.min(normalizedTime, 1.0), 0.0);
        if ((normalizedTime >= 0.0 || this.mFillBefore) && (normalizedTime <= 1.0 || this.mFillAfter)) {
            if (!this.mStarted) {
                this.fireAnimationStart();
                this.mStarted = true;
                //if (Animation.USE_CLOSEGUARD) {
                //    this.guard.open("cancel or detach or getTransformation");
                //}
            }
            if (this.mFillEnabled)
                normalizedTime = Math.max(Math.min(normalizedTime, 1.0), 0.0);
            if (this.mCycleFlip) {
                normalizedTime = 1.0 - normalizedTime;
            }
            const interpolatedTime:number = this.mInterpolator.getInterpolation(normalizedTime);
            this.applyTransformation(interpolatedTime, outTransformation);
        }
        if (expired) {
            if (this.mRepeatCount == this.mRepeated) {
                if (!this.mEnded) {
                    this.mEnded = true;
                    //this.guard.close();
                    this.fireAnimationEnd();
                }
            } else {
                if (this.mRepeatCount > 0) {
                    this.mRepeated++;
                }
                if (this.mRepeatMode == Animation.REVERSE) {
                    this.mCycleFlip = !this.mCycleFlip;
                }
                this.mStartTime = -1;
                this.mMore = true;
                this.fireAnimationRepeat();
            }
        }
        if (!this.mMore && this.mOneMoreTime) {
            this.mOneMoreTime = false;
            return true;
        }
        return this.mMore;
    }

    private fireAnimationStart():void  {
        if (this.mListener != null) {
            if (this.mListenerHandler == null)
                this.mListener.onAnimationStart(this);
            else
                this.mListenerHandler.postAtFrontOfQueue(this.mOnStart);
        }
    }

    private fireAnimationRepeat():void  {
        if (this.mListener != null) {
            if (this.mListenerHandler == null)
                this.mListener.onAnimationRepeat(this);
            else
                this.mListenerHandler.postAtFrontOfQueue(this.mOnRepeat);
        }
    }

    private fireAnimationEnd():void  {
        if (this.mListener != null) {
            if (this.mListenerHandler == null)
                this.mListener.onAnimationEnd(this);
            else
                this.mListenerHandler.postAtFrontOfQueue(this.mOnEnd);
        }
    }

    /**
     * <p>Indicates whether this animation has started or not.</p>
     *
     * @return true if the animation has started, false otherwise
     */
    hasStarted():boolean  {
        return this.mStarted;
    }

    /**
     * <p>Indicates whether this animation has ended or not.</p>
     *
     * @return true if the animation has ended, false otherwise
     */
    hasEnded():boolean  {
        return this.mEnded;
    }

    /**
     * Helper for getTransformation. Subclasses should implement this to apply
     * their transforms given an interpolation value.  Implementations of this
     * method should always replace the specified Transformation or document
     * they are doing otherwise.
     * 
     * @param interpolatedTime The value of the normalized time (0.0 to 1.0)
     *        after it has been run through the interpolation function.
     * @param t The Transformation object to fill in with the current
     *        transforms.
     */
    protected applyTransformation(interpolatedTime:number, t:Transformation):void  {
    }

    /**
     * Convert the information in the description of a size to an actual
     * dimension
     *
     * @param type One of Animation.ABSOLUTE, Animation.RELATIVE_TO_SELF, or
     *             Animation.RELATIVE_TO_PARENT.
     * @param value The dimension associated with the type parameter
     * @param size The size of the object being animated
     * @param parentSize The size of the parent of the object being animated
     * @return The dimension to use for the animation
     */
    protected resolveSize(type:number, value:number, size:number, parentSize:number):number  {
        switch(type) {
            case Animation.ABSOLUTE:
                return value;
            case Animation.RELATIVE_TO_SELF:
                return size * value;
            case Animation.RELATIVE_TO_PARENT:
                return parentSize * value;
            default:
                return value;
        }
    }

    /**
     * @param left
     * @param top
     * @param right
     * @param bottom
     * @param invalidate
     * @param transformation
     * 
     * @hide
     */
    getInvalidateRegion(left:number, top:number, right:number, bottom:number, invalidate:RectF, transformation:Transformation):void  {
        const tempRegion:RectF = this.mRegion;
        const previousRegion:RectF = this.mPreviousRegion;
        invalidate.set(left, top, right, bottom);
        transformation.getMatrix().mapRect(invalidate);
        // Enlarge the invalidate region to account for rounding errors
        invalidate.inset(-1.0, -1.0);
        tempRegion.set(invalidate);
        invalidate.union(previousRegion);
        previousRegion.set(tempRegion);
        const tempTransformation:Transformation = this.mTransformation;
        const previousTransformation:Transformation = this.mPreviousTransformation;
        tempTransformation.set(transformation);
        transformation.set(previousTransformation);
        previousTransformation.set(tempTransformation);
    }

    /**
     * @param left
     * @param top
     * @param right
     * @param bottom
     *
     * @hide
     */
    initializeInvalidateRegion(left:number, top:number, right:number, bottom:number):void  {
        const region:RectF = this.mPreviousRegion;
        region.set(left, top, right, bottom);
        // Enlarge the invalidate region to account for rounding errors
        region.inset(-1.0, -1.0);
        if (this.mFillBefore) {
            const previousTransformation:Transformation = this.mPreviousTransformation;
            this.applyTransformation(this.mInterpolator.getInterpolation(0.0), previousTransformation);
        }
    }

    //protected finalize():void  {
    //    try {
    //        if (this.guard != null) {
    //            this.guard.warnIfOpen();
    //        }
    //    } finally {
    //        super.finalize();
    //    }
    //}

    /**
     * Return true if this animation changes the view's alpha property.
     * 
     * @hide
     */
    hasAlpha():boolean  {
        return false;
    }




}

export module Animation{
/**
     * Utility class to parse a string description of a size.
     */
export class Description {

    /**
         * One of Animation.ABSOLUTE, Animation.RELATIVE_TO_SELF, or
         * Animation.RELATIVE_TO_PARENT.
         */
    type:number = 0;

    /**
         * The absolute or relative dimension for this Description.
         */
    value:number = 0;

    /**
         * Size descriptions can appear inthree forms:
         * <ol>
         * <li>An absolute size. This is represented by a number.</li>
         * <li>A size relative to the size of the object being animated. This
         * is represented by a number followed by "%".</li> *
         * <li>A size relative to the size of the parent of object being
         * animated. This is represented by a number followed by "%p".</li>
         * </ol>
         * @param value The typed value to parse
         * @return The parsed version of the description
         */
    static parseValue(value:string):Description  {
        let d:Description = new Description();
        if (value == null) {
            d.type = Animation.ABSOLUTE;
            d.value = 0;
        } else {
            if(value.endsWith('%p')){
                d.type = Animation.RELATIVE_TO_PARENT;
                d.value = Number.parseFloat(value.substring(0, value.length-2));
            }else if(value.endsWith('%')){
                d.type = Animation.RELATIVE_TO_SELF;
                d.value = Number.parseFloat(value.substring(0, value.length-1));
            }else{
                d.type = Animation.ABSOLUTE;
                d.value = TypedValue.complexToDimensionPixelSize(value);
            }
        }
        d.type = Animation.ABSOLUTE;
        d.value = 0.0;
        return d;
    }
}
/**
     * <p>An animation listener receives notifications from an animation.
     * Notifications indicate animation related events, such as the end or the
     * repetition of the animation.</p>
     */
export interface AnimationListener {

    /**
         * <p>Notifies the start of the animation.</p>
         *
         * @param animation The started animation.
         */
    onAnimationStart(animation:Animation):void ;

    /**
         * <p>Notifies the end of the animation. This callback is not invoked
         * for animations with repeat count set to INFINITE.</p>
         *
         * @param animation The animation which reached its end.
         */
    onAnimationEnd(animation:Animation):void ;

    /**
         * <p>Notifies the repetition of the animation.</p>
         *
         * @param animation The animation which was repeated.
         */
    onAnimationRepeat(animation:Animation):void ;
}
}

}
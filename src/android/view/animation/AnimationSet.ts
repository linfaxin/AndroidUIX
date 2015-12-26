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
///<reference path="../../../java/util/ArrayList.ts"/>
///<reference path="../../../java/util/List.ts"/>
///<reference path="../../../java/lang/Long.ts"/>
///<reference path="../../../android/view/animation/Animation.ts"/>
///<reference path="../../../android/view/animation/Interpolator.ts"/>
///<reference path="../../../android/view/animation/Transformation.ts"/>

module android.view.animation {
import RectF = android.graphics.RectF;
import ArrayList = java.util.ArrayList;
import List = java.util.List;
import Long = java.lang.Long;
import Animation = android.view.animation.Animation;
import Interpolator = android.view.animation.Interpolator;
import Transformation = android.view.animation.Transformation;
/**
 * Represents a group of Animations that should be played together.
 * The transformation of each individual animation are composed 
 * together into a single transform. 
 * If AnimationSet sets any properties that its children also set
 * (for example, duration or fillBefore), the values of AnimationSet
 * override the child values.
 *
 * <p>The way that AnimationSet inherits behavior from Animation is important to
 * understand. Some of the Animation attributes applied to AnimationSet affect the
 * AnimationSet itself, some are pushed down to the children, and some are ignored,
 * as follows:
 * <ul>
 *     <li>duration, repeatMode, fillBefore, fillAfter: These properties, when set
 *     on an AnimationSet object, will be pushed down to all child animations.</li>
 *     <li>repeatCount, fillEnabled: These properties are ignored for AnimationSet.</li>
 *     <li>startOffset, shareInterpolator: These properties apply to the AnimationSet itself.</li>
 * </ul>
 * Starting with {@link android.os.Build.VERSION_CODES#ICE_CREAM_SANDWICH},
 * the behavior of these properties is the same in XML resources and at runtime (prior to that
 * release, the values set in XML were ignored for AnimationSet). That is, calling
 * <code>setDuration(500)</code> on an AnimationSet has the same effect as declaring
 * <code>android:duration="500"</code> in an XML resource for an AnimationSet object.</p>
 */
export class AnimationSet extends Animation {

    private static PROPERTY_FILL_AFTER_MASK:number = 0x1;

    private static PROPERTY_FILL_BEFORE_MASK:number = 0x2;

    private static PROPERTY_REPEAT_MODE_MASK:number = 0x4;

    private static PROPERTY_START_OFFSET_MASK:number = 0x8;

    private static PROPERTY_SHARE_INTERPOLATOR_MASK:number = 0x10;

    private static PROPERTY_DURATION_MASK:number = 0x20;

    private static PROPERTY_MORPH_MATRIX_MASK:number = 0x40;

    private static PROPERTY_CHANGE_BOUNDS_MASK:number = 0x80;

    private mFlags:number = 0;

    private mDirty:boolean;

    private mHasAlpha:boolean;

    private mAnimations:ArrayList<Animation> = new ArrayList<Animation>();

    private mTempTransformation:Transformation = new Transformation();

    private mLastEnd:number = 0;

    private mStoredOffsets:number[];

    ///**
    // * Constructor used when an AnimationSet is loaded from a resource.
    // *
    // * @param context Application context to use
    // * @param attrs Attribute set from which to read values
    // */
    //constructor( context:Context, attrs:AttributeSet) {
    //    super(context, attrs);
    //    let a:TypedArray = context.obtainStyledAttributes(attrs, com.android.internal.R.styleable.AnimationSet);
    //    this.setFlag(AnimationSet.PROPERTY_SHARE_INTERPOLATOR_MASK, a.getBoolean(com.android.internal.R.styleable.AnimationSet_shareInterpolator, true));
    //    this.init();
    //    if (context.getApplicationInfo().targetSdkVersion >= Build.VERSION_CODES.ICE_CREAM_SANDWICH) {
    //        if (a.hasValue(com.android.internal.R.styleable.AnimationSet_duration)) {
    //            this.mFlags |= AnimationSet.PROPERTY_DURATION_MASK;
    //        }
    //        if (a.hasValue(com.android.internal.R.styleable.AnimationSet_fillBefore)) {
    //            this.mFlags |= AnimationSet.PROPERTY_FILL_BEFORE_MASK;
    //        }
    //        if (a.hasValue(com.android.internal.R.styleable.AnimationSet_fillAfter)) {
    //            this.mFlags |= AnimationSet.PROPERTY_FILL_AFTER_MASK;
    //        }
    //        if (a.hasValue(com.android.internal.R.styleable.AnimationSet_repeatMode)) {
    //            this.mFlags |= AnimationSet.PROPERTY_REPEAT_MODE_MASK;
    //        }
    //        if (a.hasValue(com.android.internal.R.styleable.AnimationSet_startOffset)) {
    //            this.mFlags |= AnimationSet.PROPERTY_START_OFFSET_MASK;
    //        }
    //    }
    //    a.recycle();
    //}

    /**
     * Constructor to use when building an AnimationSet from code
     * 
     * @param shareInterpolator Pass true if all of the animations in this set
     *        should use the interpolator associated with this AnimationSet.
     *        Pass false if each animation should use its own interpolator.
     */
    constructor(shareInterpolator:boolean) {
        super();
        this.setFlag(AnimationSet.PROPERTY_SHARE_INTERPOLATOR_MASK, shareInterpolator);
        this.init();
    }

    //protected clone():AnimationSet  {
    //    const animation:AnimationSet = <AnimationSet> super.clone();
    //    animation.mTempTransformation = new Transformation();
    //    animation.mAnimations = new ArrayList<Animation>();
    //    const count:number = this.mAnimations.size();
    //    const animations:ArrayList<Animation> = this.mAnimations;
    //    for (let i:number = 0; i < count; i++) {
    //        animation.mAnimations.add(animations.get(i).clone());
    //    }
    //    return animation;
    //}

    private setFlag(mask:number, value:boolean):void  {
        if (value) {
            this.mFlags |= mask;
        } else {
            this.mFlags &= ~mask;
        }
    }

    private init():void  {
        this.mStartTime = 0;
    }

    setFillAfter(fillAfter:boolean):void  {
        this.mFlags |= AnimationSet.PROPERTY_FILL_AFTER_MASK;
        super.setFillAfter(fillAfter);
    }

    setFillBefore(fillBefore:boolean):void  {
        this.mFlags |= AnimationSet.PROPERTY_FILL_BEFORE_MASK;
        super.setFillBefore(fillBefore);
    }

    setRepeatMode(repeatMode:number):void  {
        this.mFlags |= AnimationSet.PROPERTY_REPEAT_MODE_MASK;
        super.setRepeatMode(repeatMode);
    }

    setStartOffset(startOffset:number):void  {
        this.mFlags |= AnimationSet.PROPERTY_START_OFFSET_MASK;
        super.setStartOffset(startOffset);
    }

    /**
     * @hide
     */
    hasAlpha():boolean  {
        if (this.mDirty) {
            this.mDirty = this.mHasAlpha = false;
            const count:number = this.mAnimations.size();
            const animations:ArrayList<Animation> = this.mAnimations;
            for (let i:number = 0; i < count; i++) {
                if (animations.get(i).hasAlpha()) {
                    this.mHasAlpha = true;
                    break;
                }
            }
        }
        return this.mHasAlpha;
    }

    /**
     * <p>Sets the duration of every child animation.</p>
     *
     * @param durationMillis the duration of the animation, in milliseconds, for
     *        every child in this set
     */
    setDuration(durationMillis:number):void  {
        this.mFlags |= AnimationSet.PROPERTY_DURATION_MASK;
        super.setDuration(durationMillis);
        this.mLastEnd = this.mStartOffset + this.mDuration;
    }

    /**
     * Add a child animation to this animation set.
     * The transforms of the child animations are applied in the order
     * that they were added
     * @param a Animation to add.
     */
    addAnimation(a:Animation):void  {
        this.mAnimations.add(a);
        let noMatrix:boolean = (this.mFlags & AnimationSet.PROPERTY_MORPH_MATRIX_MASK) == 0;
        if (noMatrix && a.willChangeTransformationMatrix()) {
            this.mFlags |= AnimationSet.PROPERTY_MORPH_MATRIX_MASK;
        }
        let changeBounds:boolean = (this.mFlags & AnimationSet.PROPERTY_CHANGE_BOUNDS_MASK) == 0;
        if (changeBounds && a.willChangeBounds()) {
            this.mFlags |= AnimationSet.PROPERTY_CHANGE_BOUNDS_MASK;
        }
        if ((this.mFlags & AnimationSet.PROPERTY_DURATION_MASK) == AnimationSet.PROPERTY_DURATION_MASK) {
            this.mLastEnd = this.mStartOffset + this.mDuration;
        } else {
            if (this.mAnimations.size() == 1) {
                this.mDuration = a.getStartOffset() + a.getDuration();
                this.mLastEnd = this.mStartOffset + this.mDuration;
            } else {
                this.mLastEnd = Math.max(this.mLastEnd, a.getStartOffset() + a.getDuration());
                this.mDuration = this.mLastEnd - this.mStartOffset;
            }
        }
        this.mDirty = true;
    }

    /**
     * Sets the start time of this animation and all child animations
     * 
     * @see android.view.animation.Animation#setStartTime(long)
     */
    setStartTime(startTimeMillis:number):void  {
        super.setStartTime(startTimeMillis);
        const count:number = this.mAnimations.size();
        const animations:ArrayList<Animation> = this.mAnimations;
        for (let i:number = 0; i < count; i++) {
            let a:Animation = animations.get(i);
            a.setStartTime(startTimeMillis);
        }
    }

    getStartTime():number  {
        let startTime:number = Long.MAX_VALUE;
        const count:number = this.mAnimations.size();
        const animations:ArrayList<Animation> = this.mAnimations;
        for (let i:number = 0; i < count; i++) {
            let a:Animation = animations.get(i);
            startTime = Math.min(startTime, a.getStartTime());
        }
        return startTime;
    }

    restrictDuration(durationMillis:number):void  {
        super.restrictDuration(durationMillis);
        const animations:ArrayList<Animation> = this.mAnimations;
        let count:number = animations.size();
        for (let i:number = 0; i < count; i++) {
            animations.get(i).restrictDuration(durationMillis);
        }
    }

    /**
     * The duration of an AnimationSet is defined to be the 
     * duration of the longest child animation.
     * 
     * @see android.view.animation.Animation#getDuration()
     */
    getDuration():number  {
        const animations:ArrayList<Animation> = this.mAnimations;
        const count:number = animations.size();
        let duration:number = 0;
        let durationSet:boolean = (this.mFlags & AnimationSet.PROPERTY_DURATION_MASK) == AnimationSet.PROPERTY_DURATION_MASK;
        if (durationSet) {
            duration = this.mDuration;
        } else {
            for (let i:number = 0; i < count; i++) {
                duration = Math.max(duration, animations.get(i).getDuration());
            }
        }
        return duration;
    }

    /**
     * The duration hint of an animation set is the maximum of the duration
     * hints of all of its component animations.
     * 
     * @see android.view.animation.Animation#computeDurationHint
     */
    computeDurationHint():number  {
        let duration:number = 0;
        const count:number = this.mAnimations.size();
        const animations:ArrayList<Animation> = this.mAnimations;
        for (let i:number = count - 1; i >= 0; --i) {
            const d:number = animations.get(i).computeDurationHint();
            if (d > duration)
                duration = d;
        }
        return duration;
    }

    /**
     * @hide
     */
    initializeInvalidateRegion(left:number, top:number, right:number, bottom:number):void  {
        const region:RectF = this.mPreviousRegion;
        region.set(left, top, right, bottom);
        region.inset(-1.0, -1.0);
        if (this.mFillBefore) {
            const count:number = this.mAnimations.size();
            const animations:ArrayList<Animation> = this.mAnimations;
            const temp:Transformation = this.mTempTransformation;
            const previousTransformation:Transformation = this.mPreviousTransformation;
            for (let i:number = count - 1; i >= 0; --i) {
                const a:Animation = animations.get(i);
                if (!a.isFillEnabled() || a.getFillBefore() || a.getStartOffset() == 0) {
                    temp.clear();
                    const interpolator:Interpolator = a.mInterpolator;
                    a.applyTransformation(interpolator != null ? interpolator.getInterpolation(0.0) : 0.0, temp);
                    previousTransformation.compose(temp);
                }
            }
        }
    }

    /**
     * The transformation of an animation set is the concatenation of all of its
     * component animations.
     * 
     * @see android.view.animation.Animation#getTransformation
     */
    getTransformation(currentTime:number, t:Transformation):boolean  {
        const count:number = this.mAnimations.size();
        const animations:ArrayList<Animation> = this.mAnimations;
        const temp:Transformation = this.mTempTransformation;
        let more:boolean = false;
        let started:boolean = false;
        let ended:boolean = true;
        t.clear();
        for (let i:number = count - 1; i >= 0; --i) {
            const a:Animation = animations.get(i);
            temp.clear();
            more = a.getTransformation(currentTime, temp, this.getScaleFactor()) || more;
            t.compose(temp);
            started = started || a.hasStarted();
            ended = a.hasEnded() && ended;
        }
        if (started && !this.mStarted) {
            if (this.mListener != null) {
                this.mListener.onAnimationStart(this);
            }
            this.mStarted = true;
        }
        if (ended != this.mEnded) {
            if (this.mListener != null) {
                this.mListener.onAnimationEnd(this);
            }
            this.mEnded = ended;
        }
        return more;
    }

    /**
     * @see android.view.animation.Animation#scaleCurrentDuration(float)
     */
    scaleCurrentDuration(scale:number):void  {
        const animations:ArrayList<Animation> = this.mAnimations;
        let count:number = animations.size();
        for (let i:number = 0; i < count; i++) {
            animations.get(i).scaleCurrentDuration(scale);
        }
    }

    /**
     * @see android.view.animation.Animation#initialize(int, int, int, int)
     */
    initialize(width:number, height:number, parentWidth:number, parentHeight:number):void  {
        super.initialize(width, height, parentWidth, parentHeight);
        let durationSet:boolean = (this.mFlags & AnimationSet.PROPERTY_DURATION_MASK) == AnimationSet.PROPERTY_DURATION_MASK;
        let fillAfterSet:boolean = (this.mFlags & AnimationSet.PROPERTY_FILL_AFTER_MASK) == AnimationSet.PROPERTY_FILL_AFTER_MASK;
        let fillBeforeSet:boolean = (this.mFlags & AnimationSet.PROPERTY_FILL_BEFORE_MASK) == AnimationSet.PROPERTY_FILL_BEFORE_MASK;
        let repeatModeSet:boolean = (this.mFlags & AnimationSet.PROPERTY_REPEAT_MODE_MASK) == AnimationSet.PROPERTY_REPEAT_MODE_MASK;
        let shareInterpolator:boolean = (this.mFlags & AnimationSet.PROPERTY_SHARE_INTERPOLATOR_MASK) == AnimationSet.PROPERTY_SHARE_INTERPOLATOR_MASK;
        let startOffsetSet:boolean = (this.mFlags & AnimationSet.PROPERTY_START_OFFSET_MASK) == AnimationSet.PROPERTY_START_OFFSET_MASK;
        if (shareInterpolator) {
            this.ensureInterpolator();
        }
        const children:ArrayList<Animation> = this.mAnimations;
        const count:number = children.size();
        const duration:number = this.mDuration;
        const fillAfter:boolean = this.mFillAfter;
        const fillBefore:boolean = this.mFillBefore;
        const repeatMode:number = this.mRepeatMode;
        const interpolator:Interpolator = this.mInterpolator;
        const startOffset:number = this.mStartOffset;
        let storedOffsets:number[] = this.mStoredOffsets;
        if (startOffsetSet) {
            if (storedOffsets == null || storedOffsets.length != count) {
                storedOffsets = this.mStoredOffsets = new Array<number>(count);
            }
        } else if (storedOffsets != null) {
            storedOffsets = this.mStoredOffsets = null;
        }
        for (let i:number = 0; i < count; i++) {
            let a:Animation = children.get(i);
            if (durationSet) {
                a.setDuration(duration);
            }
            if (fillAfterSet) {
                a.setFillAfter(fillAfter);
            }
            if (fillBeforeSet) {
                a.setFillBefore(fillBefore);
            }
            if (repeatModeSet) {
                a.setRepeatMode(repeatMode);
            }
            if (shareInterpolator) {
                a.setInterpolator(interpolator);
            }
            if (startOffsetSet) {
                let offset:number = a.getStartOffset();
                a.setStartOffset(offset + startOffset);
                storedOffsets[i] = offset;
            }
            a.initialize(width, height, parentWidth, parentHeight);
        }
    }

    reset():void  {
        super.reset();
        this.restoreChildrenStartOffset();
    }

    /**
     * @hide
     */
    restoreChildrenStartOffset():void  {
        const offsets:number[] = this.mStoredOffsets;
        if (offsets == null)
            return;
        const children:ArrayList<Animation> = this.mAnimations;
        const count:number = children.size();
        for (let i:number = 0; i < count; i++) {
            children.get(i).setStartOffset(offsets[i]);
        }
    }

    /**
     * @return All the child animations in this AnimationSet. Note that
     * this may include other AnimationSets, which are not expanded.
     */
    getAnimations():List<Animation>  {
        return this.mAnimations;
    }

    willChangeTransformationMatrix():boolean  {
        return (this.mFlags & AnimationSet.PROPERTY_MORPH_MATRIX_MASK) == AnimationSet.PROPERTY_MORPH_MATRIX_MASK;
    }

    willChangeBounds():boolean  {
        return (this.mFlags & AnimationSet.PROPERTY_CHANGE_BOUNDS_MASK) == AnimationSet.PROPERTY_CHANGE_BOUNDS_MASK;
    }
}
}
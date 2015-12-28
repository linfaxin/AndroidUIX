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

///<reference path="../../../android/content/res/Resources.ts"/>
///<reference path="../../../android/os/SystemClock.ts"/>
///<reference path="../../../java/lang/System.ts"/>
///<reference path="../../../java/lang/Runnable.ts"/>
///<reference path="../../../android/graphics/drawable/Animatable.ts"/>
///<reference path="../../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../../android/graphics/drawable/DrawableContainer.ts"/>

module android.graphics.drawable {
import Resources = android.content.res.Resources;
import SystemClock = android.os.SystemClock;
import System = java.lang.System;
import Runnable = java.lang.Runnable;
import Animatable = android.graphics.drawable.Animatable;
import Drawable = android.graphics.drawable.Drawable;
import DrawableContainer = android.graphics.drawable.DrawableContainer;
/**
 * 
 * An object used to create frame-by-frame animations, defined by a series of Drawable objects,
 * which can be used as a View object's background.
 * <p>
 * The simplest way to create a frame-by-frame animation is to define the animation in an XML
 * file, placed in the res/drawable/ folder, and set it as the background to a View object. Then, call
 * {@link #start()} to run the animation.
 * <p>
 * An AnimationDrawable defined in XML consists of a single <code>&lt;animation-list></code> element,
 * and a series of nested <code>&lt;item></code> tags. Each item defines a frame of the animation.
 * See the example below.
 * </p>
 * <p>spin_animation.xml file in res/drawable/ folder:</p>
 * <pre>&lt;!-- Animation frames are wheel0.png -- wheel5.png files inside the
 * res/drawable/ folder --&gt;
 * &lt;animation-list android:id=&quot;@+id/selected&quot; android:oneshot=&quot;false&quot;&gt;
 *    &lt;item android:drawable=&quot;@drawable/wheel0&quot; android:duration=&quot;50&quot; /&gt;
 *    &lt;item android:drawable=&quot;@drawable/wheel1&quot; android:duration=&quot;50&quot; /&gt;
 *    &lt;item android:drawable=&quot;@drawable/wheel2&quot; android:duration=&quot;50&quot; /&gt;
 *    &lt;item android:drawable=&quot;@drawable/wheel3&quot; android:duration=&quot;50&quot; /&gt;
 *    &lt;item android:drawable=&quot;@drawable/wheel4&quot; android:duration=&quot;50&quot; /&gt;
 *    &lt;item android:drawable=&quot;@drawable/wheel5&quot; android:duration=&quot;50&quot; /&gt;
 * &lt;/animation-list&gt;</pre>
 *
 * <p>Here is the code to load and play this animation.</p>
 * <pre>
 * // Load the ImageView that will host the animation and
 * // set its background to our AnimationDrawable XML resource.
 * ImageView img = (ImageView)findViewById(R.id.spinning_wheel_image);
 * img.setBackgroundResource(R.drawable.spin_animation);
 *
 * // Get the background, which has been compiled to an AnimationDrawable object.
 * AnimationDrawable frameAnimation = (AnimationDrawable) img.getBackground();
 *
 * // Start the animation (looped playback by default).
 * frameAnimation.start();
 * </pre>
 *
 * <div class="special reference">
 * <h3>Developer Guides</h3>
 * <p>For more information about animating with {@code AnimationDrawable}, read the
 * <a href="{@docRoot}guide/topics/graphics/drawable-animation.html">Drawable Animation</a>
 * developer guide.</p>
 * </div>
 *
 * @attr ref android.R.styleable#AnimationDrawable_visible
 * @attr ref android.R.styleable#AnimationDrawable_variablePadding
 * @attr ref android.R.styleable#AnimationDrawable_oneshot
 * @attr ref android.R.styleable#AnimationDrawableItem_duration
 * @attr ref android.R.styleable#AnimationDrawableItem_drawable
 */
export class AnimationDrawable extends DrawableContainer implements Runnable, Animatable {

    private mAnimationState:AnimationDrawable.AnimationState;

    private mCurFrame:number = -1;

    //private mMutated:boolean;

    constructor(state?:AnimationDrawable.AnimationState) {
        super();
        let _as:AnimationDrawable.AnimationState = new AnimationDrawable.AnimationState(state, this);
        this.mAnimationState = _as;
        this.setConstantState(_as);
        if (state != null) {
            this.setFrame(0, true, false);
        }
    }

    setVisible(visible:boolean, restart:boolean):boolean  {
        let changed:boolean = super.setVisible(visible, restart);
        if (visible) {
            if (changed || restart) {
                this.setFrame(0, true, true);
            }
        } else {
            this.unscheduleSelf(this);
        }
        return changed;
    }

    /**
     * <p>Starts the animation, looping if necessary. This method has no effect
     * if the animation is running. Do not call this in the {@link android.app.Activity#onCreate}
     * method of your activity, because the {@link android.graphics.drawable.AnimationDrawable} is
     * not yet fully attached to the window. If you want to play
     * the animation immediately, without requiring interaction, then you might want to call it
     * from the {@link android.app.Activity#onWindowFocusChanged} method in your activity,
     * which will get called when Android brings your window into focus.</p>
     *
     * @see #isRunning()
     * @see #stop()
     */
    start():void  {
        if (!this.isRunning()) {
            this.run();
        }
    }

    /**
     * <p>Stops the animation. This method has no effect if the animation is
     * not running.</p>
     *
     * @see #isRunning()
     * @see #start()
     */
    stop():void  {
        if (this.isRunning()) {
            this.unscheduleSelf(this);
        }
    }

    /**
     * <p>Indicates whether the animation is currently running or not.</p>
     *
     * @return true if the animation is running, false otherwise
     */
    isRunning():boolean  {
        return this.mCurFrame > -1;
    }

    /**
     * <p>This method exists for implementation purpose only and should not be
     * called directly. Invoke {@link #start()} instead.</p>
     *
     * @see #start()
     */
    run():void  {
        this.nextFrame(false);
    }

    unscheduleSelf(what:Runnable):void  {
        this.mCurFrame = -1;
        super.unscheduleSelf(what);
    }

    /**
     * @return The number of frames in the animation
     */
    getNumberOfFrames():number  {
        return this.mAnimationState.getChildCount();
    }

    /**
     * @return The Drawable at the specified frame index
     */
    getFrame(index:number):Drawable  {
        return this.mAnimationState.getChild(index);
    }

    /**
     * @return The duration in milliseconds of the frame at the 
     * specified index
     */
    getDuration(i:number):number  {
        return this.mAnimationState.mDurations[i];
    }

    /**
     * @return True of the animation will play once, false otherwise
     */
    isOneShot():boolean  {
        return this.mAnimationState.mOneShot;
    }

    /**
     * Sets whether the animation should play once or repeat.
     * 
     * @param oneShot Pass true if the animation should only play once
     */
    setOneShot(oneShot:boolean):void  {
        this.mAnimationState.mOneShot = oneShot;
    }

    /**
     * Add a frame to the animation
     * 
     * @param frame The frame to add
     * @param duration How long in milliseconds the frame should appear
     */
    addFrame(frame:Drawable, duration:number):void  {
        this.mAnimationState.addFrame(frame, duration);
        if (this.mCurFrame < 0) {
            this.setFrame(0, true, false);
        }
    }

    private nextFrame(unschedule:boolean):void  {
        let next:number = this.mCurFrame + 1;
        const N:number = this.mAnimationState.getChildCount();
        if (next >= N) {
            next = 0;
        }
        this.setFrame(next, unschedule, !this.mAnimationState.mOneShot || next < (N - 1));
    }

    private setFrame(frame:number, unschedule:boolean, animate:boolean):void  {
        if (frame >= this.mAnimationState.getChildCount()) {
            return;
        }
        this.mCurFrame = frame;
        this.selectDrawable(frame);
        if (unschedule) {
            this.unscheduleSelf(this);
        }
        if (animate) {
            // Unscheduling may have clobbered this value; restore it to record that we're animating
            this.mCurFrame = frame;
            this.scheduleSelf(this, SystemClock.uptimeMillis() + this.mAnimationState.mDurations[frame]);
        }
    }

    //inflate(r:Resources, parser:XmlPullParser, attrs:AttributeSet):void  {
    //    let a:TypedArray = r.obtainAttributes(attrs, com.android.internal.R.styleable.AnimationDrawable);
    //    super.inflateWithAttributes(r, parser, a, com.android.internal.R.styleable.AnimationDrawable_visible);
    //    this.mAnimationState.setVariablePadding(a.getBoolean(com.android.internal.R.styleable.AnimationDrawable_variablePadding, false));
    //    this.mAnimationState.mOneShot = a.getBoolean(com.android.internal.R.styleable.AnimationDrawable_oneshot, false);
    //    a.recycle();
    //    let type:number;
    //    const innerDepth:number = parser.getDepth() + 1;
    //    let depth:number;
    //    while ((type = parser.next()) != XmlPullParser.END_DOCUMENT && ((depth = parser.getDepth()) >= innerDepth || type != XmlPullParser.END_TAG)) {
    //        if (type != XmlPullParser.START_TAG) {
    //            continue;
    //        }
    //        if (depth > innerDepth || !parser.getName().equals("item")) {
    //            continue;
    //        }
    //        a = r.obtainAttributes(attrs, com.android.internal.R.styleable.AnimationDrawableItem);
    //        let duration:number = a.getInt(com.android.internal.R.styleable.AnimationDrawableItem_duration, -1);
    //        if (duration < 0) {
    //            throw Error(`new XmlPullParserException(parser.getPositionDescription() + ": <item> tag requires a 'duration' attribute")`);
    //        }
    //        let drawableRes:number = a.getResourceId(com.android.internal.R.styleable.AnimationDrawableItem_drawable, 0);
    //        a.recycle();
    //        let dr:Drawable;
    //        if (drawableRes != 0) {
    //            dr = r.getDrawable(drawableRes);
    //        } else {
    //            while ((type = parser.next()) == XmlPullParser.TEXT) {
    //            // Empty
    //            }
    //            if (type != XmlPullParser.START_TAG) {
    //                throw Error(`new XmlPullParserException(parser.getPositionDescription() + ": <item> tag requires a 'drawable' attribute or child tag" + " defining a drawable")`);
    //            }
    //            dr = Drawable.createFromXmlInner(r, parser, attrs);
    //        }
    //        this.mAnimationState.addFrame(dr, duration);
    //        if (dr != null) {
    //            dr.setCallback(this);
    //        }
    //    }
    //    this.setFrame(0, true, false);
    //}

    mutate():Drawable  {
        if (!this.mMutated && super.mutate() == this) {
            this.mAnimationState.mDurations = [...this.mAnimationState.mDurations];
            this.mMutated = true;
        }
        return this;
    }



}

export module AnimationDrawable{
export class AnimationState extends DrawableContainer.DrawableContainerState {

    private mDurations:number[];

    private mOneShot:boolean;

    constructor(orig:AnimationState, owner:AnimationDrawable) {
        super(orig, owner);
        if (orig != null) {
            this.mDurations = orig.mDurations;
            this.mOneShot = orig.mOneShot;
        } else {
            this.mDurations = new Array<number>(this.getCapacity());
            this.mOneShot = true;
        }
    }

    newDrawable():Drawable  {
        return new AnimationDrawable(this);
    }

    addFrame(dr:Drawable, dur:number):void  {
        // Do not combine the following. The array index must be evaluated before 
        // the array is accessed because super.addChild(dr) has a side effect on mDurations.
        let pos:number = super.addChild(dr);
        this.mDurations[pos] = dur;
    }

    //growArray(oldSize:number, newSize:number):void  {
    //    super.growArray(oldSize, newSize);
    //    let newDurations:number[] = new Array<number>(newSize);
    //    System.arraycopy(this.mDurations, 0, newDurations, 0, oldSize);
    //    this.mDurations = newDurations;
    //}
}
}

}
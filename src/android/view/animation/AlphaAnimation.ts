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

///<reference path="../../../android/view/animation/Animation.ts"/>
///<reference path="../../../android/view/animation/Transformation.ts"/>

module android.view.animation {
import Animation = android.view.animation.Animation;
import Transformation = android.view.animation.Transformation;
/**
 * An animation that controls the alpha level of an object.
 * Useful for fading things in and out. This animation ends up
 * changing the alpha property of a {@link Transformation}
 *
 */
export class AlphaAnimation extends Animation {

    private mFromAlpha:number = 0;

    private mToAlpha:number = 0;

    ///**
    // * Constructor used when an AlphaAnimation is loaded from a resource.
    // *
    // * @param context Application context to use
    // * @param attrs Attribute set from which to read values
    // */
    //constructor( context:Context, attrs:AttributeSet) {
    //    super(context, attrs);
    //    let a:TypedArray = context.obtainStyledAttributes(attrs, com.android.internal.R.styleable.AlphaAnimation);
    //    this.mFromAlpha = a.getFloat(com.android.internal.R.styleable.AlphaAnimation_fromAlpha, 1.0);
    //    this.mToAlpha = a.getFloat(com.android.internal.R.styleable.AlphaAnimation_toAlpha, 1.0);
    //    a.recycle();
    //}

    /**
     * Constructor to use when building an AlphaAnimation from code
     * 
     * @param fromAlpha Starting alpha value for the animation, where 1.0 means
     *        fully opaque and 0.0 means fully transparent.
     * @param toAlpha Ending alpha value for the animation.
     */
    constructor(fromAlpha:number, toAlpha:number) {
        super();
        this.mFromAlpha = fromAlpha;
        this.mToAlpha = toAlpha;
    }

    /**
     * Changes the alpha property of the supplied {@link Transformation}
     */
    protected applyTransformation(interpolatedTime:number, t:Transformation):void  {
        const alpha:number = this.mFromAlpha;
        t.setAlpha(alpha + ((this.mToAlpha - alpha) * interpolatedTime));
    }

    willChangeTransformationMatrix():boolean  {
        return false;
    }

    willChangeBounds():boolean  {
        return false;
    }

    /**
     * @hide
     */
    hasAlpha():boolean  {
        return true;
    }
}
}
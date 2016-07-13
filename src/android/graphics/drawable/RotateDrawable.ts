/*
 * Copyright (C) 2007 The Android Open Source Project
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

///<reference path="../../../android/graphics/Canvas.ts"/>
///<reference path="../../../android/graphics/Rect.ts"/>
///<reference path="../../../android/content/res/Resources.ts"/>
///<reference path="../../../android/util/TypedValue.ts"/>
///<reference path="../../../android/util/Log.ts"/>
///<reference path="../../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../../java/lang/Runnable.ts"/>

module android.graphics.drawable {
import Canvas = android.graphics.Canvas;
import Rect = android.graphics.Rect;
import Resources = android.content.res.Resources;
import TypedValue = android.util.TypedValue;
import Log = android.util.Log;
import Drawable = android.graphics.drawable.Drawable;
import Runnable = java.lang.Runnable;
    import TypedArray = android.content.res.TypedArray;

/**
 * <p>A Drawable that can rotate another Drawable based on the current level
 * value. The start and end angles of rotation can be controlled to map any
 * circular arc to the level values range.</p>
 *
 * <p>It can be defined in an XML file with the <code>&lt;rotate></code> element. For more
 * information, see the guide to <a
 * href="{@docRoot}guide/topics/resources/animation-resource.html">Animation Resources</a>.</p>
 *
 * @attr ref android.R.styleable#RotateDrawable_visible
 * @attr ref android.R.styleable#RotateDrawable_fromDegrees
 * @attr ref android.R.styleable#RotateDrawable_toDegrees
 * @attr ref android.R.styleable#RotateDrawable_pivotX
 * @attr ref android.R.styleable#RotateDrawable_pivotY
 * @attr ref android.R.styleable#RotateDrawable_drawable
 */
export class RotateDrawable extends Drawable implements Drawable.Callback {

    private static MAX_LEVEL:number = 10000.0;

    private mState:RotateDrawable.RotateState;

    private mMutated:boolean;


    /**
     * <p>Create a new rotating drawable with the specified state. A copy of
     * this state is used as the internal state for the newly created
     * drawable.</p>
     *
     * @param rotateState the state for this drawable
     */
    constructor(rotateState?:RotateDrawable.RotateState) {
        super();
        this.mState = new RotateDrawable.RotateState(rotateState, this);
    }

    draw(canvas:Canvas):void  {
        let saveCount:number = canvas.save();
        let bounds:Rect = this.mState.mDrawable.getBounds();
        let w:number = bounds.right - bounds.left;
        let h:number = bounds.bottom - bounds.top;
        const st:RotateDrawable.RotateState = this.mState;
        let px:number = st.mPivotXRel ? (w * st.mPivotX) : st.mPivotX;
        let py:number = st.mPivotYRel ? (h * st.mPivotY) : st.mPivotY;
        canvas.rotate(st.mCurrentDegrees, px + bounds.left, py + bounds.top);
        st.mDrawable.draw(canvas);
        canvas.restoreToCount(saveCount);
    }

    /**
     * Returns the drawable rotated by this RotateDrawable.
     */
    getDrawable():Drawable  {
        return this.mState.mDrawable;
    }

    //getChangingConfigurations():number  {
    //    return super.getChangingConfigurations() | this.mState.mChangingConfigurations | this.mState.mDrawable.getChangingConfigurations();
    //}

    setAlpha(alpha:number):void  {
        this.mState.mDrawable.setAlpha(alpha);
    }

    getAlpha():number  {
        return this.mState.mDrawable.getAlpha();
    }

    //setColorFilter(cf:ColorFilter):void  {
    //    this.mState.mDrawable.setColorFilter(cf);
    //}

    getOpacity():number  {
        return this.mState.mDrawable.getOpacity();
    }

    drawableSizeChange(who:android.graphics.drawable.Drawable):void {
        const callback = this.getCallback();
        if (callback != null && callback.drawableSizeChange) {
            callback.drawableSizeChange(this);
        }
    }

    invalidateDrawable(who:Drawable):void  {
        const callback:Drawable.Callback = this.getCallback();
        if (callback != null) {
            callback.invalidateDrawable(this);
        }
    }

    scheduleDrawable(who:Drawable, what:Runnable, when:number):void  {
        const callback:Drawable.Callback = this.getCallback();
        if (callback != null) {
            callback.scheduleDrawable(this, what, when);
        }
    }

    unscheduleDrawable(who:Drawable, what:Runnable):void  {
        const callback:Drawable.Callback = this.getCallback();
        if (callback != null) {
            callback.unscheduleDrawable(this, what);
        }
    }

    getPadding(padding:Rect):boolean  {
        return this.mState.mDrawable.getPadding(padding);
    }

    setVisible(visible:boolean, restart:boolean):boolean  {
        this.mState.mDrawable.setVisible(visible, restart);
        return super.setVisible(visible, restart);
    }

    isStateful():boolean  {
        return this.mState.mDrawable.isStateful();
    }

    protected onStateChange(state:number[]):boolean  {
        let changed:boolean = this.mState.mDrawable.setState(state);
        this.onBoundsChange(this.getBounds());
        return changed;
    }

    protected onLevelChange(level:number):boolean  {
        this.mState.mDrawable.setLevel(level);
        this.onBoundsChange(this.getBounds());
        this.mState.mCurrentDegrees = this.mState.mFromDegrees + (this.mState.mToDegrees - this.mState.mFromDegrees) * (level / RotateDrawable.MAX_LEVEL);
        this.invalidateSelf();
        return true;
    }

    protected onBoundsChange(bounds:Rect):void  {
        this.mState.mDrawable.setBounds(bounds.left, bounds.top, bounds.right, bounds.bottom);
    }

    getIntrinsicWidth():number  {
        return this.mState.mDrawable.getIntrinsicWidth();
    }

    getIntrinsicHeight():number  {
        return this.mState.mDrawable.getIntrinsicHeight();
    }

    getConstantState():Drawable.ConstantState  {
        if (this.mState.canConstantState()) {
            //this.mState.mChangingConfigurations = this.getChangingConfigurations();
            return this.mState;
        }
        return null;
    }


    inflate(r:Resources, parser:HTMLElement):void  {
        super.inflate(r, parser);
        let a:TypedArray = r.obtainAttributes(parser);

        let tv:string = a.getString("android:pivotX");
        let pivotXRel:boolean;
        let pivotX:number;
        if (tv == null) {
            pivotXRel = true;
            pivotX = 0.5;
        } else {
            pivotXRel = tv.endsWith('%');
            pivotX = a.getFloat('android:pivotX', 0.5);
        }
        tv = a.getString("android:pivotY");
        let pivotYRel:boolean;
        let pivotY:number;
        if (tv == null) {
            pivotYRel = true;
            pivotY = 0.5;
        } else {
            pivotYRel = tv.endsWith('%');
            pivotY = a.getFloat('android:pivotY', 0.5);
        }
        let fromDegrees:number = a.getFloat("android:fromDegrees", 0.0);
        let toDegrees:number = a.getFloat("android:toDegrees", 360.0);
        let drawable:Drawable = a.getDrawable("android:drawable");
        a.recycle();

        if (!drawable && parser.children[0] instanceof HTMLElement) {
            drawable = Drawable.createFromXml(r, <HTMLElement>parser.children[0]);
        }
        if (drawable == null) {
            Log.w("drawable", "No drawable specified for <rotate>");
        }
        this.mState.mDrawable = drawable;
        this.mState.mPivotXRel = pivotXRel;
        this.mState.mPivotX = pivotX;
        this.mState.mPivotYRel = pivotYRel;
        this.mState.mPivotY = pivotY;
        this.mState.mFromDegrees = this.mState.mCurrentDegrees = fromDegrees;
        this.mState.mToDegrees = toDegrees;
        if (drawable != null) {
            drawable.setCallback(this);
        }
    }


    mutate():Drawable  {
        if (!this.mMutated && super.mutate() == this) {
            this.mState.mDrawable.mutate();
            this.mMutated = true;
        }
        return this;
    }


}

export module RotateDrawable{
/**
     * <p>Represents the state of a rotation for a given drawable. The same
     * rotate drawable can be invoked with different states to drive several
     * rotations at the same time.</p>
     */
export class RotateState implements Drawable.ConstantState {

    mDrawable:Drawable;

    //mChangingConfigurations:number = 0;

    mPivotXRel:boolean;

    mPivotX:number = 0;

    mPivotYRel:boolean;

    mPivotY:number = 0;

    mFromDegrees:number = 0;

    mToDegrees:number = 0;

    mCurrentDegrees:number = 0;

    private mCanConstantState:boolean;

    private mCheckedConstantState:boolean;

    constructor(source:RotateState, owner:RotateDrawable) {
        if (source != null) {
            //if (res != null) {
            //    this.mDrawable = source.mDrawable.getConstantState().newDrawable(res);
            //} else {
                this.mDrawable = source.mDrawable.getConstantState().newDrawable();
            //}
            this.mDrawable.setCallback(owner);
            //this.mDrawable.setLayoutDirection(source.mDrawable.getLayoutDirection());
            this.mPivotXRel = source.mPivotXRel;
            this.mPivotX = source.mPivotX;
            this.mPivotYRel = source.mPivotYRel;
            this.mPivotY = source.mPivotY;
            this.mFromDegrees = this.mCurrentDegrees = source.mFromDegrees;
            this.mToDegrees = source.mToDegrees;
            this.mCanConstantState = this.mCheckedConstantState = true;
        }
    }

    newDrawable():Drawable  {
        return new RotateDrawable(this);
    }

    //getChangingConfigurations():number  {
    //    return this.mChangingConfigurations;
    //}

    canConstantState():boolean  {
        if (!this.mCheckedConstantState) {
            this.mCanConstantState = this.mDrawable.getConstantState() != null;
            this.mCheckedConstantState = true;
        }
        return this.mCanConstantState;
    }
}
}

}
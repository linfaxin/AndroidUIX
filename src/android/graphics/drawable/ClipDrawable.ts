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

///<reference path="../../../android/graphics/Canvas.ts"/>
///<reference path="../../../android/graphics/Rect.ts"/>
///<reference path="../../../android/content/res/Resources.ts"/>
///<reference path="../../../android/view/Gravity.ts"/>
///<reference path="../../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../../java/lang/Runnable.ts"/>

module android.graphics.drawable {
import Canvas = android.graphics.Canvas;
import Rect = android.graphics.Rect;
import Resources = android.content.res.Resources;
import Gravity = android.view.Gravity;
import Drawable = android.graphics.drawable.Drawable;
import Runnable = java.lang.Runnable;
    import TypedArray = android.content.res.TypedArray;
/**
 * A Drawable that clips another Drawable based on this Drawable's current
 * level value.  You can control how much the child Drawable gets clipped in width
 * and height based on the level, as well as a gravity to control where it is
 * placed in its overall container.  Most often used to implement things like
 * progress bars, by increasing the drawable's level with {@link
 * android.graphics.drawable.Drawable#setLevel(int) setLevel()}.
 * <p class="note"><strong>Note:</strong> The drawable is clipped completely and not visible when
 * the level is 0 and fully revealed when the level is 10,000.</p>
 *
 * <p>It can be defined in an XML file with the <code>&lt;clip></code> element.  For more
 * information, see the guide to <a
 * href="{@docRoot}guide/topics/resources/drawable-resource.html">Drawable Resources</a>.</p>
 *
 * @attr ref android.R.styleable#ClipDrawable_clipOrientation
 * @attr ref android.R.styleable#ClipDrawable_gravity
 * @attr ref android.R.styleable#ClipDrawable_drawable
 */
export class ClipDrawable extends Drawable implements Drawable.Callback {

    private mClipState:ClipDrawable.ClipState;

    private mTmpRect:Rect = new Rect();

    static HORIZONTAL:number = 1;

    static VERTICAL:number = 2;


    constructor(state?:ClipDrawable.ClipState);
    /**
     * @param orientation Bitwise-or of {@link #HORIZONTAL} and/or {@link #VERTICAL}
     */
    constructor(drawable:Drawable, gravity:number, orientation:number);
    constructor(...args) {
        super();
        if(args.length<=1){
            this.mClipState = new ClipDrawable.ClipState(args[0], this);
        }else{
            this.mClipState = new ClipDrawable.ClipState(null, this);

            let drawable:Drawable = args[0];
            let gravity:number = args[1];
            let orientation:number = args[2];

            this.mClipState.mDrawable = drawable;
            this.mClipState.mGravity = gravity;
            this.mClipState.mOrientation = orientation;
            if (drawable != null) {
                drawable.setCallback(this);
            }
        }
    }

    inflate(r:Resources, parser:HTMLElement):void  {
       super.inflate(r, parser);
       let a:TypedArray = r.obtainAttributes(parser);
       let orientation:number = a.getInt("android:clipOrientation", ClipDrawable.HORIZONTAL);
        let gStr:string = a.getString("android:gravity");
        let g = Gravity.parseGravity(gStr, Gravity.LEFT);
       let dr:Drawable = a.getDrawable("android:drawable");
       a.recycle();
        if (!dr && parser.children[0] instanceof HTMLElement) {
            dr = Drawable.createFromXml(r, <HTMLElement>parser.children[0]);
        }
       if (dr == null) {
           throw Error(`new IllegalArgumentException("No drawable specified for <clip>")`);
       }
       this.mClipState.mDrawable = dr;
       this.mClipState.mOrientation = orientation;
       this.mClipState.mGravity = g;
       dr.setCallback(this);
    }


    drawableSizeChange(who:android.graphics.drawable.Drawable):void {
        const callback = this.getCallback();
        if (callback != null && callback.drawableSizeChange) {
            callback.drawableSizeChange(this);
        }
    }


    // overrides from Drawable.Callback
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

    //// overrides from Drawable
    //getChangingConfigurations():number  {
    //    return super.getChangingConfigurations() | this.mClipState.mChangingConfigurations | this.mClipState.mDrawable.getChangingConfigurations();
    //}

    getPadding(padding:Rect):boolean  {
        // XXX need to adjust padding!
        return this.mClipState.mDrawable.getPadding(padding);
    }

    setVisible(visible:boolean, restart:boolean):boolean  {
        this.mClipState.mDrawable.setVisible(visible, restart);
        return super.setVisible(visible, restart);
    }

    setAlpha(alpha:number):void  {
        this.mClipState.mDrawable.setAlpha(alpha);
    }

    getAlpha():number  {
        return this.mClipState.mDrawable.getAlpha();
    }

    //setColorFilter(cf:ColorFilter):void  {
    //    this.mClipState.mDrawable.setColorFilter(cf);
    //}

    getOpacity():number  {
        return this.mClipState.mDrawable.getOpacity();
    }

    isStateful():boolean  {
        return this.mClipState.mDrawable.isStateful();
    }

    protected onStateChange(state:number[]):boolean  {
        return this.mClipState.mDrawable.setState(state);
    }

    protected onLevelChange(level:number):boolean  {
        this.mClipState.mDrawable.setLevel(level);
        this.invalidateSelf();
        return true;
    }

    protected onBoundsChange(bounds:Rect):void  {
        this.mClipState.mDrawable.setBounds(bounds);
    }

    draw(canvas:Canvas):void  {
        if (this.mClipState.mDrawable.getLevel() == 0) {
            return;
        }
        const r:Rect = this.mTmpRect;
        const bounds:Rect = this.getBounds();
        let level:number = this.getLevel();
        let w:number = bounds.width();
        //mClipState.mDrawable.getIntrinsicWidth();
        const iw:number = 0;
        if ((this.mClipState.mOrientation & ClipDrawable.HORIZONTAL) != 0) {
            w -= (w - iw) * (10000 - level) / 10000;
        }
        let h:number = bounds.height();
        //mClipState.mDrawable.getIntrinsicHeight();
        const ih:number = 0;
        if ((this.mClipState.mOrientation & ClipDrawable.VERTICAL) != 0) {
            h -= (h - ih) * (10000 - level) / 10000;
        }
        //const layoutDirection:number = this.getLayoutDirection();
        Gravity.apply(this.mClipState.mGravity, w, h, bounds, r);//, layoutDirection);
        if (w > 0 && h > 0) {
            canvas.save();
            canvas.clipRect(r);
            this.mClipState.mDrawable.draw(canvas);
            canvas.restore();
        }
    }

    getIntrinsicWidth():number  {
        return this.mClipState.mDrawable.getIntrinsicWidth();
    }

    getIntrinsicHeight():number  {
        return this.mClipState.mDrawable.getIntrinsicHeight();
    }

    getConstantState():Drawable.ConstantState  {
        if (this.mClipState.canConstantState()) {
            //this.mClipState.mChangingConfigurations = this.getChangingConfigurations();
            return this.mClipState;
        }
        return null;
    }

    ///** @hide */
    //setLayoutDirection(layoutDirection:number):void  {
    //    this.mClipState.mDrawable.setLayoutDirection(layoutDirection);
    //    super.setLayoutDirection(layoutDirection);
    //}

}

export module ClipDrawable{
export class ClipState implements Drawable.ConstantState {

    mDrawable:Drawable;

    //mChangingConfigurations:number = 0;

    mOrientation:number = 0;

    mGravity:number = 0;

    private mCheckedConstantState:boolean;

    private mCanConstantState:boolean;

    constructor( orig:ClipState, owner:ClipDrawable) {
        if (orig != null) {
            this.mDrawable = orig.mDrawable.getConstantState().newDrawable();
            this.mDrawable.setCallback(owner);
            //this.mDrawable.setLayoutDirection(orig.mDrawable.getLayoutDirection());
            this.mOrientation = orig.mOrientation;
            this.mGravity = orig.mGravity;
            this.mCheckedConstantState = this.mCanConstantState = true;
        }
    }

    newDrawable():Drawable  {
        return new ClipDrawable(this);
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
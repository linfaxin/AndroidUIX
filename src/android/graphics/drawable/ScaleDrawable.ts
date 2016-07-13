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
///<reference path="../../../android/util/TypedValue.ts"/>
///<reference path="../../../android/util/Log.ts"/>
///<reference path="../../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../../java/lang/Runnable.ts"/>
///<reference path="../../../android/view/Gravity.ts"/>
///<reference path="../../../java/lang/Float.ts"/>

module android.graphics.drawable {
    import Canvas = android.graphics.Canvas;
    import Rect = android.graphics.Rect;
    import TypedValue = android.util.TypedValue;
    import Log = android.util.Log;
    import Resources = android.content.res.Resources;
    import Gravity = android.view.Gravity;
    import Runnable = java.lang.Runnable;
    import Float = java.lang.Float;
    import Drawable = android.graphics.drawable.Drawable;
    import TypedArray = android.content.res.TypedArray;
    /**
     * A Drawable that changes the size of another Drawable based on its current
     * level value.  You can control how much the child Drawable changes in width
     * and height based on the level, as well as a gravity to control where it is
     * placed in its overall container.  Most often used to implement things like
     * progress bars.
     *
     * <p>It can be defined in an XML file with the <code>&lt;scale></code> element. For more
     * information, see the guide to <a
     * href="{@docRoot}guide/topics/resources/drawable-resource.html">Drawable Resources</a>.</p>
     *
     * @attr ref android.R.styleable#ScaleDrawable_scaleWidth
     * @attr ref android.R.styleable#ScaleDrawable_scaleHeight
     * @attr ref android.R.styleable#ScaleDrawable_scaleGravity
     * @attr ref android.R.styleable#ScaleDrawable_drawable
     */
    export class ScaleDrawable extends Drawable implements Drawable.Callback {

        private mScaleState:ScaleDrawable.ScaleState;

        private mMutated:boolean;

        private mTmpRect:Rect = new Rect();

        constructor(drawable:Drawable, gravity:number, scaleWidth:number, scaleHeight:number);
        constructor(state?:ScaleDrawable.ScaleState);
        constructor(...args) {
            super();
            if (args.length <= 1) {
                this.mScaleState = new ScaleDrawable.ScaleState(args[0], this);
                return;
            }
            let drawable:Drawable = args[0];
            let gravity:number = args[1];
            let scaleWidth:number = args[2];
            let scaleHeight:number = args[3];

            this.mScaleState = new ScaleDrawable.ScaleState(null, this);

            this.mScaleState.mDrawable = drawable;
            this.mScaleState.mGravity = gravity;
            this.mScaleState.mScaleWidth = scaleWidth;
            this.mScaleState.mScaleHeight = scaleHeight;
            if (drawable != null) {
                drawable.setCallback(this);
            }
        }

        /**
         * Returns the drawable scaled by this ScaleDrawable.
         */
        getDrawable():Drawable {
            return this.mScaleState.mDrawable;
        }

        //private static getPercent(a:TypedArray, name:number):number  {
        //    let s:string = a.getString(name);
        //    if (s != null) {
        //        if (s.endsWith("%")) {
        //            let f:string = s.substring(0, s.length() - 1);
        //            return Float.parseFloat(f) / 100.0;
        //        }
        //    }
        //    return -1;
        //}

        inflate(r:Resources, parser:HTMLElement):void {
            super.inflate(r, parser);
            let a:TypedArray = r.obtainAttributes(parser);
            let sw:number = a.getFloat("android:scaleWidth", 1);
            let sh:number = a.getFloat("android:scaleHeight", 1);
            let gStr:string = a.getString("android:scaleGravity");
            let g = Gravity.parseGravity(gStr, Gravity.LEFT);
            let min:boolean = a.getBoolean("android:useIntrinsicSizeAsMinimum", false);
            let dr:Drawable = a.getDrawable("android:drawable");
            a.recycle();


            if (!dr && parser.children[0] instanceof HTMLElement) {
                dr = Drawable.createFromXml(r, <HTMLElement>parser.children[0]);
            }
            if (dr == null) {
                throw Error(`new IllegalArgumentException("No drawable specified for <scale>")`);
            }
            this.mScaleState.mDrawable = dr;
            this.mScaleState.mScaleWidth = sw;
            this.mScaleState.mScaleHeight = sh;
            this.mScaleState.mGravity = g;
            this.mScaleState.mUseIntrinsicSizeAsMin = min;
            if (dr != null) {
                dr.setCallback(this);
            }
        }

        // overrides from Drawable.Callback

        drawableSizeChange(who:android.graphics.drawable.Drawable):void {
            const callback = this.getCallback();
            if (callback != null && callback.drawableSizeChange) {
                callback.drawableSizeChange(this);
            }
        }

        invalidateDrawable(who:Drawable):void {
            if (this.getCallback() != null) {
                this.getCallback().invalidateDrawable(this);
            }
        }

        scheduleDrawable(who:Drawable, what:Runnable, when:number):void {
            if (this.getCallback() != null) {
                this.getCallback().scheduleDrawable(this, what, when);
            }
        }

        unscheduleDrawable(who:Drawable, what:Runnable):void {
            if (this.getCallback() != null) {
                this.getCallback().unscheduleDrawable(this, what);
            }
        }

        // overrides from Drawable
        draw(canvas:Canvas):void {
            if (this.mScaleState.mDrawable.getLevel() != 0)
                this.mScaleState.mDrawable.draw(canvas);
        }

        //getChangingConfigurations():number  {
        //    return super.getChangingConfigurations() | this.mScaleState.mChangingConfigurations | this.mScaleState.mDrawable.getChangingConfigurations();
        //}

        getPadding(padding:Rect):boolean {
            // XXX need to adjust padding!
            return this.mScaleState.mDrawable.getPadding(padding);
        }

        setVisible(visible:boolean, restart:boolean):boolean {
            this.mScaleState.mDrawable.setVisible(visible, restart);
            return super.setVisible(visible, restart);
        }

        setAlpha(alpha:number):void {
            this.mScaleState.mDrawable.setAlpha(alpha);
        }

        getAlpha():number {
            return this.mScaleState.mDrawable.getAlpha();
        }

        //setColorFilter(cf:ColorFilter):void  {
        //    this.mScaleState.mDrawable.setColorFilter(cf);
        //}

        getOpacity():number {
            return this.mScaleState.mDrawable.getOpacity();
        }

        isStateful():boolean {
            return this.mScaleState.mDrawable.isStateful();
        }

        protected onStateChange(state:number[]):boolean {
            let changed:boolean = this.mScaleState.mDrawable.setState(state);
            this.onBoundsChange(this.getBounds());
            return changed;
        }

        protected onLevelChange(level:number):boolean {
            this.mScaleState.mDrawable.setLevel(level);
            this.onBoundsChange(this.getBounds());
            this.invalidateSelf();
            return true;
        }

        protected onBoundsChange(bounds:Rect):void {
            const r:Rect = this.mTmpRect;
            const min:boolean = this.mScaleState.mUseIntrinsicSizeAsMin;
            let level:number = this.getLevel();
            let w:number = bounds.width();
            if (this.mScaleState.mScaleWidth > 0) {
                const iw:number = min ? this.mScaleState.mDrawable.getIntrinsicWidth() : 0;
                w -= Math.floor(((w - iw) * (10000 - level) * this.mScaleState.mScaleWidth / 10000));
            }
            let h:number = bounds.height();
            if (this.mScaleState.mScaleHeight > 0) {
                const ih:number = min ? this.mScaleState.mDrawable.getIntrinsicHeight() : 0;
                h -= Math.floor(((h - ih) * (10000 - level) * this.mScaleState.mScaleHeight / 10000));
            }
            //const layoutDirection:number = this.getLayoutDirection();
            Gravity.apply(this.mScaleState.mGravity, w, h, bounds, r);//, layoutDirection);
            if (w > 0 && h > 0) {
                this.mScaleState.mDrawable.setBounds(r.left, r.top, r.right, r.bottom);
            }
        }

        getIntrinsicWidth():number {
            return this.mScaleState.mDrawable.getIntrinsicWidth();
        }

        getIntrinsicHeight():number {
            return this.mScaleState.mDrawable.getIntrinsicHeight();
        }

        getConstantState():Drawable.ConstantState {
            if (this.mScaleState.canConstantState()) {
                //this.mScaleState.mChangingConfigurations = this.getChangingConfigurations();
                return this.mScaleState;
            }
            return null;
        }

        mutate():Drawable {
            if (!this.mMutated && super.mutate() == this) {
                this.mScaleState.mDrawable.mutate();
                this.mMutated = true;
            }
            return this;
        }


    }

    export module ScaleDrawable {
        export class ScaleState implements Drawable.ConstantState {

            mDrawable:Drawable;

            //mChangingConfigurations:number = 0;

            mScaleWidth:number = 0;

            mScaleHeight:number = 0;

            mGravity:number = 0;

            mUseIntrinsicSizeAsMin:boolean;

            private mCheckedConstantState:boolean;

            private mCanConstantState:boolean;

            constructor(orig:ScaleState, owner:ScaleDrawable) {
                if (orig != null) {
                    this.mDrawable = orig.mDrawable.getConstantState().newDrawable();
                    this.mDrawable.setCallback(owner);
                    //this.mDrawable.setLayoutDirection(orig.mDrawable.getLayoutDirection());
                    this.mScaleWidth = orig.mScaleWidth;
                    this.mScaleHeight = orig.mScaleHeight;
                    this.mGravity = orig.mGravity;
                    this.mUseIntrinsicSizeAsMin = orig.mUseIntrinsicSizeAsMin;
                    this.mCheckedConstantState = this.mCanConstantState = true;
                }
            }

            newDrawable():Drawable {
                return new ScaleDrawable(this);
            }

            //getChangingConfigurations():number  {
            //    return this.mChangingConfigurations;
            //}

            canConstantState():boolean {
                if (!this.mCheckedConstantState) {
                    this.mCanConstantState = this.mDrawable.getConstantState() != null;
                    this.mCheckedConstantState = true;
                }
                return this.mCanConstantState;
            }
        }
    }

}
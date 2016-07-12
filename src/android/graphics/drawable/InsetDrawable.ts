/*
 * Copyright (C) 2008 The Android Open Source Project
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
///<reference path="Drawable.ts"/>
///<reference path="../Canvas.ts"/>


module android.graphics.drawable {
    import Canvas = android.graphics.Canvas;
    import Integer = java.lang.Integer;

    /**
     * A Drawable that insets another Drawable by a specified distance.
     * This is used when a View needs a background that is smaller than
     * the View's actual bounds.
     *
     * <p>It can be defined in an XML file with the <code>&lt;inset></code> element. For more
     * information, see the guide to <a
     * href="{@docRoot}guide/topics/resources/drawable-resource.html">Drawable Resources</a>.</p>
     *
     * @attr ref android.R.styleable#InsetDrawable_visible
     * @attr ref android.R.styleable#InsetDrawable_drawable
     * @attr ref android.R.styleable#InsetDrawable_insetLeft
     * @attr ref android.R.styleable#InsetDrawable_insetRight
     * @attr ref android.R.styleable#InsetDrawable_insetTop
     * @attr ref android.R.styleable#InsetDrawable_insetBottom
     */
    export class InsetDrawable extends Drawable implements Drawable.Callback {
        // Most of this is copied from ScaleDrawable.
        private mInsetState:InsetState;
        private mTmpRect = new Rect();
        private mMutated = false;

        constructor(drawable:Drawable, insetLeft:number, insetTop = insetLeft, insetRight = insetTop, insetBottom = insetRight) {
            super();
            this.mInsetState = new InsetState(null, this);
            this.mInsetState.mDrawable = drawable;
            this.mInsetState.mInsetLeft = insetLeft;
            this.mInsetState.mInsetTop = insetTop;
            this.mInsetState.mInsetRight = insetRight;
            this.mInsetState.mInsetBottom = insetBottom;

            if (drawable != null) {
                drawable.setCallback(this);
            }
        }


        inflate(r:android.content.res.Resources, parser:HTMLElement):void {
            super.inflate(r, parser);

            // Reset mDrawable to preserve old multiple-inflate behavior. This is
            // silly, but we have CTS tests that rely on it.
            this.mInsetState.mDrawable = null;
            let state = this.mInsetState;

            let a = r.obtainAttributes(parser);
            let dr = a.getDrawable("android:drawable");
            if (!dr && parser.children[0] instanceof HTMLElement) {
                dr = Drawable.createFromXml(r, <HTMLElement>parser.children[0]);
            }
            if (!dr) {
                throw Error("<inset> tag requires a 'drawable' attribute or child tag defining a drawable");
            }

            let inset = a.getDimensionPixelOffset("android:inset", Integer.MIN_VALUE);
            if (inset != Integer.MIN_VALUE) {
                state.mInsetLeft = inset;
                state.mInsetTop = inset;
                state.mInsetRight = inset;
                state.mInsetBottom = inset;
            }
            state.mInsetLeft = a.getDimensionPixelOffset("android:insetLeft", state.mInsetLeft);
            state.mInsetTop = a.getDimensionPixelOffset("android:insetTop", state.mInsetTop);
            state.mInsetRight = a.getDimensionPixelOffset("android:insetRight", state.mInsetRight);
            state.mInsetBottom = a.getDimensionPixelOffset("android:insetBottom", state.mInsetBottom);
        }

        drawableSizeChange(who:android.graphics.drawable.Drawable):any {
            const callback = this.getCallback();
            if (callback != null && callback.drawableSizeChange) {
                callback.drawableSizeChange(this);
            }
        }

        invalidateDrawable(who:android.graphics.drawable.Drawable):void {
            const callback = this.getCallback();
            if (callback != null) {
                callback.invalidateDrawable(this);
            }
        }

        scheduleDrawable(who:android.graphics.drawable.Drawable, what:java.lang.Runnable, when:number):void {
            const callback = this.getCallback();
            if (callback != null) {
                callback.scheduleDrawable(this, what, when);
            }
        }

        unscheduleDrawable(who:android.graphics.drawable.Drawable, what:java.lang.Runnable):void {
            const callback = this.getCallback();
            if (callback != null) {
                callback.unscheduleDrawable(this, what);
            }
        }

        draw(canvas:Canvas) {
            this.mInsetState.mDrawable.draw(canvas);
        }


        getPadding(padding:android.graphics.Rect):boolean {
            let pad = this.mInsetState.mDrawable.getPadding(padding);

            padding.left += this.mInsetState.mInsetLeft;
            padding.right += this.mInsetState.mInsetRight;
            padding.top += this.mInsetState.mInsetTop;
            padding.bottom += this.mInsetState.mInsetBottom;

            if (pad || (this.mInsetState.mInsetLeft | this.mInsetState.mInsetRight |
                this.mInsetState.mInsetTop | this.mInsetState.mInsetBottom) != 0) {
                return true;
            } else {
                return false;
            }
        }

        setVisible(visible:boolean, restart:boolean):boolean {
            this.mInsetState.mDrawable.setVisible(visible, restart);
            return super.setVisible(visible, restart);
        }


        setAlpha(alpha:number) {
            this.mInsetState.mDrawable.setAlpha(alpha);
        }

        getAlpha():number {
            return this.mInsetState.mDrawable.getAlpha();
        }

        getOpacity():number {
            return this.mInsetState.mDrawable.getOpacity();
        }

        isStateful():boolean {
            return this.mInsetState.mDrawable.isStateful();
        }

        protected onStateChange(state:Array<number>):boolean {
            let changed = this.mInsetState.mDrawable.setState(state);
            this.onBoundsChange(this.getBounds());
            return changed;
        }

        protected onBoundsChange(bounds:android.graphics.Rect):void {
            const r = this.mTmpRect;
            r.set(bounds);

            r.left += this.mInsetState.mInsetLeft;
            r.top += this.mInsetState.mInsetTop;
            r.right -= this.mInsetState.mInsetRight;
            r.bottom -= this.mInsetState.mInsetBottom;

            this.mInsetState.mDrawable.setBounds(r.left, r.top, r.right, r.bottom);
        }

        getIntrinsicWidth():number {
            return this.mInsetState.mDrawable.getIntrinsicWidth();
        }

        getIntrinsicHeight():number {
            return this.mInsetState.mDrawable.getIntrinsicHeight();
        }

        getConstantState():Drawable.ConstantState {
            if (this.mInsetState.canConstantState()) {
                //this.mInsetState.mChangingConfigurations = getChangingConfigurations();
                return this.mInsetState;
            }
            return null;
        }

        mutate():Drawable {
            if (!this.mMutated && super.mutate() == this) {
                this.mInsetState.mDrawable.mutate();
                this.mMutated = true;
            }
            return this;
        }

        /**
         * Returns the drawable wrapped by this InsetDrawable. May be null.
         */
        getDrawable():Drawable {
            return this.mInsetState.mDrawable;
        }
    }

    class InsetState implements Drawable.ConstantState {
        mDrawable:Drawable;
        mInsetLeft = 0;
        mInsetTop = 0;
        mInsetRight = 0;
        mInsetBottom = 0;
        mCheckedConstantState:boolean;
        mCanConstantState:boolean;

        constructor(orig:InsetState, owner:InsetDrawable) {
            if (orig != null) {
                this.mDrawable = orig.mDrawable.getConstantState().newDrawable();
                this.mDrawable.setCallback(owner);
                //this.mDrawable.setLayoutDirection(orig.mDrawable.getLayoutDirection());
                this.mInsetLeft = orig.mInsetLeft;
                this.mInsetTop = orig.mInsetTop;
                this.mInsetRight = orig.mInsetRight;
                this.mInsetBottom = orig.mInsetBottom;
                this.mCheckedConstantState = this.mCanConstantState = true;
            }
        }

        newDrawable():Drawable {
            let drawable = new InsetDrawable(null, 0);
            (<any>drawable).mInsetState = new InsetState(this, drawable);
            return drawable;
        }

        canConstantState():boolean {
            if (!this.mCheckedConstantState) {
                this.mCanConstantState = this.mDrawable.getConstantState() != null;
                this.mCheckedConstantState = true;
            }

            return this.mCanConstantState;
        }

    }
}
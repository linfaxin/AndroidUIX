/**
 * Created by linfaxin on 15/11/2.
 */
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/graphics/Paint.ts"/>
///<reference path="../../android/graphics/Rect.ts"/>
///<reference path="../../android/content/res/Resources.ts"/>
///<reference path="NetImage.ts"/>



module androidui.image{
    import Drawable = android.graphics.drawable.Drawable;
    import Canvas = android.graphics.Canvas;
    import Rect = android.graphics.Rect;

    export class ChangeImageSizeDrawable extends Drawable implements Drawable.Callback{
        private mState:State;
        private mTmpRect = new Rect();
        private mMutated = false;

        constructor(drawable:Drawable, overrideWidth:number, overrideHeight=overrideWidth) {
            super();
            this.mState = new State(null, this);
            this.mState.mDrawable = drawable;
            this.mState.mOverrideWidth = overrideWidth;
            this.mState.mOverrideHeight = overrideHeight;

            if (drawable != null) {
                drawable.setCallback(this);
            }
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
            this.mState.mDrawable.draw(canvas);
        }


        getPadding(padding:android.graphics.Rect):boolean {
            return this.mState.mDrawable.getPadding(padding);
        }

        setVisible(visible:boolean, restart:boolean):boolean {
            this.mState.mDrawable.setVisible(visible, restart);
            return super.setVisible(visible, restart);
        }


        setAlpha(alpha:number) {
            this.mState.mDrawable.setAlpha(alpha);
        }

        getAlpha():number {
            return this.mState.mDrawable.getAlpha();
        }

        getOpacity():number {
            return this.mState.mDrawable.getOpacity();
        }

        isStateful():boolean {
            return this.mState.mDrawable.isStateful();
        }

        protected onStateChange(state:Array<number>):boolean {
            let changed = this.mState.mDrawable.setState(state);
            this.onBoundsChange(this.getBounds());
            return changed;
        }

        protected onBoundsChange(r:android.graphics.Rect):void {
            this.mState.mDrawable.setBounds(r.left, r.top, r.right, r.bottom);
        }

        getIntrinsicWidth():number {
            return this.mState.mOverrideWidth;
        }

        getIntrinsicHeight():number {
            return this.mState.mOverrideHeight;
        }

        getConstantState():Drawable.ConstantState {
            if (this.mState.canConstantState()) {
                //this.mState.mChangingConfigurations = getChangingConfigurations();
                return this.mState;
            }
            return null;
        }
        mutate():Drawable {
            if (!this.mMutated && super.mutate() == this) {
                this.mState.mDrawable.mutate();
                this.mMutated = true;
            }
            return this;
        }
        getDrawable():Drawable {
            return this.mState.mDrawable;
        }
    }

    class State implements Drawable.ConstantState{
        mDrawable:Drawable;
        mOverrideWidth = 0;
        mOverrideHeight = 0;
        mCheckedConstantState:boolean;
        mCanConstantState:boolean;

        constructor(orig:State, owner:ChangeImageSizeDrawable) {
            if (orig != null) {
                this.mDrawable = orig.mDrawable.getConstantState().newDrawable();
                this.mDrawable.setCallback(owner);
                //this.mDrawable.setLayoutDirection(orig.mDrawable.getLayoutDirection());
                this.mOverrideWidth = orig.mOverrideWidth;
                this.mOverrideHeight = orig.mOverrideHeight;
                this.mCheckedConstantState = this.mCanConstantState = true;
            }
        }

        newDrawable():Drawable {
            let drawable = new ChangeImageSizeDrawable(null, 0);
            (<any>drawable).mState = new State(this, drawable);
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
/**
 * Created by linfaxin on 15/11/2.
 */
///<reference path="Drawable.ts"/>
///<reference path="../Canvas.ts"/>


module android.graphics.drawable{
    import Canvas = android.graphics.Canvas;

    export class InsetDrawable extends Drawable implements Drawable.Callback{
        private mInsetState:InsetState;
        private mTmpRect = new Rect();
        private mMutated = false;

        constructor(drawable:Drawable, insetLeft:number, insetTop=insetLeft, insetRight=insetTop, insetBottom=insetRight) {
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

        onStateChange(state:Array<number>):boolean {
            let changed = this.mInsetState.mDrawable.setState(state);
            this.onBoundsChange(this.getBounds());
            return changed;
        }

        onBoundsChange(bounds:android.graphics.Rect):void {
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
        getDrawable():Drawable {
            return this.mInsetState.mDrawable;
        }
    }

    class InsetState implements Drawable.ConstantState{
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
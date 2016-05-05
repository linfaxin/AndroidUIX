/**
 * Created by linfaxin on 16/1/3.
 * AndroidUI drawable
 */
///<reference path="Drawable.ts"/>
///<reference path="../Canvas.ts"/>

//TODO move to androidui/drawable dir
module android.graphics.drawable{
    import Canvas = android.graphics.Canvas;

    export class ClipRoundRectDrawable extends Drawable implements Drawable.Callback{
        private mState:DrawableState;
        private mMutated = false;

        constructor(drawable:Drawable, radiusTopLeft:number, radiusTopRight=radiusTopLeft, radiusBottomRight=radiusTopRight, radiusBottomLeft=radiusBottomRight) {
            super();
            this.mState = new DrawableState(null, this);
            this.mState.mDrawable = drawable;
            this.mState.mRadiusTopLeft = radiusTopLeft;
            this.mState.mRadiusTopRight = radiusTopRight;
            this.mState.mRadiusBottomRight = radiusBottomRight;
            this.mState.mRadiusBottomLeft = radiusBottomLeft;

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
            if(!this.mState.mRadiusTopLeft && !this.mState.mRadiusBottomRight && !this.mState.mRadiusTopRight && !this.mState.mRadiusBottomLeft){
                this.mState.mDrawable.draw(canvas);
                return;
            }
            let saveCount:number = canvas.save();
            canvas.clipRoundRect(this.getBounds(), this.mState.mRadiusTopLeft, this.mState.mRadiusBottomRight,
                this.mState.mRadiusTopRight, this.mState.mRadiusBottomLeft);
            this.mState.mDrawable.draw(canvas);
            canvas.restoreToCount(saveCount);
        }


        getPadding(padding:Rect):boolean  {
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

        protected onBoundsChange(bounds:android.graphics.Rect):void  {
            this.mState.mDrawable.setBounds(bounds.left, bounds.top, bounds.right, bounds.bottom);
        }

        getIntrinsicWidth():number {
            return this.mState.mDrawable.getIntrinsicWidth();
        }

        getIntrinsicHeight():number {
            return this.mState.mDrawable.getIntrinsicHeight();
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

    class DrawableState implements Drawable.ConstantState{
        mDrawable:Drawable;
        mRadiusTopLeft = 0;
        mRadiusTopRight = 0;
        mRadiusBottomRight = 0;
        mRadiusBottomLeft = 0;
        mCheckedConstantState:boolean;
        mCanConstantState:boolean;

        constructor(orig:DrawableState, owner:ClipRoundRectDrawable) {
            if (orig != null) {
                this.mDrawable = orig.mDrawable.getConstantState().newDrawable();
                this.mDrawable.setCallback(owner);
                //this.mDrawable.setLayoutDirection(orig.mDrawable.getLayoutDirection());
                this.mRadiusTopLeft = orig.mRadiusTopLeft;
                this.mRadiusTopRight = orig.mRadiusTopRight;
                this.mRadiusBottomRight = orig.mRadiusBottomRight;
                this.mRadiusBottomLeft = orig.mRadiusBottomLeft;
                this.mCheckedConstantState = this.mCanConstantState = true;
            }
        }

        newDrawable():Drawable {
            let drawable = new ClipRoundRectDrawable(null, 0);
            (<any>drawable).mState = new DrawableState(this, drawable);
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
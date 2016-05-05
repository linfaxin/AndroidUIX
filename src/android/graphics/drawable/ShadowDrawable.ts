/**
 * Created by linfaxin on 16/1/13.
 * androidui drawable
 */
///<reference path="Drawable.ts"/>
///<reference path="../Canvas.ts"/>
///<reference path="../Paint.ts"/>

//TODO move to androidui/drawable package
module android.graphics.drawable{

    /**
     * Shadow is very expensive
     */
    export class ShadowDrawable extends Drawable{
        private mState:DrawableState;
        private mMutated = false;
        constructor(drawable:Drawable, radius:number, dx:number, dy:number, color:number){
            super();
            this.mState = new DrawableState(null, this);

            this.mState.mDrawable = drawable;
            this.mState.shadowDx = dx;
            this.mState.shadowDy = dy;
            this.mState.shadowRadius = radius;
            this.mState.shadowColor = color;
            if (drawable != null) {
                drawable.setCallback(this);
            }
        }
        setShadow(radius:number, dx:number, dy:number, color:number):void {
            this.mState.shadowDx = dx;
            this.mState.shadowDy = dy;
            this.mState.shadowRadius = radius;
            this.mState.shadowColor = color;
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
            if(!this.mState.shadowRadius || Color.alpha(this.mState.shadowColor) === 0){
                this.mState.mDrawable.draw(canvas);
                return;
            }
            let saveCount:number = canvas.save();
            canvas.setShadow(this.mState.shadowRadius, this.mState.shadowDx, this.mState.shadowDy, this.mState.shadowColor);
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
            return PixelFormat.TRANSPARENT;
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

        shadowDx:number = 0;
        shadowDy:number = 0;
        shadowRadius:number = 0;
        shadowColor:number = 0;

        mCheckedConstantState:boolean;
        mCanConstantState:boolean;

        constructor(orig:DrawableState, owner:ShadowDrawable) {
            if (orig != null) {
                this.mDrawable = orig.mDrawable.getConstantState().newDrawable();
                this.mDrawable.setCallback(owner);
                this.shadowDx = orig.shadowDx;
                this.shadowDy = orig.shadowDy;
                this.shadowRadius = orig.shadowRadius;
                this.shadowColor = orig.shadowColor;
            }
        }

        newDrawable():Drawable {
            let drawable = new ShadowDrawable(null, 0, 0, 0, 0);
            drawable.mState = new DrawableState(this, drawable);
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
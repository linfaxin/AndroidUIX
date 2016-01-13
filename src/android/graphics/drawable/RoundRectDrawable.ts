/**
 * Created by linfaxin on 15/10/29.
 */
///<reference path="Drawable.ts"/>
///<reference path="../Canvas.ts"/>
///<reference path="../Paint.ts"/>

module android.graphics.drawable{

    export class RoundRectDrawable extends Drawable{
        private mState:State;
        private mMutated = false;
        private mPaint = new Paint();
        constructor(color:number, radiusTopLeft:number, radiusTopRight=radiusTopLeft, radiusBottomRight=radiusTopRight, radiusBottomLeft=radiusBottomRight){
            super();
            this.mState = new State();
            this.setColor(color);
            this.mState.mRadiusTopLeft = radiusTopLeft;
            this.mState.mRadiusTopRight = radiusTopRight;
            this.mState.mRadiusBottomRight = radiusBottomRight;
            this.mState.mRadiusBottomLeft = radiusBottomLeft;
        }
        mutate():Drawable {
            if (!this.mMutated && super.mutate() == this) {
                this.mState = new State(this.mState);
                this.mMutated = true;
            }
            return this;
        }
        draw(canvas:Canvas) {
            if ((this.mState.mUseColor >>> 24) != 0) {
                this.mPaint.setColor(this.mState.mUseColor);
                canvas.drawRoundRect(this.getBounds(), this.mState.mRadiusTopLeft, this.mState.mRadiusTopRight,
                    this.mState.mRadiusBottomRight, this.mState.mRadiusBottomLeft, this.mPaint);
            }
        }
        getColor():number {
            return this.mState.mUseColor;
        }
        setColor(color:number) {
            if (this.mState.mBaseColor != color || this.mState.mUseColor != color) {
                this.invalidateSelf();
                this.mState.mBaseColor = this.mState.mUseColor = color;
            }
        }
        getAlpha():number {
            return this.mState.mUseColor >>> 24;
        }
        setAlpha(alpha:number) {
            alpha += alpha >> 7;   // make it 0..256
            let baseAlpha = this.mState.mBaseColor >>> 24;
            let useAlpha = baseAlpha * alpha >> 8;
            let oldUseColor = this.mState.mUseColor;
            this.mState.mUseColor = (this.mState.mBaseColor << 8 >>> 8) | (useAlpha << 24);
            if (oldUseColor != this.mState.mUseColor) {
                this.invalidateSelf();
            }
        }
        getOpacity():number {
            switch (this.mState.mUseColor >>> 24) {
                case 255:
                    return PixelFormat.OPAQUE;
                case 0:
                    return PixelFormat.TRANSPARENT;
            }
            return PixelFormat.TRANSLUCENT;
        }

        getConstantState():Drawable.ConstantState {
            return this.mState;
        }

    }

    class State implements Drawable.ConstantState{
        mBaseColor = 0;
        mUseColor = 0;

        mRadiusTopLeft = 0;
        mRadiusTopRight = 0;
        mRadiusBottomRight = 0;
        mRadiusBottomLeft = 0;

        constructor(state?:State){
            if (state != null) {
                this.mBaseColor = state.mBaseColor;
                this.mUseColor = state.mUseColor;

                this.mRadiusTopLeft = state.mRadiusTopLeft;
                this.mRadiusTopRight = state.mRadiusTopRight;
                this.mRadiusBottomRight = state.mRadiusBottomRight;
                this.mRadiusBottomLeft = state.mRadiusBottomLeft;
            }
        }

        newDrawable():Drawable {
            let c =  new RoundRectDrawable(0, 0, 0, 0, 0);
            c.mState = new State(this);
            return c;
        }
    }
}
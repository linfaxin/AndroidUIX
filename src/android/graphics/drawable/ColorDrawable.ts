/**
 * Created by linfaxin on 15/10/29.
 */
///<reference path="Drawable.ts"/>
///<reference path="../Canvas.ts"/>
///<reference path="../Paint.ts"/>

module android.graphics.drawable{

    export class ColorDrawable extends Drawable{
        private mState:ColorState;
        private mMutated = false;
        private mPaint = new Paint();
        constructor(color?:number){
            super();
            this.mState = new ColorState();
            if(color!==undefined){
                this.setColor(color);
            }
        }
        _setStateCopyFrom(state:any){
            this.mState = new ColorState(<ColorState>state);
        }
        mutate():Drawable {
            if (!this.mMutated && super.mutate() == this) {
                this.mState = new ColorState(this.mState);
                this.mMutated = true;
            }
            return this;
        }
        draw(canvas:Canvas) {
            if ((this.mState.mUseColor >>> 24) != 0) {
                this.mPaint.setColor(this.mState.mUseColor);
                canvas.drawRect(this.getBounds(), this.mPaint);
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


    class ColorState implements Drawable.ConstantState{

        mBaseColor = 0;
        mUseColor = 0;
        constructor(state?:ColorState){
            if (state != null) {
                this.mBaseColor = state.mBaseColor;
                this.mUseColor = state.mUseColor;
            }
        }

        newDrawable():Drawable {
            let c =  new ColorDrawable();
            c._setStateCopyFrom(this);
            return c;
        }
    }
}
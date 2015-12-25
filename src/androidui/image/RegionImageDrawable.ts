/**
 * Created by linfaxin on 15/12/24.
 */
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/graphics/Paint.ts"/>
///<reference path="../../android/graphics/Rect.ts"/>
///<reference path="../../android/content/res/Resources.ts"/>
///<reference path="NetImage.ts"/>


module androidui.image{
    import Paint = android.graphics.Paint;
    import Rect = android.graphics.Rect;
    import Drawable = android.graphics.drawable.Drawable;
    import Canvas = android.graphics.Canvas;
    import Resources = android.content.res.Resources;

    export class RegionImageDrawable extends Drawable {
        private mState:State;

        constructor(image:NetImage, bound, paint = new Paint()){
            super();
            this.mState = new State(image, bound, paint);
            image.addLoadListener(()=>{
                this.invalidateSelf();
            });
        }

        draw(canvas:Canvas):void {
            canvas.drawImage(this.mState.mImage, this.mState.mBound, this.getBounds(), this.mState.mPaint);
        }

        setAlpha(alpha:number):void {
            this.mState.mPaint.setAlpha(alpha);
        }

        getAlpha():number {
            return this.mState.mPaint.getAlpha();
        }

        getIntrinsicWidth():number {
            return Math.floor(this.mState.mBound.width() * Resources.getDisplayMetrics().density / this.mState.mImage.getImageRatio());
        }

        getIntrinsicHeight():number {
            return Math.floor(this.mState.mBound.height() * Resources.getDisplayMetrics().density / this.mState.mImage.getImageRatio());
        }

        getImage():NetImage {
            return this.mState.mImage;
        }

        getConstantState():Drawable.ConstantState {
            return this.mState;
        }

    }

    class State implements Drawable.ConstantState{
        mImage:NetImage;
        mBound:Rect;
        mPaint:Paint;
        constructor(image:NetImage, bound:Rect, paint:Paint) {
            this.mImage = image;
            this.mBound = bound;
            this.mPaint = paint;
        }
        newDrawable():Drawable {
            return new RegionImageDrawable(this.mImage, this.mBound, this.mPaint);
        }
    }
}
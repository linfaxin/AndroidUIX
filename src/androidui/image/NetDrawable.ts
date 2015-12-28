/**
 * Created by linfaxin on 15/12/11.
 */
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/graphics/Paint.ts"/>
///<reference path="../../android/content/res/Resources.ts"/>
///<reference path="NetImage.ts"/>


module androidui.image{
    import Paint = android.graphics.Paint;
    import Drawable = android.graphics.drawable.Drawable;
    import Canvas = android.graphics.Canvas;
    import Resources = android.content.res.Resources;

    export class NetDrawable extends Drawable {
        private mState:State;
        private mLoadListener:NetDrawable.LoadListener;
        private mImageWidth = -1;
        private mImageHeight = -1;

        constructor(src:string|NetImage, paint?:Paint, overrideImageRatio?:number){
            super();
            let image:NetImage;
            if(src instanceof NetImage){
                image = src;
                if(overrideImageRatio) image.mOverrideImageRatio = overrideImageRatio;
            }else{
                image = new NetImage(<string>src, overrideImageRatio);
            }
            image.addLoadListener(()=>this.onLoad(), ()=>this.onError());
            this.mState = new State(image, paint);
        }

        draw(canvas:Canvas):void {
            if(this.isLoadFinish()){
                canvas.drawImage(this.mState.mImage, null, this.getBounds(), this.mState.paint);
            }
        }

        setAlpha(alpha:number):void {
            this.mState.paint.setAlpha(alpha);
        }

        getAlpha():number {
            return this.mState.paint.getAlpha();
        }

        getIntrinsicWidth():number {
            return this.mImageWidth;
        }

        getIntrinsicHeight():number {
            return this.mImageHeight;
        }

        protected onLoad(){
            let imageRatio = this.mState.mImage.getImageRatio();
            this.mImageWidth = Math.floor(this.mState.mImage.width / imageRatio * Resources.getDisplayMetrics().density);
            this.mImageHeight = Math.floor(this.mState.mImage.height / imageRatio * Resources.getDisplayMetrics().density);
            if(this.mLoadListener) this.mLoadListener.onLoad(this);
            this.invalidateSelf();
            this.notifySizeChangeSelf();
        }

        protected onError(){
            this.mImageWidth = this.mImageHeight = 0;
            if(this.mLoadListener) this.mLoadListener.onError(this);
            this.invalidateSelf();
            this.notifySizeChangeSelf();
        }

        isLoadFinish():boolean {
            return this.mImageWidth >=0 && this.mImageHeight >= 0;
        }

        getImage():NetImage {
            return this.mState.mImage;
        }

        setLoadListener(loadListener:NetDrawable.LoadListener):void {
            this.mLoadListener = loadListener;
        }

        getConstantState():Drawable.ConstantState {
            return this.mState;
        }

    }

    export module NetDrawable{
        export interface LoadListener {
            onLoad(drawable:NetDrawable);
            onError(drawable:NetDrawable);
        }
    }

    class State implements Drawable.ConstantState{
        mImage:NetImage;
        paint:Paint;
        constructor(image:NetImage, paint=new Paint()) {
            this.mImage = image;
            this.paint = new Paint();
            if(paint!=null) this.paint.set(paint);
        }
        newDrawable():Drawable {
            return new NetDrawable(this.mImage, this.paint);
        }
    }
}
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
        private mImage:NetImage;
        private mState:State;
        private mLoadListener:NetDrawable.LoadListener;
        private mImageWidth = -1;
        private mImageHeight = -1;

        constructor(src:string, res?:Resources, paint?:Paint){
            super();
            this.mState = new State(src, res, paint);
            this.mImage = new NetImage(src, ()=>this.onLoad(), ()=>this.onError());
        }

        draw(canvas:Canvas):void {
            if(this.isLoadFinish()){
                canvas.drawImage(this.mImage, null, this.getBounds(), this.mState.paint);
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
            let imageRatio = this.mImage.getImageRatio();
            this.mImageWidth = Math.floor(this.mImage.width / imageRatio * this.mState.res.getDisplayMetrics().density);
            this.mImageHeight = Math.floor(this.mImage.height / imageRatio * this.mState.res.getDisplayMetrics().density);
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
            return this.mImage;
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
        src:string;
        paint:Paint;
        res:Resources;
        constructor(src:string, res=Resources.instance, paint=new Paint()) {
            this.res = res || Resources.instance;
            this.src = src;
            this.paint = new Paint();
            this.paint.set(paint);
        }
        newDrawable():Drawable {
            return new NetDrawable(this.src, this.res, this.paint);
        }
    }
}
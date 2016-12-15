/**
 * Created by linfaxin on 15/12/11.
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

    export class NetDrawable extends Drawable {
        private mState:State;
        private mLoadListener:NetDrawable.LoadListener;
        protected mImageWidth = 0;
        protected mImageHeight = 0;
        private mTileModeX:NetDrawable.TileMode;
        private mTileModeY:NetDrawable.TileMode;
        private mTmpTileBound:Rect;
        

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

            if(image.isImageLoaded()) this.initBoundWithLoadedImage(image);
        }

        protected initBoundWithLoadedImage(image:NetImage){
            let imageRatio = image.getImageRatio();
            this.mImageWidth = Math.floor(image.width / imageRatio * android.content.res.Resources.getDisplayMetrics().density);
            this.mImageHeight = Math.floor(image.height / imageRatio * android.content.res.Resources.getDisplayMetrics().density);
        }

        setURL(url:string, hiddenWhenLoading=true):void {
            if(hiddenWhenLoading){
                this.mImageWidth = this.mImageHeight = 0;
            }
            this.mState.mImage.src = url;
        }

        draw(canvas:Canvas):void {
            if(!this.isImageSizeEmpty()){
                let emptyTileX = this.mTileModeX == null || this.mTileModeX == NetDrawable.TileMode.DEFAULT;
                let emptyTileY = this.mTileModeY == null || this.mTileModeY == NetDrawable.TileMode.DEFAULT;

                if(emptyTileX && emptyTileY){
                    canvas.drawImage(this.mState.mImage, null, this.getBounds(), this.mState.paint);
                } else{
                    this.drawTile(canvas);
                }
            }
        }

        private drawTile(canvas:Canvas):void {
            let imageWidth = this.mImageWidth;
            let imageHeight = this.mImageHeight;
            if(imageHeight<=0 || imageWidth<=0) return;
            let tileX = this.mTileModeX;
            let tileY = this.mTileModeY;
            let bound = this.getBounds();

            if(this.mTmpTileBound==null) this.mTmpTileBound = new Rect();
            let tmpBound = this.mTmpTileBound;
            tmpBound.setEmpty();

            function drawColumn(){
                if(tileY === NetDrawable.TileMode.REPEAT){
                    tmpBound.bottom = imageHeight;
                    while(tmpBound.isEmpty() || tmpBound.intersects(bound)){
                        canvas.drawImage(this.mState.mImage, null, tmpBound, this.mState.paint);
                        tmpBound.offset(0, imageHeight);
                    }
                }else{
                    tmpBound.bottom = bound.height();
                    canvas.drawImage(this.mState.mImage, null, tmpBound, this.mState.paint);
                }
            }

            if(tileX === NetDrawable.TileMode.REPEAT){
                tmpBound.right = imageWidth;
                while(tmpBound.isEmpty() || tmpBound.intersects(bound)){
                    drawColumn.call(this);
                    tmpBound.offset(imageWidth, -tmpBound.top);
                }

            }else{
                tmpBound.right = bound.width();
                drawColumn.call(this);
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
            this.initBoundWithLoadedImage(this.mState.mImage);
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

        isImageSizeEmpty():boolean {
            return this.mImageWidth <=0 || this.mImageHeight <= 0;
        }

        getImage():NetImage {
            return this.mState.mImage;
        }

        setLoadListener(loadListener:NetDrawable.LoadListener):void {
            this.mLoadListener = loadListener;
        }

        setTileMode(tileX:NetDrawable.TileMode, tileY:NetDrawable.TileMode){
            this.mTileModeX = tileX;
            this.mTileModeY = tileY;
            this.invalidateSelf();
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

        export enum TileMode{
            DEFAULT,
            REPEAT,
            //MIRROR  //TODO not support now
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
            return new NetDrawable(this.mImage.src, this.paint);
        }
    }
}
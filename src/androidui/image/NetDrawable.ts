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
        private mImageWidth = 0;
        private mImageHeight = 0;
        private mTmpTileBound:Rect;
        

        constructor(src:string|NetImage, paint?:Paint, overrideImageRatio?:number){
            super();
            if (src) {
                this.initWithImage(src, paint, overrideImageRatio);
            }
        }

        private initWithImage(src:string|NetImage, paint?:Paint, overrideImageRatio?:number):void {
            let image:NetImage;
            if(src instanceof NetImage){
                image = src;
                if(overrideImageRatio) image.mOverrideImageRatio = overrideImageRatio;
            }else if(src) {
                image = new NetImage(<string>src, overrideImageRatio);
            }

            this.mState = new State(image, paint);

            if (image) {
                image.addLoadListener(()=>this.onLoad(), ()=>this.onError());
                if(image.isImageLoaded()) this.initBoundWithLoadedImage(image);
            }
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
                let emptyTileX = this.mState.mTileModeX == null || this.mState.mTileModeX == NetDrawable.TileMode.DEFAULT;
                let emptyTileY = this.mState.mTileModeY == null || this.mState.mTileModeY == NetDrawable.TileMode.DEFAULT;

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
            let tileX = this.mState.mTileModeX;
            let tileY = this.mState.mTileModeY;
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

        unscheduleSelf(what):any {
            return super.unscheduleSelf(what);
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
            this.mState.mTileModeX = tileX;
            this.mState.mTileModeY = tileY;
            this.invalidateSelf();
        }

        getConstantState():Drawable.ConstantState {
            return this.mState;
        }


        inflate(r: android.content.res.Resources, parser: HTMLElement): void {
            super.inflate(r, parser);

            let a = r.obtainAttributes(parser);
            let src = a.getString("android:src");
            this.initWithImage(src);
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
        mTileModeX:NetDrawable.TileMode;
        mTileModeY:NetDrawable.TileMode;
        constructor(image:NetImage, paint=new Paint()) {
            this.mImage = image;
            this.paint = new Paint();
            if(paint!=null) this.paint.set(paint);
        }
        newDrawable():Drawable {
            let d = new NetDrawable(this.mImage, this.paint);
            d.setTileMode(this.mTileModeX, this.mTileModeY);
            return d;
        }
    }
}
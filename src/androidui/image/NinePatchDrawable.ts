/**
 * Created by linfaxin on 16/1/23.
 */
///<reference path="NetDrawable.ts"/>
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/graphics/Paint.ts"/>
///<reference path="../../android/graphics/Rect.ts"/>
///<reference path="../../android/graphics/Color.ts"/>
///<reference path="../../android/view/ViewConfiguration.ts"/>
///<reference path="../../android/content/res/Resources.ts"/>
///<reference path="NetImage.ts"/>

module androidui.image {
    import Paint = android.graphics.Paint;
    import Rect = android.graphics.Rect;
    import Color = android.graphics.Color;
    import Drawable = android.graphics.drawable.Drawable;
    import Canvas = android.graphics.Canvas;


    export class NinePatchDrawable extends NetDrawable {
        private static GlobalBorderInfoCache = new Map<string, NinePatchBorderInfo>();

        private mTmpRect = new Rect();
        private mTmpRect2 = new Rect();
        private mNinePatchBorderInfo:NinePatchBorderInfo;
        private mNinePatchDrawCache:Canvas;

        //constructor(src:string|NetImage, paint?:Paint, overrideImageRatio?:number) {
        //    super(src, paint, overrideImageRatio);
        //}

        protected initBoundWithLoadedImage(image:NetImage){
            let imageRatio = image.getImageRatio();
            this.mImageWidth = Math.floor( (image.width-2) / imageRatio * android.content.res.Resources.getDisplayMetrics().density);
            this.mImageHeight = Math.floor( (image.height-2) / imageRatio * android.content.res.Resources.getDisplayMetrics().density);
            this.initNinePatchBorderInfo(image);
        }

        private initNinePatchBorderInfo(image:NetImage){
            this.mNinePatchBorderInfo = NinePatchDrawable.GlobalBorderInfoCache.get(image.src);
            if(!this.mNinePatchBorderInfo){
                image.getBorderPixels((leftBorder:number[], topBorder:number[], rightBorder:number[], bottomBorder:number[])=>{
                    this.mNinePatchBorderInfo = new NinePatchBorderInfo(leftBorder, topBorder, rightBorder, bottomBorder);
                    NinePatchDrawable.GlobalBorderInfoCache.set(image.src, this.mNinePatchBorderInfo);
                });
            }
        }

        protected onLoad():void {
            //parse nine patch border now.
            let image:NetImage = this.getImage();

            let ninePatchBorderInfo = NinePatchDrawable.GlobalBorderInfoCache.get(image.src);
            if(ninePatchBorderInfo){
                this.mNinePatchBorderInfo = ninePatchBorderInfo;
                super.onLoad();
                return;
            }

            image.getBorderPixels((leftBorder:number[], topBorder:number[], rightBorder:number[], bottomBorder:number[])=>{
                ninePatchBorderInfo = new NinePatchBorderInfo(leftBorder, topBorder, rightBorder, bottomBorder);
                NinePatchDrawable.GlobalBorderInfoCache.set(image.src, ninePatchBorderInfo);
                //parse border finish, notify load finish.
                super.onLoad();
            });
        }


        draw(canvas:Canvas):void {
            if(!this.mNinePatchBorderInfo) return;
            if(!this.isImageSizeEmpty()){
                let cache = this.getNinePatchCache();
                if(cache){
                    canvas.drawCanvas(cache);
                }else{
                    this.drawNinePatch(canvas);
                }
            }
        }

        private getNinePatchCache():Canvas {
            let bound = this.getBounds();
            let width = bound.width();
            let height = bound.height();
            let cache = this.mNinePatchDrawCache;
            if(cache){
                if(cache.getWidth() === width && cache.getHeight() === height){
                    return cache;
                }
                cache.recycle();
            }
            const cachePixelSize:number = width * height * 4;
            const drawingCacheSize:number = android.view.ViewConfiguration.get().getScaledMaximumDrawingCacheSize();
            if(cachePixelSize > drawingCacheSize) return null;
            cache = this.mNinePatchDrawCache = new Canvas(bound.width(), bound.height());
            this.drawNinePatch(cache);
            return cache;
        }

        private drawNinePatch(canvas:Canvas):void {
            let smoothEnableBak = canvas.isImageSmoothingEnabled();
            canvas.setImageSmoothingEnabled(false);

            let imageWidth = this.mImageWidth;
            let imageHeight = this.mImageHeight;
            if(imageHeight<=0 || imageWidth<=0) return;
            let image = this.getImage();
            let bound = this.getBounds();
            const staticRatioScale = android.content.res.Resources.getDisplayMetrics().density / image.getImageRatio();

            const staticWidthSum = this.mNinePatchBorderInfo.getHorizontalStaticLengthSum();
            const staticHeightSum = this.mNinePatchBorderInfo.getVerticalStaticLengthSum();
            let extraWidth = bound.width() - Math.floor(staticWidthSum * staticRatioScale);
            let extraHeight = bound.height() - Math.floor(staticHeightSum * staticRatioScale);
            let staticWidthPartScale = (extraWidth>=0 || staticWidthSum==0) ? 1 : bound.width() / staticWidthSum;
            let staticHeightPartScale = (extraHeight>=0 || staticHeightSum==0) ? 1 : bound.height() / staticHeightSum;
            staticWidthPartScale *= staticRatioScale;
            staticHeightPartScale *= staticRatioScale;
            const scaleHorizontalWeightSum = this.mNinePatchBorderInfo.getHorizontalScaleLengthSum();
            const scaleVerticalWeightSum = this.mNinePatchBorderInfo.getVerticalScaleLengthSum();

            const drawColumn = (srcFromX:number, srcToX:number, dstFromX:number, dstToX:number)=>{
                const heightParts = this.mNinePatchBorderInfo.getVerticalTypedValues();
                let srcFromY = 1;
                let dstFromY = 0;
                for(let i = 0, size=heightParts.length; i<size; i++){
                    let typedValue = heightParts[i];
                    let isScalePart = NinePatchBorderInfo.isScaleType(typedValue);
                    let srcHeight = NinePatchBorderInfo.getValueUnpack(typedValue);
                    if(srcHeight <= 0) continue;
                    let dstHeight;
                    if(isScalePart){
                        if(scaleVerticalWeightSum == 0) continue;
                        dstHeight = extraHeight * srcHeight / scaleVerticalWeightSum;
                        if(dstHeight <= 0) continue;

                    }else{
                        //static part
                        dstHeight = srcHeight * staticHeightPartScale;
                    }

                    let srcRect = this.mTmpRect;
                    let dstRect = this.mTmpRect2;
                    srcRect.set(srcFromX, srcFromY, srcToX, srcFromY+srcHeight);
                    dstRect.set(dstFromX, dstFromY, dstToX, dstFromY+dstHeight);

                    // eat half pix for iOS to prevent draw the nine-patch border
                    if (srcRect.bottom === image.height - 1) srcRect.bottom -= 0.5;
                    if (srcRect.right === image.width - 1) srcRect.right -= 0.5;

                    canvas.drawImage(image, srcRect, dstRect);

                    srcFromY+=srcHeight;
                    dstFromY+=dstHeight;
                }
            };

            const widthParts = this.mNinePatchBorderInfo.getHorizontalTypedValues();
            let srcFromX = 1;
            let dstFromX = 0;
            for(let i = 0, size=widthParts.length; i<size; i++){
                let typedValue = widthParts[i];
                let isScalePart = NinePatchBorderInfo.isScaleType(typedValue);
                let srcWidth = NinePatchBorderInfo.getValueUnpack(typedValue);
                let dstWidth;
                if(isScalePart) {
                    dstWidth = extraWidth * srcWidth / scaleHorizontalWeightSum;

                } else {//static part
                    dstWidth = srcWidth * staticWidthPartScale;
                }
                if(dstWidth <= 0) continue;

                drawColumn(srcFromX, srcFromX+srcWidth, dstFromX, dstFromX+dstWidth);
                srcFromX+=srcWidth;
                dstFromX+=dstWidth;
            }

            canvas.setImageSmoothingEnabled(smoothEnableBak);
        }


        getPadding(padding:android.graphics.Rect):boolean {
            let info = this.mNinePatchBorderInfo;
            if(!info) return false;
            let imageRatio = this.getImage() && this.getImage().getImageRatio() || 1;
            const staticRatioScale = android.content.res.Resources.getDisplayMetrics().density / imageRatio;
            padding.set(Math.floor(info.getPaddingLeft() * staticRatioScale), Math.floor(info.getPaddingTop() * staticRatioScale),
                Math.floor(info.getPaddingRight() * staticRatioScale), Math.floor(info.getPaddingBottom() * staticRatioScale));
            return true;
        }
    }

    class NinePatchBorderInfo {
        //src data (start & end pixel excluded)
        //private leftBorder:number[];
        //private topBorder:number[];
        //private rightBorder:number[];
        //private bottomBorder:number[];

        //parsed data
        private horizontalTypedValues:number[];
        private horizontalStaticLengthSum = 0;
        private horizontalScaleLengthSum = 0;
        private verticalTypedValues:number[];
        private verticalStaticLengthSum = 0;
        private verticalScaleLengthSum = 0;

        private paddingLeft = 0;
        private paddingTop = 0;
        private paddingRight = 0;
        private paddingBottom = 0;

        constructor(leftBorder:number[], topBorder:number[], rightBorder:number[], bottomBorder:number[]){
            //this.leftBorder = leftBorder;
            //this.topBorder = topBorder;
            //this.rightBorder = rightBorder;
            //this.bottomBorder = bottomBorder;

            this.horizontalTypedValues = [];
            this.verticalTypedValues = [];
            let tmpLength = 0;
            let currentStatic = true;

            for(let color of leftBorder){
                let isScaleColor = NinePatchBorderInfo.isScaleColor(color);
                let typeChange = (isScaleColor && currentStatic) || (!isScaleColor && !currentStatic);
                if(typeChange) {
                    let lengthValue = currentStatic ? tmpLength : -tmpLength; //negative value mean scale part
                    if(currentStatic) this.verticalStaticLengthSum += tmpLength;
                    this.verticalTypedValues.push(lengthValue);
                    tmpLength = 1;
                }else{
                    tmpLength++;
                }
                currentStatic = !isScaleColor;
            }
            if(currentStatic) this.verticalStaticLengthSum += tmpLength;
            this.verticalScaleLengthSum = leftBorder.length - this.verticalStaticLengthSum;
            this.verticalTypedValues.push(currentStatic ? tmpLength : -tmpLength);//negative value mean scale pixel

            tmpLength = 0;
            currentStatic = true;
            for(let color of topBorder){
                let isScaleColor = NinePatchBorderInfo.isScaleColor(color);
                let typeChange = (isScaleColor && currentStatic) || (!isScaleColor && !currentStatic);
                if(typeChange) {
                    let lengthValue = currentStatic ? tmpLength : -tmpLength; //negative value mean scale part
                    if(currentStatic) this.horizontalStaticLengthSum += tmpLength;
                    this.horizontalTypedValues.push(lengthValue);
                    tmpLength = 1;
                }else{
                    tmpLength++;
                }
                currentStatic = !isScaleColor;
            }
            if(currentStatic) this.horizontalStaticLengthSum += tmpLength;
            this.horizontalScaleLengthSum = topBorder.length - this.horizontalStaticLengthSum;
            this.horizontalTypedValues.push(currentStatic ? tmpLength : -tmpLength);//negative value mean scale pixel


            //padding from left & top
            if(this.horizontalTypedValues.length>=3){
                this.paddingLeft = Math.max(0, this.horizontalTypedValues[0]);
                this.paddingRight = Math.max(0, this.horizontalTypedValues[this.horizontalTypedValues.length-1]);
            }
            if(this.verticalTypedValues.length>=3){
                this.paddingTop = Math.max(0, this.verticalTypedValues[0]);
                this.paddingBottom = Math.max(0, this.verticalTypedValues[this.verticalTypedValues.length-1]);
            }
            //override if rightBorder / bottomBorder defined
            for(let i = 0, length = rightBorder.length; i<length; i++){
                if(NinePatchBorderInfo.isScaleColor(rightBorder[i])){
                    this.paddingTop = i;
                    break;
                }
            }
            for(let i = 0, length = rightBorder.length; i<length; i++){
                if(NinePatchBorderInfo.isScaleColor(rightBorder[length-1-i])){
                    this.paddingBottom = i;
                    break;
                }
            }
            for(let i = 0, length = bottomBorder.length; i<length; i++){
                if(NinePatchBorderInfo.isScaleColor(bottomBorder[i])){
                    this.paddingLeft = i;
                    break;
                }
            }
            for(let i = 0, length = bottomBorder.length; i<length; i++){
                if(NinePatchBorderInfo.isScaleColor(bottomBorder[length-1-i])){
                    this.paddingRight = i;
                    break;
                }
            }
        }
        static isScaleColor(color:number):boolean {
            //return color === 0xff000000;
            return Color.alpha(color) > 200 && Color.red(color) < 50 && Color.green(color) < 50 && Color.blue(color) < 50;
        }
        static isScaleType(typedValue:number):boolean {
            return typedValue < 0;
        }
        static getValueUnpack(typedValue:number):number {
            return Math.abs(typedValue);
        }

        getHorizontalTypedValues():number[] {
            return this.horizontalTypedValues;
        }
        getHorizontalStaticLengthSum():number {
            return this.horizontalStaticLengthSum;
        }
        getHorizontalScaleLengthSum():number {
            return this.horizontalScaleLengthSum;
        }

        getVerticalTypedValues():number[] {
            return this.verticalTypedValues;
        }
        getVerticalStaticLengthSum():number {
            return this.verticalStaticLengthSum;
        }
        getVerticalScaleLengthSum():number {
            return this.verticalScaleLengthSum;
        }

        getPaddingLeft():number {
            return this.paddingLeft;
        }
        getPaddingTop():number {
            return this.paddingTop;
        }
        getPaddingRight():number {
            return this.paddingRight;
        }
        getPaddingBottom():number {
            return this.paddingBottom;
        }
    }

}
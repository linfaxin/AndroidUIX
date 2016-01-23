/**
 * Created by linfaxin on 16/1/23.
 */
///<reference path="NetDrawable.ts"/>
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/graphics/Paint.ts"/>
///<reference path="../../android/graphics/Rect.ts"/>
///<reference path="../../android/graphics/Color.ts"/>
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

        //constructor(src:string|NetImage, paint?:Paint, overrideImageRatio?:number) {
        //    super(src, paint, overrideImageRatio);
        //}

        protected initBoundWithLoadedImage(image:NetImage){
            let imageRatio = image.getImageRatio();
            this.mImageWidth = Math.floor( (image.width-2) / imageRatio * android.content.res.Resources.getDisplayMetrics().density);
            this.mImageHeight = Math.floor( (image.height-2) / imageRatio * android.content.res.Resources.getDisplayMetrics().density);
            this.mNinePatchBorderInfo = NinePatchDrawable.GlobalBorderInfoCache.get(this.mState.mImage.src);
        }


        protected onLoad():void {
            //parse nine patch border now.
            let image = this.mState.mImage;

            let ninePatchBorderInfo = NinePatchDrawable.GlobalBorderInfoCache.get(image.src);
            if(ninePatchBorderInfo){
                this.mNinePatchBorderInfo = ninePatchBorderInfo;
                super.onLoad();
                return;
            }

            //left border
            this.mTmpRect.set(0, 1, 1, image.height-1);
            image.getPixels(this.mTmpRect, (leftBorder:number[])=>{

                //top border
                this.mTmpRect.set(1, 0, image.width-1, 1);
                image.getPixels(this.mTmpRect, (topBorder:number[])=>{

                    //right border
                    this.mTmpRect.set(image.width-1, 1, image.width, image.height-1);
                    image.getPixels(this.mTmpRect, (rightBorder:number[])=>{

                        //bottom border
                        this.mTmpRect.set(1, image.height-1, image.width-1, image.height);
                        image.getPixels(this.mTmpRect, (bottomBorder:number[])=>{

                            ninePatchBorderInfo = new NinePatchBorderInfo(leftBorder, topBorder, rightBorder, bottomBorder);
                            NinePatchDrawable.GlobalBorderInfoCache.set(image.src, ninePatchBorderInfo);
                            //parse border finish, notify load finish.
                            super.onLoad();
                        });
                    });
                });
            });
        }


        draw(canvas:Canvas):void {
            if(!this.mNinePatchBorderInfo) return;
            if(!this.isImageSizeEmpty()){
                this.drawNinePatch(canvas);
            }
        }

        private drawNinePatch(canvas:Canvas):void {
            let imageWidth = this.mImageWidth;
            let imageHeight = this.mImageHeight;
            if(imageHeight<=0 || imageWidth<=0) return;
            let image = this.mState.mImage;
            let bound = this.getBounds();

            let staticWidthSum = this.mNinePatchBorderInfo.getHorizontalStaticLengthSum();
            let staticHeightSum = this.mNinePatchBorderInfo.getVerticalStaticLengthSum();
            let extraWidth = bound.width() - staticWidthSum;
            let extraHeight = bound.height() - staticHeightSum;
            let staticWidthPartScale = extraWidth>=0 ? 1 : bound.width()/staticWidthSum;
            let staticHeightPartScale = extraHeight>=0 ? 1 : bound.height()/staticHeightSum;
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
                    let dstHeight;
                    if(isScalePart){
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

        }


        getPadding(padding:android.graphics.Rect):boolean {
            let info = this.mNinePatchBorderInfo;
            if(!info) return false;
            padding.set(info.getPaddingLeft(), info.getPaddingTop(), info.getPaddingRight(), info.getPaddingBottom());
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
            tmpLength = 0;

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
/**
 * Created by linfaxin on 15/11/7.
 */
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/widget/ImageView.ts"/>
///<reference path="HtmlBaseView.ts"/>

module androidui.widget{
    import View = android.view.View;
    import MeasureSpec = View.MeasureSpec;
    import AttrBinder = androidui.attr.AttrBinder;

    /**
     * use a img element draw Image. It's better to use {@see ImageView} draw image on Canvas.
     */
    export class HtmlImageView extends HtmlBaseView {
        private mScaleType:android.widget.ImageView.ScaleType;
        private mHaveFrame = false;
        private mAdjustViewBounds = false;
        private mMaxWidth = Number.MAX_SAFE_INTEGER;
        private mMaxHeight = Number.MAX_SAFE_INTEGER;

        private mAlpha = 255;

        private mDrawableWidth:number = 0;
        private mDrawableHeight:number = 0;
        private mAdjustViewBoundsCompat = false;

        private mImgElement:HTMLImageElement;

        constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle?:Map<string, string>) {
            super(context, bindElement, defStyle);
            this.initImageView();

            const a = context.obtainStyledAttributes(bindElement, defStyle);
            const src = a.getString('src');
            if (src) {
                this.setImageURI(src);
            }
            this.setAdjustViewBounds(a.getBoolean('adjustViewBounds', false));
            this.setMaxWidth(a.getDimensionPixelSize('maxWidth', this.mMaxWidth));
            this.setMaxHeight(a.getDimensionPixelSize('maxHeight', this.mMaxHeight));
            this.setScaleType(android.widget.ImageView.parseScaleType(a.getAttrValue('scaleType'), this.mScaleType));
            this.setImageAlpha(a.getInt('drawableAlpha', this.mAlpha));
        }

        protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
            return super.createClassAttrBinder().set('src', {
                setter(v:HtmlImageView, value:any, attrBinder:AttrBinder) {
                    v.setImageURI(value);
                }, getter(v:HtmlImageView) {
                    return v.mImgElement.src;
                }
            }).set('adjustViewBounds', {
                setter(v:HtmlImageView, value:any, attrBinder:AttrBinder) {
                    v.setAdjustViewBounds(attrBinder.parseBoolean(value, false));
                }, getter(v:HtmlImageView) {
                    return v.getAdjustViewBounds();
                }
            }).set('maxWidth', {
                setter(v:HtmlImageView, value:any, attrBinder:AttrBinder) {
                    v.setMaxWidth(attrBinder.parseNumberPixelSize(value, v.mMaxWidth));
                }, getter(v:HtmlImageView) {
                    return v.mMaxWidth;
                }
            }).set('maxHeight', {
                setter(v:HtmlImageView, value:any, attrBinder:AttrBinder) {
                    v.setMaxHeight(attrBinder.parseNumberPixelSize(value, v.mMaxHeight));
                }, getter(v:HtmlImageView) {
                    return v.mMaxHeight;
                }
            }).set('scaleType', {
                setter(v:HtmlImageView, value:any, attrBinder:AttrBinder) {
                    if (typeof value === 'number') {
                        v.setScaleType(value);
                    } else {
                        v.setScaleType(android.widget.ImageView.parseScaleType(value, v.mScaleType));
                    }
                }, getter(v:HtmlImageView) {
                    return v.mScaleType;
                }
            }).set('drawableAlpha', {
                setter(v: HtmlImageView, value: any, attrBinder:AttrBinder) {
                    v.setImageAlpha(attrBinder.parseInt(value, v.mAlpha));
                }, getter(v: HtmlImageView) {
                    return v.mAlpha;
                }
            });
        }

        private initImageView(){
            this.mScaleType  = android.widget.ImageView.ScaleType.FIT_CENTER;

            this.mImgElement = document.createElement('img');
            this.mImgElement.style.position = "absolute";

            this.mImgElement.onload = (()=>{
                this.mImgElement.style.left = 0+'px';
                this.mImgElement.style.top = 0+'px';
                this.mImgElement.style.width = '';
                this.mImgElement.style.height = '';
                this.mDrawableWidth = this.mImgElement.width;
                this.mDrawableHeight = this.mImgElement.height;
                this.mImgElement.style.display = 'none';
                this.mImgElement.style.opacity = '';
                this.requestLayout();
            });

            this.bindElement.appendChild(this.mImgElement);
        }

        getAdjustViewBounds():boolean {
            return this.mAdjustViewBounds;
        }

        setAdjustViewBounds(adjustViewBounds:boolean) {
            this.mAdjustViewBounds = adjustViewBounds;
            if (adjustViewBounds) {
                this.setScaleType(android.widget.ImageView.ScaleType.FIT_CENTER);
            }
        }

        getMaxWidth():number {
            return this.mMaxWidth;
        }
        setMaxWidth(maxWidth:number) {
            this.mMaxWidth = maxWidth;
        }
        getMaxHeight():number {
            return this.mMaxHeight;
        }
        setMaxHeight(maxHeight:number) {
            this.mMaxHeight = maxHeight;
        }
        setImageURI(uri:string){
            this.mDrawableWidth = -1;
            this.mDrawableHeight = -1;
            this.mImgElement.style.opacity = '0';
            this.mImgElement.src = uri;
        }
        setScaleType(scaleType:android.widget.ImageView.ScaleType) {
            if (scaleType == null) {
                throw new Error('NullPointerException');
            }

            if (this.mScaleType != scaleType) {
                this.mScaleType = scaleType;

                this.setWillNotCacheDrawing(scaleType == android.widget.ImageView.ScaleType.CENTER);

                this.requestLayout();
                this.invalidate();
            }
        }

        getScaleType():android.widget.ImageView.ScaleType {
            return this.mScaleType;
        }


        protected onMeasure(widthMeasureSpec, heightMeasureSpec):void {
            let w:number;
            let h:number;

            // Desired aspect ratio of the view's contents (not including padding)
            let desiredAspect = 0.0;

            // We are allowed to change the view's width
            let resizeWidth = false;

            // We are allowed to change the view's height
            let resizeHeight = false;

            const widthSpecMode = MeasureSpec.getMode(widthMeasureSpec);
            const heightSpecMode = MeasureSpec.getMode(heightMeasureSpec);

            if(!this.mImgElement.src || !this.mImgElement.complete){
                // If no drawable, its intrinsic size is 0.
                this.mDrawableWidth = -1;
                this.mDrawableHeight = -1;
                w = h = 0;
            }else{
                w = this.mDrawableWidth;
                h = this.mDrawableHeight;
                if (w <= 0) w = 1;
                if (h <= 0) h = 1;

                // We are supposed to adjust view bounds to match the aspect
                // ratio of our drawable. See if that is possible.
                if (this.mAdjustViewBounds) {
                    resizeWidth = widthSpecMode != MeasureSpec.EXACTLY;
                    resizeHeight = heightSpecMode != MeasureSpec.EXACTLY;

                    desiredAspect = w / h;
                }
            }

            let pleft = this.mPaddingLeft;
            let pright = this.mPaddingRight;
            let ptop = this.mPaddingTop;
            let pbottom = this.mPaddingBottom;

            let widthSize:number;
            let heightSize:number;

            if (resizeWidth || resizeHeight) {
                /* If we get here, it means we want to resize to match the
                 drawables aspect ratio, and we have the freedom to change at
                 least one dimension.
                 */

                // Get the max possible width given our constraints
                widthSize = this.resolveAdjustedSize(w + pleft + pright, this.mMaxWidth, widthMeasureSpec);

                // Get the max possible height given our constraints
                heightSize = this.resolveAdjustedSize(h + ptop + pbottom, this.mMaxHeight, heightMeasureSpec);

                if (desiredAspect != 0) {
                    // See what our actual aspect ratio is
                    let actualAspect = (widthSize - pleft - pright) / (heightSize - ptop - pbottom);

                    if (Math.abs(actualAspect - desiredAspect) > 0.0000001) {

                        let done = false;

                        // Try adjusting width to be proportional to height
                        if (resizeWidth) {
                            let newWidth = Math.floor(desiredAspect * (heightSize - ptop - pbottom)) +
                                pleft + pright;

                            // Allow the width to outgrow its original estimate if height is fixed.
                            if (!resizeHeight && !this.mAdjustViewBoundsCompat) {
                                widthSize = this.resolveAdjustedSize(newWidth, this.mMaxWidth, widthMeasureSpec);
                            }

                            if (newWidth <= widthSize) {
                                widthSize = newWidth;
                                done = true;
                            }
                        }

                        // Try adjusting height to be proportional to width
                        if (!done && resizeHeight) {
                            let newHeight = Math.floor((widthSize - pleft - pright) / desiredAspect) +
                                ptop + pbottom;

                            // Allow the height to outgrow its original estimate if width is fixed.
                            if (!resizeWidth && !this.mAdjustViewBoundsCompat) {
                                heightSize = this.resolveAdjustedSize(newHeight, this.mMaxHeight,
                                    heightMeasureSpec);
                            }

                            if (newHeight <= heightSize) {
                                heightSize = newHeight;
                            }
                        }
                    }
                }
            } else {
                /* We are either don't want to preserve the drawables aspect ratio,
                 or we are not allowed to change view dimensions. Just measure in
                 the normal way.
                 */
                w += pleft + pright;
                h += ptop + pbottom;

                w = Math.max(w, this.getSuggestedMinimumWidth());
                h = Math.max(h, this.getSuggestedMinimumHeight());

                widthSize = HtmlImageView.resolveSizeAndState(w, widthMeasureSpec, 0);
                heightSize = HtmlImageView.resolveSizeAndState(h, heightMeasureSpec, 0);
            }

            this.setMeasuredDimension(widthSize, heightSize);
        }

        private resolveAdjustedSize(desiredSize:number, maxSize:number, measureSpec:number):number {
            let result = desiredSize;
            let specMode = MeasureSpec.getMode(measureSpec);
            let specSize =  MeasureSpec.getSize(measureSpec);
            switch (specMode) {
                case MeasureSpec.UNSPECIFIED:
                    /* Parent says we can be as big as we want. Just don't be larger
                     than max size imposed on ourselves.
                     */
                    result = Math.min(desiredSize, maxSize);
                    break;
                case MeasureSpec.AT_MOST:
                    // Parent says we can be as big as we want, up to specSize.
                    // Don't be larger than specSize, and don't be larger than
                    // the max size imposed on ourselves.
                    result = Math.min(Math.min(desiredSize, specSize), maxSize);
                    break;
                case MeasureSpec.EXACTLY:
                    // No choice. Do what we are told.
                    result = specSize;
                    break;
            }
            return result;
        }

        protected setFrame(left:number, top:number, right:number, bottom:number):boolean {
            let changed = super.setFrame(left, top, right, bottom);
            this.mHaveFrame = true;
            this.configureBounds();
            this.mImgElement.style.display = '';
            return changed;
        }

        private configureBounds() {

            let dwidth = this.mDrawableWidth;
            let dheight = this.mDrawableHeight;

            let vwidth = this.getWidth() - this.mPaddingLeft - this.mPaddingRight;
            let vheight = this.getHeight() - this.mPaddingTop - this.mPaddingBottom;

            let fits = (dwidth < 0 || vwidth == dwidth) && (dheight < 0 || vheight == dheight);

            this.mImgElement.style.left = 0+'px';
            this.mImgElement.style.top = 0+'px';
            this.mImgElement.style.width = '';
            this.mImgElement.style.height = '';
            if (dwidth <= 0 || dheight <= 0) {
                /* If the drawable has no intrinsic size, or we're told to
                 scaletofit, then we just fill our entire view.
                 */
                return;
            }
            if(this.mScaleType === android.widget.ImageView.ScaleType.FIT_XY){
                this.mImgElement.style.width = vwidth+'px';
                this.mImgElement.style.height = vheight+'px';
                return;
            }
            // We need to do the scaling ourself, so have the drawable
            // use its native size.
            this.mImgElement.style.width = dwidth+'px';
            this.mImgElement.style.height = dheight+'px';

            if (android.widget.ImageView.ScaleType.MATRIX === this.mScaleType) {
                //nothing : MATRIX is not support

            }else if (fits) {
                // The bitmap fits exactly, no transform needed.

            } else if (android.widget.ImageView.ScaleType.CENTER === this.mScaleType) {
                // Center bitmap in view, no scaling.
                let left = Math.round((vwidth - dwidth) * 0.5);
                let top = Math.round((vheight - dheight) * 0.5);
                this.mImgElement.style.left = left+'px';
                this.mImgElement.style.top = top+'px';

            } else if (android.widget.ImageView.ScaleType.CENTER_CROP === this.mScaleType) {

                let scale;
                let dx = 0, dy = 0;

                if (dwidth * vheight > vwidth * dheight) {
                    scale = vheight / dheight;
                    dx = (vwidth - dwidth * scale) * 0.5;
                    this.mImgElement.style.width = 'auto';
                    this.mImgElement.style.height = vheight+'px';
                    this.mImgElement.style.left = Math.round(dx)+'px';
                    this.mImgElement.style.top = '0px';
                } else {
                    scale = vwidth / dwidth;
                    dy = (vheight - dheight * scale) * 0.5;
                    this.mImgElement.style.width = vwidth+'px';
                    this.mImgElement.style.height = 'auto';
                    this.mImgElement.style.left = '0px';
                    this.mImgElement.style.top = Math.round(dy)+'px';
                }

            } else if (android.widget.ImageView.ScaleType.CENTER_INSIDE === this.mScaleType) {
                let scale = 1;
                if (dwidth <= vwidth && dheight <= vheight) {
                    //small nothing
                } else {
                    let wScale = vwidth / dwidth;
                    let hScale = vheight / dheight;
                    if(wScale < hScale){
                        this.mImgElement.style.width = vwidth+'px';
                        this.mImgElement.style.height = 'auto';
                    }else{
                        this.mImgElement.style.width = 'auto';
                        this.mImgElement.style.height = vheight+'px';
                    }
                    scale = Math.min(wScale, hScale);
                }
                let dx = Math.round((vwidth - dwidth * scale) * 0.5);
                let dy = Math.round((vheight - dheight * scale) * 0.5);
                this.mImgElement.style.left = dx + 'px';
                this.mImgElement.style.top = dy+'px';


            } else {

                let wScale = vwidth / dwidth;
                let hScale = vheight / dheight;
                if(wScale < hScale){
                    this.mImgElement.style.width = vwidth+'px';
                    this.mImgElement.style.height = 'auto';
                }else{
                    this.mImgElement.style.width = 'auto';
                    this.mImgElement.style.height = vheight+'px';
                }
                let scale = Math.min(wScale, hScale);
                if (android.widget.ImageView.ScaleType.FIT_CENTER === this.mScaleType) {
                    let dx = Math.round((vwidth - dwidth * scale) * 0.5);
                    let dy = Math.round((vheight - dheight * scale) * 0.5);
                    this.mImgElement.style.left = dx + 'px';
                    this.mImgElement.style.top = dy+'px';

                }else if (android.widget.ImageView.ScaleType.FIT_END === this.mScaleType) {
                    let dx = Math.round((vwidth - dwidth * scale));
                    let dy = Math.round((vheight - dheight * scale));
                    this.mImgElement.style.left = dx + 'px';
                    this.mImgElement.style.top = dy+'px';

                }else if (android.widget.ImageView.ScaleType.FIT_START === this.mScaleType) {
                    //default is fit start
                }

            }
        }

        getImageAlpha():number {
            return this.mAlpha;
        }
        setImageAlpha(alpha:number) {
            this.setAlpha(alpha);
        }

    }

}
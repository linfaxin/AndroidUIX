/*
 * Copyright (C) 2006 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

///<reference path="../../android/content/res/Resources.ts"/>
///<reference path="../../android/graphics/Canvas.ts"/>
///<reference path="../../android/graphics/Matrix.ts"/>
///<reference path="../../android/graphics/RectF.ts"/>
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/text/TextUtils.ts"/>
///<reference path="../../android/util/Log.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../java/lang/Integer.ts"/>
///<reference path="../../java/lang/System.ts"/>
///<reference path="../../androidui/image/NetDrawable.ts"/>

module android.widget {
import Resources = android.content.res.Resources;
import Canvas = android.graphics.Canvas;
import Matrix = android.graphics.Matrix;
import RectF = android.graphics.RectF;
import Drawable = android.graphics.drawable.Drawable;
import TextUtils = android.text.TextUtils;
import Log = android.util.Log;
import View = android.view.View;
import Integer = java.lang.Integer;
import System = java.lang.System;
import NetDrawable = androidui.image.NetDrawable;
import LayoutParams = android.view.ViewGroup.LayoutParams;
    import AttrBinder = androidui.attr.AttrBinder;
    
/**
 * Displays an arbitrary image, such as an icon.  The ImageView class
 * can load images from various sources (such as resources or content
 * providers), takes care of computing its measurement from the image so that
 * it can be used in any layout manager, and provides various display options
 * such as scaling and tinting.
 *
 * @attr ref android.R.styleable#ImageView_adjustViewBounds
 * @attr ref android.R.styleable#ImageView_src
 * @attr ref android.R.styleable#ImageView_maxWidth
 * @attr ref android.R.styleable#ImageView_maxHeight
 * @attr ref android.R.styleable#ImageView_tint
 * @attr ref android.R.styleable#ImageView_scaleType
 * @attr ref android.R.styleable#ImageView_cropToPadding
 */
export class ImageView extends View {

    // settable by the client
    private mUri:string;

    //private mResource:number = 0;

    private mMatrix:Matrix;

    private mScaleType:ImageView.ScaleType;

    private mHaveFrame:boolean = false;

    private mAdjustViewBounds:boolean = false;

    private mMaxWidth:number = Integer.MAX_VALUE;

    private mMaxHeight:number = Integer.MAX_VALUE;

    //// these are applied to the drawable
    //private mColorFilter:ColorFilter;
    //
    //private mXfermode:Xfermode;

    private mAlpha:number = 255;

    private mViewAlphaScale:number = 256;

    private mColorMod:boolean = false;

    private mDrawable:Drawable = null;

    private mState:number[] = null;

    private mMergeState:boolean = false;

    private mLevel:number = 0;

    private mDrawableWidth:number = 0;

    private mDrawableHeight:number = 0;

    private mDrawMatrix:Matrix = null;

    // Avoid allocations...
    private mTempSrc:RectF = new RectF();

    private mTempDst:RectF = new RectF();

    private mCropToPadding:boolean;

    private mBaseline:number = -1;

    private mBaselineAlignBottom:boolean = false;

    // AdjustViewBounds behavior will be in compatibility mode for older apps.
    private mAdjustViewBoundsCompat:boolean = false;

    //private static sScaleTypeArray:ImageView.ScaleType[] = [ ImageView.ScaleType.MATRIX, ImageView.ScaleType.FIT_XY,
    //    ImageView.ScaleType.FIT_START, ImageView.ScaleType.FIT_CENTER, ImageView.ScaleType.FIT_END, ImageView.ScaleType.CENTER,
    //    ImageView.ScaleType.CENTER_CROP, ImageView.ScaleType.CENTER_INSIDE ];

    constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle?:Map<string, string>){
        super(context, bindElement, defStyle);
        this.initImageView();

        let a = context.obtainStyledAttributes(bindElement, defStyle);
        let d = a.getDrawable('src');
        if (d != null) {
            this.setImageDrawable(d);
        }

        this.mBaselineAlignBottom = a.getBoolean('baselineAlignBottom', false);

        this.mBaseline = a.getDimensionPixelSize('baseline', -1);

        this.setAdjustViewBounds(a.getBoolean('adjustViewBounds', false));

        this.setMaxWidth(a.getDimensionPixelSize('maxWidth', Integer.MAX_VALUE));

        this.setMaxHeight(a.getDimensionPixelSize('maxHeight', Integer.MAX_VALUE));

        let scaleType = ImageView.parseScaleType(a.getString('scaleType'), null);
        if (scaleType != null) {
            this.setScaleType(scaleType);
        }

        // AndroidUI ignore: not support now.
        // let tint = a.getInt('tint', 0);
        // if (tint != 0) {
        //     this.setColorFilter(tint);
        // }

        let alpha = a.getInt('drawableAlpha', 255);
        if (alpha != 255) {
            this.setAlpha(alpha);
        }

        this.mCropToPadding = a.getBoolean('cropToPadding', false);

        a.recycle();

        //need inflate syntax/reader for matrix
    }

    protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
        return super.createClassAttrBinder()
            .set('src', {
                setter(v: ImageView, value: any, attrBinder:AttrBinder) {
                    let d = attrBinder.parseDrawable(value);
                    if (d) v.setImageDrawable(d);
                    else v.setImageURI(value);
                }, getter(v: ImageView) {
                    return v.mDrawable;
                }
            }).set('baselineAlignBottom', {
                setter(v: ImageView, value: any, attrBinder:AttrBinder) {
                    v.setBaselineAlignBottom(attrBinder.parseBoolean(value, v.mBaselineAlignBottom));
                }, getter(v: ImageView) {
                    return v.getBaselineAlignBottom();
                }
            }).set('baseline', {
                setter(v: ImageView, value: any, attrBinder:AttrBinder) {
                    v.setBaseline(attrBinder.parseNumberPixelSize(value, v.mBaseline));
                }, getter(v: ImageView) {
                    return v.mBaseline;
                }
            }).set('adjustViewBounds', {
                setter(v: ImageView, value: any, attrBinder:AttrBinder) {
                    v.setAdjustViewBounds(attrBinder.parseBoolean(value, false));
                }, getter(v: ImageView) {
                    return v.getAdjustViewBounds();
                }
            }).set('maxWidth', {
                setter(v: ImageView, value: any, attrBinder:AttrBinder) {
                    let baseValue = v.getParent() instanceof View ? (<View><any>v.getParent()).getWidth() : 0;
                    v.setMaxWidth(attrBinder.parseNumberPixelSize(value, v.mMaxWidth, baseValue));
                }, getter(v: ImageView) {
                    return v.mMaxWidth;
                }
            }).set('maxHeight', {
                setter(v: ImageView, value: any, attrBinder:AttrBinder) {
                    let baseValue = v.getParent() instanceof View ? (<View><any>v.getParent()).getHeight() : 0;
                    v.setMaxHeight(attrBinder.parseNumberPixelSize(value, v.mMaxHeight, baseValue));
                }, getter(v: ImageView) {
                    return v.mMaxHeight;
                }
            }).set('scaleType', {
                setter(v: ImageView, value: any, attrBinder:AttrBinder) {
                    if (typeof value === 'number') {
                        v.setScaleType(value);
                    } else {
                        v.setScaleType(ImageView.parseScaleType(value, v.mScaleType));
                    }
                }, getter(v: ImageView) {
                    return v.mScaleType;
                }
            }).set('drawableAlpha', {
                setter(v: ImageView, value: any, attrBinder:AttrBinder) {
                    v.setImageAlpha(attrBinder.parseInt(value, v.mAlpha));
                }, getter(v: ImageView) {
                    return v.mAlpha;
                }
            }).set('cropToPadding', {
                setter(v: ImageView, value: any, attrBinder:AttrBinder) {
                    v.setCropToPadding(attrBinder.parseBoolean(value, false));
                }, getter(v: ImageView) {
                    return v.getCropToPadding();
                }
            });
    }

    private initImageView():void  {
        this.mMatrix = new Matrix();
        this.mScaleType = ImageView.ScaleType.FIT_CENTER;
        //this.mAdjustViewBoundsCompat = this.mContext.getApplicationInfo().targetSdkVersion <= Build.VERSION_CODES.JELLY_BEAN_MR1;
    }

    protected verifyDrawable(dr:Drawable):boolean  {
        return this.mDrawable == dr || super.verifyDrawable(dr);
    }

    jumpDrawablesToCurrentState():void  {
        super.jumpDrawablesToCurrentState();
        if (this.mDrawable != null)
            this.mDrawable.jumpToCurrentState();
    }

    invalidateDrawable(dr:Drawable):void  {
        if (dr == this.mDrawable) {
            /* we invalidate the whole view in this case because it's very
             * hard to know where the drawable actually is. This is made
             * complicated because of the offsets and transformations that
             * can be applied. In theory we could get the drawable's bounds
             * and run them through the transformation and offsets, but this
             * is probably not worth the effort.
             */
            this.invalidate();
        } else {
            super.invalidateDrawable(dr);
        }
    }

    drawableSizeChange(who : Drawable):void{
        if (who == this.mDrawable) {
            this.resizeFromDrawable();
        }else {
            super.drawableSizeChange(who);
        }
    }

    hasOverlappingRendering():boolean  {
        return (this.getBackground() != null && this.getBackground().getCurrent() != null);
    }

    //onPopulateAccessibilityEvent(event:AccessibilityEvent):void  {
    //    super.onPopulateAccessibilityEvent(event);
    //    let contentDescription:CharSequence = this.getContentDescription();
    //    if (!TextUtils.isEmpty(contentDescription)) {
    //        event.getText().add(contentDescription);
    //    }
    //}

    /**
     * True when ImageView is adjusting its bounds
     * to preserve the aspect ratio of its drawable
     *
     * @return whether to adjust the bounds of this view
     * to presrve the original aspect ratio of the drawable
     *
     * @see #setAdjustViewBounds(boolean)
     *
     * @attr ref android.R.styleable#ImageView_adjustViewBounds
     */
    getAdjustViewBounds():boolean  {
        return this.mAdjustViewBounds;
    }

    /**
     * Set this to true if you want the ImageView to adjust its bounds
     * to preserve the aspect ratio of its drawable.
     *
     * <p><strong>Note:</strong> If the application targets API level 17 or lower,
     * adjustViewBounds will allow the drawable to shrink the view bounds, but not grow
     * to fill available measured space in all cases. This is for compatibility with
     * legacy {@link android.view.View.MeasureSpec MeasureSpec} and
     * {@link android.widget.RelativeLayout RelativeLayout} behavior.</p>
     *
     * @param adjustViewBounds Whether to adjust the bounds of this view
     * to preserve the original aspect ratio of the drawable.
     * 
     * @see #getAdjustViewBounds()
     *
     * @attr ref android.R.styleable#ImageView_adjustViewBounds
     */
    setAdjustViewBounds(adjustViewBounds:boolean):void  {
        this.mAdjustViewBounds = adjustViewBounds;
        if (adjustViewBounds) {
            this.setScaleType(ImageView.ScaleType.FIT_CENTER);
        }
    }

    /**
     * The maximum width of this view.
     *
     * @return The maximum width of this view
     *
     * @see #setMaxWidth(int)
     *
     * @attr ref android.R.styleable#ImageView_maxWidth
     */
    getMaxWidth():number  {
        return this.mMaxWidth;
    }

    /**
     * An optional argument to supply a maximum width for this view. Only valid if
     * {@link #setAdjustViewBounds(boolean)} has been set to true. To set an image to be a maximum
     * of 100 x 100 while preserving the original aspect ratio, do the following: 1) set
     * adjustViewBounds to true 2) set maxWidth and maxHeight to 100 3) set the height and width
     * layout params to WRAP_CONTENT.
     * 
     * <p>
     * Note that this view could be still smaller than 100 x 100 using this approach if the original
     * image is small. To set an image to a fixed size, specify that size in the layout params and
     * then use {@link #setScaleType(android.widget.ImageView.ScaleType)} to determine how to fit
     * the image within the bounds.
     * </p>
     * 
     * @param maxWidth maximum width for this view
     *
     * @see #getMaxWidth()
     *
     * @attr ref android.R.styleable#ImageView_maxWidth
     */
    setMaxWidth(maxWidth:number):void  {
        this.mMaxWidth = maxWidth;
    }

    /**
     * The maximum height of this view.
     *
     * @return The maximum height of this view
     *
     * @see #setMaxHeight(int)
     *
     * @attr ref android.R.styleable#ImageView_maxHeight
     */
    getMaxHeight():number  {
        return this.mMaxHeight;
    }

    /**
     * An optional argument to supply a maximum height for this view. Only valid if
     * {@link #setAdjustViewBounds(boolean)} has been set to true. To set an image to be a
     * maximum of 100 x 100 while preserving the original aspect ratio, do the following: 1) set
     * adjustViewBounds to true 2) set maxWidth and maxHeight to 100 3) set the height and width
     * layout params to WRAP_CONTENT.
     * 
     * <p>
     * Note that this view could be still smaller than 100 x 100 using this approach if the original
     * image is small. To set an image to a fixed size, specify that size in the layout params and
     * then use {@link #setScaleType(android.widget.ImageView.ScaleType)} to determine how to fit
     * the image within the bounds.
     * </p>
     * 
     * @param maxHeight maximum height for this view
     *
     * @see #getMaxHeight()
     *
     * @attr ref android.R.styleable#ImageView_maxHeight
     */
    setMaxHeight(maxHeight:number):void  {
        this.mMaxHeight = maxHeight;
    }

    /** Return the view's drawable, or null if no drawable has been
        assigned.
    */
    getDrawable():Drawable  {
        return this.mDrawable;
    }

    ///**
    // * Sets a drawable as the content of this ImageView.
    // *
    // * <p class="note">This does Bitmap reading and decoding on the UI
    // * thread, which can cause a latency hiccup.  If that's a concern,
    // * consider using {@link #setImageDrawable(android.graphics.drawable.Drawable)} or
    // * {@link #setImageBitmap(android.graphics.Bitmap)} and
    // * {@link android.graphics.BitmapFactory} instead.</p>
    // *
    // * @param resId the resource identifier of the drawable
    // *
    // * @attr ref android.R.styleable#ImageView_src
    // */
    //setImageResource(resId:number):void  {
    //    if (this.mUri != null || this.mResource != resId) {
    //        this.updateDrawable(null);
    //        this.mResource = resId;
    //        this.mUri = null;
    //        const oldWidth:number = this.mDrawableWidth;
    //        const oldHeight:number = this.mDrawableHeight;
    //        this.resolveUri();
    //        if (oldWidth != this.mDrawableWidth || oldHeight != this.mDrawableHeight) {
    //            this.requestLayout();
    //        }
    //        this.invalidate();
    //    }
    //}

    /**
     * Sets the content of this ImageView to the specified Uri.
     *
     // * <p class="note">This does Bitmap reading and decoding on the UI
     // * thread, which can cause a latency hiccup.  If that's a concern,
     // * consider using {@link #setImageDrawable(android.graphics.drawable.Drawable)} or
     // * {@link #setImageBitmap(android.graphics.Bitmap)} and
     // * {@link android.graphics.BitmapFactory} instead.</p>
     //
     * AndroidUI note: suggest to load net image use this method
     *
     * @param uri The Uri of an image
     */
    setImageURI(uri:string):void  {
        //if (this.mResource != 0 || (this.mUri != uri && (uri == null || this.mUri == null || !uri.equals(this.mUri)))) {
        if (this.mUri != uri) {
            if(this.mDrawable instanceof NetDrawable){//use same obj to load image
                this.mUri = uri;
                (<NetDrawable>this.mDrawable).setURL(uri);
                this.invalidate();

            }else {
                this.updateDrawable(null);
                //this.mResource = 0;
                this.mUri = uri;
                const oldWidth:number = this.mDrawableWidth;
                const oldHeight:number = this.mDrawableHeight;
                this.resolveUri();
                if (oldWidth != this.mDrawableWidth || oldHeight != this.mDrawableHeight) {
                    this.requestLayout();
                }
                this.invalidate();
            }
        }
    }

    /**
     * Sets a drawable as the content of this ImageView.
     * 
     * @param drawable The drawable to set
     */
    setImageDrawable(drawable:Drawable):void  {
        if (this.mDrawable != drawable) {
            //this.mResource = 0;
            this.mUri = null;
            const oldWidth:number = this.mDrawableWidth;
            const oldHeight:number = this.mDrawableHeight;
            this.updateDrawable(drawable);
            if (oldWidth != this.mDrawableWidth || oldHeight != this.mDrawableHeight) {
                this.requestLayout();
            }
            this.invalidate();
        }
    }

    ///**
    // * Sets a Bitmap as the content of this ImageView.
    // *
    // * @param bm The bitmap to set
    // */
    //setImageBitmap(bm:Bitmap):void  {
    //    // if this is used frequently, may handle bitmaps explicitly
    //    // to reduce the intermediate drawable object
    //    this.setImageDrawable(new BitmapDrawable(this.mContext.getResources(), bm));
    //}

    setImageState(state:number[], merge:boolean):void  {
        this.mState = state;
        this.mMergeState = merge;
        if (this.mDrawable != null) {
            this.refreshDrawableState();
            this.resizeFromDrawable();
        }
    }

    setSelected(selected:boolean):void  {
        super.setSelected(selected);
        this.resizeFromDrawable();
    }

    /**
     * Sets the image level, when it is constructed from a 
     * {@link android.graphics.drawable.LevelListDrawable}.
     *
     * @param level The new level for the image.
     */
    setImageLevel(level:number):void  {
        this.mLevel = level;
        if (this.mDrawable != null) {
            this.mDrawable.setLevel(level);
            this.resizeFromDrawable();
        }
    }



    /**
     * Controls how the image should be resized or moved to match the size
     * of this ImageView.
     * 
     * @param scaleType The desired scaling mode.
     * 
     * @attr ref android.R.styleable#ImageView_scaleType
     */
    setScaleType(scaleType:ImageView.ScaleType):void  {
        if (scaleType == null) {
            throw Error(`new NullPointerException()`);
        }
        if (this.mScaleType != scaleType) {
            this.mScaleType = scaleType;
            this.setWillNotCacheDrawing(this.mScaleType == ImageView.ScaleType.CENTER);
            this.requestLayout();
            this.invalidate();
        }
    }

    /**
     * Return the current scale type in use by this ImageView.
     *
     * @see ImageView.ScaleType
     *
     * @attr ref android.R.styleable#ImageView_scaleType
     */
    getScaleType():ImageView.ScaleType  {
        return this.mScaleType;
    }

    /** Return the view's optional matrix. This is applied to the
        view's drawable when it is drawn. If there is not matrix,
        this method will return an identity matrix.
        Do not change this matrix in place but make a copy.
        If you want a different matrix applied to the drawable,
        be sure to call setImageMatrix().
    */
    getImageMatrix():Matrix  {
        if (this.mDrawMatrix == null) {
            return new Matrix(Matrix.IDENTITY_MATRIX);
        }
        return this.mDrawMatrix;
    }

    setImageMatrix(matrix:Matrix):void  {
        // collaps null and identity to just null
        if (matrix != null && matrix.isIdentity()) {
            matrix = null;
        }
        // don't invalidate unless we're actually changing our matrix
        if (matrix == null && !this.mMatrix.isIdentity() || matrix != null && !this.mMatrix.equals(matrix)) {
            this.mMatrix.set(matrix);
            this.configureBounds();
            this.invalidate();
        }
    }

    /**
     * Return whether this ImageView crops to padding.
     *
     * @return whether this ImageView crops to padding
     *
     * @see #setCropToPadding(boolean)
     *
     * @attr ref android.R.styleable#ImageView_cropToPadding
     */
    getCropToPadding():boolean  {
        return this.mCropToPadding;
    }

    /**
     * Sets whether this ImageView will crop to padding.
     *
     * @param cropToPadding whether this ImageView will crop to padding
     *
     * @see #getCropToPadding()
     *
     * @attr ref android.R.styleable#ImageView_cropToPadding
     */
    setCropToPadding(cropToPadding:boolean):void  {
        if (this.mCropToPadding != cropToPadding) {
            this.mCropToPadding = cropToPadding;
            this.requestLayout();
            this.invalidate();
        }
    }

    private resolveUri():void  {
        if (this.mDrawable != null) {
            return;
        }
        let d:Drawable = null;
        if (this.mUri != null) {
            d = new androidui.image.NetDrawable(this.mUri);
        } else {
            return;
        }
        this.updateDrawable(d);
    }

    onCreateDrawableState(extraSpace:number):number[]  {
        if (this.mState == null) {
            return super.onCreateDrawableState(extraSpace);
        } else if (!this.mMergeState) {
            return this.mState;
        } else {
            return ImageView.mergeDrawableStates(super.onCreateDrawableState(extraSpace + this.mState.length), this.mState);
        }
    }

    private updateDrawable(d:Drawable):void  {
        if (this.mDrawable != null) {
            this.mDrawable.setCallback(null);
            this.unscheduleDrawable(this.mDrawable);
        }
        this.mDrawable = d;
        if (d != null) {
            d.setCallback(this);
            if (d.isStateful()) {
                d.setState(this.getDrawableState());
            }
            d.setLevel(this.mLevel);
            //d.setLayoutDirection(this.getLayoutDirection());
            d.setVisible(this.getVisibility() == ImageView.VISIBLE, true);
            this.mDrawableWidth = d.getIntrinsicWidth();
            this.mDrawableHeight = d.getIntrinsicHeight();
            this.applyColorMod();
            this.configureBounds();
        } else {
            this.mDrawableWidth = this.mDrawableHeight = -1;
        }
    }

    protected resizeFromDrawable():boolean  {
        let d:Drawable = this.mDrawable;
        if (d != null) {
            let w:number = d.getIntrinsicWidth();
            if (w < 0) w = this.mDrawableWidth;
            let h:number = d.getIntrinsicHeight();
            if (h < 0) h = this.mDrawableHeight;
            if (w != this.mDrawableWidth || h != this.mDrawableHeight) {
                this.mDrawableWidth = w;
                this.mDrawableHeight = h;

                if (this.mLayoutParams!=null
                    && this.mLayoutParams.width != LayoutParams.WRAP_CONTENT && this.mLayoutParams.width != LayoutParams.MATCH_PARENT
                    && this.mLayoutParams.height != LayoutParams.WRAP_CONTENT && this.mLayoutParams.height != LayoutParams.MATCH_PARENT) {
                    // In a fixed-size view, no need requestLayout.
                    this.configureBounds();

                } else {
                    this.requestLayout();
                }
                this.invalidate();
                return true;
            }
        }
        return false;
    }

    //onRtlPropertiesChanged(layoutDirection:number):void  {
    //    super.onRtlPropertiesChanged(layoutDirection);
    //    if (this.mDrawable != null) {
    //        this.mDrawable.setLayoutDirection(layoutDirection);
    //    }
    //}

    private static sS2FArray:Matrix.ScaleToFit[] = [ Matrix.ScaleToFit.FILL, Matrix.ScaleToFit.START, Matrix.ScaleToFit.CENTER, Matrix.ScaleToFit.END ];

    private static scaleTypeToScaleToFit(st:ImageView.ScaleType):Matrix.ScaleToFit  {
        // ScaleToFit enum to their corresponding Matrix.ScaleToFit values
        return ImageView.sS2FArray[st - 1];
    }

    protected onMeasure(widthMeasureSpec:number, heightMeasureSpec:number):void  {
        this.resolveUri();
        let w:number;
        let h:number;
        // Desired aspect ratio of the view's contents (not including padding)
        let desiredAspect:number = 0.0;
        // We are allowed to change the view's width
        let resizeWidth:boolean = false;
        // We are allowed to change the view's height
        let resizeHeight:boolean = false;
        const widthSpecMode:number = View.MeasureSpec.getMode(widthMeasureSpec);
        const heightSpecMode:number = View.MeasureSpec.getMode(heightMeasureSpec);
        if (this.mDrawable == null) {
            // If no drawable, its intrinsic size is 0.
            this.mDrawableWidth = -1;
            this.mDrawableHeight = -1;
            w = h = 0;
        } else {
            w = this.mDrawableWidth;
            h = this.mDrawableHeight;
            if (w <= 0)
                w = 1;
            if (h <= 0)
                h = 1;
            // ratio of our drawable. See if that is possible.
            if (this.mAdjustViewBounds) {
                resizeWidth = widthSpecMode != View.MeasureSpec.EXACTLY;
                resizeHeight = heightSpecMode != View.MeasureSpec.EXACTLY;
                desiredAspect = <number> w / <number> h;
            }
        }
        let pleft:number = this.mPaddingLeft;
        let pright:number = this.mPaddingRight;
        let ptop:number = this.mPaddingTop;
        let pbottom:number = this.mPaddingBottom;
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
            if (desiredAspect != 0.0) {
                // See what our actual aspect ratio is
                let actualAspect:number = <number> (widthSize - pleft - pright) / (heightSize - ptop - pbottom);
                if (Math.abs(actualAspect - desiredAspect) > 0.0000001) {
                    let done:boolean = false;
                    // Try adjusting width to be proportional to height
                    if (resizeWidth) {
                        let newWidth:number = Math.floor((desiredAspect * (heightSize - ptop - pbottom))) + pleft + pright;
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
                        let newHeight:number = Math.floor(((widthSize - pleft - pright) / desiredAspect)) + ptop + pbottom;
                        // Allow the height to outgrow its original estimate if width is fixed.
                        if (!resizeWidth && !this.mAdjustViewBoundsCompat) {
                            heightSize = this.resolveAdjustedSize(newHeight, this.mMaxHeight, heightMeasureSpec);
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
            widthSize = ImageView.resolveSizeAndState(w, widthMeasureSpec, 0);
            heightSize = ImageView.resolveSizeAndState(h, heightMeasureSpec, 0);
        }
        this.setMeasuredDimension(widthSize, heightSize);
    }

    private resolveAdjustedSize(desiredSize:number, maxSize:number, measureSpec:number):number  {
        let result:number = desiredSize;
        let specMode:number = View.MeasureSpec.getMode(measureSpec);
        let specSize:number = View.MeasureSpec.getSize(measureSpec);
        switch(specMode) {
            case View.MeasureSpec.UNSPECIFIED:
                /* Parent says we can be as big as we want. Just don't be larger
                   than max size imposed on ourselves.
                */
                result = Math.min(desiredSize, maxSize);
                break;
            case View.MeasureSpec.AT_MOST:
                // Parent says we can be as big as we want, up to specSize. 
                // Don't be larger than specSize, and don't be larger than 
                // the max size imposed on ourselves.
                result = Math.min(Math.min(desiredSize, specSize), maxSize);
                break;
            case View.MeasureSpec.EXACTLY:
                // No choice. Do what we are told.
                result = specSize;
                break;
        }
        return result;
    }

    protected setFrame(l:number, t:number, r:number, b:number):boolean  {
        let changed:boolean = super.setFrame(l, t, r, b);
        this.mHaveFrame = true;
        this.configureBounds();
        return changed;
    }

    private configureBounds():void  {
        if (this.mDrawable == null || !this.mHaveFrame) {
            return;
        }
        let dwidth:number = this.mDrawableWidth;
        let dheight:number = this.mDrawableHeight;
        let vwidth:number = this.getWidth() - this.mPaddingLeft - this.mPaddingRight;
        let vheight:number = this.getHeight() - this.mPaddingTop - this.mPaddingBottom;
        let fits:boolean = (dwidth < 0 || vwidth == dwidth) && (dheight < 0 || vheight == dheight);
        if (dwidth <= 0 || dheight <= 0 || ImageView.ScaleType.FIT_XY == this.mScaleType) {
            /* If the drawable has no intrinsic size, or we're told to
                scaletofit, then we just fill our entire view.
            */
            this.mDrawable.setBounds(0, 0, vwidth, vheight);
            this.mDrawMatrix = null;
        } else {
            // We need to do the scaling ourself, so have the drawable
            // use its native size.
            this.mDrawable.setBounds(0, 0, dwidth, dheight);
            if (ImageView.ScaleType.MATRIX == this.mScaleType) {
                // Use the specified matrix as-is.
                if (this.mMatrix.isIdentity()) {
                    this.mDrawMatrix = null;
                } else {
                    this.mDrawMatrix = this.mMatrix;
                }
            } else if (fits) {
                // The bitmap fits exactly, no transform needed.
                this.mDrawMatrix = null;
            } else if (ImageView.ScaleType.CENTER == this.mScaleType) {
                // Center bitmap in view, no scaling.
                this.mDrawMatrix = this.mMatrix;
                this.mDrawMatrix.setTranslate(Math.floor(((vwidth - dwidth) * 0.5 + 0.5)), Math.floor(((vheight - dheight) * 0.5 + 0.5)));
            } else if (ImageView.ScaleType.CENTER_CROP == this.mScaleType) {
                this.mDrawMatrix = this.mMatrix;
                let scale:number;
                let dx:number = 0, dy:number = 0;
                if (dwidth * vheight > vwidth * dheight) {
                    scale = <number> vheight / <number> dheight;
                    dx = (vwidth - dwidth * scale) * 0.5;
                } else {
                    scale = <number> vwidth / <number> dwidth;
                    dy = (vheight - dheight * scale) * 0.5;
                }
                this.mDrawMatrix.setScale(scale, scale);
                this.mDrawMatrix.postTranslate(Math.floor((dx + 0.5)), Math.floor((dy + 0.5)));
            } else if (ImageView.ScaleType.CENTER_INSIDE == this.mScaleType) {
                this.mDrawMatrix = this.mMatrix;
                let scale:number;
                let dx:number;
                let dy:number;
                if (dwidth <= vwidth && dheight <= vheight) {
                    scale = 1.0;
                } else {
                    scale = Math.min(<number> vwidth / <number> dwidth, <number> vheight / <number> dheight);
                }
                dx = Math.floor(((vwidth - dwidth * scale) * 0.5 + 0.5));
                dy = Math.floor(((vheight - dheight * scale) * 0.5 + 0.5));
                this.mDrawMatrix.setScale(scale, scale);
                this.mDrawMatrix.postTranslate(dx, dy);
            } else {
                // Generate the required transform.
                this.mTempSrc.set(0, 0, dwidth, dheight);
                this.mTempDst.set(0, 0, vwidth, vheight);
                this.mDrawMatrix = this.mMatrix;
                this.mDrawMatrix.setRectToRect(this.mTempSrc, this.mTempDst, ImageView.scaleTypeToScaleToFit(this.mScaleType));
            }
        }
    }

    protected drawableStateChanged():void  {
        super.drawableStateChanged();
        let d:Drawable = this.mDrawable;
        if (d != null && d.isStateful()) {
            d.setState(this.getDrawableState());
        }
    }

    protected onDraw(canvas:Canvas):void  {
        super.onDraw(canvas);
        if (this.mDrawable == null) {
            // couldn't resolve the URI
            return;
        }
        if (this.mDrawableWidth == 0 || this.mDrawableHeight == 0) {
            // nothing to draw (empty bounds)
            return;
        }
        if (this.mDrawMatrix == null && this.mPaddingTop == 0 && this.mPaddingLeft == 0) {
            this.mDrawable.draw(canvas);
        } else {
            let saveCount:number = canvas.getSaveCount();
            canvas.save();
            if (this.mCropToPadding) {
                const scrollX:number = this.mScrollX;
                const scrollY:number = this.mScrollY;
                canvas.clipRect(scrollX + this.mPaddingLeft, scrollY + this.mPaddingTop, scrollX + this.mRight - this.mLeft - this.mPaddingRight, scrollY + this.mBottom - this.mTop - this.mPaddingBottom);
            }
            canvas.translate(this.mPaddingLeft, this.mPaddingTop);
            if (this.mDrawMatrix != null) {
                canvas.concat(this.mDrawMatrix);
            }
            this.mDrawable.draw(canvas);
            canvas.restoreToCount(saveCount);
        }
    }

    /**
     * <p>Return the offset of the widget's text baseline from the widget's top
     * boundary. </p>
     *
     * @return the offset of the baseline within the widget's bounds or -1
     *         if baseline alignment is not supported.
     */
    getBaseline():number  {
        if (this.mBaselineAlignBottom) {
            return this.getMeasuredHeight();
        } else {
            return this.mBaseline;
        }
    }

    /**
     * <p>Set the offset of the widget's text baseline from the widget's top
     * boundary.  This value is overridden by the {@link #setBaselineAlignBottom(boolean)}
     * property.</p>
     *
     * @param baseline The baseline to use, or -1 if none is to be provided.
     *
     * @see #setBaseline(int) 
     * @attr ref android.R.styleable#ImageView_baseline
     */
    setBaseline(baseline:number):void  {
        if (this.mBaseline != baseline) {
            this.mBaseline = baseline;
            this.requestLayout();
        }
    }

    /**
     * Set whether to set the baseline of this view to the bottom of the view.
     * Setting this value overrides any calls to setBaseline.
     *
     * @param aligned If true, the image view will be baseline aligned with
     *      based on its bottom edge.
     *
     * @attr ref android.R.styleable#ImageView_baselineAlignBottom
     */
    setBaselineAlignBottom(aligned:boolean):void  {
        if (this.mBaselineAlignBottom != aligned) {
            this.mBaselineAlignBottom = aligned;
            this.requestLayout();
        }
    }

    /**
     * Return whether this view's baseline will be considered the bottom of the view.
     *
     * @see #setBaselineAlignBottom(boolean)
     */
    getBaselineAlignBottom():boolean  {
        return this.mBaselineAlignBottom;
    }

    ///**
    // * Set a tinting option for the image.
    // *
    // * @param color Color tint to apply.
    // * @param mode How to apply the color.  The standard mode is
    // * {@link PorterDuff.Mode#SRC_ATOP}
    // *
    // * @attr ref android.R.styleable#ImageView_tint
    // */
    //setColorFilter(color:number, mode:PorterDuff.Mode):void  {
    //    this.setColorFilter(new PorterDuffColorFilter(color, mode));
    //}
    //
    ///**
    // * Set a tinting option for the image. Assumes
    // * {@link PorterDuff.Mode#SRC_ATOP} blending mode.
    // *
    // * @param color Color tint to apply.
    // * @attr ref android.R.styleable#ImageView_tint
    // */
    //setColorFilter(color:number):void  {
    //    this.setColorFilter(color, PorterDuff.Mode.SRC_ATOP);
    //}
    //
    //clearColorFilter():void  {
    //    this.setColorFilter(null);
    //}
    //
    ///**
    // * @hide Candidate for future API inclusion
    // */
    //setXfermode(mode:Xfermode):void  {
    //    if (this.mXfermode != mode) {
    //        this.mXfermode = mode;
    //        this.mColorMod = true;
    //        this.applyColorMod();
    //        this.invalidate();
    //    }
    //}
    //
    ///**
    // * Returns the active color filter for this ImageView.
    // *
    // * @return the active color filter for this ImageView
    // *
    // * @see #setColorFilter(android.graphics.ColorFilter)
    // */
    //getColorFilter():ColorFilter  {
    //    return this.mColorFilter;
    //}
    //
    ///**
    // * Apply an arbitrary colorfilter to the image.
    // *
    // * @param cf the colorfilter to apply (may be null)
    // *
    // * @see #getColorFilter()
    // */
    //setColorFilter(cf:ColorFilter):void  {
    //    if (this.mColorFilter != cf) {
    //        this.mColorFilter = cf;
    //        this.mColorMod = true;
    //        this.applyColorMod();
    //        this.invalidate();
    //    }
    //}

    /**
     * Returns the alpha that will be applied to the drawable of this ImageView.
     *
     * @return the alpha that will be applied to the drawable of this ImageView
     *
     * @see #setImageAlpha(int)
     */
    getImageAlpha():number  {
        return this.mAlpha;
    }

    /**
     * Sets the alpha value that should be applied to the image.
     *
     * @param alpha the alpha value that should be applied to the image
     *
     * @see #getImageAlpha()
     */
    setImageAlpha(alpha:number):void  {
        // keep it legal
        alpha &= 0xFF;
        if (this.mAlpha != alpha) {
            this.mAlpha = alpha;
            this.mColorMod = true;
            this.applyColorMod();
            this.invalidate();
        }
    }

    ///**
    // * Sets the alpha value that should be applied to the image.
    // *
    // * @param alpha the alpha value that should be applied to the image
    // *
    // * @deprecated use #setImageAlpha(int) instead
    // */
    //setAlpha(alpha:number):void  {
    //    // keep it legal
    //    alpha &= 0xFF;
    //    if (this.mAlpha != alpha) {
    //        this.mAlpha = alpha;
    //        this.mColorMod = true;
    //        this.applyColorMod();
    //        this.invalidate();
    //    }
    //}

    private applyColorMod():void  {
        // re-applied if the Drawable is changed.
        if (this.mDrawable != null && this.mColorMod) {
            this.mDrawable = this.mDrawable.mutate();
            //this.mDrawable.setColorFilter(this.mColorFilter);
            //this.mDrawable.setXfermode(this.mXfermode);
            this.mDrawable.setAlpha(this.mAlpha * this.mViewAlphaScale >> 8);
        }
    }

    setVisibility(visibility:number):void  {
        super.setVisibility(visibility);
        if (this.mDrawable != null) {
            this.mDrawable.setVisible(visibility == ImageView.VISIBLE, false);
        }
    }

    protected onAttachedToWindow():void  {
        super.onAttachedToWindow();
        if (this.mDrawable != null) {
            this.mDrawable.setVisible(this.getVisibility() == ImageView.VISIBLE, false);
        }
    }

    protected onDetachedFromWindow():void  {
        super.onDetachedFromWindow();
        if (this.mDrawable != null) {
            this.mDrawable.setVisible(false, false);
        }
    }

    //onInitializeAccessibilityEvent(event:AccessibilityEvent):void  {
    //    super.onInitializeAccessibilityEvent(event);
    //    event.setClassName(ImageView.class.getName());
    //}
    //
    //onInitializeAccessibilityNodeInfo(info:AccessibilityNodeInfo):void  {
    //    super.onInitializeAccessibilityNodeInfo(info);
    //    info.setClassName(ImageView.class.getName());
    //}

    static parseScaleType(s:string, defaultType:ImageView.ScaleType):ImageView.ScaleType{
        if(s==null) return defaultType;
        s = s.toLowerCase();
        if(s === 'matrix'.toLowerCase()) return ImageView.ScaleType.MATRIX;
        if(s === 'fitXY'.toLowerCase()) return ImageView.ScaleType.FIT_XY;
        if(s === 'fitStart'.toLowerCase()) return ImageView.ScaleType.FIT_START;
        if(s === 'fitCenter'.toLowerCase()) return ImageView.ScaleType.FIT_CENTER;
        if(s === 'fitEnd'.toLowerCase()) return ImageView.ScaleType.FIT_END;
        if(s === 'center'.toLowerCase()) return ImageView.ScaleType.CENTER;
        if(s === 'centerCrop'.toLowerCase()) return ImageView.ScaleType.CENTER_CROP;
        if(s === 'centerInside'.toLowerCase()) return ImageView.ScaleType.CENTER_INSIDE;
        return defaultType;
    }
}

export module ImageView{
/**
     * Options for scaling the bounds of an image to the bounds of this view.
     */
export enum ScaleType {

    /**
         * Scale using the image matrix when drawing. The image matrix can be set using
         * {@link ImageView#setImageMatrix(Matrix)}. From XML, use this syntax:
         * <code>android:scaleType="matrix"</code>.
         */
    MATRIX /*(0) {
    }
     */, /**
         * Scale the image using {@link Matrix.ScaleToFit#FILL}.
         * From XML, use this syntax: <code>android:scaleType="fitXY"</code>.
         */
    FIT_XY /*(1) {
    }
     */, /**
         * Scale the image using {@link Matrix.ScaleToFit#START}.
         * From XML, use this syntax: <code>android:scaleType="fitStart"</code>.
         */
    FIT_START /*(2) {
    }
     */, /**
         * Scale the image using {@link Matrix.ScaleToFit#CENTER}.
         * From XML, use this syntax:
         * <code>android:scaleType="fitCenter"</code>.
         */
    FIT_CENTER /*(3) {
    }
     */, /**
         * Scale the image using {@link Matrix.ScaleToFit#END}.
         * From XML, use this syntax: <code>android:scaleType="fitEnd"</code>.
         */
    FIT_END /*(4) {
    }
     */, /**
         * Center the image in the view, but perform no scaling.
         * From XML, use this syntax: <code>android:scaleType="center"</code>.
         */
    CENTER /*(5) {
    }
     */, /**
         * Scale the image uniformly (maintain the image's aspect ratio) so
         * that both dimensions (width and height) of the image will be equal
         * to or larger than the corresponding dimension of the view
         * (minus padding). The image is then centered in the view.
         * From XML, use this syntax: <code>android:scaleType="centerCrop"</code>.
         */
    CENTER_CROP /*(6) {
    }
     */, /**
         * Scale the image uniformly (maintain the image's aspect ratio) so
         * that both dimensions (width and height) of the image will be equal
         * to or less than the corresponding dimension of the view
         * (minus padding). The image is then centered in the view.
         * From XML, use this syntax: <code>android:scaleType="centerInside"</code>.
         */
    CENTER_INSIDE /*(7) {
    }
     */ /*;

    constructor( ni:number) {
        nativeInt = ni;
    }

    nativeInt:number = 0;
     */}}

}
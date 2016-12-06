/*******************************************************************************
 * Copyright 2011, 2012 Chris Banes.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *******************************************************************************/

///<reference path="../../../../../android/graphics/Canvas.ts"/>
///<reference path="../../../../../android/graphics/Matrix.ts"/>
///<reference path="../../../../../android/graphics/RectF.ts"/>
///<reference path="../../../../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../../../../android/view/GestureDetector.ts"/>
///<reference path="../../../../../android/view/View.ts"/>
///<reference path="../../../../../android/widget/ImageView.ts"/>
///<reference path="../../../../uk/co/senab/photoview/PhotoViewAttacher.ts"/>
///<reference path="../../../../uk/co/senab/photoview/IPhotoView.ts"/>

module uk.co.senab.photoview {
import Canvas = android.graphics.Canvas;
import Matrix = android.graphics.Matrix;
import RectF = android.graphics.RectF;
import Drawable = android.graphics.drawable.Drawable;
import GestureDetector = android.view.GestureDetector;
import View = android.view.View;
import ImageView = android.widget.ImageView;
import OnMatrixChangedListener = uk.co.senab.photoview.PhotoViewAttacher.OnMatrixChangedListener;
import OnPhotoTapListener = uk.co.senab.photoview.PhotoViewAttacher.OnPhotoTapListener;
import OnViewTapListener = uk.co.senab.photoview.PhotoViewAttacher.OnViewTapListener;
import PhotoViewAttacher = uk.co.senab.photoview.PhotoViewAttacher;
import IPhotoView = uk.co.senab.photoview.IPhotoView;
    import ScaleType = ImageView.ScaleType;

export class PhotoView extends ImageView implements IPhotoView {

    private mAttacher:PhotoViewAttacher;

    private mPendingScaleType:ScaleType;

    constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle?:Map<string, string>) {
        super(context, bindElement, defStyle);
        super.setScaleType(ScaleType.MATRIX);
        this.init();
    }

    protected init():void  {
        if (null == this.mAttacher || null == this.mAttacher.getImageView()) {
            this.mAttacher = new PhotoViewAttacher(this);
        }
        if (null != this.mPendingScaleType) {
            this.setScaleType(this.mPendingScaleType);
            this.mPendingScaleType = null;
        }
    }

    /**
     * @deprecated use {@link #setRotationTo(float)}
     */
    setPhotoViewRotation(rotationDegree:number):void  {
        this.mAttacher.setRotationTo(rotationDegree);
    }

    setRotationTo(rotationDegree:number):void  {
        this.mAttacher.setRotationTo(rotationDegree);
    }

    setRotationBy(rotationDegree:number):void  {
        this.mAttacher.setRotationBy(rotationDegree);
    }

    canZoom():boolean  {
        return this.mAttacher.canZoom();
    }

    getDisplayRect():RectF  {
        return this.mAttacher.getDisplayRect();
    }

    getDisplayMatrix():Matrix  {
        return this.mAttacher.getDisplayMatrix();
    }

    setDisplayMatrix(finalRectangle:Matrix):boolean  {
        return this.mAttacher.setDisplayMatrix(finalRectangle);
    }

    getMinScale():number  {
        return this.getMinimumScale();
    }

    getMinimumScale():number  {
        return this.mAttacher.getMinimumScale();
    }

    getMidScale():number  {
        return this.getMediumScale();
    }

    getMediumScale():number  {
        return this.mAttacher.getMediumScale();
    }

    getMaxScale():number  {
        return this.getMaximumScale();
    }

    getMaximumScale():number  {
        return this.mAttacher.getMaximumScale();
    }

    getScale():number  {
        return this.mAttacher.getScale();
    }

    getScaleType():ScaleType  {
        return this.mAttacher.getScaleType();
    }

    setAllowParentInterceptOnEdge(allow:boolean):void  {
        this.mAttacher.setAllowParentInterceptOnEdge(allow);
    }

    setMinScale(minScale:number):void  {
        this.setMinimumScale(minScale);
    }

    setMinimumScale(minimumScale:number):void  {
        this.mAttacher.setMinimumScale(minimumScale);
    }

    setMidScale(midScale:number):void  {
        this.setMediumScale(midScale);
    }

    setMediumScale(mediumScale:number):void  {
        this.mAttacher.setMediumScale(mediumScale);
    }

    setMaxScale(maxScale:number):void  {
        this.setMaximumScale(maxScale);
    }

    setMaximumScale(maximumScale:number):void  {
        this.mAttacher.setMaximumScale(maximumScale);
    }

    setScaleLevels(minimumScale:number, mediumScale:number, maximumScale:number):void  {
        this.mAttacher.setScaleLevels(minimumScale, mediumScale, maximumScale);
    }

    setImageDrawable(drawable:Drawable):// setImageBitmap calls through to this method
    void  {
        super.setImageDrawable(drawable);
        if (null != this.mAttacher) {
            this.mAttacher.update();
        }
    }

    //setImageResource(resId:number):void  {
    //    super.setImageResource(resId);
    //    if (null != this.mAttacher) {
    //        this.mAttacher.update();
    //    }
    //}

    setImageURI(uri:string):void  {
        super.setImageURI(uri);
        //if (null != this.mAttacher) {
        //    this.mAttacher.update();
        //}
    }

    protected resizeFromDrawable():boolean  {
        let change = super.resizeFromDrawable();
        if(change && null != this.mAttacher){
            this.mAttacher.update();
        }
        return change;
    }

    setOnMatrixChangeListener(listener:OnMatrixChangedListener):void  {
        this.mAttacher.setOnMatrixChangeListener(listener);
    }

    setOnLongClickListener(l:View.OnLongClickListener):void  {
        this.mAttacher.setOnLongClickListener(l);
    }

    setOnPhotoTapListener(listener:OnPhotoTapListener):void  {
        this.mAttacher.setOnPhotoTapListener(listener);
    }

    getOnPhotoTapListener():OnPhotoTapListener  {
        return this.mAttacher.getOnPhotoTapListener();
    }

    setOnViewTapListener(listener:OnViewTapListener):void  {
        this.mAttacher.setOnViewTapListener(listener);
    }

    getOnViewTapListener():OnViewTapListener  {
        return this.mAttacher.getOnViewTapListener();
    }

    setScale(scale:number, animate?:boolean):void;
    setScale(scale:number, focalX:number, focalY:number, animate?:boolean):void;
    setScale(...args):void  {
        (<any>this.mAttacher).setScale(...args);
    }

    setScaleType(scaleType:ScaleType):void  {
        if (null != this.mAttacher) {
            this.mAttacher.setScaleType(scaleType);
        } else {
            this.mPendingScaleType = scaleType;
        }
    }

    setZoomable(zoomable:boolean):void  {
        this.mAttacher.setZoomable(zoomable);
    }

    getVisibleRectangleBitmap():Canvas  {
        return this.mAttacher.getVisibleRectangleBitmap();
    }

    setZoomTransitionDuration(milliseconds:number):void  {
        this.mAttacher.setZoomTransitionDuration(milliseconds);
    }

    getIPhotoViewImplementation():IPhotoView  {
        return this.mAttacher;
    }

    setOnDoubleTapListener(newOnDoubleTapListener:GestureDetector.OnDoubleTapListener):void  {
        this.mAttacher.setOnDoubleTapListener(newOnDoubleTapListener);
    }

    setOnScaleChangeListener(onScaleChangeListener:PhotoViewAttacher.OnScaleChangeListener):void  {
        this.mAttacher.setOnScaleChangeListener(onScaleChangeListener);
    }

    protected onDetachedFromWindow():void  {
        this.mAttacher.cleanup();
        super.onDetachedFromWindow();
    }

    protected onAttachedToWindow():void  {
        this.init();
        super.onAttachedToWindow();
    }
}
}
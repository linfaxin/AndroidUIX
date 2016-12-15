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
///<reference path="../../../../../android/util/Log.ts"/>
///<reference path="../../../../../android/view/MotionEvent.ts"/>
///<reference path="../../../../../android/view/View.ts"/>
///<reference path="../../../../../android/view/ViewParent.ts"/>
///<reference path="../../../../../android/view/ViewTreeObserver.ts"/>
///<reference path="../../../../../android/view/animation/AccelerateDecelerateInterpolator.ts"/>
///<reference path="../../../../../android/view/animation/Interpolator.ts"/>
///<reference path="../../../../../android/widget/ImageView.ts"/>
///<reference path="../../../../../android/widget/OverScroller.ts"/>
///<reference path="../../../../../java/lang/ref/WeakReference.ts"/>
///<reference path="../../../../../java/lang/Runnable.ts"/>
///<reference path="../../../../../java/lang/System.ts"/>
///<reference path="../../../../uk/co/senab/photoview/GestureDetector.ts"/>
///<reference path="../../../../uk/co/senab/photoview/IPhotoView.ts"/>
///<reference path="../../../../uk/co/senab/photoview/PhotoView.ts"/>
///<reference path="../../../../../androidui/util/ArrayCreator.ts"/>

module uk.co.senab.photoview {
    import Canvas = android.graphics.Canvas;
    import Matrix = android.graphics.Matrix;
    import ScaleToFit = android.graphics.Matrix.ScaleToFit;
    import RectF = android.graphics.RectF;
    import Drawable = android.graphics.drawable.Drawable;
    import Log = android.util.Log;
    import View = android.view.View;
    import OnLongClickListener = android.view.View.OnLongClickListener;
    import ViewParent = android.view.ViewParent;
    import ViewTreeObserver = android.view.ViewTreeObserver;
    import AccelerateDecelerateInterpolator = android.view.animation.AccelerateDecelerateInterpolator;
    import Interpolator = android.view.animation.Interpolator;
    import ImageView = android.widget.ImageView;
    import ScaleType = android.widget.ImageView.ScaleType;
    import OverScroller = android.widget.OverScroller;
    import WeakReference = java.lang.ref.WeakReference;
    import MotionEvent = android.view.MotionEvent;
    const ACTION_CANCEL = MotionEvent.ACTION_CANCEL;
    const ACTION_DOWN = MotionEvent.ACTION_DOWN;
    const ACTION_UP = MotionEvent.ACTION_UP;
    import Runnable = java.lang.Runnable;
    import System = java.lang.System;
    import GestureDetector = uk.co.senab.photoview.GestureDetector;
    import IPhotoView = uk.co.senab.photoview.IPhotoView;
    import PhotoView = uk.co.senab.photoview.PhotoView;
    export class PhotoViewAttacher implements IPhotoView, View.OnTouchListener, GestureDetector.OnGestureListener, ViewTreeObserver.OnGlobalLayoutListener {

        private static LOG_TAG:string = "PhotoViewAttacher";

        // let debug flag be dynamic, but still Proguard can be used to remove from
        // release builds
        private static DEBUG:boolean = Log.View_DBG;

        static sInterpolator:Interpolator = new AccelerateDecelerateInterpolator();

        ZOOM_DURATION:number = IPhotoView.DEFAULT_ZOOM_DURATION;

        static EDGE_NONE:number = -1;

        static EDGE_LEFT:number = 0;

        static EDGE_RIGHT:number = 1;

        static EDGE_BOTH:number = 2;

        private mMinScale:number = IPhotoView.DEFAULT_MIN_SCALE;

        private mMidScale:number = IPhotoView.DEFAULT_MID_SCALE;

        private mMaxScale:number = IPhotoView.DEFAULT_MAX_SCALE;

        private mAllowParentInterceptOnEdge:boolean = true;

        private mBlockParentIntercept:boolean = false;

        private static checkZoomLevels(minZoom:number, midZoom:number, maxZoom:number):void {
            if (minZoom >= midZoom) {
                throw Error(`new IllegalArgumentException("MinZoom has to be less than MidZoom")`);
            } else if (midZoom >= maxZoom) {
                throw Error(`new IllegalArgumentException("MidZoom has to be less than MaxZoom")`);
            }
        }

        /**
         * @return true if the ImageView exists, and it's Drawable existss
         */
        private static hasDrawable(imageView:ImageView):boolean {
            return null != imageView && null != imageView.getDrawable();
        }

        /**
         * @return true if the ScaleType is supported.
         */
        private static isSupportedScaleType(scaleType:ScaleType):boolean {
            if (null == scaleType) {
                return false;
            }
            switch (scaleType) {
                case ScaleType.MATRIX:
                    throw Error(`new IllegalArgumentException(ScaleType.MATRIX is not supported in PhotoView)`);
                default:
                    return true;
            }
        }

        /**
         * Set's the ImageView's ScaleType to Matrix.
         */
        private static setImageViewScaleTypeMatrix(imageView:ImageView):void {
            /**
             * PhotoView sets it's own ScaleType to Matrix, then diverts all calls
             * setScaleType to this.setScaleType automatically.
             */
            if (null != imageView && !(IPhotoView.isImpl(imageView))) {
                if (ScaleType.MATRIX != (imageView.getScaleType())) {
                    imageView.setScaleType(ScaleType.MATRIX);
                }
            }
        }

        private mImageView:WeakReference<ImageView>;

        // Gesture Detectors
        private mGestureDetector:android.view.GestureDetector;

        private mScaleDragDetector:GestureDetector;

        // These are set so we don't keep allocating them on the heap
        private mBaseMatrix:Matrix = new Matrix();

        private mDrawMatrix:Matrix = new Matrix();

        private mSuppMatrix:Matrix = new Matrix();

        private mDisplayRect:RectF = new RectF();

        private mMatrixValues:number[] = androidui.util.ArrayCreator.newNumberArray(9);

        // Listeners
        private mMatrixChangeListener:PhotoViewAttacher.OnMatrixChangedListener;

        private mPhotoTapListener:PhotoViewAttacher.OnPhotoTapListener;

        private mViewTapListener:PhotoViewAttacher.OnViewTapListener;

        private mLongClickListener:OnLongClickListener;

        private mScaleChangeListener:PhotoViewAttacher.OnScaleChangeListener;

        private mIvTop:number = 0;
        private mIvRight:number = 0;
        private mIvBottom:number = 0;
        private mIvLeft:number = 0;

        private mCurrentFlingRunnable:PhotoViewAttacher.FlingRunnable;

        private mScrollEdge:number = PhotoViewAttacher.EDGE_BOTH;

        private mZoomEnabled:boolean;

        private mScaleType:ScaleType = ScaleType.FIT_CENTER;

        constructor(imageView:ImageView, zoomable = true) {
            this.mImageView = new WeakReference(imageView);
            //imageView.setDrawingCacheEnabled(true);
            imageView.setOnTouchListener(this);
            let observer:ViewTreeObserver = imageView.getViewTreeObserver();
            if (null != observer)
                observer.addOnGlobalLayoutListener(this);
            // Make sure we using MATRIX Scale Type
            PhotoViewAttacher.setImageViewScaleTypeMatrix(imageView);
            //if (imageView.isInEditMode()) {
            //    return;
            //}
            // Create Gesture Detectors...
            this.mScaleDragDetector = new GestureDetector();
            this.mScaleDragDetector.setOnGestureListener(this);
            this.mGestureDetector = new android.view.GestureDetector((()=> {
                const inner_this = this;
                class _Inner extends android.view.GestureDetector.SimpleOnGestureListener {
                    // forward long click listener
                    onLongPress(e:MotionEvent):void {
                        if (null != inner_this.mLongClickListener) {
                            inner_this.mLongClickListener.onLongClick(inner_this.getImageView());
                        }
                    }
                }
                return new _Inner();
            })());
            this.mGestureDetector.setOnDoubleTapListener(new PhotoViewAttacher.DefaultOnDoubleTapListener(this));
            // Finally, update the UI so that we're zoomable
            this.setZoomable(zoomable);
        }

        setOnDoubleTapListener(newOnDoubleTapListener:android.view.GestureDetector.OnDoubleTapListener):void {
            if (newOnDoubleTapListener != null) {
                this.mGestureDetector.setOnDoubleTapListener(newOnDoubleTapListener);
            } else {
                this.mGestureDetector.setOnDoubleTapListener(new PhotoViewAttacher.DefaultOnDoubleTapListener(this));
            }
        }

        setOnScaleChangeListener(onScaleChangeListener:PhotoViewAttacher.OnScaleChangeListener):void {
            this.mScaleChangeListener = onScaleChangeListener;
        }

        canZoom():boolean {
            return this.mZoomEnabled;
        }

        /**
         * Clean-up the resources attached to this object. This needs to be called when the ImageView is
         * no longer used. A good example is from {@link View#onDetachedFromWindow()} or
         * from {@link android.app.Activity#onDestroy()}. This is automatically called if you are using
         * {@link uk.co.senab.photoview.PhotoView}.
         */
        cleanup():void {
            if (null == this.mImageView) {
                // cleanup already done
                return;
            }
            const imageView:ImageView = this.mImageView.get();
            if (null != imageView) {
                // Remove this as a global layout listener
                let observer:ViewTreeObserver = imageView.getViewTreeObserver();
                if (null != observer && observer.isAlive()) {
                    observer.removeGlobalOnLayoutListener(this);
                }
                // Remove the ImageView's reference to this
                imageView.setOnTouchListener(null);
                // make sure a pending fling runnable won't be run
                this.cancelFling();
            }
            if (null != this.mGestureDetector) {
                this.mGestureDetector.setOnDoubleTapListener(null);
            }
            // Clear listeners too
            this.mMatrixChangeListener = null;
            this.mPhotoTapListener = null;
            this.mViewTapListener = null;
            // Finally, clear ImageView
            this.mImageView = null;
        }

        getDisplayRect():RectF {
            this.checkMatrixBounds();
            return this._getDisplayRect(this.getDrawMatrix());
        }

        setDisplayMatrix(finalMatrix:Matrix):boolean {
            if (finalMatrix == null)
                throw Error(`new IllegalArgumentException("Matrix cannot be null")`);
            let imageView:ImageView = this.getImageView();
            if (null == imageView)
                return false;
            if (null == imageView.getDrawable())
                return false;
            this.mSuppMatrix.set(finalMatrix);
            this.setImageViewMatrix(this.getDrawMatrix());
            this.checkMatrixBounds();
            return true;
        }

        /**
         * @deprecated use {@link #setRotationTo(float)}
         */
        setPhotoViewRotation(degrees:number):void {
            this.mSuppMatrix.setRotate(degrees % 360);
            this.checkAndDisplayMatrix();
        }

        setRotationTo(degrees:number):void {
            this.mSuppMatrix.setRotate(degrees % 360);
            this.checkAndDisplayMatrix();
        }

        setRotationBy(degrees:number):void {
            this.mSuppMatrix.postRotate(degrees % 360);
            this.checkAndDisplayMatrix();
        }

        getImageView():ImageView {
            let imageView:ImageView = null;
            if (null != this.mImageView) {
                imageView = this.mImageView.get();
            }
            // If we don't have an ImageView, call cleanup()
            if (null == imageView) {
                this.cleanup();
                if (PhotoViewAttacher.DEBUG)
                    Log.i(PhotoViewAttacher.LOG_TAG, "ImageView no longer exists. You should not use this PhotoViewAttacher any more.");
            }
            return imageView;
        }

        getMinScale():number {
            return this.getMinimumScale();
        }

        getMinimumScale():number {
            return this.mMinScale;
        }

        getMidScale():number {
            return this.getMediumScale();
        }

        getMediumScale():number {
            return this.mMidScale;
        }

        getMaxScale():number {
            return this.getMaximumScale();
        }

        getMaximumScale():number {
            return this.mMaxScale;
        }

        getScale():number {
            return <number> Math.sqrt(<number> Math.pow(this.getValue(this.mSuppMatrix, Matrix.MSCALE_X), 2) + <number> Math.pow(this.getValue(this.mSuppMatrix, Matrix.MSKEW_Y), 2));
        }

        getScaleType():ScaleType {
            return this.mScaleType;
        }

        onDrag(dx:number, dy:number):void {
            if (this.mScaleDragDetector.isScaling()) {
                // Do not drag if we are already scaling
                return;
            }
            if (PhotoViewAttacher.DEBUG) {
                Log.d(PhotoViewAttacher.LOG_TAG, `onDrag: dx: ${dx.toFixed(2)}. dy: ${dy.toFixed(2)}`);
            }
            let imageView:ImageView = this.getImageView();
            this.mSuppMatrix.postTranslate(dx, dy);
            this.checkAndDisplayMatrix();
            /**
             * Here we decide whether to let the ImageView's parent to start taking
             * over the touch event.
             *
             * First we check whether this function is enabled. We never want the
             * parent to take over if we're scaling. We then check the edge we're
             * on, and the direction of the scroll (i.e. if we're pulling against
             * the edge, aka 'overscrolling', let the parent take over).
             */
            let parent:ViewParent = imageView.getParent();
            if (this.mAllowParentInterceptOnEdge && !this.mScaleDragDetector.isScaling() && !this.mBlockParentIntercept) {
                if (this.mScrollEdge == PhotoViewAttacher.EDGE_BOTH || (this.mScrollEdge == PhotoViewAttacher.EDGE_LEFT && dx >= 1) || (this.mScrollEdge == PhotoViewAttacher.EDGE_RIGHT && dx <= -1)) {
                    if (null != parent)
                        parent.requestDisallowInterceptTouchEvent(false);
                }
            } else {
                if (null != parent) {
                    parent.requestDisallowInterceptTouchEvent(true);
                }
            }
        }

        onFling(startX:number, startY:number, velocityX:number, velocityY:number):void {
            if (PhotoViewAttacher.DEBUG) {
                Log.d(PhotoViewAttacher.LOG_TAG, "onFling. sX: " + startX + " sY: " + startY + " Vx: " + velocityX + " Vy: " + velocityY);
            }
            let imageView:ImageView = this.getImageView();
            this.mCurrentFlingRunnable = new PhotoViewAttacher.FlingRunnable(this);
            this.mCurrentFlingRunnable.fling(this.getImageViewWidth(imageView), this.getImageViewHeight(imageView), Math.floor(velocityX), Math.floor(velocityY));
            imageView.post(this.mCurrentFlingRunnable);
        }

        onGlobalLayout():void {
            let imageView:ImageView = this.getImageView();
            if (null != imageView) {
                if (this.mZoomEnabled) {
                    const top:number = imageView.getTop();
                    const right:number = imageView.getRight();
                    const bottom:number = imageView.getBottom();
                    const left:number = imageView.getLeft();
                    /**
                     * We need to check whether the ImageView's bounds have changed.
                     * This would be easier if we targeted API 11+ as we could just use
                     * View.OnLayoutChangeListener. Instead we have to replicate the
                     * work, keeping track of the ImageView's bounds and then checking
                     * if the values change.
                     */
                    if (top != this.mIvTop || bottom != this.mIvBottom || left != this.mIvLeft || right != this.mIvRight) {
                        // Update our base matrix, as the bounds have changed
                        this.updateBaseMatrix(imageView.getDrawable());
                        // Update values as something has changed
                        this.mIvTop = top;
                        this.mIvRight = right;
                        this.mIvBottom = bottom;
                        this.mIvLeft = left;
                    }
                } else {
                    this.updateBaseMatrix(imageView.getDrawable());
                }
            }
        }

        onScale(scaleFactor:number, focusX:number, focusY:number):void {
            if (PhotoViewAttacher.DEBUG) {
                Log.d(PhotoViewAttacher.LOG_TAG, `onScale: scale: ${scaleFactor.toFixed(2)}. fX: ${focusX.toFixed(2)}. fY: ${focusY.toFixed(2)}f`);
            }
            if (this.getScale() < this.mMaxScale || scaleFactor < 1) {
                if (null != this.mScaleChangeListener) {
                    this.mScaleChangeListener.onScaleChange(scaleFactor, focusX, focusY);
                }
                this.mSuppMatrix.postScale(scaleFactor, scaleFactor, focusX, focusY);
                this.checkAndDisplayMatrix();
            }
        }

        onTouch(v:View, ev:MotionEvent):boolean {
            let handled:boolean = false;
            if (this.mZoomEnabled && PhotoViewAttacher.hasDrawable(<ImageView> v)) {
                let parent:ViewParent = v.getParent();
                switch (ev.getAction()) {
                    case ACTION_DOWN:
                        // event
                        if (null != parent) {
                            parent.requestDisallowInterceptTouchEvent(true);
                        } else {
                            Log.i(PhotoViewAttacher.LOG_TAG, "onTouch getParent() returned null");
                        }
                        // If we're flinging, and the user presses down, cancel
                        // fling
                        this.cancelFling();
                        break;
                    case ACTION_CANCEL:
                    case ACTION_UP:
                        // to min scale
                        if (this.getScale() < this.mMinScale) {
                            let rect:RectF = this.getDisplayRect();
                            if (null != rect) {
                                v.post(new PhotoViewAttacher.AnimatedZoomRunnable(this, this.getScale(), this.mMinScale, rect.centerX(), rect.centerY()));
                                handled = true;
                            }
                        }
                        break;
                }
                // Try the Scale/Drag detector
                if (null != this.mScaleDragDetector) {
                    let wasScaling:boolean = this.mScaleDragDetector.isScaling();
                    let wasDragging:boolean = this.mScaleDragDetector.isDragging();
                    handled = this.mScaleDragDetector.onTouchEvent(ev);
                    let didntScale:boolean = !wasScaling && !this.mScaleDragDetector.isScaling();
                    let didntDrag:boolean = !wasDragging && !this.mScaleDragDetector.isDragging();
                    this.mBlockParentIntercept = didntScale && didntDrag;
                }
                // Check to see if the user double tapped
                if (null != this.mGestureDetector && this.mGestureDetector.onTouchEvent(ev)) {
                    handled = true;
                }
            }
            return handled;
        }

        setAllowParentInterceptOnEdge(allow:boolean):void {
            this.mAllowParentInterceptOnEdge = allow;
        }

        setMinScale(minScale:number):void {
            this.setMinimumScale(minScale);
        }

        setMinimumScale(minimumScale:number):void {
            PhotoViewAttacher.checkZoomLevels(minimumScale, this.mMidScale, this.mMaxScale);
            this.mMinScale = minimumScale;
        }

        setMidScale(midScale:number):void {
            this.setMediumScale(midScale);
        }

        setMediumScale(mediumScale:number):void {
            PhotoViewAttacher.checkZoomLevels(this.mMinScale, mediumScale, this.mMaxScale);
            this.mMidScale = mediumScale;
        }

        setMaxScale(maxScale:number):void {
            this.setMaximumScale(maxScale);
        }

        setMaximumScale(maximumScale:number):void {
            PhotoViewAttacher.checkZoomLevels(this.mMinScale, this.mMidScale, maximumScale);
            this.mMaxScale = maximumScale;
        }

        setScaleLevels(minimumScale:number, mediumScale:number, maximumScale:number):void {
            PhotoViewAttacher.checkZoomLevels(minimumScale, mediumScale, maximumScale);
            this.mMinScale = minimumScale;
            this.mMidScale = mediumScale;
            this.mMaxScale = maximumScale;
        }

        setOnLongClickListener(listener:OnLongClickListener):void {
            this.mLongClickListener = listener;
        }

        setOnMatrixChangeListener(listener:PhotoViewAttacher.OnMatrixChangedListener):void {
            this.mMatrixChangeListener = listener;
        }

        setOnPhotoTapListener(listener:PhotoViewAttacher.OnPhotoTapListener):void {
            this.mPhotoTapListener = listener;
        }

        getOnPhotoTapListener():PhotoViewAttacher.OnPhotoTapListener {
            return this.mPhotoTapListener;
        }

        setOnViewTapListener(listener:PhotoViewAttacher.OnViewTapListener):void {
            this.mViewTapListener = listener;
        }

        getOnViewTapListener():PhotoViewAttacher.OnViewTapListener {
            return this.mViewTapListener;
        }

        setScale(scale:number, animate?:boolean):void;
        setScale(scale:number, focalX:number, focalY:number, animate?:boolean):void;
        setScale(...args):void {
            if (args.length >= 3) {
                (<any>this).setScale_4(...args);
            } else {
                (<any>this).setScale_2(...args);
            }
        }

        private setScale_2(scale:number, animate = false):void {
            let imageView:ImageView = this.getImageView();
            if (null != imageView) {
                this.setScale(scale, (imageView.getRight()) / 2, (imageView.getBottom()) / 2, animate);
            }
        }

        private setScale_4(scale:number, focalX:number, focalY:number, animate = false):void {
            let imageView:ImageView = this.getImageView();
            if (null != imageView) {
                // Check to see if the scale is within bounds
                if (scale < this.mMinScale || scale > this.mMaxScale) {
                    Log.i(PhotoViewAttacher.LOG_TAG, "Scale must be within the range of minScale and maxScale");
                    return;
                }
                if (animate) {
                    imageView.post(new PhotoViewAttacher.AnimatedZoomRunnable(this, this.getScale(), scale, focalX, focalY));
                } else {
                    this.mSuppMatrix.setScale(scale, scale, focalX, focalY);
                    this.checkAndDisplayMatrix();
                }
            }
        }

        setScaleType(scaleType:ScaleType):void {
            if (PhotoViewAttacher.isSupportedScaleType(scaleType) && scaleType != this.mScaleType) {
                this.mScaleType = scaleType;
                // Finally update
                this.update();
            }
        }

        setZoomable(zoomable:boolean):void {
            this.mZoomEnabled = zoomable;
            this.update();
        }

        update():void {
            let imageView:ImageView = this.getImageView();
            if (null != imageView) {
                if (this.mZoomEnabled) {
                    // Make sure we using MATRIX Scale Type
                    PhotoViewAttacher.setImageViewScaleTypeMatrix(imageView);
                    // Update the base matrix using the current drawable
                    this.updateBaseMatrix(imageView.getDrawable());
                } else {
                    // Reset the Matrix...
                    this.resetMatrix();
                }
            }
        }

        getDisplayMatrix():Matrix {
            return new Matrix(this.getDrawMatrix());
        }

        getDrawMatrix():Matrix {
            this.mDrawMatrix.set(this.mBaseMatrix);
            this.mDrawMatrix.postConcat(this.mSuppMatrix);
            return this.mDrawMatrix;
        }

        private cancelFling():void {
            if (null != this.mCurrentFlingRunnable) {
                this.mCurrentFlingRunnable.cancelFling();
                this.mCurrentFlingRunnable = null;
            }
        }

        /**
         * Helper method that simply checks the Matrix, and then displays the result
         */
        private checkAndDisplayMatrix():void {
            if (this.checkMatrixBounds()) {
                this.setImageViewMatrix(this.getDrawMatrix());
            }
        }

        private checkImageViewScaleType():void {
            let imageView:ImageView = this.getImageView();
            /**
             * PhotoView's getScaleType() will just divert to this.getScaleType() so
             * only call if we're not attached to a PhotoView.
             */
            if (null != imageView && !(IPhotoView.isImpl(imageView))) {
                if (ScaleType.MATRIX != (imageView.getScaleType())) {
                    throw Error(`new IllegalStateException("The ImageView's ScaleType has been changed since attaching a PhotoViewAttacher")`);
                }
            }
        }

        private checkMatrixBounds():boolean {
            const imageView:ImageView = this.getImageView();
            if (null == imageView) {
                return false;
            }
            const rect:RectF = this._getDisplayRect(this.getDrawMatrix());
            if (null == rect) {
                return false;
            }
            const height:number = rect.height(), width:number = rect.width();
            let deltaX:number = 0, deltaY:number = 0;
            const viewHeight:number = this.getImageViewHeight(imageView);
            if (height <= viewHeight) {
                switch (this.mScaleType) {
                    case ScaleType.FIT_START:
                        deltaY = -rect.top;
                        break;
                    case ScaleType.FIT_END:
                        deltaY = viewHeight - height - rect.top;
                        break;
                    default:
                        deltaY = (viewHeight - height) / 2 - rect.top;
                        break;
                }
            } else if (rect.top > 0) {
                deltaY = -rect.top;
            } else if (rect.bottom < viewHeight) {
                deltaY = viewHeight - rect.bottom;
            }
            const viewWidth:number = this.getImageViewWidth(imageView);
            if (width <= viewWidth) {
                switch (this.mScaleType) {
                    case ScaleType.FIT_START:
                        deltaX = -rect.left;
                        break;
                    case ScaleType.FIT_END:
                        deltaX = viewWidth - width - rect.left;
                        break;
                    default:
                        deltaX = (viewWidth - width) / 2 - rect.left;
                        break;
                }
                this.mScrollEdge = PhotoViewAttacher.EDGE_BOTH;
            } else if (rect.left > 0) {
                this.mScrollEdge = PhotoViewAttacher.EDGE_LEFT;
                deltaX = -rect.left;
            } else if (rect.right < viewWidth) {
                deltaX = viewWidth - rect.right;
                this.mScrollEdge = PhotoViewAttacher.EDGE_RIGHT;
            } else {
                this.mScrollEdge = PhotoViewAttacher.EDGE_NONE;
            }
            // Finally actually translate the matrix
            this.mSuppMatrix.postTranslate(deltaX, deltaY);
            return true;
        }

        /**
         * Helper method that maps the supplied Matrix to the current Drawable
         *
         * @param matrix - Matrix to map Drawable against
         * @return RectF - Displayed Rectangle
         */
        private _getDisplayRect(matrix:Matrix):RectF {
            let imageView:ImageView = this.getImageView();
            if (null != imageView) {
                let d:Drawable = imageView.getDrawable();
                if (null != d) {
                    this.mDisplayRect.set(0, 0, d.getIntrinsicWidth(), d.getIntrinsicHeight());
                    matrix.mapRect(this.mDisplayRect);
                    return this.mDisplayRect;
                }
            }
            return null;
        }

        getVisibleRectangleBitmap():Canvas {
            let imageView:ImageView = this.getImageView();
            return imageView == null ? null : imageView.getDrawingCache();
        }

        setZoomTransitionDuration(milliseconds:number):void {
            if (milliseconds < 0)
                milliseconds = IPhotoView.DEFAULT_ZOOM_DURATION;
            this.ZOOM_DURATION = milliseconds;
        }

        getIPhotoViewImplementation():IPhotoView {
            return this;
        }

        /**
         * Helper method that 'unpacks' a Matrix and returns the required value
         *
         * @param matrix     - Matrix to unpack
         * @param whichValue - Which value from Matrix.M* to return
         * @return float - returned value
         */
        private getValue(matrix:Matrix, whichValue:number):number {
            matrix.getValues(this.mMatrixValues);
            return this.mMatrixValues[whichValue];
        }

        /**
         * Resets the Matrix back to FIT_CENTER, and then displays it.s
         */
        private resetMatrix():void {
            this.mSuppMatrix.reset();
            this.setImageViewMatrix(this.getDrawMatrix());
            this.checkMatrixBounds();
        }

        private setImageViewMatrix(matrix:Matrix):void {
            let imageView:ImageView = this.getImageView();
            if (null != imageView) {
                this.checkImageViewScaleType();
                imageView.setImageMatrix(matrix);
                // Call MatrixChangedListener if needed
                if (null != this.mMatrixChangeListener) {
                    let displayRect:RectF = this._getDisplayRect(matrix);
                    if (null != displayRect) {
                        this.mMatrixChangeListener.onMatrixChanged(displayRect);
                    }
                }
            }
        }

        /**
         * Calculate Matrix for FIT_CENTER
         *
         * @param d - Drawable being displayed
         */
        private updateBaseMatrix(d:Drawable):void {
            let imageView:ImageView = this.getImageView();
            if (null == imageView || null == d) {
                return;
            }
            const viewWidth:number = this.getImageViewWidth(imageView);
            const viewHeight:number = this.getImageViewHeight(imageView);
            const drawableWidth:number = d.getIntrinsicWidth();
            const drawableHeight:number = d.getIntrinsicHeight();
            this.mBaseMatrix.reset();
            const widthScale:number = viewWidth / drawableWidth;
            const heightScale:number = viewHeight / drawableHeight;
            if (this.mScaleType == ScaleType.CENTER) {
                this.mBaseMatrix.postTranslate((viewWidth - drawableWidth) / 2, (viewHeight - drawableHeight) / 2);
            } else if (this.mScaleType == ScaleType.CENTER_CROP) {
                let scale:number = Math.max(widthScale, heightScale);
                this.mBaseMatrix.postScale(scale, scale);
                this.mBaseMatrix.postTranslate((viewWidth - drawableWidth * scale) / 2, (viewHeight - drawableHeight * scale) / 2);
            } else if (this.mScaleType == ScaleType.CENTER_INSIDE) {
                let scale:number = Math.min(1.0, Math.min(widthScale, heightScale));
                this.mBaseMatrix.postScale(scale, scale);
                this.mBaseMatrix.postTranslate((viewWidth - drawableWidth * scale) / 2, (viewHeight - drawableHeight * scale) / 2);
            } else {
                let mTempSrc:RectF = new RectF(0, 0, drawableWidth, drawableHeight);
                let mTempDst:RectF = new RectF(0, 0, viewWidth, viewHeight);
                switch (this.mScaleType) {
                    case ScaleType.FIT_CENTER:
                        this.mBaseMatrix.setRectToRect(mTempSrc, mTempDst, ScaleToFit.CENTER);
                        break;
                    case ScaleType.FIT_START:
                        this.mBaseMatrix.setRectToRect(mTempSrc, mTempDst, ScaleToFit.START);
                        break;
                    case ScaleType.FIT_END:
                        this.mBaseMatrix.setRectToRect(mTempSrc, mTempDst, ScaleToFit.END);
                        break;
                    case ScaleType.FIT_XY:
                        this.mBaseMatrix.setRectToRect(mTempSrc, mTempDst, ScaleToFit.FILL);
                        break;
                    default:
                        break;
                }
            }
            this.resetMatrix();
        }

        private getImageViewWidth(imageView:ImageView):number {
            if (null == imageView)
                return 0;
            return imageView.getWidth() - imageView.getPaddingLeft() - imageView.getPaddingRight();
        }

        private getImageViewHeight(imageView:ImageView):number {
            if (null == imageView)
                return 0;
            return imageView.getHeight() - imageView.getPaddingTop() - imageView.getPaddingBottom();
        }

    }

    export module PhotoViewAttacher {
        /**
         * Interface definition for a callback to be invoked when the internal Matrix has changed for
         * this View.
         *
         * @author Chris Banes
         */
        export interface OnMatrixChangedListener {

            /**
             * Callback for when the Matrix displaying the Drawable has changed. This could be because
             * the View's bounds have changed, or the user has zoomed.
             *
             * @param rect - Rectangle displaying the Drawable's new bounds.
             */
            onMatrixChanged(rect:RectF):void ;
        }
        /**
         * Interface definition for callback to be invoked when attached ImageView scale changes
         *
         * @author Marek Sebera
         */
        export interface OnScaleChangeListener {

            /**
             * Callback for when the scale changes
             *
             * @param scaleFactor the scale factor (less than 1 for zoom out, greater than 1 for zoom in)
             * @param focusX      focal point X position
             * @param focusY      focal point Y position
             */
            onScaleChange(scaleFactor:number, focusX:number, focusY:number):void ;
        }
        /**
         * Interface definition for a callback to be invoked when the Photo is tapped with a single
         * tap.
         *
         * @author Chris Banes
         */
        export interface OnPhotoTapListener {

            /**
             * A callback to receive where the user taps on a photo. You will only receive a callback if
             * the user taps on the actual photo, tapping on 'whitespace' will be ignored.
             *
             * @param view - View the user tapped.
             * @param x    - where the user tapped from the of the Drawable, as percentage of the
             *             Drawable width.
             * @param y    - where the user tapped from the top of the Drawable, as percentage of the
             *             Drawable height.
             */
            onPhotoTap(view:View, x:number, y:number):void ;
        }
        /**
         * Interface definition for a callback to be invoked when the ImageView is tapped with a single
         * tap.
         *
         * @author Chris Banes
         */
        export interface OnViewTapListener {

            /**
             * A callback to receive where the user taps on a ImageView. You will receive a callback if
             * the user taps anywhere on the view, tapping on 'whitespace' will not be ignored.
             *
             * @param view - View the user tapped.
             * @param x    - where the user tapped from the left of the View.
             * @param y    - where the user tapped from the top of the View.
             */
            onViewTap(view:View, x:number, y:number):void ;
        }
        export class AnimatedZoomRunnable implements Runnable {
            _PhotoViewAttacher_this:PhotoViewAttacher;

            private mFocalX:number = 0;
            private mFocalY:number = 0;

            private mStartTime:number = 0;

            private mZoomStart:number = 0;
            private mZoomEnd:number = 0;

            constructor(arg:PhotoViewAttacher, currentZoom:number, targetZoom:number, focalX:number, focalY:number) {
                this._PhotoViewAttacher_this = arg;
                this.mFocalX = focalX;
                this.mFocalY = focalY;
                this.mStartTime = System.currentTimeMillis();
                this.mZoomStart = currentZoom;
                this.mZoomEnd = targetZoom;
            }

            run():void {
                let imageView:ImageView = this._PhotoViewAttacher_this.getImageView();
                if (imageView == null) {
                    return;
                }
                let t:number = this.interpolate();
                let scale:number = this.mZoomStart + t * (this.mZoomEnd - this.mZoomStart);
                let deltaScale:number = scale / this._PhotoViewAttacher_this.getScale();
                this._PhotoViewAttacher_this.onScale(deltaScale, this.mFocalX, this.mFocalY);
                // We haven't hit our target scale yet, so post ourselves again
                if (t < 1) {
                    imageView.postOnAnimation(this);
                }
            }

            private interpolate():number {
                let t:number = 1 * (System.currentTimeMillis() - this.mStartTime) / this._PhotoViewAttacher_this.ZOOM_DURATION;
                t = Math.min(1, t);
                t = PhotoViewAttacher.sInterpolator.getInterpolation(t);
                return t;
            }
        }
        export class FlingRunnable implements Runnable {
            _PhotoViewAttacher_this:PhotoViewAttacher;

            constructor(arg:PhotoViewAttacher) {
                this._PhotoViewAttacher_this = arg;
                this.mScroller = new OverScroller();
            }

            private mScroller:OverScroller;

            private mCurrentX:number = 0;
            private mCurrentY:number = 0;

            cancelFling():void {
                if (PhotoViewAttacher.DEBUG) {
                    Log.d(PhotoViewAttacher.LOG_TAG, "Cancel Fling");
                }
                this.mScroller.forceFinished(true);
            }

            fling(viewWidth:number, viewHeight:number, velocityX:number, velocityY:number):void {
                const rect:RectF = this._PhotoViewAttacher_this.getDisplayRect();
                if (null == rect) {
                    return;
                }
                const startX:number = Math.round(-rect.left);
                let minX:number, maxX:number, minY:number, maxY:number;
                if (viewWidth < rect.width()) {
                    minX = 0;
                    maxX = Math.round(rect.width() - viewWidth);
                } else {
                    minX = maxX = startX;
                }
                const startY:number = Math.round(-rect.top);
                if (viewHeight < rect.height()) {
                    minY = 0;
                    maxY = Math.round(rect.height() - viewHeight);
                } else {
                    minY = maxY = startY;
                }
                this.mCurrentX = startX;
                this.mCurrentY = startY;
                if (PhotoViewAttacher.DEBUG) {
                    Log.d(PhotoViewAttacher.LOG_TAG, "fling. StartX:" + startX + " StartY:" + startY + " MaxX:" + maxX + " MaxY:" + maxY);
                }
                // If we actually can move, fling the scroller
                if (startX != maxX || startY != maxY) {
                    this.mScroller.fling(startX, startY, velocityX, velocityY, minX, maxX, minY, maxY, 0, 0);
                }
            }

            run():void {
                if (this.mScroller.isFinished()) {
                    // remaining post that should not be handled
                    return;
                }
                let imageView:ImageView = this._PhotoViewAttacher_this.getImageView();
                if (null != imageView && this.mScroller.computeScrollOffset()) {
                    const newX:number = this.mScroller.getCurrX();
                    const newY:number = this.mScroller.getCurrY();
                    if (PhotoViewAttacher.DEBUG) {
                        Log.d(PhotoViewAttacher.LOG_TAG, "fling run(). CurrentX:" + this.mCurrentX + " CurrentY:" + this.mCurrentY + " NewX:" + newX + " NewY:" + newY);
                    }
                    this._PhotoViewAttacher_this.mSuppMatrix.postTranslate(this.mCurrentX - newX, this.mCurrentY - newY);
                    this._PhotoViewAttacher_this.setImageViewMatrix(this._PhotoViewAttacher_this.getDrawMatrix());
                    this.mCurrentX = newX;
                    this.mCurrentY = newY;
                    // Post On animation
                    imageView.postOnAnimation(this);
                }
            }
        }
        /**
         * Provided default implementation of GestureDetector.OnDoubleTapListener, to be overriden with custom behavior, if needed
         * <p>&nbsp;</p>
         * To be used via {@link PhotoViewAttacher#setOnDoubleTapListener(android.view.GestureDetector.OnDoubleTapListener)}
         */
        export class DefaultOnDoubleTapListener implements android.view.GestureDetector.OnDoubleTapListener {

            private photoViewAttacher:PhotoViewAttacher;

            /**
             * Default constructor
             *
             * @param photoViewAttacher PhotoViewAttacher to bind to
             */
            constructor(photoViewAttacher:PhotoViewAttacher) {
                this.setPhotoViewAttacher(photoViewAttacher);
            }

            /**
             * Allows to change PhotoViewAttacher within range of single instance
             *
             * @param newPhotoViewAttacher PhotoViewAttacher to bind to
             */
            setPhotoViewAttacher(newPhotoViewAttacher:PhotoViewAttacher):void {
                this.photoViewAttacher = newPhotoViewAttacher;
            }

            onSingleTapConfirmed(e:MotionEvent):boolean {
                if (this.photoViewAttacher == null)
                    return false;
                let imageView:ImageView = this.photoViewAttacher.getImageView();
                if (null != this.photoViewAttacher.getOnPhotoTapListener()) {
                    const displayRect:RectF = this.photoViewAttacher.getDisplayRect();
                    if (null != displayRect) {
                        const x:number = e.getX(), y:number = e.getY();
                        // Check to see if the user tapped on the photo
                        if (displayRect.contains(x, y)) {
                            let xResult:number = (x - displayRect.left) / displayRect.width();
                            let yResult:number = (y - displayRect.top) / displayRect.height();
                            this.photoViewAttacher.getOnPhotoTapListener().onPhotoTap(imageView, xResult, yResult);
                            return true;
                        }
                    }
                }
                if (null != this.photoViewAttacher.getOnViewTapListener()) {
                    this.photoViewAttacher.getOnViewTapListener().onViewTap(imageView, e.getX(), e.getY());
                }
                return false;
            }

            onDoubleTap(ev:MotionEvent):boolean {
                if (this.photoViewAttacher == null)
                    return false;
                try {
                    let scale:number = this.photoViewAttacher.getScale();
                    let x:number = ev.getX();
                    let y:number = ev.getY();
                    if (scale < this.photoViewAttacher.getMediumScale()) {
                        this.photoViewAttacher.setScale(this.photoViewAttacher.getMediumScale(), x, y, true);
                    } else if (scale >= this.photoViewAttacher.getMediumScale() && scale < this.photoViewAttacher.getMaximumScale()) {
                        this.photoViewAttacher.setScale(this.photoViewAttacher.getMaximumScale(), x, y, true);
                    } else {
                        this.photoViewAttacher.setScale(this.photoViewAttacher.getMinimumScale(), x, y, true);
                    }
                } catch (e) {
                }
                return true;
            }

            onDoubleTapEvent(e:MotionEvent):boolean {
                // Wait for the confirmed onDoubleTap() instead
                return false;
            }
        }
    }

}
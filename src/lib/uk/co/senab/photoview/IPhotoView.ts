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

///<reference path="../../../../../android/graphics/Matrix.ts"/>
///<reference path="../../../../../android/graphics/Canvas.ts"/>
///<reference path="../../../../../android/graphics/RectF.ts"/>
///<reference path="../../../../../android/view/GestureDetector.ts"/>
///<reference path="../../../../../android/view/View.ts"/>
///<reference path="../../../../../android/widget/ImageView.ts"/>
///<reference path="../../../../uk/co/senab/photoview/GestureDetector.ts"/>
///<reference path="../../../../uk/co/senab/photoview/PhotoView.ts"/>
///<reference path="../../../../uk/co/senab/photoview/PhotoViewAttacher.ts"/>

module uk.co.senab.photoview {
    import Matrix = android.graphics.Matrix;
    import Canvas = android.graphics.Canvas;
    import RectF = android.graphics.RectF;
    import GestureDetector = android.view.GestureDetector;
    import View = android.view.View;
    import ImageView = android.widget.ImageView;
    import PhotoView = uk.co.senab.photoview.PhotoView;
    import PhotoViewAttacher = uk.co.senab.photoview.PhotoViewAttacher;
    export interface IPhotoView {

        /**
         * Returns true if the PhotoView is set to allow zooming of Photos.
         *
         * @return true if the PhotoView allows zooming.
         */
        canZoom():boolean ;

        /**
         * Gets the Display Rectangle of the currently displayed Drawable. The Rectangle is relative to
         * this View and includes all scaling and translations.
         *
         * @return - RectF of Displayed Drawable
         */
        getDisplayRect():RectF ;

        /**
         * Sets the Display Matrix of the currently displayed Drawable. The Rectangle is considered
         * relative to this View and includes all scaling and translations.
         *
         * @param finalMatrix target matrix to set PhotoView to
         * @return - true if rectangle was applied successfully
         */
        setDisplayMatrix(finalMatrix:Matrix):boolean ;

        /**
         * Gets the Display Matrix of the currently displayed Drawable. The Rectangle is considered
         * relative to this View and includes all scaling and translations.
         *
         * @return - true if rectangle was applied successfully
         */
        getDisplayMatrix():Matrix ;

        /**
         * Use {@link #getMinimumScale()} instead, this will be removed in future release
         *
         * @return The current minimum scale level. What this value represents depends on the current
         * {@link ImageView.ScaleType}.
         */
        getMinScale():number ;

        /**
         * @return The current minimum scale level. What this value represents depends on the current
         * {@link ImageView.ScaleType}.
         */
        getMinimumScale():number ;

        /**
         * Use {@link #getMediumScale()} instead, this will be removed in future release
         *
         * @return The current middle scale level. What this value represents depends on the current
         * {@link ImageView.ScaleType}.
         */
        getMidScale():number ;

        /**
         * @return The current medium scale level. What this value represents depends on the current
         * {@link ImageView.ScaleType}.
         */
        getMediumScale():number ;

        /**
         * Use {@link #getMaximumScale()} instead, this will be removed in future release
         *
         * @return The current maximum scale level. What this value represents depends on the current
         * {@link ImageView.ScaleType}.
         */
        getMaxScale():number ;

        /**
         * @return The current maximum scale level. What this value represents depends on the current
         * {@link ImageView.ScaleType}.
         */
        getMaximumScale():number ;

        /**
         * Returns the current scale value
         *
         * @return float - current scale value
         */
        getScale():number ;

        /**
         * Return the current scale type in use by the ImageView.
         *
         * @return current ImageView.ScaleType
         */
        getScaleType():ImageView.ScaleType ;

        /**
         * Whether to allow the ImageView's parent to intercept the touch event when the photo is scroll
         * to it's horizontal edge.
         *
         * @param allow whether to allow intercepting by parent element or not
         */
        setAllowParentInterceptOnEdge(allow:boolean):void ;

        /**
         * Use {@link #setMinimumScale(float minimumScale)} instead, this will be removed in future
         * release
         * <p>&nbsp;</p>
         * Sets the minimum scale level. What this value represents depends on the current {@link
            * ImageView.ScaleType}.
         *
         * @param minScale minimum allowed scale
         */
        setMinScale(minScale:number):void ;

        /**
         * Sets the minimum scale level. What this value represents depends on the current {@link
            * ImageView.ScaleType}.
         *
         * @param minimumScale minimum allowed scale
         */
        setMinimumScale(minimumScale:number):void ;

        /**
         * Use {@link #setMediumScale(float mediumScale)} instead, this will be removed in future
         * release
         * <p>&nbsp;</p>
         * Sets the middle scale level. What this value represents depends on the current {@link
            * ImageView.ScaleType}.
         *
         * @param midScale medium scale preset
         */
        setMidScale(midScale:number):void ;

        /*
         * Sets the medium scale level. What this value represents depends on the current {@link android.widget.ImageView.ScaleType}.
         *
         * @param mediumScale medium scale preset
         */
        setMediumScale(mediumScale:number):void ;

        /**
         * Use {@link #setMaximumScale(float maximumScale)} instead, this will be removed in future
         * release
         * <p>&nbsp;</p>
         * Sets the maximum scale level. What this value represents depends on the current {@link
            * ImageView.ScaleType}.
         *
         * @param maxScale maximum allowed scale preset
         */
        setMaxScale(maxScale:number):void ;

        /**
         * Sets the maximum scale level. What this value represents depends on the current {@link
            * ImageView.ScaleType}.
         *
         * @param maximumScale maximum allowed scale preset
         */
        setMaximumScale(maximumScale:number):void ;

        /**
         * Allows to set all three scale levels at once, so you don't run into problem with setting
         * medium/minimum scale before the maximum one
         *
         * @param minimumScale minimum allowed scale
         * @param mediumScale  medium allowed scale
         * @param maximumScale maximum allowed scale preset
         */
        setScaleLevels(minimumScale:number, mediumScale:number, maximumScale:number):void ;

        /**
         * Register a callback to be invoked when the Photo displayed by this view is long-pressed.
         *
         * @param listener - Listener to be registered.
         */
        setOnLongClickListener(listener:View.OnLongClickListener):void ;

        /**
         * Register a callback to be invoked when the Matrix has changed for this View. An example would
         * be the user panning or scaling the Photo.
         *
         * @param listener - Listener to be registered.
         */
        setOnMatrixChangeListener(listener:PhotoViewAttacher.OnMatrixChangedListener):void ;

        /**
         * Register a callback to be invoked when the Photo displayed by this View is tapped with a
         * single tap.
         *
         * @param listener - Listener to be registered.
         */
        setOnPhotoTapListener(listener:PhotoViewAttacher.OnPhotoTapListener):void ;

        /**
         * Returns a listener to be invoked when the Photo displayed by this View is tapped with a
         * single tap.
         *
         * @return PhotoViewAttacher.OnPhotoTapListener currently set, may be null
         */
        getOnPhotoTapListener():PhotoViewAttacher.OnPhotoTapListener ;

        /**
         * Register a callback to be invoked when the View is tapped with a single tap.
         *
         * @param listener - Listener to be registered.
         */
        setOnViewTapListener(listener:PhotoViewAttacher.OnViewTapListener):void ;

        /**
         * Enables rotation via PhotoView internal functions.
         *
         * @param rotationDegree - Degree to rotate PhotoView to, should be in range 0 to 360
         */
        setRotationTo(rotationDegree:number):void ;

        /**
         * Enables rotation via PhotoView internal functions.
         *
         * @param rotationDegree - Degree to rotate PhotoView by, should be in range 0 to 360
         */
        setRotationBy(rotationDegree:number):void ;

        /**
         * Returns a callback listener to be invoked when the View is tapped with a single tap.
         *
         * @return PhotoViewAttacher.OnViewTapListener currently set, may be null
         */
        getOnViewTapListener():PhotoViewAttacher.OnViewTapListener ;

        /**
         * Changes the current scale to the specified value.
         *
         * @param scale - Value to scale to
         */
        setScale(scale:number):void ;

        /**
         * Changes the current scale to the specified value.
         *
         * @param scale   - Value to scale to
         * @param animate - Whether to animate the scale
         */
        setScale(scale:number, animate:boolean):void ;

        /**
         * Changes the current scale to the specified value, around the given focal point.
         *
         * @param scale   - Value to scale to
         * @param focalX  - X Focus Point
         * @param focalY  - Y Focus Point
         * @param animate - Whether to animate the scale
         */
        setScale(scale:number, focalX:number, focalY:number, animate:boolean):void ;

        /**
         * Controls how the image should be resized or moved to match the size of the ImageView. Any
         * scaling or panning will happen within the confines of this {@link
            * ImageView.ScaleType}.
         *
         * @param scaleType - The desired scaling mode.
         */
        setScaleType(scaleType:ImageView.ScaleType):void ;

        /**
         * Allows you to enable/disable the zoom functionality on the ImageView. When disable the
         * ImageView reverts to using the FIT_CENTER matrix.
         *
         * @param zoomable - Whether the zoom functionality is enabled.
         */
        setZoomable(zoomable:boolean):void ;

        /**
         * Enables rotation via PhotoView internal functions. Name is chosen so it won't collide with
         * View.setRotation(float) in API since 11
         *
         * @param rotationDegree - Degree to rotate PhotoView to, should be in range 0 to 360
         * @deprecated use {@link #setRotationTo(float)}
         */
        setPhotoViewRotation(rotationDegree:number):void ;

        /**
         * Extracts currently visible area to Bitmap object, if there is no image loaded yet or the
         * ImageView is already destroyed, returns {@code null}
         *
         * @return currently visible area as bitmap or null
         */
        getVisibleRectangleBitmap():Canvas ;

        /**
         * Allows to change zoom transition speed, default value is 200 (PhotoViewAttacher.DEFAULT_ZOOM_DURATION).
         * Will default to 200 if provided negative value
         *
         * @param milliseconds duration of zoom interpolation
         */
        setZoomTransitionDuration(milliseconds:number):void ;

        /**
         * Will return instance of IPhotoView (eg. PhotoViewAttacher), can be used to provide better
         * integration
         *
         * @return IPhotoView implementation instance if available, null if not
         */
        getIPhotoViewImplementation():IPhotoView ;

        /**
         * Sets custom double tap listener, to intercept default given functions. To reset behavior to
         * default, you can just pass in "null" or public field of PhotoViewAttacher.defaultOnDoubleTapListener
         *
         * @param newOnDoubleTapListener custom OnDoubleTapListener to be set on ImageView
         */
        setOnDoubleTapListener(newOnDoubleTapListener:GestureDetector.OnDoubleTapListener):void ;

        /**
         * Will report back about scale changes
         *
         * @param onScaleChangeListener OnScaleChangeListener instance
         */
        setOnScaleChangeListener(onScaleChangeListener:PhotoViewAttacher.OnScaleChangeListener):void ;
    }

    export module IPhotoView {
        export var DEFAULT_MAX_SCALE:number = 3.0;
        export var DEFAULT_MID_SCALE:number = 1.75;
        export var DEFAULT_MIN_SCALE:number = 1.0;
        export var DEFAULT_ZOOM_DURATION:number = 200;

        export function isImpl(obj):boolean {
            if(!obj) return false;
            return obj['canZoom'] &&
                obj['getDisplayRect'] &&
                obj['setDisplayMatrix'] &&
                obj['getDisplayMatrix'] &&
                obj['getMinScale'] &&
                obj['getMinimumScale'] &&
                obj['getMidScale'] &&
                obj['getMediumScale'] &&
                obj['getMaxScale'] &&
                obj['getMaximumScale'] &&
                obj['getScale'] &&
                obj['getScaleType'] &&
                obj['setAllowParentInterceptOnEdge'] &&
                obj['setMinScale'] &&
                obj['setMinimumScale'] &&
                obj['setMidScale'] &&
                obj['setMediumScale'] &&
                obj['setMaxScale'] &&
                obj['setMaximumScale'] &&
                obj['setScaleLevels'] &&
                obj['setOnLongClickListener'] &&
                obj['setOnMatrixChangeListener'] &&
                obj['setOnPhotoTapListener'] &&
                obj['getOnPhotoTapListener'] &&
                obj['setOnViewTapListener'] &&
                obj['setRotationTo'] &&
                obj['setRotationBy'] &&
                obj['getOnViewTapListener'] &&
                obj['setScale'] &&
                obj['setScale'] &&
                obj['setScale'] &&
                obj['setScaleType'] &&
                obj['setZoomable'] &&
                obj['setPhotoViewRotation'] &&
                obj['getVisibleRectangleBitmap'] &&
                obj['setZoomTransitionDuration'] &&
                obj['getIPhotoViewImplementation'] &&
                obj['setOnDoubleTapListener'] &&
                obj['setOnScaleChangeListener'];
        }
    }

}
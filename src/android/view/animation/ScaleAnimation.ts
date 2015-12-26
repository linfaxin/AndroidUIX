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

///<reference path="../../../android/content/res/Resources.ts"/>
///<reference path="../../../android/util/TypedValue.ts"/>
///<reference path="../../../android/view/animation/Animation.ts"/>
///<reference path="../../../android/view/animation/Transformation.ts"/>

module android.view.animation {
import Resources = android.content.res.Resources;
import TypedValue = android.util.TypedValue;
import Animation = android.view.animation.Animation;
import Transformation = android.view.animation.Transformation;
/**
 * An animation that controls the scale of an object. You can specify the point
 * to use for the center of scaling.
 * 
 */
export class ScaleAnimation extends Animation {

    private mResources:Resources;

    private mFromX:number = 0;

    private mToX:number = 0;

    private mFromY:number = 0;

    private mToY:number = 0;

    //private mFromXType:number = TypedValue.TYPE_NULL;
    //
    //private mToXType:number = TypedValue.TYPE_NULL;
    //
    //private mFromYType:number = TypedValue.TYPE_NULL;
    //
    //private mToYType:number = TypedValue.TYPE_NULL;

    private mFromXData:number = 0;

    private mToXData:number = 0;

    private mFromYData:number = 0;

    private mToYData:number = 0;

    private mPivotXType:number = ScaleAnimation.ABSOLUTE;

    private mPivotYType:number = ScaleAnimation.ABSOLUTE;

    private mPivotXValue:number = 0.0;

    private mPivotYValue:number = 0.0;

    private mPivotX:number = 0;

    private mPivotY:number = 0;

    /**
     * Constructor to use when building a ScaleAnimation from code
     * 
     * @param fromX Horizontal scaling factor to apply at the start of the
     *        animation
     * @param toX Horizontal scaling factor to apply at the end of the animation
     * @param fromY Vertical scaling factor to apply at the start of the
     *        animation
     * @param toY Vertical scaling factor to apply at the end of the animation
     * @param pivotXType Specifies how pivotXValue should be interpreted. One of
     *        Animation.ABSOLUTE, Animation.RELATIVE_TO_SELF, or
     *        Animation.RELATIVE_TO_PARENT.
     * @param pivotXValue The X coordinate of the point about which the object
     *        is being scaled, specified as an absolute number where 0 is the
     *        left edge. (This point remains fixed while the object changes
     *        size.) This value can either be an absolute number if pivotXType
     *        is ABSOLUTE, or a percentage (where 1.0 is 100%) otherwise.
     * @param pivotYType Specifies how pivotYValue should be interpreted. One of
     *        Animation.ABSOLUTE, Animation.RELATIVE_TO_SELF, or
     *        Animation.RELATIVE_TO_PARENT.
     * @param pivotYValue The Y coordinate of the point about which the object
     *        is being scaled, specified as an absolute number where 0 is the
     *        top edge. (This point remains fixed while the object changes
     *        size.) This value can either be an absolute number if pivotYType
     *        is ABSOLUTE, or a percentage (where 1.0 is 100%) otherwise.
     */
    constructor(fromX:number, toX:number, fromY:number, toY:number,
                pivotXType=ScaleAnimation.ABSOLUTE, pivotXValue=0, pivotYType=ScaleAnimation.ABSOLUTE, pivotYValue=0) {
        super();
        this.mResources = null;
        this.mFromX = fromX;
        this.mToX = toX;
        this.mFromY = fromY;
        this.mToY = toY;
        this.mPivotXValue = pivotXValue;
        this.mPivotXType = pivotXType;
        this.mPivotYValue = pivotYValue;
        this.mPivotYType = pivotYType;
        this.initializePivotPoint();
    }

    /**
     * Called at the end of constructor methods to initialize, if possible, values for
     * the pivot point. This is only possible for ABSOLUTE pivot values.
     */
    private initializePivotPoint():void  {
        if (this.mPivotXType == ScaleAnimation.ABSOLUTE) {
            this.mPivotX = this.mPivotXValue;
        }
        if (this.mPivotYType == ScaleAnimation.ABSOLUTE) {
            this.mPivotY = this.mPivotYValue;
        }
    }

    protected applyTransformation(interpolatedTime:number, t:Transformation):void  {
        let sx:number = 1.0;
        let sy:number = 1.0;
        let scale:number = this.getScaleFactor();
        if (this.mFromX != 1.0 || this.mToX != 1.0) {
            sx = this.mFromX + ((this.mToX - this.mFromX) * interpolatedTime);
        }
        if (this.mFromY != 1.0 || this.mToY != 1.0) {
            sy = this.mFromY + ((this.mToY - this.mFromY) * interpolatedTime);
        }
        if (this.mPivotX == 0 && this.mPivotY == 0) {
            t.getMatrix().setScale(sx, sy);
        } else {
            t.getMatrix().setScale(sx, sy, scale * this.mPivotX, scale * this.mPivotY);
        }
    }

    //resolveScale(scale:number, type:number, data:number, size:number, psize:number):number  {
    //    let targetSize:number;
    //    if (type == TypedValue.TYPE_FRACTION) {
    //        targetSize = TypedValue.complexToFraction(data, size, psize);
    //    } else if (type == TypedValue.TYPE_DIMENSION) {
    //        targetSize = TypedValue.complexToDimension(data, this.mResources.getDisplayMetrics());
    //    } else {
    //        return scale;
    //    }
    //    if (size == 0) {
    //        return 1;
    //    }
    //    return targetSize / <number> size;
    //}

    initialize(width:number, height:number, parentWidth:number, parentHeight:number):void  {
        super.initialize(width, height, parentWidth, parentHeight);
        //this.mFromX = this.resolveScale(this.mFromX, this.mFromXType, this.mFromXData, width, parentWidth);
        //this.mToX = this.resolveScale(this.mToX, this.mToXType, this.mToXData, width, parentWidth);
        //this.mFromY = this.resolveScale(this.mFromY, this.mFromYType, this.mFromYData, height, parentHeight);
        //this.mToY = this.resolveScale(this.mToY, this.mToYType, this.mToYData, height, parentHeight);
        this.mPivotX = this.resolveSize(this.mPivotXType, this.mPivotXValue, width, parentWidth);
        this.mPivotY = this.resolveSize(this.mPivotYType, this.mPivotYValue, height, parentHeight);
    }
}
}
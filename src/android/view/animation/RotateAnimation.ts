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

///<reference path="../../../android/view/animation/Animation.ts"/>
///<reference path="../../../android/view/animation/Transformation.ts"/>

module android.view.animation {
import Animation = android.view.animation.Animation;
import Transformation = android.view.animation.Transformation;
/**
 * An animation that controls the rotation of an object. This rotation takes
 * place in the X-Y plane. You can specify the point to use for the center of
 * the rotation, where (0,0) is the top left point. If not specified, (0,0) is
 * the default rotation point.
 * 
 */
export class RotateAnimation extends Animation {

    private mFromDegrees:number = 0;

    private mToDegrees:number = 0;

    private mPivotXType:number = RotateAnimation.ABSOLUTE;

    private mPivotYType:number = RotateAnimation.ABSOLUTE;

    private mPivotXValue:number = 0.0;

    private mPivotYValue:number = 0.0;

    private mPivotX:number = 0;

    private mPivotY:number = 0;

    ///**
    // * Constructor used when a RotateAnimation is loaded from a resource.
    // *
    // * @param context Application context to use
    // * @param attrs Attribute set from which to read values
    // */
    //constructor( context:Context, attrs:AttributeSet) {
    //    super(context, attrs);
    //    let a:TypedArray = context.obtainStyledAttributes(attrs, com.android.internal.R.styleable.RotateAnimation);
    //    this.mFromDegrees = a.getFloat(com.android.internal.R.styleable.RotateAnimation_fromDegrees, 0.0);
    //    this.mToDegrees = a.getFloat(com.android.internal.R.styleable.RotateAnimation_toDegrees, 0.0);
    //    let d:Animation.Description = RotateAnimation.Description.parseValue(a.peekValue(com.android.internal.R.styleable.RotateAnimation_pivotX));
    //    this.mPivotXType = d.type;
    //    this.mPivotXValue = d.value;
    //    d = RotateAnimation.Description.parseValue(a.peekValue(com.android.internal.R.styleable.RotateAnimation_pivotY));
    //    this.mPivotYType = d.type;
    //    this.mPivotYValue = d.value;
    //    a.recycle();
    //    this.initializePivotPoint();
    //}

    /**
     * Constructor to use when building a RotateAnimation from code
     * 
     * @param fromDegrees Rotation offset to apply at the start of the
     *        animation.
     * 
     * @param toDegrees Rotation offset to apply at the end of the animation.
     * 
     * @param pivotXType Specifies how pivotXValue should be interpreted. One of
     *        Animation.ABSOLUTE, Animation.RELATIVE_TO_SELF, or
     *        Animation.RELATIVE_TO_PARENT.
     * @param pivotXValue The X coordinate of the point about which the object
     *        is being rotated, specified as an absolute number where 0 is the
     *        left edge. This value can either be an absolute number if
     *        pivotXType is ABSOLUTE, or a percentage (where 1.0 is 100%)
     *        otherwise.
     * @param pivotYType Specifies how pivotYValue should be interpreted. One of
     *        Animation.ABSOLUTE, Animation.RELATIVE_TO_SELF, or
     *        Animation.RELATIVE_TO_PARENT.
     * @param pivotYValue The Y coordinate of the point about which the object
     *        is being rotated, specified as an absolute number where 0 is the
     *        top edge. This value can either be an absolute number if
     *        pivotYType is ABSOLUTE, or a percentage (where 1.0 is 100%)
     *        otherwise.
     */
    constructor(fromDegrees:number, toDegrees:number, pivotXType=RotateAnimation.ABSOLUTE, pivotXValue=0,
                 pivotYType=RotateAnimation.ABSOLUTE, pivotYValue=0) {
        super();
        this.mFromDegrees = fromDegrees;
        this.mToDegrees = toDegrees;
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
        if (this.mPivotXType == RotateAnimation.ABSOLUTE) {
            this.mPivotX = this.mPivotXValue;
        }
        if (this.mPivotYType == RotateAnimation.ABSOLUTE) {
            this.mPivotY = this.mPivotYValue;
        }
    }

    protected applyTransformation(interpolatedTime:number, t:Transformation):void  {
        let degrees:number = this.mFromDegrees + ((this.mToDegrees - this.mFromDegrees) * interpolatedTime);
        let scale:number = this.getScaleFactor();
        if (this.mPivotX == 0.0 && this.mPivotY == 0.0) {
            t.getMatrix().setRotate(degrees);
        } else {
            t.getMatrix().setRotate(degrees, this.mPivotX * scale, this.mPivotY * scale);
        }
    }

    initialize(width:number, height:number, parentWidth:number, parentHeight:number):void  {
        super.initialize(width, height, parentWidth, parentHeight);
        this.mPivotX = this.resolveSize(this.mPivotXType, this.mPivotXValue, width, parentWidth);
        this.mPivotY = this.resolveSize(this.mPivotYType, this.mPivotYValue, height, parentHeight);
    }
}
}
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
 * An animation that controls the position of an object. See the
 * {@link android.view.animation full package} description for details and
 * sample code.
 * 
 */
export class TranslateAnimation extends Animation {

    private mFromXType:number = TranslateAnimation.ABSOLUTE;

    private mToXType:number = TranslateAnimation.ABSOLUTE;

    private mFromYType:number = TranslateAnimation.ABSOLUTE;

    private mToYType:number = TranslateAnimation.ABSOLUTE;

    private mFromXValue:number = 0.0;

    private mToXValue:number = 0.0;

    private mFromYValue:number = 0.0;

    private mToYValue:number = 0.0;

    private mFromXDelta:number = 0;

    private mToXDelta:number = 0;

    private mFromYDelta:number = 0;

    private mToYDelta:number = 0;

    /**
     * Constructor to use when building a TranslateAnimation from code
     *
     * @param fromXDelta Change in X coordinate to apply at the start of the
     *        animation
     * @param toXDelta Change in X coordinate to apply at the end of the
     *        animation
     * @param fromYDelta Change in Y coordinate to apply at the start of the
     *        animation
     * @param toYDelta Change in Y coordinate to apply at the end of the
     *        animation
     */
    constructor( fromXDelta:number, toXDelta:number, fromYDelta:number, toYDelta:number);
    /**
     * Constructor to use when building a TranslateAnimation from code
     * 
     * @param fromXType Specifies how fromXValue should be interpreted. One of
     *        Animation.ABSOLUTE, Animation.RELATIVE_TO_SELF, or
     *        Animation.RELATIVE_TO_PARENT.
     * @param fromXValue Change in X coordinate to apply at the start of the
     *        animation. This value can either be an absolute number if fromXType
     *        is ABSOLUTE, or a percentage (where 1.0 is 100%) otherwise.
     * @param toXType Specifies how toXValue should be interpreted. One of
     *        Animation.ABSOLUTE, Animation.RELATIVE_TO_SELF, or
     *        Animation.RELATIVE_TO_PARENT.
     * @param toXValue Change in X coordinate to apply at the end of the
     *        animation. This value can either be an absolute number if toXType
     *        is ABSOLUTE, or a percentage (where 1.0 is 100%) otherwise.
     * @param fromYType Specifies how fromYValue should be interpreted. One of
     *        Animation.ABSOLUTE, Animation.RELATIVE_TO_SELF, or
     *        Animation.RELATIVE_TO_PARENT.
     * @param fromYValue Change in Y coordinate to apply at the start of the
     *        animation. This value can either be an absolute number if fromYType
     *        is ABSOLUTE, or a percentage (where 1.0 is 100%) otherwise.
     * @param toYType Specifies how toYValue should be interpreted. One of
     *        Animation.ABSOLUTE, Animation.RELATIVE_TO_SELF, or
     *        Animation.RELATIVE_TO_PARENT.
     * @param toYValue Change in Y coordinate to apply at the end of the
     *        animation. This value can either be an absolute number if toYType
     *        is ABSOLUTE, or a percentage (where 1.0 is 100%) otherwise.
     */
    constructor(fromXType:number, fromXValue:number, toXType:number, toXValue:number, fromYType:number, fromYValue:number, toYType:number, toYValue:number);
    constructor(...args){
        super();
        if(args.length===4){
            this.mFromXValue = args[0];
            this.mToXValue = args[1];
            this.mFromYValue = args[2];
            this.mToYValue = args[3];
            this.mFromXType = TranslateAnimation.ABSOLUTE;
            this.mToXType = TranslateAnimation.ABSOLUTE;
            this.mFromYType = TranslateAnimation.ABSOLUTE;
            this.mToYType = TranslateAnimation.ABSOLUTE;
        }else{
            this.mFromXType = args[0];
            this.mFromXValue = args[1];
            this.mToXType = args[2];
            this.mToXValue = args[3];
            this.mFromYType = args[4];
            this.mFromYValue = args[5];
            this.mToYType = args[6];
            this.mToYValue = args[7];
        }
    }

    protected applyTransformation(interpolatedTime:number, t:Transformation):void  {
        let dx:number = this.mFromXDelta;
        let dy:number = this.mFromYDelta;
        if (this.mFromXDelta != this.mToXDelta) {
            dx = this.mFromXDelta + ((this.mToXDelta - this.mFromXDelta) * interpolatedTime);
        }
        if (this.mFromYDelta != this.mToYDelta) {
            dy = this.mFromYDelta + ((this.mToYDelta - this.mFromYDelta) * interpolatedTime);
        }
        t.getMatrix().setTranslate(dx, dy);
    }

    initialize(width:number, height:number, parentWidth:number, parentHeight:number):void  {
        super.initialize(width, height, parentWidth, parentHeight);
        this.mFromXDelta = this.resolveSize(this.mFromXType, this.mFromXValue, width, parentWidth);
        this.mToXDelta = this.resolveSize(this.mToXType, this.mToXValue, width, parentWidth);
        this.mFromYDelta = this.resolveSize(this.mFromYType, this.mFromYValue, height, parentHeight);
        this.mToYDelta = this.resolveSize(this.mToYType, this.mToYValue, height, parentHeight);
    }
}
}
///<reference path="../../../../android/graphics/Canvas.ts"/>
///<reference path="../../../../android/graphics/Paint.ts"/>
///<reference path="../../../../android/graphics/RectF.ts"/>
///<reference path="../../../../android/graphics/Color.ts"/>
///<reference path="../../../../android/os/SystemClock.ts"/>
///<reference path="../../../../android/util/DisplayMetrics.ts"/>
///<reference path="../../../../android/util/TypedValue.ts"/>
///<reference path="../../../../android/view/View.ts"/>
///<reference path="../../../../java/lang/System.ts"/>

module com.pnikosis.materialishprogress {
    import Canvas = android.graphics.Canvas;
    import Paint = android.graphics.Paint;
    import Style = android.graphics.Paint.Style;
    import RectF = android.graphics.RectF;
    import Color = android.graphics.Color;
    import SystemClock = android.os.SystemClock;
    import DisplayMetrics = android.util.DisplayMetrics;
    import TypedValue = android.util.TypedValue;
    import View = android.view.View;
    import System = java.lang.System;
    /**
     * A Material style progress wheel, compatible up to 2.2.
     * Todd Davies' Progress Wheel https://github.com/Todd-Davies/ProgressWheel
     *
     * @author Nico Hormazábal
     *         <p/>
     *         Licensed under the Apache License 2.0 license see:
     *         http://www.apache.org/licenses/LICENSE-2.0
     */
    export class ProgressWheel extends View {

        private barLength:number = 16;

        private barMaxLength:number = 270;

        private pauseGrowingTime:number = 200;

        /**
         * *********
         * DEFAULTS *
         * **********
         */
        //Sizes (with defaults in DP)
        private circleRadius:number = 36;

        private barWidth:number = 4;

        private rimWidth:number = 4;

        private fillRadius:boolean = false;

        private timeStartGrowing:number = 0;

        private barSpinCycleTime:number = 460;

        private barExtraLength:number = 0;

        private barGrowingFromFront:boolean = true;

        private pausedTimeWithoutGrowing:number = 0;

        //Colors (with defaults)
        private barColor:number = 0xAA000000;

        private rimColor:number = 0x00FFFFFF;

        //Paints
        private barPaint:Paint = new Paint();

        private rimPaint:Paint = new Paint();

        //Rectangles
        private circleBounds:RectF = new RectF();

        //Animation
        //The amount of degrees per second
        private spinSpeed:number = 230.0;

        //private float spinSpeed = 120.0f;
        // The last time the spinner was animated
        private lastTimeAnimated:number = 0;

        private linearProgress:boolean;

        private mProgress:number = 0.0;

        private mTargetProgress:number = 0.0;

        private mIsSpinning:boolean = false;

        private callback:ProgressWheel.ProgressCallback;

        constructor(bindElement?:HTMLElement, rootElement?:HTMLElement) {
            super(bindElement, rootElement);

            // We transform the default values from DIP to pixels
            let metrics:DisplayMetrics = this.getResources().getDisplayMetrics();
            this.barWidth = Math.floor(TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, this.barWidth, metrics));
            this.rimWidth = Math.floor(TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, this.rimWidth, metrics));
            this.circleRadius = Math.floor(TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, this.circleRadius, metrics));

            this._attrBinder.addAttr('circleRadius', (value)=> {
                this.setCircleRadius(Math.floor(this._attrBinder.parseNumber(value, this.circleRadius)));
            });
            this._attrBinder.addAttr('fillRadius', (value)=> {
                this.fillRadius = this._attrBinder.parseBoolean(value, this.fillRadius);
                this.invalidate();
            });
            this._attrBinder.addAttr('barWidth', (value)=> {
                this.setBarWidth(Math.floor(this._attrBinder.parseNumber(value, this.barWidth)));
            });
            this._attrBinder.addAttr('rimWidth', (value)=> {
                this.setRimWidth(Math.floor(this._attrBinder.parseNumber(value, this.rimWidth)));
            });
            this._attrBinder.addAttr('spinSpeed', (value)=> {
                this.setSpinSpeed(this._attrBinder.parseNumber(value, this.spinSpeed / 360.0));
            });
            this._attrBinder.addAttr('barSpinCycleTime', (value)=> {
                this.barSpinCycleTime = Math.floor(this._attrBinder.parseNumber(value, this.barSpinCycleTime));
            });
            this._attrBinder.addAttr('barColor', (value)=> {
                this.setBarColor(this._attrBinder.parseColor(value, this.barColor));
            });
            this._attrBinder.addAttr('rimColor', (value)=> {
                this.setRimColor(this._attrBinder.parseColor(value, this.rimColor));
            });
            this._attrBinder.addAttr('linearProgress', (value)=> {
                this.setLinearProgress(this._attrBinder.parseBoolean(value, this.linearProgress));
            });
            this._attrBinder.addAttr('progress', (value)=> {
                this.setProgress(this._attrBinder.parseNumber(value, this.getProgress()));
            });
            this._attrBinder.addAttr('progressIndeterminate', (value)=> {
                if (this._attrBinder.parseBoolean(value, false)) {
                    this.spin();
                }
            });
            this.applyDefaultAttributes({
                progressIndeterminate: true
            });
        }


        //----------------------------------
        //Setting up stuff
        //----------------------------------
        protected onMeasure(widthMeasureSpec:number, heightMeasureSpec:number):void {
            super.onMeasure(widthMeasureSpec, heightMeasureSpec);
            let viewWidth:number = this.circleRadius + this.getPaddingLeft() + this.getPaddingRight();
            let viewHeight:number = this.circleRadius + this.getPaddingTop() + this.getPaddingBottom();
            let widthMode:number = ProgressWheel.MeasureSpec.getMode(widthMeasureSpec);
            let widthSize:number = ProgressWheel.MeasureSpec.getSize(widthMeasureSpec);
            let heightMode:number = ProgressWheel.MeasureSpec.getMode(heightMeasureSpec);
            let heightSize:number = ProgressWheel.MeasureSpec.getSize(heightMeasureSpec);
            let width:number;
            let height:number;
            //Measure Width
            if (widthMode == ProgressWheel.MeasureSpec.EXACTLY) {
                //Must be this size
                width = widthSize;
            } else if (widthMode == ProgressWheel.MeasureSpec.AT_MOST) {
                //Can't be bigger than...
                width = Math.min(viewWidth, widthSize);
            } else {
                //Be whatever you want
                width = viewWidth;
            }
            //Measure Height
            if (heightMode == ProgressWheel.MeasureSpec.EXACTLY || widthMode == ProgressWheel.MeasureSpec.EXACTLY) {
                //Must be this size
                height = heightSize;
            } else if (heightMode == ProgressWheel.MeasureSpec.AT_MOST) {
                //Can't be bigger than...
                height = Math.min(viewHeight, heightSize);
            } else {
                //Be whatever you want
                height = viewHeight;
            }
            this.setMeasuredDimension(width, height);
        }

        /**
         * Use onSizeChanged instead of onAttachedToWindow to get the dimensions of the view,
         * because this method is called after measuring the dimensions of MATCH_PARENT & WRAP_CONTENT.
         * Use this dimensions to setup the bounds and paints.
         */
        protected onSizeChanged(w:number, h:number, oldw:number, oldh:number):void {
            super.onSizeChanged(w, h, oldw, oldh);
            this.setupBounds(w, h);
            this.setupPaints();
            this.invalidate();
        }

        /**
         * Set the properties of the paints we're using to
         * draw the progress wheel
         */
        private setupPaints():void {
            this.barPaint.setColor(this.barColor);
            this.barPaint.setAntiAlias(true);
            this.barPaint.setStyle(Style.STROKE);
            this.barPaint.setStrokeWidth(this.barWidth);
            this.rimPaint.setColor(this.rimColor);
            this.rimPaint.setAntiAlias(true);
            this.rimPaint.setStyle(Style.STROKE);
            this.rimPaint.setStrokeWidth(this.rimWidth);
        }

        /**
         * Set the bounds of the component
         */
        private setupBounds(layout_width:number, layout_height:number):void {
            let paddingTop:number = this.getPaddingTop();
            let paddingBottom:number = this.getPaddingBottom();
            let paddingLeft:number = this.getPaddingLeft();
            let paddingRight:number = this.getPaddingRight();
            if (!this.fillRadius) {
                // Width should equal to Height, find the min value to setup the circle
                let minValue:number = Math.min(layout_width - paddingLeft - paddingRight, layout_height - paddingBottom - paddingTop);
                let circleDiameter:number = Math.min(minValue, this.circleRadius * 2 - this.barWidth * 2);
                // Calc the Offset if needed for centering the wheel in the available space
                let xOffset:number = (layout_width - paddingLeft - paddingRight - circleDiameter) / 2 + paddingLeft;
                let yOffset:number = (layout_height - paddingTop - paddingBottom - circleDiameter) / 2 + paddingTop;
                this.circleBounds = new RectF(xOffset + this.barWidth, yOffset + this.barWidth,
                    xOffset + circleDiameter - this.barWidth, yOffset + circleDiameter - this.barWidth);
            } else {
                this.circleBounds = new RectF(paddingLeft + this.barWidth, paddingTop + this.barWidth,
                    layout_width - paddingRight - this.barWidth, layout_height - paddingBottom - this.barWidth);
            }
        }

        setCallback(progressCallback:ProgressWheel.ProgressCallback):void {
            this.callback = progressCallback;
            if (!this.mIsSpinning) {
                this.runCallback();
            }
        }

        //----------------------------------
        //Animation stuff
        //----------------------------------
        protected onDraw(canvas:Canvas):void {
            super.onDraw(canvas);
            if (Color.alpha(this.rimPaint.getColor()) > 0) canvas.drawArc(this.circleBounds, 360, 360, false, this.rimPaint);
            let mustInvalidate:boolean = false;
            if (this.mIsSpinning) {
                //Draw the spinning bar
                mustInvalidate = true;
                let deltaTime:number = (SystemClock.uptimeMillis() - this.lastTimeAnimated);
                let deltaNormalized:number = deltaTime * this.spinSpeed / 1000.0;
                this.updateBarLength(deltaTime);
                this.mProgress += deltaNormalized;
                if (this.mProgress > 360) {
                    this.mProgress -= 360;
                    // A full turn has been completed
                    // we run the callback with -1 in case we want to
                    // do something, like changing the color
                    this.runCallback(-1.0);
                }
                this.lastTimeAnimated = SystemClock.uptimeMillis();
                let from:number = this.mProgress - 90;
                let length:number = this.barLength + this.barExtraLength;
                canvas.drawArc(this.circleBounds, from, length, false, this.barPaint);
            } else {
                let oldProgress:number = this.mProgress;
                if (this.mProgress != this.mTargetProgress) {
                    //We smoothly increase the progress bar
                    mustInvalidate = true;
                    let deltaTime:number = <number> (SystemClock.uptimeMillis() - this.lastTimeAnimated) / 1000;
                    let deltaNormalized:number = deltaTime * this.spinSpeed;
                    this.mProgress = Math.min(this.mProgress + deltaNormalized, this.mTargetProgress);
                    this.lastTimeAnimated = SystemClock.uptimeMillis();
                }
                if (oldProgress != this.mProgress) {
                    this.runCallback();
                }
                let offset:number = 0.0;
                let progress:number = this.mProgress;
                if (!this.linearProgress) {
                    let factor:number = 2.0;
                    offset = <number> (1.0 - Math.pow(1.0 - this.mProgress / 360.0, 2.0 * factor)) * 360.0;
                    progress = <number> (1.0 - Math.pow(1.0 - this.mProgress / 360.0, factor)) * 360.0;
                }
                canvas.drawArc(this.circleBounds, offset - 90, progress, false, this.barPaint);
            }
            if (mustInvalidate) {
                this.invalidate();
            }
        }

        protected onVisibilityChanged(changedView:View, visibility:number):void {
            super.onVisibilityChanged(changedView, visibility);
            if (visibility == ProgressWheel.VISIBLE) {
                this.lastTimeAnimated = SystemClock.uptimeMillis();
            }
        }

        private updateBarLength(deltaTimeInMilliSeconds:number):void {
            if (this.pausedTimeWithoutGrowing >= this.pauseGrowingTime) {
                this.timeStartGrowing += deltaTimeInMilliSeconds;
                if (this.timeStartGrowing > this.barSpinCycleTime) {
                    // We completed a size change cycle
                    // (growing or shrinking)
                    this.timeStartGrowing -= this.barSpinCycleTime;
                    //if(barGrowingFromFront) {
                    this.pausedTimeWithoutGrowing = 0;
                    //}
                    this.barGrowingFromFront = !this.barGrowingFromFront;
                }
                let distance:number = <number> Math.cos((this.timeStartGrowing / this.barSpinCycleTime + 1) * Math.PI) / 2 + 0.5;
                let destLength:number = (this.barMaxLength - this.barLength);
                if (this.barGrowingFromFront) {
                    this.barExtraLength = distance * destLength;
                } else {
                    let newLength:number = destLength * (1 - distance);
                    this.mProgress += (this.barExtraLength - newLength);
                    this.barExtraLength = newLength;
                }
            } else {
                this.pausedTimeWithoutGrowing += deltaTimeInMilliSeconds;
            }
        }

        /**
         * Check if the wheel is currently spinning
         */
        isSpinning():boolean {
            return this.mIsSpinning;
        }

        /**
         * Reset the count (in increment mode)
         */
        resetCount():void {
            this.mProgress = 0.0;
            this.mTargetProgress = 0.0;
            this.invalidate();
        }

        /**
         * Turn off spin mode
         */
        stopSpinning():void {
            this.mIsSpinning = false;
            this.mProgress = 0.0;
            this.mTargetProgress = 0.0;
            this.invalidate();
        }

        /**
         * Puts the view on spin mode
         */
        spin():void {
            this.lastTimeAnimated = SystemClock.uptimeMillis();
            this.mIsSpinning = true;
            this.invalidate();
        }

        private runCallback(value?:number):void {
            if (this.callback != null) {
                if (value == null) value = Math.round(this.mProgress * 100 / 360.0) / 100;
                this.callback.onProgressUpdate(value);
            }
        }

        /**
         * Set the progress to a specific value,
         * the bar will be set instantly to that value
         *
         * @param progress the progress between 0 and 1
         */
        setInstantProgress(progress:number):void {
            if (this.mIsSpinning) {
                this.mProgress = 0.0;
                this.mIsSpinning = false;
            }
            if (progress > 1.0) {
                progress -= 1.0;
            } else if (progress < 0) {
                progress = 0;
            }
            if (progress == this.mTargetProgress) {
                return;
            }
            this.mTargetProgress = Math.min(progress * 360.0, 360.0);
            this.mProgress = this.mTargetProgress;
            this.lastTimeAnimated = SystemClock.uptimeMillis();
            this.invalidate();
        }

        /**
         * @return the current progress between 0.0 and 1.0,
         * if the wheel is indeterminate, then the result is -1
         */
        getProgress():number {
            return this.mIsSpinning ? -1 : this.mProgress / 360.0;
        }

        //----------------------------------
        //Getters + setters
        //----------------------------------
        /**
         * Set the progress to a specific value,
         * the bar will smoothly animate until that value
         *
         * @param progress the progress between 0 and 1
         */
        setProgress(progress:number):void {
            if (this.mIsSpinning) {
                this.mProgress = 0.0;
                this.mIsSpinning = false;
                this.runCallback();
            }
            if (progress > 1.0) {
                progress -= 1.0;
            } else if (progress < 0) {
                progress = 0;
            }
            if (progress == this.mTargetProgress) {
                return;
            }
            // animation starts smooth from here
            if (this.mProgress == this.mTargetProgress) {
                this.lastTimeAnimated = SystemClock.uptimeMillis();
            }
            this.mTargetProgress = Math.min(progress * 360.0, 360.0);
            this.invalidate();
        }

        /**
         * Sets the determinate progress mode
         *
         * @param isLinear if the progress should increase linearly
         */
        setLinearProgress(isLinear:boolean):void {
            this.linearProgress = isLinear;
            if (!this.mIsSpinning) {
                this.invalidate();
            }
        }

        /**
         * @return the radius of the wheel in pixels
         */
        getCircleRadius():number {
            return this.circleRadius;
        }

        /**
         * Sets the radius of the wheel
         *
         * @param circleRadius the expected radius, in pixels
         */
        setCircleRadius(circleRadius:number):void {
            this.circleRadius = circleRadius;
            if (!this.mIsSpinning) {
                this.invalidate();
            }
        }

        /**
         * @return the width of the spinning bar
         */
        getBarWidth():number {
            return this.barWidth;
        }

        /**
         * Sets the width of the spinning bar
         *
         * @param barWidth the spinning bar width in pixels
         */
        setBarWidth(barWidth:number):void {
            this.barWidth = barWidth;
            if (!this.mIsSpinning) {
                this.invalidate();
            }
        }

        /**
         * @return the color of the spinning bar
         */
        getBarColor():number {
            return this.barColor;
        }

        /**
         * Sets the color of the spinning bar
         *
         * @param barColor The spinning bar color
         */
        setBarColor(barColor:number):void {
            this.barColor = barColor;
            this.setupPaints();
            if (!this.mIsSpinning) {
                this.invalidate();
            }
        }

        /**
         * @return the color of the wheel's contour
         */
        getRimColor():number {
            return this.rimColor;
        }

        /**
         * Sets the color of the wheel's contour
         *
         * @param rimColor the color for the wheel
         */
        setRimColor(rimColor:number):void {
            this.rimColor = rimColor;
            this.setupPaints();
            if (!this.mIsSpinning) {
                this.invalidate();
            }
        }

        /**
         * @return the base spinning speed, in full circle turns per second
         * (1.0 equals on full turn in one second), this value also is applied for
         * the smoothness when setting a progress
         */
        getSpinSpeed():number {
            return this.spinSpeed / 360.0;
        }

        /**
         * Sets the base spinning speed, in full circle turns per second
         * (1.0 equals on full turn in one second), this value also is applied for
         * the smoothness when setting a progress
         *
         * @param spinSpeed the desired base speed in full turns per second
         */
        setSpinSpeed(spinSpeed:number):void {
            this.spinSpeed = spinSpeed * 360.0;
        }

        /**
         * @return the width of the wheel's contour in pixels
         */
        getRimWidth():number {
            return this.rimWidth;
        }

        /**
         * Sets the width of the wheel's contour
         *
         * @param rimWidth the width in pixels
         */
        setRimWidth(rimWidth:number):void {
            this.rimWidth = rimWidth;
            if (!this.mIsSpinning) {
                this.invalidate();
            }
        }


    }

    export module ProgressWheel {
        export interface ProgressCallback {

            /**
             * Method to call when the progress reaches a value
             * in order to avoid float precision issues, the progress
             * is rounded to a float with two decimals.
             *
             * In indeterminate mode, the callback is called each time
             * the wheel completes an animation cycle, with, the progress value is -1.0f
             *
             * @param progress a double value between 0.00 and 1.00 both included
             */
            onProgressUpdate(progress:number):void ;
        }
    }

}
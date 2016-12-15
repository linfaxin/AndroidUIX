/*
 * Copyright (C) 2010 The Android Open Source Project
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
///<reference path="../../android/os/Handler.ts"/>
///<reference path="../../android/os/SystemClock.ts"/>
///<reference path="../../java/lang/Float.ts"/>
///<reference path="../../android/view/GestureDetector.ts"/>
///<reference path="../../android/view/MotionEvent.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewConfiguration.ts"/>
///<reference path="../../android/util/TypedValue.ts"/>

module android.view {
import Resources = android.content.res.Resources;
import Handler = android.os.Handler;
import SystemClock = android.os.SystemClock;
import Float = java.lang.Float;
import MotionEvent = android.view.MotionEvent;
import View = android.view.View;
import ViewConfiguration = android.view.ViewConfiguration;
import TypedValue = android.util.TypedValue;
/**
 * Detects scaling transformation gestures using the supplied {@link MotionEvent}s.
 * The {@link OnScaleGestureListener} callback will notify users when a particular
 * gesture event has occurred.
 *
 * This class should only be used with {@link MotionEvent}s reported via touch.
 *
 * To use this class:
 * <ul>
 *  <li>Create an instance of the {@code ScaleGestureDetector} for your
 *      {@link View}
 *  <li>In the {@link View#onTouchEvent(MotionEvent)} method ensure you call
 *          {@link #onTouchEvent(MotionEvent)}. The methods defined in your
 *          callback will be executed when the events occur.
 * </ul>
 */
export class ScaleGestureDetector {

    private static TAG:string = "ScaleGestureDetector";

    //private mContext:Context;

    private mListener:ScaleGestureDetector.OnScaleGestureListener;

    private mFocusX:number = 0;

    private mFocusY:number = 0;

    private mQuickScaleEnabled:boolean;

    private mCurrSpan:number = 0;

    private mPrevSpan:number = 0;

    private mInitialSpan:number = 0;

    private mCurrSpanX:number = 0;

    private mCurrSpanY:number = 0;

    private mPrevSpanX:number = 0;

    private mPrevSpanY:number = 0;

    private mCurrTime:number = 0;

    private mPrevTime:number = 0;

    private mInProgress:boolean;

    private mSpanSlop:number = 0;

    private mMinSpan:number = 0;

    // Bounds for recently seen values
    private mTouchUpper:number = 0;

    private mTouchLower:number = 0;

    private mTouchHistoryLastAccepted:number = 0;

    private mTouchHistoryDirection:number = 0;

    private mTouchHistoryLastAcceptedTime:number = 0;

    private mTouchMinMajor:number = 0;

    private mDoubleTapEvent:MotionEvent;

    private mDoubleTapMode:number = ScaleGestureDetector.DOUBLE_TAP_MODE_NONE;

    private mHandler:any;

    // ms
    private static TOUCH_STABILIZE_TIME:number = 128;

    private static DOUBLE_TAP_MODE_NONE:number = 0;

    private static DOUBLE_TAP_MODE_IN_PROGRESS:number = 1;

    private static SCALE_FACTOR:number = .5;

    ///**
    // * Consistency verifier for debugging purposes.
    // */
    //private mInputEventConsistencyVerifier:InputEventConsistencyVerifier = InputEventConsistencyVerifier.isInstrumentationEnabled() ? new InputEventConsistencyVerifier(this, 0) : null;

    private mGestureDetector:GestureDetector;

    private mEventBeforeOrAboveStartingGestureEvent:boolean;

    /**
     * Creates a ScaleGestureDetector with the supplied listener.
     * @see android.os.Handler#Handler()
     *
     * @param context the application's context
     * @param listener the listener invoked for all the callbacks, this must
     * not be null.
     * @param handler the handler to use for running deferred listener events.
     *
     * @throws NullPointerException if {@code listener} is null.
     */
    constructor(listener:ScaleGestureDetector.OnScaleGestureListener, handler?:any) {
        //this.mContext = context;
        this.mListener = listener;
        this.mSpanSlop = ViewConfiguration.get().getScaledTouchSlop() * 2;
        this.mTouchMinMajor = TypedValue.complexToDimensionPixelSize('48dp');//Resources.getDimensionPixelSize(com.android.internal.R.dimen.config_minScalingTouchMajor);
        this.mMinSpan = TypedValue.complexToDimensionPixelSize('27mm');//Resources.getDimensionPixelSize(com.android.internal.R.dimen.config_minScalingSpan);
        this.mHandler = handler;
        // Quick scale is enabled by default after JB_MR2
        this.setQuickScaleEnabled(true);
    }

    /**
     * The touchMajor/touchMinor elements of a MotionEvent can flutter/jitter on
     * some hardware/driver combos. Smooth it out to get kinder, gentler behavior.
     * @param ev MotionEvent to add to the ongoing history
     */
    private addTouchHistory(ev:MotionEvent):void  {
        const currentTime:number = SystemClock.uptimeMillis();
        const count:number = ev.getPointerCount();
        let accept:boolean = currentTime - this.mTouchHistoryLastAcceptedTime >= ScaleGestureDetector.TOUCH_STABILIZE_TIME;
        let total:number = 0;
        let sampleCount:number = 0;
        for (let i:number = 0; i < count; i++) {
            const hasLastAccepted:boolean = !Number.isNaN(this.mTouchHistoryLastAccepted);
            const historySize:number = ev.getHistorySize();
            const pointerSampleCount:number = historySize + 1;
            for (let h:number = 0; h < pointerSampleCount; h++) {
                let major:number;
                if (h < historySize) {
                    major = ev.getHistoricalTouchMajor(i, h);
                } else {
                    major = ev.getTouchMajor(i);
                }
                if (major < this.mTouchMinMajor)
                    major = this.mTouchMinMajor;
                total += major;
                if (Number.isNaN(this.mTouchUpper) || major > this.mTouchUpper) {
                    this.mTouchUpper = major;
                }
                if (Number.isNaN(this.mTouchLower) || major < this.mTouchLower) {
                    this.mTouchLower = major;
                }
                if (hasLastAccepted) {
                    function Math_signum(value:number):number{
                        if(value === 0 || Number.isNaN(value)) return value;
                        return Math.abs(value)===value ? 1 : -1;
                    }
                    const directionSig:number = Math.floor(Math_signum(major - this.mTouchHistoryLastAccepted));
                    if (directionSig != this.mTouchHistoryDirection || (directionSig == 0 && this.mTouchHistoryDirection == 0)) {
                        this.mTouchHistoryDirection = directionSig;
                        const time:number = h < historySize ? ev.getHistoricalEventTime(h) : ev.getEventTime();
                        this.mTouchHistoryLastAcceptedTime = time;
                        accept = false;
                    }
                }
            }
            sampleCount += pointerSampleCount;
        }
        const avg:number = total / sampleCount;
        if (accept) {
            let newAccepted:number = (this.mTouchUpper + this.mTouchLower + avg) / 3;
            this.mTouchUpper = (this.mTouchUpper + newAccepted) / 2;
            this.mTouchLower = (this.mTouchLower + newAccepted) / 2;
            this.mTouchHistoryLastAccepted = newAccepted;
            this.mTouchHistoryDirection = 0;
            this.mTouchHistoryLastAcceptedTime = ev.getEventTime();
        }
    }

    /**
     * Clear all touch history tracking. Useful in ACTION_CANCEL or ACTION_UP.
     * @see #addTouchHistory(MotionEvent)
     */
    private clearTouchHistory():void  {
        this.mTouchUpper = Number.NaN;
        this.mTouchLower = Number.NaN;
        this.mTouchHistoryLastAccepted = Number.NaN;
        this.mTouchHistoryDirection = 0;
        this.mTouchHistoryLastAcceptedTime = 0;
    }

    /**
     * Accepts MotionEvents and dispatches events to a {@link OnScaleGestureListener}
     * when appropriate.
     *
     * <p>Applications should pass a complete and consistent event stream to this method.
     * A complete and consistent event stream involves all MotionEvents from the initial
     * ACTION_DOWN to the final ACTION_UP or ACTION_CANCEL.</p>
     *
     * @param event The event to process
     * @return true if the event was processed and the detector wants to receive the
     *         rest of the MotionEvents in this event stream.
     */
    onTouchEvent(event:MotionEvent):boolean  {
        //if (this.mInputEventConsistencyVerifier != null) {
        //    this.mInputEventConsistencyVerifier.onTouchEvent(event, 0);
        //}
        this.mCurrTime = event.getEventTime();
        const action:number = event.getActionMasked();
        // Forward the event to check for double tap gesture
        if (this.mQuickScaleEnabled) {
            this.mGestureDetector.onTouchEvent(event);
        }
        const streamComplete:boolean = action == MotionEvent.ACTION_UP || action == MotionEvent.ACTION_CANCEL;
        if (action == MotionEvent.ACTION_DOWN || streamComplete) {
            // This means the app probably didn't give us all the events. Shame on it.
            if (this.mInProgress) {
                this.mListener.onScaleEnd(this);
                this.mInProgress = false;
                this.mInitialSpan = 0;
                this.mDoubleTapMode = ScaleGestureDetector.DOUBLE_TAP_MODE_NONE;
            } else if (this.mDoubleTapMode == ScaleGestureDetector.DOUBLE_TAP_MODE_IN_PROGRESS && streamComplete) {
                this.mInProgress = false;
                this.mInitialSpan = 0;
                this.mDoubleTapMode = ScaleGestureDetector.DOUBLE_TAP_MODE_NONE;
            }
            if (streamComplete) {
                this.clearTouchHistory();
                return true;
            }
        }
        const configChanged:boolean = action == MotionEvent.ACTION_DOWN || action == MotionEvent.ACTION_POINTER_UP || action == MotionEvent.ACTION_POINTER_DOWN;
        const pointerUp:boolean = action == MotionEvent.ACTION_POINTER_UP;
        const skipIndex:number = pointerUp ? event.getActionIndex() : -1;
        // Determine focal point
        let sumX:number = 0, sumY:number = 0;
        const count:number = event.getPointerCount();
        const div:number = pointerUp ? count - 1 : count;
        let focusX:number;
        let focusY:number;
        if (this.mDoubleTapMode == ScaleGestureDetector.DOUBLE_TAP_MODE_IN_PROGRESS) {
            // In double tap mode, the focal pt is always where the double tap
            // gesture started
            focusX = this.mDoubleTapEvent.getX();
            focusY = this.mDoubleTapEvent.getY();
            if (event.getY() < focusY) {
                this.mEventBeforeOrAboveStartingGestureEvent = true;
            } else {
                this.mEventBeforeOrAboveStartingGestureEvent = false;
            }
        } else {
            for (let i:number = 0; i < count; i++) {
                if (skipIndex == i)
                    continue;
                sumX += event.getX(i);
                sumY += event.getY(i);
            }
            focusX = sumX / div;
            focusY = sumY / div;
        }
        this.addTouchHistory(event);
        // Determine average deviation from focal point
        let devSumX:number = 0, devSumY:number = 0;
        for (let i:number = 0; i < count; i++) {
            if (skipIndex == i)
                continue;
            // Convert the resulting diameter into a radius.
            const touchSize:number = this.mTouchHistoryLastAccepted / 2;
            devSumX += Math.abs(event.getX(i) - focusX) + touchSize;
            devSumY += Math.abs(event.getY(i) - focusY) + touchSize;
        }
        const devX:number = devSumX / div;
        const devY:number = devSumY / div;
        // Span is the average distance between touch points through the focal point;
        // i.e. the diameter of the circle with a radius of the average deviation from
        // the focal point.
        const spanX:number = devX * 2;
        const spanY:number = devY * 2;
        let span:number;
        if (this.inDoubleTapMode()) {
            span = spanY;
        } else {
            span = Math.sqrt(spanX * spanX + spanY * spanY);
        }
        // Dispatch begin/end events as needed.
        // If the configuration changes, notify the app to reset its current state by beginning
        // a fresh scale event stream.
        const wasInProgress:boolean = this.mInProgress;
        this.mFocusX = focusX;
        this.mFocusY = focusY;
        if (!this.inDoubleTapMode() && this.mInProgress && (span < this.mMinSpan || configChanged)) {
            this.mListener.onScaleEnd(this);
            this.mInProgress = false;
            this.mInitialSpan = span;
            this.mDoubleTapMode = ScaleGestureDetector.DOUBLE_TAP_MODE_NONE;
        }
        if (configChanged) {
            this.mPrevSpanX = this.mCurrSpanX = spanX;
            this.mPrevSpanY = this.mCurrSpanY = spanY;
            this.mInitialSpan = this.mPrevSpan = this.mCurrSpan = span;
        }
        const minSpan:number = this.inDoubleTapMode() ? this.mSpanSlop : this.mMinSpan;
        if (!this.mInProgress && span >= minSpan && (wasInProgress || Math.abs(span - this.mInitialSpan) > this.mSpanSlop)) {
            this.mPrevSpanX = this.mCurrSpanX = spanX;
            this.mPrevSpanY = this.mCurrSpanY = spanY;
            this.mPrevSpan = this.mCurrSpan = span;
            this.mPrevTime = this.mCurrTime;
            this.mInProgress = this.mListener.onScaleBegin(this);
        }
        // Handle motion; focal point and span/scale factor are changing.
        if (action == MotionEvent.ACTION_MOVE) {
            this.mCurrSpanX = spanX;
            this.mCurrSpanY = spanY;
            this.mCurrSpan = span;
            let updatePrev:boolean = true;
            if (this.mInProgress) {
                updatePrev = this.mListener.onScale(this);
            }
            if (updatePrev) {
                this.mPrevSpanX = this.mCurrSpanX;
                this.mPrevSpanY = this.mCurrSpanY;
                this.mPrevSpan = this.mCurrSpan;
                this.mPrevTime = this.mCurrTime;
            }
        }
        return true;
    }

    private inDoubleTapMode():boolean  {
        return this.mDoubleTapMode == ScaleGestureDetector.DOUBLE_TAP_MODE_IN_PROGRESS;
    }

    /**
     * Set whether the associated {@link OnScaleGestureListener} should receive onScale callbacks
     * when the user performs a doubleTap followed by a swipe. Note that this is enabled by default
     * if the app targets API 19 and newer.
     * @param scales true to enable quick scaling, false to disable
     */
    setQuickScaleEnabled(scales:boolean):void  {
        this.mQuickScaleEnabled = scales;
        if (this.mQuickScaleEnabled && this.mGestureDetector == null) {
            let gestureListener:GestureDetector.SimpleOnGestureListener = (()=>{
                const inner_this=this;
                class _Inner extends GestureDetector.SimpleOnGestureListener {

                    onDoubleTap(e:MotionEvent):boolean  {
                        // Double tap: start watching for a swipe
                        inner_this.mDoubleTapEvent = e;
                        inner_this.mDoubleTapMode = ScaleGestureDetector.DOUBLE_TAP_MODE_IN_PROGRESS;
                        return true;
                    }
                }
                return new _Inner();
            })();
            this.mGestureDetector = new GestureDetector(gestureListener, this.mHandler);
        }
    }

    /**
   * Return whether the quick scale gesture, in which the user performs a double tap followed by a
   * swipe, should perform scaling. {@see #setQuickScaleEnabled(boolean)}.
   */
    isQuickScaleEnabled():boolean  {
        return this.mQuickScaleEnabled;
    }

    /**
     * Returns {@code true} if a scale gesture is in progress.
     */
    isInProgress():boolean  {
        return this.mInProgress;
    }

    /**
     * Get the X coordinate of the current gesture's focal point.
     * If a gesture is in progress, the focal point is between
     * each of the pointers forming the gesture.
     *
     * If {@link #isInProgress()} would return false, the result of this
     * function is undefined.
     *
     * @return X coordinate of the focal point in pixels.
     */
    getFocusX():number  {
        return this.mFocusX;
    }

    /**
     * Get the Y coordinate of the current gesture's focal point.
     * If a gesture is in progress, the focal point is between
     * each of the pointers forming the gesture.
     *
     * If {@link #isInProgress()} would return false, the result of this
     * function is undefined.
     *
     * @return Y coordinate of the focal point in pixels.
     */
    getFocusY():number  {
        return this.mFocusY;
    }

    /**
     * Return the average distance between each of the pointers forming the
     * gesture in progress through the focal point.
     *
     * @return Distance between pointers in pixels.
     */
    getCurrentSpan():number  {
        return this.mCurrSpan;
    }

    /**
     * Return the average X distance between each of the pointers forming the
     * gesture in progress through the focal point.
     *
     * @return Distance between pointers in pixels.
     */
    getCurrentSpanX():number  {
        return this.mCurrSpanX;
    }

    /**
     * Return the average Y distance between each of the pointers forming the
     * gesture in progress through the focal point.
     *
     * @return Distance between pointers in pixels.
     */
    getCurrentSpanY():number  {
        return this.mCurrSpanY;
    }

    /**
     * Return the previous average distance between each of the pointers forming the
     * gesture in progress through the focal point.
     *
     * @return Previous distance between pointers in pixels.
     */
    getPreviousSpan():number  {
        return this.mPrevSpan;
    }

    /**
     * Return the previous average X distance between each of the pointers forming the
     * gesture in progress through the focal point.
     *
     * @return Previous distance between pointers in pixels.
     */
    getPreviousSpanX():number  {
        return this.mPrevSpanX;
    }

    /**
     * Return the previous average Y distance between each of the pointers forming the
     * gesture in progress through the focal point.
     *
     * @return Previous distance between pointers in pixels.
     */
    getPreviousSpanY():number  {
        return this.mPrevSpanY;
    }

    /**
     * Return the scaling factor from the previous scale event to the current
     * event. This value is defined as
     * ({@link #getCurrentSpan()} / {@link #getPreviousSpan()}).
     *
     * @return The current scaling factor.
     */
    getScaleFactor():number  {
        if (this.inDoubleTapMode()) {
            // Drag is moving up; the further away from the gesture
            // start, the smaller the span should be, the closer,
            // the larger the span, and therefore the larger the scale
            const scaleUp:boolean = (this.mEventBeforeOrAboveStartingGestureEvent && (this.mCurrSpan < this.mPrevSpan)) || (!this.mEventBeforeOrAboveStartingGestureEvent && (this.mCurrSpan > this.mPrevSpan));
            const spanDiff:number = (Math.abs(1 - (this.mCurrSpan / this.mPrevSpan)) * ScaleGestureDetector.SCALE_FACTOR);
            return this.mPrevSpan <= 0 ? 1 : scaleUp ? (1 + spanDiff) : (1 - spanDiff);
        }
        return this.mPrevSpan > 0 ? this.mCurrSpan / this.mPrevSpan : 1;
    }

    /**
     * Return the time difference in milliseconds between the previous
     * accepted scaling event and the current scaling event.
     *
     * @return Time difference since the last scaling event in milliseconds.
     */
    getTimeDelta():number  {
        return this.mCurrTime - this.mPrevTime;
    }

    /**
     * Return the event time of the current event being processed.
     *
     * @return Current event time in milliseconds.
     */
    getEventTime():number  {
        return this.mCurrTime;
    }
}

export module ScaleGestureDetector{
/**
     * The listener for receiving notifications when gestures occur.
     * If you want to listen for all the different gestures then implement
     * this interface. If you only want to listen for a subset it might
     * be easier to extend {@link SimpleOnScaleGestureListener}.
     *
     * An application will receive events in the following order:
     * <ul>
     *  <li>One {@link OnScaleGestureListener#onScaleBegin(ScaleGestureDetector)}
     *  <li>Zero or more {@link OnScaleGestureListener#onScale(ScaleGestureDetector)}
     *  <li>One {@link OnScaleGestureListener#onScaleEnd(ScaleGestureDetector)}
     * </ul>
     */
export interface OnScaleGestureListener {

    /**
         * Responds to scaling events for a gesture in progress.
         * Reported by pointer motion.
         *
         * @param detector The detector reporting the event - use this to
         *          retrieve extended info about event state.
         * @return Whether or not the detector should consider this event
         *          as handled. If an event was not handled, the detector
         *          will continue to accumulate movement until an event is
         *          handled. This can be useful if an application, for example,
         *          only wants to update scaling factors if the change is
         *          greater than 0.01.
         */
    onScale(detector:ScaleGestureDetector):boolean ;

    /**
         * Responds to the beginning of a scaling gesture. Reported by
         * new pointers going down.
         *
         * @param detector The detector reporting the event - use this to
         *          retrieve extended info about event state.
         * @return Whether or not the detector should continue recognizing
         *          this gesture. For example, if a gesture is beginning
         *          with a focal point outside of a region where it makes
         *          sense, onScaleBegin() may return false to ignore the
         *          rest of the gesture.
         */
    onScaleBegin(detector:ScaleGestureDetector):boolean ;

    /**
         * Responds to the end of a scale gesture. Reported by existing
         * pointers going up.
         *
         * Once a scale has ended, {@link ScaleGestureDetector#getFocusX()}
         * and {@link ScaleGestureDetector#getFocusY()} will return focal point
         * of the pointers remaining on the screen.
         *
         * @param detector The detector reporting the event - use this to
         *          retrieve extended info about event state.
         */
    onScaleEnd(detector:ScaleGestureDetector):void ;
}
/**
     * A convenience class to extend when you only want to listen for a subset
     * of scaling-related events. This implements all methods in
     * {@link OnScaleGestureListener} but does nothing.
     * {@link OnScaleGestureListener#onScale(ScaleGestureDetector)} returns
     * {@code false} so that a subclass can retrieve the accumulated scale
     * factor in an overridden onScaleEnd.
     * {@link OnScaleGestureListener#onScaleBegin(ScaleGestureDetector)} returns
     * {@code true}.
     */
export class SimpleOnScaleGestureListener implements ScaleGestureDetector.OnScaleGestureListener {

    onScale(detector:ScaleGestureDetector):boolean  {
        return false;
    }

    onScaleBegin(detector:ScaleGestureDetector):boolean  {
        return true;
    }

    onScaleEnd(detector:ScaleGestureDetector):void  {
    // Intentionally empty
    }
}
}

}
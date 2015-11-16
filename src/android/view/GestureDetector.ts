/*
 * Copyright (C) 2008 The Android Open Source Project
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

///<reference path="../../android/os/Handler.ts"/>
///<reference path="../../android/os/Message.ts"/>
///<reference path="../../android/view/MotionEvent.ts"/>
///<reference path="../../android/view/VelocityTracker.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewConfiguration.ts"/>

module android.view {
import Handler = android.os.Handler;
import Message = android.os.Message;
import MotionEvent = android.view.MotionEvent;
import VelocityTracker = android.view.VelocityTracker;
import View = android.view.View;
import ViewConfiguration = android.view.ViewConfiguration;
/**
 * Detects various gestures and events using the supplied {@link MotionEvent}s.
 * The {@link OnGestureListener} callback will notify users when a particular
 * motion event has occurred. This class should only be used with {@link MotionEvent}s
 * reported via touch (don't use for trackball events).
 *
 * To use this class:
 * <ul>
 *  <li>Create an instance of the {@code GestureDetector} for your {@link View}
 *  <li>In the {@link View#onTouchEvent(MotionEvent)} method ensure you call
 *          {@link #onTouchEvent(MotionEvent)}. The methods defined in your callback
 *          will be executed when the events occur.
 * </ul>
 */
export class GestureDetector {







    private mTouchSlopSquare:number = 0;

    private mDoubleTapTouchSlopSquare:number = 0;

    private mDoubleTapSlopSquare:number = 0;

    private mMinimumFlingVelocity:number = 0;

    private mMaximumFlingVelocity:number = 0;

    private static LONGPRESS_TIMEOUT:number = ViewConfiguration.getLongPressTimeout();

    private static TAP_TIMEOUT:number = ViewConfiguration.getTapTimeout();

    private static DOUBLE_TAP_TIMEOUT:number = ViewConfiguration.getDoubleTapTimeout();

    private static DOUBLE_TAP_MIN_TIME:number = ViewConfiguration.getDoubleTapMinTime();

    // constants for Message.what used by GestureHandler below
    private static SHOW_PRESS:number = 1;

    private static LONG_PRESS:number = 2;

    private static TAP:number = 3;

    private mHandler:Handler;

    private mListener:GestureDetector.OnGestureListener;

    private mDoubleTapListener:GestureDetector.OnDoubleTapListener;

    private mStillDown:boolean;

    private mDeferConfirmSingleTap:boolean;

    private mInLongPress:boolean;

    private mAlwaysInTapRegion:boolean;

    private mAlwaysInBiggerTapRegion:boolean;

    private mCurrentDownEvent:MotionEvent;

    private mPreviousUpEvent:MotionEvent;

    /**
     * True when the user is still touching for the second tap (down, move, and
     * up events). Can only be true if there is a double tap listener attached.
     */
    private mIsDoubleTapping:boolean;

    private mLastFocusX:number = 0;

    private mLastFocusY:number = 0;

    private mDownFocusX:number = 0;

    private mDownFocusY:number = 0;

    private mIsLongpressEnabled:boolean;

    /**
     * Determines speed during touch scrolling
     */
    private mVelocityTracker:VelocityTracker;

    /**
     * Consistency verifier for debugging purposes.
     */
    //private mInputEventConsistencyVerifier:InputEventConsistencyVerifier
    // = InputEventConsistencyVerifier.isInstrumentationEnabled() ? new InputEventConsistencyVerifier(this, 0) : null;


    /**
     * Creates a GestureDetector with the supplied listener that runs deferred events on the
     * thread associated with the supplied {@link android.os.Handler}.
     * @see android.os.Handler#Handler()
     *
     * @param listener the listener invoked for all the callbacks, this must
     * not be null.
     * @param handler the handler to use for running deferred listener events.
     *
     * @throws NullPointerException if {@code listener} is null.
     */
    constructor(listener:GestureDetector.OnGestureListener, handler?) {
        this.mHandler = new GestureDetector.GestureHandler(this);
        this.mListener = listener;
        if (listener['setOnDoubleTapListener']) {
            this.setOnDoubleTapListener(<GestureDetector.OnDoubleTapListener><any>listener);
        }
        this.init();
    }

    private init():void  {
        if (this.mListener == null) {
            throw Error(`new NullPointerException("OnGestureListener must not be null")`);
        }
        this.mIsLongpressEnabled = true;
        // Fallback to support pre-donuts releases
        let touchSlop:number, doubleTapSlop:number, doubleTapTouchSlop:number;
        const configuration:ViewConfiguration = ViewConfiguration.get();
        touchSlop = configuration.getScaledTouchSlop();
        doubleTapTouchSlop = configuration.getScaledDoubleTapTouchSlop();
        doubleTapSlop = configuration.getScaledDoubleTapSlop();
        this.mMinimumFlingVelocity = configuration.getScaledMinimumFlingVelocity();
        this.mMaximumFlingVelocity = configuration.getScaledMaximumFlingVelocity();
        this.mTouchSlopSquare = touchSlop * touchSlop;
        this.mDoubleTapTouchSlopSquare = doubleTapTouchSlop * doubleTapTouchSlop;
        this.mDoubleTapSlopSquare = doubleTapSlop * doubleTapSlop;
    }

    /**
     * Sets the listener which will be called for double-tap and related
     * gestures.
     * 
     * @param onDoubleTapListener the listener invoked for all the callbacks, or
     *        null to stop listening for double-tap gestures.
     */
    setOnDoubleTapListener(onDoubleTapListener:GestureDetector.OnDoubleTapListener):void  {
        this.mDoubleTapListener = onDoubleTapListener;
    }

    /**
     * Set whether longpress is enabled, if this is enabled when a user
     * presses and holds down you get a longpress event and nothing further.
     * If it's disabled the user can press and hold down and then later
     * moved their finger and you will get scroll events. By default
     * longpress is enabled.
     *
     * @param isLongpressEnabled whether longpress should be enabled.
     */
    setIsLongpressEnabled(isLongpressEnabled:boolean):void  {
        this.mIsLongpressEnabled = isLongpressEnabled;
    }

    /**
     * @return true if longpress is enabled, else false.
     */
    isLongpressEnabled():boolean  {
        return this.mIsLongpressEnabled;
    }

    /**
     * Analyzes the given motion event and if applicable triggers the
     * appropriate callbacks on the {@link OnGestureListener} supplied.
     *
     * @param ev The current motion event.
     * @return true if the {@link OnGestureListener} consumed the event,
     *              else false.
     */
    onTouchEvent(ev:MotionEvent):boolean  {
        //if (this.mInputEventConsistencyVerifier != null) {
        //    this.mInputEventConsistencyVerifier.onTouchEvent(ev, 0);
        //}
        const action:number = ev.getAction();
        if (this.mVelocityTracker == null) {
            this.mVelocityTracker = VelocityTracker.obtain();
        }
        this.mVelocityTracker.addMovement(ev);
        const pointerUp:boolean = (action & MotionEvent.ACTION_MASK) == MotionEvent.ACTION_POINTER_UP;
        const skipIndex:number = pointerUp ? ev.getActionIndex() : -1;
        // Determine focal point
        let sumX:number = 0, sumY:number = 0;
        const count:number = ev.getPointerCount();
        for (let i:number = 0; i < count; i++) {
            if (skipIndex == i)
                continue;
            sumX += ev.getX(i);
            sumY += ev.getY(i);
        }
        const div:number = pointerUp ? count - 1 : count;
        const focusX:number = sumX / div;
        const focusY:number = sumY / div;
        let handled:boolean = false;
        switch(action & MotionEvent.ACTION_MASK) {
            case MotionEvent.ACTION_POINTER_DOWN:
                this.mDownFocusX = this.mLastFocusX = focusX;
                this.mDownFocusY = this.mLastFocusY = focusY;
                // Cancel long press and taps
                this.cancelTaps();
                break;
            case MotionEvent.ACTION_POINTER_UP:
                this.mDownFocusX = this.mLastFocusX = focusX;
                this.mDownFocusY = this.mLastFocusY = focusY;
                // Check the dot product of current velocities.
                // If the pointer that left was opposing another velocity vector, clear.
                this.mVelocityTracker.computeCurrentVelocity(1000, this.mMaximumFlingVelocity);
                const upIndex:number = ev.getActionIndex();
                const id1:number = ev.getPointerId(upIndex);
                const x1:number = this.mVelocityTracker.getXVelocity(id1);
                const y1:number = this.mVelocityTracker.getYVelocity(id1);
                for (let i:number = 0; i < count; i++) {
                    if (i == upIndex)
                        continue;
                    const id2:number = ev.getPointerId(i);
                    const x:number = x1 * this.mVelocityTracker.getXVelocity(id2);
                    const y:number = y1 * this.mVelocityTracker.getYVelocity(id2);
                    const dot:number = x + y;
                    if (dot < 0) {
                        this.mVelocityTracker.clear();
                        break;
                    }
                }
                break;
            case MotionEvent.ACTION_DOWN:
                if (this.mDoubleTapListener != null) {
                    let hadTapMessage:boolean = this.mHandler.hasMessages(GestureDetector.TAP);
                    if (hadTapMessage)
                        this.mHandler.removeMessages(GestureDetector.TAP);
                    if ((this.mCurrentDownEvent != null) && (this.mPreviousUpEvent != null) && hadTapMessage && this.isConsideredDoubleTap(this.mCurrentDownEvent, this.mPreviousUpEvent, ev)) {
                        // This is a second tap
                        this.mIsDoubleTapping = true;
                        // Give a callback with the first tap of the double-tap
                        handled = this.mDoubleTapListener.onDoubleTap(this.mCurrentDownEvent) || handled;
                        // Give a callback with down event of the double-tap
                        handled = this.mDoubleTapListener.onDoubleTapEvent(ev) || handled;
                    } else {
                        // This is a first tap
                        this.mHandler.sendEmptyMessageDelayed(GestureDetector.TAP, GestureDetector.DOUBLE_TAP_TIMEOUT);
                    }
                }
                this.mDownFocusX = this.mLastFocusX = focusX;
                this.mDownFocusY = this.mLastFocusY = focusY;
                if (this.mCurrentDownEvent != null) {
                    this.mCurrentDownEvent.recycle();
                }
                this.mCurrentDownEvent = MotionEvent.obtain(ev);
                this.mAlwaysInTapRegion = true;
                this.mAlwaysInBiggerTapRegion = true;
                this.mStillDown = true;
                this.mInLongPress = false;
                this.mDeferConfirmSingleTap = false;
                if (this.mIsLongpressEnabled) {
                    this.mHandler.removeMessages(GestureDetector.LONG_PRESS);
                    this.mHandler.sendEmptyMessageAtTime(GestureDetector.LONG_PRESS, this.mCurrentDownEvent.getDownTime() + GestureDetector.TAP_TIMEOUT + GestureDetector.LONGPRESS_TIMEOUT);
                }
                this.mHandler.sendEmptyMessageAtTime(GestureDetector.SHOW_PRESS, this.mCurrentDownEvent.getDownTime() + GestureDetector.TAP_TIMEOUT);
                handled = this.mListener.onDown(ev) || handled;
                break;
            case MotionEvent.ACTION_MOVE:
                if (this.mInLongPress) {
                    break;
                }
                const scrollX:number = this.mLastFocusX - focusX;
                const scrollY:number = this.mLastFocusY - focusY;
                if (this.mIsDoubleTapping) {
                    // Give the move events of the double-tap
                    handled = this.mDoubleTapListener.onDoubleTapEvent(ev) || handled;
                } else if (this.mAlwaysInTapRegion) {
                    const deltaX:number = Math.floor((focusX - this.mDownFocusX));
                    const deltaY:number = Math.floor((focusY - this.mDownFocusY));
                    let distance:number = (deltaX * deltaX) + (deltaY * deltaY);
                    if (distance > this.mTouchSlopSquare) {
                        handled = this.mListener.onScroll(this.mCurrentDownEvent, ev, scrollX, scrollY);
                        this.mLastFocusX = focusX;
                        this.mLastFocusY = focusY;
                        this.mAlwaysInTapRegion = false;
                        this.mHandler.removeMessages(GestureDetector.TAP);
                        this.mHandler.removeMessages(GestureDetector.SHOW_PRESS);
                        this.mHandler.removeMessages(GestureDetector.LONG_PRESS);
                    }
                    if (distance > this.mDoubleTapTouchSlopSquare) {
                        this.mAlwaysInBiggerTapRegion = false;
                    }
                } else if ((Math.abs(scrollX) >= 1) || (Math.abs(scrollY) >= 1)) {
                    handled = this.mListener.onScroll(this.mCurrentDownEvent, ev, scrollX, scrollY);
                    this.mLastFocusX = focusX;
                    this.mLastFocusY = focusY;
                }
                break;
            case MotionEvent.ACTION_UP:
                this.mStillDown = false;
                let currentUpEvent:MotionEvent = MotionEvent.obtain(ev);
                if (this.mIsDoubleTapping) {
                    // Finally, give the up event of the double-tap
                    handled = this.mDoubleTapListener.onDoubleTapEvent(ev) || handled;
                } else if (this.mInLongPress) {
                    this.mHandler.removeMessages(GestureDetector.TAP);
                    this.mInLongPress = false;
                } else if (this.mAlwaysInTapRegion) {
                    handled = this.mListener.onSingleTapUp(ev);
                    if (this.mDeferConfirmSingleTap && this.mDoubleTapListener != null) {
                        this.mDoubleTapListener.onSingleTapConfirmed(ev);
                    }
                } else {
                    // A fling must travel the minimum tap distance
                    const velocityTracker:VelocityTracker = this.mVelocityTracker;
                    const pointerId:number = ev.getPointerId(0);
                    velocityTracker.computeCurrentVelocity(1000, this.mMaximumFlingVelocity);
                    const velocityY:number = velocityTracker.getYVelocity(pointerId);
                    const velocityX:number = velocityTracker.getXVelocity(pointerId);
                    if ((Math.abs(velocityY) > this.mMinimumFlingVelocity) || (Math.abs(velocityX) > this.mMinimumFlingVelocity)) {
                        handled = this.mListener.onFling(this.mCurrentDownEvent, ev, velocityX, velocityY);
                    }
                }
                if (this.mPreviousUpEvent != null) {
                    this.mPreviousUpEvent.recycle();
                }
                // Hold the event we obtained above - listeners may have changed the original.
                this.mPreviousUpEvent = currentUpEvent;
                if (this.mVelocityTracker != null) {
                    // This may have been cleared when we called out to the
                    // application above.
                    this.mVelocityTracker.recycle();
                    this.mVelocityTracker = null;
                }
                this.mIsDoubleTapping = false;
                this.mDeferConfirmSingleTap = false;
                this.mHandler.removeMessages(GestureDetector.SHOW_PRESS);
                this.mHandler.removeMessages(GestureDetector.LONG_PRESS);
                break;
            case MotionEvent.ACTION_CANCEL:
                this.cancel();
                break;
        }
        //if (!handled && this.mInputEventConsistencyVerifier != null) {
        //    this.mInputEventConsistencyVerifier.onUnhandledEvent(ev, 0);
        //}
        return handled;
    }

    private cancel():void  {
        this.mHandler.removeMessages(GestureDetector.SHOW_PRESS);
        this.mHandler.removeMessages(GestureDetector.LONG_PRESS);
        this.mHandler.removeMessages(GestureDetector.TAP);
        this.mVelocityTracker.recycle();
        this.mVelocityTracker = null;
        this.mIsDoubleTapping = false;
        this.mStillDown = false;
        this.mAlwaysInTapRegion = false;
        this.mAlwaysInBiggerTapRegion = false;
        this.mDeferConfirmSingleTap = false;
        if (this.mInLongPress) {
            this.mInLongPress = false;
        }
    }

    private cancelTaps():void  {
        this.mHandler.removeMessages(GestureDetector.SHOW_PRESS);
        this.mHandler.removeMessages(GestureDetector.LONG_PRESS);
        this.mHandler.removeMessages(GestureDetector.TAP);
        this.mIsDoubleTapping = false;
        this.mAlwaysInTapRegion = false;
        this.mAlwaysInBiggerTapRegion = false;
        this.mDeferConfirmSingleTap = false;
        if (this.mInLongPress) {
            this.mInLongPress = false;
        }
    }

    private isConsideredDoubleTap(firstDown:MotionEvent, firstUp:MotionEvent, secondDown:MotionEvent):boolean  {
        if (!this.mAlwaysInBiggerTapRegion) {
            return false;
        }
        const deltaTime:number = secondDown.getEventTime() - firstUp.getEventTime();
        if (deltaTime > GestureDetector.DOUBLE_TAP_TIMEOUT || deltaTime < GestureDetector.DOUBLE_TAP_MIN_TIME) {
            return false;
        }
        let deltaX:number = Math.floor(firstDown.getX()) - Math.floor(secondDown.getX());
        let deltaY:number = Math.floor(firstDown.getY()) - Math.floor(secondDown.getY());
        return (deltaX * deltaX + deltaY * deltaY < this.mDoubleTapSlopSquare);
    }

    private dispatchLongPress():void  {
        this.mHandler.removeMessages(GestureDetector.TAP);
        this.mDeferConfirmSingleTap = false;
        this.mInLongPress = true;
        this.mListener.onLongPress(this.mCurrentDownEvent);
    }
}

export module GestureDetector{
/**
     * The listener that is used to notify when gestures occur.
     * If you want to listen for all the different gestures then implement
     * this interface. If you only want to listen for a subset it might
     * be easier to extend {@link SimpleOnGestureListener}.
     */
export interface OnGestureListener {

    /**
         * Notified when a tap occurs with the down {@link MotionEvent}
         * that triggered it. This will be triggered immediately for
         * every down event. All other events should be preceded by this.
         *
         * @param e The down motion event.
         */
    onDown(e:MotionEvent):boolean ;

    /**
         * The user has performed a down {@link MotionEvent} and not performed
         * a move or up yet. This event is commonly used to provide visual
         * feedback to the user to let them know that their action has been
         * recognized i.e. highlight an element.
         *
         * @param e The down motion event
         */
    onShowPress(e:MotionEvent):void ;

    /**
         * Notified when a tap occurs with the up {@link MotionEvent}
         * that triggered it.
         *
         * @param e The up motion event that completed the first tap
         * @return true if the event is consumed, else false
         */
    onSingleTapUp(e:MotionEvent):boolean ;

    /**
         * Notified when a scroll occurs with the initial on down {@link MotionEvent} and the
         * current move {@link MotionEvent}. The distance in x and y is also supplied for
         * convenience.
         *
         * @param e1 The first down motion event that started the scrolling.
         * @param e2 The move motion event that triggered the current onScroll.
         * @param distanceX The distance along the X axis that has been scrolled since the last
         *              call to onScroll. This is NOT the distance between {@code e1}
         *              and {@code e2}.
         * @param distanceY The distance along the Y axis that has been scrolled since the last
         *              call to onScroll. This is NOT the distance between {@code e1}
         *              and {@code e2}.
         * @return true if the event is consumed, else false
         */
    onScroll(e1:MotionEvent, e2:MotionEvent, distanceX:number, distanceY:number):boolean ;

    /**
         * Notified when a long press occurs with the initial on down {@link MotionEvent}
         * that trigged it.
         *
         * @param e The initial on down motion event that started the longpress.
         */
    onLongPress(e:MotionEvent):void ;

    /**
         * Notified of a fling event when it occurs with the initial on down {@link MotionEvent}
         * and the matching up {@link MotionEvent}. The calculated velocity is supplied along
         * the x and y axis in pixels per second.
         *
         * @param e1 The first down motion event that started the fling.
         * @param e2 The move motion event that triggered the current onFling.
         * @param velocityX The velocity of this fling measured in pixels per second
         *              along the x axis.
         * @param velocityY The velocity of this fling measured in pixels per second
         *              along the y axis.
         * @return true if the event is consumed, else false
         */
    onFling(e1:MotionEvent, e2:MotionEvent, velocityX:number, velocityY:number):boolean ;
}
/**
     * The listener that is used to notify when a double-tap or a confirmed
     * single-tap occur.
     */
export interface OnDoubleTapListener {

    /**
         * Notified when a single-tap occurs.
         * <p>
         * Unlike {@link OnGestureListener#onSingleTapUp(MotionEvent)}, this
         * will only be called after the detector is confident that the user's
         * first tap is not followed by a second tap leading to a double-tap
         * gesture.
         *
         * @param e The down motion event of the single-tap.
         * @return true if the event is consumed, else false
         */
    onSingleTapConfirmed(e:MotionEvent):boolean ;

    /**
         * Notified when a double-tap occurs.
         *
         * @param e The down motion event of the first tap of the double-tap.
         * @return true if the event is consumed, else false
         */
    onDoubleTap(e:MotionEvent):boolean ;

    /**
         * Notified when an event within a double-tap gesture occurs, including
         * the down, move, and up events.
         *
         * @param e The motion event that occurred during the double-tap gesture.
         * @return true if the event is consumed, else false
         */
    onDoubleTapEvent(e:MotionEvent):boolean ;
}
/**
     * A convenience class to extend when you only want to listen for a subset
     * of all the gestures. This implements all methods in the
     * {@link OnGestureListener} and {@link OnDoubleTapListener} but does
     * nothing and return {@code false} for all applicable methods.
     */
export class SimpleOnGestureListener implements GestureDetector.OnGestureListener, GestureDetector.OnDoubleTapListener {

    onSingleTapUp(e:MotionEvent):boolean  {
        return false;
    }

    onLongPress(e:MotionEvent):void  {
    }

    onScroll(e1:MotionEvent, e2:MotionEvent, distanceX:number, distanceY:number):boolean  {
        return false;
    }

    onFling(e1:MotionEvent, e2:MotionEvent, velocityX:number, velocityY:number):boolean  {
        return false;
    }

    onShowPress(e:MotionEvent):void  {
    }

    onDown(e:MotionEvent):boolean  {
        return false;
    }

    onDoubleTap(e:MotionEvent):boolean  {
        return false;
    }

    onDoubleTapEvent(e:MotionEvent):boolean  {
        return false;
    }

    onSingleTapConfirmed(e:MotionEvent):boolean  {
        return false;
    }
}
export class GestureHandler extends Handler {
    _GestureDetector_this:GestureDetector;
    constructor(arg:GestureDetector){
        super();
        this._GestureDetector_this = arg;
    }

    handleMessage(msg:Message):void  {
        switch(msg.what) {
            case GestureDetector.SHOW_PRESS:
                this._GestureDetector_this.mListener.onShowPress(this._GestureDetector_this.mCurrentDownEvent);
                break;
            case GestureDetector.LONG_PRESS:
                this._GestureDetector_this.dispatchLongPress();
                break;
            case GestureDetector.TAP:
                // If the user's finger is still down, do not count it as a tap
                if (this._GestureDetector_this.mDoubleTapListener != null) {
                    if (!this._GestureDetector_this.mStillDown) {
                        this._GestureDetector_this.mDoubleTapListener.onSingleTapConfirmed(this._GestureDetector_this.mCurrentDownEvent);
                    } else {
                        this._GestureDetector_this.mDeferConfirmSingleTap = true;
                    }
                }
                break;
            default:
                //never
                throw Error(`new RuntimeException("Unknown message " + msg)`);
        }
    }
}
}

}
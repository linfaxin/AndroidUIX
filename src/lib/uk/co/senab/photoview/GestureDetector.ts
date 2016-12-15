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

///<reference path="../../../../../android/util/Log.ts"/>
///<reference path="../../../../../android/view/MotionEvent.ts"/>
///<reference path="../../../../../android/view/ScaleGestureDetector.ts"/>
///<reference path="../../../../../android/view/VelocityTracker.ts"/>
///<reference path="../../../../../android/view/ViewConfiguration.ts"/>
///<reference path="../../../../../java/lang/Float.ts"/>

module uk.co.senab.photoview {
import Log = android.util.Log;
import MotionEvent = android.view.MotionEvent;
import ScaleGestureDetector = android.view.ScaleGestureDetector;
import VelocityTracker = android.view.VelocityTracker;
import ViewConfiguration = android.view.ViewConfiguration;
import Float = java.lang.Float;
export class GestureDetector {

    protected mListener:GestureDetector.OnGestureListener;

    private static LOG_TAG:string = "CupcakeGestureDetector";

    private static INVALID_POINTER_ID:number = -1;

    private mActivePointerId:number = GestureDetector.INVALID_POINTER_ID;

    private mActivePointerIndex:number = 0;

    mLastTouchX:number = 0;

    mLastTouchY:number = 0;

    mTouchSlop:number = 0;

    mMinimumVelocity:number = 0;

    protected mScaleDetector:ScaleGestureDetector;

    setOnGestureListener(listener:GestureDetector.OnGestureListener):void  {
        this.mListener = listener;
    }

    constructor() {
        const configuration:ViewConfiguration = ViewConfiguration.get();
        this.mMinimumVelocity = configuration.getScaledMinimumFlingVelocity();
        this.mTouchSlop = configuration.getScaledTouchSlop();

        const inner_this=this;
        let scaleListener:ScaleGestureDetector.OnScaleGestureListener = {
            onScale(detector:ScaleGestureDetector):boolean  {
                let scaleFactor:number = detector.getScaleFactor();
                if (Number.isNaN(scaleFactor) || !Number.isFinite(scaleFactor)) return false;
                inner_this.mListener.onScale(scaleFactor, detector.getFocusX(), detector.getFocusY());
                return true;
            },
            onScaleBegin(detector:ScaleGestureDetector):boolean  {
                return true;
            },
            onScaleEnd(detector:ScaleGestureDetector):void  {
                // NO-OP
            }
        };

        this.mScaleDetector = new ScaleGestureDetector(scaleListener);
    }

    private mVelocityTracker:VelocityTracker;

    private mIsDragging:boolean;

    getActiveX(ev:MotionEvent):number  {
        return ev.getX(this.mActivePointerIndex<0 ? 0 : this.mActivePointerIndex);
    }

    getActiveY(ev:MotionEvent):number  {
        return ev.getY(this.mActivePointerIndex<0 ? 0 : this.mActivePointerIndex);
    }

    isScaling():boolean  {
        return this.mScaleDetector.isInProgress();
    }

    isDragging():boolean  {
        return this.mIsDragging;
    }

    onTouchEvent(ev:MotionEvent):boolean  {
        this.mScaleDetector.onTouchEvent(ev);

        //get pointId
        const action:number = ev.getAction();
        switch(action & MotionEvent.ACTION_MASK) {
            case MotionEvent.ACTION_DOWN:
                this.mActivePointerId = ev.getPointerId(0);
                break;
            case MotionEvent.ACTION_CANCEL:
            case MotionEvent.ACTION_UP:
                this.mActivePointerId = GestureDetector.INVALID_POINTER_ID;
                break;
            case MotionEvent.ACTION_POINTER_UP:
                // Ignore deprecation, ACTION_POINTER_ID_MASK and
                // ACTION_POINTER_ID_SHIFT has same value and are deprecated
                // You can have either deprecation or lint target api warning
                // Compat.getPointerIndex(ev.getAction());
                const pointerIndex:number = ev.getActionIndex();
                const pointerId:number = ev.getPointerId(pointerIndex);
                if (pointerId == this.mActivePointerId) {
                    // This was our active pointer going up. Choose a new
                    // active pointer and adjust accordingly.
                    const newPointerIndex:number = pointerIndex == 0 ? 1 : 0;
                    this.mActivePointerId = ev.getPointerId(newPointerIndex);
                    this.mLastTouchX = ev.getX(newPointerIndex);
                    this.mLastTouchY = ev.getY(newPointerIndex);
                }
                break;
        }
        this.mActivePointerIndex = ev.findPointerIndex(this.mActivePointerId != GestureDetector.INVALID_POINTER_ID ? this.mActivePointerId : 0);
        switch(ev.getAction()) {
            case MotionEvent.ACTION_DOWN:
                {
                    this.mVelocityTracker = VelocityTracker.obtain();
                    if (null != this.mVelocityTracker) {
                        this.mVelocityTracker.addMovement(ev);
                    } else {
                        Log.i(GestureDetector.LOG_TAG, "Velocity tracker is null");
                    }
                    this.mLastTouchX = this.getActiveX(ev);
                    this.mLastTouchY = this.getActiveY(ev);
                    this.mIsDragging = false;
                    break;
                }
            case MotionEvent.ACTION_MOVE:
                {
                    const x:number = this.getActiveX(ev);
                    const y:number = this.getActiveY(ev);
                    const dx:number = x - this.mLastTouchX, dy:number = y - this.mLastTouchY;
                    if (!this.mIsDragging) {
                        // Use Pythagoras to see if drag length is larger than
                        // touch slop
                        this.mIsDragging = Math.sqrt((dx * dx) + (dy * dy)) >= this.mTouchSlop;
                    }
                    if (this.mIsDragging) {
                        this.mListener.onDrag(dx, dy);
                        this.mLastTouchX = x;
                        this.mLastTouchY = y;
                        if (null != this.mVelocityTracker) {
                            this.mVelocityTracker.addMovement(ev);
                        }
                    }
                    break;
                }
            case MotionEvent.ACTION_CANCEL:
                {
                    // Recycle Velocity Tracker
                    if (null != this.mVelocityTracker) {
                        this.mVelocityTracker.recycle();
                        this.mVelocityTracker = null;
                    }
                    break;
                }
            case MotionEvent.ACTION_UP:
                {
                    if (this.mIsDragging) {
                        if (null != this.mVelocityTracker) {
                            this.mLastTouchX = this.getActiveX(ev);
                            this.mLastTouchY = this.getActiveY(ev);
                            // Compute velocity within the last 1000ms
                            this.mVelocityTracker.addMovement(ev);
                            this.mVelocityTracker.computeCurrentVelocity(1000);
                            const vX:number = this.mVelocityTracker.getXVelocity(), vY:number = this.mVelocityTracker.getYVelocity();
                            // listener
                            if (Math.max(Math.abs(vX), Math.abs(vY)) >= this.mMinimumVelocity) {
                                this.mListener.onFling(this.mLastTouchX, this.mLastTouchY, -vX, -vY);
                            }
                        }
                    }
                    // Recycle Velocity Tracker
                    if (null != this.mVelocityTracker) {
                        this.mVelocityTracker.recycle();
                        this.mVelocityTracker = null;
                    }
                    break;
                }
        }
        return true;
    }


}

export module GestureDetector{
export interface OnGestureListener {

    onDrag(dx:number, dy:number):void ;

    onFling(startX:number, startY:number, velocityX:number, velocityY:number):void ;

    onScale(scaleFactor:number, focusX:number, focusY:number):void ;
}
}

}
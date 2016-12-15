/*
 * Copyright (C) 2013 The Android Open Source Project
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

///<reference path="../../../../android/view/MotionEvent.ts"/>
///<reference path="../../../../android/view/VelocityTracker.ts"/>
///<reference path="../../../../android/view/View.ts"/>
///<reference path="../../../../android/view/ViewConfiguration.ts"/>
///<reference path="../../../../android/view/ViewGroup.ts"/>
///<reference path="../../../../android/widget/OverScroller.ts"/>
///<reference path="../../../../android/view/animation/Interpolator.ts"/>
///<reference path="../../../../java/lang/System.ts"/>

module android.support.v4.widget {
import MotionEvent = android.view.MotionEvent;
import VelocityTracker = android.view.VelocityTracker;
import View = android.view.View;
import ViewConfiguration = android.view.ViewConfiguration;
import ViewGroup = android.view.ViewGroup;
import OverScroller = android.widget.OverScroller;
import Interpolator = android.view.animation.Interpolator;
import System = java.lang.System;
import Runnable = java.lang.Runnable;
/**
 * ViewDragHelper is a utility class for writing custom ViewGroups. It offers a number
 * of useful operations and state tracking for allowing a user to drag and reposition
 * views within their parent ViewGroup.
 */
export class ViewDragHelper {

    private static TAG:string = "ViewDragHelper";

    /**
     * A null/invalid pointer ID.
     */
    static INVALID_POINTER:number = -1;

    /**
     * A view is not currently being dragged or animating as a result of a fling/snap.
     */
    static STATE_IDLE:number = 0;

    /**
     * A view is currently being dragged. The position is currently changing as a result
     * of user input or simulated user input.
     */
    static STATE_DRAGGING:number = 1;

    /**
     * A view is currently settling into place as a result of a fling or
     * predefined non-interactive motion.
     */
    static STATE_SETTLING:number = 2;

    /**
     * Edge flag indicating that the left edge should be affected.
     */
    static EDGE_LEFT:number = 1 << 0;

    /**
     * Edge flag indicating that the right edge should be affected.
     */
    static EDGE_RIGHT:number = 1 << 1;

    /**
     * Edge flag indicating that the top edge should be affected.
     */
    static EDGE_TOP:number = 1 << 2;

    /**
     * Edge flag indicating that the bottom edge should be affected.
     */
    static EDGE_BOTTOM:number = 1 << 3;

    /**
     * Edge flag set indicating all edges should be affected.
     */
    static EDGE_ALL:number = ViewDragHelper.EDGE_LEFT | ViewDragHelper.EDGE_TOP | ViewDragHelper.EDGE_RIGHT | ViewDragHelper.EDGE_BOTTOM;

    /**
     * Indicates that a check should occur along the horizontal axis
     */
    static DIRECTION_HORIZONTAL:number = 1 << 0;

    /**
     * Indicates that a check should occur along the vertical axis
     */
    static DIRECTION_VERTICAL:number = 1 << 1;

    /**
     * Indicates that a check should occur along all axes
     */
    static DIRECTION_ALL:number = ViewDragHelper.DIRECTION_HORIZONTAL | ViewDragHelper.DIRECTION_VERTICAL;

    // dp
    private static EDGE_SIZE:number = 20;

    // ms
    private static BASE_SETTLE_DURATION:number = 256;

    // ms
    private static MAX_SETTLE_DURATION:number = 600;

    // Current drag state; idle, dragging or settling
    private mDragState:number = 0;

    // Distance to travel before a drag may begin
    private mTouchSlop:number = 0;

    // Last known position/pointer tracking
    private mActivePointerId:number = ViewDragHelper.INVALID_POINTER;

    private mInitialMotionX:number[];

    private mInitialMotionY:number[];

    private mLastMotionX:number[];

    private mLastMotionY:number[];

    private mInitialEdgesTouched:number[];

    private mEdgeDragsInProgress:number[];

    private mEdgeDragsLocked:number[];

    private mPointersDown:number = 0;

    private mVelocityTracker:VelocityTracker;

    private mMaxVelocity:number = 0;

    private mMinVelocity:number = 0;

    private mEdgeSize:number = 0;

    private mTrackingEdges:number = 0;

    private mScroller:OverScroller;

    private mCallback:ViewDragHelper.Callback;

    private mCapturedView:View;

    private mReleaseInProgress:boolean;

    private mParentView:ViewGroup;



    /**
     * Interpolator defining the animation curve for mScroller
     */
    private static sInterpolator:Interpolator = (()=>{
        class _Inner implements Interpolator {
            getInterpolation(t:number):number  {
                t -= 1.0;
                return t * t * t * t * t + 1.0;
            }
        }
        return new _Inner();
    })();

    private mSetIdleRunnable:Runnable = (()=>{
        const inner_this=this;
        class _Inner implements Runnable {
            run():void  {
                inner_this.setDragState(ViewDragHelper.STATE_IDLE);
            }
        }
        return new _Inner();
    })();

    /**
     * Factory method to create a new ViewDragHelper.
     *
     * @param forParent Parent view to monitor
     * @param cb Callback to provide information and receive events
     * @param sensitivity Multiplier for how sensitive the helper should be about detecting
     *                    the start of a drag. Larger values are more sensitive. 1.0f is normal.
     * @return a new ViewDragHelper instance
     */
    static create(forParent:ViewGroup, cb:ViewDragHelper.Callback):ViewDragHelper;
    static create(forParent:ViewGroup, sensitivity:number, cb:ViewDragHelper.Callback):ViewDragHelper;
    static create(...args):ViewDragHelper {
        if(args.length===2) return new ViewDragHelper(args[0], args[1]);
        else if(args.length===3){
            let [forParent, sensitivity, cb] = args;
            const helper:ViewDragHelper = ViewDragHelper.create(forParent, cb);
            helper.mTouchSlop = Math.floor((helper.mTouchSlop * (1 / sensitivity)));
            return helper;
        }
    }

    /**
     * Apps should use ViewDragHelper.create() to get a new instance.
     * This will allow VDH to use internal compatibility implementations for different
     * platform versions.
     *
     * @param forParent Parent view to monitor
     * @param cb Callback to provide information and receive events
     */
    constructor(forParent:ViewGroup, cb:ViewDragHelper.Callback) {
        if (forParent == null) {
            throw Error(`new IllegalArgumentException("Parent view may not be null")`);
        }
        if (cb == null) {
            throw Error(`new IllegalArgumentException("Callback may not be null")`);
        }
        this.mParentView = forParent;
        this.mCallback = cb;
        const vc:ViewConfiguration = ViewConfiguration.get();
        const density:number = android.content.res.Resources.getDisplayMetrics().density;
        this.mEdgeSize = Math.floor((ViewDragHelper.EDGE_SIZE * density + 0.5));
        this.mTouchSlop = vc.getScaledTouchSlop();
        this.mMaxVelocity = vc.getScaledMaximumFlingVelocity();
        this.mMinVelocity = vc.getScaledMinimumFlingVelocity();
        this.mScroller = new OverScroller(ViewDragHelper.sInterpolator);
    }

    /**
     * Set the minimum velocity that will be detected as having a magnitude greater than zero
     * in pixels per second. Callback methods accepting a velocity will be clamped appropriately.
     *
     * @param minVel Minimum velocity to detect
     */
    setMinVelocity(minVel:number):void  {
        this.mMinVelocity = minVel;
    }

    /**
     * Return the currently configured minimum velocity. Any flings with a magnitude less
     * than this value in pixels per second. Callback methods accepting a velocity will receive
     * zero as a velocity value if the real detected velocity was below this threshold.
     *
     * @return the minimum velocity that will be detected
     */
    getMinVelocity():number  {
        return this.mMinVelocity;
    }

    /**
     * Retrieve the current drag state of this helper. This will return one of
     * {@link #STATE_IDLE}, {@link #STATE_DRAGGING} or {@link #STATE_SETTLING}.
     * @return The current drag state
     */
    getViewDragState():number  {
        return this.mDragState;
    }

    /**
     * Enable edge tracking for the selected edges of the parent view.
     * The callback's {@link Callback#onEdgeTouched(int, int)} and
     * {@link Callback#onEdgeDragStarted(int, int)} methods will only be invoked
     * for edges for which edge tracking has been enabled.
     *
     * @param edgeFlags Combination of edge flags describing the edges to watch
     * @see #EDGE_LEFT
     * @see #EDGE_TOP
     * @see #EDGE_RIGHT
     * @see #EDGE_BOTTOM
     */
    setEdgeTrackingEnabled(edgeFlags:number):void  {
        this.mTrackingEdges = edgeFlags;
    }

    /**
     * Return the size of an edge. This is the range in pixels along the edges of this view
     * that will actively detect edge touches or drags if edge tracking is enabled.
     *
     * @return The size of an edge in pixels
     * @see #setEdgeTrackingEnabled(int)
     */
    getEdgeSize():number  {
        return this.mEdgeSize;
    }

    /**
     * Capture a specific child view for dragging within the parent. The callback will be notified
     * but {@link Callback#tryCaptureView(android.view.View, int)} will not be asked permission to
     * capture this view.
     *
     * @param childView Child view to capture
     * @param activePointerId ID of the pointer that is dragging the captured child view
     */
    captureChildView(childView:View, activePointerId:number):void  {
        if (childView.getParent() != this.mParentView) {
            throw Error(`new IllegalArgumentException("captureChildView: parameter must be a descendant " + "of the ViewDragHelper's tracked parent view (" + this.mParentView + ")")`);
        }
        this.mCapturedView = childView;
        this.mActivePointerId = activePointerId;
        this.mCallback.onViewCaptured(childView, activePointerId);
        this.setDragState(ViewDragHelper.STATE_DRAGGING);
    }

    /**
     * @return The currently captured view, or null if no view has been captured.
     */
    getCapturedView():View  {
        return this.mCapturedView;
    }

    /**
     * @return The ID of the pointer currently dragging the captured view,
     *         or {@link #INVALID_POINTER}.
     */
    getActivePointerId():number  {
        return this.mActivePointerId;
    }

    /**
     * @return The minimum distance in pixels that the user must travel to initiate a drag
     */
    getTouchSlop():number  {
        return this.mTouchSlop;
    }

    /**
     * The result of a call to this method is equivalent to
     * {@link #processTouchEvent(android.view.MotionEvent)} receiving an ACTION_CANCEL event.
     */
    cancel():void  {
        this.mActivePointerId = ViewDragHelper.INVALID_POINTER;
        this.clearMotionHistory();
        if (this.mVelocityTracker != null) {
            this.mVelocityTracker.recycle();
            this.mVelocityTracker = null;
        }
    }

    /**
     * {@link #cancel()}, but also abort all motion in progress and snap to the end of any
     * animation.
     */
    abort():void  {
        this.cancel();
        if (this.mDragState == ViewDragHelper.STATE_SETTLING) {
            const oldX:number = this.mScroller.getCurrX();
            const oldY:number = this.mScroller.getCurrY();
            this.mScroller.abortAnimation();
            const newX:number = this.mScroller.getCurrX();
            const newY:number = this.mScroller.getCurrY();
            this.mCallback.onViewPositionChanged(this.mCapturedView, newX, newY, newX - oldX, newY - oldY);
        }
        this.setDragState(ViewDragHelper.STATE_IDLE);
    }

    /**
     * Animate the view <code>child</code> to the given (left, top) position.
     * If this method returns true, the caller should invoke {@link #continueSettling(boolean)}
     * on each subsequent frame to continue the motion until it returns false. If this method
     * returns false there is no further work to do to complete the movement.
     *
     * <p>This operation does not count as a capture event, though {@link #getCapturedView()}
     * will still report the sliding view while the slide is in progress.</p>
     *
     * @param child Child view to capture and animate
     * @param finalLeft Final left position of child
     * @param finalTop Final top position of child
     * @return true if animation should continue through {@link #continueSettling(boolean)} calls
     */
    smoothSlideViewTo(child:View, finalLeft:number, finalTop:number):boolean  {
        this.mCapturedView = child;
        this.mActivePointerId = ViewDragHelper.INVALID_POINTER;
        return this.forceSettleCapturedViewAt(finalLeft, finalTop, 0, 0);
    }

    /**
     * Settle the captured view at the given (left, top) position.
     * The appropriate velocity from prior motion will be taken into account.
     * If this method returns true, the caller should invoke {@link #continueSettling(boolean)}
     * on each subsequent frame to continue the motion until it returns false. If this method
     * returns false there is no further work to do to complete the movement.
     *
     * @param finalLeft Settled left edge position for the captured view
     * @param finalTop Settled top edge position for the captured view
     * @return true if animation should continue through {@link #continueSettling(boolean)} calls
     */
    settleCapturedViewAt(finalLeft:number, finalTop:number):boolean  {
        if (!this.mReleaseInProgress) {
            throw Error(`new IllegalStateException("Cannot settleCapturedViewAt outside of a call to " + "Callback#onViewReleased")`);
        }
        return this.forceSettleCapturedViewAt(finalLeft, finalTop, Math.floor(this.mVelocityTracker.getXVelocity(this.mActivePointerId)), Math.floor(this.mVelocityTracker.getYVelocity(this.mActivePointerId)));
    }

    /**
     * Settle the captured view at the given (left, top) position.
     *
     * @param finalLeft Target left position for the captured view
     * @param finalTop Target top position for the captured view
     * @param xvel Horizontal velocity
     * @param yvel Vertical velocity
     * @return true if animation should continue through {@link #continueSettling(boolean)} calls
     */
    private forceSettleCapturedViewAt(finalLeft:number, finalTop:number, xvel:number, yvel:number):boolean  {
        const startLeft:number = this.mCapturedView.getLeft();
        const startTop:number = this.mCapturedView.getTop();
        const dx:number = finalLeft - startLeft;
        const dy:number = finalTop - startTop;
        if (dx == 0 && dy == 0) {
            // Nothing to do. Send callbacks, be done.
            this.mScroller.abortAnimation();
            this.setDragState(ViewDragHelper.STATE_IDLE);
            return false;
        }
        const duration:number = this.computeSettleDuration(this.mCapturedView, dx, dy, xvel, yvel);
        this.mScroller.startScroll(startLeft, startTop, dx, dy, duration);
        this.setDragState(ViewDragHelper.STATE_SETTLING);
        return true;
    }

    private computeSettleDuration(child:View, dx:number, dy:number, xvel:number, yvel:number):number  {
        xvel = this.clampMag(xvel, Math.floor(this.mMinVelocity), Math.floor(this.mMaxVelocity));
        yvel = this.clampMag(yvel, Math.floor(this.mMinVelocity), Math.floor(this.mMaxVelocity));
        const absDx:number = Math.abs(dx);
        const absDy:number = Math.abs(dy);
        const absXVel:number = Math.abs(xvel);
        const absYVel:number = Math.abs(yvel);
        const addedVel:number = absXVel + absYVel;
        const addedDistance:number = absDx + absDy;
        const xweight:number = xvel != 0 ? <number> absXVel / addedVel : <number> absDx / addedDistance;
        const yweight:number = yvel != 0 ? <number> absYVel / addedVel : <number> absDy / addedDistance;
        let xduration:number = this.computeAxisDuration(dx, xvel, this.mCallback.getViewHorizontalDragRange(child));
        let yduration:number = this.computeAxisDuration(dy, yvel, this.mCallback.getViewVerticalDragRange(child));
        return Math.floor((xduration * xweight + yduration * yweight));
    }

    private computeAxisDuration(delta:number, velocity:number, motionRange:number):number  {
        if (delta == 0) {
            return 0;
        }
        const width:number = this.mParentView.getWidth();
        const halfWidth:number = width / 2;
        const distanceRatio:number = Math.min(1, <number> Math.abs(delta) / width);
        const distance:number = halfWidth + halfWidth * this.distanceInfluenceForSnapDuration(distanceRatio);
        let duration:number;
        velocity = Math.abs(velocity);
        if (velocity > 0) {
            duration = 4 * Math.round(1000 * Math.abs(distance / velocity));
        } else {
            const range:number = <number> Math.abs(delta) / motionRange;
            duration = Math.floor(((range + 1) * ViewDragHelper.BASE_SETTLE_DURATION));
        }
        return Math.min(duration, ViewDragHelper.MAX_SETTLE_DURATION);
    }

    /**
     * Clamp the magnitude of value for absMin and absMax.
     * If the value is below the minimum, it will be clamped to zero.
     * If the value is above the maximum, it will be clamped to the maximum.
     *
     * @param value Value to clamp
     * @param absMin Absolute value of the minimum significant value to return
     * @param absMax Absolute value of the maximum value to return
     * @return The clamped value with the same sign as <code>value</code>
     */
    private clampMag(value:number, absMin:number, absMax:number):number  {
        const absValue:number = Math.abs(value);
        if (absValue < absMin)
            return 0;
        if (absValue > absMax)
            return value > 0 ? absMax : -absMax;
        return value;
    }

    private distanceInfluenceForSnapDuration(f:number):number  {
        // center the values about 0.
        f -= 0.5;
        f *= 0.3 * Math.PI / 2.0;
        return <number> Math.sin(f);
    }

    /**
     * Settle the captured view based on standard free-moving fling behavior.
     * The caller should invoke {@link #continueSettling(boolean)} on each subsequent frame
     * to continue the motion until it returns false.
     *
     * @param minLeft Minimum X position for the view's left edge
     * @param minTop Minimum Y position for the view's top edge
     * @param maxLeft Maximum X position for the view's left edge
     * @param maxTop Maximum Y position for the view's top edge
     */
    flingCapturedView(minLeft:number, minTop:number, maxLeft:number, maxTop:number):void  {
        if (!this.mReleaseInProgress) {
            throw Error(`new IllegalStateException("Cannot flingCapturedView outside of a call to " + "Callback#onViewReleased")`);
        }
        this.mScroller.fling(this.mCapturedView.getLeft(), this.mCapturedView.getTop(),
            Math.floor(this.mVelocityTracker.getXVelocity(this.mActivePointerId)),
            Math.floor(this.mVelocityTracker.getYVelocity(this.mActivePointerId)), minLeft, maxLeft, minTop, maxTop);
        this.setDragState(ViewDragHelper.STATE_SETTLING);
    }

    /**
     * Move the captured settling view by the appropriate amount for the current time.
     * If <code>continueSettling</code> returns true, the caller should call it again
     * on the next frame to continue.
     *
     * @param deferCallbacks true if state callbacks should be deferred via posted message.
     *                       Set this to true if you are calling this method from
     *                       {@link android.view.View#computeScroll()} or similar methods
     *                       invoked as part of layout or drawing.
     * @return true if settle is still in progress
     */
    continueSettling(deferCallbacks:boolean):boolean  {
        if (this.mDragState == ViewDragHelper.STATE_SETTLING) {
            let keepGoing:boolean = this.mScroller.computeScrollOffset();
            const x:number = this.mScroller.getCurrX();
            const y:number = this.mScroller.getCurrY();
            const dx:number = x - this.mCapturedView.getLeft();
            const dy:number = y - this.mCapturedView.getTop();
            if (dx != 0) {
                this.mCapturedView.offsetLeftAndRight(dx);
            }
            if (dy != 0) {
                this.mCapturedView.offsetTopAndBottom(dy);
            }
            if (dx != 0 || dy != 0) {
                this.mCallback.onViewPositionChanged(this.mCapturedView, x, y, dx, dy);
            }
            if (keepGoing && x == this.mScroller.getFinalX() && y == this.mScroller.getFinalY()) {
                // Close enough. The interpolator/scroller might think we're still moving
                // but the user sure doesn't.
                this.mScroller.abortAnimation();
                keepGoing = this.mScroller.isFinished();
            }
            if (!keepGoing) {
                if (deferCallbacks) {
                    this.mParentView.post(this.mSetIdleRunnable);
                } else {
                    this.setDragState(ViewDragHelper.STATE_IDLE);
                }
            }
        }
        return this.mDragState == ViewDragHelper.STATE_SETTLING;
    }

    /**
     * Like all callback events this must happen on the UI thread, but release
     * involves some extra semantics. During a release (mReleaseInProgress)
     * is the only time it is valid to call {@link #settleCapturedViewAt(int, int)}
     * or {@link #flingCapturedView(int, int, int, int)}.
     */
    private dispatchViewReleased(xvel:number, yvel:number):void  {
        this.mReleaseInProgress = true;
        this.mCallback.onViewReleased(this.mCapturedView, xvel, yvel);
        this.mReleaseInProgress = false;
        if (this.mDragState == ViewDragHelper.STATE_DRAGGING) {
            // onViewReleased didn't call a method that would have changed this. Go idle.
            this.setDragState(ViewDragHelper.STATE_IDLE);
        }
    }

    private clearMotionHistory(pointerId?:number):void  {
        if (this.mInitialMotionX == null) {
            return;
        }
        if(pointerId==null){
            this.mInitialMotionX = [];
            this.mInitialMotionY = [];
            this.mLastMotionX = [];
            this.mLastMotionY = [];
            this.mInitialEdgesTouched = [];
            this.mEdgeDragsInProgress = [];
            this.mEdgeDragsLocked = [];
            //for(let i=0,count=this.mInitialMotionX.length; i<count; i++) this.mInitialMotionX[i] = 0;
            //for(let i=0,count=this.mInitialMotionY.length; i<count; i++) this.mInitialMotionY[i] = 0;
            //for(let i=0,count=this.mLastMotionX.length; i<count; i++) this.mLastMotionX[i] = 0;
            //for(let i=0,count=this.mLastMotionY.length; i<count; i++) this.mLastMotionY[i] = 0;
            //for(let i=0,count=this.mInitialEdgesTouched.length; i<count; i++) this.mInitialEdgesTouched[i] = 0;
            //for(let i=0,count=this.mEdgeDragsInProgress.length; i<count; i++) this.mEdgeDragsInProgress[i] = 0;
            //for(let i=0,count=this.mEdgeDragsLocked.length; i<count; i++) this.mEdgeDragsLocked[i] = 0;
            this.mPointersDown = 0;
        }else {
            this.mInitialMotionX[pointerId] = 0;
            this.mInitialMotionY[pointerId] = 0;
            this.mLastMotionX[pointerId] = 0;
            this.mLastMotionY[pointerId] = 0;
            this.mInitialEdgesTouched[pointerId] = 0;
            this.mEdgeDragsInProgress[pointerId] = 0;
            this.mEdgeDragsLocked[pointerId] = 0;
            this.mPointersDown &= ~(1 << pointerId);
        }
    }

    private ensureMotionHistorySizeForId(pointerId:number):void  {
        if (this.mInitialMotionX == null || this.mInitialMotionX.length <= pointerId) {
            let imx:number[] = androidui.util.ArrayCreator.newNumberArray(pointerId + 1);
            let imy:number[] = androidui.util.ArrayCreator.newNumberArray(pointerId + 1);
            let lmx:number[] = androidui.util.ArrayCreator.newNumberArray(pointerId + 1);
            let lmy:number[] = androidui.util.ArrayCreator.newNumberArray(pointerId + 1);
            let iit:number[] = androidui.util.ArrayCreator.newNumberArray(pointerId + 1);
            let edip:number[] = androidui.util.ArrayCreator.newNumberArray(pointerId + 1);
            let edl:number[] = androidui.util.ArrayCreator.newNumberArray(pointerId + 1);
            if (this.mInitialMotionX != null) {
                System.arraycopy(this.mInitialMotionX, 0, imx, 0, this.mInitialMotionX.length);
                System.arraycopy(this.mInitialMotionY, 0, imy, 0, this.mInitialMotionY.length);
                System.arraycopy(this.mLastMotionX, 0, lmx, 0, this.mLastMotionX.length);
                System.arraycopy(this.mLastMotionY, 0, lmy, 0, this.mLastMotionY.length);
                System.arraycopy(this.mInitialEdgesTouched, 0, iit, 0, this.mInitialEdgesTouched.length);
                System.arraycopy(this.mEdgeDragsInProgress, 0, edip, 0, this.mEdgeDragsInProgress.length);
                System.arraycopy(this.mEdgeDragsLocked, 0, edl, 0, this.mEdgeDragsLocked.length);
            }
            this.mInitialMotionX = imx;
            this.mInitialMotionY = imy;
            this.mLastMotionX = lmx;
            this.mLastMotionY = lmy;
            this.mInitialEdgesTouched = iit;
            this.mEdgeDragsInProgress = edip;
            this.mEdgeDragsLocked = edl;
        }
    }

    private saveInitialMotion(x:number, y:number, pointerId:number):void  {
        this.ensureMotionHistorySizeForId(pointerId);
        this.mInitialMotionX[pointerId] = this.mLastMotionX[pointerId] = x;
        this.mInitialMotionY[pointerId] = this.mLastMotionY[pointerId] = y;
        this.mInitialEdgesTouched[pointerId] = this.getEdgesTouched(Math.floor(x), Math.floor(y));
        this.mPointersDown |= 1 << pointerId;
    }

    private saveLastMotion(ev:MotionEvent):void  {
        const pointerCount:number = ev.getPointerCount();
        for (let i:number = 0; i < pointerCount; i++) {
            const pointerId:number = ev.getPointerId(i);
            const x:number = ev.getX(i);
            const y:number = ev.getY(i);
            this.mLastMotionX[pointerId] = x;
            this.mLastMotionY[pointerId] = y;
        }
    }

    /**
     * Check if the given pointer ID represents a pointer that is currently down (to the best
     * of the ViewDragHelper's knowledge).
     *
     * <p>The state used to report this information is populated by the methods
     * {@link #shouldInterceptTouchEvent(android.view.MotionEvent)} or
     * {@link #processTouchEvent(android.view.MotionEvent)}. If one of these methods has not
     * been called for all relevant MotionEvents to track, the information reported
     * by this method may be stale or incorrect.</p>
     *
     * @param pointerId pointer ID to check; corresponds to IDs provided by MotionEvent
     * @return true if the pointer with the given ID is still down
     */
    isPointerDown(pointerId:number):boolean  {
        return (this.mPointersDown & 1 << pointerId) != 0;
    }

    setDragState(state:number):void  {
        if (this.mDragState != state) {
            this.mDragState = state;
            this.mCallback.onViewDragStateChanged(state);
            if (state == ViewDragHelper.STATE_IDLE) {
                this.mCapturedView = null;
            }
        }
    }

    /**
     * Attempt to capture the view with the given pointer ID. The callback will be involved.
     * This will put us into the "dragging" state. If we've already captured this view with
     * this pointer this method will immediately return true without consulting the callback.
     *
     * @param toCapture View to capture
     * @param pointerId Pointer to capture with
     * @return true if capture was successful
     */
    tryCaptureViewForDrag(toCapture:View, pointerId:number):boolean  {
        if (toCapture == this.mCapturedView && this.mActivePointerId == pointerId) {
            // Already done!
            return true;
        }
        if (toCapture != null && this.mCallback.tryCaptureView(toCapture, pointerId)) {
            this.mActivePointerId = pointerId;
            this.captureChildView(toCapture, pointerId);
            return true;
        }
        return false;
    }

    /**
     * Tests scrollability within child views of v given a delta of dx.
     *
     * @param v View to test for horizontal scrollability
     * @param checkV Whether the view v passed should itself be checked for scrollability (true),
     *               or just its children (false).
     * @param dx Delta scrolled in pixels along the X axis
     * @param dy Delta scrolled in pixels along the Y axis
     * @param x X coordinate of the active touch point
     * @param y Y coordinate of the active touch point
     * @return true if child views of v can be scrolled by delta of dx.
     */
    protected canScroll(v:View, checkV:boolean, dx:number, dy:number, x:number, y:number):boolean  {
        if (v instanceof ViewGroup) {
            const group:ViewGroup = <ViewGroup> v;
            const scrollX:number = v.getScrollX();
            const scrollY:number = v.getScrollY();
            const count:number = group.getChildCount();
            // Count backwards - let topmost views consume scroll distance first.
            for (let i:number = count - 1; i >= 0; i--) {
                // TODO: Add versioned support here for transformed views.
                // This will not work for transformed views in Honeycomb+
                const child:View = group.getChildAt(i);
                if (x + scrollX >= child.getLeft() && x + scrollX < child.getRight()
                    && y + scrollY >= child.getTop() && y + scrollY < child.getBottom()
                    && this.canScroll(child, true, dx, dy, x + scrollX - child.getLeft(), y + scrollY - child.getTop())) {
                    return true;
                }
            }
        }
        return checkV && (v.canScrollHorizontally(-dx) || v.canScrollVertically(-dy));
    }

    /**
     * Check if this event as provided to the parent view's onInterceptTouchEvent should
     * cause the parent to intercept the touch event stream.
     *
     * @param ev MotionEvent provided to onInterceptTouchEvent
     * @return true if the parent view should return true from onInterceptTouchEvent
     */
    shouldInterceptTouchEvent(ev:MotionEvent):boolean  {
        const action:number = ev.getActionMasked();
        const actionIndex:number = ev.getActionIndex();
        if (action == MotionEvent.ACTION_DOWN) {
            // Reset things for a new event stream, just in case we didn't get
            // the whole previous stream.
            this.cancel();
        }
        if (this.mVelocityTracker == null) {
            this.mVelocityTracker = VelocityTracker.obtain();
        }
        this.mVelocityTracker.addMovement(ev);
        switch(action) {
            case MotionEvent.ACTION_DOWN:
                {
                    const x:number = ev.getX();
                    const y:number = ev.getY();
                    const pointerId:number = ev.getPointerId(0);
                    this.saveInitialMotion(x, y, pointerId);
                    const toCapture:View = this.findTopChildUnder(Math.floor(x), Math.floor(y));
                    // Catch a settling view if possible.
                    if (toCapture == this.mCapturedView && this.mDragState == ViewDragHelper.STATE_SETTLING) {
                        this.tryCaptureViewForDrag(toCapture, pointerId);
                    }
                    const edgesTouched:number = this.mInitialEdgesTouched[pointerId];
                    if ((edgesTouched & this.mTrackingEdges) != 0) {
                        this.mCallback.onEdgeTouched(edgesTouched & this.mTrackingEdges, pointerId);
                    }
                    break;
                }
            case MotionEvent.ACTION_POINTER_DOWN:
                {
                    const pointerId:number = ev.getPointerId(actionIndex);
                    const x:number = ev.getX(actionIndex);
                    const y:number = ev.getY(actionIndex);
                    this.saveInitialMotion(x, y, pointerId);
                    // A ViewDragHelper can only manipulate one view at a time.
                    if (this.mDragState == ViewDragHelper.STATE_IDLE) {
                        const edgesTouched:number = this.mInitialEdgesTouched[pointerId];
                        if ((edgesTouched & this.mTrackingEdges) != 0) {
                            this.mCallback.onEdgeTouched(edgesTouched & this.mTrackingEdges, pointerId);
                        }
                    } else if (this.mDragState == ViewDragHelper.STATE_SETTLING) {
                        // Catch a settling view if possible.
                        const toCapture:View = this.findTopChildUnder(Math.floor(x), Math.floor(y));
                        if (toCapture == this.mCapturedView) {
                            this.tryCaptureViewForDrag(toCapture, pointerId);
                        }
                    }
                    break;
                }
            case MotionEvent.ACTION_MOVE:
                {
                    // First to cross a touch slop over a draggable view wins. Also report edge drags.
                    const pointerCount:number = ev.getPointerCount();
                    for (let i:number = 0; i < pointerCount; i++) {
                        const pointerId:number = ev.getPointerId(i);
                        const x:number = ev.getX(i);
                        const y:number = ev.getY(i);
                        const dx:number = x - this.mInitialMotionX[pointerId];
                        const dy:number = y - this.mInitialMotionY[pointerId];
                        this.reportNewEdgeDrags(dx, dy, pointerId);
                        if (this.mDragState == ViewDragHelper.STATE_DRAGGING) {
                            // Callback might have started an edge drag
                            break;
                        }
                        const toCapture:View = this.findTopChildUnder(Math.floor(x), Math.floor(y));
                        if (toCapture != null && this.checkTouchSlop(toCapture, dx, dy) && this.tryCaptureViewForDrag(toCapture, pointerId)) {
                            break;
                        }
                    }
                    this.saveLastMotion(ev);
                    break;
                }
            case MotionEvent.ACTION_POINTER_UP:
                {
                    const pointerId:number = ev.getPointerId(actionIndex);
                    this.clearMotionHistory(pointerId);
                    break;
                }
            case MotionEvent.ACTION_UP:
            case MotionEvent.ACTION_CANCEL:
                {
                    this.cancel();
                    break;
                }
        }
        return this.mDragState == ViewDragHelper.STATE_DRAGGING;
    }

    /**
     * Process a touch event received by the parent view. This method will dispatch callback events
     * as needed before returning. The parent view's onTouchEvent implementation should call this.
     *
     * @param ev The touch event received by the parent view
     */
    processTouchEvent(ev:MotionEvent):void  {
        const action:number = ev.getActionMasked();
        const actionIndex:number = ev.getActionIndex();
        if (action == MotionEvent.ACTION_DOWN) {
            // Reset things for a new event stream, just in case we didn't get
            // the whole previous stream.
            this.cancel();
        }
        if (this.mVelocityTracker == null) {
            this.mVelocityTracker = VelocityTracker.obtain();
        }
        this.mVelocityTracker.addMovement(ev);
        switch(action) {
            case MotionEvent.ACTION_DOWN:
                {
                    const x:number = ev.getX();
                    const y:number = ev.getY();
                    const pointerId:number = ev.getPointerId(0);
                    const toCapture:View = this.findTopChildUnder(Math.floor(x), Math.floor(y));
                    this.saveInitialMotion(x, y, pointerId);
                    // Since the parent is already directly processing this touch event,
                    // there is no reason to delay for a slop before dragging.
                    // Start immediately if possible.
                    this.tryCaptureViewForDrag(toCapture, pointerId);
                    const edgesTouched:number = this.mInitialEdgesTouched[pointerId];
                    if ((edgesTouched & this.mTrackingEdges) != 0) {
                        this.mCallback.onEdgeTouched(edgesTouched & this.mTrackingEdges, pointerId);
                    }
                    break;
                }
            case MotionEvent.ACTION_POINTER_DOWN:
                {
                    const pointerId:number = ev.getPointerId(actionIndex);
                    const x:number = ev.getX(actionIndex);
                    const y:number = ev.getY(actionIndex);
                    this.saveInitialMotion(x, y, pointerId);
                    // A ViewDragHelper can only manipulate one view at a time.
                    if (this.mDragState == ViewDragHelper.STATE_IDLE) {
                        // If we're idle we can do anything! Treat it like a normal down event.
                        const toCapture:View = this.findTopChildUnder(Math.floor(x), Math.floor(y));
                        this.tryCaptureViewForDrag(toCapture, pointerId);
                        const edgesTouched:number = this.mInitialEdgesTouched[pointerId];
                        if ((edgesTouched & this.mTrackingEdges) != 0) {
                            this.mCallback.onEdgeTouched(edgesTouched & this.mTrackingEdges, pointerId);
                        }
                    } else if (this.isCapturedViewUnder(Math.floor(x), Math.floor(y))) {
                        // We're still tracking a captured view. If the same view is under this
                        // point, we'll swap to controlling it with this pointer instead.
                        // (This will still work if we're "catching" a settling view.)
                        this.tryCaptureViewForDrag(this.mCapturedView, pointerId);
                    }
                    break;
                }
            case MotionEvent.ACTION_MOVE:
                {
                    if (this.mDragState == ViewDragHelper.STATE_DRAGGING) {
                        const index:number = ev.findPointerIndex(this.mActivePointerId);
                        const x:number = ev.getX(index);
                        const y:number = ev.getY(index);
                        const idx:number = Math.floor((x - this.mLastMotionX[this.mActivePointerId]));
                        const idy:number = Math.floor((y - this.mLastMotionY[this.mActivePointerId]));
                        this.dragTo(this.mCapturedView.getLeft() + idx, this.mCapturedView.getTop() + idy, idx, idy);
                        this.saveLastMotion(ev);
                    } else {
                        // Check to see if any pointer is now over a draggable view.
                        const pointerCount:number = ev.getPointerCount();
                        for (let i:number = 0; i < pointerCount; i++) {
                            const pointerId:number = ev.getPointerId(i);
                            const x:number = ev.getX(i);
                            const y:number = ev.getY(i);
                            const dx:number = x - this.mInitialMotionX[pointerId];
                            const dy:number = y - this.mInitialMotionY[pointerId];
                            this.reportNewEdgeDrags(dx, dy, pointerId);
                            if (this.mDragState == ViewDragHelper.STATE_DRAGGING) {
                                // Callback might have started an edge drag.
                                break;
                            }
                            const toCapture:View = this.findTopChildUnder(Math.floor(x), Math.floor(y));
                            if (this.checkTouchSlop(toCapture, dx, dy) && this.tryCaptureViewForDrag(toCapture, pointerId)) {
                                break;
                            }
                        }
                        this.saveLastMotion(ev);
                    }
                    break;
                }
            case MotionEvent.ACTION_POINTER_UP:
                {
                    const pointerId:number = ev.getPointerId(actionIndex);
                    if (this.mDragState == ViewDragHelper.STATE_DRAGGING && pointerId == this.mActivePointerId) {
                        // Try to find another pointer that's still holding on to the captured view.
                        let newActivePointer:number = ViewDragHelper.INVALID_POINTER;
                        const pointerCount:number = ev.getPointerCount();
                        for (let i:number = 0; i < pointerCount; i++) {
                            const id:number = ev.getPointerId(i);
                            if (id == this.mActivePointerId) {
                                // This one's going away, skip.
                                continue;
                            }
                            const x:number = ev.getX(i);
                            const y:number = ev.getY(i);
                            if (this.findTopChildUnder(Math.floor(x), Math.floor(y)) == this.mCapturedView && this.tryCaptureViewForDrag(this.mCapturedView, id)) {
                                newActivePointer = this.mActivePointerId;
                                break;
                            }
                        }
                        if (newActivePointer == ViewDragHelper.INVALID_POINTER) {
                            // We didn't find another pointer still touching the view, release it.
                            this.releaseViewForPointerUp();
                        }
                    }
                    this.clearMotionHistory(pointerId);
                    break;
                }
            case MotionEvent.ACTION_UP:
                {
                    if (this.mDragState == ViewDragHelper.STATE_DRAGGING) {
                        this.releaseViewForPointerUp();
                    }
                    this.cancel();
                    break;
                }
            case MotionEvent.ACTION_CANCEL:
                {
                    if (this.mDragState == ViewDragHelper.STATE_DRAGGING) {
                        this.dispatchViewReleased(0, 0);
                    }
                    this.cancel();
                    break;
                }
        }
    }

    private reportNewEdgeDrags(dx:number, dy:number, pointerId:number):void  {
        let dragsStarted:number = 0;
        if (this.checkNewEdgeDrag(dx, dy, pointerId, ViewDragHelper.EDGE_LEFT)) {
            dragsStarted |= ViewDragHelper.EDGE_LEFT;
        }
        if (this.checkNewEdgeDrag(dy, dx, pointerId, ViewDragHelper.EDGE_TOP)) {
            dragsStarted |= ViewDragHelper.EDGE_TOP;
        }
        if (this.checkNewEdgeDrag(dx, dy, pointerId, ViewDragHelper.EDGE_RIGHT)) {
            dragsStarted |= ViewDragHelper.EDGE_RIGHT;
        }
        if (this.checkNewEdgeDrag(dy, dx, pointerId, ViewDragHelper.EDGE_BOTTOM)) {
            dragsStarted |= ViewDragHelper.EDGE_BOTTOM;
        }
        if (dragsStarted != 0) {
            this.mEdgeDragsInProgress[pointerId] |= dragsStarted;
            this.mCallback.onEdgeDragStarted(dragsStarted, pointerId);
        }
    }

    private checkNewEdgeDrag(delta:number, odelta:number, pointerId:number, edge:number):boolean  {
        const absDelta:number = Math.abs(delta);
        const absODelta:number = Math.abs(odelta);
        if ((this.mInitialEdgesTouched[pointerId] & edge) != edge || (this.mTrackingEdges & edge) == 0 || (this.mEdgeDragsLocked[pointerId] & edge) == edge || (this.mEdgeDragsInProgress[pointerId] & edge) == edge || (absDelta <= this.mTouchSlop && absODelta <= this.mTouchSlop)) {
            return false;
        }
        if (absDelta < absODelta * 0.5 && this.mCallback.onEdgeLock(edge)) {
            this.mEdgeDragsLocked[pointerId] |= edge;
            return false;
        }
        return (this.mEdgeDragsInProgress[pointerId] & edge) == 0 && absDelta > this.mTouchSlop;
    }


    checkTouchSlop(child:View, dx:number, dy:number):boolean;
    checkTouchSlop(directions:number):boolean;
    checkTouchSlop(directions:number, pointerId:number):boolean;
    checkTouchSlop(...args):boolean {
        if(args.length===1) return this._checkTouchSlop_1(args[0]);
        if(args.length===2) return this._checkTouchSlop_2(args[0], args[1]);
        if(args.length===3) return this._checkTouchSlop_3(args[0], args[1], args[2]);
        return false;
    }
    /**
     * Check if we've crossed a reasonable touch slop for the given child view.
     * If the child cannot be dragged along the horizontal or vertical axis, motion
     * along that axis will not count toward the slop check.
     *
     * @param child Child to check
     * @param dx Motion since initial position along X axis
     * @param dy Motion since initial position along Y axis
     * @return true if the touch slop has been crossed
     */
    private _checkTouchSlop_3(child:View, dx:number, dy:number):boolean  {
        if (child == null) {
            return false;
        }
        const checkHorizontal:boolean = this.mCallback.getViewHorizontalDragRange(child) > 0;
        const checkVertical:boolean = this.mCallback.getViewVerticalDragRange(child) > 0;
        if (checkHorizontal && checkVertical) {
            return dx * dx + dy * dy > this.mTouchSlop * this.mTouchSlop;
        } else if (checkHorizontal) {
            return Math.abs(dx) > this.mTouchSlop;
        } else if (checkVertical) {
            return Math.abs(dy) > this.mTouchSlop;
        }
        return false;
    }

    /**
     * Check if any pointer tracked in the current gesture has crossed
     * the required slop threshold.
     *
     * <p>This depends on internal state populated by
     * {@link #shouldInterceptTouchEvent(android.view.MotionEvent)} or
     * {@link #processTouchEvent(android.view.MotionEvent)}. You should only rely on
     * the results of this method after all currently available touch data
     * has been provided to one of these two methods.</p>
     *
     * @param directions Combination of direction flags, see {@link #DIRECTION_HORIZONTAL},
     *                   {@link #DIRECTION_VERTICAL}, {@link #DIRECTION_ALL}
     * @return true if the slop threshold has been crossed, false otherwise
     */
    private _checkTouchSlop_1(directions:number):boolean  {
        const count:number = this.mInitialMotionX.length;
        for (let i:number = 0; i < count; i++) {
            if (this.checkTouchSlop(directions, i)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if the specified pointer tracked in the current gesture has crossed
     * the required slop threshold.
     *
     * <p>This depends on internal state populated by
     * {@link #shouldInterceptTouchEvent(android.view.MotionEvent)} or
     * {@link #processTouchEvent(android.view.MotionEvent)}. You should only rely on
     * the results of this method after all currently available touch data
     * has been provided to one of these two methods.</p>
     *
     * @param directions Combination of direction flags, see {@link #DIRECTION_HORIZONTAL},
     *                   {@link #DIRECTION_VERTICAL}, {@link #DIRECTION_ALL}
     * @param pointerId ID of the pointer to slop check as specified by MotionEvent
     * @return true if the slop threshold has been crossed, false otherwise
     */
    private _checkTouchSlop_2(directions:number, pointerId:number):boolean  {
        if (!this.isPointerDown(pointerId)) {
            return false;
        }
        const checkHorizontal:boolean = (directions & ViewDragHelper.DIRECTION_HORIZONTAL) == ViewDragHelper.DIRECTION_HORIZONTAL;
        const checkVertical:boolean = (directions & ViewDragHelper.DIRECTION_VERTICAL) == ViewDragHelper.DIRECTION_VERTICAL;
        const dx:number = this.mLastMotionX[pointerId] - this.mInitialMotionX[pointerId];
        const dy:number = this.mLastMotionY[pointerId] - this.mInitialMotionY[pointerId];
        if (checkHorizontal && checkVertical) {
            return dx * dx + dy * dy > this.mTouchSlop * this.mTouchSlop;
        } else if (checkHorizontal) {
            return Math.abs(dx) > this.mTouchSlop;
        } else if (checkVertical) {
            return Math.abs(dy) > this.mTouchSlop;
        }
        return false;
    }

    /**
     * Check if any of the edges specified were initially touched by the pointer with
     * the specified ID. If there is no currently active gesture or if there is no pointer with
     * the given ID currently down this method will return false.
     *
     * @param edges Edges to check for an initial edge touch. See {@link #EDGE_LEFT},
     *              {@link #EDGE_TOP}, {@link #EDGE_RIGHT}, {@link #EDGE_BOTTOM} and
     *              {@link #EDGE_ALL}
     * @return true if any of the edges specified were initially touched in the current gesture
     */
    isEdgeTouched(edges:number, pointerId?:number):boolean  {
        if(pointerId==null) {
            const count:number = this.mInitialEdgesTouched.length;
            for (let i:number = 0; i < count; i++) {
                if (this.isEdgeTouched(edges, i)) {
                    return true;
                }
            }
        }
        return this.isPointerDown(pointerId) && (this.mInitialEdgesTouched[pointerId] & edges) != 0;
    }

    private releaseViewForPointerUp():void  {
        this.mVelocityTracker.computeCurrentVelocity(1000, this.mMaxVelocity);
        const xvel:number = this.clampMag(this.mVelocityTracker.getXVelocity(this.mActivePointerId), this.mMinVelocity, this.mMaxVelocity);
        const yvel:number = this.clampMag(this.mVelocityTracker.getYVelocity(this.mActivePointerId), this.mMinVelocity, this.mMaxVelocity);
        this.dispatchViewReleased(xvel, yvel);
    }

    private dragTo(left:number, top:number, dx:number, dy:number):void  {
        let clampedX:number = left;
        let clampedY:number = top;
        const oldLeft:number = this.mCapturedView.getLeft();
        const oldTop:number = this.mCapturedView.getTop();
        if (dx != 0) {
            clampedX = this.mCallback.clampViewPositionHorizontal(this.mCapturedView, left, dx);
            this.mCapturedView.offsetLeftAndRight(clampedX - oldLeft);
        }
        if (dy != 0) {
            clampedY = this.mCallback.clampViewPositionVertical(this.mCapturedView, top, dy);
            this.mCapturedView.offsetTopAndBottom(clampedY - oldTop);
        }
        if (dx != 0 || dy != 0) {
            const clampedDx:number = clampedX - oldLeft;
            const clampedDy:number = clampedY - oldTop;
            this.mCallback.onViewPositionChanged(this.mCapturedView, clampedX, clampedY, clampedDx, clampedDy);
        }
    }

    /**
     * Determine if the currently captured view is under the given point in the
     * parent view's coordinate system. If there is no captured view this method
     * will return false.
     *
     * @param x X position to test in the parent's coordinate system
     * @param y Y position to test in the parent's coordinate system
     * @return true if the captured view is under the given point, false otherwise
     */
    isCapturedViewUnder(x:number, y:number):boolean  {
        return this.isViewUnder(this.mCapturedView, x, y);
    }

    /**
     * Determine if the supplied view is under the given point in the
     * parent view's coordinate system.
     *
     * @param view Child view of the parent to hit test
     * @param x X position to test in the parent's coordinate system
     * @param y Y position to test in the parent's coordinate system
     * @return true if the supplied view is under the given point, false otherwise
     */
    isViewUnder(view:View, x:number, y:number):boolean  {
        if (view == null) {
            return false;
        }
        return x >= view.getLeft() && x < view.getRight() && y >= view.getTop() && y < view.getBottom();
    }

    /**
     * Find the topmost child under the given point within the parent view's coordinate system.
     * The child order is determined using {@link Callback#getOrderedChildIndex(int)}.
     *
     * @param x X position to test in the parent's coordinate system
     * @param y Y position to test in the parent's coordinate system
     * @return The topmost child view under (x, y) or null if none found.
     */
    findTopChildUnder(x:number, y:number):View  {
        const childCount:number = this.mParentView.getChildCount();
        for (let i:number = childCount - 1; i >= 0; i--) {
            const child:View = this.mParentView.getChildAt(this.mCallback.getOrderedChildIndex(i));
            if (x >= child.getLeft() && x < child.getRight() && y >= child.getTop() && y < child.getBottom()) {
                return child;
            }
        }
        return null;
    }

    private getEdgesTouched(x:number, y:number):number  {
        let result:number = 0;
        if (x < this.mParentView.getLeft() + this.mEdgeSize)
            result |= ViewDragHelper.EDGE_LEFT;
        if (y < this.mParentView.getTop() + this.mEdgeSize)
            result |= ViewDragHelper.EDGE_TOP;
        if (x > this.mParentView.getRight() - this.mEdgeSize)
            result |= ViewDragHelper.EDGE_RIGHT;
        if (y > this.mParentView.getBottom() - this.mEdgeSize)
            result |= ViewDragHelper.EDGE_BOTTOM;
        return result;
    }
}

export module ViewDragHelper{
/**
     * A Callback is used as a communication channel with the ViewDragHelper back to the
     * parent view using it. <code>on*</code>methods are invoked on siginficant events and several
     * accessor methods are expected to provide the ViewDragHelper with more information
     * about the state of the parent view upon request. The callback also makes decisions
     * governing the range and draggability of child views.
     */
export abstract class Callback {

    /**
         * Called when the drag state changes. See the <code>STATE_*</code> constants
         * for more information.
         *
         * @param state The new drag state
         *
         * @see #STATE_IDLE
         * @see #STATE_DRAGGING
         * @see #STATE_SETTLING
         */
    onViewDragStateChanged(state:number):void  {
    }

    /**
         * Called when the captured view's position changes as the result of a drag or settle.
         *
         * @param changedView View whose position changed
         * @param left New X coordinate of the left edge of the view
         * @param top New Y coordinate of the top edge of the view
         * @param dx Change in X position from the last call
         * @param dy Change in Y position from the last call
         */
    onViewPositionChanged(changedView:View, left:number, top:number, dx:number, dy:number):void  {
    }

    /**
         * Called when a child view is captured for dragging or settling. The ID of the pointer
         * currently dragging the captured view is supplied. If activePointerId is
         * identified as {@link #INVALID_POINTER} the capture is programmatic instead of
         * pointer-initiated.
         *
         * @param capturedChild Child view that was captured
         * @param activePointerId Pointer id tracking the child capture
         */
    onViewCaptured(capturedChild:View, activePointerId:number):void  {
    }

    /**
         * Called when the child view is no longer being actively dragged.
         * The fling velocity is also supplied, if relevant. The velocity values may
         * be clamped to system minimums or maximums.
         *
         * <p>Calling code may decide to fling or otherwise release the view to let it
         * settle into place. It should do so using {@link #settleCapturedViewAt(int, int)}
         * or {@link #flingCapturedView(int, int, int, int)}. If the Callback invokes
         * one of these methods, the ViewDragHelper will enter {@link #STATE_SETTLING}
         * and the view capture will not fully end until it comes to a complete stop.
         * If neither of these methods is invoked before <code>onViewReleased</code> returns,
         * the view will stop in place and the ViewDragHelper will return to
         * {@link #STATE_IDLE}.</p>
         *
         * @param releasedChild The captured child view now being released
         * @param xvel X velocity of the pointer as it left the screen in pixels per second.
         * @param yvel Y velocity of the pointer as it left the screen in pixels per second.
         */
    onViewReleased(releasedChild:View, xvel:number, yvel:number):void  {
    }

    /**
         * Called when one of the subscribed edges in the parent view has been touched
         * by the user while no child view is currently captured.
         *
         * @param edgeFlags A combination of edge flags describing the edge(s) currently touched
         * @param pointerId ID of the pointer touching the described edge(s)
         * @see #EDGE_LEFT
         * @see #EDGE_TOP
         * @see #EDGE_RIGHT
         * @see #EDGE_BOTTOM
         */
    onEdgeTouched(edgeFlags:number, pointerId:number):void  {
    }

    /**
         * Called when the given edge may become locked. This can happen if an edge drag
         * was preliminarily rejected before beginning, but after {@link #onEdgeTouched(int, int)}
         * was called. This method should return true to lock this edge or false to leave it
         * unlocked. The default behavior is to leave edges unlocked.
         *
         * @param edgeFlags A combination of edge flags describing the edge(s) locked
         * @return true to lock the edge, false to leave it unlocked
         */
    onEdgeLock(edgeFlags:number):boolean  {
        return false;
    }

    /**
         * Called when the user has started a deliberate drag away from one
         * of the subscribed edges in the parent view while no child view is currently captured.
         *
         * @param edgeFlags A combination of edge flags describing the edge(s) dragged
         * @param pointerId ID of the pointer touching the described edge(s)
         * @see #EDGE_LEFT
         * @see #EDGE_TOP
         * @see #EDGE_RIGHT
         * @see #EDGE_BOTTOM
         */
    onEdgeDragStarted(edgeFlags:number, pointerId:number):void  {
    }

    /**
         * Called to determine the Z-order of child views.
         *
         * @param index the ordered position to query for
         * @return index of the view that should be ordered at position <code>index</code>
         */
    getOrderedChildIndex(index:number):number  {
        return index;
    }

    /**
         * Return the magnitude of a draggable child view's horizontal range of motion in pixels.
         * This method should return 0 for views that cannot move horizontally.
         *
         * @param child Child view to check
         * @return range of horizontal motion in pixels
         */
    getViewHorizontalDragRange(child:View):number  {
        return 0;
    }

    /**
         * Return the magnitude of a draggable child view's vertical range of motion in pixels.
         * This method should return 0 for views that cannot move vertically.
         *
         * @param child Child view to check
         * @return range of vertical motion in pixels
         */
    getViewVerticalDragRange(child:View):number  {
        return 0;
    }

    /**
         * Called when the user's input indicates that they want to capture the given child view
         * with the pointer indicated by pointerId. The callback should return true if the user
         * is permitted to drag the given view with the indicated pointer.
         *
         * <p>ViewDragHelper may call this method multiple times for the same view even if
         * the view is already captured; this indicates that a new pointer is trying to take
         * control of the view.</p>
         *
         * <p>If this method returns true, a call to {@link #onViewCaptured(android.view.View, int)}
         * will follow if the capture is successful.</p>
         *
         * @param child Child the user is attempting to capture
         * @param pointerId ID of the pointer attempting the capture
         * @return true if capture should be allowed, false otherwise
         */
    abstract tryCaptureView(child:View, pointerId:number):boolean ;

    /**
         * Restrict the motion of the dragged child view along the horizontal axis.
         * The default implementation does not allow horizontal motion; the extending
         * class must override this method and provide the desired clamping.
         *
         *
         * @param child Child view being dragged
         * @param left Attempted motion along the X axis
         * @param dx Proposed change in position for left
         * @return The new clamped position for left
         */
    clampViewPositionHorizontal(child:View, left:number, dx:number):number  {
        return 0;
    }

    /**
         * Restrict the motion of the dragged child view along the vertical axis.
         * The default implementation does not allow vertical motion; the extending
         * class must override this method and provide the desired clamping.
         *
         *
         * @param child Child view being dragged
         * @param top Attempted motion along the Y axis
         * @param dy Proposed change in position for top
         * @return The new clamped position for top
         */
    clampViewPositionVertical(child:View, top:number, dy:number):number  {
        return 0;
    }
}
}

}
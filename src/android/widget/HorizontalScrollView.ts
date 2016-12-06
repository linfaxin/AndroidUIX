/*
 * Copyright (C) 2009 The Android Open Source Project
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

///<reference path="../../android/graphics/Canvas.ts"/>
///<reference path="../../android/graphics/Rect.ts"/>
///<reference path="../../android/util/Log.ts"/>
///<reference path="../../android/view/FocusFinder.ts"/>
///<reference path="../../android/view/KeyEvent.ts"/>
///<reference path="../../android/view/MotionEvent.ts"/>
///<reference path="../../android/view/VelocityTracker.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewConfiguration.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/view/ViewParent.ts"/>
///<reference path="../../android/view/animation/AnimationUtils.ts"/>
///<reference path="../../java/util/List.ts"/>
///<reference path="../../java/lang/Integer.ts"/>
///<reference path="../../java/lang/System.ts"/>
///<reference path="../../android/widget/FrameLayout.ts"/>
///<reference path="../../android/widget/LinearLayout.ts"/>
///<reference path="../../android/widget/ListView.ts"/>
///<reference path="../../android/widget/OverScroller.ts"/>
///<reference path="../../android/widget/ScrollView.ts"/>
///<reference path="../../android/widget/TextView.ts"/>

module android.widget {
import Canvas = android.graphics.Canvas;
import Rect = android.graphics.Rect;
import Log = android.util.Log;
import FocusFinder = android.view.FocusFinder;
import KeyEvent = android.view.KeyEvent;
import MotionEvent = android.view.MotionEvent;
import VelocityTracker = android.view.VelocityTracker;
import View = android.view.View;
import ViewConfiguration = android.view.ViewConfiguration;
import ViewGroup = android.view.ViewGroup;
import ViewParent = android.view.ViewParent;
import AnimationUtils = android.view.animation.AnimationUtils;
import List = java.util.List;
import Integer = java.lang.Integer;
import System = java.lang.System;
import FrameLayout = android.widget.FrameLayout;
import LinearLayout = android.widget.LinearLayout;
import ListView = android.widget.ListView;
import OverScroller = android.widget.OverScroller;
import ScrollView = android.widget.ScrollView;
import TextView = android.widget.TextView;
/**
 * Layout container for a view hierarchy that can be scrolled by the user,
 * allowing it to be larger than the physical display.  A HorizontalScrollView
 * is a {@link FrameLayout}, meaning you should place one child in it
 * containing the entire contents to scroll; this child may itself be a layout
 * manager with a complex hierarchy of objects.  A child that is often used
 * is a {@link LinearLayout} in a horizontal orientation, presenting a horizontal
 * array of top-level items that the user can scroll through.
 *
 * <p>The {@link TextView} class also
 * takes care of its own scrolling, so does not require a HorizontalScrollView, but
 * using the two together is possible to achieve the effect of a text view
 * within a larger container.
 *
 * <p>HorizontalScrollView only supports horizontal scrolling. For vertical scrolling,
 * use either {@link ScrollView} or {@link ListView}.
 *
 * @attr ref android.R.styleable#HorizontalScrollView_fillViewport
 */
export class HorizontalScrollView extends FrameLayout {

    private static ANIMATED_SCROLL_GAP:number = ScrollView.ANIMATED_SCROLL_GAP;

    private static MAX_SCROLL_FACTOR:number = ScrollView.MAX_SCROLL_FACTOR;

    private static TAG:string = "HorizontalScrollView";

    private mLastScroll:number = 0;

    private mTempRect:Rect = new Rect();

    private mScroller:OverScroller;

    //private mEdgeGlowLeft:EdgeEffect;
    //
    //private mEdgeGlowRight:EdgeEffect;

    /**
     * Position of the last motion event.
     */
    private mLastMotionX:number = 0;

    /**
     * True when the layout has changed but the traversal has not come through yet.
     * Ideally the view hierarchy would keep track of this for us.
     */
    private mIsLayoutDirty:boolean = true;

    /**
     * The child to give focus to in the event that a child has requested focus while the
     * layout is dirty. This prevents the scroll from being wrong if the child has not been
     * laid out before requesting focus.
     */
    private mChildToScrollTo:View = null;

    /**
     * True if the user is currently dragging this ScrollView around. This is
     * not the same as 'is being flinged', which can be checked by
     * mScroller.isFinished() (flinging begins when the user lifts his finger).
     */
    private mIsBeingDragged:boolean = false;

    /**
     * Determines speed during touch scrolling
     */
    private mVelocityTracker:VelocityTracker;

    /**
     * When set to true, the scroll view measure its child to make it fill the currently
     * visible area.
     */
    private mFillViewport:boolean;

    /**
     * Whether arrow scrolling is animated.
     */
    private mSmoothScrollingEnabled:boolean = true;

    //private mTouchSlop:number = 0;

    private mMinimumVelocity:number = 0;

    private mMaximumVelocity:number = 0;

    private mOverscrollDistance:number = 0;

    private _mOverflingDistance:number = 0;
    private get mOverflingDistance():number {
        if (this.mScrollX < -this._mOverflingDistance) return -this.mScrollX;
        let overDistance = this.mScrollX - this.getScrollRange();
        if (overDistance > this._mOverflingDistance) return overDistance;
        return this._mOverflingDistance;
    }
    private set mOverflingDistance(value:number) {
        this._mOverflingDistance = value;
    }

    /**
     * ID of the active pointer. This is used to retain consistency during
     * drags/flings if multiple pointers are used.
     */
    private mActivePointerId:number = HorizontalScrollView.INVALID_POINTER;

    /**
     * Sentinel value for no current active pointer.
     * Used by {@link #mActivePointerId}.
     */
    private static INVALID_POINTER:number = -1;

    //private mSavedState:HorizontalScrollView.SavedState;

    constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle?:Map<string, string>) {
        super(context, bindElement, defStyle);
        this.initScrollView();
        let a = context.obtainStyledAttributes(bindElement, defStyle);
        this.setFillViewport(a.getBoolean('fillViewport', false));
        a.recycle();
    }

    protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
        return super.createClassAttrBinder().set('', {
            setter(v:HorizontalScrollView, value:any, attrBinder:androidui.attr.AttrBinder) {
                v.setFillViewport(attrBinder.parseBoolean(value));
            }, getter(v:HorizontalScrollView) {
                return v.isFillViewport();
            }
        });
    }

    protected getLeftFadingEdgeStrength():number  {
        if (this.getChildCount() == 0) {
            return 0.0;
        }
        const length:number = this.getHorizontalFadingEdgeLength();
        if (this.mScrollX < length) {
            return this.mScrollX / <number> length;
        }
        return 1.0;
    }

    protected getRightFadingEdgeStrength():number  {
        if (this.getChildCount() == 0) {
            return 0.0;
        }
        const length:number = this.getHorizontalFadingEdgeLength();
        const rightEdge:number = this.getWidth() - this.mPaddingRight;
        const span:number = this.getChildAt(0).getRight() - this.mScrollX - rightEdge;
        if (span < length) {
            return span / <number> length;
        }
        return 1.0;
    }

    /**
     * @return The maximum amount this scroll view will scroll in response to
     *   an arrow event.
     */
    getMaxScrollAmount():number  {
        return Math.floor((HorizontalScrollView.MAX_SCROLL_FACTOR * (this.mRight - this.mLeft)));
    }

    private initScrollView():void  {
        this.mScroller = new OverScroller();
        this.setFocusable(true);
        this.setDescendantFocusability(HorizontalScrollView.FOCUS_AFTER_DESCENDANTS);
        this.setWillNotDraw(false);
        const configuration:ViewConfiguration = ViewConfiguration.get();
        this.mTouchSlop = configuration.getScaledTouchSlop();
        this.mMinimumVelocity = configuration.getScaledMinimumFlingVelocity();
        this.mMaximumVelocity = configuration.getScaledMaximumFlingVelocity();
        this.mOverscrollDistance = configuration.getScaledOverscrollDistance();
        this._mOverflingDistance = configuration.getScaledOverflingDistance();

        this.initScrollCache();
        this.setHorizontalScrollBarEnabled(true);
    }

    addView(...args) {
        if (this.getChildCount() > 0) {
            throw new Error("ScrollView can host only one direct child");
        }
        return super.addView(...args);
    }

    /**
     * @return Returns true this HorizontalScrollView can be scrolled
     */
    private canScroll():boolean  {
        let child:View = this.getChildAt(0);
        if (child != null) {
            let childWidth:number = child.getWidth();
            return this.getWidth() < childWidth + this.mPaddingLeft + this.mPaddingRight;
        }
        return false;
    }

    /**
     * Indicates whether this HorizontalScrollView's content is stretched to
     * fill the viewport.
     *
     * @return True if the content fills the viewport, false otherwise.
     *
     * @attr ref android.R.styleable#HorizontalScrollView_fillViewport
     */
    isFillViewport():boolean  {
        return this.mFillViewport;
    }

    /**
     * Indicates this HorizontalScrollView whether it should stretch its content width
     * to fill the viewport or not.
     *
     * @param fillViewport True to stretch the content's width to the viewport's
     *        boundaries, false otherwise.
     *
     * @attr ref android.R.styleable#HorizontalScrollView_fillViewport
     */
    setFillViewport(fillViewport:boolean):void  {
        if (fillViewport != this.mFillViewport) {
            this.mFillViewport = fillViewport;
            this.requestLayout();
        }
    }

    /**
     * @return Whether arrow scrolling will animate its transition.
     */
    isSmoothScrollingEnabled():boolean  {
        return this.mSmoothScrollingEnabled;
    }

    /**
     * Set whether arrow scrolling will animate its transition.
     * @param smoothScrollingEnabled whether arrow scrolling will animate its transition
     */
    setSmoothScrollingEnabled(smoothScrollingEnabled:boolean):void  {
        this.mSmoothScrollingEnabled = smoothScrollingEnabled;
    }

    protected onMeasure(widthMeasureSpec:number, heightMeasureSpec:number):void  {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        if (!this.mFillViewport) {
            return;
        }
        const widthMode:number = View.MeasureSpec.getMode(widthMeasureSpec);
        if (widthMode == View.MeasureSpec.UNSPECIFIED) {
            return;
        }
        if (this.getChildCount() > 0) {
            const child:View = this.getChildAt(0);
            let width:number = this.getMeasuredWidth();
            if (child.getMeasuredWidth() < width) {
                const lp:FrameLayout.LayoutParams = <FrameLayout.LayoutParams> child.getLayoutParams();
                let childHeightMeasureSpec:number = HorizontalScrollView.getChildMeasureSpec(heightMeasureSpec, this.mPaddingTop + this.mPaddingBottom, lp.height);
                width -= this.mPaddingLeft;
                width -= this.mPaddingRight;
                let childWidthMeasureSpec:number = View.MeasureSpec.makeMeasureSpec(width, View.MeasureSpec.EXACTLY);
                child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
            }
        }
    }

    dispatchKeyEvent(event:KeyEvent):boolean  {
        // Let the focused view and/or our descendants get the key first
        return super.dispatchKeyEvent(event) || this.executeKeyEvent(event);
    }

    /**
     * You can call this function yourself to have the scroll view perform
     * scrolling from a key event, just as if the event had been dispatched to
     * it by the view hierarchy.
     *
     * @param event The key event to execute.
     * @return Return true if the event was handled, else false.
     */
    executeKeyEvent(event:KeyEvent):boolean  {
        this.mTempRect.setEmpty();
        if (!this.canScroll()) {
            if (this.isFocused()) {
                let currentFocused:View = this.findFocus();
                if (currentFocused == this)
                    currentFocused = null;
                let nextFocused:View = FocusFinder.getInstance().findNextFocus(this, currentFocused, View.FOCUS_RIGHT);
                return nextFocused != null && nextFocused != this && nextFocused.requestFocus(View.FOCUS_RIGHT);
            }
            return false;
        }
        let handled:boolean = false;
        if (event.getAction() == KeyEvent.ACTION_DOWN) {
            switch(event.getKeyCode()) {
                case KeyEvent.KEYCODE_DPAD_LEFT:
                    if (!event.isAltPressed()) {
                        handled = this.arrowScroll(View.FOCUS_LEFT);
                    } else {
                        handled = this.fullScroll(View.FOCUS_LEFT);
                    }
                    break;
                case KeyEvent.KEYCODE_DPAD_RIGHT:
                    if (!event.isAltPressed()) {
                        handled = this.arrowScroll(View.FOCUS_RIGHT);
                    } else {
                        handled = this.fullScroll(View.FOCUS_RIGHT);
                    }
                    break;
                case KeyEvent.KEYCODE_SPACE:
                    this.pageScroll(event.isShiftPressed() ? View.FOCUS_LEFT : View.FOCUS_RIGHT);
                    break;
            }
        }
        return handled;
    }

    private inChild(x:number, y:number):boolean  {
        if (this.getChildCount() > 0) {
            const scrollX:number = this.mScrollX;
            const child:View = this.getChildAt(0);
            return !(y < child.getTop() || y >= child.getBottom() || x < child.getLeft() - scrollX || x >= child.getRight() - scrollX);
        }
        return false;
    }

    private initOrResetVelocityTracker():void  {
        if (this.mVelocityTracker == null) {
            this.mVelocityTracker = VelocityTracker.obtain();
        } else {
            this.mVelocityTracker.clear();
        }
    }

    private initVelocityTrackerIfNotExists():void  {
        if (this.mVelocityTracker == null) {
            this.mVelocityTracker = VelocityTracker.obtain();
        }
    }

    private recycleVelocityTracker():void  {
        if (this.mVelocityTracker != null) {
            this.mVelocityTracker.recycle();
            this.mVelocityTracker = null;
        }
    }

    requestDisallowInterceptTouchEvent(disallowIntercept:boolean):void  {
        if (disallowIntercept) {
            this.recycleVelocityTracker();
        }
        super.requestDisallowInterceptTouchEvent(disallowIntercept);
    }

    onInterceptTouchEvent(ev:MotionEvent):boolean  {
        /*
         * This method JUST determines whether we want to intercept the motion.
         * If we return true, onMotionEvent will be called and we do the actual
         * scrolling there.
         */
        /*
        * Shortcut the most recurring case: the user is in the dragging
        * state and he is moving his finger.  We want to intercept this
        * motion.
        */
        const action:number = ev.getAction();
        if ((action == MotionEvent.ACTION_MOVE) && (this.mIsBeingDragged)) {
            return true;
        }
        switch(action & MotionEvent.ACTION_MASK) {
            case MotionEvent.ACTION_MOVE:
                {
                    /*
                 * mIsBeingDragged == false, otherwise the shortcut would have caught it. Check
                 * whether the user has moved far enough from his original down touch.
                 */
                    /*
                * Locally do absolute value. mLastMotionX is set to the x value
                * of the down event.
                */
                    const activePointerId:number = this.mActivePointerId;
                    if (activePointerId == HorizontalScrollView.INVALID_POINTER) {
                        // If we don't have a valid id, the touch down wasn't on content.
                        break;
                    }
                    const pointerIndex:number = ev.findPointerIndex(activePointerId);
                    if (pointerIndex == -1) {
                        Log.e(HorizontalScrollView.TAG, "Invalid pointerId=" + activePointerId + " in onInterceptTouchEvent");
                        break;
                    }
                    const x:number = Math.floor(ev.getX(pointerIndex));
                    const xDiff:number = Math.floor(Math.abs(x - this.mLastMotionX));
                    if (xDiff > this.mTouchSlop) {
                        this.mIsBeingDragged = true;
                        this.mLastMotionX = x;
                        this.initVelocityTrackerIfNotExists();
                        this.mVelocityTracker.addMovement(ev);
                        if (this.mParent != null)
                            this.mParent.requestDisallowInterceptTouchEvent(true);
                    }
                    break;
                }
            case MotionEvent.ACTION_DOWN:
                {
                    const x:number = Math.floor(ev.getX());
                    if (!this.inChild(Math.floor(x), Math.floor(ev.getY()))) {
                        this.mIsBeingDragged = false;
                        this.recycleVelocityTracker();
                        break;
                    }
                    /*
                 * Remember location of down touch.
                 * ACTION_DOWN always refers to pointer index 0.
                 */
                    this.mLastMotionX = x;
                    this.mActivePointerId = ev.getPointerId(0);
                    this.initOrResetVelocityTracker();
                    this.mVelocityTracker.addMovement(ev);
                    /*
                * If being flinged and user touches the screen, initiate drag;
                * otherwise don't.  mScroller.isFinished should be false when
                * being flinged.
                */
                    this.mIsBeingDragged = !this.mScroller.isFinished();
                    break;
                }
            case MotionEvent.ACTION_CANCEL:
            case MotionEvent.ACTION_UP:
                /* Release the drag */
                this.mIsBeingDragged = false;
                this.mActivePointerId = HorizontalScrollView.INVALID_POINTER;
                if (this.mScroller.springBack(this.mScrollX, this.mScrollY, 0, this.getScrollRange(), 0, 0)) {
                    this.postInvalidateOnAnimation();
                }
                break;
            case MotionEvent.ACTION_POINTER_DOWN:
                {
                    const index:number = ev.getActionIndex();
                    this.mLastMotionX = Math.floor(ev.getX(index));
                    this.mActivePointerId = ev.getPointerId(index);
                    break;
                }
            case MotionEvent.ACTION_POINTER_UP:
                this.onSecondaryPointerUp(ev);
                this.mLastMotionX = Math.floor(ev.getX(ev.findPointerIndex(this.mActivePointerId)));
                break;
        }
        /*
        * The only time we want to intercept motion events is if we are in the
        * drag mode.
        */
        return this.mIsBeingDragged;
    }

    onTouchEvent(ev:MotionEvent):boolean  {
        this.initVelocityTrackerIfNotExists();
        this.mVelocityTracker.addMovement(ev);
        const action:number = ev.getAction();
        switch(action & MotionEvent.ACTION_MASK) {
            case MotionEvent.ACTION_DOWN:
                {
                    if (this.getChildCount() == 0) {
                        return false;
                    }
                    if ((this.mIsBeingDragged = !this.mScroller.isFinished())) {
                        const parent:ViewParent = this.getParent();
                        if (parent != null) {
                            parent.requestDisallowInterceptTouchEvent(true);
                        }
                    }
                    /*
                 * If being flinged and user touches, stop the fling. isFinished
                 * will be false if being flinged.
                 */
                    if (!this.mScroller.isFinished()) {
                        this.mScroller.abortAnimation();
                    }
                    // Remember where the motion event started
                    this.mLastMotionX = Math.floor(ev.getX());
                    this.mActivePointerId = ev.getPointerId(0);
                    break;
                }
            case MotionEvent.ACTION_MOVE:
                const activePointerIndex:number = ev.findPointerIndex(this.mActivePointerId);
                if (activePointerIndex == -1) {
                    Log.e(HorizontalScrollView.TAG, "Invalid pointerId=" + this.mActivePointerId + " in onTouchEvent");
                    break;
                }
                const x:number = Math.floor(ev.getX(activePointerIndex));
                let deltaX:number = this.mLastMotionX - x;
                if (!this.mIsBeingDragged && Math.abs(deltaX) > this.mTouchSlop) {
                    const parent:ViewParent = this.getParent();
                    if (parent != null) {
                        parent.requestDisallowInterceptTouchEvent(true);
                    }
                    this.mIsBeingDragged = true;
                    if (deltaX > 0) {
                        deltaX -= this.mTouchSlop;
                    } else {
                        deltaX += this.mTouchSlop;
                    }
                }
                if (this.mIsBeingDragged) {
                    // Scroll to follow the motion event
                    this.mLastMotionX = x;
                    const oldX:number = this.mScrollX;
                    const oldY:number = this.mScrollY;
                    const range:number = this.getScrollRange();
                    const overscrollMode:number = this.getOverScrollMode();
                    const canOverscroll:boolean = overscrollMode == HorizontalScrollView.OVER_SCROLL_ALWAYS || (overscrollMode == HorizontalScrollView.OVER_SCROLL_IF_CONTENT_SCROLLS && range > 0);
                    // calls onScrollChanged if applicable.
                    if (this.overScrollBy(deltaX, 0, this.mScrollX, 0, range, 0, this.mOverscrollDistance, 0, true)) {
                        // Break our velocity if we hit a scroll barrier.
                        this.mVelocityTracker.clear();
                    }
                    if (canOverscroll) {
                        //const pulledToX:number = oldX + deltaX;
                        //if (pulledToX < 0) {
                        //    this.mEdgeGlowLeft.onPull(<number> deltaX / this.getWidth());
                        //    if (!this.mEdgeGlowRight.isFinished()) {
                        //        this.mEdgeGlowRight.onRelease();
                        //    }
                        //} else if (pulledToX > range) {
                        //    this.mEdgeGlowRight.onPull(<number> deltaX / this.getWidth());
                        //    if (!this.mEdgeGlowLeft.isFinished()) {
                        //        this.mEdgeGlowLeft.onRelease();
                        //    }
                        //}
                        //if (this.mEdgeGlowLeft != null && (!this.mEdgeGlowLeft.isFinished() || !this.mEdgeGlowRight.isFinished())) {
                        //    this.postInvalidateOnAnimation();
                        //}
                    }
                }
                break;
            case MotionEvent.ACTION_UP:
                if (this.mIsBeingDragged) {
                    const velocityTracker:VelocityTracker = this.mVelocityTracker;
                    velocityTracker.computeCurrentVelocity(1000, this.mMaximumVelocity);
                    let initialVelocity:number = Math.floor(velocityTracker.getXVelocity(this.mActivePointerId));
                    if (this.getChildCount() > 0) {
                        let isOverDrag = this.mScrollX < 0 || this.mScrollX > this.getScrollRange();
                        if (!isOverDrag && (Math.abs(initialVelocity) > this.mMinimumVelocity)) {
                            this.fling(-initialVelocity);
                        } else {
                            if (this.mScroller.springBack(this.mScrollX, this.mScrollY, 0, this.getScrollRange(), 0, 0)) {
                                this.postInvalidateOnAnimation();
                            }
                        }
                    }
                    this.mActivePointerId = HorizontalScrollView.INVALID_POINTER;
                    this.mIsBeingDragged = false;
                    this.recycleVelocityTracker();
                    //if (this.mEdgeGlowLeft != null) {
                    //    this.mEdgeGlowLeft.onRelease();
                    //    this.mEdgeGlowRight.onRelease();
                    //}
                }
                break;
            case MotionEvent.ACTION_CANCEL:
                if (this.mIsBeingDragged && this.getChildCount() > 0) {
                    if (this.mScroller.springBack(this.mScrollX, this.mScrollY, 0, this.getScrollRange(), 0, 0)) {
                        this.postInvalidateOnAnimation();
                    }
                    this.mActivePointerId = HorizontalScrollView.INVALID_POINTER;
                    this.mIsBeingDragged = false;
                    this.recycleVelocityTracker();
                    //if (this.mEdgeGlowLeft != null) {
                    //    this.mEdgeGlowLeft.onRelease();
                    //    this.mEdgeGlowRight.onRelease();
                    //}
                }
                break;
            case MotionEvent.ACTION_POINTER_UP:
                this.onSecondaryPointerUp(ev);
                break;
        }
        return true;
    }

    private onSecondaryPointerUp(ev:MotionEvent):void  {
        const pointerIndex:number = (ev.getAction() & MotionEvent.ACTION_POINTER_INDEX_MASK) >> MotionEvent.ACTION_POINTER_INDEX_SHIFT;
        const pointerId:number = ev.getPointerId(pointerIndex);
        if (pointerId == this.mActivePointerId) {
            // This was our active pointer going up. Choose a new
            // active pointer and adjust accordingly.
            // TODO: Make this decision more intelligent.
            const newPointerIndex:number = pointerIndex == 0 ? 1 : 0;
            this.mLastMotionX = Math.floor(ev.getX(newPointerIndex));
            this.mActivePointerId = ev.getPointerId(newPointerIndex);
            if (this.mVelocityTracker != null) {
                this.mVelocityTracker.clear();
            }
        }
    }

    onGenericMotionEvent(event:MotionEvent):boolean  {
        if (event.isPointerEvent()) {
            switch(event.getAction()) {
                case MotionEvent.ACTION_SCROLL:
                    {
                        if (!this.mIsBeingDragged) {
                            let hscroll:number;
                            //if ((event.getMetaState() & KeyEvent.META_SHIFT_ON) != 0) {
                               hscroll = -event.getAxisValue(MotionEvent.AXIS_VSCROLL);
                            //} else {
                            //     hscroll = event.getAxisValue(MotionEvent.AXIS_HSCROLL);
                            //}
                            if (hscroll != 0) {
                                const delta:number = Math.floor((hscroll * this.getHorizontalScrollFactor()));
                                const range:number = this.getScrollRange();
                                let oldScrollX:number = this.mScrollX;
                                let newScrollX:number = oldScrollX + delta;
                                if (newScrollX < 0) {
                                    newScrollX = 0;
                                } else if (newScrollX > range) {
                                    newScrollX = range;
                                }
                                if (newScrollX != oldScrollX) {
                                    super.scrollTo(newScrollX, this.mScrollY);
                                    return true;
                                }
                            }
                        }
                    }
            }
        }
        return super.onGenericMotionEvent(event);
    }

    shouldDelayChildPressedState():boolean  {
        return true;
    }

    protected onOverScrolled(scrollX:number, scrollY:number, clampedX:boolean, clampedY:boolean):void  {
        // Treat animating scrolls differently; see #computeScroll() for why.
        if (!this.mScroller.isFinished()) {
            const oldX:number = this.mScrollX;
            const oldY:number = this.mScrollY;
            this.mScrollX = scrollX;
            this.mScrollY = scrollY;
            this.invalidateParentIfNeeded();
            this.onScrollChanged(this.mScrollX, this.mScrollY, oldX, oldY);
            if (clampedX) {
                this.mScroller.springBack(this.mScrollX, this.mScrollY, 0, this.getScrollRange(), 0, 0);
            }
        } else {
            super.scrollTo(scrollX, scrollY);
        }
        this.awakenScrollBars();
    }

    //performAccessibilityAction(action:number, arguments:Bundle):boolean  {
    //    if (super.performAccessibilityAction(action, arguments)) {
    //        return true;
    //    }
    //    switch(action) {
    //        case AccessibilityNodeInfo.ACTION_SCROLL_FORWARD:
    //            {
    //                if (!this.isEnabled()) {
    //                    return false;
    //                }
    //                const viewportWidth:number = this.getWidth() - this.mPaddingLeft - this.mPaddingRight;
    //                const targetScrollX:number = Math.min(this.mScrollX + viewportWidth, this.getScrollRange());
    //                if (targetScrollX != this.mScrollX) {
    //                    this.smoothScrollTo(targetScrollX, 0);
    //                    return true;
    //                }
    //            }
    //            return false;
    //        case AccessibilityNodeInfo.ACTION_SCROLL_BACKWARD:
    //            {
    //                if (!this.isEnabled()) {
    //                    return false;
    //                }
    //                const viewportWidth:number = this.getWidth() - this.mPaddingLeft - this.mPaddingRight;
    //                const targetScrollX:number = Math.max(0, this.mScrollX - viewportWidth);
    //                if (targetScrollX != this.mScrollX) {
    //                    this.smoothScrollTo(targetScrollX, 0);
    //                    return true;
    //                }
    //            }
    //            return false;
    //    }
    //    return false;
    //}
    //
    //onInitializeAccessibilityNodeInfo(info:AccessibilityNodeInfo):void  {
    //    super.onInitializeAccessibilityNodeInfo(info);
    //    info.setClassName(HorizontalScrollView.class.getName());
    //    const scrollRange:number = this.getScrollRange();
    //    if (scrollRange > 0) {
    //        info.setScrollable(true);
    //        if (this.isEnabled() && this.mScrollX > 0) {
    //            info.addAction(AccessibilityNodeInfo.ACTION_SCROLL_BACKWARD);
    //        }
    //        if (this.isEnabled() && this.mScrollX < scrollRange) {
    //            info.addAction(AccessibilityNodeInfo.ACTION_SCROLL_FORWARD);
    //        }
    //    }
    //}
    //
    //onInitializeAccessibilityEvent(event:AccessibilityEvent):void  {
    //    super.onInitializeAccessibilityEvent(event);
    //    event.setClassName(HorizontalScrollView.class.getName());
    //    event.setScrollable(this.getScrollRange() > 0);
    //    event.setScrollX(this.mScrollX);
    //    event.setScrollY(this.mScrollY);
    //    event.setMaxScrollX(this.getScrollRange());
    //    event.setMaxScrollY(this.mScrollY);
    //}

    private getScrollRange():number  {
        let scrollRange:number = 0;
        if (this.getChildCount() > 0) {
            let child:View = this.getChildAt(0);
            scrollRange = Math.max(0, child.getWidth() - (this.getWidth() - this.mPaddingLeft - this.mPaddingRight));
        }
        return scrollRange;
    }

    /**
     * <p>
     * Finds the next focusable component that fits in this View's bounds
     * (excluding fading edges) pretending that this View's left is located at
     * the parameter left.
     * </p>
     *
     * @param leftFocus          look for a candidate is the one at the left of the bounds
     *                           if leftFocus is true, or at the right of the bounds if leftFocus
     *                           is false
     * @param left               the left offset of the bounds in which a focusable must be
     *                           found (the fading edge is assumed to start at this position)
     * @param preferredFocusable the View that has highest priority and will be
     *                           returned if it is within my bounds (null is valid)
     * @return the next focusable component in the bounds or null if none can be found
     */
    private findFocusableViewInMyBounds(leftFocus:boolean, left:number, preferredFocusable:View):View  {
        /*
         * The fading edge's transparent side should be considered for focus
         * since it's mostly visible, so we divide the actual fading edge length
         * by 2.
         */
        const fadingEdgeLength:number = this.getHorizontalFadingEdgeLength() / 2;
        const leftWithoutFadingEdge:number = left + fadingEdgeLength;
        const rightWithoutFadingEdge:number = left + this.getWidth() - fadingEdgeLength;
        if ((preferredFocusable != null) && (preferredFocusable.getLeft() < rightWithoutFadingEdge) && (preferredFocusable.getRight() > leftWithoutFadingEdge)) {
            return preferredFocusable;
        }
        return this.findFocusableViewInBounds(leftFocus, leftWithoutFadingEdge, rightWithoutFadingEdge);
    }

    /**
     * <p>
     * Finds the next focusable component that fits in the specified bounds.
     * </p>
     *
     * @param leftFocus look for a candidate is the one at the left of the bounds
     *                  if leftFocus is true, or at the right of the bounds if
     *                  leftFocus is false
     * @param left      the left offset of the bounds in which a focusable must be
     *                  found
     * @param right     the right offset of the bounds in which a focusable must
     *                  be found
     * @return the next focusable component in the bounds or null if none can
     *         be found
     */
    private findFocusableViewInBounds(leftFocus:boolean, left:number, right:number):View  {
        let focusables:List<View> = this.getFocusables(View.FOCUS_FORWARD);
        let focusCandidate:View = null;
        /*
         * A fully contained focusable is one where its left is below the bound's
         * left, and its right is above the bound's right. A partially
         * contained focusable is one where some part of it is within the
         * bounds, but it also has some part that is not within bounds.  A fully contained
         * focusable is preferred to a partially contained focusable.
         */
        let foundFullyContainedFocusable:boolean = false;
        let count:number = focusables.size();
        for (let i:number = 0; i < count; i++) {
            let view:View = focusables.get(i);
            let viewLeft:number = view.getLeft();
            let viewRight:number = view.getRight();
            if (left < viewRight && viewLeft < right) {
                /*
                 * the focusable is in the target area, it is a candidate for
                 * focusing
                 */
                const viewIsFullyContained:boolean = (left < viewLeft) && (viewRight < right);
                if (focusCandidate == null) {
                    /* No candidate, take this one */
                    focusCandidate = view;
                    foundFullyContainedFocusable = viewIsFullyContained;
                } else {
                    const viewIsCloserToBoundary:boolean = (leftFocus && viewLeft < focusCandidate.getLeft()) || (!leftFocus && viewRight > focusCandidate.getRight());
                    if (foundFullyContainedFocusable) {
                        if (viewIsFullyContained && viewIsCloserToBoundary) {
                            /*
                             * We're dealing with only fully contained views, so
                             * it has to be closer to the boundary to beat our
                             * candidate
                             */
                            focusCandidate = view;
                        }
                    } else {
                        if (viewIsFullyContained) {
                            /* Any fully contained view beats a partially contained view */
                            focusCandidate = view;
                            foundFullyContainedFocusable = true;
                        } else if (viewIsCloserToBoundary) {
                            /*
                             * Partially contained view beats another partially
                             * contained view if it's closer
                             */
                            focusCandidate = view;
                        }
                    }
                }
            }
        }
        return focusCandidate;
    }

    /**
     * <p>Handles scrolling in response to a "page up/down" shortcut press. This
     * method will scroll the view by one page left or right and give the focus
     * to the leftmost/rightmost component in the new visible area. If no
     * component is a good candidate for focus, this scrollview reclaims the
     * focus.</p>
     *
     * @param direction the scroll direction: {@link android.view.View#FOCUS_LEFT}
     *                  to go one page left or {@link android.view.View#FOCUS_RIGHT}
     *                  to go one page right
     * @return true if the key event is consumed by this method, false otherwise
     */
    pageScroll(direction:number):boolean  {
        let right:boolean = direction == View.FOCUS_RIGHT;
        let width:number = this.getWidth();
        if (right) {
            this.mTempRect.left = this.getScrollX() + width;
            let count:number = this.getChildCount();
            if (count > 0) {
                let view:View = this.getChildAt(0);
                if (this.mTempRect.left + width > view.getRight()) {
                    this.mTempRect.left = view.getRight() - width;
                }
            }
        } else {
            this.mTempRect.left = this.getScrollX() - width;
            if (this.mTempRect.left < 0) {
                this.mTempRect.left = 0;
            }
        }
        this.mTempRect.right = this.mTempRect.left + width;
        return this.scrollAndFocus(direction, this.mTempRect.left, this.mTempRect.right);
    }

    /**
     * <p>Handles scrolling in response to a "home/end" shortcut press. This
     * method will scroll the view to the left or right and give the focus
     * to the leftmost/rightmost component in the new visible area. If no
     * component is a good candidate for focus, this scrollview reclaims the
     * focus.</p>
     *
     * @param direction the scroll direction: {@link android.view.View#FOCUS_LEFT}
     *                  to go the left of the view or {@link android.view.View#FOCUS_RIGHT}
     *                  to go the right
     * @return true if the key event is consumed by this method, false otherwise
     */
    fullScroll(direction:number):boolean  {
        let right:boolean = direction == View.FOCUS_RIGHT;
        let width:number = this.getWidth();
        this.mTempRect.left = 0;
        this.mTempRect.right = width;
        if (right) {
            let count:number = this.getChildCount();
            if (count > 0) {
                let view:View = this.getChildAt(0);
                this.mTempRect.right = view.getRight();
                this.mTempRect.left = this.mTempRect.right - width;
            }
        }
        return this.scrollAndFocus(direction, this.mTempRect.left, this.mTempRect.right);
    }

    /**
     * <p>Scrolls the view to make the area defined by <code>left</code> and
     * <code>right</code> visible. This method attempts to give the focus
     * to a component visible in this area. If no component can be focused in
     * the new visible area, the focus is reclaimed by this scrollview.</p>
     *
     * @param direction the scroll direction: {@link android.view.View#FOCUS_LEFT}
     *                  to go left {@link android.view.View#FOCUS_RIGHT} to right
     * @param left     the left offset of the new area to be made visible
     * @param right    the right offset of the new area to be made visible
     * @return true if the key event is consumed by this method, false otherwise
     */
    private scrollAndFocus(direction:number, left:number, right:number):boolean  {
        let handled:boolean = true;
        let width:number = this.getWidth();
        let containerLeft:number = this.getScrollX();
        let containerRight:number = containerLeft + width;
        let goLeft:boolean = direction == View.FOCUS_LEFT;
        let newFocused:View = this.findFocusableViewInBounds(goLeft, left, right);
        if (newFocused == null) {
            newFocused = this;
        }
        if (left >= containerLeft && right <= containerRight) {
            handled = false;
        } else {
            let delta:number = goLeft ? (left - containerLeft) : (right - containerRight);
            this.doScrollX(delta);
        }
        if (newFocused != this.findFocus())
            newFocused.requestFocus(direction);
        return handled;
    }

    /**
     * Handle scrolling in response to a left or right arrow click.
     *
     * @param direction The direction corresponding to the arrow key that was
     *                  pressed
     * @return True if we consumed the event, false otherwise
     */
    arrowScroll(direction:number):boolean  {
        let currentFocused:View = this.findFocus();
        if (currentFocused == this)
            currentFocused = null;
        let nextFocused:View = FocusFinder.getInstance().findNextFocus(this, currentFocused, direction);
        const maxJump:number = this.getMaxScrollAmount();
        if (nextFocused != null && this.isWithinDeltaOfScreen(nextFocused, maxJump)) {
            nextFocused.getDrawingRect(this.mTempRect);
            this.offsetDescendantRectToMyCoords(nextFocused, this.mTempRect);
            let scrollDelta:number = this.computeScrollDeltaToGetChildRectOnScreen(this.mTempRect);
            this.doScrollX(scrollDelta);
            nextFocused.requestFocus(direction);
        } else {
            // no new focus
            let scrollDelta:number = maxJump;
            if (direction == View.FOCUS_LEFT && this.getScrollX() < scrollDelta) {
                scrollDelta = this.getScrollX();
            } else if (direction == View.FOCUS_RIGHT && this.getChildCount() > 0) {
                let daRight:number = this.getChildAt(0).getRight();
                let screenRight:number = this.getScrollX() + this.getWidth();
                if (daRight - screenRight < maxJump) {
                    scrollDelta = daRight - screenRight;
                }
            }
            if (scrollDelta == 0) {
                return false;
            }
            this.doScrollX(direction == View.FOCUS_RIGHT ? scrollDelta : -scrollDelta);
        }
        if (currentFocused != null && currentFocused.isFocused() && this.isOffScreen(currentFocused)) {
            // previously focused item still has focus and is off screen, give
            // it up (take it back to ourselves)
            // (also, need to temporarily force FOCUS_BEFORE_DESCENDANTS so we are
            // sure to
            // get it)
            // save
            const descendantFocusability:number = this.getDescendantFocusability();
            this.setDescendantFocusability(ViewGroup.FOCUS_BEFORE_DESCENDANTS);
            this.requestFocus();
            // restore
            this.setDescendantFocusability(descendantFocusability);
        }
        return true;
    }

    /**
     * @return whether the descendant of this scroll view is scrolled off
     *  screen.
     */
    private isOffScreen(descendant:View):boolean  {
        return !this.isWithinDeltaOfScreen(descendant, 0);
    }

    /**
     * @return whether the descendant of this scroll view is within delta
     *  pixels of being on the screen.
     */
    private isWithinDeltaOfScreen(descendant:View, delta:number):boolean  {
        descendant.getDrawingRect(this.mTempRect);
        this.offsetDescendantRectToMyCoords(descendant, this.mTempRect);
        return (this.mTempRect.right + delta) >= this.getScrollX() && (this.mTempRect.left - delta) <= (this.getScrollX() + this.getWidth());
    }

    /**
     * Smooth scroll by a X delta
     *
     * @param delta the number of pixels to scroll by on the X axis
     */
    private doScrollX(delta:number):void  {
        if (delta != 0) {
            if (this.mSmoothScrollingEnabled) {
                this.smoothScrollBy(delta, 0);
            } else {
                this.scrollBy(delta, 0);
            }
        }
    }

    /**
     * Like {@link View#scrollBy}, but scroll smoothly instead of immediately.
     *
     * @param dx the number of pixels to scroll by on the X axis
     * @param dy the number of pixels to scroll by on the Y axis
     */
    smoothScrollBy(dx:number, dy:number):void  {
        if (this.getChildCount() == 0) {
            // Nothing to do.
            return;
        }
        let duration:number = AnimationUtils.currentAnimationTimeMillis() - this.mLastScroll;
        if (duration > HorizontalScrollView.ANIMATED_SCROLL_GAP) {
            const width:number = this.getWidth() - this.mPaddingRight - this.mPaddingLeft;
            const right:number = this.getChildAt(0).getWidth();
            const maxX:number = Math.max(0, right - width);
            const scrollX:number = this.mScrollX;
            dx = Math.max(0, Math.min(scrollX + dx, maxX)) - scrollX;
            this.mScroller.startScroll(scrollX, this.mScrollY, dx, 0);
            this.postInvalidateOnAnimation();
        } else {
            if (!this.mScroller.isFinished()) {
                this.mScroller.abortAnimation();
            }
            this.scrollBy(dx, dy);
        }
        this.mLastScroll = AnimationUtils.currentAnimationTimeMillis();
    }

    /**
     * Like {@link #scrollTo}, but scroll smoothly instead of immediately.
     *
     * @param x the position where to scroll on the X axis
     * @param y the position where to scroll on the Y axis
     */
    smoothScrollTo(x:number, y:number):void  {
        this.smoothScrollBy(x - this.mScrollX, y - this.mScrollY);
    }

    /**
     * <p>The scroll range of a scroll view is the overall width of all of its
     * children.</p>
     */
    protected computeHorizontalScrollRange():number  {
        const count:number = this.getChildCount();
        const contentWidth:number = this.getWidth() - this.mPaddingLeft - this.mPaddingRight;
        if (count == 0) {
            return contentWidth;
        }
        let scrollRange:number = this.getChildAt(0).getRight();
        const scrollX:number = this.mScrollX;
        const overscrollRight:number = Math.max(0, scrollRange - contentWidth);
        if (scrollX < 0) {
            scrollRange -= scrollX;
        } else if (scrollX > overscrollRight) {
            scrollRange += scrollX - overscrollRight;
        }
        return scrollRange;
    }

    protected computeHorizontalScrollOffset():number  {
        return Math.max(0, super.computeHorizontalScrollOffset());
    }

    protected measureChild(child:View, parentWidthMeasureSpec:number, parentHeightMeasureSpec:number):void  {
        let lp:ViewGroup.LayoutParams = child.getLayoutParams();
        let childWidthMeasureSpec:number;
        let childHeightMeasureSpec:number;
        childHeightMeasureSpec = HorizontalScrollView.getChildMeasureSpec(parentHeightMeasureSpec, this.mPaddingTop + this.mPaddingBottom, lp.height);
        childWidthMeasureSpec = View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED);
        child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
    }

    protected measureChildWithMargins(child:View, parentWidthMeasureSpec:number, widthUsed:number, parentHeightMeasureSpec:number, heightUsed:number):void  {
        const lp:ViewGroup.MarginLayoutParams = <ViewGroup.MarginLayoutParams> child.getLayoutParams();
        const childHeightMeasureSpec:number = HorizontalScrollView.getChildMeasureSpec(parentHeightMeasureSpec, this.mPaddingTop + this.mPaddingBottom + lp.topMargin + lp.bottomMargin + heightUsed, lp.height);
        const childWidthMeasureSpec:number = View.MeasureSpec.makeMeasureSpec(lp.leftMargin + lp.rightMargin, View.MeasureSpec.UNSPECIFIED);
        child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
    }

    computeScroll():void  {
        if (this.mScroller.computeScrollOffset()) {
            // This is called at drawing time by ViewGroup.  We don't want to
            // re-show the scrollbars at this point, which scrollTo will do,
            // so we replicate most of scrollTo here.
            //
            //         It's a little odd to call onScrollChanged from inside the drawing.
            //
            //         It is, except when you remember that computeScroll() is used to
            //         animate scrolling. So unless we want to defer the onScrollChanged()
            //         until the end of the animated scrolling, we don't really have a
            //         choice here.
            //
            //         I agree.  The alternative, which I think would be worse, is to post
            //         something and tell the subclasses later.  This is bad because there
            //         will be a window where mScrollX/Y is different from what the app
            //         thinks it is.
            //
            let oldX:number = this.mScrollX;
            let oldY:number = this.mScrollY;
            let x:number = this.mScroller.getCurrX();
            let y:number = this.mScroller.getCurrY();
            if (oldX != x || oldY != y) {
                const range:number = this.getScrollRange();
                const overscrollMode:number = this.getOverScrollMode();
                const canOverscroll:boolean = overscrollMode == HorizontalScrollView.OVER_SCROLL_ALWAYS || (overscrollMode == HorizontalScrollView.OVER_SCROLL_IF_CONTENT_SCROLLS && range > 0);
                this.overScrollBy(x - oldX, y - oldY, oldX, oldY, range, 0, this.mOverflingDistance, 0, false);
                this.onScrollChanged(this.mScrollX, this.mScrollY, oldX, oldY);
                if (canOverscroll) {
                    //if (x < 0 && oldX >= 0) {
                    //    this.mEdgeGlowLeft.onAbsorb(Math.floor(this.mScroller.getCurrVelocity()));
                    //} else if (x > range && oldX <= range) {
                    //    this.mEdgeGlowRight.onAbsorb(Math.floor(this.mScroller.getCurrVelocity()));
                    //}
                }
            }
            if (!this.awakenScrollBars()) {
                this.postInvalidateOnAnimation();
            }
        }
    }

    /**
     * Scrolls the view to the given child.
     *
     * @param child the View to scroll to
     */
    private scrollToChild(child:View):void  {
        child.getDrawingRect(this.mTempRect);
        /* Offset from child's local coordinates to ScrollView coordinates */
        this.offsetDescendantRectToMyCoords(child, this.mTempRect);
        let scrollDelta:number = this.computeScrollDeltaToGetChildRectOnScreen(this.mTempRect);
        if (scrollDelta != 0) {
            this.scrollBy(scrollDelta, 0);
        }
    }

    /**
     * If rect is off screen, scroll just enough to get it (or at least the
     * first screen size chunk of it) on screen.
     *
     * @param rect      The rectangle.
     * @param immediate True to scroll immediately without animation
     * @return true if scrolling was performed
     */
    private scrollToChildRect(rect:Rect, immediate:boolean):boolean  {
        const delta:number = this.computeScrollDeltaToGetChildRectOnScreen(rect);
        const scroll:boolean = delta != 0;
        if (scroll) {
            if (immediate) {
                this.scrollBy(delta, 0);
            } else {
                this.smoothScrollBy(delta, 0);
            }
        }
        return scroll;
    }

    /**
     * Compute the amount to scroll in the X direction in order to get
     * a rectangle completely on the screen (or, if taller than the screen,
     * at least the first screen size chunk of it).
     *
     * @param rect The rect.
     * @return The scroll delta.
     */
    protected computeScrollDeltaToGetChildRectOnScreen(rect:Rect):number  {
        if (this.getChildCount() == 0)
            return 0;
        let width:number = this.getWidth();
        let screenLeft:number = this.getScrollX();
        let screenRight:number = screenLeft + width;
        let fadingEdge:number = this.getHorizontalFadingEdgeLength();
        // leave room for left fading edge as long as rect isn't at very left
        if (rect.left > 0) {
            screenLeft += fadingEdge;
        }
        // leave room for right fading edge as long as rect isn't at very right
        if (rect.right < this.getChildAt(0).getWidth()) {
            screenRight -= fadingEdge;
        }
        let scrollXDelta:number = 0;
        if (rect.right > screenRight && rect.left > screenLeft) {
            if (rect.width() > width) {
                // just enough to get screen size chunk on
                scrollXDelta += (rect.left - screenLeft);
            } else {
                // get entire rect at right of screen
                scrollXDelta += (rect.right - screenRight);
            }
            // make sure we aren't scrolling beyond the end of our content
            let right:number = this.getChildAt(0).getRight();
            let distanceToRight:number = right - screenRight;
            scrollXDelta = Math.min(scrollXDelta, distanceToRight);
        } else if (rect.left < screenLeft && rect.right < screenRight) {
            if (rect.width() > width) {
                // screen size chunk
                scrollXDelta -= (screenRight - rect.right);
            } else {
                // entire rect at left
                scrollXDelta -= (screenLeft - rect.left);
            }
            // make sure we aren't scrolling any further than the left our content
            scrollXDelta = Math.max(scrollXDelta, -this.getScrollX());
        }
        return scrollXDelta;
    }

    requestChildFocus(child:View, focused:View):void  {
        if (!this.mIsLayoutDirty) {
            this.scrollToChild(focused);
        } else {
            // The child may not be laid out yet, we can't compute the scroll yet
            this.mChildToScrollTo = focused;
        }
        super.requestChildFocus(child, focused);
    }

    /**
     * When looking for focus in children of a scroll view, need to be a little
     * more careful not to give focus to something that is scrolled off screen.
     *
     * This is more expensive than the default {@link android.view.ViewGroup}
     * implementation, otherwise this behavior might have been made the default.
     */
    protected onRequestFocusInDescendants(direction:number, previouslyFocusedRect:Rect):boolean  {
        // (ugh).
        if (direction == View.FOCUS_FORWARD) {
            direction = View.FOCUS_RIGHT;
        } else if (direction == View.FOCUS_BACKWARD) {
            direction = View.FOCUS_LEFT;
        }
        const nextFocus:View = previouslyFocusedRect == null ? FocusFinder.getInstance().findNextFocus(this, null, direction) : FocusFinder.getInstance().findNextFocusFromRect(this, previouslyFocusedRect, direction);
        if (nextFocus == null) {
            return false;
        }
        if (this.isOffScreen(nextFocus)) {
            return false;
        }
        return nextFocus.requestFocus(direction, previouslyFocusedRect);
    }

    requestChildRectangleOnScreen(child:View, rectangle:Rect, immediate:boolean):boolean  {
        // offset into coordinate space of this scroll view
        rectangle.offset(child.getLeft() - child.getScrollX(), child.getTop() - child.getScrollY());
        return this.scrollToChildRect(rectangle, immediate);
    }

    requestLayout():void  {
        this.mIsLayoutDirty = true;
        super.requestLayout();
    }

    protected onLayout(changed:boolean, l:number, t:number, r:number, b:number):void  {
        let childWidth:number = 0;
        let childMargins:number = 0;
        if (this.getChildCount() > 0) {
            childWidth = this.getChildAt(0).getMeasuredWidth();
            let childParams:FrameLayout.LayoutParams = <FrameLayout.LayoutParams> this.getChildAt(0).getLayoutParams();
            childMargins = childParams.leftMargin + childParams.rightMargin;
        }
        const available:number = r - l - this.getPaddingLeftWithForeground() - this.getPaddingRightWithForeground() - childMargins;
        const forceLeftGravity:boolean = (childWidth > available);
        this.layoutChildren(l, t, r, b, forceLeftGravity);
        this.mIsLayoutDirty = false;
        // Give a child focus if it needs it
        if (this.mChildToScrollTo != null && HorizontalScrollView.isViewDescendantOf(this.mChildToScrollTo, this)) {
            this.scrollToChild(this.mChildToScrollTo);
        }
        this.mChildToScrollTo = null;
        if (!this.isLaidOut()) {
            const scrollRange:number = Math.max(0, childWidth - (r - l - this.mPaddingLeft - this.mPaddingRight));
            //if (this.mSavedState != null) {
            //    if (this.isLayoutRtl() == this.mSavedState.isLayoutRtl) {
            //        this.mScrollX = this.mSavedState.scrollPosition;
            //    } else {
            //        this.mScrollX = scrollRange - this.mSavedState.scrollPosition;
            //    }
            //    this.mSavedState = null;
            //} else
            {
                if (this.isLayoutRtl()) {
                    this.mScrollX = scrollRange - this.mScrollX;
                }
            // mScrollX default value is "0" for LTR
            }
            // Don't forget to clamp
            if (this.mScrollX > scrollRange) {
                this.mScrollX = scrollRange;
            } else if (this.mScrollX < 0) {
                this.mScrollX = 0;
            }
        }
        // Calling this with the present values causes it to re-claim them
        this.scrollTo(this.mScrollX, this.mScrollY);
    }

    protected onSizeChanged(w:number, h:number, oldw:number, oldh:number):void  {
        super.onSizeChanged(w, h, oldw, oldh);
        let currentFocused:View = this.findFocus();
        if (null == currentFocused || this == currentFocused)
            return;
        const maxJump:number = this.mRight - this.mLeft;
        if (this.isWithinDeltaOfScreen(currentFocused, maxJump)) {
            currentFocused.getDrawingRect(this.mTempRect);
            this.offsetDescendantRectToMyCoords(currentFocused, this.mTempRect);
            let scrollDelta:number = this.computeScrollDeltaToGetChildRectOnScreen(this.mTempRect);
            this.doScrollX(scrollDelta);
        }
    }

    /**
     * Return true if child is a descendant of parent, (or equal to the parent).
     */
    private static isViewDescendantOf(child:View, parent:View):boolean  {
        if (child == parent) {
            return true;
        }
        const theParent:ViewParent = child.getParent();
        return (theParent instanceof ViewGroup) && HorizontalScrollView.isViewDescendantOf(<View> theParent, parent);
    }

    /**
     * Fling the scroll view
     *
     * @param velocityX The initial velocity in the X direction. Positive
     *                  numbers mean that the finger/cursor is moving down the screen,
     *                  which means we want to scroll towards the left.
     */
    fling(velocityX:number):void  {
        if (this.getChildCount() > 0) {
            let width:number = this.getWidth() - this.mPaddingRight - this.mPaddingLeft;
            let right:number = this.getChildAt(0).getWidth();
            this.mScroller.fling(this.mScrollX, this.mScrollY, velocityX, 0, 0, Math.max(0, right - width), 0, 0, width / 2, 0);
            const movingRight:boolean = velocityX > 0;
            let currentFocused:View = this.findFocus();
            let newFocused:View = this.findFocusableViewInMyBounds(movingRight, this.mScroller.getFinalX(), currentFocused);
            if (newFocused == null) {
                newFocused = this;
            }
            if (newFocused != currentFocused) {
                newFocused.requestFocus(movingRight ? View.FOCUS_RIGHT : View.FOCUS_LEFT);
            }
            this.postInvalidateOnAnimation();
        }
    }

    /**
     * {@inheritDoc}
     *
     * <p>This version also clamps the scrolling to the bounds of our child.
     */
    scrollTo(x:number, y:number):void  {
        // we rely on the fact the View.scrollBy calls scrollTo.
        if (this.getChildCount() > 0) {
            let child:View = this.getChildAt(0);
            x = HorizontalScrollView.clamp(x, this.getWidth() - this.mPaddingRight - this.mPaddingLeft, child.getWidth());
            y = HorizontalScrollView.clamp(y, this.getHeight() - this.mPaddingBottom - this.mPaddingTop, child.getHeight());
            if (x != this.mScrollX || y != this.mScrollY) {
                super.scrollTo(x, y);
            }
        }
    }

    setOverScrollMode(mode:number):void  {
        //if (mode != HorizontalScrollView.OVER_SCROLL_NEVER) {
        //    if (this.mEdgeGlowLeft == null) {
        //        let context:Context = this.getContext();
        //        this.mEdgeGlowLeft = new EdgeEffect(context);
        //        this.mEdgeGlowRight = new EdgeEffect(context);
        //    }
        //} else {
        //    this.mEdgeGlowLeft = null;
        //    this.mEdgeGlowRight = null;
        //}
        super.setOverScrollMode(mode);
    }

    draw(canvas:Canvas):void  {
        super.draw(canvas);
        //if (this.mEdgeGlowLeft != null) {
        //    const scrollX:number = this.mScrollX;
        //    if (!this.mEdgeGlowLeft.isFinished()) {
        //        const restoreCount:number = canvas.save();
        //        const height:number = this.getHeight() - this.mPaddingTop - this.mPaddingBottom;
        //        canvas.rotate(270);
        //        canvas.translate(-height + this.mPaddingTop, Math.min(0, scrollX));
        //        this.mEdgeGlowLeft.setSize(height, this.getWidth());
        //        if (this.mEdgeGlowLeft.draw(canvas)) {
        //            this.postInvalidateOnAnimation();
        //        }
        //        canvas.restoreToCount(restoreCount);
        //    }
        //    if (!this.mEdgeGlowRight.isFinished()) {
        //        const restoreCount:number = canvas.save();
        //        const width:number = this.getWidth();
        //        const height:number = this.getHeight() - this.mPaddingTop - this.mPaddingBottom;
        //        canvas.rotate(90);
        //        canvas.translate(-this.mPaddingTop, -(Math.max(this.getScrollRange(), scrollX) + width));
        //        this.mEdgeGlowRight.setSize(height, width);
        //        if (this.mEdgeGlowRight.draw(canvas)) {
        //            this.postInvalidateOnAnimation();
        //        }
        //        canvas.restoreToCount(restoreCount);
        //    }
        //}
    }

    private static clamp(n:number, my:number, child:number):number  {
        if (my >= child || n < 0) {
            return 0;
        }
        if ((my + n) > child) {
            return child - my;
        }
        return n;
    }

    //protected onRestoreInstanceState(state:Parcelable):void  {
    //    if (this.mContext.getApplicationInfo().targetSdkVersion <= Build.VERSION_CODES.JELLY_BEAN_MR2) {
    //        // Some old apps reused IDs in ways they shouldn't have.
    //        // Don't break them, but they don't get scroll state restoration.
    //        super.onRestoreInstanceState(state);
    //        return;
    //    }
    //    let ss:HorizontalScrollView.SavedState = <HorizontalScrollView.SavedState> state;
    //    super.onRestoreInstanceState(ss.getSuperState());
    //    this.mSavedState = ss;
    //    this.requestLayout();
    //}
    //
    //protected onSaveInstanceState():Parcelable  {
    //    if (this.mContext.getApplicationInfo().targetSdkVersion <= Build.VERSION_CODES.JELLY_BEAN_MR2) {
    //        // Don't break them, but they don't get scroll state restoration.
    //        return super.onSaveInstanceState();
    //    }
    //    let superState:Parcelable = super.onSaveInstanceState();
    //    let ss:HorizontalScrollView.SavedState = new HorizontalScrollView.SavedState(superState);
    //    ss.scrollPosition = this.mScrollX;
    //    ss.isLayoutRtl = this.isLayoutRtl();
    //    return ss;
    //}


}

//export module HorizontalScrollView{
//export class SavedState extends View.BaseSavedState {
//
//    scrollPosition:number = 0;
//
//    isLayoutRtl:boolean;
//
//    constructor( superState:Parcelable) {
//        super(superState);
//    }
//
//    constructor( source:Parcel) {
//        super(source);
//        this.scrollPosition = source.readInt();
//        this.isLayoutRtl = (source.readInt() == 0) ? true : false;
//    }
//
//    writeToParcel(dest:Parcel, flags:number):void  {
//        super.writeToParcel(dest, flags);
//        dest.writeInt(this.scrollPosition);
//        dest.writeInt(this.isLayoutRtl ? 1 : 0);
//    }
//
//    toString():string  {
//        return "HorizontalScrollView.SavedState{" + Integer.toHexString(System.identityHashCode(this)) + " scrollPosition=" + this.scrollPosition + " isLayoutRtl=" + this.isLayoutRtl + "}";
//    }
//
//    static CREATOR:Parcelable.Creator<SavedState> = (()=>{
//        const _this=this;
//        class _Inner extends Parcelable.Creator<SavedState> {
//
//            createFromParcel(_in:Parcel):SavedState  {
//                return new SavedState(_in);
//            }
//
//            newArray(size:number):SavedState[]  {
//                return new Array<SavedState>(size);
//            }
//        }
//        return new _Inner();
//    })();
//}
//}

}
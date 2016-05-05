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

///<reference path="../view/View.ts"/>
///<reference path="../view/ViewGroup.ts"/>
///<reference path="../view/MotionEvent.ts"/>
///<reference path="FrameLayout.ts"/>
///<reference path="OverScroller.ts"/>
///<reference path="../view/VelocityTracker.ts"/>
///<reference path="../view/ViewConfiguration.ts"/>
///<reference path="../view/FocusFinder.ts"/>
///<reference path="../util/Log.ts"/>
///<reference path="../../java/util/List.ts"/>
///<reference path="../os/SystemClock.ts"/>
///<reference path="../graphics/Rect.ts"/>


/**
 * Layout container for a view hierarchy that can be scrolled by the user,
 * allowing it to be larger than the physical display.  A ScrollView
 * is a {@link FrameLayout}, meaning you should place one child in it
 * containing the entire contents to scroll; this child may itself be a layout
 * manager with a complex hierarchy of objects.  A child that is often used
 * is a {@link LinearLayout} in a vertical orientation, presenting a vertical
 * array of top-level items that the user can scroll through.
 * <p>You should never use a ScrollView with a {@link ListView}, because
 * ListView takes care of its own vertical scrolling.  Most importantly, doing this
 * defeats all of the important optimizations in ListView for dealing with
 * large lists, since it effectively forces the ListView to display its entire
 * list of items to fill up the infinite container supplied by ScrollView.
 * <p>The {@link TextView} class also
 * takes care of its own scrolling, so does not require a ScrollView, but
 * using the two together is possible to achieve the effect of a text view
 * within a larger container.
 *
 * <p>ScrollView only supports vertical scrolling. For horizontal scrolling,
 * use {@link HorizontalScrollView}.
 *
 * @attr ref android.R.styleable#ScrollView_fillViewport
 */
module android.widget {
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import MeasureSpec = View.MeasureSpec;
    import MotionEvent = android.view.MotionEvent;
    import VelocityTracker = android.view.VelocityTracker;
    import ViewConfiguration = android.view.ViewConfiguration;
    import Rect = android.graphics.Rect;
    import OverScroller = android.widget.OverScroller;
    import Log = android.util.Log;
    import List = java.util.List;
    import SystemClock = android.os.SystemClock;
    import KeyEvent = android.view.KeyEvent;
    import FocusFinder = android.view.FocusFinder;

    export class ScrollView extends FrameLayout {
        static ANIMATED_SCROLL_GAP = 250;
        static MAX_SCROLL_FACTOR = 0.5;
        private static TAG = "ScrollView";

        private static INVALID_POINTER = -1;

        private mLastScroll = 0;
        private mTempRect = new Rect();
        private mScroller:OverScroller;
        /**
         * Position of the last motion event.
         */
        private mLastMotionY = 0;
        /**
         * True when the layout has changed but the traversal has not come through yet.
         * Ideally the view hierarchy would keep track of this for us.
         */
        private mIsLayoutDirty = true;
        /**
         * The child to give focus to in the event that a child has requested focus while the
         * layout is dirty. This prevents the scroll from being wrong if the child has not been
         * laid out before requesting focus.
         */
        private mChildToScrollTo:View;
        /**
         * True if the user is currently dragging this ScrollView around. This is
         * not the same as 'is being flinged', which can be checked by
         * mScroller.isFinished() (flinging begins when the user lifts his finger).
         */
        private mIsBeingDragged = false;
        /**
         * Determines speed during touch scrolling
         */
        private mVelocityTracker:VelocityTracker;
        /**
         * When set to true, the scroll view measure its child to make it fill the currently
         * visible area.
         */
        private mFillViewport = false;
        /**
         * Whether arrow scrolling is animated.
         */
        private mSmoothScrollingEnabled = true;

        //private  mTouchSlop = 0;
        private  mMinimumVelocity = 0;
        private  mMaximumVelocity = 0;
        private  mOverscrollDistance = 0;
        private _mOverflingDistance:number = 0;
        private get mOverflingDistance():number {
                let height = this.getHeight() - this.mPaddingBottom - this.mPaddingTop;
                let bottom = this.getChildAt(0).getHeight();
                let minOverY = this.mScrollY < 0 ? -this.mScrollY : this.mScrollY - (bottom - height);
                return Math.max(this._mOverflingDistance, minOverY+this._mOverflingDistance);
        }
        private set mOverflingDistance(value:number) {
            this._mOverflingDistance = value;
        }

        //private getOverflingDistance():number{
        //    let height = this.getHeight() - this.mPaddingBottom - this.mPaddingTop;
        //    let bottom = this.getChildAt(0).getHeight();
        //    let minOverY = this.mScrollY < 0 ? -this.mScrollY : this.mScrollY - (bottom - height);
        //    return Math.max(this.mOverflingDistance, minOverY);
        //}

        /**
         * ID of the active pointer. This is used to retain consistency during
         * drags/flings if multiple pointers are used.
         */
        private mActivePointerId = ScrollView.INVALID_POINTER;

        constructor(context?:android.content.Context, bindElement?:HTMLElement, defStyle?){
            super(context, bindElement, defStyle);
            this.initScrollView();
            this._attrBinder.addAttr('fillViewport', (value)=>{
                this.setFillViewport(this._attrBinder.parseBoolean(value));
            });
        }

        shouldDelayChildPressedState():boolean {
            return true;
        }

        /**
         * @return The maximum amount this scroll view will scroll in response to
         *   an arrow event.
         */
        getMaxScrollAmount():number {
            return (ScrollView.MAX_SCROLL_FACTOR * (this.mBottom - this.mTop));
        }

        private initScrollView() {
            this.mScroller = new OverScroller();
            this.setFocusable(true);
            this.setDescendantFocusability(ViewGroup.FOCUS_AFTER_DESCENDANTS);
            this.setWillNotDraw(false);
            const configuration = ViewConfiguration.get();
            this.mTouchSlop = configuration.getScaledTouchSlop();
            this.mMinimumVelocity = configuration.getScaledMinimumFlingVelocity();
            this.mMaximumVelocity = configuration.getScaledMaximumFlingVelocity();
            this.mOverscrollDistance = configuration.getScaledOverscrollDistance();
            this.mOverflingDistance = configuration.getScaledOverflingDistance();

            this.initScrollCache();
            this.setVerticalScrollBarEnabled(true);
            //this.setVerticalFadingEdgeEnabled(true);
        }

        addView(...args) {
            if (this.getChildCount() > 0) {
                throw new Error("ScrollView can host only one direct child");
            }
            return super.addView(...args);
        }

        /**
         * @return Returns true this ScrollView can be scrolled
         */
        private canScroll():boolean {
            let child = this.getChildAt(0);
            if (child != null) {
                let childHeight = child.getHeight();
                return this.getHeight() < childHeight + this.mPaddingTop + this.mPaddingBottom;
            }
            return false;
        }

        /**
         * Indicates whether this ScrollView's content is stretched to fill the viewport.
         *
         * @return True if the content fills the viewport, false otherwise.
         *
         * @attr ref android.R.styleable#ScrollView_fillViewport
         */
        isFillViewport():boolean {
            return this.mFillViewport;
        }

        /**
         * Indicates this ScrollView whether it should stretch its content height to fill
         * the viewport or not.
         *
         * @param fillViewport True to stretch the content's height to the viewport's
         *        boundaries, false otherwise.
         *
         * @attr ref android.R.styleable#ScrollView_fillViewport
         */
        setFillViewport(fillViewport:boolean) {
            if (fillViewport != this.mFillViewport) {
                this.mFillViewport = fillViewport;
                this.requestLayout();
            }
        }

        /**
         * @return Whether arrow scrolling will animate its transition.
         */
        isSmoothScrollingEnabled():boolean {
            return this.mSmoothScrollingEnabled;
        }

        /**
         * Set whether arrow scrolling will animate its transition.
         * @param smoothScrollingEnabled whether arrow scrolling will animate its transition
         */
        setSmoothScrollingEnabled(smoothScrollingEnabled:boolean) {
            this.mSmoothScrollingEnabled = smoothScrollingEnabled;
        }

        protected onMeasure(widthMeasureSpec:number, heightMeasureSpec:number) {
            super.onMeasure(widthMeasureSpec, heightMeasureSpec);

            if (!this.mFillViewport) {
                return;
            }

            const heightMode = MeasureSpec.getMode(heightMeasureSpec);
            if (heightMode == MeasureSpec.UNSPECIFIED) {
                return;
            }

            if (this.getChildCount() > 0) {
                const child = this.getChildAt(0);
                let height = this.getMeasuredHeight();
                if (child.getMeasuredHeight() < height) {
                    const lp = child.getLayoutParams();

                    let childWidthMeasureSpec = FrameLayout.getChildMeasureSpec(widthMeasureSpec,
                        this.mPaddingLeft + this.mPaddingRight, lp.width);
                    height -= this.mPaddingTop;
                    height -= this.mPaddingBottom;
                    let childHeightMeasureSpec =
                        MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY);

                    child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
                }
            }
        }


        dispatchKeyEvent(event:KeyEvent):boolean {
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
        executeKeyEvent(event:KeyEvent):boolean {
            this.mTempRect.setEmpty();

            if (!this.canScroll()) {
                if (this.isFocused() && event.getKeyCode() != KeyEvent.KEYCODE_BACK) {
                    let currentFocused = this.findFocus();
                    if (currentFocused == this) currentFocused = null;
                    let nextFocused = FocusFinder.getInstance().findNextFocus(this,
                        currentFocused, View.FOCUS_DOWN);
                    return nextFocused != null
                        && nextFocused != this
                        && nextFocused.requestFocus(View.FOCUS_DOWN);
                }
                return false;
            }

            let handled = false;
            if (event.getAction() == KeyEvent.ACTION_DOWN) {
                switch (event.getKeyCode()) {
                    case KeyEvent.KEYCODE_DPAD_UP:
                        if (!event.isAltPressed()) {
                            handled = this.arrowScroll(View.FOCUS_UP);
                        } else {
                            handled = this.fullScroll(View.FOCUS_UP);
                        }
                        break;
                    case KeyEvent.KEYCODE_DPAD_DOWN:
                        if (!event.isAltPressed()) {
                            handled = this.arrowScroll(View.FOCUS_DOWN);
                        } else {
                            handled = this.fullScroll(View.FOCUS_DOWN);
                        }
                        break;
                    case KeyEvent.KEYCODE_SPACE:
                        this.pageScroll(event.isShiftPressed() ? View.FOCUS_UP : View.FOCUS_DOWN);
                        break;
                }
            }

            return handled;
        }

        private inChild(x:number, y:number):boolean {
            if (this.getChildCount() > 0) {
                const scrollY = this.mScrollY;
                const child = this.getChildAt(0);
                return !(y < child.getTop() - scrollY
                || y >= child.getBottom() - scrollY
                || x < child.getLeft()
                || x >= child.getRight());
            }
            return false;
        }

        private initOrResetVelocityTracker():void {
            if (this.mVelocityTracker == null) {
                this.mVelocityTracker = VelocityTracker.obtain();
            } else {
                this.mVelocityTracker.clear();
            }
        }

        private initVelocityTrackerIfNotExists():void {
            if (this.mVelocityTracker == null) {
                this.mVelocityTracker = VelocityTracker.obtain();
            }
        }

        private recycleVelocityTracker():void {
            if (this.mVelocityTracker != null) {
                this.mVelocityTracker.recycle();
                this.mVelocityTracker = null;
            }
        }

        requestDisallowInterceptTouchEvent(disallowIntercept:boolean):void {
            if (disallowIntercept) {
                this.recycleVelocityTracker();
            }
            super.requestDisallowInterceptTouchEvent(disallowIntercept);
        }

        onInterceptTouchEvent(ev:MotionEvent):boolean {
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
            const action = ev.getAction();
            if ((action == MotionEvent.ACTION_MOVE) && (this.mIsBeingDragged)) {
                return true;
            }

            /*
             * Don't try to intercept touch if we can't scroll anyway.
             */
            if (this.getScrollY() == 0 && !this.canScrollVertically(1)) {
                return false;
            }

            switch (action & MotionEvent.ACTION_MASK) {
                case MotionEvent.ACTION_MOVE:
                {
                    /*
                     * mIsBeingDragged == false, otherwise the shortcut would have caught it. Check
                     * whether the user has moved far enough from his original down touch.
                     */

                    /*
                     * Locally do absolute value. mLastMotionY is set to the y value
                     * of the down event.
                     */
                    const activePointerId = this.mActivePointerId;
                    if (activePointerId == ScrollView.INVALID_POINTER) {
                        // If we don't have a valid id, the touch down wasn't on content.
                        break;
                    }

                    const pointerIndex = ev.findPointerIndex(activePointerId);
                    if (pointerIndex == -1) {
                        Log.e(ScrollView.TAG, "Invalid pointerId=" + activePointerId
                            + " in onInterceptTouchEvent");
                        break;
                    }

                    const y = ev.getY(pointerIndex);
                    const yDiff = Math.abs(y - this.mLastMotionY);
                    if (yDiff > this.mTouchSlop) {
                        this.mIsBeingDragged = true;
                        this.mLastMotionY = y;
                        this.initVelocityTrackerIfNotExists();
                        this.mVelocityTracker.addMovement(ev);
                        const parent = this.getParent();
                        if (parent != null) {
                            parent.requestDisallowInterceptTouchEvent(true);
                        }
                    }
                    break;
                }

                case MotionEvent.ACTION_DOWN:
                {
                    const y = ev.getY();
                    if (!this.inChild(ev.getX(), y)) {
                        this.mIsBeingDragged = false;
                        this.recycleVelocityTracker();
                        break;
                    }

                    /*
                     * Remember location of down touch.
                     * ACTION_DOWN always refers to pointer index 0.
                     */
                    this.mLastMotionY = y;
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
                    this.mActivePointerId = ScrollView.INVALID_POINTER;
                    this.recycleVelocityTracker();
                    if (this.mScroller.springBack(this.mScrollX, this.mScrollY, 0, 0, 0, this.getScrollRange())) {
                        this.postInvalidateOnAnimation();
                    }
                    break;
                case MotionEvent.ACTION_POINTER_UP:
                    this.onSecondaryPointerUp(ev);
                    break;
            }

            /*
             * The only time we want to intercept motion events is if we are in the
             * drag mode.
             */
            return this.mIsBeingDragged;
        }

        onTouchEvent(ev:MotionEvent):boolean {
            this.initVelocityTrackerIfNotExists();
            this.mVelocityTracker.addMovement(ev);

            const action = ev.getAction();

            switch (action & MotionEvent.ACTION_MASK) {
                case MotionEvent.ACTION_DOWN:
                {
                    if (this.getChildCount() == 0) {
                        return false;
                    }
                    if ((this.mIsBeingDragged = !this.mScroller.isFinished())) {
                        const parent = this.getParent();
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
                    this.mLastMotionY = ev.getY();
                    this.mActivePointerId = ev.getPointerId(0);
                    break;
                }
                case MotionEvent.ACTION_MOVE:
                    const activePointerIndex = ev.findPointerIndex(this.mActivePointerId);
                    if (activePointerIndex == -1) {
                        Log.e(ScrollView.TAG, "Invalid pointerId=" + this.mActivePointerId + " in onTouchEvent");
                        break;
                    }

                    const y = ev.getY(activePointerIndex);
                    let deltaY = this.mLastMotionY - y;
                    if (!this.mIsBeingDragged && Math.abs(deltaY) > this.mTouchSlop) {
                        const parent = this.getParent();
                        if (parent != null) {
                            parent.requestDisallowInterceptTouchEvent(true);
                        }
                        this.mIsBeingDragged = true;
                        if (deltaY > 0) {
                            deltaY -= this.mTouchSlop;
                        } else {
                            deltaY += this.mTouchSlop;
                        }
                    }
                    if (this.mIsBeingDragged) {
                        // Scroll to follow the motion event
                        this.mLastMotionY = y;

                        const oldX = this.mScrollX;
                        const oldY = this.mScrollY;
                        const range = this.getScrollRange();
                        const overscrollMode = this.getOverScrollMode();
                        const canOverscroll = overscrollMode == ScrollView.OVER_SCROLL_ALWAYS ||
                            (overscrollMode == ScrollView.OVER_SCROLL_IF_CONTENT_SCROLLS && range > 0);

                        // Calling overScrollBy will call onOverScrolled, which
                        // calls onScrollChanged if applicable.
                        if (this.overScrollBy(0, deltaY, 0, this.mScrollY,
                                0, range, 0, this.mOverscrollDistance, true)) {
                            // Break our velocity if we hit a scroll barrier.
                            this.mVelocityTracker.clear();
                        }

                        if (canOverscroll) {
                            const pulledToY = oldY + deltaY;
                            if (pulledToY < 0) {
//                            mEdgeGlowTop.onPull((float) deltaY / getHeight());
//                            if (!mEdgeGlowBottom.isFinished()) {
//                                mEdgeGlowBottom.onRelease();
//                            }
                            } else if (pulledToY > range) {
//                            mEdgeGlowBottom.onPull((float) deltaY / getHeight());
//                            if (!mEdgeGlowTop.isFinished()) {
//                                mEdgeGlowTop.onRelease();
//                            }
                            }
                        }
                    }
                    break;
                case MotionEvent.ACTION_UP:
                    if (this.mIsBeingDragged) {
                        let velocityTracker = this.mVelocityTracker;
                        velocityTracker.computeCurrentVelocity(1000, this.mMaximumVelocity);
                        let initialVelocity = velocityTracker.getYVelocity(this.mActivePointerId);

                        if (this.getChildCount() > 0) {
                            let forceSpringBack = (this.mScrollY<-this._mOverflingDistance && initialVelocity>0)
                                || (this.mScrollY > (this.getScrollRange() + this._mOverflingDistance) && initialVelocity<0);
                            if (!forceSpringBack && (Math.abs(initialVelocity) > this.mMinimumVelocity)) {
                                this.fling(-initialVelocity);
                            } else {
                                if (this.mScroller.springBack(this.mScrollX, this.mScrollY, 0, 0, 0,
                                        this.getScrollRange())) {
                                    this.postInvalidateOnAnimation();
                                }
                            }
                        }

                        this.mActivePointerId = ScrollView.INVALID_POINTER;
                        this.endDrag();
                    }
                    break;
                case MotionEvent.ACTION_CANCEL:
                    if (this.mIsBeingDragged && this.getChildCount() > 0) {
                        if (this.mScroller.springBack(this.mScrollX, this.mScrollY, 0, 0, 0, this.getScrollRange())) {
                            this.postInvalidateOnAnimation();
                        }
                        this.mActivePointerId = ScrollView.INVALID_POINTER;
                        this.endDrag();
                    }
                    break;
                case MotionEvent.ACTION_POINTER_DOWN:
                {
                    const index = ev.getActionIndex();
                    this.mLastMotionY = ev.getY(index);
                    this.mActivePointerId = ev.getPointerId(index);
                    break;
                }
                case MotionEvent.ACTION_POINTER_UP:
                    this.onSecondaryPointerUp(ev);
                    this.mLastMotionY = ev.getY(ev.findPointerIndex(this.mActivePointerId));
                    break;
            }
            return true;
        }

        private onSecondaryPointerUp(ev:MotionEvent) {
            const pointerIndex = (ev.getAction() & MotionEvent.ACTION_POINTER_INDEX_MASK) >>
                MotionEvent.ACTION_POINTER_INDEX_SHIFT;
            const pointerId = ev.getPointerId(pointerIndex);
            if (pointerId == this.mActivePointerId) {
                // This was our active pointer going up. Choose a new
                // active pointer and adjust accordingly.
                // TODO: Make this decision more intelligent.
                const newPointerIndex = pointerIndex == 0 ? 1 : 0;
                this.mLastMotionY = ev.getY(newPointerIndex);
                this.mActivePointerId = ev.getPointerId(newPointerIndex);
                if (this.mVelocityTracker != null) {
                    this.mVelocityTracker.clear();
                }
            }
        }

        onGenericMotionEvent(event:MotionEvent):boolean {
            switch (event.getAction()) {
                case MotionEvent.ACTION_SCROLL: {
                    if (!this.mIsBeingDragged) {
                        const vscroll = event.getAxisValue(MotionEvent.AXIS_VSCROLL);
                        if (vscroll != 0) {
                            const delta = Math.floor(vscroll * this.getVerticalScrollFactor());
                            const range = this.getScrollRange();
                            let oldScrollY = this.mScrollY;
                            let newScrollY = oldScrollY - delta;
                            if (newScrollY < 0) {
                                newScrollY = 0;
                            } else if (newScrollY > range) {
                                newScrollY = range;
                            }
                            if (newScrollY != oldScrollY) {
                                super.scrollTo(this.mScrollX, newScrollY);
                                return true;
                            }
                        }
                    }
                }
            }
            return super.onGenericMotionEvent(event);
        }

        protected onOverScrolled(scrollX:number, scrollY:number, clampedX:boolean, clampedY:boolean) {
            // Treat animating scrolls differently; see #computeScroll() for why.
            if (!this.mScroller.isFinished()) {
                const oldX = this.mScrollX;
                const oldY = this.mScrollY;
                this.mScrollX = scrollX;
                this.mScrollY = scrollY;
                //this.invalidateParentCaches();
                this.invalidateParentIfNeeded();
                this.onScrollChanged(this.mScrollX, this.mScrollY, oldX, oldY);
            } else {
                super.scrollTo(scrollX, scrollY);
            }

            //this.awakenScrollBars();
            if (!this.awakenScrollBars()) {
                this.postInvalidateOnAnimation();
            }
        }

        private getScrollRange():number {
            let scrollRange = 0;
            if (this.getChildCount() > 0) {
                let child = this.getChildAt(0);
                scrollRange = Math.max(0, child.getHeight() - (this.getHeight() - this.mPaddingBottom - this.mPaddingTop));
            }
            return scrollRange;
        }

        /**
         * <p>
         * Finds the next focusable component that fits in the specified bounds.
         * </p>
         *
         * @param topFocus look for a candidate is the one at the top of the bounds
         *                 if topFocus is true, or at the bottom of the bounds if topFocus is
         *                 false
         * @param top      the top offset of the bounds in which a focusable must be
         *                 found
         * @param bottom   the bottom offset of the bounds in which a focusable must
         *                 be found
         * @return the next focusable component in the bounds or null if none can
         *         be found
         */
        private findFocusableViewInBounds(topFocus:boolean, top:number, bottom:number):View {
            let focusables:List<View> = this.getFocusables(View.FOCUS_FORWARD);
            let focusCandidate:View = null;
            /*
             * A fully contained focusable is one where its top is below the bound's
             * top, and its bottom is above the bound's bottom. A partially
             * contained focusable is one where some part of it is within the
             * bounds, but it also has some part that is not within bounds.  A fully contained
             * focusable is preferred to a partially contained focusable.
             */
            let foundFullyContainedFocusable:boolean = false;
            let count:number = focusables.size();
            for (let i:number = 0; i < count; i++) {
                let view:View = focusables.get(i);
                let viewTop:number = view.getTop();
                let viewBottom:number = view.getBottom();
                if (top < viewBottom && viewTop < bottom) {
                    /*
                     * the focusable is in the target area, it is a candidate for
                     * focusing
                     */
                    const viewIsFullyContained:boolean = (top < viewTop) && (viewBottom < bottom);
                    if (focusCandidate == null) {
                        /* No candidate, take this one */
                        focusCandidate = view;
                        foundFullyContainedFocusable = viewIsFullyContained;
                    } else {
                        const viewIsCloserToBoundary:boolean = (topFocus && viewTop < focusCandidate.getTop()) || (!topFocus && viewBottom > focusCandidate.getBottom());
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
         * method will scroll the view by one page up or down and give the focus
         * to the topmost/bottommost component in the new visible area. If no
         * component is a good candidate for focus, this scrollview reclaims the
         * focus.</p>
         *
         * @param direction the scroll direction: {@link View#FOCUS_UP}
         *                  to go one page up or
         *                  {@link View#FOCUS_DOWN} to go one page down
         * @return true if the key event is consumed by this method, false otherwise
         */
        pageScroll(direction:number):boolean {
            let down = direction == View.FOCUS_DOWN;
            let height = this.getHeight();

            if (down) {
                this.mTempRect.top = this.getScrollY() + height;
                let count = this.getChildCount();
                if (count > 0) {
                    let view = this.getChildAt(count - 1);
                    if (this.mTempRect.top + height > view.getBottom()) {
                        this.mTempRect.top = view.getBottom() - height;
                    }
                }
            } else {
                this.mTempRect.top = this.getScrollY() - height;
                if (this.mTempRect.top < 0) {
                    this.mTempRect.top = 0;
                }
            }
            this.mTempRect.bottom = this.mTempRect.top + height;

            return this.scrollAndFocus(direction, this.mTempRect.top, this.mTempRect.bottom);
        }

        /**
         * <p>Handles scrolling in response to a "home/end" shortcut press. This
         * method will scroll the view to the top or bottom and give the focus
         * to the topmost/bottommost component in the new visible area. If no
         * component is a good candidate for focus, this scrollview reclaims the
         * focus.</p>
         *
         * @param direction the scroll direction: {@link android.view.View#FOCUS_UP}
         *                  to go the top of the view or
         *                  {@link android.view.View#FOCUS_DOWN} to go the bottom
         * @return true if the key event is consumed by this method, false otherwise
         */
        fullScroll(direction:number):boolean {
            let down = direction == View.FOCUS_DOWN;
            let height = this.getHeight();

            this.mTempRect.top = 0;
            this.mTempRect.bottom = height;

            if (down) {
                let count = this.getChildCount();
                if (count > 0) {
                    let view = this.getChildAt(count - 1);
                    this.mTempRect.bottom = view.getBottom() + this.mPaddingBottom;
                    this.mTempRect.top = this.mTempRect.bottom - height;
                }
            }

            return this.scrollAndFocus(direction, this.mTempRect.top, this.mTempRect.bottom);
        }

        /**
         * <p>Scrolls the view to make the area defined by <code>top</code> and
         * <code>bottom</code> visible. This method attempts to give the focus
         * to a component visible in this area. If no component can be focused in
         * the new visible area, the focus is reclaimed by this ScrollView.</p>
         *
         * @param direction the scroll direction: {@link android.view.View#FOCUS_UP}
         *                  to go upward, {@link android.view.View#FOCUS_DOWN} to downward
         * @param top       the top offset of the new area to be made visible
         * @param bottom    the bottom offset of the new area to be made visible
         * @return true if the key event is consumed by this method, false otherwise
         */
        private scrollAndFocus(direction:number, top:number, bottom:number):boolean {
            let handled = true;

            let height = this.getHeight();
            let containerTop = this.getScrollY();
            let containerBottom = containerTop + height;
            let up = direction == View.FOCUS_UP;

            let newFocused = this.findFocusableViewInBounds(up, top, bottom);
            if (newFocused == null) {
                newFocused = this;
            }

            if (top >= containerTop && bottom <= containerBottom) {
                handled = false;
            } else {
                let delta = up ? (top - containerTop) : (bottom - containerBottom);
                this.doScrollY(delta);
            }

            if (newFocused != this.findFocus()) newFocused.requestFocus(direction);

            return handled;
        }

        /**
         * Handle scrolling in response to an up or down arrow click.
         *
         * @param direction The direction corresponding to the arrow key that was
         *                  pressed
         * @return True if we consumed the event, false otherwise
         */
        arrowScroll(direction:number):boolean {
            let currentFocused = this.findFocus();
            if (currentFocused == this) currentFocused = null;

            let nextFocused = FocusFinder.getInstance().findNextFocus(this, currentFocused, direction);

            const maxJump = this.getMaxScrollAmount();

            if (nextFocused != null && this.isWithinDeltaOfScreen(nextFocused, maxJump, this.getHeight())) {
                nextFocused.getDrawingRect(this.mTempRect);
                this.offsetDescendantRectToMyCoords(nextFocused, this.mTempRect);
                let scrollDelta = this.computeScrollDeltaToGetChildRectOnScreen(this.mTempRect);
                this.doScrollY(scrollDelta);
                nextFocused.requestFocus(direction);
            } else {
                // no new focus
                let scrollDelta = maxJump;

                if (direction == View.FOCUS_UP && this.getScrollY() < scrollDelta) {
                    scrollDelta = this.getScrollY();
                } else if (direction == View.FOCUS_DOWN) {
                    if (this.getChildCount() > 0) {
                        let daBottom = this.getChildAt(0).getBottom();
                        let screenBottom = this.getScrollY() + this.getHeight() - this.mPaddingBottom;
                        if (daBottom - screenBottom < maxJump) {
                            scrollDelta = daBottom - screenBottom;
                        }
                    }
                }
                if (scrollDelta == 0) {
                    return false;
                }
                this.doScrollY(direction == View.FOCUS_DOWN ? scrollDelta : -scrollDelta);
            }

            if (currentFocused != null && currentFocused.isFocused() && this.isOffScreen(currentFocused)) {
                // previously focused item still has focus and is off screen, give
                // it up (take it back to ourselves)
                // (also, need to temporarily force FOCUS_BEFORE_DESCENDANTS so we are
                // sure to
                // get it)
                const descendantFocusability = this.getDescendantFocusability();  // save
                this.setDescendantFocusability(ViewGroup.FOCUS_BEFORE_DESCENDANTS);
                this.requestFocus();
                this.setDescendantFocusability(descendantFocusability);  // restore
            }
            return true;
        }
        /**
         * @return whether the descendant of this scroll view is scrolled off
         *  screen.
         */
        private isOffScreen(descendant:View):boolean {
            return !this.isWithinDeltaOfScreen(descendant, 0, this.getHeight());
        }
        /**
         * @return whether the descendant of this scroll view is within delta
         *  pixels of being on the screen.
         */
        private isWithinDeltaOfScreen(descendant:View, delta:number, height:number):boolean {
            descendant.getDrawingRect(this.mTempRect);
            this.offsetDescendantRectToMyCoords(descendant, this.mTempRect);

            return (this.mTempRect.bottom + delta) >= this.getScrollY()
                && (this.mTempRect.top - delta) <= (this.getScrollY() + height);
        }
        /**
         * Smooth scroll by a Y delta
         *
         * @param delta the number of pixels to scroll by on the Y axis
         */
        private doScrollY(delta:number){
            if (delta != 0) {
                if (this.mSmoothScrollingEnabled) {
                    this.smoothScrollBy(0, delta);
                } else {
                    this.scrollBy(0, delta);
                }
            }
        }
        /**
         * Like {@link View#scrollBy}, but scroll smoothly instead of immediately.
         *
         * @param dx the number of pixels to scroll by on the X axis
         * @param dy the number of pixels to scroll by on the Y axis
         */
        smoothScrollBy(dx:number, dy:number){
            if (this.getChildCount() == 0) {
                // Nothing to do.
                return;
            }
            let duration = SystemClock.uptimeMillis() - this.mLastScroll;
            if (duration > ScrollView.ANIMATED_SCROLL_GAP) {
                const height = this.getHeight() - this.mPaddingBottom - this.mPaddingTop;
                const bottom = this.getChildAt(0).getHeight();
                const maxY = Math.max(0, bottom - height);
                const scrollY = this.mScrollY;
                dy = Math.max(0, Math.min(scrollY + dy, maxY)) - scrollY;

                this.mScroller.startScroll(this.mScrollX, scrollY, 0, dy);
                this.postInvalidateOnAnimation();
            } else {
                if (!this.mScroller.isFinished()) {
                    this.mScroller.abortAnimation();
                }
                this.scrollBy(dx, dy);
            }
            this.mLastScroll = SystemClock.uptimeMillis();
        }
        /**
         * Like {@link #scrollTo}, but scroll smoothly instead of immediately.
         *
         * @param x the position where to scroll on the X axis
         * @param y the position where to scroll on the Y axis
         */
        smoothScrollTo(x:number, y:number) {
            this.smoothScrollBy(x - this.mScrollX, y - this.mScrollY);
        }
        /**
         * <p>The scroll range of a scroll view is the overall height of all of its
         * children.</p>
         */
        protected computeVerticalScrollRange() {
            const count = this.getChildCount();
            const contentHeight = this.getHeight() - this.mPaddingBottom - this.mPaddingTop;
            if (count == 0) {
                return contentHeight;
            }

            let scrollRange = this.getChildAt(0).getBottom();
            const scrollY = this.mScrollY;
            const overscrollBottom = Math.max(0, scrollRange - contentHeight);
            if (scrollY < 0) {
                scrollRange -= scrollY;
            } else if (scrollY > overscrollBottom) {
                scrollRange += scrollY - overscrollBottom;
            }

            return scrollRange;
        }
        protected computeVerticalScrollOffset() {
            return Math.max(0, super.computeVerticalScrollOffset());
        }
        protected measureChild(child:View, parentWidthMeasureSpec:number, parentHeightMeasureSpec:number) {
            let lp = child.getLayoutParams();
            lp._measuringParentWidthMeasureSpec = parentWidthMeasureSpec;
            lp._measuringParentHeightMeasureSpec = parentHeightMeasureSpec;

            let childWidthMeasureSpec;
            let childHeightMeasureSpec;

            childWidthMeasureSpec = ViewGroup.getChildMeasureSpec(parentWidthMeasureSpec, this.mPaddingLeft
                + this.mPaddingRight, lp.width);

            childHeightMeasureSpec = MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED);

            child.measure(childWidthMeasureSpec, childHeightMeasureSpec);

            lp._measuringParentWidthMeasureSpec = null;
            lp._measuringParentHeightMeasureSpec = null;
        }

        protected measureChildWithMargins(child:View, parentWidthMeasureSpec:number, widthUsed:number,
                                parentHeightMeasureSpec:number, heightUsed:number) {
            const lp = <ViewGroup.MarginLayoutParams>child.getLayoutParams();
            lp._measuringParentWidthMeasureSpec = parentWidthMeasureSpec;
            lp._measuringParentHeightMeasureSpec = parentHeightMeasureSpec;

            const childWidthMeasureSpec = ScrollView.getChildMeasureSpec(parentWidthMeasureSpec,
                this.mPaddingLeft + this.mPaddingRight + lp.leftMargin + lp.rightMargin
                + widthUsed, lp.width);
            const childHeightMeasureSpec = MeasureSpec.makeMeasureSpec(
                lp.topMargin + lp.bottomMargin, MeasureSpec.UNSPECIFIED);

            child.measure(childWidthMeasureSpec, childHeightMeasureSpec);

            lp._measuringParentWidthMeasureSpec = null;
            lp._measuringParentHeightMeasureSpec = null;
        }
        computeScroll() {
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
                let oldX = this.mScrollX;
                let oldY = this.mScrollY;
                let x = this.mScroller.getCurrX();
                let y = this.mScroller.getCurrY();

                if (oldX != x || oldY != y) {
                    const range = this.getScrollRange();
                    const overscrollMode = this.getOverScrollMode();
                    const canOverscroll = overscrollMode == ScrollView.OVER_SCROLL_ALWAYS ||
                        (overscrollMode == ScrollView.OVER_SCROLL_IF_CONTENT_SCROLLS && range > 0);

                    this.overScrollBy(x - oldX, y - oldY, oldX, oldY, 0, range,
                        0, this.mOverflingDistance, false);
                    this.onScrollChanged(this.mScrollX, this.mScrollY, oldX, oldY);

                    if (canOverscroll) {
                        if (y < 0 && oldY >= 0) {
//                        mEdgeGlowTop.onAbsorb((int) mScroller.getCurrVelocity());
                        } else if (y > range && oldY <= range) {
//                        mEdgeGlowBottom.onAbsorb((int) mScroller.getCurrVelocity());
                        }
                    }
                }

                if (!this.awakenScrollBars()) {
                    // Keep on drawing until the animation has finished.
                    this.postInvalidateOnAnimation();
                }
            } else {
            }
        }

        /**
         * Scrolls the view to the given child.
         *
         * @param child the View to scroll to
         */
        private scrollToChild(child:View) {
            child.getDrawingRect(this.mTempRect);

            /* Offset from child's local coordinates to ScrollView coordinates */
            this.offsetDescendantRectToMyCoords(child, this.mTempRect);

            let scrollDelta = this.computeScrollDeltaToGetChildRectOnScreen(this.mTempRect);

            if (scrollDelta != 0) {
                this.scrollBy(0, scrollDelta);
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
        private scrollToChildRect(rect:Rect, immediate:boolean) {
            const delta = this.computeScrollDeltaToGetChildRectOnScreen(rect);
            const scroll = delta != 0;
            if (scroll) {
                if (immediate) {
                    this.scrollBy(0, delta);
                } else {
                    this.smoothScrollBy(0, delta);
                }
            }
            return scroll;
        }
        /**
         * Compute the amount to scroll in the Y direction in order to get
         * a rectangle completely on the screen (or, if taller than the screen,
         * at least the first screen size chunk of it).
         *
         * @param rect The rect.
         * @return The scroll delta.
         */
        computeScrollDeltaToGetChildRectOnScreen(rect:Rect):number{
            if (this.getChildCount() == 0) return 0;

            let height = this.getHeight();
            let screenTop = this.getScrollY();
            let screenBottom = screenTop + height;

            let fadingEdge = this.getVerticalFadingEdgeLength();

            // leave room for top fading edge as long as rect isn't at very top
            if (rect.top > 0) {
                screenTop += fadingEdge;
            }

            // leave room for bottom fading edge as long as rect isn't at very bottom
            if (rect.bottom < this.getChildAt(0).getHeight()) {
                screenBottom -= fadingEdge;
            }

            let scrollYDelta = 0;

            if (rect.bottom > screenBottom && rect.top > screenTop) {
                // need to move down to get it in view: move down just enough so
                // that the entire rectangle is in view (or at least the first
                // screen size chunk).

                if (rect.height() > height) {
                    // just enough to get screen size chunk on
                    scrollYDelta += (rect.top - screenTop);
                } else {
                    // get entire rect at bottom of screen
                    scrollYDelta += (rect.bottom - screenBottom);
                }

                // make sure we aren't scrolling beyond the end of our content
                let bottom = this.getChildAt(0).getBottom();
                let distanceToBottom = bottom - screenBottom;
                scrollYDelta = Math.min(scrollYDelta, distanceToBottom);

            } else if (rect.top < screenTop && rect.bottom < screenBottom) {
                // need to move up to get it in view: move up just enough so that
                // entire rectangle is in view (or at least the first screen
                // size chunk of it).

                if (rect.height() > height) {
                    // screen size chunk
                    scrollYDelta -= (screenBottom - rect.bottom);
                } else {
                    // entire rect at top
                    scrollYDelta -= (screenTop - rect.top);
                }

                // make sure we aren't scrolling any further than the top our content
                scrollYDelta = Math.max(scrollYDelta, -this.getScrollY());
            }
            return scrollYDelta;
        }

        requestChildFocus(child:View, focused:View){
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
        protected onRequestFocusInDescendants(direction:number, previouslyFocusedRect:Rect):boolean {
            // (ugh).
            if (direction == View.FOCUS_FORWARD) {
                direction = View.FOCUS_DOWN;
            } else if (direction == View.FOCUS_BACKWARD) {
                direction = View.FOCUS_UP;
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

        requestChildRectangleOnScreen(child:View, rectangle:Rect, immediate:boolean):boolean {
            // offset into coordinate space of this scroll view
            rectangle.offset(child.getLeft() - child.getScrollX(),
                child.getTop() - child.getScrollY());

            return this.scrollToChildRect(rectangle, immediate);
        }

        requestLayout() {
            this.mIsLayoutDirty = true;
            super.requestLayout();
        }


        protected onLayout(changed:boolean, l:number, t:number, r:number, b:number):void {
            super.onLayout(changed, l, t, r, b);
            this.mIsLayoutDirty = false;
            // Give a child focus if it needs it
            if (this.mChildToScrollTo != null && ScrollView.isViewDescendantOf(this.mChildToScrollTo, this)) {
                this.scrollToChild(this.mChildToScrollTo);
            }
            this.mChildToScrollTo = null;

            if (!this.isLaidOut()) {
                // mScrollY default value is "0"

                const childHeight = (this.getChildCount() > 0) ? this.getChildAt(0).getMeasuredHeight() : 0;
                const scrollRange = Math.max(0,
                    childHeight - (b - t - this.mPaddingBottom - this.mPaddingTop));

                // Don't forget to clamp
                if (this.mScrollY > scrollRange) {
                    this.mScrollY = scrollRange;
                } else if (this.mScrollY < 0) {
                    this.mScrollY = 0;
                }
            }

            // Calling this with the present values causes it to re-claim them
            this.scrollTo(this.mScrollX, this.mScrollY);
        }


        protected onSizeChanged(w:number, h:number, oldw:number, oldh:number):void {
            super.onSizeChanged(w, h, oldw, oldh);
            let currentFocused = this.findFocus();
            if (null == currentFocused || this == currentFocused) return;

            // If the currently-focused view was visible on the screen when the
            // screen was at the old height, then scroll the screen to make that
            // view visible with the new screen height.
            if (this.isWithinDeltaOfScreen(currentFocused, 0, oldh)) {
                currentFocused.getDrawingRect(this.mTempRect);
                this.offsetDescendantRectToMyCoords(currentFocused, this.mTempRect);
                let scrollDelta = this.computeScrollDeltaToGetChildRectOnScreen(this.mTempRect);
                this.doScrollY(scrollDelta);
            }
        }

        /**
         * Return true if child is a descendant of parent, (or equal to the parent).
         */
        private static isViewDescendantOf(child:View, parent:View):boolean {
            if (child == parent) {
                return true;
            }

            const theParent = child.getParent();
            return (theParent instanceof ViewGroup) && ScrollView.isViewDescendantOf(<any>theParent, parent);
        }
        /**
         * Fling the scroll view
         *
         * @param velocityY The initial velocity in the Y direction. Positive
         *                  numbers mean that the finger/cursor is moving down the screen,
         *                  which means we want to scroll towards the top.
         */
        fling(velocityY:number){
            if (this.getChildCount() > 0) {
                let height = this.getHeight() - this.mPaddingBottom - this.mPaddingTop;
                let bottom = this.getChildAt(0).getHeight();
                this.mScroller.fling(this.mScrollX, this.mScrollY, 0, velocityY, 0, 0, 0,
                    Math.max(0, bottom - height), 0, this.mOverflingDistance);

                this.postInvalidateOnAnimation();
            }
        }
        private endDrag(){
            this.mIsBeingDragged = false;

            this.recycleVelocityTracker();
        }

        /**
         * {@inheritDoc}
         *
         * <p>This version also clamps the scrolling to the bounds of our child.
         */
        scrollTo(x:number, y:number){
            // we rely on the fact the View.scrollBy calls scrollTo.
            if (this.getChildCount() > 0) {
                let child = this.getChildAt(0);
                x = ScrollView.clamp(x, this.getWidth() - this.mPaddingRight - this.mPaddingLeft, child.getWidth());
                y = ScrollView.clamp(y, this.getHeight() - this.mPaddingBottom - this.mPaddingTop, child.getHeight());
                if (x != this.mScrollX || y != this.mScrollY) {
                    super.scrollTo(x, y);
                }
            }
        }
        private static clamp(n:number, my:number, child:number):number{
            if (my >= child || n < 0) {
                /* my >= child is this case:
                 *                    |--------------- me ---------------|
                 *     |------ child ------|
                 * or
                 *     |--------------- me ---------------|
                 *            |------ child ------|
                 * or
                 *     |--------------- me ---------------|
                 *                                  |------ child ------|
                 *
                 * n < 0 is this case:
                 *     |------ me ------|
                 *                    |-------- child --------|
                 *     |-- mScrollX --|
                 */
                return 0;
            }
            if ((my+n) > child) {
                /* this case:
                 *                    |------ me ------|
                 *     |------ child ------|
                 *     |-- mScrollX --|
                 */
                return child-my;
            }
            return n;
        }


        canScrollVertically(direction:number):boolean {
            if(this.getOverScrollMode()===View.OVER_SCROLL_ALWAYS) return true;//can scroll anyway
            return super.canScrollVertically(direction);
        }
    }
}
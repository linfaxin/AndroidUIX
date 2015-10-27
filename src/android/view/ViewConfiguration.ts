/**
 * Created by linfaxin on 15/10/5.
 */
///<reference path="../util/SparseArray.ts"/>
///<reference path="../content/res/Resources.ts"/>

module android.view{
    import SparseArray = android.util.SparseArray;
    import Resources = android.content.res.Resources;

    const metrics = Resources.getDisplayMetrics();
    const density = metrics.density;
    const sizeAndDensity = density;

    export class ViewConfiguration{
        private static SCROLL_BAR_SIZE = 10;
        private static SCROLL_BAR_FADE_DURATION = 250;
        private static SCROLL_BAR_DEFAULT_DELAY = 300;
        private static FADING_EDGE_LENGTH = 12;
        private static PRESSED_STATE_DURATION = 64;
        private static DEFAULT_LONG_PRESS_TIMEOUT = 500;
        private static KEY_REPEAT_DELAY = 50;
        private static GLOBAL_ACTIONS_KEY_TIMEOUT = 500;
        private static TAP_TIMEOUT = 180;
        private static JUMP_TAP_TIMEOUT = 500;
        private static DOUBLE_TAP_TIMEOUT = 300;
        private static DOUBLE_TAP_MIN_TIME = 40;
        private static HOVER_TAP_TIMEOUT = 150;
        private static HOVER_TAP_SLOP = 20;
        private static ZOOM_CONTROLS_TIMEOUT = 3000;
        private static EDGE_SLOP = 12;
        private static TOUCH_SLOP = 8;
        private static DOUBLE_TAP_TOUCH_SLOP = ViewConfiguration.TOUCH_SLOP;
        private static PAGING_TOUCH_SLOP = ViewConfiguration.TOUCH_SLOP * 2;
        private static DOUBLE_TAP_SLOP = 100;
        private static WINDOW_TOUCH_SLOP = 16;
        private static MINIMUM_FLING_VELOCITY = 50;
        private static MAXIMUM_FLING_VELOCITY = 8000;
        private static SCROLL_FRICTION = 0.015;
        private static OVERSCROLL_DISTANCE = 800;//defaul 0
        private static OVERFLING_DISTANCE = 400;//default 6

        static instance : ViewConfiguration;
        static get():ViewConfiguration{
            if(!ViewConfiguration.instance){
                ViewConfiguration.instance = new ViewConfiguration();
            }
            return ViewConfiguration.instance;
        }

        mEdgeSlop:number = sizeAndDensity * ViewConfiguration.EDGE_SLOP;
        mFadingEdgeLength:number = sizeAndDensity * ViewConfiguration.FADING_EDGE_LENGTH;
        mMinimumFlingVelocity:number = density * ViewConfiguration.MINIMUM_FLING_VELOCITY;
        mMaximumFlingVelocity:number = density * ViewConfiguration.MAXIMUM_FLING_VELOCITY;
        mScrollbarSize:number = density * ViewConfiguration.SCROLL_BAR_SIZE;
        mTouchSlop:number = density * ViewConfiguration.TOUCH_SLOP;
        mDoubleTapTouchSlop:number = sizeAndDensity * ViewConfiguration.DOUBLE_TAP_TOUCH_SLOP;
        mPagingTouchSlop:number = density * ViewConfiguration.PAGING_TOUCH_SLOP;
        mDoubleTapSlop:number = density * ViewConfiguration.DOUBLE_TAP_SLOP;
        mWindowTouchSlop:number = sizeAndDensity * ViewConfiguration.WINDOW_TOUCH_SLOP;
        mOverscrollDistance:number = sizeAndDensity * ViewConfiguration.OVERSCROLL_DISTANCE;
        mOverflingDistance:number = sizeAndDensity * ViewConfiguration.OVERFLING_DISTANCE;

        getScaledScrollBarSize():number {
            return this.mScrollbarSize;
        }
        static getScrollBarFadeDuration():number {
            return ViewConfiguration.SCROLL_BAR_FADE_DURATION;
        }
        static getScrollDefaultDelay():number {
            return ViewConfiguration.SCROLL_BAR_DEFAULT_DELAY;
        }
        getScaledFadingEdgeLength():number {
            return this.mFadingEdgeLength;
        }
        static getPressedStateDuration():number {
            return ViewConfiguration.PRESSED_STATE_DURATION;
        }
        static getLongPressTimeout():number {
            return ViewConfiguration.DEFAULT_LONG_PRESS_TIMEOUT;
        }
        static getKeyRepeatDelay():number {
            return ViewConfiguration.KEY_REPEAT_DELAY;
        }
        static getTapTimeout():number {
            return ViewConfiguration.TAP_TIMEOUT;
        }
        static getJumpTapTimeout():number {
            return ViewConfiguration.JUMP_TAP_TIMEOUT;
        }
        static getDoubleTapTimeout():number {
            return ViewConfiguration.DOUBLE_TAP_TIMEOUT;
        }
        static getDoubleTapMinTime():number {
            return ViewConfiguration.DOUBLE_TAP_MIN_TIME;
        }
        getScaledEdgeSlop():number {
            return this.mEdgeSlop;
        }
        getScaledTouchSlop() {
            return this.mTouchSlop;
        }
        getScaledPagingTouchSlop() {
            return this.mPagingTouchSlop;
        }
        getScaledDoubleTapSlop() {
            return this.mDoubleTapSlop;
        }
        getScaledWindowTouchSlop() {
            return this.mWindowTouchSlop;
        }
        getScaledMinimumFlingVelocity() {
            return this.mMinimumFlingVelocity;
        }
        getScaledMaximumFlingVelocity() {
            return this.mMaximumFlingVelocity;
        }
        getScaledOverscrollDistance() {
            return this.mOverscrollDistance;
        }
        getScaledOverflingDistance() {
            return this.mOverflingDistance;
        }
        static getScrollFriction() {
            return ViewConfiguration.SCROLL_FRICTION;
        }
    }
}
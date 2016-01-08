/**
 * Created by linfaxin on 15/10/5.
 */
///<reference path="../util/SparseArray.ts"/>
///<reference path="../content/res/Resources.ts"/>

module android.view{
    import SparseArray = android.util.SparseArray;

    export class ViewConfiguration{
        private static SCROLL_BAR_SIZE = 8;
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
        public static EDGE_SLOP = 12;
        private static TOUCH_SLOP = 8;
        private static DOUBLE_TAP_TOUCH_SLOP = ViewConfiguration.TOUCH_SLOP;
        private static PAGING_TOUCH_SLOP = ViewConfiguration.TOUCH_SLOP * 2;
        private static DOUBLE_TAP_SLOP = 100;
        private static WINDOW_TOUCH_SLOP = 16;
        private static MINIMUM_FLING_VELOCITY = 50;
        private static MAXIMUM_FLING_VELOCITY = 8000;

        /**
         * The maximum size of View's drawing cache, expressed in bytes. This size
         * should be at least equal to the size of the screen in ARGB888 format.
         */
        //private static MAXIMUM_DRAWING_CACHE_SIZE:number = 480 * 800 * 4;

        private static SCROLL_FRICTION = 0.015;
        private static OVERSCROLL_DISTANCE = 800;//defaul 0
        private static OVERFLING_DISTANCE = 100;//default 6

        static instance : ViewConfiguration;
        static get(arg?:any):ViewConfiguration{
            if(!ViewConfiguration.instance){
                ViewConfiguration.instance = new ViewConfiguration();
            }
            return ViewConfiguration.instance;
        }

        private density = android.content.res.Resources.getDisplayMetrics().density;
        private sizeAndDensity = this.density;
        mEdgeSlop:number = this.sizeAndDensity * ViewConfiguration.EDGE_SLOP;
        mFadingEdgeLength:number = this.sizeAndDensity * ViewConfiguration.FADING_EDGE_LENGTH;
        mMinimumFlingVelocity:number = this.density * ViewConfiguration.MINIMUM_FLING_VELOCITY;
        mMaximumFlingVelocity:number = this.density * ViewConfiguration.MAXIMUM_FLING_VELOCITY;
        mScrollbarSize:number = this.density * ViewConfiguration.SCROLL_BAR_SIZE;
        mTouchSlop:number = this.density * ViewConfiguration.TOUCH_SLOP;
        mDoubleTapTouchSlop:number = this.sizeAndDensity * ViewConfiguration.DOUBLE_TAP_TOUCH_SLOP;
        mPagingTouchSlop:number = this.density * ViewConfiguration.PAGING_TOUCH_SLOP;
        mDoubleTapSlop:number = this.density * ViewConfiguration.DOUBLE_TAP_SLOP;
        mWindowTouchSlop:number = this.sizeAndDensity * ViewConfiguration.WINDOW_TOUCH_SLOP;
        mOverscrollDistance:number = this.sizeAndDensity * ViewConfiguration.OVERSCROLL_DISTANCE;
        mOverflingDistance:number = this.sizeAndDensity * ViewConfiguration.OVERFLING_DISTANCE;
        mMaximumDrawingCacheSize:number = android.content.res.Resources.getDisplayMetrics().widthPixels
            * android.content.res.Resources.getDisplayMetrics().heightPixels * 4 * 2;//android ui x2

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
        getScaledTouchSlop():number {
            return this.mTouchSlop;
        }
        /**
         * @return Distance in pixels the first touch can wander before we do not consider this a
         * potential double tap event
         * @hide
         */
        getScaledDoubleTapTouchSlop():number {
            return this.mDoubleTapTouchSlop;
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

        /**
         * The maximum drawing cache size expressed in bytes.
         *
         * @return the maximum size of View's drawing cache expressed in bytes
         */
        getScaledMaximumDrawingCacheSize():number  {
            return this.mMaximumDrawingCacheSize;
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
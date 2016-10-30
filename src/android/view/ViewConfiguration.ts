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

///<reference path="../util/SparseArray.ts"/>
///<reference path="../content/res/Resources.ts"/>

module android.view{
    import SparseArray = android.util.SparseArray;

    /**
     * Contains methods to standard constants used in the UI for timeouts, sizes, and distances.
     */
    export class ViewConfiguration{
        /**
         * Defines the width of the horizontal scrollbar and the height of the vertical scrollbar in
         * dips
         */
        private static SCROLL_BAR_SIZE = 8;
        /**
         * Duration of the fade when scrollbars fade away in milliseconds
         */
        private static SCROLL_BAR_FADE_DURATION = 250;
        /**
         * Default delay before the scrollbars fade in milliseconds
         */
        private static SCROLL_BAR_DEFAULT_DELAY = 300;
        /**
         * Defines the length of the fading edges in dips
         */
        private static FADING_EDGE_LENGTH = 12;
        /**
         * Defines the duration in milliseconds of the pressed state in child
         * components.
         */
        private static PRESSED_STATE_DURATION = 64;
        /**
         * Defines the default duration in milliseconds before a press turns into
         * a long press
         */
        private static DEFAULT_LONG_PRESS_TIMEOUT = 500;
        /**
         * Defines the time between successive key repeats in milliseconds.
         */
        private static KEY_REPEAT_DELAY = 50;
        /**
         * Defines the duration in milliseconds a user needs to hold down the
         * appropriate button to bring up the global actions dialog (power off,
         * lock screen, etc).
         */
        private static GLOBAL_ACTIONS_KEY_TIMEOUT = 500;
        /**
         * Defines the duration in milliseconds we will wait to see if a touch event
         * is a tap or a scroll. If the user does not move within this interval, it is
         * considered to be a tap.
         */
        private static TAP_TIMEOUT = 180;
        /**
         * Defines the duration in milliseconds we will wait to see if a touch event
         * is a jump tap. If the user does not complete the jump tap within this interval, it is
         * considered to be a tap.
         */
        private static JUMP_TAP_TIMEOUT = 500;
        /**
         * Defines the duration in milliseconds between the first tap's up event and
         * the second tap's down event for an interaction to be considered a
         * double-tap.
         */
        private static DOUBLE_TAP_TIMEOUT = 300;
        /**
         * Defines the minimum duration in milliseconds between the first tap's up event and
         * the second tap's down event for an interaction to be considered a
         * double-tap.
         */
        private static DOUBLE_TAP_MIN_TIME = 40;
        /**
         * Defines the maximum duration in milliseconds between a touch pad
         * touch and release for a given touch to be considered a tap (click) as
         * opposed to a hover movement gesture.
         */
        private static HOVER_TAP_TIMEOUT = 150;
        /**
         * Defines the maximum distance in pixels that a touch pad touch can move
         * before being released for it to be considered a tap (click) as opposed
         * to a hover movement gesture.
         */
        private static HOVER_TAP_SLOP = 20;
        /**
         * Defines the duration in milliseconds we want to display zoom controls in response
         * to a user panning within an application.
         */
        private static ZOOM_CONTROLS_TIMEOUT = 3000;
        /**
         * Inset in dips to look for touchable content when the user touches the edge of the screen
         */
        public static EDGE_SLOP = 12;
        /**
         * Distance a touch can wander before we think the user is scrolling in dips.
         * Note that this value defined here is only used as a fallback by legacy/misbehaving
         * applications that do not provide a Context for determining density/configuration-dependent
         * values.
         *
         * To alter this value, see the configuration resource config_viewConfigurationTouchSlop
         * in frameworks/base/core/res/res/values/config.xml or the appropriate device resource overlay.
         * It may be appropriate to tweak this on a device-specific basis in an overlay based on
         * the characteristics of the touch panel and firmware.
         */
        private static TOUCH_SLOP = 8;
        /**
         * Distance the first touch can wander before we stop considering this event a double tap
         * (in dips)
         */
        private static DOUBLE_TAP_TOUCH_SLOP = ViewConfiguration.TOUCH_SLOP;
        /**
         * Distance a touch can wander before we think the user is attempting a paged scroll
         * (in dips)
         *
         * Note that this value defined here is only used as a fallback by legacy/misbehaving
         * applications that do not provide a Context for determining density/configuration-dependent
         * values.
         *
         * See the note above on {@link #TOUCH_SLOP} regarding the dimen resource
         * config_viewConfigurationTouchSlop. ViewConfiguration will report a paging touch slop of
         * config_viewConfigurationTouchSlop * 2 when provided with a Context.
         */
        private static PAGING_TOUCH_SLOP = ViewConfiguration.TOUCH_SLOP * 2;
        /**
         * Distance in dips between the first touch and second touch to still be considered a double tap
         */
        private static DOUBLE_TAP_SLOP = 100;
        /**
         * Distance in dips a touch needs to be outside of a window's bounds for it to
         * count as outside for purposes of dismissing the window.
         */
        private static WINDOW_TOUCH_SLOP = 16;
        /**
         * Minimum velocity to initiate a fling, as measured in dips per second
         */
        private static MINIMUM_FLING_VELOCITY = 50;
        /**
         * Maximum velocity to initiate a fling, as measured in dips per second
         */
        private static MAXIMUM_FLING_VELOCITY = 8000;

        /**
         * The maximum size of View's drawing cache, expressed in bytes. This size
         * should be at least equal to the size of the screen in ARGB888 format.
         */
        //private static MAXIMUM_DRAWING_CACHE_SIZE:number = 480 * 800 * 4;

        /**
         * The coefficient of friction applied to flings/scrolls.
         */
        private static SCROLL_FRICTION = 0.015;
        /**
         * Max distance in dips to overscroll for edge effects
         */
        private static OVERSCROLL_DISTANCE = 800;//defaul 0
        /**
         * Max distance in dips to overfling for edge effects
         */
        private static OVERFLING_DISTANCE = 80;//default 6

        static instance : ViewConfiguration;

        /**
         * Returns a configuration for the specified context. The configuration depends on
         * various parameters of the context, like the dimension of the display or the
         * density of the display.
         *
         * @param context The application context used to initialize the view configuration.
         */
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

        /**
         * @return The width of the horizontal scrollbar and the height of the vertical
         *         scrollbar in pixels
         */
        getScaledScrollBarSize():number {
            return this.mScrollbarSize;
        }
        /**
         * @return Duration of the fade when scrollbars fade away in milliseconds
         */
        static getScrollBarFadeDuration():number {
            return ViewConfiguration.SCROLL_BAR_FADE_DURATION;
        }
        /**
         * @return Default delay before the scrollbars fade in milliseconds
         */
        static getScrollDefaultDelay():number {
            return ViewConfiguration.SCROLL_BAR_DEFAULT_DELAY;
        }
        /**
         * @return the length of the fading edges in pixels
         */
        getScaledFadingEdgeLength():number {
            return this.mFadingEdgeLength;
        }
        /**
         * @return the duration in milliseconds of the pressed state in child
         * components.
         */
        static getPressedStateDuration():number {
            return ViewConfiguration.PRESSED_STATE_DURATION;
        }
        /**
         * @return the duration in milliseconds before a press turns into
         * a long press
         */
        static getLongPressTimeout():number {
            return ViewConfiguration.DEFAULT_LONG_PRESS_TIMEOUT;
        }
        /**
         * @return the time between successive key repeats in milliseconds.
         */
        static getKeyRepeatDelay():number {
            return ViewConfiguration.KEY_REPEAT_DELAY;
        }
        /**
         * @return the duration in milliseconds we will wait to see if a touch event
         * is a tap or a scroll. If the user does not move within this interval, it is
         * considered to be a tap.
         */
        static getTapTimeout():number {
            return ViewConfiguration.TAP_TIMEOUT;
        }
        /**
         * @return the duration in milliseconds we will wait to see if a touch event
         * is a jump tap. If the user does not move within this interval, it is
         * considered to be a tap.
         */
        static getJumpTapTimeout():number {
            return ViewConfiguration.JUMP_TAP_TIMEOUT;
        }
        /**
         * @return the duration in milliseconds between the first tap's up event and
         * the second tap's down event for an interaction to be considered a
         * double-tap.
         */
        static getDoubleTapTimeout():number {
            return ViewConfiguration.DOUBLE_TAP_TIMEOUT;
        }
        /**
         * @return the minimum duration in milliseconds between the first tap's
         * up event and the second tap's down event for an interaction to be considered a
         * double-tap.
         *
         * @hide
         */
        static getDoubleTapMinTime():number {
            return ViewConfiguration.DOUBLE_TAP_MIN_TIME;
        }
        /**
         * @return Inset in pixels to look for touchable content when the user touches the edge of the
         *         screen
         */
        getScaledEdgeSlop():number {
            return this.mEdgeSlop;
        }
        /**
         * @return Distance in pixels a touch can wander before we think the user is scrolling
         */
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
        /**
         * @return Distance in pixels a touch can wander before we think the user is scrolling a full
         * page
         */
        getScaledPagingTouchSlop() {
            return this.mPagingTouchSlop;
        }
        /**
         * @return Distance in pixels between the first touch and second touch to still be
         *         considered a double tap
         */
        getScaledDoubleTapSlop() {
            return this.mDoubleTapSlop;
        }
        /**
         * @return Distance in pixels a touch must be outside the bounds of a window for it
         * to be counted as outside the window for purposes of dismissing that window.
         */
        getScaledWindowTouchSlop() {
            return this.mWindowTouchSlop;
        }
        /**
         * @return Minimum velocity to initiate a fling, as measured in pixels per second.
         */
        getScaledMinimumFlingVelocity() {
            return this.mMinimumFlingVelocity;
        }
        /**
         * @return Maximum velocity to initiate a fling, as measured in pixels per second.
         */
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
        /**
         * @return The maximum distance a View should overscroll by when showing edge effects (in
         * pixels).
         */
        getScaledOverscrollDistance() {
            return this.mOverscrollDistance;
        }
        /**
         * @return The maximum distance a View should overfling by when showing edge effects (in
         * pixels).
         */
        getScaledOverflingDistance() {
            return this.mOverflingDistance;
        }
        /**
         * The amount of friction applied to scrolls and flings.
         *
         * @return A scalar dimensionless value representing the coefficient of
         *         friction.
         */
        static getScrollFriction() {
            return ViewConfiguration.SCROLL_FRICTION;
        }
    }
}
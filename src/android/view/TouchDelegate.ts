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

///<reference path="View.ts"/>
///<reference path="../graphics/Rect.ts"/>
///<reference path="ViewConfiguration.ts"/>


module android.view{
    import Rect = android.graphics.Rect;
    /**
     * Helper class to handle situations where you want a view to have a larger touch area than its
     * actual view bounds. The view whose touch area is changed is called the delegate view. This
     * class should be used by an ancestor of the delegate. To use a TouchDelegate, first create an
     * instance that specifies the bounds that should be mapped to the delegate and the delegate
     * view itself.
     * <p>
     * The ancestor should then forward all of its touch events received in its
     * {@link android.view.View#onTouchEvent(MotionEvent)} to {@link #onTouchEvent(MotionEvent)}.
     * </p>
     */
    export class TouchDelegate{
        /**
         * View that should receive forwarded touch events
         */
        private mDelegateView:View;
        /**
         * Bounds in local coordinates of the containing view that should be mapped to the delegate
         * view. This rect is used for initial hit testing.
         */
        private mBounds:Rect;
        /**
         * mBounds inflated to include some slop. This rect is to track whether the motion events
         * should be considered to be be within the delegate view.
         */
        private mSlopBounds:Rect;
        /**
         * True if the delegate had been targeted on a down event (intersected mBounds).
         */
        private mDelegateTargeted = false;
        private mSlop = 0;

        /**
         * Constructor
         *
         * @param bounds Bounds in local coordinates of the containing view that should be mapped to
         *        the delegate view
         * @param delegateView The view that should receive motion events
         */
        constructor(bounds:Rect, delegateView:View) {
            this.mBounds = bounds;

            this.mSlop = ViewConfiguration.get().getScaledTouchSlop();
            this.mSlopBounds = new Rect(bounds);
            this.mSlopBounds.inset(-this.mSlop, -this.mSlop);
            this.mDelegateView = delegateView;
        }

        /**
         * Will forward touch events to the delegate view if the event is within the bounds
         * specified in the constructor.
         *
         * @param event The touch event to forward
         * @return True if the event was forwarded to the delegate, false otherwise.
         */
        onTouchEvent(event:MotionEvent) {
            let x = event.getX();
            let y = event.getY();
            let sendToDelegate = false;
            let hit = true;
            let handled = false;

            switch (event.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    let bounds = this.mBounds;

                    if (bounds.contains(x, y)) {
                        this.mDelegateTargeted = true;
                        sendToDelegate = true;
                    }
                    break;
                case MotionEvent.ACTION_UP:
                case MotionEvent.ACTION_MOVE:
                    sendToDelegate = this.mDelegateTargeted;
                    if (sendToDelegate) {
                        let slopBounds = this.mSlopBounds;
                        if (!slopBounds.contains(x, y)) {
                            hit = false;
                        }
                    }
                    break;
                case MotionEvent.ACTION_CANCEL:
                    sendToDelegate = this.mDelegateTargeted;
                    this.mDelegateTargeted = false;
                    break;
            }
            if (sendToDelegate) {
                let delegateView = this.mDelegateView;

                if (hit) {
                    // Offset event coordinates to be inside the target view
                    event.setLocation(delegateView.getWidth() / 2, delegateView.getHeight() / 2);
                } else {
                    // Offset event coordinates to be outside the target view (in case it does
                    // something like tracking pressed state)
                    let slop = this.mSlop;
                    event.setLocation(-(slop * 2), -(slop * 2));
                }
                handled = delegateView.dispatchTouchEvent(event);
            }
            return handled;
        }
    }
}
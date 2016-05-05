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

///<reference path="../../java/lang/util/concurrent/CopyOnWriteArrayList.ts"/>
///<reference path="../util/CopyOnWriteArray.ts"/>
///<reference path="../view/View.ts"/>

module android.view {
    import CopyOnWriteArrayList = java.lang.util.concurrent.CopyOnWriteArrayList;
    import CopyOnWriteArray = android.util.CopyOnWriteArray;

    /**
     * A view tree observer is used to register listeners that can be notified of global
     * changes in the view tree. Such global events include, but are not limited to,
     * layout of the whole tree, beginning of the drawing pass, touch mode change....
     *
     * A ViewTreeObserver should never be instantiated by applications as it is provided
     * by the views hierarchy. Refer to {@link android.view.View#getViewTreeObserver()}
     * for more information.
     */
    export class ViewTreeObserver {

        //private mOnWindowAttachListeners:CopyOnWriteArrayList<ViewTreeObserver.OnWindowAttachListener>;
        //private mOnGlobalFocusListeners:CopyOnWriteArrayList<ViewTreeObserver.OnGlobalFocusChangeListener>;
        private mOnTouchModeChangeListeners:CopyOnWriteArrayList<ViewTreeObserver.OnTouchModeChangeListener>;

        private mOnGlobalLayoutListeners:CopyOnWriteArray<ViewTreeObserver.OnGlobalLayoutListener>;
        private mOnScrollChangedListeners:CopyOnWriteArray<ViewTreeObserver.OnScrollChangedListener>;
        private mOnPreDrawListeners:CopyOnWriteArray<ViewTreeObserver.OnPreDrawListener>;

        private mOnDrawListeners:CopyOnWriteArrayList<ViewTreeObserver.OnDrawListener>;

        private mAlive = true;

        //addOnWindowAttachListener(listener:ViewTreeObserver.OnWindowAttachListener) {
        //    this.checkIsAlive();
        //
        //    if (this.mOnWindowAttachListeners == null) {
        //        this.mOnWindowAttachListeners = new CopyOnWriteArrayList<ViewTreeObserver.OnWindowAttachListener>();
        //    }
        //
        //    this.mOnWindowAttachListeners.add(listener);
        //}
        //removeOnWindowAttachListener(victim:ViewTreeObserver.OnWindowAttachListener) {
        //    this.checkIsAlive();
        //    if (this.mOnWindowAttachListeners == null) {
        //        return;
        //    }
        //    this.mOnWindowAttachListeners.remove(victim);
        //}
        //dispatchOnWindowAttachedChange(attached:boolean) {
        //    // NOTE: because of the use of CopyOnWriteArrayList, we *must* use an iterator to
        //    // perform the dispatching. The iterator is a safe guard against listeners that
        //    // could mutate the list by calling the various add/remove methods. This prevents
        //    // the array from being modified while we iterate it.
        //    let listeners = this.mOnWindowAttachListeners;
        //    if (listeners != null && listeners.size() > 0) {
        //        for (let listener of listeners) {
        //            if (attached) listener.onWindowAttached();
        //            else listener.onWindowDetached();
        //        }
        //    }
        //}

        /**
         * Register a callback to be invoked when the global layout state or the visibility of views
         * within the view tree changes
         *
         * @param listener The callback to add
         *
         * @throws IllegalStateException If {@link #isAlive()} returns false
         */
        addOnGlobalLayoutListener(listener:ViewTreeObserver.OnGlobalLayoutListener) {
            this.checkIsAlive();

            if (this.mOnGlobalLayoutListeners == null) {
                this.mOnGlobalLayoutListeners = new CopyOnWriteArray<ViewTreeObserver.OnGlobalLayoutListener>();
            }

            this.mOnGlobalLayoutListeners.add(listener);
        }
        /**
         * Remove a previously installed global layout callback
         *
         * @param victim The callback to remove
         *
         * @throws IllegalStateException If {@link #isAlive()} returns false
         *
         * @deprecated Use #removeOnGlobalLayoutListener instead
         *
         * @see #addOnGlobalLayoutListener(OnGlobalLayoutListener)
         */
        removeGlobalOnLayoutListener(victim:ViewTreeObserver.OnGlobalLayoutListener) {
            this.removeOnGlobalLayoutListener(victim);
        }
        /**
         * Remove a previously installed global layout callback
         *
         * @param victim The callback to remove
         *
         * @throws IllegalStateException If {@link #isAlive()} returns false
         *
         * @see #addOnGlobalLayoutListener(OnGlobalLayoutListener)
         */
        removeOnGlobalLayoutListener(victim:ViewTreeObserver.OnGlobalLayoutListener) {
            this.checkIsAlive();
            if (this.mOnGlobalLayoutListeners == null) {
                return;
            }
            this.mOnGlobalLayoutListeners.remove(victim);
        }
        /**
         * Notifies registered listeners that a global layout happened. This can be called
         * manually if you are forcing a layout on a View or a hierarchy of Views that are
         * not attached to a Window or in the GONE state.
         */
        dispatchOnGlobalLayout() {
            // NOTE: because of the use of CopyOnWriteArrayList, we *must* use an iterator to
            // perform the dispatching. The iterator is a safe guard against listeners that
            // could mutate the list by calling the various add/remove methods. This prevents
            // the array from being modified while we iterate it.
            let listeners = this.mOnGlobalLayoutListeners;
            if (listeners != null && listeners.size() > 0) {
                let access = listeners.start();
                try {
                    let count = access.length;
                    for (let i = 0; i < count; i++) {
                        access[i].onGlobalLayout();
                    }
                } finally {
                    listeners.end();
                }
            }
        }
        //addOnGlobalFocusChangeListener(listener:ViewTreeObserver.OnGlobalFocusChangeListener) {
        //    this.checkIsAlive();
        //
        //    if (this.mOnGlobalFocusListeners == null) {
        //        this.mOnGlobalFocusListeners = new CopyOnWriteArrayList<ViewTreeObserver.OnGlobalFocusChangeListener>();
        //    }
        //
        //    this.mOnGlobalFocusListeners.add(listener);
        //}
        //removeOnGlobalFocusChangeListener(victim:ViewTreeObserver.OnGlobalFocusChangeListener) {
        //    this.checkIsAlive();
        //    if (this.mOnGlobalFocusListeners == null) {
        //        return;
        //    }
        //    this.mOnGlobalFocusListeners.remove(victim);
        //}
        //
        //dispatchOnGlobalFocusChange(oldFocus:android.view.View, newFocus:android.view.View) {
        //    // NOTE: because of the use of CopyOnWriteArrayList, we *must* use an iterator to
        //    // perform the dispatching. The iterator is a safe guard against listeners that
        //    // could mutate the list by calling the various add/remove methods. This prevents
        //    // the array from being modified while we iterate it.
        //    const listeners = this.mOnGlobalFocusListeners;
        //    if (listeners != null && listeners.size() > 0) {
        //        for (let listener of listeners) {
        //            listener.onGlobalFocusChanged(oldFocus, newFocus);
        //        }
        //    }
        //}

        /**
         * Register a callback to be invoked when the view tree is about to be drawn
         *
         * @param listener The callback to add
         *
         * @throws IllegalStateException If {@link #isAlive()} returns false
         */
        addOnPreDrawListener(listener:ViewTreeObserver.OnPreDrawListener) {
            this.checkIsAlive();

            if (this.mOnPreDrawListeners == null) {
                this.mOnPreDrawListeners = new CopyOnWriteArray<ViewTreeObserver.OnPreDrawListener>();
            }

            this.mOnPreDrawListeners.add(listener);
        }
        /**
         * Remove a previously installed pre-draw callback
         *
         * @param victim The callback to remove
         *
         * @throws IllegalStateException If {@link #isAlive()} returns false
         *
         * @see #addOnPreDrawListener(OnPreDrawListener)
         */
        removeOnPreDrawListener(victim:ViewTreeObserver.OnPreDrawListener) {
            this.checkIsAlive();
            if (this.mOnPreDrawListeners == null) {
                return;
            }
            this.mOnPreDrawListeners.remove(victim);
        }
        /**
         * Notifies registered listeners that the drawing pass is about to start. If a
         * listener returns true, then the drawing pass is canceled and rescheduled. This can
         * be called manually if you are forcing the drawing on a View or a hierarchy of Views
         * that are not attached to a Window or in the GONE state.
         *
         * @return True if the current draw should be canceled and resceduled, false otherwise.
         */
        dispatchOnPreDraw():boolean {
            let cancelDraw = false;
            const listeners = this.mOnPreDrawListeners;
            if (listeners != null && listeners.size() > 0) {
                let access = listeners.start();
                try {
                    let count = access.length;
                    for (let i = 0; i < count; i++) {
                        cancelDraw = cancelDraw || !(access[i].onPreDraw());
                    }
                } finally {
                    listeners.end();
                }
            }
            return cancelDraw;
        }
        /**
         * Register a callback to be invoked when the invoked when the touch mode changes.
         *
         * @param listener The callback to add
         *
         * @throws IllegalStateException If {@link #isAlive()} returns false
         */
        addOnTouchModeChangeListener(listener:ViewTreeObserver.OnTouchModeChangeListener) {
            this.checkIsAlive();

            if (this.mOnTouchModeChangeListeners == null) {
                this.mOnTouchModeChangeListeners = new CopyOnWriteArrayList<ViewTreeObserver.OnTouchModeChangeListener>();
            }

            this.mOnTouchModeChangeListeners.add(listener);
        }
        /**
         * Remove a previously installed touch mode change callback
         *
         * @param victim The callback to remove
         *
         * @throws IllegalStateException If {@link #isAlive()} returns false
         *
         * @see #addOnTouchModeChangeListener(OnTouchModeChangeListener)
         */
        removeOnTouchModeChangeListener(victim:ViewTreeObserver.OnTouchModeChangeListener) {
            this.checkIsAlive();
            if (this.mOnTouchModeChangeListeners == null) {
                return;
            }
            this.mOnTouchModeChangeListeners.remove(victim);
        }

        /**
         * Notifies registered listeners that the touch mode has changed.
         *
         * @param inTouchMode True if the touch mode is now enabled, false otherwise.
         */
        dispatchOnTouchModeChanged(inTouchMode:boolean) {
            const listeners = this.mOnTouchModeChangeListeners;
            if (listeners != null && listeners.size() > 0) {
                for (let listener of listeners) {
                    listener.onTouchModeChanged(inTouchMode);
                }
            }
        }

        /**
         * Register a callback to be invoked when a view has been scrolled.
         *
         * @param listener The callback to add
         *
         * @throws IllegalStateException If {@link #isAlive()} returns false
         */
        addOnScrollChangedListener(listener:ViewTreeObserver.OnScrollChangedListener) {
            this.checkIsAlive();

            if (this.mOnScrollChangedListeners == null) {
                this.mOnScrollChangedListeners = new CopyOnWriteArray<ViewTreeObserver.OnScrollChangedListener>();
            }

            this.mOnScrollChangedListeners.add(listener);
        }
        /**
         * Remove a previously installed scroll-changed callback
         *
         * @param victim The callback to remove
         *
         * @throws IllegalStateException If {@link #isAlive()} returns false
         *
         * @see #addOnScrollChangedListener(OnScrollChangedListener)
         */
        removeOnScrollChangedListener(victim:ViewTreeObserver.OnScrollChangedListener) {
            this.checkIsAlive();
            if (this.mOnScrollChangedListeners == null) {
                return;
            }
            this.mOnScrollChangedListeners.remove(victim);
        }
        /**
         * Notifies registered listeners that something has scrolled.
         */
        dispatchOnScrollChanged():void {
            let listeners = this.mOnScrollChangedListeners;
            if (listeners != null && listeners.size() > 0) {
                let access = listeners.start();
                try {
                    let count = access.length;
                    for (let i = 0; i < count; i++) {
                        access[i].onScrollChanged();
                    }
                } finally {
                    listeners.end();
                }
            }
        }
        /**
         * <p>Register a callback to be invoked when the view tree is about to be drawn.</p>
         * <p><strong>Note:</strong> this method <strong>cannot</strong> be invoked from
         * {@link android.view.ViewTreeObserver.OnDrawListener#onDraw()}.</p>
         *
         * @param listener The callback to add
         *
         * @throws IllegalStateException If {@link #isAlive()} returns false
         */
        addOnDrawListener(listener:ViewTreeObserver.OnDrawListener) {
            this.checkIsAlive();

            if (this.mOnDrawListeners == null) {
                this.mOnDrawListeners = new CopyOnWriteArrayList<ViewTreeObserver.OnDrawListener>();
            }

            this.mOnDrawListeners.add(listener);
        }
        /**
         * <p>Remove a previously installed pre-draw callback.</p>
         * <p><strong>Note:</strong> this method <strong>cannot</strong> be invoked from
         * {@link android.view.ViewTreeObserver.OnDrawListener#onDraw()}.</p>
         *
         * @param victim The callback to remove
         *
         * @throws IllegalStateException If {@link #isAlive()} returns false
         *
         * @see #addOnDrawListener(OnDrawListener)
         */
        removeOnDrawListener(victim:ViewTreeObserver.OnDrawListener) {
            this.checkIsAlive();
            if (this.mOnDrawListeners == null) {
                return;
            }
            this.mOnDrawListeners.remove(victim);
        }
        /**
         * Notifies registered listeners that the drawing pass is about to start.
         */
        dispatchOnDraw():void {
            if (this.mOnDrawListeners != null) {
                for (let listener of this.mOnDrawListeners) {
                    listener.onDraw();
                }
            }
        }

        /**
         * Merges all the listeners registered on the specified observer with the listeners
         * registered on this object. After this method is invoked, the specified observer
         * will return false in {@link #isAlive()} and should not be used anymore.
         *
         * @param observer The ViewTreeObserver whose listeners must be added to this observer
         */
        merge(observer:ViewTreeObserver){
            //if (observer.mOnWindowAttachListeners != null) {
            //    if (this.mOnWindowAttachListeners != null) {
            //        this.mOnWindowAttachListeners.addAll(observer.mOnWindowAttachListeners);
            //    } else {
            //        this.mOnWindowAttachListeners = observer.mOnWindowAttachListeners;
            //    }
            //}

            //if (observer.mOnWindowFocusListeners != null) {
            //    if (this.mOnWindowFocusListeners != null) {
            //        this.mOnWindowFocusListeners.addAll(observer.mOnWindowFocusListeners);
            //    } else {
            //        this.mOnWindowFocusListeners = observer.mOnWindowFocusListeners;
            //    }
            //}
            //
            //if (observer.mOnGlobalFocusListeners != null) {
            //    if (this.mOnGlobalFocusListeners != null) {
            //        this.mOnGlobalFocusListeners.addAll(observer.mOnGlobalFocusListeners);
            //    } else {
            //        this.mOnGlobalFocusListeners = observer.mOnGlobalFocusListeners;
            //    }
            //}

            if (observer.mOnGlobalLayoutListeners != null) {
                if (this.mOnGlobalLayoutListeners != null) {
                    this.mOnGlobalLayoutListeners.addAll(observer.mOnGlobalLayoutListeners);
                } else {
                    this.mOnGlobalLayoutListeners = observer.mOnGlobalLayoutListeners;
                }
            }

            if (observer.mOnPreDrawListeners != null) {
                if (this.mOnPreDrawListeners != null) {
                    this.mOnPreDrawListeners.addAll(observer.mOnPreDrawListeners);
                } else {
                    this.mOnPreDrawListeners = observer.mOnPreDrawListeners;
                }
            }

            //if (observer.mOnTouchModeChangeListeners != null) {
            //    if (this.mOnTouchModeChangeListeners != null) {
            //        this.mOnTouchModeChangeListeners.addAll(observer.mOnTouchModeChangeListeners);
            //    } else {
            //        this.mOnTouchModeChangeListeners = observer.mOnTouchModeChangeListeners;
            //    }
            //}
            //
            //if (observer.mOnComputeInternalInsetsListeners != null) {
            //    if (this.mOnComputeInternalInsetsListeners != null) {
            //        this.mOnComputeInternalInsetsListeners.addAll(observer.mOnComputeInternalInsetsListeners);
            //    } else {
            //        this.mOnComputeInternalInsetsListeners = observer.mOnComputeInternalInsetsListeners;
            //    }
            //}

            if (observer.mOnScrollChangedListeners != null) {
                if (this.mOnScrollChangedListeners != null) {
                    this.mOnScrollChangedListeners.addAll(observer.mOnScrollChangedListeners);
                } else {
                    this.mOnScrollChangedListeners = observer.mOnScrollChangedListeners;
                }
            }

            observer.kill();
        }

        private checkIsAlive() {
            if (!this.mAlive) {
                throw new Error("This ViewTreeObserver is not alive, call "
                    + "getViewTreeObserver() again");
            }
        }
        /**
         * Indicates whether this ViewTreeObserver is alive. When an observer is not alive,
         * any call to a method (except this one) will throw an exception.
         *
         * If an application keeps a long-lived reference to this ViewTreeObserver, it should
         * always check for the result of this method before calling any other method.
         *
         * @return True if this object is alive and be used, false otherwise.
         */
        isAlive():boolean {
            return this.mAlive;
        }
        private kill() {
            this.mAlive = false;
        }
    }

    export module ViewTreeObserver {
        //export interface OnWindowAttachListener {
        //    onWindowAttached();
        //    onWindowDetached();
        //}

        /**
         * Interface definition for a callback to be invoked when the focus state within
         * the view tree changes.
         */
        export interface OnGlobalFocusChangeListener {

            /**
             * Callback method to be invoked when the focus changes in the view tree. When
             * the view tree transitions from touch mode to non-touch mode, oldFocus is null.
             * When the view tree transitions from non-touch mode to touch mode, newFocus is
             * null. When focus changes in non-touch mode (without transition from or to
             * touch mode) either oldFocus or newFocus can be null.
             *
             * @param oldFocus The previously focused view, if any.
             * @param newFocus The newly focused View, if any.
             */
            onGlobalFocusChanged(oldFocus:android.view.View, newFocus:android.view.View);
        }

        /**
         * Interface definition for a callback to be invoked when the global layout state
         * or the visibility of views within the view tree changes.
         */
        export interface OnGlobalLayoutListener {

            /**
             * Callback method to be invoked when the global layout state or the visibility of views
             * within the view tree changes
             */
            onGlobalLayout();
        }
        /**
         * Interface definition for a callback to be invoked when the view tree is about to be drawn.
         */
        export interface OnPreDrawListener {
            /**
             * Callback method to be invoked when the view tree is about to be drawn. At this point, all
             * views in the tree have been measured and given a frame. Clients can use this to adjust
             * their scroll bounds or even to request a new layout before drawing occurs.
             *
             * @return Return true to proceed with the current drawing pass, or false to cancel.
             *
             * @see android.view.View#onMeasure
             * @see android.view.View#onLayout
             * @see android.view.View#onDraw
             */
            onPreDraw():boolean;
        }
        /**
         * Interface definition for a callback to be invoked when the view tree is about to be drawn.
         */
        export interface OnDrawListener {
            /**
             * <p>Callback method to be invoked when the view tree is about to be drawn. At this point,
             * views cannot be modified in any way.</p>
             *
             * <p>Unlike with {@link OnPreDrawListener}, this method cannot be used to cancel the
             * current drawing pass.</p>
             *
             * <p>An {@link OnDrawListener} listener <strong>cannot be added or removed</strong>
             * from this method.</p>
             *
             * @see android.view.View#onMeasure
             * @see android.view.View#onLayout
             * @see android.view.View#onDraw
             */
            onDraw();
        }
        /**
         * Interface definition for a callback to be invoked when
         * something in the view tree has been scrolled.
         */
        export interface OnScrollChangedListener {
            /**
             * Callback method to be invoked when something in the view tree
             * has been scrolled.
             */
            onScrollChanged();
        }
        /**
         * Interface definition for a callback to be invoked when the touch mode changes.
         */
        export interface OnTouchModeChangeListener {
            /**
             * Callback method to be invoked when the touch mode changes.
             *
             * @param isInTouchMode True if the view hierarchy is now in touch mode, false  otherwise.
             */
            onTouchModeChanged(isInTouchMode:boolean);
        }
    }
}
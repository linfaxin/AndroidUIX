/**
 * Created by linfaxin on 15/10/8.
 */
///<reference path="../../java/lang/util/concurrent/CopyOnWriteArrayList.ts"/>
///<reference path="../util/CopyOnWriteArray.ts"/>
///<reference path="../view/View.ts"/>

module android.view {
    import CopyOnWriteArrayList = java.lang.util.concurrent.CopyOnWriteArrayList;
    import CopyOnWriteArray = android.util.CopyOnWriteArray;

    export class ViewTreeObserver {

        private mOnWindowAttachListeners:CopyOnWriteArrayList<ViewTreeObserver.OnWindowAttachListener>;
        private mOnGlobalFocusListeners:CopyOnWriteArrayList<ViewTreeObserver.OnGlobalFocusChangeListener>;
        private mOnTouchModeChangeListeners:CopyOnWriteArrayList<ViewTreeObserver.OnTouchModeChangeListener>;

        private mOnGlobalLayoutListeners:CopyOnWriteArray<ViewTreeObserver.OnGlobalLayoutListener>;
        private mOnScrollChangedListeners:CopyOnWriteArray<ViewTreeObserver.OnScrollChangedListener>;
        private mOnPreDrawListeners:CopyOnWriteArray<ViewTreeObserver.OnPreDrawListener>;

        private mOnDrawListeners:CopyOnWriteArrayList<ViewTreeObserver.OnDrawListener>;

        private mAlive = true;

        addOnWindowAttachListener(listener:ViewTreeObserver.OnWindowAttachListener) {
            this.checkIsAlive();

            if (this.mOnWindowAttachListeners == null) {
                this.mOnWindowAttachListeners = new CopyOnWriteArrayList<ViewTreeObserver.OnWindowAttachListener>();
            }

            this.mOnWindowAttachListeners.add(listener);
        }
        removeOnWindowAttachListener(victim:ViewTreeObserver.OnWindowAttachListener) {
            this.checkIsAlive();
            if (this.mOnWindowAttachListeners == null) {
                return;
            }
            this.mOnWindowAttachListeners.remove(victim);
        }
        dispatchOnWindowAttachedChange(attached:boolean) {
            // NOTE: because of the use of CopyOnWriteArrayList, we *must* use an iterator to
            // perform the dispatching. The iterator is a safe guard against listeners that
            // could mutate the list by calling the various add/remove methods. This prevents
            // the array from being modified while we iterate it.
            let listeners = this.mOnWindowAttachListeners;
            if (listeners != null && listeners.size() > 0) {
                for (let listener of listeners) {
                    if (attached) listener.onWindowAttached();
                    else listener.onWindowDetached();
                }
            }
        }

        addOnGlobalLayoutListener(listener:ViewTreeObserver.OnGlobalLayoutListener) {
            this.checkIsAlive();

            if (this.mOnGlobalLayoutListeners == null) {
                this.mOnGlobalLayoutListeners = new CopyOnWriteArray<ViewTreeObserver.OnGlobalLayoutListener>();
            }

            this.mOnGlobalLayoutListeners.add(listener);
        }
        removeGlobalOnLayoutListener(victim:ViewTreeObserver.OnGlobalLayoutListener) {
            this.removeOnGlobalLayoutListener(victim);
        }
        removeOnGlobalLayoutListener(victim:ViewTreeObserver.OnGlobalLayoutListener) {
            this.checkIsAlive();
            if (this.mOnGlobalLayoutListeners == null) {
                return;
            }
            this.mOnGlobalLayoutListeners.remove(victim);
        }
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
        addOnGlobalFocusChangeListener(listener:ViewTreeObserver.OnGlobalFocusChangeListener) {
            this.checkIsAlive();

            if (this.mOnGlobalFocusListeners == null) {
                this.mOnGlobalFocusListeners = new CopyOnWriteArrayList<ViewTreeObserver.OnGlobalFocusChangeListener>();
            }

            this.mOnGlobalFocusListeners.add(listener);
        }
        removeOnGlobalFocusChangeListener(victim:ViewTreeObserver.OnGlobalFocusChangeListener) {
            this.checkIsAlive();
            if (this.mOnGlobalFocusListeners == null) {
                return;
            }
            this.mOnGlobalFocusListeners.remove(victim);
        }

        dispatchOnGlobalFocusChange(oldFocus:android.view.View, newFocus:android.view.View) {
            // NOTE: because of the use of CopyOnWriteArrayList, we *must* use an iterator to
            // perform the dispatching. The iterator is a safe guard against listeners that
            // could mutate the list by calling the various add/remove methods. This prevents
            // the array from being modified while we iterate it.
            const listeners = this.mOnGlobalFocusListeners;
            if (listeners != null && listeners.size() > 0) {
                for (let listener of listeners) {
                    listener.onGlobalFocusChanged(oldFocus, newFocus);
                }
            }
        }

        addOnPreDrawListener(listener:ViewTreeObserver.OnPreDrawListener) {
            this.checkIsAlive();

            if (this.mOnPreDrawListeners == null) {
                this.mOnPreDrawListeners = new CopyOnWriteArray<ViewTreeObserver.OnPreDrawListener>();
            }

            this.mOnPreDrawListeners.add(listener);
        }
        removeOnPreDrawListener(victim:ViewTreeObserver.OnPreDrawListener) {
            this.checkIsAlive();
            if (this.mOnPreDrawListeners == null) {
                return;
            }
            this.mOnPreDrawListeners.remove(victim);
        }
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
        addOnTouchModeChangeListener(listener:ViewTreeObserver.OnTouchModeChangeListener) {
            this.checkIsAlive();

            if (this.mOnTouchModeChangeListeners == null) {
                this.mOnTouchModeChangeListeners = new CopyOnWriteArrayList<ViewTreeObserver.OnTouchModeChangeListener>();
            }

            this.mOnTouchModeChangeListeners.add(listener);
        }
        removeOnTouchModeChangeListener(victim:ViewTreeObserver.OnTouchModeChangeListener) {
            this.checkIsAlive();
            if (this.mOnTouchModeChangeListeners == null) {
                return;
            }
            this.mOnTouchModeChangeListeners.remove(victim);
        }

        dispatchOnTouchModeChanged(inTouchMode:boolean) {
            const listeners = this.mOnTouchModeChangeListeners;
            if (listeners != null && listeners.size() > 0) {
                for (let listener of listeners) {
                    listener.onTouchModeChanged(inTouchMode);
                }
            }
        }

        addOnScrollChangedListener(listener:ViewTreeObserver.OnScrollChangedListener) {
            this.checkIsAlive();

            if (this.mOnScrollChangedListeners == null) {
                this.mOnScrollChangedListeners = new CopyOnWriteArray<ViewTreeObserver.OnScrollChangedListener>();
            }

            this.mOnScrollChangedListeners.add(listener);
        }
        removeOnScrollChangedListener(victim:ViewTreeObserver.OnScrollChangedListener) {
            this.checkIsAlive();
            if (this.mOnScrollChangedListeners == null) {
                return;
            }
            this.mOnScrollChangedListeners.remove(victim);
        }
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
        addOnDrawListener(listener:ViewTreeObserver.OnDrawListener) {
            this.checkIsAlive();

            if (this.mOnDrawListeners == null) {
                this.mOnDrawListeners = new CopyOnWriteArrayList<ViewTreeObserver.OnDrawListener>();
            }

            this.mOnDrawListeners.add(listener);
        }
        removeOnDrawListener(victim:ViewTreeObserver.OnDrawListener) {
            this.checkIsAlive();
            if (this.mOnDrawListeners == null) {
                return;
            }
            this.mOnDrawListeners.remove(victim);
        }
        dispatchOnDraw():void {
            if (this.mOnDrawListeners != null) {
                for (let listener of this.mOnDrawListeners) {
                    listener.onDraw();
                }
            }
        }
        merge(observer:ViewTreeObserver){
            if (observer.mOnWindowAttachListeners != null) {
                if (this.mOnWindowAttachListeners != null) {
                    this.mOnWindowAttachListeners.addAll(observer.mOnWindowAttachListeners);
                } else {
                    this.mOnWindowAttachListeners = observer.mOnWindowAttachListeners;
                }
            }

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
        isAlive():boolean {
            return this.mAlive;
        }
        private kill() {
            this.mAlive = false;
        }
    }

    export module ViewTreeObserver {
        export interface OnWindowAttachListener {
            onWindowAttached();
            onWindowDetached();
        }
        export interface OnGlobalFocusChangeListener {
            onGlobalFocusChanged(oldFocus:android.view.View, newFocus:android.view.View);
        }
        export interface OnGlobalLayoutListener {
            onGlobalLayout();
        }
        export interface OnPreDrawListener {
            onPreDraw():boolean;
        }
        export interface OnDrawListener {
            onDraw();
        }
        export interface OnScrollChangedListener {
            onScrollChanged();
        }
        export interface OnTouchModeChangeListener {
            onTouchModeChanged(isInTouchMode:boolean);
        }
    }
}
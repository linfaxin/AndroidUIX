/**
 * Created by linfaxin on 15/10/8.
 */
///<reference path="../../java/lang/util/concurrent/CopyOnWriteArrayList.ts"/>
///<reference path="../util/CopyOnWriteArray.ts"/>

module android.view {
    import CopyOnWriteArrayList = java.lang.util.concurrent.CopyOnWriteArrayList;
    import CopyOnWriteArray = android.util.CopyOnWriteArray;

    export class ViewTreeObserver {

        private mOnWindowAttachListeners:CopyOnWriteArrayList<ViewTreeObserver.OnWindowAttachListener>;

        private mOnGlobalLayoutListeners:CopyOnWriteArray<ViewTreeObserver.OnGlobalLayoutListener>;
        private mOnScrollChangedListeners:CopyOnWriteArray<ViewTreeObserver.OnScrollChangedListener>;
        private mOnPreDrawListeners:CopyOnWriteArray<ViewTreeObserver.OnPreDrawListener>;

        private mOnDrawListeners:CopyOnWriteArrayList<ViewTreeObserver.OnDrawListener>;

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

        dispatchOnDraw():void {
            if (this.mOnDrawListeners != null) {
                for (let listener of this.mOnDrawListeners) {
                    listener.onDraw();
                }
            }
        }
    }

    export module ViewTreeObserver {
        export interface OnWindowAttachListener {
            onWindowAttached();
            onWindowDetached();
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
    }
}
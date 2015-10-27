declare module android.util {
    class SparseArray<T> {
        map: Map<number, T>;
        constructor(initialCapacity?: number);
        clone(): SparseArray<T>;
        get(key: number, valueIfKeyNotFound: T): T;
        delete(key: number): void;
        remove(key: number): void;
        removeAt(index: number): void;
        removeAtRange(index: number, size?: number): void;
        put(key: number, value: T): void;
        size(): number;
        keyAt(index: number): number;
        valueAt(index: number): T;
        setValueAt(index: number, value: T): void;
        indexOfKey(key: number): number;
        indexOfValue(value: T): number;
        clear(): void;
        append(key: any, value: any): void;
    }
}
declare module android.util {
    class Log {
        static View_DBG: boolean;
        static VelocityTracker_DBG: boolean;
        static VERBOSE: number;
        static DEBUG: number;
        static INFO: number;
        static WARN: number;
        static ERROR: number;
        static ASSERT: number;
        static PriorityString: string[];
        static getPriorityString(priority: number): string;
        static v(tag: string, msg: string, tr?: Error): void;
        static d(tag: string, msg: string): void;
        static i(tag: string, msg: string, tr?: Error): void;
        static w(tag: string, msg: string, tr?: Error): void;
        static e(tag: string, msg: string, tr?: Error): void;
        private static getLogMsg(priority, tag, msg);
    }
}
declare module java.lang {
    class StringBuilder {
        array: Array<string>;
        constructor();
        constructor(capacity: number);
        constructor(str: string);
        length(): number;
        append(str: any): StringBuilder;
        setLength(length: number): void;
        toString(): string;
    }
}
declare module android.graphics {
    import StringBuilder = java.lang.StringBuilder;
    class Rect {
        left: number;
        top: number;
        right: number;
        bottom: number;
        constructor();
        constructor(rect: Rect);
        constructor(left: number, top: number, right: number, bottom: number);
        equals(r: Rect): boolean;
        toString(): string;
        toShortString(sb?: StringBuilder): string;
        flattenToString(): string;
        static unflattenFromString(str: string): Rect;
        isEmpty(): boolean;
        width(): number;
        height(): number;
        centerX(): number;
        centerY(): number;
        exactCenterX(): number;
        exactCenterY(): number;
        setEmpty(): void;
        set(rect: Rect): any;
        set(left: any, top: any, right: any, bottom: any): any;
        offset(dx: any, dy: any): void;
        offsetTo(newLeft: any, newTop: any): void;
        inset(dx: any, dy: any): void;
        contains(x: number, y: number): boolean;
        contains(left: number, top: number, right: number, bottom: number): boolean;
        contains(r: any): boolean;
        intersect(rect: Rect): boolean;
        intersect(left: number, top: number, right: number, bottom: number): boolean;
        intersects(rect: Rect): boolean;
        intersects(left: number, top: number, right: number, bottom: number): boolean;
        union(rect: Rect): any;
        union(x: number, y: number): any;
        union(left: number, top: number, right: number, bottom: number): any;
        sort(): void;
        scale(scale: number): void;
    }
}
declare module android.graphics {
    class PixelFormat {
        static UNKNOWN: number;
        static TRANSLUCENT: number;
        static TRANSPARENT: number;
        static OPAQUE: number;
        static RGBA_8888: number;
        static RGBX_8888: number;
        static RGB_888: number;
        static RGB_565: number;
    }
}
declare module java.lang.ref {
    class WeakReference<T> {
        weakMap: WeakMap<string, T>;
        constructor(referent: T);
        get(): T;
        set(value: T): void;
        clear(): void;
    }
}
declare module java.lang {
    interface Runnable {
        run(): any;
    }
}
declare module android.graphics.drawable {
    import Rect = android.graphics.Rect;
    import WeakReference = java.lang.ref.WeakReference;
    import Runnable = java.lang.Runnable;
    import Callback = Drawable.Callback;
    class Drawable {
        static Callback: Callback;
        mBounds: Rect;
        mStateSet: any[];
        mLevel: number;
        mVisible: boolean;
        mCallback: WeakReference<Callback>;
        constructor();
        draw(canvas: any): void;
        setBounds(rect: Rect): any;
        setBounds(left: any, top: any, right: any, bottom: any): any;
        copyBounds(bounds?: Rect): Rect;
        getBounds(): Rect;
        setCallback(cb: Callback): void;
        getCallback(): Callback;
        invalidateSelf(): void;
        scheduleSelf(what: any, when: any): void;
        unscheduleSelf(what: any): void;
        setAlpha(alpha: number): void;
        getAlpha(): number;
        isStateful(): boolean;
        setState(stateSet: Array<number>): boolean;
        getState(): Array<number>;
        jumpToCurrentState(): void;
        getCurrent(): Drawable;
        setLevel(level: number): boolean;
        getLevel(): number;
        setVisible(visible: boolean, restart: boolean): boolean;
        isVisible(): boolean;
        setAutoMirrored(mirrored: boolean): void;
        isAutoMirrored(): boolean;
        getOpacity(): number;
        static resolveOpacity(op1: number, op2: number): number;
        onStateChange(state: Array<number>): boolean;
        onLevelChange(level: number): boolean;
        onBoundsChange(bounds: Rect): void;
        getIntrinsicWidth(): number;
        getIntrinsicHeight(): number;
        getMinimumWidth(): number;
        getMinimumHeight(): number;
        getPadding(padding: Rect): boolean;
        mutate(): Drawable;
        getConstantState(): any;
    }
    module Drawable {
        interface Callback {
            invalidateDrawable(who: Drawable): void;
            scheduleDrawable(who: Drawable, what: Runnable, when: number): void;
            unscheduleDrawable(who: Drawable, what: Runnable): void;
        }
        interface ConstantState {
            newDrawable(res: any): any;
        }
    }
}
declare module android.graphics {
    class Matrix {
        static IDENTITY_MATRIX: Matrix;
        isIdentity(): boolean;
        mapRect(boundingRect: Rect): boolean;
    }
}
declare module java.lang.util.concurrent {
    class CopyOnWriteArrayList<T> {
        private mData;
        private isDataNew;
        iterator(): T[];
        [Symbol.iterator](): IterableIterator<T>;
        private checkNewData();
        size(): number;
        add(...items: T[]): void;
        addAll(array: CopyOnWriteArrayList<T>): void;
        remove(item: T): void;
    }
}
declare module android.util {
    class CopyOnWriteArray<T> {
        private mData;
        private mDataCopy;
        private mAccess;
        private mStart;
        private getArray();
        start(): Array<T>;
        end(): void;
        size(): number;
        add(...items: T[]): void;
        addAll(array: CopyOnWriteArray<T>): void;
        remove(item: T): void;
    }
}
declare module android.view {
    class ViewTreeObserver {
        private mOnWindowAttachListeners;
        private mOnGlobalLayoutListeners;
        private mOnScrollChangedListeners;
        private mOnPreDrawListeners;
        private mOnDrawListeners;
        dispatchOnWindowAttachedChange(attached: boolean): void;
        dispatchOnGlobalLayout(): void;
        dispatchOnPreDraw(): boolean;
        dispatchOnScrollChanged(): void;
        dispatchOnDraw(): void;
    }
    module ViewTreeObserver {
        interface OnWindowAttachListener {
            onWindowAttached(): any;
            onWindowDetached(): any;
        }
        interface OnGlobalLayoutListener {
            onGlobalLayout(): any;
        }
        interface OnPreDrawListener {
            onPreDraw(): boolean;
        }
        interface OnDrawListener {
            onDraw(): any;
        }
        interface OnScrollChangedListener {
            onScrollChanged(): any;
        }
    }
}
declare module android.util {
    class DisplayMetrics {
        static DENSITY_LOW: number;
        static DENSITY_MEDIUM: number;
        static DENSITY_HIGH: number;
        static DENSITY_XHIGH: number;
        static DENSITY_XXHIGH: number;
        static DENSITY_XXXHIGH: number;
        static DENSITY_DEFAULT: number;
        widthPixels: number;
        heightPixels: number;
        density: number;
        densityDpi: number;
        scaledDensity: number;
        xdpi: number;
        ydpi: number;
    }
}
declare module android.content.res {
    import DisplayMetrics = android.util.DisplayMetrics;
    class Resources {
        private static displayMetrics;
        private static density;
        static getDisplayMetrics(): DisplayMetrics;
        static setDensity(density: number): void;
    }
}
declare module android.view {
    class MotionEvent {
        static ACTION_MASK: number;
        static ACTION_DOWN: number;
        static ACTION_UP: number;
        static ACTION_MOVE: number;
        static ACTION_CANCEL: number;
        static ACTION_OUTSIDE: number;
        static ACTION_POINTER_DOWN: number;
        static ACTION_POINTER_UP: number;
        static ACTION_HOVER_MOVE: number;
        static ACTION_SCROLL: number;
        static ACTION_HOVER_ENTER: number;
        static ACTION_HOVER_EXIT: number;
        static ACTION_POINTER_INDEX_MASK: number;
        static ACTION_POINTER_INDEX_SHIFT: number;
        static HistoryMaxSize: number;
        private static TouchMoveRecord;
        mAction: number;
        mDownTime: number;
        mEventTime: number;
        mActivePointerId: number;
        private mTouchingPointers;
        mXOffset: number;
        mYOffset: number;
        mViewRootTop: number;
        mViewRootLeft: number;
        constructor(e: any, action: number);
        static obtainWithTouchEvent(e: any, action: number): MotionEvent;
        static obtain(event: MotionEvent): MotionEvent;
        static obtainWithAction(downTime: number, eventTime: number, action: number, x: number, y: number): MotionEvent;
        private static IdIndexCache;
        init(event: any, baseAction: number, windowXOffset?: number, windowYOffset?: number): void;
        recycle(): void;
        getAction(): number;
        getActionMasked(): number;
        getActionIndex(): number;
        getDownTime(): number;
        getEventTime(): number;
        getX(pointerIndex?: number): number;
        getY(pointerIndex?: number): number;
        getPointerCount(): number;
        getPointerId(pointerIndex: number): number;
        findPointerIndex(pointerId: number): number;
        getRawX(): number;
        getRawY(): number;
        getHistorySize(id?: number): number;
        getHistoricalX(pointerIndex: number, pos: number): number;
        getHistoricalY(pointerIndex: number, pos: number): number;
        getHistoricalEventTime(pos: number): number;
        getHistoricalEventTime(pointerIndex: number, pos: number): number;
        setAction(action: number): void;
        offsetLocation(deltaX: number, deltaY: number): void;
        setLocation(x: number, y: number): void;
        getPointerIdBits(): number;
        split(idBits: number): MotionEvent;
        toString(): string;
    }
}
declare module android.view {
    class ViewConfiguration {
        private static SCROLL_BAR_SIZE;
        private static SCROLL_BAR_FADE_DURATION;
        private static SCROLL_BAR_DEFAULT_DELAY;
        private static FADING_EDGE_LENGTH;
        private static PRESSED_STATE_DURATION;
        private static DEFAULT_LONG_PRESS_TIMEOUT;
        private static KEY_REPEAT_DELAY;
        private static GLOBAL_ACTIONS_KEY_TIMEOUT;
        private static TAP_TIMEOUT;
        private static JUMP_TAP_TIMEOUT;
        private static DOUBLE_TAP_TIMEOUT;
        private static DOUBLE_TAP_MIN_TIME;
        private static HOVER_TAP_TIMEOUT;
        private static HOVER_TAP_SLOP;
        private static ZOOM_CONTROLS_TIMEOUT;
        private static EDGE_SLOP;
        private static TOUCH_SLOP;
        private static DOUBLE_TAP_TOUCH_SLOP;
        private static PAGING_TOUCH_SLOP;
        private static DOUBLE_TAP_SLOP;
        private static WINDOW_TOUCH_SLOP;
        private static MINIMUM_FLING_VELOCITY;
        private static MAXIMUM_FLING_VELOCITY;
        private static SCROLL_FRICTION;
        private static OVERSCROLL_DISTANCE;
        private static OVERFLING_DISTANCE;
        static instance: ViewConfiguration;
        static get(): ViewConfiguration;
        mEdgeSlop: number;
        mFadingEdgeLength: number;
        mMinimumFlingVelocity: number;
        mMaximumFlingVelocity: number;
        mScrollbarSize: number;
        mTouchSlop: number;
        mDoubleTapTouchSlop: number;
        mPagingTouchSlop: number;
        mDoubleTapSlop: number;
        mWindowTouchSlop: number;
        mOverscrollDistance: number;
        mOverflingDistance: number;
        getScaledScrollBarSize(): number;
        static getScrollBarFadeDuration(): number;
        static getScrollDefaultDelay(): number;
        getScaledFadingEdgeLength(): number;
        static getPressedStateDuration(): number;
        static getLongPressTimeout(): number;
        static getKeyRepeatDelay(): number;
        static getTapTimeout(): number;
        static getJumpTapTimeout(): number;
        static getDoubleTapTimeout(): number;
        static getDoubleTapMinTime(): number;
        getScaledEdgeSlop(): number;
        getScaledTouchSlop(): number;
        getScaledPagingTouchSlop(): number;
        getScaledDoubleTapSlop(): number;
        getScaledWindowTouchSlop(): number;
        getScaledMinimumFlingVelocity(): number;
        getScaledMaximumFlingVelocity(): number;
        getScaledOverscrollDistance(): number;
        getScaledOverflingDistance(): number;
        static getScrollFriction(): number;
    }
}
declare module android.view {
    import Rect = android.graphics.Rect;
    class TouchDelegate {
        private mDelegateView;
        private mBounds;
        private mSlopBounds;
        private mDelegateTargeted;
        private mSlop;
        constructor(bounds: Rect, delegateView: View);
        onTouchEvent(event: MotionEvent): boolean;
    }
}
declare module android.util {
    class Pools {
        a: Pools.SimplePool<string>;
    }
    module Pools {
        interface Pool<T> {
            acquire(): T;
            release(instance: T): boolean;
        }
        class SimplePool<T> implements Pools.Pool<T> {
            mPool: Array<T>;
            mPoolSize: number;
            constructor(maxPoolSize: number);
            acquire(): T;
            release(instance: T): boolean;
            private isInPool(instance);
        }
        class SynchronizedPool<T> extends SimplePool<T> {
        }
    }
}
declare module android.os {
    class SystemClock {
        static uptimeMillis(): number;
    }
}
declare module android.os {
    import Runnable = java.lang.Runnable;
    class Message {
        what: number;
        arg1: number;
        arg2: number;
        obj: any;
        when: number;
        target: Handler;
        callback: Runnable;
        private static sPool;
        recycle(): void;
        copyFrom(o: Message): void;
        sendToTarget(): void;
        clearForRecycle(): void;
        toString(now?: number): string;
        static obtain(): Message;
        static obtain(orig: Message): Message;
        static obtain(h: Handler, callback: Runnable): Message;
        static obtain(h: Handler, what: number, obj: any): Message;
        static obtain(h: Handler): Message;
        static obtain(h: Handler, what: number): Message;
        static obtain(h: Handler, what: number, arg1: number, arg2: number): Message;
        static obtain(h: Handler, what: number, arg1: number, arg2: number, obj: any): Message;
    }
}
declare module android.os {
    import Runnable = java.lang.Runnable;
    class MessageQueue {
        messages: Map<Message, number>;
        getMessages(h: Handler, r: Runnable, object: any): Array<Message>;
        getMessages(h: Handler, what: number, object: any): Array<Message>;
        hasMessages(h: Handler, r: Runnable, object: any): boolean;
        hasMessages(h: Handler, what: number, object: any): boolean;
        addMessage(handler: Handler, msg: Message, delayHandleID: number): void;
        recycleMessage(handler: Handler, message: Message): void;
        removeMessages(h: Handler, what: number, object: any): any;
        removeMessages(h: Handler, r: Runnable, object: any): any;
        removeCallbacksAndMessages(h: Handler, object: any): void;
    }
}
declare module android.os {
    import Runnable = java.lang.Runnable;
    class Handler {
        mCallback: Handler.Callback;
        mQueue: MessageQueue;
        constructor(mCallback?: Handler.Callback);
        handleMessage(msg: Message): void;
        dispatchMessage(msg: Message): void;
        obtainMessage(): Message;
        obtainMessage(what: number): Message;
        obtainMessage(what: number, obj: any): Message;
        obtainMessage(what: number, arg1: number, arg2: number): Message;
        obtainMessage(what: number, arg1: number, arg2: number, obj: any): Message;
        post(r: Runnable): boolean;
        postAtTime(r: Runnable, uptimeMillis: number): boolean;
        postAtTime(r: Runnable, token: any, uptimeMillis: number): boolean;
        postDelayed(r: Runnable, delayMillis: number): boolean;
        postAtFrontOfQueue(r: Runnable): boolean;
        removeCallbacks(r: Runnable, token?: any): void;
        sendMessage(msg: Message): boolean;
        sendEmptyMessage(what: number): boolean;
        sendEmptyMessageDelayed(what: number, delayMillis: number): boolean;
        sendEmptyMessageAtTime(what: number, uptimeMillis: number): boolean;
        sendMessageDelayed(msg: Message, delayMillis: number): boolean;
        sendMessageAtTime(msg: Message, uptimeMillis: number): boolean;
        sendMessageAtFrontOfQueue(msg: Message): boolean;
        removeMessages(what: number, object?: any): void;
        removeCallbacksAndMessages(token?: any): void;
        hasMessages(what: number, object?: any): boolean;
        private static getPostMessage(r, token?);
    }
    module Handler {
        interface Callback {
            handleMessage(msg: Message): boolean;
        }
    }
}
declare module android.graphics {
    class Color {
        static BLACK: number;
        static DKGRAY: number;
        static GRAY: number;
        static LTGRAY: number;
        static WHITE: number;
        static RED: number;
        static GREEN: number;
        static BLUE: number;
        static YELLOW: number;
        static CYAN: number;
        static MAGENTA: number;
        static TRANSPARENT: number;
        static alpha(color: number): number;
        static red(color: number): number;
        static green(color: number): number;
        static blue(color: number): number;
        static rgb(red: number, green: number, blue: number): number;
        static argb(alpha: number, red: number, green: number, blue: number): number;
        static parseColor(colorString: string): number;
        static getHtmlColor(color: string): number;
        static sColorNameMap: Map<String, number>;
    }
}
declare module android.graphics {
    import Rect = android.graphics.Rect;
    class Canvas {
        private static FullRect;
        private mCanvasElement;
        private _mCanvasContent;
        private _saveCount;
        mCurrentClip: Rect;
        private shouldDoRectBeforeRestoreMap;
        private mClipStateMap;
        private static sPool;
        constructor(canvasElement: HTMLCanvasElement);
        constructor(width: number, height: number);
        private init();
        canvasElement: HTMLCanvasElement;
        getHeight(): number;
        getWidth(): number;
        translate(dx: number, dy: number): void;
        scale(sx: number, sy: number, px?: number, py?: number): void;
        rotate(degrees: number, px?: number, py?: number): void;
        drawRGB(r: number, g: number, b: number): void;
        drawARGB(a: number, r: number, g: number, b: number): void;
        drawColor(color: number): void;
        clearColor(): void;
        save(): number;
        restore(): void;
        restoreToCount(saveCount: number): void;
        getSaveCount(): number;
        private fullRectForClip();
        clipRect(rect: Rect): boolean;
        clipRect(left: number, top: number, right: number, bottom: number): boolean;
        getClipBounds(bounds?: Rect): Rect;
        quickReject(rect: Rect): boolean;
        quickReject(left: number, top: number, right: number, bottom: number): boolean;
        drawCanvas(canvas: Canvas, offsetX: number, offsetY: number, width?: number, height?: number, canvasOffsetX?: number, canvasOffsetY?: number, canvasImageWidth?: number, canvasImageHeight?: number): void;
    }
}
declare module android.view {
    import Drawable = android.graphics.drawable.Drawable;
    import Matrix = android.graphics.Matrix;
    import Runnable = java.lang.Runnable;
    import ViewParent = android.view.ViewParent;
    import Handler = android.os.Handler;
    import Rect = android.graphics.Rect;
    import Canvas = android.graphics.Canvas;
    import CopyOnWriteArrayList = java.lang.util.concurrent.CopyOnWriteArrayList;
    class View implements Drawable.Callback {
        private static DBG;
        static VIEW_LOG_TAG: string;
        static PFLAG_WANTS_FOCUS: number;
        static PFLAG_FOCUSED: number;
        static PFLAG_SELECTED: number;
        static PFLAG_IS_ROOT_NAMESPACE: number;
        static PFLAG_HAS_BOUNDS: number;
        static PFLAG_DRAWN: number;
        static PFLAG_DRAW_ANIMATION: number;
        static PFLAG_SKIP_DRAW: number;
        static PFLAG_ONLY_DRAWS_BACKGROUND: number;
        static PFLAG_REQUEST_TRANSPARENT_REGIONS: number;
        static PFLAG_DRAWABLE_STATE_DIRTY: number;
        static PFLAG_MEASURED_DIMENSION_SET: number;
        static PFLAG_FORCE_LAYOUT: number;
        static PFLAG_LAYOUT_REQUIRED: number;
        static PFLAG_PRESSED: number;
        static PFLAG_DRAWING_CACHE_VALID: number;
        static PFLAG_ANIMATION_STARTED: number;
        static PFLAG_ALPHA_SET: number;
        static PFLAG_SCROLL_CONTAINER: number;
        static PFLAG_SCROLL_CONTAINER_ADDED: number;
        static PFLAG_DIRTY: number;
        static PFLAG_DIRTY_OPAQUE: number;
        static PFLAG_DIRTY_MASK: number;
        static PFLAG_OPAQUE_BACKGROUND: number;
        static PFLAG_OPAQUE_SCROLLBARS: number;
        static PFLAG_OPAQUE_MASK: number;
        static PFLAG_PREPRESSED: number;
        static PFLAG_CANCEL_NEXT_UP_EVENT: number;
        static PFLAG_AWAKEN_SCROLL_BARS_ON_ATTACH: number;
        static PFLAG_HOVERED: number;
        static PFLAG_PIVOT_EXPLICITLY_SET: number;
        static PFLAG_ACTIVATED: number;
        static PFLAG_INVALIDATED: number;
        static PFLAG2_VIEW_QUICK_REJECTED: number;
        static PFLAG3_VIEW_IS_ANIMATING_TRANSFORM: number;
        static PFLAG3_VIEW_IS_ANIMATING_ALPHA: number;
        static PFLAG3_IS_LAID_OUT: number;
        static PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT: number;
        static PFLAG3_CALLED_SUPER: number;
        private static NOT_FOCUSABLE;
        private static FOCUSABLE;
        private static FOCUSABLE_MASK;
        static OVER_SCROLL_ALWAYS: number;
        static OVER_SCROLL_IF_CONTENT_SCROLLS: number;
        static OVER_SCROLL_NEVER: number;
        static MEASURED_SIZE_MASK: number;
        static MEASURED_STATE_MASK: number;
        static MEASURED_HEIGHT_STATE_SHIFT: number;
        static MEASURED_STATE_TOO_SMALL: number;
        static VISIBILITY_MASK: number;
        static VISIBLE: number;
        static INVISIBLE: number;
        static GONE: number;
        static ENABLED: number;
        static DISABLED: number;
        static ENABLED_MASK: number;
        static WILL_NOT_DRAW: number;
        static DRAW_MASK: number;
        static FOCUSABLES_ALL: number;
        static FOCUSABLES_TOUCH_MODE: number;
        static FOCUS_BACKWARD: number;
        static FOCUS_FORWARD: number;
        static FOCUS_LEFT: number;
        static FOCUS_UP: number;
        static FOCUS_RIGHT: number;
        static FOCUS_DOWN: number;
        static CLICKABLE: number;
        static DRAWING_CACHE_ENABLED: number;
        static WILL_NOT_CACHE_DRAWING: number;
        private static FOCUSABLE_IN_TOUCH_MODE;
        static LONG_CLICKABLE: number;
        static DUPLICATE_PARENT_STATE: number;
        static LAYER_TYPE_NONE: number;
        static LAYER_TYPE_SOFTWARE: number;
        mPrivateFlags: number;
        private mPrivateFlags2;
        private mPrivateFlags3;
        private mOldWidthMeasureSpec;
        private mOldHeightMeasureSpec;
        private mMeasuredWidth;
        private mMeasuredHeight;
        private mBackground;
        private mBackgroundSizeChanged;
        private mPendingCheckForLongPress;
        private mPendingCheckForTap;
        private mPerformClick;
        private mUnsetPressedState;
        private mHasPerformedLongPress;
        mMinWidth: number;
        mMinHeight: number;
        private mTouchDelegate;
        mTouchSlop: number;
        private mVerticalScrollFactor;
        private mOverScrollMode;
        mParent: ViewParent;
        private mMeasureCache;
        mAttachInfo: View.AttachInfo;
        mLayoutParams: ViewGroup.LayoutParams;
        mViewFlags: number;
        mLayerType: number;
        private mOverlay;
        private mWindowAttachCount;
        private mListenerInfo;
        private mClipBounds;
        private mLastIsOpaque;
        mLeft: number;
        mRight: number;
        mTop: number;
        mBottom: number;
        private _mScrollX;
        private _mScrollY;
        mScrollX: number;
        mScrollY: number;
        mPaddingLeft: number;
        mPaddingRight: number;
        mPaddingTop: number;
        mPaddingBottom: number;
        constructor();
        getWidth(): number;
        getHeight(): number;
        getTop(): number;
        setTop(top: number): void;
        getBottom(): number;
        setBottom(bottom: number): void;
        getLeft(): number;
        setLeft(left: number): void;
        getRight(): number;
        setRight(right: number): void;
        getPaddingLeft(): number;
        getPaddingTop(): number;
        getPaddingRight(): number;
        getPaddingBottom(): number;
        setPadding(left: number, top: number, right: number, bottom: number): void;
        setScrollX(value: number): void;
        setScrollY(value: number): void;
        getScrollX(): number;
        getScrollY(): number;
        getFinalAlpha(): number;
        getMatrix(): Matrix;
        hasIdentityMatrix(): boolean;
        transformRect(rect: Rect): void;
        pointInView(localX: number, localY: number, slop?: number): boolean;
        getHandler(): Handler;
        getViewRootImpl(): ViewRootImpl;
        post(action: Runnable): boolean;
        postDelayed(action: Runnable, delayMillis: number): boolean;
        postOnAnimation(action: Runnable): boolean;
        postOnAnimationDelayed(action: Runnable, delayMillis: number): boolean;
        removeCallbacks(action: Runnable): boolean;
        getParent(): ViewParent;
        setFlags(flags: number, mask: number): void;
        bringToFront(): void;
        onScrollChanged(l: number, t: number, oldl: number, oldt: number): void;
        onSizeChanged(w: number, h: number, oldw: number, oldh: number): void;
        getListenerInfo(): View.ListenerInfo;
        isFocusable(): boolean;
        isFocusableInTouchMode(): boolean;
        hasFocus(): boolean;
        hasFocusable(): boolean;
        clearFocus(): void;
        findFocus(): View;
        isFocused(): boolean;
        getVisibility(): number;
        setVisibility(visibility: number): void;
        dispatchVisibilityChanged(changedView: View, visibility: number): void;
        onVisibilityChanged(changedView: View, visibility: number): void;
        isEnabled(): boolean;
        setEnabled(enabled: boolean): void;
        resetPressedState(): void;
        dispatchTouchEvent(event: MotionEvent): boolean;
        onFilterTouchEventForSecurity(event: MotionEvent): boolean;
        onTouchEvent(event: MotionEvent): boolean;
        isInScrollingContainer(): boolean;
        private removeLongPressCallback();
        private removePerformClickCallback();
        private removeUnsetPressCallback();
        private removeTapCallback();
        cancelLongPress(): void;
        setTouchDelegate(delegate: TouchDelegate): void;
        getTouchDelegate(): TouchDelegate;
        setOnLongClickListener(l: View.OnLongClickListener): void;
        performClick(): boolean;
        callOnClick(): boolean;
        performLongClick(): boolean;
        private checkForLongClick(delayOffset?);
        setOnTouchListener(l: View.OnTouchListener): void;
        isClickable(): boolean;
        setClickable(clickable: boolean): void;
        isLongClickable(): boolean;
        setLongClickable(longClickable: boolean): void;
        setPressed(pressed: boolean): void;
        isPressed(): boolean;
        isLayoutRtl(): boolean;
        getBaseline(): number;
        isLayoutRequested(): boolean;
        getLayoutParams(): ViewGroup.LayoutParams;
        setLayoutParams(params: ViewGroup.LayoutParams): void;
        requestLayout(): void;
        forceLayout(): void;
        isLaidOut(): boolean;
        layout(l: number, t: number, r: number, b: number): void;
        onLayout(changed: boolean, left: number, top: number, right: number, bottom: number): void;
        private setFrame(left, top, right, bottom);
        private sizeChange(newWidth, newHeight, oldWidth, oldHeight);
        getDrawingRect(outRect: Rect): void;
        getMeasuredWidth(): number;
        getMeasuredWidthAndState(): number;
        getMeasuredHeight(): number;
        getMeasuredHeightAndState(): number;
        getMeasuredState(): number;
        measure(widthMeasureSpec: number, heightMeasureSpec: number): void;
        onMeasure(widthMeasureSpec: any, heightMeasureSpec: any): void;
        setMeasuredDimension(measuredWidth: any, measuredHeight: any): void;
        static combineMeasuredStates(curState: any, newState: any): number;
        static resolveSize(size: any, measureSpec: any): number;
        static resolveSizeAndState(size: any, measureSpec: any, childMeasuredState: any): number;
        static getDefaultSize(size: any, measureSpec: any): any;
        getSuggestedMinimumHeight(): number;
        getSuggestedMinimumWidth(): number;
        getMinimumHeight(): number;
        setMinimumHeight(minHeight: any): void;
        getMinimumWidth(): number;
        setMinimumWidth(minWidth: any): void;
        private _invalidateRect(l, t, r, b);
        private _invalidateCache(invalidateCache?);
        invalidate(): any;
        invalidate(invalidateCache: boolean): any;
        invalidate(dirty: Rect): any;
        invalidate(l: number, t: number, r: number, b: number): any;
        invalidateViewProperty(invalidateParent: boolean, forceRedraw: boolean): void;
        invalidateParentCaches(): void;
        invalidateParentIfNeeded(): void;
        postInvalidate(l?: number, t?: number, r?: number, b?: number): void;
        postInvalidateDelayed(delayMilliseconds: number, left?: number, top?: number, right?: number, bottom?: number): void;
        postInvalidateOnAnimation(left?: number, top?: number, right?: number, bottom?: number): void;
        private skipInvalidate();
        isOpaque(): boolean;
        private computeOpaqueFlags();
        getLayerType(): number;
        setClipBounds(clipBounds: Rect): void;
        getClipBounds(): Rect;
        getDrawingTime(): number;
        drawFromParent(canvas: Canvas, parent: ViewGroup, drawingTime: number): boolean;
        draw(canvas: Canvas): void;
        onDraw(canvas: Canvas): void;
        dispatchDraw(canvas: Canvas): void;
        destroyDrawingCache(): void;
        setWillNotDraw(willNotDraw: boolean): void;
        willNotDraw(): boolean;
        setWillNotCacheDrawing(willNotCacheDrawing: boolean): void;
        willNotCacheDrawing(): boolean;
        jumpDrawablesToCurrentState(): void;
        invalidateDrawable(drawable: Drawable): void;
        scheduleDrawable(who: Drawable, what: Runnable, when: number): void;
        unscheduleDrawable(who: Drawable, what?: Runnable): void;
        verifyDrawable(who: Drawable): boolean;
        drawableStateChanged(): void;
        refreshDrawableState(): void;
        getDrawableState(): Array<number>;
        getAnimation(): any;
        computeHorizontalScrollRange(): number;
        computeHorizontalScrollOffset(): number;
        computeHorizontalScrollExtent(): number;
        computeVerticalScrollRange(): number;
        computeVerticalScrollOffset(): number;
        computeVerticalScrollExtent(): number;
        canScrollHorizontally(direction: number): boolean;
        canScrollVertically(direction: number): boolean;
        overScrollBy(deltaX: number, deltaY: number, scrollX: number, scrollY: number, scrollRangeX: number, scrollRangeY: number, maxOverScrollX: number, maxOverScrollY: number, isTouchEvent: boolean): boolean;
        onOverScrolled(scrollX: number, scrollY: number, clampedX: boolean, clampedY: boolean): void;
        getOverScrollMode(): number;
        setOverScrollMode(overScrollMode: number): void;
        getVerticalScrollFactor(): number;
        getHorizontalScrollFactor(): number;
        computeScroll(): void;
        scrollTo(x: number, y: number): void;
        scrollBy(x: number, y: number): void;
        awakenScrollBars(startDelay?: number, invalidate?: boolean): boolean;
        getVerticalFadingEdgeLength(): number;
        setFadingEdgeLength(length: number): void;
        getHorizontalFadingEdgeLength(): number;
        getVerticalScrollbarWidth(): number;
        getHorizontalScrollbarHeight(): number;
        assignParent(parent: ViewParent): void;
        onFinishInflate(): void;
        dispatchAttachedToWindow(info: View.AttachInfo, visibility: number): void;
        onAttachedToWindow(): void;
        dispatchDetachedFromWindow(): void;
        onDetachedFromWindow(): void;
        cleanupDraw(): void;
        debug(depth?: number): void;
        toString(): String;
        getRootView(): View;
        findViewById(id: string): View;
        _bindElement: HTMLElement;
        bindElement: HTMLElement;
        _bindScrollContent: HTMLElement;
        bindScrollContent: HTMLElement;
        initBindElement(bindElement?: HTMLElement): void;
        syncBoundToElement(): void;
        tagName(): string;
        static inflate(domtree: HTMLElement): View;
    }
    module View {
        class MeasureSpec {
            static MODE_SHIFT: number;
            static MODE_MASK: number;
            static UNSPECIFIED: number;
            static EXACTLY: number;
            static AT_MOST: number;
            static makeMeasureSpec(size: any, mode: any): number;
            static getMode(measureSpec: any): number;
            static getSize(measureSpec: any): number;
            static adjust(measureSpec: any, delta: any): number;
            static toString(measureSpec: any): string;
        }
        class AttachInfo {
            mRootView: View;
            mDrawingTime: number;
            mViewRootImpl: ViewRootImpl;
            mHandler: Handler;
            mTmpInvalRect: Rect;
            mTmpTransformRect: Rect;
            mScrollContainers: Set<View>;
            mViewScrollChanged: boolean;
            mTreeObserver: ViewTreeObserver;
            mViewRequestingLayout: View;
            mViewVisibilityChanged: boolean;
            mInvalidateChildLocation: number[];
            mIgnoreDirtyState: boolean;
            mSetIgnoreDirtyState: boolean;
            constructor(mViewRootImpl: ViewRootImpl, mHandler: Handler);
        }
        class ListenerInfo {
            mOnAttachStateChangeListeners: CopyOnWriteArrayList<OnAttachStateChangeListener>;
            mOnLayoutChangeListeners: Array<OnLayoutChangeListener>;
            mOnClickListener: OnClickListener;
            mOnLongClickListener: OnLongClickListener;
            mOnTouchListener: OnTouchListener;
        }
        interface OnAttachStateChangeListener {
            onViewAttachedToWindow(v: View): any;
            onViewDetachedFromWindow(v: View): any;
        }
        interface OnLayoutChangeListener {
            onLayoutChange(v: View, left: number, top: number, right: number, bottom: number, oldLeft: number, oldTop: number, oldRight: number, oldBottom: number): any;
        }
        interface OnClickListener {
            onClick(v: View): any;
        }
        interface OnLongClickListener {
            onLongClick(v: View): boolean;
        }
        interface OnTouchListener {
            onTouch(v: View, event: MotionEvent): any;
        }
    }
    module View.AttachInfo {
        class InvalidateInfo {
            private static POOL_LIMIT;
            private static sPool;
            target: View;
            left: number;
            top: number;
            right: number;
            bottom: number;
            static obtain(): InvalidateInfo;
            recycle(): void;
        }
    }
}
declare module android.graphics {
    class Point {
        x: number;
        y: number;
        constructor();
        constructor(x: number, y: number);
        constructor(src: Point);
        set(x: number, y: number): void;
        negate(): void;
        offset(dx: number, dy: number): void;
        equals(x: number, y: number): boolean;
        equals(o: any): boolean;
        toString(): String;
    }
}
declare module android.view {
    import View = android.view.View;
    import Rect = android.graphics.Rect;
    import Point = android.graphics.Point;
    interface ViewParent {
        requestLayout(): any;
        isLayoutRequested(): boolean;
        invalidateChild(child: View, r: Rect): any;
        invalidateChildInParent(location: Array<number>, r: Rect): ViewParent;
        getParent(): ViewParent;
        requestChildFocus(child: View, focused: View): any;
        clearChildFocus(child: View): any;
        getChildVisibleRect(child: View, r: Rect, offset: Point): boolean;
        focusSearch(v: View, direction: number): View;
        bringChildToFront(child: View): any;
        focusableViewAvailable(v: View): any;
        childDrawableStateChanged(child: View): any;
        requestDisallowInterceptTouchEvent(disallowIntercept: boolean): any;
        childHasTransientStateChanged(child: View, hasTransientState: boolean): any;
    }
}
declare module android.view {
    import Rect = android.graphics.Rect;
    import Canvas = android.graphics.Canvas;
    class Surface {
        private mCanvasElement;
        private mLockedCanvasMap;
        constructor(canvasElement: HTMLCanvasElement);
        lockCanvas(dirty: Rect): Canvas;
        unlockCanvasAndPost(canvas: Canvas): void;
    }
}
declare module java.lang {
    class System {
        static out: {
            println(any?: any): void;
            print(any: any): void;
        };
        static currentTimeMillis(): number;
    }
}
declare module android.view {
    import ViewParent = android.view.ViewParent;
    import View = android.view.View;
    import Rect = android.graphics.Rect;
    import Point = android.graphics.Point;
    import Handler = android.os.Handler;
    import Runnable = java.lang.Runnable;
    class ViewRootImpl implements ViewParent {
        static TAG: string;
        private static DBG;
        static LOCAL_LOGV: boolean;
        static DEBUG_DRAW: boolean;
        static DEBUG_LAYOUT: boolean;
        static DEBUG_INPUT_RESIZE: boolean;
        static DEBUG_ORIENTATION: boolean;
        static DEBUG_CONFIGURATION: boolean;
        static DEBUG_FPS: boolean;
        private mView;
        private mViewVisibility;
        private mWidth;
        private mHeight;
        private mDirty;
        private mAttachInfo;
        private mTempRect;
        private mVisRect;
        private mTraversalScheduled;
        private mWillDrawSoon;
        private mIsInTraversal;
        private mLayoutRequested;
        private mFirst;
        private mFullRedrawNeeded;
        private mIsDrawing;
        private mAdded;
        mWinFrame: Rect;
        private mInLayout;
        private mLayoutRequesters;
        private mHandlingLayoutInLayoutRequest;
        private mRemoved;
        private mHandler;
        private mFpsStartTime;
        private mFpsPrevTime;
        private mFpsNumFrames;
        private mSurface;
        constructor();
        initSurface(canvasElement: HTMLCanvasElement): void;
        setView(view: View): void;
        getView(): View;
        getHostVisibility(): number;
        private mTraversalRunnable;
        private scheduleTraversals();
        private unscheduleTraversals();
        doTraversal(): void;
        private measureHierarchy(host, lp, desiredWindowWidth, desiredWindowHeight);
        private static getRootMeasureSpec(windowSize, rootDimension);
        private performTraversals();
        private performLayout(lp, desiredWindowWidth, desiredWindowHeight);
        private getValidLayoutRequesters(layoutRequesters, secondLayoutRequests);
        private performMeasure(childWidthMeasureSpec, childHeightMeasureSpec);
        isInLayout(): boolean;
        requestLayoutDuringLayout(view: View): boolean;
        trackFPS(): void;
        private performDraw();
        private draw(fullRedrawNeeded);
        private drawSoftware();
        isLayoutRequested(): boolean;
        private mInvalidateOnAnimationRunnable;
        dispatchInvalidateDelayed(view: View, delayMilliseconds: number): void;
        dispatchInvalidateRectDelayed(info: View.AttachInfo.InvalidateInfo, delayMilliseconds: number): void;
        dispatchInvalidateOnAnimation(view: View): void;
        dispatchInvalidateRectOnAnimation(info: View.AttachInfo.InvalidateInfo): void;
        cancelInvalidate(view: View): void;
        getParent(): ViewParent;
        requestLayout(): void;
        invalidate(): void;
        invalidateWorld(view: View): void;
        invalidateChild(child: View, dirty: Rect): void;
        invalidateChildInParent(location: Array<number>, dirty: Rect): ViewParent;
        requestChildFocus(child: View, focused: View): void;
        clearChildFocus(child: View): void;
        getChildVisibleRect(child: View, r: Rect, offset: Point): boolean;
        focusSearch(v: View, direction: number): View;
        bringChildToFront(child: View): void;
        focusableViewAvailable(v: View): void;
        childDrawableStateChanged(child: View): void;
        requestDisallowInterceptTouchEvent(disallowIntercept: boolean): void;
        childHasTransientStateChanged(child: View, hasTransientState: boolean): void;
        private static RunQueueInstance;
        private mRunQueue;
        static getRunQueue(viewRoot?: ViewRootImpl): ViewRootImpl.RunQueue;
    }
    module ViewRootImpl {
        class RunQueue {
            private mActions;
            post(action: Runnable): void;
            postDelayed(action: Runnable, delayMillis: number): void;
            removeCallbacks(action: Runnable): void;
            executeActions(handler: Handler): void;
        }
    }
}
declare module android.view {
    import Canvas = android.graphics.Canvas;
    import Point = android.graphics.Point;
    import Rect = android.graphics.Rect;
    class ViewGroup extends View implements ViewParent {
        static FLAG_CLIP_CHILDREN: number;
        static FLAG_CLIP_TO_PADDING: number;
        static FLAG_INVALIDATE_REQUIRED: number;
        static FLAG_RUN_ANIMATION: number;
        static FLAG_ANIMATION_DONE: number;
        static FLAG_PADDING_NOT_NULL: number;
        static FLAG_ANIMATION_CACHE: number;
        static FLAG_OPTIMIZE_INVALIDATE: number;
        static FLAG_CLEAR_TRANSFORMATION: number;
        static FLAG_NOTIFY_ANIMATION_LISTENER: number;
        static FLAG_USE_CHILD_DRAWING_ORDER: number;
        static FLAG_SUPPORT_STATIC_TRANSFORMATIONS: number;
        static FLAG_ALPHA_LOWER_THAN_ONE: number;
        static FLAG_ADD_STATES_FROM_CHILDREN: number;
        static FLAG_ALWAYS_DRAWN_WITH_CACHE: number;
        static FLAG_CHILDREN_DRAWN_WITH_CACHE: number;
        static FLAG_NOTIFY_CHILDREN_ON_DRAWABLE_STATE_CHANGE: number;
        static FLAG_MASK_FOCUSABILITY: number;
        static FOCUS_BEFORE_DESCENDANTS: number;
        static FOCUS_AFTER_DESCENDANTS: number;
        static FOCUS_BLOCK_DESCENDANTS: number;
        static FLAG_DISALLOW_INTERCEPT: number;
        static FLAG_SPLIT_MOTION_EVENTS: number;
        static FLAG_PREVENT_DISPATCH_ATTACHED_TO_WINDOW: number;
        static FLAG_LAYOUT_MODE_WAS_EXPLICITLY_SET: number;
        static LAYOUT_MODE_UNDEFINED: number;
        static LAYOUT_MODE_CLIP_BOUNDS: number;
        static LAYOUT_MODE_DEFAULT: number;
        static CLIP_TO_PADDING_MASK: number;
        mOnHierarchyChangeListener: ViewGroup.OnHierarchyChangeListener;
        private mFirstTouchTarget;
        private mLastTouchDownTime;
        private mLastTouchDownIndex;
        private mLastTouchDownX;
        private mLastTouchDownY;
        mGroupFlags: number;
        mLayoutMode: number;
        mChildren: Array<View>;
        mChildrenCount: number;
        mSuppressLayout: boolean;
        private mLayoutCalledWhileSuppressed;
        constructor();
        private initViewGroup();
        addView(view: View): any;
        addView(view: View, index: number): any;
        addView(view: View, params: ViewGroup.LayoutParams): any;
        addView(view: View, index: number, params: ViewGroup.LayoutParams): any;
        addView(view: View, width: number, height: number): any;
        addView(...args: any[]): any;
        checkLayoutParams(p: ViewGroup.LayoutParams): boolean;
        setOnHierarchyChangeListener(listener: ViewGroup.OnHierarchyChangeListener): void;
        onViewAdded(child: View): void;
        onViewRemoved(child: View): void;
        clearCachedLayoutMode(): void;
        addViewInLayout(child: View, index: number, params: ViewGroup.LayoutParams, preventRequestLayout?: boolean): boolean;
        cleanupLayoutState(child: View): void;
        addViewInner(child: View, index: number, params: ViewGroup.LayoutParams, preventRequestLayout: boolean): void;
        private addInArray(child, index);
        private addToBindElement(childElement, insertBeforeElement);
        private removeFromArray(index, count?);
        removeView(view: View): void;
        removeViewInLayout(view: View): void;
        removeViewsInLayout(start: number, count: number): void;
        removeViewAt(index: number): void;
        removeViews(start: number, count: number): void;
        private removeViewInternal(view);
        private removeViewsInternal(start, count);
        removeAllViews(): void;
        removeAllViewsInLayout(): void;
        indexOfChild(child: View): number;
        getChildCount(): number;
        getChildAt(index: number): View;
        bringChildToFront(child: View): void;
        hasBooleanFlag(flag: number): boolean;
        setBooleanFlag(flag: number, value: boolean): void;
        onInterceptTouchEvent(ev: MotionEvent): boolean;
        dispatchTouchEvent(ev: MotionEvent): boolean;
        private resetTouchState();
        private static resetCancelNextUpFlag(view);
        private clearTouchTargets();
        private cancelAndClearTouchTargets(event);
        private getTouchTarget(child);
        private addTouchTarget(child, pointerIdBits);
        private removePointersFromTouchTargets(pointerIdBits);
        private cancelTouchTarget(view);
        private static canViewReceivePointerEvents(child);
        isTransformedTouchPointInView(x: number, y: number, child: View, outLocalPoint: Point): boolean;
        private dispatchTransformedTouchEvent(event, cancel, child, desiredPointerIdBits);
        isChildrenDrawingOrderEnabled(): boolean;
        setChildrenDrawingOrderEnabled(enabled: boolean): void;
        getChildDrawingOrder(childCount: number, i: number): number;
        generateLayoutParams(p: ViewGroup.LayoutParams): ViewGroup.LayoutParams;
        generateDefaultLayoutParams(): ViewGroup.LayoutParams;
        measureChildren(widthMeasureSpec: number, heightMeasureSpec: number): void;
        measureChild(child: View, parentWidthMeasureSpec: number, parentHeightMeasureSpec: number): void;
        measureChildWithMargins(child: View, parentWidthMeasureSpec: number, widthUsed: number, parentHeightMeasureSpec: number, heightUsed: number): void;
        static getChildMeasureSpec(spec: number, padding: number, childDimension: number): number;
        dispatchAttachedToWindow(info: View.AttachInfo, visibility: number): void;
        onAttachedToWindow(): void;
        onDetachedFromWindow(): void;
        dispatchDetachedFromWindow(): void;
        dispatchVisibilityChanged(changedView: View, visibility: number): void;
        offsetDescendantRectToMyCoords(descendant: View, rect: Rect): void;
        offsetRectIntoDescendantCoords(descendant: View, rect: Rect): void;
        offsetRectBetweenParentAndChild(descendant: View, rect: Rect, offsetFromChildToParent: boolean, clipToBounds: boolean): void;
        offsetChildrenTopAndBottom(offset: number): void;
        suppressLayout(suppress: boolean): void;
        isLayoutSuppressed(): boolean;
        layout(l: number, t: number, r: number, b: number): void;
        getChildVisibleRect(child: View, r: Rect, offset: Point): boolean;
        dispatchDraw(canvas: Canvas): void;
        drawChild(canvas: Canvas, child: View, drawingTime: number): boolean;
        getClipChildren(): boolean;
        setClipChildren(clipChildren: boolean): void;
        setClipToPadding(clipToPadding: boolean): void;
        invalidateChild(child: View, dirty: Rect): void;
        invalidateChildInParent(location: Array<number>, dirty: Rect): ViewParent;
        invalidateChildFast(child: View, dirty: Rect): void;
        invalidateChildInParentFast(left: number, top: number, dirty: Rect): ViewParent;
        requestTransparentRegion(child: android.view.View): void;
        requestChildFocus(child: android.view.View, focused: android.view.View): void;
        recomputeViewAttributes(child: android.view.View): void;
        clearChildFocus(child: android.view.View): void;
        focusSearch(v: android.view.View, direction: number): android.view.View;
        focusableViewAvailable(v: android.view.View): void;
        childDrawableStateChanged(child: android.view.View): void;
        requestDisallowInterceptTouchEvent(disallowIntercept: boolean): void;
        requestChildRectangleOnScreen(child: android.view.View, rectangle: android.graphics.Rect, immediate: boolean): boolean;
        childHasTransientStateChanged(child: android.view.View, hasTransientState: boolean): void;
        shouldDelayChildPressedState(): boolean;
        onSetLayoutParams(child: View, layoutParams: ViewGroup.LayoutParams): void;
    }
    module ViewGroup {
        class LayoutParams {
            static FILL_PARENT: number;
            static MATCH_PARENT: number;
            static WRAP_CONTENT: number;
            width: number;
            height: number;
            constructor();
            constructor(src: LayoutParams);
            constructor(width: number, height: number);
        }
        class MarginLayoutParams extends LayoutParams {
            leftMargin: number;
            topMargin: number;
            rightMargin: number;
            bottomMargin: number;
            constructor();
            constructor(src: LayoutParams);
            constructor(width: number, height: number);
            setMargins(left: number, top: number, right: number, bottom: number): void;
        }
        interface OnHierarchyChangeListener {
            onChildViewAdded(parent: View, child: View): any;
            onChildViewRemoved(parent: View, child: View): any;
        }
    }
}
declare module android.view {
    import Drawable = android.graphics.drawable.Drawable;
    class ViewOverlay {
        mOverlayViewGroup: ViewOverlay.OverlayViewGroup;
        constructor(hostView: View);
        getOverlayView(): ViewGroup;
        add(drawable: Drawable): void;
        remove(drawable: Drawable): void;
        clear(): void;
        isEmpty(): boolean;
    }
    module ViewOverlay {
        class OverlayViewGroup extends ViewGroup {
            mHostView: View;
            mDrawables: Set<Drawable>;
            constructor(hostView: View);
            private addDrawable(drawable);
            addView(child: View): void;
            add(drawable: Drawable): any;
            add(child: View): any;
            clear(): void;
            isEmpty(): boolean;
        }
    }
}
declare module android.view {
    class Gravity {
        static NO_GRAVITY: number;
        static AXIS_SPECIFIED: number;
        static AXIS_PULL_BEFORE: number;
        static AXIS_PULL_AFTER: number;
        static AXIS_CLIP: number;
        static AXIS_X_SHIFT: number;
        static AXIS_Y_SHIFT: number;
        static TOP: number;
        static BOTTOM: number;
        static LEFT: number;
        static RIGHT: number;
        static CENTER_VERTICAL: number;
        static FILL_VERTICAL: number;
        static CENTER_HORIZONTAL: number;
        static FILL_HORIZONTAL: number;
        static CENTER: number;
        static FILL: number;
        static CLIP_VERTICAL: number;
        static CLIP_HORIZONTAL: number;
        static HORIZONTAL_GRAVITY_MASK: number;
        static VERTICAL_GRAVITY_MASK: number;
        static DISPLAY_CLIP_VERTICAL: number;
        static DISPLAY_CLIP_HORIZONTAL: number;
    }
}
declare module android.widget {
    import ViewGroup = android.view.ViewGroup;
    import Drawable = android.graphics.drawable.Drawable;
    class FrameLayout extends ViewGroup {
        static DEFAULT_CHILD_GRAVITY: number;
        mMeasureAllChildren: boolean;
        mForeground: Drawable;
        private mForegroundPaddingLeft;
        private mForegroundPaddingTop;
        private mForegroundPaddingRight;
        private mForegroundPaddingBottom;
        private mSelfBounds;
        private mOverlayBounds;
        private mForegroundGravity;
        mForegroundInPadding: boolean;
        mForegroundBoundsChanged: boolean;
        private mMatchParentChildren;
        getForegroundGravity(): number;
        setForegroundGravity(foregroundGravity: number): void;
        verifyDrawable(who: Drawable): boolean;
        jumpDrawablesToCurrentState(): void;
        drawableStateChanged(): void;
        generateDefaultLayoutParams(): FrameLayout.LayoutParams;
        setForeground(drawable: Drawable): void;
        getForeground(): Drawable;
        getPaddingLeftWithForeground(): number;
        getPaddingRightWithForeground(): number;
        getPaddingTopWithForeground(): number;
        getPaddingBottomWithForeground(): number;
        onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
        onLayout(changed: boolean, left: number, top: number, right: number, bottom: number): void;
        layoutChildren(left: number, top: number, right: number, bottom: number, forceLeftGravity: boolean): void;
        onSizeChanged(w: number, h: number, oldw: number, oldh: number): void;
        setMeasureAllChildren(measureAll: boolean): void;
        getMeasureAllChildren(): boolean;
        shouldDelayChildPressedState(): boolean;
    }
    module FrameLayout {
        class LayoutParams extends ViewGroup.MarginLayoutParams {
            gravity: number;
            constructor();
            constructor(source: ViewGroup.LayoutParams);
            constructor(width: number, height: number, gravity?: number);
        }
    }
}
declare module runtime {
    import View = android.view.View;
    class AndroidUI {
        element: HTMLElement;
        private canvas;
        private viewRootImpl;
        private rootLayout;
        private rootStyleElement;
        constructor(element: HTMLElement);
        private init();
        private initInflateView();
        private initRootElementStyle();
        private initCanvasStyle();
        private initTouch();
        private initBindElementStyle();
        private tryStartLayoutAfterInit();
        notifySizeChange(width: number, height: number): void;
        setContentView(view: View): void;
        addContentView(view: View): void;
        findViewById(id: string): View;
    }
}
declare module android.app {
    import View = android.view.View;
    class Activity extends HTMLDivElement {
        private AndroidUI;
        onCreate(): void;
        createdCallback(): void;
        attachedCallback(): void;
        detachedCallback(): void;
        attributeChangedCallback(attributeName: string, oldVal: string, newVal: string): void;
        setContentView(view: View): void;
        addContentView(view: View): void;
        findViewById(id: string): View;
        static registerCustomElement(): void;
    }
}
declare module android.view.animation {
    interface Interpolator {
        getInterpolation(input: number): number;
    }
}
declare module android.widget {
    import Interpolator = android.view.animation.Interpolator;
    class OverScroller {
        private mMode;
        private mScrollerX;
        private mScrollerY;
        private mInterpolator;
        private mFlywheel;
        static DEFAULT_DURATION: number;
        static SCROLL_MODE: number;
        static FLING_MODE: number;
        constructor(interpolator?: Interpolator, flywheel?: boolean);
        setFriction(friction: number): void;
        isFinished(): boolean;
        forceFinished(finished: boolean): void;
        getCurrX(): number;
        getCurrY(): number;
        getCurrVelocity(): number;
        getStartX(): number;
        getStartY(): number;
        getFinalX(): number;
        getFinalY(): number;
        computeScrollOffset(): boolean;
        startScroll(startX: number, startY: number, dx: number, dy: number, duration?: number): void;
        springBack(startX: number, startY: number, minX: number, maxX: number, minY: number, maxY: number): boolean;
        fling(startX: number, startY: number, velocityX: number, velocityY: number, minX: number, maxX: number, minY: number, maxY: number, overX?: number, overY?: number): void;
        notifyHorizontalEdgeReached(startX: number, finalX: number, overX: number): void;
        notifyVerticalEdgeReached(startY: number, finalY: number, overY: number): void;
        isOverScrolled(): boolean;
        abortAnimation(): void;
        timePassed(): number;
        isScrollingInDirection(xvel: number, yvel: number): boolean;
    }
}
declare module android.view {
    import MotionEvent = android.view.MotionEvent;
    class VelocityTracker {
        private static TAG;
        private static DEBUG;
        private static localLOGV;
        private static NUM_PAST;
        private static MAX_AGE_MILLISECONDS;
        private static POINTER_POOL_CAPACITY;
        private static sPool;
        private static sRecycledPointerListHead;
        private static sRecycledPointerCount;
        private mPointerListHead;
        private mLastTouchIndex;
        private mGeneration;
        private mNext;
        static obtain(): VelocityTracker;
        recycle(): void;
        setNextPoolable(element: VelocityTracker): void;
        getNextPoolable(): VelocityTracker;
        constructor();
        clear(): void;
        addMovement(ev: MotionEvent): void;
        computeCurrentVelocity(units: number, maxVelocity?: number): void;
        getXVelocity(id?: number): number;
        getYVelocity(id?: number): number;
        private getPointer(id);
        private static obtainPointer();
        private static releasePointer(pointer);
        private static releasePointerList(pointer);
    }
}
declare module android.widget {
    import View = android.view.View;
    import MotionEvent = android.view.MotionEvent;
    import Rect = android.graphics.Rect;
    class ScrollView extends FrameLayout {
        static ANIMATED_SCROLL_GAP: number;
        static MAX_SCROLL_FACTOR: number;
        private static TAG;
        private static INVALID_POINTER;
        private mLastScroll;
        private mTempRect;
        private mScroller;
        private mLastMotionY;
        private mIsLayoutDirty;
        private mChildToScrollTo;
        private mIsBeingDragged;
        private mVelocityTracker;
        private mFillViewport;
        private mSmoothScrollingEnabled;
        private mMinimumVelocity;
        private mMaximumVelocity;
        private mOverscrollDistance;
        private mOverflingDistance;
        private mActivePointerId;
        constructor();
        shouldDelayChildPressedState(): boolean;
        getMaxScrollAmount(): number;
        private initScrollView();
        addView(...args: any[]): any;
        private canScroll();
        isFillViewport(): boolean;
        setFillViewport(fillViewport: boolean): void;
        isSmoothScrollingEnabled(): boolean;
        setSmoothScrollingEnabled(smoothScrollingEnabled: boolean): void;
        onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
        private inChild(x, y);
        private initOrResetVelocityTracker();
        private initVelocityTrackerIfNotExists();
        private recycleVelocityTracker();
        requestDisallowInterceptTouchEvent(disallowIntercept: boolean): void;
        onInterceptTouchEvent(ev: MotionEvent): boolean;
        onTouchEvent(ev: MotionEvent): boolean;
        private onSecondaryPointerUp(ev);
        onOverScrolled(scrollX: number, scrollY: number, clampedX: boolean, clampedY: boolean): void;
        private getScrollRange();
        private findFocusableViewInBounds(topFocus, top, bottom);
        pageScroll(direction: number): boolean;
        fullScroll(direction: number): boolean;
        private scrollAndFocus(direction, top, bottom);
        arrowScroll(direction: number): boolean;
        private isOffScreen(descendant);
        private isWithinDeltaOfScreen(descendant, delta, height);
        private doScrollY(delta);
        smoothScrollBy(dx: number, dy: number): void;
        smoothScrollTo(x: number, y: number): void;
        computeVerticalScrollRange(): number;
        computeVerticalScrollOffset(): number;
        measureChild(child: View, parentWidthMeasureSpec: number, parentHeightMeasureSpec: number): void;
        measureChildWithMargins(child: View, parentWidthMeasureSpec: number, widthUsed: number, parentHeightMeasureSpec: number, heightUsed: number): void;
        computeScroll(): void;
        private scrollToChild(child);
        private scrollToChildRect(rect, immediate);
        computeScrollDeltaToGetChildRectOnScreen(rect: Rect): number;
        requestChildFocus(child: View, focused: View): void;
        onRequestFocusInDescendants(direction: number, previouslyFocusedRect: Rect): boolean;
        requestChildRectangleOnScreen(child: View, rectangle: Rect, immediate: boolean): boolean;
        requestLayout(): void;
        onLayout(changed: boolean, l: number, t: number, r: number, b: number): void;
        onSizeChanged(w: number, h: number, oldw: number, oldh: number): void;
        private static isViewDescendantOf(child, parent);
        fling(velocityY: number): void;
        private endDrag();
        scrollTo(x: number, y: number): void;
        private static clamp(n, my, child);
    }
}
declare module android.widget {
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import Drawable = android.graphics.drawable.Drawable;
    import Canvas = android.graphics.Canvas;
    class LinearLayout extends ViewGroup {
        static HORIZONTAL: number;
        static VERTICAL: number;
        static SHOW_DIVIDER_NONE: number;
        static SHOW_DIVIDER_BEGINNING: number;
        static SHOW_DIVIDER_MIDDLE: number;
        static SHOW_DIVIDER_END: number;
        private mBaselineAligned;
        private mBaselineAlignedChildIndex;
        private mBaselineChildTop;
        private mOrientation;
        private mGravity;
        private mTotalLength;
        private mWeightSum;
        private mUseLargestChild;
        private mMaxAscent;
        private mMaxDescent;
        private static VERTICAL_GRAVITY_COUNT;
        private static INDEX_CENTER_VERTICAL;
        private static INDEX_TOP;
        private static INDEX_BOTTOM;
        private static INDEX_FILL;
        private mDivider;
        private mDividerWidth;
        private mDividerHeight;
        private mShowDividers;
        private mDividerPadding;
        setShowDividers(showDividers: number): void;
        shouldDelayChildPressedState(): boolean;
        getShowDividers(): number;
        getDividerDrawable(): Drawable;
        setDividerDrawable(divider: Drawable): void;
        setDividerPadding(padding: number): void;
        getDividerPadding(): number;
        getDividerWidth(): number;
        onDraw(canvas: Canvas): void;
        drawDividersVertical(canvas: Canvas): void;
        drawDividersHorizontal(canvas: Canvas): void;
        drawHorizontalDivider(canvas: Canvas, top: number): void;
        drawVerticalDivider(canvas: Canvas, left: number): void;
        isBaselineAligned(): boolean;
        setBaselineAligned(baselineAligned: boolean): void;
        isMeasureWithLargestChildEnabled(): boolean;
        setMeasureWithLargestChildEnabled(enabled: boolean): void;
        getBaseline(): number;
        getBaselineAlignedChildIndex(): number;
        setBaselineAlignedChildIndex(i: number): void;
        getVirtualChildAt(index: number): View;
        getVirtualChildCount(): number;
        getWeightSum(): number;
        setWeightSum(weightSum: number): void;
        onMeasure(widthMeasureSpec: any, heightMeasureSpec: any): void;
        hasDividerBeforeChildAt(childIndex: number): boolean;
        measureVertical(widthMeasureSpec: number, heightMeasureSpec: number): void;
        forceUniformWidth(count: number, heightMeasureSpec: number): void;
        measureHorizontal(widthMeasureSpec: number, heightMeasureSpec: number): void;
        private forceUniformHeight(count, widthMeasureSpec);
        getChildrenSkipCount(child: View, index: number): number;
        measureNullChild(childIndex: number): number;
        measureChildBeforeLayout(child: View, childIndex: number, widthMeasureSpec: number, totalWidth: number, heightMeasureSpec: number, totalHeight: number): void;
        getLocationOffset(child: View): number;
        getNextLocationOffset(child: View): number;
        onLayout(changed: boolean, l: number, t: number, r: number, b: number): void;
        layoutVertical(left: number, top: number, right: number, bottom: number): void;
        layoutHorizontal(left: number, top: number, right: number, bottom: number): void;
        private setChildFrame(child, left, top, width, height);
        setOrientation(orientation: number): void;
        getOrientation(): number;
        setGravity(gravity: number): void;
        setHorizontalGravity(horizontalGravity: number): void;
        setVerticalGravity(verticalGravity: number): void;
        generateDefaultLayoutParams(): android.view.ViewGroup.LayoutParams;
        generateLayoutParams(p: android.view.ViewGroup.LayoutParams): android.view.ViewGroup.LayoutParams;
        checkLayoutParams(p: android.view.ViewGroup.LayoutParams): boolean;
    }
    module LinearLayout {
        class LayoutParams extends android.view.ViewGroup.MarginLayoutParams {
            weight: number;
            gravity: number;
            constructor();
            constructor(source: ViewGroup.LayoutParams);
            constructor(width: number, height: number, weight?: number);
        }
    }
}
declare module android.widget {
    import View = android.view.View;
    class TextView extends View {
        private static Default_TextSize;
        private mText;
        private mHint;
        private mGravity;
        private mSingleLine;
        private mTextSize;
        private mTextColor;
        private mHintColor;
        private mSpacingMult;
        private mSpacingAdd;
        private mMaxWidth;
        private mMaxHeight;
        private mMaxLineCount;
        private mMinLineCount;
        private mTextElement;
        constructor();
        private initTextElement();
        onLayout(changed: boolean, left: number, top: number, right: number, bottom: number): void;
        onFinishInflate(): void;
        onMeasure(widthMeasureSpec: any, heightMeasureSpec: any): void;
        private getDesiredHeight();
        getCompoundPaddingTop(): number;
        getCompoundPaddingBottom(): number;
        getCompoundPaddingLeft(): number;
        getCompoundPaddingRight(): number;
        setGravity(gravity: number): void;
        setLineSpacing(add: number, mult: number): void;
        setTextSize(size: number): void;
        getLineHeight(): number;
        setMaxLines(max: number): void;
        getMaxLines(): number;
        setMinLines(min: number): void;
        getMinLines(): number;
        setSingleLine(singleLine?: boolean): void;
        setLines(lines: number): void;
        setText(text: string): void;
        setHtml(html: string): void;
    }
}

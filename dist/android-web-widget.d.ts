declare module android.util {
    class SparseArray<T> {
        map: Map<number, T>;
        constructor(initialCapacity?: number);
        clone(): SparseArray<T>;
        get(key: number, valueIfKeyNotFound?: T): T;
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
        static DBG_DrawableContainer: boolean;
        static DBG_StateListDrawable: boolean;
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
        contains(r: Rect): boolean;
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
        weakMap: WeakMap<any, T>;
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
declare module java.lang {
    class System {
        static out: {
            println(any?: any): void;
            print(any: any): void;
        };
        static currentTimeMillis(): number;
        static arraycopy(src: any[], srcPos: number, dest: any[], destPos: number, length: number): void;
    }
}
declare module android.util {
    class StateSet {
        static WILD_CARD: Array<number>;
        static NOTHING: Array<number>;
        static isWildCard(stateSetOrSpec: Array<number>): boolean;
        static stateSetMatches(stateSpec: Array<number>, stateSetOrState: Array<number> | number): boolean;
        private static _stateSetMatches_single(stateSpec, state);
        static trimStateSet(states: Array<number>, newSize: number): Array<number>;
    }
}
declare module android.graphics.drawable {
    import Rect = android.graphics.Rect;
    import WeakReference = java.lang.ref.WeakReference;
    import Runnable = java.lang.Runnable;
    class Drawable {
        private static ZERO_BOUNDS_RECT;
        mBounds: Rect;
        mStateSet: number[];
        mLevel: number;
        mVisible: boolean;
        mCallback: WeakReference<Drawable.Callback>;
        constructor();
        draw(canvas: any): void;
        setBounds(rect: Rect): any;
        setBounds(left: any, top: any, right: any, bottom: any): any;
        copyBounds(bounds?: Rect): Rect;
        getBounds(): Rect;
        setDither(dither: boolean): void;
        setCallback(cb: Drawable.Callback): void;
        getCallback(): Drawable.Callback;
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
        getConstantState(): Drawable.ConstantState;
    }
    module Drawable {
        interface Callback {
            invalidateDrawable(who: Drawable): void;
            scheduleDrawable(who: Drawable, what: Runnable, when: number): void;
            unscheduleDrawable(who: Drawable, what: Runnable): void;
        }
        interface ConstantState {
            newDrawable(): Drawable;
        }
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
        static rgba(red: number, green: number, blue: number, alpha: number): number;
        static parseColor(colorString: string): number;
        static toRGBA(color: number): string;
        static getHtmlColor(color: string): number;
        static sColorNameMap: Map<String, number>;
    }
}
declare module android.graphics {
    class Paint {
        private mColor;
        private mAlpha;
        getColor(): number;
        setColor(color: number): void;
        getAlpha(): number;
        setAlpha(alpha: number): void;
        _setToCanvasContent(context: CanvasRenderingContext2D): void;
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
        drawRect(rect: Rect, paint: Paint): any;
        drawRect(left: number, top: number, right: number, bottom: number, paint: Paint): any;
    }
}
declare module android.graphics.drawable {
    class ColorDrawable extends Drawable {
        private mState;
        private mMutated;
        private mPaint;
        constructor(color?: number);
        _setStateCopyFrom(state: any): void;
        mutate(): Drawable;
        draw(canvas: Canvas): void;
        getColor(): number;
        setColor(color: number): void;
        getAlpha(): number;
        setAlpha(alpha: number): void;
        getOpacity(): number;
        getConstantState(): Drawable.ConstantState;
    }
}
declare module android.graphics.drawable {
    import Drawable = android.graphics.drawable.Drawable;
    import Canvas = android.graphics.Canvas;
    class ScrollBarDrawable extends Drawable {
        private mVerticalTrack;
        private mHorizontalTrack;
        private mVerticalThumb;
        private mHorizontalThumb;
        private mRange;
        private mOffset;
        private mExtent;
        private mVertical;
        private mChanged;
        private mRangeChanged;
        private mTempBounds;
        private mAlwaysDrawHorizontalTrack;
        private mAlwaysDrawVerticalTrack;
        setAlwaysDrawHorizontalTrack(alwaysDrawTrack: boolean): void;
        setAlwaysDrawVerticalTrack(alwaysDrawTrack: boolean): void;
        getAlwaysDrawVerticalTrack(): boolean;
        getAlwaysDrawHorizontalTrack(): boolean;
        setParameters(range: number, offset: number, extent: number, vertical: boolean): void;
        draw(canvas: any): void;
        onBoundsChange(bounds: android.graphics.Rect): void;
        drawTrack(canvas: Canvas, bounds: Rect, vertical: boolean): void;
        drawThumb(canvas: Canvas, bounds: Rect, offset: number, length: number, vertical: boolean): void;
        setVerticalThumbDrawable(thumb: Drawable): void;
        setVerticalTrackDrawable(track: Drawable): void;
        setHorizontalThumbDrawable(thumb: Drawable): void;
        setHorizontalTrackDrawable(track: Drawable): void;
        getSize(vertical: boolean): number;
        setAlpha(alpha: number): void;
        getAlpha(): number;
        getOpacity(): number;
        toString(): string;
    }
}
declare module android.graphics.drawable {
    import Canvas = android.graphics.Canvas;
    class InsetDrawable extends Drawable implements Drawable.Callback {
        private mInsetState;
        private mTmpRect;
        private mMutated;
        constructor(drawable: Drawable, insetLeft: number, insetTop?: number, insetRight?: number, insetBottom?: number);
        invalidateDrawable(who: android.graphics.drawable.Drawable): void;
        scheduleDrawable(who: android.graphics.drawable.Drawable, what: java.lang.Runnable, when: number): void;
        unscheduleDrawable(who: android.graphics.drawable.Drawable, what: java.lang.Runnable): void;
        draw(canvas: Canvas): void;
        getPadding(padding: android.graphics.Rect): boolean;
        setVisible(visible: boolean, restart: boolean): boolean;
        setAlpha(alpha: number): void;
        getAlpha(): number;
        getOpacity(): number;
        isStateful(): boolean;
        onStateChange(state: Array<number>): boolean;
        onBoundsChange(bounds: android.graphics.Rect): void;
        getIntrinsicWidth(): number;
        getIntrinsicHeight(): number;
        getConstantState(): Drawable.ConstantState;
        mutate(): Drawable;
        getDrawable(): Drawable;
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
declare module java.util {
    class ArrayList<T> {
        private array;
        constructor(initialCapacity?: number);
        size(): number;
        isEmpty(): boolean;
        contains(o: T): boolean;
        indexOf(o: T): number;
        lastIndexOf(o: T): number;
        clone(): ArrayList<T>;
        toArray(a?: T[]): Array<T>;
        get(index: number): T;
        set(index: number, element: T): T;
        add(t: T): any;
        add(index: number, t: T): any;
        remove(o: number | T): T;
        clear(): void;
        addAll(list: ArrayList<T>): any;
        addAll(index: number, list: ArrayList<T>): any;
        removeAll(list: ArrayList<T>): boolean;
        [Symbol.iterator](): () => IterableIterator<T>;
        subList(fromIndex: number, toIndex: number): ArrayList<T>;
        toString(): string;
        sort(compareFn?: (a: T, b: T) => number): void;
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
        private mAlive;
        addOnWindowAttachListener(listener: ViewTreeObserver.OnWindowAttachListener): void;
        removeOnWindowAttachListener(victim: ViewTreeObserver.OnWindowAttachListener): void;
        dispatchOnWindowAttachedChange(attached: boolean): void;
        addOnGlobalLayoutListener(listener: ViewTreeObserver.OnGlobalLayoutListener): void;
        removeGlobalOnLayoutListener(victim: ViewTreeObserver.OnGlobalLayoutListener): void;
        removeOnGlobalLayoutListener(victim: ViewTreeObserver.OnGlobalLayoutListener): void;
        dispatchOnGlobalLayout(): void;
        addOnPreDrawListener(listener: ViewTreeObserver.OnPreDrawListener): void;
        removeOnPreDrawListener(victim: ViewTreeObserver.OnPreDrawListener): void;
        dispatchOnPreDraw(): boolean;
        addOnScrollChangedListener(listener: ViewTreeObserver.OnScrollChangedListener): void;
        removeOnScrollChangedListener(victim: ViewTreeObserver.OnScrollChangedListener): void;
        dispatchOnScrollChanged(): void;
        addOnDrawListener(listener: ViewTreeObserver.OnDrawListener): void;
        removeOnDrawListener(victim: ViewTreeObserver.OnDrawListener): void;
        dispatchOnDraw(): void;
        merge(observer: ViewTreeObserver): void;
        private checkIsAlive();
        isAlive(): boolean;
        private kill();
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
        static EDGE_SLOP: number;
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
        static EDGE_TOP: number;
        static EDGE_BOTTOM: number;
        static EDGE_LEFT: number;
        static EDGE_RIGHT: number;
        static ACTION_POINTER_INDEX_MASK: number;
        static ACTION_POINTER_INDEX_SHIFT: number;
        static HistoryMaxSize: number;
        private static TouchMoveRecord;
        mAction: number;
        mEdgeFlags: number;
        mDownTime: number;
        mEventTime: number;
        mActivePointerId: number;
        private mTouchingPointers;
        mXOffset: number;
        mYOffset: number;
        _activeTouch: any;
        static obtainWithTouchEvent(e: any, action: number): MotionEvent;
        static obtain(event: MotionEvent): MotionEvent;
        static obtainWithAction(downTime: number, eventTime: number, action: number, x: number, y: number, metaState?: number): MotionEvent;
        private static IdIndexCache;
        initWithTouch(event: any, baseAction: number, windowBound?: Rect): void;
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
        getEdgeFlags(): number;
        setEdgeFlags(flags: number): void;
        setAction(action: number): void;
        offsetLocation(deltaX: number, deltaY: number): void;
        setLocation(x: number, y: number): void;
        getPointerIdBits(): number;
        split(idBits: number): MotionEvent;
        toString(): string;
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
declare module android.content.res {
    class ColorStateList {
        mDefaultColor: number;
        mColors: Array<number>;
        mStateSpecs: Array<Array<number>>;
        private static EMPTY;
        private static sCache;
        constructor(states: Array<Array<number>>, colors: Array<number>);
        static valueOf(color: number): ColorStateList;
        withAlpha(alpha: number): ColorStateList;
        isStateful(): boolean;
        getColorForState(stateSet: Array<number>, defaultColor: number): number;
        getDefaultColor(): number;
        toString(): string;
    }
}
declare module android.util {
    class TypedValue {
        static COMPLEX_UNIT_PX: string;
        static COMPLEX_UNIT_DP: string;
        static COMPLEX_UNIT_DIP: string;
        static COMPLEX_UNIT_SP: string;
        static COMPLEX_UNIT_PT: string;
        static COMPLEX_UNIT_IN: string;
        static COMPLEX_UNIT_MM: string;
        static COMPLEX_UNIT_EM: string;
        static COMPLEX_UNIT_REM: string;
        static COMPLEX_UNIT_VH: string;
        static COMPLEX_UNIT_VW: string;
        static COMPLEX_UNIT_FRACTION: string;
        static UNIT_SCALE_PT: any;
        static UNIT_SCALE_IN: any;
        static UNIT_SCALE_MM: any;
        static UNIT_SCALE_EM: any;
        static UNIT_SCALE_REM: any;
        static UNIT_SCALE_SP: number;
        private static initUnit();
        static complexToDimensionPixelSize(valueWithUnit: string, baseValue?: number, metrics?: DisplayMetrics): number;
    }
}
declare module android.view {
    import Rect = android.graphics.Rect;
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
        static apply(gravity: number, w: number, h: number, container: Rect, outRect: Rect): void;
    }
}
declare module android.view.animation {
    interface Interpolator {
        getInterpolation(input: number): number;
    }
}
declare module android.view.animation {
    class LinearInterpolator implements Interpolator {
        getInterpolation(input: number): number;
    }
}
declare module android.view.animation {
    class AnimationUtils {
        static currentAnimationTimeMillis(): number;
    }
}
declare module androidui.attr {
    class StateAttr {
        private stateSpec;
        private attributes;
        constructor(state: number[]);
        setAttr(name: string, value: string): void;
        hasAttr(name: string): boolean;
        getAttrMap(): Map<string, string>;
        putAll(stateAttr: StateAttr): void;
        isStateEquals(state: number[]): boolean;
        isStateMatch(state: number[]): boolean;
        mergeRemovedFrom(another: StateAttr): Map<string, string>;
        static parseStateAttrName(stateDesc: any): Set<number>;
    }
}
declare module androidui.attr {
    class StateAttrList {
        private list;
        private list_reverse;
        private match_list;
        constructor(ele: Element, rootElement: HTMLElement);
        private _initStyleAttributes(ele, inParseState, rootElement);
        private _initStyleAttr(attr, ele, inParseState, rootElement);
        private static EmptyArray;
        getDefaultStateAttr(): StateAttr;
        getStateAttr(state: number[]): StateAttr;
        private optStateAttr(state);
        getMatchedAttr(state: number[]): StateAttr;
    }
}
declare module androidui.util {
    class ClassFinder {
        static findClass(classFullName: string, findInRoot?: any): any;
    }
}
declare module android.view {
    class KeyEvent {
        static KEYCODE_DPAD_UP: number;
        static KEYCODE_DPAD_DOWN: number;
        static KEYCODE_DPAD_LEFT: number;
        static KEYCODE_DPAD_RIGHT: number;
        static KEYCODE_DPAD_CENTER: number;
        static KEYCODE_ENTER: number;
        static KEYCODE_TAB: number;
        static KEYCODE_SPACE: number;
        static KEYCODE_ESCAPE: number;
        static ACTION_DOWN: number;
        static ACTION_UP: number;
        static FLAG_CANCELED: number;
        static FLAG_CANCELED_LONG_PRESS: number;
        private static FLAG_LONG_PRESS;
        static FLAG_TRACKING: number;
        private static FLAG_START_TRACKING;
        mFlags: number;
        private mAction;
        private mDownTime;
        _activeKeyEvent: KeyboardEvent;
        _downingKeyEventMap: Map<number, KeyboardEvent[]>;
        appendKeyEvent(keyEvent: KeyboardEvent, action: number): void;
        static isConfirmKey(keyCode: number): boolean;
        isAltPressed(): boolean;
        isShiftPressed(): boolean;
        isCtrlPressed(): boolean;
        isMetaPressed(): boolean;
        getAction(): number;
        startTracking(): void;
        isTracking(): boolean;
        isLongPress(): boolean;
        getKeyCode(): number;
        getRepeatCount(): number;
        getDownTime(): number;
        getEventTime(): number;
        dispatch(receiver: KeyEvent.Callback, state?: KeyEvent.DispatcherState, target?: any): boolean;
        toString(): string;
        static actionToString(action: number): string;
        static keyCodeToString(keyCode: number): string;
    }
    module KeyEvent {
        interface Callback {
            onKeyDown(keyCode: number, event: KeyEvent): boolean;
            onKeyLongPress(keyCode: number, event: KeyEvent): boolean;
            onKeyUp(keyCode: number, event: KeyEvent): boolean;
        }
        class DispatcherState {
            mDownKeyCode: number;
            mDownTarget: any;
            mActiveLongPresses: util.SparseArray<number>;
            reset(target: any): void;
            startTracking(event: KeyEvent, target: any): void;
            isTracking(event: KeyEvent): boolean;
            performedLongPress(event: KeyEvent): void;
            handleUpEvent(event: KeyEvent): void;
        }
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
    import ArrayList = java.util.ArrayList;
    import ColorStateList = android.content.res.ColorStateList;
    import KeyEvent = android.view.KeyEvent;
    class View implements Drawable.Callback, KeyEvent.Callback {
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
        static SCROLLBARS_NONE: number;
        static SCROLLBARS_HORIZONTAL: number;
        static SCROLLBARS_VERTICAL: number;
        static SCROLLBARS_MASK: number;
        static FOCUSABLES_ALL: number;
        static FOCUSABLES_TOUCH_MODE: number;
        static FOCUS_BACKWARD: number;
        static FOCUS_FORWARD: number;
        static FOCUS_LEFT: number;
        static FOCUS_UP: number;
        static FOCUS_RIGHT: number;
        static FOCUS_DOWN: number;
        static VIEW_STATE_SETS: Array<Array<number>>;
        static VIEW_STATE_WINDOW_FOCUSED: number;
        static VIEW_STATE_SELECTED: number;
        static VIEW_STATE_FOCUSED: number;
        static VIEW_STATE_ENABLED: number;
        static VIEW_STATE_DISABLE: number;
        static VIEW_STATE_PRESSED: number;
        static VIEW_STATE_ACTIVATED: number;
        static VIEW_STATE_IDS: number[];
        private static _static;
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
        private mScrollCache;
        private mDrawableState;
        private mPendingCheckForLongPress;
        private mPendingCheckForTap;
        private mPerformClick;
        private mUnsetPressedState;
        private mHasPerformedLongPress;
        mMinWidth: number;
        mMinHeight: number;
        private mTouchDelegate;
        private mFloatingTreeObserver;
        mTouchSlop: number;
        private mVerticalScrollFactor;
        private mOverScrollMode;
        mParent: ViewParent;
        private mMeasureCache;
        mAttachInfo: View.AttachInfo;
        mLayoutParams: ViewGroup.LayoutParams;
        mViewFlags: number;
        mLayerType: number;
        mCachingFailed: boolean;
        private mOverlay;
        private mWindowAttachCount;
        private mListenerInfo;
        private mClipBounds;
        private mLastIsOpaque;
        private _mLeft;
        private _mRight;
        private _mTop;
        private _mBottom;
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
        createAttrChangeHandler(mergeHandler: View.AttrChangeHandler): void;
        getId(): string;
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
        setPaddingLeft(left: number): void;
        setPaddingTop(top: number): void;
        setPaddingRight(right: number): void;
        setPaddingBottom(bottom: number): void;
        setPadding(left: number, top: number, right: number, bottom: number): void;
        private _setPaddingWithUnit(left, top, right, bottom);
        setScrollX(value: number): void;
        setScrollY(value: number): void;
        getScrollX(): number;
        getScrollY(): number;
        getFinalAlpha(): number;
        offsetTopAndBottom(offset: number): void;
        offsetLeftAndRight(offset: number): void;
        setAlpha(alpha: number): void;
        private updateMatrix();
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
        getTouchables(): ArrayList<View>;
        addTouchables(views: ArrayList<View>): void;
        isFocusable(): boolean;
        isFocusableInTouchMode(): boolean;
        hasFocus(): boolean;
        hasFocusable(): boolean;
        clearFocus(): void;
        requestFocus(direction?: number, previouslyFocusedRect?: any): void;
        findFocus(): View;
        isFocused(): boolean;
        getVisibility(): number;
        setVisibility(visibility: number): void;
        dispatchVisibilityChanged(changedView: View, visibility: number): void;
        onVisibilityChanged(changedView: View, visibility: number): void;
        dispatchWindowVisibilityChanged(visibility: number): void;
        onWindowVisibilityChanged(visibility: number): void;
        getWindowVisibility(): number;
        isEnabled(): boolean;
        setEnabled(enabled: boolean): void;
        resetPressedState(): void;
        dispatchGenericMotionEvent(event: Event): boolean;
        onGenericMotionEvent(event: Event): boolean;
        dispatchKeyEvent(event: KeyEvent): boolean;
        setOnKeyListener(l: View.OnKeyListener): void;
        getKeyDispatcherState(): KeyEvent.DispatcherState;
        onKeyDown(keyCode: number, event: android.view.KeyEvent): boolean;
        onKeyLongPress(keyCode: number, event: android.view.KeyEvent): boolean;
        onKeyUp(keyCode: number, event: android.view.KeyEvent): boolean;
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
        getListenerInfo(): View.ListenerInfo;
        addOnLayoutChangeListener(listener: View.OnLayoutChangeListener): void;
        removeOnLayoutChangeListener(listener: View.OnLayoutChangeListener): void;
        addOnAttachStateChangeListener(listener: View.OnAttachStateChangeListener): void;
        removeOnAttachStateChangeListener(listener: View.OnAttachStateChangeListener): void;
        setOnClickListener(l: View.OnClickListener): void;
        hasOnClickListeners(): boolean;
        setOnLongClickListener(l: View.OnLongClickListener): void;
        performClick(event?: MotionEvent): boolean;
        private _sendClickToBindElement(event?);
        callOnClick(): boolean;
        performLongClick(): boolean;
        private checkForLongClick(delayOffset?);
        setOnTouchListener(l: View.OnTouchListener): void;
        isClickable(): boolean;
        setClickable(clickable: boolean): void;
        isLongClickable(): boolean;
        setLongClickable(longClickable: boolean): void;
        setPressed(pressed: boolean): void;
        dispatchSetPressed(pressed: boolean): void;
        isPressed(): boolean;
        setSelected(selected: boolean): void;
        dispatchSetSelected(selected: boolean): void;
        isSelected(): boolean;
        setActivated(activated: boolean): void;
        dispatchSetActivated(activated: boolean): void;
        isActivated(): boolean;
        getViewTreeObserver(): ViewTreeObserver;
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
        setFrame(left: number, top: number, right: number, bottom: number): boolean;
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
        onDrawScrollBars(canvas: Canvas): void;
        isVerticalScrollBarHidden(): boolean;
        onDrawHorizontalScrollBar(canvas: Canvas, scrollBar: Drawable, l: number, t: number, r: number, b: number): void;
        onDrawVerticalScrollBar(canvas: Canvas, scrollBar: Drawable, l: number, t: number, r: number, b: number): void;
        setDrawingCacheEnabled(enabled: boolean): void;
        isDrawingCacheEnabled(): boolean;
        destroyDrawingCache(): void;
        setWillNotDraw(willNotDraw: boolean): void;
        willNotDraw(): boolean;
        setWillNotCacheDrawing(willNotCacheDrawing: boolean): void;
        willNotCacheDrawing(): boolean;
        invalidateDrawable(drawable: Drawable): void;
        scheduleDrawable(who: Drawable, what: Runnable, when: number): void;
        unscheduleDrawable(who: Drawable, what?: Runnable): void;
        verifyDrawable(who: Drawable): boolean;
        drawableStateChanged(): void;
        refreshDrawableState(): void;
        getDrawableState(): Array<number>;
        onCreateDrawableState(extraSpace: number): Array<number>;
        static mergeDrawableStates(baseState: Array<number>, additionalState: Array<number>): number[];
        jumpDrawablesToCurrentState(): void;
        setBackgroundColor(color: number): void;
        setBackground(background: Drawable): void;
        setBackgroundDrawable(background: Drawable): void;
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
        private initialAwakenScrollBars();
        awakenScrollBars(startDelay?: number, invalidate?: boolean): boolean;
        getVerticalFadingEdgeLength(): number;
        setFadingEdgeLength(length: number): void;
        getHorizontalFadingEdgeLength(): number;
        getVerticalScrollbarWidth(): number;
        getHorizontalScrollbarHeight(): number;
        private initializeScrollbars();
        private initScrollCache();
        private getScrollCache();
        isHorizontalScrollBarEnabled(): boolean;
        setHorizontalScrollBarEnabled(horizontalScrollBarEnabled: boolean): void;
        isVerticalScrollBarEnabled(): boolean;
        setVerticalScrollBarEnabled(verticalScrollBarEnabled: boolean): void;
        setScrollbarFadingEnabled(fadeScrollbars: boolean): void;
        isScrollbarFadingEnabled(): boolean;
        getScrollBarDefaultDelayBeforeFade(): number;
        setScrollBarDefaultDelayBeforeFade(scrollBarDefaultDelayBeforeFade: number): void;
        getScrollBarFadeDuration(): number;
        setScrollBarFadeDuration(scrollBarFadeDuration: number): void;
        getScrollBarSize(): number;
        setScrollBarSize(scrollBarSize: number): void;
        assignParent(parent: ViewParent): void;
        onFinishInflate(): void;
        isAttachedToWindow(): boolean;
        dispatchAttachedToWindow(info: View.AttachInfo, visibility: number): void;
        onAttachedToWindow(): void;
        dispatchDetachedFromWindow(): void;
        onDetachedFromWindow(): void;
        cleanupDraw(): void;
        debug(depth?: number): void;
        toString(): String;
        getRootView(): View;
        findViewById(id: string): View;
        static inflate(eleOrRef: HTMLElement | string, rootElement: HTMLElement, viewParent?: ViewGroup): View;
        static optReferenceString(refString: string, currentElement?: NodeSelector, rootElement?: NodeSelector): string;
        static findReferenceString(refString: string, currentElement?: NodeSelector, rootElement?: NodeSelector): string;
        static findReference(refString: string, currentElement?: NodeSelector, rootElement?: NodeSelector, cloneNode?: boolean): Element;
        _bindElement: HTMLElement;
        _rootElement: HTMLElement;
        private _AttrObserver;
        private _stateAttrList;
        static AndroidViewProperty: string;
        bindElement: HTMLElement;
        rootElement: HTMLElement;
        private _AttrObserverCallBack(arr, observer);
        initBindElement(bindElement?: HTMLElement, rootElement?: HTMLElement): void;
        syncBoundToElement(): void;
        syncScrollToElement(): void;
        private _attrChangeHandler;
        private _initAttrChangeHandler();
        private _initAttrObserver();
        private _initBindElementDefaultAttribute();
        private _fireInitBindElementAttribute();
        private _fireStateChangeToAttribute(oldState, newState);
        private onBindElementAttributeChanged(attributeName, oldVal, newVal);
        private static _generateLayoutParamsFromAttribute(node, dest?);
        tagName(): string;
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
            mWindowLeft: number;
            mWindowTop: number;
            mKeyDispatchState: KeyEvent.DispatcherState;
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
            mWindowVisibility: number;
            constructor(mViewRootImpl: ViewRootImpl, mHandler: Handler);
        }
        class ListenerInfo {
            mOnAttachStateChangeListeners: CopyOnWriteArrayList<OnAttachStateChangeListener>;
            mOnLayoutChangeListeners: ArrayList<OnLayoutChangeListener>;
            mOnClickListener: OnClickListener;
            mOnLongClickListener: OnLongClickListener;
            mOnTouchListener: OnTouchListener;
            mOnKeyListener: OnKeyListener;
            mOnGenericMotionListener: OnGenericMotionListener;
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
        interface OnKeyListener {
            onKey(v: View, keyCode: number, event: KeyEvent): any;
        }
        interface OnGenericMotionListener {
            onGenericMotion(v: View, event: Event): any;
        }
        class AttrChangeHandler {
            isCallSuper: boolean;
            handlers: any[];
            view: View;
            private objectRefs;
            constructor(view: android.view.View);
            add(handler: any): void;
            handle(name: any, value: any): void;
            getViewAttrValue(attrName: string): string;
            private getRefObject(ref, recycel?);
            private setRefObject(obj);
            static parsePaddingMarginLTRB(value: any): string[];
            static parseBoolean(value: any, defaultValue?: boolean): boolean;
            parseBoolean(value: any, defaultValue?: boolean): boolean;
            static parseGravity(s: string, defaultValue?: number): number;
            parseGravity(s: string, defaultValue?: number): number;
            parseDrawable(s: string): Drawable;
            parseColor(value: string): number;
            parseColorList(value: string): ColorStateList;
            parseNumber(value: any, defaultValue?: number): number;
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
        rootElement: HTMLElement;
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
        createAttrChangeHandler(mergeHandler: View.AttrChangeHandler): void;
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
        dispatchKeyEvent(event: android.view.KeyEvent): boolean;
        addTouchables(views: java.util.ArrayList<android.view.View>): void;
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
        dispatchSetSelected(selected: boolean): void;
        dispatchSetActivated(activated: boolean): void;
        dispatchSetPressed(pressed: boolean): void;
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
        drawableStateChanged(): void;
        jumpDrawablesToCurrentState(): void;
        onCreateDrawableState(extraSpace: number): Array<number>;
        setAddStatesFromChildren(addsStates: boolean): void;
        addStatesFromChildren(): boolean;
        childDrawableStateChanged(child: android.view.View): void;
        getClipChildren(): boolean;
        setClipChildren(clipChildren: boolean): void;
        setClipToPadding(clipToPadding: boolean): void;
        isClipToPadding(): boolean;
        invalidateChild(child: View, dirty: Rect): void;
        invalidateChildInParent(location: Array<number>, dirty: Rect): ViewParent;
        invalidateChildFast(child: View, dirty: Rect): void;
        invalidateChildInParentFast(left: number, top: number, dirty: Rect): ViewParent;
        requestTransparentRegion(child: android.view.View): void;
        requestChildFocus(child: android.view.View, focused: android.view.View): void;
        clearChildFocus(child: android.view.View): void;
        focusSearch(v: android.view.View, direction: number): android.view.View;
        focusableViewAvailable(v: android.view.View): void;
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
            private _width;
            private _widthOrig;
            private _height;
            private _heightOrig;
            width: number;
            height: number;
            _measuringParentWidthMeasureSpec: number;
            _measuringParentHeightMeasureSpec: number;
            _measuringMeasureSpec: android.util.DisplayMetrics;
            _attrChangeHandler: View.AttrChangeHandler;
            constructor();
            constructor(src: LayoutParams);
            constructor(width: number, height: number);
            _createAttrChangeHandler(mergeHandler: View.AttrChangeHandler): void;
        }
        class MarginLayoutParams extends LayoutParams {
            private _leftMargin;
            private _topMargin;
            private _rightMargin;
            private _bottomMargin;
            private _leftMarginOrig;
            private _topMarginOrig;
            private _rightMarginOrig;
            private _bottomMarginOrig;
            leftMargin: number;
            topMargin: number;
            rightMargin: number;
            bottomMargin: number;
            constructor();
            constructor(src: LayoutParams);
            constructor(width: number, height: number);
            setMargins(left: number, top: number, right: number, bottom: number): void;
            _createAttrChangeHandler(mergeHandler: View.AttrChangeHandler): void;
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
declare module android.widget {
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import Drawable = android.graphics.drawable.Drawable;
    import Canvas = android.graphics.Canvas;
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
        createAttrChangeHandler(mergeHandler: View.AttrChangeHandler): void;
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
        draw(canvas: Canvas): void;
        setMeasureAllChildren(measureAll: boolean): void;
        getMeasureAllChildren(): boolean;
        shouldDelayChildPressedState(): boolean;
        checkLayoutParams(p: ViewGroup.LayoutParams): boolean;
        generateLayoutParams(p: ViewGroup.LayoutParams): FrameLayout.LayoutParams;
    }
    module FrameLayout {
        class LayoutParams extends ViewGroup.MarginLayoutParams {
            gravity: number;
            constructor();
            constructor(source: ViewGroup.LayoutParams);
            constructor(width: number, height: number, gravity?: number);
            _createAttrChangeHandler(mergeHandler: View.AttrChangeHandler): void;
        }
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
        getDuration(): number;
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
    import KeyEvent = android.view.KeyEvent;
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
        createAttrChangeHandler(mergeHandler: View.AttrChangeHandler): void;
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
        dispatchKeyEvent(event: KeyEvent): boolean;
        executeKeyEvent(event: KeyEvent): boolean;
        private inChild(x, y);
        private initOrResetVelocityTracker();
        private initVelocityTrackerIfNotExists();
        private recycleVelocityTracker();
        requestDisallowInterceptTouchEvent(disallowIntercept: boolean): void;
        onInterceptTouchEvent(ev: MotionEvent): boolean;
        onTouchEvent(ev: MotionEvent): boolean;
        private onSecondaryPointerUp(ev);
        onGenericMotionEvent(event: Event): boolean;
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
        private getOverflingDistance();
        fling(velocityY: number): void;
        private endDrag();
        scrollTo(x: number, y: number): void;
        private static clamp(n, my, child);
        canScrollVertically(direction: number): boolean;
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
        createAttrChangeHandler(mergeHandler: View.AttrChangeHandler): void;
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
            _createAttrChangeHandler(mergeHandler: View.AttrChangeHandler): void;
        }
    }
}
declare module android.widget {
    import View = android.view.View;
    import ColorStateList = android.content.res.ColorStateList;
    class TextView extends View {
        private static Default_TextSize;
        private mText;
        private mHint;
        private mGravity;
        private mSingleLine;
        private mTextSize;
        private mTextColor;
        private mCurTextColor;
        private mHintColor;
        private mSpacingMult;
        private mSpacingAdd;
        private mMaxWidth;
        private mMaxHeight;
        private mMaxLineCount;
        private mMinLineCount;
        private mTextElement;
        constructor();
        createAttrChangeHandler(mergeHandler: android.view.View.AttrChangeHandler): void;
        private initTextElement();
        initBindElement(bindElement: HTMLElement, rootElement: HTMLElement): void;
        onLayout(changed: boolean, left: number, top: number, right: number, bottom: number): void;
        onFinishInflate(): void;
        onMeasure(widthMeasureSpec: any, heightMeasureSpec: any): void;
        private getDesiredHeight();
        onDraw(canvas: android.graphics.Canvas): void;
        setTextColor(color: number | ColorStateList): void;
        getTextColors(): ColorStateList;
        getCurrentTextColor(): number;
        private updateTextColors();
        drawableStateChanged(): void;
        getCompoundPaddingTop(): number;
        getCompoundPaddingBottom(): number;
        getCompoundPaddingLeft(): number;
        getCompoundPaddingRight(): number;
        setGravity(gravity: number): void;
        setLineSpacing(add: number, mult: number): void;
        setTextSizeInPx(sizeInPx: number): void;
        setTextSize(size: number): void;
        getLineHeight(): number;
        setHeight(pixels: number): void;
        setMaxLines(max: number): void;
        getMaxLines(): number;
        setMaxHeight(maxHeight: number): void;
        getMaxHeight(): number;
        setMaxWidth(maxpixels: number): void;
        getMaxWidth(): number;
        setWidth(pixels: number): void;
        setMinLines(min: number): void;
        getMinLines(): number;
        setSingleLine(singleLine?: boolean): void;
        setLines(lines: number): void;
        setText(text?: string): void;
        getText(): string;
        setHtml(html: string): void;
        getHtml(): string;
        getTextElement(): HTMLElement;
    }
}
declare module android.graphics.drawable {
    import Canvas = android.graphics.Canvas;
    import Rect = android.graphics.Rect;
    class DrawableContainer extends Drawable implements Drawable.Callback {
        private static DEBUG;
        private static TAG;
        static DEFAULT_DITHER: boolean;
        private mDrawableContainerState;
        private mCurrDrawable;
        private mAlpha;
        private mCurIndex;
        mMutated: boolean;
        private mAnimationRunnable;
        private mEnterAnimationEnd;
        private mExitAnimationEnd;
        private mLastDrawable;
        draw(canvas: Canvas): void;
        private needsMirroring();
        getPadding(padding: android.graphics.Rect): boolean;
        setAlpha(alpha: number): void;
        getAlpha(): number;
        setDither(dither: boolean): void;
        setEnterFadeDuration(ms: number): void;
        setExitFadeDuration(ms: number): void;
        onBoundsChange(bounds: android.graphics.Rect): void;
        isStateful(): boolean;
        setAutoMirrored(mirrored: boolean): void;
        isAutoMirrored(): boolean;
        jumpToCurrentState(): void;
        onStateChange(state: Array<number>): boolean;
        onLevelChange(level: number): boolean;
        getIntrinsicWidth(): number;
        getIntrinsicHeight(): number;
        getMinimumWidth(): number;
        getMinimumHeight(): number;
        invalidateDrawable(who: android.graphics.drawable.Drawable): void;
        scheduleDrawable(who: android.graphics.drawable.Drawable, what: java.lang.Runnable, when: number): void;
        unscheduleDrawable(who: android.graphics.drawable.Drawable, what: java.lang.Runnable): void;
        setVisible(visible: boolean, restart: boolean): boolean;
        getOpacity(): number;
        selectDrawable(idx: number): boolean;
        animate(schedule: boolean): void;
        getCurrent(): Drawable;
        getConstantState(): Drawable.ConstantState;
        mutate(): Drawable;
        setConstantState(state: DrawableContainer.DrawableContainerState): void;
    }
    module DrawableContainer {
        class DrawableContainerState implements Drawable.ConstantState {
            mOwner: DrawableContainer;
            private mDrawableFutures;
            mDrawables: Array<Drawable>;
            mNumChildren: number;
            mVariablePadding: boolean;
            mPaddingChecked: boolean;
            mConstantPadding: Rect;
            mConstantSize: boolean;
            mComputedConstantSize: boolean;
            mConstantWidth: number;
            mConstantHeight: number;
            mConstantMinimumWidth: number;
            mConstantMinimumHeight: number;
            mCheckedOpacity: boolean;
            mOpacity: number;
            mCheckedStateful: boolean;
            mStateful: boolean;
            mCheckedConstantState: boolean;
            mCanConstantState: boolean;
            mDither: boolean;
            mMutated: boolean;
            mEnterFadeDuration: number;
            mExitFadeDuration: number;
            mAutoMirrored: boolean;
            constructor(orig: DrawableContainerState, owner: DrawableContainer);
            addChild(dr: Drawable): number;
            getCapacity(): number;
            private createAllFutures();
            getChildCount(): number;
            getChildren(): Array<Drawable>;
            getChild(index: number): Drawable;
            mutate(): void;
            setVariablePadding(variable: boolean): void;
            getConstantPadding(): Rect;
            setConstantSize(constant: boolean): void;
            isConstantSize(): boolean;
            getConstantWidth(): number;
            getConstantHeight(): number;
            getConstantMinimumWidth(): number;
            getConstantMinimumHeight(): number;
            computeConstantSize(): void;
            setEnterFadeDuration(duration: number): void;
            getEnterFadeDuration(): number;
            setExitFadeDuration(duration: number): void;
            getExitFadeDuration(): number;
            getOpacity(): number;
            isStateful(): boolean;
            canConstantState(): boolean;
            newDrawable(): android.graphics.drawable.Drawable;
        }
    }
}
declare module android.graphics.drawable {
    class StateListDrawable extends DrawableContainer {
        private mStateListState;
        constructor();
        private initWithState(state);
        addState(stateSet: Array<number>, drawable: Drawable): void;
        isStateful(): boolean;
        onStateChange(stateSet: Array<number>): boolean;
        getStateCount(): number;
        getStateSet(index: number): Array<number>;
        getStateDrawable(index: number): Drawable;
        getStateDrawableIndex(stateSet: Array<number>): number;
        mutate(): Drawable;
    }
}
declare module android.widget {
    class Button extends TextView {
        constructor();
        private _initDefaultStyle();
    }
}
declare module androidui.widget {
    import View = android.view.View;
    import ImageView = android.widget.ImageView;
    class HtmlImageView extends View {
        private mScaleType;
        private mHaveFrame;
        private mAdjustViewBounds;
        private mMaxWidth;
        private mMaxHeight;
        private mAlpha;
        private mDrawableWidth;
        private mDrawableHeight;
        private mAdjustViewBoundsCompat;
        private mImgElement;
        constructor();
        private initImageView();
        initBindElement(bindElement: HTMLElement, rootElement: HTMLElement): void;
        createAttrChangeHandler(mergeHandler: android.view.View.AttrChangeHandler): void;
        getAdjustViewBounds(): boolean;
        setAdjustViewBounds(adjustViewBounds: boolean): void;
        getMaxWidth(): number;
        setMaxWidth(maxWidth: number): void;
        getMaxHeight(): number;
        setMaxHeight(maxHeight: number): void;
        setImageURI(uri: string): void;
        setScaleType(scaleType: ImageView.ScaleType): void;
        getScaleType(): ImageView.ScaleType;
        onMeasure(widthMeasureSpec: any, heightMeasureSpec: any): void;
        private resolveAdjustedSize(desiredSize, maxSize, measureSpec);
        setFrame(left: number, top: number, right: number, bottom: number): boolean;
        private configureBounds();
        getImageAlpha(): number;
        setImageAlpha(alpha: number): void;
    }
}
declare module android.widget {
    class ImageView extends androidui.widget.HtmlImageView {
    }
    module ImageView {
        class ScaleType {
            static MATRIX: ScaleType;
            static FIT_XY: ScaleType;
            static FIT_START: ScaleType;
            static FIT_CENTER: ScaleType;
            static FIT_END: ScaleType;
            static CENTER: ScaleType;
            static CENTER_CROP: ScaleType;
            static CENTER_INSIDE: ScaleType;
            private mType;
            constructor(type: string);
            toString(): string;
            static parseScaleType(s: string, defaultType: ScaleType): ScaleType;
        }
    }
}
declare module android.database {
    import ArrayList = java.util.ArrayList;
    abstract class Observable<T> {
        mObservers: ArrayList<T>;
        registerObserver(observer: T): void;
        unregisterObserver(observer: T): void;
        unregisterAll(): void;
    }
}
declare module android.database {
    class DataSetObserver {
        onChanged(): void;
        onInvalidated(): void;
    }
}
declare module android.database {
    import Observable = android.database.Observable;
    import DataSetObserver = android.database.DataSetObserver;
    class DataSetObservable extends Observable<DataSetObserver> {
        notifyChanged(): void;
        notifyInvalidated(): void;
    }
}
declare module android.support.v4.view {
    import DataSetObserver = android.database.DataSetObserver;
    import ViewGroup = android.view.ViewGroup;
    import View = android.view.View;
    abstract class PagerAdapter {
        private mObservable;
        static POSITION_UNCHANGED: number;
        static POSITION_NONE: number;
        abstract getCount(): number;
        startUpdate(container: ViewGroup): void;
        instantiateItem(container: ViewGroup, position: number): any;
        destroyItem(container: ViewGroup, position: number, object: any): void;
        setPrimaryItem(container: ViewGroup, position: number, object: any): void;
        finishUpdate(container: ViewGroup): void;
        abstract isViewFromObject(view: View, object: any): boolean;
        getItemPosition(object: any): number;
        notifyDataSetChanged(): void;
        registerDataSetObserver(observer: DataSetObserver): void;
        unregisterDataSetObserver(observer: DataSetObserver): void;
        getPageTitle(position: number): string;
        getPageWidth(position: number): number;
    }
}
declare module android.support.v4.view {
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import PagerAdapter = android.support.v4.view.PagerAdapter;
    import Drawable = android.graphics.drawable.Drawable;
    import MotionEvent = android.view.MotionEvent;
    import KeyEvent = android.view.KeyEvent;
    class ViewPager extends ViewGroup {
        private mExpectedAdapterCount;
        private static COMPARATOR;
        private static USE_CACHE;
        private static DEFAULT_OFFSCREEN_PAGES;
        private static MAX_SETTLE_DURATION;
        private static MIN_DISTANCE_FOR_FLING;
        private static DEFAULT_GUTTER_SIZE;
        private static MIN_FLING_VELOCITY;
        private static sInterpolator;
        private mItems;
        private mTempItem;
        private mTempRect;
        private mAdapter;
        private mCurItem;
        private mRestoredCurItem;
        private mScroller;
        private mObserver;
        private mPageMargin;
        private mMarginDrawable;
        private mTopPageBounds;
        private mBottomPageBounds;
        private mFirstOffset;
        private mLastOffset;
        private mChildWidthMeasureSpec;
        private mChildHeightMeasureSpec;
        private mInLayout;
        private mScrollingCacheEnabled;
        private mPopulatePending;
        private mOffscreenPageLimit;
        private mIsBeingDragged;
        private mIsUnableToDrag;
        private mDefaultGutterSize;
        private mGutterSize;
        private mLastMotionX;
        private mLastMotionY;
        private mInitialMotionX;
        private mInitialMotionY;
        private static INVALID_POINTER;
        private mActivePointerId;
        private mVelocityTracker;
        private mMinimumVelocity;
        private mMaximumVelocity;
        private mFlingDistance;
        private mCloseEnough;
        private static CLOSE_ENOUGH;
        private mFakeDragging;
        private mFakeDragBeginTime;
        private mFirstLayout;
        private mNeedCalculatePageOffsets;
        private mCalledSuper;
        private mDecorChildCount;
        private mOnPageChangeListeners;
        private mOnPageChangeListener;
        private mInternalPageChangeListener;
        private mAdapterChangeListener;
        private mPageTransformer;
        private static DRAW_ORDER_DEFAULT;
        private static DRAW_ORDER_FORWARD;
        private static DRAW_ORDER_REVERSE;
        private mDrawingOrder;
        private mDrawingOrderedChildren;
        private static sPositionComparator;
        static SCROLL_STATE_IDLE: number;
        static SCROLL_STATE_DRAGGING: number;
        static SCROLL_STATE_SETTLING: number;
        private mEndScrollRunnable;
        private mScrollState;
        constructor();
        private initViewPager();
        onDetachedFromWindow(): void;
        private setScrollState(newState);
        setAdapter(adapter: PagerAdapter): void;
        private removeNonDecorViews();
        getAdapter(): PagerAdapter;
        setOnAdapterChangeListener(listener: ViewPager.OnAdapterChangeListener): void;
        private getClientWidth();
        setCurrentItem(item: number, smoothScroll?: boolean): void;
        getCurrentItem(): number;
        setCurrentItemInternal(item: number, smoothScroll: boolean, always: boolean, velocity?: number): void;
        private scrollToItem(item, smoothScroll, velocity, dispatchSelected);
        setOnPageChangeListener(listener: ViewPager.OnPageChangeListener): void;
        addOnPageChangeListener(listener: ViewPager.OnPageChangeListener): void;
        removeOnPageChangeListener(listener: ViewPager.OnPageChangeListener): void;
        clearOnPageChangeListeners(): void;
        setPageTransformer(reverseDrawingOrder: boolean, transformer: ViewPager.PageTransformer): void;
        setChildrenDrawingOrderEnabledCompat(enable?: boolean): void;
        getChildDrawingOrder(childCount: number, i: number): number;
        setInternalPageChangeListener(listener: ViewPager.OnPageChangeListener): ViewPager.OnPageChangeListener;
        getOffscreenPageLimit(): number;
        setOffscreenPageLimit(limit: number): void;
        setPageMargin(marginPixels: number): void;
        getPageMargin(): number;
        setPageMarginDrawable(d: Drawable): void;
        verifyDrawable(who: Drawable): boolean;
        drawableStateChanged(): void;
        distanceInfluenceForSnapDuration(f: number): number;
        smoothScrollTo(x: number, y: number, velocity?: number): void;
        private addNewItem(position, index);
        dataSetChanged(): void;
        populate(newCurrentItem?: number): void;
        private sortChildDrawingOrder();
        private calculatePageOffsets(curItem, curIndex, oldCurInfo);
        addView(view: View): any;
        addView(view: View, index: number): any;
        addView(view: View, params: ViewGroup.LayoutParams): any;
        addView(view: View, index: number, params: ViewGroup.LayoutParams): any;
        addView(view: View, width: number, height: number): any;
        private _addViewOverride(child, index, params);
        removeView(view: android.view.View): void;
        private infoForChild(child);
        private infoForAnyChild(child);
        private infoForPosition(position);
        onAttachedToWindow(): void;
        onMeasure(widthMeasureSpec: any, heightMeasureSpec: any): void;
        onSizeChanged(w: number, h: number, oldw: number, oldh: number): void;
        private recomputeScrollPosition(width, oldWidth, margin, oldMargin);
        onLayout(changed: boolean, l: number, t: number, r: number, b: number): void;
        computeScroll(): void;
        private pageScrolled(xpos);
        onPageScrolled(position: number, offset: number, offsetPixels: number): void;
        private dispatchOnPageScrolled(position, offset, offsetPixels);
        private dispatchOnPageSelected(position);
        private dispatchOnScrollStateChanged(state);
        private completeScroll(postEvents);
        private isGutterDrag(x, dx);
        private enableLayers(enable);
        onInterceptTouchEvent(ev: MotionEvent): boolean;
        onTouchEvent(ev: android.view.MotionEvent): boolean;
        private resetTouch();
        private requestParentDisallowInterceptTouchEvent(disallowIntercept);
        private performDrag(x);
        private infoForCurrentScrollPosition();
        private determineTargetPage(currentPage, pageOffset, velocity, deltaX);
        draw(canvas: android.graphics.Canvas): void;
        onDraw(canvas: android.graphics.Canvas): void;
        beginFakeDrag(): boolean;
        endFakeDrag(): void;
        fakeDragBy(xOffset: number): void;
        isFakeDragging(): boolean;
        private onSecondaryPointerUp(ev);
        private endDrag();
        private setScrollingCacheEnabled(enabled);
        canScrollHorizontally(direction: number): boolean;
        canScroll(v: View, checkV: boolean, dx: number, x: number, y: number): boolean;
        dispatchKeyEvent(event: android.view.KeyEvent): boolean;
        executeKeyEvent(event: KeyEvent): boolean;
        arrowScroll(direction: number): boolean;
        private getChildRectInPagerCoordinates(outRect, child);
        pageLeft(): boolean;
        pageRight(): boolean;
        addTouchables(views: java.util.ArrayList<android.view.View>): void;
        generateDefaultLayoutParams(): android.view.ViewGroup.LayoutParams;
        generateLayoutParams(p: android.view.ViewGroup.LayoutParams): android.view.ViewGroup.LayoutParams;
        checkLayoutParams(p: android.view.ViewGroup.LayoutParams): boolean;
        private static isImplDecor(view);
        static setClassImplDecor(clazz: Function): void;
    }
    module ViewPager {
        interface OnPageChangeListener {
            onPageScrolled(position: number, positionOffset: number, positionOffsetPixels: number): void;
            onPageSelected(position: number): void;
            onPageScrollStateChanged(state: number): void;
        }
        class SimpleOnPageChangeListener implements OnPageChangeListener {
            onPageScrolled(position: number, positionOffset: number, positionOffsetPixels: number): void;
            onPageSelected(position: number): void;
            onPageScrollStateChanged(state: number): void;
        }
        interface PageTransformer {
            transformPage(page: View, position: number): void;
        }
        interface OnAdapterChangeListener {
            onAdapterChanged(oldAdapter: PagerAdapter, newAdapter: PagerAdapter): void;
        }
        class LayoutParams extends ViewGroup.LayoutParams {
            isDecor: boolean;
            gravity: number;
            widthFactor: number;
            needsMeasure: boolean;
            position: number;
            childIndex: number;
            constructor();
            _createAttrChangeHandler(mergeHandler: android.view.View.AttrChangeHandler): void;
        }
    }
}
declare module com.jakewharton.salvage {
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import PagerAdapter = android.support.v4.view.PagerAdapter;
    abstract class RecyclingPagerAdapter extends PagerAdapter {
        static IGNORE_ITEM_VIEW_TYPE: number;
        private recycleBin;
        constructor();
        notifyDataSetChanged(): void;
        instantiateItem(container: android.view.ViewGroup, position: number): any;
        destroyItem(container: android.view.ViewGroup, position: number, object: any): void;
        isViewFromObject(view: android.view.View, object: any): boolean;
        getViewTypeCount(): number;
        getItemViewType(position: number): number;
        abstract getView(position: number, convertView: View, parent: ViewGroup): View;
    }
}
declare module androidui {
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    class AndroidUI {
        static DomClassName: string;
        static BindTOElementName: string;
        element: HTMLElement;
        private _canvas;
        private _viewRootImpl;
        private _rootLayout;
        private rootStyleElement;
        private rootResourceElement;
        private _windowBound;
        windowBound: android.graphics.Rect;
        private motionEvent;
        private ketEvent;
        private AndroidID;
        constructor(element: HTMLElement);
        private init();
        private initInflateView();
        private initElementStyle();
        private refreshWindowBound();
        private initFocus();
        private initEvent();
        private initTouchEvent();
        private initMouseEvent();
        private initKeyEvent();
        private initGenericEvent();
        private initListenSizeChange();
        notifySizeChange(): void;
        setContentView(view: View): void;
        addContentView(view: View, params?: ViewGroup.LayoutParams): void;
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

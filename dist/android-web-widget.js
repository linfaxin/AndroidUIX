var android;
(function (android) {
    var util;
    (function (util) {
        class SparseArray {
            constructor(initialCapacity) {
                this.map = new Map();
            }
            clone() {
                let clone = new SparseArray();
                clone.map = new Map(this.map);
                return clone;
            }
            get(key, valueIfKeyNotFound) {
                return this.map.get(key) || valueIfKeyNotFound;
            }
            delete(key) {
                this.map.delete(key);
            }
            remove(key) {
                this.delete(key);
            }
            removeAt(index) {
                this.removeAtRange(index);
            }
            removeAtRange(index, size = 1) {
                let keys = [...this.map.keys()];
                let end = Math.min(this.map.size, index + size);
                for (let i = index; i < end; i++) {
                    this.map.delete(keys[i]);
                }
            }
            put(key, value) {
                this.map.set(key, value);
            }
            size() {
                return this.map.size;
            }
            keyAt(index) {
                return [...this.map.keys()][index];
            }
            valueAt(index) {
                return [...this.map.values()][index];
            }
            setValueAt(index, value) {
                let key = this.keyAt(index);
                this.map.set(key, value);
            }
            indexOfKey(key) {
                return [...this.map.keys()].indexOf(key);
            }
            indexOfValue(value) {
                return [...this.map.values()].indexOf(value);
            }
            clear() {
                this.map.clear();
            }
            append(key, value) {
                this.put(key, value);
            }
        }
        util.SparseArray = SparseArray;
    })(util = android.util || (android.util = {}));
})(android || (android = {}));
var android;
(function (android) {
    var util;
    (function (util) {
        class Log {
            static getPriorityString(priority) {
                if (priority > Log.PriorityString.length)
                    return "";
                return Log.PriorityString[priority - 2];
            }
            static v(tag, msg, tr) {
                console.log(Log.getLogMsg(Log.VERBOSE, tag, msg));
                if (tr)
                    console.log(tr);
            }
            static d(tag, msg) {
                console.debug(Log.getLogMsg(Log.DEBUG, tag, msg));
            }
            static i(tag, msg, tr) {
                console.info(Log.getLogMsg(Log.INFO, tag, msg));
                if (tr)
                    console.info(tr);
            }
            static w(tag, msg, tr) {
                console.warn(Log.getLogMsg(Log.WARN, tag, msg));
                if (tr)
                    console.warn(tr);
            }
            static e(tag, msg, tr) {
                console.error(Log.getLogMsg(Log.ERROR, tag, msg));
                if (tr)
                    console.error(tr);
            }
            static getLogMsg(priority, tag, msg) {
                let d = new Date();
                let dateFormat = d.toLocaleTimeString() + '.' + d.getUTCMilliseconds();
                return "[" + Log.getPriorityString(priority) + "] " + dateFormat + " \t " + tag + " \t " + msg;
            }
        }
        Log.View_DBG = true;
        Log.VERBOSE = 2;
        Log.DEBUG = 3;
        Log.INFO = 4;
        Log.WARN = 5;
        Log.ERROR = 6;
        Log.ASSERT = 7;
        Log.PriorityString = ["VERBOSE", "DEBUG", "INFO", "WARN", "ERROR", "ASSERT"];
        util.Log = Log;
    })(util = android.util || (android.util = {}));
})(android || (android = {}));
var java;
(function (java) {
    var lang;
    (function (lang) {
        class StringBuilder {
            constructor(arg) {
                this.array = [];
                if (!Number.isInteger(arg) && arg) {
                    this.append(arg);
                }
            }
            length() {
                return this.array.length;
            }
            append(str) {
                str = str + "";
                this.array.push(...str.split(''));
                return this;
            }
            setLength(length) {
                let arrayLength = this.array.length;
                if (length === arrayLength)
                    return;
                if (length < arrayLength) {
                    this.array = this.array.splice(length, arrayLength - length);
                }
                else {
                    for (let i = 0; i < arrayLength - length; i++) {
                        this.array.push(' ');
                    }
                }
            }
            toString() {
                return this.array.join("");
            }
        }
        lang.StringBuilder = StringBuilder;
    })(lang = java.lang || (java.lang = {}));
})(java || (java = {}));
///<reference path="../../java/lang/StringBuilder.ts"/>
var android;
(function (android) {
    var graphics;
    (function (graphics) {
        var StringBuilder = java.lang.StringBuilder;
        class Rect {
            constructor(...args) {
                this.left = 0;
                this.top = 0;
                this.right = 0;
                this.bottom = 0;
                if (args.length === 1) {
                    let rect = args[0];
                    this.left = rect.left;
                    this.top = rect.top;
                    this.right = rect.right;
                    this.bottom = rect.bottom;
                }
                else if (args.length === 4 || args.length === 0) {
                    let [left = 0, top = 0, right = 0, bottom = 0] = args;
                    this.left = left;
                    this.top = top;
                    this.right = right;
                    this.bottom = bottom;
                }
            }
            equals(r) {
                if (this === r)
                    return true;
                if (!r || !(r instanceof Rect))
                    return false;
                return this.left === r.left && this.top === r.top
                    && this.right === r.right && this.bottom === r.bottom;
            }
            toString() {
                let sb = new StringBuilder();
                sb.append("Rect(");
                sb.append(this.left);
                sb.append(", ");
                sb.append(this.top);
                sb.append(" - ");
                sb.append(this.right);
                sb.append(", ");
                sb.append(this.bottom);
                sb.append(")");
                return sb.toString();
            }
            toShortString(sb = new StringBuilder()) {
                sb.setLength(0);
                sb.append('[');
                sb.append(this.left);
                sb.append(',');
                sb.append(this.top);
                sb.append("][");
                sb.append(this.right);
                sb.append(',');
                sb.append(this.bottom);
                sb.append(']');
                return sb.toString();
            }
            flattenToString() {
                let sb = new StringBuilder(32);
                sb.append(this.left);
                sb.append(' ');
                sb.append(this.top);
                sb.append(' ');
                sb.append(this.right);
                sb.append(' ');
                sb.append(this.bottom);
                return sb.toString();
            }
            static unflattenFromString(str) {
                let parts = str.split(" ");
                return new Rect(Number.parseInt(parts[0]), Number.parseInt(parts[1]), Number.parseInt(parts[2]), Number.parseInt(parts[3]));
            }
            isEmpty() {
                return this.left >= this.right || this.top >= this.bottom;
            }
            width() {
                return this.right - this.left;
            }
            height() {
                return this.bottom - this.top;
            }
            centerX() {
                return (this.left + this.right) >> 1;
            }
            centerY() {
                return (this.top + this.bottom) >> 1;
            }
            exactCenterX() {
                return (this.left + this.right) * 0.5;
            }
            exactCenterY() {
                return (this.top + this.bottom) * 0.5;
            }
            setEmpty() {
                this.left = this.right = this.top = this.bottom = 0;
            }
            set(...args) {
                if (args.length === 1) {
                    let rect = args[0];
                    [this.left, this.top, this.right, this.bottom] = [rect.left, rect.top, rect.right, rect.bottom];
                }
                else if (args.length === 4) {
                    let [left = 0, top = 0, right = 0, bottom = 0] = args;
                    this.left = left;
                    this.top = top;
                    this.right = right;
                    this.bottom = bottom;
                }
            }
            offset(dx, dy) {
                this.left += dx;
                this.top += dy;
                this.right += dx;
                this.bottom += dy;
            }
            offsetTo(newLeft, newTop) {
                this.right += newLeft - this.left;
                this.bottom += newTop - this.top;
                this.left = newLeft;
                this.top = newTop;
            }
            inset(dx, dy) {
                this.left += dx;
                this.top += dy;
                this.right -= dx;
                this.bottom -= dy;
            }
            contains(...args) {
                if (args.length === 1) {
                    let r = args[0];
                    return this.left < this.right && this.top < this.bottom
                        && this.left <= r.left && this.top <= r.top && this.right >= r.right && this.bottom >= r.bottom;
                }
                else if (args.length === 2) {
                    let [x, y] = args;
                    return this.left < this.right && this.top < this.bottom
                        && x >= this.left && x < this.right && y >= this.top && y < this.bottom;
                }
                else {
                    let [left = 0, top = 0, right = 0, bottom = 0] = args;
                    return this.left < this.right && this.top < this.bottom
                        && this.left <= left && this.top <= top
                        && this.right >= right && this.bottom >= bottom;
                }
            }
            intersect(...args) {
                if (args.length === 1) {
                    let rect = args[0];
                    return this.intersect(rect.left, rect.top, rect.right, rect.bottom);
                }
                else {
                    let [left = 0, top = 0, right = 0, bottom = 0] = args;
                    if (this.left < right && left < this.right && this.top < bottom && top < this.bottom) {
                        if (this.left < left)
                            this.left = left;
                        if (this.top < top)
                            this.top = top;
                        if (this.right > right)
                            this.right = right;
                        if (this.bottom > bottom)
                            this.bottom = bottom;
                        return true;
                    }
                    return false;
                }
            }
            union(...args) {
                if (arguments.length === 1) {
                    let rect = args[0];
                    this.union(rect.left, rect.top, rect.right, rect.bottom);
                }
                else if (arguments.length === 2) {
                    let [x = 0, y = 0] = args;
                    if (x < this.left) {
                        this.left = x;
                    }
                    else if (x > this.right) {
                        this.right = x;
                    }
                    if (y < this.top) {
                        this.top = y;
                    }
                    else if (y > this.bottom) {
                        this.bottom = y;
                    }
                }
                else {
                    let [left = 0, top = 0, right = 0, bottom = 0] = args;
                    if ((left < right) && (top < bottom)) {
                        if ((this.left < this.right) && (this.top < this.bottom)) {
                            if (this.left > left)
                                this.left = left;
                            if (this.top > top)
                                this.top = top;
                            if (this.right < right)
                                this.right = right;
                            if (this.bottom < bottom)
                                this.bottom = bottom;
                        }
                        else {
                            this.left = left;
                            this.top = top;
                            this.right = right;
                            this.bottom = bottom;
                        }
                    }
                }
            }
            sort() {
                if (this.left > this.right) {
                    [this.left, this.right] = [this.right, this.left];
                }
                if (this.top > this.bottom) {
                    [this.top, this.bottom] = [this.bottom, this.top];
                }
            }
            scale(scale) {
                if (scale != 1) {
                    this.left = this.left * scale;
                    this.top = this.top * scale;
                    this.right = this.right * scale;
                    this.bottom = this.bottom * scale;
                }
            }
        }
        graphics.Rect = Rect;
    })(graphics = android.graphics || (android.graphics = {}));
})(android || (android = {}));
var android;
(function (android) {
    var graphics;
    (function (graphics) {
        class PixelFormat {
        }
        PixelFormat.UNKNOWN = 0;
        PixelFormat.TRANSLUCENT = -3;
        PixelFormat.TRANSPARENT = -2;
        PixelFormat.OPAQUE = -1;
        PixelFormat.RGBA_8888 = 1;
        PixelFormat.RGBX_8888 = 2;
        PixelFormat.RGB_888 = 3;
        PixelFormat.RGB_565 = 4;
        graphics.PixelFormat = PixelFormat;
    })(graphics = android.graphics || (android.graphics = {}));
})(android || (android = {}));
var java;
(function (java) {
    var lang;
    (function (lang) {
        var ref;
        (function (ref) {
            const key = "referent";
            class WeakReference {
                constructor(referent) {
                    this.weakMap = new WeakMap();
                    this.weakMap.set(key, referent);
                }
                get() {
                    return this.weakMap.get(key);
                }
                set(value) {
                    this.weakMap.set(key, value);
                }
                clear() {
                    this.weakMap.delete(key);
                }
            }
            ref.WeakReference = WeakReference;
        })(ref = lang.ref || (lang.ref = {}));
    })(lang = java.lang || (java.lang = {}));
})(java || (java = {}));
/**
 * Created by linfaxin on 15/10/3.
 */
///<reference path="../Rect.ts"/>
///<reference path="../PixelFormat.ts"/>
///<reference path="../../../java/lang/ref/WeakReference.ts"/>
///<reference path="../../../java/lang/Runnable.ts"/>
var android;
(function (android) {
    var graphics;
    (function (graphics) {
        var drawable;
        (function (drawable) {
            var Rect = android.graphics.Rect;
            var PixelFormat = android.graphics.PixelFormat;
            var WeakReference = java.lang.ref.WeakReference;
            const ZERO_BOUNDS_RECT = new Rect();
            class Drawable {
                constructor() {
                    this.mBounds = ZERO_BOUNDS_RECT;
                    this.mStateSet = [];
                    this.mLevel = 0;
                    this.mVisible = true;
                }
                draw(canvas) {
                }
                setBounds(...args) {
                    if (args.length === 1) {
                        let rect = args[0];
                        return this.setBounds(rect.left, rect.top, rect.right, rect.bottom);
                    }
                    else {
                        let [left = 0, top = 0, right = 0, bottom = 0] = args;
                        let oldBounds = this.mBounds;
                        if (oldBounds == ZERO_BOUNDS_RECT) {
                            oldBounds = this.mBounds = new Rect();
                        }
                        if (oldBounds.left != left || oldBounds.top != top ||
                            oldBounds.right != right || oldBounds.bottom != bottom) {
                            if (!oldBounds.isEmpty()) {
                                this.invalidateSelf();
                            }
                            this.mBounds.set(left, top, right, bottom);
                            this.onBoundsChange(this.mBounds);
                        }
                    }
                }
                copyBounds(bounds = new Rect()) {
                    bounds.set(this.mBounds);
                    return bounds;
                }
                getBounds() {
                    if (this.mBounds == ZERO_BOUNDS_RECT) {
                        this.mBounds = new Rect();
                    }
                    return this.mBounds;
                }
                setCallback(cb) {
                    this.mCallback = new WeakReference(cb);
                }
                getCallback() {
                    if (this.mCallback != null) {
                        return this.mCallback.get();
                    }
                    return null;
                }
                invalidateSelf() {
                    let callback = this.getCallback();
                    if (callback != null) {
                        callback.invalidateDrawable(this);
                    }
                }
                scheduleSelf(what, when) {
                    let callback = this.getCallback();
                    if (callback != null) {
                        callback.scheduleDrawable(this, what, when);
                    }
                }
                unscheduleSelf(what) {
                    let callback = this.getCallback();
                    if (callback != null) {
                        callback.unscheduleDrawable(this, what);
                    }
                }
                setAlpha(alpha) {
                }
                getAlpha() {
                    return 0xFF;
                }
                isStateful() {
                    return false;
                }
                setState(stateSet) {
                    stateSet = stateSet || [];
                    if (this.mStateSet && stateSet && this.mStateSet.toString() === stateSet.toString()) {
                        return false;
                    }
                    this.mStateSet = stateSet;
                    return this.onStateChange(stateSet);
                }
                getState() {
                    return this.mStateSet;
                }
                jumpToCurrentState() {
                }
                getCurrent() {
                    return this;
                }
                setLevel(level) {
                    if (this.mLevel != level) {
                        this.mLevel = level;
                        return this.onLevelChange(level);
                    }
                    return false;
                }
                getLevel() {
                    return this.mLevel;
                }
                setVisible(visible, restart) {
                    let changed = this.mVisible != visible;
                    if (changed) {
                        this.mVisible = visible;
                        this.invalidateSelf();
                    }
                    return changed;
                }
                isVisible() {
                    return this.mVisible;
                }
                setAutoMirrored(mirrored) {
                }
                isAutoMirrored() {
                    return false;
                }
                getOpacity() {
                }
                static resolveOpacity(op1, op2) {
                    if (op1 == op2) {
                        return op1;
                    }
                    if (op1 == PixelFormat.UNKNOWN || op2 == PixelFormat.UNKNOWN) {
                        return PixelFormat.UNKNOWN;
                    }
                    if (op1 == PixelFormat.TRANSLUCENT || op2 == PixelFormat.TRANSLUCENT) {
                        return PixelFormat.TRANSLUCENT;
                    }
                    if (op1 == PixelFormat.TRANSPARENT || op2 == PixelFormat.TRANSPARENT) {
                        return PixelFormat.TRANSPARENT;
                    }
                    return PixelFormat.OPAQUE;
                }
                onStateChange(state) {
                    return false;
                }
                onLevelChange(level) {
                    return false;
                }
                onBoundsChange(bounds) {
                }
                getIntrinsicWidth() {
                    return -1;
                }
                getIntrinsicHeight() {
                    return -1;
                }
                getMinimumWidth() {
                    let intrinsicWidth = this.getIntrinsicWidth();
                    return intrinsicWidth > 0 ? intrinsicWidth : 0;
                }
                getMinimumHeight() {
                    let intrinsicHeight = this.getIntrinsicHeight();
                    return intrinsicHeight > 0 ? intrinsicHeight : 0;
                }
                getPadding(padding) {
                    padding.set(0, 0, 0, 0);
                    return false;
                }
                mutate() {
                    return this;
                }
                getConstantState() {
                    return null;
                }
            }
            drawable.Drawable = Drawable;
        })(drawable = graphics.drawable || (graphics.drawable = {}));
    })(graphics = android.graphics || (android.graphics = {}));
})(android || (android = {}));
var java;
(function (java) {
    var lang;
    (function (lang) {
        var util;
        (function (util) {
            var concurrent;
            (function (concurrent) {
                class CopyOnWriteArrayList {
                    constructor() {
                        this.mData = [];
                        this.isDataNew = true;
                    }
                    [Symbol.iterator]() {
                        this.isDataNew = false;
                        return this.mData[Symbol.iterator]();
                    }
                    checkNewData() {
                        if (!this.isDataNew) {
                            this.isDataNew = true;
                            this.mData = [...this.mData];
                        }
                    }
                    size() {
                        return this.mData.length;
                    }
                    add(...items) {
                        this.checkNewData();
                        this.mData.push(...items);
                    }
                    addAll(array) {
                        this.checkNewData();
                        this.mData.push(...array.mData);
                    }
                    remove(item) {
                        this.checkNewData();
                        this.mData.splice(this.mData.indexOf(item), 1);
                    }
                }
                concurrent.CopyOnWriteArrayList = CopyOnWriteArrayList;
            })(concurrent = util.concurrent || (util.concurrent = {}));
        })(util = lang.util || (lang.util = {}));
    })(lang = java.lang || (java.lang = {}));
})(java || (java = {}));
var android;
(function (android) {
    var util;
    (function (util) {
        class Access {
            get(index) {
                return this.mData[index];
            }
            size() {
                return this.mSize;
            }
        }
        class CopyOnWriteArray {
            constructor() {
                this.mData = [];
                this.mAccess = new Access();
            }
            getArray() {
                if (this.mStart) {
                    if (this.mDataCopy == null)
                        this.mDataCopy = [...this.mData];
                    return this.mDataCopy;
                }
                return this.mData;
            }
            start() {
                if (this.mStart)
                    throw new Error("Iteration already started");
                this.mStart = true;
                this.mDataCopy = null;
                this.mAccess.mData = this.mData;
                this.mAccess.mSize = this.mData.length;
                return this.mAccess.mData;
            }
            end() {
                if (!this.mStart)
                    throw new Error("Iteration not started");
                this.mStart = false;
                if (this.mDataCopy != null) {
                    this.mData = this.mDataCopy;
                    this.mAccess.mData = [];
                    this.mAccess.mSize = 0;
                }
                this.mDataCopy = null;
            }
            size() {
                return this.getArray().length;
            }
            add(...items) {
                this.getArray().push(...items);
            }
            addAll(array) {
                this.getArray().push(...array.mData);
            }
            remove(item) {
                this.getArray().splice(this.getArray().indexOf(item), 1);
            }
        }
        util.CopyOnWriteArray = CopyOnWriteArray;
    })(util = android.util || (android.util = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/8.
 */
///<reference path="../../java/lang/util/concurrent/CopyOnWriteArrayList.ts"/>
///<reference path="../util/CopyOnWriteArray.ts"/>
var android;
(function (android) {
    var view;
    (function (view) {
        class ViewTreeObserver {
            dispatchOnWindowAttachedChange(attached) {
                let listeners = this.mOnWindowAttachListeners;
                if (listeners != null && listeners.size() > 0) {
                    for (let listener of listeners) {
                        if (attached)
                            listener.onWindowAttached();
                        else
                            listener.onWindowDetached();
                    }
                }
            }
            dispatchOnGlobalLayout() {
                let listeners = this.mOnGlobalLayoutListeners;
                if (listeners != null && listeners.size() > 0) {
                    let access = listeners.start();
                    try {
                        let count = access.length;
                        for (let i = 0; i < count; i++) {
                            access[i].onGlobalLayout();
                        }
                    }
                    finally {
                        listeners.end();
                    }
                }
            }
            dispatchOnPreDraw() {
                let cancelDraw = false;
                const listeners = this.mOnPreDrawListeners;
                if (listeners != null && listeners.size() > 0) {
                    let access = listeners.start();
                    try {
                        let count = access.length;
                        for (let i = 0; i < count; i++) {
                            cancelDraw = cancelDraw || !(access[i].onPreDraw());
                        }
                    }
                    finally {
                        listeners.end();
                    }
                }
                return cancelDraw;
            }
        }
        view.ViewTreeObserver = ViewTreeObserver;
    })(view = android.view || (android.view = {}));
})(android || (android = {}));
var android;
(function (android) {
    var view;
    (function (view) {
        class MotionEvent {
        }
        view.MotionEvent = MotionEvent;
    })(view = android.view || (android.view = {}));
})(android || (android = {}));
var android;
(function (android) {
    var util;
    (function (util) {
        class Pools {
        }
        util.Pools = Pools;
        (function (Pools) {
            class SimplePool {
                constructor(maxPoolSize) {
                    this.mPoolSize = 0;
                    if (maxPoolSize <= 0) {
                        throw new Error("The max pool size must be > 0");
                    }
                    this.mPool = new Array(maxPoolSize);
                }
                acquire() {
                    if (this.mPoolSize > 0) {
                        const lastPooledIndex = this.mPoolSize - 1;
                        let instance = this.mPool[lastPooledIndex];
                        this.mPool[lastPooledIndex] = null;
                        this.mPoolSize--;
                        return instance;
                    }
                    return null;
                }
                release(instance) {
                    if (this.isInPool(instance)) {
                        throw new Error("Already in the pool!");
                    }
                    if (this.mPoolSize < this.mPool.length) {
                        this.mPool[this.mPoolSize] = instance;
                        this.mPoolSize++;
                        return true;
                    }
                    return false;
                }
                isInPool(instance) {
                    for (let i = 0; i < this.mPoolSize; i++) {
                        if (this.mPool[i] == instance) {
                            return true;
                        }
                    }
                    return false;
                }
            }
            Pools.SimplePool = SimplePool;
            class SynchronizedPool extends SimplePool {
            }
            Pools.SynchronizedPool = SynchronizedPool;
        })(Pools = util.Pools || (util.Pools = {}));
    })(util = android.util || (android.util = {}));
})(android || (android = {}));
var android;
(function (android) {
    var os;
    (function (os) {
        class SystemClock {
            static uptimeMillis() {
                return new Date().getTime();
            }
        }
        os.SystemClock = SystemClock;
    })(os = android.os || (android.os = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/5.
 */
///<reference path="Handler.ts"/>
///<reference path="../../java/lang/Runnable.ts"/>
///<reference path="../../java/lang/StringBuilder.ts"/>
///<reference path="../util/Pools.ts"/>
///<reference path="SystemClock.ts"/>
var android;
(function (android) {
    var os;
    (function (os) {
        var StringBuilder = java.lang.StringBuilder;
        var Pools = android.util.Pools;
        class Message {
            constructor() {
                this.what = 0;
                this.arg1 = 0;
                this.arg2 = 0;
                this.when = 0;
            }
            recycle() {
                this.clearForRecycle();
                Message.sPool.release(this);
            }
            copyFrom(o) {
                this.what = o.what;
                this.arg1 = o.arg1;
                this.arg2 = o.arg2;
                this.obj = o.obj;
            }
            sendToTarget() {
                this.target.sendMessage(this);
            }
            clearForRecycle() {
                this.what = 0;
                this.arg1 = 0;
                this.arg2 = 0;
                this.obj = null;
                this.when = 0;
                this.target = null;
                this.callback = null;
            }
            toString(now = os.SystemClock.uptimeMillis()) {
                let b = new StringBuilder();
                b.append("{ what=");
                b.append(this.what);
                b.append(" when=");
                b.append(this.when - now).append("ms");
                if (this.arg1 != 0) {
                    b.append(" arg1=");
                    b.append(this.arg1);
                }
                if (this.arg2 != 0) {
                    b.append(" arg2=");
                    b.append(this.arg2);
                }
                if (this.obj != null) {
                    b.append(" obj=");
                    b.append(this.obj);
                }
                b.append(" }");
                return b.toString();
            }
            static obtain(...args) {
                let m = Message.sPool.acquire();
                m = m || new Message();
                if (args.length === 1 && args[0] instanceof Message) {
                    let orig = args[0];
                    [m.target, m.what, m.arg1, m.arg2, m.obj, m.callback] =
                        [orig.target, orig.what, orig.arg1, orig.arg2, orig.obj, orig.callback];
                }
                else if (args.length === 2) {
                    [m.what = 0, m.callback] = args;
                }
                else if (args.length === 3) {
                    [m.what = 0, m.arg1 = 0, m.obj] = args;
                }
                else {
                    [m.target, m.what = 0, m.arg1 = 0, m.arg2 = 0, m.obj, m.callback] = args;
                }
                return m;
            }
        }
        Message.sPool = new Pools.SynchronizedPool(10);
        os.Message = Message;
    })(os = android.os || (android.os = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/5.
 */
///<reference path="Message.ts"/>
///<reference path="Handler.ts"/>
///<reference path="../../java/lang/Runnable.ts"/>
var android;
(function (android) {
    var os;
    (function (os) {
        class MessageQueue {
            constructor() {
                this.messages = new Map();
            }
            getMessages(h, args, object) {
                let msgs = [];
                if (h == null) {
                    return msgs;
                }
                if (typeof args === "number") {
                    let what = args;
                    for (let p of this.messages.keys()) {
                        if (p.target == h && p.what == what && (object == null || p.obj == object)) {
                            msgs.push(p);
                        }
                    }
                }
                else {
                    let r = args;
                    for (let p of this.messages.keys()) {
                        if (p.target == h && p.callback == r && (object == null || p.obj == object)) {
                            msgs.push(p);
                        }
                    }
                }
                return msgs;
            }
            hasMessages(h, args, object) {
                return this.getMessages(h, args, object).length > 0;
            }
            addMessage(handler, msg, delayHandleID) {
                this.messages.set(msg, delayHandleID);
            }
            recycleMessage(handler, message) {
                try {
                    message.recycle();
                }
                catch (e) {
                }
                let oldId = this.messages.get(message);
                if (oldId !== undefined) {
                    clearTimeout(oldId);
                    this.messages.delete(message);
                }
            }
            removeMessages(h, args, object) {
                let p = this.getMessages(h, args, object);
                if (p && p.length > 0) {
                    p.forEach((item) => this.recycleMessage(h, item));
                }
            }
            removeCallbacksAndMessages(h, object) {
                if (h == null) {
                    return;
                }
                for (let p of this.messages.keys()) {
                    if (p != null && p.target == h && (object == null || p.obj == object)) {
                        this.recycleMessage(h, p);
                    }
                }
            }
        }
        os.MessageQueue = MessageQueue;
    })(os = android.os || (android.os = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/5.
 */
///<reference path="Message.ts"/>
///<reference path="MessageQueue.ts"/>
///<reference path="../../java/lang/Runnable.ts"/>
///<reference path="SystemClock.ts"/>
var android;
(function (android) {
    var os;
    (function (os) {
        class Handler {
            constructor(mCallback) {
                this.mQueue = new os.MessageQueue();
                this.mCallback = mCallback;
            }
            handleMessage(msg) {
            }
            dispatchMessage(msg) {
                if (msg.callback != null) {
                    msg.callback.run.call(msg.callback);
                }
                else {
                    if (this.mCallback != null) {
                        if (this.mCallback.handleMessage(msg)) {
                            return;
                        }
                    }
                    this.handleMessage(msg);
                }
            }
            obtainMessage(...args) {
                if (args.length === 2) {
                    let [what, obj] = args;
                    return os.Message.obtain(this, what, obj);
                }
                else {
                    let [what, arg1, arg2, obj] = args;
                    return os.Message.obtain(this, what, arg1, arg2, obj);
                }
            }
            post(r) {
                return this.sendMessageDelayed(Handler.getPostMessage(r), 0);
            }
            postAtTime(...args) {
                if (args.length === 2) {
                    let [r, uptimeMillis] = args;
                    return this.sendMessageAtTime(Handler.getPostMessage(r), uptimeMillis);
                }
                else {
                    let [r, token, uptimeMillis] = args;
                    return this.sendMessageAtTime(Handler.getPostMessage(r, token), uptimeMillis);
                }
            }
            postDelayed(r, delayMillis) {
                return this.sendMessageDelayed(Handler.getPostMessage(r), delayMillis);
            }
            postAtFrontOfQueue(r) {
                return this.post(r);
            }
            removeCallbacks(r, token) {
                this.mQueue.removeMessages(this, r, token);
            }
            sendMessage(msg) {
                return this.sendMessageDelayed(msg, 0);
            }
            sendEmptyMessage(what) {
                return this.sendEmptyMessageDelayed(what, 0);
            }
            sendEmptyMessageDelayed(what, delayMillis) {
                let msg = os.Message.obtain();
                msg.what = what;
                return this.sendMessageDelayed(msg, delayMillis);
            }
            sendEmptyMessageAtTime(what, uptimeMillis) {
                let msg = os.Message.obtain();
                msg.what = what;
                return this.sendMessageAtTime(msg, uptimeMillis);
            }
            sendMessageDelayed(msg, delayMillis) {
                if (delayMillis < 0) {
                    delayMillis = 0;
                }
                msg.target = this;
                let id = setTimeout(() => {
                    this.dispatchMessage(msg);
                    this.mQueue.recycleMessage(this, msg);
                }, delayMillis);
                this.mQueue.addMessage(this, msg, id);
                return true;
            }
            sendMessageAtTime(msg, uptimeMillis) {
                return this.sendMessageDelayed(msg, uptimeMillis - os.SystemClock.uptimeMillis());
            }
            sendMessageAtFrontOfQueue(msg) {
                return this.sendMessage(msg);
            }
            removeMessages(what, object) {
                this.mQueue.removeMessages(this, what, object);
            }
            removeCallbacksAndMessages(token) {
                this.mQueue.removeCallbacksAndMessages(this, token);
            }
            hasMessages(what, object) {
                return this.mQueue.hasMessages(this, what, object);
            }
            static getPostMessage(r, token) {
                let m = os.Message.obtain();
                m.obj = token;
                m.callback = r;
                return m;
            }
        }
        os.Handler = Handler;
    })(os = android.os || (android.os = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/9/27.
 */
///<reference path="../util/SparseArray.ts"/>
///<reference path="../util/Log.ts"/>
///<reference path="../graphics/drawable/Drawable.ts"/>
///<reference path="../../java/lang/StringBuilder.ts"/>
///<reference path="../../java/lang/util/concurrent/CopyOnWriteArrayList.ts"/>
///<reference path="ViewRootImpl.ts"/>
///<reference path="ViewParent.ts"/>
///<reference path="ViewGroup.ts"/>
///<reference path="ViewOverlay.ts"/>
///<reference path="ViewTreeObserver.ts"/>
///<reference path="MotionEvent.ts"/>
///<reference path="../os/Handler.ts"/>
///<reference path="../graphics/Rect.ts"/>
var android;
(function (android) {
    var view;
    (function (view) {
        var SparseArray = android.util.SparseArray;
        var StringBuilder = java.lang.StringBuilder;
        var Log = android.util.Log;
        var Rect = android.graphics.Rect;
        class View {
            constructor() {
                this.mPrivateFlags = 0;
                this.mPrivateFlags2 = 0;
                this.mPrivateFlags3 = 0;
                this.mOldWidthMeasureSpec = Number.MIN_SAFE_INTEGER;
                this.mOldHeightMeasureSpec = Number.MIN_SAFE_INTEGER;
                this.mMeasuredWidth = 0;
                this.mMeasuredHeight = 0;
                this.mBackgroundSizeChanged = false;
                this.mMinWidth = 0;
                this.mMinHeight = 0;
                this.mViewFlags = 0;
                this.mWindowAttachCount = 0;
                this.mLeft = 0;
                this.mRight = 0;
                this.mTop = 0;
                this.mBottom = 0;
                this.mScrollX = 0;
                this.mScrollY = 0;
                this.mPaddingLeft = 0;
                this.mPaddingRight = 0;
                this.mPaddingTop = 0;
                this.mPaddingBottom = 0;
                this.bindElement = document.createElement(this.tagName());
                this.bindView = (this.bindElement['bindView'] = this);
            }
            getWidth() {
                return this.mRight - this.mLeft;
            }
            getHeight() {
                return this.mBottom - this.mTop;
            }
            getTop() {
                return this.mTop;
            }
            setTop(top) {
                if (top != this.mTop) {
                    if (this.mAttachInfo != null) {
                        let minTop;
                        let yLoc;
                        if (top < this.mTop) {
                            minTop = top;
                            yLoc = top - this.mTop;
                        }
                        else {
                            minTop = this.mTop;
                            yLoc = 0;
                        }
                        this.invalidate(0, yLoc, this.mRight - this.mLeft, this.mBottom - minTop);
                    }
                    let width = this.mRight - this.mLeft;
                    let oldHeight = this.mBottom - this.mTop;
                    this.mTop = top;
                    this.sizeChange(width, this.mBottom - this.mTop, width, oldHeight);
                    this.mBackgroundSizeChanged = true;
                }
            }
            getBottom() {
                return this.mBottom;
            }
            setBottom(bottom) {
                if (bottom != this.mBottom) {
                    if (this.mAttachInfo != null) {
                        let maxBottom;
                        if (bottom < this.mBottom) {
                            maxBottom = this.mBottom;
                        }
                        else {
                            maxBottom = bottom;
                        }
                        this.invalidate(0, 0, this.mRight - this.mLeft, maxBottom - this.mTop);
                    }
                    let width = this.mRight - this.mLeft;
                    let oldHeight = this.mBottom - this.mTop;
                    this.mBottom = bottom;
                    this.sizeChange(width, this.mBottom - this.mTop, width, oldHeight);
                    this.mBackgroundSizeChanged = true;
                }
            }
            getLeft() {
                return this.mLeft;
            }
            setLeft(left) {
                if (left != this.mLeft) {
                    if (this.mAttachInfo != null) {
                        let minLeft;
                        let xLoc;
                        if (left < this.mLeft) {
                            minLeft = left;
                            xLoc = left - this.mLeft;
                        }
                        else {
                            minLeft = this.mLeft;
                            xLoc = 0;
                        }
                        this.invalidate(xLoc, 0, this.mRight - minLeft, this.mBottom - this.mTop);
                    }
                    let oldWidth = this.mRight - this.mLeft;
                    let height = this.mBottom - this.mTop;
                    this.mLeft = left;
                    this.sizeChange(this.mRight - this.mLeft, height, oldWidth, height);
                    this.mBackgroundSizeChanged = true;
                }
            }
            getRight() {
                return this.mRight;
            }
            setRight(right) {
                if (right != this.mRight) {
                    if (this.mAttachInfo != null) {
                        let maxRight;
                        if (right < this.mRight) {
                            maxRight = this.mRight;
                        }
                        else {
                            maxRight = right;
                        }
                        this.invalidate(0, 0, maxRight - this.mLeft, this.mBottom - this.mTop);
                    }
                    let oldWidth = this.mRight - this.mLeft;
                    let height = this.mBottom - this.mTop;
                    this.mRight = right;
                    this.sizeChange(this.mRight - this.mLeft, height, oldWidth, height);
                    this.mBackgroundSizeChanged = true;
                }
            }
            getHandler() {
                let attachInfo = this.mAttachInfo;
                if (attachInfo != null) {
                    return attachInfo.mHandler;
                }
                return null;
            }
            getViewRootImpl() {
                if (this.mAttachInfo != null) {
                    return this.mAttachInfo.mViewRootImpl;
                }
                return null;
            }
            getParent() {
                return this.mParent;
            }
            setFlags(flags, mask) {
            }
            bringToFront() {
                if (this.mParent != null) {
                    this.mParent.bringChildToFront(this);
                }
            }
            onScrollChanged(l, t, oldl, oldt) {
                this.mBackgroundSizeChanged = true;
                let ai = this.mAttachInfo;
                if (ai != null) {
                    ai.mViewScrollChanged = true;
                }
            }
            onSizeChanged(w, h, oldw, oldh) {
            }
            getVisibility() {
                return this.mViewFlags & View.VISIBILITY_MASK;
            }
            setVisibility(visibility) {
                this.setFlags(visibility, View.VISIBILITY_MASK);
                if (this.mBackground != null)
                    this.mBackground.setVisible(visibility == View.VISIBLE, false);
            }
            isEnabled() {
                return (this.mViewFlags & View.ENABLED_MASK) == View.ENABLED;
            }
            setEnabled(enabled) {
                if (enabled == this.isEnabled())
                    return;
                this.setFlags(enabled ? View.ENABLED : View.DISABLED, View.ENABLED_MASK);
                this.refreshDrawableState();
                this.invalidate(true);
            }
            isLayoutRequested() {
                return (this.mPrivateFlags & View.PFLAG_FORCE_LAYOUT) == View.PFLAG_FORCE_LAYOUT;
            }
            getLayoutParams() {
                return this.mLayoutParams;
            }
            setLayoutParams(params) {
                if (params == null) {
                    throw new Error("Layout parameters cannot be null");
                }
                this.mLayoutParams = params;
                let p = this.mParent;
                if (p instanceof view.ViewGroup) {
                    p.onSetLayoutParams(this, params);
                }
                this.requestLayout();
            }
            requestLayout() {
                if (this.mMeasureCache != null)
                    this.mMeasureCache.clear();
                if (this.mAttachInfo != null && this.mAttachInfo.mViewRequestingLayout == null) {
                    let viewRoot = this.getViewRootImpl();
                    if (viewRoot != null && viewRoot.isInLayout()) {
                        if (!viewRoot.requestLayoutDuringLayout(this)) {
                            return;
                        }
                    }
                    this.mAttachInfo.mViewRequestingLayout = this;
                }
                this.mPrivateFlags |= View.PFLAG_FORCE_LAYOUT;
                this.mPrivateFlags |= View.PFLAG_INVALIDATED;
                if (this.mParent != null && !this.mParent.isLayoutRequested()) {
                    this.mParent.requestLayout();
                }
            }
            forceLayout() {
                if (this.mMeasureCache != null)
                    this.mMeasureCache.clear();
                this.mPrivateFlags |= View.PFLAG_FORCE_LAYOUT;
                this.mPrivateFlags |= View.PFLAG_INVALIDATED;
            }
            layout(l, t, r, b) {
                if ((this.mPrivateFlags3 & View.PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT) != 0) {
                    this.onMeasure(this.mOldWidthMeasureSpec, this.mOldHeightMeasureSpec);
                    this.mPrivateFlags3 &= ~View.PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT;
                }
                let oldL = this.mLeft;
                let oldT = this.mTop;
                let oldB = this.mBottom;
                let oldR = this.mRight;
                let changed = this.setFrame(l, t, r, b);
                if (changed)
                    this.syncBoundToElement();
                if (changed || (this.mPrivateFlags & View.PFLAG_LAYOUT_REQUIRED) == View.PFLAG_LAYOUT_REQUIRED) {
                    this.onLayout(changed, l, t, r, b);
                    this.mPrivateFlags &= ~View.PFLAG_LAYOUT_REQUIRED;
                    let li = this.mListenerInfo;
                    if (li != null && li.mOnLayoutChangeListeners != null) {
                        let listenersCopy = li.mOnLayoutChangeListeners.concat();
                        let numListeners = listenersCopy.length;
                        for (let i = 0; i < numListeners; ++i) {
                            listenersCopy[i].onLayoutChange(this, l, t, r, b, oldL, oldT, oldR, oldB);
                        }
                    }
                }
                this.mPrivateFlags &= ~View.PFLAG_FORCE_LAYOUT;
                this.mPrivateFlags3 |= View.PFLAG3_IS_LAID_OUT;
            }
            onLayout(changed, left, top, right, bottom) {
            }
            setFrame(left, top, right, bottom) {
                let changed = false;
                if (View.DBG) {
                    Log.i("View", this + " View.setFrame(" + left + "," + top + ","
                        + right + "," + bottom + ")");
                }
                if (this.mLeft != left || this.mRight != right || this.mTop != top || this.mBottom != bottom) {
                    changed = true;
                    let drawn = this.mPrivateFlags & View.PFLAG_DRAWN;
                    let oldWidth = this.mRight - this.mLeft;
                    let oldHeight = this.mBottom - this.mTop;
                    let newWidth = right - left;
                    let newHeight = bottom - top;
                    let sizeChanged = (newWidth != oldWidth) || (newHeight != oldHeight);
                    this.invalidate(sizeChanged);
                    this.mLeft = left;
                    this.mTop = top;
                    this.mRight = right;
                    this.mBottom = bottom;
                    this.mPrivateFlags |= View.PFLAG_HAS_BOUNDS;
                    if (sizeChanged) {
                        if ((this.mPrivateFlags & View.PFLAG_PIVOT_EXPLICITLY_SET) == 0) {
                        }
                        this.sizeChange(newWidth, newHeight, oldWidth, oldHeight);
                    }
                    if ((this.mViewFlags & View.VISIBILITY_MASK) == View.VISIBLE) {
                        this.mPrivateFlags |= View.PFLAG_DRAWN;
                        this.invalidate(sizeChanged);
                    }
                    this.mPrivateFlags |= drawn;
                    this.mBackgroundSizeChanged = true;
                }
                return changed;
            }
            sizeChange(newWidth, newHeight, oldWidth, oldHeight) {
                this.onSizeChanged(newWidth, newHeight, oldWidth, oldHeight);
                if (this.mOverlay != null) {
                    this.mOverlay.getOverlayView().setRight(newWidth);
                    this.mOverlay.getOverlayView().setBottom(newHeight);
                }
            }
            getMeasuredWidth() {
                return this.mMeasuredWidth & View.MEASURED_SIZE_MASK;
            }
            getMeasuredWidthAndState() {
                return this.mMeasuredWidth;
            }
            getMeasuredHeight() {
                return this.mMeasuredHeight & View.MEASURED_SIZE_MASK;
            }
            getMeasuredHeightAndState() {
                return this.mMeasuredHeight;
            }
            getMeasuredState() {
                return (this.mMeasuredWidth & View.MEASURED_STATE_MASK)
                    | ((this.mMeasuredHeight >> View.MEASURED_HEIGHT_STATE_SHIFT)
                        & (View.MEASURED_STATE_MASK >> View.MEASURED_HEIGHT_STATE_SHIFT));
            }
            measure(widthMeasureSpec, heightMeasureSpec) {
                let key = widthMeasureSpec << 32 | heightMeasureSpec & 0xffffffff;
                if (this.mMeasureCache == null)
                    this.mMeasureCache = new SparseArray();
                if ((this.mPrivateFlags & View.PFLAG_FORCE_LAYOUT) == View.PFLAG_FORCE_LAYOUT ||
                    widthMeasureSpec != this.mOldWidthMeasureSpec ||
                    heightMeasureSpec != this.mOldHeightMeasureSpec) {
                    this.mPrivateFlags &= ~View.PFLAG_MEASURED_DIMENSION_SET;
                    let cacheIndex = (this.mPrivateFlags & View.PFLAG_FORCE_LAYOUT) == View.PFLAG_FORCE_LAYOUT ? -1 :
                        this.mMeasureCache.indexOfKey(key);
                    if (cacheIndex < 0) {
                        this.onMeasure(widthMeasureSpec, heightMeasureSpec);
                        this.mPrivateFlags3 &= ~View.PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT;
                    }
                    else {
                        let value = this.mMeasureCache.valueAt(cacheIndex);
                        this.setMeasuredDimension(value >> 32, value);
                        this.mPrivateFlags3 |= View.PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT;
                    }
                    if ((this.mPrivateFlags & View.PFLAG_MEASURED_DIMENSION_SET) != View.PFLAG_MEASURED_DIMENSION_SET) {
                        throw new Error("onMeasure() did not set the"
                            + " measured dimension by calling"
                            + " setMeasuredDimension()");
                    }
                    this.mPrivateFlags |= View.PFLAG_LAYOUT_REQUIRED;
                }
                this.mOldWidthMeasureSpec = widthMeasureSpec;
                this.mOldHeightMeasureSpec = heightMeasureSpec;
                this.mMeasureCache.put(key, (this.mMeasuredWidth) << 32 | this.mMeasuredHeight & 0xffffffff);
            }
            onMeasure(widthMeasureSpec, heightMeasureSpec) {
                this.setMeasuredDimension(View.getDefaultSize(this.getSuggestedMinimumWidth(), widthMeasureSpec), View.getDefaultSize(this.getSuggestedMinimumHeight(), heightMeasureSpec));
            }
            setMeasuredDimension(measuredWidth, measuredHeight) {
                this.mMeasuredWidth = measuredWidth;
                this.mMeasuredHeight = measuredHeight;
                this.mPrivateFlags |= View.PFLAG_MEASURED_DIMENSION_SET;
            }
            static combineMeasuredStates(curState, newState) {
                return curState | newState;
            }
            static resolveSize(size, measureSpec) {
                return View.resolveSizeAndState(size, measureSpec, 0) & View.MEASURED_SIZE_MASK;
            }
            static resolveSizeAndState(size, measureSpec, childMeasuredState) {
                let MeasureSpec = View.MeasureSpec;
                let result = size;
                let specMode = MeasureSpec.getMode(measureSpec);
                let specSize = MeasureSpec.getSize(measureSpec);
                switch (specMode) {
                    case MeasureSpec.UNSPECIFIED:
                        result = size;
                        break;
                    case MeasureSpec.AT_MOST:
                        if (specSize < size) {
                            result = specSize | View.MEASURED_STATE_TOO_SMALL;
                        }
                        else {
                            result = size;
                        }
                        break;
                    case MeasureSpec.EXACTLY:
                        result = specSize;
                        break;
                }
                return result | (childMeasuredState & View.MEASURED_STATE_MASK);
            }
            static getDefaultSize(size, measureSpec) {
                let MeasureSpec = View.MeasureSpec;
                let result = size;
                let specMode = MeasureSpec.getMode(measureSpec);
                let specSize = MeasureSpec.getSize(measureSpec);
                switch (specMode) {
                    case MeasureSpec.UNSPECIFIED:
                        result = size;
                        break;
                    case MeasureSpec.AT_MOST:
                    case MeasureSpec.EXACTLY:
                        result = specSize;
                        break;
                }
                return result;
            }
            getSuggestedMinimumHeight() {
                return (this.mBackground == null) ? this.mMinHeight :
                    Math.max(this.mMinHeight, this.mBackground.getMinimumHeight());
            }
            getSuggestedMinimumWidth() {
                return (this.mBackground == null) ? this.mMinWidth :
                    Math.max(this.mMinWidth, this.mBackground.getMinimumWidth());
            }
            getMinimumHeight() {
                return this.mMinHeight;
            }
            setMinimumHeight(minHeight) {
                this.mMinHeight = minHeight;
                this.requestLayout();
            }
            getMinimumWidth() {
                return this.mMinWidth;
            }
            setMinimumWidth(minWidth) {
                this.mMinWidth = minWidth;
                this.requestLayout();
            }
            invalidate(...args) {
            }
            jumpDrawablesToCurrentState() {
                if (this.mBackground != null) {
                    this.mBackground.jumpToCurrentState();
                }
            }
            verifyDrawable(who) {
                return who == this.mBackground;
            }
            drawableStateChanged() {
                let d = this.mBackground;
                if (d != null && d.isStateful()) {
                    d.setState(this.getDrawableState());
                }
            }
            refreshDrawableState() {
                this.mPrivateFlags |= View.PFLAG_DRAWABLE_STATE_DIRTY;
            }
            getDrawableState() {
                return [];
            }
            assignParent(parent) {
                if (this.mParent == null) {
                    this.mParent = parent;
                }
                else if (parent == null) {
                    this.mParent = null;
                }
                else {
                    throw new Error("view " + this + " being added, but"
                        + " it already has a parent");
                }
            }
            onFinishInflate() {
            }
            dispatchAttachedToWindow(info, visibility) {
                this.mAttachInfo = info;
                if (this.mOverlay != null) {
                    this.mOverlay.getOverlayView().dispatchAttachedToWindow(info, visibility);
                }
                this.mWindowAttachCount++;
                this.mPrivateFlags |= View.PFLAG_DRAWABLE_STATE_DIRTY;
                if ((this.mPrivateFlags & View.PFLAG_SCROLL_CONTAINER) != 0) {
                    this.mAttachInfo.mScrollContainers.add(this);
                    this.mPrivateFlags |= View.PFLAG_SCROLL_CONTAINER_ADDED;
                }
                this.onAttachedToWindow();
                let li = this.mListenerInfo;
                let listeners = li != null ? li.mOnAttachStateChangeListeners : null;
                if (listeners != null && listeners.size() > 0) {
                    for (let listener of listeners) {
                        listener.onViewAttachedToWindow(this);
                    }
                }
                if ((this.mPrivateFlags & View.PFLAG_DRAWABLE_STATE_DIRTY) != 0) {
                    this.refreshDrawableState();
                }
            }
            onAttachedToWindow() {
                //if ((this.mPrivateFlags & View.PFLAG_REQUEST_TRANSPARENT_REGIONS) != 0) {
                //    this.mParent.requestTransparentRegion(this);
                //}
                this.mPrivateFlags3 &= ~View.PFLAG3_IS_LAID_OUT;
                this.jumpDrawablesToCurrentState();
            }
            dispatchDetachedFromWindow() {
                this.onDetachedFromWindow();
                let li = this.mListenerInfo;
                let listeners = li != null ? li.mOnAttachStateChangeListeners : null;
                if (listeners != null && listeners.size() > 0) {
                    for (let listener of listeners) {
                        listener.onViewDetachedFromWindow(this);
                    }
                }
                if ((this.mPrivateFlags & View.PFLAG_SCROLL_CONTAINER_ADDED) != 0) {
                    this.mAttachInfo.mScrollContainers.delete(this);
                    this.mPrivateFlags &= ~View.PFLAG_SCROLL_CONTAINER_ADDED;
                }
                this.mAttachInfo = null;
                if (this.mOverlay != null) {
                    this.mOverlay.getOverlayView().dispatchDetachedFromWindow();
                }
            }
            onDetachedFromWindow() {
                this.mPrivateFlags &= ~View.PFLAG_CANCEL_NEXT_UP_EVENT;
                this.mPrivateFlags3 &= ~View.PFLAG3_IS_LAID_OUT;
            }
            debug(depth = 0) {
                let originProto = Object.getPrototypeOf(this);
                console.dir(Object.assign(Object.create(originProto), this));
            }
            toString() {
                return this.tagName();
            }
            syncBoundToElement() {
                let bind = this.bindElement;
                bind.style.position = 'absolute';
                bind.style.boxSizing = 'border-box';
                bind.style.left = this.mLeft + 'px';
                bind.style.top = this.mTop + 'px';
                bind.style.width = this.getWidth() + 'px';
                bind.style.height = this.getHeight() + 'px';
            }
            tagName() {
                return "ANDROID-" + this.constructor.name;
            }
            findViewById(id) {
                let bindEle = this.bindElement.querySelector('#' + id);
                return bindEle ? bindEle['bindView'] : null;
            }
            static inflate(xml) {
                let className = xml.tagName.toUpperCase();
                if (className.startsWith('ANDROID-')) {
                    className = className.substring('ANDROID-'.length);
                }
                let rootView;
                for (let key in android['view']) {
                    if (key.toUpperCase() == className) {
                        rootView = new android.view[key]();
                        break;
                    }
                }
                if (!rootView) {
                    for (let key in android['widget']) {
                        if (key.toUpperCase() == className) {
                            rootView = new android['widget'][key]();
                            break;
                        }
                    }
                }
                if (!rootView) {
                    try {
                        rootView = window.eval(className);
                    }
                    catch (e) {
                    }
                }
                if (!rootView)
                    return null;
                if (rootView instanceof view.ViewGroup) {
                    Array.from(xml.children).forEach((item) => {
                        if (item instanceof HTMLElement) {
                            rootView.addView(View.inflate(item));
                        }
                    });
                }
                Array.from(xml.attributes).forEach((attr) => {
                    rootView.bindElement.setAttribute(attr.name, attr.value);
                });
                return rootView;
            }
        }
        View.DBG = Log.View_DBG;
        View.VIEW_LOG_TAG = "View";
        View.PFLAG_WANTS_FOCUS = 0x00000001;
        View.PFLAG_FOCUSED = 0x00000002;
        View.PFLAG_SELECTED = 0x00000004;
        View.PFLAG_IS_ROOT_NAMESPACE = 0x00000008;
        View.PFLAG_HAS_BOUNDS = 0x00000010;
        View.PFLAG_DRAWN = 0x00000020;
        View.PFLAG_DRAW_ANIMATION = 0x00000040;
        View.PFLAG_SKIP_DRAW = 0x00000080;
        View.PFLAG_ONLY_DRAWS_BACKGROUND = 0x00000100;
        View.PFLAG_REQUEST_TRANSPARENT_REGIONS = 0x00000200;
        View.PFLAG_DRAWABLE_STATE_DIRTY = 0x00000400;
        View.PFLAG_MEASURED_DIMENSION_SET = 0x00000800;
        View.PFLAG_FORCE_LAYOUT = 0x00001000;
        View.PFLAG_LAYOUT_REQUIRED = 0x00002000;
        View.PFLAG_PRESSED = 0x00004000;
        View.PFLAG_DRAWING_CACHE_VALID = 0x00008000;
        View.PFLAG_ANIMATION_STARTED = 0x00010000;
        View.PFLAG_ALPHA_SET = 0x00040000;
        View.PFLAG_SCROLL_CONTAINER = 0x00080000;
        View.PFLAG_SCROLL_CONTAINER_ADDED = 0x00100000;
        View.PFLAG_DIRTY = 0x00200000;
        View.PFLAG_DIRTY_OPAQUE = 0x00400000;
        View.PFLAG_DIRTY_MASK = 0x00600000;
        View.PFLAG_OPAQUE_BACKGROUND = 0x00800000;
        View.PFLAG_OPAQUE_SCROLLBARS = 0x01000000;
        View.PFLAG_OPAQUE_MASK = 0x01800000;
        View.PFLAG_PREPRESSED = 0x02000000;
        View.PFLAG_CANCEL_NEXT_UP_EVENT = 0x04000000;
        View.PFLAG_AWAKEN_SCROLL_BARS_ON_ATTACH = 0x08000000;
        View.PFLAG_HOVERED = 0x10000000;
        View.PFLAG_PIVOT_EXPLICITLY_SET = 0x20000000;
        View.PFLAG_ACTIVATED = 0x40000000;
        View.PFLAG_INVALIDATED = 0x80000000;
        View.PFLAG3_VIEW_IS_ANIMATING_TRANSFORM = 0x1;
        View.PFLAG3_VIEW_IS_ANIMATING_ALPHA = 0x2;
        View.PFLAG3_IS_LAID_OUT = 0x4;
        View.PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT = 0x8;
        View.PFLAG3_CALLED_SUPER = 0x10;
        View.OVER_SCROLL_ALWAYS = 0;
        View.OVER_SCROLL_IF_CONTENT_SCROLLS = 1;
        View.OVER_SCROLL_NEVER = 2;
        View.MEASURED_SIZE_MASK = 0x00ffffff;
        View.MEASURED_STATE_MASK = 0xff000000;
        View.MEASURED_HEIGHT_STATE_SHIFT = 16;
        View.MEASURED_STATE_TOO_SMALL = 0x01000000;
        View.VISIBILITY_MASK = 0x0000000C;
        View.VISIBLE = 0x00000000;
        View.INVISIBLE = 0x00000004;
        View.GONE = 0x00000008;
        View.ENABLED = 0x00000000;
        View.DISABLED = 0x00000020;
        View.ENABLED_MASK = 0x00000020;
        View.WILL_NOT_DRAW = 0x00000080;
        View.DRAW_MASK = 0x00000080;
        View.LONG_CLICKABLE = 0x00200000;
        View.DUPLICATE_PARENT_STATE = 0x00400000;
        view.View = View;
        (function (View) {
            class MeasureSpec {
                static makeMeasureSpec(size, mode) {
                    return (size & ~MeasureSpec.MODE_MASK) | (mode & MeasureSpec.MODE_MASK);
                }
                static getMode(measureSpec) {
                    return (measureSpec & MeasureSpec.MODE_MASK);
                }
                static getSize(measureSpec) {
                    return (measureSpec & ~MeasureSpec.MODE_MASK);
                }
                static adjust(measureSpec, delta) {
                    return MeasureSpec.makeMeasureSpec(MeasureSpec.getSize(measureSpec + delta), MeasureSpec.getMode(measureSpec));
                }
                static toString(measureSpec) {
                    let mode = MeasureSpec.getMode(measureSpec);
                    let size = MeasureSpec.getSize(measureSpec);
                    let sb = new StringBuilder("MeasureSpec: ");
                    if (mode == MeasureSpec.UNSPECIFIED)
                        sb.append("UNSPECIFIED ");
                    else if (mode == MeasureSpec.EXACTLY)
                        sb.append("EXACTLY ");
                    else if (mode == MeasureSpec.AT_MOST)
                        sb.append("AT_MOST ");
                    else
                        sb.append(mode).append(" ");
                    sb.append(size);
                    return sb.toString();
                }
            }
            MeasureSpec.MODE_SHIFT = 30;
            MeasureSpec.MODE_MASK = 0x3 << MeasureSpec.MODE_SHIFT;
            MeasureSpec.UNSPECIFIED = 0 << MeasureSpec.MODE_SHIFT;
            MeasureSpec.EXACTLY = 1 << MeasureSpec.MODE_SHIFT;
            MeasureSpec.AT_MOST = 2 << MeasureSpec.MODE_SHIFT;
            View.MeasureSpec = MeasureSpec;
            class AttachInfo {
                constructor(mViewRootImpl, mHandler) {
                    this.mDrawingTime = 0;
                    this.mTmpInvalRect = new Rect();
                    this.mTmpTransformRect = new Rect();
                    this.mScrollContainers = new Set();
                    this.mViewScrollChanged = false;
                    this.mTreeObserver = new view.ViewTreeObserver();
                    this.mViewRootImpl = mViewRootImpl;
                    this.mHandler = mHandler;
                }
            }
            View.AttachInfo = AttachInfo;
            class ListenerInfo {
            }
            View.ListenerInfo = ListenerInfo;
        })(View = view.View || (view.View = {}));
    })(view = android.view || (android.view = {}));
})(android || (android = {}));
var android;
(function (android) {
    var graphics;
    (function (graphics) {
        class Point {
            constructor(...args) {
                this.x = 0;
                this.y = 0;
                if (args.length === 1) {
                    let src = args[0];
                    this.x = src.x;
                    this.y = src.y;
                }
                else {
                    let [x = 0, y = 0] = args;
                    this.x = x;
                    this.y = y;
                }
            }
            set(x, y) {
                this.x = x;
                this.y = y;
            }
            negate() {
                this.x = -this.x;
                this.y = -this.y;
            }
            offset(dx, dy) {
                this.x += dx;
                this.y += dy;
            }
            equals(...args) {
                if (args.length === 2) {
                    let [x = 0, y = 0] = args;
                    return this.x == x && this.y == y;
                }
                else {
                    let o = args[0];
                    if (this === o)
                        return true;
                    if (!o || !(o instanceof Point))
                        return false;
                    let point = o;
                    if (this.x != point.x)
                        return false;
                    if (this.y != point.y)
                        return false;
                    return true;
                }
            }
            toString() {
                return "Point(" + this.x + ", " + this.y + ")";
            }
        }
        graphics.Point = Point;
    })(graphics = android.graphics || (android.graphics = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/5.
 */
///<reference path="View.ts"/>
///<reference path="../graphics/Point.ts"/>
///<reference path="../graphics/Rect.ts"/>
var android;
(function (android) {
    var util;
    (function (util) {
        class DisplayMetrics {
        }
        DisplayMetrics.DENSITY_LOW = 120;
        DisplayMetrics.DENSITY_MEDIUM = 160;
        DisplayMetrics.DENSITY_HIGH = 240;
        DisplayMetrics.DENSITY_XHIGH = 320;
        DisplayMetrics.DENSITY_XXHIGH = 480;
        DisplayMetrics.DENSITY_XXXHIGH = 640;
        DisplayMetrics.DENSITY_DEFAULT = DisplayMetrics.DENSITY_MEDIUM;
        util.DisplayMetrics = DisplayMetrics;
    })(util = android.util || (android.util = {}));
})(android || (android = {}));
///<reference path="../../util/DisplayMetrics.ts"/>
var android;
(function (android) {
    var content;
    (function (content) {
        var res;
        (function (res) {
            var DisplayMetrics = android.util.DisplayMetrics;
            class Resources {
                static getDisplayMetrics() {
                    let displayMetrics = Resources.displayMetrics;
                    if (displayMetrics)
                        return displayMetrics;
                    displayMetrics = new DisplayMetrics();
                    displayMetrics.widthPixels = window.innerWidth;
                    displayMetrics.heightPixels = window.innerHeight;
                    displayMetrics.xdpi = window.screen.deviceXDPI || DisplayMetrics.DENSITY_DEFAULT;
                    displayMetrics.ydpi = window.screen.deviceYDPI || DisplayMetrics.DENSITY_DEFAULT;
                    displayMetrics.density = window.devicePixelRatio;
                    displayMetrics.densityDpi = displayMetrics.density * DisplayMetrics.DENSITY_DEFAULT;
                    displayMetrics.scaledDensity = displayMetrics.density;
                    Resources.displayMetrics = displayMetrics;
                    return displayMetrics;
                }
            }
            res.Resources = Resources;
        })(res = content.res || (content.res = {}));
    })(content = android.content || (android.content = {}));
})(android || (android = {}));
var java;
(function (java) {
    var lang;
    (function (lang) {
        class System {
        }
        System.out = {
            println(any) {
                console.log('\n');
                console.log(any);
            },
            print(any) {
                console.log(any);
            }
        };
        lang.System = System;
    })(lang = java.lang || (java.lang = {}));
})(java || (java = {}));
///<reference path="ViewParent.ts"/>
///<reference path="View.ts"/>
///<reference path="../util/Log.ts"/>
///<reference path="../os/Handler.ts"/>
///<reference path="../content/res/Resources.ts"/>
///<reference path="../graphics/Point.ts"/>
///<reference path="../graphics/Rect.ts"/>
///<reference path="../../java/lang/Runnable.ts"/>
///<reference path="../../java/lang/System.ts"/>
var android;
(function (android) {
    var view;
    (function (view_1) {
        var View = android.view.View;
        var Resources = android.content.res.Resources;
        var Rect = android.graphics.Rect;
        var Handler = android.os.Handler;
        var System = java.lang.System;
        var Log = android.util.Log;
        class ViewRootImpl {
            constructor() {
                this.mViewVisibility = 0;
                this.mWidth = -1;
                this.mHeight = -1;
                this.mTempRect = new Rect();
                this.mVisRect = new Rect();
                this.mTraversalScheduled = false;
                this.mWillDrawSoon = false;
                this.mIsInTraversal = false;
                this.mLayoutRequested = false;
                this.mFirst = true;
                this.mFullRedrawNeeded = false;
                this.mIsDrawing = false;
                this.mAdded = false;
                this.mWinFrame = new Rect();
                this.mLayoutRequesters = [];
                this.mHandler = new Handler();
                this.mAttachInfo = new View.AttachInfo(this, this.mHandler);
                this.mTraversalRunnable = new TraversalRunnable(this);
            }
            setView(view) {
                if (this.mView == null) {
                    this.mView = view;
                    this.mAttachInfo.mRootView = view;
                    this.mAdded = true;
                    this.requestLayout();
                    view.assignParent(this);
                }
            }
            getView() {
                return this.mView;
            }
            getHostVisibility() {
                return this.mView.getVisibility();
            }
            scheduleTraversals() {
                if (!this.mTraversalScheduled) {
                    this.mTraversalScheduled = true;
                    this.mHandler.post(this.mTraversalRunnable);
                }
            }
            unscheduleTraversals() {
                if (this.mTraversalScheduled) {
                    this.mTraversalScheduled = false;
                    this.mHandler.removeCallbacks(this.mTraversalRunnable);
                }
            }
            doTraversal() {
                if (this.mTraversalScheduled) {
                    this.mTraversalScheduled = false;
                    this.performTraversals();
                }
            }
            measureHierarchy(host, lp, desiredWindowWidth, desiredWindowHeight) {
                let windowSizeMayChange = false;
                if (ViewRootImpl.DEBUG_ORIENTATION || ViewRootImpl.DEBUG_LAYOUT)
                    Log.v(ViewRootImpl.TAG, "Measuring " + host + " in display " + desiredWindowWidth
                        + "x" + desiredWindowHeight + "...");
                let childWidthMeasureSpec = ViewRootImpl.getRootMeasureSpec(desiredWindowWidth, lp.width);
                let childHeightMeasureSpec = ViewRootImpl.getRootMeasureSpec(desiredWindowHeight, lp.height);
                this.performMeasure(childWidthMeasureSpec, childHeightMeasureSpec);
                if (this.mWidth != host.getMeasuredWidth() || this.mHeight != host.getMeasuredHeight()) {
                    windowSizeMayChange = true;
                }
                if (ViewRootImpl.DBG) {
                    System.out.println("======================================");
                    System.out.println("performTraversals -- after measure");
                    host.debug();
                }
                return windowSizeMayChange;
            }
            static getRootMeasureSpec(windowSize, rootDimension) {
                let MeasureSpec = View.MeasureSpec;
                let measureSpec;
                switch (rootDimension) {
                    case view_1.ViewGroup.LayoutParams.MATCH_PARENT:
                        measureSpec = MeasureSpec.makeMeasureSpec(windowSize, MeasureSpec.EXACTLY);
                        break;
                    case view_1.ViewGroup.LayoutParams.WRAP_CONTENT:
                        measureSpec = MeasureSpec.makeMeasureSpec(windowSize, MeasureSpec.AT_MOST);
                        break;
                    default:
                        measureSpec = MeasureSpec.makeMeasureSpec(rootDimension, MeasureSpec.EXACTLY);
                        break;
                }
                return measureSpec;
            }
            performTraversals() {
                let host = this.mView;
                if (ViewRootImpl.DBG) {
                    System.out.println("======================================");
                    System.out.println("performTraversals");
                    host.debug();
                }
                if (host == null || !this.mAdded)
                    return;
                this.mIsInTraversal = true;
                this.mWillDrawSoon = true;
                let windowSizeMayChange = false;
                let newSurface = false;
                let surfaceChanged = false;
                let lp = new view_1.ViewGroup.LayoutParams(view_1.ViewGroup.LayoutParams.MATCH_PARENT, view_1.ViewGroup.LayoutParams.MATCH_PARENT);
                let desiredWindowWidth;
                let desiredWindowHeight;
                let attachInfo = this.mAttachInfo;
                let viewVisibility = this.getHostVisibility();
                let viewVisibilityChanged = this.mViewVisibility != viewVisibility;
                let params = null;
                let frame = this.mWinFrame;
                if (this.mFirst) {
                    this.mFullRedrawNeeded = true;
                    this.mLayoutRequested = true;
                    let packageMetrics = Resources.getDisplayMetrics();
                    desiredWindowWidth = packageMetrics.widthPixels;
                    desiredWindowHeight = packageMetrics.heightPixels;
                    viewVisibilityChanged = false;
                    host.dispatchAttachedToWindow(attachInfo, 0);
                    attachInfo.mTreeObserver.dispatchOnWindowAttachedChange(true);
                }
                else {
                    desiredWindowWidth = frame.width();
                    desiredWindowHeight = frame.height();
                    if (desiredWindowWidth != this.mWidth || desiredWindowHeight != this.mHeight) {
                        if (ViewRootImpl.DEBUG_ORIENTATION) {
                            Log.v(ViewRootImpl.TAG, "View " + host + " resized to: " + frame);
                        }
                        this.mFullRedrawNeeded = true;
                        this.mLayoutRequested = true;
                        windowSizeMayChange = true;
                    }
                }
                ViewRootImpl.getRunQueue(this).executeActions(attachInfo.mHandler);
                let layoutRequested = this.mLayoutRequested;
                if (layoutRequested) {
                    if (this.mFirst) {
                    }
                    else {
                        if (lp.width == view_1.ViewGroup.LayoutParams.WRAP_CONTENT
                            || lp.height == view_1.ViewGroup.LayoutParams.WRAP_CONTENT) {
                            windowSizeMayChange = true;
                            let packageMetrics = Resources.getDisplayMetrics();
                            desiredWindowWidth = packageMetrics.widthPixels;
                            desiredWindowHeight = packageMetrics.heightPixels;
                        }
                    }
                    windowSizeMayChange == windowSizeMayChange || this.measureHierarchy(host, lp, desiredWindowWidth, desiredWindowHeight);
                }
                if (layoutRequested) {
                    this.mLayoutRequested = false;
                }
                let windowShouldResize = layoutRequested && windowSizeMayChange
                    && ((this.mWidth != host.getMeasuredWidth() || this.mHeight != host.getMeasuredHeight())
                        || (lp.width == view_1.ViewGroup.LayoutParams.WRAP_CONTENT &&
                            frame.width() < desiredWindowWidth && frame.width() != this.mWidth)
                        || (lp.height == view_1.ViewGroup.LayoutParams.WRAP_CONTENT &&
                            frame.height() < desiredWindowHeight && frame.height() != this.mHeight));
                if (this.mFirst || windowShouldResize || viewVisibilityChanged) {
                    if (ViewRootImpl.DEBUG_LAYOUT) {
                        Log.i(ViewRootImpl.TAG, "host=w:" + host.getMeasuredWidth() + ", h:" +
                            host.getMeasuredHeight() + ", params=" + params);
                    }
                    if (ViewRootImpl.DEBUG_ORIENTATION)
                        Log.v(ViewRootImpl.TAG, "Relayout returned: frame=" + frame);
                    if (this.mWidth != frame.width() || this.mHeight != frame.height()) {
                        this.mWidth = frame.width();
                        this.mHeight = frame.height();
                    }
                    if (this.mWidth != host.getMeasuredWidth()
                        || this.mHeight != host.getMeasuredHeight()) {
                        let childWidthMeasureSpec = ViewRootImpl.getRootMeasureSpec(this.mWidth, lp.width);
                        let childHeightMeasureSpec = ViewRootImpl.getRootMeasureSpec(this.mHeight, lp.height);
                        if (ViewRootImpl.DEBUG_LAYOUT)
                            Log.v(ViewRootImpl.TAG, "Ooops, something changed!  mWidth="
                                + this.mWidth + " measuredWidth=" + host.getMeasuredWidth()
                                + " mHeight=" + this.mHeight
                                + " measuredHeight=" + host.getMeasuredHeight());
                        this.performMeasure(childWidthMeasureSpec, childHeightMeasureSpec);
                        layoutRequested = true;
                    }
                }
                const didLayout = layoutRequested;
                let triggerGlobalLayoutListener = didLayout;
                if (didLayout) {
                    this.performLayout(lp, desiredWindowWidth, desiredWindowHeight);
                    if (ViewRootImpl.DBG) {
                        System.out.println("======================================");
                        System.out.println("performTraversals -- after setFrame");
                        host.debug();
                    }
                }
                if (triggerGlobalLayoutListener) {
                    attachInfo.mTreeObserver.dispatchOnGlobalLayout();
                }
                let skipDraw = false;
                this.mFirst = false;
                this.mWillDrawSoon = false;
                this.mViewVisibility = viewVisibility;
                let cancelDraw = attachInfo.mTreeObserver.dispatchOnPreDraw() ||
                    viewVisibility != View.VISIBLE;
                if (!cancelDraw) {
                    if (!skipDraw) {
                        this.performDraw();
                    }
                }
                else {
                    if (viewVisibility == View.VISIBLE) {
                        this.scheduleTraversals();
                    }
                }
                this.mIsInTraversal = false;
            }
            performLayout(lp, desiredWindowWidth, desiredWindowHeight) {
                this.mLayoutRequested = false;
                this.mInLayout = true;
                let host = this.mView;
                if (ViewRootImpl.DEBUG_ORIENTATION || ViewRootImpl.DEBUG_LAYOUT) {
                    Log.v(ViewRootImpl.TAG, "Laying out " + host + " to (" +
                        host.getMeasuredWidth() + ", " + host.getMeasuredHeight() + ")");
                }
                host.layout(0, 0, host.getMeasuredWidth(), host.getMeasuredHeight());
                this.mInLayout = false;
                let numViewsRequestingLayout = this.mLayoutRequesters.length;
                if (numViewsRequestingLayout > 0) {
                    let validLayoutRequesters = this.getValidLayoutRequesters(this.mLayoutRequesters, false);
                    if (validLayoutRequesters != null) {
                        this.mHandlingLayoutInLayoutRequest = true;
                        let numValidRequests = validLayoutRequesters.length;
                        for (let i = 0; i < numValidRequests; ++i) {
                            let view = validLayoutRequesters[i];
                            Log.w("View", "requestLayout() improperly called by " + view +
                                " during layout: running second layout pass");
                            view.requestLayout();
                        }
                        this.measureHierarchy(host, lp, desiredWindowWidth, desiredWindowHeight);
                        this.mInLayout = true;
                        host.layout(0, 0, host.getMeasuredWidth(), host.getMeasuredHeight());
                        this.mHandlingLayoutInLayoutRequest = false;
                        validLayoutRequesters = this.getValidLayoutRequesters(this.mLayoutRequesters, true);
                        if (validLayoutRequesters != null) {
                            let finalRequesters = validLayoutRequesters;
                            ViewRootImpl.getRunQueue(this).post({
                                run() {
                                    let numValidRequests = finalRequesters.length;
                                    for (let i = 0; i < numValidRequests; ++i) {
                                        const view = finalRequesters[i];
                                        Log.w("View", "requestLayout() improperly called by " + view +
                                            " during second layout pass: posting in next frame");
                                        view.requestLayout();
                                    }
                                }
                            });
                        }
                    }
                }
                this.mInLayout = false;
            }
            getValidLayoutRequesters(layoutRequesters, secondLayoutRequests) {
                let numViewsRequestingLayout = layoutRequesters.length;
                let validLayoutRequesters = null;
                for (let i = 0; i < numViewsRequestingLayout; ++i) {
                    let view = layoutRequesters[i];
                    if (view != null && view.mAttachInfo != null && view.mParent != null &&
                        (secondLayoutRequests || (view.mPrivateFlags & View.PFLAG_FORCE_LAYOUT) ==
                            View.PFLAG_FORCE_LAYOUT)) {
                        let gone = false;
                        let parent = view;
                        while (parent != null) {
                            if ((parent.mViewFlags & View.VISIBILITY_MASK) == View.GONE) {
                                gone = true;
                                break;
                            }
                            if (parent.mParent instanceof View) {
                                parent = parent.mParent;
                            }
                            else {
                                parent = null;
                            }
                        }
                        if (!gone) {
                            if (validLayoutRequesters == null) {
                                validLayoutRequesters = [];
                            }
                            validLayoutRequesters.push(view);
                        }
                    }
                }
                if (!secondLayoutRequests) {
                    for (let i = 0; i < numViewsRequestingLayout; ++i) {
                        let view = layoutRequesters[i];
                        while (view != null &&
                            (view.mPrivateFlags & View.PFLAG_FORCE_LAYOUT) != 0) {
                            view.mPrivateFlags &= ~View.PFLAG_FORCE_LAYOUT;
                            if (view.mParent instanceof View) {
                                view = view.mParent;
                            }
                            else {
                                view = null;
                            }
                        }
                    }
                }
                layoutRequesters.splice(0, layoutRequesters.length);
                return validLayoutRequesters;
            }
            performMeasure(childWidthMeasureSpec, childHeightMeasureSpec) {
                this.mView.measure(childWidthMeasureSpec, childHeightMeasureSpec);
            }
            isInLayout() {
                return this.mInLayout;
            }
            requestLayoutDuringLayout(view) {
                if (view.mParent == null || view.mAttachInfo == null) {
                    return true;
                }
                if (this.mLayoutRequesters.indexOf(view) === -1) {
                    this.mLayoutRequesters.push(view);
                }
                if (!this.mHandlingLayoutInLayoutRequest) {
                    return true;
                }
                else {
                    return false;
                }
            }
            performDraw() {
                let fullRedrawNeeded = this.mFullRedrawNeeded;
                this.mFullRedrawNeeded = false;
                this.mIsDrawing = true;
                try {
                    this.draw(fullRedrawNeeded);
                }
                finally {
                    this.mIsDrawing = false;
                }
            }
            draw(fullRedrawNeeded) {
            }
            isLayoutRequested() {
                return this.mLayoutRequested;
            }
            getParent() {
                return null;
            }
            requestLayout() {
                if (!this.mHandlingLayoutInLayoutRequest) {
                    this.mLayoutRequested = true;
                    this.scheduleTraversals();
                }
            }
            invalidateChild(child, r) {
            }
            invalidateChildInParent(location, r) {
                return undefined;
            }
            requestChildFocus(child, focused) {
            }
            clearChildFocus(child) {
            }
            getChildVisibleRect(child, r, offset) {
                return undefined;
            }
            focusSearch(v, direction) {
                return undefined;
            }
            bringChildToFront(child) {
            }
            focusableViewAvailable(v) {
            }
            childDrawableStateChanged(child) {
            }
            requestDisallowInterceptTouchEvent(disallowIntercept) {
            }
            childHasTransientStateChanged(child, hasTransientState) {
            }
            static getRunQueue(viewRoot) {
                if (viewRoot) {
                    if (!viewRoot.mRunQueue)
                        viewRoot.mRunQueue = new ViewRootImpl.RunQueue();
                    return viewRoot.mRunQueue;
                }
                else {
                    if (!this.RunQueueInstance) {
                        this.RunQueueInstance = new RunQueueForNoViewRoot();
                    }
                    return this.RunQueueInstance;
                }
            }
        }
        ViewRootImpl.TAG = "ViewRootImpl";
        ViewRootImpl.DBG = Log.View_DBG;
        ViewRootImpl.LOCAL_LOGV = true;
        ViewRootImpl.DEBUG_DRAW = false || ViewRootImpl.LOCAL_LOGV;
        ViewRootImpl.DEBUG_LAYOUT = false || ViewRootImpl.LOCAL_LOGV;
        ViewRootImpl.DEBUG_INPUT_RESIZE = false || ViewRootImpl.LOCAL_LOGV;
        ViewRootImpl.DEBUG_ORIENTATION = false || ViewRootImpl.LOCAL_LOGV;
        ViewRootImpl.DEBUG_CONFIGURATION = false || ViewRootImpl.LOCAL_LOGV;
        ViewRootImpl.DEBUG_FPS = false || ViewRootImpl.LOCAL_LOGV;
        view_1.ViewRootImpl = ViewRootImpl;
        (function (ViewRootImpl) {
            class RunQueue {
                constructor() {
                    this.mActions = [];
                }
                post(action) {
                    this.postDelayed(action, 0);
                }
                postDelayed(action, delayMillis) {
                    let handlerAction = {
                        action: action,
                        delay: delayMillis
                    };
                    this.mActions.push(handlerAction);
                }
                removeCallbacks(action) {
                    this.mActions = this.mActions.filter((item) => {
                        return item.action == action;
                    });
                }
                executeActions(handler) {
                    for (let handlerAction of this.mActions) {
                        handler.postDelayed(handlerAction.action, handlerAction.delay);
                    }
                    this.mActions = [];
                }
            }
            ViewRootImpl.RunQueue = RunQueue;
        })(ViewRootImpl = view_1.ViewRootImpl || (view_1.ViewRootImpl = {}));
        class RunQueueForNoViewRoot extends ViewRootImpl.RunQueue {
            postDelayed(action, delayMillis) {
                RunQueueForNoViewRoot.Handler.postDelayed(action, delayMillis);
            }
            removeCallbacks(action) {
                RunQueueForNoViewRoot.Handler.removeCallbacks(action);
            }
        }
        RunQueueForNoViewRoot.Handler = new Handler();
        class TraversalRunnable {
            constructor(impl) {
                this.ViewRootImpl_this = impl;
            }
            run() {
                this.ViewRootImpl_this.doTraversal();
            }
        }
    })(view = android.view || (android.view = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/5.
 */
///<reference path="ViewRootImpl.ts"/>
///<reference path="View.ts"/>
///<reference path="ViewParent.ts"/>
var android;
(function (android) {
    var view;
    (function (view_2) {
        class ViewGroup extends view_2.View {
            constructor() {
                super();
                this.mGroupFlags = 0;
                this.mLayoutMode = ViewGroup.LAYOUT_MODE_UNDEFINED;
                this.mChildren = [];
                this.initViewGroup();
            }
            get mChildrenCount() {
                return this.mChildren.length;
            }
            initViewGroup() {
                this.setFlags(view_2.View.WILL_NOT_DRAW, view_2.View.DRAW_MASK);
                this.mGroupFlags |= ViewGroup.FLAG_CLIP_CHILDREN;
                this.mGroupFlags |= ViewGroup.FLAG_CLIP_TO_PADDING;
                this.mGroupFlags |= ViewGroup.FLAG_ANIMATION_DONE;
                this.mGroupFlags |= ViewGroup.FLAG_ANIMATION_CACHE;
                this.mGroupFlags |= ViewGroup.FLAG_ALWAYS_DRAWN_WITH_CACHE;
                this.mGroupFlags |= ViewGroup.FLAG_SPLIT_MOTION_EVENTS;
            }
            addView(...args) {
                let child = args[0];
                let params = child.getLayoutParams();
                let index = -1;
                if (args.length == 2) {
                    if (args[1] instanceof ViewGroup.LayoutParams)
                        params = args[1];
                    else
                        index = args[1];
                }
                else if (args.length == 3) {
                    if (args[2] instanceof ViewGroup.LayoutParams) {
                        index = args[1];
                        params = args[2];
                    }
                    else {
                        params = this.generateDefaultLayoutParams();
                        params.width = args[1];
                        params.height = args[2];
                    }
                }
                if (params == null) {
                    params = this.generateDefaultLayoutParams();
                    if (params == null) {
                        throw new Error("generateDefaultLayoutParams() cannot return null");
                    }
                }
                this.requestLayout();
                this.invalidate(true);
                this.addViewInner(child, index, params, false);
            }
            checkLayoutParams(p) {
                return p != null;
            }
            setOnHierarchyChangeListener(listener) {
                this.mOnHierarchyChangeListener = listener;
            }
            onViewAdded(child) {
                if (this.mOnHierarchyChangeListener != null) {
                    this.mOnHierarchyChangeListener.onChildViewAdded(this, child);
                }
            }
            onViewRemoved(child) {
                if (this.mOnHierarchyChangeListener != null) {
                    this.mOnHierarchyChangeListener.onChildViewRemoved(this, child);
                }
            }
            clearCachedLayoutMode() {
                if (!this.hasBooleanFlag(ViewGroup.FLAG_LAYOUT_MODE_WAS_EXPLICITLY_SET)) {
                    this.mLayoutMode = ViewGroup.LAYOUT_MODE_UNDEFINED;
                }
            }
            addViewInLayout(child, index, params, preventRequestLayout = false) {
                child.mParent = null;
                this.addViewInner(child, index, params, preventRequestLayout);
                child.mPrivateFlags = (child.mPrivateFlags & ~ViewGroup.PFLAG_DIRTY_MASK) | ViewGroup.PFLAG_DRAWN;
                return true;
            }
            cleanupLayoutState(child) {
                child.mPrivateFlags &= ~view_2.View.PFLAG_FORCE_LAYOUT;
            }
            addViewInner(child, index, params, preventRequestLayout) {
                if (child.getParent() != null) {
                    throw new Error("The specified child already has a parent. " +
                        "You must call removeView() on the child's parent first.");
                }
                if (!this.checkLayoutParams(params)) {
                    params = this.generateLayoutParams(params);
                }
                if (preventRequestLayout) {
                    child.mLayoutParams = params;
                }
                else {
                    child.setLayoutParams(params);
                }
                if (index < 0) {
                    index = this.mChildrenCount;
                }
                this.addInArray(child, index);
                if (preventRequestLayout) {
                    child.assignParent(this);
                }
                else {
                    child.mParent = this;
                }
                let ai = this.mAttachInfo;
                if (ai != null && (this.mGroupFlags & ViewGroup.FLAG_PREVENT_DISPATCH_ATTACHED_TO_WINDOW) == 0) {
                    child.dispatchAttachedToWindow(this.mAttachInfo, (this.mViewFlags & ViewGroup.VISIBILITY_MASK));
                }
                this.onViewAdded(child);
                if ((child.mViewFlags & ViewGroup.DUPLICATE_PARENT_STATE) == ViewGroup.DUPLICATE_PARENT_STATE) {
                    this.mGroupFlags |= ViewGroup.FLAG_NOTIFY_CHILDREN_ON_DRAWABLE_STATE_CHANGE;
                }
            }
            addInArray(child, index) {
                let count = this.mChildrenCount;
                if (index == count) {
                    this.mChildren.push(child);
                    this.bindElement.appendChild(child.bindElement);
                }
                else if (index < count) {
                    this.mChildren.splice(index, 0, child);
                    this.bindElement.insertBefore(child.bindElement, this.getChildAt(index).bindElement);
                }
                else {
                    throw new Error("index=" + index + " count=" + count);
                }
            }
            removeFromArray(index, count = 1) {
                let start = Math.max(0, index);
                let end = Math.min(this.mChildrenCount, start + count);
                if (start == end) {
                    return;
                }
                for (let i = start; i < end; i++) {
                    this.mChildren[i].mParent = null;
                    this.bindElement.removeChild(this.mChildren[i].bindElement);
                }
                this.mChildren.splice(index, end - start);
            }
            removeView(view) {
                this.removeViewInternal(view);
                this.requestLayout();
                this.invalidate(true);
            }
            removeViewInLayout(view) {
                this.removeViewInternal(view);
            }
            removeViewsInLayout(start, count) {
                this.removeViewsInternal(start, count);
            }
            removeViewAt(index) {
                this.removeViewsInternal(index, 1);
                this.requestLayout();
                this.invalidate(true);
            }
            removeViews(start, count) {
                this.removeViewsInternal(start, count);
                this.requestLayout();
                this.invalidate(true);
            }
            removeViewInternal(view) {
                let index = this.indexOfChild(view);
                if (index >= 0) {
                    this.removeViewsInternal(index, 1);
                }
            }
            removeViewsInternal(start, count) {
                const detach = this.mAttachInfo != null;
                const children = this.mChildren;
                const end = start + count;
                for (let i = start; i < end; i++) {
                    const view = children[i];
                    if (detach) {
                        view.dispatchDetachedFromWindow();
                    }
                    this.onViewRemoved(view);
                }
                this.removeFromArray(start, count);
            }
            removeAllViews() {
                this.removeAllViewsInLayout();
                this.requestLayout();
                this.invalidate(true);
            }
            removeAllViewsInLayout() {
                const count = this.mChildrenCount;
                if (count <= 0) {
                    return;
                }
                this.removeViewsInternal(0, count);
            }
            indexOfChild(child) {
                return this.mChildren.indexOf(child);
            }
            getChildCount() {
                return this.mChildrenCount;
            }
            getChildAt(index) {
                if (index < 0 || index >= this.mChildrenCount) {
                    return null;
                }
                return this.mChildren[index];
            }
            bringChildToFront(child) {
                let index = this.indexOfChild(child);
                if (index >= 0) {
                    this.removeFromArray(index);
                    this.addInArray(child, this.mChildrenCount);
                    child.mParent = this;
                    this.requestLayout();
                    this.invalidate();
                }
            }
            hasBooleanFlag(flag) {
                return (this.mGroupFlags & flag) == flag;
            }
            setBooleanFlag(flag, value) {
                if (value) {
                    this.mGroupFlags |= flag;
                }
                else {
                    this.mGroupFlags &= ~flag;
                }
            }
            generateLayoutParams(p) {
                return p;
            }
            generateDefaultLayoutParams() {
                return new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            }
            measureChildren(widthMeasureSpec, heightMeasureSpec) {
                const size = this.mChildren.length;
                for (let i = 0; i < size; ++i) {
                    const child = this.mChildren[i];
                    if ((child.mViewFlags & view_2.View.VISIBILITY_MASK) != view_2.View.GONE) {
                        this.measureChild(child, widthMeasureSpec, heightMeasureSpec);
                    }
                }
            }
            measureChild(child, parentWidthMeasureSpec, parentHeightMeasureSpec) {
                let lp = child.getLayoutParams();
                const childWidthMeasureSpec = ViewGroup.getChildMeasureSpec(parentWidthMeasureSpec, this.mPaddingLeft + this.mPaddingRight, lp.width);
                const childHeightMeasureSpec = ViewGroup.getChildMeasureSpec(parentHeightMeasureSpec, this.mPaddingTop + this.mPaddingBottom, lp.height);
                child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
            }
            measureChildWithMargins(child, parentWidthMeasureSpec, widthUsed, parentHeightMeasureSpec, heightUsed) {
                let lp = child.getLayoutParams();
                if (lp instanceof ViewGroup.MarginLayoutParams) {
                    const childWidthMeasureSpec = ViewGroup.getChildMeasureSpec(parentWidthMeasureSpec, this.mPaddingLeft + this.mPaddingRight + lp.leftMargin + lp.rightMargin
                        + widthUsed, lp.width);
                    const childHeightMeasureSpec = ViewGroup.getChildMeasureSpec(parentHeightMeasureSpec, this.mPaddingTop + this.mPaddingBottom + lp.topMargin + lp.bottomMargin
                        + heightUsed, lp.height);
                    child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
                }
            }
            static getChildMeasureSpec(spec, padding, childDimension) {
                let MeasureSpec = view_2.View.MeasureSpec;
                let specMode = MeasureSpec.getMode(spec);
                let specSize = MeasureSpec.getSize(spec);
                let size = Math.max(0, specSize - padding);
                let resultSize = 0;
                let resultMode = 0;
                switch (specMode) {
                    case MeasureSpec.EXACTLY:
                        if (childDimension >= 0) {
                            resultSize = childDimension;
                            resultMode = MeasureSpec.EXACTLY;
                        }
                        else if (childDimension == ViewGroup.LayoutParams.MATCH_PARENT) {
                            resultSize = size;
                            resultMode = MeasureSpec.EXACTLY;
                        }
                        else if (childDimension == ViewGroup.LayoutParams.WRAP_CONTENT) {
                            resultSize = size;
                            resultMode = MeasureSpec.AT_MOST;
                        }
                        break;
                    case MeasureSpec.AT_MOST:
                        if (childDimension >= 0) {
                            resultSize = childDimension;
                            resultMode = MeasureSpec.EXACTLY;
                        }
                        else if (childDimension == ViewGroup.LayoutParams.MATCH_PARENT) {
                            resultSize = size;
                            resultMode = MeasureSpec.AT_MOST;
                        }
                        else if (childDimension == ViewGroup.LayoutParams.WRAP_CONTENT) {
                            resultSize = size;
                            resultMode = MeasureSpec.AT_MOST;
                        }
                        break;
                    case MeasureSpec.UNSPECIFIED:
                        if (childDimension >= 0) {
                            resultSize = childDimension;
                            resultMode = MeasureSpec.EXACTLY;
                        }
                        else if (childDimension == ViewGroup.LayoutParams.MATCH_PARENT) {
                            resultSize = 0;
                            resultMode = MeasureSpec.UNSPECIFIED;
                        }
                        else if (childDimension == ViewGroup.LayoutParams.WRAP_CONTENT) {
                            resultSize = 0;
                            resultMode = MeasureSpec.UNSPECIFIED;
                        }
                        break;
                }
                return MeasureSpec.makeMeasureSpec(resultSize, resultMode);
            }
            dispatchAttachedToWindow(info, visibility) {
                this.mGroupFlags |= ViewGroup.FLAG_PREVENT_DISPATCH_ATTACHED_TO_WINDOW;
                super.dispatchAttachedToWindow(info, visibility);
                this.mGroupFlags &= ~ViewGroup.FLAG_PREVENT_DISPATCH_ATTACHED_TO_WINDOW;
                const count = this.mChildrenCount;
                const children = this.mChildren;
                for (let i = 0; i < count; i++) {
                    const child = children[i];
                    child.dispatchAttachedToWindow(info, visibility | (child.mViewFlags & view_2.View.VISIBILITY_MASK));
                }
            }
            onAttachedToWindow() {
                super.onAttachedToWindow();
                this.clearCachedLayoutMode();
            }
            onDetachedFromWindow() {
                super.onDetachedFromWindow();
                this.clearCachedLayoutMode();
            }
            dispatchDetachedFromWindow() {
                // If we still have a touch target, we are still in the process of
                // dispatching motion events to a child; we need to get rid of that
                // child to avoid dispatching events to it after the window is torn
                // down. To make sure we keep the child in a consistent state, we
                // first send it an ACTION_CANCEL motion event.
                //this.cancelAndClearTouchTargets(null);//TODO impl when touch impl
                this.mChildren.forEach((child) => child.dispatchDetachedFromWindow());
                super.dispatchDetachedFromWindow();
            }
            requestTransparentRegion(child) {
            }
            invalidateChild(child, r) {
            }
            invalidateChildInParent(location, r) {
                return undefined;
            }
            requestChildFocus(child, focused) {
            }
            recomputeViewAttributes(child) {
            }
            clearChildFocus(child) {
            }
            getChildVisibleRect(child, r, offset) {
                return undefined;
            }
            focusSearch(v, direction) {
                return undefined;
            }
            focusableViewAvailable(v) {
            }
            childDrawableStateChanged(child) {
            }
            requestDisallowInterceptTouchEvent(disallowIntercept) {
            }
            requestChildRectangleOnScreen(child, rectangle, immediate) {
                return undefined;
            }
            childHasTransientStateChanged(child, hasTransientState) {
            }
            shouldDelayChildPressedState() {
                return true;
            }
            onSetLayoutParams(child, layoutParams) {
            }
        }
        ViewGroup.FLAG_CLIP_CHILDREN = 0x1;
        ViewGroup.FLAG_CLIP_TO_PADDING = 0x2;
        ViewGroup.FLAG_INVALIDATE_REQUIRED = 0x4;
        ViewGroup.FLAG_RUN_ANIMATION = 0x8;
        ViewGroup.FLAG_ANIMATION_DONE = 0x10;
        ViewGroup.FLAG_PADDING_NOT_NULL = 0x20;
        ViewGroup.FLAG_ANIMATION_CACHE = 0x40;
        ViewGroup.FLAG_OPTIMIZE_INVALIDATE = 0x80;
        ViewGroup.FLAG_CLEAR_TRANSFORMATION = 0x100;
        ViewGroup.FLAG_NOTIFY_ANIMATION_LISTENER = 0x200;
        ViewGroup.FLAG_USE_CHILD_DRAWING_ORDER = 0x400;
        ViewGroup.FLAG_SUPPORT_STATIC_TRANSFORMATIONS = 0x800;
        ViewGroup.FLAG_ALPHA_LOWER_THAN_ONE = 0x1000;
        ViewGroup.FLAG_ADD_STATES_FROM_CHILDREN = 0x2000;
        ViewGroup.FLAG_ALWAYS_DRAWN_WITH_CACHE = 0x4000;
        ViewGroup.FLAG_CHILDREN_DRAWN_WITH_CACHE = 0x8000;
        ViewGroup.FLAG_NOTIFY_CHILDREN_ON_DRAWABLE_STATE_CHANGE = 0x10000;
        ViewGroup.FLAG_MASK_FOCUSABILITY = 0x60000;
        ViewGroup.FOCUS_BEFORE_DESCENDANTS = 0x20000;
        ViewGroup.FOCUS_AFTER_DESCENDANTS = 0x40000;
        ViewGroup.FOCUS_BLOCK_DESCENDANTS = 0x60000;
        ViewGroup.FLAG_DISALLOW_INTERCEPT = 0x80000;
        ViewGroup.FLAG_SPLIT_MOTION_EVENTS = 0x200000;
        ViewGroup.FLAG_PREVENT_DISPATCH_ATTACHED_TO_WINDOW = 0x400000;
        ViewGroup.FLAG_LAYOUT_MODE_WAS_EXPLICITLY_SET = 0x800000;
        ViewGroup.LAYOUT_MODE_UNDEFINED = -1;
        ViewGroup.LAYOUT_MODE_CLIP_BOUNDS = 0;
        ViewGroup.LAYOUT_MODE_DEFAULT = ViewGroup.LAYOUT_MODE_CLIP_BOUNDS;
        ViewGroup.CLIP_TO_PADDING_MASK = ViewGroup.FLAG_CLIP_TO_PADDING | ViewGroup.FLAG_PADDING_NOT_NULL;
        view_2.ViewGroup = ViewGroup;
        (function (ViewGroup) {
            class LayoutParams {
                constructor(...args) {
                    this.width = 0;
                    this.height = 0;
                    if (args.length === 1) {
                        let src = args[0];
                        this.width = src.width;
                        this.height = src.height;
                    }
                    else if (args.length === 2) {
                        let [width = 0, height = 0] = args;
                        this.width = width;
                        this.height = height;
                    }
                }
            }
            LayoutParams.FILL_PARENT = -1;
            LayoutParams.MATCH_PARENT = -1;
            LayoutParams.WRAP_CONTENT = -2;
            ViewGroup.LayoutParams = LayoutParams;
            class MarginLayoutParams extends LayoutParams {
                constructor(...args) {
                    super();
                    this.leftMargin = 0;
                    this.topMargin = 0;
                    this.rightMargin = 0;
                    this.bottomMargin = 0;
                    if (args.length === 1) {
                        let src = args[0];
                        if (src instanceof MarginLayoutParams) {
                            this.leftMargin = src.leftMargin;
                            this.topMargin = src.topMargin;
                            this.rightMargin = src.rightMargin;
                            this.bottomMargin = src.bottomMargin;
                        }
                    }
                    else if (args.length == 2) {
                        super(args[0], args[1]);
                    }
                }
                setMargins(left, top, right, bottom) {
                    this.leftMargin = left;
                    this.topMargin = top;
                    this.rightMargin = right;
                    this.bottomMargin = bottom;
                }
            }
            ViewGroup.MarginLayoutParams = MarginLayoutParams;
        })(ViewGroup = view_2.ViewGroup || (view_2.ViewGroup = {}));
    })(view = android.view || (android.view = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/6.
 */
///<reference path="ViewGroup.ts"/>
///<reference path="ViewRootImpl.ts"/>
///<reference path="View.ts"/>
///<reference path="../graphics/drawable/Drawable.ts"/>
var android;
(function (android) {
    var view;
    (function (view) {
        var Drawable = android.graphics.drawable.Drawable;
        class ViewOverlay {
            constructor(hostView) {
                this.mOverlayViewGroup = new ViewOverlay.OverlayViewGroup(hostView);
            }
            getOverlayView() {
                return this.mOverlayViewGroup;
            }
            add(drawable) {
                this.mOverlayViewGroup.add(drawable);
            }
            remove(drawable) {
            }
            clear() {
                this.mOverlayViewGroup.clear();
            }
            isEmpty() {
                return this.mOverlayViewGroup.isEmpty();
            }
        }
        view.ViewOverlay = ViewOverlay;
        (function (ViewOverlay) {
            class OverlayViewGroup extends view.ViewGroup {
                constructor(hostView) {
                    super();
                    this.mHostView = hostView;
                    this.mAttachInfo = hostView.mAttachInfo;
                    this.mRight = hostView.getWidth();
                    this.mBottom = hostView.getHeight();
                }
                addDrawable(drawable) {
                }
                addView(child) {
                }
                add(arg) {
                    if (arg instanceof Drawable)
                        this.addDrawable(arg);
                    else if (arg instanceof view.View)
                        this.addView(arg);
                }
                clear() {
                }
                isEmpty() {
                    return true;
                }
            }
            ViewOverlay.OverlayViewGroup = OverlayViewGroup;
        })(ViewOverlay = view.ViewOverlay || (view.ViewOverlay = {}));
    })(view = android.view || (android.view = {}));
})(android || (android = {}));
var android;
(function (android) {
    var view;
    (function (view) {
        class Gravity {
        }
        Gravity.NO_GRAVITY = 0x0000;
        Gravity.AXIS_SPECIFIED = 0x0001;
        Gravity.AXIS_PULL_BEFORE = 0x0002;
        Gravity.AXIS_PULL_AFTER = 0x0004;
        Gravity.AXIS_CLIP = 0x0008;
        Gravity.AXIS_X_SHIFT = 0;
        Gravity.AXIS_Y_SHIFT = 4;
        Gravity.TOP = (Gravity.AXIS_PULL_BEFORE | Gravity.AXIS_SPECIFIED) << Gravity.AXIS_Y_SHIFT;
        Gravity.BOTTOM = (Gravity.AXIS_PULL_AFTER | Gravity.AXIS_SPECIFIED) << Gravity.AXIS_Y_SHIFT;
        Gravity.LEFT = (Gravity.AXIS_PULL_BEFORE | Gravity.AXIS_SPECIFIED) << Gravity.AXIS_X_SHIFT;
        Gravity.RIGHT = (Gravity.AXIS_PULL_AFTER | Gravity.AXIS_SPECIFIED) << Gravity.AXIS_X_SHIFT;
        Gravity.CENTER_VERTICAL = Gravity.AXIS_SPECIFIED << Gravity.AXIS_Y_SHIFT;
        Gravity.FILL_VERTICAL = Gravity.TOP | Gravity.BOTTOM;
        Gravity.CENTER_HORIZONTAL = Gravity.AXIS_SPECIFIED << Gravity.AXIS_X_SHIFT;
        Gravity.FILL_HORIZONTAL = Gravity.LEFT | Gravity.RIGHT;
        Gravity.CENTER = Gravity.CENTER_VERTICAL | Gravity.CENTER_HORIZONTAL;
        Gravity.FILL = Gravity.FILL_VERTICAL | Gravity.FILL_HORIZONTAL;
        Gravity.CLIP_VERTICAL = Gravity.AXIS_CLIP << Gravity.AXIS_Y_SHIFT;
        Gravity.CLIP_HORIZONTAL = Gravity.AXIS_CLIP << Gravity.AXIS_X_SHIFT;
        Gravity.RELATIVE_LAYOUT_DIRECTION = 0x00800000;
        Gravity.HORIZONTAL_GRAVITY_MASK = (Gravity.AXIS_SPECIFIED |
            Gravity.AXIS_PULL_BEFORE | Gravity.AXIS_PULL_AFTER) << Gravity.AXIS_X_SHIFT;
        Gravity.VERTICAL_GRAVITY_MASK = (Gravity.AXIS_SPECIFIED |
            Gravity.AXIS_PULL_BEFORE | Gravity.AXIS_PULL_AFTER) << Gravity.AXIS_Y_SHIFT;
        Gravity.DISPLAY_CLIP_VERTICAL = 0x10000000;
        Gravity.DISPLAY_CLIP_HORIZONTAL = 0x01000000;
        Gravity.START = Gravity.RELATIVE_LAYOUT_DIRECTION | Gravity.LEFT;
        Gravity.END = Gravity.RELATIVE_LAYOUT_DIRECTION | Gravity.RIGHT;
        Gravity.RELATIVE_HORIZONTAL_GRAVITY_MASK = Gravity.START | Gravity.END;
        view.Gravity = Gravity;
    })(view = android.view || (android.view = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/9.
 */
///<reference path="../view/Gravity.ts"/>
///<reference path="../view/View.ts"/>
///<reference path="../view/ViewGroup.ts"/>
///<reference path="../graphics/drawable/Drawable.ts"/>
///<reference path="../graphics/Rect.ts"/>
var android;
(function (android) {
    var widget;
    (function (widget) {
        var Gravity = android.view.Gravity;
        var View = android.view.View;
        var ViewGroup = android.view.ViewGroup;
        var Rect = android.graphics.Rect;
        class FrameLayout extends ViewGroup {
            constructor(...args) {
                super(...args);
                this.mMeasureAllChildren = false;
                this.mForegroundPaddingLeft = 0;
                this.mForegroundPaddingTop = 0;
                this.mForegroundPaddingRight = 0;
                this.mForegroundPaddingBottom = 0;
                this.mSelfBounds = new Rect();
                this.mOverlayBounds = new Rect();
                this.mForegroundGravity = Gravity.FILL;
                this.mForegroundInPadding = true;
                this.mForegroundBoundsChanged = false;
                this.mMatchParentChildren = new Array(1);
            }
            getForegroundGravity() {
                return this.mForegroundGravity;
            }
            setForegroundGravity(foregroundGravity) {
                if (this.mForegroundGravity != foregroundGravity) {
                    if ((foregroundGravity & Gravity.RELATIVE_HORIZONTAL_GRAVITY_MASK) == 0) {
                        foregroundGravity |= Gravity.START;
                    }
                    if ((foregroundGravity & Gravity.VERTICAL_GRAVITY_MASK) == 0) {
                        foregroundGravity |= Gravity.TOP;
                    }
                    this.mForegroundGravity = foregroundGravity;
                    if (this.mForegroundGravity == Gravity.FILL && this.mForeground != null) {
                        let padding = new Rect();
                        if (this.mForeground.getPadding(padding)) {
                            this.mForegroundPaddingLeft = padding.left;
                            this.mForegroundPaddingTop = padding.top;
                            this.mForegroundPaddingRight = padding.right;
                            this.mForegroundPaddingBottom = padding.bottom;
                        }
                    }
                    else {
                        this.mForegroundPaddingLeft = 0;
                        this.mForegroundPaddingTop = 0;
                        this.mForegroundPaddingRight = 0;
                        this.mForegroundPaddingBottom = 0;
                    }
                    this.requestLayout();
                }
            }
            verifyDrawable(who) {
                return super.verifyDrawable(who) || (who == this.mForeground);
            }
            jumpDrawablesToCurrentState() {
                super.jumpDrawablesToCurrentState();
                if (this.mForeground != null)
                    this.mForeground.jumpToCurrentState();
            }
            drawableStateChanged() {
                super.drawableStateChanged();
                if (this.mForeground != null && this.mForeground.isStateful()) {
                    this.mForeground.setState(this.getDrawableState());
                }
            }
            generateDefaultLayoutParams() {
                return new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT);
            }
            setForeground(drawable) {
            }
            getForeground() {
                return this.mForeground;
            }
            getPaddingLeftWithForeground() {
                return this.mForegroundInPadding ? Math.max(this.mPaddingLeft, this.mForegroundPaddingLeft) :
                    this.mPaddingLeft + this.mForegroundPaddingLeft;
            }
            getPaddingRightWithForeground() {
                return this.mForegroundInPadding ? Math.max(this.mPaddingRight, this.mForegroundPaddingRight) :
                    this.mPaddingRight + this.mForegroundPaddingRight;
            }
            getPaddingTopWithForeground() {
                return this.mForegroundInPadding ? Math.max(this.mPaddingTop, this.mForegroundPaddingTop) :
                    this.mPaddingTop + this.mForegroundPaddingTop;
            }
            getPaddingBottomWithForeground() {
                return this.mForegroundInPadding ? Math.max(this.mPaddingBottom, this.mForegroundPaddingBottom) :
                    this.mPaddingBottom + this.mForegroundPaddingBottom;
            }
            onMeasure(widthMeasureSpec, heightMeasureSpec) {
                let count = this.getChildCount();
                let measureMatchParentChildren = View.MeasureSpec.getMode(widthMeasureSpec) != View.MeasureSpec.EXACTLY ||
                    View.MeasureSpec.getMode(heightMeasureSpec) != View.MeasureSpec.EXACTLY;
                this.mMatchParentChildren = [];
                let maxHeight = 0;
                let maxWidth = 0;
                let childState = 0;
                for (let i = 0; i < count; i++) {
                    let child = this.getChildAt(i);
                    if (this.mMeasureAllChildren || child.getVisibility() != View.GONE) {
                        this.measureChildWithMargins(child, widthMeasureSpec, 0, heightMeasureSpec, 0);
                        let lp = child.getLayoutParams();
                        maxWidth = Math.max(maxWidth, child.getMeasuredWidth() + lp.leftMargin + lp.rightMargin);
                        maxHeight = Math.max(maxHeight, child.getMeasuredHeight() + lp.topMargin + lp.bottomMargin);
                        childState = View.combineMeasuredStates(childState, child.getMeasuredState());
                        if (measureMatchParentChildren) {
                            if (lp.width == FrameLayout.LayoutParams.MATCH_PARENT ||
                                lp.height == FrameLayout.LayoutParams.MATCH_PARENT) {
                                this.mMatchParentChildren.push(child);
                            }
                        }
                    }
                }
                maxWidth += this.getPaddingLeftWithForeground() + this.getPaddingRightWithForeground();
                maxHeight += this.getPaddingTopWithForeground() + this.getPaddingBottomWithForeground();
                maxHeight = Math.max(maxHeight, this.getSuggestedMinimumHeight());
                maxWidth = Math.max(maxWidth, this.getSuggestedMinimumWidth());
                let drawable = this.getForeground();
                if (drawable != null) {
                    maxHeight = Math.max(maxHeight, drawable.getMinimumHeight());
                    maxWidth = Math.max(maxWidth, drawable.getMinimumWidth());
                }
                this.setMeasuredDimension(View.resolveSizeAndState(maxWidth, widthMeasureSpec, childState), View.resolveSizeAndState(maxHeight, heightMeasureSpec, childState << View.MEASURED_HEIGHT_STATE_SHIFT));
                count = this.mMatchParentChildren.length;
                if (count > 1) {
                    for (let i = 0; i < count; i++) {
                        let child = this.mMatchParentChildren[i];
                        let lp = child.getLayoutParams();
                        let childWidthMeasureSpec;
                        let childHeightMeasureSpec;
                        if (lp.width == FrameLayout.LayoutParams.MATCH_PARENT) {
                            childWidthMeasureSpec = View.MeasureSpec.makeMeasureSpec(this.getMeasuredWidth() -
                                this.getPaddingLeftWithForeground() - this.getPaddingRightWithForeground() -
                                lp.leftMargin - lp.rightMargin, View.MeasureSpec.EXACTLY);
                        }
                        else {
                            childWidthMeasureSpec = ViewGroup.getChildMeasureSpec(widthMeasureSpec, this.getPaddingLeftWithForeground() + this.getPaddingRightWithForeground() +
                                lp.leftMargin + lp.rightMargin, lp.width);
                        }
                        if (lp.height == FrameLayout.LayoutParams.MATCH_PARENT) {
                            childHeightMeasureSpec = View.MeasureSpec.makeMeasureSpec(this.getMeasuredHeight() -
                                this.getPaddingTopWithForeground() - this.getPaddingBottomWithForeground() -
                                lp.topMargin - lp.bottomMargin, View.MeasureSpec.EXACTLY);
                        }
                        else {
                            childHeightMeasureSpec = ViewGroup.getChildMeasureSpec(heightMeasureSpec, this.getPaddingTopWithForeground() + this.getPaddingBottomWithForeground() +
                                lp.topMargin + lp.bottomMargin, lp.height);
                        }
                        child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
                    }
                }
            }
            onLayout(changed, left, top, right, bottom) {
                this.layoutChildren(left, top, right, bottom, false);
            }
            layoutChildren(left, top, right, bottom, forceLeftGravity) {
                const count = this.getChildCount();
                const parentLeft = this.getPaddingLeftWithForeground();
                const parentRight = right - left - this.getPaddingRightWithForeground();
                const parentTop = this.getPaddingTopWithForeground();
                const parentBottom = bottom - top - this.getPaddingBottomWithForeground();
                this.mForegroundBoundsChanged = true;
                for (let i = 0; i < count; i++) {
                    let child = this.getChildAt(i);
                    if (child.getVisibility() != View.GONE) {
                        const lp = child.getLayoutParams();
                        const width = child.getMeasuredWidth();
                        const height = child.getMeasuredHeight();
                        let childLeft;
                        let childTop;
                        let gravity = lp.gravity;
                        if (gravity == -1) {
                            gravity = FrameLayout.DEFAULT_CHILD_GRAVITY;
                        }
                        const absoluteGravity = gravity;
                        const verticalGravity = gravity & Gravity.VERTICAL_GRAVITY_MASK;
                        switch (absoluteGravity & Gravity.HORIZONTAL_GRAVITY_MASK) {
                            case Gravity.CENTER_HORIZONTAL:
                                childLeft = parentLeft + (parentRight - parentLeft - width) / 2 +
                                    lp.leftMargin - lp.rightMargin;
                                break;
                            case Gravity.RIGHT:
                                if (!forceLeftGravity) {
                                    childLeft = parentRight - width - lp.rightMargin;
                                    break;
                                }
                            case Gravity.LEFT:
                            default:
                                childLeft = parentLeft + lp.leftMargin;
                        }
                        switch (verticalGravity) {
                            case Gravity.TOP:
                                childTop = parentTop + lp.topMargin;
                                break;
                            case Gravity.CENTER_VERTICAL:
                                childTop = parentTop + (parentBottom - parentTop - height) / 2 +
                                    lp.topMargin - lp.bottomMargin;
                                break;
                            case Gravity.BOTTOM:
                                childTop = parentBottom - height - lp.bottomMargin;
                                break;
                            default:
                                childTop = parentTop + lp.topMargin;
                        }
                        child.layout(childLeft, childTop, childLeft + width, childTop + height);
                    }
                }
            }
            onSizeChanged(w, h, oldw, oldh) {
                super.onSizeChanged(w, h, oldw, oldh);
                this.mForegroundBoundsChanged = true;
            }
            setMeasureAllChildren(measureAll) {
                this.mMeasureAllChildren = measureAll;
            }
            getMeasureAllChildren() {
                return this.mMeasureAllChildren;
            }
            shouldDelayChildPressedState() {
                return false;
            }
        }
        FrameLayout.DEFAULT_CHILD_GRAVITY = Gravity.TOP | Gravity.START;
        widget.FrameLayout = FrameLayout;
        (function (FrameLayout) {
            class LayoutParams extends ViewGroup.MarginLayoutParams {
                constructor(...args) {
                    super();
                    this.gravity = -1;
                    if (args.length === 1 && args[0] instanceof LayoutParams) {
                        this.gravity = args[0].gravity;
                    }
                    else {
                        let [width, height, gravity = -1] = args;
                        super(width, height);
                        this.gravity = gravity;
                    }
                }
            }
            FrameLayout.LayoutParams = LayoutParams;
        })(FrameLayout = widget.FrameLayout || (widget.FrameLayout = {}));
    })(widget = android.widget || (android.widget = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/11.
 */
///<reference path="../view/View.ts"/>
///<reference path="../view/ViewRootImpl.ts"/>
///<reference path="../widget/FrameLayout.ts"/>
var android;
(function (android) {
    var app;
    (function (app) {
        var View = android.view.View;
        var ViewRootImpl = android.view.ViewRootImpl;
        var FrameLayout = android.widget.FrameLayout;
        class RootLayout extends FrameLayout {
        }
        class Activity extends HTMLDivElement {
            createdCallback() {
                this.viewRootImpl = new ViewRootImpl();
                this.content = new RootLayout();
                Array.from(this.children).forEach((item) => {
                    if (item instanceof HTMLElement) {
                        let view = View.inflate(item);
                        if (view)
                            this.addContentView(view);
                    }
                });
                this.innerHTML = '';
                this.viewRootImpl.setView(this.content);
                if (!this.style.position) {
                    this.style.position = "relative";
                }
                if (!this.style.display) {
                    this.style.display = "inline-block";
                }
                let canvas = document.createElement("canvas");
                this.appendChild(canvas);
                canvas.style.position = "absolute";
                canvas.style.left = '0px';
                canvas.style.top = '0px';
                canvas.style.right = '0px';
                canvas.style.bottom = '0px';
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                this.appendChild(this.content.bindElement);
            }
            attachedCallback() {
                this.viewRootImpl.mWinFrame.set(0, 0, this.offsetWidth, this.offsetHeight);
                this.viewRootImpl.requestLayout();
            }
            detachedCallback() {
            }
            attributeChangedCallback(attributeName, oldVal, newVal) {
            }
            setContentView(view) {
                this.content.removeAllViews();
                this.content.addView(view);
            }
            addContentView(view) {
                this.content.addView(view);
            }
            findViewById(id) {
                return this.content.findViewById(id);
            }
        }
        app.Activity = Activity;
        class Root extends Activity {
        }
        document.registerElement("android-root", Root);
        document.registerElement("android-activity", Activity);
    })(app = android.app || (android.app = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/6.
 */
//use the deepest sub class as enter
///<reference path="android/view/ViewOverlay.ts"/>
///<reference path="android/widget/FrameLayout.ts"/>
///<reference path="android/app/Activity.ts"/>
window[`android`] = android;
window[`java`] = java;

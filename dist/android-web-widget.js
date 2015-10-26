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
        Log.View_DBG = false;
        Log.VelocityTracker_DBG = false;
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
                else {
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
                    let [left = 0, t = 0, right = 0, bottom = 0] = args;
                    if (this.left < right && left < this.right && this.top < bottom && t < this.bottom) {
                        if (this.left < left)
                            this.left = left;
                        if (this.top < t)
                            this.top = t;
                        if (this.right > right)
                            this.right = right;
                        if (this.bottom > bottom)
                            this.bottom = bottom;
                        return true;
                    }
                    return false;
                }
            }
            intersects(...args) {
                if (args.length === 1) {
                    let rect = args[0];
                    return this.intersects(rect.left, rect.top, rect.right, rect.bottom);
                }
                else {
                    let [left = 0, t = 0, right = 0, bottom = 0] = args;
                    return this.left < right && left < this.right && this.top < bottom && t < this.bottom;
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
                    return PixelFormat.OPAQUE;
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
/**
 * Created by linfaxin on 15/10/18.
 */
///<reference path="Rect.ts"/>
var android;
(function (android) {
    var graphics;
    (function (graphics) {
        class Matrix {
            isIdentity() {
                return true;
            }
            mapRect(boundingRect) {
                return false;
            }
        }
        Matrix.IDENTITY_MATRIX = new Matrix();
        graphics.Matrix = Matrix;
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
                    iterator() {
                        this.isDataNew = false;
                        return this.mData;
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
            dispatchOnScrollChanged() {
                let listeners = this.mOnScrollChangedListeners;
                if (listeners != null && listeners.size() > 0) {
                    let access = listeners.start();
                    try {
                        let count = access.length;
                        for (let i = 0; i < count; i++) {
                            access[i].onScrollChanged();
                        }
                    }
                    finally {
                        listeners.end();
                    }
                }
            }
            dispatchOnDraw() {
                if (this.mOnDrawListeners != null) {
                    for (let listener of this.mOnDrawListeners) {
                        listener.onDraw();
                    }
                }
            }
        }
        view.ViewTreeObserver = ViewTreeObserver;
    })(view = android.view || (android.view = {}));
})(android || (android = {}));
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
                    if (Resources.displayMetrics)
                        return Resources.displayMetrics;
                    Resources.displayMetrics = new DisplayMetrics();
                    let displayMetrics = Resources.displayMetrics;
                    displayMetrics.widthPixels = window.innerWidth;
                    displayMetrics.heightPixels = window.innerHeight;
                    displayMetrics.xdpi = window.screen.deviceXDPI || DisplayMetrics.DENSITY_DEFAULT;
                    displayMetrics.ydpi = window.screen.deviceYDPI || DisplayMetrics.DENSITY_DEFAULT;
                    displayMetrics.density = Resources.density;
                    displayMetrics.densityDpi = displayMetrics.density * DisplayMetrics.DENSITY_DEFAULT;
                    displayMetrics.scaledDensity = displayMetrics.density;
                    return displayMetrics;
                }
                static setDensity(density) {
                    Resources.density = density;
                    Resources.displayMetrics = null;
                }
            }
            Resources.density = 1;
            res.Resources = Resources;
        })(res = content.res || (content.res = {}));
    })(content = android.content || (android.content = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/6.
 */
///<reference path="../content/res/Resources.ts"/>
var android;
(function (android) {
    var view;
    (function (view) {
        var Resources = android.content.res.Resources;
        let density = Resources.getDisplayMetrics().density;
        class MotionEvent {
            constructor(e, action) {
                this.mAction = 0;
                this.mDownTime = 0;
                this.mEventTime = 0;
                this.mActivePointerId = 0;
                this.mXOffset = 0;
                this.mYOffset = 0;
                this.mViewRootTop = 0;
                this.mViewRootLeft = 0;
                this.mAction = action;
                if (e)
                    this.init(e, action);
            }
            static obtainWithTouchEvent(e, action) {
                return new MotionEvent(e, action);
            }
            static obtain(event) {
                let newEv = new MotionEvent(null, 0);
                Object.assign(newEv, event);
                return newEv;
            }
            static obtainWithAction(downTime, eventTime, action, x, y) {
                let newEv = new MotionEvent(null, action);
                newEv.mDownTime = downTime;
                newEv.mEventTime = eventTime;
                let touch = {
                    identifier: 0,
                    target: null,
                    screenX: x,
                    screenY: y,
                    clientX: x,
                    clientY: y,
                    pageX: x,
                    pageY: y
                };
                newEv.mTouchingPointers = [touch];
                return newEv;
            }
            init(e, baseAction, windowXOffset = 0, windowYOffset = 0) {
                let action = baseAction;
                let actionIndex = -1;
                let activeTouch = e.changedTouches[0];
                let activePointerId = activeTouch.identifier;
                for (let i = 0, length = e.touches.length; i < length; i++) {
                    if (e.touches[i].identifier === activePointerId) {
                        actionIndex = i;
                        MotionEvent.IdIndexCache.set(activePointerId, i);
                        break;
                    }
                }
                if (actionIndex < 0 && (baseAction === MotionEvent.ACTION_UP || baseAction === MotionEvent.ACTION_CANCEL)) {
                    actionIndex = MotionEvent.IdIndexCache.get(activePointerId);
                }
                if (actionIndex < 0)
                    throw Error('not find action index');
                switch (baseAction) {
                    case MotionEvent.ACTION_DOWN:
                    case MotionEvent.ACTION_UP:
                        MotionEvent.TouchMoveRecord.set(activePointerId, []);
                        break;
                    case MotionEvent.ACTION_MOVE:
                        let moveHistory = MotionEvent.TouchMoveRecord.get(activePointerId);
                        if (moveHistory) {
                            activeTouch.mEventTime = e.timeStamp;
                            moveHistory.push(activeTouch);
                            if (moveHistory.length > MotionEvent.HistoryMaxSize)
                                moveHistory.shift();
                        }
                        break;
                }
                this.mTouchingPointers = Array.from(e.touches);
                if (baseAction === MotionEvent.ACTION_UP) {
                    this.mTouchingPointers.splice(actionIndex, 0, activeTouch);
                }
                if (this.mTouchingPointers.length > 1) {
                    switch (action) {
                        case MotionEvent.ACTION_DOWN:
                            action = MotionEvent.ACTION_POINTER_DOWN;
                            break;
                        case MotionEvent.ACTION_UP:
                            action = MotionEvent.ACTION_POINTER_UP;
                            break;
                    }
                }
                this.mAction = actionIndex << MotionEvent.ACTION_POINTER_INDEX_SHIFT | action;
                this.mActivePointerId = activePointerId;
                if (activePointerId === 0 && action == MotionEvent.ACTION_DOWN) {
                    this.mDownTime = e.timeStamp;
                }
                this.mEventTime = e.timeStamp;
                this.mViewRootLeft = windowXOffset;
                this.mViewRootTop = windowYOffset;
            }
            recycle() {
            }
            getAction() {
                return this.mAction;
            }
            getActionMasked() {
                return this.mAction & MotionEvent.ACTION_MASK;
            }
            getActionIndex() {
                return (this.mAction & MotionEvent.ACTION_POINTER_INDEX_MASK) >> MotionEvent.ACTION_POINTER_INDEX_SHIFT;
            }
            getDownTime() {
                return this.mDownTime;
            }
            getEventTime() {
                return this.mEventTime;
            }
            getX(pointerIndex = 0) {
                return (this.mTouchingPointers[pointerIndex].pageX - this.mViewRootLeft) * density + this.mXOffset;
            }
            getY(pointerIndex = 0) {
                return (this.mTouchingPointers[pointerIndex].pageY - this.mViewRootTop) * density + this.mYOffset;
            }
            getPointerCount() {
                return this.mTouchingPointers.length;
            }
            getPointerId(pointerIndex) {
                return this.mTouchingPointers[pointerIndex].identifier;
            }
            findPointerIndex(pointerId) {
                for (let i = 0, length = this.mTouchingPointers.length; i < length; i++) {
                    if (this.mTouchingPointers[i].identifier === pointerId) {
                        return i;
                    }
                }
                return -1;
            }
            getRawX() {
                return (this.mTouchingPointers[0].pageX - this.mViewRootLeft) * density;
            }
            getRawY() {
                return (this.mTouchingPointers[0].pageY - this.mViewRootTop) * density;
            }
            getHistorySize(id = this.mActivePointerId) {
                let moveHistory = MotionEvent.TouchMoveRecord.get(id);
                return moveHistory ? moveHistory.length : 0;
            }
            getHistoricalX(pointerIndex, pos) {
                let moveHistory = MotionEvent.TouchMoveRecord.get(this.mTouchingPointers[pointerIndex].identifier);
                return (moveHistory[pos].pageX - this.mViewRootLeft) * density + this.mXOffset;
            }
            getHistoricalY(pointerIndex, pos) {
                let moveHistory = MotionEvent.TouchMoveRecord.get(this.mTouchingPointers[pointerIndex].identifier);
                return (moveHistory[pos].pageY - this.mViewRootTop) * density + this.mYOffset;
            }
            getHistoricalEventTime(...args) {
                let pos, activePointerId;
                if (args.length === 1) {
                    pos = args[0];
                    activePointerId = this.mActivePointerId;
                }
                else {
                    pos = args[1];
                    activePointerId = this.getPointerId(args[0]);
                }
                let moveHistory = MotionEvent.TouchMoveRecord.get(activePointerId);
                return moveHistory[pos].mEventTime;
            }
            setAction(action) {
                this.mAction = action;
            }
            offsetLocation(deltaX, deltaY) {
                this.mXOffset += deltaX;
                this.mYOffset += deltaY;
            }
            setLocation(x, y) {
                this.mXOffset = x - this.getRawX();
                this.mYOffset = y - this.getRawY();
            }
            getPointerIdBits() {
                let idBits = 0;
                let pointerCount = this.getPointerCount();
                for (let i = 0; i < pointerCount; i++) {
                    idBits |= 1 << this.getPointerId(i);
                }
                return idBits;
            }
            split(idBits) {
                let ev = MotionEvent.obtain(this);
                let oldPointerCount = this.getPointerCount();
                const oldAction = this.getAction();
                const oldActionMasked = oldAction & MotionEvent.ACTION_MASK;
                let newPointerIds = [];
                for (let i = 0; i < oldPointerCount; i++) {
                    let pointerId = this.getPointerId(i);
                    let idBit = 1 << pointerId;
                    if ((idBit & idBits) != 0) {
                        newPointerIds.push(pointerId);
                    }
                }
                let newActionPointerIndex = newPointerIds.indexOf(this.mActivePointerId);
                let newPointerCount = newPointerIds.length;
                let newAction;
                if (oldActionMasked == MotionEvent.ACTION_POINTER_DOWN || oldActionMasked == MotionEvent.ACTION_POINTER_UP) {
                    if (newActionPointerIndex < 0) {
                        newAction = MotionEvent.ACTION_MOVE;
                    }
                    else if (newPointerCount == 1) {
                        newAction = oldActionMasked == MotionEvent.ACTION_POINTER_DOWN
                            ? MotionEvent.ACTION_DOWN : MotionEvent.ACTION_UP;
                    }
                    else {
                        newAction = oldActionMasked | (newActionPointerIndex << MotionEvent.ACTION_POINTER_INDEX_SHIFT);
                    }
                }
                else {
                    newAction = oldAction;
                }
                ev.mAction = newAction;
                ev.mTouchingPointers = this.mTouchingPointers.filter((item) => {
                    return newPointerIds.indexOf(item.identifier) >= 0;
                });
                return ev;
            }
            toString() {
                return "MotionEvent{action=" + this.getAction() + " x=" + this.getX()
                    + " y=" + this.getY() + "}";
            }
        }
        MotionEvent.ACTION_MASK = 0xff;
        MotionEvent.ACTION_DOWN = 0;
        MotionEvent.ACTION_UP = 1;
        MotionEvent.ACTION_MOVE = 2;
        MotionEvent.ACTION_CANCEL = 3;
        MotionEvent.ACTION_OUTSIDE = 4;
        MotionEvent.ACTION_POINTER_DOWN = 5;
        MotionEvent.ACTION_POINTER_UP = 6;
        MotionEvent.ACTION_HOVER_MOVE = 7;
        MotionEvent.ACTION_SCROLL = 8;
        MotionEvent.ACTION_HOVER_ENTER = 9;
        MotionEvent.ACTION_HOVER_EXIT = 10;
        MotionEvent.ACTION_POINTER_INDEX_MASK = 0xff00;
        MotionEvent.ACTION_POINTER_INDEX_SHIFT = 8;
        MotionEvent.HistoryMaxSize = 10;
        MotionEvent.TouchMoveRecord = new Map();
        MotionEvent.IdIndexCache = new Map();
        view.MotionEvent = MotionEvent;
    })(view = android.view || (android.view = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/5.
 */
///<reference path="../util/SparseArray.ts"/>
///<reference path="../content/res/Resources.ts"/>
var android;
(function (android) {
    var view;
    (function (view) {
        var Resources = android.content.res.Resources;
        const metrics = Resources.getDisplayMetrics();
        const density = metrics.density;
        const sizeAndDensity = density;
        class ViewConfiguration {
            constructor() {
                this.mEdgeSlop = sizeAndDensity * ViewConfiguration.EDGE_SLOP;
                this.mFadingEdgeLength = sizeAndDensity * ViewConfiguration.FADING_EDGE_LENGTH;
                this.mMinimumFlingVelocity = density * ViewConfiguration.MINIMUM_FLING_VELOCITY;
                this.mMaximumFlingVelocity = density * ViewConfiguration.MAXIMUM_FLING_VELOCITY;
                this.mScrollbarSize = density * ViewConfiguration.SCROLL_BAR_SIZE;
                this.mTouchSlop = density * ViewConfiguration.TOUCH_SLOP;
                this.mDoubleTapTouchSlop = sizeAndDensity * ViewConfiguration.DOUBLE_TAP_TOUCH_SLOP;
                this.mPagingTouchSlop = density * ViewConfiguration.PAGING_TOUCH_SLOP;
                this.mDoubleTapSlop = density * ViewConfiguration.DOUBLE_TAP_SLOP;
                this.mWindowTouchSlop = sizeAndDensity * ViewConfiguration.WINDOW_TOUCH_SLOP;
                this.mOverscrollDistance = sizeAndDensity * ViewConfiguration.OVERSCROLL_DISTANCE;
                this.mOverflingDistance = sizeAndDensity * ViewConfiguration.OVERFLING_DISTANCE;
            }
            static get() {
                if (!ViewConfiguration.instance) {
                    ViewConfiguration.instance = new ViewConfiguration();
                }
                return ViewConfiguration.instance;
            }
            getScaledScrollBarSize() {
                return this.mScrollbarSize;
            }
            static getScrollBarFadeDuration() {
                return ViewConfiguration.SCROLL_BAR_FADE_DURATION;
            }
            static getScrollDefaultDelay() {
                return ViewConfiguration.SCROLL_BAR_DEFAULT_DELAY;
            }
            getScaledFadingEdgeLength() {
                return this.mFadingEdgeLength;
            }
            static getPressedStateDuration() {
                return ViewConfiguration.PRESSED_STATE_DURATION;
            }
            static getLongPressTimeout() {
                return ViewConfiguration.DEFAULT_LONG_PRESS_TIMEOUT;
            }
            static getKeyRepeatDelay() {
                return ViewConfiguration.KEY_REPEAT_DELAY;
            }
            static getTapTimeout() {
                return ViewConfiguration.TAP_TIMEOUT;
            }
            static getJumpTapTimeout() {
                return ViewConfiguration.JUMP_TAP_TIMEOUT;
            }
            static getDoubleTapTimeout() {
                return ViewConfiguration.DOUBLE_TAP_TIMEOUT;
            }
            static getDoubleTapMinTime() {
                return ViewConfiguration.DOUBLE_TAP_MIN_TIME;
            }
            getScaledEdgeSlop() {
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
        ViewConfiguration.SCROLL_BAR_SIZE = 10;
        ViewConfiguration.SCROLL_BAR_FADE_DURATION = 250;
        ViewConfiguration.SCROLL_BAR_DEFAULT_DELAY = 300;
        ViewConfiguration.FADING_EDGE_LENGTH = 12;
        ViewConfiguration.PRESSED_STATE_DURATION = 64;
        ViewConfiguration.DEFAULT_LONG_PRESS_TIMEOUT = 500;
        ViewConfiguration.KEY_REPEAT_DELAY = 50;
        ViewConfiguration.GLOBAL_ACTIONS_KEY_TIMEOUT = 500;
        ViewConfiguration.TAP_TIMEOUT = 180;
        ViewConfiguration.JUMP_TAP_TIMEOUT = 500;
        ViewConfiguration.DOUBLE_TAP_TIMEOUT = 300;
        ViewConfiguration.DOUBLE_TAP_MIN_TIME = 40;
        ViewConfiguration.HOVER_TAP_TIMEOUT = 150;
        ViewConfiguration.HOVER_TAP_SLOP = 20;
        ViewConfiguration.ZOOM_CONTROLS_TIMEOUT = 3000;
        ViewConfiguration.EDGE_SLOP = 12;
        ViewConfiguration.TOUCH_SLOP = 8;
        ViewConfiguration.DOUBLE_TAP_TOUCH_SLOP = ViewConfiguration.TOUCH_SLOP;
        ViewConfiguration.PAGING_TOUCH_SLOP = ViewConfiguration.TOUCH_SLOP * 2;
        ViewConfiguration.DOUBLE_TAP_SLOP = 100;
        ViewConfiguration.WINDOW_TOUCH_SLOP = 16;
        ViewConfiguration.MINIMUM_FLING_VELOCITY = 50;
        ViewConfiguration.MAXIMUM_FLING_VELOCITY = 8000;
        ViewConfiguration.SCROLL_FRICTION = 0.015;
        ViewConfiguration.OVERSCROLL_DISTANCE = 800;
        ViewConfiguration.OVERFLING_DISTANCE = 400;
        view.ViewConfiguration = ViewConfiguration;
    })(view = android.view || (android.view = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/16.
 */
///<reference path="View.ts"/>
///<reference path="../graphics/Rect.ts"/>
///<reference path="ViewConfiguration.ts"/>
var android;
(function (android) {
    var view;
    (function (view) {
        var Rect = android.graphics.Rect;
        class TouchDelegate {
            constructor(bounds, delegateView) {
                this.mDelegateTargeted = false;
                this.mSlop = 0;
                this.mBounds = bounds;
                this.mSlop = view.ViewConfiguration.get().getScaledTouchSlop();
                this.mSlopBounds = new Rect(bounds);
                this.mSlopBounds.inset(-this.mSlop, -this.mSlop);
                this.mDelegateView = delegateView;
            }
            onTouchEvent(event) {
                let x = event.getX();
                let y = event.getY();
                let sendToDelegate = false;
                let hit = true;
                let handled = false;
                switch (event.getAction()) {
                    case view.MotionEvent.ACTION_DOWN:
                        let bounds = this.mBounds;
                        if (bounds.contains(x, y)) {
                            this.mDelegateTargeted = true;
                            sendToDelegate = true;
                        }
                        break;
                    case view.MotionEvent.ACTION_UP:
                    case view.MotionEvent.ACTION_MOVE:
                        sendToDelegate = this.mDelegateTargeted;
                        if (sendToDelegate) {
                            let slopBounds = this.mSlopBounds;
                            if (!slopBounds.contains(x, y)) {
                                hit = false;
                            }
                        }
                        break;
                    case view.MotionEvent.ACTION_CANCEL:
                        sendToDelegate = this.mDelegateTargeted;
                        this.mDelegateTargeted = false;
                        break;
                }
                if (sendToDelegate) {
                    let delegateView = this.mDelegateView;
                    if (hit) {
                        event.setLocation(delegateView.getWidth() / 2, delegateView.getHeight() / 2);
                    }
                    else {
                        let slop = this.mSlop;
                        event.setLocation(-(slop * 2), -(slop * 2));
                    }
                    handled = delegateView.dispatchTouchEvent(event);
                }
                return handled;
            }
        }
        view.TouchDelegate = TouchDelegate;
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
                    if (oldId > 0)
                        clearTimeout(oldId);
                    else if (oldId < 0)
                        cancelAnimationFrame(-oldId);
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
                let func = () => {
                    this.dispatchMessage(msg);
                    this.mQueue.recycleMessage(this, msg);
                };
                if (delayMillis <= 17) {
                    var id = -requestAnimationFrame(func);
                }
                else {
                    var id = setTimeout(func, delayMillis);
                }
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
var android;
(function (android) {
    var graphics;
    (function (graphics) {
        class Color {
            static alpha(color) {
                return color >>> 24;
            }
            static red(color) {
                return (color >> 16) & 0xFF;
            }
            static green(color) {
                return (color >> 8) & 0xFF;
            }
            static blue(color) {
                return color & 0xFF;
            }
            static rgb(red, green, blue) {
                return (0xFF << 24) | (red << 16) | (green << 8) | blue;
            }
            static argb(alpha, red, green, blue) {
                return (alpha << 24) | (red << 16) | (green << 8) | blue;
            }
            static parseColor(colorString) {
                if (colorString.charAt(0) == '#') {
                    let color = parseInt(colorString.substring(1), 16);
                    if (colorString.length == 7) {
                        color |= 0x00000000ff000000;
                    }
                    else if (colorString.length != 9) {
                        throw new Error("Unknown color");
                    }
                    return color;
                }
                else {
                    let color = Color.sColorNameMap.get(colorString.toLowerCase());
                    if (color != null) {
                        return color;
                    }
                }
                throw new Error("Unknown color");
            }
            static getHtmlColor(color) {
                let i = Color.sColorNameMap.get(color.toLowerCase());
                return i;
            }
        }
        Color.BLACK = 0xFF000000;
        Color.DKGRAY = 0xFF444444;
        Color.GRAY = 0xFF888888;
        Color.LTGRAY = 0xFFCCCCCC;
        Color.WHITE = 0xFFFFFFFF;
        Color.RED = 0xFFFF0000;
        Color.GREEN = 0xFF00FF00;
        Color.BLUE = 0xFF0000FF;
        Color.YELLOW = 0xFFFFFF00;
        Color.CYAN = 0xFF00FFFF;
        Color.MAGENTA = 0xFFFF00FF;
        Color.TRANSPARENT = 0;
        Color.sColorNameMap = new Map();
        graphics.Color = Color;
        Color.sColorNameMap = new Map();
        Color.sColorNameMap.set("black", Color.BLACK);
        Color.sColorNameMap.set("darkgray", Color.DKGRAY);
        Color.sColorNameMap.set("gray", Color.GRAY);
        Color.sColorNameMap.set("lightgray", Color.LTGRAY);
        Color.sColorNameMap.set("white", Color.WHITE);
        Color.sColorNameMap.set("red", Color.RED);
        Color.sColorNameMap.set("green", Color.GREEN);
        Color.sColorNameMap.set("blue", Color.BLUE);
        Color.sColorNameMap.set("yellow", Color.YELLOW);
        Color.sColorNameMap.set("cyan", Color.CYAN);
        Color.sColorNameMap.set("magenta", Color.MAGENTA);
        Color.sColorNameMap.set("aqua", 0xFF00FFFF);
        Color.sColorNameMap.set("fuchsia", 0xFFFF00FF);
        Color.sColorNameMap.set("darkgrey", Color.DKGRAY);
        Color.sColorNameMap.set("grey", Color.GRAY);
        Color.sColorNameMap.set("lightgrey", Color.LTGRAY);
        Color.sColorNameMap.set("lime", 0xFF00FF00);
        Color.sColorNameMap.set("maroon", 0xFF800000);
        Color.sColorNameMap.set("navy", 0xFF000080);
        Color.sColorNameMap.set("olive", 0xFF808000);
        Color.sColorNameMap.set("purple", 0xFF800080);
        Color.sColorNameMap.set("silver", 0xFFC0C0C0);
        Color.sColorNameMap.set("teal", 0xFF008080);
    })(graphics = android.graphics || (android.graphics = {}));
})(android || (android = {}));
///<reference path="../util/Pools.ts"/>
///<reference path="../util/Log.ts"/>
///<reference path="Rect.ts"/>
///<reference path="Color.ts"/>
var android;
(function (android) {
    var graphics;
    (function (graphics) {
        var Pools = android.util.Pools;
        var Rect = android.graphics.Rect;
        var Color = android.graphics.Color;
        class Canvas {
            constructor(...args) {
                this._saveCount = 0;
                this.shouldDoRectBeforeRestoreMap = new Map();
                this.mClipStateMap = new Map();
                this.mCanvasElement = args.length === 1 ? args[0] : document.createElement("canvas");
                if (args.length === 1) {
                    this.mCanvasElement = args[0];
                }
                else if (args.length === 2) {
                    this.mCanvasElement = document.createElement("canvas");
                    this.mCanvasElement.width = args[0];
                    this.mCanvasElement.height = args[1];
                }
                this.init();
            }
            init() {
                this._mCanvasContent = this.mCanvasElement.getContext("2d");
                this.mCurrentClip = new Rect(0, 0, this.mCanvasElement.width, this.mCanvasElement.height);
                this._saveCount = 0;
                this.fullRectForClip();
                this._mCanvasContent.clip();
                this.save();
            }
            get canvasElement() {
                return this.mCanvasElement;
            }
            getHeight() {
                return this.mCanvasElement.height;
            }
            getWidth() {
                return this.mCanvasElement.width;
            }
            translate(dx, dy) {
                if (this.mCurrentClip)
                    this.mCurrentClip.offset(-dx, -dy);
                this._mCanvasContent.translate(dx, dy);
            }
            scale(sx, sy, px, py) {
                if (px && py)
                    this.translate(px, py);
                this._mCanvasContent.scale(sx, sy);
                if (px && py)
                    this.translate(-px, -py);
            }
            rotate(degrees, px, py) {
                if (px && py)
                    this.translate(px, py);
                this._mCanvasContent.rotate(degrees);
                if (px && py)
                    this.translate(-px, -py);
            }
            drawRGB(r, g, b) {
                this._mCanvasContent.fillStyle = `rgb(${r},${g},${b})`;
                this._mCanvasContent.fillRect(this.mCurrentClip.left, this.mCurrentClip.top, this.mCurrentClip.width(), this.mCurrentClip.height());
            }
            drawARGB(a, r, g, b) {
                this._mCanvasContent.fillStyle = `rgba(${r},${g},${b},${a})`;
                this._mCanvasContent.fillRect(this.mCurrentClip.left, this.mCurrentClip.top, this.mCurrentClip.width(), this.mCurrentClip.height());
            }
            drawColor(color) {
                this.drawARGB(Color.alpha(color), Color.red(color), Color.green(color), Color.blue(color));
            }
            clearColor() {
                this._mCanvasContent.clearRect(this.mCurrentClip.left, this.mCurrentClip.top, this.mCurrentClip.width(), this.mCurrentClip.height());
            }
            save() {
                this._mCanvasContent.save();
                if (this.mCurrentClip)
                    this.mClipStateMap.set(this._saveCount, new Rect(this.mCurrentClip));
                this._saveCount++;
                return this._saveCount;
            }
            restore() {
                let doRects = this.shouldDoRectBeforeRestoreMap.get(this._saveCount);
                if (doRects && doRects.length > 0) {
                    doRects.forEach((rect) => {
                        this._mCanvasContent.rect(rect.left, rect.top, rect.width(), rect.height());
                    });
                    if (doRects.length % 2 == 1) {
                        this.fullRectForClip();
                    }
                    this.shouldDoRectBeforeRestoreMap.delete(this._saveCount);
                }
                this._saveCount--;
                this._mCanvasContent.restore();
                let savedClip = this.mClipStateMap.get(this._saveCount);
                if (savedClip) {
                    this.mClipStateMap.delete(this._saveCount);
                    this.mCurrentClip.set(savedClip);
                }
            }
            restoreToCount(saveCount) {
                if (saveCount <= 0)
                    throw Error('saveCount can\'t <= 0');
                while (saveCount <= this._saveCount) {
                    this.restore();
                }
            }
            getSaveCount() {
                return this._saveCount;
            }
            fullRectForClip() {
                this._mCanvasContent.rect(Canvas.FullRect.left, Canvas.FullRect.top, Canvas.FullRect.width(), Canvas.FullRect.height());
            }
            clipRect(...args) {
                let rect = new Rect();
                if (args.length === 1) {
                    rect.set(args[0]);
                }
                else {
                    let [left = 0, top = 0, right = 0, bottom = 0] = args;
                    rect.set(left, top, right, bottom);
                }
                this._mCanvasContent.rect(Math.floor(rect.left), Math.floor(rect.top), Math.ceil(rect.width()), Math.ceil(rect.height()));
                this.fullRectForClip();
                this._mCanvasContent.clip('evenodd');
                let doRects = this.shouldDoRectBeforeRestoreMap.get(this._saveCount);
                if (!doRects) {
                    doRects = [];
                    this.shouldDoRectBeforeRestoreMap.set(this._saveCount, doRects);
                }
                doRects.push(rect);
                this.mCurrentClip.intersect(rect);
                return rect.isEmpty();
            }
            getClipBounds(bounds) {
                if (!this.mCurrentClip)
                    this.mCurrentClip = new Rect();
                let rect = bounds || new Rect();
                rect.set(this.mCurrentClip);
                return rect;
            }
            quickReject(...args) {
                if (!this.mCurrentClip)
                    return false;
                if (args.length == 1) {
                    return !this.mCurrentClip.intersects(args[0]);
                }
                else {
                    let [left = 0, t = 0, right = 0, bottom = 0] = args;
                    return !this.mCurrentClip.intersects(left, t, right, bottom);
                }
            }
            drawCanvas(canvas, offsetX, offsetY, width, height, canvasOffsetX, canvasOffsetY, canvasImageWidth, canvasImageHeight) {
                this._mCanvasContent.drawImage(canvas.canvasElement, offsetX, offsetY, width, height, canvasOffsetX, canvasOffsetY, canvasImageWidth, canvasImageHeight);
            }
        }
        Canvas.FullRect = new Rect(-10000, -10000, 10000, 10000);
        Canvas.sPool = new Pools.SynchronizedPool(10);
        graphics.Canvas = Canvas;
    })(graphics = android.graphics || (android.graphics = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/9/27.
 */
///<reference path="../util/SparseArray.ts"/>
///<reference path="../util/Log.ts"/>
///<reference path="../graphics/drawable/Drawable.ts"/>
///<reference path="../graphics/PixelFormat.ts"/>
///<reference path="../graphics/Matrix.ts"/>
///<reference path="../../java/lang/StringBuilder.ts"/>
///<reference path="../../java/lang/Runnable.ts"/>
///<reference path="../../java/lang/util/concurrent/CopyOnWriteArrayList.ts"/>
///<reference path="ViewRootImpl.ts"/>
///<reference path="ViewParent.ts"/>
///<reference path="ViewGroup.ts"/>
///<reference path="ViewOverlay.ts"/>
///<reference path="ViewTreeObserver.ts"/>
///<reference path="MotionEvent.ts"/>
///<reference path="TouchDelegate.ts"/>
///<reference path="../os/Handler.ts"/>
///<reference path="../os/SystemClock.ts"/>
///<reference path="../content/res/Resources.ts"/>
///<reference path="../graphics/Rect.ts"/>
///<reference path="../graphics/Canvas.ts"/>
///<reference path="../util/Pools.ts"/>
var android;
(function (android) {
    var view;
    (function (view) {
        var SparseArray = android.util.SparseArray;
        var PixelFormat = android.graphics.PixelFormat;
        var Matrix = android.graphics.Matrix;
        var StringBuilder = java.lang.StringBuilder;
        var SystemClock = android.os.SystemClock;
        var Log = android.util.Log;
        var Rect = android.graphics.Rect;
        var Resources = android.content.res.Resources;
        var Pools = android.util.Pools;
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
                this.mHasPerformedLongPress = false;
                this.mMinWidth = 0;
                this.mMinHeight = 0;
                this.mTouchSlop = 0;
                this.mVerticalScrollFactor = 0;
                this.mOverScrollMode = 0;
                this.mViewFlags = 0;
                this.mLayerType = View.LAYER_TYPE_NONE;
                this.mWindowAttachCount = 0;
                this.mLastIsOpaque = false;
                this.mLeft = 0;
                this.mRight = 0;
                this.mTop = 0;
                this.mBottom = 0;
                this._mScrollX = 0;
                this._mScrollY = 0;
                this.mPaddingLeft = 0;
                this.mPaddingRight = 0;
                this.mPaddingTop = 0;
                this.mPaddingBottom = 0;
                this.mTouchSlop = view.ViewConfiguration.get().getScaledTouchSlop();
                this.initBindElement();
            }
            get mScrollX() {
                return this._mScrollX;
            }
            set mScrollX(value) {
                this._mScrollX = value;
                Array.from(this.bindElement.children).forEach((item) => {
                    if (item == this.bindScrollContent)
                        return;
                    if (value != 0)
                        item.style.marginLeft = -value + 'px';
                    else
                        item.style.marginLeft = "";
                });
                this.bindElement.scrollLeft = value;
            }
            get mScrollY() {
                return this._mScrollY;
            }
            set mScrollY(value) {
                this._mScrollY = value;
                Array.from(this.bindElement.children).forEach((item) => {
                    if (item == this.bindScrollContent)
                        return;
                    if (value != 0)
                        item.style.marginTop = -value + 'px';
                    else
                        item.style.marginTop = "";
                });
                this.bindElement.scrollTop = value;
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
            setScrollX(value) {
                this.scrollTo(value, this.mScrollY);
            }
            setScrollY(value) {
                this.scrollTo(this.mScrollX, value);
            }
            getScrollX() {
                return this.mScrollX;
            }
            getScrollY() {
                return this.mScrollY;
            }
            getFinalAlpha() {
                return 1;
            }
            getMatrix() {
                return Matrix.IDENTITY_MATRIX;
            }
            hasIdentityMatrix() {
                return true;
            }
            transformRect(rect) {
                if (!this.getMatrix().isIdentity()) {
                    let boundingRect = this.mAttachInfo.mTmpTransformRect;
                    boundingRect.set(rect);
                    this.getMatrix().mapRect(boundingRect);
                    rect.set(boundingRect);
                }
            }
            pointInView(localX, localY, slop = 0) {
                return localX >= -slop && localY >= -slop && localX < ((this.mRight - this.mLeft) + slop) &&
                    localY < ((this.mBottom - this.mTop) + slop);
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
            post(action) {
                let attachInfo = this.mAttachInfo;
                if (attachInfo != null) {
                    return attachInfo.mHandler.post(action);
                }
                view.ViewRootImpl.getRunQueue().post(action);
                return true;
            }
            postDelayed(action, delayMillis) {
                let attachInfo = this.mAttachInfo;
                if (attachInfo != null) {
                    return attachInfo.mHandler.postDelayed(action, delayMillis);
                }
                view.ViewRootImpl.getRunQueue().postDelayed(action, delayMillis);
                return true;
            }
            postOnAnimation(action) {
                return this.post(action);
            }
            postOnAnimationDelayed(action, delayMillis) {
                return this.postDelayed(action, delayMillis);
            }
            removeCallbacks(action) {
                if (action != null) {
                    let attachInfo = this.mAttachInfo;
                    if (attachInfo != null) {
                        attachInfo.mHandler.removeCallbacks(action);
                    }
                    else {
                        view.ViewRootImpl.getRunQueue().removeCallbacks(action);
                    }
                }
                return true;
            }
            getParent() {
                return this.mParent;
            }
            setFlags(flags, mask) {
                let old = this.mViewFlags;
                this.mViewFlags = (this.mViewFlags & ~mask) | (flags & mask);
                let changed = this.mViewFlags ^ old;
                if (changed == 0) {
                    return;
                }
                let privateFlags = this.mPrivateFlags;
                const newVisibility = flags & View.VISIBILITY_MASK;
                if (newVisibility == View.VISIBLE) {
                    if ((changed & View.VISIBILITY_MASK) != 0) {
                        this.mPrivateFlags |= View.PFLAG_DRAWN;
                        this.invalidate(true);
                        if ((this.mParent != null) && (this.mBottom > this.mTop) && (this.mRight > this.mLeft)) {
                            this.mParent.focusableViewAvailable(this);
                        }
                    }
                }
                if ((changed & View.GONE) != 0) {
                    this.requestLayout();
                    if (((this.mViewFlags & View.VISIBILITY_MASK) == View.GONE)) {
                        if (this.hasFocus())
                            this.clearFocus();
                        this.destroyDrawingCache();
                        if (this.mParent instanceof View) {
                            this.mParent.invalidate(true);
                        }
                        this.mPrivateFlags |= View.PFLAG_DRAWN;
                    }
                    if (this.mAttachInfo != null) {
                        this.mAttachInfo.mViewVisibilityChanged = true;
                    }
                }
                if ((changed & View.INVISIBLE) != 0) {
                    this.mPrivateFlags |= View.PFLAG_DRAWN;
                    if (((this.mViewFlags & View.VISIBILITY_MASK) == View.INVISIBLE)) {
                        if (this.getRootView() != this) {
                            if (this.hasFocus())
                                this.clearFocus();
                        }
                    }
                    if (this.mAttachInfo != null) {
                        this.mAttachInfo.mViewVisibilityChanged = true;
                    }
                }
                if ((changed & View.VISIBILITY_MASK) != 0) {
                    if (newVisibility != View.VISIBLE) {
                        this.cleanupDraw();
                    }
                    if (this.mParent instanceof view.ViewGroup) {
                        this.mParent.onChildVisibilityChanged(this, (changed & View.VISIBILITY_MASK), newVisibility);
                        this.mParent.invalidate(true);
                    }
                    else if (this.mParent != null) {
                        this.mParent.invalidateChild(this, null);
                    }
                    this.dispatchVisibilityChanged(this, newVisibility);
                }
                if ((changed & View.WILL_NOT_CACHE_DRAWING) != 0) {
                    this.destroyDrawingCache();
                }
                if ((changed & View.DRAWING_CACHE_ENABLED) != 0) {
                    this.destroyDrawingCache();
                    this.mPrivateFlags &= ~View.PFLAG_DRAWING_CACHE_VALID;
                    this.invalidateParentCaches();
                }
                if ((changed & View.DRAW_MASK) != 0) {
                    if ((this.mViewFlags & View.WILL_NOT_DRAW) != 0) {
                        if (this.mBackground != null) {
                            this.mPrivateFlags &= ~View.PFLAG_SKIP_DRAW;
                            this.mPrivateFlags |= View.PFLAG_ONLY_DRAWS_BACKGROUND;
                        }
                        else {
                            this.mPrivateFlags |= View.PFLAG_SKIP_DRAW;
                        }
                    }
                    else {
                        this.mPrivateFlags &= ~View.PFLAG_SKIP_DRAW;
                    }
                    this.requestLayout();
                    this.invalidate(true);
                }
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
            getListenerInfo() {
                if (this.mListenerInfo != null) {
                    return this.mListenerInfo;
                }
                this.mListenerInfo = new View.ListenerInfo();
                return this.mListenerInfo;
            }
            isFocusable() {
                return View.FOCUSABLE == (this.mViewFlags & View.FOCUSABLE_MASK);
            }
            isFocusableInTouchMode() {
                return View.FOCUSABLE_IN_TOUCH_MODE == (this.mViewFlags & View.FOCUSABLE_IN_TOUCH_MODE);
            }
            hasFocus() {
                return (this.mPrivateFlags & View.PFLAG_FOCUSED) != 0;
            }
            hasFocusable() {
                return (this.mViewFlags & View.VISIBILITY_MASK) == View.VISIBLE && this.isFocusable();
            }
            clearFocus() {
            }
            findFocus() {
                return (this.mPrivateFlags & View.PFLAG_FOCUSED) != 0 ? this : null;
            }
            isFocused() {
                return (this.mPrivateFlags & View.PFLAG_FOCUSED) != 0;
            }
            getVisibility() {
                return this.mViewFlags & View.VISIBILITY_MASK;
            }
            setVisibility(visibility) {
                this.setFlags(visibility, View.VISIBILITY_MASK);
                if (this.mBackground != null)
                    this.mBackground.setVisible(visibility == View.VISIBLE, false);
            }
            dispatchVisibilityChanged(changedView, visibility) {
                this.onVisibilityChanged(changedView, visibility);
            }
            onVisibilityChanged(changedView, visibility) {
                if (visibility == View.VISIBLE) {
                    if (this.mAttachInfo != null) {
                    }
                    else {
                        this.mPrivateFlags |= View.PFLAG_AWAKEN_SCROLL_BARS_ON_ATTACH;
                    }
                }
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
            resetPressedState() {
                if ((this.mViewFlags & View.ENABLED_MASK) == View.DISABLED) {
                    return;
                }
                if (this.isPressed()) {
                    this.setPressed(false);
                    if (!this.mHasPerformedLongPress) {
                        this.removeLongPressCallback();
                    }
                }
            }
            dispatchTouchEvent(event) {
                if (this.onFilterTouchEventForSecurity(event)) {
                    let li = this.mListenerInfo;
                    if (li != null && li.mOnTouchListener != null && (this.mViewFlags & View.ENABLED_MASK) == View.ENABLED
                        && li.mOnTouchListener.onTouch(this, event)) {
                        return true;
                    }
                    if (this.onTouchEvent(event)) {
                        return true;
                    }
                }
                return false;
            }
            onFilterTouchEventForSecurity(event) {
                return true;
            }
            onTouchEvent(event) {
                let viewFlags = this.mViewFlags;
                if ((viewFlags & View.ENABLED_MASK) == View.DISABLED) {
                    if (event.getAction() == view.MotionEvent.ACTION_UP && (this.mPrivateFlags & View.PFLAG_PRESSED) != 0) {
                        this.setPressed(false);
                    }
                    return (((viewFlags & View.CLICKABLE) == View.CLICKABLE ||
                        (viewFlags & View.LONG_CLICKABLE) == View.LONG_CLICKABLE));
                }
                if (this.mTouchDelegate != null) {
                    if (this.mTouchDelegate.onTouchEvent(event)) {
                        return true;
                    }
                }
                if (((viewFlags & View.CLICKABLE) == View.CLICKABLE ||
                    (viewFlags & View.LONG_CLICKABLE) == View.LONG_CLICKABLE)) {
                    switch (event.getAction()) {
                        case view.MotionEvent.ACTION_UP:
                            let prepressed = (this.mPrivateFlags & View.PFLAG_PREPRESSED) != 0;
                            if ((this.mPrivateFlags & View.PFLAG_PRESSED) != 0 || prepressed) {
                                let focusTaken = false;
                                if (prepressed) {
                                    this.setPressed(true);
                                }
                                if (!this.mHasPerformedLongPress) {
                                    this.removeLongPressCallback();
                                    if (!focusTaken) {
                                        if (this.mPerformClick == null) {
                                            this.mPerformClick = new PerformClick(this);
                                        }
                                        if (!this.post(this.mPerformClick)) {
                                            this.performClick();
                                        }
                                    }
                                }
                                if (this.mUnsetPressedState == null) {
                                    this.mUnsetPressedState = new UnsetPressedState(this);
                                }
                                if (prepressed) {
                                    this.postDelayed(this.mUnsetPressedState, view.ViewConfiguration.getPressedStateDuration());
                                }
                                else if (!this.post(this.mUnsetPressedState)) {
                                    this.mUnsetPressedState.run();
                                }
                                this.removeTapCallback();
                            }
                            break;
                        case view.MotionEvent.ACTION_DOWN:
                            this.mHasPerformedLongPress = false;
                            let isInScrollingContainer = this.isInScrollingContainer();
                            if (isInScrollingContainer) {
                                this.mPrivateFlags |= View.PFLAG_PREPRESSED;
                                if (this.mPendingCheckForTap == null) {
                                    this.mPendingCheckForTap = new CheckForTap(this);
                                }
                                this.postDelayed(this.mPendingCheckForTap, view.ViewConfiguration.getTapTimeout());
                            }
                            else {
                                this.setPressed(true);
                                this.checkForLongClick(0);
                            }
                            break;
                        case view.MotionEvent.ACTION_CANCEL:
                            this.setPressed(false);
                            this.removeTapCallback();
                            this.removeLongPressCallback();
                            break;
                        case view.MotionEvent.ACTION_MOVE:
                            const x = event.getX();
                            const y = event.getY();
                            if (!this.pointInView(x, y, this.mTouchSlop)) {
                                this.removeTapCallback();
                                if ((this.mPrivateFlags & View.PFLAG_PRESSED) != 0) {
                                    this.removeLongPressCallback();
                                    this.setPressed(false);
                                }
                            }
                            break;
                    }
                    return true;
                }
                return false;
            }
            isInScrollingContainer() {
                let p = this.getParent();
                while (p != null && p instanceof view.ViewGroup) {
                    if (p.shouldDelayChildPressedState()) {
                        return true;
                    }
                    p = p.getParent();
                }
                return false;
            }
            removeLongPressCallback() {
                if (this.mPendingCheckForLongPress != null) {
                    this.removeCallbacks(this.mPendingCheckForLongPress);
                }
            }
            removePerformClickCallback() {
                if (this.mPerformClick != null) {
                    this.removeCallbacks(this.mPerformClick);
                }
            }
            removeUnsetPressCallback() {
                if ((this.mPrivateFlags & View.PFLAG_PRESSED) != 0 && this.mUnsetPressedState != null) {
                    this.setPressed(false);
                    this.removeCallbacks(this.mUnsetPressedState);
                }
            }
            removeTapCallback() {
                if (this.mPendingCheckForTap != null) {
                    this.mPrivateFlags &= ~View.PFLAG_PREPRESSED;
                    this.removeCallbacks(this.mPendingCheckForTap);
                }
            }
            cancelLongPress() {
                this.removeLongPressCallback();
                this.removeTapCallback();
            }
            setTouchDelegate(delegate) {
                this.mTouchDelegate = delegate;
            }
            getTouchDelegate() {
                return this.mTouchDelegate;
            }
            setOnLongClickListener(l) {
                if (!this.isLongClickable()) {
                    this.setLongClickable(true);
                }
                this.getListenerInfo().mOnLongClickListener = l;
            }
            performClick() {
                let li = this.mListenerInfo;
                if (li != null && li.mOnClickListener != null) {
                    li.mOnClickListener.onClick(this);
                    return true;
                }
                return false;
            }
            callOnClick() {
                let li = this.mListenerInfo;
                if (li != null && li.mOnClickListener != null) {
                    li.mOnClickListener.onClick(this);
                    return true;
                }
                return false;
            }
            performLongClick() {
                let handled = false;
                let li = this.mListenerInfo;
                if (li != null && li.mOnLongClickListener != null) {
                    handled = li.mOnLongClickListener.onLongClick(this);
                }
                return handled;
            }
            checkForLongClick(delayOffset = 0) {
                if ((this.mViewFlags & View.LONG_CLICKABLE) == View.LONG_CLICKABLE) {
                    this.mHasPerformedLongPress = false;
                    if (this.mPendingCheckForLongPress == null) {
                        this.mPendingCheckForLongPress = new CheckForLongPress(this);
                    }
                    this.mPendingCheckForLongPress.rememberWindowAttachCount();
                    this.postDelayed(this.mPendingCheckForLongPress, view.ViewConfiguration.getLongPressTimeout() - delayOffset);
                }
            }
            setOnTouchListener(l) {
                this.getListenerInfo().mOnTouchListener = l;
            }
            isClickable() {
                return (this.mViewFlags & View.CLICKABLE) == View.CLICKABLE;
            }
            setClickable(clickable) {
                this.setFlags(clickable ? View.CLICKABLE : 0, View.CLICKABLE);
            }
            isLongClickable() {
                return (this.mViewFlags & View.LONG_CLICKABLE) == View.LONG_CLICKABLE;
            }
            setLongClickable(longClickable) {
                this.setFlags(longClickable ? View.LONG_CLICKABLE : 0, View.LONG_CLICKABLE);
            }
            setPressed(pressed) {
            }
            isPressed() {
                return (this.mPrivateFlags & View.PFLAG_PRESSED) == View.PFLAG_PRESSED;
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
            isLaidOut() {
                return (this.mPrivateFlags3 & View.PFLAG3_IS_LAID_OUT) == View.PFLAG3_IS_LAID_OUT;
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
            getDrawingRect(outRect) {
                outRect.left = this.mScrollX;
                outRect.top = this.mScrollY;
                outRect.right = this.mScrollX + (this.mRight - this.mLeft);
                outRect.bottom = this.mScrollY + (this.mBottom - this.mTop);
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
            _invalidateRect(l, t, r, b) {
                if (this.skipInvalidate()) {
                    return;
                }
                if ((this.mPrivateFlags & (View.PFLAG_DRAWN | View.PFLAG_HAS_BOUNDS)) == (View.PFLAG_DRAWN | View.PFLAG_HAS_BOUNDS) ||
                    (this.mPrivateFlags & View.PFLAG_DRAWING_CACHE_VALID) == View.PFLAG_DRAWING_CACHE_VALID ||
                    (this.mPrivateFlags & View.PFLAG_INVALIDATED) != View.PFLAG_INVALIDATED) {
                    this.mPrivateFlags &= ~View.PFLAG_DRAWING_CACHE_VALID;
                    this.mPrivateFlags |= View.PFLAG_INVALIDATED;
                    this.mPrivateFlags |= View.PFLAG_DIRTY;
                    const p = this.mParent;
                    const ai = this.mAttachInfo;
                    if (p != null && ai != null && l < r && t < b) {
                        const scrollX = this.mScrollX;
                        const scrollY = this.mScrollY;
                        const tmpr = ai.mTmpInvalRect;
                        tmpr.set(l - scrollX, t - scrollY, r - scrollX, b - scrollY);
                        p.invalidateChild(this, tmpr);
                    }
                }
            }
            _invalidateCache(invalidateCache = true) {
                if (this.skipInvalidate()) {
                    return;
                }
                if ((this.mPrivateFlags & (View.PFLAG_DRAWN | View.PFLAG_HAS_BOUNDS)) == (View.PFLAG_DRAWN | View.PFLAG_HAS_BOUNDS) ||
                    (invalidateCache && (this.mPrivateFlags & View.PFLAG_DRAWING_CACHE_VALID) == View.PFLAG_DRAWING_CACHE_VALID) ||
                    (this.mPrivateFlags & View.PFLAG_INVALIDATED) != View.PFLAG_INVALIDATED || this.isOpaque() != this.mLastIsOpaque) {
                    this.mLastIsOpaque = this.isOpaque();
                    this.mPrivateFlags &= ~View.PFLAG_DRAWN;
                    this.mPrivateFlags |= View.PFLAG_DIRTY;
                    if (invalidateCache) {
                        this.mPrivateFlags |= View.PFLAG_INVALIDATED;
                        this.mPrivateFlags &= ~View.PFLAG_DRAWING_CACHE_VALID;
                    }
                    const ai = this.mAttachInfo;
                    const p = this.mParent;
                    if (p != null && ai != null) {
                        const r = ai.mTmpInvalRect;
                        r.set(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop);
                        p.invalidateChild(this, r);
                    }
                }
            }
            invalidate(...args) {
                if (args.length === 0 || (args.length === 1 && typeof args[0] === 'boolean')) {
                    this._invalidateCache(args[0]);
                }
                else if (args.length === 1 && args[0] instanceof Rect) {
                    let rect = args[0];
                    this._invalidateRect(rect.left, rect.top, rect.right, rect.bottom);
                }
                else if (args.length === 4) {
                    this._invalidateRect(...args);
                }
            }
            invalidateViewProperty(invalidateParent, forceRedraw) {
                if ((this.mPrivateFlags & View.PFLAG_DRAW_ANIMATION) == View.PFLAG_DRAW_ANIMATION) {
                    if (invalidateParent) {
                        this.invalidateParentCaches();
                    }
                    if (forceRedraw) {
                        this.mPrivateFlags |= View.PFLAG_DRAWN;
                    }
                    this.invalidate(false);
                }
                else {
                    const ai = this.mAttachInfo;
                    const p = this.mParent;
                    if (p != null && ai != null) {
                        const r = ai.mTmpInvalRect;
                        r.set(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop);
                        if (this.mParent instanceof view.ViewGroup) {
                            this.mParent.invalidateChildFast(this, r);
                        }
                        else {
                            this.mParent.invalidateChild(this, r);
                        }
                    }
                }
            }
            invalidateParentCaches() {
                if (this.mParent instanceof View) {
                    this.mParent.mPrivateFlags |= View.PFLAG_INVALIDATED;
                }
            }
            invalidateParentIfNeeded() {
            }
            postInvalidate(l, t, r, b) {
                this.postInvalidateDelayed(0, l, t, r, b);
            }
            postInvalidateDelayed(delayMilliseconds, left, top, right, bottom) {
                const attachInfo = this.mAttachInfo;
                if (attachInfo != null) {
                    if (!Number.isInteger(left) || !Number.isInteger(top) || !Number.isInteger(right) || !Number.isInteger(bottom)) {
                        attachInfo.mViewRootImpl.dispatchInvalidateDelayed(this, delayMilliseconds);
                    }
                    else {
                        const info = View.AttachInfo.InvalidateInfo.obtain();
                        info.target = this;
                        info.left = left;
                        info.top = top;
                        info.right = right;
                        info.bottom = bottom;
                        attachInfo.mViewRootImpl.dispatchInvalidateRectDelayed(info, delayMilliseconds);
                    }
                }
            }
            postInvalidateOnAnimation(left, top, right, bottom) {
                const attachInfo = this.mAttachInfo;
                if (attachInfo != null) {
                    if (!Number.isInteger(left) || !Number.isInteger(top) || !Number.isInteger(right) || !Number.isInteger(bottom)) {
                        attachInfo.mViewRootImpl.dispatchInvalidateOnAnimation(this);
                    }
                    else {
                        const info = View.AttachInfo.InvalidateInfo.obtain();
                        info.target = this;
                        info.left = left;
                        info.top = top;
                        info.right = right;
                        info.bottom = bottom;
                        attachInfo.mViewRootImpl.dispatchInvalidateRectOnAnimation(info);
                    }
                }
            }
            skipInvalidate() {
                return (this.mViewFlags & View.VISIBILITY_MASK) != View.VISIBLE;
            }
            isOpaque() {
                return (this.mPrivateFlags & View.PFLAG_OPAQUE_MASK) == View.PFLAG_OPAQUE_MASK &&
                    this.getFinalAlpha() >= 1;
            }
            computeOpaqueFlags() {
                // Opaque if:
                //   - Has a background
                //   - Background is opaque
                //   - Doesn't have scrollbars or scrollbars overlay
                if (this.mBackground != null && this.mBackground.getOpacity() == PixelFormat.OPAQUE) {
                    this.mPrivateFlags |= View.PFLAG_OPAQUE_BACKGROUND;
                }
                else {
                    this.mPrivateFlags &= ~View.PFLAG_OPAQUE_BACKGROUND;
                }
            }
            getLayerType() {
                return this.mLayerType;
            }
            setClipBounds(clipBounds) {
                if (clipBounds != null) {
                    if (clipBounds.equals(this.mClipBounds)) {
                        return;
                    }
                    if (this.mClipBounds == null) {
                        this.invalidate();
                        this.mClipBounds = new Rect(clipBounds);
                    }
                    else {
                        this.invalidate(Math.min(this.mClipBounds.left, clipBounds.left), Math.min(this.mClipBounds.top, clipBounds.top), Math.max(this.mClipBounds.right, clipBounds.right), Math.max(this.mClipBounds.bottom, clipBounds.bottom));
                        this.mClipBounds.set(clipBounds);
                    }
                }
                else {
                    if (this.mClipBounds != null) {
                        this.invalidate();
                        this.mClipBounds = null;
                    }
                }
            }
            getClipBounds() {
                return (this.mClipBounds != null) ? new Rect(this.mClipBounds) : null;
            }
            getDrawingTime() {
                return this.mAttachInfo != null ? this.mAttachInfo.mDrawingTime : 0;
            }
            drawFromParent(canvas, parent, drawingTime) {
                let useDisplayListProperties = false;
                let more = false;
                let childHasIdentityMatrix = true;
                let flags = parent.mGroupFlags;
                let scalingRequired = false;
                let concatMatrix = false;
                let caching = false;
                let layerType = this.getLayerType();
                if ((flags & view.ViewGroup.FLAG_CHILDREN_DRAWN_WITH_CACHE) != 0 ||
                    (flags & view.ViewGroup.FLAG_ALWAYS_DRAWN_WITH_CACHE) != 0) {
                    caching = true;
                }
                else {
                    caching = (layerType != View.LAYER_TYPE_NONE);
                }
                concatMatrix == concatMatrix || !childHasIdentityMatrix;
                this.mPrivateFlags |= View.PFLAG_DRAWN;
                if (!concatMatrix &&
                    (flags & (view.ViewGroup.FLAG_SUPPORT_STATIC_TRANSFORMATIONS |
                        view.ViewGroup.FLAG_CLIP_CHILDREN)) == view.ViewGroup.FLAG_CLIP_CHILDREN &&
                    canvas.quickReject(this.mLeft, this.mTop, this.mRight, this.mBottom) &&
                    (this.mPrivateFlags & View.PFLAG_DRAW_ANIMATION) == 0) {
                    this.mPrivateFlags2 |= View.PFLAG2_VIEW_QUICK_REJECTED;
                    return more;
                }
                this.mPrivateFlags2 &= ~View.PFLAG2_VIEW_QUICK_REJECTED;
                let cache = null;
                if (caching) {
                    if (layerType != View.LAYER_TYPE_NONE) {
                        layerType = View.LAYER_TYPE_SOFTWARE;
                    }
                }
                let sx = this.mScrollX;
                let sy = this.mScrollY;
                this.computeScroll();
                let hasNoCache = cache == null;
                let offsetForScroll = cache == null;
                let restoreTo = canvas.save();
                if (offsetForScroll) {
                    canvas.translate(this.mLeft - sx, this.mTop - sy);
                }
                else {
                    canvas.translate(this.mLeft, this.mTop);
                }
                let alpha = 1;
                if ((flags & view.ViewGroup.FLAG_CLIP_CHILDREN) == view.ViewGroup.FLAG_CLIP_CHILDREN &&
                    !useDisplayListProperties && cache == null) {
                    if (offsetForScroll) {
                        canvas.clipRect(sx, sy, sx + (this.mRight - this.mLeft), sy + (this.mBottom - this.mTop));
                    }
                    else {
                        if (!scalingRequired || cache == null) {
                            canvas.clipRect(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop);
                        }
                        else {
                            canvas.clipRect(0, 0, cache.getWidth(), cache.getHeight());
                        }
                    }
                }
                if (hasNoCache) {
                    if ((this.mPrivateFlags & View.PFLAG_SKIP_DRAW) == View.PFLAG_SKIP_DRAW) {
                        this.mPrivateFlags &= ~View.PFLAG_DIRTY_MASK;
                        this.dispatchDraw(canvas);
                    }
                    else {
                        this.draw(canvas);
                    }
                }
                else if (cache != null) {
                    this.mPrivateFlags &= ~View.PFLAG_DIRTY_MASK;
                    if (alpha < 1) {
                        parent.mGroupFlags |= view.ViewGroup.FLAG_ALPHA_LOWER_THAN_ONE;
                    }
                    else if ((flags & view.ViewGroup.FLAG_ALPHA_LOWER_THAN_ONE) != 0) {
                        parent.mGroupFlags &= ~view.ViewGroup.FLAG_ALPHA_LOWER_THAN_ONE;
                    }
                    canvas.drawCanvas(cache, 0, 0);
                }
                if (restoreTo >= 0) {
                    canvas.restoreToCount(restoreTo);
                }
                return more;
            }
            draw(canvas) {
                if (this.mClipBounds != null) {
                    canvas.clipRect(this.mClipBounds);
                }
                let privateFlags = this.mPrivateFlags;
                const dirtyOpaque = (privateFlags & View.PFLAG_DIRTY_MASK) == View.PFLAG_DIRTY_OPAQUE &&
                    (this.mAttachInfo == null || !this.mAttachInfo.mIgnoreDirtyState);
                this.mPrivateFlags = (privateFlags & ~View.PFLAG_DIRTY_MASK) | View.PFLAG_DRAWN;
                if (!dirtyOpaque) {
                    let background = this.mBackground;
                    if (background != null) {
                        let scrollX = this.mScrollX;
                        let scrollY = this.mScrollY;
                        if (this.mBackgroundSizeChanged) {
                            background.setBounds(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop);
                            this.mBackgroundSizeChanged = false;
                        }
                        if ((scrollX | scrollY) == 0) {
                            background.draw(canvas);
                        }
                        else {
                            canvas.translate(scrollX, scrollY);
                            background.draw(canvas);
                            canvas.translate(-scrollX, -scrollY);
                        }
                    }
                }
                if (!dirtyOpaque)
                    this.onDraw(canvas);
                this.dispatchDraw(canvas);
                if (this.mOverlay != null && !this.mOverlay.isEmpty()) {
                    this.mOverlay.getOverlayView().dispatchDraw(canvas);
                }
            }
            onDraw(canvas) {
            }
            dispatchDraw(canvas) {
            }
            destroyDrawingCache() {
            }
            setWillNotDraw(willNotDraw) {
                this.setFlags(willNotDraw ? View.WILL_NOT_DRAW : 0, View.DRAW_MASK);
            }
            willNotDraw() {
                return (this.mViewFlags & View.DRAW_MASK) == View.WILL_NOT_DRAW;
            }
            setWillNotCacheDrawing(willNotCacheDrawing) {
                this.setFlags(willNotCacheDrawing ? View.WILL_NOT_CACHE_DRAWING : 0, View.WILL_NOT_CACHE_DRAWING);
            }
            willNotCacheDrawing() {
                return (this.mViewFlags & View.WILL_NOT_CACHE_DRAWING) == View.WILL_NOT_CACHE_DRAWING;
            }
            jumpDrawablesToCurrentState() {
                if (this.mBackground != null) {
                    this.mBackground.jumpToCurrentState();
                }
            }
            invalidateDrawable(drawable) {
                if (this.verifyDrawable(drawable)) {
                    const dirty = drawable.getBounds();
                    const scrollX = this.mScrollX;
                    const scrollY = this.mScrollY;
                    this.invalidate(dirty.left + scrollX, dirty.top + scrollY, dirty.right + scrollX, dirty.bottom + scrollY);
                }
            }
            scheduleDrawable(who, what, when) {
                if (this.verifyDrawable(who) && what != null) {
                    const delay = when - SystemClock.uptimeMillis();
                    if (this.mAttachInfo != null) {
                        this.mAttachInfo.mHandler.postAtTime(what, who, when);
                    }
                    else {
                        view.ViewRootImpl.getRunQueue().postDelayed(what, delay);
                    }
                }
            }
            unscheduleDrawable(who, what) {
                if (this.verifyDrawable(who) && what != null) {
                    if (this.mAttachInfo != null) {
                        this.mAttachInfo.mHandler.removeCallbacks(what, who);
                    }
                    else {
                        view.ViewRootImpl.getRunQueue().removeCallbacks(what);
                    }
                }
                else if (what === null) {
                    if (this.mAttachInfo != null && who != null) {
                        this.mAttachInfo.mHandler.removeCallbacksAndMessages(who);
                    }
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
                this.drawableStateChanged();
                let parent = this.mParent;
                if (parent != null) {
                    parent.childDrawableStateChanged(this);
                }
            }
            getDrawableState() {
                return [];
            }
            getAnimation() {
                return null;
            }
            computeHorizontalScrollRange() {
                return this.getWidth();
            }
            computeHorizontalScrollOffset() {
                return this.mScrollX;
            }
            computeHorizontalScrollExtent() {
                return this.getWidth();
            }
            computeVerticalScrollRange() {
                return this.getHeight();
            }
            computeVerticalScrollOffset() {
                return this.mScrollY;
            }
            computeVerticalScrollExtent() {
                return this.getHeight();
            }
            canScrollHorizontally(direction) {
                const offset = this.computeHorizontalScrollOffset();
                const range = this.computeHorizontalScrollRange() - this.computeHorizontalScrollExtent();
                if (range == 0)
                    return false;
                if (direction < 0) {
                    return offset > 0;
                }
                else {
                    return offset < range - 1;
                }
            }
            canScrollVertically(direction) {
                const offset = this.computeVerticalScrollOffset();
                const range = this.computeVerticalScrollRange() - this.computeVerticalScrollExtent();
                if (range == 0)
                    return false;
                if (direction < 0) {
                    return offset > 0;
                }
                else {
                    return offset < range - 1;
                }
            }
            overScrollBy(deltaX, deltaY, scrollX, scrollY, scrollRangeX, scrollRangeY, maxOverScrollX, maxOverScrollY, isTouchEvent) {
                const overScrollMode = this.mOverScrollMode;
                const canScrollHorizontal = this.computeHorizontalScrollRange() > this.computeHorizontalScrollExtent();
                const canScrollVertical = this.computeVerticalScrollRange() > this.computeVerticalScrollExtent();
                const overScrollHorizontal = overScrollMode == View.OVER_SCROLL_ALWAYS ||
                    (overScrollMode == View.OVER_SCROLL_IF_CONTENT_SCROLLS && canScrollHorizontal);
                const overScrollVertical = overScrollMode == View.OVER_SCROLL_ALWAYS ||
                    (overScrollMode == View.OVER_SCROLL_IF_CONTENT_SCROLLS && canScrollVertical);
                if (isTouchEvent) {
                    if ((deltaX < 0 && scrollX <= 0) || (deltaX > 0 && scrollX >= scrollRangeX)) {
                        deltaX /= 2;
                    }
                    if ((deltaY < 0 && scrollY <= 0) || (deltaY > 0 && scrollY >= scrollRangeY)) {
                        deltaY /= 2;
                    }
                }
                let newScrollX = scrollX + deltaX;
                if (!overScrollHorizontal) {
                    maxOverScrollX = 0;
                }
                let newScrollY = scrollY + deltaY;
                if (!overScrollVertical) {
                    maxOverScrollY = 0;
                }
                const left = -maxOverScrollX;
                const right = maxOverScrollX + scrollRangeX;
                const top = -maxOverScrollY;
                const bottom = maxOverScrollY + scrollRangeY;
                let clampedX = false;
                if (newScrollX > right) {
                    newScrollX = right;
                    clampedX = true;
                }
                else if (newScrollX < left) {
                    newScrollX = left;
                    clampedX = true;
                }
                let clampedY = false;
                if (newScrollY > bottom) {
                    newScrollY = bottom;
                    clampedY = true;
                }
                else if (newScrollY < top) {
                    newScrollY = top;
                    clampedY = true;
                }
                this.onOverScrolled(newScrollX, newScrollY, clampedX, clampedY);
                return clampedX || clampedY;
            }
            onOverScrolled(scrollX, scrollY, clampedX, clampedY) {
            }
            getOverScrollMode() {
                return this.mOverScrollMode;
            }
            setOverScrollMode(overScrollMode) {
                if (overScrollMode != View.OVER_SCROLL_ALWAYS &&
                    overScrollMode != View.OVER_SCROLL_IF_CONTENT_SCROLLS &&
                    overScrollMode != View.OVER_SCROLL_NEVER) {
                    throw new Error("Invalid overscroll mode " + overScrollMode);
                }
                this.mOverScrollMode = overScrollMode;
            }
            getVerticalScrollFactor() {
                if (this.mVerticalScrollFactor == 0) {
                    this.mVerticalScrollFactor = Resources.getDisplayMetrics().density * 64;
                }
                return this.mVerticalScrollFactor;
            }
            getHorizontalScrollFactor() {
                return this.getVerticalScrollFactor();
            }
            computeScroll() {
            }
            scrollTo(x, y) {
                if (this.mScrollX != x || this.mScrollY != y) {
                    let oldX = this.mScrollX;
                    let oldY = this.mScrollY;
                    this.mScrollX = x;
                    this.mScrollY = y;
                    this.invalidateParentCaches();
                    this.onScrollChanged(this.mScrollX, this.mScrollY, oldX, oldY);
                    if (!this.awakenScrollBars()) {
                        this.postInvalidateOnAnimation();
                    }
                }
            }
            scrollBy(x, y) {
                this.scrollTo(this.mScrollX + x, this.mScrollY + y);
            }
            awakenScrollBars(startDelay = view.ViewConfiguration.getScrollDefaultDelay(), invalidate = true) {
                if (!this.bindScrollContent.parentNode) {
                    this.bindElement.appendChild(this.bindScrollContent);
                    this.bindElement.style.overflow = "scroll";
                }
                this.bindScrollContent.style.height = this.computeVerticalScrollRange() + "px";
                this.bindScrollContent.style.width = this.computeHorizontalScrollRange() + "px";
                return false;
            }
            getVerticalFadingEdgeLength() {
                return 0;
            }
            setFadingEdgeLength(length) {
            }
            getHorizontalFadingEdgeLength() {
                return 0;
            }
            getVerticalScrollbarWidth() {
                return 0;
            }
            getHorizontalScrollbarHeight() {
                return 0;
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
                this.removeUnsetPressCallback();
                this.removeLongPressCallback();
                this.removePerformClickCallback();
            }
            cleanupDraw() {
                if (this.mAttachInfo != null) {
                }
            }
            debug(depth = 0) {
                let originProto = Object.getPrototypeOf(this);
                console.dir(Object.assign(Object.create(originProto), this));
            }
            toString() {
                return this.tagName();
            }
            getRootView() {
                if (this.mAttachInfo != null) {
                    let v = this.mAttachInfo.mRootView;
                    if (v != null) {
                        return v;
                    }
                }
                let parent = this;
                while (parent.mParent != null && parent.mParent instanceof View) {
                    parent = parent.mParent;
                }
                return parent;
            }
            findViewById(id) {
                let bindEle = this.bindElement.querySelector('#' + id);
                return bindEle ? bindEle['bindView'] : null;
            }
            initBindElement() {
                this.bindElement = document.createElement(this.tagName());
                this.bindElement['bindView'] = this;
                this.bindScrollContent = document.createElement('div');
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
                rootView.onFinishInflate();
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
        View.PFLAG2_VIEW_QUICK_REJECTED = 0x10000000;
        View.PFLAG3_VIEW_IS_ANIMATING_TRANSFORM = 0x1;
        View.PFLAG3_VIEW_IS_ANIMATING_ALPHA = 0x2;
        View.PFLAG3_IS_LAID_OUT = 0x4;
        View.PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT = 0x8;
        View.PFLAG3_CALLED_SUPER = 0x10;
        View.NOT_FOCUSABLE = 0x00000000;
        View.FOCUSABLE = 0x00000001;
        View.FOCUSABLE_MASK = 0x00000001;
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
        View.FOCUSABLES_ALL = 0x00000000;
        View.FOCUSABLES_TOUCH_MODE = 0x00000001;
        View.FOCUS_BACKWARD = 0x00000001;
        View.FOCUS_FORWARD = 0x00000002;
        View.FOCUS_LEFT = 0x00000011;
        View.FOCUS_UP = 0x00000021;
        View.FOCUS_RIGHT = 0x00000042;
        View.FOCUS_DOWN = 0x00000082;
        View.CLICKABLE = 0x00004000;
        View.DRAWING_CACHE_ENABLED = 0x00008000;
        View.WILL_NOT_CACHE_DRAWING = 0x000020000;
        View.FOCUSABLE_IN_TOUCH_MODE = 0x00040000;
        View.LONG_CLICKABLE = 0x00200000;
        View.DUPLICATE_PARENT_STATE = 0x00400000;
        View.LAYER_TYPE_NONE = 0;
        View.LAYER_TYPE_SOFTWARE = 1;
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
                    this.mViewVisibilityChanged = false;
                    this.mInvalidateChildLocation = new Array(2);
                    this.mIgnoreDirtyState = false;
                    this.mSetIgnoreDirtyState = false;
                    this.mViewRootImpl = mViewRootImpl;
                    this.mHandler = mHandler;
                }
            }
            View.AttachInfo = AttachInfo;
            class ListenerInfo {
            }
            View.ListenerInfo = ListenerInfo;
        })(View = view.View || (view.View = {}));
        (function (View) {
            var AttachInfo;
            (function (AttachInfo) {
                class InvalidateInfo {
                    constructor() {
                        this.left = 0;
                        this.top = 0;
                        this.right = 0;
                        this.bottom = 0;
                    }
                    static obtain() {
                        let instance = InvalidateInfo.sPool.acquire();
                        return (instance != null) ? instance : new InvalidateInfo();
                    }
                    recycle() {
                        this.target = null;
                        InvalidateInfo.sPool.release(this);
                    }
                }
                InvalidateInfo.POOL_LIMIT = 10;
                InvalidateInfo.sPool = new Pools.SynchronizedPool(InvalidateInfo.POOL_LIMIT);
                AttachInfo.InvalidateInfo = InvalidateInfo;
            })(AttachInfo = View.AttachInfo || (View.AttachInfo = {}));
        })(View = view.View || (view.View = {}));
        class CheckForLongPress {
            constructor(View_this) {
                this.mOriginalWindowAttachCount = 0;
                this.View_this = View_this;
            }
            run() {
                if (this.View_this.isPressed() && (this.View_this.mParent != null)
                    && this.mOriginalWindowAttachCount == this.View_this.mWindowAttachCount) {
                    if (this.View_this.performLongClick()) {
                        this.View_this.mHasPerformedLongPress = true;
                    }
                }
            }
            rememberWindowAttachCount() {
                this.mOriginalWindowAttachCount = this.View_this.mWindowAttachCount;
            }
        }
        class CheckForTap {
            constructor(View_this) {
                this.View_this = View_this;
            }
            run() {
                this.View_this.mPrivateFlags &= ~View.PFLAG_PREPRESSED;
                this.View_this.setPressed(true);
                this.View_this.checkForLongClick(view.ViewConfiguration.getTapTimeout());
            }
        }
        class PerformClick {
            constructor(View_this) {
                this.View_this = View_this;
            }
            run() {
                this.View_this.performClick();
            }
        }
        class UnsetPressedState {
            constructor(View_this) {
                this.View_this = View_this;
            }
            run() {
                this.View_this.setPressed(false);
            }
        }
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
/**
 * Created by linfaxin on 15/10/13.
 */
///<reference path="../graphics/Rect.ts"/>
///<reference path="../graphics/Canvas.ts"/>
///<reference path="../graphics/Canvas.ts"/>
var android;
(function (android) {
    var view;
    (function (view) {
        var Rect = android.graphics.Rect;
        var Canvas = android.graphics.Canvas;
        class Surface {
            constructor(canvasElement) {
                this.mLockedCanvasMap = new WeakMap();
                this.mCanvasElement = canvasElement;
            }
            lockCanvas(dirty) {
                let fullWidth = this.mCanvasElement.width;
                let fullHeight = this.mCanvasElement.height;
                let rect;
                if (dirty.isEmpty()) {
                    rect = new Rect(0, 0, fullWidth, fullHeight);
                }
                else {
                    rect = new Rect(Math.floor(dirty.left - 1), Math.floor(dirty.top - 1), Math.ceil(dirty.right + 1), Math.ceil(dirty.bottom + 1));
                }
                let width = rect.width();
                let height = rect.height();
                let canvas = new Canvas(width, height);
                canvas.translate(-rect.left, -rect.top);
                this.mLockedCanvasMap.set(canvas, rect);
                let mCanvasContent = this.mCanvasElement.getContext('2d');
                mCanvasContent.clearRect(rect.left, rect.top, width, height);
                return canvas;
            }
            unlockCanvasAndPost(canvas) {
                let rect = this.mLockedCanvasMap.get(canvas);
                if (rect) {
                    let mCanvasContent = this.mCanvasElement.getContext('2d');
                    mCanvasContent.drawImage(canvas.canvasElement, rect.left, rect.top);
                }
            }
        }
        view.Surface = Surface;
    })(view = android.view || (android.view = {}));
})(android || (android = {}));
var java;
(function (java) {
    var lang;
    (function (lang) {
        class System {
            static currentTimeMillis() {
                return new Date().getTime();
            }
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
///<reference path="Surface.ts"/>
///<reference path="../util/Log.ts"/>
///<reference path="../util/Log.ts"/>
///<reference path="../os/Handler.ts"/>
///<reference path="../os/Message.ts"/>
///<reference path="../os/SystemClock.ts"/>
///<reference path="../content/res/Resources.ts"/>
///<reference path="../graphics/Point.ts"/>
///<reference path="../graphics/Rect.ts"/>
///<reference path="../graphics/Canvas.ts"/>
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
        var SystemClock = android.os.SystemClock;
        var System = java.lang.System;
        var Log = android.util.Log;
        var Surface = android.view.Surface;
        class ViewRootImpl {
            constructor() {
                this.mViewVisibility = 0;
                this.mWidth = -1;
                this.mHeight = -1;
                this.mDirty = new Rect();
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
                this.mHandler = new ViewRootHandler();
                this.mFpsStartTime = -1;
                this.mFpsPrevTime = -1;
                this.mFpsNumFrames = 0;
                this.mInvalidateOnAnimationRunnable = new InvalidateOnAnimationRunnable(this.mHandler);
                this.mAttachInfo = new View.AttachInfo(this, this.mHandler);
                this.mTraversalRunnable = new TraversalRunnable(this);
            }
            initSurface(canvasElement) {
                this.mSurface = new Surface(canvasElement);
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
                        windowSizeMayChange = windowSizeMayChange || this.measureHierarchy(host, lp, desiredWindowWidth, desiredWindowHeight);
                    }
                    windowSizeMayChange == windowSizeMayChange || this.measureHierarchy(host, lp, desiredWindowWidth, desiredWindowHeight);
                }
                if (this.mFirst || attachInfo.mViewVisibilityChanged) {
                    attachInfo.mViewVisibilityChanged = false;
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
            trackFPS() {
                let nowTime = System.currentTimeMillis();
                if (this.mFpsStartTime < 0) {
                    this.mFpsStartTime = this.mFpsPrevTime = nowTime;
                    this.mFpsNumFrames = 0;
                }
                else {
                    this.mFpsNumFrames++;
                    let frameTime = nowTime - this.mFpsPrevTime;
                    let totalTime = nowTime - this.mFpsStartTime;
                    Log.v(ViewRootImpl.TAG, "Frame time:\t" + frameTime);
                    this.mFpsPrevTime = nowTime;
                    if (totalTime > 1000) {
                        let fps = this.mFpsNumFrames * 1000 / totalTime;
                        Log.v(ViewRootImpl.TAG, "FPS:\t" + fps);
                        this.mFpsStartTime = nowTime;
                        this.mFpsNumFrames = 0;
                    }
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
                if (ViewRootImpl.DEBUG_FPS) {
                    this.trackFPS();
                }
                let attachInfo = this.mAttachInfo;
                if (attachInfo.mViewScrollChanged) {
                    attachInfo.mViewScrollChanged = false;
                    attachInfo.mTreeObserver.dispatchOnScrollChanged();
                }
                if (fullRedrawNeeded) {
                    attachInfo.mIgnoreDirtyState = true;
                    this.mDirty.set(0, 0, this.mWidth, this.mHeight);
                }
                if (ViewRootImpl.DEBUG_ORIENTATION || ViewRootImpl.DEBUG_DRAW) {
                    Log.v(ViewRootImpl.TAG, "Draw " + this.mView + ", width=" + this.mWidth + ", height=" + this.mHeight + ", dirty=" + this.mDirty);
                }
                attachInfo.mTreeObserver.dispatchOnDraw();
                this.drawSoftware();
            }
            drawSoftware() {
                let canvas = this.mSurface.lockCanvas(this.mDirty);
                this.mDirty.setEmpty();
                let attachInfo = this.mAttachInfo;
                attachInfo.mDrawingTime = SystemClock.uptimeMillis();
                this.mView.mPrivateFlags |= View.PFLAG_DRAWN;
                attachInfo.mSetIgnoreDirtyState = false;
                this.mView.draw(canvas);
                if (!attachInfo.mSetIgnoreDirtyState) {
                    attachInfo.mIgnoreDirtyState = false;
                }
                this.mSurface.unlockCanvasAndPost(canvas);
                if (ViewRootImpl.LOCAL_LOGV) {
                    Log.v(ViewRootImpl.TAG, "Surface unlockCanvasAndPost");
                }
            }
            isLayoutRequested() {
                return this.mLayoutRequested;
            }
            dispatchInvalidateDelayed(view, delayMilliseconds) {
                let msg = this.mHandler.obtainMessage(ViewRootHandler.MSG_INVALIDATE, view);
                this.mHandler.sendMessageDelayed(msg, delayMilliseconds);
            }
            dispatchInvalidateRectDelayed(info, delayMilliseconds) {
                let msg = this.mHandler.obtainMessage(ViewRootHandler.MSG_INVALIDATE_RECT, info);
                this.mHandler.sendMessageDelayed(msg, delayMilliseconds);
            }
            dispatchInvalidateOnAnimation(view) {
                this.mInvalidateOnAnimationRunnable.addView(view);
            }
            dispatchInvalidateRectOnAnimation(info) {
                this.mInvalidateOnAnimationRunnable.addViewRect(info);
            }
            cancelInvalidate(view) {
                this.mHandler.removeMessages(ViewRootHandler.MSG_INVALIDATE, view);
                this.mHandler.removeMessages(ViewRootHandler.MSG_INVALIDATE_RECT, view);
                this.mInvalidateOnAnimationRunnable.removeView(view);
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
            invalidate() {
                this.mDirty.set(0, 0, this.mWidth, this.mHeight);
                this.scheduleTraversals();
            }
            invalidateWorld(view) {
                view.invalidate();
                if (view instanceof view_1.ViewGroup) {
                    let parent = view;
                    for (let i = 0; i < parent.getChildCount(); i++) {
                        this.invalidateWorld(parent.getChildAt(i));
                    }
                }
            }
            invalidateChild(child, dirty) {
                this.invalidateChildInParent(null, dirty);
            }
            invalidateChildInParent(location, dirty) {
                if (ViewRootImpl.DEBUG_DRAW)
                    Log.v(ViewRootImpl.TAG, "Invalidate child: " + dirty);
                if (dirty == null) {
                    this.invalidate();
                    return null;
                }
                else if (dirty.isEmpty()) {
                    return null;
                }
                const localDirty = this.mDirty;
                if (!localDirty.isEmpty() && !localDirty.contains(dirty)) {
                    this.mAttachInfo.mSetIgnoreDirtyState = true;
                    this.mAttachInfo.mIgnoreDirtyState = true;
                }
                localDirty.union(dirty.left, dirty.top, dirty.right, dirty.bottom);
                const intersected = localDirty.intersect(0, 0, this.mWidth, this.mHeight);
                if (!intersected) {
                    localDirty.setEmpty();
                }
                if (!this.mWillDrawSoon && (intersected)) {
                    this.scheduleTraversals();
                }
                return null;
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
        ViewRootImpl.LOCAL_LOGV = ViewRootImpl.DBG;
        ViewRootImpl.DEBUG_DRAW = false || ViewRootImpl.LOCAL_LOGV;
        ViewRootImpl.DEBUG_LAYOUT = false || ViewRootImpl.LOCAL_LOGV;
        ViewRootImpl.DEBUG_INPUT_RESIZE = false || ViewRootImpl.LOCAL_LOGV;
        ViewRootImpl.DEBUG_ORIENTATION = false || ViewRootImpl.LOCAL_LOGV;
        ViewRootImpl.DEBUG_CONFIGURATION = false || ViewRootImpl.LOCAL_LOGV;
        ViewRootImpl.DEBUG_FPS = true || ViewRootImpl.LOCAL_LOGV;
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
        class InvalidateOnAnimationRunnable {
            constructor(handler) {
                this.mPosted = false;
                this.mViews = new Set();
                this.mViewRects = new Map();
                this.mHandler = handler;
            }
            addView(view) {
                this.mViews.add(view);
                this.postIfNeededLocked();
            }
            addViewRect(info) {
                this.mViewRects.set(info.target, info);
                this.postIfNeededLocked();
            }
            removeView(view) {
                this.mViews.delete(view);
                this.mViewRects.delete(view);
                if (this.mPosted && this.mViews.size === 0 && this.mViewRects.size === 0) {
                    this.mHandler.removeCallbacks(this);
                    this.mPosted = false;
                }
            }
            run() {
                this.mPosted = false;
                for (let view of this.mViews) {
                    view.invalidate();
                }
                this.mViews.clear();
                for (let info of this.mViewRects.values()) {
                    info.target.invalidate(info.left, info.top, info.right, info.bottom);
                    info.recycle();
                }
                this.mViewRects.clear();
            }
            postIfNeededLocked() {
                if (!this.mPosted) {
                    this.mHandler.post(this);
                    this.mPosted = true;
                }
            }
        }
        class ViewRootHandler extends Handler {
            handleMessage(msg) {
                switch (msg.what) {
                    case ViewRootHandler.MSG_INVALIDATE:
                        msg.obj.invalidate();
                        break;
                    case ViewRootHandler.MSG_INVALIDATE_RECT:
                        const info = msg.obj;
                        info.target.invalidate(info.left, info.top, info.right, info.bottom);
                        info.recycle();
                        break;
                }
            }
        }
        ViewRootHandler.MSG_INVALIDATE = 1;
        ViewRootHandler.MSG_INVALIDATE_RECT = 2;
    })(view = android.view || (android.view = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/5.
 */
///<reference path="ViewRootImpl.ts"/>
///<reference path="View.ts"/>
///<reference path="MotionEvent.ts"/>
///<reference path="ViewParent.ts"/>
///<reference path="../graphics/Canvas.ts"/>
///<reference path="../graphics/Point.ts"/>
///<reference path="../graphics/Matrix.ts"/>
///<reference path="../graphics/Rect.ts"/>
///<reference path="../os/SystemClock.ts"/>
var android;
(function (android) {
    var view;
    (function (view_2) {
        var Rect = android.graphics.Rect;
        var SystemClock = android.os.SystemClock;
        class ViewGroup extends view_2.View {
            constructor() {
                super();
                this.mLastTouchDownTime = 0;
                this.mLastTouchDownIndex = -1;
                this.mLastTouchDownX = 0;
                this.mLastTouchDownY = 0;
                this.mGroupFlags = 0;
                this.mLayoutMode = ViewGroup.LAYOUT_MODE_UNDEFINED;
                this.mChildren = [];
                this.mSuppressLayout = false;
                this.mLayoutCalledWhileSuppressed = false;
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
            onInterceptTouchEvent(ev) {
                return false;
            }
            dispatchTouchEvent(ev) {
                let handled = false;
                if (this.onFilterTouchEventForSecurity(ev)) {
                    let action = ev.getAction();
                    let actionMasked = action & view_2.MotionEvent.ACTION_MASK;
                    if (actionMasked == view_2.MotionEvent.ACTION_DOWN) {
                        this.cancelAndClearTouchTargets(ev);
                        this.resetTouchState();
                    }
                    let intercepted;
                    if (actionMasked == view_2.MotionEvent.ACTION_DOWN
                        || this.mFirstTouchTarget != null) {
                        let disallowIntercept = (this.mGroupFlags & ViewGroup.FLAG_DISALLOW_INTERCEPT) != 0;
                        if (!disallowIntercept) {
                            intercepted = this.onInterceptTouchEvent(ev);
                            ev.setAction(action);
                        }
                        else {
                            intercepted = false;
                        }
                    }
                    else {
                        intercepted = true;
                    }
                    let canceled = ViewGroup.resetCancelNextUpFlag(this)
                        || actionMasked == view_2.MotionEvent.ACTION_CANCEL;
                    let split = (this.mGroupFlags & ViewGroup.FLAG_SPLIT_MOTION_EVENTS) != 0;
                    let newTouchTarget = null;
                    let alreadyDispatchedToNewTouchTarget = false;
                    if (!canceled && !intercepted) {
                        if (actionMasked == view_2.MotionEvent.ACTION_DOWN
                            || (split && actionMasked == view_2.MotionEvent.ACTION_POINTER_DOWN)
                            || actionMasked == view_2.MotionEvent.ACTION_HOVER_MOVE) {
                            let actionIndex = ev.getActionIndex();
                            let idBitsToAssign = split ? 1 << ev.getPointerId(actionIndex)
                                : TouchTarget.ALL_POINTER_IDS;
                            this.removePointersFromTouchTargets(idBitsToAssign);
                            let childrenCount = this.mChildrenCount;
                            if (newTouchTarget == null && childrenCount != 0) {
                                let x = ev.getX(actionIndex);
                                let y = ev.getY(actionIndex);
                                let children = this.mChildren;
                                let customOrder = this.isChildrenDrawingOrderEnabled();
                                for (let i = childrenCount - 1; i >= 0; i--) {
                                    let childIndex = customOrder ? this.getChildDrawingOrder(childrenCount, i) : i;
                                    let child = children[childIndex];
                                    if (!ViewGroup.canViewReceivePointerEvents(child)
                                        || !this.isTransformedTouchPointInView(x, y, child, null)) {
                                        continue;
                                    }
                                    newTouchTarget = this.getTouchTarget(child);
                                    if (newTouchTarget != null) {
                                        newTouchTarget.pointerIdBits |= idBitsToAssign;
                                        break;
                                    }
                                    ViewGroup.resetCancelNextUpFlag(child);
                                    if (this.dispatchTransformedTouchEvent(ev, false, child, idBitsToAssign)) {
                                        this.mLastTouchDownTime = ev.getDownTime();
                                        this.mLastTouchDownIndex = childIndex;
                                        this.mLastTouchDownX = ev.getX();
                                        this.mLastTouchDownY = ev.getY();
                                        newTouchTarget = this.addTouchTarget(child, idBitsToAssign);
                                        alreadyDispatchedToNewTouchTarget = true;
                                        break;
                                    }
                                }
                            }
                            if (newTouchTarget == null && this.mFirstTouchTarget != null) {
                                newTouchTarget = this.mFirstTouchTarget;
                                while (newTouchTarget.next != null) {
                                    newTouchTarget = newTouchTarget.next;
                                }
                                newTouchTarget.pointerIdBits |= idBitsToAssign;
                            }
                        }
                    }
                    if (this.mFirstTouchTarget == null) {
                        handled = this.dispatchTransformedTouchEvent(ev, canceled, null, TouchTarget.ALL_POINTER_IDS);
                    }
                    else {
                        let predecessor = null;
                        let target = this.mFirstTouchTarget;
                        while (target != null) {
                            const next = target.next;
                            if (alreadyDispatchedToNewTouchTarget && target == newTouchTarget) {
                                handled = true;
                            }
                            else {
                                let cancelChild = ViewGroup.resetCancelNextUpFlag(target.child)
                                    || intercepted;
                                if (this.dispatchTransformedTouchEvent(ev, cancelChild, target.child, target.pointerIdBits)) {
                                    handled = true;
                                }
                                if (cancelChild) {
                                    if (predecessor == null) {
                                        this.mFirstTouchTarget = next;
                                    }
                                    else {
                                        predecessor.next = next;
                                    }
                                    target.recycle();
                                    target = next;
                                    continue;
                                }
                            }
                            predecessor = target;
                            target = next;
                        }
                    }
                    if (canceled
                        || actionMasked == view_2.MotionEvent.ACTION_UP
                        || actionMasked == view_2.MotionEvent.ACTION_HOVER_MOVE) {
                        this.resetTouchState();
                    }
                    else if (split && actionMasked == view_2.MotionEvent.ACTION_POINTER_UP) {
                        let actionIndex = ev.getActionIndex();
                        let idBitsToRemove = 1 << ev.getPointerId(actionIndex);
                        this.removePointersFromTouchTargets(idBitsToRemove);
                    }
                }
                return handled;
            }
            resetTouchState() {
                this.clearTouchTargets();
                ViewGroup.resetCancelNextUpFlag(this);
                this.mGroupFlags &= ~ViewGroup.FLAG_DISALLOW_INTERCEPT;
            }
            static resetCancelNextUpFlag(view) {
                if ((view.mPrivateFlags & view_2.View.PFLAG_CANCEL_NEXT_UP_EVENT) != 0) {
                    view.mPrivateFlags &= ~view_2.View.PFLAG_CANCEL_NEXT_UP_EVENT;
                    return true;
                }
                return false;
            }
            clearTouchTargets() {
                let target = this.mFirstTouchTarget;
                if (target != null) {
                    do {
                        let next = target.next;
                        target.recycle();
                        target = next;
                    } while (target != null);
                    this.mFirstTouchTarget = null;
                }
            }
            cancelAndClearTouchTargets(event) {
                if (this.mFirstTouchTarget != null) {
                    let syntheticEvent = false;
                    if (event == null) {
                        let now = SystemClock.uptimeMillis();
                        event = view_2.MotionEvent.obtainWithAction(now, now, view_2.MotionEvent.ACTION_CANCEL, 0, 0);
                        syntheticEvent = true;
                    }
                    for (let target = this.mFirstTouchTarget; target != null; target = target.next) {
                        ViewGroup.resetCancelNextUpFlag(target.child);
                        this.dispatchTransformedTouchEvent(event, true, target.child, target.pointerIdBits);
                    }
                    this.clearTouchTargets();
                    if (syntheticEvent) {
                        event.recycle();
                    }
                }
            }
            getTouchTarget(child) {
                for (let target = this.mFirstTouchTarget; target != null; target = target.next) {
                    if (target.child == child) {
                        return target;
                    }
                }
                return null;
            }
            addTouchTarget(child, pointerIdBits) {
                let target = TouchTarget.obtain(child, pointerIdBits);
                target.next = this.mFirstTouchTarget;
                this.mFirstTouchTarget = target;
                return target;
            }
            removePointersFromTouchTargets(pointerIdBits) {
                let predecessor = null;
                let target = this.mFirstTouchTarget;
                while (target != null) {
                    let next = target.next;
                    if ((target.pointerIdBits & pointerIdBits) != 0) {
                        target.pointerIdBits &= ~pointerIdBits;
                        if (target.pointerIdBits == 0) {
                            if (predecessor == null) {
                                this.mFirstTouchTarget = next;
                            }
                            else {
                                predecessor.next = next;
                            }
                            target.recycle();
                            target = next;
                            continue;
                        }
                    }
                    predecessor = target;
                    target = next;
                }
            }
            cancelTouchTarget(view) {
                let predecessor = null;
                let target = this.mFirstTouchTarget;
                while (target != null) {
                    let next = target.next;
                    if (target.child == view) {
                        if (predecessor == null) {
                            this.mFirstTouchTarget = next;
                        }
                        else {
                            predecessor.next = next;
                        }
                        target.recycle();
                        let now = SystemClock.uptimeMillis();
                        let event = view_2.MotionEvent.obtainWithAction(now, now, view_2.MotionEvent.ACTION_CANCEL, 0, 0);
                        view.dispatchTouchEvent(event);
                        event.recycle();
                        return;
                    }
                    predecessor = target;
                    target = next;
                }
            }
            static canViewReceivePointerEvents(child) {
                return (child.mViewFlags & view_2.View.VISIBILITY_MASK) == view_2.View.VISIBLE;
            }
            isTransformedTouchPointInView(x, y, child, outLocalPoint) {
                let localX = x + this.mScrollX - child.mLeft;
                let localY = y + this.mScrollY - child.mTop;
                let isInView = child.pointInView(localX, localY);
                if (isInView && outLocalPoint != null) {
                    outLocalPoint.set(localX, localY);
                }
                return isInView;
            }
            dispatchTransformedTouchEvent(event, cancel, child, desiredPointerIdBits) {
                let handled;
                const oldAction = event.getAction();
                if (cancel || oldAction == view_2.MotionEvent.ACTION_CANCEL) {
                    event.setAction(view_2.MotionEvent.ACTION_CANCEL);
                    if (child == null) {
                        handled = super.dispatchTouchEvent(event);
                    }
                    else {
                        handled = child.dispatchTouchEvent(event);
                    }
                    event.setAction(oldAction);
                    return handled;
                }
                const oldPointerIdBits = event.getPointerIdBits();
                const newPointerIdBits = oldPointerIdBits & desiredPointerIdBits;
                if (newPointerIdBits == 0) {
                    return false;
                }
                let transformedEvent;
                if (newPointerIdBits == oldPointerIdBits) {
                    if (child == null || child.hasIdentityMatrix()) {
                        if (child == null) {
                            handled = super.dispatchTouchEvent(event);
                        }
                        else {
                            let offsetX = this.mScrollX - child.mLeft;
                            let offsetY = this.mScrollY - child.mTop;
                            event.offsetLocation(offsetX, offsetY);
                            handled = child.dispatchTouchEvent(event);
                            event.offsetLocation(-offsetX, -offsetY);
                        }
                        return handled;
                    }
                    transformedEvent = view_2.MotionEvent.obtain(event);
                }
                else {
                    transformedEvent = event.split(newPointerIdBits);
                }
                if (child == null) {
                    handled = super.dispatchTouchEvent(transformedEvent);
                }
                else {
                    let offsetX = this.mScrollX - child.mLeft;
                    let offsetY = this.mScrollY - child.mTop;
                    transformedEvent.offsetLocation(offsetX, offsetY);
                    handled = child.dispatchTouchEvent(transformedEvent);
                }
                transformedEvent.recycle();
                return handled;
            }
            isChildrenDrawingOrderEnabled() {
                return (this.mGroupFlags & ViewGroup.FLAG_USE_CHILD_DRAWING_ORDER) == ViewGroup.FLAG_USE_CHILD_DRAWING_ORDER;
            }
            setChildrenDrawingOrderEnabled(enabled) {
                this.setBooleanFlag(ViewGroup.FLAG_USE_CHILD_DRAWING_ORDER, enabled);
            }
            getChildDrawingOrder(childCount, i) {
                return i;
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
                this.cancelAndClearTouchTargets(null);
                this.mLayoutCalledWhileSuppressed = false;
                this.mChildren.forEach((child) => child.dispatchDetachedFromWindow());
                super.dispatchDetachedFromWindow();
            }
            dispatchVisibilityChanged(changedView, visibility) {
                super.dispatchVisibilityChanged(changedView, visibility);
                const count = this.mChildrenCount;
                let children = this.mChildren;
                for (let i = 0; i < count; i++) {
                    children[i].dispatchVisibilityChanged(changedView, visibility);
                }
            }
            offsetDescendantRectToMyCoords(descendant, rect) {
                this.offsetRectBetweenParentAndChild(descendant, rect, true, false);
            }
            offsetRectIntoDescendantCoords(descendant, rect) {
                this.offsetRectBetweenParentAndChild(descendant, rect, false, false);
            }
            offsetRectBetweenParentAndChild(descendant, rect, offsetFromChildToParent, clipToBounds) {
                if (descendant == this) {
                    return;
                }
                let theParent = descendant.mParent;
                while ((theParent != null)
                    && (theParent instanceof view_2.View)
                    && (theParent != this)) {
                    if (offsetFromChildToParent) {
                        rect.offset(descendant.mLeft - descendant.mScrollX, descendant.mTop - descendant.mScrollY);
                        if (clipToBounds) {
                            let p = theParent;
                            rect.intersect(0, 0, p.mRight - p.mLeft, p.mBottom - p.mTop);
                        }
                    }
                    else {
                        if (clipToBounds) {
                            let p = theParent;
                            rect.intersect(0, 0, p.mRight - p.mLeft, p.mBottom - p.mTop);
                        }
                        rect.offset(descendant.mScrollX - descendant.mLeft, descendant.mScrollY - descendant.mTop);
                    }
                    descendant = theParent;
                    theParent = descendant.mParent;
                }
                if (theParent == this) {
                    if (offsetFromChildToParent) {
                        rect.offset(descendant.mLeft - descendant.mScrollX, descendant.mTop - descendant.mScrollY);
                    }
                    else {
                        rect.offset(descendant.mScrollX - descendant.mLeft, descendant.mScrollY - descendant.mTop);
                    }
                }
                else {
                    throw new Error("parameter must be a descendant of this view");
                }
            }
            offsetChildrenTopAndBottom(offset) {
                const count = this.mChildrenCount;
                const children = this.mChildren;
                for (let i = 0; i < count; i++) {
                    const v = children[i];
                    v.mTop += offset;
                    v.mBottom += offset;
                }
                this.invalidateViewProperty(false, false);
            }
            suppressLayout(suppress) {
                this.mSuppressLayout = suppress;
                if (!suppress) {
                    if (this.mLayoutCalledWhileSuppressed) {
                        this.requestLayout();
                        this.mLayoutCalledWhileSuppressed = false;
                    }
                }
            }
            isLayoutSuppressed() {
                return this.mSuppressLayout;
            }
            layout(l, t, r, b) {
                if (!this.mSuppressLayout) {
                    super.layout(l, t, r, b);
                }
                else {
                    this.mLayoutCalledWhileSuppressed = true;
                }
            }
            getChildVisibleRect(child, r, offset) {
                const rect = this.mAttachInfo != null ? this.mAttachInfo.mTmpTransformRect : new Rect();
                rect.set(r);
                let dx = child.mLeft - this.mScrollX;
                let dy = child.mTop - this.mScrollY;
                rect.offset(dx, dy);
                if (offset != null) {
                    offset.x += dx;
                    offset.y += dy;
                }
                if (rect.intersect(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop)) {
                    if (this.mParent == null)
                        return true;
                    r.set(rect);
                    return this.mParent.getChildVisibleRect(this, r, offset);
                }
                return false;
            }
            dispatchDraw(canvas) {
                let count = this.mChildrenCount;
                let children = this.mChildren;
                let flags = this.mGroupFlags;
                let saveCount = 0;
                let clipToPadding = (flags & ViewGroup.CLIP_TO_PADDING_MASK) == ViewGroup.CLIP_TO_PADDING_MASK;
                if (clipToPadding) {
                    saveCount = canvas.save();
                    canvas.clipRect(this.mScrollX + this.mPaddingLeft, this.mScrollY + this.mPaddingTop, this.mScrollX + this.mRight - this.mLeft - this.mPaddingRight, this.mScrollY + this.mBottom - this.mTop - this.mPaddingBottom);
                }
                this.mPrivateFlags &= ~ViewGroup.PFLAG_DRAW_ANIMATION;
                this.mGroupFlags &= ~ViewGroup.FLAG_INVALIDATE_REQUIRED;
                let more = false;
                let drawingTime = this.getDrawingTime();
                let customOrder = this.isChildrenDrawingOrderEnabled();
                for (let i = 0; i < count; i++) {
                    let child = children[customOrder ? this.getChildDrawingOrder(count, i) : i];
                    if ((child.mViewFlags & view_2.View.VISIBILITY_MASK) == view_2.View.VISIBLE) {
                        more = more || this.drawChild(canvas, child, drawingTime);
                    }
                }
                if (clipToPadding) {
                    canvas.restoreToCount(saveCount);
                }
                flags = this.mGroupFlags;
                if ((flags & ViewGroup.FLAG_INVALIDATE_REQUIRED) == ViewGroup.FLAG_INVALIDATE_REQUIRED) {
                    this.invalidate(true);
                }
            }
            drawChild(canvas, child, drawingTime) {
                return child.drawFromParent(canvas, this, drawingTime);
            }
            getClipChildren() {
                return ((this.mGroupFlags & ViewGroup.FLAG_CLIP_CHILDREN) != 0);
            }
            setClipChildren(clipChildren) {
                let previousValue = (this.mGroupFlags & ViewGroup.FLAG_CLIP_CHILDREN) == ViewGroup.FLAG_CLIP_CHILDREN;
                if (clipChildren != previousValue) {
                    this.setBooleanFlag(ViewGroup.FLAG_CLIP_CHILDREN, clipChildren);
                }
            }
            setClipToPadding(clipToPadding) {
                this.setBooleanFlag(ViewGroup.FLAG_CLIP_TO_PADDING, clipToPadding);
            }
            invalidateChild(child, dirty) {
                let parent = this;
                const attachInfo = this.mAttachInfo;
                if (attachInfo != null) {
                    const drawAnimation = (child.mPrivateFlags & view_2.View.PFLAG_DRAW_ANIMATION)
                        == view_2.View.PFLAG_DRAW_ANIMATION;
                    let childMatrix = child.getMatrix();
                    const isOpaque = child.isOpaque() && !drawAnimation &&
                        child.getAnimation() == null && childMatrix.isIdentity();
                    let opaqueFlag = isOpaque ? view_2.View.PFLAG_DIRTY_OPAQUE : view_2.View.PFLAG_DIRTY;
                    if (child.mLayerType != view_2.View.LAYER_TYPE_NONE) {
                        this.mPrivateFlags |= view_2.View.PFLAG_INVALIDATED;
                        this.mPrivateFlags &= ~view_2.View.PFLAG_DRAWING_CACHE_VALID;
                    }
                    const location = attachInfo.mInvalidateChildLocation;
                    location[0] = child.mLeft;
                    location[1] = child.mTop;
                    do {
                        let view = null;
                        if (parent instanceof view_2.View) {
                            view = parent;
                        }
                        if (view != null) {
                            opaqueFlag = view_2.View.PFLAG_DIRTY;
                            if ((view.mPrivateFlags & view_2.View.PFLAG_DIRTY_MASK) != view_2.View.PFLAG_DIRTY) {
                                view.mPrivateFlags = (view.mPrivateFlags & ~view_2.View.PFLAG_DIRTY_MASK) | opaqueFlag;
                            }
                        }
                        parent = parent.invalidateChildInParent(location, dirty);
                        if (view != null) {
                            let m = view.getMatrix();
                            if (!m.isIdentity()) {
                                let boundingRect = attachInfo.mTmpTransformRect;
                                boundingRect.set(dirty);
                                m.mapRect(boundingRect);
                                dirty.set(boundingRect);
                            }
                        }
                    } while (parent != null);
                }
            }
            invalidateChildInParent(location, dirty) {
                if ((this.mPrivateFlags & view_2.View.PFLAG_DRAWN) == view_2.View.PFLAG_DRAWN ||
                    (this.mPrivateFlags & view_2.View.PFLAG_DRAWING_CACHE_VALID) == view_2.View.PFLAG_DRAWING_CACHE_VALID) {
                    if ((this.mGroupFlags & (ViewGroup.FLAG_OPTIMIZE_INVALIDATE | ViewGroup.FLAG_ANIMATION_DONE)) !=
                        ViewGroup.FLAG_OPTIMIZE_INVALIDATE) {
                        dirty.offset(location[0] - this.mScrollX, location[1] - this.mScrollY);
                        if ((this.mGroupFlags & ViewGroup.FLAG_CLIP_CHILDREN) == 0) {
                            dirty.union(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop);
                        }
                        const left = this.mLeft;
                        const top = this.mTop;
                        if ((this.mGroupFlags & ViewGroup.FLAG_CLIP_CHILDREN) == ViewGroup.FLAG_CLIP_CHILDREN) {
                            if (!dirty.intersect(0, 0, this.mRight - left, this.mBottom - top)) {
                                dirty.setEmpty();
                            }
                        }
                        this.mPrivateFlags &= ~view_2.View.PFLAG_DRAWING_CACHE_VALID;
                        location[0] = left;
                        location[1] = top;
                        if (this.mLayerType != view_2.View.LAYER_TYPE_NONE) {
                            this.mPrivateFlags |= view_2.View.PFLAG_INVALIDATED;
                        }
                        return this.mParent;
                    }
                    else {
                        this.mPrivateFlags &= ~view_2.View.PFLAG_DRAWN & ~view_2.View.PFLAG_DRAWING_CACHE_VALID;
                        location[0] = this.mLeft;
                        location[1] = this.mTop;
                        if ((this.mGroupFlags & ViewGroup.FLAG_CLIP_CHILDREN) == ViewGroup.FLAG_CLIP_CHILDREN) {
                            dirty.set(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop);
                        }
                        else {
                            dirty.union(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop);
                        }
                        if (this.mLayerType != view_2.View.LAYER_TYPE_NONE) {
                            this.mPrivateFlags |= view_2.View.PFLAG_INVALIDATED;
                        }
                        return this.mParent;
                    }
                }
                return null;
            }
            invalidateChildFast(child, dirty) {
                let parent = this;
                const attachInfo = this.mAttachInfo;
                if (attachInfo != null) {
                    let left = child.mLeft;
                    let top = child.mTop;
                    if (!child.getMatrix().isIdentity()) {
                        child.transformRect(dirty);
                    }
                    do {
                        if (parent instanceof ViewGroup) {
                            let parentVG = parent;
                            if (parentVG.mLayerType != view_2.View.LAYER_TYPE_NONE) {
                                parentVG.invalidate();
                                parent = null;
                            }
                            else {
                                parent = parentVG.invalidateChildInParentFast(left, top, dirty);
                                left = parentVG.mLeft;
                                top = parentVG.mTop;
                            }
                        }
                        else {
                            const location = attachInfo.mInvalidateChildLocation;
                            location[0] = left;
                            location[1] = top;
                            parent = parent.invalidateChildInParent(location, dirty);
                        }
                    } while (parent != null);
                }
            }
            invalidateChildInParentFast(left, top, dirty) {
                if ((this.mPrivateFlags & view_2.View.PFLAG_DRAWN) == view_2.View.PFLAG_DRAWN ||
                    (this.mPrivateFlags & view_2.View.PFLAG_DRAWING_CACHE_VALID) == view_2.View.PFLAG_DRAWING_CACHE_VALID) {
                    dirty.offset(left - this.mScrollX, top - this.mScrollY);
                    if ((this.mGroupFlags & ViewGroup.FLAG_CLIP_CHILDREN) == 0) {
                        dirty.union(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop);
                    }
                    if ((this.mGroupFlags & ViewGroup.FLAG_CLIP_CHILDREN) == 0 ||
                        dirty.intersect(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop)) {
                        if (this.mLayerType != view_2.View.LAYER_TYPE_NONE) {
                        }
                        if (!this.getMatrix().isIdentity()) {
                            this.transformRect(dirty);
                        }
                        return this.mParent;
                    }
                }
                return null;
            }
            requestTransparentRegion(child) {
            }
            requestChildFocus(child, focused) {
            }
            recomputeViewAttributes(child) {
            }
            clearChildFocus(child) {
            }
            focusSearch(v, direction) {
                return undefined;
            }
            focusableViewAvailable(v) {
            }
            childDrawableStateChanged(child) {
            }
            requestDisallowInterceptTouchEvent(disallowIntercept) {
                if (disallowIntercept == ((this.mGroupFlags & ViewGroup.FLAG_DISALLOW_INTERCEPT) != 0)) {
                    return;
                }
                if (disallowIntercept) {
                    this.mGroupFlags |= ViewGroup.FLAG_DISALLOW_INTERCEPT;
                }
                else {
                    this.mGroupFlags &= ~ViewGroup.FLAG_DISALLOW_INTERCEPT;
                }
                if (this.mParent != null) {
                    this.mParent.requestDisallowInterceptTouchEvent(disallowIntercept);
                }
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
        class TouchTarget {
            static obtain(child, pointerIdBits) {
                let target;
                if (TouchTarget.sRecycleBin == null) {
                    target = new TouchTarget();
                }
                else {
                    target = TouchTarget.sRecycleBin;
                    TouchTarget.sRecycleBin = target.next;
                    TouchTarget.sRecycledCount--;
                    target.next = null;
                }
                target.child = child;
                target.pointerIdBits = pointerIdBits;
                return target;
            }
            recycle() {
                if (TouchTarget.sRecycledCount < TouchTarget.MAX_RECYCLED) {
                    this.next = TouchTarget.sRecycleBin;
                    TouchTarget.sRecycleBin = this;
                    TouchTarget.sRecycledCount += 1;
                }
                else {
                    this.next = null;
                }
                this.child = null;
            }
        }
        TouchTarget.MAX_RECYCLED = 32;
        TouchTarget.sRecycledCount = 0;
        TouchTarget.ALL_POINTER_IDS = -1;
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
 * Created by linfaxin on 15/10/17.
 */
///<reference path="../view/ViewConfiguration.ts"/>
///<reference path="../view/animation/Interpolator.ts"/>
///<reference path="../content/res/Resources.ts"/>
///<reference path="../os/SystemClock.ts"/>
///<reference path="../util/Log.ts"/>
var android;
(function (android) {
    var widget;
    (function (widget) {
        var ViewConfiguration = android.view.ViewConfiguration;
        var Resources = android.content.res.Resources;
        var SystemClock = android.os.SystemClock;
        var Log = android.util.Log;
        class OverScroller {
            constructor(interpolator, flywheel = true) {
                this.mMode = 0;
                this.mFlywheel = true;
                this.mInterpolator = interpolator;
                this.mFlywheel = flywheel;
                this.mScrollerX = new SplineOverScroller();
                this.mScrollerY = new SplineOverScroller();
            }
            setFriction(friction) {
                this.mScrollerX.setFriction(friction);
                this.mScrollerY.setFriction(friction);
            }
            isFinished() {
                return this.mScrollerX.mFinished && this.mScrollerY.mFinished;
            }
            forceFinished(finished) {
                this.mScrollerX.mFinished = this.mScrollerY.mFinished = finished;
            }
            getCurrX() {
                return this.mScrollerX.mCurrentPosition;
            }
            getCurrY() {
                return this.mScrollerY.mCurrentPosition;
            }
            getCurrVelocity() {
                let squaredNorm = this.mScrollerX.mCurrVelocity * this.mScrollerX.mCurrVelocity;
                squaredNorm += this.mScrollerY.mCurrVelocity * this.mScrollerY.mCurrVelocity;
                return Math.sqrt(squaredNorm);
            }
            getStartX() {
                return this.mScrollerX.mStart;
            }
            getStartY() {
                return this.mScrollerY.mStart;
            }
            getFinalX() {
                return this.mScrollerX.mFinal;
            }
            getFinalY() {
                return this.mScrollerY.mFinal;
            }
            computeScrollOffset() {
                if (this.isFinished()) {
                    return false;
                }
                switch (this.mMode) {
                    case OverScroller.SCROLL_MODE:
                        let time = SystemClock.uptimeMillis();
                        const elapsedTime = time - this.mScrollerX.mStartTime;
                        const duration = this.mScrollerX.mDuration;
                        if (elapsedTime < duration) {
                            let q = (elapsedTime) / duration;
                            if (this.mInterpolator == null) {
                                q = Scroller_viscousFluid(q);
                            }
                            else {
                                q = this.mInterpolator.getInterpolation(q);
                            }
                            this.mScrollerX.updateScroll(q);
                            this.mScrollerY.updateScroll(q);
                        }
                        else {
                            this.abortAnimation();
                        }
                        break;
                    case OverScroller.FLING_MODE:
                        if (!this.mScrollerX.mFinished) {
                            if (!this.mScrollerX.update()) {
                                if (!this.mScrollerX.continueWhenFinished()) {
                                    this.mScrollerX.finish();
                                }
                            }
                        }
                        if (!this.mScrollerY.mFinished) {
                            if (!this.mScrollerY.update()) {
                                if (!this.mScrollerY.continueWhenFinished()) {
                                    this.mScrollerY.finish();
                                }
                            }
                        }
                        break;
                }
                return true;
            }
            startScroll(startX, startY, dx, dy, duration = OverScroller.DEFAULT_DURATION) {
                this.mMode = OverScroller.SCROLL_MODE;
                this.mScrollerX.startScroll(startX, dx, duration);
                this.mScrollerY.startScroll(startY, dy, duration);
            }
            springBack(startX, startY, minX, maxX, minY, maxY) {
                this.mMode = OverScroller.FLING_MODE;
                const spingbackX = this.mScrollerX.springback(startX, minX, maxX);
                const spingbackY = this.mScrollerY.springback(startY, minY, maxY);
                return spingbackX || spingbackY;
            }
            fling(startX, startY, velocityX, velocityY, minX, maxX, minY, maxY, overX = 0, overY = 0) {
                if (this.mFlywheel && !this.isFinished()) {
                    let oldVelocityX = this.mScrollerX.mCurrVelocity;
                    let oldVelocityY = this.mScrollerY.mCurrVelocity;
                    if (Math_signum(velocityX) == Math_signum(oldVelocityX) &&
                        Math_signum(velocityY) == Math_signum(oldVelocityY)) {
                        velocityX += oldVelocityX;
                        velocityY += oldVelocityY;
                    }
                }
                this.mMode = OverScroller.FLING_MODE;
                this.mScrollerX.fling(startX, velocityX, minX, maxX, overX);
                this.mScrollerY.fling(startY, velocityY, minY, maxY, overY);
            }
            notifyHorizontalEdgeReached(startX, finalX, overX) {
                this.mScrollerX.notifyEdgeReached(startX, finalX, overX);
            }
            notifyVerticalEdgeReached(startY, finalY, overY) {
                this.mScrollerY.notifyEdgeReached(startY, finalY, overY);
            }
            isOverScrolled() {
                return ((!this.mScrollerX.mFinished &&
                    this.mScrollerX.mState != SplineOverScroller.SPLINE) ||
                    (!this.mScrollerY.mFinished &&
                        this.mScrollerY.mState != SplineOverScroller.SPLINE));
            }
            abortAnimation() {
                this.mScrollerX.finish();
                this.mScrollerY.finish();
            }
            timePassed() {
                const time = SystemClock.uptimeMillis();
                const startTime = Math.min(this.mScrollerX.mStartTime, this.mScrollerY.mStartTime);
                return (time - startTime);
            }
            isScrollingInDirection(xvel, yvel) {
                const dx = this.mScrollerX.mFinal - this.mScrollerX.mStart;
                const dy = this.mScrollerY.mFinal - this.mScrollerY.mStart;
                return !this.isFinished() && Math_signum(xvel) == Math_signum(dx) &&
                    Math_signum(yvel) == Math_signum(dy);
            }
        }
        OverScroller.DEFAULT_DURATION = 250;
        OverScroller.SCROLL_MODE = 0;
        OverScroller.FLING_MODE = 1;
        widget.OverScroller = OverScroller;
        class SplineOverScroller {
            constructor() {
                this.mStart = 0;
                this.mCurrentPosition = 0;
                this.mFinal = 0;
                this.mVelocity = 0;
                this.mCurrVelocity = 0;
                this.mDeceleration = 0;
                this.mStartTime = 0;
                this.mDuration = 0;
                this.mSplineDuration = 0;
                this.mSplineDistance = 0;
                this.mFinished = false;
                this.mOver = 0;
                this.mFlingFriction = ViewConfiguration.getScrollFriction();
                this.mState = SplineOverScroller.SPLINE;
                this.mPhysicalCoeff = 0;
                this.mFinished = true;
                let ppi = Resources.getDisplayMetrics().density * 160;
                this.mPhysicalCoeff = 9.80665
                    * 39.37
                    * ppi
                    * 0.84;
            }
            setFriction(friction) {
                this.mFlingFriction = friction;
            }
            updateScroll(q) {
                this.mCurrentPosition = this.mStart + Math.round(q * (this.mFinal - this.mStart));
            }
            static getDeceleration(velocity) {
                return velocity > 0 ? -SplineOverScroller.GRAVITY : SplineOverScroller.GRAVITY;
            }
            adjustDuration(start, oldFinal, newFinal) {
                let oldDistance = oldFinal - start;
                let newDistance = newFinal - start;
                let x = Math.abs(newDistance / oldDistance);
                let index = Number.parseInt((SplineOverScroller.NB_SAMPLES * x));
                if (index < SplineOverScroller.NB_SAMPLES) {
                    let x_inf = index / SplineOverScroller.NB_SAMPLES;
                    let x_sup = (index + 1) / SplineOverScroller.NB_SAMPLES;
                    let t_inf = SplineOverScroller.SPLINE_TIME[index];
                    let t_sup = SplineOverScroller.SPLINE_TIME[index + 1];
                    let timeCoef = t_inf + (x - x_inf) / (x_sup - x_inf) * (t_sup - t_inf);
                    this.mDuration *= timeCoef;
                }
            }
            startScroll(start, distance, duration) {
                this.mFinished = false;
                this.mStart = start;
                this.mFinal = start + distance;
                this.mStartTime = SystemClock.uptimeMillis();
                this.mDuration = duration;
                this.mDeceleration = 0;
                this.mVelocity = 0;
            }
            finish() {
                this.mCurrentPosition = this.mFinal;
                this.mFinished = true;
            }
            setFinalPosition(position) {
                this.mFinal = position;
                this.mFinished = false;
            }
            extendDuration(extend) {
                let time = SystemClock.uptimeMillis();
                let elapsedTime = (time - this.mStartTime);
                this.mDuration = elapsedTime + extend;
                this.mFinished = false;
            }
            springback(start, min, max) {
                this.mFinished = true;
                this.mStart = this.mFinal = start;
                this.mVelocity = 0;
                this.mStartTime = SystemClock.uptimeMillis();
                this.mDuration = 0;
                if (start < min) {
                    this.startSpringback(start, min, 0);
                }
                else if (start > max) {
                    this.startSpringback(start, max, 0);
                }
                return !this.mFinished;
            }
            startSpringback(start, end, velocity) {
                this.mFinished = false;
                this.mState = SplineOverScroller.CUBIC;
                this.mStart = start;
                this.mFinal = end;
                const delta = start - end;
                this.mDeceleration = SplineOverScroller.getDeceleration(delta);
                this.mVelocity = -delta;
                this.mOver = Math.abs(delta);
                this.mDuration = (1000.0 * Math.sqrt(-2.0 * delta / this.mDeceleration));
            }
            fling(start, velocity, min, max, over) {
                this.mOver = over;
                this.mFinished = false;
                this.mCurrVelocity = this.mVelocity = velocity;
                this.mDuration = this.mSplineDuration = 0;
                this.mStartTime = SystemClock.uptimeMillis();
                this.mCurrentPosition = this.mStart = start;
                if (start > max || start < min) {
                    this.startAfterEdge(start, min, max, velocity);
                    return;
                }
                this.mState = SplineOverScroller.SPLINE;
                let totalDistance = 0.0;
                if (velocity != 0) {
                    this.mDuration = this.mSplineDuration = this.getSplineFlingDuration(velocity);
                    totalDistance = this.getSplineFlingDistance(velocity);
                }
                this.mSplineDistance = (totalDistance * Math_signum(velocity));
                this.mFinal = start + this.mSplineDistance;
                if (this.mFinal < min) {
                    this.adjustDuration(this.mStart, this.mFinal, min);
                    this.mFinal = min;
                }
                if (this.mFinal > max) {
                    this.adjustDuration(this.mStart, this.mFinal, max);
                    this.mFinal = max;
                }
            }
            getSplineDeceleration(velocity) {
                return Math.log(SplineOverScroller.INFLEXION * Math.abs(velocity) / (this.mFlingFriction * this.mPhysicalCoeff));
            }
            getSplineFlingDistance(velocity) {
                let l = this.getSplineDeceleration(velocity);
                let decelMinusOne = SplineOverScroller.DECELERATION_RATE - 1.0;
                return this.mFlingFriction * this.mPhysicalCoeff * Math.exp(SplineOverScroller.DECELERATION_RATE / decelMinusOne * l);
            }
            getSplineFlingDuration(velocity) {
                let l = this.getSplineDeceleration(velocity);
                let decelMinusOne = SplineOverScroller.DECELERATION_RATE - 1.0;
                return (1000.0 * Math.exp(l / decelMinusOne));
            }
            fitOnBounceCurve(start, end, velocity) {
                let durationToApex = -velocity / this.mDeceleration;
                let distanceToApex = velocity * velocity / 2.0 / Math.abs(this.mDeceleration);
                let distanceToEdge = Math.abs(end - start);
                let totalDuration = Math.sqrt(2.0 * (distanceToApex + distanceToEdge) / Math.abs(this.mDeceleration));
                this.mStartTime -= (1000 * (totalDuration - durationToApex));
                this.mStart = end;
                this.mVelocity = (-this.mDeceleration * totalDuration);
            }
            startBounceAfterEdge(start, end, velocity) {
                this.mDeceleration = SplineOverScroller.getDeceleration(velocity == 0 ? start - end : velocity);
                this.fitOnBounceCurve(start, end, velocity);
                this.onEdgeReached();
            }
            startAfterEdge(start, min, max, velocity) {
                if (start > min && start < max) {
                    Log.e("OverScroller", "startAfterEdge called from a valid position");
                    this.mFinished = true;
                    return;
                }
                const positive = start > max;
                const edge = positive ? max : min;
                const overDistance = start - edge;
                let keepIncreasing = overDistance * velocity >= 0;
                if (keepIncreasing) {
                    this.startBounceAfterEdge(start, edge, velocity);
                }
                else {
                    const totalDistance = this.getSplineFlingDistance(velocity);
                    if (totalDistance > Math.abs(overDistance)) {
                        this.fling(start, velocity, positive ? min : start, positive ? start : max, this.mOver);
                    }
                    else {
                        this.startSpringback(start, edge, velocity);
                    }
                }
            }
            notifyEdgeReached(start, end, over) {
                if (this.mState == SplineOverScroller.SPLINE) {
                    this.mOver = over;
                    this.mStartTime = SystemClock.uptimeMillis();
                    this.startAfterEdge(start, end, end, this.mCurrVelocity);
                }
            }
            onEdgeReached() {
                let distance = this.mVelocity * this.mVelocity / (2 * Math.abs(this.mDeceleration));
                const sign = Math_signum(this.mVelocity);
                if (distance > this.mOver) {
                    this.mDeceleration = -sign * this.mVelocity * this.mVelocity / (2.0 * this.mOver);
                    distance = this.mOver;
                }
                this.mOver = distance;
                this.mState = SplineOverScroller.BALLISTIC;
                this.mFinal = this.mStart + (this.mVelocity > 0 ? distance : -distance);
                this.mDuration = -(1000 * this.mVelocity / this.mDeceleration);
            }
            continueWhenFinished() {
                switch (this.mState) {
                    case SplineOverScroller.SPLINE:
                        if (this.mDuration < this.mSplineDuration) {
                            this.mStart = this.mFinal;
                            this.mVelocity = this.mCurrVelocity;
                            this.mDeceleration = SplineOverScroller.getDeceleration(this.mVelocity);
                            this.mStartTime += this.mDuration;
                            this.onEdgeReached();
                        }
                        else {
                            return false;
                        }
                        break;
                    case SplineOverScroller.BALLISTIC:
                        this.mStartTime += this.mDuration;
                        this.startSpringback(this.mFinal, this.mStart, 0);
                        break;
                    case SplineOverScroller.CUBIC:
                        return false;
                }
                this.update();
                return true;
            }
            update() {
                const time = SystemClock.uptimeMillis();
                const currentTime = time - this.mStartTime;
                if (currentTime > this.mDuration) {
                    return false;
                }
                let distance = 0;
                switch (this.mState) {
                    case SplineOverScroller.SPLINE: {
                        const t = currentTime / this.mSplineDuration;
                        const index = Number.parseInt((SplineOverScroller.NB_SAMPLES * t));
                        let distanceCoef = 1;
                        let velocityCoef = 0;
                        if (index < SplineOverScroller.NB_SAMPLES) {
                            const t_inf = index / SplineOverScroller.NB_SAMPLES;
                            const t_sup = (index + 1) / SplineOverScroller.NB_SAMPLES;
                            const d_inf = SplineOverScroller.SPLINE_POSITION[index];
                            const d_sup = SplineOverScroller.SPLINE_POSITION[index + 1];
                            velocityCoef = (d_sup - d_inf) / (t_sup - t_inf);
                            distanceCoef = d_inf + (t - t_inf) * velocityCoef;
                        }
                        distance = distanceCoef * this.mSplineDistance;
                        this.mCurrVelocity = velocityCoef * this.mSplineDistance / this.mSplineDuration * 1000;
                        break;
                    }
                    case SplineOverScroller.BALLISTIC: {
                        const t = currentTime / 1000;
                        this.mCurrVelocity = this.mVelocity + this.mDeceleration * t;
                        distance = this.mVelocity * t + this.mDeceleration * t * t / 2;
                        break;
                    }
                    case SplineOverScroller.CUBIC: {
                        const t = (currentTime) / this.mDuration;
                        const t2 = t * t;
                        const sign = Math_signum(this.mVelocity);
                        distance = sign * this.mOver * (3 * t2 - 2 * t * t2);
                        this.mCurrVelocity = sign * this.mOver * 6 * (-t + t2);
                        break;
                    }
                }
                this.mCurrentPosition = this.mStart + Math.round(distance);
                return true;
            }
        }
        SplineOverScroller.DECELERATION_RATE = (Math.log(0.78) / Math.log(0.9));
        SplineOverScroller.INFLEXION = 0.35;
        SplineOverScroller.START_TENSION = 0.5;
        SplineOverScroller.END_TENSION = 1.0;
        SplineOverScroller.P1 = SplineOverScroller.START_TENSION * SplineOverScroller.INFLEXION;
        SplineOverScroller.P2 = 1.0 - SplineOverScroller.END_TENSION * (1 - SplineOverScroller.INFLEXION);
        SplineOverScroller.NB_SAMPLES = 100;
        SplineOverScroller.SPLINE_POSITION = new Array(SplineOverScroller.NB_SAMPLES + 1);
        SplineOverScroller.SPLINE_TIME = new Array(SplineOverScroller.NB_SAMPLES + 1);
        SplineOverScroller.SPLINE = 0;
        SplineOverScroller.CUBIC = 1;
        SplineOverScroller.BALLISTIC = 2;
        SplineOverScroller.GRAVITY = 2000;
        SplineOverScroller._staticFunc = function () {
            let x_min = 0.0;
            let y_min = 0.0;
            for (let i = 0; i < SplineOverScroller.NB_SAMPLES; i++) {
                const alpha = i / SplineOverScroller.NB_SAMPLES;
                let x_max = 1.0;
                let x, tx, coef;
                while (true) {
                    x = x_min + (x_max - x_min) / 2.0;
                    coef = 3.0 * x * (1.0 - x);
                    tx = coef * ((1.0 - x) * SplineOverScroller.P1 + x * SplineOverScroller.P2) + x * x * x;
                    if (Math.abs(tx - alpha) < 1E-5)
                        break;
                    if (tx > alpha)
                        x_max = x;
                    else
                        x_min = x;
                }
                SplineOverScroller.SPLINE_POSITION[i] = coef * ((1.0 - x) * SplineOverScroller.START_TENSION + x) + x * x * x;
                let y_max = 1.0;
                let y, dy;
                while (true) {
                    y = y_min + (y_max - y_min) / 2.0;
                    coef = 3.0 * y * (1.0 - y);
                    dy = coef * ((1.0 - y) * SplineOverScroller.START_TENSION + y) + y * y * y;
                    if (Math.abs(dy - alpha) < 1E-5)
                        break;
                    if (dy > alpha)
                        y_max = y;
                    else
                        y_min = y;
                }
                SplineOverScroller.SPLINE_TIME[i] = coef * ((1.0 - y) * SplineOverScroller.P1 + y * SplineOverScroller.P2) + y * y * y;
            }
            SplineOverScroller.SPLINE_POSITION[SplineOverScroller.NB_SAMPLES] = SplineOverScroller.SPLINE_TIME[SplineOverScroller.NB_SAMPLES] = 1.0;
        }();
        function Math_signum(value) {
            if (value === 0 || Number.isNaN(value))
                return value;
            return Math.abs(value) === value ? 1 : -1;
        }
        let sViscousFluidScale = 8;
        let sViscousFluidNormalize = 1;
        function Scroller_viscousFluid(x) {
            x *= sViscousFluidScale;
            if (x < 1) {
                x -= (1 - Math.exp(-x));
            }
            else {
                let start = 0.36787944117;
                x = 1 - Math.exp(1 - x);
                x = start + x * (1 - start);
            }
            x *= sViscousFluidNormalize;
            return x;
        }
        sViscousFluidNormalize = 1 / Scroller_viscousFluid(1);
    })(widget = android.widget || (android.widget = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/17.
 */
///<reference path="../util/Log.ts"/>
///<reference path="../util/Pools.ts"/>
///<reference path="MotionEvent.ts"/>
var android;
(function (android) {
    var view;
    (function (view) {
        var Log = android.util.Log;
        var Pools = android.util.Pools;
        class VelocityTracker {
            constructor() {
                this.mLastTouchIndex = 0;
                this.mGeneration = 0;
                this.clear();
            }
            static obtain() {
                let instance = VelocityTracker.sPool.acquire();
                return (instance != null) ? instance : new VelocityTracker();
            }
            recycle() {
                this.clear();
                VelocityTracker.sPool.release(this);
            }
            setNextPoolable(element) {
                this.mNext = element;
            }
            getNextPoolable() {
                return this.mNext;
            }
            clear() {
                VelocityTracker.releasePointerList(this.mPointerListHead);
                this.mPointerListHead = null;
                this.mLastTouchIndex = 0;
            }
            addMovement(ev) {
                let historySize = ev.getHistorySize();
                const pointerCount = ev.getPointerCount();
                const lastTouchIndex = this.mLastTouchIndex;
                const nextTouchIndex = (lastTouchIndex + 1) % VelocityTracker.NUM_PAST;
                const finalTouchIndex = (nextTouchIndex + historySize) % VelocityTracker.NUM_PAST;
                const generation = this.mGeneration++;
                this.mLastTouchIndex = finalTouchIndex;
                let previousPointer = null;
                for (let i = 0; i < pointerCount; i++) {
                    const pointerId = ev.getPointerId(i);
                    let nextPointer;
                    if (previousPointer == null || pointerId < previousPointer.id) {
                        previousPointer = null;
                        nextPointer = this.mPointerListHead;
                    }
                    else {
                        nextPointer = previousPointer.next;
                    }
                    let pointer;
                    for (;;) {
                        if (nextPointer != null) {
                            const nextPointerId = nextPointer.id;
                            if (nextPointerId == pointerId) {
                                pointer = nextPointer;
                                break;
                            }
                            if (nextPointerId < pointerId) {
                                nextPointer = nextPointer.next;
                                continue;
                            }
                        }
                        pointer = VelocityTracker.obtainPointer();
                        pointer.id = pointerId;
                        pointer.pastTime[lastTouchIndex] = Number.MIN_VALUE;
                        pointer.next = nextPointer;
                        if (previousPointer == null) {
                            this.mPointerListHead = pointer;
                        }
                        else {
                            previousPointer.next = pointer;
                        }
                        break;
                    }
                    pointer.generation = generation;
                    previousPointer = pointer;
                    const pastX = pointer.pastX;
                    const pastY = pointer.pastY;
                    const pastTime = pointer.pastTime;
                    historySize = ev.getHistorySize(pointerId);
                    for (let j = 0; j < historySize; j++) {
                        const touchIndex = (nextTouchIndex + j) % VelocityTracker.NUM_PAST;
                        pastX[touchIndex] = ev.getHistoricalX(i, j);
                        pastY[touchIndex] = ev.getHistoricalY(i, j);
                        pastTime[touchIndex] = ev.getHistoricalEventTime(i, j);
                    }
                    pastX[finalTouchIndex] = ev.getX(i);
                    pastY[finalTouchIndex] = ev.getY(i);
                    pastTime[finalTouchIndex] = ev.getEventTime();
                }
                previousPointer = null;
                for (let pointer = this.mPointerListHead; pointer != null;) {
                    const nextPointer = pointer.next;
                    if (pointer.generation != generation) {
                        if (previousPointer == null) {
                            this.mPointerListHead = nextPointer;
                        }
                        else {
                            previousPointer.next = nextPointer;
                        }
                        VelocityTracker.releasePointer(pointer);
                    }
                    else {
                        previousPointer = pointer;
                    }
                    pointer = nextPointer;
                }
            }
            computeCurrentVelocity(units, maxVelocity = Number.MAX_SAFE_INTEGER) {
                const lastTouchIndex = this.mLastTouchIndex;
                for (let pointer = this.mPointerListHead; pointer != null; pointer = pointer.next) {
                    const pastTime = pointer.pastTime;
                    let oldestTouchIndex = lastTouchIndex;
                    let numTouches = 1;
                    const minTime = pastTime[lastTouchIndex] - VelocityTracker.MAX_AGE_MILLISECONDS;
                    while (numTouches < VelocityTracker.NUM_PAST) {
                        const nextOldestTouchIndex = (oldestTouchIndex + VelocityTracker.NUM_PAST - 1) % VelocityTracker.NUM_PAST;
                        const nextOldestTime = pastTime[nextOldestTouchIndex];
                        if (nextOldestTime < minTime) {
                            break;
                        }
                        oldestTouchIndex = nextOldestTouchIndex;
                        numTouches += 1;
                    }
                    if (numTouches > 3) {
                        numTouches -= 1;
                    }
                    const pastX = pointer.pastX;
                    const pastY = pointer.pastY;
                    const oldestX = pastX[oldestTouchIndex];
                    const oldestY = pastY[oldestTouchIndex];
                    const oldestTime = pastTime[oldestTouchIndex];
                    let accumX = 0;
                    let accumY = 0;
                    for (let i = 1; i < numTouches; i++) {
                        const touchIndex = (oldestTouchIndex + i) % VelocityTracker.NUM_PAST;
                        const duration = (pastTime[touchIndex] - oldestTime);
                        if (duration == 0)
                            continue;
                        let delta = pastX[touchIndex] - oldestX;
                        let velocity = (delta / duration) * units;
                        accumX = (accumX == 0) ? velocity : (accumX + velocity) * .5;
                        delta = pastY[touchIndex] - oldestY;
                        velocity = (delta / duration) * units;
                        accumY = (accumY == 0) ? velocity : (accumY + velocity) * .5;
                    }
                    if (accumX < -maxVelocity) {
                        accumX = -maxVelocity;
                    }
                    else if (accumX > maxVelocity) {
                        accumX = maxVelocity;
                    }
                    if (accumY < -maxVelocity) {
                        accumY = -maxVelocity;
                    }
                    else if (accumY > maxVelocity) {
                        accumY = maxVelocity;
                    }
                    pointer.xVelocity = accumX;
                    pointer.yVelocity = accumY;
                    if (VelocityTracker.localLOGV) {
                        Log.v(VelocityTracker.TAG, "Pointer " + pointer.id
                            + ": Y velocity=" + accumX + " X velocity=" + accumY + " N=" + numTouches);
                    }
                }
            }
            getXVelocity(id = 0) {
                let pointer = this.getPointer(id);
                return pointer != null ? pointer.xVelocity : 0;
            }
            getYVelocity(id = 0) {
                let pointer = this.getPointer(id);
                return pointer != null ? pointer.yVelocity : 0;
            }
            getPointer(id) {
                for (let pointer = this.mPointerListHead; pointer != null; pointer = pointer.next) {
                    if (pointer.id == id) {
                        return pointer;
                    }
                }
                return null;
            }
            static obtainPointer() {
                if (VelocityTracker.sRecycledPointerCount != 0) {
                    let element = VelocityTracker.sRecycledPointerListHead;
                    VelocityTracker.sRecycledPointerCount -= 1;
                    VelocityTracker.sRecycledPointerListHead = element.next;
                    element.next = null;
                    return element;
                }
                return new Pointer();
            }
            static releasePointer(pointer) {
                if (VelocityTracker.sRecycledPointerCount < VelocityTracker.POINTER_POOL_CAPACITY) {
                    pointer.next = VelocityTracker.sRecycledPointerListHead;
                    VelocityTracker.sRecycledPointerCount += 1;
                    VelocityTracker.sRecycledPointerListHead = pointer;
                }
            }
            static releasePointerList(pointer) {
                if (pointer != null) {
                    let count = VelocityTracker.sRecycledPointerCount;
                    if (count >= VelocityTracker.POINTER_POOL_CAPACITY) {
                        return;
                    }
                    let tail = pointer;
                    for (;;) {
                        count += 1;
                        if (count >= VelocityTracker.POINTER_POOL_CAPACITY) {
                            break;
                        }
                        let next = tail.next;
                        if (next == null) {
                            break;
                        }
                        tail = next;
                    }
                    tail.next = VelocityTracker.sRecycledPointerListHead;
                    VelocityTracker.sRecycledPointerCount = count;
                    VelocityTracker.sRecycledPointerListHead = pointer;
                }
            }
        }
        VelocityTracker.TAG = "VelocityTracker";
        VelocityTracker.DEBUG = Log.VelocityTracker_DBG;
        VelocityTracker.localLOGV = VelocityTracker.DEBUG;
        VelocityTracker.NUM_PAST = 10;
        VelocityTracker.MAX_AGE_MILLISECONDS = 200;
        VelocityTracker.POINTER_POOL_CAPACITY = 20;
        VelocityTracker.sPool = new Pools.SynchronizedPool(2);
        VelocityTracker.sRecycledPointerCount = 0;
        view.VelocityTracker = VelocityTracker;
        class Pointer {
            constructor() {
                this.id = 0;
                this.xVelocity = 0;
                this.yVelocity = 0;
                this.pastX = new Array(VelocityTracker.NUM_PAST);
                this.pastY = new Array(VelocityTracker.NUM_PAST);
                this.pastTime = new Array(VelocityTracker.NUM_PAST);
                this.generation = 0;
            }
        }
    })(view = android.view || (android.view = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/17.
 */
///<reference path="../view/View.ts"/>
///<reference path="../view/ViewGroup.ts"/>
///<reference path="../view/MotionEvent.ts"/>
///<reference path="FrameLayout.ts"/>
///<reference path="OverScroller.ts"/>
///<reference path="../view/VelocityTracker.ts"/>
///<reference path="../view/ViewConfiguration.ts"/>
///<reference path="../util/Log.ts"/>
///<reference path="../os/SystemClock.ts"/>
///<reference path="../graphics/Rect.ts"/>
var android;
(function (android) {
    var widget;
    (function (widget) {
        var View = android.view.View;
        var ViewGroup = android.view.ViewGroup;
        var MeasureSpec = View.MeasureSpec;
        var MotionEvent = android.view.MotionEvent;
        var VelocityTracker = android.view.VelocityTracker;
        var ViewConfiguration = android.view.ViewConfiguration;
        var Rect = android.graphics.Rect;
        var OverScroller = android.widget.OverScroller;
        var Log = android.util.Log;
        var SystemClock = android.os.SystemClock;
        class ScrollView extends widget.FrameLayout {
            constructor() {
                super();
                this.mLastScroll = 0;
                this.mTempRect = new Rect();
                this.mLastMotionY = 0;
                this.mIsLayoutDirty = true;
                this.mIsBeingDragged = false;
                this.mFillViewport = false;
                this.mSmoothScrollingEnabled = true;
                this.mMinimumVelocity = 0;
                this.mMaximumVelocity = 0;
                this.mOverscrollDistance = 0;
                this.mOverflingDistance = 0;
                this.mActivePointerId = ScrollView.INVALID_POINTER;
                this.initScrollView();
            }
            shouldDelayChildPressedState() {
                return true;
            }
            getMaxScrollAmount() {
                return (ScrollView.MAX_SCROLL_FACTOR * (this.mBottom - this.mTop));
            }
            initScrollView() {
                this.mScroller = new OverScroller();
                this.setWillNotDraw(false);
                const configuration = ViewConfiguration.get();
                this.mTouchSlop = configuration.getScaledTouchSlop();
                this.mMinimumVelocity = configuration.getScaledMinimumFlingVelocity();
                this.mMaximumVelocity = configuration.getScaledMaximumFlingVelocity();
                this.mOverscrollDistance = configuration.getScaledOverscrollDistance();
                this.mOverflingDistance = configuration.getScaledOverflingDistance();
            }
            addView(...args) {
                if (this.getChildCount() > 0) {
                    throw new Error("ScrollView can host only one direct child");
                }
                return super.addView(...args);
            }
            canScroll() {
                let child = this.getChildAt(0);
                if (child != null) {
                    let childHeight = child.getHeight();
                    return this.getHeight() < childHeight + this.mPaddingTop + this.mPaddingBottom;
                }
                return false;
            }
            isFillViewport() {
                return this.mFillViewport;
            }
            setFillViewport(fillViewport) {
                if (fillViewport != this.mFillViewport) {
                    this.mFillViewport = fillViewport;
                    this.requestLayout();
                }
            }
            isSmoothScrollingEnabled() {
                return this.mSmoothScrollingEnabled;
            }
            setSmoothScrollingEnabled(smoothScrollingEnabled) {
                this.mSmoothScrollingEnabled = smoothScrollingEnabled;
            }
            onMeasure(widthMeasureSpec, heightMeasureSpec) {
                super.onMeasure(widthMeasureSpec, heightMeasureSpec);
                if (!this.mFillViewport) {
                    return;
                }
                const heightMode = MeasureSpec.getMode(heightMeasureSpec);
                if (heightMode == MeasureSpec.UNSPECIFIED) {
                    return;
                }
                if (this.getChildCount() > 0) {
                    const child = this.getChildAt(0);
                    let height = this.getMeasuredHeight();
                    if (child.getMeasuredHeight() < height) {
                        const lp = child.getLayoutParams();
                        let childWidthMeasureSpec = widget.FrameLayout.getChildMeasureSpec(widthMeasureSpec, this.mPaddingLeft + this.mPaddingRight, lp.width);
                        height -= this.mPaddingTop;
                        height -= this.mPaddingBottom;
                        let childHeightMeasureSpec = MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY);
                        child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
                    }
                }
            }
            inChild(x, y) {
                if (this.getChildCount() > 0) {
                    const scrollY = this.mScrollY;
                    const child = this.getChildAt(0);
                    return !(y < child.getTop() - scrollY
                        || y >= child.getBottom() - scrollY
                        || x < child.getLeft()
                        || x >= child.getRight());
                }
                return false;
            }
            initOrResetVelocityTracker() {
                if (this.mVelocityTracker == null) {
                    this.mVelocityTracker = VelocityTracker.obtain();
                }
                else {
                    this.mVelocityTracker.clear();
                }
            }
            initVelocityTrackerIfNotExists() {
                if (this.mVelocityTracker == null) {
                    this.mVelocityTracker = VelocityTracker.obtain();
                }
            }
            recycleVelocityTracker() {
                if (this.mVelocityTracker != null) {
                    this.mVelocityTracker.recycle();
                    this.mVelocityTracker = null;
                }
            }
            requestDisallowInterceptTouchEvent(disallowIntercept) {
                if (disallowIntercept) {
                    this.recycleVelocityTracker();
                }
                super.requestDisallowInterceptTouchEvent(disallowIntercept);
            }
            onInterceptTouchEvent(ev) {
                /*
                 * This method JUST determines whether we want to intercept the motion.
                 * If we return true, onMotionEvent will be called and we do the actual
                 * scrolling there.
                 */
                const action = ev.getAction();
                if ((action == MotionEvent.ACTION_MOVE) && (this.mIsBeingDragged)) {
                    return true;
                }
                if (this.getScrollY() == 0 && !this.canScrollVertically(1)) {
                    return false;
                }
                switch (action & MotionEvent.ACTION_MASK) {
                    case MotionEvent.ACTION_MOVE:
                        {
                            const activePointerId = this.mActivePointerId;
                            if (activePointerId == ScrollView.INVALID_POINTER) {
                                break;
                            }
                            const pointerIndex = ev.findPointerIndex(activePointerId);
                            if (pointerIndex == -1) {
                                Log.e(ScrollView.TAG, "Invalid pointerId=" + activePointerId
                                    + " in onInterceptTouchEvent");
                                break;
                            }
                            const y = ev.getY(pointerIndex);
                            const yDiff = Math.abs(y - this.mLastMotionY);
                            if (yDiff > this.mTouchSlop) {
                                this.mIsBeingDragged = true;
                                this.mLastMotionY = y;
                                this.initVelocityTrackerIfNotExists();
                                this.mVelocityTracker.addMovement(ev);
                                const parent = this.getParent();
                                if (parent != null) {
                                    parent.requestDisallowInterceptTouchEvent(true);
                                }
                            }
                            break;
                        }
                    case MotionEvent.ACTION_DOWN:
                        {
                            const y = ev.getY();
                            if (!this.inChild(ev.getX(), y)) {
                                this.mIsBeingDragged = false;
                                this.recycleVelocityTracker();
                                break;
                            }
                            this.mLastMotionY = y;
                            this.mActivePointerId = ev.getPointerId(0);
                            this.initOrResetVelocityTracker();
                            this.mVelocityTracker.addMovement(ev);
                            this.mIsBeingDragged = !this.mScroller.isFinished();
                            break;
                        }
                    case MotionEvent.ACTION_CANCEL:
                    case MotionEvent.ACTION_UP:
                        this.mIsBeingDragged = false;
                        this.mActivePointerId = ScrollView.INVALID_POINTER;
                        this.recycleVelocityTracker();
                        if (this.mScroller.springBack(this.mScrollX, this.mScrollY, 0, 0, 0, this.getScrollRange())) {
                            this.postInvalidateOnAnimation();
                        }
                        break;
                    case MotionEvent.ACTION_POINTER_UP:
                        this.onSecondaryPointerUp(ev);
                        break;
                }
                return this.mIsBeingDragged;
            }
            onTouchEvent(ev) {
                this.initVelocityTrackerIfNotExists();
                this.mVelocityTracker.addMovement(ev);
                const action = ev.getAction();
                switch (action & MotionEvent.ACTION_MASK) {
                    case MotionEvent.ACTION_DOWN:
                        {
                            if (this.getChildCount() == 0) {
                                return false;
                            }
                            if ((this.mIsBeingDragged = !this.mScroller.isFinished())) {
                                const parent = this.getParent();
                                if (parent != null) {
                                    parent.requestDisallowInterceptTouchEvent(true);
                                }
                            }
                            if (!this.mScroller.isFinished()) {
                                this.mScroller.abortAnimation();
                            }
                            this.mLastMotionY = ev.getY();
                            this.mActivePointerId = ev.getPointerId(0);
                            break;
                        }
                    case MotionEvent.ACTION_MOVE:
                        const activePointerIndex = ev.findPointerIndex(this.mActivePointerId);
                        if (activePointerIndex == -1) {
                            Log.e(ScrollView.TAG, "Invalid pointerId=" + this.mActivePointerId + " in onTouchEvent");
                            break;
                        }
                        const y = ev.getY(activePointerIndex);
                        let deltaY = this.mLastMotionY - y;
                        if (!this.mIsBeingDragged && Math.abs(deltaY) > this.mTouchSlop) {
                            const parent = this.getParent();
                            if (parent != null) {
                                parent.requestDisallowInterceptTouchEvent(true);
                            }
                            this.mIsBeingDragged = true;
                            if (deltaY > 0) {
                                deltaY -= this.mTouchSlop;
                            }
                            else {
                                deltaY += this.mTouchSlop;
                            }
                        }
                        if (this.mIsBeingDragged) {
                            this.mLastMotionY = y;
                            const oldX = this.mScrollX;
                            const oldY = this.mScrollY;
                            const range = this.getScrollRange();
                            const overscrollMode = this.getOverScrollMode();
                            const canOverscroll = overscrollMode == ScrollView.OVER_SCROLL_ALWAYS ||
                                (overscrollMode == ScrollView.OVER_SCROLL_IF_CONTENT_SCROLLS && range > 0);
                            if (this.overScrollBy(0, deltaY, 0, this.mScrollY, 0, range, 0, this.mOverscrollDistance, true)) {
                                this.mVelocityTracker.clear();
                            }
                            if (canOverscroll) {
                                const pulledToY = oldY + deltaY;
                                if (pulledToY < 0) {
                                }
                                else if (pulledToY > range) {
                                }
                            }
                        }
                        break;
                    case MotionEvent.ACTION_UP:
                        if (this.mIsBeingDragged) {
                            let velocityTracker = this.mVelocityTracker;
                            velocityTracker.computeCurrentVelocity(1000, this.mMaximumVelocity);
                            let initialVelocity = velocityTracker.getYVelocity(this.mActivePointerId);
                            if (this.getChildCount() > 0) {
                                if ((Math.abs(initialVelocity) > this.mMinimumVelocity)) {
                                    this.fling(-initialVelocity);
                                }
                                else {
                                    if (this.mScroller.springBack(this.mScrollX, this.mScrollY, 0, 0, 0, this.getScrollRange())) {
                                        this.postInvalidateOnAnimation();
                                    }
                                }
                            }
                            this.mActivePointerId = ScrollView.INVALID_POINTER;
                            this.endDrag();
                        }
                        break;
                    case MotionEvent.ACTION_CANCEL:
                        if (this.mIsBeingDragged && this.getChildCount() > 0) {
                            if (this.mScroller.springBack(this.mScrollX, this.mScrollY, 0, 0, 0, this.getScrollRange())) {
                                this.postInvalidateOnAnimation();
                            }
                            this.mActivePointerId = ScrollView.INVALID_POINTER;
                            this.endDrag();
                        }
                        break;
                    case MotionEvent.ACTION_POINTER_DOWN:
                        {
                            const index = ev.getActionIndex();
                            this.mLastMotionY = ev.getY(index);
                            this.mActivePointerId = ev.getPointerId(index);
                            break;
                        }
                    case MotionEvent.ACTION_POINTER_UP:
                        this.onSecondaryPointerUp(ev);
                        this.mLastMotionY = ev.getY(ev.findPointerIndex(this.mActivePointerId));
                        break;
                }
                return true;
            }
            onSecondaryPointerUp(ev) {
                const pointerIndex = (ev.getAction() & MotionEvent.ACTION_POINTER_INDEX_MASK) >>
                    MotionEvent.ACTION_POINTER_INDEX_SHIFT;
                const pointerId = ev.getPointerId(pointerIndex);
                if (pointerId == this.mActivePointerId) {
                    const newPointerIndex = pointerIndex == 0 ? 1 : 0;
                    this.mLastMotionY = ev.getY(newPointerIndex);
                    this.mActivePointerId = ev.getPointerId(newPointerIndex);
                    if (this.mVelocityTracker != null) {
                        this.mVelocityTracker.clear();
                    }
                }
            }
            onOverScrolled(scrollX, scrollY, clampedX, clampedY) {
                if (!this.mScroller.isFinished()) {
                    const oldX = this.mScrollX;
                    const oldY = this.mScrollY;
                    this.mScrollX = scrollX;
                    this.mScrollY = scrollY;
                    this.invalidateParentIfNeeded();
                    this.onScrollChanged(this.mScrollX, this.mScrollY, oldX, oldY);
                    if (clampedY || this.mScroller.getCurrVelocity() < this.mMinimumVelocity) {
                        this.mScroller.springBack(this.mScrollX, this.mScrollY, 0, 0, 0, this.getScrollRange());
                    }
                }
                else {
                    super.scrollTo(scrollX, scrollY);
                }
                if (!this.awakenScrollBars()) {
                }
            }
            getScrollRange() {
                let scrollRange = 0;
                if (this.getChildCount() > 0) {
                    let child = this.getChildAt(0);
                    scrollRange = Math.max(0, child.getHeight() - (this.getHeight() - this.mPaddingBottom - this.mPaddingTop));
                }
                return scrollRange;
            }
            findFocusableViewInBounds(topFocus, top, bottom) {
                return null;
            }
            pageScroll(direction) {
                let down = direction == View.FOCUS_DOWN;
                let height = this.getHeight();
                if (down) {
                    this.mTempRect.top = this.getScrollY() + height;
                    let count = this.getChildCount();
                    if (count > 0) {
                        let view = this.getChildAt(count - 1);
                        if (this.mTempRect.top + height > view.getBottom()) {
                            this.mTempRect.top = view.getBottom() - height;
                        }
                    }
                }
                else {
                    this.mTempRect.top = this.getScrollY() - height;
                    if (this.mTempRect.top < 0) {
                        this.mTempRect.top = 0;
                    }
                }
                this.mTempRect.bottom = this.mTempRect.top + height;
                return this.scrollAndFocus(direction, this.mTempRect.top, this.mTempRect.bottom);
            }
            fullScroll(direction) {
                let down = direction == View.FOCUS_DOWN;
                let height = this.getHeight();
                this.mTempRect.top = 0;
                this.mTempRect.bottom = height;
                if (down) {
                    let count = this.getChildCount();
                    if (count > 0) {
                        let view = this.getChildAt(count - 1);
                        this.mTempRect.bottom = view.getBottom() + this.mPaddingBottom;
                        this.mTempRect.top = this.mTempRect.bottom - height;
                    }
                }
                return this.scrollAndFocus(direction, this.mTempRect.top, this.mTempRect.bottom);
            }
            scrollAndFocus(direction, top, bottom) {
                let handled = true;
                let height = this.getHeight();
                let containerTop = this.getScrollY();
                let containerBottom = containerTop + height;
                let up = direction == View.FOCUS_UP;
                let newFocused = this.findFocusableViewInBounds(up, top, bottom);
                if (newFocused == null) {
                    newFocused = this;
                }
                if (top >= containerTop && bottom <= containerBottom) {
                    handled = false;
                }
                else {
                    let delta = up ? (top - containerTop) : (bottom - containerBottom);
                    this.doScrollY(delta);
                }
                return handled;
            }
            arrowScroll(direction) {
                return false;
            }
            isOffScreen(descendant) {
                return !this.isWithinDeltaOfScreen(descendant, 0, this.getHeight());
            }
            isWithinDeltaOfScreen(descendant, delta, height) {
                descendant.getDrawingRect(this.mTempRect);
                this.offsetDescendantRectToMyCoords(descendant, this.mTempRect);
                return (this.mTempRect.bottom + delta) >= this.getScrollY()
                    && (this.mTempRect.top - delta) <= (this.getScrollY() + height);
            }
            doScrollY(delta) {
                if (delta != 0) {
                    if (this.mSmoothScrollingEnabled) {
                        this.smoothScrollBy(0, delta);
                    }
                    else {
                        this.scrollBy(0, delta);
                    }
                }
            }
            smoothScrollBy(dx, dy) {
                if (this.getChildCount() == 0) {
                    return;
                }
                let duration = SystemClock.uptimeMillis() - this.mLastScroll;
                if (duration > ScrollView.ANIMATED_SCROLL_GAP) {
                    const height = this.getHeight() - this.mPaddingBottom - this.mPaddingTop;
                    const bottom = this.getChildAt(0).getHeight();
                    const maxY = Math.max(0, bottom - height);
                    const scrollY = this.mScrollY;
                    dy = Math.max(0, Math.min(scrollY + dy, maxY)) - scrollY;
                    this.mScroller.startScroll(this.mScrollX, scrollY, 0, dy);
                    this.postInvalidateOnAnimation();
                }
                else {
                    if (!this.mScroller.isFinished()) {
                        this.mScroller.abortAnimation();
                    }
                    scrollBy(dx, dy);
                }
                this.mLastScroll = SystemClock.uptimeMillis();
            }
            smoothScrollTo(x, y) {
                this.smoothScrollBy(x - this.mScrollX, y - this.mScrollY);
            }
            computeVerticalScrollRange() {
                const count = this.getChildCount();
                const contentHeight = this.getHeight() - this.mPaddingBottom - this.mPaddingTop;
                if (count == 0) {
                    return contentHeight;
                }
                let scrollRange = this.getChildAt(0).getBottom();
                const scrollY = this.mScrollY;
                const overscrollBottom = Math.max(0, scrollRange - contentHeight);
                if (scrollY < 0) {
                    scrollRange -= scrollY;
                }
                else if (scrollY > overscrollBottom) {
                    scrollRange += scrollY - overscrollBottom;
                }
                return scrollRange;
            }
            computeVerticalScrollOffset() {
                return Math.max(0, super.computeVerticalScrollOffset());
            }
            measureChild(child, parentWidthMeasureSpec, parentHeightMeasureSpec) {
                let lp = child.getLayoutParams();
                let childWidthMeasureSpec;
                let childHeightMeasureSpec;
                childWidthMeasureSpec = ViewGroup.getChildMeasureSpec(parentWidthMeasureSpec, this.mPaddingLeft
                    + this.mPaddingRight, lp.width);
                childHeightMeasureSpec = MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED);
                child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
            }
            measureChildWithMargins(child, parentWidthMeasureSpec, widthUsed, parentHeightMeasureSpec, heightUsed) {
                const lp = child.getLayoutParams();
                const childWidthMeasureSpec = ScrollView.getChildMeasureSpec(parentWidthMeasureSpec, this.mPaddingLeft + this.mPaddingRight + lp.leftMargin + lp.rightMargin
                    + widthUsed, lp.width);
                const childHeightMeasureSpec = MeasureSpec.makeMeasureSpec(lp.topMargin + lp.bottomMargin, MeasureSpec.UNSPECIFIED);
                child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
            }
            computeScroll() {
                if (this.mScroller.computeScrollOffset()) {
                    let oldX = this.mScrollX;
                    let oldY = this.mScrollY;
                    let x = this.mScroller.getCurrX();
                    let y = this.mScroller.getCurrY();
                    if (oldX != x || oldY != y) {
                        const range = this.getScrollRange();
                        const overscrollMode = this.getOverScrollMode();
                        const canOverscroll = overscrollMode == ScrollView.OVER_SCROLL_ALWAYS ||
                            (overscrollMode == ScrollView.OVER_SCROLL_IF_CONTENT_SCROLLS && range > 0);
                        this.overScrollBy(x - oldX, y - oldY, oldX, oldY, 0, range, 0, this.mOverflingDistance, false);
                        this.onScrollChanged(this.mScrollX, this.mScrollY, oldX, oldY);
                        if (canOverscroll) {
                            if (y < 0 && oldY >= 0) {
                            }
                            else if (y > range && oldY <= range) {
                            }
                        }
                    }
                    if (!this.awakenScrollBars()) {
                        this.postInvalidateOnAnimation();
                    }
                }
                else {
                }
            }
            scrollToChild(child) {
                child.getDrawingRect(this.mTempRect);
                this.offsetDescendantRectToMyCoords(child, this.mTempRect);
                let scrollDelta = this.computeScrollDeltaToGetChildRectOnScreen(this.mTempRect);
                if (scrollDelta != 0) {
                    this.scrollBy(0, scrollDelta);
                }
            }
            scrollToChildRect(rect, immediate) {
                const delta = this.computeScrollDeltaToGetChildRectOnScreen(rect);
                const scroll = delta != 0;
                if (scroll) {
                    if (immediate) {
                        this.scrollBy(0, delta);
                    }
                    else {
                        this.smoothScrollBy(0, delta);
                    }
                }
                return scroll;
            }
            computeScrollDeltaToGetChildRectOnScreen(rect) {
                if (this.getChildCount() == 0)
                    return 0;
                let height = this.getHeight();
                let screenTop = this.getScrollY();
                let screenBottom = screenTop + height;
                let fadingEdge = this.getVerticalFadingEdgeLength();
                if (rect.top > 0) {
                    screenTop += fadingEdge;
                }
                if (rect.bottom < this.getChildAt(0).getHeight()) {
                    screenBottom -= fadingEdge;
                }
                let scrollYDelta = 0;
                if (rect.bottom > screenBottom && rect.top > screenTop) {
                    if (rect.height() > height) {
                        scrollYDelta += (rect.top - screenTop);
                    }
                    else {
                        scrollYDelta += (rect.bottom - screenBottom);
                    }
                    let bottom = this.getChildAt(0).getBottom();
                    let distanceToBottom = bottom - screenBottom;
                    scrollYDelta = Math.min(scrollYDelta, distanceToBottom);
                }
                else if (rect.top < screenTop && rect.bottom < screenBottom) {
                    if (rect.height() > height) {
                        scrollYDelta -= (screenBottom - rect.bottom);
                    }
                    else {
                        scrollYDelta -= (screenTop - rect.top);
                    }
                    scrollYDelta = Math.max(scrollYDelta, -this.getScrollY());
                }
                return scrollYDelta;
            }
            requestChildFocus(child, focused) {
                if (!this.mIsLayoutDirty) {
                    this.scrollToChild(focused);
                }
                else {
                    this.mChildToScrollTo = focused;
                }
                super.requestChildFocus(child, focused);
            }
            onRequestFocusInDescendants(direction, previouslyFocusedRect) {
                return false;
            }
            requestChildRectangleOnScreen(child, rectangle, immediate) {
                rectangle.offset(child.getLeft() - child.getScrollX(), child.getTop() - child.getScrollY());
                return this.scrollToChildRect(rectangle, immediate);
            }
            requestLayout() {
                this.mIsLayoutDirty = true;
                super.requestLayout();
            }
            onLayout(changed, l, t, r, b) {
                super.onLayout(changed, l, t, r, b);
                this.mIsLayoutDirty = false;
                if (this.mChildToScrollTo != null && ScrollView.isViewDescendantOf(this.mChildToScrollTo, this)) {
                    this.scrollToChild(this.mChildToScrollTo);
                }
                this.mChildToScrollTo = null;
                if (!this.isLaidOut()) {
                    const childHeight = (this.getChildCount() > 0) ? this.getChildAt(0).getMeasuredHeight() : 0;
                    const scrollRange = Math.max(0, childHeight - (b - t - this.mPaddingBottom - this.mPaddingTop));
                    if (this.mScrollY > scrollRange) {
                        this.mScrollY = scrollRange;
                    }
                    else if (this.mScrollY < 0) {
                        this.mScrollY = 0;
                    }
                }
                scrollTo(this.mScrollX, this.mScrollY);
            }
            onSizeChanged(w, h, oldw, oldh) {
                super.onSizeChanged(w, h, oldw, oldh);
                let currentFocused = this.findFocus();
                if (null == currentFocused || this == currentFocused)
                    return;
                if (this.isWithinDeltaOfScreen(currentFocused, 0, oldh)) {
                    currentFocused.getDrawingRect(this.mTempRect);
                    this.offsetDescendantRectToMyCoords(currentFocused, this.mTempRect);
                    let scrollDelta = this.computeScrollDeltaToGetChildRectOnScreen(this.mTempRect);
                    this.doScrollY(scrollDelta);
                }
            }
            static isViewDescendantOf(child, parent) {
                if (child == parent) {
                    return true;
                }
                const theParent = child.getParent();
                return (theParent instanceof ViewGroup) && ScrollView.isViewDescendantOf(theParent, parent);
            }
            fling(velocityY) {
                if (this.getChildCount() > 0) {
                    let height = this.getHeight() - this.mPaddingBottom - this.mPaddingTop;
                    let bottom = this.getChildAt(0).getHeight();
                    this.mScroller.fling(this.mScrollX, this.mScrollY, 0, velocityY, 0, 0, 0, Math.max(0, bottom - height), 0, height / 2);
                    this.postInvalidateOnAnimation();
                }
            }
            endDrag() {
                this.mIsBeingDragged = false;
                this.recycleVelocityTracker();
            }
            scrollTo(x, y) {
                if (this.getChildCount() > 0) {
                    let child = this.getChildAt(0);
                    x = ScrollView.clamp(x, this.getWidth() - this.mPaddingRight - this.mPaddingLeft, child.getWidth());
                    y = ScrollView.clamp(y, this.getHeight() - this.mPaddingBottom - this.mPaddingTop, child.getHeight());
                    if (x != this.mScrollX || y != this.mScrollY) {
                        super.scrollTo(x, y);
                    }
                }
            }
            static clamp(n, my, child) {
                if (my >= child || n < 0) {
                    return 0;
                }
                if ((my + n) > child) {
                    return child - my;
                }
                return n;
            }
        }
        ScrollView.ANIMATED_SCROLL_GAP = 250;
        ScrollView.MAX_SCROLL_FACTOR = 0.5;
        ScrollView.TAG = "ScrollView";
        ScrollView.INVALID_POINTER = -1;
        widget.ScrollView = ScrollView;
    })(widget = android.widget || (android.widget = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/23.
 */
///<reference path="../android/view/View.ts"/>
///<reference path="../android/view/ViewRootImpl.ts"/>
///<reference path="../android/widget/FrameLayout.ts"/>
///<reference path="../android/view/MotionEvent.ts"/>
var runtime;
(function (runtime) {
    var View = android.view.View;
    var ViewRootImpl = android.view.ViewRootImpl;
    var FrameLayout = android.widget.FrameLayout;
    var MotionEvent = android.view.MotionEvent;
    class AndroidUI {
        constructor(element) {
            this.element = element;
            if (element['AndroidUI']) {
                throw Error('already init a AndroidUI with this element');
            }
            element['AndroidUI'] = this;
            this.init();
        }
        init() {
            this.viewRootImpl = new ViewRootImpl();
            this.rootLayout = new RootLayout();
            this.canvas = document.createElement("canvas");
            this.initInflateView();
            this.initRootElementStyle();
            this.initCanvasStyle();
            this.initBindElementStyle();
            this.element.innerHTML = '';
            this.element.appendChild(this.rootStyleElement);
            this.element.appendChild(this.canvas);
            this.element.appendChild(this.rootLayout.bindElement);
            this.viewRootImpl.setView(this.rootLayout);
            this.viewRootImpl.initSurface(this.canvas);
            this.initTouch();
            this.tryStartLayoutAfterInit();
        }
        initInflateView() {
            Array.from(this.element.children).forEach((item) => {
                if (item instanceof HTMLStyleElement) {
                    this.rootStyleElement = item;
                    return;
                }
                if (item instanceof HTMLElement) {
                    let view = View.inflate(item);
                    if (view)
                        this.rootLayout.addView(view);
                }
            });
        }
        initRootElementStyle() {
            if (!this.element.style.position) {
                this.element.style.position = "relative";
            }
            if (!this.element.style.display) {
                this.element.style.display = "inline-block";
            }
            this.element.style.overflow = 'hidden';
        }
        initCanvasStyle() {
            let canvas = this.canvas;
            canvas.style.position = "absolute";
            canvas.style.left = '0px';
            canvas.style.top = '0px';
        }
        initTouch() {
            let motionEvent;
            let windowXOffset = 0, windowYOffset = 0;
            this.element.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                let rootViewBound = this.element.getBoundingClientRect();
                windowXOffset = rootViewBound.left;
                windowYOffset = rootViewBound.top;
                if (!motionEvent)
                    motionEvent = MotionEvent.obtainWithTouchEvent(e, MotionEvent.ACTION_DOWN);
                else
                    motionEvent.init(e, MotionEvent.ACTION_DOWN, windowXOffset, windowYOffset);
                this.rootLayout.dispatchTouchEvent(motionEvent);
            }, true);
            this.element.addEventListener('touchmove', (e) => {
                e.preventDefault();
                e.stopPropagation();
                motionEvent.init(e, MotionEvent.ACTION_MOVE, windowXOffset, windowYOffset);
                this.rootLayout.dispatchTouchEvent(motionEvent);
            }, true);
            this.element.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                motionEvent.init(e, MotionEvent.ACTION_UP);
                this.rootLayout.dispatchTouchEvent(motionEvent);
            }, true);
            this.element.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                e.stopPropagation();
                motionEvent.init(e, MotionEvent.ACTION_CANCEL, windowXOffset, windowYOffset);
                this.rootLayout.dispatchTouchEvent(motionEvent);
            }, true);
        }
        initBindElementStyle() {
            if (!this.rootStyleElement)
                this.rootStyleElement = document.createElement("style");
            this.rootStyleElement.setAttribute("scoped", '');
            let iOS = /iPad|iPhone|iPod/.test(navigator.platform);
            if (iOS) {
                this.rootStyleElement.innerHTML += `
                    android-ScrollView::-webkit-scrollbar {
                        -webkit-appearance: none;
                        width: 4px;
                    }
                    android-ScrollView::-webkit-scrollbar-thumb {
                        border-radius: 2px;
                        background-color: rgba(0,0,0,.3);
                    }
                `;
            }
            let density = android.content.res.Resources.getDisplayMetrics().density;
            if (density != 1) {
                this.rootStyleElement.innerHTML += `
                android-RootLayout {
                    transform:scale(${1 / density},${1 / density});
                    -webkit-transform:scale(${1 / density},${1 / density});
                    transform-origin:0 0;
                    -webkit-transform-origin:0 0;
                }
                `;
            }
        }
        tryStartLayoutAfterInit() {
            let width = this.element.offsetWidth;
            let height = this.element.offsetHeight;
            if (width > 0 && height > 0)
                this.notifySizeChange(width, height);
        }
        notifySizeChange(width, height) {
            let density = android.content.res.Resources.getDisplayMetrics().density;
            this.viewRootImpl.mWinFrame.set(0, 0, width * density, height * density);
            this.canvas.width = width * density;
            this.canvas.height = height * density;
            this.canvas.style.width = width + "px";
            this.canvas.style.height = height + "px";
            this.viewRootImpl.requestLayout();
        }
        setContentView(view) {
            this.rootLayout.removeAllViews();
            this.rootLayout.addView(view);
        }
        addContentView(view) {
            this.rootLayout.addView(view);
        }
        findViewById(id) {
            return this.rootLayout.findViewById(id);
        }
    }
    runtime.AndroidUI = AndroidUI;
    class RootLayout extends FrameLayout {
    }
})(runtime || (runtime = {}));
/**
 * Created by linfaxin on 15/10/11.
 */
///<reference path="../view/View.ts"/>
///<reference path="../view/ViewRootImpl.ts"/>
///<reference path="../widget/FrameLayout.ts"/>
///<reference path="../view/MotionEvent.ts"/>
///<reference path="../../runtime/AndroidUI.ts"/>
var android;
(function (android) {
    var app;
    (function (app) {
        var AndroidUI = runtime.AndroidUI;
        if (typeof HTMLDivElement !== 'function') {
            var _HTMLDivElement = function () { };
            _HTMLDivElement.prototype = HTMLDivElement.prototype;
            HTMLDivElement = _HTMLDivElement;
        }
        class Activity extends HTMLDivElement {
            onCreate() {
            }
            createdCallback() {
                this.androidUI = new AndroidUI(this);
                this.onCreate();
            }
            attachedCallback() {
                this.androidUI.notifySizeChange(this.offsetWidth, this.offsetHeight);
            }
            detachedCallback() {
            }
            attributeChangedCallback(attributeName, oldVal, newVal) {
            }
            setContentView(view) {
                this.androidUI.setContentView(view);
            }
            addContentView(view) {
                this.androidUI.addContentView(view);
            }
            findViewById(id) {
                return this.androidUI.findViewById(id);
            }
        }
        app.Activity = Activity;
    })(app = android.app || (android.app = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/6.
 */
//use the deepest sub class as enter
///<reference path="android/view/ViewOverlay.ts"/>
///<reference path="android/widget/FrameLayout.ts"/>
///<reference path="android/widget/ScrollView.ts"/>
///<reference path="android/app/Activity.ts"/>
///<reference path="runtime/AndroidUI.ts"/>
window[`android`] = android;
window[`java`] = java;
window[`runtime`] = runtime;

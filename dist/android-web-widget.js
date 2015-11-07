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
            get(key, valueIfKeyNotFound = null) {
                let value = this.map.get(key);
                if (value === undefined)
                    return valueIfKeyNotFound;
                return value;
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
        Log.DBG_DrawableContainer = false;
        Log.DBG_StateListDrawable = false;
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
            class WeakReference {
                constructor(referent) {
                    this.weakMap = new WeakMap();
                    this.weakMap.set(this, referent);
                }
                get() {
                    return this.weakMap.get(this);
                }
                set(value) {
                    this.weakMap.set(this, value);
                }
                clear() {
                    this.weakMap.delete(this);
                }
            }
            ref.WeakReference = WeakReference;
        })(ref = lang.ref || (lang.ref = {}));
    })(lang = java.lang || (java.lang = {}));
})(java || (java = {}));
var java;
(function (java) {
    var lang;
    (function (lang) {
        class System {
            static currentTimeMillis() {
                return new Date().getTime();
            }
            static arraycopy(src, srcPos, dest, destPos, length) {
                let srcLength = src.length;
                let destLength = dest.length;
                for (let i = 0; i < length; i++) {
                    let srcIndex = i + srcPos;
                    if (srcIndex >= srcLength)
                        return;
                    let destIndex = i + destPos;
                    if (destIndex >= destLength)
                        return;
                    dest[destIndex] = src[srcIndex];
                }
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
/**
 * Created by linfaxin on 15/10/29.
 */
///<reference path="../../java/lang/System.ts"/>
var android;
(function (android) {
    var util;
    (function (util) {
        var System = java.lang.System;
        class StateSet {
            static isWildCard(stateSetOrSpec) {
                return stateSetOrSpec.length == 0 || stateSetOrSpec[0] == 0;
            }
            static stateSetMatches(stateSpec, stateSetOrState) {
                if (Number.isInteger(stateSetOrState)) {
                    return StateSet._stateSetMatches_single(stateSpec, stateSetOrState);
                }
                let stateSet = stateSetOrState;
                if (stateSet == null) {
                    return (stateSpec == null || this.isWildCard(stateSpec));
                }
                let stateSpecSize = stateSpec.length;
                let stateSetSize = stateSet.length;
                for (let i = 0; i < stateSpecSize; i++) {
                    let stateSpecState = stateSpec[i];
                    if (stateSpecState == 0) {
                        return true;
                    }
                    let mustMatch;
                    if (stateSpecState > 0) {
                        mustMatch = true;
                    }
                    else {
                        mustMatch = false;
                        stateSpecState = -stateSpecState;
                    }
                    let found = false;
                    for (let j = 0; j < stateSetSize; j++) {
                        const state = stateSet[j];
                        if (state == 0) {
                            if (mustMatch) {
                                return false;
                            }
                            else {
                                break;
                            }
                        }
                        if (state == stateSpecState) {
                            if (mustMatch) {
                                found = true;
                                break;
                            }
                            else {
                                return false;
                            }
                        }
                    }
                    if (mustMatch && !found) {
                        return false;
                    }
                }
                return true;
            }
            static _stateSetMatches_single(stateSpec, state) {
                let stateSpecSize = stateSpec.length;
                for (let i = 0; i < stateSpecSize; i++) {
                    let stateSpecState = stateSpec[i];
                    if (stateSpecState == 0) {
                        return true;
                    }
                    if (stateSpecState > 0) {
                        if (state != stateSpecState) {
                            return false;
                        }
                    }
                    else {
                        if (state == -stateSpecState) {
                            return false;
                        }
                    }
                }
                return true;
            }
            static trimStateSet(states, newSize) {
                if (states.length == newSize) {
                    return states;
                }
                let trimmedStates = new Array(newSize);
                System.arraycopy(states, 0, trimmedStates, 0, newSize);
                return trimmedStates;
            }
        }
        StateSet.WILD_CARD = [];
        StateSet.NOTHING = [0];
        util.StateSet = StateSet;
    })(util = android.util || (android.util = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/3.
 */
///<reference path="../Rect.ts"/>
///<reference path="../PixelFormat.ts"/>
///<reference path="../../../java/lang/ref/WeakReference.ts"/>
///<reference path="../../../java/lang/Runnable.ts"/>
///<reference path="../../util/StateSet.ts"/>
var android;
(function (android) {
    var graphics;
    (function (graphics) {
        var drawable;
        (function (drawable) {
            var Rect = android.graphics.Rect;
            var PixelFormat = android.graphics.PixelFormat;
            var WeakReference = java.lang.ref.WeakReference;
            var StateSet = android.util.StateSet;
            class Drawable {
                constructor() {
                    this.mBounds = Drawable.ZERO_BOUNDS_RECT;
                    this.mStateSet = StateSet.WILD_CARD;
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
                        if (oldBounds == Drawable.ZERO_BOUNDS_RECT) {
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
                    if (this.mBounds == Drawable.ZERO_BOUNDS_RECT) {
                        this.mBounds = new Rect();
                    }
                    return this.mBounds;
                }
                setDither(dither) { }
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
                    if (this.mStateSet + '' !== stateSet + '') {
                        this.mStateSet = stateSet;
                        return this.onStateChange(stateSet);
                    }
                    return false;
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
                    return PixelFormat.TRANSLUCENT;
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
            Drawable.ZERO_BOUNDS_RECT = new Rect();
            drawable.Drawable = Drawable;
        })(drawable = graphics.drawable || (graphics.drawable = {}));
    })(graphics = android.graphics || (android.graphics = {}));
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
            static rgba(red, green, blue, alpha) {
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
            static toRGBA(color) {
                let r = Color.red(color);
                let g = Color.green(color);
                let b = Color.blue(color);
                let a = Color.alpha(color);
                let hR = r < 16 ? '0' + r.toString(16) : r.toString(16);
                let hG = g < 16 ? '0' + g.toString(16) : g.toString(16);
                let hB = b < 16 ? '0' + b.toString(16) : b.toString(16);
                let hA = a < 16 ? '0' + a.toString(16) : a.toString(16);
                return "#" + hA + hR + hG + hB;
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
/**
 * Created by linfaxin on 15/10/29.
 */
///<reference path="Canvas.ts"/>
var android;
(function (android) {
    var graphics;
    (function (graphics) {
        class Paint {
            getColor() {
                return this.mColor;
            }
            setColor(color) {
                this.mColor = color;
            }
            getAlpha() {
                return this.mAlpha;
            }
            setAlpha(alpha) {
                this.mAlpha = alpha;
            }
            _setToCanvasContent(context) {
                if (Number.isInteger(this.mColor)) {
                    let r = graphics.Color.red(this.mColor);
                    let g = graphics.Color.green(this.mColor);
                    let b = graphics.Color.blue(this.mColor);
                    let a = graphics.Color.alpha(this.mColor);
                    context.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
                }
            }
        }
        graphics.Paint = Paint;
    })(graphics = android.graphics || (android.graphics = {}));
})(android || (android = {}));
///<reference path="../util/Pools.ts"/>
///<reference path="../util/Log.ts"/>
///<reference path="Rect.ts"/>
///<reference path="Color.ts"/>
///<reference path="Paint.ts"/>
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
                this._mCanvasContent.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
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
            drawRect(...args) {
                if (args.length == 2) {
                    let rect = args[0];
                    this.drawRect(rect.left, rect.top, rect.right, rect.bottom, args[1]);
                }
                else {
                    let [left, top, right, bottom, paint] = args;
                    this._mCanvasContent.save();
                    paint._setToCanvasContent(this._mCanvasContent);
                    this._mCanvasContent.fillRect(left, top, right - left, bottom - top);
                    this._mCanvasContent.restore();
                }
            }
        }
        Canvas.FullRect = new Rect(-1000000000, -1000000000, 1000000000, 1000000000);
        Canvas.sPool = new Pools.SynchronizedPool(10);
        graphics.Canvas = Canvas;
    })(graphics = android.graphics || (android.graphics = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/29.
 */
///<reference path="Drawable.ts"/>
///<reference path="../Canvas.ts"/>
///<reference path="../Paint.ts"/>
var android;
(function (android) {
    var graphics;
    (function (graphics) {
        var drawable;
        (function (drawable) {
            class ColorDrawable extends drawable.Drawable {
                constructor(color) {
                    super();
                    this.mMutated = false;
                    this.mPaint = new graphics.Paint();
                    this.mState = new ColorState();
                    if (color !== undefined) {
                        this.setColor(color);
                    }
                }
                _setStateCopyFrom(state) {
                    this.mState = new ColorState(state);
                }
                mutate() {
                    if (!this.mMutated && super.mutate() == this) {
                        this.mState = new ColorState(this.mState);
                        this.mMutated = true;
                    }
                    return this;
                }
                draw(canvas) {
                    if ((this.mState.mUseColor >>> 24) != 0) {
                        this.mPaint.setColor(this.mState.mUseColor);
                        canvas.drawRect(this.getBounds(), this.mPaint);
                    }
                }
                getColor() {
                    return this.mState.mUseColor;
                }
                setColor(color) {
                    if (this.mState.mBaseColor != color || this.mState.mUseColor != color) {
                        this.invalidateSelf();
                        this.mState.mBaseColor = this.mState.mUseColor = color;
                    }
                }
                getAlpha() {
                    return this.mState.mUseColor >>> 24;
                }
                setAlpha(alpha) {
                    alpha += alpha >> 7;
                    let baseAlpha = this.mState.mBaseColor >>> 24;
                    let useAlpha = baseAlpha * alpha >> 8;
                    let oldUseColor = this.mState.mUseColor;
                    this.mState.mUseColor = (this.mState.mBaseColor << 8 >>> 8) | (useAlpha << 24);
                    if (oldUseColor != this.mState.mUseColor) {
                        this.invalidateSelf();
                    }
                }
                getOpacity() {
                    switch (this.mState.mUseColor >>> 24) {
                        case 255:
                            return graphics.PixelFormat.OPAQUE;
                        case 0:
                            return graphics.PixelFormat.TRANSPARENT;
                    }
                    return graphics.PixelFormat.TRANSLUCENT;
                }
                getConstantState() {
                    return this.mState;
                }
            }
            drawable.ColorDrawable = ColorDrawable;
            class ColorState {
                constructor(state) {
                    this.mBaseColor = 0;
                    this.mUseColor = 0;
                    if (state != null) {
                        this.mBaseColor = state.mBaseColor;
                        this.mUseColor = state.mUseColor;
                    }
                }
                newDrawable() {
                    let c = new ColorDrawable();
                    c._setStateCopyFrom(this);
                    return c;
                }
            }
        })(drawable = graphics.drawable || (graphics.drawable = {}));
    })(graphics = android.graphics || (android.graphics = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/30.
 */
///<reference path="Drawable.ts"/>
///<reference path="../Canvas.ts"/>
var android;
(function (android) {
    var graphics;
    (function (graphics) {
        var drawable;
        (function (drawable) {
            var Drawable = android.graphics.drawable.Drawable;
            class ScrollBarDrawable extends Drawable {
                constructor(...args) {
                    super(...args);
                    this.mRange = 0;
                    this.mOffset = 0;
                    this.mExtent = 0;
                    this.mVertical = false;
                    this.mChanged = false;
                    this.mRangeChanged = false;
                    this.mTempBounds = new graphics.Rect();
                    this.mAlwaysDrawHorizontalTrack = false;
                    this.mAlwaysDrawVerticalTrack = false;
                }
                setAlwaysDrawHorizontalTrack(alwaysDrawTrack) {
                    this.mAlwaysDrawHorizontalTrack = alwaysDrawTrack;
                }
                setAlwaysDrawVerticalTrack(alwaysDrawTrack) {
                    this.mAlwaysDrawVerticalTrack = alwaysDrawTrack;
                }
                getAlwaysDrawVerticalTrack() {
                    return this.mAlwaysDrawVerticalTrack;
                }
                getAlwaysDrawHorizontalTrack() {
                    return this.mAlwaysDrawHorizontalTrack;
                }
                setParameters(range, offset, extent, vertical) {
                    if (this.mVertical != vertical) {
                        this.mChanged = true;
                    }
                    if (this.mRange != range || this.mOffset != offset || this.mExtent != extent) {
                        this.mRangeChanged = true;
                    }
                    this.mRange = range;
                    this.mOffset = offset;
                    this.mExtent = extent;
                    this.mVertical = vertical;
                }
                draw(canvas) {
                    const vertical = this.mVertical;
                    const extent = this.mExtent;
                    const range = this.mRange;
                    let drawTrack = true;
                    let drawThumb = true;
                    if (extent <= 0 || range <= extent) {
                        drawTrack = vertical ? this.mAlwaysDrawVerticalTrack : this.mAlwaysDrawHorizontalTrack;
                        drawThumb = false;
                    }
                    let r = this.getBounds();
                    if (drawTrack) {
                        this.drawTrack(canvas, r, vertical);
                    }
                    if (drawThumb) {
                        let size = vertical ? r.height() : r.width();
                        let thickness = vertical ? r.width() : r.height();
                        let length = Math.round(size * extent / range);
                        let offset = Math.round((size - length) * this.mOffset / (range - extent));
                        let minLength = thickness * 2;
                        if (length < minLength) {
                            length = minLength;
                        }
                        if (offset + length > size) {
                            offset = size - length;
                        }
                        this.drawThumb(canvas, r, offset, length, vertical);
                    }
                }
                onBoundsChange(bounds) {
                    super.onBoundsChange(bounds);
                    this.mChanged = true;
                }
                drawTrack(canvas, bounds, vertical) {
                    let track;
                    if (vertical) {
                        track = this.mVerticalTrack;
                    }
                    else {
                        track = this.mHorizontalTrack;
                    }
                    if (track != null) {
                        if (this.mChanged) {
                            track.setBounds(bounds);
                        }
                        track.draw(canvas);
                    }
                }
                drawThumb(canvas, bounds, offset, length, vertical) {
                    const thumbRect = this.mTempBounds;
                    const changed = this.mRangeChanged || this.mChanged;
                    if (changed) {
                        if (vertical) {
                            thumbRect.set(bounds.left, bounds.top + offset, bounds.right, bounds.top + offset + length);
                        }
                        else {
                            thumbRect.set(bounds.left + offset, bounds.top, bounds.left + offset + length, bounds.bottom);
                        }
                    }
                    if (vertical) {
                        const thumb = this.mVerticalThumb;
                        if (changed)
                            thumb.setBounds(thumbRect);
                        thumb.draw(canvas);
                    }
                    else {
                        const thumb = this.mHorizontalThumb;
                        if (changed)
                            thumb.setBounds(thumbRect);
                        thumb.draw(canvas);
                    }
                }
                setVerticalThumbDrawable(thumb) {
                    if (thumb != null) {
                        this.mVerticalThumb = thumb;
                    }
                }
                setVerticalTrackDrawable(track) {
                    this.mVerticalTrack = track;
                }
                setHorizontalThumbDrawable(thumb) {
                    if (thumb != null) {
                        this.mHorizontalThumb = thumb;
                    }
                }
                setHorizontalTrackDrawable(track) {
                    this.mHorizontalTrack = track;
                }
                getSize(vertical) {
                    if (vertical) {
                        return (this.mVerticalTrack != null ?
                            this.mVerticalTrack : this.mVerticalThumb).getIntrinsicWidth();
                    }
                    else {
                        return (this.mHorizontalTrack != null ?
                            this.mHorizontalTrack : this.mHorizontalThumb).getIntrinsicHeight();
                    }
                }
                setAlpha(alpha) {
                    if (this.mVerticalTrack != null) {
                        this.mVerticalTrack.setAlpha(alpha);
                    }
                    this.mVerticalThumb.setAlpha(alpha);
                    if (this.mHorizontalTrack != null) {
                        this.mHorizontalTrack.setAlpha(alpha);
                    }
                    this.mHorizontalThumb.setAlpha(alpha);
                }
                getAlpha() {
                    return this.mVerticalThumb.getAlpha();
                }
                getOpacity() {
                    return graphics.PixelFormat.TRANSLUCENT;
                }
                toString() {
                    return "ScrollBarDrawable: range=" + this.mRange + " offset=" + this.mOffset +
                        " extent=" + this.mExtent + (this.mVertical ? " V" : " H");
                }
            }
            drawable.ScrollBarDrawable = ScrollBarDrawable;
        })(drawable = graphics.drawable || (graphics.drawable = {}));
    })(graphics = android.graphics || (android.graphics = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/11/2.
 */
///<reference path="Drawable.ts"/>
///<reference path="../Canvas.ts"/>
var android;
(function (android) {
    var graphics;
    (function (graphics) {
        var drawable;
        (function (drawable_1) {
            class InsetDrawable extends drawable_1.Drawable {
                constructor(drawable, insetLeft, insetTop = insetLeft, insetRight = insetTop, insetBottom = insetRight) {
                    super();
                    this.mTmpRect = new graphics.Rect();
                    this.mMutated = false;
                    this.mInsetState = new InsetState(null, this);
                    this.mInsetState.mDrawable = drawable;
                    this.mInsetState.mInsetLeft = insetLeft;
                    this.mInsetState.mInsetTop = insetTop;
                    this.mInsetState.mInsetRight = insetRight;
                    this.mInsetState.mInsetBottom = insetBottom;
                    if (drawable != null) {
                        drawable.setCallback(this);
                    }
                }
                invalidateDrawable(who) {
                    const callback = this.getCallback();
                    if (callback != null) {
                        callback.invalidateDrawable(this);
                    }
                }
                scheduleDrawable(who, what, when) {
                    const callback = this.getCallback();
                    if (callback != null) {
                        callback.scheduleDrawable(this, what, when);
                    }
                }
                unscheduleDrawable(who, what) {
                    const callback = this.getCallback();
                    if (callback != null) {
                        callback.unscheduleDrawable(this, what);
                    }
                }
                draw(canvas) {
                    this.mInsetState.mDrawable.draw(canvas);
                }
                getPadding(padding) {
                    let pad = this.mInsetState.mDrawable.getPadding(padding);
                    padding.left += this.mInsetState.mInsetLeft;
                    padding.right += this.mInsetState.mInsetRight;
                    padding.top += this.mInsetState.mInsetTop;
                    padding.bottom += this.mInsetState.mInsetBottom;
                    if (pad || (this.mInsetState.mInsetLeft | this.mInsetState.mInsetRight |
                        this.mInsetState.mInsetTop | this.mInsetState.mInsetBottom) != 0) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                setVisible(visible, restart) {
                    this.mInsetState.mDrawable.setVisible(visible, restart);
                    return super.setVisible(visible, restart);
                }
                setAlpha(alpha) {
                    this.mInsetState.mDrawable.setAlpha(alpha);
                }
                getAlpha() {
                    return this.mInsetState.mDrawable.getAlpha();
                }
                getOpacity() {
                    return this.mInsetState.mDrawable.getOpacity();
                }
                isStateful() {
                    return this.mInsetState.mDrawable.isStateful();
                }
                onStateChange(state) {
                    let changed = this.mInsetState.mDrawable.setState(state);
                    this.onBoundsChange(this.getBounds());
                    return changed;
                }
                onBoundsChange(bounds) {
                    const r = this.mTmpRect;
                    r.set(bounds);
                    r.left += this.mInsetState.mInsetLeft;
                    r.top += this.mInsetState.mInsetTop;
                    r.right -= this.mInsetState.mInsetRight;
                    r.bottom -= this.mInsetState.mInsetBottom;
                    this.mInsetState.mDrawable.setBounds(r.left, r.top, r.right, r.bottom);
                }
                getIntrinsicWidth() {
                    return this.mInsetState.mDrawable.getIntrinsicWidth();
                }
                getIntrinsicHeight() {
                    return this.mInsetState.mDrawable.getIntrinsicHeight();
                }
                getConstantState() {
                    if (this.mInsetState.canConstantState()) {
                        return this.mInsetState;
                    }
                    return null;
                }
                mutate() {
                    if (!this.mMutated && super.mutate() == this) {
                        this.mInsetState.mDrawable.mutate();
                        this.mMutated = true;
                    }
                    return this;
                }
                getDrawable() {
                    return this.mInsetState.mDrawable;
                }
            }
            drawable_1.InsetDrawable = InsetDrawable;
            class InsetState {
                constructor(orig, owner) {
                    this.mInsetLeft = 0;
                    this.mInsetTop = 0;
                    this.mInsetRight = 0;
                    this.mInsetBottom = 0;
                    if (orig != null) {
                        this.mDrawable = orig.mDrawable.getConstantState().newDrawable();
                        this.mDrawable.setCallback(owner);
                        this.mInsetLeft = orig.mInsetLeft;
                        this.mInsetTop = orig.mInsetTop;
                        this.mInsetRight = orig.mInsetRight;
                        this.mInsetBottom = orig.mInsetBottom;
                        this.mCheckedConstantState = this.mCanConstantState = true;
                    }
                }
                newDrawable() {
                    let drawable = new InsetDrawable(null, 0);
                    drawable.mInsetState = new InsetState(this, drawable);
                    return drawable;
                }
                canConstantState() {
                    if (!this.mCheckedConstantState) {
                        this.mCanConstantState = this.mDrawable.getConstantState() != null;
                        this.mCheckedConstantState = true;
                    }
                    return this.mCanConstantState;
                }
            }
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
var java;
(function (java) {
    var util;
    (function (util) {
        class ArrayList {
            constructor(initialCapacity = 0) {
                this.array = [];
            }
            size() {
                return this.array.length;
            }
            isEmpty() {
                return this.size() === 0;
            }
            contains(o) {
                return this.indexOf(o) >= 0;
            }
            indexOf(o) {
                return this.array.indexOf(o);
            }
            lastIndexOf(o) {
                return this.array.lastIndexOf(o);
            }
            clone() {
                let arrayList = new ArrayList();
                arrayList.array.push(...this.array);
                return arrayList;
            }
            toArray(a = new Array(this.size())) {
                let size = this.size();
                for (let i = 0; i < size; i++) {
                    a[i] = this.array[i];
                }
                return a;
            }
            get(index) {
                return this.array[index];
            }
            set(index, element) {
                let old = this.array[index];
                this.array[index] = element;
                return old;
            }
            add(...args) {
                let index, t;
                if (args.length === 1)
                    t = args[0];
                else if (args.length === 2) {
                    index = args[0];
                    t = args[1];
                }
                if (index === undefined)
                    this.array.push(t);
                else
                    this.array.splice(index, 0, t);
            }
            remove(o) {
                let index;
                if (Number.isInteger(o)) {
                    index = o;
                }
                else {
                    index = this.array.indexOf(o);
                }
                let old = this.array[index];
                this.array.splice(index, 1);
                return old;
            }
            clear() {
                this.array = [];
            }
            addAll(...args) {
                let index, list;
                if (args.length === 1) {
                    list = args[0];
                }
                else if (args.length === 2) {
                    index = args[0];
                    list = args[1];
                }
                if (index === undefined) {
                    this.array.push(...list.array);
                }
                else {
                    this.array.splice(index, 0, ...list.array);
                }
            }
            removeAll(list) {
                let oldSize = this.size();
                list.array.forEach((item) => {
                    let index = this.array.indexOf(item);
                    this.array.splice(index, 1);
                });
                return this.size() === oldSize;
            }
            [Symbol.iterator]() {
                return this.array[Symbol.iterator];
            }
            subList(fromIndex, toIndex) {
                let list = new ArrayList();
                for (var i = fromIndex; i < toIndex; i++) {
                    list.array.push(this.array[i]);
                }
                return list;
            }
            toString() {
                return this.array.toString();
            }
            sort(compareFn) {
                this.array.sort(compareFn);
            }
        }
        util.ArrayList = ArrayList;
    })(util = java.util || (java.util = {}));
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
        var CopyOnWriteArrayList = java.lang.util.concurrent.CopyOnWriteArrayList;
        var CopyOnWriteArray = android.util.CopyOnWriteArray;
        class ViewTreeObserver {
            constructor() {
                this.mAlive = true;
            }
            addOnWindowAttachListener(listener) {
                this.checkIsAlive();
                if (this.mOnWindowAttachListeners == null) {
                    this.mOnWindowAttachListeners = new CopyOnWriteArrayList();
                }
                this.mOnWindowAttachListeners.add(listener);
            }
            removeOnWindowAttachListener(victim) {
                this.checkIsAlive();
                if (this.mOnWindowAttachListeners == null) {
                    return;
                }
                this.mOnWindowAttachListeners.remove(victim);
            }
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
            addOnGlobalLayoutListener(listener) {
                this.checkIsAlive();
                if (this.mOnGlobalLayoutListeners == null) {
                    this.mOnGlobalLayoutListeners = new CopyOnWriteArray();
                }
                this.mOnGlobalLayoutListeners.add(listener);
            }
            removeGlobalOnLayoutListener(victim) {
                this.removeOnGlobalLayoutListener(victim);
            }
            removeOnGlobalLayoutListener(victim) {
                this.checkIsAlive();
                if (this.mOnGlobalLayoutListeners == null) {
                    return;
                }
                this.mOnGlobalLayoutListeners.remove(victim);
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
            addOnPreDrawListener(listener) {
                this.checkIsAlive();
                if (this.mOnPreDrawListeners == null) {
                    this.mOnPreDrawListeners = new CopyOnWriteArray();
                }
                this.mOnPreDrawListeners.add(listener);
            }
            removeOnPreDrawListener(victim) {
                this.checkIsAlive();
                if (this.mOnPreDrawListeners == null) {
                    return;
                }
                this.mOnPreDrawListeners.remove(victim);
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
            addOnScrollChangedListener(listener) {
                this.checkIsAlive();
                if (this.mOnScrollChangedListeners == null) {
                    this.mOnScrollChangedListeners = new CopyOnWriteArray();
                }
                this.mOnScrollChangedListeners.add(listener);
            }
            removeOnScrollChangedListener(victim) {
                this.checkIsAlive();
                if (this.mOnScrollChangedListeners == null) {
                    return;
                }
                this.mOnScrollChangedListeners.remove(victim);
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
            addOnDrawListener(listener) {
                this.checkIsAlive();
                if (this.mOnDrawListeners == null) {
                    this.mOnDrawListeners = new CopyOnWriteArrayList();
                }
                this.mOnDrawListeners.add(listener);
            }
            removeOnDrawListener(victim) {
                this.checkIsAlive();
                if (this.mOnDrawListeners == null) {
                    return;
                }
                this.mOnDrawListeners.remove(victim);
            }
            dispatchOnDraw() {
                if (this.mOnDrawListeners != null) {
                    for (let listener of this.mOnDrawListeners) {
                        listener.onDraw();
                    }
                }
            }
            merge(observer) {
                if (observer.mOnWindowAttachListeners != null) {
                    if (this.mOnWindowAttachListeners != null) {
                        this.mOnWindowAttachListeners.addAll(observer.mOnWindowAttachListeners);
                    }
                    else {
                        this.mOnWindowAttachListeners = observer.mOnWindowAttachListeners;
                    }
                }
                if (observer.mOnGlobalLayoutListeners != null) {
                    if (this.mOnGlobalLayoutListeners != null) {
                        this.mOnGlobalLayoutListeners.addAll(observer.mOnGlobalLayoutListeners);
                    }
                    else {
                        this.mOnGlobalLayoutListeners = observer.mOnGlobalLayoutListeners;
                    }
                }
                if (observer.mOnPreDrawListeners != null) {
                    if (this.mOnPreDrawListeners != null) {
                        this.mOnPreDrawListeners.addAll(observer.mOnPreDrawListeners);
                    }
                    else {
                        this.mOnPreDrawListeners = observer.mOnPreDrawListeners;
                    }
                }
                if (observer.mOnScrollChangedListeners != null) {
                    if (this.mOnScrollChangedListeners != null) {
                        this.mOnScrollChangedListeners.addAll(observer.mOnScrollChangedListeners);
                    }
                    else {
                        this.mOnScrollChangedListeners = observer.mOnScrollChangedListeners;
                    }
                }
                observer.kill();
            }
            checkIsAlive() {
                if (!this.mAlive) {
                    throw new Error("This ViewTreeObserver is not alive, call "
                        + "getViewTreeObserver() again");
                }
            }
            isAlive() {
                return this.mAlive;
            }
            kill() {
                this.mAlive = false;
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
                    let density = Resources.density;
                    displayMetrics.xdpi = window.screen.deviceXDPI || DisplayMetrics.DENSITY_DEFAULT;
                    displayMetrics.ydpi = window.screen.deviceYDPI || DisplayMetrics.DENSITY_DEFAULT;
                    displayMetrics.density = density;
                    displayMetrics.densityDpi = density * DisplayMetrics.DENSITY_DEFAULT;
                    displayMetrics.scaledDensity = density;
                    displayMetrics.widthPixels = window.innerWidth * density;
                    displayMetrics.heightPixels = window.innerHeight * density;
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
        ViewConfiguration.SCROLL_BAR_SIZE = 8;
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
        ViewConfiguration.OVERFLING_DISTANCE = 100;
        view.ViewConfiguration = ViewConfiguration;
    })(view = android.view || (android.view = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/6.
 */
///<reference path="../content/res/Resources.ts"/>
///<reference path="../graphics/Rect.ts"/>
///<reference path="../view/ViewConfiguration.ts"/>
var android;
(function (android) {
    var view;
    (function (view) {
        var Resources = android.content.res.Resources;
        var Rect = android.graphics.Rect;
        var ViewConfiguration = android.view.ViewConfiguration;
        class MotionEvent {
            constructor(e, action) {
                this.mAction = 0;
                this.mEdgeFlags = 0;
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
            static obtainWithAction(downTime, eventTime, action, x, y, metaState = 0) {
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
            init(event, baseAction, windowBound = new Rect()) {
                let e = event;
                let action = baseAction;
                let actionIndex = -1;
                let activeTouch = e.changedTouches[0];
                this._activeTouch = activeTouch;
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
                this.mViewRootLeft = windowBound.left;
                this.mViewRootTop = windowBound.top;
                let edgeFlag = 0;
                let unScaledX = activeTouch.pageX;
                let unScaledY = activeTouch.pageY;
                let edgeSlop = ViewConfiguration.EDGE_SLOP;
                let tempBound = new Rect();
                tempBound.set(windowBound);
                tempBound.right = tempBound.left + edgeSlop;
                if (tempBound.contains(unScaledX, unScaledY)) {
                    edgeFlag |= MotionEvent.EDGE_LEFT;
                }
                tempBound.set(windowBound);
                tempBound.bottom = tempBound.top + edgeSlop;
                if (tempBound.contains(unScaledX, unScaledY)) {
                    edgeFlag |= MotionEvent.EDGE_TOP;
                }
                tempBound.set(windowBound);
                tempBound.left = tempBound.right - edgeSlop;
                if (tempBound.contains(unScaledX, unScaledY)) {
                    edgeFlag |= MotionEvent.EDGE_RIGHT;
                }
                tempBound.set(windowBound);
                tempBound.top = tempBound.bottom - edgeSlop;
                if (tempBound.contains(unScaledX, unScaledY)) {
                    edgeFlag |= MotionEvent.EDGE_BOTTOM;
                }
                this.mEdgeFlags = edgeFlag;
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
                let density = Resources.getDisplayMetrics().density;
                return (this.mTouchingPointers[pointerIndex].pageX - this.mViewRootLeft) * density + this.mXOffset;
            }
            getY(pointerIndex = 0) {
                let density = Resources.getDisplayMetrics().density;
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
                let density = Resources.getDisplayMetrics().density;
                return (this.mTouchingPointers[0].pageX - this.mViewRootLeft) * density;
            }
            getRawY() {
                let density = Resources.getDisplayMetrics().density;
                return (this.mTouchingPointers[0].pageY - this.mViewRootTop) * density;
            }
            getHistorySize(id = this.mActivePointerId) {
                let moveHistory = MotionEvent.TouchMoveRecord.get(id);
                return moveHistory ? moveHistory.length : 0;
            }
            getHistoricalX(pointerIndex, pos) {
                let density = Resources.getDisplayMetrics().density;
                let moveHistory = MotionEvent.TouchMoveRecord.get(this.mTouchingPointers[pointerIndex].identifier);
                return (moveHistory[pos].pageX - this.mViewRootLeft) * density + this.mXOffset;
            }
            getHistoricalY(pointerIndex, pos) {
                let density = Resources.getDisplayMetrics().density;
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
            getEdgeFlags() {
                return this.mEdgeFlags;
            }
            setEdgeFlags(flags) {
                this.mEdgeFlags = flags;
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
        MotionEvent.EDGE_TOP = 0x00000001;
        MotionEvent.EDGE_BOTTOM = 0x00000002;
        MotionEvent.EDGE_LEFT = 0x00000004;
        MotionEvent.EDGE_RIGHT = 0x00000008;
        MotionEvent.ACTION_POINTER_INDEX_MASK = 0xff00;
        MotionEvent.ACTION_POINTER_INDEX_SHIFT = 8;
        MotionEvent.HistoryMaxSize = 10;
        MotionEvent.TouchMoveRecord = new Map();
        MotionEvent.IdIndexCache = new Map();
        view.MotionEvent = MotionEvent;
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
/**
 * Created by linfaxin on 15/10/29.
 */
///<reference path="../../util/SparseArray.ts"/>
///<reference path="../../../java/lang/ref/WeakReference.ts"/>
///<reference path="../../util/StateSet.ts"/>
var android;
(function (android) {
    var content;
    (function (content) {
        var res;
        (function (res) {
            var SparseArray = android.util.SparseArray;
            var StateSet = android.util.StateSet;
            var WeakReference = java.lang.ref.WeakReference;
            class ColorStateList {
                constructor(states, colors) {
                    this.mDefaultColor = 0xffff0000;
                    this.mStateSpecs = states;
                    this.mColors = colors;
                    if (states.length > 0) {
                        this.mDefaultColor = colors[0];
                        for (let i = 0; i < states.length; i++) {
                            if (states[i].length == 0) {
                                this.mDefaultColor = colors[i];
                            }
                        }
                    }
                }
                static valueOf(color) {
                    let ref = ColorStateList.sCache.get(color);
                    let csl = ref != null ? ref.get() : null;
                    if (csl != null) {
                        return csl;
                    }
                    csl = new ColorStateList(ColorStateList.EMPTY, [color]);
                    ColorStateList.sCache.put(color, new WeakReference(csl));
                    return csl;
                }
                withAlpha(alpha) {
                    let colors = new Array(this.mColors.length);
                    let len = colors.length;
                    for (let i = 0; i < len; i++) {
                        colors[i] = (this.mColors[i] & 0xFFFFFF) | (alpha << 24);
                    }
                    return new ColorStateList(this.mStateSpecs, colors);
                }
                isStateful() {
                    return this.mStateSpecs.length > 1;
                }
                getColorForState(stateSet, defaultColor) {
                    const setLength = this.mStateSpecs.length;
                    for (let i = 0; i < setLength; i++) {
                        let stateSpec = this.mStateSpecs[i];
                        if (StateSet.stateSetMatches(stateSpec, stateSet)) {
                            return this.mColors[i];
                        }
                    }
                    return defaultColor;
                }
                getDefaultColor() {
                    return this.mDefaultColor;
                }
                toString() {
                    return "ColorStateList{" +
                        "mStateSpecs=" + JSON.stringify(this.mStateSpecs) +
                        "mColors=" + JSON.stringify(this.mColors) +
                        "mDefaultColor=" + this.mDefaultColor + '}';
                }
            }
            ColorStateList.EMPTY = [[]];
            ColorStateList.sCache = new SparseArray();
            res.ColorStateList = ColorStateList;
        })(res = content.res || (content.res = {}));
    })(content = android.content || (android.content = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/27.
 */
///<reference path="DisplayMetrics.ts"/>
///<reference path="../content/res/Resources.ts"/>
var android;
(function (android) {
    var util;
    (function (util) {
        var Resources = android.content.res.Resources;
        class TypedValue {
            static initUnit() {
                this.initUnit = null;
                let temp = document.createElement('div');
                document.body.appendChild(temp);
                temp.style.height = 100 + TypedValue.COMPLEX_UNIT_PT;
                TypedValue.UNIT_SCALE_PT = temp.offsetHeight / 100;
                temp.style.height = 1 + TypedValue.COMPLEX_UNIT_IN;
                TypedValue.UNIT_SCALE_IN = temp.offsetHeight;
                temp.style.height = 100 + TypedValue.COMPLEX_UNIT_MM;
                TypedValue.UNIT_SCALE_MM = temp.offsetHeight / 100;
                temp.style.height = 10 + TypedValue.COMPLEX_UNIT_EM;
                TypedValue.UNIT_SCALE_EM = temp.offsetHeight / 10;
                temp.style.height = 10 + TypedValue.COMPLEX_UNIT_REM;
                TypedValue.UNIT_SCALE_REM = temp.offsetHeight / 10;
                document.body.removeChild(temp);
            }
            static complexToDimensionPixelSize(valueWithUnit, baseValue = 0, metrics = Resources.getDisplayMetrics()) {
                if (this.initUnit)
                    this.initUnit();
                if (valueWithUnit === undefined || valueWithUnit === null) {
                    throw Error('complexToDimensionPixelSize error: valueWithUnit is ' + valueWithUnit);
                }
                if (valueWithUnit === '' + (Number.parseInt(valueWithUnit)))
                    return Number.parseInt(valueWithUnit);
                if (typeof valueWithUnit !== 'string')
                    valueWithUnit = valueWithUnit + "";
                let scale = 1;
                if (valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_PX)) {
                    valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_PX, "");
                }
                else if (valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_DP)) {
                    valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_DP, "");
                    scale = metrics.density;
                }
                else if (valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_DIP)) {
                    valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_DIP, "");
                    scale = metrics.density;
                }
                else if (valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_SP)) {
                    valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_SP, "");
                    scale = metrics.density * TypedValue.UNIT_SCALE_SP;
                }
                else if (valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_PT)) {
                    valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_PT, "");
                    scale = TypedValue.UNIT_SCALE_PT;
                }
                else if (valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_IN)) {
                    valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_IN, "");
                    scale = TypedValue.UNIT_SCALE_IN;
                }
                else if (valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_MM)) {
                    valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_MM, "");
                    scale = TypedValue.UNIT_SCALE_MM;
                }
                else if (valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_EM)) {
                    valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_EM, "");
                    scale = TypedValue.UNIT_SCALE_EM;
                }
                else if (valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_REM)) {
                    valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_REM, "");
                    scale = TypedValue.UNIT_SCALE_REM;
                }
                else if (valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_VH)) {
                    valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_VH, "");
                    scale = metrics.heightPixels / 100;
                }
                else if (valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_VW)) {
                    valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_VW, "");
                    scale = metrics.widthPixels / 100;
                }
                else if (valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_FRACTION)) {
                    valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_FRACTION, "");
                    scale = Number.parseInt(valueWithUnit) / 100;
                    if (Number.isNaN(scale))
                        return 0;
                    valueWithUnit = baseValue;
                }
                let value = Number.parseInt(valueWithUnit);
                if (Number.isNaN(value))
                    throw Error('complexToDimensionPixelSize error: ' + valueWithUnit);
                return value * scale;
            }
        }
        TypedValue.COMPLEX_UNIT_PX = 'px';
        TypedValue.COMPLEX_UNIT_DP = 'dp';
        TypedValue.COMPLEX_UNIT_DIP = 'dip';
        TypedValue.COMPLEX_UNIT_SP = 'sp';
        TypedValue.COMPLEX_UNIT_PT = 'pt';
        TypedValue.COMPLEX_UNIT_IN = 'in';
        TypedValue.COMPLEX_UNIT_MM = 'mm';
        TypedValue.COMPLEX_UNIT_EM = 'em';
        TypedValue.COMPLEX_UNIT_REM = 'rem';
        TypedValue.COMPLEX_UNIT_VH = 'vh';
        TypedValue.COMPLEX_UNIT_VW = 'vw';
        TypedValue.COMPLEX_UNIT_FRACTION = '%';
        TypedValue.UNIT_SCALE_SP = 1;
        util.TypedValue = TypedValue;
    })(util = android.util || (android.util = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/9.
 */
///<reference path="../graphics/Rect.ts"/>
var android;
(function (android) {
    var view;
    (function (view) {
        class Gravity {
            static apply(gravity, w, h, container, outRect) {
                let xAdj = 0, yAdj = 0;
                switch (gravity & ((Gravity.AXIS_PULL_BEFORE | Gravity.AXIS_PULL_AFTER) << Gravity.AXIS_X_SHIFT)) {
                    case 0:
                        outRect.left = container.left
                            + ((container.right - container.left - w) / 2) + xAdj;
                        outRect.right = outRect.left + w;
                        if ((gravity & (Gravity.AXIS_CLIP << Gravity.AXIS_X_SHIFT))
                            == (Gravity.AXIS_CLIP << Gravity.AXIS_X_SHIFT)) {
                            if (outRect.left < container.left) {
                                outRect.left = container.left;
                            }
                            if (outRect.right > container.right) {
                                outRect.right = container.right;
                            }
                        }
                        break;
                    case Gravity.AXIS_PULL_BEFORE << Gravity.AXIS_X_SHIFT:
                        outRect.left = container.left + xAdj;
                        outRect.right = outRect.left + w;
                        if ((gravity & (Gravity.AXIS_CLIP << Gravity.AXIS_X_SHIFT))
                            == (Gravity.AXIS_CLIP << Gravity.AXIS_X_SHIFT)) {
                            if (outRect.right > container.right) {
                                outRect.right = container.right;
                            }
                        }
                        break;
                    case Gravity.AXIS_PULL_AFTER << Gravity.AXIS_X_SHIFT:
                        outRect.right = container.right - xAdj;
                        outRect.left = outRect.right - w;
                        if ((gravity & (Gravity.AXIS_CLIP << Gravity.AXIS_X_SHIFT))
                            == (Gravity.AXIS_CLIP << Gravity.AXIS_X_SHIFT)) {
                            if (outRect.left < container.left) {
                                outRect.left = container.left;
                            }
                        }
                        break;
                    default:
                        outRect.left = container.left + xAdj;
                        outRect.right = container.right + xAdj;
                        break;
                }
                switch (gravity & ((Gravity.AXIS_PULL_BEFORE | Gravity.AXIS_PULL_AFTER) << Gravity.AXIS_Y_SHIFT)) {
                    case 0:
                        outRect.top = container.top
                            + ((container.bottom - container.top - h) / 2) + yAdj;
                        outRect.bottom = outRect.top + h;
                        if ((gravity & (Gravity.AXIS_CLIP << Gravity.AXIS_Y_SHIFT))
                            == (Gravity.AXIS_CLIP << Gravity.AXIS_Y_SHIFT)) {
                            if (outRect.top < container.top) {
                                outRect.top = container.top;
                            }
                            if (outRect.bottom > container.bottom) {
                                outRect.bottom = container.bottom;
                            }
                        }
                        break;
                    case Gravity.AXIS_PULL_BEFORE << Gravity.AXIS_Y_SHIFT:
                        outRect.top = container.top + yAdj;
                        outRect.bottom = outRect.top + h;
                        if ((gravity & (Gravity.AXIS_CLIP << Gravity.AXIS_Y_SHIFT))
                            == (Gravity.AXIS_CLIP << Gravity.AXIS_Y_SHIFT)) {
                            if (outRect.bottom > container.bottom) {
                                outRect.bottom = container.bottom;
                            }
                        }
                        break;
                    case Gravity.AXIS_PULL_AFTER << Gravity.AXIS_Y_SHIFT:
                        outRect.bottom = container.bottom - yAdj;
                        outRect.top = outRect.bottom - h;
                        if ((gravity & (Gravity.AXIS_CLIP << Gravity.AXIS_Y_SHIFT))
                            == (Gravity.AXIS_CLIP << Gravity.AXIS_Y_SHIFT)) {
                            if (outRect.top < container.top) {
                                outRect.top = container.top;
                            }
                        }
                        break;
                    default:
                        outRect.top = container.top + yAdj;
                        outRect.bottom = container.bottom + yAdj;
                        break;
                }
            }
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
        Gravity.HORIZONTAL_GRAVITY_MASK = (Gravity.AXIS_SPECIFIED |
            Gravity.AXIS_PULL_BEFORE | Gravity.AXIS_PULL_AFTER) << Gravity.AXIS_X_SHIFT;
        Gravity.VERTICAL_GRAVITY_MASK = (Gravity.AXIS_SPECIFIED |
            Gravity.AXIS_PULL_BEFORE | Gravity.AXIS_PULL_AFTER) << Gravity.AXIS_Y_SHIFT;
        Gravity.DISPLAY_CLIP_VERTICAL = 0x10000000;
        Gravity.DISPLAY_CLIP_HORIZONTAL = 0x01000000;
        view.Gravity = Gravity;
    })(view = android.view || (android.view = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/11/1.
 */
///<reference path="Interpolator.ts"/>
var android;
(function (android) {
    var view;
    (function (view) {
        var animation;
        (function (animation) {
            class LinearInterpolator {
                getInterpolation(input) {
                    return input;
                }
            }
            animation.LinearInterpolator = LinearInterpolator;
        })(animation = view.animation || (view.animation = {}));
    })(view = android.view || (android.view = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/11/1.
 */
///<reference path="../../os/SystemClock.ts"/>
var android;
(function (android) {
    var view;
    (function (view) {
        var animation;
        (function (animation) {
            var SystemClock = android.os.SystemClock;
            class AnimationUtils {
                static currentAnimationTimeMillis() {
                    return SystemClock.uptimeMillis();
                }
            }
            animation.AnimationUtils = AnimationUtils;
        })(animation = view.animation || (view.animation = {}));
    })(view = android.view || (android.view = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/11/3.
 */
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/util/StateSet.ts"/>
var runtime;
(function (runtime) {
    var attr;
    (function (attr) {
        class StateAttr {
            constructor(state) {
                this.attributes = new Map();
                this.stateSpec = state.sort();
            }
            setAttr(name, value) {
                this.attributes.set(name, value);
            }
            hasAttr(name) {
                return this.attributes.has(name);
            }
            getAttrMap() {
                return this.attributes;
            }
            putAll(stateAttr) {
                for (let [key, value] of stateAttr.attributes.entries()) {
                    this.attributes.set(key, value);
                }
            }
            isStateEquals(state) {
                if (!state)
                    return false;
                return this.stateSpec + '' === state.sort() + '';
            }
            isStateMatch(state) {
                return android.util.StateSet.stateSetMatches(this.stateSpec, state);
            }
            mergeRemovedFrom(another) {
                if (!another)
                    return this.attributes;
                let removed = new Map(another.attributes);
                for (let key of this.attributes.keys())
                    removed.delete(key);
                let merge = new Map(this.attributes);
                for (let key of removed.keys())
                    merge.set(key, null);
                return merge;
            }
            static parseStateAttrName(stateDesc) {
                if (stateDesc.startsWith('android:'))
                    stateDesc = stateDesc.substring('android:'.length);
                if (stateDesc.startsWith('state_'))
                    stateDesc = stateDesc.substring('state_'.length);
                let stateSet = new Set();
                let stateParts = stateDesc.split('&');
                for (let part of stateParts) {
                    let sign = 1;
                    while (part.startsWith('!')) {
                        sign *= -1;
                        part = part.substring(1);
                    }
                    let stateValue = android.view.View['VIEW_STATE_' + part.toUpperCase()];
                    if (stateValue !== undefined) {
                        stateSet.add(stateValue * sign);
                    }
                }
                return stateSet;
            }
        }
        attr.StateAttr = StateAttr;
    })(attr = runtime.attr || (runtime.attr = {}));
})(runtime || (runtime = {}));
/**
 * Created by linfaxin on 15/11/3.
 */
///<reference path="StateAttr.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/util/StateSet.ts"/>
var runtime;
(function (runtime) {
    var attr;
    (function (attr_1) {
        class StateAttrList {
            constructor(ele, rootElement) {
                this.list = new Array(0);
                this.match_list = new Array(0);
                this.list.push(new attr_1.StateAttr([]));
                this._initStyleAttributes(ele, [], rootElement);
            }
            _initStyleAttributes(ele, inParseState, rootElement) {
                let attributes = Array.from(ele.attributes);
                attributes.forEach((attr) => {
                    if (attr.name === 'style' || attr.name === 'android:style') {
                        this._initStyleAttr(attr, ele, inParseState, rootElement);
                    }
                });
                attributes.forEach((attr) => {
                    if (attr.name === 'style' || attr.name === 'android:style') {
                        return;
                    }
                    if (attr.name.startsWith('android:state_') || attr.name.startsWith('state_')) {
                        return;
                    }
                    this._initStyleAttr(attr, ele, inParseState, rootElement);
                });
                attributes.forEach((attr) => {
                    if (attr.name.startsWith('android:state_') || attr.name.startsWith('state_')) {
                        this._initStyleAttr(attr, ele, inParseState, rootElement);
                    }
                });
                this.list_reverse = this.list.concat().reverse();
            }
            _initStyleAttr(attr, ele, inParseState, rootElement) {
                let attrName = attr.name;
                if (!attrName.startsWith('android:'))
                    return;
                attrName = attrName.substring('android:'.length);
                if (attrName === 'id')
                    return;
                let attrValue = attr.value;
                if (attrName.startsWith('state_')) {
                    let newStateSet = attr_1.StateAttr.parseStateAttrName(attrName);
                    inParseState = inParseState.concat(Array.from(newStateSet));
                    inParseState = Array.from(new Set(inParseState)).sort();
                }
                let _stateAttr = this.optStateAttr(inParseState);
                if (attrName.startsWith('state_') || attrName === 'style') {
                    if (attrValue.startsWith('@')) {
                        let reference = android.view.View.findReference(attrValue, ele, rootElement, false);
                        this._initStyleAttributes(reference, inParseState, rootElement);
                    }
                    else {
                        for (let part of attrValue.split(';')) {
                            let [name, value] = part.split(':');
                            value = value ? android.view.View.optReferenceString(value.trim(), ele, rootElement) : '';
                            if (name)
                                _stateAttr.setAttr(name.trim().toLowerCase(), value);
                        }
                    }
                }
                else {
                    attrValue = android.view.View.optReferenceString(attrValue, ele, rootElement);
                    _stateAttr.setAttr(attrName, attrValue);
                }
            }
            getDefaultStateAttr() {
                return this.getStateAttr(StateAttrList.EmptyArray);
            }
            getStateAttr(state) {
                for (let stateAttr of this.list) {
                    if (stateAttr.isStateEquals(state))
                        return stateAttr;
                }
            }
            optStateAttr(state) {
                let stateAttr = this.getStateAttr(state);
                if (!stateAttr) {
                    stateAttr = new attr_1.StateAttr(state);
                    this.list.splice(0, 0, stateAttr);
                }
                return stateAttr;
            }
            getMatchedAttr(state) {
                for (let stateAttr of this.match_list) {
                    if (stateAttr.isStateEquals(state))
                        return stateAttr;
                }
                let matchedAttr = new attr_1.StateAttr(state);
                for (let stateAttr of this.list_reverse) {
                    if (stateAttr.isStateMatch(state))
                        matchedAttr.putAll(stateAttr);
                }
                this.match_list.push(matchedAttr);
                return matchedAttr;
            }
        }
        StateAttrList.EmptyArray = [];
        attr_1.StateAttrList = StateAttrList;
    })(attr = runtime.attr || (runtime.attr = {}));
})(runtime || (runtime = {}));
var runtime;
(function (runtime) {
    var util;
    (function (util) {
        class ClassFinder {
            static findClass(classFullName, findInRoot = window) {
                let nameParts = classFullName.split('.');
                let finding = findInRoot;
                for (let part of nameParts) {
                    let quickFind = finding[part.toLowerCase()];
                    if (quickFind) {
                        finding = quickFind;
                        continue;
                    }
                    let found = false;
                    for (let key in finding) {
                        if (key.toUpperCase() === part.toUpperCase()) {
                            finding = finding[key];
                            found = true;
                            break;
                        }
                    }
                    if (!found)
                        return null;
                }
                if (finding === findInRoot) {
                    return null;
                }
                return finding;
            }
        }
        util.ClassFinder = ClassFinder;
    })(util = runtime.util || (runtime.util = {}));
})(runtime || (runtime = {}));
/**
 * Created by linfaxin on 15/9/27.
 */
///<reference path="../util/SparseArray.ts"/>
///<reference path="../util/Log.ts"/>
///<reference path="../graphics/drawable/Drawable.ts"/>
///<reference path="../graphics/drawable/ColorDrawable.ts"/>
///<reference path="../graphics/drawable/ScrollBarDrawable.ts"/>
///<reference path="../graphics/drawable/InsetDrawable.ts"/>
///<reference path="../graphics/PixelFormat.ts"/>
///<reference path="../graphics/Matrix.ts"/>
///<reference path="../graphics/Color.ts"/>
///<reference path="../graphics/Paint.ts"/>
///<reference path="../../java/lang/StringBuilder.ts"/>
///<reference path="../../java/lang/Runnable.ts"/>
///<reference path="../../java/lang/util/concurrent/CopyOnWriteArrayList.ts"/>
///<reference path="../../java/util/ArrayList.ts"/>
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
///<reference path="../content/res/ColorStateList.ts"/>
///<reference path="../graphics/Rect.ts"/>
///<reference path="../graphics/Canvas.ts"/>
///<reference path="../util/Pools.ts"/>
///<reference path="../util/TypedValue.ts"/>
///<reference path="Gravity.ts"/>
///<reference path="../view/animation/LinearInterpolator.ts"/>
///<reference path="../view/animation/AnimationUtils.ts"/>
///<reference path="../../java/lang/System.ts"/>
///<reference path="../../runtime/attr/StateAttrList.ts"/>
///<reference path="../../runtime/attr/StateAttr.ts"/>
///<reference path="../../runtime/util/ClassFinder.ts"/>
var android;
(function (android) {
    var view;
    (function (view_1) {
        var SparseArray = android.util.SparseArray;
        var ColorDrawable = android.graphics.drawable.ColorDrawable;
        var ScrollBarDrawable = android.graphics.drawable.ScrollBarDrawable;
        var InsetDrawable = android.graphics.drawable.InsetDrawable;
        var PixelFormat = android.graphics.PixelFormat;
        var Matrix = android.graphics.Matrix;
        var Color = android.graphics.Color;
        var StringBuilder = java.lang.StringBuilder;
        var System = java.lang.System;
        var SystemClock = android.os.SystemClock;
        var Log = android.util.Log;
        var Rect = android.graphics.Rect;
        var CopyOnWriteArrayList = java.lang.util.concurrent.CopyOnWriteArrayList;
        var ArrayList = java.util.ArrayList;
        var Resources = android.content.res.Resources;
        var ColorStateList = android.content.res.ColorStateList;
        var Pools = android.util.Pools;
        var TypedValue = android.util.TypedValue;
        var LinearInterpolator = android.view.animation.LinearInterpolator;
        var AnimationUtils = android.view.animation.AnimationUtils;
        var StateAttrList = runtime.attr.StateAttrList;
        var ClassFinder = runtime.util.ClassFinder;
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
                this.mCachingFailed = false;
                this.mWindowAttachCount = 0;
                this.mLastIsOpaque = false;
                this._mLeft = 0;
                this._mRight = 0;
                this._mTop = 0;
                this._mBottom = 0;
                this._mScrollX = 0;
                this._mScrollY = 0;
                this.mPaddingLeft = 0;
                this.mPaddingRight = 0;
                this.mPaddingTop = 0;
                this.mPaddingBottom = 0;
                this._attrChangeHandler = new View.AttrChangeHandler(this);
                this.mTouchSlop = view_1.ViewConfiguration.get().getScaledTouchSlop();
                this.initializeScrollbars();
            }
            get mLeft() { return this._mLeft; }
            set mLeft(value) { this._mLeft = Math.floor(value); }
            get mRight() { return this._mRight; }
            set mRight(value) { this._mRight = Math.floor(value); }
            get mTop() { return this._mTop; }
            set mTop(value) { this._mTop = Math.floor(value); }
            get mBottom() { return this._mBottom; }
            set mBottom(value) { this._mBottom = Math.floor(value); }
            get mScrollX() { return this._mScrollX; }
            set mScrollX(value) { this._mScrollX = Math.floor(value); }
            get mScrollY() { return this._mScrollY; }
            set mScrollY(value) { this._mScrollY = Math.floor(value); }
            createAttrChangeHandler(mergeHandler) {
                let view = this;
                mergeHandler.add({
                    set background(value) {
                        let bg = mergeHandler.parseDrawable(value);
                        view.setBackground(bg);
                    },
                    get background() {
                        if (view.mBackground instanceof ColorDrawable) {
                            return Color.toRGBA(view.mBackground.getColor());
                        }
                        return view.mBackground;
                    },
                    set padding(value) {
                        let [left, top, right, bottom] = View.AttrChangeHandler.parsePaddingMarginLTRB(value);
                        view._setPaddingWithUnit(left, top, right, bottom);
                    },
                    get padding() {
                        return view.mPaddingTop + ' ' + view.mPaddingRight + ' ' + view.mPaddingBottom + ' ' + view.mPaddingLeft;
                    },
                    set paddingLeft(value) {
                        view._setPaddingWithUnit(value, view.mPaddingTop, view.mPaddingRight, view.mPaddingBottom);
                    },
                    get paddingLeft() {
                        return view.mPaddingLeft;
                    },
                    set paddingTop(value) {
                        view._setPaddingWithUnit(view.mPaddingLeft, value, view.mPaddingRight, view.mPaddingBottom);
                    },
                    get paddingTop() {
                        return view.mPaddingTop;
                    },
                    set paddingRight(value) {
                        view._setPaddingWithUnit(view.mPaddingLeft, view.mPaddingTop, value, view.mPaddingBottom);
                    },
                    get paddingRight() {
                        return view.mPaddingRight;
                    },
                    set paddingBottom(value) {
                        view._setPaddingWithUnit(view.mPaddingLeft, view.mPaddingTop, view.mPaddingRight, value);
                    },
                    get paddingBottom() {
                        return view.mPaddingBottom;
                    },
                    set scrollX(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value))
                            view.scrollTo(value, view.mScrollY);
                    },
                    set scrollY(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value))
                            view.scrollTo(view.mScrollX, value);
                    },
                    set alpha(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value)) {
                        }
                        ;
                    },
                    set transformPivotX(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value)) {
                        }
                        ;
                    },
                    set transformPivotY(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value)) {
                        }
                        ;
                    },
                    set translationX(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value)) {
                        }
                        ;
                    },
                    set translationY(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value)) {
                        }
                        ;
                    },
                    set rotation(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value)) {
                        }
                        ;
                    },
                    set rotationX(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value)) {
                        }
                        ;
                    },
                    set rotationY(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value)) {
                        }
                        ;
                    },
                    set scaleX(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value)) {
                        }
                        ;
                    },
                    set scaleY(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value)) {
                        }
                        ;
                    },
                    set tag(value) {
                    },
                    set id(value) {
                        view.bindElement.id = value;
                    },
                    set focusable(value) {
                        if (View.AttrChangeHandler.parseBoolean(value, false)) {
                            view.setFlags(View.FOCUSABLE, View.FOCUSABLE_MASK);
                        }
                    },
                    set focusableInTouchMode(value) {
                        if (View.AttrChangeHandler.parseBoolean(value, false)) {
                            view.setFlags(View.FOCUSABLE_IN_TOUCH_MODE | View.FOCUSABLE, View.FOCUSABLE_IN_TOUCH_MODE | View.FOCUSABLE_MASK);
                        }
                    },
                    set clickable(value) {
                        if (View.AttrChangeHandler.parseBoolean(value, false)) {
                            view.setFlags(View.CLICKABLE, View.CLICKABLE);
                        }
                    },
                    set longClickable(value) {
                        if (View.AttrChangeHandler.parseBoolean(value, false)) {
                            view.setFlags(View.LONG_CLICKABLE, View.LONG_CLICKABLE);
                        }
                    },
                    set saveEnabled(value) {
                        if (View.AttrChangeHandler.parseBoolean(value, false)) {
                        }
                    },
                    set duplicateParentState(value) {
                        if (View.AttrChangeHandler.parseBoolean(value, false)) {
                            view.setFlags(View.DUPLICATE_PARENT_STATE, View.DUPLICATE_PARENT_STATE);
                        }
                    },
                    set visibility(value) {
                        if (value === 'gone')
                            view.setVisibility(View.GONE);
                        else if (value === 'invisible')
                            view.setVisibility(View.INVISIBLE);
                        else if (value === 'visible')
                            view.setVisibility(View.VISIBLE);
                    },
                    set scrollbars(value) {
                        if (value === 'none') {
                            view.setHorizontalScrollBarEnabled(false);
                            view.setVerticalScrollBarEnabled(false);
                        }
                    },
                    set isScrollContainer(value) {
                        if (View.AttrChangeHandler.parseBoolean(value, false)) {
                            this.setScrollContainer(true);
                        }
                    },
                    set minWidth(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value))
                            view.setMinimumWidth(value);
                    },
                    get minWidth() {
                        return view.mMinWidth;
                    },
                    set minHeight(value) {
                        view.mMinHeight = value;
                    },
                    get minHeight() {
                        return view.mMinHeight;
                    },
                    set onClick(value) {
                        view.setOnClickListener({
                            onClick(v) {
                                let activity = view.getViewRootImpl().rootElement;
                                if (activity && typeof activity[value] === 'function') {
                                    activity[value].call(activity, v);
                                }
                            }
                        });
                    },
                    set overScrollMode(value) {
                        let scrollMode = View[('OVER_SCROLL_' + value).toUpperCase()];
                        if (scrollMode === undefined)
                            scrollMode = View.OVER_SCROLL_IF_CONTENT_SCROLLS;
                        view.setOverScrollMode(scrollMode);
                    },
                    set layerType(value) {
                    },
                });
                mergeHandler.isCallSuper = true;
            }
            getId() {
                return this.bindElement.id;
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
            getPaddingLeft() {
                return this.mPaddingLeft;
            }
            getPaddingTop() {
                return this.mPaddingTop;
            }
            getPaddingRight() {
                return this.mPaddingRight;
            }
            getPaddingBottom() {
                return this.mPaddingBottom;
            }
            setPaddingLeft(left) {
                if (this.mPaddingLeft != left) {
                    this.mPaddingLeft = left;
                    this.requestLayout();
                }
            }
            setPaddingTop(top) {
                if (this.mPaddingTop != top) {
                    this.mPaddingTop = top;
                    this.requestLayout();
                }
            }
            setPaddingRight(right) {
                if (this.mPaddingRight != right) {
                    this.mPaddingRight = right;
                    this.requestLayout();
                }
            }
            setPaddingBottom(bottom) {
                if (this.mPaddingBottom != bottom) {
                    this.mPaddingBottom = bottom;
                    this.requestLayout();
                }
            }
            setPadding(left, top, right, bottom) {
                let changed = false;
                if (this.mPaddingLeft != left) {
                    changed = true;
                    this.mPaddingLeft = left;
                }
                if (this.mPaddingTop != top) {
                    changed = true;
                    this.mPaddingTop = top;
                }
                if (this.mPaddingRight != right) {
                    changed = true;
                    this.mPaddingRight = right;
                }
                if (this.mPaddingBottom != bottom) {
                    changed = true;
                    this.mPaddingBottom = bottom;
                }
                if (changed) {
                    this.requestLayout();
                }
            }
            _setPaddingWithUnit(left, top, right, bottom) {
                let view = this;
                let dm = Resources.getDisplayMetrics();
                let width = view.getWidth();
                let height = view.getHeight();
                let padLeft = TypedValue.complexToDimensionPixelSize(left, width, dm);
                let padTop = TypedValue.complexToDimensionPixelSize(top, height, dm);
                let padRight = TypedValue.complexToDimensionPixelSize(right, width, dm);
                let padBottom = TypedValue.complexToDimensionPixelSize(bottom, height, dm);
                view.setPadding(padLeft, padTop, padRight, padBottom);
                let unit = TypedValue.COMPLEX_UNIT_FRACTION;
                if ((typeof left === 'string' && left.endsWith(unit)) || (typeof top === 'string' && top.endsWith(unit))
                    || (typeof right === 'string' && right.endsWith(unit)) || (typeof bottom === 'string' && bottom.endsWith(unit))) {
                    view.post({
                        run: () => {
                            let width = view.getWidth();
                            let height = view.getHeight();
                            let padLeftN = TypedValue.complexToDimensionPixelSize(left, width, dm);
                            let padTopN = TypedValue.complexToDimensionPixelSize(top, height, dm);
                            let padRightN = TypedValue.complexToDimensionPixelSize(right, width, dm);
                            let padBottomN = TypedValue.complexToDimensionPixelSize(bottom, height, dm);
                            view.setPadding(padLeftN, padTopN, padRightN, padBottomN);
                        }
                    });
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
            offsetTopAndBottom(offset) {
                if (offset != 0) {
                    this.updateMatrix();
                    const matrixIsIdentity = true;
                    if (matrixIsIdentity) {
                        const p = this.mParent;
                        if (p != null && this.mAttachInfo != null) {
                            const r = this.mAttachInfo.mTmpInvalRect;
                            let minTop;
                            let maxBottom;
                            let yLoc;
                            if (offset < 0) {
                                minTop = this.mTop + offset;
                                maxBottom = this.mBottom;
                                yLoc = offset;
                            }
                            else {
                                minTop = this.mTop;
                                maxBottom = this.mBottom + offset;
                                yLoc = 0;
                            }
                            r.set(0, yLoc, this.mRight - this.mLeft, maxBottom - minTop);
                            p.invalidateChild(this, r);
                        }
                    }
                    else {
                        this.invalidateViewProperty(false, false);
                    }
                    this.mTop += offset;
                    this.mBottom += offset;
                    if (!matrixIsIdentity) {
                        this.invalidateViewProperty(false, true);
                    }
                    this.invalidateParentIfNeeded();
                }
            }
            offsetLeftAndRight(offset) {
                if (offset != 0) {
                    this.updateMatrix();
                    const matrixIsIdentity = true;
                    if (matrixIsIdentity) {
                        const p = this.mParent;
                        if (p != null && this.mAttachInfo != null) {
                            const r = this.mAttachInfo.mTmpInvalRect;
                            let minLeft;
                            let maxRight;
                            if (offset < 0) {
                                minLeft = this.mLeft + offset;
                                maxRight = this.mRight;
                            }
                            else {
                                minLeft = this.mLeft;
                                maxRight = this.mRight + offset;
                            }
                            r.set(0, 0, maxRight - minLeft, this.mBottom - this.mTop);
                            p.invalidateChild(this, r);
                        }
                    }
                    else {
                        this.invalidateViewProperty(false, false);
                    }
                    this.mLeft += offset;
                    this.mRight += offset;
                    if (!matrixIsIdentity) {
                        this.invalidateViewProperty(false, true);
                    }
                    this.invalidateParentIfNeeded();
                }
            }
            updateMatrix() {
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
                view_1.ViewRootImpl.getRunQueue().post(action);
                return true;
            }
            postDelayed(action, delayMillis) {
                let attachInfo = this.mAttachInfo;
                if (attachInfo != null) {
                    return attachInfo.mHandler.postDelayed(action, delayMillis);
                }
                view_1.ViewRootImpl.getRunQueue().postDelayed(action, delayMillis);
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
                        view_1.ViewRootImpl.getRunQueue().removeCallbacks(action);
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
                    if (this.mParent instanceof view_1.ViewGroup) {
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
            getTouchables() {
                let result = new ArrayList();
                this.addTouchables(result);
                return result;
            }
            addTouchables(views) {
                const viewFlags = this.mViewFlags;
                if (((viewFlags & View.CLICKABLE) == View.CLICKABLE || (viewFlags & View.LONG_CLICKABLE) == View.LONG_CLICKABLE)
                    && (viewFlags & View.ENABLED_MASK) == View.ENABLED) {
                    views.add(this);
                }
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
            requestFocus(direction = View.FOCUS_DOWN, previouslyFocusedRect = null) {
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
                        this.initialAwakenScrollBars();
                    }
                    else {
                        this.mPrivateFlags |= View.PFLAG_AWAKEN_SCROLL_BARS_ON_ATTACH;
                    }
                }
            }
            dispatchWindowVisibilityChanged(visibility) {
                this.onWindowVisibilityChanged(visibility);
            }
            onWindowVisibilityChanged(visibility) {
                if (visibility == View.VISIBLE) {
                    this.initialAwakenScrollBars();
                }
            }
            getWindowVisibility() {
                return this.mAttachInfo != null ? this.mAttachInfo.mWindowVisibility : View.GONE;
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
                    if (event.getAction() == view_1.MotionEvent.ACTION_UP && (this.mPrivateFlags & View.PFLAG_PRESSED) != 0) {
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
                        case view_1.MotionEvent.ACTION_UP:
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
                                            this.performClick(event);
                                        }
                                    }
                                }
                                if (this.mUnsetPressedState == null) {
                                    this.mUnsetPressedState = new UnsetPressedState(this);
                                }
                                if (prepressed) {
                                    this.postDelayed(this.mUnsetPressedState, view_1.ViewConfiguration.getPressedStateDuration());
                                }
                                else if (!this.post(this.mUnsetPressedState)) {
                                    this.mUnsetPressedState.run();
                                }
                                this.removeTapCallback();
                            }
                            break;
                        case view_1.MotionEvent.ACTION_DOWN:
                            this.mHasPerformedLongPress = false;
                            let isInScrollingContainer = this.isInScrollingContainer();
                            if (isInScrollingContainer) {
                                this.mPrivateFlags |= View.PFLAG_PREPRESSED;
                                if (this.mPendingCheckForTap == null) {
                                    this.mPendingCheckForTap = new CheckForTap(this);
                                }
                                this.postDelayed(this.mPendingCheckForTap, view_1.ViewConfiguration.getTapTimeout());
                            }
                            else {
                                this.setPressed(true);
                                this.checkForLongClick(0);
                            }
                            break;
                        case view_1.MotionEvent.ACTION_CANCEL:
                            this.setPressed(false);
                            this.removeTapCallback();
                            this.removeLongPressCallback();
                            break;
                        case view_1.MotionEvent.ACTION_MOVE:
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
                while (p != null && p instanceof view_1.ViewGroup) {
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
            getListenerInfo() {
                if (this.mListenerInfo != null) {
                    return this.mListenerInfo;
                }
                this.mListenerInfo = new View.ListenerInfo();
                return this.mListenerInfo;
            }
            addOnLayoutChangeListener(listener) {
                let li = this.getListenerInfo();
                if (li.mOnLayoutChangeListeners == null) {
                    li.mOnLayoutChangeListeners = new ArrayList();
                }
                if (!li.mOnLayoutChangeListeners.contains(listener)) {
                    li.mOnLayoutChangeListeners.add(listener);
                }
            }
            removeOnLayoutChangeListener(listener) {
                let li = this.mListenerInfo;
                if (li == null || li.mOnLayoutChangeListeners == null) {
                    return;
                }
                li.mOnLayoutChangeListeners.remove(listener);
            }
            addOnAttachStateChangeListener(listener) {
                let li = this.getListenerInfo();
                if (li.mOnAttachStateChangeListeners == null) {
                    li.mOnAttachStateChangeListeners
                        = new CopyOnWriteArrayList();
                }
                li.mOnAttachStateChangeListeners.add(listener);
            }
            removeOnAttachStateChangeListener(listener) {
                let li = this.mListenerInfo;
                if (li == null || li.mOnAttachStateChangeListeners == null) {
                    return;
                }
                li.mOnAttachStateChangeListeners.remove(listener);
            }
            setOnClickListener(l) {
                if (!this.isClickable()) {
                    this.setClickable(true);
                }
                this.getListenerInfo().mOnClickListener = l;
            }
            hasOnClickListeners() {
                let li = this.mListenerInfo;
                return (li != null && li.mOnClickListener != null);
            }
            setOnLongClickListener(l) {
                if (!this.isLongClickable()) {
                    this.setLongClickable(true);
                }
                this.getListenerInfo().mOnLongClickListener = l;
            }
            performClick(event) {
                this._sendClickToBindElement(event);
                let li = this.mListenerInfo;
                if (li != null && li.mOnClickListener != null) {
                    li.mOnClickListener.onClick(this);
                    return true;
                }
                return false;
            }
            _sendClickToBindElement(event) {
                let touch = event ? event._activeTouch : null;
                let screenX = touch ? touch.screenX : 0;
                let screenY = touch ? touch.screenY : 0;
                let clientX = touch ? touch.clientX : 0;
                let clientY = touch ? touch.clientY : 0;
                let clickEvent = document.createEvent('MouseEvents');
                clickEvent.initMouseEvent('click', false, true, window, 1, screenX, screenY, clientX, clientY, false, false, false, false, 0, null);
                clickEvent.forwardedTouchEvent = true;
                this.bindElement.dispatchEvent(clickEvent);
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
                    this.postDelayed(this.mPendingCheckForLongPress, view_1.ViewConfiguration.getLongPressTimeout() - delayOffset);
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
                const needsRefresh = pressed != ((this.mPrivateFlags & View.PFLAG_PRESSED) == View.PFLAG_PRESSED);
                if (pressed) {
                    this.mPrivateFlags |= View.PFLAG_PRESSED;
                }
                else {
                    this.mPrivateFlags &= ~View.PFLAG_PRESSED;
                }
                if (needsRefresh) {
                    this.refreshDrawableState();
                }
                this.dispatchSetPressed(pressed);
            }
            dispatchSetPressed(pressed) {
            }
            isPressed() {
                return (this.mPrivateFlags & View.PFLAG_PRESSED) == View.PFLAG_PRESSED;
            }
            setSelected(selected) {
                if (((this.mPrivateFlags & View.PFLAG_SELECTED) != 0) != selected) {
                    this.mPrivateFlags = (this.mPrivateFlags & ~View.PFLAG_SELECTED) | (selected ? View.PFLAG_SELECTED : 0);
                    if (!selected)
                        this.resetPressedState();
                    this.invalidate(true);
                    this.refreshDrawableState();
                    this.dispatchSetSelected(selected);
                }
            }
            dispatchSetSelected(selected) {
            }
            isSelected() {
                return (this.mPrivateFlags & View.PFLAG_SELECTED) != 0;
            }
            setActivated(activated) {
                if (((this.mPrivateFlags & View.PFLAG_ACTIVATED) != 0) != activated) {
                    this.mPrivateFlags = (this.mPrivateFlags & ~View.PFLAG_ACTIVATED) | (activated ? View.PFLAG_ACTIVATED : 0);
                    this.invalidate(true);
                    this.refreshDrawableState();
                    this.dispatchSetActivated(activated);
                }
            }
            dispatchSetActivated(activated) {
            }
            isActivated() {
                return (this.mPrivateFlags & View.PFLAG_ACTIVATED) != 0;
            }
            getViewTreeObserver() {
                if (this.mAttachInfo != null) {
                    return this.mAttachInfo.mTreeObserver;
                }
                if (this.mFloatingTreeObserver == null) {
                    this.mFloatingTreeObserver = new view_1.ViewTreeObserver();
                }
                return this.mFloatingTreeObserver;
            }
            isLayoutRtl() {
                return false;
            }
            getBaseline() {
                return -1;
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
                if (p instanceof view_1.ViewGroup) {
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
                        let listenersCopy = li.mOnLayoutChangeListeners.clone();
                        let numListeners = listenersCopy.size();
                        for (let i = 0; i < numListeners; ++i) {
                            listenersCopy.get(i).onLayoutChange(this, l, t, r, b, oldL, oldT, oldR, oldB);
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
                        if (this.mParent instanceof view_1.ViewGroup) {
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
                const flags = this.mViewFlags;
                if (((flags & View.SCROLLBARS_VERTICAL) == 0 && (flags & View.SCROLLBARS_HORIZONTAL) == 0)) {
                    this.mPrivateFlags |= View.PFLAG_OPAQUE_SCROLLBARS;
                }
                else {
                    this.mPrivateFlags &= ~View.PFLAG_OPAQUE_SCROLLBARS;
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
                if ((flags & view_1.ViewGroup.FLAG_CHILDREN_DRAWN_WITH_CACHE) != 0 ||
                    (flags & view_1.ViewGroup.FLAG_ALWAYS_DRAWN_WITH_CACHE) != 0) {
                    caching = true;
                }
                else {
                    caching = (layerType != View.LAYER_TYPE_NONE);
                }
                concatMatrix == concatMatrix || !childHasIdentityMatrix;
                this.mPrivateFlags |= View.PFLAG_DRAWN;
                if (!concatMatrix &&
                    (flags & (view_1.ViewGroup.FLAG_SUPPORT_STATIC_TRANSFORMATIONS |
                        view_1.ViewGroup.FLAG_CLIP_CHILDREN)) == view_1.ViewGroup.FLAG_CLIP_CHILDREN &&
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
                this.computeScroll();
                let sx = this.mScrollX;
                let sy = this.mScrollY;
                this.syncScrollToElement();
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
                if ((flags & view_1.ViewGroup.FLAG_CLIP_CHILDREN) == view_1.ViewGroup.FLAG_CLIP_CHILDREN &&
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
                        parent.mGroupFlags |= view_1.ViewGroup.FLAG_ALPHA_LOWER_THAN_ONE;
                    }
                    else if ((flags & view_1.ViewGroup.FLAG_ALPHA_LOWER_THAN_ONE) != 0) {
                        parent.mGroupFlags &= ~view_1.ViewGroup.FLAG_ALPHA_LOWER_THAN_ONE;
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
                this.onDrawScrollBars(canvas);
                if (this.mOverlay != null && !this.mOverlay.isEmpty()) {
                    this.mOverlay.getOverlayView().dispatchDraw(canvas);
                }
            }
            onDraw(canvas) {
            }
            dispatchDraw(canvas) {
            }
            onDrawScrollBars(canvas) {
                const cache = this.mScrollCache;
                if (cache != null) {
                    let state = cache.state;
                    if (state == ScrollabilityCache.OFF) {
                        return;
                    }
                    let invalidate = false;
                    if (state == ScrollabilityCache.FADING) {
                        cache._computeAlphaToScrollBar();
                        invalidate = true;
                    }
                    else {
                        cache.scrollBar.setAlpha(255);
                    }
                    const viewFlags = this.mViewFlags;
                    const drawHorizontalScrollBar = (viewFlags & View.SCROLLBARS_HORIZONTAL) == View.SCROLLBARS_HORIZONTAL;
                    const drawVerticalScrollBar = (viewFlags & View.SCROLLBARS_VERTICAL) == View.SCROLLBARS_VERTICAL
                        && !this.isVerticalScrollBarHidden();
                    if (drawVerticalScrollBar || drawHorizontalScrollBar) {
                        const width = this.mRight - this.mLeft;
                        const height = this.mBottom - this.mTop;
                        const scrollBar = cache.scrollBar;
                        const scrollX = this.mScrollX;
                        const scrollY = this.mScrollY;
                        const inside = true;
                        let left;
                        let top;
                        let right;
                        let bottom;
                        if (drawHorizontalScrollBar) {
                            let size = scrollBar.getSize(false);
                            if (size <= 0) {
                                size = cache.scrollBarSize;
                            }
                            scrollBar.setParameters(this.computeHorizontalScrollRange(), this.computeHorizontalScrollOffset(), this.computeHorizontalScrollExtent(), false);
                            const verticalScrollBarGap = drawVerticalScrollBar ?
                                this.getVerticalScrollbarWidth() : 0;
                            top = scrollY + height - size;
                            left = scrollX + (this.mPaddingLeft);
                            right = scrollX + width - -verticalScrollBarGap;
                            bottom = top + size;
                            this.onDrawHorizontalScrollBar(canvas, scrollBar, left, top, right, bottom);
                            if (invalidate) {
                                this.invalidate(left, top, right, bottom);
                            }
                        }
                        if (drawVerticalScrollBar) {
                            let size = scrollBar.getSize(true);
                            if (size <= 0) {
                                size = cache.scrollBarSize;
                            }
                            scrollBar.setParameters(this.computeVerticalScrollRange(), this.computeVerticalScrollOffset(), this.computeVerticalScrollExtent(), true);
                            left = scrollX + width - size;
                            top = scrollY + (this.mPaddingTop);
                            right = left + size;
                            bottom = scrollY + height;
                            this.onDrawVerticalScrollBar(canvas, scrollBar, left, top, right, bottom);
                            if (invalidate) {
                                this.invalidate(left, top, right, bottom);
                            }
                        }
                    }
                }
            }
            isVerticalScrollBarHidden() {
                return false;
            }
            onDrawHorizontalScrollBar(canvas, scrollBar, l, t, r, b) {
                scrollBar.setBounds(l, t, r, b);
                scrollBar.draw(canvas);
            }
            onDrawVerticalScrollBar(canvas, scrollBar, l, t, r, b) {
                scrollBar.setBounds(l, t, r, b);
                scrollBar.draw(canvas);
            }
            setDrawingCacheEnabled(enabled) {
                this.mCachingFailed = false;
                this.setFlags(enabled ? View.DRAWING_CACHE_ENABLED : 0, View.DRAWING_CACHE_ENABLED);
            }
            isDrawingCacheEnabled() {
                return (this.mViewFlags & View.DRAWING_CACHE_ENABLED) == View.DRAWING_CACHE_ENABLED;
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
                        view_1.ViewRootImpl.getRunQueue().postDelayed(what, delay);
                    }
                }
            }
            unscheduleDrawable(who, what) {
                if (this.verifyDrawable(who) && what != null) {
                    if (this.mAttachInfo != null) {
                        this.mAttachInfo.mHandler.removeCallbacks(what, who);
                    }
                    else {
                        view_1.ViewRootImpl.getRunQueue().removeCallbacks(what);
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
                this.getDrawableState();
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
                if ((this.mDrawableState != null) && ((this.mPrivateFlags & View.PFLAG_DRAWABLE_STATE_DIRTY) == 0)) {
                    return this.mDrawableState;
                }
                else {
                    let oldDrawableState = this.mDrawableState;
                    this.mDrawableState = this.onCreateDrawableState(0);
                    this.mPrivateFlags &= ~View.PFLAG_DRAWABLE_STATE_DIRTY;
                    this._fireStateChangeToAttribute(oldDrawableState, this.mDrawableState);
                    return this.mDrawableState;
                }
            }
            onCreateDrawableState(extraSpace) {
                if ((this.mViewFlags & View.DUPLICATE_PARENT_STATE) == View.DUPLICATE_PARENT_STATE &&
                    this.mParent instanceof View) {
                    return this.mParent.onCreateDrawableState(extraSpace);
                }
                let drawableState;
                let privateFlags = this.mPrivateFlags;
                let viewStateIndex = 0;
                if ((privateFlags & View.PFLAG_PRESSED) != 0)
                    viewStateIndex |= View.VIEW_STATE_PRESSED;
                if ((this.mViewFlags & View.ENABLED_MASK) == View.ENABLED)
                    viewStateIndex |= View.VIEW_STATE_ENABLED;
                if (this.isFocused())
                    viewStateIndex |= View.VIEW_STATE_FOCUSED;
                if ((privateFlags & View.PFLAG_SELECTED) != 0)
                    viewStateIndex |= View.VIEW_STATE_SELECTED;
                if ((privateFlags & View.PFLAG_ACTIVATED) != 0)
                    viewStateIndex |= View.VIEW_STATE_ACTIVATED;
                const privateFlags2 = this.mPrivateFlags2;
                drawableState = View.VIEW_STATE_SETS[viewStateIndex];
                if (extraSpace == 0) {
                    return drawableState;
                }
                let fullState;
                if (drawableState != null) {
                    fullState = new Array(drawableState.length + extraSpace);
                    System.arraycopy(drawableState, 0, fullState, 0, drawableState.length);
                }
                else {
                    fullState = new Array(extraSpace);
                }
                return fullState;
            }
            static mergeDrawableStates(baseState, additionalState) {
                const N = baseState.length;
                let i = N - 1;
                while (i >= 0 && baseState[i] == 0) {
                    i--;
                }
                System.arraycopy(additionalState, 0, baseState, i + 1, additionalState.length);
                return baseState;
            }
            jumpDrawablesToCurrentState() {
                if (this.mBackground != null) {
                    this.mBackground.jumpToCurrentState();
                }
            }
            setBackgroundColor(color) {
                if (this.mBackground instanceof ColorDrawable) {
                    this.mBackground.mutate().setColor(color);
                    this.computeOpaqueFlags();
                }
                else {
                    this.setBackground(new ColorDrawable(color));
                }
            }
            setBackground(background) {
                this.setBackgroundDrawable(background);
            }
            setBackgroundDrawable(background) {
                this.computeOpaqueFlags();
                if (background == this.mBackground) {
                    return;
                }
                let requestLayout = false;
                if (this.mBackground != null) {
                    this.mBackground.setCallback(null);
                    this.unscheduleDrawable(this.mBackground);
                }
                if (background != null) {
                    let padding = new Rect();
                    if (background.getPadding(padding)) {
                        this.setPadding(padding.left, padding.top, padding.right, padding.bottom);
                    }
                    if (this.mBackground == null || this.mBackground.getMinimumHeight() != background.getMinimumHeight() ||
                        this.mBackground.getMinimumWidth() != background.getMinimumWidth()) {
                        requestLayout = true;
                    }
                    background.setCallback(this);
                    if (background.isStateful()) {
                        background.setState(this.getDrawableState());
                    }
                    background.setVisible(this.getVisibility() == View.VISIBLE, false);
                    this.mBackground = background;
                    if ((this.mPrivateFlags & View.PFLAG_SKIP_DRAW) != 0) {
                        this.mPrivateFlags &= ~View.PFLAG_SKIP_DRAW;
                        this.mPrivateFlags |= View.PFLAG_ONLY_DRAWS_BACKGROUND;
                        requestLayout = true;
                    }
                }
                else {
                    this.mBackground = null;
                    if ((this.mPrivateFlags & View.PFLAG_ONLY_DRAWS_BACKGROUND) != 0) {
                        this.mPrivateFlags &= ~View.PFLAG_ONLY_DRAWS_BACKGROUND;
                        this.mPrivateFlags |= View.PFLAG_SKIP_DRAW;
                    }
                    requestLayout = true;
                }
                this.computeOpaqueFlags();
                if (requestLayout) {
                    this.requestLayout();
                }
                this.mBackgroundSizeChanged = true;
                this.invalidate(true);
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
            initialAwakenScrollBars() {
                return this.mScrollCache != null &&
                    this.awakenScrollBars(this.mScrollCache.scrollBarDefaultDelayBeforeFade * 4, true);
            }
            awakenScrollBars(startDelay = this.mScrollCache.scrollBarDefaultDelayBeforeFade, invalidate = true) {
                const scrollCache = this.mScrollCache;
                if (scrollCache == null || !scrollCache.fadeScrollBars) {
                    return false;
                }
                if (scrollCache.scrollBar == null) {
                    scrollCache.scrollBar = new ScrollBarDrawable();
                }
                if (this.isHorizontalScrollBarEnabled() || this.isVerticalScrollBarEnabled()) {
                    if (invalidate) {
                        this.postInvalidateOnAnimation();
                    }
                    if (scrollCache.state == ScrollabilityCache.OFF) {
                        const KEY_REPEAT_FIRST_DELAY = 750;
                        startDelay = Math.max(KEY_REPEAT_FIRST_DELAY, startDelay);
                    }
                    let fadeStartTime = AnimationUtils.currentAnimationTimeMillis() + startDelay;
                    scrollCache.fadeStartTime = fadeStartTime;
                    scrollCache.state = ScrollabilityCache.ON;
                    if (this.mAttachInfo != null) {
                        this.mAttachInfo.mHandler.removeCallbacks(scrollCache);
                        this.mAttachInfo.mHandler.postAtTime(scrollCache, fadeStartTime);
                    }
                    return true;
                }
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
                let cache = this.mScrollCache;
                if (cache != null) {
                    let scrollBar = cache.scrollBar;
                    if (scrollBar != null) {
                        let size = scrollBar.getSize(true);
                        if (size <= 0) {
                            size = cache.scrollBarSize;
                        }
                        return size;
                    }
                    return 0;
                }
                return 0;
            }
            getHorizontalScrollbarHeight() {
                let cache = this.mScrollCache;
                if (cache != null) {
                    let scrollBar = cache.scrollBar;
                    if (scrollBar != null) {
                        let size = scrollBar.getSize(false);
                        if (size <= 0) {
                            size = cache.scrollBarSize;
                        }
                        return size;
                    }
                    return 0;
                }
                return 0;
            }
            initializeScrollbars() {
                this.initScrollCache();
                const scrollabilityCache = this.mScrollCache;
                if (scrollabilityCache.scrollBar == null) {
                    scrollabilityCache.scrollBar = new ScrollBarDrawable();
                }
                scrollabilityCache.fadeScrollBars = true;
                let track = null;
                scrollabilityCache.scrollBar.setHorizontalTrackDrawable(track);
                let thumbColor = new ColorDrawable(Color.parseColor('#aaaaaa'));
                let thumb = new InsetDrawable(thumbColor, 0, 0, view_1.ViewConfiguration.get().getScaledScrollBarSize() / 2, 0);
                scrollabilityCache.scrollBar.setHorizontalThumbDrawable(thumb);
                scrollabilityCache.scrollBar.setVerticalTrackDrawable(track);
                scrollabilityCache.scrollBar.setVerticalThumbDrawable(thumb);
            }
            initScrollCache() {
                if (this.mScrollCache == null) {
                    this.mScrollCache = new ScrollabilityCache(this);
                }
            }
            getScrollCache() {
                this.initScrollCache();
                return this.mScrollCache;
            }
            isHorizontalScrollBarEnabled() {
                return (this.mViewFlags & View.SCROLLBARS_HORIZONTAL) == View.SCROLLBARS_HORIZONTAL;
            }
            setHorizontalScrollBarEnabled(horizontalScrollBarEnabled) {
                if (this.isHorizontalScrollBarEnabled() != horizontalScrollBarEnabled) {
                    this.mViewFlags ^= View.SCROLLBARS_HORIZONTAL;
                    this.computeOpaqueFlags();
                }
            }
            isVerticalScrollBarEnabled() {
                return (this.mViewFlags & View.SCROLLBARS_VERTICAL) == View.SCROLLBARS_VERTICAL;
            }
            setVerticalScrollBarEnabled(verticalScrollBarEnabled) {
                if (this.isVerticalScrollBarEnabled() != verticalScrollBarEnabled) {
                    this.mViewFlags ^= View.SCROLLBARS_VERTICAL;
                    this.computeOpaqueFlags();
                }
            }
            setScrollbarFadingEnabled(fadeScrollbars) {
                this.initScrollCache();
                const scrollabilityCache = this.mScrollCache;
                scrollabilityCache.fadeScrollBars = fadeScrollbars;
                if (fadeScrollbars) {
                    scrollabilityCache.state = ScrollabilityCache.OFF;
                }
                else {
                    scrollabilityCache.state = ScrollabilityCache.ON;
                }
            }
            isScrollbarFadingEnabled() {
                return this.mScrollCache != null && this.mScrollCache.fadeScrollBars;
            }
            getScrollBarDefaultDelayBeforeFade() {
                return this.mScrollCache == null ? view_1.ViewConfiguration.getScrollDefaultDelay() :
                    this.mScrollCache.scrollBarDefaultDelayBeforeFade;
            }
            setScrollBarDefaultDelayBeforeFade(scrollBarDefaultDelayBeforeFade) {
                this.getScrollCache().scrollBarDefaultDelayBeforeFade = scrollBarDefaultDelayBeforeFade;
            }
            getScrollBarFadeDuration() {
                return this.mScrollCache == null ? view_1.ViewConfiguration.getScrollBarFadeDuration() :
                    this.mScrollCache.scrollBarFadeDuration;
            }
            setScrollBarFadeDuration(scrollBarFadeDuration) {
                this.getScrollCache().scrollBarFadeDuration = scrollBarFadeDuration;
            }
            getScrollBarSize() {
                return this.mScrollCache == null ? view_1.ViewConfiguration.get().getScaledScrollBarSize() :
                    this.mScrollCache.scrollBarSize;
            }
            setScrollBarSize(scrollBarSize) {
                this.getScrollCache().scrollBarSize = scrollBarSize;
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
            isAttachedToWindow() {
                return this.mAttachInfo != null;
            }
            dispatchAttachedToWindow(info, visibility) {
                this.mAttachInfo = info;
                if (this.mOverlay != null) {
                    this.mOverlay.getOverlayView().dispatchAttachedToWindow(info, visibility);
                }
                this.mWindowAttachCount++;
                this.mPrivateFlags |= View.PFLAG_DRAWABLE_STATE_DIRTY;
                if (this.mFloatingTreeObserver != null) {
                    info.mTreeObserver.merge(this.mFloatingTreeObserver);
                    this.mFloatingTreeObserver = null;
                }
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
                let vis = info.mWindowVisibility;
                if (vis != View.GONE) {
                    this.onWindowVisibilityChanged(vis);
                }
                if ((this.mPrivateFlags & View.PFLAG_DRAWABLE_STATE_DIRTY) != 0) {
                    this.refreshDrawableState();
                }
            }
            onAttachedToWindow() {
                //if ((this.mPrivateFlags & View.PFLAG_REQUEST_TRANSPARENT_REGIONS) != 0) {
                //    this.mParent.requestTransparentRegion(this);
                //}
                if ((this.mPrivateFlags & View.PFLAG_AWAKEN_SCROLL_BARS_ON_ATTACH) != 0) {
                    this.initialAwakenScrollBars();
                    this.mPrivateFlags &= ~View.PFLAG_AWAKEN_SCROLL_BARS_ON_ATTACH;
                }
                this.mPrivateFlags3 &= ~View.PFLAG3_IS_LAID_OUT;
                this.jumpDrawablesToCurrentState();
            }
            dispatchDetachedFromWindow() {
                let info = this.mAttachInfo;
                if (info != null) {
                    let vis = info.mWindowVisibility;
                    if (vis != View.GONE) {
                        this.onWindowVisibilityChanged(View.GONE);
                    }
                }
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
                this.destroyDrawingCache();
                this.cleanupDraw();
            }
            cleanupDraw() {
                if (this.mAttachInfo != null) {
                    this.mAttachInfo.mViewRootImpl.cancelInvalidate(this);
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
                if (id == this.bindElement.id) {
                    return this;
                }
                let bindEle = this.bindElement.querySelector('#' + id);
                return bindEle ? bindEle[View.AndroidViewProperty] : null;
            }
            static inflate(domtree, rootElement = domtree, viewParent) {
                let className = domtree.tagName;
                if (className.toLowerCase() === 'android-layout') {
                    let child = domtree.firstElementChild;
                    if (child)
                        return View.inflate(child, rootElement, viewParent);
                    return null;
                }
                if (className.startsWith('ANDROID-')) {
                    className = className.substring('ANDROID-'.length);
                }
                let rootViewClass = ClassFinder.findClass(className, android.view);
                if (!rootViewClass)
                    rootViewClass = ClassFinder.findClass(className, android.widget);
                if (!rootViewClass)
                    rootViewClass = ClassFinder.findClass(className);
                if (!rootViewClass) {
                    console.warn('not find class ' + className);
                    return null;
                }
                let rootView = new rootViewClass();
                rootView.initBindElement(domtree, rootElement);
                let params;
                if (viewParent) {
                    params = viewParent.generateDefaultLayoutParams();
                    this._generateLayoutParamsFromAttribute(domtree, params);
                }
                else {
                    params = this._generateLayoutParamsFromAttribute(domtree);
                }
                rootView.setLayoutParams(params);
                rootView._initAttrObserver();
                if (rootView instanceof view_1.ViewGroup) {
                    Array.from(domtree.children).forEach((item) => {
                        if (item instanceof HTMLElement) {
                            let view = View.inflate(item, rootElement, rootView);
                            if (view)
                                rootView.addView(view);
                        }
                    });
                }
                rootView.onFinishInflate();
                return rootView;
            }
            static optReferenceString(refString, currentElement = document, rootElement = document) {
                return View.findReferenceString(refString, currentElement, rootElement) || refString;
            }
            static findReferenceString(refString, currentElement = document, rootElement = document) {
                if (!refString.startsWith('@'))
                    return null;
                let referenceArray = [];
                let attrValue = refString;
                while (attrValue && attrValue.startsWith('@')) {
                    let reference = View.findReference(attrValue, currentElement, rootElement, false);
                    if (referenceArray.indexOf(reference) >= 0)
                        throw Error('findReference Error: circle reference');
                    referenceArray.push(reference);
                    attrValue = reference.innerText;
                }
                return attrValue;
            }
            static findReference(refString, currentElement = document, rootElement = document, cloneNode = true) {
                if (refString && refString.startsWith('@')) {
                    let [tagName, ...refIds] = refString.split('/');
                    tagName = tagName.substring(1);
                    if (!refIds || refIds.length === 0)
                        return null;
                    if (!tagName.startsWith('android-'))
                        tagName = 'android-' + tagName;
                    let q = 'resources ' + tagName + '#' + refIds.join(' #');
                    let el = currentElement.querySelector(q) || rootElement.querySelector(q) || document.querySelector(q);
                    return cloneNode ? el.cloneNode(true) : el;
                }
                return null;
            }
            get bindElement() {
                if (!this._bindElement)
                    this.initBindElement();
                return this._bindElement;
            }
            get rootElement() {
                if (this._rootElement)
                    return this._rootElement;
                if (this.getViewRootImpl())
                    return this.getViewRootImpl().rootElement;
                return null;
            }
            _AttrObserverCallBack(arr, observer) {
                arr.forEach((record) => {
                    let target = record.target;
                    let androidView = target[View.AndroidViewProperty];
                    if (!androidView)
                        return;
                    let attrName = record.attributeName;
                    let newValue = target.getAttribute(attrName);
                    let oldValue = record.oldValue;
                    if (newValue === oldValue)
                        return;
                    androidView.onBindElementAttributeChanged(attrName, record.oldValue, newValue);
                });
            }
            initBindElement(bindElement, rootElement) {
                if (this._bindElement)
                    this._bindElement[View.AndroidViewProperty] = null;
                this._bindElement = bindElement || document.createElement(this.tagName());
                let oldBindView = this._bindElement[View.AndroidViewProperty];
                if (oldBindView) {
                    if (oldBindView._AttrObserver)
                        oldBindView._AttrObserver.disconnect();
                }
                this._bindElement[View.AndroidViewProperty] = this;
                this._rootElement = rootElement;
                this._stateAttrList = new StateAttrList(this.bindElement, rootElement);
                this._initAttrChangeHandler();
                this._initBindElementDefaultAttribute();
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
            syncScrollToElement() {
                let sx = this.mScrollX;
                let sy = this.mScrollY;
                if (this instanceof view_1.ViewGroup) {
                    let group = this;
                    for (let i = 0, count = group.getChildCount(); i < count; i++) {
                        let child = group.getChildAt(i);
                        let item = child.bindElement;
                        if (sx !== 0)
                            item.style.left = (child.mLeft - sx) + 'px';
                        else
                            item.style.left = child.mLeft + "px";
                        if (sy !== 0)
                            item.style.top = (child.mTop - sy) + 'px';
                        else
                            item.style.top = child.mTop + "px";
                    }
                }
            }
            _initAttrChangeHandler() {
                this.createAttrChangeHandler(this._attrChangeHandler);
                if (!this._attrChangeHandler.isCallSuper) {
                    throw Error('must call super when override createAttrChangeHandler!');
                }
            }
            _initAttrObserver() {
                this._fireInitBindElementAttribute();
                if (!this._AttrObserver)
                    this._AttrObserver = new MutationObserver(this._AttrObserverCallBack);
                else
                    this._AttrObserver.disconnect();
                this._AttrObserver.observe(this._bindElement, { attributes: true, attributeOldValue: true });
            }
            _initBindElementDefaultAttribute() {
                for (let [key, value] of this._stateAttrList.getDefaultStateAttr().getAttrMap().entries()) {
                    key = 'android:' + key;
                    if ((value === null || value === undefined) && this.bindElement.hasAttribute(key)) {
                        this.bindElement.removeAttribute(key);
                    }
                    else {
                        this.bindElement.setAttribute(key, value);
                    }
                }
                let id = this.bindElement.getAttribute('android:id');
                if (id)
                    this.bindElement.id = id;
            }
            _fireInitBindElementAttribute() {
                for (let attr of Array.from(this.bindElement.attributes)) {
                    this.onBindElementAttributeChanged(attr.name, null, attr.value);
                }
            }
            _fireStateChangeToAttribute(oldState, newState) {
                if (!this._stateAttrList)
                    return;
                if (oldState + '' === newState + '')
                    return;
                let oldMatchedAttr = oldState ? this._stateAttrList.getMatchedAttr(oldState) : null;
                let matchedAttr = this._stateAttrList.getMatchedAttr(newState);
                let attrMap = matchedAttr.mergeRemovedFrom(oldMatchedAttr);
                for (let [key, value] of attrMap.entries()) {
                    if (oldMatchedAttr) {
                        let oldValue;
                        if (key.startsWith('layout_')) {
                            let params = this.getLayoutParams();
                            if (params) {
                                let attrName = key.substring('layout_'.length);
                                oldValue = params._attrChangeHandler.getViewAttrValue(attrName);
                            }
                        }
                        else {
                            oldValue = this._attrChangeHandler.getViewAttrValue(key);
                        }
                        if (oldValue != null) {
                            oldMatchedAttr.setAttr(key, oldValue);
                        }
                    }
                    key = 'android:' + key;
                    if ((value === null || value === undefined)) {
                        if (this.bindElement.hasAttribute(key)) {
                            this.bindElement.removeAttribute(key);
                        }
                        else {
                            this.onBindElementAttributeChanged(key, null, null);
                        }
                    }
                    else {
                        this.bindElement.setAttribute(key, value);
                    }
                }
            }
            onBindElementAttributeChanged(attributeName, oldVal, newVal) {
                let parts = attributeName.split(":");
                let attrName = parts[parts.length - 1].toLowerCase();
                if (newVal === 'true')
                    newVal = true;
                else if (newVal === 'false')
                    newVal = false;
                if (attrName.startsWith('layout_')) {
                    attrName = attrName.substring('layout_'.length);
                    let params = this.getLayoutParams();
                    if (params) {
                        params._attrChangeHandler.handle(attrName, newVal);
                    }
                    this.requestLayout();
                    return;
                }
                this._attrChangeHandler.handle(attrName, newVal);
            }
            static _generateLayoutParamsFromAttribute(node, dest = new view_1.ViewGroup.LayoutParams(-2, -2)) {
                Array.from(node.attributes).forEach((attr) => {
                    let layoutParamFiled = attr.name.split("layout_")[1];
                    dest._attrChangeHandler.handle(layoutParamFiled, attr.value);
                });
                return dest;
            }
            tagName() {
                return "ANDROID-" + this.constructor.name;
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
        View.SCROLLBARS_NONE = 0x00000000;
        View.SCROLLBARS_HORIZONTAL = 0x00000100;
        View.SCROLLBARS_VERTICAL = 0x00000200;
        View.SCROLLBARS_MASK = 0x00000300;
        View.FOCUSABLES_ALL = 0x00000000;
        View.FOCUSABLES_TOUCH_MODE = 0x00000001;
        View.FOCUS_BACKWARD = 0x00000001;
        View.FOCUS_FORWARD = 0x00000002;
        View.FOCUS_LEFT = 0x00000011;
        View.FOCUS_UP = 0x00000021;
        View.FOCUS_RIGHT = 0x00000042;
        View.FOCUS_DOWN = 0x00000082;
        View.VIEW_STATE_WINDOW_FOCUSED = 1;
        View.VIEW_STATE_SELECTED = 1 << 1;
        View.VIEW_STATE_FOCUSED = 1 << 2;
        View.VIEW_STATE_ENABLED = 1 << 3;
        View.VIEW_STATE_DISABLE = -View.VIEW_STATE_ENABLED;
        View.VIEW_STATE_PRESSED = 1 << 4;
        View.VIEW_STATE_ACTIVATED = 1 << 5;
        View.VIEW_STATE_IDS = [
            View.VIEW_STATE_WINDOW_FOCUSED, View.VIEW_STATE_WINDOW_FOCUSED,
            View.VIEW_STATE_SELECTED, View.VIEW_STATE_SELECTED,
            View.VIEW_STATE_FOCUSED, View.VIEW_STATE_FOCUSED,
            View.VIEW_STATE_ENABLED, View.VIEW_STATE_ENABLED,
            View.VIEW_STATE_PRESSED, View.VIEW_STATE_PRESSED,
            View.VIEW_STATE_ACTIVATED, View.VIEW_STATE_ACTIVATED,
        ];
        View._static = (() => {
            function Integer_bitCount(i) {
                i = i - ((i >>> 1) & 0x55555555);
                i = (i & 0x33333333) + ((i >>> 2) & 0x33333333);
                i = (i + (i >>> 4)) & 0x0f0f0f0f;
                i = i + (i >>> 8);
                i = i + (i >>> 16);
                return i & 0x3f;
            }
            let orderedIds = View.VIEW_STATE_IDS;
            const NUM_BITS = View.VIEW_STATE_IDS.length / 2;
            View.VIEW_STATE_SETS = new Array(1 << NUM_BITS);
            for (let i = 0; i < View.VIEW_STATE_SETS.length; i++) {
                let numBits = Integer_bitCount(i);
                const stataSet = new Array(numBits);
                let pos = 0;
                for (let j = 0; j < orderedIds.length; j += 2) {
                    if ((i & orderedIds[j + 1]) != 0) {
                        stataSet[pos++] = orderedIds[j];
                    }
                }
                View.VIEW_STATE_SETS[i] = stataSet;
            }
        })();
        View.CLICKABLE = 0x00004000;
        View.DRAWING_CACHE_ENABLED = 0x00008000;
        View.WILL_NOT_CACHE_DRAWING = 0x000020000;
        View.FOCUSABLE_IN_TOUCH_MODE = 0x00040000;
        View.LONG_CLICKABLE = 0x00200000;
        View.DUPLICATE_PARENT_STATE = 0x00400000;
        View.LAYER_TYPE_NONE = 0;
        View.LAYER_TYPE_SOFTWARE = 1;
        View.AndroidViewProperty = 'AndroidView';
        view_1.View = View;
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
                    this.mTreeObserver = new view_1.ViewTreeObserver();
                    this.mViewVisibilityChanged = false;
                    this.mInvalidateChildLocation = new Array(2);
                    this.mIgnoreDirtyState = false;
                    this.mSetIgnoreDirtyState = false;
                    this.mWindowVisibility = 0;
                    this.mViewRootImpl = mViewRootImpl;
                    this.mHandler = mHandler;
                }
            }
            View.AttachInfo = AttachInfo;
            class ListenerInfo {
            }
            View.ListenerInfo = ListenerInfo;
            class AttrChangeHandler {
                constructor(view) {
                    this.isCallSuper = false;
                    this.handlers = [];
                    this.objectRefs = [];
                    this.view = view;
                }
                add(handler) {
                    this.handlers.push(handler);
                }
                handle(name, value) {
                    for (let handler of this.handlers) {
                        for (let key in handler) {
                            if (key.toLowerCase() === name) {
                                handler[key] = value;
                            }
                        }
                    }
                }
                getViewAttrValue(attrName) {
                    for (let handler of this.handlers) {
                        for (let key in handler) {
                            if (key.toLowerCase() === attrName.toLowerCase()) {
                                let value = handler[key];
                                if (value == null)
                                    return null;
                                if (typeof value === "number")
                                    return value + '';
                                if (typeof value === "boolean")
                                    return value + '';
                                if (typeof value === "string")
                                    return value;
                                return this.setRefObject(value);
                            }
                        }
                    }
                    return null;
                }
                getRefObject(ref, recycel = true) {
                    if (ref && ref.startsWith('@ref/')) {
                        ref = ref.substring(5);
                        let index = Number.parseInt(ref);
                        if (Number.isInteger(index)) {
                            let obj = this.objectRefs[index];
                            if (recycel)
                                this.objectRefs[index] = null;
                            return obj;
                        }
                    }
                }
                setRefObject(obj) {
                    let length = this.objectRefs.length;
                    for (let i = 0; i < length; i++) {
                        if (this.objectRefs[i] == null) {
                            this.objectRefs[i] = obj;
                            return '@ref/' + i;
                        }
                    }
                    this.objectRefs.push(obj);
                    return '@ref/' + length;
                }
                static parsePaddingMarginLTRB(value) {
                    value = (value + '');
                    let parts = [];
                    for (let part of value.split(' ')) {
                        if (part)
                            parts.push(part);
                    }
                    switch (parts.length) {
                        case 1: return [parts[0], parts[0], parts[0], parts[0]];
                        case 2: return [parts[1], parts[0], parts[1], parts[0]];
                        case 3: return [parts[1], parts[0], parts[1], parts[2]];
                        case 4: return [parts[3], parts[0], parts[1], parts[2]];
                    }
                    throw Error('not a padding or margin value : ' + value);
                }
                static parseBoolean(value, defaultValue = true) {
                    if (value === false || value === 'fales' || value === '0')
                        return false;
                    else if (value === true || value === 'true' || value === '1' || value === '')
                        return true;
                    return defaultValue;
                }
                parseBoolean(value, defaultValue = true) {
                    return AttrChangeHandler.parseBoolean(value, defaultValue);
                }
                static parseGravity(s, defaultValue = view_1.Gravity.NO_GRAVITY) {
                    let gravity = Number.parseInt(s);
                    if (Number.isInteger(gravity))
                        return gravity;
                    gravity = view_1.Gravity.NO_GRAVITY;
                    try {
                        let parts = s.split("|");
                        parts.forEach((part) => {
                            let g = view_1.Gravity[part.toUpperCase()];
                            if (Number.isInteger(g))
                                gravity |= g;
                        });
                    }
                    catch (e) {
                        console.error(e);
                    }
                    if (Number.isNaN(gravity) || gravity === view_1.Gravity.NO_GRAVITY)
                        gravity = defaultValue;
                    return gravity;
                }
                parseGravity(s, defaultValue = view_1.Gravity.NO_GRAVITY) {
                    return AttrChangeHandler.parseGravity(s, defaultValue);
                }
                parseDrawable(s) {
                    if (!s)
                        return null;
                    if (s.startsWith('@')) {
                        let refObj = this.getRefObject(s);
                        if (refObj)
                            return refObj;
                    }
                    else {
                        let color = this.parseColor(s);
                        return new ColorDrawable(color);
                    }
                }
                parseColor(value) {
                    let color = Number.parseInt(value);
                    if (Number.isInteger(color))
                        return color;
                    if (value.startsWith('rgb(')) {
                        value = value.replace('rgb(', '').replace(')', '');
                        let parts = value.split(',');
                        return Color.rgb(Number.parseInt(parts[0]), Number.parseInt(parts[1]), Number.parseInt(parts[2]));
                    }
                    else if (value.startsWith('rgba(')) {
                        value = value.replace('rgba(', '').replace(')', '');
                        let parts = value.split(',');
                        return Color.rgba(Number.parseInt(parts[0]), Number.parseInt(parts[1]), Number.parseInt(parts[2]), Number.parseInt(parts[2]) * 255);
                    }
                    else {
                        if (value.startsWith('#') && value.length === 4) {
                            value = '#' + value[1] + value[1] + value[2] + value[2] + value[2] + value[2];
                        }
                        try {
                            return Color.parseColor(value);
                        }
                        catch (e) {
                        }
                    }
                }
                parseColorList(value) {
                    if (!value)
                        return null;
                    if (value.startsWith('@')) {
                        let refObj = this.getRefObject(value);
                        if (refObj)
                            return refObj;
                    }
                    else {
                        let color = this.parseColor(value);
                        return ColorStateList.valueOf(color);
                    }
                    return null;
                }
            }
            View.AttrChangeHandler = AttrChangeHandler;
        })(View = view_1.View || (view_1.View = {}));
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
        })(View = view_1.View || (view_1.View = {}));
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
                this.View_this.checkForLongClick(view_1.ViewConfiguration.getTapTimeout());
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
        class ScrollabilityCache {
            constructor(host) {
                this.fadeScrollBars = true;
                this.fadingEdgeLength = view_1.ViewConfiguration.get().getScaledFadingEdgeLength();
                this.scrollBarDefaultDelayBeforeFade = view_1.ViewConfiguration.getScrollDefaultDelay();
                this.scrollBarFadeDuration = view_1.ViewConfiguration.getScrollBarFadeDuration();
                this.scrollBarSize = view_1.ViewConfiguration.get().getScaledScrollBarSize();
                this.interpolator = new LinearInterpolator();
                this.state = ScrollabilityCache.OFF;
                this.host = host;
            }
            run() {
                let now = AnimationUtils.currentAnimationTimeMillis();
                if (now >= this.fadeStartTime) {
                    this.state = ScrollabilityCache.FADING;
                    this.host.invalidate(true);
                }
            }
            _computeAlphaToScrollBar() {
                let now = AnimationUtils.currentAnimationTimeMillis();
                let factor = (now - this.fadeStartTime) / this.scrollBarFadeDuration;
                if (factor >= 1) {
                    this.state = ScrollabilityCache.OFF;
                    factor = 1;
                }
                let alpha = 1 - this.interpolator.getInterpolation(factor);
                this.scrollBar.setAlpha(255 * alpha);
            }
        }
        ScrollabilityCache.OFF = 0;
        ScrollabilityCache.ON = 1;
        ScrollabilityCache.FADING = 2;
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
    (function (view_2) {
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
                this.mViewVisibility = View.GONE;
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
                    case view_2.ViewGroup.LayoutParams.MATCH_PARENT:
                        measureSpec = MeasureSpec.makeMeasureSpec(windowSize, MeasureSpec.EXACTLY);
                        break;
                    case view_2.ViewGroup.LayoutParams.WRAP_CONTENT:
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
                let lp = new view_2.ViewGroup.LayoutParams(view_2.ViewGroup.LayoutParams.MATCH_PARENT, view_2.ViewGroup.LayoutParams.MATCH_PARENT);
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
                    attachInfo.mWindowVisibility = viewVisibility;
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
                if (viewVisibilityChanged) {
                    attachInfo.mWindowVisibility = viewVisibility;
                    host.dispatchWindowVisibilityChanged(viewVisibility);
                }
                ViewRootImpl.getRunQueue(this).executeActions(attachInfo.mHandler);
                let layoutRequested = this.mLayoutRequested;
                if (layoutRequested) {
                    if (this.mFirst) {
                    }
                    else {
                        if (lp.width == view_2.ViewGroup.LayoutParams.WRAP_CONTENT
                            || lp.height == view_2.ViewGroup.LayoutParams.WRAP_CONTENT) {
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
                        || (lp.width == view_2.ViewGroup.LayoutParams.WRAP_CONTENT &&
                            frame.width() < desiredWindowWidth && frame.width() != this.mWidth)
                        || (lp.height == view_2.ViewGroup.LayoutParams.WRAP_CONTENT &&
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
                if (view instanceof view_2.ViewGroup) {
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
        ViewRootImpl.DEBUG_FPS = false || ViewRootImpl.LOCAL_LOGV;
        view_2.ViewRootImpl = ViewRootImpl;
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
        })(ViewRootImpl = view_2.ViewRootImpl || (view_2.ViewRootImpl = {}));
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
///<reference path="../util/TypedValue.ts"/>
var android;
(function (android) {
    var view;
    (function (view_3) {
        var Rect = android.graphics.Rect;
        var SystemClock = android.os.SystemClock;
        var TypedValue = android.util.TypedValue;
        class ViewGroup extends view_3.View {
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
            createAttrChangeHandler(mergeHandler) {
                super.createAttrChangeHandler(mergeHandler);
                let viewGroup = this;
                mergeHandler.add({
                    set clipChildren(value) {
                        viewGroup.setClipChildren(view_3.View.AttrChangeHandler.parseBoolean(value));
                    },
                    get clipChildren() {
                        return viewGroup.getClipChildren();
                    },
                    set clipToPadding(value) {
                        viewGroup.setClipToPadding(view_3.View.AttrChangeHandler.parseBoolean(value));
                    },
                    get clipToPadding() {
                        return viewGroup.isClipToPadding();
                    },
                    set animationCache(value) {
                    },
                    set persistentDrawingCache(value) {
                    },
                    set addStatesFromChildren(value) {
                    },
                    set alwaysDrawnWithCache(value) {
                    },
                    set layoutAnimation(value) {
                    },
                    set descendantFocusability(value) {
                    },
                    set splitMotionEvents(value) {
                    },
                    set animateLayoutChanges(value) {
                    },
                    set layoutMode(value) {
                    }
                });
            }
            initViewGroup() {
                this.setFlags(view_3.View.WILL_NOT_DRAW, view_3.View.DRAW_MASK);
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
                child.mPrivateFlags &= ~view_3.View.PFLAG_FORCE_LAYOUT;
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
                params._attrChangeHandler.view = child;
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
                    this.addToBindElement(child.bindElement, null);
                }
                else if (index < count) {
                    let refChild = this.getChildAt(index);
                    this.mChildren.splice(index, 0, child);
                    this.addToBindElement(child.bindElement, refChild.bindElement);
                }
                else {
                    throw new Error("index=" + index + " count=" + count);
                }
            }
            addToBindElement(childElement, insertBeforeElement) {
                if (childElement.parentElement) {
                    if (childElement.parentElement == this.bindElement)
                        return;
                    childElement.parentElement.removeChild(childElement);
                }
                if (insertBeforeElement) {
                    this.bindElement.appendChild(childElement);
                }
                else {
                    this.bindElement.insertBefore(childElement, insertBeforeElement);
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
            addTouchables(views) {
                super.addTouchables(views);
                const count = this.mChildrenCount;
                const children = this.mChildren;
                for (let i = 0; i < count; i++) {
                    const child = children[i];
                    if ((child.mViewFlags & view_3.View.VISIBILITY_MASK) == view_3.View.VISIBLE) {
                        child.addTouchables(views);
                    }
                }
            }
            onInterceptTouchEvent(ev) {
                return false;
            }
            dispatchTouchEvent(ev) {
                let handled = false;
                if (this.onFilterTouchEventForSecurity(ev)) {
                    let action = ev.getAction();
                    let actionMasked = action & view_3.MotionEvent.ACTION_MASK;
                    if (actionMasked == view_3.MotionEvent.ACTION_DOWN) {
                        this.cancelAndClearTouchTargets(ev);
                        this.resetTouchState();
                    }
                    let intercepted;
                    if (actionMasked == view_3.MotionEvent.ACTION_DOWN
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
                        || actionMasked == view_3.MotionEvent.ACTION_CANCEL;
                    let split = (this.mGroupFlags & ViewGroup.FLAG_SPLIT_MOTION_EVENTS) != 0;
                    let newTouchTarget = null;
                    let alreadyDispatchedToNewTouchTarget = false;
                    if (!canceled && !intercepted) {
                        if (actionMasked == view_3.MotionEvent.ACTION_DOWN
                            || (split && actionMasked == view_3.MotionEvent.ACTION_POINTER_DOWN)
                            || actionMasked == view_3.MotionEvent.ACTION_HOVER_MOVE) {
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
                        || actionMasked == view_3.MotionEvent.ACTION_UP
                        || actionMasked == view_3.MotionEvent.ACTION_HOVER_MOVE) {
                        this.resetTouchState();
                    }
                    else if (split && actionMasked == view_3.MotionEvent.ACTION_POINTER_UP) {
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
                if ((view.mPrivateFlags & view_3.View.PFLAG_CANCEL_NEXT_UP_EVENT) != 0) {
                    view.mPrivateFlags &= ~view_3.View.PFLAG_CANCEL_NEXT_UP_EVENT;
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
                        event = view_3.MotionEvent.obtainWithAction(now, now, view_3.MotionEvent.ACTION_CANCEL, 0, 0);
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
                        let event = view_3.MotionEvent.obtainWithAction(now, now, view_3.MotionEvent.ACTION_CANCEL, 0, 0);
                        view.dispatchTouchEvent(event);
                        event.recycle();
                        return;
                    }
                    predecessor = target;
                    target = next;
                }
            }
            static canViewReceivePointerEvents(child) {
                return (child.mViewFlags & view_3.View.VISIBILITY_MASK) == view_3.View.VISIBLE;
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
                if (cancel || oldAction == view_3.MotionEvent.ACTION_CANCEL) {
                    event.setAction(view_3.MotionEvent.ACTION_CANCEL);
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
                    transformedEvent = view_3.MotionEvent.obtain(event);
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
                    if ((child.mViewFlags & view_3.View.VISIBILITY_MASK) != view_3.View.GONE) {
                        this.measureChild(child, widthMeasureSpec, heightMeasureSpec);
                    }
                }
            }
            measureChild(child, parentWidthMeasureSpec, parentHeightMeasureSpec) {
                let lp = child.getLayoutParams();
                lp._measuringParentWidthMeasureSpec = parentWidthMeasureSpec;
                lp._measuringParentHeightMeasureSpec = parentHeightMeasureSpec;
                const childWidthMeasureSpec = ViewGroup.getChildMeasureSpec(parentWidthMeasureSpec, this.mPaddingLeft + this.mPaddingRight, lp.width);
                const childHeightMeasureSpec = ViewGroup.getChildMeasureSpec(parentHeightMeasureSpec, this.mPaddingTop + this.mPaddingBottom, lp.height);
                child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
                lp._measuringParentWidthMeasureSpec = null;
                lp._measuringParentHeightMeasureSpec = null;
            }
            measureChildWithMargins(child, parentWidthMeasureSpec, widthUsed, parentHeightMeasureSpec, heightUsed) {
                let lp = child.getLayoutParams();
                lp._measuringParentWidthMeasureSpec = parentWidthMeasureSpec;
                lp._measuringParentHeightMeasureSpec = parentHeightMeasureSpec;
                if (lp instanceof ViewGroup.MarginLayoutParams) {
                    const childWidthMeasureSpec = ViewGroup.getChildMeasureSpec(parentWidthMeasureSpec, this.mPaddingLeft + this.mPaddingRight + lp.leftMargin + lp.rightMargin
                        + widthUsed, lp.width);
                    const childHeightMeasureSpec = ViewGroup.getChildMeasureSpec(parentHeightMeasureSpec, this.mPaddingTop + this.mPaddingBottom + lp.topMargin + lp.bottomMargin
                        + heightUsed, lp.height);
                    child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
                }
                lp._measuringParentWidthMeasureSpec = null;
                lp._measuringParentHeightMeasureSpec = null;
            }
            static getChildMeasureSpec(spec, padding, childDimension) {
                let MeasureSpec = view_3.View.MeasureSpec;
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
                    child.dispatchAttachedToWindow(info, visibility | (child.mViewFlags & view_3.View.VISIBILITY_MASK));
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
            dispatchSetSelected(selected) {
                const children = this.mChildren;
                const count = this.mChildrenCount;
                for (let i = 0; i < count; i++) {
                    children[i].setSelected(selected);
                }
            }
            dispatchSetActivated(activated) {
                const children = this.mChildren;
                const count = this.mChildrenCount;
                for (let i = 0; i < count; i++) {
                    children[i].setActivated(activated);
                }
            }
            dispatchSetPressed(pressed) {
                const children = this.mChildren;
                const count = this.mChildrenCount;
                for (let i = 0; i < count; i++) {
                    const child = children[i];
                    if (!pressed || (!child.isClickable() && !child.isLongClickable())) {
                        child.setPressed(pressed);
                    }
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
                    && (theParent instanceof view_3.View)
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
                    if ((child.mViewFlags & view_3.View.VISIBILITY_MASK) == view_3.View.VISIBLE) {
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
            drawableStateChanged() {
                super.drawableStateChanged();
                if ((this.mGroupFlags & ViewGroup.FLAG_NOTIFY_CHILDREN_ON_DRAWABLE_STATE_CHANGE) != 0) {
                    if ((this.mGroupFlags & ViewGroup.FLAG_ADD_STATES_FROM_CHILDREN) != 0) {
                        throw new Error("addStateFromChildren cannot be enabled if a"
                            + " child has duplicateParentState set to true");
                    }
                    const children = this.mChildren;
                    const count = this.mChildrenCount;
                    for (let i = 0; i < count; i++) {
                        const child = children[i];
                        if ((child.mViewFlags & view_3.View.DUPLICATE_PARENT_STATE) != 0) {
                            child.refreshDrawableState();
                        }
                    }
                }
            }
            jumpDrawablesToCurrentState() {
                super.jumpDrawablesToCurrentState();
                const children = this.mChildren;
                const count = this.mChildrenCount;
                for (let i = 0; i < count; i++) {
                    children[i].jumpDrawablesToCurrentState();
                }
            }
            onCreateDrawableState(extraSpace) {
                if ((this.mGroupFlags & ViewGroup.FLAG_ADD_STATES_FROM_CHILDREN) == 0) {
                    return super.onCreateDrawableState(extraSpace);
                }
                let need = 0;
                let n = this.getChildCount();
                for (let i = 0; i < n; i++) {
                    let childState = this.getChildAt(i).getDrawableState();
                    if (childState != null) {
                        need += childState.length;
                    }
                }
                let state = super.onCreateDrawableState(extraSpace + need);
                for (let i = 0; i < n; i++) {
                    let childState = this.getChildAt(i).getDrawableState();
                    if (childState != null) {
                        state = view_3.View.mergeDrawableStates(state, childState);
                    }
                }
                return state;
            }
            setAddStatesFromChildren(addsStates) {
                if (addsStates) {
                    this.mGroupFlags |= ViewGroup.FLAG_ADD_STATES_FROM_CHILDREN;
                }
                else {
                    this.mGroupFlags &= ~ViewGroup.FLAG_ADD_STATES_FROM_CHILDREN;
                }
                this.refreshDrawableState();
            }
            addStatesFromChildren() {
                return (this.mGroupFlags & ViewGroup.FLAG_ADD_STATES_FROM_CHILDREN) != 0;
            }
            childDrawableStateChanged(child) {
                if ((this.mGroupFlags & ViewGroup.FLAG_ADD_STATES_FROM_CHILDREN) != 0) {
                    this.refreshDrawableState();
                }
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
            isClipToPadding() {
                return (this.mGroupFlags & ViewGroup.FLAG_CLIP_TO_PADDING) == ViewGroup.FLAG_CLIP_TO_PADDING;
            }
            invalidateChild(child, dirty) {
                let parent = this;
                const attachInfo = this.mAttachInfo;
                if (attachInfo != null) {
                    const drawAnimation = (child.mPrivateFlags & view_3.View.PFLAG_DRAW_ANIMATION)
                        == view_3.View.PFLAG_DRAW_ANIMATION;
                    let childMatrix = child.getMatrix();
                    const isOpaque = child.isOpaque() && !drawAnimation &&
                        child.getAnimation() == null && childMatrix.isIdentity();
                    let opaqueFlag = isOpaque ? view_3.View.PFLAG_DIRTY_OPAQUE : view_3.View.PFLAG_DIRTY;
                    if (child.mLayerType != view_3.View.LAYER_TYPE_NONE) {
                        this.mPrivateFlags |= view_3.View.PFLAG_INVALIDATED;
                        this.mPrivateFlags &= ~view_3.View.PFLAG_DRAWING_CACHE_VALID;
                    }
                    const location = attachInfo.mInvalidateChildLocation;
                    location[0] = child.mLeft;
                    location[1] = child.mTop;
                    do {
                        let view = null;
                        if (parent instanceof view_3.View) {
                            view = parent;
                        }
                        if (view != null) {
                            opaqueFlag = view_3.View.PFLAG_DIRTY;
                            if ((view.mPrivateFlags & view_3.View.PFLAG_DIRTY_MASK) != view_3.View.PFLAG_DIRTY) {
                                view.mPrivateFlags = (view.mPrivateFlags & ~view_3.View.PFLAG_DIRTY_MASK) | opaqueFlag;
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
                if ((this.mPrivateFlags & view_3.View.PFLAG_DRAWN) == view_3.View.PFLAG_DRAWN ||
                    (this.mPrivateFlags & view_3.View.PFLAG_DRAWING_CACHE_VALID) == view_3.View.PFLAG_DRAWING_CACHE_VALID) {
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
                        this.mPrivateFlags &= ~view_3.View.PFLAG_DRAWING_CACHE_VALID;
                        location[0] = left;
                        location[1] = top;
                        if (this.mLayerType != view_3.View.LAYER_TYPE_NONE) {
                            this.mPrivateFlags |= view_3.View.PFLAG_INVALIDATED;
                        }
                        return this.mParent;
                    }
                    else {
                        this.mPrivateFlags &= ~view_3.View.PFLAG_DRAWN & ~view_3.View.PFLAG_DRAWING_CACHE_VALID;
                        location[0] = this.mLeft;
                        location[1] = this.mTop;
                        if ((this.mGroupFlags & ViewGroup.FLAG_CLIP_CHILDREN) == ViewGroup.FLAG_CLIP_CHILDREN) {
                            dirty.set(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop);
                        }
                        else {
                            dirty.union(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop);
                        }
                        if (this.mLayerType != view_3.View.LAYER_TYPE_NONE) {
                            this.mPrivateFlags |= view_3.View.PFLAG_INVALIDATED;
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
                            if (parentVG.mLayerType != view_3.View.LAYER_TYPE_NONE) {
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
                if ((this.mPrivateFlags & view_3.View.PFLAG_DRAWN) == view_3.View.PFLAG_DRAWN ||
                    (this.mPrivateFlags & view_3.View.PFLAG_DRAWING_CACHE_VALID) == view_3.View.PFLAG_DRAWING_CACHE_VALID) {
                    dirty.offset(left - this.mScrollX, top - this.mScrollY);
                    if ((this.mGroupFlags & ViewGroup.FLAG_CLIP_CHILDREN) == 0) {
                        dirty.union(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop);
                    }
                    if ((this.mGroupFlags & ViewGroup.FLAG_CLIP_CHILDREN) == 0 ||
                        dirty.intersect(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop)) {
                        if (this.mLayerType != view_3.View.LAYER_TYPE_NONE) {
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
            clearChildFocus(child) {
            }
            focusSearch(v, direction) {
                return undefined;
            }
            focusableViewAvailable(v) {
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
        view_3.ViewGroup = ViewGroup;
        (function (ViewGroup) {
            class LayoutParams {
                constructor(...args) {
                    this._width = 0;
                    this._height = 0;
                    this._measuringParentWidthMeasureSpec = 0;
                    this._measuringParentHeightMeasureSpec = 0;
                    this._attrChangeHandler = new view_3.View.AttrChangeHandler(null);
                    if (args.length === 1) {
                        let src = args[0];
                        this.width = src._width;
                        this.height = src._height;
                    }
                    else if (args.length === 2) {
                        let [width = 0, height = 0] = args;
                        this.width = width;
                        this.height = height;
                    }
                    this._createAttrChangeHandler(this._attrChangeHandler);
                    if (!this._attrChangeHandler.isCallSuper) {
                        throw Error('must call super when override createAttrChangeHandler!');
                    }
                }
                get width() {
                    if (typeof this._width === 'number')
                        return this._width;
                    let up = (this._width + "").toUpperCase();
                    if (up === 'FILL_PARENT' || up === 'MATCH_PARENT')
                        this._width = -1;
                    else if (up === 'WRAP_CONTENT')
                        this._width = -2;
                    else {
                        let parentWidth = view_3.View.MeasureSpec.getSize(this._measuringParentWidthMeasureSpec);
                        try {
                            this._width = TypedValue.complexToDimensionPixelSize(this._width, parentWidth, this._measuringMeasureSpec);
                        }
                        catch (e) {
                            console.error(e);
                            this._width = -2;
                        }
                    }
                    return this._width;
                }
                set width(value) {
                    this._width = this._widthOrig = value;
                }
                get height() {
                    if (typeof this._height === 'number')
                        return this._height;
                    let up = (this._height + "").toUpperCase();
                    if (up === 'FILL_PARENT' || up === 'MATCH_PARENT')
                        this._height = -1;
                    else if (up === 'WRAP_CONTENT')
                        this._height = -2;
                    else {
                        let parentHeight = view_3.View.MeasureSpec.getSize(this._measuringParentHeightMeasureSpec);
                        try {
                            this._height = TypedValue.complexToDimensionPixelSize(this._height, parentHeight, this._measuringMeasureSpec);
                        }
                        catch (e) {
                            console.error(e);
                            this._height = -2;
                        }
                    }
                    return this._height;
                }
                set height(value) {
                    this._height = this._heightOrig = value;
                }
                _createAttrChangeHandler(mergeHandler) {
                    let params = this;
                    mergeHandler.add({
                        set width(value) {
                            if (value == null)
                                value = -2;
                            params.width = value;
                        },
                        get width() {
                            return params._widthOrig;
                        },
                        set height(value) {
                            if (value == null)
                                value = -2;
                            params.height = value;
                        },
                        get height() {
                            return params._heightOrig;
                        }
                    });
                    mergeHandler.isCallSuper = true;
                }
            }
            LayoutParams.FILL_PARENT = -1;
            LayoutParams.MATCH_PARENT = -1;
            LayoutParams.WRAP_CONTENT = -2;
            ViewGroup.LayoutParams = LayoutParams;
            class MarginLayoutParams extends LayoutParams {
                constructor(...args) {
                    super();
                    this._leftMargin = 0;
                    this._topMargin = 0;
                    this._rightMargin = 0;
                    this._bottomMargin = 0;
                    this._leftMarginOrig = 0;
                    this._topMarginOrig = 0;
                    this._rightMarginOrig = 0;
                    this._bottomMarginOrig = 0;
                    if (args.length === 1) {
                        let src = args[0];
                        if (src instanceof MarginLayoutParams) {
                            super(src);
                            this.leftMargin = src._leftMargin;
                            this.topMargin = src._topMargin;
                            this.rightMargin = src._rightMargin;
                            this.bottomMargin = src._bottomMargin;
                        }
                    }
                    else if (args.length == 2) {
                        super(args[0], args[1]);
                    }
                }
                get leftMargin() {
                    if (typeof this._leftMargin === 'number')
                        return this._leftMargin;
                    let parentWidth = view_3.View.MeasureSpec.getSize(this._measuringParentWidthMeasureSpec);
                    try {
                        this._leftMargin = TypedValue.complexToDimensionPixelSize(this._leftMargin, parentWidth, this._measuringMeasureSpec);
                    }
                    catch (e) {
                        console.warn(e);
                        this._leftMargin = 0;
                    }
                    return this._leftMargin;
                }
                get topMargin() {
                    if (typeof this._topMargin === 'number')
                        return this._topMargin;
                    let parentWidth = view_3.View.MeasureSpec.getSize(this._measuringParentWidthMeasureSpec);
                    try {
                        this._topMargin = TypedValue.complexToDimensionPixelSize(this._topMargin, parentWidth, this._measuringMeasureSpec);
                    }
                    catch (e) {
                        console.warn(e);
                        this._topMargin = 0;
                    }
                    return this._topMargin;
                }
                get rightMargin() {
                    if (typeof this._rightMargin === 'number')
                        return this._rightMargin;
                    let parentWidth = view_3.View.MeasureSpec.getSize(this._measuringParentWidthMeasureSpec);
                    try {
                        this._rightMargin = TypedValue.complexToDimensionPixelSize(this._rightMargin, parentWidth, this._measuringMeasureSpec);
                    }
                    catch (e) {
                        console.warn(e);
                        this._rightMargin = 0;
                    }
                    return this._rightMargin;
                }
                get bottomMargin() {
                    if (typeof this._bottomMargin === 'number')
                        return this._bottomMargin;
                    let parentWidth = view_3.View.MeasureSpec.getSize(this._measuringParentWidthMeasureSpec);
                    try {
                        this._bottomMargin = TypedValue.complexToDimensionPixelSize(this._bottomMargin, parentWidth, this._measuringMeasureSpec);
                    }
                    catch (e) {
                        console.warn(e);
                        this._bottomMargin = 0;
                    }
                    return this._bottomMargin;
                }
                set leftMargin(value) {
                    this._leftMargin = this._leftMarginOrig = value;
                }
                set topMargin(value) {
                    this._topMargin = this._topMarginOrig = value;
                }
                set rightMargin(value) {
                    this._rightMargin = this._rightMarginOrig = value;
                }
                set bottomMargin(value) {
                    this._bottomMargin = this._bottomMarginOrig = value;
                }
                setMargins(left, top, right, bottom) {
                    this.leftMargin = left;
                    this.topMargin = top;
                    this.rightMargin = right;
                    this.bottomMargin = bottom;
                }
                _createAttrChangeHandler(mergeHandler) {
                    super._createAttrChangeHandler(mergeHandler);
                    let params = this;
                    mergeHandler.add({
                        set marginLeft(value) {
                            if (value == null)
                                value = 0;
                            params.leftMargin = value;
                        },
                        set marginTop(value) {
                            if (value == null)
                                value = 0;
                            params.topMargin = value;
                        },
                        set marginRight(value) {
                            if (value == null)
                                value = 0;
                            params.rightMargin = value;
                        },
                        set marginBottom(value) {
                            if (value == null)
                                value = 0;
                            params.bottomMargin = value;
                        },
                        set margin(value) {
                            if (value == null)
                                value = 0;
                            let [left, top, right, bottom] = view_3.View.AttrChangeHandler.parsePaddingMarginLTRB(value);
                            params.leftMargin = left;
                            params.topMargin = top;
                            params.rightMargin = right;
                            params.bottomMargin = bottom;
                        },
                    });
                }
            }
            ViewGroup.MarginLayoutParams = MarginLayoutParams;
        })(ViewGroup = view_3.ViewGroup || (view_3.ViewGroup = {}));
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
/**
 * Created by linfaxin on 15/10/9.
 */
///<reference path="../view/Gravity.ts"/>
///<reference path="../view/View.ts"/>
///<reference path="../view/ViewGroup.ts"/>
///<reference path="../graphics/drawable/Drawable.ts"/>
///<reference path="../graphics/Rect.ts"/>
///<reference path="../graphics/Canvas.ts"/>
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
            createAttrChangeHandler(mergeHandler) {
                super.createAttrChangeHandler(mergeHandler);
                let frameLayout = this;
                mergeHandler.add({
                    set foregroundGravity(value) {
                        frameLayout.mForegroundGravity = View.AttrChangeHandler.parseGravity(value, frameLayout.mForegroundGravity);
                    },
                    get foregroundGravity() {
                        return frameLayout.mForegroundGravity;
                    }
                });
            }
            getForegroundGravity() {
                return this.mForegroundGravity;
            }
            setForegroundGravity(foregroundGravity) {
                if (this.mForegroundGravity != foregroundGravity) {
                    if ((foregroundGravity & Gravity.HORIZONTAL_GRAVITY_MASK) == 0) {
                        foregroundGravity |= Gravity.LEFT;
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
            draw(canvas) {
                super.draw(canvas);
                if (this.mForeground != null) {
                    const foreground = this.mForeground;
                    if (this.mForegroundBoundsChanged) {
                        this.mForegroundBoundsChanged = false;
                        const selfBounds = this.mSelfBounds;
                        const overlayBounds = this.mOverlayBounds;
                        const w = this.mRight - this.mLeft;
                        const h = this.mBottom - this.mTop;
                        if (this.mForegroundInPadding) {
                            selfBounds.set(0, 0, w, h);
                        }
                        else {
                            selfBounds.set(this.mPaddingLeft, this.mPaddingTop, w - this.mPaddingRight, h - this.mPaddingBottom);
                        }
                        Gravity.apply(this.mForegroundGravity, foreground.getIntrinsicWidth(), foreground.getIntrinsicHeight(), selfBounds, overlayBounds);
                        foreground.setBounds(overlayBounds);
                    }
                    foreground.draw(canvas);
                }
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
            checkLayoutParams(p) {
                return p instanceof FrameLayout.LayoutParams;
            }
            generateLayoutParams(p) {
                return new FrameLayout.LayoutParams(p);
            }
        }
        FrameLayout.DEFAULT_CHILD_GRAVITY = Gravity.TOP | Gravity.LEFT;
        widget.FrameLayout = FrameLayout;
        (function (FrameLayout) {
            class LayoutParams extends ViewGroup.MarginLayoutParams {
                constructor(...args) {
                    super();
                    this.gravity = -1;
                    if (args.length === 1 && args[0] instanceof LayoutParams) {
                        super(args[0]);
                        this.gravity = args[0].gravity;
                    }
                    else {
                        let [width, height, gravity = -1] = args;
                        super(width, height);
                        this.gravity = gravity;
                    }
                }
                _createAttrChangeHandler(mergeHandler) {
                    super._createAttrChangeHandler(mergeHandler);
                    let params = this;
                    mergeHandler.add({
                        set gravity(value) {
                            params.gravity = View.AttrChangeHandler.parseGravity(value, params.gravity);
                        },
                        get gravity() {
                            return params.gravity;
                        }
                    });
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
            getDuration() {
                return Math.max(this.mScrollerX.mDuration, this.mScrollerY.mDuration);
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
            createAttrChangeHandler(mergeHandler) {
                super.createAttrChangeHandler(mergeHandler);
                let scrollView = this;
                mergeHandler.add({
                    set fillViewport(value) {
                        scrollView.setFillViewport(View.AttrChangeHandler.parseBoolean(value));
                    },
                    get fillViewport() {
                        return scrollView.mFillViewport;
                    }
                });
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
                this.setVerticalScrollBarEnabled(true);
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
                }
                else {
                    super.scrollTo(scrollX, scrollY);
                }
                if (!this.awakenScrollBars()) {
                    this.postInvalidateOnAnimation();
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
                lp._measuringParentWidthMeasureSpec = parentWidthMeasureSpec;
                lp._measuringParentHeightMeasureSpec = parentHeightMeasureSpec;
                let childWidthMeasureSpec;
                let childHeightMeasureSpec;
                childWidthMeasureSpec = ViewGroup.getChildMeasureSpec(parentWidthMeasureSpec, this.mPaddingLeft
                    + this.mPaddingRight, lp.width);
                childHeightMeasureSpec = MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED);
                child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
                lp._measuringParentWidthMeasureSpec = null;
                lp._measuringParentHeightMeasureSpec = null;
            }
            measureChildWithMargins(child, parentWidthMeasureSpec, widthUsed, parentHeightMeasureSpec, heightUsed) {
                const lp = child.getLayoutParams();
                lp._measuringParentWidthMeasureSpec = parentWidthMeasureSpec;
                lp._measuringParentHeightMeasureSpec = parentHeightMeasureSpec;
                const childWidthMeasureSpec = ScrollView.getChildMeasureSpec(parentWidthMeasureSpec, this.mPaddingLeft + this.mPaddingRight + lp.leftMargin + lp.rightMargin
                    + widthUsed, lp.width);
                const childHeightMeasureSpec = MeasureSpec.makeMeasureSpec(lp.topMargin + lp.bottomMargin, MeasureSpec.UNSPECIFIED);
                child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
                lp._measuringParentWidthMeasureSpec = null;
                lp._measuringParentHeightMeasureSpec = null;
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
                        this.overScrollBy(x - oldX, y - oldY, oldX, oldY, 0, range, 0, this.getOverflingDistance(), false);
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
                this.scrollTo(this.mScrollX, this.mScrollY);
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
            getOverflingDistance() {
                let height = this.getHeight() - this.mPaddingBottom - this.mPaddingTop;
                let bottom = this.getChildAt(0).getHeight();
                let minOverY = this.mScrollY < 0 ? -this.mScrollY : this.mScrollY - (bottom - height);
                return Math.max(this.mOverflingDistance, minOverY + this.mOverflingDistance);
            }
            fling(velocityY) {
                if (this.getChildCount() > 0) {
                    let height = this.getHeight() - this.mPaddingBottom - this.mPaddingTop;
                    let bottom = this.getChildAt(0).getHeight();
                    this.mScroller.fling(this.mScrollX, this.mScrollY, 0, velocityY, 0, 0, 0, Math.max(0, bottom - height), 0, this.getOverflingDistance());
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
            canScrollVertically(direction) {
                if (this.getOverScrollMode() === View.OVER_SCROLL_ALWAYS)
                    return true;
                return super.canScrollVertically(direction);
            }
        }
        ScrollView.ANIMATED_SCROLL_GAP = 250;
        ScrollView.MAX_SCROLL_FACTOR = 0.5;
        ScrollView.TAG = "ScrollView";
        ScrollView.INVALID_POINTER = -1;
        widget.ScrollView = ScrollView;
    })(widget = android.widget || (android.widget = {}));
})(android || (android = {}));
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
        var MeasureSpec = View.MeasureSpec;
        var ViewGroup = android.view.ViewGroup;
        class LinearLayout extends ViewGroup {
            constructor(...args) {
                super(...args);
                this.mBaselineAligned = true;
                this.mBaselineAlignedChildIndex = -1;
                this.mBaselineChildTop = 0;
                this.mOrientation = 0;
                this.mGravity = Gravity.LEFT | Gravity.TOP;
                this.mTotalLength = 0;
                this.mWeightSum = -1;
                this.mUseLargestChild = false;
                this.mDividerWidth = 0;
                this.mDividerHeight = 0;
                this.mShowDividers = LinearLayout.SHOW_DIVIDER_NONE;
                this.mDividerPadding = 0;
            }
            createAttrChangeHandler(mergeHandler) {
                super.createAttrChangeHandler(mergeHandler);
                let linearLayout = this;
                mergeHandler.add({
                    set orientation(value) {
                        let isVertical = (value + "").toUpperCase() === 'VERTICAL';
                        if (isVertical) {
                            linearLayout.setOrientation(LinearLayout.VERTICAL);
                            return;
                        }
                        let isHorizontal = (value + "").toUpperCase() === 'HORIZONTAL';
                        if (isHorizontal) {
                            linearLayout.setOrientation(LinearLayout.HORIZONTAL);
                        }
                    },
                    get orientation() {
                        if (linearLayout.mOrientation === LinearLayout.VERTICAL) {
                            return 'VERTICAL';
                        }
                        else {
                            return 'HORIZONTAL';
                        }
                    },
                    set gravity(value) {
                        linearLayout.setGravity(View.AttrChangeHandler.parseGravity(value, linearLayout.mGravity));
                    },
                    get gravity() {
                        return linearLayout.mGravity;
                    },
                    set baselineAligned(value) {
                        if (!View.AttrChangeHandler.parseBoolean(value))
                            linearLayout.setBaselineAligned(false);
                    },
                    set weightSum(value) {
                        let weightSum = Number.parseInt(value);
                        if (Number.isSafeInteger(weightSum)) {
                            linearLayout.mWeightSum = weightSum;
                        }
                    },
                    get weightSum() {
                        return linearLayout.mWeightSum;
                    },
                    set baselineAlignedChildIndex(value) {
                        value = Number.parseInt(value);
                        if (Number.isSafeInteger(value)) {
                            linearLayout.mBaselineAlignedChildIndex = value;
                        }
                    },
                    set measureWithLargestChild(value) {
                        linearLayout.mUseLargestChild = View.AttrChangeHandler.parseBoolean(value, linearLayout.mUseLargestChild);
                    },
                    set divider(value) {
                    },
                    set showDividers(value) {
                        let fieldName = ('SHOW_DIVIDER_' + value).toUpperCase();
                        if (Number.isInteger(LinearLayout[fieldName])) {
                            linearLayout.mShowDividers = LinearLayout[fieldName];
                        }
                    },
                    set dividerPadding(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value)) {
                            linearLayout.mDividerPadding = value;
                        }
                    },
                    get dividerPadding() {
                        return linearLayout.mDividerPadding;
                    }
                });
            }
            setShowDividers(showDividers) {
                if (showDividers != this.mShowDividers) {
                    this.requestLayout();
                }
                this.mShowDividers = showDividers;
            }
            shouldDelayChildPressedState() {
                return false;
            }
            getShowDividers() {
                return this.mShowDividers;
            }
            getDividerDrawable() {
                return this.mDivider;
            }
            setDividerDrawable(divider) {
                if (divider == this.mDivider) {
                    return;
                }
                this.mDivider = divider;
                if (divider != null) {
                    this.mDividerWidth = divider.getIntrinsicWidth();
                    this.mDividerHeight = divider.getIntrinsicHeight();
                }
                else {
                    this.mDividerWidth = 0;
                    this.mDividerHeight = 0;
                }
                this.setWillNotDraw(divider == null);
                this.requestLayout();
            }
            setDividerPadding(padding) {
                this.mDividerPadding = padding;
            }
            getDividerPadding() {
                return this.mDividerPadding;
            }
            getDividerWidth() {
                return this.mDividerWidth;
            }
            onDraw(canvas) {
                if (this.mDivider == null) {
                    return;
                }
                if (this.mOrientation == LinearLayout.VERTICAL) {
                    this.drawDividersVertical(canvas);
                }
                else {
                    this.drawDividersHorizontal(canvas);
                }
            }
            drawDividersVertical(canvas) {
                const count = this.getVirtualChildCount();
                for (let i = 0; i < count; i++) {
                    const child = this.getVirtualChildAt(i);
                    if (child != null && child.getVisibility() != View.GONE) {
                        if (this.hasDividerBeforeChildAt(i)) {
                            const lp = child.getLayoutParams();
                            const top = child.getTop() - lp.topMargin - this.mDividerHeight;
                            this.drawHorizontalDivider(canvas, top);
                        }
                    }
                }
                if (this.hasDividerBeforeChildAt(count)) {
                    const child = this.getVirtualChildAt(count - 1);
                    let bottom = 0;
                    if (child == null) {
                        bottom = this.getHeight() - this.getPaddingBottom() - this.mDividerHeight;
                    }
                    else {
                        const lp = child.getLayoutParams();
                        bottom = child.getBottom() + lp.bottomMargin;
                    }
                    this.drawHorizontalDivider(canvas, bottom);
                }
            }
            drawDividersHorizontal(canvas) {
                const count = this.getVirtualChildCount();
                const isLayoutRtl = this.isLayoutRtl();
                for (let i = 0; i < count; i++) {
                    const child = this.getVirtualChildAt(i);
                    if (child != null && child.getVisibility() != View.GONE) {
                        if (this.hasDividerBeforeChildAt(i)) {
                            const lp = child.getLayoutParams();
                            let position;
                            if (isLayoutRtl) {
                                position = child.getRight() + lp.rightMargin;
                            }
                            else {
                                position = child.getLeft() - lp.leftMargin - this.mDividerWidth;
                            }
                            this.drawVerticalDivider(canvas, position);
                        }
                    }
                }
                if (this.hasDividerBeforeChildAt(count)) {
                    const child = this.getVirtualChildAt(count - 1);
                    let position;
                    if (child == null) {
                        if (isLayoutRtl) {
                            position = this.getPaddingLeft();
                        }
                        else {
                            position = this.getWidth() - this.getPaddingRight() - this.mDividerWidth;
                        }
                    }
                    else {
                        const lp = child.getLayoutParams();
                        if (isLayoutRtl) {
                            position = child.getLeft() - lp.leftMargin - this.mDividerWidth;
                        }
                        else {
                            position = child.getRight() + lp.rightMargin;
                        }
                    }
                    this.drawVerticalDivider(canvas, position);
                }
            }
            drawHorizontalDivider(canvas, top) {
                this.mDivider.setBounds(this.getPaddingLeft() + this.mDividerPadding, top, this.getWidth() - this.getPaddingRight() - this.mDividerPadding, top + this.mDividerHeight);
                this.mDivider.draw(canvas);
            }
            drawVerticalDivider(canvas, left) {
                this.mDivider.setBounds(left, this.getPaddingTop() + this.mDividerPadding, left + this.mDividerWidth, this.getHeight() - this.getPaddingBottom() - this.mDividerPadding);
                this.mDivider.draw(canvas);
            }
            isBaselineAligned() {
                return this.mBaselineAligned;
            }
            setBaselineAligned(baselineAligned) {
                this.mBaselineAligned = baselineAligned;
            }
            isMeasureWithLargestChildEnabled() {
                return this.mUseLargestChild;
            }
            setMeasureWithLargestChildEnabled(enabled) {
                this.mUseLargestChild = enabled;
            }
            getBaseline() {
                if (this.mBaselineAlignedChildIndex < 0) {
                    return super.getBaseline();
                }
                if (this.getChildCount() <= this.mBaselineAlignedChildIndex) {
                    throw new Error("mBaselineAlignedChildIndex of LinearLayout "
                        + "set to an index that is out of bounds.");
                }
                const child = this.getChildAt(this.mBaselineAlignedChildIndex);
                const childBaseline = child.getBaseline();
                if (childBaseline == -1) {
                    if (this.mBaselineAlignedChildIndex == 0) {
                        return -1;
                    }
                    throw new Error("mBaselineAlignedChildIndex of LinearLayout "
                        + "points to a View that doesn't know how to get its baseline.");
                }
                let childTop = this.mBaselineChildTop;
                if (this.mOrientation == LinearLayout.VERTICAL) {
                    const majorGravity = this.mGravity & Gravity.VERTICAL_GRAVITY_MASK;
                    if (majorGravity != Gravity.TOP) {
                        switch (majorGravity) {
                            case Gravity.BOTTOM:
                                childTop = this.mBottom - this.mTop - this.mPaddingBottom - this.mTotalLength;
                                break;
                            case Gravity.CENTER_VERTICAL:
                                childTop += ((this.mBottom - this.mTop - this.mPaddingTop - this.mPaddingBottom) -
                                    this.mTotalLength) / 2;
                                break;
                        }
                    }
                }
                let lp = child.getLayoutParams();
                return childTop + lp.topMargin + childBaseline;
            }
            getBaselineAlignedChildIndex() {
                return this.mBaselineAlignedChildIndex;
            }
            setBaselineAlignedChildIndex(i) {
                if ((i < 0) || (i >= this.getChildCount())) {
                    throw new Error("base aligned child index out "
                        + "of range (0, " + this.getChildCount() + ")");
                }
                this.mBaselineAlignedChildIndex = i;
            }
            getVirtualChildAt(index) {
                return this.getChildAt(index);
            }
            getVirtualChildCount() {
                return this.getChildCount();
            }
            getWeightSum() {
                return this.mWeightSum;
            }
            setWeightSum(weightSum) {
                this.mWeightSum = Math.max(0, weightSum);
            }
            onMeasure(widthMeasureSpec, heightMeasureSpec) {
                if (this.mOrientation == LinearLayout.VERTICAL) {
                    this.measureVertical(widthMeasureSpec, heightMeasureSpec);
                }
                else {
                    this.measureHorizontal(widthMeasureSpec, heightMeasureSpec);
                }
            }
            hasDividerBeforeChildAt(childIndex) {
                if (childIndex == 0) {
                    return (this.mShowDividers & LinearLayout.SHOW_DIVIDER_BEGINNING) != 0;
                }
                else if (childIndex == this.getChildCount()) {
                    return (this.mShowDividers & LinearLayout.SHOW_DIVIDER_END) != 0;
                }
                else if ((this.mShowDividers & LinearLayout.SHOW_DIVIDER_MIDDLE) != 0) {
                    let hasVisibleViewBefore = false;
                    for (let i = childIndex - 1; i >= 0; i--) {
                        if (this.getChildAt(i).getVisibility() != LinearLayout.GONE) {
                            hasVisibleViewBefore = true;
                            break;
                        }
                    }
                    return hasVisibleViewBefore;
                }
                return false;
            }
            measureVertical(widthMeasureSpec, heightMeasureSpec) {
                this.mTotalLength = 0;
                let maxWidth = 0;
                let childState = 0;
                let alternativeMaxWidth = 0;
                let weightedMaxWidth = 0;
                let allFillParent = true;
                let totalWeight = 0;
                const count = this.getVirtualChildCount();
                const widthMode = MeasureSpec.getMode(widthMeasureSpec);
                const heightMode = MeasureSpec.getMode(heightMeasureSpec);
                let matchWidth = false;
                const baselineChildIndex = this.mBaselineAlignedChildIndex;
                const useLargestChild = this.mUseLargestChild;
                let largestChildHeight = Number.MIN_SAFE_INTEGER;
                for (let i = 0; i < count; ++i) {
                    const child = this.getVirtualChildAt(i);
                    if (child == null) {
                        this.mTotalLength += this.measureNullChild(i);
                        continue;
                    }
                    if (child.getVisibility() == View.GONE) {
                        i += this.getChildrenSkipCount(child, i);
                        continue;
                    }
                    if (this.hasDividerBeforeChildAt(i)) {
                        this.mTotalLength += this.mDividerHeight;
                    }
                    let lp = child.getLayoutParams();
                    totalWeight += lp.weight;
                    if (heightMode == MeasureSpec.EXACTLY && lp.height == 0 && lp.weight > 0) {
                        const totalLength = this.mTotalLength;
                        this.mTotalLength = Math.max(totalLength, totalLength + lp.topMargin + lp.bottomMargin);
                    }
                    else {
                        let oldHeight = Number.MIN_SAFE_INTEGER;
                        if (lp.height == 0 && lp.weight > 0) {
                            oldHeight = 0;
                            lp.height = LinearLayout.LayoutParams.WRAP_CONTENT;
                        }
                        this.measureChildBeforeLayout(child, i, widthMeasureSpec, 0, heightMeasureSpec, totalWeight == 0 ? this.mTotalLength : 0);
                        if (oldHeight != Number.MIN_SAFE_INTEGER) {
                            lp.height = oldHeight;
                        }
                        const childHeight = child.getMeasuredHeight();
                        const totalLength = this.mTotalLength;
                        this.mTotalLength = Math.max(totalLength, totalLength + childHeight + lp.topMargin +
                            lp.bottomMargin + this.getNextLocationOffset(child));
                        if (useLargestChild) {
                            largestChildHeight = Math.max(childHeight, largestChildHeight);
                        }
                    }
                    if ((baselineChildIndex >= 0) && (baselineChildIndex == i + 1)) {
                        this.mBaselineChildTop = this.mTotalLength;
                    }
                    if (i < baselineChildIndex && lp.weight > 0) {
                        throw new Error("A child of LinearLayout with index "
                            + "less than mBaselineAlignedChildIndex has weight > 0, which "
                            + "won't work.  Either remove the weight, or don't set "
                            + "mBaselineAlignedChildIndex.");
                    }
                    let matchWidthLocally = false;
                    if (widthMode != MeasureSpec.EXACTLY && lp.width == LinearLayout.LayoutParams.MATCH_PARENT) {
                        matchWidth = true;
                        matchWidthLocally = true;
                    }
                    const margin = lp.leftMargin + lp.rightMargin;
                    const measuredWidth = child.getMeasuredWidth() + margin;
                    maxWidth = Math.max(maxWidth, measuredWidth);
                    childState = LinearLayout.combineMeasuredStates(childState, child.getMeasuredState());
                    allFillParent = allFillParent && lp.width == LinearLayout.LayoutParams.MATCH_PARENT;
                    if (lp.weight > 0) {
                        weightedMaxWidth = Math.max(weightedMaxWidth, matchWidthLocally ? margin : measuredWidth);
                    }
                    else {
                        alternativeMaxWidth = Math.max(alternativeMaxWidth, matchWidthLocally ? margin : measuredWidth);
                    }
                    i += this.getChildrenSkipCount(child, i);
                }
                if (this.mTotalLength > 0 && this.hasDividerBeforeChildAt(count)) {
                    this.mTotalLength += this.mDividerHeight;
                }
                if (useLargestChild &&
                    (heightMode == MeasureSpec.AT_MOST || heightMode == MeasureSpec.UNSPECIFIED)) {
                    this.mTotalLength = 0;
                    for (let i = 0; i < count; ++i) {
                        const child = this.getVirtualChildAt(i);
                        if (child == null) {
                            this.mTotalLength += this.measureNullChild(i);
                            continue;
                        }
                        if (child.getVisibility() == View.GONE) {
                            i += this.getChildrenSkipCount(child, i);
                            continue;
                        }
                        const lp = child.getLayoutParams();
                        const totalLength = this.mTotalLength;
                        this.mTotalLength = Math.max(totalLength, totalLength + largestChildHeight +
                            lp.topMargin + lp.bottomMargin + this.getNextLocationOffset(child));
                    }
                }
                this.mTotalLength += this.mPaddingTop + this.mPaddingBottom;
                let heightSize = this.mTotalLength;
                heightSize = Math.max(heightSize, this.getSuggestedMinimumHeight());
                let heightSizeAndState = LinearLayout.resolveSizeAndState(heightSize, heightMeasureSpec, 0);
                heightSize = heightSizeAndState & View.MEASURED_SIZE_MASK;
                let delta = heightSize - this.mTotalLength;
                if (delta != 0 && totalWeight > 0) {
                    let weightSum = this.mWeightSum > 0 ? this.mWeightSum : totalWeight;
                    this.mTotalLength = 0;
                    for (let i = 0; i < count; ++i) {
                        const child = this.getVirtualChildAt(i);
                        if (child.getVisibility() == View.GONE) {
                            continue;
                        }
                        let lp = child.getLayoutParams();
                        let childExtra = lp.weight;
                        if (childExtra > 0) {
                            let share = (childExtra * delta / weightSum);
                            weightSum -= childExtra;
                            delta -= share;
                            const childWidthMeasureSpec = LinearLayout.getChildMeasureSpec(widthMeasureSpec, this.mPaddingLeft + this.mPaddingRight +
                                lp.leftMargin + lp.rightMargin, lp.width);
                            if ((lp.height != 0) || (heightMode != MeasureSpec.EXACTLY)) {
                                let childHeight = child.getMeasuredHeight() + share;
                                if (childHeight < 0) {
                                    childHeight = 0;
                                }
                                child.measure(childWidthMeasureSpec, MeasureSpec.makeMeasureSpec(childHeight, MeasureSpec.EXACTLY));
                            }
                            else {
                                child.measure(childWidthMeasureSpec, MeasureSpec.makeMeasureSpec(share > 0 ? share : 0, MeasureSpec.EXACTLY));
                            }
                            childState = LinearLayout.combineMeasuredStates(childState, child.getMeasuredState()
                                & (View.MEASURED_STATE_MASK >> View.MEASURED_HEIGHT_STATE_SHIFT));
                        }
                        const margin = lp.leftMargin + lp.rightMargin;
                        const measuredWidth = child.getMeasuredWidth() + margin;
                        maxWidth = Math.max(maxWidth, measuredWidth);
                        let matchWidthLocally = widthMode != MeasureSpec.EXACTLY &&
                            lp.width == LinearLayout.LayoutParams.MATCH_PARENT;
                        alternativeMaxWidth = Math.max(alternativeMaxWidth, matchWidthLocally ? margin : measuredWidth);
                        allFillParent = allFillParent && lp.width == LinearLayout.LayoutParams.MATCH_PARENT;
                        const totalLength = this.mTotalLength;
                        this.mTotalLength = Math.max(totalLength, totalLength + child.getMeasuredHeight() +
                            lp.topMargin + lp.bottomMargin + this.getNextLocationOffset(child));
                    }
                    this.mTotalLength += this.mPaddingTop + this.mPaddingBottom;
                }
                else {
                    alternativeMaxWidth = Math.max(alternativeMaxWidth, weightedMaxWidth);
                    if (useLargestChild && heightMode != MeasureSpec.EXACTLY) {
                        for (let i = 0; i < count; i++) {
                            const child = this.getVirtualChildAt(i);
                            if (child == null || child.getVisibility() == View.GONE) {
                                continue;
                            }
                            const lp = child.getLayoutParams();
                            let childExtra = lp.weight;
                            if (childExtra > 0) {
                                child.measure(MeasureSpec.makeMeasureSpec(child.getMeasuredWidth(), MeasureSpec.EXACTLY), MeasureSpec.makeMeasureSpec(largestChildHeight, MeasureSpec.EXACTLY));
                            }
                        }
                    }
                }
                if (!allFillParent && widthMode != MeasureSpec.EXACTLY) {
                    maxWidth = alternativeMaxWidth;
                }
                maxWidth += this.mPaddingLeft + this.mPaddingRight;
                maxWidth = Math.max(maxWidth, this.getSuggestedMinimumWidth());
                this.setMeasuredDimension(LinearLayout.resolveSizeAndState(maxWidth, widthMeasureSpec, childState), heightSizeAndState);
                if (matchWidth) {
                    this.forceUniformWidth(count, heightMeasureSpec);
                }
            }
            forceUniformWidth(count, heightMeasureSpec) {
                let uniformMeasureSpec = MeasureSpec.makeMeasureSpec(this.getMeasuredWidth(), MeasureSpec.EXACTLY);
                for (let i = 0; i < count; ++i) {
                    const child = this.getVirtualChildAt(i);
                    if (child.getVisibility() != View.GONE) {
                        let lp = child.getLayoutParams();
                        if (lp.width == LinearLayout.LayoutParams.MATCH_PARENT) {
                            let oldHeight = lp.height;
                            lp.height = child.getMeasuredHeight();
                            this.measureChildWithMargins(child, uniformMeasureSpec, 0, heightMeasureSpec, 0);
                            lp.height = oldHeight;
                        }
                    }
                }
            }
            measureHorizontal(widthMeasureSpec, heightMeasureSpec) {
                this.mTotalLength = 0;
                let maxHeight = 0;
                let childState = 0;
                let alternativeMaxHeight = 0;
                let weightedMaxHeight = 0;
                let allFillParent = true;
                let totalWeight = 0;
                const count = this.getVirtualChildCount();
                const widthMode = MeasureSpec.getMode(widthMeasureSpec);
                const heightMode = MeasureSpec.getMode(heightMeasureSpec);
                let matchHeight = false;
                if (this.mMaxAscent == null || this.mMaxDescent == null) {
                    this.mMaxAscent = new Array(LinearLayout.VERTICAL_GRAVITY_COUNT);
                    this.mMaxDescent = new Array(LinearLayout.VERTICAL_GRAVITY_COUNT);
                }
                let maxAscent = this.mMaxAscent;
                let maxDescent = this.mMaxDescent;
                maxAscent[0] = maxAscent[1] = maxAscent[2] = maxAscent[3] = -1;
                maxDescent[0] = maxDescent[1] = maxDescent[2] = maxDescent[3] = -1;
                const baselineAligned = this.mBaselineAligned;
                const useLargestChild = this.mUseLargestChild;
                const isExactly = widthMode == MeasureSpec.EXACTLY;
                let largestChildWidth = Number.MAX_SAFE_INTEGER;
                for (let i = 0; i < count; ++i) {
                    const child = this.getVirtualChildAt(i);
                    if (child == null) {
                        this.mTotalLength += this.measureNullChild(i);
                        continue;
                    }
                    if (child.getVisibility() == View.GONE) {
                        i += this.getChildrenSkipCount(child, i);
                        continue;
                    }
                    if (this.hasDividerBeforeChildAt(i)) {
                        this.mTotalLength += this.mDividerWidth;
                    }
                    const lp = child.getLayoutParams();
                    totalWeight += lp.weight;
                    if (widthMode == MeasureSpec.EXACTLY && lp.width == 0 && lp.weight > 0) {
                        if (isExactly) {
                            this.mTotalLength += lp.leftMargin + lp.rightMargin;
                        }
                        else {
                            const totalLength = this.mTotalLength;
                            this.mTotalLength = Math.max(totalLength, totalLength +
                                lp.leftMargin + lp.rightMargin);
                        }
                        if (baselineAligned) {
                            const freeSpec = MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED);
                            child.measure(freeSpec, freeSpec);
                        }
                    }
                    else {
                        let oldWidth = Number.MIN_SAFE_INTEGER;
                        if (lp.width == 0 && lp.weight > 0) {
                            oldWidth = 0;
                            lp.width = LinearLayout.LayoutParams.WRAP_CONTENT;
                        }
                        this.measureChildBeforeLayout(child, i, widthMeasureSpec, totalWeight == 0 ? this.mTotalLength : 0, heightMeasureSpec, 0);
                        if (oldWidth != Number.MIN_SAFE_INTEGER) {
                            lp.width = oldWidth;
                        }
                        const childWidth = child.getMeasuredWidth();
                        if (isExactly) {
                            this.mTotalLength += childWidth + lp.leftMargin + lp.rightMargin +
                                this.getNextLocationOffset(child);
                        }
                        else {
                            const totalLength = this.mTotalLength;
                            this.mTotalLength = Math.max(totalLength, totalLength + childWidth + lp.leftMargin +
                                lp.rightMargin + this.getNextLocationOffset(child));
                        }
                        if (useLargestChild) {
                            largestChildWidth = Math.max(childWidth, largestChildWidth);
                        }
                    }
                    let matchHeightLocally = false;
                    if (heightMode != MeasureSpec.EXACTLY && lp.height == LinearLayout.LayoutParams.MATCH_PARENT) {
                        matchHeight = true;
                        matchHeightLocally = true;
                    }
                    const margin = lp.topMargin + lp.bottomMargin;
                    const childHeight = child.getMeasuredHeight() + margin;
                    childState = LinearLayout.combineMeasuredStates(childState, child.getMeasuredState());
                    if (baselineAligned) {
                        const childBaseline = child.getBaseline();
                        if (childBaseline != -1) {
                            const gravity = (lp.gravity < 0 ? this.mGravity : lp.gravity)
                                & Gravity.VERTICAL_GRAVITY_MASK;
                            const index = ((gravity >> Gravity.AXIS_Y_SHIFT)
                                & ~Gravity.AXIS_SPECIFIED) >> 1;
                            maxAscent[index] = Math.max(maxAscent[index], childBaseline);
                            maxDescent[index] = Math.max(maxDescent[index], childHeight - childBaseline);
                        }
                    }
                    maxHeight = Math.max(maxHeight, childHeight);
                    allFillParent = allFillParent && lp.height == LinearLayout.LayoutParams.MATCH_PARENT;
                    if (lp.weight > 0) {
                        weightedMaxHeight = Math.max(weightedMaxHeight, matchHeightLocally ? margin : childHeight);
                    }
                    else {
                        alternativeMaxHeight = Math.max(alternativeMaxHeight, matchHeightLocally ? margin : childHeight);
                    }
                    i += this.getChildrenSkipCount(child, i);
                }
                if (this.mTotalLength > 0 && this.hasDividerBeforeChildAt(count)) {
                    this.mTotalLength += this.mDividerWidth;
                }
                if (maxAscent[LinearLayout.INDEX_TOP] != -1 ||
                    maxAscent[LinearLayout.INDEX_CENTER_VERTICAL] != -1 ||
                    maxAscent[LinearLayout.INDEX_BOTTOM] != -1 ||
                    maxAscent[LinearLayout.INDEX_FILL] != -1) {
                    const ascent = Math.max(maxAscent[LinearLayout.INDEX_FILL], Math.max(maxAscent[LinearLayout.INDEX_CENTER_VERTICAL], Math.max(maxAscent[LinearLayout.INDEX_TOP], maxAscent[LinearLayout.INDEX_BOTTOM])));
                    const descent = Math.max(maxDescent[LinearLayout.INDEX_FILL], Math.max(maxDescent[LinearLayout.INDEX_CENTER_VERTICAL], Math.max(maxDescent[LinearLayout.INDEX_TOP], maxDescent[LinearLayout.INDEX_BOTTOM])));
                    maxHeight = Math.max(maxHeight, ascent + descent);
                }
                if (useLargestChild &&
                    (widthMode == MeasureSpec.AT_MOST || widthMode == MeasureSpec.UNSPECIFIED)) {
                    this.mTotalLength = 0;
                    for (let i = 0; i < count; ++i) {
                        const child = this.getVirtualChildAt(i);
                        if (child == null) {
                            this.mTotalLength += this.measureNullChild(i);
                            continue;
                        }
                        if (child.getVisibility() == View.GONE) {
                            i += this.getChildrenSkipCount(child, i);
                            continue;
                        }
                        const lp = child.getLayoutParams();
                        if (isExactly) {
                            this.mTotalLength += largestChildWidth + lp.leftMargin + lp.rightMargin +
                                this.getNextLocationOffset(child);
                        }
                        else {
                            const totalLength = this.mTotalLength;
                            this.mTotalLength = Math.max(totalLength, totalLength + largestChildWidth +
                                lp.leftMargin + lp.rightMargin + this.getNextLocationOffset(child));
                        }
                    }
                }
                this.mTotalLength += this.mPaddingLeft + this.mPaddingRight;
                let widthSize = this.mTotalLength;
                widthSize = Math.max(widthSize, this.getSuggestedMinimumWidth());
                let widthSizeAndState = LinearLayout.resolveSizeAndState(widthSize, widthMeasureSpec, 0);
                widthSize = widthSizeAndState & View.MEASURED_SIZE_MASK;
                let delta = widthSize - this.mTotalLength;
                if (delta != 0 && totalWeight > 0) {
                    let weightSum = this.mWeightSum > 0 ? this.mWeightSum : totalWeight;
                    maxAscent[0] = maxAscent[1] = maxAscent[2] = maxAscent[3] = -1;
                    maxDescent[0] = maxDescent[1] = maxDescent[2] = maxDescent[3] = -1;
                    maxHeight = -1;
                    this.mTotalLength = 0;
                    for (let i = 0; i < count; ++i) {
                        const child = this.getVirtualChildAt(i);
                        if (child == null || child.getVisibility() == View.GONE) {
                            continue;
                        }
                        const lp = child.getLayoutParams();
                        let childExtra = lp.weight;
                        if (childExtra > 0) {
                            let share = (childExtra * delta / weightSum);
                            weightSum -= childExtra;
                            delta -= share;
                            const childHeightMeasureSpec = LinearLayout.getChildMeasureSpec(heightMeasureSpec, this.mPaddingTop + this.mPaddingBottom + lp.topMargin + lp.bottomMargin, lp.height);
                            if ((lp.width != 0) || (widthMode != MeasureSpec.EXACTLY)) {
                                let childWidth = child.getMeasuredWidth() + share;
                                if (childWidth < 0) {
                                    childWidth = 0;
                                }
                                child.measure(MeasureSpec.makeMeasureSpec(childWidth, MeasureSpec.EXACTLY), childHeightMeasureSpec);
                            }
                            else {
                                child.measure(MeasureSpec.makeMeasureSpec(share > 0 ? share : 0, MeasureSpec.EXACTLY), childHeightMeasureSpec);
                            }
                            childState = LinearLayout.combineMeasuredStates(childState, child.getMeasuredState() & View.MEASURED_STATE_MASK);
                        }
                        if (isExactly) {
                            this.mTotalLength += child.getMeasuredWidth() + lp.leftMargin + lp.rightMargin +
                                this.getNextLocationOffset(child);
                        }
                        else {
                            const totalLength = this.mTotalLength;
                            this.mTotalLength = Math.max(totalLength, totalLength + child.getMeasuredWidth() +
                                lp.leftMargin + lp.rightMargin + this.getNextLocationOffset(child));
                        }
                        let matchHeightLocally = heightMode != MeasureSpec.EXACTLY &&
                            lp.height == LinearLayout.LayoutParams.MATCH_PARENT;
                        const margin = lp.topMargin + lp.bottomMargin;
                        let childHeight = child.getMeasuredHeight() + margin;
                        maxHeight = Math.max(maxHeight, childHeight);
                        alternativeMaxHeight = Math.max(alternativeMaxHeight, matchHeightLocally ? margin : childHeight);
                        allFillParent = allFillParent && lp.height == LinearLayout.LayoutParams.MATCH_PARENT;
                        if (baselineAligned) {
                            const childBaseline = child.getBaseline();
                            if (childBaseline != -1) {
                                const gravity = (lp.gravity < 0 ? this.mGravity : lp.gravity)
                                    & Gravity.VERTICAL_GRAVITY_MASK;
                                const index = ((gravity >> Gravity.AXIS_Y_SHIFT)
                                    & ~Gravity.AXIS_SPECIFIED) >> 1;
                                maxAscent[index] = Math.max(maxAscent[index], childBaseline);
                                maxDescent[index] = Math.max(maxDescent[index], childHeight - childBaseline);
                            }
                        }
                    }
                    this.mTotalLength += this.mPaddingLeft + this.mPaddingRight;
                    if (maxAscent[LinearLayout.INDEX_TOP] != -1 ||
                        maxAscent[LinearLayout.INDEX_CENTER_VERTICAL] != -1 ||
                        maxAscent[LinearLayout.INDEX_BOTTOM] != -1 ||
                        maxAscent[LinearLayout.INDEX_FILL] != -1) {
                        const ascent = Math.max(maxAscent[LinearLayout.INDEX_FILL], Math.max(maxAscent[LinearLayout.INDEX_CENTER_VERTICAL], Math.max(maxAscent[LinearLayout.INDEX_TOP], maxAscent[LinearLayout.INDEX_BOTTOM])));
                        const descent = Math.max(maxDescent[LinearLayout.INDEX_FILL], Math.max(maxDescent[LinearLayout.INDEX_CENTER_VERTICAL], Math.max(maxDescent[LinearLayout.INDEX_TOP], maxDescent[LinearLayout.INDEX_BOTTOM])));
                        maxHeight = Math.max(maxHeight, ascent + descent);
                    }
                }
                else {
                    alternativeMaxHeight = Math.max(alternativeMaxHeight, weightedMaxHeight);
                    if (useLargestChild && widthMode != MeasureSpec.EXACTLY) {
                        for (let i = 0; i < count; i++) {
                            const child = this.getVirtualChildAt(i);
                            if (child == null || child.getVisibility() == View.GONE) {
                                continue;
                            }
                            const lp = child.getLayoutParams();
                            let childExtra = lp.weight;
                            if (childExtra > 0) {
                                child.measure(MeasureSpec.makeMeasureSpec(largestChildWidth, MeasureSpec.EXACTLY), MeasureSpec.makeMeasureSpec(child.getMeasuredHeight(), MeasureSpec.EXACTLY));
                            }
                        }
                    }
                }
                if (!allFillParent && heightMode != MeasureSpec.EXACTLY) {
                    maxHeight = alternativeMaxHeight;
                }
                maxHeight += this.mPaddingTop + this.mPaddingBottom;
                maxHeight = Math.max(maxHeight, this.getSuggestedMinimumHeight());
                this.setMeasuredDimension(widthSizeAndState | (childState & View.MEASURED_STATE_MASK), LinearLayout.resolveSizeAndState(maxHeight, heightMeasureSpec, (childState << View.MEASURED_HEIGHT_STATE_SHIFT)));
                if (matchHeight) {
                    this.forceUniformHeight(count, widthMeasureSpec);
                }
            }
            forceUniformHeight(count, widthMeasureSpec) {
                let uniformMeasureSpec = MeasureSpec.makeMeasureSpec(this.getMeasuredHeight(), MeasureSpec.EXACTLY);
                for (let i = 0; i < count; ++i) {
                    const child = this.getVirtualChildAt(i);
                    if (child.getVisibility() != View.GONE) {
                        let lp = child.getLayoutParams();
                        if (lp.height == LinearLayout.LayoutParams.MATCH_PARENT) {
                            let oldWidth = lp.width;
                            lp.width = child.getMeasuredWidth();
                            this.measureChildWithMargins(child, widthMeasureSpec, 0, uniformMeasureSpec, 0);
                            lp.width = oldWidth;
                        }
                    }
                }
            }
            getChildrenSkipCount(child, index) {
                return 0;
            }
            measureNullChild(childIndex) {
                return 0;
            }
            measureChildBeforeLayout(child, childIndex, widthMeasureSpec, totalWidth, heightMeasureSpec, totalHeight) {
                this.measureChildWithMargins(child, widthMeasureSpec, totalWidth, heightMeasureSpec, totalHeight);
            }
            getLocationOffset(child) {
                return 0;
            }
            getNextLocationOffset(child) {
                return 0;
            }
            onLayout(changed, l, t, r, b) {
                if (this.mOrientation == LinearLayout.VERTICAL) {
                    this.layoutVertical(l, t, r, b);
                }
                else {
                    this.layoutHorizontal(l, t, r, b);
                }
            }
            layoutVertical(left, top, right, bottom) {
                const paddingLeft = this.mPaddingLeft;
                let childTop;
                let childLeft;
                const width = right - left;
                let childRight = width - this.mPaddingRight;
                let childSpace = width - paddingLeft - this.mPaddingRight;
                const count = this.getVirtualChildCount();
                const majorGravity = this.mGravity & Gravity.VERTICAL_GRAVITY_MASK;
                const minorGravity = this.mGravity & Gravity.HORIZONTAL_GRAVITY_MASK;
                switch (majorGravity) {
                    case Gravity.BOTTOM:
                        childTop = this.mPaddingTop + bottom - top - this.mTotalLength;
                        break;
                    case Gravity.CENTER_VERTICAL:
                        childTop = this.mPaddingTop + (bottom - top - this.mTotalLength) / 2;
                        break;
                    case Gravity.TOP:
                    default:
                        childTop = this.mPaddingTop;
                        break;
                }
                for (let i = 0; i < count; i++) {
                    const child = this.getVirtualChildAt(i);
                    if (child == null) {
                        childTop += this.measureNullChild(i);
                    }
                    else if (child.getVisibility() != View.GONE) {
                        const childWidth = child.getMeasuredWidth();
                        const childHeight = child.getMeasuredHeight();
                        const lp = child.getLayoutParams();
                        let gravity = lp.gravity;
                        if (gravity < 0) {
                            gravity = minorGravity;
                        }
                        const absoluteGravity = gravity;
                        switch (absoluteGravity & Gravity.HORIZONTAL_GRAVITY_MASK) {
                            case Gravity.CENTER_HORIZONTAL:
                                childLeft = paddingLeft + ((childSpace - childWidth) / 2)
                                    + lp.leftMargin - lp.rightMargin;
                                break;
                            case Gravity.RIGHT:
                                childLeft = childRight - childWidth - lp.rightMargin;
                                break;
                            case Gravity.LEFT:
                            default:
                                childLeft = paddingLeft + lp.leftMargin;
                                break;
                        }
                        if (this.hasDividerBeforeChildAt(i)) {
                            childTop += this.mDividerHeight;
                        }
                        childTop += lp.topMargin;
                        this.setChildFrame(child, childLeft, childTop + this.getLocationOffset(child), childWidth, childHeight);
                        childTop += childHeight + lp.bottomMargin + this.getNextLocationOffset(child);
                        i += this.getChildrenSkipCount(child, i);
                    }
                }
            }
            layoutHorizontal(left, top, right, bottom) {
                const isLayoutRtl = this.isLayoutRtl();
                const paddingTop = this.mPaddingTop;
                let childTop;
                let childLeft;
                const height = bottom - top;
                let childBottom = height - this.mPaddingBottom;
                let childSpace = height - paddingTop - this.mPaddingBottom;
                const count = this.getVirtualChildCount();
                const majorGravity = this.mGravity & Gravity.HORIZONTAL_GRAVITY_MASK;
                const minorGravity = this.mGravity & Gravity.VERTICAL_GRAVITY_MASK;
                const baselineAligned = this.mBaselineAligned;
                const maxAscent = this.mMaxAscent;
                const maxDescent = this.mMaxDescent;
                let absoluteGravity = majorGravity;
                switch (absoluteGravity) {
                    case Gravity.RIGHT:
                        childLeft = this.mPaddingLeft + right - left - this.mTotalLength;
                        break;
                    case Gravity.CENTER_HORIZONTAL:
                        childLeft = this.mPaddingLeft + (right - left - this.mTotalLength) / 2;
                        break;
                    case Gravity.LEFT:
                    default:
                        childLeft = this.mPaddingLeft;
                        break;
                }
                let start = 0;
                let dir = 1;
                if (isLayoutRtl) {
                    start = count - 1;
                    dir = -1;
                }
                for (let i = 0; i < count; i++) {
                    let childIndex = start + dir * i;
                    const child = this.getVirtualChildAt(childIndex);
                    if (child == null) {
                        childLeft += this.measureNullChild(childIndex);
                    }
                    else if (child.getVisibility() != View.GONE) {
                        const childWidth = child.getMeasuredWidth();
                        const childHeight = child.getMeasuredHeight();
                        let childBaseline = -1;
                        const lp = child.getLayoutParams();
                        if (baselineAligned && lp.height != LinearLayout.LayoutParams.MATCH_PARENT) {
                            childBaseline = child.getBaseline();
                        }
                        let gravity = lp.gravity;
                        if (gravity < 0) {
                            gravity = minorGravity;
                        }
                        switch (gravity & Gravity.VERTICAL_GRAVITY_MASK) {
                            case Gravity.TOP:
                                childTop = paddingTop + lp.topMargin;
                                if (childBaseline != -1) {
                                    childTop += maxAscent[LinearLayout.INDEX_TOP] - childBaseline;
                                }
                                break;
                            case Gravity.CENTER_VERTICAL:
                                childTop = paddingTop + ((childSpace - childHeight) / 2)
                                    + lp.topMargin - lp.bottomMargin;
                                break;
                            case Gravity.BOTTOM:
                                childTop = childBottom - childHeight - lp.bottomMargin;
                                if (childBaseline != -1) {
                                    let descent = child.getMeasuredHeight() - childBaseline;
                                    childTop -= (maxDescent[LinearLayout.INDEX_BOTTOM] - descent);
                                }
                                break;
                            default:
                                childTop = paddingTop;
                                break;
                        }
                        if (this.hasDividerBeforeChildAt(childIndex)) {
                            childLeft += this.mDividerWidth;
                        }
                        childLeft += lp.leftMargin;
                        this.setChildFrame(child, childLeft + this.getLocationOffset(child), childTop, childWidth, childHeight);
                        childLeft += childWidth + lp.rightMargin +
                            this.getNextLocationOffset(child);
                        i += this.getChildrenSkipCount(child, childIndex);
                    }
                }
            }
            setChildFrame(child, left, top, width, height) {
                child.layout(left, top, left + width, top + height);
            }
            setOrientation(orientation) {
                if (typeof orientation === 'string') {
                    if ('VERTICAL' === (orientation + '').toUpperCase())
                        orientation = LinearLayout.VERTICAL;
                    else if ('HORIZONTAL' === (orientation + '').toUpperCase())
                        orientation = LinearLayout.HORIZONTAL;
                }
                if (this.mOrientation != orientation) {
                    this.mOrientation = orientation;
                    this.requestLayout();
                }
            }
            getOrientation() {
                return this.mOrientation;
            }
            setGravity(gravity) {
                if (this.mGravity != gravity) {
                    if ((gravity & Gravity.HORIZONTAL_GRAVITY_MASK) == 0) {
                        gravity |= Gravity.LEFT;
                    }
                    if ((gravity & Gravity.VERTICAL_GRAVITY_MASK) == 0) {
                        gravity |= Gravity.TOP;
                    }
                    this.mGravity = gravity;
                    this.requestLayout();
                }
            }
            setHorizontalGravity(horizontalGravity) {
                const gravity = horizontalGravity & Gravity.HORIZONTAL_GRAVITY_MASK;
                if ((this.mGravity & Gravity.HORIZONTAL_GRAVITY_MASK) != gravity) {
                    this.mGravity = (this.mGravity & ~Gravity.HORIZONTAL_GRAVITY_MASK) | gravity;
                    this.requestLayout();
                }
            }
            setVerticalGravity(verticalGravity) {
                const gravity = verticalGravity & Gravity.VERTICAL_GRAVITY_MASK;
                if ((this.mGravity & Gravity.VERTICAL_GRAVITY_MASK) != gravity) {
                    this.mGravity = (this.mGravity & ~Gravity.VERTICAL_GRAVITY_MASK) | gravity;
                    this.requestLayout();
                }
            }
            generateDefaultLayoutParams() {
                let LayoutParams = LinearLayout.LayoutParams;
                if (this.mOrientation == LinearLayout.HORIZONTAL) {
                    return new LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
                }
                else if (this.mOrientation == LinearLayout.VERTICAL) {
                    return new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
                }
                return super.generateDefaultLayoutParams();
            }
            generateLayoutParams(p) {
                return new LinearLayout.LayoutParams(p);
            }
            checkLayoutParams(p) {
                return p instanceof LinearLayout.LayoutParams;
            }
        }
        LinearLayout.HORIZONTAL = 0;
        LinearLayout.VERTICAL = 1;
        LinearLayout.SHOW_DIVIDER_NONE = 0;
        LinearLayout.SHOW_DIVIDER_BEGINNING = 1;
        LinearLayout.SHOW_DIVIDER_MIDDLE = 2;
        LinearLayout.SHOW_DIVIDER_END = 4;
        LinearLayout.VERTICAL_GRAVITY_COUNT = 4;
        LinearLayout.INDEX_CENTER_VERTICAL = 0;
        LinearLayout.INDEX_TOP = 1;
        LinearLayout.INDEX_BOTTOM = 2;
        LinearLayout.INDEX_FILL = 3;
        widget.LinearLayout = LinearLayout;
        (function (LinearLayout) {
            class LayoutParams extends android.view.ViewGroup.MarginLayoutParams {
                constructor(...args) {
                    super();
                    this.weight = 0;
                    this.gravity = -1;
                    if (args.length === 1 && args[0] instanceof LayoutParams) {
                        this.gravity = args[0].gravity;
                    }
                    else {
                        let [width, height, weight = 0] = args;
                        super(width, height);
                        this.weight = weight;
                    }
                }
                _createAttrChangeHandler(mergeHandler) {
                    super._createAttrChangeHandler(mergeHandler);
                    let params = this;
                    mergeHandler.add({
                        set gravity(value) {
                            params.gravity = View.AttrChangeHandler.parseGravity(value, params.gravity);
                        },
                        get gravity() {
                            return params.gravity;
                        },
                        set weight(value) {
                            value = Number.parseInt(value);
                            if (Number.isInteger(value))
                                params.weight = value;
                        },
                        get weight() {
                            return params.weight;
                        }
                    });
                }
            }
            LinearLayout.LayoutParams = LayoutParams;
        })(LinearLayout = widget.LinearLayout || (widget.LinearLayout = {}));
    })(widget = android.widget || (android.widget = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/26.
 */
///<reference path="../view/View.ts"/>
///<reference path="../view/Gravity.ts"/>
///<reference path="../content/res/Resources.ts"/>
///<reference path="../graphics/Color.ts"/>
///<reference path="../content/res/ColorStateList.ts"/>
///<reference path="../util/TypedValue.ts"/>
var android;
(function (android) {
    var widget;
    (function (widget) {
        var View = android.view.View;
        var Gravity = android.view.Gravity;
        var Resources = android.content.res.Resources;
        var Color = android.graphics.Color;
        var ColorStateList = android.content.res.ColorStateList;
        var MeasureSpec = View.MeasureSpec;
        var TypedValue = android.util.TypedValue;
        class TextView extends View {
            constructor() {
                super();
                this.mSingleLine = false;
                this.mTextColor = ColorStateList.valueOf(Color.BLACK);
                this.mCurTextColor = Color.BLACK;
                this.mHintColor = Color.LTGRAY;
                this.mSpacingMult = 1.2;
                this.mSpacingAdd = 0;
                this.mMaxWidth = Number.MAX_SAFE_INTEGER;
                this.mMaxHeight = Number.MAX_SAFE_INTEGER;
                this.mMaxLineCount = Number.MAX_SAFE_INTEGER;
                this.mMinLineCount = 0;
                this.initTextElement();
                this.setTextSize(TextView.Default_TextSize);
                this.setGravity(Gravity.TOP | Gravity.LEFT);
                this.setTextColor(new DefaultStyleTextColor());
            }
            createAttrChangeHandler(mergeHandler) {
                super.createAttrChangeHandler(mergeHandler);
                let textView = this;
                mergeHandler.add({
                    set enabled(value) {
                        textView.setEnabled(mergeHandler.parseBoolean(value, true));
                    },
                    get enabled() {
                        return textView.isEnabled();
                    },
                    set textColorHighlight(value) {
                    },
                    set textColor(value) {
                        let colorList = mergeHandler.parseColorList(value);
                        if (colorList instanceof ColorStateList) {
                            textView.setTextColor(colorList);
                            return;
                        }
                        let color = mergeHandler.parseColor(value);
                        if (Number.isInteger(color))
                            textView.setTextColor(color);
                    },
                    get textColor() {
                        if (textView.mTextColor.isStateful())
                            return textView.mTextColor;
                        return textView.mTextColor.getDefaultColor();
                    },
                    set textColorHint(value) {
                    },
                    set textSize(value) {
                        if (value !== undefined && value !== null) {
                            value = TypedValue.complexToDimensionPixelSize(value, 0, Resources.getDisplayMetrics());
                            textView.setTextSize(value);
                        }
                    },
                    get textSize() {
                        return textView.mTextSize;
                    },
                    set textStyle(value) {
                    },
                    set textAllCaps(value) {
                    },
                    set drawableLeft(value) {
                    },
                    set drawableTop(value) {
                    },
                    set drawableRight(value) {
                    },
                    set drawableBottom(value) {
                    },
                    set drawablePadding(value) {
                    },
                    set maxLines(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value))
                            textView.setMaxLines(value);
                    },
                    get maxLines() {
                        return textView.mMaxLineCount;
                    },
                    set maxHeight(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value))
                            textView.setMaxHeight(value);
                    },
                    get maxHeight() {
                        return textView.mMaxHeight;
                    },
                    set lines(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value))
                            textView.setLines(value);
                    },
                    get lines() {
                        if (textView.mMaxLineCount === textView.mMinLineCount)
                            return textView.mMaxLineCount;
                        return null;
                    },
                    set height(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value))
                            textView.setHeight(value);
                    },
                    get height() {
                        if (textView.mMaxHeight === textView.getMinimumHeight())
                            return textView.mMaxHeight;
                        return null;
                    },
                    set minLines(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value))
                            textView.setMinLines(value);
                    },
                    get minLines() {
                        return textView.mMinLineCount;
                    },
                    set minHeight(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value))
                            textView.setMinimumHeight(value);
                    },
                    set maxWidth(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value))
                            textView.setMaxWidth(value);
                    },
                    get maxWidth() {
                        return textView.mMaxWidth;
                    },
                    set width(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value))
                            textView.setWidth(value);
                    },
                    get width() {
                        if (textView.mMinWidth === textView.mMaxWidth)
                            return textView.mMinWidth;
                        return null;
                    },
                    set gravity(value) {
                        textView.setGravity(View.AttrChangeHandler.parseGravity(value, textView.mGravity));
                    },
                    get gravity() {
                        return textView.mGravity;
                    },
                    set text(value) {
                        textView.setText(value);
                    },
                    get text() {
                        return textView.getText();
                    },
                    set singleLine(value) {
                        if (View.AttrChangeHandler.parseBoolean(value, false))
                            textView.setSingleLine();
                    },
                    get singleLine() {
                        if (textView.mMinLineCount === 1 && textView.mMaxLineCount === 1)
                            return true;
                        return false;
                    },
                    set textScaleX(value) {
                    },
                    set lineSpacingExtra(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value))
                            textView.setLineSpacing(value, textView.mSpacingMult);
                    },
                    get lineSpacingExtra() {
                        return textView.mSpacingAdd;
                    },
                    set lineSpacingMultiplier(value) {
                        value = Number.parseInt(value);
                        if (Number.isInteger(value))
                            textView.setLineSpacing(textView.mSpacingAdd, value);
                    },
                    get lineSpacingMultiplier() {
                        return textView.mSpacingMult;
                    },
                });
            }
            initTextElement() {
                this.mTextElement = document.createElement('div');
                this.mTextElement.style.position = "absolute";
                this.mTextElement.style.boxSizing = "border-box";
                this.mTextElement.style.overflow = "hidden";
                this.mTextElement.style.opacity = "0";
            }
            onLayout(changed, left, top, right, bottom) {
                super.onLayout(changed, left, top, right, bottom);
                this.mTextElement.style.opacity = "";
            }
            onFinishInflate() {
                super.onFinishInflate();
                Array.from(this.bindElement.childNodes).forEach((item) => {
                    this.bindElement.removeChild(item);
                    this.mTextElement.appendChild(item);
                });
                this.bindElement.appendChild(this.mTextElement);
            }
            onMeasure(widthMeasureSpec, heightMeasureSpec) {
                let widthMode = MeasureSpec.getMode(widthMeasureSpec);
                let heightMode = MeasureSpec.getMode(heightMeasureSpec);
                let widthSize = MeasureSpec.getSize(widthMeasureSpec);
                let heightSize = MeasureSpec.getSize(heightMeasureSpec);
                let width, height;
                let padLeft = this.getCompoundPaddingLeft();
                let padTop = this.getCompoundPaddingTop();
                let padRight = this.getCompoundPaddingRight();
                let padBottom = this.getCompoundPaddingBottom();
                this.mTextElement.style.height = "";
                this.mTextElement.style.width = "";
                this.mTextElement.style.left = -Resources.getDisplayMetrics().widthPixels + 'px';
                this.mTextElement.style.top = "";
                if (widthMode == MeasureSpec.EXACTLY) {
                    width = widthSize;
                }
                else {
                    width = this.mTextElement.offsetWidth + 2;
                    width += padLeft + padRight;
                    width = Math.min(width, this.mMaxWidth);
                    width = Math.max(width, this.getSuggestedMinimumWidth());
                    if (widthMode == MeasureSpec.AT_MOST) {
                        width = Math.min(widthSize, width);
                    }
                }
                let unpaddedWidth = width - padLeft - padRight;
                this.mTextElement.style.width = unpaddedWidth + "px";
                this.mTextElement.style.left = padLeft + "px";
                if (heightMode == MeasureSpec.EXACTLY) {
                    height = heightSize;
                    let pad = this.getCompoundPaddingTop() + this.getCompoundPaddingBottom();
                    if (this.mMaxLineCount < Number.MAX_SAFE_INTEGER) {
                        let maxHeightWithLineCount = pad + this.mMaxLineCount * this.getLineHeight();
                        height = Math.min(maxHeightWithLineCount, height);
                    }
                }
                else {
                    let desired = this.getDesiredHeight();
                    height = desired;
                    if (heightMode == MeasureSpec.AT_MOST) {
                        height = Math.min(desired, heightSize);
                    }
                }
                let contextHeight = height - padTop - padBottom;
                let textHeight = this.mTextElement.offsetHeight;
                let finalTop = padTop;
                if (textHeight < contextHeight) {
                    const verticalGravity = this.mGravity & Gravity.VERTICAL_GRAVITY_MASK;
                    switch (verticalGravity) {
                        case Gravity.CENTER_VERTICAL:
                            finalTop += (contextHeight - textHeight) / 2;
                            break;
                        case Gravity.BOTTOM:
                            finalTop += (contextHeight - textHeight);
                            break;
                        case Gravity.TOP:
                            break;
                    }
                    contextHeight = textHeight;
                }
                this.mTextElement.style.height = contextHeight + "px";
                this.mTextElement.style.top = finalTop + "px";
                this.setMeasuredDimension(width, height);
            }
            getDesiredHeight() {
                let desired = this.mTextElement.offsetHeight;
                let pad = this.getCompoundPaddingTop() + this.getCompoundPaddingBottom();
                desired += pad;
                desired = Math.min(this.mMaxHeight, desired);
                if (this.mMaxLineCount < Number.MAX_SAFE_INTEGER) {
                    let maxHeightWithLineCount = pad + this.mMaxLineCount * this.getLineHeight();
                    desired = Math.min(maxHeightWithLineCount, desired);
                }
                if (this.mMinLineCount > 0) {
                    let minHeightWithLineCount = pad + this.mMinLineCount * this.getLineHeight();
                    desired = Math.max(minHeightWithLineCount, desired);
                }
                desired = Math.max(desired, this.getSuggestedMinimumHeight());
                return desired;
            }
            onDraw(canvas) {
                let r = Color.red(this.mCurTextColor);
                let g = Color.green(this.mCurTextColor);
                let b = Color.blue(this.mCurTextColor);
                let a = Color.alpha(this.mCurTextColor);
                this.mTextElement.style.color = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
                return super.onDraw(canvas);
            }
            setTextColor(color) {
                if (Number.isInteger(color)) {
                    this.mTextColor = ColorStateList.valueOf(color);
                }
                else {
                    if (color === null || color === undefined) {
                        throw new Error('colors is null');
                    }
                    this.mTextColor = color;
                }
                this.updateTextColors();
            }
            getTextColors() {
                return this.mTextColor;
            }
            getCurrentTextColor() {
                return this.mCurTextColor;
            }
            updateTextColors() {
                let inval = false;
                let color = this.mTextColor.getColorForState(this.getDrawableState(), 0);
                if (color != this.mCurTextColor) {
                    this.mCurTextColor = color;
                    inval = true;
                }
                if (inval) {
                    this.invalidate();
                }
            }
            drawableStateChanged() {
                super.drawableStateChanged();
                if (this.mTextColor != null && this.mTextColor.isStateful()) {
                    this.updateTextColors();
                }
            }
            getCompoundPaddingTop() {
                return this.mPaddingTop;
            }
            getCompoundPaddingBottom() {
                return this.mPaddingBottom;
            }
            getCompoundPaddingLeft() {
                return this.mPaddingLeft;
            }
            getCompoundPaddingRight() {
                return this.mPaddingRight;
            }
            setGravity(gravity) {
                switch (gravity & Gravity.HORIZONTAL_GRAVITY_MASK) {
                    case Gravity.CENTER_HORIZONTAL:
                        this.mTextElement.style.textAlign = "center";
                        break;
                    case Gravity.RIGHT:
                        this.mTextElement.style.textAlign = "right";
                        break;
                    case Gravity.LEFT:
                        this.mTextElement.style.textAlign = "left";
                        break;
                }
                if ((gravity & Gravity.VERTICAL_GRAVITY_MASK) !=
                    (this.mGravity & Gravity.VERTICAL_GRAVITY_MASK)) {
                    this.requestLayout();
                }
                this.mGravity = gravity;
            }
            setLineSpacing(add, mult) {
                if (this.mSpacingAdd != add || this.mSpacingMult != mult) {
                    this.mSpacingAdd = add;
                    this.mSpacingMult = mult;
                    this.setTextSize(this.mTextSize);
                }
            }
            setTextSizeInPx(sizeInPx) {
                if (this.mTextSize !== sizeInPx) {
                    this.mTextSize = sizeInPx;
                    this.mTextElement.style.fontSize = sizeInPx + "px";
                    this.mTextElement.style.lineHeight = this.getLineHeight() + "px";
                    this.requestLayout();
                }
            }
            setTextSize(size) {
                let sizeInPx = size * Resources.getDisplayMetrics().density;
                this.setTextSizeInPx(sizeInPx);
            }
            getLineHeight() {
                return Math.ceil(this.mTextSize * this.mSpacingMult + this.mSpacingAdd);
            }
            setHeight(pixels) {
                this.mMaxHeight = pixels;
                this.setMinimumHeight(pixels);
                this.requestLayout();
                this.invalidate();
            }
            setMaxLines(max) {
                this.mMaxLineCount = max;
                this.requestLayout();
                this.invalidate();
            }
            getMaxLines() {
                return this.mMaxLineCount;
            }
            setMaxHeight(maxHeight) {
                this.mMaxHeight = maxHeight;
                this.requestLayout();
                this.invalidate();
            }
            getMaxHeight() {
                return this.mMaxHeight;
            }
            setMaxWidth(maxpixels) {
                this.mMaxWidth = maxpixels;
                this.requestLayout();
                this.invalidate();
            }
            getMaxWidth() {
                return this.mMaxWidth;
            }
            setWidth(pixels) {
                this.mMaxWidth = pixels;
                this.setMinimumWidth(pixels);
                this.requestLayout();
                this.invalidate();
            }
            setMinLines(min) {
                this.mMinLineCount = min;
                this.requestLayout();
                this.invalidate();
            }
            getMinLines() {
                return this.mMinLineCount;
            }
            setSingleLine(singleLine = true) {
                if (singleLine)
                    this.setLines(1);
                else {
                    this.mMaxLineCount = Number.MAX_SAFE_INTEGER;
                    this.mMinLineCount = 0;
                    this.requestLayout();
                    this.invalidate();
                }
            }
            setLines(lines) {
                this.mMaxLineCount = this.mMinLineCount = lines;
                this.requestLayout();
                this.invalidate();
            }
            setText(text = '') {
                this.mTextElement.innerText = text;
                this.requestLayout();
            }
            getText() {
                return this.mTextElement.innerText;
            }
            setHtml(html) {
                this.mTextElement.innerHTML = html;
                this.requestLayout();
            }
            getHtml() {
                return this.mTextElement.innerHTML;
            }
            getTextElement() {
                return this.mTextElement;
            }
        }
        TextView.Default_TextSize = 14;
        widget.TextView = TextView;
        let _defaultStates = [[-View.VIEW_STATE_ENABLED], []];
        let _defaultColors = [0xffc0c0c0, 0xff333333];
        class DefaultStyleTextColor extends ColorStateList {
            constructor() {
                super(_defaultStates, _defaultColors);
            }
        }
    })(widget = android.widget || (android.widget = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/11/2.
 */
///<reference path="Drawable.ts"/>
///<reference path="../Canvas.ts"/>
///<reference path="../Rect.ts"/>
///<reference path="../PixelFormat.ts"/>
///<reference path="../../../java/lang/ref/WeakReference.ts"/>
///<reference path="../../../java/lang/Runnable.ts"/>
///<reference path="../../util/StateSet.ts"/>
///<reference path="../../util/Log.ts"/>
///<reference path="../../util/SparseArray.ts"/>
///<reference path="../../os/SystemClock.ts"/>
var android;
(function (android) {
    var graphics;
    (function (graphics) {
        var drawable;
        (function (drawable) {
            var Rect = android.graphics.Rect;
            var PixelFormat = android.graphics.PixelFormat;
            var Log = android.util.Log;
            var SparseArray = android.util.SparseArray;
            var SystemClock = android.os.SystemClock;
            class DrawableContainer extends drawable.Drawable {
                constructor(...args) {
                    super(...args);
                    this.mAlpha = 0xFF;
                    this.mCurIndex = -1;
                    this.mMutated = false;
                    this.mEnterAnimationEnd = 0;
                    this.mExitAnimationEnd = 0;
                }
                draw(canvas) {
                    if (this.mCurrDrawable != null) {
                        this.mCurrDrawable.draw(canvas);
                    }
                    if (this.mLastDrawable != null) {
                        this.mLastDrawable.draw(canvas);
                    }
                }
                needsMirroring() {
                    return false && this.isAutoMirrored();
                }
                getPadding(padding) {
                    const r = this.mDrawableContainerState.getConstantPadding();
                    let result;
                    if (r != null) {
                        padding.set(r);
                        result = (r.left | r.top | r.bottom | r.right) != 0;
                    }
                    else {
                        if (this.mCurrDrawable != null) {
                            result = this.mCurrDrawable.getPadding(padding);
                        }
                        else {
                            result = super.getPadding(padding);
                        }
                    }
                    if (this.needsMirroring()) {
                        const left = padding.left;
                        const right = padding.right;
                        padding.left = right;
                        padding.right = left;
                    }
                    return result;
                }
                setAlpha(alpha) {
                    if (this.mAlpha != alpha) {
                        this.mAlpha = alpha;
                        if (this.mCurrDrawable != null) {
                            if (this.mEnterAnimationEnd == 0) {
                                this.mCurrDrawable.mutate().setAlpha(alpha);
                            }
                            else {
                                this.animate(false);
                            }
                        }
                    }
                }
                getAlpha() {
                    return this.mAlpha;
                }
                setDither(dither) {
                    if (this.mDrawableContainerState.mDither != dither) {
                        this.mDrawableContainerState.mDither = dither;
                        if (this.mCurrDrawable != null) {
                            this.mCurrDrawable.mutate().setDither(this.mDrawableContainerState.mDither);
                        }
                    }
                }
                setEnterFadeDuration(ms) {
                    this.mDrawableContainerState.mEnterFadeDuration = ms;
                }
                setExitFadeDuration(ms) {
                    this.mDrawableContainerState.mExitFadeDuration = ms;
                }
                onBoundsChange(bounds) {
                    if (this.mLastDrawable != null) {
                        this.mLastDrawable.setBounds(bounds);
                    }
                    if (this.mCurrDrawable != null) {
                        this.mCurrDrawable.setBounds(bounds);
                    }
                }
                isStateful() {
                    return this.mDrawableContainerState.isStateful();
                }
                setAutoMirrored(mirrored) {
                    this.mDrawableContainerState.mAutoMirrored = mirrored;
                    if (this.mCurrDrawable != null) {
                        this.mCurrDrawable.mutate().setAutoMirrored(this.mDrawableContainerState.mAutoMirrored);
                    }
                }
                isAutoMirrored() {
                    return this.mDrawableContainerState.mAutoMirrored;
                }
                jumpToCurrentState() {
                    let changed = false;
                    if (this.mLastDrawable != null) {
                        this.mLastDrawable.jumpToCurrentState();
                        this.mLastDrawable = null;
                        changed = true;
                    }
                    if (this.mCurrDrawable != null) {
                        this.mCurrDrawable.jumpToCurrentState();
                        this.mCurrDrawable.mutate().setAlpha(this.mAlpha);
                    }
                    if (this.mExitAnimationEnd != 0) {
                        this.mExitAnimationEnd = 0;
                        changed = true;
                    }
                    if (this.mEnterAnimationEnd != 0) {
                        this.mEnterAnimationEnd = 0;
                        changed = true;
                    }
                    if (changed) {
                        this.invalidateSelf();
                    }
                }
                onStateChange(state) {
                    if (this.mLastDrawable != null) {
                        return this.mLastDrawable.setState(state);
                    }
                    if (this.mCurrDrawable != null) {
                        return this.mCurrDrawable.setState(state);
                    }
                    return false;
                }
                onLevelChange(level) {
                    if (this.mLastDrawable != null) {
                        return this.mLastDrawable.setLevel(level);
                    }
                    if (this.mCurrDrawable != null) {
                        return this.mCurrDrawable.setLevel(level);
                    }
                    return false;
                }
                getIntrinsicWidth() {
                    if (this.mDrawableContainerState.isConstantSize()) {
                        return this.mDrawableContainerState.getConstantWidth();
                    }
                    return this.mCurrDrawable != null ? this.mCurrDrawable.getIntrinsicWidth() : -1;
                }
                getIntrinsicHeight() {
                    if (this.mDrawableContainerState.isConstantSize()) {
                        return this.mDrawableContainerState.getConstantHeight();
                    }
                    return this.mCurrDrawable != null ? this.mCurrDrawable.getIntrinsicHeight() : -1;
                }
                getMinimumWidth() {
                    if (this.mDrawableContainerState.isConstantSize()) {
                        return this.mDrawableContainerState.getConstantMinimumWidth();
                    }
                    return this.mCurrDrawable != null ? this.mCurrDrawable.getMinimumWidth() : 0;
                }
                getMinimumHeight() {
                    if (this.mDrawableContainerState.isConstantSize()) {
                        return this.mDrawableContainerState.getConstantMinimumHeight();
                    }
                    return this.mCurrDrawable != null ? this.mCurrDrawable.getMinimumHeight() : 0;
                }
                invalidateDrawable(who) {
                    if (who == this.mCurrDrawable && this.getCallback() != null) {
                        this.getCallback().invalidateDrawable(this);
                    }
                }
                scheduleDrawable(who, what, when) {
                    if (who == this.mCurrDrawable && this.getCallback() != null) {
                        this.getCallback().scheduleDrawable(this, what, when);
                    }
                }
                unscheduleDrawable(who, what) {
                    if (who == this.mCurrDrawable && this.getCallback() != null) {
                        this.getCallback().unscheduleDrawable(this, what);
                    }
                }
                setVisible(visible, restart) {
                    let changed = super.setVisible(visible, restart);
                    if (this.mLastDrawable != null) {
                        this.mLastDrawable.setVisible(visible, restart);
                    }
                    if (this.mCurrDrawable != null) {
                        this.mCurrDrawable.setVisible(visible, restart);
                    }
                    return changed;
                }
                getOpacity() {
                    return this.mCurrDrawable == null || !this.mCurrDrawable.isVisible() ? PixelFormat.TRANSPARENT :
                        this.mDrawableContainerState.getOpacity();
                }
                selectDrawable(idx) {
                    if (idx == this.mCurIndex) {
                        return false;
                    }
                    const now = SystemClock.uptimeMillis();
                    if (DrawableContainer.DEBUG)
                        android.util.Log.i(DrawableContainer.TAG, toString() + " from " + this.mCurIndex + " to " + idx
                            + ": exit=" + this.mDrawableContainerState.mExitFadeDuration
                            + " enter=" + this.mDrawableContainerState.mEnterFadeDuration);
                    if (this.mDrawableContainerState.mExitFadeDuration > 0) {
                        if (this.mLastDrawable != null) {
                            this.mLastDrawable.setVisible(false, false);
                        }
                        if (this.mCurrDrawable != null) {
                            this.mLastDrawable = this.mCurrDrawable;
                            this.mExitAnimationEnd = now + this.mDrawableContainerState.mExitFadeDuration;
                        }
                        else {
                            this.mLastDrawable = null;
                            this.mExitAnimationEnd = 0;
                        }
                    }
                    else if (this.mCurrDrawable != null) {
                        this.mCurrDrawable.setVisible(false, false);
                    }
                    if (idx >= 0 && idx < this.mDrawableContainerState.mNumChildren) {
                        const d = this.mDrawableContainerState.getChild(idx);
                        this.mCurrDrawable = d;
                        this.mCurIndex = idx;
                        if (d != null) {
                            d.mutate();
                            if (this.mDrawableContainerState.mEnterFadeDuration > 0) {
                                this.mEnterAnimationEnd = now + this.mDrawableContainerState.mEnterFadeDuration;
                            }
                            else {
                                d.setAlpha(this.mAlpha);
                            }
                            d.setVisible(this.isVisible(), true);
                            d.setDither(this.mDrawableContainerState.mDither);
                            d.setState(this.getState());
                            d.setLevel(this.getLevel());
                            d.setBounds(this.getBounds());
                            d.setAutoMirrored(this.mDrawableContainerState.mAutoMirrored);
                        }
                        else {
                        }
                    }
                    else {
                        this.mCurrDrawable = null;
                        this.mCurIndex = -1;
                    }
                    if (this.mEnterAnimationEnd != 0 || this.mExitAnimationEnd != 0) {
                        if (this.mAnimationRunnable == null) {
                            let t = this;
                            this.mAnimationRunnable = {
                                run() {
                                    t.animate(true);
                                    t.invalidateSelf();
                                }
                            };
                        }
                        else {
                            this.unscheduleSelf(this.mAnimationRunnable);
                        }
                        this.animate(true);
                    }
                    this.invalidateSelf();
                    return true;
                }
                animate(schedule) {
                    const now = SystemClock.uptimeMillis();
                    let animating = false;
                    if (this.mCurrDrawable != null) {
                        if (this.mEnterAnimationEnd != 0) {
                            if (this.mEnterAnimationEnd <= now) {
                                this.mCurrDrawable.mutate().setAlpha(this.mAlpha);
                                this.mEnterAnimationEnd = 0;
                            }
                            else {
                                let animAlpha = ((this.mEnterAnimationEnd - now) * 255)
                                    / this.mDrawableContainerState.mEnterFadeDuration;
                                if (DrawableContainer.DEBUG)
                                    android.util.Log.i(DrawableContainer.TAG, toString() + " cur alpha " + animAlpha);
                                this.mCurrDrawable.mutate().setAlpha(((255 - animAlpha) * this.mAlpha) / 255);
                                animating = true;
                            }
                        }
                    }
                    else {
                        this.mEnterAnimationEnd = 0;
                    }
                    if (this.mLastDrawable != null) {
                        if (this.mExitAnimationEnd != 0) {
                            if (this.mExitAnimationEnd <= now) {
                                this.mLastDrawable.setVisible(false, false);
                                this.mLastDrawable = null;
                                this.mExitAnimationEnd = 0;
                            }
                            else {
                                let animAlpha = ((this.mExitAnimationEnd - now) * 255)
                                    / this.mDrawableContainerState.mExitFadeDuration;
                                if (DrawableContainer.DEBUG)
                                    android.util.Log.i(DrawableContainer.TAG, toString() + " last alpha " + animAlpha);
                                this.mLastDrawable.mutate().setAlpha((animAlpha * this.mAlpha) / 255);
                                animating = true;
                            }
                        }
                    }
                    else {
                        this.mExitAnimationEnd = 0;
                    }
                    if (schedule && animating) {
                        this.scheduleSelf(this.mAnimationRunnable, now + 1000 / 60);
                    }
                }
                getCurrent() {
                    return this.mCurrDrawable;
                }
                getConstantState() {
                    if (this.mDrawableContainerState.canConstantState()) {
                        return this.mDrawableContainerState;
                    }
                    return null;
                }
                mutate() {
                    if (!this.mMutated && super.mutate() == this) {
                        this.mDrawableContainerState.mutate();
                        this.mMutated = true;
                    }
                    return this;
                }
                setConstantState(state) {
                    this.mDrawableContainerState = state;
                }
            }
            DrawableContainer.DEBUG = Log.DBG_DrawableContainer;
            DrawableContainer.TAG = "DrawableContainer";
            DrawableContainer.DEFAULT_DITHER = true;
            drawable.DrawableContainer = DrawableContainer;
            (function (DrawableContainer) {
                class DrawableContainerState {
                    constructor(orig, owner) {
                        this.mVariablePadding = false;
                        this.mPaddingChecked = false;
                        this.mConstantSize = false;
                        this.mComputedConstantSize = false;
                        this.mConstantWidth = 0;
                        this.mConstantHeight = 0;
                        this.mConstantMinimumWidth = 0;
                        this.mConstantMinimumHeight = 0;
                        this.mCheckedOpacity = false;
                        this.mOpacity = 0;
                        this.mCheckedStateful = false;
                        this.mStateful = false;
                        this.mCheckedConstantState = false;
                        this.mCanConstantState = false;
                        this.mDither = DrawableContainer.DEFAULT_DITHER;
                        this.mMutated = false;
                        this.mEnterFadeDuration = 0;
                        this.mExitFadeDuration = 0;
                        this.mAutoMirrored = false;
                        this.mOwner = owner;
                        if (orig != null) {
                            this.mCheckedConstantState = true;
                            this.mCanConstantState = true;
                            this.mVariablePadding = orig.mVariablePadding;
                            this.mConstantSize = orig.mConstantSize;
                            this.mDither = orig.mDither;
                            this.mMutated = orig.mMutated;
                            this.mEnterFadeDuration = orig.mEnterFadeDuration;
                            this.mExitFadeDuration = orig.mExitFadeDuration;
                            this.mAutoMirrored = orig.mAutoMirrored;
                            this.mConstantPadding = orig.getConstantPadding();
                            this.mPaddingChecked = true;
                            this.mConstantWidth = orig.getConstantWidth();
                            this.mConstantHeight = orig.getConstantHeight();
                            this.mConstantMinimumWidth = orig.getConstantMinimumWidth();
                            this.mConstantMinimumHeight = orig.getConstantMinimumHeight();
                            this.mComputedConstantSize = true;
                            this.mOpacity = orig.getOpacity();
                            this.mCheckedOpacity = true;
                            this.mStateful = orig.isStateful();
                            this.mCheckedStateful = true;
                            const origDr = orig.mDrawables;
                            this.mDrawables = new Array(0);
                            const origDf = orig.mDrawableFutures;
                            if (origDf != null) {
                                this.mDrawableFutures = origDf.clone();
                            }
                            else {
                                this.mDrawableFutures = new SparseArray(this.mNumChildren);
                            }
                            const N = this.mNumChildren;
                            for (let i = 0; i < N; i++) {
                                if (origDr[i] != null) {
                                    this.mDrawableFutures.put(i, new ConstantStateFuture(origDr[i]));
                                }
                            }
                        }
                        else {
                            this.mDrawables = new Array(0);
                        }
                    }
                    get mNumChildren() {
                        return this.mDrawables.length;
                    }
                    addChild(dr) {
                        const pos = this.mNumChildren;
                        dr.setVisible(false, true);
                        dr.setCallback(this.mOwner);
                        this.mDrawables.push(dr);
                        this.mCheckedStateful = false;
                        this.mCheckedOpacity = false;
                        this.mConstantPadding = null;
                        this.mPaddingChecked = false;
                        this.mComputedConstantSize = false;
                        return pos;
                    }
                    getCapacity() {
                        return this.mDrawables.length;
                    }
                    createAllFutures() {
                        if (this.mDrawableFutures != null) {
                            const futureCount = this.mDrawableFutures.size();
                            for (let keyIndex = 0; keyIndex < futureCount; keyIndex++) {
                                const index = this.mDrawableFutures.keyAt(keyIndex);
                                this.mDrawables[index] = this.mDrawableFutures.valueAt(keyIndex).get(this);
                            }
                            this.mDrawableFutures = null;
                        }
                    }
                    getChildCount() {
                        return this.mNumChildren;
                    }
                    getChildren() {
                        this.createAllFutures();
                        return this.mDrawables;
                    }
                    getChild(index) {
                        const result = this.mDrawables[index];
                        if (result != null) {
                            return result;
                        }
                        if (this.mDrawableFutures != null) {
                            const keyIndex = this.mDrawableFutures.indexOfKey(index);
                            if (keyIndex >= 0) {
                                const prepared = this.mDrawableFutures.valueAt(keyIndex).get(this);
                                this.mDrawables[index] = prepared;
                                this.mDrawableFutures.removeAt(keyIndex);
                                return prepared;
                            }
                        }
                        return null;
                    }
                    mutate() {
                        const N = this.mNumChildren;
                        const drawables = this.mDrawables;
                        for (let i = 0; i < N; i++) {
                            if (drawables[i] != null) {
                                drawables[i].mutate();
                            }
                        }
                        this.mMutated = true;
                    }
                    setVariablePadding(variable) {
                        this.mVariablePadding = variable;
                    }
                    getConstantPadding() {
                        if (this.mVariablePadding) {
                            return null;
                        }
                        if ((this.mConstantPadding != null) || this.mPaddingChecked) {
                            return this.mConstantPadding;
                        }
                        this.createAllFutures();
                        let r = null;
                        const t = new Rect();
                        const N = this.mNumChildren;
                        const drawables = this.mDrawables;
                        for (let i = 0; i < N; i++) {
                            if (drawables[i].getPadding(t)) {
                                if (r == null)
                                    r = new Rect(0, 0, 0, 0);
                                if (t.left > r.left)
                                    r.left = t.left;
                                if (t.top > r.top)
                                    r.top = t.top;
                                if (t.right > r.right)
                                    r.right = t.right;
                                if (t.bottom > r.bottom)
                                    r.bottom = t.bottom;
                            }
                        }
                        this.mPaddingChecked = true;
                        return (this.mConstantPadding = r);
                    }
                    setConstantSize(constant) {
                        this.mConstantSize = constant;
                    }
                    isConstantSize() {
                        return this.mConstantSize;
                    }
                    getConstantWidth() {
                        if (!this.mComputedConstantSize) {
                            this.computeConstantSize();
                        }
                        return this.mConstantWidth;
                    }
                    getConstantHeight() {
                        if (!this.mComputedConstantSize) {
                            this.computeConstantSize();
                        }
                        return this.mConstantHeight;
                    }
                    getConstantMinimumWidth() {
                        if (!this.mComputedConstantSize) {
                            this.computeConstantSize();
                        }
                        return this.mConstantMinimumWidth;
                    }
                    getConstantMinimumHeight() {
                        if (!this.mComputedConstantSize) {
                            this.computeConstantSize();
                        }
                        return this.mConstantMinimumHeight;
                    }
                    computeConstantSize() {
                        this.mComputedConstantSize = true;
                        this.createAllFutures();
                        const N = this.mNumChildren;
                        const drawables = this.mDrawables;
                        this.mConstantWidth = this.mConstantHeight = -1;
                        this.mConstantMinimumWidth = this.mConstantMinimumHeight = 0;
                        for (let i = 0; i < N; i++) {
                            const dr = drawables[i];
                            let s = dr.getIntrinsicWidth();
                            if (s > this.mConstantWidth)
                                this.mConstantWidth = s;
                            s = dr.getIntrinsicHeight();
                            if (s > this.mConstantHeight)
                                this.mConstantHeight = s;
                            s = dr.getMinimumWidth();
                            if (s > this.mConstantMinimumWidth)
                                this.mConstantMinimumWidth = s;
                            s = dr.getMinimumHeight();
                            if (s > this.mConstantMinimumHeight)
                                this.mConstantMinimumHeight = s;
                        }
                    }
                    setEnterFadeDuration(duration) {
                        this.mEnterFadeDuration = duration;
                    }
                    getEnterFadeDuration() {
                        return this.mEnterFadeDuration;
                    }
                    setExitFadeDuration(duration) {
                        this.mExitFadeDuration = duration;
                    }
                    getExitFadeDuration() {
                        return this.mExitFadeDuration;
                    }
                    getOpacity() {
                        if (this.mCheckedOpacity) {
                            return this.mOpacity;
                        }
                        this.createAllFutures();
                        this.mCheckedOpacity = true;
                        const N = this.mNumChildren;
                        const drawables = this.mDrawables;
                        let op = (N > 0) ? drawables[0].getOpacity() : PixelFormat.TRANSPARENT;
                        for (let i = 1; i < N; i++) {
                            op = drawable.Drawable.resolveOpacity(op, drawables[i].getOpacity());
                        }
                        this.mOpacity = op;
                        return op;
                    }
                    isStateful() {
                        if (this.mCheckedStateful) {
                            return this.mStateful;
                        }
                        this.createAllFutures();
                        this.mCheckedStateful = true;
                        const N = this.mNumChildren;
                        const drawables = this.mDrawables;
                        for (let i = 0; i < N; i++) {
                            if (drawables[i].isStateful()) {
                                this.mStateful = true;
                                return true;
                            }
                        }
                        this.mStateful = false;
                        return false;
                    }
                    canConstantState() {
                        if (this.mCheckedConstantState) {
                            return this.mCanConstantState;
                        }
                        this.createAllFutures();
                        this.mCheckedConstantState = true;
                        const N = this.mNumChildren;
                        const drawables = this.mDrawables;
                        for (let i = 0; i < N; i++) {
                            if (drawables[i].getConstantState() == null) {
                                this.mCanConstantState = false;
                                return false;
                            }
                        }
                        this.mCanConstantState = true;
                        return true;
                    }
                    newDrawable() {
                        return undefined;
                    }
                }
                DrawableContainer.DrawableContainerState = DrawableContainerState;
                class ConstantStateFuture {
                    constructor(source) {
                        this.mConstantState = source.getConstantState();
                    }
                    get(state) {
                        const result = this.mConstantState.newDrawable();
                        result.setCallback(state.mOwner);
                        if (state.mMutated) {
                            result.mutate();
                        }
                        return result;
                    }
                }
            })(DrawableContainer = drawable.DrawableContainer || (drawable.DrawableContainer = {}));
        })(drawable = graphics.drawable || (graphics.drawable = {}));
    })(graphics = android.graphics || (android.graphics = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/11/2.
 */
///<reference path="DrawableContainer.ts"/>
var android;
(function (android) {
    var graphics;
    (function (graphics) {
        var drawable;
        (function (drawable_2) {
            const DEBUG = android.util.Log.DBG_StateListDrawable;
            const TAG = "StateListDrawable";
            const DEFAULT_DITHER = true;
            class StateListDrawable extends drawable_2.DrawableContainer {
                constructor() {
                    super();
                    this.initWithState(null);
                }
                initWithState(state) {
                    let _as = new StateListState(state, this);
                    this.mStateListState = _as;
                    this.setConstantState(_as);
                    this.onStateChange(this.getState());
                }
                addState(stateSet, drawable) {
                    if (drawable != null) {
                        this.mStateListState.addStateSet(stateSet, drawable);
                        this.onStateChange(this.getState());
                    }
                }
                isStateful() {
                    return true;
                }
                onStateChange(stateSet) {
                    let idx = this.mStateListState.indexOfStateSet(stateSet);
                    if (DEBUG)
                        android.util.Log.i(TAG, "onStateChange " + this + " states "
                            + stateSet + " found " + idx);
                    if (idx < 0) {
                        idx = this.mStateListState.indexOfStateSet(android.util.StateSet.WILD_CARD);
                    }
                    if (this.selectDrawable(idx)) {
                        return true;
                    }
                    return super.onStateChange(stateSet);
                }
                getStateCount() {
                    return this.mStateListState.getChildCount();
                }
                getStateSet(index) {
                    return this.mStateListState.mStateSets[index];
                }
                getStateDrawable(index) {
                    return this.mStateListState.getChild(index);
                }
                getStateDrawableIndex(stateSet) {
                    return this.mStateListState.indexOfStateSet(stateSet);
                }
                mutate() {
                    if (!this.mMutated && super.mutate() == this) {
                        const sets = this.mStateListState.mStateSets;
                        const count = sets.length;
                        this.mStateListState.mStateSets = new Array(count);
                        for (let i = 0; i < count; i++) {
                            const _set = sets[i];
                            if (_set != null) {
                                this.mStateListState.mStateSets[i] = _set.concat();
                            }
                        }
                        this.mMutated = true;
                    }
                    return this;
                }
            }
            drawable_2.StateListDrawable = StateListDrawable;
            class StateListState extends drawable_2.DrawableContainer.DrawableContainerState {
                constructor(orig, owner) {
                    super(orig, owner);
                    if (orig != null) {
                        this.mStateSets = orig.mStateSets.concat();
                    }
                    else {
                        this.mStateSets = new Array(this.getCapacity());
                    }
                }
                addStateSet(stateSet, drawable) {
                    let pos = this.addChild(drawable);
                    this.mStateSets[pos] = stateSet;
                    return pos;
                }
                indexOfStateSet(stateSet) {
                    const stateSets = this.mStateSets;
                    const N = this.getChildCount();
                    for (let i = 0; i < N; i++) {
                        if (android.util.StateSet.stateSetMatches(stateSets[i], stateSet)) {
                            return i;
                        }
                    }
                    return -1;
                }
                newDrawable() {
                    let drawable = new StateListDrawable();
                    drawable.initWithState(this);
                    return drawable;
                }
            }
        })(drawable = graphics.drawable || (graphics.drawable = {}));
    })(graphics = android.graphics || (android.graphics = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/11/2.
 */
///<reference path="TextView.ts"/>
///<reference path="../view/View.ts"/>
///<reference path="../content/res/Resources.ts"/>
///<reference path="../graphics/Color.ts"/>
///<reference path="../graphics/drawable/Drawable.ts"/>
///<reference path="../graphics/drawable/InsetDrawable.ts"/>
///<reference path="../graphics/drawable/ColorDrawable.ts"/>
///<reference path="../graphics/drawable/StateListDrawable.ts"/>
var android;
(function (android) {
    var widget;
    (function (widget) {
        var View = android.view.View;
        var Resources = android.content.res.Resources;
        var Color = android.graphics.Color;
        var InsetDrawable = android.graphics.drawable.InsetDrawable;
        var ColorDrawable = android.graphics.drawable.ColorDrawable;
        var StateListDrawable = android.graphics.drawable.StateListDrawable;
        var Gravity = android.view.Gravity;
        class Button extends widget.TextView {
            constructor() {
                super();
                this._initDefaultStyle();
            }
            _initDefaultStyle() {
                let density = Resources.getDisplayMetrics().density;
                this.setClickable(true);
                this.setTextSize(18);
                this.setMinimumHeight(48 * density);
                this.setMinimumWidth(64 * density);
                this.setBackground(new DefaultButtonBackgroundDrawable());
                this.setGravity(Gravity.CENTER);
            }
        }
        widget.Button = Button;
        const density = Resources.getDisplayMetrics().density;
        class DefaultButtonBackgroundDrawable extends InsetDrawable {
            constructor() {
                super(DefaultButtonBackgroundDrawable.createStateList(), 6 * density);
            }
            static createStateList() {
                let stateList = new StateListDrawable();
                stateList.addState([View.VIEW_STATE_PRESSED], new ColorDrawable(Color.GRAY));
                stateList.addState([View.VIEW_STATE_ACTIVATED], new ColorDrawable(Color.GRAY));
                stateList.addState([View.VIEW_STATE_FOCUSED], new ColorDrawable(0xffaaaaaa));
                stateList.addState([-View.VIEW_STATE_ENABLED], new ColorDrawable(0xffebebeb));
                stateList.addState([], new ColorDrawable(Color.LTGRAY));
                return stateList;
            }
            getPadding(padding) {
                let result = super.getPadding(padding);
                padding.left += 12 * density;
                padding.right += 12 * density;
                padding.top += 6 * density;
                padding.bottom += 6 * density;
                return result;
            }
        }
    })(widget = android.widget || (android.widget = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/11/5.
 */
///<reference path="../../java/util/ArrayList.ts"/>
var android;
(function (android) {
    var database;
    (function (database) {
        var ArrayList = java.util.ArrayList;
        class Observable {
            constructor() {
                this.mObservers = new ArrayList();
            }
            registerObserver(observer) {
                if (observer == null) {
                    throw new Error("The observer is null.");
                }
                if (this.mObservers.contains(observer)) {
                    throw new Error("Observer " + observer + " is already registered.");
                }
                this.mObservers.add(observer);
            }
            unregisterObserver(observer) {
                if (observer == null) {
                    throw new Error("The observer is null.");
                }
                let index = this.mObservers.indexOf(observer);
                if (index == -1) {
                    throw new Error("Observer " + observer + " was not registered.");
                }
                this.mObservers.remove(index);
            }
            unregisterAll() {
                this.mObservers.clear();
            }
        }
        database.Observable = Observable;
    })(database = android.database || (android.database = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/11/5.
 */
var android;
(function (android) {
    var database;
    (function (database) {
        class DataSetObserver {
            onChanged() { }
            onInvalidated() { }
        }
        database.DataSetObserver = DataSetObserver;
    })(database = android.database || (android.database = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/11/5.
 */
///<reference path="Observable.ts"/>
///<reference path="DataSetObserver.ts"/>
///<reference path="../../java/util/ArrayList.ts"/>
var android;
(function (android) {
    var database;
    (function (database) {
        var Observable = android.database.Observable;
        class DataSetObservable extends Observable {
            notifyChanged() {
                for (let i = this.mObservers.size() - 1; i >= 0; i--) {
                    this.mObservers.get(i).onChanged();
                }
            }
            notifyInvalidated() {
                for (let i = this.mObservers.size() - 1; i >= 0; i--) {
                    this.mObservers.get(i).onInvalidated();
                }
            }
        }
        database.DataSetObservable = DataSetObservable;
    })(database = android.database || (android.database = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/11/5.
 */
///<reference path="../../../database/DataSetObservable.ts"/>
///<reference path="../../../database/Observable.ts"/>
///<reference path="../../../database/DataSetObserver.ts"/>
///<reference path="../../../view/ViewGroup.ts"/>
var android;
(function (android) {
    var support;
    (function (support) {
        var v4;
        (function (v4) {
            var view;
            (function (view_4) {
                var DataSetObservable = android.database.DataSetObservable;
                class PagerAdapter {
                    constructor() {
                        this.mObservable = new DataSetObservable();
                    }
                    startUpdate(container) {
                    }
                    instantiateItem(container, position) {
                        throw new Error("Required method instantiateItem was not overridden");
                    }
                    destroyItem(container, position, object) {
                        throw new Error("Required method destroyItem was not overridden");
                    }
                    setPrimaryItem(container, position, object) {
                    }
                    finishUpdate(container) {
                    }
                    getItemPosition(object) {
                        return PagerAdapter.POSITION_UNCHANGED;
                    }
                    notifyDataSetChanged() {
                        this.mObservable.notifyChanged();
                    }
                    registerDataSetObserver(observer) {
                        this.mObservable.registerObserver(observer);
                    }
                    unregisterDataSetObserver(observer) {
                        this.mObservable.unregisterObserver(observer);
                    }
                    getPageTitle(position) {
                        return null;
                    }
                    getPageWidth(position) {
                        return 1;
                    }
                }
                PagerAdapter.POSITION_UNCHANGED = -1;
                PagerAdapter.POSITION_NONE = -2;
                view_4.PagerAdapter = PagerAdapter;
            })(view = v4.view || (v4.view = {}));
        })(v4 = support.v4 || (support.v4 = {}));
    })(support = android.support || (android.support = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/11/5.
 */
///<reference path="../../../view/View.ts"/>
///<reference path="../../../view/VelocityTracker.ts"/>
///<reference path="../../../widget/OverScroller.ts"/>
///<reference path="../../../view/ViewGroup.ts"/>
///<reference path="../../../view/MotionEvent.ts"/>
///<reference path="../../../view/animation/Interpolator.ts"/>
///<reference path="../../../../java/util/ArrayList.ts"/>
///<reference path="../../../database/DataSetObservable.ts"/>
///<reference path="../../../database/Observable.ts"/>
///<reference path="../../../database/DataSetObserver.ts"/>
///<reference path="PagerAdapter.ts"/>
var android;
(function (android) {
    var support;
    (function (support) {
        var v4;
        (function (v4) {
            var view;
            (function (view_5) {
                var View = android.view.View;
                var Gravity = android.view.Gravity;
                var MeasureSpec = View.MeasureSpec;
                var OverScroller = android.widget.OverScroller;
                var ViewGroup = android.view.ViewGroup;
                var ArrayList = java.util.ArrayList;
                var Rect = android.graphics.Rect;
                var PagerAdapter = android.support.v4.view.PagerAdapter;
                var DataSetObserver = android.database.DataSetObserver;
                var VelocityTracker = android.view.VelocityTracker;
                var ViewConfiguration = android.view.ViewConfiguration;
                var Resources = android.content.res.Resources;
                var Log = android.util.Log;
                var MotionEvent = android.view.MotionEvent;
                const TAG = "ViewPager";
                const DEBUG = false;
                const SymbolDecor = Symbol();
                class ViewPager extends ViewGroup {
                    constructor() {
                        super();
                        this.mExpectedAdapterCount = 0;
                        this.mItems = new ArrayList();
                        this.mTempItem = new ItemInfo();
                        this.mTempRect = new Rect();
                        this.mCurItem = 0;
                        this.mRestoredCurItem = -1;
                        this.mPageMargin = 0;
                        this.mTopPageBounds = 0;
                        this.mBottomPageBounds = 0;
                        this.mFirstOffset = -Number.MAX_VALUE;
                        this.mLastOffset = Number.MAX_VALUE;
                        this.mChildWidthMeasureSpec = 0;
                        this.mChildHeightMeasureSpec = 0;
                        this.mInLayout = false;
                        this.mScrollingCacheEnabled = false;
                        this.mPopulatePending = false;
                        this.mOffscreenPageLimit = ViewPager.DEFAULT_OFFSCREEN_PAGES;
                        this.mIsBeingDragged = false;
                        this.mIsUnableToDrag = false;
                        this.mDefaultGutterSize = 0;
                        this.mGutterSize = 0;
                        this.mLastMotionX = 0;
                        this.mLastMotionY = 0;
                        this.mInitialMotionX = 0;
                        this.mInitialMotionY = 0;
                        this.mActivePointerId = ViewPager.INVALID_POINTER;
                        this.mMinimumVelocity = 0;
                        this.mMaximumVelocity = 0;
                        this.mFlingDistance = 0;
                        this.mCloseEnough = 0;
                        this.mFakeDragging = false;
                        this.mFakeDragBeginTime = 0;
                        this.mFirstLayout = true;
                        this.mNeedCalculatePageOffsets = false;
                        this.mCalledSuper = false;
                        this.mDecorChildCount = 0;
                        this.mDrawingOrder = 0;
                        this.mEndScrollRunnable = {
                            ViewPager_this: this,
                            run() {
                                this.ViewPager_this.setScrollState(ViewPager.SCROLL_STATE_IDLE);
                                this.ViewPager_this.populate();
                            }
                        };
                        this.mScrollState = ViewPager.SCROLL_STATE_IDLE;
                        this.initViewPager();
                    }
                    initViewPager() {
                        this.setWillNotDraw(false);
                        this.mScroller = new OverScroller(ViewPager.sInterpolator);
                        let density = Resources.getDisplayMetrics().density;
                        this.mTouchSlop = ViewConfiguration.get().getScaledPagingTouchSlop();
                        this.mMinimumVelocity = Math.floor(ViewPager.MIN_FLING_VELOCITY * density);
                        this.mMaximumVelocity = ViewConfiguration.get().getScaledMaximumFlingVelocity();
                        this.mFlingDistance = Math.floor(ViewPager.MIN_DISTANCE_FOR_FLING * density);
                        this.mCloseEnough = Math.floor(ViewPager.CLOSE_ENOUGH * density);
                        this.mDefaultGutterSize = Math.floor(ViewPager.DEFAULT_GUTTER_SIZE * density);
                    }
                    onDetachedFromWindow() {
                        this.removeCallbacks(this.mEndScrollRunnable);
                        super.onDetachedFromWindow();
                    }
                    setScrollState(newState) {
                        if (this.mScrollState == newState) {
                            return;
                        }
                        this.mScrollState = newState;
                        if (this.mPageTransformer != null) {
                            this.enableLayers(newState != ViewPager.SCROLL_STATE_IDLE);
                        }
                        this.dispatchOnScrollStateChanged(newState);
                    }
                    setAdapter(adapter) {
                        if (this.mAdapter != null) {
                            this.mAdapter.unregisterDataSetObserver(this.mObserver);
                            this.mAdapter.startUpdate(this);
                            for (let i = 0; i < this.mItems.size(); i++) {
                                const ii = this.mItems.get(i);
                                this.mAdapter.destroyItem(this, ii.position, ii.object);
                            }
                            this.mAdapter.finishUpdate(this);
                            this.mItems.clear();
                            this.removeNonDecorViews();
                            this.mCurItem = 0;
                            this.scrollTo(0, 0);
                        }
                        const oldAdapter = this.mAdapter;
                        this.mAdapter = adapter;
                        this.mExpectedAdapterCount = 0;
                        if (this.mAdapter != null) {
                            if (this.mObserver == null) {
                                this.mObserver = new PagerObserver(this);
                            }
                            this.mAdapter.registerDataSetObserver(this.mObserver);
                            this.mPopulatePending = false;
                            const wasFirstLayout = this.mFirstLayout;
                            this.mFirstLayout = true;
                            this.mExpectedAdapterCount = this.mAdapter.getCount();
                            if (this.mRestoredCurItem >= 0) {
                                this.setCurrentItemInternal(this.mRestoredCurItem, false, true);
                                this.mRestoredCurItem = -1;
                            }
                            else if (!wasFirstLayout) {
                                this.populate();
                            }
                            else {
                                this.requestLayout();
                            }
                        }
                        if (this.mAdapterChangeListener != null && oldAdapter != adapter) {
                            this.mAdapterChangeListener.onAdapterChanged(oldAdapter, adapter);
                        }
                    }
                    removeNonDecorViews() {
                        for (let i = 0; i < this.getChildCount(); i++) {
                            const child = this.getChildAt(i);
                            const lp = child.getLayoutParams();
                            if (!lp.isDecor) {
                                this.removeViewAt(i);
                                i--;
                            }
                        }
                    }
                    getAdapter() {
                        return this.mAdapter;
                    }
                    setOnAdapterChangeListener(listener) {
                        this.mAdapterChangeListener = listener;
                    }
                    getClientWidth() {
                        return this.getMeasuredWidth() - this.getPaddingLeft() - this.getPaddingRight();
                    }
                    setCurrentItem(item, smoothScroll = !this.mFirstLayout) {
                        this.mPopulatePending = false;
                        this.setCurrentItemInternal(item, smoothScroll, false);
                    }
                    getCurrentItem() {
                        return this.mCurItem;
                    }
                    setCurrentItemInternal(item, smoothScroll, always, velocity = 0) {
                        if (this.mAdapter == null || this.mAdapter.getCount() <= 0) {
                            this.setScrollingCacheEnabled(false);
                            return;
                        }
                        if (!always && this.mCurItem == item && this.mItems.size() != 0) {
                            this.setScrollingCacheEnabled(false);
                            return;
                        }
                        if (item < 0) {
                            item = 0;
                        }
                        else if (item >= this.mAdapter.getCount()) {
                            item = this.mAdapter.getCount() - 1;
                        }
                        const pageLimit = this.mOffscreenPageLimit;
                        if (item > (this.mCurItem + pageLimit) || item < (this.mCurItem - pageLimit)) {
                            for (let i = 0; i < this.mItems.size(); i++) {
                                this.mItems.get(i).scrolling = true;
                            }
                        }
                        const dispatchSelected = this.mCurItem != item;
                        if (this.mFirstLayout) {
                            this.mCurItem = item;
                            if (dispatchSelected) {
                                this.dispatchOnPageSelected(item);
                            }
                            this.requestLayout();
                        }
                        else {
                            this.populate(item);
                            this.scrollToItem(item, smoothScroll, velocity, dispatchSelected);
                        }
                    }
                    scrollToItem(item, smoothScroll, velocity, dispatchSelected) {
                        const curInfo = this.infoForPosition(item);
                        let destX = 0;
                        if (curInfo != null) {
                            const width = this.getClientWidth();
                            destX = Math.floor(width * Math.max(this.mFirstOffset, Math.min(curInfo.offset, this.mLastOffset)));
                        }
                        if (smoothScroll) {
                            this.smoothScrollTo(destX, 0, velocity);
                            if (dispatchSelected) {
                                this.dispatchOnPageSelected(item);
                            }
                        }
                        else {
                            if (dispatchSelected) {
                                this.dispatchOnPageSelected(item);
                            }
                            this.completeScroll(false);
                            this.scrollTo(destX, 0);
                            this.pageScrolled(destX);
                        }
                    }
                    setOnPageChangeListener(listener) {
                        this.mOnPageChangeListener = listener;
                    }
                    addOnPageChangeListener(listener) {
                        if (this.mOnPageChangeListeners == null) {
                            this.mOnPageChangeListeners = new ArrayList();
                        }
                        this.mOnPageChangeListeners.add(listener);
                    }
                    removeOnPageChangeListener(listener) {
                        if (this.mOnPageChangeListeners != null) {
                            this.mOnPageChangeListeners.remove(listener);
                        }
                    }
                    clearOnPageChangeListeners() {
                        if (this.mOnPageChangeListeners != null) {
                            this.mOnPageChangeListeners.clear();
                        }
                    }
                    setPageTransformer(reverseDrawingOrder, transformer) {
                        const hasTransformer = transformer != null;
                        const needsPopulate = hasTransformer != (this.mPageTransformer != null);
                        this.mPageTransformer = transformer;
                        this.setChildrenDrawingOrderEnabledCompat(hasTransformer);
                        if (hasTransformer) {
                            this.mDrawingOrder = reverseDrawingOrder ? ViewPager.DRAW_ORDER_REVERSE : ViewPager.DRAW_ORDER_FORWARD;
                        }
                        else {
                            this.mDrawingOrder = ViewPager.DRAW_ORDER_DEFAULT;
                        }
                        if (needsPopulate)
                            this.populate();
                    }
                    setChildrenDrawingOrderEnabledCompat(enable = true) {
                        this.setChildrenDrawingOrderEnabled(enable);
                    }
                    getChildDrawingOrder(childCount, i) {
                        const index = this.mDrawingOrder == ViewPager.DRAW_ORDER_REVERSE ? childCount - 1 - i : i;
                        const result = this.mDrawingOrderedChildren.get(index).getLayoutParams().childIndex;
                        return result;
                    }
                    setInternalPageChangeListener(listener) {
                        let oldListener = this.mInternalPageChangeListener;
                        this.mInternalPageChangeListener = listener;
                        return oldListener;
                    }
                    getOffscreenPageLimit() {
                        return this.mOffscreenPageLimit;
                    }
                    setOffscreenPageLimit(limit) {
                        if (limit < ViewPager.DEFAULT_OFFSCREEN_PAGES) {
                            Log.w(TAG, "Requested offscreen page limit " + limit + " too small; defaulting to " +
                                ViewPager.DEFAULT_OFFSCREEN_PAGES);
                            limit = ViewPager.DEFAULT_OFFSCREEN_PAGES;
                        }
                        if (limit != this.mOffscreenPageLimit) {
                            this.mOffscreenPageLimit = limit;
                            this.populate();
                        }
                    }
                    setPageMargin(marginPixels) {
                        const oldMargin = this.mPageMargin;
                        this.mPageMargin = marginPixels;
                        const width = this.getWidth();
                        this.recomputeScrollPosition(width, width, marginPixels, oldMargin);
                        this.requestLayout();
                    }
                    getPageMargin() {
                        return this.mPageMargin;
                    }
                    setPageMarginDrawable(d) {
                        this.mMarginDrawable = d;
                        if (d != null)
                            this.refreshDrawableState();
                        this.setWillNotDraw(d == null);
                        this.invalidate();
                    }
                    verifyDrawable(who) {
                        return super.verifyDrawable(who) || who == this.mMarginDrawable;
                    }
                    drawableStateChanged() {
                        super.drawableStateChanged();
                        const d = this.mMarginDrawable;
                        if (d != null && d.isStateful()) {
                            d.setState(this.getDrawableState());
                        }
                    }
                    distanceInfluenceForSnapDuration(f) {
                        f -= 0.5;
                        f *= 0.3 * Math.PI / 2.0;
                        return Math.sin(f);
                    }
                    smoothScrollTo(x, y, velocity = 0) {
                        if (this.getChildCount() == 0) {
                            this.setScrollingCacheEnabled(false);
                            return;
                        }
                        let sx = this.getScrollX();
                        let sy = this.getScrollY();
                        let dx = x - sx;
                        let dy = y - sy;
                        if (dx == 0 && dy == 0) {
                            this.completeScroll(false);
                            this.populate();
                            this.setScrollState(ViewPager.SCROLL_STATE_IDLE);
                            return;
                        }
                        this.setScrollingCacheEnabled(true);
                        this.setScrollState(ViewPager.SCROLL_STATE_SETTLING);
                        const width = this.getClientWidth();
                        const halfWidth = width / 2;
                        const distanceRatio = Math.min(1, 1.0 * Math.abs(dx) / width);
                        const distance = halfWidth + halfWidth *
                            this.distanceInfluenceForSnapDuration(distanceRatio);
                        let duration = 0;
                        velocity = Math.abs(velocity);
                        if (velocity > 0) {
                            duration = 4 * Math.round(1000 * Math.abs(distance / velocity));
                        }
                        else {
                            const pageWidth = width * this.mAdapter.getPageWidth(this.mCurItem);
                            const pageDelta = Math.abs(dx) / (pageWidth + this.mPageMargin);
                            duration = Math.floor((pageDelta + 1) * 100);
                        }
                        duration = Math.min(duration, ViewPager.MAX_SETTLE_DURATION);
                        this.mScroller.startScroll(sx, sy, dx, dy, duration);
                        this.postInvalidateOnAnimation();
                    }
                    addNewItem(position, index) {
                        let ii = new ItemInfo();
                        ii.position = position;
                        ii.object = this.mAdapter.instantiateItem(this, position);
                        ii.widthFactor = this.mAdapter.getPageWidth(position);
                        if (index < 0 || index >= this.mItems.size()) {
                            this.mItems.add(ii);
                        }
                        else {
                            this.mItems.add(index, ii);
                        }
                        return ii;
                    }
                    dataSetChanged() {
                        // This method only gets called if our observer is attached, so mAdapter is non-null.
                        const adapterCount = this.mAdapter.getCount();
                        this.mExpectedAdapterCount = adapterCount;
                        let needPopulate = this.mItems.size() < this.mOffscreenPageLimit * 2 + 1 &&
                            this.mItems.size() < adapterCount;
                        let newCurrItem = this.mCurItem;
                        let isUpdating = false;
                        for (let i = 0; i < this.mItems.size(); i++) {
                            const ii = this.mItems.get(i);
                            const newPos = this.mAdapter.getItemPosition(ii.object);
                            if (newPos == PagerAdapter.POSITION_UNCHANGED) {
                                continue;
                            }
                            if (newPos == PagerAdapter.POSITION_NONE) {
                                this.mItems.remove(i);
                                i--;
                                if (!isUpdating) {
                                    this.mAdapter.startUpdate(this);
                                    isUpdating = true;
                                }
                                this.mAdapter.destroyItem(this, ii.position, ii.object);
                                needPopulate = true;
                                if (this.mCurItem == ii.position) {
                                    newCurrItem = Math.max(0, Math.min(this.mCurItem, adapterCount - 1));
                                    needPopulate = true;
                                }
                                continue;
                            }
                            if (ii.position != newPos) {
                                if (ii.position == this.mCurItem) {
                                    newCurrItem = newPos;
                                }
                                ii.position = newPos;
                                needPopulate = true;
                            }
                        }
                        if (isUpdating) {
                            this.mAdapter.finishUpdate(this);
                        }
                        this.mItems.sort(ViewPager.COMPARATOR);
                        if (needPopulate) {
                            const childCount = this.getChildCount();
                            for (let i = 0; i < childCount; i++) {
                                const child = this.getChildAt(i);
                                const lp = child.getLayoutParams();
                                if (!lp.isDecor) {
                                    lp.widthFactor = 0;
                                }
                            }
                            this.setCurrentItemInternal(newCurrItem, false, true);
                            this.requestLayout();
                        }
                    }
                    populate(newCurrentItem = this.mCurItem) {
                        let oldCurInfo = null;
                        let focusDirection = View.FOCUS_FORWARD;
                        if (this.mCurItem != newCurrentItem) {
                            focusDirection = this.mCurItem < newCurrentItem ? View.FOCUS_RIGHT : View.FOCUS_LEFT;
                            oldCurInfo = this.infoForPosition(this.mCurItem);
                            this.mCurItem = newCurrentItem;
                        }
                        if (this.mAdapter == null) {
                            this.sortChildDrawingOrder();
                            return;
                        }
                        if (this.mPopulatePending) {
                            if (DEBUG)
                                Log.i(TAG, "populate is pending, skipping for now...");
                            this.sortChildDrawingOrder();
                            return;
                        }
                        if (!this.isAttachedToWindow()) {
                            return;
                        }
                        this.mAdapter.startUpdate(this);
                        const pageLimit = this.mOffscreenPageLimit;
                        const startPos = Math.max(0, this.mCurItem - pageLimit);
                        const N = this.mAdapter.getCount();
                        const endPos = Math.min(N - 1, this.mCurItem + pageLimit);
                        if (N != this.mExpectedAdapterCount) {
                            throw new Error("The application's PagerAdapter changed the adapter's" +
                                " contents without calling PagerAdapter#notifyDataSetChanged!" +
                                " Expected adapter item count: " + this.mExpectedAdapterCount + ", found: " + N +
                                " Pager id: " + this.getId() +
                                " Pager class: " + this.constructor.name +
                                " Problematic adapter: " + this.mAdapter.constructor.name);
                        }
                        let curIndex = -1;
                        let curItem = null;
                        for (curIndex = 0; curIndex < this.mItems.size(); curIndex++) {
                            const ii = this.mItems.get(curIndex);
                            if (ii.position >= this.mCurItem) {
                                if (ii.position == this.mCurItem)
                                    curItem = ii;
                                break;
                            }
                        }
                        if (curItem == null && N > 0) {
                            curItem = this.addNewItem(this.mCurItem, curIndex);
                        }
                        if (curItem != null) {
                            let extraWidthLeft = 0;
                            let itemIndex = curIndex - 1;
                            let ii = itemIndex >= 0 ? this.mItems.get(itemIndex) : null;
                            const clientWidth = this.getClientWidth();
                            const leftWidthNeeded = clientWidth <= 0 ? 0 :
                                2 - curItem.widthFactor + this.getPaddingLeft() / clientWidth;
                            for (let pos = this.mCurItem - 1; pos >= 0; pos--) {
                                if (extraWidthLeft >= leftWidthNeeded && pos < startPos) {
                                    if (ii == null) {
                                        break;
                                    }
                                    if (pos == ii.position && !ii.scrolling) {
                                        this.mItems.remove(itemIndex);
                                        this.mAdapter.destroyItem(this, pos, ii.object);
                                        if (DEBUG) {
                                            Log.i(TAG, "populate() - destroyItem() with pos: " + pos +
                                                " view: " + ii.object);
                                        }
                                        itemIndex--;
                                        curIndex--;
                                        ii = itemIndex >= 0 ? this.mItems.get(itemIndex) : null;
                                    }
                                }
                                else if (ii != null && pos == ii.position) {
                                    extraWidthLeft += ii.widthFactor;
                                    itemIndex--;
                                    ii = itemIndex >= 0 ? this.mItems.get(itemIndex) : null;
                                }
                                else {
                                    ii = this.addNewItem(pos, itemIndex + 1);
                                    extraWidthLeft += ii.widthFactor;
                                    curIndex++;
                                    ii = itemIndex >= 0 ? this.mItems.get(itemIndex) : null;
                                }
                            }
                            let extraWidthRight = curItem.widthFactor;
                            itemIndex = curIndex + 1;
                            if (extraWidthRight < 2) {
                                ii = itemIndex < this.mItems.size() ? this.mItems.get(itemIndex) : null;
                                const rightWidthNeeded = clientWidth <= 0 ? 0 :
                                    this.getPaddingRight() / clientWidth + 2;
                                for (let pos = this.mCurItem + 1; pos < N; pos++) {
                                    if (extraWidthRight >= rightWidthNeeded && pos > endPos) {
                                        if (ii == null) {
                                            break;
                                        }
                                        if (pos == ii.position && !ii.scrolling) {
                                            this.mItems.remove(itemIndex);
                                            this.mAdapter.destroyItem(this, pos, ii.object);
                                            if (DEBUG) {
                                                Log.i(TAG, "populate() - destroyItem() with pos: " + pos +
                                                    " view: " + ii.object);
                                            }
                                            ii = itemIndex < this.mItems.size() ? this.mItems.get(itemIndex) : null;
                                        }
                                    }
                                    else if (ii != null && pos == ii.position) {
                                        extraWidthRight += ii.widthFactor;
                                        itemIndex++;
                                        ii = itemIndex < this.mItems.size() ? this.mItems.get(itemIndex) : null;
                                    }
                                    else {
                                        ii = this.addNewItem(pos, itemIndex);
                                        itemIndex++;
                                        extraWidthRight += ii.widthFactor;
                                        ii = itemIndex < this.mItems.size() ? this.mItems.get(itemIndex) : null;
                                    }
                                }
                            }
                            this.calculatePageOffsets(curItem, curIndex, oldCurInfo);
                        }
                        if (DEBUG) {
                            Log.i(TAG, "Current page list:");
                            for (let i = 0; i < this.mItems.size(); i++) {
                                Log.i(TAG, "#" + i + ": page " + this.mItems.get(i).position);
                            }
                        }
                        this.mAdapter.setPrimaryItem(this, this.mCurItem, curItem != null ? curItem.object : null);
                        this.mAdapter.finishUpdate(this);
                        const childCount = this.getChildCount();
                        for (let i = 0; i < childCount; i++) {
                            const child = this.getChildAt(i);
                            const lp = child.getLayoutParams();
                            lp.childIndex = i;
                            if (!lp.isDecor && lp.widthFactor == 0) {
                                const ii = this.infoForChild(child);
                                if (ii != null) {
                                    lp.widthFactor = ii.widthFactor;
                                    lp.position = ii.position;
                                }
                            }
                        }
                        this.sortChildDrawingOrder();
                        if (this.hasFocus()) {
                            let currentFocused = this.findFocus();
                            let ii = currentFocused != null ? this.infoForAnyChild(currentFocused) : null;
                            if (ii == null || ii.position != this.mCurItem) {
                                for (let i = 0; i < this.getChildCount(); i++) {
                                    let child = this.getChildAt(i);
                                    ii = this.infoForChild(child);
                                    if (ii != null && ii.position == this.mCurItem) {
                                        if (child.requestFocus(focusDirection)) {
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    sortChildDrawingOrder() {
                        if (this.mDrawingOrder != ViewPager.DRAW_ORDER_DEFAULT) {
                            if (this.mDrawingOrderedChildren == null) {
                                this.mDrawingOrderedChildren = new ArrayList();
                            }
                            else {
                                this.mDrawingOrderedChildren.clear();
                            }
                            const childCount = this.getChildCount();
                            for (let i = 0; i < childCount; i++) {
                                const child = this.getChildAt(i);
                                this.mDrawingOrderedChildren.add(child);
                            }
                            this.mDrawingOrderedChildren.sort(ViewPager.sPositionComparator);
                        }
                    }
                    calculatePageOffsets(curItem, curIndex, oldCurInfo) {
                        const N = this.mAdapter.getCount();
                        const width = this.getClientWidth();
                        const marginOffset = width > 0 ? this.mPageMargin / width : 0;
                        if (oldCurInfo != null) {
                            const oldCurPosition = oldCurInfo.position;
                            if (oldCurPosition < curItem.position) {
                                let itemIndex = 0;
                                let ii = null;
                                let offset = oldCurInfo.offset + oldCurInfo.widthFactor + marginOffset;
                                for (let pos = oldCurPosition + 1; pos <= curItem.position && itemIndex < this.mItems.size(); pos++) {
                                    ii = this.mItems.get(itemIndex);
                                    while (pos > ii.position && itemIndex < this.mItems.size() - 1) {
                                        itemIndex++;
                                        ii = this.mItems.get(itemIndex);
                                    }
                                    while (pos < ii.position) {
                                        offset += this.mAdapter.getPageWidth(pos) + marginOffset;
                                        pos++;
                                    }
                                    ii.offset = offset;
                                    offset += ii.widthFactor + marginOffset;
                                }
                            }
                            else if (oldCurPosition > curItem.position) {
                                let itemIndex = this.mItems.size() - 1;
                                let ii = null;
                                let offset = oldCurInfo.offset;
                                for (let pos = oldCurPosition - 1; pos >= curItem.position && itemIndex >= 0; pos--) {
                                    ii = this.mItems.get(itemIndex);
                                    while (pos < ii.position && itemIndex > 0) {
                                        itemIndex--;
                                        ii = this.mItems.get(itemIndex);
                                    }
                                    while (pos > ii.position) {
                                        offset -= this.mAdapter.getPageWidth(pos) + marginOffset;
                                        pos--;
                                    }
                                    offset -= ii.widthFactor + marginOffset;
                                    ii.offset = offset;
                                }
                            }
                        }
                        const itemCount = this.mItems.size();
                        let offset = curItem.offset;
                        let pos = curItem.position - 1;
                        this.mFirstOffset = curItem.position == 0 ? curItem.offset : -Number.MAX_VALUE;
                        this.mLastOffset = curItem.position == N - 1 ?
                            curItem.offset + curItem.widthFactor - 1 : Number.MAX_VALUE;
                        for (let i = curIndex - 1; i >= 0; i--, pos--) {
                            const ii = this.mItems.get(i);
                            while (pos > ii.position) {
                                offset -= this.mAdapter.getPageWidth(pos--) + marginOffset;
                            }
                            offset -= ii.widthFactor + marginOffset;
                            ii.offset = offset;
                            if (ii.position == 0)
                                this.mFirstOffset = offset;
                        }
                        offset = curItem.offset + curItem.widthFactor + marginOffset;
                        pos = curItem.position + 1;
                        for (let i = curIndex + 1; i < itemCount; i++, pos++) {
                            const ii = this.mItems.get(i);
                            while (pos < ii.position) {
                                offset += this.mAdapter.getPageWidth(pos++) + marginOffset;
                            }
                            if (ii.position == N - 1) {
                                this.mLastOffset = offset + ii.widthFactor - 1;
                            }
                            ii.offset = offset;
                            offset += ii.widthFactor + marginOffset;
                        }
                        this.mNeedCalculatePageOffsets = false;
                    }
                    addView(...args) {
                        if (args.length === 3 && args[2] instanceof ViewGroup.LayoutParams) {
                            this._addViewOverride(args[0], args[1], args[2]);
                        }
                        else {
                            super.addView(...args);
                        }
                    }
                    _addViewOverride(child, index, params) {
                        if (!this.checkLayoutParams(params)) {
                            params = this.generateLayoutParams(params);
                        }
                        const lp = params;
                        lp.isDecor = lp.isDecor || ViewPager.isImplDecor(child);
                        if (this.mInLayout) {
                            if (lp != null && lp.isDecor) {
                                throw new Error("Cannot add pager decor view during layout");
                            }
                            lp.needsMeasure = true;
                            this.addViewInLayout(child, index, params);
                        }
                        else {
                            super.addView(child, index, params);
                        }
                        if (ViewPager.USE_CACHE) {
                            if (child.getVisibility() != View.GONE) {
                                child.setDrawingCacheEnabled(this.mScrollingCacheEnabled);
                            }
                            else {
                                child.setDrawingCacheEnabled(false);
                            }
                        }
                    }
                    removeView(view) {
                        if (this.mInLayout) {
                            this.removeViewInLayout(view);
                        }
                        else {
                            super.removeView(view);
                        }
                    }
                    infoForChild(child) {
                        for (let i = 0; i < this.mItems.size(); i++) {
                            let ii = this.mItems.get(i);
                            if (this.mAdapter.isViewFromObject(child, ii.object)) {
                                return ii;
                            }
                        }
                        return null;
                    }
                    infoForAnyChild(child) {
                        let parent;
                        while ((parent = child.getParent()) != this) {
                            if (parent == null || !(parent instanceof View)) {
                                return null;
                            }
                            child = parent;
                        }
                        return this.infoForChild(child);
                    }
                    infoForPosition(position) {
                        for (let i = 0; i < this.mItems.size(); i++) {
                            let ii = this.mItems.get(i);
                            if (ii.position == position) {
                                return ii;
                            }
                        }
                        return null;
                    }
                    onAttachedToWindow() {
                        super.onAttachedToWindow();
                        this.mFirstLayout = true;
                    }
                    onMeasure(widthMeasureSpec, heightMeasureSpec) {
                        this.setMeasuredDimension(ViewPager.getDefaultSize(0, widthMeasureSpec), ViewPager.getDefaultSize(0, heightMeasureSpec));
                        const measuredWidth = this.getMeasuredWidth();
                        const maxGutterSize = measuredWidth / 10;
                        this.mGutterSize = Math.min(maxGutterSize, this.mDefaultGutterSize);
                        let childWidthSize = measuredWidth - this.getPaddingLeft() - this.getPaddingRight();
                        let childHeightSize = this.getMeasuredHeight() - this.getPaddingTop() - this.getPaddingBottom();
                        let size = this.getChildCount();
                        for (let i = 0; i < size; ++i) {
                            const child = this.getChildAt(i);
                            if (child.getVisibility() != View.GONE) {
                                const lp = child.getLayoutParams();
                                if (lp != null && lp.isDecor) {
                                    const hgrav = lp.gravity & Gravity.HORIZONTAL_GRAVITY_MASK;
                                    const vgrav = lp.gravity & Gravity.VERTICAL_GRAVITY_MASK;
                                    let widthMode = MeasureSpec.AT_MOST;
                                    let heightMode = MeasureSpec.AT_MOST;
                                    let consumeVertical = vgrav == Gravity.TOP || vgrav == Gravity.BOTTOM;
                                    let consumeHorizontal = hgrav == Gravity.LEFT || hgrav == Gravity.RIGHT;
                                    if (consumeVertical) {
                                        widthMode = MeasureSpec.EXACTLY;
                                    }
                                    else if (consumeHorizontal) {
                                        heightMode = MeasureSpec.EXACTLY;
                                    }
                                    let widthSize = childWidthSize;
                                    let heightSize = childHeightSize;
                                    if (lp.width != ViewPager.LayoutParams.WRAP_CONTENT) {
                                        widthMode = MeasureSpec.EXACTLY;
                                        if (lp.width != ViewPager.LayoutParams.FILL_PARENT) {
                                            widthSize = lp.width;
                                        }
                                    }
                                    if (lp.height != ViewPager.LayoutParams.WRAP_CONTENT) {
                                        heightMode = MeasureSpec.EXACTLY;
                                        if (lp.height != ViewPager.LayoutParams.FILL_PARENT) {
                                            heightSize = lp.height;
                                        }
                                    }
                                    const widthSpec = MeasureSpec.makeMeasureSpec(widthSize, widthMode);
                                    const heightSpec = MeasureSpec.makeMeasureSpec(heightSize, heightMode);
                                    child.measure(widthSpec, heightSpec);
                                    if (consumeVertical) {
                                        childHeightSize -= child.getMeasuredHeight();
                                    }
                                    else if (consumeHorizontal) {
                                        childWidthSize -= child.getMeasuredWidth();
                                    }
                                }
                            }
                        }
                        this.mChildWidthMeasureSpec = MeasureSpec.makeMeasureSpec(childWidthSize, MeasureSpec.EXACTLY);
                        this.mChildHeightMeasureSpec = MeasureSpec.makeMeasureSpec(childHeightSize, MeasureSpec.EXACTLY);
                        this.mInLayout = true;
                        this.populate();
                        this.mInLayout = false;
                        size = this.getChildCount();
                        for (let i = 0; i < size; ++i) {
                            const child = this.getChildAt(i);
                            if (child.getVisibility() != View.GONE) {
                                if (DEBUG)
                                    Log.v(TAG, "Measuring #" + i + " " + child
                                        + ": " + this.mChildWidthMeasureSpec);
                                const lp = child.getLayoutParams();
                                if (lp == null || !lp.isDecor) {
                                    const widthSpec = MeasureSpec.makeMeasureSpec((childWidthSize * lp.widthFactor), MeasureSpec.EXACTLY);
                                    child.measure(widthSpec, this.mChildHeightMeasureSpec);
                                }
                            }
                        }
                    }
                    onSizeChanged(w, h, oldw, oldh) {
                        super.onSizeChanged(w, h, oldw, oldh);
                        if (w != oldw) {
                            this.recomputeScrollPosition(w, oldw, this.mPageMargin, this.mPageMargin);
                        }
                    }
                    recomputeScrollPosition(width, oldWidth, margin, oldMargin) {
                        if (oldWidth > 0 && !this.mItems.isEmpty()) {
                            const widthWithMargin = width - this.getPaddingLeft() - this.getPaddingRight() + margin;
                            const oldWidthWithMargin = oldWidth - this.getPaddingLeft() - this.getPaddingRight()
                                + oldMargin;
                            const xpos = this.getScrollX();
                            const pageOffset = xpos / oldWidthWithMargin;
                            const newOffsetPixels = Math.floor(pageOffset * widthWithMargin);
                            this.scrollTo(newOffsetPixels, this.getScrollY());
                            if (!this.mScroller.isFinished()) {
                                const newDuration = this.mScroller.getDuration() - this.mScroller.timePassed();
                                let targetInfo = this.infoForPosition(this.mCurItem);
                                this.mScroller.startScroll(newOffsetPixels, 0, Math.floor(targetInfo.offset * width), 0, newDuration);
                            }
                        }
                        else {
                            const ii = this.infoForPosition(this.mCurItem);
                            const scrollOffset = ii != null ? Math.min(ii.offset, this.mLastOffset) : 0;
                            const scrollPos = Math.floor(scrollOffset *
                                (width - this.getPaddingLeft() - this.getPaddingRight()));
                            if (scrollPos != this.getScrollX()) {
                                this.completeScroll(false);
                                this.scrollTo(scrollPos, this.getScrollY());
                            }
                        }
                    }
                    onLayout(changed, l, t, r, b) {
                        const count = this.getChildCount();
                        let width = r - l;
                        let height = b - t;
                        let paddingLeft = this.getPaddingLeft();
                        let paddingTop = this.getPaddingTop();
                        let paddingRight = this.getPaddingRight();
                        let paddingBottom = this.getPaddingBottom();
                        const scrollX = this.getScrollX();
                        let decorCount = 0;
                        for (let i = 0; i < count; i++) {
                            const child = this.getChildAt(i);
                            if (child.getVisibility() != View.GONE) {
                                const lp = child.getLayoutParams();
                                let childLeft = 0;
                                let childTop = 0;
                                if (lp.isDecor) {
                                    const hgrav = lp.gravity & Gravity.HORIZONTAL_GRAVITY_MASK;
                                    const vgrav = lp.gravity & Gravity.VERTICAL_GRAVITY_MASK;
                                    switch (hgrav) {
                                        default:
                                            childLeft = paddingLeft;
                                            break;
                                        case Gravity.LEFT:
                                            childLeft = paddingLeft;
                                            paddingLeft += child.getMeasuredWidth();
                                            break;
                                        case Gravity.CENTER_HORIZONTAL:
                                            childLeft = Math.max((width - child.getMeasuredWidth()) / 2, paddingLeft);
                                            break;
                                        case Gravity.RIGHT:
                                            childLeft = width - paddingRight - child.getMeasuredWidth();
                                            paddingRight += child.getMeasuredWidth();
                                            break;
                                    }
                                    switch (vgrav) {
                                        default:
                                            childTop = paddingTop;
                                            break;
                                        case Gravity.TOP:
                                            childTop = paddingTop;
                                            paddingTop += child.getMeasuredHeight();
                                            break;
                                        case Gravity.CENTER_VERTICAL:
                                            childTop = Math.max((height - child.getMeasuredHeight()) / 2, paddingTop);
                                            break;
                                        case Gravity.BOTTOM:
                                            childTop = height - paddingBottom - child.getMeasuredHeight();
                                            paddingBottom += child.getMeasuredHeight();
                                            break;
                                    }
                                    childLeft += scrollX;
                                    child.layout(childLeft, childTop, childLeft + child.getMeasuredWidth(), childTop + child.getMeasuredHeight());
                                    decorCount++;
                                }
                            }
                        }
                        const childWidth = width - paddingLeft - paddingRight;
                        for (let i = 0; i < count; i++) {
                            const child = this.getChildAt(i);
                            if (child.getVisibility() != View.GONE) {
                                const lp = child.getLayoutParams();
                                let ii;
                                if (!lp.isDecor && (ii = this.infoForChild(child)) != null) {
                                    let loff = Math.floor(childWidth * ii.offset);
                                    let childLeft = paddingLeft + loff;
                                    let childTop = paddingTop;
                                    if (lp.needsMeasure) {
                                        lp.needsMeasure = false;
                                        const widthSpec = MeasureSpec.makeMeasureSpec(Math.floor(childWidth * lp.widthFactor), MeasureSpec.EXACTLY);
                                        const heightSpec = MeasureSpec.makeMeasureSpec(Math.floor(height - paddingTop - paddingBottom), MeasureSpec.EXACTLY);
                                        child.measure(widthSpec, heightSpec);
                                    }
                                    if (DEBUG)
                                        Log.v(TAG, "Positioning #" + i + " " + child + " f=" + ii.object
                                            + ":" + childLeft + "," + childTop + " " + child.getMeasuredWidth()
                                            + "x" + child.getMeasuredHeight());
                                    child.layout(childLeft, childTop, childLeft + child.getMeasuredWidth(), childTop + child.getMeasuredHeight());
                                }
                            }
                        }
                        this.mTopPageBounds = paddingTop;
                        this.mBottomPageBounds = height - paddingBottom;
                        this.mDecorChildCount = decorCount;
                        if (this.mFirstLayout) {
                            this.scrollToItem(this.mCurItem, false, 0, false);
                        }
                        this.mFirstLayout = false;
                    }
                    computeScroll() {
                        if (!this.mScroller.isFinished() && this.mScroller.computeScrollOffset()) {
                            let oldX = this.getScrollX();
                            let oldY = this.getScrollY();
                            let x = this.mScroller.getCurrX();
                            let y = this.mScroller.getCurrY();
                            if (oldX != x || oldY != y) {
                                this.scrollTo(x, y);
                                if (!this.pageScrolled(x)) {
                                    this.mScroller.abortAnimation();
                                    this.scrollTo(0, y);
                                }
                            }
                            this.postInvalidateOnAnimation();
                            return;
                        }
                        this.completeScroll(true);
                    }
                    pageScrolled(xpos) {
                        if (this.mItems.size() == 0) {
                            this.mCalledSuper = false;
                            this.onPageScrolled(0, 0, 0);
                            if (!this.mCalledSuper) {
                                throw new Error("onPageScrolled did not call superclass implementation");
                            }
                            return false;
                        }
                        const ii = this.infoForCurrentScrollPosition();
                        const width = this.getClientWidth();
                        const widthWithMargin = width + this.mPageMargin;
                        const marginOffset = this.mPageMargin / width;
                        const currentPage = ii.position;
                        const pageOffset = ((xpos / width) - ii.offset) / (ii.widthFactor + marginOffset);
                        const offsetPixels = Math.floor(pageOffset * widthWithMargin);
                        this.mCalledSuper = false;
                        this.onPageScrolled(currentPage, pageOffset, offsetPixels);
                        if (!this.mCalledSuper) {
                            throw new Error("onPageScrolled did not call superclass implementation");
                        }
                        return true;
                    }
                    onPageScrolled(position, offset, offsetPixels) {
                        if (this.mDecorChildCount > 0) {
                            const scrollX = this.getScrollX();
                            let paddingLeft = this.getPaddingLeft();
                            let paddingRight = this.getPaddingRight();
                            const width = this.getWidth();
                            const childCount = this.getChildCount();
                            for (let i = 0; i < childCount; i++) {
                                const child = this.getChildAt(i);
                                const lp = child.getLayoutParams();
                                if (!lp.isDecor)
                                    continue;
                                const hgrav = lp.gravity & Gravity.HORIZONTAL_GRAVITY_MASK;
                                let childLeft = 0;
                                switch (hgrav) {
                                    default:
                                        childLeft = paddingLeft;
                                        break;
                                    case Gravity.LEFT:
                                        childLeft = paddingLeft;
                                        paddingLeft += child.getWidth();
                                        break;
                                    case Gravity.CENTER_HORIZONTAL:
                                        childLeft = Math.max((width - child.getMeasuredWidth()) / 2, paddingLeft);
                                        break;
                                    case Gravity.RIGHT:
                                        childLeft = width - paddingRight - child.getMeasuredWidth();
                                        paddingRight += child.getMeasuredWidth();
                                        break;
                                }
                                childLeft += scrollX;
                                const childOffset = childLeft - child.getLeft();
                                if (childOffset != 0) {
                                    child.offsetLeftAndRight(childOffset);
                                }
                            }
                        }
                        this.dispatchOnPageScrolled(position, offset, offsetPixels);
                        if (this.mPageTransformer != null) {
                            const scrollX = this.getScrollX();
                            const childCount = this.getChildCount();
                            for (let i = 0; i < childCount; i++) {
                                const child = this.getChildAt(i);
                                const lp = child.getLayoutParams();
                                if (lp.isDecor)
                                    continue;
                                const transformPos = (child.getLeft() - scrollX) / this.getClientWidth();
                                this.mPageTransformer.transformPage(child, transformPos);
                            }
                        }
                        this.mCalledSuper = true;
                    }
                    dispatchOnPageScrolled(position, offset, offsetPixels) {
                        if (this.mOnPageChangeListener != null) {
                            this.mOnPageChangeListener.onPageScrolled(position, offset, offsetPixels);
                        }
                        if (this.mOnPageChangeListeners != null) {
                            for (let i = 0, z = this.mOnPageChangeListeners.size(); i < z; i++) {
                                let listener = this.mOnPageChangeListeners.get(i);
                                if (listener != null) {
                                    listener.onPageScrolled(position, offset, offsetPixels);
                                }
                            }
                        }
                        if (this.mInternalPageChangeListener != null) {
                            this.mInternalPageChangeListener.onPageScrolled(position, offset, offsetPixels);
                        }
                    }
                    dispatchOnPageSelected(position) {
                        if (this.mOnPageChangeListener != null) {
                            this.mOnPageChangeListener.onPageSelected(position);
                        }
                        if (this.mOnPageChangeListeners != null) {
                            for (let i = 0, z = this.mOnPageChangeListeners.size(); i < z; i++) {
                                let listener = this.mOnPageChangeListeners.get(i);
                                if (listener != null) {
                                    listener.onPageSelected(position);
                                }
                            }
                        }
                        if (this.mInternalPageChangeListener != null) {
                            this.mInternalPageChangeListener.onPageSelected(position);
                        }
                    }
                    dispatchOnScrollStateChanged(state) {
                        if (this.mOnPageChangeListener != null) {
                            this.mOnPageChangeListener.onPageScrollStateChanged(state);
                        }
                        if (this.mOnPageChangeListeners != null) {
                            for (let i = 0, z = this.mOnPageChangeListeners.size(); i < z; i++) {
                                let listener = this.mOnPageChangeListeners.get(i);
                                if (listener != null) {
                                    listener.onPageScrollStateChanged(state);
                                }
                            }
                        }
                        if (this.mInternalPageChangeListener != null) {
                            this.mInternalPageChangeListener.onPageScrollStateChanged(state);
                        }
                    }
                    completeScroll(postEvents) {
                        let needPopulate = this.mScrollState == ViewPager.SCROLL_STATE_SETTLING;
                        if (needPopulate) {
                            this.setScrollingCacheEnabled(false);
                            this.mScroller.abortAnimation();
                            let oldX = this.getScrollX();
                            let oldY = this.getScrollY();
                            let x = this.mScroller.getCurrX();
                            let y = this.mScroller.getCurrY();
                            if (oldX != x || oldY != y) {
                                this.scrollTo(x, y);
                                if (x != oldX) {
                                    this.pageScrolled(x);
                                }
                            }
                        }
                        this.mPopulatePending = false;
                        for (let i = 0; i < this.mItems.size(); i++) {
                            let ii = this.mItems.get(i);
                            if (ii.scrolling) {
                                needPopulate = true;
                                ii.scrolling = false;
                            }
                        }
                        if (needPopulate) {
                            if (postEvents) {
                                this.postOnAnimation(this.mEndScrollRunnable);
                            }
                            else {
                                this.mEndScrollRunnable.run();
                            }
                        }
                    }
                    isGutterDrag(x, dx) {
                        return (x < this.mGutterSize && dx > 0) || (x > this.getWidth() - this.mGutterSize && dx < 0);
                    }
                    enableLayers(enable) {
                    }
                    onInterceptTouchEvent(ev) {
                        /*
                         * This method JUST determines whether we want to intercept the motion.
                         * If we return true, onMotionEvent will be called and we do the actual
                         * scrolling there.
                         */
                        const action = ev.getAction() & MotionEvent.ACTION_MASK;
                        if (action == MotionEvent.ACTION_CANCEL || action == MotionEvent.ACTION_UP) {
                            if (DEBUG)
                                Log.v(TAG, "Intercept done!");
                            this.resetTouch();
                            return false;
                        }
                        if (action != MotionEvent.ACTION_DOWN) {
                            if (this.mIsBeingDragged) {
                                if (DEBUG)
                                    Log.v(TAG, "Intercept returning true!");
                                return true;
                            }
                            if (this.mIsUnableToDrag) {
                                if (DEBUG)
                                    Log.v(TAG, "Intercept returning false!");
                                return false;
                            }
                        }
                        switch (action) {
                            case MotionEvent.ACTION_MOVE: {
                                const activePointerId = this.mActivePointerId;
                                if (activePointerId == ViewPager.INVALID_POINTER) {
                                    break;
                                }
                                const pointerIndex = ev.findPointerIndex(activePointerId);
                                const x = ev.getX(pointerIndex);
                                const dx = x - this.mLastMotionX;
                                const xDiff = Math.abs(dx);
                                const y = ev.getY(pointerIndex);
                                const yDiff = Math.abs(y - this.mInitialMotionY);
                                if (DEBUG)
                                    Log.v(TAG, "Moved x to " + x + "," + y + " diff=" + xDiff + "," + yDiff);
                                if (dx != 0 && !this.isGutterDrag(this.mLastMotionX, dx) &&
                                    this.canScroll(this, false, Math.floor(dx), Math.floor(x), Math.floor(y))) {
                                    this.mLastMotionX = x;
                                    this.mLastMotionY = y;
                                    this.mIsUnableToDrag = true;
                                    return false;
                                }
                                if (xDiff > this.mTouchSlop && xDiff * 0.5 > yDiff) {
                                    if (DEBUG)
                                        Log.v(TAG, "Starting drag!");
                                    this.mIsBeingDragged = true;
                                    this.requestParentDisallowInterceptTouchEvent(true);
                                    this.setScrollState(ViewPager.SCROLL_STATE_DRAGGING);
                                    this.mLastMotionX = dx > 0 ? this.mInitialMotionX + this.mTouchSlop :
                                        this.mInitialMotionX - this.mTouchSlop;
                                    this.mLastMotionY = y;
                                    this.setScrollingCacheEnabled(true);
                                }
                                else if (yDiff > this.mTouchSlop) {
                                    if (DEBUG)
                                        Log.v(TAG, "Starting unable to drag!");
                                    this.mIsUnableToDrag = true;
                                }
                                if (this.mIsBeingDragged) {
                                    if (this.performDrag(x)) {
                                        this.postInvalidateOnAnimation();
                                    }
                                }
                                break;
                            }
                            case MotionEvent.ACTION_DOWN: {
                                this.mLastMotionX = this.mInitialMotionX = ev.getX();
                                this.mLastMotionY = this.mInitialMotionY = ev.getY();
                                this.mActivePointerId = ev.getPointerId(0);
                                this.mIsUnableToDrag = false;
                                this.mScroller.computeScrollOffset();
                                if (this.mScrollState == ViewPager.SCROLL_STATE_SETTLING &&
                                    Math.abs(this.mScroller.getFinalX() - this.mScroller.getCurrX()) > this.mCloseEnough) {
                                    this.mScroller.abortAnimation();
                                    this.mPopulatePending = false;
                                    this.populate();
                                    this.mIsBeingDragged = true;
                                    this.requestParentDisallowInterceptTouchEvent(true);
                                    this.setScrollState(ViewPager.SCROLL_STATE_DRAGGING);
                                }
                                else {
                                    this.completeScroll(false);
                                    this.mIsBeingDragged = false;
                                }
                                if (DEBUG)
                                    Log.v(TAG, "Down at " + this.mLastMotionX + "," + this.mLastMotionY
                                        + " mIsBeingDragged=" + this.mIsBeingDragged
                                        + "mIsUnableToDrag=" + this.mIsUnableToDrag);
                                break;
                            }
                            case MotionEvent.ACTION_POINTER_UP:
                                this.onSecondaryPointerUp(ev);
                                break;
                        }
                        if (this.mVelocityTracker == null) {
                            this.mVelocityTracker = VelocityTracker.obtain();
                        }
                        this.mVelocityTracker.addMovement(ev);
                        return this.mIsBeingDragged;
                    }
                    onTouchEvent(ev) {
                        if (this.mFakeDragging) {
                            return true;
                        }
                        if (ev.getAction() == MotionEvent.ACTION_DOWN && ev.getEdgeFlags() != 0) {
                            return false;
                        }
                        if (this.mAdapter == null || this.mAdapter.getCount() == 0) {
                            return false;
                        }
                        if (this.mVelocityTracker == null) {
                            this.mVelocityTracker = VelocityTracker.obtain();
                        }
                        this.mVelocityTracker.addMovement(ev);
                        const action = ev.getAction();
                        let needsInvalidate = false;
                        switch (action & MotionEvent.ACTION_MASK) {
                            case MotionEvent.ACTION_DOWN: {
                                this.mScroller.abortAnimation();
                                this.mPopulatePending = false;
                                this.populate();
                                this.mLastMotionX = this.mInitialMotionX = ev.getX();
                                this.mLastMotionY = this.mInitialMotionY = ev.getY();
                                this.mActivePointerId = ev.getPointerId(0);
                                break;
                            }
                            case MotionEvent.ACTION_MOVE:
                                if (!this.mIsBeingDragged) {
                                    const pointerIndex = ev.findPointerIndex(this.mActivePointerId);
                                    if (pointerIndex == -1) {
                                        needsInvalidate = this.resetTouch();
                                        break;
                                    }
                                    const x = ev.getX(pointerIndex);
                                    const xDiff = Math.abs(x - this.mLastMotionX);
                                    const y = ev.getY(pointerIndex);
                                    const yDiff = Math.abs(y - this.mLastMotionY);
                                    if (DEBUG)
                                        Log.v(TAG, "Moved x to " + x + "," + y + " diff=" + xDiff + "," + yDiff);
                                    if (xDiff > this.mTouchSlop && xDiff > yDiff) {
                                        if (DEBUG)
                                            Log.v(TAG, "Starting drag!");
                                        this.mIsBeingDragged = true;
                                        this.requestParentDisallowInterceptTouchEvent(true);
                                        this.mLastMotionX = x - this.mInitialMotionX > 0 ? this.mInitialMotionX + this.mTouchSlop :
                                            this.mInitialMotionX - this.mTouchSlop;
                                        this.mLastMotionY = y;
                                        this.setScrollState(ViewPager.SCROLL_STATE_DRAGGING);
                                        this.setScrollingCacheEnabled(true);
                                        let parent = this.getParent();
                                        if (parent != null) {
                                            parent.requestDisallowInterceptTouchEvent(true);
                                        }
                                    }
                                }
                                if (this.mIsBeingDragged) {
                                    const activePointerIndex = ev.findPointerIndex(this.mActivePointerId);
                                    const x = ev.getX(activePointerIndex);
                                    needsInvalidate = needsInvalidate || this.performDrag(x);
                                }
                                break;
                            case MotionEvent.ACTION_UP:
                                if (this.mIsBeingDragged) {
                                    const velocityTracker = this.mVelocityTracker;
                                    velocityTracker.computeCurrentVelocity(1000, this.mMaximumVelocity);
                                    let initialVelocity = velocityTracker.getXVelocity(this.mActivePointerId);
                                    this.mPopulatePending = true;
                                    const width = this.getClientWidth();
                                    const scrollX = this.getScrollX();
                                    const ii = this.infoForCurrentScrollPosition();
                                    const currentPage = ii.position;
                                    const pageOffset = ((scrollX / width) - ii.offset) / ii.widthFactor;
                                    const activePointerIndex = ev.findPointerIndex(this.mActivePointerId);
                                    const x = ev.getX(activePointerIndex);
                                    const totalDelta = (x - this.mInitialMotionX);
                                    let nextPage = this.determineTargetPage(currentPage, pageOffset, initialVelocity, totalDelta);
                                    this.setCurrentItemInternal(nextPage, true, true, initialVelocity);
                                    needsInvalidate = this.resetTouch();
                                }
                                break;
                            case MotionEvent.ACTION_CANCEL:
                                if (this.mIsBeingDragged) {
                                    this.scrollToItem(this.mCurItem, true, 0, false);
                                    needsInvalidate = this.resetTouch();
                                }
                                break;
                            case MotionEvent.ACTION_POINTER_DOWN: {
                                const index = ev.getActionIndex();
                                const x = ev.getX(index);
                                this.mLastMotionX = x;
                                this.mActivePointerId = ev.getPointerId(index);
                                break;
                            }
                            case MotionEvent.ACTION_POINTER_UP:
                                this.onSecondaryPointerUp(ev);
                                this.mLastMotionX = ev.getX(ev.findPointerIndex(this.mActivePointerId));
                                break;
                        }
                        if (needsInvalidate) {
                            this.postInvalidateOnAnimation();
                        }
                        return true;
                    }
                    resetTouch() {
                        let needsInvalidate = false;
                        this.mActivePointerId = ViewPager.INVALID_POINTER;
                        this.endDrag();
                        return needsInvalidate;
                    }
                    requestParentDisallowInterceptTouchEvent(disallowIntercept) {
                        const parent = this.getParent();
                        if (parent != null) {
                            parent.requestDisallowInterceptTouchEvent(disallowIntercept);
                        }
                    }
                    performDrag(x) {
                        let needsInvalidate = false;
                        const deltaX = this.mLastMotionX - x;
                        this.mLastMotionX = x;
                        let oldScrollX = this.getScrollX();
                        let scrollX = oldScrollX + deltaX;
                        const width = this.getClientWidth();
                        let leftBound = width * this.mFirstOffset;
                        let rightBound = width * this.mLastOffset;
                        let leftAbsolute = true;
                        let rightAbsolute = true;
                        const firstItem = this.mItems.get(0);
                        const lastItem = this.mItems.get(this.mItems.size() - 1);
                        if (firstItem.position != 0) {
                            leftAbsolute = false;
                            leftBound = firstItem.offset * width;
                        }
                        if (lastItem.position != this.mAdapter.getCount() - 1) {
                            rightAbsolute = false;
                            rightBound = lastItem.offset * width;
                        }
                        if (scrollX < leftBound) {
                            if (leftAbsolute) {
                                let over = leftBound - scrollX;
                                needsInvalidate = false;
                            }
                            scrollX -= deltaX / 2;
                        }
                        else if (scrollX > rightBound) {
                            if (rightAbsolute) {
                                let over = scrollX - rightBound;
                                needsInvalidate = false;
                            }
                            scrollX -= deltaX / 2;
                        }
                        this.mLastMotionX += scrollX - Math.floor(scrollX);
                        this.scrollTo(scrollX, this.getScrollY());
                        this.pageScrolled(scrollX);
                        return needsInvalidate;
                    }
                    infoForCurrentScrollPosition() {
                        const width = this.getClientWidth();
                        const scrollOffset = width > 0 ? this.getScrollX() / width : 0;
                        const marginOffset = width > 0 ? this.mPageMargin / width : 0;
                        let lastPos = -1;
                        let lastOffset = 0;
                        let lastWidth = 0;
                        let first = true;
                        let lastItem = null;
                        for (let i = 0; i < this.mItems.size(); i++) {
                            let ii = this.mItems.get(i);
                            let offset;
                            if (!first && ii.position != lastPos + 1) {
                                ii = this.mTempItem;
                                ii.offset = lastOffset + lastWidth + marginOffset;
                                ii.position = lastPos + 1;
                                ii.widthFactor = this.mAdapter.getPageWidth(ii.position);
                                i--;
                            }
                            offset = ii.offset;
                            const leftBound = offset;
                            const rightBound = offset + ii.widthFactor + marginOffset;
                            if (first || scrollOffset >= leftBound) {
                                if (scrollOffset < rightBound || i == this.mItems.size() - 1) {
                                    return ii;
                                }
                            }
                            else {
                                return lastItem;
                            }
                            first = false;
                            lastPos = ii.position;
                            lastOffset = offset;
                            lastWidth = ii.widthFactor;
                            lastItem = ii;
                        }
                        return lastItem;
                    }
                    determineTargetPage(currentPage, pageOffset, velocity, deltaX) {
                        let targetPage;
                        if (Math.abs(deltaX) > this.mFlingDistance && Math.abs(velocity) > this.mMinimumVelocity) {
                            targetPage = velocity > 0 ? currentPage : currentPage + 1;
                        }
                        else {
                            const truncator = currentPage >= this.mCurItem ? 0.4 : 0.6;
                            targetPage = Math.floor(currentPage + pageOffset + truncator);
                        }
                        if (this.mItems.size() > 0) {
                            const firstItem = this.mItems.get(0);
                            const lastItem = this.mItems.get(this.mItems.size() - 1);
                            targetPage = Math.max(firstItem.position, Math.min(targetPage, lastItem.position));
                        }
                        return targetPage;
                    }
                    draw(canvas) {
                        super.draw(canvas);
                        let needsInvalidate = false;
                        if (needsInvalidate) {
                            this.postInvalidateOnAnimation();
                        }
                    }
                    onDraw(canvas) {
                        super.onDraw(canvas);
                        if (this.mPageMargin > 0 && this.mMarginDrawable != null && this.mItems.size() > 0 && this.mAdapter != null) {
                            const scrollX = this.getScrollX();
                            const width = this.getWidth();
                            const marginOffset = this.mPageMargin / width;
                            let itemIndex = 0;
                            let ii = this.mItems.get(0);
                            let offset = ii.offset;
                            const itemCount = this.mItems.size();
                            const firstPos = ii.position;
                            const lastPos = this.mItems.get(itemCount - 1).position;
                            for (let pos = firstPos; pos < lastPos; pos++) {
                                while (pos > ii.position && itemIndex < itemCount) {
                                    ii = this.mItems.get(++itemIndex);
                                }
                                let drawAt;
                                if (pos == ii.position) {
                                    drawAt = (ii.offset + ii.widthFactor) * width;
                                    offset = ii.offset + ii.widthFactor + marginOffset;
                                }
                                else {
                                    let widthFactor = this.mAdapter.getPageWidth(pos);
                                    drawAt = (offset + widthFactor) * width;
                                    offset += widthFactor + marginOffset;
                                }
                                if (drawAt + this.mPageMargin > scrollX) {
                                    this.mMarginDrawable.setBounds(drawAt, this.mTopPageBounds, drawAt + this.mPageMargin, this.mBottomPageBounds);
                                    this.mMarginDrawable.draw(canvas);
                                }
                                if (drawAt > scrollX + width) {
                                    break;
                                }
                            }
                        }
                    }
                    beginFakeDrag() {
                        if (this.mIsBeingDragged) {
                            return false;
                        }
                        this.mFakeDragging = true;
                        this.setScrollState(ViewPager.SCROLL_STATE_DRAGGING);
                        this.mInitialMotionX = this.mLastMotionX = 0;
                        if (this.mVelocityTracker == null) {
                            this.mVelocityTracker = VelocityTracker.obtain();
                        }
                        else {
                            this.mVelocityTracker.clear();
                        }
                        const time = android.os.SystemClock.uptimeMillis();
                        const ev = MotionEvent.obtainWithAction(time, time, MotionEvent.ACTION_DOWN, 0, 0, 0);
                        this.mVelocityTracker.addMovement(ev);
                        ev.recycle();
                        this.mFakeDragBeginTime = time;
                        return true;
                    }
                    endFakeDrag() {
                        if (!this.mFakeDragging) {
                            throw new Error("No fake drag in progress. Call beginFakeDrag first.");
                        }
                        const velocityTracker = this.mVelocityTracker;
                        velocityTracker.computeCurrentVelocity(1000, this.mMaximumVelocity);
                        let initialVelocity = Math.floor(velocityTracker.getXVelocity(this.mActivePointerId));
                        this.mPopulatePending = true;
                        const width = this.getClientWidth();
                        const scrollX = this.getScrollX();
                        const ii = this.infoForCurrentScrollPosition();
                        const currentPage = ii.position;
                        const pageOffset = ((scrollX / width) - ii.offset) / ii.widthFactor;
                        const totalDelta = Math.floor(this.mLastMotionX - this.mInitialMotionX);
                        let nextPage = this.determineTargetPage(currentPage, pageOffset, initialVelocity, totalDelta);
                        this.setCurrentItemInternal(nextPage, true, true, initialVelocity);
                        this.endDrag();
                        this.mFakeDragging = false;
                    }
                    fakeDragBy(xOffset) {
                        if (!this.mFakeDragging) {
                            throw new Error("No fake drag in progress. Call beginFakeDrag first.");
                        }
                        this.mLastMotionX += xOffset;
                        let oldScrollX = this.getScrollX();
                        let scrollX = oldScrollX - xOffset;
                        const width = this.getClientWidth();
                        let leftBound = width * this.mFirstOffset;
                        let rightBound = width * this.mLastOffset;
                        const firstItem = this.mItems.get(0);
                        const lastItem = this.mItems.get(this.mItems.size() - 1);
                        if (firstItem.position != 0) {
                            leftBound = firstItem.offset * width;
                        }
                        if (lastItem.position != this.mAdapter.getCount() - 1) {
                            rightBound = lastItem.offset * width;
                        }
                        if (scrollX < leftBound) {
                            scrollX = leftBound;
                        }
                        else if (scrollX > rightBound) {
                            scrollX = rightBound;
                        }
                        this.mLastMotionX += scrollX - Math.floor(scrollX);
                        this.scrollTo(Math.floor(scrollX), this.getScrollY());
                        this.pageScrolled(Math.floor(scrollX));
                        const time = android.os.SystemClock.uptimeMillis();
                        const ev = MotionEvent.obtainWithAction(this.mFakeDragBeginTime, time, MotionEvent.ACTION_MOVE, this.mLastMotionX, 0, 0);
                        this.mVelocityTracker.addMovement(ev);
                        ev.recycle();
                    }
                    isFakeDragging() {
                        return this.mFakeDragging;
                    }
                    onSecondaryPointerUp(ev) {
                        const pointerIndex = ev.getActionIndex();
                        const pointerId = ev.getPointerId(pointerIndex);
                        if (pointerId == this.mActivePointerId) {
                            const newPointerIndex = pointerIndex == 0 ? 1 : 0;
                            this.mLastMotionX = ev.getX(newPointerIndex);
                            this.mActivePointerId = ev.getPointerId(newPointerIndex);
                            if (this.mVelocityTracker != null) {
                                this.mVelocityTracker.clear();
                            }
                        }
                    }
                    endDrag() {
                        this.mIsBeingDragged = false;
                        this.mIsUnableToDrag = false;
                        if (this.mVelocityTracker != null) {
                            this.mVelocityTracker.recycle();
                            this.mVelocityTracker = null;
                        }
                    }
                    setScrollingCacheEnabled(enabled) {
                        if (this.mScrollingCacheEnabled != enabled) {
                            this.mScrollingCacheEnabled = enabled;
                            if (ViewPager.USE_CACHE) {
                                const size = this.getChildCount();
                                for (let i = 0; i < size; ++i) {
                                    const child = this.getChildAt(i);
                                    if (child.getVisibility() != View.GONE) {
                                        child.setDrawingCacheEnabled(enabled);
                                    }
                                }
                            }
                        }
                    }
                    canScrollHorizontally(direction) {
                        if (this.mAdapter == null) {
                            return false;
                        }
                        const width = this.getClientWidth();
                        const scrollX = this.getScrollX();
                        if (direction < 0) {
                            return (scrollX > (width * this.mFirstOffset));
                        }
                        else if (direction > 0) {
                            return (scrollX < (width * this.mLastOffset));
                        }
                        else {
                            return false;
                        }
                    }
                    canScroll(v, checkV, dx, x, y) {
                        if (v instanceof ViewGroup) {
                            const group = v;
                            const scrollX = v.getScrollX();
                            const scrollY = v.getScrollY();
                            const count = group.getChildCount();
                            for (let i = count - 1; i >= 0; i--) {
                                const child = group.getChildAt(i);
                                if (x + scrollX >= child.getLeft() && x + scrollX < child.getRight() &&
                                    y + scrollY >= child.getTop() && y + scrollY < child.getBottom() &&
                                    this.canScroll(child, true, dx, x + scrollX - child.getLeft(), y + scrollY - child.getTop())) {
                                    return true;
                                }
                            }
                        }
                        return checkV && v.canScrollHorizontally(-dx);
                    }
                    addTouchables(views) {
                        for (let i = 0; i < this.getChildCount(); i++) {
                            const child = this.getChildAt(i);
                            if (child.getVisibility() == View.VISIBLE) {
                                let ii = this.infoForChild(child);
                                if (ii != null && ii.position == this.mCurItem) {
                                    child.addTouchables(views);
                                }
                            }
                        }
                    }
                    generateDefaultLayoutParams() {
                        return new ViewPager.LayoutParams();
                    }
                    generateLayoutParams(p) {
                        return this.generateDefaultLayoutParams();
                    }
                    checkLayoutParams(p) {
                        return p instanceof ViewPager.LayoutParams && super.checkLayoutParams(p);
                    }
                    static isImplDecor(view) {
                        return view[SymbolDecor] || view.constructor[SymbolDecor];
                    }
                    static setClassImplDecor(clazz) {
                        clazz[SymbolDecor] = true;
                    }
                }
                ViewPager.COMPARATOR = (lhs, rhs) => {
                    return lhs.position - rhs.position;
                };
                ViewPager.USE_CACHE = false;
                ViewPager.DEFAULT_OFFSCREEN_PAGES = 1;
                ViewPager.MAX_SETTLE_DURATION = 600;
                ViewPager.MIN_DISTANCE_FOR_FLING = 25;
                ViewPager.DEFAULT_GUTTER_SIZE = 16;
                ViewPager.MIN_FLING_VELOCITY = 400;
                ViewPager.sInterpolator = {
                    getInterpolation(t) {
                        t -= 1.0;
                        return t * t * t * t * t + 1.0;
                    }
                };
                ViewPager.INVALID_POINTER = -1;
                ViewPager.CLOSE_ENOUGH = 2;
                ViewPager.DRAW_ORDER_DEFAULT = 0;
                ViewPager.DRAW_ORDER_FORWARD = 1;
                ViewPager.DRAW_ORDER_REVERSE = 2;
                ViewPager.sPositionComparator = (lhs, rhs) => {
                    let llp = lhs.getLayoutParams();
                    let rlp = rhs.getLayoutParams();
                    if (llp.isDecor != rlp.isDecor) {
                        return llp.isDecor ? 1 : -1;
                    }
                    return llp.position - rlp.position;
                };
                ViewPager.SCROLL_STATE_IDLE = 0;
                ViewPager.SCROLL_STATE_DRAGGING = 1;
                ViewPager.SCROLL_STATE_SETTLING = 2;
                view_5.ViewPager = ViewPager;
                (function (ViewPager) {
                    class SimpleOnPageChangeListener {
                        onPageScrolled(position, positionOffset, positionOffsetPixels) {
                        }
                        onPageSelected(position) {
                        }
                        onPageScrollStateChanged(state) {
                        }
                    }
                    ViewPager.SimpleOnPageChangeListener = SimpleOnPageChangeListener;
                    class LayoutParams extends ViewGroup.LayoutParams {
                        constructor() {
                            super(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
                            this.isDecor = false;
                            this.gravity = 0;
                            this.widthFactor = 0;
                            this.needsMeasure = false;
                            this.position = 0;
                            this.childIndex = 0;
                        }
                        _createAttrChangeHandler(mergeHandler) {
                            super._createAttrChangeHandler(mergeHandler);
                            let params = this;
                            mergeHandler.add({
                                set gravity(value) {
                                    params.gravity = View.AttrChangeHandler.parseGravity(value, params.gravity);
                                },
                                get gravity() {
                                    return params.gravity;
                                }
                            });
                        }
                    }
                    ViewPager.LayoutParams = LayoutParams;
                })(ViewPager = view_5.ViewPager || (view_5.ViewPager = {}));
                class ItemInfo {
                    constructor() {
                        this.position = 0;
                        this.scrolling = false;
                        this.widthFactor = 0;
                        this.offset = 0;
                    }
                }
                class PagerObserver extends DataSetObserver {
                    constructor(viewPager) {
                        super();
                        this.ViewPager_this = viewPager;
                    }
                    onChanged() {
                        this.ViewPager_this.dataSetChanged();
                    }
                    onInvalidated() {
                        this.ViewPager_this.dataSetChanged();
                    }
                }
            })(view = v4.view || (v4.view = {}));
        })(v4 = support.v4 || (support.v4 = {}));
    })(support = android.support || (android.support = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/11/6.
 */
///<reference path="../../../../android/view/View.ts"/>
///<reference path="../../../../android/view/ViewGroup.ts"/>
///<reference path="../../../../android/support/v4/view/ViewPager.ts"/>
///<reference path="../../../../android/support/v4/view/PagerAdapter.ts"/>
var com;
(function (com) {
    var jakewharton;
    (function (jakewharton) {
        var salvage;
        (function (salvage) {
            var SparseArray = android.util.SparseArray;
            var PagerAdapter = android.support.v4.view.PagerAdapter;
            class RecyclingPagerAdapter extends PagerAdapter {
                constructor() {
                    super();
                    this.recycleBin = new RecycleBin();
                    this.recycleBin.setViewTypeCount(this.getViewTypeCount());
                }
                notifyDataSetChanged() {
                    this.recycleBin.scrapActiveViews();
                    super.notifyDataSetChanged();
                }
                instantiateItem(container, position) {
                    let viewType = this.getItemViewType(position);
                    let view = null;
                    if (viewType != RecyclingPagerAdapter.IGNORE_ITEM_VIEW_TYPE) {
                        view = this.recycleBin.getScrapView(position, viewType);
                    }
                    view = this.getView(position, view, container);
                    container.addView(view);
                    return view;
                }
                destroyItem(container, position, object) {
                    let view = object;
                    container.removeView(view);
                    let viewType = this.getItemViewType(position);
                    if (viewType != RecyclingPagerAdapter.IGNORE_ITEM_VIEW_TYPE) {
                        this.recycleBin.addScrapView(view, position, viewType);
                    }
                }
                isViewFromObject(view, object) {
                    return view === object;
                }
                getViewTypeCount() {
                    return 1;
                }
                getItemViewType(position) {
                    return 0;
                }
            }
            RecyclingPagerAdapter.IGNORE_ITEM_VIEW_TYPE = -1;
            salvage.RecyclingPagerAdapter = RecyclingPagerAdapter;
            class RecycleBin {
                constructor() {
                    this.activeViews = [];
                    this.activeViewTypes = [];
                    this.viewTypeCount = 0;
                }
                setViewTypeCount(viewTypeCount) {
                    if (viewTypeCount < 1) {
                        throw new Error("Can't have a viewTypeCount < 1");
                    }
                    let scrapViews = new Array(viewTypeCount);
                    for (let i = 0; i < viewTypeCount; i++) {
                        scrapViews[i] = new SparseArray();
                    }
                    this.viewTypeCount = viewTypeCount;
                    this.currentScrapViews = scrapViews[0];
                    this.scrapViews = scrapViews;
                }
                shouldRecycleViewType(viewType) {
                    return viewType >= 0;
                }
                getScrapView(position, viewType) {
                    if (this.viewTypeCount == 1) {
                        return this.retrieveFromScrap(this.currentScrapViews, position);
                    }
                    else if (viewType >= 0 && viewType < this.scrapViews.length) {
                        return this.retrieveFromScrap(this.scrapViews[viewType], position);
                    }
                    return null;
                }
                addScrapView(scrap, position, viewType) {
                    if (this.viewTypeCount == 1) {
                        this.currentScrapViews.put(position, scrap);
                    }
                    else {
                        this.scrapViews[viewType].put(position, scrap);
                    }
                }
                scrapActiveViews() {
                    const activeViews = this.activeViews;
                    const activeViewTypes = this.activeViewTypes;
                    const multipleScraps = this.viewTypeCount > 1;
                    let scrapViews = this.currentScrapViews;
                    const count = activeViews.length;
                    for (let i = count - 1; i >= 0; i--) {
                        const victim = activeViews[i];
                        if (victim != null) {
                            let whichScrap = activeViewTypes[i];
                            activeViews[i] = null;
                            activeViewTypes[i] = -1;
                            if (!this.shouldRecycleViewType(whichScrap)) {
                                continue;
                            }
                            if (multipleScraps) {
                                scrapViews = this.scrapViews[whichScrap];
                            }
                            scrapViews.put(i, victim);
                        }
                    }
                    this.pruneScrapViews();
                }
                pruneScrapViews() {
                    const maxViews = this.activeViews.length;
                    const viewTypeCount = this.viewTypeCount;
                    const scrapViews = this.scrapViews;
                    for (let i = 0; i < viewTypeCount; ++i) {
                        const scrapPile = scrapViews[i];
                        let size = scrapPile.size();
                        const extras = size - maxViews;
                        size--;
                        for (let j = 0; j < extras; j++) {
                            scrapPile.remove(scrapPile.keyAt(size--));
                        }
                    }
                }
                retrieveFromScrap(scrapViews, position) {
                    let size = scrapViews.size();
                    if (size > 0) {
                        for (let i = 0; i < size; i++) {
                            let fromPosition = scrapViews.keyAt(i);
                            let view = scrapViews.get(fromPosition);
                            if (fromPosition == position) {
                                scrapViews.remove(fromPosition);
                                return view;
                            }
                        }
                        let index = size - 1;
                        let r = scrapViews.valueAt(index);
                        scrapViews.remove(scrapViews.keyAt(index));
                        return r;
                    }
                    else {
                        return null;
                    }
                }
            }
        })(salvage = jakewharton.salvage || (jakewharton.salvage = {}));
    })(jakewharton = com.jakewharton || (com.jakewharton = {}));
})(com || (com = {}));
/**
 * Created by linfaxin on 15/10/23.
 */
///<reference path="../android/view/View.ts"/>
///<reference path="../android/view/ViewGroup.ts"/>
///<reference path="../android/view/ViewRootImpl.ts"/>
///<reference path="../android/widget/FrameLayout.ts"/>
///<reference path="../android/view/MotionEvent.ts"/>
var runtime;
(function (runtime) {
    var View = android.view.View;
    var ViewGroup = android.view.ViewGroup;
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
            this.viewRootImpl.rootElement = this.element;
            this.rootLayout = new RootLayout();
            this.canvas = document.createElement("canvas");
            this.initInflateView();
            this.initRootElementStyle();
            this.initCanvasStyle();
            this.initBindElementStyle();
            this.element.innerHTML = '';
            this.element.appendChild(this.rootResourceElement);
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
                if (item.tagName.toLowerCase() === 'resources') {
                    this.rootResourceElement = item;
                }
                else if (item instanceof HTMLStyleElement) {
                    this.rootStyleElement = item;
                }
                else if (item instanceof HTMLElement) {
                    let view = View.inflate(item, this.element, this.rootLayout);
                    if (view)
                        this.rootLayout.addView(view);
                }
            });
        }
        initRootElementStyle() {
            if (!this.element.style.position) {
                this.element.style.position = "relative";
            }
            if (!this.element.style.display || this.element.style.display == "none") {
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
            let windowBound = new android.graphics.Rect();
            this.element.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.viewRootImpl && this.viewRootImpl.mIsInTraversal)
                    return;
                let rootViewBound = this.element.getBoundingClientRect();
                windowBound.set(rootViewBound.left, rootViewBound.top, rootViewBound.right, rootViewBound.bottom);
                if (!motionEvent)
                    motionEvent = MotionEvent.obtainWithTouchEvent(e, MotionEvent.ACTION_DOWN);
                else
                    motionEvent.init(e, MotionEvent.ACTION_DOWN, windowBound);
                this.rootLayout.dispatchTouchEvent(motionEvent);
            }, true);
            this.element.addEventListener('touchmove', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.viewRootImpl && this.viewRootImpl.mIsInTraversal)
                    return;
                motionEvent.init(e, MotionEvent.ACTION_MOVE, windowBound);
                this.rootLayout.dispatchTouchEvent(motionEvent);
            }, true);
            this.element.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.viewRootImpl && this.viewRootImpl.mIsInTraversal)
                    return;
                motionEvent.init(e, MotionEvent.ACTION_UP);
                this.rootLayout.dispatchTouchEvent(motionEvent);
            }, true);
            this.element.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.viewRootImpl && this.viewRootImpl.mIsInTraversal)
                    return;
                motionEvent.init(e, MotionEvent.ACTION_CANCEL, windowBound);
                this.rootLayout.dispatchTouchEvent(motionEvent);
            }, true);
        }
        initBindElementStyle() {
            if (!this.rootStyleElement)
                this.rootStyleElement = document.createElement("style");
            this.rootStyleElement.setAttribute("scoped", '');
            this.rootStyleElement.innerHTML += `
                * {
                    overflow : hidden;
                }
                resources {
                    display: none;
                }
                Button {
                    border: none;
                    background: none;
                }

                `;
            let density = android.content.res.Resources.getDisplayMetrics().density;
            if (density != 1) {
                this.rootStyleElement.innerHTML += `
                RootLayout {
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
            this.rootLayout.addView(view, -1, -1);
        }
        addContentView(view, params = new ViewGroup.LayoutParams(-1, -1)) {
            this.rootLayout.addView(view, params);
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
                requestAnimationFrame(() => {
                    this.AndroidUI = new AndroidUI(this);
                    this.onCreate();
                    let onCreateFunc = this.getAttribute('oncreate');
                    if (onCreateFunc && typeof window[onCreateFunc] === "function") {
                        window[onCreateFunc].call(this, this);
                    }
                });
            }
            attachedCallback() {
                if (this.AndroidUI) {
                    this.AndroidUI.notifySizeChange(this.offsetWidth, this.offsetHeight);
                }
                else {
                    setTimeout(() => {
                        this.AndroidUI.notifySizeChange(this.offsetWidth, this.offsetHeight);
                    }, 50);
                }
            }
            detachedCallback() {
            }
            attributeChangedCallback(attributeName, oldVal, newVal) {
            }
            setContentView(view) {
                this.AndroidUI.setContentView(view);
            }
            addContentView(view) {
                this.AndroidUI.addContentView(view);
            }
            findViewById(id) {
                return this.AndroidUI.findViewById(id);
            }
            static registerCustomElement() {
                document.registerElement("android-" + this.name, this);
            }
        }
        app.Activity = Activity;
        Activity.registerCustomElement();
    })(app = android.app || (android.app = {}));
})(android || (android = {}));
/**
 * Created by linfaxin on 15/10/6.
 */
//use the deepest sub class as enter
///<reference path="android/view/ViewOverlay.ts"/>
///<reference path="android/widget/FrameLayout.ts"/>
///<reference path="android/widget/ScrollView.ts"/>
///<reference path="android/widget/LinearLayout.ts"/>
///<reference path="android/widget/TextView.ts"/>
///<reference path="android/widget/Button.ts"/>
///<reference path="android/support/v4/view/ViewPager.ts"/>
///<reference path="lib/com/jakewharton/salvage/RecyclingPagerAdapter.ts"/>
///<reference path="android/app/Activity.ts"/>
///<reference path="runtime/AndroidUI.ts"/>
window[`android`] = android;
window[`java`] = java;
window[`runtime`] = runtime;

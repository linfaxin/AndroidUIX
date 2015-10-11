/**
 * Created by linfaxin on 15/10/3.
 */

///<reference path="../Rect.ts"/>
///<reference path="../PixelFormat.ts"/>
///<reference path="../../../java/lang/ref/WeakReference.ts"/>
///<reference path="../../../java/lang/Runnable.ts"/>

module android.graphics.drawable {

    import Rect = android.graphics.Rect;
    import PixelFormat = android.graphics.PixelFormat;
    import WeakReference = java.lang.ref.WeakReference;
    import Runnable = java.lang.Runnable;

    const ZERO_BOUNDS_RECT = new Rect();
    import Callback = Drawable.Callback;

    interface Abstract {
        draw(canvas);
    }


    export class Drawable {
        static Callback : Callback;

        mBounds:Rect = ZERO_BOUNDS_RECT;
        mStateSet = [];
        mLevel = 0;
        mVisible = true;
        mCallback:WeakReference<Callback>;

        constructor() {
        }

        //abstract
        draw(canvas) {
        }

        setBounds(rect:Rect);
        setBounds(left, top, right, bottom);
        setBounds(...args) {
            if (args.length === 1) {
                let rect = args[0];
                return this.setBounds(rect.left, rect.top, rect.right, rect.bottom);
            } else {
                let [left=0, top=0, right=0, bottom=0] = args;
                let oldBounds = this.mBounds;

                if (oldBounds == ZERO_BOUNDS_RECT) {
                    oldBounds = this.mBounds = new Rect();
                }

                if (oldBounds.left != left || oldBounds.top != top ||
                    oldBounds.right != right || oldBounds.bottom != bottom) {
                    if (!oldBounds.isEmpty()) {
                        // first invalidate the previous bounds
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

        getBounds():Rect {
            if (this.mBounds == ZERO_BOUNDS_RECT) {
                this.mBounds = new Rect();
            }

            return this.mBounds;
        }

        setCallback(cb:Callback) {
            this.mCallback = new WeakReference(cb);
        }

        getCallback():Callback {
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

        //abstract
        setAlpha(alpha:number) {
        }

        getAlpha():number {
            return 0xFF;
        }

        isStateful():boolean {
            return false;
        }

        setState(stateSet:Array<number>) {
            stateSet = stateSet || [];
            if (this.mStateSet && stateSet && this.mStateSet.toString() === stateSet.toString()) {
                return false;
            }
            this.mStateSet = stateSet;
            return this.onStateChange(stateSet);
        }

        getState():Array<number> {
            return this.mStateSet;
        }

        jumpToCurrentState() {
        }

        getCurrent():Drawable {
            return this;
        }

        setLevel(level:number):boolean {
            if (this.mLevel != level) {
                this.mLevel = level;
                return this.onLevelChange(level);
            }
            return false;
        }

        getLevel():number {
            return this.mLevel;
        }

        setVisible(visible:boolean, restart:boolean) {
            let changed = this.mVisible != visible;
            if (changed) {
                this.mVisible = visible;
                this.invalidateSelf();
            }
            return changed;
        }

        isVisible():boolean {
            return this.mVisible;
        }

        setAutoMirrored(mirrored:boolean) {
        }

        isAutoMirrored():boolean {
            return false;
        }

        //abstract
        getOpacity() {
        }

        static resolveOpacity(op1:number, op2:number) {
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

        onStateChange(state:Array<number>):boolean {
            return false;
        }

        onLevelChange(level:number):boolean {
            return false;
        }

        onBoundsChange(bounds:Rect) {
        }

        getIntrinsicWidth():number {
            return -1;
        }

        getIntrinsicHeight():number {
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

        getPadding(padding:Rect):boolean {
            padding.set(0, 0, 0, 0);
            return false;
        }

        mutate(): Drawable {
            return this;
        }

        getConstantState() {
            return null;
        }
    }

    export module Drawable{
        export interface Callback{
            invalidateDrawable(who : Drawable);
            scheduleDrawable(who : Drawable, what:Runnable, when:number);
            unscheduleDrawable(who: Drawable, what:Runnable);
        }
        export interface ConstantState{
            newDrawable(res);
        }
    }

}

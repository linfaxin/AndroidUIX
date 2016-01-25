/**
 * Created by linfaxin on 15/10/3.
 */

///<reference path="../Rect.ts"/>
///<reference path="../PixelFormat.ts"/>
///<reference path="../../../java/lang/ref/WeakReference.ts"/>
///<reference path="../../../java/lang/Runnable.ts"/>
///<reference path="../../util/StateSet.ts"/>
///<reference path="../Canvas.ts"/>

module android.graphics.drawable {

    import Rect = android.graphics.Rect;
    import PixelFormat = android.graphics.PixelFormat;
    import WeakReference = java.lang.ref.WeakReference;
    import Runnable = java.lang.Runnable;
    import StateSet = android.util.StateSet;
    import Canvas = android.graphics.Canvas;

    export abstract class Drawable {
        private static ZERO_BOUNDS_RECT = new Rect();

        mBounds:Rect = Drawable.ZERO_BOUNDS_RECT;
        mStateSet = StateSet.WILD_CARD;
        mLevel = 0;
        mVisible = true;
        mCallback:WeakReference<Drawable.Callback>;

        constructor() {
        }

        abstract draw(canvas:Canvas);

        setBounds(rect:Rect);
        setBounds(left, top, right, bottom);
        setBounds(...args) {
            if (args.length === 1) {
                let rect = args[0];
                return this.setBounds(rect.left, rect.top, rect.right, rect.bottom);
            } else {
                let [left=0, top=0, right=0, bottom=0] = args;
                let oldBounds = this.mBounds;

                if (oldBounds == Drawable.ZERO_BOUNDS_RECT) {
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
            if (this.mBounds == Drawable.ZERO_BOUNDS_RECT) {
                this.mBounds = new Rect();
            }

            return this.mBounds;
        }
        setDither(dither:boolean) {}

        setCallback(cb:Drawable.Callback) {
            this.mCallback = new WeakReference(cb);
        }

        getCallback():Drawable.Callback {
            if (this.mCallback != null) {
                return this.mCallback.get();
            }
            return null;
        }

        notifySizeChangeSelf() {
            let callback = this.getCallback();
            if (callback != null && callback.drawableSizeChange) {
                callback.drawableSizeChange(this);
            }
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


        abstract
        setAlpha(alpha:number):void;

        getAlpha():number {
            return 0xFF;
        }

        isStateful():boolean {
            return false;
        }

        setState(stateSet:Array<number>) {
            if (this.mStateSet+'' !== stateSet+'') {
                this.mStateSet = stateSet;
                return this.onStateChange(stateSet);
            }
            return false;
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
        getOpacity():number {
            return PixelFormat.TRANSLUCENT;
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

        protected onStateChange(state:Array<number>):boolean {
            return false;
        }

        protected onLevelChange(level:number):boolean {
            return false;
        }

        protected onBoundsChange(bounds:Rect):void {
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

        getConstantState():Drawable.ConstantState {
            return null;
        }
    }

    export module Drawable{
        export interface Callback{
            invalidateDrawable(who : Drawable):void;
            drawableSizeChange?(who : Drawable):void;//for androidui
            scheduleDrawable(who : Drawable, what:Runnable, when:number):void;
            unscheduleDrawable(who: Drawable, what:Runnable):void;
        }
        export interface ConstantState{
            newDrawable():Drawable;
        }
    }

}

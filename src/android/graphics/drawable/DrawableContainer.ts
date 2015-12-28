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

module android.graphics.drawable{
    import Canvas = android.graphics.Canvas;
    import Rect = android.graphics.Rect;
    import PixelFormat = android.graphics.PixelFormat;
    import WeakReference = java.lang.ref.WeakReference;
    import Runnable = java.lang.Runnable;
    import StateSet = android.util.StateSet;
    import Log = android.util.Log;
    import SparseArray = android.util.SparseArray;
    import SystemClock = android.os.SystemClock;


    export class DrawableContainer extends Drawable implements Drawable.Callback {
        private static DEBUG = Log.DBG_DrawableContainer;
        private static TAG = "DrawableContainer";

        static DEFAULT_DITHER = true;
        private mDrawableContainerState:DrawableContainer.DrawableContainerState;
        private mCurrDrawable:Drawable;
        private mAlpha = 0xFF;

        private mCurIndex = -1;
        mMutated=false;

        // Animations.
        private mAnimationRunnable:Runnable;
        private mEnterAnimationEnd=0;
        private mExitAnimationEnd=0;
        private mLastDrawable:Drawable;

        draw(canvas:Canvas) {
            if (this.mCurrDrawable != null) {
                this.mCurrDrawable.draw(canvas);
            }
            if (this.mLastDrawable != null) {
                this.mLastDrawable.draw(canvas);
            }
        }

        private needsMirroring():boolean{
            return false && this.isAutoMirrored();
        }

        getPadding(padding:android.graphics.Rect):boolean {
            const r = this.mDrawableContainerState.getConstantPadding();
            let result;
            if (r != null) {
                padding.set(r);
                result = (r.left | r.top | r.bottom | r.right) != 0;
            } else {
                if (this.mCurrDrawable != null) {
                    result = this.mCurrDrawable.getPadding(padding);
                } else {
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
        setAlpha(alpha:number) {
            if (this.mAlpha != alpha) {
                this.mAlpha = alpha;
                if (this.mCurrDrawable != null) {
                    if (this.mEnterAnimationEnd == 0) {
                        this.mCurrDrawable.mutate().setAlpha(alpha);
                    } else {
                        this.animate(false);
                    }
                }
            }
        }

        getAlpha():number {
            return this.mAlpha;
        }

        setDither(dither:boolean) {
            if (this.mDrawableContainerState.mDither != dither) {
                this.mDrawableContainerState.mDither = dither;
                if (this.mCurrDrawable != null) {
                    this.mCurrDrawable.mutate().setDither(this.mDrawableContainerState.mDither);
                }
            }
        }

        setEnterFadeDuration(ms:number) {
            this.mDrawableContainerState.mEnterFadeDuration = ms;
        }

        setExitFadeDuration(ms:number) {
            this.mDrawableContainerState.mExitFadeDuration = ms;
        }

        protected onBoundsChange(bounds:android.graphics.Rect):void {
            if (this.mLastDrawable != null) {
                this.mLastDrawable.setBounds(bounds);
            }
            if (this.mCurrDrawable != null) {
                this.mCurrDrawable.setBounds(bounds);
            }
        }
        isStateful():boolean {
            return this.mDrawableContainerState.isStateful();
        }
        setAutoMirrored(mirrored:boolean) {
            this.mDrawableContainerState.mAutoMirrored = mirrored;
            if (this.mCurrDrawable != null) {
                this.mCurrDrawable.mutate().setAutoMirrored(this.mDrawableContainerState.mAutoMirrored);
            }
        }
        isAutoMirrored():boolean {
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
        protected onStateChange(state:Array<number>):boolean {
            if (this.mLastDrawable != null) {
                return this.mLastDrawable.setState(state);
            }
            if (this.mCurrDrawable != null) {
                return this.mCurrDrawable.setState(state);
            }
            return false;
        }

        protected onLevelChange(level:number):boolean {
            if (this.mLastDrawable != null) {
                return this.mLastDrawable.setLevel(level);
            }
            if (this.mCurrDrawable != null) {
                return this.mCurrDrawable.setLevel(level);
            }
            return false;
        }

        getIntrinsicWidth():number {
            if (this.mDrawableContainerState.isConstantSize()) {
                return this.mDrawableContainerState.getConstantWidth();
            }
            return this.mCurrDrawable != null ? this.mCurrDrawable.getIntrinsicWidth() : -1;
        }

        getIntrinsicHeight():number {
            if (this.mDrawableContainerState.isConstantSize()) {
                return this.mDrawableContainerState.getConstantHeight();
            }
            return this.mCurrDrawable != null ? this.mCurrDrawable.getIntrinsicHeight() : -1;
        }

        getMinimumWidth():number {
            if (this.mDrawableContainerState.isConstantSize()) {
                return this.mDrawableContainerState.getConstantMinimumWidth();
            }
            return this.mCurrDrawable != null ? this.mCurrDrawable.getMinimumWidth() : 0;
        }
        getMinimumHeight():number {
            if (this.mDrawableContainerState.isConstantSize()) {
                return this.mDrawableContainerState.getConstantMinimumHeight();
            }
            return this.mCurrDrawable != null ? this.mCurrDrawable.getMinimumHeight() : 0;
        }

        drawableSizeChange(who:android.graphics.drawable.Drawable):void {
            let callback = this.getCallback();
            if (who == this.mCurrDrawable && callback != null && callback.drawableSizeChange) {
                callback.drawableSizeChange(this);
            }
        }

        invalidateDrawable(who:android.graphics.drawable.Drawable):void {
            if (who == this.mCurrDrawable && this.getCallback() != null) {
                this.getCallback().invalidateDrawable(this);
            }
        }

        scheduleDrawable(who:android.graphics.drawable.Drawable, what:java.lang.Runnable, when:number):void {
            if (who == this.mCurrDrawable && this.getCallback() != null) {
                this.getCallback().scheduleDrawable(this, what, when);
            }
        }

        unscheduleDrawable(who:android.graphics.drawable.Drawable, what:java.lang.Runnable):void {
            if (who == this.mCurrDrawable && this.getCallback() != null) {
                this.getCallback().unscheduleDrawable(this, what);
            }
        }

        setVisible(visible:boolean, restart:boolean):boolean {
            let changed = super.setVisible(visible, restart);
            if (this.mLastDrawable != null) {
                this.mLastDrawable.setVisible(visible, restart);
            }
            if (this.mCurrDrawable != null) {
                this.mCurrDrawable.setVisible(visible, restart);
            }
            return changed;
        }

        getOpacity():number {
            return this.mCurrDrawable == null || !this.mCurrDrawable.isVisible() ? PixelFormat.TRANSPARENT :
                this.mDrawableContainerState.getOpacity();
        }

        selectDrawable(idx:number):boolean {
            if (idx == this.mCurIndex) {
                return false;
            }

            const now = SystemClock.uptimeMillis();

            if (DrawableContainer.DEBUG) android.util.Log.i(DrawableContainer.TAG, toString() + " from " + this.mCurIndex + " to " + idx
                + ": exit=" + this.mDrawableContainerState.mExitFadeDuration
                + " enter=" + this.mDrawableContainerState.mEnterFadeDuration);

            if (this.mDrawableContainerState.mExitFadeDuration > 0) {
                if (this.mLastDrawable != null) {
                    this.mLastDrawable.setVisible(false, false);
                }
                if (this.mCurrDrawable != null) {
                    this.mLastDrawable = this.mCurrDrawable;
                    this.mExitAnimationEnd = now + this.mDrawableContainerState.mExitFadeDuration;
                } else {
                    this.mLastDrawable = null;
                    this.mExitAnimationEnd = 0;
                }
            } else if (this.mCurrDrawable != null) {
                this.mCurrDrawable.setVisible(false, false);
            }

            if (idx >= 0 && idx < this.mDrawableContainerState.mNumChildren) {
                const d = this.mDrawableContainerState.getChild(idx);
                this.mCurrDrawable = d;
                this.mCurIndex = idx;
                if (d != null) {
                    //this.mInsets = d.getOpticalInsets();
                    d.mutate();
                    if (this.mDrawableContainerState.mEnterFadeDuration > 0) {
                        this.mEnterAnimationEnd = now + this.mDrawableContainerState.mEnterFadeDuration;
                    } else {
                        d.setAlpha(this.mAlpha);
                    }
                    d.setVisible(this.isVisible(), true);
                    d.setDither(this.mDrawableContainerState.mDither);
                    //d.setColorFilter(this.mColorFilter);
                    d.setState(this.getState());
                    d.setLevel(this.getLevel());
                    d.setBounds(this.getBounds());
                    //d.setLayoutDirection(this.getLayoutDirection());
                    d.setAutoMirrored(this.mDrawableContainerState.mAutoMirrored);
                } else {
                    //this.mInsets = Insets.NONE;
                }
            } else {
                this.mCurrDrawable = null;
                //this.mInsets = Insets.NONE;
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
                } else {
                    this.unscheduleSelf(this.mAnimationRunnable);
                }
                // Compute first frame and schedule next animation.
                this.animate(true);
            }

            this.invalidateSelf();

            return true;
        }

        animate(schedule:boolean) {
            const now = SystemClock.uptimeMillis();
            let animating = false;
            if (this.mCurrDrawable != null) {
                if (this.mEnterAnimationEnd != 0) {
                    if (this.mEnterAnimationEnd <= now) {
                        this.mCurrDrawable.mutate().setAlpha(this.mAlpha);
                        this.mEnterAnimationEnd = 0;
                    } else {
                        let animAlpha = ((this.mEnterAnimationEnd-now)*255)
                            / this.mDrawableContainerState.mEnterFadeDuration;
                        if (DrawableContainer.DEBUG) android.util.Log.i(DrawableContainer.TAG, toString() + " cur alpha " + animAlpha);
                        this.mCurrDrawable.mutate().setAlpha(((255-animAlpha)*this.mAlpha)/255);
                        animating = true;
                    }
                }
            } else {
                this.mEnterAnimationEnd = 0;
            }
            if (this.mLastDrawable != null) {
                if (this.mExitAnimationEnd != 0) {
                    if (this.mExitAnimationEnd <= now) {
                        this.mLastDrawable.setVisible(false, false);
                        this.mLastDrawable = null;
                        this.mExitAnimationEnd = 0;
                    } else {
                        let animAlpha = ((this.mExitAnimationEnd-now)*255)
                            / this.mDrawableContainerState.mExitFadeDuration;
                        if (DrawableContainer.DEBUG) android.util.Log.i(DrawableContainer.TAG, toString() + " last alpha " + animAlpha);
                        this.mLastDrawable.mutate().setAlpha((animAlpha*this.mAlpha)/255);
                        animating = true;
                    }
                }
            } else {
                this.mExitAnimationEnd = 0;
            }

            if (schedule && animating) {
                this.scheduleSelf(this.mAnimationRunnable, now + 1000/60);
            }

        }
        getCurrent():Drawable {
            return this.mCurrDrawable;
        }
        getConstantState():Drawable.ConstantState {
            if (this.mDrawableContainerState.canConstantState()) {
                //this.mDrawableContainerState.mChangingConfigurations = this.getChangingConfigurations();
                return this.mDrawableContainerState;
            }
            return null;
        }
        mutate():Drawable {
            if (!this.mMutated && super.mutate() == this) {
                this.mDrawableContainerState.mutate();
                this.mMutated = true;
            }
            return this;
        }

        setConstantState(state:DrawableContainer.DrawableContainerState) {
            this.mDrawableContainerState = state;
        }
    }

    export module DrawableContainer{
        export class DrawableContainerState implements Drawable.ConstantState{
            mOwner:DrawableContainer;
            private mDrawableFutures:SparseArray<ConstantStateFuture>;

            mDrawables:Array<Drawable>;
            get mNumChildren():number{
                return this.mDrawables.length;
            }

            mVariablePadding=false;
            mPaddingChecked=false;
            mConstantPadding:Rect;

            mConstantSize=false;
            mComputedConstantSize=false;
            mConstantWidth=0;
            mConstantHeight=0;
            mConstantMinimumWidth=0;
            mConstantMinimumHeight=0;

            mCheckedOpacity=false;
            mOpacity=0;

            mCheckedStateful=false;
            mStateful=false;

            mCheckedConstantState=false;
            mCanConstantState=false;

            mDither = DrawableContainer.DEFAULT_DITHER;

            mMutated=false;
            mEnterFadeDuration=0;
            mExitFadeDuration=0;

            mAutoMirrored=false;

            constructor(orig:DrawableContainerState, owner:DrawableContainer){
                this.mOwner = owner;
                //mRes = res;

                if (orig != null) {
                    //mChangingConfigurations = orig.mChangingConfigurations;
                    //mChildrenChangingConfigurations = orig.mChildrenChangingConfigurations;

                    this.mCheckedConstantState = true;
                    this.mCanConstantState = true;

                    this.mVariablePadding = orig.mVariablePadding;
                    this.mConstantSize = orig.mConstantSize;
                    this.mDither = orig.mDither;
                    this.mMutated = orig.mMutated;
                    //this.mLayoutDirection = orig.mLayoutDirection;
                    this.mEnterFadeDuration = orig.mEnterFadeDuration;
                    this.mExitFadeDuration = orig.mExitFadeDuration;
                    this.mAutoMirrored = orig.mAutoMirrored;

                    // Cloning the following values may require creating futures.
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

                    // Postpone cloning children and futures until we're absolutely
                    // sure that we're done computing values for the original state.
                    const origDr = orig.mDrawables;
                    this.mDrawables = new Array<Drawable>(0);
                    //this.mNumChildren = orig.mNumChildren;

                    const origDf = orig.mDrawableFutures;
                    if (origDf != null) {
                        this.mDrawableFutures = origDf.clone();
                    } else {
                        this.mDrawableFutures = new SparseArray<ConstantStateFuture>(this.mNumChildren);
                    }

                    const N = this.mNumChildren;
                    for (let i = 0; i < N; i++) {
                        if (origDr[i] != null) {
                            this.mDrawableFutures.put(i, new ConstantStateFuture(origDr[i]));
                        }
                    }
                } else {
                    this.mDrawables = new Array<Drawable>(0);
                    //this.mNumChildren = 0;
                }
            }
            addChild(dr:Drawable):number {
                const pos = this.mNumChildren;

                //if (pos >= this.mDrawables.length) {
                //    this.growArray(pos, pos+10);
                //}

                dr.setVisible(false, true);
                dr.setCallback(this.mOwner);

                //this.mDrawables[pos] = dr;
                //this.mNumChildren++;
                this.mDrawables.push(dr);

                //this.mChildrenChangingConfigurations |= dr.getChangingConfigurations();
                this.mCheckedStateful = false;
                this.mCheckedOpacity = false;

                this.mConstantPadding = null;
                this.mPaddingChecked = false;
                this.mComputedConstantSize = false;

                return pos;
            }
            getCapacity():number {
                return this.mDrawables.length;
            }
            private createAllFutures() {
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
            getChildren():Array<Drawable> {
                // Create all futures for backwards compatibility.
                this.createAllFutures();

                return this.mDrawables;
            }
            getChild(index:number):Drawable {
                const result = this.mDrawables[index];
                if (result != null) {
                    return result;
                }

                // Prepare future drawable if necessary.
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
                // No need to call createAllFutures, since future drawables will
                // mutate when they are prepared.
                const N = this.mNumChildren;
                const drawables = this.mDrawables;
                for (let i = 0; i < N; i++) {
                    if (drawables[i] != null) {
                        drawables[i].mutate();
                    }
                }

                this.mMutated = true;
            }
            setVariablePadding(variable:boolean) {
                this.mVariablePadding = variable;
            }
            getConstantPadding():Rect {
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
                        if (r == null) r = new Rect(0, 0, 0, 0);
                        if (t.left > r.left) r.left = t.left;
                        if (t.top > r.top) r.top = t.top;
                        if (t.right > r.right) r.right = t.right;
                        if (t.bottom > r.bottom) r.bottom = t.bottom;
                    }
                }

                this.mPaddingChecked = true;
                return (this.mConstantPadding = r);
            }
            setConstantSize(constant:boolean) {
                this.mConstantSize = constant;
            }
            isConstantSize():boolean {
                return this.mConstantSize;
            }
            getConstantWidth():number {
                if (!this.mComputedConstantSize) {
                    this.computeConstantSize();
                }

                return this.mConstantWidth;
            }
            getConstantHeight():number {
                if (!this.mComputedConstantSize) {
                    this.computeConstantSize();
                }

                return this.mConstantHeight;
            }
            getConstantMinimumWidth():number {
                if (!this.mComputedConstantSize) {
                    this.computeConstantSize();
                }

                return this.mConstantMinimumWidth;
            }
            getConstantMinimumHeight():number {
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
                    if (s > this.mConstantWidth) this.mConstantWidth = s;
                    s = dr.getIntrinsicHeight();
                    if (s > this.mConstantHeight) this.mConstantHeight = s;
                    s = dr.getMinimumWidth();
                    if (s > this.mConstantMinimumWidth) this.mConstantMinimumWidth = s;
                    s = dr.getMinimumHeight();
                    if (s > this.mConstantMinimumHeight) this.mConstantMinimumHeight = s;
                }
            }
            setEnterFadeDuration(duration:number) {
                this.mEnterFadeDuration = duration;
            }
            getEnterFadeDuration():number {
                return this.mEnterFadeDuration;
            }
            setExitFadeDuration(duration:number) {
                this.mExitFadeDuration = duration;
            }
            getExitFadeDuration():number {
                return this.mExitFadeDuration;
            }
            getOpacity():number {
                if (this.mCheckedOpacity) {
                    return this.mOpacity;
                }

                this.createAllFutures();

                this.mCheckedOpacity = true;

                const N = this.mNumChildren;
                const drawables = this.mDrawables;
                let op = (N > 0) ? drawables[0].getOpacity() : PixelFormat.TRANSPARENT;
                for (let i = 1; i < N; i++) {
                    op = Drawable.resolveOpacity(op, drawables[i].getOpacity());
                }

                this.mOpacity = op;
                return op;
            }
            isStateful():boolean {
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
            canConstantState():boolean {
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

            //abstract
            newDrawable():android.graphics.drawable.Drawable {
                return undefined;
            }

        }

        class ConstantStateFuture{
            private mConstantState:Drawable.ConstantState;
            constructor(source:Drawable) {
                this.mConstantState = source.getConstantState();
            }
            get(state:DrawableContainerState):Drawable {
                const result = this.mConstantState.newDrawable();
                //result.setLayoutDirection(state.mLayoutDirection);
                result.setCallback(state.mOwner);

                if (state.mMutated) {
                    result.mutate();
                }

                return result;
            }
        }
    }
}
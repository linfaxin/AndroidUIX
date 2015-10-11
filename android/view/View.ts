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

module android.view {
    import SparseArray = android.util.SparseArray;
    import Drawable = android.graphics.drawable.Drawable;
    import StringBuilder = java.lang.StringBuilder;
    //import ViewRootImpl = android.view.ViewRootImpl;
    import ViewParent = android.view.ViewParent;
    import Handler = android.os.Handler;
    import Log = android.util.Log;
    import Rect = android.graphics.Rect;
    import CopyOnWriteArrayList = java.lang.util.concurrent.CopyOnWriteArrayList;
    import OnAttachStateChangeListener = View.OnAttachStateChangeListener;

    export class View{
        private static DBG = Log.View_DBG;
        static VIEW_LOG_TAG = "View";

        static PFLAG_WANTS_FOCUS                   = 0x00000001;
        static PFLAG_FOCUSED                       = 0x00000002;
        static PFLAG_SELECTED                      = 0x00000004;
        static PFLAG_IS_ROOT_NAMESPACE             = 0x00000008;
        static PFLAG_HAS_BOUNDS                    = 0x00000010;
        static PFLAG_DRAWN                         = 0x00000020;
        static PFLAG_DRAW_ANIMATION                = 0x00000040;
        static PFLAG_SKIP_DRAW                     = 0x00000080;
        static PFLAG_ONLY_DRAWS_BACKGROUND         = 0x00000100;
        static PFLAG_REQUEST_TRANSPARENT_REGIONS   = 0x00000200;
        static PFLAG_DRAWABLE_STATE_DIRTY          = 0x00000400;
        static PFLAG_MEASURED_DIMENSION_SET        = 0x00000800;
        static PFLAG_FORCE_LAYOUT                  = 0x00001000;
        static PFLAG_LAYOUT_REQUIRED               = 0x00002000;
        static PFLAG_PRESSED                       = 0x00004000;
        static PFLAG_DRAWING_CACHE_VALID           = 0x00008000;
        static PFLAG_ANIMATION_STARTED             = 0x00010000;
        static PFLAG_ALPHA_SET                     = 0x00040000;
        static PFLAG_SCROLL_CONTAINER              = 0x00080000;
        static PFLAG_SCROLL_CONTAINER_ADDED        = 0x00100000;
        static PFLAG_DIRTY                         = 0x00200000;
        static PFLAG_DIRTY_OPAQUE                  = 0x00400000;
        static PFLAG_DIRTY_MASK                    = 0x00600000;
        static PFLAG_OPAQUE_BACKGROUND             = 0x00800000;
        static PFLAG_OPAQUE_SCROLLBARS             = 0x01000000;
        static PFLAG_OPAQUE_MASK                   = 0x01800000;
        static PFLAG_PREPRESSED                    = 0x02000000;
        static PFLAG_CANCEL_NEXT_UP_EVENT          = 0x04000000;
        static PFLAG_AWAKEN_SCROLL_BARS_ON_ATTACH  = 0x08000000;
        static PFLAG_HOVERED                       = 0x10000000;
        static PFLAG_PIVOT_EXPLICITLY_SET          = 0x20000000;//TODO may not need
        static PFLAG_ACTIVATED                     = 0x40000000;
        static PFLAG_INVALIDATED                   = 0x80000000;

        static PFLAG3_VIEW_IS_ANIMATING_TRANSFORM = 0x1;
        static PFLAG3_VIEW_IS_ANIMATING_ALPHA = 0x2;
        static PFLAG3_IS_LAID_OUT = 0x4;
        static PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT = 0x8;
        static PFLAG3_CALLED_SUPER = 0x10;

        static OVER_SCROLL_ALWAYS = 0;
        static OVER_SCROLL_IF_CONTENT_SCROLLS = 1;
        static OVER_SCROLL_NEVER = 2;

        static MEASURED_SIZE_MASK                  = 0x00ffffff;
        static MEASURED_STATE_MASK                 = 0xff000000;
        static MEASURED_HEIGHT_STATE_SHIFT         = 16;
        static MEASURED_STATE_TOO_SMALL            = 0x01000000;

        static VISIBILITY_MASK = 0x0000000C;
        static VISIBLE         = 0x00000000;
        static INVISIBLE       = 0x00000004;
        static GONE            = 0x00000008;

        static ENABLED = 0x00000000;
        static DISABLED = 0x00000020;
        static ENABLED_MASK = 0x00000020;
        static WILL_NOT_DRAW = 0x00000080;
        static DRAW_MASK = 0x00000080;

        static LONG_CLICKABLE = 0x00200000;
        static DUPLICATE_PARENT_STATE = 0x00400000;

        mPrivateFlags = 0;
        private mPrivateFlags2 = 0;
        private mPrivateFlags3 = 0;
        private mOldWidthMeasureSpec = Number.MIN_SAFE_INTEGER;
        private mOldHeightMeasureSpec = Number.MIN_SAFE_INTEGER;
        private mMeasuredWidth = 0;
        private mMeasuredHeight = 0;
        private mBackground:Drawable;//TODO Drawable impl
        private mBackgroundSizeChanged=false;
        private mMinWidth = 0;
        private mMinHeight = 0;
        mParent:ViewParent;
        private mMeasureCache:SparseArray<number>;
        mAttachInfo:View.AttachInfo;
        mLayoutParams:ViewGroup.LayoutParams;
        mViewFlags=0;
        private mOverlay:ViewOverlay;
        private mWindowAttachCount=0;
        private mListenerInfo:View.ListenerInfo;

        mLeft = 0;
        mRight = 0;
        mTop = 0;
        mBottom = 0;

        mScrollX = 0;
        mScrollY = 0;
        mPaddingLeft = 0;
        mPaddingRight = 0;
        mPaddingTop = 0;
        mPaddingBottom = 0;

        getWidth():number {
            return this.mRight - this.mLeft;
        }
        getHeight():number {
            return this.mBottom - this.mTop;
        }
        getTop():number {
            return this.mTop;
        }
        setTop(top:number){
            if (top != this.mTop) {
                if (this.mAttachInfo != null) {
                    let minTop;
                    let yLoc;
                    if (top < this.mTop) {
                        minTop = top;
                        yLoc = top - this.mTop;
                    } else {
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
        getBottom():number {
            return this.mBottom;
        }
        setBottom(bottom:number){
            if (bottom != this.mBottom) {
                if (this.mAttachInfo != null) {
                    let maxBottom;
                    if (bottom < this.mBottom) {
                        maxBottom = this.mBottom;
                    } else {
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
        getLeft():number {
            return this.mLeft;
        }
        setLeft(left:number){
            if (left != this.mLeft) {
                if (this.mAttachInfo != null) {
                    let minLeft;
                    let xLoc;
                    if (left < this.mLeft) {
                        minLeft = left;
                        xLoc = left - this.mLeft;
                    } else {
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
        getRight():number {
            return this.mRight;
        }
        setRight(right:number){
            if (right != this.mRight) {
                if (this.mAttachInfo != null) {
                    let maxRight;
                    if (right < this.mRight) {
                        maxRight = this.mRight;
                    } else {
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


        getHandler():Handler {
            let attachInfo = this.mAttachInfo;
            if (attachInfo != null) {
                return attachInfo.mHandler;
            }
            return null;
        }
        getViewRootImpl():ViewRootImpl{
            if (this.mAttachInfo != null) {
                return this.mAttachInfo.mViewRootImpl;
            }
            return null;
        }
        getParent():ViewParent {
            return this.mParent;
        }
        setFlags(flags:number , mask:number){
            //TODO
        }
        bringToFront() {
            if (this.mParent != null) {
                this.mParent.bringChildToFront(this);
            }
        }
        onScrollChanged(l:number, t:number, oldl:number, oldt:number) {
            this.mBackgroundSizeChanged = true;

            let ai = this.mAttachInfo;
            if (ai != null) {
                ai.mViewScrollChanged = true;
            }
        }
        onSizeChanged(w:number, h:number, oldw:number, oldh:number) {

        }


        getVisibility():number {
            return this.mViewFlags & View.VISIBILITY_MASK;
        }
        setVisibility(visibility:number) {
            this.setFlags(visibility, View.VISIBILITY_MASK);
            if (this.mBackground != null) this.mBackground.setVisible(visibility == View.VISIBLE, false);
        }
        isEnabled():boolean {
            return (this.mViewFlags & View.ENABLED_MASK) == View.ENABLED;
        }
        setEnabled(enabled:boolean) {
        if (enabled == this.isEnabled()) return;

        this.setFlags(enabled ? View.ENABLED : View.DISABLED, View.ENABLED_MASK);

        /*
         * The View most likely has to change its appearance, so refresh
         * the drawable state.
         */
        this.refreshDrawableState();

        // Invalidate too, since the default behavior for views is to be
        // be drawn at 50% alpha rather than to change the drawable.
        this.invalidate(true);

        //if (!enabled) {
        //    cancelPendingInputEvents();
        //}
}

        isLayoutRequested():boolean {
            return (this.mPrivateFlags & View.PFLAG_FORCE_LAYOUT) == View.PFLAG_FORCE_LAYOUT;
        }

        getLayoutParams():ViewGroup.LayoutParams {
            return this.mLayoutParams;
        }
        setLayoutParams(params:ViewGroup.LayoutParams) {
            if (params == null) {
                throw new Error("Layout parameters cannot be null");
            }
            this.mLayoutParams = params;
            //resolveLayoutParams();
            let p = this.mParent;
            if (p instanceof ViewGroup) {
                p.onSetLayoutParams(this, params);
            }
            this.requestLayout();
        }

        requestLayout() {
            if (this.mMeasureCache != null) this.mMeasureCache.clear();

            if (this.mAttachInfo != null && this.mAttachInfo.mViewRequestingLayout == null) {
                // Only trigger request-during-layout logic if this is the view requesting it,
                // not the views in its parent hierarchy
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
            if (this.mMeasureCache != null) this.mMeasureCache.clear();

            this.mPrivateFlags |= View.PFLAG_FORCE_LAYOUT;
            this.mPrivateFlags |= View.PFLAG_INVALIDATED;
        }

        layout(l:number, t:number, r:number, b:number) {
            if ((this.mPrivateFlags3 & View.PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT) != 0) {
                this.onMeasure(this.mOldWidthMeasureSpec, this.mOldHeightMeasureSpec);
                this.mPrivateFlags3 &= ~View.PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT;
            }

            let oldL = this.mLeft;
            let oldT = this.mTop;
            let oldB = this.mBottom;
            let oldR = this.mRight;

            let changed = this.setFrame(l, t, r, b);

            if(changed) this.syncBoundToElement();//TODO setLeft/Right/.. not sync

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
        onLayout(changed:boolean, left:number, top:number, right:number, bottom:number) {
        }

        private setFrame(left:number, top:number, right:number, bottom:number) {
            let changed = false;

            if (View.DBG) {
                Log.i("View", this + " View.setFrame(" + left + "," + top + ","
                    + right + "," + bottom + ")");
            }

            if (this.mLeft != left || this.mRight != right || this.mTop != top || this.mBottom != bottom) {
                changed = true;

                // Remember our drawn bit
                let drawn = this.mPrivateFlags & View.PFLAG_DRAWN;

                let oldWidth = this.mRight - this.mLeft;
                let oldHeight = this.mBottom - this.mTop;
                let newWidth = right - left;
                let newHeight = bottom - top;
                let sizeChanged = (newWidth != oldWidth) || (newHeight != oldHeight);

                // Invalidate our old position
                this.invalidate(sizeChanged);

                this.mLeft = left;
                this.mTop = top;
                this.mRight = right;
                this.mBottom = bottom;

                this.mPrivateFlags |= View.PFLAG_HAS_BOUNDS;


                if (sizeChanged) {
                    if ((this.mPrivateFlags & View.PFLAG_PIVOT_EXPLICITLY_SET) == 0) {
                        // A change in dimension means an auto-centered pivot point changes, too
                        //if (mTransformationInfo != null) {
                        //    mTransformationInfo.mMatrixDirty = true;
                        //}
                    }
                    this.sizeChange(newWidth, newHeight, oldWidth, oldHeight);
                }

                if ((this.mViewFlags & View.VISIBILITY_MASK) == View.VISIBLE) {
                    // If we are visible, force the DRAWN bit to on so that
                    // this invalidate will go through (at least to our parent).
                    // This is because someone may have invalidated this view
                    // before this call to setFrame came in, thereby clearing
                    // the DRAWN bit.
                    this.mPrivateFlags |= View.PFLAG_DRAWN;
                    this.invalidate(sizeChanged);
                    // parent display list may need to be recreated based on a change in the bounds
                    // of any child
                    //this.invalidateParentCaches();
                }

            // Reset drawn bit to original value (invalidate turns it off)
            this.mPrivateFlags |= drawn;

            this.mBackgroundSizeChanged = true;

            }
            return changed;
        }

        private sizeChange(newWidth:number, newHeight:number, oldWidth:number, oldHeight:number):void {
            this.onSizeChanged(newWidth, newHeight, oldWidth, oldHeight);
            if (this.mOverlay != null) {
                this.mOverlay.getOverlayView().setRight(newWidth);
                this.mOverlay.getOverlayView().setBottom(newHeight);
            }
        }

        getMeasuredWidth():number {
            return this.mMeasuredWidth & View.MEASURED_SIZE_MASK;
        }
        getMeasuredWidthAndState() {
            return this.mMeasuredWidth;
        }
        getMeasuredHeight():number {
            return this.mMeasuredHeight & View.MEASURED_SIZE_MASK;
        }
        getMeasuredHeightAndState():number {
            return this.mMeasuredHeight;
        }
        getMeasuredState():number {
            return (this.mMeasuredWidth&View.MEASURED_STATE_MASK)
                | ((this.mMeasuredHeight>>View.MEASURED_HEIGHT_STATE_SHIFT)
                & (View.MEASURED_STATE_MASK>>View.MEASURED_HEIGHT_STATE_SHIFT));
        }
        measure(widthMeasureSpec:number, heightMeasureSpec:number) {

            // Suppress sign extension for the low bytes
            let key = widthMeasureSpec << 32 | heightMeasureSpec & 0xffffffff;
            if (this.mMeasureCache == null) this.mMeasureCache = new SparseArray<number>();

            if ((this.mPrivateFlags & View.PFLAG_FORCE_LAYOUT) == View.PFLAG_FORCE_LAYOUT ||
                widthMeasureSpec != this.mOldWidthMeasureSpec ||
                heightMeasureSpec != this.mOldHeightMeasureSpec) {

                // first clears the measured dimension flag
                this.mPrivateFlags &= ~View.PFLAG_MEASURED_DIMENSION_SET;

                //resolveRtlPropertiesIfNeeded();

                let cacheIndex = (this.mPrivateFlags & View.PFLAG_FORCE_LAYOUT) == View.PFLAG_FORCE_LAYOUT ? -1 :
                    this.mMeasureCache.indexOfKey(key);
                if (cacheIndex < 0) {
                    // measure ourselves, this should set the measured dimension flag back
                    this.onMeasure(widthMeasureSpec, heightMeasureSpec);
                    this.mPrivateFlags3 &= ~View.PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT;
                } else {
                    let value = this.mMeasureCache.valueAt(cacheIndex);
                    // Casting a long to int drops the high 32 bits, no mask needed
                    this.setMeasuredDimension(value >> 32, value);
                    this.mPrivateFlags3 |= View.PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT;
                }

                // flag not set, setMeasuredDimension() was not invoked, we raise
                // an exception to warn the developer
                if ((this.mPrivateFlags & View.PFLAG_MEASURED_DIMENSION_SET) != View.PFLAG_MEASURED_DIMENSION_SET) {
                    throw new Error("onMeasure() did not set the"
                        + " measured dimension by calling"
                        + " setMeasuredDimension()");
                }

                this.mPrivateFlags |= View.PFLAG_LAYOUT_REQUIRED;
            }

            this.mOldWidthMeasureSpec = widthMeasureSpec;
            this.mOldHeightMeasureSpec = heightMeasureSpec;

            this.mMeasureCache.put(key, (this.mMeasuredWidth) << 32 | this.mMeasuredHeight & 0xffffffff); // suppress sign extension
        }

        onMeasure(widthMeasureSpec, heightMeasureSpec) {
            this.setMeasuredDimension(View.getDefaultSize(this.getSuggestedMinimumWidth(), widthMeasureSpec),
                View.getDefaultSize(this.getSuggestedMinimumHeight(), heightMeasureSpec));
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
                    } else {
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

        invalidate();
        invalidate(invalidateCache:boolean);
        invalidate(dirty:Rect);
        invalidate(l:number, t:number, r:number, b:number);
        invalidate(...args){
            //TODO impl when draw impl
        }

        jumpDrawablesToCurrentState() {
            if (this.mBackground != null) {
                this.mBackground.jumpToCurrentState();
            }
        }

        verifyDrawable(who:Drawable):boolean {
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
            //drawableStateChanged();//TODO when impl drawable
            //
            //ViewParent parent = mParent;
            //if (parent != null) {
            //    parent.childDrawableStateChanged(this);
            //}
        }
        getDrawableState():Array<number> {
            return [];
            //TODO when impl drawable
            //if ((this.mDrawableState != null) && ((this.mPrivateFlags & View.PFLAG_DRAWABLE_STATE_DIRTY) == 0)) {
            //    return this.mDrawableState;
            //} else {
            //    this.mDrawableState = this.onCreateDrawableState(0);
            //    this.mPrivateFlags &= ~View.PFLAG_DRAWABLE_STATE_DIRTY;
            //    return this.mDrawableState;
            //}
        }
        /*
         * Caller is responsible for calling requestLayout if necessary.
         * (This allows addViewInLayout to not request a new layout.)
         */
        assignParent(parent:ViewParent) {
            if (this.mParent == null) {
                this.mParent = parent;
            } else if (parent == null) {
                this.mParent = null;
            } else {
                throw new Error("view " + this + " being added, but"
                    + " it already has a parent");
            }
        }

        onFinishInflate() {
        }

        dispatchAttachedToWindow(info: View.AttachInfo, visibility:number) {
            //System.out.println("Attached! " + this);
            this.mAttachInfo = info;
            if (this.mOverlay != null) {
                this.mOverlay.getOverlayView().dispatchAttachedToWindow(info, visibility);
            }
            this.mWindowAttachCount++;
            // We will need to evaluate the drawable state at least once.
            this.mPrivateFlags |= View.PFLAG_DRAWABLE_STATE_DIRTY;
            //if (mFloatingTreeObserver != null) {//TODO when TreeObserver ok
            //    info.mTreeObserver.merge(mFloatingTreeObserver);
            //    mFloatingTreeObserver = null;
            //}
            if ((this.mPrivateFlags&View.PFLAG_SCROLL_CONTAINER) != 0) {
                this.mAttachInfo.mScrollContainers.add(this);
                this.mPrivateFlags |= View.PFLAG_SCROLL_CONTAINER_ADDED;
            }
            //performCollectViewAttributes(mAttachInfo, visibility);
            this.onAttachedToWindow();

            let li = this.mListenerInfo;
            let listeners = li != null ? li.mOnAttachStateChangeListeners : null;
            if (listeners != null && listeners.size() > 0) {
                // NOTE: because of the use of CopyOnWriteArrayList, we *must* use an iterator to
                // perform the dispatching. The iterator is a safe guard against listeners that
                // could mutate the list by calling the various add/remove methods. This prevents
                // the array from being modified while we iterate it.
                for (let listener of listeners) {
                    listener.onViewAttachedToWindow(this);
                }
            }

            if ((this.mPrivateFlags&View.PFLAG_DRAWABLE_STATE_DIRTY) != 0) {
                // If nobody has evaluated the drawable state yet, then do it now.
                this.refreshDrawableState();
            }
            //needGlobalAttributesUpdate(false);
        }
        onAttachedToWindow() {
            //if ((this.mPrivateFlags & View.PFLAG_REQUEST_TRANSPARENT_REGIONS) != 0) {
            //    this.mParent.requestTransparentRegion(this);
            //}

            //if ((this.mPrivateFlags & View.PFLAG_AWAKEN_SCROLL_BARS_ON_ATTACH) != 0) {//TODO when scrollBar ok
            //    this.initialAwakenScrollBars();
            //    this.mPrivateFlags &= ~View.PFLAG_AWAKEN_SCROLL_BARS_ON_ATTACH;
            //}

            this.mPrivateFlags3 &= ~View.PFLAG3_IS_LAID_OUT;

            this.jumpDrawablesToCurrentState();
        }

        dispatchDetachedFromWindow() {
            this.onDetachedFromWindow();

            let li = this.mListenerInfo;
            let listeners = li != null ? li.mOnAttachStateChangeListeners : null;
            if (listeners != null && listeners.size() > 0) {
                // NOTE: because of the use of CopyOnWriteArrayList, we *must* use an iterator to
                // perform the dispatching. The iterator is a safe guard against listeners that
                // could mutate the list by calling the various add/remove methods. This prevents
                // the array from being modified while we iterate it.
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

            //this.removeUnsetPressCallback();//TODO when impl
            //this.removeLongPressCallback();
            //this.removePerformClickCallback();
            //
            //this.destroyDrawingCache();
            //this.destroyLayer(false);
            //
            //this.cleanupDraw();
            //
            //this.mCurrentAnimation = null;
        }

        debug(depth=0){
            //custom impl
            let originProto = Object.getPrototypeOf(this);
            console.dir(Object.assign(Object.create(originProto), this));
        }


        toString():String{
            return this.tagName();
        }

        bindElement: HTMLElement = document.createElement(this.tagName());//bind Element show the layout and other info
        bindView = (this.bindElement['bindView']=this);
        syncBoundToElement(){
            let bind = this.bindElement;
            bind.style.position = 'absolute';
            bind.style.boxSizing = 'border-box';
            bind.style.left = this.mLeft + 'px';
            bind.style.top = this.mTop + 'px';
            bind.style.width = this.getWidth() + 'px';
            bind.style.height = this.getHeight() + 'px';
        }
        tagName() : string{
            return "ANDROID-"+this.constructor.name;
        }

        findViewById(id:string):View{
            let bindEle = this.bindElement.querySelector('#'+id);
            return bindEle ? bindEle['bindView'] : null;
        }

        static inflate(xml:HTMLElement):View{
            let className = xml.tagName.toUpperCase();
            if(className.startsWith('ANDROID-')){
                className = className.substring('ANDROID-'.length);
            }
            let rootView:View;
            for(let key in android['view']){
                if(key.toUpperCase()==className){
                    rootView = new android.view[key]();
                    break;
                }
            }
            if(!rootView){
                for(let key in android['widget']){
                    if(key.toUpperCase()==className){
                        rootView = new android['widget'][key]();
                        break;
                    }
                }
            }
            if(!rootView){
                //full class name view
                try {
                    rootView = (<any>window).eval(className);
                } catch (e) {
                }
            }
            if(!rootView) return null;

            if(rootView instanceof ViewGroup){
                Array.from(xml.children).forEach((item)=>{
                    if(item instanceof HTMLElement){
                        rootView.addView(View.inflate(item));
                    }
                });
            }
            Array.from(xml.attributes).forEach((attr)=>{
                rootView.bindElement.setAttribute(attr.name, attr.value);
            });

            return rootView;
        }
    }

    export module View{
        export class MeasureSpec {
            static MODE_SHIFT = 30;
            static MODE_MASK = 0x3 << MeasureSpec.MODE_SHIFT;
            static UNSPECIFIED = 0 << MeasureSpec.MODE_SHIFT;
            static EXACTLY = 1 << MeasureSpec.MODE_SHIFT;
            static AT_MOST = 2 << MeasureSpec.MODE_SHIFT;

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
                return MeasureSpec.makeMeasureSpec(
                    MeasureSpec.getSize(measureSpec + delta), MeasureSpec.getMode(measureSpec));
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
        export class AttachInfo {
            mRootView:View;
            mDrawingTime=0;
            mCanvas : CanvasRenderingContext2D;
            mViewRootImpl : ViewRootImpl;
            mHandler : Handler;
            mTmpInvalRect = new Rect();
            mTmpTransformRect = new Rect();
            mScrollContainers = new Set<View>();
            mViewScrollChanged = false;
            mTreeObserver = new ViewTreeObserver();
            mViewRequestingLayout:View;

            constructor(mViewRootImpl:ViewRootImpl, mHandler:Handler) {
                this.mViewRootImpl = mViewRootImpl;
                this.mHandler = mHandler;
            }
        }

        export class ListenerInfo{
            mOnAttachStateChangeListeners:CopyOnWriteArrayList<OnAttachStateChangeListener>;
            mOnLayoutChangeListeners:Array<OnLayoutChangeListener>;
        }

        export interface OnAttachStateChangeListener{
            onViewAttachedToWindow(v:View);
            onViewDetachedFromWindow(v:View);
        }
        export interface OnLayoutChangeListener{
            onLayoutChange(v:View, left:number , top:number , right:number , bottom:number,
                           oldLeft:number , oldTop:number , oldRight:number , oldBottom:number);
        }
        export interface OnClickListener{
            onClick(v:View);
        }
        export interface OnLongClickListener{
            onLongClick(v:View):boolean;
        }
        export interface OnTouchListener{
            onTouch(v:View, event:MotionEvent);
        }
    }

}
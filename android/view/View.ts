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

module android.view {
    import SparseArray = android.util.SparseArray;
    import Drawable = android.graphics.drawable.Drawable;
    import PixelFormat = android.graphics.PixelFormat;
    import Matrix = android.graphics.Matrix;
    import StringBuilder = java.lang.StringBuilder;
    import Runnable = java.lang.Runnable;
    //import ViewRootImpl = android.view.ViewRootImpl;
    import ViewParent = android.view.ViewParent;
    import SystemClock = android.os.SystemClock;
    import Handler = android.os.Handler;
    import Log = android.util.Log;
    import Rect = android.graphics.Rect;
    import Canvas = android.graphics.Canvas;
    import CopyOnWriteArrayList = java.lang.util.concurrent.CopyOnWriteArrayList;
    import OnAttachStateChangeListener = View.OnAttachStateChangeListener;
    import Resources = android.content.res.Resources;
    import Pools = android.util.Pools;


    export class View implements Drawable.Callback{
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

        static PFLAG2_VIEW_QUICK_REJECTED = 0x10000000;

        static PFLAG3_VIEW_IS_ANIMATING_TRANSFORM = 0x1;
        static PFLAG3_VIEW_IS_ANIMATING_ALPHA = 0x2;
        static PFLAG3_IS_LAID_OUT = 0x4;
        static PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT = 0x8;
        static PFLAG3_CALLED_SUPER = 0x10;

        private static NOT_FOCUSABLE = 0x00000000;
        private static FOCUSABLE = 0x00000001;
        private static FOCUSABLE_MASK = 0x00000001;



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

        static FOCUSABLES_ALL = 0x00000000;
        static FOCUSABLES_TOUCH_MODE = 0x00000001;
        static FOCUS_BACKWARD = 0x00000001;
        static FOCUS_FORWARD = 0x00000002;
        static FOCUS_LEFT = 0x00000011;
        static FOCUS_UP = 0x00000021;
        static FOCUS_RIGHT = 0x00000042;
        static FOCUS_DOWN = 0x00000082;

        static CLICKABLE = 0x00004000;
        static DRAWING_CACHE_ENABLED = 0x00008000;
        static WILL_NOT_CACHE_DRAWING = 0x000020000;
        private static FOCUSABLE_IN_TOUCH_MODE = 0x00040000;
        static LONG_CLICKABLE = 0x00200000;
        static DUPLICATE_PARENT_STATE = 0x00400000;

        static LAYER_TYPE_NONE = 0;
        static LAYER_TYPE_SOFTWARE = 1;

        mPrivateFlags = 0;
        private mPrivateFlags2 = 0;
        private mPrivateFlags3 = 0;
        private mOldWidthMeasureSpec = Number.MIN_SAFE_INTEGER;
        private mOldHeightMeasureSpec = Number.MIN_SAFE_INTEGER;
        private mMeasuredWidth = 0;
        private mMeasuredHeight = 0;
        private mBackground:Drawable;//TODO Drawable impl
        private mBackgroundSizeChanged=false;

        private mPendingCheckForLongPress:CheckForLongPress;
        private mPendingCheckForTap:CheckForTap;
        private mPerformClick:PerformClick;
        private mUnsetPressedState:UnsetPressedState;
        private mHasPerformedLongPress = false;
        private mMinWidth = 0;
        private mMinHeight = 0;
        private mTouchDelegate : TouchDelegate;
        mTouchSlop = 0;
        private mVerticalScrollFactor = 0;
        private mOverScrollMode = 0;
        mParent:ViewParent;
        private mMeasureCache:SparseArray<number>;
        mAttachInfo:View.AttachInfo;
        mLayoutParams:ViewGroup.LayoutParams;
        mViewFlags=0;

        mLayerType = View.LAYER_TYPE_NONE;

        private mOverlay:ViewOverlay;
        private mWindowAttachCount=0;
        private mListenerInfo:View.ListenerInfo;

        private mClipBounds:Rect;
        private mLastIsOpaque = false;

        mLeft = 0;
        mRight = 0;
        mTop = 0;
        mBottom = 0;

        private _mScrollX = 0;
        private _mScrollY = 0;

        public get mScrollX():number {
            return this._mScrollX;
        }
        public set mScrollX(value:number) {
            this._mScrollX = value;
            Array.from(this.bindElement.children).forEach((item:HTMLElement)=>{
                if(value!=0) item.style.marginLeft = -value+'px';
                else item.style.marginLeft = "";
            });
        }
        public get mScrollY():number {
            return this._mScrollY;
        }
        public set mScrollY(value:number) {
            this._mScrollY = value;
            Array.from(this.bindElement.children).forEach((item:HTMLElement)=>{
                if(value!=0) item.style.marginTop = -value+'px';
                else item.style.marginTop = "";
            });
        }

        mPaddingLeft = 0;
        mPaddingRight = 0;
        mPaddingTop = 0;
        mPaddingBottom = 0;

        constructor(){
            this.mTouchSlop = ViewConfiguration.get().getScaledTouchSlop();
        }

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
        setScrollX(value:number) {
            this.scrollTo(value, this.mScrollY);
        }
        setScrollY(value:number) {
            this.scrollTo(this.mScrollX, value);
        }
        getScrollX():number {
            return this.mScrollX;
        }
        getScrollY():number {
            return this.mScrollY;
        }
        getFinalAlpha():number {
            return 1;//TODO alpha
        }

        getMatrix():Matrix {
            //if (mTransformationInfo != null) {
            //    updateMatrix();
            //    return mTransformationInfo.mMatrix;
            //}
            return Matrix.IDENTITY_MATRIX;
        }
        hasIdentityMatrix(){
            //TODO transform
            //if (mTransformationInfo != null) {
            //    updateMatrix();
            //    return mTransformationInfo.mMatrixIsIdentity;
            //}
            return true;
        }
        transformRect(rect:Rect){
            if (!this.getMatrix().isIdentity()) {
                let boundingRect = this.mAttachInfo.mTmpTransformRect;
                boundingRect.set(rect);
                this.getMatrix().mapRect(boundingRect);
                rect.set(boundingRect);
            }
        }

        pointInView(localX:number, localY:number, slop=0):boolean {
            return localX >= -slop && localY >= -slop && localX < ((this.mRight - this.mLeft) + slop) &&
            localY < ((this.mBottom - this.mTop) + slop);
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
        post(action:Runnable):boolean {
            let attachInfo = this.mAttachInfo;
            if (attachInfo != null) {
                return attachInfo.mHandler.post(action);
            }
            // Assume that post will succeed later
            ViewRootImpl.getRunQueue().post(action);
            return true;
        }
        postDelayed(action:Runnable, delayMillis:number):boolean {
            let attachInfo = this.mAttachInfo;
            if (attachInfo != null) {
                return attachInfo.mHandler.postDelayed(action, delayMillis);
            }
            // Assume that post will succeed later
            ViewRootImpl.getRunQueue().postDelayed(action, delayMillis);
            return true;
        }
        postOnAnimation(action:Runnable):boolean {
            return this.post(action);
        }
        postOnAnimationDelayed(action:Runnable, delayMillis:number):boolean {
            return this.postDelayed(action, delayMillis);
        }
        removeCallbacks(action:Runnable):boolean {
            if (action != null) {
                let attachInfo = this.mAttachInfo;
                if (attachInfo != null) {
                    attachInfo.mHandler.removeCallbacks(action);
                } else {
                    // Assume that post will succeed later
                    ViewRootImpl.getRunQueue().removeCallbacks(action);
                }
            }
            return true;
        }
        getParent():ViewParent {
            return this.mParent;
        }
        setFlags(flags:number , mask:number){
            let old = this.mViewFlags;
            this.mViewFlags = (this.mViewFlags & ~mask) | (flags & mask);

            let changed = this.mViewFlags ^ old;
            if (changed == 0) {
                return;
            }
            let privateFlags = this.mPrivateFlags;

            /* TODO Check if the FOCUSABLE bit has changed */
            //if (((changed & FOCUSABLE_MASK) != 0) &&
            //    ((privateFlags & PFLAG_HAS_BOUNDS) !=0)) {
            //    if (((old & FOCUSABLE_MASK) == FOCUSABLE)
            //        && ((privateFlags & PFLAG_FOCUSED) != 0)) {
            //        /* Give up focus if we are no longer focusable */
            //        clearFocus();
            //    } else if (((old & FOCUSABLE_MASK) == NOT_FOCUSABLE)
            //        && ((privateFlags & PFLAG_FOCUSED) == 0)) {
            //        /*
            //         * Tell the view system that we are now available to take focus
            //         * if no one else already has it.
            //         */
            //        if (mParent != null) mParent.focusableViewAvailable(this);
            //    }
            //}

            const newVisibility = flags & View.VISIBILITY_MASK;
            if (newVisibility == View.VISIBLE) {
                if ((changed & View.VISIBILITY_MASK) != 0) {
                    /*
                     * If this view is becoming visible, invalidate it in case it changed while
                     * it was not visible. Marking it drawn ensures that the invalidation will
                     * go through.
                     */
                    this.mPrivateFlags |= View.PFLAG_DRAWN;
                    this.invalidate(true);

                    //needGlobalAttributesUpdate(true);

                    // a view becoming visible is worth notifying the parent
                    // about in case nothing has focus.  even if this specific view
                    // isn't focusable, it may contain something that is, so let
                    // the root view try to give this focus if nothing else does.
                    if ((this.mParent != null) && (this.mBottom > this.mTop) && (this.mRight > this.mLeft)) {
                        this.mParent.focusableViewAvailable(this);
                    }
                }
            }

            /* Check if the GONE bit has changed */
            if ((changed & View.GONE) != 0) {
                //needGlobalAttributesUpdate(false);
                this.requestLayout();

                if (((this.mViewFlags & View.VISIBILITY_MASK) == View.GONE)) {
                    if (this.hasFocus()) this.clearFocus();
                    this.destroyDrawingCache();
                    if (this.mParent instanceof View) {
                        // GONE views noop invalidation, so invalidate the parent
                        (<any> this.mParent).invalidate(true);
                    }
                    // Mark the view drawn to ensure that it gets invalidated properly the next
                    // time it is visible and gets invalidated
                    this.mPrivateFlags |= View.PFLAG_DRAWN;
                }
                if (this.mAttachInfo != null) {
                    this.mAttachInfo.mViewVisibilityChanged = true;
                }
            }


            /* Check if the VISIBLE bit has changed */
            if ((changed & View.INVISIBLE) != 0) {
                //needGlobalAttributesUpdate(false);
                /*
                 * If this view is becoming invisible, set the DRAWN flag so that
                 * the next invalidate() will not be skipped.
                 */
                this.mPrivateFlags |= View.PFLAG_DRAWN;

                if (((this.mViewFlags & View.VISIBILITY_MASK) == View.INVISIBLE)) {
                    // root view becoming invisible shouldn't clear focus and accessibility focus
                    if (this.getRootView() != this) {
                        if (this.hasFocus()) this.clearFocus();
                    }
                }
                if (this.mAttachInfo != null) {
                    this.mAttachInfo.mViewVisibilityChanged = true;
                }
            }
            if ((changed & View.VISIBILITY_MASK) != 0) {
                // If the view is invisible, cleanup its display list to free up resources
                if (newVisibility != View.VISIBLE) {
                    this.cleanupDraw();
                }

                if (this.mParent instanceof ViewGroup) {
                    (<any>this.mParent).onChildVisibilityChanged(this,
                        (changed & View.VISIBILITY_MASK), newVisibility);
                    (<any>this.mParent).invalidate(true);
                } else if (this.mParent != null) {
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

            //if ((changed & DRAWING_CACHE_QUALITY_MASK) != 0) {
            //    destroyDrawingCache();
            //    mPrivateFlags &= ~PFLAG_DRAWING_CACHE_VALID;
            //}


            if ((changed & View.DRAW_MASK) != 0) {
                if ((this.mViewFlags & View.WILL_NOT_DRAW) != 0) {
                    if (this.mBackground != null) {
                        this.mPrivateFlags &= ~View.PFLAG_SKIP_DRAW;
                        this.mPrivateFlags |= View.PFLAG_ONLY_DRAWS_BACKGROUND;
                    } else {
                        this.mPrivateFlags |= View.PFLAG_SKIP_DRAW;
                    }
                } else {
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
        onScrollChanged(l:number, t:number, oldl:number, oldt:number) {
            this.mBackgroundSizeChanged = true;

            let ai = this.mAttachInfo;
            if (ai != null) {
                ai.mViewScrollChanged = true;
            }
        }
        onSizeChanged(w:number, h:number, oldw:number, oldh:number):void {

        }
        getListenerInfo() {
            if (this.mListenerInfo != null) {
                return this.mListenerInfo;
            }
            this.mListenerInfo = new View.ListenerInfo();
            return this.mListenerInfo;
        }
        isFocusable():boolean {
            return View.FOCUSABLE == (this.mViewFlags & View.FOCUSABLE_MASK);
        }
        isFocusableInTouchMode():boolean {
            return View.FOCUSABLE_IN_TOUCH_MODE == (this.mViewFlags & View.FOCUSABLE_IN_TOUCH_MODE);
        }
        hasFocus():boolean{
            return (this.mPrivateFlags & View.PFLAG_FOCUSED) != 0;
        }
        hasFocusable():boolean {
            return (this.mViewFlags & View.VISIBILITY_MASK) == View.VISIBLE && this.isFocusable();
        }
        clearFocus() {
            //TODO impl focus
        }
        findFocus():View {
            return (this.mPrivateFlags & View.PFLAG_FOCUSED) != 0 ? this : null;
        }
        isFocused():boolean {
            return (this.mPrivateFlags & View.PFLAG_FOCUSED) != 0;
        }

        getVisibility():number {
            return this.mViewFlags & View.VISIBILITY_MASK;
        }
        setVisibility(visibility:number) {
            this.setFlags(visibility, View.VISIBILITY_MASK);
            if (this.mBackground != null) this.mBackground.setVisible(visibility == View.VISIBLE, false);
        }
        dispatchVisibilityChanged(changedView:View, visibility:number) {
            this.onVisibilityChanged(changedView, visibility);
        }
        onVisibilityChanged(changedView:View, visibility:number) {
            if (visibility == View.VISIBLE) {
                if (this.mAttachInfo != null) {
                    //this.initialAwakenScrollBars();
                } else {
                    this.mPrivateFlags |= View.PFLAG_AWAKEN_SCROLL_BARS_ON_ATTACH;
                }
            }
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

        dispatchTouchEvent(event:MotionEvent):boolean {
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
        onFilterTouchEventForSecurity(event:MotionEvent):boolean {
            return true;
        }

        onTouchEvent(event:MotionEvent):boolean {
            let viewFlags = this.mViewFlags;

            if ((viewFlags & View.ENABLED_MASK) == View.DISABLED) {
                if (event.getAction() == MotionEvent.ACTION_UP && (this.mPrivateFlags & View.PFLAG_PRESSED) != 0) {
                    this.setPressed(false);
                }
                // A disabled view that is clickable still consumes the touch
                // events, it just doesn't respond to them.
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
                    case MotionEvent.ACTION_UP:
                        let prepressed = (this.mPrivateFlags & View.PFLAG_PREPRESSED) != 0;
                        if ((this.mPrivateFlags & View.PFLAG_PRESSED) != 0 || prepressed) {
                            // take focus if we don't have it already and we should in
                            // touch mode.
                            let focusTaken = false;
                            //if (isFocusable() && isFocusableInTouchMode() && !isFocused()) {//TODO when focus ok
                            //    focusTaken = requestFocus();
                            //}

                            if (prepressed) {
                                // The button is being released before we actually
                                // showed it as pressed.  Make it show the pressed
                                // state now (before scheduling the click) to ensure
                                // the user sees it.
                                this.setPressed(true);
                            }

                            if (!this.mHasPerformedLongPress) {
                                // This is a tap, so remove the longpress check
                                this.removeLongPressCallback();

                                // Only perform take click actions if we were in the pressed state
                                if (!focusTaken) {
                                    // Use a Runnable and post this rather than calling
                                    // performClick directly. This lets other visual state
                                    // of the view update before click actions start.
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
                                this.postDelayed(this.mUnsetPressedState,
                                    ViewConfiguration.getPressedStateDuration());
                            } else if (!this.post(this.mUnsetPressedState)) {
                                // If the post failed, unpress right now
                                this.mUnsetPressedState.run();
                            }
                            this.removeTapCallback();
                        }
                        break;

                    case MotionEvent.ACTION_DOWN:
                        this.mHasPerformedLongPress = false;


                        // Walk up the hierarchy to determine if we're inside a scrolling container.
                        let isInScrollingContainer = this.isInScrollingContainer();

                        // For views inside a scrolling container, delay the pressed feedback for
                        // a short period in case this is a scroll.
                        if (isInScrollingContainer) {
                            this.mPrivateFlags |= View.PFLAG_PREPRESSED;
                            if (this.mPendingCheckForTap == null) {
                                this.mPendingCheckForTap = new CheckForTap(this);
                            }
                            this.postDelayed(this.mPendingCheckForTap, ViewConfiguration.getTapTimeout());
                        } else {
                            // Not inside a scrolling container, so show the feedback right away
                            this.setPressed(true);
                            this.checkForLongClick(0);
                        }
                        break;

                    case MotionEvent.ACTION_CANCEL:
                        this.setPressed(false);
                        this.removeTapCallback();
                        this.removeLongPressCallback();
                        break;

                    case MotionEvent.ACTION_MOVE:
                        const x = event.getX();
                        const y = event.getY();

                        // Be lenient about moving outside of buttons
                        if (!this.pointInView(x, y, this.mTouchSlop)) {
                            // Outside button
                            this.removeTapCallback();
                            if ((this.mPrivateFlags & View.PFLAG_PRESSED) != 0) {
                                // Remove any future long press/tap checks
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
        isInScrollingContainer():boolean {
            let p = this.getParent();
            while (p != null && p instanceof ViewGroup) {
                if ((<ViewGroup> p).shouldDelayChildPressedState()) {
                    return true;
                }
                p = p.getParent();
            }
            return false;
        }
        private removeLongPressCallback() {
            if (this.mPendingCheckForLongPress != null) {
                this.removeCallbacks(this.mPendingCheckForLongPress);
            }
        }
        private removePerformClickCallback() {
            if (this.mPerformClick != null) {
                this.removeCallbacks(this.mPerformClick);
            }
        }
        private removeUnsetPressCallback() {
            if ((this.mPrivateFlags & View.PFLAG_PRESSED) != 0 && this.mUnsetPressedState != null) {
                this.setPressed(false);
                this.removeCallbacks(this.mUnsetPressedState);
            }
        }
        private removeTapCallback() {
            if (this.mPendingCheckForTap != null) {
                this.mPrivateFlags &= ~View.PFLAG_PREPRESSED;
                this.removeCallbacks(this.mPendingCheckForTap);
            }
        }
        cancelLongPress() {
            this.removeLongPressCallback();

            /*
             * The prepressed state handled by the tap callback is a display
             * construct, but the tap callback will post a long press callback
             * less its own timeout. Remove it here.
             */
            this.removeTapCallback();
        }
        setTouchDelegate(delegate:TouchDelegate) {
            this.mTouchDelegate = delegate;
        }
        getTouchDelegate() {
            return this.mTouchDelegate;
        }
        setOnLongClickListener(l:View.OnLongClickListener) {
            if (!this.isLongClickable()) {
                this.setLongClickable(true);
            }
            this.getListenerInfo().mOnLongClickListener = l;
        }
        performClick():boolean {
            let li = this.mListenerInfo;
            if (li != null && li.mOnClickListener != null) {
                li.mOnClickListener.onClick(this);
                return true;
            }

            return false;
        }
        callOnClick():boolean {
            let li = this.mListenerInfo;
            if (li != null && li.mOnClickListener != null) {
                li.mOnClickListener.onClick(this);
                return true;
            }

            return false;
        }
        performLongClick():boolean {
            let handled = false;
            let li = this.mListenerInfo;
            if (li != null && li.mOnLongClickListener != null) {
                handled = li.mOnLongClickListener.onLongClick(this);
            }
            return handled;
        }

        private checkForLongClick(delayOffset=0) {
            if ((this.mViewFlags & View.LONG_CLICKABLE) == View.LONG_CLICKABLE) {
                this.mHasPerformedLongPress = false;

                if (this.mPendingCheckForLongPress == null) {
                    this.mPendingCheckForLongPress = new CheckForLongPress(this);
                }
                this.mPendingCheckForLongPress.rememberWindowAttachCount();
                this.postDelayed(this.mPendingCheckForLongPress,
                    ViewConfiguration.getLongPressTimeout() - delayOffset);
            }
        }
        setOnTouchListener(l:View.OnTouchListener) {
            this.getListenerInfo().mOnTouchListener = l;
        }
        isClickable() {
            return (this.mViewFlags & View.CLICKABLE) == View.CLICKABLE;
        }
        setClickable(clickable:boolean) {
            this.setFlags(clickable ? View.CLICKABLE : 0, View.CLICKABLE);
        }
        isLongClickable():boolean {
            return (this.mViewFlags & View.LONG_CLICKABLE) == View.LONG_CLICKABLE;
        }
        setLongClickable(longClickable:boolean) {
            this.setFlags(longClickable ? View.LONG_CLICKABLE : 0, View.LONG_CLICKABLE);
        }
        setPressed(pressed:boolean){
            //TODO refresh drawable & dispath
        }
        isPressed():boolean {
            return (this.mPrivateFlags & View.PFLAG_PRESSED) == View.PFLAG_PRESSED;
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
        isLaidOut():boolean {
            return (this.mPrivateFlags3 & View.PFLAG3_IS_LAID_OUT) == View.PFLAG3_IS_LAID_OUT;
        }

        layout(l:number, t:number, r:number, b:number):void {
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
        onLayout(changed:boolean, left:number, top:number, right:number, bottom:number):void {
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
        getDrawingRect(outRect:Rect) {
            outRect.left = this.mScrollX;
            outRect.top = this.mScrollY;
            outRect.right = this.mScrollX + (this.mRight - this.mLeft);
            outRect.bottom = this.mScrollY + (this.mBottom - this.mTop);
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

        private _invalidateRect(l:number, t:number, r:number, b:number){
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
                //noinspection PointlessBooleanExpression,ConstantConditions
//            if (!HardwareRenderer.RENDER_DIRTY_REGIONS) {
//                if (p != null && ai != null && ai.mHardwareAccelerated) {
//                    // fast-track for GL-enabled applications; just invalidate the whole hierarchy
//                    // with a null dirty rect, which tells the ViewAncestor to redraw everything
//                    p.invalidateChild(this, null);
//                    return;
//                }
//            }
                if (p != null && ai != null && l < r && t < b) {
                    const scrollX = this.mScrollX;
                    const scrollY = this.mScrollY;
                    const tmpr = ai.mTmpInvalRect;
                    tmpr.set(l - scrollX, t - scrollY, r - scrollX, b - scrollY);
                    p.invalidateChild(this, tmpr);
                }
            }
        }
        private _invalidateCache(invalidateCache=true){
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
                    // Don't call invalidate -- we don't want to internally scroll
                    // our own bounds
                    p.invalidateChild(this, r);
                }
            }
        }
        invalidate();
        invalidate(invalidateCache:boolean);
        invalidate(dirty:Rect);
        invalidate(l:number, t:number, r:number, b:number);
        invalidate(...args){
            if(args.length===0 || (args.length===1&& typeof args[0]==='boolean' )){
                this._invalidateCache(args[0]);

            }else if(args.length===1 && args[0] instanceof Rect){
                let rect:Rect = args[0];
                this._invalidateRect(rect.left, rect.top, rect.right, rect.bottom);

            }else if(args.length===4){
                (<any>this)._invalidateRect(...args);
            }
        }
        invalidateViewProperty(invalidateParent:boolean, forceRedraw:boolean){
            if ((this.mPrivateFlags & View.PFLAG_DRAW_ANIMATION) == View.PFLAG_DRAW_ANIMATION) {
                if (invalidateParent) {
                    this.invalidateParentCaches();
                }
                if (forceRedraw) {
                    this.mPrivateFlags |= View.PFLAG_DRAWN; // force another invalidation with the new orientation
                }
                this.invalidate(false);
            } else {
                const ai = this.mAttachInfo;
                const p = this.mParent;
                if (p != null && ai != null) {
                    const r = ai.mTmpInvalRect;
                    r.set(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop);
                    if (this.mParent instanceof ViewGroup) {
                        (<ViewGroup>this.mParent).invalidateChildFast(this, r);
                    } else {
                        this.mParent.invalidateChild(this, r);
                    }
                }
            }
        }
        invalidateParentCaches(){
            if (this.mParent instanceof View) {
                (<any> this.mParent).mPrivateFlags |= View.PFLAG_INVALIDATED;
            }
        }
        invalidateParentIfNeeded(){
            //no HardwareAccelerated, no need
            //if (isHardwareAccelerated() && mParent instanceof View) {
            //    ((View) mParent).invalidate(true);
            //}
        }

        postInvalidate(l?:number, t?:number, r?:number, b?:number){
            this.postInvalidateDelayed(0, l, t, r, b);
        }

        postInvalidateDelayed(delayMilliseconds:number, left?:number, top?:number, right?:number, bottom?:number){
            const attachInfo = this.mAttachInfo;
            if (attachInfo != null) {
                if(!Number.isInteger(left) || !Number.isInteger(top) || !Number.isInteger(right) || !Number.isInteger(bottom)){
                    attachInfo.mViewRootImpl.dispatchInvalidateDelayed(this, delayMilliseconds);
                }else{
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
        postInvalidateOnAnimation(left?:number, top?:number, right?:number, bottom?:number){
            const attachInfo = this.mAttachInfo;
            if (attachInfo != null) {
                if(!Number.isInteger(left) || !Number.isInteger(top) || !Number.isInteger(right) || !Number.isInteger(bottom)){
                    attachInfo.mViewRootImpl.dispatchInvalidateOnAnimation(this);
                }else{
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
        private skipInvalidate() {
            return (this.mViewFlags & View.VISIBILITY_MASK) != View.VISIBLE
                //TODO when animation ok
                //&&mCurrentAnimation == null
                //TODO when transition ok
                //&&(!(mParent instanceof ViewGroup) ||
                //!mParent.isViewTransitioning(this))
                ;
        }

        isOpaque():boolean {
            return (this.mPrivateFlags & View.PFLAG_OPAQUE_MASK) == View.PFLAG_OPAQUE_MASK &&
                this.getFinalAlpha() >= 1;
        }
        private computeOpaqueFlags() {
            // Opaque if:
            //   - Has a background
            //   - Background is opaque
            //   - Doesn't have scrollbars or scrollbars overlay

            if (this.mBackground != null && this.mBackground.getOpacity() == PixelFormat.OPAQUE) {
                this.mPrivateFlags |= View.PFLAG_OPAQUE_BACKGROUND;
            } else {
                this.mPrivateFlags &= ~View.PFLAG_OPAQUE_BACKGROUND;
            }

            //const flags = this.mViewFlags;//TODO when scroll ok
            //if (((flags & View.SCROLLBARS_VERTICAL) == 0 && (flags & View.SCROLLBARS_HORIZONTAL) == 0) ||
            //    (flags & View.SCROLLBARS_STYLE_MASK) == View.SCROLLBARS_INSIDE_OVERLAY ||
            //    (flags & View.SCROLLBARS_STYLE_MASK) == View.SCROLLBARS_OUTSIDE_OVERLAY) {
            //    this.mPrivateFlags |= View.PFLAG_OPAQUE_SCROLLBARS;
            //} else {
            //    this.mPrivateFlags &= ~View.PFLAG_OPAQUE_SCROLLBARS;
            //}
        }
        getLayerType() {
            return this.mLayerType;
        }
        setClipBounds(clipBounds:Rect) {
            if (clipBounds != null) {
                if (clipBounds.equals(this.mClipBounds)) {
                    return;
                }
                if (this.mClipBounds == null) {
                    this.invalidate();
                    this.mClipBounds = new Rect(clipBounds);
                } else {
                    this.invalidate(Math.min(this.mClipBounds.left, clipBounds.left),
                        Math.min(this.mClipBounds.top, clipBounds.top),
                        Math.max(this.mClipBounds.right, clipBounds.right),
                        Math.max(this.mClipBounds.bottom, clipBounds.bottom));
                    this.mClipBounds.set(clipBounds);
                }
            } else {
                if (this.mClipBounds != null) {
                    this.invalidate();
                    this.mClipBounds = null;
                }
            }
        }
        getClipBounds():Rect {
            return (this.mClipBounds != null) ? new Rect(this.mClipBounds) : null;
        }


        getDrawingTime() {
            return this.mAttachInfo != null ? this.mAttachInfo.mDrawingTime : 0;
        }

        drawFromParent(canvas:Canvas, parent:ViewGroup, drawingTime:number):boolean {
            let useDisplayListProperties = false;
            let more = false;
            let childHasIdentityMatrix = true;//TODO when transform ok
            let flags = parent.mGroupFlags;
            let scalingRequired = false;
            let concatMatrix = false;
            let caching = false;
            let layerType = this.getLayerType();

            //let hardwareAccelerated = false;
            if ((flags & ViewGroup.FLAG_CHILDREN_DRAWN_WITH_CACHE) != 0 ||
                (flags & ViewGroup.FLAG_ALWAYS_DRAWN_WITH_CACHE) != 0) {
                caching = true;
            } else {
                caching = (layerType != View.LAYER_TYPE_NONE);
            }

            //let a = this.getAnimation();//TODO animation & Transformation
            //if (a != null) {
            //    more = drawAnimation(parent, drawingTime, a, scalingRequired);
            //    concatMatrix = a.willChangeTransformationMatrix();
            //    if (concatMatrix) {
            //        mPrivateFlags3 |= PFLAG3_VIEW_IS_ANIMATING_TRANSFORM;
            //    }
            //    transformToApply = parent.getChildTransformation();
            //} else {
            //    if (!useDisplayListProperties &&
            //        (flags & ViewGroup.FLAG_SUPPORT_STATIC_TRANSFORMATIONS) != 0) {
            //        let t = parent.getChildTransformation();
            //        const hasTransform = parent.getChildStaticTransformation(this, t);
            //        if (hasTransform) {
            //            final int transformType = t.getTransformationType();
            //            transformToApply = transformType != Transformation.TYPE_IDENTITY ? t : null;
            //            concatMatrix = (transformType & Transformation.TYPE_MATRIX) != 0;
            //        }
            //    }
            //}

            concatMatrix ==  concatMatrix || !childHasIdentityMatrix;
            this.mPrivateFlags |= View.PFLAG_DRAWN;

            if (!concatMatrix &&
                (flags & (ViewGroup.FLAG_SUPPORT_STATIC_TRANSFORMATIONS |
                ViewGroup.FLAG_CLIP_CHILDREN)) == ViewGroup.FLAG_CLIP_CHILDREN &&
                canvas.quickReject(this.mLeft, this.mTop, this.mRight, this.mBottom) &&
                (this.mPrivateFlags & View.PFLAG_DRAW_ANIMATION) == 0) {
                this.mPrivateFlags2 |= View.PFLAG2_VIEW_QUICK_REJECTED;
                return more;
            }
            this.mPrivateFlags2 &= ~View.PFLAG2_VIEW_QUICK_REJECTED;

            let cache:Canvas = null;
            if (caching) {
                if (layerType != View.LAYER_TYPE_NONE) {
                    layerType = View.LAYER_TYPE_SOFTWARE;
                    //this.buildDrawingCache(true);//TODO when cache impl
                }
                //cache = this.getDrawingCache(true);//TODO when cache impl
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

            //TODO deal alpha
            let alpha = 1;

            if ((flags & ViewGroup.FLAG_CLIP_CHILDREN) == ViewGroup.FLAG_CLIP_CHILDREN &&
                !useDisplayListProperties && cache == null) {
                if (offsetForScroll) {
                    canvas.clipRect(sx, sy, sx + (this.mRight - this.mLeft), sy + (this.mBottom - this.mTop));
                } else {
                    if (!scalingRequired || cache == null) {
                        canvas.clipRect(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop);
                    } else {
                        canvas.clipRect(0, 0, cache.getWidth(), cache.getHeight());
                    }
                }
            }

            if (hasNoCache) {
                // Fast path for layouts with no backgrounds
                if ((this.mPrivateFlags & View.PFLAG_SKIP_DRAW) == View.PFLAG_SKIP_DRAW) {
                    this.mPrivateFlags &= ~View.PFLAG_DIRTY_MASK;
                    this.dispatchDraw(canvas);
                } else {
                    this.draw(canvas);
                }
            } else if (cache != null) {
                this.mPrivateFlags &= ~View.PFLAG_DIRTY_MASK;
                if (alpha < 1) {
                    //cachePaint.setAlpha((int) (alpha * 255));
                    parent.mGroupFlags |= ViewGroup.FLAG_ALPHA_LOWER_THAN_ONE;

                } else if  ((flags & ViewGroup.FLAG_ALPHA_LOWER_THAN_ONE) != 0) {
                    //cachePaint.setAlpha(255);
                    parent.mGroupFlags &= ~ViewGroup.FLAG_ALPHA_LOWER_THAN_ONE;
                }
                canvas.drawCanvas(cache, 0, 0);//TODO draw with alpha
            }


            if (restoreTo >= 0) {
                canvas.restoreToCount(restoreTo);
            }

            return more;
        }

        draw(canvas:Canvas){
            if (this.mClipBounds != null) {
                canvas.clipRect(this.mClipBounds);
            }
            let privateFlags = this.mPrivateFlags;
            const dirtyOpaque = (privateFlags & View.PFLAG_DIRTY_MASK) == View.PFLAG_DIRTY_OPAQUE &&
                (this.mAttachInfo == null || !this.mAttachInfo.mIgnoreDirtyState);
            this.mPrivateFlags = (privateFlags & ~View.PFLAG_DIRTY_MASK) | View.PFLAG_DRAWN;

            // draw the background, if needed
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
                    } else {
                        canvas.translate(scrollX, scrollY);
                        background.draw(canvas);
                        canvas.translate(-scrollX, -scrollY);
                    }
                }
            }
            // draw the content
            if (!dirtyOpaque) this.onDraw(canvas);

            // draw the children
            this.dispatchDraw(canvas);


            if (this.mOverlay != null && !this.mOverlay.isEmpty()) {
                this.mOverlay.getOverlayView().dispatchDraw(canvas);
            }

        }
        onDraw(canvas:Canvas) {
        }
        dispatchDraw(canvas:Canvas) {
        }
        destroyDrawingCache() {
            //TODO impl draw cache
        }
        setWillNotDraw(willNotDraw:boolean) {
            this.setFlags(willNotDraw ? View.WILL_NOT_DRAW : 0, View.DRAW_MASK);
        }
        willNotDraw():boolean {
            return (this.mViewFlags & View.DRAW_MASK) == View.WILL_NOT_DRAW;
        }
        setWillNotCacheDrawing(willNotCacheDrawing:boolean) {
            this.setFlags(willNotCacheDrawing ? View.WILL_NOT_CACHE_DRAWING : 0, View.WILL_NOT_CACHE_DRAWING);
        }
        willNotCacheDrawing():boolean {
            return (this.mViewFlags & View.WILL_NOT_CACHE_DRAWING) == View.WILL_NOT_CACHE_DRAWING;
        }


        jumpDrawablesToCurrentState() {
            if (this.mBackground != null) {
                this.mBackground.jumpToCurrentState();
            }
        }


        invalidateDrawable(drawable:Drawable):void{
            if (this.verifyDrawable(drawable)) {
                const dirty = drawable.getBounds();
                const scrollX = this.mScrollX;
                const scrollY = this.mScrollY;

                this.invalidate(dirty.left + scrollX, dirty.top + scrollY,
                    dirty.right + scrollX, dirty.bottom + scrollY);
            }
        }
        scheduleDrawable(who:Drawable, what:Runnable, when:number):void{
            if (this.verifyDrawable(who) && what != null) {
                const delay = when - SystemClock.uptimeMillis();
                if (this.mAttachInfo != null) {
                    this.mAttachInfo.mHandler.postAtTime(what, who, when);
                } else {
                    ViewRootImpl.getRunQueue().postDelayed(what, delay);
                }
            }
        }
        unscheduleDrawable(who:Drawable, what?:Runnable){
            if (this.verifyDrawable(who) && what != null) {
                if (this.mAttachInfo != null) {
                    this.mAttachInfo.mHandler.removeCallbacks(what, who);
                } else {
                    ViewRootImpl.getRunQueue().removeCallbacks(what);
                }

            }else if(what===null){
                if (this.mAttachInfo != null && who != null) {
                    this.mAttachInfo.mHandler.removeCallbacksAndMessages(who);
                }
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
            this.drawableStateChanged();

            let parent = this.mParent;
            if (parent != null) {
                parent.childDrawableStateChanged(this);
            }
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

        getAnimation() {
            //TODO animation
            return null;
        }

        computeHorizontalScrollRange():number {
            return this.getWidth();
        }
        computeHorizontalScrollOffset():number {
            return this.mScrollX;
        }
        computeHorizontalScrollExtent():number {
            return this.getWidth();
        }
        computeVerticalScrollRange():number {
            return this.getHeight();
        }
        computeVerticalScrollOffset():number {
            return this.mScrollY;
        }
        computeVerticalScrollExtent():number {
            return this.getHeight();
        }
        canScrollHorizontally(direction:number):boolean {
            const offset = this.computeHorizontalScrollOffset();
            const range = this.computeHorizontalScrollRange() - this.computeHorizontalScrollExtent();
            if (range == 0) return false;
            if (direction < 0) {
                return offset > 0;
            } else {
                return offset < range - 1;
            }
        }
        canScrollVertically(direction:number):boolean {
            const offset = this.computeVerticalScrollOffset();
            const range = this.computeVerticalScrollRange() - this.computeVerticalScrollExtent();
            if (range == 0) return false;
            if (direction < 0) {
                return offset > 0;
            } else {
                return offset < range - 1;
            }
        }

        overScrollBy(deltaX:number, deltaY:number, scrollX:number, scrollY:number,
                     scrollRangeX:number, scrollRangeY:number, maxOverScrollX:number, maxOverScrollY:number,
                     isTouchEvent:boolean):boolean {
            const overScrollMode = this.mOverScrollMode;
            const canScrollHorizontal =
                this.computeHorizontalScrollRange() > this.computeHorizontalScrollExtent();
            const canScrollVertical =
                this.computeVerticalScrollRange() > this.computeVerticalScrollExtent();
            const overScrollHorizontal = overScrollMode == View.OVER_SCROLL_ALWAYS ||
                (overScrollMode == View.OVER_SCROLL_IF_CONTENT_SCROLLS && canScrollHorizontal);
            const overScrollVertical = overScrollMode == View.OVER_SCROLL_ALWAYS ||
                (overScrollMode == View.OVER_SCROLL_IF_CONTENT_SCROLLS && canScrollVertical);

            if( (deltaX<0 && scrollX<=0) || (deltaX>0 && scrollX>=scrollRangeX) ){
                deltaX /= 2;
            }
            if( (deltaY<0 && scrollY<=0) || (deltaY>0 && scrollY>=scrollRangeY) ){
                deltaY /= 2;
            }



            let newScrollX = scrollX + deltaX;
            if (!overScrollHorizontal) {
                maxOverScrollX = 0;
            }

            let newScrollY = scrollY + deltaY;
            if (!overScrollVertical) {
                maxOverScrollY = 0;
            }

            // Clamp values if at the limits and record
            const left = -maxOverScrollX;
            const right = maxOverScrollX + scrollRangeX;
            const top = -maxOverScrollY;
            const bottom = maxOverScrollY + scrollRangeY;

            let clampedX = false;
            if (newScrollX > right) {
                newScrollX = right;
                clampedX = true;
            } else if (newScrollX < left) {
                newScrollX = left;
                clampedX = true;
            }

            let clampedY = false;
            if (newScrollY > bottom) {
                newScrollY = bottom;
                clampedY = true;
            } else if (newScrollY < top) {
                newScrollY = top;
                clampedY = true;
            }

            this.onOverScrolled(newScrollX, newScrollY, clampedX, clampedY);

            return clampedX || clampedY;
        }
        onOverScrolled(scrollX:number, scrollY:number, clampedX:boolean, clampedY:boolean) {
            // Intentionally empty.
        }
        getOverScrollMode() {
            return this.mOverScrollMode;
        }
        setOverScrollMode(overScrollMode:number) {
            if (overScrollMode != View.OVER_SCROLL_ALWAYS &&
                overScrollMode != View.OVER_SCROLL_IF_CONTENT_SCROLLS &&
                overScrollMode != View.OVER_SCROLL_NEVER) {
                throw new Error("Invalid overscroll mode " + overScrollMode);
            }
            this.mOverScrollMode = overScrollMode;
        }
        getVerticalScrollFactor():number {
            if (this.mVerticalScrollFactor == 0) {
                this.mVerticalScrollFactor = Resources.getDisplayMetrics().density * 64;
            }
            return this.mVerticalScrollFactor;
        }
        getHorizontalScrollFactor():number {
            // TODO: Should use something else.
            return this.getVerticalScrollFactor();
        }
        computeScroll() {
        }
        scrollTo(x:number, y:number) {
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
        scrollBy(x:number, y:number) {
            this.scrollTo(this.mScrollX + x, this.mScrollY + y);
        }

        awakenScrollBars(startDelay=ViewConfiguration.getScrollDefaultDelay(), invalidate=true):boolean{
            //TODO when scroll bar impl
            return false;
        }
        getVerticalFadingEdgeLength():number{
            return 0;
        }
        setFadingEdgeLength(length:number){
            //TODO shound impl fade edge?
        }
        getHorizontalFadingEdgeLength():number {
            return 0;
        }
        getVerticalScrollbarWidth():number {
            //TODO when scroll bar impl
            return 0;
        }
        getHorizontalScrollbarHeight():number {
            //TODO when scroll bar impl
            return 0;
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

            this.removeUnsetPressCallback();
            this.removeLongPressCallback();
            this.removePerformClickCallback();

            //this.destroyDrawingCache();//TODO when impl
            //this.destroyLayer(false);
            //
            //this.cleanupDraw();
            //
            //this.mCurrentAnimation = null;
        }
        cleanupDraw() {
            if (this.mAttachInfo != null) {
                //this.mAttachInfo.mViewRootImpl.cancelInvalidate(this);//TODO when impl
            }
        }

        debug(depth=0){
            //custom impl
            let originProto = Object.getPrototypeOf(this);
            console.dir(Object.assign(Object.create(originProto), this));
        }


        toString():String{
            return this.tagName();
        }
        getRootView():View {
            if (this.mAttachInfo != null) {
                let v = this.mAttachInfo.mRootView;
                if (v != null) {
                    return v;
                }
            }

            let parent = this;

            while (parent.mParent != null && parent.mParent instanceof View) {
                parent = <any>parent.mParent;
            }

            return parent;
        }
        findViewById(id:string):View{
            let bindEle = this.bindElement.querySelector('#'+id);
            return bindEle ? bindEle['bindView'] : null;
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

            rootView.onFinishInflate();
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
            //mCanvas : Canvas;
            mViewRootImpl : ViewRootImpl;
            mHandler : Handler;
            mTmpInvalRect = new Rect();
            mTmpTransformRect = new Rect();
            mScrollContainers = new Set<View>();
            mViewScrollChanged = false;
            mTreeObserver = new ViewTreeObserver();
            mViewRequestingLayout:View;
            mViewVisibilityChanged = false;
            mInvalidateChildLocation = new Array<number>(2);
            mIgnoreDirtyState = false;
            mSetIgnoreDirtyState = false;

            constructor(mViewRootImpl:ViewRootImpl, mHandler:Handler) {
                this.mViewRootImpl = mViewRootImpl;
                this.mHandler = mHandler;
            }

        }

        export class ListenerInfo{
            mOnAttachStateChangeListeners:CopyOnWriteArrayList<OnAttachStateChangeListener>;
            mOnLayoutChangeListeners:Array<OnLayoutChangeListener>;
            mOnClickListener:OnClickListener;
            mOnLongClickListener:OnLongClickListener;
            mOnTouchListener:OnTouchListener;

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
    export module View.AttachInfo{
        export class InvalidateInfo{
            private static POOL_LIMIT = 10;

            private static sPool = new Pools.SynchronizedPool<InvalidateInfo>(InvalidateInfo.POOL_LIMIT);

            target:View;

            left = 0;
            top = 0;
            right = 0;
            bottom = 0;

            static obtain():InvalidateInfo {
                let instance = InvalidateInfo.sPool.acquire();
                return (instance != null) ? instance : new InvalidateInfo();
            }

            recycle():void {
                this.target = null;
                InvalidateInfo.sPool.release(this);
            }
        }
    }


    class CheckForLongPress implements Runnable{
        private View_this : any;//don't check private
        private mOriginalWindowAttachCount = 0;

        constructor(View_this:View) {
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
    class CheckForTap implements Runnable {
        private View_this : any;
        constructor(View_this:View) {
            this.View_this = View_this;
        }
        run() {
            this.View_this.mPrivateFlags &= ~View.PFLAG_PREPRESSED;
            this.View_this.setPressed(true);
            this.View_this.checkForLongClick(ViewConfiguration.getTapTimeout());
        }
    }
    class PerformClick implements Runnable {
        private View_this : any;
        constructor(View_this:View) {
            this.View_this = View_this;
        }
        run() {
            this.View_this.performClick();
        }
    }
    class UnsetPressedState implements Runnable {
        private View_this : any;
        constructor(View_this:View) {
            this.View_this = View_this;
        }
        run() {
            this.View_this.setPressed(false);
        }
    }
}
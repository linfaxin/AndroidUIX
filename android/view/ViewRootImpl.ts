/**
 * Created by linfaxin on 15/10/5.
 */
///<reference path="ViewParent.ts"/>
///<reference path="View.ts"/>
///<reference path="Surface.ts"/>
///<reference path="../util/Log.ts"/>
///<reference path="../util/Log.ts"/>
///<reference path="../os/Handler.ts"/>
///<reference path="../os/SystemClock.ts"/>
///<reference path="../content/res/Resources.ts"/>
///<reference path="../graphics/Point.ts"/>
///<reference path="../graphics/Rect.ts"/>
///<reference path="../graphics/Canvas.ts"/>
///<reference path="../../java/lang/Runnable.ts"/>
///<reference path="../../java/lang/System.ts"/>
module android.view {
    import ViewParent = android.view.ViewParent;
    import View = android.view.View;
    import Resources = android.content.res.Resources;
    import Rect = android.graphics.Rect;
    import Point = android.graphics.Point;
    import Canvas = android.graphics.Canvas;
    import Handler = android.os.Handler;
    import SystemClock = android.os.SystemClock;
    import Runnable = java.lang.Runnable;
    import System = java.lang.System;
    import Log = android.util.Log;
    import Surface = android.view.Surface;

    export class ViewRootImpl implements ViewParent {
        static TAG = "ViewRootImpl";
        private static DBG = Log.View_DBG;
        static LOCAL_LOGV = ViewRootImpl.DBG;
        static DEBUG_DRAW = false || ViewRootImpl.LOCAL_LOGV;
        static DEBUG_LAYOUT = false || ViewRootImpl.LOCAL_LOGV;
        static DEBUG_INPUT_RESIZE = false || ViewRootImpl.LOCAL_LOGV;
        static DEBUG_ORIENTATION = false || ViewRootImpl.LOCAL_LOGV;
        static DEBUG_CONFIGURATION = false || ViewRootImpl.LOCAL_LOGV;
        static DEBUG_FPS = false || ViewRootImpl.LOCAL_LOGV;

        private mView:View;
        private mViewVisibility:number = 0;
        private mWidth:number = -1;
        private mHeight:number = -1;
        private mDirty = new Rect();
        private mAttachInfo:View.AttachInfo;
        private mTempRect:Rect = new Rect();
        private mVisRect:Rect = new Rect();
        private mTraversalScheduled:boolean = false;
        private mWillDrawSoon:boolean = false;
        private mIsInTraversal:boolean = false;
        private mLayoutRequested:boolean = false;
        private mFirst:boolean = true;
        private mFullRedrawNeeded:boolean = false;
        private mIsDrawing:boolean = false;
        private mAdded:boolean = false;
        mWinFrame = new Rect();//Root Element Bound
        private mInLayout:boolean;
        private mLayoutRequesters : Array<View> = [];
        private mHandlingLayoutInLayoutRequest:boolean;
        private mRemoved:boolean;
        private mHandler = new Handler();


        // Variables to track frames per second, enabled via DEBUG_FPS flag
        private mFpsStartTime = -1;
        private mFpsPrevTime = -1;
        private mFpsNumFrames = 0;

        private mSurface : Surface;

        constructor() {
            this.mAttachInfo = new View.AttachInfo(this, this.mHandler);
            this.mTraversalRunnable = new TraversalRunnable(this);
        }

        initSurface(canvasElement:HTMLCanvasElement){
            this.mSurface = new Surface(canvasElement);
        }

        setView(view:View) {
            if (this.mView == null) {
                this.mView = view;

                this.mAttachInfo.mRootView = view;
                this.mAdded = true;

                // Schedule the first layout -before- adding to the window
                // manager, to make sure we do the relayout before receiving
                // any other events from the system.
                this.requestLayout();
                //this.mAttachInfo.mRecomputeGlobalAttributes = true;
                //collectViewAttributes();

                //mPendingOverscanInsets.set(0, 0, 0, 0);
                //mPendingContentInsets.set(mAttachInfo.mContentInsets);
                //mPendingVisibleInsets.set(0, 0, 0, 0);


                view.assignParent(this);
                //this.mAddedTouchMode = true;
            }
        }

        getView():View {
            return this.mView;
        }

        getHostVisibility():number {
            return this.mView.getVisibility();
        }

        private mTraversalRunnable : TraversalRunnable;

        private scheduleTraversals() {
            if (!this.mTraversalScheduled) {
                this.mTraversalScheduled = true;
                this.mHandler.post(this.mTraversalRunnable);

            }
        }

        private unscheduleTraversals() {
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

        private measureHierarchy(host:View, lp:ViewGroup.LayoutParams, desiredWindowWidth:number, desiredWindowHeight:number) {
            let windowSizeMayChange = false;
            if (ViewRootImpl.DEBUG_ORIENTATION || ViewRootImpl.DEBUG_LAYOUT) Log.v(ViewRootImpl.TAG,
                "Measuring " + host + " in display " + desiredWindowWidth
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

        private static getRootMeasureSpec(windowSize:number, rootDimension:number):number {
            let MeasureSpec = View.MeasureSpec;
            let measureSpec;
            switch (rootDimension) {

                case ViewGroup.LayoutParams.MATCH_PARENT:
                    // Window can't resize. Force root view to be windowSize.
                    measureSpec = MeasureSpec.makeMeasureSpec(windowSize, MeasureSpec.EXACTLY);
                    break;
                case ViewGroup.LayoutParams.WRAP_CONTENT:
                    // Window can resize. Set max size for root view.
                    measureSpec = MeasureSpec.makeMeasureSpec(windowSize, MeasureSpec.AT_MOST);
                    break;
                default:
                    // Window wants to be an exact size. Force root view to be that size.
                    measureSpec = MeasureSpec.makeMeasureSpec(rootDimension, MeasureSpec.EXACTLY);
                    break;
            }
            return measureSpec;
        }

        private performTraversals() {
            let host = this.mView;

            if (ViewRootImpl.DBG) {
                System.out.println("======================================");
                System.out.println("performTraversals");
                host.debug();
            }

            if (host == null || !this.mAdded) return;

            this.mIsInTraversal = true;
            this.mWillDrawSoon = true;
            let windowSizeMayChange = false;
            let newSurface = false;
            let surfaceChanged = false;
            let lp = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);

            let desiredWindowWidth;
            let desiredWindowHeight;

            let attachInfo = this.mAttachInfo;

            let viewVisibility = this.getHostVisibility();
            let viewVisibilityChanged = this.mViewVisibility != viewVisibility;// || mNewSurfaceNeeded;

            let params:ViewGroup.LayoutParams = null;

            let frame = this.mWinFrame;
            if (this.mFirst) {
                this.mFullRedrawNeeded = true;
                this.mLayoutRequested = true;

                let packageMetrics = Resources.getDisplayMetrics();
                desiredWindowWidth = packageMetrics.widthPixels;
                desiredWindowHeight = packageMetrics.heightPixels;

                viewVisibilityChanged = false;
                //mLastConfiguration.setTo(host.getResources().getConfiguration());
                // Set the layout direction if it has not been set before (inherit is the default)
                //if (mViewLayoutDirectionInitial == View.LAYOUT_DIRECTION_INHERIT) {
                //    host.setLayoutDirection(mLastConfiguration.getLayoutDirection());
                //}
                host.dispatchAttachedToWindow(attachInfo, 0);
                attachInfo.mTreeObserver.dispatchOnWindowAttachedChange(true);
                //mFitSystemWindowsInsets.set(mAttachInfo.mContentInsets);
                //host.fitSystemWindows(mFitSystemWindowsInsets);
                //Log.i(TAG, "Screen on initialized: " + attachInfo.mKeepScreenOn);

            } else {
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

            // Execute enqueued actions on every traversal in case a detached view enqueued an action
            ViewRootImpl.getRunQueue(this).executeActions(attachInfo.mHandler);

            let layoutRequested = this.mLayoutRequested;
            if (layoutRequested) {

                if (this.mFirst) {
                    // make sure touch mode code executes by setting cached value
                    // to opposite of the added touch mode.
                    //mAttachInfo.mInTouchMode = !mAddedTouchMode;
                    //ensureTouchModeLocally(mAddedTouchMode);

                } else {
                    //if (!mPendingOverscanInsets.equals(mAttachInfo.mOverscanInsets)) {
                    //    insetsChanged = true;
                    //}
                    //if (!mPendingContentInsets.equals(mAttachInfo.mContentInsets)) {
                    //    insetsChanged = true;
                    //}
                    //if (!mPendingVisibleInsets.equals(mAttachInfo.mVisibleInsets)) {
                    //    mAttachInfo.mVisibleInsets.set(mPendingVisibleInsets);
                    //    if (DEBUG_LAYOUT) Log.v(TAG, "Visible insets changing to: "
                    //        + mAttachInfo.mVisibleInsets);
                    //}
                    if (lp.width == ViewGroup.LayoutParams.WRAP_CONTENT
                        || lp.height == ViewGroup.LayoutParams.WRAP_CONTENT) {
                        windowSizeMayChange = true;

                        let packageMetrics = Resources.getDisplayMetrics();
                        desiredWindowWidth = packageMetrics.widthPixels;
                        desiredWindowHeight = packageMetrics.heightPixels;
                    }

                    // Ask host how big it wants to be
                    windowSizeMayChange = windowSizeMayChange || this.measureHierarchy(host, lp,
                        desiredWindowWidth, desiredWindowHeight);
                }

                // Ask host how big it wants to be
                windowSizeMayChange == windowSizeMayChange || this.measureHierarchy(host, lp,
                    desiredWindowWidth, desiredWindowHeight);
            }

            if (this.mFirst || attachInfo.mViewVisibilityChanged) {
                attachInfo.mViewVisibilityChanged = false;
            }

            if (layoutRequested) {
                // Clear this now, so that if anything requests a layout in the
                // rest of this function we will catch it and re-run a full
                // layout pass.
                this.mLayoutRequested = false;
            }

            let windowShouldResize = layoutRequested && windowSizeMayChange
                && ((this.mWidth != host.getMeasuredWidth() || this.mHeight != host.getMeasuredHeight())
                || (lp.width == ViewGroup.LayoutParams.WRAP_CONTENT &&
                frame.width() < desiredWindowWidth && frame.width() != this.mWidth)
                || (lp.height == ViewGroup.LayoutParams.WRAP_CONTENT &&
                frame.height() < desiredWindowHeight && frame.height() != this.mHeight));

            if (this.mFirst || windowShouldResize || viewVisibilityChanged) {

                if (ViewRootImpl.DEBUG_LAYOUT) {
                    Log.i(ViewRootImpl.TAG, "host=w:" + host.getMeasuredWidth() + ", h:" +
                        host.getMeasuredHeight() + ", params=" + params);
                }

                //if (ViewRootImpl.DEBUG_LAYOUT) Log.v(ViewRootImpl.TAG, "relayout: frame=" + frame.toShortString());

                if (ViewRootImpl.DEBUG_ORIENTATION) Log.v(ViewRootImpl.TAG, "Relayout returned: frame=" + frame);

                // !!FIXME!! This next section handles the case where we did not get the
                // window size we asked for. We should avoid this by getting a maximum size from
                // the window session beforehand.
                if (this.mWidth != frame.width() || this.mHeight != frame.height()) {
                    this.mWidth = frame.width();
                    this.mHeight = frame.height();
                }

                if (this.mWidth != host.getMeasuredWidth()
                    || this.mHeight != host.getMeasuredHeight()) {
                    let childWidthMeasureSpec = ViewRootImpl.getRootMeasureSpec(this.mWidth, lp.width);
                    let childHeightMeasureSpec = ViewRootImpl.getRootMeasureSpec(this.mHeight, lp.height);

                    if (ViewRootImpl.DEBUG_LAYOUT) Log.v(ViewRootImpl.TAG, "Ooops, something changed!  mWidth="
                        + this.mWidth + " measuredWidth=" + host.getMeasuredWidth()
                        + " mHeight=" + this.mHeight
                        + " measuredHeight=" + host.getMeasuredHeight());

                    // Ask host how big it wants to be
                    this.performMeasure(childWidthMeasureSpec, childHeightMeasureSpec);

                    layoutRequested = true;
                }
            }

            const didLayout = layoutRequested;
            let triggerGlobalLayoutListener = didLayout;
            if (didLayout) {
                this.performLayout(lp, desiredWindowWidth, desiredWindowHeight);

                // By this point all views have been sized and positioned
                // We can compute the transparent area(no need)

                if (ViewRootImpl.DBG) {
                    System.out.println("======================================");
                    System.out.println("performTraversals -- after setFrame");
                    host.debug();
                }
            }

            if (triggerGlobalLayoutListener) {
                //attachInfo.mRecomputeGlobalAttributes = false;
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
            } else {
                if (viewVisibility == View.VISIBLE) {
                    // Try again
                    this.scheduleTraversals();
                }
            }

            this.mIsInTraversal = false;
        }

        private performLayout(lp:ViewGroup.LayoutParams, desiredWindowWidth:number, desiredWindowHeight:number) {
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
                // requestLayout() was called during layout.
                // If no layout-request flags are set on the requesting views, there is no problem.
                // If some requests are still pending, then we need to clear those flags and do
                // a full request/measure/layout pass to handle this situation.
                let validLayoutRequesters = this.getValidLayoutRequesters(this.mLayoutRequesters, false);
                if (validLayoutRequesters != null) {
                    // Set this flag to indicate that any further requests are happening during
                    // the second pass, which may result in posting those requests to the next
                    // frame instead
                    this.mHandlingLayoutInLayoutRequest = true;

                    // Process fresh layout requests, then measure and layout
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

                    // Check the valid requests again, this time without checking/clearing the
                    // layout flags, since requests happening during the second pass get noop'd
                    validLayoutRequesters = this.getValidLayoutRequesters(this.mLayoutRequesters, true);
                    if (validLayoutRequesters != null) {
                        let finalRequesters = validLayoutRequesters;
                        // Post second-pass requests to the next frame
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

        private getValidLayoutRequesters(layoutRequesters:Array<View>, secondLayoutRequests:boolean) {
            let numViewsRequestingLayout = layoutRequesters.length;
            let validLayoutRequesters:Array<View> = null;
            for (let i = 0; i < numViewsRequestingLayout; ++i) {
                let view = layoutRequesters[i];
                if (view != null && view.mAttachInfo != null && view.mParent != null &&
                    (secondLayoutRequests || (view.mPrivateFlags & View.PFLAG_FORCE_LAYOUT) ==
                    View.PFLAG_FORCE_LAYOUT)) {
                    let gone = false;
                    let parent:View = view;
                    // Only trigger new requests for views in a non-GONE hierarchy
                    while (parent != null) {
                        if ((parent.mViewFlags & View.VISIBILITY_MASK) == View.GONE) {
                            gone = true;
                            break;
                        }
                        if (parent.mParent instanceof View) {
                            parent = <View><any>parent.mParent;
                        } else {
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
                // If we're checking the layout flags, then we need to clean them up also
                for (let i = 0; i < numViewsRequestingLayout; ++i) {
                    let view = layoutRequesters[i];
                    while (view != null &&
                    (view.mPrivateFlags & View.PFLAG_FORCE_LAYOUT) != 0) {
                        view.mPrivateFlags &= ~View.PFLAG_FORCE_LAYOUT;
                        if (view.mParent instanceof View) {
                            view = <View><any>view.mParent;
                        } else {
                            view = null;
                        }
                    }
                }
            }
            layoutRequesters.splice(0, layoutRequesters.length);
            return validLayoutRequesters;
        }

        private performMeasure(childWidthMeasureSpec:number, childHeightMeasureSpec:number) {
            this.mView.measure(childWidthMeasureSpec, childHeightMeasureSpec);
        }

        isInLayout() {
            return this.mInLayout;
        }

        requestLayoutDuringLayout(view:View) {
            if (view.mParent == null || view.mAttachInfo == null) {
                // Would not normally trigger another layout, so just let it pass through as usual
                return true;
            }
            if (this.mLayoutRequesters.indexOf(view) === -1) {
                this.mLayoutRequesters.push(view);
            }
            if (!this.mHandlingLayoutInLayoutRequest) {
                // Let the request proceed normally; it will be processed in a second layout pass
                // if necessary
                return true;
            } else {
                // Don't let the request proceed during the second layout pass.
                // It will post to the next frame instead.
                return false;
            }
        }

        trackFPS() {
            // Tracks frames per second drawn. First value in a series of draws may be bogus
            // because it down not account for the intervening idle time
            let nowTime = System.currentTimeMillis();
            if (this.mFpsStartTime < 0) {
                this.mFpsStartTime = this.mFpsPrevTime = nowTime;
                this.mFpsNumFrames = 0;
            } else {
                this.mFpsNumFrames++;
                //let thisHash = Integer.toHexString(System.identityHashCode(this));
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

        private performDraw() {
            let fullRedrawNeeded = this.mFullRedrawNeeded;
            this.mFullRedrawNeeded = false;
            this.mIsDrawing = true;
            try {
                this.draw(fullRedrawNeeded);
            } finally {
                this.mIsDrawing = false;
            }
        }

        private draw(fullRedrawNeeded:boolean) {

            if (ViewRootImpl.DEBUG_FPS) {
                this.trackFPS();
            }


            let attachInfo = this.mAttachInfo;
            if (attachInfo.mViewScrollChanged) {
                attachInfo.mViewScrollChanged = false;
                attachInfo.mTreeObserver.dispatchOnScrollChanged();
            }

            if (fullRedrawNeeded) {
                //attachInfo.mIgnoreDirtyState = true;
                this.mDirty.set(0, 0, this.mWidth, this.mHeight);
            }

            if (ViewRootImpl.DEBUG_ORIENTATION || ViewRootImpl.DEBUG_DRAW) {
                Log.v(ViewRootImpl.TAG, "Draw " + this.mView + ", width=" + this.mWidth + ", height=" + this.mHeight);
            }

            attachInfo.mTreeObserver.dispatchOnDraw();

            this.drawSoftware();
        }

        private drawSoftware(){
            let canvas = this.mSurface.lockCanvas(this.mDirty);
            this.mDirty.setEmpty();
            let attachInfo = this.mAttachInfo;

            attachInfo.mDrawingTime = SystemClock.uptimeMillis();
            this.mView.mPrivateFlags |= View.PFLAG_DRAWN;

            this.mView.draw(canvas);


            this.mSurface.unlockCanvasAndPost(canvas);

            if (ViewRootImpl.LOCAL_LOGV) {
                Log.v(ViewRootImpl.TAG, "Surface unlockCanvasAndPost");
            }
        }

        isLayoutRequested():boolean {
            return this.mLayoutRequested;
        }

        getParent():ViewParent {
            return null;
        }

        requestLayout() {
            if (!this.mHandlingLayoutInLayoutRequest) {
                this.mLayoutRequested = true;
                this.scheduleTraversals();
            }
        }

        invalidateChild(child:View, r:Rect) {
        }

        invalidateChildInParent(location:Array<number>, r:Rect):ViewParent {
            return undefined;
        }

        requestChildFocus(child:View, focused:View) {
        }

        clearChildFocus(child:View) {
        }

        getChildVisibleRect(child:View, r:Rect, offset:Point):boolean {
            return undefined;
        }

        focusSearch(v:View, direction:number):View {
            return undefined;
        }

        bringChildToFront(child:View) {
        }

        focusableViewAvailable(v:View) {
        }

        childDrawableStateChanged(child:View) {
        }

        requestDisallowInterceptTouchEvent(disallowIntercept:boolean) {
        }

        childHasTransientStateChanged(child:View, hasTransientState:boolean) {
        }


        private static RunQueueInstance:ViewRootImpl.RunQueue;
        private mRunQueue:ViewRootImpl.RunQueue;

        static getRunQueue(viewRoot?:ViewRootImpl):ViewRootImpl.RunQueue {
            if (viewRoot) {
                if (!viewRoot.mRunQueue) viewRoot.mRunQueue = new ViewRootImpl.RunQueue();
                return viewRoot.mRunQueue;

            } else {
                if (!this.RunQueueInstance) {
                    this.RunQueueInstance = new RunQueueForNoViewRoot();
                }
                return this.RunQueueInstance;
            }
        }

    }

    export module ViewRootImpl {
        interface HandlerAction {
            action:Runnable;
            delay:number;
        }
        export class RunQueue {
            mActions:Array<HandlerAction> = [];

            post(action:Runnable) {
                this.postDelayed(action, 0);
            }

            postDelayed(action:Runnable, delayMillis:number) {
                let handlerAction:HandlerAction = {
                    action: action,
                    delay: delayMillis
                };
                this.mActions.push(handlerAction);

            }

            removeCallbacks(action:Runnable) {
                this.mActions = this.mActions.filter((item)=> {
                    return item.action == action;
                });
            }

            executeActions(handler:Handler) {
                for (let handlerAction of this.mActions) {
                    handler.postDelayed(handlerAction.action, handlerAction.delay);
                }
                this.mActions = [];
            }

        }
    }

    class RunQueueForNoViewRoot extends ViewRootImpl.RunQueue {
        private static Handler = new Handler();

        postDelayed(action:Runnable, delayMillis:number) {
            RunQueueForNoViewRoot.Handler.postDelayed(action, delayMillis);
        }

        removeCallbacks(action:Runnable) {
            RunQueueForNoViewRoot.Handler.removeCallbacks(action);
        }
    }

    class TraversalRunnable implements Runnable {
        ViewRootImpl_this:ViewRootImpl;

        constructor(impl:ViewRootImpl) {
            this.ViewRootImpl_this = impl;
        }

        run() {
            this.ViewRootImpl_this.doTraversal();
        }
    }
}
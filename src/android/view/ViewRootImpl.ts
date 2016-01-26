/**
 * Created by linfaxin on 15/10/5.
 */
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
///<reference path="../../androidui/AndroidUIElement.ts"/>
module android.view {
    import ViewParent = android.view.ViewParent;
    import View = android.view.View;
    import Resources = android.content.res.Resources;
    import Rect = android.graphics.Rect;
    import Point = android.graphics.Point;
    import Canvas = android.graphics.Canvas;
    import Handler = android.os.Handler;
    import Message = android.os.Message;
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

        static ContinueEventToDom = Symbol();

        private mView:View;
        private androidUIElement : androidui.AndroidUIElement;
        private mViewVisibility = View.GONE;
        private mStopped = false;
        private mWidth:number = -1;
        private mHeight:number = -1;
        private mDirty = new Rect();
        private mIsAnimating = false;
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
        private mAddedTouchMode:boolean = false;
        private mInTouchMode:boolean = false;
        private mWinFrame = new Rect();//Root Element Bound
        private mInLayout:boolean;
        private mLayoutRequesters : Array<View> = [];
        private mHandlingLayoutInLayoutRequest:boolean;
        private mRemoved:boolean;
        private mHandler = new ViewRootHandler();
        private mViewScrollChanged = false;
        private mTreeObserver = new ViewTreeObserver();
        private mIgnoreDirtyState = false;
        private mSetIgnoreDirtyState = false;
        private mDrawingTime = 0;

        private mFirstInputStage:InputStage;
        //private mFirstPostImeInputStage:InputStage;


        // Variables to track frames per second, enabled via DEBUG_FPS flag
        private mFpsStartTime = -1;
        private mFpsPrevTime = -1;
        private mFpsNumFrames = 0;

        private mSurface : Surface;

        constructor() {
        }

        initSurface(canvasElement:HTMLCanvasElement){
            this.mSurface = new Surface(canvasElement, this);
        }

        notifyResized(frame:Rect){
            this.mWinFrame.set(frame.left, frame.top, frame.right, frame.bottom);
            this.requestLayout();
            if(this.mSurface) this.mSurface.notifyBoundChange();
        }

        setView(view:View) {
            if (this.mView == null) {
                this.mView = view;

                //this.mAttachInfo.mRootView = view;
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
                this.mAddedTouchMode = true;

                let syntheticInputStage = new SyntheticInputStage(this);
                let viewPostImeStage = new ViewPostImeInputStage(this, syntheticInputStage);
                let earlyPostImeStage = new EarlyPostImeInputStage(this, viewPostImeStage);
                this.mFirstInputStage = earlyPostImeStage;
            }
        }

        getView():View {
            return this.mView;
        }

        getHostVisibility():number {
            return this.mView.getVisibility();
        }

        private mTraversalRunnable:TraversalRunnable = new TraversalRunnable(this);

        private scheduleTraversals() {
            if (!this.mTraversalScheduled) {
                this.mTraversalScheduled = true;
                this.mHandler.postAsTraversal(this.mTraversalRunnable);

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

            //let attachInfo = this.mAttachInfo;

            let viewVisibility = this.getHostVisibility();
            let viewVisibilityChanged = this.mViewVisibility != viewVisibility;// || mNewSurfaceNeeded;

            let params:ViewGroup.LayoutParams = null;

            let frame = this.mWinFrame;
            desiredWindowWidth = frame.width();
            desiredWindowHeight = frame.height();
            if (this.mFirst) {
                this.mFullRedrawNeeded = true;
                this.mLayoutRequested = true;

                //let packageMetrics = Resources.getDisplayMetrics();
                //desiredWindowWidth = packageMetrics.widthPixels;
                //desiredWindowHeight = packageMetrics.heightPixels;

                //attachInfo.mHasWindowFocus = true;
                //attachInfo.mWindowVisibility = viewVisibility;
                viewVisibilityChanged = false;
                //mLastConfiguration.setTo(host.getResources().getConfiguration());
                // Set the layout direction if it has not been set before (inherit is the default)
                //if (mViewLayoutDirectionInitial == View.LAYOUT_DIRECTION_INHERIT) {
                //    host.setLayoutDirection(mLastConfiguration.getLayoutDirection());
                //}
                //host.dispatchAttachedToWindow(attachInfo, 0);
                //attachInfo.mTreeObserver.dispatchOnWindowAttachedChange(true);
                //mFitSystemWindowsInsets.set(mAttachInfo.mContentInsets);
                //host.fitSystemWindows(mFitSystemWindowsInsets);
                //Log.i(TAG, "Screen on initialized: " + attachInfo.mKeepScreenOn);

            } else {
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
                //attachInfo.mWindowVisibility = viewVisibility;
                //host.dispatchWindowVisibilityChanged(viewVisibility);

                //if (viewVisibility == View.GONE) {
                    // After making a window gone, we will count it as being
                    // shown for the first time the next time it gets focus.
                    //mHasHadWindowFocus = false;
                //}
            }

            // Execute enqueued actions on every traversal in case a detached view enqueued an action
            ViewRootImpl.getRunQueue(this).executeActions(this.mHandler);

            let layoutRequested = this.mLayoutRequested;
            if (layoutRequested) {

                if (this.mFirst) {
                    // make sure touch mode code executes by setting cached value
                    // to opposite of the added touch mode.
                    this.mInTouchMode = !this.mAddedTouchMode;
                    this.ensureTouchModeLocally(this.mAddedTouchMode);

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
                    if (lp.width < 0 || lp.height < 0) {
                        windowSizeMayChange = true;

                        //let packageMetrics = Resources.getDisplayMetrics();
                        //desiredWindowWidth = packageMetrics.widthPixels;
                        //desiredWindowHeight = packageMetrics.heightPixels;
                    }
                }

                // Ask host how big it wants to be
                windowSizeMayChange ==  this.measureHierarchy(host, lp,
                    desiredWindowWidth, desiredWindowHeight) || windowSizeMayChange;
            }

            //if (this.mFirst || attachInfo.mViewVisibilityChanged) {
            //    attachInfo.mViewVisibilityChanged = false;
            //}

            if (layoutRequested) {
                // Clear this now, so that if anything requests a layout in the
                // rest of this function we will catch it and re-run a full
                // layout pass.
                this.mLayoutRequested = false;
            }

            let windowShouldResize = layoutRequested && windowSizeMayChange
                && ((this.mWidth != host.getMeasuredWidth() || this.mHeight != host.getMeasuredHeight())
                || (lp.width < 0 && frame.width() !== desiredWindowWidth && frame.width() !== this.mWidth)
                || (lp.height < 0 && frame.height() !== desiredWindowHeight && frame.height() !== this.mHeight));

            if (this.mFirst || windowShouldResize || viewVisibilityChanged) {

                if (ViewRootImpl.DEBUG_LAYOUT) {
                    Log.i(ViewRootImpl.TAG, "host=w:" + host.getMeasuredWidth() + ", h:" +
                        host.getMeasuredHeight() + ", params=" + params);
                }

                //if (ViewRootImpl.DEBUG_LAYOUT) Log.v(ViewRootImpl.TAG, "relayout: frame=" + frame.toShortString());

                if (ViewRootImpl.DEBUG_ORIENTATION) Log.v(ViewRootImpl.TAG, "Relayout returned: frame=" + frame);

                //attachInfo.mWindowLeft = frame.left;
                //attachInfo.mWindowTop = frame.top;

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
            }else{
                //const windowMoved = (attachInfo.mWindowLeft != frame.left
                //|| attachInfo.mWindowTop != frame.top);
                //if (windowMoved) {
                //    attachInfo.mWindowLeft = frame.left;
                //    attachInfo.mWindowTop = frame.top;
                //}
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
                this.mTreeObserver.dispatchOnGlobalLayout();
            }

            let skipDraw = false;

            if (this.mFirst) {
                // handle first focus request
                if (ViewRootImpl.DEBUG_INPUT_RESIZE) Log.v(ViewRootImpl.TAG, "First: mView.hasFocus()="
                    + this.mView.hasFocus());
                if (this.mView != null) {
                    if (!this.mView.hasFocus()) {
                        this.mView.requestFocus(View.FOCUS_FORWARD);
                        if (ViewRootImpl.DEBUG_INPUT_RESIZE) Log.v(ViewRootImpl.TAG, "First: requested focused view="
                            + this.mView.findFocus());
                    } else {
                        if (ViewRootImpl.DEBUG_INPUT_RESIZE) Log.v(ViewRootImpl.TAG, "First: existing focused view="
                            + this.mView.findFocus());
                    }
                }
//            if ((relayoutResult & WindowManagerGlobal.RELAYOUT_RES_ANIMATING) != 0) {
//                // The first time we relayout the window, if the system is
//                // doing window animations, we want to hold of on any future
//                // draws until the animation is done.
//                mWindowsAnimating = true;
//            }
            }
            //else if (mWindowsAnimating) {
            //    skipDraw = true;
            //}

            this.mFirst = false;
            this.mWillDrawSoon = false;
            this.mViewVisibility = viewVisibility;

            let cancelDraw = this.mTreeObserver.dispatchOnPreDraw() ||
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

            this.checkContinueTraversalsNextFrame();
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

        private _showFPSNode:HTMLElement;
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
                //Log.v(ViewRootImpl.TAG, "Frame time:\t" + frameTime);
                this.mFpsPrevTime = nowTime;
                if (totalTime > 1000) {
                    let fps = this.mFpsNumFrames * 1000 / totalTime;
                    Log.v(ViewRootImpl.TAG, "FPS:\t" + fps);
                    if(!this._showFPSNode){
                        this._showFPSNode = document.createElement('div');
                        this._showFPSNode.style.position = 'absolute';
                        this._showFPSNode.style.top = '0';
                        this._showFPSNode.style.left = '0';
                        this._showFPSNode.style.width = '60px';
                        this._showFPSNode.style.fontSize = '14px';
                        this._showFPSNode.style.background = 'black';
                        this._showFPSNode.style.color = 'white';
                        this._showFPSNode.style.opacity = '0.7';
                        this.androidUIElement.appendChild(this._showFPSNode);
                    }
                    this._showFPSNode.innerText = 'FPS:'+fps.toFixed(1);

                    this.mFpsStartTime = nowTime;
                    this.mFpsNumFrames = 0;
                }
            }
        }

        private performDraw() {
            let fullRedrawNeeded = this.mFullRedrawNeeded || !this.mSurface.mSupportDirtyDraw;
            this.mFullRedrawNeeded = false;
            this.mIsDrawing = true;
            try {
                this.draw(fullRedrawNeeded);
            } finally {
                this.mIsDrawing = false;
            }
        }

        private draw(fullRedrawNeeded:boolean) {
            let surface = this.mSurface;
            if (!surface.isValid()) {
                return;
            }

            if (ViewRootImpl.DEBUG_FPS) {
                this.trackFPS();
            }


            if (this.mViewScrollChanged) {
                this.mViewScrollChanged = false;
                this.mTreeObserver.dispatchOnScrollChanged();
            }

            if (fullRedrawNeeded) {
                this.mIgnoreDirtyState = true;
                this.mDirty.set(0, 0, this.mWidth, this.mHeight);
            }

            if (ViewRootImpl.DEBUG_ORIENTATION || ViewRootImpl.DEBUG_DRAW) {
                Log.v(ViewRootImpl.TAG, "Draw " + this.mView + ", width=" + this.mWidth + ", height=" + this.mHeight + ", dirty="+this.mDirty);
            }

            this.mTreeObserver.dispatchOnDraw();

            this.drawSoftware();

        }

        private drawSoftware(){
            let canvas;
            try {
                canvas = this.mSurface.lockCanvas(this.mDirty);
                if(!canvas) return;//not ready
            } catch (e) {
                //native surface not ready. wait ready callback
                return;
            }
            this.mDirty.setEmpty();
            this.mIsAnimating = false;
            //let attachInfo = this.mAttachInfo;

            this.mDrawingTime = SystemClock.uptimeMillis();
            this.mView.mPrivateFlags |= View.PFLAG_DRAWN;

            this.mSetIgnoreDirtyState = false;

            this.mView.draw(canvas);


            if (!this.mSetIgnoreDirtyState) {
                // Only clear the flag if it was not set during the mView.draw() call
                this.mIgnoreDirtyState = false;
            }

            this.mSurface.unlockCanvasAndPost(canvas);

            if (ViewRootImpl.LOCAL_LOGV) {
                Log.v(ViewRootImpl.TAG, "Surface unlockCanvasAndPost");
            }
        }

        private _continueTraversalesCount = 0;
        private checkContinueTraversalsNextFrame(){
            //AndroidUI add:
            //Because of some reason, sometime will skip a frame to traversals when scroll.
            //Let's continuing traversales next frame.

            const continueFrame = ViewRootImpl.DEBUG_FPS ? 60 : 5;
            if (!this.mTraversalScheduled && this._continueTraversalesCount < continueFrame) {
                this._continueTraversalesCount++;
                this.scheduleTraversals();
            }else{
                this._continueTraversalesCount = 0;
            }
        }

        isLayoutRequested():boolean {
            return this.mLayoutRequested;
        }


        private mInvalidateOnAnimationRunnable = new InvalidateOnAnimationRunnable(this.mHandler);

        dispatchInvalidateDelayed(view:View, delayMilliseconds:number):void {
            let msg = this.mHandler.obtainMessage(ViewRootHandler.MSG_INVALIDATE, view);
            this.mHandler.sendMessageDelayed(msg, delayMilliseconds);
        }

        dispatchInvalidateRectDelayed(info:View.AttachInfo.InvalidateInfo, delayMilliseconds:number):void {
            let msg = this.mHandler.obtainMessage(ViewRootHandler.MSG_INVALIDATE_RECT, info);
            this.mHandler.sendMessageDelayed(msg, delayMilliseconds);
        }

        dispatchInvalidateOnAnimation(view:View):void {
            this.mInvalidateOnAnimationRunnable.addView(view);
        }
        dispatchInvalidateRectOnAnimation(info:View.AttachInfo.InvalidateInfo):void{
            this.mInvalidateOnAnimationRunnable.addViewRect(info);
        }
        cancelInvalidate(view:View){
            this.mHandler.removeMessages(ViewRootHandler.MSG_INVALIDATE, view);
            // fixme: might leak the AttachInfo.InvalidateInfo objects instead of returning
            // them to the pool
            this.mHandler.removeMessages(ViewRootHandler.MSG_INVALIDATE_RECT, view);
            this.mInvalidateOnAnimationRunnable.removeView(view);
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

        invalidate() {
            this.mDirty.set(0, 0, this.mWidth, this.mHeight);
            this.scheduleTraversals();
        }
        invalidateWorld(view:View) {
            view.invalidate();
            if (view instanceof ViewGroup) {
                let parent = <ViewGroup>view;
                for (let i = 0; i < parent.getChildCount(); i++) {
                    this.invalidateWorld(parent.getChildAt(i));
                }
            }
        }

        invalidateChild(child:View, dirty:Rect) {
            this.invalidateChildInParent(null, dirty);
        }

        invalidateChildInParent(location:Array<number>, dirty:Rect):ViewParent {
            if (ViewRootImpl.DEBUG_DRAW) Log.v(ViewRootImpl.TAG, "Invalidate child: " + dirty);

            if (dirty == null) {
                this.invalidate();
                return null;
            } else if (dirty.isEmpty() && !this.mIsAnimating) {
                return null;
            }

            //if (mCurScrollY != 0) {//no need
            //    mTempRect.set(dirty);
            //    dirty = mTempRect;
            //    if (mCurScrollY != 0) {
            //        dirty.offset(0, -mCurScrollY);
            //    }
            //}

            const localDirty = this.mDirty;
            if (!localDirty.isEmpty() && !localDirty.contains(dirty)) {
                this.mSetIgnoreDirtyState = true;
                this.mIgnoreDirtyState = true;
            }

            // Add the new dirty rect to the current one
            localDirty.union(dirty.left, dirty.top, dirty.right, dirty.bottom);
            // Intersect with the bounds of the window to skip
            // updates that lie outside of the visible region
            const intersected = localDirty.intersect(0, 0, this.mWidth, this.mHeight);
            if (!intersected) {
                localDirty.setEmpty();
            }
            if (!this.mWillDrawSoon && (intersected || this.mIsAnimating)) {
                this.scheduleTraversals();
            }

            return null;
        }

        requestChildFocus(child:View, focused:View) {
            if (ViewRootImpl.DEBUG_INPUT_RESIZE) {
                Log.v(ViewRootImpl.TAG, "Request child focus: focus now " + focused);
            }
            //checkThread();
            this.scheduleTraversals();
        }

        clearChildFocus(focused:View) {
            if (ViewRootImpl.DEBUG_INPUT_RESIZE) {
                Log.v(ViewRootImpl.TAG, "Request child focus: focus now " + focused);
            }
            //checkThread();
            this.scheduleTraversals();
        }

        getChildVisibleRect(child:View, r:Rect, offset:Point):boolean {
            if (child != this.mView) {
                throw new Error("child is not mine, honest!");
            }
            // Note: don't apply scroll offset, because we want to know its
            // visibility in the virtual canvas being given to the view hierarchy.
            return r.intersect(0, 0, this.mWidth, this.mHeight);
        }

        focusSearch(focused:View, direction:number):View {
            if (!(this.mView instanceof ViewGroup)) {
                return null;
            }
            return FocusFinder.getInstance().findNextFocus(<ViewGroup>this.mView, focused, direction);
        }

        bringChildToFront(child:View) {
            //nothing
        }

        focusableViewAvailable(v:View) {
            if (this.mView != null) {
                if (!this.mView.hasFocus()) {
                    v.requestFocus();
                } else {
                    // the one case where will transfer focus away from the current one
                    // is if the current view is a view group that prefers to give focus
                    // to its children first AND the view is a descendant of it.
                    let focused = this.mView.findFocus();
                    if (focused instanceof ViewGroup) {
                        let group = <ViewGroup>focused;
                        if (group.getDescendantFocusability() == ViewGroup.FOCUS_AFTER_DESCENDANTS
                            && ViewRootImpl.isViewDescendantOf(v, focused)) {
                            v.requestFocus();
                        }
                    }
                }
            }
        }
        static isViewDescendantOf(child:View, parent:View) {
            if (child == parent) {
                return true;
            }

            const theParent = child.getParent();
            return (theParent instanceof ViewGroup) && ViewRootImpl.isViewDescendantOf(<View>theParent, parent);
        }

        childDrawableStateChanged(child:View) {
            //nothing
        }

        requestDisallowInterceptTouchEvent(disallowIntercept:boolean) {
            // ViewAncestor never intercepts touch event, so this can be a no-op
        }

        requestChildRectangleOnScreen(child:View, rectangle:Rect, immediate:boolean):boolean{
            //TODO should scroll window
            //final boolean scrolled = scrollToRectOrFocus(rectangle, immediate);
            //if (rectangle != null) {
            //    mTempRect.set(rectangle);
            //    mTempRect.offset(0, -mCurScrollY);
            //    mTempRect.offset(mAttachInfo.mWindowLeft, mAttachInfo.mWindowTop);
            //}
            //return scrolled;
            return false;
        }

        childHasTransientStateChanged(child:View, hasTransientState:boolean) {
            // Do nothing.
        }

        dispatchInputEvent(event:MotionEvent|KeyEvent|Event):boolean {
            this.deliverInputEvent(event);
            let result = event[InputStage.FLAG_FINISHED_HANDLED];
            event[InputStage.FLAG_FINISHED] = false;
            event[InputStage.FLAG_FINISHED_HANDLED] = false;

            let continueToDom = event[ViewRootImpl.ContinueEventToDom];
            event[ViewRootImpl.ContinueEventToDom] = null;
            return result && !continueToDom;
            //let view = this.mView;
            //let isTouchEvent = event instanceof MotionEvent && event.isTouchEvent();
            //let disallowIntercept = view instanceof ViewGroup ? (view.mGroupFlags & ViewGroup.FLAG_DISALLOW_INTERCEPT) != 0 : false;
            //return result && (!isTouchEvent || disallowIntercept);
        }
        private deliverInputEvent(event) {
            this.mFirstInputStage.deliver(event);
        }
        private finishInputEvent(event){
            //event[InputStage.FLAG_FINISHED] = false;
            //event[InputStage.FLAG_FINISHED_HANDLED] = false;
        }

        private checkForLeavingTouchModeAndConsume(event:KeyEvent) {
            // Only relevant in touch mode.
            if (!this.mInTouchMode) {
                return false;
            }

            // Only consider leaving touch mode on DOWN or MULTIPLE actions, never on UP.
            const action = event.getAction();
            if (action != KeyEvent.ACTION_DOWN
                //&& action != KeyEvent.ACTION_MULTIPLE
            ) {
                return false;
            }

            // Don't leave touch mode if the IME told us not to.
            //if ((event.getFlags() & KeyEvent.FLAG_KEEP_TOUCH_MODE) != 0) {
            //    return false;
            //}

            // If the key can be used for keyboard navigation then leave touch mode
            // and select a focused view if needed (in ensureTouchMode).
            // When a new focused view is selected, we consume the navigation key because
            // navigation doesn't make much sense unless a view already has focus so
            // the key's purpose is to set focus.
            if (ViewRootImpl.isNavigationKey(event)) {
                return this.ensureTouchMode(false);
            }

            // If the key can be used for typing then leave touch mode
            // and select a focused view if needed (in ensureTouchMode).
            // Always allow the view to process the typing key.
            if (ViewRootImpl.isTypingKey(event)) {
                this.ensureTouchMode(false);
                return false;
            }

            return false;
        }
        private static isNavigationKey(keyEvent:KeyEvent):boolean {
            switch (keyEvent.getKeyCode()) {
                case KeyEvent.KEYCODE_DPAD_LEFT:
                case KeyEvent.KEYCODE_DPAD_RIGHT:
                case KeyEvent.KEYCODE_DPAD_UP:
                case KeyEvent.KEYCODE_DPAD_DOWN:
                case KeyEvent.KEYCODE_DPAD_CENTER:
                case KeyEvent.KEYCODE_PAGE_UP:
                case KeyEvent.KEYCODE_PAGE_DOWN:
                case KeyEvent.KEYCODE_MOVE_HOME:
                case KeyEvent.KEYCODE_MOVE_END:
                case KeyEvent.KEYCODE_TAB:
                case KeyEvent.KEYCODE_SPACE:
                case KeyEvent.KEYCODE_ENTER:
                    return true;
            }
            return false;
        }
        private static isTypingKey(keyEvent:KeyEvent):boolean {
            try {
                return keyEvent.mIsTypingKey;
            } catch (e) {
                console.warn(e);
            }
            return true;
        }
        ensureTouchMode(inTouchMode:boolean):boolean {
            if (ViewRootImpl.DBG) Log.d("touchmode", "ensureTouchMode(" + inTouchMode + "), current "
                + "touch mode is " + this.mInTouchMode);
            if (this.mInTouchMode == inTouchMode) return false;

            // tell the window manager
            //try {
            //    if (!this.isInLocalFocusMode()) {
            //        mWindowSession.setInTouchMode(inTouchMode);
            //    }
            //} catch (RemoteException e) {
            //    throw new RuntimeException(e);
            //}

            // handle the change
            return this.ensureTouchModeLocally(inTouchMode);
        }

        ensureTouchModeLocally(inTouchMode:boolean):boolean {
            if (ViewRootImpl.DBG) Log.d("touchmode", "ensureTouchModeLocally(" + inTouchMode + "), current "
                + "touch mode is " + this.mInTouchMode);

            if (this.mInTouchMode == inTouchMode) return false;

            this.mInTouchMode = inTouchMode;
            this.mTreeObserver.dispatchOnTouchModeChanged(inTouchMode);

            return (inTouchMode) ? this.enterTouchMode() : this.leaveTouchMode();
        }
        private enterTouchMode():boolean {
            if (this.mView != null && this.mView.hasFocus()) {
                // note: not relying on mFocusedView here because this could
                // be when the window is first being added, and mFocused isn't
                // set yet.
                const focused = this.mView.findFocus();
                if (focused != null && !focused.isFocusableInTouchMode()) {
                    const ancestorToTakeFocus = ViewRootImpl.findAncestorToTakeFocusInTouchMode(focused);
                    if (ancestorToTakeFocus != null) {
                        // there is an ancestor that wants focus after its
                        // descendants that is focusable in touch mode.. give it
                        // focus
                        return ancestorToTakeFocus.requestFocus();
                    } else {
                        // There's nothing to focus. Clear and propagate through the
                        // hierarchy, but don't attempt to place new focus.
                        focused.clearFocusInternal(true, false);
                        return true;
                    }
                }
            }
            return false;
        }
        private static findAncestorToTakeFocusInTouchMode(focused:View):ViewGroup {
            let parent = focused.getParent();
            while (parent instanceof ViewGroup) {
                const vgParent = <ViewGroup>parent;
                if (vgParent.getDescendantFocusability() == ViewGroup.FOCUS_AFTER_DESCENDANTS
                    && vgParent.isFocusableInTouchMode()) {
                    return vgParent;
                }
                if (vgParent.isRootNamespace()) {
                    return null;
                } else {
                    parent = vgParent.getParent();
                }
            }
            return null;
        }
        private leaveTouchMode():boolean {
            if (this.mView != null) {
                if (this.mView.hasFocus()) {
                    let focusedView = this.mView.findFocus();
                    if (!(focusedView instanceof ViewGroup)) {
                        // some view has focus, let it keep it
                        return false;
                    } else if ((<ViewGroup>focusedView).getDescendantFocusability() !=
                    ViewGroup.FOCUS_AFTER_DESCENDANTS) {
                        // some view group has focus, and doesn't prefer its children
                        // over itself for focus, so let them keep it.
                        return false;
                    }
                }

                // find the best view to give focus to in this brave new non-touch-mode
                // world
                const focused = this.focusSearch(null, View.FOCUS_DOWN);
                if (focused != null) {
                    return focused.requestFocus(View.FOCUS_DOWN);
                }
            }
            return false;
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
            private mActions:Array<HandlerAction> = [];

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

    class InvalidateOnAnimationRunnable implements Runnable {
        mHandler:Handler;
        mPosted = false;
        mViews = new Set<View>();
        mViewRects = new Map<View, View.AttachInfo.InvalidateInfo>();

        constructor(handler:Handler) {
            this.mHandler = handler;
        }

        addView(view:View){
            this.mViews.add(view);
            this.postIfNeededLocked();
        }
        addViewRect(info:View.AttachInfo.InvalidateInfo){
            this.mViewRects.set(info.target, info);
            this.postIfNeededLocked();
        }
        removeView(view:View){
            this.mViews.delete(view);
            this.mViewRects.delete(view);

            if (this.mPosted && this.mViews.size===0 && this.mViewRects.size===0) {
                this.mHandler.removeCallbacks(this);
                this.mPosted = false;
            }
        }
        run() {
            this.mPosted = false;

            for(let view of this.mViews){
                view.invalidate();
            }
            this.mViews.clear();

            for(let info of this.mViewRects.values()){
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

    class ViewRootHandler extends Handler{
        static MSG_INVALIDATE = 1;
        static MSG_INVALIDATE_RECT = 2;


        handleMessage(msg:Message):void {
            switch (msg.what) {
                case ViewRootHandler.MSG_INVALIDATE:
                    (<View>msg.obj).invalidate();
                    break;
                case ViewRootHandler.MSG_INVALIDATE_RECT:
                    const info = <View.AttachInfo.InvalidateInfo> msg.obj;
                    info.target.invalidate(info.left, info.top, info.right, info.bottom);
                    info.recycle();
                    break;
            }
        }
    }


    class InputStage {
        static FLAG_FINISHED = Symbol();
        static FLAG_FINISHED_HANDLED = Symbol();
        static FORWARD = 0;
        static FINISH_HANDLED = 1;
        static FINISH_NOT_HANDLED = 2;

        mNext:InputStage;

        ViewRootImpl_this:ViewRootImpl;
        constructor(impl:ViewRootImpl, next?:InputStage){
            this.ViewRootImpl_this = impl;
            this.mNext = next;
        }
        deliver(event) {
            if (event[InputStage.FLAG_FINISHED]) {
                this.forward(event);
            } else if (this.shouldDropInputEvent(event)) {
                this.finish(event, false);
            } else {
                this.apply(event, this.onProcess(event));
            }
        }
        finish(event, handled:boolean) {
            event[InputStage.FLAG_FINISHED] = true;
            if(handled){
                event[InputStage.FLAG_FINISHED_HANDLED] = true;
            }
            this.forward(event);
        }
        forward(event) {
            this.onDeliverToNext(event);
        }
        apply(event, result:number) {
            if (result == InputStage.FORWARD) {
                this.forward(event);
            } else if (result == InputStage.FINISH_HANDLED) {
                this.finish(event, true);
            } else if (result == InputStage.FINISH_NOT_HANDLED) {
                this.finish(event, false);
            } else {
                throw new Error("Invalid result: " + result);
            }
        }
        onDeliverToNext(event) {
            if (this.mNext != null) {
                this.mNext.deliver(event);
            } else {
                (<any>this.ViewRootImpl_this).finishInputEvent(event);
            }
        }

        onProcess(event):number{
            return InputStage.FORWARD;
        }

        shouldDropInputEvent(event){
            if ((<any>this.ViewRootImpl_this).mView == null || !(<any>this.ViewRootImpl_this).mAdded) {
                Log.w(ViewRootImpl.TAG, "Dropping event due to root view being removed: " + event);
                return true;
            }
            //else if ((!this.ViewRootImpl_this.mAttachInfo.mHasWindowFocus ||
            //    (<any>this.ViewRootImpl_this).mStopped)) {
            //
            //    // Drop non-terminal input events.
            //    Log.w(ViewRootImpl.TAG, "Dropping event due to no window focus: " + event);
            //    return true;
            //}
            return false;
        }
    }

    /**
     * handle touch event
     */
    class EarlyPostImeInputStage extends InputStage{
        onProcess(event):number {
            if (event instanceof MotionEvent) {
                return this.processMotionEvent(event);
            } else if (event instanceof KeyEvent) {
                return this.processKeyEvent(event);
            }
            return InputStage.FORWARD;
        }

        private processKeyEvent(event:KeyEvent):number {
            // If the key's purpose is to exit touch mode then we consume it
            // and consider it handled.
            if ((<any>this.ViewRootImpl_this).checkForLeavingTouchModeAndConsume(event)) {
                return InputStage.FINISH_HANDLED;
            }

            // Make sure the fallback event policy sees all keys that will be
            // delivered to the view hierarchy.
            //mFallbackEventHandler.preDispatchKeyEvent(event);
            return InputStage.FORWARD;
        }

        private processMotionEvent(event:MotionEvent):number {
            // Enter touch mode on down or scroll.
            const action = event.getAction();
            if (action == MotionEvent.ACTION_DOWN || action == MotionEvent.ACTION_SCROLL) {
                this.ViewRootImpl_this.ensureTouchMode(true);
            }

            // Offset the window bound
            event.offsetLocation(this.ViewRootImpl_this.mWinFrame.left, this.ViewRootImpl_this.mWinFrame.top);


            // Offset the scroll position.
            //if (mCurScrollY != 0) {
            //    event.offsetLocation(0, mCurScrollY);
            //}

            // Remember the touch position for possible drag-initiation.
            //if (event.isTouchEvent()) {
            //    mLastTouchPoint.x = event.getRawX();
            //    mLastTouchPoint.y = event.getRawY();
            //}
            return InputStage.FORWARD;
        }
    }
    /**
     * handle key event
     */
    class ViewPostImeInputStage extends InputStage{
        onProcess(event):number {
            if (event instanceof KeyEvent) {
                return this.processKeyEvent(event);

            }else if (event instanceof MotionEvent){
                if(event.isTouchEvent()){
                    return this.processTouchEvent(event);
                }else{
                    return this.processGenericMotionEvent(event);
                }
            }
            return InputStage.FORWARD;
        }

        private processKeyEvent(event:KeyEvent):number {
            let mView:View = this.ViewRootImpl_this.mView;
            //if (event.getAction() != KeyEvent.ACTION_UP) {
            //    // If delivering a new key event, make sure the window is
            //    // now allowed to start updating.
            //    this.handleDispatchDoneAnimating();
            //}

            // Deliver the key to the view hierarchy.
            if ((<any>this.ViewRootImpl_this).mView.dispatchKeyEvent(event)) {
                return InputStage.FINISH_HANDLED;
            }

            if (this.shouldDropInputEvent(event)) {
                return InputStage.FINISH_NOT_HANDLED;
            }

            // If the Control modifier is held, try to interpret the key as a shortcut.
            if (event.getAction() == KeyEvent.ACTION_DOWN
                && event.isCtrlPressed()
                && event.getRepeatCount() == 0
                //&& !KeyEvent.isModifierKey(event.getKeyCode())
            ) {
                //if (mView.dispatchKeyShortcutEvent(event)) {
                //    return InputStage.FINISH_HANDLED;
                //}
                if (this.shouldDropInputEvent(event)) {
                    return InputStage.FINISH_NOT_HANDLED;
                }
            }

            // Apply the fallback event policy.
            //if (mFallbackEventHandler.dispatchKeyEvent(event)) {
            //    return FINISH_HANDLED;
            //}
            if (this.shouldDropInputEvent(event)) {
                return InputStage.FINISH_NOT_HANDLED;
            }

            // Handle automatic focus changes.
            if (event.getAction() == KeyEvent.ACTION_DOWN) {
                let direction = 0;
                switch (event.getKeyCode()) {
                    case KeyEvent.KEYCODE_DPAD_LEFT:
                        direction = View.FOCUS_LEFT;
                        break;
                    case KeyEvent.KEYCODE_DPAD_RIGHT:
                        direction = View.FOCUS_RIGHT;
                        break;
                    case KeyEvent.KEYCODE_DPAD_UP:
                        direction = View.FOCUS_UP;
                        break;
                    case KeyEvent.KEYCODE_DPAD_DOWN:
                        direction = View.FOCUS_DOWN;
                        break;
                    case KeyEvent.KEYCODE_TAB:
                        if (event.isShiftPressed()) {
                            direction = View.FOCUS_BACKWARD;
                        } else {
                            direction = View.FOCUS_FORWARD;
                        }
                        break;
                }
                if (direction != 0) {
                    let focused = mView.findFocus();
                    if (focused != null) {
                        let v = focused.focusSearch(direction);
                        if (v != null && v != focused) {
                            // do the math the get the interesting rect
                            // of previous focused into the coord system of
                            // newly focused view
                            focused.getFocusedRect((<any>this.ViewRootImpl_this).mTempRect);
                            if (mView instanceof ViewGroup) {
                                (<ViewGroup>mView).offsetDescendantRectToMyCoords(focused,
                                    (<any>this.ViewRootImpl_this).mTempRect);
                                (<ViewGroup>mView).offsetRectIntoDescendantCoords(v,
                                    (<any>this.ViewRootImpl_this).mTempRect);
                            }
                            if (v.requestFocus(direction, (<any>this.ViewRootImpl_this).mTempRect)) {
                                //playSoundEffect(SoundEffectConstants
                                //    .getContantForFocusDirection(direction));
                                return InputStage.FINISH_HANDLED;
                            }
                        }

                        // Give the focused view a last chance to handle the dpad key.
                        if (mView.dispatchUnhandledMove(focused, direction)) {
                            return InputStage.FINISH_HANDLED;
                        }
                    } else {
                        // find the best view to give focus to in this non-touch-mode with no-focus
                        let v = this.ViewRootImpl_this.focusSearch(null, direction);
                        if (v != null && v.requestFocus(direction)) {
                            return InputStage.FINISH_HANDLED;
                        }
                    }
                }
            }
            return InputStage.FORWARD;
        }

        private processGenericMotionEvent(event:MotionEvent){
            // Deliver the event to the view.
            if ((<any>this.ViewRootImpl_this).mView.dispatchGenericMotionEvent(event)) {
                return InputStage.FINISH_HANDLED;
            }
            return InputStage.FORWARD;
        }

        private processTouchEvent(event:MotionEvent){
            let handled = (<any>this.ViewRootImpl_this).mView.dispatchTouchEvent(event);
            return handled ? InputStage.FINISH_HANDLED : InputStage.FORWARD;
        }

    }

    /**
     * Performs synthesis of new input events from unhandled input events.
     */
    class SyntheticInputStage extends InputStage{
        onProcess(event):number {
            return super.onProcess(event);
        }
    }


}
/**
 * Created by linfaxin on 15/10/5.
 */
///<reference path="ViewRootImpl.ts"/>
///<reference path="View.ts"/>
///<reference path="ViewParent.ts"/>
///<reference path="../graphics/Canvas.ts"/>


module android.view {
    import Canvas = android.graphics.Canvas;

    export class ViewGroup extends View implements ViewParent {
        static FLAG_CLIP_CHILDREN = 0x1;
        static FLAG_CLIP_TO_PADDING = 0x2;
        static FLAG_INVALIDATE_REQUIRED = 0x4;
        static FLAG_RUN_ANIMATION = 0x8;
        static FLAG_ANIMATION_DONE = 0x10;
        static FLAG_PADDING_NOT_NULL = 0x20;
        static FLAG_ANIMATION_CACHE = 0x40;
        static FLAG_OPTIMIZE_INVALIDATE = 0x80;
        static FLAG_CLEAR_TRANSFORMATION = 0x100;
        static FLAG_NOTIFY_ANIMATION_LISTENER = 0x200;
        static FLAG_USE_CHILD_DRAWING_ORDER = 0x400;
        static FLAG_SUPPORT_STATIC_TRANSFORMATIONS = 0x800;
        static FLAG_ALPHA_LOWER_THAN_ONE = 0x1000;
        static FLAG_ADD_STATES_FROM_CHILDREN = 0x2000;
        static FLAG_ALWAYS_DRAWN_WITH_CACHE = 0x4000;
        static FLAG_CHILDREN_DRAWN_WITH_CACHE = 0x8000;
        static FLAG_NOTIFY_CHILDREN_ON_DRAWABLE_STATE_CHANGE = 0x10000;
        static FLAG_MASK_FOCUSABILITY = 0x60000;
        static FOCUS_BEFORE_DESCENDANTS = 0x20000;
        static FOCUS_AFTER_DESCENDANTS = 0x40000;
        static FOCUS_BLOCK_DESCENDANTS = 0x60000;
        static FLAG_DISALLOW_INTERCEPT = 0x80000;
        static FLAG_SPLIT_MOTION_EVENTS = 0x200000;
        static FLAG_PREVENT_DISPATCH_ATTACHED_TO_WINDOW = 0x400000;
        static FLAG_LAYOUT_MODE_WAS_EXPLICITLY_SET = 0x800000;

        static LAYOUT_MODE_UNDEFINED = -1;
        static LAYOUT_MODE_CLIP_BOUNDS = 0;
        //static LAYOUT_MODE_OPTICAL_BOUNDS = 1;
        static LAYOUT_MODE_DEFAULT = ViewGroup.LAYOUT_MODE_CLIP_BOUNDS;
        static CLIP_TO_PADDING_MASK = ViewGroup.FLAG_CLIP_TO_PADDING | ViewGroup.FLAG_PADDING_NOT_NULL;

        mOnHierarchyChangeListener:ViewGroup.OnHierarchyChangeListener;
        mGroupFlags=0;
        mLayoutMode = ViewGroup.LAYOUT_MODE_UNDEFINED;
        mChildren:Array<View> = [];
        get mChildrenCount() {
            return this.mChildren.length;
        }

        constructor() {
            super();
            this.initViewGroup();
        }

        private initViewGroup() {
            // ViewGroup doesn't draw by default
            this.setFlags(View.WILL_NOT_DRAW, View.DRAW_MASK);
            this.mGroupFlags |= ViewGroup.FLAG_CLIP_CHILDREN;
            this.mGroupFlags |= ViewGroup.FLAG_CLIP_TO_PADDING;
            this.mGroupFlags |= ViewGroup.FLAG_ANIMATION_DONE;
            this.mGroupFlags |= ViewGroup.FLAG_ANIMATION_CACHE;
            this.mGroupFlags |= ViewGroup.FLAG_ALWAYS_DRAWN_WITH_CACHE;

            this.mGroupFlags |= ViewGroup.FLAG_SPLIT_MOTION_EVENTS;

            //setDescendantFocusability(FOCUS_BEFORE_DESCENDANTS);

            //this.mPersistentDrawingCache = PERSISTENT_SCROLLING_CACHE;
        }


        addView(view:View);
        addView(view:View, index:number);
        addView(view:View, params:ViewGroup.LayoutParams);
        addView(view:View, index:number, params:ViewGroup.LayoutParams);
        addView(view:View, width:number, height:number);
        addView(...args) {
            let child:View = args[0];
            let params = child.getLayoutParams();
            let index = -1;
            if (args.length == 2) {
                if (args[1] instanceof ViewGroup.LayoutParams) params = args[1];
                else index = args[1];
            } else if (args.length == 3) {
                if (args[2] instanceof ViewGroup.LayoutParams) {
                    index = args[1];
                    params = args[2];
                } else {
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

            // addViewInner() will call child.requestLayout() when setting the new LayoutParams
            // therefore, we call requestLayout() on ourselves before, so that the child's request
            // will be blocked at our level
            this.requestLayout();
            this.invalidate(true);
            this.addViewInner(child, index, params, false);

        }

        checkLayoutParams(p:ViewGroup.LayoutParams):boolean {
            return p != null;
        }

        setOnHierarchyChangeListener(listener:ViewGroup.OnHierarchyChangeListener) {
            this.mOnHierarchyChangeListener = listener;
        }

        onViewAdded(child:View) {
            if (this.mOnHierarchyChangeListener != null) {
                this.mOnHierarchyChangeListener.onChildViewAdded(this, child);
            }
        }

        onViewRemoved(child:View) {
            if (this.mOnHierarchyChangeListener != null) {
                this.mOnHierarchyChangeListener.onChildViewRemoved(this, child);
            }
        }

        clearCachedLayoutMode() {
            if (!this.hasBooleanFlag(ViewGroup.FLAG_LAYOUT_MODE_WAS_EXPLICITLY_SET)) {
                this.mLayoutMode = ViewGroup.LAYOUT_MODE_UNDEFINED;
            }
        }

        addViewInLayout(child:View, index:number, params:ViewGroup.LayoutParams, preventRequestLayout = false):boolean {
            child.mParent = null;
            this.addViewInner(child, index, params, preventRequestLayout);
            child.mPrivateFlags = (child.mPrivateFlags & ~ViewGroup.PFLAG_DIRTY_MASK) | ViewGroup.PFLAG_DRAWN;
            return true;
        }

        cleanupLayoutState(child:View) {
            child.mPrivateFlags &= ~View.PFLAG_FORCE_LAYOUT;
        }

        addViewInner(child:View, index:number, params:ViewGroup.LayoutParams, preventRequestLayout:boolean) {

            if (child.getParent() != null) {
                throw new Error("The specified child already has a parent. " +
                    "You must call removeView() on the child's parent first.");
            }

            if (!this.checkLayoutParams(params)) {
                params = this.generateLayoutParams(params);
            }

            if (preventRequestLayout) {
                child.mLayoutParams = params;
            } else {
                child.setLayoutParams(params);
            }

            if (index < 0) {
                index = this.mChildrenCount;
            }

            this.addInArray(child, index);

            // tell our children
            if (preventRequestLayout) {
                child.assignParent(this);
            } else {
                child.mParent = this;
            }

            //if (child.hasFocus()) {//TODO impl when focus ok
            //    requestChildFocus(child, child.findFocus());
            //}

            let ai = this.mAttachInfo;
            if (ai != null && (this.mGroupFlags & ViewGroup.FLAG_PREVENT_DISPATCH_ATTACHED_TO_WINDOW) == 0) {
                child.dispatchAttachedToWindow(this.mAttachInfo, (this.mViewFlags & ViewGroup.VISIBILITY_MASK));
            }

            this.onViewAdded(child);

            if ((child.mViewFlags & ViewGroup.DUPLICATE_PARENT_STATE) == ViewGroup.DUPLICATE_PARENT_STATE) {
                this.mGroupFlags |= ViewGroup.FLAG_NOTIFY_CHILDREN_ON_DRAWABLE_STATE_CHANGE;
            }

            //if (child.hasTransientState()) {
            //    childHasTransientStateChanged(child, true);
            //}
        }

        private addInArray(child:View, index:number) {
            let count = this.mChildrenCount;
            if (index == count) {
                this.mChildren.push(child);
                this.bindElement.appendChild(child.bindElement);//append to dom

            } else if (index < count) {
                this.mChildren.splice(index, 0, child);
                this.bindElement.insertBefore(child.bindElement, this.getChildAt(index).bindElement);//insert to dom

            } else {
                throw new Error("index=" + index + " count=" + count);
            }
        }

        private removeFromArray(index:number, count = 1) {
            let start = Math.max(0, index);
            let end = Math.min(this.mChildrenCount, start + count);

            if (start == end) {
                return;
            }
            for (let i = start; i < end; i++) {
                this.mChildren[i].mParent = null;
                this.bindElement.removeChild(this.mChildren[i].bindElement);//remove from dom
            }
            this.mChildren.splice(index, end - start);
        }

        removeView(view:View) {
            this.removeViewInternal(view);
            this.requestLayout();
            this.invalidate(true);
        }

        removeViewInLayout(view:View) {
            this.removeViewInternal(view);
        }

        removeViewsInLayout(start:number, count:number) {
            this.removeViewsInternal(start, count);
        }

        removeViewAt(index:number) {
            this.removeViewsInternal(index, 1);
            //this.removeViewInternal(index, this.getChildAt(index));
            this.requestLayout();
            this.invalidate(true);
        }

        removeViews(start:number, count:number) {
            this.removeViewsInternal(start, count);
            this.requestLayout();
            this.invalidate(true);
        }

        private removeViewInternal(view:View) {
            let index = this.indexOfChild(view);
            if (index >= 0) {
                this.removeViewsInternal(index, 1);
            }
        }

        private removeViewsInternal(start:number, count:number) {
            //let focused = this.mFocused;//TODO when focus ok
            //let clearChildFocus = false;
            const detach = this.mAttachInfo != null;

            const children = this.mChildren;
            const end = start + count;

            for (let i = start; i < end; i++) {
                const view = children[i];

                //if (view == focused) {//TODO when focus ok
                //    view.unFocus();
                //    clearChildFocus = true;
                //}
                //
                //cancelTouchTarget(view);
                //cancelHoverTarget(view);

                //if (view.getAnimation() != null || //TODO when animation ok
                //    (mTransitioningViews != null && mTransitioningViews.contains(view))) {
                //    addDisappearingView(view);
                //} else
                if (detach) {
                    view.dispatchDetachedFromWindow();
                }

                //if (view.hasTransientState()) {
                //    childHasTransientStateChanged(view, false);
                //}

                this.onViewRemoved(view);
            }

            this.removeFromArray(start, count);

            //if (clearChildFocus) {//TODO when focus ok
            //    clearChildFocus(focused);
            //    if (!rootViewRequestFocus()) {
            //        notifyGlobalFocusCleared(focused);
            //    }
            //}
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

        //layout(l:number, t:number, r:number, b:number) {
        //    if (!this.mSuppressLayout) {
        //        super.layout(l, t, r, b);
        //    } else {
        //        // record the fact that we noop'd it; request layout when transition finishes
        //        this.mLayoutCalledWhileSuppressed = true;
        //    }
        //}

        indexOfChild(child:View):number {
            return this.mChildren.indexOf(child);
        }

        getChildCount():number {
            return this.mChildrenCount;
        }

        getChildAt(index:number) {
            if (index < 0 || index >= this.mChildrenCount) {
                return null;
            }
            return this.mChildren[index];
        }

        bringChildToFront(child:View) {
            let index = this.indexOfChild(child);
            if (index >= 0) {
                this.removeFromArray(index);
                this.addInArray(child, this.mChildrenCount);
                child.mParent = this;
                this.requestLayout();
                this.invalidate();
            }
        }

        hasBooleanFlag(flag:number) {
            return (this.mGroupFlags & flag) == flag;
        }

        setBooleanFlag(flag:number, value:boolean) {
            if (value) {
                this.mGroupFlags |= flag;
            } else {
                this.mGroupFlags &= ~flag;
            }
        }

        generateLayoutParams(p:ViewGroup.LayoutParams):ViewGroup.LayoutParams {
            return p;
        }

        generateDefaultLayoutParams():ViewGroup.LayoutParams {
            return new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        }

        measureChildren(widthMeasureSpec:number, heightMeasureSpec:number) {
            const size = this.mChildren.length;
            for (let i = 0; i < size; ++i) {
                const child = this.mChildren[i];
                if ((child.mViewFlags & View.VISIBILITY_MASK) != View.GONE) {
                    this.measureChild(child, widthMeasureSpec, heightMeasureSpec);
                }
            }
        }

        measureChild(child:View, parentWidthMeasureSpec:number, parentHeightMeasureSpec:number) {
            let lp = child.getLayoutParams();

            const childWidthMeasureSpec = ViewGroup.getChildMeasureSpec(parentWidthMeasureSpec,
                this.mPaddingLeft + this.mPaddingRight, lp.width);
            const childHeightMeasureSpec = ViewGroup.getChildMeasureSpec(parentHeightMeasureSpec,
                this.mPaddingTop + this.mPaddingBottom, lp.height);

            child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
        }

        measureChildWithMargins(child:View, parentWidthMeasureSpec:number, widthUsed:number,
                                parentHeightMeasureSpec:number, heightUsed:number) {
            let lp = child.getLayoutParams();
            if (lp instanceof ViewGroup.MarginLayoutParams) {

                const childWidthMeasureSpec = ViewGroup.getChildMeasureSpec(parentWidthMeasureSpec,
                    this.mPaddingLeft + this.mPaddingRight + lp.leftMargin + lp.rightMargin
                    + widthUsed, lp.width);
                const childHeightMeasureSpec = ViewGroup.getChildMeasureSpec(parentHeightMeasureSpec,
                    this.mPaddingTop + this.mPaddingBottom + lp.topMargin + lp.bottomMargin
                    + heightUsed, lp.height);

                child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
            }
        }

        static getChildMeasureSpec(spec:number, padding:number, childDimension:number):number {
            let MeasureSpec = View.MeasureSpec;

            let specMode = MeasureSpec.getMode(spec);
            let specSize = MeasureSpec.getSize(spec);

            let size = Math.max(0, specSize - padding);

            let resultSize = 0;
            let resultMode = 0;

            switch (specMode) {
                // Parent has imposed an exact size on us
                case MeasureSpec.EXACTLY:
                    if (childDimension >= 0) {
                        resultSize = childDimension;
                        resultMode = MeasureSpec.EXACTLY;
                    } else if (childDimension == ViewGroup.LayoutParams.MATCH_PARENT) {
                        // Child wants to be our size. So be it.
                        resultSize = size;
                        resultMode = MeasureSpec.EXACTLY;
                    } else if (childDimension == ViewGroup.LayoutParams.WRAP_CONTENT) {
                        // Child wants to determine its own size. It can't be
                        // bigger than us.
                        resultSize = size;
                        resultMode = MeasureSpec.AT_MOST;
                    }
                    break;

                // Parent has imposed a maximum size on us
                case MeasureSpec.AT_MOST:
                    if (childDimension >= 0) {
                        // Child wants a specific size... so be it
                        resultSize = childDimension;
                        resultMode = MeasureSpec.EXACTLY;
                    } else if (childDimension == ViewGroup.LayoutParams.MATCH_PARENT) {
                        // Child wants to be our size, but our size is not fixed.
                        // Constrain child to not be bigger than us.
                        resultSize = size;
                        resultMode = MeasureSpec.AT_MOST;
                    } else if (childDimension == ViewGroup.LayoutParams.WRAP_CONTENT) {
                        // Child wants to determine its own size. It can't be
                        // bigger than us.
                        resultSize = size;
                        resultMode = MeasureSpec.AT_MOST;
                    }
                    break;

                // Parent asked to see how big we want to be
                case MeasureSpec.UNSPECIFIED:
                    if (childDimension >= 0) {
                        // Child wants a specific size... let him have it
                        resultSize = childDimension;
                        resultMode = MeasureSpec.EXACTLY;
                    } else if (childDimension == ViewGroup.LayoutParams.MATCH_PARENT) {
                        // Child wants to be our size... find out how big it should
                        // be
                        resultSize = 0;
                        resultMode = MeasureSpec.UNSPECIFIED;
                    } else if (childDimension == ViewGroup.LayoutParams.WRAP_CONTENT) {
                        // Child wants to determine its own size.... find out how
                        // big it should be
                        resultSize = 0;
                        resultMode = MeasureSpec.UNSPECIFIED;
                    }
                    break;
            }
            return MeasureSpec.makeMeasureSpec(resultSize, resultMode);
        }



        dispatchAttachedToWindow(info:View.AttachInfo, visibility:number) {
            this.mGroupFlags |= ViewGroup.FLAG_PREVENT_DISPATCH_ATTACHED_TO_WINDOW;
            super.dispatchAttachedToWindow(info, visibility);
            this.mGroupFlags &= ~ViewGroup.FLAG_PREVENT_DISPATCH_ATTACHED_TO_WINDOW;

            const count = this.mChildrenCount;
            const children = this.mChildren;
            for (let i = 0; i < count; i++) {
                const child = children[i];
                child.dispatchAttachedToWindow(info,
                    visibility | (child.mViewFlags & View.VISIBILITY_MASK));
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

            // Similarly, set ACTION_EXIT to all hover targets and clear them.
            //this.exitHoverTargets();

            // In case view is detached while transition is running
            //this.mLayoutCalledWhileSuppressed = false;

            this.mChildren.forEach((child)=>child.dispatchDetachedFromWindow());
            super.dispatchDetachedFromWindow();
        }

        dispatchDraw(canvas:Canvas) {
            let count = this.mChildrenCount;
            let children = this.mChildren;
            let flags = this.mGroupFlags;

            //if ((flags & FLAG_RUN_ANIMATION) != 0) {//TODO when animation ok
            //    let cache = (mGroupFlags & FLAG_ANIMATION_CACHE) == FLAG_ANIMATION_CACHE;
            //
            //    let buildCache = !isHardwareAccelerated();
            //    for (let i = 0; i < count; i++) {
            //        let child = children[i];
            //        if ((child.mViewFlags & VISIBILITY_MASK) == VISIBLE) {
            //            let params = child.getLayoutParams();
            //            if (cache) {
            //                child.setDrawingCacheEnabled(true);
            //                if (buildCache) {
            //                    child.buildDrawingCache(true);
            //                }
            //            }
            //        }
            //    }
            //
            //    mGroupFlags &= ~FLAG_RUN_ANIMATION;
            //    mGroupFlags &= ~FLAG_ANIMATION_DONE;
            //
            //    if (cache) {
            //        mGroupFlags |= FLAG_CHILDREN_DRAWN_WITH_CACHE;
            //    }
            //}

            let saveCount = 0;
            let clipToPadding = (flags & ViewGroup.CLIP_TO_PADDING_MASK) == ViewGroup.CLIP_TO_PADDING_MASK;
            if (clipToPadding) {
                saveCount = canvas.save();
                canvas.clipRect(this.mScrollX + this.mPaddingLeft, this.mScrollY + this.mPaddingTop,
                    this.mScrollX + this.mRight - this.mLeft - this.mPaddingRight,
                    this.mScrollY + this.mBottom - this.mTop - this.mPaddingBottom);

            }

            // We will draw our child's animation, let's reset the flag
            this.mPrivateFlags &= ~ViewGroup.PFLAG_DRAW_ANIMATION;
            this.mGroupFlags &= ~ViewGroup.FLAG_INVALIDATE_REQUIRED;

            let more = false;
            let drawingTime = this.getDrawingTime();

            for (let i = 0; i < count; i++) {
                let child = children[i];
                if ((child.mViewFlags & View.VISIBILITY_MASK) == View.VISIBLE
                    //|| child.getAnimation() != null
                ) {
                    more = more || this.drawChild(canvas, child, drawingTime);
                }
            }

            if (clipToPadding) {
                canvas.restoreToCount(saveCount);
            }

            // mGroupFlags might have been updated by drawChild()
            flags = this.mGroupFlags;

            if ((flags & ViewGroup.FLAG_INVALIDATE_REQUIRED) == ViewGroup.FLAG_INVALIDATE_REQUIRED) {
                this.invalidate(true);
            }
        }

        drawChild(canvas:Canvas, child:View , drawingTime:number):boolean {
            return child.drawFromParent(canvas, this, drawingTime);
        }

        getClipChildren():boolean {
            return ((this.mGroupFlags & ViewGroup.FLAG_CLIP_CHILDREN) != 0);
        }
        setClipChildren(clipChildren:boolean) {
            let previousValue = (this.mGroupFlags & ViewGroup.FLAG_CLIP_CHILDREN) == ViewGroup.FLAG_CLIP_CHILDREN;
            if (clipChildren != previousValue) {
                this.setBooleanFlag(ViewGroup.FLAG_CLIP_CHILDREN, clipChildren);
            }
        }
        setClipToPadding(clipToPadding:boolean) {
            this.setBooleanFlag(ViewGroup.FLAG_CLIP_TO_PADDING, clipToPadding);
        }


        requestTransparentRegion(child:android.view.View) {
        }

        invalidateChild(child:android.view.View, r:android.graphics.Rect) {
        }

        invalidateChildInParent(location:Array<number>, r:android.graphics.Rect):android.view.ViewParent {
            return undefined;
        }

        requestChildFocus(child:android.view.View, focused:android.view.View) {
        }

        recomputeViewAttributes(child:android.view.View) {
        }

        clearChildFocus(child:android.view.View) {
        }

        getChildVisibleRect(child:android.view.View, r:android.graphics.Rect, offset:android.graphics.Point):boolean {
            return undefined;
        }

        focusSearch(v:android.view.View, direction:number):android.view.View {
            return undefined;
        }

        focusableViewAvailable(v:android.view.View) {
        }

        childDrawableStateChanged(child:android.view.View) {
        }

        requestDisallowInterceptTouchEvent(disallowIntercept:boolean) {
        }

        requestChildRectangleOnScreen(child:android.view.View, rectangle:android.graphics.Rect, immediate:boolean):boolean {
            return undefined;
        }

        childHasTransientStateChanged(child:android.view.View, hasTransientState:boolean) {
        }

        shouldDelayChildPressedState():boolean {
            return true;
        }

        onSetLayoutParams(child:View, layoutParams:ViewGroup.LayoutParams) {
        }
    }

    export module ViewGroup {
        export class LayoutParams {
            static FILL_PARENT = -1;
            static MATCH_PARENT = -1;
            static WRAP_CONTENT = -2;
            width = 0;
            height = 0;

            constructor();
            constructor(src:LayoutParams);
            constructor(width:number, height:number);
            constructor(...args) {
                if (args.length === 1) {
                    let src = args[0];
                    this.width = src.width;
                    this.height = src.height;
                } else if (args.length === 2) {
                    let [width=0, height=0] = args;
                    this.width = width;
                    this.height = height;
                }
            }
        }
        export class MarginLayoutParams extends LayoutParams {
            leftMargin=0;
            topMargin=0;
            rightMargin=0;
            bottomMargin=0;

            constructor();
            constructor(src:LayoutParams);
            constructor(width:number, height:number);
            constructor(...args) {
                super();

                if (args.length === 1) {
                    let src = args[0];
                    if (src instanceof MarginLayoutParams) {
                        this.leftMargin = src.leftMargin;
                        this.topMargin = src.topMargin;
                        this.rightMargin = src.rightMargin;
                        this.bottomMargin = src.bottomMargin;
                    }
                }else if(args.length==2){
                    super(args[0], args[1]);
                }
            }

            setMargins(left:number, top:number, right:number, bottom:number) {
                this.leftMargin = left;
                this.topMargin = top;
                this.rightMargin = right;
                this.bottomMargin = bottom;
            }
        }
        export interface OnHierarchyChangeListener {
            onChildViewAdded(parent:View, child:View);
            onChildViewRemoved(parent:View, child:View);
        }
    }
}
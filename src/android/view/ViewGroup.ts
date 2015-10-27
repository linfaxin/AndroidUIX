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


module android.view {
    import Canvas = android.graphics.Canvas;
    import Point = android.graphics.Point;
    import Rect = android.graphics.Rect;
    import Matrix = android.graphics.Matrix;
    import SystemClock = android.os.SystemClock;

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
        private mFirstTouchTarget:TouchTarget;
        // For debugging only.  You can see these in hierarchyviewer.
        private mLastTouchDownTime = 0;
        private mLastTouchDownIndex = -1;
        private mLastTouchDownX = 0;
        private mLastTouchDownY = 0;
        mGroupFlags=0;
        mLayoutMode = ViewGroup.LAYOUT_MODE_UNDEFINED;
        mChildren:Array<View> = [];

        get mChildrenCount() {
            return this.mChildren.length;
        }

        mSuppressLayout = false;
        private mLayoutCalledWhileSuppressed = false;

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
        addView(...args);
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

                this.addToBindElement(child.bindElement, null);

            } else if (index < count) {
                let refChild = this.getChildAt(index);
                this.mChildren.splice(index, 0, child);

                this.addToBindElement(child.bindElement, refChild.bindElement);

            } else {
                throw new Error("index=" + index + " count=" + count);
            }
        }
        private addToBindElement(childElement:HTMLElement, insertBeforeElement:HTMLElement){
            if(childElement.parentElement){
                if(childElement.parentElement == this.bindElement) return;
                childElement.parentElement.removeChild(childElement);
            }
            if (insertBeforeElement) {
                this.bindElement.appendChild(childElement);//append to dom
            }else{
                this.bindElement.insertBefore(childElement, insertBeforeElement);//insert to dom
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
        onInterceptTouchEvent(ev:MotionEvent) {
            return false;
        }
        dispatchTouchEvent(ev:MotionEvent):boolean {
            let handled = false;
            if (this.onFilterTouchEventForSecurity(ev)) {
                let action = ev.getAction();
                let actionMasked = action & MotionEvent.ACTION_MASK;

                // Handle an initial down.
                if (actionMasked == MotionEvent.ACTION_DOWN) {
                    // Throw away all previous state when starting a new touch gesture.
                    // The framework may have dropped the up or cancel event for the previous gesture
                    // due to an app switch, ANR, or some other state change.
                    this.cancelAndClearTouchTargets(ev);
                    this.resetTouchState();
                }

                // Check for interception.
                let intercepted;
                if (actionMasked == MotionEvent.ACTION_DOWN
                    || this.mFirstTouchTarget != null) {
                    let disallowIntercept = (this.mGroupFlags & ViewGroup.FLAG_DISALLOW_INTERCEPT) != 0;
                    if (!disallowIntercept) {
                        intercepted = this.onInterceptTouchEvent(ev);
                        ev.setAction(action); // restore action in case it was changed
                    } else {
                        intercepted = false;
                    }
                } else {
                    // There are no touch targets and this action is not an initial down
                    // so this view group continues to intercept touches.
                    intercepted = true;
                }

                // Check for cancelation.
                let canceled = ViewGroup.resetCancelNextUpFlag(this)
                    || actionMasked == MotionEvent.ACTION_CANCEL;

                // Update list of touch targets for pointer down, if needed.
                let split = (this.mGroupFlags & ViewGroup.FLAG_SPLIT_MOTION_EVENTS) != 0;
                let newTouchTarget:TouchTarget = null;
                let alreadyDispatchedToNewTouchTarget = false;
                if (!canceled && !intercepted) {
                    if (actionMasked == MotionEvent.ACTION_DOWN
                        || (split && actionMasked == MotionEvent.ACTION_POINTER_DOWN)
                        || actionMasked == MotionEvent.ACTION_HOVER_MOVE) {
                        let actionIndex = ev.getActionIndex(); // always 0 for down
                        let idBitsToAssign = split ? 1 << ev.getPointerId(actionIndex)
                            : TouchTarget.ALL_POINTER_IDS;

                        // Clean up earlier touch targets for this pointer id in case they
                        // have become out of sync.
                        this.removePointersFromTouchTargets(idBitsToAssign);

                        let childrenCount = this.mChildrenCount;
                        if (newTouchTarget == null && childrenCount != 0) {
                            let x = ev.getX(actionIndex);
                            let y = ev.getY(actionIndex);
                            // Find a child that can receive the event.
                            // Scan children from front to back.
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
                                    // Child is already receiving touch within its bounds.
                                    // Give it the new pointer in addition to the ones it is handling.
                                    newTouchTarget.pointerIdBits |= idBitsToAssign;
                                    break;
                                }

                                ViewGroup.resetCancelNextUpFlag(child);
                                if (this.dispatchTransformedTouchEvent(ev, false, child, idBitsToAssign)) {
                                    // Child wants to receive touch within its bounds.
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
                            // Did not find a child to receive the event.
                            // Assign the pointer to the least recently added target.
                            newTouchTarget = this.mFirstTouchTarget;
                            while (newTouchTarget.next != null) {
                                newTouchTarget = newTouchTarget.next;
                            }
                            newTouchTarget.pointerIdBits |= idBitsToAssign;
                        }
                    }
                }

                // Dispatch to touch targets.
                if (this.mFirstTouchTarget == null) {
                    // No touch targets so treat this as an ordinary view.
                    handled = this.dispatchTransformedTouchEvent(ev, canceled, null,
                        TouchTarget.ALL_POINTER_IDS);
                } else {
                    // Dispatch to touch targets, excluding the new touch target if we already
                    // dispatched to it.  Cancel touch targets if necessary.
                    let predecessor:TouchTarget = null;
                    let target:TouchTarget = this.mFirstTouchTarget;
                    while (target != null) {
                        const next:TouchTarget = target.next;
                        if (alreadyDispatchedToNewTouchTarget && target == newTouchTarget) {
                            handled = true;
                        } else {
                            let cancelChild = ViewGroup.resetCancelNextUpFlag(target.child)
                                || intercepted;
                            if (this.dispatchTransformedTouchEvent(ev, cancelChild,
                                    target.child, target.pointerIdBits)) {
                                handled = true;
                            }
                            if (cancelChild) {
                                if (predecessor == null) {
                                    this.mFirstTouchTarget = next;
                                } else {
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

                // Update list of touch targets for pointer up or cancel, if needed.
                if (canceled
                    || actionMasked == MotionEvent.ACTION_UP
                    || actionMasked == MotionEvent.ACTION_HOVER_MOVE) {
                    this.resetTouchState();
                } else if (split && actionMasked == MotionEvent.ACTION_POINTER_UP) {
                    let actionIndex = ev.getActionIndex();
                    let idBitsToRemove = 1 << ev.getPointerId(actionIndex);
                    this.removePointersFromTouchTargets(idBitsToRemove);
                }
            }
            return handled;
        }
        private resetTouchState() {
            this.clearTouchTargets();
            ViewGroup.resetCancelNextUpFlag(this);
            this.mGroupFlags &= ~ViewGroup.FLAG_DISALLOW_INTERCEPT;
        }
        private static resetCancelNextUpFlag(view:View):boolean {
            if ((view.mPrivateFlags & View.PFLAG_CANCEL_NEXT_UP_EVENT) != 0) {
                view.mPrivateFlags &= ~View.PFLAG_CANCEL_NEXT_UP_EVENT;
                return true;
            }
            return false;
        }
        private clearTouchTargets() {
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

        private cancelAndClearTouchTargets(event:MotionEvent) {
            if (this.mFirstTouchTarget != null) {
                let syntheticEvent = false;
                if (event == null) {
                    let now = SystemClock.uptimeMillis();
                    event = MotionEvent.obtainWithAction(now, now, MotionEvent.ACTION_CANCEL, 0, 0);
                    //event.setSource(InputDevice.SOURCE_TOUCHSCREEN);
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

        private getTouchTarget(child:View):TouchTarget {
            for (let target = this.mFirstTouchTarget; target != null; target = target.next) {
                if (target.child == child) {
                    return target;
                }
            }
            return null;
        }

        private addTouchTarget(child:View, pointerIdBits:number):TouchTarget {
            let target = TouchTarget.obtain(child, pointerIdBits);
            target.next = this.mFirstTouchTarget;
            this.mFirstTouchTarget = target;
            return target;
        }

        private removePointersFromTouchTargets(pointerIdBits:number) {
            let predecessor:TouchTarget = null;
            let target = this.mFirstTouchTarget;
            while (target != null) {
                let next = target.next;
                if ((target.pointerIdBits & pointerIdBits) != 0) {
                    target.pointerIdBits &= ~pointerIdBits;
                    if (target.pointerIdBits == 0) {
                        if (predecessor == null) {
                            this.mFirstTouchTarget = next;
                        } else {
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

        private cancelTouchTarget(view:View) {
            let predecessor:TouchTarget = null;
            let target = this.mFirstTouchTarget;
            while (target != null) {
                let next = target.next;
                if (target.child == view) {
                    if (predecessor == null) {
                        this.mFirstTouchTarget = next;
                    } else {
                        predecessor.next = next;
                    }
                    target.recycle();

                    let now = SystemClock.uptimeMillis();
                    let event = MotionEvent.obtainWithAction(now, now, MotionEvent.ACTION_CANCEL, 0, 0);
                    //event.setSource(InputDevice.SOURCE_TOUCHSCREEN);
                    view.dispatchTouchEvent(event);
                    event.recycle();
                    return;
                }
                predecessor = target;
                target = next;
            }
        }

        private static canViewReceivePointerEvents(child:View):boolean {
            return (child.mViewFlags & View.VISIBILITY_MASK) == View.VISIBLE
                    //|| child.getAnimation() != null //TODO when animation impl
                ;
        }

        isTransformedTouchPointInView(x:number, y:number, child:View, outLocalPoint:Point):boolean {
            let localX = x + this.mScrollX - child.mLeft;
            let localY = y + this.mScrollY - child.mTop;

            //if (! child.hasIdentityMatrix() && mAttachInfo != null) { //TODO when view transform ok
            //    final float[] localXY = mAttachInfo.mTmpTransformLocation;
            //    localXY[0] = localX;
            //    localXY[1] = localY;
            //    child.getInverseMatrix().mapPoints(localXY);
            //    localX = localXY[0];
            //    localY = localXY[1];
            //}

            let isInView = child.pointInView(localX, localY);
            if (isInView && outLocalPoint != null) {
                outLocalPoint.set(localX, localY);
            }
            return isInView;
        }

        private dispatchTransformedTouchEvent(event:MotionEvent, cancel:boolean,
                                              child:View, desiredPointerIdBits:number):boolean {
            let handled:boolean;

            // Canceling motions is a special case.  We don't need to perform any transformations
            // or filtering.  The important part is the action, not the contents.
            const oldAction = event.getAction();
            if (cancel || oldAction == MotionEvent.ACTION_CANCEL) {
                event.setAction(MotionEvent.ACTION_CANCEL);
                if (child == null) {
                    handled = super.dispatchTouchEvent(event);
                } else {
                    handled = child.dispatchTouchEvent(event);
                }
                event.setAction(oldAction);
                return handled;
            }


            // Calculate the number of pointers to deliver.
            const oldPointerIdBits = event.getPointerIdBits();
            const newPointerIdBits = oldPointerIdBits & desiredPointerIdBits;

            // If for some reason we ended up in an inconsistent state where it looks like we
            // might produce a motion event with no pointers in it, then drop the event.
            if (newPointerIdBits == 0) {
                return false;
            }

            // If the number of pointers is the same and we don't need to perform any fancy
            // irreversible transformations, then we can reuse the motion event for this
            // dispatch as long as we are careful to revert any changes we make.
            // Otherwise we need to make a copy.
            let transformedEvent:MotionEvent;
            if (newPointerIdBits == oldPointerIdBits) {
                if (child == null || child.hasIdentityMatrix()) {
                    if (child == null) {
                        handled = super.dispatchTouchEvent(event);
                    } else {
                        let offsetX = this.mScrollX - child.mLeft;
                        let offsetY = this.mScrollY - child.mTop;
                        event.offsetLocation(offsetX, offsetY);

                        handled = child.dispatchTouchEvent(event);

                        event.offsetLocation(-offsetX, -offsetY);
                    }
                    return handled;
                }
                transformedEvent = MotionEvent.obtain(event);
            } else {
                transformedEvent = event.split(newPointerIdBits);
            }

            // Perform any necessary transformations and dispatch.
            if (child == null) {
                handled = super.dispatchTouchEvent(transformedEvent);
            } else {
                let offsetX = this.mScrollX - child.mLeft;
                let offsetY = this.mScrollY - child.mTop;
                transformedEvent.offsetLocation(offsetX, offsetY);
                //if (! child.hasIdentityMatrix()) {//TODO when view transform ok
                //    transformedEvent.transform(child.getInverseMatrix());
                //}

                handled = child.dispatchTouchEvent(transformedEvent);
            }

            // Done.
            transformedEvent.recycle();
            return handled;
        }


        isChildrenDrawingOrderEnabled():boolean {
            return (this.mGroupFlags & ViewGroup.FLAG_USE_CHILD_DRAWING_ORDER) == ViewGroup.FLAG_USE_CHILD_DRAWING_ORDER;
        }
        setChildrenDrawingOrderEnabled(enabled:boolean) {
            this.setBooleanFlag(ViewGroup.FLAG_USE_CHILD_DRAWING_ORDER, enabled);
        }
        getChildDrawingOrder(childCount:number , i:number):number {
            return i;
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
            this.cancelAndClearTouchTargets(null);

            // Similarly, set ACTION_EXIT to all hover targets and clear them.
            //this.exitHoverTargets();

            // In case view is detached while transition is running
            this.mLayoutCalledWhileSuppressed = false;

            this.mChildren.forEach((child)=>child.dispatchDetachedFromWindow());
            super.dispatchDetachedFromWindow();
        }

        dispatchVisibilityChanged(changedView:View, visibility:number) {
            super.dispatchVisibilityChanged(changedView, visibility);
            const count = this.mChildrenCount;
            let children = this.mChildren;
            for (let i = 0; i < count; i++) {
                children[i].dispatchVisibilityChanged(changedView, visibility);
            }
        }
        offsetDescendantRectToMyCoords(descendant:View, rect:Rect){
            this.offsetRectBetweenParentAndChild(descendant, rect, true, false);
        }
        offsetRectIntoDescendantCoords(descendant:View, rect:Rect) {
            this.offsetRectBetweenParentAndChild(descendant, rect, false, false);
        }
        offsetRectBetweenParentAndChild(descendant:View, rect:Rect, offsetFromChildToParent:boolean, clipToBounds:boolean){
            // already in the same coord system :)
            if (descendant == this) {
                return;
            }

            let theParent = descendant.mParent;

            // search and offset up to the parent
            while ((theParent != null)
            && (theParent instanceof View)
            && (theParent != this)) {

                if (offsetFromChildToParent) {
                    rect.offset(descendant.mLeft - descendant.mScrollX,
                        descendant.mTop - descendant.mScrollY);
                    if (clipToBounds) {
                        let p = <View><any>theParent;
                        rect.intersect(0, 0, p.mRight - p.mLeft, p.mBottom - p.mTop);
                    }
                } else {
                    if (clipToBounds) {
                        let p = <View><any>theParent;
                        rect.intersect(0, 0, p.mRight - p.mLeft, p.mBottom - p.mTop);
                    }
                    rect.offset(descendant.mScrollX - descendant.mLeft,
                        descendant.mScrollY - descendant.mTop);
                }

                descendant = <View><any>theParent;
                theParent = descendant.mParent;
            }

            // now that we are up to this view, need to offset one more time
            // to get into our coordinate space
            if (theParent == this) {
                if (offsetFromChildToParent) {
                    rect.offset(descendant.mLeft - descendant.mScrollX,
                        descendant.mTop - descendant.mScrollY);
                } else {
                    rect.offset(descendant.mScrollX - descendant.mLeft,
                        descendant.mScrollY - descendant.mTop);
                }
            } else {
                throw new Error("parameter must be a descendant of this view");
            }
        }
        offsetChildrenTopAndBottom(offset:number) {
            const count = this.mChildrenCount;
            const children = this.mChildren;

            for (let i = 0; i < count; i++) {
                const v = children[i];
                v.mTop += offset;
                v.mBottom += offset;
            }

            this.invalidateViewProperty(false, false);
        }

        suppressLayout(suppress:boolean) {
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


        layout(l:number, t:number, r:number, b:number):void {
            if (!this.mSuppressLayout) {
                super.layout(l, t, r, b);
            } else {
                // record the fact that we noop'd it; request layout when transition finishes
                this.mLayoutCalledWhileSuppressed = true;
            }
        }

        getChildVisibleRect(child:View, r:Rect, offset:Point):boolean{
            // It doesn't make a whole lot of sense to call this on a view that isn't attached,
            // but for some simple tests it can be useful. If we don't have attach info this
            // will allocate memory.
            const rect = this.mAttachInfo != null ? this.mAttachInfo.mTmpTransformRect : new Rect();
            rect.set(r);

            //if (!child.hasIdentityMatrix()) {//TODO view transform
            //    child.getMatrix().mapRect(rect);
            //}

            let dx = child.mLeft - this.mScrollX;
            let dy = child.mTop - this.mScrollY;

            rect.offset(dx, dy);

            if (offset != null) {
                //if (!child.hasIdentityMatrix()) {//TODO view transform
                //    let position = this.mAttachInfo != null ? this.mAttachInfo.mTmpTransformLocation
                //        : new Array<number>(2);
                //    position[0] = offset.x;
                //    position[1] = offset.y;
                //    child.getMatrix().mapPoints(position);
                //    offset.x = (int) (position[0] + 0.5);
                //    offset.y = (int) (position[1] + 0.5);
                //}
                offset.x += dx;
                offset.y += dy;
            }

            if (rect.intersect(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop)) {
                if (this.mParent == null) return true;
                r.set(rect);
                return this.mParent.getChildVisibleRect(this, r, offset);
            }

            return false;
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

            let customOrder = this.isChildrenDrawingOrderEnabled();
            for (let i = 0; i < count; i++) {
                let child = children[customOrder ? this.getChildDrawingOrder(count, i) : i];
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



        invalidateChild(child:View, dirty:Rect) {
            let parent = this;

            const attachInfo = this.mAttachInfo;
            if (attachInfo != null) {
                // If the child is drawing an animation, we want to copy this flag onto
                // ourselves and the parent to make sure the invalidate request goes
                // through
                const drawAnimation = (child.mPrivateFlags & View.PFLAG_DRAW_ANIMATION)
                    == View.PFLAG_DRAW_ANIMATION;

                // Check whether the child that requests the invalidate is fully opaque
                // Views being animated or transformed are not considered opaque because we may
                // be invalidating their old position and need the parent to paint behind them.
                let childMatrix = child.getMatrix();
                const isOpaque = child.isOpaque() && !drawAnimation &&
                    child.getAnimation() == null && childMatrix.isIdentity();
                // Mark the child as dirty, using the appropriate flag
                // Make sure we do not set both flags at the same time
                let opaqueFlag = isOpaque ? View.PFLAG_DIRTY_OPAQUE : View.PFLAG_DIRTY;

                if (child.mLayerType != View.LAYER_TYPE_NONE) {
                    this.mPrivateFlags |= View.PFLAG_INVALIDATED;
                    this.mPrivateFlags &= ~View.PFLAG_DRAWING_CACHE_VALID;
                    //child.mLocalDirtyRect.union(dirty);
                }

                const location = attachInfo.mInvalidateChildLocation;
                location[0] = child.mLeft;
                location[1] = child.mTop;
                //if (!childMatrix.isIdentity() ||//TODO when Matrix & Transformation ok
                //    (this.mGroupFlags & ViewGroup.FLAG_SUPPORT_STATIC_TRANSFORMATIONS) != 0) {
                //    let boundingRect = attachInfo.mTmpTransformRect;
                //    boundingRect.set(dirty);
                //    let transformMatrix:Matrix;
                //    if ((this.mGroupFlags & ViewGroup.FLAG_SUPPORT_STATIC_TRANSFORMATIONS) != 0) {
                //        let t = attachInfo.mTmpTransformation;
                //        let transformed = this.getChildStaticTransformation(child, t);
                //        if (transformed) {
                //            transformMatrix = attachInfo.mTmpMatrix;
                //            transformMatrix.set(t.getMatrix());
                //            if (!childMatrix.isIdentity()) {
                //                transformMatrix.preConcat(childMatrix);
                //            }
                //        } else {
                //            transformMatrix = childMatrix;
                //        }
                //    } else {
                //        transformMatrix = childMatrix;
                //    }
                //    transformMatrix.mapRect(boundingRect);
                //    dirty.set(boundingRect);
                //}

                do {
                    let view:View = null;
                    if (parent instanceof View) {
                        view = <View> parent;
                    }

                    //if (drawAnimation) {//TODO when animation ok
                    //    if (view != null) {
                    //        view.mPrivateFlags |= ViewGroup.PFLAG_DRAW_ANIMATION;
                    //    } else if (parent instanceof ViewRootImpl) {
                    //        (<ViewRootImpl> parent).mIsAnimating = true;
                    //    }
                    //}

                    // If the parent is dirty opaque or not dirty, mark it dirty with the opaque
                    // flag coming from the child that initiated the invalidate
                    if (view != null) {
                        //if ((view.mViewFlags & ViewGroup.FADING_EDGE_MASK) != 0 &&//TODO when fade edge effect ok
                        //    view.getSolidColor() == 0) {
                            opaqueFlag = View.PFLAG_DIRTY;
                        //}
                        if ((view.mPrivateFlags & View.PFLAG_DIRTY_MASK) != View.PFLAG_DIRTY) {
                            view.mPrivateFlags = (view.mPrivateFlags & ~View.PFLAG_DIRTY_MASK) | opaqueFlag;
                        }
                    }

                    parent = <any>parent.invalidateChildInParent(location, dirty);
                    if (view != null) {
                        // Account for transform on current parent
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

        invalidateChildInParent(location:Array<number>, dirty:Rect):ViewParent {
            if ((this.mPrivateFlags & View.PFLAG_DRAWN) == View.PFLAG_DRAWN ||
                (this.mPrivateFlags & View.PFLAG_DRAWING_CACHE_VALID) == View.PFLAG_DRAWING_CACHE_VALID) {
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
                    this.mPrivateFlags &= ~View.PFLAG_DRAWING_CACHE_VALID;

                    location[0] = left;
                    location[1] = top;

                    if (this.mLayerType != View.LAYER_TYPE_NONE) {
                        this.mPrivateFlags |= View.PFLAG_INVALIDATED;
                    //    this.mLocalDirtyRect.union(dirty);
                    }

                    return this.mParent;

                } else {
                    this.mPrivateFlags &= ~View.PFLAG_DRAWN & ~View.PFLAG_DRAWING_CACHE_VALID;

                    location[0] = this.mLeft;
                    location[1] = this.mTop;
                    if ((this.mGroupFlags & ViewGroup.FLAG_CLIP_CHILDREN) == ViewGroup.FLAG_CLIP_CHILDREN) {
                        dirty.set(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop);
                    } else {
                        // in case the dirty rect extends outside the bounds of this container
                        dirty.union(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop);
                    }

                    if (this.mLayerType != View.LAYER_TYPE_NONE) {
                        this.mPrivateFlags |= View.PFLAG_INVALIDATED;
                        //mLocalDirtyRect.union(dirty);
                    }

                    return this.mParent;
                }
            }

            return null;
        }
        invalidateChildFast(child:View, dirty:Rect):void{
            let parent:ViewParent = this;

            const attachInfo = this.mAttachInfo;
            if (attachInfo != null) {
                //if (child.mLayerType != LAYER_TYPE_NONE) {
                //    child.mLocalDirtyRect.union(dirty);
                //}

                let left = child.mLeft;
                let top = child.mTop;
                if (!child.getMatrix().isIdentity()) {
                    child.transformRect(dirty);
                }

                do {
                    if (parent instanceof ViewGroup) {
                        let parentVG = <ViewGroup> parent;
                        if (parentVG.mLayerType != View.LAYER_TYPE_NONE) {
                            // Layered parents should be recreated, not just re-issued
                            parentVG.invalidate();
                            parent = null;
                        } else {
                            parent = parentVG.invalidateChildInParentFast(left, top, dirty);
                            left = parentVG.mLeft;
                            top = parentVG.mTop;
                        }
                    } else {
                        // Reached the top; this calls into the usual invalidate method in
                        // ViewRootImpl, which schedules a traversal
                        const location = attachInfo.mInvalidateChildLocation;
                        location[0] = left;
                        location[1] = top;
                        parent = parent.invalidateChildInParent(location, dirty);
                    }
                } while (parent != null);
            }
        }
        invalidateChildInParentFast(left:number, top:number, dirty:Rect):ViewParent{
            if ((this.mPrivateFlags & View.PFLAG_DRAWN) == View.PFLAG_DRAWN ||
                (this.mPrivateFlags & View.PFLAG_DRAWING_CACHE_VALID) == View.PFLAG_DRAWING_CACHE_VALID) {
                dirty.offset(left - this.mScrollX, top - this.mScrollY);
                if ((this.mGroupFlags & ViewGroup.FLAG_CLIP_CHILDREN) == 0) {
                    dirty.union(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop);
                }

                if ((this.mGroupFlags & ViewGroup.FLAG_CLIP_CHILDREN) == 0 ||
                    dirty.intersect(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop)) {

                    if (this.mLayerType != View.LAYER_TYPE_NONE) {
                        //mLocalDirtyRect.union(dirty);
                    }
                    if (!this.getMatrix().isIdentity()) {
                        this.transformRect(dirty);
                    }

                    return this.mParent;
                }
            }

            return null;
        }

        requestTransparentRegion(child:android.view.View) {
        }

        requestChildFocus(child:android.view.View, focused:android.view.View) {
        }

        recomputeViewAttributes(child:android.view.View) {
        }

        clearChildFocus(child:android.view.View) {
        }

        focusSearch(v:android.view.View, direction:number):android.view.View {
            return undefined;
        }

        focusableViewAvailable(v:android.view.View) {
        }

        childDrawableStateChanged(child:android.view.View) {
        }

        requestDisallowInterceptTouchEvent(disallowIntercept:boolean) {
            if (disallowIntercept == ((this.mGroupFlags & ViewGroup.FLAG_DISALLOW_INTERCEPT) != 0)) {
                // We're already in this state, assume our ancestors are too
                return;
            }

            if (disallowIntercept) {
                this.mGroupFlags |= ViewGroup.FLAG_DISALLOW_INTERCEPT;
            } else {
                this.mGroupFlags &= ~ViewGroup.FLAG_DISALLOW_INTERCEPT;
            }

            // Pass it up to our parent
            if (this.mParent != null) {
                this.mParent.requestDisallowInterceptTouchEvent(disallowIntercept);
            }
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

    class TouchTarget{
        private static MAX_RECYCLED = 32;
        private static sRecycleBin:TouchTarget;
        private static sRecycledCount=0;
        static ALL_POINTER_IDS = -1; // all ones

        child:View;
        pointerIdBits:number;
        next:TouchTarget;

        static obtain(child:View , pointerIdBits:number ) {
            let target:TouchTarget;
            if (TouchTarget.sRecycleBin == null) {
                target = new TouchTarget();
            } else {
                target = TouchTarget.sRecycleBin;
                TouchTarget.sRecycleBin = target.next;
                TouchTarget.sRecycledCount--;
                target.next = null;
            }
            target.child = child;
            target.pointerIdBits = pointerIdBits;
            return target;
        }

        public recycle() {
            if (TouchTarget.sRecycledCount < TouchTarget.MAX_RECYCLED) {
                this.next = TouchTarget.sRecycleBin;
                TouchTarget.sRecycleBin = this;
                TouchTarget.sRecycledCount += 1;
            } else {
                this.next = null;
            }
            this.child = null;
        }
    }

}
/*
 * Copyright (C) 2006 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

///<reference path="ViewOverlay.ts"/>
///<reference path="ViewRootImpl.ts"/>
///<reference path="View.ts"/>
///<reference path="MotionEvent.ts"/>
///<reference path="ViewParent.ts"/>
///<reference path="../graphics/Canvas.ts"/>
///<reference path="../graphics/Point.ts"/>
///<reference path="../graphics/Matrix.ts"/>
///<reference path="../graphics/Rect.ts"/>
///<reference path="../graphics/RectF.ts"/>
///<reference path="../os/SystemClock.ts"/>
///<reference path="../util/TypedValue.ts"/>
///<reference path="../content/Context.ts"/>
///<reference path="FocusFinder.ts"/>
///<reference path="../../java/lang/Integer.ts"/>
///<reference path="animation/Animation.ts"/>
///<reference path="animation/Transformation.ts"/>




module android.view {
    import Canvas = android.graphics.Canvas;
    import Point = android.graphics.Point;
    import Rect = android.graphics.Rect;
    import RectF = android.graphics.RectF;
    import Matrix = android.graphics.Matrix;
    import SystemClock = android.os.SystemClock;
    import Context = android.content.Context;
    import System = java.lang.System;
    import ArrayList = java.util.ArrayList;
    import Integer = java.lang.Integer;
    import Animation = animation.Animation;
    import Transformation = animation.Transformation;
    import AttrBinder = androidui.attr.AttrBinder;

    export abstract class ViewGroup extends View implements ViewParent {
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

        /**
         * Indicates which types of drawing caches are to be kept in memory.
         * This field should be made private, so it is hidden from the SDK.
         * {@hide}
         */
        mPersistentDrawingCache:number;

        /**
         * Used to indicate that no drawing cache should be kept in memory.
         */
        static PERSISTENT_NO_CACHE:number = 0x0;

        /**
         * Used to indicate that the animation drawing cache should be kept in memory.
         */
        static PERSISTENT_ANIMATION_CACHE:number = 0x1;

        /**
         * Used to indicate that the scrolling drawing cache should be kept in memory.
         */
        static PERSISTENT_SCROLLING_CACHE:number = 0x2;

        /**
         * Used to indicate that all drawing caches should be kept in memory.
         */
        static PERSISTENT_ALL_CACHES:number = 0x3;

        static LAYOUT_MODE_UNDEFINED = -1;
        static LAYOUT_MODE_CLIP_BOUNDS = 0;
        //static LAYOUT_MODE_OPTICAL_BOUNDS = 1;
        static LAYOUT_MODE_DEFAULT = ViewGroup.LAYOUT_MODE_CLIP_BOUNDS;
        static CLIP_TO_PADDING_MASK = ViewGroup.FLAG_CLIP_TO_PADDING | ViewGroup.FLAG_PADDING_NOT_NULL;

        /**
         * Views which have been hidden or removed which need to be animated on
         * their way out.
         * This field should be made private, so it is hidden from the SDK.
         * {@hide}
         */
        protected mDisappearingChildren:ArrayList<View>;
        mOnHierarchyChangeListener:ViewGroup.OnHierarchyChangeListener;
        private mFocused:View;
        private mFirstTouchTarget:TouchTarget;
        /**
         * A Transformation used when drawing children, to
         * apply on the child being drawn.
         */
        private mChildTransformation:Transformation;
        /**
         * Used to track the current invalidation region.
         */
        protected mInvalidateRegion:RectF;

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
        private mChildCountWithTransientState = 0;
        private static ViewGroupClassAttrBind:AttrBinder.ClassBinderMap;

        constructor(context?:android.content.Context, bindElement?:HTMLElement, defStyle?){
            super(context, bindElement, defStyle);
            this.initViewGroup();
        }

        protected initBindAttr():void {
            super.initBindAttr();
            if (!ViewGroup.ViewGroupClassAttrBind) {
                ViewGroup.ViewGroupClassAttrBind = new AttrBinder.ClassBinderMap();
                ViewGroup.ViewGroupClassAttrBind.set('clipChildren', {
                    setter(v:ViewGroup, value:any) {
                        v.setClipChildren(v._attrBinder.parseBoolean(value));
                    },
                    getter(v:ViewGroup) {
                        return v.getClipChildren();
                    }
                }).set('clipToPadding', {
                    setter(v:ViewGroup, value:any) {
                        v.setClipToPadding(v._attrBinder.parseBoolean(value));
                    },
                    getter(v:ViewGroup) {
                        return v.isClipToPadding();
                    }
                }).set('animationCache', {
                    setter(v:ViewGroup, value:any) {
                        v.setAnimationCacheEnabled(v._attrBinder.parseBoolean(value, true));
                    }
                }).set('persistentDrawingCache', {
                    setter(v:ViewGroup, value:any) {
                        if(value === 'none') v.setPersistentDrawingCache(ViewGroup.PERSISTENT_NO_CACHE);
                        else if(value === 'animation') v.setPersistentDrawingCache(ViewGroup.PERSISTENT_ANIMATION_CACHE);
                        else if(value === 'scrolling') v.setPersistentDrawingCache(ViewGroup.PERSISTENT_SCROLLING_CACHE);
                        else if(value === 'all') v.setPersistentDrawingCache(ViewGroup.PERSISTENT_ALL_CACHES);
                    }
                }).set('addStatesFromChildren', {
                    setter(v:ViewGroup, value:any) {
                        v.setAddStatesFromChildren(v._attrBinder.parseBoolean(value, false));
                    }
                }).set('alwaysDrawnWithCache', {
                    setter(v:ViewGroup, value:any) {
                        v.setAlwaysDrawnWithCacheEnabled(v._attrBinder.parseBoolean(value, true));
                    }
                }).set('descendantFocusability', {
                    setter(v:ViewGroup, value:any) {
                        if(value == 'beforeDescendants') this.setDescendantFocusability(ViewGroup.FOCUS_BEFORE_DESCENDANTS);
                        else if(value == 'afterDescendants') this.setDescendantFocusability(ViewGroup.FOCUS_AFTER_DESCENDANTS);
                        else if(value == 'blocksDescendants') this.setDescendantFocusability(ViewGroup.FOCUS_BLOCK_DESCENDANTS);
                    }
                }).set('splitMotionEvents', {
                    setter(v:ViewGroup, value:any) {
                        v.setMotionEventSplittingEnabled(v._attrBinder.parseBoolean(value, false));
                    }
                });
                //a.addAttr('layoutAnimation', (value)=>{//TODO when layout support
                //});
                //a.addAttr('animateLayoutChanges', (value)=>{//TODO when layout transition support
                //});
                //a.addAttr('layoutMode', (value)=>{//TODO when more layout mode support
                //});
            }
            this._attrBinder.addClassAttrBind(ViewGroup.ViewGroupClassAttrBind);
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

            this.setDescendantFocusability(ViewGroup.FOCUS_BEFORE_DESCENDANTS);

            this.mPersistentDrawingCache = ViewGroup.PERSISTENT_SCROLLING_CACHE;
        }

        getDescendantFocusability():number {
            return this.mGroupFlags & ViewGroup.FLAG_MASK_FOCUSABILITY;
        }
        setDescendantFocusability(focusability:number) {
            switch (focusability) {
                case ViewGroup.FOCUS_BEFORE_DESCENDANTS:
                case ViewGroup.FOCUS_AFTER_DESCENDANTS:
                case ViewGroup.FOCUS_BLOCK_DESCENDANTS:
                    break;
                default:
                    throw new Error("must be one of FOCUS_BEFORE_DESCENDANTS, "
                        + "FOCUS_AFTER_DESCENDANTS, FOCUS_BLOCK_DESCENDANTS");
            }
            this.mGroupFlags &= ~ViewGroup.FLAG_MASK_FOCUSABILITY;
            this.mGroupFlags |= (focusability & ViewGroup.FLAG_MASK_FOCUSABILITY);
        }

        handleFocusGainInternal(direction:number, previouslyFocusedRect:Rect) {
            if (this.mFocused != null) {
                this.mFocused.unFocus();
                this.mFocused = null;
            }
            super.handleFocusGainInternal(direction, previouslyFocusedRect);
        }
        requestChildFocus(child:View, focused:View) {
            if (View.DBG) {
                System.out.println(this + " requestChildFocus()");
            }
            if (this.getDescendantFocusability() == ViewGroup.FOCUS_BLOCK_DESCENDANTS) {
                return;
            }

            // Unfocus us, if necessary
            super.unFocus();

            // We had a previous notion of who had focus. Clear it.
            if (this.mFocused != child) {
                if (this.mFocused != null) {
                    this.mFocused.unFocus();
                }

                this.mFocused = child;
            }
            if (this.mParent != null) {
                this.mParent.requestChildFocus(this, focused);
            }
        }
        focusableViewAvailable(v:View) {
            if (this.mParent != null
                    // shortcut: don't report a new focusable view if we block our descendants from
                    // getting focus
                && (this.getDescendantFocusability() != ViewGroup.FOCUS_BLOCK_DESCENDANTS)
                    // shortcut: don't report a new focusable view if we already are focused
                    // (and we don't prefer our descendants)
                    //
                    // note: knowing that mFocused is non-null is not a good enough reason
                    // to break the traversal since in that case we'd actually have to find
                    // the focused view and make sure it wasn't FOCUS_AFTER_DESCENDANTS and
                    // an ancestor of v; this will get checked for at ViewAncestor
                && !(this.isFocused() && this.getDescendantFocusability() != ViewGroup.FOCUS_AFTER_DESCENDANTS)) {
                this.mParent.focusableViewAvailable(v);
            }
        }
        focusSearch(direction:number):View;
        focusSearch(focused:View, direction:number):View;
        focusSearch(...args):View {
            if(arguments.length===1){
                return super.focusSearch(args[0]);
            }
            let [focused, direction] = args;
            if (this.isRootNamespace()) {
                // root namespace means we should consider ourselves the top of the
                // tree for focus searching; otherwise we could be focus searching
                // into other tabs.  see LocalActivityManager and TabHost for more info
                return FocusFinder.getInstance().findNextFocus(this, focused, direction);
            } else if (this.mParent != null) {
                return this.mParent.focusSearch(focused, direction);
            }
            return null;
        }
        requestChildRectangleOnScreen(child:View, rectangle:Rect, immediate:boolean) {
            return false;
        }
        childHasTransientStateChanged(child:View, childHasTransientState:boolean) {
            const oldHasTransientState = this.hasTransientState();
            if (childHasTransientState) {
                this.mChildCountWithTransientState++;
            } else {
                this.mChildCountWithTransientState--;
            }

            const newHasTransientState = this.hasTransientState();
            if (this.mParent != null && oldHasTransientState != newHasTransientState) {
                this.mParent.childHasTransientStateChanged(this, newHasTransientState);
            }
        }
        hasTransientState():boolean {
            return this.mChildCountWithTransientState > 0 || super.hasTransientState();
        }

        dispatchUnhandledMove(focused:android.view.View, direction:number):boolean {
            return this.mFocused != null && this.mFocused.dispatchUnhandledMove(focused, direction);
        }
        clearChildFocus(child:View) {
            if (View.DBG) {
                System.out.println(this + " clearChildFocus()");
            }

            this.mFocused = null;
            if (this.mParent != null) {
                this.mParent.clearChildFocus(this);
            }
        }
        clearFocus() {
            if (View.DBG) {
                System.out.println(this + " clearFocus()");
            }
            if (this.mFocused == null) {
                super.clearFocus();
            } else {
                let focused = this.mFocused;
                this.mFocused = null;
                focused.clearFocus();
            }
        }
        unFocus() {
            if (View.DBG) {
                System.out.println(this + " unFocus()");
            }
            if (this.mFocused == null) {
                super.unFocus();
            } else {
                this.mFocused.unFocus();
                this.mFocused = null;
            }
        }
        getFocusedChild():View {
            return this.mFocused;
        }
        hasFocus():boolean {
            return (this.mPrivateFlags & View.PFLAG_FOCUSED) != 0 || this.mFocused != null;
        }
        findFocus():View {
            if (ViewGroup.DBG) {
                System.out.println("Find focus in " + this + ": flags=" + this.isFocused() + ", child=" + this.mFocused);
            }

            if (this.isFocused()) {
                return this;
            }

            if (this.mFocused != null) {
                return this.mFocused.findFocus();
            }
            return null;
        }


        hasFocusable():boolean {
            if ((this.mViewFlags & View.VISIBILITY_MASK) != View.VISIBLE) {
                return false;
            }

            if (this.isFocusable()) {
                return true;
            }

            const descendantFocusability = this.getDescendantFocusability();
            if (descendantFocusability != ViewGroup.FOCUS_BLOCK_DESCENDANTS) {
                const count = this.mChildrenCount;
                const children = this.mChildren;

                for (let i = 0; i < count; i++) {
                    const child = children[i];
                    if (child.hasFocusable()) {
                        return true;
                    }
                }
            }

            return false;
        }


        addFocusables(views:ArrayList<View>, direction:number, focusableMode = View.FOCUSABLES_TOUCH_MODE):void {
            const focusableCount = views.size();

            const descendantFocusability = this.getDescendantFocusability();

            if (descendantFocusability != ViewGroup.FOCUS_BLOCK_DESCENDANTS) {
                const count = this.mChildrenCount;
                const children = this.mChildren;

                for (let i = 0; i < count; i++) {
                    const child = children[i];
                    if ((child.mViewFlags & View.VISIBILITY_MASK) == View.VISIBLE) {
                        child.addFocusables(views, direction, focusableMode);
                    }
                }
            }

            // we add ourselves (if focusable) in all cases except for when we are
            // FOCUS_AFTER_DESCENDANTS and there are some descendants focusable.  this is
            // to avoid the focus search finding layouts when a more precise search
            // among the focusable children would be more interesting.
            if (descendantFocusability != ViewGroup.FOCUS_AFTER_DESCENDANTS
                    // No focusable descendants
                || (focusableCount == views.size())) {
                super.addFocusables(views, direction, focusableMode);
            }
        }

        requestFocus(direction=View.FOCUS_DOWN, previouslyFocusedRect=null):boolean {
            if (View.DBG) {
                System.out.println(this + " ViewGroup.requestFocus direction="
                    + direction);
            }
            let descendantFocusability = this.getDescendantFocusability();

            switch (descendantFocusability) {
                case ViewGroup.FOCUS_BLOCK_DESCENDANTS:
                    return super.requestFocus(direction, previouslyFocusedRect);
                case ViewGroup.FOCUS_BEFORE_DESCENDANTS: {
                    const took = super.requestFocus(direction, previouslyFocusedRect);
                    return took ? took : this.onRequestFocusInDescendants(direction, previouslyFocusedRect);
                }
                case ViewGroup.FOCUS_AFTER_DESCENDANTS: {
                    const took = this.onRequestFocusInDescendants(direction, previouslyFocusedRect);
                    return took ? took : super.requestFocus(direction, previouslyFocusedRect);
                }
                default:
                    throw new Error("descendant focusability must be "
                        + "one of FOCUS_BEFORE_DESCENDANTS, FOCUS_AFTER_DESCENDANTS, FOCUS_BLOCK_DESCENDANTS "
                        + "but is " + descendantFocusability);
            }
        }

        protected onRequestFocusInDescendants(direction:number, previouslyFocusedRect:Rect):boolean {
            let index;
            let increment;
            let end;
            let count = this.mChildrenCount;
            if ((direction & View.FOCUS_FORWARD) != 0) {
                index = 0;
                increment = 1;
                end = count;
            } else {
                index = count - 1;
                increment = -1;
                end = -1;
            }
            const children = this.mChildren;
            for (let i = index; i != end; i += increment) {
                let child = children[i];
                if ((child.mViewFlags & View.VISIBILITY_MASK) == View.VISIBLE) {
                    if (child.requestFocus(direction, previouslyFocusedRect)) {
                        return true;
                    }
                }
            }
            return false;
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
                else if(typeof args[1] === 'number') index = args[1];
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

        protected checkLayoutParams(p:ViewGroup.LayoutParams):boolean {
            return p != null;
        }

        setOnHierarchyChangeListener(listener:ViewGroup.OnHierarchyChangeListener) {
            this.mOnHierarchyChangeListener = listener;
        }

        protected onViewAdded(child:View) {
            if (this.mOnHierarchyChangeListener != null) {
                this.mOnHierarchyChangeListener.onChildViewAdded(this, child);
            }
        }

        protected onViewRemoved(child:View) {
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

            if(this.mDisappearingChildren) this.mDisappearingChildren.remove(child);//androidui add, remove disappearing child.

            this.addInArray(child, index);

            // tell our children
            if (preventRequestLayout) {
                child.assignParent(this);
            } else {
                child.mParent = this;
            }

            if (child.hasFocus()) {
                this.requestChildFocus(child, child.findFocus());
            }

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
                this.bindElement.insertBefore(childElement, insertBeforeElement);//insert to dom
            }else{
                this.bindElement.appendChild(childElement);//append to dom
            }
        }
        private removeChildElement(childElement:HTMLElement){
            try {
                this.bindElement.removeChild(childElement);//remove from dom
            } catch (e) {
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
                this.removeChildElement(this.mChildren[i].bindElement);//remove from dom
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
            let focused = this.mFocused;
            let clearChildFocus = false;
            const detach = this.mAttachInfo != null;

            const children = this.mChildren;
            const end = start + count;

            for (let i = start; i < end; i++) {
                const view = children[i];

                if (view == focused) {
                    view.unFocus();
                    clearChildFocus = true;
                }

                this.cancelTouchTarget(view);
                //this.cancelHoverTarget(view);//TODO when hover ok

                if (view.getAnimation() != null
                //    ||(mTransitioningViews != null && mTransitioningViews.contains(view)) //TODO when Transition ok
                ){
                    this.addDisappearingView(view);
                } else if (detach) {
                    view.dispatchDetachedFromWindow();
                }

                //if (view.hasTransientState()) {
                //    childHasTransientStateChanged(view, false);
                //}

                this.onViewRemoved(view);
            }

            this.removeFromArray(start, count);

            if (clearChildFocus) {
                this.clearChildFocus(focused);
                if (!this.rootViewRequestFocus()) {
                    this.notifyGlobalFocusCleared(focused);
                }
            }
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


        detachViewFromParent(child:View|number):void  {
            if(child instanceof View) child = this.indexOfChild(<View>child);
            this.removeFromArray(<number>child);
        }

        /**
         * Finishes the removal of a detached view. This method will dispatch the detached from
         * window event and notify the hierarchy change listener.
         * <p>
         * This method is intended to be lightweight and makes no assumptions about whether the
         * parent or child should be redrawn. Proper use of this method will include also making
         * any appropriate {@link #requestLayout()} or {@link #invalidate()} calls.
         * For example, callers can {@link #post(Runnable) post} a {@link Runnable}
         * which performs a {@link #requestLayout()} on the next frame, after all detach/remove
         * calls are finished, causing layout to be run prior to redrawing the view hierarchy.
         *
         * @param child the child to be definitely removed from the view hierarchy
         * @param animate if true and the view has an animation, the view is placed in the
         *                disappearing views list, otherwise, it is detached from the window
         *
         * @see #attachViewToParent(View, int, android.view.ViewGroup.LayoutParams)
         * @see #detachAllViewsFromParent()
         * @see #detachViewFromParent(View)
         * @see #detachViewFromParent(int)
         */
        removeDetachedView(child:View, animate:boolean):void  {
            //if (this.mTransition != null) {
            //    this.mTransition.removeChild(this, child);
            //}
            if (child == this.mFocused) {
                child.clearFocus();
            }
            //child.clearAccessibilityFocus();
            this.cancelTouchTarget(child);
            //TODO impl when hover
            //this.cancelHoverTarget(child);
            if ((animate && child.getAnimation() != null)
                //|| (this.mTransitioningViews != null && this.mTransitioningViews.contains(child))
            ) {
                this.addDisappearingView(child);
            } else if (child.mAttachInfo != null) {
                child.dispatchDetachedFromWindow();
            }
            if (child.hasTransientState()) {
                this.childHasTransientStateChanged(child, false);
            }
            this.onViewRemoved(child);
        }
        /**
         * Attaches a view to this view group. Attaching a view assigns this group as the parent,
         * sets the layout parameters and puts the view in the list of children so that
         * it can be retrieved by calling {@link #getChildAt(int)}.
         * <p>
         * This method is intended to be lightweight and makes no assumptions about whether the
         * parent or child should be redrawn. Proper use of this method will include also making
         * any appropriate {@link #requestLayout()} or {@link #invalidate()} calls.
         * For example, callers can {@link #post(Runnable) post} a {@link Runnable}
         * which performs a {@link #requestLayout()} on the next frame, after all detach/attach
         * calls are finished, causing layout to be run prior to redrawing the view hierarchy.
         * <p>
         * This method should be called only for views which were detached from their parent.
         *
         * @param child the child to attach
         * @param index the index at which the child should be attached
         * @param params the layout parameters of the child
         *
         * @see #removeDetachedView(View, boolean)
         * @see #detachAllViewsFromParent()
         * @see #detachViewFromParent(View)
         * @see #detachViewFromParent(int)
         */
        attachViewToParent(child:View, index:number, params:ViewGroup.LayoutParams):void  {
            child.mLayoutParams = params;
            if (index < 0) {
                index = this.mChildrenCount;
            }
            this.addInArray(child, index);
            child.mParent = this;
            child.mPrivateFlags = (child.mPrivateFlags & ~ViewGroup.PFLAG_DIRTY_MASK & ~ViewGroup.PFLAG_DRAWING_CACHE_VALID) | ViewGroup.PFLAG_DRAWN | ViewGroup.PFLAG_INVALIDATED;
            this.mPrivateFlags |= ViewGroup.PFLAG_INVALIDATED;
            if (child.hasFocus()) {
                this.requestChildFocus(child, child.findFocus());
            }
        }

        /**
         * Detaches a range of views from their parents. Detaching a view should be followed
         * either by a call to
         * {@link #attachViewToParent(View, int, android.view.ViewGroup.LayoutParams)}
         * or a call to {@link #removeDetachedView(View, boolean)}. Detachment should only be
         * temporary; reattachment or removal should happen within the same drawing cycle as
         * detachment. When a view is detached, its parent is null and cannot be retrieved by a
         * call to {@link #getChildAt(int)}.
         *
         * @param start the first index of the childrend range to detach
         * @param count the number of children to detach
         *
         * @see #detachViewFromParent(View)
         * @see #detachViewFromParent(int)
         * @see #detachAllViewsFromParent()
         * @see #attachViewToParent(View, int, android.view.ViewGroup.LayoutParams)
         * @see #removeDetachedView(View, boolean)
         */
        detachViewsFromParent(start:number, count:number=1):void  {
            this.removeFromArray(start, count);
        }

        /**
         * Detaches all views from the parent. Detaching a view should be followed
         * either by a call to
         * {@link #attachViewToParent(View, int, android.view.ViewGroup.LayoutParams)}
         * or a call to {@link #removeDetachedView(View, boolean)}. Detachment should only be
         * temporary; reattachment or removal should happen within the same drawing cycle as
         * detachment. When a view is detached, its parent is null and cannot be retrieved by a
         * call to {@link #getChildAt(int)}.
         *
         * @see #detachViewFromParent(View)
         * @see #detachViewFromParent(int)
         * @see #detachViewsFromParent(int, int)
         * @see #attachViewToParent(View, int, android.view.ViewGroup.LayoutParams)
         * @see #removeDetachedView(View, boolean)
         */
        detachAllViewsFromParent():void  {
            const count:number = this.mChildrenCount;
            if (count <= 0) {
                return;
            }
            const children:View[] = this.mChildren;
            //this.mChildrenCount = 0;
            this.mChildren = [];
            for (let i:number = count - 1; i >= 0; i--) {
                children[i].mParent = null;
                //children[i] = null;
                this.removeChildElement(children[i].bindElement);//remove from dom
            }

        }

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

        dispatchGenericPointerEvent(event:MotionEvent):boolean{
            // Send the event to the child under the pointer.
            const childrenCount = this.mChildrenCount;
            if (childrenCount != 0) {
                const children = this.mChildren;
                const x = event.getX();
                const y = event.getY();

                const customOrder = this.isChildrenDrawingOrderEnabled();
                for (let i = childrenCount - 1; i >= 0; i--) {
                    const childIndex = customOrder ? this.getChildDrawingOrder(childrenCount, i) : i;
                    const child = children[childIndex];
                    if (!ViewGroup.canViewReceivePointerEvents(child)
                        || !this.isTransformedTouchPointInView(x, y, child, null)) {
                        continue;
                    }

                    if (this.dispatchTransformedGenericPointerEvent(event, child)) {
                        return true;
                    }
                }
            }

            // No child handled the event.  Send it to this view group.
            return super.dispatchGenericPointerEvent(event);
        }

        private dispatchTransformedGenericPointerEvent(event:MotionEvent, child:View):boolean {
            const offsetX = this.mScrollX - child.mLeft;
            const offsetY = this.mScrollY - child.mTop;

            let handled:boolean;
            if (!child.hasIdentityMatrix()) {
                //TODO when Inverse matrix ok
                //let transformedEvent = MotionEvent.obtain(event);
                //transformedEvent.offsetLocation(offsetX, offsetY);
                //transformedEvent.transform(child.getInverseMatrix());
                //handled = child.dispatchGenericMotionEvent(transformedEvent);
                //transformedEvent.recycle();
            } else {
                event.offsetLocation(offsetX, offsetY);
                handled = child.dispatchGenericMotionEvent(event);
                event.offsetLocation(-offsetX, -offsetY);
            }
            return handled;
        }


        dispatchKeyEvent(event:android.view.KeyEvent):boolean {
            if ((this.mPrivateFlags & (View.PFLAG_FOCUSED | View.PFLAG_HAS_BOUNDS))
                == (View.PFLAG_FOCUSED | View.PFLAG_HAS_BOUNDS)) {
                if (super.dispatchKeyEvent(event)) {
                    return true;
                }
            } else if (this.mFocused != null && (this.mFocused.mPrivateFlags & View.PFLAG_HAS_BOUNDS)
                == View.PFLAG_HAS_BOUNDS) {
                if (this.mFocused.dispatchKeyEvent(event)) {
                    return true;
                }
            }
            return false;
        }

        /**
         * {@inheritDoc}
         */
        dispatchWindowFocusChanged(hasFocus:boolean):void  {
            super.dispatchWindowFocusChanged(hasFocus);
            const count:number = this.mChildrenCount;
            const children:View[] = this.mChildren;
            for (let i:number = 0; i < count; i++) {
                children[i].dispatchWindowFocusChanged(hasFocus);
            }
        }

        addTouchables(views:java.util.ArrayList<android.view.View>):void {
            super.addTouchables(views);

            const count = this.mChildrenCount;
            const children = this.mChildren;

            for (let i = 0; i < count; i++) {
                const child = children[i];
                if ((child.mViewFlags & View.VISIBILITY_MASK) == View.VISIBLE) {
                    child.addTouchables(views);
                }
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
                    || child.getAnimation() != null
                ;
        }

        protected isTransformedTouchPointInView(x:number, y:number, child:View, outLocalPoint:Point):boolean {
            let localX = x + this.mScrollX - child.mLeft;
            let localY = y + this.mScrollY - child.mTop;

            //if (! child.hasIdentityMatrix() && mAttachInfo != null) { //TODO when invers matrix ok
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
                //if (! child.hasIdentityMatrix()) {//TODO when view InverseMatrix ok
                //    transformedEvent.transform(child.getInverseMatrix());
                //}

                handled = child.dispatchTouchEvent(transformedEvent);
            }

            // Done.
            transformedEvent.recycle();
            return handled;
        }

        /**
         * Enable or disable the splitting of MotionEvents to multiple children during touch event
         * dispatch. This behavior is enabled by default for applications that target an
         * SDK version of {@link Build.VERSION_CODES#HONEYCOMB} or newer.
         *
         * <p>When this option is enabled MotionEvents may be split and dispatched to different child
         * views depending on where each pointer initially went down. This allows for user interactions
         * such as scrolling two panes of content independently, chording of buttons, and performing
         * independent gestures on different pieces of content.
         *
         * @param split <code>true</code> to allow MotionEvents to be split and dispatched to multiple
         *              child views. <code>false</code> to only allow one child view to be the target of
         *              any MotionEvent received by this ViewGroup.
         * @attr ref android.R.styleable#ViewGroup_splitMotionEvents
         */
        setMotionEventSplittingEnabled(split:boolean):void  {
            // with gestures in progress when this is changed.
            if (split) {
                this.mGroupFlags |= ViewGroup.FLAG_SPLIT_MOTION_EVENTS;
            } else {
                this.mGroupFlags &= ~ViewGroup.FLAG_SPLIT_MOTION_EVENTS;
            }
        }

        /**
         * Returns true if MotionEvents dispatched to this ViewGroup can be split to multiple children.
         * @return true if MotionEvents dispatched to this ViewGroup can be split to multiple children.
         */
        isMotionEventSplittingEnabled():boolean  {
            return (this.mGroupFlags & ViewGroup.FLAG_SPLIT_MOTION_EVENTS) == ViewGroup.FLAG_SPLIT_MOTION_EVENTS;
        }

        /**
         * Indicates whether the children's drawing cache is used during a layout
         * animation. By default, the drawing cache is enabled but this will prevent
         * nested layout animations from working. To nest animations, you must disable
         * the cache.
         *
         * @return true if the animation cache is enabled, false otherwise
         *
         * @see #setAnimationCacheEnabled(boolean)
         * @see View#setDrawingCacheEnabled(boolean)
         */
        isAnimationCacheEnabled():boolean  {
            return (this.mGroupFlags & ViewGroup.FLAG_ANIMATION_CACHE) == ViewGroup.FLAG_ANIMATION_CACHE;
        }

        /**
         * Enables or disables the children's drawing cache during a layout animation.
         * By default, the drawing cache is enabled but this will prevent nested
         * layout animations from working. To nest animations, you must disable the
         * cache.
         *
         * @param enabled true to enable the animation cache, false otherwise
         *
         * @see #isAnimationCacheEnabled()
         * @see View#setDrawingCacheEnabled(boolean)
         */
        setAnimationCacheEnabled(enabled:boolean):void  {
            this.setBooleanFlag(ViewGroup.FLAG_ANIMATION_CACHE, enabled);
        }

        /**
         * Indicates whether this ViewGroup will always try to draw its children using their
         * drawing cache. By default this property is enabled.
         *
         * @return true if the animation cache is enabled, false otherwise
         *
         * @see #setAlwaysDrawnWithCacheEnabled(boolean)
         * @see #setChildrenDrawnWithCacheEnabled(boolean)
         * @see View#setDrawingCacheEnabled(boolean)
         */
        isAlwaysDrawnWithCacheEnabled():boolean  {
            return (this.mGroupFlags & ViewGroup.FLAG_ALWAYS_DRAWN_WITH_CACHE) == ViewGroup.FLAG_ALWAYS_DRAWN_WITH_CACHE;
        }

        /**
         * Indicates whether this ViewGroup will always try to draw its children using their
         * drawing cache. This property can be set to true when the cache rendering is
         * slightly different from the children's normal rendering. Renderings can be different,
         * for instance, when the cache's quality is set to low.
         *
         * When this property is disabled, the ViewGroup will use the drawing cache of its
         * children only when asked to. It's usually the task of subclasses to tell ViewGroup
         * when to start using the drawing cache and when to stop using it.
         *
         * @param always true to always draw with the drawing cache, false otherwise
         *
         * @see #isAlwaysDrawnWithCacheEnabled()
         * @see #setChildrenDrawnWithCacheEnabled(boolean)
         * @see View#setDrawingCacheEnabled(boolean)
         * @see View#setDrawingCacheQuality(int)
         */
        setAlwaysDrawnWithCacheEnabled(always:boolean):void  {
            this.setBooleanFlag(ViewGroup.FLAG_ALWAYS_DRAWN_WITH_CACHE, always);
        }

        /**
         * Indicates whether the ViewGroup is currently drawing its children using
         * their drawing cache.
         *
         * @return true if children should be drawn with their cache, false otherwise
         *
         * @see #setAlwaysDrawnWithCacheEnabled(boolean)
         * @see #setChildrenDrawnWithCacheEnabled(boolean)
         */
        isChildrenDrawnWithCacheEnabled():boolean  {
            return (this.mGroupFlags & ViewGroup.FLAG_CHILDREN_DRAWN_WITH_CACHE) == ViewGroup.FLAG_CHILDREN_DRAWN_WITH_CACHE;
        }

        /**
         * Tells the ViewGroup to draw its children using their drawing cache. This property
         * is ignored when {@link #isAlwaysDrawnWithCacheEnabled()} is true. A child's drawing cache
         * will be used only if it has been enabled.
         *
         * Subclasses should call this method to start and stop using the drawing cache when
         * they perform performance sensitive operations, like scrolling or animating.
         *
         * @param enabled true if children should be drawn with their cache, false otherwise
         *
         * @see #setAlwaysDrawnWithCacheEnabled(boolean)
         * @see #isChildrenDrawnWithCacheEnabled()
         */
        setChildrenDrawnWithCacheEnabled(enabled:boolean):void  {
            this.setBooleanFlag(ViewGroup.FLAG_CHILDREN_DRAWN_WITH_CACHE, enabled);
        }

        /**
         * Enables or disables the drawing cache for each child of this view group.
         *
         * @param enabled true to enable the cache, false to dispose of it
         */
        setChildrenDrawingCacheEnabled(enabled:boolean):void  {
            if (enabled || (this.mPersistentDrawingCache & ViewGroup.PERSISTENT_ALL_CACHES) != ViewGroup.PERSISTENT_ALL_CACHES) {
                const children:View[] = this.mChildren;
                const count:number = this.mChildrenCount;
                for (let i:number = 0; i < count; i++) {
                    children[i].setDrawingCacheEnabled(enabled);
                }
            }
        }

        protected onAnimationStart():void  {
            super.onAnimationStart();
            // When this ViewGroup's animation starts, build the cache for the children
            if ((this.mGroupFlags & ViewGroup.FLAG_ANIMATION_CACHE) == ViewGroup.FLAG_ANIMATION_CACHE) {
                const count:number = this.mChildrenCount;
                const children:View[] = this.mChildren;
                const buildCache:boolean = !this.isHardwareAccelerated();
                for (let i:number = 0; i < count; i++) {
                    const child:View = children[i];
                    if ((child.mViewFlags & ViewGroup.VISIBILITY_MASK) == ViewGroup.VISIBLE) {
                        child.setDrawingCacheEnabled(true);
                        if (buildCache) {
                            child.buildDrawingCache(true);
                        }
                    }
                }
                this.mGroupFlags |= ViewGroup.FLAG_CHILDREN_DRAWN_WITH_CACHE;
            }
        }

        protected onAnimationEnd():void  {
            super.onAnimationEnd();
            // When this ViewGroup's animation ends, destroy the cache of the children
            if ((this.mGroupFlags & ViewGroup.FLAG_ANIMATION_CACHE) == ViewGroup.FLAG_ANIMATION_CACHE) {
                this.mGroupFlags &= ~ViewGroup.FLAG_CHILDREN_DRAWN_WITH_CACHE;
                if ((this.mPersistentDrawingCache & ViewGroup.PERSISTENT_ANIMATION_CACHE) == 0) {
                    this.setChildrenDrawingCacheEnabled(false);
                }
            }
        }

        /**
         * Returns an integer indicating what types of drawing caches are kept in memory.
         *
         * @see #setPersistentDrawingCache(int)
         * @see #setAnimationCacheEnabled(boolean)
         *
         * @return one or a combination of {@link #PERSISTENT_NO_CACHE},
         *         {@link #PERSISTENT_ANIMATION_CACHE}, {@link #PERSISTENT_SCROLLING_CACHE}
         *         and {@link #PERSISTENT_ALL_CACHES}
         */
        getPersistentDrawingCache():number  {
            return this.mPersistentDrawingCache;
        }

        /**
         * Indicates what types of drawing caches should be kept in memory after
         * they have been created.
         *
         * @see #getPersistentDrawingCache()
         * @see #setAnimationCacheEnabled(boolean)
         *
         * @param drawingCacheToKeep one or a combination of {@link #PERSISTENT_NO_CACHE},
         *        {@link #PERSISTENT_ANIMATION_CACHE}, {@link #PERSISTENT_SCROLLING_CACHE}
         *        and {@link #PERSISTENT_ALL_CACHES}
         */
        setPersistentDrawingCache(drawingCacheToKeep:number):void  {
            this.mPersistentDrawingCache = drawingCacheToKeep & ViewGroup.PERSISTENT_ALL_CACHES;
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

        protected generateLayoutParams(p:ViewGroup.LayoutParams):ViewGroup.LayoutParams {
            return p;
        }

        protected generateDefaultLayoutParams():ViewGroup.LayoutParams {
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

        protected measureChild(child:View, parentWidthMeasureSpec:number, parentHeightMeasureSpec:number) {
            let lp = child.getLayoutParams();
            lp._measuringParentWidthMeasureSpec = parentWidthMeasureSpec;
            lp._measuringParentHeightMeasureSpec = parentHeightMeasureSpec;

            const childWidthMeasureSpec = ViewGroup.getChildMeasureSpec(parentWidthMeasureSpec,
                this.mPaddingLeft + this.mPaddingRight, lp.width);
            const childHeightMeasureSpec = ViewGroup.getChildMeasureSpec(parentHeightMeasureSpec,
                this.mPaddingTop + this.mPaddingBottom, lp.height);

            child.measure(childWidthMeasureSpec, childHeightMeasureSpec);

            lp._measuringParentWidthMeasureSpec = null;
            lp._measuringParentHeightMeasureSpec = null;
        }

        protected measureChildWithMargins(child:View, parentWidthMeasureSpec:number, widthUsed:number,
                                parentHeightMeasureSpec:number, heightUsed:number) {
            let lp = child.getLayoutParams();
            lp._measuringParentWidthMeasureSpec = parentWidthMeasureSpec;
            lp._measuringParentHeightMeasureSpec = parentHeightMeasureSpec;

            if (lp instanceof ViewGroup.MarginLayoutParams) {

                const childWidthMeasureSpec = ViewGroup.getChildMeasureSpec(parentWidthMeasureSpec,
                    this.mPaddingLeft + this.mPaddingRight + lp.leftMargin + lp.rightMargin
                    + widthUsed, lp.width);
                const childHeightMeasureSpec = ViewGroup.getChildMeasureSpec(parentHeightMeasureSpec,
                    this.mPaddingTop + this.mPaddingBottom + lp.topMargin + lp.bottomMargin
                    + heightUsed, lp.height);

                child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
            }

            lp._measuringParentWidthMeasureSpec = null;
            lp._measuringParentHeightMeasureSpec = null;
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


        /**
         * Removes any pending animations for views that have been removed. Call
         * this if you don't want animations for exiting views to stack up.
         */
        clearDisappearingChildren():void  {
            if (this.mDisappearingChildren != null) {
                this.mDisappearingChildren.clear();
                this.invalidate();
            }
        }

        /**
         * Add a view which is removed from mChildren but still needs animation
         *
         * @param v View to add
         */
        private addDisappearingView(v:View):void  {
            let disappearingChildren:ArrayList<View> = this.mDisappearingChildren;
            if (disappearingChildren == null) {
                disappearingChildren = this.mDisappearingChildren = new ArrayList<View>();
            }
            disappearingChildren.add(v);
        }

        /**
         * Cleanup a view when its animation is done. This may mean removing it from
         * the list of disappearing views.
         *
         * @param view The view whose animation has finished
         * @param animation The animation, cannot be null
         */
        finishAnimatingView(view:View, animation:Animation):void  {
            const disappearingChildren:ArrayList<View> = this.mDisappearingChildren;
            if (disappearingChildren != null) {
                if (disappearingChildren.contains(view)) {
                    disappearingChildren.remove(view);
                    if (view.mAttachInfo != null) {
                        view.dispatchDetachedFromWindow();
                    }
                    view.clearAnimation();
                    this.mGroupFlags |= ViewGroup.FLAG_INVALIDATE_REQUIRED;
                }
            }
            if (animation != null && !animation.getFillAfter()) {
                view.clearAnimation();
            }
            if ((view.mPrivateFlags & ViewGroup.PFLAG_ANIMATION_STARTED) == ViewGroup.PFLAG_ANIMATION_STARTED) {
                view.onAnimationEnd();
                // Should be performed by onAnimationEnd() but this avoid an infinite loop,
                // so we'd rather be safe than sorry
                view.mPrivateFlags &= ~ViewGroup.PFLAG_ANIMATION_STARTED;
                // Draw one more frame after the animation is done
                this.mGroupFlags |= ViewGroup.FLAG_INVALIDATE_REQUIRED;
            }
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

        protected onAttachedToWindow() {
            super.onAttachedToWindow();
            this.clearCachedLayoutMode();
        }

        protected onDetachedFromWindow() {
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

        /**
         * {@inheritDoc}
         */
        dispatchDisplayHint(hint:number):void  {
            super.dispatchDisplayHint(hint);
            const count:number = this.mChildrenCount;
            const children:View[] = this.mChildren;
            for (let i:number = 0; i < count; i++) {
                children[i].dispatchDisplayHint(hint);
            }
        }

        /**
         * Called when a view's visibility has changed. Notify the parent to take any appropriate
         * action.
         *
         * @param child The view whose visibility has changed
         * @param oldVisibility The previous visibility value (GONE, INVISIBLE, or VISIBLE).
         * @param newVisibility The new visibility value (GONE, INVISIBLE, or VISIBLE).
         * @hide
         */
        onChildVisibilityChanged(child:View, oldVisibility:number, newVisibility:number):void  {
            //if (this.mTransition != null) {
            //    if (newVisibility == ViewGroup.VISIBLE) {
            //        this.mTransition.showChild(this, child, oldVisibility);
            //    } else {
            //        this.mTransition.hideChild(this, child, newVisibility);
            //        if (this.mTransitioningViews != null && this.mTransitioningViews.contains(child)) {
            //            // and don't need special handling during drawChild()
            //            if (this.mVisibilityChangingChildren == null) {
            //                this.mVisibilityChangingChildren = new ArrayList<View>();
            //            }
            //            this.mVisibilityChangingChildren.add(child);
            //            this.addDisappearingView(child);
            //        }
            //    }
            //}
            //// in all cases, for drags
            //if (this.mCurrentDrag != null) {
            //    if (newVisibility == ViewGroup.VISIBLE) {
            //        this.notifyChildOfDrag(child);
            //    }
            //}
        }
        dispatchVisibilityChanged(changedView:View, visibility:number) {
            super.dispatchVisibilityChanged(changedView, visibility);
            const count = this.mChildrenCount;
            let children = this.mChildren;
            for (let i = 0; i < count; i++) {
                children[i].dispatchVisibilityChanged(changedView, visibility);
            }
        }
        dispatchSetSelected(selected:boolean) {
            const children = this.mChildren;
            const count = this.mChildrenCount;
            for (let i = 0; i < count; i++) {
                children[i].setSelected(selected);
            }
        }
        dispatchSetActivated(activated:boolean) {
            const children = this.mChildren;
            const count = this.mChildrenCount;
            for (let i = 0; i < count; i++) {
                children[i].setActivated(activated);
            }
        }
        dispatchSetPressed(pressed:boolean):void {
            const children = this.mChildren;
            const count = this.mChildrenCount;
            for (let i = 0; i < count; i++) {
                const child = children[i];
                // Children that are clickable on their own should not
                // show a pressed state when their parent view does.
                // Clearing a pressed state always propagates.
                if (!pressed || (!child.isClickable() && !child.isLongClickable())) {
                    child.setPressed(pressed);
                }
            }
        }

        dispatchCancelPendingInputEvents():void  {
            super.dispatchCancelPendingInputEvents();
            const children:View[] = this.mChildren;
            const count:number = this.mChildrenCount;
            for (let i:number = 0; i < count; i++) {
                children[i].dispatchCancelPendingInputEvents();
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

        canAnimate():boolean {
            //layout animation no impl
            return false;
        }
        protected abstract onLayout(changed:boolean, l:number, t:number, r:number, b:number):void;

        getChildVisibleRect(child:View, r:Rect, offset:Point):boolean{
            // It doesn't make a whole lot of sense to call this on a view that isn't attached,
            // but for some simple tests it can be useful. If we don't have attach info this
            // will allocate memory.
            const rect = this.mAttachInfo != null ? this.mAttachInfo.mTmpTransformRect : new Rect();
            rect.set(r);

            if (!child.hasIdentityMatrix()) {
                child.getMatrix().mapRect(rect);
            }

            let dx = child.mLeft - this.mScrollX;
            let dy = child.mTop - this.mScrollY;

            rect.offset(dx, dy);

            if (offset != null) {
                if (!child.hasIdentityMatrix()) {
                    let position = this.mAttachInfo != null ? this.mAttachInfo.mTmpTransformLocation : androidui.util.ArrayCreator.newNumberArray(2);
                    position[0] = offset.x;
                    position[1] = offset.y;
                    child.getMatrix().mapPoints(position);
                    offset.x = Math.floor(position[0] + 0.5);
                    offset.y = Math.floor(position[1] + 0.5);
                }
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



        protected dispatchDraw(canvas:Canvas) {
            let count = this.mChildrenCount;
            let children = this.mChildren;
            let flags = this.mGroupFlags;

            //TODO when layout animation impl
            //if ((flags & ViewGroup.FLAG_RUN_ANIMATION) != 0 && this.canAnimate()) {
            //    const cache:boolean = (this.mGroupFlags & ViewGroup.FLAG_ANIMATION_CACHE) == ViewGroup.FLAG_ANIMATION_CACHE;
            //    const buildCache:boolean = !this.isHardwareAccelerated();
            //    for (let i:number = 0; i < count; i++) {
            //        const child:View = children[i];
            //        if ((child.mViewFlags & ViewGroup.VISIBILITY_MASK) == ViewGroup.VISIBLE) {
            //            const params:ViewGroup.LayoutParams = child.getLayoutParams();
            //            this.attachLayoutAnimationParameters(child, params, i, count);
            //            this.bindLayoutAnimation(child);
            //            if (cache) {
            //                child.setDrawingCacheEnabled(true);
            //                if (buildCache) {
            //                    child.buildDrawingCache(true);
            //                }
            //            }
            //        }
            //    }
            //    const controller:LayoutAnimationController = this.mLayoutAnimationController;
            //    if (controller.willOverlap()) {
            //        this.mGroupFlags |= ViewGroup.FLAG_OPTIMIZE_INVALIDATE;
            //    }
            //    controller.start();
            //    this.mGroupFlags &= ~ViewGroup.FLAG_RUN_ANIMATION;
            //    this.mGroupFlags &= ~ViewGroup.FLAG_ANIMATION_DONE;
            //    if (cache) {
            //        this.mGroupFlags |= ViewGroup.FLAG_CHILDREN_DRAWN_WITH_CACHE;
            //    }
            //    if (this.mAnimationListener != null) {
            //        this.mAnimationListener.onAnimationStart(controller.getAnimation());
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
            let more:boolean = false;
            const drawingTime:number = this.getDrawingTime();
            if ((flags & ViewGroup.FLAG_USE_CHILD_DRAWING_ORDER) == 0) {
                for (let i:number = 0; i < count; i++) {
                    const child:View = children[i];
                    if ((child.mViewFlags & ViewGroup.VISIBILITY_MASK) == ViewGroup.VISIBLE || child.getAnimation() != null) {
                        more = this.drawChild(canvas, child, drawingTime) || more;
                    }
                }
            } else {
                for (let i:number = 0; i < count; i++) {
                    const child:View = children[this.getChildDrawingOrder(count, i)];
                    if ((child.mViewFlags & ViewGroup.VISIBILITY_MASK) == ViewGroup.VISIBLE || child.getAnimation() != null) {
                        more = this.drawChild(canvas, child, drawingTime) || more;
                    }
                }
            }
            // Draw any disappearing views that have animations
            if (this.mDisappearingChildren != null) {
                const disappearingChildren:ArrayList<View> = this.mDisappearingChildren;
                const disappearingCount:number = disappearingChildren.size() - 1;
                // Go backwards -- we may delete as animations finish
                for (let i:number = disappearingCount; i >= 0; i--) {
                    const child:View = disappearingChildren.get(i);
                    more = this.drawChild(canvas, child, drawingTime) || more;
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

        protected drawChild(canvas:Canvas, child:View , drawingTime:number):boolean {
            return child.drawFromParent(canvas, this, drawingTime);
        }
        protected drawableStateChanged() {
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
                    if ((child.mViewFlags & View.DUPLICATE_PARENT_STATE) != 0) {
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
        protected onCreateDrawableState(extraSpace:number):Array<number> {
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
                    state = View.mergeDrawableStates(state, childState);
                }
            }

            return state;
        }
        setAddStatesFromChildren(addsStates:boolean) {
            if (addsStates) {
                this.mGroupFlags |= ViewGroup.FLAG_ADD_STATES_FROM_CHILDREN;
            } else {
                this.mGroupFlags &= ~ViewGroup.FLAG_ADD_STATES_FROM_CHILDREN;
            }
            this.refreshDrawableState();
        }
        addStatesFromChildren():boolean {
            return (this.mGroupFlags & ViewGroup.FLAG_ADD_STATES_FROM_CHILDREN) != 0;
        }
        childDrawableStateChanged(child:android.view.View) {
            if ((this.mGroupFlags & ViewGroup.FLAG_ADD_STATES_FROM_CHILDREN) != 0) {
                this.refreshDrawableState();
            }
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
        isClipToPadding():boolean{
            return (this.mGroupFlags & ViewGroup.FLAG_CLIP_TO_PADDING) == ViewGroup.FLAG_CLIP_TO_PADDING;
        }



        invalidateChild(child:View, dirty:Rect):void {
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
                const isOpaque = child.isOpaque() && !drawAnimation && child.getAnimation() == null && childMatrix.isIdentity();

                // Mark the child as dirty, using the appropriate flag
                // Make sure we do not set both flags at the same time
                let opaqueFlag = isOpaque ? View.PFLAG_DIRTY_OPAQUE : View.PFLAG_DIRTY;

                if (child.mLayerType != View.LAYER_TYPE_NONE) {
                    this.mPrivateFlags |= View.PFLAG_INVALIDATED;
                    this.mPrivateFlags &= ~View.PFLAG_DRAWING_CACHE_VALID;
                    child.mLocalDirtyRect.union(dirty);
                }

                const location = attachInfo.mInvalidateChildLocation;
                location[0] = child.mLeft;
                location[1] = child.mTop;
                if (!childMatrix.isIdentity() ||
                    (this.mGroupFlags & ViewGroup.FLAG_SUPPORT_STATIC_TRANSFORMATIONS) != 0) {
                    let boundingRect = attachInfo.mTmpTransformRect;
                    boundingRect.set(dirty);
                    let transformMatrix:Matrix;
                    if ((this.mGroupFlags & ViewGroup.FLAG_SUPPORT_STATIC_TRANSFORMATIONS) != 0) {
                        let t = attachInfo.mTmpTransformation;
                        let transformed = this.getChildStaticTransformation(child, t);
                        if (transformed) {
                            transformMatrix = attachInfo.mTmpMatrix;
                            transformMatrix.set(t.getMatrix());
                            if (!childMatrix.isIdentity()) {
                                transformMatrix.preConcat(childMatrix);
                            }
                        } else {
                            transformMatrix = childMatrix;
                        }
                    } else {
                        transformMatrix = childMatrix;
                    }
                    transformMatrix.mapRect(boundingRect);
                    dirty.set(boundingRect);
                }

                do {
                    let view:View = null;
                    if (parent instanceof View) {
                        view = <View> parent;
                    }

                    if (drawAnimation) {
                        if (view != null) {
                            view.mPrivateFlags |= ViewGroup.PFLAG_DRAW_ANIMATION;
                        } else if (parent instanceof ViewRootImpl) {
                            (<ViewRootImpl><any>parent).mIsAnimating = true;
                        }
                    }

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
                       this.mLocalDirtyRect.union(dirty);
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
                        this.mLocalDirtyRect.union(dirty);
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
                if (child.mLayerType != View.LAYER_TYPE_NONE) {
                   child.mLocalDirtyRect.union(dirty);
                }

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
                        this.mLocalDirtyRect.union(dirty);
                    }
                    if (!this.getMatrix().isIdentity()) {
                        this.transformRect(dirty);
                    }

                    return this.mParent;
                }
            }

            return null;
        }

        /**
         * Sets  <code>t</code> to be the static transformation of the child, if set, returning a
         * boolean to indicate whether a static transform was set. The default implementation
         * simply returns <code>false</code>; subclasses may override this method for different
         * behavior. {@link #setStaticTransformationsEnabled(boolean)} must be set to true
         * for this method to be called.
         *
         * @param child The child view whose static transform is being requested
         * @param t The Transformation which will hold the result
         * @return true if the transformation was set, false otherwise
         * @see #setStaticTransformationsEnabled(boolean)
         */
        protected getChildStaticTransformation(child:View, t:Transformation):boolean  {
            return false;
        }

        getChildTransformation():Transformation  {
            if (this.mChildTransformation == null) {
                this.mChildTransformation = new Transformation();
            }
            return this.mChildTransformation;
        }

        protected findViewTraversal(id:string):View {
            if (id == this.mID) {
                return this;
            }

            let where:View[] = this.mChildren;
            const len = this.mChildrenCount;

            for (let i = 0; i < len; i++) {
                let v = where[i];

                if ((v.mPrivateFlags & View.PFLAG_IS_ROOT_NAMESPACE) == 0) {
                    v = v.findViewById(id);

                    if (v != null) {
                        return v;
                    }
                }
            }

            return null;
        }

        protected findViewWithTagTraversal(tag:any):View {
            if (tag != null && tag === this.mTag) {
                return this;
            }

            let where:View[] = this.mChildren;
            const len = this.mChildrenCount;

            for (let i = 0; i < len; i++) {
                let v = where[i];

                if ((v.mPrivateFlags & View.PFLAG_IS_ROOT_NAMESPACE) == 0) {
                    v = v.findViewWithTag(tag);

                    if (v != null) {
                        return v;
                    }
                }
            }

            return null;
        }

        protected findViewByPredicateTraversal(predicate:View.Predicate<View>, childToSkip:View):View {
            if (predicate.apply(this)) {
                return this;
            }

            const where = this.mChildren;
            const len = this.mChildrenCount;

            for (let i = 0; i < len; i++) {
                let v = where[i];

                if (v != childToSkip && (v.mPrivateFlags & View.PFLAG_IS_ROOT_NAMESPACE) == 0) {
                    v = v.findViewByPredicate(predicate);

                    if (v != null) {
                        return v;
                    }
                }
            }

            return null;
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
        shouldDelayChildPressedState():boolean {
            return true;
        }

        onSetLayoutParams(child:View, layoutParams:ViewGroup.LayoutParams) {
        }
    }

    export module ViewGroup {
        import AttrBinder = androidui.attr.AttrBinder;
        export class LayoutParams {
            static FILL_PARENT = -1;
            static MATCH_PARENT = -1;
            static WRAP_CONTENT = -2;
            private _width:any = 0;
            private _widthOrig:string;
            private _height:any = 0;
            private _heightOrig:string;

            public get width():number {
                if(typeof this._width === 'number') return this._width;
                let up = (this._width + "").toUpperCase();
                if(up === 'FILL_PARENT' || up === 'MATCH_PARENT') this._width = -1;
                else if(up === 'WRAP_CONTENT') this._width = -2;
                else{
                    let parentWidth = View.MeasureSpec.getSize(this._measuringParentWidthMeasureSpec);
                    try {
                        let parsedValue = this._attrBinder.parseNumberPixelSize(<any>this._width, 0, parentWidth);
                        //not save if dynamic, next get will compute again
                        if(android.util.TypedValue.isDynamicUnitValue(<any>this._width)){
                            return parsedValue;
                        }
                        this._width = parsedValue;
                    } catch (e) {
                        console.error(e);
                        return -2;
                    }
                }
                return this._width;
            }

            public set width(value) {
                this._width = this._widthOrig = <any>value;
            }

            public get height():number {
                if(typeof this._height === 'number') return this._height;
                let up = (this._height + "").toUpperCase();
                if(up === 'FILL_PARENT' || up === 'MATCH_PARENT') this._height = -1;
                else if(up === 'WRAP_CONTENT') this._height = -2;
                else{
                    let parentHeight = View.MeasureSpec.getSize(this._measuringParentHeightMeasureSpec);
                    try {
                        let parsedValue = this._attrBinder.parseNumberPixelSize(<any>this._height, 0, parentHeight);
                        //not save if dynamic, next get will compute again
                        if(android.util.TypedValue.isDynamicUnitValue(<any>this._height)){
                            return parsedValue;
                        }
                        this._height = parsedValue;
                    } catch (e) {
                        console.error(e);
                        return -2;
                    }
                }
                return this._height;
            }

            public set height(value) {
                this._height = this._heightOrig = <any>value;
            }

            _measuringParentWidthMeasureSpec = 0;
            _measuringParentHeightMeasureSpec = 0;
            _measuringMeasureSpec:android.util.DisplayMetrics;
            _attrBinder:androidui.attr.AttrBinder;

            private static ViewGroupParamClassAttrBind:AttrBinder.ClassBinderMap;

            constructor();
            constructor(src:LayoutParams);
            constructor(width:number, height:number);
            constructor(...args);
            constructor(...args) {
                if (args.length === 1) {
                    let src = args[0];
                    this.width = src._width;
                    this.height = src._height;
                } else if (args.length === 2) {
                    let [width=0, height=0] = args;
                    this.width = width;
                    this.height = height;
                }

                if(!this._attrBinder) {
                    this._attrBinder = new androidui.attr.AttrBinder(this);
                    if (!LayoutParams.ViewGroupParamClassAttrBind) {
                        LayoutParams.ViewGroupParamClassAttrBind = new AttrBinder.ClassBinderMap();
                        LayoutParams.ViewGroupParamClassAttrBind.set('width', {
                            setter(host:LayoutParams, value:any) {
                                if(value==null) value = -2;
                                host.width = value;
                            },
                            getter(host:LayoutParams) {
                                return host._widthOrig;
                            }
                        }).set('height', {
                            setter(host:LayoutParams, value:any) {
                                if(value==null) value = -2;
                                host.height = value;
                            },
                            getter(host:LayoutParams) {
                                return host._heightOrig;
                            }
                        });
                    }
                    this._attrBinder.addClassAttrBind(LayoutParams.ViewGroupParamClassAttrBind);
                }
            }

            parseAttributeFrom(node:Node, context:Context):void {
                Array.from(node.attributes).forEach((attr:Attr)=>{
                    let layoutParamFiled = attr.name.startsWith('layout_') && attr.name.substring('layout_'.length);
                    if (layoutParamFiled) {
                        this._attrBinder.onAttrChange(layoutParamFiled, attr.value, context);
                    }
                });
            }
        }
        export class MarginLayoutParams extends LayoutParams {
            private _leftMargin:any = 0;
            private _topMargin:any = 0;
            private _rightMargin:any = 0;
            private _bottomMargin:any = 0;
            private _leftMarginOrig:any = 0;
            private _topMarginOrig:any = 0;
            private _rightMarginOrig:any = 0;
            private _bottomMarginOrig:any = 0;

            static DEFAULT_MARGIN_RELATIVE:number = Integer.MIN_VALUE;
            private static MarginLayoutParamsClassAttrBind:AttrBinder.ClassBinderMap;

            public get leftMargin():number{
                if(typeof this._leftMargin === 'number') return this._leftMargin;
                let parentWidth = View.MeasureSpec.getSize(this._measuringParentWidthMeasureSpec);
                try {
                    let parsedValue = this._attrBinder.parseNumberPixelSize(<any>this._leftMargin, 0, parentWidth);
                    //not save if dynamic, next get will compute again
                    if(android.util.TypedValue.isDynamicUnitValue(<any>this._leftMargin)){
                        return parsedValue;
                    }
                    this._leftMargin = parsedValue;
                } catch (e) {
                    console.warn(e);
                    return 0;
                }
                return this._leftMargin;
            }
            public get topMargin():number{
                if(typeof this._topMargin === 'number') return this._topMargin;
                //topMargin with percent will use parent's width
                let parentWidth = View.MeasureSpec.getSize(this._measuringParentWidthMeasureSpec);
                try {
                    let parsedValue = this._attrBinder.parseNumberPixelSize(<any>this._topMargin, 0, parentWidth);
                    //not save if dynamic, next get will compute again
                    if(android.util.TypedValue.isDynamicUnitValue(<any>this._topMargin)){
                        return parsedValue;
                    }
                    this._topMargin = parsedValue;
                } catch (e) {
                    console.warn(e);
                    return 0;
                }
                return this._topMargin;
            }
            public get rightMargin():number{
                if(typeof this._rightMargin === 'number') return this._rightMargin;
                let parentWidth = View.MeasureSpec.getSize(this._measuringParentWidthMeasureSpec);
                try {
                    let parsedValue = this._attrBinder.parseNumberPixelSize(<any>this._rightMargin, 0, parentWidth);
                    //not save if dynamic, next get will compute again
                    if(android.util.TypedValue.isDynamicUnitValue(<any>this._rightMargin)){
                        return parsedValue;
                    }
                    this._rightMargin = parsedValue;
                } catch (e) {
                    console.warn(e);
                    return 0;
                }
                return this._rightMargin;
            }
            public get bottomMargin():number{
                if(typeof this._bottomMargin === 'number') return this._bottomMargin;
                //topMargin with percent will use parent's width
                let parentWidth = View.MeasureSpec.getSize(this._measuringParentWidthMeasureSpec);
                try {
                    let parsedValue = this._attrBinder.parseNumberPixelSize(<any>this._bottomMargin, 0, parentWidth);
                    //not save if dynamic, next get will compute again
                    if(android.util.TypedValue.isDynamicUnitValue(<any>this._bottomMargin)){
                        return parsedValue;
                    }
                    this._bottomMargin = parsedValue;
                } catch (e) {
                    console.warn(e);
                    return 0;
                }
                return this._bottomMargin;
            }
            public set leftMargin(value) {
                this._leftMargin = this._leftMarginOrig = value;
            }
            public set topMargin(value) {
                this._topMargin = this._topMarginOrig = value;
            }
            public set rightMargin(value) {
                this._rightMargin = this._rightMarginOrig = value;
            }
            public set bottomMargin(value) {
                this._bottomMargin = this._bottomMarginOrig = value;
            }

            constructor();
            constructor(src:LayoutParams);
            constructor(width:number, height:number);
            constructor(...args);
            constructor(...args) {
                super(...args);

                if (args.length === 1) {
                    let src = args[0];
                    if (src instanceof MarginLayoutParams) {
                        this.leftMargin = src._leftMargin;
                        this.topMargin = src._topMargin;
                        this.rightMargin = src._rightMargin;
                        this.bottomMargin = src._bottomMargin;
                    }
                }

                if (!MarginLayoutParams.MarginLayoutParamsClassAttrBind) {
                    MarginLayoutParams.MarginLayoutParamsClassAttrBind = new AttrBinder.ClassBinderMap();
                    MarginLayoutParams.MarginLayoutParamsClassAttrBind.set('marginLeft', {
                        setter(host:MarginLayoutParams, value:any) {
                            if(value==null) value = 0;
                            host.leftMargin = value;
                        },
                        getter(host:MarginLayoutParams) {
                            return host._leftMarginOrig;
                        }
                    }).set('marginStart', {
                        setter(host:MarginLayoutParams, value:any) {
                            if(value==null) value = 0;
                            host.leftMargin = value;
                        },
                        getter(host:MarginLayoutParams) {
                            return host._leftMarginOrig;
                        }
                    }).set('marginTop', {
                        setter(host:MarginLayoutParams, value:any) {
                            if(value==null) value = 0;
                            host.topMargin = value;
                        },
                        getter(host:MarginLayoutParams) {
                            return host._topMarginOrig;
                        }
                    }).set('marginRight', {
                        setter(host:MarginLayoutParams, value:any) {
                            if(value==null) value = 0;
                            host.rightMargin = value;
                        },
                        getter(host:MarginLayoutParams) {
                            return host._rightMarginOrig;
                        }
                    }).set('marginEnd', {
                        setter(host:MarginLayoutParams, value:any) {
                            if(value==null) value = 0;
                            host.rightMargin = value;
                        },
                        getter(host:MarginLayoutParams) {
                            return host._rightMarginOrig;
                        }
                    }).set('marginBottom', {
                        setter(host:MarginLayoutParams, value:any) {
                            if(value==null) value = 0;
                            host.bottomMargin = value;
                        },
                        getter(host:MarginLayoutParams) {
                            return host._bottomMargin;
                        }
                    }).set('margin', {
                        setter(host:MarginLayoutParams, value:any) {
                            if(value==null) value = 0;
                            let [left, top, right, bottom] = host._attrBinder.parsePaddingMarginLTRB(value);
                            host.leftMargin = <any>left;
                            host.topMargin = <any>top;
                            host.rightMargin = <any>right;
                            host.bottomMargin = <any>bottom;
                        }
                    })
                }
                this._attrBinder.addClassAttrBind(MarginLayoutParams.MarginLayoutParamsClassAttrBind);
            }

            setMargins(left:number, top:number, right:number, bottom:number) {
                this.leftMargin = left;
                this.topMargin = top;
                this.rightMargin = right;
                this.bottomMargin = bottom;
            }

            setLayoutDirection(layoutDirection:number):void  {
            }

            getLayoutDirection():number  {
                return View.LAYOUT_DIRECTION_LTR;
            }

            isLayoutRtl():boolean  {
                return this.getLayoutDirection() == View.LAYOUT_DIRECTION_RTL;
            }

            resolveLayoutDirection(layoutDirection:number):void  {
                //do no
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
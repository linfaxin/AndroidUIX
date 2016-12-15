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

///<reference path="../view/Gravity.ts"/>
///<reference path="../view/ViewOverlay.ts"/>
///<reference path="../view/ViewGroup.ts"/>
///<reference path="../view/View.ts"/>
///<reference path="../graphics/drawable/Drawable.ts"/>
///<reference path="../graphics/Rect.ts"/>
///<reference path="../graphics/Canvas.ts"/>

module android.widget {
    import Gravity = android.view.Gravity;
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import Drawable = android.graphics.drawable.Drawable;
    import Rect = android.graphics.Rect;
    import Canvas = android.graphics.Canvas;
    import AttrBinder = androidui.attr.AttrBinder;
    import Context = android.content.Context;

    /**
     * FrameLayout is designed to block out an area on the screen to display
     * a single item. Generally, FrameLayout should be used to hold a single child view, because it can
     * be difficult to organize child views in a way that's scalable to different screen sizes without
     * the children overlapping each other. You can, however, add multiple children to a FrameLayout
     * and control their position within the FrameLayout by assigning gravity to each child, using the
     * <a href="FrameLayout.LayoutParams.html#attr_android:layout_gravity">{@code
     * android:layout_gravity}</a> attribute.
     * <p>Child views are drawn in a stack, with the most recently added child on top.
     * The size of the FrameLayout is the size of its largest child (plus padding), visible
     * or not (if the FrameLayout's parent permits). Views that are {@link android.view.View#GONE} are
     * used for sizing
     * only if {@link #setMeasureAllChildren(boolean) setConsiderGoneChildrenWhenMeasuring()}
     * is set to true.
     *
     * @attr ref android.R.styleable#FrameLayout_foreground
     * @attr ref android.R.styleable#FrameLayout_foregroundGravity
     * @attr ref android.R.styleable#FrameLayout_measureAllChildren
     */
    export class FrameLayout extends ViewGroup {
        static DEFAULT_CHILD_GRAVITY = Gravity.TOP | Gravity.LEFT;

        mMeasureAllChildren = false;
        mForeground:Drawable;
        private mForegroundPaddingLeft = 0;
        private mForegroundPaddingTop = 0;
        private mForegroundPaddingRight = 0;
        private mForegroundPaddingBottom = 0;
        private mSelfBounds = new Rect();
        private mOverlayBounds = new Rect();
        private mForegroundGravity = Gravity.FILL;
        mForegroundInPadding = true;
        mForegroundBoundsChanged = false;
        private mMatchParentChildren = new Array<View>(1);

        constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle?:Map<string, string>) {
            super(context, bindElement, defStyle);

            const a = context.obtainStyledAttributes(bindElement, defStyle);
            this.mForegroundGravity = Gravity.parseGravity(a.getAttrValue('foregroundGravity'), this.mForegroundGravity);

            const d = a.getDrawable('foreground');
            if (d != null) {
                this.setForeground(d);
            }

            if (a.getBoolean('measureAllChildren', false)) {
                this.setMeasureAllChildren(true);
            }

            this.mForegroundInPadding = a.getBoolean('foregroundInsidePadding', true);
            a.recycle();
        }

        protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
            return super.createClassAttrBinder().set('foregroundGravity', {
                setter(v:FrameLayout, value:any, attrBinder:AttrBinder) {
                    v.mForegroundGravity = attrBinder.parseGravity(value, v.mForegroundGravity);
                }, getter(v:FrameLayout) {
                    return v.mForegroundGravity;
                }
            }).set('foreground', {
                setter(v:FrameLayout, value:any, attrBinder:AttrBinder) {
                    v.setForeground(attrBinder.parseDrawable(value));
                }, getter(v:FrameLayout) {
                    return v.getForeground();
                }
            }).set('measureAllChildren', {
                setter(v:FrameLayout, value:any, attrBinder:AttrBinder) {
                    if (attrBinder.parseBoolean(value)) {
                        v.setMeasureAllChildren(true);
                    }
                }, getter(v:FrameLayout) {
                    return v.mMeasureAllChildren;
                }
            });
        }

        /**
         * Describes how the foreground is positioned.
         *
         * @return foreground gravity.
         *
         * @see #setForegroundGravity(int)
         *
         * @attr ref android.R.styleable#FrameLayout_foregroundGravity
         */
        getForegroundGravity():number {
            return this.mForegroundGravity;
        }

        /**
         * Describes how the foreground is positioned. Defaults to START and TOP.
         *
         * @param foregroundGravity See {@link android.view.Gravity}
         *
         * @see #getForegroundGravity()
         *
         * @attr ref android.R.styleable#FrameLayout_foregroundGravity
         */
        setForegroundGravity(foregroundGravity:number) {
            if (this.mForegroundGravity != foregroundGravity) {
                if ((foregroundGravity & Gravity.HORIZONTAL_GRAVITY_MASK) == 0) {
                    foregroundGravity |= Gravity.LEFT;
                }

                if ((foregroundGravity & Gravity.VERTICAL_GRAVITY_MASK) == 0) {
                    foregroundGravity |= Gravity.TOP;
                }

                this.mForegroundGravity = foregroundGravity;


                if (this.mForegroundGravity == Gravity.FILL && this.mForeground != null) {
                    let padding = new Rect();
                    if (this.mForeground.getPadding(padding)) {
                        this.mForegroundPaddingLeft = padding.left;
                        this.mForegroundPaddingTop = padding.top;
                        this.mForegroundPaddingRight = padding.right;
                        this.mForegroundPaddingBottom = padding.bottom;
                    }
                } else {
                    this.mForegroundPaddingLeft = 0;
                    this.mForegroundPaddingTop = 0;
                    this.mForegroundPaddingRight = 0;
                    this.mForegroundPaddingBottom = 0;
                }

                this.requestLayout();
            }
        }

        protected verifyDrawable(who:Drawable):boolean {
            return super.verifyDrawable(who) || (who == this.mForeground);
        }

        jumpDrawablesToCurrentState() {
            super.jumpDrawablesToCurrentState();
            if (this.mForeground != null) this.mForeground.jumpToCurrentState();
        }

        protected drawableStateChanged() {
            super.drawableStateChanged();
            if (this.mForeground != null && this.mForeground.isStateful()) {
                this.mForeground.setState(this.getDrawableState());
            }
        }

        /**
         * Returns a set of layout parameters with a width of
         * {@link android.view.ViewGroup.LayoutParams#MATCH_PARENT},
         * and a height of {@link android.view.ViewGroup.LayoutParams#MATCH_PARENT}.
         */
        protected generateDefaultLayoutParams():FrameLayout.LayoutParams {
            return new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT);
        }

        /**
         * Supply a Drawable that is to be rendered on top of all of the child
         * views in the frame layout.  Any padding in the Drawable will be taken
         * into account by ensuring that the children are inset to be placed
         * inside of the padding area.
         *
         * @param drawable The Drawable to be drawn on top of the children.
         *
         * @attr ref android.R.styleable#FrameLayout_foreground
         */
        setForeground(drawable:Drawable) {
            if (this.mForeground != drawable) {
                if (this.mForeground != null) {
                    this.mForeground.setCallback(null);
                    this.unscheduleDrawable(this.mForeground);
                }

                this.mForeground = drawable;
                this.mForegroundPaddingLeft = 0;
                this.mForegroundPaddingTop = 0;
                this.mForegroundPaddingRight = 0;
                this.mForegroundPaddingBottom = 0;

                if (drawable != null) {
                    this.setWillNotDraw(false);
                    drawable.setCallback(this);
                    if (drawable.isStateful()) {
                        drawable.setState(this.getDrawableState());
                    }
                    if (this.mForegroundGravity == Gravity.FILL) {
                        let padding = new Rect();
                        if (drawable.getPadding(padding)) {
                            this.mForegroundPaddingLeft = padding.left;
                            this.mForegroundPaddingTop = padding.top;
                            this.mForegroundPaddingRight = padding.right;
                            this.mForegroundPaddingBottom = padding.bottom;
                        }
                    }
                } else {
                    this.setWillNotDraw(true);
                }
                this.requestLayout();
                this.invalidate();
            }
        }

        /**
         * Returns the drawable used as the foreground of this FrameLayout. The
         * foreground drawable, if non-null, is always drawn on top of the children.
         *
         * @return A Drawable or null if no foreground was set.
         */
        getForeground():Drawable {
            return this.mForeground;
        }

        getPaddingLeftWithForeground():number {
            return this.mForegroundInPadding ? Math.max(this.mPaddingLeft, this.mForegroundPaddingLeft) :
            this.mPaddingLeft + this.mForegroundPaddingLeft;
        }

        getPaddingRightWithForeground():number {
            return this.mForegroundInPadding ? Math.max(this.mPaddingRight, this.mForegroundPaddingRight) :
            this.mPaddingRight + this.mForegroundPaddingRight;
        }

        getPaddingTopWithForeground():number {
            return this.mForegroundInPadding ? Math.max(this.mPaddingTop, this.mForegroundPaddingTop) :
            this.mPaddingTop + this.mForegroundPaddingTop;
        }

        getPaddingBottomWithForeground() {
            return this.mForegroundInPadding ? Math.max(this.mPaddingBottom, this.mForegroundPaddingBottom) :
            this.mPaddingBottom + this.mForegroundPaddingBottom;
        }

        protected onMeasure(widthMeasureSpec:number, heightMeasureSpec:number) {
            let count = this.getChildCount();

            let measureMatchParentChildren =
                View.MeasureSpec.getMode(widthMeasureSpec) != View.MeasureSpec.EXACTLY ||
                View.MeasureSpec.getMode(heightMeasureSpec) != View.MeasureSpec.EXACTLY;
            this.mMatchParentChildren = [];

            let maxHeight = 0;
            let maxWidth = 0;
            let childState = 0;

            for (let i = 0; i < count; i++) {
                let child = this.getChildAt(i);
                if (this.mMeasureAllChildren || child.getVisibility() != View.GONE) {
                    this.measureChildWithMargins(child, widthMeasureSpec, 0, heightMeasureSpec, 0);
                    let lp = <FrameLayout.LayoutParams> child.getLayoutParams();
                    maxWidth = Math.max(maxWidth,
                        child.getMeasuredWidth() + lp.leftMargin + lp.rightMargin);
                    maxHeight = Math.max(maxHeight,
                        child.getMeasuredHeight() + lp.topMargin + lp.bottomMargin);
                    childState = View.combineMeasuredStates(childState, child.getMeasuredState());
                    if (measureMatchParentChildren) {
                        if (lp.width == FrameLayout.LayoutParams.MATCH_PARENT ||
                            lp.height == FrameLayout.LayoutParams.MATCH_PARENT) {
                            this.mMatchParentChildren.push(child);
                        }
                    }
                }
            }

            // Account for padding too
            maxWidth += this.getPaddingLeftWithForeground() + this.getPaddingRightWithForeground();
            maxHeight += this.getPaddingTopWithForeground() + this.getPaddingBottomWithForeground();

            // Check against our minimum height and width
            maxHeight = Math.max(maxHeight, this.getSuggestedMinimumHeight());
            maxWidth = Math.max(maxWidth, this.getSuggestedMinimumWidth());

            // Check against our foreground's minimum height and width
            let drawable = this.getForeground();
            if (drawable != null) {
                maxHeight = Math.max(maxHeight, drawable.getMinimumHeight());
                maxWidth = Math.max(maxWidth, drawable.getMinimumWidth());
            }

            this.setMeasuredDimension(View.resolveSizeAndState(maxWidth, widthMeasureSpec, childState),
                View.resolveSizeAndState(maxHeight, heightMeasureSpec,
                    childState << View.MEASURED_HEIGHT_STATE_SHIFT));

            count = this.mMatchParentChildren.length;
            if (count > 1) {
                for (let i = 0; i < count; i++) {
                    let child = this.mMatchParentChildren[i];

                    let lp = <ViewGroup.MarginLayoutParams> child.getLayoutParams();
                    let childWidthMeasureSpec;
                    let childHeightMeasureSpec;

                    if (lp.width == FrameLayout.LayoutParams.MATCH_PARENT) {
                        childWidthMeasureSpec = View.MeasureSpec.makeMeasureSpec(this.getMeasuredWidth() -
                            this.getPaddingLeftWithForeground() - this.getPaddingRightWithForeground() -
                            lp.leftMargin - lp.rightMargin,
                            View.MeasureSpec.EXACTLY);
                    } else {
                        childWidthMeasureSpec = ViewGroup.getChildMeasureSpec(widthMeasureSpec,
                            this.getPaddingLeftWithForeground() + this.getPaddingRightWithForeground() +
                            lp.leftMargin + lp.rightMargin,
                            lp.width);
                    }

                    if (lp.height == FrameLayout.LayoutParams.MATCH_PARENT) {
                        childHeightMeasureSpec = View.MeasureSpec.makeMeasureSpec(this.getMeasuredHeight() -
                            this.getPaddingTopWithForeground() - this.getPaddingBottomWithForeground() -
                            lp.topMargin - lp.bottomMargin,
                            View.MeasureSpec.EXACTLY);
                    } else {
                        childHeightMeasureSpec = ViewGroup.getChildMeasureSpec(heightMeasureSpec,
                            this.getPaddingTopWithForeground() + this.getPaddingBottomWithForeground() +
                            lp.topMargin + lp.bottomMargin,
                            lp.height);
                    }

                    child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
                }
            }
        }


        protected onLayout(changed:boolean, left:number, top:number, right:number, bottom:number):void {
            this.layoutChildren(left, top, right, bottom, false /* no force left gravity */);
        }

        layoutChildren(left:number, top:number, right:number, bottom:number, forceLeftGravity:boolean):void {
            const count = this.getChildCount();

            const parentLeft = this.getPaddingLeftWithForeground();
            const parentRight = right - left - this.getPaddingRightWithForeground();

            const parentTop = this.getPaddingTopWithForeground();
            const parentBottom = bottom - top - this.getPaddingBottomWithForeground();

            this.mForegroundBoundsChanged = true;

            for (let i = 0; i < count; i++) {
                let child = this.getChildAt(i);
                if (child.getVisibility() != View.GONE) {
                    const lp = <FrameLayout.LayoutParams> child.getLayoutParams();

                    const width = child.getMeasuredWidth();
                    const height = child.getMeasuredHeight();

                    let childLeft;
                    let childTop;

                    let gravity = lp.gravity;
                    if (gravity == -1) {
                        gravity = FrameLayout.DEFAULT_CHILD_GRAVITY;
                    }

                    //const layoutDirection = getLayoutDirection();
                    const absoluteGravity = gravity;//Gravity.getAbsoluteGravity(gravity, layoutDirection);
                    const verticalGravity = gravity & Gravity.VERTICAL_GRAVITY_MASK;

                    switch (absoluteGravity & Gravity.HORIZONTAL_GRAVITY_MASK) {
                        case Gravity.CENTER_HORIZONTAL:
                            childLeft = parentLeft + (parentRight - parentLeft - width) / 2 +
                                lp.leftMargin - lp.rightMargin;
                            break;
                        case Gravity.RIGHT:
                            if (!forceLeftGravity) {
                                childLeft = parentRight - width - lp.rightMargin;
                                break;
                            }
                        case Gravity.LEFT:
                        default:
                            childLeft = parentLeft + lp.leftMargin;
                    }

                    switch (verticalGravity) {
                        case Gravity.TOP:
                            childTop = parentTop + lp.topMargin;
                            break;
                        case Gravity.CENTER_VERTICAL:
                            childTop = parentTop + (parentBottom - parentTop - height) / 2 +
                                lp.topMargin - lp.bottomMargin;
                            break;
                        case Gravity.BOTTOM:
                            childTop = parentBottom - height - lp.bottomMargin;
                            break;
                        default:
                            childTop = parentTop + lp.topMargin;
                    }

                    child.layout(childLeft, childTop, childLeft + width, childTop + height);
                }
            }
        }

        protected onSizeChanged(w:number, h:number, oldw:number, oldh:number):void {
            super.onSizeChanged(w, h, oldw, oldh);
            this.mForegroundBoundsChanged = true;
        }

        draw(canvas:Canvas){
            super.draw(canvas);

            if (this.mForeground != null) {
                const foreground = this.mForeground;

                if (this.mForegroundBoundsChanged) {
                    this.mForegroundBoundsChanged = false;
                    const selfBounds = this.mSelfBounds;
                    const overlayBounds = this.mOverlayBounds;

                    const w = this.mRight - this.mLeft;
                    const h = this.mBottom - this.mTop;

                    if (this.mForegroundInPadding) {
                        selfBounds.set(0, 0, w, h);
                    } else {
                        selfBounds.set(this.mPaddingLeft, this.mPaddingTop, w - this.mPaddingRight, h - this.mPaddingBottom);
                    }

                    //const layoutDirection = this.getLayoutDirection();
                    Gravity.apply(this.mForegroundGravity, foreground.getIntrinsicWidth(),
                        foreground.getIntrinsicHeight(), selfBounds, overlayBounds);
                    foreground.setBounds(overlayBounds);
                }

                foreground.draw(canvas);
            }
        }

        /**
         * Sets whether to consider all children, or just those in
         * the VISIBLE or INVISIBLE state, when measuring. Defaults to false.
         *
         * @param measureAll true to consider children marked GONE, false otherwise.
         * Default value is false.
         *
         * @attr ref android.R.styleable#FrameLayout_measureAllChildren
         */
        setMeasureAllChildren( measureAll:boolean) {
            this.mMeasureAllChildren = measureAll;
        }
        /**
         * Determines whether all children, or just those in the VISIBLE or
         * INVISIBLE state, are considered when measuring.
         *
         * @return Whether all children are considered when measuring.
         */
        getMeasureAllChildren() {
            return this.mMeasureAllChildren;
        }

        public generateLayoutParamsFromAttr(attrs: HTMLElement): android.view.ViewGroup.LayoutParams {
            return new FrameLayout.LayoutParams(this.getContext(), attrs);
        }

        shouldDelayChildPressedState():boolean {
            return false;
        }
        protected checkLayoutParams(p:ViewGroup.LayoutParams){
            return p instanceof FrameLayout.LayoutParams;
        }
        protected generateLayoutParams(p:ViewGroup.LayoutParams){
            return new FrameLayout.LayoutParams(p);
        }
    }

    export module FrameLayout {
        /**
         * Per-child layout information for layouts that support margins.
         * See {@link android.R.styleable#FrameLayout_Layout FrameLayout Layout Attributes}
         * for a list of all child view attributes that this class supports.
         *
         * @attr ref android.R.styleable#FrameLayout_Layout_layout_gravity
         */
        export class LayoutParams extends ViewGroup.MarginLayoutParams {
            /**
             * The gravity to apply with the View to which these layout parameters
             * are associated.
             *
             * @see android.view.Gravity
             *
             * @attr ref android.R.styleable#FrameLayout_Layout_layout_gravity
             */
            gravity = -1;

            constructor(context:Context, attrs:HTMLElement);
            constructor();
            /**
             * Copy constructor. Clones the width, height, margin values, and
             * gravity of the source.
             *
             * @param source The layout params to copy from.
             */
            constructor(source:ViewGroup.LayoutParams);
            /**
             * Creates a new set of layout parameters with the specified width, height
             * and weight.
             *
             * @param width the width, either {@link #MATCH_PARENT},
             *        {@link #WRAP_CONTENT} or a fixed size in pixels
             * @param height the height, either {@link #MATCH_PARENT},
             *        {@link #WRAP_CONTENT} or a fixed size in pixels
             * @param gravity the gravity
             *
             * @see android.view.Gravity
             */
            constructor(width:number, height:number, gravity?:number);
            constructor(...args) {
                super(...(() => {
                    if (args[0] instanceof android.content.Context && args[1] instanceof HTMLElement) return [args[0], args[1]];
                    else if (typeof args[0] === 'number' && typeof args[1] === 'number' && typeof args[2] === 'number') return [args[0], args[1]];
                    else if (typeof args[0] === 'number' && typeof args[1] === 'number') return [args[0], args[1]];
                    else if (args[0] instanceof ViewGroup.LayoutParams) return [args[0]];
                })());
                if (args[0] instanceof Context && args[1] instanceof HTMLElement) {
                    const c = <Context>args[0];
                    const attrs = <HTMLElement>args[1];
                    const a = c.obtainStyledAttributes(attrs);
                    this.gravity = Gravity.parseGravity(a.getAttrValue('layout_gravity'), -1);
                    a.recycle();
                } else if (typeof args[0] === 'number' && typeof args[1] === 'number' && typeof args[2] === 'number') {
                    this.gravity = args[2];
                } else if (typeof args[0] === 'number' && typeof args[1] === 'number') {
                } else if (args[0] instanceof FrameLayout.LayoutParams) {
                    const source = <FrameLayout.LayoutParams>args[0];
                    this.gravity = source.gravity;
                } else if (args[0] instanceof ViewGroup.MarginLayoutParams) {
                } else if (args[0] instanceof ViewGroup.LayoutParams) {
                }
            }

            protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
                return super.createClassAttrBinder().set('layout_gravity', {
                    setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                        param.gravity = attrBinder.parseGravity(value, param.gravity);
                    }, getter(param:LayoutParams) {
                        return param.gravity;
                    }
                });
            }
        }
    }
}
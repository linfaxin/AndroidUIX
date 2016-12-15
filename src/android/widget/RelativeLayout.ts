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

///<reference path="../../android/util/ArrayMap.ts"/>
///<reference path="../../java/util/ArrayDeque.ts"/>
///<reference path="../../java/util/ArrayList.ts"/>
///<reference path="../../android/graphics/Rect.ts"/>
///<reference path="../../android/util/Pools.ts"/>
///<reference path="../../android/util/SparseArray.ts"/>
///<reference path="../../android/util/SparseMap.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../java/lang/Integer.ts"/>
///<reference path="../../java/lang/System.ts"/>
///<reference path="../../android/widget/HorizontalScrollView.ts"/>
///<reference path="../../android/widget/ScrollView.ts"/>

module android.widget {
import ArrayMap = android.util.ArrayMap;
import ArrayDeque = java.util.ArrayDeque;
import ArrayList = java.util.ArrayList;
import Rect = android.graphics.Rect;
import SynchronizedPool = android.util.Pools.SynchronizedPool;
import SparseArray = android.util.SparseArray;
import SparseMap = android.util.SparseMap;
import Gravity = android.view.Gravity;
import View = android.view.View;
import ViewGroup = android.view.ViewGroup;
import Integer = java.lang.Integer;
import System = java.lang.System;
import HorizontalScrollView = android.widget.HorizontalScrollView;
import ScrollView = android.widget.ScrollView;
import AttrBinder = androidui.attr.AttrBinder;
import Context = android.content.Context;

/**
 * A Layout where the positions of the children can be described in relation to each other or to the
 * parent.
 *
 * <p>
 * Note that you cannot have a circular dependency between the size of the RelativeLayout and the
 * position of its children. For example, you cannot have a RelativeLayout whose height is set to
 * {@link android.view.ViewGroup.LayoutParams#WRAP_CONTENT WRAP_CONTENT} and a child set to
 * {@link #ALIGN_PARENT_BOTTOM}.
 * </p>
 *
 * <p><strong>Note:</strong> In platform version 17 and lower, RelativeLayout was affected by
 * a measurement bug that could cause child views to be measured with incorrect
 * {@link android.view.View.MeasureSpec MeasureSpec} values. (See
 * {@link android.view.View.MeasureSpec#makeMeasureSpec(int, int) MeasureSpec.makeMeasureSpec}
 * for more details.) This was triggered when a RelativeLayout container was placed in
 * a scrolling container, such as a ScrollView or HorizontalScrollView. If a custom view
 * not equipped to properly measure with the MeasureSpec mode
 * {@link android.view.View.MeasureSpec#UNSPECIFIED UNSPECIFIED} was placed in a RelativeLayout,
 * this would silently work anyway as RelativeLayout would pass a very large
 * {@link android.view.View.MeasureSpec#AT_MOST AT_MOST} MeasureSpec instead.</p>
 *
 * <p>This behavior has been preserved for apps that set <code>android:targetSdkVersion="17"</code>
 * or older in their manifest's <code>uses-sdk</code> tag for compatibility. Apps targeting SDK
 * version 18 or newer will receive the correct behavior</p>
 *
 * <p>See the <a href="{@docRoot}guide/topics/ui/layout/relative.html">Relative
 * Layout</a> guide.</p>
 *
 * <p>
 * Also see {@link android.widget.RelativeLayout.LayoutParams RelativeLayout.LayoutParams} for
 * layout attributes
 * </p>
 *
 * @attr ref android.R.styleable#RelativeLayout_gravity
 * @attr ref android.R.styleable#RelativeLayout_ignoreGravity
 */
export class RelativeLayout extends ViewGroup {

    static TRUE:string = "";

    /**
     * Rule that aligns a child's right edge with another child's left edge.
     */
    static LEFT_OF:number = 0;

    /**
     * Rule that aligns a child's left edge with another child's right edge.
     */
    static RIGHT_OF:number = 1;

    /**
     * Rule that aligns a child's bottom edge with another child's top edge.
     */
    static ABOVE:number = 2;

    /**
     * Rule that aligns a child's top edge with another child's bottom edge.
     */
    static BELOW:number = 3;

    /**
     * Rule that aligns a child's baseline with another child's baseline.
     */
    static ALIGN_BASELINE:number = 4;

    /**
     * Rule that aligns a child's left edge with another child's left edge.
     */
    static ALIGN_LEFT:number = 5;

    /**
     * Rule that aligns a child's top edge with another child's top edge.
     */
    static ALIGN_TOP:number = 6;

    /**
     * Rule that aligns a child's right edge with another child's right edge.
     */
    static ALIGN_RIGHT:number = 7;

    /**
     * Rule that aligns a child's bottom edge with another child's bottom edge.
     */
    static ALIGN_BOTTOM:number = 8;

    /**
     * Rule that aligns the child's left edge with its RelativeLayout
     * parent's left edge.
     */
    static ALIGN_PARENT_LEFT:number = 9;

    /**
     * Rule that aligns the child's top edge with its RelativeLayout
     * parent's top edge.
     */
    static ALIGN_PARENT_TOP:number = 10;

    /**
     * Rule that aligns the child's right edge with its RelativeLayout
     * parent's right edge.
     */
    static ALIGN_PARENT_RIGHT:number = 11;

    /**
     * Rule that aligns the child's bottom edge with its RelativeLayout
     * parent's bottom edge.
     */
    static ALIGN_PARENT_BOTTOM:number = 12;

    /**
     * Rule that centers the child with respect to the bounds of its
     * RelativeLayout parent.
     */
    static CENTER_IN_PARENT:number = 13;

    /**
     * Rule that centers the child horizontally with respect to the
     * bounds of its RelativeLayout parent.
     */
    static CENTER_HORIZONTAL:number = 14;

    /**
     * Rule that centers the child vertically with respect to the
     * bounds of its RelativeLayout parent.
     */
    static CENTER_VERTICAL:number = 15;

    /**
     * Rule that aligns a child's end edge with another child's start edge.
     */
    static START_OF:number = 16;

    /**
     * Rule that aligns a child's start edge with another child's end edge.
     */
    static END_OF:number = 17;

    /**
     * Rule that aligns a child's start edge with another child's start edge.
     */
    static ALIGN_START:number = 18;

    /**
     * Rule that aligns a child's end edge with another child's end edge.
     */
    static ALIGN_END:number = 19;

    /**
     * Rule that aligns the child's start edge with its RelativeLayout
     * parent's start edge.
     */
    static ALIGN_PARENT_START:number = 20;

    /**
     * Rule that aligns the child's end edge with its RelativeLayout
     * parent's end edge.
     */
    static ALIGN_PARENT_END:number = 21;

    static VERB_COUNT:number = 22;

    private static RULES_VERTICAL:number[] = [ RelativeLayout.ABOVE, RelativeLayout.BELOW, RelativeLayout.ALIGN_BASELINE, RelativeLayout.ALIGN_TOP, RelativeLayout.ALIGN_BOTTOM ];

    private static RULES_HORIZONTAL:number[] = [ RelativeLayout.LEFT_OF, RelativeLayout.RIGHT_OF, RelativeLayout.ALIGN_LEFT, RelativeLayout.ALIGN_RIGHT, RelativeLayout.START_OF, RelativeLayout.END_OF, RelativeLayout.ALIGN_START, RelativeLayout.ALIGN_END ];

    private mBaselineView:View = null;

    private mHasBaselineAlignedChild:boolean;

    private mGravity:number = Gravity.START | Gravity.TOP;

    private mContentBounds:Rect = new Rect();

    private mSelfBounds:Rect = new Rect();

    private mIgnoreGravity:string = View.NO_ID;

    //private mTopToBottomLeftToRightSet:SortedSet<View> = null;

    private mDirtyHierarchy:boolean;

    private mSortedHorizontalChildren:View[];

    private mSortedVerticalChildren:View[];

    private mGraph:RelativeLayout.DependencyGraph = new RelativeLayout.DependencyGraph();

    // Compatibility hack. Old versions of the platform had problems
    // with MeasureSpec value overflow and RelativeLayout was one source of them.
    // Some apps came to rely on them. :(
    private mAllowBrokenMeasureSpecs:boolean = false;

    // Compatibility hack. Old versions of the platform would not take
    // margins and padding into account when generating the height measure spec
    // for children during the horizontal measure pass.
    private mMeasureVerticalWithPaddingMargin:boolean = false;

    // A default width used for RTL measure pass
    /**
     * Value reduced so as not to interfere with View's measurement spec. flags. See:
     * {@link View#MEASURED_SIZE_MASK}.
     * {@link View#MEASURED_STATE_TOO_SMALL}.
     **/
    private static DEFAULT_WIDTH:number = 0x00010000;


    constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle?:Map<string, string>) {
        super(context, bindElement, defStyle);
        if (bindElement || defStyle) {
            const a = context.obtainStyledAttributes(bindElement, defStyle);
            this.mIgnoreGravity = a.getResourceId('ignoreGravity', View.NO_ID);
            this.mGravity = Gravity.parseGravity(a.getAttrValue('gravity'), this.mGravity);
            a.recycle();
        }
        this.queryCompatibilityModes();
    }

    protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
        return super.createClassAttrBinder().set('ignoreGravity', {
            setter(v:RelativeLayout, value:any, a:AttrBinder) {
                v.setIgnoreGravity(value+'');
            }, getter(v:RelativeLayout) {
                return v.mIgnoreGravity;
            }
        }).set('gravity', {
            setter(v:RelativeLayout, value:any, a:AttrBinder) {
                v.setGravity(a.parseGravity(value, v.mGravity));
            }, getter(v:RelativeLayout) {
                return v.mGravity;
            }
        });
    }

    private queryCompatibilityModes():void  {
        this.mAllowBrokenMeasureSpecs = false; //version <= Build.VERSION_CODES.JELLY_BEAN_MR1;
        this.mMeasureVerticalWithPaddingMargin = true; //version >= Build.VERSION_CODES.JELLY_BEAN_MR2;
    }

    shouldDelayChildPressedState():boolean  {
        return false;
    }

    /**
     * Defines which View is ignored when the gravity is applied. This setting has no
     * effect if the gravity is <code>Gravity.START | Gravity.TOP</code>.
     *
     * @param viewId The id of the View to be ignored by gravity, or 0 if no View
     *        should be ignored.
     *
     * @see #setGravity(int)
     *
     * @attr ref android.R.styleable#RelativeLayout_ignoreGravity
     */
    setIgnoreGravity(viewId:string):void  {
        this.mIgnoreGravity = viewId;
    }

    /**
     * Describes how the child views are positioned.
     *
     * @return the gravity.
     *
     * @see #setGravity(int)
     * @see android.view.Gravity
     *
     * @attr ref android.R.styleable#RelativeLayout_gravity
     */
    getGravity():number  {
        return this.mGravity;
    }

    /**
     * Describes how the child views are positioned. Defaults to
     * <code>Gravity.START | Gravity.TOP</code>.
     *
     * <p>Note that since RelativeLayout considers the positioning of each child
     * relative to one another to be significant, setting gravity will affect
     * the positioning of all children as a single unit within the parent.
     * This happens after children have been relatively positioned.</p>
     *
     * @param gravity See {@link android.view.Gravity}
     *
     * @see #setHorizontalGravity(int)
     * @see #setVerticalGravity(int)
     *
     * @attr ref android.R.styleable#RelativeLayout_gravity
     */
    setGravity(gravity:number):void  {
        if (this.mGravity != gravity) {
            if ((gravity & Gravity.RELATIVE_HORIZONTAL_GRAVITY_MASK) == 0) {
                gravity |= Gravity.START;
            }
            if ((gravity & Gravity.VERTICAL_GRAVITY_MASK) == 0) {
                gravity |= Gravity.TOP;
            }
            this.mGravity = gravity;
            this.requestLayout();
        }
    }

    setHorizontalGravity(horizontalGravity:number):void  {
        const gravity:number = horizontalGravity & Gravity.RELATIVE_HORIZONTAL_GRAVITY_MASK;
        if ((this.mGravity & Gravity.RELATIVE_HORIZONTAL_GRAVITY_MASK) != gravity) {
            this.mGravity = (this.mGravity & ~Gravity.RELATIVE_HORIZONTAL_GRAVITY_MASK) | gravity;
            this.requestLayout();
        }
    }

    setVerticalGravity(verticalGravity:number):void  {
        const gravity:number = verticalGravity & Gravity.VERTICAL_GRAVITY_MASK;
        if ((this.mGravity & Gravity.VERTICAL_GRAVITY_MASK) != gravity) {
            this.mGravity = (this.mGravity & ~Gravity.VERTICAL_GRAVITY_MASK) | gravity;
            this.requestLayout();
        }
    }

    getBaseline():number  {
        return this.mBaselineView != null ? this.mBaselineView.getBaseline() : super.getBaseline();
    }

    requestLayout():void  {
        super.requestLayout();
        this.mDirtyHierarchy = true;
    }

    private sortChildren():void  {
        const count:number = this.getChildCount();
        if (this.mSortedVerticalChildren == null || this.mSortedVerticalChildren.length != count) {
            this.mSortedVerticalChildren = new Array<View>(count);
        }
        if (this.mSortedHorizontalChildren == null || this.mSortedHorizontalChildren.length != count) {
            this.mSortedHorizontalChildren = new Array<View>(count);
        }
        const graph:RelativeLayout.DependencyGraph = this.mGraph;
        graph.clear();
        for (let i:number = 0; i < count; i++) {
            graph.add(this.getChildAt(i));
        }
        graph.getSortedViews(this.mSortedVerticalChildren, RelativeLayout.RULES_VERTICAL);
        graph.getSortedViews(this.mSortedHorizontalChildren, RelativeLayout.RULES_HORIZONTAL);
    }

    protected onMeasure(widthMeasureSpec:number, heightMeasureSpec:number):void  {
        if (this.mDirtyHierarchy) {
            this.mDirtyHierarchy = false;
            this.sortChildren();
        }
        let myWidth:number = -1;
        let myHeight:number = -1;
        let width:number = 0;
        let height:number = 0;
        const widthMode:number = View.MeasureSpec.getMode(widthMeasureSpec);
        const heightMode:number = View.MeasureSpec.getMode(heightMeasureSpec);
        const widthSize:number = View.MeasureSpec.getSize(widthMeasureSpec);
        const heightSize:number = View.MeasureSpec.getSize(heightMeasureSpec);
        // Record our dimensions if they are known;
        if (widthMode != View.MeasureSpec.UNSPECIFIED) {
            myWidth = widthSize;
        }
        if (heightMode != View.MeasureSpec.UNSPECIFIED) {
            myHeight = heightSize;
        }
        if (widthMode == View.MeasureSpec.EXACTLY) {
            width = myWidth;
        }
        if (heightMode == View.MeasureSpec.EXACTLY) {
            height = myHeight;
        }
        this.mHasBaselineAlignedChild = false;
        let ignore:View = null;
        let gravity:number = this.mGravity & Gravity.RELATIVE_HORIZONTAL_GRAVITY_MASK;
        const horizontalGravity:boolean = gravity != Gravity.START && gravity != 0;
        gravity = this.mGravity & Gravity.VERTICAL_GRAVITY_MASK;
        const verticalGravity:boolean = gravity != Gravity.TOP && gravity != 0;
        let left:number = Integer.MAX_VALUE;
        let top:number = Integer.MAX_VALUE;
        let right:number = Integer.MIN_VALUE;
        let bottom:number = Integer.MIN_VALUE;
        let offsetHorizontalAxis:boolean = false;
        let offsetVerticalAxis:boolean = false;
        if ((horizontalGravity || verticalGravity) && this.mIgnoreGravity != View.NO_ID) {
            ignore = this.findViewById(this.mIgnoreGravity);
        }
        const isWrapContentWidth:boolean = widthMode != View.MeasureSpec.EXACTLY;
        const isWrapContentHeight:boolean = heightMode != View.MeasureSpec.EXACTLY;
        // We need to know our size for doing the correct computation of children positioning in RTL
        // mode but there is no practical way to get it instead of running the code below.
        // So, instead of running the code twice, we just set the width to a "default display width"
        // before the computation and then, as a last pass, we will update their real position with
        // an offset equals to "DEFAULT_WIDTH - width".
        const layoutDirection:number = this.getLayoutDirection();
        if (this.isLayoutRtl() && myWidth == -1) {
            myWidth = RelativeLayout.DEFAULT_WIDTH;
        }
        let views:View[] = this.mSortedHorizontalChildren;
        let count:number = views.length;
        for (let i:number = 0; i < count; i++) {
            let child:View = views[i];
            if (child.getVisibility() != RelativeLayout.GONE) {
                let params:RelativeLayout.LayoutParams = <RelativeLayout.LayoutParams> child.getLayoutParams();
                let rules:string[] = params.getRules(layoutDirection);
                this.applyHorizontalSizeRules(params, myWidth, rules);
                this.measureChildHorizontal(child, params, myWidth, myHeight);
                if (this.positionChildHorizontal(child, params, myWidth, isWrapContentWidth)) {
                    offsetHorizontalAxis = true;
                }
            }
        }
        views = this.mSortedVerticalChildren;
        count = views.length;
        //const targetSdkVersion:number = this.getContext().getApplicationInfo().targetSdkVersion;
        for (let i:number = 0; i < count; i++) {
            let child:View = views[i];
            if (child.getVisibility() != RelativeLayout.GONE) {
                let params:RelativeLayout.LayoutParams = <RelativeLayout.LayoutParams> child.getLayoutParams();
                this.applyVerticalSizeRules(params, myHeight);
                this._measureChild(child, params, myWidth, myHeight);
                if (this.positionChildVertical(child, params, myHeight, isWrapContentHeight)) {
                    offsetVerticalAxis = true;
                }
                if (isWrapContentWidth) {
                    if (this.isLayoutRtl()) {
                        //if (targetSdkVersion < Build.VERSION_CODES.KITKAT) {
                        //    width = Math.max(width, myWidth - params.mLeft);
                        //} else {
                            width = Math.max(width, myWidth - params.mLeft - params.leftMargin);
                        //}
                    } else {
                        //if (targetSdkVersion < Build.VERSION_CODES.KITKAT) {
                        //    width = Math.max(width, params.mRight);
                        //} else {
                            width = Math.max(width, params.mRight + params.rightMargin);
                        //}
                    }
                }
                if (isWrapContentHeight) {
                    //if (targetSdkVersion < Build.VERSION_CODES.KITKAT) {
                    //    height = Math.max(height, params.mBottom);
                    //} else {
                        height = Math.max(height, params.mBottom + params.bottomMargin);
                    //}
                }
                if (child != ignore || verticalGravity) {
                    left = Math.min(left, params.mLeft - params.leftMargin);
                    top = Math.min(top, params.mTop - params.topMargin);
                }
                if (child != ignore || horizontalGravity) {
                    right = Math.max(right, params.mRight + params.rightMargin);
                    bottom = Math.max(bottom, params.mBottom + params.bottomMargin);
                }
            }
        }
        if (this.mHasBaselineAlignedChild) {
            for (let i:number = 0; i < count; i++) {
                let child:View = this.getChildAt(i);
                if (child.getVisibility() != RelativeLayout.GONE) {
                    let params:RelativeLayout.LayoutParams = <RelativeLayout.LayoutParams> child.getLayoutParams();
                    this.alignBaseline(child, params);
                    if (child != ignore || verticalGravity) {
                        left = Math.min(left, params.mLeft - params.leftMargin);
                        top = Math.min(top, params.mTop - params.topMargin);
                    }
                    if (child != ignore || horizontalGravity) {
                        right = Math.max(right, params.mRight + params.rightMargin);
                        bottom = Math.max(bottom, params.mBottom + params.bottomMargin);
                    }
                }
            }
        }
        if (isWrapContentWidth) {
            // Width already has left padding in it since it was calculated by looking at
            // the right of each child view
            width += this.mPaddingRight;
            if (this.mLayoutParams != null && this.mLayoutParams.width >= 0) {
                width = Math.max(width, this.mLayoutParams.width);
            }
            width = Math.max(width, this.getSuggestedMinimumWidth());
            width = RelativeLayout.resolveSize(width, widthMeasureSpec);
            if (offsetHorizontalAxis) {
                for (let i:number = 0; i < count; i++) {
                    let child:View = this.getChildAt(i);
                    if (child.getVisibility() != RelativeLayout.GONE) {
                        let params:RelativeLayout.LayoutParams = <RelativeLayout.LayoutParams> child.getLayoutParams();
                        const rules:string[] = params.getRules(layoutDirection);
                        if (rules[RelativeLayout.CENTER_IN_PARENT] != null || rules[RelativeLayout.CENTER_HORIZONTAL] != null) {
                            RelativeLayout.centerHorizontal(child, params, width);
                        } else if (rules[RelativeLayout.ALIGN_PARENT_RIGHT] != null) {
                            const childWidth:number = child.getMeasuredWidth();
                            params.mLeft = width - this.mPaddingRight - childWidth;
                            params.mRight = params.mLeft + childWidth;
                        }
                    }
                }
            }
        }
        if (isWrapContentHeight) {
            // Height already has top padding in it since it was calculated by looking at
            // the bottom of each child view
            height += this.mPaddingBottom;
            if (this.mLayoutParams != null && this.mLayoutParams.height >= 0) {
                height = Math.max(height, this.mLayoutParams.height);
            }
            height = Math.max(height, this.getSuggestedMinimumHeight());
            height = RelativeLayout.resolveSize(height, heightMeasureSpec);
            if (offsetVerticalAxis) {
                for (let i:number = 0; i < count; i++) {
                    let child:View = this.getChildAt(i);
                    if (child.getVisibility() != RelativeLayout.GONE) {
                        let params:RelativeLayout.LayoutParams = <RelativeLayout.LayoutParams> child.getLayoutParams();
                        const rules:string[] = params.getRules(layoutDirection);
                        if (rules[RelativeLayout.CENTER_IN_PARENT] != null || rules[RelativeLayout.CENTER_VERTICAL] != null) {
                            RelativeLayout.centerVertical(child, params, height);
                        } else if (rules[RelativeLayout.ALIGN_PARENT_BOTTOM] != null) {
                            const childHeight:number = child.getMeasuredHeight();
                            params.mTop = height - this.mPaddingBottom - childHeight;
                            params.mBottom = params.mTop + childHeight;
                        }
                    }
                }
            }
        }
        if (horizontalGravity || verticalGravity) {
            const selfBounds:Rect = this.mSelfBounds;
            selfBounds.set(this.mPaddingLeft, this.mPaddingTop, width - this.mPaddingRight, height - this.mPaddingBottom);
            const contentBounds:Rect = this.mContentBounds;
            Gravity.apply(this.mGravity, right - left, bottom - top, selfBounds, contentBounds, layoutDirection);
            const horizontalOffset:number = contentBounds.left - left;
            const verticalOffset:number = contentBounds.top - top;
            if (horizontalOffset != 0 || verticalOffset != 0) {
                for (let i:number = 0; i < count; i++) {
                    let child:View = this.getChildAt(i);
                    if (child.getVisibility() != RelativeLayout.GONE && child != ignore) {
                        let params:RelativeLayout.LayoutParams = <RelativeLayout.LayoutParams> child.getLayoutParams();
                        if (horizontalGravity) {
                            params.mLeft += horizontalOffset;
                            params.mRight += horizontalOffset;
                        }
                        if (verticalGravity) {
                            params.mTop += verticalOffset;
                            params.mBottom += verticalOffset;
                        }
                    }
                }
            }
        }
        if (this.isLayoutRtl()) {
            const offsetWidth:number = myWidth - width;
            for (let i:number = 0; i < count; i++) {
                let child:View = this.getChildAt(i);
                if (child.getVisibility() != RelativeLayout.GONE) {
                    let params:RelativeLayout.LayoutParams = <RelativeLayout.LayoutParams> child.getLayoutParams();
                    params.mLeft -= offsetWidth;
                    params.mRight -= offsetWidth;
                }
            }
        }
        this.setMeasuredDimension(width, height);
    }

    private alignBaseline(child:View, params:RelativeLayout.LayoutParams):void  {
        const layoutDirection:number = this.getLayoutDirection();
        let rules:string[] = params.getRules(layoutDirection);
        let anchorBaseline:number = this.getRelatedViewBaseline(rules, RelativeLayout.ALIGN_BASELINE);
        if (anchorBaseline != -1) {
            let anchorParams:RelativeLayout.LayoutParams = this.getRelatedViewParams(rules, RelativeLayout.ALIGN_BASELINE);
            if (anchorParams != null) {
                let offset:number = anchorParams.mTop + anchorBaseline;
                let baseline:number = child.getBaseline();
                if (baseline != -1) {
                    offset -= baseline;
                }
                let height:number = params.mBottom - params.mTop;
                params.mTop = offset;
                params.mBottom = params.mTop + height;
            }
        }
        if (this.mBaselineView == null) {
            this.mBaselineView = child;
        } else {
            let lp:RelativeLayout.LayoutParams = <RelativeLayout.LayoutParams> this.mBaselineView.getLayoutParams();
            if (params.mTop < lp.mTop || (params.mTop == lp.mTop && params.mLeft < lp.mLeft)) {
                this.mBaselineView = child;
            }
        }
    }

    /**
     * Measure a child. The child should have left, top, right and bottom information
     * stored in its LayoutParams. If any of these values is -1 it means that the view
     * can extend up to the corresponding edge.
     *
     * @param child Child to measure
     * @param params LayoutParams associated with child
     * @param myWidth Width of the the RelativeLayout
     * @param myHeight Height of the RelativeLayout
     */
    private _measureChild(child:View, params:RelativeLayout.LayoutParams, myWidth:number, myHeight:number):void  {
        let childWidthMeasureSpec:number = this.getChildMeasureSpec(params.mLeft, params.mRight, params.width, params.leftMargin, params.rightMargin, this.mPaddingLeft, this.mPaddingRight, myWidth);
        let childHeightMeasureSpec:number = this.getChildMeasureSpec(params.mTop, params.mBottom, params.height, params.topMargin, params.bottomMargin, this.mPaddingTop, this.mPaddingBottom, myHeight);
        child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
    }

    private measureChildHorizontal(child:View, params:RelativeLayout.LayoutParams, myWidth:number, myHeight:number):void  {
        let childWidthMeasureSpec:number = this.getChildMeasureSpec(params.mLeft, params.mRight, params.width, params.leftMargin, params.rightMargin, this.mPaddingLeft, this.mPaddingRight, myWidth);
        let maxHeight:number = myHeight;
        if (this.mMeasureVerticalWithPaddingMargin) {
            maxHeight = Math.max(0, myHeight - this.mPaddingTop - this.mPaddingBottom - params.topMargin - params.bottomMargin);
        }
        let childHeightMeasureSpec:number;
        if (myHeight < 0 && !this.mAllowBrokenMeasureSpecs) {
            if (params.height >= 0) {
                childHeightMeasureSpec = View.MeasureSpec.makeMeasureSpec(params.height, View.MeasureSpec.EXACTLY);
            } else {
                // Negative values in a mySize/myWidth/myWidth value in RelativeLayout measurement
                // is code for, "we got an unspecified mode in the RelativeLayout's measurespec."
                // Carry it forward.
                childHeightMeasureSpec = View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED);
            }
        } else if (params.width == RelativeLayout.LayoutParams.MATCH_PARENT) {
            childHeightMeasureSpec = View.MeasureSpec.makeMeasureSpec(maxHeight, View.MeasureSpec.EXACTLY);
        } else {
            childHeightMeasureSpec = View.MeasureSpec.makeMeasureSpec(maxHeight, View.MeasureSpec.AT_MOST);
        }
        child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
    }

    /**
     * Get a measure spec that accounts for all of the constraints on this view.
     * This includes size constraints imposed by the RelativeLayout as well as
     * the View's desired dimension.
     *
     * @param childStart The left or top field of the child's layout params
     * @param childEnd The right or bottom field of the child's layout params
     * @param childSize The child's desired size (the width or height field of
     *        the child's layout params)
     * @param startMargin The left or top margin
     * @param endMargin The right or bottom margin
     * @param startPadding mPaddingLeft or mPaddingTop
     * @param endPadding mPaddingRight or mPaddingBottom
     * @param mySize The width or height of this view (the RelativeLayout)
     * @return MeasureSpec for the child
     */
    private getChildMeasureSpec(childStart:number, childEnd:number, childSize:number, startMargin:number, endMargin:number, startPadding:number, endPadding:number, mySize:number):number  {
        if (mySize < 0 && !this.mAllowBrokenMeasureSpecs) {
            if (childSize >= 0) {
                return View.MeasureSpec.makeMeasureSpec(childSize, View.MeasureSpec.EXACTLY);
            }
            // Carry it forward.
            return View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED);
        }
        let childSpecMode:number = 0;
        let childSpecSize:number = 0;
        // Figure out start and end bounds.
        let tempStart:number = childStart;
        let tempEnd:number = childEnd;
        // view's margins and our padding
        if (tempStart < 0) {
            tempStart = startPadding + startMargin;
        }
        if (tempEnd < 0) {
            tempEnd = mySize - endPadding - endMargin;
        }
        // Figure out maximum size available to this view
        let maxAvailable:number = tempEnd - tempStart;
        if (childStart >= 0 && childEnd >= 0) {
            // Constraints fixed both edges, so child must be an exact size
            childSpecMode = View.MeasureSpec.EXACTLY;
            childSpecSize = maxAvailable;
        } else {
            if (childSize >= 0) {
                // Child wanted an exact size. Give as much as possible
                childSpecMode = View.MeasureSpec.EXACTLY;
                if (maxAvailable >= 0) {
                    // We have a maxmum size in this dimension.
                    childSpecSize = Math.min(maxAvailable, childSize);
                } else {
                    // We can grow in this dimension.
                    childSpecSize = childSize;
                }
            } else if (childSize == RelativeLayout.LayoutParams.MATCH_PARENT) {
                // Child wanted to be as big as possible. Give all available
                // space
                childSpecMode = View.MeasureSpec.EXACTLY;
                childSpecSize = maxAvailable;
            } else if (childSize == RelativeLayout.LayoutParams.WRAP_CONTENT) {
                // our max size
                if (maxAvailable >= 0) {
                    // We have a maximum size in this dimension.
                    childSpecMode = View.MeasureSpec.AT_MOST;
                    childSpecSize = maxAvailable;
                } else {
                    // We can grow in this dimension. Child can be as big as it
                    // wants
                    childSpecMode = View.MeasureSpec.UNSPECIFIED;
                    childSpecSize = 0;
                }
            }
        }
        return View.MeasureSpec.makeMeasureSpec(childSpecSize, childSpecMode);
    }

    private positionChildHorizontal(child:View, params:RelativeLayout.LayoutParams, myWidth:number, wrapContent:boolean):boolean  {
        const layoutDirection:number = this.getLayoutDirection();
        let rules:string[] = params.getRules(layoutDirection);
        if (params.mLeft < 0 && params.mRight >= 0) {
            // Right is fixed, but left varies
            params.mLeft = params.mRight - child.getMeasuredWidth();
        } else if (params.mLeft >= 0 && params.mRight < 0) {
            // Left is fixed, but right varies
            params.mRight = params.mLeft + child.getMeasuredWidth();
        } else if (params.mLeft < 0 && params.mRight < 0) {
            // Both left and right vary
            if (rules[RelativeLayout.CENTER_IN_PARENT] != null || rules[RelativeLayout.CENTER_HORIZONTAL] != null) {
                if (!wrapContent) {
                    RelativeLayout.centerHorizontal(child, params, myWidth);
                } else {
                    params.mLeft = this.mPaddingLeft + params.leftMargin;
                    params.mRight = params.mLeft + child.getMeasuredWidth();
                }
                return true;
            } else {
                // from the left. This will give LEFT/TOP for LTR and RIGHT/TOP for RTL.
                if (this.isLayoutRtl()) {
                    params.mRight = myWidth - this.mPaddingRight - params.rightMargin;
                    params.mLeft = params.mRight - child.getMeasuredWidth();
                } else {
                    params.mLeft = this.mPaddingLeft + params.leftMargin;
                    params.mRight = params.mLeft + child.getMeasuredWidth();
                }
            }
        }
        return rules[RelativeLayout.ALIGN_PARENT_END] != null;
    }

    private positionChildVertical(child:View, params:RelativeLayout.LayoutParams, myHeight:number, wrapContent:boolean):boolean  {
        let rules:string[] = params.getRules();
        if (params.mTop < 0 && params.mBottom >= 0) {
            // Bottom is fixed, but top varies
            params.mTop = params.mBottom - child.getMeasuredHeight();
        } else if (params.mTop >= 0 && params.mBottom < 0) {
            // Top is fixed, but bottom varies
            params.mBottom = params.mTop + child.getMeasuredHeight();
        } else if (params.mTop < 0 && params.mBottom < 0) {
            // Both top and bottom vary
            if (rules[RelativeLayout.CENTER_IN_PARENT] != null || rules[RelativeLayout.CENTER_VERTICAL] != null) {
                if (!wrapContent) {
                    RelativeLayout.centerVertical(child, params, myHeight);
                } else {
                    params.mTop = this.mPaddingTop + params.topMargin;
                    params.mBottom = params.mTop + child.getMeasuredHeight();
                }
                return true;
            } else {
                params.mTop = this.mPaddingTop + params.topMargin;
                params.mBottom = params.mTop + child.getMeasuredHeight();
            }
        }
        return rules[RelativeLayout.ALIGN_PARENT_BOTTOM] != null;
    }

    private applyHorizontalSizeRules(childParams:RelativeLayout.LayoutParams, myWidth:number, rules:string[]):void  {
        let anchorParams:RelativeLayout.LayoutParams;
        // -1 indicated a "soft requirement" in that direction. For example:
        // left=10, right=-1 means the view must start at 10, but can go as far as it wants to the right
        // left =-1, right=10 means the view must end at 10, but can go as far as it wants to the left
        // left=10, right=20 means the left and right ends are both fixed
        childParams.mLeft = -1;
        childParams.mRight = -1;
        anchorParams = this.getRelatedViewParams(rules, RelativeLayout.LEFT_OF);
        if (anchorParams != null) {
            childParams.mRight = anchorParams.mLeft - (anchorParams.leftMargin + childParams.rightMargin);
        } else if (childParams.alignWithParent && rules[RelativeLayout.LEFT_OF] != null) {
            if (myWidth >= 0) {
                childParams.mRight = myWidth - this.mPaddingRight - childParams.rightMargin;
            }
        }
        anchorParams = this.getRelatedViewParams(rules, RelativeLayout.RIGHT_OF);
        if (anchorParams != null) {
            childParams.mLeft = anchorParams.mRight + (anchorParams.rightMargin + childParams.leftMargin);
        } else if (childParams.alignWithParent && rules[RelativeLayout.RIGHT_OF] != null) {
            childParams.mLeft = this.mPaddingLeft + childParams.leftMargin;
        }
        anchorParams = this.getRelatedViewParams(rules, RelativeLayout.ALIGN_LEFT);
        if (anchorParams != null) {
            childParams.mLeft = anchorParams.mLeft + childParams.leftMargin;
        } else if (childParams.alignWithParent && rules[RelativeLayout.ALIGN_LEFT] != null) {
            childParams.mLeft = this.mPaddingLeft + childParams.leftMargin;
        }
        anchorParams = this.getRelatedViewParams(rules, RelativeLayout.ALIGN_RIGHT);
        if (anchorParams != null) {
            childParams.mRight = anchorParams.mRight - childParams.rightMargin;
        } else if (childParams.alignWithParent && rules[RelativeLayout.ALIGN_RIGHT] != null) {
            if (myWidth >= 0) {
                childParams.mRight = myWidth - this.mPaddingRight - childParams.rightMargin;
            }
        }
        if (null != rules[RelativeLayout.ALIGN_PARENT_LEFT]) {
            childParams.mLeft = this.mPaddingLeft + childParams.leftMargin;
        }
        if (null != rules[RelativeLayout.ALIGN_PARENT_RIGHT]) {
            if (myWidth >= 0) {
                childParams.mRight = myWidth - this.mPaddingRight - childParams.rightMargin;
            }
        }
    }

    private applyVerticalSizeRules(childParams:RelativeLayout.LayoutParams, myHeight:number):void  {
        let rules:string[] = childParams.getRules();
        let anchorParams:RelativeLayout.LayoutParams;
        childParams.mTop = -1;
        childParams.mBottom = -1;
        anchorParams = this.getRelatedViewParams(rules, RelativeLayout.ABOVE);
        if (anchorParams != null) {
            childParams.mBottom = anchorParams.mTop - (anchorParams.topMargin + childParams.bottomMargin);
        } else if (childParams.alignWithParent && rules[RelativeLayout.ABOVE] != null) {
            if (myHeight >= 0) {
                childParams.mBottom = myHeight - this.mPaddingBottom - childParams.bottomMargin;
            }
        }
        anchorParams = this.getRelatedViewParams(rules, RelativeLayout.BELOW);
        if (anchorParams != null) {
            childParams.mTop = anchorParams.mBottom + (anchorParams.bottomMargin + childParams.topMargin);
        } else if (childParams.alignWithParent && rules[RelativeLayout.BELOW] != null) {
            childParams.mTop = this.mPaddingTop + childParams.topMargin;
        }
        anchorParams = this.getRelatedViewParams(rules, RelativeLayout.ALIGN_TOP);
        if (anchorParams != null) {
            childParams.mTop = anchorParams.mTop + childParams.topMargin;
        } else if (childParams.alignWithParent && rules[RelativeLayout.ALIGN_TOP] != null) {
            childParams.mTop = this.mPaddingTop + childParams.topMargin;
        }
        anchorParams = this.getRelatedViewParams(rules, RelativeLayout.ALIGN_BOTTOM);
        if (anchorParams != null) {
            childParams.mBottom = anchorParams.mBottom - childParams.bottomMargin;
        } else if (childParams.alignWithParent && rules[RelativeLayout.ALIGN_BOTTOM] != null) {
            if (myHeight >= 0) {
                childParams.mBottom = myHeight - this.mPaddingBottom - childParams.bottomMargin;
            }
        }
        if (null != rules[RelativeLayout.ALIGN_PARENT_TOP]) {
            childParams.mTop = this.mPaddingTop + childParams.topMargin;
        }
        if (null != rules[RelativeLayout.ALIGN_PARENT_BOTTOM]) {
            if (myHeight >= 0) {
                childParams.mBottom = myHeight - this.mPaddingBottom - childParams.bottomMargin;
            }
        }
        if (rules[RelativeLayout.ALIGN_BASELINE] != null) {
            this.mHasBaselineAlignedChild = true;
        }
    }

    private getRelatedView(rules:string[], relation:number):View  {
        let id:string = rules[relation];
        if (id != null) {
            let node:RelativeLayout.DependencyGraph.Node = this.mGraph.mKeyNodes.get(id);
            if (node == null)
                return null;
            let v:View = node.view;
            // Find the first non-GONE view up the chain
            while (v.getVisibility() == View.GONE) {
                rules = (<RelativeLayout.LayoutParams> v.getLayoutParams()).getRules(v.getLayoutDirection());
                node = this.mGraph.mKeyNodes.get((rules[relation]));
                if (node == null)
                    return null;
                v = node.view;
            }
            return v;
        }
        return null;
    }

    private getRelatedViewParams(rules:string[], relation:number):RelativeLayout.LayoutParams  {
        let v:View = this.getRelatedView(rules, relation);
        if (v != null) {
            let params:ViewGroup.LayoutParams = v.getLayoutParams();
            if (params instanceof RelativeLayout.LayoutParams) {
                return <RelativeLayout.LayoutParams> v.getLayoutParams();
            }
        }
        return null;
    }

    private getRelatedViewBaseline(rules:string[], relation:number):number  {
        let v:View = this.getRelatedView(rules, relation);
        if (v != null) {
            return v.getBaseline();
        }
        return -1;
    }

    private static centerHorizontal(child:View, params:RelativeLayout.LayoutParams, myWidth:number):void  {
        let childWidth:number = child.getMeasuredWidth();
        let left:number = (myWidth - childWidth) / 2;
        params.mLeft = left;
        params.mRight = left + childWidth;
    }

    private static centerVertical(child:View, params:RelativeLayout.LayoutParams, myHeight:number):void  {
        let childHeight:number = child.getMeasuredHeight();
        let top:number = (myHeight - childHeight) / 2;
        params.mTop = top;
        params.mBottom = top + childHeight;
    }

    protected onLayout(changed:boolean, l:number, t:number, r:number, b:number):void  {
        //  The layout has actually already been performed and the positions
        //  cached.  Apply the cached values to the children.
        const count:number = this.getChildCount();
        for (let i:number = 0; i < count; i++) {
            let child:View = this.getChildAt(i);
            if (child.getVisibility() != RelativeLayout.GONE) {
                let st:RelativeLayout.LayoutParams = <RelativeLayout.LayoutParams> child.getLayoutParams();
                child.layout(st.mLeft, st.mTop, st.mRight, st.mBottom);
            }
        }
    }

    public generateLayoutParamsFromAttr(attrs: HTMLElement): android.view.ViewGroup.LayoutParams {
        return new RelativeLayout.LayoutParams(this.getContext(), attrs);
    }

    /**
     * Returns a set of layout parameters with a width of
     * {@link android.view.ViewGroup.LayoutParams#WRAP_CONTENT},
     * a height of {@link android.view.ViewGroup.LayoutParams#WRAP_CONTENT} and no spanning.
     */
    protected generateDefaultLayoutParams():ViewGroup.LayoutParams  {
        return new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
    }

    // Override to allow type-checking of LayoutParams.
    protected checkLayoutParams(p:ViewGroup.LayoutParams):boolean  {
        return p instanceof RelativeLayout.LayoutParams;
    }

    protected generateLayoutParams(p:ViewGroup.LayoutParams):ViewGroup.LayoutParams  {
        return new RelativeLayout.LayoutParams(p);
    }
    //
    //dispatchPopulateAccessibilityEvent(event:AccessibilityEvent):boolean  {
    //    if (this.mTopToBottomLeftToRightSet == null) {
    //        this.mTopToBottomLeftToRightSet = new TreeSet<View>(new RelativeLayout.TopToBottomLeftToRightComparator(this));
    //    }
    //    // sort children top-to-bottom and left-to-right
    //    for (let i:number = 0, count:number = this.getChildCount(); i < count; i++) {
    //        this.mTopToBottomLeftToRightSet.add(this.getChildAt(i));
    //    }
    //    for (let view:View of this.mTopToBottomLeftToRightSet) {
    //        if (view.getVisibility() == View.VISIBLE && view.dispatchPopulateAccessibilityEvent(event)) {
    //            this.mTopToBottomLeftToRightSet.clear();
    //            return true;
    //        }
    //    }
    //    this.mTopToBottomLeftToRightSet.clear();
    //    return false;
    //}
    //
    //onInitializeAccessibilityEvent(event:AccessibilityEvent):void  {
    //    super.onInitializeAccessibilityEvent(event);
    //    event.setClassName(RelativeLayout.class.getName());
    //}
    //
    //onInitializeAccessibilityNodeInfo(info:AccessibilityNodeInfo):void  {
    //    super.onInitializeAccessibilityNodeInfo(info);
    //    info.setClassName(RelativeLayout.class.getName());
    //}






}

export module RelativeLayout{
///**
//     * Compares two views in left-to-right and top-to-bottom fashion.
//     */
//export class TopToBottomLeftToRightComparator implements Comparator<View> {
//    _RelativeLayout_this:RelativeLayout;
//    constructor(arg:RelativeLayout){
//        this._RelativeLayout_this = arg;
//    }
//
//    compare(first:View, second:View):number  {
//        // top - bottom
//        let topDifference:number = first.getTop() - second.getTop();
//        if (topDifference != 0) {
//            return topDifference;
//        }
//        // left - right
//        let leftDifference:number = first.getLeft() - second.getLeft();
//        if (leftDifference != 0) {
//            return leftDifference;
//        }
//        // break tie by height
//        let heightDiference:number = first.getHeight() - second.getHeight();
//        if (heightDiference != 0) {
//            return heightDiference;
//        }
//        // break tie by width
//        let widthDiference:number = first.getWidth() - second.getWidth();
//        if (widthDiference != 0) {
//            return widthDiference;
//        }
//        return 0;
//    }
//}
        /**
     * Per-child layout information associated with RelativeLayout.
     *
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_alignWithParentIfMissing
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_toLeftOf
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_toRightOf
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_above
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_below
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_alignBaseline
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_alignLeft
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_alignTop
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_alignRight
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_alignBottom
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_alignParentLeft
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_alignParentTop
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_alignParentRight
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_alignParentBottom
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_centerInParent
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_centerHorizontal
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_centerVertical
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_toStartOf
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_toEndOf
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_alignStart
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_alignEnd
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_alignParentStart
     * @attr ref android.R.styleable#RelativeLayout_Layout_layout_alignParentEnd
     */
export class LayoutParams extends ViewGroup.MarginLayoutParams {

    private mRules:string[] = new Array<string>(RelativeLayout.VERB_COUNT);

    private mInitialRules:string[] = new Array<string>(RelativeLayout.VERB_COUNT);

    mLeft:number = 0;
    mTop:number = 0;
    mRight:number = 0;
    mBottom:number = 0;

    private mStart:number = LayoutParams.DEFAULT_MARGIN_RELATIVE;

    private mEnd:number = LayoutParams.DEFAULT_MARGIN_RELATIVE;

    private mRulesChanged:boolean = false;

    private mIsRtlCompatibilityMode:boolean = false;

    /**
         * When true, uses the parent as the anchor if the anchor doesn't exist or if
         * the anchor's visibility is GONE.
         */
    alignWithParent:boolean;

    //constructor( c:Context, attrs:AttributeSet) {
    //    super(c, attrs);
    //    let a:TypedArray = c.obtainStyledAttributes(attrs, com.android.internal.R.styleable.RelativeLayout_Layout);
    //    const targetSdkVersion:number = c.getApplicationInfo().targetSdkVersion;
    //    this.mIsRtlCompatibilityMode = (targetSdkVersion < JELLY_BEAN_MR1 || !c.getApplicationInfo().hasRtlSupport());
    //    const rules:number[] = this.mRules;
    //    //noinspection MismatchedReadAndWriteOfArray
    //    const initialRules:number[] = this.mInitialRules;
    //    const N:number = a.getIndexCount();
    //    for (let i:number = 0; i < N; i++) {
    //        let attr:number = a.getIndex(i);
    //        switch(attr) {
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_alignWithParentIfMissing:
    //                this.alignWithParent = a.getBoolean(attr, false);
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_toLeftOf:
    //                rules[RelativeLayout.LEFT_OF] = a.getResourceId(attr, 0);
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_toRightOf:
    //                rules[RelativeLayout.RIGHT_OF] = a.getResourceId(attr, 0);
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_above:
    //                rules[RelativeLayout.ABOVE] = a.getResourceId(attr, 0);
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_below:
    //                rules[RelativeLayout.BELOW] = a.getResourceId(attr, 0);
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_alignBaseline:
    //                rules[RelativeLayout.ALIGN_BASELINE] = a.getResourceId(attr, 0);
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_alignLeft:
    //                rules[RelativeLayout.ALIGN_LEFT] = a.getResourceId(attr, 0);
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_alignTop:
    //                rules[RelativeLayout.ALIGN_TOP] = a.getResourceId(attr, 0);
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_alignRight:
    //                rules[RelativeLayout.ALIGN_RIGHT] = a.getResourceId(attr, 0);
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_alignBottom:
    //                rules[RelativeLayout.ALIGN_BOTTOM] = a.getResourceId(attr, 0);
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_alignParentLeft:
    //                rules[RelativeLayout.ALIGN_PARENT_LEFT] = a.getBoolean(attr, false) ? RelativeLayout.TRUE : 0;
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_alignParentTop:
    //                rules[RelativeLayout.ALIGN_PARENT_TOP] = a.getBoolean(attr, false) ? RelativeLayout.TRUE : 0;
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_alignParentRight:
    //                rules[RelativeLayout.ALIGN_PARENT_RIGHT] = a.getBoolean(attr, false) ? RelativeLayout.TRUE : 0;
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_alignParentBottom:
    //                rules[RelativeLayout.ALIGN_PARENT_BOTTOM] = a.getBoolean(attr, false) ? RelativeLayout.TRUE : 0;
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_centerInParent:
    //                rules[RelativeLayout.CENTER_IN_PARENT] = a.getBoolean(attr, false) ? RelativeLayout.TRUE : 0;
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_centerHorizontal:
    //                rules[RelativeLayout.CENTER_HORIZONTAL] = a.getBoolean(attr, false) ? RelativeLayout.TRUE : 0;
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_centerVertical:
    //                rules[RelativeLayout.CENTER_VERTICAL] = a.getBoolean(attr, false) ? RelativeLayout.TRUE : 0;
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_toStartOf:
    //                rules[RelativeLayout.START_OF] = a.getResourceId(attr, 0);
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_toEndOf:
    //                rules[RelativeLayout.END_OF] = a.getResourceId(attr, 0);
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_alignStart:
    //                rules[RelativeLayout.ALIGN_START] = a.getResourceId(attr, 0);
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_alignEnd:
    //                rules[RelativeLayout.ALIGN_END] = a.getResourceId(attr, 0);
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_alignParentStart:
    //                rules[RelativeLayout.ALIGN_PARENT_START] = a.getBoolean(attr, false) ? RelativeLayout.TRUE : 0;
    //                break;
    //            case com.android.internal.R.styleable.RelativeLayout_Layout_layout_alignParentEnd:
    //                rules[RelativeLayout.ALIGN_PARENT_END] = a.getBoolean(attr, false) ? RelativeLayout.TRUE : 0;
    //                break;
    //        }
    //    }
    //    this.mRulesChanged = true;
    //    System.arraycopy(rules, RelativeLayout.LEFT_OF, initialRules, RelativeLayout.LEFT_OF, RelativeLayout.VERB_COUNT);
    //    a.recycle();
    //}

    constructor(context:Context, attrs:HTMLElement);
    constructor(w:number, h:number);
    constructor(source:RelativeLayout.LayoutParams);
    constructor(source:ViewGroup.LayoutParams);
    constructor(source:ViewGroup.MarginLayoutParams);
    constructor(...args){
        super(...(() => {
            if (args[0] instanceof android.content.Context && args[1] instanceof HTMLElement) return [args[0], args[1]];
            else if (typeof args[0] === 'number' && typeof args[1] === 'number') return [args[0], args[1]];
            else if (args[0] instanceof RelativeLayout.LayoutParams) return [args[0]];
            else if (args[0] instanceof ViewGroup.MarginLayoutParams) return [args[0]];
            else if (args[0] instanceof ViewGroup.LayoutParams) return [args[0]];
        })());
        if (args[0] instanceof Context && args[1] instanceof HTMLElement) {
            const c = <Context>args[0];
            const attrs = <HTMLElement>args[1];
            let a = c.obtainStyledAttributes(attrs);
            // const targetSdkVersion:number = c.getApplicationInfo().targetSdkVersion;
            this.mIsRtlCompatibilityMode = false;//(targetSdkVersion < JELLY_BEAN_MR1 || !c.getApplicationInfo().hasRtlSupport());
            const rules:string[] = this.mRules;
            //noinspection MismatchedReadAndWriteOfArray
            const initialRules:string[] = this.mInitialRules;
            for (let attr of a.getLowerCaseAttrNames()) {
                switch(attr) {
                    case 'layout_alignwithparentifmissing':
                        this.alignWithParent = a.getBoolean(attr, false);
                        break;
                    case 'layout_toleftof':
                        rules[RelativeLayout.LEFT_OF] = a.getResourceId(attr, null);
                        break;
                    case 'layout_torightof':
                        rules[RelativeLayout.RIGHT_OF] = a.getResourceId(attr, null);
                        break;
                    case 'layout_above':
                        rules[RelativeLayout.ABOVE] = a.getResourceId(attr, null);
                        break;
                    case 'layout_below':
                        rules[RelativeLayout.BELOW] = a.getResourceId(attr, null);
                        break;
                    case 'layout_alignbaseline':
                        rules[RelativeLayout.ALIGN_BASELINE] = a.getResourceId(attr, null);
                        break;
                    case 'layout_alignleft':
                        rules[RelativeLayout.ALIGN_LEFT] = a.getResourceId(attr, null);
                        break;
                    case 'layout_aligntop':
                        rules[RelativeLayout.ALIGN_TOP] = a.getResourceId(attr, null);
                        break;
                    case 'layout_alignright':
                        rules[RelativeLayout.ALIGN_RIGHT] = a.getResourceId(attr, null);
                        break;
                    case 'layout_alignbottom':
                        rules[RelativeLayout.ALIGN_BOTTOM] = a.getResourceId(attr, null);
                        break;
                    case 'layout_alignparentleft':
                        rules[RelativeLayout.ALIGN_PARENT_LEFT] = a.getBoolean(attr, false) ? RelativeLayout.TRUE : null;
                        break;
                    case 'layout_alignparenttop':
                        rules[RelativeLayout.ALIGN_PARENT_TOP] = a.getBoolean(attr, false) ? RelativeLayout.TRUE : null;
                        break;
                    case 'layout_alignparentright':
                        rules[RelativeLayout.ALIGN_PARENT_RIGHT] = a.getBoolean(attr, false) ? RelativeLayout.TRUE : null;
                        break;
                    case 'layout_alignparentbottom':
                        rules[RelativeLayout.ALIGN_PARENT_BOTTOM] = a.getBoolean(attr, false) ? RelativeLayout.TRUE : null;
                        break;
                    case 'layout_centerinparent':
                        rules[RelativeLayout.CENTER_IN_PARENT] = a.getBoolean(attr, false) ? RelativeLayout.TRUE : null;
                        break;
                    case 'layout_centerhorizontal':
                        rules[RelativeLayout.CENTER_HORIZONTAL] = a.getBoolean(attr, false) ? RelativeLayout.TRUE : null;
                        break;
                    case 'layout_centervertical':
                        rules[RelativeLayout.CENTER_VERTICAL] = a.getBoolean(attr, false) ? RelativeLayout.TRUE : null;
                        break;
                    case 'layout_tostartof':
                        rules[RelativeLayout.START_OF] = a.getResourceId(attr, null);
                        break;
                    case 'layout_toendof':
                        rules[RelativeLayout.END_OF] = a.getResourceId(attr, null);
                        break;
                    case 'layout_alignstart':
                        rules[RelativeLayout.ALIGN_START] = a.getResourceId(attr, null);
                        break;
                    case 'layout_alignend':
                        rules[RelativeLayout.ALIGN_END] = a.getResourceId(attr, null);
                        break;
                    case 'layout_alignparentstart':
                        rules[RelativeLayout.ALIGN_PARENT_START] = a.getBoolean(attr, false) ? RelativeLayout.TRUE : null;
                        break;
                    case 'layout_alignparentend':
                        rules[RelativeLayout.ALIGN_PARENT_END] = a.getBoolean(attr, false) ? RelativeLayout.TRUE : null;
                        break;
                }
            }
            this.mRulesChanged = true;
            System.arraycopy(rules, RelativeLayout.LEFT_OF, initialRules, RelativeLayout.LEFT_OF, RelativeLayout.VERB_COUNT);
            a.recycle();
        } else if (typeof args[0] === 'number' && typeof args[1] === 'number') {
            super(args[0], args[1]);
        } else if (args[0] instanceof RelativeLayout.LayoutParams) {
            const source = <RelativeLayout.LayoutParams>args[0];
            this.mIsRtlCompatibilityMode = source.mIsRtlCompatibilityMode;
            this.mRulesChanged = source.mRulesChanged;
            this.alignWithParent = source.alignWithParent;
            System.arraycopy(source.mRules, RelativeLayout.LEFT_OF, this.mRules, RelativeLayout.LEFT_OF, RelativeLayout.VERB_COUNT);
            System.arraycopy(source.mInitialRules, RelativeLayout.LEFT_OF, this.mInitialRules, RelativeLayout.LEFT_OF, RelativeLayout.VERB_COUNT);
        } else if (args[0] instanceof ViewGroup.MarginLayoutParams) {
        } else if (args[0] instanceof ViewGroup.LayoutParams) {
        }
    }

    protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
        return super.createClassAttrBinder().set('layout_alignWithParentIfMissing', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                param.alignWithParent = attrBinder.parseBoolean(value, false);
            }, getter(param:LayoutParams) {
                return param.alignWithParent;
            }
        }).set('layout_toLeftOf', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                this.addRule(RelativeLayout.LEFT_OF, value+'');
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.LEFT_OF];
            }
        }).set('layout_toRightOf', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                this.addRule(RelativeLayout.RIGHT_OF, value+'');
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.RIGHT_OF];
            }
        }).set('layout_above', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                this.addRule(RelativeLayout.ABOVE, value+'');
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.ABOVE];
            }
        }).set('layout_below', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                this.addRule(RelativeLayout.BELOW, value+'');
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.BELOW];
            }
        }).set('layout_alignBaseline', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                this.addRule(RelativeLayout.ALIGN_BASELINE, value+'');
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.ALIGN_BASELINE];
            }
        }).set('layout_alignLeft', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                this.addRule(RelativeLayout.ALIGN_LEFT, value+'');
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.ALIGN_LEFT];
            }
        }).set('layout_alignTop', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                this.addRule(RelativeLayout.ALIGN_TOP, value+'');
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.ALIGN_TOP];
            }
        }).set('layout_alignRight', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                this.addRule(RelativeLayout.ALIGN_RIGHT, value+'');
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.ALIGN_RIGHT];
            }
        }).set('layout_alignBottom', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                this.addRule(RelativeLayout.ALIGN_BOTTOM, value+'');
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.ALIGN_BOTTOM];
            }
        }).set('layout_alignParentLeft', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                const anchor = attrBinder.parseBoolean(value, false) ? RelativeLayout.TRUE : null;
                this.addRule(RelativeLayout.ALIGN_PARENT_LEFT, anchor);
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.ALIGN_PARENT_LEFT];
            }
        }).set('layout_alignParentTop', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                const anchor = attrBinder.parseBoolean(value, false) ? RelativeLayout.TRUE : null;
                this.addRule(RelativeLayout.ALIGN_PARENT_TOP, anchor);
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.ALIGN_PARENT_TOP];
            }
        }).set('layout_alignParentRight', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                const anchor = attrBinder.parseBoolean(value, false) ? RelativeLayout.TRUE : null;
                this.addRule(RelativeLayout.ALIGN_PARENT_RIGHT, anchor);
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.ALIGN_PARENT_RIGHT];
            }
        }).set('layout_alignParentBottom', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                const anchor = attrBinder.parseBoolean(value, false) ? RelativeLayout.TRUE : null;
                this.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM, anchor);
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.ALIGN_PARENT_BOTTOM];
            }
        }).set('layout_centerInParent', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                const anchor = attrBinder.parseBoolean(value, false) ? RelativeLayout.TRUE : null;
                this.addRule(RelativeLayout.CENTER_IN_PARENT, anchor);
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.CENTER_IN_PARENT];
            }
        }).set('layout_centerHorizontal', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                const anchor = attrBinder.parseBoolean(value, false) ? RelativeLayout.TRUE : null;
                this.addRule(RelativeLayout.CENTER_HORIZONTAL, anchor);
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.CENTER_HORIZONTAL];
            }
        }).set('layout_centerVertical', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                const anchor = attrBinder.parseBoolean(value, false) ? RelativeLayout.TRUE : null;
                this.addRule(RelativeLayout.CENTER_VERTICAL, anchor);
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.CENTER_VERTICAL];
            }
        }).set('layout_toStartOf', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                this.addRule(RelativeLayout.LEFT_OF, value+'');
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.LEFT_OF];
            }
        }).set('layout_toEndOf', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                this.addRule(RelativeLayout.RIGHT_OF, value+'');
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.RIGHT_OF];
            }
        }).set('layout_alignStart', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                this.addRule(RelativeLayout.ALIGN_LEFT, value+'');
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.ALIGN_LEFT];
            }
        }).set('layout_alignEnd', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                this.addRule(RelativeLayout.ALIGN_RIGHT, value+'');
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.ALIGN_RIGHT];
            }
        }).set('layout_alignParentStart', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                const anchor = attrBinder.parseBoolean(value, false) ? RelativeLayout.TRUE : null;
                this.addRule(RelativeLayout.ALIGN_PARENT_LEFT, anchor);
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.ALIGN_PARENT_LEFT];
            }
        }).set('layout_alignParentEnd', {
            setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                const anchor = attrBinder.parseBoolean(value, false) ? RelativeLayout.TRUE : null;
                this.addRule(RelativeLayout.ALIGN_PARENT_RIGHT, anchor);
            }, getter(param:LayoutParams) {
                return param.mRules[RelativeLayout.ALIGN_PARENT_RIGHT];
            }
        });
    }

    /**
         * Adds a layout rule to be interpreted by the RelativeLayout. Use this for
         * verbs that take a target, such as a sibling (ALIGN_RIGHT) or a boolean
         * value (VISIBLE).
         *
         * @param verb One of the verbs defined by
         *        {@link android.widget.RelativeLayout RelativeLayout}, such as
         *         ALIGN_WITH_PARENT_LEFT.
         * @param anchor The id of another view to use as an anchor,
         *        or a boolean value(represented as {@link RelativeLayout#TRUE})
         *        for true or 0 for false).  For verbs that don't refer to another sibling
         *        (for example, ALIGN_WITH_PARENT_BOTTOM) just use -1.
         * @see #addRule(int)
         */
    addRule(verb:number, anchor:string=RelativeLayout.TRUE):void  {
        this.mRules[verb] = anchor;
        this.mInitialRules[verb] = anchor;
        this.mRulesChanged = true;
    }

    /**
         * Removes a layout rule to be interpreted by the RelativeLayout.
         *
         * @param verb One of the verbs defined by
         *        {@link android.widget.RelativeLayout RelativeLayout}, such as
         *         ALIGN_WITH_PARENT_LEFT.
         * @see #addRule(int)
         * @see #addRule(int, int)
         */
    removeRule(verb:number):void  {
        this.mRules[verb] = null;
        this.mInitialRules[verb] = null;
        this.mRulesChanged = true;
    }

    private hasRelativeRules():boolean  {
        return (this.mInitialRules[RelativeLayout.START_OF] != null || this.mInitialRules[RelativeLayout.END_OF] != null
        || this.mInitialRules[RelativeLayout.ALIGN_START] != null || this.mInitialRules[RelativeLayout.ALIGN_END] != null
        || this.mInitialRules[RelativeLayout.ALIGN_PARENT_START] != null || this.mInitialRules[RelativeLayout.ALIGN_PARENT_END] != null);
    }

    // The way we are resolving rules depends on the layout direction and if we are pre JB MR1
    // or not.
    //
    // If we are pre JB MR1 (said as "RTL compatibility mode"), "left"/"right" rules are having
    // predominance over any "start/end" rules that could have been defined. A special case:
    // if no "left"/"right" rule has been defined and "start"/"end" rules are defined then we
    // resolve those "start"/"end" rules to "left"/"right" respectively.
    //
    // If we are JB MR1+, then "start"/"end" rules are having predominance over "left"/"right"
    // rules. If no "start"/"end" rule is defined then we use "left"/"right" rules.
    //
    // In all cases, the result of the resolution should clear the "start"/"end" rules to leave
    // only the "left"/"right" rules at the end.
    private resolveRules(layoutDirection:number):void  {
        const isLayoutRtl:boolean = (layoutDirection == View.LAYOUT_DIRECTION_RTL);
        // Reset to initial state
        System.arraycopy(this.mInitialRules, RelativeLayout.LEFT_OF, this.mRules, RelativeLayout.LEFT_OF, RelativeLayout.VERB_COUNT);
        // Apply rules depending on direction and if we are in RTL compatibility mode
        if (this.mIsRtlCompatibilityMode) {
            if (this.mRules[RelativeLayout.ALIGN_START] != null) {
                if (this.mRules[RelativeLayout.ALIGN_LEFT] == null) {
                    // "left" rule is not defined but "start" rule is: use the "start" rule as
                    // the "left" rule
                    this.mRules[RelativeLayout.ALIGN_LEFT] = this.mRules[RelativeLayout.ALIGN_START];
                }
                this.mRules[RelativeLayout.ALIGN_START] = null;
            }
            if (this.mRules[RelativeLayout.ALIGN_END] != null) {
                if (this.mRules[RelativeLayout.ALIGN_RIGHT] == null) {
                    // "right" rule is not defined but "end" rule is: use the "end" rule as the
                    // "right" rule
                    this.mRules[RelativeLayout.ALIGN_RIGHT] = this.mRules[RelativeLayout.ALIGN_END];
                }
                this.mRules[RelativeLayout.ALIGN_END] = null;
            }
            if (this.mRules[RelativeLayout.START_OF] != null) {
                if (this.mRules[RelativeLayout.LEFT_OF] == null) {
                    // "left" rule is not defined but "start" rule is: use the "start" rule as
                    // the "left" rule
                    this.mRules[RelativeLayout.LEFT_OF] = this.mRules[RelativeLayout.START_OF];
                }
                this.mRules[RelativeLayout.START_OF] = null;
            }
            if (this.mRules[RelativeLayout.END_OF] != null) {
                if (this.mRules[RelativeLayout.RIGHT_OF] == null) {
                    // "right" rule is not defined but "end" rule is: use the "end" rule as the
                    // "right" rule
                    this.mRules[RelativeLayout.RIGHT_OF] = this.mRules[RelativeLayout.END_OF];
                }
                this.mRules[RelativeLayout.END_OF] = null;
            }
            if (this.mRules[RelativeLayout.ALIGN_PARENT_START] != null) {
                if (this.mRules[RelativeLayout.ALIGN_PARENT_LEFT] == null) {
                    // "left" rule is not defined but "start" rule is: use the "start" rule as
                    // the "left" rule
                    this.mRules[RelativeLayout.ALIGN_PARENT_LEFT] = this.mRules[RelativeLayout.ALIGN_PARENT_START];
                }
                this.mRules[RelativeLayout.ALIGN_PARENT_START] = null;
            }
            if (this.mRules[RelativeLayout.ALIGN_PARENT_RIGHT] == null) {
                if (this.mRules[RelativeLayout.ALIGN_PARENT_RIGHT] == null) {
                    // "right" rule is not defined but "end" rule is: use the "end" rule as the
                    // "right" rule
                    this.mRules[RelativeLayout.ALIGN_PARENT_RIGHT] = this.mRules[RelativeLayout.ALIGN_PARENT_END];
                }
                this.mRules[RelativeLayout.ALIGN_PARENT_END] = null;
            }
        } else {
            // JB MR1+ case
            if ((this.mRules[RelativeLayout.ALIGN_START] != null || this.mRules[RelativeLayout.ALIGN_END] != null)
                && (this.mRules[RelativeLayout.ALIGN_LEFT] != null || this.mRules[RelativeLayout.ALIGN_RIGHT] != null)) {
                // "start"/"end" rules take precedence over "left"/"right" rules
                this.mRules[RelativeLayout.ALIGN_LEFT] = null;
                this.mRules[RelativeLayout.ALIGN_RIGHT] = null;
            }
            if (this.mRules[RelativeLayout.ALIGN_START] != null) {
                // "start" rule resolved to "left" or "right" depending on the direction
                this.mRules[isLayoutRtl ? RelativeLayout.ALIGN_RIGHT : RelativeLayout.ALIGN_LEFT] = this.mRules[RelativeLayout.ALIGN_START];
                this.mRules[RelativeLayout.ALIGN_START] = null;
            }
            if (this.mRules[RelativeLayout.ALIGN_END] != null) {
                // "end" rule resolved to "left" or "right" depending on the direction
                this.mRules[isLayoutRtl ? RelativeLayout.ALIGN_LEFT : RelativeLayout.ALIGN_RIGHT] = this.mRules[RelativeLayout.ALIGN_END];
                this.mRules[RelativeLayout.ALIGN_END] = null;
            }
            if ((this.mRules[RelativeLayout.START_OF] != null || this.mRules[RelativeLayout.END_OF] != null)
                && (this.mRules[RelativeLayout.LEFT_OF] != null || this.mRules[RelativeLayout.RIGHT_OF] != null)) {
                // "start"/"end" rules take precedence over "left"/"right" rules
                this.mRules[RelativeLayout.LEFT_OF] = null;
                this.mRules[RelativeLayout.RIGHT_OF] = null;
            }
            if (this.mRules[RelativeLayout.START_OF] != null) {
                // "start" rule resolved to "left" or "right" depending on the direction
                this.mRules[isLayoutRtl ? RelativeLayout.RIGHT_OF : RelativeLayout.LEFT_OF] = this.mRules[RelativeLayout.START_OF];
                this.mRules[RelativeLayout.START_OF] = null;
            }
            if (this.mRules[RelativeLayout.END_OF] != null) {
                // "end" rule resolved to "left" or "right" depending on the direction
                this.mRules[isLayoutRtl ? RelativeLayout.LEFT_OF : RelativeLayout.RIGHT_OF] = this.mRules[RelativeLayout.END_OF];
                this.mRules[RelativeLayout.END_OF] = null;
            }
            if ((this.mRules[RelativeLayout.ALIGN_PARENT_START] != null || this.mRules[RelativeLayout.ALIGN_PARENT_END] != null)
                && (this.mRules[RelativeLayout.ALIGN_PARENT_LEFT] != null || this.mRules[RelativeLayout.ALIGN_PARENT_RIGHT] != null)) {
                // "start"/"end" rules take precedence over "left"/"right" rules
                this.mRules[RelativeLayout.ALIGN_PARENT_LEFT] = null;
                this.mRules[RelativeLayout.ALIGN_PARENT_RIGHT] = null;
            }
            if (this.mRules[RelativeLayout.ALIGN_PARENT_START] != null) {
                // "start" rule resolved to "left" or "right" depending on the direction
                this.mRules[isLayoutRtl ? RelativeLayout.ALIGN_PARENT_RIGHT : RelativeLayout.ALIGN_PARENT_LEFT] = this.mRules[RelativeLayout.ALIGN_PARENT_START];
                this.mRules[RelativeLayout.ALIGN_PARENT_START] = null;
            }
            if (this.mRules[RelativeLayout.ALIGN_PARENT_END] != null) {
                // "end" rule resolved to "left" or "right" depending on the direction
                this.mRules[isLayoutRtl ? RelativeLayout.ALIGN_PARENT_LEFT : RelativeLayout.ALIGN_PARENT_RIGHT] = this.mRules[RelativeLayout.ALIGN_PARENT_END];
                this.mRules[RelativeLayout.ALIGN_PARENT_END] = null;
            }

        }
        this.mRulesChanged = false;
    }

    /**
         * Retrieves a complete list of all supported rules, where the index is the rule
         * verb, and the element value is the value specified, or "false" if it was never
         * set. If there are relative rules defined (*_START / *_END), they will be resolved
         * depending on the layout direction.
         *
         * @param layoutDirection the direction of the layout.
         *                        Should be either {@link View#LAYOUT_DIRECTION_LTR}
         *                        or {@link View#LAYOUT_DIRECTION_RTL}
         * @return the supported rules
         * @see #addRule(int, int)
         *
         * @hide
         */
    getRules(layoutDirection?:number):string[]  {
        if(layoutDirection!=null) {
            if (this.hasRelativeRules() && (this.mRulesChanged || layoutDirection != this.getLayoutDirection())) {
                this.resolveRules(layoutDirection);
                if (layoutDirection != this.getLayoutDirection()) {
                    this.setLayoutDirection(layoutDirection);
                }
            }
        }
        return this.mRules;
    }

    resolveLayoutDirection(layoutDirection:number):void  {
        const isLayoutRtl:boolean = this.isLayoutRtl();
        if (isLayoutRtl) {
            if (this.mStart != LayoutParams.DEFAULT_MARGIN_RELATIVE)
                this.mRight = this.mStart;
            if (this.mEnd != LayoutParams.DEFAULT_MARGIN_RELATIVE)
                this.mLeft = this.mEnd;
        } else {
            if (this.mStart != LayoutParams.DEFAULT_MARGIN_RELATIVE)
                this.mLeft = this.mStart;
            if (this.mEnd != LayoutParams.DEFAULT_MARGIN_RELATIVE)
                this.mRight = this.mEnd;
        }
        if (this.hasRelativeRules() && layoutDirection != this.getLayoutDirection()) {
            this.resolveRules(layoutDirection);
        }
        // This will set the layout direction
        super.resolveLayoutDirection(layoutDirection);
    }
}
export class DependencyGraph {

    /**
         * List of all views in the graph.
         */
    private mNodes:ArrayList<DependencyGraph.Node> = new ArrayList<DependencyGraph.Node>();

    /**
         * List of nodes in the graph. Each node is identified by its
         * view id (see View#getId()).
         */
    mKeyNodes:SparseMap<string, DependencyGraph.Node> = new SparseMap<string, DependencyGraph.Node>();

    /**
         * Temporary data structure used to build the list of roots
         * for this graph.
         */
    private mRoots:ArrayDeque<DependencyGraph.Node> = new ArrayDeque<DependencyGraph.Node>();

    /**
         * Clears the graph.
         */
    clear():void  {
        const nodes:ArrayList<DependencyGraph.Node> = this.mNodes;
        const count:number = nodes.size();
        for (let i:number = 0; i < count; i++) {
            nodes.get(i).release();
        }
        nodes.clear();
        this.mKeyNodes.clear();
        this.mRoots.clear();
    }

    /**
         * Adds a view to the graph.
         *
         * @param view The view to be added as a node to the graph.
         */
    add(view:View):void  {
        const id:string = view.getId();
        const node:DependencyGraph.Node = DependencyGraph.Node.acquire(view);
        if (id != View.NO_ID) {
            this.mKeyNodes.put(id, node);
        }
        this.mNodes.add(node);
    }

    /**
         * Builds a sorted list of views. The sorting order depends on the dependencies
         * between the view. For instance, if view C needs view A to be processed first
         * and view A needs view B to be processed first, the dependency graph
         * is: B -> A -> C. The sorted array will contain views B, A and C in this order.
         *
         * @param sorted The sorted list of views. The length of this array must
         *        be equal to getChildCount().
         * @param rules The list of rules to take into account.
         */
    getSortedViews(sorted:View[], rules:number[]):void  {
        const roots:ArrayDeque<DependencyGraph.Node> = this.findRoots(rules);
        let index:number = 0;
        let node:DependencyGraph.Node;
        while ((node = roots.pollLast()) != null) {
            const view:View = node.view;
            const key:string = view.getId();
            sorted[index++] = view;
            const dependents:ArrayMap<DependencyGraph.Node, DependencyGraph> = node.dependents;
            const count:number = dependents.size();
            for (let i:number = 0; i < count; i++) {
                const dependent:DependencyGraph.Node = dependents.keyAt(i);
                const dependencies = dependent.dependencies;
                dependencies.remove(key);
                if (dependencies.size() == 0) {
                    roots.add(dependent);
                }
            }
        }
        if (index < sorted.length) {
            throw Error(`new IllegalStateException("Circular dependencies cannot exist" + " in RelativeLayout")`);
        }
    }

    /**
         * Finds the roots of the graph. A root is a node with no dependency and
         * with [0..n] dependents.
         *
         * @param rulesFilter The list of rules to consider when building the
         *        dependencies
         *
         * @return A list of node, each being a root of the graph
         */
    private findRoots(rulesFilter:number[]):ArrayDeque<DependencyGraph.Node>  {
        const keyNodes:SparseMap<string, DependencyGraph.Node> = this.mKeyNodes;
        const nodes:ArrayList<DependencyGraph.Node> = this.mNodes;
        const count:number = nodes.size();
        // all dependents and dependencies before running the algorithm
        for (let i:number = 0; i < count; i++) {
            const node:DependencyGraph.Node = nodes.get(i);
            node.dependents.clear();
            node.dependencies.clear();
        }
        // Builds up the dependents and dependencies for each node of the graph
        for (let i:number = 0; i < count; i++) {
            const node:DependencyGraph.Node = nodes.get(i);
            const layoutParams:RelativeLayout.LayoutParams = <RelativeLayout.LayoutParams> node.view.getLayoutParams();
            const rules:string[] = layoutParams.mRules;
            const rulesCount:number = rulesFilter.length;
            // dependencies for a specific set of rules
            for (let j:number = 0; j < rulesCount; j++) {
                const rule:string = rules[rulesFilter[j]];
                if (rule != null) {
                    // The node this node depends on
                    const dependency:DependencyGraph.Node = keyNodes.get(rule);
                    // Skip unknowns and self dependencies
                    if (dependency == null || dependency == node) {
                        continue;
                    }
                    // Add the current node as a dependent
                    dependency.dependents.put(node, this);
                    // Add a dependency to the current node
                    node.dependencies.put(rule, dependency);
                }
            }
        }
        const roots:ArrayDeque<DependencyGraph.Node> = this.mRoots;
        roots.clear();
        // Finds all the roots in the graph: all nodes with no dependencies
        for (let i:number = 0; i < count; i++) {
            const node:DependencyGraph.Node = nodes.get(i);
            if (node.dependencies.size() == 0)
                roots.addLast(node);
        }
        return roots;
    }


}

export module DependencyGraph{
/**
         * A node in the dependency graph. A node is a view, its list of dependencies
         * and its list of dependents.
         *
         * A node with no dependent is considered a root of the graph.
         */
export class Node {

    /**
             * The view representing this node in the layout.
             */
    view:View;

    /**
             * The list of dependents for this node; a dependent is a node
             * that needs this node to be processed first.
             */
    dependents:ArrayMap<Node, RelativeLayout.DependencyGraph> = new ArrayMap<Node, RelativeLayout.DependencyGraph>();

    /**
             * The list of dependencies for this node.
             */
    dependencies:SparseMap<string, Node> = new SparseMap<string, Node>();

    /*
             * START POOL IMPLEMENTATION
             */
    // The pool is static, so all nodes instances are shared across
    // activities, that's why we give it a rather high limit
    private static POOL_LIMIT:number = 100;

    private static sPool:SynchronizedPool<Node> = new SynchronizedPool<Node>(Node.POOL_LIMIT);

    static acquire(view:View):Node  {
        let node:Node = Node.sPool.acquire();
        if (node == null) {
            node = new Node();
        }
        node.view = view;
        return node;
    }

    release():void  {
        this.view = null;
        this.dependents.clear();
        this.dependencies.clear();
        Node.sPool.release(this);
    }
    /*
             * END POOL IMPLEMENTATION
             */
}
}

}

}
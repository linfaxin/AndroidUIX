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
///<reference path="../view/View.ts"/>
///<reference path="../view/ViewGroup.ts"/>
///<reference path="../graphics/drawable/Drawable.ts"/>
///<reference path="../graphics/Rect.ts"/>
module android.widget{
    import Gravity = android.view.Gravity;
    import View = android.view.View;
    import MeasureSpec = View.MeasureSpec;
    import ViewGroup = android.view.ViewGroup;
    import Drawable = android.graphics.drawable.Drawable;
    import Canvas = android.graphics.Canvas;
    import Rect = android.graphics.Rect;

    export class LinearLayout extends ViewGroup{
        static HORIZONTAL = 0;
        static VERTICAL = 1;

        /**
         * Don't show any dividers.
         */
        static SHOW_DIVIDER_NONE = 0;
        /**
         * Show a divider at the beginning of the group.
         */
        static SHOW_DIVIDER_BEGINNING = 1;
        /**
         * Show dividers between each item in the group.
         */
        static SHOW_DIVIDER_MIDDLE = 2;
        /**
         * Show a divider at the end of the group.
         */
        static SHOW_DIVIDER_END = 4;


        /**
         * Whether the children of this layout are baseline aligned.  Only applicable
         * if {@link #mOrientation} is horizontal.
         */
        private mBaselineAligned = true;


        /**
         * If this layout is part of another layout that is baseline aligned,
         * use the child at this index as the baseline.
         *
         * Note: this is orthogonal to {@link #mBaselineAligned}, which is concerned
         * with whether the children of this layout are baseline aligned.
         */
        private mBaselineAlignedChildIndex = -1;


        /**
         * The additional offset to the child's baseline.
         * We'll calculate the baseline of this layout as we measure vertically; for
         * horizontal linear layouts, the offset of 0 is appropriate.
         */
        private mBaselineChildTop = 0;

        private mOrientation = 0;

        private mGravity = Gravity.LEFT | Gravity.TOP;

        private mTotalLength = 0;

        private mWeightSum = -1;

        private mUseLargestChild = false;

        private mMaxAscent : Array<number>;
        private mMaxDescent : Array<number>;

        private static VERTICAL_GRAVITY_COUNT = 4;

        private static INDEX_CENTER_VERTICAL = 0;
        private static INDEX_TOP = 1;
        private static INDEX_BOTTOM = 2;
        private static INDEX_FILL = 3;


        private mDivider:Drawable;
        private mDividerWidth:number = 0;
        private mDividerHeight:number = 0;
        private mShowDividers:number = LinearLayout.SHOW_DIVIDER_NONE;
        private mDividerPadding:number = 0;


        constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle?:Map<string, string>) {
            super(context, bindElement, defStyle);
            const a = context.obtainStyledAttributes(bindElement, defStyle);

            const orientationS = a.getAttrValue('orientation');
            if (orientationS) {
                const orientation = LinearLayout[orientationS.toUpperCase()];
                if (Number.isInteger(orientation)) {
                    this.setOrientation(orientation);
                }
            }

            const gravityS = a.getAttrValue('gravity');
            if (gravityS) {
                this.setGravity(Gravity.parseGravity(gravityS));
            }

            let baselineAligned = a.getBoolean('baselineAligned', true);
            if (!baselineAligned) {
                this.setBaselineAligned(baselineAligned);
            }

            this.mWeightSum = a.getFloat('weightSum', -1.0);

            this.mBaselineAlignedChildIndex = a.getInt('baselineAlignedChildIndex', -1);

            this.mUseLargestChild = a.getBoolean('measureWithLargestChild', false);

            this.setDividerDrawable(a.getDrawable('divider'));
            let fieldName = ('SHOW_DIVIDER_' + a.getAttrValue('showDividers')).toUpperCase();
            if(Number.isInteger(LinearLayout[fieldName])){
                this.mShowDividers = LinearLayout[fieldName];
            }

            this.mDividerPadding = a.getDimensionPixelSize('dividerPadding', 0);

            a.recycle();
        }

        protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
            return super.createClassAttrBinder().set('orientation', {
                setter(v:LinearLayout, value:any, attrBinder:androidui.attr.AttrBinder) {
                    if((value+"").toUpperCase() === 'VERTICAL' || LinearLayout.VERTICAL == value){
                        v.setOrientation(LinearLayout.VERTICAL);
                    }else if((value+"").toUpperCase() === 'HORIZONTAL' || LinearLayout.HORIZONTAL == value) {
                        v.setOrientation(LinearLayout.HORIZONTAL);
                    }
                }, getter(v:LinearLayout) {
                    return v.mOrientation;
                }
            }).set('gravity', {
                setter(v:LinearLayout, value:any, attrBinder:androidui.attr.AttrBinder) {
                    v.setGravity(attrBinder.parseGravity(value, v.mGravity));
                }, getter(v:LinearLayout) {
                    return v.mGravity;
                }
            }).set('baselineAligned', {
                setter(v:LinearLayout, value:any, attrBinder:androidui.attr.AttrBinder) {
                    if(!attrBinder.parseBoolean(value)) v.setBaselineAligned(false);
                }, getter(v:LinearLayout) {
                    return v.mBaselineAligned;
                }
            }).set('weightSum', {
                setter(v:LinearLayout, value:any, attrBinder:androidui.attr.AttrBinder) {
                    v.setWeightSum(attrBinder.parseFloat(value, v.mWeightSum));
                }, getter(v:LinearLayout) {
                    return v.mWeightSum;
                }
            }).set('baselineAlignedChildIndex', {
                setter(v:LinearLayout, value:any, attrBinder:androidui.attr.AttrBinder) {
                    v.setBaselineAlignedChildIndex(attrBinder.parseInt(value, v.mBaselineAlignedChildIndex));
                }, getter(v:LinearLayout) {
                    return v.mBaselineAlignedChildIndex;
                }
            }).set('measureWithLargestChild', {
                setter(v:LinearLayout, value:any, attrBinder:androidui.attr.AttrBinder) {
                    v.setMeasureWithLargestChildEnabled(attrBinder.parseBoolean(value, v.mUseLargestChild));
                }, getter(v:LinearLayout) {
                    return v.mUseLargestChild;
                }
            }).set('divider', {
                setter(v:LinearLayout, value:any, attrBinder:androidui.attr.AttrBinder) {
                    v.setDividerDrawable(attrBinder.parseDrawable(value));
                }, getter(v:LinearLayout) {
                    return v.mDivider;
                }
            }).set('showDividers', {
                setter(v:LinearLayout, value:any, attrBinder:androidui.attr.AttrBinder) {
                    if (Number.isInteger(parseInt(value))) {
                        this.setShowDividers(parseInt(value))
                    } else {
                        let fieldName = ('SHOW_DIVIDER_' + value).toUpperCase();
                        if(Number.isInteger(LinearLayout[fieldName])){
                            this.setShowDividers(LinearLayout[fieldName])
                        }
                    }
                }, getter(v:LinearLayout) {
                    return v.getShowDividers();
                }
            }).set('dividerPadding', {
                setter(v:LinearLayout, value:any, attrBinder:androidui.attr.AttrBinder) {
                    v.setDividerPadding(attrBinder.parseInt(value, v.mDividerPadding));
                }, getter(v:LinearLayout) {
                    return v.getDividerPadding();
                }
            });
        }

        setShowDividers(showDividers:number) {
            if (showDividers != this.mShowDividers) {
                this.requestLayout();
            }
            this.mShowDividers = showDividers;
        }

        shouldDelayChildPressedState():boolean {
            return false;
        }

        getShowDividers():number {
            return this.mShowDividers;
        }

        getDividerDrawable():Drawable {
            return this.mDivider;
        }

        setDividerDrawable(divider:Drawable) {
            if (divider == this.mDivider) {
                return;
            }
            this.mDivider = divider;
            if (divider != null) {
                this.mDividerWidth = divider.getIntrinsicWidth();
                this.mDividerHeight = divider.getIntrinsicHeight();
            } else {
                this.mDividerWidth = 0;
                this.mDividerHeight = 0;
            }
            this.setWillNotDraw(divider == null);
            this.requestLayout();
        }

        setDividerPadding(padding:number) {
            this.mDividerPadding = padding;
        }

        getDividerPadding() {
            return this.mDividerPadding;
        }

        getDividerWidth() {
            return this.mDividerWidth;
        }

        protected onDraw(canvas:Canvas) {
            if (this.mDivider == null) {
                return;
            }

            if (this.mOrientation == LinearLayout.VERTICAL) {
                this.drawDividersVertical(canvas);
            } else {
                this.drawDividersHorizontal(canvas);
            }
        }

        drawDividersVertical(canvas:Canvas) {
            const count = this.getVirtualChildCount();
            for (let i = 0; i < count; i++) {
                const child = this.getVirtualChildAt(i);

                if (child != null && child.getVisibility() != View.GONE) {
                    if (this.hasDividerBeforeChildAt(i)) {
                        const lp = <LinearLayout.LayoutParams>child.getLayoutParams();
                        const top = child.getTop() - lp.topMargin - this.mDividerHeight;
                        this.drawHorizontalDivider(canvas, top);
                    }
                }
            }

            if (this.hasDividerBeforeChildAt(count)) {
                const child = this.getVirtualChildAt(count - 1);
                let bottom = 0;
                if (child == null) {
                    bottom = this.getHeight() - this.getPaddingBottom() - this.mDividerHeight;
                } else {
                    const lp = <LinearLayout.LayoutParams>child.getLayoutParams();
                    bottom = child.getBottom() + lp.bottomMargin;
                }
                this.drawHorizontalDivider(canvas, bottom);
            }
        }

        drawDividersHorizontal(canvas:Canvas) {
            const count = this.getVirtualChildCount();
            const isLayoutRtl = this.isLayoutRtl();
            for (let i = 0; i < count; i++) {
                const child = this.getVirtualChildAt(i);

                if (child != null && child.getVisibility() != View.GONE) {
                    if (this.hasDividerBeforeChildAt(i)) {
                        const lp = <LinearLayout.LayoutParams>child.getLayoutParams();
                        let position;
                        if (isLayoutRtl) {
                            position = child.getRight() + lp.rightMargin;
                        } else {
                            position = child.getLeft() - lp.leftMargin - this.mDividerWidth;
                        }
                        this.drawVerticalDivider(canvas, position);
                    }
                }
            }

            if (this.hasDividerBeforeChildAt(count)) {
                const child = this.getVirtualChildAt(count - 1);
                let position;
                if (child == null) {
                    if (isLayoutRtl) {
                        position = this.getPaddingLeft();
                    } else {
                        position = this.getWidth() - this.getPaddingRight() - this.mDividerWidth;
                    }
                } else {
                    const lp = <LinearLayout.LayoutParams>child.getLayoutParams();
                    if (isLayoutRtl) {
                        position = child.getLeft() - lp.leftMargin - this.mDividerWidth;
                    } else {
                        position = child.getRight() + lp.rightMargin;
                    }
                }
                this.drawVerticalDivider(canvas, position);
            }
        }

        drawHorizontalDivider(canvas:Canvas, top:number) {
            this.mDivider.setBounds(this.getPaddingLeft() + this.mDividerPadding, top,
                this.getWidth() - this.getPaddingRight() - this.mDividerPadding, top + this.mDividerHeight);
            this.mDivider.draw(canvas);
        }
        drawVerticalDivider(canvas:Canvas, left:number) {
            this.mDivider.setBounds(left, this.getPaddingTop() + this.mDividerPadding,
                left + this.mDividerWidth, this.getHeight() - this.getPaddingBottom() - this.mDividerPadding);
            this.mDivider.draw(canvas);
        }

        isBaselineAligned():boolean {
            return this.mBaselineAligned;
        }

        setBaselineAligned(baselineAligned:boolean) {
            this.mBaselineAligned = baselineAligned;
        }

        isMeasureWithLargestChildEnabled():boolean {
            return this.mUseLargestChild;
        }

        setMeasureWithLargestChildEnabled(enabled:boolean) {
            this.mUseLargestChild = enabled;
        }

        getBaseline():number {
            if (this.mBaselineAlignedChildIndex < 0) {
                return super.getBaseline();
            }

            if (this.getChildCount() <= this.mBaselineAlignedChildIndex) {
                throw new Error("mBaselineAlignedChildIndex of LinearLayout "
                    + "set to an index that is out of bounds.");
            }

            const child = this.getChildAt(this.mBaselineAlignedChildIndex);
            const childBaseline = child.getBaseline();

            if (childBaseline == -1) {
                if (this.mBaselineAlignedChildIndex == 0) {
                    // this is just the default case, safe to return -1
                    return -1;
                }
                // the user picked an index that points to something that doesn't
                // know how to calculate its baseline.
                throw new Error("mBaselineAlignedChildIndex of LinearLayout "
                    + "points to a View that doesn't know how to get its baseline.");
            }

            // TODO: This should try to take into account the virtual offsets
            // (See getNextLocationOffset and getLocationOffset)
            // We should add to childTop:
            // sum([getNextLocationOffset(getChildAt(i)) / i < mBaselineAlignedChildIndex])
            // and also add:
            // getLocationOffset(child)
            let childTop = this.mBaselineChildTop;

            if (this.mOrientation == LinearLayout.VERTICAL) {
                const majorGravity = this.mGravity & Gravity.VERTICAL_GRAVITY_MASK;
                if (majorGravity != Gravity.TOP) {
                    switch (majorGravity) {
                        case Gravity.BOTTOM:
                            childTop = this.mBottom - this.mTop - this.mPaddingBottom - this.mTotalLength;
                            break;

                        case Gravity.CENTER_VERTICAL:
                            childTop += ((this.mBottom - this.mTop - this.mPaddingTop - this.mPaddingBottom) -
                                this.mTotalLength) / 2;
                            break;
                    }
                }
            }

            let lp = <LinearLayout.LayoutParams>child.getLayoutParams();
            return childTop + lp.topMargin + childBaseline;
        }

        getBaselineAlignedChildIndex():number {
            return this.mBaselineAlignedChildIndex;
        }

        setBaselineAlignedChildIndex(i:number) {
            if ((i < 0) || (i >= this.getChildCount())) {
                throw new Error("base aligned child index out "
                    + "of range (0, " + this.getChildCount() + ")");
            }
            this.mBaselineAlignedChildIndex = i;
        }

        getVirtualChildAt(index:number) {
            return this.getChildAt(index);
        }

        getVirtualChildCount():number {
            return this.getChildCount();
        }

        getWeightSum():number {
            return this.mWeightSum;
        }

        setWeightSum(weightSum:number){
            this.mWeightSum = Math.max(0, weightSum);
        }


        protected onMeasure(widthMeasureSpec, heightMeasureSpec) {
            if (this.mOrientation == LinearLayout.VERTICAL) {
                this.measureVertical(widthMeasureSpec, heightMeasureSpec);
            } else {
                this.measureHorizontal(widthMeasureSpec, heightMeasureSpec);
            }
        }

        hasDividerBeforeChildAt(childIndex:number) {
            if (childIndex == 0) {
                return (this.mShowDividers & LinearLayout.SHOW_DIVIDER_BEGINNING) != 0;
            } else if (childIndex == this.getChildCount()) {
                return (this.mShowDividers & LinearLayout.SHOW_DIVIDER_END) != 0;
            } else if ((this.mShowDividers & LinearLayout.SHOW_DIVIDER_MIDDLE) != 0) {
                let hasVisibleViewBefore = false;
                for (let i = childIndex - 1; i >= 0; i--) {
                    if (this.getChildAt(i).getVisibility() != LinearLayout.GONE) {
                        hasVisibleViewBefore = true;
                        break;
                    }
                }
                return hasVisibleViewBefore;
            }
            return false;
        }

        measureVertical(widthMeasureSpec:number, heightMeasureSpec:number) {
            this.mTotalLength = 0;
            let maxWidth = 0;
            let childState = 0;
            let alternativeMaxWidth = 0;
            let weightedMaxWidth = 0;
            let allFillParent = true;
            let totalWeight = 0;

            const count = this.getVirtualChildCount();

            const widthMode = MeasureSpec.getMode(widthMeasureSpec);
            const heightMode = MeasureSpec.getMode(heightMeasureSpec);

            let matchWidth = false;

            const baselineChildIndex = this.mBaselineAlignedChildIndex;
            const useLargestChild = this.mUseLargestChild;

            let largestChildHeight = Number.MIN_SAFE_INTEGER;

            // See how tall everyone is. Also remember max width.
            for (let i = 0; i < count; ++i) {
                const child = this.getVirtualChildAt(i);

                if (child == null) {
                    this.mTotalLength += this.measureNullChild(i);
                    continue;
                }

                if (child.getVisibility() == View.GONE) {
                    i += this.getChildrenSkipCount(child, i);
                    continue;
                }

                if (this.hasDividerBeforeChildAt(i)) {
                    this.mTotalLength += this.mDividerHeight;
                }

                let lp = <LinearLayout.LayoutParams>child.getLayoutParams();

                totalWeight += lp.weight;

                if (heightMode == MeasureSpec.EXACTLY && lp.height == 0 && lp.weight > 0) {
                    // Optimization: don't bother measuring children who are going to use
                    // leftover space. These views will get measured again down below if
                    // there is any leftover space.
                    const totalLength = this.mTotalLength;
                    this.mTotalLength = Math.max(totalLength, totalLength + lp.topMargin + lp.bottomMargin);
                } else {
                    let oldHeight = Number.MIN_SAFE_INTEGER;

                    if (lp.height == 0 && lp.weight > 0) {
                        // heightMode is either UNSPECIFIED or AT_MOST, and this
                        // child wanted to stretch to fill available space.
                        // Translate that to WRAP_CONTENT so that it does not end up
                        // with a height of 0
                        oldHeight = 0;
                        lp.height = LinearLayout.LayoutParams.WRAP_CONTENT;
                    }

                    // Determine how big this child would like to be. If this or
                    // previous children have given a weight, then we allow it to
                    // use all available space (and we will shrink things later
                    // if needed).
                    this.measureChildBeforeLayout(
                        child, i, widthMeasureSpec, 0, heightMeasureSpec,
                        totalWeight == 0 ? this.mTotalLength : 0);

                    if (oldHeight != Number.MIN_SAFE_INTEGER) {
                        lp.height = oldHeight;
                    }

                    const childHeight = child.getMeasuredHeight();
                    const totalLength = this.mTotalLength;
                    this.mTotalLength = Math.max(totalLength, totalLength + childHeight + lp.topMargin +
                        lp.bottomMargin + this.getNextLocationOffset(child));

                    if (useLargestChild) {
                        largestChildHeight = Math.max(childHeight, largestChildHeight);
                    }
                }

                /**
                 * If applicable, compute the additional offset to the child's baseline
                 * we'll need later when asked {@link #getBaseline}.
                 */
                if ((baselineChildIndex >= 0) && (baselineChildIndex == i + 1)) {
                    this.mBaselineChildTop = this.mTotalLength;
                }

                // if we are trying to use a child index for our baseline, the above
                // book keeping only works if there are no children above it with
                // weight.  fail fast to aid the developer.
                if (i < baselineChildIndex && lp.weight > 0) {
                    throw new Error("A child of LinearLayout with index "
                        + "less than mBaselineAlignedChildIndex has weight > 0, which "
                        + "won't work.  Either remove the weight, or don't set "
                        + "mBaselineAlignedChildIndex.");
                }

                let matchWidthLocally = false;
                if (widthMode != MeasureSpec.EXACTLY && lp.width == LinearLayout.LayoutParams.MATCH_PARENT) {
                    // The width of the linear layout will scale, and at least one
                    // child said it wanted to match our width. Set a flag
                    // indicating that we need to remeasure at least that view when
                    // we know our width.
                    matchWidth = true;
                    matchWidthLocally = true;
                }

                const margin = lp.leftMargin + lp.rightMargin;
                const measuredWidth = child.getMeasuredWidth() + margin;
                maxWidth = Math.max(maxWidth, measuredWidth);
                childState = LinearLayout.combineMeasuredStates(childState, child.getMeasuredState());

                allFillParent = allFillParent && lp.width == LinearLayout.LayoutParams.MATCH_PARENT;
                if (lp.weight > 0) {
                    /*
                     * Widths of weighted Views are bogus if we end up
                     * remeasuring, so keep them separate.
                     */
                    weightedMaxWidth = Math.max(weightedMaxWidth,
                        matchWidthLocally ? margin : measuredWidth);
                } else {
                    alternativeMaxWidth = Math.max(alternativeMaxWidth,
                        matchWidthLocally ? margin : measuredWidth);
                }

                i += this.getChildrenSkipCount(child, i);
            }

            if (this.mTotalLength > 0 && this.hasDividerBeforeChildAt(count)) {
                this.mTotalLength += this.mDividerHeight;
            }

            if (useLargestChild &&
                (heightMode == MeasureSpec.AT_MOST || heightMode == MeasureSpec.UNSPECIFIED)) {
                this.mTotalLength = 0;

                for (let i = 0; i < count; ++i) {
                    const child = this.getVirtualChildAt(i);

                    if (child == null) {
                        this.mTotalLength += this.measureNullChild(i);
                        continue;
                    }

                    if (child.getVisibility() == View.GONE) {
                        i += this.getChildrenSkipCount(child, i);
                        continue;
                    }

                    const lp = <LinearLayout.LayoutParams>child.getLayoutParams();
                    // Account for negative margins
                    const totalLength = this.mTotalLength;
                    this.mTotalLength = Math.max(totalLength, totalLength + largestChildHeight +
                        lp.topMargin + lp.bottomMargin + this.getNextLocationOffset(child));
                }
            }


            // Add in our padding
            this.mTotalLength += this.mPaddingTop + this.mPaddingBottom;

            let heightSize = this.mTotalLength;

            // Check against our minimum height
            heightSize = Math.max(heightSize, this.getSuggestedMinimumHeight());

            // Reconcile our calculated size with the heightMeasureSpec
            let heightSizeAndState = LinearLayout.resolveSizeAndState(heightSize, heightMeasureSpec, 0);
            heightSize = heightSizeAndState & View.MEASURED_SIZE_MASK;

            // Either expand children with weight to take up available space or
            // shrink them if they extend beyond our current bounds
            let delta = heightSize - this.mTotalLength;
            if (delta != 0 && totalWeight > 0) {
                let weightSum = this.mWeightSum > 0 ? this.mWeightSum : totalWeight;

                this.mTotalLength = 0;

                for (let i = 0; i < count; ++i) {
                    const child = this.getVirtualChildAt(i);

                    if (child.getVisibility() == View.GONE) {
                        continue;
                    }

                    let lp = <LinearLayout.LayoutParams>child.getLayoutParams();

                    let childExtra = lp.weight;
                    if (childExtra > 0) {
                        // Child said it could absorb extra space -- give him his share
                        let share = (childExtra * delta / weightSum);
                        weightSum -= childExtra;
                        delta -= share;

                        const childWidthMeasureSpec = LinearLayout.getChildMeasureSpec(widthMeasureSpec,
                            this.mPaddingLeft + this.mPaddingRight +
                            lp.leftMargin + lp.rightMargin, lp.width);

                        // TODO: Use a field like lp.isMeasured to figure out if this
                        // child has been previously measured
                        if ((lp.height != 0) || (heightMode != MeasureSpec.EXACTLY)) {
                            // child was measured once already above...
                            // base new measurement on stored values
                            let childHeight = child.getMeasuredHeight() + share;
                            if (childHeight < 0) {
                                childHeight = 0;
                            }

                            child.measure(childWidthMeasureSpec,
                                MeasureSpec.makeMeasureSpec(childHeight, MeasureSpec.EXACTLY));
                        } else {
                            // child was skipped in the loop above.
                            // Measure for this first time here
                            child.measure(childWidthMeasureSpec,
                                MeasureSpec.makeMeasureSpec(share > 0 ? share : 0,
                                    MeasureSpec.EXACTLY));
                        }

                        // Child may now not fit in vertical dimension.
                        childState = LinearLayout.combineMeasuredStates(childState, child.getMeasuredState()
                            & (View.MEASURED_STATE_MASK>>View.MEASURED_HEIGHT_STATE_SHIFT));
                    }

                    const margin =  lp.leftMargin + lp.rightMargin;
                    const measuredWidth = child.getMeasuredWidth() + margin;
                    maxWidth = Math.max(maxWidth, measuredWidth);

                    let matchWidthLocally = widthMode != MeasureSpec.EXACTLY &&
                        lp.width == LinearLayout.LayoutParams.MATCH_PARENT;

                    alternativeMaxWidth = Math.max(alternativeMaxWidth,
                        matchWidthLocally ? margin : measuredWidth);

                    allFillParent = allFillParent && lp.width == LinearLayout.LayoutParams.MATCH_PARENT;

                    const totalLength = this.mTotalLength;
                    this.mTotalLength = Math.max(totalLength, totalLength + child.getMeasuredHeight() +
                        lp.topMargin + lp.bottomMargin + this.getNextLocationOffset(child));
                }

                // Add in our padding
                this.mTotalLength += this.mPaddingTop + this.mPaddingBottom;
                // TODO: Should we recompute the heightSpec based on the new total length?
            } else {
                alternativeMaxWidth = Math.max(alternativeMaxWidth, weightedMaxWidth);


                // We have no limit, so make all weighted views as tall as the largest child.
                // Children will have already been measured once.
                if (useLargestChild && heightMode != MeasureSpec.EXACTLY) {
                    for (let i = 0; i < count; i++) {
                        const child = this.getVirtualChildAt(i);

                        if (child == null || child.getVisibility() == View.GONE) {
                            continue;
                        }

                        const lp = <LinearLayout.LayoutParams>child.getLayoutParams();

                        let childExtra = lp.weight;
                        if (childExtra > 0) {
                            child.measure(
                                MeasureSpec.makeMeasureSpec(child.getMeasuredWidth(),
                                    MeasureSpec.EXACTLY),
                                MeasureSpec.makeMeasureSpec(largestChildHeight,
                                    MeasureSpec.EXACTLY));
                        }
                    }
                }
            }

            if (!allFillParent && widthMode != MeasureSpec.EXACTLY) {
                maxWidth = alternativeMaxWidth;
            }

            maxWidth += this.mPaddingLeft + this.mPaddingRight;

            // Check against our minimum width
            maxWidth = Math.max(maxWidth, this.getSuggestedMinimumWidth());

            this.setMeasuredDimension(LinearLayout.resolveSizeAndState(maxWidth, widthMeasureSpec, childState),
                heightSizeAndState);

            if (matchWidth) {
                this.forceUniformWidth(count, heightMeasureSpec);
            }
        }

        forceUniformWidth(count:number, heightMeasureSpec:number) {
            // Pretend that the linear layout has an exact size.
            let uniformMeasureSpec = MeasureSpec.makeMeasureSpec(this.getMeasuredWidth(), MeasureSpec.EXACTLY);
            for (let i = 0; i< count; ++i) {
                const child = this.getVirtualChildAt(i);
                if (child.getVisibility() != View.GONE) {
                    let lp = <LinearLayout.LayoutParams>child.getLayoutParams();

                    if (lp.width == LinearLayout.LayoutParams.MATCH_PARENT) {
                        // Temporarily force children to reuse their old measured height
                        // FIXME: this may not be right for something like wrapping text?
                        let oldHeight = lp.height;
                        lp.height = child.getMeasuredHeight();

                        // Remeasue with new dimensions
                        this.measureChildWithMargins(child, uniformMeasureSpec, 0, heightMeasureSpec, 0);
                        lp.height = oldHeight;
                    }
                }
            }
        }

        measureHorizontal(widthMeasureSpec:number, heightMeasureSpec:number) {
            this.mTotalLength = 0;
            let maxHeight = 0;
            let childState = 0;
            let alternativeMaxHeight = 0;
            let weightedMaxHeight = 0;
            let allFillParent = true;
            let totalWeight = 0;

            const count = this.getVirtualChildCount();

            const widthMode = MeasureSpec.getMode(widthMeasureSpec);
            const heightMode = MeasureSpec.getMode(heightMeasureSpec);

            let matchHeight = false;

            if (this.mMaxAscent == null || this.mMaxDescent == null) {
                this.mMaxAscent = androidui.util.ArrayCreator.newNumberArray(LinearLayout.VERTICAL_GRAVITY_COUNT);
                this.mMaxDescent = androidui.util.ArrayCreator.newNumberArray(LinearLayout.VERTICAL_GRAVITY_COUNT);
            }

            let maxAscent = this.mMaxAscent;
            let maxDescent = this.mMaxDescent;

            maxAscent[0] = maxAscent[1] = maxAscent[2] = maxAscent[3] = -1;
            maxDescent[0] = maxDescent[1] = maxDescent[2] = maxDescent[3] = -1;

            const baselineAligned = this.mBaselineAligned;
            const useLargestChild = this.mUseLargestChild;

            const isExactly = widthMode == MeasureSpec.EXACTLY;

            let largestChildWidth = Number.MAX_SAFE_INTEGER;

            // See how wide everyone is. Also remember max height.
            for (let i = 0; i < count; ++i) {
                const child = this.getVirtualChildAt(i);

                if (child == null) {
                    this.mTotalLength += this.measureNullChild(i);
                    continue;
                }

                if (child.getVisibility() == View.GONE) {
                    i += this.getChildrenSkipCount(child, i);
                    continue;
                }

                if (this.hasDividerBeforeChildAt(i)) {
                    this.mTotalLength += this.mDividerWidth;
                }

                const lp = <LinearLayout.LayoutParams>child.getLayoutParams();

                totalWeight += lp.weight;

                if (widthMode == MeasureSpec.EXACTLY && lp.width == 0 && lp.weight > 0) {
                    // Optimization: don't bother measuring children who are going to use
                    // leftover space. These views will get measured again down below if
                    // there is any leftover space.
                    if (isExactly) {
                        this.mTotalLength += lp.leftMargin + lp.rightMargin;
                    } else {
                        const totalLength = this.mTotalLength;
                        this.mTotalLength = Math.max(totalLength, totalLength +
                            lp.leftMargin + lp.rightMargin);
                    }

                    // Baseline alignment requires to measure widgets to obtain the
                    // baseline offset (in particular for TextViews). The following
                    // defeats the optimization mentioned above. Allow the child to
                    // use as much space as it wants because we can shrink things
                    // later (and re-measure).
                    if (baselineAligned) {
                        const freeSpec = MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED);
                        child.measure(freeSpec, freeSpec);
                    }
                } else {
                    let oldWidth = Number.MIN_SAFE_INTEGER;

                    if (lp.width == 0 && lp.weight > 0) {
                        // widthMode is either UNSPECIFIED or AT_MOST, and this
                        // child
                        // wanted to stretch to fill available space. Translate that to
                        // WRAP_CONTENT so that it does not end up with a width of 0
                        oldWidth = 0;
                        lp.width = LinearLayout.LayoutParams.WRAP_CONTENT;
                    }

                    // Determine how big this child would like to be. If this or
                    // previous children have given a weight, then we allow it to
                    // use all available space (and we will shrink things later
                    // if needed).
                    this.measureChildBeforeLayout(child, i, widthMeasureSpec,
                        totalWeight == 0 ? this.mTotalLength : 0,
                        heightMeasureSpec, 0);

                    if (oldWidth != Number.MIN_SAFE_INTEGER) {
                        lp.width = oldWidth;
                    }

                    const childWidth = child.getMeasuredWidth();
                    if (isExactly) {
                        this.mTotalLength += childWidth + lp.leftMargin + lp.rightMargin +
                            this.getNextLocationOffset(child);
                    } else {
                        const totalLength = this.mTotalLength;
                        this.mTotalLength = Math.max(totalLength, totalLength + childWidth + lp.leftMargin +
                            lp.rightMargin + this.getNextLocationOffset(child));
                    }

                    if (useLargestChild) {
                        largestChildWidth = Math.max(childWidth, largestChildWidth);
                    }
                }

                let matchHeightLocally = false;
                if (heightMode != MeasureSpec.EXACTLY && lp.height == LinearLayout.LayoutParams.MATCH_PARENT) {
                    // The height of the linear layout will scale, and at least one
                    // child said it wanted to match our height. Set a flag indicating that
                    // we need to remeasure at least that view when we know our height.
                    matchHeight = true;
                    matchHeightLocally = true;
                }

                const margin = lp.topMargin + lp.bottomMargin;
                const childHeight = child.getMeasuredHeight() + margin;
                childState = LinearLayout.combineMeasuredStates(childState, child.getMeasuredState());

                if (baselineAligned) {
                    const childBaseline = child.getBaseline();
                    if (childBaseline != -1) {
                        // Translates the child's vertical gravity into an index
                        // in the range 0..VERTICAL_GRAVITY_COUNT
                        const gravity = (lp.gravity < 0 ? this.mGravity : lp.gravity)
                            & Gravity.VERTICAL_GRAVITY_MASK;
                        const index = ((gravity >> Gravity.AXIS_Y_SHIFT)
                            & ~Gravity.AXIS_SPECIFIED) >> 1;

                        maxAscent[index] = Math.max(maxAscent[index], childBaseline);
                        maxDescent[index] = Math.max(maxDescent[index], childHeight - childBaseline);
                    }
                }

                maxHeight = Math.max(maxHeight, childHeight);

                allFillParent = allFillParent && lp.height == LinearLayout.LayoutParams.MATCH_PARENT;
                if (lp.weight > 0) {
                    /*
                     * Heights of weighted Views are bogus if we end up
                     * remeasuring, so keep them separate.
                     */
                    weightedMaxHeight = Math.max(weightedMaxHeight,
                        matchHeightLocally ? margin : childHeight);
                } else {
                    alternativeMaxHeight = Math.max(alternativeMaxHeight,
                        matchHeightLocally ? margin : childHeight);
                }

                i += this.getChildrenSkipCount(child, i);
            }

            if (this.mTotalLength > 0 && this.hasDividerBeforeChildAt(count)) {
                this.mTotalLength += this.mDividerWidth;
            }

            // Check mMaxAscent[INDEX_TOP] first because it maps to Gravity.TOP,
            // the most common case
            if (maxAscent[LinearLayout.INDEX_TOP] != -1 ||
                maxAscent[LinearLayout.INDEX_CENTER_VERTICAL] != -1 ||
                maxAscent[LinearLayout.INDEX_BOTTOM] != -1 ||
                maxAscent[LinearLayout.INDEX_FILL] != -1) {
                const ascent = Math.max(maxAscent[LinearLayout.INDEX_FILL],
                    Math.max(maxAscent[LinearLayout.INDEX_CENTER_VERTICAL],
                        Math.max(maxAscent[LinearLayout.INDEX_TOP], maxAscent[LinearLayout.INDEX_BOTTOM])));
                const descent = Math.max(maxDescent[LinearLayout.INDEX_FILL],
                    Math.max(maxDescent[LinearLayout.INDEX_CENTER_VERTICAL],
                        Math.max(maxDescent[LinearLayout.INDEX_TOP], maxDescent[LinearLayout.INDEX_BOTTOM])));
                maxHeight = Math.max(maxHeight, ascent + descent);
            }

            if (useLargestChild &&
                (widthMode == MeasureSpec.AT_MOST || widthMode == MeasureSpec.UNSPECIFIED)) {
                this.mTotalLength = 0;

                for (let i = 0; i < count; ++i) {
                    const child = this.getVirtualChildAt(i);

                    if (child == null) {
                        this.mTotalLength += this.measureNullChild(i);
                        continue;
                    }

                    if (child.getVisibility() == View.GONE) {
                        i += this.getChildrenSkipCount(child, i);
                        continue;
                    }

                    const lp = <LinearLayout.LayoutParams>child.getLayoutParams();
                    if (isExactly) {
                        this.mTotalLength += largestChildWidth + lp.leftMargin + lp.rightMargin +
                            this.getNextLocationOffset(child);
                    } else {
                        const totalLength = this.mTotalLength;
                        this.mTotalLength = Math.max(totalLength, totalLength + largestChildWidth +
                            lp.leftMargin + lp.rightMargin + this.getNextLocationOffset(child));
                    }
                }
            }


            // Add in our padding
            this.mTotalLength += this.mPaddingLeft + this.mPaddingRight;

            let widthSize = this.mTotalLength;

            // Check against our minimum width
            widthSize = Math.max(widthSize, this.getSuggestedMinimumWidth());

            // Reconcile our calculated size with the widthMeasureSpec
            let widthSizeAndState = LinearLayout.resolveSizeAndState(widthSize, widthMeasureSpec, 0);
            widthSize = widthSizeAndState & View.MEASURED_SIZE_MASK;

            // Either expand children with weight to take up available space or
            // shrink them if they extend beyond our current bounds
            let delta = widthSize - this.mTotalLength;
            if (delta != 0 && totalWeight > 0) {
                let weightSum = this.mWeightSum > 0 ? this.mWeightSum : totalWeight;

                maxAscent[0] = maxAscent[1] = maxAscent[2] = maxAscent[3] = -1;
                maxDescent[0] = maxDescent[1] = maxDescent[2] = maxDescent[3] = -1;
                maxHeight = -1;

                this.mTotalLength = 0;

                for (let i = 0; i < count; ++i) {
                    const child = this.getVirtualChildAt(i);

                    if (child == null || child.getVisibility() == View.GONE) {
                        continue;
                    }

                    const lp = <LinearLayout.LayoutParams>child.getLayoutParams();

                    let childExtra = lp.weight;
                    if (childExtra > 0) {
                        // Child said it could absorb extra space -- give him his share
                        let share = (childExtra * delta / weightSum);
                        weightSum -= childExtra;
                        delta -= share;

                        const childHeightMeasureSpec = LinearLayout.getChildMeasureSpec(
                            heightMeasureSpec,
                            this.mPaddingTop + this.mPaddingBottom + lp.topMargin + lp.bottomMargin,
                            lp.height);

                        // TODO: Use a field like lp.isMeasured to figure out if this
                        // child has been previously measured
                        if ((lp.width != 0) || (widthMode != MeasureSpec.EXACTLY)) {
                            // child was measured once already above ... base new measurement
                            // on stored values
                            let childWidth = child.getMeasuredWidth() + share;
                            if (childWidth < 0) {
                                childWidth = 0;
                            }

                            child.measure(
                                MeasureSpec.makeMeasureSpec(childWidth, MeasureSpec.EXACTLY),
                                childHeightMeasureSpec);
                        } else {
                            // child was skipped in the loop above. Measure for this first time here
                            child.measure(MeasureSpec.makeMeasureSpec(
                                    share > 0 ? share : 0, MeasureSpec.EXACTLY),
                                childHeightMeasureSpec);
                        }

                        // Child may now not fit in horizontal dimension.
                        childState = LinearLayout.combineMeasuredStates(childState,
                            child.getMeasuredState() & View.MEASURED_STATE_MASK);
                    }

                    if (isExactly) {
                        this.mTotalLength += child.getMeasuredWidth() + lp.leftMargin + lp.rightMargin +
                            this.getNextLocationOffset(child);
                    } else {
                        const totalLength = this.mTotalLength;
                        this.mTotalLength = Math.max(totalLength, totalLength + child.getMeasuredWidth() +
                            lp.leftMargin + lp.rightMargin + this.getNextLocationOffset(child));
                    }

                    let matchHeightLocally = heightMode != MeasureSpec.EXACTLY &&
                        lp.height == LinearLayout.LayoutParams.MATCH_PARENT;

                    const margin = lp.topMargin + lp .bottomMargin;
                    let childHeight = child.getMeasuredHeight() + margin;
                    maxHeight = Math.max(maxHeight, childHeight);
                    alternativeMaxHeight = Math.max(alternativeMaxHeight,
                        matchHeightLocally ? margin : childHeight);

                    allFillParent = allFillParent && lp.height == LinearLayout.LayoutParams.MATCH_PARENT;

                    if (baselineAligned) {
                        const childBaseline = child.getBaseline();
                        if (childBaseline != -1) {
                            // Translates the child's vertical gravity into an index in the range 0..2
                            const gravity = (lp.gravity < 0 ? this.mGravity : lp.gravity)
                                & Gravity.VERTICAL_GRAVITY_MASK;
                            const index = ((gravity >> Gravity.AXIS_Y_SHIFT)
                                & ~Gravity.AXIS_SPECIFIED) >> 1;

                            maxAscent[index] = Math.max(maxAscent[index], childBaseline);
                            maxDescent[index] = Math.max(maxDescent[index],
                                childHeight - childBaseline);
                        }
                    }
                }

                // Add in our padding
                this.mTotalLength += this.mPaddingLeft + this.mPaddingRight;
                // TODO: Should we update widthSize with the new total length?

                // Check mMaxAscent[INDEX_TOP] first because it maps to Gravity.TOP,
                // the most common case
                if (maxAscent[LinearLayout.INDEX_TOP] != -1 ||
                    maxAscent[LinearLayout.INDEX_CENTER_VERTICAL] != -1 ||
                    maxAscent[LinearLayout.INDEX_BOTTOM] != -1 ||
                    maxAscent[LinearLayout.INDEX_FILL] != -1) {
                    const ascent = Math.max(maxAscent[LinearLayout.INDEX_FILL],
                        Math.max(maxAscent[LinearLayout.INDEX_CENTER_VERTICAL],
                            Math.max(maxAscent[LinearLayout.INDEX_TOP], maxAscent[LinearLayout.INDEX_BOTTOM])));
                    const descent = Math.max(maxDescent[LinearLayout.INDEX_FILL],
                        Math.max(maxDescent[LinearLayout.INDEX_CENTER_VERTICAL],
                            Math.max(maxDescent[LinearLayout.INDEX_TOP], maxDescent[LinearLayout.INDEX_BOTTOM])));
                    maxHeight = Math.max(maxHeight, ascent + descent);
                }
            } else {
                alternativeMaxHeight = Math.max(alternativeMaxHeight, weightedMaxHeight);

                // We have no limit, so make all weighted views as wide as the largest child.
                // Children will have already been measured once.
                if (useLargestChild && widthMode != MeasureSpec.EXACTLY) {
                    for (let i = 0; i < count; i++) {
                        const child = this.getVirtualChildAt(i);

                        if (child == null || child.getVisibility() == View.GONE) {
                            continue;
                        }

                        const lp = <LinearLayout.LayoutParams>child.getLayoutParams();

                        let childExtra = lp.weight;
                        if (childExtra > 0) {
                            child.measure(
                                MeasureSpec.makeMeasureSpec(largestChildWidth, MeasureSpec.EXACTLY),
                                MeasureSpec.makeMeasureSpec(child.getMeasuredHeight(),
                                    MeasureSpec.EXACTLY));
                        }
                    }
                }
            }

            if (!allFillParent && heightMode != MeasureSpec.EXACTLY) {
                maxHeight = alternativeMaxHeight;
            }

            maxHeight += this.mPaddingTop + this.mPaddingBottom;

            // Check against our minimum height
            maxHeight = Math.max(maxHeight, this.getSuggestedMinimumHeight());

            this.setMeasuredDimension(widthSizeAndState | (childState&View.MEASURED_STATE_MASK),
                LinearLayout.resolveSizeAndState(maxHeight, heightMeasureSpec,
                    (childState<<View.MEASURED_HEIGHT_STATE_SHIFT)));

            if (matchHeight) {
                this.forceUniformHeight(count, widthMeasureSpec);
            }
        }

        private forceUniformHeight(count:number, widthMeasureSpec:number) {
            // Pretend that the linear layout has an exact size. This is the measured height of
            // ourselves. The measured height should be the max height of the children, changed
            // to accommodate the heightMeasureSpec from the parent
            let uniformMeasureSpec = MeasureSpec.makeMeasureSpec(this.getMeasuredHeight(),
                MeasureSpec.EXACTLY);
            for (let i = 0; i < count; ++i) {
                const child = this.getVirtualChildAt(i);
                if (child.getVisibility() != View.GONE) {
                    let lp = <LinearLayout.LayoutParams>child.getLayoutParams();

                    if (lp.height == LinearLayout.LayoutParams.MATCH_PARENT) {
                        // Temporarily force children to reuse their old measured width
                        // FIXME: this may not be right for something like wrapping text?
                        let oldWidth = lp.width;
                        lp.width = child.getMeasuredWidth();

                        // Remeasure with new dimensions
                        this.measureChildWithMargins(child, widthMeasureSpec, 0, uniformMeasureSpec, 0);
                        lp.width = oldWidth;
                    }
                }
            }
        }

        getChildrenSkipCount(child:View, index:number):number {
            return 0;
        }
        measureNullChild(childIndex:number):number {
            return 0;
        }
        measureChildBeforeLayout(child:View, childIndex:number, widthMeasureSpec:number,
                                 totalWidth:number, heightMeasureSpec:number, totalHeight:number) {
            this.measureChildWithMargins(child, widthMeasureSpec, totalWidth,
                heightMeasureSpec, totalHeight);
        }
        getLocationOffset(child:View):number {
            return 0;
        }
        getNextLocationOffset(child:View) {
            return 0;
        }

        protected onLayout(changed:boolean, l:number, t:number, r:number, b:number):void {
            if (this.mOrientation == LinearLayout.VERTICAL) {
                this.layoutVertical(l, t, r, b);
            } else {
                this.layoutHorizontal(l, t, r, b);
            }
        }

        layoutVertical(left:number, top:number, right:number, bottom:number) {
            const paddingLeft = this.mPaddingLeft;

            let childTop;
            let childLeft;

            // Where right end of child should go
            const width = right - left;
            let childRight = width - this.mPaddingRight;

            // Space available for child
            let childSpace = width - paddingLeft - this.mPaddingRight;

            const count = this.getVirtualChildCount();

            const majorGravity = this.mGravity & Gravity.VERTICAL_GRAVITY_MASK;
            const minorGravity = this.mGravity & Gravity.HORIZONTAL_GRAVITY_MASK;

            switch (majorGravity) {
                case Gravity.BOTTOM:
                    // mTotalLength contains the padding already
                    childTop = this.mPaddingTop + bottom - top - this.mTotalLength;
                    break;

                // mTotalLength contains the padding already
                case Gravity.CENTER_VERTICAL:
                    childTop = this.mPaddingTop + (bottom - top - this.mTotalLength) / 2;
                    break;

                case Gravity.TOP:
                default:
                    childTop = this.mPaddingTop;
                    break;
            }

            for (let i = 0; i < count; i++) {
                const child = this.getVirtualChildAt(i);
                if (child == null) {
                    childTop += this.measureNullChild(i);
                } else if (child.getVisibility() != View.GONE) {
                    const childWidth = child.getMeasuredWidth();
                    const childHeight = child.getMeasuredHeight();

                    const lp = <LinearLayout.LayoutParams>child.getLayoutParams();

                    let gravity = lp.gravity;
                    if (gravity < 0) {
                        gravity = minorGravity;
                    }
                    //const layoutDirection = this.getLayoutDirection();
                    const absoluteGravity = gravity;//Gravity.getAbsoluteGravity(gravity, layoutDirection);
                    switch (absoluteGravity & Gravity.HORIZONTAL_GRAVITY_MASK) {
                        case Gravity.CENTER_HORIZONTAL:
                            childLeft = paddingLeft + ((childSpace - childWidth) / 2)
                                + lp.leftMargin - lp.rightMargin;
                            break;

                        case Gravity.RIGHT:
                            childLeft = childRight - childWidth - lp.rightMargin;
                            break;

                        case Gravity.LEFT:
                        default:
                            childLeft = paddingLeft + lp.leftMargin;
                            break;
                    }

                    if (this.hasDividerBeforeChildAt(i)) {
                        childTop += this.mDividerHeight;
                    }

                    childTop += lp.topMargin;
                    this.setChildFrame(child, childLeft, childTop + this.getLocationOffset(child),
                        childWidth, childHeight);
                    childTop += childHeight + lp.bottomMargin + this.getNextLocationOffset(child);

                    i += this.getChildrenSkipCount(child, i);
                }
            }
        }

        layoutHorizontal(left:number, top:number, right:number, bottom:number) {
            const isLayoutRtl = this.isLayoutRtl();
            const paddingTop = this.mPaddingTop;

            let childTop;
            let childLeft;

            // Where bottom of child should go
            const height = bottom - top;
            let childBottom = height - this.mPaddingBottom;

            // Space available for child
            let childSpace = height - paddingTop - this.mPaddingBottom;

            const count = this.getVirtualChildCount();

            const majorGravity = this.mGravity & Gravity.HORIZONTAL_GRAVITY_MASK;
            const minorGravity = this.mGravity & Gravity.VERTICAL_GRAVITY_MASK;

            const baselineAligned = this.mBaselineAligned;

            const maxAscent = this.mMaxAscent;
            const maxDescent = this.mMaxDescent;

            //const layoutDirection = this.getLayoutDirection();
            let absoluteGravity = majorGravity;//Gravity.getAbsoluteGravity(majorGravity, layoutDirection);
            switch (absoluteGravity) {
                case Gravity.RIGHT:
                    // mTotalLength contains the padding already
                    childLeft = this.mPaddingLeft + right - left - this.mTotalLength;
                    break;

                case Gravity.CENTER_HORIZONTAL:
                    // mTotalLength contains the padding already
                    childLeft = this.mPaddingLeft + (right - left - this.mTotalLength) / 2;
                    break;

                case Gravity.LEFT:
                default:
                    childLeft = this.mPaddingLeft;
                    break;
            }

            let start = 0;
            let dir = 1;
            //In case of RTL, start drawing from the last child.
            if (isLayoutRtl) {
                start = count - 1;
                dir = -1;
            }

            for (let i = 0; i < count; i++) {
                let childIndex = start + dir * i;
                const child = this.getVirtualChildAt(childIndex);

                if (child == null) {
                    childLeft += this.measureNullChild(childIndex);
                } else if (child.getVisibility() != View.GONE) {
                    const childWidth = child.getMeasuredWidth();
                    const childHeight = child.getMeasuredHeight();
                    let childBaseline = -1;

                    const lp = <LinearLayout.LayoutParams>child.getLayoutParams();

                    if (baselineAligned && lp.height != LinearLayout.LayoutParams.MATCH_PARENT) {
                        childBaseline = child.getBaseline();
                    }

                    let gravity = lp.gravity;
                    if (gravity < 0) {
                        gravity = minorGravity;
                    }

                    switch (gravity & Gravity.VERTICAL_GRAVITY_MASK) {
                        case Gravity.TOP:
                            childTop = paddingTop + lp.topMargin;
                            if (childBaseline != -1) {
                                childTop += maxAscent[LinearLayout.INDEX_TOP] - childBaseline;
                            }
                            break;

                        case Gravity.CENTER_VERTICAL:
                            // Removed support for baseline alignment when layout_gravity or
                            // gravity == center_vertical. See bug #1038483.
                            // Keep the code around if we need to re-enable this feature
                            // if (childBaseline != -1) {
                            //     // Align baselines vertically only if the child is smaller than us
                            //     if (childSpace - childHeight > 0) {
                            //         childTop = paddingTop + (childSpace / 2) - childBaseline;
                            //     } else {
                            //         childTop = paddingTop + (childSpace - childHeight) / 2;
                            //     }
                            // } else {
                            childTop = paddingTop + ((childSpace - childHeight) / 2)
                                + lp.topMargin - lp.bottomMargin;
                            break;

                        case Gravity.BOTTOM:
                            childTop = childBottom - childHeight - lp.bottomMargin;
                            if (childBaseline != -1) {
                                let descent = child.getMeasuredHeight() - childBaseline;
                                childTop -= (maxDescent[LinearLayout.INDEX_BOTTOM] - descent);
                            }
                            break;
                        default:
                            childTop = paddingTop;
                            break;
                    }

                    if (this.hasDividerBeforeChildAt(childIndex)) {
                        childLeft += this.mDividerWidth;
                    }

                    childLeft += lp.leftMargin;
                    this.setChildFrame(child, childLeft + this.getLocationOffset(child), childTop,
                        childWidth, childHeight);
                    childLeft += childWidth + lp.rightMargin +
                        this.getNextLocationOffset(child);

                    i += this.getChildrenSkipCount(child, childIndex);
                }
            }
        }

        private setChildFrame(child:View, left:number, top:number, width:number, height:number){
            child.layout(left, top, left + width, top + height);
        }

        setOrientation(orientation:number) {
            if(typeof orientation === 'string'){
                if('VERTICAL' === (orientation+'').toUpperCase()) orientation = LinearLayout.VERTICAL;
                else if('HORIZONTAL' === (orientation+'').toUpperCase()) orientation = LinearLayout.HORIZONTAL;
            }
            if (this.mOrientation != orientation) {
                this.mOrientation = orientation;
                this.requestLayout();
            }
        }

        getOrientation() {
            return this.mOrientation;
        }

        setGravity(gravity:number) {
            if (this.mGravity != gravity) {
                if ((gravity & Gravity.HORIZONTAL_GRAVITY_MASK) == 0) {
                    gravity |= Gravity.LEFT;
                }

                if ((gravity & Gravity.VERTICAL_GRAVITY_MASK) == 0) {
                    gravity |= Gravity.TOP;
                }

                this.mGravity = gravity;
                this.requestLayout();
            }
        }

        setHorizontalGravity(horizontalGravity:number) {
            const gravity = horizontalGravity & Gravity.HORIZONTAL_GRAVITY_MASK;
            if ((this.mGravity & Gravity.HORIZONTAL_GRAVITY_MASK) != gravity) {
                this.mGravity = (this.mGravity & ~Gravity.HORIZONTAL_GRAVITY_MASK) | gravity;
                this.requestLayout();
            }
        }

        setVerticalGravity(verticalGravity:number) {
            const gravity = verticalGravity & Gravity.VERTICAL_GRAVITY_MASK;
            if ((this.mGravity & Gravity.VERTICAL_GRAVITY_MASK) != gravity) {
                this.mGravity = (this.mGravity & ~Gravity.VERTICAL_GRAVITY_MASK) | gravity;
                this.requestLayout();
            }
        }


        protected generateDefaultLayoutParams():android.view.ViewGroup.LayoutParams {
            let LayoutParams = LinearLayout.LayoutParams;
            if (this.mOrientation == LinearLayout.HORIZONTAL) {
                return new LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
            } else if (this.mOrientation == LinearLayout.VERTICAL) {
                return new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
            }
            return super.generateDefaultLayoutParams();
        }

        protected generateLayoutParams(p:android.view.ViewGroup.LayoutParams):android.view.ViewGroup.LayoutParams {
            return new LinearLayout.LayoutParams(p);
        }

        protected checkLayoutParams(p:android.view.ViewGroup.LayoutParams):boolean {
            return p instanceof LinearLayout.LayoutParams;
        }
    }

    export module LinearLayout{
        export class LayoutParams extends android.view.ViewGroup.MarginLayoutParams{
            weight = 0;
            gravity = -1;

            constructor();
            constructor(source:ViewGroup.LayoutParams);
            constructor(width:number, height:number, weight?:number);
            constructor(...args) {
                super(...(args.length == 3 ? [args[0], args[1]] : args));//not pass weight to super
                if (args.length === 1) {
                    if(args[0] instanceof LayoutParams){
                        this.gravity = args[0].gravity;
                    }
                } else if (args.length === 3) {
                    this.weight = args[2] || 0;
                }

                let a = this._attrBinder;
                a.addAttr('gravity', (value)=>{
                    this.gravity = a.parseGravity(value, this.gravity);
                }, ()=>{
                    return this.gravity;
                });
                a.addAttr('weight', (value)=>{
                    this.weight = a.parseFloat(value, this.weight);
                }, ()=>{
                    return this.weight;
                });
            }
        }
    }

}
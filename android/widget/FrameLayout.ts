/**
 * Created by linfaxin on 15/10/9.
 */
///<reference path="../view/Gravity.ts"/>
///<reference path="../view/View.ts"/>
///<reference path="../view/ViewGroup.ts"/>
///<reference path="../graphics/drawable/Drawable.ts"/>
///<reference path="../graphics/Rect.ts"/>

module android.widget {
    import Gravity = android.view.Gravity;
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import Drawable = android.graphics.drawable.Drawable;
    import Rect = android.graphics.Rect;

    export class FrameLayout extends ViewGroup {
        static DEFAULT_CHILD_GRAVITY = Gravity.TOP | Gravity.START;

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

        getForegroundGravity():number {
            return this.mForegroundGravity;
        }

        setForegroundGravity(foregroundGravity:number) {
            if (this.mForegroundGravity != foregroundGravity) {
                if ((foregroundGravity & Gravity.RELATIVE_HORIZONTAL_GRAVITY_MASK) == 0) {
                    foregroundGravity |= Gravity.START;
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

        verifyDrawable(who:Drawable):boolean {
            return super.verifyDrawable(who) || (who == this.mForeground);
        }

        jumpDrawablesToCurrentState() {
            super.jumpDrawablesToCurrentState();
            if (this.mForeground != null) this.mForeground.jumpToCurrentState();
        }

        drawableStateChanged() {
            super.drawableStateChanged();
            if (this.mForeground != null && this.mForeground.isStateful()) {
                this.mForeground.setState(this.getDrawableState());
            }
        }

        generateDefaultLayoutParams():FrameLayout.LayoutParams {
            return new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT);
        }

        setForeground(drawable:Drawable) {
            //if (this.mForeground != drawable) {//TODO do when drawable ok
            //    if (this.mForeground != null) {
            //        this.mForeground.setCallback(null);
            //        this.unscheduleDrawable(this.mForeground);
            //    }
            //
            //    this.mForeground = drawable;
            //    this.mForegroundPaddingLeft = 0;
            //    this.mForegroundPaddingTop = 0;
            //    this.mForegroundPaddingRight = 0;
            //    this.mForegroundPaddingBottom = 0;
            //
            //    if (drawable != null) {
            //        this.setWillNotDraw(false);
            //        drawable.setCallback(this);
            //        if (drawable.isStateful()) {
            //            drawable.setState(this.getDrawableState());
            //        }
            //        if (this.mForegroundGravity == Gravity.FILL) {
            //            let padding = new Rect();
            //            if (drawable.getPadding(padding)) {
            //                this.mForegroundPaddingLeft = padding.left;
            //                this.mForegroundPaddingTop = padding.top;
            //                this.mForegroundPaddingRight = padding.right;
            //                this.mForegroundPaddingBottom = padding.bottom;
            //            }
            //        }
            //    } else {
            //        this.setWillNotDraw(true);
            //    }
            //    this.requestLayout();
            //    this.invalidate();
            //}
        }

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

        onMeasure(widthMeasureSpec:number, heightMeasureSpec:number) {
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


        onLayout(changed:boolean, left:number, top:number, right:number, bottom:number) {
            this.layoutChildren(left, top, right, bottom, false /* no force left gravity */);
        }

        layoutChildren(left:number, top:number, right:number, bottom:number, forceLeftGravity:boolean) {
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

        onSizeChanged(w:number, h:number, oldw:number, oldh:number) {
            super.onSizeChanged(w, h, oldw, oldh);
            this.mForegroundBoundsChanged = true;
        }

        setMeasureAllChildren( measureAll:boolean) {
            this.mMeasureAllChildren = measureAll;
        }
        getMeasureAllChildren() {
            return this.mMeasureAllChildren;
        }
        shouldDelayChildPressedState():boolean {
            return false;
        }
    }

    export module FrameLayout {
        export class LayoutParams extends ViewGroup.MarginLayoutParams {
            gravity = -1;

            constructor();
            constructor(source:ViewGroup.LayoutParams);
            constructor(width:number, height:number, gravity?:number);
            constructor(...args) {
                super();
                if (args.length === 1 && args[0] instanceof LayoutParams) {
                    this.gravity = args[0].gravity;
                } else {
                    let [width, height, gravity=-1] = args;
                    super(width, height);
                    this.gravity = gravity;
                }
            }

        }
    }
}
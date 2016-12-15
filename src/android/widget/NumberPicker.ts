/*
 * Copyright (C) 2008 The Android Open Source Project
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

///<reference path="../../android/content/res/ColorStateList.ts"/>
///<reference path="../../android/graphics/Canvas.ts"/>
///<reference path="../../android/graphics/Color.ts"/>
///<reference path="../../android/graphics/Paint.ts"/>
///<reference path="../../android/graphics/Rect.ts"/>
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/text/TextUtils.ts"/>
///<reference path="../../android/util/SparseArray.ts"/>
///<reference path="../../android/util/TypedValue.ts"/>
///<reference path="../../android/view/KeyEvent.ts"/>
///<reference path="../../android/view/MotionEvent.ts"/>
///<reference path="../../android/view/VelocityTracker.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewConfiguration.ts"/>
///<reference path="../../android/view/animation/DecelerateInterpolator.ts"/>
///<reference path="../../java/util/ArrayList.ts"/>
///<reference path="../../java/util/Collections.ts"/>
///<reference path="../../java/util/List.ts"/>
///<reference path="../../java/lang/Integer.ts"/>
///<reference path="../../java/lang/StringBuilder.ts"/>
///<reference path="../../java/lang/Runnable.ts"/>
///<reference path="../../android/widget/Button.ts"/>
///<reference path="../../android/widget/ImageButton.ts"/>
///<reference path="../../android/widget/LinearLayout.ts"/>
///<reference path="../../android/widget/OverScroller.ts"/>
///<reference path="../../android/widget/TextView.ts"/>
///<reference path="../../android/R/layout.ts"/>

module android.widget {
    import ColorStateList = android.content.res.ColorStateList;
    import Canvas = android.graphics.Canvas;
    import Color = android.graphics.Color;
    import Paint = android.graphics.Paint;
    import Align = android.graphics.Paint.Align;
    import Rect = android.graphics.Rect;
    import Drawable = android.graphics.drawable.Drawable;
    import TextUtils = android.text.TextUtils;
    import SparseArray = android.util.SparseArray;
    import TypedValue = android.util.TypedValue;
    import KeyEvent = android.view.KeyEvent;
    import MotionEvent = android.view.MotionEvent;
    import VelocityTracker = android.view.VelocityTracker;
    import View = android.view.View;
    import ViewConfiguration = android.view.ViewConfiguration;
    import DecelerateInterpolator = android.view.animation.DecelerateInterpolator;
    import ArrayList = java.util.ArrayList;
    import Collections = java.util.Collections;
    import List = java.util.List;
    import Integer = java.lang.Integer;
    import StringBuilder = java.lang.StringBuilder;
    import Runnable = java.lang.Runnable;
    import Button = android.widget.Button;
    import ImageButton = android.widget.ImageButton;
    import LinearLayout = android.widget.LinearLayout;
    import OverScroller = android.widget.OverScroller;
    import Scroller = android.widget.OverScroller;
    import TextView = android.widget.TextView;
    import R = android.R;
    import AttrBinder = androidui.attr.AttrBinder;
    /**
     * A widget that enables the user to select a number form a predefined range.
     * There are two flavors of this widget and which one is presented to the user
     * depends on the current theme.
     * <ul>
     * <li>
     * If the current theme is derived from {@link android.R.style#Theme} the widget
     * presents the current value as an editable input field with an increment button
     * above and a decrement button below. Long pressing the buttons allows for a quick
     * change of the current value. Tapping on the input field allows to type in
     * a desired value.
     * </li>
     * <li>
     * If the current theme is derived from {@link android.R.style#Theme_Holo} or
     * {@link android.R.style#Theme_Holo_Light} the widget presents the current
     * value as an editable input field with a lesser value above and a greater
     * value below. Tapping on the lesser or greater value selects it by animating
     * the number axis up or down to make the chosen value current. Flinging up
     * or down allows for multiple increments or decrements of the current value.
     * Long pressing on the lesser and greater values also allows for a quick change
     * of the current value. Tapping on the current value allows to type in a
     * desired value.
     * </li>
     * </ul>
     * <p>
     * For an example of using this widget, see {@link android.widget.TimePicker}.
     * </p>
     */
    export class NumberPicker extends LinearLayout {

        /**
         * The number of items show in the selector wheel.
         */
        private SELECTOR_WHEEL_ITEM_COUNT:number = 3;

        /**
         * The default update interval during long press.
         */
        private static DEFAULT_LONG_PRESS_UPDATE_INTERVAL:number = 300;

        /**
         * The index of the middle selector item.
         */
        private SELECTOR_MIDDLE_ITEM_INDEX:number = Math.floor(this.SELECTOR_WHEEL_ITEM_COUNT / 2);

        /**
         * The coefficient by which to adjust (divide) the max fling velocity.
         */
        private static SELECTOR_MAX_FLING_VELOCITY_ADJUSTMENT:number = 8;

        /**
         * The the duration for adjusting the selector wheel.
         */
        private static SELECTOR_ADJUSTMENT_DURATION_MILLIS:number = 800;

        /**
         * The duration of scrolling while snapping to a given position.
         */
        private static SNAP_SCROLL_DURATION:number = 300;

        /**
         * The strength of fading in the top and bottom while drawing the selector.
         */
        private static TOP_AND_BOTTOM_FADING_EDGE_STRENGTH:number = 0.9;

        /**
         * The default unscaled height of the selection divider.
         */
        private static UNSCALED_DEFAULT_SELECTION_DIVIDER_HEIGHT:number = 2;

        /**
         * The default unscaled distance between the selection dividers.
         */
        private static UNSCALED_DEFAULT_SELECTION_DIVIDERS_DISTANCE:number = 48;

        ///**
        // * The resource id for the default layout.
        // */
        //private static DEFAULT_LAYOUT_RESOURCE_ID:number = R.layout.number_picker;

        /**
         * Constant for unspecified size.
         */
        private static SIZE_UNSPECIFIED:number = -1;



        private static sTwoDigitFormatter:NumberPicker.TwoDigitFormatter;

        /**
         * @hide
         */
        static getTwoDigitFormatter():NumberPicker.Formatter  {
            if(!NumberPicker.sTwoDigitFormatter){
                NumberPicker.sTwoDigitFormatter = new NumberPicker.TwoDigitFormatter();
            }
            return NumberPicker.sTwoDigitFormatter;
        }

        ///**
        // * The increment button.
        // */
        //private mIncrementButton:ImageButton;

        ///**
        // * The decrement button.
        // */
        //private mDecrementButton:ImageButton;

        ///**
        // * The text for showing the current value.
        // */
        //private mInputText:EditText;

        /**
         * The distance between the two selection dividers.
         */
        private mSelectionDividersDistance:number = 0;

        /**
         * The min height of this widget.
         */
        private mMinHeight_:number = NumberPicker.SIZE_UNSPECIFIED;

        /**
         * The max height of this widget.
         */
        private mMaxHeight:number = NumberPicker.SIZE_UNSPECIFIED;

        /**
         * The max width of this widget.
         */
        private mMinWidth_:number = NumberPicker.SIZE_UNSPECIFIED;

        /**
         * The max width of this widget.
         */
        private mMaxWidth:number = NumberPicker.SIZE_UNSPECIFIED;

        /**
         * Flag whether to compute the max width.
         */
        private mComputeMaxWidth:boolean;

        /**
         * The height of the text.
         */
        private mTextSize:number = 0;

        /**
         * The height of the gap between text elements if the selector wheel.
         */
        private mSelectorTextGapHeight:number = 0;

        /**
         * The values to be displayed instead the indices.
         */
        private mDisplayedValues:string[];

        /**
         * Lower value of the range of numbers allowed for the NumberPicker
         */
        private mMinValue:number = 0;

        /**
         * Upper value of the range of numbers allowed for the NumberPicker
         */
        private mMaxValue:number = 0;

        /**
         * Current value of this NumberPicker
         */
        private mValue:number = 0;

        /**
         * Listener to be notified upon current value change.
         */
        private mOnValueChangeListener:NumberPicker.OnValueChangeListener;

        /**
         * Listener to be notified upon scroll state change.
         */
        private mOnScrollListener:NumberPicker.OnScrollListener;

        /**
         * Formatter for for displaying the current value.
         */
        private mFormatter:NumberPicker.Formatter;

        /**
         * The speed for updating the value form long press.
         */
        private mLongPressUpdateInterval:number = NumberPicker.DEFAULT_LONG_PRESS_UPDATE_INTERVAL;

        /**
         * Cache for the string representation of selector indices.
         */
        private mSelectorIndexToStringCache:SparseArray<string> = new SparseArray<string>();

        /**
         * The selector indices whose value are show by the selector.
         */
        private mSelectorIndices:number[];

        /**
         * The {@link Paint} for drawing the selector.
         */
        private mSelectorWheelPaint:Paint;

        /**
         * The {@link Drawable} for pressed virtual (increment/decrement) buttons.
         */
        private mVirtualButtonPressedDrawable:Drawable;

        /**
         * The height of a selector element (text + gap).
         */
        private mSelectorElementHeight:number = 0;

        /**
         * The initial offset of the scroll selector.
         */
        private mInitialScrollOffset:number = Integer.MIN_VALUE;

        /**
         * The current offset of the scroll selector.
         */
        private mCurrentScrollOffset:number = 0;

        /**
         * The {@link Scroller} responsible for flinging the selector.
         */
        private mFlingScroller:Scroller;

        /**
         * The {@link Scroller} responsible for adjusting the selector.
         */
        private mAdjustScroller:Scroller;

        /**
         * The previous Y coordinate while scrolling the selector.
         */
        private mPreviousScrollerY:number = 0;

        /**
         * Handle to the reusable command for setting the input text selection.
         */
        private mSetSelectionCommand:NumberPicker.SetSelectionCommand;

        /**
         * Handle to the reusable command for changing the current value from long
         * press by one.
         */
        private mChangeCurrentByOneFromLongPressCommand:NumberPicker.ChangeCurrentByOneFromLongPressCommand;

        /**
         * Command for beginning an edit of the current value via IME on long press.
         */
        private mBeginSoftInputOnLongPressCommand:NumberPicker.BeginSoftInputOnLongPressCommand;

        /**
         * The Y position of the last down event.
         */
        private mLastDownEventY:number = 0;

        /**
         * The time of the last down event.
         */
        private mLastDownEventTime:number = 0;

        /**
         * The Y position of the last down or move event.
         */
        private mLastDownOrMoveEventY:number = 0;

        /**
         * Determines speed during touch scrolling.
         */
        private mVelocityTracker:VelocityTracker;

        /**
         * @see ViewConfiguration#getScaledTouchSlop()
         */
        //private mTouchSlop:number = 0;

        /**
         * @see ViewConfiguration#getScaledMinimumFlingVelocity()
         */
        private mMinimumFlingVelocity:number = 0;

        /**
         * @see ViewConfiguration#getScaledMaximumFlingVelocity()
         */
        private mMaximumFlingVelocity:number = 0;

        /**
         * Flag whether the selector should wrap around.
         */
        private mWrapSelectorWheel:boolean;

        /**
         * The back ground color used to optimize scroller fading.
         */
        private mSolidColor:number = 0;

        /**
         * Flag whether this widget has a selector wheel.
         */
        private mHasSelectorWheel:boolean;

        /**
         * Divider for showing item to be selected while scrolling
         */
        private mSelectionDivider:Drawable;

        /**
         * The height of the selection divider.
         */
        private mSelectionDividerHeight:number = 0;

        /**
         * The current scroll state of the number picker.
         */
        private mScrollState:number = NumberPicker.OnScrollListener.SCROLL_STATE_IDLE;

        /**
         * Flag whether to ignore move events - we ignore such when we show in IME
         * to prevent the content from scrolling.
         */
        private mIngonreMoveEvents:boolean;

        /**
         * Flag whether to show soft input on tap.
         */
        private mShowSoftInputOnTap:boolean;

        /**
         * The top of the top selection divider.
         */
        private mTopSelectionDividerTop:number = 0;

        /**
         * The bottom of the bottom selection divider.
         */
        private mBottomSelectionDividerBottom:number = 0;

        /**
         * The virtual id of the last hovered child.
         */
        private mLastHoveredChildVirtualViewId:number = 0;

        /**
         * Whether the increment virtual button is pressed.
         */
        private mIncrementVirtualButtonPressed:boolean;

        /**
         * Whether the decrement virtual button is pressed.
         */
        private mDecrementVirtualButtonPressed:boolean;

        /**
         * Provider to report to clients the semantic structure of this widget.
         */
        //private mAccessibilityNodeProvider:NumberPicker.AccessibilityNodeProviderImpl;

        /**
         * Helper class for managing pressed state of the virtual buttons.
         */
        private mPressedStateHelper:NumberPicker.PressedStateHelper;

        /**
         * The keycode of the last handled DPAD down event.
         */
        private mLastHandledDownDpadKeyCode:number = -1;



        /**
         * Create a new number picker
         *
         * @param context the application environment.
         * @param bindElement a collection of attributes.
         * @param defStyle The default style to apply to this view.
         */
        constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle=android.R.attr.numberPickerStyle) {
            super(context, bindElement, defStyle);

            // process style attributes
            let attributesArray = context.obtainStyledAttributes(bindElement, defStyle);
            // const layoutResId:number = attributesArray.getResourceId('internalLayout', NumberPicker.DEFAULT_LAYOUT_RESOURCE_ID);
            this.mHasSelectorWheel = true; // (layoutResId != NumberPicker.DEFAULT_LAYOUT_RESOURCE_ID);
            this.mSolidColor = attributesArray.getColor('solidColor', 0);
            this.mSelectionDivider = attributesArray.getDrawable('selectionDivider');
            const defSelectionDividerHeight:number = Math.floor(TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, NumberPicker.UNSCALED_DEFAULT_SELECTION_DIVIDER_HEIGHT, this.getResources().getDisplayMetrics()));
            this.mSelectionDividerHeight = attributesArray.getDimensionPixelSize('selectionDividerHeight', defSelectionDividerHeight);
            const defSelectionDividerDistance:number = Math.floor(TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, NumberPicker.UNSCALED_DEFAULT_SELECTION_DIVIDERS_DISTANCE, this.getResources().getDisplayMetrics()));
            this.mSelectionDividersDistance = attributesArray.getDimensionPixelSize('selectionDividersDistance', defSelectionDividerDistance);
            this.mMinHeight = attributesArray.getDimensionPixelSize('internalMinHeight', NumberPicker.SIZE_UNSPECIFIED);
            this.mMaxHeight = attributesArray.getDimensionPixelSize('internalMaxHeight', NumberPicker.SIZE_UNSPECIFIED);
            if (this.mMinHeight != NumberPicker.SIZE_UNSPECIFIED && this.mMaxHeight != NumberPicker.SIZE_UNSPECIFIED && this.mMinHeight > this.mMaxHeight) {
               throw Error(`new IllegalArgumentException("minHeight > maxHeight")`);
            }
            this.mMinWidth = attributesArray.getDimensionPixelSize('internalMinWidth', NumberPicker.SIZE_UNSPECIFIED);
            this.mMaxWidth = attributesArray.getDimensionPixelSize('internalMaxWidth', NumberPicker.SIZE_UNSPECIFIED);
            if (this.mMinWidth != NumberPicker.SIZE_UNSPECIFIED && this.mMaxWidth != NumberPicker.SIZE_UNSPECIFIED && this.mMinWidth > this.mMaxWidth) {
               throw Error(`new IllegalArgumentException("minWidth > maxWidth")`);
            }
            this.mComputeMaxWidth = (this.mMaxWidth == NumberPicker.SIZE_UNSPECIFIED);
            this.mVirtualButtonPressedDrawable = attributesArray.getDrawable('virtualButtonPressedDrawable');

            this.mTextSize = attributesArray.getDimensionPixelSize('textSize', Math.floor(16 * this.getResources().getDisplayMetrics().density)); // AndroidUIX modify
            // create the selector wheel paint
            let paint:Paint = new Paint();
            paint.setAntiAlias(true);
            paint.setTextAlign(Align.CENTER);
            paint.setTextSize(this.mTextSize);
            //paint.setTypeface(this.mInputText.getTypeface());
            //let colors:ColorStateList = this.mInputText.getTextColors();
            paint.setColor(attributesArray.getColor('textColor', Color.DKGRAY)); // AndroidUIX modify
            this.mSelectorWheelPaint = paint;

            this.SELECTOR_WHEEL_ITEM_COUNT = attributesArray.getInt('itemCount', this.SELECTOR_WHEEL_ITEM_COUNT); // AndroidUIX modify
            this.SELECTOR_MIDDLE_ITEM_INDEX = Math.floor(this.SELECTOR_WHEEL_ITEM_COUNT / 2); // AndroidUIX modify
            this.mSelectorIndices = androidui.util.ArrayCreator.newNumberArray(this.SELECTOR_WHEEL_ITEM_COUNT);

            if (this.mMinHeight_ != NumberPicker.SIZE_UNSPECIFIED && this.mMaxHeight != NumberPicker.SIZE_UNSPECIFIED && this.mMinHeight_ > this.mMaxHeight) {
                throw Error(`new IllegalArgumentException("minHeight > maxHeight")`);
            }
            if (this.mMinWidth_ != NumberPicker.SIZE_UNSPECIFIED && this.mMaxWidth != NumberPicker.SIZE_UNSPECIFIED && this.mMinWidth_ > this.mMaxWidth) {
                throw Error(`new IllegalArgumentException("minWidth > maxWidth")`);
            }
            this.mComputeMaxWidth = (this.mMaxWidth == NumberPicker.SIZE_UNSPECIFIED);

            this.setMinValue(attributesArray.getInt('minValue', this.mMinValue)); // AndroidUIX modify
            this.setMaxValue(attributesArray.getInt('maxValue', this.mMaxValue)); // AndroidUIX modify
            attributesArray.recycle();

            this.mPressedStateHelper = new NumberPicker.PressedStateHelper(this);
            // By default Linearlayout that we extend is not drawn. This is
            // its draw() method is not called but dispatchDraw() is called
            // directly (see ViewGroup.drawChild()). However, this class uses
            // the fading edge effect implemented by View and we need our
            // draw() method to be called. Therefore, we declare we will draw.
            this.setWillNotDraw(!this.mHasSelectorWheel);
            //let inflater:LayoutInflater = <LayoutInflater> this.getContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            //inflater.inflate(layoutResId, this, true);
            //let onClickListener:View.OnClickListener = (()=>{
            //    const inner_this=this;
            //    class _Inner implements View.OnClickListener {
            //        onClick(v:View):void  {
            //            inner_this.hideSoftInput();
            //            inner_this.mInputText.clearFocus();
            //            if (v.getId() == R.id.increment) {
            //                inner_this.changeValueByOne(true);
            //            } else {
            //                inner_this.changeValueByOne(false);
            //            }
            //        }
            //    }
            //    return new _Inner();
            //})();
            //let onLongClickListener:View.OnLongClickListener = (()=>{
            //    const inner_this=this;
            //    class _Inner implements View.OnLongClickListener {
            //
            //        onLongClick(v:View):boolean  {
            //            this.hideSoftInput();
            //            this.mInputText.clearFocus();
            //            if (v.getId() == R.id.increment) {
            //                this.postChangeCurrentByOneFromLongPress(true, 0);
            //            } else {
            //                this.postChangeCurrentByOneFromLongPress(false, 0);
            //            }
            //            return true;
            //        }
            //    }
            //    return new _Inner(this);
            //})();
            //// increment button
            //if (!this.mHasSelectorWheel) {
            //    this.mIncrementButton = <ImageButton> this.findViewById(R.id.increment);
            //    this.mIncrementButton.setOnClickListener(onClickListener);
            //    this.mIncrementButton.setOnLongClickListener(onLongClickListener);
            //} else {
            //    this.mIncrementButton = null;
            //}
            //// decrement button
            //if (!this.mHasSelectorWheel) {
            //    this.mDecrementButton = <ImageButton> this.findViewById(R.id.decrement);
            //    this.mDecrementButton.setOnClickListener(onClickListener);
            //    this.mDecrementButton.setOnLongClickListener(onLongClickListener);
            //} else {
            //    this.mDecrementButton = null;
            //}
            // input text
            //this.mInputText = <EditText> this.findViewById(R.id.numberpicker_input);
            //this.mInputText.setOnFocusChangeListener((()=>{
            //    const inner_this=this;
            //    class _Inner extends View.OnFocusChangeListener {
            //
            //        onFocusChange(v:View, hasFocus:boolean):void  {
            //            if (hasFocus) {
            //                this.mInputText.selectAll();
            //            } else {
            //                this.mInputText.setSelection(0, 0);
            //                this.validateInputTextView(v);
            //            }
            //        }
            //    }
            //    return new _Inner(this);
            //})());
            //this.mInputText.setFilters( [ new NumberPicker.InputTextFilter(this) ]);
            //this.mInputText.setRawInputType(InputType.TYPE_CLASS_NUMBER);
            //this.mInputText.setImeOptions(EditorInfo.IME_ACTION_DONE);
            // initialize constants
            let configuration:ViewConfiguration = ViewConfiguration.get();
            //this.mTouchSlop = configuration.getScaledTouchSlop();
            this.mMinimumFlingVelocity = configuration.getScaledMinimumFlingVelocity();
            this.mMaximumFlingVelocity = configuration.getScaledMaximumFlingVelocity() / NumberPicker.SELECTOR_MAX_FLING_VELOCITY_ADJUSTMENT;
            // create the fling and adjust scrollers
            this.mFlingScroller = new OverScroller(null, true);
            this.mAdjustScroller = new OverScroller(new DecelerateInterpolator(2.5));
            this.updateInputTextView();
            // If not explicitly specified this view is important for accessibility.
            //if (this.getImportantForAccessibility() == NumberPicker.IMPORTANT_FOR_ACCESSIBILITY_AUTO) {
            //    this.setImportantForAccessibility(NumberPicker.IMPORTANT_FOR_ACCESSIBILITY_YES);
            //}
        }

        protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
            return super.createClassAttrBinder().set('solidColor', {
                setter(v:NumberPicker, value:any, attrBinder:AttrBinder) {
                    v.mSolidColor = attrBinder.parseColor(value, v.mSolidColor);
                    v.invalidate();
                }, getter(v:NumberPicker) {
                    return v.mSolidColor;
                }
            }).set('selectionDivider', {
                setter(v:NumberPicker, value:any, attrBinder:AttrBinder) {
                    v.mSelectionDivider = attrBinder.parseDrawable(value);
                    v.invalidate();
                }, getter(v:NumberPicker) {
                    return v.mSelectionDivider;
                }
            }).set('selectionDividerHeight', {
                setter(v:NumberPicker, value:any, attrBinder:AttrBinder) {
                    v.mSelectionDividerHeight = attrBinder.parseNumberPixelSize(value, v.mSelectionDividerHeight);
                    v.invalidate();
                }, getter(v:NumberPicker) {
                    return v.mSelectionDividerHeight;
                }
            }).set('selectionDividersDistance', {
                setter(v:NumberPicker, value:any, attrBinder:AttrBinder) {
                    v.mSelectionDividersDistance = attrBinder.parseNumberPixelSize(value, v.mSelectionDividersDistance);
                    v.invalidate();
                }, getter(v:NumberPicker) {
                    return v.mSelectionDividersDistance;
                }
            }).set('internalMinHeight', {
                setter(v:NumberPicker, value:any, attrBinder:AttrBinder) {
                    v.mMinHeight_ = attrBinder.parseNumberPixelSize(value, v.mMinHeight_);
                    v.invalidate();
                }, getter(v:NumberPicker) {
                    return v.mMinHeight_;
                }
            }).set('internalMaxHeight', {
                setter(v:NumberPicker, value:any, attrBinder:AttrBinder) {
                    v.mMaxHeight = attrBinder.parseNumberPixelSize(value, v.mMaxHeight);
                    v.invalidate();
                }, getter(v:NumberPicker) {
                    return v.mMaxHeight;
                }
            }).set('internalMinWidth', {
                setter(v:NumberPicker, value:any, attrBinder:AttrBinder) {
                    v.mMinWidth_ = attrBinder.parseNumberPixelSize(value, v.mMinWidth_);
                    v.invalidate();
                }, getter(v:NumberPicker) {
                    return v.mMinWidth_;
                }
            }).set('internalMaxWidth', {
                setter(v:NumberPicker, value:any, attrBinder:AttrBinder) {
                    v.mMaxWidth = attrBinder.parseNumberPixelSize(value, v.mMaxWidth);
                    v.invalidate();
                }, getter(v:NumberPicker) {
                    return v.mMaxWidth;
                }
            }).set('virtualButtonPressedDrawable', {
                setter(v:NumberPicker, value:any, attrBinder:AttrBinder) {
                    v.mVirtualButtonPressedDrawable = attrBinder.parseDrawable(value);
                    v.invalidate();
                }, getter(v:NumberPicker) {
                    return v.mVirtualButtonPressedDrawable;
                }
            });
        }

        protected onLayout(changed:boolean, left:number, top:number, right:number, bottom:number):void  {
            if (!this.mHasSelectorWheel) {
                super.onLayout(changed, left, top, right, bottom);
                return;
            }
            const msrdWdth:number = this.getMeasuredWidth();
            const msrdHght:number = this.getMeasuredHeight();
            // Input text centered horizontally.
            //const inptTxtMsrdWdth:number = this.mInputText.getMeasuredWidth();
            //const inptTxtMsrdHght:number = this.mInputText.getMeasuredHeight();
            //const inptTxtLeft:number = (msrdWdth - inptTxtMsrdWdth) / 2;
            //const inptTxtTop:number = (msrdHght - inptTxtMsrdHght) / 2;
            //const inptTxtRight:number = inptTxtLeft + inptTxtMsrdWdth;
            //const inptTxtBottom:number = inptTxtTop + inptTxtMsrdHght;
            //this.mInputText.layout(inptTxtLeft, inptTxtTop, inptTxtRight, inptTxtBottom);
            if (changed) {
                // need to do all this when we know our size
                this.initializeSelectorWheel();
                this.initializeFadingEdges();
                this.mTopSelectionDividerTop = (this.getHeight() - this.mSelectionDividersDistance) / 2 - this.mSelectionDividerHeight;
                this.mBottomSelectionDividerBottom = this.mTopSelectionDividerTop + 2 * this.mSelectionDividerHeight + this.mSelectionDividersDistance;
            }
        }

        protected onMeasure(widthMeasureSpec:number, heightMeasureSpec:number):void  {
            if (!this.mHasSelectorWheel) {
                super.onMeasure(widthMeasureSpec, heightMeasureSpec);
                return;
            }
            // Try greedily to fit the max width and height.
            const newWidthMeasureSpec:number = this.makeMeasureSpec(widthMeasureSpec, this.mMaxWidth);
            const newHeightMeasureSpec:number = this.makeMeasureSpec(heightMeasureSpec, this.mMaxHeight);
            super.onMeasure(newWidthMeasureSpec, newHeightMeasureSpec);
            // Flag if we are measured with width or height less than the respective min.
            const widthSize:number = this.resolveSizeAndStateRespectingMinSize(this.mMinWidth_, this.getMeasuredWidth(), widthMeasureSpec);
            const heightSize:number = this.resolveSizeAndStateRespectingMinSize(this.mMinHeight_, this.getMeasuredHeight(), heightMeasureSpec);
            this.setMeasuredDimension(widthSize, heightSize);
        }

        /**
         * Move to the final position of a scroller. Ensures to force finish the scroller
         * and if it is not at its final position a scroll of the selector wheel is
         * performed to fast forward to the final position.
         *
         * @param scroller The scroller to whose final position to get.
         * @return True of the a move was performed, i.e. the scroller was not in final position.
         */
        private moveToFinalScrollerPosition(scroller:Scroller):boolean  {
            scroller.forceFinished(true);
            let amountToScroll:number = scroller.getFinalY() - scroller.getCurrY();
            let futureScrollOffset:number = (this.mCurrentScrollOffset + amountToScroll) % this.mSelectorElementHeight;
            let overshootAdjustment:number = this.mInitialScrollOffset - futureScrollOffset;
            if (overshootAdjustment != 0) {
                if (Math.abs(overshootAdjustment) > this.mSelectorElementHeight / 2) {
                    if (overshootAdjustment > 0) {
                        overshootAdjustment -= this.mSelectorElementHeight;
                    } else {
                        overshootAdjustment += this.mSelectorElementHeight;
                    }
                }
                amountToScroll += overshootAdjustment;
                this.scrollBy(0, amountToScroll);
                return true;
            }
            return false;
        }

        onInterceptTouchEvent(event:MotionEvent):boolean  {
            if (!this.mHasSelectorWheel || !this.isEnabled()) {
                return false;
            }
            const action:number = event.getActionMasked();
            switch(action) {
                case MotionEvent.ACTION_DOWN:
                {
                    this.removeAllCallbacks();
                    //this.mInputText.setVisibility(View.INVISIBLE);
                    this.mLastDownOrMoveEventY = this.mLastDownEventY = event.getY();
                    this.mLastDownEventTime = event.getEventTime();
                    this.mIngonreMoveEvents = false;
                    this.mShowSoftInputOnTap = false;
                    // Handle pressed state before any state change.
                    if (this.mLastDownEventY < this.mTopSelectionDividerTop) {
                        if (this.mScrollState == NumberPicker.OnScrollListener.SCROLL_STATE_IDLE) {
                            this.mPressedStateHelper.buttonPressDelayed(NumberPicker.PressedStateHelper.BUTTON_DECREMENT);
                        }
                    } else if (this.mLastDownEventY > this.mBottomSelectionDividerBottom) {
                        if (this.mScrollState == NumberPicker.OnScrollListener.SCROLL_STATE_IDLE) {
                            this.mPressedStateHelper.buttonPressDelayed(NumberPicker.PressedStateHelper.BUTTON_INCREMENT);
                        }
                    }
                    // Make sure we support flinging inside scrollables.
                    this.getParent().requestDisallowInterceptTouchEvent(true);
                    if (!this.mFlingScroller.isFinished()) {
                        this.mFlingScroller.forceFinished(true);
                        this.mAdjustScroller.forceFinished(true);
                        this.onScrollStateChange(NumberPicker.OnScrollListener.SCROLL_STATE_IDLE);
                    } else if (!this.mAdjustScroller.isFinished()) {
                        this.mFlingScroller.forceFinished(true);
                        this.mAdjustScroller.forceFinished(true);
                    } else if (this.mLastDownEventY < this.mTopSelectionDividerTop) {
                        this.hideSoftInput();
                        this.postChangeCurrentByOneFromLongPress(false, ViewConfiguration.getLongPressTimeout());
                    } else if (this.mLastDownEventY > this.mBottomSelectionDividerBottom) {
                        this.hideSoftInput();
                        this.postChangeCurrentByOneFromLongPress(true, ViewConfiguration.getLongPressTimeout());
                    } else {
                        this.mShowSoftInputOnTap = true;
                        this.postBeginSoftInputOnLongPressCommand();
                    }
                    return true;
                }
            }
            return false;
        }

        onTouchEvent(event:MotionEvent):boolean  {
            if (!this.isEnabled() || !this.mHasSelectorWheel) {
                return false;
            }
            if (this.mVelocityTracker == null) {
                this.mVelocityTracker = VelocityTracker.obtain();
            }
            this.mVelocityTracker.addMovement(event);
            let action:number = event.getActionMasked();
            switch(action) {
                case MotionEvent.ACTION_MOVE:
                {
                    if (this.mIngonreMoveEvents) {
                        break;
                    }
                    let currentMoveY:number = event.getY();
                    if (this.mScrollState != NumberPicker.OnScrollListener.SCROLL_STATE_TOUCH_SCROLL) {
                        let deltaDownY:number = Math.floor(Math.abs(currentMoveY - this.mLastDownEventY));
                        if (deltaDownY > this.mTouchSlop) {
                            this.removeAllCallbacks();
                            this.onScrollStateChange(NumberPicker.OnScrollListener.SCROLL_STATE_TOUCH_SCROLL);
                        }
                    } else {
                        let deltaMoveY:number = Math.floor(((currentMoveY - this.mLastDownOrMoveEventY)));
                        this.scrollBy(0, deltaMoveY);
                        this.invalidate();
                    }
                    this.mLastDownOrMoveEventY = currentMoveY;
                }
                    break;
                case MotionEvent.ACTION_UP:
                {
                    this.removeBeginSoftInputCommand();
                    this.removeChangeCurrentByOneFromLongPress();
                    this.mPressedStateHelper.cancel();
                    let velocityTracker:VelocityTracker = this.mVelocityTracker;
                    velocityTracker.computeCurrentVelocity(1000, this.mMaximumFlingVelocity);
                    let initialVelocity:number = Math.floor(velocityTracker.getYVelocity());
                    if (Math.abs(initialVelocity) > this.mMinimumFlingVelocity) {
                        this.fling(initialVelocity);
                        this.onScrollStateChange(NumberPicker.OnScrollListener.SCROLL_STATE_FLING);
                    } else {
                        let eventY:number = Math.floor(event.getY());
                        let deltaMoveY:number = Math.floor(Math.abs(eventY - this.mLastDownEventY));
                        let deltaTime:number = event.getEventTime() - this.mLastDownEventTime;
                        if (deltaMoveY <= this.mTouchSlop && deltaTime < ViewConfiguration.getTapTimeout()) {
                            if (this.mShowSoftInputOnTap) {
                                this.mShowSoftInputOnTap = false;
                                this.showSoftInput();
                            } else {
                                let selectorIndexOffset:number = (eventY / this.mSelectorElementHeight) - this.SELECTOR_MIDDLE_ITEM_INDEX;
                                if (selectorIndexOffset > 0) {
                                    this.changeValueByOne(true);
                                    this.mPressedStateHelper.buttonTapped(NumberPicker.PressedStateHelper.BUTTON_INCREMENT);
                                } else if (selectorIndexOffset < 0) {
                                    this.changeValueByOne(false);
                                    this.mPressedStateHelper.buttonTapped(NumberPicker.PressedStateHelper.BUTTON_DECREMENT);
                                }
                            }
                        } else {
                            this.ensureScrollWheelAdjusted();
                        }
                        this.onScrollStateChange(NumberPicker.OnScrollListener.SCROLL_STATE_IDLE);
                    }
                    this.mVelocityTracker.recycle();
                    this.mVelocityTracker = null;
                }
                    break;
            }
            return true;
        }

        dispatchTouchEvent(event:MotionEvent):boolean  {
            const action:number = event.getActionMasked();
            switch(action) {
                case MotionEvent.ACTION_CANCEL:
                case MotionEvent.ACTION_UP:
                    this.removeAllCallbacks();
                    break;
            }
            return super.dispatchTouchEvent(event);
        }

        dispatchKeyEvent(event:KeyEvent):boolean  {
            const keyCode:number = event.getKeyCode();
            switch(keyCode) {
                case KeyEvent.KEYCODE_DPAD_CENTER:
                case KeyEvent.KEYCODE_ENTER:
                    this.removeAllCallbacks();
                    break;
                case KeyEvent.KEYCODE_DPAD_DOWN:
                case KeyEvent.KEYCODE_DPAD_UP:
                    if (!this.mHasSelectorWheel) {
                        break;
                    }
                    switch(event.getAction()) {
                        case KeyEvent.ACTION_DOWN:
                            if (this.mWrapSelectorWheel || (keyCode == KeyEvent.KEYCODE_DPAD_DOWN) ? this.getValue() < this.getMaxValue() : this.getValue() > this.getMinValue()) {
                                this.requestFocus();
                                this.mLastHandledDownDpadKeyCode = keyCode;
                                this.removeAllCallbacks();
                                if (this.mFlingScroller.isFinished()) {
                                    this.changeValueByOne(keyCode == KeyEvent.KEYCODE_DPAD_DOWN);
                                }
                                return true;
                            }
                            break;
                        case KeyEvent.ACTION_UP:
                            if (this.mLastHandledDownDpadKeyCode == keyCode) {
                                this.mLastHandledDownDpadKeyCode = -1;
                                return true;
                            }
                            break;
                    }
            }
            return super.dispatchKeyEvent(event);
        }

        //dispatchTrackballEvent(event:MotionEvent):boolean  {
        //    const action:number = event.getActionMasked();
        //    switch(action) {
        //        case MotionEvent.ACTION_CANCEL:
        //        case MotionEvent.ACTION_UP:
        //            this.removeAllCallbacks();
        //            break;
        //    }
        //    return super.dispatchTrackballEvent(event);
        //}

        //protected dispatchHoverEvent(event:MotionEvent):boolean  {
        //    if (!this.mHasSelectorWheel) {
        //        return super.dispatchHoverEvent(event);
        //    }
        //    if (AccessibilityManager.getInstance(this.mContext).isEnabled()) {
        //        const eventY:number = Math.floor(event.getY());
        //        let hoveredVirtualViewId:number;
        //        if (eventY < this.mTopSelectionDividerTop) {
        //            hoveredVirtualViewId = NumberPicker.AccessibilityNodeProviderImpl.VIRTUAL_VIEW_ID_DECREMENT;
        //        } else if (eventY > this.mBottomSelectionDividerBottom) {
        //            hoveredVirtualViewId = NumberPicker.AccessibilityNodeProviderImpl.VIRTUAL_VIEW_ID_INCREMENT;
        //        } else {
        //            hoveredVirtualViewId = NumberPicker.AccessibilityNodeProviderImpl.VIRTUAL_VIEW_ID_INPUT;
        //        }
        //        const action:number = event.getActionMasked();
        //        let provider:NumberPicker.AccessibilityNodeProviderImpl = <NumberPicker.AccessibilityNodeProviderImpl> this.getAccessibilityNodeProvider();
        //        switch(action) {
        //            case MotionEvent.ACTION_HOVER_ENTER:
        //            {
        //                provider.sendAccessibilityEventForVirtualView(hoveredVirtualViewId, AccessibilityEvent.TYPE_VIEW_HOVER_ENTER);
        //                this.mLastHoveredChildVirtualViewId = hoveredVirtualViewId;
        //                provider.performAction(hoveredVirtualViewId, AccessibilityNodeInfo.ACTION_ACCESSIBILITY_FOCUS, null);
        //            }
        //                break;
        //            case MotionEvent.ACTION_HOVER_MOVE:
        //            {
        //                if (this.mLastHoveredChildVirtualViewId != hoveredVirtualViewId && this.mLastHoveredChildVirtualViewId != View.NO_ID) {
        //                    provider.sendAccessibilityEventForVirtualView(this.mLastHoveredChildVirtualViewId, AccessibilityEvent.TYPE_VIEW_HOVER_EXIT);
        //                    provider.sendAccessibilityEventForVirtualView(hoveredVirtualViewId, AccessibilityEvent.TYPE_VIEW_HOVER_ENTER);
        //                    this.mLastHoveredChildVirtualViewId = hoveredVirtualViewId;
        //                    provider.performAction(hoveredVirtualViewId, AccessibilityNodeInfo.ACTION_ACCESSIBILITY_FOCUS, null);
        //                }
        //            }
        //                break;
        //            case MotionEvent.ACTION_HOVER_EXIT:
        //            {
        //                provider.sendAccessibilityEventForVirtualView(hoveredVirtualViewId, AccessibilityEvent.TYPE_VIEW_HOVER_EXIT);
        //                this.mLastHoveredChildVirtualViewId = View.NO_ID;
        //            }
        //                break;
        //        }
        //    }
        //    return false;
        //}

        computeScroll():void  {
            let scroller:Scroller = this.mFlingScroller;
            if (scroller.isFinished()) {
                scroller = this.mAdjustScroller;
                if (scroller.isFinished()) {
                    return;
                }
            }
            scroller.computeScrollOffset();
            let currentScrollerY:number = scroller.getCurrY();
            if (this.mPreviousScrollerY == 0) {
                this.mPreviousScrollerY = scroller.getStartY();
            }
            this.scrollBy(0, currentScrollerY - this.mPreviousScrollerY);
            this.mPreviousScrollerY = currentScrollerY;
            if (scroller.isFinished()) {
                this.onScrollerFinished(scroller);
            } else {
                this.invalidate();
            }
        }

        setEnabled(enabled:boolean):void  {
            super.setEnabled(enabled);
            if (!this.mHasSelectorWheel) {
                //this.mIncrementButton.setEnabled(enabled);
            }
            if (!this.mHasSelectorWheel) {
                //this.mDecrementButton.setEnabled(enabled);
            }
            //this.mInputText.setEnabled(enabled);
        }

        scrollBy(x:number, y:number):void  {
            let selectorIndices:number[] = this.mSelectorIndices;
            if (!this.mWrapSelectorWheel && y > 0 && selectorIndices[this.SELECTOR_MIDDLE_ITEM_INDEX] <= this.mMinValue) {
                this.mCurrentScrollOffset = this.mInitialScrollOffset;
                return;
            }
            if (!this.mWrapSelectorWheel && y < 0 && selectorIndices[this.SELECTOR_MIDDLE_ITEM_INDEX] >= this.mMaxValue) {
                this.mCurrentScrollOffset = this.mInitialScrollOffset;
                return;
            }
            this.mCurrentScrollOffset += y;
            while (this.mCurrentScrollOffset - this.mInitialScrollOffset > this.mSelectorTextGapHeight) {
                this.mCurrentScrollOffset -= this.mSelectorElementHeight;
                this.decrementSelectorIndices(selectorIndices);
                this.setValueInternal(selectorIndices[this.SELECTOR_MIDDLE_ITEM_INDEX], true);
                if (!this.mWrapSelectorWheel && selectorIndices[this.SELECTOR_MIDDLE_ITEM_INDEX] <= this.mMinValue) {
                    this.mCurrentScrollOffset = this.mInitialScrollOffset;
                }
            }
            while (this.mCurrentScrollOffset - this.mInitialScrollOffset < -this.mSelectorTextGapHeight) {
                this.mCurrentScrollOffset += this.mSelectorElementHeight;
                this.incrementSelectorIndices(selectorIndices);
                this.setValueInternal(selectorIndices[this.SELECTOR_MIDDLE_ITEM_INDEX], true);
                if (!this.mWrapSelectorWheel && selectorIndices[this.SELECTOR_MIDDLE_ITEM_INDEX] >= this.mMaxValue) {
                    this.mCurrentScrollOffset = this.mInitialScrollOffset;
                }
            }
        }

        protected computeVerticalScrollOffset():number  {
            return this.mCurrentScrollOffset;
        }

        protected computeVerticalScrollRange():number  {
            return (this.mMaxValue - this.mMinValue + 1) * this.mSelectorElementHeight;
        }

        protected computeVerticalScrollExtent():number  {
            return this.getHeight();
        }

        getSolidColor():number  {
            return this.mSolidColor;
        }

        /**
         * Sets the listener to be notified on change of the current value.
         *
         * @param onValueChangedListener The listener.
         */
        setOnValueChangedListener(onValueChangedListener:NumberPicker.OnValueChangeListener):void  {
            this.mOnValueChangeListener = onValueChangedListener;
        }

        /**
         * Set listener to be notified for scroll state changes.
         *
         * @param onScrollListener The listener.
         */
        setOnScrollListener(onScrollListener:NumberPicker.OnScrollListener):void  {
            this.mOnScrollListener = onScrollListener;
        }

        /**
         * Set the formatter to be used for formatting the current value.
         * <p>
         * Note: If you have provided alternative values for the values this
         * formatter is never invoked.
         * </p>
         *
         * @param formatter The formatter object. If formatter is <code>null</code>,
         *            {@link String#valueOf(int)} will be used.
         *@see #setDisplayedValues(String[])
         */
        setFormatter(formatter:NumberPicker.Formatter):void  {
            if (formatter == this.mFormatter) {
                return;
            }
            this.mFormatter = formatter;
            this.initializeSelectorWheelIndices();
            this.updateInputTextView();
        }

        /**
         * Set the current value for the number picker.
         * <p>
         * If the argument is less than the {@link NumberPicker#getMinValue()} and
         * {@link NumberPicker#getWrapSelectorWheel()} is <code>false</code> the
         * current value is set to the {@link NumberPicker#getMinValue()} value.
         * </p>
         * <p>
         * If the argument is less than the {@link NumberPicker#getMinValue()} and
         * {@link NumberPicker#getWrapSelectorWheel()} is <code>true</code> the
         * current value is set to the {@link NumberPicker#getMaxValue()} value.
         * </p>
         * <p>
         * If the argument is less than the {@link NumberPicker#getMaxValue()} and
         * {@link NumberPicker#getWrapSelectorWheel()} is <code>false</code> the
         * current value is set to the {@link NumberPicker#getMaxValue()} value.
         * </p>
         * <p>
         * If the argument is less than the {@link NumberPicker#getMaxValue()} and
         * {@link NumberPicker#getWrapSelectorWheel()} is <code>true</code> the
         * current value is set to the {@link NumberPicker#getMinValue()} value.
         * </p>
         *
         * @param value The current value.
         * @see #setWrapSelectorWheel(boolean)
         * @see #setMinValue(int)
         * @see #setMaxValue(int)
         */
        setValue(value:number):void  {
            this.setValueInternal(value, false);
        }

        /**
         * Shows the soft input for its input text.
         */
        private showSoftInput():void  {
            //let inputMethodManager:InputMethodManager = InputMethodManager.peekInstance();
            //if (inputMethodManager != null) {
            //    if (this.mHasSelectorWheel) {
            //        this.mInputText.setVisibility(View.VISIBLE);
            //    }
            //    this.mInputText.requestFocus();
            //    inputMethodManager.showSoftInput(this.mInputText, 0);
            //}
        }

        /**
         * Hides the soft input if it is active for the input text.
         */
        private hideSoftInput():void  {
            //let inputMethodManager:InputMethodManager = InputMethodManager.peekInstance();
            //if (inputMethodManager != null && inputMethodManager.isActive(this.mInputText)) {
            //    inputMethodManager.hideSoftInputFromWindow(this.getWindowToken(), 0);
            //    if (this.mHasSelectorWheel) {
            //        this.mInputText.setVisibility(View.INVISIBLE);
            //    }
            //}
        }

        /**
         * Computes the max width if no such specified as an attribute.
         */
        private tryComputeMaxWidth():void  {
            if (!this.mComputeMaxWidth) {
                return;
            }
            let maxTextWidth:number = 0;
            if (this.mDisplayedValues == null) {
                let maxDigitWidth:number = 0;
                for (let i:number = 0; i <= 9; i++) {
                    const digitWidth:number = this.mSelectorWheelPaint.measureText(NumberPicker.formatNumberWithLocale(i));
                    if (digitWidth > maxDigitWidth) {
                        maxDigitWidth = digitWidth;
                    }
                }
                let numberOfDigits:number = 0;
                let current:number = this.mMaxValue;
                while (current > 0) {
                    numberOfDigits++;
                    current = current / 10;
                }
                maxTextWidth = Math.floor((numberOfDigits * maxDigitWidth));
            } else {
                const valueCount:number = this.mDisplayedValues.length;
                for (let i:number = 0; i < valueCount; i++) {
                    const textWidth:number = this.mSelectorWheelPaint.measureText(this.mDisplayedValues[i]);
                    if (textWidth > maxTextWidth) {
                        maxTextWidth = Math.floor(textWidth);
                    }
                }
            }
            //maxTextWidth += this.mInputText.getPaddingLeft() + this.mInputText.getPaddingRight();
            if (this.mMaxWidth != maxTextWidth) {
                if (maxTextWidth > this.mMinWidth_) {
                    this.mMaxWidth = maxTextWidth;
                } else {
                    this.mMaxWidth = this.mMinWidth_;
                }
                this.invalidate();
            }
        }

        /**
         * Gets whether the selector wheel wraps when reaching the min/max value.
         *
         * @return True if the selector wheel wraps.
         *
         * @see #getMinValue()
         * @see #getMaxValue()
         */
        getWrapSelectorWheel():boolean  {
            return this.mWrapSelectorWheel;
        }

        /**
         * Sets whether the selector wheel shown during flinging/scrolling should
         * wrap around the {@link NumberPicker#getMinValue()} and
         * {@link NumberPicker#getMaxValue()} values.
         * <p>
         * By default if the range (max - min) is more than the number of items shown
         * on the selector wheel the selector wheel wrapping is enabled.
         * </p>
         * <p>
         * <strong>Note:</strong> If the number of items, i.e. the range (
         * {@link #getMaxValue()} - {@link #getMinValue()}) is less than
         * the number of items shown on the selector wheel, the selector wheel will
         * not wrap. Hence, in such a case calling this method is a NOP.
         * </p>
         *
         * @param wrapSelectorWheel Whether to wrap.
         */
        setWrapSelectorWheel(wrapSelectorWheel:boolean):void  {
            const wrappingAllowed:boolean = (this.mMaxValue - this.mMinValue) >= this.mSelectorIndices.length;
            if ((!wrapSelectorWheel || wrappingAllowed) && wrapSelectorWheel != this.mWrapSelectorWheel) {
                this.mWrapSelectorWheel = wrapSelectorWheel;
            }
        }

        /**
         * Sets the speed at which the numbers be incremented and decremented when
         * the up and down buttons are long pressed respectively.
         * <p>
         * The default value is 300 ms.
         * </p>
         *
         * @param intervalMillis The speed (in milliseconds) at which the numbers
         *            will be incremented and decremented.
         */
        setOnLongPressUpdateInterval(intervalMillis:number):void  {
            this.mLongPressUpdateInterval = intervalMillis;
        }

        /**
         * Returns the value of the picker.
         *
         * @return The value.
         */
        getValue():number  {
            return this.mValue;
        }

        /**
         * Returns the min value of the picker.
         *
         * @return The min value
         */
        getMinValue():number  {
            return this.mMinValue;
        }

        /**
         * Sets the min value of the picker.
         *
         * @param minValue The min value inclusive.
         *
         * <strong>Note:</strong> The length of the displayed values array
         * set via {@link #setDisplayedValues(String[])} must be equal to the
         * range of selectable numbers which is equal to
         * {@link #getMaxValue()} - {@link #getMinValue()} + 1.
         */
        setMinValue(minValue:number):void  {
            if (this.mMinValue == minValue) {
                return;
            }
            if (minValue < 0) {
                throw Error(`new IllegalArgumentException("minValue must be >= 0")`);
            }
            this.mMinValue = minValue;
            if (this.mMinValue > this.mValue) {
                this.mValue = this.mMinValue;
            }
            let wrapSelectorWheel:boolean = this.mMaxValue - this.mMinValue > this.mSelectorIndices.length;
            this.setWrapSelectorWheel(wrapSelectorWheel);
            this.initializeSelectorWheelIndices();
            this.updateInputTextView();
            this.tryComputeMaxWidth();
            this.invalidate();
        }

        /**
         * Returns the max value of the picker.
         *
         * @return The max value.
         */
        getMaxValue():number  {
            return this.mMaxValue;
        }

        /**
         * Sets the max value of the picker.
         *
         * @param maxValue The max value inclusive.
         *
         * <strong>Note:</strong> The length of the displayed values array
         * set via {@link #setDisplayedValues(String[])} must be equal to the
         * range of selectable numbers which is equal to
         * {@link #getMaxValue()} - {@link #getMinValue()} + 1.
         */
        setMaxValue(maxValue:number):void  {
            if (this.mMaxValue == maxValue) {
                return;
            }
            if (maxValue < 0) {
                throw Error(`new IllegalArgumentException("maxValue must be >= 0")`);
            }
            this.mMaxValue = maxValue;
            if (this.mMaxValue < this.mValue) {
                this.mValue = this.mMaxValue;
            }
            let wrapSelectorWheel:boolean = this.mMaxValue - this.mMinValue > this.mSelectorIndices.length;
            this.setWrapSelectorWheel(wrapSelectorWheel);
            this.initializeSelectorWheelIndices();
            this.updateInputTextView();
            this.tryComputeMaxWidth();
            this.invalidate();
        }

        /**
         * Gets the values to be displayed instead of string values.
         *
         * @return The displayed values.
         */
        getDisplayedValues():string[]  {
            return this.mDisplayedValues;
        }

        /**
         * Sets the values to be displayed.
         *
         * @param displayedValues The displayed values.
         *
         * <strong>Note:</strong> The length of the displayed values array
         * must be equal to the range of selectable numbers which is equal to
         * {@link #getMaxValue()} - {@link #getMinValue()} + 1.
         */
        setDisplayedValues(displayedValues:string[]):void  {
            if (this.mDisplayedValues == displayedValues) {
                return;
            }
            this.mDisplayedValues = displayedValues;
            if (this.mDisplayedValues != null) {
                // Allow text entry rather than strictly numeric entry.
                //this.mInputText.setRawInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
            } else {
                //this.mInputText.setRawInputType(InputType.TYPE_CLASS_NUMBER);
            }
            this.updateInputTextView();
            this.initializeSelectorWheelIndices();
            this.tryComputeMaxWidth();
        }

        protected getTopFadingEdgeStrength():number  {
            return NumberPicker.TOP_AND_BOTTOM_FADING_EDGE_STRENGTH;
        }

        protected getBottomFadingEdgeStrength():number  {
            return NumberPicker.TOP_AND_BOTTOM_FADING_EDGE_STRENGTH;
        }

        protected onDetachedFromWindow():void  {
            super.onDetachedFromWindow();
            this.removeAllCallbacks();
        }

        protected onDraw(canvas:Canvas):void  {
            if (!this.mHasSelectorWheel) {
                super.onDraw(canvas);
                return;
            }
            let x:number = (this.mRight - this.mLeft) / 2;
            let y:number = this.mCurrentScrollOffset;
            // draw the virtual buttons pressed state if needed
            if (this.mVirtualButtonPressedDrawable != null && this.mScrollState == NumberPicker.OnScrollListener.SCROLL_STATE_IDLE) {
                if (this.mDecrementVirtualButtonPressed) {
                    this.mVirtualButtonPressedDrawable.setState(NumberPicker.PRESSED_STATE_SET);
                    this.mVirtualButtonPressedDrawable.setBounds(0, 0, this.mRight, this.mTopSelectionDividerTop);
                    this.mVirtualButtonPressedDrawable.draw(canvas);
                }
                if (this.mIncrementVirtualButtonPressed) {
                    this.mVirtualButtonPressedDrawable.setState(NumberPicker.PRESSED_STATE_SET);
                    this.mVirtualButtonPressedDrawable.setBounds(0, this.mBottomSelectionDividerBottom, this.mRight, this.mBottom);
                    this.mVirtualButtonPressedDrawable.draw(canvas);
                }
            }
            // draw the selector wheel
            let selectorIndices:number[] = this.mSelectorIndices;
            for (let i:number = 0; i < selectorIndices.length; i++) {
                let selectorIndex:number = selectorIndices[i];
                let scrollSelectorValue:string = this.mSelectorIndexToStringCache.get(selectorIndex);
                // with the new one.
                //if (i != this.SELECTOR_MIDDLE_ITEM_INDEX || this.mInputText.getVisibility() != NumberPicker.VISIBLE) {
                    canvas.drawText(scrollSelectorValue, x, y, this.mSelectorWheelPaint);
                //}
                y += this.mSelectorElementHeight;
            }
            // draw the selection dividers
            if (this.mSelectionDivider != null) {
                // draw the top divider
                let topOfTopDivider:number = this.mTopSelectionDividerTop;
                let bottomOfTopDivider:number = topOfTopDivider + this.mSelectionDividerHeight;
                this.mSelectionDivider.setBounds(0, topOfTopDivider, this.mRight, bottomOfTopDivider);
                this.mSelectionDivider.draw(canvas);
                // draw the bottom divider
                let bottomOfBottomDivider:number = this.mBottomSelectionDividerBottom;
                let topOfBottomDivider:number = bottomOfBottomDivider - this.mSelectionDividerHeight;
                this.mSelectionDivider.setBounds(0, topOfBottomDivider, this.mRight, bottomOfBottomDivider);
                this.mSelectionDivider.draw(canvas);
            }
        }

        //onInitializeAccessibilityEvent(event:AccessibilityEvent):void  {
        //    super.onInitializeAccessibilityEvent(event);
        //    event.setClassName(NumberPicker.class.getName());
        //    event.setScrollable(true);
        //    event.setScrollY((this.mMinValue + this.mValue) * this.mSelectorElementHeight);
        //    event.setMaxScrollY((this.mMaxValue - this.mMinValue) * this.mSelectorElementHeight);
        //}
        //
        //getAccessibilityNodeProvider():AccessibilityNodeProvider  {
        //    if (!this.mHasSelectorWheel) {
        //        return super.getAccessibilityNodeProvider();
        //    }
        //    if (this.mAccessibilityNodeProvider == null) {
        //        this.mAccessibilityNodeProvider = new NumberPicker.AccessibilityNodeProviderImpl(this);
        //    }
        //    return this.mAccessibilityNodeProvider;
        //}

        /**
         * Makes a measure spec that tries greedily to use the max value.
         *
         * @param measureSpec The measure spec.
         * @param maxSize The max value for the size.
         * @return A measure spec greedily imposing the max size.
         */
        private makeMeasureSpec(measureSpec:number, maxSize:number):number  {
            if (maxSize == NumberPicker.SIZE_UNSPECIFIED) {
                return measureSpec;
            }
            const size:number = View.MeasureSpec.getSize(measureSpec);
            const mode:number = View.MeasureSpec.getMode(measureSpec);
            switch(mode) {
                case View.MeasureSpec.EXACTLY:
                    return measureSpec;
                case View.MeasureSpec.AT_MOST:
                    return View.MeasureSpec.makeMeasureSpec(Math.min(size, maxSize), View.MeasureSpec.EXACTLY);
                case View.MeasureSpec.UNSPECIFIED:
                    return View.MeasureSpec.makeMeasureSpec(maxSize, View.MeasureSpec.EXACTLY);
                default:
                    throw Error(`new IllegalArgumentException("Unknown measure mode: " + mode)`);
            }
        }

        /**
         * Utility to reconcile a desired size and state, with constraints imposed
         * by a MeasureSpec. Tries to respect the min size, unless a different size
         * is imposed by the constraints.
         *
         * @param minSize The minimal desired size.
         * @param measuredSize The currently measured size.
         * @param measureSpec The current measure spec.
         * @return The resolved size and state.
         */
        private resolveSizeAndStateRespectingMinSize(minSize:number, measuredSize:number, measureSpec:number):number  {
            if (minSize != NumberPicker.SIZE_UNSPECIFIED) {
                const desiredWidth:number = Math.max(minSize, measuredSize);
                return NumberPicker.resolveSizeAndState(desiredWidth, measureSpec, 0);
            } else {
                return measuredSize;
            }
        }

        /**
         * Resets the selector indices and clear the cached string representation of
         * these indices.
         */
        private initializeSelectorWheelIndices():void  {
            this.mSelectorIndexToStringCache.clear();
            let selectorIndices:number[] = this.mSelectorIndices;
            let current:number = this.getValue();
            for (let i:number = 0; i < this.mSelectorIndices.length; i++) {
                let selectorIndex:number = Math.floor(current + (i - this.SELECTOR_MIDDLE_ITEM_INDEX));
                if (this.mWrapSelectorWheel) {
                    selectorIndex = this.getWrappedSelectorIndex(selectorIndex);
                }
                selectorIndices[i] = selectorIndex;
                this.ensureCachedScrollSelectorValue(selectorIndices[i]);
            }
        }

        /**
         * Sets the current value of this NumberPicker.
         *
         * @param current The new value of the NumberPicker.
         * @param notifyChange Whether to notify if the current value changed.
         */
        private setValueInternal(current:number, notifyChange:boolean):void  {
            if (this.mValue == current) {
                return;
            }
            // Wrap around the values if we go past the start or end
            if (this.mWrapSelectorWheel) {
                current = this.getWrappedSelectorIndex(current);
            } else {
                current = Math.max(current, this.mMinValue);
                current = Math.min(current, this.mMaxValue);
            }
            let previous:number = this.mValue;
            this.mValue = current;
            this.updateInputTextView();
            if (notifyChange) {
                this.notifyChange(previous, current);
            }
            this.initializeSelectorWheelIndices();
            this.invalidate();
        }

        /**
         * Changes the current value by one which is increment or
         * decrement based on the passes argument.
         * decrement the current value.
         *
         * @param increment True to increment, false to decrement.
         */
        private changeValueByOne(increment:boolean):void  {
            if (this.mHasSelectorWheel) {
                //this.mInputText.setVisibility(View.INVISIBLE);
                if (!this.moveToFinalScrollerPosition(this.mFlingScroller)) {
                    this.moveToFinalScrollerPosition(this.mAdjustScroller);
                }
                this.mPreviousScrollerY = 0;
                if (increment) {
                    this.mFlingScroller.startScroll(0, 0, 0, -this.mSelectorElementHeight, NumberPicker.SNAP_SCROLL_DURATION);
                } else {
                    this.mFlingScroller.startScroll(0, 0, 0, this.mSelectorElementHeight, NumberPicker.SNAP_SCROLL_DURATION);
                }
                this.invalidate();
            } else {
                if (increment) {
                    this.setValueInternal(this.mValue + 1, true);
                } else {
                    this.setValueInternal(this.mValue - 1, true);
                }
            }
        }

        private initializeSelectorWheel():void  {
            this.initializeSelectorWheelIndices();
            let selectorIndices:number[] = this.mSelectorIndices;
            let totalTextHeight:number = selectorIndices.length * this.mTextSize;
            let totalTextGapHeight:number = (this.mBottom - this.mTop) - totalTextHeight;
            let textGapCount:number = selectorIndices.length;
            this.mSelectorTextGapHeight = Math.floor((totalTextGapHeight / textGapCount + 0.5));
            this.mSelectorElementHeight = this.mTextSize + this.mSelectorTextGapHeight;
            // Ensure that the middle item is positioned the same as the text in
            // mInputText
            let editTextTextPosition:number = this.getHeight()/2 + this.mTextSize/2;
            this.mInitialScrollOffset = editTextTextPosition - (this.mSelectorElementHeight * this.SELECTOR_MIDDLE_ITEM_INDEX);
            this.mCurrentScrollOffset = this.mInitialScrollOffset;
            this.updateInputTextView();
        }

        private initializeFadingEdges():void  {
            this.setVerticalFadingEdgeEnabled(true);
            this.setFadingEdgeLength((this.mBottom - this.mTop - this.mTextSize) / 2);
        }

        /**
         * Callback invoked upon completion of a given <code>scroller</code>.
         */
        private onScrollerFinished(scroller:Scroller):void  {
            if (scroller == this.mFlingScroller) {
                if (!this.ensureScrollWheelAdjusted()) {
                    this.updateInputTextView();
                }
                this.onScrollStateChange(NumberPicker.OnScrollListener.SCROLL_STATE_IDLE);
            } else {
                if (this.mScrollState != NumberPicker.OnScrollListener.SCROLL_STATE_TOUCH_SCROLL) {
                    this.updateInputTextView();
                }
            }
        }

        /**
         * Handles transition to a given <code>scrollState</code>
         */
        private onScrollStateChange(scrollState:number):void  {
            if (this.mScrollState == scrollState) {
                return;
            }
            this.mScrollState = scrollState;
            if (this.mOnScrollListener != null) {
                this.mOnScrollListener.onScrollStateChange(this, scrollState);
            }
        }

        /**
         * Flings the selector with the given <code>velocityY</code>.
         */
        private fling(velocityY:number):void  {
            this.mPreviousScrollerY = 0;
            if (velocityY > 0) {
                this.mFlingScroller.fling(0, 0, 0, velocityY, 0, 0, 0, Integer.MAX_VALUE);
            } else {
                this.mFlingScroller.fling(0, Integer.MAX_VALUE, 0, velocityY, 0, 0, 0, Integer.MAX_VALUE);
            }
            this.invalidate();
        }

        /**
         * @return The wrapped index <code>selectorIndex</code> value.
         */
        private getWrappedSelectorIndex(selectorIndex:number):number  {
            if (selectorIndex > this.mMaxValue) {
                return this.mMinValue + (selectorIndex - this.mMaxValue) % (this.mMaxValue - this.mMinValue) - 1;
            } else if (selectorIndex < this.mMinValue) {
                return this.mMaxValue - (this.mMinValue - selectorIndex) % (this.mMaxValue - this.mMinValue) + 1;
            }
            return selectorIndex;
        }

        /**
         * Increments the <code>selectorIndices</code> whose string representations
         * will be displayed in the selector.
         */
        private incrementSelectorIndices(selectorIndices:number[]):void  {
            for (let i:number = 0; i < selectorIndices.length - 1; i++) {
                selectorIndices[i] = selectorIndices[i + 1];
            }
            let nextScrollSelectorIndex:number = selectorIndices[selectorIndices.length - 2] + 1;
            if (this.mWrapSelectorWheel && nextScrollSelectorIndex > this.mMaxValue) {
                nextScrollSelectorIndex = this.mMinValue;
            }
            selectorIndices[selectorIndices.length - 1] = nextScrollSelectorIndex;
            this.ensureCachedScrollSelectorValue(nextScrollSelectorIndex);
        }

        /**
         * Decrements the <code>selectorIndices</code> whose string representations
         * will be displayed in the selector.
         */
        private decrementSelectorIndices(selectorIndices:number[]):void  {
            for (let i:number = selectorIndices.length - 1; i > 0; i--) {
                selectorIndices[i] = selectorIndices[i - 1];
            }
            let nextScrollSelectorIndex:number = selectorIndices[1] - 1;
            if (this.mWrapSelectorWheel && nextScrollSelectorIndex < this.mMinValue) {
                nextScrollSelectorIndex = this.mMaxValue;
            }
            selectorIndices[0] = nextScrollSelectorIndex;
            this.ensureCachedScrollSelectorValue(nextScrollSelectorIndex);
        }

        /**
         * Ensures we have a cached string representation of the given <code>
         * selectorIndex</code> to avoid multiple instantiations of the same string.
         */
        private ensureCachedScrollSelectorValue(selectorIndex:number):void  {
            let cache:SparseArray<string> = this.mSelectorIndexToStringCache;
            let scrollSelectorValue:string = cache.get(selectorIndex);
            if (scrollSelectorValue != null) {
                return;
            }
            if (selectorIndex < this.mMinValue || selectorIndex > this.mMaxValue) {
                scrollSelectorValue = "";
            } else {
                if (this.mDisplayedValues != null) {
                    let displayedValueIndex:number = selectorIndex - this.mMinValue;
                    scrollSelectorValue = this.mDisplayedValues[displayedValueIndex];
                } else {
                    scrollSelectorValue = this.formatNumber(selectorIndex);
                }
            }
            cache.put(selectorIndex, scrollSelectorValue);
        }

        private formatNumber(value:number):string  {
            return (this.mFormatter != null) ? this.mFormatter.format(value) : NumberPicker.formatNumberWithLocale(value);
        }

        private validateInputTextView(v:View):void  {
            //let str:string = String.valueOf((<TextView> v).getText());
            //if (TextUtils.isEmpty(str)) {
            //    // Restore to the old value as we don't allow empty values
            //    this.updateInputTextView();
            //} else {
            //    // Check the new value and ensure it's in range
            //    let current:number = this.getSelectedPos(str.toString());
            //    this.setValueInternal(current, true);
            //}
        }

        /**
         * Updates the view of this NumberPicker. If displayValues were specified in
         * the string corresponding to the index specified by the current value will
         * be returned. Otherwise, the formatter specified in {@link #setFormatter}
         * will be used to format the number.
         *
         * @return Whether the text was updated.
         */
        private updateInputTextView():boolean  {
            /*
             * If we don't have displayed values then use the current number else
             * find the correct value in the displayed values for the current
             * number.
             */
            //let text:string = (this.mDisplayedValues == null) ? this.formatNumber(this.mValue) : this.mDisplayedValues[this.mValue - this.mMinValue];
            //if (!TextUtils.isEmpty(text) && !text.equals(this.mInputText.getText().toString())) {
            //    this.mInputText.setText(text);
            //    return true;
            //}
            return false;
        }

        /**
         * Notifies the listener, if registered, of a change of the value of this
         * NumberPicker.
         */
        private notifyChange(previous:number, current:number):void  {
            if (this.mOnValueChangeListener != null) {
                this.mOnValueChangeListener.onValueChange(this, previous, this.mValue);
            }
        }

        /**
         * Posts a command for changing the current value by one.
         *
         * @param increment Whether to increment or decrement the value.
         */
        private postChangeCurrentByOneFromLongPress(increment:boolean, delayMillis:number):void  {
            if (this.mChangeCurrentByOneFromLongPressCommand == null) {
                this.mChangeCurrentByOneFromLongPressCommand = new NumberPicker.ChangeCurrentByOneFromLongPressCommand(this);
            } else {
                this.removeCallbacks(this.mChangeCurrentByOneFromLongPressCommand);
            }
            this.mChangeCurrentByOneFromLongPressCommand.setStep(increment);
            this.postDelayed(this.mChangeCurrentByOneFromLongPressCommand, delayMillis);
        }

        /**
         * Removes the command for changing the current value by one.
         */
        private removeChangeCurrentByOneFromLongPress():void  {
            if (this.mChangeCurrentByOneFromLongPressCommand != null) {
                this.removeCallbacks(this.mChangeCurrentByOneFromLongPressCommand);
            }
        }

        /**
         * Posts a command for beginning an edit of the current value via IME on
         * long press.
         */
        private postBeginSoftInputOnLongPressCommand():void  {
            if (this.mBeginSoftInputOnLongPressCommand == null) {
                this.mBeginSoftInputOnLongPressCommand = new NumberPicker.BeginSoftInputOnLongPressCommand(this);
            } else {
                this.removeCallbacks(this.mBeginSoftInputOnLongPressCommand);
            }
            this.postDelayed(this.mBeginSoftInputOnLongPressCommand, ViewConfiguration.getLongPressTimeout());
        }

        /**
         * Removes the command for beginning an edit of the current value via IME.
         */
        private removeBeginSoftInputCommand():void  {
            if (this.mBeginSoftInputOnLongPressCommand != null) {
                this.removeCallbacks(this.mBeginSoftInputOnLongPressCommand);
            }
        }

        /**
         * Removes all pending callback from the message queue.
         */
        private removeAllCallbacks():void  {
            if (this.mChangeCurrentByOneFromLongPressCommand != null) {
                this.removeCallbacks(this.mChangeCurrentByOneFromLongPressCommand);
            }
            if (this.mSetSelectionCommand != null) {
                this.removeCallbacks(this.mSetSelectionCommand);
            }
            if (this.mBeginSoftInputOnLongPressCommand != null) {
                this.removeCallbacks(this.mBeginSoftInputOnLongPressCommand);
            }
            this.mPressedStateHelper.cancel();
        }

        /**
         * @return The selected index given its displayed <code>value</code>.
         */
        private getSelectedPos(value:string):number  {
            if (this.mDisplayedValues == null) {
                try {
                    return Integer.parseInt(value);
                } catch (e){
                }
            } else {
                for (let i:number = 0; i < this.mDisplayedValues.length; i++) {
                    // Don't force the user to type in jan when ja will do
                    value = value.toLowerCase();
                    if (this.mDisplayedValues[i].toLowerCase().startsWith(value)) {
                        return this.mMinValue + i;
                    }
                }
                /*
                 * The user might have typed in a number into the month field i.e.
                 * 10 instead of OCT so support that too.
                 */
                try {
                    return Integer.parseInt(value);
                } catch (e){
                }
            }
            return this.mMinValue;
        }

        /**
         * Posts an {@link SetSelectionCommand} from the given <code>selectionStart
         * </code> to <code>selectionEnd</code>.
         */
        private postSetSelectionCommand(selectionStart:number, selectionEnd:number):void  {
            if (this.mSetSelectionCommand == null) {
                this.mSetSelectionCommand = new NumberPicker.SetSelectionCommand(this);
            } else {
                this.removeCallbacks(this.mSetSelectionCommand);
            }
            this.mSetSelectionCommand.mSelectionStart = selectionStart;
            this.mSetSelectionCommand.mSelectionEnd = selectionEnd;
            this.post(this.mSetSelectionCommand);
        }

        /**
         * The numbers accepted by the input text's {@link Filter}
         */
        //private static DIGIT_CHARACTERS:char[] =  [ // Latin digits are the common case
        //    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', // Arabic-Indic
        //    '٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', // Extended Arabic-Indic
        //    '۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹' ];



        /**
         * Ensures that the scroll wheel is adjusted i.e. there is no offset and the
         * middle element is in the middle of the widget.
         *
         * @return Whether an adjustment has been made.
         */
        private ensureScrollWheelAdjusted():boolean  {
            // adjust to the closest value
            let deltaY:number = this.mInitialScrollOffset - this.mCurrentScrollOffset;
            if (deltaY != 0) {
                this.mPreviousScrollerY = 0;
                if (Math.abs(deltaY) > this.mSelectorElementHeight / 2) {
                    deltaY += (deltaY > 0) ? -this.mSelectorElementHeight : this.mSelectorElementHeight;
                }
                this.mAdjustScroller.startScroll(0, 0, 0, deltaY, NumberPicker.SELECTOR_ADJUSTMENT_DURATION_MILLIS);
                this.invalidate();
                return true;
            }
            return false;
        }













        private static formatNumberWithLocale(value:number):string  {
            return value + '';
        }
    }

    export module NumberPicker{
        /**
         * Use a custom NumberPicker formatting callback to use two-digit minutes
         * strings like "01". Keeping a static formatter etc. is the most efficient
         * way to do this; it avoids creating temporary objects on every call to
         * format().
         */
        export class TwoDigitFormatter implements NumberPicker.Formatter {
            format(value:number):string  {
                let s = value+'';
                if(s.length===1) s = '0' + s;
                return s;
            }
        }
        /**
         * Interface to listen for changes of the current value.
         */
        export interface OnValueChangeListener {

            /**
             * Called upon a change of the current value.
             *
             * @param picker The NumberPicker associated with this listener.
             * @param oldVal The previous value.
             * @param newVal The new value.
             */
            onValueChange(picker:NumberPicker, oldVal:number, newVal:number):void ;
        }
        /**
         * Interface to listen for the picker scroll state.
         */
        export interface OnScrollListener {

            /**
             * Callback invoked while the number picker scroll state has changed.
             *
             * @param view The view whose scroll state is being reported.
             * @param scrollState The current scroll state. One of
             *            {@link #SCROLL_STATE_IDLE},
             *            {@link #SCROLL_STATE_TOUCH_SCROLL} or
             *            {@link #SCROLL_STATE_IDLE}.
             */
            onScrollStateChange(view:NumberPicker, scrollState:number):void ;
        }

        export module OnScrollListener{
            /**
             * The view is not scrolling.
             */
            export var SCROLL_STATE_IDLE:number = 0;/**
         * The user is scrolling using touch, and his finger is still on the screen.
         */
        export var SCROLL_STATE_TOUCH_SCROLL:number = 1;/**
         * The user had previously been scrolling using touch and performed a fling.
         */
        export var SCROLL_STATE_FLING:number = 2;}

        /**
         * Interface used to format current value into a string for presentation.
         */
        export interface Formatter {

            /**
             * Formats a string representation of the current value.
             *
             * @param value The currently selected value.
             * @return A formatted string representation.
             */
            format(value:number):string ;
        }
        ///**
        // * Filter for accepting only valid indices or prefixes of the string
        // * representation of valid indices.
        // */
        //export class InputTextFilter extends NumberKeyListener {
        //    _NumberPicker_this:NumberPicker;
        //    constructor(arg:NumberPicker){
        //        super();
        //        this._NumberPicker_this = arg;
        //    }
        //
        //    // XXX This doesn't allow for range limits when controlled by a
        //    // soft input method!
        //    getInputType():number  {
        //        return InputType.TYPE_CLASS_TEXT;
        //    }
        //
        //    protected getAcceptedChars():char[]  {
        //        return NumberPicker.DIGIT_CHARACTERS;
        //    }
        //
        //    filter(source:CharSequence, start:number, end:number, dest:Spanned, dstart:number, dend:number):CharSequence  {
        //        if (this._NumberPicker_this.mDisplayedValues == null) {
        //            let filtered:CharSequence = super.filter(source, start, end, dest, dstart, dend);
        //            if (filtered == null) {
        //                filtered = source.subSequence(start, end);
        //            }
        //            let result:string = String.valueOf(dest.subSequence(0, dstart)) + filtered + dest.subSequence(dend, dest.length());
        //            if ("".equals(result)) {
        //                return result;
        //            }
        //            let val:number = this._NumberPicker_this.getSelectedPos(result);
        //            /*
        //             * Ensure the user can't type in a value greater than the max
        //             * allowed. We have to allow less than min as the user might
        //             * want to delete some numbers and then type a new number.
        //             * And prevent multiple-"0" that exceeds the length of upper
        //             * bound number.
        //             */
        //            if (val > this._NumberPicker_this.mMaxValue || result.length() > String.valueOf(this._NumberPicker_this.mMaxValue).length()) {
        //                return "";
        //            } else {
        //                return filtered;
        //            }
        //        } else {
        //            let filtered:CharSequence = String.valueOf(source.subSequence(start, end));
        //            if (TextUtils.isEmpty(filtered)) {
        //                return "";
        //            }
        //            let result:string = String.valueOf(dest.subSequence(0, dstart)) + filtered + dest.subSequence(dend, dest.length());
        //            let str:string = String.valueOf(result).toLowerCase();
        //            for (let val:string of this._NumberPicker_this.mDisplayedValues) {
        //                let valLowerCase:string = val.toLowerCase();
        //                if (valLowerCase.startsWith(str)) {
        //                    this._NumberPicker_this.postSetSelectionCommand(result.length(), val.length());
        //                    return val.subSequence(dstart, val.length());
        //                }
        //            }
        //            return "";
        //        }
        //    }
        //}
        export class PressedStateHelper implements Runnable {
            _NumberPicker_this:NumberPicker;
            constructor(arg:NumberPicker){
                this._NumberPicker_this = arg;
            }

            static BUTTON_INCREMENT:number = 1;

            static BUTTON_DECREMENT:number = 2;

            private MODE_PRESS:number = 1;

            private MODE_TAPPED:number = 2;

            private mManagedButton:number = 0;

            private mMode:number = 0;

            cancel():void  {
                this.mMode = 0;
                this.mManagedButton = 0;
                this._NumberPicker_this.removeCallbacks(this);
                if (this._NumberPicker_this.mIncrementVirtualButtonPressed) {
                    this._NumberPicker_this.mIncrementVirtualButtonPressed = false;
                    this._NumberPicker_this.invalidate(0, this._NumberPicker_this.mBottomSelectionDividerBottom, this._NumberPicker_this.mRight, this._NumberPicker_this.mBottom);
                }
                if (this._NumberPicker_this.mDecrementVirtualButtonPressed) {
                    this._NumberPicker_this.mDecrementVirtualButtonPressed = false;
                    this._NumberPicker_this.invalidate(0, 0, this._NumberPicker_this.mRight, this._NumberPicker_this.mTopSelectionDividerTop);
                }
            }

            buttonPressDelayed(button:number):void  {
                this.cancel();
                this.mMode = this.MODE_PRESS;
                this.mManagedButton = button;
                this._NumberPicker_this.postDelayed(this, ViewConfiguration.getTapTimeout());
            }

            buttonTapped(button:number):void  {
                this.cancel();
                this.mMode = this.MODE_TAPPED;
                this.mManagedButton = button;
                this._NumberPicker_this.post(this);
            }

            run():void  {
                switch(this.mMode) {
                    case this.MODE_PRESS:
                    {
                        switch(this.mManagedButton) {
                            case PressedStateHelper.BUTTON_INCREMENT:
                            {
                                this._NumberPicker_this.mIncrementVirtualButtonPressed = true;
                                this._NumberPicker_this.invalidate(0, this._NumberPicker_this.mBottomSelectionDividerBottom, this._NumberPicker_this.mRight, this._NumberPicker_this.mBottom);
                            }
                                break;
                            case PressedStateHelper.BUTTON_DECREMENT:
                            {
                                this._NumberPicker_this.mDecrementVirtualButtonPressed = true;
                                this._NumberPicker_this.invalidate(0, 0, this._NumberPicker_this.mRight, this._NumberPicker_this.mTopSelectionDividerTop);
                            }
                        }
                    }
                        break;
                    case this.MODE_TAPPED:
                    {
                        switch(this.mManagedButton) {
                            case PressedStateHelper.BUTTON_INCREMENT:
                            {
                                if (!this._NumberPicker_this.mIncrementVirtualButtonPressed) {
                                    this._NumberPicker_this.postDelayed(this, ViewConfiguration.getPressedStateDuration());
                                }
                                this._NumberPicker_this.mIncrementVirtualButtonPressed = !this._NumberPicker_this.mIncrementVirtualButtonPressed;
                                this._NumberPicker_this.invalidate(0, this._NumberPicker_this.mBottomSelectionDividerBottom, this._NumberPicker_this.mRight, this._NumberPicker_this.mBottom);
                            }
                                break;
                            case PressedStateHelper.BUTTON_DECREMENT:
                            {
                                if (!this._NumberPicker_this.mDecrementVirtualButtonPressed) {
                                    this._NumberPicker_this.postDelayed(this, ViewConfiguration.getPressedStateDuration());
                                }
                                this._NumberPicker_this.mDecrementVirtualButtonPressed = !this._NumberPicker_this.mDecrementVirtualButtonPressed;
                                this._NumberPicker_this.invalidate(0, 0, this._NumberPicker_this.mRight, this._NumberPicker_this.mTopSelectionDividerTop);
                            }
                        }
                    }
                        break;
                }
            }
        }
        /**
         * Command for setting the input text selection.
         */
        export class SetSelectionCommand implements Runnable {
            _NumberPicker_this:NumberPicker;
            constructor(arg:NumberPicker){
                this._NumberPicker_this = arg;
            }

            private mSelectionStart:number = 0;

            private mSelectionEnd:number = 0;

            run():void  {
                //this._NumberPicker_this.mInputText.setSelection(this.mSelectionStart, this.mSelectionEnd);
            }
        }
        /**
         * Command for changing the current value from a long press by one.
         */
        export class ChangeCurrentByOneFromLongPressCommand implements Runnable {
            _NumberPicker_this:NumberPicker;
            constructor(arg:NumberPicker){
                this._NumberPicker_this = arg;
            }

            private mIncrement:boolean;

            setStep(increment:boolean):void  {
                this.mIncrement = increment;
            }

            run():void  {
                this._NumberPicker_this.changeValueByOne(this.mIncrement);
                this._NumberPicker_this.postDelayed(this, this._NumberPicker_this.mLongPressUpdateInterval);
            }
        }
        /**
         * @hide
         */
        //export class CustomEditText extends EditText {
        //
        //    constructor( context:Context, attrs:AttributeSet) {
        //        super(context, attrs);
        //    }
        //
        //    onEditorAction(actionCode:number):void  {
        //        super.onEditorAction(actionCode);
        //        if (actionCode == EditorInfo.IME_ACTION_DONE) {
        //            this.clearFocus();
        //        }
        //    }
        //}
        /**
         * Command for beginning soft input on long press.
         */
        export class BeginSoftInputOnLongPressCommand implements Runnable {
            _NumberPicker_this:NumberPicker;
            constructor(arg:NumberPicker){
                this._NumberPicker_this = arg;
            }

            run():void  {
                this._NumberPicker_this.showSoftInput();
                this._NumberPicker_this.mIngonreMoveEvents = true;
            }
        }
    }

}
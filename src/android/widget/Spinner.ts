/*
 * Copyright (C) 2007 The Android Open Source Project
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

///<reference path="../../android/app/AlertDialog.ts"/>
///<reference path="../../android/content/DialogInterface.ts"/>
///<reference path="../../android/database/DataSetObserver.ts"/>
///<reference path="../../android/graphics/Rect.ts"/>
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/util/Log.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/view/MotionEvent.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/view/ViewTreeObserver.ts"/>
///<reference path="../../android/widget/AbsSpinner.ts"/>
///<reference path="../../android/widget/Adapter.ts"/>
///<reference path="../../android/widget/AdapterView.ts"/>
///<reference path="../../android/widget/ListAdapter.ts"/>
///<reference path="../../android/widget/ListPopupWindow.ts"/>
///<reference path="../../android/widget/ListView.ts"/>
///<reference path="../../android/widget/PopupWindow.ts"/>
///<reference path="../../android/widget/SpinnerAdapter.ts"/>
///<reference path="../../android/content/Context.ts"/>
///<reference path="../../android/R/attr.ts"/>

module android.widget {
import AlertDialog = android.app.AlertDialog;
import DialogInterface = android.content.DialogInterface;
import OnClickListener = android.content.DialogInterface.OnClickListener;
import DataSetObserver = android.database.DataSetObserver;
import Rect = android.graphics.Rect;
import Drawable = android.graphics.drawable.Drawable;
import Log = android.util.Log;
import Gravity = android.view.Gravity;
import MotionEvent = android.view.MotionEvent;
import View = android.view.View;
import ViewGroup = android.view.ViewGroup;
import ViewTreeObserver = android.view.ViewTreeObserver;
import OnGlobalLayoutListener = android.view.ViewTreeObserver.OnGlobalLayoutListener;
import ForwardingListener = android.widget.ListPopupWindow.ForwardingListener;
import OnDismissListener = android.widget.PopupWindow.OnDismissListener;
import AbsSpinner = android.widget.AbsSpinner;
import Adapter = android.widget.Adapter;
import AdapterView = android.widget.AdapterView;
import ListAdapter = android.widget.ListAdapter;
import ListPopupWindow = android.widget.ListPopupWindow;
import ListView = android.widget.ListView;
import PopupWindow = android.widget.PopupWindow;
import SpinnerAdapter = android.widget.SpinnerAdapter;
import Context = android.content.Context;
import R = android.R;
    import AttrBinder = androidui.attr.AttrBinder;
/**
 * A view that displays one child at a time and lets the user pick among them.
 * The items in the Spinner come from the {@link Adapter} associated with
 * this view.
 *
 * <p>See the <a href="{@docRoot}guide/topics/ui/controls/spinner.html">Spinners</a> guide.</p>
 *
 * @attr ref android.R.styleable#Spinner_dropDownHorizontalOffset
 * @attr ref android.R.styleable#Spinner_dropDownSelector
 * @attr ref android.R.styleable#Spinner_dropDownVerticalOffset
 * @attr ref android.R.styleable#Spinner_dropDownWidth
 * @attr ref android.R.styleable#Spinner_gravity
 * @attr ref android.R.styleable#Spinner_popupBackground
 * @attr ref android.R.styleable#Spinner_prompt
 * @attr ref android.R.styleable#Spinner_spinnerMode
 */
export class Spinner extends AbsSpinner implements OnClickListener {

    static TAG:string = "Spinner";

    // Only measure this many items to get a decent max width.
    private static MAX_ITEMS_MEASURED:number = 15;

    /**
     * Use a dialog window for selecting spinner options.
     */
    static MODE_DIALOG:number = 0;

    /**
     * Use a dropdown anchored to the Spinner for selecting spinner options.
     */
    static MODE_DROPDOWN:number = 1;

    /**
     * Use the theme-supplied value to select the dropdown mode.
     */
    private static MODE_THEME:number = -1;

    ///** Forwarding listener used to implement drag-to-open. */
    //private mForwardingListener:ForwardingListener;

    private mPopup:Spinner.SpinnerPopup;

    private mTempAdapter:Spinner.DropDownAdapter;

    mDropDownWidth:number = 0;

    private mGravity:number = 0;

    private mDisableChildrenWhenDisabled:boolean;

    private mTempRect:Rect = new Rect();

    /**
     * Construct a new spinner with the given context's theme, the supplied attribute set,
     * and default style. <code>mode</code> may be one of {@link #MODE_DIALOG} or
     * {@link #MODE_DROPDOWN} and determines how the user will select choices from the spinner.
     *
     * @param context The Context the view is running in, through which it can
     *        access the current theme, resources, etc.
     * @param attrs The attributes of the XML tag that is inflating the view.
     * @param defStyle The default style to apply to this view. If 0, no style
     *        will be applied (beyond what is included in the theme). This may
     *        either be an attribute resource, whose value will be retrieved
     *        from the current theme, or an explicit style resource.
     * @param mode Constant describing how the user will select choices from the spinner.
     * 
     * @see #MODE_DIALOG
     * @see #MODE_DROPDOWN
     */
    constructor(context:Context, bindElement?:HTMLElement, defStyle=R.attr.spinnerStyle, mode=Spinner.MODE_THEME) {
        super(context, bindElement, defStyle);

        const a = context.obtainStyledAttributes(bindElement, defStyle);

        if (mode == Spinner.MODE_THEME) {
            if ('dialog' === a.getAttrValue('spinnerMode')) {
                mode = Spinner.MODE_DIALOG;
            } else {
                mode = Spinner.MODE_DROPDOWN;
            }
        }

        switch (mode) {
            case Spinner.MODE_DIALOG: {
                this.mPopup = new Spinner.DialogPopup(this);
                break;
            }

            case Spinner.MODE_DROPDOWN: {
                const popup = new Spinner.DropdownPopup(context, defStyle, this);

                this.mDropDownWidth = a.getLayoutDimension('dropDownWidth', ViewGroup.LayoutParams.WRAP_CONTENT);
                popup.setBackgroundDrawable(a.getDrawable('popupBackground'));
                const verticalOffset = a.getDimensionPixelOffset('dropDownVerticalOffset', 0);
                if (verticalOffset != 0) {
                    popup.setVerticalOffset(verticalOffset);
                }

                const horizontalOffset = a.getDimensionPixelOffset('dropDownHorizontalOffset', 0);
                if (horizontalOffset != 0) {
                    popup.setHorizontalOffset(horizontalOffset);
                }

                this.mPopup = popup;
                // mForwardingListener = new ForwardingListener(this) {
                // @Override
                // public ListPopupWindow getPopup() {
                //         return popup;
                //     }
                //
                // @Override
                // public boolean onForwardingStarted() {
                //         if (!mPopup.isShowing()) {
                //             mPopup.show(getTextDirection(), getTextAlignment());
                //         }
                //         return true;
                //     }
                // };
                break;
            }
        }

        this.mGravity = Gravity.parseGravity(a.getAttrValue('gravity'), Gravity.CENTER);

        this.mPopup.setPromptText(a.getString('prompt'));

        this.mDisableChildrenWhenDisabled = a.getBoolean('disableChildrenWhenDisabled', false);

        a.recycle();

        // Finish setting things up if this happened.
        if (this.mTempAdapter != null) {
            this.mPopup.setAdapter(this.mTempAdapter);
            this.mTempAdapter = null;
        }
    }

    protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
        return super.createClassAttrBinder().set('dropDownWidth', {
            setter(v:Spinner, value:any, a:AttrBinder) {
                v.mDropDownWidth = a.parseNumberPixelSize(value, v.mDropDownWidth);
            }, getter(v:Spinner) {
                return v.mDropDownWidth;
            }
        }).set('popupBackground', {
            setter(v:Spinner, value:any, a:AttrBinder) {
                v.mPopup.setBackgroundDrawable(a.parseDrawable(value));
            }, getter(v:Spinner) {
                return v.mPopup.getBackground();
            }
        }).set('dropDownVerticalOffset', {
            setter(v:Spinner, value:any, a:AttrBinder) {
                const verticalOffset:number = a.parseNumberPixelSize(value, 0);
                if (verticalOffset != 0) {
                    v.mPopup.setVerticalOffset(verticalOffset);
                }
            }, getter(v:Spinner) {
                return v.mPopup.getVerticalOffset();
            }
        }).set('dropDownHorizontalOffset', {
            setter(v:Spinner, value:any, a:AttrBinder) {
                const horizontalOffset:number = a.parseNumberPixelSize(value, 0);
                if (horizontalOffset != 0) {
                    v.mPopup.setHorizontalOffset(horizontalOffset);
                }
            }, getter(v:Spinner) {
                return v.mPopup.getHorizontalOffset();
            }
        }).set('gravity', {
            setter(v:Spinner, value:any, a:AttrBinder) {
                v.mGravity = a.parseGravity(value, Gravity.CENTER);
            }, getter(v:Spinner) {
                return v.mGravity;
            }
        }).set('prompt', {
            setter(v:Spinner, value:any, a:AttrBinder) {
                v.mPopup.setPromptText(a.parseString(value));
            }, getter(v:Spinner) {
                return v.mPopup.getHintText();
            }
        }).set('disableChildrenWhenDisabled', {
            setter(v:Spinner, value:any, a:AttrBinder) {
                v.mDisableChildrenWhenDisabled = a.parseBoolean(value, false);
            }, getter(v:Spinner) {
                return v.mDisableChildrenWhenDisabled;
            }
        });
    }

    /**
     * Set the background drawable for the spinner's popup window of choices.
     * Only valid in {@link #MODE_DROPDOWN}; this method is a no-op in other modes.
     *
     * @param background Background drawable
     *
     * @attr ref android.R.styleable#Spinner_popupBackground
     */
    setPopupBackgroundDrawable(background:Drawable):void  {
        if (!(this.mPopup instanceof Spinner.DropdownPopup)) {
            Log.e(Spinner.TAG, "setPopupBackgroundDrawable: incompatible spinner mode; ignoring...");
            return;
        }
        (<Spinner.DropdownPopup> this.mPopup).setBackgroundDrawable(background);
    }

    ///**
    // * Set the background drawable for the spinner's popup window of choices.
    // * Only valid in {@link #MODE_DROPDOWN}; this method is a no-op in other modes.
    // *
    // * @param resId Resource ID of a background drawable
    // *
    // * @attr ref android.R.styleable#Spinner_popupBackground
    // */
    //setPopupBackgroundResource(resId:number):void  {
    //    this.setPopupBackgroundDrawable(this.getContext().getResources().getDrawable(resId));
    //}

    /**
     * Get the background drawable for the spinner's popup window of choices.
     * Only valid in {@link #MODE_DROPDOWN}; other modes will return null.
     *
     * @return background Background drawable
     *
     * @attr ref android.R.styleable#Spinner_popupBackground
     */
    getPopupBackground():Drawable  {
        return this.mPopup.getBackground();
    }

    /**
     * Set a vertical offset in pixels for the spinner's popup window of choices.
     * Only valid in {@link #MODE_DROPDOWN}; this method is a no-op in other modes.
     *
     * @param pixels Vertical offset in pixels
     *
     * @attr ref android.R.styleable#Spinner_dropDownVerticalOffset
     */
    setDropDownVerticalOffset(pixels:number):void  {
        this.mPopup.setVerticalOffset(pixels);
    }

    /**
     * Get the configured vertical offset in pixels for the spinner's popup window of choices.
     * Only valid in {@link #MODE_DROPDOWN}; other modes will return 0.
     *
     * @return Vertical offset in pixels
     *
     * @attr ref android.R.styleable#Spinner_dropDownVerticalOffset
     */
    getDropDownVerticalOffset():number  {
        return this.mPopup.getVerticalOffset();
    }

    /**
     * Set a horizontal offset in pixels for the spinner's popup window of choices.
     * Only valid in {@link #MODE_DROPDOWN}; this method is a no-op in other modes.
     *
     * @param pixels Horizontal offset in pixels
     *
     * @attr ref android.R.styleable#Spinner_dropDownHorizontalOffset
     */
    setDropDownHorizontalOffset(pixels:number):void  {
        this.mPopup.setHorizontalOffset(pixels);
    }

    /**
     * Get the configured horizontal offset in pixels for the spinner's popup window of choices.
     * Only valid in {@link #MODE_DROPDOWN}; other modes will return 0.
     *
     * @return Horizontal offset in pixels
     *
     * @attr ref android.R.styleable#Spinner_dropDownHorizontalOffset
     */
    getDropDownHorizontalOffset():number  {
        return this.mPopup.getHorizontalOffset();
    }

    /**
     * Set the width of the spinner's popup window of choices in pixels. This value
     * may also be set to {@link android.view.ViewGroup.LayoutParams#MATCH_PARENT}
     * to match the width of the Spinner itself, or
     * {@link android.view.ViewGroup.LayoutParams#WRAP_CONTENT} to wrap to the measured size
     * of contained dropdown list items.
     *
     * <p>Only valid in {@link #MODE_DROPDOWN}; this method is a no-op in other modes.</p>
     *
     * @param pixels Width in pixels, WRAP_CONTENT, or MATCH_PARENT
     *
     * @attr ref android.R.styleable#Spinner_dropDownWidth
     */
    setDropDownWidth(pixels:number):void  {
        if (!(this.mPopup instanceof Spinner.DropdownPopup)) {
            Log.e(Spinner.TAG, "Cannot set dropdown width for MODE_DIALOG, ignoring");
            return;
        }
        this.mDropDownWidth = pixels;
    }

    /**
     * Get the configured width of the spinner's popup window of choices in pixels.
     * The returned value may also be {@link android.view.ViewGroup.LayoutParams#MATCH_PARENT}
     * meaning the popup window will match the width of the Spinner itself, or
     * {@link android.view.ViewGroup.LayoutParams#WRAP_CONTENT} to wrap to the measured size
     * of contained dropdown list items.
     *
     * @return Width in pixels, WRAP_CONTENT, or MATCH_PARENT
     *
     * @attr ref android.R.styleable#Spinner_dropDownWidth
     */
    getDropDownWidth():number  {
        return this.mDropDownWidth;
    }

    setEnabled(enabled:boolean):void  {
        super.setEnabled(enabled);
        if (this.mDisableChildrenWhenDisabled) {
            const count:number = this.getChildCount();
            for (let i:number = 0; i < count; i++) {
                this.getChildAt(i).setEnabled(enabled);
            }
        }
    }

    /**
     * Describes how the selected item view is positioned. Currently only the horizontal component
     * is used. The default is determined by the current theme.
     *
     * @param gravity See {@link android.view.Gravity}
     *
     * @attr ref android.R.styleable#Spinner_gravity
     */
    setGravity(gravity:number):void  {
        if (this.mGravity != gravity) {
            if ((gravity & Gravity.HORIZONTAL_GRAVITY_MASK) == 0) {
                gravity |= Gravity.START;
            }
            this.mGravity = gravity;
            this.requestLayout();
        }
    }

    /**
     * Describes how the selected item view is positioned. The default is determined by the
     * current theme.
     *
     * @return A {@link android.view.Gravity Gravity} value
     */
    getGravity():number  {
        return this.mGravity;
    }

    /**
     * Sets the Adapter used to provide the data which backs this Spinner.
     * <p>
     * Note that Spinner overrides {@link Adapter#getViewTypeCount()} on the
     * Adapter associated with this view. Calling
     * {@link Adapter#getItemViewType(int) getItemViewType(int)} on the object
     * returned from {@link #getAdapter()} will always return 0. Calling
     * {@link Adapter#getViewTypeCount() getViewTypeCount()} will always return
     * 1.
     *
     * @see AbsSpinner#setAdapter(SpinnerAdapter)
     */
    setAdapter(adapter:SpinnerAdapter):void  {
        super.setAdapter(adapter);
        this.mRecycler.clear();
        if (this.mPopup != null) {
            this.mPopup.setAdapter(new Spinner.DropDownAdapter(adapter));
        } else {
            this.mTempAdapter = new Spinner.DropDownAdapter(adapter);
        }
    }

    getBaseline():number  {
        let child:View = null;
        if (this.getChildCount() > 0) {
            child = this.getChildAt(0);
        } else if (this.mAdapter != null && this.mAdapter.getCount() > 0) {
            child = this.makeView(0, false);
            this.mRecycler.put(0, child);
        }
        if (child != null) {
            const childBaseline:number = child.getBaseline();
            return childBaseline >= 0 ? child.getTop() + childBaseline : -1;
        } else {
            return -1;
        }
    }

    protected onDetachedFromWindow():void  {
        super.onDetachedFromWindow();
        if (this.mPopup != null && this.mPopup.isShowing()) {
            this.mPopup.dismiss();
        }
    }

    /**
     * <p>A spinner does not support item click events. Calling this method
     * will raise an exception.</p>
     * <p>Instead use {@link AdapterView#setOnItemSelectedListener}.
     *
     * @param l this listener will be ignored
     */
    setOnItemClickListener(l:AdapterView.OnItemClickListener):void  {
        throw Error(`new RuntimeException("setOnItemClickListener cannot be used with a spinner.")`);
    }

    /**
     * @hide internal use only
     */
    setOnItemClickListenerInt(l:AdapterView.OnItemClickListener):void  {
        super.setOnItemClickListener(l);
    }

    //onTouchEvent(event:MotionEvent):boolean  {
    //    if (this.mForwardingListener != null && this.mForwardingListener.onTouch(this, event)) {
    //        return true;
    //    }
    //    return super.onTouchEvent(event);
    //}

    protected onMeasure(widthMeasureSpec:number, heightMeasureSpec:number):void  {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        if (this.mPopup != null && View.MeasureSpec.getMode(widthMeasureSpec) == View.MeasureSpec.AT_MOST) {
            const measuredWidth:number = this.getMeasuredWidth();
            this.setMeasuredDimension(Math.min(Math.max(measuredWidth, this.measureContentWidth(this.getAdapter(), this.getBackground())), View.MeasureSpec.getSize(widthMeasureSpec)), this.getMeasuredHeight());
        }
    }

    /**
     * @see android.view.View#onLayout(boolean,int,int,int,int)
     *
     * Creates and positions all views
     *
     */
    protected onLayout(changed:boolean, l:number, t:number, r:number, b:number):void  {
        super.onLayout(changed, l, t, r, b);
        this.mInLayout = true;
        this.layoutSpinner(0, false);
        this.mInLayout = false;
    }

    /**
     * Creates and positions all views for this Spinner.
     *
     * @param delta Change in the selected position. +1 means selection is moving to the right,
     * so views are scrolling to the left. -1 means selection is moving to the left.
     */
    layoutSpinner(delta:number, animate:boolean):void  {
        let childrenLeft:number = this.mSpinnerPadding.left;
        let childrenWidth:number = this.mRight - this.mLeft - this.mSpinnerPadding.left - this.mSpinnerPadding.right;
        if (this.mDataChanged) {
            this.handleDataChanged();
        }
        // Handle the empty set by removing all views
        if (this.mItemCount == 0) {
            this.resetList();
            return;
        }
        if (this.mNextSelectedPosition >= 0) {
            this.setSelectedPositionInt(this.mNextSelectedPosition);
        }
        this.recycleAllViews();
        // Clear out old views
        this.removeAllViewsInLayout();
        // Make selected view and position it
        this.mFirstPosition = this.mSelectedPosition;
        if (this.mAdapter != null) {
            let sel:View = this.makeView(this.mSelectedPosition, true);
            let width:number = sel.getMeasuredWidth();
            let selectedOffset:number = childrenLeft;
            const layoutDirection:number = this.getLayoutDirection();
            const absoluteGravity:number = Gravity.getAbsoluteGravity(this.mGravity, layoutDirection);
            switch(absoluteGravity & Gravity.HORIZONTAL_GRAVITY_MASK) {
                case Gravity.CENTER_HORIZONTAL:
                    selectedOffset = childrenLeft + (childrenWidth / 2) - (width / 2);
                    break;
                case Gravity.RIGHT:
                    selectedOffset = childrenLeft + childrenWidth - width;
                    break;
            }
            sel.offsetLeftAndRight(selectedOffset);
        }
        // Flush any cached views that did not get reused above
        this.mRecycler.clear();
        this.invalidate();
        this.checkSelectionChanged();
        this.mDataChanged = false;
        this.mNeedSync = false;
        this.setNextSelectedPositionInt(this.mSelectedPosition);
    }

    /**
     * Obtain a view, either by pulling an existing view from the recycler or
     * by getting a new one from the adapter. If we are animating, make sure
     * there is enough information in the view's layout parameters to animate
     * from the old to new positions.
     *
     * @param position Position in the spinner for the view to obtain
     * @param addChild true to add the child to the spinner, false to obtain and configure only.
     * @return A view for the given position
     */
    private makeView(position:number, addChild:boolean):View  {
        let child:View;
        if (!this.mDataChanged) {
            child = this.mRecycler.get(position);
            if (child != null) {
                // Position the view
                this.setUpChild(child, addChild);
                return child;
            }
        }
        // Nothing found in the recycler -- ask the adapter for a view
        child = this.mAdapter.getView(position, null, this);
        // Position the view
        this.setUpChild(child, addChild);
        return child;
    }

    /**
     * Helper for makeAndAddView to set the position of a view
     * and fill out its layout paramters.
     *
     * @param child The view to position
     * @param addChild true if the child should be added to the Spinner during setup
     */
    private setUpChild(child:View, addChild:boolean):void  {
        // Respect layout params that are already in the view. Otherwise
        // make some up...
        let lp:ViewGroup.LayoutParams = child.getLayoutParams();
        if (lp == null) {
            lp = this.generateDefaultLayoutParams();
        }
        if (addChild) {
            this.addViewInLayout(child, 0, lp);
        }
        child.setSelected(this.hasFocus());
        if (this.mDisableChildrenWhenDisabled) {
            child.setEnabled(this.isEnabled());
        }
        // Get measure specs
        let childHeightSpec:number = ViewGroup.getChildMeasureSpec(this.mHeightMeasureSpec, this.mSpinnerPadding.top + this.mSpinnerPadding.bottom, lp.height);
        let childWidthSpec:number = ViewGroup.getChildMeasureSpec(this.mWidthMeasureSpec, this.mSpinnerPadding.left + this.mSpinnerPadding.right, lp.width);
        // Measure child
        child.measure(childWidthSpec, childHeightSpec);
        let childLeft:number;
        let childRight:number;
        // Position vertically based on gravity setting
        let childTop:number = this.mSpinnerPadding.top + ((this.getMeasuredHeight() - this.mSpinnerPadding.bottom - this.mSpinnerPadding.top - child.getMeasuredHeight()) / 2);
        let childBottom:number = childTop + child.getMeasuredHeight();
        let width:number = child.getMeasuredWidth();
        childLeft = 0;
        childRight = childLeft + width;
        child.layout(childLeft, childTop, childRight, childBottom);
    }

    performClick():boolean  {
        let handled:boolean = super.performClick();
        if (!handled) {
            handled = true;
            if (!this.mPopup.isShowing()) {
                this.mPopup.showPopup(this.getTextDirection(), this.getTextAlignment());
            }
        }
        return handled;
    }

    onClick(dialog:DialogInterface, which:number):void  {
        this.setSelection(which);
        dialog.dismiss();
    }

    //onInitializeAccessibilityEvent(event:AccessibilityEvent):void  {
    //    super.onInitializeAccessibilityEvent(event);
    //    event.setClassName(Spinner.class.getName());
    //}
    //
    //onInitializeAccessibilityNodeInfo(info:AccessibilityNodeInfo):void  {
    //    super.onInitializeAccessibilityNodeInfo(info);
    //    info.setClassName(Spinner.class.getName());
    //    if (this.mAdapter != null) {
    //        info.setCanOpenPopup(true);
    //    }
    //}

    /**
     * Sets the prompt to display when the dialog is shown.
     * @param prompt the prompt to set
     */
    setPrompt(prompt:string):void  {
        this.mPopup.setPromptText(prompt);
    }

    ///**
    // * Sets the prompt to display when the dialog is shown.
    // * @param promptId the resource ID of the prompt to display when the dialog is shown
    // */
    //setPromptId(promptId:number):void  {
    //    this.setPrompt(this.getContext().getText(promptId));
    //}

    /**
     * @return The prompt to display when the dialog is shown
     */
    getPrompt():string  {
        return this.mPopup.getHintText();
    }

    measureContentWidth(adapter:SpinnerAdapter, background:Drawable):number  {
        if (adapter == null) {
            return 0;
        }
        let width:number = 0;
        let itemView:View = null;
        let itemType:number = 0;
        const widthMeasureSpec:number = View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED);
        const heightMeasureSpec:number = View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED);
        // Make sure the number of items we'll measure is capped. If it's a huge data set
        // with wildly varying sizes, oh well.
        let start:number = Math.max(0, this.getSelectedItemPosition());
        const end:number = Math.min(adapter.getCount(), start + Spinner.MAX_ITEMS_MEASURED);
        const count:number = end - start;
        start = Math.max(0, start - (Spinner.MAX_ITEMS_MEASURED - count));
        for (let i:number = start; i < end; i++) {
            const positionType:number = adapter.getItemViewType(i);
            if (positionType != itemType) {
                itemType = positionType;
                itemView = null;
            }
            itemView = adapter.getView(i, itemView, this);
            if (itemView.getLayoutParams() == null) {
                itemView.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
            }
            itemView.measure(widthMeasureSpec, heightMeasureSpec);
            width = Math.max(width, itemView.getMeasuredWidth());
        }
        // Add background padding to measured width
        if (background != null) {
            background.getPadding(this.mTempRect);
            width += this.mTempRect.left + this.mTempRect.right;
        }
        return width;
    }

    //onSaveInstanceState():Parcelable  {
    //    const ss:Spinner.SavedState = new Spinner.SavedState(super.onSaveInstanceState());
    //    ss.showDropdown = this.mPopup != null && this.mPopup.isShowing();
    //    return ss;
    //}
    //
    //onRestoreInstanceState(state:Parcelable):void  {
    //    let ss:Spinner.SavedState = <Spinner.SavedState> state;
    //    super.onRestoreInstanceState(ss.getSuperState());
    //    if (ss.showDropdown) {
    //        let vto:ViewTreeObserver = this.getViewTreeObserver();
    //        if (vto != null) {
    //            const listener:OnGlobalLayoutListener = (()=>{
    //                const _this=this;
    //                class _Inner extends OnGlobalLayoutListener {
    //
    //                    onGlobalLayout():void  {
    //                        if (!_this.mPopup.isShowing()) {
    //                            _this.mPopup.showPopup(_this.getTextDirection(), _this.getTextAlignment());
    //                        }
    //                        const vto:ViewTreeObserver = _this.getViewTreeObserver();
    //                        if (vto != null) {
    //                            vto.removeOnGlobalLayoutListener(this);
    //                        }
    //                    }
    //                }
    //                return new _Inner();
    //            })();
    //            vto.addOnGlobalLayoutListener(listener);
    //        }
    //    }
    //}

}

export module Spinner{
//export class SavedState extends AbsSpinner.SavedState {
//
//    showDropdown:boolean;
//
//    constructor( superState:Parcelable) {
//        super(superState);
//    }
//
//    constructor( _in:Parcel) {
//        super(_in);
//        this.showDropdown = _in.readByte() != 0;
//    }
//
//    writeToParcel(out:Parcel, flags:number):void  {
//        super.writeToParcel(out, flags);
//        out.writeByte(<byte> (this.showDropdown ? 1 : 0));
//    }
//
//    static CREATOR:Parcelable.Creator<AbsSpinner.SavedState> = (()=>{
//        const _this=this;
//        class _Inner extends Parcelable.Creator<AbsSpinner.SavedState> {
//
//            createFromParcel(_in:Parcel):AbsSpinner.SavedState  {
//                return new AbsSpinner.SavedState(_in);
//            }
//
//            newArray(size:number):AbsSpinner.SavedState[]  {
//                return new Array<AbsSpinner.SavedState>(size);
//            }
//        }
//        return new _Inner();
//    })();
//}
/**
     * <p>Wrapper class for an Adapter. Transforms the embedded Adapter instance
     * into a ListAdapter.</p>
     */
export class DropDownAdapter implements ListAdapter, SpinnerAdapter {

    private mAdapter:SpinnerAdapter;

    private mListAdapter:ListAdapter;

    /**
         * <p>Creates a new ListAdapter wrapper for the specified adapter.</p>
         *
         * @param adapter the Adapter to transform into a ListAdapter
         */
    constructor(adapter:SpinnerAdapter) {
        this.mAdapter = adapter;
        if (ListAdapter.isImpl(adapter)) {
            this.mListAdapter = <ListAdapter><any>adapter;
        }
    }

    getCount():number  {
        return this.mAdapter == null ? 0 : this.mAdapter.getCount();
    }

    getItem(position:number):any  {
        return this.mAdapter == null ? null : this.mAdapter.getItem(position);
    }

    getItemId(position:number):number  {
        return this.mAdapter == null ? -1 : this.mAdapter.getItemId(position);
    }

    getView(position:number, convertView:View, parent:ViewGroup):View  {
        return this.getDropDownView(position, convertView, parent);
    }

    getDropDownView(position:number, convertView:View, parent:ViewGroup):View  {
        return (this.mAdapter == null) ? null : this.mAdapter.getDropDownView(position, convertView, parent);
    }

    hasStableIds():boolean  {
        return this.mAdapter != null && this.mAdapter.hasStableIds();
    }

    registerDataSetObserver(observer:DataSetObserver):void  {
        if (this.mAdapter != null) {
            this.mAdapter.registerDataSetObserver(observer);
        }
    }

    unregisterDataSetObserver(observer:DataSetObserver):void  {
        if (this.mAdapter != null) {
            this.mAdapter.unregisterDataSetObserver(observer);
        }
    }

    /**
         * If the wrapped SpinnerAdapter is also a ListAdapter, delegate this call.
         * Otherwise, return true. 
         */
    areAllItemsEnabled():boolean  {
        const adapter:ListAdapter = this.mListAdapter;
        if (adapter != null) {
            return adapter.areAllItemsEnabled();
        } else {
            return true;
        }
    }

    /**
         * If the wrapped SpinnerAdapter is also a ListAdapter, delegate this call.
         * Otherwise, return true.
         */
    isEnabled(position:number):boolean  {
        const adapter:ListAdapter = this.mListAdapter;
        if (adapter != null) {
            return adapter.isEnabled(position);
        } else {
            return true;
        }
    }

    getItemViewType(position:number):number  {
        return 0;
    }

    getViewTypeCount():number  {
        return 1;
    }

    isEmpty():boolean  {
        return this.getCount() == 0;
    }
}
/**
     * Implements some sort of popup selection interface for selecting a spinner option.
     * Allows for different spinner modes.
     */
export interface SpinnerPopup {

    setAdapter(adapter:ListAdapter):void ;

    /**
         * Show the popup
         */
    showPopup(textDirection:number, textAlignment:number):void ;

    /**
         * Dismiss the popup
         */
    dismiss():void ;

    /**
         * @return true if the popup is showing, false otherwise.
         */
    isShowing():boolean ;

    /**
         * Set hint text to be displayed to the user. This should provide
         * a description of the choice being made.
         * @param hintText Hint text to set.
         */
    setPromptText(hintText:string):void ;

    getHintText():string ;

    setBackgroundDrawable(bg:Drawable):void ;

    setVerticalOffset(px:number):void ;

    setHorizontalOffset(px:number):void ;

    getBackground():Drawable ;

    getVerticalOffset():number ;

    getHorizontalOffset():number ;
}
export class DialogPopup implements Spinner.SpinnerPopup, DialogInterface.OnClickListener {
    _Spinner_this:Spinner;
    constructor(arg:Spinner){
        this._Spinner_this = arg;
    }

    private mPopup:AlertDialog;

    private mListAdapter:ListAdapter;

    private mPrompt:string;

    dismiss():void  {
        this.mPopup.dismiss();
        this.mPopup = null;
    }

    isShowing():boolean  {
        return this.mPopup != null ? this.mPopup.isShowing() : false;
    }

    setAdapter(adapter:ListAdapter):void  {
        this.mListAdapter = adapter;
    }

    setPromptText(hintText:string):void  {
        this.mPrompt = hintText;
    }

    getHintText():string  {
        return this.mPrompt;
    }

    showPopup(textDirection:number, textAlignment:number):void  {
        if (this.mListAdapter == null) {
            return;
        }
        let builder:AlertDialog.Builder = new AlertDialog.Builder(this._Spinner_this.getContext());
        if (this.mPrompt != null) {
            builder.setTitle(this.mPrompt);
        }
        this.mPopup = builder.setSingleChoiceItemsWithAdapter(this.mListAdapter, this._Spinner_this.getSelectedItemPosition(), this).create();
        const listView:ListView = this.mPopup.getListView();
        listView.setTextDirection(textDirection);
        listView.setTextAlignment(textAlignment);
        this.mPopup.show();
    }

    onClick(dialog:DialogInterface, which:number):void  {
        this._Spinner_this.setSelection(which);
        if (this._Spinner_this.mOnItemClickListener != null) {
            this._Spinner_this.performItemClick(null, which, this.mListAdapter.getItemId(which));
        }
        this.dismiss();
    }

    setBackgroundDrawable(bg:Drawable):void  {
        Log.e(Spinner.TAG, "Cannot set popup background for MODE_DIALOG, ignoring");
    }

    setVerticalOffset(px:number):void  {
        Log.e(Spinner.TAG, "Cannot set vertical offset for MODE_DIALOG, ignoring");
    }

    setHorizontalOffset(px:number):void  {
        Log.e(Spinner.TAG, "Cannot set horizontal offset for MODE_DIALOG, ignoring");
    }

    getBackground():Drawable  {
        return null;
    }

    getVerticalOffset():number  {
        return 0;
    }

    getHorizontalOffset():number  {
        return 0;
    }
}
export class DropdownPopup extends ListPopupWindow implements Spinner.SpinnerPopup {
    _Spinner_this:Spinner;

    private mHintText:string;

    //private mAdapter:ListAdapter;

    constructor(context:Context, defStyleRes:Map<string, string>, arg:Spinner) {
        super(context, defStyleRes);
        this._Spinner_this = arg;

        this.setAnchorView(this._Spinner_this);
        this.setModal(true);
        this.setPromptPosition(DropdownPopup.POSITION_PROMPT_ABOVE);
        this.setOnItemClickListener((()=>{
            const _this=this;
            class _Inner implements AdapterView.OnItemClickListener {

                onItemClick(parent:AdapterView<any>, v:View, position:number, id:number):void  {
                    _this._Spinner_this.setSelection(position);
                    if (_this._Spinner_this.mOnItemClickListener != null) {
                        _this._Spinner_this.performItemClick(v, position, _this.mAdapter.getItemId(position));
                    }
                    _this.dismiss();
                }
            }
            return new _Inner();
        })());
    }

    setAdapter(adapter:ListAdapter):void  {
        super.setAdapter(adapter);
        //this.mAdapter = adapter;
    }

    getHintText():string  {
        return this.mHintText;
    }

    setPromptText(hintText:string):void  {
        // Hint text is ignored for dropdowns, but maintain it here.
        this.mHintText = hintText;
    }

    computeContentWidth():void  {
        const background:Drawable = this.getBackground();
        let hOffset:number = 0;
        if (background != null) {
            background.getPadding(this._Spinner_this.mTempRect);
            hOffset = this._Spinner_this.isLayoutRtl() ? this._Spinner_this.mTempRect.right : -this._Spinner_this.mTempRect.left;
        } else {
            this._Spinner_this.mTempRect.left = this._Spinner_this.mTempRect.right = 0;
        }
        const spinnerPaddingLeft:number = this._Spinner_this.getPaddingLeft();
        const spinnerPaddingRight:number = this._Spinner_this.getPaddingRight();
        const spinnerWidth:number = this._Spinner_this.getWidth();
        if (this._Spinner_this.mDropDownWidth == DropdownPopup.WRAP_CONTENT) {
            let contentWidth:number = this._Spinner_this.measureContentWidth(<SpinnerAdapter><any>this.mAdapter, this.getBackground());
            const contentWidthLimit:number = this._Spinner_this.mContext.getResources().getDisplayMetrics().widthPixels - this._Spinner_this.mTempRect.left - this._Spinner_this.mTempRect.right;
            if (contentWidth > contentWidthLimit) {
                contentWidth = contentWidthLimit;
            }
            this.setContentWidth(Math.max(contentWidth, spinnerWidth - spinnerPaddingLeft - spinnerPaddingRight));
        } else if (this._Spinner_this.mDropDownWidth == DropdownPopup.MATCH_PARENT) {
            this.setContentWidth(spinnerWidth - spinnerPaddingLeft - spinnerPaddingRight);
        } else {
            this.setContentWidth(this._Spinner_this.mDropDownWidth);
        }
        if (this._Spinner_this.isLayoutRtl()) {
            hOffset += spinnerWidth - spinnerPaddingRight - this.getWidth();
        } else {
            hOffset += spinnerPaddingLeft;
        }
        this.setHorizontalOffset(hOffset);
    }

    showPopup(textDirection:number, textAlignment:number):void  {
        const wasShowing:boolean = this.isShowing();
        this.computeContentWidth();
        this.setInputMethodMode(ListPopupWindow.INPUT_METHOD_NOT_NEEDED);
        super.show();
        const listView:ListView = this.getListView();
        listView.setChoiceMode(ListView.CHOICE_MODE_SINGLE);
        listView.setTextDirection(textDirection);
        listView.setTextAlignment(textAlignment);
        this.setSelection(this._Spinner_this.getSelectedItemPosition());
        if (wasShowing) {
            // showing it will still stick around.
            return;
        }
        // Make sure we hide if our anchor goes away.
        // TODO: This might be appropriate to push all the way down to PopupWindow,
        // but it may have other side effects to investigate first. (Text editing handles, etc.)
        const vto:ViewTreeObserver = this._Spinner_this.getViewTreeObserver();
        if (vto != null) {
            const layoutListener:android.view.ViewTreeObserver.OnGlobalLayoutListener = (()=>{
                const _this=this;
                class _Inner implements android.view.ViewTreeObserver.OnGlobalLayoutListener {

                    onGlobalLayout():void  {
                        if (!_this._Spinner_this.isVisibleToUser()) {
                            _this.dismiss();
                        } else {
                            _this.computeContentWidth();
                            // Use super.show here to update; we don't want to move the selected
                            // position or adjust other things that would be reset otherwise.
                            _this.show();
                        }
                    }
                }
                return new _Inner();
            })();
            vto.addOnGlobalLayoutListener(layoutListener);
            this.setOnDismissListener((()=>{
                const _this=this;
                class _Inner implements PopupWindow.OnDismissListener {
                    onDismiss():void  {
                        const vto:ViewTreeObserver = _this._Spinner_this.getViewTreeObserver();
                        if (vto != null) {
                            vto.removeOnGlobalLayoutListener(layoutListener);
                        }
                    }
                }
                return new _Inner();
            })());
        }
    }
}
}

}
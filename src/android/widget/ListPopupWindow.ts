/*
 * Copyright (C) 2010 The Android Open Source Project
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

///<reference path="../../android/database/DataSetObserver.ts"/>
///<reference path="../../android/graphics/Rect.ts"/>
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/os/Handler.ts"/>
///<reference path="../../android/text/TextUtils.ts"/>
///<reference path="../../android/util/Log.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/view/KeyEvent.ts"/>
///<reference path="../../android/view/MotionEvent.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewConfiguration.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/view/ViewParent.ts"/>
///<reference path="../../android/view/animation/AccelerateDecelerateInterpolator.ts"/>
///<reference path="../../java/lang/Integer.ts"/>
///<reference path="../../java/lang/Runnable.ts"/>
///<reference path="../../android/widget/AbsListView.ts"/>
///<reference path="../../android/widget/Adapter.ts"/>
///<reference path="../../android/widget/AdapterView.ts"/>
///<reference path="../../android/widget/LinearLayout.ts"/>
///<reference path="../../android/widget/ListAdapter.ts"/>
///<reference path="../../android/widget/ListView.ts"/>
///<reference path="../../android/widget/PopupWindow.ts"/>
///<reference path="../../android/widget/Scroller.ts"/>
///<reference path="../../android/widget/Spinner.ts"/>
///<reference path="../../android/widget/TextView.ts"/>
///<reference path="../../android/content/Context.ts"/>
///<reference path="../../android/view/animation/Animation.ts"/>
///<reference path="../../java/lang/Runnable.ts"/>
///<reference path="../../android/R/attr.ts"/>

module android.widget {
//import Animator = android.animation.Animator;
//import AnimatorListenerAdapter = android.animation.AnimatorListenerAdapter;
//import ObjectAnimator = android.animation.ObjectAnimator;
import DataSetObserver = android.database.DataSetObserver;
import Rect = android.graphics.Rect;
import Drawable = android.graphics.drawable.Drawable;
import Handler = android.os.Handler;
import TextUtils = android.text.TextUtils;
//import IntProperty = android.util.IntProperty;
import Log = android.util.Log;
import Gravity = android.view.Gravity;
import KeyEvent = android.view.KeyEvent;
import MotionEvent = android.view.MotionEvent;
import View = android.view.View;
import MeasureSpec = android.view.View.MeasureSpec;
import OnAttachStateChangeListener = android.view.View.OnAttachStateChangeListener;
import OnTouchListener = android.view.View.OnTouchListener;
import ViewConfiguration = android.view.ViewConfiguration;
import ViewGroup = android.view.ViewGroup;
import ViewParent = android.view.ViewParent;
import AccelerateDecelerateInterpolator = android.view.animation.AccelerateDecelerateInterpolator;
import Integer = java.lang.Integer;
import Runnable = java.lang.Runnable;
import AbsListView = android.widget.AbsListView;
import Adapter = android.widget.Adapter;
import AdapterView = android.widget.AdapterView;
import LinearLayout = android.widget.LinearLayout;
import ListAdapter = android.widget.ListAdapter;
import ListView = android.widget.ListView;
import PopupWindow = android.widget.PopupWindow;
import Scroller = android.widget.Scroller;
import Spinner = android.widget.Spinner;
import TextView = android.widget.TextView;
import Context = android.content.Context;
import Animation = android.view.animation.Animation;
/**
 * A ListPopupWindow anchors itself to a host view and displays a
 * list of choices.
 * 
 * <p>ListPopupWindow contains a number of tricky behaviors surrounding
 * positioning, scrolling parents to fit the dropdown, interacting
 * sanely with the IME if present, and others.
 * 
 * @see android.widget.AutoCompleteTextView
 * @see android.widget.Spinner
 */
export class ListPopupWindow {

    private static TAG:string = "ListPopupWindow";

    private static DEBUG:boolean = false;

    /**
     * This value controls the length of time that the user
     * must leave a pointer down without scrolling to expand
     * the autocomplete dropdown list to cover the IME.
     */
    private static EXPAND_LIST_TIMEOUT:number = 250;

    private mContext:Context;

    private mPopup:PopupWindow;

    private mAdapter:ListAdapter;

    private mDropDownList:ListPopupWindow.DropDownListView;

    private mDropDownHeight:number = ViewGroup.LayoutParams.WRAP_CONTENT;

    private mDropDownWidth:number = ViewGroup.LayoutParams.WRAP_CONTENT;

    private mDropDownHorizontalOffset:number = 0;

    private mDropDownVerticalOffset:number = 0;

    private mDropDownVerticalOffsetSet:boolean;

    private mDropDownGravity:number = Gravity.NO_GRAVITY;

    private mDropDownAlwaysVisible:boolean = false;

    private mForceIgnoreOutsideTouch:boolean = false;

    mListItemExpandMaximum:number = Integer.MAX_VALUE;

    private mPromptView:View;

    private mPromptPosition:number = ListPopupWindow.POSITION_PROMPT_ABOVE;

    private mObserver:DataSetObserver;

    private mDropDownAnchorView:View;

    private mDropDownListHighlight:Drawable;

    private mItemClickListener:AdapterView.OnItemClickListener;

    private mItemSelectedListener:AdapterView.OnItemSelectedListener;

    private mResizePopupRunnable:ListPopupWindow.ResizePopupRunnable = new ListPopupWindow.ResizePopupRunnable(this);

    private mTouchInterceptor:ListPopupWindow.PopupTouchInterceptor = new ListPopupWindow.PopupTouchInterceptor(this);

    private mScrollListener:ListPopupWindow.PopupScrollListener = new ListPopupWindow.PopupScrollListener(this);

    private mHideSelector:ListPopupWindow.ListSelectorHider = new ListPopupWindow.ListSelectorHider(this);

    private mShowDropDownRunnable:Runnable;

    private mHandler:Handler = new Handler();

    private mTempRect:Rect = new Rect();

    private mModal:boolean;

    private mLayoutDirection:number = 0;

    /**
     * The provided prompt view should appear above list content.
     * 
     * @see #setPromptPosition(int)
     * @see #getPromptPosition()
     * @see #setPromptView(View)
     */
    static POSITION_PROMPT_ABOVE:number = 0;

    /**
     * The provided prompt view should appear below list content.
     * 
     * @see #setPromptPosition(int)
     * @see #getPromptPosition()
     * @see #setPromptView(View)
     */
    static POSITION_PROMPT_BELOW:number = 1;

    /**
     * Alias for {@link ViewGroup.LayoutParams#MATCH_PARENT}.
     * If used to specify a popup width, the popup will match the width of the anchor view.
     * If used to specify a popup height, the popup will fill available space.
     */
    static MATCH_PARENT:number = ViewGroup.LayoutParams.MATCH_PARENT;

    /**
     * Alias for {@link ViewGroup.LayoutParams#WRAP_CONTENT}.
     * If used to specify a popup width, the popup will use the width of its content.
     */
    static WRAP_CONTENT:number = ViewGroup.LayoutParams.WRAP_CONTENT;

    /**
     * Mode for {@link #setInputMethodMode(int)}: the requirements for the
     * input method should be based on the focusability of the popup.  That is
     * if it is focusable than it needs to work with the input method, else
     * it doesn't.
     */
    static INPUT_METHOD_FROM_FOCUSABLE:number = PopupWindow.INPUT_METHOD_FROM_FOCUSABLE;

    /**
     * Mode for {@link #setInputMethodMode(int)}: this popup always needs to
     * work with an input method, regardless of whether it is focusable.  This
     * means that it will always be displayed so that the user can also operate
     * the input method while it is shown.
     */
    static INPUT_METHOD_NEEDED:number = PopupWindow.INPUT_METHOD_NEEDED;

    /**
     * Mode for {@link #setInputMethodMode(int)}: this popup never needs to
     * work with an input method, regardless of whether it is focusable.  This
     * means that it will always be displayed to use as much space on the
     * screen as needed, regardless of whether this covers the input method.
     */
    static INPUT_METHOD_NOT_NEEDED:number = PopupWindow.INPUT_METHOD_NOT_NEEDED;

    /**
     * Create a new, empty popup window capable of displaying items from a ListAdapter.
     * Backgrounds should be set using {@link #setBackgroundDrawable(Drawable)}.
     * 
     * @param context Context used for contained views.
     * @param attrs Attributes from inflating parent views used to style the popup.
     * @param defStyleAttr Style attribute to read for default styling of popup content.
     * @param defStyleRes Style resource ID to use for default styling of popup content.
     */
    constructor(context:Context, styleAttr=android.R.attr.listPopupWindowStyle) {
        this.mContext = context;
        this.mPopup = new PopupWindow(context, styleAttr);
        this.mPopup.setInputMethodMode(PopupWindow.INPUT_METHOD_NEEDED);
        // Set the default layout direction to match the default locale one
        //const locale:Locale = this.mContext.getResources().getConfiguration().locale;
        this.mLayoutDirection = View.LAYOUT_DIRECTION_LTR;//TextUtils.getLayoutDirectionFromLocale(locale);
    }

    /**
     * Sets the adapter that provides the data and the views to represent the data
     * in this popup window.
     *
     * @param adapter The adapter to use to create this window's content.
     */
    setAdapter(adapter:ListAdapter):void  {
        if (this.mObserver == null) {
            this.mObserver = new ListPopupWindow.PopupDataSetObserver(this);
        } else if (this.mAdapter != null) {
            this.mAdapter.unregisterDataSetObserver(this.mObserver);
        }
        this.mAdapter = adapter;
        if (this.mAdapter != null) {
            adapter.registerDataSetObserver(this.mObserver);
        }
        if (this.mDropDownList != null) {
            this.mDropDownList.setAdapter(this.mAdapter);
        }
    }

    /**
     * Set where the optional prompt view should appear. The default is
     * {@link #POSITION_PROMPT_ABOVE}.
     * 
     * @param position A position constant declaring where the prompt should be displayed.
     * 
     * @see #POSITION_PROMPT_ABOVE
     * @see #POSITION_PROMPT_BELOW
     */
    setPromptPosition(position:number):void  {
        this.mPromptPosition = position;
    }

    /**
     * @return Where the optional prompt view should appear.
     * 
     * @see #POSITION_PROMPT_ABOVE
     * @see #POSITION_PROMPT_BELOW
     */
    getPromptPosition():number  {
        return this.mPromptPosition;
    }

    /**
     * Set whether this window should be modal when shown.
     * 
     * <p>If a popup window is modal, it will receive all touch and key input.
     * If the user touches outside the popup window's content area the popup window
     * will be dismissed.
     * 
     * @param modal {@code true} if the popup window should be modal, {@code false} otherwise.
     */
    setModal(modal:boolean):void  {
        this.mModal = true;
        this.mPopup.setFocusable(modal);
    }

    /**
     * Returns whether the popup window will be modal when shown.
     * 
     * @return {@code true} if the popup window will be modal, {@code false} otherwise.
     */
    isModal():boolean  {
        return this.mModal;
    }

    /**
     * Forces outside touches to be ignored. Normally if {@link #isDropDownAlwaysVisible()} is
     * false, we allow outside touch to dismiss the dropdown. If this is set to true, then we
     * ignore outside touch even when the drop down is not set to always visible.
     * 
     * @hide Used only by AutoCompleteTextView to handle some internal special cases.
     */
    setForceIgnoreOutsideTouch(forceIgnoreOutsideTouch:boolean):void  {
        this.mForceIgnoreOutsideTouch = forceIgnoreOutsideTouch;
    }

    /**
     * Sets whether the drop-down should remain visible under certain conditions.
     *
     * The drop-down will occupy the entire screen below {@link #getAnchorView} regardless
     * of the size or content of the list.  {@link #getBackground()} will fill any space
     * that is not used by the list.
     *
     * @param dropDownAlwaysVisible Whether to keep the drop-down visible.
     *
     * @hide Only used by AutoCompleteTextView under special conditions.
     */
    setDropDownAlwaysVisible(dropDownAlwaysVisible:boolean):void  {
        this.mDropDownAlwaysVisible = dropDownAlwaysVisible;
    }

    /**
     * @return Whether the drop-down is visible under special conditions.
     *
     * @hide Only used by AutoCompleteTextView under special conditions.
     */
    isDropDownAlwaysVisible():boolean  {
        return this.mDropDownAlwaysVisible;
    }

    ///**
    // * Sets the operating mode for the soft input area.
    // *
    // * @param mode The desired mode, see
    // *        {@link android.view.WindowManager.LayoutParams#softInputMode}
    // *        for the full list
    // *
    // * @see android.view.WindowManager.LayoutParams#softInputMode
    // * @see #getSoftInputMode()
    // */
    //setSoftInputMode(mode:number):void  {
    //    this.mPopup.setSoftInputMode(mode);
    //}
    //
    ///**
    // * Returns the current value in {@link #setSoftInputMode(int)}.
    // *
    // * @see #setSoftInputMode(int)
    // * @see android.view.WindowManager.LayoutParams#softInputMode
    // */
    //getSoftInputMode():number  {
    //    return this.mPopup.getSoftInputMode();
    //}
    //
    ///**
    // * Sets a drawable to use as the list item selector.
    // *
    // * @param selector List selector drawable to use in the popup.
    // */
    //setListSelector(selector:Drawable):void  {
    //    this.mDropDownListHighlight = selector;
    //}

    /**
     * @return The background drawable for the popup window.
     */
    getBackground():Drawable  {
        return this.mPopup.getBackground();
    }

    /**
     * Sets a drawable to be the background for the popup window.
     * 
     * @param d A drawable to set as the background.
     */
    setBackgroundDrawable(d:Drawable):void  {
        this.mPopup.setBackgroundDrawable(d);
    }

    /**
     * Set an animation to use when the popup window is shown or dismissed.
     */
    setWindowAnimation(enterAnimation:Animation, exitAnimation:Animation):void  {
        this.mPopup.setWindowAnimation(enterAnimation, exitAnimation);
    }

    /**
     * <p>Return the animation style to use the popup appears</p>
     */
    getEnterAnimation():Animation  {
        return this.mPopup.mEnterAnimation;
    }
    /**
     * <p>Return the animation style to use the popup appears</p>
     */
    getExitAnimation():Animation  {
        return this.mPopup.mExitAnimation;
    }

    /**
     * Returns the view that will be used to anchor this popup.
     * 
     * @return The popup's anchor view
     */
    getAnchorView():View  {
        return this.mDropDownAnchorView;
    }

    /**
     * Sets the popup's anchor view. This popup will always be positioned relative to
     * the anchor view when shown.
     * 
     * @param anchor The view to use as an anchor.
     */
    setAnchorView(anchor:View):void  {
        this.mDropDownAnchorView = anchor;
    }

    /**
     * @return The horizontal offset of the popup from its anchor in pixels.
     */
    getHorizontalOffset():number  {
        return this.mDropDownHorizontalOffset;
    }

    /**
     * Set the horizontal offset of this popup from its anchor view in pixels.
     * 
     * @param offset The horizontal offset of the popup from its anchor.
     */
    setHorizontalOffset(offset:number):void  {
        this.mDropDownHorizontalOffset = offset;
    }

    /**
     * @return The vertical offset of the popup from its anchor in pixels.
     */
    getVerticalOffset():number  {
        if (!this.mDropDownVerticalOffsetSet) {
            return 0;
        }
        return this.mDropDownVerticalOffset;
    }

    /**
     * Set the vertical offset of this popup from its anchor view in pixels.
     * 
     * @param offset The vertical offset of the popup from its anchor.
     */
    setVerticalOffset(offset:number):void  {
        this.mDropDownVerticalOffset = offset;
        this.mDropDownVerticalOffsetSet = true;
    }

    /**
     * Set the gravity of the dropdown list. This is commonly used to
     * set gravity to START or END for alignment with the anchor.
     *
     * @param gravity Gravity value to use
     */
    setDropDownGravity(gravity:number):void  {
        this.mDropDownGravity = gravity;
    }

    /**
     * @return The width of the popup window in pixels.
     */
    getWidth():number  {
        return this.mDropDownWidth;
    }

    /**
     * Sets the width of the popup window in pixels. Can also be {@link #MATCH_PARENT}
     * or {@link #WRAP_CONTENT}.
     * 
     * @param width Width of the popup window.
     */
    setWidth(width:number):void  {
        this.mDropDownWidth = width;
    }

    /**
     * Sets the width of the popup window by the size of its content. The final width may be
     * larger to accommodate styled window dressing.
     *
     * @param width Desired width of content in pixels.
     */
    setContentWidth(width:number):void  {
        let popupBackground:Drawable = this.mPopup.getBackground();
        if (popupBackground != null) {
            popupBackground.getPadding(this.mTempRect);
            this.mDropDownWidth = this.mTempRect.left + this.mTempRect.right + width;
        } else {
            this.setWidth(width);
        }
    }

    /**
     * @return The height of the popup window in pixels.
     */
    getHeight():number  {
        return this.mDropDownHeight;
    }

    /**
     * Sets the height of the popup window in pixels. Can also be {@link #MATCH_PARENT}.
     * 
     * @param height Height of the popup window.
     */
    setHeight(height:number):void  {
        this.mDropDownHeight = height;
    }

    /**
     * Sets a listener to receive events when a list item is clicked.
     * 
     * @param clickListener Listener to register
     * 
     * @see ListView#setOnItemClickListener(android.widget.AdapterView.OnItemClickListener)
     */
    setOnItemClickListener(clickListener:AdapterView.OnItemClickListener):void  {
        this.mItemClickListener = clickListener;
    }

    /**
     * Sets a listener to receive events when a list item is selected.
     * 
     * @param selectedListener Listener to register.
     * 
     * @see ListView#setOnItemSelectedListener(android.widget.AdapterView.OnItemSelectedListener)
     */
    setOnItemSelectedListener(selectedListener:AdapterView.OnItemSelectedListener):void  {
        this.mItemSelectedListener = selectedListener;
    }

    /**
     * Set a view to act as a user prompt for this popup window. Where the prompt view will appear
     * is controlled by {@link #setPromptPosition(int)}.
     * 
     * @param prompt View to use as an informational prompt.
     */
    setPromptView(prompt:View):void  {
        let showing:boolean = this.isShowing();
        if (showing) {
            this.removePromptView();
        }
        this.mPromptView = prompt;
        if (showing) {
            this.show();
        }
    }

    /**
     * Post a {@link #show()} call to the UI thread.
     */
    postShow():void  {
        this.mHandler.post(this.mShowDropDownRunnable);
    }

    /**
     * Show the popup list. If the list is already showing, this method
     * will recalculate the popup's size and position.
     */
    show():void  {
        let height:number = this.buildDropDown();
        let widthSpec:number = 0;
        let heightSpec:number = 0;
        let noInputMethod:boolean = this.isInputMethodNotNeeded();
        this.mPopup.setAllowScrollingAnchorParent(!noInputMethod);
        if (this.mPopup.isShowing()) {
            if (this.mDropDownWidth == ViewGroup.LayoutParams.MATCH_PARENT) {
                // The call to PopupWindow's update method below can accept -1 for any
                // value you do not want to update.
                widthSpec = -1;
            } else if (this.mDropDownWidth == ViewGroup.LayoutParams.WRAP_CONTENT) {
                widthSpec = this.getAnchorView().getWidth();
            } else {
                widthSpec = this.mDropDownWidth;
            }
            if (this.mDropDownHeight == ViewGroup.LayoutParams.MATCH_PARENT) {
                // The call to PopupWindow's update method below can accept -1 for any
                // value you do not want to update.
                heightSpec = noInputMethod ? height : ViewGroup.LayoutParams.MATCH_PARENT;
                if (noInputMethod) {
                    this.mPopup.setWindowLayoutMode(this.mDropDownWidth == ViewGroup.LayoutParams.MATCH_PARENT ? ViewGroup.LayoutParams.MATCH_PARENT : 0, 0);
                } else {
                    this.mPopup.setWindowLayoutMode(this.mDropDownWidth == ViewGroup.LayoutParams.MATCH_PARENT ? ViewGroup.LayoutParams.MATCH_PARENT : 0, ViewGroup.LayoutParams.MATCH_PARENT);
                }
            } else if (this.mDropDownHeight == ViewGroup.LayoutParams.WRAP_CONTENT) {
                heightSpec = height;
            } else {
                heightSpec = this.mDropDownHeight;
            }
            this.mPopup.setOutsideTouchable(!this.mForceIgnoreOutsideTouch && !this.mDropDownAlwaysVisible);
            this.mPopup.update(this.getAnchorView(), this.mDropDownHorizontalOffset, this.mDropDownVerticalOffset, widthSpec, heightSpec);
        } else {
            if (this.mDropDownWidth == ViewGroup.LayoutParams.MATCH_PARENT) {
                widthSpec = ViewGroup.LayoutParams.MATCH_PARENT;
            } else {
                if (this.mDropDownWidth == ViewGroup.LayoutParams.WRAP_CONTENT) {
                    this.mPopup.setWidth(this.getAnchorView().getWidth());
                } else {
                    this.mPopup.setWidth(this.mDropDownWidth);
                }
            }
            if (this.mDropDownHeight == ViewGroup.LayoutParams.MATCH_PARENT) {
                heightSpec = ViewGroup.LayoutParams.MATCH_PARENT;
            } else {
                if (this.mDropDownHeight == ViewGroup.LayoutParams.WRAP_CONTENT) {
                    this.mPopup.setHeight(height);
                } else {
                    this.mPopup.setHeight(this.mDropDownHeight);
                }
            }
            this.mPopup.setWindowLayoutMode(widthSpec, heightSpec);
            this.mPopup.setClipToScreenEnabled(true);
            // use outside touchable to dismiss drop down when touching outside of it, so
            // only set this if the dropdown is not always visible
            this.mPopup.setOutsideTouchable(!this.mForceIgnoreOutsideTouch && !this.mDropDownAlwaysVisible);
            this.mPopup.setTouchInterceptor(this.mTouchInterceptor);
            this.mPopup.showAsDropDown(this.getAnchorView(), this.mDropDownHorizontalOffset, this.mDropDownVerticalOffset, this.mDropDownGravity);
            this.mDropDownList.setSelection(ListView.INVALID_POSITION);
            if (!this.mModal || this.mDropDownList.isInTouchMode()) {
                this.clearListSelection();
            }
            if (!this.mModal) {
                this.mHandler.post(this.mHideSelector);
            }
        }
    }

    /**
     * Dismiss the popup window.
     */
    dismiss():void  {
        this.mPopup.dismiss();
        this.removePromptView();
        this.mPopup.setContentView(null);
        this.mDropDownList = null;
        this.mHandler.removeCallbacks(this.mResizePopupRunnable);
    }

    /**
     * Set a listener to receive a callback when the popup is dismissed.
     *
     * @param listener Listener that will be notified when the popup is dismissed.
     */
    setOnDismissListener(listener:PopupWindow.OnDismissListener):void  {
        this.mPopup.setOnDismissListener(listener);
    }

    private removePromptView():void  {
        if (this.mPromptView != null) {
            const parent:ViewParent = this.mPromptView.getParent();
            if (parent instanceof ViewGroup) {
                const group:ViewGroup = <ViewGroup> parent;
                group.removeView(this.mPromptView);
            }
        }
    }

    /**
     * Control how the popup operates with an input method: one of
     * {@link #INPUT_METHOD_FROM_FOCUSABLE}, {@link #INPUT_METHOD_NEEDED},
     * or {@link #INPUT_METHOD_NOT_NEEDED}.
     * 
     * <p>If the popup is showing, calling this method will take effect only
     * the next time the popup is shown or through a manual call to the {@link #show()}
     * method.</p>
     * 
     * @see #getInputMethodMode()
     * @see #show()
     */
    setInputMethodMode(mode:number):void  {
        this.mPopup.setInputMethodMode(mode);
    }

    /**
     * Return the current value in {@link #setInputMethodMode(int)}.
     * 
     * @see #setInputMethodMode(int)
     */
    getInputMethodMode():number  {
        return this.mPopup.getInputMethodMode();
    }

    /**
     * Set the selected position of the list.
     * Only valid when {@link #isShowing()} == {@code true}.
     * 
     * @param position List position to set as selected.
     */
    setSelection(position:number):void  {
        let list:ListPopupWindow.DropDownListView = this.mDropDownList;
        if (this.isShowing() && list != null) {
            list.mListSelectionHidden = false;
            list.setSelection(position);
            if (list.getChoiceMode() != ListView.CHOICE_MODE_NONE) {
                list.setItemChecked(position, true);
            }
        }
    }

    /**
     * Clear any current list selection.
     * Only valid when {@link #isShowing()} == {@code true}.
     */
    clearListSelection():void  {
        const list:ListPopupWindow.DropDownListView = this.mDropDownList;
        if (list != null) {
            // WARNING: Please read the comment where mListSelectionHidden is declared
            list.mListSelectionHidden = true;
            list.hideSelector();
            list.requestLayout();
        }
    }

    /**
     * @return {@code true} if the popup is currently showing, {@code false} otherwise.
     */
    isShowing():boolean  {
        return this.mPopup.isShowing();
    }

    /**
     * @return {@code true} if this popup is configured to assume the user does not need
     * to interact with the IME while it is showing, {@code false} otherwise.
     */
    isInputMethodNotNeeded():boolean  {
        return this.mPopup.getInputMethodMode() == ListPopupWindow.INPUT_METHOD_NOT_NEEDED;
    }

    /**
     * Perform an item click operation on the specified list adapter position.
     * 
     * @param position Adapter position for performing the click
     * @return true if the click action could be performed, false if not.
     *         (e.g. if the popup was not showing, this method would return false.)
     */
    performItemClick(position:number):boolean  {
        if (this.isShowing()) {
            if (this.mItemClickListener != null) {
                const list:ListPopupWindow.DropDownListView = this.mDropDownList;
                const child:View = list.getChildAt(position - list.getFirstVisiblePosition());
                const adapter:ListAdapter = list.getAdapter();
                this.mItemClickListener.onItemClick(list, child, position, adapter.getItemId(position));
            }
            return true;
        }
        return false;
    }

    /**
     * @return The currently selected item or null if the popup is not showing.
     */
    getSelectedItem():any  {
        if (!this.isShowing()) {
            return null;
        }
        return this.mDropDownList.getSelectedItem();
    }

    /**
     * @return The position of the currently selected item or {@link ListView#INVALID_POSITION}
     * if {@link #isShowing()} == {@code false}.
     * 
     * @see ListView#getSelectedItemPosition()
     */
    getSelectedItemPosition():number  {
        if (!this.isShowing()) {
            return ListView.INVALID_POSITION;
        }
        return this.mDropDownList.getSelectedItemPosition();
    }

    /**
     * @return The ID of the currently selected item or {@link ListView#INVALID_ROW_ID}
     * if {@link #isShowing()} == {@code false}.
     * 
     * @see ListView#getSelectedItemId()
     */
    getSelectedItemId():number  {
        if (!this.isShowing()) {
            return ListView.INVALID_ROW_ID;
        }
        return this.mDropDownList.getSelectedItemId();
    }

    /**
     * @return The View for the currently selected item or null if
     * {@link #isShowing()} == {@code false}.
     * 
     * @see ListView#getSelectedView()
     */
    getSelectedView():View  {
        if (!this.isShowing()) {
            return null;
        }
        return this.mDropDownList.getSelectedView();
    }

    /**
     * @return The {@link ListView} displayed within the popup window.
     * Only valid when {@link #isShowing()} == {@code true}.
     */
    getListView():ListView  {
        return this.mDropDownList;
    }

    /**
     * The maximum number of list items that can be visible and still have
     * the list expand when touched.
     *
     * @param max Max number of items that can be visible and still allow the list to expand.
     */
    setListItemExpandMax(max:number):void  {
        this.mListItemExpandMaximum = max;
    }

    /**
     * Filter key down events. By forwarding key down events to this function,
     * views using non-modal ListPopupWindow can have it handle key selection of items.
     *  
     * @param keyCode keyCode param passed to the host view's onKeyDown
     * @param event event param passed to the host view's onKeyDown
     * @return true if the event was handled, false if it was ignored.
     * 
     * @see #setModal(boolean)
     */
    onKeyDown(keyCode:number, event:KeyEvent):boolean  {
        // when the drop down is shown, we drive it directly
        if (this.isShowing()) {
            // to select one of its items
            if (keyCode != KeyEvent.KEYCODE_SPACE && (this.mDropDownList.getSelectedItemPosition() >= 0 || !KeyEvent.isConfirmKey(keyCode))) {
                let curIndex:number = this.mDropDownList.getSelectedItemPosition();
                let consumed:boolean;
                const below:boolean = !this.mPopup.isAboveAnchor();
                const adapter:ListAdapter = this.mAdapter;
                let allEnabled:boolean;
                let firstItem:number = Integer.MAX_VALUE;
                let lastItem:number = Integer.MIN_VALUE;
                if (adapter != null) {
                    allEnabled = adapter.areAllItemsEnabled();
                    firstItem = allEnabled ? 0 : this.mDropDownList.lookForSelectablePosition(0, true);
                    lastItem = allEnabled ? adapter.getCount() - 1 : this.mDropDownList.lookForSelectablePosition(adapter.getCount() - 1, false);
                }
                if ((below && keyCode == KeyEvent.KEYCODE_DPAD_UP && curIndex <= firstItem) || (!below && keyCode == KeyEvent.KEYCODE_DPAD_DOWN && curIndex >= lastItem)) {
                    // When the selection is at the top, we block the key
                    // event to prevent focus from moving.
                    this.clearListSelection();
                    this.mPopup.setInputMethodMode(PopupWindow.INPUT_METHOD_NEEDED);
                    this.show();
                    return true;
                } else {
                    // WARNING: Please read the comment where mListSelectionHidden
                    //          is declared
                    this.mDropDownList.mListSelectionHidden = false;
                }
                consumed = this.mDropDownList.onKeyDown(keyCode, event);
                if (ListPopupWindow.DEBUG)
                    Log.v(ListPopupWindow.TAG, "Key down: code=" + keyCode + " list consumed=" + consumed);
                if (consumed) {
                    // If it handled the key event, then the user is
                    // navigating in the list, so we should put it in front.
                    this.mPopup.setInputMethodMode(PopupWindow.INPUT_METHOD_NOT_NEEDED);
                    // Here's a little trick we need to do to make sure that
                    // the list view is actually showing its focus indicator,
                    // by ensuring it has focus and getting its window out
                    // of touch mode.
                    this.mDropDownList.requestFocusFromTouch();
                    this.show();
                    switch(keyCode) {
                        // next component
                        case KeyEvent.KEYCODE_ENTER:
                        case KeyEvent.KEYCODE_DPAD_CENTER:
                        case KeyEvent.KEYCODE_DPAD_DOWN:
                        case KeyEvent.KEYCODE_DPAD_UP:
                            return true;
                    }
                } else {
                    if (below && keyCode == KeyEvent.KEYCODE_DPAD_DOWN) {
                        // event to avoid going to the next focusable widget
                        if (curIndex == lastItem) {
                            return true;
                        }
                    } else if (!below && keyCode == KeyEvent.KEYCODE_DPAD_UP && curIndex == firstItem) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Filter key down events. By forwarding key up events to this function,
     * views using non-modal ListPopupWindow can have it handle key selection of items.
     *  
     * @param keyCode keyCode param passed to the host view's onKeyUp
     * @param event event param passed to the host view's onKeyUp
     * @return true if the event was handled, false if it was ignored.
     * 
     * @see #setModal(boolean)
     */
    onKeyUp(keyCode:number, event:KeyEvent):boolean  {
        if (this.isShowing() && this.mDropDownList.getSelectedItemPosition() >= 0) {
            let consumed:boolean = this.mDropDownList.onKeyUp(keyCode, event);
            if (consumed && KeyEvent.isConfirmKey(keyCode)) {
                // if the list accepts the key events and the key event was a click, the text view
                // gets the selected item from the drop down as its content
                this.dismiss();
            }
            return consumed;
        }
        return false;
    }

    /**
     * Filter pre-IME key events. By forwarding {@link View#onKeyPreIme(int, KeyEvent)}
     * events to this function, views using ListPopupWindow can have it dismiss the popup
     * when the back key is pressed.
     *  
     * @param keyCode keyCode param passed to the host view's onKeyPreIme
     * @param event event param passed to the host view's onKeyPreIme
     * @return true if the event was handled, false if it was ignored.
     * 
     * @see #setModal(boolean)
     */
    onKeyPreIme(keyCode:number, event:KeyEvent):boolean  {
        if (keyCode == KeyEvent.KEYCODE_BACK && this.isShowing()) {
            // special case for the back key, we do not even try to send it
            // to the drop down list but instead, consume it immediately
            const anchorView:View = this.mDropDownAnchorView;
            if (event.getAction() == KeyEvent.ACTION_DOWN && event.getRepeatCount() == 0) {
                let state:KeyEvent.DispatcherState = anchorView.getKeyDispatcherState();
                if (state != null) {
                    state.startTracking(event, this);
                }
                return true;
            } else if (event.getAction() == KeyEvent.ACTION_UP) {
                let state:KeyEvent.DispatcherState = anchorView.getKeyDispatcherState();
                if (state != null) {
                    state.handleUpEvent(event);
                }
                if (event.isTracking() && !event.isCanceled()) {
                    this.dismiss();
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Returns an {@link OnTouchListener} that can be added to the source view
     * to implement drag-to-open behavior. Generally, the source view should be
     * the same view that was passed to {@link #setAnchorView}.
     * <p>
     * When the listener is set on a view, touching that view and dragging
     * outside of its bounds will open the popup window. Lifting will select the
     * currently touched list item.
     * <p>
     * Example usage:
     * <pre>
     * ListPopupWindow myPopup = new ListPopupWindow(context);
     * myPopup.setAnchor(myAnchor);
     * OnTouchListener dragListener = myPopup.createDragToOpenListener(myAnchor);
     * myAnchor.setOnTouchListener(dragListener);
     * </pre>
     *
     * @param src the view on which the resulting listener will be set
     * @return a touch listener that controls drag-to-open behavior
     */
    createDragToOpenListener(src:View):OnTouchListener  {
        return (()=>{
            const _this=this;
            class _Inner extends ListPopupWindow.ForwardingListener {
                getPopup():ListPopupWindow  {
                    return _this;
                }
            }
            return new _Inner(src);
        })();
    }

    /**
     * <p>Builds the popup window's content and returns the height the popup
     * should have. Returns -1 when the content already exists.</p>
     *
     * @return the content's height or -1 if content already exists
     */
    private buildDropDown():number  {
        let dropDownView:ViewGroup;
        let otherHeights:number = 0;
        if (this.mDropDownList == null) {
            let context:Context = this.mContext;
            /**
             * This Runnable exists for the sole purpose of checking if the view layout has got
             * completed and if so call showDropDown to display the drop down. This is used to show
             * the drop down as soon as possible after user opens up the search dialog, without
             * waiting for the normal UI pipeline to do it's job which is slower than this method.
             */
            this.mShowDropDownRunnable = (()=>{
                const _this=this;
                class _Inner implements Runnable {
                    run():void  {
                        // View layout should be all done before displaying the drop down.
                        let view:View = _this.getAnchorView();
                        if (view != null && view.isAttachedToWindow()) {
                            _this.show();
                        }
                    }
                }
                return new _Inner();
            })();
            this.mDropDownList = new ListPopupWindow.DropDownListView(context, !this.mModal);
            if (this.mDropDownListHighlight != null) {
                this.mDropDownList.setSelector(this.mDropDownListHighlight);
            }
            this.mDropDownList.setAdapter(this.mAdapter);
            this.mDropDownList.setOnItemClickListener(this.mItemClickListener);
            this.mDropDownList.setFocusable(true);
            this.mDropDownList.setFocusableInTouchMode(true);
            this.mDropDownList.setOnItemSelectedListener((()=>{
                const _this=this;
                class _Inner implements AdapterView.OnItemSelectedListener {

                    onItemSelected(parent:AdapterView<any>, view:View, position:number, id:number):void  {
                        if (position != -1) {
                            let dropDownList:ListPopupWindow.DropDownListView = _this.mDropDownList;
                            if (dropDownList != null) {
                                dropDownList.mListSelectionHidden = false;
                            }
                        }
                    }

                    onNothingSelected(parent:AdapterView<any>):void  {
                    }
                }
                return new _Inner();
            })());
            this.mDropDownList.setOnScrollListener(this.mScrollListener);
            if (this.mItemSelectedListener != null) {
                this.mDropDownList.setOnItemSelectedListener(this.mItemSelectedListener);
            }
            dropDownView = this.mDropDownList;
            let hintView:View = this.mPromptView;
            if (hintView != null) {
                // if a hint has been specified, we accomodate more space for it and
                // add a text view in the drop down menu, at the bottom of the list
                let hintContainer:LinearLayout = new LinearLayout(context);
                hintContainer.setOrientation(LinearLayout.VERTICAL);
                let hintParams:LinearLayout.LayoutParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1.0);
                switch(this.mPromptPosition) {
                    case ListPopupWindow.POSITION_PROMPT_BELOW:
                        hintContainer.addView(dropDownView, hintParams);
                        hintContainer.addView(hintView);
                        break;
                    case ListPopupWindow.POSITION_PROMPT_ABOVE:
                        hintContainer.addView(hintView);
                        hintContainer.addView(dropDownView, hintParams);
                        break;
                    default:
                        Log.e(ListPopupWindow.TAG, "Invalid hint position " + this.mPromptPosition);
                        break;
                }
                // measure the hint's height to find how much more vertical space
                // we need to add to the drop down's height
                let widthSpec:number = MeasureSpec.makeMeasureSpec(this.mDropDownWidth, MeasureSpec.AT_MOST);
                let heightSpec:number = MeasureSpec.UNSPECIFIED;
                hintView.measure(widthSpec, heightSpec);
                hintParams = <LinearLayout.LayoutParams> hintView.getLayoutParams();
                otherHeights = hintView.getMeasuredHeight() + hintParams.topMargin + hintParams.bottomMargin;
                dropDownView = hintContainer;
            }
            this.mPopup.setContentView(dropDownView);
        } else {
            dropDownView = <ViewGroup> this.mPopup.getContentView();
            const view:View = this.mPromptView;
            if (view != null) {
                let hintParams:LinearLayout.LayoutParams = <LinearLayout.LayoutParams> view.getLayoutParams();
                otherHeights = view.getMeasuredHeight() + hintParams.topMargin + hintParams.bottomMargin;
            }
        }
        // getMaxAvailableHeight() subtracts the padding, so we put it back
        // to get the available height for the whole window
        let padding:number = 0;
        let background:Drawable = this.mPopup.getBackground();
        if (background != null) {
            background.getPadding(this.mTempRect);
            padding = this.mTempRect.top + this.mTempRect.bottom;
            // background so that content will line up.
            if (!this.mDropDownVerticalOffsetSet) {
                this.mDropDownVerticalOffset = -this.mTempRect.top;
            }
        } else {
            this.mTempRect.setEmpty();
        }
        // Max height available on the screen for a popup.
        let ignoreBottomDecorations:boolean = this.mPopup.getInputMethodMode() == PopupWindow.INPUT_METHOD_NOT_NEEDED;
        const maxHeight:number = this.mPopup.getMaxAvailableHeight(this.getAnchorView(), this.mDropDownVerticalOffset, ignoreBottomDecorations);
        if (this.mDropDownAlwaysVisible || this.mDropDownHeight == ViewGroup.LayoutParams.MATCH_PARENT) {
            return maxHeight + padding;
        }
        let childWidthSpec:number;
        switch(this.mDropDownWidth) {
            case ViewGroup.LayoutParams.WRAP_CONTENT:
                childWidthSpec = MeasureSpec.makeMeasureSpec(this.mContext.getResources().getDisplayMetrics().widthPixels - (this.mTempRect.left + this.mTempRect.right), MeasureSpec.AT_MOST);
                break;
            case ViewGroup.LayoutParams.MATCH_PARENT:
                childWidthSpec = MeasureSpec.makeMeasureSpec(this.mContext.getResources().getDisplayMetrics().widthPixels - (this.mTempRect.left + this.mTempRect.right), MeasureSpec.EXACTLY);
                break;
            default:
                childWidthSpec = MeasureSpec.makeMeasureSpec(this.mDropDownWidth, MeasureSpec.EXACTLY);
                break;
        }
        const listContent:number = this.mDropDownList.measureHeightOfChildren(childWidthSpec, 0, ListView.NO_POSITION, maxHeight - otherHeights, -1);
        // the popup if it is not needed
        if (listContent > 0)
            otherHeights += padding;
        return listContent + otherHeights;
    }














}

export module ListPopupWindow{
/**
     * Abstract class that forwards touch events to a {@link ListPopupWindow}.
     *
     * @hide
     */
export abstract class ForwardingListener implements View.OnTouchListener, View.OnAttachStateChangeListener {

    /** Scaled touch slop, used for detecting movement outside bounds. */
    private mScaledTouchSlop:number = 0;

    /** Timeout before disallowing intercept on the source's parent. */
    private mTapTimeout:number = 0;

    /** Source view from which events are forwarded. */
    private mSrc:View;

    /** Runnable used to prevent conflicts with scrolling parents. */
    private mDisallowIntercept:Runnable;

    /** Whether this listener is currently forwarding touch events. */
    private mForwarding:boolean;

    /** The id of the first pointer down in the current event stream. */
    private mActivePointerId:number = 0;

    constructor( src:View) {
        this.mSrc = src;
        this.mScaledTouchSlop = ViewConfiguration.get(src.getContext()).getScaledTouchSlop();
        this.mTapTimeout = ViewConfiguration.getTapTimeout();
        src.addOnAttachStateChangeListener(this);
    }

    /**
         * Returns the popup to which this listener is forwarding events.
         * <p>
         * Override this to return the correct popup. If the popup is displayed
         * asynchronously, you may also need to override
         * {@link #onForwardingStopped} to prevent premature cancelation of
         * forwarding.
         *
         * @return the popup to which this listener is forwarding events
         */
    abstract getPopup():ListPopupWindow ;

    onTouch(v:View, event:MotionEvent):boolean  {
        const wasForwarding:boolean = this.mForwarding;
        let forwarding:boolean;
        if (wasForwarding) {
            forwarding = this.onTouchForwarded(event) || !this.onForwardingStopped();
        } else {
            forwarding = this.onTouchObserved(event) && this.onForwardingStarted();
        }
        this.mForwarding = forwarding;
        return forwarding || wasForwarding;
    }

    onViewAttachedToWindow(v:View):void  {
    }

    onViewDetachedFromWindow(v:View):void  {
        this.mForwarding = false;
        this.mActivePointerId = MotionEvent.INVALID_POINTER_ID;
        if (this.mDisallowIntercept != null) {
            this.mSrc.removeCallbacks(this.mDisallowIntercept);
        }
    }

    /**
         * Called when forwarding would like to start.
         * <p>
         * By default, this will show the popup returned by {@link #getPopup()}.
         * It may be overridden to perform another action, like clicking the
         * source view or preparing the popup before showing it.
         *
         * @return true to start forwarding, false otherwise
         */
    protected onForwardingStarted():boolean  {
        const popup:ListPopupWindow = this.getPopup();
        if (popup != null && !popup.isShowing()) {
            popup.show();
        }
        return true;
    }

    /**
         * Called when forwarding would like to stop.
         * <p>
         * By default, this will dismiss the popup returned by
         * {@link #getPopup()}. It may be overridden to perform some other
         * action.
         *
         * @return true to stop forwarding, false otherwise
         */
    protected onForwardingStopped():boolean  {
        const popup:ListPopupWindow = this.getPopup();
        if (popup != null && popup.isShowing()) {
            popup.dismiss();
        }
        return true;
    }

    /**
         * Observes motion events and determines when to start forwarding.
         *
         * @param srcEvent motion event in source view coordinates
         * @return true to start forwarding motion events, false otherwise
         */
    private onTouchObserved(srcEvent:MotionEvent):boolean  {
        const src:View = this.mSrc;
        if (!src.isEnabled()) {
            return false;
        }
        const actionMasked:number = srcEvent.getActionMasked();
        switch(actionMasked) {
            case MotionEvent.ACTION_DOWN:
                this.mActivePointerId = srcEvent.getPointerId(0);
                if (this.mDisallowIntercept == null) {
                    this.mDisallowIntercept = new ForwardingListener.DisallowIntercept(this);
                }
                src.postDelayed(this.mDisallowIntercept, this.mTapTimeout);
                break;
            case MotionEvent.ACTION_MOVE:
                const activePointerIndex:number = srcEvent.findPointerIndex(this.mActivePointerId);
                if (activePointerIndex >= 0) {
                    const x:number = srcEvent.getX(activePointerIndex);
                    const y:number = srcEvent.getY(activePointerIndex);
                    if (!src.pointInView(x, y, this.mScaledTouchSlop)) {
                        // The pointer has moved outside of the view.
                        if (this.mDisallowIntercept != null) {
                            src.removeCallbacks(this.mDisallowIntercept);
                        }
                        src.getParent().requestDisallowInterceptTouchEvent(true);
                        return true;
                    }
                }
                break;
            case MotionEvent.ACTION_CANCEL:
            case MotionEvent.ACTION_UP:
                if (this.mDisallowIntercept != null) {
                    src.removeCallbacks(this.mDisallowIntercept);
                }
                break;
        }
        return false;
    }

    /**
         * Handled forwarded motion events and determines when to stop
         * forwarding.
         *
         * @param srcEvent motion event in source view coordinates
         * @return true to continue forwarding motion events, false to cancel
         */
    private onTouchForwarded(srcEvent:MotionEvent):boolean  {
        return false;//TODO when event.transform(matrix) & invers Matrix support
        //const src:View = this.mSrc;
        //const popup:ListPopupWindow = this.getPopup();
        //if (popup == null || !popup.isShowing()) {
        //    return false;
        //}
        //const dst:ListPopupWindow.DropDownListView = popup.mDropDownList;
        //if (dst == null || !dst.isShown()) {
        //    return false;
        //}
        //// Convert event to destination-local coordinates.
        //const dstEvent:MotionEvent = MotionEvent.obtainNoHistory(srcEvent);
        //src.toGlobalMotionEvent(dstEvent);
        //dst.toLocalMotionEvent(dstEvent);
        //// Forward converted event to destination view, then recycle it.
        //const handled:boolean = dst.onForwardedEvent(dstEvent, this.mActivePointerId);
        //dstEvent.recycle();
        //return handled;
    }


}

export module ForwardingListener{
export class DisallowIntercept implements Runnable {
    _ForwardingListener_this:ForwardingListener;
    constructor(arg:ForwardingListener){
        this._ForwardingListener_this = arg;
    }

    run():void  {
        const parent:ViewParent = this._ForwardingListener_this.mSrc.getParent();
        parent.requestDisallowInterceptTouchEvent(true);
    }
}
}

/**
     * <p>Wrapper class for a ListView. This wrapper can hijack the focus to
     * make sure the list uses the appropriate drawables and states when
     * displayed on screen within a drop down. The focus is never actually
     * passed to the drop down in this mode; the list only looks focused.</p>
     */
export class DropDownListView extends ListView {

    /** Duration in milliseconds of the drag-to-open click animation. */
    private static CLICK_ANIM_DURATION:number = 150;

    /** Target alpha value for drag-to-open click animation. */
    private static CLICK_ANIM_ALPHA:number = 0x80;

    ///** Wrapper around Drawable's <code>alpha</code> property. */
    //private static DRAWABLE_ALPHA:IntProperty<Drawable> = (()=>{
    //    const _this=this;
    //    class _Inner extends IntProperty<Drawable> {
    //
    //        setValue(object:Drawable, value:number):void  {
    //            object.setAlpha(value);
    //        }
    //
    //        get(object:Drawable):number  {
    //            return object.getAlpha();
    //        }
    //    }
    //    return new _Inner("alpha");
    //})();

    /*
         * WARNING: This is a workaround for a touch mode issue.
         *
         * Touch mode is propagated lazily to windows. This causes problems in
         * the following scenario:
         * - Type something in the AutoCompleteTextView and get some results
         * - Move down with the d-pad to select an item in the list
         * - Move up with the d-pad until the selection disappears
         * - Type more text in the AutoCompleteTextView *using the soft keyboard*
         *   and get new results; you are now in touch mode
         * - The selection comes back on the first item in the list, even though
         *   the list is supposed to be in touch mode
         *
         * Using the soft keyboard triggers the touch mode change but that change
         * is propagated to our window only after the first list layout, therefore
         * after the list attempts to resurrect the selection.
         *
         * The trick to work around this issue is to pretend the list is in touch
         * mode when we know that the selection should not appear, that is when
         * we know the user moved the selection away from the list.
         *
         * This boolean is set to true whenever we explicitly hide the list's
         * selection and reset to false whenever we know the user moved the
         * selection back to the list.
         *
         * When this boolean is true, isInTouchMode() returns true, otherwise it
         * returns super.isInTouchMode().
         */
    private mListSelectionHidden:boolean;

    /**
         * True if this wrapper should fake focus.
         */
    private mHijackFocus:boolean;

    /** Whether to force drawing of the pressed state selector. */
    private mDrawsInPressedState:boolean;

    /** Current drag-to-open click animation, if any. */
    //private mClickAnimation:Animator;

    /** Helper for drag-to-open auto scrolling. */
    //private mScrollHelper:AbsListViewAutoScroller;

    /**
         * <p>Creates a new list view wrapper.</p>
         *
         * @param context this view's context
         */
    constructor(context:Context, hijackFocus:boolean) {
        super(context, null, R.attr.dropDownListViewStyle);
        this.mHijackFocus = hijackFocus;
        // TODO: Add an API to control this
        // Transparent, since the background drawable could be anything.
        this.setCacheColorHint(0);
    }

    /**
         * Handles forwarded events.
         *
         * @param activePointerId id of the pointer that activated forwarding
         * @return whether the event was handled
         */
    onForwardedEvent(event:MotionEvent, activePointerId:number):boolean  {
        let handledEvent:boolean = true;
        let clearPressedItem:boolean = false;
        const actionMasked:number = event.getActionMasked();
        switch(actionMasked) {
            case MotionEvent.ACTION_CANCEL:
                handledEvent = false;
                break;
            case MotionEvent.ACTION_UP:
                handledEvent = false;
            // $FALL-THROUGH$
            case MotionEvent.ACTION_MOVE:
                const activeIndex:number = event.findPointerIndex(activePointerId);
                if (activeIndex < 0) {
                    handledEvent = false;
                    break;
                }
                const x:number = Math.floor(event.getX(activeIndex));
                const y:number = Math.floor(event.getY(activeIndex));
                const position:number = this.pointToPosition(x, y);
                if (position == DropDownListView.INVALID_POSITION) {
                    clearPressedItem = true;
                    break;
                }
                const child:View = this.getChildAt(position - this.getFirstVisiblePosition());
                this.setPressedItem(child, position);
                handledEvent = true;
                if (actionMasked == MotionEvent.ACTION_UP) {
                    this.clickPressedItem(child, position);
                }
                break;
        }
        // Failure to handle the event cancels forwarding.
        if (!handledEvent || clearPressedItem) {
            this.clearPressedItem();
        }
        //TODO when ForwardedEvent support
        // Manage automatic scrolling.
        //if (handledEvent) {
        //    if (this.mScrollHelper == null) {
        //        this.mScrollHelper = new AbsListViewAutoScroller(this);
        //    }
        //    this.mScrollHelper.setEnabled(true);
        //    this.mScrollHelper.onTouch(this, event);
        //} else if (this.mScrollHelper != null) {
        //    this.mScrollHelper.setEnabled(false);
        //}
        return handledEvent;
    }

    /**
         * Starts an alpha animation on the selector. When the animation ends,
         * the list performs a click on the item.
         */
    private clickPressedItem(child:View, position:number):void  {
        const id:number = this.getItemIdAtPosition(position);
        this.performItemClick(child, position, id);

        //TODO when animator ok
        //const anim:Animator = ObjectAnimator.ofInt(this.mSelector, DropDownListView.DRAWABLE_ALPHA, 0xFF, DropDownListView.CLICK_ANIM_ALPHA, 0xFF);
        //anim.setDuration(DropDownListView.CLICK_ANIM_DURATION);
        //anim.setInterpolator(new AccelerateDecelerateInterpolator());
        //anim.addListener((()=>{
        //    const _this=this;
        //    class _Inner extends AnimatorListenerAdapter {
        //
        //        onAnimationEnd(animation:Animator):void  {
        //            _this.performItemClick(child, position, id);
        //        }
        //    }
        //    return new _Inner();
        //})());
        //anim.start();
        //if (this.mClickAnimation != null) {
        //    this.mClickAnimation.cancel();
        //}
        //this.mClickAnimation = anim;
    }

    private clearPressedItem():void  {
        this.mDrawsInPressedState = false;
        this.setPressed(false);
        this.updateSelectorState();
        //if (this.mClickAnimation != null) {
        //    this.mClickAnimation.cancel();
        //    this.mClickAnimation = null;
        //}
    }

    private setPressedItem(child:View, position:number):void  {
        this.mDrawsInPressedState = true;
        // Ordering is essential. First update the pressed state and layout
        // the children. This will ensure the selector actually gets drawn.
        this.setPressed(true);
        this.layoutChildren();
        // Ensure that keyboard focus starts from the last touched position.
        this.setSelectedPositionInt(position);
        this.positionSelector(position, child);
        // Refresh the drawable state to reflect the new pressed state,
        // which will also update the selector state.
        this.refreshDrawableState();
        //if (this.mClickAnimation != null) {
        //    this.mClickAnimation.cancel();
        //    this.mClickAnimation = null;
        //}
    }

    touchModeDrawsInPressedState():boolean  {
        return this.mDrawsInPressedState || super.touchModeDrawsInPressedState();
    }

    /**
         * <p>Avoids jarring scrolling effect by ensuring that list elements
         * made of a text view fit on a single line.</p>
         *
         * @param position the item index in the list to get a view for
         * @return the view for the specified item
         */
    obtainView(position:number, isScrap:boolean[]):View  {
        let view:View = super.obtainView(position, isScrap);
        if (view instanceof TextView) {
            (<TextView> view).setHorizontallyScrolling(true);
        }
        return view;
    }

    isInTouchMode():boolean  {
        // WARNING: Please read the comment where mListSelectionHidden is declared
        return (this.mHijackFocus && this.mListSelectionHidden) || super.isInTouchMode();
    }

    /**
         * <p>Returns the focus state in the drop down.</p>
         *
         * @return true always if hijacking focus
         */
    hasWindowFocus():boolean  {
        return this.mHijackFocus || super.hasWindowFocus();
    }

    /**
         * <p>Returns the focus state in the drop down.</p>
         *
         * @return true always if hijacking focus
         */
    isFocused():boolean  {
        return this.mHijackFocus || super.isFocused();
    }

    /**
         * <p>Returns the focus state in the drop down.</p>
         *
         * @return true always if hijacking focus
         */
    hasFocus():boolean  {
        return this.mHijackFocus || super.hasFocus();
    }
}
export class PopupDataSetObserver extends DataSetObserver {
    _ListPopupWindow_this:ListPopupWindow;
    constructor(arg:ListPopupWindow){
        super();
        this._ListPopupWindow_this = arg;
    }

    onChanged():void  {
        if (this._ListPopupWindow_this.isShowing()) {
            // Resize the popup to fit new content
            this._ListPopupWindow_this.show();
        }
    }

    onInvalidated():void  {
        this._ListPopupWindow_this.dismiss();
    }
}
export class ListSelectorHider implements Runnable {
    _ListPopupWindow_this:ListPopupWindow;
    constructor(arg:ListPopupWindow){
        this._ListPopupWindow_this = arg;
    }

    run():void  {
        this._ListPopupWindow_this.clearListSelection();
    }
}
export class ResizePopupRunnable implements Runnable {
    _ListPopupWindow_this:ListPopupWindow;
    constructor(arg:ListPopupWindow){
        this._ListPopupWindow_this = arg;
    }

    run():void  {
        if (this._ListPopupWindow_this.mDropDownList != null && this._ListPopupWindow_this.mDropDownList.getCount() > this._ListPopupWindow_this.mDropDownList.getChildCount() && this._ListPopupWindow_this.mDropDownList.getChildCount() <= this._ListPopupWindow_this.mListItemExpandMaximum) {
            this._ListPopupWindow_this.mPopup.setInputMethodMode(PopupWindow.INPUT_METHOD_NOT_NEEDED);
            this._ListPopupWindow_this.show();
        }
    }
}
export class PopupTouchInterceptor implements OnTouchListener {
    _ListPopupWindow_this:ListPopupWindow;
    constructor(arg:ListPopupWindow){
        this._ListPopupWindow_this = arg;
    }

    onTouch(v:View, event:MotionEvent):boolean  {
        const action:number = event.getAction();
        const x:number = Math.floor(event.getX());
        const y:number = Math.floor(event.getY());
        if (action == MotionEvent.ACTION_DOWN && this._ListPopupWindow_this.mPopup != null && this._ListPopupWindow_this.mPopup.isShowing() && (x >= 0 && x < this._ListPopupWindow_this.mPopup.getWidth() && y >= 0 && y < this._ListPopupWindow_this.mPopup.getHeight())) {
            this._ListPopupWindow_this.mHandler.postDelayed(this._ListPopupWindow_this.mResizePopupRunnable, ListPopupWindow.EXPAND_LIST_TIMEOUT);
        } else if (action == MotionEvent.ACTION_UP) {
            this._ListPopupWindow_this.mHandler.removeCallbacks(this._ListPopupWindow_this.mResizePopupRunnable);
        }
        return false;
    }
}
export class PopupScrollListener implements AbsListView.OnScrollListener {
    _ListPopupWindow_this:ListPopupWindow;
    constructor(arg:ListPopupWindow){
        this._ListPopupWindow_this = arg;
    }

    onScroll(view:AbsListView, firstVisibleItem:number, visibleItemCount:number, totalItemCount:number):void  {
    }

    onScrollStateChanged(view:AbsListView, scrollState:number):void  {
        if (scrollState == AbsListView.OnScrollListener.SCROLL_STATE_TOUCH_SCROLL
            && !this._ListPopupWindow_this.isInputMethodNotNeeded() && this._ListPopupWindow_this.mPopup.getContentView() != null) {
            this._ListPopupWindow_this.mHandler.removeCallbacks(this._ListPopupWindow_this.mResizePopupRunnable);
            this._ListPopupWindow_this.mResizePopupRunnable.run();
        }
    }
}
}

}
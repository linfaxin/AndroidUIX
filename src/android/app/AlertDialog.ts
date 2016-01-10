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

///<reference path="../../android/content/DialogInterface.ts"/>
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/os/Bundle.ts"/>
///<reference path="../../android/os/Message.ts"/>
///<reference path="../../android/util/TypedValue.ts"/>
///<reference path="../../android/view/KeyEvent.ts"/>
///<reference path="../../android/view/MotionEvent.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/WindowManager.ts"/>
///<reference path="../../android/widget/AdapterView.ts"/>
///<reference path="../../android/widget/Button.ts"/>
///<reference path="../../android/widget/ListAdapter.ts"/>
///<reference path="../../android/widget/ListView.ts"/>
///<reference path="../../android/app/Application.ts"/>
///<reference path="../../android/app/Dialog.ts"/>
///<reference path="../../android/app/AlertController.ts"/>
///<reference path="../../android/content/Context.ts"/>

module android.app {
import DialogInterface = android.content.DialogInterface;
import Drawable = android.graphics.drawable.Drawable;
import Bundle = android.os.Bundle;
import Message = android.os.Message;
import TypedValue = android.util.TypedValue;
import KeyEvent = android.view.KeyEvent;
import MotionEvent = android.view.MotionEvent;
import View = android.view.View;
import WindowManager = android.view.WindowManager;
import AdapterView = android.widget.AdapterView;
import Button = android.widget.Button;
import ListAdapter = android.widget.ListAdapter;
import ListView = android.widget.ListView;
import Application = android.app.Application;
import Dialog = android.app.Dialog;
import Context = android.content.Context;
/**
 * A subclass of Dialog that can display one, two or three buttons. If you only want to
 * display a String in this dialog box, use the setMessage() method.  If you
 * want to display a more complex view, look up the FrameLayout called "custom"
 * and add your view to it:
 *
 * <pre>
 * FrameLayout fl = (FrameLayout) findViewById(android.R.id.custom);
 * fl.addView(myView, new LayoutParams(MATCH_PARENT, WRAP_CONTENT));
 * </pre>
 * 
 * <p>The AlertDialog class takes care of automatically setting
 * {@link WindowManager.LayoutParams#FLAG_ALT_FOCUSABLE_IM
 * WindowManager.LayoutParams.FLAG_ALT_FOCUSABLE_IM} for you based on whether
 * any views in the dialog return true from {@link View#onCheckIsTextEditor()
 * View.onCheckIsTextEditor()}.  Generally you want this set for a Dialog
 * without text editors, so that it will be placed on top of the current
 * input method UI.  You can modify this behavior by forcing the flag to your
 * desired mode after calling {@link #onCreate}.
 *
 * <div class="special reference">
 * <h3>Developer Guides</h3>
 * <p>For more information about creating dialogs, read the
 * <a href="{@docRoot}guide/topics/ui/dialogs.html">Dialogs</a> developer guide.</p>
 * </div>
 */
export class AlertDialog extends Dialog implements DialogInterface {

    private mAlert:AlertController;

    /**
     * Special theme constant for {@link #AlertDialog(Context, int)}: use
     * the traditional (pre-Holo) alert dialog theme.
     */
    static THEME_TRADITIONAL:number = 1;

    /**
     * Special theme constant for {@link #AlertDialog(Context, int)}: use
     * the holographic alert theme with a dark background.
     */
    static THEME_HOLO_DARK:number = 2;

    /**
     * Special theme constant for {@link #AlertDialog(Context, int)}: use
     * the holographic alert theme with a light background.
     */
    static THEME_HOLO_LIGHT:number = 3;

    /**
     * Special theme constant for {@link #AlertDialog(Context, int)}: use
     * the device's default alert theme with a dark background.
     */
    static THEME_DEVICE_DEFAULT_DARK:number = 4;

    /**
     * Special theme constant for {@link #AlertDialog(Context, int)}: use
     * the device's default alert theme with a light background.
     */
    static THEME_DEVICE_DEFAULT_LIGHT:number = 5;

    /**
     * Construct an AlertDialog that uses an explicit theme.  The actual style
     * that an AlertDialog uses is a private implementation, however you can
     * here supply either the name of an attribute in the theme from which
     * to get the dialog's style (such as {@link android.R.attr#alertDialogTheme}
     * or one of the constants {@link #THEME_TRADITIONAL},
     * {@link #THEME_HOLO_DARK}, or {@link #THEME_HOLO_LIGHT}.
     */
    constructor(context:Context, cancelable?:boolean, cancelListener?:DialogInterface.OnCancelListener) {
        super(context);
        //this.mWindow.alwaysReadCloseOnTouchAttr();
        this.setCancelable(cancelable);
        this.setOnCancelListener(cancelListener);
        this.mAlert = new AlertController(context, this, this.getWindow());
    }

    //static resolveDialogTheme(context:Context, resid:number):number  {
    //    if (resid == AlertDialog.THEME_TRADITIONAL) {
    //        return com.android.internal.R.style.Theme_Dialog_Alert;
    //    } else if (resid == AlertDialog.THEME_HOLO_DARK) {
    //        return com.android.internal.R.style.Theme_Holo_Dialog_Alert;
    //    } else if (resid == AlertDialog.THEME_HOLO_LIGHT) {
    //        return com.android.internal.R.style.Theme_Holo_Light_Dialog_Alert;
    //    } else if (resid == AlertDialog.THEME_DEVICE_DEFAULT_DARK) {
    //        return com.android.internal.R.style.Theme_DeviceDefault_Dialog_Alert;
    //    } else if (resid == AlertDialog.THEME_DEVICE_DEFAULT_LIGHT) {
    //        return com.android.internal.R.style.Theme_DeviceDefault_Light_Dialog_Alert;
    //    } else if (resid >= 0x01000000) {
    //        // start of real resource IDs.
    //        return resid;
    //    } else {
    //        let outValue:TypedValue = new TypedValue();
    //        context.getTheme().resolveAttribute(com.android.internal.R.attr.alertDialogTheme, outValue, true);
    //        return outValue.resourceId;
    //    }
    //}

    /**
     * Gets one of the buttons used in the dialog.
     * <p>
     * If a button does not exist in the dialog, null will be returned.
     * 
     * @param whichButton The identifier of the button that should be returned.
     *            For example, this can be
     *            {@link DialogInterface#BUTTON_POSITIVE}.
     * @return The button from the dialog, or null if a button does not exist.
     */
    getButton(whichButton:number):Button  {
        return this.mAlert.getButton(whichButton);
    }

    /**
     * Gets the list view used in the dialog.
     *  
     * @return The {@link ListView} from the dialog.
     */
    getListView():ListView  {
        return this.mAlert.getListView();
    }

    setTitle(title:string):void  {
        super.setTitle(title);
        this.mAlert.setTitle(title);
    }

    /**
     * @see Builder#setCustomTitle(View)
     */
    setCustomTitle(customTitleView:View):void  {
        this.mAlert.setCustomTitle(customTitleView);
    }

    setMessage(message:string):void  {
        this.mAlert.setMessage(message);
    }

    /**
     * Set the view to display in that dialog, specifying the spacing to appear around that 
     * view.
     *
     * @param view The view to show in the content area of the dialog
     * @param viewSpacingLeft Extra space to appear to the left of {@code view}
     * @param viewSpacingTop Extra space to appear above {@code view}
     * @param viewSpacingRight Extra space to appear to the right of {@code view}
     * @param viewSpacingBottom Extra space to appear below {@code view}
     */
    setView(view:View, viewSpacingLeft=0, viewSpacingTop=0, viewSpacingRight=0, viewSpacingBottom=0):void  {
        this.mAlert.setView(view, viewSpacingLeft, viewSpacingTop, viewSpacingRight, viewSpacingBottom);
    }

    ///**
    // * Set a message to be sent when a button is pressed.
    // *
    // * @param whichButton Which button to set the message for, can be one of
    // *            {@link DialogInterface#BUTTON_POSITIVE},
    // *            {@link DialogInterface#BUTTON_NEGATIVE}, or
    // *            {@link DialogInterface#BUTTON_NEUTRAL}
    // * @param text The text to display in positive button.
    // * @param msg The {@link Message} to be sent when clicked.
    // */
    //setButton(whichButton:number, text:CharSequence, msg:Message):void  {
    //    this.mAlert.setButton(whichButton, text, null, msg);
    //}

    /**
     * Set a listener to be invoked when the positive button of the dialog is pressed.
     * 
     * @param whichButton Which button to set the listener on, can be one of
     *            {@link DialogInterface#BUTTON_POSITIVE},
     *            {@link DialogInterface#BUTTON_NEGATIVE}, or
     *            {@link DialogInterface#BUTTON_NEUTRAL}
     * @param text The text to display in positive button.
     * @param listener The {@link DialogInterface.OnClickListener} to use.
     */
    setButton(whichButton:number, text:string, listener:DialogInterface.OnClickListener):void  {
        this.mAlert.setButton(whichButton, text, listener, null);
    }

    ///**
    // * @deprecated Use {@link #setButton(int, CharSequence, Message)} with
    // *             {@link DialogInterface#BUTTON_POSITIVE}.
    // */
    //setButton(text:CharSequence, msg:Message):void  {
    //    this.setButton(BUTTON_POSITIVE, text, msg);
    //}
    //
    ///**
    // * @deprecated Use {@link #setButton(int, CharSequence, Message)} with
    // *             {@link DialogInterface#BUTTON_NEGATIVE}.
    // */
    //setButton2(text:CharSequence, msg:Message):void  {
    //    this.setButton(BUTTON_NEGATIVE, text, msg);
    //}
    //
    ///**
    // * @deprecated Use {@link #setButton(int, CharSequence, Message)} with
    // *             {@link DialogInterface#BUTTON_NEUTRAL}.
    // */
    //setButton3(text:CharSequence, msg:Message):void  {
    //    this.setButton(BUTTON_NEUTRAL, text, msg);
    //}
    //
    ///**
    // * Set a listener to be invoked when button 1 of the dialog is pressed.
    // *
    // * @param text The text to display in button 1.
    // * @param listener The {@link DialogInterface.OnClickListener} to use.
    // * @deprecated Use
    // *             {@link #setButton(int, CharSequence, android.content.DialogInterface.OnClickListener)}
    // *             with {@link DialogInterface#BUTTON_POSITIVE}
    // */
    //setButton(text:CharSequence, listener:OnClickListener):void  {
    //    this.setButton(BUTTON_POSITIVE, text, listener);
    //}
    //
    ///**
    // * Set a listener to be invoked when button 2 of the dialog is pressed.
    // * @param text The text to display in button 2.
    // * @param listener The {@link DialogInterface.OnClickListener} to use.
    // * @deprecated Use
    // *             {@link #setButton(int, CharSequence, android.content.DialogInterface.OnClickListener)}
    // *             with {@link DialogInterface#BUTTON_NEGATIVE}
    // */
    //setButton2(text:CharSequence, listener:OnClickListener):void  {
    //    this.setButton(BUTTON_NEGATIVE, text, listener);
    //}
    //
    ///**
    // * Set a listener to be invoked when button 3 of the dialog is pressed.
    // * @param text The text to display in button 3.
    // * @param listener The {@link DialogInterface.OnClickListener} to use.
    // * @deprecated Use
    // *             {@link #setButton(int, CharSequence, android.content.DialogInterface.OnClickListener)}
    // *             with {@link DialogInterface#BUTTON_POSITIVE}
    // */
    //setButton3(text:CharSequence, listener:OnClickListener):void  {
    //    this.setButton(BUTTON_NEUTRAL, text, listener);
    //}
    //
    ///**
    // * Set resId to 0 if you don't want an icon.
    // * @param resId the resourceId of the drawable to use as the icon or 0
    // * if you don't want an icon.
    // */
    //setIcon(resId:number):void  {
    //    this.mAlert.setIcon(resId);
    //}

    setIcon(icon:Drawable):void  {
        this.mAlert.setIcon(icon);
    }

    ///**
    // * Set an icon as supplied by a theme attribute. e.g. android.R.attr.alertDialogIcon
    // *
    // * @param attrId ID of a theme attribute that points to a drawable resource.
    // */
    //setIconAttribute(attrId:number):void  {
    //    let out:TypedValue = new TypedValue();
    //    this.mContext.getTheme().resolveAttribute(attrId, out, true);
    //    this.mAlert.setIcon(out.resourceId);
    //}
    //
    //setInverseBackgroundForced(forceInverseBackground:boolean):void  {
    //    this.mAlert.setInverseBackgroundForced(forceInverseBackground);
    //}

    protected onCreate(savedInstanceState:Bundle):void  {
        super.onCreate(savedInstanceState);
        this.mAlert.installContent();
    }

    onKeyDown(keyCode:number, event:KeyEvent):boolean  {
        if (this.mAlert.onKeyDown(keyCode, event))
            return true;
        return super.onKeyDown(keyCode, event);
    }

    onKeyUp(keyCode:number, event:KeyEvent):boolean  {
        if (this.mAlert.onKeyUp(keyCode, event))
            return true;
        return super.onKeyUp(keyCode, event);
    }


}

export module AlertDialog{
export class Builder {

    private P:AlertController.AlertParams;

    //private mTheme:number = 0;

    /**
         * Constructor using a context and theme for this builder and
         * the {@link AlertDialog} it creates.  The actual theme
         * that an AlertDialog uses is a private implementation, however you can
         * here supply either the name of an attribute in the theme from which
         * to get the dialog's style (such as {@link android.R.attr#alertDialogTheme}
         * or one of the constants
         * {@link AlertDialog#THEME_TRADITIONAL AlertDialog.THEME_TRADITIONAL},
         * {@link AlertDialog#THEME_HOLO_DARK AlertDialog.THEME_HOLO_DARK}, or
         * {@link AlertDialog#THEME_HOLO_LIGHT AlertDialog.THEME_HOLO_LIGHT}.
         */
    constructor(context:Context) {
        this.P = new AlertController.AlertParams(context);
        //this.mTheme = theme;
    }

    /**
         * Returns a {@link Context} with the appropriate theme for dialogs created by this Builder.
         * Applications should use this Context for obtaining LayoutInflaters for inflating views
         * that will be used in the resulting dialogs, as it will cause views to be inflated with
         * the correct theme.
         *
         * @return A Context for built Dialogs.
         */
    getContext():Context  {
        return this.P.mContext;
    }

    ///**
    //     * Set the title using the given resource id.
    //     *
    //     * @return This Builder object to allow for chaining of calls to set methods
    //     */
    //setTitle(titleId:number):Builder  {
    //    this.P.mTitle = this.P.mContext.getText(titleId);
    //    return this;
    //}

    /**
         * Set the title displayed in the {@link Dialog}.
         *
         * @return This Builder object to allow for chaining of calls to set methods
         */
    setTitle(title:string):Builder  {
        this.P.mTitle = title;
        return this;
    }

    /**
         * Set the title using the custom view {@code customTitleView}. The
         * methods {@link #setTitle(int)} and {@link #setIcon(int)} should be
         * sufficient for most titles, but this is provided if the title needs
         * more customization. Using this will replace the title and icon set
         * via the other methods.
         * 
         * @param customTitleView The custom view to use as the title.
         *
         * @return This Builder object to allow for chaining of calls to set methods
         */
    setCustomTitle(customTitleView:View):Builder  {
        this.P.mCustomTitleView = customTitleView;
        return this;
    }

    ///**
    //     * Set the message to display using the given resource id.
    //     *
    //     * @return This Builder object to allow for chaining of calls to set methods
    //     */
    //setMessage(messageId:number):Builder  {
    //    this.P.mMessage = this.P.mContext.getText(messageId);
    //    return this;
    //}

    /**
         * Set the message to display.
          *
         * @return This Builder object to allow for chaining of calls to set methods
         */
    setMessage(message:string):Builder  {
        this.P.mMessage = message;
        return this;
    }

    ///**
    //     * Set the resource id of the {@link Drawable} to be used in the title.
    //     *
    //     * @return This Builder object to allow for chaining of calls to set methods
    //     */
    //setIcon(iconId:number):Builder  {
    //    this.P.mIconId = iconId;
    //    return this;
    //}

    /**
         * Set the {@link Drawable} to be used in the title.
          *
         * @return This Builder object to allow for chaining of calls to set methods
         */
    setIcon(icon:Drawable):Builder  {
        this.P.mIcon = icon;
        return this;
    }

    ///**
    //     * Set an icon as supplied by a theme attribute. e.g. android.R.attr.alertDialogIcon
    //     *
    //     * @param attrId ID of a theme attribute that points to a drawable resource.
    //     */
    //setIconAttribute(attrId:number):Builder  {
    //    let out:TypedValue = new TypedValue();
    //    this.P.mContext.getTheme().resolveAttribute(attrId, out, true);
    //    this.P.mIconId = out.resourceId;
    //    return this;
    //}

    ///**
    //     * Set a listener to be invoked when the positive button of the dialog is pressed.
    //     * @param textId The resource id of the text to display in the positive button
    //     * @param listener The {@link DialogInterface.OnClickListener} to use.
    //     *
    //     * @return This Builder object to allow for chaining of calls to set methods
    //     */
    //setPositiveButton(textId:number, listener:OnClickListener):Builder  {
    //    this.P.mPositiveButtonText = this.P.mContext.getText(textId);
    //    this.P.mPositiveButtonListener = listener;
    //    return this;
    //}

    /**
         * Set a listener to be invoked when the positive button of the dialog is pressed.
         * @param text The text to display in the positive button
         * @param listener The {@link DialogInterface.OnClickListener} to use.
         *
         * @return This Builder object to allow for chaining of calls to set methods
         */
    setPositiveButton(text:string, listener:DialogInterface.OnClickListener):Builder  {
        this.P.mPositiveButtonText = text;
        this.P.mPositiveButtonListener = listener;
        return this;
    }

    ///**
    //     * Set a listener to be invoked when the negative button of the dialog is pressed.
    //     * @param textId The resource id of the text to display in the negative button
    //     * @param listener The {@link DialogInterface.OnClickListener} to use.
    //     *
    //     * @return This Builder object to allow for chaining of calls to set methods
    //     */
    //setNegativeButton(textId:number, listener:OnClickListener):Builder  {
    //    this.P.mNegativeButtonText = this.P.mContext.getText(textId);
    //    this.P.mNegativeButtonListener = listener;
    //    return this;
    //}

    /**
         * Set a listener to be invoked when the negative button of the dialog is pressed.
         * @param text The text to display in the negative button
         * @param listener The {@link DialogInterface.OnClickListener} to use.
         *
         * @return This Builder object to allow for chaining of calls to set methods
         */
    setNegativeButton(text:string, listener:DialogInterface.OnClickListener):Builder  {
        this.P.mNegativeButtonText = text;
        this.P.mNegativeButtonListener = listener;
        return this;
    }

    ///**
    //     * Set a listener to be invoked when the neutral button of the dialog is pressed.
    //     * @param textId The resource id of the text to display in the neutral button
    //     * @param listener The {@link DialogInterface.OnClickListener} to use.
    //     *
    //     * @return This Builder object to allow for chaining of calls to set methods
    //     */
    //setNeutralButton(textId:number, listener:OnClickListener):Builder  {
    //    this.P.mNeutralButtonText = this.P.mContext.getText(textId);
    //    this.P.mNeutralButtonListener = listener;
    //    return this;
    //}

    /**
         * Set a listener to be invoked when the neutral button of the dialog is pressed.
         * @param text The text to display in the neutral button
         * @param listener The {@link DialogInterface.OnClickListener} to use.
         *
         * @return This Builder object to allow for chaining of calls to set methods
         */
    setNeutralButton(text:string, listener:DialogInterface.OnClickListener):Builder  {
        this.P.mNeutralButtonText = text;
        this.P.mNeutralButtonListener = listener;
        return this;
    }

    /**
         * Sets whether the dialog is cancelable or not.  Default is true.
         *
         * @return This Builder object to allow for chaining of calls to set methods
         */
    setCancelable(cancelable:boolean):Builder  {
        this.P.mCancelable = cancelable;
        return this;
    }

    /**
         * Sets the callback that will be called if the dialog is canceled.
         *
         * <p>Even in a cancelable dialog, the dialog may be dismissed for reasons other than
         * being canceled or one of the supplied choices being selected.
         * If you are interested in listening for all cases where the dialog is dismissed
         * and not just when it is canceled, see
         * {@link #setOnDismissListener(android.content.DialogInterface.OnDismissListener) setOnDismissListener}.</p>
         * @see #setCancelable(boolean)
         * @see #setOnDismissListener(android.content.DialogInterface.OnDismissListener)
         *
         * @return This Builder object to allow for chaining of calls to set methods
         */
    setOnCancelListener(onCancelListener:DialogInterface.OnCancelListener):Builder  {
        this.P.mOnCancelListener = onCancelListener;
        return this;
    }

    /**
         * Sets the callback that will be called when the dialog is dismissed for any reason.
         *
         * @return This Builder object to allow for chaining of calls to set methods
         */
    setOnDismissListener(onDismissListener:DialogInterface.OnDismissListener):Builder  {
        this.P.mOnDismissListener = onDismissListener;
        return this;
    }

    /**
         * Sets the callback that will be called if a key is dispatched to the dialog.
         *
         * @return This Builder object to allow for chaining of calls to set methods
         */
    setOnKeyListener(onKeyListener:DialogInterface.OnKeyListener):Builder  {
        this.P.mOnKeyListener = onKeyListener;
        return this;
    }

    ///**
    //     * Set a list of items to be displayed in the dialog as the content, you will be notified of the
    //     * selected item via the supplied listener. This should be an array type i.e. R.array.foo
    //     *
    //     * @return This Builder object to allow for chaining of calls to set methods
    //     */
    //setItems(itemsId:number, listener:OnClickListener):Builder  {
    //    this.P.mItems = this.P.mContext.getResources().getTextArray(itemsId);
    //    this.P.mOnClickListener = listener;
    //    return this;
    //}

    /**
         * Set a list of items to be displayed in the dialog as the content, you will be notified of the
         * selected item via the supplied listener.
         *
         * @return This Builder object to allow for chaining of calls to set methods
         */
    setItems(items:string[], listener:DialogInterface.OnClickListener):Builder  {
        this.P.mItems = items;
        this.P.mOnClickListener = listener;
        return this;
    }

    /**
         * Set a list of items, which are supplied by the given {@link ListAdapter}, to be
         * displayed in the dialog as the content, you will be notified of the
         * selected item via the supplied listener.
         * 
         * @param adapter The {@link ListAdapter} to supply the list of items
         * @param listener The listener that will be called when an item is clicked.
         *
         * @return This Builder object to allow for chaining of calls to set methods
         */
    setAdapter(adapter:ListAdapter, listener:DialogInterface.OnClickListener):Builder  {
        this.P.mAdapter = adapter;
        this.P.mOnClickListener = listener;
        return this;
    }

    ///**
    //     * Set a list of items, which are supplied by the given {@link Cursor}, to be
    //     * displayed in the dialog as the content, you will be notified of the
    //     * selected item via the supplied listener.
    //     *
    //     * @param cursor The {@link Cursor} to supply the list of items
    //     * @param listener The listener that will be called when an item is clicked.
    //     * @param labelColumn The column name on the cursor containing the string to display
    //     *          in the label.
    //     *
    //     * @return This Builder object to allow for chaining of calls to set methods
    //     */
    //setCursor(cursor:Cursor, listener:OnClickListener, labelColumn:string):Builder  {
    //    this.P.mCursor = cursor;
    //    this.P.mLabelColumn = labelColumn;
    //    this.P.mOnClickListener = listener;
    //    return this;
    //}
    //
    ///**
    //     * Set a list of items to be displayed in the dialog as the content,
    //     * you will be notified of the selected item via the supplied listener.
    //     * This should be an array type, e.g. R.array.foo. The list will have
    //     * a check mark displayed to the right of the text for each checked
    //     * item. Clicking on an item in the list will not dismiss the dialog.
    //     * Clicking on a button will dismiss the dialog.
    //     *
    //     * @param itemsId the resource id of an array i.e. R.array.foo
    //     * @param checkedItems specifies which items are checked. It should be null in which case no
    //     *        items are checked. If non null it must be exactly the same length as the array of
    //     *        items.
    //     * @param listener notified when an item on the list is clicked. The dialog will not be
    //     *        dismissed when an item is clicked. It will only be dismissed if clicked on a
    //     *        button, if no buttons are supplied it's up to the user to dismiss the dialog.
    //     *
    //     * @return This Builder object to allow for chaining of calls to set methods
    //     */
    //setMultiChoiceItems(itemsId:number, checkedItems:boolean[], listener:OnMultiChoiceClickListener):Builder  {
    //    this.P.mItems = this.P.mContext.getResources().getTextArray(itemsId);
    //    this.P.mOnCheckboxClickListener = listener;
    //    this.P.mCheckedItems = checkedItems;
    //    this.P.mIsMultiChoice = true;
    //    return this;
    //}

    /**
         * Set a list of items to be displayed in the dialog as the content,
         * you will be notified of the selected item via the supplied listener.
         * The list will have a check mark displayed to the right of the text
         * for each checked item. Clicking on an item in the list will not
         * dismiss the dialog. Clicking on a button will dismiss the dialog.
         * 
         * @param items the text of the items to be displayed in the list.
         * @param checkedItems specifies which items are checked. It should be null in which case no
         *        items are checked. If non null it must be exactly the same length as the array of
         *        items.
         * @param listener notified when an item on the list is clicked. The dialog will not be
         *        dismissed when an item is clicked. It will only be dismissed if clicked on a
         *        button, if no buttons are supplied it's up to the user to dismiss the dialog.
         *
         * @return This Builder object to allow for chaining of calls to set methods
         */
    setMultiChoiceItems(items:string[], checkedItems:boolean[], listener:DialogInterface.OnMultiChoiceClickListener):Builder  {
        this.P.mItems = items;
        this.P.mOnCheckboxClickListener = listener;
        this.P.mCheckedItems = checkedItems;
        this.P.mIsMultiChoice = true;
        return this;
    }

    ///**
    //     * Set a list of items to be displayed in the dialog as the content,
    //     * you will be notified of the selected item via the supplied listener.
    //     * The list will have a check mark displayed to the right of the text
    //     * for each checked item. Clicking on an item in the list will not
    //     * dismiss the dialog. Clicking on a button will dismiss the dialog.
    //     *
    //     * @param cursor the cursor used to provide the items.
    //     * @param isCheckedColumn specifies the column name on the cursor to use to determine
    //     *        whether a checkbox is checked or not. It must return an integer value where 1
    //     *        means checked and 0 means unchecked.
    //     * @param labelColumn The column name on the cursor containing the string to display in the
    //     *        label.
    //     * @param listener notified when an item on the list is clicked. The dialog will not be
    //     *        dismissed when an item is clicked. It will only be dismissed if clicked on a
    //     *        button, if no buttons are supplied it's up to the user to dismiss the dialog.
    //     *
    //     * @return This Builder object to allow for chaining of calls to set methods
    //     */
    //setMultiChoiceItems(cursor:Cursor, isCheckedColumn:string, labelColumn:string, listener:OnMultiChoiceClickListener):Builder  {
    //    this.P.mCursor = cursor;
    //    this.P.mOnCheckboxClickListener = listener;
    //    this.P.mIsCheckedColumn = isCheckedColumn;
    //    this.P.mLabelColumn = labelColumn;
    //    this.P.mIsMultiChoice = true;
    //    return this;
    //}
    //
    ///**
    //     * Set a list of items to be displayed in the dialog as the content, you will be notified of
    //     * the selected item via the supplied listener. This should be an array type i.e.
    //     * R.array.foo The list will have a check mark displayed to the right of the text for the
    //     * checked item. Clicking on an item in the list will not dismiss the dialog. Clicking on a
    //     * button will dismiss the dialog.
    //     *
    //     * @param itemsId the resource id of an array i.e. R.array.foo
    //     * @param checkedItem specifies which item is checked. If -1 no items are checked.
    //     * @param listener notified when an item on the list is clicked. The dialog will not be
    //     *        dismissed when an item is clicked. It will only be dismissed if clicked on a
    //     *        button, if no buttons are supplied it's up to the user to dismiss the dialog.
    //     *
    //     * @return This Builder object to allow for chaining of calls to set methods
    //     */
    //setSingleChoiceItems(itemsId:number, checkedItem:number, listener:OnClickListener):Builder  {
    //    this.P.mItems = this.P.mContext.getResources().getTextArray(itemsId);
    //    this.P.mOnClickListener = listener;
    //    this.P.mCheckedItem = checkedItem;
    //    this.P.mIsSingleChoice = true;
    //    return this;
    //}
    //
    ///**
    //     * Set a list of items to be displayed in the dialog as the content, you will be notified of
    //     * the selected item via the supplied listener. The list will have a check mark displayed to
    //     * the right of the text for the checked item. Clicking on an item in the list will not
    //     * dismiss the dialog. Clicking on a button will dismiss the dialog.
    //     *
    //     * @param cursor the cursor to retrieve the items from.
    //     * @param checkedItem specifies which item is checked. If -1 no items are checked.
    //     * @param labelColumn The column name on the cursor containing the string to display in the
    //     *        label.
    //     * @param listener notified when an item on the list is clicked. The dialog will not be
    //     *        dismissed when an item is clicked. It will only be dismissed if clicked on a
    //     *        button, if no buttons are supplied it's up to the user to dismiss the dialog.
    //     *
    //     * @return This Builder object to allow for chaining of calls to set methods
    //     */
    //setSingleChoiceItems(cursor:Cursor, checkedItem:number, labelColumn:string, listener:OnClickListener):Builder  {
    //    this.P.mCursor = cursor;
    //    this.P.mOnClickListener = listener;
    //    this.P.mCheckedItem = checkedItem;
    //    this.P.mLabelColumn = labelColumn;
    //    this.P.mIsSingleChoice = true;
    //    return this;
    //}

    /**
         * Set a list of items to be displayed in the dialog as the content, you will be notified of
         * the selected item via the supplied listener. The list will have a check mark displayed to
         * the right of the text for the checked item. Clicking on an item in the list will not
         * dismiss the dialog. Clicking on a button will dismiss the dialog.
         * 
         * @param items the items to be displayed.
         * @param checkedItem specifies which item is checked. If -1 no items are checked.
         * @param listener notified when an item on the list is clicked. The dialog will not be
         *        dismissed when an item is clicked. It will only be dismissed if clicked on a
         *        button, if no buttons are supplied it's up to the user to dismiss the dialog.
         *
         * @return This Builder object to allow for chaining of calls to set methods
         */
    setSingleChoiceItems(items:string[], checkedItem:number, listener:DialogInterface.OnClickListener):Builder  {
        this.P.mItems = items;
        this.P.mOnClickListener = listener;
        this.P.mCheckedItem = checkedItem;
        this.P.mIsSingleChoice = true;
        return this;
    }

    /**
         * Set a list of items to be displayed in the dialog as the content, you will be notified of
         * the selected item via the supplied listener. The list will have a check mark displayed to
         * the right of the text for the checked item. Clicking on an item in the list will not
         * dismiss the dialog. Clicking on a button will dismiss the dialog.
         * 
         * @param adapter The {@link ListAdapter} to supply the list of items
         * @param checkedItem specifies which item is checked. If -1 no items are checked.
         * @param listener notified when an item on the list is clicked. The dialog will not be
         *        dismissed when an item is clicked. It will only be dismissed if clicked on a
         *        button, if no buttons are supplied it's up to the user to dismiss the dialog.
         *
         * @return This Builder object to allow for chaining of calls to set methods
         */
    setSingleChoiceItemsWithAdapter(adapter:ListAdapter, checkedItem:number, listener:DialogInterface.OnClickListener):Builder  {
        this.P.mAdapter = adapter;
        this.P.mOnClickListener = listener;
        this.P.mCheckedItem = checkedItem;
        this.P.mIsSingleChoice = true;
        return this;
    }

    /**
         * Sets a listener to be invoked when an item in the list is selected.
         * 
         * @param listener The listener to be invoked.
         * @see AdapterView#setOnItemSelectedListener(android.widget.AdapterView.OnItemSelectedListener)
         *
         * @return This Builder object to allow for chaining of calls to set methods
         */
    setOnItemSelectedListener(listener:AdapterView.OnItemSelectedListener):Builder  {
        this.P.mOnItemSelectedListener = listener;
        return this;
    }

    ///**
    //     * Set a custom view to be the contents of the Dialog. If the supplied view is an instance
    //     * of a {@link ListView} the light background will be used.
    //     *
    //     * @param view The view to use as the contents of the Dialog.
    //     *
    //     * @return This Builder object to allow for chaining of calls to set methods
    //     */
    //setView(view:View):Builder  {
    //    this.P.mView = view;
    //    this.P.mViewSpacingSpecified = false;
    //    return this;
    //}

    /**
         * Set a custom view to be the contents of the Dialog, specifying the
         * spacing to appear around that view. If the supplied view is an
         * instance of a {@link ListView} the light background will be used.
         * 
         * @param view The view to use as the contents of the Dialog.
         * @param viewSpacingLeft Spacing between the left edge of the view and
         *        the dialog frame
         * @param viewSpacingTop Spacing between the top edge of the view and
         *        the dialog frame
         * @param viewSpacingRight Spacing between the right edge of the view
         *        and the dialog frame
         * @param viewSpacingBottom Spacing between the bottom edge of the view
         *        and the dialog frame
         * @return This Builder object to allow for chaining of calls to set
         *         methods
         *         
         * 
         * This is currently hidden because it seems like people should just
         * be able to put padding around the view.
         * @hide
         */
    setView(view:View, viewSpacingLeft=0, viewSpacingTop=0, viewSpacingRight=0, viewSpacingBottom=0):Builder  {
        this.P.mView = view;
        if(!viewSpacingLeft && !viewSpacingTop && !viewSpacingRight && !viewSpacingBottom){
            this.P.mViewSpacingSpecified = false;
        }else{
            this.P.mViewSpacingSpecified = true;
            this.P.mViewSpacingLeft = viewSpacingLeft;
            this.P.mViewSpacingTop = viewSpacingTop;
            this.P.mViewSpacingRight = viewSpacingRight;
            this.P.mViewSpacingBottom = viewSpacingBottom;
        }
        return this;
    }

    /**
         * Sets the Dialog to use the inverse background, regardless of what the
         * contents is.
         * 
         * @param useInverseBackground Whether to use the inverse background
         * 
         * @return This Builder object to allow for chaining of calls to set methods
         */
    setInverseBackgroundForced(useInverseBackground:boolean):Builder  {
        this.P.mForceInverseBackground = useInverseBackground;
        return this;
    }

    /**
         * @hide
         */
    setRecycleOnMeasureEnabled(enabled:boolean):Builder  {
        this.P.mRecycleOnMeasure = enabled;
        return this;
    }

    /**
         * Creates a {@link AlertDialog} with the arguments supplied to this builder. It does not
         * {@link Dialog#show()} the dialog. This allows the user to do any extra processing
         * before displaying the dialog. Use {@link #show()} if you don't have any other processing
         * to do and want this to be created and displayed.
         */
    create():AlertDialog  {
        const dialog:AlertDialog = new AlertDialog(this.P.mContext);
        this.P.apply(dialog.mAlert);
        dialog.setCancelable(this.P.mCancelable);
        if (this.P.mCancelable) {
            dialog.setCanceledOnTouchOutside(true);
        }
        dialog.setOnCancelListener(this.P.mOnCancelListener);
        dialog.setOnDismissListener(this.P.mOnDismissListener);
        if (this.P.mOnKeyListener != null) {
            dialog.setOnKeyListener(this.P.mOnKeyListener);
        }
        return dialog;
    }

    /**
         * Creates a {@link AlertDialog} with the arguments supplied to this builder and
         * {@link Dialog#show()}'s the dialog.
         */
    show():AlertDialog  {
        let dialog:AlertDialog = this.create();
        dialog.show();
        return dialog;
    }
}
}

}
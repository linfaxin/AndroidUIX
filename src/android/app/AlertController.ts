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

///<reference path="../../android/app/AlertDialog.ts"/>
///<reference path="../../android/content/DialogInterface.ts"/>
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/graphics/drawable/ColorDrawable.ts"/>
///<reference path="../../android/graphics/Color.ts"/>
///<reference path="../../android/os/Handler.ts"/>
///<reference path="../../android/os/Message.ts"/>
///<reference path="../../android/text/TextUtils.ts"/>
///<reference path="../../android/util/TypedValue.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/view/KeyEvent.ts"/>
///<reference path="../../android/view/LayoutInflater.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/view/Window.ts"/>
///<reference path="../../android/view/WindowManager.ts"/>
///<reference path="../../android/widget/AdapterView.ts"/>
///<reference path="../../android/widget/ArrayAdapter.ts"/>
///<reference path="../../android/widget/Button.ts"/>
///<reference path="../../android/widget/FrameLayout.ts"/>
///<reference path="../../android/widget/ImageView.ts"/>
///<reference path="../../android/widget/LinearLayout.ts"/>
///<reference path="../../android/widget/ListAdapter.ts"/>
///<reference path="../../android/widget/ListView.ts"/>
///<reference path="../../android/widget/ScrollView.ts"/>
///<reference path="../../android/widget/TextView.ts"/>
///<reference path="../../java/lang/ref/WeakReference.ts"/>
///<reference path="../../android/app/AlertDialog.ts"/>
///<reference path="../../android/app/Dialog.ts"/>
///<reference path="../../android/content/Context.ts"/>
///<reference path="../../android/R/layout.ts"/>
///<reference path="../../android/R/id.ts"/>

module android.app {
    const MATCH_PARENT = android.view.ViewGroup.LayoutParams.MATCH_PARENT;
    import R = android.R;
    import AlertDialog = android.app.AlertDialog;
    import DialogInterface = android.content.DialogInterface;
    import Drawable = android.graphics.drawable.Drawable;
    import ColorDrawable = android.graphics.drawable.ColorDrawable;
    import Color = android.graphics.Color;
    import Handler = android.os.Handler;
    import Message = android.os.Message;
    import TextUtils = android.text.TextUtils;
    import TypedValue = android.util.TypedValue;
    import Gravity = android.view.Gravity;
    import KeyEvent = android.view.KeyEvent;
    import LayoutInflater = android.view.LayoutInflater;
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import LayoutParams = android.view.ViewGroup.LayoutParams;
    import Window = android.view.Window;
    import WindowManager = android.view.WindowManager;
    import AdapterView = android.widget.AdapterView;
    import OnItemClickListener = android.widget.AdapterView.OnItemClickListener;
    import ArrayAdapter = android.widget.ArrayAdapter;
    import Button = android.widget.Button;
    import FrameLayout = android.widget.FrameLayout;
    import ImageView = android.widget.ImageView;
    import LinearLayout = android.widget.LinearLayout;
    import ListAdapter = android.widget.ListAdapter;
    import ListView = android.widget.ListView;
    import ScrollView = android.widget.ScrollView;
    import TextView = android.widget.TextView;
    import WeakReference = java.lang.ref.WeakReference;
    import Dialog = android.app.Dialog;
    import Context = android.content.Context;

    export class AlertController {

        private mContext:Context;

        private mDialogInterface:DialogInterface;

        private mWindow:Window;

        private mTitle:string;

        private mMessage:string;

        private mListView:ListView;

        private mView:View;

        private mViewSpacingLeft:number = 0;

        private mViewSpacingTop:number = 0;

        private mViewSpacingRight:number = 0;

        private mViewSpacingBottom:number = 0;

        private mViewSpacingSpecified:boolean = false;

        private mButtonPositive:Button;

        private mButtonPositiveText:string;

        private mButtonPositiveMessage:Message;

        private mButtonNegative:Button;

        private mButtonNegativeText:string;

        private mButtonNegativeMessage:Message;

        private mButtonNeutral:Button;

        private mButtonNeutralText:string;

        private mButtonNeutralMessage:Message;

        private mScrollView:ScrollView;

        //private mIconId:number = -1;

        private mIcon:Drawable;

        private mIconView:ImageView;

        private mTitleView:TextView;

        private mMessageView:TextView;

        private mCustomTitleView:View;

        private mForceInverseBackground:boolean;

        private mAdapter:ListAdapter;

        private mCheckedItem:number = -1;

        private mAlertDialogLayout:string;

        private mListLayout:string;

        private mMultiChoiceItemLayout:string;

        private mSingleChoiceItemLayout:string;

        private mListItemLayout:string;

        private mHandler:Handler;

        mButtonHandler:View.OnClickListener = (()=> {
            const _this = this;
            class _Inner implements View.OnClickListener {

                onClick(v:View):void {
                    let m:Message = null;
                    if (v == _this.mButtonPositive && _this.mButtonPositiveMessage != null) {
                        m = Message.obtain(_this.mButtonPositiveMessage);
                    } else if (v == _this.mButtonNegative && _this.mButtonNegativeMessage != null) {
                        m = Message.obtain(_this.mButtonNegativeMessage);
                    } else if (v == _this.mButtonNeutral && _this.mButtonNeutralMessage != null) {
                        m = Message.obtain(_this.mButtonNeutralMessage);
                    }
                    if (m != null) {
                        m.sendToTarget();
                    }
                    // Post a message so we dismiss after the above handlers are executed
                    _this.mHandler.obtainMessage(AlertController.ButtonHandler.MSG_DISMISS_DIALOG, _this.mDialogInterface).sendToTarget();
                }
            }
            return new _Inner();
        })();


        private static shouldCenterSingleButton(context:Context):boolean {
            return true;
            //let outValue:TypedValue = new TypedValue();
            //context.getTheme().resolveAttribute(android.R.attr.alertDialogCenterButtons, outValue, true);
            //return outValue.data != 0;
        }

        constructor(context:Context, di:DialogInterface, window:Window) {
            this.mContext = context;
            this.mDialogInterface = di;
            this.mWindow = window;
            this.mHandler = new AlertController.ButtonHandler(di);
            //let a:TypedArray = context.obtainStyledAttributes(null, com.android.internal.R.styleable.AlertDialog, com.android.internal.R.attr.alertDialogStyle, 0);
            this.mAlertDialogLayout = R.layout.alert_dialog;
            this.mListLayout = R.layout.select_dialog;
            this.mMultiChoiceItemLayout = R.layout.select_dialog_multichoice;
            this.mSingleChoiceItemLayout = R.layout.select_dialog_singlechoice;
            this.mListItemLayout = R.layout.select_dialog_item;
            //a.recycle();
        }

        //static canTextInput(v:View):boolean  {
        //    if (v.onCheckIsTextEditor()) {
        //        return true;
        //    }
        //    if (!(v instanceof ViewGroup)) {
        //        return false;
        //    }
        //    let vg:ViewGroup = <ViewGroup> v;
        //    let i:number = vg.getChildCount();
        //    while (i > 0) {
        //        i--;
        //        v = vg.getChildAt(i);
        //        if (AlertController.canTextInput(v)) {
        //            return true;
        //        }
        //    }
        //    return false;
        //}

        installContent():void {
            /* We use a custom title so never request a window title */
            //this.mWindow.requestFeature(Window.FEATURE_NO_TITLE);
            //if (this.mView == null || !AlertController.canTextInput(this.mView)) {
            //    this.mWindow.setFlags(WindowManager.LayoutParams.FLAG_ALT_FOCUSABLE_IM, WindowManager.LayoutParams.FLAG_ALT_FOCUSABLE_IM);
            //}
            let layout = this.mContext.getLayoutInflater().inflate(this.mAlertDialogLayout, this.mWindow.getContentParent(), false);
            this.mWindow.setContentView(layout);
            this.setupView();
        }

        setTitle(title:string):void {
            this.mTitle = title;
            if (this.mTitleView != null) {
                this.mTitleView.setText(title);
            }
        }

        /**
         * @see AlertDialog.Builder#setCustomTitle(View)
         */
        setCustomTitle(customTitleView:View):void {
            this.mCustomTitleView = customTitleView;
        }

        setMessage(message:string):void {
            this.mMessage = message;
            if (this.mMessageView != null) {
                this.mMessageView.setText(message);
            }
        }

        ///**
        // * Set the view to display in the dialog.
        // */
        //setView(view:View):void  {
        //    this.mView = view;
        //    this.mViewSpacingSpecified = false;
        //}

        /**
         * Set the view to display in the dialog along with the spacing around that view
         */
        setView(view:View, viewSpacingLeft = 0, viewSpacingTop = 0, viewSpacingRight = 0, viewSpacingBottom = 0):void {
            this.mView = view;
            if (!viewSpacingLeft && !viewSpacingTop && !viewSpacingRight && !viewSpacingBottom) {
                this.mViewSpacingSpecified = false;
            } else {
                this.mViewSpacingSpecified = true;
                this.mViewSpacingLeft = viewSpacingLeft;
                this.mViewSpacingTop = viewSpacingTop;
                this.mViewSpacingRight = viewSpacingRight;
                this.mViewSpacingBottom = viewSpacingBottom;
            }
        }

        /**
         * Sets a click listener or a message to be sent when the button is clicked.
         * You only need to pass one of {@code listener} or {@code msg}.
         *
         * @param whichButton Which button, can be one of
         *            {@link DialogInterface#BUTTON_POSITIVE},
         *            {@link DialogInterface#BUTTON_NEGATIVE}, or
         *            {@link DialogInterface#BUTTON_NEUTRAL}
         * @param text The text to display in positive button.
         * @param listener The {@link DialogInterface.OnClickListener} to use.
         * @param msg The {@link Message} to be sent when clicked.
         */
        setButton(whichButton:number, text:string, listener:DialogInterface.OnClickListener, msg:Message):void {
            if (msg == null && listener != null) {
                msg = this.mHandler.obtainMessage(whichButton, listener);
            }
            switch (whichButton) {
                case DialogInterface.BUTTON_POSITIVE:
                    this.mButtonPositiveText = text;
                    this.mButtonPositiveMessage = msg;
                    break;
                case DialogInterface.BUTTON_NEGATIVE:
                    this.mButtonNegativeText = text;
                    this.mButtonNegativeMessage = msg;
                    break;
                case DialogInterface.BUTTON_NEUTRAL:
                    this.mButtonNeutralText = text;
                    this.mButtonNeutralMessage = msg;
                    break;
                default:
                    throw Error(`new IllegalArgumentException("Button does not exist")`);
            }
        }

        /**
         * Set resId to 0 if you don't want an icon.
         * @param resId the resourceId of the drawable to use as the icon or 0
         * if you don't want an icon.
         */
        //setIcon(resId:number):void  {
        //    this.mIconId = resId;
        //    if (this.mIconView != null) {
        //        if (resId > 0) {
        //            this.mIconView.setImageResource(this.mIconId);
        //        } else if (resId == 0) {
        //            this.mIconView.setVisibility(View.GONE);
        //        }
        //    }
        //}
        setIcon(icon:Drawable):void {
            this.mIcon = icon;
            if ((this.mIconView != null) && (this.mIcon != null)) {
                this.mIconView.setImageDrawable(icon);
            }
        }

        ///**
        // * @param attrId the attributeId of the theme-specific drawable
        // * to resolve the resourceId for.
        // *
        // * @return resId the resourceId of the theme-specific drawable
        // */
        //getIconAttributeResId(attrId:number):number  {
        //    let out:TypedValue = new TypedValue();
        //    this.mContext.getTheme().resolveAttribute(attrId, out, true);
        //    return out.resourceId;
        //}

        setInverseBackgroundForced(forceInverseBackground:boolean):void {
            this.mForceInverseBackground = forceInverseBackground;
        }

        getListView():ListView {
            return this.mListView;
        }

        getButton(whichButton:number):Button {
            switch (whichButton) {
                case DialogInterface.BUTTON_POSITIVE:
                    return this.mButtonPositive;
                case DialogInterface.BUTTON_NEGATIVE:
                    return this.mButtonNegative;
                case DialogInterface.BUTTON_NEUTRAL:
                    return this.mButtonNeutral;
                default:
                    return null;
            }
        }

        onKeyDown(keyCode:number, event:KeyEvent):boolean {
            return this.mScrollView != null && this.mScrollView.executeKeyEvent(event);
        }

        onKeyUp(keyCode:number, event:KeyEvent):boolean {
            return this.mScrollView != null && this.mScrollView.executeKeyEvent(event);
        }

        private setupView():void {
            let contentPanel:LinearLayout = <LinearLayout> this.mWindow.findViewById(R.id.contentPanel);
            this.setupContent(contentPanel);
            let hasButtons:boolean = this.setupButtons();
            let topPanel:LinearLayout = <LinearLayout> this.mWindow.findViewById(R.id.topPanel);
            //let a:TypedArray = this.mContext.obtainStyledAttributes(null, com.android.internal.R.styleable.AlertDialog, com.android.internal.R.attr.alertDialogStyle, 0);
            let hasTitle:boolean = this.setupTitle(topPanel);
            let buttonPanel:View = this.mWindow.findViewById(R.id.buttonPanel);
            if (!hasButtons) {
                buttonPanel.setVisibility(View.GONE);
                this.mWindow.setCloseOnTouchOutsideIfNotSet(true);
            }
            let customPanel:FrameLayout = null;
            if (this.mView != null) {
                customPanel = <FrameLayout> this.mWindow.findViewById(R.id.customPanel);
                let custom:FrameLayout = <FrameLayout> this.mWindow.findViewById(R.id.custom);
                custom.addView(this.mView, new LayoutParams(MATCH_PARENT, MATCH_PARENT));
                if (this.mViewSpacingSpecified) {
                    custom.setPadding(this.mViewSpacingLeft, this.mViewSpacingTop, this.mViewSpacingRight, this.mViewSpacingBottom);
                }
                if (this.mListView != null) {
                    (<LinearLayout.LayoutParams> customPanel.getLayoutParams()).weight = 0;
                }
            } else {
                this.mWindow.findViewById(R.id.customPanel).setVisibility(View.GONE);
            }
            /* Only display the divider if we have a title and a
             * custom view or a message.
             */
            if (hasTitle) {
                let divider:View = null;
                if (this.mMessage != null || this.mView != null || this.mListView != null) {
                    divider = this.mWindow.findViewById(R.id.titleDivider);
                } else {
                    divider = this.mWindow.findViewById(R.id.titleDividerTop);
                }
                if (divider != null) {
                    divider.setVisibility(View.VISIBLE);
                }
            }
            this.setBackground(topPanel, contentPanel, customPanel, hasButtons, hasTitle, buttonPanel);
            //a.recycle();
        }

        private setupTitle(topPanel:LinearLayout):boolean {
            let hasTitle:boolean = true;
            if (this.mCustomTitleView != null) {
                // Add the custom title view directly to the topPanel layout
                let lp:LinearLayout.LayoutParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
                topPanel.addView(this.mCustomTitleView, 0, lp);
                // Hide the title template
                let titleTemplate:View = this.mWindow.findViewById(R.id.title_template);
                titleTemplate.setVisibility(View.GONE);
            } else {
                const hasTextTitle:boolean = !TextUtils.isEmpty(this.mTitle);
                this.mIconView = <ImageView> this.mWindow.findViewById(R.id.icon);
                if (hasTextTitle) {
                    /* Display the title if a title is supplied, else hide it */
                    this.mTitleView = <TextView> this.mWindow.findViewById(R.id.alertTitle);
                    this.mTitleView.setText(this.mTitle);
                    /* Do this last so that if the user has supplied any
                     * icons we use them instead of the default ones. If the
                     * user has specified 0 then make it disappear.
                     */
                    //if (this.mIconId > 0) {
                    //    this.mIconView.setImageResource(this.mIconId);
                    //} else
                    if (this.mIcon != null) {
                        this.mIconView.setImageDrawable(this.mIcon);
                    } else
                    //if (this.mIconId == 0)
                    {
                        /* Apply the padding from the icon to ensure the
                         * title is aligned correctly.
                         */
                        this.mTitleView.setPadding(this.mIconView.getPaddingLeft(), this.mIconView.getPaddingTop(), this.mIconView.getPaddingRight(), this.mIconView.getPaddingBottom());
                        this.mIconView.setVisibility(View.GONE);
                    }
                } else {
                    // Hide the title template
                    let titleTemplate:View = this.mWindow.findViewById(R.id.title_template);
                    titleTemplate.setVisibility(View.GONE);
                    this.mIconView.setVisibility(View.GONE);
                    topPanel.setVisibility(View.GONE);
                    hasTitle = false;
                }
            }
            return hasTitle;
        }

        private setupContent(contentPanel:LinearLayout):void {
            this.mScrollView = <ScrollView> this.mWindow.findViewById(R.id.scrollView);
            this.mScrollView.setFocusable(false);
            // Special case for users that only want to display a String
            this.mMessageView = <TextView> this.mWindow.findViewById(R.id.message);
            if (this.mMessageView == null) {
                return;
            }
            if (this.mMessage != null) {
                this.mMessageView.setText(this.mMessage);
            } else {
                this.mMessageView.setVisibility(View.GONE);
                this.mScrollView.removeView(this.mMessageView);
                if (this.mListView != null) {
                    contentPanel.removeView(this.mWindow.findViewById(R.id.scrollView));
                    contentPanel.addView(this.mListView, new LinearLayout.LayoutParams(MATCH_PARENT, MATCH_PARENT));
                    contentPanel.setLayoutParams(new LinearLayout.LayoutParams(MATCH_PARENT, 0, 1.0));
                } else {
                    contentPanel.setVisibility(View.GONE);
                }
            }
        }

        private setupButtons():boolean {
            let BIT_BUTTON_POSITIVE:number = 1;
            let BIT_BUTTON_NEGATIVE:number = 2;
            let BIT_BUTTON_NEUTRAL:number = 4;
            let whichButtons:number = 0;
            this.mButtonPositive = <Button> this.mWindow.findViewById(R.id.button1);
            this.mButtonPositive.setOnClickListener(this.mButtonHandler);
            if (TextUtils.isEmpty(this.mButtonPositiveText)) {
                this.mButtonPositive.setVisibility(View.GONE);
            } else {
                this.mButtonPositive.setText(this.mButtonPositiveText);
                this.mButtonPositive.setVisibility(View.VISIBLE);
                whichButtons = whichButtons | BIT_BUTTON_POSITIVE;
            }
            this.mButtonNegative = <Button> this.mWindow.findViewById(R.id.button2);
            this.mButtonNegative.setOnClickListener(this.mButtonHandler);
            if (TextUtils.isEmpty(this.mButtonNegativeText)) {
                this.mButtonNegative.setVisibility(View.GONE);
            } else {
                this.mButtonNegative.setText(this.mButtonNegativeText);
                this.mButtonNegative.setVisibility(View.VISIBLE);
                whichButtons = whichButtons | BIT_BUTTON_NEGATIVE;
            }
            this.mButtonNeutral = <Button> this.mWindow.findViewById(R.id.button3);
            this.mButtonNeutral.setOnClickListener(this.mButtonHandler);
            if (TextUtils.isEmpty(this.mButtonNeutralText)) {
                this.mButtonNeutral.setVisibility(View.GONE);
            } else {
                this.mButtonNeutral.setText(this.mButtonNeutralText);
                this.mButtonNeutral.setVisibility(View.VISIBLE);
                whichButtons = whichButtons | BIT_BUTTON_NEUTRAL;
            }
            if (AlertController.shouldCenterSingleButton(this.mContext)) {
                /*
                 * If we only have 1 button it should be centered on the layout and
                 * expand to fill 50% of the available space.
                 */
                if (whichButtons == BIT_BUTTON_POSITIVE) {
                    this.centerButton(this.mButtonPositive);
                } else if (whichButtons == BIT_BUTTON_NEGATIVE) {
                    this.centerButton(this.mButtonNegative);
                } else if (whichButtons == BIT_BUTTON_NEUTRAL) {
                    this.centerButton(this.mButtonNeutral);
                }
            }
            return whichButtons != 0;
        }

        private centerButton(button:Button):void {
            let params:LinearLayout.LayoutParams = <LinearLayout.LayoutParams> button.getLayoutParams();
            params.gravity = Gravity.CENTER_HORIZONTAL;
            params.weight = 0.5;
            button.setLayoutParams(params);
            let leftSpacer:View = this.mWindow.findViewById(R.id.leftSpacer);
            if (leftSpacer != null) {
                leftSpacer.setVisibility(View.VISIBLE);
            }
            let rightSpacer:View = this.mWindow.findViewById(R.id.rightSpacer);
            if (rightSpacer != null) {
                rightSpacer.setVisibility(View.VISIBLE);
            }
        }

        private setBackground(topPanel:LinearLayout, contentPanel:LinearLayout, customPanel:View, hasButtons:boolean, hasTitle:boolean, buttonPanel:View):void {
            /* Get all the different background required */
            let fullDark:Drawable = R.image.popup_full_bright;//R.drawable.popup_full_dark;
            let topDark:Drawable = R.image.popup_top_bright;//R.drawable.popup_top_dark;
            let centerDark:Drawable = R.image.popup_center_bright;//R.drawable.popup_center_dark;
            let bottomDark:Drawable = R.image.popup_bottom_bright;//R.drawable.popup_bottom_dark;
            let fullBright:Drawable = R.image.popup_full_bright;
            let topBright:Drawable = R.image.popup_top_bright;
            let centerBright:Drawable = R.image.popup_center_bright;
            let bottomBright:Drawable = R.image.popup_bottom_bright;
            let bottomMedium:Drawable = R.image.popup_bottom_bright;//R.drawable.popup_bottom_medium;
            /*
             * We now set the background of all of the sections of the alert.
             * First collect together each section that is being displayed along
             * with whether it is on a light or dark background, then run through
             * them setting their backgrounds.  This is complicated because we need
             * to correctly use the full, top, middle, and bottom graphics depending
             * on how many views they are and where they appear.
             */
            let views:View[] = new Array<View>(4);
            let light:boolean[] = new Array<boolean>(4);
            let lastView:View = null;
            let lastLight:boolean = false;
            let pos:number = 0;
            if (hasTitle) {
                views[pos] = topPanel;
                light[pos] = false;
                pos++;
            }
            /* The contentPanel displays either a custom text message or
             * a ListView. If it's text we should use the dark background
             * for ListView we should use the light background. If neither
             * are there the contentPanel will be hidden so set it as null.
             */
            views[pos] = (contentPanel.getVisibility() == View.GONE) ? null : contentPanel;
            light[pos] = this.mListView != null;
            pos++;
            if (customPanel != null) {
                views[pos] = customPanel;
                light[pos] = this.mForceInverseBackground;
                pos++;
            }
            if (hasButtons) {
                views[pos] = buttonPanel;
                light[pos] = true;
            }
            let setView:boolean = false;
            for (pos = 0; pos < views.length; pos++) {
                let v:View = views[pos];
                if (v == null) {
                    continue;
                }
                if (lastView != null) {
                    if (!setView) {
                        lastView.setBackground(lastLight ? topBright : topDark);
                    } else {
                        lastView.setBackground(lastLight ? centerBright : centerDark);
                    }
                    setView = true;
                }
                lastView = v;
                lastLight = light[pos];
            }
            if (lastView != null) {
                if (setView) {
                    /* ListViews will use the Bright background but buttons use
                     * the Medium background.
                     */
                    lastView.setBackground(lastLight ? (hasButtons ? bottomMedium : bottomBright) : bottomDark);
                } else {
                    lastView.setBackground(lastLight ? fullBright : fullDark);
                }
            }
            if ((this.mListView != null) && (this.mAdapter != null)) {
                this.mListView.setAdapter(this.mAdapter);
                if (this.mCheckedItem > -1) {
                    this.mListView.setItemChecked(this.mCheckedItem, true);
                    this.mListView.setSelection(this.mCheckedItem);
                }
            }
        }


    }

    export module AlertController {
        export class ButtonHandler extends Handler {

            // Button clicks have Message.what as the BUTTON{1,2,3} constant
            private static MSG_DISMISS_DIALOG:number = 1;

            private mDialog:WeakReference<DialogInterface>;

            constructor(dialog:DialogInterface) {
                super();
                this.mDialog = new WeakReference<DialogInterface>(dialog);
            }

            handleMessage(msg:Message):void {
                switch (msg.what) {
                    case DialogInterface.BUTTON_POSITIVE:
                    case DialogInterface.BUTTON_NEGATIVE:
                    case DialogInterface.BUTTON_NEUTRAL:
                        (<DialogInterface.OnClickListener> msg.obj).onClick(this.mDialog.get(), msg.what);
                        break;
                    case ButtonHandler.MSG_DISMISS_DIALOG:
                        (<DialogInterface> msg.obj).dismiss();
                }
            }
        }
        export class RecycleListView extends ListView {

            mRecycleOnMeasure:boolean = true;

            constructor(context:Context, bindElement?:HTMLElement, defStyle?:Map<string, string>) {
                super(context, bindElement, defStyle);
            }

            protected recycleOnMeasure():boolean {
                return this.mRecycleOnMeasure;
            }
        }
        export class AlertParams {

            mContext:Context;

            mInflater:LayoutInflater;

            mIconId:number = 0;

            mIcon:Drawable;

            //mIconAttrId:number = 0;

            mTitle:string;

            mCustomTitleView:View;

            mMessage:string;

            mPositiveButtonText:string;

            mPositiveButtonListener:DialogInterface.OnClickListener;

            mNegativeButtonText:string;

            mNegativeButtonListener:DialogInterface.OnClickListener;

            mNeutralButtonText:string;

            mNeutralButtonListener:DialogInterface.OnClickListener;

            mCancelable:boolean;

            mOnCancelListener:DialogInterface.OnCancelListener;

            mOnDismissListener:DialogInterface.OnDismissListener;

            mOnKeyListener:DialogInterface.OnKeyListener;

            mItems:string[];

            mAdapter:ListAdapter;

            mOnClickListener:DialogInterface.OnClickListener;

            mView:View;

            mViewSpacingLeft:number = 0;

            mViewSpacingTop:number = 0;

            mViewSpacingRight:number = 0;

            mViewSpacingBottom:number = 0;

            mViewSpacingSpecified:boolean = false;

            mCheckedItems:boolean[];

            mIsMultiChoice:boolean;

            mIsSingleChoice:boolean;

            mCheckedItem:number = -1;

            mOnCheckboxClickListener:DialogInterface.OnMultiChoiceClickListener;

            //mCursor:Cursor;

            mLabelColumn:string;

            mIsCheckedColumn:string;

            mForceInverseBackground:boolean;

            mOnItemSelectedListener:AdapterView.OnItemSelectedListener;

            mOnPrepareListViewListener:AlertParams.OnPrepareListViewListener;

            mRecycleOnMeasure:boolean = true;


            constructor(context:Context) {
                this.mContext = context;
                this.mCancelable = true;
                this.mInflater = context.getLayoutInflater();//<LayoutInflater> context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            }

            apply(dialog:AlertController):void {
                if (this.mCustomTitleView != null) {
                    dialog.setCustomTitle(this.mCustomTitleView);
                } else {
                    if (this.mTitle != null) {
                        dialog.setTitle(this.mTitle);
                    }
                    if (this.mIcon != null) {
                        dialog.setIcon(this.mIcon);
                    }
                    //if (this.mIconId >= 0) {
                    //    dialog.setIcon(this.mIconId);
                    //}
                    //if (this.mIconAttrId > 0) {
                    //    dialog.setIcon(dialog.getIconAttributeResId(this.mIconAttrId));
                    //}
                }
                if (this.mMessage != null) {
                    dialog.setMessage(this.mMessage);
                }
                if (this.mPositiveButtonText != null) {
                    dialog.setButton(DialogInterface.BUTTON_POSITIVE, this.mPositiveButtonText, this.mPositiveButtonListener, null);
                }
                if (this.mNegativeButtonText != null) {
                    dialog.setButton(DialogInterface.BUTTON_NEGATIVE, this.mNegativeButtonText, this.mNegativeButtonListener, null);
                }
                if (this.mNeutralButtonText != null) {
                    dialog.setButton(DialogInterface.BUTTON_NEUTRAL, this.mNeutralButtonText, this.mNeutralButtonListener, null);
                }
                if (this.mForceInverseBackground) {
                    dialog.setInverseBackgroundForced(true);
                }
                // adapter or a cursor
                if ((this.mItems != null) /*|| (this.mCursor != null)*/ || (this.mAdapter != null)) {
                    this.createListView(dialog);
                }
                if (this.mView != null) {
                    if (this.mViewSpacingSpecified) {
                        dialog.setView(this.mView, this.mViewSpacingLeft, this.mViewSpacingTop, this.mViewSpacingRight, this.mViewSpacingBottom);
                    } else {
                        dialog.setView(this.mView);
                    }
                }
                /*
                 dialog.setCancelable(mCancelable);
                 dialog.setOnCancelListener(mOnCancelListener);
                 if (mOnKeyListener != null) {
                 dialog.setOnKeyListener(mOnKeyListener);
                 }
                 */
            }

            private createListView(dialog:AlertController):void {
                const listView:AlertController.RecycleListView = <AlertController.RecycleListView> this.mInflater.inflate(dialog.mListLayout, null);
                let adapter:ListAdapter;
                if (this.mIsMultiChoice) {
                    //if (this.mCursor == null) {
                    adapter = (()=> {
                        const _this = this;
                        class _Inner extends ArrayAdapter<string> {
                            getView(position:number, convertView:View, parent:ViewGroup):View {
                                let view:View = super.getView(position, convertView, parent);
                                if (_this.mCheckedItems != null) {
                                    let isItemChecked:boolean = _this.mCheckedItems[position];
                                    if (isItemChecked) {
                                        listView.setItemChecked(position, true);
                                    }
                                }
                                return view;
                            }
                        }
                        return new _Inner(this.mContext, dialog.mMultiChoiceItemLayout, R.id.text1, this.mItems);
                    })();
                    //} else {
                    //    adapter = (()=>{
                    //        const _this=this;
                    //        class _Inner extends CursorAdapter {
                    //
                    //            private mLabelIndex:number = 0;
                    //
                    //            private mIsCheckedIndex:number = 0;
                    //
                    //            {
                    //                const cursor:Cursor = this.getCursor();
                    //                mLabelIndex = cursor.getColumnIndexOrThrow(_this.mLabelColumn);
                    //                mIsCheckedIndex = cursor.getColumnIndexOrThrow(_this.mIsCheckedColumn);
                    //            }
                    //
                    //            bindView(view:View, context:Context, cursor:Cursor):void  {
                    //                let text:CheckedTextView = <CheckedTextView> view.findViewById(R.id.text1);
                    //                text.setText(cursor.getString(mLabelIndex));
                    //                listView.setItemChecked(cursor.getPosition(), cursor.getInt(mIsCheckedIndex) == 1);
                    //            }
                    //
                    //            newView(context:Context, cursor:Cursor, parent:ViewGroup):View  {
                    //                return _this.mInflater.inflate(dialog.mMultiChoiceItemLayout, parent, false);
                    //            }
                    //        }
                    //        return new _Inner(this.mContext, this.mCursor, false);
                    //    })();
                    //}
                } else {
                    let layout:string = this.mIsSingleChoice ? dialog.mSingleChoiceItemLayout : dialog.mListItemLayout;
                    //if (this.mCursor == null) {
                    adapter = (this.mAdapter != null) ? this.mAdapter : new ArrayAdapter<string>(this.mContext, layout, R.id.text1, this.mItems);
                    //} else {
                    //    adapter = new SimpleCursorAdapter(this.mContext, layout, this.mCursor,  [ this.mLabelColumn ],  [ R.id.text1 ]);
                    //}
                }
                if (this.mOnPrepareListViewListener != null) {
                    this.mOnPrepareListViewListener.onPrepareListView(listView);
                }
                /* Don't directly set the adapter on the ListView as we might
                 * want to add a footer to the ListView later.
                 */
                dialog.mAdapter = adapter;
                dialog.mCheckedItem = this.mCheckedItem;
                const _this = this;
                if (this.mOnClickListener != null) {
                    listView.setOnItemClickListener({
                        onItemClick(parent:AdapterView<any>, v:View, position:number, id:number):void {
                            _this.mOnClickListener.onClick(dialog.mDialogInterface, position);
                            if (!_this.mIsSingleChoice) {
                                dialog.mDialogInterface.dismiss();
                            }
                        }
                    });
                } else if (this.mOnCheckboxClickListener != null) {
                    listView.setOnItemClickListener({
                        onItemClick(parent:AdapterView<any>, v:View, position:number, id:number):void {
                            if (_this.mCheckedItems != null) {
                                _this.mCheckedItems[position] = listView.isItemChecked(position);
                            }
                            _this.mOnCheckboxClickListener.onClick(dialog.mDialogInterface, position, listView.isItemChecked(position));
                        }
                    });
                }
                // Attach a given OnItemSelectedListener to the ListView
                if (this.mOnItemSelectedListener != null) {
                    listView.setOnItemSelectedListener(this.mOnItemSelectedListener);
                }
                if (this.mIsSingleChoice) {
                    listView.setChoiceMode(ListView.CHOICE_MODE_SINGLE);
                } else if (this.mIsMultiChoice) {
                    listView.setChoiceMode(ListView.CHOICE_MODE_MULTIPLE);
                }
                listView.mRecycleOnMeasure = this.mRecycleOnMeasure;
                dialog.mListView = listView;
            }
        }

        export module AlertParams {
            /**
             * Interface definition for a callback to be invoked before the ListView
             * will be bound to an adapter.
             */
            export interface OnPrepareListViewListener {

                /**
                 * Called before the ListView is bound to an adapter.
                 * @param listView The ListView that will be shown in the dialog.
                 */
                onPrepareListView(listView:ListView):void ;
            }
        }

    }

}
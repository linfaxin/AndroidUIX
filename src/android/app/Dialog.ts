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

///<reference path="../../android/content/DialogInterface.ts"/>
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/os/Bundle.ts"/>
///<reference path="../../android/os/Handler.ts"/>
///<reference path="../../android/os/Message.ts"/>
///<reference path="../../android/util/Log.ts"/>
///<reference path="../../android/util/TypedValue.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/view/KeyEvent.ts"/>
///<reference path="../../android/view/LayoutInflater.ts"/>
///<reference path="../../android/view/MotionEvent.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/view/Window.ts"/>
///<reference path="../../android/view/WindowManager.ts"/>
///<reference path="../../java/lang/ref/WeakReference.ts"/>
///<reference path="../../android/app/Activity.ts"/>
///<reference path="../../android/app/Application.ts"/>
///<reference path="../../android/content/Context.ts"/>

module android.app {
    import DialogInterface = android.content.DialogInterface;
    import Drawable = android.graphics.drawable.Drawable;
    import Bundle = android.os.Bundle;
    import Handler = android.os.Handler;
    import Message = android.os.Message;
    import Log = android.util.Log;
    import TypedValue = android.util.TypedValue;
    import Gravity = android.view.Gravity;
    import KeyEvent = android.view.KeyEvent;
    import LayoutInflater = android.view.LayoutInflater;
    import MotionEvent = android.view.MotionEvent;
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import LayoutParams = android.view.ViewGroup.LayoutParams;
    import Window = android.view.Window;
    import WindowManager = android.view.WindowManager;
    import WeakReference = java.lang.ref.WeakReference;
    import Activity = android.app.Activity;
    import Application = android.app.Application;
    import Context = android.content.Context;
    import Runnable = java.lang.Runnable;

    /**
     * Base class for Dialogs.
     *
     * <p>Note: Activities provide a facility to manage the creation, saving and
     * restoring of dialogs. See {@link Activity#onCreateDialog(int)},
     * {@link Activity#onPrepareDialog(int, Dialog)},
     * {@link Activity#showDialog(int)}, and {@link Activity#dismissDialog(int)}. If
     * these methods are used, {@link #getOwnerActivity()} will return the Activity
     * that managed this dialog.
     *
     * <p>Often you will want to have a Dialog display on top of the current
     * input method, because there is no reason for it to accept text.  You can
     * do this by setting the {@link WindowManager.LayoutParams#FLAG_ALT_FOCUSABLE_IM
 * WindowManager.LayoutParams.FLAG_ALT_FOCUSABLE_IM} window flag (assuming
     * your Dialog takes input focus, as it the default) with the following code:
     *
     * <pre>
     * getWindow().setFlags(WindowManager.LayoutParams.FLAG_ALT_FOCUSABLE_IM,
     *         WindowManager.LayoutParams.FLAG_ALT_FOCUSABLE_IM);</pre>
     *
     * <div class="special reference">
     * <h3>Developer Guides</h3>
     * <p>For more information about creating dialogs, read the
     * <a href="{@docRoot}guide/topics/ui/dialogs.html">Dialogs</a> developer guide.</p>
     * </div>
     */
    export class Dialog implements DialogInterface, Window.Callback, KeyEvent.Callback {

        private static TAG:string = "Dialog";

        //private mOwnerActivity:Activity;

        mContext:Context;

        mWindowManager:WindowManager;

        mWindow:Window;

        mDecor:View;

        //private mActionBar:ActionBarImpl;

        /**
         * This field should be made private, so it is hidden from the SDK.
         * {@hide}
         */
        protected mCancelable:boolean = true;

        private mCancelAndDismissTaken:string;

        private mCancelMessage:Message;

        private mDismissMessage:Message;

        private mShowMessage:Message;

        private mOnKeyListener:DialogInterface.OnKeyListener;

        private mCreated:boolean = false;

        private mShowing:boolean = false;

        private mCanceled:boolean = false;

        private mHandler:Handler = new Handler();

        private static DISMISS:number = 0x43;

        private static CANCEL:number = 0x44;

        private static SHOW:number = 0x45;

        private mListenersHandler:Handler;

        //private mActionMode:ActionMode;

        private mDismissAction:Runnable = (()=> {
            const inner_this = this;
            class _Inner implements Runnable {

                run():void {
                    inner_this.dismissDialog();
                }
            }
            return new _Inner();
        })();

        /**
         * Create a Dialog window that uses the default dialog frame style.
         *
         * @param context The Context the Dialog is to run it.  In particular, it
         *                uses the window manager and theme in this context to
         *                present its UI.
         */
        constructor(context:Context, cancelable?:boolean, cancelListener?:DialogInterface.OnCancelListener) {
            //if (createContextThemeWrapper) {
            //    if (theme == 0) {
            //        let outValue:TypedValue = new TypedValue();
            //        context.getTheme().resolveAttribute(com.android.internal.R.attr.dialogTheme, outValue, true);
            //        theme = outValue.resourceId;
            //    }
            //    this.mContext = new ContextThemeWrapper(context, theme);
            //} else {
            this.mContext = context;
            //}
            this.mWindowManager = (<android.app.Activity>context).getWindowManager();
            let w:Window = new Window(context);
            w.setFloating(true);
            w.setDimAmount(0.7);
            w.setBackgroundColor(android.graphics.Color.TRANSPARENT);
            this.mWindow = w;

            let dm = context.getResources().getDisplayMetrics();
            let decor = w.getDecorView();
            decor.setMinimumWidth(dm.density * 280);
            decor.setMinimumHeight(dm.density * 20);
            const onMeasure = decor.onMeasure;
            decor.onMeasure = (widthMeasureSpec:number, heightMeasureSpec:number)=>{
                onMeasure.call(decor, widthMeasureSpec, heightMeasureSpec);
                let width = decor.getMeasuredWidth();
                if(width > 360 * dm.density){//max 360dp
                    let widthSpec = View.MeasureSpec.makeMeasureSpec(360 * dm.density, View.MeasureSpec.EXACTLY);
                    onMeasure.call(decor, widthSpec, heightMeasureSpec);
                }
            }

            let wp = w.getAttributes();
            wp.flags |= WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH;
            wp.height = wp.width = ViewGroup.LayoutParams.WRAP_CONTENT;
            wp.leftMargin = wp.rightMargin = wp.topMargin = wp.bottomMargin = dm.density * 16;
            w.setWindowAnimations(android.R.anim.dialog_enter, android.R.anim.dialog_exit, null, null);

            w.setChildWindowManager(this.mWindowManager);
            w.setGravity(Gravity.CENTER);
            w.setCallback(this);


            this.mListenersHandler = new Dialog.ListenersHandler(this);

            this.mCancelable = cancelable;
            this.setOnCancelListener(cancelListener);
        }

        /**
         * Retrieve the Context this Dialog is running in.
         *
         * @return Context The Context used by the Dialog.
         */
        getContext():Context {
            return this.mContext;
        }

        ///**
        // * Retrieve the {@link ActionBar} attached to this dialog, if present.
        // *
        // * @return The ActionBar attached to the dialog or null if no ActionBar is present.
        // */
        //getActionBar():ActionBar  {
        //    return this.mActionBar;
        //}
        //
        ///**
        // * Sets the Activity that owns this dialog. An example use: This Dialog will
        // * use the suggested volume control stream of the Activity.
        // *
        // * @param activity The Activity that owns this dialog.
        // */
        //setOwnerActivity(activity:Activity):void  {
        //    this.mOwnerActivity = activity;
        //    this.getWindow().setVolumeControlStream(this.mOwnerActivity.getVolumeControlStream());
        //}
        //
        ///**
        // * Returns the Activity that owns this Dialog. For example, if
        // * {@link Activity#showDialog(int)} is used to show this Dialog, that
        // * Activity will be the owner (by default). Depending on how this dialog was
        // * created, this may return null.
        // *
        // * @return The Activity that owns this Dialog.
        // */
        //getOwnerActivity():Activity  {
        //    return this.mOwnerActivity;
        //}

        /**
         * @return Whether the dialog is currently showing.
         */
        isShowing():boolean {
            return this.mShowing;
        }

        /**
         * Start the dialog and display it on screen.  The window is placed in the
         * application layer and opaque.  Note that you should not override this
         * method to do initialization when the dialog is shown, instead implement
         * that in {@link #onStart}.
         */
        show():void {
            if (this.mShowing) {
                if (this.mDecor != null) {
                    //if (this.mWindow.hasFeature(Window.FEATURE_ACTION_BAR)) {
                    //    this.mWindow.invalidatePanelMenu(Window.FEATURE_ACTION_BAR);
                    //}
                    this.mDecor.setVisibility(View.VISIBLE);
                }
                return;
            }
            this.mCanceled = false;
            if (!this.mCreated) {
                this.dispatchOnCreate(null);
            }
            this.onStart();
            this.mDecor = this.mWindow.getDecorView();
            //if (this.mActionBar == null && this.mWindow.hasFeature(Window.FEATURE_ACTION_BAR)) {
            //const info:ApplicationInfo = this.mContext.getApplicationInfo();
            //this.mWindow.setDefaultIcon(info.icon);
            //this.mWindow.setDefaultLogo(info.logo);
            //this.mActionBar = new ActionBarImpl(this);
            //}
            //let l:WindowManager.LayoutParams = this.mWindow.getAttributes();
            //if ((l.softInputMode & WindowManager.LayoutParams.SOFT_INPUT_IS_FORWARD_NAVIGATION) == 0) {
            //    let nl:WindowManager.LayoutParams = new WindowManager.LayoutParams();
            //    nl.copyFrom(l);
            //    nl.softInputMode |= WindowManager.LayoutParams.SOFT_INPUT_IS_FORWARD_NAVIGATION;
            //    l = nl;
            //}
            try {
                this.mWindowManager.addWindow(this.mWindow);
                this.mShowing = true;
                this.sendShowMessage();
            } finally {
            }
        }

        /**
         * Hide the dialog, but do not dismiss it.
         */
        hide():void {
            if (this.mDecor != null) {
                this.mDecor.setVisibility(View.GONE);
            }
        }

        /**
         * Dismiss this dialog, removing it from the screen. This method can be
         * invoked safely from any thread.  Note that you should not override this
         * method to do cleanup when the dialog is dismissed, instead implement
         * that in {@link #onStop}.
         */
        dismiss():void {
            //if (Looper.myLooper() == this.mHandler.getLooper()) {
            this.dismissDialog();
            //} else {
            //    this.mHandler.post(this.mDismissAction);
            //}
        }

        dismissDialog():void {
            if (this.mDecor == null || !this.mShowing) {
                return;
            }
            if (this.mWindow.isDestroyed()) {
                Log.e(Dialog.TAG, "Tried to dismissDialog() but the Dialog's window was already destroyed!");
                return;
            }
            try {
                this.mWindowManager.removeWindow(this.mWindow);
            } finally {
                //if (this.mActionMode != null) {
                //    this.mActionMode.finish();
                //}
                this.mDecor = null;
                //this.mWindow.closeAllPanels();
                this.onStop();
                this.mShowing = false;
                this.sendDismissMessage();
            }
        }

        private sendDismissMessage():void {
            if (this.mDismissMessage != null) {
                // Obtain a new message so this dialog can be re-used
                Message.obtain(this.mDismissMessage).sendToTarget();
            }
        }

        private sendShowMessage():void {
            if (this.mShowMessage != null) {
                // Obtain a new message so this dialog can be re-used
                Message.obtain(this.mShowMessage).sendToTarget();
            }
        }

        // internal method to make sure mcreated is set properly without requiring
        // users to call through to super in onCreate
        dispatchOnCreate(savedInstanceState:Bundle):void {
            if (!this.mCreated) {
                this.onCreate(savedInstanceState);
                this.mCreated = true;
            }
        }

        /**
         * Similar to {@link Activity#onCreate}, you should initialize your dialog
         * in this method, including calling {@link #setContentView}.
         * @param savedInstanceState If this dialog is being reinitalized after a
         *     the hosting activity was previously shut down, holds the result from
         *     the most recent call to {@link #onSaveInstanceState}, or null if this
         *     is the first time.
         */
        protected onCreate(savedInstanceState:Bundle):void {
        }

        /**
         * Called when the dialog is starting.
         */
        protected onStart():void {
            //if (this.mActionBar != null)
            //    this.mActionBar.setShowHideAnimationEnabled(true);
        }

        /**
         * Called to tell you that you're stopping.
         */
        protected onStop():void {
            //if (this.mActionBar != null)
            //    this.mActionBar.setShowHideAnimationEnabled(false);
        }

        private static DIALOG_SHOWING_TAG:string = "android:dialogShowing";

        private static DIALOG_HIERARCHY_TAG:string = "android:dialogHierarchy";

        ///**
        // * Saves the state of the dialog into a bundle.
        // *
        // * The default implementation saves the state of its view hierarchy, so you'll
        // * likely want to call through to super if you override this to save additional
        // * state.
        // * @return A bundle with the state of the dialog.
        // */
        //onSaveInstanceState():Bundle  {
        //    let bundle:Bundle = new Bundle();
        //    bundle.putBoolean(Dialog.DIALOG_SHOWING_TAG, this.mShowing);
        //    if (this.mCreated) {
        //        bundle.putBundle(Dialog.DIALOG_HIERARCHY_TAG, this.mWindow.saveHierarchyState());
        //    }
        //    return bundle;
        //}
        //
        ///**
        // * Restore the state of the dialog from a previously saved bundle.
        // *
        // * The default implementation restores the state of the dialog's view
        // * hierarchy that was saved in the default implementation of {@link #onSaveInstanceState()},
        // * so be sure to call through to super when overriding unless you want to
        // * do all restoring of state yourself.
        // * @param savedInstanceState The state of the dialog previously saved by
        // *     {@link #onSaveInstanceState()}.
        // */
        //onRestoreInstanceState(savedInstanceState:Bundle):void  {
        //    const dialogHierarchyState:Bundle = savedInstanceState.getBundle(Dialog.DIALOG_HIERARCHY_TAG);
        //    if (dialogHierarchyState == null) {
        //        // dialog has never been shown, or onCreated, nothing to restore.
        //        return;
        //    }
        //    this.dispatchOnCreate(savedInstanceState);
        //    this.mWindow.restoreHierarchyState(dialogHierarchyState);
        //    if (savedInstanceState.getBoolean(Dialog.DIALOG_SHOWING_TAG)) {
        //        this.show();
        //    }
        //}

        /**
         * Retrieve the current Window for the activity.  This can be used to
         * directly access parts of the Window API that are not available
         * through Activity/Screen.
         *
         * @return Window The current window, or null if the activity is not
         *         visual.
         */
        getWindow():Window {
            return this.mWindow;
        }

        /**
         * Call {@link android.view.Window#getCurrentFocus} on the
         * Window if this Activity to return the currently focused view.
         *
         * @return View The current View with focus or null.
         *
         * @see #getWindow
         * @see android.view.Window#getCurrentFocus
         */
        getCurrentFocus():View {
            return this.mWindow != null ? this.mWindow.getCurrentFocus() : null;
        }

        /**
         * Finds a view that was identified by the id attribute from the XML that
         * was processed in {@link #onStart}.
         *
         * @param id the identifier of the view to find
         * @return The view if found or null otherwise.
         */
        findViewById(id:string):View {
            return this.mWindow.findViewById(id);
        }

        ///**
        // * Set the screen content from a layout resource.  The resource will be
        // * inflated, adding all top-level views to the screen.
        // *
        // * @param layoutResID Resource ID to be inflated.
        // */
        //setContentView(layoutResID:number):void  {
        //    this.mWindow.setContentView(layoutResID);
        //}

        ///**
        // * Set the screen content to an explicit view.  This view is placed
        // * directly into the screen's view hierarchy.  It can itself be a complex
        // * view hierarhcy.
        // *
        // * @param view The desired content to display.
        // */
        //setContentView(view:View):void  {
        //    this.mWindow.setContentView(view);
        //}

        /**
         * Set the screen content to an explicit view.  This view is placed
         * directly into the screen's view hierarchy.  It can itself be a complex
         * view hierarhcy.
         *
         * @param view The desired content to display.
         * @param params Layout parameters for the view.
         */
        setContentView(view:View, params?:ViewGroup.LayoutParams):void {
            this.mWindow.setContentView(view, params);
        }

        /**
         * Add an additional content view to the screen.  Added after any existing
         * ones in the screen -- existing views are NOT removed.
         *
         * @param view The desired content to display.
         * @param params Layout parameters for the view.
         */
        addContentView(view:View, params:ViewGroup.LayoutParams):void {
            this.mWindow.addContentView(view, params);
        }

        /**
         * Set the title text for this dialog's window.
         *
         * @param title The new text to display in the title.
         */
        setTitle(title:string):void {
            this.mWindow.setTitle(title);
            this.mWindow.getAttributes().setTitle(title);
        }

        ///**
        // * Set the title text for this dialog's window. The text is retrieved
        // * from the resources with the supplied identifier.
        // *
        // * @param titleId the title's text resource identifier
        // */
        //setTitle(titleId:number):void  {
        //    this.setTitle(this.mContext.getText(titleId));
        //}

        /**
         * A key was pressed down.
         *
         * <p>If the focused view didn't want this event, this method is called.
         *
         * <p>The default implementation consumed the KEYCODE_BACK to later
         * handle it in {@link #onKeyUp}.
         *
         * @see #onKeyUp
         * @see android.view.KeyEvent
         */
        onKeyDown(keyCode:number, event:KeyEvent):boolean {
            if (keyCode == KeyEvent.KEYCODE_BACK) {
                event.startTracking();
                return true;
            }
            return false;
        }

        /**
         * Default implementation of {@link KeyEvent.Callback#onKeyLongPress(int, KeyEvent)
     * KeyEvent.Callback.onKeyLongPress()}: always returns false (doesn't handle
         * the event).
         */
        onKeyLongPress(keyCode:number, event:KeyEvent):boolean {
            return false;
        }

        /**
         * A key was released.
         *
         * <p>The default implementation handles KEYCODE_BACK to close the
         * dialog.
         *
         * @see #onKeyDown
         * @see KeyEvent
         */
        onKeyUp(keyCode:number, event:KeyEvent):boolean {
            if (keyCode == KeyEvent.KEYCODE_BACK && event.isTracking() && !event.isCanceled()) {
                this.onBackPressed();
                return true;
            }
            return false;
        }

        /**
         * Default implementation of {@link KeyEvent.Callback#onKeyMultiple(int, int, KeyEvent)
     * KeyEvent.Callback.onKeyMultiple()}: always returns false (doesn't handle
         * the event).
         */
        onKeyMultiple(keyCode:number, repeatCount:number, event:KeyEvent):boolean {
            return false;
        }

        /**
         * Called when the dialog has detected the user's press of the back
         * key.  The default implementation simply cancels the dialog (only if
         * it is cancelable), but you can override this to do whatever you want.
         */
        onBackPressed():void {
            if (this.mCancelable) {
                this.cancel();
            }
        }

        ///**
        // * Called when a key shortcut event is not handled by any of the views in the Dialog.
        // * Override this method to implement global key shortcuts for the Dialog.
        // * Key shortcuts can also be implemented by setting the
        // * {@link MenuItem#setShortcut(char, char) shortcut} property of menu items.
        // *
        // * @param keyCode The value in event.getKeyCode().
        // * @param event Description of the key event.
        // * @return True if the key shortcut was handled.
        // */
        //onKeyShortcut(keyCode:number, event:KeyEvent):boolean  {
        //    return false;
        //}

        /**
         * Called when a touch screen event was not handled by any of the views
         * under it. This is most useful to process touch events that happen outside
         * of your window bounds, where there is no view to receive it.
         *
         * @param event The touch screen event being processed.
         * @return Return true if you have consumed the event, false if you haven't.
         *         The default implementation will cancel the dialog when a touch
         *         happens outside of the window bounds.
         */
        onTouchEvent(event:MotionEvent):boolean {
            if (this.mCancelable && this.mShowing && this.mWindow.shouldCloseOnTouch(this.mContext, event)) {
                this.cancel();
                return true;
            }
            return false;
        }

        /**
         * Called when the trackball was moved and not handled by any of the
         * views inside of the activity.  So, for example, if the trackball moves
         * while focus is on a button, you will receive a call here because
         * buttons do not normally do anything with trackball events.  The call
         * here happens <em>before</em> trackball movements are converted to
         * DPAD key events, which then get sent back to the view hierarchy, and
         * will be processed at the point for things like focus navigation.
         *
         * @param event The trackball event being processed.
         *
         * @return Return true if you have consumed the event, false if you haven't.
         * The default implementation always returns false.
         */
        onTrackballEvent(event:MotionEvent):boolean {
            return false;
        }

        /**
         * Called when a generic motion event was not handled by any of the
         * views inside of the dialog.
         * <p>
         * Generic motion events describe joystick movements, mouse hovers, track pad
         * touches, scroll wheel movements and other input events.  The
         * {@link MotionEvent#getSource() source} of the motion event specifies
         * the class of input that was received.  Implementations of this method
         * must examine the bits in the source before processing the event.
         * The following code example shows how this is done.
         * </p><p>
         * Generic motion events with source class
         * {@link android.view.InputDevice#SOURCE_CLASS_POINTER}
         * are delivered to the view under the pointer.  All other generic motion events are
         * delivered to the focused view.
         * </p><p>
         * See {@link View#onGenericMotionEvent(MotionEvent)} for an example of how to
         * handle this event.
         * </p>
         *
         * @param event The generic motion event being processed.
         *
         * @return Return true if you have consumed the event, false if you haven't.
         * The default implementation always returns false.
         */
        onGenericMotionEvent(event:MotionEvent):boolean {
            return false;
        }

        onWindowAttributesChanged(params:WindowManager.LayoutParams):void {
            if (this.mDecor != null) {
                this.mWindowManager.updateWindowLayout(this.mWindow, params);
            }
        }

        onContentChanged():void {
        }

        onWindowFocusChanged(hasFocus:boolean):void {
        }

        onAttachedToWindow():void {
        }

        onDetachedFromWindow():void {
        }

        /**
         * Called to process key events.  You can override this to intercept all
         * key events before they are dispatched to the window.  Be sure to call
         * this implementation for key events that should be handled normally.
         *
         * @param event The key event.
         *
         * @return boolean Return true if this event was consumed.
         */
        dispatchKeyEvent(event:KeyEvent):boolean {
            if ((this.mOnKeyListener != null) && (this.mOnKeyListener.onKey(this, event.getKeyCode(), event))) {
                return true;
            }
            if (this.mWindow.superDispatchKeyEvent(event)) {
                return true;
            }
            return event.dispatch(this, this.mDecor != null ? this.mDecor.getKeyDispatcherState() : null, this);
        }

        ///**
        // * Called to process a key shortcut event.
        // * You can override this to intercept all key shortcut events before they are
        // * dispatched to the window.  Be sure to call this implementation for key shortcut
        // * events that should be handled normally.
        // *
        // * @param event The key shortcut event.
        // * @return True if this event was consumed.
        // */
        //dispatchKeyShortcutEvent(event:KeyEvent):boolean  {
        //    if (this.mWindow.superDispatchKeyShortcutEvent(event)) {
        //        return true;
        //    }
        //    return this.onKeyShortcut(event.getKeyCode(), event);
        //}

        /**
         * Called to process touch screen events.  You can override this to
         * intercept all touch screen events before they are dispatched to the
         * window.  Be sure to call this implementation for touch screen events
         * that should be handled normally.
         *
         * @param ev The touch screen event.
         *
         * @return boolean Return true if this event was consumed.
         */
        dispatchTouchEvent(ev:MotionEvent):boolean {
            if (this.mWindow.superDispatchTouchEvent(ev)) {
                return true;
            }
            return this.onTouchEvent(ev);
        }

        ///**
        // * Called to process trackball events.  You can override this to
        // * intercept all trackball events before they are dispatched to the
        // * window.  Be sure to call this implementation for trackball events
        // * that should be handled normally.
        // *
        // * @param ev The trackball event.
        // *
        // * @return boolean Return true if this event was consumed.
        // */
        //dispatchTrackballEvent(ev:MotionEvent):boolean  {
        //    if (this.mWindow.superDispatchTrackballEvent(ev)) {
        //        return true;
        //    }
        //    return this.onTrackballEvent(ev);
        //}

        /**
         * Called to process generic motion events.  You can override this to
         * intercept all generic motion events before they are dispatched to the
         * window.  Be sure to call this implementation for generic motion events
         * that should be handled normally.
         *
         * @param ev The generic motion event.
         *
         * @return boolean Return true if this event was consumed.
         */
        dispatchGenericMotionEvent(ev:MotionEvent):boolean {
            if (this.mWindow.superDispatchGenericMotionEvent(ev)) {
                return true;
            }
            return this.onGenericMotionEvent(ev);
        }

        //dispatchPopulateAccessibilityEvent(event:AccessibilityEvent):boolean  {
        //    event.setClassName(this.getClass().getName());
        //    event.setPackageName(this.mContext.getPackageName());
        //    let params:LayoutParams = this.getWindow().getAttributes();
        //    let isFullScreen:boolean = (params.width == LayoutParams.MATCH_PARENT) && (params.height == LayoutParams.MATCH_PARENT);
        //    event.setFullScreen(isFullScreen);
        //    return false;
        //}
        //
        ///**
        // * @see Activity#onCreatePanelView(int)
        // */
        //onCreatePanelView(featureId:number):View  {
        //    return null;
        //}
        //
        ///**
        // * @see Activity#onCreatePanelMenu(int, Menu)
        // */
        //onCreatePanelMenu(featureId:number, menu:Menu):boolean  {
        //    if (featureId == Window.FEATURE_OPTIONS_PANEL) {
        //        return this.onCreateOptionsMenu(menu);
        //    }
        //    return false;
        //}
        //
        ///**
        // * @see Activity#onPreparePanel(int, View, Menu)
        // */
        //onPreparePanel(featureId:number, view:View, menu:Menu):boolean  {
        //    if (featureId == Window.FEATURE_OPTIONS_PANEL && menu != null) {
        //        let goforit:boolean = this.onPrepareOptionsMenu(menu);
        //        return goforit && menu.hasVisibleItems();
        //    }
        //    return true;
        //}
        //
        ///**
        // * @see Activity#onMenuOpened(int, Menu)
        // */
        //onMenuOpened(featureId:number, menu:Menu):boolean  {
        //    if (featureId == Window.FEATURE_ACTION_BAR) {
        //        this.mActionBar.dispatchMenuVisibilityChanged(true);
        //    }
        //    return true;
        //}
        //
        ///**
        // * @see Activity#onMenuItemSelected(int, MenuItem)
        // */
        //onMenuItemSelected(featureId:number, item:MenuItem):boolean  {
        //    return false;
        //}
        //
        ///**
        // * @see Activity#onPanelClosed(int, Menu)
        // */
        //onPanelClosed(featureId:number, menu:Menu):void  {
        //    if (featureId == Window.FEATURE_ACTION_BAR) {
        //        this.mActionBar.dispatchMenuVisibilityChanged(false);
        //    }
        //}
        //
        ///**
        // * It is usually safe to proxy this call to the owner activity's
        // * {@link Activity#onCreateOptionsMenu(Menu)} if the client desires the same
        // * menu for this Dialog.
        // *
        // * @see Activity#onCreateOptionsMenu(Menu)
        // * @see #getOwnerActivity()
        // */
        //onCreateOptionsMenu(menu:Menu):boolean  {
        //    return true;
        //}
        //
        ///**
        // * It is usually safe to proxy this call to the owner activity's
        // * {@link Activity#onPrepareOptionsMenu(Menu)} if the client desires the
        // * same menu for this Dialog.
        // *
        // * @see Activity#onPrepareOptionsMenu(Menu)
        // * @see #getOwnerActivity()
        // */
        //onPrepareOptionsMenu(menu:Menu):boolean  {
        //    return true;
        //}
        //
        ///**
        // * @see Activity#onOptionsItemSelected(MenuItem)
        // */
        //onOptionsItemSelected(item:MenuItem):boolean  {
        //    return false;
        //}
        //
        ///**
        // * @see Activity#onOptionsMenuClosed(Menu)
        // */
        //onOptionsMenuClosed(menu:Menu):void  {
        //}
        //
        ///**
        // * @see Activity#openOptionsMenu()
        // */
        //openOptionsMenu():void  {
        //    this.mWindow.openPanel(Window.FEATURE_OPTIONS_PANEL, null);
        //}
        //
        ///**
        // * @see Activity#closeOptionsMenu()
        // */
        //closeOptionsMenu():void  {
        //    this.mWindow.closePanel(Window.FEATURE_OPTIONS_PANEL);
        //}
        //
        ///**
        // * @see Activity#invalidateOptionsMenu()
        // */
        //invalidateOptionsMenu():void  {
        //    this.mWindow.invalidatePanelMenu(Window.FEATURE_OPTIONS_PANEL);
        //}
        //
        ///**
        // * @see Activity#onCreateContextMenu(ContextMenu, View, ContextMenuInfo)
        // */
        //onCreateContextMenu(menu:ContextMenu, v:View, menuInfo:ContextMenuInfo):void  {
        //}
        //
        ///**
        // * @see Activity#registerForContextMenu(View)
        // */
        //registerForContextMenu(view:View):void  {
        //    view.setOnCreateContextMenuListener(this);
        //}
        //
        ///**
        // * @see Activity#unregisterForContextMenu(View)
        // */
        //unregisterForContextMenu(view:View):void  {
        //    view.setOnCreateContextMenuListener(null);
        //}
        //
        ///**
        // * @see Activity#openContextMenu(View)
        // */
        //openContextMenu(view:View):void  {
        //    view.showContextMenu();
        //}
        //
        ///**
        // * @see Activity#onContextItemSelected(MenuItem)
        // */
        //onContextItemSelected(item:MenuItem):boolean  {
        //    return false;
        //}
        //
        ///**
        // * @see Activity#onContextMenuClosed(Menu)
        // */
        //onContextMenuClosed(menu:Menu):void  {
        //}
        //
        ///**
        // * This hook is called when the user signals the desire to start a search.
        // */
        //onSearchRequested():boolean  {
        //    const searchManager:SearchManager = <SearchManager> this.mContext.getSystemService(Context.SEARCH_SERVICE);
        //    // associate search with owner activity
        //    const appName:ComponentName = this.getAssociatedActivity();
        //    if (appName != null && searchManager.getSearchableInfo(appName) != null) {
        //        searchManager.startSearch(null, false, appName, null, false);
        //        this.dismiss();
        //        return true;
        //    } else {
        //        return false;
        //    }
        //}
        //
        //onWindowStartingActionMode(callback:ActionMode.Callback):ActionMode  {
        //    if (this.mActionBar != null) {
        //        return this.mActionBar.startActionMode(callback);
        //    }
        //    return null;
        //}
        //
        ///**
        // * {@inheritDoc}
        // *
        // * Note that if you override this method you should always call through
        // * to the superclass implementation by calling super.onActionModeStarted(mode).
        // */
        //onActionModeStarted(mode:ActionMode):void  {
        //    this.mActionMode = mode;
        //}
        //
        ///**
        // * {@inheritDoc}
        // *
        // * Note that if you override this method you should always call through
        // * to the superclass implementation by calling super.onActionModeFinished(mode).
        // */
        //onActionModeFinished(mode:ActionMode):void  {
        //    if (mode == this.mActionMode) {
        //        this.mActionMode = null;
        //    }
        //}
        //
        ///**
        // * @return The activity associated with this dialog, or null if there is no associated activity.
        // */
        //private getAssociatedActivity():ComponentName  {
        //    let activity:Activity = this.mOwnerActivity;
        //    let context:Context = this.getContext();
        //    while (activity == null && context != null) {
        //        if (context instanceof Activity) {
        //            // found it!
        //            activity = <Activity> context;
        //        } else {
        //            context = (context instanceof ContextWrapper) ? // unwrap one level
        //            (<ContextWrapper> context).getBaseContext() : // done
        //            null;
        //        }
        //    }
        //    return activity == null ? null : activity.getComponentName();
        //}

        /**
         * Request that key events come to this dialog. Use this if your
         * dialog has no views with focus, but the dialog still wants
         * a chance to process key events.
         *
         * @param get true if the dialog should receive key events, false otherwise
         * @see android.view.Window#takeKeyEvents
         */
        takeKeyEvents(get:boolean):void {
            this.mWindow.takeKeyEvents(get);
        }

        ///**
        // * Enable extended window features.  This is a convenience for calling
        // * {@link android.view.Window#requestFeature getWindow().requestFeature()}.
        // *
        // * @param featureId The desired feature as defined in
        // *                  {@link android.view.Window}.
        // * @return Returns true if the requested feature is supported and now
        // *         enabled.
        // *
        // * @see android.view.Window#requestFeature
        // */
        //requestWindowFeature(featureId:number):boolean  {
        //    return this.getWindow().requestFeature(featureId);
        //}
        //
        ///**
        // * Convenience for calling
        // * {@link android.view.Window#setFeatureDrawableResource}.
        // */
        //setFeatureDrawableResource(featureId:number, resId:number):void  {
        //    this.getWindow().setFeatureDrawableResource(featureId, resId);
        //}
        //
        ///**
        // * Convenience for calling
        // * {@link android.view.Window#setFeatureDrawableUri}.
        // */
        //setFeatureDrawableUri(featureId:number, uri:Uri):void  {
        //    this.getWindow().setFeatureDrawableUri(featureId, uri);
        //}
        //
        ///**
        // * Convenience for calling
        // * {@link android.view.Window#setFeatureDrawable(int, Drawable)}.
        // */
        //setFeatureDrawable(featureId:number, drawable:Drawable):void  {
        //    this.getWindow().setFeatureDrawable(featureId, drawable);
        //}
        //
        ///**
        // * Convenience for calling
        // * {@link android.view.Window#setFeatureDrawableAlpha}.
        // */
        //setFeatureDrawableAlpha(featureId:number, alpha:number):void  {
        //    this.getWindow().setFeatureDrawableAlpha(featureId, alpha);
        //}

        getLayoutInflater():LayoutInflater {
            return this.getWindow().getLayoutInflater();
        }

        /**
         * Sets whether this dialog is cancelable with the
         * {@link KeyEvent#KEYCODE_BACK BACK} key.
         */
        setCancelable(flag:boolean):void {
            this.mCancelable = flag;
        }

        /**
         * Sets whether this dialog is canceled when touched outside the window's
         * bounds. If setting to true, the dialog is set to be cancelable if not
         * already set.
         *
         * @param cancel Whether the dialog should be canceled when touched outside
         *            the window.
         */
        setCanceledOnTouchOutside(cancel:boolean):void {
            if (cancel && !this.mCancelable) {
                this.mCancelable = true;
            }
            this.mWindow.setCloseOnTouchOutside(cancel);
        }

        /**
         * Cancel the dialog.  This is essentially the same as calling {@link #dismiss()}, but it will
         * also call your {@link DialogInterface.OnCancelListener} (if registered).
         */
        cancel():void {
            if (!this.mCanceled && this.mCancelMessage != null) {
                this.mCanceled = true;
                // Obtain a new message so this dialog can be re-used
                Message.obtain(this.mCancelMessage).sendToTarget();
            }
            this.dismiss();
        }

        /**
         * Set a listener to be invoked when the dialog is canceled.
         *
         * <p>This will only be invoked when the dialog is canceled.
         * Cancel events alone will not capture all ways that
         * the dialog might be dismissed. If the creator needs
         * to know when a dialog is dismissed in general, use
         * {@link #setOnDismissListener}.</p>
         *
         * @param listener The {@link DialogInterface.OnCancelListener} to use.
         */
        setOnCancelListener(listener:DialogInterface.OnCancelListener):void {
            if (this.mCancelAndDismissTaken != null) {
                throw Error(`new IllegalStateException("OnCancelListener is already taken by " + this.mCancelAndDismissTaken + " and can not be replaced.")`);
            }
            if (listener != null) {
                this.mCancelMessage = this.mListenersHandler.obtainMessage(Dialog.CANCEL, listener);
            } else {
                this.mCancelMessage = null;
            }
        }

        /**
         * Set a message to be sent when the dialog is canceled.
         * @param msg The msg to send when the dialog is canceled.
         * @see #setOnCancelListener(android.content.DialogInterface.OnCancelListener)
         */
        setCancelMessage(msg:Message):void {
            this.mCancelMessage = msg;
        }

        /**
         * Set a listener to be invoked when the dialog is dismissed.
         * @param listener The {@link DialogInterface.OnDismissListener} to use.
         */
        setOnDismissListener(listener:DialogInterface.OnDismissListener):void {
            if (this.mCancelAndDismissTaken != null) {
                throw Error(`new IllegalStateException("OnDismissListener is already taken by " + this.mCancelAndDismissTaken + " and can not be replaced.")`);
            }
            if (listener != null) {
                this.mDismissMessage = this.mListenersHandler.obtainMessage(Dialog.DISMISS, listener);
            } else {
                this.mDismissMessage = null;
            }
        }

        /**
         * Sets a listener to be invoked when the dialog is shown.
         * @param listener The {@link DialogInterface.OnShowListener} to use.
         */
        setOnShowListener(listener:DialogInterface.OnShowListener):void {
            if (listener != null) {
                this.mShowMessage = this.mListenersHandler.obtainMessage(Dialog.SHOW, listener);
            } else {
                this.mShowMessage = null;
            }
        }

        /**
         * Set a message to be sent when the dialog is dismissed.
         * @param msg The msg to send when the dialog is dismissed.
         */
        setDismissMessage(msg:Message):void {
            this.mDismissMessage = msg;
        }

        /** @hide */
        takeCancelAndDismissListeners(msg:string, cancel:DialogInterface.OnCancelListener, dismiss:DialogInterface.OnDismissListener):boolean {
            if (this.mCancelAndDismissTaken != null) {
                this.mCancelAndDismissTaken = null;
            } else if (this.mCancelMessage != null || this.mDismissMessage != null) {
                return false;
            }
            this.setOnCancelListener(cancel);
            this.setOnDismissListener(dismiss);
            this.mCancelAndDismissTaken = msg;
            return true;
        }

        ///**
        // * By default, this will use the owner Activity's suggested stream type.
        // *
        // * @see Activity#setVolumeControlStream(int)
        // * @see #setOwnerActivity(Activity)
        // */
        //setVolumeControlStream(streamType:number):void  {
        //    this.getWindow().setVolumeControlStream(streamType);
        //}
        //
        ///**
        // * @see Activity#getVolumeControlStream()
        // */
        //getVolumeControlStream():number  {
        //    return this.getWindow().getVolumeControlStream();
        //}

        /**
         * Sets the callback that will be called if a key is dispatched to the dialog.
         */
        setOnKeyListener(onKeyListener:DialogInterface.OnKeyListener):void {
            this.mOnKeyListener = onKeyListener;
        }


    }

    export module Dialog {
        export class ListenersHandler extends Handler {

            private mDialog:WeakReference<DialogInterface>;

            constructor(dialog:Dialog) {
                super();
                this.mDialog = new WeakReference<DialogInterface>(dialog);
            }

            handleMessage(msg:Message):void {
                switch (msg.what) {
                    case Dialog.DISMISS:
                        (<DialogInterface.OnDismissListener> msg.obj).onDismiss(this.mDialog.get());
                        break;
                    case Dialog.CANCEL:
                        (<DialogInterface.OnCancelListener> msg.obj).onCancel(this.mDialog.get());
                        break;
                    case Dialog.SHOW:
                        (<DialogInterface.OnShowListener> msg.obj).onShow(this.mDialog.get());
                        break;
                }
            }
        }
    }

}
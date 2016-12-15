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

///<reference path="../view/Window.ts"/>
///<reference path="../view/WindowManager.ts"/>
///<reference path="../content/Context.ts"/>
///<reference path="../view/View.ts"/>
///<reference path="../view/ViewGroup.ts"/>
///<reference path="../view/ViewRootImpl.ts"/>
///<reference path="../view/KeyEvent.ts"/>
///<reference path="../view/animation/Animation.ts"/>
///<reference path="../widget/FrameLayout.ts"/>
///<reference path="../view/MotionEvent.ts"/>
///<reference path="../view/LayoutInflater.ts"/>
///<reference path="../os/Bundle.ts"/>
///<reference path="../os/Handler.ts"/>
///<reference path="../util/Log.ts"/>
///<reference path="../content/Intent.ts"/>
///<reference path="../../androidui/AndroidUI.ts"/>
///<reference path="../../java/lang/Runnable.ts"/>

module android.app{
    import AndroidUI = androidui.AndroidUI;
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import ViewRootImpl = android.view.ViewRootImpl;
    import KeyEvent = android.view.KeyEvent;
    import Animation = android.view.animation.Animation;
    import FrameLayout = android.widget.FrameLayout;
    import MotionEvent = android.view.MotionEvent;
    import Window = android.view.Window;
    import WindowManager = android.view.WindowManager;
    import LayoutInflater = android.view.LayoutInflater;
    import Bundle = android.os.Bundle;
    import Handler = android.os.Handler;
    import Log = android.util.Log;
    import Context = android.content.Context;
    import Intent = android.content.Intent;
    import Runnable = java.lang.Runnable;

    export class Activity extends Context implements Window.Callback, KeyEvent.Callback{

        private static TAG:string = "Activity";

        private static DEBUG_LIFECYCLE:boolean = false;

        /** Standard activity result: operation canceled. */
        static RESULT_CANCELED:number = 0;

        /** Standard activity result: operation succeeded. */
        static RESULT_OK:number = -1;

        /** Start of user-defined activity results. */
        static RESULT_FIRST_USER:number = 1;

        private mCallActivity:Activity;//activity that launch the activity (will null if restore)

        private mIntent:Intent;

        private mCalled:boolean;

        private mResumed:boolean;

        private mStopped:boolean;

        private mFinished:boolean;

        private mStartedActivity:boolean;

        private mDestroyed:boolean;

        private mWindow:Window;

        private mWindowAdded:boolean = false;

        private mVisibleFromClient:boolean = true;

        private mResultCode:number = Activity.RESULT_CANCELED;

        private mResultData:Intent = null;

        private mMenu:android.view.Menu;
        private mMenuPopuoHelper:android.view.menu.MenuPopupHelper;

        //mHandler:Handler = new Handler();

        /** Return the intent that started this activity. */
        getIntent():Intent  {
            return this.mIntent;
        }

        /**
         * Change the intent returned by {@link #getIntent}.  This holds a
         * reference to the given intent; it does not copy it.  Often used in
         * conjunction with {@link #onNewIntent}.
         *
         * @param newIntent The new Intent object to return from getIntent
         *
         * @see #getIntent
         * @see #onNewIntent
         */
        setIntent(newIntent:Intent):void  {
            this.mIntent = newIntent;
        }

        /** Return the application that owns this activity. */
        getApplication():android.app.Application  {
            return this.getApplicationContext();
        }

        /**
         * Retrieve the window manager for showing custom windows.
         * NOTE: all windows will add to this activity's window.
         * @see getGlobalWindowManager
         */
        getWindowManager():android.view.WindowManager{
            return this.mWindow.getChildWindowManager();
        }

        /**
         * Retrieve the window manager for application
         * NOTE: all windows will add to application level, same as activity
         * @see getWindowManager
         */
        getGlobalWindowManager():android.view.WindowManager{
            return this.getApplicationContext().getWindowManager();
        }

        /**
         * Retrieve the current {@link android.view.Window} for the activity.
         * This can be used to directly access parts of the Window API that
         * are not available through Activity/Screen.
         *
         * @return Window The current window, or null if the activity is not
         *         visual.
         */
        getWindow():Window  {
            return this.mWindow;
        }

        /**
         * Calls {@link android.view.Window#getCurrentFocus} on the
         * Window of this Activity to return the currently focused view.
         *
         * @return View The current View with focus or null.
         *
         * @see #getWindow
         * @see android.view.Window#getCurrentFocus
         */
        getCurrentFocus():View  {
            return this.mWindow != null ? this.mWindow.getCurrentFocus() : null;
        }


        /**
         * Called when the activity is starting.  This is where most initialization
         * should go: calling {@link #setContentView(int)} to inflate the
         * activity's UI, using {@link #findViewById} to programmatically interact
         * with widgets in the UI, calling
         * {@link #managedQuery(android.net.Uri , String[], String, String[], String)} to retrieve
         * cursors for data being displayed, etc.
         *
         * <p>You can call {@link #finish} from within this function, in
         * which case onDestroy() will be immediately called without any of the rest
         * of the activity lifecycle ({@link #onStart}, {@link #onResume},
         * {@link #onPause}, etc) executing.
         *
         * <p><em>Derived classes must call through to the super class's
         * implementation of this method.  If they do not, an exception will be
         * thrown.</em></p>
         *
         * @param savedInstanceState If the activity is being re-initialized after
         *     previously being shut down then this Bundle contains the data it most
         *     recently supplied in {@link #onSaveInstanceState}.  <b><i>Note: Otherwise it is null.</i></b>
         *
         * @see #onStart
         * @see #onSaveInstanceState
         * @see #onRestoreInstanceState
         * @see #onPostCreate
         */
        protected onCreate(savedInstanceState?:Bundle):void  {
            if (Activity.DEBUG_LIFECYCLE) Log.v(Activity.TAG, "onCreate " + this + ": " + savedInstanceState);
            //if (this.mLastNonConfigurationInstances != null) {
            //    this.mAllLoaderManagers = this.mLastNonConfigurationInstances.loaders;
            //}
            //if (this.mActivityInfo.parentActivityName != null) {
            //    if (this.mActionBar == null) {
            //        this.mEnableDefaultActionBarUp = true;
            //    } else {
            //        this.mActionBar.setDefaultDisplayHomeAsUpEnabled(true);
            //    }
            //}
            //if (savedInstanceState != null) {
            //    let p:Parcelable = savedInstanceState.getParcelable(Activity.FRAGMENTS_TAG);
            //    this.mFragments.restoreAllState(p, this.mLastNonConfigurationInstances != null ? this.mLastNonConfigurationInstances.fragments : null);
            //}
            //this.mFragments.dispatchCreate();
            this.getApplication().dispatchActivityCreated(this, savedInstanceState);
            this.mCalled = true;
        }

        /**
         * The hook for {@link ActivityThread} to restore the state of this activity.
         *
         * Calls {@link #onSaveInstanceState(android.os.Bundle)} and
         * {@link #restoreManagedDialogs(android.os.Bundle)}.
         *
         * @param savedInstanceState contains the saved state
         */
        performRestoreInstanceState(savedInstanceState:Bundle):void  {
            this.onRestoreInstanceState(savedInstanceState);
            //this.restoreManagedDialogs(savedInstanceState);
        }

        /**
         * This method is called after {@link #onStart} when the activity is
         * being re-initialized from a previously saved state, given here in
         * <var>savedInstanceState</var>.  Most implementations will simply use {@link #onCreate}
         * to restore their state, but it is sometimes convenient to do it here
         * after all of the initialization has been done or to allow subclasses to
         * decide whether to use your default implementation.  The default
         * implementation of this method performs a restore of any view state that
         * had previously been frozen by {@link #onSaveInstanceState}.
         *
         * <p>This method is called between {@link #onStart} and
         * {@link #onPostCreate}.
         *
         * @param savedInstanceState the data most recently supplied in {@link #onSaveInstanceState}.
         *
         * @see #onCreate
         * @see #onPostCreate
         * @see #onResume
         * @see #onSaveInstanceState
         */
        protected onRestoreInstanceState(savedInstanceState:Bundle):void  {
            //TODO restoreHierarchyState?
            //if (this.mWindow != null) {
            //    let windowState:Bundle = savedInstanceState.getBundle(Activity.WINDOW_HIERARCHY_TAG);
            //    if (windowState != null) {
            //        this.mWindow.restoreHierarchyState(windowState);
            //    }
            //}
        }


        /**
         * Called when activity start-up is complete (after {@link #onStart}
         * and {@link #onRestoreInstanceState} have been called).  Applications will
         * generally not implement this method; it is intended for system
         * classes to do final initialization after application code has run.
         *
         * <p><em>Derived classes must call through to the super class's
         * implementation of this method.  If they do not, an exception will be
         * thrown.</em></p>
         *
         * @param savedInstanceState If the activity is being re-initialized after
         *     previously being shut down then this Bundle contains the data it most
         *     recently supplied in {@link #onSaveInstanceState}.  <b><i>Note: Otherwise it is null.</i></b>
         * @see #onCreate
         */
        protected onPostCreate(savedInstanceState:Bundle):void  {
            //if (!this.isChild()) {
            //    this.mTitleReady = true;
                this.onTitleChanged(this.getTitle());
            //}
            this.mCalled = true;
        }

        /**
         * Called after {@link #onCreate} &mdash; or after {@link #onRestart} when
         * the activity had been stopped, but is now again being displayed to the
         * user.  It will be followed by {@link #onResume}.
         *
         * <p><em>Derived classes must call through to the super class's
         * implementation of this method.  If they do not, an exception will be
         * thrown.</em></p>
         *
         * @see #onCreate
         * @see #onStop
         * @see #onResume
         */
        protected onStart():void  {
            if (Activity.DEBUG_LIFECYCLE) Log.v(Activity.TAG, "onStart " + this);
            this.mCalled = true;
            //if (!this.mLoadersStarted) {
            //    this.mLoadersStarted = true;
            //    if (this.mLoaderManager != null) {
            //        this.mLoaderManager.doStart();
            //    } else if (!this.mCheckedForLoaderManager) {
            //        this.mLoaderManager = this.getLoaderManager("(root)", this.mLoadersStarted, false);
            //    }
            //    this.mCheckedForLoaderManager = true;
            //}
            this.getApplication().dispatchActivityStarted(this);
        }

        /**
         * Called after {@link #onStop} when the current activity is being
         * re-displayed to the user (the user has navigated back to it).  It will
         * be followed by {@link #onStart} and then {@link #onResume}.
         *
         * <p>For activities that are using raw {@link Cursor} objects (instead of
         * creating them through
         * {@link #managedQuery(android.net.Uri , String[], String, String[], String)},
         * this is usually the place
         * where the cursor should be requeried (because you had deactivated it in
         * {@link #onStop}.
         *
         * <p><em>Derived classes must call through to the super class's
         * implementation of this method.  If they do not, an exception will be
         * thrown.</em></p>
         *
         * @see #onStop
         * @see #onStart
         * @see #onResume
         */
        protected onRestart():void  {
            this.mCalled = true;
        }


        /**
         * Called after {@link #onRestoreInstanceState}, {@link #onRestart}, or
         * {@link #onPause}, for your activity to start interacting with the user.
         * This is a good place to begin animations, open exclusive-access devices
         * (such as the camera), etc.
         *
         * <p>Keep in mind that onResume is not the best indicator that your activity
         * is visible to the user; a system window such as the keyguard may be in
         * front.  Use {@link #onWindowFocusChanged} to know for certain that your
         * activity is visible to the user (for example, to resume a game).
         *
         * <p><em>Derived classes must call through to the super class's
         * implementation of this method.  If they do not, an exception will be
         * thrown.</em></p>
         *
         * @see #onRestoreInstanceState
         * @see #onRestart
         * @see #onPostResume
         * @see #onPause
         */
        protected onResume():void  {
            if (Activity.DEBUG_LIFECYCLE) Log.v(Activity.TAG, "onResume " + this);
            this.getApplication().dispatchActivityResumed(this);
            this.mCalled = true;
        }


        /**
         * Called when activity resume is complete (after {@link #onResume} has
         * been called). Applications will generally not implement this method;
         * it is intended for system classes to do final setup after application
         * resume code has run.
         *
         * <p><em>Derived classes must call through to the super class's
         * implementation of this method.  If they do not, an exception will be
         * thrown.</em></p>
         *
         * @see #onResume
         */
        protected onPostResume():void  {
            const win:Window = this.getWindow();
            if (win != null) win.makeActive();
            //if (this.mActionBar != null) this.mActionBar.setShowHideAnimationEnabled(true);
            this.mCalled = true;
        }

        /**
         * This is called for activities that set launchMode to "singleTop" in
         * their package, or if a client used the {@link Intent#FLAG_ACTIVITY_SINGLE_TOP}
         * flag when calling {@link #startActivity}.  In either case, when the
         * activity is re-launched while at the top of the activity stack instead
         * of a new instance of the activity being started, onNewIntent() will be
         * called on the existing instance with the Intent that was used to
         * re-launch it.
         *
         * <p>An activity will always be paused before receiving a new intent, so
         * you can count on {@link #onResume} being called after this method.
         *
         * <p>Note that {@link #getIntent} still returns the original Intent.  You
         * can use {@link #setIntent} to update it to this new Intent.
         *
         * @param intent The new intent that was started for the activity.
         *
         * @see #getIntent
         * @see #setIntent
         * @see #onResume
         */
        protected onNewIntent(intent:Intent):void  {
        }

        /**
         * The hook for {@link ActivityThread} to save the state of this activity.
         *
         * Calls {@link #onSaveInstanceState(android.os.Bundle)}
         * and {@link #saveManagedDialogs(android.os.Bundle)}.
         *
         * @param outState The bundle to save the state to.
         */
        performSaveInstanceState(outState:Bundle):void  {
            this.onSaveInstanceState(outState);
            //this.saveManagedDialogs(outState);
            if (Activity.DEBUG_LIFECYCLE) Log.v(Activity.TAG, "onSaveInstanceState " + this + ": " + outState);
        }


        /**
         * Called to retrieve per-instance state from an activity before being killed
         * so that the state can be restored in {@link #onCreate} or
         * {@link #onRestoreInstanceState} (the {@link Bundle} populated by this method
         * will be passed to both).
         *
         * <p>This method is called before an activity may be killed so that when it
         * comes back some time in the future it can restore its state.  For example,
         * if activity B is launched in front of activity A, and at some point activity
         * A is killed to reclaim resources, activity A will have a chance to save the
         * current state of its user interface via this method so that when the user
         * returns to activity A, the state of the user interface can be restored
         * via {@link #onCreate} or {@link #onRestoreInstanceState}.
         *
         * <p>Do not confuse this method with activity lifecycle callbacks such as
         * {@link #onPause}, which is always called when an activity is being placed
         * in the background or on its way to destruction, or {@link #onStop} which
         * is called before destruction.  One example of when {@link #onPause} and
         * {@link #onStop} is called and not this method is when a user navigates back
         * from activity B to activity A: there is no need to call {@link #onSaveInstanceState}
         * on B because that particular instance will never be restored, so the
         * system avoids calling it.  An example when {@link #onPause} is called and
         * not {@link #onSaveInstanceState} is when activity B is launched in front of activity A:
         * the system may avoid calling {@link #onSaveInstanceState} on activity A if it isn't
         * killed during the lifetime of B since the state of the user interface of
         * A will stay intact.
         *
         * <p>The default implementation takes care of most of the UI per-instance
         * state for you by calling {@link android.view.View#onSaveInstanceState()} on each
         * view in the hierarchy that has an id, and by saving the id of the currently
         * focused view (all of which is restored by the default implementation of
         * {@link #onRestoreInstanceState}).  If you override this method to save additional
         * information not captured by each individual view, you will likely want to
         * call through to the default implementation, otherwise be prepared to save
         * all of the state of each view yourself.
         *
         * <p>If called, this method will occur before {@link #onStop}.  There are
         * no guarantees about whether it will occur before or after {@link #onPause}.
         *
         * @param outState Bundle in which to place your saved state.
         *
         * @see #onCreate
         * @see #onRestoreInstanceState
         * @see #onPause
         */
        protected onSaveInstanceState(outState:Bundle):void  {
            //outState.putBundle(Activity.WINDOW_HIERARCHY_TAG, this.mWindow.saveHierarchyState());
            //let p:Parcelable = this.mFragments.saveAllState();
            //if (p != null) {
            //    outState.putParcelable(Activity.FRAGMENTS_TAG, p);
            //}
            this.getApplication().dispatchActivitySaveInstanceState(this, outState);
        }


        /**
         * Called as part of the activity lifecycle when an activity is going into
         * the background, but has not (yet) been killed.  The counterpart to
         * {@link #onResume}.
         *
         * <p>When activity B is launched in front of activity A, this callback will
         * be invoked on A.  B will not be created until A's {@link #onPause} returns,
         * so be sure to not do anything lengthy here.
         *
         * <p>This callback is mostly used for saving any persistent state the
         * activity is editing, to present a "edit in place" model to the user and
         * making sure nothing is lost if there are not enough resources to start
         * the new activity without first killing this one.  This is also a good
         * place to do things like stop animations and other things that consume a
         * noticeable amount of CPU in order to make the switch to the next activity
         * as fast as possible, or to close resources that are exclusive access
         * such as the camera.
         *
         * <p>In situations where the system needs more memory it may kill paused
         * processes to reclaim resources.  Because of this, you should be sure
         * that all of your state is saved by the time you return from
         * this function.  In general {@link #onSaveInstanceState} is used to save
         * per-instance state in the activity and this method is used to store
         * global persistent data (in content providers, files, etc.)
         *
         * <p>After receiving this call you will usually receive a following call
         * to {@link #onStop} (after the next activity has been resumed and
         * displayed), however in some cases there will be a direct call back to
         * {@link #onResume} without going through the stopped state.
         *
         * <p><em>Derived classes must call through to the super class's
         * implementation of this method.  If they do not, an exception will be
         * thrown.</em></p>
         *
         * @see #onResume
         * @see #onSaveInstanceState
         * @see #onStop
         */
        protected onPause():void  {
            if (Activity.DEBUG_LIFECYCLE) Log.v(Activity.TAG, "onPause " + this);
            this.getApplication().dispatchActivityPaused(this);
            this.mCalled = true;
        }

        /**
         * AndroidUI:call when app into the background
         */
        protected onUserLeaveHint():void  {
        }

        /**
         * Called when you are no longer visible to the user.  You will next
         * receive either {@link #onRestart}, {@link #onDestroy}, or nothing,
         * depending on later user activity.
         *
         * <p>Note that this method may never be called, in low memory situations
         * where the system does not have enough memory to keep your activity's
         * process running after its {@link #onPause} method is called.
         *
         * <p><em>Derived classes must call through to the super class's
         * implementation of this method.  If they do not, an exception will be
         * thrown.</em></p>
         *
         * @see #onRestart
         * @see #onResume
         * @see #onSaveInstanceState
         * @see #onDestroy
         */
        protected onStop():void  {
            if (Activity.DEBUG_LIFECYCLE) Log.v(Activity.TAG, "onStop " + this);
            //if (this.mActionBar != null) this.mActionBar.setShowHideAnimationEnabled(false);
            this.getApplication().dispatchActivityStopped(this);
            //this.mTranslucentCallback = null;
            this.mCalled = true;
        }


        /**
         * Perform any final cleanup before an activity is destroyed.  This can
         * happen either because the activity is finishing (someone called
         * {@link #finish} on it, or because the system is temporarily destroying
         * this instance of the activity to save space.  You can distinguish
         * between these two scenarios with the {@link #isFinishing} method.
         *
         * <p><em>Note: do not count on this method being called as a place for
         * saving data! For example, if an activity is editing data in a content
         * provider, those edits should be committed in either {@link #onPause} or
         * {@link #onSaveInstanceState}, not here.</em> This method is usually implemented to
         * free resources like threads that are associated with an activity, so
         * that a destroyed activity does not leave such things around while the
         * rest of its application is still running.  There are situations where
         * the system will simply kill the activity's hosting process without
         * calling this method (or any others) in it, so it should not be used to
         * do things that are intended to remain around after the process goes
         * away.
         *
         * <p><em>Derived classes must call through to the super class's
         * implementation of this method.  If they do not, an exception will be
         * thrown.</em></p>
         *
         * @see #onPause
         * @see #onStop
         * @see #finish
         * @see #isFinishing
         */
        protected onDestroy():void  {
            if (Activity.DEBUG_LIFECYCLE) Log.v(Activity.TAG, "onDestroy " + this);
            this.mCalled = true;
            //// dismiss any dialogs we are managing.
            //if (this.mManagedDialogs != null) {
            //    const numDialogs:number = this.mManagedDialogs.size();
            //    for (let i:number = 0; i < numDialogs; i++) {
            //        const md:Activity.ManagedDialog = this.mManagedDialogs.valueAt(i);
            //        if (md.mDialog.isShowing()) {
            //            md.mDialog.dismiss();
            //        }
            //    }
            //    this.mManagedDialogs = null;
            //}
            //// close any cursors we are managing.
            //{
            //    let numCursors:number = this.mManagedCursors.size();
            //    for (let i:number = 0; i < numCursors; i++) {
            //        let c:Activity.ManagedCursor = this.mManagedCursors.get(i);
            //        if (c != null) {
            //            c.mCursor.close();
            //        }
            //    }
            //    this.mManagedCursors.clear();
            //}
            //// Close any open search dialog
            //if (this.mSearchManager != null) {
            //    this.mSearchManager.stopSearch();
            //}
            this.getApplication().dispatchActivityDestroyed(this);
        }

        /**
         * Finds a view that was identified by the id attribute from the XML that
         * was processed in {@link #onCreate}.
         *
         * @return The view if found or null otherwise.
         */
        findViewById(id:string):View  {
            return this.getWindow().findViewById(id);
        }

        /**
         * Set the activity content to an explicit view.  This view is placed
         * directly into the activity's view hierarchy.  It can itself be a complex
         * view hierarchy.  When calling this method, the layout parameters of the
         * specified view are ignored.  Both the width and the height of the view are
         * set by default to {@link ViewGroup.LayoutParams#MATCH_PARENT}. To use
         * your own layout parameters, invoke
         * {@link #setContentView(android.view.View, android.view.ViewGroup.LayoutParams)}
         * instead.
         *
         * @param view The desired content to display.
         *
         * @see #setContentView(int)
         * @see #setContentView(android.view.View, android.view.ViewGroup.LayoutParams)
         */
        setContentView(view:View|HTMLElement|string, params?:ViewGroup.LayoutParams){
            if(!(view instanceof View)){
                view = this.getLayoutInflater().inflate(<HTMLElement|string>view);
            }
            this.getWindow().setContentView(<View>view, params);
            //this.initActionBar();
        }

        addContentView(view:View, params:ViewGroup.LayoutParams){
            this.mWindow.addContentView(view, params);
        }

        /**
         * Sets whether this activity is finished when touched outside its window's
         * bounds.
         */
        setFinishOnTouchOutside(finish:boolean):void  {
            this.mWindow.setCloseOnTouchOutside(finish);
        }


        /**
         * Called when a key was pressed down and not handled by any of the views
         * inside of the activity. So, for example, key presses while the cursor
         * is inside a TextView will not trigger the event (unless it is a navigation
         * to another object) because TextView handles its own key presses.
         *
         * <p>If the focused view didn't want this event, this method is called.
         *
         * <p>The default implementation takes care of {@link KeyEvent#KEYCODE_BACK}
         * by calling {@link #onBackPressed()}, though the behavior varies based
         * on the application compatibility mode: for
         * {@link android.os.Build.VERSION_CODES#ECLAIR} or later applications,
         * it will set up the dispatch to call {@link #onKeyUp} where the action
         * will be performed; for earlier applications, it will perform the
         * action immediately in on-down, as those versions of the platform
         * behaved.
         *
         * <p>Other additional default key handling may be performed
         * if configured with {@link #setDefaultKeyMode}.
         *
         * @return Return <code>true</code> to prevent this event from being propagated
         * further, or <code>false</code> to indicate that you have not handled
         * this event and it should continue to be propagated.
         * @see #onKeyUp
         * @see android.view.KeyEvent
         */
        onKeyDown(keyCode:number, event:KeyEvent):boolean  {
            if (keyCode == KeyEvent.KEYCODE_BACK) {
                event.startTracking();
                return true;
            }
            //if (this.mDefaultKeyMode == Activity.DEFAULT_KEYS_DISABLE) {
            //    return false;
            //} else if (this.mDefaultKeyMode == Activity.DEFAULT_KEYS_SHORTCUT) {
            //    if (this.getWindow().performPanelShortcut(Window.FEATURE_OPTIONS_PANEL, keyCode, event, Menu.FLAG_ALWAYS_PERFORM_CLOSE)) {
            //        return true;
            //    }
            //    return false;
            //} else {
            //    // Common code for DEFAULT_KEYS_DIALER & DEFAULT_KEYS_SEARCH_*
            //    let clearSpannable:boolean = false;
            //    let handled:boolean;
            //    if ((event.getRepeatCount() != 0) || event.isSystem()) {
            //        clearSpannable = true;
            //        handled = false;
            //    } else {
            //        handled = TextKeyListener.getInstance().onKeyDown(null, this.mDefaultKeySsb, keyCode, event);
            //        if (handled && this.mDefaultKeySsb.length() > 0) {
            //            // something useable has been typed - dispatch it now.
            //            const str:string = this.mDefaultKeySsb.toString();
            //            clearSpannable = true;
            //            switch(this.mDefaultKeyMode) {
            //                case Activity.DEFAULT_KEYS_DIALER:
            //                    let intent:Intent = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + str));
            //                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            //                    this.startActivity(intent);
            //                    break;
            //                case Activity.DEFAULT_KEYS_SEARCH_LOCAL:
            //                    this.startSearch(str, false, null, false);
            //                    break;
            //                case Activity.DEFAULT_KEYS_SEARCH_GLOBAL:
            //                    this.startSearch(str, false, null, true);
            //                    break;
            //            }
            //        }
            //    }
            //    if (clearSpannable) {
            //        this.mDefaultKeySsb.clear();
            //        this.mDefaultKeySsb.clearSpans();
            //        Selection.setSelection(this.mDefaultKeySsb, 0);
            //    }
            //    return handled;
            //}
            return false;
        }

        /**
         * Default implementation of {@link KeyEvent.Callback#onKeyLongPress(int, KeyEvent)
         * KeyEvent.Callback.onKeyLongPress()}: always returns false (doesn't handle
         * the event).
         */
        onKeyLongPress(keyCode:number, event:KeyEvent):boolean  {
            return false;
        }

        /**
         * Called when a key was released and not handled by any of the views
         * inside of the activity. So, for example, key presses while the cursor
         * is inside a TextView will not trigger the event (unless it is a navigation
         * to another object) because TextView handles its own key presses.
         *
         * <p>The default implementation handles KEYCODE_BACK to stop the activity
         * and go back.
         *
         * @return Return <code>true</code> to prevent this event from being propagated
         * further, or <code>false</code> to indicate that you have not handled
         * this event and it should continue to be propagated.
         * @see #onKeyDown
         * @see KeyEvent
         */
        onKeyUp(keyCode:number, event:KeyEvent):boolean  {
            if (keyCode == KeyEvent.KEYCODE_BACK && event.isTracking() && !event.isCanceled()) {
                this.onBackPressed();
                return true;
            }
            return false;
        }

        /**
         * Called when the activity has detected the user's press of the back
         * key.  The default implementation simply finishes the current activity,
         * but you can override this to do whatever you want.
         */
        onBackPressed():void  {
            //if (!this.mFragments.popBackStackImmediate()) {
                this.finish();
            //}
        }

        /**
         * Called when a touch screen event was not handled by any of the views
         * under it.  This is most useful to process touch events that happen
         * outside of your window bounds, where there is no view to receive it.
         *
         * @param event The touch screen event being processed.
         *
         * @return Return true if you have consumed the event, false if you haven't.
         * The default implementation always returns false.
         */
        onTouchEvent(event:MotionEvent):boolean  {
            if (this.mWindow.shouldCloseOnTouch(this, event)) {
                this.finish();
                return true;
            }
            return false;
        }

        /**
         * Called when a generic motion event was not handled by any of the
         * views inside of the activity.
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
        onGenericMotionEvent(event:MotionEvent):boolean  {
            return false;
        }
        /**
         * Called whenever a key, touch, or trackball event is dispatched to the
         * activity.  Implement this method if you wish to know that the user has
         * interacted with the device in some way while your activity is running.
         * This callback and {@link #onUserLeaveHint} are intended to help
         * activities manage status bar notifications intelligently; specifically,
         * for helping activities determine the proper time to cancel a notfication.
         *
         * <p>All calls to your activity's {@link #onUserLeaveHint} callback will
         * be accompanied by calls to {@link #onUserInteraction}.  This
         * ensures that your activity will be told of relevant user activity such
         * as pulling down the notification pane and touching an item there.
         *
         * <p>Note that this callback will be invoked for the touch down action
         * that begins a touch gesture, but may not be invoked for the touch-moved
         * and touch-up actions that follow.
         *
         * @see #onUserLeaveHint()
         */
        onUserInteraction():void  {
        }

        onWindowAttributesChanged(params:WindowManager.LayoutParams):void  {
            // this activity is not embedded.
            //if (this.mParent == null) {
                let decor:View = this.getWindow().getDecorView();
                if (decor != null && decor.getParent() != null) {
                    this.getWindowManager().updateWindowLayout(this.getWindow(), params);
                }
            //}
        }

        onContentChanged():void  {
        }

        /**
         * Called when the current {@link Window} of the activity gains or loses
         * focus.  This is the best indicator of whether this activity is visible
         * to the user.  The default implementation clears the key tracking
         * state, so should always be called.
         *
         * <p>Note that this provides information about global focus state, which
         * is managed independently of activity lifecycles.  As such, while focus
         * changes will generally have some relation to lifecycle changes (an
         * activity that is stopped will not generally get window focus), you
         * should not rely on any particular order between the callbacks here and
         * those in the other lifecycle methods such as {@link #onResume}.
         *
         * <p>As a general rule, however, a resumed activity will have window
         * focus...  unless it has displayed other dialogs or popups that take
         * input focus, in which case the activity itself will not have focus
         * when the other windows have it.  Likewise, the system may display
         * system-level windows (such as the status bar notification panel or
         * a system alert) which will temporarily take window input focus without
         * pausing the foreground activity.
         *
         * @param hasFocus Whether the window of this activity has focus.
         *
         * @see #hasWindowFocus()
         * @see #onResume
         * @see View#onWindowFocusChanged(boolean)
         */
        onWindowFocusChanged(hasFocus:boolean):void  {
        }

        /**
         * Called when the main window associated with the activity has been
         * attached to the window manager.
         * See {@link View#onAttachedToWindow() View.onAttachedToWindow()}
         * for more information.
         * @see View#onAttachedToWindow
         */
        onAttachedToWindow():void  {
        }

        /**
         * Called when the main window associated with the activity has been
         * detached from the window manager.
         * See {@link View#onDetachedFromWindow() View.onDetachedFromWindow()}
         * for more information.
         * @see View#onDetachedFromWindow
         */
        onDetachedFromWindow():void  {
        }

        /**
         * Returns true if this activity's <em>main</em> window currently has window focus.
         * Note that this is not the same as the view itself having focus.
         *
         * @return True if this activity's main window currently has window focus.
         *
         * @see #onWindowAttributesChanged(android.view.WindowManager.LayoutParams)
         */
        hasWindowFocus():boolean  {
            let w:Window = this.getWindow();
            if (w != null) {
                let d:View = w.getDecorView();
                if (d != null) {
                    return d.hasWindowFocus();
                }
            }
            return false;
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
        dispatchKeyEvent(event:KeyEvent):boolean  {
            this.onUserInteraction();
            let win:Window = this.getWindow();
            if (win.superDispatchKeyEvent(event)) {
                return true;
            }
            let decor:View = win.getDecorView();
            return event.dispatch(this, decor != null ? decor.getKeyDispatcherState() : null, this);
        }

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
        dispatchTouchEvent(ev:MotionEvent):boolean  {
            if (ev.getAction() == MotionEvent.ACTION_DOWN) {
                this.onUserInteraction();
            }
            if (this.getWindow().superDispatchTouchEvent(ev)) {
                return true;
            }
            return this.onTouchEvent(ev);
        }

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
        dispatchGenericMotionEvent(ev:MotionEvent):boolean  {
            this.onUserInteraction();
            if (this.getWindow().superDispatchGenericMotionEvent(ev)) {
                return true;
            }
            return this.onGenericMotionEvent(ev);
        }

        /**
         * Request that key events come to this activity. Use this if your
         * activity has no views with focus, but the activity still wants
         * a chance to process key events.
         *
         * @see android.view.Window#takeKeyEvents
         */
        takeKeyEvents(_get:boolean):void  {
            this.getWindow().takeKeyEvents(_get);
        }


        /**
         * Declare that the options menu has changed, so should be recreated.
         * The {@link #onCreateOptionsMenu(Menu)} method will be called the next
         * time it needs to be displayed.
         */
        private invalidateOptionsMenu():void {
            let menu = new android.view.Menu(this);
            if(this.onCreateOptionsMenu(menu)){
                menu.setCallback({
                    onMenuItemSelected : (menu, item)=>{
                        let handle = this.onOptionsItemSelected(item);
                        this.onOptionsMenuClosed(menu);
                        return handle;
                    }
                });
                this.mMenu = menu;
                this.mMenuPopuoHelper = this.invalidateOptionsMenuPopupHelper(menu);
            }
        }

        protected invalidateOptionsMenuPopupHelper(menu:android.view.Menu):android.view.menu.MenuPopupHelper {
            //TODO support menu for fullscreen activity
            return null;
            // this.mMenuPopuoHelper = new android.view.menu.MenuPopupHelper(this, menu, this.getActionBar().mActionRight);
        }

        /**
         * Initialize the contents of the Activity's standard options menu.  You
         * should place your menu items in to <var>menu</var>.
         *
         * <p>This is only called once, the first time the options menu is
         * displayed.  To update the menu every time it is displayed, see
         * {@link #onPrepareOptionsMenu}.
         *
         * <p>The default implementation populates the menu with standard system
         * menu items.  These are placed in the {@link Menu#CATEGORY_SYSTEM} group so that
         * they will be correctly ordered with application-defined menu items.
         * Deriving classes should always call through to the base implementation.
         *
         * <p>You can safely hold on to <var>menu</var> (and any items created
         * from it), making modifications to it as desired, until the next
         * time onCreateOptionsMenu() is called.
         *
         * <p>When you add items to the menu, you can implement the Activity's
         * {@link #onOptionsItemSelected} method to handle them there.
         *
         * @param menu The options menu in which you place your items.
         *
         * @return You must return true for the menu to be displayed;
         *         if you return false it will not be shown.
         *
         * @see #onPrepareOptionsMenu
         * @see #onOptionsItemSelected
         */
        onCreateOptionsMenu(menu:android.view.Menu):boolean  {
            return true;
        }

        /**
         * Prepare the Screen's standard options menu to be displayed.  This is
         * called right before the menu is shown, every time it is shown.  You can
         * use this method to efficiently enable/disable items or otherwise
         * dynamically modify the contents.
         *
         * <p>The default implementation updates the system menu items based on the
         * activity's state.  Deriving classes should always call through to the
         * base class implementation.
         *
         * @param menu The options menu as last shown or first initialized by
         *             onCreateOptionsMenu().
         *
         * @return You must return true for the menu to be displayed;
         *         if you return false it will not be shown.
         *
         * @see #onCreateOptionsMenu
         */
        onPrepareOptionsMenu(menu:android.view.Menu):boolean  {
            return true;
        }

        /**
         * This hook is called whenever an item in your options menu is selected.
         * The default implementation simply returns false to have the normal
         * processing happen (calling the item's Runnable or sending a message to
         * its Handler as appropriate).  You can use this method for any items
         * for which you would like to do processing without those other
         * facilities.
         *
         * <p>Derived classes should call through to the base class for it to
         * perform the default menu handling.</p>
         *
         * @param item The menu item that was selected.
         *
         * @return boolean Return false to allow normal menu processing to
         *         proceed, true to consume it here.
         *
         * @see #onCreateOptionsMenu
         */
        onOptionsItemSelected(item:android.view.MenuItem):boolean  {
            return false;
        }

        /**
         * This hook is called whenever the options menu is being closed (either by the user canceling
         * the menu with the back/menu button, or when an item is selected).
         *
         * @param menu The options menu as last shown or first initialized by
         *             onCreateOptionsMenu().
         */
        onOptionsMenuClosed(menu:android.view.Menu):void  {
        }

        /**
         * Programmatically opens the options menu. If the options menu is already
         * open, this method does nothing.
         */
        openOptionsMenu():void {
            if(this.mMenuPopuoHelper) this.mMenuPopuoHelper.show();
        }

        /**
         * Progammatically closes the options menu. If the options menu is already
         * closed, this method does nothing.
         */
        closeOptionsMenu():void  {
            if(this.mMenuPopuoHelper) this.mMenuPopuoHelper.dismiss();
        }

        /**
         * Launch an activity for which you would like a result when it finished.
         * When this activity exits, your
         * onActivityResult() method will be called with the given requestCode.
         * Using a negative requestCode is the same as calling
         * {@link #startActivity} (the activity is not launched as a sub-activity).
         *
         * <p>Note that this method should only be used with Intent protocols
         * that are defined to return a result.  In other protocols (such as
         * {@link Intent#ACTION_MAIN} or {@link Intent#ACTION_VIEW}), you may
         * not get the result when you expect.  For example, if the activity you
         * are launching uses the singleTask launch mode, it will not run in your
         * task and thus you will immediately receive a cancel result.
         *
         * <p>As a special case, if you call startActivityForResult() with a requestCode
         * >= 0 during the initial onCreate(Bundle savedInstanceState)/onResume() of your
         * activity, then your window will not be displayed until a result is
         * returned back from the started activity.  This is to avoid visible
         * flickering when redirecting to another activity.
         *
         * <p>This method throws {@link android.content.ActivityNotFoundException}
         * if there was no Activity found to run the given Intent.
         *
         * @param intent The intent to start.
         * @param requestCode If >= 0, this code will be returned in
         *                    onActivityResult() when the activity exits.
         * @param options Additional options for how the Activity should be started.
         * See {@link android.content.Context#startActivity(Intent, Bundle)
         * Context.startActivity(Intent, Bundle)} for more details.
         *
         * @throws android.content.ActivityNotFoundException
         *
         * @see #startActivity
         */
        startActivityForResult(intent:Intent|string, requestCode:number, options?:Bundle):void  {
            if(typeof intent === 'string') intent = new Intent(<string>intent);
            if(requestCode>=0) (<Intent>intent).mRequestCode = requestCode;

            this.androidUI.mActivityThread.execStartActivity(this, <Intent>intent, options);

            //    let ar:Instrumentation.ActivityResult = this.mInstrumentation.execStartActivity(this, this.mMainThread.getApplicationThread(), this.mToken, this, intent, requestCode, options);
            //    if (ar != null) {
            //        this.mMainThread.sendActivityResult(this.mToken, this.mEmbeddedID, requestCode, ar.getResultCode(), ar.getResultData());
            //    }

            if (requestCode >= 0) {
                // If this start is requesting a result, we can avoid making
                // the activity visible until the result is received.  Setting
                // this code during onCreate(Bundle savedInstanceState) or onResume() will keep the
                // activity hidden during this time, to avoid flickering.
                // This can only be done when a result is requested because
                // that guarantees we will get information back when the
                // activity is finished, no matter what happens to it.
                this.mStartedActivity = true;
            }
            const decor:View = this.mWindow != null ? this.mWindow.peekDecorView() : null;
            if (decor != null) {
                decor.cancelPendingInputEvents();
            }
            // TODO Consider clearing/flushing other event sources and events for child windows.
        }

        /**
         * Launch a new activity.  You will not receive any information about when
         * the activity exits.  This implementation overrides the base version,
         * providing information about
         * the activity performing the launch.  Because of this additional
         * information, the {@link Intent#FLAG_ACTIVITY_NEW_TASK} launch flag is not
         * required; if not specified, the new activity will be added to the
         * task of the caller.
         *
         * <p>This method throws {@link android.content.ActivityNotFoundException}
         * if there was no Activity found to run the given Intent.
         *
         * @param intents The intents to start.
         * @param options Additional options for how the Activity should be started.
         * See {@link android.content.Context#startActivity(Intent, Bundle)
         * Context.startActivity(Intent, Bundle)} for more details.
         *
         * @throws android.content.ActivityNotFoundException
         *
         * @see {@link #startActivities(Intent[])}
         * @see #startActivityForResult
         */
        startActivities(intents:Intent[], options?:Bundle):void  {
            for(let intent of intents){
                this.startActivity(intent, options);
            }
        }


        /**
         * Launch a new activity.  You will not receive any information about when
         * the activity exits.  This implementation overrides the base version,
         * providing information about
         * the activity performing the launch.  Because of this additional
         * information, the {@link Intent#FLAG_ACTIVITY_NEW_TASK} launch flag is not
         * required; if not specified, the new activity will be added to the
         * task of the caller.
         *
         * <p>This method throws {@link android.content.ActivityNotFoundException}
         * if there was no Activity found to run the given Intent.
         *
         * @param intent The intent to start.
         * @param options Additional options for how the Activity should be started.
         * See {@link android.content.Context#startActivity(Intent, Bundle)
         * Context.startActivity(Intent, Bundle)} for more details.
         *
         * @throws android.content.ActivityNotFoundException
         *
         * @see {@link #startActivity(Intent)}
         * @see #startActivityForResult
         */
        startActivity(intent:Intent|string, options?:Bundle):void  {
            if (options != null) {
                this.startActivityForResult(intent, -1, options);
            } else {
                // Note we want to go through this call for compatibility with
                // applications that may have overridden the method.
                this.startActivityForResult(intent, -1);
            }
        }


        /**
         * A special variation to launch an activity only if a new activity
         * instance is needed to handle the given Intent.  In other words, this is
         * just like {@link #startActivityForResult(Intent, int)} except: if you are
         * using the {@link Intent#FLAG_ACTIVITY_SINGLE_TOP} flag, or
         * singleTask or singleTop
         * {@link android.R.styleable#AndroidManifestActivity_launchMode launchMode},
         * and the activity
         * that handles <var>intent</var> is the same as your currently running
         * activity, then a new instance is not needed.  In this case, instead of
         * the normal behavior of calling {@link #onNewIntent} this function will
         * return and you can handle the Intent yourself.
         *
         * <p>This function can only be called from a top-level activity; if it is
         * called from a child activity, a runtime exception will be thrown.
         *
         * @param intent The intent to start.
         * @param requestCode If >= 0, this code will be returned in
         *         onActivityResult() when the activity exits, as described in
         *         {@link #startActivityForResult}.
         * @param options Additional options for how the Activity should be started.
         * See {@link android.content.Context#startActivity(Intent, Bundle)
         * Context.startActivity(Intent, Bundle)} for more details.
         *
         * @return If a new activity was launched then true is returned; otherwise
         *         false is returned and you must handle the Intent yourself.
         *
         * @see #startActivity
         * @see #startActivityForResult
         */
        startActivityIfNeeded(intent:Intent, requestCode:number, options?:Bundle):boolean  {
            if(this.androidUI.mActivityThread.canBackTo(intent)){
                return false;
            }
            this.startActivityForResult(intent, requestCode, options);
            return true;
            //let result:number = ActivityManager.START_RETURN_INTENT_TO_CALLER;
            //try {
            //    intent.migrateExtraStreamToClipData();
            //    intent.prepareToLeaveProcess();
            //    result = ActivityManagerNative.getDefault().startActivity(this.mMainThread.getApplicationThread(), this.getBasePackageName(), intent, intent.resolveTypeIfNeeded(this.getContentResolver()), this.mToken, this.mEmbeddedID, requestCode, ActivityManager.START_FLAG_ONLY_IF_NEEDED, null, null, options);
            //} catch (e){
            //}
            //Instrumentation.checkStartActivityResult(result, intent);
            //if (requestCode >= 0) {
            //    // If this start is requesting a result, we can avoid making
            //    // the activity visible until the result is received.  Setting
            //    // this code during onCreate(Bundle savedInstanceState) or onResume() will keep the
            //    // activity hidden during this time, to avoid flickering.
            //    // This can only be done when a result is requested because
            //    // that guarantees we will get information back when the
            //    // activity is finished, no matter what happens to it.
            //    this.mStartedActivity = true;
            //}
            //return result != ActivityManager.START_RETURN_INTENT_TO_CALLER;
        }

        /**
         * Call before one of the flavors of {@link #startActivity(Intent)}
         * or {@link #finish} to specify an explicit transition animation to
         * perform next.
         */
        overrideNextTransition(enterAnimation:Animation, exitAnimation:Animation, resumeAnimation:Animation, hideAnimation:Animation):void {
            this.androidUI.mActivityThread.overrideNextWindowAnimation(enterAnimation, exitAnimation, resumeAnimation, hideAnimation);
        }

        /**
         * Call this to set the result that your activity will return to its
         * caller.
         *
         * <p>As of {@link android.os.Build.VERSION_CODES#GINGERBREAD}, the Intent
         * you supply here can have {@link Intent#FLAG_GRANT_READ_URI_PERMISSION
         * Intent.FLAG_GRANT_READ_URI_PERMISSION} and/or {@link Intent#FLAG_GRANT_WRITE_URI_PERMISSION
         * Intent.FLAG_GRANT_WRITE_URI_PERMISSION} set.  This will grant the
         * Activity receiving the result access to the specific URIs in the Intent.
         * Access will remain until the Activity has finished (it will remain across the hosting
         * process being killed and other temporary destruction) and will be added
         * to any existing set of URI permissions it already holds.
         *
         * @param resultCode The result code to propagate back to the originating
         *                   activity, often RESULT_CANCELED or RESULT_OK
         * @param data The data to propagate back to the originating activity.
         *
         * @see #RESULT_CANCELED
         * @see #RESULT_OK
         * @see #RESULT_FIRST_USER
         * @see #setResult(int)
         */
        setResult(resultCode:number, data?:Intent):void  {
            {
                this.mResultCode = resultCode;
                this.mResultData = data;
            }
        }

        /**
         * Return the name of the activity that invoked this activity.  This is
         * who the data in {@link #setResult setResult()} will be sent to.  You
         * can use this information to validate that the recipient is allowed to
         * receive the data.
         *
         * <p class="note">Note: if the calling activity is not expecting a result (that is it
         * did not use the {@link #startActivityForResult}
         * form that includes a request code), then the calling package will be
         * null.
         *
         * @return The className of the activity that will receive your
         *         reply, or null if none.
         */
        getCallingActivity():string  {
            //FIXME not support yet
            return null;
        }


        /**
         * Control whether this activity's main window is visible.  This is intended
         * only for the special case of an activity that is not going to show a
         * UI itself, but can't just finish prior to onResume() because it needs
         * to wait for a service binding or such.  Setting this to false allows
         * you to prevent your UI from being shown during that time.
         *
         * <p>The default value for this is taken from the
         * {@link android.R.attr#windowNoDisplay} attribute of the activity's theme.
         */
        setVisible(visible:boolean):void  {
            if (this.mVisibleFromClient != visible) {
                this.mVisibleFromClient = visible;
                //if (this.mVisibleFromServer) {
                //    if (visible)
                //        this.makeVisible();
                //    else
                //        this.getWindow().getDecorView().setVisibility(View.INVISIBLE);
                //}
            }
        }

        makeVisible():void  {
            if (!this.mWindowAdded) {
                let wm:WindowManager = this.getGlobalWindowManager();
                wm.addWindow(this.getWindow());
                this.mWindowAdded = true;
            }
            this.getWindow().getDecorView().setVisibility(View.VISIBLE);
        }

        /**
         * Check to see whether this activity is in the process of finishing,
         * either because you called {@link #finish} on it or someone else
         * has requested that it finished.  This is often used in
         * {@link #onPause} to determine whether the activity is simply pausing or
         * completely finishing.
         *
         * @return If the activity is finishing, returns true; else returns false.
         *
         * @see #finish
         */
        isFinishing():boolean  {
            return this.mFinished;
        }

        /**
         * Returns true if the final {@link #onDestroy()} call has been made
         * on the Activity, so this instance is now dead.
         */
        isDestroyed():boolean  {
            return this.mDestroyed;
        }

        /**
         * Call this when your activity is done and should be closed.  The
         * ActivityResult is propagated back to whoever launched you via
         * onActivityResult().
         */
        finish():void  {
            let resultCode:number = this.mResultCode;
            let resultData:Intent = this.mResultData;
            try {
                this.androidUI.mActivityThread.scheduleDestroyActivity(this);
                //if (resultData != null) {
                //    resultData.prepareToLeaveProcess();
                //}
                //if (ActivityManagerNative.getDefault().finishActivity(this.mToken, resultCode, resultData)) {
                //    this.mFinished = true;
                //}
            } catch (e){
            }
        }

        /**
         * Force finish another activity that you had previously started with
         * {@link #startActivityForResult}.
         *
         * @param requestCode The request code of the activity that you had
         *                    given to startActivityForResult().  If there are multiple
         *                    activities started with this request code, they
         *                    will all be finished.
         */
        finishActivity(requestCode:number):void  {
            this.androidUI.mActivityThread.scheduleDestroyActivityByRequestCode(requestCode);
        }

        /**
         * Called when an activity you launched exits, giving you the requestCode
         * you started it with, the resultCode it returned, and any additional
         * data from it.  The <var>resultCode</var> will be
         * {@link #RESULT_CANCELED} if the activity explicitly returned that,
         * didn't return any result, or crashed during its operation.
         *
         * <p>You will receive this call immediately before onResume() when your
         * activity is re-starting.
         *
         * @param requestCode The integer request code originally supplied to
         *                    startActivityForResult(), allowing you to identify who this
         *                    result came from.
         * @param resultCode The integer result code returned by the child activity
         *                   through its setResult().
         * @param data An Intent, which can return result data to the caller
         *               (various data can be attached to Intent "extras").
         *
         * @see #startActivityForResult
         * @see #createPendingResult
         * @see #setResult(int)
         */
        protected onActivityResult(requestCode:number, resultCode:number, data:Intent):void  {
        }

        /**
         * Change the title associated with this activity.  If this is a
         * top-level activity, the title for its window will change.  If it
         * is an embedded activity, the parent can do whatever it wants
         * with it.
         */
        setTitle(title:string):void  {
            this.getWindow().setTitle(title);
            this.onTitleChanged(title);
        }

        getTitle():string  {
            return this.getWindow().getAttributes().getTitle();
        }

        protected onTitleChanged(title:string, color?:number):void  {
            //if (this.mTitleReady) {
                const win:Window = this.getWindow();
                if (win != null) {
                    win.setTitle(title);
                    //if (color != 0) {
                    //    win.setTitleColor(color);
                    //}
                }
            //}
        }

        /**
         * Runs the specified action on the UI thread. If the current thread is the UI
         * thread, then the action is executed immediately. If the current thread is
         * not the UI thread, the action is posted to the event queue of the UI thread.
         *
         * @param action the action to run on the UI thread
         */
        runOnUiThread(action:Runnable):void {
            action.run();
        }


        /**
         * Navigate from this activity to the activity specified by upIntent, finishing this activity
         * in the process. If the activity indicated by upIntent already exists in the task's history,
         * this activity and all others before the indicated activity in the history stack will be
         * finished.
         *
         * <p>If the indicated activity does not appear in the history stack, this will finish
         * each activity in this task until the root activity of the task is reached, resulting in
         * an "in-app home" behavior. This can be useful in apps with a complex navigation hierarchy
         * when an activity may be reached by a path not passing through a canonical parent
         * activity.</p>
         *
         * <p>This method should be used when performing up navigation from within the same task
         * as the destination. If up navigation should cross tasks in some cases, see
         * {@link #shouldUpRecreateTask(Intent)}.</p>
         *
         * @param upIntent An intent representing the target destination for up navigation
         *
         * @return true if up navigation successfully reached the activity indicated by upIntent and
         *         upIntent was delivered to it. false if an instance of the indicated activity could
         *         not be found and this activity was simply finished normally.
         */
        navigateUpTo(upIntent:Intent, upToRootIfNotFound=true):boolean  {
            if(this.androidUI.mActivityThread.scheduleBackTo(upIntent)){
                return true;
            }
            if(upToRootIfNotFound) this.androidUI.mActivityThread.scheduleBackToRoot();
            return false;
        //    //let destInfo:ComponentName = upIntent.getComponent();
        //    //if (destInfo == null) {
        //    //    destInfo = upIntent.resolveActivity(this.getPackageManager());
        //    //    if (destInfo == null) {
        //    //        return false;
        //    //    }
        //    //    upIntent = new Intent(upIntent);
        //    //    upIntent.setComponent(destInfo);
        //    //}
        //    let resultCode:number = this.mResultCode;
        //    let resultData:Intent = this.mResultData;
        //    //if (resultData != null) {
        //        //resultData.prepareToLeaveProcess();
        //    //}
        //    //try {
        //    //    upIntent.prepareToLeaveProcess();
        //    //    return ActivityManagerNative.getDefault().navigateUpTo(this.mToken, upIntent, resultCode, resultData);
        //    //} catch (e){
        //    //    return false;
        //    //}
        //
        //    return false;
        }

        constructor(androidUI:androidui.AndroidUI) {
            super(androidUI);

            this.mWindow = new Window(this);
            this.mWindow.setWindowAnimations(android.R.anim.activity_open_enter_ios, android.R.anim.activity_close_exit_ios,
                android.R.anim.activity_close_enter_ios, android.R.anim.activity_open_exit_ios);
            this.mWindow.setDimAmount(0.7);
            this.mWindow.getAttributes().flags |= WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH;
            this.mWindow.setCallback(this);
        }


        private performCreate(icicle:Bundle):void  {
            this.onCreate(icicle);
            this.invalidateOptionsMenu();
            //this.mVisibleFromClient = !this.mWindow.getWindowStyle().getBoolean(com.android.internal.R.styleable.Window_windowNoDisplay, false);
            //this.mFragments.dispatchActivityCreated();
        }


        private performStart():void  {
            //this.mFragments.noteStateNotSaved();
            this.mCalled = false;
            //this.mFragments.execPendingActions();
            this.onStart();//this.mInstrumentation.callActivityOnStart(this);
            if (!this.mCalled) {
                throw Error(`new SuperNotCalledException("Activity " + this.mComponent.toShortString() + " did not call through to super.onStart()")`);
            }
            //this.mFragments.dispatchStart();
            //if (this.mAllLoaderManagers != null) {
            //    const N:number = this.mAllLoaderManagers.size();
            //    let loaders:LoaderManagerImpl = new Array<LoaderManagerImpl>(N);
            //    for (let i:number = N - 1; i >= 0; i--) {
            //        loaders[i] = this.mAllLoaderManagers.valueAt(i);
            //    }
            //    for (let i:number = 0; i < N; i++) {
            //        let lm:LoaderManagerImpl = loaders[i];
            //        lm.finishRetain();
            //        lm.doReportStart();
            //    }
            //}
        }

        private performRestart():void  {
            //this.mFragments.noteStateNotSaved();
            if (this.mStopped) {
                this.mStopped = false;
                //if (this.mToken != null && this.mParent == null) {
                //    WindowManagerGlobal.getInstance().setStoppedState(this.mToken, false);
                //}
                //{
                //    const N:number = this.mManagedCursors.size();
                //    for (let i:number = 0; i < N; i++) {
                //        let mc:Activity.ManagedCursor = this.mManagedCursors.get(i);
                //        if (mc.mReleased || mc.mUpdated) {
                //            if (!mc.mCursor.requery()) {
                //                if (this.getApplicationInfo().targetSdkVersion >= android.os.Build.VERSION_CODES.ICE_CREAM_SANDWICH) {
                //                    throw Error(`new IllegalStateException("trying to requery an already closed cursor  " + mc.mCursor)`);
                //                }
                //            }
                //            mc.mReleased = false;
                //            mc.mUpdated = false;
                //        }
                //    }
                //}
                this.mCalled = false;
                this.onRestart();//this.mInstrumentation.callActivityOnRestart(this);
                if (!this.mCalled) {
                    throw Error(`new SuperNotCalledException("Activity " + this.mComponent.toShortString() + " did not call through to super.onRestart()")`);
                }
                this.performStart();
            }
        }

        private performResume():void  {
            this.performRestart();
            //this.mFragments.execPendingActions();
            //this.mLastNonConfigurationInstances = null;
            this.mCalled = false;
            // mResumed is set by the instrumentation
            this.mResumed = true;
            this.onResume();//this.mInstrumentation.callActivityOnResume(this);
            if (!this.mCalled) {
                throw Error(`new SuperNotCalledException("Activity " + this.mComponent.toShortString() + " did not call through to super.onResume()")`);
            }
            // Now really resume, and install the current status bar and menu.
            this.mCalled = false;
            //this.mFragments.dispatchResume();
            //this.mFragments.execPendingActions();
            this.onPostResume();
            if (!this.mCalled) {
                throw Error(`new SuperNotCalledException("Activity " + this.mComponent.toShortString() + " did not call through to super.onPostResume()")`);
            }
        }


        private performPause():void {
            if(this.mResumed) {
                //this.mDoReportFullyDrawn = false;
                //this.mFragments.dispatchPause();
                this.mCalled = false;
                this.onPause();
                this.mResumed = false;
                if (!this.mCalled) {
                    throw Error(`new SuperNotCalledException("Activity ${this.constructor.name} did not call through to super.onPause()")`);
                }
                this.mResumed = false;
            }
        }

        private performUserLeaving():void  {
            this.onUserInteraction();
            this.onUserLeaveHint();
        }

        private performStop():void  {
            //this.mDoReportFullyDrawn = false;
            //if (this.mLoadersStarted) {
            //    this.mLoadersStarted = false;
            //    if (this.mLoaderManager != null) {
            //        if (!this.mChangingConfigurations) {
            //            this.mLoaderManager.doStop();
            //        } else {
            //            this.mLoaderManager.doRetain();
            //        }
            //    }
            //}
            if (!this.mStopped) {
                //if (this.mWindow != null) {
                //    this.mWindow.closeAllPanels();
                //}
                //if (this.mToken != null && this.mParent == null) {
                //    WindowManagerGlobal.getInstance().setStoppedState(this.mToken, true);
                //}
                //this.mFragments.dispatchStop();
                this.mCalled = false;
                this.onStop();//this.mInstrumentation.callActivityOnStop(this);
                if (!this.mCalled) {
                    throw Error(`new SuperNotCalledException("Activity " + this.mComponent.toShortString() + " did not call through to super.onStop()")`);
                }
                //{
                //    const N:number = this.mManagedCursors.size();
                //    for (let i:number = 0; i < N; i++) {
                //        let mc:Activity.ManagedCursor = this.mManagedCursors.get(i);
                //        if (!mc.mReleased) {
                //            mc.mCursor.deactivate();
                //            mc.mReleased = true;
                //        }
                //    }
                //}
                this.mStopped = true;
            }
            this.mResumed = false;
        }
        private performDestroy():void  {
            this.mDestroyed = true;
            this.mWindow.destroy();
            //this.mFragments.dispatchDestroy();
            this.onDestroy();
            //if (this.mLoaderManager != null) {
            //    this.mLoaderManager.doDestroy();
            //}
        }

        isResumed():boolean  {
            return this.mResumed;
        }

        dispatchActivityResult(who:string, requestCode:number, resultCode:number, data:Intent):void  {
            // if (false) Log.v(Activity.TAG, "Dispatching result: who=" + who + ", reqCode=" + requestCode + ", resCode=" + resultCode + ", data=" + data);
            //this.mFragments.noteStateNotSaved();
            //if (who == null) {
                this.onActivityResult(requestCode, resultCode, data);
            //} else {
                //let frag:Fragment = this.mFragments.findFragmentByWho(who);
                //if (frag != null) {
                //    frag.onActivityResult(requestCode, resultCode, data);
                //}
            //}
        }
    }
}
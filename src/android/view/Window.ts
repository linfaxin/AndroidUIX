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

///<reference path="../../android/view/WindowManager.ts"/>
///<reference path="../../android/view/MotionEvent.ts"/>
///<reference path="../../android/widget/FrameLayout.ts"/>
///<reference path="../../android/graphics/PixelFormat.ts"/>
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../java/lang/Integer.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/view/KeyEvent.ts"/>
///<reference path="../../android/view/LayoutInflater.ts"/>
///<reference path="../../android/view/Surface.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewConfiguration.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/view/animation/Animation.ts"/>
///<reference path="../../android/view/animation/TranslateAnimation.ts"/>
///<reference path="../../android/content/Context.ts"/>
///<reference path="../../android/os/SystemClock.ts"/>
///<reference path="../../android/R/anim.ts"/>

module android.view {
import PixelFormat = android.graphics.PixelFormat;
import Drawable = android.graphics.drawable.Drawable;
import Integer = java.lang.Integer;
import Gravity = android.view.Gravity;
import KeyEvent = android.view.KeyEvent;
import LayoutInflater = android.view.LayoutInflater;
import MotionEvent = android.view.MotionEvent;
import Surface = android.view.Surface;
import View = android.view.View;
import ViewConfiguration = android.view.ViewConfiguration;
import ViewGroup = android.view.ViewGroup;
import WindowManager = android.view.WindowManager;
import Animation = android.view.animation.Animation;
import TranslateAnimation = android.view.animation.TranslateAnimation;
import FrameLayout = android.widget.FrameLayout;
import Context = android.content.Context;
import SystemClock = android.os.SystemClock;
    import Runnable = java.lang.Runnable;
/**
 * Abstract base class for a top-level window look and behavior policy.  An
 * instance of this class should be used as the top-level view added to the
 * window manager. It provides standard UI policies such as a background, title
 * area, default key processing, etc.
 *
 * <p>The only existing implementation of this abstract class is
 * android.policy.PhoneWindow, which you should instantiate when needing a
 * Window.  Eventually that class will be refactored and a factory method
 * added for creating Window instances without knowing about a particular
 * implementation.
 */
export class Window {

    ///** Flag for the "options panel" feature.  This is enabled by default. */
    //static FEATURE_OPTIONS_PANEL:number = 0;
    //
    ///** Flag for the "no title" feature, turning off the title at the top
    // *  of the screen. */
    //static FEATURE_NO_TITLE:number = 1;
    //
    ///** Flag for the progress indicator feature */
    //static FEATURE_PROGRESS:number = 2;
    //
    ///** Flag for having an icon on the left side of the title bar */
    //static FEATURE_LEFT_ICON:number = 3;
    //
    ///** Flag for having an icon on the right side of the title bar */
    //static FEATURE_RIGHT_ICON:number = 4;
    //
    ///** Flag for indeterminate progress */
    //static FEATURE_INDETERMINATE_PROGRESS:number = 5;
    //
    ///** Flag for the context menu.  This is enabled by default. */
    //static FEATURE_CONTEXT_MENU:number = 6;
    //
    ///** Flag for custom title. You cannot combine this feature with other title features. */
    //static FEATURE_CUSTOM_TITLE:number = 7;
    //
    ///**
    // * Flag for enabling the Action Bar.
    // * This is enabled by default for some devices. The Action Bar
    // * replaces the title bar and provides an alternate location
    // * for an on-screen menu button on some devices.
    // */
    //static FEATURE_ACTION_BAR:number = 8;
    //
    ///**
    // * Flag for requesting an Action Bar that overlays window content.
    // * Normally an Action Bar will sit in the space above window content, but if this
    // * feature is requested along with {@link #FEATURE_ACTION_BAR} it will be layered over
    // * the window content itself. This is useful if you would like your app to have more control
    // * over how the Action Bar is displayed, such as letting application content scroll beneath
    // * an Action Bar with a transparent background or otherwise displaying a transparent/translucent
    // * Action Bar over application content.
    // *
    // * <p>This mode is especially useful with {@link View#SYSTEM_UI_FLAG_FULLSCREEN
    // * View.SYSTEM_UI_FLAG_FULLSCREEN}, which allows you to seamlessly hide the
    // * action bar in conjunction with other screen decorations.
    // *
    // * <p>As of {@link android.os.Build.VERSION_CODES#JELLY_BEAN}, when an
    // * ActionBar is in this mode it will adjust the insets provided to
    // * {@link View#fitSystemWindows(android.graphics.Rect) View.fitSystemWindows(Rect)}
    // * to include the content covered by the action bar, so you can do layout within
    // * that space.
    // */
    //static FEATURE_ACTION_BAR_OVERLAY:number = 9;
    //
    ///**
    // * Flag for specifying the behavior of action modes when an Action Bar is not present.
    // * If overlay is enabled, the action mode UI will be allowed to cover existing window content.
    // */
    //static FEATURE_ACTION_MODE_OVERLAY:number = 10;
    //
    ///**
    // * Max value used as a feature ID
    // * @hide
    // */
    //static FEATURE_MAX:number = Window.FEATURE_ACTION_MODE_OVERLAY;
    //
    ///** Flag for setting the progress bar's visibility to VISIBLE */
    //static PROGRESS_VISIBILITY_ON:number = -1;
    //
    ///** Flag for setting the progress bar's visibility to GONE */
    //static PROGRESS_VISIBILITY_OFF:number = -2;
    //
    ///** Flag for setting the progress bar's indeterminate mode on */
    //static PROGRESS_INDETERMINATE_ON:number = -3;
    //
    ///** Flag for setting the progress bar's indeterminate mode off */
    //static PROGRESS_INDETERMINATE_OFF:number = -4;
    //
    ///** Starting value for the (primary) progress */
    //static PROGRESS_START:number = 0;
    //
    ///** Ending value for the (primary) progress */
    //static PROGRESS_END:number = 10000;
    //
    ///** Lowest possible value for the secondary progress */
    //static PROGRESS_SECONDARY_START:number = 20000;
    //
    ///** Highest possible value for the secondary progress */
    //static PROGRESS_SECONDARY_END:number = 30000;
    //
    ///** The default features enabled */
    //protected static DEFAULT_FEATURES:number = (1 << Window.FEATURE_OPTIONS_PANEL) | (1 << Window.FEATURE_CONTEXT_MENU);
    //
    ///**
    // * The ID that the main layout in the XML layout file should have.
    // */
    //static ID_ANDROID_CONTENT:string = android.R.id.content;
    //
    //private static PROPERTY_HARDWARE_UI:string = "persist.sys.ui.hw";

    private mContext:Context;

    //private mWindowStyle:TypedArray;

    private mCallback:Window.Callback;

    private mChildWindowManager:WindowManager;

    //private mAppToken:IBinder;

    //private mAppName:string;

    //private mHardwareAccelerated:boolean;

    private mContainer:WindowManager;


    private mIsActive:boolean = false;
    //
    //private mHasChildren:boolean = false;

    private mCloseOnTouchOutside:boolean = false;

    private mSetCloseOnTouchOutside:boolean = false;

    //private mForcedWindowFlags:number = 0;
    //
    //private mFeatures:number = Window.DEFAULT_FEATURES;
    //
    //private mLocalFeatures:number = Window.DEFAULT_FEATURES;

    //private mHaveWindowFormat:boolean = false;

    //private mHaveDimAmount:boolean = false;

    //private mDefaultWindowFormat:number = PixelFormat.OPAQUE;

    //private mHasSoftInputMode:boolean = false;

    private mDestroyed:boolean;

    // The current window attributes.
    private mWindowAttributes:WindowManager.LayoutParams = new WindowManager.LayoutParams();

    private mAttachInfo:View.AttachInfo;

    // This is the top-level view of the window, containing the window decor.
    private mDecor:DecorView;

    // This is the view in which the window contents are placed. It is either
    // mDecor itself, or a child of mDecor where the contents go.
    private mContentParent:ViewGroup;

    //private mTitle:string;

    constructor(context:Context) {
        this.mContext = context;

        this.initDecorView();
        this.initAttachInfo();
        this.getAttributes().setTitle(context.androidUI.appName);//default title
    }

    private initDecorView(){
        this.mDecor = new DecorView(this);
        this.mContentParent = new FrameLayout(this.mContext);
        this.mContentParent.setId(android.R.id.content);
        this.mDecor.addView(this.mContentParent, -1, -1);
    }

    private initAttachInfo(){
        let viewRootImpl = this.mContext.androidUI._viewRootImpl;
        this.mAttachInfo = new View.AttachInfo(viewRootImpl, viewRootImpl.mHandler);
        this.mAttachInfo.mRootView = this.mDecor;
        this.mAttachInfo.mHasWindowFocus = true;
    }

    /**
     * Return the Context this window policy is running in, for retrieving
     * resources and other information.
     *
     * @return Context The Context that was supplied to the constructor.
     */
    getContext():Context  {
        return this.mContext;
    }

    ///**
    // * Return the {@link android.R.styleable#Window} attributes from this
    // * window's theme.
    // */
    //getWindowStyle():TypedArray  {
    //    {
    //        if (this.mWindowStyle == null) {
    //            this.mWindowStyle = this.mContext.obtainStyledAttributes(com.android.internal.R.styleable.Window);
    //        }
    //        return this.mWindowStyle;
    //    }
    //}

    /**
     * Set the container for this window.  If not set, the DecorWindow
     * operates as a top-level window; otherwise, it negotiates with the
     * container to display itself appropriately.
     *
     * @param container The desired containing Window.
     */
    setContainer(container:WindowManager):void  {
        this.mContainer = container;
        //if (container != null) {
        //    // Embedded screens never have a title.
        //    //this.mFeatures |= 1 << Window.FEATURE_NO_TITLE;
        //    //this.mLocalFeatures |= 1 << Window.FEATURE_NO_TITLE;
        //    container.mHasChildren = true;
        //}
    }

    /**
     * Return the container for this Window.
     *
     * @return Window The containing window, or null if this is a
     *         top-level window.
     */
    getContainer():WindowManager  {
        return this.mContainer;
    }

    //hasChildren():boolean  {
    //    return this.mHasChildren;
    //}

    /** @hide */
    destroy():void  {
        this.mDestroyed = true;
    }

    /** @hide */
    isDestroyed():boolean  {
        return this.mDestroyed;
    }
    setChildWindowManager(wm:WindowManager):void  {
        //this.mAppToken = appToken;
        //this.mAppName = appName;
        //this.mHardwareAccelerated = hardwareAccelerated;// || SystemProperties.getBoolean(Window.PROPERTY_HARDWARE_UI, false);
        //if (wm == null) {
        //    wm = <WindowManager> this.mContext.getSystemService(Context.WINDOW_SERVICE);
        //}
        //this.mWindowManager = (<WindowManagerImpl> wm).createLocalWindowManager(this);

        if(this.mChildWindowManager){
            this.mDecor.removeView(this.mChildWindowManager.getWindowsLayout());
        }
        this.mChildWindowManager = wm;
    }

    //adjustLayoutParamsForSubWindow(wp:WindowManager.LayoutParams):void  {
    //    let curTitle:string = wp.getTitle();
    //    if (wp.type >= WindowManager.LayoutParams.FIRST_SUB_WINDOW && wp.type <= WindowManager.LayoutParams.LAST_SUB_WINDOW) {
    //        if (wp.token == null) {
    //            let decor:View = this.peekDecorView();
    //            if (decor != null) {
    //                wp.token = decor.getWindowToken();
    //            }
    //        }
    //        if (curTitle == null || curTitle.length() == 0) {
    //            let title:string;
    //            if (wp.type == WindowManager.LayoutParams.TYPE_APPLICATION_MEDIA) {
    //                title = "Media";
    //            } else if (wp.type == WindowManager.LayoutParams.TYPE_APPLICATION_MEDIA_OVERLAY) {
    //                title = "MediaOvr";
    //            } else if (wp.type == WindowManager.LayoutParams.TYPE_APPLICATION_PANEL) {
    //                title = "Panel";
    //            } else if (wp.type == WindowManager.LayoutParams.TYPE_APPLICATION_SUB_PANEL) {
    //                title = "SubPanel";
    //            } else if (wp.type == WindowManager.LayoutParams.TYPE_APPLICATION_ATTACHED_DIALOG) {
    //                title = "AtchDlg";
    //            } else {
    //                title = Integer.toString(wp.type);
    //            }
    //            if (this.mAppName != null) {
    //                title += ":" + this.mAppName;
    //            }
    //            wp.setTitle(title);
    //        }
    //    } else {
    //        if (wp.token == null) {
    //            wp.token = this.mContainer == null ? this.mAppToken : this.mContainer.mAppToken;
    //        }
    //        if ((curTitle == null || curTitle.length() == 0) && this.mAppName != null) {
    //            wp.setTitle(this.mAppName);
    //        }
    //    }
    //    if (wp.packageName == null) {
    //        wp.packageName = this.mContext.getPackageName();
    //    }
    //    if (this.mHardwareAccelerated) {
    //        wp.flags |= WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED;
    //    }
    //}

    /**
     * Return the window manager allowing this Window to display its own
     * windows.
     *
     * @return WindowManager The ViewManager.
     */
    getChildWindowManager():WindowManager  {
        if(!this.mChildWindowManager){
            this.mChildWindowManager = new WindowManager(this.mContext);
            this.mDecor.addView(this.mChildWindowManager.getWindowsLayout(), -1, -1);
        }
        return this.mChildWindowManager;
    }

    /**
     * Set the Callback interface for this window, used to intercept key
     * events and other dynamic operations in the window.
     *
     * @param callback The desired Callback interface.
     */
    setCallback(callback:Window.Callback):void  {
        this.mCallback = callback;
    }

    /**
     * Return the current Callback interface for this window.
     */
    getCallback():Window.Callback  {
        return this.mCallback;
    }

//    /**
//     * Take ownership of this window's surface.  The window's view hierarchy
//     * will no longer draw into the surface, though it will otherwise continue
//     * to operate (such as for receiving input events).  The given SurfaceHolder
//     * callback will be used to tell you about state changes to the surface.
//     */
//    abstract
//takeSurface(callback:SurfaceHolder.Callback2):void ;

//    /**
//     * Take ownership of this window's InputQueue.  The window will no
//     * longer read and dispatch input events from the queue; it is your
//     * responsibility to do so.
//     */
//    abstract
//takeInputQueue(callback:InputQueue.Callback):void ;

    setFloating(isFloating:boolean):void {
        const attrs:WindowManager.LayoutParams = this.getAttributes();
        if(isFloating === attrs.isFloating()) return;
        if(isFloating) attrs.flags |= WindowManager.LayoutParams.FLAG_FLOATING;
        else attrs.flags &= ~WindowManager.LayoutParams.FLAG_FLOATING;
        if (this.mCallback != null) {
            this.mCallback.onWindowAttributesChanged(attrs);
        }
    }

    /**
     * Return whether this window is being displayed with a floating style
     * (based on the {@link android.R.attr#windowIsFloating} attribute in
     * the style/theme).
     *
     * @return Returns true if the window is configured to be displayed floating
     * on top of whatever is behind it.
     */
    isFloating():boolean{
        return this.mWindowAttributes.isFloating();
    }

    /**
     * Set the width and height layout parameters of the window.  The default
     * for both of these is MATCH_PARENT; you can change them to WRAP_CONTENT
     * or an absolute value to make a window that is not full-screen.
     *
     * @param width The desired layout width of the window.
     * @param height The desired layout height of the window.
     *
     * @see ViewGroup.LayoutParams#height
     * @see ViewGroup.LayoutParams#width
     */
    setLayout(width:number, height:number):void  {
        const attrs:WindowManager.LayoutParams = this.getAttributes();
        attrs.width = width;
        attrs.height = height;
        if (this.mCallback != null) {
            this.mCallback.onWindowAttributesChanged(attrs);
        }
    }

    /**
     * Set the gravity of the window, as per the Gravity constants.  This
     * controls how the window manager is positioned in the overall window; it
     * is only useful when using WRAP_CONTENT for the layout width or height.
     *
     * @param gravity The desired gravity constant.
     *
     * @see Gravity
     * @see #setLayout
     */
    setGravity(gravity:number):void  {
        const attrs:WindowManager.LayoutParams = this.getAttributes();
        attrs.gravity = gravity;
        if (this.mCallback != null) {
            this.mCallback.onWindowAttributesChanged(attrs);
        }
    }

    /**
     * Set the type of the window, as per the WindowManager.LayoutParams
     * types.
     *
     * @param type The new window type (see WindowManager.LayoutParams).
     */
    setType(type:number):void  {
        const attrs:WindowManager.LayoutParams = this.getAttributes();
        attrs.type = type;
        if (this.mCallback != null) {
            this.mCallback.onWindowAttributesChanged(attrs);
        }
    }

    ///**
    // * Set the format of window, as per the PixelFormat types.  This overrides
    // * the default format that is selected by the Window based on its
    // * window decorations.
    // *
    // * @param format The new window format (see PixelFormat).  Use
    // *               PixelFormat.UNKNOWN to allow the Window to select
    // *               the format.
    // *
    // * @see PixelFormat
    // */
    //setFormat(format:number):void  {
    //    const attrs:WindowManager.LayoutParams = this.getAttributes();
    //    if (format != PixelFormat.UNKNOWN) {
    //        attrs.format = format;
    //        this.mHaveWindowFormat = true;
    //    } else {
    //        attrs.format = this.mDefaultWindowFormat;
    //        this.mHaveWindowFormat = false;
    //    }
    //    if (this.mCallback != null) {
    //        this.mCallback.onWindowAttributesChanged(attrs);
    //    }
    //}


    /**
     * Specify custom animations to use for the window
     */
    setWindowAnimations(enterAnimation:Animation, exitAnimation:Animation,
                        resumeAnimation=this.mWindowAttributes.resumeAnimation, hideAnimation=this.mWindowAttributes.hideAnimation):void  {
        const attrs:WindowManager.LayoutParams = this.getAttributes();
        attrs.enterAnimation = enterAnimation;
        attrs.exitAnimation = exitAnimation;
        attrs.resumeAnimation = resumeAnimation;
        attrs.hideAnimation = hideAnimation;
        //const attrs:WindowManager.LayoutParams = this.getAttributes();
        //attrs.windowAnimations = resId;
        if (this.mCallback != null) {
            this.mCallback.onWindowAttributesChanged(attrs);
        }
    }


    ///**
    // * Specify an explicit soft input mode to use for the window, as per
    // * {@link WindowManager.LayoutParams#softInputMode
    // * WindowManager.LayoutParams.softInputMode}.  Providing anything besides
    // * "unspecified" here will override the input mode the window would
    // * normally retrieve from its theme.
    // */
    //setSoftInputMode(mode:number):void  {
    //    const attrs:WindowManager.LayoutParams = this.getAttributes();
    //    if (mode != WindowManager.LayoutParams.SOFT_INPUT_STATE_UNSPECIFIED) {
    //        attrs.softInputMode = mode;
    //        this.mHasSoftInputMode = true;
    //    } else {
    //        this.mHasSoftInputMode = false;
    //    }
    //    if (this.mCallback != null) {
    //        this.mCallback.onWindowAttributesChanged(attrs);
    //    }
    //}

    /**
     * Convenience function to set the flag bits as specified in flags, as
     * per {@link #setFlags}.
     * @param flags The flag bits to be set.
     * @see #setFlags
     * @see #clearFlags
     */
    addFlags(flags:number):void  {
        this.setFlags(flags, flags);
    }

    ///** @hide */
    //addPrivateFlags(flags:number):void  {
    //    this.setPrivateFlags(flags, flags);
    //}

    /**
     * Convenience function to clear the flag bits as specified in flags, as
     * per {@link #setFlags}.
     * @param flags The flag bits to be cleared.
     * @see #setFlags
     * @see #addFlags
     */
    clearFlags(flags:number):void  {
        this.setFlags(0, flags);
    }

    /**
     * Set the flags of the window, as per the
     * {@link WindowManager.LayoutParams WindowManager.LayoutParams}
     * flags.
     * 
     * <p>Note that some flags must be set before the window decoration is
     * created (by the first call to
     * {@link #setContentView(View, android.view.ViewGroup.LayoutParams)} or
     * {@link #getDecorView()}:
     * {@link WindowManager.LayoutParams#FLAG_LAYOUT_IN_SCREEN} and
     * {@link WindowManager.LayoutParams#FLAG_LAYOUT_INSET_DECOR}.  These
     * will be set for you based on the {@link android.R.attr#windowIsFloating}
     * attribute.
     *
     * @param flags The new window flags (see WindowManager.LayoutParams).
     * @param mask Which of the window flag bits to modify.
     * @see #addFlags
     * @see #clearFlags
     */
    setFlags(flags:number, mask:number):void  {
        const attrs:WindowManager.LayoutParams = this.getAttributes();
        attrs.flags = (attrs.flags & ~mask) | (flags & mask);
        //if ((mask & WindowManager.LayoutParams.FLAG_NEEDS_MENU_KEY) != 0) {
        //    attrs.privateFlags |= WindowManager.LayoutParams.PRIVATE_FLAG_SET_NEEDS_MENU_KEY;
        //}
        //this.mForcedWindowFlags |= mask;
        if (this.mCallback != null) {
            this.mCallback.onWindowAttributesChanged(attrs);
        }
    }

    //private setPrivateFlags(flags:number, mask:number):void  {
    //    const attrs:WindowManager.LayoutParams = this.getAttributes();
    //    attrs.privateFlags = (attrs.privateFlags & ~mask) | (flags & mask);
    //    if (this.mCallback != null) {
    //        this.mCallback.onWindowAttributesChanged(attrs);
    //    }
    //}

    /**
     * Set the amount of dim behind the window when using
     * {@link WindowManager.LayoutParams#FLAG_DIM_BEHIND}.  This overrides
     * the default dim amount of that is selected by the Window based on
     * its theme.
     *
     * @param amount The new dim amount, from 0 for no dim to 1 for full dim.
     */
    setDimAmount(amount:number):void  {
        const attrs:WindowManager.LayoutParams = this.getAttributes();
        attrs.dimAmount = amount;
        //this.mHaveDimAmount = true;
        if (this.mCallback != null) {
            this.mCallback.onWindowAttributesChanged(attrs);
        }
    }

    /**
     * Specify custom window attributes.  <strong>PLEASE NOTE:</strong> the
     * layout params you give here should generally be from values previously
     * retrieved with {@link #getAttributes()}; you probably do not want to
     * blindly create and apply your own, since this will blow away any values
     * set by the framework that you are not interested in.
     *
     * @param a The new window attributes, which will completely override any
     *          current values.
     */
    setAttributes(a:WindowManager.LayoutParams):void  {
        this.mWindowAttributes.copyFrom(a);
        if (this.mCallback != null) {
            this.mCallback.onWindowAttributesChanged(this.mWindowAttributes);
        }
    }

    /**
     * Retrieve the current window attributes associated with this panel.
     *
     * @return WindowManager.LayoutParams Either the existing window
     *         attributes object, or a freshly created one if there is none.
     */
    getAttributes():WindowManager.LayoutParams  {
        return this.mWindowAttributes;
    }

    ///**
    // * Return the window flags that have been explicitly set by the client,
    // * so will not be modified by {@link #getDecorView}.
    // */
    //protected getForcedWindowFlags():number  {
    //    return this.mForcedWindowFlags;
    //}
    //
    ///**
    // * Has the app specified their own soft input mode?
    // */
    //protected hasSoftInputMode():boolean  {
    //    return this.mHasSoftInputMode;
    //}

    /** @hide */
    setCloseOnTouchOutside(close:boolean):void  {
        this.mCloseOnTouchOutside = close;
        this.mSetCloseOnTouchOutside = true;
    }

    /** @hide */
    setCloseOnTouchOutsideIfNotSet(close:boolean):void  {
        if (!this.mSetCloseOnTouchOutside) {
            this.mCloseOnTouchOutside = close;
            this.mSetCloseOnTouchOutside = true;
        }
    }

//    /** @hide */
//    abstract
//alwaysReadCloseOnTouchAttr():void ;

    /** @hide */
    shouldCloseOnTouch(context:Context, event:MotionEvent):boolean  {
        if (this.mCloseOnTouchOutside && event.getAction() == MotionEvent.ACTION_DOWN && this.isOutOfBounds(context, event) && this.peekDecorView() != null) {
            return true;
        }
        return false;
    }

    private isOutOfBounds(context:Context, event:MotionEvent):boolean  {
        const x:number = Math.floor(event.getX());
        const y:number = Math.floor(event.getY());
        const slop:number = ViewConfiguration.get(context).getScaledWindowTouchSlop();
        const decorView:View = this.getDecorView();
        return (x < -slop) || (y < -slop) || (x > (decorView.getWidth() + slop)) || (y > (decorView.getHeight() + slop));
    }

    ///**
    // * Enable extended screen features.  This must be called before
    // * setContentView().  May be called as many times as desired as long as it
    // * is before setContentView().  If not called, no extended features
    // * will be available.  You can not turn off a feature once it is requested.
    // * You canot use other title features with {@link #FEATURE_CUSTOM_TITLE}.
    // *
    // * @param featureId The desired features, defined as constants by Window.
    // * @return The features that are now set.
    // */
    //requestFeature(featureId:number):boolean  {
    //    const flag:number = 1 << featureId;
    //    this.mFeatures |= flag;
    //    this.mLocalFeatures |= this.mContainer != null ? (flag & ~this.mContainer.mFeatures) : flag;
    //    return (this.mFeatures & flag) != 0;
    //}
    //
    ///**
    // * @hide Used internally to help resolve conflicting features.
    // */
    //protected removeFeature(featureId:number):void  {
    //    const flag:number = 1 << featureId;
    //    this.mFeatures &= ~flag;
    //    this.mLocalFeatures &= ~(this.mContainer != null ? (flag & ~this.mContainer.mFeatures) : flag);
    //}

        makeActive():void  {
            if (this.mContainer != null) {
                if (this.mContainer.mActiveWindow != null) {
                    this.mContainer.mActiveWindow.mIsActive = false;
                }
                this.mContainer.mActiveWindow = this;
            }
            this.mIsActive = true;
            this.onActive();
        }

        isActive():boolean  {
            return this.mIsActive;
        }

    /**
     * Finds a view that was identified by the id attribute from the XML that
     * was processed in {@link android.app.Activity#onCreate}.  This will
     * implicitly call {@link #getDecorView} for you, with all of the
     * associated side-effects.
     *
     * @return The view if found or null otherwise.
     */
    findViewById(id:string):View  {
        return this.getDecorView().findViewById(id);
    }

    ///**
    // * Convenience for
    // * {@link #setContentView(View, android.view.ViewGroup.LayoutParams)}
    // * to set the screen content from a layout resource.  The resource will be
    // * inflated, adding all top-level views to the screen.
    // *
    // * @param layoutResID Resource ID to be inflated.
    // * @see #setContentView(View, android.view.ViewGroup.LayoutParams)
    // */
    // setContentView(layoutResID:number):void{
    //
    //}
    //
    ///**
    // * Convenience for
    // * {@link #setContentView(View, android.view.ViewGroup.LayoutParams)}
    // * set the screen content to an explicit view.  This view is placed
    // * directly into the screen's view hierarchy.  It can itself be a complex
    // * view hierarhcy.
    // *
    // * @param view The desired content to display.
    // * @see #setContentView(View, android.view.ViewGroup.LayoutParams)
    // */
    //setContentView(view:View):void{
    //
    //}

    /**
     * Set the screen content to an explicit view.  This view is placed
     * directly into the screen's view hierarchy.  It can itself be a complex
     * view hierarchy.
     *
     * <p>Note that calling this function "locks in" various characteristics
     * of the window that can not, from this point forward, be changed: the
     * features that have been requested with {@link #requestFeature(int)},
     * and certain window flags as described in {@link #setFlags(int, int)}.
     * 
     * @param view The desired content to display.
     * @param params Layout parameters for the view.
     */
    setContentView(view:View, params?:ViewGroup.LayoutParams):void{
        this.mContentParent.removeAllViews();
        this.addContentView(view, params);
    }

    /**
     * Variation on
     * {@link #setContentView(View, android.view.ViewGroup.LayoutParams)}
     * to add an additional content view to the screen.  Added after any existing
     * ones in the screen -- existing views are NOT removed.
     *
     * @param view The desired content to display.
     * @param params Layout parameters for the view.
     */
     addContentView(view:View, params:ViewGroup.LayoutParams):void{
        if(params){
            this.mContentParent.addView(view, params);
        }else{
            this.mContentParent.addView(view);
        }
        let cb = this.getCallback();
        if (cb != null && !this.isDestroyed()) {
            cb.onContentChanged();
        }
    }

    getContentParent():ViewGroup{
        return this.mContentParent;
    }

    /**
     * Return the view in this Window that currently has focus, or null if
     * there are none.  Note that this does not look in any containing
     * Window.
     *
     * @return View The current View with focus or null.
     */
    getCurrentFocus():View{
        return this.mDecor != null ? this.mDecor.findFocus() : null;
    }

    /**
     * Quick access to the {@link LayoutInflater} instance that this Window
     * retrieved from its Context.
     *
     * @return LayoutInflater The shared LayoutInflater.
     */
    getLayoutInflater():LayoutInflater{
        return this.mContext.getLayoutInflater();
    }

    setTitle(title:string):void{
        //TODO set title to view
        this.mDecor.bindElement.setAttribute('title', title);
        this.getAttributes().setTitle(title);
    }

//    abstract
//setTitleColor(textColor:number):void ;
//
//    abstract
//openPanel(featureId:number, event:KeyEvent):void ;
//
//    abstract
//closePanel(featureId:number):void ;
//
//    abstract
//togglePanel(featureId:number, event:KeyEvent):void ;
//
//    abstract
//invalidatePanelMenu(featureId:number):void ;
//
//    abstract
//performPanelShortcut(featureId:number, keyCode:number, event:KeyEvent, flags:number):boolean ;
//
//    abstract
//performPanelIdentifierAction(featureId:number, id:number, flags:number):boolean ;
//
//    abstract
//closeAllPanels():void ;
//
//    abstract
//performContextMenuIdentifierAction(id:number, flags:number):boolean ;

//    /**
//     * Should be called when the configuration is changed.
//     *
//     * @param newConfig The new configuration.
//     */
//    abstract
//onConfigurationChanged(newConfig:Configuration):void ;

    ///**
    // * Change the background of this window to a Drawable resource. Setting the
    // * background to null will make the window be opaque. To make the window
    // * transparent, you can use an empty drawable (for instance a ColorDrawable
    // * with the color 0 or the system drawable android:drawable/empty.)
    // *
    // * @param resid The resource identifier of a drawable resource which will be
    // *              installed as the new background.
    // */
    //setBackgroundDrawableResource(resid:number):void  {
    //    this.setBackgroundDrawable(this.mContext.getResources().getDrawable(resid));
    //}

    /**
     * Change the background of this window to a custom Drawable. Setting the
     * background to null will make the window be opaque. To make the window
     * transparent, you can use an empty drawable (for instance a ColorDrawable
     * with the color 0 or the system drawable android:drawable/empty.)
     *
     * @param drawable The new Drawable to use for this window's background.
     */
    setBackgroundDrawable(drawable:Drawable):void{
        if (this.mDecor != null) {
            this.mDecor.setBackground(drawable);
            //this.setDefaultWindowFormat(drawable.getOpacity());
        }
    }

    setBackgroundColor(color:number):void{
        if (this.mDecor != null) {
            this.mDecor.setBackgroundColor(color);
            //this.setDefaultWindowFormat(drawable.getOpacity());
        }
    }

//    /**
//     * Set the value for a drawable feature of this window, from a resource
//     * identifier.  You must have called requestFeauture(featureId) before
//     * calling this function.
//     *
//     * @see android.content.res.Resources#getDrawable(int)
//     *
//     * @param featureId The desired drawable feature to change, defined as a
//     * constant by Window.
//     * @param resId Resource identifier of the desired image.
//     */
//    abstract
//setFeatureDrawableResource(featureId:number, resId:number):void ;
//
//    /**
//     * Set the value for a drawable feature of this window, from a URI. You
//     * must have called requestFeature(featureId) before calling this
//     * function.
//     *
//     * <p>The only URI currently supported is "content:", specifying an image
//     * in a content provider.
//     *
//     * @see android.widget.ImageView#setImageURI
//     *
//     * @param featureId The desired drawable feature to change. Features are
//     * constants defined by Window.
//     * @param uri The desired URI.
//     */
//    abstract
//setFeatureDrawableUri(featureId:number, uri:Uri):void ;
//
//    /**
//     * Set an explicit Drawable value for feature of this window. You must
//     * have called requestFeature(featureId) before calling this function.
//     *
//     * @param featureId The desired drawable feature to change.
//     * Features are constants defined by Window.
//     * @param drawable A Drawable object to display.
//     */
//    abstract
//setFeatureDrawable(featureId:number, drawable:Drawable):void ;
//
//    /**
//     * Set a custom alpha value for the given drawale feature, controlling how
//     * much the background is visible through it.
//     *
//     * @param featureId The desired drawable feature to change.
//     * Features are constants defined by Window.
//     * @param alpha The alpha amount, 0 is completely transparent and 255 is
//     *              completely opaque.
//     */
//    abstract
//setFeatureDrawableAlpha(featureId:number, alpha:number):void ;
//
//    /**
//     * Set the integer value for a feature.  The range of the value depends on
//     * the feature being set.  For FEATURE_PROGRESSS, it should go from 0 to
//     * 10000. At 10000 the progress is complete and the indicator hidden.
//     *
//     * @param featureId The desired feature to change.
//     * Features are constants defined by Window.
//     * @param value The value for the feature.  The interpretation of this
//     *              value is feature-specific.
//     */
//    abstract
//setFeatureInt(featureId:number, value:number):void ;

    /**
     * Request that key events come to this activity. Use this if your
     * activity has no views with focus, but the activity still wants
     * a chance to process key events.
     */
    takeKeyEvents(_get:boolean):void{
        this.mDecor.setFocusable(_get);
    }

    /**
     * Used by custom windows, such as Dialog, to pass the key press event
     * further down the view hierarchy. Application developers should
     * not need to implement or call this.
     *
     */
    superDispatchKeyEvent(event:KeyEvent):boolean{
        return this.mDecor.superDispatchKeyEvent(event);
    }

//    /**
//     * Used by custom windows, such as Dialog, to pass the key shortcut press event
//     * further down the view hierarchy. Application developers should
//     * not need to implement or call this.
//     *
//     */
//    abstract
//superDispatchKeyShortcutEvent(event:KeyEvent):boolean ;

    /**
     * Used by custom windows, such as Dialog, to pass the touch screen event
     * further down the view hierarchy. Application developers should
     * not need to implement or call this.
     *
     */
    superDispatchTouchEvent(event:MotionEvent):boolean{
        return this.mDecor.superDispatchTouchEvent(event);
    }

//    /**
//     * Used by custom windows, such as Dialog, to pass the trackball event
//     * further down the view hierarchy. Application developers should
//     * not need to implement or call this.
//     *
//     */
//    abstract
//superDispatchTrackballEvent(event:MotionEvent):boolean ;

    /**
     * Used by custom windows, such as Dialog, to pass the generic motion event
     * further down the view hierarchy. Application developers should
     * not need to implement or call this.
     *
     */
    superDispatchGenericMotionEvent(event:MotionEvent):boolean{
        return this.mDecor.superDispatchGenericMotionEvent(event);
    }

    /**
     * Retrieve the top-level window decor view (containing the standard
     * window frame/decorations and the client's content inside of that), which
     * can be added as a window to the window manager.
     * 
     * <p><em>Note that calling this function for the first time "locks in"
     * various window characteristics as described in
     * {@link #setContentView(View, android.view.ViewGroup.LayoutParams)}.</em></p>
     * 
     * @return Returns the top-level window decor view.
     */
    getDecorView():View{
        return this.mDecor;
    }

    /**
     * Retrieve the current decor view, but only if it has already been created;
     * otherwise returns null.
     * 
     * @return Returns the top-level window decor or null.
     * @see #getDecorView
     */
    peekDecorView():View{
        return this.mDecor;
    }

        //TODO androidui: save state
//    abstract
//saveHierarchyState():Bundle ;
//
//    abstract
//restoreHierarchyState(savedInstanceState:Bundle):void//

    protected onActive():void {
    }

    ///**
    // * Return the feature bits that are enabled.  This is the set of features
    // * that were given to requestFeature(), and are being handled by this
    // * Window itself or its container.  That is, it is the set of
    // * requested features that you can actually use.
    // *
    // * <p>To do: add a public version of this API that allows you to check for
    // * features by their feature ID.
    // *
    // * @return int The feature bits.
    // */
    //protected getFeatures():number  {
    //    return this.mFeatures;
    //}
    //
    ///**
    // * Query for the availability of a certain feature.
    // *
    // * @param feature The feature ID to check
    // * @return true if the feature is enabled, false otherwise.
    // */
    //hasFeature(feature:number):boolean  {
    //    return (this.getFeatures() & (1 << feature)) != 0;
    //}
    //
    ///**
    // * Return the feature bits that are being implemented by this Window.
    // * This is the set of features that were given to requestFeature(), and are
    // * being handled by only this Window itself, not by its containers.
    // *
    // * @return int The feature bits.
    // */
    //protected getLocalFeatures():number  {
    //    return this.mLocalFeatures;
    //}
    //
    ///**
    // * Set the default format of window, as per the PixelFormat types.  This
    // * is the format that will be used unless the client specifies in explicit
    // * format with setFormat();
    // *
    // * @param format The new window format (see PixelFormat).
    // *
    // * @see #setFormat
    // * @see PixelFormat
    // */
    //protected setDefaultWindowFormat(format:number):void  {
    //    this.mDefaultWindowFormat = format;
    //    if (!this.mHaveWindowFormat) {
    //        const attrs:WindowManager.LayoutParams = this.getAttributes();
    //        attrs.format = format;
    //        if (this.mCallback != null) {
    //            this.mCallback.onWindowAttributesChanged(attrs);
    //        }
    //    }
    //}
    //
    ///** @hide */
    //protected haveDimAmount():boolean  {
    //    return this.mHaveDimAmount;
    //}

//    abstract
//setChildDrawable(featureId:number, drawable:Drawable):void ;
//
//    abstract
//setChildInt(featureId:number, value:number):void ;
//
//    /**
//     * Is a keypress one of the defined shortcut keys for this window.
//     * @param keyCode the key code from {@link android.view.KeyEvent} to check.
//     * @param event the {@link android.view.KeyEvent} to use to help check.
//     */
//    abstract
//isShortcutKey(keyCode:number, event:KeyEvent):boolean ;
//
//    /**
//     * @see android.app.Activity#setVolumeControlStream(int)
//     */
//    abstract
//setVolumeControlStream(streamType:number):void ;
//
//    /**
//     * @see android.app.Activity#getVolumeControlStream()
//     */
//    abstract
//getVolumeControlStream():number ;
//
//    /**
//     * Set extra options that will influence the UI for this window.
//     * @param uiOptions Flags specifying extra options for this window.
//     */
//    setUiOptions(uiOptions:number):void  {
//    }
//
//    /**
//     * Set extra options that will influence the UI for this window.
//     * Only the bits filtered by mask will be modified.
//     * @param uiOptions Flags specifying extra options for this window.
//     * @param mask Flags specifying which options should be modified. Others will remain unchanged.
//     */
//    setUiOptions(uiOptions:number, mask:number):void  {
//    }
//
//    /**
//     * Set the primary icon for this window.
//     *
//     * @param resId resource ID of a drawable to set
//     */
//    setIcon(resId:number):void  {
//    }
//
//    /**
//     * Set the default icon for this window.
//     * This will be overridden by any other icon set operation which could come from the
//     * theme or another explicit set.
//     *
//     * @hide
//     */
//    setDefaultIcon(resId:number):void  {
//    }
//
//    /**
//     * Set the logo for this window. A logo is often shown in place of an
//     * {@link #setIcon(int) icon} but is generally wider and communicates window title information
//     * as well.
//     *
//     * @param resId resource ID of a drawable to set
//     */
//    setLogo(resId:number):void  {
//    }
//
//    /**
//     * Set the default logo for this window.
//     * This will be overridden by any other logo set operation which could come from the
//     * theme or another explicit set.
//     *
//     * @hide
//     */
//    setDefaultLogo(resId:number):void  {
//    }
//
    ///**
    // * Set focus locally. The window should have the
    // * {@link WindowManager.LayoutParams#FLAG_LOCAL_FOCUS_MODE} flag set already.
    // * @param hasFocus Whether this window has focus or not.
    // * @param inTouchMode Whether this window is in touch mode or not.
    // */
    //setLocalFocus(hasFocus:boolean, inTouchMode:boolean):void {
    //}
    //
    ///**
    // * Inject an event to window locally.
    // * @param event A key or touch event to inject to this window.
    // */
    //injectInputEvent(event:MotionEvent|KeyEvent):void {
    //}
}

export module Window{
/**
     * API from a Window back to its caller.  This allows the client to
     * intercept key dispatching, panels and menus, etc.
     */
export interface Callback {

    /**
         * Called to process key events.  At the very least your
         * implementation must call
         * {@link android.view.Window#superDispatchKeyEvent} to do the
         * standard key processing.
         *
         * @param event The key event.
         *
         * @return boolean Return true if this event was consumed.
         */
    dispatchKeyEvent(event:KeyEvent):boolean ;

    ///**
    //     * Called to process a key shortcut event.
    //     * At the very least your implementation must call
    //     * {@link android.view.Window#superDispatchKeyShortcutEvent} to do the
    //     * standard key shortcut processing.
    //     *
    //     * @param event The key shortcut event.
    //     * @return True if this event was consumed.
    //     */
    //dispatchKeyShortcutEvent(event:KeyEvent):boolean ;

    /**
         * Called to process touch screen events.  At the very least your
         * implementation must call
         * {@link android.view.Window#superDispatchTouchEvent} to do the
         * standard touch screen processing.
         *
         * @param event The touch screen event.
         *
         * @return boolean Return true if this event was consumed.
         */
    dispatchTouchEvent(event:MotionEvent):boolean ;

    ///**
    //     * Called to process trackball events.  At the very least your
    //     * implementation must call
    //     * {@link android.view.Window#superDispatchTrackballEvent} to do the
    //     * standard trackball processing.
    //     *
    //     * @param event The trackball event.
    //     *
    //     * @return boolean Return true if this event was consumed.
    //     */
    //dispatchTrackballEvent(event:MotionEvent):boolean ;

    /**
         * Called to process generic motion events.  At the very least your
         * implementation must call
         * {@link android.view.Window#superDispatchGenericMotionEvent} to do the
         * standard processing.
         *
         * @param event The generic motion event.
         *
         * @return boolean Return true if this event was consumed.
         */
    dispatchGenericMotionEvent(event:MotionEvent):boolean ;

    ///**
    //     * Called to process population of {@link AccessibilityEvent}s.
    //     *
    //     * @param event The event.
    //     *
    //     * @return boolean Return true if event population was completed.
    //     */
    //dispatchPopulateAccessibilityEvent(event:AccessibilityEvent):boolean ;
    //
    ///**
    //     * Instantiate the view to display in the panel for 'featureId'.
    //     * You can return null, in which case the default content (typically
    //     * a menu) will be created for you.
    //     *
    //     * @param featureId Which panel is being created.
    //     *
    //     * @return view The top-level view to place in the panel.
    //     *
    //     * @see #onPreparePanel
    //     */
    //onCreatePanelView(featureId:number):View ;
    //
    ///**
    //     * Initialize the contents of the menu for panel 'featureId'.  This is
    //     * called if onCreatePanelView() returns null, giving you a standard
    //     * menu in which you can place your items.  It is only called once for
    //     * the panel, the first time it is shown.
    //     *
    //     * <p>You can safely hold on to <var>menu</var> (and any items created
    //     * from it), making modifications to it as desired, until the next
    //     * time onCreatePanelMenu() is called for this feature.
    //     *
    //     * @param featureId The panel being created.
    //     * @param menu The menu inside the panel.
    //     *
    //     * @return boolean You must return true for the panel to be displayed;
    //     *         if you return false it will not be shown.
    //     */
    //onCreatePanelMenu(featureId:number, menu:Menu):boolean ;
    //
    ///**
    //     * Prepare a panel to be displayed.  This is called right before the
    //     * panel window is shown, every time it is shown.
    //     *
    //     * @param featureId The panel that is being displayed.
    //     * @param view The View that was returned by onCreatePanelView().
    //     * @param menu If onCreatePanelView() returned null, this is the Menu
    //     *             being displayed in the panel.
    //     *
    //     * @return boolean You must return true for the panel to be displayed;
    //     *         if you return false it will not be shown.
    //     *
    //     * @see #onCreatePanelView
    //     */
    //onPreparePanel(featureId:number, view:View, menu:Menu):boolean ;
    //
    ///**
    //     * Called when a panel's menu is opened by the user. This may also be
    //     * called when the menu is changing from one type to another (for
    //     * example, from the icon menu to the expanded menu).
    //     *
    //     * @param featureId The panel that the menu is in.
    //     * @param menu The menu that is opened.
    //     * @return Return true to allow the menu to open, or false to prevent
    //     *         the menu from opening.
    //     */
    //onMenuOpened(featureId:number, menu:Menu):boolean ;
    //
    ///**
    //     * Called when a panel's menu item has been selected by the user.
    //     *
    //     * @param featureId The panel that the menu is in.
    //     * @param item The menu item that was selected.
    //     *
    //     * @return boolean Return true to finish processing of selection, or
    //     *         false to perform the normal menu handling (calling its
    //     *         Runnable or sending a Message to its target Handler).
    //     */
    //onMenuItemSelected(featureId:number, item:MenuItem):boolean ;

    /**
         * This is called whenever the current window attributes change.
         *
         */
    onWindowAttributesChanged(attrs:WindowManager.LayoutParams):void ;

    /**
         * This hook is called whenever the content view of the screen changes
         * (due to a call to
         * {@link Window#setContentView(View, android.view.ViewGroup.LayoutParams)
         * Window.setContentView} or
         * {@link Window#addContentView(View, android.view.ViewGroup.LayoutParams)
         * Window.addContentView}).
         */
    onContentChanged():void ;

    /**
         * This hook is called whenever the window focus changes.  See
         * {@link View#onWindowFocusChanged(boolean)
         * View.onWindowFocusChanged(boolean)} for more information.
         *
         * @param hasFocus Whether the window now has focus.
         */
    onWindowFocusChanged(hasFocus:boolean):void ;

    /**
         * Called when the window has been attached to the window manager.
         * See {@link View#onAttachedToWindow() View.onAttachedToWindow()}
         * for more information.
         */
    onAttachedToWindow():void ;

    /**
         * Called when the window has been attached to the window manager.
         * See {@link View#onDetachedFromWindow() View.onDetachedFromWindow()}
         * for more information.
         */
    onDetachedFromWindow():void ;

    ///**
    //     * Called when a panel is being closed.  If another logical subsequent
    //     * panel is being opened (and this panel is being closed to make room for the subsequent
    //     * panel), this method will NOT be called.
    //     *
    //     * @param featureId The panel that is being displayed.
    //     * @param menu If onCreatePanelView() returned null, this is the Menu
    //     *            being displayed in the panel.
    //     */
    //onPanelClosed(featureId:number, menu:Menu):void ;
    //
    ///**
    //     * Called when the user signals the desire to start a search.
    //     *
    //     * @return true if search launched, false if activity refuses (blocks)
    //     *
    //     * @see android.app.Activity#onSearchRequested()
    //     */
    //onSearchRequested():boolean ;

    ///**
    //     * Called when an action mode is being started for this window. Gives the
    //     * callback an opportunity to handle the action mode in its own unique and
    //     * beautiful way. If this method returns null the system can choose a way
    //     * to present the mode or choose not to start the mode at all.
    //     *
    //     * @param callback Callback to control the lifecycle of this action mode
    //     * @return The ActionMode that was started, or null if the system should present it
    //     */
    //onWindowStartingActionMode(callback:ActionMode.Callback):ActionMode;
    //
    ///**
    //     * Called when an action mode has been started. The appropriate mode callback
    //     * method will have already been invoked.
    //     *
    //     * @param mode The new mode that has just been started.
    //     */
    //onActionModeStarted(mode:ActionMode):void;
    //
    ///**
    //     * Called when an action mode has been finished. The appropriate mode callback
    //     * method will have already been invoked.
    //     *
    //     * @param mode The mode that was just finished.
    //     */
    //onActionModeFinished(mode:ActionMode):void;
}
}

    class DecorView extends FrameLayout {
        Window_this : Window;
        private _ignoreRequestLayoutInAnimation = true;
        private _pendingRequestLayoutOnAnimationEnd = false;
        private _ignoreInvalidateInAnimation = true;
        private _pendingInvalidateOnAnimationEnd = false;
        private _reDrawOnceDelay = Runnable.of(() => {
            if (this._pendingRequestLayoutOnAnimationEnd) {
                super.requestLayout();
            }
            if (this._pendingInvalidateOnAnimationEnd) {
                this.destroyDrawingCache();
            }
            this._reDrawOnceDelay = null; // do reDraw delay one time
        });

        constructor(window:android.view.Window) {
            super(window.mContext);
            this.Window_this = window;
            this.bindElement.classList.add(window.mContext.constructor.name);
            this.setBackgroundColor(android.graphics.Color.WHITE);//default window bg
            this.setIsRootNamespace(true);//window's decor view is root.
        }

        invalidate();
        invalidate(invalidateCache:boolean);
        invalidate(dirty:android.graphics.Rect);
        invalidate(l:number, t:number, r:number, b:number);
        invalidate(...args){
            if (this._ignoreInvalidateInAnimation && this.getAnimation()) {
                this._pendingInvalidateOnAnimationEnd = true;
                return null;
            }
            super.invalidate.call(this, ...args);
        }

        invalidateChild(child:android.view.View, dirty:android.graphics.Rect):void {
            if (this._ignoreInvalidateInAnimation && this.getAnimation()) {
                this._pendingInvalidateOnAnimationEnd = true;
                return null;
            }
            super.invalidateChild(child, dirty);
        }

        invalidateChildFast(child:android.view.View, dirty:android.graphics.Rect):void {
            if (this._ignoreInvalidateInAnimation && this.getAnimation()) {
                this._pendingInvalidateOnAnimationEnd = true;
                return null;
            }
            super.invalidateChildFast(child, dirty);
        }

        requestLayout():void {
            if (this._ignoreRequestLayoutInAnimation && this.getAnimation()) {
                this._pendingRequestLayoutOnAnimationEnd = true;
                return null;
            }
            super.requestLayout();
        }

        setLayoutParams(params: android.view.ViewGroup.LayoutParams):void {
            super.setLayoutParams(params);
            super.requestLayout();
        }

        protected onAnimationStart():void {
            super.onAnimationStart();
            this.setDrawingCacheEnabled(true);
            this.buildDrawingCache(true);
            if (this._reDrawOnceDelay) {
                this.postDelayed(this._reDrawOnceDelay, 38); // reLayout & reDraw after 2 frame when init animation
            }
        }

        protected onAnimationEnd():void {
            super.onAnimationEnd();
            if (this._reDrawOnceDelay) {
                this.removeCallbacks(this._reDrawOnceDelay);
            }
            this.setDrawingCacheEnabled(false);
            if (this._pendingInvalidateOnAnimationEnd) {
                this._pendingInvalidateOnAnimationEnd = false;
                this.invalidate();
            }
            if (this._pendingRequestLayoutOnAnimationEnd) {
                this._pendingRequestLayoutOnAnimationEnd = false;
                this.requestLayout();
            }
        }

        buildDrawingCache(autoScale:boolean = false):void {
            if (this.getAnimation() && this.mUnscaledDrawingCache) { // force keep cache when animation
                return;
            }
            super.buildDrawingCache(autoScale);
        }

        protected drawFromParent(canvas:android.graphics.Canvas, parent:ViewGroup, drawingTime:number):boolean {
            //draw shadow when window enter/exit
            let windowAnimation = this.getAnimation();

            let wparams = <WindowManager.LayoutParams>this.getLayoutParams();
            let shadowAlpha:number = wparams.dimAmount * 255;//default full shadow
            if(windowAnimation!=null && shadowAlpha){

                const duration:number = windowAnimation.getDuration();
                let startTime:number = windowAnimation.getStartTime();
                if(startTime<0) startTime = drawingTime;
                let startOffset:number = windowAnimation.getStartOffset();

                let normalizedTime:number;
                if (duration != 0) {
                    normalizedTime = (<number> (drawingTime - (startTime + startOffset))) / <number> duration;
                    normalizedTime = Math.max(Math.min(normalizedTime, 1.0), 0.0);
                } else {
                    // time is a step-change with a zero duration
                    normalizedTime = drawingTime < startTime ? 0.0 : 1.0;
                }
                const interpolatedTime:number = windowAnimation.getInterpolator().getInterpolation(normalizedTime);

                if(windowAnimation === wparams.exitAnimation){
                    shadowAlpha = shadowAlpha * (1-interpolatedTime);
                    if(!windowAnimation.hasEnded()) parent.invalidate();//shadow on parent (should ignore dirty draw child)

                }else if(windowAnimation === wparams.enterAnimation){
                    shadowAlpha = shadowAlpha * interpolatedTime;
                    if(!windowAnimation.hasEnded()) parent.invalidate();//shadow on parent (should ignore dirty draw child)
                }
            }
            if( (windowAnimation!=null || wparams.isFloating()) && shadowAlpha){
                canvas.drawColor(android.graphics.Color.argb(shadowAlpha, 0, 0, 0));
            }

            return super.drawFromParent(canvas, parent, drawingTime);
        }

        tagName():string {
            return 'Window';
        }

        dispatchKeyEvent(event:android.view.KeyEvent):boolean {

            //dialog hold on this window's windowManager, dispatch to it first
            const count:number = this.getChildCount();
            for (let i:number = count-1; i >=0; i--) {
                let child = this.getChildAt(i);
                if(child instanceof WindowManager.Layout && child.dispatchKeyEvent(event)){
                    return true;
                }
            }

            //const keyCode = event.getKeyCode();
            const action = event.getAction();
            //const isDown = action == KeyEvent.ACTION_DOWN;
            if (!this.Window_this.isDestroyed()) {
                const cb = this.Window_this.getCallback();
                const handled = cb != null /*&& mFeatureId < 0*/ ? cb.dispatchKeyEvent(event) : super.dispatchKeyEvent(event);
                if (handled) {
                    return true;
                }
            }
            return super.dispatchKeyEvent(event);
        }

        dispatchTouchEvent(ev:android.view.MotionEvent):boolean {
            let wparams = <WindowManager.LayoutParams>this.getLayoutParams();

            const cb = this.Window_this.getCallback();
            let outside = this.Window_this.isOutOfBounds(this.getContext(), ev);

            if(outside && !wparams.isTouchModal()){
                if(wparams.isWatchTouchOutside() && ev.getAction() == android.view.MotionEvent.ACTION_DOWN){
                    //send a outside event
                    let action = ev.getAction();
                    ev.setAction(android.view.MotionEvent.ACTION_OUTSIDE);
                    if(cb != null && !this.Window_this.isDestroyed() /*&& mFeatureId < 0*/){
                        cb.dispatchTouchEvent(ev)
                    }else{
                        super.dispatchTouchEvent(ev)
                    }
                    ev.setAction(action);
                }
                return false;
            }

            cb != null && !this.Window_this.isDestroyed() /*&& mFeatureId < 0*/ ? cb.dispatchTouchEvent(ev) : super.dispatchTouchEvent(ev);
            return true;
        }

        dispatchGenericMotionEvent(ev:android.view.MotionEvent):boolean {
            const cb = this.Window_this.getCallback();
            return cb != null && !this.Window_this.isDestroyed() /*&& mFeatureId < 0*/ ? cb.dispatchGenericMotionEvent(ev) : super.dispatchGenericMotionEvent(ev);
        }

        superDispatchKeyEvent(event:KeyEvent):boolean {
            return super.dispatchKeyEvent(event);
        }

        superDispatchTouchEvent(event:MotionEvent):boolean {
            return super.dispatchTouchEvent(event);
        }

        superDispatchGenericMotionEvent(event:MotionEvent):boolean {
            return super.dispatchGenericMotionEvent(event);
        }

        onTouchEvent(event:MotionEvent):boolean {//TODO remove?
            return this.onInterceptTouchEvent(event);
        }

        protected onVisibilityChanged(changedView:android.view.View, visibility:number) {
            this.Window_this.mAttachInfo.mWindowVisibility = visibility;
            this.dispatchWindowVisibilityChanged(visibility);

            super.onVisibilityChanged(changedView, visibility);
        }

        onWindowFocusChanged(hasWindowFocus:boolean):void {
            this.Window_this.mAttachInfo.mHasWindowFocus = hasWindowFocus;

            super.onWindowFocusChanged(hasWindowFocus);
            const cb = this.Window_this.getCallback();
            if (cb != null && !this.Window_this.isDestroyed()){// && mFeatureId < 0) {
                cb.onWindowFocusChanged(hasWindowFocus);
            }

        }

        protected onAttachedToWindow():void {
            this.Window_this.mAttachInfo.mWindowVisibility = this.getVisibility();

            super.onAttachedToWindow();

            const cb = this.Window_this.getCallback();
            if (cb != null && !this.Window_this.isDestroyed()){// && mFeatureId < 0) {
                cb.onAttachedToWindow();
            }
        }

        protected onDetachedFromWindow():void {
            super.onDetachedFromWindow();

            const cb = this.Window_this.getCallback();
            if (cb != null && !this.Window_this.isDestroyed()){// && mFeatureId < 0) {
                cb.onDetachedFromWindow();
            }
        }
    }

}
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

///<reference path="../../android/view/Window.ts"/>
///<reference path="../../android/widget/FrameLayout.ts"/>
///<reference path="../../android/graphics/PixelFormat.ts"/>
///<reference path="../../android/text/TextUtils.ts"/>
///<reference path="../../android/util/Log.ts"/>
///<reference path="../../java/lang/Integer.ts"/>
///<reference path="../../java/lang/StringBuilder.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/view/KeyEvent.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/content/Context.ts"/>
///<reference path="../../android/view/MotionEvent.ts"/>
///<reference path="../../android/view/animation/Animation.ts"/>

module android.view {
import PixelFormat = android.graphics.PixelFormat;
import TextUtils = android.text.TextUtils;
import Log = android.util.Log;
import Integer = java.lang.Integer;
import StringBuilder = java.lang.StringBuilder;
import Gravity = android.view.Gravity;
import KeyEvent = android.view.KeyEvent;
import MotionEvent = android.view.MotionEvent;
import View = android.view.View;
import ViewGroup = android.view.ViewGroup;
import Window = android.view.Window;
import Context = android.content.Context;
import Animation = android.view.animation.Animation;

/**
 * The interface that apps use to talk to the window manager.
 * <p>
 * Use <code>Context.getSystemService(Context.WINDOW_SERVICE)</code> to get one of these.
 * </p><p>
 * Each window manager instance is bound to a particular {@link Display}.
 * To obtain a {@link WindowManager} for a different display, use
 * {@link Context#createDisplayContext} to obtain a {@link Context} for that
 * display, then use <code>Context.getSystemService(Context.WINDOW_SERVICE)</code>
 * to get the WindowManager.
 * </p><p>
 * The simplest way to show a window on another display is to create a
 * {@link Presentation}.  The presentation will automatically obtain a
 * {@link WindowManager} and {@link Context} for that display.
 * </p>
 *
 * @see android.content.Context#getSystemService
 * @see android.content.Context#WINDOW_SERVICE
 */
export class WindowManager {
    private mWindowsLayout:WindowManager.Layout;
    protected mActiveWindow:Window;

    private static FocusViewRemember = Symbol();

    constructor(context:Context) {
        this.mWindowsLayout = new WindowManager.Layout(context, this);
        let viewRootImpl = context.androidUI._viewRootImpl;
        let fakeAttachInfo = new View.AttachInfo(viewRootImpl, viewRootImpl.mHandler);
        fakeAttachInfo.mRootView = this.mWindowsLayout;
        this.mWindowsLayout.dispatchAttachedToWindow(fakeAttachInfo, 0);
        this.mWindowsLayout.mGroupFlags |= ViewGroup.FLAG_PREVENT_DISPATCH_ATTACHED_TO_WINDOW; // make attachInfo not handle when addWindow
        this.mWindowsLayout.mGroupFlags |= ViewGroup.FLAG_ALWAYS_DRAWN_WITH_CACHE; // activity animation should use cache
    }

    getWindowsLayout():ViewGroup {
        return this.mWindowsLayout;
    }

    addWindow(window:Window):void{
        let wparams = window.getAttributes();
        if(!wparams){
            wparams = new WindowManager.LayoutParams();
        }
        if(!(wparams instanceof WindowManager.LayoutParams)){
            throw Error('can\'t addWindow, params must be WindowManager.LayoutParams : '+wparams);
        }

        window.setContainer(this);
        let decorView = window.getDecorView();


        //TODO use type as z-index
        let type = wparams.type;
        let lastFocusWindowView = this.mWindowsLayout.getTopFocusableWindowView();
        this.mWindowsLayout.addView(decorView, wparams);

        decorView.dispatchAttachedToWindow(window.mAttachInfo, 0);
        //window.mAttachInfo.mTreeObserver.dispatchOnWindowAttachedChange(true);

        if(wparams.isFocusable()){
            decorView.dispatchWindowFocusChanged(true);

            //clearLastWindowFocus
            if(lastFocusWindowView && lastFocusWindowView.hasFocus()){
                const focused = lastFocusWindowView.findFocus();
                lastFocusWindowView[WindowManager.FocusViewRemember] = focused;
                if (focused != null) {
                    focused.clearFocusInternal(true, false);
                }
                lastFocusWindowView.dispatchWindowFocusChanged(false);

                //new window should be focused
                decorView.addOnLayoutChangeListener({
                    onLayoutChange(v:View, left:number , top:number , right:number , bottom:number,
                                   oldLeft:number , oldTop:number , oldRight:number , oldBottom:number){
                        decorView.removeOnLayoutChangeListener(this);

                        const newWindowFocused = FocusFinder.getInstance().findNextFocus(<ViewGroup>decorView, null, View.FOCUS_DOWN);
                        if (newWindowFocused != null) {
                            newWindowFocused.requestFocus(View.FOCUS_DOWN);
                        }
                    }
                });
            }
        }
        if(decorView instanceof ViewGroup){
            decorView.setMotionEventSplittingEnabled(wparams.isSplitTouch());
        }

        let enterAnimation = window.getContext().androidUI.mActivityThread.getOverrideEnterAnimation();
        if(enterAnimation === undefined) enterAnimation = wparams.enterAnimation;
        if(enterAnimation){
            decorView.startAnimation(enterAnimation);
        }
    }

    updateWindowLayout(window:Window, params:ViewGroup.LayoutParams):void{
        if(!(params instanceof WindowManager.LayoutParams)){
            throw Error('can\'t updateWindowLayout, params must be WindowManager.LayoutParams');
        }
        window.getDecorView().setLayoutParams(params);
    }

    removeWindow(window:Window):void{
        let decor = window.getDecorView();
        if(decor.getParent()==null) return;//not add
        if(decor.getParent() !== this.mWindowsLayout){
            console.error('removeWindow fail, don\'t has the window, decor belong to ', decor.getParent());
            return;
        }
        let wparams = <WindowManager.LayoutParams>decor.getLayoutParams();
        let exitAnimation = window.getContext().androidUI.mActivityThread.getOverrideExitAnimation();
        if(exitAnimation === undefined) exitAnimation = wparams.exitAnimation;
        if(exitAnimation){
            let t = this;
            decor.startAnimation(exitAnimation);
            decor.drawAnimation(this.mWindowsLayout, android.os.SystemClock.uptimeMillis(), exitAnimation);//init animation
            this.mWindowsLayout.removeView(decor);
        }else{
            this.mWindowsLayout.removeView(decor);
        }
        
        if(wparams.isFocusable()) {
            let resumeWindowView = this.mWindowsLayout.getTopFocusableWindowView();
            if (resumeWindowView) {
                resumeWindowView.dispatchWindowFocusChanged(true);
                let resumeFocus = resumeWindowView[WindowManager.FocusViewRemember];
                if(resumeFocus){
                    resumeFocus.requestFocus(View.FOCUS_DOWN);
                }
            }
        }
    }
}

export module WindowManager{

    /**
     * children ara windows decor view
     */
    export class Layout extends android.widget.FrameLayout {
        private mWindowManager:WindowManager;

        constructor(context:android.content.Context, windowManager:WindowManager) {
            super(context);
            this.mWindowManager = windowManager;
        }
        

        getTopFocusableWindowView(findParent=true):ViewGroup {
            const count:number = this.getChildCount();
            for (let i:number = count-1; i >=0; i--) {
                let child = this.getChildAt(i);
                let wparams = <WindowManager.LayoutParams>child.getLayoutParams();
                if(wparams.isFocusable()){
                    return <ViewGroup>child;
                }
            }

            if(findParent){
                let decor = this.getParent();
                if(decor!=null){
                    let windowLayout = decor.getParent();
                    if(windowLayout instanceof Layout){
                        return windowLayout.getTopFocusableWindowView();
                    }
                }
            }
        }

        dispatchKeyEvent(event:android.view.KeyEvent):boolean {
            let topFocusView = this.getTopFocusableWindowView(false);
            if(topFocusView && topFocusView.dispatchKeyEvent(event)){
                return true;
            }
            return super.dispatchKeyEvent(event);
        }

        protected isTransformedTouchPointInView(x:number, y:number, child:android.view.View, outLocalPoint:android.graphics.Point):boolean {
            let wparams = <WindowManager.LayoutParams>child.getLayoutParams();
            if(wparams.isFocusable() && wparams.isTouchable()){
                //handle touch to window
                return true;
            }
            return false;//super.isTransformedTouchPointInView(x, y, child, outLocalPoint);
        }

        onChildVisibilityChanged(child:android.view.View, oldVisibility:number, newVisibility:number):void {
            super.onChildVisibilityChanged(child, oldVisibility, newVisibility);

            let wparams = <WindowManager.LayoutParams>child.getLayoutParams();
            if(newVisibility === View.VISIBLE){
                let resumeAnimation = child.getContext().androidUI.mActivityThread.getOverrideResumeAnimation();
                if(resumeAnimation === undefined) resumeAnimation = wparams.resumeAnimation;
                if(resumeAnimation){
                    child.startAnimation(resumeAnimation);
                }
            }else{
                let hideAnimation = child.getContext().androidUI.mActivityThread.getOverrideHideAnimation();
                if(hideAnimation === undefined) hideAnimation = wparams.hideAnimation;
                if(hideAnimation){
                    child.startAnimation(hideAnimation);
                    child.drawAnimation(this, android.os.SystemClock.uptimeMillis(), hideAnimation);//init animation
                }
            }
        }

        protected onLayout(changed: boolean, left: number, top: number, right: number, bottom: number): void {
            this.layoutChildren(left, top, right, bottom, false /* no force left gravity */);
        }

        layoutChildren(left: number, top: number, right: number, bottom: number, forceLeftGravity: boolean): void {
            const count = this.getChildCount();

            const parentLeft = this.getPaddingLeftWithForeground();
            const parentRight = right - left - this.getPaddingRightWithForeground();

            const parentTop = this.getPaddingTopWithForeground();
            const parentBottom = bottom - top - this.getPaddingBottomWithForeground();

            this.mForegroundBoundsChanged = true;

            for (let i = 0; i < count; i++) {
                let child = this.getChildAt(i);
                if (child.getVisibility() != View.GONE) {
                    const lp = <WindowManager.LayoutParams> child.getLayoutParams();

                    const width = child.getMeasuredWidth();
                    const height = child.getMeasuredHeight();

                    let childLeft;
                    let childTop;

                    let gravity = lp.gravity;
                    if (gravity == -1) {
                        gravity = Layout.DEFAULT_CHILD_GRAVITY;
                    }

                    //const layoutDirection = getLayoutDirection();
                    const absoluteGravity = gravity;//Gravity.getAbsoluteGravity(gravity, layoutDirection);
                    const verticalGravity = gravity & Gravity.VERTICAL_GRAVITY_MASK;

                    switch (absoluteGravity & Gravity.HORIZONTAL_GRAVITY_MASK) {
                        case Gravity.CENTER_HORIZONTAL:
                            childLeft = parentLeft + (parentRight - parentLeft - width) / 2 + lp.leftMargin - lp.rightMargin;
                            break;
                        case Gravity.RIGHT:
                            if (!forceLeftGravity) {
                                childLeft = parentRight - width - lp.rightMargin - lp.x;
                                break;
                            }
                        case Gravity.LEFT:
                        default:
                            childLeft = parentLeft + lp.leftMargin + lp.x;
                    }

                    switch (verticalGravity) {
                        case Gravity.TOP:
                            childTop = parentTop + lp.topMargin + lp.y;
                            break;
                        case Gravity.CENTER_VERTICAL:
                            childTop = parentTop + (parentBottom - parentTop - height) / 2 + lp.topMargin - lp.bottomMargin;
                            break;
                        case Gravity.BOTTOM:
                            childTop = parentBottom - height - lp.bottomMargin - lp.y;
                            break;
                        default:
                            childTop = parentTop + lp.topMargin;
                    }

                    child.layout(childLeft, childTop, childLeft + width, childTop + height);
                }
            }
        }

        tagName():string {
            return 'windowsGroup';
        }
    }


export class LayoutParams extends android.widget.FrameLayout.LayoutParams {

    /**
         * X position for this window.  With the default gravity it is ignored.
         * When using {@link Gravity#LEFT} or {@link Gravity#START} or {@link Gravity#RIGHT} or
         * {@link Gravity#END} it provides an offset from the given edge.
         */
    x:number = 0;

    /**
         * Y position for this window.  With the default gravity it is ignored.
         * When using {@link Gravity#TOP} or {@link Gravity#BOTTOM} it provides
         * an offset from the given edge.
         */
    y:number = 0;

    ///**
    //     * Indicates how much of the extra space will be allocated horizontally
    //     * to the view associated with these LayoutParams. Specify 0 if the view
    //     * should not be stretched. Otherwise the extra pixels will be pro-rated
    //     * among all views whose weight is greater than 0.
    //     */
    //horizontalWeight:number = 0;
    //
    ///**
    //     * Indicates how much of the extra space will be allocated vertically
    //     * to the view associated with these LayoutParams. Specify 0 if the view
    //     * should not be stretched. Otherwise the extra pixels will be pro-rated
    //     * among all views whose weight is greater than 0.
    //     */
    //verticalWeight:number = 0;

    /**
         * The general type of window.  There are three main classes of
         * window types:
         * <ul>
         * <li> <strong>Application windows</strong> (ranging from
         * {@link #FIRST_APPLICATION_WINDOW} to
         * {@link #LAST_APPLICATION_WINDOW}) are normal top-level application
         * windows.  For these types of windows, the {@link #token} must be
         * set to the token of the activity they are a part of (this will
         * normally be done for you if {@link #token} is null).
         * <li> <strong>Sub-windows</strong> (ranging from
         * {@link #FIRST_SUB_WINDOW} to
         * {@link #LAST_SUB_WINDOW}) are associated with another top-level
         * window.  For these types of windows, the {@link #token} must be
         * the token of the window it is attached to.
         * <li> <strong>System windows</strong> (ranging from
         * {@link #FIRST_SYSTEM_WINDOW} to
         * {@link #LAST_SYSTEM_WINDOW}) are special types of windows for
         * use by the system for specific purposes.  They should not normally
         * be used by applications, and a special permission is required
         * to use them.
         * </ul>
         * 
         * @see #TYPE_BASE_APPLICATION
         * @see #TYPE_APPLICATION
         * @see #TYPE_APPLICATION_STARTING
         * @see #TYPE_APPLICATION_PANEL
         * @see #TYPE_APPLICATION_MEDIA
         * @see #TYPE_APPLICATION_SUB_PANEL
         * @see #TYPE_APPLICATION_ATTACHED_DIALOG
         * @see #TYPE_STATUS_BAR
         * @see #TYPE_SEARCH_BAR
         * @see #TYPE_PHONE
         * @see #TYPE_SYSTEM_ALERT
         * @see #TYPE_KEYGUARD
         * @see #TYPE_TOAST
         * @see #TYPE_SYSTEM_OVERLAY
         * @see #TYPE_PRIORITY_PHONE
         * @see #TYPE_STATUS_BAR_PANEL
         * @see #TYPE_SYSTEM_DIALOG
         * @see #TYPE_KEYGUARD_DIALOG
         * @see #TYPE_SYSTEM_ERROR
         * @see #TYPE_INPUT_METHOD
         * @see #TYPE_INPUT_METHOD_DIALOG
         */
    type:number = 0;

    /**
         * Start of window types that represent normal application windows.
         */
    static FIRST_APPLICATION_WINDOW:number = 1;

    /**
         * Window type: an application window that serves as the "base" window
         * of the overall application; all other application windows will
         * appear on top of it.
         * In multiuser systems shows only on the owning user's window.
         */
    static TYPE_BASE_APPLICATION:number = 1;

    /**
         * Window type: a normal application window.  The {@link #token} must be
         * an Activity token identifying who the window belongs to.
         * In multiuser systems shows only on the owning user's window.
         */
    static TYPE_APPLICATION:number = 2;

    /**
         * Window type: special application window that is displayed while the
         * application is starting.  Not for use by applications themselves;
         * this is used by the system to display something until the
         * application can show its own windows.
         * In multiuser systems shows on all users' windows.
         */
    static TYPE_APPLICATION_STARTING:number = 3;

    /**
         * End of types of application windows.
         */
    static LAST_APPLICATION_WINDOW:number = 99;

    /**
         * Start of types of sub-windows.  The {@link #token} of these windows
         * must be set to the window they are attached to.  These types of
         * windows are kept next to their attached window in Z-order, and their
         * coordinate space is relative to their attached window.
         */
    static FIRST_SUB_WINDOW:number = 1000;

    /**
         * Window type: a panel on top of an application window.  These windows
         * appear on top of their attached window.
         */
    static TYPE_APPLICATION_PANEL:number = LayoutParams.FIRST_SUB_WINDOW;

    /**
         * Window type: window for showing media (such as video).  These windows
         * are displayed behind their attached window.
         */
    static TYPE_APPLICATION_MEDIA:number = LayoutParams.FIRST_SUB_WINDOW + 1;

    /**
         * Window type: a sub-panel on top of an application window.  These
         * windows are displayed on top their attached window and any
         * {@link #TYPE_APPLICATION_PANEL} panels.
         */
    static TYPE_APPLICATION_SUB_PANEL:number = LayoutParams.FIRST_SUB_WINDOW + 2;

    /** Window type: like {@link #TYPE_APPLICATION_PANEL}, but layout
         * of the window happens as that of a top-level window, <em>not</em>
         * as a child of its container.
         */
    static TYPE_APPLICATION_ATTACHED_DIALOG:number = LayoutParams.FIRST_SUB_WINDOW + 3;

    /**
         * Window type: window for showing overlays on top of media windows.
         * These windows are displayed between TYPE_APPLICATION_MEDIA and the
         * application window.  They should be translucent to be useful.  This
         * is a big ugly hack so:
         * @hide
         */
    static TYPE_APPLICATION_MEDIA_OVERLAY:number = LayoutParams.FIRST_SUB_WINDOW + 4;

    /**
         * End of types of sub-windows.
         */
    static LAST_SUB_WINDOW:number = 1999;

    /**
         * Start of system-specific window types.  These are not normally
         * created by applications.
         */
    static FIRST_SYSTEM_WINDOW:number = 2000;

    /**
         * Window type: the status bar.  There can be only one status bar
         * window; it is placed at the top of the screen, and all other
         * windows are shifted down so they are below it.
         * In multiuser systems shows on all users' windows.
         */
    static TYPE_STATUS_BAR:number = LayoutParams.FIRST_SYSTEM_WINDOW;

    /**
         * Window type: the search bar.  There can be only one search bar
         * window; it is placed at the top of the screen.
         * In multiuser systems shows on all users' windows.
         */
    static TYPE_SEARCH_BAR:number = LayoutParams.FIRST_SYSTEM_WINDOW + 1;

    /**
         * Window type: phone.  These are non-application windows providing
         * user interaction with the phone (in particular incoming calls).
         * These windows are normally placed above all applications, but behind
         * the status bar.
         * In multiuser systems shows on all users' windows.
         */
    static TYPE_PHONE:number = LayoutParams.FIRST_SYSTEM_WINDOW + 2;

    /**
         * Window type: system window, such as low power alert. These windows
         * are always on top of application windows.
         * In multiuser systems shows only on the owning user's window.
         */
    static TYPE_SYSTEM_ALERT:number = LayoutParams.FIRST_SYSTEM_WINDOW + 3;

    /**
         * Window type: keyguard window.
         * In multiuser systems shows on all users' windows.
         */
    static TYPE_KEYGUARD:number = LayoutParams.FIRST_SYSTEM_WINDOW + 4;

    /**
         * Window type: transient notifications.
         * In multiuser systems shows only on the owning user's window.
         */
    static TYPE_TOAST:number = LayoutParams.FIRST_SYSTEM_WINDOW + 5;

    /**
         * Window type: system overlay windows, which need to be displayed
         * on top of everything else.  These windows must not take input
         * focus, or they will interfere with the keyguard.
         * In multiuser systems shows only on the owning user's window.
         */
    static TYPE_SYSTEM_OVERLAY:number = LayoutParams.FIRST_SYSTEM_WINDOW + 6;

    /**
         * Window type: priority phone UI, which needs to be displayed even if
         * the keyguard is active.  These windows must not take input
         * focus, or they will interfere with the keyguard.
         * In multiuser systems shows on all users' windows.
         */
    static TYPE_PRIORITY_PHONE:number = LayoutParams.FIRST_SYSTEM_WINDOW + 7;

    /**
         * Window type: panel that slides out from the status bar
         * In multiuser systems shows on all users' windows.
         */
    static TYPE_SYSTEM_DIALOG:number = LayoutParams.FIRST_SYSTEM_WINDOW + 8;

    ///**
    //     * Window type: dialogs that the keyguard shows
    //     * In multiuser systems shows on all users' windows.
    //     */
    //static TYPE_KEYGUARD_DIALOG:number = LayoutParams.FIRST_SYSTEM_WINDOW + 9;
    //
    ///**
    //     * Window type: internal system error windows, appear on top of
    //     * everything they can.
    //     * In multiuser systems shows only on the owning user's window.
    //     */
    //static TYPE_SYSTEM_ERROR:number = LayoutParams.FIRST_SYSTEM_WINDOW + 10;
    //
    ///**
    //     * Window type: internal input methods windows, which appear above
    //     * the normal UI.  Application windows may be resized or panned to keep
    //     * the input focus visible while this window is displayed.
    //     * In multiuser systems shows only on the owning user's window.
    //     */
    //static TYPE_INPUT_METHOD:number = LayoutParams.FIRST_SYSTEM_WINDOW + 11;
    //
    ///**
    //     * Window type: internal input methods dialog windows, which appear above
    //     * the current input method window.
    //     * In multiuser systems shows only on the owning user's window.
    //     */
    //static TYPE_INPUT_METHOD_DIALOG:number = LayoutParams.FIRST_SYSTEM_WINDOW + 12;
    //
    ///**
    //     * Window type: wallpaper window, placed behind any window that wants
    //     * to sit on top of the wallpaper.
    //     * In multiuser systems shows only on the owning user's window.
    //     */
    //static TYPE_WALLPAPER:number = LayoutParams.FIRST_SYSTEM_WINDOW + 13;
    //
    ///**
    //     * Window type: panel that slides out from over the status bar
    //     * In multiuser systems shows on all users' windows.
    //     */
    //static TYPE_STATUS_BAR_PANEL:number = LayoutParams.FIRST_SYSTEM_WINDOW + 14;
    //
    ///**
    //     * Window type: secure system overlay windows, which need to be displayed
    //     * on top of everything else.  These windows must not take input
    //     * focus, or they will interfere with the keyguard.
    //     *
    //     * This is exactly like {@link #TYPE_SYSTEM_OVERLAY} except that only the
    //     * system itself is allowed to create these overlays.  Applications cannot
    //     * obtain permission to create secure system overlays.
    //     *
    //     * In multiuser systems shows only on the owning user's window.
    //     * @hide
    //     */
    //static TYPE_SECURE_SYSTEM_OVERLAY:number = LayoutParams.FIRST_SYSTEM_WINDOW + 15;
    //
    ///**
    //     * Window type: the drag-and-drop pseudowindow.  There is only one
    //     * drag layer (at most), and it is placed on top of all other windows.
    //     * In multiuser systems shows only on the owning user's window.
    //     * @hide
    //     */
    //static TYPE_DRAG:number = LayoutParams.FIRST_SYSTEM_WINDOW + 16;
    //
    ///**
    //     * Window type: panel that slides out from under the status bar
    //     * In multiuser systems shows on all users' windows.
    //     * @hide
    //     */
    //static TYPE_STATUS_BAR_SUB_PANEL:number = LayoutParams.FIRST_SYSTEM_WINDOW + 17;
    //
    ///**
    //     * Window type: (mouse) pointer
    //     * In multiuser systems shows on all users' windows.
    //     * @hide
    //     */
    //static TYPE_POINTER:number = LayoutParams.FIRST_SYSTEM_WINDOW + 18;
    //
    ///**
    //     * Window type: Navigation bar (when distinct from status bar)
    //     * In multiuser systems shows on all users' windows.
    //     * @hide
    //     */
    //static TYPE_NAVIGATION_BAR:number = LayoutParams.FIRST_SYSTEM_WINDOW + 19;
    //
    ///**
    //     * Window type: The volume level overlay/dialog shown when the user
    //     * changes the system volume.
    //     * In multiuser systems shows on all users' windows.
    //     * @hide
    //     */
    //static TYPE_VOLUME_OVERLAY:number = LayoutParams.FIRST_SYSTEM_WINDOW + 20;
    //
    ///**
    //     * Window type: The boot progress dialog, goes on top of everything
    //     * in the world.
    //     * In multiuser systems shows on all users' windows.
    //     * @hide
    //     */
    //static TYPE_BOOT_PROGRESS:number = LayoutParams.FIRST_SYSTEM_WINDOW + 21;
    //
    ///**
    //     * Window type: Fake window to consume touch events when the navigation
    //     * bar is hidden.
    //     * In multiuser systems shows on all users' windows.
    //     * @hide
    //     */
    //static TYPE_HIDDEN_NAV_CONSUMER:number = LayoutParams.FIRST_SYSTEM_WINDOW + 22;
    //
    ///**
    //     * Window type: Dreams (screen saver) window, just above keyguard.
    //     * In multiuser systems shows only on the owning user's window.
    //     * @hide
    //     */
    //static TYPE_DREAM:number = LayoutParams.FIRST_SYSTEM_WINDOW + 23;
    //
    ///**
    //     * Window type: Navigation bar panel (when navigation bar is distinct from status bar)
    //     * In multiuser systems shows on all users' windows.
    //     * @hide
    //     */
    //static TYPE_NAVIGATION_BAR_PANEL:number = LayoutParams.FIRST_SYSTEM_WINDOW + 24;
    //
    ///**
    //     * Window type: Behind the universe of the real windows.
    //     * In multiuser systems shows on all users' windows.
    //     * @hide
    //     */
    //static TYPE_UNIVERSE_BACKGROUND:number = LayoutParams.FIRST_SYSTEM_WINDOW + 25;
    //
    ///**
    //     * Window type: Display overlay window.  Used to simulate secondary display devices.
    //     * In multiuser systems shows on all users' windows.
    //     * @hide
    //     */
    //static TYPE_DISPLAY_OVERLAY:number = LayoutParams.FIRST_SYSTEM_WINDOW + 26;
    //
    ///**
    //     * Window type: Magnification overlay window. Used to highlight the magnified
    //     * portion of a display when accessibility magnification is enabled.
    //     * In multiuser systems shows on all users' windows.
    //     * @hide
    //     */
    //static TYPE_MAGNIFICATION_OVERLAY:number = LayoutParams.FIRST_SYSTEM_WINDOW + 27;
    //
    ///**
    //     * Window type: Recents. Same layer as {@link #TYPE_SYSTEM_DIALOG} but only appears on
    //     * one user's screen.
    //     * In multiuser systems shows on all users' windows.
    //     * @hide
    //     */
    //static TYPE_RECENTS_OVERLAY:number = LayoutParams.FIRST_SYSTEM_WINDOW + 28;
    //
    ///**
    //     * Window type: keyguard scrim window. Shows if keyguard needs to be restarted.
    //     * In multiuser systems shows on all users' windows.
    //     * @hide
    //     */
    //static TYPE_KEYGUARD_SCRIM:number = LayoutParams.FIRST_SYSTEM_WINDOW + 29;
    //
    ///**
    //     * Window type: Window for Presentation on top of private
    //     * virtual display.
    //     */
    //static TYPE_PRIVATE_PRESENTATION:number = LayoutParams.FIRST_SYSTEM_WINDOW + 30;

    /**
         * End of types of system windows.
         */
    static LAST_SYSTEM_WINDOW:number = 2999;

    ///** @deprecated this is ignored, this value is set automatically when needed. */
    //static MEMORY_TYPE_NORMAL:number = 0;
    //
    ///** @deprecated this is ignored, this value is set automatically when needed. */
    //static MEMORY_TYPE_HARDWARE:number = 1;
    //
    ///** @deprecated this is ignored, this value is set automatically when needed. */
    //static MEMORY_TYPE_GPU:number = 2;
    //
    ///** @deprecated this is ignored, this value is set automatically when needed. */
    //static MEMORY_TYPE_PUSH_BUFFERS:number = 3;
    //
    ///**
    //     * @deprecated this is ignored
    //     */
    //memoryType:number = 0;

    ///** Window flag: as long as this window is visible to the user, allow
    //     *  the lock screen to activate while the screen is on.
    //     *  This can be used independently, or in combination with
    //     *  {@link #FLAG_KEEP_SCREEN_ON} and/or {@link #FLAG_SHOW_WHEN_LOCKED} */
    //static FLAG_ALLOW_LOCK_WHILE_SCREEN_ON:number = 0x00000001;

    ///** Window flag: everything behind this window will be dimmed.
    //     *  Use {@link #dimAmount} to control the amount of dim. */
    //static FLAG_DIM_BEHIND:number = 0x00000002;

    ///** Window flag: blur everything behind this window.
    //     * @deprecated Blurring is no longer supported. */
    //static FLAG_BLUR_BEHIND:number = 0x00000004;

    /** Window flag: this window won't ever get key input focus, so the
         * user can not send key or other button events to it.  Those will
         * instead go to whatever focusable window is behind it.  This flag
         * will also enable {@link #FLAG_NOT_TOUCH_MODAL} whether or not that
         * is explicitly set.
         * 
         * <p>Setting this flag also implies that the window will not need to
         * interact with
         * a soft input method, so it will be Z-ordered and positioned 
         * independently of any active input method (typically this means it
         * gets Z-ordered on top of the input method, so it can use the full
         * screen for its content and cover the input method if needed.  You
         * can use {@link #FLAG_ALT_FOCUSABLE_IM} to modify this behavior. */
    static FLAG_NOT_FOCUSABLE:number = 0x00000008;

    /** Window flag: this window can never receive touch events. */
    static FLAG_NOT_TOUCHABLE:number = 0x00000010;

    /** Window flag: even when this window is focusable (its
         * {@link #FLAG_NOT_FOCUSABLE} is not set), allow any pointer events
         * outside of the window to be sent to the windows behind it.  Otherwise
         * it will consume all pointer events itself, regardless of whether they
         * are inside of the window. */
    static FLAG_NOT_TOUCH_MODAL:number = 0x00000020;

    ///** Window flag: when set, if the device is asleep when the touch
    //     * screen is pressed, you will receive this first touch event.  Usually
    //     * the first touch event is consumed by the system since the user can
    //     * not see what they are pressing on.
    //     */
    //static FLAG_TOUCHABLE_WHEN_WAKING:number = 0x00000040;
    //
    ///** Window flag: as long as this window is visible to the user, keep
    //     *  the device's screen turned on and bright. */
    //static FLAG_KEEP_SCREEN_ON:number = 0x00000080;
    //
    ///** Window flag: place the window within the entire screen, ignoring
    //     *  decorations around the border (such as the status bar).  The
    //     *  window must correctly position its contents to take the screen
    //     *  decoration into account.  This flag is normally set for you
    //     *  by Window as described in {@link Window#setFlags}. */
    //static FLAG_LAYOUT_IN_SCREEN:number = 0x00000100;
    //
    ///** Window flag: allow window to extend outside of the screen. */
    //static FLAG_LAYOUT_NO_LIMITS:number = 0x00000200;

    ///**
    //     * Window flag: hide all screen decorations (such as the status bar) while
    //     * this window is displayed.  This allows the window to use the entire
    //     * display space for itself -- the status bar will be hidden when
    //     * an app window with this flag set is on the top layer. A fullscreen window
    //     * will ignore a value of {@link #SOFT_INPUT_ADJUST_RESIZE} for the window's
    //     * {@link #softInputMode} field; the window will stay fullscreen
    //     * and will not resize.
    //     *
    //     * <p>This flag can be controlled in your theme through the
    //     * {@link android.R.attr#windowFullscreen} attribute; this attribute
    //     * is automatically set for you in the standard fullscreen themes
    //     * such as {@link android.R.style#Theme_NoTitleBar_Fullscreen},
    //     * {@link android.R.style#Theme_Black_NoTitleBar_Fullscreen},
    //     * {@link android.R.style#Theme_Light_NoTitleBar_Fullscreen},
    //     * {@link android.R.style#Theme_Holo_NoActionBar_Fullscreen},
    //     * {@link android.R.style#Theme_Holo_Light_NoActionBar_Fullscreen},
    //     * {@link android.R.style#Theme_DeviceDefault_NoActionBar_Fullscreen}, and
    //     * {@link android.R.style#Theme_DeviceDefault_Light_NoActionBar_Fullscreen}.</p>
    //     */
    //static FLAG_FULLSCREEN:number = 0x00000400;
    //
    ///** Window flag: override {@link #FLAG_FULLSCREEN} and force the
    //     *  screen decorations (such as the status bar) to be shown. */
    //static FLAG_FORCE_NOT_FULLSCREEN:number = 0x00000800;
    //
    ///** Window flag: turn on dithering when compositing this window to
    //     *  the screen.
    //     * @deprecated This flag is no longer used. */
    //static FLAG_DITHER:number = 0x00001000;
    //
    ///** Window flag: treat the content of the window as secure, preventing
    //     * it from appearing in screenshots or from being viewed on non-secure
    //     * displays.
    //     *
    //     * <p>See {@link android.view.Display#FLAG_SECURE} for more details about
    //     * secure surfaces and secure displays.
    //     */
    //static FLAG_SECURE:number = 0x00002000;
    //
    ///** Window flag: a special mode where the layout parameters are used
    //     * to perform scaling of the surface when it is composited to the
    //     * screen. */
    //static FLAG_SCALED:number = 0x00004000;
    //
    ///** Window flag: intended for windows that will often be used when the user is
    //     * holding the screen against their face, it will aggressively filter the event
    //     * stream to prevent unintended presses in this situation that may not be
    //     * desired for a particular window, when such an event stream is detected, the
    //     * application will receive a CANCEL motion event to indicate this so applications
    //     * can handle this accordingly by taking no action on the event
    //     * until the finger is released. */
    //static FLAG_IGNORE_CHEEK_PRESSES:number = 0x00008000;
    //
    ///** Window flag: a special option only for use in combination with
    //     * {@link #FLAG_LAYOUT_IN_SCREEN}.  When requesting layout in the
    //     * screen your window may appear on top of or behind screen decorations
    //     * such as the status bar.  By also including this flag, the window
    //     * manager will report the inset rectangle needed to ensure your
    //     * content is not covered by screen decorations.  This flag is normally
    //     * set for you by Window as described in {@link Window#setFlags}.*/
    //static FLAG_LAYOUT_INSET_DECOR:number = 0x00010000;
    //
    ///** Window flag: invert the state of {@link #FLAG_NOT_FOCUSABLE} with
    //     * respect to how this window interacts with the current method.  That
    //     * is, if FLAG_NOT_FOCUSABLE is set and this flag is set, then the
    //     * window will behave as if it needs to interact with the input method
    //     * and thus be placed behind/away from it; if FLAG_NOT_FOCUSABLE is
    //     * not set and this flag is set, then the window will behave as if it
    //     * doesn't need to interact with the input method and can be placed
    //     * to use more space and cover the input method.
    //     */
    //static FLAG_ALT_FOCUSABLE_IM:number = 0x00020000;
    //
    /** Window flag: if you have set {@link #FLAG_NOT_TOUCH_MODAL}, you
         * can set this flag to receive a single special MotionEvent with
         * the action
         * {@link MotionEvent#ACTION_OUTSIDE MotionEvent.ACTION_OUTSIDE} for
         * touches that occur outside of your window.  Note that you will not
         * receive the full down/move/up gesture, only the location of the
         * first down as an ACTION_OUTSIDE.
         */
    static FLAG_WATCH_OUTSIDE_TOUCH:number = 0x00040000;
    //
    ///** Window flag: special flag to let windows be shown when the screen
    //     * is locked. This will let application windows take precedence over
    //     * key guard or any other lock screens. Can be used with
    //     * {@link #FLAG_KEEP_SCREEN_ON} to turn screen on and display windows
    //     * directly before showing the key guard window.  Can be used with
    //     * {@link #FLAG_DISMISS_KEYGUARD} to automatically fully dismisss
    //     * non-secure keyguards.  This flag only applies to the top-most
    //     * full-screen window.
    //     */
    //static FLAG_SHOW_WHEN_LOCKED:number = 0x00080000;
    //
    ///** Window flag: ask that the system wallpaper be shown behind
    //     * your window.  The window surface must be translucent to be able
    //     * to actually see the wallpaper behind it; this flag just ensures
    //     * that the wallpaper surface will be there if this window actually
    //     * has translucent regions.
    //     *
    //     * <p>This flag can be controlled in your theme through the
    //     * {@link android.R.attr#windowShowWallpaper} attribute; this attribute
    //     * is automatically set for you in the standard wallpaper themes
    //     * such as {@link android.R.style#Theme_Wallpaper},
    //     * {@link android.R.style#Theme_Wallpaper_NoTitleBar},
    //     * {@link android.R.style#Theme_Wallpaper_NoTitleBar_Fullscreen},
    //     * {@link android.R.style#Theme_Holo_Wallpaper},
    //     * {@link android.R.style#Theme_Holo_Wallpaper_NoTitleBar},
    //     * {@link android.R.style#Theme_DeviceDefault_Wallpaper}, and
    //     * {@link android.R.style#Theme_DeviceDefault_Wallpaper_NoTitleBar}.</p>
    //     */
    //static FLAG_SHOW_WALLPAPER:number = 0x00100000;
    //
    ///** Window flag: when set as a window is being added or made
    //     * visible, once the window has been shown then the system will
    //     * poke the power manager's user activity (as if the user had woken
    //     * up the device) to turn the screen on. */
    //static FLAG_TURN_SCREEN_ON:number = 0x00200000;
    //
    ///** Window flag: when set the window will cause the keyguard to
    //     * be dismissed, only if it is not a secure lock keyguard.  Because such
    //     * a keyguard is not needed for security, it will never re-appear if
    //     * the user navigates to another window (in contrast to
    //     * {@link #FLAG_SHOW_WHEN_LOCKED}, which will only temporarily
    //     * hide both secure and non-secure keyguards but ensure they reappear
    //     * when the user moves to another UI that doesn't hide them).
    //     * If the keyguard is currently active and is secure (requires an
    //     * unlock pattern) than the user will still need to confirm it before
    //     * seeing this window, unless {@link #FLAG_SHOW_WHEN_LOCKED} has
    //     * also been set.
    //     */
    //static FLAG_DISMISS_KEYGUARD:number = 0x00400000;

    /** Window flag: when set the window will accept for touch events
         * outside of its bounds to be sent to other windows that also
         * support split touch.  When this flag is not set, the first pointer
         * that goes down determines the window to which all subsequent touches
         * go until all pointers go up.  When this flag is set, each pointer
         * (not necessarily the first) that goes down determines the window
         * to which all subsequent touches of that pointer will go until that
         * pointer goes up thereby enabling touches with multiple pointers
         * to be split across multiple windows.
         */
    static FLAG_SPLIT_TOUCH:number = 0x00800000;

    ///**
    //     * <p>Indicates whether this window should be hardware accelerated.
    //     * Requesting hardware acceleration does not guarantee it will happen.</p>
    //     *
    //     * <p>This flag can be controlled programmatically <em>only</em> to enable
    //     * hardware acceleration. To enable hardware acceleration for a given
    //     * window programmatically, do the following:</p>
    //     *
    //     * <pre>
    //     * Window w = activity.getWindow(); // in Activity's onCreate() for instance
    //     * w.setFlags(WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
    //     *         WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED);
    //     * </pre>
    //     *
    //     * <p>It is important to remember that this flag <strong>must</strong>
    //     * be set before setting the content view of your activity or dialog.</p>
    //     *
    //     * <p>This flag cannot be used to disable hardware acceleration after it
    //     * was enabled in your manifest using
    //     * {@link android.R.attr#hardwareAccelerated}. If you need to selectively
    //     * and programmatically disable hardware acceleration (for automated testing
    //     * for instance), make sure it is turned off in your manifest and enable it
    //     * on your activity or dialog when you need it instead, using the method
    //     * described above.</p>
    //     *
    //     * <p>This flag is automatically set by the system if the
    //     * {@link android.R.attr#hardwareAccelerated android:hardwareAccelerated}
    //     * XML attribute is set to true on an activity or on the application.</p>
    //     */
    //static FLAG_HARDWARE_ACCELERATED:number = 0x01000000;
    //
    ///**
    //     * Window flag: allow window contents to extend in to the screen's
    //     * overscan area, if there is one.  The window should still correctly
    //     * position its contents to take the overscan area into account.
    //     *
    //     * <p>This flag can be controlled in your theme through the
    //     * {@link android.R.attr#windowOverscan} attribute; this attribute
    //     * is automatically set for you in the standard overscan themes
    //     * such as
    //     * {@link android.R.style#Theme_Holo_NoActionBar_Overscan},
    //     * {@link android.R.style#Theme_Holo_Light_NoActionBar_Overscan},
    //     * {@link android.R.style#Theme_DeviceDefault_NoActionBar_Overscan}, and
    //     * {@link android.R.style#Theme_DeviceDefault_Light_NoActionBar_Overscan}.</p>
    //     *
    //     * <p>When this flag is enabled for a window, its normal content may be obscured
    //     * to some degree by the overscan region of the display.  To ensure key parts of
    //     * that content are visible to the user, you can use
    //     * {@link View#setFitsSystemWindows(boolean) View.setFitsSystemWindows(boolean)}
    //     * to set the point in the view hierarchy where the appropriate offsets should
    //     * be applied.  (This can be done either by directly calling this function, using
    //     * the {@link android.R.attr#fitsSystemWindows} attribute in your view hierarchy,
    //     * or implementing you own {@link View#fitSystemWindows(android.graphics.Rect)
    //     * View.fitSystemWindows(Rect)} method).</p>
    //     *
    //     * <p>This mechanism for positioning content elements is identical to its equivalent
    //     * use with layout and {@link View#setSystemUiVisibility(int)
    //     * View.setSystemUiVisibility(int)}; here is an example layout that will correctly
    //     * position its UI elements with this overscan flag is set:</p>
    //     *
    //     * {@sample development/samples/ApiDemos/res/layout/overscan_activity.xml complete}
    //     */
    //static FLAG_LAYOUT_IN_OVERSCAN:number = 0x02000000;
    //
    ///**
    //     * Window flag: request a translucent status bar with minimal system-provided
    //     * background protection.
    //     *
    //     * <p>This flag can be controlled in your theme through the
    //     * {@link android.R.attr#windowTranslucentStatus} attribute; this attribute
    //     * is automatically set for you in the standard translucent decor themes
    //     * such as
    //     * {@link android.R.style#Theme_Holo_NoActionBar_TranslucentDecor},
    //     * {@link android.R.style#Theme_Holo_Light_NoActionBar_TranslucentDecor},
    //     * {@link android.R.style#Theme_DeviceDefault_NoActionBar_TranslucentDecor}, and
    //     * {@link android.R.style#Theme_DeviceDefault_Light_NoActionBar_TranslucentDecor}.</p>
    //     *
    //     * <p>When this flag is enabled for a window, it automatically sets
    //     * the system UI visibility flags {@link View#SYSTEM_UI_FLAG_LAYOUT_STABLE} and
    //     * {@link View#SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN}.</p>
    //     */
    //static FLAG_TRANSLUCENT_STATUS:number = 0x04000000;
    //
    ///**
    //     * Window flag: request a translucent navigation bar with minimal system-provided
    //     * background protection.
    //     *
    //     * <p>This flag can be controlled in your theme through the
    //     * {@link android.R.attr#windowTranslucentNavigation} attribute; this attribute
    //     * is automatically set for you in the standard translucent decor themes
    //     * such as
    //     * {@link android.R.style#Theme_Holo_NoActionBar_TranslucentDecor},
    //     * {@link android.R.style#Theme_Holo_Light_NoActionBar_TranslucentDecor},
    //     * {@link android.R.style#Theme_DeviceDefault_NoActionBar_TranslucentDecor}, and
    //     * {@link android.R.style#Theme_DeviceDefault_Light_NoActionBar_TranslucentDecor}.</p>
    //     *
    //     * <p>When this flag is enabled for a window, it automatically sets
    //     * the system UI visibility flags {@link View#SYSTEM_UI_FLAG_LAYOUT_STABLE} and
    //     * {@link View#SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION}.</p>
    //     */
    //static FLAG_TRANSLUCENT_NAVIGATION:number = 0x08000000;

    // ----- HIDDEN FLAGS.
    // These start at the high bit and go down.
    ///**
    //     * Flag for a window in local focus mode.
    //     * Window in local focus mode can control focus independent of window manager using
    //     * {@link Window#setLocalFocus(boolean, boolean)}.
    //     * Usually window in this mode will not get touch/key events from window manager, but will
    //     * get events only via local injection using {@link Window#injectInputEvent(InputEvent)}.
    //     */
    //static FLAG_LOCAL_FOCUS_MODE:number = 0x10000000;
    //
    ///** Window flag: Enable touches to slide out of a window into neighboring
    //     * windows in mid-gesture instead of being captured for the duration of
    //     * the gesture.
    //     *
    //     * This flag changes the behavior of touch focus for this window only.
    //     * Touches can slide out of the window but they cannot necessarily slide
    //     * back in (unless the other window with touch focus permits it).
    //     *
    //     * {@hide}
    //     */
    //static FLAG_SLIPPERY:number = 0x20000000;
    //
    ///**
    //     * Flag for a window belonging to an activity that responds to {@link KeyEvent#KEYCODE_MENU}
    //     * and therefore needs a Menu key. For devices where Menu is a physical button this flag is
    //     * ignored, but on devices where the Menu key is drawn in software it may be hidden unless
    //     * this flag is set.
    //     *
    //     * (Note that Action Bars, when available, are the preferred way to offer additional
    //     * functions otherwise accessed via an options menu.)
    //     *
    //     * {@hide}
    //     */
    //static FLAG_NEEDS_MENU_KEY:number = 0x40000000;

    /**
     * is window floating
     * @type {number}
     */
    static FLAG_FLOATING:number = 0x40000000;

    /**
         * Various behavioral options/flags.  Default is none.
         * 
         * @see #FLAG_ALLOW_LOCK_WHILE_SCREEN_ON
         * @see #FLAG_DIM_BEHIND
         * @see #FLAG_NOT_FOCUSABLE
         * @see #FLAG_NOT_TOUCHABLE
         * @see #FLAG_NOT_TOUCH_MODAL
         * @see #FLAG_TOUCHABLE_WHEN_WAKING
         * @see #FLAG_KEEP_SCREEN_ON
         * @see #FLAG_LAYOUT_IN_SCREEN
         * @see #FLAG_LAYOUT_NO_LIMITS
         * @see #FLAG_FULLSCREEN
         * @see #FLAG_FORCE_NOT_FULLSCREEN
         * @see #FLAG_SECURE
         * @see #FLAG_SCALED
         * @see #FLAG_IGNORE_CHEEK_PRESSES
         * @see #FLAG_LAYOUT_INSET_DECOR
         * @see #FLAG_ALT_FOCUSABLE_IM
         * @see #FLAG_WATCH_OUTSIDE_TOUCH
         * @see #FLAG_SHOW_WHEN_LOCKED
         * @see #FLAG_SHOW_WALLPAPER
         * @see #FLAG_TURN_SCREEN_ON
         * @see #FLAG_DISMISS_KEYGUARD
         * @see #FLAG_SPLIT_TOUCH
         * @see #FLAG_HARDWARE_ACCELERATED
         * @see #FLAG_LOCAL_FOCUS_MODE
         * @see #FLAG_FLOATING
         */
    flags:number = 0;

    ///**
    //     * If the window has requested hardware acceleration, but this is not
    //     * allowed in the process it is in, then still render it as if it is
    //     * hardware accelerated.  This is used for the starting preview windows
    //     * in the system process, which don't need to have the overhead of
    //     * hardware acceleration (they are just a static rendering), but should
    //     * be rendered as such to match the actual window of the app even if it
    //     * is hardware accelerated.
    //     * Even if the window isn't hardware accelerated, still do its rendering
    //     * as if it was.
    //     * Like {@link #FLAG_HARDWARE_ACCELERATED} except for trusted system windows
    //     * that need hardware acceleration (e.g. LockScreen), where hardware acceleration
    //     * is generally disabled. This flag must be specified in addition to
    //     * {@link #FLAG_HARDWARE_ACCELERATED} to enable hardware acceleration for system
    //     * windows.
    //     *
    //     * @hide
    //     */
    //static PRIVATE_FLAG_FAKE_HARDWARE_ACCELERATED:number = 0x00000001;
    //
    ///**
    //     * In the system process, we globally do not use hardware acceleration
    //     * because there are many threads doing UI there and they conflict.
    //     * If certain parts of the UI that really do want to use hardware
    //     * acceleration, this flag can be set to force it.  This is basically
    //     * for the lock screen.  Anyone else using it, you are probably wrong.
    //     *
    //     * @hide
    //     */
    //static PRIVATE_FLAG_FORCE_HARDWARE_ACCELERATED:number = 0x00000002;
    //
    ///**
    //     * By default, wallpapers are sent new offsets when the wallpaper is scrolled. Wallpapers
    //     * may elect to skip these notifications if they are not doing anything productive with
    //     * them (they do not affect the wallpaper scrolling operation) by calling
    //     * {@link
    //     * android.service.wallpaper.WallpaperService.Engine#setOffsetNotificationsEnabled(boolean)}.
    //     *
    //     * @hide
    //     */
    //static PRIVATE_FLAG_WANTS_OFFSET_NOTIFICATIONS:number = 0x00000004;
    //
    ///**
    //     * This is set for a window that has explicitly specified its
    //     * FLAG_NEEDS_MENU_KEY, so we know the value on this window is the
    //     * appropriate one to use.  If this is not set, we should look at
    //     * windows behind it to determine the appropriate value.
    //     *
    //     * @hide
    //     */
    //static PRIVATE_FLAG_SET_NEEDS_MENU_KEY:number = 0x00000008;
    //
    ///** In a multiuser system if this flag is set and the owner is a system process then this
    //     * window will appear on all user screens. This overrides the default behavior of window
    //     * types that normally only appear on the owning user's screen. Refer to each window type
    //     * to determine its default behavior.
    //     *
    //     * {@hide} */
    //static PRIVATE_FLAG_SHOW_FOR_ALL_USERS:number = 0x00000010;
    //
    ///**
    //     * Special flag for the volume overlay: force the window manager out of "hide nav bar"
    //     * mode while the window is on screen.
    //     *
    //     * {@hide} */
    //static PRIVATE_FLAG_FORCE_SHOW_NAV_BAR:number = 0x00000020;
    //
    ///**
    //     * Never animate position changes of the window.
    //     *
    //     * {@hide} */
    //static PRIVATE_FLAG_NO_MOVE_ANIMATION:number = 0x00000040;
    //
    ///** Window flag: special flag to limit the size of the window to be
    //     * original size ([320x480] x density). Used to create window for applications
    //     * running under compatibility mode.
    //     *
    //     * {@hide} */
    //static PRIVATE_FLAG_COMPATIBLE_WINDOW:number = 0x00000080;
    //
    ///** Window flag: a special option intended for system dialogs.  When
    //     * this flag is set, the window will demand focus unconditionally when
    //     * it is created.
    //     * {@hide} */
    //static PRIVATE_FLAG_SYSTEM_ERROR:number = 0x00000100;
    //
    ///** Window flag: maintain the previous translucent decor state when this window
    //     * becomes top-most.
    //     * {@hide} */
    //static PRIVATE_FLAG_INHERIT_TRANSLUCENT_DECOR:number = 0x00000200;
    //
    ///**
    //     * Control flags that are private to the platform.
    //     * @hide
    //     */
    //privateFlags:number = 0;
    //
    ///**
    //     * Given a particular set of window manager flags, determine whether
    //     * such a window may be a target for an input method when it has
    //     * focus.  In particular, this checks the
    //     * {@link #FLAG_NOT_FOCUSABLE} and {@link #FLAG_ALT_FOCUSABLE_IM}
    //     * flags and returns true if the combination of the two corresponds
    //     * to a window that needs to be behind the input method so that the
    //     * user can type into it.
    //     *
    //     * @param flags The current window manager flags.
    //     *
    //     * @return Returns true if such a window should be behind/interact
    //     * with an input method, false if not.
    //     */
    //static mayUseInputMethod(flags:number):boolean  {
    //    switch(flags & (LayoutParams.FLAG_NOT_FOCUSABLE | LayoutParams.FLAG_ALT_FOCUSABLE_IM)) {
    //        case 0:
    //        case LayoutParams.FLAG_NOT_FOCUSABLE | LayoutParams.FLAG_ALT_FOCUSABLE_IM:
    //            return true;
    //    }
    //    return false;
    //}
    //
    ///**
    //     * Mask for {@link #softInputMode} of the bits that determine the
    //     * desired visibility state of the soft input area for this window.
    //     */
    //static SOFT_INPUT_MASK_STATE:number = 0x0f;
    //
    ///**
    //     * Visibility state for {@link #softInputMode}: no state has been specified.
    //     */
    //static SOFT_INPUT_STATE_UNSPECIFIED:number = 0;
    //
    ///**
    //     * Visibility state for {@link #softInputMode}: please don't change the state of
    //     * the soft input area.
    //     */
    //static SOFT_INPUT_STATE_UNCHANGED:number = 1;
    //
    ///**
    //     * Visibility state for {@link #softInputMode}: please hide any soft input
    //     * area when normally appropriate (when the user is navigating
    //     * forward to your window).
    //     */
    //static SOFT_INPUT_STATE_HIDDEN:number = 2;
    //
    ///**
    //     * Visibility state for {@link #softInputMode}: please always hide any
    //     * soft input area when this window receives focus.
    //     */
    //static SOFT_INPUT_STATE_ALWAYS_HIDDEN:number = 3;
    //
    ///**
    //     * Visibility state for {@link #softInputMode}: please show the soft
    //     * input area when normally appropriate (when the user is navigating
    //     * forward to your window).
    //     */
    //static SOFT_INPUT_STATE_VISIBLE:number = 4;
    //
    ///**
    //     * Visibility state for {@link #softInputMode}: please always make the
    //     * soft input area visible when this window receives input focus.
    //     */
    //static SOFT_INPUT_STATE_ALWAYS_VISIBLE:number = 5;
    //
    ///**
    //     * Mask for {@link #softInputMode} of the bits that determine the
    //     * way that the window should be adjusted to accommodate the soft
    //     * input window.
    //     */
    //static SOFT_INPUT_MASK_ADJUST:number = 0xf0;
    //
    ///** Adjustment option for {@link #softInputMode}: nothing specified.
    //     * The system will try to pick one or
    //     * the other depending on the contents of the window.
    //     */
    //static SOFT_INPUT_ADJUST_UNSPECIFIED:number = 0x00;
    //
    ///** Adjustment option for {@link #softInputMode}: set to allow the
    //     * window to be resized when an input
    //     * method is shown, so that its contents are not covered by the input
    //     * method.  This can <em>not</em> be combined with
    //     * {@link #SOFT_INPUT_ADJUST_PAN}; if
    //     * neither of these are set, then the system will try to pick one or
    //     * the other depending on the contents of the window. If the window's
    //     * layout parameter flags include {@link #FLAG_FULLSCREEN}, this
    //     * value for {@link #softInputMode} will be ignored; the window will
    //     * not resize, but will stay fullscreen.
    //     */
    //static SOFT_INPUT_ADJUST_RESIZE:number = 0x10;
    //
    ///** Adjustment option for {@link #softInputMode}: set to have a window
    //     * pan when an input method is
    //     * shown, so it doesn't need to deal with resizing but just panned
    //     * by the framework to ensure the current input focus is visible.  This
    //     * can <em>not</em> be combined with {@link #SOFT_INPUT_ADJUST_RESIZE}; if
    //     * neither of these are set, then the system will try to pick one or
    //     * the other depending on the contents of the window.
    //     */
    //static SOFT_INPUT_ADJUST_PAN:number = 0x20;
    //
    ///** Adjustment option for {@link #softInputMode}: set to have a window
    //     * not adjust for a shown input method.  The window will not be resized,
    //     * and it will not be panned to make its focus visible.
    //     */
    //static SOFT_INPUT_ADJUST_NOTHING:number = 0x30;
    //
    ///**
    //     * Bit for {@link #softInputMode}: set when the user has navigated
    //     * forward to the window.  This is normally set automatically for
    //     * you by the system, though you may want to set it in certain cases
    //     * when you are displaying a window yourself.  This flag will always
    //     * be cleared automatically after the window is displayed.
    //     */
    //static SOFT_INPUT_IS_FORWARD_NAVIGATION:number = 0x100;
    //
    ///**
    //     * Desired operating mode for any soft input area.  May be any combination
    //     * of:
    //     *
    //     * <ul>
    //     * <li> One of the visibility states
    //     * {@link #SOFT_INPUT_STATE_UNSPECIFIED}, {@link #SOFT_INPUT_STATE_UNCHANGED},
    //     * {@link #SOFT_INPUT_STATE_HIDDEN}, {@link #SOFT_INPUT_STATE_ALWAYS_VISIBLE}, or
    //     * {@link #SOFT_INPUT_STATE_VISIBLE}.
    //     * <li> One of the adjustment options
    //     * {@link #SOFT_INPUT_ADJUST_UNSPECIFIED},
    //     * {@link #SOFT_INPUT_ADJUST_RESIZE}, or
    //     * {@link #SOFT_INPUT_ADJUST_PAN}.
    //     * </ul>
    //     *
    //     *
    //     * <p>This flag can be controlled in your theme through the
    //     * {@link android.R.attr#windowSoftInputMode} attribute.</p>
    //     */
    //softInputMode:number = 0;
    //
    ///**
    //     * Placement of window within the screen as per {@link Gravity}.  Both
    //     * {@link Gravity#apply(int, int, int, android.graphics.Rect, int, int,
    //     * android.graphics.Rect) Gravity.apply} and
    //     * {@link Gravity#applyDisplay(int, android.graphics.Rect, android.graphics.Rect)
    //     * Gravity.applyDisplay} are used during window layout, with this value
    //     * given as the desired gravity.  For example you can specify
    //     * {@link Gravity#DISPLAY_CLIP_HORIZONTAL Gravity.DISPLAY_CLIP_HORIZONTAL} and
    //     * {@link Gravity#DISPLAY_CLIP_VERTICAL Gravity.DISPLAY_CLIP_VERTICAL} here
    //     * to control the behavior of
    //     * {@link Gravity#applyDisplay(int, android.graphics.Rect, android.graphics.Rect)
    //     * Gravity.applyDisplay}.
    //     *
    //     * @see Gravity
    //     */
    //gravity:number = 0;
    //
    ///**
    //     * The horizontal margin, as a percentage of the container's width,
    //     * between the container and the widget.  See
    //     * {@link Gravity#apply(int, int, int, android.graphics.Rect, int, int,
    //     * android.graphics.Rect) Gravity.apply} for how this is used.  This
    //     * field is added with {@link #x} to supply the <var>xAdj</var> parameter.
    //     */
    //horizontalMargin:number = 0;
    //
    ///**
    //     * The vertical margin, as a percentage of the container's height,
    //     * between the container and the widget.  See
    //     * {@link Gravity#apply(int, int, int, android.graphics.Rect, int, int,
    //     * android.graphics.Rect) Gravity.apply} for how this is used.  This
    //     * field is added with {@link #y} to supply the <var>yAdj</var> parameter.
    //     */
    //verticalMargin:number = 0;
    //
    ///**
    //     * The desired bitmap format.  May be one of the constants in
    //     * {@link android.graphics.PixelFormat}.  Default is OPAQUE.
    //     */
    //format:number = 0;
    //
    ///**
    //     * A style resource defining the animations to use for this window.
    //     * This must be a system resource; it can not be an application resource
    //     * because the window manager does not have access to applications.
    //     */
    //windowAnimations:number = 0;
    exitAnimation:Animation = android.R.anim.activity_close_exit;
    enterAnimation:Animation = android.R.anim.activity_open_enter;
    resumeAnimation:Animation = android.R.anim.activity_close_enter;
    hideAnimation:Animation = android.R.anim.activity_open_exit;

    //
    ///**
    //     * An alpha value to apply to this entire window.
    //     * An alpha of 1.0 means fully opaque and 0.0 means fully transparent
    //     */
    //alpha:number = 1.0;

    /**
         * When {@link #FLAG_DIM_BEHIND} is set, this is the amount of dimming
         * to apply.  Range is from 1.0 for completely opaque to 0.0 for no
         * dim.
         */
    dimAmount:number = 0;

    ///**
    //     * Default value for {@link #screenBrightness} and {@link #buttonBrightness}
    //     * indicating that the brightness value is not overridden for this window
    //     * and normal brightness policy should be used.
    //     */
    //static BRIGHTNESS_OVERRIDE_NONE:number = -1.0;
    //
    ///**
    //     * Value for {@link #screenBrightness} and {@link #buttonBrightness}
    //     * indicating that the screen or button backlight brightness should be set
    //     * to the lowest value when this window is in front.
    //     */
    //static BRIGHTNESS_OVERRIDE_OFF:number = 0.0;
    //
    ///**
    //     * Value for {@link #screenBrightness} and {@link #buttonBrightness}
    //     * indicating that the screen or button backlight brightness should be set
    //     * to the hightest value when this window is in front.
    //     */
    //static BRIGHTNESS_OVERRIDE_FULL:number = 1.0;

    ///**
    //     * This can be used to override the user's preferred brightness of
    //     * the screen.  A value of less than 0, the default, means to use the
    //     * preferred screen brightness.  0 to 1 adjusts the brightness from
    //     * dark to full bright.
    //     */
    //screenBrightness:number = LayoutParams.BRIGHTNESS_OVERRIDE_NONE;
    //
    ///**
    //     * This can be used to override the standard behavior of the button and
    //     * keyboard backlights.  A value of less than 0, the default, means to
    //     * use the standard backlight behavior.  0 to 1 adjusts the brightness
    //     * from dark to full bright.
    //     */
    //buttonBrightness:number = LayoutParams.BRIGHTNESS_OVERRIDE_NONE;

    ///**
    //     * Value for {@link #rotationAnimation} to define the animation used to
    //     * specify that this window will rotate in or out following a rotation.
    //     */
    //static ROTATION_ANIMATION_ROTATE:number = 0;
    //
    ///**
    //     * Value for {@link #rotationAnimation} to define the animation used to
    //     * specify that this window will fade in or out following a rotation.
    //     */
    //static ROTATION_ANIMATION_CROSSFADE:number = 1;
    //
    ///**
    //     * Value for {@link #rotationAnimation} to define the animation used to
    //     * specify that this window will immediately disappear or appear following
    //     * a rotation.
    //     */
    //static ROTATION_ANIMATION_JUMPCUT:number = 2;
    //
    ///**
    //     * Define the exit and entry animations used on this window when the device is rotated.
    //     * This only has an affect if the incoming and outgoing topmost
    //     * opaque windows have the #FLAG_FULLSCREEN bit set and are not covered
    //     * by other windows. All other situations default to the
    //     * {@link #ROTATION_ANIMATION_ROTATE} behavior.
    //     *
    //     * @see #ROTATION_ANIMATION_ROTATE
    //     * @see #ROTATION_ANIMATION_CROSSFADE
    //     * @see #ROTATION_ANIMATION_JUMPCUT
    //     */
    //rotationAnimation:number = LayoutParams.ROTATION_ANIMATION_ROTATE;

    ///**
    //     * Identifier for this window.  This will usually be filled in for
    //     * you.
    //     */
    //token:IBinder = null;

    ///**
    //     * Name of the package owning this window.
    //     */
    //packageName:string = null;
    //
    ///**
    //     * Specific orientation value for a window.
    //     * May be any of the same values allowed
    //     * for {@link android.content.pm.ActivityInfo#screenOrientation}.
    //     * If not set, a default value of
    //     * {@link android.content.pm.ActivityInfo#SCREEN_ORIENTATION_UNSPECIFIED}
    //     * will be used.
    //     */
    //screenOrientation:number = -1;//ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED;
    //
    ///**
    //     * Control the visibility of the status bar.
    //     *
    //     * @see View#STATUS_BAR_VISIBLE
    //     * @see View#STATUS_BAR_HIDDEN
    //     */
    //systemUiVisibility:number = 0;
    //
    ///**
    //     * @hide
    //     * The ui visibility as requested by the views in this hierarchy.
    //     * the combined value should be systemUiVisibility | subtreeSystemUiVisibility.
    //     */
    //subtreeSystemUiVisibility:number = 0;
    //
    ///**
    //     * Get callbacks about the system ui visibility changing.
    //     *
    //     * TODO: Maybe there should be a bitfield of optional callbacks that we need.
    //     *
    //     * @hide
    //     */
    //hasSystemUiListeners:boolean;

    ///**
    //     * When this window has focus, disable touch pad pointer gesture processing.
    //     * The window will receive raw position updates from the touch pad instead
    //     * of pointer movements and synthetic touch events.
    //     *
    //     * @hide
    //     */
    //static INPUT_FEATURE_DISABLE_POINTER_GESTURES:number = 0x00000001;
    //
    ///**
    //     * Does not construct an input channel for this window.  The channel will therefore
    //     * be incapable of receiving input.
    //     *
    //     * @hide
    //     */
    //static INPUT_FEATURE_NO_INPUT_CHANNEL:number = 0x00000002;
    //
    ///**
    //     * When this window has focus, does not call user activity for all input events so
    //     * the application will have to do it itself.  Should only be used by
    //     * the keyguard and phone app.
    //     * <p>
    //     * Should only be used by the keyguard and phone app.
    //     * </p>
    //     *
    //     * @hide
    //     */
    //static INPUT_FEATURE_DISABLE_USER_ACTIVITY:number = 0x00000004;
    //
    ///**
    //     * Control special features of the input subsystem.
    //     *
    //     * @see #INPUT_FEATURE_DISABLE_POINTER_GESTURES
    //     * @see #INPUT_FEATURE_NO_INPUT_CHANNEL
    //     * @see #INPUT_FEATURE_DISABLE_USER_ACTIVITY
    //     * @hide
    //     */
    //inputFeatures:number = 0;

    ///**
    //     * Sets the number of milliseconds before the user activity timeout occurs
    //     * when this window has focus.  A value of -1 uses the standard timeout.
    //     * A value of 0 uses the minimum support display timeout.
    //     * <p>
    //     * This property can only be used to reduce the user specified display timeout;
    //     * it can never make the timeout longer than it normally would be.
    //     * </p><p>
    //     * Should only be used by the keyguard and phone app.
    //     * </p>
    //     *
    //     * @hide
    //     */
    //userActivityTimeout:number = -1;

    //constructor( ) {
    //    super(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT);
    //    this.type = LayoutParams.TYPE_APPLICATION;
    //    this.format = PixelFormat.OPAQUE;
    //}

    constructor(_type=LayoutParams.TYPE_APPLICATION) {
        super(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT);
        this.type = _type;
        //this.format = PixelFormat.OPAQUE;
    }

    //constructor( _type:number, _flags:number) {
    //    super(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT);
    //    this.type = _type;
    //    flags = _flags;
    //    this.format = PixelFormat.OPAQUE;
    //}
    //
    //constructor( _type:number, _flags:number, _format:number) {
    //    super(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT);
    //    this.type = _type;
    //    flags = _flags;
    //    this.format = _format;
    //}
    //
    //constructor( w:number, h:number, _type:number, _flags:number, _format:number) {
    //    super(w, h);
    //    this.type = _type;
    //    flags = _flags;
    //    this.format = _format;
    //}

    //constructor( w:number, h:number, xpos:number, ypos:number, _type:number, _flags:number, _format:number) {
    //    super(w, h);
    //    this.x = xpos;
    //    this.y = ypos;
    //    this.type = _type;
    //    flags = _flags;
    //    this.format = _format;
    //}

    setTitle(title:string):void  {
        if (null == title) title = "";
        this.mTitle = title;//TextUtils.stringOrSpannedString(title);
    }

    getTitle():string  {
        return this.mTitle;
    }

    static LAYOUT_CHANGED:number = 1 << 0;

    static TYPE_CHANGED:number = 1 << 1;

    static FLAGS_CHANGED:number = 1 << 2;

    static FORMAT_CHANGED:number = 1 << 3;

    static ANIMATION_CHANGED:number = 1 << 4;

    static DIM_AMOUNT_CHANGED:number = 1 << 5;

    static TITLE_CHANGED:number = 1 << 6;

    static ALPHA_CHANGED:number = 1 << 7;
    //
    //static MEMORY_TYPE_CHANGED:number = 1 << 8;
    //
    //static SOFT_INPUT_MODE_CHANGED:number = 1 << 9;
    //
    //static SCREEN_ORIENTATION_CHANGED:number = 1 << 10;
    //
    //static SCREEN_BRIGHTNESS_CHANGED:number = 1 << 11;
    //
    //static ROTATION_ANIMATION_CHANGED:number = 1 << 12;
    //
    ///** {@hide} */
    //static BUTTON_BRIGHTNESS_CHANGED:number = 1 << 13;
    //
    ///** {@hide} */
    //static SYSTEM_UI_VISIBILITY_CHANGED:number = 1 << 14;
    //
    ///** {@hide} */
    //static SYSTEM_UI_LISTENER_CHANGED:number = 1 << 15;
    //
    ///** {@hide} */
    //static INPUT_FEATURES_CHANGED:number = 1 << 16;
    //
    ///** {@hide} */
    //static PRIVATE_FLAGS_CHANGED:number = 1 << 17;
    //
    ///** {@hide} */
    //static USER_ACTIVITY_TIMEOUT_CHANGED:number = 1 << 18;
    //
    ///** {@hide} */
    //static TRANSLUCENT_FLAGS_CHANGED:number = 1 << 19;
    //
    ///** {@hide} */
    //static EVERYTHING_CHANGED:number = 0xffffffff;
    //
    //// internal buffer to backup/restore parameters under compatibility mode.
    //private mCompatibilityParamsBackup:number[] = null;

    copyFrom(o:LayoutParams):number  {
        let changes:number = 0;
        if (this.width != o.width) {
            this.width = o.width;
            changes |= LayoutParams.LAYOUT_CHANGED;
        }
        if (this.height != o.height) {
            this.height = o.height;
            changes |= LayoutParams.LAYOUT_CHANGED;
        }
        if (this.x != o.x) {
            this.x = o.x;
            changes |= LayoutParams.LAYOUT_CHANGED;
        }
        if (this.y != o.y) {
            this.y = o.y;
            changes |= LayoutParams.LAYOUT_CHANGED;
        }
        //if (this.horizontalWeight != o.horizontalWeight) {
        //    this.horizontalWeight = o.horizontalWeight;
        //    changes |= LayoutParams.LAYOUT_CHANGED;
        //}
        //if (this.verticalWeight != o.verticalWeight) {
        //    this.verticalWeight = o.verticalWeight;
        //    changes |= LayoutParams.LAYOUT_CHANGED;
        //}
        //if (this.horizontalMargin != o.horizontalMargin) {
        //    this.horizontalMargin = o.horizontalMargin;
        //    changes |= LayoutParams.LAYOUT_CHANGED;
        //}
        //if (this.verticalMargin != o.verticalMargin) {
        //    this.verticalMargin = o.verticalMargin;
        //    changes |= LayoutParams.LAYOUT_CHANGED;
        //}
        if (this.type != o.type) {
            this.type = o.type;
            changes |= LayoutParams.TYPE_CHANGED;
        }
        if (this.flags != o.flags) {
            const diff:number = this.flags ^ o.flags;
            //if ((diff & (LayoutParams.FLAG_TRANSLUCENT_STATUS | LayoutParams.FLAG_TRANSLUCENT_NAVIGATION)) != 0) {
            //    changes |= LayoutParams.TRANSLUCENT_FLAGS_CHANGED;
            //}
            this.flags = o.flags;
            changes |= LayoutParams.FLAGS_CHANGED;
        }
        //if (this.privateFlags != o.privateFlags) {
        //    this.privateFlags = o.privateFlags;
        //    changes |= LayoutParams.PRIVATE_FLAGS_CHANGED;
        //}
        //if (this.softInputMode != o.softInputMode) {
        //    this.softInputMode = o.softInputMode;
        //    changes |= LayoutParams.SOFT_INPUT_MODE_CHANGED;
        //}
        if (this.gravity != o.gravity) {
            this.gravity = o.gravity;
            changes |= LayoutParams.LAYOUT_CHANGED;
        }
        //if (this.format != o.format) {
        //    this.format = o.format;
        //    changes |= LayoutParams.FORMAT_CHANGED;
        //}
        //if (this.windowAnimations != o.windowAnimations) {
        //    this.windowAnimations = o.windowAnimations;
        //    changes |= LayoutParams.ANIMATION_CHANGED;
        //}
        //if (this.token == null) {
        //    // NOTE: token only copied if the recipient doesn't
        //    // already have one.
        //    this.token = o.token;
        //}
        //if (this.packageName == null) {
        //    // NOTE: packageName only copied if the recipient doesn't
        //    // already have one.
        //    this.packageName = o.packageName;
        //}
        if (this.mTitle != (o.mTitle)) {
            this.mTitle = o.mTitle;
            changes |= LayoutParams.TITLE_CHANGED;
        }
        //if (this.alpha != o.alpha) {
        //    this.alpha = o.alpha;
        //    changes |= LayoutParams.ALPHA_CHANGED;
        //}
        if (this.dimAmount != o.dimAmount) {
            this.dimAmount = o.dimAmount;
            changes |= LayoutParams.DIM_AMOUNT_CHANGED;
        }
        //if (this.screenBrightness != o.screenBrightness) {
        //    this.screenBrightness = o.screenBrightness;
        //    changes |= LayoutParams.SCREEN_BRIGHTNESS_CHANGED;
        //}
        //if (this.buttonBrightness != o.buttonBrightness) {
        //    this.buttonBrightness = o.buttonBrightness;
        //    changes |= LayoutParams.BUTTON_BRIGHTNESS_CHANGED;
        //}
        //if (this.rotationAnimation != o.rotationAnimation) {
        //    this.rotationAnimation = o.rotationAnimation;
        //    changes |= LayoutParams.ROTATION_ANIMATION_CHANGED;
        //}
        //if (this.screenOrientation != o.screenOrientation) {
        //    this.screenOrientation = o.screenOrientation;
        //    changes |= LayoutParams.SCREEN_ORIENTATION_CHANGED;
        //}
        //if (this.systemUiVisibility != o.systemUiVisibility || this.subtreeSystemUiVisibility != o.subtreeSystemUiVisibility) {
        //    this.systemUiVisibility = o.systemUiVisibility;
        //    this.subtreeSystemUiVisibility = o.subtreeSystemUiVisibility;
        //    changes |= LayoutParams.SYSTEM_UI_VISIBILITY_CHANGED;
        //}
        //if (this.hasSystemUiListeners != o.hasSystemUiListeners) {
        //    this.hasSystemUiListeners = o.hasSystemUiListeners;
        //    changes |= LayoutParams.SYSTEM_UI_LISTENER_CHANGED;
        //}
        //if (this.inputFeatures != o.inputFeatures) {
        //    this.inputFeatures = o.inputFeatures;
        //    changes |= LayoutParams.INPUT_FEATURES_CHANGED;
        //}
        //if (this.userActivityTimeout != o.userActivityTimeout) {
        //    this.userActivityTimeout = o.userActivityTimeout;
        //    changes |= LayoutParams.USER_ACTIVITY_TIMEOUT_CHANGED;
        //}
        return changes;
    }

    //debug(output:string):string  {
    //    output += "Contents of " + this + ":";
    //    Log.d("Debug", output);
    //    output = super.debug("");
    //    Log.d("Debug", output);
    //    Log.d("Debug", "");
    //    Log.d("Debug", "WindowManager.LayoutParams={title=" + this.mTitle + "}");
    //    return "";
    //}
    //
    //toString():string  {
    //    let sb:StringBuilder = new StringBuilder(256);
    //    sb.append("WM.LayoutParams{");
    //    sb.append("(");
    //    sb.append(this.x);
    //    sb.append(',');
    //    sb.append(this.y);
    //    sb.append(")(");
    //    sb.append((this.width == LayoutParams.MATCH_PARENT ? "fill" : (this.width == LayoutParams.WRAP_CONTENT ? "wrap" : this.width)));
    //    sb.append('x');
    //    sb.append((this.height == LayoutParams.MATCH_PARENT ? "fill" : (this.height == LayoutParams.WRAP_CONTENT ? "wrap" : this.height)));
    //    sb.append(")");
    //    if (this.horizontalMargin != 0) {
    //        sb.append(" hm=");
    //        sb.append(this.horizontalMargin);
    //    }
    //    if (this.verticalMargin != 0) {
    //        sb.append(" vm=");
    //        sb.append(this.verticalMargin);
    //    }
    //    if (this.gravity != 0) {
    //        sb.append(" gr=#");
    //        sb.append(Integer.toHexString(this.gravity));
    //    }
    //    if (this.softInputMode != 0) {
    //        sb.append(" sim=#");
    //        sb.append(Integer.toHexString(this.softInputMode));
    //    }
    //    sb.append(" ty=");
    //    sb.append(this.type);
    //    sb.append(" fl=#");
    //    sb.append(Integer.toHexString(this.flags));
    //    if (this.privateFlags != 0) {
    //        if ((this.privateFlags & LayoutParams.PRIVATE_FLAG_COMPATIBLE_WINDOW) != 0) {
    //            sb.append(" compatible=true");
    //        }
    //        sb.append(" pfl=0x").append(Integer.toHexString(this.privateFlags));
    //    }
    //    if (this.format != PixelFormat.OPAQUE) {
    //        sb.append(" fmt=");
    //        sb.append(this.format);
    //    }
    //    if (this.windowAnimations != 0) {
    //        sb.append(" wanim=0x");
    //        sb.append(Integer.toHexString(this.windowAnimations));
    //    }
    //    if (this.screenOrientation != -1){//ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED) {
    //        sb.append(" or=");
    //        sb.append(this.screenOrientation);
    //    }
    //    if (this.alpha != 1.0) {
    //        sb.append(" alpha=");
    //        sb.append(this.alpha);
    //    }
    //    if (this.screenBrightness != LayoutParams.BRIGHTNESS_OVERRIDE_NONE) {
    //        sb.append(" sbrt=");
    //        sb.append(this.screenBrightness);
    //    }
    //    if (this.buttonBrightness != LayoutParams.BRIGHTNESS_OVERRIDE_NONE) {
    //        sb.append(" bbrt=");
    //        sb.append(this.buttonBrightness);
    //    }
    //    if (this.rotationAnimation != LayoutParams.ROTATION_ANIMATION_ROTATE) {
    //        sb.append(" rotAnim=");
    //        sb.append(this.rotationAnimation);
    //    }
    //    if (this.systemUiVisibility != 0) {
    //        sb.append(" sysui=0x");
    //        sb.append(Integer.toHexString(this.systemUiVisibility));
    //    }
    //    if (this.subtreeSystemUiVisibility != 0) {
    //        sb.append(" vsysui=0x");
    //        sb.append(Integer.toHexString(this.subtreeSystemUiVisibility));
    //    }
    //    if (this.hasSystemUiListeners) {
    //        sb.append(" sysuil=");
    //        sb.append(this.hasSystemUiListeners);
    //    }
    //    if (this.inputFeatures != 0) {
    //        sb.append(" if=0x").append(Integer.toHexString(this.inputFeatures));
    //    }
    //    if (this.userActivityTimeout >= 0) {
    //        sb.append(" userActivityTimeout=").append(this.userActivityTimeout);
    //    }
    //    sb.append('}');
    //    return sb.toString();
    //}
    //
    ///**
    //     * Scale the layout params' coordinates and size.
    //     * @hide
    //     */
    //scale(scale:number):void  {
    //    this.x = Math.floor((this.x * scale + 0.5));
    //    this.y = Math.floor((this.y * scale + 0.5));
    //    if (this.width > 0) {
    //        this.width = Math.floor((this.width * scale + 0.5));
    //    }
    //    if (this.height > 0) {
    //        this.height = Math.floor((this.height * scale + 0.5));
    //    }
    //}

    ///**
    //     * Backup the layout parameters used in compatibility mode.
    //     * @see LayoutParams#restore()
    //     */
    //backup():void  {
    //    let backup:number[] = this.mCompatibilityParamsBackup;
    //    if (backup == null) {
    //        // we backup 4 elements, x, y, width, height
    //        backup = this.mCompatibilityParamsBackup = androidui.util.ArrayCreator.newNumberArray(4);
    //    }
    //    backup[0] = this.x;
    //    backup[1] = this.y;
    //    backup[2] = this.width;
    //    backup[3] = this.height;
    //}
    //
    ///**
    //     * Restore the layout params' coordinates, size and gravity
    //     * @see LayoutParams#backup()
    //     */
    //restore():void  {
    //    let backup:number[] = this.mCompatibilityParamsBackup;
    //    if (backup != null) {
    //        this.x = backup[0];
    //        this.y = backup[1];
    //        this.width = backup[2];
    //        this.height = backup[3];
    //    }
    //}

    private mTitle:string = "";

    private isFocusable():boolean {
        return (this.flags & LayoutParams.FLAG_NOT_FOCUSABLE) == 0;
    }
    private isTouchable():boolean {
        return (this.flags & LayoutParams.FLAG_NOT_TOUCHABLE) == 0;
    }
    private isTouchModal():boolean {
        return (this.flags & LayoutParams.FLAG_NOT_TOUCH_MODAL) == 0;
    }
    private isFloating():boolean {
        return (this.flags & LayoutParams.FLAG_FLOATING) != 0;
    }
    private isSplitTouch():boolean {
        return (this.flags & LayoutParams.FLAG_SPLIT_TOUCH) != 0;
    }
    private isWatchTouchOutside():boolean {
        return (this.flags & LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH) != 0;
    }
}
}

}
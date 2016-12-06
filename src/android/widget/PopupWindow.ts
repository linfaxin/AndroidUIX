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

///<reference path="../../android/content/res/Resources.ts"/>
///<reference path="../../android/content/Context.ts"/>
///<reference path="../../android/graphics/PixelFormat.ts"/>
///<reference path="../../android/graphics/Rect.ts"/>
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/graphics/drawable/StateListDrawable.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/view/KeyEvent.ts"/>
///<reference path="../../android/view/MotionEvent.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/view/ViewTreeObserver.ts"/>
///<reference path="../../android/view/Window.ts"/>
///<reference path="../../android/view/WindowManager.ts"/>
///<reference path="../../android/view/animation/Animation.ts"/>
///<reference path="../../java/lang/ref/WeakReference.ts"/>
///<reference path="../../java/lang/Integer.ts"/>
///<reference path="../../android/widget/FrameLayout.ts"/>
///<reference path="../../android/widget/Spinner.ts"/>
///<reference path="../../android/widget/TextView.ts"/>
///<reference path="../../android/R/attr.ts"/>
///<reference path="../../android/R/anim.ts"/>

module android.widget {
import R = android.R;
import Resources = android.content.res.Resources;
import Context = android.content.Context;
import PixelFormat = android.graphics.PixelFormat;
import Rect = android.graphics.Rect;
import Drawable = android.graphics.drawable.Drawable;
import StateListDrawable = android.graphics.drawable.StateListDrawable;
import Gravity = android.view.Gravity;
import KeyEvent = android.view.KeyEvent;
import MotionEvent = android.view.MotionEvent;
import View = android.view.View;
import OnTouchListener = android.view.View.OnTouchListener;
import ViewGroup = android.view.ViewGroup;
import ViewTreeObserver = android.view.ViewTreeObserver;
import OnScrollChangedListener = android.view.ViewTreeObserver.OnScrollChangedListener;
import WindowManager = android.view.WindowManager;
import Window = android.view.Window;
import Animation = android.view.animation.Animation;
import WeakReference = java.lang.ref.WeakReference;
import Integer = java.lang.Integer;
import FrameLayout = android.widget.FrameLayout;
import Spinner = android.widget.Spinner;
import TextView = android.widget.TextView;
/**
 * <p>A popup window that can be used to display an arbitrary view. The popup
 * window is a floating container that appears on top of the current
 * activity.</p>
 * 
 * @see android.widget.AutoCompleteTextView
 * @see android.widget.Spinner
 */
export class PopupWindow implements Window.Callback{

    /**
     * Mode for {@link #setInputMethodMode(int)}: the requirements for the
     * input method should be based on the focusability of the popup.  That is
     * if it is focusable than it needs to work with the input method, else
     * it doesn't.
     */
    static INPUT_METHOD_FROM_FOCUSABLE:number = 0;

    /**
     * Mode for {@link #setInputMethodMode(int)}: this popup always needs to
     * work with an input method, regardless of whether it is focusable.  This
     * means that it will always be displayed so that the user can also operate
     * the input method while it is shown.
     */
    static INPUT_METHOD_NEEDED:number = 1;

    /**
     * Mode for {@link #setInputMethodMode(int)}: this popup never needs to
     * work with an input method, regardless of whether it is focusable.  This
     * means that it will always be displayed to use as much space on the
     * screen as needed, regardless of whether this covers the input method.
     */
    static INPUT_METHOD_NOT_NEEDED:number = 2;

    private static DEFAULT_ANCHORED_GRAVITY:number = Gravity.TOP | Gravity.START;

    private mContext:Context;

    private mWindowManager:WindowManager;

    private mIsShowing:boolean;

    private mIsDropdown:boolean;

    private mContentView:View;

    private mPopupView:View;
    private mPopupWindow:Window;

    private mFocusable:boolean;

    private mInputMethodMode:number = PopupWindow.INPUT_METHOD_FROM_FOCUSABLE;

    //private mSoftInputMode:number = WindowManager.LayoutParams.SOFT_INPUT_STATE_UNCHANGED;

    private mTouchable:boolean = true;

    private mOutsideTouchable:boolean = false;

    //private mClippingEnabled:boolean = true;

    private mSplitTouchEnabled:number = -1;

    //private mLayoutInScreen:boolean;

    private mClipToScreen:boolean;

    private mAllowScrollingAnchorParent:boolean = true;

    //private mLayoutInsetDecor:boolean = false;

    private mNotTouchModal:boolean;

    private mTouchInterceptor:OnTouchListener;

    private mWidthMode:number;

    private mWidth:number;

    private mLastWidth:number;

    private mHeightMode:number;

    private mHeight:number;

    private mLastHeight:number;

    private mPopupWidth:number;

    private mPopupHeight:number;

    private mDrawingLocation:number[] = [0, 0];

    private mScreenLocation:number[] = [0, 0];

    private mTempRect:Rect = new Rect();

    private mBackground:Drawable;

    private mAboveAnchorBackgroundDrawable:Drawable;

    private mBelowAnchorBackgroundDrawable:Drawable;

    private mAboveAnchor:boolean;

    private mWindowLayoutType:number = WindowManager.LayoutParams.TYPE_APPLICATION_PANEL;

    private mOnDismissListener:PopupWindow.OnDismissListener;

    //private mIgnoreCheekPress:boolean = false;

    private mDefaultDropdownAboveEnterAnimation = R.anim.grow_fade_in_from_bottom;
    private mDefaultDropdownBelowEnterAnimation = R.anim.grow_fade_in;
    private mDefaultDropdownAboveExitAnimation = R.anim.shrink_fade_out_from_bottom;
    private mDefaultDropdownBelowExitAnimation = R.anim.shrink_fade_out;
    private mEnterAnimation:Animation;
    private mExitAnimation:Animation;

    //private static ABOVE_ANCHOR_STATE_SET:number[] =  [ com.android.internal.R.attr.state_above_anchor ];

    private mAnchor:WeakReference<View>;

    private mOnScrollChangedListener:ViewTreeObserver.OnScrollChangedListener = (()=>{
        const _this=this;
        class _Inner implements ViewTreeObserver.OnScrollChangedListener {
            onScrollChanged():void  {
                let anchor:View = _this.mAnchor != null ? _this.mAnchor.get() : null;
                if (anchor != null && _this.mPopupView != null) {
                    let p:WindowManager.LayoutParams = <WindowManager.LayoutParams> _this.mPopupView.getLayoutParams();
                    _this.updateAboveAnchor(_this.findDropDownPosition(anchor, p, _this.mAnchorXoff, _this.mAnchorYoff, _this.mAnchoredGravity));
                    _this.update(p.x, p.y, -1, -1, true);
                }
            }
        }
        return new _Inner();
    })();

    private mAnchorXoff:number;
    private mAnchorYoff:number;
    private mAnchoredGravity:number;

    private mPopupViewInitialLayoutDirectionInherited:boolean;


    /**
     * <p>Create a new popup window which can display the <tt>contentView</tt>.
     * The dimension of the window must be passed to this constructor.</p>
     *
     * <p>The popup does not provide any background. This should be handled
     * by the content view.</p>
     *
     * @param contentView the popup's content
     * @param width the popup's width
     * @param height the popup's height
     * @param focusable true if the popup can be focused, false otherwise
     */
    constructor(contentView:View, width?:number, height?:number, focusable?:boolean);
    /**
     * <p>Create a new, empty, non focusable popup window of dimension (0,0).</p>
     * 
     * <p>The popup does not provide a background.</p>
     */
     constructor(context:Context, styleAttr?:Map<string, string>);
     constructor(...args) {
         if(args[0] instanceof Context) {
             let context = <Context>args[0];
             let styleAttr = args.length==1 ? R.attr.popupWindowStyle : args[1];

             this.mContext = context;
             this.mWindowManager = context.getWindowManager();//<WindowManager> context.getSystemService(Context.WINDOW_SERVICE);
             this.mPopupWindow = new Window(context);
             this.mPopupWindow.setCallback(this);
             let a = context.obtainStyledAttributes(null, styleAttr);
             this.mBackground = a.getDrawable('popupBackground');
             this.mEnterAnimation = styleAttr.popupEnterAnimation; // FIXME animation
             this.mExitAnimation = styleAttr.popupExitAnimation;

             // at least one other drawable, intended for the 'below-anchor state'.
             //if (this.mBackground instanceof StateListDrawable) {
             //    let background:StateListDrawable = <StateListDrawable> this.mBackground;
             //    // Find the above-anchor view - this one's easy, it should be labeled as such.
             //    let aboveAnchorStateIndex:number = background.getStateDrawableIndex(PopupWindow.ABOVE_ANCHOR_STATE_SET);
             //    // Now, for the below-anchor view, look for any other drawable specified in the
             //    // StateListDrawable which is not for the above-anchor state and use that.
             //    let count:number = background.getStateCount();
             //    let belowAnchorStateIndex:number = -1;
             //    for (let i:number = 0; i < count; i++) {
             //        if (i != aboveAnchorStateIndex) {
             //            belowAnchorStateIndex = i;
             //            break;
             //        }
             //    }
             //    // to null so that we'll just use refreshDrawableState.
             //    if (aboveAnchorStateIndex != -1 && belowAnchorStateIndex != -1) {
             //        this.mAboveAnchorBackgroundDrawable = background.getStateDrawable(aboveAnchorStateIndex);
             //        this.mBelowAnchorBackgroundDrawable = background.getStateDrawable(belowAnchorStateIndex);
             //    } else {
             //        this.mBelowAnchorBackgroundDrawable = null;
             //        this.mAboveAnchorBackgroundDrawable = null;
             //    }
             //}
             //a.recycle();
         }else{
             let [contentView=null, width=0, height=0, focusable=false] = args;

             if (contentView != null) {
                 this.mContext = contentView.getContext();
                 this.mWindowManager = this.mContext.getWindowManager();//<WindowManager> this.mContext.getSystemService(Context.WINDOW_SERVICE);
                 this.mPopupWindow = new Window(this.mContext);
                 this.mPopupWindow.setCallback(this);
             }
             this.setContentView(contentView);
             this.setWidth(width);
             this.setHeight(height);
             this.setFocusable(focusable);
         }
    }



    /**
     * <p>Return the drawable used as the popup window's background.</p>
     *
     * @return the background drawable or null
     */
    getBackground():Drawable  {
        return this.mBackground;
    }

    /**
     * <p>Change the background drawable for this popup window. The background
     * can be set to null.</p>
     *
     * @param background the popup's background
     */
    setBackgroundDrawable(background:Drawable):void  {
        this.mBackground = background;
    }

    /**
     * <p>Return the animation style to use the popup appears</p>
     */
    getEnterAnimation():Animation  {
        return this.mEnterAnimation;
    }
    /**
     * <p>Return the animation style to use the popup appears</p>
     */
    getExitAnimation():Animation  {
        return this.mExitAnimation;
    }

    ///**
    // * Set the flag on popup to ignore cheek press eventt; by default this flag
    // * is set to false
    // * which means the pop wont ignore cheek press dispatch events.
    // *
    // * <p>If the popup is showing, calling this method will take effect only
    // * the next time the popup is shown or through a manual call to one of
    // * the {@link #update()} methods.</p>
    // *
    // * @see #update()
    // */
    //setIgnoreCheekPress():void  {
    //    this.mIgnoreCheekPress = true;
    //}

    /**
     * <p>Change the animation style resource for this popup.</p>
     *
     * <p>If the popup is showing, calling this method will take effect only
     * the next time the popup is shown or through a manual call to one of
     * the {@link #update()} methods.</p>
     *
     * @param animationStyle animation style to use when the popup appears
     *      and disappears.  Set to -1 for the default animation, 0 for no
     *      animation, or a resource identifier for an explicit animation.
     *      
     * @see #update()
     */
    setWindowAnimation(enterAnimation:Animation, exitAnimation:Animation):void  {
        this.mEnterAnimation = enterAnimation;
        this.mExitAnimation = exitAnimation;
    }

    /**
     * <p>Return the view used as the content of the popup window.</p>
     *
     * @return a {@link android.view.View} representing the popup's content
     *
     * @see #setContentView(android.view.View)
     */
    getContentView():View  {
        return this.mContentView;
    }

    /**
     * <p>Change the popup's content. The content is represented by an instance
     * of {@link android.view.View}.</p>
     *
     * <p>This method has no effect if called when the popup is showing.</p>
     *
     * @param contentView the new content for the popup
     *
     * @see #getContentView()
     * @see #isShowing()
     */
    setContentView(contentView:View):void  {
        if (this.isShowing()) {
            return;
        }
        this.mContentView = contentView;
        if (this.mContext == null && this.mContentView != null) {
            this.mContext = this.mContentView.getContext();
        }
        if (this.mWindowManager == null && this.mContentView != null) {
            this.mWindowManager = this.mContext.getWindowManager();//<WindowManager> this.mContext.getSystemService(Context.WINDOW_SERVICE);
        }
        if(this.mPopupWindow==null && this.mContext!=null){
            this.mPopupWindow = new Window(this.mContext);
            this.mPopupWindow.setCallback(this);
        }
    }

    /**
     * Set a callback for all touch events being dispatched to the popup
     * window.
     */
    setTouchInterceptor(l:OnTouchListener):void  {
        this.mTouchInterceptor = l;
    }

    /**
     * <p>Indicate whether the popup window can grab the focus.</p>
     *
     * @return true if the popup is focusable, false otherwise
     *
     * @see #setFocusable(boolean)
     */
    isFocusable():boolean  {
        return this.mFocusable;
    }

    /**
     * <p>Changes the focusability of the popup window. When focusable, the
     * window will grab the focus from the current focused widget if the popup
     * contains a focusable {@link android.view.View}.  By default a popup
     * window is not focusable.</p>
     *
     * <p>If the popup is showing, calling this method will take effect only
     * the next time the popup is shown or through a manual call to one of
     * the {@link #update()} methods.</p>
     *
     * @param focusable true if the popup should grab focus, false otherwise.
     *
     * @see #isFocusable()
     * @see #isShowing() 
     * @see #update()
     */
    setFocusable(focusable:boolean):void  {
        this.mFocusable = focusable;
    }

    /**
     * Return the current value in {@link #setInputMethodMode(int)}.
     * 
     * @see #setInputMethodMode(int)
     */
    getInputMethodMode():number  {
        return this.mInputMethodMode;
    }

    /**
     * Control how the popup operates with an input method: one of
     * {@link #INPUT_METHOD_FROM_FOCUSABLE}, {@link #INPUT_METHOD_NEEDED},
     * or {@link #INPUT_METHOD_NOT_NEEDED}.
     * 
     * <p>If the popup is showing, calling this method will take effect only
     * the next time the popup is shown or through a manual call to one of
     * the {@link #update()} methods.</p>
     * 
     * @see #getInputMethodMode()
     * @see #update()
     */
    setInputMethodMode(mode:number):void  {
        this.mInputMethodMode = mode;
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
    //    this.mSoftInputMode = mode;
    //}
    //
    ///**
    // * Returns the current value in {@link #setSoftInputMode(int)}.
    // *
    // * @see #setSoftInputMode(int)
    // * @see android.view.WindowManager.LayoutParams#softInputMode
    // */
    //getSoftInputMode():number  {
    //    return this.mSoftInputMode;
    //}

    /**
     * <p>Indicates whether the popup window receives touch events.</p>
     * 
     * @return true if the popup is touchable, false otherwise
     * 
     * @see #setTouchable(boolean)
     */
    isTouchable():boolean  {
        return this.mTouchable;
    }

    /**
     * <p>Changes the touchability of the popup window. When touchable, the
     * window will receive touch events, otherwise touch events will go to the
     * window below it. By default the window is touchable.</p>
     *
     * <p>If the popup is showing, calling this method will take effect only
     * the next time the popup is shown or through a manual call to one of
     * the {@link #update()} methods.</p>
     *
     * @param touchable true if the popup should receive touch events, false otherwise
     *
     * @see #isTouchable()
     * @see #isShowing() 
     * @see #update()
     */
    setTouchable(touchable:boolean):void  {
        this.mTouchable = touchable;
    }

    /**
     * <p>Indicates whether the popup window will be informed of touch events
     * outside of its window.</p>
     *
     * @return true if the popup is outside touchable, false otherwise
     *
     * @see #setOutsideTouchable(boolean)
     */
    isOutsideTouchable():boolean  {
        return this.mOutsideTouchable;
    }

    /**
     * <p>Controls whether the pop-up will be informed of touch events outside
     * of its window.  This only makes sense for pop-ups that are touchable
     * but not focusable, which means touches outside of the window will
     * be delivered to the window behind.  The default is false.</p>
     *
     * <p>If the popup is showing, calling this method will take effect only
     * the next time the popup is shown or through a manual call to one of
     * the {@link #update()} methods.</p>
     *
     * @param touchable true if the popup should receive outside
     * touch events, false otherwise
     *
     * @see #isOutsideTouchable()
     * @see #isShowing()
     * @see #update()
     */
    setOutsideTouchable(touchable:boolean):void  {
        this.mOutsideTouchable = touchable;
    }

    ///**
    // * <p>Indicates whether clipping of the popup window is enabled.</p>
    // *
    // * @return true if the clipping is enabled, false otherwise
    // *
    // * @see #setClippingEnabled(boolean)
    // */
    //isClippingEnabled():boolean  {
    //    return this.mClippingEnabled;
    //}
    //
    ///**
    // * <p>Allows the popup window to extend beyond the bounds of the screen. By default the
    // * window is clipped to the screen boundaries. Setting this to false will allow windows to be
    // * accurately positioned.</p>
    // *
    // * <p>If the popup is showing, calling this method will take effect only
    // * the next time the popup is shown or through a manual call to one of
    // * the {@link #update()} methods.</p>
    // *
    // * @param enabled false if the window should be allowed to extend outside of the screen
    // * @see #isShowing()
    // * @see #isClippingEnabled()
    // * @see #update()
    // */
    //setClippingEnabled(enabled:boolean):void  {
    //    this.mClippingEnabled = enabled;
    //}

    /**
     * Clip this popup window to the screen, but not to the containing window.
     *
     * @param enabled True to clip to the screen.
     * @hide
     */
    setClipToScreenEnabled(enabled:boolean):void  {
        this.mClipToScreen = enabled;
        //this.setClippingEnabled(!enabled);
    }

    /**
     * Allow PopupWindow to scroll the anchor's parent to provide more room
     * for the popup. Enabled by default.
     *
     * @param enabled True to scroll the anchor's parent when more room is desired by the popup.
     */
    private setAllowScrollingAnchorParent(enabled:boolean):void  {
        this.mAllowScrollingAnchorParent = enabled;
    }

    /**
     * <p>Indicates whether the popup window supports splitting touches.</p>
     * 
     * @return true if the touch splitting is enabled, false otherwise
     * 
     * @see #setSplitTouchEnabled(boolean)
     */
    isSplitTouchEnabled():boolean  {
        if (this.mSplitTouchEnabled < 0 && this.mContext != null) {
            return true;//this.mContext.getApplicationInfo().targetSdkVersion >= Build.VERSION_CODES.HONEYCOMB;
        }
        return this.mSplitTouchEnabled == 1;
    }

    /**
     * <p>Allows the popup window to split touches across other windows that also
     * support split touch.  When this flag is false, the first pointer
     * that goes down determines the window to which all subsequent touches
     * go until all pointers go up.  When this flag is true, each pointer
     * (not necessarily the first) that goes down determines the window
     * to which all subsequent touches of that pointer will go until that
     * pointer goes up thereby enabling touches with multiple pointers
     * to be split across multiple windows.</p>
     *
     * @param enabled true if the split touches should be enabled, false otherwise
     * @see #isSplitTouchEnabled()
     */
    setSplitTouchEnabled(enabled:boolean):void  {
        this.mSplitTouchEnabled = enabled ? 1 : 0;
    }

    ///**
    // * <p>Indicates whether the popup window will be forced into using absolute screen coordinates
    // * for positioning.</p>
    // *
    // * @return true if the window will always be positioned in screen coordinates.
    // * @hide
    // */
    //isLayoutInScreenEnabled():boolean  {
    //    return this.mLayoutInScreen;
    //}
    //
    ///**
    // * <p>Allows the popup window to force the flag
    // * {@link WindowManager.LayoutParams#FLAG_LAYOUT_IN_SCREEN}, overriding default behavior.
    // * This will cause the popup to be positioned in absolute screen coordinates.</p>
    // *
    // * @param enabled true if the popup should always be positioned in screen coordinates
    // * @hide
    // */
    //setLayoutInScreenEnabled(enabled:boolean):void  {
    //    this.mLayoutInScreen = enabled;
    //}

    ///**
    // * Allows the popup window to force the flag
    // * {@link WindowManager.LayoutParams#FLAG_LAYOUT_INSET_DECOR}, overriding default behavior.
    // * This will cause the popup to inset its content to account for system windows overlaying
    // * the screen, such as the status bar.
    // *
    // * <p>This will often be combined with {@link #setLayoutInScreenEnabled(boolean)}.
    // *
    // * @param enabled true if the popup's views should inset content to account for system windows,
    // *                the way that decor views behave for full-screen windows.
    // * @hide
    // */
    //setLayoutInsetDecor(enabled:boolean):void  {
    //    this.mLayoutInsetDecor = enabled;
    //}

    /**
     * Set the layout type for this window. Should be one of the TYPE constants defined in
     * {@link WindowManager.LayoutParams}.
     *
     * @param layoutType Layout type for this window.
     * @hide
     */
    setWindowLayoutType(layoutType:number):void  {
        this.mWindowLayoutType = layoutType;
    }

    /**
     * @return The layout type for this window.
     * @hide
     */
    getWindowLayoutType():number  {
        return this.mWindowLayoutType;
    }

    /**
     * Set whether this window is touch modal or if outside touches will be sent to
     * other windows behind it.
     * @hide
     */
    setTouchModal(touchModal:boolean):void  {
        this.mNotTouchModal = !touchModal;
    }

    /**
     * <p>Change the width and height measure specs that are given to the
     * window manager by the popup.  By default these are 0, meaning that
     * the current width or height is requested as an explicit size from
     * the window manager.  You can supply
     * {@link ViewGroup.LayoutParams#WRAP_CONTENT} or 
     * {@link ViewGroup.LayoutParams#MATCH_PARENT} to have that measure
     * spec supplied instead, replacing the absolute width and height that
     * has been set in the popup.</p>
     *
     * <p>If the popup is showing, calling this method will take effect only
     * the next time the popup is shown.</p>
     *
     * @param widthSpec an explicit width measure spec mode, either
     * {@link ViewGroup.LayoutParams#WRAP_CONTENT},
     * {@link ViewGroup.LayoutParams#MATCH_PARENT}, or 0 to use the absolute
     * width.
     * @param heightSpec an explicit height measure spec mode, either
     * {@link ViewGroup.LayoutParams#WRAP_CONTENT},
     * {@link ViewGroup.LayoutParams#MATCH_PARENT}, or 0 to use the absolute
     * height.
     */
    setWindowLayoutMode(widthSpec:number, heightSpec:number):void  {
        this.mWidthMode = widthSpec;
        this.mHeightMode = heightSpec;
    }

    /**
     * <p>Return this popup's height MeasureSpec</p>
     *
     * @return the height MeasureSpec of the popup
     *
     * @see #setHeight(int)
     */
    getHeight():number  {
        return this.mHeight;
    }

    /**
     * <p>Change the popup's height MeasureSpec</p>
     *
     * <p>If the popup is showing, calling this method will take effect only
     * the next time the popup is shown.</p>
     *
     * @param height the height MeasureSpec of the popup
     *
     * @see #getHeight()
     * @see #isShowing() 
     */
    setHeight(height:number):void  {
        this.mHeight = height;
    }

    /**
     * <p>Return this popup's width MeasureSpec</p>
     *
     * @return the width MeasureSpec of the popup
     *
     * @see #setWidth(int) 
     */
    getWidth():number  {
        return this.mWidth;
    }

    /**
     * <p>Change the popup's width MeasureSpec</p>
     *
     * <p>If the popup is showing, calling this method will take effect only
     * the next time the popup is shown.</p>
     *
     * @param width the width MeasureSpec of the popup
     *
     * @see #getWidth()
     * @see #isShowing()
     */
    setWidth(width:number):void  {
        this.mWidth = width;
    }

    /**
     * <p>Indicate whether this popup window is showing on screen.</p>
     *
     * @return true if the popup is showing, false otherwise
     */
    isShowing():boolean  {
        return this.mIsShowing;
    }

    /**
     * <p>
     * Display the content view in a popup window at the specified location. If the popup window
     * cannot fit on screen, it will be clipped. See {@link android.view.WindowManager.LayoutParams}
     * for more information on how gravity and the x and y parameters are related. Specifying
     * a gravity of {@link android.view.Gravity#NO_GRAVITY} is similar to specifying
     * <code>Gravity.LEFT | Gravity.TOP</code>.
     * </p>
     * 
     * @param parent a parent view to get the {@link android.view.View#getWindowToken()} token from
     * @param gravity the gravity which controls the placement of the popup window
     * @param x the popup's x location offset
     * @param y the popup's y location offset
     */
    showAtLocation(parent:View, gravity:number, x:number, y:number):void  {
        if (this.isShowing() || this.mContentView == null) {
            return;
        }
        this.unregisterForScrollChanged();
        this.mIsShowing = true;
        this.mIsDropdown = false;
        let p:WindowManager.LayoutParams = this.createPopupLayout();
        p.enterAnimation = this.computeWindowEnterAnimation();
        p.exitAnimation = this.computeWindowExitAnimation();
        this.preparePopup(p);
        if (gravity == Gravity.NO_GRAVITY) {
            gravity = Gravity.TOP | Gravity.START;
        }
        p.gravity = gravity;
        p.x = x;
        p.y = y;
        if (this.mHeightMode < 0)
            p.height = this.mLastHeight = this.mHeightMode;
        if (this.mWidthMode < 0)
            p.width = this.mLastWidth = this.mWidthMode;
        this.invokePopup(p);
    }

    /**
     * <p>Display the content view in a popup window anchored to the bottom-left
     * corner of the anchor view offset by the specified x and y coordinates.
     * If there is not enough room on screen to show
     * the popup in its entirety, this method tries to find a parent scroll
     * view to scroll. If no parent scroll view can be scrolled, the bottom-left
     * corner of the popup is pinned at the top left corner of the anchor view.</p>
     * <p>If the view later scrolls to move <code>anchor</code> to a different
     * location, the popup will be moved correspondingly.</p>
     *
     * @param anchor the view on which to pin the popup window
     * @param xoff A horizontal offset from the anchor in pixels
     * @param yoff A vertical offset from the anchor in pixels
     * @param gravity Alignment of the popup relative to the anchor
     *
     * @see #dismiss()
     */
    showAsDropDown(anchor:View, xoff=0, yoff=0, gravity=PopupWindow.DEFAULT_ANCHORED_GRAVITY):void  {
        if (this.isShowing() || this.mContentView == null) {
            return;
        }
        this.registerForScrollChanged(anchor, xoff, yoff, gravity);
        this.mIsShowing = true;
        this.mIsDropdown = true;
        let p:WindowManager.LayoutParams = this.createPopupLayout();
        this.preparePopup(p);
        this.updateAboveAnchor(this.findDropDownPosition(anchor, p, xoff, yoff, gravity));
        if (this.mHeightMode < 0)
            p.height = this.mLastHeight = this.mHeightMode;
        if (this.mWidthMode < 0)
            p.width = this.mLastWidth = this.mWidthMode;
        p.enterAnimation = this.computeWindowEnterAnimation();
        p.exitAnimation = this.computeWindowExitAnimation();
        this.invokePopup(p);
    }

    private updateAboveAnchor(aboveAnchor:boolean):void  {
        if (aboveAnchor != this.mAboveAnchor) {
            this.mAboveAnchor = aboveAnchor;
            if (this.mBackground != null) {
                // do the job.
                if (this.mAboveAnchorBackgroundDrawable != null) {
                    if (this.mAboveAnchor) {
                        this.mPopupView.setBackgroundDrawable(this.mAboveAnchorBackgroundDrawable);
                    } else {
                        this.mPopupView.setBackgroundDrawable(this.mBelowAnchorBackgroundDrawable);
                    }
                } else {
                    this.mPopupView.refreshDrawableState();
                }
            }
        }
    }

    /**
     * Indicates whether the popup is showing above (the y coordinate of the popup's bottom
     * is less than the y coordinate of the anchor) or below the anchor view (the y coordinate
     * of the popup is greater than y coordinate of the anchor's bottom).
     *
     * The value returned
     * by this method is meaningful only after {@link #showAsDropDown(android.view.View)}
     * or {@link #showAsDropDown(android.view.View, int, int)} was invoked.
     *
     * @return True if this popup is showing above the anchor view, false otherwise.
     */
    isAboveAnchor():boolean  {
        return this.mAboveAnchor;
    }

    /**
     * <p>Prepare the popup by embedding in into a new ViewGroup if the
     * background drawable is not null. If embedding is required, the layout
     * parameters' height is mnodified to take into account the background's
     * padding.</p>
     *
     * @param p the layout parameters of the popup's content view
     */
    private preparePopup(p:WindowManager.LayoutParams):void  {
        if (this.mContentView == null || this.mContext == null || this.mWindowManager == null) {
            throw Error(`new IllegalStateException("You must specify a valid content view by " + "calling setContentView() before attempting to show the popup.")`);
        }
        //if (this.mBackground != null) {
        //    const layoutParams:ViewGroup.LayoutParams = this.mContentView.getLayoutParams();
        //    let height:number = ViewGroup.LayoutParams.MATCH_PARENT;
        //    if (layoutParams != null && layoutParams.height == ViewGroup.LayoutParams.WRAP_CONTENT) {
        //        height = ViewGroup.LayoutParams.WRAP_CONTENT;
        //    }
        //    // when a background is available, we embed the content view
        //    // within another view that owns the background drawable
        //    let popupViewContainer:PopupWindow.PopupViewContainer = new PopupWindow.PopupViewContainer(this.mContext, this);
        //    let listParams = new PopupWindow.PopupViewContainer.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, height);
        //    popupViewContainer.setBackgroundDrawable(this.mBackground);
        //    popupViewContainer.addView(this.mContentView, listParams);
        //    this.mPopupView = popupViewContainer;
        //} else {
        //    this.mPopupView = this.mContentView;
        //}
        this.mPopupWindow.setContentView(this.mContentView);
        this.mPopupWindow.setFloating(true);
        this.mPopupWindow.setBackgroundColor(android.graphics.Color.TRANSPARENT);
        this.mPopupWindow.setDimAmount(0);
        this.mPopupView = this.mPopupWindow.getDecorView();
        if (this.mBackground != null) {
            this.mPopupView.setBackground(this.mBackground)
        }

        this.mPopupViewInitialLayoutDirectionInherited = false;//(this.mPopupView.getRawLayoutDirection() == View.LAYOUT_DIRECTION_INHERIT);
        this.mPopupWidth = p.width;
        this.mPopupHeight = p.height;
    }

    /**
     * <p>Invoke the popup window by adding the content view to the window
     * manager.</p>
     *
     * <p>The content view must be non-null when this method is invoked.</p>
     *
     * @param p the layout parameters of the popup's content view
     */
    private invokePopup(p:WindowManager.LayoutParams):void  {
        //if (this.mContext != null) {
        //    p.packageName = this.mContext.getPackageName();
        //}
        //this.mPopupView.setFitsSystemWindows(this.mLayoutInsetDecor);
        this.setLayoutDirectionFromAnchor();
        this.mWindowManager.addWindow(this.mPopupWindow);
    }

    private setLayoutDirectionFromAnchor():void  {
        if (this.mAnchor != null) {
            let anchor:View = this.mAnchor.get();
            if (anchor != null && this.mPopupViewInitialLayoutDirectionInherited) {
                this.mPopupView.setLayoutDirection(anchor.getLayoutDirection());
            }
        }
    }

    /**
     * <p>Generate the layout parameters for the popup window.</p>
     *
     * @param token the window token used to bind the popup's window
     *
     * @return the layout parameters to pass to the window manager
     */
    private createPopupLayout():WindowManager.LayoutParams  {
        // generates the layout parameters for the drop down
        // we want a fixed size view located at the bottom left of the anchor
        let p:WindowManager.LayoutParams = this.mPopupWindow.getAttributes();
        // these gravity settings put the view at the top left corner of the
        // screen. The view is then positioned to the appropriate location
        // by setting the x and y offsets to match the anchor's bottom
        // left corner
        p.gravity = Gravity.START | Gravity.TOP;
        p.width = this.mLastWidth = this.mWidth;
        p.height = this.mLastHeight = this.mHeight;
        //if (this.mBackground != null) {
        //    p.format = this.mBackground.getOpacity();
        //} else {
        //    p.format = PixelFormat.TRANSLUCENT;
        //}
        p.flags = this.computeFlags(p.flags);
        p.type = this.mWindowLayoutType;
        //p.token = token;
        //p.softInputMode = this.mSoftInputMode;
        p.setTitle("PopupWindow");
        return p;
    }

    private computeFlags(curFlags:number):number  {
        curFlags &= ~(
            //WindowManager.LayoutParams.FLAG_IGNORE_CHEEK_PRESSES |
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
            WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE |
            //WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH |
            //WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS |
            //WindowManager.LayoutParams.FLAG_ALT_FOCUSABLE_IM |
            WindowManager.LayoutParams.FLAG_SPLIT_TOUCH);
        //if (this.mIgnoreCheekPress) {
        //    curFlags |= WindowManager.LayoutParams.FLAG_IGNORE_CHEEK_PRESSES;
        //}
        if (!this.mFocusable) {
            curFlags |= WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;
            //if (this.mInputMethodMode == PopupWindow.INPUT_METHOD_NEEDED) {
            //    curFlags |= WindowManager.LayoutParams.FLAG_ALT_FOCUSABLE_IM;
            //}
        }
        //else if (this.mInputMethodMode == PopupWindow.INPUT_METHOD_NOT_NEEDED) {
        //    curFlags |= WindowManager.LayoutParams.FLAG_ALT_FOCUSABLE_IM;
        //}
        if (!this.mTouchable) {
            curFlags |= WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE;
        }
        if (this.mOutsideTouchable) {
            curFlags |= WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH;
        }
        //if (!this.mClippingEnabled) {
        //    curFlags |= WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS;
        //}
        if (this.isSplitTouchEnabled()) {
            curFlags |= WindowManager.LayoutParams.FLAG_SPLIT_TOUCH;
        }
        //if (this.mLayoutInScreen) {
        //    curFlags |= WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN;
        //}
        //if (this.mLayoutInsetDecor) {
        //    curFlags |= WindowManager.LayoutParams.FLAG_LAYOUT_INSET_DECOR;
        //}
        if (this.mNotTouchModal) {
            curFlags |= WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL;
        }
        return curFlags;
    }

    private computeWindowEnterAnimation():Animation  {
        if (this.mEnterAnimation == null) {
            if (this.mIsDropdown) {
                return this.mAboveAnchor ? this.mDefaultDropdownAboveEnterAnimation : this.mDefaultDropdownBelowEnterAnimation;
            }
            return null;
        }
        return this.mEnterAnimation;
    }

    private computeWindowExitAnimation():Animation  {
        if (this.mExitAnimation == null) {
            if (this.mIsDropdown) {
                return this.mAboveAnchor ? this.mDefaultDropdownAboveExitAnimation : this.mDefaultDropdownBelowExitAnimation;
            }
            return null;
        }
        return this.mExitAnimation;
    }

    /**
     * <p>Positions the popup window on screen. When the popup window is too
     * tall to fit under the anchor, a parent scroll view is seeked and scrolled
     * up to reclaim space. If scrolling is not possible or not enough, the
     * popup window gets moved on top of the anchor.</p>
     *
     * <p>The height must have been set on the layout parameters prior to
     * calling this method.</p>
     *
     * @param anchor the view on which the popup window must be anchored
     * @param p the layout parameters used to display the drop down
     *
     * @return true if the popup is translated upwards to fit on screen
     */
    private findDropDownPosition(anchor:View, p:WindowManager.LayoutParams, xoff:number, yoff:number, gravity:number):boolean  {
        const anchorHeight:number = anchor.getHeight();
        anchor.getLocationInWindow(this.mDrawingLocation);
        p.x = this.mDrawingLocation[0] + xoff;
        p.y = this.mDrawingLocation[1] + anchorHeight + yoff;
        const hgrav:number = Gravity.getAbsoluteGravity(gravity, anchor.getLayoutDirection()) & Gravity.HORIZONTAL_GRAVITY_MASK;
        if (hgrav == Gravity.RIGHT) {
            // Flip the location to align the right sides of the popup and anchor instead of left
            p.x -= this.mPopupWidth - anchor.getWidth();
        }
        let onTop:boolean = false;
        p.gravity = Gravity.LEFT | Gravity.TOP;
        anchor.getLocationOnScreen(this.mScreenLocation);
        const displayFrame:Rect = new Rect();
        anchor.getWindowVisibleDisplayFrame(displayFrame);
        let screenY:number = this.mScreenLocation[1] + anchorHeight + yoff;
        const root:View = anchor.getRootView();
        if (screenY + this.mPopupHeight > displayFrame.bottom || p.x + this.mPopupWidth - root.getWidth() > 0) {
            // the edit box
            if (this.mAllowScrollingAnchorParent) {
                let scrollX:number = anchor.getScrollX();
                let scrollY:number = anchor.getScrollY();
                let r:Rect = new Rect(scrollX, scrollY, scrollX + this.mPopupWidth + xoff, scrollY + this.mPopupHeight + anchor.getHeight() + yoff);
                anchor.requestRectangleOnScreen(r, true);
            }
            // now we re-evaluate the space available, and decide from that
            // whether the pop-up will go above or below the anchor.
            anchor.getLocationInWindow(this.mDrawingLocation);
            p.x = this.mDrawingLocation[0] + xoff;
            p.y = this.mDrawingLocation[1] + anchor.getHeight() + yoff;
            // Preserve the gravity adjustment
            if (hgrav == Gravity.RIGHT) {
                p.x -= this.mPopupWidth - anchor.getWidth();
            }
            // determine whether there is more space above or below the anchor
            anchor.getLocationOnScreen(this.mScreenLocation);
            onTop = (displayFrame.bottom - this.mScreenLocation[1] - anchor.getHeight() - yoff) < (this.mScreenLocation[1] - yoff - displayFrame.top);
            if (onTop) {
                p.gravity = Gravity.LEFT | Gravity.BOTTOM;
                p.y = root.getHeight() - this.mDrawingLocation[1] + yoff;
            } else {
                p.y = this.mDrawingLocation[1] + anchor.getHeight() + yoff;
            }
        }
        if (this.mClipToScreen) {
            const displayFrameWidth:number = displayFrame.right - displayFrame.left;
            let right:number = p.x + p.width;
            if (right > displayFrameWidth) {
                p.x -= right - displayFrameWidth;
            }
            if (p.x < displayFrame.left) {
                p.x = displayFrame.left;
                p.width = Math.min(p.width, displayFrameWidth);
            }
            if (onTop) {
                let popupTop:number = this.mScreenLocation[1] + yoff - this.mPopupHeight;
                if (popupTop < 0) {
                    p.y += popupTop;
                }
            } else {
                p.y = Math.max(p.y, displayFrame.top);
            }
        }
        p.gravity |= Gravity.DISPLAY_CLIP_VERTICAL;
        return onTop;
    }

    /**
     * Returns the maximum height that is available for the popup to be
     * completely shown, optionally ignoring any bottom decorations such as
     * the input method. It is recommended that this height be the maximum for
     * the popup's height, otherwise it is possible that the popup will be
     * clipped.
     * 
     * @param anchor The view on which the popup window must be anchored.
     * @param yOffset y offset from the view's bottom edge
     * @param ignoreBottomDecorations if true, the height returned will be
     *        all the way to the bottom of the display, ignoring any
     *        bottom decorations
     * @return The maximum available height for the popup to be completely
     *         shown.
     *         
     * @hide Pending API council approval.
     */
    getMaxAvailableHeight(anchor:View, yOffset=0, ignoreBottomDecorations=false):number {
        const displayFrame:Rect = new Rect();
        anchor.getWindowVisibleDisplayFrame(displayFrame);
        const anchorPos:number[] = this.mDrawingLocation;
        anchor.getLocationOnScreen(anchorPos);
        let bottomEdge:number = displayFrame.bottom;
        if (ignoreBottomDecorations) {
            let res:Resources = anchor.getContext().getResources();
            bottomEdge = res.getDisplayMetrics().heightPixels;
        }
        const distanceToBottom:number = bottomEdge - (anchorPos[1] + anchor.getHeight()) - yOffset;
        const distanceToTop:number = anchorPos[1] - displayFrame.top + yOffset;
        // anchorPos[1] is distance from anchor to top of screen
        let returnedHeight:number = Math.max(distanceToBottom, distanceToTop);
        if (this.mBackground != null) {
            this.mBackground.getPadding(this.mTempRect);
            returnedHeight -= this.mTempRect.top + this.mTempRect.bottom;
        }
        return returnedHeight;
    }

    /**
     * <p>Dispose of the popup window. This method can be invoked only after
     * {@link #showAsDropDown(android.view.View)} has been executed. Failing that, calling
     * this method will have no effect.</p>
     *
     * @see #showAsDropDown(android.view.View) 
     */
    dismiss():void  {
        if (this.isShowing() && this.mPopupView != null) {
            this.mIsShowing = false;
            this.unregisterForScrollChanged();
            try {
                this.mWindowManager.removeWindow(this.mPopupWindow);
            } finally {
                if (this.mPopupView != this.mContentView && this.mPopupView instanceof ViewGroup) {
                    (<ViewGroup> this.mPopupView).removeView(this.mContentView);
                }
                this.mPopupView = null;
                if (this.mOnDismissListener != null) {
                    this.mOnDismissListener.onDismiss();
                }
            }
        }
    }

    /**
     * Sets the listener to be called when the window is dismissed.
     * 
     * @param onDismissListener The listener.
     */
    setOnDismissListener(onDismissListener:PopupWindow.OnDismissListener):void  {
        this.mOnDismissListener = onDismissListener;
    }

    /**
     * Updates the state of the popup window, if it is currently being displayed,
     * from the currently set state.  This include:
     * {@link #setClippingEnabled(boolean)}, {@link #setFocusable(boolean)},
     * {@link #setIgnoreCheekPress()}, {@link #setInputMethodMode(int)},
     * {@link #setTouchable(boolean)}, and {@link #setAnimationStyle(int)}.
     */
    update():void;
    /**
     * <p>Updates the dimension of the popup window. Calling this function
     * also updates the window with the current popup state as described
     * for {@link #update()}.</p>
     *
     * @param width the new width
     * @param height the new height
     */
    update(width:number, height:number):void;
    /**
     * <p>Updates the position and the dimension of the popup window. Calling this
     * function also updates the window with the current popup state as described
     * for {@link #update()}.</p>
     *
     * @param anchor the popup's anchor view
     * @param width the new width, can be -1 to ignore
     * @param height the new height, can be -1 to ignore
     */
    update(anchor:View, width:number, height:number):void;
    /**
     * <p>Updates the position and the dimension of the popup window. Width and
     * height can be set to -1 to update location only.  Calling this function
     * also updates the window with the current popup state as
     * described for {@link #update()}.</p>
     *
     * @param x the new x location
     * @param y the new y location
     * @param width the new width, can be -1 to ignore
     * @param height the new height, can be -1 to ignore
     * @param force reposition the window even if the specified position
     *              already seems to correspond to the LayoutParams
     */
    update(x:number, y:number, width:number, height:number, force?:boolean):void;

    /**
     * <p>Updates the position and the dimension of the popup window. Width and
     * height can be set to -1 to update location only.  Calling this function
     * also updates the window with the current popup state as
     * described for {@link #update()}.</p>
     *
     * <p>If the view later scrolls to move <code>anchor</code> to a different
     * location, the popup will be moved correspondingly.</p>
     *
     * @param anchor the popup's anchor view
     * @param xoff x offset from the view's left edge
     * @param yoff y offset from the view's bottom edge
     * @param width the new width, can be -1 to ignore
     * @param height the new height, can be -1 to ignore
     */
    update(anchor:View, xoff:number, yoff:number, width:number, height:number):void;
    update(...args):void{
        if(args.length==0){
            this._update();

        }else if(args.length==2){
            this._update_w_h(args[0], args[1]);

        }else if(args.length==3){
            this._update_a_w_h(args[0], args[1], args[2]);

        }else if(args.length == 4){
            this._update_x_y_w_h_f(args[0], args[1], args[2], args[3]);

        }else if(args.length == 5){
            if(args[0] instanceof View) this._update_a_x_y_w_h(args[0], args[1], args[2], args[3], args[4]);
            else this._update_x_y_w_h_f(args[0], args[1], args[2], args[3], args[4]);
        }
    }

    private _update():void  {
        if (!this.isShowing() || this.mContentView == null) {
            return;
        }
        let p:WindowManager.LayoutParams = <WindowManager.LayoutParams> this.mPopupView.getLayoutParams();
        let update:boolean = false;
        const enterAnim = this.computeWindowEnterAnimation();
        const exitAnim = this.computeWindowExitAnimation();
        if (enterAnim != p.enterAnimation) {
            p.enterAnimation = enterAnim;
            update = true;
        }
        if (exitAnim != p.exitAnimation) {
            p.exitAnimation = exitAnim;
            update = true;
        }
        const newFlags:number = this.computeFlags(p.flags);
        if (newFlags != p.flags) {
            p.flags = newFlags;
            update = true;
        }
        if (update) {
            this.setLayoutDirectionFromAnchor();
            this.mWindowManager.updateWindowLayout(this.mPopupWindow, p);
        }
    }

    private _update_w_h(width:number, height:number):void  {
        let p:WindowManager.LayoutParams = <WindowManager.LayoutParams> this.mPopupView.getLayoutParams();
        this.update(p.x, p.y, width, height, false);
    }

    private _update_x_y_w_h_f(x:number, y:number, width:number, height:number, force=false):void {
        if (width != -1) {
            this.mLastWidth = width;
            this.setWidth(width);
        }
        if (height != -1) {
            this.mLastHeight = height;
            this.setHeight(height);
        }
        if (!this.isShowing() || this.mContentView == null) {
            return;
        }
        let p:WindowManager.LayoutParams = <WindowManager.LayoutParams> this.mPopupView.getLayoutParams();
        let update:boolean = force;
        const finalWidth:number = this.mWidthMode < 0 ? this.mWidthMode : this.mLastWidth;
        if (width != -1 && p.width != finalWidth) {
            p.width = this.mLastWidth = finalWidth;
            update = true;
        }
        const finalHeight:number = this.mHeightMode < 0 ? this.mHeightMode : this.mLastHeight;
        if (height != -1 && p.height != finalHeight) {
            p.height = this.mLastHeight = finalHeight;
            update = true;
        }
        if (p.x != x) {
            p.x = x;
            update = true;
        }
        if (p.y != y) {
            p.y = y;
            update = true;
        }
        const enterAnim = this.computeWindowEnterAnimation();
        const exitAnim = this.computeWindowExitAnimation();
        if (enterAnim != p.enterAnimation) {
            p.enterAnimation = enterAnim;
            update = true;
        }
        if (exitAnim != p.exitAnimation) {
            p.exitAnimation = exitAnim;
            update = true;
        }
        const newFlags:number = this.computeFlags(p.flags);
        if (newFlags != p.flags) {
            p.flags = newFlags;
            update = true;
        }
        if (update) {
            this.setLayoutDirectionFromAnchor();
            this.mWindowManager.updateWindowLayout(this.mPopupWindow, p);
        }
    }

    private _update_a_w_h(anchor:View, width:number, height:number):void  {
        this._update_all_args(anchor, false, 0, 0, true, width, height, this.mAnchoredGravity);
    }

    private _update_a_x_y_w_h(anchor:View, xoff:number, yoff:number, width:number, height:number):void  {
        this._update_all_args(anchor, true, xoff, yoff, true, width, height, this.mAnchoredGravity);
    }

    private _update_all_args(anchor:View, updateLocation:boolean, xoff:number, yoff:number, updateDimension:boolean, width:number, height:number, gravity:number):void  {
        if (!this.isShowing() || this.mContentView == null) {
            return;
        }
        let oldAnchor:WeakReference<View> = this.mAnchor;
        const needsUpdate:boolean = updateLocation && (this.mAnchorXoff != xoff || this.mAnchorYoff != yoff);
        if (oldAnchor == null || oldAnchor.get() != anchor || (needsUpdate && !this.mIsDropdown)) {
            this.registerForScrollChanged(anchor, xoff, yoff, gravity);
        } else if (needsUpdate) {
            // No need to register again if this is a DropDown, showAsDropDown already did.
            this.mAnchorXoff = xoff;
            this.mAnchorYoff = yoff;
            this.mAnchoredGravity = gravity;
        }
        let p:WindowManager.LayoutParams = <WindowManager.LayoutParams> this.mPopupView.getLayoutParams();
        if (updateDimension) {
            if (width == -1) {
                width = this.mPopupWidth;
            } else {
                this.mPopupWidth = width;
            }
            if (height == -1) {
                height = this.mPopupHeight;
            } else {
                this.mPopupHeight = height;
            }
        }
        let x:number = p.x;
        let y:number = p.y;
        if (updateLocation) {
            this.updateAboveAnchor(this.findDropDownPosition(anchor, p, xoff, yoff, gravity));
        } else {
            this.updateAboveAnchor(this.findDropDownPosition(anchor, p, this.mAnchorXoff, this.mAnchorYoff, this.mAnchoredGravity));
        }
        this.update(p.x, p.y, width, height, x != p.x || y != p.y);
    }



    private unregisterForScrollChanged():void  {
        let anchorRef:WeakReference<View> = this.mAnchor;
        let anchor:View = null;
        if (anchorRef != null) {
            anchor = anchorRef.get();
        }
        if (anchor != null) {
            let vto:ViewTreeObserver = anchor.getViewTreeObserver();
            vto.removeOnScrollChangedListener(this.mOnScrollChangedListener);
        }
        this.mAnchor = null;
    }

    private registerForScrollChanged(anchor:View, xoff:number, yoff:number, gravity:number):void  {
        this.unregisterForScrollChanged();
        this.mAnchor = new WeakReference<View>(anchor);
        let vto:ViewTreeObserver = anchor.getViewTreeObserver();
        if (vto != null) {
            vto.addOnScrollChangedListener(this.mOnScrollChangedListener);
        }
        this.mAnchorXoff = xoff;
        this.mAnchorYoff = yoff;
        this.mAnchoredGravity = gravity;
    }

    //androidui add:
    onTouchEvent(event:MotionEvent):boolean {
        //if (this.mPopupWindow.shouldCloseOnTouch(this.mContext, event)) {
        //    this.dismiss();
        //    return true;
        //}
        const x:number = Math.floor(event.getX());
        const y:number = Math.floor(event.getY());
        if ((event.getAction() == MotionEvent.ACTION_DOWN) && ((x < 0) || (x >= this.mPopupView.getWidth()) || (y < 0) || (y >= this.mPopupView.getHeight()))) {
            this.dismiss();
            return true;
        } else if (event.getAction() == MotionEvent.ACTION_OUTSIDE) {
            this.dismiss();
            return true;

        } else if(this.mPopupView){
            return this.mPopupView.onTouchEvent(event);
        }
        return false;
    }
    onGenericMotionEvent(event:MotionEvent):boolean {
        return false;
    }
    onWindowAttributesChanged(params:WindowManager.LayoutParams):void {
        if (this.mPopupWindow != null) {
            this.mWindowManager.updateWindowLayout(this.mPopupWindow, params);
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
    dispatchKeyEvent(event:KeyEvent):boolean {
        if (event.getKeyCode() == KeyEvent.KEYCODE_BACK) {
            if (this.mPopupView.getKeyDispatcherState() == null) {
                return this.mPopupWindow.superDispatchKeyEvent(event);
            }
            if (event.getAction() == KeyEvent.ACTION_DOWN && event.getRepeatCount() == 0) {
                let state:KeyEvent.DispatcherState = this.mPopupView.getKeyDispatcherState();
                if (state != null) {
                    state.startTracking(event, this);
                }
                return true;
            } else if (event.getAction() == KeyEvent.ACTION_UP) {
                let state:KeyEvent.DispatcherState = this.mPopupView.getKeyDispatcherState();
                if (state != null && state.isTracking(event) && !event.isCanceled()) {
                    this.dismiss();
                    return true;
                }
            }
            return this.mPopupWindow.superDispatchKeyEvent(event);
        } else {
            return this.mPopupWindow.superDispatchKeyEvent(event);
        }
    }
    dispatchTouchEvent(ev:MotionEvent):boolean {
        if (this.mTouchInterceptor != null && this.mTouchInterceptor.onTouch(this.mPopupView, ev)) {
            return true;
        }
        if(this.mPopupWindow.superDispatchTouchEvent(ev)){
            return true;
        }
        return this.onTouchEvent(ev);
    }
    dispatchGenericMotionEvent(ev:MotionEvent):boolean {
        if (this.mPopupWindow.superDispatchGenericMotionEvent(ev)) {
            return true;
        }
        return this.onGenericMotionEvent(ev);
    }

}

export module PopupWindow{
/**
     * Listener that is called when this popup window is dismissed.
     */
export interface OnDismissListener {
    /**
         * Called when this popup window is dismissed.
         */
    onDismiss():void;
}
//export class PopupViewContainer extends FrameLayout {
//    private static TAG:string = "PopupWindow.PopupViewContainer";
//
//    _PopupWindow_this:any;
//    constructor(context:Context, arg:PopupWindow){
//        super(context);
//        this._PopupWindow_this = arg;
//    }
//
//
//    //onCreateDrawableState(extraSpace:number):number[]  {
//    //    if (this._PopupWindow_this.mAboveAnchor) {
//    //        // 1 more needed for the above anchor state
//    //        const drawableState:number[] = super.onCreateDrawableState(extraSpace + 1);
//    //        View.mergeDrawableStates(drawableState, PopupWindow.ABOVE_ANCHOR_STATE_SET);
//    //        return drawableState;
//    //    } else {
//    //        return super.onCreateDrawableState(extraSpace);
//    //    }
//    //}
//
//    dispatchKeyEvent(event:KeyEvent):boolean  {
//        if (event.getKeyCode() == KeyEvent.KEYCODE_BACK) {
//            if (this.getKeyDispatcherState() == null) {
//                return super.dispatchKeyEvent(event);
//            }
//            if (event.getAction() == KeyEvent.ACTION_DOWN && event.getRepeatCount() == 0) {
//                let state:KeyEvent.DispatcherState = this.getKeyDispatcherState();
//                if (state != null) {
//                    state.startTracking(event, this);
//                }
//                return true;
//            } else if (event.getAction() == KeyEvent.ACTION_UP) {
//                let state:KeyEvent.DispatcherState = this.getKeyDispatcherState();
//                if (state != null && state.isTracking(event) && !event.isCanceled()) {
//                    this._PopupWindow_this.dismiss();
//                    return true;
//                }
//            }
//            return super.dispatchKeyEvent(event);
//        } else {
//            return super.dispatchKeyEvent(event);
//        }
//    }
//
//    dispatchTouchEvent(ev:MotionEvent):boolean  {
//        if (this._PopupWindow_this.mTouchInterceptor != null && this._PopupWindow_this.mTouchInterceptor.onTouch(this, ev)) {
//            return true;
//        }
//        return super.dispatchTouchEvent(ev);
//    }
//
//    onTouchEvent(event:MotionEvent):boolean  {
//        const x:number = Math.floor(event.getX());
//        const y:number = Math.floor(event.getY());
//        if ((event.getAction() == MotionEvent.ACTION_DOWN) && ((x < 0) || (x >= this.getWidth()) || (y < 0) || (y >= this.getHeight()))) {
//            this._PopupWindow_this.dismiss();
//            return true;
//        } else if (event.getAction() == MotionEvent.ACTION_OUTSIDE) {
//            this._PopupWindow_this.dismiss();
//            return true;
//        } else {
//            return super.onTouchEvent(event);
//        }
//    }
//
//    sendAccessibilityEvent(eventType:number):void  {
//        // clinets are interested in the content not the container, make it event source
//        if (this._PopupWindow_this.mContentView != null) {
//            this._PopupWindow_this.mContentView.sendAccessibilityEvent(eventType);
//        } else {
//            super.sendAccessibilityEvent(eventType);
//        }
//    }
//}
}

}
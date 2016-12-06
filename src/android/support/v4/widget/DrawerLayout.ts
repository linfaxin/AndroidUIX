/*
 * Copyright (C) 2013 The Android Open Source Project
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

///<reference path="../../../../android/graphics/Canvas.ts"/>
///<reference path="../../../../android/graphics/Paint.ts"/>
///<reference path="../../../../android/graphics/PixelFormat.ts"/>
///<reference path="../../../../android/graphics/Rect.ts"/>
///<reference path="../../../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../../../android/os/SystemClock.ts"/>
///<reference path="../../../../android/view/Gravity.ts"/>
///<reference path="../../../../android/view/KeyEvent.ts"/>
///<reference path="../../../../android/view/MotionEvent.ts"/>
///<reference path="../../../../android/view/View.ts"/>
///<reference path="../../../../android/view/ViewGroup.ts"/>
///<reference path="../../../../android/view/ViewParent.ts"/>
///<reference path="../../../../java/lang/Integer.ts"/>
///<reference path="../../../../java/lang/Runnable.ts"/>
///<reference path="../../../../android/support/v4/widget/ViewDragHelper.ts"/>

module android.support.v4.widget {
import Canvas = android.graphics.Canvas;
import Paint = android.graphics.Paint;
import PixelFormat = android.graphics.PixelFormat;
import Rect = android.graphics.Rect;
import Drawable = android.graphics.drawable.Drawable;
import SystemClock = android.os.SystemClock;
import Gravity = android.view.Gravity;
import KeyEvent = android.view.KeyEvent;
import MotionEvent = android.view.MotionEvent;
import View = android.view.View;
import ViewGroup = android.view.ViewGroup;
import ViewParent = android.view.ViewParent;
import Integer = java.lang.Integer;
import Runnable = java.lang.Runnable;
import ViewDragHelper = android.support.v4.widget.ViewDragHelper;
/**
 * DrawerLayout acts as a top-level container for window content that allows for
 * interactive "drawer" views to be pulled out from the edge of the window.
 *
 * <p>Drawer positioning and layout is controlled using the <code>android:layout_gravity</code>
 * attribute on child views corresponding to which side of the view you want the drawer
 * to emerge from: left or right. (Or start/end on platform versions that support layout direction.)
 * </p>
 *
 * <p>To use a DrawerLayout, position your primary content view as the first child with
 * a width and height of <code>match_parent</code>. Add drawers as child views after the main
 * content view and set the <code>layout_gravity</code> appropriately. Drawers commonly use
 * <code>match_parent</code> for height with a fixed width.</p>
 *
 * <p>{@link DrawerListener} can be used to monitor the state and motion of drawer views.
 * Avoid performing expensive operations such as layout during animation as it can cause
 * stuttering; try to perform expensive operations during the {@link #STATE_IDLE} state.
 * {@link SimpleDrawerListener} offers default/no-op implementations of each callback method.</p>
 *
 * <p>As per the Android Design guide, any drawers positioned to the left/start should
 * always contain content for navigating around the application, whereas any drawers
 * positioned to the right/end should always contain actions to take on the current content.
 * This preserves the same navigation left, actions right structure present in the Action Bar
 * and elsewhere.</p>
 */
export class DrawerLayout extends ViewGroup {

    private static TAG:string = "DrawerLayout";

    /**
     * Indicates that any drawers are in an idle, settled state. No animation is in progress.
     */
    static STATE_IDLE:number = ViewDragHelper.STATE_IDLE;

    /**
     * Indicates that a drawer is currently being dragged by the user.
     */
    static STATE_DRAGGING:number = ViewDragHelper.STATE_DRAGGING;

    /**
     * Indicates that a drawer is in the process of settling to a final position.
     */
    static STATE_SETTLING:number = ViewDragHelper.STATE_SETTLING;

    /**
     * The drawer is unlocked.
     */
    static LOCK_MODE_UNLOCKED:number = 0;

    /**
     * The drawer is locked closed. The user may not open it, though
     * the app may open it programmatically.
     */
    static LOCK_MODE_LOCKED_CLOSED:number = 1;

    /**
     * The drawer is locked open. The user may not close it, though the app
     * may close it programmatically.
     */
    static LOCK_MODE_LOCKED_OPEN:number = 2;

    // dp
    private static MIN_DRAWER_MARGIN:number = 64;

    private static DEFAULT_SCRIM_COLOR:number = 0x99000000;

    /**
     * Length of time to delay before peeking the drawer.
     */
    // ms
    static PEEK_DELAY:number = 160;

    /**
     * Minimum velocity that will be detected as a fling
     */
    // dips per second
    private static MIN_FLING_VELOCITY:number = 400;

    /**
     * Experimental feature.
     */
    static ALLOW_EDGE_LOCK:boolean = false;

    private static CHILDREN_DISALLOW_INTERCEPT:boolean = true;

    private static TOUCH_SLOP_SENSITIVITY:number = 1.;

    private mMinDrawerMargin:number = 0;

    private mScrimColor:number = DrawerLayout.DEFAULT_SCRIM_COLOR;

    private mScrimOpacity:number = 0;

    private mScrimPaint:Paint = new Paint();

    private mLeftDragger:ViewDragHelper;

    private mRightDragger:ViewDragHelper;

    private mLeftCallback:DrawerLayout.ViewDragCallback;

    private mRightCallback:DrawerLayout.ViewDragCallback;

    private mDrawerState:number = 0;

    private mInLayout:boolean;

    private mFirstLayout:boolean = true;

    private mLockModeLeft:number = 0;

    private mLockModeRight:number = 0;

    private mDisallowInterceptRequested:boolean;

    private mChildrenCanceledTouch:boolean;

    private mListener:DrawerLayout.DrawerListener;

    private mInitialMotionX:number = 0;

    private mInitialMotionY:number = 0;

    private mShadowLeft:Drawable;

    private mShadowRight:Drawable;


    constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle?:Map<string, string>) {
        super(context, bindElement, defStyle);

        const density:number = this.getResources().getDisplayMetrics().density;
        this.mMinDrawerMargin = Math.floor((DrawerLayout.MIN_DRAWER_MARGIN * density + 0.5));
        const minVel:number = DrawerLayout.MIN_FLING_VELOCITY * density;
        this.mLeftCallback = new DrawerLayout.ViewDragCallback(this, Gravity.LEFT);
        this.mRightCallback = new DrawerLayout.ViewDragCallback(this, Gravity.RIGHT);
        this.mLeftDragger = ViewDragHelper.create(this, DrawerLayout.TOUCH_SLOP_SENSITIVITY, this.mLeftCallback);
        this.mLeftDragger.setEdgeTrackingEnabled(ViewDragHelper.EDGE_LEFT);
        this.mLeftDragger.setMinVelocity(minVel);
        this.mLeftCallback.setDragger(this.mLeftDragger);
        this.mRightDragger = ViewDragHelper.create(this, DrawerLayout.TOUCH_SLOP_SENSITIVITY, this.mRightCallback);
        this.mRightDragger.setEdgeTrackingEnabled(ViewDragHelper.EDGE_RIGHT);
        this.mRightDragger.setMinVelocity(minVel);
        this.mRightCallback.setDragger(this.mRightDragger);
        // So that we can catch the back button
        this.setFocusableInTouchMode(true);
        //ViewCompat.setAccessibilityDelegate(this, new DrawerLayout.AccessibilityDelegate(this));
        this.setMotionEventSplittingEnabled(false);
    }

    /**
     * Set a simple drawable used for the left or right shadow.
     * The drawable provided must have a nonzero intrinsic width.
     *
     * @param shadowDrawable Shadow drawable to use at the edge of a drawer
     * @param gravity Which drawer the shadow should apply to
     */
    setDrawerShadow(shadowDrawable:Drawable, gravity:number):void  {
        /*
         * TODO Someone someday might want to set more complex drawables here.
         * They're probably nuts, but we might want to consider registering callbacks,
         * setting states, etc. properly.
         */
        const absGravity:number = Gravity.getAbsoluteGravity(gravity, this.getLayoutDirection());
        if ((absGravity & Gravity.LEFT) == Gravity.LEFT) {
            this.mShadowLeft = shadowDrawable;
            this.invalidate();
        }
        if ((absGravity & Gravity.RIGHT) == Gravity.RIGHT) {
            this.mShadowRight = shadowDrawable;
            this.invalidate();
        }
    }

    ///**
    // * Set a simple drawable used for the left or right shadow.
    // * The drawable provided must have a nonzero intrinsic width.
    // *
    // * @param resId Resource id of a shadow drawable to use at the edge of a drawer
    // * @param gravity Which drawer the shadow should apply to
    // */
    //setDrawerShadow(resId:number, gravity:number):void  {
    //    this.setDrawerShadow(this.getResources().getDrawable(resId), gravity);
    //}

    /**
     * Set a color to use for the scrim that obscures primary content while a drawer is open.
     *
     * @param color Color to use in 0xAARRGGBB format.
     */
    setScrimColor(color:number):void  {
        this.mScrimColor = color;
        this.invalidate();
    }

    /**
     * Set a listener to be notified of drawer events.
     *
     * @param listener Listener to notify when drawer events occur
     * @see DrawerListener
     */
    setDrawerListener(listener:DrawerLayout.DrawerListener):void  {
        this.mListener = listener;
    }

    ///**
    // * Enable or disable interaction with all drawers.
    // *
    // * <p>This allows the application to restrict the user's ability to open or close
    // * any drawer within this layout. DrawerLayout will still respond to calls to
    // * {@link #openDrawer(int)}, {@link #closeDrawer(int)} and friends if a drawer is locked.</p>
    // *
    // * <p>Locking drawers open or closed will implicitly open or close
    // * any drawers as appropriate.</p>
    // *
    // * @param lockMode The new lock mode for the given drawer. One of {@link #LOCK_MODE_UNLOCKED},
    // *                 {@link #LOCK_MODE_LOCKED_CLOSED} or {@link #LOCK_MODE_LOCKED_OPEN}.
    // */
    //setDrawerLockMode(lockMode:number):void  {
    //    this.setDrawerLockMode(lockMode, Gravity.LEFT);
    //    this.setDrawerLockMode(lockMode, Gravity.RIGHT);
    //}

    /**
     * Enable or disable interaction with the given drawer.
     *
     * <p>This allows the application to restrict the user's ability to open or close
     * the given drawer. DrawerLayout will still respond to calls to {@link #openDrawer(int)},
     * {@link #closeDrawer(int)} and friends if a drawer is locked.</p>
     *
     * <p>Locking a drawer open or closed will implicitly open or close
     * that drawer as appropriate.</p>
     *
     * @param lockMode The new lock mode for the given drawer. One of {@link #LOCK_MODE_UNLOCKED},
     *                 {@link #LOCK_MODE_LOCKED_CLOSED} or {@link #LOCK_MODE_LOCKED_OPEN}.
     * @param edgeGravity Gravity.LEFT, RIGHT, START or END.
     *                    Expresses which drawer to change the mode for.
     *
     * @see #LOCK_MODE_UNLOCKED
     * @see #LOCK_MODE_LOCKED_CLOSED
     * @see #LOCK_MODE_LOCKED_OPEN
     */
    setDrawerLockMode(lockMode:number, edgeGravityOrView?:number|View):void  {
        if(edgeGravityOrView==null){
            this.setDrawerLockMode(lockMode, Gravity.LEFT);
            this.setDrawerLockMode(lockMode, Gravity.RIGHT);
            return;
        }
        if(edgeGravityOrView instanceof View){
            if (!this.isDrawerView(edgeGravityOrView)) {
                throw Error(`new IllegalArgumentException("View " + drawerView + " is not a " + "drawer with appropriate layout_gravity")`);
            }
            const gravity:number = (<DrawerLayout.LayoutParams> edgeGravityOrView.getLayoutParams()).gravity;
            this.setDrawerLockMode(lockMode, gravity);
            return;
        }
        let edgeGravity = <number>edgeGravityOrView;
        const absGravity:number = Gravity.getAbsoluteGravity(edgeGravity, this.getLayoutDirection());
        if (absGravity == Gravity.LEFT) {
            this.mLockModeLeft = lockMode;
        } else if (absGravity == Gravity.RIGHT) {
            this.mLockModeRight = lockMode;
        }
        if (lockMode != DrawerLayout.LOCK_MODE_UNLOCKED) {
            // Cancel interaction in progress
            const helper:ViewDragHelper = absGravity == Gravity.LEFT ? this.mLeftDragger : this.mRightDragger;
            helper.cancel();
        }
        switch(lockMode) {
            case DrawerLayout.LOCK_MODE_LOCKED_OPEN:
                const toOpen:View = this.findDrawerWithGravity(absGravity);
                if (toOpen != null) {
                    this.openDrawer(toOpen);
                }
                break;
            case DrawerLayout.LOCK_MODE_LOCKED_CLOSED:
                const toClose:View = this.findDrawerWithGravity(absGravity);
                if (toClose != null) {
                    this.closeDrawer(toClose);
                }
                break;
        }
    }

    ///**
    // * Enable or disable interaction with the given drawer.
    // *
    // * <p>This allows the application to restrict the user's ability to open or close
    // * the given drawer. DrawerLayout will still respond to calls to {@link #openDrawer(int)},
    // * {@link #closeDrawer(int)} and friends if a drawer is locked.</p>
    // *
    // * <p>Locking a drawer open or closed will implicitly open or close
    // * that drawer as appropriate.</p>
    // *
    // * @param lockMode The new lock mode for the given drawer. One of {@link #LOCK_MODE_UNLOCKED},
    // *                 {@link #LOCK_MODE_LOCKED_CLOSED} or {@link #LOCK_MODE_LOCKED_OPEN}.
    // * @param drawerView The drawer view to change the lock mode for
    // *
    // * @see #LOCK_MODE_UNLOCKED
    // * @see #LOCK_MODE_LOCKED_CLOSED
    // * @see #LOCK_MODE_LOCKED_OPEN
    // */
    //setDrawerLockMode(lockMode:number, drawerView:View):void  {
    //    if (!this.isDrawerView(drawerView)) {
    //        throw Error(`new IllegalArgumentException("View " + drawerView + " is not a " + "drawer with appropriate layout_gravity")`);
    //    }
    //    const gravity:number = (<DrawerLayout.LayoutParams> drawerView.getLayoutParams()).gravity;
    //    this.setDrawerLockMode(lockMode, gravity);
    //}

    /**
     * Check the lock mode of the drawer with the given gravity.
     *
     * @param edgeGravityOrView Gravity of the drawer to check / Drawer view to check lock mode
     * @return one of {@link #LOCK_MODE_UNLOCKED}, {@link #LOCK_MODE_LOCKED_CLOSED} or
     *         {@link #LOCK_MODE_LOCKED_OPEN}.
     */
    getDrawerLockMode(edgeGravityOrView:number|View):number  {
        if(edgeGravityOrView instanceof View){
            let drawerView = edgeGravityOrView;
            const absGravity:number = this.getDrawerViewAbsoluteGravity(drawerView);
            if (absGravity == Gravity.LEFT) {
                return this.mLockModeLeft;
            } else if (absGravity == Gravity.RIGHT) {
                return this.mLockModeRight;
            }
            return DrawerLayout.LOCK_MODE_UNLOCKED;

        }else{
            let edgeGravity = <number>edgeGravityOrView;
            const absGravity:number = Gravity.getAbsoluteGravity(edgeGravity, this.getLayoutDirection());
            if (absGravity == Gravity.LEFT) {
                return this.mLockModeLeft;
            } else if (absGravity == Gravity.RIGHT) {
                return this.mLockModeRight;
            }
            return DrawerLayout.LOCK_MODE_UNLOCKED;
        }
    }

    /**
     * Resolve the shared state of all drawers from the component ViewDragHelpers.
     * Should be called whenever a ViewDragHelper's state changes.
     */
    updateDrawerState(forGravity:number, activeState:number, activeDrawer:View):void  {
        const leftState:number = this.mLeftDragger.getViewDragState();
        const rightState:number = this.mRightDragger.getViewDragState();
        let state:number;
        if (leftState == DrawerLayout.STATE_DRAGGING || rightState == DrawerLayout.STATE_DRAGGING) {
            state = DrawerLayout.STATE_DRAGGING;
        } else if (leftState == DrawerLayout.STATE_SETTLING || rightState == DrawerLayout.STATE_SETTLING) {
            state = DrawerLayout.STATE_SETTLING;
        } else {
            state = DrawerLayout.STATE_IDLE;
        }
        if (activeDrawer != null && activeState == DrawerLayout.STATE_IDLE) {
            const lp:DrawerLayout.LayoutParams = <DrawerLayout.LayoutParams> activeDrawer.getLayoutParams();
            if (lp.onScreen == 0) {
                this.dispatchOnDrawerClosed(activeDrawer);
            } else if (lp.onScreen == 1) {
                this.dispatchOnDrawerOpened(activeDrawer);
            }
        }
        if (state != this.mDrawerState) {
            this.mDrawerState = state;
            if (this.mListener != null) {
                this.mListener.onDrawerStateChanged(state);
            }
        }
    }

    dispatchOnDrawerClosed(drawerView:View):void  {
        const lp:DrawerLayout.LayoutParams = <DrawerLayout.LayoutParams> drawerView.getLayoutParams();
        if (lp.knownOpen) {
            lp.knownOpen = false;
            if (this.mListener != null) {
                this.mListener.onDrawerClosed(drawerView);
            }
            //this.sendAccessibilityEvent(AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED);
        }
    }

    dispatchOnDrawerOpened(drawerView:View):void  {
        const lp:DrawerLayout.LayoutParams = <DrawerLayout.LayoutParams> drawerView.getLayoutParams();
        if (!lp.knownOpen) {
            lp.knownOpen = true;
            if (this.mListener != null) {
                this.mListener.onDrawerOpened(drawerView);
            }
            //drawerView.sendAccessibilityEvent(AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED);
        }
    }

    dispatchOnDrawerSlide(drawerView:View, slideOffset:number):void  {
        if (this.mListener != null) {
            this.mListener.onDrawerSlide(drawerView, slideOffset);
        }
    }

    setDrawerViewOffset(drawerView:View, slideOffset:number):void  {
        const lp:DrawerLayout.LayoutParams = <DrawerLayout.LayoutParams> drawerView.getLayoutParams();
        if (slideOffset == lp.onScreen) {
            return;
        }
        lp.onScreen = slideOffset;
        this.dispatchOnDrawerSlide(drawerView, slideOffset);
    }

    getDrawerViewOffset(drawerView:View):number  {
        return (<DrawerLayout.LayoutParams> drawerView.getLayoutParams()).onScreen;
    }

    /**
     * @return the absolute gravity of the child drawerView, resolved according
     *         to the current layout direction
     */
    getDrawerViewAbsoluteGravity(drawerView:View):number  {
        const gravity:number = (<DrawerLayout.LayoutParams> drawerView.getLayoutParams()).gravity;
        return Gravity.getAbsoluteGravity(gravity, this.getLayoutDirection());
    }

    checkDrawerViewAbsoluteGravity(drawerView:View, checkFor:number):boolean  {
        const absGravity:number = this.getDrawerViewAbsoluteGravity(drawerView);
        return (absGravity & checkFor) == checkFor;
    }

    findOpenDrawer():View  {
        const childCount:number = this.getChildCount();
        for (let i:number = 0; i < childCount; i++) {
            const child:View = this.getChildAt(i);
            if ((<DrawerLayout.LayoutParams> child.getLayoutParams()).knownOpen) {
                return child;
            }
        }
        return null;
    }

    moveDrawerToOffset(drawerView:View, slideOffset:number):void  {
        const oldOffset:number = this.getDrawerViewOffset(drawerView);
        const width:number = drawerView.getWidth();
        const oldPos:number = Math.floor((width * oldOffset));
        const newPos:number = Math.floor((width * slideOffset));
        const dx:number = newPos - oldPos;
        drawerView.offsetLeftAndRight(this.checkDrawerViewAbsoluteGravity(drawerView, Gravity.LEFT) ? dx : -dx);
        this.setDrawerViewOffset(drawerView, slideOffset);
    }

    /**
     * @param gravity the gravity of the child to return. If specified as a
     *            relative value, it will be resolved according to the current
     *            layout direction.
     * @return the drawer with the specified gravity
     */
    findDrawerWithGravity(gravity:number):View  {
        const absHorizGravity:number = Gravity.getAbsoluteGravity(gravity, this.getLayoutDirection()) & Gravity.HORIZONTAL_GRAVITY_MASK;
        const childCount:number = this.getChildCount();
        for (let i:number = 0; i < childCount; i++) {
            const child:View = this.getChildAt(i);
            const childAbsGravity:number = this.getDrawerViewAbsoluteGravity(child);
            if ((childAbsGravity & Gravity.HORIZONTAL_GRAVITY_MASK) == absHorizGravity) {
                return child;
            }
        }
        return null;
    }

    /**
     * Simple gravity to string - only supports LEFT and RIGHT for debugging output.
     *
     * @param gravity Absolute gravity value
     * @return LEFT or RIGHT as appropriate, or a hex string
     */
    static gravityToString(gravity:number):string  {
        if ((gravity & Gravity.LEFT) == Gravity.LEFT) {
            return "LEFT";
        }
        if ((gravity & Gravity.RIGHT) == Gravity.RIGHT) {
            return "RIGHT";
        }
        return ''+gravity;
    }

    protected onDetachedFromWindow():void  {
        super.onDetachedFromWindow();
        this.mFirstLayout = true;
    }

    protected onAttachedToWindow():void  {
        super.onAttachedToWindow();
        this.mFirstLayout = true;
    }

    protected onMeasure(widthMeasureSpec:number, heightMeasureSpec:number):void  {
        let widthMode:number = View.MeasureSpec.getMode(widthMeasureSpec);
        let heightMode:number = View.MeasureSpec.getMode(heightMeasureSpec);
        let widthSize:number = View.MeasureSpec.getSize(widthMeasureSpec);
        let heightSize:number = View.MeasureSpec.getSize(heightMeasureSpec);
        if (widthMode != View.MeasureSpec.EXACTLY || heightMode != View.MeasureSpec.EXACTLY) {
            if (this.isInEditMode()) {
                // It will crash on a real device.
                if (widthMode == View.MeasureSpec.AT_MOST) {
                    widthMode = View.MeasureSpec.EXACTLY;
                } else if (widthMode == View.MeasureSpec.UNSPECIFIED) {
                    widthMode = View.MeasureSpec.EXACTLY;
                    widthSize = 300;
                }
                if (heightMode == View.MeasureSpec.AT_MOST) {
                    heightMode = View.MeasureSpec.EXACTLY;
                } else if (heightMode == View.MeasureSpec.UNSPECIFIED) {
                    heightMode = View.MeasureSpec.EXACTLY;
                    heightSize = 300;
                }
            } else {
                throw Error(`new IllegalArgumentException("DrawerLayout must be measured with MeasureSpec.EXACTLY.")`);
            }
        }
        this.setMeasuredDimension(widthSize, heightSize);
        // Gravity value for each drawer we've seen. Only one of each permitted.
        let foundDrawers:number = 0;
        const childCount:number = this.getChildCount();
        for (let i:number = 0; i < childCount; i++) {
            const child:View = this.getChildAt(i);
            if (child.getVisibility() == DrawerLayout.GONE) {
                continue;
            }
            const lp:DrawerLayout.LayoutParams = <DrawerLayout.LayoutParams> child.getLayoutParams();
            if (this.isContentView(child)) {
                // Content views get measured at exactly the layout's size.
                const contentWidthSpec:number = View.MeasureSpec.makeMeasureSpec(widthSize - lp.leftMargin - lp.rightMargin, View.MeasureSpec.EXACTLY);
                const contentHeightSpec:number = View.MeasureSpec.makeMeasureSpec(heightSize - lp.topMargin - lp.bottomMargin, View.MeasureSpec.EXACTLY);
                child.measure(contentWidthSpec, contentHeightSpec);
            } else if (this.isDrawerView(child)) {
                const childGravity:number = this.getDrawerViewAbsoluteGravity(child) & Gravity.HORIZONTAL_GRAVITY_MASK;
                if ((foundDrawers & childGravity) != 0) {
                    throw Error(`new IllegalStateException("Child drawer has absolute gravity " + DrawerLayout.gravityToString(childGravity) + " but this " + DrawerLayout.TAG + " already has a " + "drawer view along that edge")`);
                }
                const drawerWidthSpec:number = DrawerLayout.getChildMeasureSpec(widthMeasureSpec, this.mMinDrawerMargin + lp.leftMargin + lp.rightMargin, lp.width);
                const drawerHeightSpec:number = DrawerLayout.getChildMeasureSpec(heightMeasureSpec, lp.topMargin + lp.bottomMargin, lp.height);
                child.measure(drawerWidthSpec, drawerHeightSpec);
            } else {
                throw Error(`new IllegalStateException("Child " + child + " at index " + i + " does not have a valid layout_gravity - must be Gravity.LEFT, " + "Gravity.RIGHT or Gravity.NO_GRAVITY")`);
            }
        }
    }

    protected onLayout(changed:boolean, l:number, t:number, r:number, b:number):void  {
        this.mInLayout = true;
        const width:number = r - l;
        const childCount:number = this.getChildCount();
        for (let i:number = 0; i < childCount; i++) {
            const child:View = this.getChildAt(i);
            if (child.getVisibility() == DrawerLayout.GONE) {
                continue;
            }
            const lp:DrawerLayout.LayoutParams = <DrawerLayout.LayoutParams> child.getLayoutParams();
            if (this.isContentView(child)) {
                child.layout(lp.leftMargin, lp.topMargin, lp.leftMargin + child.getMeasuredWidth(), lp.topMargin + child.getMeasuredHeight());
            } else {
                // Drawer, if it wasn't onMeasure would have thrown an exception.
                const childWidth:number = child.getMeasuredWidth();
                const childHeight:number = child.getMeasuredHeight();
                let childLeft:number;
                let newOffset:number;
                if (this.checkDrawerViewAbsoluteGravity(child, Gravity.LEFT)) {
                    childLeft = -childWidth + Math.floor((childWidth * lp.onScreen));
                    newOffset = <number> (childWidth + childLeft) / childWidth;
                } else {
                    // Right; onMeasure checked for us.
                    childLeft = width - Math.floor((childWidth * lp.onScreen));
                    newOffset = <number> (width - childLeft) / childWidth;
                }
                const changeOffset:boolean = newOffset != lp.onScreen;
                const vgrav:number = lp.gravity & Gravity.VERTICAL_GRAVITY_MASK;
                switch(vgrav) {
                    default:
                    case Gravity.TOP:
                        {
                            child.layout(childLeft, lp.topMargin, childLeft + childWidth, lp.topMargin + childHeight);
                            break;
                        }
                    case Gravity.BOTTOM:
                        {
                            const height:number = b - t;
                            child.layout(childLeft, height - lp.bottomMargin - child.getMeasuredHeight(), childLeft + childWidth, height - lp.bottomMargin);
                            break;
                        }
                    case Gravity.CENTER_VERTICAL:
                        {
                            const height:number = b - t;
                            let childTop:number = (height - childHeight) / 2;
                            // bad measurement before, oh well.
                            if (childTop < lp.topMargin) {
                                childTop = lp.topMargin;
                            } else if (childTop + childHeight > height - lp.bottomMargin) {
                                childTop = height - lp.bottomMargin - childHeight;
                            }
                            child.layout(childLeft, childTop, childLeft + childWidth, childTop + childHeight);
                            break;
                        }
                }
                if (changeOffset) {
                    this.setDrawerViewOffset(child, newOffset);
                }
                const newVisibility:number = lp.onScreen > 0 ? DrawerLayout.VISIBLE : DrawerLayout.INVISIBLE;
                if (child.getVisibility() != newVisibility) {
                    child.setVisibility(newVisibility);
                }
            }
        }
        this.mInLayout = false;
        this.mFirstLayout = false;
    }

    requestLayout():void  {
        if (!this.mInLayout) {
            super.requestLayout();
        }
    }

    computeScroll():void  {
        const childCount:number = this.getChildCount();
        let scrimOpacity:number = 0;
        for (let i:number = 0; i < childCount; i++) {
            const onscreen:number = (<DrawerLayout.LayoutParams> this.getChildAt(i).getLayoutParams()).onScreen;
            scrimOpacity = Math.max(scrimOpacity, onscreen);
        }
        this.mScrimOpacity = scrimOpacity;

        let leftContinue = this.mLeftDragger.continueSettling(true);
        let rightContinue = this.mRightDragger.continueSettling(true);
        if (leftContinue || rightContinue) {
            this.postInvalidateOnAnimation();
        }
    }

    private static hasOpaqueBackground(v:View):boolean  {
        const bg:Drawable = v.getBackground();
        if (bg != null) {
            return bg.getOpacity() == PixelFormat.OPAQUE;
        }
        return false;
    }

    protected drawChild(canvas:Canvas, child:View, drawingTime:number):boolean  {
        const height:number = this.getHeight();
        const drawingContent:boolean = this.isContentView(child);
        let clipLeft:number = 0, clipRight:number = this.getWidth();
        const restoreCount:number = canvas.save();
        if (drawingContent) {
            const childCount:number = this.getChildCount();
            for (let i:number = 0; i < childCount; i++) {
                const v:View = this.getChildAt(i);
                if (v == child || v.getVisibility() != DrawerLayout.VISIBLE || !DrawerLayout.hasOpaqueBackground(v) || !this.isDrawerView(v) || v.getHeight() < height) {
                    continue;
                }
                if (this.checkDrawerViewAbsoluteGravity(v, Gravity.LEFT)) {
                    const vright:number = v.getRight();
                    if (vright > clipLeft)
                        clipLeft = vright;
                } else {
                    const vleft:number = v.getLeft();
                    if (vleft < clipRight)
                        clipRight = vleft;
                }
            }
            canvas.clipRect(clipLeft, 0, clipRight, this.getHeight());
        }
        const result:boolean = super.drawChild(canvas, child, drawingTime);
        canvas.restoreToCount(restoreCount);
        if (this.mScrimOpacity > 0 && drawingContent) {
            const baseAlpha:number = (this.mScrimColor & 0xff000000) >>> 24;
            const imag:number = Math.floor((baseAlpha * this.mScrimOpacity));
            const color:number = imag << 24 | (this.mScrimColor & 0xffffff);
            this.mScrimPaint.setColor(color);
            canvas.drawRect(clipLeft, 0, clipRight, this.getHeight(), this.mScrimPaint);
        } else if (this.mShadowLeft != null && this.checkDrawerViewAbsoluteGravity(child, Gravity.LEFT)) {
            const shadowWidth:number = this.mShadowLeft.getIntrinsicWidth();
            const childRight:number = child.getRight();
            const drawerPeekDistance:number = this.mLeftDragger.getEdgeSize();
            const alpha:number = Math.max(0, Math.min(<number> childRight / drawerPeekDistance, 1.));
            this.mShadowLeft.setBounds(childRight, child.getTop(), childRight + shadowWidth, child.getBottom());
            this.mShadowLeft.setAlpha(Math.floor((0xff * alpha)));
            this.mShadowLeft.draw(canvas);
        } else if (this.mShadowRight != null && this.checkDrawerViewAbsoluteGravity(child, Gravity.RIGHT)) {
            const shadowWidth:number = this.mShadowRight.getIntrinsicWidth();
            const childLeft:number = child.getLeft();
            const showing:number = this.getWidth() - childLeft;
            const drawerPeekDistance:number = this.mRightDragger.getEdgeSize();
            const alpha:number = Math.max(0, Math.min(<number> showing / drawerPeekDistance, 1.));
            this.mShadowRight.setBounds(childLeft - shadowWidth, child.getTop(), childLeft, child.getBottom());
            this.mShadowRight.setAlpha(Math.floor((0xff * alpha)));
            this.mShadowRight.draw(canvas);
        }
        return result;
    }

    isContentView(child:View):boolean  {
        return (<DrawerLayout.LayoutParams> child.getLayoutParams()).gravity == Gravity.NO_GRAVITY;
    }

    isDrawerView(child:View):boolean  {
        const gravity:number = (<DrawerLayout.LayoutParams> child.getLayoutParams()).gravity;
        const absGravity:number = Gravity.getAbsoluteGravity(gravity, child.getLayoutDirection());
        return (absGravity & (Gravity.LEFT | Gravity.RIGHT)) != 0;
    }

    onInterceptTouchEvent(ev:MotionEvent):boolean  {
        const action:number = ev.getActionMasked();

        const leftIntercept = this.mLeftDragger.shouldInterceptTouchEvent(ev);
        const rightIntercept = this.mRightDragger.shouldInterceptTouchEvent(ev);
        const interceptForDrag:boolean = leftIntercept || rightIntercept;
        let interceptForTap:boolean = false;
        switch(action) {
            case MotionEvent.ACTION_DOWN:
                {
                    const x:number = ev.getX();
                    const y:number = ev.getY();
                    this.mInitialMotionX = x;
                    this.mInitialMotionY = y;
                    if (this.mScrimOpacity > 0 && this.isContentView(this.mLeftDragger.findTopChildUnder(Math.floor(x), Math.floor(y)))) {
                        interceptForTap = true;
                    }
                    this.mDisallowInterceptRequested = false;
                    this.mChildrenCanceledTouch = false;
                    break;
                }
            case MotionEvent.ACTION_MOVE:
                {
                    // If we cross the touch slop, don't perform the delayed peek for an edge touch.
                    if (this.mLeftDragger.checkTouchSlop(ViewDragHelper.DIRECTION_ALL)) {
                        this.mLeftCallback.removeCallbacks();
                        this.mRightCallback.removeCallbacks();
                    }
                    break;
                }
            case MotionEvent.ACTION_CANCEL:
            case MotionEvent.ACTION_UP:
                {
                    this.closeDrawers(true);
                    this.mDisallowInterceptRequested = false;
                    this.mChildrenCanceledTouch = false;
                }
        }
        return interceptForDrag || interceptForTap || this.hasPeekingDrawer() || this.mChildrenCanceledTouch;
    }

    onTouchEvent(ev:MotionEvent):boolean  {
        this.mLeftDragger.processTouchEvent(ev);
        this.mRightDragger.processTouchEvent(ev);
        const action:number = ev.getAction();
        let wantTouchEvents:boolean = true;
        switch(action & MotionEvent.ACTION_MASK) {
            case MotionEvent.ACTION_DOWN:
                {
                    const x:number = ev.getX();
                    const y:number = ev.getY();
                    this.mInitialMotionX = x;
                    this.mInitialMotionY = y;
                    this.mDisallowInterceptRequested = false;
                    this.mChildrenCanceledTouch = false;
                    break;
                }
            case MotionEvent.ACTION_UP:
                {
                    const x:number = ev.getX();
                    const y:number = ev.getY();
                    let peekingOnly:boolean = true;
                    const touchedView:View = this.mLeftDragger.findTopChildUnder(Math.floor(x), Math.floor(y));
                    if (touchedView != null && this.isContentView(touchedView)) {
                        const dx:number = x - this.mInitialMotionX;
                        const dy:number = y - this.mInitialMotionY;
                        const slop:number = this.mLeftDragger.getTouchSlop();
                        if (dx * dx + dy * dy < slop * slop) {
                            // Taps close a dimmed open drawer but only if it isn't locked open.
                            const openDrawer:View = this.findOpenDrawer();
                            if (openDrawer != null) {
                                peekingOnly = this.getDrawerLockMode(openDrawer) == DrawerLayout.LOCK_MODE_LOCKED_OPEN;
                            }
                        }
                    }
                    this.closeDrawers(peekingOnly);
                    this.mDisallowInterceptRequested = false;
                    break;
                }
            case MotionEvent.ACTION_CANCEL:
                {
                    this.closeDrawers(true);
                    this.mDisallowInterceptRequested = false;
                    this.mChildrenCanceledTouch = false;
                    break;
                }
        }
        return wantTouchEvents;
    }

    requestDisallowInterceptTouchEvent(disallowIntercept:boolean):void  {
        if (DrawerLayout.CHILDREN_DISALLOW_INTERCEPT || (!this.mLeftDragger.isEdgeTouched(ViewDragHelper.EDGE_LEFT) && !this.mRightDragger.isEdgeTouched(ViewDragHelper.EDGE_RIGHT))) {
            // If we have an edge touch we want to skip this and track it for later instead.
            super.requestDisallowInterceptTouchEvent(disallowIntercept);
        }
        this.mDisallowInterceptRequested = disallowIntercept;
        if (disallowIntercept) {
            this.closeDrawers(true);
        }
    }

    /**
     * Close all currently open drawer views by animating them out of view.
     */
    closeDrawers(peekingOnly = false):void  {
        let needsInvalidate:boolean = false;
        const childCount:number = this.getChildCount();
        for (let i:number = 0; i < childCount; i++) {
            const child:View = this.getChildAt(i);
            const lp:DrawerLayout.LayoutParams = <DrawerLayout.LayoutParams> child.getLayoutParams();
            if (!this.isDrawerView(child) || (peekingOnly && !lp.isPeeking)) {
                continue;
            }
            const childWidth:number = child.getWidth();
            if (this.checkDrawerViewAbsoluteGravity(child, Gravity.LEFT)) {
                needsInvalidate = this.mLeftDragger.smoothSlideViewTo(child, -childWidth, child.getTop()) || needsInvalidate;
            } else {
                needsInvalidate = this.mRightDragger.smoothSlideViewTo(child, this.getWidth(), child.getTop()) || needsInvalidate;
            }
            lp.isPeeking = false;
        }
        this.mLeftCallback.removeCallbacks();
        this.mRightCallback.removeCallbacks();
        if (needsInvalidate) {
            this.invalidate();
        }
    }

    /**
     * Open the specified drawer view by animating it into view.
     *
     * @param drawerView Drawer view to open
     */
    openDrawer(drawerView:View):void;

    /**
     * Open the specified drawer by animating it out of view.
     *
     * @param gravity Gravity.LEFT to move the left drawer or Gravity.RIGHT for the right.
     *                Gravity.START or Gravity.END may also be used.
     */
    openDrawer(gravity:number):void;

    openDrawer(arg:View|number):void{
        if(arg instanceof View){
            this._openDrawer_view(<View>arg);
        }else{
            this._openDrawer_gravity(<number>arg);
        }
    }
    private _openDrawer_view(drawerView:View):void  {
        if (!this.isDrawerView(drawerView)) {
            throw Error(`new IllegalArgumentException("View " + drawerView + " is not a sliding drawer")`);
        }
        if (this.mFirstLayout) {
            const lp:DrawerLayout.LayoutParams = <DrawerLayout.LayoutParams> drawerView.getLayoutParams();
            lp.onScreen = 1.;
            lp.knownOpen = true;
        } else {
            if (this.checkDrawerViewAbsoluteGravity(drawerView, Gravity.LEFT)) {
                this.mLeftDragger.smoothSlideViewTo(drawerView, 0, drawerView.getTop());
            } else {
                this.mRightDragger.smoothSlideViewTo(drawerView, this.getWidth() - drawerView.getWidth(), drawerView.getTop());
            }
        }
        this.invalidate();
    }

    private _openDrawer_gravity(gravity:number):void  {
        const drawerView:View = this.findDrawerWithGravity(gravity);
        if (drawerView == null) {
            throw Error(`new IllegalArgumentException("No drawer view found with gravity " + DrawerLayout.gravityToString(gravity))`);
        }
        this.openDrawer(drawerView);
    }

    /**
     * Close the specified drawer view by animating it into view.
     *
     * @param drawerView Drawer view to close
     */
    closeDrawer(drawerView:View):void;
    /**
     * Close the specified drawer by animating it out of view.
     *
     * @param gravity Gravity.LEFT to move the left drawer or Gravity.RIGHT for the right.
     *                Gravity.START or Gravity.END may also be used.
     */
    closeDrawer(gravity:number):void;
    closeDrawer(arg:View|number){
        if(arg instanceof View){
            this._closeDrawer_view(<View>arg);
        }else{
            this._closeDrawer_gravity(<number>arg);
        }
    }
    private _closeDrawer_view(drawerView:View):void  {
        if (!this.isDrawerView(drawerView)) {
            throw Error(`new IllegalArgumentException("View " + drawerView + " is not a sliding drawer")`);
        }
        if (this.mFirstLayout) {
            const lp:DrawerLayout.LayoutParams = <DrawerLayout.LayoutParams> drawerView.getLayoutParams();
            lp.onScreen = 0.;
            lp.knownOpen = false;
        } else {
            if (this.checkDrawerViewAbsoluteGravity(drawerView, Gravity.LEFT)) {
                this.mLeftDragger.smoothSlideViewTo(drawerView, -drawerView.getWidth(), drawerView.getTop());
            } else {
                this.mRightDragger.smoothSlideViewTo(drawerView, this.getWidth(), drawerView.getTop());
            }
        }
        this.invalidate();
    }

    private _closeDrawer_gravity(gravity:number):void  {
        const drawerView:View = this.findDrawerWithGravity(gravity);
        if (drawerView == null) {
            throw Error(`new IllegalArgumentException("No drawer view found with gravity " + DrawerLayout.gravityToString(gravity))`);
        }
        this.closeDrawer(drawerView);
    }

    /**
     * Check if the given drawer view is currently in an open state.
     * To be considered "open" the drawer must have settled into its fully
     * visible state. To check for partial visibility use
     * {@link #isDrawerVisible(android.view.View)}.
     *
     * @param drawer Drawer view to check
     * @return true if the given drawer view is in an open state
     * @see #isDrawerVisible(android.view.View)
     */
    isDrawerOpen(drawer:View):boolean;
    /**
     * Check if the given drawer view is currently in an open state.
     * To be considered "open" the drawer must have settled into its fully
     * visible state. If there is no drawer with the given gravity this method
     * will return false.
     *
     * @param drawerGravity Gravity of the drawer to check
     * @return true if the given drawer view is in an open state
     */
    isDrawerOpen(drawerGravity:number):boolean;
    isDrawerOpen(arg:View|number):boolean{
        if(arg instanceof View){
            return this._isDrawerOpen_view(<View>arg);
        }else{
            return this._isDrawerOpen_gravity(<number>arg);
        }
    }

    private _isDrawerOpen_view(drawer:View):boolean  {
        if (!this.isDrawerView(drawer)) {
            throw Error(`new IllegalArgumentException("View " + drawer + " is not a drawer")`);
        }
        return (<DrawerLayout.LayoutParams> drawer.getLayoutParams()).knownOpen;
    }
    private _isDrawerOpen_gravity(drawerGravity:number):boolean  {
        const drawerView:View = this.findDrawerWithGravity(drawerGravity);
        if (drawerView != null) {
            return this.isDrawerOpen(drawerView);
        }
        return false;
    }

    /**
     * Check if a given drawer view is currently visible on-screen. The drawer
     * may be only peeking onto the screen, fully extended, or anywhere inbetween.
     *
     * @param drawer Drawer view to check
     * @return true if the given drawer is visible on-screen
     * @see #isDrawerOpen(android.view.View)
     */
    isDrawerVisible(drawer:View):boolean;

    /**
     * Check if a given drawer view is currently visible on-screen. The drawer
     * may be only peeking onto the screen, fully extended, or anywhere inbetween.
     * If there is no drawer with the given gravity this method will return false.
     *
     * @param drawerGravity Gravity of the drawer to check
     * @return true if the given drawer is visible on-screen
     */
    isDrawerVisible(drawerGravity:number):boolean;
    isDrawerVisible(arg:View|number):boolean{
        if(arg instanceof View){
            return this._isDrawerVisible_view(<View>arg);
        }else{
            return this._isDrawerVisible_gravity(<number>arg);
        }
    }

    private _isDrawerVisible_view(drawer:View):boolean  {
        if (!this.isDrawerView(drawer)) {
            throw Error(`new IllegalArgumentException("View " + drawer + " is not a drawer")`);
        }
        return (<DrawerLayout.LayoutParams> drawer.getLayoutParams()).onScreen > 0;
    }
    private _isDrawerVisible_gravity(drawerGravity:number):boolean  {
        const drawerView:View = this.findDrawerWithGravity(drawerGravity);
        if (drawerView != null) {
            return this.isDrawerVisible(drawerView);
        }
        return false;
    }

    private hasPeekingDrawer():boolean  {
        const childCount:number = this.getChildCount();
        for (let i:number = 0; i < childCount; i++) {
            const lp:DrawerLayout.LayoutParams = <DrawerLayout.LayoutParams> this.getChildAt(i).getLayoutParams();
            if (lp.isPeeking) {
                return true;
            }
        }
        return false;
    }

    protected generateDefaultLayoutParams():ViewGroup.LayoutParams  {
        return new DrawerLayout.LayoutParams(DrawerLayout.LayoutParams.FILL_PARENT, DrawerLayout.LayoutParams.FILL_PARENT);
    }

    protected generateLayoutParams(p:ViewGroup.LayoutParams):ViewGroup.LayoutParams  {
        return p instanceof DrawerLayout.LayoutParams ? new DrawerLayout.LayoutParams(<DrawerLayout.LayoutParams> p)
            : p instanceof ViewGroup.MarginLayoutParams ? new DrawerLayout.LayoutParams(<ViewGroup.MarginLayoutParams> p)
            : new DrawerLayout.LayoutParams(p);
    }

    protected checkLayoutParams(p:ViewGroup.LayoutParams):boolean  {
        return p instanceof DrawerLayout.LayoutParams && super.checkLayoutParams(p);
    }

    private hasVisibleDrawer():boolean  {
        return this.findVisibleDrawer() != null;
    }

    private findVisibleDrawer():View  {
        const childCount:number = this.getChildCount();
        for (let i:number = 0; i < childCount; i++) {
            const child:View = this.getChildAt(i);
            if (this.isDrawerView(child) && this.isDrawerVisible(child)) {
                return child;
            }
        }
        return null;
    }

    cancelChildViewTouch():void  {
        // Cancel child touches
        if (!this.mChildrenCanceledTouch) {
            const now:number = SystemClock.uptimeMillis();
            const cancelEvent:MotionEvent = MotionEvent.obtainWithAction(now, now, MotionEvent.ACTION_CANCEL, 0.0, 0.0, 0);
            const childCount:number = this.getChildCount();
            for (let i:number = 0; i < childCount; i++) {
                this.getChildAt(i).dispatchTouchEvent(cancelEvent);
            }
            cancelEvent.recycle();
            this.mChildrenCanceledTouch = true;
        }
    }

    onKeyDown(keyCode:number, event:KeyEvent):boolean  {
        if (keyCode == KeyEvent.KEYCODE_BACK && this.hasVisibleDrawer()) {
            event.startTracking();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    onKeyUp(keyCode:number, event:KeyEvent):boolean  {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            const visibleDrawer:View = this.findVisibleDrawer();
            if (visibleDrawer != null && this.getDrawerLockMode(visibleDrawer) == DrawerLayout.LOCK_MODE_UNLOCKED) {
                this.closeDrawers();
            }
            return visibleDrawer != null;
        }
        return super.onKeyUp(keyCode, event);
    }

}

export module DrawerLayout{
/**
     * Listener for monitoring events about drawers.
     */
export interface DrawerListener {

    /**
         * Called when a drawer's position changes.
         * @param drawerView The child view that was moved
         * @param slideOffset The new offset of this drawer within its range, from 0-1
         */
    onDrawerSlide(drawerView:View, slideOffset:number):void ;

    /**
         * Called when a drawer has settled in a completely open state.
         * The drawer is interactive at this point.
         *
         * @param drawerView Drawer view that is now open
         */
    onDrawerOpened(drawerView:View):void ;

    /**
         * Called when a drawer has settled in a completely closed state.
         *
         * @param drawerView Drawer view that is now closed
         */
    onDrawerClosed(drawerView:View):void ;

    /**
         * Called when the drawer motion state changes. The new state will
         * be one of {@link #STATE_IDLE}, {@link #STATE_DRAGGING} or {@link #STATE_SETTLING}.
         *
         * @param newState The new drawer motion state
         */
    onDrawerStateChanged(newState:number):void ;
}
/**
     * Stub/no-op implementations of all methods of {@link DrawerListener}.
     * Override this if you only care about a few of the available callback methods.
     */
export class SimpleDrawerListener implements DrawerLayout.DrawerListener {

    onDrawerSlide(drawerView:View, slideOffset:number):void  {
    }

    onDrawerOpened(drawerView:View):void  {
    }

    onDrawerClosed(drawerView:View):void  {
    }

    onDrawerStateChanged(newState:number):void  {
    }
}
export class ViewDragCallback extends ViewDragHelper.Callback {
    _DrawerLayout_this:DrawerLayout;
    constructor(arg:DrawerLayout, gravity:number){
        super();
        this._DrawerLayout_this = arg;
        this.mAbsGravity = gravity;
    }

    private mAbsGravity:number = 0;

    private mDragger:ViewDragHelper;

    private mPeekRunnable:Runnable = (()=>{
        const _this=this;
        class _Inner implements Runnable {

            run():void  {
                _this.peekDrawer();
            }
        }
        return new _Inner();
    })();


    setDragger(dragger:ViewDragHelper):void  {
        this.mDragger = dragger;
    }

    removeCallbacks():void  {
        this._DrawerLayout_this.removeCallbacks(this.mPeekRunnable);
    }

    tryCaptureView(child:View, pointerId:number):boolean  {
        // This lets us use two ViewDragHelpers, one for each side drawer.
        return this._DrawerLayout_this.isDrawerView(child) && this._DrawerLayout_this.checkDrawerViewAbsoluteGravity(child, this.mAbsGravity) && this._DrawerLayout_this.getDrawerLockMode(child) == DrawerLayout.LOCK_MODE_UNLOCKED;
    }

    onViewDragStateChanged(state:number):void  {
        this._DrawerLayout_this.updateDrawerState(this.mAbsGravity, state, this.mDragger.getCapturedView());
    }

    onViewPositionChanged(changedView:View, left:number, top:number, dx:number, dy:number):void  {
        let offset:number;
        const childWidth:number = changedView.getWidth();
        // This reverses the positioning shown in onLayout.
        if (this._DrawerLayout_this.checkDrawerViewAbsoluteGravity(changedView, Gravity.LEFT)) {
            offset = <number> (childWidth + left) / childWidth;
        } else {
            const width:number = this._DrawerLayout_this.getWidth();
            offset = <number> (width - left) / childWidth;
        }
        this._DrawerLayout_this.setDrawerViewOffset(changedView, offset);
        changedView.setVisibility(offset == 0 ? DrawerLayout.INVISIBLE : DrawerLayout.VISIBLE);
        this._DrawerLayout_this.invalidate();
    }

    onViewCaptured(capturedChild:View, activePointerId:number):void  {
        const lp:DrawerLayout.LayoutParams = <DrawerLayout.LayoutParams> capturedChild.getLayoutParams();
        lp.isPeeking = false;
        this.closeOtherDrawer();
    }

    private closeOtherDrawer():void  {
        const otherGrav:number = this.mAbsGravity == Gravity.LEFT ? Gravity.RIGHT : Gravity.LEFT;
        const toClose:View = this._DrawerLayout_this.findDrawerWithGravity(otherGrav);
        if (toClose != null) {
            this._DrawerLayout_this.closeDrawer(toClose);
        }
    }

    onViewReleased(releasedChild:View, xvel:number, yvel:number):void  {
        // Offset is how open the drawer is, therefore left/right values
        // are reversed from one another.
        const offset:number = this._DrawerLayout_this.getDrawerViewOffset(releasedChild);
        const childWidth:number = releasedChild.getWidth();
        let left:number;
        if (this._DrawerLayout_this.checkDrawerViewAbsoluteGravity(releasedChild, Gravity.LEFT)) {
            left = xvel > 0 || xvel == 0 && offset > 0.5 ? 0 : -childWidth;
        } else {
            const width:number = this._DrawerLayout_this.getWidth();
            left = xvel < 0 || xvel == 0 && offset > 0.5 ? width - childWidth : width;
        }
        this.mDragger.settleCapturedViewAt(left, releasedChild.getTop());
        this._DrawerLayout_this.invalidate();
    }

    onEdgeTouched(edgeFlags:number, pointerId:number):void  {
        this._DrawerLayout_this.postDelayed(this.mPeekRunnable, DrawerLayout.PEEK_DELAY);
    }

    private peekDrawer():void  {
        let toCapture:View;
        let childLeft:number;
        const peekDistance:number = this.mDragger.getEdgeSize();
        const leftEdge:boolean = this.mAbsGravity == Gravity.LEFT;
        if (leftEdge) {
            toCapture = this._DrawerLayout_this.findDrawerWithGravity(Gravity.LEFT);
            childLeft = (toCapture != null ? -toCapture.getWidth() : 0) + peekDistance;
        } else {
            toCapture = this._DrawerLayout_this.findDrawerWithGravity(Gravity.RIGHT);
            childLeft = this._DrawerLayout_this.getWidth() - peekDistance;
        }
        // Only peek if it would mean making the drawer more visible and the drawer isn't locked
        if (toCapture != null && ((leftEdge && toCapture.getLeft() < childLeft) || (!leftEdge && toCapture.getLeft() > childLeft)) && this._DrawerLayout_this.getDrawerLockMode(toCapture) == DrawerLayout.LOCK_MODE_UNLOCKED) {
            const lp:DrawerLayout.LayoutParams = <DrawerLayout.LayoutParams> toCapture.getLayoutParams();
            this.mDragger.smoothSlideViewTo(toCapture, childLeft, toCapture.getTop());
            lp.isPeeking = true;
            this._DrawerLayout_this.invalidate();
            this.closeOtherDrawer();
            this._DrawerLayout_this.cancelChildViewTouch();
        }
    }

    onEdgeLock(edgeFlags:number):boolean  {
        if (DrawerLayout.ALLOW_EDGE_LOCK) {
            const drawer:View = this._DrawerLayout_this.findDrawerWithGravity(this.mAbsGravity);
            if (drawer != null && !this._DrawerLayout_this.isDrawerOpen(drawer)) {
                this._DrawerLayout_this.closeDrawer(drawer);
            }
            return true;
        }
        return false;
    }

    onEdgeDragStarted(edgeFlags:number, pointerId:number):void  {
        let toCapture:View;
        if ((edgeFlags & ViewDragHelper.EDGE_LEFT) == ViewDragHelper.EDGE_LEFT) {
            toCapture = this._DrawerLayout_this.findDrawerWithGravity(Gravity.LEFT);
        } else {
            toCapture = this._DrawerLayout_this.findDrawerWithGravity(Gravity.RIGHT);
        }
        if (toCapture != null && this._DrawerLayout_this.getDrawerLockMode(toCapture) == DrawerLayout.LOCK_MODE_UNLOCKED) {
            this.mDragger.captureChildView(toCapture, pointerId);
        }
    }

    getViewHorizontalDragRange(child:View):number  {
        return child.getWidth();
    }

    clampViewPositionHorizontal(child:View, left:number, dx:number):number  {
        if (this._DrawerLayout_this.checkDrawerViewAbsoluteGravity(child, Gravity.LEFT)) {
            return Math.max(-child.getWidth(), Math.min(left, 0));
        } else {
            const width:number = this._DrawerLayout_this.getWidth();
            return Math.max(width - child.getWidth(), Math.min(left, width));
        }
    }

    clampViewPositionVertical(child:View, top:number, dy:number):number  {
        return child.getTop();
    }
}
export class LayoutParams extends ViewGroup.MarginLayoutParams {

    gravity:number = Gravity.NO_GRAVITY;

    onScreen:number = 0;

    isPeeking:boolean;

    knownOpen:boolean;

    constructor();
    constructor(width:number, height:number);
    constructor(width:number, height:number, gravity:number);
    constructor(source:ViewGroup.LayoutParams);
    constructor(source:ViewGroup.MarginLayoutParams);
    constructor(source:LayoutParams);
    constructor(...args){
        super(...(args.length == 3 ? [args[0], args[1]] : args));//not pass gravity to super

        this._attrBinder.addAttr('gravity', (value)=>{
            this.gravity = this._attrBinder.parseGravity(value, this.gravity);
        });
    }
}
}

}
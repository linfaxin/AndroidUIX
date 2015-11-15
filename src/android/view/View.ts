/**
 * Created by linfaxin on 15/9/27.
 */
///<reference path="../util/SparseArray.ts"/>
///<reference path="../util/Log.ts"/>
///<reference path="../graphics/drawable/Drawable.ts"/>
///<reference path="../graphics/drawable/ColorDrawable.ts"/>
///<reference path="../graphics/drawable/ScrollBarDrawable.ts"/>
///<reference path="../graphics/drawable/InsetDrawable.ts"/>
///<reference path="../graphics/PixelFormat.ts"/>
///<reference path="../graphics/Matrix.ts"/>
///<reference path="../graphics/Color.ts"/>
///<reference path="../graphics/Paint.ts"/>
///<reference path="../../java/lang/StringBuilder.ts"/>
///<reference path="../../java/lang/Runnable.ts"/>
///<reference path="../../java/lang/util/concurrent/CopyOnWriteArrayList.ts"/>
///<reference path="../../java/util/ArrayList.ts"/>
///<reference path="ViewRootImpl.ts"/>
///<reference path="ViewParent.ts"/>
///<reference path="ViewGroup.ts"/>
///<reference path="ViewOverlay.ts"/>
///<reference path="ViewTreeObserver.ts"/>
///<reference path="MotionEvent.ts"/>
///<reference path="TouchDelegate.ts"/>
///<reference path="../os/Handler.ts"/>
///<reference path="../os/SystemClock.ts"/>
///<reference path="../content/res/Resources.ts"/>
///<reference path="../content/res/ColorStateList.ts"/>
///<reference path="../graphics/Rect.ts"/>
///<reference path="../graphics/Canvas.ts"/>
///<reference path="../util/Pools.ts"/>
///<reference path="../util/TypedValue.ts"/>
///<reference path="Gravity.ts"/>
///<reference path="../view/animation/LinearInterpolator.ts"/>
///<reference path="../view/animation/AnimationUtils.ts"/>
///<reference path="../../java/lang/System.ts"/>
///<reference path="../../androidui/attr/StateAttrList.ts"/>
///<reference path="../../androidui/attr/StateAttr.ts"/>
///<reference path="../../androidui/util/ClassFinder.ts"/>
///<reference path="KeyEvent.ts"/>


module android.view {
    import SparseArray = android.util.SparseArray;
    import Drawable = android.graphics.drawable.Drawable;
    import ColorDrawable = android.graphics.drawable.ColorDrawable;
    import ScrollBarDrawable = android.graphics.drawable.ScrollBarDrawable;
    import InsetDrawable = android.graphics.drawable.InsetDrawable;
    import PixelFormat = android.graphics.PixelFormat;
    import Matrix = android.graphics.Matrix;
    import Color = android.graphics.Color;
    import Paint = android.graphics.Paint;
    import StringBuilder = java.lang.StringBuilder;
    import Runnable = java.lang.Runnable;
    import System = java.lang.System;
    //import ViewRootImpl = android.view.ViewRootImpl;
    import ViewParent = android.view.ViewParent;
    import SystemClock = android.os.SystemClock;
    import Handler = android.os.Handler;
    import Log = android.util.Log;
    import Rect = android.graphics.Rect;
    import Point = android.graphics.Point;
    import Canvas = android.graphics.Canvas;
    import CopyOnWriteArrayList = java.lang.util.concurrent.CopyOnWriteArrayList;
    import ArrayList = java.util.ArrayList;
    import OnAttachStateChangeListener = View.OnAttachStateChangeListener;
    import Resources = android.content.res.Resources;
    import ColorStateList = android.content.res.ColorStateList;
    import Pools = android.util.Pools;
    import TypedValue = android.util.TypedValue;
    import LinearInterpolator = android.view.animation.LinearInterpolator;
    import AnimationUtils = android.view.animation.AnimationUtils;
    import StateAttrList = androidui.attr.StateAttrList;
    import StateAttr = androidui.attr.StateAttr;
    import ClassFinder = androidui.util.ClassFinder;
    import KeyEvent = android.view.KeyEvent;


    export class View implements Drawable.Callback, KeyEvent.Callback{
        static get class(){
            let name = this.name;
            return {
                getName():string{
                    return name;
                }
            }
        }
        static DBG = Log.View_DBG;
        static VIEW_LOG_TAG = "View";

        static PFLAG_WANTS_FOCUS                   = 0x00000001;
        static PFLAG_FOCUSED                       = 0x00000002;
        static PFLAG_SELECTED                      = 0x00000004;
        static PFLAG_IS_ROOT_NAMESPACE             = 0x00000008;
        static PFLAG_HAS_BOUNDS                    = 0x00000010;
        static PFLAG_DRAWN                         = 0x00000020;
        static PFLAG_DRAW_ANIMATION                = 0x00000040;
        static PFLAG_SKIP_DRAW                     = 0x00000080;
        static PFLAG_ONLY_DRAWS_BACKGROUND         = 0x00000100;
        static PFLAG_REQUEST_TRANSPARENT_REGIONS   = 0x00000200;
        static PFLAG_DRAWABLE_STATE_DIRTY          = 0x00000400;
        static PFLAG_MEASURED_DIMENSION_SET        = 0x00000800;
        static PFLAG_FORCE_LAYOUT                  = 0x00001000;
        static PFLAG_LAYOUT_REQUIRED               = 0x00002000;
        static PFLAG_PRESSED                       = 0x00004000;
        static PFLAG_DRAWING_CACHE_VALID           = 0x00008000;
        static PFLAG_ANIMATION_STARTED             = 0x00010000;
        static PFLAG_ALPHA_SET                     = 0x00040000;
        static PFLAG_SCROLL_CONTAINER              = 0x00080000;
        static PFLAG_SCROLL_CONTAINER_ADDED        = 0x00100000;
        static PFLAG_DIRTY                         = 0x00200000;
        static PFLAG_DIRTY_OPAQUE                  = 0x00400000;
        static PFLAG_DIRTY_MASK                    = 0x00600000;
        static PFLAG_OPAQUE_BACKGROUND             = 0x00800000;
        static PFLAG_OPAQUE_SCROLLBARS             = 0x01000000;
        static PFLAG_OPAQUE_MASK                   = 0x01800000;
        static PFLAG_PREPRESSED                    = 0x02000000;
        static PFLAG_CANCEL_NEXT_UP_EVENT          = 0x04000000;
        static PFLAG_AWAKEN_SCROLL_BARS_ON_ATTACH  = 0x08000000;
        static PFLAG_HOVERED                       = 0x10000000;
        static PFLAG_PIVOT_EXPLICITLY_SET          = 0x20000000;//TODO may not need
        static PFLAG_ACTIVATED                     = 0x40000000;
        static PFLAG_INVALIDATED                   = 0x80000000;

        static PFLAG2_VIEW_QUICK_REJECTED = 0x10000000;
        static PFLAG2_HAS_TRANSIENT_STATE = 0x80000000;

        static PFLAG3_VIEW_IS_ANIMATING_TRANSFORM = 0x1;
        static PFLAG3_VIEW_IS_ANIMATING_ALPHA = 0x2;
        static PFLAG3_IS_LAID_OUT = 0x4;
        static PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT = 0x8;
        static PFLAG3_CALLED_SUPER = 0x10;

        private static NOT_FOCUSABLE = 0x00000000;
        private static FOCUSABLE = 0x00000001;
        private static FOCUSABLE_MASK = 0x00000001;


        static NO_ID;//undefined
        static OVER_SCROLL_ALWAYS = 0;
        static OVER_SCROLL_IF_CONTENT_SCROLLS = 1;
        static OVER_SCROLL_NEVER = 2;

        static MEASURED_SIZE_MASK                  = 0x00ffffff;
        static MEASURED_STATE_MASK                 = 0xff000000;
        static MEASURED_HEIGHT_STATE_SHIFT         = 16;
        static MEASURED_STATE_TOO_SMALL            = 0x01000000;

        static VISIBILITY_MASK = 0x0000000C;
        static VISIBLE         = 0x00000000;
        static INVISIBLE       = 0x00000004;
        static GONE            = 0x00000008;

        static ENABLED = 0x00000000;
        static DISABLED = 0x00000020;
        static ENABLED_MASK = 0x00000020;
        static WILL_NOT_DRAW = 0x00000080;
        static DRAW_MASK = 0x00000080;

        static SCROLLBARS_NONE = 0x00000000;
        static SCROLLBARS_HORIZONTAL = 0x00000100;
        static SCROLLBARS_VERTICAL = 0x00000200;
        static SCROLLBARS_MASK = 0x00000300;

        static FOCUSABLES_ALL = 0x00000000;
        static FOCUSABLES_TOUCH_MODE = 0x00000001;
        static FOCUS_BACKWARD = 0x00000001;
        static FOCUS_FORWARD = 0x00000002;
        static FOCUS_LEFT = 0x00000011;
        static FOCUS_UP = 0x00000021;
        static FOCUS_RIGHT = 0x00000042;
        static FOCUS_DOWN = 0x00000082;



        /**
         * Base View state sets
         */
        // Singles
        /**
         * Indicates the view has no states set. States are used with
         * {@link android.graphics.drawable.Drawable} to change the drawing of the
         * view depending on its state.
         *
         * @see android.graphics.drawable.Drawable
         * @see #getDrawableState()
         */
        static EMPTY_STATE_SET:number[];

        /**
         * Indicates the view is enabled. States are used with
         * {@link android.graphics.drawable.Drawable} to change the drawing of the
         * view depending on its state.
         *
         * @see android.graphics.drawable.Drawable
         * @see #getDrawableState()
         */
        static ENABLED_STATE_SET:number[];

        /**
         * Indicates the view is focused. States are used with
         * {@link android.graphics.drawable.Drawable} to change the drawing of the
         * view depending on its state.
         *
         * @see android.graphics.drawable.Drawable
         * @see #getDrawableState()
         */
        static FOCUSED_STATE_SET:number[];

        /**
         * Indicates the view is selected. States are used with
         * {@link android.graphics.drawable.Drawable} to change the drawing of the
         * view depending on its state.
         *
         * @see android.graphics.drawable.Drawable
         * @see #getDrawableState()
         */
        static SELECTED_STATE_SET:number[];

        /**
         * Indicates the view is pressed. States are used with
         * {@link android.graphics.drawable.Drawable} to change the drawing of the
         * view depending on its state.
         *
         * @see android.graphics.drawable.Drawable
         * @see #getDrawableState()
         */
        static PRESSED_STATE_SET:number[];

        /**
         * Indicates the view's window has focus. States are used with
         * {@link android.graphics.drawable.Drawable} to change the drawing of the
         * view depending on its state.
         *
         * @see android.graphics.drawable.Drawable
         * @see #getDrawableState()
         */
        static WINDOW_FOCUSED_STATE_SET:number[];

        // Doubles
        /**
         * Indicates the view is enabled and has the focus.
         *
         * @see #ENABLED_STATE_SET
         * @see #FOCUSED_STATE_SET
         */
        static ENABLED_FOCUSED_STATE_SET:number[];

        /**
         * Indicates the view is enabled and selected.
         *
         * @see #ENABLED_STATE_SET
         * @see #SELECTED_STATE_SET
         */
        static ENABLED_SELECTED_STATE_SET:number[];

        /**
         * Indicates the view is enabled and that its window has focus.
         *
         * @see #ENABLED_STATE_SET
         * @see #WINDOW_FOCUSED_STATE_SET
         */
        static ENABLED_WINDOW_FOCUSED_STATE_SET:number[];

        /**
         * Indicates the view is focused and selected.
         *
         * @see #FOCUSED_STATE_SET
         * @see #SELECTED_STATE_SET
         */
        static FOCUSED_SELECTED_STATE_SET:number[];

        /**
         * Indicates the view has the focus and that its window has the focus.
         *
         * @see #FOCUSED_STATE_SET
         * @see #WINDOW_FOCUSED_STATE_SET
         */
        static FOCUSED_WINDOW_FOCUSED_STATE_SET:number[];

        /**
         * Indicates the view is selected and that its window has the focus.
         *
         * @see #SELECTED_STATE_SET
         * @see #WINDOW_FOCUSED_STATE_SET
         */
        static SELECTED_WINDOW_FOCUSED_STATE_SET:number[];

        // Triples
        /**
         * Indicates the view is enabled, focused and selected.
         *
         * @see #ENABLED_STATE_SET
         * @see #FOCUSED_STATE_SET
         * @see #SELECTED_STATE_SET
         */
        static ENABLED_FOCUSED_SELECTED_STATE_SET:number[];

        /**
         * Indicates the view is enabled, focused and its window has the focus.
         *
         * @see #ENABLED_STATE_SET
         * @see #FOCUSED_STATE_SET
         * @see #WINDOW_FOCUSED_STATE_SET
         */
        static ENABLED_FOCUSED_WINDOW_FOCUSED_STATE_SET:number[];

        /**
         * Indicates the view is enabled, selected and its window has the focus.
         *
         * @see #ENABLED_STATE_SET
         * @see #SELECTED_STATE_SET
         * @see #WINDOW_FOCUSED_STATE_SET
         */
        static ENABLED_SELECTED_WINDOW_FOCUSED_STATE_SET:number[];

        /**
         * Indicates the view is focused, selected and its window has the focus.
         *
         * @see #FOCUSED_STATE_SET
         * @see #SELECTED_STATE_SET
         * @see #WINDOW_FOCUSED_STATE_SET
         */
        static FOCUSED_SELECTED_WINDOW_FOCUSED_STATE_SET:number[];

        /**
         * Indicates the view is enabled, focused, selected and its window
         * has the focus.
         *
         * @see #ENABLED_STATE_SET
         * @see #FOCUSED_STATE_SET
         * @see #SELECTED_STATE_SET
         * @see #WINDOW_FOCUSED_STATE_SET
         */
        static ENABLED_FOCUSED_SELECTED_WINDOW_FOCUSED_STATE_SET:number[];

        /**
         * Indicates the view is pressed and its window has the focus.
         *
         * @see #PRESSED_STATE_SET
         * @see #WINDOW_FOCUSED_STATE_SET
         */
        static PRESSED_WINDOW_FOCUSED_STATE_SET:number[];

        /**
         * Indicates the view is pressed and selected.
         *
         * @see #PRESSED_STATE_SET
         * @see #SELECTED_STATE_SET
         */
        static PRESSED_SELECTED_STATE_SET:number[];

        /**
         * Indicates the view is pressed, selected and its window has the focus.
         *
         * @see #PRESSED_STATE_SET
         * @see #SELECTED_STATE_SET
         * @see #WINDOW_FOCUSED_STATE_SET
         */
        static PRESSED_SELECTED_WINDOW_FOCUSED_STATE_SET:number[];

        /**
         * Indicates the view is pressed and focused.
         *
         * @see #PRESSED_STATE_SET
         * @see #FOCUSED_STATE_SET
         */
        static PRESSED_FOCUSED_STATE_SET:number[];

        /**
         * Indicates the view is pressed, focused and its window has the focus.
         *
         * @see #PRESSED_STATE_SET
         * @see #FOCUSED_STATE_SET
         * @see #WINDOW_FOCUSED_STATE_SET
         */
        static PRESSED_FOCUSED_WINDOW_FOCUSED_STATE_SET:number[];

        /**
         * Indicates the view is pressed, focused and selected.
         *
         * @see #PRESSED_STATE_SET
         * @see #SELECTED_STATE_SET
         * @see #FOCUSED_STATE_SET
         */
        static PRESSED_FOCUSED_SELECTED_STATE_SET:number[];

        /**
         * Indicates the view is pressed, focused, selected and its window has the focus.
         *
         * @see #PRESSED_STATE_SET
         * @see #FOCUSED_STATE_SET
         * @see #SELECTED_STATE_SET
         * @see #WINDOW_FOCUSED_STATE_SET
         */
        static PRESSED_FOCUSED_SELECTED_WINDOW_FOCUSED_STATE_SET:number[];

        /**
         * Indicates the view is pressed and enabled.
         *
         * @see #PRESSED_STATE_SET
         * @see #ENABLED_STATE_SET
         */
        static PRESSED_ENABLED_STATE_SET:number[];

        /**
         * Indicates the view is pressed, enabled and its window has the focus.
         *
         * @see #PRESSED_STATE_SET
         * @see #ENABLED_STATE_SET
         * @see #WINDOW_FOCUSED_STATE_SET
         */
        static PRESSED_ENABLED_WINDOW_FOCUSED_STATE_SET:number[];

        /**
         * Indicates the view is pressed, enabled and selected.
         *
         * @see #PRESSED_STATE_SET
         * @see #ENABLED_STATE_SET
         * @see #SELECTED_STATE_SET
         */
        static PRESSED_ENABLED_SELECTED_STATE_SET:number[];

        /**
         * Indicates the view is pressed, enabled, selected and its window has the
         * focus.
         *
         * @see #PRESSED_STATE_SET
         * @see #ENABLED_STATE_SET
         * @see #SELECTED_STATE_SET
         * @see #WINDOW_FOCUSED_STATE_SET
         */
        static PRESSED_ENABLED_SELECTED_WINDOW_FOCUSED_STATE_SET:number[];

        /**
         * Indicates the view is pressed, enabled and focused.
         *
         * @see #PRESSED_STATE_SET
         * @see #ENABLED_STATE_SET
         * @see #FOCUSED_STATE_SET
         */
        static PRESSED_ENABLED_FOCUSED_STATE_SET:number[];

        /**
         * Indicates the view is pressed, enabled, focused and its window has the
         * focus.
         *
         * @see #PRESSED_STATE_SET
         * @see #ENABLED_STATE_SET
         * @see #FOCUSED_STATE_SET
         * @see #WINDOW_FOCUSED_STATE_SET
         */
        static PRESSED_ENABLED_FOCUSED_WINDOW_FOCUSED_STATE_SET:number[];

        /**
         * Indicates the view is pressed, enabled, focused and selected.
         *
         * @see #PRESSED_STATE_SET
         * @see #ENABLED_STATE_SET
         * @see #SELECTED_STATE_SET
         * @see #FOCUSED_STATE_SET
         */
        static PRESSED_ENABLED_FOCUSED_SELECTED_STATE_SET:number[];

        /**
         * Indicates the view is pressed, enabled, focused, selected and its window
         * has the focus.
         *
         * @see #PRESSED_STATE_SET
         * @see #ENABLED_STATE_SET
         * @see #SELECTED_STATE_SET
         * @see #FOCUSED_STATE_SET
         * @see #WINDOW_FOCUSED_STATE_SET
         */
        static PRESSED_ENABLED_FOCUSED_SELECTED_WINDOW_FOCUSED_STATE_SET:number[];

        static VIEW_STATE_SETS:Array<Array<number>>;
        static VIEW_STATE_WINDOW_FOCUSED = 1;
        static VIEW_STATE_SELECTED = 1 << 1;
        static VIEW_STATE_FOCUSED = 1 << 2;
        static VIEW_STATE_ENABLED = 1 << 3;
        static VIEW_STATE_DISABLE = -View.VIEW_STATE_ENABLED;//can defined state style as state_disable
        static VIEW_STATE_PRESSED = 1 << 4;
        static VIEW_STATE_ACTIVATED = 1 << 5;
        //static VIEW_STATE_ACCELERATED = 1 << 6;
        static VIEW_STATE_HOVERED = 1 << 7;
        //static VIEW_STATE_DRAG_CAN_ACCEPT = 1 << 8;
        //static VIEW_STATE_DRAG_HOVERED = 1 << 9;
        //android default use attr id, there use state value as id
        static VIEW_STATE_IDS = [
            View.VIEW_STATE_WINDOW_FOCUSED,    View.VIEW_STATE_WINDOW_FOCUSED,
            View.VIEW_STATE_SELECTED,          View.VIEW_STATE_SELECTED,
            View.VIEW_STATE_FOCUSED,           View.VIEW_STATE_FOCUSED,
            View.VIEW_STATE_ENABLED,           View.VIEW_STATE_ENABLED,
            View.VIEW_STATE_PRESSED,           View.VIEW_STATE_PRESSED,
            View.VIEW_STATE_ACTIVATED,         View.VIEW_STATE_ACTIVATED,
            //View.VIEW_STATE_ACCELERATED,       View.VIEW_STATE_ACCELERATED,
            View.VIEW_STATE_HOVERED,           View.VIEW_STATE_HOVERED,
            //View.VIEW_STATE_DRAG_CAN_ACCEPT,   View.VIEW_STATE_DRAG_CAN_ACCEPT,
            //View.VIEW_STATE_DRAG_HOVERED,      View.VIEW_STATE_DRAG_HOVERED
        ];
        private static _static = (()=>{
            function Integer_bitCount(i):number{
                // HD, Figure 5-2
                i = i - ((i >>> 1) & 0x55555555);
                i = (i & 0x33333333) + ((i >>> 2) & 0x33333333);
                i = (i + (i >>> 4)) & 0x0f0f0f0f;
                i = i + (i >>> 8);
                i = i + (i >>> 16);
                return i & 0x3f;
            }

            let orderedIds = View.VIEW_STATE_IDS;
            const NUM_BITS = View.VIEW_STATE_IDS.length / 2;
            View.VIEW_STATE_SETS = new Array<Array<number>>(1 << NUM_BITS);
            for (let i = 0; i < View.VIEW_STATE_SETS.length; i++) {
                let numBits = Integer_bitCount(i);
                const stataSet = new Array<number>(numBits);
                let pos = 0;
                for (let j = 0; j < orderedIds.length; j += 2) {
                    if ((i & orderedIds[j+1]) != 0) {
                        stataSet[pos++] = orderedIds[j];
                    }
                }
                View.VIEW_STATE_SETS[i] = stataSet;
            }
            View.EMPTY_STATE_SET = View.VIEW_STATE_SETS[0];
            View.WINDOW_FOCUSED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_WINDOW_FOCUSED];
            View.SELECTED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_SELECTED];
            View.SELECTED_WINDOW_FOCUSED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_WINDOW_FOCUSED | View.VIEW_STATE_SELECTED];
            View.FOCUSED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_FOCUSED];
            View.FOCUSED_WINDOW_FOCUSED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_WINDOW_FOCUSED | View.VIEW_STATE_FOCUSED];
            View.FOCUSED_SELECTED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_SELECTED | View.VIEW_STATE_FOCUSED];
            View.FOCUSED_SELECTED_WINDOW_FOCUSED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_WINDOW_FOCUSED | View.VIEW_STATE_SELECTED | View.VIEW_STATE_FOCUSED];
            View.ENABLED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_ENABLED];
            View.ENABLED_WINDOW_FOCUSED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_WINDOW_FOCUSED | View.VIEW_STATE_ENABLED];
            View.ENABLED_SELECTED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_SELECTED | View.VIEW_STATE_ENABLED];
            View.ENABLED_SELECTED_WINDOW_FOCUSED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_WINDOW_FOCUSED | View.VIEW_STATE_SELECTED | View.VIEW_STATE_ENABLED];
            View.ENABLED_FOCUSED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_FOCUSED | View.VIEW_STATE_ENABLED];
            View.ENABLED_FOCUSED_WINDOW_FOCUSED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_WINDOW_FOCUSED | View.VIEW_STATE_FOCUSED | View.VIEW_STATE_ENABLED];
            View.ENABLED_FOCUSED_SELECTED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_SELECTED | View.VIEW_STATE_FOCUSED | View.VIEW_STATE_ENABLED];
            View.ENABLED_FOCUSED_SELECTED_WINDOW_FOCUSED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_WINDOW_FOCUSED | View.VIEW_STATE_SELECTED | View.VIEW_STATE_FOCUSED | View.VIEW_STATE_ENABLED];
            View.PRESSED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_PRESSED];
            View.PRESSED_WINDOW_FOCUSED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_WINDOW_FOCUSED | View.VIEW_STATE_PRESSED];
            View.PRESSED_SELECTED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_SELECTED | View.VIEW_STATE_PRESSED];
            View.PRESSED_SELECTED_WINDOW_FOCUSED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_WINDOW_FOCUSED | View.VIEW_STATE_SELECTED | View.VIEW_STATE_PRESSED];
            View.PRESSED_FOCUSED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_FOCUSED | View.VIEW_STATE_PRESSED];
            View.PRESSED_FOCUSED_WINDOW_FOCUSED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_WINDOW_FOCUSED | View.VIEW_STATE_FOCUSED | View.VIEW_STATE_PRESSED];
            View.PRESSED_FOCUSED_SELECTED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_SELECTED | View.VIEW_STATE_FOCUSED | View.VIEW_STATE_PRESSED];
            View.PRESSED_FOCUSED_SELECTED_WINDOW_FOCUSED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_WINDOW_FOCUSED | View.VIEW_STATE_SELECTED | View.VIEW_STATE_FOCUSED | View.VIEW_STATE_PRESSED];
            View.PRESSED_ENABLED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_ENABLED | View.VIEW_STATE_PRESSED];
            View.PRESSED_ENABLED_WINDOW_FOCUSED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_WINDOW_FOCUSED | View.VIEW_STATE_ENABLED | View.VIEW_STATE_PRESSED];
            View.PRESSED_ENABLED_SELECTED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_SELECTED | View.VIEW_STATE_ENABLED | View.VIEW_STATE_PRESSED];
            View.PRESSED_ENABLED_SELECTED_WINDOW_FOCUSED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_WINDOW_FOCUSED | View.VIEW_STATE_SELECTED | View.VIEW_STATE_ENABLED | View.VIEW_STATE_PRESSED];
            View.PRESSED_ENABLED_FOCUSED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_FOCUSED | View.VIEW_STATE_ENABLED | View.VIEW_STATE_PRESSED];
            View.PRESSED_ENABLED_FOCUSED_WINDOW_FOCUSED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_WINDOW_FOCUSED | View.VIEW_STATE_FOCUSED | View.VIEW_STATE_ENABLED | View.VIEW_STATE_PRESSED];
            View.PRESSED_ENABLED_FOCUSED_SELECTED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_SELECTED | View.VIEW_STATE_FOCUSED | View.VIEW_STATE_ENABLED | View.VIEW_STATE_PRESSED];
            View.PRESSED_ENABLED_FOCUSED_SELECTED_WINDOW_FOCUSED_STATE_SET = View.VIEW_STATE_SETS[View.VIEW_STATE_WINDOW_FOCUSED | View.VIEW_STATE_SELECTED | View.VIEW_STATE_FOCUSED | View.VIEW_STATE_ENABLED | View.VIEW_STATE_PRESSED];
        })();

        static CLICKABLE = 0x00004000;
        static DRAWING_CACHE_ENABLED = 0x00008000;
        static WILL_NOT_CACHE_DRAWING = 0x000020000;
        private static FOCUSABLE_IN_TOUCH_MODE = 0x00040000;
        static LONG_CLICKABLE = 0x00200000;
        static DUPLICATE_PARENT_STATE = 0x00400000;

        static LAYER_TYPE_NONE = 0;
        static LAYER_TYPE_SOFTWARE = 1;

        get mID():string{
            if(this._bindElement){
                let id = this._bindElement.id;
                return id ? id : null;
            }
            return null;
        }
        mPrivateFlags = 0;
        private mPrivateFlags2 = 0;
        private mPrivateFlags3 = 0;
        private mOldWidthMeasureSpec = Number.MIN_SAFE_INTEGER;
        private mOldHeightMeasureSpec = Number.MIN_SAFE_INTEGER;
        private mMeasuredWidth = 0;
        private mMeasuredHeight = 0;
        private mBackground:Drawable;
        private mBackgroundSizeChanged=false;
        private mScrollCache:ScrollabilityCache;
        private mDrawableState:Array<number>;

        private mNextFocusLeftId:string;
        private mNextFocusRightId:string;
        private mNextFocusUpId:string;
        private mNextFocusDownId:string;
        mNextFocusForwardId:string;

        private mPendingCheckForLongPress:CheckForLongPress;
        private mPendingCheckForTap:CheckForTap;
        private mPerformClick:PerformClick;
        private mUnsetPressedState:UnsetPressedState;
        private mHasPerformedLongPress = false;
        mMinWidth = 0;
        mMinHeight = 0;
        private mTouchDelegate : TouchDelegate;
        private mFloatingTreeObserver : ViewTreeObserver;
        /**
         * Solid color to use as a background when creating the drawing cache. Enables
         * the cache to use 16 bit bitmaps instead of 32 bit.
         */
        private mDrawingCacheBackgroundColor = 0;
        mTouchSlop = 0;
        private mVerticalScrollFactor = 0;
        private mOverScrollMode = 0;
        mParent:ViewParent;
        private mMeasureCache:SparseArray<number>;
        mAttachInfo:View.AttachInfo;
        mLayoutParams:ViewGroup.LayoutParams;
        mViewFlags=0;

        mLayerType = View.LAYER_TYPE_NONE;

        mCachingFailed = false;


        private mOverlay:ViewOverlay;
        private mWindowAttachCount=0;
        private mTransientStateCount = 0;
        private mListenerInfo:View.ListenerInfo;

        private mClipBounds:Rect;
        private mLastIsOpaque = false;
        private mMatchIdPredicate : MatchIdPredicate;

        private _mLeft = 0;
        private _mRight = 0;
        private _mTop = 0;
        private _mBottom = 0;
        get mLeft():number{return this._mLeft;}
        set mLeft(value:number){this._mLeft = Math.floor(value);}
        get mRight():number{return this._mRight;}
        set mRight(value:number){this._mRight = Math.floor(value);}
        get mTop():number{return this._mTop;}
        set mTop(value:number){this._mTop = Math.floor(value);}
        get mBottom():number{return this._mBottom;}
        set mBottom(value:number){this._mBottom = Math.floor(value);}

        private _mScrollX = 0;
        private _mScrollY = 0;
        get mScrollX():number{return this._mScrollX;}
        set mScrollX(value:number){this._mScrollX = Math.floor(value);}
        get mScrollY():number{return this._mScrollY;}
        set mScrollY(value:number){this._mScrollY = Math.floor(value);}



        mPaddingLeft = 0;
        mPaddingRight = 0;
        mPaddingTop = 0;
        mPaddingBottom = 0;

        constructor(){
            this.mTouchSlop = ViewConfiguration.get().getScaledTouchSlop();
            this.setOverScrollMode(View.OVER_SCROLL_IF_CONTENT_SCROLLS);
        }

        //parse xml attr & callback when xml attr change
        createAttrChangeHandler(mergeHandler:View.AttrChangeHandler):void{
            let view = this;
            mergeHandler.add({
                set background(value){
                    let bg = mergeHandler.parseDrawable(value);
                    view.setBackground(bg);
                },
                get background():any{
                    if(view.mBackground instanceof ColorDrawable){
                        return Color.toRGBA((<ColorDrawable>view.mBackground).getColor());
                    }
                    return view.mBackground;
                },
                set padding(value){
                    let [left, top, right, bottom] = View.AttrChangeHandler.parsePaddingMarginLTRB(value);
                    view._setPaddingWithUnit(left, top, right, bottom);
                },
                get padding(){
                    return view.mPaddingTop + ' ' + view.mPaddingRight + ' ' + view.mPaddingBottom + ' ' + view.mPaddingLeft;
                },
                set paddingLeft(value){
                    view._setPaddingWithUnit(value, view.mPaddingTop, view.mPaddingRight, view.mPaddingBottom);
                },
                get paddingLeft(){
                    return view.mPaddingLeft;
                },
                set paddingTop(value){
                    view._setPaddingWithUnit(view.mPaddingLeft, value, view.mPaddingRight, view.mPaddingBottom);
                },
                get paddingTop(){
                    return view.mPaddingTop;
                },
                set paddingRight(value){
                    view._setPaddingWithUnit(view.mPaddingLeft, view.mPaddingTop, value, view.mPaddingBottom);
                },
                get paddingRight(){
                    return view.mPaddingRight;
                },
                set paddingBottom(value){
                    view._setPaddingWithUnit(view.mPaddingLeft, view.mPaddingTop, view.mPaddingRight, value);
                },
                get paddingBottom(){
                    return view.mPaddingBottom;
                },
                set scrollX(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) view.scrollTo(value, view.mScrollY);
                },
                set scrollY(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) view.scrollTo(view.mScrollX, value);
                },
                set alpha(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) {//TODO
                    };
                },
                set transformPivotX(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) {//TODO
                    };
                },
                set transformPivotY(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) {//TODO
                    };
                },
                set translationX(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) {//TODO
                    };
                },
                set translationY(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) {//TODO
                    };
                },
                set rotation(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) {//TODO
                    };
                },
                set rotationX(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) {//TODO
                    };
                },
                set rotationY(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) {//TODO
                    };
                },
                set scaleX(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) {//TODO
                    };
                },
                set scaleY(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) {//TODO
                    };
                },
                set tag(value){
                },
                set id(value){
                    view.setId(value);
                },
                set focusable(value){
                    if(View.AttrChangeHandler.parseBoolean(value, false)){
                        view.setFlags(View.FOCUSABLE, View.FOCUSABLE_MASK);
                    }
                },
                set focusableInTouchMode(value){
                    if(View.AttrChangeHandler.parseBoolean(value, false)){
                        view.setFlags(View.FOCUSABLE_IN_TOUCH_MODE | View.FOCUSABLE,
                            View.FOCUSABLE_IN_TOUCH_MODE | View.FOCUSABLE_MASK);
                    }
                },
                set clickable(value){
                    if(View.AttrChangeHandler.parseBoolean(value, false)){
                        view.setFlags(View.CLICKABLE, View.CLICKABLE);
                    }
                },
                set longClickable(value){
                    if(View.AttrChangeHandler.parseBoolean(value, false)){
                        view.setFlags(View.LONG_CLICKABLE, View.LONG_CLICKABLE);
                    }
                },
                set saveEnabled(value){
                    if(View.AttrChangeHandler.parseBoolean(value, false)){
                        //view.setFlags(View.SAVE_DISABLED, View.SAVE_DISABLED_MASK);
                    }
                },
                set duplicateParentState(value){
                    if(View.AttrChangeHandler.parseBoolean(value, false)){
                        view.setFlags(View.DUPLICATE_PARENT_STATE, View.DUPLICATE_PARENT_STATE);
                    }
                },
                set visibility(value){
                    if(value === 'gone') view.setVisibility(View.GONE);
                    else if(value === 'invisible') view.setVisibility(View.INVISIBLE);
                    else if(value === 'visible') view.setVisibility(View.VISIBLE);
                },
                set scrollbars(value){
                    if(value==='none') {
                        view.setHorizontalScrollBarEnabled(false);
                        view.setVerticalScrollBarEnabled(false);
                    }
                },
                set isScrollContainer(value){
                    if(View.AttrChangeHandler.parseBoolean(value, false)){
                        this.setScrollContainer(true);
                    }
                },
                set minWidth(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) view.setMinimumWidth(value);
                },
                get minWidth():any{
                    return view.mMinWidth;
                },
                set minHeight(value){
                    view.mMinHeight = value;
                },
                get minHeight():any{
                    return view.mMinHeight;
                },
                set onClick(value){
                    view.setOnClickListener({
                        onClick(v:View){
                            let activity = view.getViewRootImpl().rootElement;
                            if(activity && typeof activity[value] === 'function'){
                                activity[value].call(activity, v);
                            }
                        }
                    });
                },
                set overScrollMode(value){
                    let scrollMode = View[('OVER_SCROLL_'+value).toUpperCase()];
                    if(scrollMode===undefined) scrollMode = View.OVER_SCROLL_IF_CONTENT_SCROLLS;
                    view.setOverScrollMode(scrollMode);
                },
                set layerType(value){

                },
            });
            mergeHandler.isCallSuper = true;
        }

        getWidth():number {
            return this.mRight - this.mLeft;
        }
        getHeight():number {
            return this.mBottom - this.mTop;
        }
        getTop():number {
            return this.mTop;
        }
        setTop(top:number){
            if (top != this.mTop) {
                if (this.mAttachInfo != null) {
                    let minTop;
                    let yLoc;
                    if (top < this.mTop) {
                        minTop = top;
                        yLoc = top - this.mTop;
                    } else {
                        minTop = this.mTop;
                        yLoc = 0;
                    }
                    this.invalidate(0, yLoc, this.mRight - this.mLeft, this.mBottom - minTop);
                }

                let width = this.mRight - this.mLeft;
                let oldHeight = this.mBottom - this.mTop;

                this.mTop = top;

                this.sizeChange(width, this.mBottom - this.mTop, width, oldHeight);

                this.mBackgroundSizeChanged = true;
            }
        }
        getBottom():number {
            return this.mBottom;
        }
        setBottom(bottom:number){
            if (bottom != this.mBottom) {
                if (this.mAttachInfo != null) {
                    let maxBottom;
                    if (bottom < this.mBottom) {
                        maxBottom = this.mBottom;
                    } else {
                        maxBottom = bottom;
                    }
                    this.invalidate(0, 0, this.mRight - this.mLeft, maxBottom - this.mTop);
                }

                let width = this.mRight - this.mLeft;
                let oldHeight = this.mBottom - this.mTop;

                this.mBottom = bottom;

                this.sizeChange(width, this.mBottom - this.mTop, width, oldHeight);

                this.mBackgroundSizeChanged = true;
            }
        }
        getLeft():number {
            return this.mLeft;
        }
        setLeft(left:number){
            if (left != this.mLeft) {
                if (this.mAttachInfo != null) {
                    let minLeft;
                    let xLoc;
                    if (left < this.mLeft) {
                        minLeft = left;
                        xLoc = left - this.mLeft;
                    } else {
                        minLeft = this.mLeft;
                        xLoc = 0;
                    }
                    this.invalidate(xLoc, 0, this.mRight - minLeft, this.mBottom - this.mTop);
                }

                let oldWidth = this.mRight - this.mLeft;
                let height = this.mBottom - this.mTop;

                this.mLeft = left;

                this.sizeChange(this.mRight - this.mLeft, height, oldWidth, height);

                this.mBackgroundSizeChanged = true;
            }
        }
        getRight():number {
            return this.mRight;
        }
        setRight(right:number){
            if (right != this.mRight) {
                if (this.mAttachInfo != null) {
                    let maxRight;
                    if (right < this.mRight) {
                        maxRight = this.mRight;
                    } else {
                        maxRight = right;
                    }
                    this.invalidate(0, 0, maxRight - this.mLeft, this.mBottom - this.mTop);
                }

                let oldWidth = this.mRight - this.mLeft;
                let height = this.mBottom - this.mTop;

                this.mRight = right;

                this.sizeChange(this.mRight - this.mLeft, height, oldWidth, height);

                this.mBackgroundSizeChanged = true;
            }
        }
        getPaddingLeft():number{
            return this.mPaddingLeft;
        }
        getPaddingTop():number{
            return this.mPaddingTop;
        }
        getPaddingRight():number{
            return this.mPaddingRight;
        }
        getPaddingBottom():number{
            return this.mPaddingBottom;
        }
        setPaddingLeft(left:number):void{
            if (this.mPaddingLeft != left) {
                this.mPaddingLeft = left;
                this.requestLayout();
            }
        }
        setPaddingTop(top:number):void{
            if (this.mPaddingTop != top) {
                this.mPaddingTop = top;
                this.requestLayout();
            }
        }
        setPaddingRight(right:number):void{
            if (this.mPaddingRight != right) {
                this.mPaddingRight = right;
                this.requestLayout();
            }
        }
        setPaddingBottom(bottom:number):void{
            if (this.mPaddingBottom != bottom) {
                this.mPaddingBottom = bottom;
                this.requestLayout();
            }
        }
        setPadding(left:number, top:number, right:number, bottom:number){
            let changed = false;

            if (this.mPaddingLeft != left) {
                changed = true;
                this.mPaddingLeft = left;
            }
            if (this.mPaddingTop != top) {
                changed = true;
                this.mPaddingTop = top;
            }
            if (this.mPaddingRight != right) {
                changed = true;
                this.mPaddingRight = right;
            }
            if (this.mPaddingBottom != bottom) {
                changed = true;
                this.mPaddingBottom = bottom;
            }
            if (changed) {
                this.requestLayout();
            }
        }

        private _setPaddingWithUnit(left, top, right, bottom){
            let view = this;
            let dm = Resources.getDisplayMetrics();
            let width = view.getWidth();
            let height = view.getHeight();
            let padLeft = TypedValue.complexToDimensionPixelSize(left, width, dm);
            let padTop = TypedValue.complexToDimensionPixelSize(top, height, dm);
            let padRight = TypedValue.complexToDimensionPixelSize(right, width, dm);
            let padBottom = TypedValue.complexToDimensionPixelSize(bottom, height, dm);
            view.setPadding(padLeft, padTop, padRight, padBottom);

            //FRACTION unit should layout again
            let unit = TypedValue.COMPLEX_UNIT_FRACTION;
            if( (typeof left === 'string' && left.endsWith(unit)) || (typeof top === 'string' && top.endsWith(unit))
                || (typeof right === 'string' && right.endsWith(unit)) || (typeof bottom === 'string' && bottom.endsWith(unit))){
                view.post({
                    run:()=>{
                        let width = view.getWidth();
                        let height = view.getHeight();
                        let padLeftN = TypedValue.complexToDimensionPixelSize(left, width, dm);
                        let padTopN = TypedValue.complexToDimensionPixelSize(top, height, dm);
                        let padRightN = TypedValue.complexToDimensionPixelSize(right, width, dm);
                        let padBottomN = TypedValue.complexToDimensionPixelSize(bottom, height, dm);
                        view.setPadding(padLeftN, padTopN, padRightN, padBottomN);
                    }
                });
            }
        }

        setScrollX(value:number) {
            this.scrollTo(value, this.mScrollY);
        }
        setScrollY(value:number) {
            this.scrollTo(this.mScrollX, value);
        }
        getScrollX():number {
            return this.mScrollX;
        }
        getScrollY():number {
            return this.mScrollY;
        }
        getFinalAlpha():number {
            return 1;//TODO alpha
        }

        /**
         * Offset this view's vertical location by the specified number of pixels.
         *
         * @param offset the number of pixels to offset the view by
         */
        offsetTopAndBottom(offset:number):void {
            if (offset != 0) {
                this.updateMatrix();
                const matrixIsIdentity = true;
                //TODO when Transformation ok
                // matrixIsIdentity = this.mTransformationInfo == null || this.mTransformationInfo.mMatrixIsIdentity;

                if (matrixIsIdentity) {
//                if (mDisplayList != null) {
//                    invalidateViewProperty(false, false);
//                } else {
                    const p = this.mParent;
                    if (p != null && this.mAttachInfo != null) {
                        const r = this.mAttachInfo.mTmpInvalRect;
                        let minTop;
                        let maxBottom;
                        let yLoc;
                        if (offset < 0) {
                            minTop = this.mTop + offset;
                            maxBottom = this.mBottom;
                            yLoc = offset;
                        } else {
                            minTop = this.mTop;
                            maxBottom = this.mBottom + offset;
                            yLoc = 0;
                        }
                        r.set(0, yLoc, this.mRight - this.mLeft, maxBottom - minTop);
                        p.invalidateChild(this, r);
                    }
//                }
                } else {
                    this.invalidateViewProperty(false, false);
                }

                this.mTop += offset;
                this.mBottom += offset;
//            if (mDisplayList != null) {
//                mDisplayList.offsetTopAndBottom(offset);
//                invalidateViewProperty(false, false);
//            } else {
                if (!matrixIsIdentity) {
                    this.invalidateViewProperty(false, true);
                }
                this.invalidateParentIfNeeded();
//            }
            }
        }

        /**
         * Offset this view's horizontal location by the specified amount of pixels.
         *
         * @param offset the number of pixels to offset the view by
         */
        offsetLeftAndRight(offset:number) {
            if (offset != 0) {
                this.updateMatrix();
                const matrixIsIdentity = true;
                //TODO when Transformation ok
                // matrixIsIdentity = this.mTransformationInfo == null || this.mTransformationInfo.mMatrixIsIdentity;

                if (matrixIsIdentity) {
//                if (mDisplayList != null) {
//                    invalidateViewProperty(false, false);
//                } else {
                    const p = this.mParent;
                    if (p != null && this.mAttachInfo != null) {
                        const r = this.mAttachInfo.mTmpInvalRect;
                        let minLeft;
                        let maxRight;
                        if (offset < 0) {
                            minLeft = this.mLeft + offset;
                            maxRight = this.mRight;
                        } else {
                            minLeft = this.mLeft;
                            maxRight = this.mRight + offset;
                        }
                        r.set(0, 0, maxRight - minLeft, this.mBottom - this.mTop);
                        p.invalidateChild(this, r);
                    }
//                }
                } else {
                    this.invalidateViewProperty(false, false);
                }

                this.mLeft += offset;
                this.mRight += offset;
//            if (mDisplayList != null) {
//                mDisplayList.offsetLeftAndRight(offset);
//                invalidateViewProperty(false, false);
//            } else {
                if (!matrixIsIdentity) {
                    this.invalidateViewProperty(false, true);
                }
                this.invalidateParentIfNeeded();
//            }
            }
        }


        setAlpha(alpha:number) {
            alpha &= 0xFF;          // keep it legal
            //TODO set to Transformation
            this.bindElement.style.opacity = alpha / 255 + '';
        }


        private updateMatrix() {
            //TODO transform
        }
        getMatrix():Matrix {
            //if (mTransformationInfo != null) {
            //    updateMatrix();
            //    return mTransformationInfo.mMatrix;
            //}
            return Matrix.IDENTITY_MATRIX;
        }
        hasIdentityMatrix(){
            //TODO transform
            //if (mTransformationInfo != null) {
            //    updateMatrix();
            //    return mTransformationInfo.mMatrixIsIdentity;
            //}
            return true;
        }
        transformRect(rect:Rect){
            if (!this.getMatrix().isIdentity()) {
                let boundingRect = this.mAttachInfo.mTmpTransformRect;
                boundingRect.set(rect);
                this.getMatrix().mapRect(boundingRect);
                rect.set(boundingRect);
            }
        }

        pointInView(localX:number, localY:number, slop=0):boolean {
            return localX >= -slop && localY >= -slop && localX < ((this.mRight - this.mLeft) + slop) &&
            localY < ((this.mBottom - this.mTop) + slop);
        }

        getHandler():Handler {
            let attachInfo = this.mAttachInfo;
            if (attachInfo != null) {
                return attachInfo.mHandler;
            }
            return null;
        }
        getViewRootImpl():ViewRootImpl{
            if (this.mAttachInfo != null) {
                return this.mAttachInfo.mViewRootImpl;
            }
            return null;
        }
        post(action:Runnable):boolean {
            let attachInfo = this.mAttachInfo;
            if (attachInfo != null) {
                return attachInfo.mHandler.post(action);
            }
            // Assume that post will succeed later
            ViewRootImpl.getRunQueue().post(action);
            return true;
        }
        postDelayed(action:Runnable, delayMillis:number):boolean {
            let attachInfo = this.mAttachInfo;
            if (attachInfo != null) {
                return attachInfo.mHandler.postDelayed(action, delayMillis);
            }
            // Assume that post will succeed later
            ViewRootImpl.getRunQueue().postDelayed(action, delayMillis);
            return true;
        }
        postOnAnimation(action:Runnable):boolean {
            return this.post(action);
        }
        postOnAnimationDelayed(action:Runnable, delayMillis:number):boolean {
            return this.postDelayed(action, delayMillis);
        }
        removeCallbacks(action:Runnable):boolean {
            if (action != null) {
                let attachInfo = this.mAttachInfo;
                if (attachInfo != null) {
                    attachInfo.mHandler.removeCallbacks(action);
                } else {
                    // Assume that post will succeed later
                    ViewRootImpl.getRunQueue().removeCallbacks(action);
                }
            }
            return true;
        }
        getParent():ViewParent {
            return this.mParent;
        }
        setFlags(flags:number , mask:number){
            let old = this.mViewFlags;
            this.mViewFlags = (this.mViewFlags & ~mask) | (flags & mask);

            let changed = this.mViewFlags ^ old;
            if (changed == 0) {
                return;
            }
            let privateFlags = this.mPrivateFlags;

            if (((changed & View.FOCUSABLE_MASK) != 0) &&
                ((privateFlags & View.PFLAG_HAS_BOUNDS) !=0)) {
                if (((old & View.FOCUSABLE_MASK) == View.FOCUSABLE)
                    && ((privateFlags & View.PFLAG_FOCUSED) != 0)) {
                    /* Give up focus if we are no longer focusable */
                    this.clearFocus();
                } else if (((old & View.FOCUSABLE_MASK) == View.NOT_FOCUSABLE)
                    && ((privateFlags & View.PFLAG_FOCUSED) == 0)) {
                    /*
                     * Tell the view system that we are now available to take focus
                     * if no one else already has it.
                     */
                    if (this.mParent != null) this.mParent.focusableViewAvailable(this);
                }
            }

            const newVisibility = flags & View.VISIBILITY_MASK;
            if (newVisibility == View.VISIBLE) {
                if ((changed & View.VISIBILITY_MASK) != 0) {
                    /*
                     * If this view is becoming visible, invalidate it in case it changed while
                     * it was not visible. Marking it drawn ensures that the invalidation will
                     * go through.
                     */
                    this.mPrivateFlags |= View.PFLAG_DRAWN;
                    this.invalidate(true);

                    //needGlobalAttributesUpdate(true);

                    // a view becoming visible is worth notifying the parent
                    // about in case nothing has focus.  even if this specific view
                    // isn't focusable, it may contain something that is, so let
                    // the root view try to give this focus if nothing else does.
                    if ((this.mParent != null) && (this.mBottom > this.mTop) && (this.mRight > this.mLeft)) {
                        this.mParent.focusableViewAvailable(this);
                    }
                }
            }

            /* Check if the GONE bit has changed */
            if ((changed & View.GONE) != 0) {
                //needGlobalAttributesUpdate(false);
                this.requestLayout();

                if (((this.mViewFlags & View.VISIBILITY_MASK) == View.GONE)) {
                    if (this.hasFocus()) this.clearFocus();
                    this.destroyDrawingCache();
                    if (this.mParent instanceof View) {
                        // GONE views noop invalidation, so invalidate the parent
                        (<any> this.mParent).invalidate(true);
                    }
                    // Mark the view drawn to ensure that it gets invalidated properly the next
                    // time it is visible and gets invalidated
                    this.mPrivateFlags |= View.PFLAG_DRAWN;
                }
                if (this.mAttachInfo != null) {
                    this.mAttachInfo.mViewVisibilityChanged = true;
                }
            }


            /* Check if the VISIBLE bit has changed */
            if ((changed & View.INVISIBLE) != 0) {
                //needGlobalAttributesUpdate(false);
                /*
                 * If this view is becoming invisible, set the DRAWN flag so that
                 * the next invalidate() will not be skipped.
                 */
                this.mPrivateFlags |= View.PFLAG_DRAWN;

                if (((this.mViewFlags & View.VISIBILITY_MASK) == View.INVISIBLE)) {
                    // root view becoming invisible shouldn't clear focus and accessibility focus
                    if (this.getRootView() != this) {
                        if (this.hasFocus()) this.clearFocus();
                    }
                }
                if (this.mAttachInfo != null) {
                    this.mAttachInfo.mViewVisibilityChanged = true;
                }
            }
            if ((changed & View.VISIBILITY_MASK) != 0) {
                // If the view is invisible, cleanup its display list to free up resources
                if (newVisibility != View.VISIBLE) {
                    this.cleanupDraw();
                }

                if (this.mParent instanceof ViewGroup) {
                    (<any>this.mParent).onChildVisibilityChanged(this,
                        (changed & View.VISIBILITY_MASK), newVisibility);
                    (<any>this.mParent).invalidate(true);
                } else if (this.mParent != null) {
                    this.mParent.invalidateChild(this, null);
                }
                this.dispatchVisibilityChanged(this, newVisibility);
                this.syncVisibleToElement();
            }

            if ((changed & View.WILL_NOT_CACHE_DRAWING) != 0) {
                this.destroyDrawingCache();
            }


            if ((changed & View.DRAWING_CACHE_ENABLED) != 0) {
                this.destroyDrawingCache();
                this.mPrivateFlags &= ~View.PFLAG_DRAWING_CACHE_VALID;
                this.invalidateParentCaches();
            }

            //if ((changed & DRAWING_CACHE_QUALITY_MASK) != 0) {
            //    destroyDrawingCache();
            //    mPrivateFlags &= ~PFLAG_DRAWING_CACHE_VALID;
            //}


            if ((changed & View.DRAW_MASK) != 0) {
                if ((this.mViewFlags & View.WILL_NOT_DRAW) != 0) {
                    if (this.mBackground != null) {
                        this.mPrivateFlags &= ~View.PFLAG_SKIP_DRAW;
                        this.mPrivateFlags |= View.PFLAG_ONLY_DRAWS_BACKGROUND;
                    } else {
                        this.mPrivateFlags |= View.PFLAG_SKIP_DRAW;
                    }
                } else {
                    this.mPrivateFlags &= ~View.PFLAG_SKIP_DRAW;
                }
                this.requestLayout();
                this.invalidate(true);
            }


        }
        bringToFront() {
            if (this.mParent != null) {
                this.mParent.bringChildToFront(this);
            }
        }
        onScrollChanged(l:number, t:number, oldl:number, oldt:number) {
            this.mBackgroundSizeChanged = true;

            let ai = this.mAttachInfo;
            if (ai != null) {
                ai.mViewScrollChanged = true;
            }
        }
        protected onSizeChanged(w:number, h:number, oldw:number, oldh:number):void {

        }

        /**
         * Find and return all touchable views that are descendants of this view,
         * possibly including this view if it is touchable itself.
         *
         * @return A list of touchable views
         */
        getTouchables():ArrayList<View> {
            let result = new ArrayList<View>();
            this.addTouchables(result);
            return result;
        }

        /**
         * Add any touchable views that are descendants of this view (possibly
         * including this view if it is touchable itself) to views.
         *
         * @param views Touchable views found so far
         */
        addTouchables(views:ArrayList<View>):void {
            const viewFlags = this.mViewFlags;

            if (((viewFlags & View.CLICKABLE) == View.CLICKABLE || (viewFlags & View.LONG_CLICKABLE) == View.LONG_CLICKABLE)
                && (viewFlags & View.ENABLED_MASK) == View.ENABLED) {
                views.add(this);
            }
        }

        onFocusLost() {
            this.resetPressedState();
        }
        resetPressedState() {
            if ((this.mViewFlags & View.ENABLED_MASK) == View.DISABLED) {
                return;
            }

            if (this.isPressed()) {
                this.setPressed(false);

                if (!this.mHasPerformedLongPress) {
                    this.removeLongPressCallback();
                }
            }
        }
        isFocused():boolean {
            return (this.mPrivateFlags & View.PFLAG_FOCUSED) != 0;
        }
        findFocus():View {
            return (this.mPrivateFlags & View.PFLAG_FOCUSED) != 0 ? this : null;
        }
        getNextFocusLeftId():string {
            return this.mNextFocusLeftId;
        }
        setNextFocusLeftId(nextFocusLeftId:string) {
            this.mNextFocusLeftId = nextFocusLeftId;
        }
        getNextFocusRightId():string {
            return this.mNextFocusRightId;
        }
        setNextFocusRightId(nextFocusRightId:string) {
            this.mNextFocusRightId = nextFocusRightId;
        }
        getNextFocusUpId():string {
            return this.mNextFocusUpId;
        }
        setNextFocusUpId(nextFocusUpId:string) {
            this.mNextFocusUpId = nextFocusUpId;
        }
        getNextFocusDownId():string {
            return this.mNextFocusDownId;
        }
        setNextFocusDownId(nextFocusDownId:string) {
            this.mNextFocusDownId = nextFocusDownId;
        }
        getNextFocusForwardId():string {
            return this.mNextFocusForwardId;
        }
        setNextFocusForwardId(nextFocusForwardId:string) {
            this.mNextFocusForwardId = nextFocusForwardId;
        }
        setFocusable(focusable:boolean) {
            if (!focusable) {
                this.setFlags(0, View.FOCUSABLE_IN_TOUCH_MODE);
            }
            this.setFlags(focusable ? View.FOCUSABLE : View.NOT_FOCUSABLE, View.FOCUSABLE_MASK);
        }
        isFocusable():boolean {
            return View.FOCUSABLE == (this.mViewFlags & View.FOCUSABLE_MASK);
        }
        setFocusableInTouchMode(focusableInTouchMode:boolean) {
            // Focusable in touch mode should always be set before the focusable flag
            // otherwise, setting the focusable flag will trigger a focusableViewAvailable()
            // which, in touch mode, will not successfully request focus on this view
            // because the focusable in touch mode flag is not set
            this.setFlags(focusableInTouchMode ? View.FOCUSABLE_IN_TOUCH_MODE : 0, View.FOCUSABLE_IN_TOUCH_MODE);
            if (focusableInTouchMode) {
                this.setFlags(View.FOCUSABLE, View.FOCUSABLE_MASK);
            }
        }
        isFocusableInTouchMode():boolean {
            return View.FOCUSABLE_IN_TOUCH_MODE == (this.mViewFlags & View.FOCUSABLE_IN_TOUCH_MODE);
        }
        hasFocusable():boolean {
            return (this.mViewFlags & View.VISIBILITY_MASK) == View.VISIBLE && this.isFocusable();
        }
        clearFocus() {
            if (View.DBG) {
                System.out.println(this + " clearFocus()");
            }
            this.clearFocusInternal(true, true);
        }
        clearFocusInternal(propagate:boolean, refocus:boolean) {
            if ((this.mPrivateFlags & View.PFLAG_FOCUSED) != 0) {
                this.mPrivateFlags &= ~View.PFLAG_FOCUSED;

                if (propagate && this.mParent != null) {
                    this.mParent.clearChildFocus(this);
                }

                this.onFocusChanged(false, 0, null);

                this.refreshDrawableState();

                if (propagate && (!refocus || !this.rootViewRequestFocus())) {
                    this.notifyGlobalFocusCleared(this);
                }
            }
        }
        notifyGlobalFocusCleared(oldFocus:View) {
            if (oldFocus != null && this.mAttachInfo != null) {
                this.mAttachInfo.mTreeObserver.dispatchOnGlobalFocusChange(oldFocus, null);
            }
        }
        rootViewRequestFocus() {
            const root = this.getRootView();
            return root != null && root.requestFocus();
        }
        unFocus() {
            if (View.DBG) {
                System.out.println(this + " unFocus()");
            }
            this.clearFocusInternal(false, false);
        }
        hasFocus():boolean{
            return (this.mPrivateFlags & View.PFLAG_FOCUSED) != 0;
        }
        protected onFocusChanged(gainFocus:boolean, direction:number, previouslyFocusedRect:Rect) {
            if (!gainFocus) {
                if (this.isPressed()) {
                    this.setPressed(false);
                }
                this.onFocusLost();
            }
            this.invalidate(true);
            let li = this.mListenerInfo;
            if (li != null && li.mOnFocusChangeListener != null) {
                li.mOnFocusChangeListener.onFocusChange(this, gainFocus);
            }

            if (this.mAttachInfo != null) {
                this.mAttachInfo.mKeyDispatchState.reset(this);
            }
        }

        focusSearch(direction:number):View {
            if (this.mParent != null) {
                return this.mParent.focusSearch(this, direction);
            } else {
                return null;
            }
        }
        dispatchUnhandledMove(focused:View, direction:number):boolean {
            return false;
        }
        findUserSetNextFocus(root:View, direction:number):View {
            switch (direction) {
                case View.FOCUS_LEFT:
                    if (!this.mNextFocusLeftId) return null;
                    return this.findViewInsideOutShouldExist(root, this.mNextFocusLeftId);
                case View.FOCUS_RIGHT:
                    if (!this.mNextFocusRightId) return null;
                    return this.findViewInsideOutShouldExist(root, this.mNextFocusRightId);
                case View.FOCUS_UP:
                    if (!this.mNextFocusUpId) return null;
                    return this.findViewInsideOutShouldExist(root, this.mNextFocusUpId);
                case View.FOCUS_DOWN:
                    if (!this.mNextFocusDownId) return null;
                    return this.findViewInsideOutShouldExist(root, this.mNextFocusDownId);
                case View.FOCUS_FORWARD:
                    if (!this.mNextFocusForwardId) return null;
                    return this.findViewInsideOutShouldExist(root, this.mNextFocusForwardId);
                case View.FOCUS_BACKWARD: {
                    if (!this.mID) return null;
                    let id = this.mID;
                    return root.findViewByPredicateInsideOut(this, {
                        apply(t:View):boolean {
                            return t.mNextFocusForwardId == id;
                        }
                    });
                }
            }
            return null;
        }
        private findViewInsideOutShouldExist(root:View, id:string):View {
            if (this.mMatchIdPredicate == null) {
                this.mMatchIdPredicate = new MatchIdPredicate();
            }
            this.mMatchIdPredicate.mId = id;
            let result = root.findViewByPredicateInsideOut(this, this.mMatchIdPredicate);
            if (result == null) {
                Log.w(View.VIEW_LOG_TAG, "couldn't find view with id " + id);
            }
            return result;
        }

        getFocusables(direction:number):ArrayList<View> {
            let result = new ArrayList<View>(24);
            this.addFocusables(result, direction);
            return result;
        }
        addFocusables(views:ArrayList<View>, direction:number, focusableMode=View.FOCUSABLES_TOUCH_MODE):void {
            if (views == null) {
                return;
            }
            if (!this.isFocusable()) {
                return;
            }
            if ((focusableMode & View.FOCUSABLES_TOUCH_MODE) == View.FOCUSABLES_TOUCH_MODE
                && this.isInTouchMode() && !this.isFocusableInTouchMode()) {
                return;
            }
            views.add(this);
        }
        setOnFocusChangeListener(l:View.OnFocusChangeListener) {
            this.getListenerInfo().mOnFocusChangeListener = l;
        }
        getOnFocusChangeListener():View.OnFocusChangeListener {
            let li = this.mListenerInfo;
            return li != null ? li.mOnFocusChangeListener : null;
        }


        requestFocus(direction=View.FOCUS_DOWN, previouslyFocusedRect=null):boolean{
            return this.requestFocusNoSearch(direction, previouslyFocusedRect);
        }

        private requestFocusNoSearch(direction:number, previouslyFocusedRect:Rect):boolean {
            // need to be focusable
            if ((this.mViewFlags & View.FOCUSABLE_MASK) != View.FOCUSABLE ||
                (this.mViewFlags & View.VISIBILITY_MASK) != View.VISIBLE) {
                return false;
            }

            // need to be focusable in touch mode if in touch mode
            if (this.isInTouchMode() &&
                (View.FOCUSABLE_IN_TOUCH_MODE != (this.mViewFlags & View.FOCUSABLE_IN_TOUCH_MODE))) {
                return false;
            }

            // need to not have any parents blocking us
            if (this.hasAncestorThatBlocksDescendantFocus()) {
                return false;
            }

            this.handleFocusGainInternal(direction, previouslyFocusedRect);
            return true;
        }
        requestFocusFromTouch():boolean {
            // Leave touch mode if we need to
            if (this.isInTouchMode()) {
                let viewRoot = this.getViewRootImpl();
                if (viewRoot != null) {
                    viewRoot.ensureTouchMode(false);
                }
            }
            return this.requestFocus(View.FOCUS_DOWN);
        }
        private hasAncestorThatBlocksDescendantFocus():boolean {
            let ancestor = this.mParent;
            while (ancestor instanceof ViewGroup) {
                const vgAncestor = <ViewGroup>ancestor;
                if (vgAncestor.getDescendantFocusability() == ViewGroup.FOCUS_BLOCK_DESCENDANTS) {
                    return true;
                } else {
                    ancestor = vgAncestor.getParent();
                }
            }
            return false;
        }
        handleFocusGainInternal(direction:number, previouslyFocusedRect:Rect) {
            if (View.DBG) {
                System.out.println(this + " requestFocus()");
            }

            if ((this.mPrivateFlags & View.PFLAG_FOCUSED) == 0) {
                this.mPrivateFlags |= View.PFLAG_FOCUSED;

                let oldFocus = (this.mAttachInfo != null) ? this.getRootView().findFocus() : null;

                if (this.mParent != null) {
                    this.mParent.requestChildFocus(this, this);
                }

                if (this.mAttachInfo != null) {
                    this.mAttachInfo.mTreeObserver.dispatchOnGlobalFocusChange(oldFocus, this);
                }

                this.onFocusChanged(true, direction, previouslyFocusedRect);
                this.refreshDrawableState();
            }
        }
        hasTransientState():boolean {
            return (this.mPrivateFlags2 & View.PFLAG2_HAS_TRANSIENT_STATE) == View.PFLAG2_HAS_TRANSIENT_STATE;
        }
        setHasTransientState(hasTransientState:boolean) {
            this.mTransientStateCount = hasTransientState ? this.mTransientStateCount + 1 :
            this.mTransientStateCount - 1;
            if (this.mTransientStateCount < 0) {
                this.mTransientStateCount = 0;
                Log.e(View.VIEW_LOG_TAG, "hasTransientState decremented below 0: " +
                    "unmatched pair of setHasTransientState calls");
            } else if ((hasTransientState && this.mTransientStateCount == 1) ||
                (!hasTransientState && this.mTransientStateCount == 0)) {
                // update flag if we've just incremented up from 0 or decremented down to 0
                this.mPrivateFlags2 = (this.mPrivateFlags2 & ~View.PFLAG2_HAS_TRANSIENT_STATE) |
                    (hasTransientState ? View.PFLAG2_HAS_TRANSIENT_STATE : 0);
                if (this.mParent != null) {
                    this.mParent.childHasTransientStateChanged(this, hasTransientState);
                }
            }
        }


        isInTouchMode():boolean{
            if (this.mAttachInfo != null) {
                return this.mAttachInfo.mInTouchMode;
            } else {
                return false;
            }
        }

        isShown():boolean {
            let current = this;
            //noinspection ConstantConditions
            do {
                if ((current.mViewFlags & View.VISIBILITY_MASK) != View.VISIBLE) {
                    return false;
                }
                let parent = current.mParent;
                if (parent == null) {
                    return false; // We are not attached to the view root
                }
                if (!(parent instanceof View)) {
                    return true;
                }
                current = <View><any>parent;
            } while (current != null);

            return false;
        }
        getVisibility():number {
            return this.mViewFlags & View.VISIBILITY_MASK;
        }
        setVisibility(visibility:number) {
            this.setFlags(visibility, View.VISIBILITY_MASK);
            if (this.mBackground != null) this.mBackground.setVisible(visibility == View.VISIBLE, false);
        }
        dispatchVisibilityChanged(changedView:View, visibility:number) {
            this.onVisibilityChanged(changedView, visibility);
        }
        onVisibilityChanged(changedView:View, visibility:number) {
            if (visibility == View.VISIBLE) {
                if (this.mAttachInfo != null) {
                    this.initialAwakenScrollBars();
                } else {
                    this.mPrivateFlags |= View.PFLAG_AWAKEN_SCROLL_BARS_ON_ATTACH;
                }
            }
        }

        /**
         * Dispatch a hint about whether this view is displayed. For instance, when
         * a View moves out of the screen, it might receives a display hint indicating
         * the view is not displayed. Applications should not <em>rely</em> on this hint
         * as there is no guarantee that they will receive one.
         *
         * @param hint A hint about whether or not this view is displayed:
         * {@link #VISIBLE} or {@link #INVISIBLE}.
         */
        dispatchDisplayHint(hint:number):void  {
            this.onDisplayHint(hint);
        }

        /**
         * Gives this view a hint about whether is displayed or not. For instance, when
         * a View moves out of the screen, it might receives a display hint indicating
         * the view is not displayed. Applications should not <em>rely</em> on this hint
         * as there is no guarantee that they will receive one.
         *
         * @param hint A hint about whether or not this view is displayed:
         * {@link #VISIBLE} or {@link #INVISIBLE}.
         */
        onDisplayHint(hint:number):void  {
        }
        dispatchWindowVisibilityChanged(visibility:number) {
            this.onWindowVisibilityChanged(visibility);
        }
        onWindowVisibilityChanged(visibility:number) {
            if (visibility == View.VISIBLE) {
                this.initialAwakenScrollBars();
            }
        }
        getWindowVisibility() {
            return this.mAttachInfo != null ? this.mAttachInfo.mWindowVisibility : View.GONE;
        }

        isEnabled():boolean {
            return (this.mViewFlags & View.ENABLED_MASK) == View.ENABLED;
        }
        setEnabled(enabled:boolean) {
            if (enabled == this.isEnabled()) return;

            this.setFlags(enabled ? View.ENABLED : View.DISABLED, View.ENABLED_MASK);

            /*
             * The View most likely has to change its appearance, so refresh
             * the drawable state.
             */
            this.refreshDrawableState();

            // Invalidate too, since the default behavior for views is to be
            // be drawn at 50% alpha rather than to change the drawable.
            this.invalidate(true);

            //if (!enabled) {
            //    cancelPendingInputEvents();
            //}
        }

        dispatchGenericMotionEvent(event:MotionEvent):boolean{
            if (event.isPointerEvent()) {
                const action = event.getAction();
                if (action == MotionEvent.ACTION_HOVER_ENTER
                    || action == MotionEvent.ACTION_HOVER_MOVE
                    || action == MotionEvent.ACTION_HOVER_EXIT) {
                    //if (dispatchHoverEvent(event)) {//TODO when hover impl
                    //    return true;
                    //}
                } else if (this.dispatchGenericPointerEvent(event)) {
                    return true;
                }
            }
            //else if (dispatchGenericFocusedEvent(event)) {
            //    return true;
            //}

            if (this.dispatchGenericMotionEventInternal(event)) {
                return true;
            }
            return false;
        }
        private dispatchGenericMotionEventInternal(event:MotionEvent):boolean {
            //noinspection SimplifiableIfStatement
            let li = this.mListenerInfo;
            if (li != null && li.mOnGenericMotionListener != null
                && (this.mViewFlags & View.ENABLED_MASK) == View.ENABLED
                && li.mOnGenericMotionListener.onGenericMotion(this, event)) {
                return true;
            }

            if (this.onGenericMotionEvent(event)) {
                return true;
            }

            return false;
        }

        onGenericMotionEvent(event:MotionEvent):boolean {
            return false;
        }
        dispatchGenericPointerEvent(event:MotionEvent):boolean{
            return false;
        }

        dispatchKeyEvent(event:KeyEvent):boolean {

            // Give any attached key listener a first crack at the event.
            //noinspection SimplifiableIfStatement
            let li = this.mListenerInfo;
            if (li != null && li.mOnKeyListener != null && (this.mViewFlags & View.ENABLED_MASK) == View.ENABLED
                && li.mOnKeyListener.onKey(this, event.getKeyCode(), event)) {
                return true;
            }

            if (event.dispatch(this, this.mAttachInfo != null
                    ? this.mAttachInfo.mKeyDispatchState : null, this)) {
                return true;
            }

            return false;
        }
        setOnKeyListener(l:View.OnKeyListener) {
            this.getListenerInfo().mOnKeyListener = l;
        }
        getKeyDispatcherState():KeyEvent.DispatcherState {
            return this.mAttachInfo != null ? this.mAttachInfo.mKeyDispatchState : null;
        }

        onKeyDown(keyCode:number, event:android.view.KeyEvent):boolean {
            let result = false;

            if (KeyEvent.isConfirmKey(keyCode)) {
                if ((this.mViewFlags & View.ENABLED_MASK) == View.DISABLED) {
                    return true;
                }
                // Long clickable items don't necessarily have to be clickable
                if (((this.mViewFlags & View.CLICKABLE) == View.CLICKABLE ||
                    (this.mViewFlags & View.LONG_CLICKABLE) == View.LONG_CLICKABLE) &&
                    (event.getRepeatCount() == 0)) {
                    this.setPressed(true);
                    this.checkForLongClick(0);
                    return true;
                }
            }
            return result;
        }

        onKeyLongPress(keyCode:number, event:android.view.KeyEvent):boolean {
            return false;
        }

        onKeyUp(keyCode:number, event:android.view.KeyEvent):boolean {
            if (KeyEvent.isConfirmKey(keyCode)) {
                if ((this.mViewFlags & View.ENABLED_MASK) == View.DISABLED) {
                    return true;
                }
                if ((this.mViewFlags & View.CLICKABLE) == View.CLICKABLE && this.isPressed()) {
                    this.setPressed(false);

                    if (!this.mHasPerformedLongPress) {
                        // This is a tap, so remove the longpress check
                        this.removeLongPressCallback();
                        return this.performClick();
                    }
                }
            }
            return false;
        }

        dispatchTouchEvent(event:MotionEvent):boolean {
            if (this.onFilterTouchEventForSecurity(event)) {
                let li = this.mListenerInfo;
                if (li != null && li.mOnTouchListener != null && (this.mViewFlags & View.ENABLED_MASK) == View.ENABLED
                    && li.mOnTouchListener.onTouch(this, event)) {
                    return true;
                }

                if (this.onTouchEvent(event)) {
                    return true;
                }
            }
            return false;
        }
        onFilterTouchEventForSecurity(event:MotionEvent):boolean {
            return true;
        }

        onTouchEvent(event:MotionEvent):boolean {
            let viewFlags = this.mViewFlags;

            if ((viewFlags & View.ENABLED_MASK) == View.DISABLED) {
                if (event.getAction() == MotionEvent.ACTION_UP && (this.mPrivateFlags & View.PFLAG_PRESSED) != 0) {
                    this.setPressed(false);
                }
                // A disabled view that is clickable still consumes the touch
                // events, it just doesn't respond to them.
                return (((viewFlags & View.CLICKABLE) == View.CLICKABLE ||
                (viewFlags & View.LONG_CLICKABLE) == View.LONG_CLICKABLE));
            }

            if (this.mTouchDelegate != null) {
                if (this.mTouchDelegate.onTouchEvent(event)) {
                    return true;
                }
            }

            if (((viewFlags & View.CLICKABLE) == View.CLICKABLE ||
                (viewFlags & View.LONG_CLICKABLE) == View.LONG_CLICKABLE)) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_UP:
                        let prepressed = (this.mPrivateFlags & View.PFLAG_PREPRESSED) != 0;
                        if ((this.mPrivateFlags & View.PFLAG_PRESSED) != 0 || prepressed) {
                            // take focus if we don't have it already and we should in
                            // touch mode.
                            let focusTaken = false;
                            //if (isFocusable() && isFocusableInTouchMode() && !isFocused()) {//TODO when focus ok
                            //    focusTaken = requestFocus();
                            //}

                            if (prepressed) {
                                // The button is being released before we actually
                                // showed it as pressed.  Make it show the pressed
                                // state now (before scheduling the click) to ensure
                                // the user sees it.
                                this.setPressed(true);
                            }

                            if (!this.mHasPerformedLongPress) {
                                // This is a tap, so remove the longpress check
                                this.removeLongPressCallback();

                                // Only perform take click actions if we were in the pressed state
                                if (!focusTaken) {
                                    // Use a Runnable and post this rather than calling
                                    // performClick directly. This lets other visual state
                                    // of the view update before click actions start.
                                    if (this.mPerformClick == null) {
                                        this.mPerformClick = new PerformClick(this);
                                    }
                                    if (!this.post(this.mPerformClick)) {
                                        this.performClick(event);
                                    }
                                }
                            }

                            if (this.mUnsetPressedState == null) {
                                this.mUnsetPressedState = new UnsetPressedState(this);
                            }

                            if (prepressed) {
                                this.postDelayed(this.mUnsetPressedState,
                                    ViewConfiguration.getPressedStateDuration());
                            } else if (!this.post(this.mUnsetPressedState)) {
                                // If the post failed, unpress right now
                                this.mUnsetPressedState.run();
                            }
                            this.removeTapCallback();
                        }
                        break;

                    case MotionEvent.ACTION_DOWN:
                        this.mHasPerformedLongPress = false;


                        // Walk up the hierarchy to determine if we're inside a scrolling container.
                        let isInScrollingContainer = this.isInScrollingContainer();

                        // For views inside a scrolling container, delay the pressed feedback for
                        // a short period in case this is a scroll.
                        if (isInScrollingContainer) {
                            this.mPrivateFlags |= View.PFLAG_PREPRESSED;
                            if (this.mPendingCheckForTap == null) {
                                this.mPendingCheckForTap = new CheckForTap(this);
                            }
                            this.postDelayed(this.mPendingCheckForTap, ViewConfiguration.getTapTimeout());
                        } else {
                            // Not inside a scrolling container, so show the feedback right away
                            this.setPressed(true);
                            this.checkForLongClick(0);
                        }
                        break;

                    case MotionEvent.ACTION_CANCEL:
                        this.setPressed(false);
                        this.removeTapCallback();
                        this.removeLongPressCallback();
                        break;

                    case MotionEvent.ACTION_MOVE:
                        const x = event.getX();
                        const y = event.getY();

                        // Be lenient about moving outside of buttons
                        if (!this.pointInView(x, y, this.mTouchSlop)) {
                            // Outside button
                            this.removeTapCallback();
                            if ((this.mPrivateFlags & View.PFLAG_PRESSED) != 0) {
                                // Remove any future long press/tap checks
                                this.removeLongPressCallback();

                                this.setPressed(false);
                            }
                        }
                        break;
                }
                return true;
            }

            return false;
        }
        isInScrollingContainer():boolean {
            let p = this.getParent();
            while (p != null && p instanceof ViewGroup) {
                if ((<ViewGroup> p).shouldDelayChildPressedState()) {
                    return true;
                }
                p = p.getParent();
            }
            return false;
        }

        /**
         * Cancel any deferred high-level input events that were previously posted to the event queue.
         *
         * <p>Many views post high-level events such as click handlers to the event queue
         * to run deferred in order to preserve a desired user experience - clearing visible
         * pressed states before executing, etc. This method will abort any events of this nature
         * that are currently in flight.</p>
         *
         * <p>Custom views that generate their own high-level deferred input events should override
         * {@link #onCancelPendingInputEvents()} and remove those pending events from the queue.</p>
         *
         * <p>This will also cancel pending input events for any child views.</p>
         *
         * <p>Note that this may not be sufficient as a debouncing strategy for clicks in all cases.
         * This will not impact newer events posted after this call that may occur as a result of
         * lower-level input events still waiting in the queue. If you are trying to prevent
         * double-submitted  events for the duration of some sort of asynchronous transaction
         * you should also take other steps to protect against unexpected double inputs e.g. calling
         * {@link #setEnabled(boolean) setEnabled(false)} and re-enabling the view when
         * the transaction completes, tracking already submitted transaction IDs, etc.</p>
         */
        cancelPendingInputEvents():void  {
            this.dispatchCancelPendingInputEvents();
        }

        /**
         * Called by {@link #cancelPendingInputEvents()} to cancel input events in flight.
         * Overridden by ViewGroup to dispatch. Package scoped to prevent app-side meddling.
         */
        dispatchCancelPendingInputEvents():void  {
            this.mPrivateFlags3 &= ~View.PFLAG3_CALLED_SUPER;
            this.onCancelPendingInputEvents();
            if ((this.mPrivateFlags3 & View.PFLAG3_CALLED_SUPER) != View.PFLAG3_CALLED_SUPER) {
                throw Error(`new SuperNotCalledException("View " + this.getClass().getSimpleName() + " did not call through to super.onCancelPendingInputEvents()")`);
            }
        }

        /**
         * Called as the result of a call to {@link #cancelPendingInputEvents()} on this view or
         * a parent view.
         *
         * <p>This method is responsible for removing any pending high-level input events that were
         * posted to the event queue to run later. Custom view classes that post their own deferred
         * high-level events via {@link #post(Runnable)}, {@link #postDelayed(Runnable, long)} or
         * {@link android.os.Handler} should override this method, call
         * <code>super.onCancelPendingInputEvents()</code> and remove those callbacks as appropriate.
         * </p>
         */
        onCancelPendingInputEvents():void  {
            this.removePerformClickCallback();
            this.cancelLongPress();
            this.mPrivateFlags3 |= View.PFLAG3_CALLED_SUPER;
        }

        private removeLongPressCallback() {
            if (this.mPendingCheckForLongPress != null) {
                this.removeCallbacks(this.mPendingCheckForLongPress);
            }
        }
        private removePerformClickCallback() {
            if (this.mPerformClick != null) {
                this.removeCallbacks(this.mPerformClick);
            }
        }
        private removeUnsetPressCallback() {
            if ((this.mPrivateFlags & View.PFLAG_PRESSED) != 0 && this.mUnsetPressedState != null) {
                this.setPressed(false);
                this.removeCallbacks(this.mUnsetPressedState);
            }
        }
        private removeTapCallback() {
            if (this.mPendingCheckForTap != null) {
                this.mPrivateFlags &= ~View.PFLAG_PREPRESSED;
                this.removeCallbacks(this.mPendingCheckForTap);
            }
        }
        cancelLongPress() {
            this.removeLongPressCallback();

            /*
             * The prepressed state handled by the tap callback is a display
             * construct, but the tap callback will post a long press callback
             * less its own timeout. Remove it here.
             */
            this.removeTapCallback();
        }
        setTouchDelegate(delegate:TouchDelegate) {
            this.mTouchDelegate = delegate;
        }
        getTouchDelegate() {
            return this.mTouchDelegate;
        }

        getListenerInfo() {
            if (this.mListenerInfo != null) {
                return this.mListenerInfo;
            }
            this.mListenerInfo = new View.ListenerInfo();
            return this.mListenerInfo;
        }
        addOnLayoutChangeListener(listener:View.OnLayoutChangeListener) {
            let li = this.getListenerInfo();
            if (li.mOnLayoutChangeListeners == null) {
                li.mOnLayoutChangeListeners = new ArrayList<View.OnLayoutChangeListener>();
            }
            if (!li.mOnLayoutChangeListeners.contains(listener)) {
                li.mOnLayoutChangeListeners.add(listener);
            }
        }
        removeOnLayoutChangeListener(listener:View.OnLayoutChangeListener) {
            let li = this.mListenerInfo;
            if (li == null || li.mOnLayoutChangeListeners == null) {
                return;
            }
            li.mOnLayoutChangeListeners.remove(listener);
        }
        addOnAttachStateChangeListener(listener:View.OnAttachStateChangeListener) {
            let li = this.getListenerInfo();
            if (li.mOnAttachStateChangeListeners == null) {
                li.mOnAttachStateChangeListeners
                    = new CopyOnWriteArrayList<View.OnAttachStateChangeListener>();
            }
            li.mOnAttachStateChangeListeners.add(listener);
        }
        removeOnAttachStateChangeListener(listener:View.OnAttachStateChangeListener) {
            let li = this.mListenerInfo;
            if (li == null || li.mOnAttachStateChangeListeners == null) {
                return;
            }
            li.mOnAttachStateChangeListeners.remove(listener);
        }
        setOnClickListener(l:View.OnClickListener) {
            if (!this.isClickable()) {
                this.setClickable(true);
            }
            this.getListenerInfo().mOnClickListener = l;
        }
        hasOnClickListeners():boolean {
            let li = this.mListenerInfo;
            return (li != null && li.mOnClickListener != null);
        }


        setOnLongClickListener(l:View.OnLongClickListener) {
            if (!this.isLongClickable()) {
                this.setLongClickable(true);
            }
            this.getListenerInfo().mOnLongClickListener = l;
        }
        playSoundEffect(soundConstant:number){
            //no impl
        }

        performHapticFeedback(feedbackConstant:number):boolean  {
            //no impl
            return false;
        }

        performClick(event?:MotionEvent):boolean {
            this._sendClickToBindElement(event);

            let li = this.mListenerInfo;
            if (li != null && li.mOnClickListener != null) {
                li.mOnClickListener.onClick(this);
                return true;
            }

            return false;
        }
        private _sendClickToBindElement(event?:MotionEvent){
            let touch = event ? event._activeTouch : null;
            let screenX = touch ? touch.screenX : 0;
            let screenY = touch ? touch.screenY : 0;
            let clientX = touch ? touch.clientX : 0;
            let clientY = touch ? touch.clientY : 0;

            // Synthesise a click event, with an extra attribute so it can be tracked
            let clickEvent = document.createEvent('MouseEvents');
            clickEvent.initMouseEvent('click', false, true, window, 1, screenX, screenY, clientX, clientY, false, false, false, false, 0, null);
            (<any>clickEvent).forwardedTouchEvent = true;
            this.bindElement.dispatchEvent(clickEvent);
        }

        callOnClick():boolean {
            let li = this.mListenerInfo;
            if (li != null && li.mOnClickListener != null) {
                li.mOnClickListener.onClick(this);
                return true;
            }

            return false;
        }
        performLongClick():boolean {
            let handled = false;
            let li = this.mListenerInfo;
            if (li != null && li.mOnLongClickListener != null) {
                handled = li.mOnLongClickListener.onLongClick(this);
            }
            return handled;
        }
        /**
         * Performs button-related actions during a touch down event.
         *
         * @param event The event.
         * @return True if the down was consumed.
         *
         * @hide
         */
        performButtonActionOnTouchDown(event:MotionEvent):boolean  {
            //no impl
            //if ((event.getButtonState() & MotionEvent.BUTTON_SECONDARY) != 0) {
            //    if (this.showContextMenu(event.getX(), event.getY(), event.getMetaState())) {
            //        return true;
            //    }
            //}
            return false;
        }

        private checkForLongClick(delayOffset=0) {
            if ((this.mViewFlags & View.LONG_CLICKABLE) == View.LONG_CLICKABLE) {
                this.mHasPerformedLongPress = false;

                if (this.mPendingCheckForLongPress == null) {
                    this.mPendingCheckForLongPress = new CheckForLongPress(this);
                }
                this.mPendingCheckForLongPress.rememberWindowAttachCount();
                this.postDelayed(this.mPendingCheckForLongPress,
                    ViewConfiguration.getLongPressTimeout() - delayOffset);
            }
        }
        setOnTouchListener(l:View.OnTouchListener) {
            this.getListenerInfo().mOnTouchListener = l;
        }
        isClickable() {
            return (this.mViewFlags & View.CLICKABLE) == View.CLICKABLE;
        }
        setClickable(clickable:boolean) {
            this.setFlags(clickable ? View.CLICKABLE : 0, View.CLICKABLE);
        }
        isLongClickable():boolean {
            return (this.mViewFlags & View.LONG_CLICKABLE) == View.LONG_CLICKABLE;
        }
        setLongClickable(longClickable:boolean) {
            this.setFlags(longClickable ? View.LONG_CLICKABLE : 0, View.LONG_CLICKABLE);
        }
        setPressed(pressed:boolean){
            const needsRefresh = pressed != ((this.mPrivateFlags & View.PFLAG_PRESSED) == View.PFLAG_PRESSED);

            if (pressed) {
                this.mPrivateFlags |= View.PFLAG_PRESSED;
            } else {
                this.mPrivateFlags &= ~View.PFLAG_PRESSED;
            }

            if (needsRefresh) {
                this.refreshDrawableState();
            }
            this.dispatchSetPressed(pressed);
        }
        dispatchSetPressed(pressed:boolean):void {
        }
        isPressed():boolean {
            return (this.mPrivateFlags & View.PFLAG_PRESSED) == View.PFLAG_PRESSED;
        }
        setSelected(selected:boolean) {
            if (((this.mPrivateFlags & View.PFLAG_SELECTED) != 0) != selected) {
                this.mPrivateFlags = (this.mPrivateFlags & ~View.PFLAG_SELECTED) | (selected ? View.PFLAG_SELECTED : 0);
                if (!selected) this.resetPressedState();
                this.invalidate(true);
                this.refreshDrawableState();
                this.dispatchSetSelected(selected);
            }
        }
        dispatchSetSelected(selected:boolean) {
        }
        isSelected() {
            return (this.mPrivateFlags & View.PFLAG_SELECTED) != 0;
        }
        setActivated(activated:boolean) {
            if (((this.mPrivateFlags & View.PFLAG_ACTIVATED) != 0) != activated) {
                this.mPrivateFlags = (this.mPrivateFlags & ~View.PFLAG_ACTIVATED) | (activated ? View.PFLAG_ACTIVATED : 0);
                this.invalidate(true);
                this.refreshDrawableState();
                this.dispatchSetActivated(activated);
            }
        }
        dispatchSetActivated(activated:boolean) {
        }
        isActivated() {
            return (this.mPrivateFlags & View.PFLAG_ACTIVATED) != 0;
        }
        getViewTreeObserver() {
            if (this.mAttachInfo != null) {
                return this.mAttachInfo.mTreeObserver;
            }
            if (this.mFloatingTreeObserver == null) {
                this.mFloatingTreeObserver = new ViewTreeObserver();
            }
            return this.mFloatingTreeObserver;
        }

        isLayoutRtl():boolean{
            return false;
        }
        getBaseline():number {
            return -1;
        }
        isLayoutRequested():boolean {
            return (this.mPrivateFlags & View.PFLAG_FORCE_LAYOUT) == View.PFLAG_FORCE_LAYOUT;
        }

        getLayoutParams():ViewGroup.LayoutParams {
            return this.mLayoutParams;
        }
        setLayoutParams(params:ViewGroup.LayoutParams) {
            if (params == null) {
                throw new Error("Layout parameters cannot be null");
            }
            this.mLayoutParams = params;
            //resolveLayoutParams();
            let p = this.mParent;
            if (p instanceof ViewGroup) {
                p.onSetLayoutParams(this, params);
            }
            this.requestLayout();
        }

        requestLayout() {
            if (this.mMeasureCache != null) this.mMeasureCache.clear();

            if (this.mAttachInfo != null && this.mAttachInfo.mViewRequestingLayout == null) {
                // Only trigger request-during-layout logic if this is the view requesting it,
                // not the views in its parent hierarchy
                let viewRoot = this.getViewRootImpl();
                if (viewRoot != null && viewRoot.isInLayout()) {
                    if (!viewRoot.requestLayoutDuringLayout(this)) {
                        return;
                    }
                }
                this.mAttachInfo.mViewRequestingLayout = this;
            }

            this.mPrivateFlags |= View.PFLAG_FORCE_LAYOUT;
            this.mPrivateFlags |= View.PFLAG_INVALIDATED;

            if (this.mParent != null && !this.mParent.isLayoutRequested()) {
                this.mParent.requestLayout();
            }
        }

        forceLayout() {
            if (this.mMeasureCache != null) this.mMeasureCache.clear();

            this.mPrivateFlags |= View.PFLAG_FORCE_LAYOUT;
            this.mPrivateFlags |= View.PFLAG_INVALIDATED;
        }
        isLaidOut():boolean {
            return (this.mPrivateFlags3 & View.PFLAG3_IS_LAID_OUT) == View.PFLAG3_IS_LAID_OUT;
        }

        layout(l:number, t:number, r:number, b:number):void {
            if ((this.mPrivateFlags3 & View.PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT) != 0) {
                this.onMeasure(this.mOldWidthMeasureSpec, this.mOldHeightMeasureSpec);
                this.mPrivateFlags3 &= ~View.PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT;
            }

            let oldL = this.mLeft;
            let oldT = this.mTop;
            let oldB = this.mBottom;
            let oldR = this.mRight;

            let changed = this.setFrame(l, t, r, b);

            if(changed) this.syncBoundToElement();

            if (changed || (this.mPrivateFlags & View.PFLAG_LAYOUT_REQUIRED) == View.PFLAG_LAYOUT_REQUIRED) {

                this.onLayout(changed, l, t, r, b);
                this.mPrivateFlags &= ~View.PFLAG_LAYOUT_REQUIRED;

                let li = this.mListenerInfo;
                if (li != null && li.mOnLayoutChangeListeners != null) {
                    let listenersCopy = li.mOnLayoutChangeListeners.clone();
                    let numListeners = listenersCopy.size();
                    for (let i = 0; i < numListeners; ++i) {
                        listenersCopy.get(i).onLayoutChange(this, l, t, r, b, oldL, oldT, oldR, oldB);
                    }
                }
            }

            this.mPrivateFlags &= ~View.PFLAG_FORCE_LAYOUT;
            this.mPrivateFlags3 |= View.PFLAG3_IS_LAID_OUT;
        }
        protected onLayout(changed:boolean, left:number, top:number, right:number, bottom:number):void {
        }

        setFrame(left:number, top:number, right:number, bottom:number) {
            let changed = false;

            if (View.DBG) {
                Log.i("View", this + " View.setFrame(" + left + "," + top + ","
                    + right + "," + bottom + ")");
            }

            if (this.mLeft != left || this.mRight != right || this.mTop != top || this.mBottom != bottom) {
                changed = true;

                // Remember our drawn bit
                let drawn = this.mPrivateFlags & View.PFLAG_DRAWN;

                let oldWidth = this.mRight - this.mLeft;
                let oldHeight = this.mBottom - this.mTop;
                let newWidth = right - left;
                let newHeight = bottom - top;
                let sizeChanged = (newWidth != oldWidth) || (newHeight != oldHeight);

                // Invalidate our old position
                this.invalidate(sizeChanged);

                this.mLeft = left;
                this.mTop = top;
                this.mRight = right;
                this.mBottom = bottom;

                this.mPrivateFlags |= View.PFLAG_HAS_BOUNDS;


                if (sizeChanged) {
                    if ((this.mPrivateFlags & View.PFLAG_PIVOT_EXPLICITLY_SET) == 0) {
                        // A change in dimension means an auto-centered pivot point changes, too
                        //if (mTransformationInfo != null) {
                        //    mTransformationInfo.mMatrixDirty = true;
                        //}
                    }
                    this.sizeChange(newWidth, newHeight, oldWidth, oldHeight);
                }

                if ((this.mViewFlags & View.VISIBILITY_MASK) == View.VISIBLE) {
                    // If we are visible, force the DRAWN bit to on so that
                    // this invalidate will go through (at least to our parent).
                    // This is because someone may have invalidated this view
                    // before this call to setFrame came in, thereby clearing
                    // the DRAWN bit.
                    this.mPrivateFlags |= View.PFLAG_DRAWN;
                    this.invalidate(sizeChanged);
                    // parent display list may need to be recreated based on a change in the bounds
                    // of any child
                    //this.invalidateParentCaches();
                }

            // Reset drawn bit to original value (invalidate turns it off)
            this.mPrivateFlags |= drawn;

            this.mBackgroundSizeChanged = true;

            }
            return changed;
        }

        private sizeChange(newWidth:number, newHeight:number, oldWidth:number, oldHeight:number):void {
            this.onSizeChanged(newWidth, newHeight, oldWidth, oldHeight);
            if (this.mOverlay != null) {
                this.mOverlay.getOverlayView().setRight(newWidth);
                this.mOverlay.getOverlayView().setBottom(newHeight);
            }
        }

        /**
         * Hit rectangle in parent's coordinates
         *
         * @param outRect The hit rectangle of the view.
         */
        getHitRect(outRect:Rect):void  {
            //TODO when transformation impl
            //this.updateMatrix();
            //const info:View.TransformationInfo = this.mTransformationInfo;
            //if (info == null || info.mMatrixIsIdentity || this.mAttachInfo == null) {
                outRect.set(this.mLeft, this.mTop, this.mRight, this.mBottom);
            //}
            //else {
            //    const tmpRect:RectF = this.mAttachInfo.mTmpTransformRect;
            //    tmpRect.set(0, 0, this.getWidth(), this.getHeight());
            //    info.mMatrix.mapRect(tmpRect);
            //    outRect.set(Math.floor(tmpRect.left) + this.mLeft, Math.floor(tmpRect.top) + this.mTop, Math.floor(tmpRect.right) + this.mLeft, Math.floor(tmpRect.bottom) + this.mTop);
            //}
        }
        getFocusedRect(r:Rect) {
            this.getDrawingRect(r);
        }
        getDrawingRect(outRect:Rect) {
            outRect.left = this.mScrollX;
            outRect.top = this.mScrollY;
            outRect.right = this.mScrollX + (this.mRight - this.mLeft);
            outRect.bottom = this.mScrollY + (this.mBottom - this.mTop);
        }

        /**
         * If some part of this view is not clipped by any of its parents, then
         * return that area in r in global (root) coordinates. To convert r to local
         * coordinates (without taking possible View rotations into account), offset
         * it by -globalOffset (e.g. r.offset(-globalOffset.x, -globalOffset.y)).
         * If the view is completely clipped or translated out, return false.
         *
         * @param r If true is returned, r holds the global coordinates of the
         *        visible portion of this view.
         * @param globalOffset If true is returned, globalOffset holds the dx,dy
         *        between this view and its root. globalOffet may be null.
         * @return true if r is non-empty (i.e. part of the view is visible at the
         *         root level.
         */
        getGlobalVisibleRect(r:Rect, globalOffset:Point = null):boolean  {
            let width:number = this.mRight - this.mLeft;
            let height:number = this.mBottom - this.mTop;
            if (width > 0 && height > 0) {
                r.set(0, 0, width, height);
                if (globalOffset != null) {
                    globalOffset.set(-this.mScrollX, -this.mScrollY);
                }
                return this.mParent == null || this.mParent.getChildVisibleRect(this, r, globalOffset);
            }
            return false;
        }

        getMeasuredWidth():number {
            return this.mMeasuredWidth & View.MEASURED_SIZE_MASK;
        }
        getMeasuredWidthAndState() {
            return this.mMeasuredWidth;
        }
        getMeasuredHeight():number {
            return this.mMeasuredHeight & View.MEASURED_SIZE_MASK;
        }
        getMeasuredHeightAndState():number {
            return this.mMeasuredHeight;
        }
        getMeasuredState():number {
            return (this.mMeasuredWidth&View.MEASURED_STATE_MASK)
                | ((this.mMeasuredHeight>>View.MEASURED_HEIGHT_STATE_SHIFT)
                & (View.MEASURED_STATE_MASK>>View.MEASURED_HEIGHT_STATE_SHIFT));
        }
        measure(widthMeasureSpec:number, heightMeasureSpec:number) {

            // Suppress sign extension for the low bytes
            let key = widthMeasureSpec << 32 | heightMeasureSpec & 0xffffffff;
            if (this.mMeasureCache == null) this.mMeasureCache = new SparseArray<number>();

            if ((this.mPrivateFlags & View.PFLAG_FORCE_LAYOUT) == View.PFLAG_FORCE_LAYOUT ||
                widthMeasureSpec != this.mOldWidthMeasureSpec ||
                heightMeasureSpec != this.mOldHeightMeasureSpec) {

                // first clears the measured dimension flag
                this.mPrivateFlags &= ~View.PFLAG_MEASURED_DIMENSION_SET;

                //resolveRtlPropertiesIfNeeded();

                let cacheIndex = (this.mPrivateFlags & View.PFLAG_FORCE_LAYOUT) == View.PFLAG_FORCE_LAYOUT ? -1 :
                    this.mMeasureCache.indexOfKey(key);
                if (cacheIndex < 0) {
                    // measure ourselves, this should set the measured dimension flag back
                    this.onMeasure(widthMeasureSpec, heightMeasureSpec);
                    this.mPrivateFlags3 &= ~View.PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT;
                } else {
                    let value = this.mMeasureCache.valueAt(cacheIndex);
                    // Casting a long to int drops the high 32 bits, no mask needed
                    this.setMeasuredDimension(value >> 32, value);
                    this.mPrivateFlags3 |= View.PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT;
                }

                // flag not set, setMeasuredDimension() was not invoked, we raise
                // an exception to warn the developer
                if ((this.mPrivateFlags & View.PFLAG_MEASURED_DIMENSION_SET) != View.PFLAG_MEASURED_DIMENSION_SET) {
                    throw new Error("onMeasure() did not set the"
                        + " measured dimension by calling"
                        + " setMeasuredDimension()");
                }

                this.mPrivateFlags |= View.PFLAG_LAYOUT_REQUIRED;
            }

            this.mOldWidthMeasureSpec = widthMeasureSpec;
            this.mOldHeightMeasureSpec = heightMeasureSpec;

            this.mMeasureCache.put(key, (this.mMeasuredWidth) << 32 | this.mMeasuredHeight & 0xffffffff); // suppress sign extension
        }

        protected onMeasure(widthMeasureSpec, heightMeasureSpec):void {
            this.setMeasuredDimension(View.getDefaultSize(this.getSuggestedMinimumWidth(), widthMeasureSpec),
                View.getDefaultSize(this.getSuggestedMinimumHeight(), heightMeasureSpec));
        }

        setMeasuredDimension(measuredWidth, measuredHeight) {
            this.mMeasuredWidth = measuredWidth;
            this.mMeasuredHeight = measuredHeight;

            this.mPrivateFlags |= View.PFLAG_MEASURED_DIMENSION_SET;
        }

        static combineMeasuredStates(curState, newState) {
            return curState | newState;
        }

        static resolveSize(size, measureSpec) {
            return View.resolveSizeAndState(size, measureSpec, 0) & View.MEASURED_SIZE_MASK;
        }

        static resolveSizeAndState(size, measureSpec, childMeasuredState) {
            let MeasureSpec = View.MeasureSpec;
            let result = size;
            let specMode = MeasureSpec.getMode(measureSpec);
            let specSize = MeasureSpec.getSize(measureSpec);
            switch (specMode) {
                case MeasureSpec.UNSPECIFIED:
                    result = size;
                    break;
                case MeasureSpec.AT_MOST:
                    if (specSize < size) {
                        result = specSize | View.MEASURED_STATE_TOO_SMALL;
                    } else {
                        result = size;
                    }
                    break;
                case MeasureSpec.EXACTLY:
                    result = specSize;
                    break;
            }
            return result | (childMeasuredState & View.MEASURED_STATE_MASK);
        }

        static getDefaultSize(size, measureSpec) {
            let MeasureSpec = View.MeasureSpec;
            let result = size;
            let specMode = MeasureSpec.getMode(measureSpec);
            let specSize = MeasureSpec.getSize(measureSpec);

            switch (specMode) {
                case MeasureSpec.UNSPECIFIED:
                    result = size;
                    break;
                case MeasureSpec.AT_MOST:
                case MeasureSpec.EXACTLY:
                    result = specSize;
                    break;
            }
            return result;
        }

        getSuggestedMinimumHeight() {
            return (this.mBackground == null) ? this.mMinHeight :
                Math.max(this.mMinHeight, this.mBackground.getMinimumHeight());
        }

        getSuggestedMinimumWidth() {
            return (this.mBackground == null) ? this.mMinWidth :
                Math.max(this.mMinWidth, this.mBackground.getMinimumWidth());
        }

        getMinimumHeight() {
            return this.mMinHeight;
        }

        setMinimumHeight(minHeight) {
            this.mMinHeight = minHeight;
            this.requestLayout();
        }

        getMinimumWidth() {
            return this.mMinWidth;
        }

        setMinimumWidth(minWidth) {
            this.mMinWidth = minWidth;
            this.requestLayout();
        }

        private _invalidateRect(l:number, t:number, r:number, b:number){
            if (this.skipInvalidate()) {
                return;
            }
            if ((this.mPrivateFlags & (View.PFLAG_DRAWN | View.PFLAG_HAS_BOUNDS)) == (View.PFLAG_DRAWN | View.PFLAG_HAS_BOUNDS) ||
                (this.mPrivateFlags & View.PFLAG_DRAWING_CACHE_VALID) == View.PFLAG_DRAWING_CACHE_VALID ||
                (this.mPrivateFlags & View.PFLAG_INVALIDATED) != View.PFLAG_INVALIDATED) {
                this.mPrivateFlags &= ~View.PFLAG_DRAWING_CACHE_VALID;
                this.mPrivateFlags |= View.PFLAG_INVALIDATED;
                this.mPrivateFlags |= View.PFLAG_DIRTY;
                const p = this.mParent;
                const ai = this.mAttachInfo;
                //noinspection PointlessBooleanExpression,ConstantConditions
//            if (!HardwareRenderer.RENDER_DIRTY_REGIONS) {
//                if (p != null && ai != null && ai.mHardwareAccelerated) {
//                    // fast-track for GL-enabled applications; just invalidate the whole hierarchy
//                    // with a null dirty rect, which tells the ViewAncestor to redraw everything
//                    p.invalidateChild(this, null);
//                    return;
//                }
//            }
                if (p != null && ai != null && l < r && t < b) {
                    const scrollX = this.mScrollX;
                    const scrollY = this.mScrollY;
                    const tmpr = ai.mTmpInvalRect;
                    tmpr.set(l - scrollX, t - scrollY, r - scrollX, b - scrollY);
                    p.invalidateChild(this, tmpr);
                }
            }
        }
        private _invalidateCache(invalidateCache=true){
            if (this.skipInvalidate()) {
                return;
            }
            if ((this.mPrivateFlags & (View.PFLAG_DRAWN | View.PFLAG_HAS_BOUNDS)) == (View.PFLAG_DRAWN | View.PFLAG_HAS_BOUNDS) ||
                (invalidateCache && (this.mPrivateFlags & View.PFLAG_DRAWING_CACHE_VALID) == View.PFLAG_DRAWING_CACHE_VALID) ||
                (this.mPrivateFlags & View.PFLAG_INVALIDATED) != View.PFLAG_INVALIDATED || this.isOpaque() != this.mLastIsOpaque) {
                this.mLastIsOpaque = this.isOpaque();
                this.mPrivateFlags &= ~View.PFLAG_DRAWN;
                this.mPrivateFlags |= View.PFLAG_DIRTY;
                if (invalidateCache) {
                    this.mPrivateFlags |= View.PFLAG_INVALIDATED;
                    this.mPrivateFlags &= ~View.PFLAG_DRAWING_CACHE_VALID;
                }
                const ai = this.mAttachInfo;
                const p = this.mParent;

                if (p != null && ai != null) {
                    const r = ai.mTmpInvalRect;
                    r.set(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop);
                    // Don't call invalidate -- we don't want to internally scroll
                    // our own bounds
                    p.invalidateChild(this, r);
                }
            }
        }
        invalidate();
        invalidate(invalidateCache:boolean);
        invalidate(dirty:Rect);
        invalidate(l:number, t:number, r:number, b:number);
        invalidate(...args){
            if(args.length===0 || (args.length===1&& typeof args[0]==='boolean' )){
                this._invalidateCache(args[0]);

            }else if(args.length===1 && args[0] instanceof Rect){
                let rect:Rect = args[0];
                this._invalidateRect(rect.left, rect.top, rect.right, rect.bottom);

            }else if(args.length===4){
                (<any>this)._invalidateRect(...args);
            }
        }
        invalidateViewProperty(invalidateParent:boolean, forceRedraw:boolean){
            if ((this.mPrivateFlags & View.PFLAG_DRAW_ANIMATION) == View.PFLAG_DRAW_ANIMATION) {
                if (invalidateParent) {
                    this.invalidateParentCaches();
                }
                if (forceRedraw) {
                    this.mPrivateFlags |= View.PFLAG_DRAWN; // force another invalidation with the new orientation
                }
                this.invalidate(false);
            } else {
                const ai = this.mAttachInfo;
                const p = this.mParent;
                if (p != null && ai != null) {
                    const r = ai.mTmpInvalRect;
                    r.set(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop);
                    if (this.mParent instanceof ViewGroup) {
                        (<ViewGroup>this.mParent).invalidateChildFast(this, r);
                    } else {
                        this.mParent.invalidateChild(this, r);
                    }
                }
            }
        }
        invalidateParentCaches(){
            if (this.mParent instanceof View) {
                (<any> this.mParent).mPrivateFlags |= View.PFLAG_INVALIDATED;
            }
        }
        invalidateParentIfNeeded(){
            //no HardwareAccelerated, no need
            //if (isHardwareAccelerated() && mParent instanceof View) {
            //    ((View) mParent).invalidate(true);
            //}
        }

        postInvalidate(l?:number, t?:number, r?:number, b?:number){
            this.postInvalidateDelayed(0, l, t, r, b);
        }

        postInvalidateDelayed(delayMilliseconds:number, left?:number, top?:number, right?:number, bottom?:number){
            const attachInfo = this.mAttachInfo;
            if (attachInfo != null) {
                if(!Number.isInteger(left) || !Number.isInteger(top) || !Number.isInteger(right) || !Number.isInteger(bottom)){
                    attachInfo.mViewRootImpl.dispatchInvalidateDelayed(this, delayMilliseconds);
                }else{
                    const info = View.AttachInfo.InvalidateInfo.obtain();
                    info.target = this;
                    info.left = left;
                    info.top = top;
                    info.right = right;
                    info.bottom = bottom;

                    attachInfo.mViewRootImpl.dispatchInvalidateRectDelayed(info, delayMilliseconds);
                }
            }


        }
        postInvalidateOnAnimation(left?:number, top?:number, right?:number, bottom?:number){
            const attachInfo = this.mAttachInfo;
            if (attachInfo != null) {
                if(!Number.isInteger(left) || !Number.isInteger(top) || !Number.isInteger(right) || !Number.isInteger(bottom)){
                    attachInfo.mViewRootImpl.dispatchInvalidateOnAnimation(this);
                }else{
                    const info = View.AttachInfo.InvalidateInfo.obtain();
                    info.target = this;
                    info.left = left;
                    info.top = top;
                    info.right = right;
                    info.bottom = bottom;

                    attachInfo.mViewRootImpl.dispatchInvalidateRectOnAnimation(info);
                }
            }
        }
        private skipInvalidate() {
            return (this.mViewFlags & View.VISIBILITY_MASK) != View.VISIBLE
                //TODO when animation ok
                //&&mCurrentAnimation == null
                //TODO when transition ok
                //&&(!(mParent instanceof ViewGroup) ||
                //!mParent.isViewTransitioning(this))
                ;
        }

        isOpaque():boolean {
            return (this.mPrivateFlags & View.PFLAG_OPAQUE_MASK) == View.PFLAG_OPAQUE_MASK &&
                this.getFinalAlpha() >= 1;
        }
        private computeOpaqueFlags() {
            // Opaque if:
            //   - Has a background
            //   - Background is opaque
            //   - Doesn't have scrollbars or scrollbars overlay

            if (this.mBackground != null && this.mBackground.getOpacity() == PixelFormat.OPAQUE) {
                this.mPrivateFlags |= View.PFLAG_OPAQUE_BACKGROUND;
            } else {
                this.mPrivateFlags &= ~View.PFLAG_OPAQUE_BACKGROUND;
            }

            const flags = this.mViewFlags;
            if (((flags & View.SCROLLBARS_VERTICAL) == 0 && (flags & View.SCROLLBARS_HORIZONTAL) == 0)
                ////scroll bar is always inside_overlay
                //||
                //(flags & View.SCROLLBARS_STYLE_MASK) == View.SCROLLBARS_INSIDE_OVERLAY ||
                //(flags & View.SCROLLBARS_STYLE_MASK) == View.SCROLLBARS_OUTSIDE_OVERLAY
            ) {
                this.mPrivateFlags |= View.PFLAG_OPAQUE_SCROLLBARS;
            } else {
                this.mPrivateFlags &= ~View.PFLAG_OPAQUE_SCROLLBARS;
            }
        }
        getLayerType() {
            return this.mLayerType;
        }
        setClipBounds(clipBounds:Rect) {
            if (clipBounds != null) {
                if (clipBounds.equals(this.mClipBounds)) {
                    return;
                }
                if (this.mClipBounds == null) {
                    this.invalidate();
                    this.mClipBounds = new Rect(clipBounds);
                } else {
                    this.invalidate(Math.min(this.mClipBounds.left, clipBounds.left),
                        Math.min(this.mClipBounds.top, clipBounds.top),
                        Math.max(this.mClipBounds.right, clipBounds.right),
                        Math.max(this.mClipBounds.bottom, clipBounds.bottom));
                    this.mClipBounds.set(clipBounds);
                }
            } else {
                if (this.mClipBounds != null) {
                    this.invalidate();
                    this.mClipBounds = null;
                }
            }
        }
        getClipBounds():Rect {
            return (this.mClipBounds != null) ? new Rect(this.mClipBounds) : null;
        }


        getDrawingTime() {
            return this.mAttachInfo != null ? this.mAttachInfo.mDrawingTime : 0;
        }

        drawFromParent(canvas:Canvas, parent:ViewGroup, drawingTime:number):boolean {
            let useDisplayListProperties = false;
            let more = false;
            let childHasIdentityMatrix = true;//TODO when transform ok
            let flags = parent.mGroupFlags;
            let scalingRequired = false;
            let concatMatrix = false;
            let caching = false;
            let layerType = this.getLayerType();

            //let hardwareAccelerated = false;
            if ((flags & ViewGroup.FLAG_CHILDREN_DRAWN_WITH_CACHE) != 0 ||
                (flags & ViewGroup.FLAG_ALWAYS_DRAWN_WITH_CACHE) != 0) {
                caching = true;
            } else {
                caching = (layerType != View.LAYER_TYPE_NONE);
            }

            //let a = this.getAnimation();//TODO animation & Transformation
            //if (a != null) {
            //    more = drawAnimation(parent, drawingTime, a, scalingRequired);
            //    concatMatrix = a.willChangeTransformationMatrix();
            //    if (concatMatrix) {
            //        mPrivateFlags3 |= PFLAG3_VIEW_IS_ANIMATING_TRANSFORM;
            //    }
            //    transformToApply = parent.getChildTransformation();
            //} else {
            //    if (!useDisplayListProperties &&
            //        (flags & ViewGroup.FLAG_SUPPORT_STATIC_TRANSFORMATIONS) != 0) {
            //        let t = parent.getChildTransformation();
            //        const hasTransform = parent.getChildStaticTransformation(this, t);
            //        if (hasTransform) {
            //            final int transformType = t.getTransformationType();
            //            transformToApply = transformType != Transformation.TYPE_IDENTITY ? t : null;
            //            concatMatrix = (transformType & Transformation.TYPE_MATRIX) != 0;
            //        }
            //    }
            //}

            concatMatrix ==  concatMatrix || !childHasIdentityMatrix;
            this.mPrivateFlags |= View.PFLAG_DRAWN;

            if (!concatMatrix &&
                (flags & (ViewGroup.FLAG_SUPPORT_STATIC_TRANSFORMATIONS |
                ViewGroup.FLAG_CLIP_CHILDREN)) == ViewGroup.FLAG_CLIP_CHILDREN &&
                canvas.quickReject(this.mLeft, this.mTop, this.mRight, this.mBottom) &&
                (this.mPrivateFlags & View.PFLAG_DRAW_ANIMATION) == 0) {
                this.mPrivateFlags2 |= View.PFLAG2_VIEW_QUICK_REJECTED;
                return more;
            }
            this.mPrivateFlags2 &= ~View.PFLAG2_VIEW_QUICK_REJECTED;

            let cache:Canvas = null;
            if (caching) {
                if (layerType != View.LAYER_TYPE_NONE) {
                    layerType = View.LAYER_TYPE_SOFTWARE;
                    //this.buildDrawingCache(true);//TODO when cache impl
                }
                //cache = this.getDrawingCache(true);//TODO when cache impl
            }

            this.computeScroll();
            let sx = this.mScrollX;
            let sy = this.mScrollY;
            this.syncScrollToElement();

            let hasNoCache = cache == null;
            let offsetForScroll = cache == null;
            let restoreTo = canvas.save();
            if (offsetForScroll) {
                canvas.translate(this.mLeft - sx, this.mTop - sy);
            }else{
                canvas.translate(this.mLeft, this.mTop);
            }

            //TODO deal alpha
            let alpha = 1;

            if ((flags & ViewGroup.FLAG_CLIP_CHILDREN) == ViewGroup.FLAG_CLIP_CHILDREN &&
                !useDisplayListProperties && cache == null) {
                if (offsetForScroll) {
                    canvas.clipRect(sx, sy, sx + (this.mRight - this.mLeft), sy + (this.mBottom - this.mTop));
                } else {
                    if (!scalingRequired || cache == null) {
                        canvas.clipRect(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop);
                    } else {
                        canvas.clipRect(0, 0, cache.getWidth(), cache.getHeight());
                    }
                }
            }

            if (hasNoCache) {
                // Fast path for layouts with no backgrounds
                if ((this.mPrivateFlags & View.PFLAG_SKIP_DRAW) == View.PFLAG_SKIP_DRAW) {
                    this.mPrivateFlags &= ~View.PFLAG_DIRTY_MASK;
                    this.dispatchDraw(canvas);
                } else {
                    this.draw(canvas);
                }
            } else if (cache != null) {
                this.mPrivateFlags &= ~View.PFLAG_DIRTY_MASK;
                if (alpha < 1) {
                    //cachePaint.setAlpha((int) (alpha * 255));
                    parent.mGroupFlags |= ViewGroup.FLAG_ALPHA_LOWER_THAN_ONE;

                } else if  ((flags & ViewGroup.FLAG_ALPHA_LOWER_THAN_ONE) != 0) {
                    //cachePaint.setAlpha(255);
                    parent.mGroupFlags &= ~ViewGroup.FLAG_ALPHA_LOWER_THAN_ONE;
                }
                canvas.drawCanvas(cache, 0, 0);//TODO draw with alpha
            }


            if (restoreTo >= 0) {
                canvas.restoreToCount(restoreTo);
            }

            return more;
        }

        draw(canvas:Canvas):void {
            if (this.mClipBounds != null) {
                canvas.clipRect(this.mClipBounds);
            }
            let privateFlags = this.mPrivateFlags;
            const dirtyOpaque = (privateFlags & View.PFLAG_DIRTY_MASK) == View.PFLAG_DIRTY_OPAQUE &&
                (this.mAttachInfo == null || !this.mAttachInfo.mIgnoreDirtyState);
            this.mPrivateFlags = (privateFlags & ~View.PFLAG_DIRTY_MASK) | View.PFLAG_DRAWN;

            // draw the background, if needed
            if (!dirtyOpaque) {
                let background = this.mBackground;
                if (background != null) {
                    let scrollX = this.mScrollX;
                    let scrollY = this.mScrollY;

                    if (this.mBackgroundSizeChanged) {
                        background.setBounds(0, 0, this.mRight - this.mLeft, this.mBottom - this.mTop);
                        this.mBackgroundSizeChanged = false;
                    }

                    if ((scrollX | scrollY) == 0) {
                        background.draw(canvas);
                    } else {
                        canvas.translate(scrollX, scrollY);
                        background.draw(canvas);
                        canvas.translate(-scrollX, -scrollY);
                    }
                }
            }
            // draw the content
            if (!dirtyOpaque) this.onDraw(canvas);

            // draw the children
            this.dispatchDraw(canvas);

            //draw decorations (scrollbars)
            this.onDrawScrollBars(canvas);

            if (this.mOverlay != null && !this.mOverlay.isEmpty()) {
                this.mOverlay.getOverlayView().dispatchDraw(canvas);
            }

        }
        onDraw(canvas:Canvas):void {
        }
        dispatchDraw(canvas:Canvas):void {
        }
        onDrawScrollBars(canvas:Canvas) {
            // scrollbars are drawn only when the animation is running
            const cache = this.mScrollCache;
            if (cache != null) {

                let state = cache.state;

                if (state == ScrollabilityCache.OFF) {
                    return;
                }

                let invalidate = false;

                if (state == ScrollabilityCache.FADING) {
                    // We're fading -- get our fade interpolation
                    //if (cache.interpolatorValues == null) {
                    //    cache.interpolatorValues = new Array<number>(1);
                    //}
                    //let values = cache.interpolatorValues;

                    // Stops the animation if we're done
                    //if (cache.scrollBarInterpolator.timeToValues(values) ==
                    //    Interpolator.Result.FREEZE_END) {
                    //    cache.state = ScrollabilityCache.OFF;
                    //} else {
                    //    cache.scrollBar.setAlpha(Math.round(values[0]));
                    //}

                    cache._computeAlphaToScrollBar();

                    // This will make the scroll bars inval themselves after
                    // drawing. We only want this when we're fading so that
                    // we prevent excessive redraws
                    invalidate = true;
                } else {
                    // We're just on -- but we may have been fading before so
                    // reset alpha
                    cache.scrollBar.setAlpha(255);
                }


                const viewFlags = this.mViewFlags;

                const drawHorizontalScrollBar =
                    (viewFlags & View.SCROLLBARS_HORIZONTAL) == View.SCROLLBARS_HORIZONTAL;
                const drawVerticalScrollBar =
                    (viewFlags & View.SCROLLBARS_VERTICAL) == View.SCROLLBARS_VERTICAL
                    && !this.isVerticalScrollBarHidden();

                if (drawVerticalScrollBar || drawHorizontalScrollBar) {
                    const width = this.mRight - this.mLeft;
                    const height = this.mBottom - this.mTop;

                    const scrollBar = cache.scrollBar;

                    const scrollX = this.mScrollX;
                    const scrollY = this.mScrollY;
                    const inside = true;//(viewFlags & View.SCROLLBARS_OUTSIDE_MASK) == 0 ? ~0 : 0;

                    let left;
                    let top;
                    let right;
                    let bottom;

                    if (drawHorizontalScrollBar) {
                        let size = scrollBar.getSize(false);
                        if (size <= 0) {
                            size = cache.scrollBarSize;
                        }

                        scrollBar.setParameters(this.computeHorizontalScrollRange(),
                            this.computeHorizontalScrollOffset(),
                            this.computeHorizontalScrollExtent(), false);
                        const verticalScrollBarGap = drawVerticalScrollBar ?
                            this.getVerticalScrollbarWidth() : 0;
                        top = scrollY + height - size;// - (this.mUserPaddingBottom & inside);
                        left = scrollX + (this.mPaddingLeft);// & inside);
                        right = scrollX + width - /*(this.mUserPaddingRight & inside)*/ - verticalScrollBarGap;
                        bottom = top + size;
                        this.onDrawHorizontalScrollBar(canvas, scrollBar, left, top, right, bottom);
                        if (invalidate) {
                            this.invalidate(left, top, right, bottom);
                        }
                    }

                    if (drawVerticalScrollBar) {
                        let size = scrollBar.getSize(true);
                        if (size <= 0) {
                            size = cache.scrollBarSize;
                        }

                        scrollBar.setParameters(this.computeVerticalScrollRange(),
                            this.computeVerticalScrollOffset(),
                            this.computeVerticalScrollExtent(), true);
                        //let verticalScrollbarPosition = this.mVerticalScrollbarPosition;
                        //if (verticalScrollbarPosition == View.SCROLLBAR_POSITION_DEFAULT) {
                        //    verticalScrollbarPosition = isLayoutRtl() ?
                        //        View.SCROLLBAR_POSITION_LEFT : View.SCROLLBAR_POSITION_RIGHT;
                        //}
                        //switch (verticalScrollbarPosition) {
                        //    default:
                        //    case View.SCROLLBAR_POSITION_RIGHT:
                        //        left = scrollX + width - size - (this.mUserPaddingRight & inside);
                        //        break;
                        //    case View.SCROLLBAR_POSITION_LEFT:
                        //        left = scrollX + (mUserPaddingLeft & inside);
                        //        break;
                        //}
                        left = scrollX + width - size;// - (this.mUserPaddingRight & inside);
                        top = scrollY + (this.mPaddingTop);// & inside);
                        right = left + size;
                        bottom = scrollY + height;// - (this.mUserPaddingBottom & inside);
                        this.onDrawVerticalScrollBar(canvas, scrollBar, left, top, right, bottom);
                        if (invalidate) {
                            this.invalidate(left, top, right, bottom);
                        }
                    }
                }
            }
        }

        isVerticalScrollBarHidden():boolean {
            return false;
        }
        onDrawHorizontalScrollBar(canvas:Canvas, scrollBar:Drawable, l:number, t:number, r:number, b:number) {
            scrollBar.setBounds(l, t, r, b);
            scrollBar.draw(canvas);
        }

        onDrawVerticalScrollBar(canvas:Canvas, scrollBar:Drawable, l:number, t:number, r:number, b:number) {
            scrollBar.setBounds(l, t, r, b);
            scrollBar.draw(canvas);
        }

        isHardwareAccelerated():boolean{
            return false;//Hardware Accelerate not impl (may use webgl accelerate later?)
        }

        setDrawingCacheEnabled(enabled:boolean) {
            this.mCachingFailed = false;
            this.setFlags(enabled ? View.DRAWING_CACHE_ENABLED : 0, View.DRAWING_CACHE_ENABLED);
        }
        isDrawingCacheEnabled():boolean {
            return (this.mViewFlags & View.DRAWING_CACHE_ENABLED) == View.DRAWING_CACHE_ENABLED;
        }

        /**
         * Setting a solid background color for the drawing cache's bitmaps will improve
         * performance and memory usage. Note, though that this should only be used if this
         * view will always be drawn on top of a solid color.
         *
         * @param color The background color to use for the drawing cache's bitmap
         *
         * @see #setDrawingCacheEnabled(boolean)
         * @see #buildDrawingCache()
         * @see #getDrawingCache()
         */
        setDrawingCacheBackgroundColor(color:number):void  {
            if (color != this.mDrawingCacheBackgroundColor) {
                this.mDrawingCacheBackgroundColor = color;
                this.mPrivateFlags &= ~View.PFLAG_DRAWING_CACHE_VALID;
            }
        }

        /**
         * @see #setDrawingCacheBackgroundColor(int)
         *
         * @return The background color to used for the drawing cache's bitmap
         */
        getDrawingCacheBackgroundColor():number  {
            return this.mDrawingCacheBackgroundColor;
        }
        destroyDrawingCache() {
            //TODO impl draw cache
        }
        setWillNotDraw(willNotDraw:boolean) {
            this.setFlags(willNotDraw ? View.WILL_NOT_DRAW : 0, View.DRAW_MASK);
        }
        willNotDraw():boolean {
            return (this.mViewFlags & View.DRAW_MASK) == View.WILL_NOT_DRAW;
        }
        setWillNotCacheDrawing(willNotCacheDrawing:boolean) {
            this.setFlags(willNotCacheDrawing ? View.WILL_NOT_CACHE_DRAWING : 0, View.WILL_NOT_CACHE_DRAWING);
        }
        willNotCacheDrawing():boolean {
            return (this.mViewFlags & View.WILL_NOT_CACHE_DRAWING) == View.WILL_NOT_CACHE_DRAWING;
        }


        invalidateDrawable(drawable:Drawable):void{
            if (this.verifyDrawable(drawable)) {
                const dirty = drawable.getBounds();
                const scrollX = this.mScrollX;
                const scrollY = this.mScrollY;

                this.invalidate(dirty.left + scrollX, dirty.top + scrollY,
                    dirty.right + scrollX, dirty.bottom + scrollY);
            }
        }
        scheduleDrawable(who:Drawable, what:Runnable, when:number):void{
            if (this.verifyDrawable(who) && what != null) {
                const delay = when - SystemClock.uptimeMillis();
                if (this.mAttachInfo != null) {
                    this.mAttachInfo.mHandler.postAtTime(what, who, when);
                } else {
                    ViewRootImpl.getRunQueue().postDelayed(what, delay);
                }
            }
        }
        unscheduleDrawable(who:Drawable, what?:Runnable){
            if (this.verifyDrawable(who) && what != null) {
                if (this.mAttachInfo != null) {
                    this.mAttachInfo.mHandler.removeCallbacks(what, who);
                } else {
                    ViewRootImpl.getRunQueue().removeCallbacks(what);
                }

            }else if(what===null){
                if (this.mAttachInfo != null && who != null) {
                    this.mAttachInfo.mHandler.removeCallbacksAndMessages(who);
                }
            }
        }

        verifyDrawable(who:Drawable):boolean {
            return who == this.mBackground;
        }
        drawableStateChanged() {
            this.getDrawableState();//fire may state change to stateAttrList

            let d = this.mBackground;
            if (d != null && d.isStateful()) {
                d.setState(this.getDrawableState());
            }
        }
        refreshDrawableState() {
            this.mPrivateFlags |= View.PFLAG_DRAWABLE_STATE_DIRTY;
            this.drawableStateChanged();

            let parent = this.mParent;
            if (parent != null) {
                parent.childDrawableStateChanged(this);
            }
        }
        getDrawableState():Array<number> {
            if ((this.mDrawableState != null) && ((this.mPrivateFlags & View.PFLAG_DRAWABLE_STATE_DIRTY) == 0)) {
                return this.mDrawableState;
            } else {
                let oldDrawableState = this.mDrawableState;
                this.mDrawableState = this.onCreateDrawableState(0);
                this.mPrivateFlags &= ~View.PFLAG_DRAWABLE_STATE_DIRTY;
                this._fireStateChangeToAttribute(oldDrawableState, this.mDrawableState);
                return this.mDrawableState;
            }
        }
        onCreateDrawableState(extraSpace:number):Array<number> {
            if ((this.mViewFlags & View.DUPLICATE_PARENT_STATE) == View.DUPLICATE_PARENT_STATE &&
                this.mParent instanceof View) {
                return (<View><any>this.mParent).onCreateDrawableState(extraSpace);
            }

            let drawableState:Array<number>;

            let privateFlags = this.mPrivateFlags;

            let viewStateIndex = 0;
            if ((privateFlags & View.PFLAG_PRESSED) != 0) viewStateIndex |= View.VIEW_STATE_PRESSED;
            if ((this.mViewFlags & View.ENABLED_MASK) == View.ENABLED) viewStateIndex |= View.VIEW_STATE_ENABLED;
            if (this.isFocused()) viewStateIndex |= View.VIEW_STATE_FOCUSED;
            if ((privateFlags & View.PFLAG_SELECTED) != 0) viewStateIndex |= View.VIEW_STATE_SELECTED;
            //if (this.hasWindowFocus()) viewStateIndex |= View.VIEW_STATE_WINDOW_FOCUSED;//TODO impl when focus ok
            if ((privateFlags & View.PFLAG_ACTIVATED) != 0) viewStateIndex |= View.VIEW_STATE_ACTIVATED;
//        if (mAttachInfo != null && mAttachInfo.mHardwareAccelerationRequested &&
//                HardwareRenderer.isAvailable()) {
//            // This is set if HW acceleration is requested, even if the current
//            // process doesn't allow it.  This is just to allow app preview
//            // windows to better match their app.
//            viewStateIndex |= VIEW_STATE_ACCELERATED;
//        }
//            if ((privateFlags & View.PFLAG_HOVERED) != 0) viewStateIndex |= View.VIEW_STATE_HOVERED;

            const privateFlags2 = this.mPrivateFlags2;
            //if ((privateFlags2 & View.PFLAG2_DRAG_CAN_ACCEPT) != 0) viewStateIndex |= View.VIEW_STATE_DRAG_CAN_ACCEPT;//no drag state
            //if ((privateFlags2 & View.PFLAG2_DRAG_HOVERED) != 0) viewStateIndex |= View.VIEW_STATE_DRAG_HOVERED;

            drawableState = View.VIEW_STATE_SETS[viewStateIndex];

            //noinspection ConstantIfStatement
            //if (false) {
            //    Log.i("View", "drawableStateIndex=" + viewStateIndex);
            //    Log.i("View", toString()
            //        + " pressed=" + ((privateFlags & PFLAG_PRESSED) != 0)
            //        + " en=" + ((mViewFlags & ENABLED_MASK) == ENABLED)
            //        + " fo=" + hasFocus()
            //        + " sl=" + ((privateFlags & PFLAG_SELECTED) != 0)
            //        + " wf=" + hasWindowFocus()
            //        + ": " + Arrays.toString(drawableState));
            //}

            if (extraSpace == 0) {
                return drawableState;
            }

            let fullState:Array<number>;
            if (drawableState != null) {
                fullState = new Array<number>(drawableState.length + extraSpace);
                System.arraycopy(drawableState, 0, fullState, 0, drawableState.length);
            } else {
                fullState = new Array<number>(extraSpace);
            }

            return fullState;
        }
        static mergeDrawableStates(baseState:Array<number>, additionalState:Array<number>) {
            const N = baseState.length;
            let i = N - 1;
            while (i >= 0 && baseState[i] == 0) {
                i--;
            }
            System.arraycopy(additionalState, 0, baseState, i + 1, additionalState.length);
            return baseState;
        }

        jumpDrawablesToCurrentState() {
            if (this.mBackground != null) {
                this.mBackground.jumpToCurrentState();
            }
        }
        setBackgroundColor(color:number) {
            if (this.mBackground instanceof ColorDrawable) {
                (<ColorDrawable>this.mBackground.mutate()).setColor(color);
                this.computeOpaqueFlags();
                //this.mBackgroundResource = 0;
            } else {
                this.setBackground(new ColorDrawable(color));
            }
        }
        setBackground(background:Drawable) {
            this.setBackgroundDrawable(background);
        }
        setBackgroundDrawable(background:Drawable) {
            this.computeOpaqueFlags();

            if (background == this.mBackground) {
                return;
            }

            let requestLayout = false;

            //this.mBackgroundResource = 0;

            /*
             * Regardless of whether we're setting a new background or not, we want
             * to clear the previous drawable.
             */
            if (this.mBackground != null) {
                this.mBackground.setCallback(null);
                this.unscheduleDrawable(this.mBackground);
            }

            if (background != null) {
                let padding = new Rect();
                //this.resetResolvedDrawables();
                //background.setLayoutDirection(getLayoutDirection());
                if (background.getPadding(padding)) {
                    //this.resetResolvedPadding();
                    this.setPadding(padding.left, padding.top, padding.right, padding.bottom);
                }

                // Compare the minimum sizes of the old Drawable and the new.  If there isn't an old or
                // if it has a different minimum size, we should layout again
                if (this.mBackground == null || this.mBackground.getMinimumHeight() != background.getMinimumHeight() ||
                    this.mBackground.getMinimumWidth() != background.getMinimumWidth()) {
                    requestLayout = true;
                }

                background.setCallback(this);
                if (background.isStateful()) {
                    background.setState(this.getDrawableState());
                }
                background.setVisible(this.getVisibility() == View.VISIBLE, false);
                this.mBackground = background;

                if ((this.mPrivateFlags & View.PFLAG_SKIP_DRAW) != 0) {
                    this.mPrivateFlags &= ~View.PFLAG_SKIP_DRAW;
                    this.mPrivateFlags |= View.PFLAG_ONLY_DRAWS_BACKGROUND;
                    requestLayout = true;
                }
            } else {
                /* Remove the background */
                this.mBackground = null;

                if ((this.mPrivateFlags & View.PFLAG_ONLY_DRAWS_BACKGROUND) != 0) {
                    /*
                     * This view ONLY drew the background before and we're removing
                     * the background, so now it won't draw anything
                     * (hence we SKIP_DRAW)
                     */
                    this.mPrivateFlags &= ~View.PFLAG_ONLY_DRAWS_BACKGROUND;
                    this.mPrivateFlags |= View.PFLAG_SKIP_DRAW;
                }

                /*
                 * When the background is set, we try to apply its padding to this
                 * View. When the background is removed, we don't touch this View's
                 * padding. This is noted in the Javadocs. Hence, we don't need to
                 * requestLayout(), the invalidate() below is sufficient.
                 */

                // The old background's minimum size could have affected this
                // View's layout, so let's requestLayout
                requestLayout = true;
            }

            this.computeOpaqueFlags();

            if (requestLayout) {
                this.requestLayout();
            }

            this.mBackgroundSizeChanged = true;
            this.invalidate(true);
        }

        getAnimation() {
            //TODO animation
            return null;
        }

        protected computeHorizontalScrollRange():number {
            return this.getWidth();
        }
        protected computeHorizontalScrollOffset():number {
            return this.mScrollX;
        }
        protected computeHorizontalScrollExtent():number {
            return this.getWidth();
        }
        protected computeVerticalScrollRange():number {
            return this.getHeight();
        }
        protected computeVerticalScrollOffset():number {
            return this.mScrollY;
        }
        protected computeVerticalScrollExtent():number {
            return this.getHeight();
        }
        canScrollHorizontally(direction:number):boolean {
            const offset = this.computeHorizontalScrollOffset();
            const range = this.computeHorizontalScrollRange() - this.computeHorizontalScrollExtent();
            if (range == 0) return false;
            if (direction < 0) {
                return offset > 0;
            } else {
                return offset < range - 1;
            }
        }
        canScrollVertically(direction:number):boolean {
            const offset = this.computeVerticalScrollOffset();
            const range = this.computeVerticalScrollRange() - this.computeVerticalScrollExtent();
            if (range == 0) return false;
            if (direction < 0) {
                return offset > 0;
            } else {
                return offset < range - 1;
            }
        }

        overScrollBy(deltaX:number, deltaY:number, scrollX:number, scrollY:number,
                     scrollRangeX:number, scrollRangeY:number, maxOverScrollX:number, maxOverScrollY:number,
                     isTouchEvent:boolean):boolean {
            const overScrollMode = this.mOverScrollMode;
            const canScrollHorizontal =
                this.computeHorizontalScrollRange() > this.computeHorizontalScrollExtent();
            const canScrollVertical =
                this.computeVerticalScrollRange() > this.computeVerticalScrollExtent();
            const overScrollHorizontal = overScrollMode == View.OVER_SCROLL_ALWAYS ||
                (overScrollMode == View.OVER_SCROLL_IF_CONTENT_SCROLLS && canScrollHorizontal);
            const overScrollVertical = overScrollMode == View.OVER_SCROLL_ALWAYS ||
                (overScrollMode == View.OVER_SCROLL_IF_CONTENT_SCROLLS && canScrollVertical);


            //over drag
            if(isTouchEvent) {
                if ((deltaX < 0 && scrollX <= 0) || (deltaX > 0 && scrollX >= scrollRangeX)) {
                    deltaX /= 2;
                }
                if ((deltaY < 0 && scrollY <= 0) || (deltaY > 0 && scrollY >= scrollRangeY)) {
                    deltaY /= 2;
                }
            }



            let newScrollX = scrollX + deltaX;
            if (!overScrollHorizontal) {
                maxOverScrollX = 0;
            }

            let newScrollY = scrollY + deltaY;
            if (!overScrollVertical) {
                maxOverScrollY = 0;
            }

            // Clamp values if at the limits and record
            const left = -maxOverScrollX;
            const right = maxOverScrollX + scrollRangeX;
            const top = -maxOverScrollY;
            const bottom = maxOverScrollY + scrollRangeY;

            let clampedX = false;
            if (newScrollX > right) {
                newScrollX = right;
                clampedX = true;
            } else if (newScrollX < left) {
                newScrollX = left;
                clampedX = true;
            }

            let clampedY = false;
            if (newScrollY > bottom) {
                newScrollY = bottom;
                clampedY = true;
            } else if (newScrollY < top) {
                newScrollY = top;
                clampedY = true;
            }

            this.onOverScrolled(newScrollX, newScrollY, clampedX, clampedY);

            return clampedX || clampedY;
        }
        protected onOverScrolled(scrollX:number, scrollY:number, clampedX:boolean, clampedY:boolean) {
            // Intentionally empty.
        }
        getOverScrollMode() {
            return this.mOverScrollMode;
        }
        setOverScrollMode(overScrollMode:number) {
            if (overScrollMode != View.OVER_SCROLL_ALWAYS &&
                overScrollMode != View.OVER_SCROLL_IF_CONTENT_SCROLLS &&
                overScrollMode != View.OVER_SCROLL_NEVER) {
                throw new Error("Invalid overscroll mode " + overScrollMode);
            }
            this.mOverScrollMode = overScrollMode;
        }
        getVerticalScrollFactor():number {
            if (this.mVerticalScrollFactor == 0) {
                this.mVerticalScrollFactor = Resources.getDisplayMetrics().density * 1;
            }
            return this.mVerticalScrollFactor;
        }
        getHorizontalScrollFactor():number {
            // TODO: Should use something else.
            return this.getVerticalScrollFactor();
        }
        computeScroll() {
        }
        scrollTo(x:number, y:number) {
            if (this.mScrollX != x || this.mScrollY != y) {
                let oldX = this.mScrollX;
                let oldY = this.mScrollY;
                this.mScrollX = x;
                this.mScrollY = y;
                this.invalidateParentCaches();
                this.onScrollChanged(this.mScrollX, this.mScrollY, oldX, oldY);
                if (!this.awakenScrollBars()) {
                    this.postInvalidateOnAnimation();
                }
            }
        }
        scrollBy(x:number, y:number) {
            this.scrollTo(this.mScrollX + x, this.mScrollY + y);
        }

        private initialAwakenScrollBars() {
            return this.mScrollCache != null &&
                this.awakenScrollBars(this.mScrollCache.scrollBarDefaultDelayBeforeFade * 4, true);
        }

        awakenScrollBars(startDelay?:number, invalidate=true):boolean{
            const scrollCache = this.mScrollCache;
            if(scrollCache==null) return false;
            startDelay = startDelay || scrollCache.scrollBarDefaultDelayBeforeFade

            if (scrollCache == null || !scrollCache.fadeScrollBars) {
                return false;
            }

            if (scrollCache.scrollBar == null) {
                scrollCache.scrollBar = new ScrollBarDrawable();
            }

            if (this.isHorizontalScrollBarEnabled() || this.isVerticalScrollBarEnabled()) {

                if (invalidate) {
                    // Invalidate to show the scrollbars
                    this.postInvalidateOnAnimation();
                }

                if (scrollCache.state == ScrollabilityCache.OFF) {
                    // FIX-ME: this is copied from WindowManagerService.
                    // We should get this value from the system when it
                    // is possible to do so.
                    const KEY_REPEAT_FIRST_DELAY = 750;
                    startDelay = Math.max(KEY_REPEAT_FIRST_DELAY, startDelay);
                }

                // Tell mScrollCache when we should start fading. This may
                // extend the fade start time if one was already scheduled
                let fadeStartTime = AnimationUtils.currentAnimationTimeMillis() + startDelay;
                scrollCache.fadeStartTime = fadeStartTime;
                scrollCache.state = ScrollabilityCache.ON;

                // Schedule our fader to run, unscheduling any old ones first
                if (this.mAttachInfo != null) {
                    this.mAttachInfo.mHandler.removeCallbacks(scrollCache);
                    this.mAttachInfo.mHandler.postAtTime(scrollCache, fadeStartTime);
                }

                return true;
            }

            return false;
        }
        getVerticalFadingEdgeLength():number{
            return 0;
        }
        setFadingEdgeLength(length:number){
            //no need impl fade edge. use overscroll instead
        }
        getHorizontalFadingEdgeLength():number {
            //no need impl fade edge. use overscroll instead
            return 0;
        }
        getVerticalScrollbarWidth():number {
            let cache = this.mScrollCache;
            if (cache != null) {
                let scrollBar = cache.scrollBar;
                if (scrollBar != null) {
                    let size = scrollBar.getSize(true);
                    if (size <= 0) {
                        size = cache.scrollBarSize;
                    }
                    return size;
                }
                return 0;
            }
            return 0;
        }
        getHorizontalScrollbarHeight():number {
            let cache = this.mScrollCache;
            if (cache != null) {
                let scrollBar = cache.scrollBar;
                if (scrollBar != null) {
                    let size = scrollBar.getSize(false);
                    if (size <= 0) {
                        size = cache.scrollBarSize;
                    }
                    return size;
                }
                return 0;
            }
            return 0;
        }

        initializeScrollbars(a?):void {
            this.initScrollCache();
        }
        initScrollCache() {
            if (this.mScrollCache == null) {
                this.mScrollCache = new ScrollabilityCache(this);
            }
        }
        private getScrollCache():ScrollabilityCache {
            this.initScrollCache();
            return this.mScrollCache;
        }

        isHorizontalScrollBarEnabled():boolean {
            return (this.mViewFlags & View.SCROLLBARS_HORIZONTAL) == View.SCROLLBARS_HORIZONTAL;
        }
        setHorizontalScrollBarEnabled(horizontalScrollBarEnabled:boolean) {
            if (this.isHorizontalScrollBarEnabled() != horizontalScrollBarEnabled) {
                this.mViewFlags ^= View.SCROLLBARS_HORIZONTAL;
                this.computeOpaqueFlags();
                //this.resolvePadding();
            }
        }
        isVerticalScrollBarEnabled():boolean {
            return (this.mViewFlags & View.SCROLLBARS_VERTICAL) == View.SCROLLBARS_VERTICAL;
        }
        setVerticalScrollBarEnabled(verticalScrollBarEnabled:boolean) {
            if (this.isVerticalScrollBarEnabled() != verticalScrollBarEnabled) {
                this.mViewFlags ^= View.SCROLLBARS_VERTICAL;
                this.computeOpaqueFlags();
                //this.resolvePadding();
            }
        }
        setScrollbarFadingEnabled(fadeScrollbars:boolean) {
            this.initScrollCache();
            const scrollabilityCache = this.mScrollCache;
            scrollabilityCache.fadeScrollBars = fadeScrollbars;
            if (fadeScrollbars) {
                scrollabilityCache.state = ScrollabilityCache.OFF;
            } else {
                scrollabilityCache.state = ScrollabilityCache.ON;
            }
        }
        setVerticalScrollbarPosition(position:number){
            //scrollbar position not impl
        }
        setHorizontalScrollbarPosition(position:number){
            //scrollbar position not impl
        }
        setScrollBarStyle(position:number){
            //scrollbar style not impl
        }
        getTopFadingEdgeStrength():number{
            return 0;//no fading edge
        }
        getBottomFadingEdgeStrength():number{
            return 0;//no fading edge
        }
        protected getLeftFadingEdgeStrength():number{
            return 0;//no fading edge
        }
        protected getRightFadingEdgeStrength():number{
            return 0;//no fading edge
        }
        isScrollbarFadingEnabled():boolean {
            return this.mScrollCache != null && this.mScrollCache.fadeScrollBars;
        }
        getScrollBarDefaultDelayBeforeFade():number {
            return this.mScrollCache == null ? ViewConfiguration.getScrollDefaultDelay() :
                this.mScrollCache.scrollBarDefaultDelayBeforeFade;
        }
        setScrollBarDefaultDelayBeforeFade(scrollBarDefaultDelayBeforeFade:number) {
            this.getScrollCache().scrollBarDefaultDelayBeforeFade = scrollBarDefaultDelayBeforeFade;
        }
        getScrollBarFadeDuration():number {
            return this.mScrollCache == null ? ViewConfiguration.getScrollBarFadeDuration() :
                this.mScrollCache.scrollBarFadeDuration;
        }
        setScrollBarFadeDuration(scrollBarFadeDuration:number) {
            this.getScrollCache().scrollBarFadeDuration = scrollBarFadeDuration;
        }
        getScrollBarSize():number {
            return this.mScrollCache == null ? ViewConfiguration.get().getScaledScrollBarSize() :
                this.mScrollCache.scrollBarSize;
        }
        setScrollBarSize(scrollBarSize:number) {
            this.getScrollCache().scrollBarSize = scrollBarSize;
        }
        hasOpaqueScrollbars():boolean{
            return true;
        }

        /*
         * Caller is responsible for calling requestLayout if necessary.
         * (This allows addViewInLayout to not request a new layout.)
         */
        assignParent(parent:ViewParent) {
            if (this.mParent == null) {
                this.mParent = parent;
            } else if (parent == null) {
                this.mParent = null;
            } else {
                throw new Error("view " + this + " being added, but"
                    + " it already has a parent");
            }
        }

        onFinishInflate() {
        }


        /**
         * @hide
         */
        dispatchStartTemporaryDetach():void  {
            //this.clearDisplayList();
            this.onStartTemporaryDetach();
        }

        /**
         * This is called when a container is going to temporarily detach a child, with
         * {@link ViewGroup#detachViewFromParent(View) ViewGroup.detachViewFromParent}.
         * It will either be followed by {@link #onFinishTemporaryDetach()} or
         * {@link #onDetachedFromWindow()} when the container is done.
         */
        onStartTemporaryDetach():void  {
            this.removeUnsetPressCallback();
            this.mPrivateFlags |= View.PFLAG_CANCEL_NEXT_UP_EVENT;
        }

        /**
         * @hide
         */
        dispatchFinishTemporaryDetach():void  {
            this.onFinishTemporaryDetach();
        }

        /**
         * Called after {@link #onStartTemporaryDetach} when the container is done
         * changing the view.
         */
        onFinishTemporaryDetach():void  {
        }

        /**
         * Called when the window containing this view gains or loses window focus.
         * ViewGroups should override to route to their children.
         *
         * @param hasFocus True if the window containing this view now has focus,
         *        false otherwise.
         */
        dispatchWindowFocusChanged(hasFocus:boolean):void  {
            this.onWindowFocusChanged(hasFocus);
        }

        /**
         * Called when the window containing this view gains or loses focus.  Note
         * that this is separate from view focus: to receive key events, both
         * your view and its window must have focus.  If a window is displayed
         * on top of yours that takes input focus, then your own window will lose
         * focus but the view focus will remain unchanged.
         *
         * @param hasWindowFocus True if the window containing this view now has
         *        focus, false otherwise.
         */
        onWindowFocusChanged(hasWindowFocus:boolean):void  {
            //let imm:InputMethodManager = InputMethodManager.peekInstance();
            if (!hasWindowFocus) {
                if (this.isPressed()) {
                    this.setPressed(false);
                }
                //if (imm != null && (this.mPrivateFlags & View.PFLAG_FOCUSED) != 0) {
                //    imm.focusOut(this);
                //}
                this.removeLongPressCallback();
                this.removeTapCallback();
                this.onFocusLost();
            }
            //else if (imm != null && (this.mPrivateFlags & View.PFLAG_FOCUSED) != 0) {
            //    imm.focusIn(this);
            //}
            this.refreshDrawableState();
        }

        /**
         * Returns true if this view is in a window that currently has window focus.
         * Note that this is not the same as the view itself having focus.
         *
         * @return True if this view is in a window that currently has window focus.
         */
        hasWindowFocus():boolean  {
            return this.mAttachInfo != null && this.mAttachInfo.mHasWindowFocus;
        }

        /**
         * @return The number of times this view has been attached to a window
         */
        getWindowAttachCount():number  {
            return this.mWindowAttachCount;
        }
        /**
         * Returns true if this view is currently attached to a window.
         */
        isAttachedToWindow():boolean {
            return this.mAttachInfo != null;
        }

        dispatchAttachedToWindow(info: View.AttachInfo, visibility:number) {
            //System.out.println("Attached! " + this);
            this.mAttachInfo = info;
            if (this.mOverlay != null) {
                this.mOverlay.getOverlayView().dispatchAttachedToWindow(info, visibility);
            }
            this.mWindowAttachCount++;
            // We will need to evaluate the drawable state at least once.
            this.mPrivateFlags |= View.PFLAG_DRAWABLE_STATE_DIRTY;
            if (this.mFloatingTreeObserver != null) {
                info.mTreeObserver.merge(this.mFloatingTreeObserver);
                this.mFloatingTreeObserver = null;
            }
            if ((this.mPrivateFlags&View.PFLAG_SCROLL_CONTAINER) != 0) {
                this.mAttachInfo.mScrollContainers.add(this);
                this.mPrivateFlags |= View.PFLAG_SCROLL_CONTAINER_ADDED;
            }
            //performCollectViewAttributes(mAttachInfo, visibility);
            this.onAttachedToWindow();

            let li = this.mListenerInfo;
            let listeners = li != null ? li.mOnAttachStateChangeListeners : null;
            if (listeners != null && listeners.size() > 0) {
                // NOTE: because of the use of CopyOnWriteArrayList, we *must* use an iterator to
                // perform the dispatching. The iterator is a safe guard against listeners that
                // could mutate the list by calling the various add/remove methods. This prevents
                // the array from being modified while we iterate it.
                for (let listener of listeners) {
                    listener.onViewAttachedToWindow(this);
                }
            }

            let vis = info.mWindowVisibility;
            if (vis != View.GONE) {
                this.onWindowVisibilityChanged(vis);
            }

            if ((this.mPrivateFlags&View.PFLAG_DRAWABLE_STATE_DIRTY) != 0) {
                // If nobody has evaluated the drawable state yet, then do it now.
                this.refreshDrawableState();
            }
            //needGlobalAttributesUpdate(false);
        }
        onAttachedToWindow() {
            //if ((this.mPrivateFlags & View.PFLAG_REQUEST_TRANSPARENT_REGIONS) != 0) {
            //    this.mParent.requestTransparentRegion(this);
            //}

            if ((this.mPrivateFlags & View.PFLAG_AWAKEN_SCROLL_BARS_ON_ATTACH) != 0) {
                this.initialAwakenScrollBars();
                this.mPrivateFlags &= ~View.PFLAG_AWAKEN_SCROLL_BARS_ON_ATTACH;
            }

            this.mPrivateFlags3 &= ~View.PFLAG3_IS_LAID_OUT;

            this.jumpDrawablesToCurrentState();
        }

        dispatchDetachedFromWindow() {
            let info = this.mAttachInfo;
            if (info != null) {
                let vis = info.mWindowVisibility;
                if (vis != View.GONE) {
                    this.onWindowVisibilityChanged(View.GONE);
                }
            }

            this.onDetachedFromWindow();

            let li = this.mListenerInfo;
            let listeners = li != null ? li.mOnAttachStateChangeListeners : null;
            if (listeners != null && listeners.size() > 0) {
                // NOTE: because of the use of CopyOnWriteArrayList, we *must* use an iterator to
                // perform the dispatching. The iterator is a safe guard against listeners that
                // could mutate the list by calling the various add/remove methods. This prevents
                // the array from being modified while we iterate it.
                for (let listener of listeners) {
                    listener.onViewDetachedFromWindow(this);
                }
            }

            if ((this.mPrivateFlags & View.PFLAG_SCROLL_CONTAINER_ADDED) != 0) {
                this.mAttachInfo.mScrollContainers.delete(this);
                this.mPrivateFlags &= ~View.PFLAG_SCROLL_CONTAINER_ADDED;
            }

            this.mAttachInfo = null;
            if (this.mOverlay != null) {
                this.mOverlay.getOverlayView().dispatchDetachedFromWindow();
            }
        }
        onDetachedFromWindow() {
            this.mPrivateFlags &= ~View.PFLAG_CANCEL_NEXT_UP_EVENT;
            this.mPrivateFlags3 &= ~View.PFLAG3_IS_LAID_OUT;

            this.removeUnsetPressCallback();
            this.removeLongPressCallback();
            this.removePerformClickCallback();

            this.destroyDrawingCache();
            //this.destroyLayer(false);
            //
            this.cleanupDraw();
            //
            //this.mCurrentAnimation = null;
        }
        cleanupDraw() {
            if (this.mAttachInfo != null) {
                this.mAttachInfo.mViewRootImpl.cancelInvalidate(this);
            }
        }

        debug(depth=0){
            //custom impl:
            let originProto = Object.getPrototypeOf(this);
            console.dir(Object.assign(Object.create(originProto), this));
        }


        toString():String{
            return this.tagName();
        }
        getRootView():View {
            if (this.mAttachInfo != null) {
                let v = this.mAttachInfo.mRootView;
                if (v != null) {
                    return v;
                }
            }

            let parent = this;

            while (parent.mParent != null && parent.mParent instanceof View) {
                parent = <any>parent.mParent;
            }

            return parent;
        }
        findViewByPredicateTraversal(predicate:View.Predicate<View>, childToSkip:View):View {
            if (predicate.apply(this)) {
                return this;
            }
            return null;
        }
        findViewById(id:string):View{
            if(!id) return null;
            if (id == this.bindElement.id) {
                return this;
            }
            return this.findViewTraversal(id);
        }
        findViewTraversal(id:string):View  {
            let bindEle = this.bindElement.querySelector('#'+id);
            return bindEle ? bindEle[View.AndroidViewProperty] : null;
        }
        findViewByPredicate(predicate:View.Predicate<View>) {
            return this.findViewByPredicateTraversal(predicate, null);
        }
        findViewByPredicateInsideOut(start:View, predicate:View.Predicate<View>) {
            let childToSkip = null;
            for (;;) {
                let view = start.findViewByPredicateTraversal(predicate, childToSkip);
                if (view != null || start == this) {
                    return view;
                }

                let parent = start.getParent();
                if (parent == null || !(parent instanceof View)) {
                    return null;
                }

                childToSkip = start;
                start = <View><any>parent;
            }
        }
        setId(id:string) {
            if(this._bindElement) this._bindElement.id = id;
        }
        getId():string {
            return this.mID;
        }
        setIsRootNamespace(isRoot:boolean) {
            if (isRoot) {
                this.mPrivateFlags |= View.PFLAG_IS_ROOT_NAMESPACE;
            } else {
                this.mPrivateFlags &= ~View.PFLAG_IS_ROOT_NAMESPACE;
            }
        }
        isRootNamespace():boolean {
            return (this.mPrivateFlags&View.PFLAG_IS_ROOT_NAMESPACE) != 0;
        }

        static inflate(eleOrRef:HTMLElement|string, rootElement:HTMLElement, viewParent?:ViewGroup):View{
            let domtree : HTMLElement;
            if(typeof eleOrRef === "string"){
                let ref = <HTMLElement>View.findReference(eleOrRef, rootElement);
                if(ref==null){
                    console.warn('not find Reference :'+ eleOrRef);
                    return null;
                }
                domtree = <HTMLElement>ref.firstElementChild;
            }else{
                domtree = <HTMLElement>eleOrRef;
            }
            let className = domtree.tagName;
            if(className.toLowerCase() === 'android-layout'){
                let child = domtree.firstElementChild;
                if(child) return View.inflate(<HTMLElement>child, rootElement, viewParent);
                return null;
            }

            if(className.startsWith('ANDROID-')){
                className = className.substring('ANDROID-'.length);
            }
            let rootViewClass = ClassFinder.findClass(className, android.view);
            if(!rootViewClass) rootViewClass = ClassFinder.findClass(className, android['widget']);
            if(!rootViewClass) rootViewClass = ClassFinder.findClass(className);
            if(!rootViewClass){
                console.warn('not find class ' + className);
                return null;
            }
            let rootView:View = new rootViewClass();
            rootView.initBindElement(domtree, rootElement);

            let params;
            if(viewParent) {
                params = viewParent.generateDefaultLayoutParams();
                this._generateLayoutParamsFromAttribute(domtree, params);

            }else{//generate default param is no parent
                params = this._generateLayoutParamsFromAttribute(domtree);
            }
            rootView.setLayoutParams(params);
            rootView._initAttrObserver();

            if(rootView instanceof ViewGroup){
                let parent = <ViewGroup><any>rootView;
                Array.from(domtree.children).forEach((item)=>{
                    if(item instanceof HTMLElement){
                        let view = View.inflate(item, rootElement, parent);
                        if(view) parent.addView(view);
                    }
                });
            }

            rootView.onFinishInflate();
            return rootView;
        }

        static optReferenceString(refString:string, currentElement:NodeSelector=document,
                                     rootElement:NodeSelector=document):string {
            return View.findReferenceString(refString, currentElement, rootElement) || refString;
        }

        static findReferenceString(refString:string, currentElement:NodeSelector=document,
                                   rootElement:NodeSelector=document):string {
            if(!refString.startsWith('@')) return null;
            let referenceArray = [];
            let attrValue = refString;
            while(attrValue && attrValue.startsWith('@')){//ref value
                let reference = View.findReference(attrValue, currentElement, rootElement, false);
                if(referenceArray.indexOf(reference)>=0) throw Error('findReference Error: circle reference');
                referenceArray.push(reference);

                attrValue = (<HTMLElement>reference).innerText;
            }
            return attrValue;
        }

        static findReference(refString:string, currentElement:NodeSelector=document,
                             rootElement:NodeSelector=document, cloneNode=true):Element {
            if(refString && refString.startsWith('@')){
                let [tagName, ...refIds] = refString.split('/');
                tagName = tagName.substring(1);
                if(!refIds || refIds.length===0) return null;

                if(!tagName.startsWith('android-')) tagName = 'android-'+tagName;
                //@style/btn1/pressed => resources android-style#btn1 #pressed
                let q = 'resources '+tagName + '#' + (<any>refIds).join(' #');
                let el = currentElement.querySelector(q) || rootElement.querySelector(q) || document.querySelector(q);
                return cloneNode ? <Element>el.cloneNode(true) : el;
            }
            return null;
        }



        //bind Element show the layout and extra info
        _bindElement: HTMLElement;
        _rootElement: HTMLElement;
        private _AttrObserver:MutationObserver;
        private _stateAttrList:StateAttrList;
        static AndroidViewProperty = 'AndroidView';
        get bindElement():HTMLElement{
            if(!this._bindElement) this.initBindElement();
            return this._bindElement;
        }
        get rootElement():HTMLElement{
            if(this._rootElement) return this._rootElement;
            if(this.getViewRootImpl()) return this.getViewRootImpl().rootElement;
            return null;
        }
        private _AttrObserverCallBack(arr: MutationRecord[], observer: MutationObserver){
            arr.forEach((record)=>{
                let target = <Element>record.target;
                let androidView:View = target[View.AndroidViewProperty];
                if(!androidView) return;
                let attrName = record.attributeName;
                let newValue = target.getAttribute(attrName);
                let oldValue = record.oldValue;
                if(newValue === oldValue) return;
                androidView.onBindElementAttributeChanged(attrName, record.oldValue, newValue);
            });
        }

        initBindElement(bindElement?:HTMLElement, rootElement?:HTMLElement):void{
            if(this._bindElement) this._bindElement[View.AndroidViewProperty] = null;
            this._bindElement = bindElement || document.createElement(this.tagName());
            let oldBindView:View = this._bindElement[View.AndroidViewProperty];
            if(oldBindView){
                if(oldBindView._AttrObserver) oldBindView._AttrObserver.disconnect();
            }
            this._bindElement[View.AndroidViewProperty]=this;
            this._rootElement = rootElement;

            this._stateAttrList = new StateAttrList(this.bindElement, rootElement);
            this._initAttrChangeHandler();
            this._initBindElementDefaultAttribute();
        }

        syncBoundToElement(){
            let bind = this.bindElement;
            bind.style.position = 'absolute';
            bind.style.boxSizing = 'border-box';
            bind.style.left = this.mLeft + 'px';
            bind.style.top = this.mTop + 'px';
            bind.style.width = this.getWidth() + 'px';
            bind.style.height = this.getHeight() + 'px';
            //bind.style.paddingLeft = this.mPaddingLeft + 'px';
            //bind.style.paddingTop = this.mPaddingTop + 'px';
            //bind.style.paddingRight = this.mPaddingRight + 'px';
            //bind.style.paddingBottom = this.mPaddingBottom + 'px';
        }
        syncScrollToElement(){
            let sx = this.mScrollX;
            let sy = this.mScrollY;
            if(this instanceof ViewGroup){
                let group = <ViewGroup><any>this;
                for (let i = 0, count=group.getChildCount(); i < count; i++) {
                    let child = group.getChildAt(i);
                    let item = child.bindElement;

                    //if(sx!==0) item.style.marginLeft = -sx+'px';
                    //else item.style.marginLeft = "";
                    if(sx!==0) item.style.left =  (child.mLeft-sx)+'px';
                    else item.style.left = child.mLeft + "px";


                    //if(sy!==0) item.style.transform = `translate3d(0px, ${-sy}px, 0px)`;
                    //else item.style.transform = '';
                    if(sy!==0) item.style.top =  (child.mTop-sy)+'px';
                    else item.style.top = child.mTop + "px";
                    //if(sy!==0) item.style.marginTop = -sy+'px';
                    //else item.style.marginTop = "";
                }
            }
        }
        syncVisibleToElement(){
            let visibility = this.getVisibility();
            if(visibility === View.VISIBLE){
                this.bindElement.style.display = '';
                this.bindElement.style.visibility = '';

            }else if(visibility === View.INVISIBLE){
                this.bindElement.style.display = '';
                this.bindElement.style.visibility = 'hidden';
            }else{
                this.bindElement.style.display = 'none';
                this.bindElement.style.visibility = '';
            }
        }

        private _attrChangeHandler = new View.AttrChangeHandler(this);
        private _initAttrChangeHandler(){
            this.createAttrChangeHandler(this._attrChangeHandler);
            if(!this._attrChangeHandler.isCallSuper){
                throw Error('must call super when override createAttrChangeHandler!');
            }
        }
        private _initAttrObserver(){
            this._fireInitBindElementAttribute();
            if(!this._AttrObserver) this._AttrObserver = new MutationObserver(this._AttrObserverCallBack);
            else this._AttrObserver.disconnect();
            this._AttrObserver.observe(this._bindElement, {attributes : true, attributeOldValue : true});
        }

        private _initBindElementDefaultAttribute():void{
            for(let [key, value] of this._stateAttrList.getDefaultStateAttr().getAttrMap().entries()){
                key = 'android:' + key;
                if( (value===null || value===undefined) && this.bindElement.hasAttribute(key) ){
                    this.bindElement.removeAttribute(key);
                }else{
                    this.bindElement.setAttribute(key, value);
                }
            }
            let id = this.bindElement.getAttribute('android:id');
            if(id) this.bindElement.id = id;
        }
        private _fireInitBindElementAttribute(){
            for(let attr of Array.from(this.bindElement.attributes)){
                this.onBindElementAttributeChanged(attr.name, null, attr.value);
            }
        }
        private _fireStateChangeToAttribute(oldState:number[], newState:number[]){
            if(!this._stateAttrList) return;
            if(oldState+'' === newState+'') return;

            let oldMatchedAttr:StateAttr = oldState ? this._stateAttrList.getMatchedAttr(oldState) : null;
            let matchedAttr:StateAttr = this._stateAttrList.getMatchedAttr(newState);

            let attrMap = matchedAttr.mergeRemovedFrom(oldMatchedAttr);
            for(let [key, value] of attrMap.entries()){
                //hold the current state to old state attr, so the state attr is sync with the view state.
                if(oldMatchedAttr) {
                    let oldValue;
                    if(key.startsWith('layout_')){
                        let params = this.getLayoutParams();
                        if(params){
                            let attrName = key.substring('layout_'.length);
                            oldValue=params._attrChangeHandler.getViewAttrValue(attrName);
                        }
                    }else{
                        oldValue = this._attrChangeHandler.getViewAttrValue(key);
                    }
                    if (oldValue != null){
                        oldMatchedAttr.setAttr(key, oldValue);
                    }
                }


                key = 'android:' + key;
                if( (value===null || value===undefined) ){
                    if(this.bindElement.hasAttribute(key)){
                        this.bindElement.removeAttribute(key);
                    }else{
                        this.onBindElementAttributeChanged(key, null, null);//force fire remove event
                    }
                }else{
                    this.bindElement.setAttribute(key, value);
                }
            }
        }

        private onBindElementAttributeChanged(attributeName:string, oldVal:string, newVal:string):void {
            //remove namespace('android:')
            let parts = attributeName.split(":");
            let attrName = parts[parts.length-1].toLowerCase();
            if(newVal === 'true') newVal = <any>true;
            else if(newVal === 'false') newVal = <any>false;

            //layout attr
            if(attrName.startsWith('layout_')){
                attrName = attrName.substring('layout_'.length);
                let params = this.getLayoutParams();
                if(params){
                    params._attrChangeHandler.handle(attrName, newVal);
                }
                this.requestLayout();
                return;
            }

            this._attrChangeHandler.handle(attrName, newVal);
        }

        private static _generateLayoutParamsFromAttribute(node:Node, dest = new ViewGroup.LayoutParams(-2, -2)):ViewGroup.LayoutParams{
            Array.from(node.attributes).forEach((attr:Attr)=>{
                let layoutParamFiled = attr.name.split("layout_")[1];
                dest._attrChangeHandler.handle(layoutParamFiled, attr.value);
            });
            return dest;
        }


        tagName() : string{
            return "ANDROID-"+this.constructor.name;
        }
    }

    export module View{
        export class MeasureSpec {
            static MODE_SHIFT = 30;
            static MODE_MASK = 0x3 << MeasureSpec.MODE_SHIFT;
            static UNSPECIFIED = 0 << MeasureSpec.MODE_SHIFT;
            static EXACTLY = 1 << MeasureSpec.MODE_SHIFT;
            static AT_MOST = 2 << MeasureSpec.MODE_SHIFT;

            static makeMeasureSpec(size, mode) {
                return (size & ~MeasureSpec.MODE_MASK) | (mode & MeasureSpec.MODE_MASK);
            }

            static getMode(measureSpec) {
                return (measureSpec & MeasureSpec.MODE_MASK);
            }

            static getSize(measureSpec) {
                return (measureSpec & ~MeasureSpec.MODE_MASK);
            }

            static adjust(measureSpec, delta) {
                return MeasureSpec.makeMeasureSpec(
                    MeasureSpec.getSize(measureSpec + delta), MeasureSpec.getMode(measureSpec));
            }

            static toString(measureSpec) {
                let mode = MeasureSpec.getMode(measureSpec);
                let size = MeasureSpec.getSize(measureSpec);

                let sb = new StringBuilder("MeasureSpec: ");

                if (mode == MeasureSpec.UNSPECIFIED)
                    sb.append("UNSPECIFIED ");
                else if (mode == MeasureSpec.EXACTLY)
                    sb.append("EXACTLY ");
                else if (mode == MeasureSpec.AT_MOST)
                    sb.append("AT_MOST ");
                else
                    sb.append(mode).append(" ");

                sb.append(size);
                return sb.toString();
            }
        }
        export class AttachInfo {
            mRootView:View;
            mWindowLeft = 0;
            mWindowTop = 0;
            mKeyDispatchState = new KeyEvent.DispatcherState();
            mDrawingTime=0;
            //mCanvas : Canvas;
            mViewRootImpl : ViewRootImpl;
            mHandler : Handler;
            mTmpInvalRect = new Rect();
            mTmpTransformRect = new Rect();
            mScrollContainers = new Set<View>();
            mViewScrollChanged = false;
            mTreeObserver = new ViewTreeObserver();
            mViewRequestingLayout:View;
            mViewVisibilityChanged = false;
            mInvalidateChildLocation = new Array<number>(2);
            mIgnoreDirtyState = false;
            mSetIgnoreDirtyState = false;
            mHasWindowFocus = false;
            mWindowVisibility = 0;
            mInTouchMode = false;

            constructor(mViewRootImpl:ViewRootImpl, mHandler:Handler) {
                this.mViewRootImpl = mViewRootImpl;
                this.mHandler = mHandler;
            }

        }

        export class ListenerInfo{
            mOnFocusChangeListener:OnFocusChangeListener;
            mOnAttachStateChangeListeners:CopyOnWriteArrayList<OnAttachStateChangeListener>;
            mOnLayoutChangeListeners:ArrayList<OnLayoutChangeListener>;
            mOnClickListener:OnClickListener;
            mOnLongClickListener:OnLongClickListener;
            mOnTouchListener:OnTouchListener;
            mOnKeyListener:OnKeyListener;
            mOnGenericMotionListener:OnGenericMotionListener;

        }

        export interface OnAttachStateChangeListener{
            onViewAttachedToWindow(v:View);
            onViewDetachedFromWindow(v:View);
        }
        export interface OnLayoutChangeListener{
            onLayoutChange(v:View, left:number , top:number , right:number , bottom:number,
                           oldLeft:number , oldTop:number , oldRight:number , oldBottom:number);
        }
        export interface OnClickListener{
            onClick(v:View);
        }
        export interface OnLongClickListener{
            onLongClick(v:View):boolean;
        }
        export interface OnFocusChangeListener{
            onFocusChange(v:View, hasFocus:boolean);
        }
        export interface OnTouchListener{
            onTouch(v:View, event:MotionEvent);
        }
        export interface OnKeyListener{
            onKey(v:View, keyCode:number, event:KeyEvent);
        }
        export interface OnGenericMotionListener{
            onGenericMotion(v:View, event:MotionEvent);
        }

        export interface Predicate<T>{
            apply(t:T):boolean;
        }
        /**
         * handle html element attribute change and parse the value to view
         */
        export class AttrChangeHandler{
            isCallSuper = false;
            handlers =  [];
            view:View;
            private objectRefs = [];

            constructor(view:android.view.View) {
                this.view = view;
            }

            add(handler){
                this.handlers.push(handler);
            }
            handle(name, value){
                for(let handler of this.handlers){
                    for(let key in handler){
                        if(key.toLowerCase()===name){
                            handler[key] = value;
                        }
                    }
                }
            }
            getViewAttrValue(attrName:string):string {
                for(let handler of this.handlers){
                    for(let key in handler){
                        if(key.toLowerCase()===attrName.toLowerCase()){
                            let value = handler[key];
                            if(value==null) return null;
                            if(typeof value === "number") return value+'';
                            if(typeof value === "boolean") return value+'';
                            if(typeof value === "string") return value;
                            return this.setRefObject(value);
                        }
                    }
                }
                return null;
            }

            private getRefObject(ref:string, recycel=true):any{
                if(ref && ref.startsWith('@ref/')){
                    ref = ref.substring(5);
                    let index = Number.parseInt(ref);
                    if(Number.isInteger(index)){
                        let obj = this.objectRefs[index];
                        if(recycel) this.objectRefs[index] = null;
                        return obj;
                    }
                }
            }

            private setRefObject(obj:any):string{
                let length = this.objectRefs.length;
                for(let i = 0; i<length; i++){
                    if(this.objectRefs[i]==null){
                        this.objectRefs[i] = obj;
                        return '@ref/'+i;
                    }
                }

                this.objectRefs.push(obj);
                return '@ref/'+length;
            }

            /**
             * @param value
             * @returns {[left, top, right, bottom]}
             */
            static parsePaddingMarginLTRB(value):string[]{
                value = (value + '');
                let parts = [];
                for(let part of value.split(' ')){
                    if(part) parts.push(part);
                }
                switch (parts.length){
                    case 1 : return [parts[0], parts[0], parts[0], parts[0]];
                    case 2 : return [parts[1], parts[0], parts[1], parts[0]];
                    case 3 : return [parts[1], parts[0], parts[1], parts[2]];
                    case 4 : return [parts[3], parts[0], parts[1], parts[2]];
                }
                throw Error('not a padding or margin value : '+value);

            }

            static parseBoolean(value, defaultValue = true):boolean{
                if(value===false || value ==='fales' || value === '0') return false;
                else if(value===true || value ==='true' || value === '1' || value === '') return true;
                return defaultValue;
            }
            parseBoolean(value, defaultValue = true):boolean{
                return AttrChangeHandler.parseBoolean(value, defaultValue);
            }
            static parseGravity(s:string, defaultValue=Gravity.NO_GRAVITY):number {
                let gravity = Number.parseInt(s);
                if(Number.isInteger(gravity)) return gravity;

                gravity = Gravity.NO_GRAVITY;
                try {
                    let parts = s.split("|");
                    parts.forEach((part)=> {
                        let g = Gravity[part.toUpperCase()];
                        if (Number.isInteger(g)) gravity |= g;
                    });
                } catch (e) {
                    console.error(e);
                }
                if(Number.isNaN(gravity) || gravity===Gravity.NO_GRAVITY) gravity = defaultValue;
                return gravity;
            }
            parseGravity(s:string, defaultValue=Gravity.NO_GRAVITY):number {
                return AttrChangeHandler.parseGravity(s, defaultValue);
            }
            parseDrawable(s:string):Drawable{
                if(!s) return null;
                if(s.startsWith('@')){
                    let refObj = this.getRefObject(s);
                    if(refObj) return refObj;
                    //TODO parse ref

                }else{
                    let color = this.parseColor(s);
                    return new ColorDrawable(color);
                }
            }
            parseColor(value:string):number{
                let color = Number.parseInt(value);
                if(Number.isInteger(color)) return color;

                if(value.startsWith('rgb(')){
                    value = value.replace('rgb(', '').replace(')', '');
                    let parts = value.split(',');
                    return Color.rgb(Number.parseInt(parts[0]), Number.parseInt(parts[1]), Number.parseInt(parts[2]));

                }else if(value.startsWith('rgba(')){
                    value = value.replace('rgba(', '').replace(')', '');
                    let parts = value.split(',');
                    return Color.rgba(Number.parseInt(parts[0]), Number.parseInt(parts[1]),
                        Number.parseInt(parts[2]), Number.parseInt(parts[2])*255);

                }else {
                    if (value.startsWith('#') && value.length === 4) {//support parse #333
                        value = '#' + value[1] + value[1] + value[2] + value[2] + value[2] + value[2];
                    }
                    try {
                        return Color.parseColor(value);
                    } catch (e) {
                    }
                }
            }
            parseColorList(value:string):ColorStateList{
                if(!value) return null;
                if(value.startsWith('@')){
                    let refObj = this.getRefObject(value);
                    if(refObj) return refObj;
                    //TODO parse ref

                }else {
                    let color = this.parseColor(value);
                    return ColorStateList.valueOf(color);
                }
                return null;
            }
            parseNumber(value, defaultValue = 0):number{
                try {
                    return TypedValue.complexToDimensionPixelSize(value);
                } catch (e) {
                    return defaultValue;
                }
            }
        }
    }
    export module View.AttachInfo{
        export class InvalidateInfo{
            private static POOL_LIMIT = 10;

            private static sPool = new Pools.SynchronizedPool<InvalidateInfo>(InvalidateInfo.POOL_LIMIT);

            target:View;

            left = 0;
            top = 0;
            right = 0;
            bottom = 0;

            static obtain():InvalidateInfo {
                let instance = InvalidateInfo.sPool.acquire();
                return (instance != null) ? instance : new InvalidateInfo();
            }

            recycle():void {
                this.target = null;
                InvalidateInfo.sPool.release(this);
            }
        }
    }


    class CheckForLongPress implements Runnable{
        private View_this : any;//don't check private
        private mOriginalWindowAttachCount = 0;

        constructor(View_this:View) {
            this.View_this = View_this;
        }

        run() {
            if (this.View_this.isPressed() && (this.View_this.mParent != null)
                && this.mOriginalWindowAttachCount == this.View_this.mWindowAttachCount) {
                if (this.View_this.performLongClick()) {
                    this.View_this.mHasPerformedLongPress = true;
                }
            }
        }

        rememberWindowAttachCount() {
            this.mOriginalWindowAttachCount = this.View_this.mWindowAttachCount;
        }
    }
    class CheckForTap implements Runnable {
        private View_this : any;
        constructor(View_this:View) {
            this.View_this = View_this;
        }
        run() {
            this.View_this.mPrivateFlags &= ~View.PFLAG_PREPRESSED;
            this.View_this.setPressed(true);
            this.View_this.checkForLongClick(ViewConfiguration.getTapTimeout());
        }
    }
    class PerformClick implements Runnable {
        private View_this : any;
        constructor(View_this:View) {
            this.View_this = View_this;
        }
        run() {
            this.View_this.performClick();
        }
    }
    class UnsetPressedState implements Runnable {
        private View_this : any;
        constructor(View_this:View) {
            this.View_this = View_this;
        }
        run() {
            this.View_this.setPressed(false);
        }
    }
    class ScrollabilityCache implements Runnable {
        static OFF = 0;
        static ON = 1;
        static FADING = 2;

        fadeScrollBars = true;
        fadingEdgeLength = ViewConfiguration.get().getScaledFadingEdgeLength();
        scrollBarDefaultDelayBeforeFade = ViewConfiguration.getScrollDefaultDelay();
        scrollBarFadeDuration = ViewConfiguration.getScrollBarFadeDuration();

        scrollBarSize = ViewConfiguration.get().getScaledScrollBarSize();
        scrollBar:ScrollBarDrawable;
        //interpolatorValues:Array<number>;
        private interpolator = new LinearInterpolator();
        host:View;
        paint:Paint;

        fadeStartTime:number;
        state = ScrollabilityCache.OFF;

        constructor(host:View){
            this.host = host;

            this.scrollBar = new ScrollBarDrawable();


            //no track
            //let track = null;
            //this.scrollBar.setHorizontalTrackDrawable(track);
            //this.scrollBar.setVerticalTrackDrawable(track);

            let thumbColor = new ColorDrawable(0x44000000);
            let density = Resources.getDisplayMetrics().density;
            let thumb = new InsetDrawable(thumbColor, 0, 2*density, ViewConfiguration.get().getScaledScrollBarSize()/2, 2*density);
            this.scrollBar.setHorizontalThumbDrawable(thumb);
            this.scrollBar.setVerticalThumbDrawable(thumb);
        }

        run() {
            let now = AnimationUtils.currentAnimationTimeMillis();
            if (now >= this.fadeStartTime) {

                //TODO compute scroll bar optical

                this.state = ScrollabilityCache.FADING;
                // Kick off the fade animation
                this.host.invalidate(true);
            }
        }

        _computeAlphaToScrollBar(){
            let now = AnimationUtils.currentAnimationTimeMillis();
            let factor = (now - this.fadeStartTime) / this.scrollBarFadeDuration;
            if(factor>=1){
                this.state = ScrollabilityCache.OFF;
                factor = 1;
            }
            let alpha = 1 - this.interpolator.getInterpolation(factor);
            this.scrollBar.setAlpha(255 * alpha);
        }

    }
    class MatchIdPredicate implements View.Predicate<View>{
        mId:string;
        apply(view:View):boolean {
            return view.mID === this.mId;
        }
    }
}
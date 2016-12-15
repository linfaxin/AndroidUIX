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

///<reference path="../../android/graphics/Canvas.ts"/>
///<reference path="../../android/graphics/Rect.ts"/>
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/text/InputType.ts"/>
///<reference path="../../android/text/TextUtils.ts"/>
///<reference path="../../android/util/Log.ts"/>
///<reference path="../../android/util/LongSparseArray.ts"/>
///<reference path="../../android/util/SparseArray.ts"/>
///<reference path="../../android/util/SparseBooleanArray.ts"/>
///<reference path="../../android/util/StateSet.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/view/HapticFeedbackConstants.ts"/>
///<reference path="../../android/view/KeyEvent.ts"/>
///<reference path="../../android/view/MotionEvent.ts"/>
///<reference path="../../android/view/VelocityTracker.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewConfiguration.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/view/ViewParent.ts"/>
///<reference path="../../android/view/ViewTreeObserver.ts"/>
///<reference path="../../android/view/animation/Interpolator.ts"/>
///<reference path="../../android/view/animation/LinearInterpolator.ts"/>
///<reference path="../../java/util/ArrayList.ts"/>
///<reference path="../../java/util/List.ts"/>
///<reference path="../../java/lang/Integer.ts"/>
///<reference path="../../java/lang/Runnable.ts"/>
///<reference path="../../java/lang/System.ts"/>
///<reference path="../../android/widget/Adapter.ts"/>
///<reference path="../../android/widget/AdapterView.ts"/>
///<reference path="../../android/widget/Button.ts"/>
///<reference path="../../android/widget/Checkable.ts"/>
///<reference path="../../android/widget/ListAdapter.ts"/>
///<reference path="../../android/widget/OverScroller.ts"/>
///<reference path="../../android/R/drawable.ts"/>

module android.widget {
    import Canvas = android.graphics.Canvas;
    import Rect = android.graphics.Rect;
    import Drawable = android.graphics.drawable.Drawable;
    import InputType = android.text.InputType;
    import TextUtils = android.text.TextUtils;
    import Log = android.util.Log;
    import LongSparseArray = android.util.LongSparseArray;
    import SparseArray = android.util.SparseArray;
    import SparseBooleanArray = android.util.SparseBooleanArray;
    import StateSet = android.util.StateSet;
    import Gravity = android.view.Gravity;
    import HapticFeedbackConstants = android.view.HapticFeedbackConstants;
    import KeyEvent = android.view.KeyEvent;
    import MotionEvent = android.view.MotionEvent;
    import VelocityTracker = android.view.VelocityTracker;
    import View = android.view.View;
    import ViewConfiguration = android.view.ViewConfiguration;
    import ViewGroup = android.view.ViewGroup;
    import ViewParent = android.view.ViewParent;
    import ViewTreeObserver = android.view.ViewTreeObserver;
    import Interpolator = android.view.animation.Interpolator;
    import LinearInterpolator = android.view.animation.LinearInterpolator;
    import ArrayList = java.util.ArrayList;
    import List = java.util.List;
    import Integer = java.lang.Integer;
    import Runnable = java.lang.Runnable;
    import System = java.lang.System;
    import Adapter = android.widget.Adapter;
    import AdapterView = android.widget.AdapterView;
    import Button = android.widget.Button;
    import Checkable = android.widget.Checkable;
    import ListAdapter = android.widget.ListAdapter;
    import OverScroller = android.widget.OverScroller;
    import AttrBinder = androidui.attr.AttrBinder;
    /**
     * Base class that can be used to implement virtualized lists of items. A list does
     * not have a spatial definition here. For instance, subclases of this class can
     * display the content of the list in a grid, in a carousel, as stack, etc.
     *
     * @attr ref android.R.styleable#AbsListView_listSelector
     * @attr ref android.R.styleable#AbsListView_drawSelectorOnTop
     * @attr ref android.R.styleable#AbsListView_stackFromBottom
     * @attr ref android.R.styleable#AbsListView_scrollingCache
     * @attr ref android.R.styleable#AbsListView_textFilterEnabled
     * @attr ref android.R.styleable#AbsListView_transcriptMode
     * @attr ref android.R.styleable#AbsListView_cacheColorHint
     * @attr ref android.R.styleable#AbsListView_fastScrollEnabled
     * @attr ref android.R.styleable#AbsListView_smoothScrollbar
     * @attr ref android.R.styleable#AbsListView_choiceMode
     */

    export abstract class AbsListView extends AdapterView<ListAdapter> implements ViewTreeObserver.OnGlobalLayoutListener,
        ViewTreeObserver.OnTouchModeChangeListener {

        static TAG_AbsListView:string = "AbsListView";

        /**
         * Disables the transcript mode.
         *
         * @see #setTranscriptMode(int)
         */
        static TRANSCRIPT_MODE_DISABLED:number = 0;

        /**
         * The list will automatically scroll to the bottom when a data set change
         * notification is received and only if the last item is already visible
         * on screen.
         *
         * @see #setTranscriptMode(int)
         */
        static TRANSCRIPT_MODE_NORMAL:number = 1;

        /**
         * The list will automatically scroll to the bottom, no matter what items
         * are currently visible.
         *
         * @see #setTranscriptMode(int)
         */
        static TRANSCRIPT_MODE_ALWAYS_SCROLL:number = 2;

        /**
         * Indicates that we are not in the middle of a touch gesture
         */
        static TOUCH_MODE_REST:number = -1;

        /**
         * Indicates we just received the touch event and we are waiting to see if the it is a tap or a
         * scroll gesture.
         */
        static TOUCH_MODE_DOWN:number = 0;

        /**
         * Indicates the touch has been recognized as a tap and we are now waiting to see if the touch
         * is a longpress
         */
        static TOUCH_MODE_TAP:number = 1;

        /**
         * Indicates we have waited for everything we can wait for, but the user's finger is still down
         */
        static TOUCH_MODE_DONE_WAITING:number = 2;

        /**
         * Indicates the touch gesture is a scroll
         */
        static TOUCH_MODE_SCROLL:number = 3;

        /**
         * Indicates the view is in the process of being flung
         */
        static TOUCH_MODE_FLING:number = 4;

        /**
         * Indicates the touch gesture is an overscroll - a scroll beyond the beginning or end.
         */
        private static TOUCH_MODE_OVERSCROLL:number = 5;

        /**
         * Indicates the view is being flung outside of normal content bounds
         * and will spring back.
         */
        static TOUCH_MODE_OVERFLING:number = 6;

        /**
         * Regular layout - usually an unsolicited layout from the view system
         */
        static LAYOUT_NORMAL:number = 0;

        /**
         * Show the first item
         */
        static LAYOUT_FORCE_TOP:number = 1;

        /**
         * Force the selected item to be on somewhere on the screen
         */
        static LAYOUT_SET_SELECTION:number = 2;

        /**
         * Show the last item
         */
        static LAYOUT_FORCE_BOTTOM:number = 3;

        /**
         * Make a mSelectedItem appear in a specific location and build the rest of
         * the views from there. The top is specified by mSpecificTop.
         */
        static LAYOUT_SPECIFIC:number = 4;

        /**
         * Layout to sync as a result of a data change. Restore mSyncPosition to have its top
         * at mSpecificTop
         */
        static LAYOUT_SYNC:number = 5;

        /**
         * Layout as a result of using the navigation keys
         */
        static LAYOUT_MOVE_SELECTION:number = 6;

        /**
         * Normal list that does not indicate choices
         */
        static CHOICE_MODE_NONE:number = 0;

        /**
         * The list allows up to one choice
         */
        static CHOICE_MODE_SINGLE:number = 1;

        /**
         * The list allows multiple choices
         */
        static CHOICE_MODE_MULTIPLE:number = 2;

        /**
         * The list allows multiple choices in a modal selection mode
         * !!not impl this mode
         */
        static CHOICE_MODE_MULTIPLE_MODAL:number = 3;

        /**
         * Controls if/how the user may choose/check items in the list
         */
        mChoiceMode:number = AbsListView.CHOICE_MODE_NONE;

        /**
         * Controls CHOICE_MODE_MULTIPLE_MODAL. null when inactive.
         * !!not impl current
         */
        private mChoiceActionMode;

        /**
         * Wrapper for the multiple choice mode callback; AbsListView needs to perform
         * a few extra actions around what application code does.
         */
        //private mMultiChoiceModeCallback:AbsListView.MultiChoiceModeWrapper;

        /**
         * Running count of how many items are currently checked
         */
        private mCheckedItemCount:number = 0;

        /**
         * Running state of which positions are currently checked
         */
        mCheckStates:SparseBooleanArray;

        /**
         * Running state of which IDs are currently checked.
         * If there is a value for a given key, the checked state for that ID is true
         * and the value holds the last known position in the adapter for that id.
         */
        private mCheckedIdStates:LongSparseArray<number>;

        /**
         * Controls how the next layout will happen
         */
        //mLayoutMode:number = AbsListView.LAYOUT_NORMAL;

        /**
         * Should be used by subclasses to listen to changes in the dataset
         */
        mDataSetObserver:AbsListView.AdapterDataSetObserver;

        /**
         * The adapter containing the data to be displayed by this view
         */
        mAdapter:ListAdapter;

        /**
         * If mAdapter != null, whenever this is true the adapter has stable IDs.
         */
        private mAdapterHasStableIds:boolean;

        /**
         * This flag indicates the a full notify is required when the RemoteViewsAdapter connects
         */
        private mDeferNotifyDataSetChanged:boolean = false;

        /**
         * Indicates whether the list selector should be drawn on top of the children or behind
         */
        private mDrawSelectorOnTop:boolean = false;

        /**
         * The drawable used to draw the selector
         */
        private mSelector:Drawable;

        /**
         * The current position of the selector in the list.
         */
        private mSelectorPosition:number = AbsListView.INVALID_POSITION;

        /**
         * Defines the selector's location and dimension at drawing time
         */
        mSelectorRect:Rect = new Rect();

        /**
         * The data set used to store unused views that should be reused during the next layout
         * to avoid creating new ones
         */
        mRecycler:AbsListView.RecycleBin = new AbsListView.RecycleBin(this);

        /**
         * The selection's left padding
         */
        private mSelectionLeftPadding:number = 0;

        /**
         * The selection's top padding
         */
        private mSelectionTopPadding:number = 0;

        /**
         * The selection's right padding
         */
        private mSelectionRightPadding:number = 0;

        /**
         * The selection's bottom padding
         */
        private mSelectionBottomPadding:number = 0;

        /**
         * This view's padding
         */
        mListPadding:Rect = new Rect();

        /**
         * Subclasses must retain their measure spec from onMeasure() into this member
         */
        mWidthMeasureSpec:number = 0;

        /**
         * The top scroll indicator
         */
        private mScrollUp:View;

        /**
         * The down scroll indicator
         */
        private mScrollDown:View;

        /**
         * When the view is scrolling, this flag is set to true to indicate subclasses that
         * the drawing cache was enabled on the children
         */
        mCachingStarted:boolean;

        mCachingActive:boolean;

        /**
         * The position of the view that received the down motion event
         */
        mMotionPosition:number = 0;

        /**
         * The offset to the top of the mMotionPosition view when the down motion event was received
         */
        private mMotionViewOriginalTop:number = 0;

        /**
         * The desired offset to the top of the mMotionPosition view after a scroll
         */
        private mMotionViewNewTop:number = 0;

        /**
         * The X value associated with the the down motion event
         */
        private mMotionX:number = 0;

        /**
         * The Y value associated with the the down motion event
         */
        private mMotionY:number = 0;

        /**
         * One of TOUCH_MODE_REST, TOUCH_MODE_DOWN, TOUCH_MODE_TAP, TOUCH_MODE_SCROLL, or
         * TOUCH_MODE_DONE_WAITING
         */
        mTouchMode:number = AbsListView.TOUCH_MODE_REST;

        /**
         * Y value from on the previous motion event (if any)
         */
        private mLastY:number = 0;

        /**
         * How far the finger moved before we started scrolling
         */
        private mMotionCorrection:number = 0;

        /**
         * Determines speed during touch scrolling
         */
        private mVelocityTracker:VelocityTracker;

        /**
         * Handles one frame of a fling
         */
        mFlingRunnable:AbsListView.FlingRunnable;

        /**
         * Handles scrolling between positions within the list.
         */
        mPositionScroller:AbsListView.PositionScroller;

        /**
         * The offset in pixels form the top of the AdapterView to the top
         * of the currently selected view. Used to save and restore state.
         */
        mSelectedTop:number = 0;

        /**
         * Indicates whether the list is stacked from the bottom edge or
         * the top edge.
         */
        mStackFromBottom:boolean;

        /**
         * When set to true, the list automatically discards the children's
         * bitmap cache after scrolling.
         */
        private mScrollingCacheEnabled:boolean;

        /**
         * Whether or not to enable the fast scroll feature on this list
         */
        private mFastScrollEnabled:boolean;

        /**
         * Whether or not to always show the fast scroll feature on this list
         */
        private mFastScrollAlwaysVisible:boolean;

        /**
         * Optional callback to notify client when scroll position has changed
         */
        private mOnScrollListener:AbsListView.OnScrollListener;

        /**
         * Indicates whether to use pixels-based or position-based scrollbar
         * properties.
         */
        private mSmoothScrollbarEnabled:boolean = true;

        /**
         * Indicates that this view supports filtering
         */
        private mTextFilterEnabled:boolean;

        /**
         * Indicates that this view is currently displaying a filtered view of the data
         */
        private mFiltered:boolean;

        /**
         * Rectangle used for hit testing children
         */
        private mTouchFrame:Rect;

        /**
         * The position to resurrect the selected position to.
         */
        mResurrectToPosition:number = AbsListView.INVALID_POSITION;

        /**
         * Maximum distance to record overscroll
         */
        private mOverscrollMax:number = 0;

        /**
         * Content height divided by this is the overscroll limit.
         */
        private static OVERSCROLL_LIMIT_DIVISOR:number = 3;

        /**
         * How many positions in either direction we will search to try to
         * find a checked item with a stable ID that moved position across
         * a data set change. If the item isn't found it will be unselected.
         */
        private static CHECK_POSITION_SEARCH_DISTANCE:number = 20;

        /**
         * Used to request a layout when we changed touch mode
         */
        private static TOUCH_MODE_UNKNOWN:number = -1;

        private static TOUCH_MODE_ON:number = 0;

        private static TOUCH_MODE_OFF:number = 1;

        private mLastTouchMode:number = AbsListView.TOUCH_MODE_UNKNOWN;

        private static PROFILE_SCROLLING:boolean = false;

        private mScrollProfilingStarted:boolean = false;

        static PROFILE_FLINGING:boolean = false;

        private mFlingProfilingStarted:boolean = false;

        /**
         * The last CheckForLongPress runnable we posted, if any
         */
        private mPendingCheckForLongPress_List:AbsListView.CheckForLongPress;

        /**
         * The last CheckForTap runnable we posted, if any
         */
        private mPendingCheckForTap_:Runnable;

        /**
         * The last CheckForKeyLongPress runnable we posted, if any
         */
        private mPendingCheckForKeyLongPress:AbsListView.CheckForKeyLongPress;

        /**
         * Acts upon click
         */
        private mPerformClick_:AbsListView.PerformClick;

        /**
         * Delayed action for touch mode.
         */
        mTouchModeReset:Runnable;

        /**
         * This view is in transcript mode -- it shows the bottom of the list when the data
         * changes
         */
        private mTranscriptMode:number = 0;

        /**
         * Indicates that this list is always drawn on top of a solid, single-color, opaque
         * background
         */
        private mCacheColorHint:number = 0;

        /**
         * The select child's view (from the adapter's getView) is enabled.
         */
        private mIsChildViewEnabled:boolean;

        /**
         * The last scroll state reported to clients through {@link OnScrollListener}.
         */
        private mLastScrollState:number = AbsListView.OnScrollListener.SCROLL_STATE_IDLE;

        /**
         * Helper object that renders and controls the fast scroll thumb.
         */
        //private mFastScroller:FastScroller;//TODO when fast scroll impl

        private mGlobalLayoutListenerAddedFilter:boolean;

        //private mTouchSlop:number = 0;

        private mDensityScale:number = 0;

        private mClearScrollingCache:Runnable;

        mPositionScrollAfterLayout:Runnable;

        private mMinimumVelocity:number = 0;

        private mMaximumVelocity:number = 0;

        private mVelocityScale:number = 1.0;

        mIsScrap:boolean[] = new Array<boolean>(1);

        // True when the popup should be hidden because of a call to
        // dispatchDisplayHint()
        private mPopupHidden:boolean;

        /**
         * ID of the active pointer. This is used to retain consistency during
         * drags/flings if multiple pointers are used.
         */
        private mActivePointerId:number = AbsListView.INVALID_POINTER;

        /**
         * Sentinel value for no current active pointer.
         * Used by {@link #mActivePointerId}.
         */
        static INVALID_POINTER:number = -1;

        /**
         * Maximum distance to overscroll by during edge effects
         */
        private mOverscrollDistance:number = 0;

        /**
         * Maximum distance to overfling during edge effects
         */
        private _mOverflingDistance:number = 0;
        private get mOverflingDistance():number {
            if(this.mScrollY <= 0){
                if (this.mScrollY < -this._mOverflingDistance) return -this.mScrollY;
                return this._mOverflingDistance;
            }
            let overDistance = this.mScrollY;
            if (overDistance > this._mOverflingDistance) return overDistance;
            return this._mOverflingDistance;
        }
        private set mOverflingDistance(value:number) {
            this._mOverflingDistance = value;
        }

        // These two EdgeGlows are always set and used together.
        // Checking one for null is as good as checking both.
        /**
         * Tracks the state of the top edge glow.
         */
        //private mEdgeGlowTop:EdgeEffect;

        /**
         * Tracks the state of the bottom edge glow.
         */
        //private mEdgeGlowBottom:EdgeEffect;

        /**
         * An estimate of how many pixels are between the top of the list and
         * the top of the first position in the adapter, based on the last time
         * we saw it. Used to hint where to draw edge glows.
         */
        private mFirstPositionDistanceGuess:number = 0;

        /**
         * An estimate of how many pixels are between the bottom of the list and
         * the bottom of the last position in the adapter, based on the last time
         * we saw it. Used to hint where to draw edge glows.
         */
        private mLastPositionDistanceGuess:number = 0;

        /**
         * Used for determining when to cancel out of overscroll.
         */
        private mDirection:number = 0;

        /**
         * Tracked on measurement in transcript mode. Makes sure that we can still pin to
         * the bottom correctly on resizes.
         */
        private mForceTranscriptScroll:boolean;

        private mGlowPaddingLeft:number = 0;

        private mGlowPaddingRight:number = 0;

        /**
         * Used for interacting with list items from an accessibility service.
         */
        //private mAccessibilityDelegate:AbsListView.ListItemAccessibilityDelegate;
        //
        //private mLastAccessibilityScrollEventFromIndex:number;
        //
        //private mLastAccessibilityScrollEventToIndex:number;

        /**
         * Track the item count from the last time we handled a data change.
         */
        private mLastHandledItemCount:number = 0;

        /**
         * Used for smooth scrolling at a consistent rate
         */
        static sLinearInterpolator:Interpolator = new LinearInterpolator();

        /**
         * The saved state that we will be restoring from when we next sync.
         * Kept here so that if we happen to be asked to save our state before
         * the sync happens, we can return this existing data rather than losing
         * it.
         */
        private mPendingSync;//:AbsListView.SavedState;


        constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle?:Map<string, string>) {
           super(context, bindElement, defStyle);
           this.initAbsListView();

           // this.mOwnerThread = Thread.currentThread();

           let a = context.obtainStyledAttributes(bindElement, defStyle);

           let d:Drawable = a.getDrawable('listSelector');
           if (d != null) {
               this.setSelector(d);
           }

           this.mDrawSelectorOnTop = a.getBoolean('drawSelectorOnTop', false);

           let stackFromBottom:boolean = a.getBoolean('stackFromBottom', false);
           this.setStackFromBottom(stackFromBottom);

           let scrollingCacheEnabled:boolean = a.getBoolean('scrollingCache', true);
           this.setScrollingCacheEnabled(scrollingCacheEnabled);

           let useTextFilter:boolean = a.getBoolean('textFilterEnabled', false);
           this.setTextFilterEnabled(useTextFilter);

           let transcriptModeValue = a.getAttrValue('transcriptMode');
           let transcriptMode:number = AbsListView.TRANSCRIPT_MODE_DISABLED;
           if (transcriptModeValue === "disabled") transcriptMode = AbsListView.TRANSCRIPT_MODE_DISABLED;
           else if (transcriptModeValue === "normal") transcriptMode = AbsListView.TRANSCRIPT_MODE_NORMAL;
           else if (transcriptModeValue === "alwaysScroll") transcriptMode = AbsListView.TRANSCRIPT_MODE_ALWAYS_SCROLL;
           this.setTranscriptMode(transcriptMode);

           let color:number = a.getColor('cacheColorHint', 0);
           this.setCacheColorHint(color);

           let enableFastScroll:boolean = a.getBoolean('fastScrollEnabled', false);
           this.setFastScrollEnabled(enableFastScroll);

           let smoothScrollbar:boolean = a.getBoolean('smoothScrollbar', true);
           this.setSmoothScrollbarEnabled(smoothScrollbar);

           let choiceModeValue = a.getAttrValue('choiceMode');
           let choiceMode = AbsListView.CHOICE_MODE_NONE;
           if (choiceModeValue === "none") choiceMode = AbsListView.CHOICE_MODE_NONE;
           else if (choiceModeValue === "singleChoice") choiceMode = AbsListView.CHOICE_MODE_SINGLE;
           else if (choiceModeValue === "multipleChoice") choiceMode = AbsListView.CHOICE_MODE_MULTIPLE;
           this.setChoiceMode(choiceMode);
           this.setFastScrollAlwaysVisible(a.getBoolean('fastScrollAlwaysVisible', false));

           a.recycle();
        }

        private initAbsListView():void {
            // Setting focusable in touch mode will set the focusable property to true
            this.setClickable(true);
            this.setFocusableInTouchMode(true);
            this.setWillNotDraw(false);
            this.setAlwaysDrawnWithCacheEnabled(false);
            this.setScrollingCacheEnabled(true);
            const configuration:ViewConfiguration = ViewConfiguration.get();
            this.mTouchSlop = configuration.getScaledTouchSlop();
            this.mMinimumVelocity = configuration.getScaledMinimumFlingVelocity();
            this.mMaximumVelocity = configuration.getScaledMaximumFlingVelocity();
            this.mOverscrollDistance = configuration.getScaledOverscrollDistance();
            this.mOverflingDistance = configuration.getScaledOverflingDistance();
            this.mDensityScale = android.content.res.Resources.getDisplayMetrics().density;
            this.mLayoutMode = AbsListView.LAYOUT_NORMAL;
        }

        protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
            return super.createClassAttrBinder()
                .set('listSelector', {
                    setter(v: AbsListView, value: any, attrBinder: AttrBinder) {
                        let d = attrBinder.parseDrawable(value);
                        if (d) v.setSelector(d);
                    }, getter(v: AbsListView) {
                        return v.getSelector();
                    }
                })
                .set('drawSelectorOnTop', {
                    setter(v: AbsListView, value: any, attrBinder: AttrBinder) {
                        v.setDrawSelectorOnTop(attrBinder.parseBoolean(value, false));
                    }, getter(v: AbsListView) {
                        return v.mDrawSelectorOnTop;
                    }
                })
                .set('stackFromBottom', {
                    setter(v: AbsListView, value: any, attrBinder: AttrBinder) {
                        v.setStackFromBottom(attrBinder.parseBoolean(value, false));
                    }, getter(v: AbsListView) {
                        return v.isStackFromBottom();
                    }
                })
                .set('scrollingCache', {
                    setter(v: AbsListView, value: any, attrBinder: AttrBinder) {
                        v.setScrollingCacheEnabled(attrBinder.parseBoolean(value, true));
                    }, getter(v: AbsListView) {
                        return v.isScrollingCacheEnabled();
                    }
                })
                .set('transcriptMode', {
                    setter(v: AbsListView, value: any, attrBinder: AttrBinder) {
                        v.setTranscriptMode(attrBinder.parseEnum(value, new Map<string, number>()
                                .set("disabled", AbsListView.TRANSCRIPT_MODE_DISABLED)
                                .set("normal", AbsListView.TRANSCRIPT_MODE_NORMAL)
                                .set("alwaysScroll", AbsListView.TRANSCRIPT_MODE_ALWAYS_SCROLL),
                            AbsListView.TRANSCRIPT_MODE_DISABLED));
                    }, getter(v: AbsListView) {
                        return v.getTranscriptMode();
                    }
                })
                .set('cacheColorHint', {
                    setter(v: AbsListView, value: any, attrBinder: AttrBinder) {
                        let color: number = attrBinder.parseColor(value, 0);
                        v.setCacheColorHint(color);
                    }, getter(v: AbsListView) {
                        return v.getCacheColorHint();
                    }
                })
                .set('fastScrollEnabled', {
                    setter(v: AbsListView, value: any, attrBinder: AttrBinder) {
                        let enableFastScroll: boolean = attrBinder.parseBoolean(value, false);
                        v.setFastScrollEnabled(enableFastScroll);
                    }, getter(v: AbsListView) {
                        return v.isFastScrollEnabled();
                    }
                })
                .set('fastScrollAlwaysVisible', {
                    setter(v: AbsListView, value: any, attrBinder: AttrBinder) {
                        let fastScrollAlwaysVisible: boolean = attrBinder.parseBoolean(value, false);
                        v.setFastScrollAlwaysVisible(fastScrollAlwaysVisible);
                    }, getter(v: AbsListView) {
                        return v.isFastScrollAlwaysVisible();
                    }
                })
                .set('smoothScrollbar', {
                    setter(v: AbsListView, value: any, attrBinder: AttrBinder) {
                        let smoothScrollbar: boolean = attrBinder.parseBoolean(value, true);
                        v.setSmoothScrollbarEnabled(smoothScrollbar);
                    }, getter(v: AbsListView) {
                        return v.isSmoothScrollbarEnabled();
                    }
                })
                .set('choiceMode', {
                    setter(v: AbsListView, value: any, attrBinder: AttrBinder) {
                        v.setChoiceMode(attrBinder.parseEnum(value, new Map<string, number>()
                                .set("none", AbsListView.CHOICE_MODE_NONE)
                                .set("singleChoice", AbsListView.CHOICE_MODE_SINGLE)
                                .set("multipleChoice", AbsListView.CHOICE_MODE_MULTIPLE),
                            AbsListView.CHOICE_MODE_NONE));
                    }, getter(v: AbsListView) {
                        return v.getChoiceMode();
                    }
                });
        }

        setOverScrollMode(mode:number):void {
            if (mode != AbsListView.OVER_SCROLL_NEVER) {
                //if (this.mEdgeGlowTop == null) {
                //    let context:Context = this.getContext();
                //    this.mEdgeGlowTop = new EdgeEffect(context);
                //    this.mEdgeGlowBottom = new EdgeEffect(context);
                //}
            } else {
                //this.mEdgeGlowTop = null;
                //this.mEdgeGlowBottom = null;
            }
            super.setOverScrollMode(mode);
        }


        /**
         * {@inheritDoc}
         */
        setAdapter(adapter:ListAdapter):void {
            if (adapter != null) {
                this.mAdapterHasStableIds = this.mAdapter.hasStableIds();
                if (this.mChoiceMode != AbsListView.CHOICE_MODE_NONE && this.mAdapterHasStableIds && this.mCheckedIdStates == null) {
                    this.mCheckedIdStates = new LongSparseArray<number>();
                }
            }
            if (this.mCheckStates != null) {
                this.mCheckStates.clear();
            }
            if (this.mCheckedIdStates != null) {
                this.mCheckedIdStates.clear();
            }
        }

        /**
         * Returns the number of items currently selected. This will only be valid
         * if the choice mode is not {@link #CHOICE_MODE_NONE} (default).
         *
         * <p>To determine the specific items that are currently selected, use one of
         * the <code>getChecked*</code> methods.
         *
         * @return The number of items currently selected
         *
         * @see #getCheckedItemPosition()
         * @see #getCheckedItemPositions()
         * @see #getCheckedItemIds()
         */
        getCheckedItemCount():number {
            return this.mCheckedItemCount;
        }

        /**
         * Returns the checked state of the specified position. The result is only
         * valid if the choice mode has been set to {@link #CHOICE_MODE_SINGLE}
         * or {@link #CHOICE_MODE_MULTIPLE}.
         *
         * @param position The item whose checked state to return
         * @return The item's checked state or <code>false</code> if choice mode
         *         is invalid
         *
         * @see #setChoiceMode(int)
         */
        isItemChecked(position:number):boolean {
            if (this.mChoiceMode != AbsListView.CHOICE_MODE_NONE && this.mCheckStates != null) {
                return this.mCheckStates.get(position);
            }
            return false;
        }

        /**
         * Returns the currently checked item. The result is only valid if the choice
         * mode has been set to {@link #CHOICE_MODE_SINGLE}.
         *
         * @return The position of the currently checked item or
         *         {@link #INVALID_POSITION} if nothing is selected
         *
         * @see #setChoiceMode(int)
         */
        getCheckedItemPosition():number {
            if (this.mChoiceMode == AbsListView.CHOICE_MODE_SINGLE && this.mCheckStates != null && this.mCheckStates.size() == 1) {
                return this.mCheckStates.keyAt(0);
            }
            return AbsListView.INVALID_POSITION;
        }

        /**
         * Returns the set of checked items in the list. The result is only valid if
         * the choice mode has not been set to {@link #CHOICE_MODE_NONE}.
         *
         * @return  A SparseBooleanArray which will return true for each call to
         *          get(int position) where position is a checked position in the
         *          list and false otherwise, or <code>null</code> if the choice
         *          mode is set to {@link #CHOICE_MODE_NONE}.
         */
        getCheckedItemPositions():SparseBooleanArray {
            if (this.mChoiceMode != AbsListView.CHOICE_MODE_NONE) {
                return this.mCheckStates;
            }
            return null;
        }

        /**
         * Returns the set of checked items ids. The result is only valid if the
         * choice mode has not been set to {@link #CHOICE_MODE_NONE} and the adapter
         * has stable IDs. ({@link ListAdapter#hasStableIds()} == {@code true})
         *
         * @return A new array which contains the id of each checked item in the
         *         list.
         */
        getCheckedItemIds():number[] {
            if (this.mChoiceMode == AbsListView.CHOICE_MODE_NONE || this.mCheckedIdStates == null || this.mAdapter == null) {
                return [0];
            }
            const idStates:LongSparseArray<Integer> = this.mCheckedIdStates;
            const count:number = idStates.size();
            const ids:number[] = [count];
            for (let i:number = 0; i < count; i++) {
                ids[i] = idStates.keyAt(i);
            }
            return ids;
        }

        /**
         * Clear any choices previously set
         */
        clearChoices():void {
            if (this.mCheckStates != null) {
                this.mCheckStates.clear();
            }
            if (this.mCheckedIdStates != null) {
                this.mCheckedIdStates.clear();
            }
            this.mCheckedItemCount = 0;
        }

        /**
         * Sets the checked state of the specified position. The is only valid if
         * the choice mode has been set to {@link #CHOICE_MODE_SINGLE} or
         * {@link #CHOICE_MODE_MULTIPLE}.
         *
         * @param position The item whose checked state is to be checked
         * @param value The new checked state for the item
         */
        setItemChecked(position:number, value:boolean):void {
            if (this.mChoiceMode == AbsListView.CHOICE_MODE_NONE) {
                return;
            }
            // Start selection mode if needed. We don't need to if we're unchecking something.
            //if (value && this.mChoiceMode == AbsListView.CHOICE_MODE_MULTIPLE_MODAL && this.mChoiceActionMode == null) {
            //    if (this.mMultiChoiceModeCallback == null || !this.mMultiChoiceModeCallback.hasWrappedCallback()) {
            //        throw Error(`new IllegalStateException("AbsListView: attempted to start selection mode " + "for CHOICE_MODE_MULTIPLE_MODAL but no choice mode callback was " + "supplied. Call setMultiChoiceModeListener to set a callback.")`);
            //    }
            //    this.mChoiceActionMode = this.startActionMode(this.mMultiChoiceModeCallback);
            //}
            if (this.mChoiceMode == AbsListView.CHOICE_MODE_MULTIPLE || this.mChoiceMode == AbsListView.CHOICE_MODE_MULTIPLE_MODAL) {
                let oldValue:boolean = this.mCheckStates.get(position);
                this.mCheckStates.put(position, value);
                if (this.mCheckedIdStates != null && this.mAdapter.hasStableIds()) {
                    if (value) {
                        this.mCheckedIdStates.put(this.mAdapter.getItemId(position), position);
                    } else {
                        this.mCheckedIdStates.delete(this.mAdapter.getItemId(position));
                    }
                }
                if (oldValue != value) {
                    if (value) {
                        this.mCheckedItemCount++;
                    } else {
                        this.mCheckedItemCount--;
                    }
                }
                //if (this.mChoiceActionMode != null) {
                //    const id:number = this.mAdapter.getItemId(position);
                //    this.mMultiChoiceModeCallback.onItemCheckedStateChanged(this.mChoiceActionMode, position, id, value);
                //}
            } else {
                let updateIds:boolean = this.mCheckedIdStates != null && this.mAdapter.hasStableIds();
                // selected item
                if (value || this.isItemChecked(position)) {
                    this.mCheckStates.clear();
                    if (updateIds) {
                        this.mCheckedIdStates.clear();
                    }
                }
                // we ensure length of mCheckStates is 1, a fact getCheckedItemPosition relies on
                if (value) {
                    this.mCheckStates.put(position, true);
                    if (updateIds) {
                        this.mCheckedIdStates.put(this.mAdapter.getItemId(position), position);
                    }
                    this.mCheckedItemCount = 1;
                } else if (this.mCheckStates.size() == 0 || !this.mCheckStates.valueAt(0)) {
                    this.mCheckedItemCount = 0;
                }
            }
            // Do not generate a data change while we are in the layout phase
            if (!this.mInLayout && !this.mBlockLayoutRequests) {
                this.mDataChanged = true;
                this.rememberSyncState();
                this.requestLayout();
            }
        }

        performItemClick(view:View, position:number, id:number):boolean {
            let handled:boolean = false;
            let dispatchItemClick:boolean = true;
            if (this.mChoiceMode != AbsListView.CHOICE_MODE_NONE) {
                handled = true;
                let checkedStateChanged:boolean = false;
                if (this.mChoiceMode == AbsListView.CHOICE_MODE_MULTIPLE || (this.mChoiceMode == AbsListView.CHOICE_MODE_MULTIPLE_MODAL && this.mChoiceActionMode != null)) {
                    let checked:boolean = !this.mCheckStates.get(position, false);
                    this.mCheckStates.put(position, checked);
                    if (this.mCheckedIdStates != null && this.mAdapter.hasStableIds()) {
                        if (checked) {
                            this.mCheckedIdStates.put(this.mAdapter.getItemId(position), position);
                        } else {
                            this.mCheckedIdStates.delete(this.mAdapter.getItemId(position));
                        }
                    }
                    if (checked) {
                        this.mCheckedItemCount++;
                    } else {
                        this.mCheckedItemCount--;
                    }
                    //if (this.mChoiceActionMode != null) {
                    //    this.mMultiChoiceModeCallback.onItemCheckedStateChanged(this.mChoiceActionMode, position, id, checked);
                    //    dispatchItemClick = false;
                    //}
                    checkedStateChanged = true;
                } else if (this.mChoiceMode == AbsListView.CHOICE_MODE_SINGLE) {
                    let checked:boolean = !this.mCheckStates.get(position, false);
                    if (checked) {
                        this.mCheckStates.clear();
                        this.mCheckStates.put(position, true);
                        if (this.mCheckedIdStates != null && this.mAdapter.hasStableIds()) {
                            this.mCheckedIdStates.clear();
                            this.mCheckedIdStates.put(this.mAdapter.getItemId(position), position);
                        }
                        this.mCheckedItemCount = 1;
                    } else if (this.mCheckStates.size() == 0 || !this.mCheckStates.valueAt(0)) {
                        this.mCheckedItemCount = 0;
                    }
                    checkedStateChanged = true;
                }
                if (checkedStateChanged) {
                    this.updateOnScreenCheckedViews();
                }
            }
            if (dispatchItemClick) {
                handled = super.performItemClick(view, position, id) || handled;
            }
            return handled;
        }

        /**
         * Perform a quick, in-place update of the checked or activated state
         * on all visible item views. This should only be called when a valid
         * choice mode is active.
         */
        private updateOnScreenCheckedViews():void {
            const firstPos:number = this.mFirstPosition;
            const count:number = this.getChildCount();
            const useActivated:boolean = true;
            for (let i:number = 0; i < count; i++) {
                const child:View = this.getChildAt(i);
                const position:number = firstPos + i;
                if (child['setChecked']) {//child instanceof Checkable
                    (<Checkable><any>child).setChecked(this.mCheckStates.get(position));
                } else if (useActivated) {
                    child.setActivated(this.mCheckStates.get(position));
                }
            }
        }

        /**
         * @see #setChoiceMode(int)
         *
         * @return The current choice mode
         */
        getChoiceMode():number {
            return this.mChoiceMode;
        }

        /**
         * Defines the choice behavior for the List. By default, Lists do not have any choice behavior
         * ({@link #CHOICE_MODE_NONE}). By setting the choiceMode to {@link #CHOICE_MODE_SINGLE}, the
         * List allows up to one item to  be in a chosen state. By setting the choiceMode to
         * {@link #CHOICE_MODE_MULTIPLE}, the list allows any number of items to be chosen.
         *
         * @param choiceMode One of {@link #CHOICE_MODE_NONE}, {@link #CHOICE_MODE_SINGLE}, or
         * {@link #CHOICE_MODE_MULTIPLE}
         */
        setChoiceMode(choiceMode:number):void {
            this.mChoiceMode = choiceMode;
            if (this.mChoiceActionMode != null) {
                this.mChoiceActionMode.finish();
                this.mChoiceActionMode = null;
            }
            if (this.mChoiceMode != AbsListView.CHOICE_MODE_NONE) {
                if (this.mCheckStates == null) {
                    this.mCheckStates = new SparseBooleanArray(0);
                }
                if (this.mCheckedIdStates == null && this.mAdapter != null && this.mAdapter.hasStableIds()) {
                    this.mCheckedIdStates = new LongSparseArray<number>(0);
                }
                // Modal multi-choice mode only has choices when the mode is active. Clear them.
                if (this.mChoiceMode == AbsListView.CHOICE_MODE_MULTIPLE_MODAL) {
                    this.clearChoices();
                    this.setLongClickable(true);
                }
            }
        }

        /**
         * Set a {@link MultiChoiceModeListener} that will manage the lifecycle of the
         * selection {@link ActionMode}. Only used when the choice mode is set to
         * {@link #CHOICE_MODE_MULTIPLE_MODAL}.
         *
         * @param listener Listener that will manage the selection mode
         *
         * @see #setChoiceMode(int)
         */
        //setMultiChoiceModeListener(listener:AbsListView.MultiChoiceModeListener):void {
        //    if (this.mMultiChoiceModeCallback == null) {
        //        this.mMultiChoiceModeCallback = new AbsListView.MultiChoiceModeWrapper(this);
        //    }
        //    this.mMultiChoiceModeCallback.setWrapped(listener);
        //}

        /**
         * @return true if all list content currently fits within the view boundaries
         */
        private contentFits():boolean {
            const childCount:number = this.getChildCount();
            if (childCount == 0)
                return true;
            if (childCount != this.mItemCount)
                return false;
            return this.getChildAt(0).getTop() >= this.mListPadding.top && this.getChildAt(childCount - 1).getBottom() <= this.getHeight() - this.mListPadding.bottom;
        }

        /**
         * Specifies whether fast scrolling is enabled or disabled.
         * <p>
         * When fast scrolling is enabled, the user can quickly scroll through lists
         * by dragging the fast scroll thumb.
         * <p>
         * If the adapter backing this list implements {@link SectionIndexer}, the
         * fast scroller will display section header previews as the user scrolls.
         * Additionally, the user will be able to quickly jump between sections by
         * tapping along the length of the scroll bar.
         *
         * @see SectionIndexer
         * @see #isFastScrollEnabled()
         * @param enabled true to enable fast scrolling, false otherwise
         */
        setFastScrollEnabled(enabled:boolean):void {
            if (this.mFastScrollEnabled != enabled) {
                this.mFastScrollEnabled = enabled;
                this.setFastScrollerEnabledUiThread(enabled);
            }
        }

        private setFastScrollerEnabledUiThread(enabled:boolean):void {
            //TODO when fastScroller impl
            //if (this.mFastScroller != null) {
            //    this.mFastScroller.setEnabled(enabled);
            //} else if (enabled) {
            //    this.mFastScroller = new FastScroller(this);
            //    this.mFastScroller.setEnabled(true);
            //}
            //this.resolvePadding();
            //if (this.mFastScroller != null) {
            //    this.mFastScroller.updateLayout();
            //}
        }

        /**
         * Set whether or not the fast scroller should always be shown in place of
         * the standard scroll bars. This will enable fast scrolling if it is not
         * already enabled.
         * <p>
         * Fast scrollers shown in this way will not fade out and will be a
         * permanent fixture within the list. This is best combined with an inset
         * scroll bar style to ensure the scroll bar does not overlap content.
         *
         * @param alwaysShow true if the fast scroller should always be displayed,
         *            false otherwise
         * @see #setScrollBarStyle(int)
         * @see #setFastScrollEnabled(boolean)
         */
        setFastScrollAlwaysVisible(alwaysShow:boolean):void {
            if (this.mFastScrollAlwaysVisible != alwaysShow) {
                if (alwaysShow && !this.mFastScrollEnabled) {
                    this.setFastScrollEnabled(true);
                }
                this.mFastScrollAlwaysVisible = alwaysShow;
                this.setFastScrollerAlwaysVisibleUiThread(alwaysShow);
            }
        }

        private setFastScrollerAlwaysVisibleUiThread(alwaysShow:boolean):void {
            //TODO when fastScroller impl
            //if (this.mFastScroller != null) {
            //    this.mFastScroller.setAlwaysShow(alwaysShow);
            //}
        }

        /**
         * @return whether the current thread is the one that created the view
         */
        private isOwnerThread():boolean {
            return true;//one thread is js
        }

        /**
         * Returns true if the fast scroller is set to always show on this view.
         *
         * @return true if the fast scroller will always show
         * @see #setFastScrollAlwaysVisible(boolean)
         */
        isFastScrollAlwaysVisible():boolean {
            //TODO when fastScroller impl
            return false;
            //if (this.mFastScroller == null) {
            //    return this.mFastScrollEnabled && this.mFastScrollAlwaysVisible;
            //} else {
            //    return this.mFastScroller.isEnabled() && this.mFastScroller.isAlwaysShowEnabled();
            //}
        }

        getVerticalScrollbarWidth():number {
            //TODO when fastScroller impl
            //if (this.mFastScroller != null && this.mFastScroller.isEnabled()) {
            //    return Math.max(super.getVerticalScrollbarWidth(), this.mFastScroller.getWidth());
            //}
            return super.getVerticalScrollbarWidth();
        }

        /**
         * Returns true if the fast scroller is enabled.
         *
         * @see #setFastScrollEnabled(boolean)
         * @return true if fast scroll is enabled, false otherwise
         */
        isFastScrollEnabled():boolean {
            //TODO when fastScroller impl
            return false;
            //if (this.mFastScroller == null) {
            //    return this.mFastScrollEnabled;
            //} else {
            //    return this.mFastScroller.isEnabled();
            //}
        }

        setVerticalScrollbarPosition(position:number):void {
            super.setVerticalScrollbarPosition(position);
            //TODO when fastScroller impl
            //if (this.mFastScroller != null) {
            //    this.mFastScroller.setScrollbarPosition(position);
            //}
        }

        setScrollBarStyle(style:number):void {
            super.setScrollBarStyle(style);
            //TODO when fastScroller impl
            //if (this.mFastScroller != null) {
            //    this.mFastScroller.setScrollBarStyle(style);
            //}
        }

        /**
         * If fast scroll is enabled, then don't draw the vertical scrollbar.
         * @hide
         */
        isVerticalScrollBarHidden():boolean {
            return this.isFastScrollEnabled();
        }

        /**
         * When smooth scrollbar is enabled, the position and size of the scrollbar thumb
         * is computed based on the number of visible pixels in the visible items. This
         * however assumes that all list items have the same height. If you use a list in
         * which items have different heights, the scrollbar will change appearance as the
         * user scrolls through the list. To avoid this issue, you need to disable this
         * property.
         *
         * When smooth scrollbar is disabled, the position and size of the scrollbar thumb
         * is based solely on the number of items in the adapter and the position of the
         * visible items inside the adapter. This provides a stable scrollbar as the user
         * navigates through a list of items with varying heights.
         *
         * @param enabled Whether or not to enable smooth scrollbar.
         *
         * @see #setSmoothScrollbarEnabled(boolean)
         * @attr ref android.R.styleable#AbsListView_smoothScrollbar
         */
        setSmoothScrollbarEnabled(enabled:boolean):void {
            this.mSmoothScrollbarEnabled = enabled;
        }

        /**
         * Returns the current state of the fast scroll feature.
         *
         * @return True if smooth scrollbar is enabled is enabled, false otherwise.
         *
         * @see #setSmoothScrollbarEnabled(boolean)
         */
        isSmoothScrollbarEnabled():boolean {
            return this.mSmoothScrollbarEnabled;
        }

        /**
         * Set the listener that will receive notifications every time the list scrolls.
         *
         * @param l the scroll listener
         */
        setOnScrollListener(l:AbsListView.OnScrollListener):void {
            this.mOnScrollListener = l;
            this.invokeOnItemScrollListener();
        }

        /**
         * Notify our scroll listener (if there is one) of a change in scroll state
         */
        invokeOnItemScrollListener():void {
            //TODO when fastScroller impl
            //if (this.mFastScroller != null) {
            //    this.mFastScroller.onScroll(this.mFirstPosition, this.getChildCount(), this.mItemCount);
            //}
            if (this.mOnScrollListener != null) {
                this.mOnScrollListener.onScroll(this, this.mFirstPosition, this.getChildCount(), this.mItemCount);
            }
            // dummy values, View's implementation does not use these.
            this.onScrollChanged(0, 0, 0, 0);
        }

        //sendAccessibilityEvent(eventType:number):void {
        //    // events.
        //    if (eventType == AccessibilityEvent.TYPE_VIEW_SCROLLED) {
        //        const firstVisiblePosition:number = this.getFirstVisiblePosition();
        //        const lastVisiblePosition:number = this.getLastVisiblePosition();
        //        if (this.mLastAccessibilityScrollEventFromIndex == firstVisiblePosition && this.mLastAccessibilityScrollEventToIndex == lastVisiblePosition) {
        //            return;
        //        } else {
        //            this.mLastAccessibilityScrollEventFromIndex = firstVisiblePosition;
        //            this.mLastAccessibilityScrollEventToIndex = lastVisiblePosition;
        //        }
        //    }
        //    super.sendAccessibilityEvent(eventType);
        //}
        //
        //onInitializeAccessibilityEvent(event:AccessibilityEvent):void {
        //    super.onInitializeAccessibilityEvent(event);
        //    event.setClassName(AbsListView.class.getName());
        //}
        //
        //onInitializeAccessibilityNodeInfo(info:AccessibilityNodeInfo):void {
        //    super.onInitializeAccessibilityNodeInfo(info);
        //    info.setClassName(AbsListView.class.getName());
        //    if (this.isEnabled()) {
        //        if (this.getFirstVisiblePosition() > 0) {
        //            info.addAction(AccessibilityNodeInfo.ACTION_SCROLL_BACKWARD);
        //            info.setScrollable(true);
        //        }
        //        if (this.getLastVisiblePosition() < this.getCount() - 1) {
        //            info.addAction(AccessibilityNodeInfo.ACTION_SCROLL_FORWARD);
        //            info.setScrollable(true);
        //        }
        //    }
        //}
        //
        //performAccessibilityAction(action:number, arguments:Bundle):boolean {
        //    if (super.performAccessibilityAction(action, arguments)) {
        //        return true;
        //    }
        //    switch (action) {
        //        case AccessibilityNodeInfo.ACTION_SCROLL_FORWARD:
        //        {
        //            if (this.isEnabled() && this.getLastVisiblePosition() < this.getCount() - 1) {
        //                const viewportHeight:number = this.getHeight() - this.mListPadding.top - this.mListPadding.bottom;
        //                this.smoothScrollBy(viewportHeight, PositionScroller.SCROLL_DURATION);
        //                return true;
        //            }
        //        }
        //            return false;
        //        case AccessibilityNodeInfo.ACTION_SCROLL_BACKWARD:
        //        {
        //            if (this.isEnabled() && mFirstPosition > 0) {
        //                const viewportHeight:number = this.getHeight() - this.mListPadding.top - this.mListPadding.bottom;
        //                this.smoothScrollBy(-viewportHeight, PositionScroller.SCROLL_DURATION);
        //                return true;
        //            }
        //        }
        //            return false;
        //    }
        //    return false;
        //}
        //
        ///** @hide */
        //findViewByAccessibilityIdTraversal(accessibilityId:number):View {
        //    if (accessibilityId == this.getAccessibilityViewId()) {
        //        return this;
        //    }
        //    // so a service will be able to re-fetch the views.
        //    if (mDataChanged) {
        //        return null;
        //    }
        //    return super.findViewByAccessibilityIdTraversal(accessibilityId);
        //}

        /**
         * Indicates whether the children's drawing cache is used during a scroll.
         * By default, the drawing cache is enabled but this will consume more memory.
         *
         * @return true if the scrolling cache is enabled, false otherwise
         *
         * @see #setScrollingCacheEnabled(boolean)
         * @see View#setDrawingCacheEnabled(boolean)
         */
        isScrollingCacheEnabled():boolean {
            return this.mScrollingCacheEnabled;
        }

        /**
         * Enables or disables the children's drawing cache during a scroll.
         * By default, the drawing cache is enabled but this will use more memory.
         *
         * When the scrolling cache is enabled, the caches are kept after the
         * first scrolling. You can manually clear the cache by calling
         * {@link android.view.ViewGroup#setChildrenDrawingCacheEnabled(boolean)}.
         *
         * @param enabled true to enable the scroll cache, false otherwise
         *
         * @see #isScrollingCacheEnabled()
         * @see View#setDrawingCacheEnabled(boolean)
         */
        setScrollingCacheEnabled(enabled:boolean):void {
            if (this.mScrollingCacheEnabled && !enabled) {
                this.clearScrollingCache();
            }
            this.mScrollingCacheEnabled = enabled;
        }

        /**
         * Enables or disables the type filter window. If enabled, typing when
         * this view has focus will filter the children to match the users input.
         * Note that the {@link Adapter} used by this view must implement the
         * {@link Filterable} interface.
         *
         * @param textFilterEnabled true to enable type filtering, false otherwise
         *
         * @see Filterable
         */
        setTextFilterEnabled(textFilterEnabled:boolean):void {
            this.mTextFilterEnabled = textFilterEnabled;
        }

        /**
         * Indicates whether type filtering is enabled for this view
         *
         * @return true if type filtering is enabled, false otherwise
         *
         * @see #setTextFilterEnabled(boolean)
         * @see Filterable
         */
        isTextFilterEnabled():boolean {
            return this.mTextFilterEnabled;
        }

        getFocusedRect(r:Rect):void {
            let view:View = this.getSelectedView();
            if (view != null && view.getParent() == this) {
                // the focused rectangle of the selected view offset into the
                // coordinate space of this view.
                view.getFocusedRect(r);
                this.offsetDescendantRectToMyCoords(view, r);
            } else {
                // otherwise, just the norm
                super.getFocusedRect(r);
            }
        }

        private useDefaultSelector():void {
            this.setSelector(R.drawable.list_selector_background);
        }

        /**
         * Indicates whether the content of this view is pinned to, or stacked from,
         * the bottom edge.
         *
         * @return true if the content is stacked from the bottom edge, false otherwise
         */
        isStackFromBottom():boolean {
            return this.mStackFromBottom;
        }

        /**
         * When stack from bottom is set to true, the list fills its content starting from
         * the bottom of the view.
         *
         * @param stackFromBottom true to pin the view's content to the bottom edge,
         *        false to pin the view's content to the top edge
         */
        setStackFromBottom(stackFromBottom:boolean):void {
            if (this.mStackFromBottom != stackFromBottom) {
                this.mStackFromBottom = stackFromBottom;
                this.requestLayoutIfNecessary();
            }
        }

        private requestLayoutIfNecessary():void {
            if (this.getChildCount() > 0) {
                this.resetList();
                this.requestLayout();
                this.invalidate();
            }
        }



        //private acceptFilter():boolean {
        //    return this.mTextFilterEnabled && this.getAdapter() instanceof Filterable && (<Filterable> this.getAdapter()).getFilter() != null;
        //}
        //
        ///**
        // * Sets the initial value for the text filter.
        // * @param filterText The text to use for the filter.
        // *
        // * @see #setTextFilterEnabled
        // */
        //setFilterText(filterText:string):void {
        //    // Should we check for acceptFilter()?
        //    if (this.mTextFilterEnabled && !TextUtils.isEmpty(filterText)) {
        //        this.createTextFilter(false);
        //        // This is going to call our listener onTextChanged, but we might not
        //        // be ready to bring up a window yet
        //        this.mTextFilter.setText(filterText);
        //        this.mTextFilter.setSelection(filterText.length());
        //        if (this.mAdapter instanceof Filterable) {
        //            // if mPopup is non-null, then onTextChanged will do the filtering
        //            if (this.mPopup == null) {
        //                let f:Filter = (<Filterable> this.mAdapter).getFilter();
        //                f.filter(filterText);
        //            }
        //            // Set filtered to true so we will display the filter window when our main
        //            // window is ready
        //            this.mFiltered = true;
        //            this.mDataSetObserver.clearSavedState();
        //        }
        //    }
        //}
        //
        ///**
        // * Returns the list's text filter, if available.
        // * @return the list's text filter or null if filtering isn't enabled
        // */
        //getTextFilter():CharSequence {
        //    if (this.mTextFilterEnabled && this.mTextFilter != null) {
        //        return this.mTextFilter.getText();
        //    }
        //    return null;
        //}

        protected onFocusChanged(gainFocus:boolean, direction:number, previouslyFocusedRect:Rect):void {
            super.onFocusChanged(gainFocus, direction, previouslyFocusedRect);
            if (gainFocus && this.mSelectedPosition < 0 && !this.isInTouchMode()) {
                if (!this.isAttachedToWindow() && this.mAdapter != null) {
                    // Data may have changed while we were detached and it's valid
                    // to change focus while detached. Refresh so we don't die.
                    this.mDataChanged = true;
                    this.mOldItemCount = this.mItemCount;
                    this.mItemCount = this.mAdapter.getCount();
                }
                this.resurrectSelection();
            }
        }

        requestLayout():void {
            if (!this.mBlockLayoutRequests && !this.mInLayout) {
                super.requestLayout();
            }
        }

        /**
         * The list is empty. Clear everything out.
         */
        resetList():void {
            this.removeAllViewsInLayout();
            this.mFirstPosition = 0;
            this.mDataChanged = false;
            this.mPositionScrollAfterLayout = null;
            this.mNeedSync = false;
            this.mPendingSync = null;
            this.mOldSelectedPosition = AbsListView.INVALID_POSITION;
            this.mOldSelectedRowId = AbsListView.INVALID_ROW_ID;
            this.setSelectedPositionInt(AbsListView.INVALID_POSITION);
            this.setNextSelectedPositionInt(AbsListView.INVALID_POSITION);
            this.mSelectedTop = 0;
            this.mSelectorPosition = AbsListView.INVALID_POSITION;
            this.mSelectorRect.setEmpty();
            this.invalidate();
        }

        protected computeVerticalScrollExtent():number {
            const count:number = this.getChildCount();
            if (count > 0) {
                if (this.mSmoothScrollbarEnabled) {
                    let extent:number = count * 100;
                    let view:View = this.getChildAt(0);
                    const top:number = view.getTop();
                    let height:number = view.getHeight();
                    if (height > 0) {
                        extent += (top * 100) / height;
                    }
                    view = this.getChildAt(count - 1);
                    const bottom:number = view.getBottom();
                    height = view.getHeight();
                    if (height > 0) {
                        extent -= ((bottom - this.getHeight()) * 100) / height;
                    }
                    return extent;
                } else {
                    return 1;
                }
            }
            return 0;
        }

        protected computeVerticalScrollOffset():number {
            const firstPosition:number = this.mFirstPosition;
            const childCount:number = this.getChildCount();
            if (firstPosition >= 0 && childCount > 0) {
                if (this.mSmoothScrollbarEnabled) {
                    const view:View = this.getChildAt(0);
                    const top:number = view.getTop();
                    let height:number = view.getHeight();
                    if (height > 0) {
                        return Math.max(firstPosition * 100 - (top * 100) / height + Math.floor((<number> this.mScrollY / this.getHeight() * this.mItemCount * 100)), 0);
                    }
                } else {
                    let index:number;
                    const count:number = this.mItemCount;
                    if (firstPosition == 0) {
                        index = 0;
                    } else if (firstPosition + childCount == count) {
                        index = count;
                    } else {
                        index = firstPosition + childCount / 2;
                    }
                    return Math.floor((firstPosition + childCount * (index / <number> count)));
                }
            }
            return 0;
        }

        protected computeVerticalScrollRange():number {
            let result:number;
            if (this.mSmoothScrollbarEnabled) {
                result = Math.max(this.mItemCount * 100, 0);
                if (this.mScrollY != 0) {
                    // Compensate for overscroll
                    result += Math.abs(Math.floor((<number> this.mScrollY / this.getHeight() * this.mItemCount * 100)));
                }
            } else {
                result = this.mItemCount;
            }
            return result;
        }

        protected getTopFadingEdgeStrength():number {
            const count:number = this.getChildCount();
            const fadeEdge:number = super.getTopFadingEdgeStrength();
            if (count == 0) {
                return fadeEdge;
            } else {
                if (this.mFirstPosition > 0) {
                    return 1.0;
                }
                const top:number = this.getChildAt(0).getTop();
                const fadeLength:number = this.getVerticalFadingEdgeLength();
                return top < this.mPaddingTop ? -(top - this.mPaddingTop) / fadeLength : fadeEdge;
            }
        }

        protected getBottomFadingEdgeStrength():number {
            const count:number = this.getChildCount();
            const fadeEdge:number = super.getBottomFadingEdgeStrength();
            if (count == 0) {
                return fadeEdge;
            } else {
                if (this.mFirstPosition + count - 1 < this.mItemCount - 1) {
                    return 1.0;
                }
                const bottom:number = this.getChildAt(count - 1).getBottom();
                const height:number = this.getHeight();
                const fadeLength:number = this.getVerticalFadingEdgeLength();
                return bottom > height - this.mPaddingBottom ? (bottom - height + this.mPaddingBottom) / fadeLength : fadeEdge;
            }
        }

        protected onMeasure(widthMeasureSpec:number, heightMeasureSpec:number):void {
            if (this.mSelector == null) {
                this.useDefaultSelector();
            }
            const listPadding:Rect = this.mListPadding;
            listPadding.left = this.mSelectionLeftPadding + this.mPaddingLeft;
            listPadding.top = this.mSelectionTopPadding + this.mPaddingTop;
            listPadding.right = this.mSelectionRightPadding + this.mPaddingRight;
            listPadding.bottom = this.mSelectionBottomPadding + this.mPaddingBottom;
            // Check if our previous measured size was at a point where we should scroll later.
            if (this.mTranscriptMode == AbsListView.TRANSCRIPT_MODE_NORMAL) {
                const childCount:number = this.getChildCount();
                const listBottom:number = this.getHeight() - this.getPaddingBottom();
                const lastChild:View = this.getChildAt(childCount - 1);
                const lastBottom:number = lastChild != null ? lastChild.getBottom() : listBottom;
                this.mForceTranscriptScroll = this.mFirstPosition + childCount >= this.mLastHandledItemCount && lastBottom <= listBottom;
            }
        }

        /**
         * Subclasses should NOT override this method but
         *  {@link #layoutChildren()} instead.
         */
        protected onLayout(changed:boolean, l:number, t:number, r:number, b:number):void {
            super.onLayout(changed, l, t, r, b);
            this.mInLayout = true;
            if (changed) {
                let childCount:number = this.getChildCount();
                for (let i:number = 0; i < childCount; i++) {
                    this.getChildAt(i).forceLayout();
                }
                this.mRecycler.markChildrenDirty();
            }
            //TODO when fastScroller impl
            //if (this.mFastScroller != null && (mItemCount != mOldItemCount || mDataChanged)) {
            //    this.mFastScroller.onItemCountChanged(mItemCount);
            //}
            this.layoutChildren();
            this.mInLayout = false;
            this.mOverscrollMax = (b - t) / AbsListView.OVERSCROLL_LIMIT_DIVISOR;
        }

        /**
         * @hide
         */
        protected setFrame(left:number, top:number, right:number, bottom:number):boolean {
            const changed:boolean = super.setFrame(left, top, right, bottom);
            if (changed) {
                // Reposition the popup when the frame has changed. This includes
                // translating the widget, not just changing its dimension. The
                // filter popup needs to follow the widget.
                const visible:boolean = this.getWindowVisibility() == View.VISIBLE;
                //if (this.mFiltered && visible && this.mPopup != null && this.mPopup.isShowing()) {
                //    this.positionPopup();
                //}
            }
            return changed;
        }

        /**
         * Subclasses must override this method to layout their children.
         */
        protected layoutChildren():void {
        }

        updateScrollIndicators():void {
            if (this.mScrollUp != null) {
                let canScrollUp:boolean;
                // 0th element is not visible
                canScrollUp = this.mFirstPosition > 0;
                // ... Or top of 0th element is not visible
                if (!canScrollUp) {
                    if (this.getChildCount() > 0) {
                        let child:View = this.getChildAt(0);
                        canScrollUp = child.getTop() < this.mListPadding.top;
                    }
                }
                this.mScrollUp.setVisibility(canScrollUp ? View.VISIBLE : View.INVISIBLE);
            }
            if (this.mScrollDown != null) {
                let canScrollDown:boolean;
                let count:number = this.getChildCount();
                // Last item is not visible
                canScrollDown = (this.mFirstPosition + count) < this.mItemCount;
                // ... Or bottom of the last element is not visible
                if (!canScrollDown && count > 0) {
                    let child:View = this.getChildAt(count - 1);
                    canScrollDown = child.getBottom() > this.mBottom - this.mListPadding.bottom;
                }
                this.mScrollDown.setVisibility(canScrollDown ? View.VISIBLE : View.INVISIBLE);
            }
        }

        getSelectedView():View {
            if (this.mItemCount > 0 && this.mSelectedPosition >= 0) {
                return this.getChildAt(this.mSelectedPosition - this.mFirstPosition);
            } else {
                return null;
            }
        }

        /**
         * List padding is the maximum of the normal view's padding and the padding of the selector.
         *
         * @see android.view.View#getPaddingTop()
         * @see #getSelector()
         *
         * @return The top list padding.
         */
        getListPaddingTop():number {
            return this.mListPadding.top;
        }

        /**
         * List padding is the maximum of the normal view's padding and the padding of the selector.
         *
         * @see android.view.View#getPaddingBottom()
         * @see #getSelector()
         *
         * @return The bottom list padding.
         */
        getListPaddingBottom():number {
            return this.mListPadding.bottom;
        }

        /**
         * List padding is the maximum of the normal view's padding and the padding of the selector.
         *
         * @see android.view.View#getPaddingLeft()
         * @see #getSelector()
         *
         * @return The left list padding.
         */
        getListPaddingLeft():number {
            return this.mListPadding.left;
        }

        /**
         * List padding is the maximum of the normal view's padding and the padding of the selector.
         *
         * @see android.view.View#getPaddingRight()
         * @see #getSelector()
         *
         * @return The right list padding.
         */
        getListPaddingRight():number {
            return this.mListPadding.right;
        }

        /**
         * Get a view and have it show the data associated with the specified
         * position. This is called when we have already discovered that the view is
         * not available for reuse in the recycle bin. The only choices left are
         * converting an old view or making a new one.
         *
         * @param position The position to display
         * @param isScrap Array of at least 1 boolean, the first entry will become true if
         *                the returned view was taken from the scrap heap, false if otherwise.
         *
         * @return A view displaying the data associated with the specified position
         */
        obtainView(position:number, isScrap:boolean[]):View {
            //Trace.traceBegin(Trace.TRACE_TAG_VIEW, "obtainView");
            isScrap[0] = false;
            let scrapView:View;
            scrapView = this.mRecycler.getTransientStateView(position);
            if (scrapView == null) {
                scrapView = this.mRecycler.getScrapView(position);
            }
            let child:View;
            if (scrapView != null) {
                child = this.mAdapter.getView(position, scrapView, this);
                //if (child.getImportantForAccessibility() == AbsListView.IMPORTANT_FOR_ACCESSIBILITY_AUTO) {
                //    child.setImportantForAccessibility(AbsListView.IMPORTANT_FOR_ACCESSIBILITY_YES);
                //}
                if (child != scrapView) {
                    this.mRecycler.addScrapView(scrapView, position);
                    if (this.mCacheColorHint != 0) {
                        child.setDrawingCacheBackgroundColor(this.mCacheColorHint);
                    }
                } else {
                    isScrap[0] = true;
                    // recycle this view and bind it to different data.
                    //if (child.isAccessibilityFocused()) {
                    //    child.clearAccessibilityFocus();
                    //}
                    child.dispatchFinishTemporaryDetach();
                }
            } else {
                child = this.mAdapter.getView(position, null, this);
                //if (child.getImportantForAccessibility() == AbsListView.IMPORTANT_FOR_ACCESSIBILITY_AUTO) {
                //    child.setImportantForAccessibility(AbsListView.IMPORTANT_FOR_ACCESSIBILITY_YES);
                //}
                if (this.mCacheColorHint != 0) {
                    child.setDrawingCacheBackgroundColor(this.mCacheColorHint);
                }
            }
            if (this.mAdapterHasStableIds) {
                const vlp:ViewGroup.LayoutParams = child.getLayoutParams();
                let lp:AbsListView.LayoutParams;
                if (vlp == null) {
                    lp = <AbsListView.LayoutParams> this.generateDefaultLayoutParams();
                } else if (!this.checkLayoutParams(vlp)) {
                    lp = <AbsListView.LayoutParams> this.generateLayoutParams(vlp);
                } else {
                    lp = <AbsListView.LayoutParams> vlp;
                }
                lp.itemId = this.mAdapter.getItemId(position);
                child.setLayoutParams(lp);
            }
            //if (AccessibilityManager.getInstance(this.mContext).isEnabled()) {
            //    if (this.mAccessibilityDelegate == null) {
            //        this.mAccessibilityDelegate = new AbsListView.ListItemAccessibilityDelegate(this);
            //    }
            //    if (child.getAccessibilityDelegate() == null) {
            //        child.setAccessibilityDelegate(this.mAccessibilityDelegate);
            //    }
            //}
            //Trace.traceEnd(Trace.TRACE_TAG_VIEW);
            return child;
        }


        /**
         * Initializes an {@link AccessibilityNodeInfo} with information about a
         * particular item in the list.
         *
         * @param view View representing the list item.
         * @param position Position of the list item within the adapter.
         * @param info Node info to populate.
         */
        //onInitializeAccessibilityNodeInfoForItem(view:View, position:number, info:AccessibilityNodeInfo):void {
        //    const adapter:ListAdapter = this.getAdapter();
        //    if (position == AbsListView.INVALID_POSITION || adapter == null) {
        //        // The item doesn't exist, so there's not much we can do here.
        //        return;
        //    }
        //    if (!this.isEnabled() || !adapter.isEnabled(position)) {
        //        info.setEnabled(false);
        //        return;
        //    }
        //    if (position == this.getSelectedItemPosition()) {
        //        info.setSelected(true);
        //        info.addAction(AccessibilityNodeInfo.ACTION_CLEAR_SELECTION);
        //    } else {
        //        info.addAction(AccessibilityNodeInfo.ACTION_SELECT);
        //    }
        //    if (this.isClickable()) {
        //        info.addAction(AccessibilityNodeInfo.ACTION_CLICK);
        //        info.setClickable(true);
        //    }
        //    if (this.isLongClickable()) {
        //        info.addAction(AccessibilityNodeInfo.ACTION_LONG_CLICK);
        //        info.setLongClickable(true);
        //    }
        //}

        positionSelector(l:number, t:number, r:number, b:number):void;
        positionSelector(position:number, sel:View):void;
        positionSelector(...args):void {
            if(args.length===4){
                let [l, t, r, b] = args;
                this.mSelectorRect.set(l - this.mSelectionLeftPadding, t - this.mSelectionTopPadding,
                    r + this.mSelectionRightPadding, b + this.mSelectionBottomPadding);

            }else {
                let position:number = args[0];
                let sel:View = args[1];
                if (position != AbsListView.INVALID_POSITION) {
                    this.mSelectorPosition = position;
                }
                const selectorRect:Rect = this.mSelectorRect;
                selectorRect.set(sel.getLeft(), sel.getTop(), sel.getRight(), sel.getBottom());
                if (sel['adjustListItemSelectionBounds']) {
                    (<AbsListView.SelectionBoundsAdjuster><any>sel).adjustListItemSelectionBounds(selectorRect);
                }
                this.positionSelector(selectorRect.left, selectorRect.top, selectorRect.right, selectorRect.bottom);
                const isChildViewEnabled:boolean = this.mIsChildViewEnabled;
                if (sel.isEnabled() != isChildViewEnabled) {
                    this.mIsChildViewEnabled = !isChildViewEnabled;
                    if (this.getSelectedItemPosition() != AbsListView.INVALID_POSITION) {
                        this.refreshDrawableState();
                    }
                }
            }
        }

        protected dispatchDraw(canvas:Canvas):void {
            let saveCount:number = 0;
            const clipToPadding:boolean = (this.mGroupFlags & AbsListView.CLIP_TO_PADDING_MASK) == AbsListView.CLIP_TO_PADDING_MASK;
            if (clipToPadding) {
                saveCount = canvas.save();
                const scrollX:number = this.mScrollX;
                const scrollY:number = this.mScrollY;
                canvas.clipRect(scrollX + this.mPaddingLeft, scrollY + this.mPaddingTop, scrollX + this.mRight - this.mLeft - this.mPaddingRight, scrollY + this.mBottom - this.mTop - this.mPaddingBottom);
                this.mGroupFlags &= ~AbsListView.CLIP_TO_PADDING_MASK;
            }
            const drawSelectorOnTop:boolean = this.mDrawSelectorOnTop;
            if (!drawSelectorOnTop) {
                this.drawSelector(canvas);
            }
            super.dispatchDraw(canvas);
            if (drawSelectorOnTop) {
                this.drawSelector(canvas);
            }
            if (clipToPadding) {
                canvas.restoreToCount(saveCount);
                this.mGroupFlags |= AbsListView.CLIP_TO_PADDING_MASK;
            }
        }

        isPaddingOffsetRequired():boolean {
            return (this.mGroupFlags & AbsListView.CLIP_TO_PADDING_MASK) != AbsListView.CLIP_TO_PADDING_MASK;
        }

        getLeftPaddingOffset():number {
            return (this.mGroupFlags & AbsListView.CLIP_TO_PADDING_MASK) == AbsListView.CLIP_TO_PADDING_MASK ? 0 : -this.mPaddingLeft;
        }

        getTopPaddingOffset():number {
            return (this.mGroupFlags & AbsListView.CLIP_TO_PADDING_MASK) == AbsListView.CLIP_TO_PADDING_MASK ? 0 : -this.mPaddingTop;
        }

        getRightPaddingOffset():number {
            return (this.mGroupFlags & AbsListView.CLIP_TO_PADDING_MASK) == AbsListView.CLIP_TO_PADDING_MASK ? 0 : this.mPaddingRight;
        }

        getBottomPaddingOffset():number {
            return (this.mGroupFlags & AbsListView.CLIP_TO_PADDING_MASK) == AbsListView.CLIP_TO_PADDING_MASK ? 0 : this.mPaddingBottom;
        }

        protected onSizeChanged(w:number, h:number, oldw:number, oldh:number):void {
            if (this.getChildCount() > 0) {
                this.mDataChanged = true;
                this.rememberSyncState();
            }
            //TODO when fast scroller impl
            //if (this.mFastScroller != null) {
            //    this.mFastScroller.onSizeChanged(w, h, oldw, oldh);
            //}
        }

        /**
         * @return True if the current touch mode requires that we draw the selector in the pressed
         *         state.
         */
        touchModeDrawsInPressedState():boolean {
            // FIXME use isPressed for this
            switch (this.mTouchMode) {
                case AbsListView.TOUCH_MODE_TAP:
                case AbsListView.TOUCH_MODE_DONE_WAITING:
                    return true;
                default:
                    return false;
            }
        }

        /**
         * Indicates whether this view is in a state where the selector should be drawn. This will
         * happen if we have focus but are not in touch mode, or we are in the middle of displaying
         * the pressed state for an item.
         *
         * @return True if the selector should be shown
         */
        shouldShowSelector():boolean {
            return (!this.isInTouchMode()) || (this.touchModeDrawsInPressedState() && this.isPressed());
        }

        private drawSelector(canvas:Canvas):void {
            if (!this.mSelectorRect.isEmpty()) {
                const selector:Drawable = this.mSelector;
                selector.setBounds(this.mSelectorRect);
                selector.draw(canvas);
            }
        }

        /**
         * Controls whether the selection highlight drawable should be drawn on top of the item or
         * behind it.
         *
         * @param onTop If true, the selector will be drawn on the item it is highlighting. The default
         *        is false.
         *
         * @attr ref android.R.styleable#AbsListView_drawSelectorOnTop
         */
        setDrawSelectorOnTop(onTop:boolean):void {
            this.mDrawSelectorOnTop = onTop;
        }

        /**
         * Set a Drawable that should be used to highlight the currently selected item.
         *
         * @param resID A Drawable resource to use as the selection highlight.
         *
         * @attr ref android.R.styleable#AbsListView_listSelector
         */
        //setSelector(resID:number):void {
        //    this.setSelector(this.getResources().getDrawable(resID));
        //}

        setSelector(sel:Drawable):void {
            if (this.mSelector != null) {
                this.mSelector.setCallback(null);
                this.unscheduleDrawable(this.mSelector);
            }
            this.mSelector = sel;
            let padding:Rect = new Rect();
            sel.getPadding(padding);
            this.mSelectionLeftPadding = padding.left;
            this.mSelectionTopPadding = padding.top;
            this.mSelectionRightPadding = padding.right;
            this.mSelectionBottomPadding = padding.bottom;
            sel.setCallback(this);
            this.updateSelectorState();
        }

        /**
         * Returns the selector {@link android.graphics.drawable.Drawable} that is used to draw the
         * selection in the list.
         *
         * @return the drawable used to display the selector
         */
        getSelector():Drawable {
            return this.mSelector;
        }

        /**
         * Sets the selector state to "pressed" and posts a CheckForKeyLongPress to see if
         * this is a long press.
         */
        keyPressed():void {
            if (!this.isEnabled() || !this.isClickable()) {
                return;
            }
            let selector:Drawable = this.mSelector;
            let selectorRect:Rect = this.mSelectorRect;
            if (selector != null && (this.isFocused() || this.touchModeDrawsInPressedState()) && !selectorRect.isEmpty()) {
                const v:View = this.getChildAt(this.mSelectedPosition - this.mFirstPosition);
                if (v != null) {
                    if (v.hasFocusable())
                        return;
                    v.setPressed(true);
                }
                this.setPressed(true);
                const longClickable:boolean = this.isLongClickable();
                let d:Drawable = selector.getCurrent();
                //TODO when transition ok
                //if (d != null && d instanceof TransitionDrawable) {
                //    if (longClickable) {
                //        (<TransitionDrawable> d).startTransition(ViewConfiguration.getLongPressTimeout());
                //    } else {
                //        (<TransitionDrawable> d).resetTransition();
                //    }
                //}
                if (longClickable && !this.mDataChanged) {
                    if (this.mPendingCheckForKeyLongPress == null) {
                        this.mPendingCheckForKeyLongPress = new AbsListView.CheckForKeyLongPress(this);
                    }
                    this.mPendingCheckForKeyLongPress.rememberWindowAttachCount();
                    this.postDelayed(this.mPendingCheckForKeyLongPress, ViewConfiguration.getLongPressTimeout());
                }
            }
        }

        setScrollIndicators(up:View, down:View):void {
            this.mScrollUp = up;
            this.mScrollDown = down;
        }

        private updateSelectorState():void {
            if (this.mSelector != null) {
                if (this.shouldShowSelector()) {
                    this.mSelector.setState(this.getDrawableState());
                } else {
                    this.mSelector.setState(StateSet.NOTHING);
                }
            }
        }

        protected drawableStateChanged():void {
            super.drawableStateChanged();
            this.updateSelectorState();
        }

        protected onCreateDrawableState(extraSpace:number):number[] {
            // If the child view is enabled then do the default behavior.
            if (this.mIsChildViewEnabled) {
                // Common case
                return super.onCreateDrawableState(extraSpace);
            }
            // The selector uses this View's drawable state. The selected child view
            // is disabled, so we need to remove the enabled state from the drawable
            // states.
            const enabledState:number = AbsListView.ENABLED_STATE_SET[0];
            // If we don't have any extra space, it will return one of the static state arrays,
            // and clearing the enabled state on those arrays is a bad thing!  If we specify
            // we need extra space, it will create+copy into a new array that safely mutable.
            let state:number[] = super.onCreateDrawableState(extraSpace + 1);
            let enabledPos:number = -1;
            for (let i:number = state.length - 1; i >= 0; i--) {
                if (state[i] == enabledState) {
                    enabledPos = i;
                    break;
                }
            }
            // Remove the enabled state
            if (enabledPos >= 0) {
                System.arraycopy(state, enabledPos + 1, state, enabledPos, state.length - enabledPos - 1);
            }
            return state;
        }

        protected verifyDrawable(dr:Drawable):boolean {
            return this.mSelector == dr || super.verifyDrawable(dr);
        }

        jumpDrawablesToCurrentState():void {
            super.jumpDrawablesToCurrentState();
            if (this.mSelector != null)
                this.mSelector.jumpToCurrentState();
        }

        protected onAttachedToWindow():void {
            super.onAttachedToWindow();
            const treeObserver:ViewTreeObserver = this.getViewTreeObserver();
            treeObserver.addOnTouchModeChangeListener(this);
            //if (this.mTextFilterEnabled && this.mPopup != null && !this.mGlobalLayoutListenerAddedFilter) {
            //    treeObserver.addOnGlobalLayoutListener(this);
            //}
            if (this.mAdapter != null && this.mDataSetObserver == null) {
                this.mDataSetObserver = new AbsListView.AdapterDataSetObserver(this);
                this.mAdapter.registerDataSetObserver(this.mDataSetObserver);
                // Data may have changed while we were detached. Refresh.
                this.mDataChanged = true;
                this.mOldItemCount = this.mItemCount;
                this.mItemCount = this.mAdapter.getCount();
            }
        }

        protected onDetachedFromWindow():void {
            super.onDetachedFromWindow();
            // Dismiss the popup in case onSaveInstanceState() was not invoked
            this.dismissPopup();
            // Detach any view left in the scrap heap
            this.mRecycler.clear();
            const treeObserver:ViewTreeObserver = this.getViewTreeObserver();
            treeObserver.removeOnTouchModeChangeListener(this);
            //if (this.mTextFilterEnabled && this.mPopup != null) {
            //    treeObserver.removeOnGlobalLayoutListener(this);
            //    this.mGlobalLayoutListenerAddedFilter = false;
            //}
            if (this.mAdapter != null && this.mDataSetObserver != null) {
                this.mAdapter.unregisterDataSetObserver(this.mDataSetObserver);
                this.mDataSetObserver = null;
            }
            //if (this.mScrollStrictSpan != null) {
            //    this.mScrollStrictSpan.finish();
            //    this.mScrollStrictSpan = null;
            //}
            //if (this.mFlingStrictSpan != null) {
            //    this.mFlingStrictSpan.finish();
            //    this.mFlingStrictSpan = null;
            //}
            if (this.mFlingRunnable != null) {
                this.removeCallbacks(this.mFlingRunnable);
            }
            if (this.mPositionScroller != null) {
                this.mPositionScroller.stop();
            }
            if (this.mClearScrollingCache != null) {
                this.removeCallbacks(this.mClearScrollingCache);
            }
            if (this.mPerformClick_ != null) {
                this.removeCallbacks(this.mPerformClick_);
            }
            if (this.mTouchModeReset != null) {
                this.removeCallbacks(this.mTouchModeReset);
                this.mTouchModeReset.run();
            }
        }

        onWindowFocusChanged(hasWindowFocus:boolean):void {
            super.onWindowFocusChanged(hasWindowFocus);
            const touchMode:number = this.isInTouchMode() ? AbsListView.TOUCH_MODE_ON : AbsListView.TOUCH_MODE_OFF;
            if (!hasWindowFocus) {
                this.setChildrenDrawingCacheEnabled(false);
                if (this.mFlingRunnable != null) {
                    this.removeCallbacks(this.mFlingRunnable);
                    // let the fling runnable report it's new state which
                    // should be idle
                    this.mFlingRunnable.endFling();
                    if (this.mPositionScroller != null) {
                        this.mPositionScroller.stop();
                    }
                    if (this.mScrollY != 0) {
                        this.mScrollY = 0;
                        this.invalidateParentCaches();
                        this.finishGlows();
                        this.invalidate();
                    }
                }
                // Always hide the type filter
                this.dismissPopup();
                if (touchMode == AbsListView.TOUCH_MODE_OFF) {
                    // Remember the last selected element
                    this.mResurrectToPosition = this.mSelectedPosition;
                }
            } else {
                if (this.mFiltered && !this.mPopupHidden) {
                    // Show the type filter only if a filter is in effect
                    this.showPopup();
                }
                // If we changed touch mode since the last time we had focus
                if (touchMode != this.mLastTouchMode && this.mLastTouchMode != AbsListView.TOUCH_MODE_UNKNOWN) {
                    // If we come back in trackball mode, we bring the selection back
                    if (touchMode == AbsListView.TOUCH_MODE_OFF) {
                        // This will trigger a layout
                        this.resurrectSelection();
                        // If we come back in touch mode, then we want to hide the selector
                    } else {
                        this.hideSelector();
                        this.mLayoutMode = AbsListView.LAYOUT_NORMAL;
                        this.layoutChildren();
                    }
                }
            }
            this.mLastTouchMode = touchMode;
        }

        //onRtlPropertiesChanged(layoutDirection:number):void {
        //    super.onRtlPropertiesChanged(layoutDirection);
        //    if (this.mFastScroller != null) {
        //        this.mFastScroller.setScrollbarPosition(this.getVerticalScrollbarPosition());
        //    }
        //}

        /**
         * Creates the ContextMenuInfo returned from {@link #getContextMenuInfo()}. This
         * methods knows the view, position and ID of the item that received the
         * long press.
         *
         * @param view The view that received the long press.
         * @param position The position of the item that received the long press.
         * @param id The ID of the item that received the long press.
         * @return The extra information that should be returned by
         *         {@link #getContextMenuInfo()}.
         */
        //private createContextMenuInfo(view:View, position:number, id:number):ContextMenuInfo {
        //    return new AdapterContextMenuInfo(view, position, id);
        //}

        onCancelPendingInputEvents():void {
            super.onCancelPendingInputEvents();
            if (this.mPerformClick_ != null) {
                this.removeCallbacks(this.mPerformClick_);
            }
            if (this.mPendingCheckForTap_ != null) {
                this.removeCallbacks(this.mPendingCheckForTap_);
            }
            if (this.mPendingCheckForLongPress_List != null) {
                this.removeCallbacks(this.mPendingCheckForLongPress_List);
            }
            if (this.mPendingCheckForKeyLongPress != null) {
                this.removeCallbacks(this.mPendingCheckForKeyLongPress);
            }
        }


        private performLongPress(child:View, longPressPosition:number, longPressId:number):boolean {
            // CHOICE_MODE_MULTIPLE_MODAL takes over long press.
            //if (this.mChoiceMode == AbsListView.CHOICE_MODE_MULTIPLE_MODAL) {
            //    if (this.mChoiceActionMode == null && (this.mChoiceActionMode = this.startActionMode(this.mMultiChoiceModeCallback)) != null) {
            //        this.setItemChecked(longPressPosition, true);
            //        this.performHapticFeedback(HapticFeedbackConstants.LONG_PRESS);
            //    }
            //    return true;
            //}
            let handled:boolean = false;
            if (this.mOnItemLongClickListener != null) {
                handled = this.mOnItemLongClickListener.onItemLongClick(<any>this, child, longPressPosition, longPressId);
            }
            //if (!handled) {
            //    this.mContextMenuInfo = this.createContextMenuInfo(child, longPressPosition, longPressId);
            //    handled = super.showContextMenuForChild(AbsListView.this);
            //}
            if (handled) {
                this.performHapticFeedback(HapticFeedbackConstants.LONG_PRESS);
            }
            return handled;
        }

        //getContextMenuInfo():ContextMenuInfo {
        //    return this.mContextMenuInfo;
        //}
        //
        ///** @hide */
        //showContextMenu(x:number, y:number, metaState:number):boolean {
        //    const position:number = this.pointToPosition(Math.floor(x), Math.floor(y));
        //    if (position != AbsListView.INVALID_POSITION) {
        //        const id:number = this.mAdapter.getItemId(position);
        //        let child:View = this.getChildAt(position - mFirstPosition);
        //        if (child != null) {
        //            this.mContextMenuInfo = this.createContextMenuInfo(child, position, id);
        //            return super.showContextMenuForChild(AbsListView.this);
        //        }
        //    }
        //    return super.showContextMenu(x, y, metaState);
        //}
        //
        //showContextMenuForChild(originalView:View):boolean {
        //    const longPressPosition:number = this.getPositionForView(originalView);
        //    if (longPressPosition >= 0) {
        //        const longPressId:number = this.mAdapter.getItemId(longPressPosition);
        //        let handled:boolean = false;
        //        if (mOnItemLongClickListener != null) {
        //            handled = mOnItemLongClickListener.onItemLongClick(AbsListView.this, originalView, longPressPosition, longPressId);
        //        }
        //        if (!handled) {
        //            this.mContextMenuInfo = this.createContextMenuInfo(this.getChildAt(longPressPosition - mFirstPosition), longPressPosition, longPressId);
        //            handled = super.showContextMenuForChild(originalView);
        //        }
        //        return handled;
        //    }
        //    return false;
        //}

        onKeyDown(keyCode:number, event:KeyEvent):boolean {
            return false;
        }

        onKeyUp(keyCode:number, event:KeyEvent):boolean {
            if (KeyEvent.isConfirmKey(keyCode)) {
                if (!this.isEnabled()) {
                    return true;
                }
                if (this.isClickable() && this.isPressed() && this.mSelectedPosition >= 0
                    && this.mAdapter != null && this.mSelectedPosition < this.mAdapter.getCount()) {
                    const view:View = this.getChildAt(this.mSelectedPosition - this.mFirstPosition);
                    if (view != null) {
                        this.performItemClick(view, this.mSelectedPosition, this.mSelectedRowId);
                        view.setPressed(false);
                    }
                    this.setPressed(false);
                    return true;
                }
            }
            return super.onKeyUp(keyCode, event);
        }

        dispatchSetPressed(pressed:boolean):void {
            // Don't dispatch setPressed to our children. We call setPressed on ourselves to
            // get the selector in the right state, but we don't want to press each child.
        }

        /**
         * Maps a point to a position in the list.
         *
         * @param x X in local coordinate
         * @param y Y in local coordinate
         * @return The position of the item which contains the specified point, or
         *         {@link #INVALID_POSITION} if the point does not intersect an item.
         */
        pointToPosition(x:number, y:number):number {
            let frame:Rect = this.mTouchFrame;
            if (frame == null) {
                this.mTouchFrame = new Rect();
                frame = this.mTouchFrame;
            }
            const count:number = this.getChildCount();
            for (let i:number = count - 1; i >= 0; i--) {
                const child:View = this.getChildAt(i);
                if (child.getVisibility() == View.VISIBLE) {
                    child.getHitRect(frame);
                    if (frame.contains(x, y)) {
                        return this.mFirstPosition + i;
                    }
                }
            }
            return AbsListView.INVALID_POSITION;
        }

        /**
         * Maps a point to a the rowId of the item which intersects that point.
         *
         * @param x X in local coordinate
         * @param y Y in local coordinate
         * @return The rowId of the item which contains the specified point, or {@link #INVALID_ROW_ID}
         *         if the point does not intersect an item.
         */
        pointToRowId(x:number, y:number):number {
            let position:number = this.pointToPosition(x, y);
            if (position >= 0) {
                return this.mAdapter.getItemId(position);
            }
            return AbsListView.INVALID_ROW_ID;
        }

        protected checkOverScrollStartScrollIfNeeded():boolean {
            return this.mScrollY != 0;
        }

        private startScrollIfNeeded(y:number):boolean {
            // Check if we have moved far enough that it looks more like a
            // scroll than a tap
            const deltaY:number = y - this.mMotionY;
            const distance:number = Math.abs(deltaY);
            const overscroll:boolean = this.checkOverScrollStartScrollIfNeeded();
            if (overscroll || distance > this.mTouchSlop) {
                this.createScrollingCache();
                if (this.mScrollY != 0) {
                    this.mTouchMode = AbsListView.TOUCH_MODE_OVERSCROLL;
                    this.mMotionCorrection = 0;
                } else {
                    this.mTouchMode = AbsListView.TOUCH_MODE_SCROLL;
                    this.mMotionCorrection = deltaY > 0 ? this.mTouchSlop : -this.mTouchSlop;
                }
                this.removeCallbacks(this.mPendingCheckForLongPress_List);
                this.setPressed(false);
                const motionView:View = this.getChildAt(this.mMotionPosition - this.mFirstPosition);
                if (motionView != null) {
                    motionView.setPressed(false);
                }
                this.reportScrollStateChange(AbsListView.OnScrollListener.SCROLL_STATE_TOUCH_SCROLL);
                // Time to start stealing events! Once we've stolen them, don't let anyone
                // steal from us
                const parent:ViewParent = this.getParent();
                if (parent != null) {
                    parent.requestDisallowInterceptTouchEvent(true);
                }
                this.scrollIfNeeded(y);
                return true;
            }
            return false;
        }

        private scrollIfNeeded(y:number):void {
            const rawDeltaY:number = y - this.mMotionY;
            const deltaY:number = rawDeltaY - this.mMotionCorrection;
            let incrementalDeltaY:number = this.mLastY != Integer.MIN_VALUE ? y - this.mLastY : deltaY;
            if (this.mTouchMode == AbsListView.TOUCH_MODE_SCROLL) {
                if (AbsListView.PROFILE_SCROLLING) {
                    if (!this.mScrollProfilingStarted) {
                        //Debug.startMethodTracing("AbsListViewScroll");
                        this.mScrollProfilingStarted = true;
                    }
                }
                //if (this.mScrollStrictSpan == null) {
                //    // If it's non-null, we're already in a scroll.
                //    this.mScrollStrictSpan = StrictMode.enterCriticalSpan("AbsListView-scroll");
                //}
                if (y != this.mLastY) {
                    // Make sure that we do so in case we're in a parent that can intercept.
                    if ((this.mGroupFlags & AbsListView.FLAG_DISALLOW_INTERCEPT) == 0 && Math.abs(rawDeltaY) > this.mTouchSlop) {
                        const parent:ViewParent = this.getParent();
                        if (parent != null) {
                            parent.requestDisallowInterceptTouchEvent(true);
                        }
                    }
                    let motionIndex:number;
                    if (this.mMotionPosition >= 0) {
                        motionIndex = this.mMotionPosition - this.mFirstPosition;
                    } else {
                        // If we don't have a motion position that we can reliably track,
                        // pick something in the middle to make a best guess at things below.
                        motionIndex = this.getChildCount() / 2;
                    }
                    let motionViewPrevTop:number = 0;
                    let motionView:View = this.getChildAt(motionIndex);
                    if (motionView != null) {
                        motionViewPrevTop = motionView.getTop();
                    }
                    // No need to do all this work if we're not going to move anyway
                    let atEdge:boolean = false;
                    if (incrementalDeltaY != 0) {
                        atEdge = this.trackMotionScroll(deltaY, incrementalDeltaY);
                    }
                    // Check to see if we have bumped into the scroll limit
                    motionView = this.getChildAt(motionIndex);
                    if (motionView != null) {
                        // Check if the top of the motion view is where it is
                        // supposed to be
                        const motionViewRealTop:number = motionView.getTop();
                        if (atEdge) {
                            // Apply overscroll
                            let overscroll:number = -incrementalDeltaY - (motionViewRealTop - motionViewPrevTop);
                            this.overScrollBy(0, overscroll, 0, this.mScrollY, 0, 0, 0, this.mOverscrollDistance, true);
                            if (Math.abs(this.mOverscrollDistance) == Math.abs(this.mScrollY)) {
                                // Don't allow overfling if we're at the edge.
                                if (this.mVelocityTracker != null) {
                                    this.mVelocityTracker.clear();
                                }
                            }
                            const overscrollMode:number = this.getOverScrollMode();
                            if (overscrollMode == AbsListView.OVER_SCROLL_ALWAYS || (overscrollMode == AbsListView.OVER_SCROLL_IF_CONTENT_SCROLLS && !this.contentFits())) {
                                // Reset when entering overscroll.
                                this.mDirection = 0;
                                this.mTouchMode = AbsListView.TOUCH_MODE_OVERSCROLL;
                                if (rawDeltaY > 0) {
                                    //this.mEdgeGlowTop.onPull(<number> overscroll / this.getHeight());
                                    //if (!this.mEdgeGlowBottom.isFinished()) {
                                    //    this.mEdgeGlowBottom.onRelease();
                                    //}
                                    //this.invalidate(this.mEdgeGlowTop.getBounds(false));
                                } else if (rawDeltaY < 0) {
                                    //this.mEdgeGlowBottom.onPull(<number> overscroll / this.getHeight());
                                    //if (!this.mEdgeGlowTop.isFinished()) {
                                    //    this.mEdgeGlowTop.onRelease();
                                    //}
                                    //this.invalidate(this.mEdgeGlowBottom.getBounds(true));
                                }
                            }
                        }
                        this.mMotionY = y;
                    }
                    this.mLastY = y;
                }
            } else if (this.mTouchMode == AbsListView.TOUCH_MODE_OVERSCROLL) {
                if (y != this.mLastY) {
                    const oldScroll:number = this.mScrollY;
                    const newScroll:number = oldScroll - incrementalDeltaY;
                    let newDirection:number = y > this.mLastY ? 1 : -1;
                    if (this.mDirection == 0) {
                        this.mDirection = newDirection;
                    }
                    let overScrollDistance:number = -incrementalDeltaY;
                    if ((newScroll < 0 && oldScroll >= 0) || (newScroll > 0 && oldScroll <= 0)) {
                        overScrollDistance = -oldScroll;
                        incrementalDeltaY += overScrollDistance;
                    } else {
                        incrementalDeltaY = 0;
                    }
                    if (overScrollDistance != 0) {
                        this.overScrollBy(0, overScrollDistance, 0, this.mScrollY, 0, 0, 0, this.mOverscrollDistance, true);
                        //const overscrollMode:number = this.getOverScrollMode();
                        //if (overscrollMode == AbsListView.OVER_SCROLL_ALWAYS || (overscrollMode == AbsListView.OVER_SCROLL_IF_CONTENT_SCROLLS && !this.contentFits())) {
                        //    if (rawDeltaY > 0) {
                                //this.mEdgeGlowTop.onPull(<number> overScrollDistance / this.getHeight());
                                //if (!this.mEdgeGlowBottom.isFinished()) {
                                //    this.mEdgeGlowBottom.onRelease();
                                //}
                                //this.invalidate(this.mEdgeGlowTop.getBounds(false));
                            //} else if (rawDeltaY < 0) {
                                //this.mEdgeGlowBottom.onPull(<number> overScrollDistance / this.getHeight());
                                //if (!this.mEdgeGlowTop.isFinished()) {
                                //    this.mEdgeGlowTop.onRelease();
                                //}
                                //this.invalidate(this.mEdgeGlowBottom.getBounds(true));
                            //}
                        //}
                    }
                    if (incrementalDeltaY != 0) {
                        // Coming back to 'real' list scrolling
                        if (this.mScrollY != 0) {
                            this.mScrollY = 0;
                            this.invalidateParentIfNeeded();
                        }
                        this.trackMotionScroll(incrementalDeltaY, incrementalDeltaY);
                        this.mTouchMode = AbsListView.TOUCH_MODE_SCROLL;
                        // We did not scroll the full amount. Treat this essentially like the
                        // start of a new touch scroll
                        const motionPosition:number = this.findClosestMotionRow(y);
                        this.mMotionCorrection = 0;
                        let motionView:View = this.getChildAt(motionPosition - this.mFirstPosition);
                        this.mMotionViewOriginalTop = motionView != null ? motionView.getTop() : 0;
                        this.mMotionY = y;
                        this.mMotionPosition = motionPosition;
                    }
                    this.mLastY = y;
                    this.mDirection = newDirection;
                }
            }
        }

        onTouchModeChanged(isInTouchMode:boolean):void {
            if (isInTouchMode) {
                // Get rid of the selection when we enter touch mode
                this.hideSelector();
                // state.)
                if (this.getHeight() > 0 && this.getChildCount() > 0) {
                    // We do not lose focus initiating a touch (since AbsListView is focusable in
                    // touch mode). Force an initial layout to get rid of the selection.
                    this.layoutChildren();
                }
                this.updateSelectorState();
            } else {
                let touchMode:number = this.mTouchMode;
                if (touchMode == AbsListView.TOUCH_MODE_OVERSCROLL || touchMode == AbsListView.TOUCH_MODE_OVERFLING) {
                    if (this.mFlingRunnable != null) {
                        this.mFlingRunnable.endFling();
                    }
                    if (this.mPositionScroller != null) {
                        this.mPositionScroller.stop();
                    }
                    if (this.mScrollY != 0) {
                        this.mScrollY = 0;
                        this.invalidateParentCaches();
                        this.finishGlows();
                        this.invalidate();
                    }
                }
            }
        }

        onTouchEvent(ev:MotionEvent):boolean {
            if (!this.isEnabled()) {
                // events, it just doesn't respond to them.
                return this.isClickable() || this.isLongClickable();
            }
            if (this.mPositionScroller != null) {
                this.mPositionScroller.stop();
            }
            if (!this.isAttachedToWindow()) {
                // in a bogus state.
                return false;
            }
            //TODO when fast scroller impl
            //if (this.mFastScroller != null) {
            //    let intercepted:boolean = this.mFastScroller.onTouchEvent(ev);
            //    if (intercepted) {
            //        return true;
            //    }
            //}
            this.initVelocityTrackerIfNotExists();
            this.mVelocityTracker.addMovement(ev);
            const actionMasked:number = ev.getActionMasked();
            switch (actionMasked) {
                case MotionEvent.ACTION_DOWN:
                {
                    this.onTouchDown(ev);
                    break;
                }
                case MotionEvent.ACTION_MOVE:
                {
                    this.onTouchMove(ev);
                    break;
                }
                case MotionEvent.ACTION_UP:
                {
                    this.onTouchUp(ev);
                    break;
                }
                case MotionEvent.ACTION_CANCEL:
                {
                    this.onTouchCancel();
                    break;
                }
                case MotionEvent.ACTION_POINTER_UP:
                {
                    this.onSecondaryPointerUp(ev);
                    const x:number = this.mMotionX;
                    const y:number = this.mMotionY;
                    const motionPosition:number = this.pointToPosition(x, y);
                    if (motionPosition >= 0) {
                        // Remember where the motion event started
                        const child:View = this.getChildAt(motionPosition - this.mFirstPosition);
                        this.mMotionViewOriginalTop = child.getTop();
                        this.mMotionPosition = motionPosition;
                    }
                    this.mLastY = y;
                    break;
                }
                case MotionEvent.ACTION_POINTER_DOWN:
                {
                    // New pointers take over dragging duties
                    const index:number = ev.getActionIndex();
                    const id:number = ev.getPointerId(index);
                    const x:number = Math.floor(ev.getX(index));
                    const y:number = Math.floor(ev.getY(index));
                    this.mMotionCorrection = 0;
                    this.mActivePointerId = id;
                    this.mMotionX = x;
                    this.mMotionY = y;
                    const motionPosition:number = this.pointToPosition(x, y);
                    if (motionPosition >= 0) {
                        // Remember where the motion event started
                        const child:View = this.getChildAt(motionPosition - this.mFirstPosition);
                        this.mMotionViewOriginalTop = child.getTop();
                        this.mMotionPosition = motionPosition;
                    }
                    this.mLastY = y;
                    break;
                }
            }
            return true;
        }

        private onTouchDown(ev:MotionEvent):void {
            this.mActivePointerId = ev.getPointerId(0);
            if (this.mTouchMode == AbsListView.TOUCH_MODE_OVERFLING) {
                // Stopped the fling. It is a scroll.
                this.mFlingRunnable.endFling();
                if (this.mPositionScroller != null) {
                    this.mPositionScroller.stop();
                }
                this.mTouchMode = AbsListView.TOUCH_MODE_OVERSCROLL;
                this.mMotionX = Math.floor(ev.getX());
                this.mMotionY = Math.floor(ev.getY());
                this.mLastY = this.mMotionY;
                this.mMotionCorrection = 0;
                this.mDirection = 0;
            } else {
                const x:number = Math.floor(ev.getX());
                const y:number = Math.floor(ev.getY());
                let motionPosition:number = this.pointToPosition(x, y);
                if (!this.mDataChanged) {
                    if (this.mTouchMode == AbsListView.TOUCH_MODE_FLING) {
                        // Stopped a fling. It is a scroll.
                        this.createScrollingCache();
                        this.mTouchMode = AbsListView.TOUCH_MODE_SCROLL;
                        this.mMotionCorrection = 0;
                        motionPosition = this.findMotionRow(y);
                        this.mFlingRunnable.flywheelTouch();
                    } else if ((motionPosition >= 0) && this.getAdapter().isEnabled(motionPosition)) {
                        // User clicked on an actual view (and was not stopping a
                        // fling). It might be a click or a scroll. Assume it is a
                        // click until proven otherwise.
                        this.mTouchMode = AbsListView.TOUCH_MODE_DOWN;
                        // FIXME Debounce
                        if (this.mPendingCheckForTap_ == null) {
                            this.mPendingCheckForTap_ = new AbsListView.CheckForTap(this);
                        }
                        this.postDelayed(this.mPendingCheckForTap_, ViewConfiguration.getTapTimeout());
                    }
                    //AndroidUI added. so listView can drag even not touch on item (item count is less)
                    else if(motionPosition < 0){
                        this.mTouchMode = AbsListView.TOUCH_MODE_DOWN;
                    }
                }
                if (motionPosition >= 0) {
                    // Remember where the motion event started
                    const v:View = this.getChildAt(motionPosition - this.mFirstPosition);
                    this.mMotionViewOriginalTop = v.getTop();
                }
                this.mMotionX = x;
                this.mMotionY = y;
                this.mMotionPosition = motionPosition;
                this.mLastY = Integer.MIN_VALUE;
            }
            if (this.mTouchMode == AbsListView.TOUCH_MODE_DOWN && this.mMotionPosition != AbsListView.INVALID_POSITION
                && this.performButtonActionOnTouchDown(ev)) {
                this.removeCallbacks(this.mPendingCheckForTap_);
            }
        }

        private onTouchMove(ev:MotionEvent):void {
            let pointerIndex:number = ev.findPointerIndex(this.mActivePointerId);
            if (pointerIndex == -1) {
                pointerIndex = 0;
                this.mActivePointerId = ev.getPointerId(pointerIndex);
            }
            if (this.mDataChanged) {
                // Re-sync everything if data has been changed
                // since the scroll operation can query the adapter.
                this.layoutChildren();
            }
            const y:number = Math.floor(ev.getY(pointerIndex));
            switch (this.mTouchMode) {
                case AbsListView.TOUCH_MODE_DOWN:
                case AbsListView.TOUCH_MODE_TAP:
                case AbsListView.TOUCH_MODE_DONE_WAITING:
                    // scroll than a tap. If so, we'll enter scrolling mode.
                    if (this.startScrollIfNeeded(y)) {
                        break;
                    }
                    // Otherwise, check containment within list bounds. If we're
                    // outside bounds, cancel any active presses.
                    const x:number = ev.getX(pointerIndex);
                    if (!this.pointInView(x, y, this.mTouchSlop)) {
                        this.setPressed(false);
                        const motionView:View = this.getChildAt(this.mMotionPosition - this.mFirstPosition);
                        if (motionView != null) {
                            motionView.setPressed(false);
                        }
                        this.removeCallbacks(this.mTouchMode == AbsListView.TOUCH_MODE_DOWN ? this.mPendingCheckForTap_ : this.mPendingCheckForLongPress_List);
                        this.mTouchMode = AbsListView.TOUCH_MODE_DONE_WAITING;
                        this.updateSelectorState();
                    }
                    break;
                case AbsListView.TOUCH_MODE_SCROLL:
                case AbsListView.TOUCH_MODE_OVERSCROLL:
                    this.scrollIfNeeded(y);
                    break;
            }
        }

        private onTouchUp(ev:MotionEvent):void {
            switch (this.mTouchMode) {
                case AbsListView.TOUCH_MODE_DOWN:
                case AbsListView.TOUCH_MODE_TAP:
                case AbsListView.TOUCH_MODE_DONE_WAITING:
                    const motionPosition:number = this.mMotionPosition;
                    const child:View = this.getChildAt(motionPosition - this.mFirstPosition);
                    if (child != null) {
                        if (this.mTouchMode != AbsListView.TOUCH_MODE_DOWN) {
                            child.setPressed(false);
                        }
                        const x:number = ev.getX();
                        const inList:boolean = x > this.mListPadding.left && x < this.getWidth() - this.mListPadding.right;
                        if (inList && !child.hasFocusable()) {
                            if (this.mPerformClick_ == null) {
                                this.mPerformClick_ = new AbsListView.PerformClick(this);
                            }
                            const performClick:AbsListView.PerformClick = this.mPerformClick_;
                            performClick.mClickMotionPosition = motionPosition;
                            performClick.rememberWindowAttachCount();
                            this.mResurrectToPosition = motionPosition;
                            if (this.mTouchMode == AbsListView.TOUCH_MODE_DOWN || this.mTouchMode == AbsListView.TOUCH_MODE_TAP) {
                                this.removeCallbacks(this.mTouchMode == AbsListView.TOUCH_MODE_DOWN ? this.mPendingCheckForTap_ : this.mPendingCheckForLongPress_List);
                                this.mLayoutMode = AbsListView.LAYOUT_NORMAL;
                                if (!this.mDataChanged && this.mAdapter.isEnabled(motionPosition)) {
                                    this.mTouchMode = AbsListView.TOUCH_MODE_TAP;
                                    this.setSelectedPositionInt(this.mMotionPosition);
                                    this.layoutChildren();
                                    child.setPressed(true);
                                    this.positionSelector(this.mMotionPosition, child);
                                    this.setPressed(true);
                                    if (this.mSelector != null) {
                                        let d:Drawable = this.mSelector.getCurrent();
                                        //TODO when transition drawable impl
                                        //if (d != null && d instanceof TransitionDrawable) {
                                        //    (<TransitionDrawable> d).resetTransition();
                                        //}
                                    }
                                    if (this.mTouchModeReset != null) {
                                        this.removeCallbacks(this.mTouchModeReset);
                                    }
                                    this.mTouchModeReset = (()=> {
                                        const inner_this = this;
                                        class _Inner implements Runnable {

                                            run():void {
                                                inner_this.mTouchModeReset = null;
                                                inner_this.mTouchMode = AbsListView.TOUCH_MODE_REST;
                                                child.setPressed(false);
                                                inner_this.setPressed(false);
                                                if (!inner_this.mDataChanged && inner_this.isAttachedToWindow()) {
                                                    performClick.run();
                                                }
                                            }
                                        }
                                        return new _Inner();
                                    })();
                                    this.postDelayed(this.mTouchModeReset, ViewConfiguration.getPressedStateDuration());
                                } else {
                                    this.mTouchMode = AbsListView.TOUCH_MODE_REST;
                                    this.updateSelectorState();
                                }
                                return;
                            } else if (!this.mDataChanged && this.mAdapter.isEnabled(motionPosition)) {
                                performClick.run();
                            }
                        }
                    }
                    this.mTouchMode = AbsListView.TOUCH_MODE_REST;
                    this.updateSelectorState();
                    break;
                case AbsListView.TOUCH_MODE_SCROLL:
                    const childCount:number = this.getChildCount();
                    if (childCount > 0) {
                        const firstChildTop:number = this.getChildAt(0).getTop();
                        const lastChildBottom:number = this.getChildAt(childCount - 1).getBottom();
                        const contentTop:number = this.mListPadding.top;
                        const contentBottom:number = this.getHeight() - this.mListPadding.bottom;
                        if (this.mFirstPosition == 0 && firstChildTop >= contentTop && this.mFirstPosition + childCount < this.mItemCount
                            && lastChildBottom <= this.getHeight() - contentBottom) {
                            this.mTouchMode = AbsListView.TOUCH_MODE_REST;
                            this.reportScrollStateChange(AbsListView.OnScrollListener.SCROLL_STATE_IDLE);
                        } else {
                            const velocityTracker:VelocityTracker = this.mVelocityTracker;
                            velocityTracker.computeCurrentVelocity(1000, this.mMaximumVelocity);
                            const initialVelocity:number = Math.floor((velocityTracker.getYVelocity(this.mActivePointerId) * this.mVelocityScale));
                            // fling further.
                            if (Math.abs(initialVelocity) > this.mMinimumVelocity
                                && !( (this.mFirstPosition == 0 && firstChildTop == contentTop - this.mOverscrollDistance)
                                    || (this.mFirstPosition + childCount == this.mItemCount
                                        && lastChildBottom == contentBottom + this.mOverscrollDistance))) {
                                if (this.mFlingRunnable == null) {
                                    this.mFlingRunnable = new AbsListView.FlingRunnable(this);
                                }
                                this.reportScrollStateChange(AbsListView.OnScrollListener.SCROLL_STATE_FLING);
                                this.mFlingRunnable.start(-initialVelocity);
                            } else {
                                this.mTouchMode = AbsListView.TOUCH_MODE_REST;
                                this.reportScrollStateChange(AbsListView.OnScrollListener.SCROLL_STATE_IDLE);
                                if (this.mFlingRunnable != null) {
                                    this.mFlingRunnable.endFling();
                                }
                                if (this.mPositionScroller != null) {
                                    this.mPositionScroller.stop();
                                }
                            }
                        }
                    } else {
                        this.mTouchMode = AbsListView.TOUCH_MODE_REST;
                        this.reportScrollStateChange(AbsListView.OnScrollListener.SCROLL_STATE_IDLE);
                    }
                    break;
                case AbsListView.TOUCH_MODE_OVERSCROLL:
                    if (this.mFlingRunnable == null) {
                        this.mFlingRunnable = new AbsListView.FlingRunnable(this);
                    }
                    const velocityTracker:VelocityTracker = this.mVelocityTracker;
                    velocityTracker.computeCurrentVelocity(1000, this.mMaximumVelocity);
                    const initialVelocity:number = Math.floor(velocityTracker.getYVelocity(this.mActivePointerId));
                    this.reportScrollStateChange(AbsListView.OnScrollListener.SCROLL_STATE_FLING);
                    if (Math.abs(initialVelocity) > this.mMinimumVelocity) {
                        this.mFlingRunnable.startOverfling(-initialVelocity);
                    } else {
                        this.mFlingRunnable.startSpringback();
                    }
                    break;
            }
            this.setPressed(false);
            //if (this.mEdgeGlowTop != null) {
            //    this.mEdgeGlowTop.onRelease();
            //    this.mEdgeGlowBottom.onRelease();
            //}
            // Need to redraw since we probably aren't drawing the selector anymore
            this.invalidate();
            this.removeCallbacks(this.mPendingCheckForLongPress_List);
            this.recycleVelocityTracker();
            this.mActivePointerId = AbsListView.INVALID_POINTER;
            if (AbsListView.PROFILE_SCROLLING) {
                if (this.mScrollProfilingStarted) {
                    //Debug.stopMethodTracing();
                    this.mScrollProfilingStarted = false;
                }
            }
            //if (this.mScrollStrictSpan != null) {
            //    this.mScrollStrictSpan.finish();
            //    this.mScrollStrictSpan = null;
            //}
        }

        private onTouchCancel():void {
            switch (this.mTouchMode) {
                case AbsListView.TOUCH_MODE_OVERSCROLL:
                    if (this.mFlingRunnable == null) {
                        this.mFlingRunnable = new AbsListView.FlingRunnable(this);
                    }
                    this.mFlingRunnable.startSpringback();
                    break;
                case AbsListView.TOUCH_MODE_OVERFLING:
                    // Do nothing - let it play out.
                    break;
                default:
                    this.mTouchMode = AbsListView.TOUCH_MODE_REST;
                    this.setPressed(false);
                    const motionView:View = this.getChildAt(this.mMotionPosition - this.mFirstPosition);
                    if (motionView != null) {
                        motionView.setPressed(false);
                    }
                    this.clearScrollingCache();
                    this.removeCallbacks(this.mPendingCheckForLongPress_List);
                    this.recycleVelocityTracker();
            }
            //if (this.mEdgeGlowTop != null) {
            //    this.mEdgeGlowTop.onRelease();
            //    this.mEdgeGlowBottom.onRelease();
            //}
            this.mActivePointerId = AbsListView.INVALID_POINTER;
        }

        protected onOverScrolled(scrollX:number, scrollY:number, clampedX:boolean, clampedY:boolean):void {
            if (this.mScrollY != scrollY) {
                this.onScrollChanged(this.mScrollX, scrollY, this.mScrollX, this.mScrollY);
                this.mScrollY = scrollY;
                this.invalidateParentIfNeeded();
                this.awakenScrollBars();
            }
        }

        onGenericMotionEvent(event:MotionEvent):boolean {
            if (event.isPointerEvent()) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_SCROLL:
                    {
                        if (this.mTouchMode == AbsListView.TOUCH_MODE_REST) {
                            const vscroll:number = event.getAxisValue(MotionEvent.AXIS_VSCROLL);
                            if (vscroll != 0) {
                                const delta:number = Math.floor((vscroll * this.getVerticalScrollFactor()));
                                if (!this.trackMotionScroll(delta, delta)) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            return super.onGenericMotionEvent(event);
        }

        draw(canvas:Canvas):void {
            super.draw(canvas);
            //if (this.mEdgeGlowTop != null) {
            //    const scrollY:number = this.mScrollY;
            //    if (!this.mEdgeGlowTop.isFinished()) {
            //        const restoreCount:number = canvas.save();
            //        const leftPadding:number = this.mListPadding.left + this.mGlowPaddingLeft;
            //        const rightPadding:number = this.mListPadding.right + this.mGlowPaddingRight;
            //        const width:number = this.getWidth() - leftPadding - rightPadding;
            //        let edgeY:number = Math.min(0, scrollY + this.mFirstPositionDistanceGuess);
            //        canvas.translate(leftPadding, edgeY);
            //        this.mEdgeGlowTop.setSize(width, this.getHeight());
            //        if (this.mEdgeGlowTop.draw(canvas)) {
            //            this.mEdgeGlowTop.setPosition(leftPadding, edgeY);
            //            this.invalidate(this.mEdgeGlowTop.getBounds(false));
            //        }
            //        canvas.restoreToCount(restoreCount);
            //    }
            //    if (!this.mEdgeGlowBottom.isFinished()) {
            //        const restoreCount:number = canvas.save();
            //        const leftPadding:number = this.mListPadding.left + this.mGlowPaddingLeft;
            //        const rightPadding:number = this.mListPadding.right + this.mGlowPaddingRight;
            //        const width:number = this.getWidth() - leftPadding - rightPadding;
            //        const height:number = this.getHeight();
            //        let edgeX:number = -width + leftPadding;
            //        let edgeY:number = Math.max(height, scrollY + this.mLastPositionDistanceGuess);
            //        canvas.translate(edgeX, edgeY);
            //        canvas.rotate(180, width, 0);
            //        this.mEdgeGlowBottom.setSize(width, height);
            //        if (this.mEdgeGlowBottom.draw(canvas)) {
            //            // Account for the rotation
            //            this.mEdgeGlowBottom.setPosition(edgeX + width, edgeY);
            //            this.invalidate(this.mEdgeGlowBottom.getBounds(true));
            //        }
            //        canvas.restoreToCount(restoreCount);
            //    }
            //}
        }

        /**
         * @hide
         */
        setOverScrollEffectPadding(leftPadding:number, rightPadding:number):void {
            this.mGlowPaddingLeft = leftPadding;
            this.mGlowPaddingRight = rightPadding;
        }

        private initOrResetVelocityTracker():void {
            if (this.mVelocityTracker == null) {
                this.mVelocityTracker = VelocityTracker.obtain();
            } else {
                this.mVelocityTracker.clear();
            }
        }

        private initVelocityTrackerIfNotExists():void {
            if (this.mVelocityTracker == null) {
                this.mVelocityTracker = VelocityTracker.obtain();
            }
        }

        private recycleVelocityTracker():void {
            if (this.mVelocityTracker != null) {
                this.mVelocityTracker.recycle();
                this.mVelocityTracker = null;
            }
        }

        requestDisallowInterceptTouchEvent(disallowIntercept:boolean):void {
            if (disallowIntercept) {
                this.recycleVelocityTracker();
            }
            super.requestDisallowInterceptTouchEvent(disallowIntercept);
        }

        //TODO when hover impl
        //onInterceptHoverEvent(event:MotionEvent):boolean {
        //    //TODO when fast scroller impl
        //    //if (this.mFastScroller != null && this.mFastScroller.onInterceptHoverEvent(event)) {
        //    //    return true;
        //    //}
        //    return super.onInterceptHoverEvent(event);
        //}

        onInterceptTouchEvent(ev:MotionEvent):boolean {
            let action:number = ev.getAction();
            let v:View;
            if (this.mPositionScroller != null) {
                this.mPositionScroller.stop();
            }
            if (!this.isAttachedToWindow()) {
                // in a bogus state.
                return false;
            }
            //TODO when fast scroller impl
            //if (this.mFastScroller != null && this.mFastScroller.onInterceptTouchEvent(ev)) {
            //    return true;
            //}
            switch (action & MotionEvent.ACTION_MASK) {
                case MotionEvent.ACTION_DOWN:
                {
                    let touchMode:number = this.mTouchMode;
                    if (touchMode == AbsListView.TOUCH_MODE_OVERFLING || touchMode == AbsListView.TOUCH_MODE_OVERSCROLL) {
                        this.mMotionCorrection = 0;
                        return true;
                    }
                    const x:number = Math.floor(ev.getX());
                    const y:number = Math.floor(ev.getY());
                    this.mActivePointerId = ev.getPointerId(0);
                    let motionPosition:number = this.findMotionRow(y);
                    if (touchMode != AbsListView.TOUCH_MODE_FLING && motionPosition >= 0) {
                        // User clicked on an actual view (and was not stopping a fling).
                        // Remember where the motion event started
                        v = this.getChildAt(motionPosition - this.mFirstPosition);
                        this.mMotionViewOriginalTop = v.getTop();
                        this.mMotionX = x;
                        this.mMotionY = y;
                        this.mMotionPosition = motionPosition;
                        this.mTouchMode = AbsListView.TOUCH_MODE_DOWN;
                        this.clearScrollingCache();
                    }
                    this.mLastY = Integer.MIN_VALUE;
                    this.initOrResetVelocityTracker();
                    this.mVelocityTracker.addMovement(ev);
                    if (touchMode == AbsListView.TOUCH_MODE_FLING) {
                        return true;
                    }
                    break;
                }
                case MotionEvent.ACTION_MOVE:
                {
                    switch (this.mTouchMode) {
                        case AbsListView.TOUCH_MODE_DOWN:
                            let pointerIndex:number = ev.findPointerIndex(this.mActivePointerId);
                            if (pointerIndex == -1) {
                                pointerIndex = 0;
                                this.mActivePointerId = ev.getPointerId(pointerIndex);
                            }
                            const y:number = Math.floor(ev.getY(pointerIndex));
                            this.initVelocityTrackerIfNotExists();
                            this.mVelocityTracker.addMovement(ev);
                            if (this.startScrollIfNeeded(y)) {
                                return true;
                            }
                            break;
                    }
                    break;
                }
                case MotionEvent.ACTION_CANCEL:
                case MotionEvent.ACTION_UP:
                {
                    this.mTouchMode = AbsListView.TOUCH_MODE_REST;
                    this.mActivePointerId = AbsListView.INVALID_POINTER;
                    this.recycleVelocityTracker();
                    this.reportScrollStateChange(AbsListView.OnScrollListener.SCROLL_STATE_IDLE);
                    break;
                }
                case MotionEvent.ACTION_POINTER_UP:
                {
                    this.onSecondaryPointerUp(ev);
                    break;
                }
            }
            return false;
        }

        private onSecondaryPointerUp(ev:MotionEvent):void {
            const pointerIndex:number = (ev.getAction() & MotionEvent.ACTION_POINTER_INDEX_MASK) >> MotionEvent.ACTION_POINTER_INDEX_SHIFT;
            const pointerId:number = ev.getPointerId(pointerIndex);
            if (pointerId == this.mActivePointerId) {
                // This was our active pointer going up. Choose a new
                // active pointer and adjust accordingly.
                // TODO: Make this decision more intelligent.
                const newPointerIndex:number = pointerIndex == 0 ? 1 : 0;
                this.mMotionX = Math.floor(ev.getX(newPointerIndex));
                this.mMotionY = Math.floor(ev.getY(newPointerIndex));
                this.mMotionCorrection = 0;
                this.mActivePointerId = ev.getPointerId(newPointerIndex);
            }
        }

        /**
         * {@inheritDoc}
         */
        addTouchables(views:ArrayList<View>):void {
            const count:number = this.getChildCount();
            const firstPosition:number = this.mFirstPosition;
            const adapter:ListAdapter = this.mAdapter;
            if (adapter == null) {
                return;
            }
            for (let i:number = 0; i < count; i++) {
                const child:View = this.getChildAt(i);
                if (adapter.isEnabled(firstPosition + i)) {
                    views.add(child);
                }
                child.addTouchables(views);
            }
        }

        /**
         * Fires an "on scroll state changed" event to the registered
         * {@link android.widget.AbsListView.OnScrollListener}, if any. The state change
         * is fired only if the specified state is different from the previously known state.
         *
         * @param newState The new scroll state.
         */
        private reportScrollStateChange(newState:number):void {
            if (newState != this.mLastScrollState) {
                if (this.mOnScrollListener != null) {
                    this.mLastScrollState = newState;
                    this.mOnScrollListener.onScrollStateChanged(this, newState);
                }
            }
        }


        /**
         * The amount of friction applied to flings. The default value
         * is {@link ViewConfiguration#getScrollFriction}.
         */
        setFriction(friction:number):void {
            if (this.mFlingRunnable == null) {
                this.mFlingRunnable = new AbsListView.FlingRunnable(this);
            }
            this.mFlingRunnable.mScroller.setFriction(friction);
        }

        /**
         * Sets a scale factor for the fling velocity. The initial scale
         * factor is 1.0.
         *
         * @param scale The scale factor to multiply the velocity by.
         */
        setVelocityScale(scale:number):void {
            this.mVelocityScale = scale;
        }

        /**
         * Smoothly scroll to the specified adapter position. The view will scroll
         * such that the indicated position is displayed <code>offset</code> pixels from
         * the top edge of the view. If this is impossible, (e.g. the offset would scroll
         * the first or last item beyond the boundaries of the list) it will get as close
         * as possible. The scroll will take <code>duration</code> milliseconds to complete.
         *
         * @param position Position to scroll to
         * @param offset Desired distance in pixels of <code>position</code> from the top
         *               of the view when scrolling is finished
         * @param duration Number of milliseconds to use for the scroll
         */
        smoothScrollToPositionFromTop(position:number, offset:number, duration?:number):void {
            if (this.mPositionScroller == null) {
                this.mPositionScroller = new AbsListView.PositionScroller(this);
            }
            this.mPositionScroller.startWithOffset(position, offset, duration);
        }

        /**
         * Smoothly scroll to the specified adapter position. The view will
         * scroll such that the indicated position is displayed, but it will
         * stop early if scrolling further would scroll boundPosition out of
         * view.
         * @param position Scroll to this adapter position.
         * @param boundPosition Do not scroll if it would move this adapter
         *          position out of view.
         */
        smoothScrollToPosition(position:number, boundPosition?:number):void {
            if (this.mPositionScroller == null) {
                this.mPositionScroller = new AbsListView.PositionScroller(this);
            }
            this.mPositionScroller.start(position, boundPosition);
        }

        /**
         * Smoothly scroll by distance pixels over duration milliseconds.
         * @param distance Distance to scroll in pixels.
         * @param duration Duration of the scroll animation in milliseconds.
         */
        smoothScrollBy(distance:number, duration:number, linear:boolean=false):void {
            if (this.mFlingRunnable == null) {
                this.mFlingRunnable = new AbsListView.FlingRunnable(this);
            }
            // No sense starting to scroll if we're not going anywhere
            const firstPos:number = this.mFirstPosition;
            const childCount:number = this.getChildCount();
            const lastPos:number = firstPos + childCount;
            const topLimit:number = this.getPaddingTop();
            const bottomLimit:number = this.getHeight() - this.getPaddingBottom();
            if (distance == 0 || this.mItemCount == 0 || childCount == 0
                || (firstPos == 0 && this.getChildAt(0).getTop() == topLimit && distance < 0)
                || (lastPos == this.mItemCount && this.getChildAt(childCount - 1).getBottom() == bottomLimit && distance > 0)) {
                this.mFlingRunnable.endFling();
                if (this.mPositionScroller != null) {
                    this.mPositionScroller.stop();
                }
            } else {
                this.reportScrollStateChange(AbsListView.OnScrollListener.SCROLL_STATE_FLING);
                this.mFlingRunnable.startScroll(distance, duration, linear);
            }
        }

        /**
         * Allows RemoteViews to scroll relatively to a position.
         */
        smoothScrollByOffset(position:number):void {
            let index:number = -1;
            if (position < 0) {
                index = this.getFirstVisiblePosition();
            } else if (position > 0) {
                index = this.getLastVisiblePosition();
            }
            if (index > -1) {
                let child:View = this.getChildAt(index - this.getFirstVisiblePosition());
                if (child != null) {
                    let visibleRect:Rect = new Rect();
                    if (child.getGlobalVisibleRect(visibleRect)) {
                        // the child is partially visible
                        let childRectArea:number = child.getWidth() * child.getHeight();
                        let visibleRectArea:number = visibleRect.width() * visibleRect.height();
                        let visibleArea:number = (visibleRectArea / <number> childRectArea);
                        const visibleThreshold:number = 0.75;
                        if ((position < 0) && (visibleArea < visibleThreshold)) {
                            // the top index is not perceivably visible so offset
                            // to account for showing that top index as well
                            ++index;
                        } else if ((position > 0) && (visibleArea < visibleThreshold)) {
                            // the bottom index is not perceivably visible so offset
                            // to account for showing that bottom index as well
                            --index;
                        }
                    }
                    this.smoothScrollToPosition(Math.max(0, Math.min(this.getCount(), index + position)));
                }
            }
        }

        private createScrollingCache():void {
            if (this.mScrollingCacheEnabled && !this.mCachingStarted && !this.isHardwareAccelerated()) {
                this.setChildrenDrawnWithCacheEnabled(true);
                this.setChildrenDrawingCacheEnabled(true);
                this.mCachingStarted = this.mCachingActive = true;
            }
        }

        private clearScrollingCache():void {
            if (!this.isHardwareAccelerated()) {
                if (this.mClearScrollingCache == null) {
                    this.mClearScrollingCache = (()=> {
                        const inner_this = this;
                        class _Inner implements Runnable {

                            run():void {
                                if (inner_this.mCachingStarted) {
                                    inner_this.mCachingStarted = inner_this.mCachingActive = false;
                                    inner_this.setChildrenDrawnWithCacheEnabled(false);
                                    if ((inner_this.mPersistentDrawingCache & AbsListView.PERSISTENT_SCROLLING_CACHE) == 0) {
                                        inner_this.setChildrenDrawingCacheEnabled(false);
                                    }
                                    if (!inner_this.isAlwaysDrawnWithCacheEnabled()) {
                                        inner_this.invalidate();
                                    }
                                }
                            }
                        }
                        return new _Inner();
                    })();
                }
                this.post(this.mClearScrollingCache);
            }
        }

        /**
         * Scrolls the list items within the view by a specified number of pixels.
         *
         * @param y the amount of pixels to scroll by vertically
         * @see #canScrollList(int)
         */
        scrollListBy(y:number):void {
            this.trackMotionScroll(-y, -y);
        }

        /**
         * Check if the items in the list can be scrolled in a certain direction.
         *
         * @param direction Negative to check scrolling up, positive to check
         *            scrolling down.
         * @return true if the list can be scrolled in the specified direction,
         *         false otherwise.
         * @see #scrollListBy(int)
         */
        canScrollList(direction:number):boolean {
            const childCount:number = this.getChildCount();
            if (childCount == 0) {
                return false;
            }
            const firstPosition:number = this.mFirstPosition;
            const listPadding:Rect = this.mListPadding;
            if (direction > 0) {
                const lastBottom:number = this.getChildAt(childCount - 1).getBottom();
                const lastPosition:number = firstPosition + childCount;
                return lastPosition < this.mItemCount || lastBottom > this.getHeight() - listPadding.bottom;
            } else {
                const firstTop:number = this.getChildAt(0).getTop();
                return firstPosition > 0 || firstTop < listPadding.top;
            }
        }

        /**
         * Track a motion scroll
         *
         * @param deltaY Amount to offset mMotionView. This is the accumulated delta since the motion
         *        began. Positive numbers mean the user's finger is moving down the screen.
         * @param incrementalDeltaY Change in deltaY from the previous event.
         * @return true if we're already at the beginning/end of the list and have nothing to do.
         */
        private trackMotionScroll(deltaY:number, incrementalDeltaY:number):boolean {
            const childCount:number = this.getChildCount();
            if (childCount == 0) {
                return true;
            }
            const firstTop:number = this.getChildAt(0).getTop();
            const lastBottom:number = this.getChildAt(childCount - 1).getBottom();
            const listPadding:Rect = this.mListPadding;
            // "effective padding" In this case is the amount of padding that affects
            // how much space should not be filled by items. If we don't clip to padding
            // there is no effective padding.
            let effectivePaddingTop:number = 0;
            let effectivePaddingBottom:number = 0;
            if ((this.mGroupFlags & AbsListView.CLIP_TO_PADDING_MASK) == AbsListView.CLIP_TO_PADDING_MASK) {
                effectivePaddingTop = listPadding.top;
                effectivePaddingBottom = listPadding.bottom;
            }
            // FIXME account for grid vertical spacing too?
            const spaceAbove:number = effectivePaddingTop - firstTop;
            const end:number = this.getHeight() - effectivePaddingBottom;
            const spaceBelow:number = lastBottom - end;
            const height:number = this.getHeight() - this.mPaddingBottom - this.mPaddingTop;
            if (deltaY < 0) {
                deltaY = Math.max(-(height - 1), deltaY);
            } else {
                deltaY = Math.min(height - 1, deltaY);
            }
            if (incrementalDeltaY < 0) {
                incrementalDeltaY = Math.max(-(height - 1), incrementalDeltaY);
            } else {
                incrementalDeltaY = Math.min(height - 1, incrementalDeltaY);
            }
            const firstPosition:number = this.mFirstPosition;
            // Update our guesses for where the first and last views are
            if (firstPosition == 0) {
                this.mFirstPositionDistanceGuess = firstTop - listPadding.top;
            } else {
                this.mFirstPositionDistanceGuess += incrementalDeltaY;
            }
            if (firstPosition + childCount == this.mItemCount) {
                this.mLastPositionDistanceGuess = lastBottom + listPadding.bottom;
            } else {
                this.mLastPositionDistanceGuess += incrementalDeltaY;
            }
            const cannotScrollDown:boolean = (firstPosition == 0 && firstTop >= listPadding.top && incrementalDeltaY >= 0);
            const cannotScrollUp:boolean = (firstPosition + childCount == this.mItemCount && lastBottom <= this.getHeight() - listPadding.bottom && incrementalDeltaY <= 0);
            if (cannotScrollDown || cannotScrollUp) {
                return incrementalDeltaY != 0;
            }
            const down:boolean = incrementalDeltaY < 0;
            const inTouchMode:boolean = this.isInTouchMode();
            if (inTouchMode) {
                this.hideSelector();
            }
            const headerViewsCount:number = this.getHeaderViewsCount();
            const footerViewsStart:number = this.mItemCount - this.getFooterViewsCount();
            let start:number = 0;
            let count:number = 0;
            if (down) {
                let top:number = -incrementalDeltaY;
                if ((this.mGroupFlags & AbsListView.CLIP_TO_PADDING_MASK) == AbsListView.CLIP_TO_PADDING_MASK) {
                    top += listPadding.top;
                }
                for (let i:number = 0; i < childCount; i++) {
                    const child:View = this.getChildAt(i);
                    if (child.getBottom() >= top) {
                        break;
                    } else {
                        count++;
                        let position:number = firstPosition + i;
                        if (position >= headerViewsCount && position < footerViewsStart) {
                            // system-managed transient state.
                            //if (child.isAccessibilityFocused()) {
                            //    child.clearAccessibilityFocus();
                            //}
                            this.mRecycler.addScrapView(child, position);
                        }
                    }
                }
            } else {
                let bottom:number = this.getHeight() - incrementalDeltaY;
                if ((this.mGroupFlags & AbsListView.CLIP_TO_PADDING_MASK) == AbsListView.CLIP_TO_PADDING_MASK) {
                    bottom -= listPadding.bottom;
                }
                for (let i:number = childCount - 1; i >= 0; i--) {
                    const child:View = this.getChildAt(i);
                    if (child.getTop() <= bottom) {
                        break;
                    } else {
                        start = i;
                        count++;
                        let position:number = firstPosition + i;
                        if (position >= headerViewsCount && position < footerViewsStart) {
                            // system-managed transient state.
                            //if (child.isAccessibilityFocused()) {
                            //    child.clearAccessibilityFocus();
                            //}
                            this.mRecycler.addScrapView(child, position);
                        }
                    }
                }
            }
            this.mMotionViewNewTop = this.mMotionViewOriginalTop + deltaY;
            this.mBlockLayoutRequests = true;
            if (count > 0) {
                this.detachViewsFromParent(start, count);
                this.mRecycler.removeSkippedScrap();
            }
            // calls to bubble up from the children all the way to the top
            if (!this.awakenScrollBars()) {
                this.invalidate();
            }
            this.offsetChildrenTopAndBottom(incrementalDeltaY);
            if (down) {
                this.mFirstPosition += count;
            }
            const absIncrementalDeltaY:number = Math.abs(incrementalDeltaY);
            if (spaceAbove < absIncrementalDeltaY || spaceBelow < absIncrementalDeltaY) {
                this.fillGap(down);
            }
            if (!inTouchMode && this.mSelectedPosition != AbsListView.INVALID_POSITION) {
                const childIndex:number = this.mSelectedPosition - this.mFirstPosition;
                if (childIndex >= 0 && childIndex < this.getChildCount()) {
                    this.positionSelector(this.mSelectedPosition, this.getChildAt(childIndex));
                }
            } else if (this.mSelectorPosition != AbsListView.INVALID_POSITION) {
                const childIndex:number = this.mSelectorPosition - this.mFirstPosition;
                if (childIndex >= 0 && childIndex < this.getChildCount()) {
                    this.positionSelector(AbsListView.INVALID_POSITION, this.getChildAt(childIndex));
                }
            } else {
                this.mSelectorRect.setEmpty();
            }
            this.mBlockLayoutRequests = false;
            this.invokeOnItemScrollListener();
            return false;
        }

        /**
         * Returns the number of header views in the list. Header views are special views
         * at the top of the list that should not be recycled during a layout.
         *
         * @return The number of header views, 0 in the default implementation.
         */
        getHeaderViewsCount():number {
            return 0;
        }

        /**
         * Returns the number of footer views in the list. Footer views are special views
         * at the bottom of the list that should not be recycled during a layout.
         *
         * @return The number of footer views, 0 in the default implementation.
         */
        getFooterViewsCount():number {
            return 0;
        }

        /**
         * Fills the gap left open by a touch-scroll. During a touch scroll, children that
         * remain on screen are shifted and the other ones are discarded. The role of this
         * method is to fill the gap thus created by performing a partial layout in the
         * empty space.
         *
         * @param down true if the scroll is going down, false if it is going up
         */
        abstract fillGap(down:boolean):void ;

        hideSelector():void {
            if (this.mSelectedPosition != AbsListView.INVALID_POSITION) {
                if (this.mLayoutMode != AbsListView.LAYOUT_SPECIFIC) {
                    this.mResurrectToPosition = this.mSelectedPosition;
                }
                if (this.mNextSelectedPosition >= 0 && this.mNextSelectedPosition != this.mSelectedPosition) {
                    this.mResurrectToPosition = this.mNextSelectedPosition;
                }
                this.setSelectedPositionInt(AbsListView.INVALID_POSITION);
                this.setNextSelectedPositionInt(AbsListView.INVALID_POSITION);
                this.mSelectedTop = 0;
            }
        }

        /**
         * @return A position to select. First we try mSelectedPosition. If that has been clobbered by
         * entering touch mode, we then try mResurrectToPosition. Values are pinned to the range
         * of items available in the adapter
         */
        reconcileSelectedPosition():number {
            let position:number = this.mSelectedPosition;
            if (position < 0) {
                position = this.mResurrectToPosition;
            }
            position = Math.max(0, position);
            position = Math.min(position, this.mItemCount - 1);
            return position;
        }

        /**
         * Find the row closest to y. This row will be used as the motion row when scrolling
         *
         * @param y Where the user touched
         * @return The position of the first (or only) item in the row containing y
         */
        abstract findMotionRow(y:number):number ;

        /**
         * Find the row closest to y. This row will be used as the motion row when scrolling.
         *
         * @param y Where the user touched
         * @return The position of the first (or only) item in the row closest to y
         */
        private findClosestMotionRow(y:number):number {
            const childCount:number = this.getChildCount();
            if (childCount == 0) {
                return AbsListView.INVALID_POSITION;
            }
            const motionRow:number = this.findMotionRow(y);
            return motionRow != AbsListView.INVALID_POSITION ? motionRow : this.mFirstPosition + childCount - 1;
        }

        /**
         * Causes all the views to be rebuilt and redrawn.
         */
        invalidateViews():void {
            this.mDataChanged = true;
            this.rememberSyncState();
            this.requestLayout();
            this.invalidate();
        }

        /**
         * If there is a selection returns false.
         * Otherwise resurrects the selection and returns true if resurrected.
         */
        resurrectSelectionIfNeeded():boolean {
            if (this.mSelectedPosition < 0 && this.resurrectSelection()) {
                this.updateSelectorState();
                return true;
            }
            return false;
        }

        /**
         * Makes the item at the supplied position selected.
         *
         * @param position the position of the new selection
         */
        abstract setSelectionInt(position:number):void ;

        /**
         * Attempt to bring the selection back if the user is switching from touch
         * to trackball mode
         * @return Whether selection was set to something.
         */
        private resurrectSelection():boolean {
            const childCount:number = this.getChildCount();
            if (childCount <= 0) {
                return false;
            }
            let selectedTop:number = 0;
            let selectedPos:number;
            let childrenTop:number = this.mListPadding.top;
            let childrenBottom:number = this.mBottom - this.mTop - this.mListPadding.bottom;
            const firstPosition:number = this.mFirstPosition;
            const toPosition:number = this.mResurrectToPosition;
            let down:boolean = true;
            if (toPosition >= firstPosition && toPosition < firstPosition + childCount) {
                selectedPos = toPosition;
                const selected:View = this.getChildAt(selectedPos - this.mFirstPosition);
                selectedTop = selected.getTop();
                let selectedBottom:number = selected.getBottom();
                // We are scrolled, don't get in the fade
                if (selectedTop < childrenTop) {
                    selectedTop = childrenTop + this.getVerticalFadingEdgeLength();
                } else if (selectedBottom > childrenBottom) {
                    selectedTop = childrenBottom - selected.getMeasuredHeight() - this.getVerticalFadingEdgeLength();
                }
            } else {
                if (toPosition < firstPosition) {
                    // Default to selecting whatever is first
                    selectedPos = firstPosition;
                    for (let i:number = 0; i < childCount; i++) {
                        const v:View = this.getChildAt(i);
                        const top:number = v.getTop();
                        if (i == 0) {
                            // Remember the position of the first item
                            selectedTop = top;
                            // See if we are scrolled at all
                            if (firstPosition > 0 || top < childrenTop) {
                                // If we are scrolled, don't select anything that is
                                // in the fade region
                                childrenTop += this.getVerticalFadingEdgeLength();
                            }
                        }
                        if (top >= childrenTop) {
                            // Found a view whose top is fully visisble
                            selectedPos = firstPosition + i;
                            selectedTop = top;
                            break;
                        }
                    }
                } else {
                    const itemCount:number = this.mItemCount;
                    down = false;
                    selectedPos = firstPosition + childCount - 1;
                    for (let i:number = childCount - 1; i >= 0; i--) {
                        const v:View = this.getChildAt(i);
                        const top:number = v.getTop();
                        const bottom:number = v.getBottom();
                        if (i == childCount - 1) {
                            selectedTop = top;
                            if (firstPosition + childCount < itemCount || bottom > childrenBottom) {
                                childrenBottom -= this.getVerticalFadingEdgeLength();
                            }
                        }
                        if (bottom <= childrenBottom) {
                            selectedPos = firstPosition + i;
                            selectedTop = top;
                            break;
                        }
                    }
                }
            }
            this.mResurrectToPosition = AbsListView.INVALID_POSITION;
            this.removeCallbacks(this.mFlingRunnable);
            if (this.mPositionScroller != null) {
                this.mPositionScroller.stop();
            }
            this.mTouchMode = AbsListView.TOUCH_MODE_REST;
            this.clearScrollingCache();
            this.mSpecificTop = selectedTop;
            selectedPos = this.lookForSelectablePosition(selectedPos, down);
            if (selectedPos >= firstPosition && selectedPos <= this.getLastVisiblePosition()) {
                this.mLayoutMode = AbsListView.LAYOUT_SPECIFIC;
                this.updateSelectorState();
                this.setSelectionInt(selectedPos);
                this.invokeOnItemScrollListener();
            } else {
                selectedPos = AbsListView.INVALID_POSITION;
            }
            this.reportScrollStateChange(AbsListView.OnScrollListener.SCROLL_STATE_IDLE);
            return selectedPos >= 0;
        }

        private confirmCheckedPositionsById():void {
            // Clear out the positional check states, we'll rebuild it below from IDs.
            this.mCheckStates.clear();
            let checkedCountChanged:boolean = false;
            for (let checkedIndex:number = 0; checkedIndex < this.mCheckedIdStates.size(); checkedIndex++) {
                const id:number = this.mCheckedIdStates.keyAt(checkedIndex);
                const lastPos:number = this.mCheckedIdStates.valueAt(checkedIndex);
                const lastPosId:number = this.mAdapter.getItemId(lastPos);
                if (id != lastPosId) {
                    // Look around to see if the ID is nearby. If not, uncheck it.
                    const start:number = Math.max(0, lastPos - AbsListView.CHECK_POSITION_SEARCH_DISTANCE);
                    const end:number = Math.min(lastPos + AbsListView.CHECK_POSITION_SEARCH_DISTANCE, this.mItemCount);
                    let found:boolean = false;
                    for (let searchPos:number = start; searchPos < end; searchPos++) {
                        const searchId:number = this.mAdapter.getItemId(searchPos);
                        if (id == searchId) {
                            found = true;
                            this.mCheckStates.put(searchPos, true);
                            this.mCheckedIdStates.setValueAt(checkedIndex, searchPos);
                            break;
                        }
                    }
                    if (!found) {
                        this.mCheckedIdStates.delete(id);
                        checkedIndex--;
                        this.mCheckedItemCount--;
                        checkedCountChanged = true;
                        //if (this.mChoiceActionMode != null && this.mMultiChoiceModeCallback != null) {
                        //    this.mMultiChoiceModeCallback.onItemCheckedStateChanged(this.mChoiceActionMode, lastPos, id, false);
                        //}
                    }
                } else {
                    this.mCheckStates.put(lastPos, true);
                }
            }
            if (checkedCountChanged && this.mChoiceActionMode != null) {
                this.mChoiceActionMode.invalidate();
            }
        }

        handleDataChanged():void {
            let count:number = this.mItemCount;
            let lastHandledItemCount:number = this.mLastHandledItemCount;
            this.mLastHandledItemCount = this.mItemCount;
            if (this.mChoiceMode != AbsListView.CHOICE_MODE_NONE && this.mAdapter != null && this.mAdapter.hasStableIds()) {
                this.confirmCheckedPositionsById();
            }
            // TODO: In the future we can recycle these views based on stable ID instead.
            this.mRecycler.clearTransientStateViews();
            if (count > 0) {
                let newPos:number;
                let selectablePos:number;
                // Find the row we are supposed to sync to
                if (this.mNeedSync) {
                    // Update this first, since setNextSelectedPositionInt inspects it
                    this.mNeedSync = false;
                    this.mPendingSync = null;
                    if (this.mTranscriptMode == AbsListView.TRANSCRIPT_MODE_ALWAYS_SCROLL) {
                        this.mLayoutMode = AbsListView.LAYOUT_FORCE_BOTTOM;
                        return;
                    } else if (this.mTranscriptMode == AbsListView.TRANSCRIPT_MODE_NORMAL) {
                        if (this.mForceTranscriptScroll) {
                            this.mForceTranscriptScroll = false;
                            this.mLayoutMode = AbsListView.LAYOUT_FORCE_BOTTOM;
                            return;
                        }
                        const childCount:number = this.getChildCount();
                        const listBottom:number = this.getHeight() - this.getPaddingBottom();
                        const lastChild:View = this.getChildAt(childCount - 1);
                        const lastBottom:number = lastChild != null ? lastChild.getBottom() : listBottom;
                        if (this.mFirstPosition + childCount >= lastHandledItemCount && lastBottom <= listBottom) {
                            this.mLayoutMode = AbsListView.LAYOUT_FORCE_BOTTOM;
                            return;
                        }
                        // Something new came in and we didn't scroll; give the user a clue that
                        // there's something new.
                        this.awakenScrollBars();
                    }
                    switch (this.mSyncMode) {
                        case AbsListView.SYNC_SELECTED_POSITION:
                            if (this.isInTouchMode()) {
                                // We saved our state when not in touch mode. (We know this because
                                // mSyncMode is SYNC_SELECTED_POSITION.) Now we are trying to
                                // restore in touch mode. Just leave mSyncPosition as it is (possibly
                                // adjusting if the available range changed) and return.
                                this.mLayoutMode = AbsListView.LAYOUT_SYNC;
                                this.mSyncPosition = Math.min(Math.max(0, this.mSyncPosition), count - 1);
                                return;
                            } else {
                                // See if we can find a position in the new data with the same
                                // id as the old selection. This will change mSyncPosition.
                                newPos = this.findSyncPosition();
                                if (newPos >= 0) {
                                    // Found it. Now verify that new selection is still selectable
                                    selectablePos = this.lookForSelectablePosition(newPos, true);
                                    if (selectablePos == newPos) {
                                        // Same row id is selected
                                        this.mSyncPosition = newPos;
                                        if (this.mSyncHeight == this.getHeight()) {
                                            // If we are at the same height as when we saved state, try
                                            // to restore the scroll position too.
                                            this.mLayoutMode = AbsListView.LAYOUT_SYNC;
                                        } else {
                                            // We are not the same height as when the selection was saved, so
                                            // don't try to restore the exact position
                                            this.mLayoutMode = AbsListView.LAYOUT_SET_SELECTION;
                                        }
                                        // Restore selection
                                        this.setNextSelectedPositionInt(newPos);
                                        return;
                                    }
                                }
                            }
                            break;
                        case AbsListView.SYNC_FIRST_POSITION:
                            // Leave mSyncPosition as it is -- just pin to available range
                            this.mLayoutMode = AbsListView.LAYOUT_SYNC;
                            this.mSyncPosition = Math.min(Math.max(0, this.mSyncPosition), count - 1);
                            return;
                    }
                }
                if (!this.isInTouchMode()) {
                    // We couldn't find matching data -- try to use the same position
                    newPos = this.getSelectedItemPosition();
                    // Pin position to the available range
                    if (newPos >= count) {
                        newPos = count - 1;
                    }
                    if (newPos < 0) {
                        newPos = 0;
                    }
                    // Make sure we select something selectable -- first look down
                    selectablePos = this.lookForSelectablePosition(newPos, true);
                    if (selectablePos >= 0) {
                        this.setNextSelectedPositionInt(selectablePos);
                        return;
                    } else {
                        // Looking down didn't work -- try looking up
                        selectablePos = this.lookForSelectablePosition(newPos, false);
                        if (selectablePos >= 0) {
                            this.setNextSelectedPositionInt(selectablePos);
                            return;
                        }
                    }
                } else {
                    // We already know where we want to resurrect the selection
                    if (this.mResurrectToPosition >= 0) {
                        return;
                    }
                }
            }
            // Nothing is selected. Give up and reset everything.
            this.mLayoutMode = this.mStackFromBottom ? AbsListView.LAYOUT_FORCE_BOTTOM : AbsListView.LAYOUT_FORCE_TOP;
            this.mSelectedPosition = AbsListView.INVALID_POSITION;
            this.mSelectedRowId = AbsListView.INVALID_ROW_ID;
            this.mNextSelectedPosition = AbsListView.INVALID_POSITION;
            this.mNextSelectedRowId = AbsListView.INVALID_ROW_ID;
            this.mNeedSync = false;
            this.mPendingSync = null;
            this.mSelectorPosition = AbsListView.INVALID_POSITION;
            this.checkSelectionChanged();
        }

        onDisplayHint(hint:number):void {
            super.onDisplayHint(hint);
            //switch (hint) {
            //    case AbsListView.INVISIBLE:
            //        if (this.mPopup != null && this.mPopup.isShowing()) {
            //            this.dismissPopup();
            //        }
            //        break;
            //    case AbsListView.VISIBLE:
            //        if (this.mFiltered && this.mPopup != null && !this.mPopup.isShowing()) {
            //            this.showPopup();
            //        }
            //        break;
            //}
            this.mPopupHidden = hint == AbsListView.INVISIBLE;
        }

        /**
         * Removes the filter window
         */
        private dismissPopup():void {
            //if (this.mPopup != null) {
            //    this.mPopup.dismiss();
            //}
        }

        /**
         * Shows the filter window
         */
        private showPopup():void {
            // Make sure we have a window before showing the popup
            //if (this.getWindowVisibility() == View.VISIBLE) {
            //    this.createTextFilter(true);
            //    this.positionPopup();
            //    // Make sure we get focus if we are showing the popup
            //    this.checkFocus();
            //}
        }

        private positionPopup():void {
            //let screenHeight:number = Resources.getDisplayMetrics().heightPixels;
            //const xy:number[] = [2];
            //this.getLocationOnScreen(xy);
            //// TODO: The 20 below should come from the theme
            //// TODO: And the gravity should be defined in the theme as well
            //const bottomGap:number = screenHeight - xy[1] - this.getHeight() + Math.floor((this.mDensityScale * 20));
            //if (!this.mPopup.isShowing()) {
            //    this.mPopup.showAtLocation(this, Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL, xy[0], bottomGap);
            //} else {
            //    this.mPopup.update(xy[0], bottomGap, -1, -1);
            //}
        }

        /**
         * What is the distance between the source and destination rectangles given the direction of
         * focus navigation between them? The direction basically helps figure out more quickly what is
         * self evident by the relationship between the rects...
         *
         * @param source the source rectangle
         * @param dest the destination rectangle
         * @param direction the direction
         * @return the distance between the rectangles
         */
        static getDistance(source:Rect, dest:Rect, direction:number):number {
            // source x, y
            let sX:number, sY:number;
            // dest x, y
            let dX:number, dY:number;
            switch (direction) {
                case View.FOCUS_RIGHT:
                    sX = source.right;
                    sY = source.top + source.height() / 2;
                    dX = dest.left;
                    dY = dest.top + dest.height() / 2;
                    break;
                case View.FOCUS_DOWN:
                    sX = source.left + source.width() / 2;
                    sY = source.bottom;
                    dX = dest.left + dest.width() / 2;
                    dY = dest.top;
                    break;
                case View.FOCUS_LEFT:
                    sX = source.left;
                    sY = source.top + source.height() / 2;
                    dX = dest.right;
                    dY = dest.top + dest.height() / 2;
                    break;
                case View.FOCUS_UP:
                    sX = source.left + source.width() / 2;
                    sY = source.top;
                    dX = dest.left + dest.width() / 2;
                    dY = dest.bottom;
                    break;
                case View.FOCUS_FORWARD:
                case View.FOCUS_BACKWARD:
                    sX = source.right + source.width() / 2;
                    sY = source.top + source.height() / 2;
                    dX = dest.left + dest.width() / 2;
                    dY = dest.top + dest.height() / 2;
                    break;
                default:
                    throw Error(`new IllegalArgumentException("direction must be one of " + "{FOCUS_UP, FOCUS_DOWN, FOCUS_LEFT, FOCUS_RIGHT, " + "FOCUS_FORWARD, FOCUS_BACKWARD}.")`);
            }
            let deltaX:number = dX - sX;
            let deltaY:number = dY - sY;
            return deltaY * deltaY + deltaX * deltaX;
        }

        isInFilterMode():boolean {
            return this.mFiltered;
        }

        /**
         * Sends a key to the text filter window
         *
         * @param keyCode The keycode for the event
         * @param event The actual key event
         *
         * @return True if the text filter handled the event, false otherwise.
         */
        //private sendToTextFilter(keyCode:number, count:number, event:KeyEvent):boolean {
        //    if (!this.acceptFilter()) {
        //        return false;
        //    }
        //    let handled:boolean = false;
        //    let okToSend:boolean = true;
        //    switch (keyCode) {
        //        case KeyEvent.KEYCODE_DPAD_UP:
        //        case KeyEvent.KEYCODE_DPAD_DOWN:
        //        case KeyEvent.KEYCODE_DPAD_LEFT:
        //        case KeyEvent.KEYCODE_DPAD_RIGHT:
        //        case KeyEvent.KEYCODE_DPAD_CENTER:
        //        case KeyEvent.KEYCODE_ENTER:
        //            okToSend = false;
        //            break;
        //        case KeyEvent.KEYCODE_BACK:
        //            if (this.mFiltered && this.mPopup != null && this.mPopup.isShowing()) {
        //                if (event.getAction() == KeyEvent.ACTION_DOWN && event.getRepeatCount() == 0) {
        //                    let state:KeyEvent.DispatcherState = this.getKeyDispatcherState();
        //                    if (state != null) {
        //                        state.startTracking(event, this);
        //                    }
        //                    handled = true;
        //                } else if (event.getAction() == KeyEvent.ACTION_UP && event.isTracking() && !event.isCanceled()) {
        //                    handled = true;
        //                    this.mTextFilter.setText("");
        //                }
        //            }
        //            okToSend = false;
        //            break;
        //        case KeyEvent.KEYCODE_SPACE:
        //            // Only send spaces once we are filtered
        //            okToSend = this.mFiltered;
        //            break;
        //    }
        //    if (okToSend) {
        //        this.createTextFilter(true);
        //        let forwardEvent:KeyEvent = event;
        //        if (forwardEvent.getRepeatCount() > 0) {
        //            forwardEvent = KeyEvent.changeTimeRepeat(event, event.getEventTime(), 0);
        //        }
        //        let action:number = event.getAction();
        //        switch (action) {
        //            case KeyEvent.ACTION_DOWN:
        //                handled = this.mTextFilter.onKeyDown(keyCode, forwardEvent);
        //                break;
        //            case KeyEvent.ACTION_UP:
        //                handled = this.mTextFilter.onKeyUp(keyCode, forwardEvent);
        //                break;
        //            case KeyEvent.ACTION_MULTIPLE:
        //                handled = this.mTextFilter.onKeyMultiple(keyCode, count, event);
        //                break;
        //        }
        //    }
        //    return handled;
        //}
        //
        ///**
        // * Return an InputConnection for editing of the filter text.
        // */
        //onCreateInputConnection(outAttrs:EditorInfo):InputConnection {
        //    if (this.isTextFilterEnabled()) {
        //        if (this.mPublicInputConnection == null) {
        //            this.mDefInputConnection = new BaseInputConnection(this, false);
        //            this.mPublicInputConnection = new AbsListView.InputConnectionWrapper(outAttrs);
        //        }
        //        outAttrs.inputType = EditorInfo.TYPE_CLASS_TEXT | EditorInfo.TYPE_TEXT_VARIATION_FILTER;
        //        outAttrs.imeOptions = EditorInfo.IME_ACTION_DONE;
        //        return this.mPublicInputConnection;
        //    }
        //    return null;
        //}
        //
        //
        ///**
        // * For filtering we proxy an input connection to an internal text editor,
        // * and this allows the proxying to happen.
        // */
        //checkInputConnectionProxy(view:View):boolean {
        //    return view == this.mTextFilter;
        //}
        //
        ///**
        // * Creates the window for the text filter and populates it with an EditText field;
        // *
        // * @param animateEntrance true if the window should appear with an animation
        // */
        //private createTextFilter(animateEntrance:boolean):void {
        //    if (this.mPopup == null) {
        //        let p:PopupWindow = new PopupWindow(this.getContext());
        //        p.setFocusable(false);
        //        p.setTouchable(false);
        //        p.setInputMethodMode(PopupWindow.INPUT_METHOD_NOT_NEEDED);
        //        p.setContentView(this.getTextFilterInput());
        //        p.setWidth(LayoutParams.WRAP_CONTENT);
        //        p.setHeight(LayoutParams.WRAP_CONTENT);
        //        p.setBackgroundDrawable(null);
        //        this.mPopup = p;
        //        this.getViewTreeObserver().addOnGlobalLayoutListener(this);
        //        this.mGlobalLayoutListenerAddedFilter = true;
        //    }
        //    if (animateEntrance) {
        //        this.mPopup.setAnimationStyle(com.android.internal.R.style.Animation_TypingFilter);
        //    } else {
        //        this.mPopup.setAnimationStyle(com.android.internal.R.style.Animation_TypingFilterRestore);
        //    }
        //}
        //
        //private getTextFilterInput():EditText {
        //    if (this.mTextFilter == null) {
        //        const layoutInflater:LayoutInflater = LayoutInflater.from(this.getContext());
        //        this.mTextFilter = <EditText> layoutInflater.inflate(com.android.internal.R.layout.typing_filter, null);
        //        // For some reason setting this as the "real" input type changes
        //        // the text view in some way that it doesn't work, and I don't
        //        // want to figure out why this is.
        //        this.mTextFilter.setRawInputType(EditorInfo.TYPE_CLASS_TEXT | EditorInfo.TYPE_TEXT_VARIATION_FILTER);
        //        this.mTextFilter.setImeOptions(EditorInfo.IME_FLAG_NO_EXTRACT_UI);
        //        this.mTextFilter.addTextChangedListener(this);
        //    }
        //    return this.mTextFilter;
        //}
        //
        ///**
        // * Clear the text filter.
        // */
        //clearTextFilter():void {
        //    if (this.mFiltered) {
        //        this.getTextFilterInput().setText("");
        //        this.mFiltered = false;
        //        if (this.mPopup != null && this.mPopup.isShowing()) {
        //            this.dismissPopup();
        //        }
        //    }
        //}
        //
        /**
         * Returns if the ListView currently has a text filter.
         */
        hasTextFilter():boolean {
            return this.mFiltered;
        }

        onGlobalLayout():void {
            if (this.isShown()) {
                // Show the popup if we are filtered
                //if (this.mFiltered && this.mPopup != null && !this.mPopup.isShowing() && !this.mPopupHidden) {
                //    this.showPopup();
                //}
            } else {
                // Hide the popup when we are no longer visible
                //if (this.mPopup != null && this.mPopup.isShowing()) {
                //    this.dismissPopup();
                //}
            }
        }
        //
        ///**
        // * For our text watcher that is associated with the text filter.  Does
        // * nothing.
        // */
        //beforeTextChanged(s:string, start:number, count:number, after:number):void {
        //}
        //
        ///**
        // * For our text watcher that is associated with the text filter. Performs
        // * the actual filtering as the text changes, and takes care of hiding and
        // * showing the popup displaying the currently entered filter text.
        // */
        //onTextChanged(s:string, start:number, before:number, count:number):void {
        //    if (this.isTextFilterEnabled()) {
        //        this.createTextFilter(true);
        //        let length:number = s.length();
        //        let showing:boolean = this.mPopup.isShowing();
        //        if (!showing && length > 0) {
        //            // Show the filter popup if necessary
        //            this.showPopup();
        //            this.mFiltered = true;
        //        } else if (showing && length == 0) {
        //            // Remove the filter popup if the user has cleared all text
        //            this.dismissPopup();
        //            this.mFiltered = false;
        //        }
        //        if (this.mAdapter instanceof Filterable) {
        //            let f:Filter = (<Filterable> this.mAdapter).getFilter();
        //            // Filter should not be null when we reach this part
        //            if (f != null) {
        //                f.filter(s, this);
        //            } else {
        //                throw Error(`new IllegalStateException("You cannot call onTextChanged with a non " + "filterable adapter")`);
        //            }
        //        }
        //    }
        //}
        //
        ///**
        // * For our text watcher that is associated with the text filter.  Does
        // * nothing.
        // */
        //afterTextChanged(s):void {
        //}
        //
        //onFilterComplete(count:number):void {
        //    if (mSelectedPosition < 0 && count > 0) {
        //        this.mResurrectToPosition = AbsListView.INVALID_POSITION;
        //        this.resurrectSelection();
        //    }
        //}

        protected generateDefaultLayoutParams():ViewGroup.LayoutParams {
            return new AbsListView.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT, 0);
        }

        protected generateLayoutParams(p:ViewGroup.LayoutParams):ViewGroup.LayoutParams {
            return new AbsListView.LayoutParams(p);
        }

        generateLayoutParamsFromAttr(attrs:HTMLElement):ViewGroup.LayoutParams {
           return new AbsListView.LayoutParams(this.getContext(), attrs);
        }

        protected checkLayoutParams(p:ViewGroup.LayoutParams):boolean {
            return p instanceof AbsListView.LayoutParams;
        }

        /**
         * Puts the list or grid into transcript mode. In this mode the list or grid will always scroll
         * to the bottom to show new items.
         *
         * @param mode the transcript mode to set
         *
         * @see #TRANSCRIPT_MODE_DISABLED
         * @see #TRANSCRIPT_MODE_NORMAL
         * @see #TRANSCRIPT_MODE_ALWAYS_SCROLL
         */
        setTranscriptMode(mode:number):void {
            this.mTranscriptMode = mode;
        }

        /**
         * Returns the current transcript mode.
         *
         * @return {@link #TRANSCRIPT_MODE_DISABLED}, {@link #TRANSCRIPT_MODE_NORMAL} or
         *         {@link #TRANSCRIPT_MODE_ALWAYS_SCROLL}
         */
        getTranscriptMode():number {
            return this.mTranscriptMode;
        }

        getSolidColor():number {
            return this.mCacheColorHint;
        }

        /**
         * When set to a non-zero value, the cache color hint indicates that this list is always drawn
         * on top of a solid, single-color, opaque background.
         *
         * Zero means that what's behind this object is translucent (non solid) or is not made of a
         * single color. This hint will not affect any existing background drawable set on this view (
         * typically set via {@link #setBackgroundDrawable(Drawable)}).
         *
         * @param color The background color
         */
        setCacheColorHint(color:number):void {
            if (color != this.mCacheColorHint) {
                this.mCacheColorHint = color;
                let count:number = this.getChildCount();
                for (let i:number = 0; i < count; i++) {
                    this.getChildAt(i).setDrawingCacheBackgroundColor(color);
                }
                this.mRecycler.setCacheColorHint(color);
            }
        }

        /**
         * When set to a non-zero value, the cache color hint indicates that this list is always drawn
         * on top of a solid, single-color, opaque background
         *
         * @return The cache color hint
         */
        getCacheColorHint():number {
            return this.mCacheColorHint;
        }

        /**
         * Move all views (excluding headers and footers) held by this AbsListView into the supplied
         * List. This includes views displayed on the screen as well as views stored in AbsListView's
         * internal view recycler.
         *
         * @param views A list into which to put the reclaimed views
         */
        reclaimViews(views:List<View>):void {
            let childCount:number = this.getChildCount();
            let listener:AbsListView.RecyclerListener = this.mRecycler.mRecyclerListener;
            // Reclaim views on screen
            for (let i:number = 0; i < childCount; i++) {
                let child:View = this.getChildAt(i);
                let lp:AbsListView.LayoutParams = <AbsListView.LayoutParams> child.getLayoutParams();
                // Don't reclaim header or footer views, or views that should be ignored
                if (lp != null && this.mRecycler.shouldRecycleViewType(lp.viewType)) {
                    views.add(child);
                    //child.setAccessibilityDelegate(null);
                    if (listener != null) {
                        // Pretend they went through the scrap heap
                        listener.onMovedToScrapHeap(child);
                    }
                }
            }
            this.mRecycler.reclaimScrapViews(views);
            this.removeAllViewsInLayout();
        }

        private finishGlows():void {
            //if (this.mEdgeGlowTop != null) {
            //    this.mEdgeGlowTop.finish();
            //    this.mEdgeGlowBottom.finish();
            //}
        }

        ///**
        // * Sets up this AbsListView to use a remote views adapter which connects to a RemoteViewsService
        // * through the specified intent.
        // * @param intent the intent used to identify the RemoteViewsService for the adapter to connect to.
        // */
        //setRemoteViewsAdapter(intent:Intent):void {
        //    // service handling the specified intent.
        //    if (this.mRemoteAdapter != null) {
        //        let fcNew:Intent.FilterComparison = new Intent.FilterComparison(intent);
        //        let fcOld:Intent.FilterComparison = new Intent.FilterComparison(this.mRemoteAdapter.getRemoteViewsServiceIntent());
        //        if (fcNew.equals(fcOld)) {
        //            return;
        //        }
        //    }
        //    this.mDeferNotifyDataSetChanged = false;
        //    // Otherwise, create a new RemoteViewsAdapter for binding
        //    this.mRemoteAdapter = new RemoteViewsAdapter(this.getContext(), intent, this);
        //    if (this.mRemoteAdapter.isDataReady()) {
        //        this.setAdapter(this.mRemoteAdapter);
        //    }
        //}
        //
        ///**
        // * Sets up the onClickHandler to be used by the RemoteViewsAdapter when inflating RemoteViews
        // *
        // * @param handler The OnClickHandler to use when inflating RemoteViews.
        // *
        // * @hide
        // */
        //setRemoteViewsOnClickHandler(handler:OnClickHandler):void {
        //    // service handling the specified intent.
        //    if (this.mRemoteAdapter != null) {
        //        this.mRemoteAdapter.setRemoteViewsOnClickHandler(handler);
        //    }
        //}
        //
        ///**
        // * This defers a notifyDataSetChanged on the pending RemoteViewsAdapter if it has not
        // * connected yet.
        // */
        //deferNotifyDataSetChanged():void {
        //    this.mDeferNotifyDataSetChanged = true;
        //}
        //
        ///**
        // * Called back when the adapter connects to the RemoteViewsService.
        // */
        //onRemoteAdapterConnected():boolean {
        //    if (this.mRemoteAdapter != this.mAdapter) {
        //        this.setAdapter(this.mRemoteAdapter);
        //        if (this.mDeferNotifyDataSetChanged) {
        //            this.mRemoteAdapter.notifyDataSetChanged();
        //            this.mDeferNotifyDataSetChanged = false;
        //        }
        //        return false;
        //    } else if (this.mRemoteAdapter != null) {
        //        this.mRemoteAdapter.superNotifyDataSetChanged();
        //        return true;
        //    }
        //    return false;
        //}
        //
        ///**
        // * Called back when the adapter disconnects from the RemoteViewsService.
        // */
        //onRemoteAdapterDisconnected():void {
        //    // If the remote adapter disconnects, we keep it around
        //    // since the currently displayed items are still cached.
        //    // Further, we want the service to eventually reconnect
        //    // when necessary, as triggered by this view requesting
        //    // items from the Adapter.
        //}
        //
        ///**
        // * Hints the RemoteViewsAdapter, if it exists, about which views are currently
        // * being displayed by the AbsListView.
        // */
        setVisibleRangeHint(start:number, end:number):void {
            //if (this.mRemoteAdapter != null) {
            //    this.mRemoteAdapter.setVisibleRangeHint(start, end);
            //}
        }

        /**
         * Sets the recycler listener to be notified whenever a View is set aside in
         * the recycler for later reuse. This listener can be used to free resources
         * associated to the View.
         *
         * @param listener The recycler listener to be notified of views set aside
         *        in the recycler.
         *
         * @see android.widget.AbsListView.RecycleBin
         * @see android.widget.AbsListView.RecyclerListener
         */
        setRecyclerListener(listener:AbsListView.RecyclerListener):void {
            this.mRecycler.mRecyclerListener = listener;
        }


        static retrieveFromScrap(scrapViews:ArrayList<View>, position:number):View {
            let size:number = scrapViews.size();
            if (size > 0) {
                // See if we still have a view for this position.
                for (let i:number = 0; i < size; i++) {
                    let view:View = scrapViews.get(i);
                    if ((<AbsListView.LayoutParams> view.getLayoutParams()).scrappedFromPosition == position) {
                        scrapViews.remove(i);
                        return view;
                    }
                }
                return scrapViews.remove(size - 1);
            } else {
                return null;
            }
        }
    }

    export module AbsListView {
        /**
         * Interface definition for a callback to be invoked when the list or grid
         * has been scrolled.
         */
        export interface OnScrollListener {

            /**
             * Callback method to be invoked while the list view or grid view is being scrolled. If the
             * view is being scrolled, this method will be called before the next frame of the scroll is
             * rendered. In particular, it will be called before any calls to
             * {@link Adapter#getView(int, View, ViewGroup)}.
             *
             * @param view The view whose scroll state is being reported
             *
             * @param scrollState The current scroll state. One of {@link #SCROLL_STATE_IDLE},
             * {@link #SCROLL_STATE_TOUCH_SCROLL} or {@link #SCROLL_STATE_IDLE}.
             */
            onScrollStateChanged(view:AbsListView, scrollState:number):void ;

            /**
             * Callback method to be invoked when the list or grid has been scrolled. This will be
             * called after the scroll has completed
             * @param view The view whose scroll state is being reported
             * @param firstVisibleItem the index of the first visible cell (ignore if
             *        visibleItemCount == 0)
             * @param visibleItemCount the number of visible cells
             * @param totalItemCount the number of items in the list adaptor
             */
            onScroll(view:AbsListView, firstVisibleItem:number, visibleItemCount:number, totalItemCount:number):void ;
        }
        export module OnScrollListener {
            /**
             * The view is not scrolling. Note navigating the list using the trackball counts as
             * being in the idle state since these transitions are not animated.
             */
            export var SCROLL_STATE_IDLE:number = 0;

            /**
             * The user is scrolling using touch, and their finger is still on the screen
             */
            export var SCROLL_STATE_TOUCH_SCROLL:number = 1;

            /**
             * The user had previously been scrolling using touch and had performed a fling. The
             * animation is now coasting to a stop
             */
            export var SCROLL_STATE_FLING:number = 2;
        }
        /**
         * The top-level view of a list item can implement this interface to allow
         * itself to modify the bounds of the selection shown for that item.
         */
        export interface SelectionBoundsAdjuster {

            /**
             * Called to allow the list item to adjust the bounds shown for
             * its selection.
             *
             * @param bounds On call, this contains the bounds the list has
             * selected for the item (that is the bounds of the entire view).  The
             * values can be modified as desired.
             */
            adjustListItemSelectionBounds(bounds:Rect):void ;
        }
        /**
         * A base class for Runnables that will check that their view is still attached to
         * the original window as when the Runnable was created.
         *
         */
        export class WindowRunnnable {
            _AbsListView_this:AbsListView;

            constructor(arg:AbsListView) {
                this._AbsListView_this = arg;
            }

            private mOriginalAttachCount:number;

            rememberWindowAttachCount():void {
                this.mOriginalAttachCount = this._AbsListView_this.getWindowAttachCount();
            }

            sameWindow():boolean {
                return this._AbsListView_this.getWindowAttachCount() == this.mOriginalAttachCount;
            }
        }
        export class PerformClick extends AbsListView.WindowRunnnable implements Runnable {
            _AbsListView_this:AbsListView;

            constructor(arg:AbsListView) {
                super(arg);
                this._AbsListView_this = arg;
            }

            mClickMotionPosition:number = 0;

            run():void {
                // bail out before bad things happen
                if (this._AbsListView_this.mDataChanged)
                    return;
                const adapter:ListAdapter = this._AbsListView_this.mAdapter;
                const motionPosition:number = this.mClickMotionPosition;
                if (adapter != null && this._AbsListView_this.mItemCount > 0 && motionPosition != AbsListView.INVALID_POSITION
                    && motionPosition < adapter.getCount() && this.sameWindow()) {
                    const view:View = this._AbsListView_this.getChildAt(motionPosition - this._AbsListView_this.mFirstPosition);
                    // screen, etc.) and we should cancel the click
                    if (view != null) {
                        this._AbsListView_this.performItemClick(view, motionPosition, adapter.getItemId(motionPosition));
                    }
                }
            }
        }
        export class CheckForLongPress extends AbsListView.WindowRunnnable implements Runnable {
            _AbsListView_this:AbsListView;

            constructor(arg:AbsListView) {
                super(arg);
                this._AbsListView_this = arg;
            }

            run():void {
                const motionPosition:number = this._AbsListView_this.mMotionPosition;
                const child:View = this._AbsListView_this.getChildAt(motionPosition - this._AbsListView_this.mFirstPosition);
                if (child != null) {
                    const longPressPosition:number = this._AbsListView_this.mMotionPosition;
                    const longPressId:number = this._AbsListView_this.mAdapter.getItemId(this._AbsListView_this.mMotionPosition);
                    let handled:boolean = false;
                    if (this.sameWindow() && !this._AbsListView_this.mDataChanged) {
                        handled = this._AbsListView_this.performLongPress(child, longPressPosition, longPressId);
                    }
                    if (handled) {
                        this._AbsListView_this.mTouchMode = AbsListView.TOUCH_MODE_REST;
                        this._AbsListView_this.setPressed(false);
                        child.setPressed(false);
                    } else {
                        this._AbsListView_this.mTouchMode = AbsListView.TOUCH_MODE_DONE_WAITING;
                    }
                }
            }
        }
        export class CheckForKeyLongPress extends AbsListView.WindowRunnnable implements Runnable {
            _AbsListView_this:AbsListView;

            constructor(arg:AbsListView) {
                super(arg);
                this._AbsListView_this = arg;
            }

            run():void {
                if (this._AbsListView_this.isPressed() && this._AbsListView_this.mSelectedPosition >= 0) {
                    let index:number = this._AbsListView_this.mSelectedPosition - this._AbsListView_this.mFirstPosition;
                    let v:View = this._AbsListView_this.getChildAt(index);
                    if (!this._AbsListView_this.mDataChanged) {
                        let handled:boolean = false;
                        if (this.sameWindow()) {
                            handled = this._AbsListView_this.performLongPress(v,
                                this._AbsListView_this.mSelectedPosition, this._AbsListView_this.mSelectedRowId);
                        }
                        if (handled) {
                            this._AbsListView_this.setPressed(false);
                            v.setPressed(false);
                        }
                    } else {
                        this._AbsListView_this.setPressed(false);
                        if (v != null)
                            v.setPressed(false);
                    }
                }
            }
        }
        export class CheckForTap implements Runnable {
            _AbsListView_this:AbsListView;

            constructor(arg:AbsListView) {
                this._AbsListView_this = arg;
            }

            run():void {
                if (this._AbsListView_this.mTouchMode == AbsListView.TOUCH_MODE_DOWN) {
                    this._AbsListView_this.mTouchMode = AbsListView.TOUCH_MODE_TAP;
                    const child:View = this._AbsListView_this.getChildAt(
                        this._AbsListView_this.mMotionPosition - this._AbsListView_this.mFirstPosition);
                    if (child != null && !child.hasFocusable()) {
                        this._AbsListView_this.mLayoutMode = AbsListView.LAYOUT_NORMAL;
                        if (!this._AbsListView_this.mDataChanged) {
                            child.setPressed(true);
                            this._AbsListView_this.setPressed(true);
                            this._AbsListView_this.layoutChildren();
                            this._AbsListView_this.positionSelector(this._AbsListView_this.mMotionPosition, child);
                            this._AbsListView_this.refreshDrawableState();
                            const longPressTimeout:number = ViewConfiguration.getLongPressTimeout();
                            const longClickable:boolean = this._AbsListView_this.isLongClickable();
                            if (this._AbsListView_this.mSelector != null) {
                                let d:Drawable = this._AbsListView_this.mSelector.getCurrent();
                                //TODO when transition drawable impl
                                //if (d != null && d instanceof TransitionDrawable) {
                                //    if (longClickable) {
                                //        (<TransitionDrawable> d).startTransition(longPressTimeout);
                                //    } else {
                                //        (<TransitionDrawable> d).resetTransition();
                                //    }
                                //}
                            }
                            if (longClickable) {
                                if (this._AbsListView_this.mPendingCheckForLongPress_List == null) {
                                    this._AbsListView_this.mPendingCheckForLongPress_List = new AbsListView.CheckForLongPress(this._AbsListView_this);
                                }
                                this._AbsListView_this.mPendingCheckForLongPress_List.rememberWindowAttachCount();
                                this._AbsListView_this.postDelayed(this._AbsListView_this.mPendingCheckForLongPress_List, longPressTimeout);
                            } else {
                                this._AbsListView_this.mTouchMode = AbsListView.TOUCH_MODE_DONE_WAITING;
                            }
                        } else {
                            this._AbsListView_this.mTouchMode = AbsListView.TOUCH_MODE_DONE_WAITING;
                        }
                    }
                }
            }
        }
        /**
         * Responsible for fling behavior. Use {@link #start(int)} to
         * initiate a fling. Each frame of the fling is handled in {@link #run()}.
         * A FlingRunnable will keep re-posting itself until the fling is done.
         *
         */
        export class FlingRunnable implements Runnable {
            _AbsListView_this:AbsListView;

            constructor(arg:AbsListView) {
                this._AbsListView_this = arg;
                this.mScroller = new OverScroller();
            }

            /**
             * Tracks the decay of a fling scroll
             */
            mScroller:OverScroller;

            /**
             * Y value reported by mScroller on the previous fling
             */
            private mLastFlingY:number = 0;

            private mCheckFlywheel:Runnable = (()=> {
                const inner_this = this;
                class _Inner implements Runnable {

                    run():void {
                        const activeId:number = inner_this._AbsListView_this.mActivePointerId;
                        const vt:VelocityTracker = inner_this._AbsListView_this.mVelocityTracker;
                        const scroller:OverScroller = inner_this.mScroller;
                        if (vt == null || activeId == AbsListView.INVALID_POINTER) {
                            return;
                        }
                        vt.computeCurrentVelocity(1000, inner_this._AbsListView_this.mMaximumVelocity);
                        const yvel:number = -vt.getYVelocity(activeId);
                        if (Math.abs(yvel) >= inner_this._AbsListView_this.mMinimumVelocity && scroller.isScrollingInDirection(0, yvel)) {
                            // Keep the fling alive a little longer
                            inner_this._AbsListView_this.postDelayed(inner_this, FlingRunnable.FLYWHEEL_TIMEOUT);
                        } else {
                            inner_this.endFling();
                            inner_this._AbsListView_this.mTouchMode = AbsListView.TOUCH_MODE_SCROLL;
                            inner_this._AbsListView_this.reportScrollStateChange(OnScrollListener.SCROLL_STATE_TOUCH_SCROLL);
                        }
                    }
                }
                return new _Inner();
            })();

            // milliseconds
            static FLYWHEEL_TIMEOUT:number = 40;

            start(initialVelocity:number):void {
                let initialY:number = initialVelocity < 0 ? Integer.MAX_VALUE : 0;
                this.mLastFlingY = initialY;
                this.mScroller.setInterpolator(null);
                this.mScroller.fling(0, initialY, 0, initialVelocity, 0, Integer.MAX_VALUE, 0, Integer.MAX_VALUE);
                this._AbsListView_this.mTouchMode = AbsListView.TOUCH_MODE_FLING;
                this._AbsListView_this.postOnAnimation(this);
                if (AbsListView.PROFILE_FLINGING) {
                    if (!this._AbsListView_this.mFlingProfilingStarted) {
                        //Debug.startMethodTracing("AbsListViewFling");
                        this._AbsListView_this.mFlingProfilingStarted = true;
                    }
                }
                //if (this._AbsListView_this.mFlingStrictSpan == null) {
                //    this._AbsListView_this.mFlingStrictSpan = StrictMode.enterCriticalSpan("AbsListView-fling");
                //}
            }

            startSpringback():void {
                if (this.mScroller.springBack(0, this._AbsListView_this.mScrollY, 0, 0, 0, 0)) {
                    this._AbsListView_this.mTouchMode = AbsListView.TOUCH_MODE_OVERFLING;
                    this._AbsListView_this.invalidate();
                    this._AbsListView_this.postOnAnimation(this);
                } else {
                    this._AbsListView_this.mTouchMode = AbsListView.TOUCH_MODE_REST;
                    this._AbsListView_this.reportScrollStateChange(OnScrollListener.SCROLL_STATE_IDLE);
                }
            }

            startOverfling(initialVelocity:number):void {
                this.mScroller.setInterpolator(null);

                let minY = Integer.MIN_VALUE, maxY = Integer.MAX_VALUE;
                if(this._AbsListView_this.mScrollY < 0) minY = 0;
                else if(this._AbsListView_this.mScrollY > 0) maxY = 0;

                this.mScroller.fling(0, this._AbsListView_this.mScrollY, 0, initialVelocity, 0, 0, minY, maxY, 0, this._AbsListView_this.getHeight());
                this._AbsListView_this.mTouchMode = AbsListView.TOUCH_MODE_OVERFLING;
                this._AbsListView_this.invalidate();
                this._AbsListView_this.postOnAnimation(this);
            }

            private edgeReached(delta:number):void {
                this.mScroller.notifyVerticalEdgeReached(this._AbsListView_this.mScrollY, 0, this._AbsListView_this.mOverflingDistance);
                const overscrollMode:number = this._AbsListView_this.getOverScrollMode();
                if (overscrollMode == AbsListView.OVER_SCROLL_ALWAYS || (overscrollMode == AbsListView.OVER_SCROLL_IF_CONTENT_SCROLLS && !this._AbsListView_this.contentFits())) {
                    this._AbsListView_this.mTouchMode = AbsListView.TOUCH_MODE_OVERFLING;
                    //const vel:number = Math.floor(this.mScroller.getCurrVelocity());
                    //if (delta > 0) {
                    //    this._AbsListView_this.mEdgeGlowTop.onAbsorb(vel);
                    //} else {
                    //    this._AbsListView_this.mEdgeGlowBottom.onAbsorb(vel);
                    //}
                } else {
                    this._AbsListView_this.mTouchMode = AbsListView.TOUCH_MODE_REST;
                    if (this._AbsListView_this.mPositionScroller != null) {
                        this._AbsListView_this.mPositionScroller.stop();
                    }
                }
                this._AbsListView_this.invalidate();
                this._AbsListView_this.postOnAnimation(this);
            }

            startScroll(distance:number, duration:number, linear:boolean):void {
                let initialY:number = distance < 0 ? Integer.MAX_VALUE : 0;
                this.mLastFlingY = initialY;
                this.mScroller.setInterpolator(linear ? AbsListView.sLinearInterpolator : null);
                this.mScroller.startScroll(0, initialY, 0, distance, duration);
                this._AbsListView_this.mTouchMode = AbsListView.TOUCH_MODE_FLING;
                this._AbsListView_this.postOnAnimation(this);
            }

            endFling():void {
                this._AbsListView_this.mTouchMode = AbsListView.TOUCH_MODE_REST;
                this._AbsListView_this.removeCallbacks(this);
                this._AbsListView_this.removeCallbacks(this.mCheckFlywheel);
                this._AbsListView_this.reportScrollStateChange(OnScrollListener.SCROLL_STATE_IDLE);
                this._AbsListView_this.clearScrollingCache();
                this.mScroller.abortAnimation();
                //if (this._AbsListView_this.mFlingStrictSpan != null) {
                //    this._AbsListView_this.mFlingStrictSpan.finish();
                //    this._AbsListView_this.mFlingStrictSpan = null;
                //}
            }

            flywheelTouch():void {
                this._AbsListView_this.postDelayed(this.mCheckFlywheel, FlingRunnable.FLYWHEEL_TIMEOUT);
            }

            run():void {
                switch (this._AbsListView_this.mTouchMode) {
                    default:
                        this.endFling();
                        return;
                    case AbsListView.TOUCH_MODE_SCROLL:
                        if (this.mScroller.isFinished()) {
                            return;
                        }
                    // Fall through
                    case AbsListView.TOUCH_MODE_FLING:
                    {
                        if (this._AbsListView_this.mDataChanged) {
                            this._AbsListView_this.layoutChildren();
                        }
                        if (this._AbsListView_this.mItemCount == 0 || this._AbsListView_this.getChildCount() == 0) {
                            this.endFling();
                            return;
                        }
                        const scroller:OverScroller = this.mScroller;
                        let more:boolean = scroller.computeScrollOffset();
                        const y:number = scroller.getCurrY();
                        // Flip sign to convert finger direction to list items direction
                        // (e.g. finger moving down means list is moving towards the top)
                        let delta:number = this.mLastFlingY - y;
                        // Pretend that each frame of a fling scroll is a touch scroll
                        if (delta > 0) {
                            // List is moving towards the top. Use first view as mMotionPosition
                            this._AbsListView_this.mMotionPosition = this._AbsListView_this.mFirstPosition;
                            const firstView:View = this._AbsListView_this.getChildAt(0);
                            this._AbsListView_this.mMotionViewOriginalTop = firstView.getTop();
                            // Don't fling more than 1 screen
                            delta = Math.min(this._AbsListView_this.getHeight() - this._AbsListView_this.mPaddingBottom - this._AbsListView_this.mPaddingTop - 1, delta);
                        } else {
                            // List is moving towards the bottom. Use last view as mMotionPosition
                            let offsetToLast:number = this._AbsListView_this.getChildCount() - 1;
                            this._AbsListView_this.mMotionPosition = this._AbsListView_this.mFirstPosition + offsetToLast;
                            const lastView:View = this._AbsListView_this.getChildAt(offsetToLast);
                            this._AbsListView_this.mMotionViewOriginalTop = lastView.getTop();
                            // Don't fling more than 1 screen
                            delta = Math.max(-(this._AbsListView_this.getHeight() - this._AbsListView_this.mPaddingBottom - this._AbsListView_this.mPaddingTop - 1), delta);
                        }
                        // Check to see if we have bumped into the scroll limit
                        let motionView:View = this._AbsListView_this.getChildAt(this._AbsListView_this.mMotionPosition - this._AbsListView_this.mFirstPosition);
                        let oldTop:number = 0;
                        if (motionView != null) {
                            oldTop = motionView.getTop();
                        }
                        // Don't stop just because delta is zero (it could have been rounded)
                        const atEdge:boolean = this._AbsListView_this.trackMotionScroll(delta, delta);
                        const atEnd:boolean = atEdge && (delta != 0);
                        if (atEnd) {
                            if (motionView != null) {
                                // Tweak the scroll for how far we overshot
                                let overshoot:number = -(delta - (motionView.getTop() - oldTop));
                                this._AbsListView_this.overScrollBy(0, overshoot, 0, this._AbsListView_this.mScrollY, 0, 0, 0, this._AbsListView_this.mOverflingDistance, false);
                            }
                            if (more) {
                                this.edgeReached(delta);
                            }
                            break;
                        }
                        if (more && !atEnd) {
                            if (atEdge)
                                this._AbsListView_this.invalidate();
                            this.mLastFlingY = y;
                            this._AbsListView_this.postOnAnimation(this);
                        } else {
                            this.endFling();
                            if (AbsListView.PROFILE_FLINGING) {
                                if (this._AbsListView_this.mFlingProfilingStarted) {
                                    //Debug.stopMethodTracing();
                                    this._AbsListView_this.mFlingProfilingStarted = false;
                                }
                                //if (this._AbsListView_this.mFlingStrictSpan != null) {
                                //    this._AbsListView_this.mFlingStrictSpan.finish();
                                //    this._AbsListView_this.mFlingStrictSpan = null;
                                //}
                            }
                        }
                        break;
                    }
                    case AbsListView.TOUCH_MODE_OVERFLING:
                    {
                        const scroller:OverScroller = this.mScroller;
                        if (scroller.computeScrollOffset()) {
                            const scrollY:number = this._AbsListView_this.mScrollY;
                            const currY:number = scroller.getCurrY();
                            let deltaY:number = currY - scrollY;

                            //fix android bug: check cross scroll here, not in overScrollBy, it always false.
                            const crossDown:boolean = scrollY <= 0 && currY > 0;
                            const crossUp:boolean = scrollY >= 0 && currY < 0;
                            if (crossDown || crossUp) {
                                let velocity:number = Math.floor(scroller.getCurrVelocity());
                                if (crossUp) velocity = -velocity;
                                // Don't flywheel from this; we're just continuing things.
                                scroller.abortAnimation();
                                this.start(velocity);
                                deltaY = -scrollY;
                            }


                            if (this._AbsListView_this.overScrollBy(0, deltaY, 0, scrollY, 0, 0, 0, this._AbsListView_this.mOverflingDistance, false)) {
                                //const crossDown:boolean = scrollY <= 0 && currY > 0;
                                //const crossUp:boolean = scrollY >= 0 && currY < 0;
                                //if (crossDown || crossUp) {
                                //    let velocity:number = Math.floor(scroller.getCurrVelocity());
                                //    if (crossUp)
                                //        velocity = -velocity;
                                //    // Don't flywheel from this; we're just continuing things.
                                //    scroller.abortAnimation();
                                //    this.start(velocity);
                                //} else {
                                    this.startSpringback();
                                //}
                            } else {
                                this._AbsListView_this.invalidate();
                                this._AbsListView_this.postOnAnimation(this);
                            }
                        } else {
                            this.endFling();
                        }
                        break;
                    }
                }
            }
        }
        export class PositionScroller implements Runnable {
            _AbsListView_this:AbsListView;

            constructor(arg:AbsListView) {
                this._AbsListView_this = arg;
                this.mExtraScroll = ViewConfiguration.get().getScaledFadingEdgeLength();
            }

            private static SCROLL_DURATION:number = 200;

            private static MOVE_DOWN_POS:number = 1;

            private static MOVE_UP_POS:number = 2;

            private static MOVE_DOWN_BOUND:number = 3;

            private static MOVE_UP_BOUND:number = 4;

            private static MOVE_OFFSET:number = 5;

            private mMode:number = 0;

            private mTargetPos:number = 0;

            private mBoundPos:number = 0;

            private mLastSeenPos:number = 0;

            private mScrollDuration:number = 0;

            private mExtraScroll:number = 0;

            private mOffsetFromTop:number = 0;

            start(position:number, boundPosition?:number):void{
                if(boundPosition==null) this._start_1(position);
                else this._start_2(position, boundPosition);
            }
            private _start_1(position:number):void {
                this.stop();
                if (this._AbsListView_this.mDataChanged) {
                    // Wait until we're back in a stable state to try this.
                    this._AbsListView_this.mPositionScrollAfterLayout = (()=> {
                        const inner_this = this;
                        class _Inner implements Runnable {

                            run():void {
                                inner_this.start(position);
                            }
                        }
                        return new _Inner();
                    })();
                    return;
                }
                const childCount:number = this._AbsListView_this.getChildCount();
                if (childCount == 0) {
                    // Can't scroll without children.
                    return;
                }
                const firstPos:number = this._AbsListView_this.mFirstPosition;
                const lastPos:number = firstPos + childCount - 1;
                let viewTravelCount:number;
                let clampedPosition:number = Math.max(0, Math.min(this._AbsListView_this.getCount() - 1, position));
                if (clampedPosition < firstPos) {
                    viewTravelCount = firstPos - clampedPosition + 1;
                    this.mMode = PositionScroller.MOVE_UP_POS;
                } else if (clampedPosition > lastPos) {
                    viewTravelCount = clampedPosition - lastPos + 1;
                    this.mMode = PositionScroller.MOVE_DOWN_POS;
                } else {
                    this.scrollToVisible(clampedPosition, AbsListView.INVALID_POSITION, PositionScroller.SCROLL_DURATION);
                    return;
                }
                if (viewTravelCount > 0) {
                    this.mScrollDuration = PositionScroller.SCROLL_DURATION / viewTravelCount;
                } else {
                    this.mScrollDuration = PositionScroller.SCROLL_DURATION;
                }
                this.mTargetPos = clampedPosition;
                this.mBoundPos = AbsListView.INVALID_POSITION;
                this.mLastSeenPos = AbsListView.INVALID_POSITION;
                this._AbsListView_this.postOnAnimation(this);
            }

            private _start_2(position:number, boundPosition:number):void {
                this.stop();
                if (boundPosition == AbsListView.INVALID_POSITION) {
                    this.start(position);
                    return;
                }
                if (this._AbsListView_this.mDataChanged) {
                    // Wait until we're back in a stable state to try this.
                    this._AbsListView_this.mPositionScrollAfterLayout = (()=> {
                        const inner_this = this;
                        class _Inner implements Runnable {

                            run():void {
                                inner_this.start(position, boundPosition);
                            }
                        }
                        return new _Inner();
                    })();
                    return;
                }
                const childCount:number = this._AbsListView_this.getChildCount();
                if (childCount == 0) {
                    // Can't scroll without children.
                    return;
                }
                const firstPos:number = this._AbsListView_this.mFirstPosition;
                const lastPos:number = firstPos + childCount - 1;
                let viewTravelCount:number;
                let clampedPosition:number = Math.max(0, Math.min(this._AbsListView_this.getCount() - 1, position));
                if (clampedPosition < firstPos) {
                    const boundPosFromLast:number = lastPos - boundPosition;
                    if (boundPosFromLast < 1) {
                        // Moving would shift our bound position off the screen. Abort.
                        return;
                    }
                    const posTravel:number = firstPos - clampedPosition + 1;
                    const boundTravel:number = boundPosFromLast - 1;
                    if (boundTravel < posTravel) {
                        viewTravelCount = boundTravel;
                        this.mMode = PositionScroller.MOVE_UP_BOUND;
                    } else {
                        viewTravelCount = posTravel;
                        this.mMode = PositionScroller.MOVE_UP_POS;
                    }
                } else if (clampedPosition > lastPos) {
                    const boundPosFromFirst:number = boundPosition - firstPos;
                    if (boundPosFromFirst < 1) {
                        // Moving would shift our bound position off the screen. Abort.
                        return;
                    }
                    const posTravel:number = clampedPosition - lastPos + 1;
                    const boundTravel:number = boundPosFromFirst - 1;
                    if (boundTravel < posTravel) {
                        viewTravelCount = boundTravel;
                        this.mMode = PositionScroller.MOVE_DOWN_BOUND;
                    } else {
                        viewTravelCount = posTravel;
                        this.mMode = PositionScroller.MOVE_DOWN_POS;
                    }
                } else {
                    this.scrollToVisible(clampedPosition, boundPosition, PositionScroller.SCROLL_DURATION);
                    return;
                }
                if (viewTravelCount > 0) {
                    this.mScrollDuration = PositionScroller.SCROLL_DURATION / viewTravelCount;
                } else {
                    this.mScrollDuration = PositionScroller.SCROLL_DURATION;
                }
                this.mTargetPos = clampedPosition;
                this.mBoundPos = boundPosition;
                this.mLastSeenPos = AbsListView.INVALID_POSITION;
                this._AbsListView_this.postOnAnimation(this);
            }

            startWithOffset(position:number, offset:number, duration:number = PositionScroller.SCROLL_DURATION):void {
                this.stop();
                if (this._AbsListView_this.mDataChanged) {
                    // Wait until we're back in a stable state to try this.
                    const postOffset:number = offset;
                    this._AbsListView_this.mPositionScrollAfterLayout = (()=> {
                        const inner_this = this;
                        class _Inner implements Runnable {

                            run():void {
                                inner_this.startWithOffset(position, postOffset, duration);
                            }
                        }
                        return new _Inner();
                    })();
                    return;
                }
                const childCount:number = this._AbsListView_this.getChildCount();
                if (childCount == 0) {
                    // Can't scroll without children.
                    return;
                }
                offset += this._AbsListView_this.getPaddingTop();
                this.mTargetPos = Math.max(0, Math.min(this._AbsListView_this.getCount() - 1, position));
                this.mOffsetFromTop = offset;
                this.mBoundPos = AbsListView.INVALID_POSITION;
                this.mLastSeenPos = AbsListView.INVALID_POSITION;
                this.mMode = PositionScroller.MOVE_OFFSET;
                const firstPos:number = this._AbsListView_this.mFirstPosition;
                const lastPos:number = firstPos + childCount - 1;
                let viewTravelCount:number;
                if (this.mTargetPos < firstPos) {
                    viewTravelCount = firstPos - this.mTargetPos;
                } else if (this.mTargetPos > lastPos) {
                    viewTravelCount = this.mTargetPos - lastPos;
                } else {
                    // On-screen, just scroll.
                    const targetTop:number = this._AbsListView_this.getChildAt(this.mTargetPos - firstPos).getTop();
                    this._AbsListView_this.smoothScrollBy(targetTop - offset, duration, true);
                    return;
                }
                // Estimate how many screens we should travel
                const screenTravelCount:number = <number> viewTravelCount / childCount;
                this.mScrollDuration = screenTravelCount < 1 ? duration : Math.floor((duration / screenTravelCount));
                this.mLastSeenPos = AbsListView.INVALID_POSITION;
                this._AbsListView_this.postOnAnimation(this);
            }

            /**
             * Scroll such that targetPos is in the visible padded region without scrolling
             * boundPos out of view. Assumes targetPos is onscreen.
             */
            private scrollToVisible(targetPos:number, boundPos:number, duration:number):void {
                const firstPos:number = this._AbsListView_this.mFirstPosition;
                const childCount:number = this._AbsListView_this.getChildCount();
                const lastPos:number = firstPos + childCount - 1;
                const paddedTop:number = this._AbsListView_this.mListPadding.top;
                const paddedBottom:number = this._AbsListView_this.getHeight() - this._AbsListView_this.mListPadding.bottom;
                if (targetPos < firstPos || targetPos > lastPos) {
                    Log.w(AbsListView.TAG_AbsListView, "scrollToVisible called with targetPos " + targetPos + " not visible [" + firstPos + ", " + lastPos + "]");
                }
                if (boundPos < firstPos || boundPos > lastPos) {
                    // boundPos doesn't matter, it's already offscreen.
                    boundPos = AbsListView.INVALID_POSITION;
                }
                const targetChild:View = this._AbsListView_this.getChildAt(targetPos - firstPos);
                const targetTop:number = targetChild.getTop();
                const targetBottom:number = targetChild.getBottom();
                let scrollBy:number = 0;
                if (targetBottom > paddedBottom) {
                    scrollBy = targetBottom - paddedBottom;
                }
                if (targetTop < paddedTop) {
                    scrollBy = targetTop - paddedTop;
                }
                if (scrollBy == 0) {
                    return;
                }
                if (boundPos >= 0) {
                    const boundChild:View = this._AbsListView_this.getChildAt(boundPos - firstPos);
                    const boundTop:number = boundChild.getTop();
                    const boundBottom:number = boundChild.getBottom();
                    const absScroll:number = Math.abs(scrollBy);
                    if (scrollBy < 0 && boundBottom + absScroll > paddedBottom) {
                        // Don't scroll the bound view off the bottom of the screen.
                        scrollBy = Math.max(0, boundBottom - paddedBottom);
                    } else if (scrollBy > 0 && boundTop - absScroll < paddedTop) {
                        // Don't scroll the bound view off the top of the screen.
                        scrollBy = Math.min(0, boundTop - paddedTop);
                    }
                }
                this._AbsListView_this.smoothScrollBy(scrollBy, duration);
            }

            stop():void {
                this._AbsListView_this.removeCallbacks(this);
            }

            run():void {
                const listHeight:number = this._AbsListView_this.getHeight();
                const firstPos:number = this._AbsListView_this.mFirstPosition;
                switch (this.mMode) {
                    case PositionScroller.MOVE_DOWN_POS:
                    {
                        const lastViewIndex:number = this._AbsListView_this.getChildCount() - 1;
                        const lastPos:number = firstPos + lastViewIndex;
                        if (lastViewIndex < 0) {
                            return;
                        }
                        if (lastPos == this.mLastSeenPos) {
                            // No new views, let things keep going.
                            this._AbsListView_this.postOnAnimation(this);
                            return;
                        }
                        const lastView:View = this._AbsListView_this.getChildAt(lastViewIndex);
                        const lastViewHeight:number = lastView.getHeight();
                        const lastViewTop:number = lastView.getTop();
                        const lastViewPixelsShowing:number = listHeight - lastViewTop;
                        const extraScroll:number = lastPos < this._AbsListView_this.mItemCount - 1 ? Math.max(this._AbsListView_this.mListPadding.bottom, this.mExtraScroll) : this._AbsListView_this.mListPadding.bottom;
                        const scrollBy:number = lastViewHeight - lastViewPixelsShowing + extraScroll;
                        this._AbsListView_this.smoothScrollBy(scrollBy, this.mScrollDuration, true);
                        this.mLastSeenPos = lastPos;
                        if (lastPos < this.mTargetPos) {
                            this._AbsListView_this.postOnAnimation(this);
                        }
                        break;
                    }
                    case PositionScroller.MOVE_DOWN_BOUND:
                    {
                        const nextViewIndex:number = 1;
                        const childCount:number = this._AbsListView_this.getChildCount();
                        if (firstPos == this.mBoundPos || childCount <= nextViewIndex || firstPos + childCount >= this._AbsListView_this.mItemCount) {
                            return;
                        }
                        const nextPos:number = firstPos + nextViewIndex;
                        if (nextPos == this.mLastSeenPos) {
                            // No new views, let things keep going.
                            this._AbsListView_this.postOnAnimation(this);
                            return;
                        }
                        const nextView:View = this._AbsListView_this.getChildAt(nextViewIndex);
                        const nextViewHeight:number = nextView.getHeight();
                        const nextViewTop:number = nextView.getTop();
                        const extraScroll:number = Math.max(this._AbsListView_this.mListPadding.bottom, this.mExtraScroll);
                        if (nextPos < this.mBoundPos) {
                            this._AbsListView_this.smoothScrollBy(Math.max(0, nextViewHeight + nextViewTop - extraScroll), this.mScrollDuration, true);
                            this.mLastSeenPos = nextPos;
                            this._AbsListView_this.postOnAnimation(this);
                        } else {
                            if (nextViewTop > extraScroll) {
                                this._AbsListView_this.smoothScrollBy(nextViewTop - extraScroll, this.mScrollDuration, true);
                            }
                        }
                        break;
                    }
                    case PositionScroller.MOVE_UP_POS:
                    {
                        if (firstPos == this.mLastSeenPos) {
                            // No new views, let things keep going.
                            this._AbsListView_this.postOnAnimation(this);
                            return;
                        }
                        const firstView:View = this._AbsListView_this.getChildAt(0);
                        if (firstView == null) {
                            return;
                        }
                        const firstViewTop:number = firstView.getTop();
                        const extraScroll:number = firstPos > 0 ? Math.max(this.mExtraScroll, this._AbsListView_this.mListPadding.top) : this._AbsListView_this.mListPadding.top;
                        this._AbsListView_this.smoothScrollBy(firstViewTop - extraScroll, this.mScrollDuration, true);
                        this.mLastSeenPos = firstPos;
                        if (firstPos > this.mTargetPos) {
                            this._AbsListView_this.postOnAnimation(this);
                        }
                        break;
                    }
                    case PositionScroller.MOVE_UP_BOUND:
                    {
                        const lastViewIndex:number = this._AbsListView_this.getChildCount() - 2;
                        if (lastViewIndex < 0) {
                            return;
                        }
                        const lastPos:number = firstPos + lastViewIndex;
                        if (lastPos == this.mLastSeenPos) {
                            // No new views, let things keep going.
                            this._AbsListView_this.postOnAnimation(this);
                            return;
                        }
                        const lastView:View = this._AbsListView_this.getChildAt(lastViewIndex);
                        const lastViewHeight:number = lastView.getHeight();
                        const lastViewTop:number = lastView.getTop();
                        const lastViewPixelsShowing:number = listHeight - lastViewTop;
                        const extraScroll:number = Math.max(this._AbsListView_this.mListPadding.top, this.mExtraScroll);
                        this.mLastSeenPos = lastPos;
                        if (lastPos > this.mBoundPos) {
                            this._AbsListView_this.smoothScrollBy(-(lastViewPixelsShowing - extraScroll), this.mScrollDuration, true);
                            this._AbsListView_this.postOnAnimation(this);
                        } else {
                            const bottom:number = listHeight - extraScroll;
                            const lastViewBottom:number = lastViewTop + lastViewHeight;
                            if (bottom > lastViewBottom) {
                                this._AbsListView_this.smoothScrollBy(-(bottom - lastViewBottom), this.mScrollDuration, true);
                            }
                        }
                        break;
                    }
                    case PositionScroller.MOVE_OFFSET:
                    {
                        if (this.mLastSeenPos == firstPos) {
                            // No new views, let things keep going.
                            this._AbsListView_this.postOnAnimation(this);
                            return;
                        }
                        this.mLastSeenPos = firstPos;
                        const childCount:number = this._AbsListView_this.getChildCount();
                        const position:number = this.mTargetPos;
                        const lastPos:number = firstPos + childCount - 1;
                        let viewTravelCount:number = 0;
                        if (position < firstPos) {
                            viewTravelCount = firstPos - position + 1;
                        } else if (position > lastPos) {
                            viewTravelCount = position - lastPos;
                        }
                        // Estimate how many screens we should travel
                        const screenTravelCount:number = <number> viewTravelCount / childCount;
                        const modifier:number = Math.min(Math.abs(screenTravelCount), 1.);
                        if (position < firstPos) {
                            const distance:number = Math.floor((-this._AbsListView_this.getHeight() * modifier));
                            const duration:number = Math.floor((this.mScrollDuration * modifier));
                            this._AbsListView_this.smoothScrollBy(distance, duration, true);
                            this._AbsListView_this.postOnAnimation(this);
                        } else if (position > lastPos) {
                            const distance:number = Math.floor((this._AbsListView_this.getHeight() * modifier));
                            const duration:number = Math.floor((this.mScrollDuration * modifier));
                            this._AbsListView_this.smoothScrollBy(distance, duration, true);
                            this._AbsListView_this.postOnAnimation(this);
                        } else {
                            // On-screen, just scroll.
                            const targetTop:number = this._AbsListView_this.getChildAt(position - firstPos).getTop();
                            const distance:number = targetTop - this.mOffsetFromTop;
                            const duration:number = Math.floor((this.mScrollDuration * (<number> Math.abs(distance) / this._AbsListView_this.getHeight())));
                            this._AbsListView_this.smoothScrollBy(distance, duration, true);
                        }
                        break;
                    }
                    default:
                        break;
                }
            }
        }
        export class AdapterDataSetObserver extends AdapterView.AdapterDataSetObserver {
            _AbsListView_this:AbsListView;

            constructor(arg:any) {
                super(arg);
                this._AbsListView_this = arg;
            }

            onChanged():void {
                super.onChanged();
                //TODO when fast scroller impl
                //if (this._AbsListView_this.mFastScroller != null) {
                //    this._AbsListView_this.mFastScroller.onSectionsChanged();
                //}
            }

            onInvalidated():void {
                super.onInvalidated();
                //TODO when fast scroller impl
                //if (this._AbsListView_this.mFastScroller != null) {
                //    this._AbsListView_this.mFastScroller.onSectionsChanged();
                //}
            }
        }

        /**
         * AbsListView extends LayoutParams to provide a place to hold the view type.
         */
        export class LayoutParams extends ViewGroup.LayoutParams {

            /**
             * View type for this view, as returned by
             * {@link android.widget.Adapter#getItemViewType(int) }
             */
            viewType:number = 0;

            /**
             * When this boolean is set, the view has been added to the AbsListView
             * at least once. It is used to know whether headers/footers have already
             * been added to the list view and whether they should be treated as
             * recycled views or not.
             */
            recycledHeaderFooter:boolean;

            /**
             * When an AbsListView is measured with an AT_MOST measure spec, it needs
             * to obtain children views to measure itself. When doing so, the children
             * are not attached to the window, but put in the recycler which assumes
             * they've been attached before. Setting this flag will force the reused
             * view to be attached to the window rather than just attached to the
             * parent.
             */
            forceAdd:boolean;

            /**
             * The position the view was removed from when pulled out of the
             * scrap heap.
             * @hide
             */
            scrappedFromPosition:number = 0;

            /**
             * The ID the view represents
             */
            itemId:number = -1;

            constructor(context:android.content.Context, attrs:HTMLElement);
            constructor(w:number, h:number);
            constructor(w:number, h:number, viewType:number);
            constructor(source:ViewGroup.LayoutParams);
            constructor(...args){
                super(null); // first line must call super
                if (args[0] instanceof android.content.Context && args[1] instanceof HTMLElement) {
                    super(args[0], args[1]);
                } else if (typeof args[0] === 'number' && typeof args[1] === 'number' && typeof args[2] == 'number') {
                    super(args[0], args[1]);
                    this.viewType = args[2];
                } else if (typeof args[0] === 'number' && typeof args[1] === 'number') {
                    super(args[0], args[1]);
                } else if (args[0] instanceof ViewGroup.LayoutParams) {
                    super(args[0]);
                }
            }
        }
        /**
         * A RecyclerListener is used to receive a notification whenever a View is placed
         * inside the RecycleBin's scrap heap. This listener is used to free resources
         * associated to Views placed in the RecycleBin.
         *
         * @see android.widget.AbsListView.RecycleBin
         * @see android.widget.AbsListView#setRecyclerListener(android.widget.AbsListView.RecyclerListener)
         */
        export interface RecyclerListener {

            /**
             * Indicates that the specified View was moved into the recycler's scrap heap.
             * The view is not displayed on screen any more and any expensive resource
             * associated with the view should be discarded.
             *
             * @param view
             */
            onMovedToScrapHeap(view:View):void ;
        }
        /**
         * The RecycleBin facilitates reuse of views across layouts. The RecycleBin has two levels of
         * storage: ActiveViews and ScrapViews. ActiveViews are those views which were onscreen at the
         * start of a layout. By construction, they are displaying current information. At the end of
         * layout, all views in ActiveViews are demoted to ScrapViews. ScrapViews are old views that
         * could potentially be used by the adapter to avoid allocating views unnecessarily.
         *
         * @see android.widget.AbsListView#setRecyclerListener(android.widget.AbsListView.RecyclerListener)
         * @see android.widget.AbsListView.RecyclerListener
         */
        export class RecycleBin {
            _AbsListView_this:AbsListView;

            constructor(arg:AbsListView) {
                this._AbsListView_this = arg;
            }

            mRecyclerListener:AbsListView.RecyclerListener;

            /**
             * The position of the first view stored in mActiveViews.
             */
            private mFirstActivePosition:number = 0;

            /**
             * Views that were on screen at the start of layout. This array is populated at the start of
             * layout, and at the end of layout all view in mActiveViews are moved to mScrapViews.
             * Views in mActiveViews represent a contiguous range of Views, with position of the first
             * view store in mFirstActivePosition.
             */
            mActiveViews:View[] = [];

            /**
             * Unsorted views that can be used by the adapter as a convert view.
             */
            private mScrapViews:ArrayList<View>[];

            private mViewTypeCount:number = 0;

            private mCurrentScrap:ArrayList<View>;

            private mSkippedScrap:ArrayList<View>;

            private mTransientStateViews:SparseArray<View>;

            private mTransientStateViewsById:LongSparseArray<View>;

            setViewTypeCount(viewTypeCount:number):void {
                if (viewTypeCount < 1) {
                    throw Error(`new IllegalArgumentException("Can't have a viewTypeCount < 1")`);
                }
                //noinspection unchecked
                let scrapViews:ArrayList<View>[] = new Array<ArrayList<View>>(viewTypeCount);
                for (let i:number = 0; i < viewTypeCount; i++) {
                    scrapViews[i] = new ArrayList<View>();
                }
                this.mViewTypeCount = viewTypeCount;
                this.mCurrentScrap = scrapViews[0];
                this.mScrapViews = scrapViews;
            }

            markChildrenDirty():void {
                if (this.mViewTypeCount == 1) {
                    const scrap:ArrayList<View> = this.mCurrentScrap;
                    const scrapCount:number = scrap.size();
                    for (let i:number = 0; i < scrapCount; i++) {
                        scrap.get(i).forceLayout();
                    }
                } else {
                    const typeCount:number = this.mViewTypeCount;
                    for (let i:number = 0; i < typeCount; i++) {
                        const scrap:ArrayList<View> = this.mScrapViews[i];
                        const scrapCount:number = scrap.size();
                        for (let j:number = 0; j < scrapCount; j++) {
                            scrap.get(j).forceLayout();
                        }
                    }
                }
                if (this.mTransientStateViews != null) {
                    const count:number = this.mTransientStateViews.size();
                    for (let i:number = 0; i < count; i++) {
                        this.mTransientStateViews.valueAt(i).forceLayout();
                    }
                }
                if (this.mTransientStateViewsById != null) {
                    const count:number = this.mTransientStateViewsById.size();
                    for (let i:number = 0; i < count; i++) {
                        this.mTransientStateViewsById.valueAt(i).forceLayout();
                    }
                }
            }

            shouldRecycleViewType(viewType:number):boolean {
                return viewType >= 0;
            }

            /**
             * Clears the scrap heap.
             */
            clear():void {
                if (this.mViewTypeCount == 1) {
                    const scrap:ArrayList<View> = this.mCurrentScrap;
                    const scrapCount:number = scrap.size();
                    for (let i:number = 0; i < scrapCount; i++) {
                        this._AbsListView_this.removeDetachedView(scrap.remove(scrapCount - 1 - i), false);
                    }
                } else {
                    const typeCount:number = this.mViewTypeCount;
                    for (let i:number = 0; i < typeCount; i++) {
                        const scrap:ArrayList<View> = this.mScrapViews[i];
                        const scrapCount:number = scrap.size();
                        for (let j:number = 0; j < scrapCount; j++) {
                            this._AbsListView_this.removeDetachedView(scrap.remove(scrapCount - 1 - j), false);
                        }
                    }
                }
                if (this.mTransientStateViews != null) {
                    this.mTransientStateViews.clear();
                }
                if (this.mTransientStateViewsById != null) {
                    this.mTransientStateViewsById.clear();
                }
            }

            /**
             * Fill ActiveViews with all of the children of the AbsListView.
             *
             * @param childCount The minimum number of views mActiveViews should hold
             * @param firstActivePosition The position of the first view that will be stored in
             *        mActiveViews
             */
            fillActiveViews(childCount:number, firstActivePosition:number):void {
                if (this.mActiveViews.length < childCount) {
                    this.mActiveViews = new Array<View>(childCount);
                }
                this.mFirstActivePosition = firstActivePosition;
                //noinspection MismatchedReadAndWriteOfArray
                const activeViews:View[] = this.mActiveViews;
                for (let i:number = 0; i < childCount; i++) {
                    let child:View = this._AbsListView_this.getChildAt(i);
                    let lp:AbsListView.LayoutParams = <AbsListView.LayoutParams> child.getLayoutParams();
                    // Don't put header or footer views into the scrap heap
                    if (lp != null && lp.viewType != AbsListView.ITEM_VIEW_TYPE_HEADER_OR_FOOTER) {
                        // Note:  We do place AdapterView.ITEM_VIEW_TYPE_IGNORE in active views.
                        //        However, we will NOT place them into scrap views.
                        activeViews[i] = child;
                    }
                }
            }

            /**
             * Get the view corresponding to the specified position. The view will be removed from
             * mActiveViews if it is found.
             *
             * @param position The position to look up in mActiveViews
             * @return The view if it is found, null otherwise
             */
            getActiveView(position:number):View {
                let index:number = position - this.mFirstActivePosition;
                const activeViews:View[] = this.mActiveViews;
                if (index >= 0 && index < activeViews.length) {
                    const match:View = activeViews[index];
                    activeViews[index] = null;
                    return match;
                }
                return null;
            }

            getTransientStateView(position:number):View {
                if (this._AbsListView_this.mAdapter != null && this._AbsListView_this.mAdapterHasStableIds && this.mTransientStateViewsById != null) {
                    let id:number = this._AbsListView_this.mAdapter.getItemId(position);
                    let result:View = this.mTransientStateViewsById.get(id);
                    this.mTransientStateViewsById.remove(id);
                    return result;
                }
                if (this.mTransientStateViews != null) {
                    const index:number = this.mTransientStateViews.indexOfKey(position);
                    if (index >= 0) {
                        let result:View = this.mTransientStateViews.valueAt(index);
                        this.mTransientStateViews.removeAt(index);
                        return result;
                    }
                }
                return null;
            }

            /**
             * Dump any currently saved views with transient state.
             */
            clearTransientStateViews():void {
                if (this.mTransientStateViews != null) {
                    this.mTransientStateViews.clear();
                }
                if (this.mTransientStateViewsById != null) {
                    this.mTransientStateViewsById.clear();
                }
            }

            /**
             * @return A view from the ScrapViews collection. These are unordered.
             */
            getScrapView(position:number):View {
                if (this.mViewTypeCount == 1) {
                    return AbsListView.retrieveFromScrap(this.mCurrentScrap, position);
                } else {
                    let whichScrap:number = this._AbsListView_this.mAdapter.getItemViewType(position);
                    if (whichScrap >= 0 && whichScrap < this.mScrapViews.length) {
                        return AbsListView.retrieveFromScrap(this.mScrapViews[whichScrap], position);
                    }
                }
                return null;
            }

            /**
             * Puts a view into the list of scrap views.
             * <p>
             * If the list data hasn't changed or the adapter has stable IDs, views
             * with transient state will be preserved for later retrieval.
             *
             * @param scrap The view to add
             * @param position The view's position within its parent
             */
            addScrapView(scrap:View, position:number):void {
                const lp:AbsListView.LayoutParams = <AbsListView.LayoutParams> scrap.getLayoutParams();
                if (lp == null) {
                    return;
                }
                lp.scrappedFromPosition = position;
                // Remove but don't scrap header or footer views, or views that
                // should otherwise not be recycled.
                const viewType:number = lp.viewType;
                if (!this.shouldRecycleViewType(viewType)) {
                    return;
                }
                scrap.dispatchStartTemporaryDetach();

                // The the accessibility state of the view may change while temporary
                // detached and we do not allow detached views to fire accessibility
                // events. So we are announcing that the subtree changed giving a chance
                // to clients holding on to a view in this subtree to refresh it.
                //this._AbsListView_this.notifyViewAccessibilityStateChangedIfNeeded(AccessibilityEvent.CONTENT_CHANGE_TYPE_SUBTREE);

                // Don't scrap views that have transient state.
                const scrapHasTransientState:boolean = scrap.hasTransientState();
                if (scrapHasTransientState) {
                    if (this._AbsListView_this.mAdapter != null && this._AbsListView_this.mAdapterHasStableIds) {
                        // the same data.
                        if (this.mTransientStateViewsById == null) {
                            this.mTransientStateViewsById = new LongSparseArray<View>();
                        }
                        this.mTransientStateViewsById.put(lp.itemId, scrap);
                    } else if (!this._AbsListView_this.mDataChanged) {
                        // their old positions.
                        if (this.mTransientStateViews == null) {
                            this.mTransientStateViews = new SparseArray<View>();
                        }
                        this.mTransientStateViews.put(position, scrap);
                    } else {
                        // Otherwise, we'll have to remove the view and start over.
                        if (this.mSkippedScrap == null) {
                            this.mSkippedScrap = new ArrayList<View>();
                        }
                        this.mSkippedScrap.add(scrap);
                    }
                } else {
                    if (this.mViewTypeCount == 1) {
                        this.mCurrentScrap.add(scrap);
                    } else {
                        this.mScrapViews[viewType].add(scrap);
                    }
                    // Clear any system-managed transient state.
                    //if (scrap.isAccessibilityFocused()) {
                    //    scrap.clearAccessibilityFocus();
                    //}
                    //scrap.setAccessibilityDelegate(null);
                    if (this.mRecyclerListener != null) {
                        this.mRecyclerListener.onMovedToScrapHeap(scrap);
                    }
                }
            }

            /**
             * Finish the removal of any views that skipped the scrap heap.
             */
            removeSkippedScrap():void {
                if (this.mSkippedScrap == null) {
                    return;
                }
                const count:number = this.mSkippedScrap.size();
                for (let i:number = 0; i < count; i++) {
                    this._AbsListView_this.removeDetachedView(this.mSkippedScrap.get(i), false);
                }
                this.mSkippedScrap.clear();
            }

            /**
             * Move all views remaining in mActiveViews to mScrapViews.
             */
            scrapActiveViews():void {
                const activeViews:View[] = this.mActiveViews;
                const hasListener:boolean = this.mRecyclerListener != null;
                const multipleScraps:boolean = this.mViewTypeCount > 1;
                let scrapViews:ArrayList<View> = this.mCurrentScrap;
                const count:number = activeViews.length;
                for (let i:number = count - 1; i >= 0; i--) {
                    const victim:View = activeViews[i];
                    if (victim != null) {
                        const lp:AbsListView.LayoutParams = <AbsListView.LayoutParams> victim.getLayoutParams();
                        let whichScrap:number = lp.viewType;
                        activeViews[i] = null;
                        const scrapHasTransientState:boolean = victim.hasTransientState();
                        if (!this.shouldRecycleViewType(whichScrap) || scrapHasTransientState) {
                            // Do not move views that should be ignored
                            if (whichScrap != AbsListView.ITEM_VIEW_TYPE_HEADER_OR_FOOTER && scrapHasTransientState) {
                                this._AbsListView_this.removeDetachedView(victim, false);
                            }
                            if (scrapHasTransientState) {
                                if (this._AbsListView_this.mAdapter != null && this._AbsListView_this.mAdapterHasStableIds) {
                                    if (this.mTransientStateViewsById == null) {
                                        this.mTransientStateViewsById = new LongSparseArray<View>();
                                    }
                                    let id:number = this._AbsListView_this.mAdapter.getItemId(this.mFirstActivePosition + i);
                                    this.mTransientStateViewsById.put(id, victim);
                                } else {
                                    if (this.mTransientStateViews == null) {
                                        this.mTransientStateViews = new SparseArray<View>();
                                    }
                                    this.mTransientStateViews.put(this.mFirstActivePosition + i, victim);
                                }
                            }
                            continue;
                        }
                        if (multipleScraps) {
                            scrapViews = this.mScrapViews[whichScrap];
                        }
                        victim.dispatchStartTemporaryDetach();
                        lp.scrappedFromPosition = this.mFirstActivePosition + i;
                        scrapViews.add(victim);
                        //victim.setAccessibilityDelegate(null);
                        if (hasListener) {
                            this.mRecyclerListener.onMovedToScrapHeap(victim);
                        }
                    }
                }
                this.pruneScrapViews();
            }

            /**
             * Makes sure that the size of mScrapViews does not exceed the size of mActiveViews.
             * (This can happen if an adapter does not recycle its views).
             */
            private pruneScrapViews():void {
                const maxViews:number = this.mActiveViews.length;
                const viewTypeCount:number = this.mViewTypeCount;
                const scrapViews:ArrayList<View>[] = this.mScrapViews;
                for (let i:number = 0; i < viewTypeCount; ++i) {
                    const scrapPile:ArrayList<View> = scrapViews[i];
                    let size:number = scrapPile.size();
                    const extras:number = size - maxViews;
                    size--;
                    for (let j:number = 0; j < extras; j++) {
                        this._AbsListView_this.removeDetachedView(scrapPile.remove(size--), false);
                    }
                }
                if (this.mTransientStateViews != null) {
                    for (let i:number = 0; i < this.mTransientStateViews.size(); i++) {
                        const v:View = this.mTransientStateViews.valueAt(i);
                        if (!v.hasTransientState()) {
                            this.mTransientStateViews.removeAt(i);
                            i--;
                        }
                    }
                }
                if (this.mTransientStateViewsById != null) {
                    for (let i:number = 0; i < this.mTransientStateViewsById.size(); i++) {
                        const v:View = this.mTransientStateViewsById.valueAt(i);
                        if (!v.hasTransientState()) {
                            this.mTransientStateViewsById.removeAt(i);
                            i--;
                        }
                    }
                }
            }

            /**
             * Puts all views in the scrap heap into the supplied list.
             */
            reclaimScrapViews(views:List<View>):void {
                if (this.mViewTypeCount == 1) {
                    views.addAll(this.mCurrentScrap);
                } else {
                    const viewTypeCount:number = this.mViewTypeCount;
                    const scrapViews:ArrayList<View>[] = this.mScrapViews;
                    for (let i:number = 0; i < viewTypeCount; ++i) {
                        const scrapPile:ArrayList<View> = scrapViews[i];
                        views.addAll(scrapPile);
                    }
                }
            }

            /**
             * Updates the cache color hint of all known views.
             *
             * @param color The new cache color hint.
             */
            setCacheColorHint(color:number):void {
                if (this.mViewTypeCount == 1) {
                    const scrap:ArrayList<View> = this.mCurrentScrap;
                    const scrapCount:number = scrap.size();
                    for (let i:number = 0; i < scrapCount; i++) {
                        scrap.get(i).setDrawingCacheBackgroundColor(color);
                    }
                } else {
                    const typeCount:number = this.mViewTypeCount;
                    for (let i:number = 0; i < typeCount; i++) {
                        const scrap:ArrayList<View> = this.mScrapViews[i];
                        const scrapCount:number = scrap.size();
                        for (let j:number = 0; j < scrapCount; j++) {
                            scrap.get(j).setDrawingCacheBackgroundColor(color);
                        }
                    }
                }
                // Just in case this is called during a layout pass
                const activeViews:View[] = this.mActiveViews;
                const count:number = activeViews.length;
                for (let i:number = 0; i < count; ++i) {
                    const victim:View = activeViews[i];
                    if (victim != null) {
                        victim.setDrawingCacheBackgroundColor(color);
                    }
                }
            }
        }
    }

}
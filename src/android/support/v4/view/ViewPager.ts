/*
 * Copyright (C) 2011 The Android Open Source Project
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

///<reference path="../../../view/View.ts"/>
///<reference path="../../../view/VelocityTracker.ts"/>
///<reference path="../../../widget/OverScroller.ts"/>
///<reference path="../../../view/ViewGroup.ts"/>
///<reference path="../../../view/MotionEvent.ts"/>
///<reference path="../../../view/animation/Interpolator.ts"/>
///<reference path="../../../../java/util/ArrayList.ts"/>
///<reference path="../../../database/DataSetObservable.ts"/>
///<reference path="../../../database/Observable.ts"/>
///<reference path="../../../database/DataSetObserver.ts"/>
///<reference path="PagerAdapter.ts"/>


//support v4 23.1.0
module android.support.v4.view {
    import View = android.view.View;
    import Gravity = android.view.Gravity;
    import MeasureSpec = View.MeasureSpec;
    import OverScroller = android.widget.OverScroller;
    import ViewGroup = android.view.ViewGroup;
    import Interpolator = android.view.animation.Interpolator;
    import ArrayList = java.util.ArrayList;
    import Rect = android.graphics.Rect;
    import PagerAdapter = android.support.v4.view.PagerAdapter;
    import Observable = android.database.Observable;
    import DataSetObservable = android.database.DataSetObservable;
    import DataSetObserver = android.database.DataSetObserver;
    import Drawable = android.graphics.drawable.Drawable;
    import VelocityTracker = android.view.VelocityTracker;
    import ViewConfiguration = android.view.ViewConfiguration;
    import Runnable = java.lang.Runnable;
    import Resources = android.content.res.Resources;
    import Log = android.util.Log;
    import MotionEvent = android.view.MotionEvent;
    import KeyEvent = android.view.KeyEvent;

    const TAG = "ViewPager";
    const DEBUG = false;

    const SymbolDecor = Symbol();

    /**
     * Layout manager that allows the user to flip left and right
     * through pages of data.  You supply an implementation of a
     * {@link PagerAdapter} to generate the pages that the view shows.
     *
     * <p>Note this class is currently under early design and
     * development.  The API will likely change in later updates of
     * the compatibility library, requiring changes to the source code
     * of apps when they are compiled against the newer version.</p>
     *
     * <p>ViewPager is most often used in conjunction with {@link android.app.Fragment},
     * which is a convenient way to supply and manage the lifecycle of each page.
     * There are standard adapters implemented for using fragments with the ViewPager,
     * which cover the most common use cases.  These are
     * {@link android.support.v4.app.FragmentPagerAdapter} and
     * {@link android.support.v4.app.FragmentStatePagerAdapter}; each of these
     * classes have simple code showing how to build a full user interface
     * with them.
     *
     * <p>Here is a more complicated example of ViewPager, using it in conjuction
     * with {@link android.app.ActionBar} tabs.  You can find other examples of using
     * ViewPager in the API 4+ Support Demos and API 13+ Support Demos sample code.
     *
     * {@sample development/samples/Support13Demos/src/com/example/android/supportv13/app/ActionBarTabsPager.java
     *      complete}
     */
    export class ViewPager extends ViewGroup {
        /**
         * Used to track what the expected number of items in the adapter should be.
         * If the app changes this when we don't expect it, we'll throw a big obnoxious exception.
         */
        private mExpectedAdapterCount = 0;
        private static COMPARATOR = (lhs:ItemInfo, rhs:ItemInfo):number=> {
            return lhs.position - rhs.position;
        };

        private static USE_CACHE = false;

        private static DEFAULT_OFFSCREEN_PAGES = 1;
        private static MAX_SETTLE_DURATION = 600; // ms
        private static MIN_DISTANCE_FOR_FLING = 25; // dips
        private static DEFAULT_GUTTER_SIZE = 16; // dips
        private static MIN_FLING_VELOCITY = 400; // dips

        private static sInterpolator:Interpolator = {
            getInterpolation(t:number):number {
                t -= 1.0;
                return t * t * t * t * t + 1.0;
            }
        };
        private mItems = new ArrayList<ItemInfo>();
        private mTempItem = new ItemInfo();
        private mTempRect = new Rect();

        private mAdapter:PagerAdapter;
        private mCurItem:number = 0;// Index of currently displayed page.

        private mRestoredCurItem = -1;
        private mScroller:OverScroller;
        private mObserver:PagerObserver;

        private mPageMargin:number = 0;
        private mMarginDrawable:Drawable;
        private mTopPageBounds:number = 0;
        private mBottomPageBounds:number = 0;

        // Offsets of the first and last items, if known.
        // Set during population, used to determine if we are at the beginning
        // or end of the pager data set during touch scrolling.
        private mFirstOffset = -Number.MAX_VALUE;
        private mLastOffset = Number.MAX_VALUE;

        private mChildWidthMeasureSpec:number = 0;
        private mChildHeightMeasureSpec:number = 0;
        private mInLayout = false;

        private mScrollingCacheEnabled = false;

        private mPopulatePending = false;
        private mOffscreenPageLimit = ViewPager.DEFAULT_OFFSCREEN_PAGES;

        private mIsBeingDragged = false;
        private mIsUnableToDrag = false;
        private mDefaultGutterSize:number = 0;
        private mGutterSize:number = 0;
        //private mTouchSlop: number = 0;
        /**
         * Position of the last motion event.
         */
        private mLastMotionX = 0;
        private mLastMotionY = 0;
        private mInitialMotionX = 0;
        private mInitialMotionY = 0;

        private static INVALID_POINTER = -1;
        /**
         * ID of the active pointer. This is used to retain consistency during
         * drags/flings if multiple pointers are used.
         */
        private mActivePointerId = ViewPager.INVALID_POINTER;

        /**
         * Determines speed during touch scrolling
         */
        private mVelocityTracker:VelocityTracker;
        private mMinimumVelocity:number = 0;
        private mMaximumVelocity:number = 0;
        private mFlingDistance:number = 0;
        private mCloseEnough:number = 0;

        // If the pager is at least this close to its final position, complete the scroll
        // on touch down and let the user interact with the content inside instead of
        // "catching" the flinging pager.
        private static CLOSE_ENOUGH = 2; // dp

        private mFakeDragging = false;
        private mFakeDragBeginTime = 0;

        //private mLeftEdge: EdgeEffectCompat;
        //private mRightEdge: EdgeEffectCompat;

        private mFirstLayout = true;
        private mNeedCalculatePageOffsets = false;
        private mCalledSuper = false;
        private mDecorChildCount:number = 0;

        private mOnPageChangeListeners:ArrayList<ViewPager.OnPageChangeListener>;
        private mOnPageChangeListener:ViewPager.OnPageChangeListener;
        private mInternalPageChangeListener:ViewPager.OnPageChangeListener;
        private mAdapterChangeListener:ViewPager.OnAdapterChangeListener;
        private mPageTransformer:ViewPager.PageTransformer;

        //private mSetChildrenDrawingOrderEnabled: Method;

        private static DRAW_ORDER_DEFAULT = 0;
        private static DRAW_ORDER_FORWARD = 1;
        private static DRAW_ORDER_REVERSE = 2;
        private mDrawingOrder:number = 0;
        private mDrawingOrderedChildren:ArrayList<View>;
        private static sPositionComparator = (lhs:View, rhs:View):number=> {
            let llp = <ViewPager.LayoutParams>lhs.getLayoutParams();
            let rlp = <ViewPager.LayoutParams>rhs.getLayoutParams();
            if (llp.isDecor != rlp.isDecor) {
                return llp.isDecor ? 1 : -1;
            }
            return llp.position - rlp.position
        };

        /**
         * Indicates that the pager is in an idle, settled state. The current page
         * is fully in view and no animation is in progress.
         */
        static SCROLL_STATE_IDLE = 0

        /**
         * Indicates that the pager is currently being dragged by the user.
         */
        static SCROLL_STATE_DRAGGING = 1

        /**
         * Indicates that the pager is in the process of settling to a final position.
         */
        static SCROLL_STATE_SETTLING = 2

        private mEndScrollRunnable = (()=>{
            let ViewPager_this = this;
            class InnerClass implements Runnable{
                run() {
                    (<any>ViewPager_this).setScrollState(ViewPager.SCROLL_STATE_IDLE);
                    (<any>ViewPager_this).populate();
                }
            }
            return new InnerClass();
        })();

        private mScrollState = ViewPager.SCROLL_STATE_IDLE;

        constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle?){
            super(context, bindElement, defStyle);
            this.initViewPager();
        }

        private initViewPager() {
            this.setWillNotDraw(false)
            this.setDescendantFocusability(ViewGroup.FOCUS_AFTER_DESCENDANTS);
            this.setFocusable(true);
            //let context = getContext()
            this.mScroller = new OverScroller(ViewPager.sInterpolator)
            //let configuration = ViewConfiguration.get(context)
            let density = Resources.getDisplayMetrics().density

            this.mTouchSlop = ViewConfiguration.get().getScaledPagingTouchSlop()
            this.mMinimumVelocity = Math.floor(ViewPager.MIN_FLING_VELOCITY * density);
            this.mMaximumVelocity = ViewConfiguration.get().getScaledMaximumFlingVelocity()
            //this.mLeftEdge = EdgeEffectCompat(context)
            //this.mRightEdge = EdgeEffectCompat(context)

            this.mFlingDistance = Math.floor(ViewPager.MIN_DISTANCE_FOR_FLING * density)
            this.mCloseEnough = Math.floor(ViewPager.CLOSE_ENOUGH * density)
            this.mDefaultGutterSize = Math.floor(ViewPager.DEFAULT_GUTTER_SIZE * density)

            //ViewCompat.setAccessibilityDelegate(this, MyAccessibilityDelegate())

            //if (ViewCompat.getImportantForAccessibility(this) == ViewCompat.IMPORTANT_FOR_ACCESSIBILITY_AUTO) {
            //    ViewCompat.setImportantForAccessibility(this, ViewCompat.IMPORTANT_FOR_ACCESSIBILITY_YES)
            //}
        }

        protected onDetachedFromWindow():void {
            this.removeCallbacks(this.mEndScrollRunnable);
            super.onDetachedFromWindow();
        }

        private setScrollState(newState:number) {
            if (this.mScrollState == newState) {
                return;
            }

            this.mScrollState = newState;
            if (this.mPageTransformer != null) {
                // PageTransformers can do complex things that benefit from hardware layers.
                this.enableLayers(newState != ViewPager.SCROLL_STATE_IDLE);
            }
            this.dispatchOnScrollStateChanged(newState);
        }


        /**
         * Set a PagerAdapter that will supply views for this pager as needed.

         * @param adapter Adapter to use
         */
        setAdapter(adapter:PagerAdapter):void {
            if (this.mAdapter != null) {
                this.mAdapter.unregisterDataSetObserver(this.mObserver);
                this.mAdapter.startUpdate(this);
                for (let i = 0; i < this.mItems.size(); i++) {
                    const ii = this.mItems.get(i);
                    this.mAdapter.destroyItem(this, ii.position, ii.object);
                }
                this.mAdapter.finishUpdate(this);
                this.mItems.clear();
                this.removeNonDecorViews();
                this.mCurItem = 0;
                this.scrollTo(0, 0);
            }

            const oldAdapter = this.mAdapter;
            this.mAdapter = adapter;
            this.mExpectedAdapterCount = 0;

            if (this.mAdapter != null) {
                if (this.mObserver == null) {
                    this.mObserver = new PagerObserver(this);
                }
                this.mAdapter.registerDataSetObserver(this.mObserver);
                this.mPopulatePending = false;
                const wasFirstLayout = this.mFirstLayout;
                this.mFirstLayout = true;
                this.mExpectedAdapterCount = this.mAdapter.getCount();
                if (this.mRestoredCurItem >= 0) {
                    //this.mAdapter.restoreState(this.mRestoredAdapterState, this.mRestoredClassLoader);
                    this.setCurrentItemInternal(this.mRestoredCurItem, false, true);
                    this.mRestoredCurItem = -1;
                    //this.mRestoredAdapterState = null;
                    //this.mRestoredClassLoader = null;
                } else if (!wasFirstLayout) {
                    this.populate();
                } else {
                    this.requestLayout();
                }
            }

            if (this.mAdapterChangeListener != null && oldAdapter != adapter) {
                this.mAdapterChangeListener.onAdapterChanged(oldAdapter, adapter);
            }
        }

        private removeNonDecorViews() {
            for (let i = 0; i < this.getChildCount(); i++) {
                const child = this.getChildAt(i);
                const lp = <ViewPager.LayoutParams>child.getLayoutParams();
                if (!lp.isDecor) {
                    this.removeViewAt(i);
                    i--;
                }
            }
        }

        /**
         * Retrieve the current adapter supplying pages.
         *
         * @return The currently registered PagerAdapter
         */
        public getAdapter():PagerAdapter {
            return this.mAdapter;
        }

        setOnAdapterChangeListener(listener:ViewPager.OnAdapterChangeListener):void {
            this.mAdapterChangeListener = listener;
        }

        private getClientWidth() {
            return this.getMeasuredWidth() - this.getPaddingLeft() - this.getPaddingRight();
        }


        /**
         * Set the currently selected page.
         *
         * @param item Item index to select
         * @param smoothScroll True to smoothly scroll to the new item, false to transition immediately
         */
        public setCurrentItem(item:number, smoothScroll = !this.mFirstLayout):void {
            this.mPopulatePending = false;
            this.setCurrentItemInternal(item, smoothScroll, false);
        }

        getCurrentItem():number {
            return this.mCurItem;
        }

        setCurrentItemInternal(item:number, smoothScroll:boolean, always:boolean, velocity = 0) {
            if (this.mAdapter == null || this.mAdapter.getCount() <= 0) {
                this.setScrollingCacheEnabled(false);
                return;
            }
            if (!always && this.mCurItem == item && this.mItems.size() != 0) {
                this.setScrollingCacheEnabled(false);
                return;
            }

            if (item < 0) {
                item = 0;
            } else if (item >= this.mAdapter.getCount()) {
                item = this.mAdapter.getCount() - 1;
            }
            const pageLimit = this.mOffscreenPageLimit;
            if (item > (this.mCurItem + pageLimit) || item < (this.mCurItem - pageLimit)) {
                // We are doing a jump by more than one page.  To avoid
                // glitches, we want to keep all current pages in the view
                // until the scroll ends.
                for (let i = 0; i < this.mItems.size(); i++) {
                    this.mItems.get(i).scrolling = true;
                }
            }
            const dispatchSelected = this.mCurItem != item;

            if (this.mFirstLayout) {
                // We don't have any idea how big we are yet and shouldn't have any pages either.
                // Just set things up and let the pending layout handle things.
                this.mCurItem = item;
                if (dispatchSelected) {
                    this.dispatchOnPageSelected(item);
                }
                this.requestLayout();
            } else {
                this.populate(item);
                this.scrollToItem(item, smoothScroll, velocity, dispatchSelected);
            }
        }

        private scrollToItem(item:number, smoothScroll:boolean, velocity:number, dispatchSelected:boolean) {
            const curInfo = this.infoForPosition(item);
            let destX = 0;
            if (curInfo != null) {
                const width = this.getClientWidth();
                destX = Math.floor(width * Math.max(this.mFirstOffset,
                        Math.min(curInfo.offset, this.mLastOffset)));
            }
            if (smoothScroll) {
                this.smoothScrollTo(destX, 0, velocity);
                if (dispatchSelected) {
                    this.dispatchOnPageSelected(item);
                }
            } else {
                if (dispatchSelected) {
                    this.dispatchOnPageSelected(item);
                }
                this.completeScroll(false);
                this.scrollTo(destX, 0);
                this.pageScrolled(destX);
            }
        }


        /**
         * Set a listener that will be invoked whenever the page changes or is incrementally
         * scrolled. See {@link OnPageChangeListener}.
         *
         * @param listener Listener to set
         *
         * @deprecated Use {@link #addOnPageChangeListener(OnPageChangeListener)}
         * and {@link #removeOnPageChangeListener(OnPageChangeListener)} instead.
         */
        setOnPageChangeListener(listener:ViewPager.OnPageChangeListener) {
            this.mOnPageChangeListener = listener;
        }


        /**
         * Add a listener that will be invoked whenever the page changes or is incrementally
         * scrolled. See {@link OnPageChangeListener}.
         *
         * <p>Components that add a listener should take care to remove it when finished.
         * Other components that take ownership of a view may call {@link #clearOnPageChangeListeners()}
         * to remove all attached listeners.</p>
         *
         * @param listener listener to add
         */
        addOnPageChangeListener(listener:ViewPager.OnPageChangeListener) {
            if (this.mOnPageChangeListeners == null) {
                this.mOnPageChangeListeners = new ArrayList<ViewPager.OnPageChangeListener>();
            }
            this.mOnPageChangeListeners.add(listener);
        }

        /**
         * Remove a listener that was previously added via
         * {@link #addOnPageChangeListener(OnPageChangeListener)}.
         *
         * @param listener listener to remove
         */
        removeOnPageChangeListener(listener:ViewPager.OnPageChangeListener) {
            if (this.mOnPageChangeListeners != null) {
                this.mOnPageChangeListeners.remove(listener);
            }
        }


        /**
         * Remove all listeners that are notified of any changes in scroll state or position.
         */
        clearOnPageChangeListeners() {
            if (this.mOnPageChangeListeners != null) {
                this.mOnPageChangeListeners.clear();
            }
        }


        /**
         * Set a {@link PageTransformer} that will be called for each attached page whenever
         * the scroll position is changed. This allows the application to apply custom property
         * transformations to each page, overriding the default sliding look and feel.
         *
         * <p><em>Note:</em> Prior to Android 3.0 the property animation APIs did not exist.
         * As a result, setting a PageTransformer prior to Android 3.0 (API 11) will have no effect.</p>
         *
         * @param reverseDrawingOrder true if the supplied PageTransformer requires page views
         *                            to be drawn from last to first instead of first to last.
         * @param transformer PageTransformer that will modify each page's animation properties
         */
        setPageTransformer(reverseDrawingOrder:boolean, transformer:ViewPager.PageTransformer) {
            const hasTransformer = transformer != null;
            const needsPopulate = hasTransformer != (this.mPageTransformer != null);
            this.mPageTransformer = transformer;
            this.setChildrenDrawingOrderEnabledCompat(hasTransformer);
            if (hasTransformer) {
                this.mDrawingOrder = reverseDrawingOrder ? ViewPager.DRAW_ORDER_REVERSE : ViewPager.DRAW_ORDER_FORWARD;
            } else {
                this.mDrawingOrder = ViewPager.DRAW_ORDER_DEFAULT;
            }
            if (needsPopulate) this.populate();
        }

        setChildrenDrawingOrderEnabledCompat(enable=true) {
            this.setChildrenDrawingOrderEnabled(enable);
        }

        getChildDrawingOrder(childCount:number, i:number):number {
            const index = this.mDrawingOrder == ViewPager.DRAW_ORDER_REVERSE ? childCount - 1 - i : i;
            const result = (<ViewPager.LayoutParams>this.mDrawingOrderedChildren.get(index).getLayoutParams()).childIndex;
            return result;
        }


        /**
         * Set a separate OnPageChangeListener for internal use by the support library.
         *
         * @param listener Listener to set
         * @return The old listener that was set, if any.
         */
        setInternalPageChangeListener(listener:ViewPager.OnPageChangeListener):ViewPager.OnPageChangeListener {
            let oldListener = this.mInternalPageChangeListener;
            this.mInternalPageChangeListener = listener;
            return oldListener;
        }


        /**
         * Returns the number of pages that will be retained to either side of the
         * current page in the view hierarchy in an idle state. Defaults to 1.
         *
         * @return How many pages will be kept offscreen on either side
         * @see #setOffscreenPageLimit(int)
         */
        getOffscreenPageLimit():number {
            return this.mOffscreenPageLimit;
        }


        /**
         * Set the number of pages that should be retained to either side of the
         * current page in the view hierarchy in an idle state. Pages beyond this
         * limit will be recreated from the adapter when needed.
         *
         * <p>This is offered as an optimization. If you know in advance the number
         * of pages you will need to support or have lazy-loading mechanisms in place
         * on your pages, tweaking this setting can have benefits in perceived smoothness
         * of paging animations and interaction. If you have a small number of pages (3-4)
         * that you can keep active all at once, less time will be spent in layout for
         * newly created view subtrees as the user pages back and forth.</p>
         *
         * <p>You should keep this limit low, especially if your pages have complex layouts.
         * This setting defaults to 1.</p>
         *
         * @param limit How many pages will be kept offscreen in an idle state.
         */
        setOffscreenPageLimit(limit:number):void {
            if (limit < ViewPager.DEFAULT_OFFSCREEN_PAGES) {
                Log.w(TAG, "Requested offscreen page limit " + limit + " too small; defaulting to " +
                    ViewPager.DEFAULT_OFFSCREEN_PAGES);
                limit = ViewPager.DEFAULT_OFFSCREEN_PAGES;
            }
            if (limit != this.mOffscreenPageLimit) {
                this.mOffscreenPageLimit = limit;
                this.populate();
            }
        }

        /**
         * Set the margin between pages.
         *
         * @param marginPixels Distance between adjacent pages in pixels
         * @see #getPageMargin()
         * @see #setPageMarginDrawable(Drawable)
         * @see #setPageMarginDrawable(int)
         */
        setPageMargin(marginPixels:number):void {
            const oldMargin = this.mPageMargin;
            this.mPageMargin = marginPixels;

            const width = this.getWidth();
            this.recomputeScrollPosition(width, width, marginPixels, oldMargin);

            this.requestLayout();
        }

        /**
         * Return the margin between pages.
         *
         * @return The size of the margin in pixels
         */
        getPageMargin():number {
            return this.mPageMargin;
        }


        /**
         * Set a drawable that will be used to fill the margin between pages.
         *
         * @param d Drawable to display between pages
         */
        setPageMarginDrawable(d:Drawable):void {
            this.mMarginDrawable = d;
            if (d != null) this.refreshDrawableState();
            this.setWillNotDraw(d == null);
            this.invalidate();
        }


        protected verifyDrawable(who:Drawable):boolean{
            return super.verifyDrawable(who) || who == this.mMarginDrawable;
        }

        protected drawableStateChanged():void {
            super.drawableStateChanged();
            const d = this.mMarginDrawable;
            if (d != null && d.isStateful()) {
                d.setState(this.getDrawableState());
            }
        }


        // We want the duration of the page snap animation to be influenced by the distance that
        // the screen has to travel, however, we don't want this duration to be effected in a
        // purely linear fashion. Instead, we use this method to moderate the effect that the distance
        // of travel has on the overall snap duration.
        distanceInfluenceForSnapDuration(f:number):number {
            f -= 0.5; // center the values about 0.
            f *= 0.3 * Math.PI / 2.0;
            return Math.sin(f);
        }


        /**
         * Like {@link View#scrollBy}, but scroll smoothly instead of immediately.
         *
         * @param x the number of pixels to scroll by on the X axis
         * @param y the number of pixels to scroll by on the Y axis
         */
        smoothScrollTo(x:number, y:number, velocity=0):void {
            if (this.getChildCount() == 0) {
                // Nothing to do.
                this.setScrollingCacheEnabled(false);
                return;
            }
            let sx = this.getScrollX();
            let sy = this.getScrollY();
            let dx = x - sx;
            let dy = y - sy;
            if (dx == 0 && dy == 0) {
                this.completeScroll(false);
                this.populate();
                this.setScrollState(ViewPager.SCROLL_STATE_IDLE);
                return;
            }

            this.setScrollingCacheEnabled(true);
            this.setScrollState(ViewPager.SCROLL_STATE_SETTLING);

            const width = this.getClientWidth();
            const halfWidth = width / 2;
            const distanceRatio = Math.min(1, 1.0 * Math.abs(dx) / width);
            const distance = halfWidth + halfWidth *
                this.distanceInfluenceForSnapDuration(distanceRatio);

            let duration = 0;
            velocity = Math.abs(velocity);
            if (velocity > 0) {
                duration = 4 * Math.round(1000 * Math.abs(distance / velocity));
            } else {
                const pageWidth = width * this.mAdapter.getPageWidth(this.mCurItem);
                const pageDelta = Math.abs(dx) / (pageWidth + this.mPageMargin);
                duration = Math.floor((pageDelta + 1) * 100);
            }
            duration = Math.min(duration, ViewPager.MAX_SETTLE_DURATION);

            this.mScroller.startScroll(sx, sy, dx, dy, duration);
            this.postInvalidateOnAnimation();
        }

        private addNewItem(position:number, index:number):ItemInfo {
            let ii = new ItemInfo();
            ii.position = position;
            ii.object = this.mAdapter.instantiateItem(this, position);
            ii.widthFactor = this.mAdapter.getPageWidth(position);
            if (index < 0 || index >= this.mItems.size()) {
                this.mItems.add(ii);
            } else {
                this.mItems.add(index, ii);
            }
            return ii;
        }

        dataSetChanged() {
            // This method only gets called if our observer is attached, so mAdapter is non-null.

            const adapterCount = this.mAdapter.getCount();
            this.mExpectedAdapterCount = adapterCount;
            let needPopulate = this.mItems.size() < this.mOffscreenPageLimit * 2 + 1 &&
                this.mItems.size() < adapterCount;
            let newCurrItem = this.mCurItem;

            let isUpdating = false;
            for (let i = 0; i < this.mItems.size(); i++) {
                const ii = this.mItems.get(i);
                const newPos = this.mAdapter.getItemPosition(ii.object);

                if (newPos == PagerAdapter.POSITION_UNCHANGED) {
                    continue;
                }

                if (newPos == PagerAdapter.POSITION_NONE) {
                    this.mItems.remove(i);
                    i--;

                    if (!isUpdating) {
                        this.mAdapter.startUpdate(this);
                        isUpdating = true;
                    }

                    this.mAdapter.destroyItem(this, ii.position, ii.object);
                    needPopulate = true;

                    if (this.mCurItem == ii.position) {
                        // Keep the current item in the valid range
                        newCurrItem = Math.max(0, Math.min(this.mCurItem, adapterCount - 1));
                        needPopulate = true;
                    }
                    continue;
                }

                if (ii.position != newPos) {
                    if (ii.position == this.mCurItem) {
                        // Our current item changed position. Follow it.
                        newCurrItem = newPos;
                    }

                    ii.position = newPos;
                    needPopulate = true;
                }
            }

            if (isUpdating) {
                this.mAdapter.finishUpdate(this);
            }

            this.mItems.sort(ViewPager.COMPARATOR);
            //Collections.sort(mItems, COMPARATOR);

            if (needPopulate) {
                // Reset our known page widths; populate will recompute them.
                const childCount = this.getChildCount();
                for (let i = 0; i < childCount; i++) {
                    const child = this.getChildAt(i);
                    const lp = <ViewPager.LayoutParams>child.getLayoutParams();
                    if (!lp.isDecor) {
                        lp.widthFactor = 0;
                    }
                }

                this.setCurrentItemInternal(newCurrItem, false, true);
                this.requestLayout();
            }
        }

        populate(newCurrentItem = this.mCurItem) {
            let oldCurInfo:ItemInfo = null;
            let focusDirection = View.FOCUS_FORWARD;
            if (this.mCurItem != newCurrentItem) {
                focusDirection = this.mCurItem < newCurrentItem ? View.FOCUS_RIGHT : View.FOCUS_LEFT;
                oldCurInfo = this.infoForPosition(this.mCurItem);
                this.mCurItem = newCurrentItem;
            }

            if (this.mAdapter == null) {
                this.sortChildDrawingOrder();
                return;
            }

            // Bail now if we are waiting to populate.  This is to hold off
            // on creating views from the time the user releases their finger to
            // fling to a new position until we have finished the scroll to
            // that position, avoiding glitches from happening at that point.
            if (this.mPopulatePending) {
                if (DEBUG) Log.i(TAG, "populate is pending, skipping for now...");
                this.sortChildDrawingOrder();
                return;
            }

            // Also, don't populate until we are attached to a window.  This is to
            // avoid trying to populate before we have restored our view hierarchy
            // state and conflicting with what is restored.
            if (!this.isAttachedToWindow()) {
                return;
            }

            this.mAdapter.startUpdate(this);

            const pageLimit = this.mOffscreenPageLimit;
            const startPos = Math.max(0, this.mCurItem - pageLimit);
            const N = this.mAdapter.getCount();
            const endPos = Math.min(N-1, this.mCurItem + pageLimit);

            if (N != this.mExpectedAdapterCount) {
                throw new Error("The application's PagerAdapter changed the adapter's" +
                    " contents without calling PagerAdapter#notifyDataSetChanged!" +
                    " Expected adapter item count: " + this.mExpectedAdapterCount + ", found: " + N +
                    " Pager id: " + this.getId() +
                    " Pager class: " + this.constructor.name +
                    " Problematic adapter: " + this.mAdapter.constructor.name);
            }

            // Locate the currently focused item or add it if needed.
            let curIndex = -1;
            let curItem:ItemInfo = null;
            for (curIndex = 0; curIndex < this.mItems.size(); curIndex++) {
                const ii = this.mItems.get(curIndex);
                if (ii.position >= this.mCurItem) {
                    if (ii.position == this.mCurItem) curItem = ii;
                    break;
                }
            }

            if (curItem == null && N > 0) {
                curItem = this.addNewItem(this.mCurItem, curIndex);
            }

            // Fill 3x the available width or up to the number of offscreen
            // pages requested to either side, whichever is larger.
            // If we have no current item we have no work to do.
            if (curItem != null) {
                let extraWidthLeft = 0;
                let itemIndex = curIndex - 1;
                let ii = itemIndex >= 0 ? this.mItems.get(itemIndex) : null;
                const clientWidth = this.getClientWidth();
                const leftWidthNeeded = clientWidth <= 0 ? 0 :
                    2 - curItem.widthFactor + this.getPaddingLeft() / clientWidth;
                for (let pos = this.mCurItem - 1; pos >= 0; pos--) {
                    if (extraWidthLeft >= leftWidthNeeded && pos < startPos) {
                        if (ii == null) {
                            break;
                        }
                        if (pos == ii.position && !ii.scrolling) {
                            this.mItems.remove(itemIndex);
                            this.mAdapter.destroyItem(this, pos, ii.object);
                            if (DEBUG) {
                                Log.i(TAG, "populate() - destroyItem() with pos: " + pos +
                                    " view: " + (<View>ii.object));
                            }
                            itemIndex--;
                            curIndex--;
                            ii = itemIndex >= 0 ? this.mItems.get(itemIndex) : null;
                        }
                    } else if (ii != null && pos == ii.position) {
                        extraWidthLeft += ii.widthFactor;
                        itemIndex--;
                        ii = itemIndex >= 0 ? this.mItems.get(itemIndex) : null;
                    } else {
                        ii = this.addNewItem(pos, itemIndex + 1);
                        extraWidthLeft += ii.widthFactor;
                        curIndex++;
                        ii = itemIndex >= 0 ? this.mItems.get(itemIndex) : null;
                    }
                }

                let extraWidthRight = curItem.widthFactor;
                itemIndex = curIndex + 1;
                if (extraWidthRight < 2) {
                    ii = itemIndex < this.mItems.size() ? this.mItems.get(itemIndex) : null;
                    const rightWidthNeeded = clientWidth <= 0 ? 0 :
                    this.getPaddingRight() / clientWidth + 2;
                    for (let pos = this.mCurItem + 1; pos < N; pos++) {
                        if (extraWidthRight >= rightWidthNeeded && pos > endPos) {
                            if (ii == null) {
                                break;
                            }
                            if (pos == ii.position && !ii.scrolling) {
                                this.mItems.remove(itemIndex);
                                this.mAdapter.destroyItem(this, pos, ii.object);
                                if (DEBUG) {
                                    Log.i(TAG, "populate() - destroyItem() with pos: " + pos +
                                        " view: " + (<View>ii.object));
                                }
                                ii = itemIndex < this.mItems.size() ? this.mItems.get(itemIndex) : null;
                            }
                        } else if (ii != null && pos == ii.position) {
                            extraWidthRight += ii.widthFactor;
                            itemIndex++;
                            ii = itemIndex < this.mItems.size() ? this.mItems.get(itemIndex) : null;
                        } else {
                            ii = this.addNewItem(pos, itemIndex);
                            itemIndex++;
                            extraWidthRight += ii.widthFactor;
                            ii = itemIndex < this.mItems.size() ? this.mItems.get(itemIndex) : null;
                        }
                    }
                }

                this.calculatePageOffsets(curItem, curIndex, oldCurInfo);
            }

            if (DEBUG) {
                Log.i(TAG, "Current page list:");
                for (let i=0; i<this.mItems.size(); i++) {
                    Log.i(TAG, "#" + i + ": page " + this.mItems.get(i).position);
                }
            }

            this.mAdapter.setPrimaryItem(this, this.mCurItem, curItem != null ? curItem.object : null);

            this.mAdapter.finishUpdate(this);

            // Check width measurement of current pages and drawing sort order.
            // Update LayoutParams as needed.
            const childCount = this.getChildCount();
            for (let i = 0; i < childCount; i++) {
                const child = this.getChildAt(i);
                const lp = <ViewPager.LayoutParams>child.getLayoutParams();
                lp.childIndex = i;
                if (!lp.isDecor && lp.widthFactor == 0) {
                    // 0 means requery the adapter for this, it doesn't have a valid width.
                    const ii = this.infoForChild(child);
                    if (ii != null) {
                        lp.widthFactor = ii.widthFactor;
                        lp.position = ii.position;
                    }
                }
            }
            this.sortChildDrawingOrder();

            if (this.hasFocus()) {
                let currentFocused = this.findFocus();
                let ii = currentFocused != null ? this.infoForAnyChild(currentFocused) : null;
                if (ii == null || ii.position != this.mCurItem) {
                    for (let i=0; i<this.getChildCount(); i++) {
                        let child = this.getChildAt(i);
                        ii = this.infoForChild(child);
                        if (ii != null && ii.position == this.mCurItem) {
                            if (child.requestFocus(focusDirection)) {
                                break;
                            }
                        }
                    }
                }
            }
        }

        private sortChildDrawingOrder() {
            if (this.mDrawingOrder != ViewPager.DRAW_ORDER_DEFAULT) {
                if (this.mDrawingOrderedChildren == null) {
                    this.mDrawingOrderedChildren = new ArrayList<View>();
                } else {
                    this.mDrawingOrderedChildren.clear();
                }
                const childCount = this.getChildCount();
                for (let i = 0; i < childCount; i++) {
                    const child = this.getChildAt(i);
                    this.mDrawingOrderedChildren.add(child);
                }
                this.mDrawingOrderedChildren.sort(ViewPager.sPositionComparator);
                //Collections.sort(mDrawingOrderedChildren, sPositionComparator);
            }
        }

        private calculatePageOffsets(curItem:ItemInfo, curIndex:number, oldCurInfo:ItemInfo) {
            const N = this.mAdapter.getCount();
            const width = this.getClientWidth();
            const marginOffset = width > 0 ? this.mPageMargin / width : 0;
            // Fix up offsets for later layout.
            if (oldCurInfo != null) {
                const oldCurPosition = oldCurInfo.position;
                // Base offsets off of oldCurInfo.
                if (oldCurPosition < curItem.position) {
                    let itemIndex = 0;
                    let ii:ItemInfo = null;
                    let offset = oldCurInfo.offset + oldCurInfo.widthFactor + marginOffset;
                    for (let pos = oldCurPosition + 1; pos <= curItem.position && itemIndex < this.mItems.size(); pos++) {
                        ii = this.mItems.get(itemIndex);
                        while (pos > ii.position && itemIndex < this.mItems.size() - 1) {
                            itemIndex++;
                            ii = this.mItems.get(itemIndex);
                        }
                        while (pos < ii.position) {
                            // We don't have an item populated for this,
                            // ask the adapter for an offset.
                            offset += this.mAdapter.getPageWidth(pos) + marginOffset;
                            pos++;
                        }
                        ii.offset = offset;
                        offset += ii.widthFactor + marginOffset;
                    }
                } else if (oldCurPosition > curItem.position) {
                    let itemIndex = this.mItems.size() - 1;
                    let ii:ItemInfo = null;
                    let offset = oldCurInfo.offset;
                    for (let pos = oldCurPosition - 1; pos >= curItem.position && itemIndex >= 0; pos--) {
                        ii = this.mItems.get(itemIndex);
                        while (pos < ii.position && itemIndex > 0) {
                            itemIndex--;
                            ii = this.mItems.get(itemIndex);
                        }
                        while (pos > ii.position) {
                            // We don't have an item populated for this,
                            // ask the adapter for an offset.
                            offset -= this.mAdapter.getPageWidth(pos) + marginOffset;
                            pos--;
                        }
                        offset -= ii.widthFactor + marginOffset;
                        ii.offset = offset;
                    }
                }
            }

            // Base all offsets off of curItem.
            const itemCount = this.mItems.size();
            let offset = curItem.offset;
            let pos = curItem.position - 1;
            this.mFirstOffset = curItem.position == 0 ? curItem.offset : -Number.MAX_VALUE;
            this.mLastOffset = curItem.position == N - 1 ?
            curItem.offset + curItem.widthFactor - 1 : Number.MAX_VALUE;
            // Previous pages
            for (let i = curIndex - 1; i >= 0; i--, pos--) {
                const ii = this.mItems.get(i);
                while (pos > ii.position) {
                    offset -= this.mAdapter.getPageWidth(pos--) + marginOffset;
                }
                offset -= ii.widthFactor + marginOffset;
                ii.offset = offset;
                if (ii.position == 0) this.mFirstOffset = offset;
            }
            offset = curItem.offset + curItem.widthFactor + marginOffset;
            pos = curItem.position + 1;
            // Next pages
            for (let i = curIndex + 1; i < itemCount; i++, pos++) {
                const ii = this.mItems.get(i);
                while (pos < ii.position) {
                    offset += this.mAdapter.getPageWidth(pos++) + marginOffset;
                }
                if (ii.position == N - 1) {
                    this.mLastOffset = offset + ii.widthFactor - 1;
                }
                ii.offset = offset;
                offset += ii.widthFactor + marginOffset;
            }

            this.mNeedCalculatePageOffsets = false;
        }

        addView(view: View): any;
        addView(view: View, index: number): any;
        addView(view: View, params: ViewGroup.LayoutParams): any;
        addView(view: View, index: number, params: ViewGroup.LayoutParams): any;
        addView(view: View, width: number, height: number): any;
        addView(...args: any[]){
            if(args.length===3 && args[2] instanceof ViewGroup.LayoutParams){
                this._addViewOverride(args[0], args[1], args[2]);
            }else{
                super.addView(...args);
            }
        }
        private _addViewOverride(child: View, index: number, params: ViewGroup.LayoutParams): any{
            if (!this.checkLayoutParams(params)) {
                params = this.generateLayoutParams(params);
            }
            const lp = <ViewPager.LayoutParams>params;
            lp.isDecor = lp.isDecor || ViewPager.isImplDecor(child);
            if (this.mInLayout) {
                if (lp != null && lp.isDecor) {
                    throw new Error("Cannot add pager decor view during layout");
                }
                lp.needsMeasure = true;
                this.addViewInLayout(child, index, params);
            } else {
                super.addView(child, index, params);
            }

            if (ViewPager.USE_CACHE) {
                if (child.getVisibility() != View.GONE) {
                    child.setDrawingCacheEnabled(this.mScrollingCacheEnabled);
                } else {
                    child.setDrawingCacheEnabled(false);
                }
            }
        }

        removeView(view:android.view.View):void {
            if (this.mInLayout) {
                this.removeViewInLayout(view);
            } else {
                super.removeView(view);
            }
        }

        private infoForChild(child:View):ItemInfo {
            for (let i=0; i<this.mItems.size(); i++) {
                let ii = this.mItems.get(i);
                if (this.mAdapter.isViewFromObject(child, ii.object)) {
                    return ii;
                }
            }
            return null;
        }

        private infoForAnyChild(child:View):ItemInfo {
            let parent;
            while ((parent=child.getParent()) != this) {
                if (parent == null || !(parent instanceof View)) {
                    return null;
                }
                child = <View>parent;
            }
            return this.infoForChild(child);
        }

        private infoForPosition(position:number):ItemInfo {
            for (let i = 0; i < this.mItems.size(); i++) {
                let ii = this.mItems.get(i);
                if (ii.position == position) {
                    return ii;
                }
            }
            return null;
        }

        protected onAttachedToWindow():void {
            super.onAttachedToWindow();
            this.mFirstLayout = true;
        }

        protected onMeasure(widthMeasureSpec, heightMeasureSpec):void {
            // For simple implementation, our internal size is always 0.
            // We depend on the container to specify the layout size of
            // our view.  We can't really know what it is since we will be
            // adding and removing different arbitrary views and do not
            // want the layout to change as this happens.
            this.setMeasuredDimension(ViewPager.getDefaultSize(0, widthMeasureSpec),
                ViewPager.getDefaultSize(0, heightMeasureSpec));

            const measuredWidth = this.getMeasuredWidth();
            const maxGutterSize = measuredWidth / 10;
            this.mGutterSize = Math.min(maxGutterSize, this.mDefaultGutterSize);

            // Children are just made to fill our space.
            let childWidthSize = measuredWidth - this.getPaddingLeft() - this.getPaddingRight();
            let childHeightSize = this.getMeasuredHeight() - this.getPaddingTop() - this.getPaddingBottom();

            /*
             * Make sure all children have been properly measured. Decor views first.
             * Right now we cheat and make this less complicated by assuming decor
             * views won't intersect. We will pin to edges based on gravity.
             */
            let size = this.getChildCount();
            for (let i = 0; i < size; ++i) {
                const child = this.getChildAt(i);
                if (child.getVisibility() != View.GONE) {
                    const lp = <ViewPager.LayoutParams>child.getLayoutParams();
                    if (lp != null && lp.isDecor) {
                        const hgrav = lp.gravity & Gravity.HORIZONTAL_GRAVITY_MASK;
                        const vgrav = lp.gravity & Gravity.VERTICAL_GRAVITY_MASK;
                        let widthMode = MeasureSpec.AT_MOST;
                        let heightMode = MeasureSpec.AT_MOST;
                        let consumeVertical = vgrav == Gravity.TOP || vgrav == Gravity.BOTTOM;
                        let consumeHorizontal = hgrav == Gravity.LEFT || hgrav == Gravity.RIGHT;

                        if (consumeVertical) {
                            widthMode = MeasureSpec.EXACTLY;
                        } else if (consumeHorizontal) {
                            heightMode = MeasureSpec.EXACTLY;
                        }

                        let widthSize = childWidthSize;
                        let heightSize = childHeightSize;
                        if (lp.width != ViewPager.LayoutParams.WRAP_CONTENT) {
                            widthMode = MeasureSpec.EXACTLY;
                            if (lp.width != ViewPager.LayoutParams.FILL_PARENT) {
                                widthSize = lp.width;
                            }
                        }
                        if (lp.height != ViewPager.LayoutParams.WRAP_CONTENT) {
                            heightMode = MeasureSpec.EXACTLY;
                            if (lp.height != ViewPager.LayoutParams.FILL_PARENT) {
                                heightSize = lp.height;
                            }
                        }
                        const widthSpec = MeasureSpec.makeMeasureSpec(widthSize, widthMode);
                        const heightSpec = MeasureSpec.makeMeasureSpec(heightSize, heightMode);
                        child.measure(widthSpec, heightSpec);

                        if (consumeVertical) {
                            childHeightSize -= child.getMeasuredHeight();
                        } else if (consumeHorizontal) {
                            childWidthSize -= child.getMeasuredWidth();
                        }
                    }
                }
            }

            this.mChildWidthMeasureSpec = MeasureSpec.makeMeasureSpec(childWidthSize, MeasureSpec.EXACTLY);
            this.mChildHeightMeasureSpec = MeasureSpec.makeMeasureSpec(childHeightSize, MeasureSpec.EXACTLY);

            // Make sure we have created all fragments that we need to have shown.
            this.mInLayout = true;
            this.populate();
            this.mInLayout = false;

            // Page views next.
            size = this.getChildCount();
            for (let i = 0; i < size; ++i) {
                const child = this.getChildAt(i);
                if (child.getVisibility() != View.GONE) {
                    if (DEBUG) Log.v(TAG, "Measuring #" + i + " " + child
                        + ": " + this.mChildWidthMeasureSpec);

                    const lp = <ViewPager.LayoutParams>child.getLayoutParams();
                    if (lp == null || !lp.isDecor) {
                        const widthSpec = MeasureSpec.makeMeasureSpec((childWidthSize * lp.widthFactor), MeasureSpec.EXACTLY);
                        child.measure(widthSpec, this.mChildHeightMeasureSpec);
                    }
                }
            }
        }

        protected onSizeChanged(w:number, h:number, oldw:number, oldh:number):void {
            super.onSizeChanged(w, h, oldw, oldh);
            // Make sure scroll position is set correctly.
            if (w != oldw) {
                this.recomputeScrollPosition(w, oldw, this.mPageMargin, this.mPageMargin);
            }
        }

        private recomputeScrollPosition(width:number, oldWidth:number, margin:number, oldMargin:number):void {
            if (oldWidth > 0 && !this.mItems.isEmpty()) {
                const widthWithMargin = width - this.getPaddingLeft() - this.getPaddingRight() + margin;
                const oldWidthWithMargin = oldWidth - this.getPaddingLeft() - this.getPaddingRight()
                    + oldMargin;
                const xpos = this.getScrollX();
                const pageOffset = xpos / oldWidthWithMargin;
                const newOffsetPixels = Math.floor(pageOffset * widthWithMargin);

                this.scrollTo(newOffsetPixels, this.getScrollY());
                if (!this.mScroller.isFinished()) {
                    // We now return to your regularly scheduled scroll, already in progress.
                    const newDuration = this.mScroller.getDuration() - this.mScroller.timePassed();
                    let targetInfo = this.infoForPosition(this.mCurItem);
                    this.mScroller.startScroll(newOffsetPixels, 0, Math.floor(targetInfo.offset * width), 0, newDuration);
                }
            } else {
                const ii = this.infoForPosition(this.mCurItem);
                const scrollOffset = ii != null ? Math.min(ii.offset, this.mLastOffset) : 0;
                const scrollPos = Math.floor(scrollOffset *
                    (width - this.getPaddingLeft() - this.getPaddingRight()));
                if (scrollPos != this.getScrollX()) {
                    this.completeScroll(false);
                    this.scrollTo(scrollPos, this.getScrollY());
                }
            }
        }

        protected onLayout(changed:boolean, l:number, t:number, r:number, b:number):void {
            const count = this.getChildCount();
            let width = r - l;
            let height = b - t;
            let paddingLeft = this.getPaddingLeft();
            let paddingTop = this.getPaddingTop();
            let paddingRight = this.getPaddingRight();
            let paddingBottom = this.getPaddingBottom();
            const scrollX = this.getScrollX();

            let decorCount = 0;

            // First pass - decor views. We need to do this in two passes so that
            // we have the proper offsets for non-decor views later.
            for (let i = 0; i < count; i++) {
                const child = this.getChildAt(i);
                if (child.getVisibility() != View.GONE) {
                    const lp = <ViewPager.LayoutParams>child.getLayoutParams();
                    let childLeft = 0;
                    let childTop = 0;
                    if (lp.isDecor) {
                        const hgrav = lp.gravity & Gravity.HORIZONTAL_GRAVITY_MASK;
                        const vgrav = lp.gravity & Gravity.VERTICAL_GRAVITY_MASK;
                        switch (hgrav) {
                            default:
                                childLeft = paddingLeft;
                                break;
                            case Gravity.LEFT:
                                childLeft = paddingLeft;
                                paddingLeft += child.getMeasuredWidth();
                                break;
                            case Gravity.CENTER_HORIZONTAL:
                                childLeft = Math.max((width - child.getMeasuredWidth()) / 2,
                                    paddingLeft);
                                break;
                            case Gravity.RIGHT:
                                childLeft = width - paddingRight - child.getMeasuredWidth();
                                paddingRight += child.getMeasuredWidth();
                                break;
                        }
                        switch (vgrav) {
                            default:
                                childTop = paddingTop;
                                break;
                            case Gravity.TOP:
                                childTop = paddingTop;
                                paddingTop += child.getMeasuredHeight();
                                break;
                            case Gravity.CENTER_VERTICAL:
                                childTop = Math.max((height - child.getMeasuredHeight()) / 2,
                                    paddingTop);
                                break;
                            case Gravity.BOTTOM:
                                childTop = height - paddingBottom - child.getMeasuredHeight();
                                paddingBottom += child.getMeasuredHeight();
                                break;
                        }
                        childLeft += scrollX;
                        child.layout(childLeft, childTop,
                            childLeft + child.getMeasuredWidth(),
                            childTop + child.getMeasuredHeight());
                        decorCount++;
                    }
                }
            }

            const childWidth = width - paddingLeft - paddingRight;
            // Page views. Do this once we have the right padding offsets from above.
            for (let i = 0; i < count; i++) {
                const child = this.getChildAt(i);
                if (child.getVisibility() != View.GONE) {
                    const lp = <ViewPager.LayoutParams>child.getLayoutParams();
                    let ii;
                    if (!lp.isDecor && (ii = this.infoForChild(child)) != null) {
                        let loff = Math.floor(childWidth * ii.offset);
                        let childLeft = paddingLeft + loff;
                        let childTop = paddingTop;
                        if (lp.needsMeasure) {
                            // This was added during layout and needs measurement.
                            // Do it now that we know what we're working with.
                            lp.needsMeasure = false;
                            const widthSpec = MeasureSpec.makeMeasureSpec(
                                Math.floor(childWidth * lp.widthFactor),
                                MeasureSpec.EXACTLY);
                            const heightSpec = MeasureSpec.makeMeasureSpec(
                                Math.floor(height - paddingTop - paddingBottom),
                                MeasureSpec.EXACTLY);
                            child.measure(widthSpec, heightSpec);
                        }
                        if (DEBUG) Log.v(TAG, "Positioning #" + i + " " + child + " f=" + ii.object
                            + ":" + childLeft + "," + childTop + " " + child.getMeasuredWidth()
                            + "x" + child.getMeasuredHeight());
                        child.layout(childLeft, childTop,
                            childLeft + child.getMeasuredWidth(),
                            childTop + child.getMeasuredHeight());
                    }
                }
            }
            this.mTopPageBounds = paddingTop;
            this.mBottomPageBounds = height - paddingBottom;
            this.mDecorChildCount = decorCount;

            if (this.mFirstLayout) {
                this.scrollToItem(this.mCurItem, false, 0, false);
            }
            this.mFirstLayout = false;
        }

        computeScroll() {
            if (!this.mScroller.isFinished() && this.mScroller.computeScrollOffset()) {
                let oldX = this.getScrollX();
                let oldY = this.getScrollY();
                let x = this.mScroller.getCurrX();
                let y = this.mScroller.getCurrY();

                if (oldX != x || oldY != y) {
                    this.scrollTo(x, y);
                    if (!this.pageScrolled(x)) {
                        this.mScroller.abortAnimation();
                        this.scrollTo(0, y);
                    }
                }

                // Keep on drawing until the animation has finished.
                this.postInvalidateOnAnimation();
                return;
            }

            // Done with scroll, clean up state.
            this.completeScroll(true);
        }

        private pageScrolled(xpos:number):boolean {
            if (this.mItems.size() == 0) {
                this.mCalledSuper = false;
                this.onPageScrolled(0, 0, 0);
                if (!this.mCalledSuper) {
                    throw new Error(
                        "onPageScrolled did not call superclass implementation");
                }
                return false;
            }
            const ii = this.infoForCurrentScrollPosition();
            const width = this.getClientWidth();
            const widthWithMargin = width + this.mPageMargin;
            const marginOffset = this.mPageMargin / width;
            const currentPage = ii.position;
            const pageOffset = ((xpos / width) - ii.offset) / (ii.widthFactor + marginOffset);
            const offsetPixels = Math.floor(pageOffset * widthWithMargin);

            this.mCalledSuper = false;
            this.onPageScrolled(currentPage, pageOffset, offsetPixels);
            if (!this.mCalledSuper) {
                throw new Error(
                    "onPageScrolled did not call superclass implementation");
            }
            return true;
        }


        /**
         * This method will be invoked when the current page is scrolled, either as part
         * of a programmatically initiated smooth scroll or a user initiated touch scroll.
         * If you override this method you must call through to the superclass implementation
         * (e.g. super.onPageScrolled(position, offset, offsetPixels)) before onPageScrolled
         * returns.
         *
         * @param position Position index of the first page currently being displayed.
         *                 Page position+1 will be visible if positionOffset is nonzero.
         * @param offset Value from [0, 1) indicating the offset from the page at position.
         * @param offsetPixels Value in pixels indicating the offset from position.
         */
        onPageScrolled(position:number, offset:number, offsetPixels:number):void {
            // Offset any decor views if needed - keep them on-screen at all times.
            if (this.mDecorChildCount > 0) {
                const scrollX = this.getScrollX();
                let paddingLeft = this.getPaddingLeft();
                let paddingRight = this.getPaddingRight();
                const width = this.getWidth();
                const childCount = this.getChildCount();
                for (let i = 0; i < childCount; i++) {
                    const child = this.getChildAt(i);
                    const lp = <ViewPager.LayoutParams>child.getLayoutParams();
                    if (!lp.isDecor) continue;

                    const hgrav = lp.gravity & Gravity.HORIZONTAL_GRAVITY_MASK;
                    let childLeft = 0;
                    switch (hgrav) {
                        default:
                            childLeft = paddingLeft;
                            break;
                        case Gravity.LEFT:
                            childLeft = paddingLeft;
                            paddingLeft += child.getWidth();
                            break;
                        case Gravity.CENTER_HORIZONTAL:
                            childLeft = Math.max((width - child.getMeasuredWidth()) / 2,
                                paddingLeft);
                            break;
                        case Gravity.RIGHT:
                            childLeft = width - paddingRight - child.getMeasuredWidth();
                            paddingRight += child.getMeasuredWidth();
                            break;
                    }
                    childLeft += scrollX;

                    const childOffset = childLeft - child.getLeft();
                    if (childOffset != 0) {
                        child.offsetLeftAndRight(childOffset);
                    }
                }
            }

            this.dispatchOnPageScrolled(position, offset, offsetPixels);

            if (this.mPageTransformer != null) {
                const scrollX = this.getScrollX();
                const childCount = this.getChildCount();
                for (let i = 0; i < childCount; i++) {
                    const child = this.getChildAt(i);
                    const lp = <ViewPager.LayoutParams>child.getLayoutParams();

                    if (lp.isDecor) continue;

                    const transformPos = (child.getLeft() - scrollX) / this.getClientWidth();
                    this.mPageTransformer.transformPage(child, transformPos);
                }
            }

            this.mCalledSuper = true;
        }

        private dispatchOnPageScrolled(position:number, offset:number, offsetPixels:number) {
            if (this.mOnPageChangeListener != null) {
                this.mOnPageChangeListener.onPageScrolled(position, offset, offsetPixels);
            }
            if (this.mOnPageChangeListeners != null) {
                for (let i = 0, z = this.mOnPageChangeListeners.size(); i < z; i++) {
                    let listener = this.mOnPageChangeListeners.get(i);
                    if (listener != null) {
                        listener.onPageScrolled(position, offset, offsetPixels);
                    }
                }
            }
            if (this.mInternalPageChangeListener != null) {
                this.mInternalPageChangeListener.onPageScrolled(position, offset, offsetPixels);
            }
        }

        private dispatchOnPageSelected(position:number):void {
            if (this.mOnPageChangeListener != null) {
                this.mOnPageChangeListener.onPageSelected(position);
            }
            if (this.mOnPageChangeListeners != null) {
                for (let i = 0, z = this.mOnPageChangeListeners.size(); i < z; i++) {
                    let listener = this.mOnPageChangeListeners.get(i);
                    if (listener != null) {
                        listener.onPageSelected(position);
                    }
                }
            }
            if (this.mInternalPageChangeListener != null) {
                this.mInternalPageChangeListener.onPageSelected(position);
            }
        }

        private dispatchOnScrollStateChanged(state:number):void {
            if (this.mOnPageChangeListener != null) {
                this.mOnPageChangeListener.onPageScrollStateChanged(state);
            }
            if (this.mOnPageChangeListeners != null) {
                for (let i = 0, z = this.mOnPageChangeListeners.size(); i < z; i++) {
                    let listener = this.mOnPageChangeListeners.get(i);
                    if (listener != null) {
                        listener.onPageScrollStateChanged(state);
                    }
                }
            }
            if (this.mInternalPageChangeListener != null) {
                this.mInternalPageChangeListener.onPageScrollStateChanged(state);
            }
        }

        private completeScroll(postEvents:boolean) {
            let needPopulate = this.mScrollState == ViewPager.SCROLL_STATE_SETTLING;
            if (needPopulate) {
                // Done with scroll, no longer want to cache view drawing.
                this.setScrollingCacheEnabled(false);
                this.mScroller.abortAnimation();
                let oldX = this.getScrollX();
                let oldY = this.getScrollY();
                let x = this.mScroller.getCurrX();
                let y = this.mScroller.getCurrY();
                if (oldX != x || oldY != y) {
                    this.scrollTo(x, y);
                    if (x != oldX) {
                        this.pageScrolled(x);
                    }
                }
            }
            this.mPopulatePending = false;
            for (let i=0; i<this.mItems.size(); i++) {
                let ii = this.mItems.get(i);
                if (ii.scrolling) {
                    needPopulate = true;
                    ii.scrolling = false;
                }
            }
            if (needPopulate) {
                if (postEvents) {
                    this.postOnAnimation(this.mEndScrollRunnable);
                } else {
                    this.mEndScrollRunnable.run();
                }
            }
        }

        private isGutterDrag(x:number, dx:number):boolean {
            return (x < this.mGutterSize && dx > 0) || (x > this.getWidth() - this.mGutterSize && dx < 0);
        }

        private enableLayers(enable:boolean) {
            //nothing
            //const childCount = this.getChildCount();
            //for (let i = 0; i < childCount; i++) {
            //    const layerType = enable ?
            //        View.LAYER_TYPE_HARDWARE : View.LAYER_TYPE_NONE;
            //    this.getChildAt(i).setLayerType(layerType, null);
            //}
        }

        onInterceptTouchEvent(ev:MotionEvent):boolean {
            /*
             * This method JUST determines whether we want to intercept the motion.
             * If we return true, onMotionEvent will be called and we do the actual
             * scrolling there.
             */

            const action = ev.getAction() & MotionEvent.ACTION_MASK;

            // Always take care of the touch gesture being complete.
            if (action == MotionEvent.ACTION_CANCEL || action == MotionEvent.ACTION_UP) {
                // Release the drag.
                if (DEBUG) Log.v(TAG, "Intercept done!");
                this.resetTouch();
                return false;
            }

            // Nothing more to do here if we have decided whether or not we
            // are dragging.
            if (action != MotionEvent.ACTION_DOWN) {
                if (this.mIsBeingDragged) {
                    if (DEBUG) Log.v(TAG, "Intercept returning true!");
                    return true;
                }
                if (this.mIsUnableToDrag) {
                    if (DEBUG) Log.v(TAG, "Intercept returning false!");
                    return false;
                }
            }

            switch (action) {
                case MotionEvent.ACTION_MOVE: {
                    /*
                     * mIsBeingDragged == false, otherwise the shortcut would have caught it. Check
                     * whether the user has moved far enough from his original down touch.
                     */

                    /*
                     * Locally do absolute value. mLastMotionY is set to the y value
                     * of the down event.
                     */
                    const activePointerId = this.mActivePointerId;
                    if (activePointerId == ViewPager.INVALID_POINTER) {
                        // If we don't have a valid id, the touch down wasn't on content.
                        break;
                    }

                    const pointerIndex = ev.findPointerIndex(activePointerId);
                    const x = ev.getX(pointerIndex);
                    const dx = x - this.mLastMotionX;
                    const xDiff = Math.abs(dx);
                    const y = ev.getY(pointerIndex);
                    const yDiff = Math.abs(y - this.mInitialMotionY);
                    if (DEBUG) Log.v(TAG, "Moved x to " + x + "," + y + " diff=" + xDiff + "," + yDiff);

                    if (dx != 0 && !this.isGutterDrag(this.mLastMotionX, dx) &&
                        this.canScroll(this, false, Math.floor(dx), Math.floor(x), Math.floor(y))) {
                        // Nested view has scrollable area under this point. Let it be handled there.
                        this.mLastMotionX = x;
                        this.mLastMotionY = y;
                        this.mIsUnableToDrag = true;
                        return false;
                    }
                    if (xDiff > this.mTouchSlop && xDiff * 0.5 > yDiff) {
                        if (DEBUG) Log.v(TAG, "Starting drag!");
                        this.mIsBeingDragged = true;
                        this.requestParentDisallowInterceptTouchEvent(true);
                        this.setScrollState(ViewPager.SCROLL_STATE_DRAGGING);
                        this.mLastMotionX = dx > 0 ? this.mInitialMotionX + this.mTouchSlop :
                        this.mInitialMotionX - this.mTouchSlop;
                        this.mLastMotionY = y;
                        this.setScrollingCacheEnabled(true);
                    } else if (yDiff > this.mTouchSlop) {
                        // The finger has moved enough in the vertical
                        // direction to be counted as a drag...  abort
                        // any attempt to drag horizontally, to work correctly
                        // with children that have scrolling containers.
                        if (DEBUG) Log.v(TAG, "Starting unable to drag!");
                        this.mIsUnableToDrag = true;
                    }
                    if (this.mIsBeingDragged) {
                        // Scroll to follow the motion event
                        if (this.performDrag(x)) {
                            this.postInvalidateOnAnimation();
                        }
                    }
                    break;
                }

                case MotionEvent.ACTION_DOWN: {
                    /*
                     * Remember location of down touch.
                     * ACTION_DOWN always refers to pointer index 0.
                     */
                    this.mLastMotionX = this.mInitialMotionX = ev.getX();
                    this.mLastMotionY = this.mInitialMotionY = ev.getY();
                    this.mActivePointerId = ev.getPointerId(0);
                    this.mIsUnableToDrag = false;

                    this.mScroller.computeScrollOffset();

                    if (this.mScrollState == ViewPager.SCROLL_STATE_SETTLING &&
                        Math.abs(this.mScroller.getFinalX() - this.mScroller.getCurrX()) > this.mCloseEnough) {
                        // Let the user 'catch' the pager as it animates.
                        this.mScroller.abortAnimation();
                        this.mPopulatePending = false;
                        this.populate();
                        this.mIsBeingDragged = true;
                        this.requestParentDisallowInterceptTouchEvent(true);
                        this.setScrollState(ViewPager.SCROLL_STATE_DRAGGING);
                    } else {
                        this.completeScroll(false);
                        this.mIsBeingDragged = false;
                    }

                    if (DEBUG) Log.v(TAG, "Down at " + this.mLastMotionX + "," + this.mLastMotionY
                        + " mIsBeingDragged=" + this.mIsBeingDragged
                        + "mIsUnableToDrag=" + this.mIsUnableToDrag);
                    break;
                }

                case MotionEvent.ACTION_POINTER_UP:
                    this.onSecondaryPointerUp(ev);
                    break;
            }

            if (this.mVelocityTracker == null) {
                this.mVelocityTracker = VelocityTracker.obtain();
            }
            this.mVelocityTracker.addMovement(ev);

            /*
             * The only time we want to intercept motion events is if we are in the
             * drag mode.
             */
            return this.mIsBeingDragged;
        }


        onTouchEvent(ev:android.view.MotionEvent):boolean {
            if (this.mFakeDragging) {
                // A fake drag is in progress already, ignore this real one
                // but still eat the touch events.
                // (It is likely that the user is multi-touching the screen.)
                return true;
            }

            if (ev.getAction() == MotionEvent.ACTION_DOWN && ev.getEdgeFlags() != 0) {
                // Don't handle edge touches immediately -- they may actually belong to one of our
                // descendants.
                return false;
            }

            if (this.mAdapter == null || this.mAdapter.getCount() == 0) {
                // Nothing to present or scroll; nothing to touch.
                return false;
            }

            if (this.mVelocityTracker == null) {
                this.mVelocityTracker = VelocityTracker.obtain();
            }
            this.mVelocityTracker.addMovement(ev);

            const action = ev.getAction();
            let needsInvalidate = false;

            switch (action & MotionEvent.ACTION_MASK) {
                case MotionEvent.ACTION_DOWN: {
                    this.mScroller.abortAnimation();
                    this.mPopulatePending = false;
                    this.populate();

                    // Remember where the motion event started
                    this.mLastMotionX = this.mInitialMotionX = ev.getX();
                    this.mLastMotionY = this.mInitialMotionY = ev.getY();
                    this.mActivePointerId = ev.getPointerId(0);
                    break;
                }
                case MotionEvent.ACTION_MOVE:
                    if (!this.mIsBeingDragged) {
                        const pointerIndex = ev.findPointerIndex(this.mActivePointerId);
                        if (pointerIndex == -1) {
                            // A child has consumed some touch events and put us into an inconsistent state.
                            needsInvalidate = this.resetTouch();
                            break;
                        }
                        const x = ev.getX(pointerIndex);
                        const xDiff = Math.abs(x - this.mLastMotionX);
                        const y = ev.getY(pointerIndex);
                        const yDiff = Math.abs(y - this.mLastMotionY);
                        if (DEBUG) Log.v(TAG, "Moved x to " + x + "," + y + " diff=" + xDiff + "," + yDiff);
                        if (xDiff > this.mTouchSlop && xDiff > yDiff) {
                            if (DEBUG) Log.v(TAG, "Starting drag!");
                            this.mIsBeingDragged = true;
                            this.requestParentDisallowInterceptTouchEvent(true);
                            this.mLastMotionX = x - this.mInitialMotionX > 0 ? this.mInitialMotionX + this.mTouchSlop :
                            this.mInitialMotionX - this.mTouchSlop;
                            this.mLastMotionY = y;
                            this.setScrollState(ViewPager.SCROLL_STATE_DRAGGING);
                            this.setScrollingCacheEnabled(true);

                            // Disallow Parent Intercept, just in case
                            let parent = this.getParent();
                            if (parent != null) {
                                parent.requestDisallowInterceptTouchEvent(true);
                            }
                        }
                    }
                    // Not else! Note that mIsBeingDragged can be set above.
                    if (this.mIsBeingDragged) {
                        // Scroll to follow the motion event
                        const activePointerIndex = ev.findPointerIndex(this.mActivePointerId);
                        const x = ev.getX(activePointerIndex);
                        needsInvalidate = needsInvalidate || this.performDrag(x);
                    }
                    break;
                case MotionEvent.ACTION_UP:
                    if (this.mIsBeingDragged) {
                        const velocityTracker = this.mVelocityTracker;
                        velocityTracker.computeCurrentVelocity(1000, this.mMaximumVelocity);
                        let initialVelocity = velocityTracker.getXVelocity(this.mActivePointerId);
                        this.mPopulatePending = true;
                        const width = this.getClientWidth();
                        const scrollX = this.getScrollX();
                        const ii = this.infoForCurrentScrollPosition();
                        const currentPage = ii.position;
                        const pageOffset = ((scrollX / width) - ii.offset) / ii.widthFactor;
                        const activePointerIndex = ev.findPointerIndex(this.mActivePointerId);
                        const x = ev.getX(activePointerIndex);
                        const totalDelta = (x - this.mInitialMotionX);
                        let nextPage = this.determineTargetPage(currentPage, pageOffset, initialVelocity,
                            totalDelta);
                        this.setCurrentItemInternal(nextPage, true, true, initialVelocity);

                        needsInvalidate = this.resetTouch();
                    }
                    break;
                case MotionEvent.ACTION_CANCEL:
                    if (this.mIsBeingDragged) {
                        this.scrollToItem(this.mCurItem, true, 0, false);
                        needsInvalidate = this.resetTouch();
                    }
                    break;
                case MotionEvent.ACTION_POINTER_DOWN: {
                    const index = ev.getActionIndex();
                    const x = ev.getX(index);
                    this.mLastMotionX = x;
                    this.mActivePointerId = ev.getPointerId(index);
                    break;
                }
                case MotionEvent.ACTION_POINTER_UP:
                    this.onSecondaryPointerUp(ev);
                    this.mLastMotionX = ev.getX(ev.findPointerIndex(this.mActivePointerId));
                    break;
            }
            if (needsInvalidate) {
                this.postInvalidateOnAnimation();
            }
            return true;
        }
        private resetTouch():boolean {
            let needsInvalidate = false;
            this.mActivePointerId = ViewPager.INVALID_POINTER;
            this.endDrag();
            //needsInvalidate = mLeftEdge.onRelease() | mRightEdge.onRelease();
            return needsInvalidate;
        }
        private requestParentDisallowInterceptTouchEvent(disallowIntercept:boolean){
            const parent = this.getParent();
            if (parent != null) {
                parent.requestDisallowInterceptTouchEvent(disallowIntercept);
            }
        }
        private performDrag(x:number):boolean {
            let needsInvalidate = false;

            const deltaX = this.mLastMotionX - x;
            this.mLastMotionX = x;

            let oldScrollX = this.getScrollX();
            let scrollX = oldScrollX + deltaX;
            const width = this.getClientWidth();

            let leftBound = width * this.mFirstOffset;
            let rightBound = width * this.mLastOffset;
            let leftAbsolute = true;
            let rightAbsolute = true;

            const firstItem = this.mItems.get(0);
            const lastItem = this.mItems.get(this.mItems.size() - 1);
            if (firstItem.position != 0) {
                leftAbsolute = false;
                leftBound = firstItem.offset * width;
            }
            if (lastItem.position != this.mAdapter.getCount() - 1) {
                rightAbsolute = false;
                rightBound = lastItem.offset * width;
            }

            if (scrollX < leftBound) {
                if (leftAbsolute) {
                    let over = leftBound - scrollX;
                    needsInvalidate = false;//this.mLeftEdge.onPull(Math.abs(over) / width);
                }
                scrollX -= deltaX/2;//leftBound;
            } else if (scrollX > rightBound) {
                if (rightAbsolute) {
                    let over = scrollX - rightBound;
                    needsInvalidate = false;//this.mRightEdge.onPull(Math.abs(over) / width);
                }
                scrollX -= deltaX/2;//rightBound;
            }
            // Don't lose the rounded component
            this.mLastMotionX += scrollX - Math.floor(scrollX);
            this.scrollTo(scrollX, this.getScrollY());
            this.pageScrolled(scrollX);

            return needsInvalidate;
        }

        private infoForCurrentScrollPosition():ItemInfo {
            const width = this.getClientWidth();
            const scrollOffset = width > 0 ? this.getScrollX() / width : 0;
            const marginOffset = width > 0 ? this.mPageMargin / width : 0;
            let lastPos = -1;
            let lastOffset = 0;
            let lastWidth = 0;
            let first = true;

            let lastItem = null;
            for (let i = 0; i < this.mItems.size(); i++) {
                let ii = this.mItems.get(i);
                let offset;
                if (!first && ii.position != lastPos + 1) {
                    // Create a synthetic item for a missing page.
                    ii = this.mTempItem;
                    ii.offset = lastOffset + lastWidth + marginOffset;
                    ii.position = lastPos + 1;
                    ii.widthFactor = this.mAdapter.getPageWidth(ii.position);
                    i--;
                }
                offset = ii.offset;

                const leftBound = offset;
                const rightBound = offset + ii.widthFactor + marginOffset;
                if (first || scrollOffset >= leftBound) {
                    if (scrollOffset < rightBound || i == this.mItems.size() - 1) {
                        return ii;
                    }
                } else {
                    return lastItem;
                }
                first = false;
                lastPos = ii.position;
                lastOffset = offset;
                lastWidth = ii.widthFactor;
                lastItem = ii;
            }

            return lastItem;
        }

        private determineTargetPage(currentPage:number, pageOffset:number, velocity:number, deltaX:number):number {
            let targetPage;
            if (Math.abs(deltaX) > this.mFlingDistance && Math.abs(velocity) > this.mMinimumVelocity) {
                targetPage = velocity > 0 ? currentPage : currentPage + 1;
            } else {
                const truncator = currentPage >= this.mCurItem ? 0.4 : 0.6;
                targetPage = Math.floor(currentPage + pageOffset + truncator);
            }

            if (this.mItems.size() > 0) {
                const firstItem = this.mItems.get(0);
                const lastItem = this.mItems.get(this.mItems.size() - 1);

                // Only let the user target pages we have items for
                targetPage = Math.max(firstItem.position, Math.min(targetPage, lastItem.position));
            }

            return targetPage;
        }


        draw(canvas:android.graphics.Canvas):void {
            super.draw(canvas);
            let needsInvalidate = false;

            //no need draw overscroll Edge
            //const overScrollMode = this.getOverScrollMode();
            //if (overScrollMode == View.OVER_SCROLL_ALWAYS ||
            //    (overScrollMode == View.OVER_SCROLL_IF_CONTENT_SCROLLS &&
            //    this.mAdapter != null && this.mAdapter.getCount() > 1)) {
            //    if (!mLeftEdge.isFinished()) {
            //        const restoreCount = canvas.save();
            //        const height = getHeight() - getPaddingTop() - getPaddingBottom();
            //        const width = getWidth();
            //
            //        canvas.rotate(270);
            //        canvas.translate(-height + getPaddingTop(), mFirstOffset * width);
            //        mLeftEdge.setSize(height, width);
            //        needsInvalidate |= mLeftEdge.draw(canvas);
            //        canvas.restoreToCount(restoreCount);
            //    }
            //    if (!mRightEdge.isFinished()) {
            //        const restoreCount = canvas.save();
            //        const width = getWidth();
            //        const height = getHeight() - getPaddingTop() - getPaddingBottom();
            //
            //        canvas.rotate(90);
            //        canvas.translate(-getPaddingTop(), -(mLastOffset + 1) * width);
            //        mRightEdge.setSize(height, width);
            //        needsInvalidate |= mRightEdge.draw(canvas);
            //        canvas.restoreToCount(restoreCount);
            //    }
            //} else {
            //    mLeftEdge.finish();
            //    mRightEdge.finish();
            //}

            if (needsInvalidate) {
                // Keep animating
                this.postInvalidateOnAnimation();
            }
        }


        protected onDraw(canvas:android.graphics.Canvas) {
            super.onDraw(canvas);

            // Draw the margin drawable between pages if needed.
            if (this.mPageMargin > 0 && this.mMarginDrawable != null && this.mItems.size() > 0 && this.mAdapter != null) {
                const scrollX = this.getScrollX();
                const width = this.getWidth();

                const marginOffset = this.mPageMargin / width;
                let itemIndex = 0;
                let ii = this.mItems.get(0);
                let offset = ii.offset;
                const itemCount = this.mItems.size();
                const firstPos = ii.position;
                const lastPos = this.mItems.get(itemCount - 1).position;
                for (let pos = firstPos; pos < lastPos; pos++) {
                    while (pos > ii.position && itemIndex < itemCount) {
                        ii = this.mItems.get(++itemIndex);
                    }

                    let drawAt;
                    if (pos == ii.position) {
                        drawAt = (ii.offset + ii.widthFactor) * width;
                        offset = ii.offset + ii.widthFactor + marginOffset;
                    } else {
                        let widthFactor = this.mAdapter.getPageWidth(pos);
                        drawAt = (offset + widthFactor) * width;
                        offset += widthFactor + marginOffset;
                    }

                    if (drawAt + this.mPageMargin > scrollX) {
                        this.mMarginDrawable.setBounds(drawAt, this.mTopPageBounds,
                            drawAt + this.mPageMargin, this.mBottomPageBounds);
                        this.mMarginDrawable.draw(canvas);
                    }

                    if (drawAt > scrollX + width) {
                        break; // No more visible, no sense in continuing
                    }
                }
            }
        }


        /**
         * Start a fake drag of the pager.
         *
         * <p>A fake drag can be useful if you want to synchronize the motion of the ViewPager
         * with the touch scrolling of another view, while still letting the ViewPager
         * control the snapping motion and fling behavior. (e.g. parallax-scrolling tabs.)
         * Call {@link #fakeDragBy(float)} to simulate the actual drag motion. Call
         * {@link #endFakeDrag()} to complete the fake drag and fling as necessary.
         *
         * <p>During a fake drag the ViewPager will ignore all touch events. If a real drag
         * is already in progress, this method will return false.
         *
         * @return true if the fake drag began successfully, false if it could not be started.
         *
         * @see #fakeDragBy(float)
         * @see #endFakeDrag()
         */
        beginFakeDrag():boolean {
            if (this.mIsBeingDragged) {
                return false;
            }
            this.mFakeDragging = true;
            this.setScrollState(ViewPager.SCROLL_STATE_DRAGGING);
            this.mInitialMotionX = this.mLastMotionX = 0;
            if (this.mVelocityTracker == null) {
                this.mVelocityTracker = VelocityTracker.obtain();
            } else {
                this.mVelocityTracker.clear();
            }
            const time = android.os.SystemClock.uptimeMillis();
            const ev = MotionEvent.obtainWithAction(time, time, MotionEvent.ACTION_DOWN, 0, 0, 0);
            this.mVelocityTracker.addMovement(ev);
            ev.recycle();
            this.mFakeDragBeginTime = time;
            return true;
        }


        /**
         * End a fake drag of the pager.
         *
         * @see #beginFakeDrag()
         * @see #fakeDragBy(float)
         */
        endFakeDrag():void {
            if (!this.mFakeDragging) {
                throw new Error("No fake drag in progress. Call beginFakeDrag first.");
            }

            const velocityTracker = this.mVelocityTracker;
            velocityTracker.computeCurrentVelocity(1000, this.mMaximumVelocity);
            let initialVelocity = Math.floor(velocityTracker.getXVelocity(this.mActivePointerId));
            this.mPopulatePending = true;
            const width = this.getClientWidth();
            const scrollX = this.getScrollX();
            const ii = this.infoForCurrentScrollPosition();
            const currentPage = ii.position;
            const pageOffset = ((scrollX / width) - ii.offset) / ii.widthFactor;
            const totalDelta = Math.floor(this.mLastMotionX - this.mInitialMotionX);
            let nextPage = this.determineTargetPage(currentPage, pageOffset, initialVelocity,
                totalDelta);
            this.setCurrentItemInternal(nextPage, true, true, initialVelocity);
            this.endDrag();

            this.mFakeDragging = false;
        }


        /**
         * Fake drag by an offset in pixels. You must have called {@link #beginFakeDrag()} first.
         *
         * @param xOffset Offset in pixels to drag by.
         * @see #beginFakeDrag()
         * @see #endFakeDrag()
         */
        fakeDragBy(xOffset:number):void {
            if (!this.mFakeDragging) {
                throw new Error("No fake drag in progress. Call beginFakeDrag first.");
            }

            this.mLastMotionX += xOffset;

            let oldScrollX = this.getScrollX();
            let scrollX = oldScrollX - xOffset;
            const width = this.getClientWidth();

            let leftBound = width * this.mFirstOffset;
            let rightBound = width * this.mLastOffset;

            const firstItem = this.mItems.get(0);
            const lastItem = this.mItems.get(this.mItems.size() - 1);
            if (firstItem.position != 0) {
                leftBound = firstItem.offset * width;
            }
            if (lastItem.position != this.mAdapter.getCount() - 1) {
                rightBound = lastItem.offset * width;
            }

            if (scrollX < leftBound) {
                scrollX = leftBound;
            } else if (scrollX > rightBound) {
                scrollX = rightBound;
            }
            // Don't lose the rounded component
            this.mLastMotionX += scrollX - Math.floor(scrollX);
            this.scrollTo(Math.floor(scrollX), this.getScrollY());
            this.pageScrolled(Math.floor(scrollX));

            // Synthesize an event for the VelocityTracker.
            const time = android.os.SystemClock.uptimeMillis();
            const ev = MotionEvent.obtainWithAction(this.mFakeDragBeginTime, time, MotionEvent.ACTION_MOVE,
                this.mLastMotionX, 0, 0);
            this.mVelocityTracker.addMovement(ev);
            ev.recycle();
        }


        /**
         * Returns true if a fake drag is in progress.
         *
         * @return true if currently in a fake drag, false otherwise.
         *
         * @see #beginFakeDrag()
         * @see #fakeDragBy(float)
         * @see #endFakeDrag()
         */
        isFakeDragging():boolean {
            return this.mFakeDragging;
        }

        private onSecondaryPointerUp(ev:MotionEvent) {
            const pointerIndex = ev.getActionIndex();
            const pointerId = ev.getPointerId(pointerIndex);
            if (pointerId == this.mActivePointerId) {
                // This was our active pointer going up. Choose a new
                // active pointer and adjust accordingly.
                const newPointerIndex = pointerIndex == 0 ? 1 : 0;
                this.mLastMotionX = ev.getX(newPointerIndex);
                this.mActivePointerId = ev.getPointerId(newPointerIndex);
                if (this.mVelocityTracker != null) {
                    this.mVelocityTracker.clear();
                }
            }
        }
        private endDrag() {
            this.mIsBeingDragged = false;
            this.mIsUnableToDrag = false;

            if (this.mVelocityTracker != null) {
                this.mVelocityTracker.recycle();
                this.mVelocityTracker = null;
            }
        }

        private setScrollingCacheEnabled(enabled:boolean) {
            if (this.mScrollingCacheEnabled != enabled) {
                this.mScrollingCacheEnabled = enabled;
                if (ViewPager.USE_CACHE) {
                    const size = this.getChildCount();
                    for (let i = 0; i < size; ++i) {
                        const child = this.getChildAt(i);
                        if (child.getVisibility() != View.GONE) {
                            child.setDrawingCacheEnabled(enabled);
                        }
                    }
                }
            }
        }


        canScrollHorizontally(direction:number):boolean {
            if (this.mAdapter == null) {
                return false;
            }

            const width = this.getClientWidth();
            const scrollX = this.getScrollX();
            if (direction < 0) {
                return (scrollX > (width * this.mFirstOffset));
            } else if (direction > 0) {
                return (scrollX < (width * this.mLastOffset));
            } else {
                return false;
            }
        }


        /**
         * Tests scrollability within child views of v given a delta of dx.
         *
         * @param v View to test for horizontal scrollability
         * @param checkV Whether the view v passed should itself be checked for scrollability (true),
         *               or just its children (false).
         * @param dx Delta scrolled in pixels
         * @param x X coordinate of the active touch point
         * @param y Y coordinate of the active touch point
         * @return true if child views of v can be scrolled by delta of dx.
         */
        canScroll(v:View, checkV:boolean, dx:number, x:number, y:number):boolean {
            if (v instanceof ViewGroup) {
                const group = <ViewGroup>v;
                const scrollX = v.getScrollX();
                const scrollY = v.getScrollY();
                const count = group.getChildCount();
                // Count backwards - let topmost views consume scroll distance first.
                for (let i = count - 1; i >= 0; i--) {
                    // TODO: Add versioned support here for transformed views.
                    // This will not work for transformed views in Honeycomb+
                    const child = group.getChildAt(i);
                    if (x + scrollX >= child.getLeft() && x + scrollX < child.getRight() &&
                        y + scrollY >= child.getTop() && y + scrollY < child.getBottom() &&
                        this.canScroll(child, true, dx, x + scrollX - child.getLeft(),
                            y + scrollY - child.getTop())) {
                        return true;
                    }
                }
            }

            return checkV && v.canScrollHorizontally(-dx);
        }


        dispatchKeyEvent(event:android.view.KeyEvent):boolean {
            // Let the focused view and/or our descendants get the key first
            return super.dispatchKeyEvent(event) || this.executeKeyEvent(event);
        }


        /**
         * You can call this function yourself to have the scroll view perform
         * scrolling from a key event, just as if the event had been dispatched to
         * it by the view hierarchy.
         *
         * @param event The key event to execute.
         * @return Return true if the event was handled, else false.
         */
        executeKeyEvent(event:KeyEvent):boolean {
            let handled = false;
            if (event.getAction() == KeyEvent.ACTION_DOWN) {
                switch (event.getKeyCode()) {
                    case KeyEvent.KEYCODE_DPAD_LEFT:
                        handled = this.arrowScroll(View.FOCUS_LEFT);
                        break;
                    case KeyEvent.KEYCODE_DPAD_RIGHT:
                        handled = this.arrowScroll(View.FOCUS_RIGHT);
                        break;
                    case KeyEvent.KEYCODE_TAB:
                        // The focus finder had a bug handling FOCUS_FORWARD and FOCUS_BACKWARD
                        // before Android 3.0. Ignore the tab key on those devices.
                        if (event.isShiftPressed()) {
                            handled = this.arrowScroll(View.FOCUS_BACKWARD);
                        }else{
                            handled = this.arrowScroll(View.FOCUS_FORWARD);
                        }
                        break;
                }
            }
            return handled;
        }

        arrowScroll(direction:number):boolean {
            let currentFocused = this.findFocus();
            if (currentFocused == this) {
                currentFocused = null;
            } else if (currentFocused != null) {
                let isChild = false;
                for (let parent = currentFocused.getParent(); parent instanceof ViewGroup; parent = parent.getParent()) {
                    if (parent == this) {
                        isChild = true;
                        break;
                    }
                }
                if (!isChild) {
                    // This would cause the focus search down below to fail in fun ways.
                    const sb = new java.lang.StringBuilder();
                    sb.append(currentFocused.toString());
                    for (let parent = currentFocused.getParent(); parent instanceof ViewGroup; parent = parent.getParent()) {
                        sb.append(" => ").append(parent.toString());
                    }
                    Log.e(TAG, "arrowScroll tried to find focus based on non-child " +
                        "current focused view " + sb.toString());
                    currentFocused = null;
                }
            }

            let handled = false;

            let nextFocused = android.view.FocusFinder.getInstance().findNextFocus(this, currentFocused, direction);
            if (nextFocused != null && nextFocused != currentFocused) {
                if (direction == View.FOCUS_LEFT) {
                    // If there is nothing to the left, or this is causing us to
                    // jump to the right, then what we really want to do is page left.
                    const nextLeft = this.getChildRectInPagerCoordinates(this.mTempRect, nextFocused).left;
                    const currLeft = this.getChildRectInPagerCoordinates(this.mTempRect, currentFocused).left;
                    if (currentFocused != null && nextLeft >= currLeft) {
                        handled = this.pageLeft();
                    } else {
                        handled = nextFocused.requestFocus();
                    }
                } else if (direction == View.FOCUS_RIGHT) {
                    // If there is nothing to the right, or this is causing us to
                    // jump to the left, then what we really want to do is page right.
                    const nextLeft = this.getChildRectInPagerCoordinates(this.mTempRect, nextFocused).left;
                    const currLeft = this.getChildRectInPagerCoordinates(this.mTempRect, currentFocused).left;
                    if (currentFocused != null && nextLeft <= currLeft) {
                        handled = this.pageRight();
                    } else {
                        handled = nextFocused.requestFocus();
                    }
                }
            } else if (direction == View.FOCUS_LEFT || direction == View.FOCUS_BACKWARD) {
                // Trying to move left and nothing there; try to page.
                handled = this.pageLeft();
            } else if (direction == View.FOCUS_RIGHT || direction == View.FOCUS_FORWARD) {
                // Trying to move right and nothing there; try to page.
                handled = this.pageRight();
            }
            //if (handled) {
            //    playSoundEffect(SoundEffectConstants.getContantForFocusDirection(direction));
            //}
            return handled;
        }
        private getChildRectInPagerCoordinates(outRect:Rect, child:View):Rect {
            if (outRect == null) {
                outRect = new Rect();
            }
            if (child == null) {
                outRect.set(0, 0, 0, 0);
                return outRect;
            }
            outRect.left = child.getLeft();
            outRect.right = child.getRight();
            outRect.top = child.getTop();
            outRect.bottom = child.getBottom();

            let parent = child.getParent();
            while (parent instanceof ViewGroup && parent != this) {
                const group = <ViewGroup>parent;
                outRect.left += group.getLeft();
                outRect.right += group.getRight();
                outRect.top += group.getTop();
                outRect.bottom += group.getBottom();

                parent = group.getParent();
            }
            return outRect;
        }
        pageLeft():boolean {
            if (this.mCurItem > 0) {
                this.setCurrentItem(this.mCurItem-1, true);
                return true;
            }
            return false;
        }
        pageRight():boolean {
            if (this.mAdapter != null && this.mCurItem < (this.mAdapter.getCount()-1)) {
                this.setCurrentItem(this.mCurItem+1, true);
                return true;
            }
            return false;
        }


        addFocusables(views:ArrayList<View>, direction:number, focusableMode:number):void {
            const focusableCount = views.size();

            const descendantFocusability = this.getDescendantFocusability();

            if (descendantFocusability != ViewGroup.FOCUS_BLOCK_DESCENDANTS) {
                for (let i = 0; i < this.getChildCount(); i++) {
                    const child = this.getChildAt(i);
                    if (child.getVisibility() == View.VISIBLE) {
                        let ii = this.infoForChild(child);
                        if (ii != null && ii.position == this.mCurItem) {
                            child.addFocusables(views, direction, focusableMode);
                        }
                    }
                }
            }

            // we add ourselves (if focusable) in all cases except for when we are
            // FOCUS_AFTER_DESCENDANTS and there are some descendants focusable.  this is
            // to avoid the focus search finding layouts when a more precise search
            // among the focusable children would be more interesting.
            if (
                descendantFocusability != ViewGroup.FOCUS_AFTER_DESCENDANTS ||
                    // No focusable descendants
                (focusableCount == views.size())) {
                // Note that we can't call the superclass here, because it will
                // add all views in.  So we need to do the same thing View does.
                if (!this.isFocusable()) {
                    return;
                }
                if ((focusableMode & ViewGroup.FOCUSABLES_TOUCH_MODE) == ViewGroup.FOCUSABLES_TOUCH_MODE &&
                    this.isInTouchMode() && !this.isFocusableInTouchMode()) {
                    return;
                }
                if (views != null) {
                    views.add(this);
                }
            }
        }

        /**
         * We only want the current page that is being shown to be touchable.
         */
        addTouchables(views:java.util.ArrayList<android.view.View>):void {
            // Note that we don't call super.addTouchables(), which means that
            // we don't call View.addTouchables().  This is okay because a ViewPager
            // is itself not touchable.
            for (let i = 0; i < this.getChildCount(); i++) {
                const child = this.getChildAt(i);
                if (child.getVisibility() == View.VISIBLE) {
                    let ii = this.infoForChild(child);
                    if (ii != null && ii.position == this.mCurItem) {
                        child.addTouchables(views);
                    }
                }
            }
        }

        protected onRequestFocusInDescendants(direction:number, previouslyFocusedRect:Rect):boolean {
            let index;
            let increment;
            let end;
            let count = this.getChildCount();
            if ((direction & View.FOCUS_FORWARD) != 0) {
                index = 0;
                increment = 1;
                end = count;
            } else {
                index = count - 1;
                increment = -1;
                end = -1;
            }
            for (let i = index; i != end; i += increment) {
                let child = this.getChildAt(i);
                if (child.getVisibility() == View.VISIBLE) {
                    let ii = this.infoForChild(child);
                    if (ii != null && ii.position == this.mCurItem) {
                        if (child.requestFocus(direction, previouslyFocusedRect)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }


        protected generateDefaultLayoutParams():android.view.ViewGroup.LayoutParams {
            return new ViewPager.LayoutParams();
        }


        protected generateLayoutParams(p:android.view.ViewGroup.LayoutParams):android.view.ViewGroup.LayoutParams {
            return this.generateDefaultLayoutParams();
        }

        protected checkLayoutParams(p:android.view.ViewGroup.LayoutParams):boolean {
            return p instanceof ViewPager.LayoutParams && super.checkLayoutParams(p);
        }

        public generateLayoutParamsFromAttr(attrs: HTMLElement): android.view.ViewGroup.LayoutParams {
            return new ViewPager.LayoutParams(this.getContext(), attrs);
        }

        private static isImplDecor(view:View):boolean {
            return view[SymbolDecor] || view.constructor[SymbolDecor];
        }
        static setClassImplDecor(clazz:Function){
            clazz[SymbolDecor] = true;
        }
    }

    export module ViewPager {

        import AttrBinder = androidui.attr.AttrBinder;
        /**
         * Callback interface for responding to changing state of the selected page.
         */
        export interface OnPageChangeListener {

            /**
             * This method will be invoked when the current page is scrolled, either as part
             * of a programmatically initiated smooth scroll or a user initiated touch scroll.

             * @param position Position index of the first page currently being displayed.
             * *                 Page position+1 will be visible if positionOffset is nonzero.
             * *
             * @param positionOffset Value from [0, 1) indicating the offset from the page at position.
             * *
             * @param positionOffsetPixels Value in pixels indicating the offset from position.
             */
            onPageScrolled(position:number, positionOffset:number, positionOffsetPixels:number):void;

            /**
             * This method will be invoked when a new page becomes selected. Animation is not
             * necessarily complete.

             * @param position Position index of the new selected page.
             */
            onPageSelected(position:number):void;

            /**
             * Called when the scroll state changes. Useful for discovering when the user
             * begins dragging, when the pager is automatically settling to the current page,
             * or when it is fully stopped/idle.

             * @param state The new scroll state.
             * *
             * @see ViewPager.SCROLL_STATE_IDLE

             * @see ViewPager.SCROLL_STATE_DRAGGING

             * @see ViewPager.SCROLL_STATE_SETTLING
             */
            onPageScrollStateChanged(state:number):void;
        }

        /**
         * Simple implementation of the [OnPageChangeListener] interface with stub
         * implementations of each method. Extend this if you do not intend to override
         * every method of [OnPageChangeListener].
         */
        export class SimpleOnPageChangeListener implements OnPageChangeListener {
            onPageScrolled(position:number, positionOffset:number, positionOffsetPixels:number) {
                // This space for rent
            }

            onPageSelected(position:number) {
                // This space for rent
            }

            onPageScrollStateChanged(state:number) {
                // This space for rent
            }
        }


        /**
         * A PageTransformer is invoked whenever a visible/attached page is scrolled.
         * This offers an opportunity for the application to apply a custom transformation
         * to the page views using animation properties.

         *
         * As property animation is only supported as of Android 3.0 and forward,
         * setting a PageTransformer on a ViewPager on earlier platform versions will
         * be ignored.
         */
        export interface PageTransformer {
            /**
             * Apply a property transformation to the given page.

             * @param page Apply the transformation to this page
             * *
             * @param position Position of page relative to the current front-and-center
             * *                 position of the pager. 0 is front and center. 1 is one full
             * *                 page position to the right, and -1 is one page position to the left.
             */
            transformPage(page:View, position:number):void;
        }


        /**
         * Used internally to monitor when adapters are switched.
         */
        export interface OnAdapterChangeListener {
            onAdapterChanged(oldAdapter:PagerAdapter, newAdapter:PagerAdapter):void;
        }




        /**
         * Layout parameters that should be supplied for views added to a
         * ViewPager.
         */
        export class LayoutParams extends ViewGroup.LayoutParams{
            /**
             * true if this view is a decoration on the pager itself and not
             * a view supplied by the adapter.
             */
            isDecor = false;

            /**
             * Gravity setting for use on decor views only:
             * Where to position the view page within the overall ViewPager
             * container; constants are defined in {@link android.view.Gravity}.
             */
            gravity = 0;

            /**
             * Width as a 0-1 multiplier of the measured pager width
             */
            widthFactor = 0;

            /**
             * true if this view was added during layout and needs to be measured
             * before being positioned.
             */
            needsMeasure = false;

            /**
             * Adapter position this view is for if !isDecor
             */
            position = 0;

            /**
             * Current child index within the ViewPager that this view occupies
             */
            childIndex = 0;

            constructor();
            constructor(context:android.content.Context, attrs:HTMLElement);
            constructor(...args) {
                super(...(() => {
                    if (args[0] instanceof android.content.Context && args[1] instanceof HTMLElement) return [args[0], args[1]];
                    else if (args.length === 0)  return [ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT];
                })());
                if (args[0] instanceof android.content.Context && args[1] instanceof HTMLElement) {
                    const c = <android.content.Context>args[0];
                    const attrs = <HTMLElement>args[1];
                    const a = c.obtainStyledAttributes(attrs);
                    this.gravity = Gravity.parseGravity(a.getAttrValue('layout_gravity'), Gravity.TOP);
                    a.recycle();
                } else if (args.length === 0) {
                }
            }

            protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
                return super.createClassAttrBinder().set('layout_gravity', {
                    setter(param:LayoutParams, value:any, attrBinder:AttrBinder) {
                        param.gravity = attrBinder.parseGravity(value, param.gravity);
                    }, getter(param:LayoutParams) {
                        return param.gravity;
                    }
                });
            }
        }
    }

    class ItemInfo {
        object:any;
        position = 0;
        scrolling = false;
        widthFactor = 0;
        offset = 0;
    }

    class PagerObserver extends DataSetObserver {
        ViewPager_this:ViewPager;

        constructor(viewPager:ViewPager) {
            super();
            this.ViewPager_this = viewPager;
        }

        onChanged() {
            this.ViewPager_this.dataSetChanged();
        }

        onInvalidated() {
            this.ViewPager_this.dataSetChanged();
        }
    }
}
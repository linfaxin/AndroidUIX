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
///<reference path="../../android/graphics/Paint.ts"/>
///<reference path="../../android/graphics/PixelFormat.ts"/>
///<reference path="../../android/graphics/Rect.ts"/>
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/util/MathUtils.ts"/>
///<reference path="../../android/util/SparseBooleanArray.ts"/>
///<reference path="../../android/view/FocusFinder.ts"/>
///<reference path="../../android/view/KeyEvent.ts"/>
///<reference path="../../android/view/SoundEffectConstants.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/view/ViewParent.ts"/>
///<reference path="../../android/view/ViewRootImpl.ts"/>
///<reference path="../../android/os/Trace.ts"/>
///<reference path="../../java/util/ArrayList.ts"/>
///<reference path="../../java/lang/Integer.ts"/>
///<reference path="../../java/lang/System.ts"/>
///<reference path="../../java/lang/Runnable.ts"/>
///<reference path="../../android/widget/AbsListView.ts"/>
///<reference path="../../android/widget/Adapter.ts"/>
///<reference path="../../android/widget/AdapterView.ts"/>
///<reference path="../../android/widget/Checkable.ts"/>
///<reference path="../../android/widget/HeaderViewListAdapter.ts"/>
///<reference path="../../android/widget/ListAdapter.ts"/>
///<reference path="../../android/widget/WrapperListAdapter.ts"/>
///<reference path="../../android/widget/BaseAdapter.ts"/>
///<reference path="../../android/R/attr.ts"/>

module android.widget {
import Canvas = android.graphics.Canvas;
import Paint = android.graphics.Paint;
import PixelFormat = android.graphics.PixelFormat;
import Rect = android.graphics.Rect;
import Drawable = android.graphics.drawable.Drawable;
import MathUtils = android.util.MathUtils;
import SparseBooleanArray = android.util.SparseBooleanArray;
import FocusFinder = android.view.FocusFinder;
import KeyEvent = android.view.KeyEvent;
import SoundEffectConstants = android.view.SoundEffectConstants;
import View = android.view.View;
import ViewGroup = android.view.ViewGroup;
import ViewParent = android.view.ViewParent;
import ViewRootImpl = android.view.ViewRootImpl;
import Trace = android.os.Trace;
import ArrayList = java.util.ArrayList;
import Integer = java.lang.Integer;
import System = java.lang.System;
import Runnable = java.lang.Runnable;
import AbsListView = android.widget.AbsListView;
import Adapter = android.widget.Adapter;
import AdapterView = android.widget.AdapterView;
import Checkable = android.widget.Checkable;
import HeaderViewListAdapter = android.widget.HeaderViewListAdapter;
import ListAdapter = android.widget.ListAdapter;
import WrapperListAdapter = android.widget.WrapperListAdapter;
    import AttrBinder = androidui.attr.AttrBinder;
/**
 * A view that shows items in a vertically scrolling list. The items
 * come from the {@link ListAdapter} associated with this view.
 *
 * <p>See the <a href="{@docRoot}guide/topics/ui/layout/listview.html">List View</a>
 * guide.</p>
 *
 * @attr ref android.R.styleable#ListView_entries
 * @attr ref android.R.styleable#ListView_divider
 * @attr ref android.R.styleable#ListView_dividerHeight
 * @attr ref android.R.styleable#ListView_headerDividersEnabled
 * @attr ref android.R.styleable#ListView_footerDividersEnabled
 */
export class ListView extends AbsListView {

    /**
     * Used to indicate a no preference for a position type.
     */
    static NO_POSITION:number = -1;

    /**
     * When arrow scrolling, ListView will never scroll more than this factor
     * times the height of the list.
     */
    private static MAX_SCROLL_FACTOR:number = 0.33;

    /**
     * When arrow scrolling, need a certain amount of pixels to preview next
     * items.  This is usually the fading edge, but if that is small enough,
     * we want to make sure we preview at least this many pixels.
     */
    private static MIN_SCROLL_PREVIEW_PIXELS:number = 2;



    private mHeaderViewInfos:ArrayList<ListView.FixedViewInfo> = new ArrayList<ListView.FixedViewInfo>();

    private mFooterViewInfos:ArrayList<ListView.FixedViewInfo> = new ArrayList<ListView.FixedViewInfo>();

    mDivider:Drawable;

    mDividerHeight:number = 0;

    mOverScrollHeader:Drawable;

    mOverScrollFooter:Drawable;

    private mIsCacheColorOpaque:boolean = false;

    private mDividerIsOpaque:boolean = false;

    private mHeaderDividersEnabled:boolean = true;

    private mFooterDividersEnabled:boolean = true;

    private mAreAllItemsSelectable:boolean = true;

    private mItemsCanFocus:boolean = false;

    // used for temporary calculations.
    private mTempRect:Rect = new Rect();

    private mDividerPaint:Paint;

    // the single allocated result per list view; kinda cheesey but avoids
    // allocating these thingies too often.
    private mArrowScrollFocusResult:ListView.ArrowScrollFocusResult = new ListView.ArrowScrollFocusResult();

    // Keeps focused children visible through resizes
    private mFocusSelector:ListView.FocusSelector;

    constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle=android.R.attr.listViewStyle) {
        super(context, bindElement, defStyle);
        let a = context.obtainStyledAttributes(bindElement, defStyle);
        // let entries = a.getTextArray('entries');
        // if (entries != null) {
        //     this.setAdapter(new ArrayAdapter<string>(context, R.layout.simple_list_item_1, entries));
        // }
        const d: Drawable = a.getDrawable('divider');
        if (d != null) {
            // If a divider is specified use its intrinsic height for divider height
            this.setDivider(d);
        }
        const osHeader: Drawable = a.getDrawable('overScrollHeader');
        if (osHeader != null) {
            this.setOverscrollHeader(osHeader);
        }
        const osFooter: Drawable = a.getDrawable('overScrollFooter');
        if (osFooter != null) {
            this.setOverscrollFooter(osFooter);
        }
        // Use the height specified, zero being the default
        const dividerHeight: number = a.getDimensionPixelSize('dividerHeight', 0);
        if (dividerHeight != 0) {
            this.setDividerHeight(dividerHeight);
        }
        this.mHeaderDividersEnabled = a.getBoolean('headerDividersEnabled', true);
        this.mFooterDividersEnabled = a.getBoolean('footerDividersEnabled', true);
        a.recycle();
    }

    protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
        return super.createClassAttrBinder().set('divider', {
            setter(v:ListView, value:any, attrBinder:AttrBinder) {
                let divider = attrBinder.parseDrawable(value);
                if(divider) v.setDivider(divider);
            }, getter(v:ListView) {
                return v.mDivider;
            }
        }).set('overScrollHeader', {
            setter(v:ListView, value:any, attrBinder:AttrBinder) {
                let header = attrBinder.parseDrawable(value);
                if(header) v.setOverscrollHeader(header);
            }, getter(v:ListView) {
                return v.getOverscrollHeader();
            }
        }).set('overScrollFooter', {
            setter(v:ListView, value:any, attrBinder:AttrBinder) {
                let footer = attrBinder.parseDrawable(value);
                if(footer) v.setOverscrollFooter(footer);
            }, getter(v:ListView) {
                return v.getOverscrollFooter();
            }
        }).set('dividerHeight', {
            setter(v:ListView, value:any, attrBinder:AttrBinder) {
                v.setDividerHeight(attrBinder.parseNumberPixelSize(value, v.getDividerHeight()));
            }, getter(v:ListView) {
                return v.getDividerHeight();
            }
        }).set('headerDividersEnabled', {
            setter(v:ListView, value:any, attrBinder:AttrBinder) {
                v.setHeaderDividersEnabled(attrBinder.parseBoolean(value, v.mHeaderDividersEnabled));
            }, getter(v:ListView) {
                return v.mHeaderDividersEnabled;
            }
        }).set('dividerHeight', {
            setter(v:ListView, value:any, attrBinder:AttrBinder) {
                v.setFooterDividersEnabled(attrBinder.parseBoolean(value, v.mFooterDividersEnabled));
            }, getter(v:ListView) {
                return v.mFooterDividersEnabled;
            }
        });
    }

    /**
     * @return The maximum amount a list view will scroll in response to
     *   an arrow event.
     */
    getMaxScrollAmount():number  {
        return Math.floor((ListView.MAX_SCROLL_FACTOR * (this.mBottom - this.mTop)));
    }

    /**
     * Make sure views are touching the top or bottom edge, as appropriate for
     * our gravity
     */
    private adjustViewsUpOrDown():void  {
        const childCount:number = this.getChildCount();
        let delta:number;
        if (childCount > 0) {
            let child:View;
            if (!this.mStackFromBottom) {
                // Uh-oh -- we came up short. Slide all views up to make them
                // align with the top
                child = this.getChildAt(0);
                delta = child.getTop() - this.mListPadding.top;
                if (this.mFirstPosition != 0) {
                    // It's OK to have some space above the first item if it is
                    // part of the vertical spacing
                    delta -= this.mDividerHeight;
                }
                if (delta < 0) {
                    // We only are looking to see if we are too low, not too high
                    delta = 0;
                }
            } else {
                // we are too high, slide all views down to align with bottom
                child = this.getChildAt(childCount - 1);
                delta = child.getBottom() - (this.getHeight() - this.mListPadding.bottom);
                if (this.mFirstPosition + childCount < this.mItemCount) {
                    // It's OK to have some space below the last item if it is
                    // part of the vertical spacing
                    delta += this.mDividerHeight;
                }
                if (delta > 0) {
                    delta = 0;
                }
            }
            if (delta != 0) {
                this.offsetChildrenTopAndBottom(-delta);
            }
        }
    }

    /**
     * Add a fixed view to appear at the top of the list. If this method is
     * called more than once, the views will appear in the order they were
     * added. Views added using this call can take focus if they want.
     * <p>
     * Note: When first introduced, this method could only be called before
     * setting the adapter with {@link #setAdapter(ListAdapter)}. Starting with
     * {@link android.os.Build.VERSION_CODES#KITKAT}, this method may be
     * called at any time. If the ListView's adapter does not extend
     * {@link HeaderViewListAdapter}, it will be wrapped with a supporting
     * instance of {@link WrapperListAdapter}.
     *
     * @param v The view to add.
     * @param data Data to associate with this view
     * @param isSelectable whether the item is selectable
     */
    addHeaderView(v:View, data:any=null, isSelectable:boolean=true):void  {
        const info:ListView.FixedViewInfo = new ListView.FixedViewInfo(this);
        info.view = v;
        info.data = data;
        info.isSelectable = isSelectable;
        this.mHeaderViewInfos.add(info);
        // Wrap the adapter if it wasn't already wrapped.
        if (this.mAdapter != null) {
            if (!(this.mAdapter instanceof HeaderViewListAdapter)) {
                this.mAdapter = new HeaderViewListAdapter(this.mHeaderViewInfos, this.mFooterViewInfos, this.mAdapter);
            }
            // we need to notify the observer.
            if (this.mDataSetObserver != null) {
                this.mDataSetObserver.onChanged();
            }
        }
    }

    getHeaderViewsCount():number  {
        return this.mHeaderViewInfos.size();
    }

    /**
     * Removes a previously-added header view.
     *
     * @param v The view to remove
     * @return true if the view was removed, false if the view was not a header
     *         view
     */
    removeHeaderView(v:View):boolean  {
        if (this.mHeaderViewInfos.size() > 0) {
            let result:boolean = false;
            if (this.mAdapter != null && (<HeaderViewListAdapter> this.mAdapter).removeHeader(v)) {
                if (this.mDataSetObserver != null) {
                    this.mDataSetObserver.onChanged();
                }
                result = true;
            }
            this.removeFixedViewInfo(v, this.mHeaderViewInfos);
            return result;
        }
        return false;
    }

    private removeFixedViewInfo(v:View, where:ArrayList<ListView.FixedViewInfo>):void  {
        let len:number = where.size();
        for (let i:number = 0; i < len; ++i) {
            let info:ListView.FixedViewInfo = where.get(i);
            if (info.view == v) {
                where.remove(i);
                break;
            }
        }
    }

    /**
     * Add a fixed view to appear at the bottom of the list. If addFooterView is
     * called more than once, the views will appear in the order they were
     * added. Views added using this call can take focus if they want.
     * <p>
     * Note: When first introduced, this method could only be called before
     * setting the adapter with {@link #setAdapter(ListAdapter)}. Starting with
     * {@link android.os.Build.VERSION_CODES#KITKAT}, this method may be
     * called at any time. If the ListView's adapter does not extend
     * {@link HeaderViewListAdapter}, it will be wrapped with a supporting
     * instance of {@link WrapperListAdapter}.
     *
     * @param v The view to add.
     * @param data Data to associate with this view
     * @param isSelectable true if the footer view can be selected
     */
    addFooterView(v:View, data:any=null, isSelectable:boolean=true):void  {
        const info:ListView.FixedViewInfo = new ListView.FixedViewInfo(this);
        info.view = v;
        info.data = data;
        info.isSelectable = isSelectable;
        this.mFooterViewInfos.add(info);
        // Wrap the adapter if it wasn't already wrapped.
        if (this.mAdapter != null) {
            if (!(this.mAdapter instanceof HeaderViewListAdapter)) {
                this.mAdapter = new HeaderViewListAdapter(this.mHeaderViewInfos, this.mFooterViewInfos, this.mAdapter);
            }
            // we need to notify the observer.
            if (this.mDataSetObserver != null) {
                this.mDataSetObserver.onChanged();
            }
        }
    }

    getFooterViewsCount():number  {
        return this.mFooterViewInfos.size();
    }

    /**
     * Removes a previously-added footer view.
     *
     * @param v The view to remove
     * @return
     * true if the view was removed, false if the view was not a footer view
     */
    removeFooterView(v:View):boolean  {
        if (this.mFooterViewInfos.size() > 0) {
            let result:boolean = false;
            if (this.mAdapter != null && (<HeaderViewListAdapter> this.mAdapter).removeFooter(v)) {
                if (this.mDataSetObserver != null) {
                    this.mDataSetObserver.onChanged();
                }
                result = true;
            }
            this.removeFixedViewInfo(v, this.mFooterViewInfos);
            return result;
        }
        return false;
    }

    /**
     * Returns the adapter currently in use in this ListView. The returned adapter
     * might not be the same adapter passed to {@link #setAdapter(ListAdapter)} but
     * might be a {@link WrapperListAdapter}.
     *
     * @return The adapter currently used to display data in this ListView.
     *
     * @see #setAdapter(ListAdapter)
     */
    getAdapter():ListAdapter  {
        return this.mAdapter;
    }

    /**
     * Sets the data behind this ListView.
     *
     * The adapter passed to this method may be wrapped by a {@link WrapperListAdapter},
     * depending on the ListView features currently in use. For instance, adding
     * headers and/or footers will cause the adapter to be wrapped.
     *
     * @param adapter The ListAdapter which is responsible for maintaining the
     *        data backing this list and for producing a view to represent an
     *        item in that data set.
     *
     * @see #getAdapter() 
     */
    setAdapter(adapter:ListAdapter):void  {
        if (this.mAdapter != null && this.mDataSetObserver != null) {
            this.mAdapter.unregisterDataSetObserver(this.mDataSetObserver);
        }
        this.resetList();
        this.mRecycler.clear();
        if (this.mHeaderViewInfos.size() > 0 || this.mFooterViewInfos.size() > 0) {
            this.mAdapter = new HeaderViewListAdapter(this.mHeaderViewInfos, this.mFooterViewInfos, adapter);
        } else {
            this.mAdapter = adapter;
        }
        this.mOldSelectedPosition = ListView.INVALID_POSITION;
        this.mOldSelectedRowId = ListView.INVALID_ROW_ID;
        // AbsListView#setAdapter will update choice mode states.
        super.setAdapter(adapter);
        if (this.mAdapter != null) {
            this.mAreAllItemsSelectable = this.mAdapter.areAllItemsEnabled();
            this.mOldItemCount = this.mItemCount;
            this.mItemCount = this.mAdapter.getCount();
            this.checkFocus();
            this.mDataSetObserver = new AbsListView.AdapterDataSetObserver(this);
            this.mAdapter.registerDataSetObserver(this.mDataSetObserver);
            this.mRecycler.setViewTypeCount(this.mAdapter.getViewTypeCount());
            let position:number;
            if (this.mStackFromBottom) {
                position = this.lookForSelectablePosition(this.mItemCount - 1, false);
            } else {
                position = this.lookForSelectablePosition(0, true);
            }
            this.setSelectedPositionInt(position);
            this.setNextSelectedPositionInt(position);
            if (this.mItemCount == 0) {
                // Nothing selected
                this.checkSelectionChanged();
            }
        } else {
            this.mAreAllItemsSelectable = true;
            this.checkFocus();
            // Nothing selected
            this.checkSelectionChanged();
        }
        this.requestLayout();
    }

    /**
     * The list is empty. Clear everything out.
     */
    resetList():void  {
        // The parent's resetList() will remove all views from the layout so we need to
        // cleanup the state of our footers and headers
        this.clearRecycledState(this.mHeaderViewInfos);
        this.clearRecycledState(this.mFooterViewInfos);
        super.resetList();
        this.mLayoutMode = ListView.LAYOUT_NORMAL;
    }

    private clearRecycledState(infos:ArrayList<ListView.FixedViewInfo>):void  {
        if (infos != null) {
            const count:number = infos.size();
            for (let i:number = 0; i < count; i++) {
                const child:View = infos.get(i).view;
                const p:AbsListView.LayoutParams = <AbsListView.LayoutParams> child.getLayoutParams();
                if (p != null) {
                    p.recycledHeaderFooter = false;
                }
            }
        }
    }

    /**
     * @return Whether the list needs to show the top fading edge
     */
    private showingTopFadingEdge():boolean  {
        const listTop:number = this.mScrollY + this.mListPadding.top;
        return (this.mFirstPosition > 0) || (this.getChildAt(0).getTop() > listTop);
    }

    /**
     * @return Whether the list needs to show the bottom fading edge
     */
    private showingBottomFadingEdge():boolean  {
        const childCount:number = this.getChildCount();
        const bottomOfBottomChild:number = this.getChildAt(childCount - 1).getBottom();
        const lastVisiblePosition:number = this.mFirstPosition + childCount - 1;
        const listBottom:number = this.mScrollY + this.getHeight() - this.mListPadding.bottom;
        return (lastVisiblePosition < this.mItemCount - 1) || (bottomOfBottomChild < listBottom);
    }

    requestChildRectangleOnScreen(child:View, rect:Rect, immediate:boolean):boolean  {
        let rectTopWithinChild:number = rect.top;
        // offset so rect is in coordinates of the this view
        rect.offset(child.getLeft(), child.getTop());
        rect.offset(-child.getScrollX(), -child.getScrollY());
        const height:number = this.getHeight();
        let listUnfadedTop:number = this.getScrollY();
        let listUnfadedBottom:number = listUnfadedTop + height;
        const fadingEdge:number = this.getVerticalFadingEdgeLength();
        if (this.showingTopFadingEdge()) {
            // leave room for top fading edge as long as rect isn't at very top
            if ((this.mSelectedPosition > 0) || (rectTopWithinChild > fadingEdge)) {
                listUnfadedTop += fadingEdge;
            }
        }
        let childCount:number = this.getChildCount();
        let bottomOfBottomChild:number = this.getChildAt(childCount - 1).getBottom();
        if (this.showingBottomFadingEdge()) {
            // leave room for bottom fading edge as long as rect isn't at very bottom
            if ((this.mSelectedPosition < this.mItemCount - 1) || (rect.bottom < (bottomOfBottomChild - fadingEdge))) {
                listUnfadedBottom -= fadingEdge;
            }
        }
        let scrollYDelta:number = 0;
        if (rect.bottom > listUnfadedBottom && rect.top > listUnfadedTop) {
            if (rect.height() > height) {
                // just enough to get screen size chunk on
                scrollYDelta += (rect.top - listUnfadedTop);
            } else {
                // get entire rect at bottom of screen
                scrollYDelta += (rect.bottom - listUnfadedBottom);
            }
            // make sure we aren't scrolling beyond the end of our children
            let distanceToBottom:number = bottomOfBottomChild - listUnfadedBottom;
            scrollYDelta = Math.min(scrollYDelta, distanceToBottom);
        } else if (rect.top < listUnfadedTop && rect.bottom < listUnfadedBottom) {
            if (rect.height() > height) {
                // screen size chunk
                scrollYDelta -= (listUnfadedBottom - rect.bottom);
            } else {
                // entire rect at top
                scrollYDelta -= (listUnfadedTop - rect.top);
            }
            // make sure we aren't scrolling any further than the top our children
            let top:number = this.getChildAt(0).getTop();
            let deltaToTop:number = top - listUnfadedTop;
            scrollYDelta = Math.max(scrollYDelta, deltaToTop);
        }
        const scroll:boolean = scrollYDelta != 0;
        if (scroll) {
            this.scrollListItemsBy(-scrollYDelta);
            this.positionSelector(ListView.INVALID_POSITION, child);
            this.mSelectedTop = child.getTop();
            this.invalidate();
        }
        return scroll;
    }

    /**
     * {@inheritDoc}
     */
    fillGap(down:boolean):void  {
        const count:number = this.getChildCount();
        if (down) {
            let paddingTop:number = 0;
            if ((this.mGroupFlags & ListView.CLIP_TO_PADDING_MASK) == ListView.CLIP_TO_PADDING_MASK) {
                paddingTop = this.getListPaddingTop();
            }
            const startOffset:number = count > 0 ? this.getChildAt(count - 1).getBottom() + this.mDividerHeight : paddingTop;
            this.fillDown(this.mFirstPosition + count, startOffset);
            this.correctTooHigh(this.getChildCount());
        } else {
            let paddingBottom:number = 0;
            if ((this.mGroupFlags & ListView.CLIP_TO_PADDING_MASK) == ListView.CLIP_TO_PADDING_MASK) {
                paddingBottom = this.getListPaddingBottom();
            }
            const startOffset:number = count > 0 ? this.getChildAt(0).getTop() - this.mDividerHeight : this.getHeight() - paddingBottom;
            this.fillUp(this.mFirstPosition - 1, startOffset);
            this.correctTooLow(this.getChildCount());
        }
    }

    /**
     * Fills the list from pos down to the end of the list view.
     *
     * @param pos The first position to put in the list
     *
     * @param nextTop The location where the top of the item associated with pos
     *        should be drawn
     *
     * @return The view that is currently selected, if it happens to be in the
     *         range that we draw.
     */
    private fillDown(pos:number, nextTop:number):View  {
        let selectedView:View = null;
        let end:number = (this.mBottom - this.mTop);
        if ((this.mGroupFlags & ListView.CLIP_TO_PADDING_MASK) == ListView.CLIP_TO_PADDING_MASK) {
            end -= this.mListPadding.bottom;
        }
        while (nextTop < end && pos < this.mItemCount) {
            // is this the selected item?
            let selected:boolean = pos == this.mSelectedPosition;
            let child:View = this.makeAndAddView(pos, nextTop, true, this.mListPadding.left, selected);
            nextTop = child.getBottom() + this.mDividerHeight;
            if (selected) {
                selectedView = child;
            }
            pos++;
        }
        this.setVisibleRangeHint(this.mFirstPosition, this.mFirstPosition + this.getChildCount() - 1);
        return selectedView;
    }

    /**
     * Fills the list from pos up to the top of the list view.
     *
     * @param pos The first position to put in the list
     *
     * @param nextBottom The location where the bottom of the item associated
     *        with pos should be drawn
     *
     * @return The view that is currently selected
     */
    private fillUp(pos:number, nextBottom:number):View  {
        let selectedView:View = null;
        let end:number = 0;
        if ((this.mGroupFlags & ListView.CLIP_TO_PADDING_MASK) == ListView.CLIP_TO_PADDING_MASK) {
            end = this.mListPadding.top;
        }
        while (nextBottom > end && pos >= 0) {
            // is this the selected item?
            let selected:boolean = pos == this.mSelectedPosition;
            let child:View = this.makeAndAddView(pos, nextBottom, false, this.mListPadding.left, selected);
            nextBottom = child.getTop() - this.mDividerHeight;
            if (selected) {
                selectedView = child;
            }
            pos--;
        }
        this.mFirstPosition = pos + 1;
        this.setVisibleRangeHint(this.mFirstPosition, this.mFirstPosition + this.getChildCount() - 1);
        return selectedView;
    }

    /**
     * Fills the list from top to bottom, starting with mFirstPosition
     *
     * @param nextTop The location where the top of the first item should be
     *        drawn
     *
     * @return The view that is currently selected
     */
    private fillFromTop(nextTop:number):View  {
        this.mFirstPosition = Math.min(this.mFirstPosition, this.mSelectedPosition);
        this.mFirstPosition = Math.min(this.mFirstPosition, this.mItemCount - 1);
        if (this.mFirstPosition < 0) {
            this.mFirstPosition = 0;
        }
        return this.fillDown(this.mFirstPosition, nextTop);
    }

    /**
     * Put mSelectedPosition in the middle of the screen and then build up and
     * down from there. This method forces mSelectedPosition to the center.
     *
     * @param childrenTop Top of the area in which children can be drawn, as
     *        measured in pixels
     * @param childrenBottom Bottom of the area in which children can be drawn,
     *        as measured in pixels
     * @return Currently selected view
     */
    private fillFromMiddle(childrenTop:number, childrenBottom:number):View  {
        let height:number = childrenBottom - childrenTop;
        let position:number = this.reconcileSelectedPosition();
        let sel:View = this.makeAndAddView(position, childrenTop, true, this.mListPadding.left, true);
        this.mFirstPosition = position;
        let selHeight:number = sel.getMeasuredHeight();
        if (selHeight <= height) {
            sel.offsetTopAndBottom((height - selHeight) / 2);
        }
        this.fillAboveAndBelow(sel, position);
        if (!this.mStackFromBottom) {
            this.correctTooHigh(this.getChildCount());
        } else {
            this.correctTooLow(this.getChildCount());
        }
        return sel;
    }

    /**
     * Once the selected view as been placed, fill up the visible area above and
     * below it.
     *
     * @param sel The selected view
     * @param position The position corresponding to sel
     */
    private fillAboveAndBelow(sel:View, position:number):void  {
        const dividerHeight:number = this.mDividerHeight;
        if (!this.mStackFromBottom) {
            this.fillUp(position - 1, sel.getTop() - dividerHeight);
            this.adjustViewsUpOrDown();
            this.fillDown(position + 1, sel.getBottom() + dividerHeight);
        } else {
            this.fillDown(position + 1, sel.getBottom() + dividerHeight);
            this.adjustViewsUpOrDown();
            this.fillUp(position - 1, sel.getTop() - dividerHeight);
        }
    }

    /**
     * Fills the grid based on positioning the new selection at a specific
     * location. The selection may be moved so that it does not intersect the
     * faded edges. The grid is then filled upwards and downwards from there.
     *
     * @param selectedTop Where the selected item should be
     * @param childrenTop Where to start drawing children
     * @param childrenBottom Last pixel where children can be drawn
     * @return The view that currently has selection
     */
    private fillFromSelection(selectedTop:number, childrenTop:number, childrenBottom:number):View  {
        let fadingEdgeLength:number = this.getVerticalFadingEdgeLength();
        const selectedPosition:number = this.mSelectedPosition;
        let sel:View;
        const topSelectionPixel:number = this.getTopSelectionPixel(childrenTop, fadingEdgeLength, selectedPosition);
        const bottomSelectionPixel:number = this.getBottomSelectionPixel(childrenBottom, fadingEdgeLength, selectedPosition);
        sel = this.makeAndAddView(selectedPosition, selectedTop, true, this.mListPadding.left, true);
        // Some of the newly selected item extends below the bottom of the list
        if (sel.getBottom() > bottomSelectionPixel) {
            // Find space available above the selection into which we can scroll
            // upwards
            const spaceAbove:number = sel.getTop() - topSelectionPixel;
            // Find space required to bring the bottom of the selected item
            // fully into view
            const spaceBelow:number = sel.getBottom() - bottomSelectionPixel;
            const offset:number = Math.min(spaceAbove, spaceBelow);
            // Now offset the selected item to get it into view
            sel.offsetTopAndBottom(-offset);
        } else if (sel.getTop() < topSelectionPixel) {
            // Find space required to bring the top of the selected item fully
            // into view
            const spaceAbove:number = topSelectionPixel - sel.getTop();
            // Find space available below the selection into which we can scroll
            // downwards
            const spaceBelow:number = bottomSelectionPixel - sel.getBottom();
            const offset:number = Math.min(spaceAbove, spaceBelow);
            // Offset the selected item to get it into view
            sel.offsetTopAndBottom(offset);
        }
        // Fill in views above and below
        this.fillAboveAndBelow(sel, selectedPosition);
        if (!this.mStackFromBottom) {
            this.correctTooHigh(this.getChildCount());
        } else {
            this.correctTooLow(this.getChildCount());
        }
        return sel;
    }

    /**
     * Calculate the bottom-most pixel we can draw the selection into
     *
     * @param childrenBottom Bottom pixel were children can be drawn
     * @param fadingEdgeLength Length of the fading edge in pixels, if present
     * @param selectedPosition The position that will be selected
     * @return The bottom-most pixel we can draw the selection into
     */
    private getBottomSelectionPixel(childrenBottom:number, fadingEdgeLength:number, selectedPosition:number):number  {
        let bottomSelectionPixel:number = childrenBottom;
        if (selectedPosition != this.mItemCount - 1) {
            bottomSelectionPixel -= fadingEdgeLength;
        }
        return bottomSelectionPixel;
    }

    /**
     * Calculate the top-most pixel we can draw the selection into
     *
     * @param childrenTop Top pixel were children can be drawn
     * @param fadingEdgeLength Length of the fading edge in pixels, if present
     * @param selectedPosition The position that will be selected
     * @return The top-most pixel we can draw the selection into
     */
    private getTopSelectionPixel(childrenTop:number, fadingEdgeLength:number, selectedPosition:number):number  {
        // first pixel we can draw the selection into
        let topSelectionPixel:number = childrenTop;
        if (selectedPosition > 0) {
            topSelectionPixel += fadingEdgeLength;
        }
        return topSelectionPixel;
    }

    /**
     * Smoothly scroll to the specified adapter position. The view will
     * scroll such that the indicated position is displayed.
     * @param position Scroll to this adapter position.
     */
    smoothScrollToPosition(position:number, boundPosition?:number):void  {
        super.smoothScrollToPosition(position, boundPosition);
    }

    /**
     * Smoothly scroll to the specified adapter position offset. The view will
     * scroll such that the indicated position is displayed.
     * @param offset The amount to offset from the adapter position to scroll to.
     */
    smoothScrollByOffset(offset:number):void  {
        super.smoothScrollByOffset(offset);
    }

    /**
     * Fills the list based on positioning the new selection relative to the old
     * selection. The new selection will be placed at, above, or below the
     * location of the new selection depending on how the selection is moving.
     * The selection will then be pinned to the visible part of the screen,
     * excluding the edges that are faded. The list is then filled upwards and
     * downwards from there.
     *
     * @param oldSel The old selected view. Useful for trying to put the new
     *        selection in the same place
     * @param newSel The view that is to become selected. Useful for trying to
     *        put the new selection in the same place
     * @param delta Which way we are moving
     * @param childrenTop Where to start drawing children
     * @param childrenBottom Last pixel where children can be drawn
     * @return The view that currently has selection
     */
    private moveSelection(oldSel:View, newSel:View, delta:number, childrenTop:number, childrenBottom:number):View  {
        let fadingEdgeLength:number = this.getVerticalFadingEdgeLength();
        const selectedPosition:number = this.mSelectedPosition;
        let sel:View;
        const topSelectionPixel:number = this.getTopSelectionPixel(childrenTop, fadingEdgeLength, selectedPosition);
        const bottomSelectionPixel:number = this.getBottomSelectionPixel(childrenTop, fadingEdgeLength, selectedPosition);
        if (delta > 0) {
            /*
             * Case 1: Scrolling down.
             */
            /*
             *     Before           After
             *    |       |        |       |
             *    +-------+        +-------+
             *    |   A   |        |   A   |
             *    |   1   |   =>   +-------+
             *    +-------+        |   B   |
             *    |   B   |        |   2   |
             *    +-------+        +-------+
             *    |       |        |       |
             *
             *    Try to keep the top of the previously selected item where it was.
             *    oldSel = A
             *    sel = B
             */
            // Put oldSel (A) where it belongs
            oldSel = this.makeAndAddView(selectedPosition - 1, oldSel.getTop(), true, this.mListPadding.left, false);
            const dividerHeight:number = this.mDividerHeight;
            // Now put the new selection (B) below that
            sel = this.makeAndAddView(selectedPosition, oldSel.getBottom() + dividerHeight, true, this.mListPadding.left, true);
            // Some of the newly selected item extends below the bottom of the list
            if (sel.getBottom() > bottomSelectionPixel) {
                // Find space available above the selection into which we can scroll upwards
                let spaceAbove:number = sel.getTop() - topSelectionPixel;
                // Find space required to bring the bottom of the selected item fully into view
                let spaceBelow:number = sel.getBottom() - bottomSelectionPixel;
                // Don't scroll more than half the height of the list
                let halfVerticalSpace:number = (childrenBottom - childrenTop) / 2;
                let offset:number = Math.min(spaceAbove, spaceBelow);
                offset = Math.min(offset, halfVerticalSpace);
                // We placed oldSel, so offset that item
                oldSel.offsetTopAndBottom(-offset);
                // Now offset the selected item to get it into view
                sel.offsetTopAndBottom(-offset);
            }
            // Fill in views above and below
            if (!this.mStackFromBottom) {
                this.fillUp(this.mSelectedPosition - 2, sel.getTop() - dividerHeight);
                this.adjustViewsUpOrDown();
                this.fillDown(this.mSelectedPosition + 1, sel.getBottom() + dividerHeight);
            } else {
                this.fillDown(this.mSelectedPosition + 1, sel.getBottom() + dividerHeight);
                this.adjustViewsUpOrDown();
                this.fillUp(this.mSelectedPosition - 2, sel.getTop() - dividerHeight);
            }
        } else if (delta < 0) {
            if (newSel != null) {
                // Try to position the top of newSel (A) where it was before it was selected
                sel = this.makeAndAddView(selectedPosition, newSel.getTop(), true, this.mListPadding.left, true);
            } else {
                // If (A) was not on screen and so did not have a view, position
                // it above the oldSel (B)
                sel = this.makeAndAddView(selectedPosition, oldSel.getTop(), false, this.mListPadding.left, true);
            }
            // Some of the newly selected item extends above the top of the list
            if (sel.getTop() < topSelectionPixel) {
                // Find space required to bring the top of the selected item fully into view
                let spaceAbove:number = topSelectionPixel - sel.getTop();
                // Find space available below the selection into which we can scroll downwards
                let spaceBelow:number = bottomSelectionPixel - sel.getBottom();
                // Don't scroll more than half the height of the list
                let halfVerticalSpace:number = (childrenBottom - childrenTop) / 2;
                let offset:number = Math.min(spaceAbove, spaceBelow);
                offset = Math.min(offset, halfVerticalSpace);
                // Offset the selected item to get it into view
                sel.offsetTopAndBottom(offset);
            }
            // Fill in views above and below
            this.fillAboveAndBelow(sel, selectedPosition);
        } else {
            let oldTop:number = oldSel.getTop();
            /*
             * Case 3: Staying still
             */
            sel = this.makeAndAddView(selectedPosition, oldTop, true, this.mListPadding.left, true);
            // We're staying still...
            if (oldTop < childrenTop) {
                // ... but the top of the old selection was off screen.
                // (This can happen if the data changes size out from under us)
                let newBottom:number = sel.getBottom();
                if (newBottom < childrenTop + 20) {
                    // Not enough visible -- bring it onscreen
                    sel.offsetTopAndBottom(childrenTop - sel.getTop());
                }
            }
            // Fill in views above and below
            this.fillAboveAndBelow(sel, selectedPosition);
        }
        return sel;
    }



    protected onSizeChanged(w:number, h:number, oldw:number, oldh:number):void  {
        if (this.getChildCount() > 0) {
            let focusedChild:View = this.getFocusedChild();
            if (focusedChild != null) {
                const childPosition:number = this.mFirstPosition + this.indexOfChild(focusedChild);
                const childBottom:number = focusedChild.getBottom();
                const offset:number = Math.max(0, childBottom - (h - this.mPaddingTop));
                const top:number = focusedChild.getTop() - offset;
                if (this.mFocusSelector == null) {
                    this.mFocusSelector = new ListView.FocusSelector(this);
                }
                this.post(this.mFocusSelector.setup(childPosition, top));
            }
        }
        super.onSizeChanged(w, h, oldw, oldh);
    }

    protected onMeasure(widthMeasureSpec:number, heightMeasureSpec:number):void  {
        // Sets up mListPadding
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        let widthMode:number = View.MeasureSpec.getMode(widthMeasureSpec);
        let heightMode:number = View.MeasureSpec.getMode(heightMeasureSpec);
        let widthSize:number = View.MeasureSpec.getSize(widthMeasureSpec);
        let heightSize:number = View.MeasureSpec.getSize(heightMeasureSpec);
        let childWidth:number = 0;
        let childHeight:number = 0;
        let childState:number = 0;
        this.mItemCount = this.mAdapter == null ? 0 : this.mAdapter.getCount();
        if (this.mItemCount > 0 && (widthMode == View.MeasureSpec.UNSPECIFIED || heightMode == View.MeasureSpec.UNSPECIFIED)) {
            const child:View = this.obtainView(0, this.mIsScrap);
            this.measureScrapChild(child, 0, widthMeasureSpec);
            childWidth = child.getMeasuredWidth();
            childHeight = child.getMeasuredHeight();
            childState = ListView.combineMeasuredStates(childState, child.getMeasuredState());
            if (this.recycleOnMeasure() && this.mRecycler.shouldRecycleViewType((<AbsListView.LayoutParams> child.getLayoutParams()).viewType)) {
                this.mRecycler.addScrapView(child, -1);
            }
        }
        if (widthMode == View.MeasureSpec.UNSPECIFIED) {
            widthSize = this.mListPadding.left + this.mListPadding.right + childWidth + this.getVerticalScrollbarWidth();
        } else {
            widthSize |= (childState & ListView.MEASURED_STATE_MASK);
        }
        if (heightMode == View.MeasureSpec.UNSPECIFIED) {
            heightSize = this.mListPadding.top + this.mListPadding.bottom + childHeight + this.getVerticalFadingEdgeLength() * 2;
        }
        if (heightMode == View.MeasureSpec.AT_MOST) {
            // TODO: after first layout we should maybe start at the first visible position, not 0
            heightSize = this.measureHeightOfChildren(widthMeasureSpec, 0, ListView.NO_POSITION, heightSize, -1);
        }
        this.setMeasuredDimension(widthSize, heightSize);
        this.mWidthMeasureSpec = widthMeasureSpec;
    }

    private measureScrapChild(child:View, position:number, widthMeasureSpec:number):void  {
        let p:AbsListView.LayoutParams = <AbsListView.LayoutParams> child.getLayoutParams();
        if (p == null) {
            p = <AbsListView.LayoutParams> this.generateDefaultLayoutParams();
            child.setLayoutParams(p);
        }
        p.viewType = this.mAdapter.getItemViewType(position);
        p.forceAdd = true;
        let childWidthSpec:number = ViewGroup.getChildMeasureSpec(widthMeasureSpec, this.mListPadding.left + this.mListPadding.right, p.width);
        let lpHeight:number = p.height;
        let childHeightSpec:number;
        if (lpHeight > 0) {
            childHeightSpec = View.MeasureSpec.makeMeasureSpec(lpHeight, View.MeasureSpec.EXACTLY);
        } else {
            childHeightSpec = View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED);
        }
        child.measure(childWidthSpec, childHeightSpec);
    }

    /**
     * @return True to recycle the views used to measure this ListView in
     *         UNSPECIFIED/AT_MOST modes, false otherwise.
     * @hide
     */
    protected recycleOnMeasure():boolean  {
        return true;
    }

    /**
     * Measures the height of the given range of children (inclusive) and
     * returns the height with this ListView's padding and divider heights
     * included. If maxHeight is provided, the measuring will stop when the
     * current height reaches maxHeight.
     *
     * @param widthMeasureSpec The width measure spec to be given to a child's
     *            {@link View#measure(int, int)}.
     * @param startPosition The position of the first child to be shown.
     * @param endPosition The (inclusive) position of the last child to be
     *            shown. Specify {@link #NO_POSITION} if the last child should be
     *            the last available child from the adapter.
     * @param maxHeight The maximum height that will be returned (if all the
     *            children don't fit in this value, this value will be
     *            returned).
     * @param disallowPartialChildPosition In general, whether the returned
     *            height should only contain entire children. This is more
     *            powerful--it is the first inclusive position at which partial
     *            children will not be allowed. Example: it looks nice to have
     *            at least 3 completely visible children, and in portrait this
     *            will most likely fit; but in landscape there could be times
     *            when even 2 children can not be completely shown, so a value
     *            of 2 (remember, inclusive) would be good (assuming
     *            startPosition is 0).
     * @return The height of this ListView with the given children.
     */
    measureHeightOfChildren(widthMeasureSpec:number, startPosition:number, endPosition:number, maxHeight:number, disallowPartialChildPosition:number):number  {
        const adapter:ListAdapter = this.mAdapter;
        if (adapter == null) {
            return this.mListPadding.top + this.mListPadding.bottom;
        }
        // Include the padding of the list
        let returnedHeight:number = this.mListPadding.top + this.mListPadding.bottom;
        const dividerHeight:number = ((this.mDividerHeight > 0) && this.mDivider != null) ? this.mDividerHeight : 0;
        // The previous height value that was less than maxHeight and contained
        // no partial children
        let prevHeightWithoutPartialChild:number = 0;
        let i:number;
        let child:View;
        // mItemCount - 1 since endPosition parameter is inclusive
        endPosition = (endPosition == ListView.NO_POSITION) ? adapter.getCount() - 1 : endPosition;
        const recycleBin:AbsListView.RecycleBin = this.mRecycler;
        const recyle:boolean = this.recycleOnMeasure();
        const isScrap:boolean[] = this.mIsScrap;
        for (i = startPosition; i <= endPosition; ++i) {
            child = this.obtainView(i, isScrap);
            this.measureScrapChild(child, i, widthMeasureSpec);
            if (i > 0) {
                // Count the divider for all but one child
                returnedHeight += dividerHeight;
            }
            // Recycle the view before we possibly return from the method
            if (recyle && recycleBin.shouldRecycleViewType((<AbsListView.LayoutParams> child.getLayoutParams()).viewType)) {
                recycleBin.addScrapView(child, -1);
            }
            returnedHeight += child.getMeasuredHeight();
            if (returnedHeight >= maxHeight) {
                // then the i'th position did not fit completely.
                // Disallowing is enabled (> -1)
                return (disallowPartialChildPosition >= 0) && // We've past the min pos
                (i > disallowPartialChildPosition) && // We have a prev height
                (prevHeightWithoutPartialChild > 0) && // i'th child did not fit completely
                (returnedHeight != maxHeight) ? prevHeightWithoutPartialChild : maxHeight;
            }
            if ((disallowPartialChildPosition >= 0) && (i >= disallowPartialChildPosition)) {
                prevHeightWithoutPartialChild = returnedHeight;
            }
        }
        // completely fit, so return the returnedHeight
        return returnedHeight;
    }

    findMotionRow(y:number):number  {
        let childCount:number = this.getChildCount();
        if (childCount > 0) {
            if (!this.mStackFromBottom) {
                for (let i:number = 0; i < childCount; i++) {
                    let v:View = this.getChildAt(i);
                    if (y <= v.getBottom()) {
                        return this.mFirstPosition + i;
                    }
                }
            } else {
                for (let i:number = childCount - 1; i >= 0; i--) {
                    let v:View = this.getChildAt(i);
                    if (y >= v.getTop()) {
                        return this.mFirstPosition + i;
                    }
                }
            }
        }
        return ListView.INVALID_POSITION;
    }

    /**
     * Put a specific item at a specific location on the screen and then build
     * up and down from there.
     *
     * @param position The reference view to use as the starting point
     * @param top Pixel offset from the top of this view to the top of the
     *        reference view.
     *
     * @return The selected view, or null if the selected view is outside the
     *         visible area.
     */
    private fillSpecific(position:number, top:number):View  {
        let tempIsSelected:boolean = position == this.mSelectedPosition;
        let temp:View = this.makeAndAddView(position, top, true, this.mListPadding.left, tempIsSelected);
        // Possibly changed again in fillUp if we add rows above this one.
        this.mFirstPosition = position;
        let above:View;
        let below:View;
        const dividerHeight:number = this.mDividerHeight;
        if (!this.mStackFromBottom) {
            above = this.fillUp(position - 1, temp.getTop() - dividerHeight);
            // This will correct for the top of the first view not touching the top of the list
            this.adjustViewsUpOrDown();
            below = this.fillDown(position + 1, temp.getBottom() + dividerHeight);
            let childCount:number = this.getChildCount();
            if (childCount > 0) {
                this.correctTooHigh(childCount);
            }
        } else {
            below = this.fillDown(position + 1, temp.getBottom() + dividerHeight);
            // This will correct for the bottom of the last view not touching the bottom of the list
            this.adjustViewsUpOrDown();
            above = this.fillUp(position - 1, temp.getTop() - dividerHeight);
            let childCount:number = this.getChildCount();
            if (childCount > 0) {
                this.correctTooLow(childCount);
            }
        }
        if (tempIsSelected) {
            return temp;
        } else if (above != null) {
            return above;
        } else {
            return below;
        }
    }

    /**
     * Check if we have dragged the bottom of the list too high (we have pushed the
     * top element off the top of the screen when we did not need to). Correct by sliding
     * everything back down.
     *
     * @param childCount Number of children
     */
    private correctTooHigh(childCount:number):void  {
        // First see if the last item is visible. If it is not, it is OK for the
        // top of the list to be pushed up.
        let lastPosition:number = this.mFirstPosition + childCount - 1;
        if (lastPosition == this.mItemCount - 1 && childCount > 0) {
            // Get the last child ...
            const lastChild:View = this.getChildAt(childCount - 1);
            // ... and its bottom edge
            const lastBottom:number = lastChild.getBottom();
            // This is bottom of our drawable area
            const end:number = (this.mBottom - this.mTop) - this.mListPadding.bottom;
            // This is how far the bottom edge of the last view is from the bottom of the
            // drawable area
            let bottomOffset:number = end - lastBottom;
            let firstChild:View = this.getChildAt(0);
            const firstTop:number = firstChild.getTop();
            // first row or the first row is scrolled off the top of the drawable area
            if (bottomOffset > 0 && (this.mFirstPosition > 0 || firstTop < this.mListPadding.top)) {
                if (this.mFirstPosition == 0) {
                    // Don't pull the top too far down
                    bottomOffset = Math.min(bottomOffset, this.mListPadding.top - firstTop);
                }
                // Move everything down
                this.offsetChildrenTopAndBottom(bottomOffset);
                if (this.mFirstPosition > 0) {
                    // Fill the gap that was opened above mFirstPosition with more rows, if
                    // possible
                    this.fillUp(this.mFirstPosition - 1, firstChild.getTop() - this.mDividerHeight);
                    // Close up the remaining gap
                    this.adjustViewsUpOrDown();
                }
            }
        }
    }

    /**
     * Check if we have dragged the bottom of the list too low (we have pushed the
     * bottom element off the bottom of the screen when we did not need to). Correct by sliding
     * everything back up.
     *
     * @param childCount Number of children
     */
    private correctTooLow(childCount:number):void  {
        // bottom of the list to be pushed down.
        if (this.mFirstPosition == 0 && childCount > 0) {
            // Get the first child ...
            const firstChild:View = this.getChildAt(0);
            // ... and its top edge
            const firstTop:number = firstChild.getTop();
            // This is top of our drawable area
            const start:number = this.mListPadding.top;
            // This is bottom of our drawable area
            const end:number = (this.mBottom - this.mTop) - this.mListPadding.bottom;
            // This is how far the top edge of the first view is from the top of the
            // drawable area
            let topOffset:number = firstTop - start;
            let lastChild:View = this.getChildAt(childCount - 1);
            const lastBottom:number = lastChild.getBottom();
            let lastPosition:number = this.mFirstPosition + childCount - 1;
            // last row or the last row is scrolled off the bottom of the drawable area
            if (topOffset > 0) {
                if (lastPosition < this.mItemCount - 1 || lastBottom > end) {
                    if (lastPosition == this.mItemCount - 1) {
                        // Don't pull the bottom too far up
                        topOffset = Math.min(topOffset, lastBottom - end);
                    }
                    // Move everything up
                    this.offsetChildrenTopAndBottom(-topOffset);
                    if (lastPosition < this.mItemCount - 1) {
                        // Fill the gap that was opened below the last position with more rows, if
                        // possible
                        this.fillDown(lastPosition + 1, lastChild.getBottom() + this.mDividerHeight);
                        // Close up the remaining gap
                        this.adjustViewsUpOrDown();
                    }
                } else if (lastPosition == this.mItemCount - 1) {
                    this.adjustViewsUpOrDown();
                }
            }
        }
    }

    layoutChildren():void  {
        const blockLayoutRequests:boolean = this.mBlockLayoutRequests;
        if (blockLayoutRequests) {
            return;
        }
        this.mBlockLayoutRequests = true;
        try {
            super.layoutChildren();
            this.invalidate();
            if (this.mAdapter == null) {
                this.resetList();
                this.invokeOnItemScrollListener();
                return;
            }
            const childrenTop:number = this.mListPadding.top;
            const childrenBottom:number = this.mBottom - this.mTop - this.mListPadding.bottom;
            const childCount:number = this.getChildCount();
            let index:number = 0;
            let delta:number = 0;
            let sel:View;
            let oldSel:View = null;
            let oldFirst:View = null;
            let newSel:View = null;
            // Remember stuff we will need down below
            switch(this.mLayoutMode) {
                case ListView.LAYOUT_SET_SELECTION:
                    index = this.mNextSelectedPosition - this.mFirstPosition;
                    if (index >= 0 && index < childCount) {
                        newSel = this.getChildAt(index);
                    }
                    break;
                case ListView.LAYOUT_FORCE_TOP:
                case ListView.LAYOUT_FORCE_BOTTOM:
                case ListView.LAYOUT_SPECIFIC:
                case ListView.LAYOUT_SYNC:
                    break;
                case ListView.LAYOUT_MOVE_SELECTION:
                default:
                    // Remember the previously selected view
                    index = this.mSelectedPosition - this.mFirstPosition;
                    if (index >= 0 && index < childCount) {
                        oldSel = this.getChildAt(index);
                    }
                    // Remember the previous first child
                    oldFirst = this.getChildAt(0);
                    if (this.mNextSelectedPosition >= 0) {
                        delta = this.mNextSelectedPosition - this.mSelectedPosition;
                    }
                    // Caution: newSel might be null
                    newSel = this.getChildAt(index + delta);
            }
            let dataChanged:boolean = this.mDataChanged;
            if (dataChanged) {
                this.handleDataChanged();
            }
            // and calling it a day
            if (this.mItemCount == 0) {
                this.resetList();
                this.invokeOnItemScrollListener();
                return;
            } else if (this.mItemCount != this.mAdapter.getCount()) {
                throw Error(`IllegalStateException("The content of the adapter has changed but
                ListView did not receive a notification. Make sure the content of
                your adapter is not modified from a background thread, but only from
                the UI thread. Make sure your adapter calls notifyDataSetChanged()
                when its content changes. [in ListView(${this.getId()},${this.constructor.name})
                with Adapter(${this.mAdapter.constructor.name})]")`);
            }
            this.setSelectedPositionInt(this.mNextSelectedPosition);
            // Remember which child, if any, had accessibility focus.
            //let accessibilityFocusPosition:number;
            const accessFocusedChild:View = null;//this.getAccessibilityFocusedChild();
            //if (accessFocusedChild != null) {
            //    accessibilityFocusPosition = this.getPositionForView(accessFocusedChild);
            //    accessFocusedChild.setHasTransientState(true);
            //} else {
            //    accessibilityFocusPosition = ListView.INVALID_POSITION;
            //}
            // Ensure the child containing focus, if any, has transient state.
            // If the list data hasn't changed, or if the adapter has stable
            // IDs, this will maintain focus.
            const focusedChild:View = this.getFocusedChild();
            if (focusedChild != null) {
                focusedChild.setHasTransientState(true);
            }
            // Pull all children into the RecycleBin.
            // These views will be reused if possible
            const firstPosition:number = this.mFirstPosition;
            const recycleBin:AbsListView.RecycleBin = this.mRecycler;
            if (dataChanged) {
                for (let i:number = 0; i < childCount; i++) {
                    recycleBin.addScrapView(this.getChildAt(i), firstPosition + i);
                }
            } else {
                recycleBin.fillActiveViews(childCount, firstPosition);
            }
            // Clear out old views
            this.detachAllViewsFromParent();
            recycleBin.removeSkippedScrap();
            switch(this.mLayoutMode) {
                case ListView.LAYOUT_SET_SELECTION:
                    if (newSel != null) {
                        sel = this.fillFromSelection(newSel.getTop(), childrenTop, childrenBottom);
                    } else {
                        sel = this.fillFromMiddle(childrenTop, childrenBottom);
                    }
                    break;
                case ListView.LAYOUT_SYNC:
                    sel = this.fillSpecific(this.mSyncPosition, this.mSpecificTop);
                    break;
                case ListView.LAYOUT_FORCE_BOTTOM:
                    sel = this.fillUp(this.mItemCount - 1, childrenBottom);
                    this.adjustViewsUpOrDown();
                    break;
                case ListView.LAYOUT_FORCE_TOP:
                    this.mFirstPosition = 0;
                    sel = this.fillFromTop(childrenTop);
                    this.adjustViewsUpOrDown();
                    break;
                case ListView.LAYOUT_SPECIFIC:
                    sel = this.fillSpecific(this.reconcileSelectedPosition(), this.mSpecificTop);
                    break;
                case ListView.LAYOUT_MOVE_SELECTION:
                    sel = this.moveSelection(oldSel, newSel, delta, childrenTop, childrenBottom);
                    break;
                default:
                    if (childCount == 0) {
                        if (!this.mStackFromBottom) {
                            const position:number = this.lookForSelectablePosition(0, true);
                            this.setSelectedPositionInt(position);
                            sel = this.fillFromTop(childrenTop);
                        } else {
                            const position:number = this.lookForSelectablePosition(this.mItemCount - 1, false);
                            this.setSelectedPositionInt(position);
                            sel = this.fillUp(this.mItemCount - 1, childrenBottom);
                        }
                    } else {
                        if (this.mSelectedPosition >= 0 && this.mSelectedPosition < this.mItemCount) {
                            sel = this.fillSpecific(this.mSelectedPosition, oldSel == null ? childrenTop : oldSel.getTop());
                        } else if (this.mFirstPosition < this.mItemCount) {
                            sel = this.fillSpecific(this.mFirstPosition, oldFirst == null ? childrenTop : oldFirst.getTop());
                        } else {
                            sel = this.fillSpecific(0, childrenTop);
                        }
                    }
                    break;
            }
            // Flush any cached views that did not get reused above
            recycleBin.scrapActiveViews();
            if (sel != null) {
                const shouldPlaceFocus:boolean = this.mItemsCanFocus && this.hasFocus();
                const maintainedFocus:boolean = focusedChild != null && focusedChild.hasFocus();
                if (shouldPlaceFocus && !maintainedFocus && !sel.hasFocus()) {
                    if (sel.requestFocus()) {
                        // Successfully placed focus, clear selection.
                        sel.setSelected(false);
                        this.mSelectorRect.setEmpty();
                    } else {
                        // Failed to place focus, clear current (invalid) focus.
                        const focused:View = this.getFocusedChild();
                        if (focused != null) {
                            focused.clearFocus();
                        }
                        this.positionSelector(ListView.INVALID_POSITION, sel);
                    }
                } else {
                    this.positionSelector(ListView.INVALID_POSITION, sel);
                }
                this.mSelectedTop = sel.getTop();
            } else {
                // Otherwise, clear selection.
                if (this.mTouchMode == ListView.TOUCH_MODE_TAP || this.mTouchMode == ListView.TOUCH_MODE_DONE_WAITING) {
                    const child:View = this.getChildAt(this.mMotionPosition - this.mFirstPosition);
                    if (child != null) {
                        this.positionSelector(this.mMotionPosition, child);
                    }
                } else {
                    this.mSelectedTop = 0;
                    this.mSelectorRect.setEmpty();
                }
            }
            if (accessFocusedChild != null) {
                accessFocusedChild.setHasTransientState(false);
                // view, attempt to restore it to the previous position.
                //if (!accessFocusedChild.isAccessibilityFocused() && accessibilityFocusPosition != ListView.INVALID_POSITION) {
                //    // Bound the position within the visible children.
                //    const position:number = MathUtils.constrain(accessibilityFocusPosition - this.mFirstPosition, 0, this.getChildCount() - 1);
                //    const restoreView:View = this.getChildAt(position);
                //    if (restoreView != null) {
                //        restoreView.requestAccessibilityFocus();
                //    }
                //}
            }
            if (focusedChild != null) {
                focusedChild.setHasTransientState(false);
            }
            this.mLayoutMode = ListView.LAYOUT_NORMAL;
            this.mDataChanged = false;
            if (this.mPositionScrollAfterLayout != null) {
                this.post(this.mPositionScrollAfterLayout);
                this.mPositionScrollAfterLayout = null;
            }
            this.mNeedSync = false;
            this.setNextSelectedPositionInt(this.mSelectedPosition);
            this.updateScrollIndicators();
            if (this.mItemCount > 0) {
                this.checkSelectionChanged();
            }
            this.invokeOnItemScrollListener();
        } finally {
            if (!blockLayoutRequests) {
                this.mBlockLayoutRequests = false;
            }
        }
    }

    /**
     * @return the direct child that contains accessibility focus, or null if no
     *         child contains accessibility focus
     */
    //private getAccessibilityFocusedChild():View  {
    //    const viewRootImpl:ViewRootImpl = this.getViewRootImpl();
    //    if (viewRootImpl == null) {
    //        return null;
    //    }
    //    let focusedView:View = viewRootImpl.getAccessibilityFocusedHost();
    //    if (focusedView == null) {
    //        return null;
    //    }
    //    let viewParent:ViewParent = focusedView.getParent();
    //    while ((viewParent instanceof View) && (viewParent != this)) {
    //        focusedView = <View> viewParent;
    //        viewParent = viewParent.getParent();
    //    }
    //    if (!(viewParent instanceof View)) {
    //        return null;
    //    }
    //    return focusedView;
    //}

    /**
     * Obtain the view and add it to our list of children. The view can be made
     * fresh, converted from an unused view, or used as is if it was in the
     * recycle bin.
     *
     * @param position Logical position in the list
     * @param y Top or bottom edge of the view to add
     * @param flow If flow is true, align top edge to y. If false, align bottom
     *        edge to y.
     * @param childrenLeft Left edge where children should be positioned
     * @param selected Is this position selected?
     * @return View that was added
     */
    private makeAndAddView(position:number, y:number, flow:boolean, childrenLeft:number, selected:boolean):View  {
        let child:View;
        if (!this.mDataChanged) {
            // Try to use an existing view for this position
            child = this.mRecycler.getActiveView(position);
            if (child != null) {
                // Found it -- we're using an existing child
                // This just needs to be positioned
                this.setupChild(child, position, y, flow, childrenLeft, selected, true);
                return child;
            }
        }
        // Make a new view for this position, or convert an unused view if possible
        child = this.obtainView(position, this.mIsScrap);
        // This needs to be positioned and measured
        this.setupChild(child, position, y, flow, childrenLeft, selected, this.mIsScrap[0]);
        return child;
    }

    /**
     * Add a view as a child and make sure it is measured (if necessary) and
     * positioned properly.
     *
     * @param child The view to add
     * @param position The position of this child
     * @param y The y position relative to which this view will be positioned
     * @param flowDown If true, align top edge to y. If false, align bottom
     *        edge to y.
     * @param childrenLeft Left edge where children should be positioned
     * @param selected Is this position selected?
     * @param recycled Has this view been pulled from the recycle bin? If so it
     *        does not need to be remeasured.
     */
    private setupChild(child:View, position:number, y:number, flowDown:boolean, childrenLeft:number, selected:boolean, recycled:boolean):void  {
        Trace.traceBegin(Trace.TRACE_TAG_VIEW, "setupListItem");
        const isSelected:boolean = selected && this.shouldShowSelector();
        const updateChildSelected:boolean = isSelected != child.isSelected();
        const mode:number = this.mTouchMode;
        const isPressed:boolean = mode > ListView.TOUCH_MODE_DOWN && mode < ListView.TOUCH_MODE_SCROLL && this.mMotionPosition == position;
        const updateChildPressed:boolean = isPressed != child.isPressed();
        const needToMeasure:boolean = !recycled || updateChildSelected || child.isLayoutRequested();
        // Respect layout params that are already in the view. Otherwise make some up...
        // noinspection unchecked
        let p:AbsListView.LayoutParams = <AbsListView.LayoutParams> child.getLayoutParams();
        if (p == null) {
            p = <AbsListView.LayoutParams> this.generateDefaultLayoutParams();
        }
        if(!(p instanceof AbsListView.LayoutParams)){
            throw Error('ClassCaseException('+p.constructor.name+' can\'t case to AbsListView.LayoutParams)');
        }
        p.viewType = this.mAdapter.getItemViewType(position);
        if ((recycled && !p.forceAdd) || (p.recycledHeaderFooter && p.viewType == AdapterView.ITEM_VIEW_TYPE_HEADER_OR_FOOTER)) {
            this.attachViewToParent(child, flowDown ? -1 : 0, p);
        } else {
            p.forceAdd = false;
            if (p.viewType == AdapterView.ITEM_VIEW_TYPE_HEADER_OR_FOOTER) {
                p.recycledHeaderFooter = true;
            }
            this.addViewInLayout(child, flowDown ? -1 : 0, p, true);
        }
        if (updateChildSelected) {
            child.setSelected(isSelected);
        }
        if (updateChildPressed) {
            child.setPressed(isPressed);
        }
        if (this.mChoiceMode != ListView.CHOICE_MODE_NONE && this.mCheckStates != null) {
            if (child['setChecked']) {
                (<Checkable><any>child).setChecked(this.mCheckStates.get(position));
            } else {
                child.setActivated(this.mCheckStates.get(position));
            }
        }
        if (needToMeasure) {
            let childWidthSpec:number = ViewGroup.getChildMeasureSpec(this.mWidthMeasureSpec, this.mListPadding.left + this.mListPadding.right, p.width);
            let lpHeight:number = p.height;
            let childHeightSpec:number;
            if (lpHeight > 0) {
                childHeightSpec = View.MeasureSpec.makeMeasureSpec(lpHeight, View.MeasureSpec.EXACTLY);
            } else {
                childHeightSpec = View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED);
            }
            child.measure(childWidthSpec, childHeightSpec);
        } else {
            this.cleanupLayoutState(child);
        }
        const w:number = child.getMeasuredWidth();
        const h:number = child.getMeasuredHeight();
        const childTop:number = flowDown ? y : y - h;
        if (needToMeasure) {
            const childRight:number = childrenLeft + w;
            const childBottom:number = childTop + h;
            child.layout(childrenLeft, childTop, childRight, childBottom);
        } else {
            child.offsetLeftAndRight(childrenLeft - child.getLeft());
            child.offsetTopAndBottom(childTop - child.getTop());
        }
        if (this.mCachingStarted && !child.isDrawingCacheEnabled()) {
            child.setDrawingCacheEnabled(true);
        }
        if (recycled && ((<AbsListView.LayoutParams> child.getLayoutParams()).scrappedFromPosition) != position) {
            child.jumpDrawablesToCurrentState();
        }
        Trace.traceEnd(Trace.TRACE_TAG_VIEW);
    }

    canAnimate():boolean  {
        return super.canAnimate() && this.mItemCount > 0;
    }

    /**
     * Sets the currently selected item. If in touch mode, the item will not be selected
     * but it will still be positioned appropriately. If the specified selection position
     * is less than 0, then the item at position 0 will be selected.
     *
     * @param position Index (starting at 0) of the data item to be selected.
     */
    setSelection(position:number):void  {
        this.setSelectionFromTop(position, 0);
    }

    /**
     * Sets the selected item and positions the selection y pixels from the top edge
     * of the ListView. (If in touch mode, the item will not be selected but it will
     * still be positioned appropriately.)
     *
     * @param position Index (starting at 0) of the data item to be selected.
     * @param y The distance from the top edge of the ListView (plus padding) that the
     *        item will be positioned.
     */
    setSelectionFromTop(position:number, y:number):void  {
        if (this.mAdapter == null) {
            return;
        }
        if (!this.isInTouchMode()) {
            position = this.lookForSelectablePosition(position, true);
            if (position >= 0) {
                this.setNextSelectedPositionInt(position);
            }
        } else {
            this.mResurrectToPosition = position;
        }
        if (position >= 0) {
            this.mLayoutMode = ListView.LAYOUT_SPECIFIC;
            this.mSpecificTop = this.mListPadding.top + y;
            if (this.mNeedSync) {
                this.mSyncPosition = position;
                this.mSyncRowId = this.mAdapter.getItemId(position);
            }
            if (this.mPositionScroller != null) {
                this.mPositionScroller.stop();
            }
            this.requestLayout();
        }
    }

    /**
     * Makes the item at the supplied position selected.
     * 
     * @param position the position of the item to select
     */
    setSelectionInt(position:number):void  {
        this.setNextSelectedPositionInt(position);
        let awakeScrollbars:boolean = false;
        const selectedPosition:number = this.mSelectedPosition;
        if (selectedPosition >= 0) {
            if (position == selectedPosition - 1) {
                awakeScrollbars = true;
            } else if (position == selectedPosition + 1) {
                awakeScrollbars = true;
            }
        }
        if (this.mPositionScroller != null) {
            this.mPositionScroller.stop();
        }
        this.layoutChildren();
        if (awakeScrollbars) {
            this.awakenScrollBars();
        }
    }

    /**
     * Find a position that can be selected (i.e., is not a separator).
     *
     * @param position The starting position to look at.
     * @param lookDown Whether to look down for other positions.
     * @return The next selectable position starting at position and then searching either up or
     *         down. Returns {@link #INVALID_POSITION} if nothing can be found.
     */
    lookForSelectablePosition(position:number, lookDown:boolean):number  {
        const adapter:ListAdapter = this.mAdapter;
        if (adapter == null || this.isInTouchMode()) {
            return ListView.INVALID_POSITION;
        }
        const count:number = adapter.getCount();
        if (!this.mAreAllItemsSelectable) {
            if (lookDown) {
                position = Math.max(0, position);
                while (position < count && !adapter.isEnabled(position)) {
                    position++;
                }
            } else {
                position = Math.min(position, count - 1);
                while (position >= 0 && !adapter.isEnabled(position)) {
                    position--;
                }
            }
        }
        if (position < 0 || position >= count) {
            return ListView.INVALID_POSITION;
        }
        return position;
    }

    /**
     * Find a position that can be selected (i.e., is not a separator). If there
     * are no selectable positions in the specified direction from the starting
     * position, searches in the opposite direction from the starting position
     * to the current position.
     *
     * @param current the current position
     * @param position the starting position
     * @param lookDown whether to look down for other positions
     * @return the next selectable position, or {@link #INVALID_POSITION} if
     *         nothing can be found
     */
    lookForSelectablePositionAfter(current:number, position:number, lookDown:boolean):number  {
        const adapter:ListAdapter = this.mAdapter;
        if (adapter == null || this.isInTouchMode()) {
            return ListView.INVALID_POSITION;
        }
        // First check after the starting position in the specified direction.
        const after:number = this.lookForSelectablePosition(position, lookDown);
        if (after != ListView.INVALID_POSITION) {
            return after;
        }
        // Then check between the starting position and the current position.
        const count:number = adapter.getCount();
        current = MathUtils.constrain(current, -1, count - 1);
        if (lookDown) {
            position = Math.min(position - 1, count - 1);
            while ((position > current) && !adapter.isEnabled(position)) {
                position--;
            }
            if (position <= current) {
                return ListView.INVALID_POSITION;
            }
        } else {
            position = Math.max(0, position + 1);
            while ((position < current) && !adapter.isEnabled(position)) {
                position++;
            }
            if (position >= current) {
                return ListView.INVALID_POSITION;
            }
        }
        return position;
    }

    /**
     * setSelectionAfterHeaderView set the selection to be the first list item
     * after the header views.
     */
    setSelectionAfterHeaderView():void  {
        const count:number = this.mHeaderViewInfos.size();
        if (count > 0) {
            this.mNextSelectedPosition = 0;
            return;
        }
        if (this.mAdapter != null) {
            this.setSelection(count);
        } else {
            this.mNextSelectedPosition = count;
            this.mLayoutMode = ListView.LAYOUT_SET_SELECTION;
        }
    }

    dispatchKeyEvent(event:KeyEvent):boolean  {
        // Dispatch in the normal way
        let handled:boolean = super.dispatchKeyEvent(event);
        if (!handled) {
            // If we didn't handle it...
            let focused:View = this.getFocusedChild();
            if (focused != null && event.getAction() == KeyEvent.ACTION_DOWN) {
                // ... and our focused child didn't handle it
                // ... give it to ourselves so we can scroll if necessary
                handled = this.onKeyDown(event.getKeyCode(), event);
            }
        }
        return handled;
    }

    onKeyDown(keyCode:number, event:KeyEvent):boolean  {
        return this.commonKey(keyCode, 1, event);
    }

    onKeyMultiple(keyCode:number, repeatCount:number, event:KeyEvent):boolean  {
        return this.commonKey(keyCode, repeatCount, event);
    }

    onKeyUp(keyCode:number, event:KeyEvent):boolean  {
        return this.commonKey(keyCode, 1, event);
    }

    private commonKey(keyCode:number, count:number, event:KeyEvent):boolean  {
        if (this.mAdapter == null || !this.isAttachedToWindow()) {
            return false;
        }
        if (this.mDataChanged) {
            this.layoutChildren();
        }
        let handled:boolean = false;
        let action:number = event.getAction();
        if (action != KeyEvent.ACTION_UP) {
            switch(keyCode) {
                case KeyEvent.KEYCODE_DPAD_UP:
                    if (event.hasNoModifiers()) {
                        handled = this.resurrectSelectionIfNeeded();
                        if (!handled) {
                            while (count-- > 0) {
                                if (this.arrowScroll(ListView.FOCUS_UP)) {
                                    handled = true;
                                } else {
                                    break;
                                }
                            }
                        }
                    } else if (event.hasModifiers(KeyEvent.META_ALT_ON)) {
                        handled = this.resurrectSelectionIfNeeded() || this.fullScroll(ListView.FOCUS_UP);
                    }
                    break;
                case KeyEvent.KEYCODE_DPAD_DOWN:
                    if (event.hasNoModifiers()) {
                        handled = this.resurrectSelectionIfNeeded();
                        if (!handled) {
                            while (count-- > 0) {
                                if (this.arrowScroll(ListView.FOCUS_DOWN)) {
                                    handled = true;
                                } else {
                                    break;
                                }
                            }
                        }
                    } else if (event.hasModifiers(KeyEvent.META_ALT_ON)) {
                        handled = this.resurrectSelectionIfNeeded() || this.fullScroll(ListView.FOCUS_DOWN);
                    }
                    break;
                case KeyEvent.KEYCODE_DPAD_LEFT:
                    if (event.hasNoModifiers()) {
                        handled = this.handleHorizontalFocusWithinListItem(View.FOCUS_LEFT);
                    }
                    break;
                case KeyEvent.KEYCODE_DPAD_RIGHT:
                    if (event.hasNoModifiers()) {
                        handled = this.handleHorizontalFocusWithinListItem(View.FOCUS_RIGHT);
                    }
                    break;
                case KeyEvent.KEYCODE_DPAD_CENTER:
                case KeyEvent.KEYCODE_ENTER:
                    if (event.hasNoModifiers()) {
                        handled = this.resurrectSelectionIfNeeded();
                        if (!handled && event.getRepeatCount() == 0 && this.getChildCount() > 0) {
                            this.keyPressed();
                            handled = true;
                        }
                    }
                    break;
                case KeyEvent.KEYCODE_SPACE:
                    //if (this.mPopup == null || !this.mPopup.isShowing()) {
                        if (event.hasNoModifiers()) {
                            handled = this.resurrectSelectionIfNeeded() || this.pageScroll(ListView.FOCUS_DOWN);
                        } else if (event.hasModifiers(KeyEvent.META_SHIFT_ON)) {
                            handled = this.resurrectSelectionIfNeeded() || this.pageScroll(ListView.FOCUS_UP);
                        }
                        handled = true;
                    //}
                    break;
                case KeyEvent.KEYCODE_PAGE_UP:
                    if (event.hasNoModifiers()) {
                        handled = this.resurrectSelectionIfNeeded() || this.pageScroll(ListView.FOCUS_UP);
                    } else if (event.hasModifiers(KeyEvent.META_ALT_ON)) {
                        handled = this.resurrectSelectionIfNeeded() || this.fullScroll(ListView.FOCUS_UP);
                    }
                    break;
                case KeyEvent.KEYCODE_PAGE_DOWN:
                    if (event.hasNoModifiers()) {
                        handled = this.resurrectSelectionIfNeeded() || this.pageScroll(ListView.FOCUS_DOWN);
                    } else if (event.hasModifiers(KeyEvent.META_ALT_ON)) {
                        handled = this.resurrectSelectionIfNeeded() || this.fullScroll(ListView.FOCUS_DOWN);
                    }
                    break;
                case KeyEvent.KEYCODE_MOVE_HOME:
                    if (event.hasNoModifiers()) {
                        handled = this.resurrectSelectionIfNeeded() || this.fullScroll(ListView.FOCUS_UP);
                    }
                    break;
                case KeyEvent.KEYCODE_MOVE_END:
                    if (event.hasNoModifiers()) {
                        handled = this.resurrectSelectionIfNeeded() || this.fullScroll(ListView.FOCUS_DOWN);
                    }
                    break;
                case KeyEvent.KEYCODE_TAB:
                    //     perhaps it should be configurable (and more comprehensive).
                    if (false) {
                        if (event.hasNoModifiers()) {
                            handled = this.resurrectSelectionIfNeeded() || this.arrowScroll(ListView.FOCUS_DOWN);
                        } else if (event.hasModifiers(KeyEvent.META_SHIFT_ON)) {
                            handled = this.resurrectSelectionIfNeeded() || this.arrowScroll(ListView.FOCUS_UP);
                        }
                    }
                    break;
            }
        }
        if (handled) {
            return true;
        }
        //if (this.sendToTextFilter(keyCode, count, event)) {
        //    return true;
        //}
        switch(action) {
            case KeyEvent.ACTION_DOWN:
                return super.onKeyDown(keyCode, event);
            case KeyEvent.ACTION_UP:
                return super.onKeyUp(keyCode, event);
            //case KeyEvent.ACTION_MULTIPLE:
            //    return super.onKeyMultiple(keyCode, count, event);
            default:
                // shouldn't happen
                return false;
        }
    }

    /**
     * Scrolls up or down by the number of items currently present on screen.
     *
     * @param direction either {@link View#FOCUS_UP} or {@link View#FOCUS_DOWN}
     * @return whether selection was moved
     */
    pageScroll(direction:number):boolean  {
        let nextPage:number;
        let down:boolean;
        if (direction == ListView.FOCUS_UP) {
            nextPage = Math.max(0, this.mSelectedPosition - this.getChildCount() - 1);
            down = false;
        } else if (direction == ListView.FOCUS_DOWN) {
            nextPage = Math.min(this.mItemCount - 1, this.mSelectedPosition + this.getChildCount() - 1);
            down = true;
        } else {
            return false;
        }
        if (nextPage >= 0) {
            const position:number = this.lookForSelectablePositionAfter(this.mSelectedPosition, nextPage, down);
            if (position >= 0) {
                this.mLayoutMode = ListView.LAYOUT_SPECIFIC;
                this.mSpecificTop = this.mPaddingTop + this.getVerticalFadingEdgeLength();
                if (down && (position > (this.mItemCount - this.getChildCount()))) {
                    this.mLayoutMode = ListView.LAYOUT_FORCE_BOTTOM;
                }
                if (!down && (position < this.getChildCount())) {
                    this.mLayoutMode = ListView.LAYOUT_FORCE_TOP;
                }
                this.setSelectionInt(position);
                this.invokeOnItemScrollListener();
                if (!this.awakenScrollBars()) {
                    this.invalidate();
                }
                return true;
            }
        }
        return false;
    }

    /**
     * Go to the last or first item if possible (not worrying about panning
     * across or navigating within the internal focus of the currently selected
     * item.)
     *
     * @param direction either {@link View#FOCUS_UP} or {@link View#FOCUS_DOWN}
     * @return whether selection was moved
     */
    fullScroll(direction:number):boolean  {
        let moved:boolean = false;
        if (direction == ListView.FOCUS_UP) {
            if (this.mSelectedPosition != 0) {
                const position:number = this.lookForSelectablePositionAfter(this.mSelectedPosition, 0, true);
                if (position >= 0) {
                    this.mLayoutMode = ListView.LAYOUT_FORCE_TOP;
                    this.setSelectionInt(position);
                    this.invokeOnItemScrollListener();
                }
                moved = true;
            }
        } else if (direction == ListView.FOCUS_DOWN) {
            const lastItem:number = (this.mItemCount - 1);
            if (this.mSelectedPosition < lastItem) {
                const position:number = this.lookForSelectablePositionAfter(this.mSelectedPosition, lastItem, false);
                if (position >= 0) {
                    this.mLayoutMode = ListView.LAYOUT_FORCE_BOTTOM;
                    this.setSelectionInt(position);
                    this.invokeOnItemScrollListener();
                }
                moved = true;
            }
        }
        if (moved && !this.awakenScrollBars()) {
            this.awakenScrollBars();
            this.invalidate();
        }
        return moved;
    }

    /**
     * To avoid horizontal focus searches changing the selected item, we
     * manually focus search within the selected item (as applicable), and
     * prevent focus from jumping to something within another item.
     * @param direction one of {View.FOCUS_LEFT, View.FOCUS_RIGHT}
     * @return Whether this consumes the key event.
     */
    private handleHorizontalFocusWithinListItem(direction:number):boolean  {
        if (direction != View.FOCUS_LEFT && direction != View.FOCUS_RIGHT) {
            throw Error(`new IllegalArgumentException("direction must be one of" + " {View.FOCUS_LEFT, View.FOCUS_RIGHT}")`);
        }
        const numChildren:number = this.getChildCount();
        if (this.mItemsCanFocus && numChildren > 0 && this.mSelectedPosition != ListView.INVALID_POSITION) {
            const selectedView:View = this.getSelectedView();
            if (selectedView != null && selectedView.hasFocus() && selectedView instanceof ViewGroup) {
                const currentFocus:View = selectedView.findFocus();
                const nextFocus:View = FocusFinder.getInstance().findNextFocus(<ViewGroup> selectedView, currentFocus, direction);
                if (nextFocus != null) {
                    // do the math to get interesting rect in next focus' coordinates
                    currentFocus.getFocusedRect(this.mTempRect);
                    this.offsetDescendantRectToMyCoords(currentFocus, this.mTempRect);
                    this.offsetRectIntoDescendantCoords(nextFocus, this.mTempRect);
                    if (nextFocus.requestFocus(direction, this.mTempRect)) {
                        return true;
                    }
                }
                // we are blocking the key from being handled (by returning true)
                // if the global result is going to be some other view within this
                // list.  this is to acheive the overall goal of having
                // horizontal d-pad navigation remain in the current item.
                const globalNextFocus:View = FocusFinder.getInstance().findNextFocus(<ViewGroup> this.getRootView(), currentFocus, direction);
                if (globalNextFocus != null) {
                    return this.isViewAncestorOf(globalNextFocus, this);
                }
            }
        }
        return false;
    }

    /**
     * Scrolls to the next or previous item if possible.
     *
     * @param direction either {@link View#FOCUS_UP} or {@link View#FOCUS_DOWN}
     *
     * @return whether selection was moved
     */
    arrowScroll(direction:number):boolean  {
        try {
            this.mInLayout = true;
            const handled:boolean = this.arrowScrollImpl(direction);
            if (handled) {
                this.playSoundEffect(SoundEffectConstants.getContantForFocusDirection(direction));
            }
            return handled;
        } finally {
            this.mInLayout = false;
        }
    }

    /**
     * Used by {@link #arrowScrollImpl(int)} to help determine the next selected position
     * to move to. This return a position in the direction given if the selected item
     * is fully visible.
     *
     * @param selectedView Current selected view to move from
     * @param selectedPos Current selected position to move from
     * @param direction Direction to move in
     * @return Desired selected position after moving in the given direction
     */
    private nextSelectedPositionForDirection(selectedView:View, selectedPos:number, direction:number):number  {
        let nextSelected:number;
        if (direction == View.FOCUS_DOWN) {
            const listBottom:number = this.getHeight() - this.mListPadding.bottom;
            if (selectedView != null && selectedView.getBottom() <= listBottom) {
                nextSelected = selectedPos != ListView.INVALID_POSITION && selectedPos >= this.mFirstPosition ? selectedPos + 1 : this.mFirstPosition;
            } else {
                return ListView.INVALID_POSITION;
            }
        } else {
            const listTop:number = this.mListPadding.top;
            if (selectedView != null && selectedView.getTop() >= listTop) {
                const lastPos:number = this.mFirstPosition + this.getChildCount() - 1;
                nextSelected = selectedPos != ListView.INVALID_POSITION && selectedPos <= lastPos ? selectedPos - 1 : lastPos;
            } else {
                return ListView.INVALID_POSITION;
            }
        }
        if (nextSelected < 0 || nextSelected >= this.mAdapter.getCount()) {
            return ListView.INVALID_POSITION;
        }
        return this.lookForSelectablePosition(nextSelected, direction == View.FOCUS_DOWN);
    }

    /**
     * Handle an arrow scroll going up or down.  Take into account whether items are selectable,
     * whether there are focusable items etc.
     *
     * @param direction Either {@link android.view.View#FOCUS_UP} or {@link android.view.View#FOCUS_DOWN}.
     * @return Whether any scrolling, selection or focus change occured.
     */
    private arrowScrollImpl(direction:number):boolean  {
        if (this.getChildCount() <= 0) {
            return false;
        }
        let selectedView:View = this.getSelectedView();
        let selectedPos:number = this.mSelectedPosition;
        let nextSelectedPosition:number = this.nextSelectedPositionForDirection(selectedView, selectedPos, direction);
        let amountToScroll:number = this.amountToScroll(direction, nextSelectedPosition);
        // if we are moving focus, we may OVERRIDE the default behavior
        const focusResult:ListView.ArrowScrollFocusResult = this.mItemsCanFocus ? this.arrowScrollFocused(direction) : null;
        if (focusResult != null) {
            nextSelectedPosition = focusResult.getSelectedPosition();
            amountToScroll = focusResult.getAmountToScroll();
        }
        let needToRedraw:boolean = focusResult != null;
        if (nextSelectedPosition != ListView.INVALID_POSITION) {
            this.handleNewSelectionChange(selectedView, direction, nextSelectedPosition, focusResult != null);
            this.setSelectedPositionInt(nextSelectedPosition);
            this.setNextSelectedPositionInt(nextSelectedPosition);
            selectedView = this.getSelectedView();
            selectedPos = nextSelectedPosition;
            if (this.mItemsCanFocus && focusResult == null) {
                // there was no new view found to take focus, make sure we
                // don't leave focus with the old selection
                const focused:View = this.getFocusedChild();
                if (focused != null) {
                    focused.clearFocus();
                }
            }
            needToRedraw = true;
            this.checkSelectionChanged();
        }
        if (amountToScroll > 0) {
            this.scrollListItemsBy((direction == View.FOCUS_UP) ? amountToScroll : -amountToScroll);
            needToRedraw = true;
        }
        // item that was panned off screen gives up focus.
        if (this.mItemsCanFocus && (focusResult == null) && selectedView != null && selectedView.hasFocus()) {
            const focused:View = selectedView.findFocus();
            if (!this.isViewAncestorOf(focused, this) || this.distanceToView(focused) > 0) {
                focused.clearFocus();
            }
        }
        // if  the current selection is panned off, we need to remove the selection
        if (nextSelectedPosition == ListView.INVALID_POSITION && selectedView != null && !this.isViewAncestorOf(selectedView, this)) {
            selectedView = null;
            this.hideSelector();
            // but we don't want to set the ressurect position (that would make subsequent
            // unhandled key events bring back the item we just scrolled off!)
            this.mResurrectToPosition = ListView.INVALID_POSITION;
        }
        if (needToRedraw) {
            if (selectedView != null) {
                this.positionSelector(selectedPos, selectedView);
                this.mSelectedTop = selectedView.getTop();
            }
            if (!this.awakenScrollBars()) {
                this.invalidate();
            }
            this.invokeOnItemScrollListener();
            return true;
        }
        return false;
    }

    /**
     * When selection changes, it is possible that the previously selected or the
     * next selected item will change its size.  If so, we need to offset some folks,
     * and re-layout the items as appropriate.
     *
     * @param selectedView The currently selected view (before changing selection).
     *   should be <code>null</code> if there was no previous selection.
     * @param direction Either {@link android.view.View#FOCUS_UP} or
     *        {@link android.view.View#FOCUS_DOWN}.
     * @param newSelectedPosition The position of the next selection.
     * @param newFocusAssigned whether new focus was assigned.  This matters because
     *        when something has focus, we don't want to show selection (ugh).
     */
    private handleNewSelectionChange(selectedView:View, direction:number, newSelectedPosition:number, newFocusAssigned:boolean):void  {
        if (newSelectedPosition == ListView.INVALID_POSITION) {
            throw Error(`new IllegalArgumentException("newSelectedPosition needs to be valid")`);
        }
        // whether or not we are moving down or up, we want to preserve the
        // top of whatever view is on top:
        // - moving down: the view that had selection
        // - moving up: the view that is getting selection
        let topView:View;
        let bottomView:View;
        let topViewIndex:number, bottomViewIndex:number;
        let topSelected:boolean = false;
        const selectedIndex:number = this.mSelectedPosition - this.mFirstPosition;
        const nextSelectedIndex:number = newSelectedPosition - this.mFirstPosition;
        if (direction == View.FOCUS_UP) {
            topViewIndex = nextSelectedIndex;
            bottomViewIndex = selectedIndex;
            topView = this.getChildAt(topViewIndex);
            bottomView = selectedView;
            topSelected = true;
        } else {
            topViewIndex = selectedIndex;
            bottomViewIndex = nextSelectedIndex;
            topView = selectedView;
            bottomView = this.getChildAt(bottomViewIndex);
        }
        const numChildren:number = this.getChildCount();
        // start with top view: is it changing size?
        if (topView != null) {
            topView.setSelected(!newFocusAssigned && topSelected);
            this.measureAndAdjustDown(topView, topViewIndex, numChildren);
        }
        // is the bottom view changing size?
        if (bottomView != null) {
            bottomView.setSelected(!newFocusAssigned && !topSelected);
            this.measureAndAdjustDown(bottomView, bottomViewIndex, numChildren);
        }
    }

    /**
     * Re-measure a child, and if its height changes, lay it out preserving its
     * top, and adjust the children below it appropriately.
     * @param child The child
     * @param childIndex The view group index of the child.
     * @param numChildren The number of children in the view group.
     */
    private measureAndAdjustDown(child:View, childIndex:number, numChildren:number):void  {
        let oldHeight:number = child.getHeight();
        this.measureItem(child);
        if (child.getMeasuredHeight() != oldHeight) {
            // lay out the view, preserving its top
            this.relayoutMeasuredItem(child);
            // adjust views below appropriately
            const heightDelta:number = child.getMeasuredHeight() - oldHeight;
            for (let i:number = childIndex + 1; i < numChildren; i++) {
                this.getChildAt(i).offsetTopAndBottom(heightDelta);
            }
        }
    }

    /**
     * Measure a particular list child.
     * TODO: unify with setUpChild.
     * @param child The child.
     */
    private measureItem(child:View):void  {
        let p:ViewGroup.LayoutParams = child.getLayoutParams();
        if (p == null) {
            p = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        }
        let childWidthSpec:number = ViewGroup.getChildMeasureSpec(this.mWidthMeasureSpec, this.mListPadding.left + this.mListPadding.right, p.width);
        let lpHeight:number = p.height;
        let childHeightSpec:number;
        if (lpHeight > 0) {
            childHeightSpec = View.MeasureSpec.makeMeasureSpec(lpHeight, View.MeasureSpec.EXACTLY);
        } else {
            childHeightSpec = View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED);
        }
        child.measure(childWidthSpec, childHeightSpec);
    }

    /**
     * Layout a child that has been measured, preserving its top position.
     * TODO: unify with setUpChild.
     * @param child The child.
     */
    private relayoutMeasuredItem(child:View):void  {
        const w:number = child.getMeasuredWidth();
        const h:number = child.getMeasuredHeight();
        const childLeft:number = this.mListPadding.left;
        const childRight:number = childLeft + w;
        const childTop:number = child.getTop();
        const childBottom:number = childTop + h;
        child.layout(childLeft, childTop, childRight, childBottom);
    }

    /**
     * @return The amount to preview next items when arrow srolling.
     */
    private getArrowScrollPreviewLength():number  {
        return Math.max(ListView.MIN_SCROLL_PREVIEW_PIXELS, this.getVerticalFadingEdgeLength());
    }

    /**
     * Determine how much we need to scroll in order to get the next selected view
     * visible, with a fading edge showing below as applicable.  The amount is
     * capped at {@link #getMaxScrollAmount()} .
     *
     * @param direction either {@link android.view.View#FOCUS_UP} or
     *        {@link android.view.View#FOCUS_DOWN}.
     * @param nextSelectedPosition The position of the next selection, or
     *        {@link #INVALID_POSITION} if there is no next selectable position
     * @return The amount to scroll. Note: this is always positive!  Direction
     *         needs to be taken into account when actually scrolling.
     */
    private amountToScroll(direction:number, nextSelectedPosition:number):number  {
        const listBottom:number = this.getHeight() - this.mListPadding.bottom;
        const listTop:number = this.mListPadding.top;
        let numChildren:number = this.getChildCount();
        if (direction == View.FOCUS_DOWN) {
            let indexToMakeVisible:number = numChildren - 1;
            if (nextSelectedPosition != ListView.INVALID_POSITION) {
                indexToMakeVisible = nextSelectedPosition - this.mFirstPosition;
            }
            while (numChildren <= indexToMakeVisible) {
                // Child to view is not attached yet.
                this.addViewBelow(this.getChildAt(numChildren - 1), this.mFirstPosition + numChildren - 1);
                numChildren++;
            }
            const positionToMakeVisible:number = this.mFirstPosition + indexToMakeVisible;
            const viewToMakeVisible:View = this.getChildAt(indexToMakeVisible);
            let goalBottom:number = listBottom;
            if (positionToMakeVisible < this.mItemCount - 1) {
                goalBottom -= this.getArrowScrollPreviewLength();
            }
            if (viewToMakeVisible.getBottom() <= goalBottom) {
                // item is fully visible.
                return 0;
            }
            if (nextSelectedPosition != ListView.INVALID_POSITION && (goalBottom - viewToMakeVisible.getTop()) >= this.getMaxScrollAmount()) {
                // item already has enough of it visible, changing selection is good enough
                return 0;
            }
            let amountToScroll:number = (viewToMakeVisible.getBottom() - goalBottom);
            if ((this.mFirstPosition + numChildren) == this.mItemCount) {
                // last is last in list -> make sure we don't scroll past it
                const max:number = this.getChildAt(numChildren - 1).getBottom() - listBottom;
                amountToScroll = Math.min(amountToScroll, max);
            }
            return Math.min(amountToScroll, this.getMaxScrollAmount());
        } else {
            let indexToMakeVisible:number = 0;
            if (nextSelectedPosition != ListView.INVALID_POSITION) {
                indexToMakeVisible = nextSelectedPosition - this.mFirstPosition;
            }
            while (indexToMakeVisible < 0) {
                // Child to view is not attached yet.
                this.addViewAbove(this.getChildAt(0), this.mFirstPosition);
                this.mFirstPosition--;
                indexToMakeVisible = nextSelectedPosition - this.mFirstPosition;
            }
            const positionToMakeVisible:number = this.mFirstPosition + indexToMakeVisible;
            const viewToMakeVisible:View = this.getChildAt(indexToMakeVisible);
            let goalTop:number = listTop;
            if (positionToMakeVisible > 0) {
                goalTop += this.getArrowScrollPreviewLength();
            }
            if (viewToMakeVisible.getTop() >= goalTop) {
                // item is fully visible.
                return 0;
            }
            if (nextSelectedPosition != ListView.INVALID_POSITION && (viewToMakeVisible.getBottom() - goalTop) >= this.getMaxScrollAmount()) {
                // item already has enough of it visible, changing selection is good enough
                return 0;
            }
            let amountToScroll:number = (goalTop - viewToMakeVisible.getTop());
            if (this.mFirstPosition == 0) {
                // first is first in list -> make sure we don't scroll past it
                const max:number = listTop - this.getChildAt(0).getTop();
                amountToScroll = Math.min(amountToScroll, max);
            }
            return Math.min(amountToScroll, this.getMaxScrollAmount());
        }
    }



    /**
     * @param direction either {@link android.view.View#FOCUS_UP} or
     *        {@link android.view.View#FOCUS_DOWN}.
     * @return The position of the next selectable position of the views that
     *         are currently visible, taking into account the fact that there might
     *         be no selection.  Returns {@link #INVALID_POSITION} if there is no
     *         selectable view on screen in the given direction.
     */
    private lookForSelectablePositionOnScreen(direction:number):number  {
        const firstPosition:number = this.mFirstPosition;
        if (direction == View.FOCUS_DOWN) {
            let startPos:number = (this.mSelectedPosition != ListView.INVALID_POSITION) ? this.mSelectedPosition + 1 : firstPosition;
            if (startPos >= this.mAdapter.getCount()) {
                return ListView.INVALID_POSITION;
            }
            if (startPos < firstPosition) {
                startPos = firstPosition;
            }
            const lastVisiblePos:number = this.getLastVisiblePosition();
            const adapter:ListAdapter = this.getAdapter();
            for (let pos:number = startPos; pos <= lastVisiblePos; pos++) {
                if (adapter.isEnabled(pos) && this.getChildAt(pos - firstPosition).getVisibility() == View.VISIBLE) {
                    return pos;
                }
            }
        } else {
            let last:number = firstPosition + this.getChildCount() - 1;
            let startPos:number = (this.mSelectedPosition != ListView.INVALID_POSITION) ? this.mSelectedPosition - 1 : firstPosition + this.getChildCount() - 1;
            if (startPos < 0 || startPos >= this.mAdapter.getCount()) {
                return ListView.INVALID_POSITION;
            }
            if (startPos > last) {
                startPos = last;
            }
            const adapter:ListAdapter = this.getAdapter();
            for (let pos:number = startPos; pos >= firstPosition; pos--) {
                if (adapter.isEnabled(pos) && this.getChildAt(pos - firstPosition).getVisibility() == View.VISIBLE) {
                    return pos;
                }
            }
        }
        return ListView.INVALID_POSITION;
    }

    /**
     * Do an arrow scroll based on focus searching.  If a new view is
     * given focus, return the selection delta and amount to scroll via
     * an {@link ArrowScrollFocusResult}, otherwise, return null.
     *
     * @param direction either {@link android.view.View#FOCUS_UP} or
     *        {@link android.view.View#FOCUS_DOWN}.
     * @return The result if focus has changed, or <code>null</code>.
     */
    private arrowScrollFocused(direction:number):ListView.ArrowScrollFocusResult  {
        const selectedView:View = this.getSelectedView();
        let newFocus:View;
        if (selectedView != null && selectedView.hasFocus()) {
            let oldFocus:View = selectedView.findFocus();
            newFocus = FocusFinder.getInstance().findNextFocus(this, oldFocus, direction);
        } else {
            if (direction == View.FOCUS_DOWN) {
                const topFadingEdgeShowing:boolean = (this.mFirstPosition > 0);
                const listTop:number = this.mListPadding.top + (topFadingEdgeShowing ? this.getArrowScrollPreviewLength() : 0);
                const ySearchPoint:number = (selectedView != null && selectedView.getTop() > listTop) ? selectedView.getTop() : listTop;
                this.mTempRect.set(0, ySearchPoint, 0, ySearchPoint);
            } else {
                const bottomFadingEdgeShowing:boolean = (this.mFirstPosition + this.getChildCount() - 1) < this.mItemCount;
                const listBottom:number = this.getHeight() - this.mListPadding.bottom - (bottomFadingEdgeShowing ? this.getArrowScrollPreviewLength() : 0);
                const ySearchPoint:number = (selectedView != null && selectedView.getBottom() < listBottom) ? selectedView.getBottom() : listBottom;
                this.mTempRect.set(0, ySearchPoint, 0, ySearchPoint);
            }
            newFocus = FocusFinder.getInstance().findNextFocusFromRect(this, this.mTempRect, direction);
        }
        if (newFocus != null) {
            const positionOfNewFocus:number = this.positionOfNewFocus(newFocus);
            // we aren't jumping over another selectable position
            if (this.mSelectedPosition != ListView.INVALID_POSITION && positionOfNewFocus != this.mSelectedPosition) {
                const selectablePosition:number = this.lookForSelectablePositionOnScreen(direction);
                if (selectablePosition != ListView.INVALID_POSITION && ((direction == View.FOCUS_DOWN && selectablePosition < positionOfNewFocus) || (direction == View.FOCUS_UP && selectablePosition > positionOfNewFocus))) {
                    return null;
                }
            }
            let focusScroll:number = this.amountToScrollToNewFocus(direction, newFocus, positionOfNewFocus);
            const maxScrollAmount:number = this.getMaxScrollAmount();
            if (focusScroll < maxScrollAmount) {
                // not moving too far, safe to give next view focus
                newFocus.requestFocus(direction);
                this.mArrowScrollFocusResult.populate(positionOfNewFocus, focusScroll);
                return this.mArrowScrollFocusResult;
            } else if (this.distanceToView(newFocus) < maxScrollAmount) {
                // Case to consider:
                // too far to get entire next focusable on screen, but by going
                // max scroll amount, we are getting it at least partially in view,
                // so give it focus and scroll the max ammount.
                newFocus.requestFocus(direction);
                this.mArrowScrollFocusResult.populate(positionOfNewFocus, maxScrollAmount);
                return this.mArrowScrollFocusResult;
            }
        }
        return null;
    }

    /**
     * @param newFocus The view that would have focus.
     * @return the position that contains newFocus
     */
    private positionOfNewFocus(newFocus:View):number  {
        const numChildren:number = this.getChildCount();
        for (let i:number = 0; i < numChildren; i++) {
            const child:View = this.getChildAt(i);
            if (this.isViewAncestorOf(newFocus, child)) {
                return this.mFirstPosition + i;
            }
        }
        throw Error(`new IllegalArgumentException("newFocus is not a child of any of the" + " children of the list!")`);
    }

    /**
     * Return true if child is an ancestor of parent, (or equal to the parent).
     */
    private isViewAncestorOf(child:View, parent:View):boolean  {
        if (child == parent) {
            return true;
        }
        const theParent:ViewParent = child.getParent();
        return (theParent instanceof ViewGroup) && this.isViewAncestorOf(<View> theParent, parent);
    }

    /**
     * Determine how much we need to scroll in order to get newFocus in view.
     * @param direction either {@link android.view.View#FOCUS_UP} or
     *        {@link android.view.View#FOCUS_DOWN}.
     * @param newFocus The view that would take focus.
     * @param positionOfNewFocus The position of the list item containing newFocus
     * @return The amount to scroll.  Note: this is always positive!  Direction
     *   needs to be taken into account when actually scrolling.
     */
    private amountToScrollToNewFocus(direction:number, newFocus:View, positionOfNewFocus:number):number  {
        let amountToScroll:number = 0;
        newFocus.getDrawingRect(this.mTempRect);
        this.offsetDescendantRectToMyCoords(newFocus, this.mTempRect);
        if (direction == View.FOCUS_UP) {
            if (this.mTempRect.top < this.mListPadding.top) {
                amountToScroll = this.mListPadding.top - this.mTempRect.top;
                if (positionOfNewFocus > 0) {
                    amountToScroll += this.getArrowScrollPreviewLength();
                }
            }
        } else {
            const listBottom:number = this.getHeight() - this.mListPadding.bottom;
            if (this.mTempRect.bottom > listBottom) {
                amountToScroll = this.mTempRect.bottom - listBottom;
                if (positionOfNewFocus < this.mItemCount - 1) {
                    amountToScroll += this.getArrowScrollPreviewLength();
                }
            }
        }
        return amountToScroll;
    }

    /**
     * Determine the distance to the nearest edge of a view in a particular
     * direction.
     * 
     * @param descendant A descendant of this list.
     * @return The distance, or 0 if the nearest edge is already on screen.
     */
    private distanceToView(descendant:View):number  {
        let distance:number = 0;
        descendant.getDrawingRect(this.mTempRect);
        this.offsetDescendantRectToMyCoords(descendant, this.mTempRect);
        const listBottom:number = this.mBottom - this.mTop - this.mListPadding.bottom;
        if (this.mTempRect.bottom < this.mListPadding.top) {
            distance = this.mListPadding.top - this.mTempRect.bottom;
        } else if (this.mTempRect.top > listBottom) {
            distance = this.mTempRect.top - listBottom;
        }
        return distance;
    }

    /**
     * Scroll the children by amount, adding a view at the end and removing
     * views that fall off as necessary.
     *
     * @param amount The amount (positive or negative) to scroll.
     */
    private scrollListItemsBy(amount:number):void  {
        this.offsetChildrenTopAndBottom(amount);
        const listBottom:number = this.getHeight() - this.mListPadding.bottom;
        const listTop:number = this.mListPadding.top;
        const recycleBin:AbsListView.RecycleBin = this.mRecycler;
        if (amount < 0) {
            // shifted items up
            // may need to pan views into the bottom space
            let numChildren:number = this.getChildCount();
            let last:View = this.getChildAt(numChildren - 1);
            while (last.getBottom() < listBottom) {
                const lastVisiblePosition:number = this.mFirstPosition + numChildren - 1;
                if (lastVisiblePosition < this.mItemCount - 1) {
                    last = this.addViewBelow(last, lastVisiblePosition);
                    numChildren++;
                } else {
                    break;
                }
            }
            // to shift back
            if (last.getBottom() < listBottom) {
                this.offsetChildrenTopAndBottom(listBottom - last.getBottom());
            }
            // top views may be panned off screen
            let first:View = this.getChildAt(0);
            while (first.getBottom() < listTop) {
                let layoutParams:AbsListView.LayoutParams = <AbsListView.LayoutParams> first.getLayoutParams();
                if (recycleBin.shouldRecycleViewType(layoutParams.viewType)) {
                    recycleBin.addScrapView(first, this.mFirstPosition);
                }
                this.detachViewFromParent(first);
                first = this.getChildAt(0);
                this.mFirstPosition++;
            }
        } else {
            // shifted items down
            let first:View = this.getChildAt(0);
            // may need to pan views into top
            while ((first.getTop() > listTop) && (this.mFirstPosition > 0)) {
                first = this.addViewAbove(first, this.mFirstPosition);
                this.mFirstPosition--;
            }
            // need to shift it back
            if (first.getTop() > listTop) {
                this.offsetChildrenTopAndBottom(listTop - first.getTop());
            }
            let lastIndex:number = this.getChildCount() - 1;
            let last:View = this.getChildAt(lastIndex);
            // bottom view may be panned off screen
            while (last.getTop() > listBottom) {
                let layoutParams:AbsListView.LayoutParams = <AbsListView.LayoutParams> last.getLayoutParams();
                if (recycleBin.shouldRecycleViewType(layoutParams.viewType)) {
                    recycleBin.addScrapView(last, this.mFirstPosition + lastIndex);
                }
                this.detachViewFromParent(last);
                last = this.getChildAt(--lastIndex);
            }
        }
    }

    private addViewAbove(theView:View, position:number):View  {
        let abovePosition:number = position - 1;
        let view:View = this.obtainView(abovePosition, this.mIsScrap);
        let edgeOfNewChild:number = theView.getTop() - this.mDividerHeight;
        this.setupChild(view, abovePosition, edgeOfNewChild, false, this.mListPadding.left, false, this.mIsScrap[0]);
        return view;
    }

    private addViewBelow(theView:View, position:number):View  {
        let belowPosition:number = position + 1;
        let view:View = this.obtainView(belowPosition, this.mIsScrap);
        let edgeOfNewChild:number = theView.getBottom() + this.mDividerHeight;
        this.setupChild(view, belowPosition, edgeOfNewChild, true, this.mListPadding.left, false, this.mIsScrap[0]);
        return view;
    }

    /**
     * Indicates that the views created by the ListAdapter can contain focusable
     * items.
     *
     * @param itemsCanFocus true if items can get focus, false otherwise
     */
    setItemsCanFocus(itemsCanFocus:boolean):void  {
        this.mItemsCanFocus = itemsCanFocus;
        if (!itemsCanFocus) {
            this.setDescendantFocusability(ViewGroup.FOCUS_BLOCK_DESCENDANTS);
        }
    }

    /**
     * @return Whether the views created by the ListAdapter can contain focusable
     * items.
     */
    getItemsCanFocus():boolean  {
        return this.mItemsCanFocus;
    }

    isOpaque():boolean  {
        let retValue:boolean = (this.mCachingActive && this.mIsCacheColorOpaque && this.mDividerIsOpaque && this.hasOpaqueScrollbars()) || super.isOpaque();
        if (retValue) {
            // only return true if the list items cover the entire area of the view
            const listTop:number = this.mListPadding != null ? this.mListPadding.top : this.mPaddingTop;
            let first:View = this.getChildAt(0);
            if (first == null || first.getTop() > listTop) {
                return false;
            }
            const listBottom:number = this.getHeight() - (this.mListPadding != null ? this.mListPadding.bottom : this.mPaddingBottom);
            let last:View = this.getChildAt(this.getChildCount() - 1);
            if (last == null || last.getBottom() < listBottom) {
                return false;
            }
        }
        return retValue;
    }

    setCacheColorHint(color:number):void  {
        const opaque:boolean = (color >>> 24) == 0xFF;
        this.mIsCacheColorOpaque = opaque;
        if (opaque) {
            if (this.mDividerPaint == null) {
                this.mDividerPaint = new Paint();
            }
            this.mDividerPaint.setColor(color);
        }
        super.setCacheColorHint(color);
    }

    drawOverscrollHeader(canvas:Canvas, drawable:Drawable, bounds:Rect):void  {
        const height:number = drawable.getMinimumHeight();
        canvas.save();
        canvas.clipRect(bounds);
        const span:number = bounds.bottom - bounds.top;
        if (span < height) {
            bounds.top = bounds.bottom - height;
        }
        drawable.setBounds(bounds);
        drawable.draw(canvas);
        canvas.restore();
    }

    drawOverscrollFooter(canvas:Canvas, drawable:Drawable, bounds:Rect):void  {
        const height:number = drawable.getMinimumHeight();
        canvas.save();
        canvas.clipRect(bounds);
        const span:number = bounds.bottom - bounds.top;
        if (span < height) {
            bounds.bottom = bounds.top + height;
        }
        drawable.setBounds(bounds);
        drawable.draw(canvas);
        canvas.restore();
    }

    protected dispatchDraw(canvas:Canvas):void  {
        if (this.mCachingStarted) {
            this.mCachingActive = true;
        }
        // Draw the dividers
        const dividerHeight:number = this.mDividerHeight;
        const overscrollHeader:Drawable = this.mOverScrollHeader;
        const overscrollFooter:Drawable = this.mOverScrollFooter;
        const drawOverscrollHeader:boolean = overscrollHeader != null;
        const drawOverscrollFooter:boolean = overscrollFooter != null;
        const drawDividers:boolean = dividerHeight > 0 && this.mDivider != null;
        if (drawDividers || drawOverscrollHeader || drawOverscrollFooter) {
            // Only modify the top and bottom in the loop, we set the left and right here
            const bounds:Rect = this.mTempRect;
            bounds.left = this.mPaddingLeft;
            bounds.right = this.mRight - this.mLeft - this.mPaddingRight;
            const count:number = this.getChildCount();
            const headerCount:number = this.mHeaderViewInfos.size();
            const itemCount:number = this.mItemCount;
            const footerLimit:number = (itemCount - this.mFooterViewInfos.size());
            const headerDividers:boolean = this.mHeaderDividersEnabled;
            const footerDividers:boolean = this.mFooterDividersEnabled;
            const first:number = this.mFirstPosition;
            const areAllItemsSelectable:boolean = this.mAreAllItemsSelectable;
            const adapter:ListAdapter = this.mAdapter;
            // If the list is opaque *and* the background is not, we want to
            // fill a rect where the dividers would be for non-selectable items
            // If the list is opaque and the background is also opaque, we don't
            // need to draw anything since the background will do it for us
            const fillForMissingDividers:boolean = this.isOpaque() && !super.isOpaque();
            if (fillForMissingDividers && this.mDividerPaint == null && this.mIsCacheColorOpaque) {
                this.mDividerPaint = new Paint();
                this.mDividerPaint.setColor(this.getCacheColorHint());
            }
            const paint:Paint = this.mDividerPaint;
            let effectivePaddingTop:number = 0;
            let effectivePaddingBottom:number = 0;
            if ((this.mGroupFlags & ListView.CLIP_TO_PADDING_MASK) == ListView.CLIP_TO_PADDING_MASK) {
                effectivePaddingTop = this.mListPadding.top;
                effectivePaddingBottom = this.mListPadding.bottom;
            }
            const listBottom:number = this.mBottom - this.mTop - effectivePaddingBottom + this.mScrollY;
            if (!this.mStackFromBottom) {
                let bottom:number = 0;
                // Draw top divider or header for overscroll
                const scrollY:number = this.mScrollY;
                if (count > 0 && scrollY < 0) {
                    if (drawOverscrollHeader) {
                        bounds.bottom = 0;
                        bounds.top = scrollY;
                        this.drawOverscrollHeader(canvas, overscrollHeader, bounds);
                    } else if (drawDividers) {
                        bounds.bottom = 0;
                        bounds.top = -dividerHeight;
                        this.drawDivider(canvas, bounds, -1);
                    }
                }
                for (let i:number = 0; i < count; i++) {
                    const itemIndex:number = (first + i);
                    const isHeader:boolean = (itemIndex < headerCount);
                    const isFooter:boolean = (itemIndex >= footerLimit);
                    if ((headerDividers || !isHeader) && (footerDividers || !isFooter)) {
                        const child:View = this.getChildAt(i);
                        bottom = child.getBottom();
                        const isLastItem:boolean = (i == (count - 1));
                        if (drawDividers && (bottom < listBottom) && !(drawOverscrollFooter && isLastItem)) {
                            const nextIndex:number = (itemIndex + 1);
                            // footers when enabled, and the end of the list.
                            if (areAllItemsSelectable || ((adapter.isEnabled(itemIndex) || (headerDividers && isHeader) || (footerDividers && isFooter)) && (isLastItem || adapter.isEnabled(nextIndex) || (headerDividers && (nextIndex < headerCount)) || (footerDividers && (nextIndex >= footerLimit))))) {
                                bounds.top = bottom;
                                bounds.bottom = bottom + dividerHeight;
                                this.drawDivider(canvas, bounds, i);
                            } else if (fillForMissingDividers) {
                                bounds.top = bottom;
                                bounds.bottom = bottom + dividerHeight;
                                canvas.drawRect(bounds, paint);
                            }
                        }
                    }
                }
                const overFooterBottom:number = this.mBottom + this.mScrollY;
                if (drawOverscrollFooter && first + count == itemCount && overFooterBottom > bottom) {
                    bounds.top = bottom;
                    bounds.bottom = overFooterBottom;
                    this.drawOverscrollFooter(canvas, overscrollFooter, bounds);
                }
            } else {
                let top:number;
                const scrollY:number = this.mScrollY;
                if (count > 0 && drawOverscrollHeader) {
                    bounds.top = scrollY;
                    bounds.bottom = this.getChildAt(0).getTop();
                    this.drawOverscrollHeader(canvas, overscrollHeader, bounds);
                }
                const start:number = drawOverscrollHeader ? 1 : 0;
                for (let i:number = start; i < count; i++) {
                    const itemIndex:number = (first + i);
                    const isHeader:boolean = (itemIndex < headerCount);
                    const isFooter:boolean = (itemIndex >= footerLimit);
                    if ((headerDividers || !isHeader) && (footerDividers || !isFooter)) {
                        const child:View = this.getChildAt(i);
                        top = child.getTop();
                        if (drawDividers && (top > effectivePaddingTop)) {
                            const isFirstItem:boolean = (i == start);
                            const previousIndex:number = (itemIndex - 1);
                            // footers when enabled, and the end of the list.
                            if (areAllItemsSelectable || ((adapter.isEnabled(itemIndex) || (headerDividers && isHeader) || (footerDividers && isFooter)) && (isFirstItem || adapter.isEnabled(previousIndex) || (headerDividers && (previousIndex < headerCount)) || (footerDividers && (previousIndex >= footerLimit))))) {
                                bounds.top = top - dividerHeight;
                                bounds.bottom = top;
                                // Give the method the child ABOVE the divider,
                                // so we subtract one from our child position.
                                // Give -1 when there is no child above the
                                // divider.
                                this.drawDivider(canvas, bounds, i - 1);
                            } else if (fillForMissingDividers) {
                                bounds.top = top - dividerHeight;
                                bounds.bottom = top;
                                canvas.drawRect(bounds, paint);
                            }
                        }
                    }
                }
                if (count > 0 && scrollY > 0) {
                    if (drawOverscrollFooter) {
                        const absListBottom:number = this.mBottom;
                        bounds.top = absListBottom;
                        bounds.bottom = absListBottom + scrollY;
                        this.drawOverscrollFooter(canvas, overscrollFooter, bounds);
                    } else if (drawDividers) {
                        bounds.top = listBottom;
                        bounds.bottom = listBottom + dividerHeight;
                        this.drawDivider(canvas, bounds, -1);
                    }
                }
            }
        }
        // Draw the indicators (these should be drawn above the dividers) and children
        super.dispatchDraw(canvas);
    }

    protected drawChild(canvas:Canvas, child:View, drawingTime:number):boolean  {
        let more:boolean = super.drawChild(canvas, child, drawingTime);
        if (this.mCachingActive && child.mCachingFailed) {
            this.mCachingActive = false;
        }
        return more;
    }

    /**
     * Draws a divider for the given child in the given bounds.
     *
     * @param canvas The canvas to draw to.
     * @param bounds The bounds of the divider.
     * @param childIndex The index of child (of the View) above the divider.
     *            This will be -1 if there is no child above the divider to be
     *            drawn.
     */
    drawDivider(canvas:Canvas, bounds:Rect, childIndex:number):void  {
        // This widget draws the same divider for all children
        const divider:Drawable = this.mDivider;
        divider.setBounds(bounds);
        divider.draw(canvas);
    }

    /**
     * Returns the drawable that will be drawn between each item in the list.
     *
     * @return the current drawable drawn between list elements
     */
    getDivider():Drawable  {
        return this.mDivider;
    }

    /**
     * Sets the drawable that will be drawn between each item in the list. If the drawable does
     * not have an intrinsic height, you should also call {@link #setDividerHeight(int)}
     *
     * @param divider The drawable to use.
     */
    setDivider(divider:Drawable):void  {
        if (divider != null) {
            this.mDividerHeight = divider.getIntrinsicHeight();
        } else {
            this.mDividerHeight = 0;
        }
        this.mDivider = divider;
        this.mDividerIsOpaque = divider == null || divider.getOpacity() == PixelFormat.OPAQUE;
        this.requestLayout();
        this.invalidate();
    }

    /**
     * @return Returns the height of the divider that will be drawn between each item in the list.
     */
    getDividerHeight():number  {
        return this.mDividerHeight;
    }

    /**
     * Sets the height of the divider that will be drawn between each item in the list. Calling
     * this will override the intrinsic height as set by {@link #setDivider(Drawable)}
     *
     * @param height The new height of the divider in pixels.
     */
    setDividerHeight(height:number):void  {
        this.mDividerHeight = height;
        this.requestLayout();
        this.invalidate();
    }

    /**
     * Enables or disables the drawing of the divider for header views.
     *
     * @param headerDividersEnabled True to draw the headers, false otherwise.
     *
     * @see #setFooterDividersEnabled(boolean)
     * @see #areHeaderDividersEnabled()
     * @see #addHeaderView(android.view.View)
     */
    setHeaderDividersEnabled(headerDividersEnabled:boolean):void  {
        this.mHeaderDividersEnabled = headerDividersEnabled;
        this.invalidate();
    }

    /**
     * @return Whether the drawing of the divider for header views is enabled
     *
     * @see #setHeaderDividersEnabled(boolean)
     */
    areHeaderDividersEnabled():boolean  {
        return this.mHeaderDividersEnabled;
    }

    /**
     * Enables or disables the drawing of the divider for footer views.
     *
     * @param footerDividersEnabled True to draw the footers, false otherwise.
     *
     * @see #setHeaderDividersEnabled(boolean)
     * @see #areFooterDividersEnabled()
     * @see #addFooterView(android.view.View)
     */
    setFooterDividersEnabled(footerDividersEnabled:boolean):void  {
        this.mFooterDividersEnabled = footerDividersEnabled;
        this.invalidate();
    }

    /**
     * @return Whether the drawing of the divider for footer views is enabled
     *
     * @see #setFooterDividersEnabled(boolean)
     */
    areFooterDividersEnabled():boolean  {
        return this.mFooterDividersEnabled;
    }

    /**
     * Sets the drawable that will be drawn above all other list content.
     * This area can become visible when the user overscrolls the list.
     *
     * @param header The drawable to use
     */
    setOverscrollHeader(header:Drawable):void  {
        this.mOverScrollHeader = header;
        if (this.mScrollY < 0) {
            this.invalidate();
        }
    }

    /**
     * @return The drawable that will be drawn above all other list content
     */
    getOverscrollHeader():Drawable  {
        return this.mOverScrollHeader;
    }

    /**
     * Sets the drawable that will be drawn below all other list content.
     * This area can become visible when the user overscrolls the list,
     * or when the list's content does not fully fill the container area.
     *
     * @param footer The drawable to use
     */
    setOverscrollFooter(footer:Drawable):void  {
        this.mOverScrollFooter = footer;
        this.invalidate();
    }

    /**
     * @return The drawable that will be drawn below all other list content
     */
    getOverscrollFooter():Drawable  {
        return this.mOverScrollFooter;
    }

    onFocusChanged(gainFocus:boolean, direction:number, previouslyFocusedRect:Rect):void  {
        super.onFocusChanged(gainFocus, direction, previouslyFocusedRect);
        const adapter:ListAdapter = this.mAdapter;
        let closetChildIndex:number = -1;
        let closestChildTop:number = 0;
        if (adapter != null && gainFocus && previouslyFocusedRect != null) {
            previouslyFocusedRect.offset(this.mScrollX, this.mScrollY);
            // it could change in layoutChildren.
            if (adapter.getCount() < this.getChildCount() + this.mFirstPosition) {
                this.mLayoutMode = ListView.LAYOUT_NORMAL;
                this.layoutChildren();
            }
            // figure out which item should be selected based on previously
            // focused rect
            let otherRect:Rect = this.mTempRect;
            let minDistance:number = Integer.MAX_VALUE;
            const childCount:number = this.getChildCount();
            const firstPosition:number = this.mFirstPosition;
            for (let i:number = 0; i < childCount; i++) {
                // only consider selectable views
                if (!adapter.isEnabled(firstPosition + i)) {
                    continue;
                }
                let other:View = this.getChildAt(i);
                other.getDrawingRect(otherRect);
                this.offsetDescendantRectToMyCoords(other, otherRect);
                let distance:number = ListView.getDistance(previouslyFocusedRect, otherRect, direction);
                if (distance < minDistance) {
                    minDistance = distance;
                    closetChildIndex = i;
                    closestChildTop = other.getTop();
                }
            }
        }
        if (closetChildIndex >= 0) {
            this.setSelectionFromTop(closetChildIndex + this.mFirstPosition, closestChildTop);
        } else {
            this.requestLayout();
        }
    }

    /*
     * (non-Javadoc)
     *
     * Children specified in XML are assumed to be header views. After we have
     * parsed them move them out of the children list and into mHeaderViews.
     */
    protected onFinishInflate():void  {
        super.onFinishInflate();
        let count:number = this.getChildCount();
        if (count > 0) {
            for (let i:number = 0; i < count; ++i) {
                this.addHeaderView(this.getChildAt(i));
            }
            this.removeAllViews();
        }
    }

    /* (non-Javadoc)
     * @see android.view.View#findViewById(int)
     * First look in our children, then in any header and footer views that may be scrolled off.
     */
    protected findViewTraversal(id:string):View  {
        let v:View;
        v = super.findViewTraversal(id);
        if (v == null) {
            v = this.findViewInHeadersOrFooters(this.mHeaderViewInfos, id);
            if (v != null) {
                return v;
            }
            v = this.findViewInHeadersOrFooters(this.mFooterViewInfos, id);
            if (v != null) {
                return v;
            }
        }
        return v;
    }

    /* (non-Javadoc)
     *
     * Look in the passed in list of headers or footers for the view.
     */
    findViewInHeadersOrFooters(where:ArrayList<ListView.FixedViewInfo>, id:string):View  {
        if (where != null) {
            let len:number = where.size();
            let v:View;
            for (let i:number = 0; i < len; i++) {
                v = where.get(i).view;
                if (!v.isRootNamespace()) {
                    v = v.findViewById(id);
                    if (v != null) {
                        return v;
                    }
                }
            }
        }
        return null;
    }

    /* (non-Javadoc)
     * @see android.view.View#findViewWithTag(Object)
     * First look in our children, then in any header and footer views that may be scrolled off.
     */
    //findViewWithTagTraversal(tag:any):View  {
    //    let v:View;
    //    v = super.findViewWithTagTraversal(tag);
    //    if (v == null) {
    //        v = this.findViewWithTagInHeadersOrFooters(this.mHeaderViewInfos, tag);
    //        if (v != null) {
    //            return v;
    //        }
    //        v = this.findViewWithTagInHeadersOrFooters(this.mFooterViewInfos, tag);
    //        if (v != null) {
    //            return v;
    //        }
    //    }
    //    return v;
    //}

    /* (non-Javadoc)
     *
     * Look in the passed in list of headers or footers for the view with the tag.
     */
    //findViewWithTagInHeadersOrFooters(where:ArrayList<ListView.FixedViewInfo>, tag:any):View  {
    //    if (where != null) {
    //        let len:number = where.size();
    //        let v:View;
    //        for (let i:number = 0; i < len; i++) {
    //            v = where.get(i).view;
    //            if (!v.isRootNamespace()) {
    //                v = v.findViewWithTag(tag);
    //                if (v != null) {
    //                    return v;
    //                }
    //            }
    //        }
    //    }
    //    return null;
    //}

    /**
     * @hide
     * @see android.view.View#findViewByPredicate(Predicate)
     * First look in our children, then in any header and footer views that may be scrolled off.
     */
    protected findViewByPredicateTraversal(predicate:View.Predicate<View>, childToSkip:View):View  {
        let v:View;
        v = super.findViewByPredicateTraversal(predicate, childToSkip);
        if (v == null) {
            v = this.findViewByPredicateInHeadersOrFooters(this.mHeaderViewInfos, predicate, childToSkip);
            if (v != null) {
                return v;
            }
            v = this.findViewByPredicateInHeadersOrFooters(this.mFooterViewInfos, predicate, childToSkip);
            if (v != null) {
                return v;
            }
        }
        return v;
    }

    /* (non-Javadoc)
     *
     * Look in the passed in list of headers or footers for the first view that matches
     * the predicate.
     */
    findViewByPredicateInHeadersOrFooters(where:ArrayList<ListView.FixedViewInfo>, predicate:View.Predicate<View>, childToSkip:View):View  {
        if (where != null) {
            let len:number = where.size();
            let v:View;
            for (let i:number = 0; i < len; i++) {
                v = where.get(i).view;
                if (v != childToSkip && !v.isRootNamespace()) {
                    v = v.findViewByPredicate(predicate);
                    if (v != null) {
                        return v;
                    }
                }
            }
        }
        return null;
    }

    /**
     * Returns the set of checked items ids. The result is only valid if the
     * choice mode has not been set to {@link #CHOICE_MODE_NONE}.
     * 
     * @return A new array which contains the id of each checked item in the
     *         list.
     *         
     * @deprecated Use {@link #getCheckedItemIds()} instead.
     */
    getCheckItemIds():number[]  {
        // Use new behavior that correctly handles stable ID mapping.
        if (this.mAdapter != null && this.mAdapter.hasStableIds()) {
            return this.getCheckedItemIds();
        }
        // Fall back to it to support legacy apps.
        if (this.mChoiceMode != ListView.CHOICE_MODE_NONE && this.mCheckStates != null && this.mAdapter != null) {
            const states:SparseBooleanArray = this.mCheckStates;
            const count:number = states.size();
            const ids:number[] = androidui.util.ArrayCreator.newNumberArray(count);
            const adapter:ListAdapter = this.mAdapter;
            let checkedCount:number = 0;
            for (let i:number = 0; i < count; i++) {
                if (states.valueAt(i)) {
                    ids[checkedCount++] = adapter.getItemId(states.keyAt(i));
                }
            }
            // resulting in checkedCount being smaller than count.
            if (checkedCount == count) {
                return ids;
            } else {
                const result:number[] = androidui.util.ArrayCreator.newNumberArray(checkedCount);
                System.arraycopy(ids, 0, result, 0, checkedCount);
                return result;
            }
        }
        return androidui.util.ArrayCreator.newNumberArray(0);
    }

    //onInitializeAccessibilityEvent(event:AccessibilityEvent):void  {
    //    super.onInitializeAccessibilityEvent(event);
    //    event.setClassName(ListView.class.getName());
    //}
    //
    //onInitializeAccessibilityNodeInfo(info:AccessibilityNodeInfo):void  {
    //    super.onInitializeAccessibilityNodeInfo(info);
    //    info.setClassName(ListView.class.getName());
    //    const count:number = this.getCount();
    //    const collectionInfo:CollectionInfo = CollectionInfo.obtain(1, count, false);
    //    info.setCollectionInfo(collectionInfo);
    //}
    //
    //onInitializeAccessibilityNodeInfoForItem(view:View, position:number, info:AccessibilityNodeInfo):void  {
    //    super.onInitializeAccessibilityNodeInfoForItem(view, position, info);
    //    const lp:LayoutParams = <LayoutParams> view.getLayoutParams();
    //    const isHeading:boolean = lp != null && lp.viewType != ListView.ITEM_VIEW_TYPE_HEADER_OR_FOOTER;
    //    const itemInfo:CollectionItemInfo = CollectionItemInfo.obtain(0, 1, position, 1, isHeading);
    //    info.setCollectionItemInfo(itemInfo);
    //}
}

export module ListView{
/**
     * A class that represents a fixed view in a list, for example a header at the top
     * or a footer at the bottom.
     */
export class FixedViewInfo {
    _ListView_this:ListView;
    constructor(arg:ListView){
        this._ListView_this = arg;
    }

    /** The view to add to the list */
    view:View;

    /** The data backing the view. This is returned from {@link ListAdapter#getItem(int)}. */
    data:any;

    /** <code>true</code> if the fixed view should be selectable in the list */
    isSelectable:boolean;
}
export class FocusSelector implements Runnable {
    _ListView_this:ListView;
    constructor(arg:ListView){
        this._ListView_this = arg;
    }

    private mPosition:number = 0;

    private mPositionTop:number = 0;

    setup(position:number, top:number):ListView.FocusSelector  {
        this.mPosition = position;
        this.mPositionTop = top;
        return this;
    }

    run():void  {
        this._ListView_this.setSelectionFromTop(this.mPosition, this.mPositionTop);
    }
}
/**
     * Holds results of focus aware arrow scrolling.
     */
export class ArrowScrollFocusResult {

    private mSelectedPosition:number = 0;

    private mAmountToScroll:number = 0;

    /**
         * How {@link android.widget.ListView#arrowScrollFocused} returns its values.
         */
    populate(selectedPosition:number, amountToScroll:number):void  {
        this.mSelectedPosition = selectedPosition;
        this.mAmountToScroll = amountToScroll;
    }

    getSelectedPosition():number  {
        return this.mSelectedPosition;
    }

    getAmountToScroll():number  {
        return this.mAmountToScroll;
    }
}
}

}
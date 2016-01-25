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

///<reference path="../../android/database/DataSetObserver.ts"/>
///<reference path="../../android/os/SystemClock.ts"/>
///<reference path="../../android/util/SparseArray.ts"/>
///<reference path="../../android/view/SoundEffectConstants.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../java/lang/Long.ts"/>
///<reference path="Adapter.ts"/>


module android.widget {
    import DataSetObserver = android.database.DataSetObserver;
    import SystemClock = android.os.SystemClock;
    import SparseArray = android.util.SparseArray;
    import SoundEffectConstants = android.view.SoundEffectConstants;
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import Long = java.lang.Long;
    import Runnable = java.lang.Runnable;
    /**
     * An AdapterView is a view whose children are determined by an {@link Adapter}.
     *
     * <p>
     * See {@link ListView}, {@link GridView}, {@link Spinner} and
     *      {@link Gallery} for commonly used subclasses of AdapterView.
     *
     * <div class="special reference">
     * <h3>Developer Guides</h3>
     * <p>For more information about using AdapterView, read the
     * <a href="{@docRoot}guide/topics/ui/binding.html">Binding to Data with AdapterView</a>
     * developer guide.</p></div>
     */
    export abstract class AdapterView<T extends Adapter> extends ViewGroup {

        /**
         * The item view type returned by {@link Adapter#getItemViewType(int)} when
         * the adapter does not want the item's view recycled.
         */
        static ITEM_VIEW_TYPE_IGNORE:number = -1;

        /**
         * The item view type returned by {@link Adapter#getItemViewType(int)} when
         * the item is a header or footer.
         */
        static ITEM_VIEW_TYPE_HEADER_OR_FOOTER:number = -2;

        /**
         * The position of the first child displayed
         */
        mFirstPosition:number = 0;

        /**
         * The offset in pixels from the top of the AdapterView to the top
         * of the view to select during the next layout.
         */
        mSpecificTop:number = 0

        /**
         * Position from which to start looking for mSyncRowId
         */
        mSyncPosition:number = 0;

        /**
         * Row id to look for when data has changed
         */
        mSyncRowId:number = AdapterView.INVALID_ROW_ID;

        /**
         * Height of the view when mSyncPosition and mSyncRowId where set
         */
        mSyncHeight:number = 0;

        /**
         * True if we need to sync to mSyncRowId
         */
        mNeedSync:boolean = false;

        /**
         * Indicates whether to sync based on the selection or position. Possible
         * values are {@link #SYNC_SELECTED_POSITION} or
         * {@link #SYNC_FIRST_POSITION}.
         */
        mSyncMode:number = 0;

        /**
         * Our height after the last layout
         */
        private mLayoutHeight:number = 0;

        /**
         * Sync based on the selected child
         */
        static SYNC_SELECTED_POSITION:number = 0;

        /**
         * Sync based on the first child displayed
         */
        static SYNC_FIRST_POSITION:number = 1;

        /**
         * Maximum amount of time to spend in {@link #findSyncPosition()}
         */
        static SYNC_MAX_DURATION_MILLIS:number = 100;

        /**
         * Indicates that this view is currently being laid out.
         */
        mInLayout:boolean = false;

        /**
         * The listener that receives notifications when an item is selected.
         */
        private mOnItemSelectedListener:AdapterView.OnItemSelectedListener;

        /**
         * The listener that receives notifications when an item is clicked.
         */
        private mOnItemClickListener:AdapterView.OnItemClickListener;

        /**
         * The listener that receives notifications when an item is long clicked.
         */
        mOnItemLongClickListener:AdapterView.OnItemLongClickListener;

        /**
         * True if the data has changed since the last layout
         */
        mDataChanged:boolean;

        /**
         * The position within the adapter's data set of the item to select
         * during the next layout.
         */
        mNextSelectedPosition:number = AdapterView.INVALID_POSITION;

        /**
         * The item id of the item to select during the next layout.
         */
        mNextSelectedRowId:number = AdapterView.INVALID_ROW_ID;

        /**
         * The position within the adapter's data set of the currently selected item.
         */
        mSelectedPosition:number = AdapterView.INVALID_POSITION;

        /**
         * The item id of the currently selected item.
         */
        mSelectedRowId:number = AdapterView.INVALID_ROW_ID;

        /**
         * View to show if there are no items to show.
         */
        private mEmptyView:View;

        /**
         * The number of items in the current adapter.
         */
        mItemCount:number = 0;

        /**
         * The number of items in the adapter before a data changed event occurred.
         */
        mOldItemCount:number = 0;

        /**
         * Represents an invalid position. All valid positions are in the range 0 to 1 less than the
         * number of items in the current adapter.
         */
        static INVALID_POSITION:number = -1;

        /**
         * Represents an empty or invalid row id
         */
        static INVALID_ROW_ID:number = Long.MIN_VALUE;

        /**
         * The last selected position we used when notifying
         */
        mOldSelectedPosition:number = AdapterView.INVALID_POSITION;

        /**
         * The id of the last selected position we used when notifying
         */
        mOldSelectedRowId:number = AdapterView.INVALID_ROW_ID;

        /**
         * Indicates what focusable state is requested when calling setFocusable().
         * In addition to this, this view has other criteria for actually
         * determining the focusable state (such as whether its empty or the text
         * filter is shown).
         *
         * @see #setFocusable(boolean)
         * @see #checkFocus()
         */
        private mDesiredFocusableState:boolean;

        private mDesiredFocusableInTouchModeState:boolean;

        private mSelectionNotifier:SelectionNotifier;

        /**
         * When set to true, calls to requestLayout() will not propagate up the parent hierarchy.
         * This is used to layout the children during a layout pass.
         */
        mBlockLayoutRequests:boolean = false;

        /**
         * Register a callback to be invoked when an item in this AdapterView has
         * been clicked.
         *
         * @param listener The callback that will be invoked.
         */
        setOnItemClickListener(listener:AdapterView.OnItemClickListener):void  {
            this.mOnItemClickListener = listener;
        }

        /**
         * @return The callback to be invoked with an item in this AdapterView has
         *         been clicked, or null id no callback has been set.
         */
        getOnItemClickListener():AdapterView.OnItemClickListener  {
            return this.mOnItemClickListener;
        }

        /**
         * Call the OnItemClickListener, if it is defined. Performs all normal
         * actions associated with clicking: reporting accessibility event, playing
         * a sound, etc.
         *
         * @param view The view within the AdapterView that was clicked.
         * @param position The position of the view in the adapter.
         * @param id The row id of the item that was clicked.
         * @return True if there was an assigned OnItemClickListener that was
         *         called, false otherwise is returned.
         */
        performItemClick(view:View, position:number, id:number):boolean  {
            if (this.mOnItemClickListener != null) {
                this.playSoundEffect(SoundEffectConstants.CLICK);
                //if (view != null) {
                //    view.sendAccessibilityEvent(AccessibilityEvent.TYPE_VIEW_CLICKED);
                //}
                this.mOnItemClickListener.onItemClick(this, view, position, id);
                return true;
            }
            return false;
        }



        /**
         * Register a callback to be invoked when an item in this AdapterView has
         * been clicked and held
         *
         * @param listener The callback that will run
         */
        setOnItemLongClickListener(listener:AdapterView.OnItemLongClickListener):void  {
            if (!this.isLongClickable()) {
                this.setLongClickable(true);
            }
            this.mOnItemLongClickListener = listener;
        }

        /**
         * @return The callback to be invoked with an item in this AdapterView has
         *         been clicked and held, or null id no callback as been set.
         */
        getOnItemLongClickListener():AdapterView.OnItemLongClickListener  {
            return this.mOnItemLongClickListener;
        }



        /**
         * Register a callback to be invoked when an item in this AdapterView has
         * been selected.
         *
         * @param listener The callback that will run
         */
        setOnItemSelectedListener(listener:AdapterView.OnItemSelectedListener):void  {
            this.mOnItemSelectedListener = listener;
        }

        getOnItemSelectedListener():AdapterView.OnItemSelectedListener  {
            return this.mOnItemSelectedListener;
        }



        /**
         * Returns the adapter currently associated with this widget.
         *
         * @return The adapter used to provide this view's content.
         */
        abstract getAdapter():T ;

        /**
         * Sets the adapter that provides the data and the views to represent the data
         * in this widget.
         *
         * @param adapter The adapter to use to create this view's content.
         */
        abstract setAdapter(adapter:T):void ;

        /**
         * This method is not supported and throws an UnsupportedOperationException when called.
         *
         * @throws UnsupportedOperationException Every time this method is invoked.
         */
        addView(...args):void  {
            throw Error(`new UnsupportedOperationException("addView() is not supported in AdapterView")`);
        }

        /**
         * This method is not supported and throws an UnsupportedOperationException when called.
         *
         * @param child Ignored.
         *
         * @throws UnsupportedOperationException Every time this method is invoked.
         */
        removeView(child:View):void  {
            throw Error(`new UnsupportedOperationException("removeView(View) is not supported in AdapterView")`);
        }

        /**
         * This method is not supported and throws an UnsupportedOperationException when called.
         *
         * @param index Ignored.
         *
         * @throws UnsupportedOperationException Every time this method is invoked.
         */
        removeViewAt(index:number):void  {
            throw Error(`new UnsupportedOperationException("removeViewAt(int) is not supported in AdapterView")`);
        }

        /**
         * This method is not supported and throws an UnsupportedOperationException when called.
         *
         * @throws UnsupportedOperationException Every time this method is invoked.
         */
        removeAllViews():void  {
            throw Error(`new UnsupportedOperationException("removeAllViews() is not supported in AdapterView")`);
        }

        protected onLayout(changed:boolean, left:number, top:number, right:number, bottom:number):void  {
            this.mLayoutHeight = this.getHeight();
        }

        /**
         * Return the position of the currently selected item within the adapter's data set
         *
         * @return int Position (starting at 0), or {@link #INVALID_POSITION} if there is nothing selected.
         */
        getSelectedItemPosition():number  {
            return this.mNextSelectedPosition;
        }

        /**
         * @return The id corresponding to the currently selected item, or {@link #INVALID_ROW_ID}
         * if nothing is selected.
         */
        getSelectedItemId():number  {
            return this.mNextSelectedRowId;
        }

        /**
         * @return The view corresponding to the currently selected item, or null
         * if nothing is selected
         */
        abstract getSelectedView():View ;

        /**
         * @return The data corresponding to the currently selected item, or
         * null if there is nothing selected.
         */
        getSelectedItem():any  {
            let adapter:T = this.getAdapter();
            let selection:number = this.getSelectedItemPosition();
            if (adapter != null && adapter.getCount() > 0 && selection >= 0) {
                return adapter.getItem(selection);
            } else {
                return null;
            }
        }

        /**
         * @return The number of items owned by the Adapter associated with this
         *         AdapterView. (This is the number of data items, which may be
         *         larger than the number of visible views.)
         */
        getCount():number  {
            return this.mItemCount;
        }

        /**
         * Get the position within the adapter's data set for the view, where view is a an adapter item
         * or a descendant of an adapter item.
         *
         * @param view an adapter item, or a descendant of an adapter item. This must be visible in this
         *        AdapterView at the time of the call.
         * @return the position within the adapter's data set of the view, or {@link #INVALID_POSITION}
         *         if the view does not correspond to a list item (or it is not currently visible).
         */
        getPositionForView(view:View):number  {
            let listItem:View = view;
            try {
                let v:View;
                while (!((v = <View><any> listItem.getParent()) == (this))) {
                    listItem = v;
                }
            } catch (e){
                return AdapterView.INVALID_POSITION;
            }
            // Search the children for the list item
            const childCount:number = this.getChildCount();
            for (let i:number = 0; i < childCount; i++) {
                if (this.getChildAt(i) == (listItem)) {
                    return this.mFirstPosition + i;
                }
            }
            // Child not found!
            return AdapterView.INVALID_POSITION;
        }

        /**
         * Returns the position within the adapter's data set for the first item
         * displayed on screen.
         *
         * @return The position within the adapter's data set
         */
        getFirstVisiblePosition():number  {
            return this.mFirstPosition;
        }

        /**
         * Returns the position within the adapter's data set for the last item
         * displayed on screen.
         *
         * @return The position within the adapter's data set
         */
        getLastVisiblePosition():number  {
            return this.mFirstPosition + this.getChildCount() - 1;
        }

        /**
         * Sets the currently selected item. To support accessibility subclasses that
         * override this method must invoke the overriden super method first.
         *
         * @param position Index (starting at 0) of the data item to be selected.
         */
        abstract setSelection(position:number):void ;

        /**
         * Sets the view to show if the adapter is empty
         */
        setEmptyView(emptyView:View):void  {
            this.mEmptyView = emptyView;
            // If not explicitly specified this view is important for accessibility.
            //if (emptyView != null && emptyView.getImportantForAccessibility() == AdapterView.IMPORTANT_FOR_ACCESSIBILITY_AUTO) {
            //    emptyView.setImportantForAccessibility(AdapterView.IMPORTANT_FOR_ACCESSIBILITY_YES);
            //}
            const adapter:T = this.getAdapter();
            const empty:boolean = ((adapter == null) || adapter.isEmpty());
            this.updateEmptyStatus(empty);
        }

        /**
         * When the current adapter is empty, the AdapterView can display a special view
         * call the empty view. The empty view is used to provide feedback to the user
         * that no data is available in this AdapterView.
         *
         * @return The view to show if the adapter is empty.
         */
        getEmptyView():View  {
            return this.mEmptyView;
        }

        /**
         * Indicates whether this view is in filter mode. Filter mode can for instance
         * be enabled by a user when typing on the keyboard.
         *
         * @return True if the view is in filter mode, false otherwise.
         */
        isInFilterMode():boolean  {
            return false;
        }

        setFocusable(focusable:boolean):void  {
            const adapter:T = this.getAdapter();
            const empty:boolean = adapter == null || adapter.getCount() == 0;
            this.mDesiredFocusableState = focusable;
            if (!focusable) {
                this.mDesiredFocusableInTouchModeState = false;
            }
            super.setFocusable(focusable && (!empty || this.isInFilterMode()));
        }

        setFocusableInTouchMode(focusable:boolean):void  {
            const adapter:T = this.getAdapter();
            const empty:boolean = adapter == null || adapter.getCount() == 0;
            this.mDesiredFocusableInTouchModeState = focusable;
            if (focusable) {
                this.mDesiredFocusableState = true;
            }
            super.setFocusableInTouchMode(focusable && (!empty || this.isInFilterMode()));
        }

        checkFocus():void  {
            const adapter:T = this.getAdapter();
            const empty:boolean = adapter == null || adapter.getCount() == 0;
            const focusable:boolean = !empty || this.isInFilterMode();
            // The order in which we set focusable in touch mode/focusable may matter
            // for the client, see View.setFocusableInTouchMode() comments for more
            // details
            super.setFocusableInTouchMode(focusable && this.mDesiredFocusableInTouchModeState);
            super.setFocusable(focusable && this.mDesiredFocusableState);
            if (this.mEmptyView != null) {
                this.updateEmptyStatus((adapter == null) || adapter.isEmpty());
            }
        }

        /**
         * Update the status of the list based on the empty parameter.  If empty is true and
         * we have an empty view, display it.  In all the other cases, make sure that the listview
         * is VISIBLE and that the empty view is GONE (if it's not null).
         */
        private updateEmptyStatus(empty:boolean):void  {
            if (this.isInFilterMode()) {
                empty = false;
            }
            if (empty) {
                if (this.mEmptyView != null) {
                    this.mEmptyView.setVisibility(View.VISIBLE);
                    this.setVisibility(View.GONE);
                } else {
                    // If the caller just removed our empty view, make sure the list view is visible
                    this.setVisibility(View.VISIBLE);
                }
                // the state of the adapter.
                if (this.mDataChanged) {
                    this.onLayout(false, this.mLeft, this.mTop, this.mRight, this.mBottom);
                }
            } else {
                if (this.mEmptyView != null)
                    this.mEmptyView.setVisibility(View.GONE);
                this.setVisibility(View.VISIBLE);
            }
        }

        /**
         * Gets the data associated with the specified position in the list.
         *
         * @param position Which data to get
         * @return The data associated with the specified position in the list
         */
        getItemAtPosition(position:number):any  {
            let adapter:T = this.getAdapter();
            return (adapter == null || position < 0) ? null : adapter.getItem(position);
        }

        getItemIdAtPosition(position:number):number  {
            let adapter:T = this.getAdapter();
            return (adapter == null || position < 0) ? AdapterView.INVALID_ROW_ID : adapter.getItemId(position);
        }

        setOnClickListener(l:View.OnClickListener):void  {
            throw Error(`new RuntimeException("Don't call setOnClickListener for an AdapterView. " + "You probably want setOnItemClickListener instead")`);
        }

        /**
         * Override to prevent freezing of any views created by the adapter.
         */
        //dispatchSaveInstanceState(container:SparseArray<Parcelable>):void  {
        //    this.dispatchFreezeSelfOnly(container);
        //}

        /**
         * Override to prevent thawing of any views created by the adapter.
         */
        //dispatchRestoreInstanceState(container:SparseArray<Parcelable>):void  {
        //    this.dispatchThawSelfOnly(container);
        //}



        protected onDetachedFromWindow():void  {
            super.onDetachedFromWindow();
            this.removeCallbacks(this.mSelectionNotifier);
        }



        private selectionChanged():void  {
            if (this.mOnItemSelectedListener != null
                //|| AccessibilityManager.getInstance(this.mContext).isEnabled()
            ) {
                if (this.mInLayout || this.mBlockLayoutRequests) {
                    // new layout or invalidate requests.
                    if (this.mSelectionNotifier == null) {
                        this.mSelectionNotifier = new SelectionNotifier(this);
                    }
                    this.post(this.mSelectionNotifier);
                } else {
                    this.fireOnSelected();
                    this.performAccessibilityActionsOnSelected();
                }
            }
        }

        private fireOnSelected():void  {
            if (this.mOnItemSelectedListener == null) {
                return;
            }
            const selection:number = this.getSelectedItemPosition();
            if (selection >= 0) {
                let v:View = this.getSelectedView();
                this.mOnItemSelectedListener.onItemSelected(this, v, selection, this.getAdapter().getItemId(selection));
            } else {
                this.mOnItemSelectedListener.onNothingSelected(this);
            }
        }

        private performAccessibilityActionsOnSelected():void  {
            //if (!AccessibilityManager.getInstance(this.mContext).isEnabled()) {
            //    return;
            //}
            //const position:number = this.getSelectedItemPosition();
            //if (position >= 0) {
            //    // we fire selection events here not in View
            //    this.sendAccessibilityEvent(AccessibilityEvent.TYPE_VIEW_SELECTED);
            //}
        }

        //dispatchPopulateAccessibilityEvent(event:AccessibilityEvent):boolean  {
        //    let selectedView:View = this.getSelectedView();
        //    if (selectedView != null && selectedView.getVisibility() == AdapterView.VISIBLE && selectedView.dispatchPopulateAccessibilityEvent(event)) {
        //        return true;
        //    }
        //    return false;
        //}

        //onRequestSendAccessibilityEvent(child:View, event:AccessibilityEvent):boolean  {
        //    if (super.onRequestSendAccessibilityEvent(child, event)) {
        //        // Add a record for ourselves as well.
        //        let record:AccessibilityEvent = AccessibilityEvent.obtain();
        //        this.onInitializeAccessibilityEvent(record);
        //        // Populate with the text of the requesting child.
        //        child.dispatchPopulateAccessibilityEvent(record);
        //        event.appendRecord(record);
        //        return true;
        //    }
        //    return false;
        //}

        //onInitializeAccessibilityNodeInfo(info:AccessibilityNodeInfo):void  {
        //    super.onInitializeAccessibilityNodeInfo(info);
        //    info.setClassName(AdapterView.class.getName());
        //    info.setScrollable(this.isScrollableForAccessibility());
        //    let selectedView:View = this.getSelectedView();
        //    if (selectedView != null) {
        //        info.setEnabled(selectedView.isEnabled());
        //    }
        //}

        //onInitializeAccessibilityEvent(event:AccessibilityEvent):void  {
        //    super.onInitializeAccessibilityEvent(event);
        //    event.setClassName(AdapterView.class.getName());
        //    event.setScrollable(this.isScrollableForAccessibility());
        //    let selectedView:View = this.getSelectedView();
        //    if (selectedView != null) {
        //        event.setEnabled(selectedView.isEnabled());
        //    }
        //    event.setCurrentItemIndex(this.getSelectedItemPosition());
        //    event.setFromIndex(this.getFirstVisiblePosition());
        //    event.setToIndex(this.getLastVisiblePosition());
        //    event.setItemCount(this.getCount());
        //}

        private isScrollableForAccessibility():boolean  {
            let adapter:T = this.getAdapter();
            if (adapter != null) {
                const itemCount:number = adapter.getCount();
                return itemCount > 0 && (this.getFirstVisiblePosition() > 0 || this.getLastVisiblePosition() < itemCount - 1);
            }
            return false;
        }

        canAnimate():boolean  {
            return super.canAnimate() && this.mItemCount > 0;
        }

        handleDataChanged():void  {
            const count:number = this.mItemCount;
            let found:boolean = false;
            if (count > 0) {
                let newPos:number;
                // Find the row we are supposed to sync to
                if (this.mNeedSync) {
                    // Update this first, since setNextSelectedPositionInt inspects
                    // it
                    this.mNeedSync = false;
                    // See if we can find a position in the new data with the same
                    // id as the old selection
                    newPos = this.findSyncPosition();
                    if (newPos >= 0) {
                        // Verify that new selection is selectable
                        let selectablePos:number = this.lookForSelectablePosition(newPos, true);
                        if (selectablePos == newPos) {
                            // Same row id is selected
                            this.setNextSelectedPositionInt(newPos);
                            found = true;
                        }
                    }
                }
                if (!found) {
                    // Try to use the same position if we can't find matching data
                    newPos = this.getSelectedItemPosition();
                    // Pin position to the available range
                    if (newPos >= count) {
                        newPos = count - 1;
                    }
                    if (newPos < 0) {
                        newPos = 0;
                    }
                    // Make sure we select something selectable -- first look down
                    let selectablePos:number = this.lookForSelectablePosition(newPos, true);
                    if (selectablePos < 0) {
                        // Looking down didn't work -- try looking up
                        selectablePos = this.lookForSelectablePosition(newPos, false);
                    }
                    if (selectablePos >= 0) {
                        this.setNextSelectedPositionInt(selectablePos);
                        this.checkSelectionChanged();
                        found = true;
                    }
                }
            }
            if (!found) {
                // Nothing is selected
                this.mSelectedPosition = AdapterView.INVALID_POSITION;
                this.mSelectedRowId = AdapterView.INVALID_ROW_ID;
                this.mNextSelectedPosition = AdapterView.INVALID_POSITION;
                this.mNextSelectedRowId = AdapterView.INVALID_ROW_ID;
                this.mNeedSync = false;
                this.checkSelectionChanged();
            }
            //this.notifySubtreeAccessibilityStateChangedIfNeeded();
        }

        checkSelectionChanged():void  {
            if ((this.mSelectedPosition != this.mOldSelectedPosition) || (this.mSelectedRowId != this.mOldSelectedRowId)) {
                this.selectionChanged();
                this.mOldSelectedPosition = this.mSelectedPosition;
                this.mOldSelectedRowId = this.mSelectedRowId;
            }
        }

        /**
         * Searches the adapter for a position matching mSyncRowId. The search starts at mSyncPosition
         * and then alternates between moving up and moving down until 1) we find the right position, or
         * 2) we run out of time, or 3) we have looked at every position
         *
         * @return Position of the row that matches mSyncRowId, or {@link #INVALID_POSITION} if it can't
         *         be found
         */
        findSyncPosition():number  {
            let count:number = this.mItemCount;
            if (count == 0) {
                return AdapterView.INVALID_POSITION;
            }
            let idToMatch:number = this.mSyncRowId;
            let seed:number = this.mSyncPosition;
            // If there isn't a selection don't hunt for it
            if (idToMatch == AdapterView.INVALID_ROW_ID) {
                return AdapterView.INVALID_POSITION;
            }
            // Pin seed to reasonable values
            seed = Math.max(0, seed);
            seed = Math.min(count - 1, seed);
            let endTime:number = SystemClock.uptimeMillis() + AdapterView.SYNC_MAX_DURATION_MILLIS;
            let rowId:number;
            // first position scanned so far
            let first:number = seed;
            // last position scanned so far
            let last:number = seed;
            // True if we should move down on the next iteration
            let next:boolean = false;
            // True when we have looked at the first item in the data
            let hitFirst:boolean;
            // True when we have looked at the last item in the data
            let hitLast:boolean;
            // Get the item ID locally (instead of getItemIdAtPosition), so
            // we need the adapter
            let adapter:T = this.getAdapter();
            if (adapter == null) {
                return AdapterView.INVALID_POSITION;
            }
            while (SystemClock.uptimeMillis() <= endTime) {
                rowId = adapter.getItemId(seed);
                if (rowId == idToMatch) {
                    // Found it!
                    return seed;
                }
                hitLast = last == count - 1;
                hitFirst = first == 0;
                if (hitLast && hitFirst) {
                    // Looked at everything
                    break;
                }
                if (hitFirst || (next && !hitLast)) {
                    // Either we hit the top, or we are trying to move down
                    last++;
                    seed = last;
                    // Try going up next time
                    next = false;
                } else if (hitLast || (!next && !hitFirst)) {
                    // Either we hit the bottom, or we are trying to move up
                    first--;
                    seed = first;
                    // Try going down next time
                    next = true;
                }
            }
            return AdapterView.INVALID_POSITION;
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
            return position;
        }

        /**
         * Utility to keep mSelectedPosition and mSelectedRowId in sync
         * @param position Our current position
         */
        setSelectedPositionInt(position:number):void  {
            this.mSelectedPosition = position;
            this.mSelectedRowId = this.getItemIdAtPosition(position);
        }

        /**
         * Utility to keep mNextSelectedPosition and mNextSelectedRowId in sync
         * @param position Intended value for mSelectedPosition the next time we go
         * through layout
         */
        setNextSelectedPositionInt(position:number):void  {
            this.mNextSelectedPosition = position;
            this.mNextSelectedRowId = this.getItemIdAtPosition(position);
            // If we are trying to sync to the selection, update that too
            if (this.mNeedSync && this.mSyncMode == AdapterView.SYNC_SELECTED_POSITION && position >= 0) {
                this.mSyncPosition = position;
                this.mSyncRowId = this.mNextSelectedRowId;
            }
        }

        /**
         * Remember enough information to restore the screen state when the data has
         * changed.
         *
         */
        rememberSyncState():void  {
            if (this.getChildCount() > 0) {
                this.mNeedSync = true;
                this.mSyncHeight = this.mLayoutHeight;
                if (this.mSelectedPosition >= 0) {
                    // Sync the selection state
                    let v:View = this.getChildAt(this.mSelectedPosition - this.mFirstPosition);
                    this.mSyncRowId = this.mNextSelectedRowId;
                    this.mSyncPosition = this.mNextSelectedPosition;
                    if (v != null) {
                        this.mSpecificTop = v.getTop();
                    }
                    this.mSyncMode = AdapterView.SYNC_SELECTED_POSITION;
                } else {
                    // Sync the based on the offset of the first view
                    let v:View = this.getChildAt(0);
                    let adapter:T = this.getAdapter();
                    if (this.mFirstPosition >= 0 && this.mFirstPosition < adapter.getCount()) {
                        this.mSyncRowId = adapter.getItemId(this.mFirstPosition);
                    } else {
                        this.mSyncRowId = AdapterView.NO_ID;
                    }
                    this.mSyncPosition = this.mFirstPosition;
                    if (v != null) {
                        this.mSpecificTop = v.getTop();
                    }
                    this.mSyncMode = AdapterView.SYNC_FIRST_POSITION;
                }
            }
        }
    }

    export module AdapterView{
        /**
         * Interface definition for a callback to be invoked when an item in this
         * AdapterView has been clicked.
         */
        export interface OnItemClickListener {

            /**
             * Callback method to be invoked when an item in this AdapterView has
             * been clicked.
             * <p>
             * Implementers can call getItemAtPosition(position) if they need
             * to access the data associated with the selected item.
             *
             * @param parent The AdapterView where the click happened.
             * @param view The view within the AdapterView that was clicked (this
             *            will be a view provided by the adapter)
             * @param position The position of the view in the adapter.
             * @param id The row id of the item that was clicked.
             */
            onItemClick(parent:AdapterView<any>, view:View, position:number, id:number):void ;
        }
        /**
         * Interface definition for a callback to be invoked when an item in this
         * view has been clicked and held.
         */
        export interface OnItemLongClickListener {

            /**
             * Callback method to be invoked when an item in this view has been
             * clicked and held.
             *
             * Implementers can call getItemAtPosition(position) if they need to access
             * the data associated with the selected item.
             *
             * @param parent The AbsListView where the click happened
             * @param view The view within the AbsListView that was clicked
             * @param position The position of the view in the list
             * @param id The row id of the item that was clicked
             *
             * @return true if the callback consumed the long click, false otherwise
             */
            onItemLongClick(parent:AdapterView<any>, view:View, position:number, id:number):boolean ;
        }
        /**
         * Interface definition for a callback to be invoked when
         * an item in this view has been selected.
         */
        export interface OnItemSelectedListener {

            /**
             * <p>Callback method to be invoked when an item in this view has been
             * selected. This callback is invoked only when the newly selected
             * position is different from the previously selected position or if
             * there was no selected item.</p>
             *
             * Impelmenters can call getItemAtPosition(position) if they need to access the
             * data associated with the selected item.
             *
             * @param parent The AdapterView where the selection happened
             * @param view The view within the AdapterView that was clicked
             * @param position The position of the view in the adapter
             * @param id The row id of the item that is selected
             */
            onItemSelected(parent:AdapterView<any>, view:View, position:number, id:number):void ;

            /**
             * Callback method to be invoked when the selection disappears from this
             * view. The selection can disappear for instance when touch is activated
             * or when the adapter becomes empty.
             *
             * @param parent The AdapterView that now contains no selected item.
             */
            onNothingSelected(parent:AdapterView<any>):void ;
        }
        /**
         * Extra menu information provided to the
         * {@link android.view.View.OnCreateContextMenuListener#onCreateContextMenu(ContextMenu, View, ContextMenuInfo) }
         * callback when a context menu is brought up for this AdapterView.
         *
         */
        //export class AdapterContextMenuInfo implements ContextMenu.ContextMenuInfo {
        //
        //    constructor(targetView:View, position:number, id:number) {
        //        this.targetView = targetView;
        //        this.position = position;
        //        this.id = id;
        //    }
        //
        //    /**
        //     * The child view for which the context menu is being displayed. This
        //     * will be one of the children of this AdapterView.
        //     */
        //    targetView:View;
        //
        //    /**
        //     * The position in the adapter for which the context menu is being
        //     * displayed.
        //     */
        //    position:number;
        //
        //    /**
        //     * The row id of the item for which the context menu is being displayed.
        //     */
        //    id:number;
        //}

        export class AdapterDataSetObserver extends DataSetObserver {
            AdapterView_this:AdapterView<any>;
            //private mInstanceState:Parcelable = null;
            constructor(AdapterView_this:AdapterView<any>){
                super();
                this.AdapterView_this = AdapterView_this;
            }
            onChanged():void  {
                this.AdapterView_this.mDataChanged = true;
                this.AdapterView_this.mOldItemCount = this.AdapterView_this.mItemCount;
                this.AdapterView_this.mItemCount = this.AdapterView_this.getAdapter().getCount();
                // been repopulated with new data.
                //if (this.AdapterView_this.getAdapter().hasStableIds() && this.AdapterView_this.mInstanceState != null
                //    && this.AdapterView_this.mOldItemCount == 0 && this.AdapterView_this.mItemCount > 0) {
                //    this.AdapterView_this.onRestoreInstanceState(this.AdapterView_this.mInstanceState);
                //    this.AdapterView_this.mInstanceState = null;
                //} else {
                this.AdapterView_this.rememberSyncState();
                //}
                this.AdapterView_this.checkFocus();
                this.AdapterView_this.requestLayout();
            }

            onInvalidated():void  {
                this.AdapterView_this.mDataChanged = true;
                //if (AdapterView.this.AdapterView_this.getAdapter().hasStableIds()) {
                //    // Remember the current state for the case where our hosting activity is being
                //    // stopped and later restarted
                //    this.AdapterView_this.mInstanceState = AdapterView.this.AdapterView_this.onSaveInstanceState();
                //}
                // Data is invalid so we should reset our state
                this.AdapterView_this.mOldItemCount = this.AdapterView_this.mItemCount;
                this.AdapterView_this.mItemCount = 0;
                this.AdapterView_this.mSelectedPosition = AdapterView.INVALID_POSITION;
                this.AdapterView_this.mSelectedRowId = AdapterView.INVALID_ROW_ID;
                this.AdapterView_this.mNextSelectedPosition = AdapterView.INVALID_POSITION;
                this.AdapterView_this.mNextSelectedRowId = AdapterView.INVALID_ROW_ID;
                this.AdapterView_this.mNeedSync = false;
                this.AdapterView_this.checkFocus();
                this.AdapterView_this.requestLayout();
            }

            clearSavedState():void  {
                //this.AdapterView_this.mInstanceState = null;
            }
        }
    }
    class SelectionNotifier implements Runnable {
        AdapterView_this:AdapterView<any>;
        constructor(AdapterView_this:AdapterView<any>){
            this.AdapterView_this = AdapterView_this;
        }

        run():void  {
            if (this.AdapterView_this.mDataChanged) {
                // has been synched to the new data.
                if (this.AdapterView_this.getAdapter() != null) {
                    this.AdapterView_this.post(this);
                }
            } else {
                this.AdapterView_this.fireOnSelected();
                this.AdapterView_this.performAccessibilityActionsOnSelected();
            }
        }
    }

}
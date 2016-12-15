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

///<reference path="../../android/graphics/Rect.ts"/>
///<reference path="../../android/os/Trace.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/view/KeyEvent.ts"/>
///<reference path="../../android/view/SoundEffectConstants.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../java/lang/Integer.ts"/>
///<reference path="../../android/widget/AbsListView.ts"/>
///<reference path="../../android/widget/Adapter.ts"/>
///<reference path="../../android/widget/Checkable.ts"/>
///<reference path="../../android/widget/ListAdapter.ts"/>
///<reference path="../../android/widget/ListView.ts"/>
///<reference path="../../android/R/attr.ts"/>

module android.widget {
import Rect = android.graphics.Rect;
import Trace = android.os.Trace;
import Gravity = android.view.Gravity;
import KeyEvent = android.view.KeyEvent;
import SoundEffectConstants = android.view.SoundEffectConstants;
import View = android.view.View;
import ViewGroup = android.view.ViewGroup;
import Integer = java.lang.Integer;
import AbsListView = android.widget.AbsListView;
import LayoutParams = android.widget.AbsListView.LayoutParams;
import Adapter = android.widget.Adapter;
import Checkable = android.widget.Checkable;
import ListAdapter = android.widget.ListAdapter;
import ListView = android.widget.ListView;
    import AttrBinder = androidui.attr.AttrBinder;
/**
 * A view that shows items in two-dimensional scrolling grid. The items in the
 * grid come from the {@link ListAdapter} associated with this view.
 *
 * <p>See the <a href="{@docRoot}guide/topics/ui/layout/gridview.html">Grid
 * View</a> guide.</p>
 * 
 * @attr ref android.R.styleable#GridView_horizontalSpacing
 * @attr ref android.R.styleable#GridView_verticalSpacing
 * @attr ref android.R.styleable#GridView_stretchMode
 * @attr ref android.R.styleable#GridView_columnWidth
 * @attr ref android.R.styleable#GridView_numColumns
 * @attr ref android.R.styleable#GridView_gravity
 */
export class GridView extends AbsListView {

    /**
     * Disables stretching.
     * 
     * @see #setStretchMode(int) 
     */
    static NO_STRETCH:number = 0;

    /**
     * Stretches the spacing between columns.
     * 
     * @see #setStretchMode(int) 
     */
    static STRETCH_SPACING:number = 1;

    /**
     * Stretches columns.
     * 
     * @see #setStretchMode(int) 
     */
    static STRETCH_COLUMN_WIDTH:number = 2;

    /**
     * Stretches the spacing between columns. The spacing is uniform.
     * 
     * @see #setStretchMode(int) 
     */
    static STRETCH_SPACING_UNIFORM:number = 3;

    /**
     * Creates as many columns as can fit on screen.
     * 
     * @see #setNumColumns(int) 
     */
    static AUTO_FIT:number = -1;

    private mNumColumns:number = GridView.AUTO_FIT;

    private mHorizontalSpacing:number = 0;

    private mRequestedHorizontalSpacing:number = 0;

    private mVerticalSpacing:number = 0;

    private mStretchMode:number = GridView.STRETCH_COLUMN_WIDTH;

    private mColumnWidth:number = 0;

    private mRequestedColumnWidth:number = 0;

    private mRequestedNumColumns:number = 0;

    private mReferenceView:View = null;

    private mReferenceViewInSelectedRow:View = null;

    private mGravity:number = Gravity.LEFT;

    private mTempRect:Rect = new Rect();

    constructor(context:android.content.Context, attrs:HTMLElement, defStyle=android.R.attr.gridViewStyle) {
       super(context, attrs, defStyle);
       let a = context.obtainStyledAttributes(attrs, defStyle);
       let hSpacing:number = a.getDimensionPixelOffset('horizontalSpacing', 0);
       this.setHorizontalSpacing(hSpacing);
       let vSpacing:number = a.getDimensionPixelOffset('verticalSpacing', 0);
       this.setVerticalSpacing(vSpacing);
       let stretchModeS = a.getAttrValue('stretchMode');
       if (stretchModeS) {
           switch (stretchModeS) {
               case "none":
                   this.setStretchMode(GridView.NO_STRETCH);
                   break;
               case "spacingWidth":
                   this.setStretchMode(GridView.STRETCH_SPACING);
                   break;
               case "columnWidth":
                   this.setStretchMode(GridView.STRETCH_COLUMN_WIDTH);
                   break;
               case "spacingWidthUniform":
                   this.setStretchMode(GridView.STRETCH_SPACING_UNIFORM);
                   break;
           }
       }
       let columnWidth:number = a.getDimensionPixelOffset('columnWidth', -1);
       if (columnWidth > 0) {
           this.setColumnWidth(columnWidth);
       }
       let numColumns:number = a.getInt('numColumns', 1);
       this.setNumColumns(numColumns);
       let gravityS = a.getAttrValue('gravity');
       if (gravityS) {
           this.setGravity(Gravity.parseGravity(gravityS, this.mGravity));
       }
       a.recycle();
    }

    protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
        return super.createClassAttrBinder().set('horizontalSpacing', {
            setter(v:GridView, value:any, attrBinder:AttrBinder) {
                v.setHorizontalSpacing(attrBinder.parseNumberPixelOffset(value, 0));
            }, getter(v:GridView) {
                return v.getHorizontalSpacing();
            }
        }).set('verticalSpacing', {
            setter(v:GridView, value:any, attrBinder:AttrBinder) {
                v.setVerticalSpacing(attrBinder.parseNumberPixelOffset(value, 0));
            }, getter(v:GridView) {
                return v.getVerticalSpacing();
            }
        }).set('stretchMode', {
            setter(v:GridView, value:any, attrBinder:AttrBinder) {
                v.setStretchMode(attrBinder.parseEnum(value,
                    new Map<string, number>()
                        .set("none", GridView.NO_STRETCH)
                        .set("spacingWidth", GridView.STRETCH_SPACING)
                        .set("columnWidth", GridView.STRETCH_COLUMN_WIDTH)
                        .set("spacingWidthUniform", GridView.STRETCH_SPACING_UNIFORM),
                    GridView.STRETCH_COLUMN_WIDTH));
            }, getter(v:GridView) {
                return v.getStretchMode();
            }
        }).set('columnWidth', {
            setter(v:GridView, value:any, attrBinder:AttrBinder) {
                let columnWidth = attrBinder.parseNumberPixelOffset(value, -1);
                if(columnWidth > 0 ){
                    this.setColumnWidth(columnWidth);
                }
            }, getter(v:GridView) {
                return v.getColumnWidth();
            }
        }).set('numColumns', {
            setter(v:GridView, value:any, attrBinder:AttrBinder) {
                v.setNumColumns(attrBinder.parseInt(value, 1));
            }, getter(v:GridView) {
                return v.getNumColumns();
            }
        }).set('gravity', {
            setter(v:GridView, value:any, attrBinder:AttrBinder) {
                v.setGravity(attrBinder.parseGravity(value, v.getGravity()));
            }, getter(v:GridView) {
                return v.getGravity();
            }
        });
    }

    getAdapter():ListAdapter  {
        return this.mAdapter;
    }

    /**
     * Sets the data behind this GridView.
     *
     * @param adapter the adapter providing the grid's data
     */
    setAdapter(adapter:ListAdapter):void  {
        if (this.mAdapter != null && this.mDataSetObserver != null) {
            this.mAdapter.unregisterDataSetObserver(this.mDataSetObserver);
        }
        this.resetList();
        this.mRecycler.clear();
        this.mAdapter = adapter;
        this.mOldSelectedPosition = GridView.INVALID_POSITION;
        this.mOldSelectedRowId = GridView.INVALID_ROW_ID;
        // AbsListView#setAdapter will update choice mode states.
        super.setAdapter(adapter);
        if (this.mAdapter != null) {
            this.mOldItemCount = this.mItemCount;
            this.mItemCount = this.mAdapter.getCount();
            this.mDataChanged = true;
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
            this.checkSelectionChanged();
        } else {
            this.checkFocus();
            // Nothing selected
            this.checkSelectionChanged();
        }
        this.requestLayout();
    }

    lookForSelectablePosition(position:number, lookDown:boolean):number  {
        const adapter:ListAdapter = this.mAdapter;
        if (adapter == null || this.isInTouchMode()) {
            return GridView.INVALID_POSITION;
        }
        if (position < 0 || position >= this.mItemCount) {
            return GridView.INVALID_POSITION;
        }
        return position;
    }

    /**
     * {@inheritDoc}
     */
    fillGap(down:boolean):void  {
        const numColumns:number = this.mNumColumns;
        const verticalSpacing:number = this.mVerticalSpacing;
        const count:number = this.getChildCount();
        if (down) {
            let paddingTop:number = 0;
            if ((this.mGroupFlags & GridView.CLIP_TO_PADDING_MASK) == GridView.CLIP_TO_PADDING_MASK) {
                paddingTop = this.getListPaddingTop();
            }
            const startOffset:number = count > 0 ? this.getChildAt(count - 1).getBottom() + verticalSpacing : paddingTop;
            let position:number = this.mFirstPosition + count;
            if (this.mStackFromBottom) {
                position += numColumns - 1;
            }
            this.fillDown(position, startOffset);
            this.correctTooHigh(numColumns, verticalSpacing, this.getChildCount());
        } else {
            let paddingBottom:number = 0;
            if ((this.mGroupFlags & GridView.CLIP_TO_PADDING_MASK) == GridView.CLIP_TO_PADDING_MASK) {
                paddingBottom = this.getListPaddingBottom();
            }
            const startOffset:number = count > 0 ? this.getChildAt(0).getTop() - verticalSpacing : this.getHeight() - paddingBottom;
            let position:number = this.mFirstPosition;
            if (!this.mStackFromBottom) {
                position -= numColumns;
            } else {
                position--;
            }
            this.fillUp(position, startOffset);
            this.correctTooLow(numColumns, verticalSpacing, this.getChildCount());
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
        if ((this.mGroupFlags & GridView.CLIP_TO_PADDING_MASK) == GridView.CLIP_TO_PADDING_MASK) {
            end -= this.mListPadding.bottom;
        }
        while (nextTop < end && pos < this.mItemCount) {
            let temp:View = this.makeRow(pos, nextTop, true);
            if (temp != null) {
                selectedView = temp;
            }
            // mReferenceView will change with each call to makeRow()
            // do not cache in a local variable outside of this loop
            nextTop = this.mReferenceView.getBottom() + this.mVerticalSpacing;
            pos += this.mNumColumns;
        }
        this.setVisibleRangeHint(this.mFirstPosition, this.mFirstPosition + this.getChildCount() - 1);
        return selectedView;
    }

    private makeRow(startPos:number, y:number, flow:boolean):View  {
        const columnWidth:number = this.mColumnWidth;
        const horizontalSpacing:number = this.mHorizontalSpacing;
        const isLayoutRtl:boolean = this.isLayoutRtl();
        let last:number;
        let nextLeft:number;
        if (isLayoutRtl) {
            nextLeft = this.getWidth() - this.mListPadding.right - columnWidth - ((this.mStretchMode == GridView.STRETCH_SPACING_UNIFORM) ? horizontalSpacing : 0);
        } else {
            nextLeft = this.mListPadding.left + ((this.mStretchMode == GridView.STRETCH_SPACING_UNIFORM) ? horizontalSpacing : 0);
        }
        if (!this.mStackFromBottom) {
            last = Math.min(startPos + this.mNumColumns, this.mItemCount);
        } else {
            last = startPos + 1;
            startPos = Math.max(0, startPos - this.mNumColumns + 1);
            if (last - startPos < this.mNumColumns) {
                const deltaLeft:number = (this.mNumColumns - (last - startPos)) * (columnWidth + horizontalSpacing);
                nextLeft += (isLayoutRtl ? -1 : +1) * deltaLeft;
            }
        }
        let selectedView:View = null;
        const hasFocus:boolean = this.shouldShowSelector();
        const inClick:boolean = this.touchModeDrawsInPressedState();
        const selectedPosition:number = this.mSelectedPosition;
        let child:View = null;
        for (let pos:number = startPos; pos < last; pos++) {
            // is this the selected item?
            let selected:boolean = pos == selectedPosition;
            // does the list view have focus or contain focus
            const where:number = flow ? -1 : pos - startPos;
            child = this.makeAndAddView(pos, y, flow, nextLeft, selected, where);
            nextLeft += (isLayoutRtl ? -1 : +1) * columnWidth;
            if (pos < last - 1) {
                nextLeft += horizontalSpacing;
            }
            if (selected && (hasFocus || inClick)) {
                selectedView = child;
            }
        }
        this.mReferenceView = child;
        if (selectedView != null) {
            this.mReferenceViewInSelectedRow = this.mReferenceView;
        }
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
        if ((this.mGroupFlags & GridView.CLIP_TO_PADDING_MASK) == GridView.CLIP_TO_PADDING_MASK) {
            end = this.mListPadding.top;
        }
        while (nextBottom > end && pos >= 0) {
            let temp:View = this.makeRow(pos, nextBottom, false);
            if (temp != null) {
                selectedView = temp;
            }
            nextBottom = this.mReferenceView.getTop() - this.mVerticalSpacing;
            this.mFirstPosition = pos;
            pos -= this.mNumColumns;
        }
        if (this.mStackFromBottom) {
            this.mFirstPosition = Math.max(0, pos + 1);
        }
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
        this.mFirstPosition -= this.mFirstPosition % this.mNumColumns;
        return this.fillDown(this.mFirstPosition, nextTop);
    }

    private fillFromBottom(lastPosition:number, nextBottom:number):View  {
        lastPosition = Math.max(lastPosition, this.mSelectedPosition);
        lastPosition = Math.min(lastPosition, this.mItemCount - 1);
        const invertedPosition:number = this.mItemCount - 1 - lastPosition;
        lastPosition = this.mItemCount - 1 - (invertedPosition - (invertedPosition % this.mNumColumns));
        return this.fillUp(lastPosition, nextBottom);
    }

    private fillSelection(childrenTop:number, childrenBottom:number):View  {
        const selectedPosition:number = this.reconcileSelectedPosition();
        const numColumns:number = this.mNumColumns;
        const verticalSpacing:number = this.mVerticalSpacing;
        let rowStart:number;
        let rowEnd:number = -1;
        if (!this.mStackFromBottom) {
            rowStart = selectedPosition - (selectedPosition % numColumns);
        } else {
            const invertedSelection:number = this.mItemCount - 1 - selectedPosition;
            rowEnd = this.mItemCount - 1 - (invertedSelection - (invertedSelection % numColumns));
            rowStart = Math.max(0, rowEnd - numColumns + 1);
        }
        const fadingEdgeLength:number = this.getVerticalFadingEdgeLength();
        const topSelectionPixel:number = this.getTopSelectionPixel(childrenTop, fadingEdgeLength, rowStart);
        const sel:View = this.makeRow(this.mStackFromBottom ? rowEnd : rowStart, topSelectionPixel, true);
        this.mFirstPosition = rowStart;
        const referenceView:View = this.mReferenceView;
        if (!this.mStackFromBottom) {
            this.fillDown(rowStart + numColumns, referenceView.getBottom() + verticalSpacing);
            this.pinToBottom(childrenBottom);
            this.fillUp(rowStart - numColumns, referenceView.getTop() - verticalSpacing);
            this.adjustViewsUpOrDown();
        } else {
            const bottomSelectionPixel:number = this.getBottomSelectionPixel(childrenBottom, fadingEdgeLength, numColumns, rowStart);
            const offset:number = bottomSelectionPixel - referenceView.getBottom();
            this.offsetChildrenTopAndBottom(offset);
            this.fillUp(rowStart - 1, referenceView.getTop() - verticalSpacing);
            this.pinToTop(childrenTop);
            this.fillDown(rowEnd + numColumns, referenceView.getBottom() + verticalSpacing);
            this.adjustViewsUpOrDown();
        }
        return sel;
    }

    private pinToTop(childrenTop:number):void  {
        if (this.mFirstPosition == 0) {
            const top:number = this.getChildAt(0).getTop();
            const offset:number = childrenTop - top;
            if (offset < 0) {
                this.offsetChildrenTopAndBottom(offset);
            }
        }
    }

    private pinToBottom(childrenBottom:number):void  {
        const count:number = this.getChildCount();
        if (this.mFirstPosition + count == this.mItemCount) {
            const bottom:number = this.getChildAt(count - 1).getBottom();
            const offset:number = childrenBottom - bottom;
            if (offset > 0) {
                this.offsetChildrenTopAndBottom(offset);
            }
        }
    }

    findMotionRow(y:number):number  {
        const childCount:number = this.getChildCount();
        if (childCount > 0) {
            const numColumns:number = this.mNumColumns;
            if (!this.mStackFromBottom) {
                for (let i:number = 0; i < childCount; i += numColumns) {
                    if (y <= this.getChildAt(i).getBottom()) {
                        return this.mFirstPosition + i;
                    }
                }
            } else {
                for (let i:number = childCount - 1; i >= 0; i -= numColumns) {
                    if (y >= this.getChildAt(i).getTop()) {
                        return this.mFirstPosition + i;
                    }
                }
            }
        }
        return GridView.INVALID_POSITION;
    }

    /**
     * Layout during a scroll that results from tracking motion events. Places
     * the mMotionPosition view at the offset specified by mMotionViewTop, and
     * then build surrounding views from there.
     *
     * @param position the position at which to start filling
     * @param top the top of the view at that position
     * @return The selected view, or null if the selected view is outside the
     *         visible area.
     */
    private fillSpecific(position:number, top:number):View  {
        const numColumns:number = this.mNumColumns;
        let motionRowStart:number;
        let motionRowEnd:number = -1;
        if (!this.mStackFromBottom) {
            motionRowStart = position - (position % numColumns);
        } else {
            const invertedSelection:number = this.mItemCount - 1 - position;
            motionRowEnd = this.mItemCount - 1 - (invertedSelection - (invertedSelection % numColumns));
            motionRowStart = Math.max(0, motionRowEnd - numColumns + 1);
        }
        const temp:View = this.makeRow(this.mStackFromBottom ? motionRowEnd : motionRowStart, top, true);
        // Possibly changed again in fillUp if we add rows above this one.
        this.mFirstPosition = motionRowStart;
        const referenceView:View = this.mReferenceView;
        // We didn't have anything to layout, bail out
        if (referenceView == null) {
            return null;
        }
        const verticalSpacing:number = this.mVerticalSpacing;
        let above:View;
        let below:View;
        if (!this.mStackFromBottom) {
            above = this.fillUp(motionRowStart - numColumns, referenceView.getTop() - verticalSpacing);
            this.adjustViewsUpOrDown();
            below = this.fillDown(motionRowStart + numColumns, referenceView.getBottom() + verticalSpacing);
            // Check if we have dragged the bottom of the grid too high
            const childCount:number = this.getChildCount();
            if (childCount > 0) {
                this.correctTooHigh(numColumns, verticalSpacing, childCount);
            }
        } else {
            below = this.fillDown(motionRowEnd + numColumns, referenceView.getBottom() + verticalSpacing);
            this.adjustViewsUpOrDown();
            above = this.fillUp(motionRowStart - 1, referenceView.getTop() - verticalSpacing);
            // Check if we have dragged the bottom of the grid too high
            const childCount:number = this.getChildCount();
            if (childCount > 0) {
                this.correctTooLow(numColumns, verticalSpacing, childCount);
            }
        }
        if (temp != null) {
            return temp;
        } else if (above != null) {
            return above;
        } else {
            return below;
        }
    }

    private correctTooHigh(numColumns:number, verticalSpacing:number, childCount:number):void  {
        // First see if the last item is visible
        const lastPosition:number = this.mFirstPosition + childCount - 1;
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
            const firstChild:View = this.getChildAt(0);
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
                    this.fillUp(this.mFirstPosition - (this.mStackFromBottom ? 1 : numColumns), firstChild.getTop() - verticalSpacing);
                    // Close up the remaining gap
                    this.adjustViewsUpOrDown();
                }
            }
        }
    }

    private correctTooLow(numColumns:number, verticalSpacing:number, childCount:number):void  {
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
            const lastChild:View = this.getChildAt(childCount - 1);
            const lastBottom:number = lastChild.getBottom();
            const lastPosition:number = this.mFirstPosition + childCount - 1;
            // last row or the last row is scrolled off the bottom of the drawable area
            if (topOffset > 0 && (lastPosition < this.mItemCount - 1 || lastBottom > end)) {
                if (lastPosition == this.mItemCount - 1) {
                    // Don't pull the bottom too far up
                    topOffset = Math.min(topOffset, lastBottom - end);
                }
                // Move everything up
                this.offsetChildrenTopAndBottom(-topOffset);
                if (lastPosition < this.mItemCount - 1) {
                    // Fill the gap that was opened below the last position with more rows, if
                    // possible
                    this.fillDown(lastPosition + (!this.mStackFromBottom ? 1 : numColumns), lastChild.getBottom() + verticalSpacing);
                    // Close up the remaining gap
                    this.adjustViewsUpOrDown();
                }
            }
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
        const fadingEdgeLength:number = this.getVerticalFadingEdgeLength();
        const selectedPosition:number = this.mSelectedPosition;
        const numColumns:number = this.mNumColumns;
        const verticalSpacing:number = this.mVerticalSpacing;
        let rowStart:number;
        let rowEnd:number = -1;
        if (!this.mStackFromBottom) {
            rowStart = selectedPosition - (selectedPosition % numColumns);
        } else {
            let invertedSelection:number = this.mItemCount - 1 - selectedPosition;
            rowEnd = this.mItemCount - 1 - (invertedSelection - (invertedSelection % numColumns));
            rowStart = Math.max(0, rowEnd - numColumns + 1);
        }
        let sel:View;
        let referenceView:View;
        let topSelectionPixel:number = this.getTopSelectionPixel(childrenTop, fadingEdgeLength, rowStart);
        let bottomSelectionPixel:number = this.getBottomSelectionPixel(childrenBottom, fadingEdgeLength, numColumns, rowStart);
        sel = this.makeRow(this.mStackFromBottom ? rowEnd : rowStart, selectedTop, true);
        // Possibly changed again in fillUp if we add rows above this one.
        this.mFirstPosition = rowStart;
        referenceView = this.mReferenceView;
        this.adjustForTopFadingEdge(referenceView, topSelectionPixel, bottomSelectionPixel);
        this.adjustForBottomFadingEdge(referenceView, topSelectionPixel, bottomSelectionPixel);
        if (!this.mStackFromBottom) {
            this.fillUp(rowStart - numColumns, referenceView.getTop() - verticalSpacing);
            this.adjustViewsUpOrDown();
            this.fillDown(rowStart + numColumns, referenceView.getBottom() + verticalSpacing);
        } else {
            this.fillDown(rowEnd + numColumns, referenceView.getBottom() + verticalSpacing);
            this.adjustViewsUpOrDown();
            this.fillUp(rowStart - 1, referenceView.getTop() - verticalSpacing);
        }
        return sel;
    }

    /**
     * Calculate the bottom-most pixel we can draw the selection into
     *
     * @param childrenBottom Bottom pixel were children can be drawn
     * @param fadingEdgeLength Length of the fading edge in pixels, if present
     * @param numColumns Number of columns in the grid
     * @param rowStart The start of the row that will contain the selection
     * @return The bottom-most pixel we can draw the selection into
     */
    private getBottomSelectionPixel(childrenBottom:number, fadingEdgeLength:number, numColumns:number, rowStart:number):number  {
        // Last pixel we can draw the selection into
        let bottomSelectionPixel:number = childrenBottom;
        if (rowStart + numColumns - 1 < this.mItemCount - 1) {
            bottomSelectionPixel -= fadingEdgeLength;
        }
        return bottomSelectionPixel;
    }

    /**
     * Calculate the top-most pixel we can draw the selection into
     *
     * @param childrenTop Top pixel were children can be drawn
     * @param fadingEdgeLength Length of the fading edge in pixels, if present
     * @param rowStart The start of the row that will contain the selection
     * @return The top-most pixel we can draw the selection into
     */
    private getTopSelectionPixel(childrenTop:number, fadingEdgeLength:number, rowStart:number):number  {
        // first pixel we can draw the selection into
        let topSelectionPixel:number = childrenTop;
        if (rowStart > 0) {
            topSelectionPixel += fadingEdgeLength;
        }
        return topSelectionPixel;
    }

    /**
     * Move all views upwards so the selected row does not interesect the bottom
     * fading edge (if necessary).
     *
     * @param childInSelectedRow A child in the row that contains the selection
     * @param topSelectionPixel The topmost pixel we can draw the selection into
     * @param bottomSelectionPixel The bottommost pixel we can draw the
     *        selection into
     */
    private adjustForBottomFadingEdge(childInSelectedRow:View, topSelectionPixel:number, bottomSelectionPixel:number):void  {
        // list
        if (childInSelectedRow.getBottom() > bottomSelectionPixel) {
            // Find space available above the selection into which we can
            // scroll upwards
            let spaceAbove:number = childInSelectedRow.getTop() - topSelectionPixel;
            // Find space required to bring the bottom of the selected item
            // fully into view
            let spaceBelow:number = childInSelectedRow.getBottom() - bottomSelectionPixel;
            let offset:number = Math.min(spaceAbove, spaceBelow);
            // Now offset the selected item to get it into view
            this.offsetChildrenTopAndBottom(-offset);
        }
    }

    /**
     * Move all views upwards so the selected row does not interesect the top
     * fading edge (if necessary).
     *
     * @param childInSelectedRow A child in the row that contains the selection
     * @param topSelectionPixel The topmost pixel we can draw the selection into
     * @param bottomSelectionPixel The bottommost pixel we can draw the
     *        selection into
     */
    private adjustForTopFadingEdge(childInSelectedRow:View, topSelectionPixel:number, bottomSelectionPixel:number):void  {
        // Some of the newly selected item extends above the top of the list
        if (childInSelectedRow.getTop() < topSelectionPixel) {
            // Find space required to bring the top of the selected item
            // fully into view
            let spaceAbove:number = topSelectionPixel - childInSelectedRow.getTop();
            // Find space available below the selection into which we can
            // scroll downwards
            let spaceBelow:number = bottomSelectionPixel - childInSelectedRow.getBottom();
            let offset:number = Math.min(spaceAbove, spaceBelow);
            // Now offset the selected item to get it into view
            this.offsetChildrenTopAndBottom(offset);
        }
    }

    /**
     * Smoothly scroll to the specified adapter position. The view will
     * scroll such that the indicated position is displayed.
     * @param position Scroll to this adapter position.
     */
    smoothScrollToPosition(position:number):void  {
        super.smoothScrollToPosition(position);
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
     * Fills the grid based on positioning the new selection relative to the old
     * selection. The new selection will be placed at, above, or below the
     * location of the new selection depending on how the selection is moving.
     * The selection will then be pinned to the visible part of the screen,
     * excluding the edges that are faded. The grid is then filled upwards and
     * downwards from there.
     *
     * @param delta Which way we are moving
     * @param childrenTop Where to start drawing children
     * @param childrenBottom Last pixel where children can be drawn
     * @return The view that currently has selection
     */
    private moveSelection(delta:number, childrenTop:number, childrenBottom:number):View  {
        const fadingEdgeLength:number = this.getVerticalFadingEdgeLength();
        const selectedPosition:number = this.mSelectedPosition;
        const numColumns:number = this.mNumColumns;
        const verticalSpacing:number = this.mVerticalSpacing;
        let oldRowStart:number;
        let rowStart:number;
        let rowEnd:number = -1;
        if (!this.mStackFromBottom) {
            oldRowStart = (selectedPosition - delta) - ((selectedPosition - delta) % numColumns);
            rowStart = selectedPosition - (selectedPosition % numColumns);
        } else {
            let invertedSelection:number = this.mItemCount - 1 - selectedPosition;
            rowEnd = this.mItemCount - 1 - (invertedSelection - (invertedSelection % numColumns));
            rowStart = Math.max(0, rowEnd - numColumns + 1);
            invertedSelection = this.mItemCount - 1 - (selectedPosition - delta);
            oldRowStart = this.mItemCount - 1 - (invertedSelection - (invertedSelection % numColumns));
            oldRowStart = Math.max(0, oldRowStart - numColumns + 1);
        }
        const rowDelta:number = rowStart - oldRowStart;
        const topSelectionPixel:number = this.getTopSelectionPixel(childrenTop, fadingEdgeLength, rowStart);
        const bottomSelectionPixel:number = this.getBottomSelectionPixel(childrenBottom, fadingEdgeLength, numColumns, rowStart);
        // Possibly changed again in fillUp if we add rows above this one.
        this.mFirstPosition = rowStart;
        let sel:View;
        let referenceView:View;
        if (rowDelta > 0) {
            /*
             * Case 1: Scrolling down.
             */
            const oldBottom:number = this.mReferenceViewInSelectedRow == null ? 0 : this.mReferenceViewInSelectedRow.getBottom();
            sel = this.makeRow(this.mStackFromBottom ? rowEnd : rowStart, oldBottom + verticalSpacing, true);
            referenceView = this.mReferenceView;
            this.adjustForBottomFadingEdge(referenceView, topSelectionPixel, bottomSelectionPixel);
        } else if (rowDelta < 0) {
            /*
             * Case 2: Scrolling up.
             */
            const oldTop:number = this.mReferenceViewInSelectedRow == null ? 0 : this.mReferenceViewInSelectedRow.getTop();
            sel = this.makeRow(this.mStackFromBottom ? rowEnd : rowStart, oldTop - verticalSpacing, false);
            referenceView = this.mReferenceView;
            this.adjustForTopFadingEdge(referenceView, topSelectionPixel, bottomSelectionPixel);
        } else {
            /*
             * Keep selection where it was
             */
            const oldTop:number = this.mReferenceViewInSelectedRow == null ? 0 : this.mReferenceViewInSelectedRow.getTop();
            sel = this.makeRow(this.mStackFromBottom ? rowEnd : rowStart, oldTop, true);
            referenceView = this.mReferenceView;
        }
        if (!this.mStackFromBottom) {
            this.fillUp(rowStart - numColumns, referenceView.getTop() - verticalSpacing);
            this.adjustViewsUpOrDown();
            this.fillDown(rowStart + numColumns, referenceView.getBottom() + verticalSpacing);
        } else {
            this.fillDown(rowEnd + numColumns, referenceView.getBottom() + verticalSpacing);
            this.adjustViewsUpOrDown();
            this.fillUp(rowStart - 1, referenceView.getTop() - verticalSpacing);
        }
        return sel;
    }

    private determineColumns(availableSpace:number):boolean  {
        const requestedHorizontalSpacing:number = this.mRequestedHorizontalSpacing;
        const stretchMode:number = this.mStretchMode;
        const requestedColumnWidth:number = this.mRequestedColumnWidth;
        let didNotInitiallyFit:boolean = false;
        if (this.mRequestedNumColumns == GridView.AUTO_FIT) {
            if (requestedColumnWidth > 0) {
                // Client told us to pick the number of columns
                this.mNumColumns = (availableSpace + requestedHorizontalSpacing) / (requestedColumnWidth + requestedHorizontalSpacing);
            } else {
                // Just make up a number if we don't have enough info
                this.mNumColumns = 2;
            }
        } else {
            // We picked the columns
            this.mNumColumns = this.mRequestedNumColumns;
        }
        if (this.mNumColumns <= 0) {
            this.mNumColumns = 1;
        }
        switch(stretchMode) {
            case GridView.NO_STRETCH:
                // Nobody stretches
                this.mColumnWidth = requestedColumnWidth;
                this.mHorizontalSpacing = requestedHorizontalSpacing;
                break;
            default:
                let spaceLeftOver:number = availableSpace - (this.mNumColumns * requestedColumnWidth) - ((this.mNumColumns - 1) * requestedHorizontalSpacing);
                if (spaceLeftOver < 0) {
                    didNotInitiallyFit = true;
                }
                switch(stretchMode) {
                    case GridView.STRETCH_COLUMN_WIDTH:
                        // Stretch the columns
                        this.mColumnWidth = requestedColumnWidth + spaceLeftOver / this.mNumColumns;
                        this.mHorizontalSpacing = requestedHorizontalSpacing;
                        break;
                    case GridView.STRETCH_SPACING:
                        // Stretch the spacing between columns
                        this.mColumnWidth = requestedColumnWidth;
                        if (this.mNumColumns > 1) {
                            this.mHorizontalSpacing = requestedHorizontalSpacing + spaceLeftOver / (this.mNumColumns - 1);
                        } else {
                            this.mHorizontalSpacing = requestedHorizontalSpacing + spaceLeftOver;
                        }
                        break;
                    case GridView.STRETCH_SPACING_UNIFORM:
                        // Stretch the spacing between columns
                        this.mColumnWidth = requestedColumnWidth;
                        if (this.mNumColumns > 1) {
                            this.mHorizontalSpacing = requestedHorizontalSpacing + spaceLeftOver / (this.mNumColumns + 1);
                        } else {
                            this.mHorizontalSpacing = requestedHorizontalSpacing + spaceLeftOver;
                        }
                        break;
                }
                break;
        }
        return didNotInitiallyFit;
    }

    protected onMeasure(widthMeasureSpec:number, heightMeasureSpec:number):void  {
        // Sets up mListPadding
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        let widthMode:number = View.MeasureSpec.getMode(widthMeasureSpec);
        let heightMode:number = View.MeasureSpec.getMode(heightMeasureSpec);
        let widthSize:number = View.MeasureSpec.getSize(widthMeasureSpec);
        let heightSize:number = View.MeasureSpec.getSize(heightMeasureSpec);
        if (widthMode == View.MeasureSpec.UNSPECIFIED) {
            if (this.mColumnWidth > 0) {
                widthSize = this.mColumnWidth + this.mListPadding.left + this.mListPadding.right;
            } else {
                widthSize = this.mListPadding.left + this.mListPadding.right;
            }
            widthSize += this.getVerticalScrollbarWidth();
        }
        let childWidth:number = widthSize - this.mListPadding.left - this.mListPadding.right;
        let didNotInitiallyFit:boolean = this.determineColumns(childWidth);
        let childHeight:number = 0;
        let childState:number = 0;
        this.mItemCount = this.mAdapter == null ? 0 : this.mAdapter.getCount();
        const count:number = this.mItemCount;
        if (count > 0) {
            const child:View = this.obtainView(0, this.mIsScrap);
            let p:AbsListView.LayoutParams = <AbsListView.LayoutParams> child.getLayoutParams();
            if (p == null) {
                p = <AbsListView.LayoutParams> this.generateDefaultLayoutParams();
                child.setLayoutParams(p);
            }
            p.viewType = this.mAdapter.getItemViewType(0);
            p.forceAdd = true;
            let childHeightSpec:number = GridView.getChildMeasureSpec(View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED), 0, p.height);
            let childWidthSpec:number = GridView.getChildMeasureSpec(View.MeasureSpec.makeMeasureSpec(this.mColumnWidth, View.MeasureSpec.EXACTLY), 0, p.width);
            child.measure(childWidthSpec, childHeightSpec);
            childHeight = child.getMeasuredHeight();
            childState = GridView.combineMeasuredStates(childState, child.getMeasuredState());
            if (this.mRecycler.shouldRecycleViewType(p.viewType)) {
                this.mRecycler.addScrapView(child, -1);
            }
        }
        if (heightMode == View.MeasureSpec.UNSPECIFIED) {
            heightSize = this.mListPadding.top + this.mListPadding.bottom + childHeight + this.getVerticalFadingEdgeLength() * 2;
        }
        if (heightMode == View.MeasureSpec.AT_MOST) {
            let ourSize:number = this.mListPadding.top + this.mListPadding.bottom;
            const numColumns:number = this.mNumColumns;
            for (let i:number = 0; i < count; i += numColumns) {
                ourSize += childHeight;
                if (i + numColumns < count) {
                    ourSize += this.mVerticalSpacing;
                }
                if (ourSize >= heightSize) {
                    ourSize = heightSize;
                    break;
                }
            }
            heightSize = ourSize;
        }
        if (widthMode == View.MeasureSpec.AT_MOST && this.mRequestedNumColumns != GridView.AUTO_FIT) {
            let ourSize:number = (this.mRequestedNumColumns * this.mColumnWidth) + ((this.mRequestedNumColumns - 1) * this.mHorizontalSpacing) + this.mListPadding.left + this.mListPadding.right;
            if (ourSize > widthSize || didNotInitiallyFit) {
                widthSize |= GridView.MEASURED_STATE_TOO_SMALL;
            }
        }
        this.setMeasuredDimension(widthSize, heightSize);
        this.mWidthMeasureSpec = widthMeasureSpec;
    }

    protected layoutChildren():void  {
        const blockLayoutRequests:boolean = this.mBlockLayoutRequests;
        if (!blockLayoutRequests) {
            this.mBlockLayoutRequests = true;
        }
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
            let childCount:number = this.getChildCount();
            let index:number;
            let delta:number = 0;
            let sel:View;
            let oldSel:View = null;
            let oldFirst:View = null;
            let newSel:View = null;
            // Remember stuff we will need down below
            switch(this.mLayoutMode) {
                case GridView.LAYOUT_SET_SELECTION:
                    index = this.mNextSelectedPosition - this.mFirstPosition;
                    if (index >= 0 && index < childCount) {
                        newSel = this.getChildAt(index);
                    }
                    break;
                case GridView.LAYOUT_FORCE_TOP:
                case GridView.LAYOUT_FORCE_BOTTOM:
                case GridView.LAYOUT_SPECIFIC:
                case GridView.LAYOUT_SYNC:
                    break;
                case GridView.LAYOUT_MOVE_SELECTION:
                    if (this.mNextSelectedPosition >= 0) {
                        delta = this.mNextSelectedPosition - this.mSelectedPosition;
                    }
                    break;
                default:
                    // Remember the previously selected view
                    index = this.mSelectedPosition - this.mFirstPosition;
                    if (index >= 0 && index < childCount) {
                        oldSel = this.getChildAt(index);
                    }
                    // Remember the previous first child
                    oldFirst = this.getChildAt(0);
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
            }
            this.setSelectedPositionInt(this.mNextSelectedPosition);
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
            //removeAllViewsInLayout();
            this.detachAllViewsFromParent();
            recycleBin.removeSkippedScrap();
            switch(this.mLayoutMode) {
                case GridView.LAYOUT_SET_SELECTION:
                    if (newSel != null) {
                        sel = this.fillFromSelection(newSel.getTop(), childrenTop, childrenBottom);
                    } else {
                        sel = this.fillSelection(childrenTop, childrenBottom);
                    }
                    break;
                case GridView.LAYOUT_FORCE_TOP:
                    this.mFirstPosition = 0;
                    sel = this.fillFromTop(childrenTop);
                    this.adjustViewsUpOrDown();
                    break;
                case GridView.LAYOUT_FORCE_BOTTOM:
                    sel = this.fillUp(this.mItemCount - 1, childrenBottom);
                    this.adjustViewsUpOrDown();
                    break;
                case GridView.LAYOUT_SPECIFIC:
                    sel = this.fillSpecific(this.mSelectedPosition, this.mSpecificTop);
                    break;
                case GridView.LAYOUT_SYNC:
                    sel = this.fillSpecific(this.mSyncPosition, this.mSpecificTop);
                    break;
                case GridView.LAYOUT_MOVE_SELECTION:
                    // Move the selection relative to its old position
                    sel = this.moveSelection(delta, childrenTop, childrenBottom);
                    break;
                default:
                    if (childCount == 0) {
                        if (!this.mStackFromBottom) {
                            this.setSelectedPositionInt(this.mAdapter == null || this.isInTouchMode() ? GridView.INVALID_POSITION : 0);
                            sel = this.fillFromTop(childrenTop);
                        } else {
                            const last:number = this.mItemCount - 1;
                            this.setSelectedPositionInt(this.mAdapter == null || this.isInTouchMode() ? GridView.INVALID_POSITION : last);
                            sel = this.fillFromBottom(last, childrenBottom);
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
                this.positionSelector(GridView.INVALID_POSITION, sel);
                this.mSelectedTop = sel.getTop();
            } else if (this.mTouchMode > GridView.TOUCH_MODE_DOWN && this.mTouchMode < GridView.TOUCH_MODE_SCROLL) {
                let child:View = this.getChildAt(this.mMotionPosition - this.mFirstPosition);
                if (child != null)
                    this.positionSelector(this.mMotionPosition, child);
            } else {
                this.mSelectedTop = 0;
                this.mSelectorRect.setEmpty();
            }
            this.mLayoutMode = GridView.LAYOUT_NORMAL;
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
     * Obtain the view and add it to our list of children. The view can be made
     * fresh, converted from an unused view, or used as is if it was in the
     * recycle bin.
     *
     * @param position Logical position in the list
     * @param y Top or bottom edge of the view to add
     * @param flow if true, align top edge to y. If false, align bottom edge to
     *        y.
     * @param childrenLeft Left edge where children should be positioned
     * @param selected Is this position selected?
     * @param where to add new item in the list
     * @return View that was added
     */
    private makeAndAddView(position:number, y:number, flow:boolean, childrenLeft:number, selected:boolean, where:number):View  {
        let child:View;
        if (!this.mDataChanged) {
            // Try to use an existing view for this position
            child = this.mRecycler.getActiveView(position);
            if (child != null) {
                // Found it -- we're using an existing child
                // This just needs to be positioned
                this.setupChild(child, position, y, flow, childrenLeft, selected, true, where);
                return child;
            }
        }
        // Make a new view for this position, or convert an unused view if
        // possible
        child = this.obtainView(position, this.mIsScrap);
        // This needs to be positioned and measured
        this.setupChild(child, position, y, flow, childrenLeft, selected, this.mIsScrap[0], where);
        return child;
    }

    /**
     * Add a view as a child and make sure it is measured (if necessary) and
     * positioned properly.
     *
     * @param child The view to add
     * @param position The position of the view
     * @param y The y position relative to which this view will be positioned
     * @param flow if true, align top edge to y. If false, align bottom edge
     *        to y.
     * @param childrenLeft Left edge where children should be positioned
     * @param selected Is this position selected?
     * @param recycled Has this view been pulled from the recycle bin? If so it
     *        does not need to be remeasured.
     * @param where Where to add the item in the list
     *
     */
    private setupChild(child:View, position:number, y:number, flow:boolean, childrenLeft:number, selected:boolean, recycled:boolean, where:number):void  {
        Trace.traceBegin(Trace.TRACE_TAG_VIEW, "setupGridItem");
        let isSelected:boolean = selected && this.shouldShowSelector();
        const updateChildSelected:boolean = isSelected != child.isSelected();
        const mode:number = this.mTouchMode;
        const isPressed:boolean = mode > GridView.TOUCH_MODE_DOWN && mode < GridView.TOUCH_MODE_SCROLL && this.mMotionPosition == position;
        const updateChildPressed:boolean = isPressed != child.isPressed();
        let needToMeasure:boolean = !recycled || updateChildSelected || child.isLayoutRequested();
        // Respect layout params that are already in the view. Otherwise make
        // some up...
        let p:AbsListView.LayoutParams = <AbsListView.LayoutParams> child.getLayoutParams();
        if (p == null) {
            p = <AbsListView.LayoutParams> this.generateDefaultLayoutParams();
        }
        p.viewType = this.mAdapter.getItemViewType(position);
        if (recycled && !p.forceAdd) {
            this.attachViewToParent(child, where, p);
        } else {
            p.forceAdd = false;
            this.addViewInLayout(child, where, p, true);
        }
        if (updateChildSelected) {
            child.setSelected(isSelected);
            if (isSelected) {
                this.requestFocus();
            }
        }
        if (updateChildPressed) {
            child.setPressed(isPressed);
        }
        if (this.mChoiceMode != GridView.CHOICE_MODE_NONE && this.mCheckStates != null) {
            if (child['setChecked']) {
                (<Checkable><any>child).setChecked(this.mCheckStates.get(position));
            } else {
                child.setActivated(this.mCheckStates.get(position));
            }
        }
        if (needToMeasure) {
            let childHeightSpec:number = ViewGroup.getChildMeasureSpec(View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED), 0, p.height);
            let childWidthSpec:number = ViewGroup.getChildMeasureSpec(View.MeasureSpec.makeMeasureSpec(this.mColumnWidth, View.MeasureSpec.EXACTLY), 0, p.width);
            child.measure(childWidthSpec, childHeightSpec);
        } else {
            this.cleanupLayoutState(child);
        }
        const w:number = child.getMeasuredWidth();
        const h:number = child.getMeasuredHeight();
        let childLeft:number;
        const childTop:number = flow ? y : y - h;
        //const layoutDirection:number = this.getLayoutDirection();
        const absoluteGravity:number = this.mGravity;//Gravity.getAbsoluteGravity(this.mGravity, layoutDirection);
        switch(absoluteGravity & Gravity.HORIZONTAL_GRAVITY_MASK) {
            case Gravity.LEFT:
                childLeft = childrenLeft;
                break;
            case Gravity.CENTER_HORIZONTAL:
                childLeft = childrenLeft + ((this.mColumnWidth - w) / 2);
                break;
            case Gravity.RIGHT:
                childLeft = childrenLeft + this.mColumnWidth - w;
                break;
            default:
                childLeft = childrenLeft;
                break;
        }
        if (needToMeasure) {
            const childRight:number = childLeft + w;
            const childBottom:number = childTop + h;
            child.layout(childLeft, childTop, childRight, childBottom);
        } else {
            child.offsetLeftAndRight(childLeft - child.getLeft());
            child.offsetTopAndBottom(childTop - child.getTop());
        }
        if (this.mCachingStarted) {
            child.setDrawingCacheEnabled(true);
        }
        if (recycled && ((<AbsListView.LayoutParams> child.getLayoutParams()).scrappedFromPosition) != position) {
            child.jumpDrawablesToCurrentState();
        }
        Trace.traceEnd(Trace.TRACE_TAG_VIEW);
    }

    /**
     * Sets the currently selected item
     * 
     * @param position Index (starting at 0) of the data item to be selected.
     * 
     * If in touch mode, the item will not be selected but it will still be positioned
     * appropriately.
     */
    setSelection(position:number):void  {
        if (!this.isInTouchMode()) {
            this.setNextSelectedPositionInt(position);
        } else {
            this.mResurrectToPosition = position;
        }
        this.mLayoutMode = GridView.LAYOUT_SET_SELECTION;
        if (this.mPositionScroller != null) {
            this.mPositionScroller.stop();
        }
        this.requestLayout();
    }

    /**
     * Makes the item at the supplied position selected.
     *
     * @param position the position of the new selection
     */
    setSelectionInt(position:number):void  {
        let previousSelectedPosition:number = this.mNextSelectedPosition;
        if (this.mPositionScroller != null) {
            this.mPositionScroller.stop();
        }
        this.setNextSelectedPositionInt(position);
        this.layoutChildren();
        const next:number = this.mStackFromBottom ? this.mItemCount - 1 - this.mNextSelectedPosition : this.mNextSelectedPosition;
        const previous:number = this.mStackFromBottom ? this.mItemCount - 1 - previousSelectedPosition : previousSelectedPosition;
        const nextRow:number = next / this.mNumColumns;
        const previousRow:number = previous / this.mNumColumns;
        if (nextRow != previousRow) {
            this.awakenScrollBars();
        }
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
        if (this.mAdapter == null) {
            return false;
        }
        if (this.mDataChanged) {
            this.layoutChildren();
        }
        let handled:boolean = false;
        let action:number = event.getAction();
        if (action != KeyEvent.ACTION_UP) {
            switch(keyCode) {
                case KeyEvent.KEYCODE_DPAD_LEFT:
                    if (event.hasNoModifiers()) {
                        handled = this.resurrectSelectionIfNeeded() || this.arrowScroll(GridView.FOCUS_LEFT);
                    }
                    break;
                case KeyEvent.KEYCODE_DPAD_RIGHT:
                    if (event.hasNoModifiers()) {
                        handled = this.resurrectSelectionIfNeeded() || this.arrowScroll(GridView.FOCUS_RIGHT);
                    }
                    break;
                case KeyEvent.KEYCODE_DPAD_UP:
                    if (event.hasNoModifiers()) {
                        handled = this.resurrectSelectionIfNeeded() || this.arrowScroll(GridView.FOCUS_UP);
                    } else if (event.hasModifiers(KeyEvent.META_ALT_ON)) {
                        handled = this.resurrectSelectionIfNeeded() || this.fullScroll(GridView.FOCUS_UP);
                    }
                    break;
                case KeyEvent.KEYCODE_DPAD_DOWN:
                    if (event.hasNoModifiers()) {
                        handled = this.resurrectSelectionIfNeeded() || this.arrowScroll(GridView.FOCUS_DOWN);
                    } else if (event.hasModifiers(KeyEvent.META_ALT_ON)) {
                        handled = this.resurrectSelectionIfNeeded() || this.fullScroll(GridView.FOCUS_DOWN);
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
                            handled = this.resurrectSelectionIfNeeded() || this.pageScroll(GridView.FOCUS_DOWN);
                        } else if (event.hasModifiers(KeyEvent.META_SHIFT_ON)) {
                            handled = this.resurrectSelectionIfNeeded() || this.pageScroll(GridView.FOCUS_UP);
                        }
                    //}
                    break;
                case KeyEvent.KEYCODE_PAGE_UP:
                    if (event.hasNoModifiers()) {
                        handled = this.resurrectSelectionIfNeeded() || this.pageScroll(GridView.FOCUS_UP);
                    } else if (event.hasModifiers(KeyEvent.META_ALT_ON)) {
                        handled = this.resurrectSelectionIfNeeded() || this.fullScroll(GridView.FOCUS_UP);
                    }
                    break;
                case KeyEvent.KEYCODE_PAGE_DOWN:
                    if (event.hasNoModifiers()) {
                        handled = this.resurrectSelectionIfNeeded() || this.pageScroll(GridView.FOCUS_DOWN);
                    } else if (event.hasModifiers(KeyEvent.META_ALT_ON)) {
                        handled = this.resurrectSelectionIfNeeded() || this.fullScroll(GridView.FOCUS_DOWN);
                    }
                    break;
                case KeyEvent.KEYCODE_MOVE_HOME:
                    if (event.hasNoModifiers()) {
                        handled = this.resurrectSelectionIfNeeded() || this.fullScroll(GridView.FOCUS_UP);
                    }
                    break;
                case KeyEvent.KEYCODE_MOVE_END:
                    if (event.hasNoModifiers()) {
                        handled = this.resurrectSelectionIfNeeded() || this.fullScroll(GridView.FOCUS_DOWN);
                    }
                    break;
                case KeyEvent.KEYCODE_TAB:
                    // XXX Sometimes it is useful to be able to TAB through the items in
                    //     a GridView sequentially.  Unfortunately this can create an
                    //     asymmetry in TAB navigation order unless the list selection
                    //     always reverts to the top or bottom when receiving TAB focus from
                    //     another widget.  Leaving this behavior disabled for now but
                    //     perhaps it should be configurable (and more comprehensive).
                    // if (false) {
                    //     if (event.hasNoModifiers()) {
                    //         handled = this.resurrectSelectionIfNeeded() || this.sequenceScroll(GridView.FOCUS_FORWARD);
                    //     } else if (event.hasModifiers(KeyEvent.META_SHIFT_ON)) {
                    //         handled = this.resurrectSelectionIfNeeded() || this.sequenceScroll(GridView.FOCUS_BACKWARD);
                    //     }
                    // }
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
        let nextPage:number = -1;
        if (direction == GridView.FOCUS_UP) {
            nextPage = Math.max(0, this.mSelectedPosition - this.getChildCount());
        } else if (direction == GridView.FOCUS_DOWN) {
            nextPage = Math.min(this.mItemCount - 1, this.mSelectedPosition + this.getChildCount());
        }
        if (nextPage >= 0) {
            this.setSelectionInt(nextPage);
            this.invokeOnItemScrollListener();
            this.awakenScrollBars();
            return true;
        }
        return false;
    }

    /**
     * Go to the last or first item if possible.
     *
     * @param direction either {@link View#FOCUS_UP} or {@link View#FOCUS_DOWN}.
     *
     * @return Whether selection was moved.
     */
    fullScroll(direction:number):boolean  {
        let moved:boolean = false;
        if (direction == GridView.FOCUS_UP) {
            this.mLayoutMode = GridView.LAYOUT_SET_SELECTION;
            this.setSelectionInt(0);
            this.invokeOnItemScrollListener();
            moved = true;
        } else if (direction == GridView.FOCUS_DOWN) {
            this.mLayoutMode = GridView.LAYOUT_SET_SELECTION;
            this.setSelectionInt(this.mItemCount - 1);
            this.invokeOnItemScrollListener();
            moved = true;
        }
        if (moved) {
            this.awakenScrollBars();
        }
        return moved;
    }

    /**
     * Scrolls to the next or previous item, horizontally or vertically.
     *
     * @param direction either {@link View#FOCUS_LEFT}, {@link View#FOCUS_RIGHT},
     *        {@link View#FOCUS_UP} or {@link View#FOCUS_DOWN}
     *
     * @return whether selection was moved
     */
    arrowScroll(direction:number):boolean  {
        const selectedPosition:number = this.mSelectedPosition;
        const numColumns:number = this.mNumColumns;
        let startOfRowPos:number;
        let endOfRowPos:number;
        let moved:boolean = false;
        if (!this.mStackFromBottom) {
            startOfRowPos = Math.floor(selectedPosition / numColumns) * numColumns;
            endOfRowPos = Math.min(startOfRowPos + numColumns - 1, this.mItemCount - 1);
        } else {
            const invertedSelection:number = this.mItemCount - 1 - selectedPosition;
            endOfRowPos = this.mItemCount - 1 - (invertedSelection / numColumns) * numColumns;
            startOfRowPos = Math.max(0, endOfRowPos - numColumns + 1);
        }
        switch(direction) {
            case GridView.FOCUS_UP:
                if (startOfRowPos > 0) {
                    this.mLayoutMode = GridView.LAYOUT_MOVE_SELECTION;
                    this.setSelectionInt(Math.max(0, selectedPosition - numColumns));
                    moved = true;
                }
                break;
            case GridView.FOCUS_DOWN:
                if (endOfRowPos < this.mItemCount - 1) {
                    this.mLayoutMode = GridView.LAYOUT_MOVE_SELECTION;
                    this.setSelectionInt(Math.min(selectedPosition + numColumns, this.mItemCount - 1));
                    moved = true;
                }
                break;
            case GridView.FOCUS_LEFT:
                if (selectedPosition > startOfRowPos) {
                    this.mLayoutMode = GridView.LAYOUT_MOVE_SELECTION;
                    this.setSelectionInt(Math.max(0, selectedPosition - 1));
                    moved = true;
                }
                break;
            case GridView.FOCUS_RIGHT:
                if (selectedPosition < endOfRowPos) {
                    this.mLayoutMode = GridView.LAYOUT_MOVE_SELECTION;
                    this.setSelectionInt(Math.min(selectedPosition + 1, this.mItemCount - 1));
                    moved = true;
                }
                break;
        }
        if (moved) {
            this.playSoundEffect(SoundEffectConstants.getContantForFocusDirection(direction));
            this.invokeOnItemScrollListener();
        }
        if (moved) {
            this.awakenScrollBars();
        }
        return moved;
    }

    /**
     * Goes to the next or previous item according to the order set by the
     * adapter.
     */
    sequenceScroll(direction:number):boolean  {
        let selectedPosition:number = this.mSelectedPosition;
        let numColumns:number = this.mNumColumns;
        let count:number = this.mItemCount;
        let startOfRow:number;
        let endOfRow:number;
        if (!this.mStackFromBottom) {
            startOfRow = (selectedPosition / numColumns) * numColumns;
            endOfRow = Math.min(startOfRow + numColumns - 1, count - 1);
        } else {
            let invertedSelection:number = count - 1 - selectedPosition;
            endOfRow = count - 1 - (invertedSelection / numColumns) * numColumns;
            startOfRow = Math.max(0, endOfRow - numColumns + 1);
        }
        let moved:boolean = false;
        let showScroll:boolean = false;
        switch(direction) {
            case GridView.FOCUS_FORWARD:
                if (selectedPosition < count - 1) {
                    // Move to the next item.
                    this.mLayoutMode = GridView.LAYOUT_MOVE_SELECTION;
                    this.setSelectionInt(selectedPosition + 1);
                    moved = true;
                    // Show the scrollbar only if changing rows.
                    showScroll = selectedPosition == endOfRow;
                }
                break;
            case GridView.FOCUS_BACKWARD:
                if (selectedPosition > 0) {
                    // Move to the previous item.
                    this.mLayoutMode = GridView.LAYOUT_MOVE_SELECTION;
                    this.setSelectionInt(selectedPosition - 1);
                    moved = true;
                    // Show the scrollbar only if changing rows.
                    showScroll = selectedPosition == startOfRow;
                }
                break;
        }
        if (moved) {
            this.playSoundEffect(SoundEffectConstants.getContantForFocusDirection(direction));
            this.invokeOnItemScrollListener();
        }
        if (showScroll) {
            this.awakenScrollBars();
        }
        return moved;
    }

    protected onFocusChanged(gainFocus:boolean, direction:number, previouslyFocusedRect:Rect):void  {
        super.onFocusChanged(gainFocus, direction, previouslyFocusedRect);
        let closestChildIndex:number = -1;
        if (gainFocus && previouslyFocusedRect != null) {
            previouslyFocusedRect.offset(this.mScrollX, this.mScrollY);
            // figure out which item should be selected based on previously
            // focused rect
            let otherRect:Rect = this.mTempRect;
            let minDistance:number = Integer.MAX_VALUE;
            const childCount:number = this.getChildCount();
            for (let i:number = 0; i < childCount; i++) {
                // only consider view's on appropriate edge of grid
                if (!this.isCandidateSelection(i, direction)) {
                    continue;
                }
                const other:View = this.getChildAt(i);
                other.getDrawingRect(otherRect);
                this.offsetDescendantRectToMyCoords(other, otherRect);
                let distance:number = GridView.getDistance(previouslyFocusedRect, otherRect, direction);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestChildIndex = i;
                }
            }
        }
        if (closestChildIndex >= 0) {
            this.setSelection(closestChildIndex + this.mFirstPosition);
        } else {
            this.requestLayout();
        }
    }

    /**
     * Is childIndex a candidate for next focus given the direction the focus
     * change is coming from?
     * @param childIndex The index to check.
     * @param direction The direction, one of
     *        {FOCUS_UP, FOCUS_DOWN, FOCUS_LEFT, FOCUS_RIGHT, FOCUS_FORWARD, FOCUS_BACKWARD}
     * @return Whether childIndex is a candidate.
     */
    private isCandidateSelection(childIndex:number, direction:number):boolean  {
        const count:number = this.getChildCount();
        const invertedIndex:number = count - 1 - childIndex;
        let rowStart:number;
        let rowEnd:number;
        if (!this.mStackFromBottom) {
            rowStart = childIndex - (childIndex % this.mNumColumns);
            rowEnd = Math.max(rowStart + this.mNumColumns - 1, count);
        } else {
            rowEnd = count - 1 - (invertedIndex - (invertedIndex % this.mNumColumns));
            rowStart = Math.max(0, rowEnd - this.mNumColumns + 1);
        }
        switch(direction) {
            case View.FOCUS_RIGHT:
                // edge
                return childIndex == rowStart;
            case View.FOCUS_DOWN:
                // coming from top; only valid if in top row
                return rowStart == 0;
            case View.FOCUS_LEFT:
                // coming from right, must be on right edge
                return childIndex == rowEnd;
            case View.FOCUS_UP:
                // coming from bottom, need to be in last row
                return rowEnd == count - 1;
            case View.FOCUS_FORWARD:
                // coming from top-left, need to be first in top row
                return childIndex == rowStart && rowStart == 0;
            case View.FOCUS_BACKWARD:
                // coming from bottom-right, need to be last in bottom row
                return childIndex == rowEnd && rowEnd == count - 1;
            default:
                throw Error(`new IllegalArgumentException("direction must be one of " + "{FOCUS_UP, FOCUS_DOWN, FOCUS_LEFT, FOCUS_RIGHT, " + "FOCUS_FORWARD, FOCUS_BACKWARD}.")`);
        }
    }

    /**
     * Set the gravity for this grid. Gravity describes how the child views
     * are horizontally aligned. Defaults to Gravity.LEFT
     *
     * @param gravity the gravity to apply to this grid's children
     *
     * @attr ref android.R.styleable#GridView_gravity
     */
    setGravity(gravity:number):void  {
        if (this.mGravity != gravity) {
            this.mGravity = gravity;
            this.requestLayoutIfNecessary();
        }
    }

    /**
     * Describes how the child views are horizontally aligned. Defaults to Gravity.LEFT
     *
     * @return the gravity that will be applied to this grid's children
     *
     * @attr ref android.R.styleable#GridView_gravity
     */
    getGravity():number  {
        return this.mGravity;
    }

    /**
     * Set the amount of horizontal (x) spacing to place between each item
     * in the grid.
     *
     * @param horizontalSpacing The amount of horizontal space between items,
     * in pixels.
     *
     * @attr ref android.R.styleable#GridView_horizontalSpacing
     */
    setHorizontalSpacing(horizontalSpacing:number):void  {
        if (horizontalSpacing != this.mRequestedHorizontalSpacing) {
            this.mRequestedHorizontalSpacing = horizontalSpacing;
            this.requestLayoutIfNecessary();
        }
    }

    /**
     * Returns the amount of horizontal spacing currently used between each item in the grid.
     *
     * <p>This is only accurate for the current layout. If {@link #setHorizontalSpacing(int)}
     * has been called but layout is not yet complete, this method may return a stale value.
     * To get the horizontal spacing that was explicitly requested use
     * {@link #getRequestedHorizontalSpacing()}.</p>
     *
     * @return Current horizontal spacing between each item in pixels
     *
     * @see #setHorizontalSpacing(int)
     * @see #getRequestedHorizontalSpacing()
     *
     * @attr ref android.R.styleable#GridView_horizontalSpacing
     */
    getHorizontalSpacing():number  {
        return this.mHorizontalSpacing;
    }

    /**
     * Returns the requested amount of horizontal spacing between each item in the grid.
     *
     * <p>The value returned may have been supplied during inflation as part of a style,
     * the default GridView style, or by a call to {@link #setHorizontalSpacing(int)}.
     * If layout is not yet complete or if GridView calculated a different horizontal spacing
     * from what was requested, this may return a different value from
     * {@link #getHorizontalSpacing()}.</p>
     *
     * @return The currently requested horizontal spacing between items, in pixels
     *
     * @see #setHorizontalSpacing(int)
     * @see #getHorizontalSpacing()
     *
     * @attr ref android.R.styleable#GridView_horizontalSpacing
     */
    getRequestedHorizontalSpacing():number  {
        return this.mRequestedHorizontalSpacing;
    }

    /**
     * Set the amount of vertical (y) spacing to place between each item
     * in the grid.
     *
     * @param verticalSpacing The amount of vertical space between items,
     * in pixels.
     *
     * @see #getVerticalSpacing()
     *
     * @attr ref android.R.styleable#GridView_verticalSpacing
     */
    setVerticalSpacing(verticalSpacing:number):void  {
        if (verticalSpacing != this.mVerticalSpacing) {
            this.mVerticalSpacing = verticalSpacing;
            this.requestLayoutIfNecessary();
        }
    }

    /**
     * Returns the amount of vertical spacing between each item in the grid.
     *
     * @return The vertical spacing between items in pixels
     *
     * @see #setVerticalSpacing(int)
     *
     * @attr ref android.R.styleable#GridView_verticalSpacing
     */
    getVerticalSpacing():number  {
        return this.mVerticalSpacing;
    }

    /**
     * Control how items are stretched to fill their space.
     *
     * @param stretchMode Either {@link #NO_STRETCH},
     * {@link #STRETCH_SPACING}, {@link #STRETCH_SPACING_UNIFORM}, or {@link #STRETCH_COLUMN_WIDTH}.
     *
     * @attr ref android.R.styleable#GridView_stretchMode
     */
    setStretchMode(stretchMode:number):void  {
        if (stretchMode != this.mStretchMode) {
            this.mStretchMode = stretchMode;
            this.requestLayoutIfNecessary();
        }
    }

    getStretchMode():number  {
        return this.mStretchMode;
    }

    /**
     * Set the width of columns in the grid.
     *
     * @param columnWidth The column width, in pixels.
     *
     * @attr ref android.R.styleable#GridView_columnWidth
     */
    setColumnWidth(columnWidth:number):void  {
        if (columnWidth != this.mRequestedColumnWidth) {
            this.mRequestedColumnWidth = columnWidth;
            this.requestLayoutIfNecessary();
        }
    }

    /**
     * Return the width of a column in the grid.
     *
     * <p>This may not be valid yet if a layout is pending.</p>
     *
     * @return The column width in pixels
     *
     * @see #setColumnWidth(int)
     * @see #getRequestedColumnWidth()
     *
     * @attr ref android.R.styleable#GridView_columnWidth
     */
    getColumnWidth():number  {
        return this.mColumnWidth;
    }

    /**
     * Return the requested width of a column in the grid.
     *
     * <p>This may not be the actual column width used. Use {@link #getColumnWidth()}
     * to retrieve the current real width of a column.</p>
     *
     * @return The requested column width in pixels
     *
     * @see #setColumnWidth(int)
     * @see #getColumnWidth()
     *
     * @attr ref android.R.styleable#GridView_columnWidth
     */
    getRequestedColumnWidth():number  {
        return this.mRequestedColumnWidth;
    }

    /**
     * Set the number of columns in the grid
     *
     * @param numColumns The desired number of columns.
     *
     * @attr ref android.R.styleable#GridView_numColumns
     */
    setNumColumns(numColumns:number):void  {
        if (numColumns != this.mRequestedNumColumns) {
            this.mRequestedNumColumns = numColumns;
            this.requestLayoutIfNecessary();
        }
    }

    /**
     * Get the number of columns in the grid. 
     * Returns {@link #AUTO_FIT} if the Grid has never been laid out.
     *
     * @attr ref android.R.styleable#GridView_numColumns
     * 
     * @see #setNumColumns(int)
     */
    getNumColumns():number  {
        return this.mNumColumns;
    }

    /**
     * Make sure views are touching the top or bottom edge, as appropriate for
     * our gravity
     */
    private adjustViewsUpOrDown():void  {
        const childCount:number = this.getChildCount();
        if (childCount > 0) {
            let delta:number;
            let child:View;
            if (!this.mStackFromBottom) {
                // Uh-oh -- we came up short. Slide all views up to make them
                // align with the top
                child = this.getChildAt(0);
                delta = child.getTop() - this.mListPadding.top;
                if (this.mFirstPosition != 0) {
                    // It's OK to have some space above the first item if it is
                    // part of the vertical spacing
                    delta -= this.mVerticalSpacing;
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
                    delta += this.mVerticalSpacing;
                }
                if (delta > 0) {
                    // We only are looking to see if we are too high, not too low
                    delta = 0;
                }
            }
            if (delta != 0) {
                this.offsetChildrenTopAndBottom(-delta);
            }
        }
    }

    protected computeVerticalScrollExtent():number  {
        const count:number = this.getChildCount();
        if (count > 0) {
            const numColumns:number = this.mNumColumns;
            const rowCount:number = (count + numColumns - 1) / numColumns;
            let extent:number = rowCount * 100;
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
        }
        return 0;
    }

    protected computeVerticalScrollOffset():number  {
        if (this.mFirstPosition >= 0 && this.getChildCount() > 0) {
            const view:View = this.getChildAt(0);
            const top:number = view.getTop();
            let height:number = view.getHeight();
            if (height > 0) {
                const numColumns:number = this.mNumColumns;
                const rowCount:number = (this.mItemCount + numColumns - 1) / numColumns;
                // In case of stackFromBottom the calculation of whichRow needs
                // to take into account that counting from the top the first row
                // might not be entirely filled.
                const oddItemsOnFirstRow:number = this.isStackFromBottom() ? ((rowCount * numColumns) - this.mItemCount) : 0;
                const whichRow:number = (this.mFirstPosition + oddItemsOnFirstRow) / numColumns;
                return Math.max(whichRow * 100 - (top * 100) / height + Math.floor((<number> this.mScrollY / this.getHeight() * rowCount * 100)), 0);
            }
        }
        return 0;
    }

    protected computeVerticalScrollRange():number  {
        // TODO: Account for vertical spacing too
        const numColumns:number = this.mNumColumns;
        const rowCount:number = (this.mItemCount + numColumns - 1) / numColumns;
        let result:number = Math.max(rowCount * 100, 0);
        if (this.mScrollY != 0) {
            // Compensate for overscroll
            result += Math.abs(Math.floor((<number> this.mScrollY / this.getHeight() * rowCount * 100)));
        }
        return result;
    }
}
}
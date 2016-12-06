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
///<reference path="../../android/view/SoundEffectConstants.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../java/util/ArrayList.ts"/>
///<reference path="../../android/widget/Adapter.ts"/>
///<reference path="../../android/widget/AdapterView.ts"/>
///<reference path="../../android/widget/ExpandableListAdapter.ts"/>
///<reference path="../../android/widget/ExpandableListConnector.ts"/>
///<reference path="../../android/widget/ExpandableListPosition.ts"/>
///<reference path="../../android/widget/ListAdapter.ts"/>
///<reference path="../../android/widget/ListView.ts"/>
///<reference path="../../android/widget/ScrollView.ts"/>
///<reference path="../../android/R/attr.ts"/>
///<reference path="../../androidui/util/Long.ts"/>

module android.widget {
import Canvas = android.graphics.Canvas;
import Rect = android.graphics.Rect;
import Drawable = android.graphics.drawable.Drawable;
import SoundEffectConstants = android.view.SoundEffectConstants;
import View = android.view.View;
import PositionMetadata = android.widget.ExpandableListConnector.PositionMetadata;
import ArrayList = java.util.ArrayList;
import Adapter = android.widget.Adapter;
import AdapterView = android.widget.AdapterView;
import ExpandableListAdapter = android.widget.ExpandableListAdapter;
import ExpandableListConnector = android.widget.ExpandableListConnector;
import ExpandableListPosition = android.widget.ExpandableListPosition;
import ListAdapter = android.widget.ListAdapter;
import ListView = android.widget.ListView;
import ScrollView = android.widget.ScrollView;
import Long = goog.math.Long;
    import AttrBinder = androidui.attr.AttrBinder;

/**
 * A view that shows items in a vertically scrolling two-level list. This
 * differs from the {@link ListView} by allowing two levels: groups which can
 * individually be expanded to show its children. The items come from the
 * {@link ExpandableListAdapter} associated with this view.
 * <p>
 * Expandable lists are able to show an indicator beside each item to display
 * the item's current state (the states are usually one of expanded group,
 * collapsed group, child, or last child). Use
 * {@link #setChildIndicator(Drawable)} or {@link #setGroupIndicator(Drawable)}
 * (or the corresponding XML attributes) to set these indicators (see the docs
 * for each method to see additional state that each Drawable can have). The
 * default style for an {@link ExpandableListView} provides indicators which
 * will be shown next to Views given to the {@link ExpandableListView}. The
 * layouts android.R.layout.simple_expandable_list_item_1 and
 * android.R.layout.simple_expandable_list_item_2 (which should be used with
 * {@link SimpleCursorTreeAdapter}) contain the preferred position information
 * for indicators.
 * <p>
 * The context menu information set by an {@link ExpandableListView} will be a
 * {@link ExpandableListContextMenuInfo} object with
 * {@link ExpandableListContextMenuInfo#packedPosition} being a packed position
 * that can be used with {@link #getPackedPositionType(long)} and the other
 * similar methods.
 * <p>
 * <em><b>Note:</b></em> You cannot use the value <code>wrap_content</code>
 * for the <code>android:layout_height</code> attribute of a
 * ExpandableListView in XML if the parent's size is also not strictly specified
 * (for example, if the parent were ScrollView you could not specify
 * wrap_content since it also can be any length. However, you can use
 * wrap_content if the ExpandableListView parent has a specific size, such as
 * 100 pixels.
 * 
 * @attr ref android.R.styleable#ExpandableListView_groupIndicator
 * @attr ref android.R.styleable#ExpandableListView_indicatorLeft
 * @attr ref android.R.styleable#ExpandableListView_indicatorRight
 * @attr ref android.R.styleable#ExpandableListView_childIndicator
 * @attr ref android.R.styleable#ExpandableListView_childIndicatorLeft
 * @attr ref android.R.styleable#ExpandableListView_childIndicatorRight
 * @attr ref android.R.styleable#ExpandableListView_childDivider
 * @attr ref android.R.styleable#ExpandableListView_indicatorStart
 * @attr ref android.R.styleable#ExpandableListView_indicatorEnd
 * @attr ref android.R.styleable#ExpandableListView_childIndicatorStart
 * @attr ref android.R.styleable#ExpandableListView_childIndicatorEnd
 */
export class ExpandableListView extends ListView {

    /**
     * The packed position represents a group.
     */
    static PACKED_POSITION_TYPE_GROUP:number = 0;

    /**
     * The packed position represents a child.
     */
    static PACKED_POSITION_TYPE_CHILD:number = 1;

    /**
     * The packed position represents a neither/null/no preference.
     */
    static PACKED_POSITION_TYPE_NULL:number = 2;

    /**
     * The value for a packed position that represents neither/null/no
     * preference. This value is not otherwise possible since a group type
     * (first bit 0) should not have a child position filled.
     */
    static PACKED_POSITION_VALUE_NULL:number = 0x00000000FFFFFFFF;

    /** The mask (in packed position representation) for the child */
    private static PACKED_POSITION_MASK_CHILD = Long.fromNumber(0x00000000FFFFFFFF);

    /** The mask (in packed position representation) for the group */
    private static PACKED_POSITION_MASK_GROUP = Long.fromNumber(0x7FFFFFFF00000000);

    /** The mask (in packed position representation) for the type */
    private static PACKED_POSITION_MASK_TYPE = Long.fromNumber(0x8000000000000000);

    /** The shift amount (in packed position representation) for the group */
    private static PACKED_POSITION_SHIFT_GROUP:number = 32;

    /** The shift amount (in packed position representation) for the type */
    private static PACKED_POSITION_SHIFT_TYPE:number = 63;

    /** The mask (in integer child position representation) for the child */
    private static PACKED_POSITION_INT_MASK_CHILD = Long.fromNumber(0xFFFFFFFF);

    /** The mask (in integer group position representation) for the group */
    private static PACKED_POSITION_INT_MASK_GROUP = Long.fromNumber(0x7FFFFFFF);

    /** Serves as the glue/translator between a ListView and an ExpandableListView */
    private mConnector:ExpandableListConnector;

    /** Gives us Views through group+child positions */
    private mExpandAdapter:ExpandableListAdapter;

    /** Left bound for drawing the indicator. */
    private mIndicatorLeft:number = 0;

    /** Right bound for drawing the indicator. */
    private mIndicatorRight:number = 0;

    /** Start bound for drawing the indicator. */
    private mIndicatorStart:number = 0;

    /** End bound for drawing the indicator. */
    private mIndicatorEnd:number = 0;

    /**
     * Left bound for drawing the indicator of a child. Value of
     * {@link #CHILD_INDICATOR_INHERIT} means use mIndicatorLeft.
     */
    private mChildIndicatorLeft:number = 0;

    /**
     * Right bound for drawing the indicator of a child. Value of
     * {@link #CHILD_INDICATOR_INHERIT} means use mIndicatorRight.
     */
    private mChildIndicatorRight:number = 0;

    /**
     * Start bound for drawing the indicator of a child. Value of
     * {@link #CHILD_INDICATOR_INHERIT} means use mIndicatorStart.
     */
    private mChildIndicatorStart:number = 0;

    /**
     * End bound for drawing the indicator of a child. Value of
     * {@link #CHILD_INDICATOR_INHERIT} means use mIndicatorEnd.
     */
    private mChildIndicatorEnd:number = 0;

    /**
     * Denotes when a child indicator should inherit this bound from the generic
     * indicator bounds
     */
    static CHILD_INDICATOR_INHERIT:number = -1;

    /**
     * Denotes an undefined value for an indicator
     */
    private static INDICATOR_UNDEFINED:number = -2;

    /** The indicator drawn next to a group. */
    private mGroupIndicator:Drawable;

    /** The indicator drawn next to a child. */
    private mChildIndicator:Drawable;

    /** State indicating the group is expanded. */
    private static GROUP_EXPANDED_STATE_SET:number[] = [ View.VIEW_STATE_EXPANDED ];

    /** State indicating the group is empty (has no children). */
    private static GROUP_EMPTY_STATE_SET:number[] = [ View.VIEW_STATE_EMPTY ];

    /** State indicating the group is expanded and empty (has no children). */
    private static GROUP_EXPANDED_EMPTY_STATE_SET:number[] = [ View.VIEW_STATE_EXPANDED, View.VIEW_STATE_EMPTY ];

    /** States for the group where the 0th bit is expanded and 1st bit is empty. */
    private static GROUP_STATE_SETS:number[][] = [
    // 00
    ExpandableListView.EMPTY_STATE_SET,
    // 01
    ExpandableListView.GROUP_EXPANDED_STATE_SET,
    // 10
    ExpandableListView.GROUP_EMPTY_STATE_SET,
    // 11
    ExpandableListView.GROUP_EXPANDED_EMPTY_STATE_SET ];

    /** State indicating the child is the last within its group. */
    private static CHILD_LAST_STATE_SET:number[] = [ View.VIEW_STATE_LAST ];

    /** Drawable to be used as a divider when it is adjacent to any children */
    private mChildDivider:Drawable;

    // Bounds of the indicator to be drawn
    private mIndicatorRect:Rect = new Rect();

    constructor(context:android.content.Context, attrs?:HTMLElement, defStyle=android.R.attr.expandableListViewStyle) {
       super(context, attrs, defStyle);
       let a = context.obtainStyledAttributes(attrs, defStyle);
       this.mGroupIndicator = a.getDrawable('groupIndicator');
       this.mChildIndicator = a.getDrawable('childIndicator');
       this.mIndicatorLeft = a.getDimensionPixelSize('indicatorLeft', 0);
       this.mIndicatorRight = a.getDimensionPixelSize('indicatorRight', 0);
       if (this.mIndicatorRight == 0 && this.mGroupIndicator != null) {
           this.mIndicatorRight = this.mIndicatorLeft + this.mGroupIndicator.getIntrinsicWidth();
       }
       this.mChildIndicatorLeft = a.getDimensionPixelSize('childIndicatorLeft', ExpandableListView.CHILD_INDICATOR_INHERIT);
       this.mChildIndicatorRight = a.getDimensionPixelSize('childIndicatorRight', ExpandableListView.CHILD_INDICATOR_INHERIT);
       this.mChildDivider = a.getDrawable('childDivider');
       if (!this.isRtlCompatibilityMode()) {
           this.mIndicatorStart = a.getDimensionPixelSize('indicatorStart', ExpandableListView.INDICATOR_UNDEFINED);
           this.mIndicatorEnd = a.getDimensionPixelSize('indicatorEnd', ExpandableListView.INDICATOR_UNDEFINED);
           this.mChildIndicatorStart = a.getDimensionPixelSize('childIndicatorStart', ExpandableListView.CHILD_INDICATOR_INHERIT);
           this.mChildIndicatorEnd = a.getDimensionPixelSize('childIndicatorEnd', ExpandableListView.CHILD_INDICATOR_INHERIT);
       }
       a.recycle();
    }

    protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
        return super.createClassAttrBinder().set('groupIndicator', {
            setter(v:ExpandableListView, value:any, attrBinder:AttrBinder) {
                v.setGroupIndicator(attrBinder.parseDrawable(value));
            }, getter(v:ExpandableListView) {
                return v.mGroupIndicator;
            }
        }).set('childIndicator', {
            setter(v:ExpandableListView, value:any, attrBinder:AttrBinder) {
                v.setChildIndicator(attrBinder.parseDrawable(value));
            }, getter(v:ExpandableListView) {
                return v.mChildIndicator;
            }
        }).set('indicatorLeft', {
            setter(v:ExpandableListView, value:any, attrBinder:AttrBinder) {
                v.setIndicatorBounds(attrBinder.parseNumberPixelOffset(value, 0), v.mIndicatorRight);
            }, getter(v:ExpandableListView) {
                return v.mIndicatorLeft;
            }
        }).set('indicatorRight', {
            setter(v:ExpandableListView, value:any, attrBinder:AttrBinder) {
                let num = attrBinder.parseNumberPixelOffset(value, 0);
                if (num == 0 && v.mGroupIndicator != null) {
                    num = v.mIndicatorLeft + v.mGroupIndicator.getIntrinsicWidth();
                }
                this.setIndicatorBounds(v.mIndicatorLeft, num);
            }, getter(v:ExpandableListView) {
                return v.mIndicatorRight;
            }
        }).set('childIndicatorLeft', {
            setter(v:ExpandableListView, value:any, attrBinder:AttrBinder) {
                v.setChildIndicatorBounds(attrBinder.parseNumberPixelOffset(value, ExpandableListView.CHILD_INDICATOR_INHERIT), v.mChildIndicatorRight);
            }, getter(v:ExpandableListView) {
                return v.mChildIndicatorLeft;
            }
        }).set('childIndicatorRight', {
            setter(v:ExpandableListView, value:any, attrBinder:AttrBinder) {
                let num = attrBinder.parseNumberPixelOffset(value, ExpandableListView.CHILD_INDICATOR_INHERIT);
                if (num == 0 && v.mChildIndicator != null) {
                    num = v.mChildIndicatorLeft + v.mChildIndicator.getIntrinsicWidth();
                }
                v.setIndicatorBounds(v.mChildIndicatorLeft, num);
            }, getter(v:ExpandableListView) {
                return v.mChildIndicatorRight;
            }
        }).set('childDivider', {
            setter(v:ExpandableListView, value:any, attrBinder:AttrBinder) {
                v.setChildDivider(attrBinder.parseDrawable(value));
            }, getter(v:ExpandableListView) {
                return v.mChildDivider;
            }
        });
    }

    /**
     * Return true if we are in RTL compatibility mode (either before Jelly Bean MR1 or
     * RTL not supported)
     */
    private isRtlCompatibilityMode():boolean  {
        return !this.hasRtlSupport();
    }

    /**
     * Return true if the application tag in the AndroidManifest has set "supportRtl" to true
     */
    private hasRtlSupport():boolean  {
        return false;
    }

    onRtlPropertiesChanged(layoutDirection:number):void  {
        this.resolveIndicator();
        this.resolveChildIndicator();
    }

    /**
     * Resolve start/end indicator. start/end indicator always takes precedence over left/right
     * indicator when defined.
     */
    private resolveIndicator():void  {
        const isLayoutRtl:boolean = this.isLayoutRtl();
        if (isLayoutRtl) {
            if (this.mIndicatorStart >= 0) {
                this.mIndicatorRight = this.mIndicatorStart;
            }
            if (this.mIndicatorEnd >= 0) {
                this.mIndicatorLeft = this.mIndicatorEnd;
            }
        } else {
            if (this.mIndicatorStart >= 0) {
                this.mIndicatorLeft = this.mIndicatorStart;
            }
            if (this.mIndicatorEnd >= 0) {
                this.mIndicatorRight = this.mIndicatorEnd;
            }
        }
        if (this.mIndicatorRight == 0 && this.mGroupIndicator != null) {
            this.mIndicatorRight = this.mIndicatorLeft + this.mGroupIndicator.getIntrinsicWidth();
        }
    }

    /**
     * Resolve start/end child indicator. start/end child indicator always takes precedence over
     * left/right child indicator when defined.
     */
    private resolveChildIndicator():void  {
        const isLayoutRtl:boolean = this.isLayoutRtl();
        if (isLayoutRtl) {
            if (this.mChildIndicatorStart >= ExpandableListView.CHILD_INDICATOR_INHERIT) {
                this.mChildIndicatorRight = this.mChildIndicatorStart;
            }
            if (this.mChildIndicatorEnd >= ExpandableListView.CHILD_INDICATOR_INHERIT) {
                this.mChildIndicatorLeft = this.mChildIndicatorEnd;
            }
        } else {
            if (this.mChildIndicatorStart >= ExpandableListView.CHILD_INDICATOR_INHERIT) {
                this.mChildIndicatorLeft = this.mChildIndicatorStart;
            }
            if (this.mChildIndicatorEnd >= ExpandableListView.CHILD_INDICATOR_INHERIT) {
                this.mChildIndicatorRight = this.mChildIndicatorEnd;
            }
        }
    }

    protected dispatchDraw(canvas:Canvas):void  {
        // Draw children, etc.
        super.dispatchDraw(canvas);
        // If we have any indicators to draw, we do it here
        if ((this.mChildIndicator == null) && (this.mGroupIndicator == null)) {
            return;
        }
        let saveCount:number = 0;
        const clipToPadding:boolean = (this.mGroupFlags & ExpandableListView.CLIP_TO_PADDING_MASK) == ExpandableListView.CLIP_TO_PADDING_MASK;
        if (clipToPadding) {
            saveCount = canvas.save();
            const scrollX:number = this.mScrollX;
            const scrollY:number = this.mScrollY;
            canvas.clipRect(scrollX + this.mPaddingLeft, scrollY + this.mPaddingTop, scrollX + this.mRight - this.mLeft - this.mPaddingRight, scrollY + this.mBottom - this.mTop - this.mPaddingBottom);
        }
        const headerViewsCount:number = this.getHeaderViewsCount();
        const lastChildFlPos:number = this.mItemCount - this.getFooterViewsCount() - headerViewsCount - 1;
        const myB:number = this.mBottom;
        let pos:PositionMetadata;
        let item:View;
        let indicator:Drawable;
        let t:number, b:number;
        // Start at a value that is neither child nor group
        let lastItemType:number = ~(ExpandableListPosition.CHILD | ExpandableListPosition.GROUP);
        const indicatorRect:Rect = this.mIndicatorRect;
        // The "child" mentioned in the following two lines is this
        // View's child, not referring to an expandable list's
        // notion of a child (as opposed to a group)
        const childCount:number = this.getChildCount();
        for (let i:number = 0, childFlPos:number = this.mFirstPosition - headerViewsCount; i < childCount; i++, childFlPos++) {
            if (childFlPos < 0) {
                // This child is header
                continue;
            } else if (childFlPos > lastChildFlPos) {
                // This child is footer, so are all subsequent children
                break;
            }
            item = this.getChildAt(i);
            t = item.getTop();
            b = item.getBottom();
            // This item isn't on the screen
            if ((b < 0) || (t > myB))
                continue;
            // Get more expandable list-related info for this item
            pos = this.mConnector.getUnflattenedPos(childFlPos);
            const isLayoutRtl:boolean = this.isLayoutRtl();
            const width:number = this.getWidth();
            // the left & right bounds
            if (pos.position.type != lastItemType) {
                if (pos.position.type == ExpandableListPosition.CHILD) {
                    indicatorRect.left = (this.mChildIndicatorLeft == ExpandableListView.CHILD_INDICATOR_INHERIT) ? this.mIndicatorLeft : this.mChildIndicatorLeft;
                    indicatorRect.right = (this.mChildIndicatorRight == ExpandableListView.CHILD_INDICATOR_INHERIT) ? this.mIndicatorRight : this.mChildIndicatorRight;
                } else {
                    indicatorRect.left = this.mIndicatorLeft;
                    indicatorRect.right = this.mIndicatorRight;
                }
                if (isLayoutRtl) {
                    const temp:number = indicatorRect.left;
                    indicatorRect.left = width - indicatorRect.right;
                    indicatorRect.right = width - temp;
                    indicatorRect.left -= this.mPaddingRight;
                    indicatorRect.right -= this.mPaddingRight;
                } else {
                    indicatorRect.left += this.mPaddingLeft;
                    indicatorRect.right += this.mPaddingLeft;
                }
                lastItemType = pos.position.type;
            }
            if (indicatorRect.left != indicatorRect.right) {
                // Use item's full height + the divider height
                if (this.mStackFromBottom) {
                    // See ListView#dispatchDraw
                    // - mDividerHeight;
                    indicatorRect.top = t;
                    indicatorRect.bottom = b;
                } else {
                    indicatorRect.top = t;
                    // + mDividerHeight;
                    indicatorRect.bottom = b;
                }
                // Get the indicator (with its state set to the item's state)
                indicator = this.getIndicator(pos);
                if (indicator != null) {
                    // Draw the indicator
                    indicator.setBounds(indicatorRect);
                    indicator.draw(canvas);
                }
            }
            pos.recycle();
        }
        if (clipToPadding) {
            canvas.restoreToCount(saveCount);
        }
    }

    /**
     * Gets the indicator for the item at the given position. If the indicator
     * is stateful, the state will be given to the indicator.
     * 
     * @param pos The flat list position of the item whose indicator
     *            should be returned.
     * @return The indicator in the proper state.
     */
    private getIndicator(pos:PositionMetadata):Drawable  {
        let indicator:Drawable;
        if (pos.position.type == ExpandableListPosition.GROUP) {
            indicator = this.mGroupIndicator;
            if (indicator != null && indicator.isStateful()) {
                // Empty check based on availability of data.  If the groupMetadata isn't null,
                // we do a check on it. Otherwise, the group is collapsed so we consider it
                // empty for performance reasons.
                let isEmpty:boolean = (pos.groupMetadata == null) || (pos.groupMetadata.lastChildFlPos == pos.groupMetadata.flPos);
                const stateSetIndex:number = // Expanded?
                (pos.isExpanded() ? 1 : 0) | // Empty?
                (isEmpty ? 2 : 0);
                indicator.setState(ExpandableListView.GROUP_STATE_SETS[stateSetIndex]);
            }
        } else {
            indicator = this.mChildIndicator;
            if (indicator != null && indicator.isStateful()) {
                // No need for a state sets array for the child since it only has two states
                const stateSet = pos.position.flatListPos == pos.groupMetadata.lastChildFlPos ? ExpandableListView.CHILD_LAST_STATE_SET : ExpandableListView.EMPTY_STATE_SET;
                indicator.setState(stateSet);
            }
        }
        return indicator;
    }

    /**
     * Sets the drawable that will be drawn adjacent to every child in the list. This will
     * be drawn using the same height as the normal divider ({@link #setDivider(Drawable)}) or
     * if it does not have an intrinsic height, the height set by {@link #setDividerHeight(int)}.
     * 
     * @param childDivider The drawable to use.
     */
    setChildDivider(childDivider:Drawable):void  {
        this.mChildDivider = childDivider;
    }

    drawDivider(canvas:Canvas, bounds:Rect, childIndex:number):void  {
        let flatListPosition:number = childIndex + this.mFirstPosition;
        // all items, then the item below it has to be a group)
        if (flatListPosition >= 0) {
            const adjustedPosition:number = this.getFlatPositionForConnector(flatListPosition);
            let pos:PositionMetadata = this.mConnector.getUnflattenedPos(adjustedPosition);
            // If this item is a child, or it is a non-empty group that is expanded
            if ((pos.position.type == ExpandableListPosition.CHILD) || (pos.isExpanded() && pos.groupMetadata.lastChildFlPos != pos.groupMetadata.flPos)) {
                // These are the cases where we draw the child divider
                const divider:Drawable = this.mChildDivider;
                divider.setBounds(bounds);
                divider.draw(canvas);
                pos.recycle();
                return;
            }
            pos.recycle();
        }
        // Otherwise draw the default divider
        super.drawDivider(canvas, bounds, flatListPosition);
    }

    /**
     * This overloaded method should not be used, instead use
     * {@link #setAdapter(ExpandableListAdapter)}.
     * <p>
     * {@inheritDoc}
     */
    setAdapter(adapter:ListAdapter):void  {
        throw Error(`new RuntimeException("For ExpandableListView, use setAdapter(ExpandableListAdapter) instead of " + "setAdapter(ListAdapter)")`);
    }

    /**
     * This method should not be used, use {@link #getExpandableListAdapter()}.
     */
    getAdapter():ListAdapter  {
        /*
         * The developer should never really call this method on an
         * ExpandableListView, so it would be nice to throw a RuntimeException,
         * but AdapterView calls this
         */
        return super.getAdapter();
    }

    /**
     * Register a callback to be invoked when an item has been clicked and the
     * caller prefers to receive a ListView-style position instead of a group
     * and/or child position. In most cases, the caller should use
     * {@link #setOnGroupClickListener} and/or {@link #setOnChildClickListener}.
     * <p />
     * {@inheritDoc}
     */
    setOnItemClickListener(l:AdapterView.OnItemClickListener):void  {
        super.setOnItemClickListener(l);
    }

    /**
     * Sets the adapter that provides data to this view.
     * @param adapter The adapter that provides data to this view.
     */
    setExpandableAdapter(adapter:ExpandableListAdapter):void  {
        // Set member variable
        this.mExpandAdapter = adapter;
        if (adapter != null) {
            // Create the connector
            this.mConnector = new ExpandableListConnector(adapter);
        } else {
            this.mConnector = null;
        }
        // Link the ListView (superclass) to the expandable list data through the connector
        super.setAdapter(this.mConnector);
    }

    /**
     * Gets the adapter that provides data to this view.
     * @return The adapter that provides data to this view.
     */
    getExpandableListAdapter():ExpandableListAdapter  {
        return this.mExpandAdapter;
    }

    /**
     * @param position An absolute (including header and footer) flat list position.
     * @return true if the position corresponds to a header or a footer item.
     */
    private isHeaderOrFooterPosition(position:number):boolean  {
        const footerViewsStart:number = this.mItemCount - this.getFooterViewsCount();
        return (position < this.getHeaderViewsCount() || position >= footerViewsStart);
    }

    /**
     * Converts an absolute item flat position into a group/child flat position, shifting according
     * to the number of header items.
     * 
     * @param flatListPosition The absolute flat position
     * @return A group/child flat position as expected by the connector.
     */
    private getFlatPositionForConnector(flatListPosition:number):number  {
        return flatListPosition - this.getHeaderViewsCount();
    }

    /**
     * Converts a group/child flat position into an absolute flat position, that takes into account
     * the possible headers.
     * 
     * @param flatListPosition The child/group flat position
     * @return An absolute flat position.
     */
    private getAbsoluteFlatPosition(flatListPosition:number):number  {
        return flatListPosition + this.getHeaderViewsCount();
    }

    performItemClick(v:View, position:number, id:number):boolean  {
        // Ignore clicks in header/footers
        if (this.isHeaderOrFooterPosition(position)) {
            // Clicked on a header/footer, so ignore pass it on to super
            return super.performItemClick(v, position, id);
        }
        // Internally handle the item click
        const adjustedPosition:number = this.getFlatPositionForConnector(position);
        return this.handleItemClick(v, adjustedPosition, id);
    }

    /**
     * This will either expand/collapse groups (if a group was clicked) or pass
     * on the click to the proper child (if a child was clicked)
     * 
     * @param position The flat list position. This has already been factored to
     *            remove the header/footer.
     * @param id The ListAdapter ID, not the group or child ID.
     */
    handleItemClick(v:View, position:number, id:number):boolean  {
        const posMetadata:PositionMetadata = this.mConnector.getUnflattenedPos(position);
        id = this.getChildOrGroupId(posMetadata.position);
        let returnValue:boolean;
        if (posMetadata.position.type == ExpandableListPosition.GROUP) {
            /* It's a group click, so pass on event */
            if (this.mOnGroupClickListener != null) {
                if (this.mOnGroupClickListener.onGroupClick(this, v, posMetadata.position.groupPos, id)) {
                    posMetadata.recycle();
                    return true;
                }
            }
            if (posMetadata.isExpanded()) {
                /* Collapse it */
                this.mConnector.collapseGroupWithMeta(posMetadata);
                this.playSoundEffect(SoundEffectConstants.CLICK);
                if (this.mOnGroupCollapseListener != null) {
                    this.mOnGroupCollapseListener.onGroupCollapse(posMetadata.position.groupPos);
                }
            } else {
                /* Expand it */
                this.mConnector.expandGroupWithMeta(posMetadata);
                this.playSoundEffect(SoundEffectConstants.CLICK);
                if (this.mOnGroupExpandListener != null) {
                    this.mOnGroupExpandListener.onGroupExpand(posMetadata.position.groupPos);
                }
                const groupPos:number = posMetadata.position.groupPos;
                const groupFlatPos:number = posMetadata.position.flatListPos;
                const shiftedGroupPosition:number = groupFlatPos + this.getHeaderViewsCount();
                this.smoothScrollToPosition(shiftedGroupPosition + this.mExpandAdapter.getChildrenCount(groupPos), shiftedGroupPosition);
            }
            returnValue = true;
        } else {
            /* It's a child, so pass on event */
            if (this.mOnChildClickListener != null) {
                this.playSoundEffect(SoundEffectConstants.CLICK);
                return this.mOnChildClickListener.onChildClick(this, v, posMetadata.position.groupPos, posMetadata.position.childPos, id);
            }
            returnValue = false;
        }
        posMetadata.recycle();
        return returnValue;
    }

    /**
     * Expand a group in the grouped list view
     *
     * @param groupPos the group to be expanded
     * @param animate true if the expanding group should be animated in
     * @return True if the group was expanded, false otherwise (if the group
     *         was already expanded, this will return false)
     */
    expandGroup(groupPos:number, animate=false):boolean  {
        let elGroupPos:ExpandableListPosition = ExpandableListPosition.obtain(ExpandableListPosition.GROUP, groupPos, -1, -1);
        let pm:PositionMetadata = this.mConnector.getFlattenedPos(elGroupPos);
        elGroupPos.recycle();
        let retValue:boolean = this.mConnector.expandGroupWithMeta(pm);
        if (this.mOnGroupExpandListener != null) {
            this.mOnGroupExpandListener.onGroupExpand(groupPos);
        }
        if (animate) {
            const groupFlatPos:number = pm.position.flatListPos;
            const shiftedGroupPosition:number = groupFlatPos + this.getHeaderViewsCount();
            this.smoothScrollToPosition(shiftedGroupPosition + this.mExpandAdapter.getChildrenCount(groupPos), shiftedGroupPosition);
        }
        pm.recycle();
        return retValue;
    }

    /**
     * Collapse a group in the grouped list view
     * 
     * @param groupPos position of the group to collapse
     * @return True if the group was collapsed, false otherwise (if the group
     *         was already collapsed, this will return false)
     */
    collapseGroup(groupPos:number):boolean  {
        let retValue:boolean = this.mConnector.collapseGroup(groupPos);
        if (this.mOnGroupCollapseListener != null) {
            this.mOnGroupCollapseListener.onGroupCollapse(groupPos);
        }
        return retValue;
    }



    private mOnGroupCollapseListener:ExpandableListView.OnGroupCollapseListener;

    setOnGroupCollapseListener(onGroupCollapseListener:ExpandableListView.OnGroupCollapseListener):void  {
        this.mOnGroupCollapseListener = onGroupCollapseListener;
    }



    private mOnGroupExpandListener:ExpandableListView.OnGroupExpandListener;

    setOnGroupExpandListener(onGroupExpandListener:ExpandableListView.OnGroupExpandListener):void  {
        this.mOnGroupExpandListener = onGroupExpandListener;
    }



    private mOnGroupClickListener:ExpandableListView.OnGroupClickListener;

    setOnGroupClickListener(onGroupClickListener:ExpandableListView.OnGroupClickListener):void  {
        this.mOnGroupClickListener = onGroupClickListener;
    }



    private mOnChildClickListener:ExpandableListView.OnChildClickListener;

    setOnChildClickListener(onChildClickListener:ExpandableListView.OnChildClickListener):void  {
        this.mOnChildClickListener = onChildClickListener;
    }

    /**
     * Converts a flat list position (the raw position of an item (child or group)
     * in the list) to a group and/or child position (represented in a
     * packed position). This is useful in situations where the caller needs to
     * use the underlying {@link ListView}'s methods. Use
     * {@link ExpandableListView#getPackedPositionType} ,
     * {@link ExpandableListView#getPackedPositionChild},
     * {@link ExpandableListView#getPackedPositionGroup} to unpack.
     * 
     * @param flatListPosition The flat list position to be converted.
     * @return The group and/or child position for the given flat list position
     *         in packed position representation. #PACKED_POSITION_VALUE_NULL if
     *         the position corresponds to a header or a footer item.
     */
    getExpandableListPosition(flatListPosition:number):number  {
        if (this.isHeaderOrFooterPosition(flatListPosition)) {
            return ExpandableListView.PACKED_POSITION_VALUE_NULL;
        }
        const adjustedPosition:number = this.getFlatPositionForConnector(flatListPosition);
        let pm:PositionMetadata = this.mConnector.getUnflattenedPos(adjustedPosition);
        let packedPos:number = pm.position.getPackedPosition();
        pm.recycle();
        return packedPos;
    }

    /**
     * Converts a group and/or child position to a flat list position. This is
     * useful in situations where the caller needs to use the underlying
     * {@link ListView}'s methods.
     * 
     * @param packedPosition The group and/or child positions to be converted in
     *            packed position representation. Use
     *            {@link #getPackedPositionForChild(int, int)} or
     *            {@link #getPackedPositionForGroup(int)}.
     * @return The flat list position for the given child or group.
     */
    getFlatListPosition(packedPosition:number):number  {
        let elPackedPos:ExpandableListPosition = ExpandableListPosition.obtainPosition(packedPosition);
        let pm:PositionMetadata = this.mConnector.getFlattenedPos(elPackedPos);
        elPackedPos.recycle();
        const flatListPosition:number = pm.position.flatListPos;
        pm.recycle();
        return this.getAbsoluteFlatPosition(flatListPosition);
    }

    /**
     * Gets the position of the currently selected group or child (along with
     * its type). Can return {@link #PACKED_POSITION_VALUE_NULL} if no selection.
     * 
     * @return A packed position containing the currently selected group or
     *         child's position and type. #PACKED_POSITION_VALUE_NULL if no selection
     *         or if selection is on a header or a footer item.
     */
    getSelectedPosition():number  {
        const selectedPos:number = this.getSelectedItemPosition();
        // The case where there is no selection (selectedPos == -1) is also handled here.
        return this.getExpandableListPosition(selectedPos);
    }

    /**
     * Gets the ID of the currently selected group or child. Can return -1 if no
     * selection.
     * 
     * @return The ID of the currently selected group or child. -1 if no
     *         selection.
     */
    getSelectedId():number  {
        let packedPos:number = this.getSelectedPosition();
        if (packedPos == ExpandableListView.PACKED_POSITION_VALUE_NULL)
            return -1;
        let groupPos:number = ExpandableListView.getPackedPositionGroup(packedPos);
        if (ExpandableListView.getPackedPositionType(packedPos) == ExpandableListView.PACKED_POSITION_TYPE_GROUP) {
            // It's a group
            return this.mExpandAdapter.getGroupId(groupPos);
        } else {
            // It's a child
            return this.mExpandAdapter.getChildId(groupPos, ExpandableListView.getPackedPositionChild(packedPos));
        }
    }

    /**
     * Sets the selection to the specified group.
     * @param groupPosition The position of the group that should be selected.
     */
    setSelectedGroup(groupPosition:number):void  {
        let elGroupPos:ExpandableListPosition = ExpandableListPosition.obtainGroupPosition(groupPosition);
        let pm:PositionMetadata = this.mConnector.getFlattenedPos(elGroupPos);
        elGroupPos.recycle();
        const absoluteFlatPosition:number = this.getAbsoluteFlatPosition(pm.position.flatListPos);
        super.setSelection(absoluteFlatPosition);
        pm.recycle();
    }

    /**
     * Sets the selection to the specified child. If the child is in a collapsed
     * group, the group will only be expanded and child subsequently selected if
     * shouldExpandGroup is set to true, otherwise the method will return false.
     * 
     * @param groupPosition The position of the group that contains the child.
     * @param childPosition The position of the child within the group.
     * @param shouldExpandGroup Whether the child's group should be expanded if
     *            it is collapsed.
     * @return Whether the selection was successfully set on the child.
     */
    setSelectedChild(groupPosition:number, childPosition:number, shouldExpandGroup:boolean):boolean  {
        let elChildPos:ExpandableListPosition = ExpandableListPosition.obtainChildPosition(groupPosition, childPosition);
        let flatChildPos:PositionMetadata = this.mConnector.getFlattenedPos(elChildPos);
        if (flatChildPos == null) {
            // Shouldn't expand the group, so return false for we didn't set the selection
            if (!shouldExpandGroup)
                return false;
            this.expandGroup(groupPosition);
            flatChildPos = this.mConnector.getFlattenedPos(elChildPos);
            // Sanity check
            if (flatChildPos == null) {
                throw Error(`new IllegalStateException("Could not find child")`);
            }
        }
        let absoluteFlatPosition:number = this.getAbsoluteFlatPosition(flatChildPos.position.flatListPos);
        super.setSelection(absoluteFlatPosition);
        elChildPos.recycle();
        flatChildPos.recycle();
        return true;
    }

    /**
     * Whether the given group is currently expanded.
     * 
     * @param groupPosition The group to check.
     * @return Whether the group is currently expanded.
     */
    isGroupExpanded(groupPosition:number):boolean  {
        return this.mConnector.isGroupExpanded(groupPosition);
    }

    /**
     * Gets the type of a packed position. See
     * {@link #getPackedPositionForChild(int, int)}.
     * 
     * @param packedPosition The packed position for which to return the type.
     * @return The type of the position contained within the packed position,
     *         either {@link #PACKED_POSITION_TYPE_CHILD}, {@link #PACKED_POSITION_TYPE_GROUP}, or
     *         {@link #PACKED_POSITION_TYPE_NULL}.
     */
    static getPackedPositionType(packedPosition:number):number  {
        if (packedPosition == ExpandableListView.PACKED_POSITION_VALUE_NULL) {
            return ExpandableListView.PACKED_POSITION_TYPE_NULL;
        }
        //return (packedPosition & ExpandableListView.PACKED_POSITION_MASK_TYPE) == ExpandableListView.PACKED_POSITION_MASK_TYPE
        //    ? ExpandableListView.PACKED_POSITION_TYPE_CHILD : ExpandableListView.PACKED_POSITION_TYPE_GROUP;
        return (Long.fromNumber(packedPosition).and(ExpandableListView.PACKED_POSITION_MASK_TYPE)).equals(ExpandableListView.PACKED_POSITION_MASK_TYPE)
            ? ExpandableListView.PACKED_POSITION_TYPE_CHILD : ExpandableListView.PACKED_POSITION_TYPE_GROUP;
    }

    /**
     * Gets the group position from a packed position. See
     * {@link #getPackedPositionForChild(int, int)}.
     * 
     * @param packedPosition The packed position from which the group position
     *            will be returned.
     * @return The group position portion of the packed position. If this does
     *         not contain a group, returns -1.
     */
    static getPackedPositionGroup(packedPosition:number):number  {
        // Null
        if (packedPosition == ExpandableListView.PACKED_POSITION_VALUE_NULL)
            return -1;
        //return (packedPosition & ExpandableListView.PACKED_POSITION_MASK_GROUP) >> ExpandableListView.PACKED_POSITION_SHIFT_GROUP;
        return (Long.fromNumber(packedPosition).and(ExpandableListView.PACKED_POSITION_MASK_GROUP))
            .shiftRight(ExpandableListView.PACKED_POSITION_SHIFT_GROUP).toNumber();
    }

    /**
     * Gets the child position from a packed position that is of
     * {@link #PACKED_POSITION_TYPE_CHILD} type (use {@link #getPackedPositionType(long)}).
     * To get the group that this child belongs to, use
     * {@link #getPackedPositionGroup(long)}. See
     * {@link #getPackedPositionForChild(int, int)}.
     * 
     * @param packedPosition The packed position from which the child position
     *            will be returned.
     * @return The child position portion of the packed position. If this does
     *         not contain a child, returns -1.
     */
    static getPackedPositionChild(packedPosition:number):number  {
        // Null
        if (packedPosition == ExpandableListView.PACKED_POSITION_VALUE_NULL)
            return -1;
        // Group since a group type clears this bit
        //if ((packedPosition & ExpandableListView.PACKED_POSITION_MASK_TYPE) != ExpandableListView.PACKED_POSITION_MASK_TYPE)
        if ((Long.fromNumber(packedPosition).and(ExpandableListView.PACKED_POSITION_MASK_TYPE)).notEquals(ExpandableListView.PACKED_POSITION_MASK_TYPE))
            return -1;
        return Long.fromNumber(packedPosition).and(ExpandableListView.PACKED_POSITION_MASK_CHILD).toNumber();
    }

    /**
     * Returns the packed position representation of a child's position.
     * <p>
     * In general, a packed position should be used in
     * situations where the position given to/returned from an
     * {@link ExpandableListAdapter} or {@link ExpandableListView} method can
     * either be a child or group. The two positions are packed into a single
     * long which can be unpacked using
     * {@link #getPackedPositionChild(long)},
     * {@link #getPackedPositionGroup(long)}, and
     * {@link #getPackedPositionType(long)}.
     * 
     * @param groupPosition The child's parent group's position.
     * @param childPosition The child position within the group.
     * @return The packed position representation of the child (and parent group).
     */
    static getPackedPositionForChild(groupPosition:number, childPosition:number):number  {
        //return (ExpandableListView.PACKED_POSITION_TYPE_CHILD << ExpandableListView.PACKED_POSITION_SHIFT_TYPE)
        //    | ((groupPosition & ExpandableListView.PACKED_POSITION_INT_MASK_GROUP) << ExpandableListView.PACKED_POSITION_SHIFT_GROUP)
        //    | (childPosition & ExpandableListView.PACKED_POSITION_INT_MASK_CHILD);
        return Long.fromInt(ExpandableListView.PACKED_POSITION_TYPE_CHILD).shiftLeft(ExpandableListView.PACKED_POSITION_SHIFT_TYPE)
        .or(Long.fromNumber(groupPosition).and(ExpandableListView.PACKED_POSITION_INT_MASK_GROUP).shiftLeft(ExpandableListView.PACKED_POSITION_SHIFT_GROUP))
        .or(Long.fromNumber(childPosition).and(ExpandableListView.PACKED_POSITION_INT_MASK_CHILD)).toNumber();
    }

    /**
     * Returns the packed position representation of a group's position. See
     * {@link #getPackedPositionForChild(int, int)}.
     * 
     * @param groupPosition The child's parent group's position.
     * @return The packed position representation of the group.
     */
    static getPackedPositionForGroup(groupPosition:number):number  {
        // No need to OR a type in because PACKED_POSITION_GROUP == 0
        //return ((groupPosition & ExpandableListView.PACKED_POSITION_INT_MASK_GROUP) << ExpandableListView.PACKED_POSITION_SHIFT_GROUP);
        return Long.fromInt(groupPosition).and(ExpandableListView.PACKED_POSITION_INT_MASK_GROUP)
            .shiftLeft(ExpandableListView.PACKED_POSITION_SHIFT_GROUP).toNumber();
    }

    //createContextMenuInfo(view:View, flatListPosition:number, id:number):ContextMenuInfo  {
    //    if (this.isHeaderOrFooterPosition(flatListPosition)) {
    //        // Return normal info for header/footer view context menus
    //        return new AdapterView.AdapterContextMenuInfo(view, flatListPosition, id);
    //    }
    //    const adjustedPosition:number = this.getFlatPositionForConnector(flatListPosition);
    //    let pm:PositionMetadata = this.mConnector.getUnflattenedPos(adjustedPosition);
    //    let pos:ExpandableListPosition = pm.position;
    //    id = this.getChildOrGroupId(pos);
    //    let packedPosition:number = pos.getPackedPosition();
    //    pm.recycle();
    //    return new ExpandableListView.ExpandableListContextMenuInfo(view, packedPosition, id);
    //}

    /**
     * Gets the ID of the group or child at the given <code>position</code>.
     * This is useful since there is no ListAdapter ID -> ExpandableListAdapter
     * ID conversion mechanism (in some cases, it isn't possible).
     * 
     * @param position The position of the child or group whose ID should be
     *            returned.
     */
    private getChildOrGroupId(position:ExpandableListPosition):number  {
        if (position.type == ExpandableListPosition.CHILD) {
            return this.mExpandAdapter.getChildId(position.groupPos, position.childPos);
        } else {
            return this.mExpandAdapter.getGroupId(position.groupPos);
        }
    }

    /**
     * Sets the indicator to be drawn next to a child.
     * 
     * @param childIndicator The drawable to be used as an indicator. If the
     *            child is the last child for a group, the state
     *            {@link android.R.attr#state_last} will be set.
     */
    setChildIndicator(childIndicator:Drawable):void  {
        this.mChildIndicator = childIndicator;
    }

    /**
     * Sets the drawing bounds for the child indicator. For either, you can
     * specify {@link #CHILD_INDICATOR_INHERIT} to use inherit from the general
     * indicator's bounds.
     *
     * @see #setIndicatorBounds(int, int)
     * @param left The left position (relative to the left bounds of this View)
     *            to start drawing the indicator.
     * @param right The right position (relative to the left bounds of this
     *            View) to end the drawing of the indicator.
     */
    setChildIndicatorBounds(left:number, right:number):void  {
        this.mChildIndicatorLeft = left;
        this.mChildIndicatorRight = right;
        this.resolveChildIndicator();
    }

    /**
     * Sets the relative drawing bounds for the child indicator. For either, you can
     * specify {@link #CHILD_INDICATOR_INHERIT} to use inherit from the general
     * indicator's bounds.
     *
     * @see #setIndicatorBounds(int, int)
     * @param start The start position (relative to the start bounds of this View)
     *            to start drawing the indicator.
     * @param end The end position (relative to the end bounds of this
     *            View) to end the drawing of the indicator.
     */
    setChildIndicatorBoundsRelative(start:number, end:number):void  {
        this.mChildIndicatorStart = start;
        this.mChildIndicatorEnd = end;
        this.resolveChildIndicator();
    }

    /**
     * Sets the indicator to be drawn next to a group.
     * 
     * @param groupIndicator The drawable to be used as an indicator. If the
     *            group is empty, the state {@link android.R.attr#state_empty} will be
     *            set. If the group is expanded, the state
     *            {@link android.R.attr#state_expanded} will be set.
     */
    setGroupIndicator(groupIndicator:Drawable):void  {
        this.mGroupIndicator = groupIndicator;
        if (this.mIndicatorRight == 0 && this.mGroupIndicator != null) {
            this.mIndicatorRight = this.mIndicatorLeft + this.mGroupIndicator.getIntrinsicWidth();
        }
    }

    /**
     * Sets the drawing bounds for the indicators (at minimum, the group indicator
     * is affected by this; the child indicator is affected by this if the
     * child indicator bounds are set to inherit).
     * 
     * @see #setChildIndicatorBounds(int, int) 
     * @param left The left position (relative to the left bounds of this View)
     *            to start drawing the indicator.
     * @param right The right position (relative to the left bounds of this
     *            View) to end the drawing of the indicator.
     */
    setIndicatorBounds(left:number, right:number):void  {
        this.mIndicatorLeft = left;
        this.mIndicatorRight = right;
        this.resolveIndicator();
    }

    /**
     * Sets the relative drawing bounds for the indicators (at minimum, the group indicator
     * is affected by this; the child indicator is affected by this if the
     * child indicator bounds are set to inherit).
     *
     * @see #setChildIndicatorBounds(int, int)
     * @param start The start position (relative to the start bounds of this View)
     *            to start drawing the indicator.
     * @param end The end position (relative to the end bounds of this
     *            View) to end the drawing of the indicator.
     */
    setIndicatorBoundsRelative(start:number, end:number):void  {
        this.mIndicatorStart = start;
        this.mIndicatorEnd = end;
        this.resolveIndicator();
    }
}

export module ExpandableListView{
/** Used for being notified when a group is collapsed */
export interface OnGroupCollapseListener {

    /**
         * Callback method to be invoked when a group in this expandable list has
         * been collapsed.
         * 
         * @param groupPosition The group position that was collapsed
         */
    onGroupCollapse(groupPosition:number):void ;
}
/** Used for being notified when a group is expanded */
export interface OnGroupExpandListener {

    /**
         * Callback method to be invoked when a group in this expandable list has
         * been expanded.
         * 
         * @param groupPosition The group position that was expanded
         */
    onGroupExpand(groupPosition:number):void ;
}
/**
     * Interface definition for a callback to be invoked when a group in this
     * expandable list has been clicked.
     */
export interface OnGroupClickListener {

    /**
         * Callback method to be invoked when a group in this expandable list has
         * been clicked.
         * 
         * @param parent The ExpandableListConnector where the click happened
         * @param v The view within the expandable list/ListView that was clicked
         * @param groupPosition The group position that was clicked
         * @param id The row id of the group that was clicked
         * @return True if the click was handled
         */
    onGroupClick(parent:ExpandableListView, v:View, groupPosition:number, id:number):boolean ;
}
/**
     * Interface definition for a callback to be invoked when a child in this
     * expandable list has been clicked.
     */
export interface OnChildClickListener {

    /**
         * Callback method to be invoked when a child in this expandable list has
         * been clicked.
         * 
         * @param parent The ExpandableListView where the click happened
         * @param v The view within the expandable list/ListView that was clicked
         * @param groupPosition The group position that contains the child that
         *        was clicked
         * @param childPosition The child position within the group
         * @param id The row id of the child that was clicked
         * @return True if the click was handled
         */
    onChildClick(parent:ExpandableListView, v:View, groupPosition:number, childPosition:number, id:number):boolean ;
}
}

}
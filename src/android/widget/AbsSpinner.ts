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
///<reference path="../../android/graphics/Rect.ts"/>
///<reference path="../../android/util/SparseArray.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../java/lang/Integer.ts"/>
///<reference path="../../java/lang/System.ts"/>
///<reference path="../../android/widget/Adapter.ts"/>
///<reference path="../../android/widget/AdapterView.ts"/>
///<reference path="../../android/widget/ArrayAdapter.ts"/>
///<reference path="../../android/widget/Spinner.ts"/>
///<reference path="../../android/widget/SpinnerAdapter.ts"/>
///<reference path="../../android/content/Context.ts"/>

module android.widget {
import DataSetObserver = android.database.DataSetObserver;
import Rect = android.graphics.Rect;
import SparseArray = android.util.SparseArray;
import View = android.view.View;
import ViewGroup = android.view.ViewGroup;
import Integer = java.lang.Integer;
import System = java.lang.System;
import Adapter = android.widget.Adapter;
import AdapterView = android.widget.AdapterView;
import ArrayAdapter = android.widget.ArrayAdapter;
import Spinner = android.widget.Spinner;
import SpinnerAdapter = android.widget.SpinnerAdapter;
import Context = android.content.Context;
    import AttrBinder = androidui.attr.AttrBinder;
/**
 * An abstract base class for spinner widgets. SDK users will probably not
 * need to use this class.
 * 
 * @attr ref android.R.styleable#AbsSpinner_entries
 */
export abstract class AbsSpinner extends AdapterView<SpinnerAdapter> {

    mAdapter:SpinnerAdapter;

    mHeightMeasureSpec:number = 0;

    mWidthMeasureSpec:number = 0;

    mSelectionLeftPadding:number = 0;

    mSelectionTopPadding:number = 0;

    mSelectionRightPadding:number = 0;

    mSelectionBottomPadding:number = 0;

    mSpinnerPadding:Rect = new Rect();

    mRecycler:AbsSpinner.RecycleBin = new AbsSpinner.RecycleBin(this);

    private mDataSetObserver:DataSetObserver;

    /** Temporary frame to hold a child View's frame rectangle */
    private mTouchFrame:Rect;


    constructor(context:Context, bindElement?:HTMLElement, defStyle?:Map<string, string>) {
        super(context, bindElement, defStyle);
        this.initAbsSpinner();

        const a = context.obtainStyledAttributes(bindElement, defStyle);
        const entries = a.getTextArray('entries');
        if (entries != null) {
            const adapter = new ArrayAdapter<string>(context, R.layout.simple_spinner_item, entries);
            adapter.setDropDownViewResource(R.layout.simple_spinner_dropdown_item);
            this.setAdapter(adapter);
        }
        a.recycle();
    }

    protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
        return super.createClassAttrBinder().set('entries', {
            setter(v:AbsSpinner, value:any, attrBinder:AttrBinder) {
                let entries:string[] = attrBinder.parseStringArray(value);
                if (entries != null) {
                    let adapter: ArrayAdapter<string> = new ArrayAdapter<string>(v.getContext(), R.layout.simple_spinner_item, null, entries);
                    adapter.setDropDownViewResource(R.layout.simple_spinner_dropdown_item);
                    v.setAdapter(adapter);
                }
            }
        });
    }

    /**
     * Common code for different constructor flavors
     */
    private initAbsSpinner():void  {
        this.setFocusable(true);
        this.setWillNotDraw(false);
    }

    /**
     * The Adapter is used to provide the data which backs this Spinner.
     * It also provides methods to transform spinner items based on their position
     * relative to the selected item.
     * @param adapter The SpinnerAdapter to use for this Spinner
     */
    setAdapter(adapter:SpinnerAdapter):void  {
        if (null != this.mAdapter) {
            this.mAdapter.unregisterDataSetObserver(this.mDataSetObserver);
            this.resetList();
        }
        this.mAdapter = adapter;
        this.mOldSelectedPosition = AbsSpinner.INVALID_POSITION;
        this.mOldSelectedRowId = AbsSpinner.INVALID_ROW_ID;
        if (this.mAdapter != null) {
            this.mOldItemCount = this.mItemCount;
            this.mItemCount = this.mAdapter.getCount();
            this.checkFocus();
            this.mDataSetObserver = new AdapterView.AdapterDataSetObserver(this);
            this.mAdapter.registerDataSetObserver(this.mDataSetObserver);
            let position:number = this.mItemCount > 0 ? 0 : AbsSpinner.INVALID_POSITION;
            this.setSelectedPositionInt(position);
            this.setNextSelectedPositionInt(position);
            if (this.mItemCount == 0) {
                // Nothing selected
                this.checkSelectionChanged();
            }
        } else {
            this.checkFocus();
            this.resetList();
            // Nothing selected
            this.checkSelectionChanged();
        }
        this.requestLayout();
    }

    /**
     * Clear out all children from the list
     */
    resetList():void  {
        this.mDataChanged = false;
        this.mNeedSync = false;
        this.removeAllViewsInLayout();
        this.mOldSelectedPosition = AbsSpinner.INVALID_POSITION;
        this.mOldSelectedRowId = AbsSpinner.INVALID_ROW_ID;
        this.setSelectedPositionInt(AbsSpinner.INVALID_POSITION);
        this.setNextSelectedPositionInt(AbsSpinner.INVALID_POSITION);
        this.invalidate();
    }

    /** 
     * @see android.view.View#measure(int, int)
     * 
     * Figure out the dimensions of this Spinner. The width comes from
     * the widthMeasureSpec as Spinnners can't have their width set to
     * UNSPECIFIED. The height is based on the height of the selected item
     * plus padding. 
     */
    protected onMeasure(widthMeasureSpec:number, heightMeasureSpec:number):void  {
        let widthMode:number = View.MeasureSpec.getMode(widthMeasureSpec);
        let widthSize:number;
        let heightSize:number;
        this.mSpinnerPadding.left = this.mPaddingLeft > this.mSelectionLeftPadding ? this.mPaddingLeft : this.mSelectionLeftPadding;
        this.mSpinnerPadding.top = this.mPaddingTop > this.mSelectionTopPadding ? this.mPaddingTop : this.mSelectionTopPadding;
        this.mSpinnerPadding.right = this.mPaddingRight > this.mSelectionRightPadding ? this.mPaddingRight : this.mSelectionRightPadding;
        this.mSpinnerPadding.bottom = this.mPaddingBottom > this.mSelectionBottomPadding ? this.mPaddingBottom : this.mSelectionBottomPadding;
        if (this.mDataChanged) {
            this.handleDataChanged();
        }
        let preferredHeight:number = 0;
        let preferredWidth:number = 0;
        let needsMeasuring:boolean = true;
        let selectedPosition:number = this.getSelectedItemPosition();
        if (selectedPosition >= 0 && this.mAdapter != null && selectedPosition < this.mAdapter.getCount()) {
            // Try looking in the recycler. (Maybe we were measured once already)
            let view:View = this.mRecycler.get(selectedPosition);
            if (view == null) {
                // Make a new one
                view = this.mAdapter.getView(selectedPosition, null, this);
                //if (view.getImportantForAccessibility() == AbsSpinner.IMPORTANT_FOR_ACCESSIBILITY_AUTO) {
                //    view.setImportantForAccessibility(AbsSpinner.IMPORTANT_FOR_ACCESSIBILITY_YES);
                //}
            }
            if (view != null) {
                // Put in recycler for re-measuring and/or layout
                this.mRecycler.put(selectedPosition, view);
                if (view.getLayoutParams() == null) {
                    this.mBlockLayoutRequests = true;
                    view.setLayoutParams(this.generateDefaultLayoutParams());
                    this.mBlockLayoutRequests = false;
                }
                this.measureChild(view, widthMeasureSpec, heightMeasureSpec);
                preferredHeight = this.getChildHeight(view) + this.mSpinnerPadding.top + this.mSpinnerPadding.bottom;
                preferredWidth = this.getChildWidth(view) + this.mSpinnerPadding.left + this.mSpinnerPadding.right;
                needsMeasuring = false;
            }
        }
        if (needsMeasuring) {
            // No views -- just use padding
            preferredHeight = this.mSpinnerPadding.top + this.mSpinnerPadding.bottom;
            if (widthMode == View.MeasureSpec.UNSPECIFIED) {
                preferredWidth = this.mSpinnerPadding.left + this.mSpinnerPadding.right;
            }
        }
        preferredHeight = Math.max(preferredHeight, this.getSuggestedMinimumHeight());
        preferredWidth = Math.max(preferredWidth, this.getSuggestedMinimumWidth());
        heightSize = AbsSpinner.resolveSizeAndState(preferredHeight, heightMeasureSpec, 0);
        widthSize = AbsSpinner.resolveSizeAndState(preferredWidth, widthMeasureSpec, 0);
        this.setMeasuredDimension(widthSize, heightSize);
        this.mHeightMeasureSpec = heightMeasureSpec;
        this.mWidthMeasureSpec = widthMeasureSpec;
    }

    getChildHeight(child:View):number  {
        return child.getMeasuredHeight();
    }

    getChildWidth(child:View):number  {
        return child.getMeasuredWidth();
    }

    protected generateDefaultLayoutParams():ViewGroup.LayoutParams  {
        return new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
    }

    recycleAllViews():void  {
        const childCount:number = this.getChildCount();
        const recycleBin:AbsSpinner.RecycleBin = this.mRecycler;
        const position:number = this.mFirstPosition;
        // All views go in recycler
        for (let i:number = 0; i < childCount; i++) {
            let v:View = this.getChildAt(i);
            let index:number = position + i;
            recycleBin.put(index, v);
        }
    }

    /**
     * Jump directly to a specific item in the adapter data.
     */
    setSelection(position:number, animate?:boolean):void  {
        if(arguments.length === 1){
            this.setNextSelectedPositionInt(position);
            this.requestLayout();
            this.invalidate();
        }else {
            // Animate only if requested position is already on screen somewhere
            let shouldAnimate:boolean = animate && this.mFirstPosition <= position && position <= this.mFirstPosition + this.getChildCount() - 1;
            this.setSelectionInt(position, shouldAnimate);
        }
    }

    /**
     * Makes the item at the supplied position selected.
     * 
     * @param position Position to select
     * @param animate Should the transition be animated
     * 
     */
    setSelectionInt(position:number, animate:boolean):void  {
        if (position != this.mOldSelectedPosition) {
            this.mBlockLayoutRequests = true;
            let delta:number = position - this.mSelectedPosition;
            this.setNextSelectedPositionInt(position);
            this.layoutSpinner(delta, animate);
            this.mBlockLayoutRequests = false;
        }
    }

    abstract 
    layoutSpinner(delta:number, animate:boolean):void;

    getSelectedView():View  {
        if (this.mItemCount > 0 && this.mSelectedPosition >= 0) {
            return this.getChildAt(this.mSelectedPosition - this.mFirstPosition);
        } else {
            return null;
        }
    }

    /**
     * Override to prevent spamming ourselves with layout requests
     * as we place views
     * 
     * @see android.view.View#requestLayout()
     */
    requestLayout():void  {
        if (!this.mBlockLayoutRequests) {
            super.requestLayout();
        }
    }

    getAdapter():SpinnerAdapter  {
        return this.mAdapter;
    }

    getCount():number  {
        return this.mItemCount;
    }

    /**
     * Maps a point to a position in the list.
     * 
     * @param x X in local coordinate
     * @param y Y in local coordinate
     * @return The position of the item which contains the specified point, or
     *         {@link #INVALID_POSITION} if the point does not intersect an item.
     */
    pointToPosition(x:number, y:number):number  {
        let frame:Rect = this.mTouchFrame;
        if (frame == null) {
            this.mTouchFrame = new Rect();
            frame = this.mTouchFrame;
        }
        const count:number = this.getChildCount();
        for (let i:number = count - 1; i >= 0; i--) {
            let child:View = this.getChildAt(i);
            if (child.getVisibility() == View.VISIBLE) {
                child.getHitRect(frame);
                if (frame.contains(x, y)) {
                    return this.mFirstPosition + i;
                }
            }
        }
        return AbsSpinner.INVALID_POSITION;
    }



    //onSaveInstanceState():Parcelable  {
    //    let superState:Parcelable = super.onSaveInstanceState();
    //    let ss:AbsSpinner.SavedState = new AbsSpinner.SavedState(superState);
    //    ss.selectedId = this.getSelectedItemId();
    //    if (ss.selectedId >= 0) {
    //        ss.position = this.getSelectedItemPosition();
    //    } else {
    //        ss.position = AbsSpinner.INVALID_POSITION;
    //    }
    //    return ss;
    //}
    //
    //onRestoreInstanceState(state:Parcelable):void  {
    //    let ss:AbsSpinner.SavedState = <AbsSpinner.SavedState> state;
    //    super.onRestoreInstanceState(ss.getSuperState());
    //    if (ss.selectedId >= 0) {
    //        this.mDataChanged = true;
    //        this.mNeedSync = true;
    //        this.mSyncRowId = ss.selectedId;
    //        this.mSyncPosition = ss.position;
    //        this.mSyncMode = AbsSpinner.SYNC_SELECTED_POSITION;
    //        this.requestLayout();
    //    }
    //}
    //
    //
    //
    //onInitializeAccessibilityEvent(event:AccessibilityEvent):void  {
    //    super.onInitializeAccessibilityEvent(event);
    //    event.setClassName(AbsSpinner.class.getName());
    //}
    //
    //onInitializeAccessibilityNodeInfo(info:AccessibilityNodeInfo):void  {
    //    super.onInitializeAccessibilityNodeInfo(info);
    //    info.setClassName(AbsSpinner.class.getName());
    //}
}

export module AbsSpinner{
//export class SavedState extends View.BaseSavedState {
//
//    selectedId:number = 0;
//
//    position:number = 0;
//
//    /**
//         * Constructor called from {@link AbsSpinner#onSaveInstanceState()}
//         */
//    constructor( superState:Parcelable) {
//        super(superState);
//    }
//
//    /**
//         * Constructor called from {@link #CREATOR}
//         */
//    constructor( _in:Parcel) {
//        super(_in);
//        this.selectedId = _in.readLong();
//        this.position = _in.readInt();
//    }
//
//    writeToParcel(out:Parcel, flags:number):void  {
//        super.writeToParcel(out, flags);
//        out.writeLong(this.selectedId);
//        out.writeInt(this.position);
//    }
//
//    toString():string  {
//        return "AbsSpinner.SavedState{" + Integer.toHexString(System.identityHashCode(this)) + " selectedId=" + this.selectedId + " position=" + this.position + "}";
//    }
//
//    static CREATOR:Parcelable.Creator<SavedState> = (()=>{
//        const _this=this;
//        class _Inner extends Parcelable.Creator<SavedState> {
//
//            createFromParcel(_in:Parcel):SavedState  {
//                return new SavedState(_in);
//            }
//
//            newArray(size:number):SavedState[]  {
//                return new Array<SavedState>(size);
//            }
//        }
//        return new _Inner();
//    })();
//}
export class RecycleBin {
    _AbsSpinner_this:AbsSpinner;
    constructor(arg:AbsSpinner){
        this._AbsSpinner_this = arg;
    }

    private mScrapHeap:SparseArray<View> = new SparseArray<View>();

    put(position:number, v:View):void  {
        this.mScrapHeap.put(position, v);
    }

    get(position:number):View  {
        // System.out.print("Looking for " + position);
        let result:View = this.mScrapHeap.get(position);
        if (result != null) {
            // System.out.println(" HIT");
            this.mScrapHeap.delete(position);
        } else {
        // System.out.println(" MISS");
        }
        return result;
    }

    clear():void  {
        const scrapHeap:SparseArray<View> = this.mScrapHeap;
        const count:number = scrapHeap.size();
        for (let i:number = 0; i < count; i++) {
            const view:View = scrapHeap.valueAt(i);
            if (view != null) {
                this._AbsSpinner_this.removeDetachedView(view, true);
            }
        }
        scrapHeap.clear();
    }
}
}

}
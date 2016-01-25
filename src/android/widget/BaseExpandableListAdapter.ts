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

///<reference path="../../android/database/DataSetObservable.ts"/>
///<reference path="../../android/database/DataSetObserver.ts"/>
///<reference path="../../android/widget/Adapter.ts"/>
///<reference path="../../android/widget/ExpandableListAdapter.ts"/>
///<reference path="../../android/widget/HeterogeneousExpandableList.ts"/>
///<reference path="../../android/widget/ListAdapter.ts"/>
///<reference path="../../androidui/util/Long.ts"/>

module android.widget {
import DataSetObservable = android.database.DataSetObservable;
import DataSetObserver = android.database.DataSetObserver;
import Adapter = android.widget.Adapter;
import ExpandableListAdapter = android.widget.ExpandableListAdapter;
import HeterogeneousExpandableList = android.widget.HeterogeneousExpandableList;
import ListAdapter = android.widget.ListAdapter;
import Long = goog.math.Long;


    const _0x8000000000000000 = Long.fromNumber(0x8000000000000000);
    const _0x7FFFFFFF = Long.fromNumber(0x7FFFFFFF);
    const _0xFFFFFFFF = Long.fromNumber(0xFFFFFFFF);

/**
 * Base class for a {@link ExpandableListAdapter} used to provide data and Views
 * from some data to an expandable list view.
 * <p>
 * Adapters inheriting this class should verify that the base implementations of
 * {@link #getCombinedChildId(long, long)} and {@link #getCombinedGroupId(long)}
 * are correct in generating unique IDs from the group/children IDs.
 * <p>
 * @see SimpleExpandableListAdapter
 * @see SimpleCursorTreeAdapter
 */
export abstract class BaseExpandableListAdapter implements ExpandableListAdapter, HeterogeneousExpandableList {

    private mDataSetObservable:DataSetObservable = new DataSetObservable();

    registerDataSetObserver(observer:DataSetObserver):void  {
        this.mDataSetObservable.registerObserver(observer);
    }

    unregisterDataSetObserver(observer:DataSetObserver):void  {
        this.mDataSetObservable.unregisterObserver(observer);
    }

    /**
     * @see DataSetObservable#notifyInvalidated()
     */
    notifyDataSetInvalidated():void  {
        this.mDataSetObservable.notifyInvalidated();
    }

    /**
     * @see DataSetObservable#notifyChanged()
     */
    notifyDataSetChanged():void  {
        this.mDataSetObservable.notifyChanged();
    }

    areAllItemsEnabled():boolean  {
        return true;
    }

    onGroupCollapsed(groupPosition:number):void  {
    }

    onGroupExpanded(groupPosition:number):void  {
    }

    /**
     * Override this method if you foresee a clash in IDs based on this scheme:
     * <p>
     * Base implementation returns a long:
     * <li> bit 0: Whether this ID points to a child (unset) or group (set), so for this method
     *             this bit will be 1.
     * <li> bit 1-31: Lower 31 bits of the groupId
     * <li> bit 32-63: Lower 32 bits of the childId.
     * <p> 
     * {@inheritDoc}
     */
    getCombinedChildId(groupId:number, childId:number):number  {
        //return 0x8000000000000000 | ((groupId & 0x7FFFFFFF) << 32) | (childId & 0xFFFFFFFF);
        const _groupId = Long.fromNumber(groupId);
        const _childId = Long.fromNumber(childId);
        return _0x8000000000000000.or(_groupId.and(_0x7FFFFFFF).shiftLeft(32)).or(_childId.and(_0xFFFFFFFF)).toNumber();
    }

    /**
     * Override this method if you foresee a clash in IDs based on this scheme:
     * <p>
     * Base implementation returns a long:
     * <li> bit 0: Whether this ID points to a child (unset) or group (set), so for this method
     *             this bit will be 0.
     * <li> bit 1-31: Lower 31 bits of the groupId
     * <li> bit 32-63: Lower 32 bits of the childId.
     * <p> 
     * {@inheritDoc}
     */
    getCombinedGroupId(groupId:number):number  {
        //return (groupId & 0x7FFFFFFF) << 32;
        const _groupId = Long.fromNumber(groupId);
        return _groupId.add(_0x7FFFFFFF).shiftLeft(32).toNumber();
    }

    /**
     * {@inheritDoc}
     */
    isEmpty():boolean  {
        return this.getGroupCount() == 0;
    }

    /**
     * {@inheritDoc}
     * @return 0 for any group or child position, since only one child type count is declared.
     */
    getChildType(groupPosition:number, childPosition:number):number  {
        return 0;
    }

    /**
     * {@inheritDoc}
     * @return 1 as a default value in BaseExpandableListAdapter.
     */
    getChildTypeCount():number  {
        return 1;
    }

    /**
     * {@inheritDoc}
     * @return 0 for any groupPosition, since only one group type count is declared.
     */
    getGroupType(groupPosition:number):number  {
        return 0;
    }

    /**
     * {@inheritDoc}
     * @return 1 as a default value in BaseExpandableListAdapter.
     */
    getGroupTypeCount():number  {
        return 1;
    }


    abstract getGroupCount():number;

    abstract getChildrenCount(groupPosition:number):number;

    abstract getGroup(groupPosition:number):any;

    abstract getChild(groupPosition:number, childPosition:number):any;

    abstract getGroupId(groupPosition:number):number;

    abstract getChildId(groupPosition:number, childPosition:number):number;

    abstract hasStableIds():boolean;

    abstract getGroupView(groupPosition:number, isExpanded:boolean, convertView:android.view.View, parent:android.view.ViewGroup):android.view.View;

    abstract getChildView(groupPosition:number, childPosition:number, isLastChild:boolean,
                 convertView:android.view.View, parent:android.view.ViewGroup):android.view.View;

    abstract isChildSelectable(groupPosition:number, childPosition:number):boolean;
}
}
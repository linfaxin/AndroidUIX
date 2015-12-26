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

///<reference path="../../android/database/DataSetObserver.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/widget/Adapter.ts"/>
///<reference path="../../android/widget/ExpandableListView.ts"/>
///<reference path="../../android/widget/ListAdapter.ts"/>
///<reference path="../../android/widget/ListView.ts"/>

module android.widget {
import DataSetObserver = android.database.DataSetObserver;
import View = android.view.View;
import ViewGroup = android.view.ViewGroup;
import Adapter = android.widget.Adapter;
import ExpandableListView = android.widget.ExpandableListView;
import ListAdapter = android.widget.ListAdapter;
import ListView = android.widget.ListView;
/**
 * An adapter that links a {@link ExpandableListView} with the underlying
 * data. The implementation of this interface will provide access
 * to the data of the children (categorized by groups), and also instantiate
 * {@link View}s for children and groups.
 */
export interface ExpandableListAdapter {

    /**
     * @see Adapter#registerDataSetObserver(DataSetObserver)
     */
    registerDataSetObserver(observer:DataSetObserver):void ;

    /**
     * @see Adapter#unregisterDataSetObserver(DataSetObserver)
     */
    unregisterDataSetObserver(observer:DataSetObserver):void ;

    /**
     * Gets the number of groups.
     * 
     * @return the number of groups
     */
    getGroupCount():number ;

    /**
     * Gets the number of children in a specified group.
     * 
     * @param groupPosition the position of the group for which the children
     *            count should be returned
     * @return the children count in the specified group
     */
    getChildrenCount(groupPosition:number):number ;

    /**
     * Gets the data associated with the given group.
     * 
     * @param groupPosition the position of the group
     * @return the data child for the specified group
     */
    getGroup(groupPosition:number):any ;

    /**
     * Gets the data associated with the given child within the given group.
     * 
     * @param groupPosition the position of the group that the child resides in
     * @param childPosition the position of the child with respect to other
     *            children in the group
     * @return the data of the child
     */
    getChild(groupPosition:number, childPosition:number):any ;

    /**
     * Gets the ID for the group at the given position. This group ID must be
     * unique across groups. The combined ID (see
     * {@link #getCombinedGroupId(long)}) must be unique across ALL items
     * (groups and all children).
     * 
     * @param groupPosition the position of the group for which the ID is wanted
     * @return the ID associated with the group
     */
    getGroupId(groupPosition:number):number ;

    /**
     * Gets the ID for the given child within the given group. This ID must be
     * unique across all children within the group. The combined ID (see
     * {@link #getCombinedChildId(long, long)}) must be unique across ALL items
     * (groups and all children).
     * 
     * @param groupPosition the position of the group that contains the child
     * @param childPosition the position of the child within the group for which
     *            the ID is wanted
     * @return the ID associated with the child
     */
    getChildId(groupPosition:number, childPosition:number):number ;

    /**
     * Indicates whether the child and group IDs are stable across changes to the
     * underlying data.
     * 
     * @return whether or not the same ID always refers to the same object
     * @see Adapter#hasStableIds()
     */
    hasStableIds():boolean ;

    /**
     * Gets a View that displays the given group. This View is only for the
     * group--the Views for the group's children will be fetched using
     * {@link #getChildView(int, int, boolean, View, ViewGroup)}.
     * 
     * @param groupPosition the position of the group for which the View is
     *            returned
     * @param isExpanded whether the group is expanded or collapsed
     * @param convertView the old view to reuse, if possible. You should check
     *            that this view is non-null and of an appropriate type before
     *            using. If it is not possible to convert this view to display
     *            the correct data, this method can create a new view. It is not
     *            guaranteed that the convertView will have been previously
     *            created by
     *            {@link #getGroupView(int, boolean, View, ViewGroup)}.
     * @param parent the parent that this view will eventually be attached to
     * @return the View corresponding to the group at the specified position
     */
    getGroupView(groupPosition:number, isExpanded:boolean, convertView:View, parent:ViewGroup):View ;

    /**
     * Gets a View that displays the data for the given child within the given
     * group.
     * 
     * @param groupPosition the position of the group that contains the child
     * @param childPosition the position of the child (for which the View is
     *            returned) within the group
     * @param isLastChild Whether the child is the last child within the group
     * @param convertView the old view to reuse, if possible. You should check
     *            that this view is non-null and of an appropriate type before
     *            using. If it is not possible to convert this view to display
     *            the correct data, this method can create a new view. It is not
     *            guaranteed that the convertView will have been previously
     *            created by
     *            {@link #getChildView(int, int, boolean, View, ViewGroup)}.
     * @param parent the parent that this view will eventually be attached to
     * @return the View corresponding to the child at the specified position
     */
    getChildView(groupPosition:number, childPosition:number, isLastChild:boolean, convertView:View, parent:ViewGroup):View ;

    /**
     * Whether the child at the specified position is selectable.
     * 
     * @param groupPosition the position of the group that contains the child
     * @param childPosition the position of the child within the group
     * @return whether the child is selectable.
     */
    isChildSelectable(groupPosition:number, childPosition:number):boolean ;

    /**
     * @see ListAdapter#areAllItemsEnabled()
     */
    areAllItemsEnabled():boolean ;

    /**
     * @see ListAdapter#isEmpty()
     */
    isEmpty():boolean ;

    /**
     * Called when a group is expanded.
     * 
     * @param groupPosition The group being expanded.
     */
    onGroupExpanded(groupPosition:number):void ;

    /**
     * Called when a group is collapsed.
     * 
     * @param groupPosition The group being collapsed.
     */
    onGroupCollapsed(groupPosition:number):void ;

    /**
     * Gets an ID for a child that is unique across any item (either group or
     * child) that is in this list. Expandable lists require each item (group or
     * child) to have a unique ID among all children and groups in the list.
     * This method is responsible for returning that unique ID given a child's
     * ID and its group's ID. Furthermore, if {@link #hasStableIds()} is true, the
     * returned ID must be stable as well.
     * 
     * @param groupId The ID of the group that contains this child.
     * @param childId The ID of the child.
     * @return The unique (and possibly stable) ID of the child across all
     *         groups and children in this list.
     */
    getCombinedChildId(groupId:number, childId:number):number ;

    /**
     * Gets an ID for a group that is unique across any item (either group or
     * child) that is in this list. Expandable lists require each item (group or
     * child) to have a unique ID among all children and groups in the list.
     * This method is responsible for returning that unique ID given a group's
     * ID. Furthermore, if {@link #hasStableIds()} is true, the returned ID must be
     * stable as well.
     * 
     * @param groupId The ID of the group
     * @return The unique (and possibly stable) ID of the group across all
     *         groups and children in this list.
     */
    getCombinedGroupId(groupId:number):number ;
}
}
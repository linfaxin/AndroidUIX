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
///<reference path="../../android/os/SystemClock.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../java/util/ArrayList.ts"/>
///<reference path="../../java/util/Collections.ts"/>
///<reference path="../../java/lang/Integer.ts"/>
///<reference path="../../java/lang/Comparable.ts"/>
///<reference path="../../android/widget/Adapter.ts"/>
///<reference path="../../android/widget/AdapterView.ts"/>
///<reference path="../../android/widget/BaseAdapter.ts"/>
///<reference path="../../android/widget/ExpandableListAdapter.ts"/>
///<reference path="../../android/widget/ExpandableListPosition.ts"/>
///<reference path="../../android/widget/HeterogeneousExpandableList.ts"/>
///<reference path="../../android/widget/ListAdapter.ts"/>
///<reference path="../../android/widget/ListView.ts"/>

module android.widget {
import DataSetObserver = android.database.DataSetObserver;
import SystemClock = android.os.SystemClock;
import View = android.view.View;
import ViewGroup = android.view.ViewGroup;
import ArrayList = java.util.ArrayList;
import Collections = java.util.Collections;
import Integer = java.lang.Integer;
import Comparable = java.lang.Comparable;
import Adapter = android.widget.Adapter;
import AdapterView = android.widget.AdapterView;
import BaseAdapter = android.widget.BaseAdapter;
import ExpandableListAdapter = android.widget.ExpandableListAdapter;
import ExpandableListPosition = android.widget.ExpandableListPosition;
import HeterogeneousExpandableList = android.widget.HeterogeneousExpandableList;
import ListAdapter = android.widget.ListAdapter;
import ListView = android.widget.ListView;
/**
 * A {@link BaseAdapter} that provides data/Views in an expandable list (offers
 * features such as collapsing/expanding groups containing children). By
 * itself, this adapter has no data and is a connector to a
 * {@link ExpandableListAdapter} which provides the data.
 * <p>
 * Internally, this connector translates the flat list position that the
 * ListAdapter expects to/from group and child positions that the ExpandableListAdapter
 * expects.
 */
export class ExpandableListConnector extends BaseAdapter /*implements Filterable*/ {

    /**
     * The ExpandableListAdapter to fetch the data/Views for this expandable list
     */
    private mExpandableListAdapter:ExpandableListAdapter;

    /**
     * List of metadata for the currently expanded groups. The metadata consists
     * of data essential for efficiently translating between flat list positions
     * and group/child positions. See {@link GroupMetadata}.
     */
    private mExpGroupMetadataList:ArrayList<ExpandableListConnector.GroupMetadata>;

    /** The number of children from all currently expanded groups */
    private mTotalExpChildrenCount:number = 0;

    /** The maximum number of allowable expanded groups. Defaults to 'no limit' */
    private mMaxExpGroupCount:number = Integer.MAX_VALUE;

    /** Change observer used to have ExpandableListAdapter changes pushed to us */
    private mDataSetObserver:DataSetObserver = new ExpandableListConnector.MyDataSetObserver(this);

    /**
     * Constructs the connector
     */
    constructor(expandableListAdapter:ExpandableListAdapter) {
        super();
        this.mExpGroupMetadataList = new ArrayList<ExpandableListConnector.GroupMetadata>();
        this.setExpandableListAdapter(expandableListAdapter);
    }

    /**
     * Point to the {@link ExpandableListAdapter} that will give us data/Views
     * 
     * @param expandableListAdapter the adapter that supplies us with data/Views
     */
    setExpandableListAdapter(expandableListAdapter:ExpandableListAdapter):void  {
        if (this.mExpandableListAdapter != null) {
            this.mExpandableListAdapter.unregisterDataSetObserver(this.mDataSetObserver);
        }
        this.mExpandableListAdapter = expandableListAdapter;
        expandableListAdapter.registerDataSetObserver(this.mDataSetObserver);
    }

    /**
     * Translates a flat list position to either a) group pos if the specified
     * flat list position corresponds to a group, or b) child pos if it
     * corresponds to a child.  Performs a binary search on the expanded
     * groups list to find the flat list pos if it is an exp group, otherwise
     * finds where the flat list pos fits in between the exp groups.
     * 
     * @param flPos the flat list position to be translated
     * @return the group position or child position of the specified flat list
     *         position encompassed in a {@link PositionMetadata} object
     *         that contains additional useful info for insertion, etc.
     */
    getUnflattenedPos(flPos:number):ExpandableListConnector.PositionMetadata  {
        /* Keep locally since frequent use */
        const egml:ArrayList<ExpandableListConnector.GroupMetadata> = this.mExpGroupMetadataList;
        const numExpGroups:number = egml.size();
        /* Binary search variables */
        let leftExpGroupIndex:number = 0;
        let rightExpGroupIndex:number = numExpGroups - 1;
        let midExpGroupIndex:number = 0;
        let midExpGm:ExpandableListConnector.GroupMetadata;
        if (numExpGroups == 0) {
            /*
             * There aren't any expanded groups (hence no visible children
             * either), so flPos must be a group and its group pos will be the
             * same as its flPos
             */
            return ExpandableListConnector.PositionMetadata.obtain(flPos, ExpandableListPosition.GROUP, flPos, -1, null, 0);
        }
        /*
         * Binary search over the expanded groups to find either the exact
         * expanded group (if we're looking for a group) or the group that
         * contains the child we're looking for. If we are looking for a
         * collapsed group, we will not have a direct match here, but we will
         * find the expanded group just before the group we're searching for (so
         * then we can calculate the group position of the group we're searching
         * for). If there isn't an expanded group prior to the group being
         * searched for, then the group being searched for's group position is
         * the same as the flat list position (since there are no children before
         * it, and all groups before it are collapsed).
         */
        while (leftExpGroupIndex <= rightExpGroupIndex) {
            midExpGroupIndex = Math.floor((rightExpGroupIndex - leftExpGroupIndex) / 2 + leftExpGroupIndex);
            midExpGm = egml.get(midExpGroupIndex);
            if (flPos > midExpGm.lastChildFlPos) {
                /*
                 * The flat list position is after the current middle group's
                 * last child's flat list position, so search right
                 */
                leftExpGroupIndex = midExpGroupIndex + 1;
            } else if (flPos < midExpGm.flPos) {
                /*
                 * The flat list position is before the current middle group's
                 * flat list position, so search left
                 */
                rightExpGroupIndex = midExpGroupIndex - 1;
            } else if (flPos == midExpGm.flPos) {
                /*
                 * The flat list position is this middle group's flat list
                 * position, so we've found an exact hit
                 */
                return ExpandableListConnector.PositionMetadata.obtain(flPos, ExpandableListPosition.GROUP, midExpGm.gPos, -1, midExpGm, midExpGroupIndex);
            } else if (flPos <= midExpGm.lastChildFlPos) /* && flPos > midGm.flPos as deduced from previous
                     * conditions */
            {
                /* The flat list position is a child of the middle group */
                /* 
                 * Subtract the first child's flat list position from the
                 * specified flat list pos to get the child's position within
                 * the group
                 */
                const childPos:number = flPos - (midExpGm.flPos + 1);
                return ExpandableListConnector.PositionMetadata.obtain(flPos, ExpandableListPosition.CHILD, midExpGm.gPos, childPos, midExpGm, midExpGroupIndex);
            }
        }
        /* 
         * If we've reached here, it means the flat list position must be a
         * group that is not expanded, since otherwise we would have hit it
         * in the above search.
         */
        /**
         * If we are to expand this group later, where would it go in the
         * mExpGroupMetadataList ?
         */
        let insertPosition:number = 0;
        /** What is its group position in the list of all groups? */
        let groupPos:number = 0;
        /*
         * To figure out exact insertion and prior group positions, we need to
         * determine how we broke out of the binary search.  We backtrack
         * to see this.
         */
        if (leftExpGroupIndex > midExpGroupIndex) {
            /*
             * This would occur in the first conditional, so the flat list
             * insertion position is after the left group. Also, the
             * leftGroupPos is one more than it should be (since that broke out
             * of our binary search), so we decrement it.
             */
            const leftExpGm:ExpandableListConnector.GroupMetadata = egml.get(leftExpGroupIndex - 1);
            insertPosition = leftExpGroupIndex;
            /*
             * Sums the number of groups between the prior exp group and this
             * one, and then adds it to the prior group's group pos
             */
            groupPos = (flPos - leftExpGm.lastChildFlPos) + leftExpGm.gPos;
        } else if (rightExpGroupIndex < midExpGroupIndex) {
            /*
             * This would occur in the second conditional, so the flat list
             * insertion position is before the right group. Also, the
             * rightGroupPos is one less than it should be, so increment it.
             */
            const rightExpGm:ExpandableListConnector.GroupMetadata = egml.get(++rightExpGroupIndex);
            insertPosition = rightExpGroupIndex;
            /*
             * Subtracts this group's flat list pos from the group after's flat
             * list position to find out how many groups are in between the two
             * groups. Then, subtracts that number from the group after's group
             * pos to get this group's pos.
             */
            groupPos = rightExpGm.gPos - (rightExpGm.flPos - flPos);
        } else {
            // TODO: clean exit
            throw Error(`new RuntimeException("Unknown state")`);
        }
        return ExpandableListConnector.PositionMetadata.obtain(flPos, ExpandableListPosition.GROUP, groupPos, -1, null, insertPosition);
    }

    /**
     * Translates either a group pos or a child pos (+ group it belongs to) to a
     * flat list position.  If searching for a child and its group is not expanded, this will
     * return null since the child isn't being shown in the ListView, and hence it has no
     * position.
     * 
     * @param pos a {@link ExpandableListPosition} representing either a group position
     *        or child position
     * @return the flat list position encompassed in a {@link PositionMetadata}
     *         object that contains additional useful info for insertion, etc., or null.
     */
    getFlattenedPos(pos:ExpandableListPosition):ExpandableListConnector.PositionMetadata  {
        const egml:ArrayList<ExpandableListConnector.GroupMetadata> = this.mExpGroupMetadataList;
        const numExpGroups:number = egml.size();
        /* Binary search variables */
        let leftExpGroupIndex:number = 0;
        let rightExpGroupIndex:number = numExpGroups - 1;
        let midExpGroupIndex:number = 0;
        let midExpGm:ExpandableListConnector.GroupMetadata;
        if (numExpGroups == 0) {
            /*
             * There aren't any expanded groups, so flPos must be a group and
             * its flPos will be the same as its group pos.  The
             * insert position is 0 (since the list is empty).
             */
            return ExpandableListConnector.PositionMetadata.obtain(pos.groupPos, pos.type, pos.groupPos, pos.childPos, null, 0);
        }
        /*
         * Binary search over the expanded groups to find either the exact
         * expanded group (if we're looking for a group) or the group that
         * contains the child we're looking for.
         */
        while (leftExpGroupIndex <= rightExpGroupIndex) {
            midExpGroupIndex = Math.floor((rightExpGroupIndex - leftExpGroupIndex) / 2 + leftExpGroupIndex);
            midExpGm = egml.get(midExpGroupIndex);
            if (pos.groupPos > midExpGm.gPos) {
                /*
                 * It's after the current middle group, so search right
                 */
                leftExpGroupIndex = midExpGroupIndex + 1;
            } else if (pos.groupPos < midExpGm.gPos) {
                /*
                 * It's before the current middle group, so search left
                 */
                rightExpGroupIndex = midExpGroupIndex - 1;
            } else if (pos.groupPos == midExpGm.gPos) {
                if (pos.type == ExpandableListPosition.GROUP) {
                    /* If it's a group, give them this matched group's flPos */
                    return ExpandableListConnector.PositionMetadata.obtain(midExpGm.flPos, pos.type, pos.groupPos, pos.childPos, midExpGm, midExpGroupIndex);
                } else if (pos.type == ExpandableListPosition.CHILD) {
                    /* If it's a child, calculate the flat list pos */
                    return ExpandableListConnector.PositionMetadata.obtain(midExpGm.flPos + pos.childPos + 1, pos.type, pos.groupPos, pos.childPos, midExpGm, midExpGroupIndex);
                } else {
                    return null;
                }
            }
        }
        /* 
         * If we've reached here, it means there was no match in the expanded
         * groups, so it must be a collapsed group that they're search for
         */
        if (pos.type != ExpandableListPosition.GROUP) {
            /* If it isn't a group, return null */
            return null;
        }
        /*
         * To figure out exact insertion and prior group positions, we need to
         * determine how we broke out of the binary search. We backtrack to see
         * this.
         */
        if (leftExpGroupIndex > midExpGroupIndex) {
            /*
             * This would occur in the first conditional, so the flat list
             * insertion position is after the left group.
             * 
             * The leftGroupPos is one more than it should be (from the binary
             * search loop) so we subtract 1 to get the actual left group.  Since
             * the insertion point is AFTER the left group, we keep this +1
             * value as the insertion point
             */
            const leftExpGm:ExpandableListConnector.GroupMetadata = egml.get(leftExpGroupIndex - 1);
            const flPos:number = leftExpGm.lastChildFlPos + (pos.groupPos - leftExpGm.gPos);
            return ExpandableListConnector.PositionMetadata.obtain(flPos, pos.type, pos.groupPos, pos.childPos, null, leftExpGroupIndex);
        } else if (rightExpGroupIndex < midExpGroupIndex) {
            /*
             * This would occur in the second conditional, so the flat list
             * insertion position is before the right group. Also, the
             * rightGroupPos is one less than it should be (from binary search
             * loop), so we increment to it.
             */
            const rightExpGm:ExpandableListConnector.GroupMetadata = egml.get(++rightExpGroupIndex);
            const flPos:number = rightExpGm.flPos - (rightExpGm.gPos - pos.groupPos);
            return ExpandableListConnector.PositionMetadata.obtain(flPos, pos.type, pos.groupPos, pos.childPos, null, rightExpGroupIndex);
        } else {
            return null;
        }
    }

    areAllItemsEnabled():boolean  {
        return this.mExpandableListAdapter.areAllItemsEnabled();
    }

    isEnabled(flatListPos:number):boolean  {
        const metadata:ExpandableListConnector.PositionMetadata = this.getUnflattenedPos(flatListPos);
        const pos:ExpandableListPosition = metadata.position;
        let retValue:boolean;
        if (pos.type == ExpandableListPosition.CHILD) {
            retValue = this.mExpandableListAdapter.isChildSelectable(pos.groupPos, pos.childPos);
        } else {
            // Groups are always selectable
            retValue = true;
        }
        metadata.recycle();
        return retValue;
    }

    getCount():number  {
        /*
         * Total count for the list view is the number groups plus the 
         * number of children from currently expanded groups (a value we keep
         * cached in this class)
         */
        return this.mExpandableListAdapter.getGroupCount() + this.mTotalExpChildrenCount;
    }

    getItem(flatListPos:number):any  {
        const posMetadata:ExpandableListConnector.PositionMetadata = this.getUnflattenedPos(flatListPos);
        let retValue:any;
        if (posMetadata.position.type == ExpandableListPosition.GROUP) {
            retValue = this.mExpandableListAdapter.getGroup(posMetadata.position.groupPos);
        } else if (posMetadata.position.type == ExpandableListPosition.CHILD) {
            retValue = this.mExpandableListAdapter.getChild(posMetadata.position.groupPos, posMetadata.position.childPos);
        } else {
            // TODO: clean exit
            throw Error(`new RuntimeException("Flat list position is of unknown type")`);
        }
        posMetadata.recycle();
        return retValue;
    }

    getItemId(flatListPos:number):number  {
        const posMetadata:ExpandableListConnector.PositionMetadata = this.getUnflattenedPos(flatListPos);
        const groupId:number = this.mExpandableListAdapter.getGroupId(posMetadata.position.groupPos);
        let retValue:number;
        if (posMetadata.position.type == ExpandableListPosition.GROUP) {
            retValue = this.mExpandableListAdapter.getCombinedGroupId(groupId);
        } else if (posMetadata.position.type == ExpandableListPosition.CHILD) {
            const childId:number = this.mExpandableListAdapter.getChildId(posMetadata.position.groupPos, posMetadata.position.childPos);
            retValue = this.mExpandableListAdapter.getCombinedChildId(groupId, childId);
        } else {
            // TODO: clean exit
            throw Error(`new RuntimeException("Flat list position is of unknown type")`);
        }
        posMetadata.recycle();
        return retValue;
    }

    getView(flatListPos:number, convertView:View, parent:ViewGroup):View  {
        const posMetadata:ExpandableListConnector.PositionMetadata = this.getUnflattenedPos(flatListPos);
        let retValue:View;
        if (posMetadata.position.type == ExpandableListPosition.GROUP) {
            retValue = this.mExpandableListAdapter.getGroupView(posMetadata.position.groupPos, posMetadata.isExpanded(), convertView, parent);
        } else if (posMetadata.position.type == ExpandableListPosition.CHILD) {
            const isLastChild:boolean = posMetadata.groupMetadata.lastChildFlPos == flatListPos;
            retValue = this.mExpandableListAdapter.getChildView(posMetadata.position.groupPos, posMetadata.position.childPos, isLastChild, convertView, parent);
        } else {
            // TODO: clean exit
            throw Error(`new RuntimeException("Flat list position is of unknown type")`);
        }
        posMetadata.recycle();
        return retValue;
    }

    getItemViewType(flatListPos:number):number  {
        const metadata:ExpandableListConnector.PositionMetadata = this.getUnflattenedPos(flatListPos);
        const pos:ExpandableListPosition = metadata.position;
        let retValue:number;
        if (HeterogeneousExpandableList.isImpl(this.mExpandableListAdapter)) {
            let adapter:HeterogeneousExpandableList = <HeterogeneousExpandableList><any>this.mExpandableListAdapter;
            if (pos.type == ExpandableListPosition.GROUP) {
                retValue = adapter.getGroupType(pos.groupPos);
            } else {
                const childType:number = adapter.getChildType(pos.groupPos, pos.childPos);
                retValue = adapter.getGroupTypeCount() + childType;
            }
        } else {
            if (pos.type == ExpandableListPosition.GROUP) {
                retValue = 0;
            } else {
                retValue = 1;
            }
        }
        metadata.recycle();
        return retValue;
    }

    getViewTypeCount():number  {
        if (HeterogeneousExpandableList.isImpl(this.mExpandableListAdapter)) {
            let adapter:HeterogeneousExpandableList = <HeterogeneousExpandableList><any>this.mExpandableListAdapter;
            return adapter.getGroupTypeCount() + adapter.getChildTypeCount();
        } else {
            return 2;
        }
    }

    hasStableIds():boolean  {
        return this.mExpandableListAdapter.hasStableIds();
    }

    /**
     * Traverses the expanded group metadata list and fills in the flat list
     * positions.
     * 
     * @param forceChildrenCountRefresh Forces refreshing of the children count
     *        for all expanded groups.
     * @param syncGroupPositions Whether to search for the group positions
     *         based on the group IDs. This should only be needed when calling
     *         this from an onChanged callback.
     */
    private refreshExpGroupMetadataList(forceChildrenCountRefresh:boolean, syncGroupPositions:boolean):void  {
        const egml:ArrayList<ExpandableListConnector.GroupMetadata> = this.mExpGroupMetadataList;
        let egmlSize:number = egml.size();
        let curFlPos:number = 0;
        /* Update child count as we go through */
        this.mTotalExpChildrenCount = 0;
        if (syncGroupPositions) {
            // We need to check whether any groups have moved positions
            let positionsChanged:boolean = false;
            for (let i:number = egmlSize - 1; i >= 0; i--) {
                let curGm:ExpandableListConnector.GroupMetadata = egml.get(i);
                let newGPos:number = this.findGroupPosition(curGm.gId, curGm.gPos);
                if (newGPos != curGm.gPos) {
                    if (newGPos == AdapterView.INVALID_POSITION) {
                        // Doh, just remove it from the list of expanded groups
                        egml.remove(i);
                        egmlSize--;
                    }
                    curGm.gPos = newGPos;
                    if (!positionsChanged)
                        positionsChanged = true;
                }
            }
            if (positionsChanged) {
                // At least one group changed positions, so re-sort
                Collections.sort(egml);
            }
        }
        let gChildrenCount:number;
        let lastGPos:number = 0;
        for (let i:number = 0; i < egmlSize; i++) {
            /* Store in local variable since we'll access freq */
            let curGm:ExpandableListConnector.GroupMetadata = egml.get(i);
            /*
             * Get the number of children, try to refrain from calling
             * another class's method unless we have to (so do a subtraction)
             */
            if ((curGm.lastChildFlPos == ExpandableListConnector.GroupMetadata.REFRESH) || forceChildrenCountRefresh) {
                gChildrenCount = this.mExpandableListAdapter.getChildrenCount(curGm.gPos);
            } else {
                /* Num children for this group is its last child's fl pos minus
                 * the group's fl pos
                 */
                gChildrenCount = curGm.lastChildFlPos - curGm.flPos;
            }
            /* Update */
            this.mTotalExpChildrenCount += gChildrenCount;
            /*
             * This skips the collapsed groups and increments the flat list
             * position (for subsequent exp groups) by accounting for the collapsed
             * groups
             */
            curFlPos += (curGm.gPos - lastGPos);
            lastGPos = curGm.gPos;
            /* Update the flat list positions, and the current flat list pos */
            curGm.flPos = curFlPos;
            curFlPos += gChildrenCount;
            curGm.lastChildFlPos = curFlPos;
        }
    }

    /**
     * Collapse a group in the grouped list view
     * 
     * @param groupPos position of the group to collapse
     */
    collapseGroup(groupPos:number):boolean  {
        let elGroupPos:ExpandableListPosition = ExpandableListPosition.obtain(ExpandableListPosition.GROUP, groupPos, -1, -1);
        let pm:ExpandableListConnector.PositionMetadata = this.getFlattenedPos(elGroupPos);
        elGroupPos.recycle();
        if (pm == null)
            return false;
        let retValue:boolean = this.collapseGroupWithMeta(pm);
        pm.recycle();
        return retValue;
    }

    collapseGroupWithMeta(posMetadata:ExpandableListConnector.PositionMetadata):boolean  {
        /*
         * If it is null, it must be already collapsed. This group metadata
         * object should have been set from the search that returned the
         * position metadata object.
         */
        if (posMetadata.groupMetadata == null)
            return false;
        // Remove the group from the list of expanded groups 
        this.mExpGroupMetadataList.remove(posMetadata.groupMetadata);
        // Refresh the metadata
        this.refreshExpGroupMetadataList(false, false);
        // Notify of change
        this.notifyDataSetChanged();
        // Give the callback
        this.mExpandableListAdapter.onGroupCollapsed(posMetadata.groupMetadata.gPos);
        return true;
    }

    /**
     * Expand a group in the grouped list view
     * @param groupPos the group to be expanded
     */
    expandGroup(groupPos:number):boolean  {
        let elGroupPos:ExpandableListPosition = ExpandableListPosition.obtain(ExpandableListPosition.GROUP, groupPos, -1, -1);
        let pm:ExpandableListConnector.PositionMetadata = this.getFlattenedPos(elGroupPos);
        elGroupPos.recycle();
        let retValue:boolean = this.expandGroupWithMeta(pm);
        pm.recycle();
        return retValue;
    }

    expandGroupWithMeta(posMetadata:ExpandableListConnector.PositionMetadata):boolean  {
        if (posMetadata.position.groupPos < 0) {
            // TODO clean exit
            throw Error(`new RuntimeException("Need group")`);
        }
        if (this.mMaxExpGroupCount == 0)
            return false;
        // Check to see if it's already expanded
        if (posMetadata.groupMetadata != null)
            return false;
        /* Restrict number of expanded groups to mMaxExpGroupCount */
        if (this.mExpGroupMetadataList.size() >= this.mMaxExpGroupCount) {
            /* Collapse a group */
            // TODO: Collapse something not on the screen instead of the first one?
            // TODO: Could write overloaded function to take GroupMetadata to collapse
            let collapsedGm:ExpandableListConnector.GroupMetadata = this.mExpGroupMetadataList.get(0);
            let collapsedIndex:number = this.mExpGroupMetadataList.indexOf(collapsedGm);
            this.collapseGroup(collapsedGm.gPos);
            /* Decrement index if it is after the group we removed */
            if (posMetadata.groupInsertIndex > collapsedIndex) {
                posMetadata.groupInsertIndex--;
            }
        }
        let expandedGm:ExpandableListConnector.GroupMetadata = ExpandableListConnector.GroupMetadata.obtain(ExpandableListConnector.GroupMetadata.REFRESH, ExpandableListConnector.GroupMetadata.REFRESH, posMetadata.position.groupPos, this.mExpandableListAdapter.getGroupId(posMetadata.position.groupPos));
        this.mExpGroupMetadataList.add(posMetadata.groupInsertIndex, expandedGm);
        // Refresh the metadata
        this.refreshExpGroupMetadataList(false, false);
        // Notify of change
        this.notifyDataSetChanged();
        // Give the callback
        this.mExpandableListAdapter.onGroupExpanded(expandedGm.gPos);
        return true;
    }

    /**
     * Whether the given group is currently expanded.
     * @param groupPosition The group to check.
     * @return Whether the group is currently expanded.
     */
    isGroupExpanded(groupPosition:number):boolean  {
        let groupMetadata:ExpandableListConnector.GroupMetadata;
        for (let i:number = this.mExpGroupMetadataList.size() - 1; i >= 0; i--) {
            groupMetadata = this.mExpGroupMetadataList.get(i);
            if (groupMetadata.gPos == groupPosition) {
                return true;
            }
        }
        return false;
    }

    /**
     * Set the maximum number of groups that can be expanded at any given time
     */
    setMaxExpGroupCount(maxExpGroupCount:number):void  {
        this.mMaxExpGroupCount = maxExpGroupCount;
    }

    getAdapter():ExpandableListAdapter  {
        return this.mExpandableListAdapter;
    }

    //getFilter():Filter  {
    //    let adapter:ExpandableListAdapter = this.getAdapter();
    //    if (adapter instanceof Filterable) {
    //        return (<Filterable> adapter).getFilter();
    //    } else {
    //        return null;
    //    }
    //}

    getExpandedGroupMetadataList():ArrayList<ExpandableListConnector.GroupMetadata>  {
        return this.mExpGroupMetadataList;
    }

    setExpandedGroupMetadataList(expandedGroupMetadataList:ArrayList<ExpandableListConnector.GroupMetadata>):void  {
        if ((expandedGroupMetadataList == null) || (this.mExpandableListAdapter == null)) {
            return;
        }
        // Make sure our current data set is big enough for the previously
        // expanded groups, if not, ignore this request
        let numGroups:number = this.mExpandableListAdapter.getGroupCount();
        for (let i:number = expandedGroupMetadataList.size() - 1; i >= 0; i--) {
            if (expandedGroupMetadataList.get(i).gPos >= numGroups) {
                // Doh, for some reason the client doesn't have some of the groups
                return;
            }
        }
        this.mExpGroupMetadataList = expandedGroupMetadataList;
        this.refreshExpGroupMetadataList(true, false);
    }

    isEmpty():boolean  {
        let adapter:ExpandableListAdapter = this.getAdapter();
        return adapter != null ? adapter.isEmpty() : true;
    }

    /**
     * Searches the expandable list adapter for a group position matching the
     * given group ID. The search starts at the given seed position and then
     * alternates between moving up and moving down until 1) we find the right
     * position, or 2) we run out of time, or 3) we have looked at every
     * position
     * 
     * @return Position of the row that matches the given row ID, or
     *         {@link AdapterView#INVALID_POSITION} if it can't be found
     * @see AdapterView#findSyncPosition()
     */
    findGroupPosition(groupIdToMatch:number, seedGroupPosition:number):number  {
        let count:number = this.mExpandableListAdapter.getGroupCount();
        if (count == 0) {
            return AdapterView.INVALID_POSITION;
        }
        // If there isn't a selection don't hunt for it
        if (groupIdToMatch == AdapterView.INVALID_ROW_ID) {
            return AdapterView.INVALID_POSITION;
        }
        // Pin seed to reasonable values
        seedGroupPosition = Math.max(0, seedGroupPosition);
        seedGroupPosition = Math.min(count - 1, seedGroupPosition);
        let endTime:number = SystemClock.uptimeMillis() + AdapterView.SYNC_MAX_DURATION_MILLIS;
        let rowId:number;
        // first position scanned so far
        let first:number = seedGroupPosition;
        // last position scanned so far
        let last:number = seedGroupPosition;
        // True if we should move down on the next iteration
        let next:boolean = false;
        // True when we have looked at the first item in the data
        let hitFirst:boolean;
        // True when we have looked at the last item in the data
        let hitLast:boolean;
        // Get the item ID locally (instead of getItemIdAtPosition), so
        // we need the adapter
        let adapter:ExpandableListAdapter = this.getAdapter();
        if (adapter == null) {
            return AdapterView.INVALID_POSITION;
        }
        while (SystemClock.uptimeMillis() <= endTime) {
            rowId = adapter.getGroupId(seedGroupPosition);
            if (rowId == groupIdToMatch) {
                // Found it!
                return seedGroupPosition;
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
                seedGroupPosition = last;
                // Try going up next time
                next = false;
            } else if (hitLast || (!next && !hitFirst)) {
                // Either we hit the bottom, or we are trying to move up
                first--;
                seedGroupPosition = first;
                // Try going down next time
                next = true;
            }
        }
        return AdapterView.INVALID_POSITION;
    }






}

export module ExpandableListConnector{
export class MyDataSetObserver extends DataSetObserver {
    _ExpandableListConnector_this:ExpandableListConnector;
    constructor(arg:ExpandableListConnector){
        super();
        this._ExpandableListConnector_this = arg;
    }

    onChanged():void  {
        this._ExpandableListConnector_this.refreshExpGroupMetadataList(true, true);
        this._ExpandableListConnector_this.notifyDataSetChanged();
    }

    onInvalidated():void  {
        this._ExpandableListConnector_this.refreshExpGroupMetadataList(true, true);
        this._ExpandableListConnector_this.notifyDataSetInvalidated();
    }
}
/**
     * Metadata about an expanded group to help convert from a flat list
     * position to either a) group position for groups, or b) child position for
     * children
     */
export class GroupMetadata implements Comparable<GroupMetadata> {

    static REFRESH:number = -1;

    /** This group's flat list position */
    flPos:number = 0;

    /* firstChildFlPos isn't needed since it's (flPos + 1) */
    /**
         * This group's last child's flat list position, so basically
         * the range of this group in the flat list
         */
    lastChildFlPos:number = 0;

    /**
         * This group's group position
         */
    gPos:number = 0;

    /**
         * This group's id
         */
    gId:number = 0;

    constructor( ) {
    }

    static obtain(flPos:number, lastChildFlPos:number, gPos:number, gId:number):GroupMetadata  {
        let gm:GroupMetadata = new GroupMetadata();
        gm.flPos = flPos;
        gm.lastChildFlPos = lastChildFlPos;
        gm.gPos = gPos;
        gm.gId = gId;
        return gm;
    }

    compareTo(another:GroupMetadata):number  {
        if (another == null) {
            throw Error(`new IllegalArgumentException()`);
        }
        return this.gPos - another.gPos;
    }

}
/**
     * Data type that contains an expandable list position (can refer to either a group
     * or child) and some extra information regarding referred item (such as
     * where to insert into the flat list, etc.)
     */
export class PositionMetadata {

    private static MAX_POOL_SIZE:number = 5;

    private static sPool:ArrayList<PositionMetadata> = new ArrayList<PositionMetadata>(PositionMetadata.MAX_POOL_SIZE);

    /** Data type to hold the position and its type (child/group) */
    position:ExpandableListPosition;

    /**
         * Link back to the expanded GroupMetadata for this group. Useful for
         * removing the group from the list of expanded groups inside the
         * connector when we collapse the group, and also as a check to see if
         * the group was expanded or collapsed (this will be null if the group
         * is collapsed since we don't keep that group's metadata)
         */
    groupMetadata:ExpandableListConnector.GroupMetadata;

    /**
         * For groups that are collapsed, we use this as the index (in
         * mExpGroupMetadataList) to insert this group when we are expanding
         * this group.
         */
    groupInsertIndex:number = 0;

    private resetState():void  {
        if (this.position != null) {
            this.position.recycle();
            this.position = null;
        }
        this.groupMetadata = null;
        this.groupInsertIndex = 0;
    }

    /**
         * Use {@link #obtain(int, int, int, int, GroupMetadata, int)}
         */
    constructor() {
    }

    static obtain(flatListPos:number, type:number, groupPos:number, childPos:number, groupMetadata:ExpandableListConnector.GroupMetadata, groupInsertIndex:number):PositionMetadata  {
        let pm:PositionMetadata = PositionMetadata.getRecycledOrCreate();
        pm.position = ExpandableListPosition.obtain(type, groupPos, childPos, flatListPos);
        pm.groupMetadata = groupMetadata;
        pm.groupInsertIndex = groupInsertIndex;
        return pm;
    }

    private static getRecycledOrCreate():PositionMetadata  {
        let pm:PositionMetadata;
        {
            if (PositionMetadata.sPool.size() > 0) {
                pm = PositionMetadata.sPool.remove(0);
            } else {
                return new PositionMetadata();
            }
        }
        pm.resetState();
        return pm;
    }

    recycle():void  {
        this.resetState();
        {
            if (PositionMetadata.sPool.size() < PositionMetadata.MAX_POOL_SIZE) {
                PositionMetadata.sPool.add(this);
            }
        }
    }

    /**
         * Checks whether the group referred to in this object is expanded,
         * or not (at the time this object was created)
         * 
         * @return whether the group at groupPos is expanded or not
         */
    isExpanded():boolean  {
        return this.groupMetadata != null;
    }
}
}

}
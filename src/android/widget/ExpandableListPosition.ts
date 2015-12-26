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

///<reference path="../../java/util/ArrayList.ts"/>
///<reference path="../../android/widget/ExpandableListView.ts"/>
///<reference path="../../android/widget/ListView.ts"/>

module android.widget {
import ArrayList = java.util.ArrayList;
import ExpandableListView = android.widget.ExpandableListView;
import ListView = android.widget.ListView;
/**
 * ExpandableListPosition can refer to either a group's position or a child's
 * position. Referring to a child's position requires both a group position (the
 * group containing the child) and a child position (the child's position within
 * that group). To create objects, use {@link #obtainChildPosition(int, int)} or
 * {@link #obtainGroupPosition(int)}.
 */
export class ExpandableListPosition {

    private static MAX_POOL_SIZE:number = 5;

    private static sPool:ArrayList<ExpandableListPosition> = new ArrayList<ExpandableListPosition>(ExpandableListPosition.MAX_POOL_SIZE);

    /**
     * This data type represents a child position
     */
    static CHILD:number = 1;

    /**
     * This data type represents a group position
     */
    static GROUP:number = 2;

    /**
     * The position of either the group being referred to, or the parent
     * group of the child being referred to
     */
    groupPos:number = 0;

    /**
     * The position of the child within its parent group 
     */
    childPos:number = 0;

    /**
     * The position of the item in the flat list (optional, used internally when
     * the corresponding flat list position for the group or child is known)
     */
    flatListPos:number = 0;

    /**
     * What type of position this ExpandableListPosition represents
     */
    type:number = 0;

    private resetState():void  {
        this.groupPos = 0;
        this.childPos = 0;
        this.flatListPos = 0;
        this.type = 0;
    }

    constructor( ) {
    }

    getPackedPosition():number  {
        if (this.type == ExpandableListPosition.CHILD)
            return ExpandableListView.getPackedPositionForChild(this.groupPos, this.childPos);
        else
            return ExpandableListView.getPackedPositionForGroup(this.groupPos);
    }

    static obtainGroupPosition(groupPosition:number):ExpandableListPosition  {
        return ExpandableListPosition.obtain(ExpandableListPosition.GROUP, groupPosition, 0, 0);
    }

    static obtainChildPosition(groupPosition:number, childPosition:number):ExpandableListPosition  {
        return ExpandableListPosition.obtain(ExpandableListPosition.CHILD, groupPosition, childPosition, 0);
    }

    static obtainPosition(packedPosition:number):ExpandableListPosition  {
        if (packedPosition == ExpandableListView.PACKED_POSITION_VALUE_NULL) {
            return null;
        }
        let elp:ExpandableListPosition = ExpandableListPosition.getRecycledOrCreate();
        elp.groupPos = ExpandableListView.getPackedPositionGroup(packedPosition);
        if (ExpandableListView.getPackedPositionType(packedPosition) == ExpandableListView.PACKED_POSITION_TYPE_CHILD) {
            elp.type = ExpandableListPosition.CHILD;
            elp.childPos = ExpandableListView.getPackedPositionChild(packedPosition);
        } else {
            elp.type = ExpandableListPosition.GROUP;
        }
        return elp;
    }

    static obtain(type:number, groupPos:number, childPos:number, flatListPos:number):ExpandableListPosition  {
        let elp:ExpandableListPosition = ExpandableListPosition.getRecycledOrCreate();
        elp.type = type;
        elp.groupPos = groupPos;
        elp.childPos = childPos;
        elp.flatListPos = flatListPos;
        return elp;
    }

    private static getRecycledOrCreate():ExpandableListPosition  {
        let elp:ExpandableListPosition;
        {
            if (ExpandableListPosition.sPool.size() > 0) {
                elp = ExpandableListPosition.sPool.remove(0);
            } else {
                return new ExpandableListPosition();
            }
        }
        elp.resetState();
        return elp;
    }

    /**
     * Do not call this unless you obtained this via ExpandableListPosition.obtain().
     * PositionMetadata will handle recycling its own children.
     */
    recycle():void  {
        {
            if (ExpandableListPosition.sPool.size() < ExpandableListPosition.MAX_POOL_SIZE) {
                ExpandableListPosition.sPool.add(this);
            }
        }
    }
}
}
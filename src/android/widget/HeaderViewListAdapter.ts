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
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../java/util/ArrayList.ts"/>
///<reference path="../../android/widget/Adapter.ts"/>
///<reference path="../../android/widget/AdapterView.ts"/>
///<reference path="../../android/widget/ListAdapter.ts"/>
///<reference path="../../android/widget/ListView.ts"/>
///<reference path="../../android/widget/WrapperListAdapter.ts"/>

module android.widget {
import DataSetObserver = android.database.DataSetObserver;
import View = android.view.View;
import ViewGroup = android.view.ViewGroup;
import ArrayList = java.util.ArrayList;
import Adapter = android.widget.Adapter;
import AdapterView = android.widget.AdapterView;
import ListAdapter = android.widget.ListAdapter;
import ListView = android.widget.ListView;
import WrapperListAdapter = android.widget.WrapperListAdapter;
/**
 * ListAdapter used when a ListView has header views. This ListAdapter
 * wraps another one and also keeps track of the header views and their
 * associated data objects.
 *<p>This is intended as a base class; you will probably not need to
 * use this class directly in your own code.
 */
export class HeaderViewListAdapter implements WrapperListAdapter {

    private mAdapter:ListAdapter;

    // These two ArrayList are assumed to NOT be null.
    // They are indeed created when declared in ListView and then shared.
    mHeaderViewInfos:ArrayList<ListView.FixedViewInfo>;

    mFooterViewInfos:ArrayList<ListView.FixedViewInfo>;

    // Used as a placeholder in case the provided info views are indeed null.
    // Currently only used by some CTS tests, which may be removed.
    static EMPTY_INFO_LIST:ArrayList<ListView.FixedViewInfo> = new ArrayList<ListView.FixedViewInfo>();

    mAreAllFixedViewsSelectable:boolean;

    private mIsFilterable:boolean;

     constructor(headerViewInfos:ArrayList<ListView.FixedViewInfo>, footerViewInfos:ArrayList<ListView.FixedViewInfo>, adapter:ListAdapter) {
        this.mAdapter = adapter;
        this.mIsFilterable = false;//adapter instanceof Filterable;
        if (headerViewInfos == null) {
            this.mHeaderViewInfos = HeaderViewListAdapter.EMPTY_INFO_LIST;
        } else {
            this.mHeaderViewInfos = headerViewInfos;
        }
        if (footerViewInfos == null) {
            this.mFooterViewInfos = HeaderViewListAdapter.EMPTY_INFO_LIST;
        } else {
            this.mFooterViewInfos = footerViewInfos;
        }
        this.mAreAllFixedViewsSelectable = this.areAllListInfosSelectable(this.mHeaderViewInfos) && this.areAllListInfosSelectable(this.mFooterViewInfos);
    }

    getHeadersCount():number  {
        return this.mHeaderViewInfos.size();
    }

    getFootersCount():number  {
        return this.mFooterViewInfos.size();
    }

    isEmpty():boolean  {
        return this.mAdapter == null || this.mAdapter.isEmpty();
    }

    private areAllListInfosSelectable(infos:ArrayList<ListView.FixedViewInfo>):boolean  {
        if (infos != null) {
            for (let info of infos.array) {
                if (!info.isSelectable) {
                    return false;
                }
            }
        }
        return true;
    }

    removeHeader(v:View):boolean  {
        for (let i:number = 0; i < this.mHeaderViewInfos.size(); i++) {
            let info:ListView.FixedViewInfo = this.mHeaderViewInfos.get(i);
            if (info.view == v) {
                this.mHeaderViewInfos.remove(i);
                this.mAreAllFixedViewsSelectable = this.areAllListInfosSelectable(this.mHeaderViewInfos) && this.areAllListInfosSelectable(this.mFooterViewInfos);
                return true;
            }
        }
        return false;
    }

    removeFooter(v:View):boolean  {
        for (let i:number = 0; i < this.mFooterViewInfos.size(); i++) {
            let info:ListView.FixedViewInfo = this.mFooterViewInfos.get(i);
            if (info.view == v) {
                this.mFooterViewInfos.remove(i);
                this.mAreAllFixedViewsSelectable = this.areAllListInfosSelectable(this.mHeaderViewInfos) && this.areAllListInfosSelectable(this.mFooterViewInfos);
                return true;
            }
        }
        return false;
    }

    getCount():number  {
        if (this.mAdapter != null) {
            return this.getFootersCount() + this.getHeadersCount() + this.mAdapter.getCount();
        } else {
            return this.getFootersCount() + this.getHeadersCount();
        }
    }

    areAllItemsEnabled():boolean  {
        if (this.mAdapter != null) {
            return this.mAreAllFixedViewsSelectable && this.mAdapter.areAllItemsEnabled();
        } else {
            return true;
        }
    }

    isEnabled(position:number):boolean  {
        // Header (negative positions will throw an IndexOutOfBoundsException)
        let numHeaders:number = this.getHeadersCount();
        if (position < numHeaders) {
            return this.mHeaderViewInfos.get(position).isSelectable;
        }
        // Adapter
        const adjPosition:number = position - numHeaders;
        let adapterCount:number = 0;
        if (this.mAdapter != null) {
            adapterCount = this.mAdapter.getCount();
            if (adjPosition < adapterCount) {
                return this.mAdapter.isEnabled(adjPosition);
            }
        }
        // Footer (off-limits positions will throw an IndexOutOfBoundsException)
        return this.mFooterViewInfos.get(adjPosition - adapterCount).isSelectable;
    }

    getItem(position:number):any  {
        // Header (negative positions will throw an IndexOutOfBoundsException)
        let numHeaders:number = this.getHeadersCount();
        if (position < numHeaders) {
            return this.mHeaderViewInfos.get(position).data;
        }
        // Adapter
        const adjPosition:number = position - numHeaders;
        let adapterCount:number = 0;
        if (this.mAdapter != null) {
            adapterCount = this.mAdapter.getCount();
            if (adjPosition < adapterCount) {
                return this.mAdapter.getItem(adjPosition);
            }
        }
        // Footer (off-limits positions will throw an IndexOutOfBoundsException)
        return this.mFooterViewInfos.get(adjPosition - adapterCount).data;
    }

    getItemId(position:number):number  {
        let numHeaders:number = this.getHeadersCount();
        if (this.mAdapter != null && position >= numHeaders) {
            let adjPosition:number = position - numHeaders;
            let adapterCount:number = this.mAdapter.getCount();
            if (adjPosition < adapterCount) {
                return this.mAdapter.getItemId(adjPosition);
            }
        }
        return -1;
    }

    hasStableIds():boolean  {
        if (this.mAdapter != null) {
            return this.mAdapter.hasStableIds();
        }
        return false;
    }

    getView(position:number, convertView:View, parent:ViewGroup):View  {
        // Header (negative positions will throw an IndexOutOfBoundsException)
        let numHeaders:number = this.getHeadersCount();
        if (position < numHeaders) {
            return this.mHeaderViewInfos.get(position).view;
        }
        // Adapter
        const adjPosition:number = position - numHeaders;
        let adapterCount:number = 0;
        if (this.mAdapter != null) {
            adapterCount = this.mAdapter.getCount();
            if (adjPosition < adapterCount) {
                return this.mAdapter.getView(adjPosition, convertView, parent);
            }
        }
        // Footer (off-limits positions will throw an IndexOutOfBoundsException)
        return this.mFooterViewInfos.get(adjPosition - adapterCount).view;
    }

    getItemViewType(position:number):number  {
        let numHeaders:number = this.getHeadersCount();
        if (this.mAdapter != null && position >= numHeaders) {
            let adjPosition:number = position - numHeaders;
            let adapterCount:number = this.mAdapter.getCount();
            if (adjPosition < adapterCount) {
                return this.mAdapter.getItemViewType(adjPosition);
            }
        }
        return AdapterView.ITEM_VIEW_TYPE_HEADER_OR_FOOTER;
    }

    getViewTypeCount():number  {
        if (this.mAdapter != null) {
            return this.mAdapter.getViewTypeCount();
        }
        return 1;
    }

    registerDataSetObserver(observer:DataSetObserver):void  {
        if (this.mAdapter != null) {
            this.mAdapter.registerDataSetObserver(observer);
        }
    }

    unregisterDataSetObserver(observer:DataSetObserver):void  {
        if (this.mAdapter != null) {
            this.mAdapter.unregisterDataSetObserver(observer);
        }
    }

    getFilter()  {
        //if (this.mIsFilterable) {
        //    return (<Filterable> this.mAdapter).getFilter();
        //}
        return null;
    }

    getWrappedAdapter():ListAdapter  {
        return this.mAdapter;
    }
}
}
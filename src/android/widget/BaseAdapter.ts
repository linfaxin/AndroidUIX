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
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/widget/Adapter.ts"/>
///<reference path="../../android/widget/ListAdapter.ts"/>
///<reference path="../../android/widget/ListView.ts"/>
///<reference path="../../android/widget/SpinnerAdapter.ts"/>

module android.widget {
import DataSetObservable = android.database.DataSetObservable;
import DataSetObserver = android.database.DataSetObserver;
import View = android.view.View;
import ViewGroup = android.view.ViewGroup;
import Adapter = android.widget.Adapter;
import ListAdapter = android.widget.ListAdapter;
import ListView = android.widget.ListView;
import SpinnerAdapter = android.widget.SpinnerAdapter;
/**
 * Common base class of common implementation for an {@link Adapter} that can be
 * used in both {@link ListView} (by implementing the specialized
 * {@link ListAdapter} interface} and {@link Spinner} (by implementing the
 * specialized {@link SpinnerAdapter} interface.
 */
export abstract class BaseAdapter implements ListAdapter, SpinnerAdapter {

    private mDataSetObservable:DataSetObservable = new DataSetObservable();

    hasStableIds():boolean  {
        return false;
    }

    registerDataSetObserver(observer:DataSetObserver):void  {
        this.mDataSetObservable.registerObserver(observer);
    }

    unregisterDataSetObserver(observer:DataSetObserver):void  {
        this.mDataSetObservable.unregisterObserver(observer);
    }

    /**
     * Notifies the attached observers that the underlying data has been changed
     * and any View reflecting the data set should refresh itself.
     */
    notifyDataSetChanged():void  {
        this.mDataSetObservable.notifyChanged();
    }

    /**
     * Notifies the attached observers that the underlying data is no longer valid
     * or available. Once invoked this adapter is no longer valid and should
     * not report further data set changes.
     */
    notifyDataSetInvalidated():void  {
        this.mDataSetObservable.notifyInvalidated();
    }

    areAllItemsEnabled():boolean  {
        return true;
    }

    isEnabled(position:number):boolean  {
        return true;
    }

    getDropDownView(position:number, convertView:View, parent:ViewGroup):View  {
        return this.getView(position, convertView, parent);
    }

    getItemViewType(position:number):number  {
        return 0;
    }

    getViewTypeCount():number  {
        return 1;
    }

    isEmpty():boolean  {
        return this.getCount() == 0;
    }

    //abstract method impl from interface

    abstract getView(position:number, convertView:View, parent:ViewGroup):View ;


    abstract getCount():number ;

    abstract getItem(position:number):any;

    abstract getItemId(position:number):number;
}
}
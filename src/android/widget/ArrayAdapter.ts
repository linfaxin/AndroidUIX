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

///<reference path="../../android/util/Log.ts"/>
///<reference path="../../android/view/LayoutInflater.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../java/util/ArrayList.ts"/>
///<reference path="../../java/util/Arrays.ts"/>
///<reference path="../../java/util/Collections.ts"/>
///<reference path="../../java/util/Comparator.ts"/>
///<reference path="../../java/util/List.ts"/>
///<reference path="../../android/widget/Adapter.ts"/>
///<reference path="../../android/widget/BaseAdapter.ts"/>
///<reference path="../../android/widget/ImageView.ts"/>
///<reference path="../../android/widget/ListView.ts"/>
///<reference path="../../android/widget/TextView.ts"/>
///<reference path="../../android/content/Context.ts"/>

module android.widget {
import Log = android.util.Log;
import LayoutInflater = android.view.LayoutInflater;
import View = android.view.View;
import ViewGroup = android.view.ViewGroup;
import ArrayList = java.util.ArrayList;
import Arrays = java.util.Arrays;
import Collections = java.util.Collections;
import Comparator = java.util.Comparator;
import List = java.util.List;
import Adapter = android.widget.Adapter;
import BaseAdapter = android.widget.BaseAdapter;
import ImageView = android.widget.ImageView;
import ListView = android.widget.ListView;
import TextView = android.widget.TextView;
import Context = android.content.Context;
/**
 * A concrete BaseAdapter that is backed by an array of arbitrary
 * objects.  By default this class expects that the provided resource id references
 * a single TextView.  If you want to use a more complex layout, use the constructors that
 * also takes a field id.  That field id should reference a TextView in the larger layout
 * resource.
 *
 * <p>However the TextView is referenced, it will be filled with the toString() of each object in
 * the array. You can add lists or arrays of custom objects. Override the toString() method
 * of your objects to determine what text will be displayed for the item in the list.
 *
 * <p>To use something other than TextViews for the array display, for instance, ImageViews,
 * or to have some of data besides toString() results fill the views,
 * override {@link #getView(int, View, ViewGroup)} to return the type of view you want.
 */
export class ArrayAdapter<T> extends BaseAdapter {

    /**
     * Contains the list of objects that represent the data of this ArrayAdapter.
     * The content of this list is referred to as "the array" in the documentation.
     */
    private mObjects:List<T>;

    ///**
    // * Lock used to modify the content of {@link #mObjects}. Any write operation
    // * performed on the array should be synchronized on this lock. This lock is also
    // * used by the filter (see {@link #getFilter()} to make a synchronized copy of
    // * the original array of data.
    // */
    //private mLock:any = new any();

    /**
     * The resource indicating what views to inflate to display the content of this
     * array adapter.
     */
    private mResource:string;

    /**
     * The resource indicating what views to inflate to display the content of this
     * array adapter in a drop down widget.
     */
    private mDropDownResource:string;

    /**
     * If the inflated resource is not a TextView, {@link #mFieldId} is used to find
     * a TextView inside the inflated views hierarchy. This field must contain the
     * identifier that matches the one defined in the resource file.
     */
    private mFieldId:string;

    /**
     * Indicates whether or not {@link #notifyDataSetChanged()} must be called whenever
     * {@link #mObjects} is modified.
     */
    private mNotifyOnChange:boolean = true;

    private mContext:Context;

    //// A copy of the original mObjects array, initialized from and then used instead as soon as
    //// the mFilter ArrayFilter is used. mObjects will then only contain the filtered values.
    //private mOriginalValues:ArrayList<T>;
    //
    //private mFilter:ArrayAdapter.ArrayFilter;

    private mInflater:LayoutInflater;

    /**
     * Constructor
     *
     * @param context The current context.
     * @param resource The resource ID for a layout file containing a TextView to use when
     *                 instantiating views.
     */
    constructor(context: Context, resource: string);
    /**
     * Constructor
     *
     * @param context The current context.
     * @param resource The resource ID for a layout file containing a layout to use when
     *                 instantiating views.
     * @param textViewResourceId The id of the TextView within the layout resource to be populated
     */
    constructor(context: Context, resource: string, textViewResourceId: string);
    /**
     * Constructor
     *
     * @param context The current context.
     * @param resource The resource ID for a layout file containing a TextView to use when
     *                 instantiating views.
     * @param objects The objects to represent in the ListView.
     */
    constructor(context: Context, resource: string, objects: T[]);
    /**
     * Constructor
     *
     * @param context The current context.
     * @param resource The resource ID for a layout file containing a layout to use when
     *                 instantiating views.
     * @param textViewResourceId The id of the TextView within the layout resource to be populated
     * @param objects The objects to represent in the ListView.
     */
    constructor(context: Context, resource: string, textViewResourceId: string, objects: T[]|List<T>);
    constructor(...args) {
        super();
        if (args.length === 2) {
            this.init(args[0], args[1], null, new ArrayList<T>());
        } else if (args.length === 3) {
            if (args[2] instanceof Array) {
                this.init(args[0], args[1], null, <List<T>>Arrays.asList(args[2]));
            } else {
                this.init(args[0], args[1], args[2], new ArrayList<T>());
            }
        } else if (args.length === 4) {
            this.init(args[0], args[1], args[2], args[3]);
        }
    }

    /**
     * Adds the specified object at the end of the array.
     *
     * @param object The object to add at the end of the array.
     */
    add(object:T):void  {
        {
            //if (this.mOriginalValues != null) {
            //    this.mOriginalValues.add(object);
            //} else {
                this.mObjects.add(object);
            //}
        }
        if (this.mNotifyOnChange)
            this.notifyDataSetChanged();
    }

    /**
     * Adds the specified Collection at the end of the array.
     *
     * @param collection The Collection to add at the end of the array.
     */
    addAll(collection:List<T>):void  {
        {
            //if (this.mOriginalValues != null) {
            //    this.mOriginalValues.addAll(collection);
            //} else {
                this.mObjects.addAll(collection);
            //}
        }
        if (this.mNotifyOnChange)
            this.notifyDataSetChanged();
    }

    ///**
    // * Adds the specified items at the end of the array.
    // *
    // * @param items The items to add at the end of the array.
    // */
    //addAll(...items:T):void  {
    //    {
    //        if (this.mOriginalValues != null) {
    //            Collections.addAll(this.mOriginalValues, items);
    //        } else {
    //            Collections.addAll(this.mObjects, items);
    //        }
    //    }
    //    if (this.mNotifyOnChange)
    //        this.notifyDataSetChanged();
    //}

    /**
     * Inserts the specified object at the specified index in the array.
     *
     * @param object The object to insert into the array.
     * @param index The index at which the object must be inserted.
     */
    insert(object:T, index:number):void  {
        {
            //if (this.mOriginalValues != null) {
            //    this.mOriginalValues.add(index, object);
            //} else {
                this.mObjects.add(index, object);
            //}
        }
        if (this.mNotifyOnChange)
            this.notifyDataSetChanged();
    }

    /**
     * Removes the specified object from the array.
     *
     * @param object The object to remove.
     */
    remove(object:T):void  {
        {
            //if (this.mOriginalValues != null) {
            //    this.mOriginalValues.remove(object);
            //} else {
                this.mObjects.remove(object);
            //}
        }
        if (this.mNotifyOnChange)
            this.notifyDataSetChanged();
    }

    /**
     * Remove all elements from the list.
     */
    clear():void  {
        {
            //if (this.mOriginalValues != null) {
            //    this.mOriginalValues.clear();
            //} else {
                this.mObjects.clear();
            //}
        }
        if (this.mNotifyOnChange)
            this.notifyDataSetChanged();
    }

    /**
     * Sorts the content of this adapter using the specified comparator.
     *
     * @param comparator The comparator used to sort the objects contained
     *        in this adapter.
     */
    sort(comparator:Comparator<T>):void  {
        {
            //if (this.mOriginalValues != null) {
            //    Collections.sort(this.mOriginalValues, comparator);
            //} else {
                Collections.sort(this.mObjects, comparator);
            //}
        }
        if (this.mNotifyOnChange)
            this.notifyDataSetChanged();
    }

    /**
     * {@inheritDoc}
     */
    notifyDataSetChanged():void  {
        super.notifyDataSetChanged();
        this.mNotifyOnChange = true;
    }

    /**
     * Control whether methods that change the list ({@link #add},
     * {@link #insert}, {@link #remove}, {@link #clear}) automatically call
     * {@link #notifyDataSetChanged}.  If set to false, caller must
     * manually call notifyDataSetChanged() to have the changes
     * reflected in the attached view.
     *
     * The default is true, and calling notifyDataSetChanged()
     * resets the flag to true.
     *
     * @param notifyOnChange if true, modifications to the list will
     *                       automatically call {@link
     *                       #notifyDataSetChanged}
     */
    setNotifyOnChange(notifyOnChange:boolean):void  {
        this.mNotifyOnChange = notifyOnChange;
    }

    private init(context:Context, resource:string, textViewResourceId:string, objects:T[]|List<T>):void  {
        this.mContext = context;
        this.mInflater = context.getLayoutInflater();
        this.mResource = this.mDropDownResource = resource;
        if(objects instanceof Array) objects = Arrays.asList(<T[]>objects);
        this.mObjects = <List<T>>objects;
        this.mFieldId = textViewResourceId;
    }

    /**
     * Returns the context associated with this array adapter. The context is used
     * to create views from the resource passed to the constructor.
     *
     * @return The Context associated with this adapter.
     */
    getContext():Context  {
        return this.mContext;
    }

    /**
     * {@inheritDoc}
     */
    getCount():number  {
        return this.mObjects.size();
    }

    /**
     * {@inheritDoc}
     */
    getItem(position:number):T  {
        return this.mObjects.get(position);
    }

    /**
     * Returns the position of the specified item in the array.
     *
     * @param item The item to retrieve the position of.
     *
     * @return The position of the specified item.
     */
    getPosition(item:T):number  {
        return this.mObjects.indexOf(item);
    }

    /**
     * {@inheritDoc}
     */
    getItemId(position:number):number  {
        return position;
    }

    /**
     * {@inheritDoc}
     */
    getView(position:number, convertView:View, parent:ViewGroup):View  {
        return this.createViewFromResource(position, convertView, parent, this.mResource);
    }

    private createViewFromResource(position:number, convertView:View, parent:ViewGroup, resource:string):View  {
        let view:View;
        let text:TextView;
        if (convertView == null) {
            view = this.mInflater.inflate(this.mContext.getResources().getLayout(resource), parent, false);
        } else {
            view = convertView;
        }
        try {
            if (this.mFieldId == null) {
                //  If no custom field is assigned, assume the whole resource is a TextView
                text = <TextView> view;
            } else {
                //  Otherwise, find the TextView field within the layout
                text = <TextView> view.findViewById(this.mFieldId);
            }
        } catch (e){
            Log.e("ArrayAdapter", "You must supply a resource ID for a TextView");
            throw Error(`new IllegalStateException("ArrayAdapter requires the resource ID to be a TextView", e)`);
        }
        let item:T = this.getItem(position);
        if (typeof item === 'string') {
            text.setText(<string><any>item);
        } else {
            text.setText(item.toString());
        }
        return view;
    }

    /**
     * <p>Sets the layout resource to create the drop down views.</p>
     *
     * @param resource the layout resource defining the drop down views
     * @see #getDropDownView(int, android.view.View, android.view.ViewGroup)
     */
    setDropDownViewResource(resource:string):void  {
        this.mDropDownResource = resource;
    }

    /**
     * {@inheritDoc}
     */
    getDropDownView(position:number, convertView:View, parent:ViewGroup):View  {
        return this.createViewFromResource(position, convertView, parent, this.mDropDownResource);
    }

    ///**
    // * Creates a new ArrayAdapter from external resources. The content of the array is
    // * obtained through {@link android.content.res.Resources#getTextArray(int)}.
    // *
    // * @param context The application's environment.
    // * @param textArrayResId The identifier of the array to use as the data source.
    // * @param textViewResId The identifier of the layout used to create views.
    // *
    // * @return An ArrayAdapter<CharSequence>.
    // */
    //static createFromResource(context:Context, textArrayResId:number, textViewResId:number):ArrayAdapter<string>  {
    //    let strings:string[] = context.getResources().getTextArray(textArrayResId);
    //    return new ArrayAdapter<string>(context, textViewResId, strings);
    //}

    ///**
    // * {@inheritDoc}
    // */
    //getFilter():Filter  {
    //    if (this.mFilter == null) {
    //        this.mFilter = new ArrayAdapter.ArrayFilter(this);
    //    }
    //    return this.mFilter;
    //}


}

export module ArrayAdapter{
///**
//     * <p>An array filter constrains the content of the array adapter with
//     * a prefix. Each item that does not start with the supplied prefix
//     * is removed from the list.</p>
//     */
//export class ArrayFilter extends Filter {
//    _ArrayAdapter_this:ArrayAdapter;
//    constructor(arg:ArrayAdapter){
//        super();
//        this._ArrayAdapter_this = arg;
//    }
//
//    protected performFiltering(prefix:string):Filter.FilterResults  {
//        let results:Filter.FilterResults = new Filter.FilterResults();
//        if (this._ArrayAdapter_this.mOriginalValues == null) {
//            {
//                this._ArrayAdapter_this.mOriginalValues = new ArrayList<T>(this._ArrayAdapter_this.mObjects);
//            }
//        }
//        if (prefix == null || prefix.length() == 0) {
//            let list:ArrayList<T>;
//            {
//                list = new ArrayList<T>(this._ArrayAdapter_this.mOriginalValues);
//            }
//            results.values = list;
//            results.count = list.size();
//        } else {
//            let prefixString:string = prefix.toString().toLowerCase();
//            let values:ArrayList<T>;
//            {
//                values = new ArrayList<T>(this._ArrayAdapter_this.mOriginalValues);
//            }
//            const count:number = values.size();
//            const newValues:ArrayList<T> = new ArrayList<T>();
//            for (let i:number = 0; i < count; i++) {
//                const value:T = values.get(i);
//                const valueText:string = value.toString().toLowerCase();
//                // First match against the whole, non-splitted value
//                if (valueText.startsWith(prefixString)) {
//                    newValues.add(value);
//                } else {
//                    const words:string[] = valueText.split(" ");
//                    const wordCount:number = words.length;
//                    // Start at index 0, in case valueText starts with space(s)
//                    for (let k:number = 0; k < wordCount; k++) {
//                        if (words[k].startsWith(prefixString)) {
//                            newValues.add(value);
//                            break;
//                        }
//                    }
//                }
//            }
//            results.values = newValues;
//            results.count = newValues.size();
//        }
//        return results;
//    }
//
//    protected publishResults(constraint:string, results:Filter.FilterResults):void  {
//        //noinspection unchecked
//        this._ArrayAdapter_this.mObjects = <List<T>> results.values;
//        if (results.count > 0) {
//            this._ArrayAdapter_this.notifyDataSetChanged();
//        } else {
//            this._ArrayAdapter_this.notifyDataSetInvalidated();
//        }
//    }
//}
}

}
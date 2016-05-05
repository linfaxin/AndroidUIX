/*
 * Copyright (C) 2011 The Android Open Source Project
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

///<reference path="../../../database/DataSetObservable.ts"/>
///<reference path="../../../database/Observable.ts"/>
///<reference path="../../../database/DataSetObserver.ts"/>
///<reference path="../../../view/ViewGroup.ts"/>

module android.support.v4.view {

import Observable = android.database.Observable;
import DataSetObservable = android.database.DataSetObservable;
import DataSetObserver = android.database.DataSetObserver;
import ViewGroup = android.view.ViewGroup;
import View = android.view.View;

    /**
     * Base class providing the adapter to populate pages inside of
     * a {@link ViewPager}.  You will most likely want to use a more
     * specific implementation of this, such as
     * {@link android.support.v4.app.FragmentPagerAdapter} or
     * {@link android.support.v4.app.FragmentStatePagerAdapter}.
     *
     * <p>When you implement a PagerAdapter, you must override the following methods
     * at minimum:</p>
     * <ul>
     * <li>{@link #instantiateItem(ViewGroup, int)}</li>
     * <li>{@link #destroyItem(ViewGroup, int, Object)}</li>
     * <li>{@link #getCount()}</li>
     * <li>{@link #isViewFromObject(View, Object)}</li>
     * </ul>
     *
     * <p>PagerAdapter is more general than the adapters used for
     * {@link android.widget.AdapterView AdapterViews}. Instead of providing a
     * View recycling mechanism directly ViewPager uses callbacks to indicate the
     * steps taken during an update. A PagerAdapter may implement a form of View
     * recycling if desired or use a more sophisticated method of managing page
     * Views such as Fragment transactions where each page is represented by its
     * own Fragment.</p>
     *
     * <p>ViewPager associates each page with a key Object instead of working with
     * Views directly. This key is used to track and uniquely identify a given page
     * independent of its position in the adapter. A call to the PagerAdapter method
     * {@link #startUpdate(ViewGroup)} indicates that the contents of the ViewPager
     * are about to change. One or more calls to {@link #instantiateItem(ViewGroup, int)}
     * and/or {@link #destroyItem(ViewGroup, int, Object)} will follow, and the end
     * of an update will be signaled by a call to {@link #finishUpdate(ViewGroup)}.
     * By the time {@link #finishUpdate(ViewGroup) finishUpdate} returns the views
     * associated with the key objects returned by
     * {@link #instantiateItem(ViewGroup, int) instantiateItem} should be added to
     * the parent ViewGroup passed to these methods and the views associated with
     * the keys passed to {@link #destroyItem(ViewGroup, int, Object) destroyItem}
     * should be removed. The method {@link #isViewFromObject(View, Object)} identifies
     * whether a page View is associated with a given key object.</p>
     *
     * <p>A very simple PagerAdapter may choose to use the page Views themselves
     * as key objects, returning them from {@link #instantiateItem(ViewGroup, int)}
     * after creation and adding them to the parent ViewGroup. A matching
     * {@link #destroyItem(ViewGroup, int, Object)} implementation would remove the
     * View from the parent ViewGroup and {@link #isViewFromObject(View, Object)}
     * could be implemented as <code>return view == object;</code>.</p>
     *
     * <p>PagerAdapter supports data set changes. Data set changes must occur on the
     * main thread and must end with a call to {@link #notifyDataSetChanged()} similar
     * to AdapterView adapters derived from {@link android.widget.BaseAdapter}. A data
     * set change may involve pages being added, removed, or changing position. The
     * ViewPager will keep the current page active provided the adapter implements
     * the method {@link #getItemPosition(Object)}.</p>
     */
    export abstract class PagerAdapter {
        private mObservable = new DataSetObservable();
        static POSITION_UNCHANGED = -1;
        static POSITION_NONE = -2;

        /**
         * Return the number of views available.
         */
        abstract getCount():number;

        /**
         * Called when a change in the shown pages is going to start being made.
         * @param container The containing View which is displaying this adapter's
         * * page views.
         */
        startUpdate(container:ViewGroup) {
        }

        /**
         * Create the page for the given position.  The adapter is responsible
         * for adding the view to the container given here, although it only
         * must ensure this is done by the time it returns from
         * [.finishUpdate].

         * @param container The containing View in which the page will be shown.
         * *
         * @param position The page position to be instantiated.
         * *
         * @return Returns an Object representing the new page.  This does not
         * * need to be a View, but can be some other container of the page.
         */
        instantiateItem(container:ViewGroup, position:number):any {
            throw new Error(
                "Required method instantiateItem was not overridden");
        }

        /**
         * Remove a page for the given position.  The adapter is responsible
         * for removing the view from its container, although it only must ensure
         * this is done by the time it returns from [.finishUpdate].

         * @param container The containing View from which the page will be removed.
         * *
         * @param position The page position to be removed.
         * *
         * @param object The same object that was returned by
         * * [.instantiateItem].
         */
        destroyItem(container:ViewGroup, position:number, object:any) {
            throw new Error("Required method destroyItem was not overridden");
        }

        /**
         * Called to inform the adapter of which item is currently considered to
         * be the "primary", that is the one show to the user as the current page.

         * @param container The containing View from which the page will be removed.
         * *
         * @param position The page position that is now the primary.
         * *
         * @param object The same object that was returned by
         * * [.instantiateItem].
         */
        setPrimaryItem(container:ViewGroup, position:number, object:any) {
        }

        /**
         * Called when the a change in the shown pages has been completed.  At this
         * point you must ensure that all of the pages have actually been added or
         * removed from the container as appropriate.
         * @param container The containing View which is displaying this adapter's
         * * page views.
         */
        finishUpdate(container:ViewGroup) {
        }


        /**
         * Determines whether a page View is associated with a specific key object
         * as returned by [.instantiateItem]. This method is
         * required for a PagerAdapter to function properly.

         * @param view Page View to check for association with object
         * *
         * @param object Object to check for association with `view`
         * *
         * @return return true if `view` is associated with the key object object
         */
        abstract isViewFromObject(view:View, object:any):boolean ;


        /**
         * Called when the host view is attempting to determine if an item's position
         * has changed. Returns [.POSITION_UNCHANGED] if the position of the given
         * item has not changed or [.POSITION_NONE] if the item is no longer present
         * in the adapter.

         *
         * The default implementation assumes that items will never
         * change position and always returns [.POSITION_UNCHANGED].

         * @param object Object representing an item, previously returned by a call to
         * *               [.instantiateItem].
         * *
         * @return object's new position index from [0, [.getCount]),
         * *         [.POSITION_UNCHANGED] if the object's position has not changed,
         * *         or [.POSITION_NONE] if the item is no longer present.
         */
        getItemPosition(object:any):number {
            return PagerAdapter.POSITION_UNCHANGED
        }

        /**
         * This method should be called by the application if the data backing this adapter has changed
         * and associated views should update.
         */
        notifyDataSetChanged() {
            this.mObservable.notifyChanged()
        }

        /**
         * Register an observer to receive callbacks related to the adapter's data changing.

         * @param observer The [android.database.DataSetObserver] which will receive callbacks.
         */
        registerDataSetObserver(observer:DataSetObserver) {
            this.mObservable.registerObserver(observer)
        }

        /**
         * Unregister an observer from callbacks related to the adapter's data changing.

         * @param observer The [android.database.DataSetObserver] which will be unregistered.
         */
        unregisterDataSetObserver(observer:DataSetObserver) {
            this.mObservable.unregisterObserver(observer)
        }

        /**
         * This method may be called by the ViewPager to obtain a title string
         * to describe the specified page. This method may return null
         * indicating no title for this page. The default implementation returns
         * null.

         * @param position The position of the title requested
         * *
         * @return A title for the requested page
         */
        getPageTitle(position:number):string {
            return null
        }

        /**
         * Returns the proportional width of a given page as a percentage of the
         * ViewPager's measured width from (0.f-1.f]

         * @param position The position of the page requested
         * *
         * @return Proportional width for the given page position
         */
        getPageWidth(position:number):number {
            return 1;
        }
    }
}
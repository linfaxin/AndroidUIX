/**
 * Created by linfaxin on 15/11/5.
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

export
    abstract
    class PagerAdapter {
        private mObservable = new DataSetObservable();
        static POSITION_UNCHANGED = -1;
        static POSITION_NONE = -2;

        abstract

        /**
         * Return the number of views available.
         */
        getCount():number;

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


        abstract

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
        isViewFromObject(view:View, object:any):boolean ;


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
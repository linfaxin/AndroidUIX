/**
 * Created by linfaxin on 15/11/6.
 */
///<reference path="../../../../android/view/View.ts"/>
///<reference path="../../../../android/view/ViewGroup.ts"/>
///<reference path="../../../../android/support/v4/view/ViewPager.ts"/>
///<reference path="../../../../android/support/v4/view/PagerAdapter.ts"/>

module com.jakewharton.salvage{
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import SparseArray = android.util.SparseArray;
    import ViewPager = android.support.v4.view.ViewPager;
    import PagerAdapter = android.support.v4.view.PagerAdapter;


    /**
     * A {@link PagerAdapter} which behaves like an {@link android.widget.Adapter} with view types and
     * view recycling.
     */
    export abstract class RecyclingPagerAdapter extends PagerAdapter{
        static IGNORE_ITEM_VIEW_TYPE = -1;
        private recycleBin:RecycleBin;
        constructor(){
            super();
            this.recycleBin = new RecycleBin();
            this.recycleBin.setViewTypeCount(this.getViewTypeCount());
        }

        notifyDataSetChanged():void {
            this.recycleBin.scrapActiveViews();
            super.notifyDataSetChanged();
        }

        instantiateItem(container:android.view.ViewGroup, position:number):any {
            let viewType = this.getItemViewType(position);
            let view = null;
            if (viewType != RecyclingPagerAdapter.IGNORE_ITEM_VIEW_TYPE) {
                view = this.recycleBin.getScrapView(position, viewType);
            }
            view = this.getView(position, view, container);
            container.addView(view);
            return view;
        }

        destroyItem(container:android.view.ViewGroup, position:number, object:any):void {
            let view = <View>object;
            container.removeView(view);
            let viewType = this.getItemViewType(position);
            if (viewType != RecyclingPagerAdapter.IGNORE_ITEM_VIEW_TYPE) {
                this.recycleBin.addScrapView(view, position, viewType);
            }
        }

        isViewFromObject(view:android.view.View, object:any):boolean {
            return view === object;
        }

        /**
         * <p>
         * Returns the number of types of Views that will be created by
         * {@link #getView}. Each type represents a set of views that can be
         * converted in {@link #getView}. If the adapter always returns the same
         * type of View for all items, this method should return 1.
         * </p>
         * <p>
         * This method will only be called when when the adapter is set on the
         * the {@link AdapterView}.
         * </p>
         *
         * @return The number of types of Views that will be created by this adapter
         */
        getViewTypeCount():number {
            return 1;
        }

        /**
         * Get the type of View that will be created by {@link #getView} for the specified item.
         *
         * @param position The position of the item within the adapter's data set whose view type we
         *        want.
         * @return An integer representing the type of View. Two views should share the same type if one
         *         can be converted to the other in {@link #getView}. Note: Integers must be in the
         *         range 0 to {@link #getViewTypeCount} - 1. {@link #IGNORE_ITEM_VIEW_TYPE} can
         *         also be returned.
         * @see #IGNORE_ITEM_VIEW_TYPE
         */
        getItemViewType(position:number):number {
            return 0;
        }


        /**
         * Get a View that displays the data at the specified position in the data set. You can either
         * create a View manually or inflate it from an XML layout file. When the View is inflated, the
         * parent View (GridView, ListView...) will apply default layout parameters unless you use
         * {@link android.view.LayoutInflater#inflate(int, android.view.ViewGroup, boolean)}
         * to specify a root view and to prevent attachment to the root.
         *
         * @param position The position of the item within the adapter's data set of the item whose view
         *        we want.
         * @param convertView The old view to reuse, if possible. Note: You should check that this view
         *        is non-null and of an appropriate type before using. If it is not possible to convert
         *        this view to display the correct data, this method can create a new view.
         *        Heterogeneous lists can specify their number of view types, so that this View is
         *        always of the right type (see {@link #getViewTypeCount()} and
         *        {@link #getItemViewType(int)}).
         * @param parent The parent that this view will eventually be attached to
         * @return . A View corresponding to the data at the specified position.
         */
        abstract getView(position:number, convertView:View, parent:ViewGroup):View;

    }


    /**
     * The RecycleBin facilitates reuse of views across layouts. The RecycleBin has two levels of
     * storage: ActiveViews and ScrapViews. ActiveViews are those views which were onscreen at the
     * start of a layout. By construction, they are displaying current information. At the end of
     * layout, all views in ActiveViews are demoted to ScrapViews. ScrapViews are old views that
     * could potentially be used by the adapter to avoid allocating views unnecessarily.
     * <p>
     * This class was taken from Android's implementation of {@link android.widget.AbsListView} which
     * is copyrighted 2006 The Android Open Source Project.
     */
    class RecycleBin{
        private activeViews:View[] = [];
        private activeViewTypes:number[] = [];

        private scrapViews:SparseArray<View>[];
        private viewTypeCount = 0;
        private currentScrapViews:SparseArray<View>;

        setViewTypeCount(viewTypeCount:number) {
            if (viewTypeCount < 1) {
                throw new Error("Can't have a viewTypeCount < 1");
            }
            //noinspection unchecked
            let scrapViews = new Array<SparseArray<View>>(viewTypeCount);
            for (let i = 0; i < viewTypeCount; i++) {
                scrapViews[i] = new SparseArray<View>();
            }
            this.viewTypeCount = viewTypeCount;
            this.currentScrapViews = scrapViews[0];
            this.scrapViews = scrapViews;
        }
        shouldRecycleViewType(viewType:number):boolean {
            return viewType >= 0;
        }
        getScrapView(position:number, viewType:number):View {
            if (this.viewTypeCount == 1) {
                return this.retrieveFromScrap(this.currentScrapViews, position);
            } else if (viewType >= 0 && viewType < this.scrapViews.length) {
                return this.retrieveFromScrap(this.scrapViews[viewType], position);
            }
            return null;
        }
        addScrapView(scrap:View, position:number, viewType:number) {
            if (this.viewTypeCount == 1) {
                this.currentScrapViews.put(position, scrap);
            } else {
                this.scrapViews[viewType].put(position, scrap);
            }
        }
        scrapActiveViews() {
            const activeViews = this.activeViews;
            const activeViewTypes = this.activeViewTypes;
            const multipleScraps = this.viewTypeCount > 1;

            let scrapViews = this.currentScrapViews;
            const count = activeViews.length;
            for (let i = count - 1; i >= 0; i--) {
                const victim = activeViews[i];
                if (victim != null) {
                    let whichScrap = activeViewTypes[i];

                    activeViews[i] = null;
                    activeViewTypes[i] = -1;

                    if (!this.shouldRecycleViewType(whichScrap)) {
                        continue;
                    }

                    if (multipleScraps) {
                        scrapViews = this.scrapViews[whichScrap];
                    }
                    scrapViews.put(i, victim);
                }
            }

            this.pruneScrapViews();
        }

        private pruneScrapViews() {
            const maxViews = this.activeViews.length;
            const viewTypeCount = this.viewTypeCount;
            const scrapViews = this.scrapViews;
            for (let i = 0; i < viewTypeCount; ++i) {
                const scrapPile = scrapViews[i];
                let size = scrapPile.size();
                const extras = size - maxViews;
                size--;
                for (let j = 0; j < extras; j++) {
                    scrapPile.remove(scrapPile.keyAt(size--));
                }
            }
        }
        retrieveFromScrap(scrapViews:SparseArray<View>, position:number):View {
            let size = scrapViews.size();
            if (size > 0) {
                // See if we still have a view for this position.
                for (let i = 0; i < size; i++) {
                    let fromPosition = scrapViews.keyAt(i);
                    let view = scrapViews.get(fromPosition);
                    if (fromPosition == position) {
                        scrapViews.remove(fromPosition);
                        return view;
                    }
                }
                let index = size - 1;
                let r = scrapViews.valueAt(index);
                scrapViews.remove(scrapViews.keyAt(index));
                return r;
            } else {
                return null;
            }
        }
    }
}
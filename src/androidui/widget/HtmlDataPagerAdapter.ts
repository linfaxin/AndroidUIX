/**
 * Created by linfaxin on 15/11/16.
 */

///<reference path="../../android/database/DataSetObservable.ts"/>
///<reference path="../../android/database/Observable.ts"/>
///<reference path="../../android/database/DataSetObserver.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/support/v4/view/ViewPager.ts"/>
///<reference path="../../android/support/v4/view/PagerAdapter.ts"/>

module androidui.widget{

    import Observable = android.database.Observable;
    import DataSetObservable = android.database.DataSetObservable;
    import DataSetObserver = android.database.DataSetObserver;
    import ViewGroup = android.view.ViewGroup;
    import View = android.view.View;
    import ViewPager = android.support.v4.view.ViewPager;
    import PagerAdapter = android.support.v4.view.PagerAdapter;

    export class HtmlDataPagerAdapter extends PagerAdapter implements HtmlDataAdapter{
        static RefElementTag = "ref-element".toUpperCase();
        static RefElementProperty = "RefElement";
        static BindAdapterProperty = "BindAdapter";
        bindElement:HTMLElement;
        rootElement:HTMLElement;

        onInflateAdapter(bindElement:HTMLElement, rootElement:HTMLElement, parent:android.view.ViewGroup):void {
            this.bindElement = bindElement;
            this.rootElement = rootElement;
            if(parent instanceof ViewPager){
                parent.setAdapter(this);
            }
            bindElement[HtmlDataListAdapter.BindAdapterProperty] = this;
            this.registerHtmlDataObserver();
        }

        private registerHtmlDataObserver(){
            const adapter = this;
            function callBack(arr: MutationRecord[], observer: MutationObserver){
                adapter.notifyDataSetChanged();
            }
            let observer:MutationObserver = new MutationObserver(callBack);
            observer.observe(this.bindElement, {childList:true});
        }


        getCount():number {
            return this.bindElement.children.length;
        }

        instantiateItem(container:android.view.ViewGroup, position:number):any {
            let element = this.getItem(position);
            let view:View = element[View.AndroidViewProperty];
            if(!view){
                this.replaceChildWithRef(element);
                view = View.inflate(<HTMLElement>element, this.rootElement, container);
                element[View.AndroidViewProperty] = view;
            }
            container.addView(view);
            return view;
        }

        getItem(position:number):Element{
            let element = this.bindElement.children[position];
            if(element.tagName === HtmlDataListAdapter.RefElementTag){
                element = element[HtmlDataListAdapter.RefElementProperty];
                if(!element) throw Error('Reference element is '+element);
            }
            return element;
        }
        /**
         * create a ref element replace the element
         * @param element
         * @return ref element
         */
        private replaceChildWithRef(element):HTMLElement {
            let refElement = document.createElement(HtmlDataListAdapter.RefElementTag);
            refElement[HtmlDataListAdapter.RefElementProperty] = element;
            this.bindElement.insertBefore(refElement, element);
            this.bindElement.removeChild(element);
            return refElement;
        }

        destroyItem(container:android.view.ViewGroup, position:number, object:any):void {
            let view = <View>object;
            container.removeView(view);
        }

        isViewFromObject(view:android.view.View, object:any):boolean {
            return view === object;
        }

        getItemPosition(object:any):number {
            let position = PagerAdapter.POSITION_NONE;
            if(object==null) return position;
            for(let i=0, count = this.getCount(); i<count; i++){
                if(object === this.bindElement.children[i][View.AndroidViewProperty]){
                    position = i;
                    break;
                }
            }
            return position;
        }
    }
}
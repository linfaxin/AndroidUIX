/**
 * Created by linfaxin on 15/11/16.
 */
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/widget/AbsListView.ts"/>
///<reference path="../../android/widget/ListAdapter.ts"/>
///<reference path="../../android/widget/BaseAdapter.ts"/>
///<reference path="../../android/widget/AdapterView.ts"/>
///<reference path="../../android/widget/SpinnerAdapter.ts"/>
///<reference path="../../android/database/DataSetObservable.ts"/>
///<reference path="../../android/database/DataSetObserver.ts"/>

module androidui.widget{
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import AbsListView = android.widget.AbsListView;
    import ListAdapter = android.widget.ListAdapter;
    import BaseAdapter = android.widget.BaseAdapter;
    import AdapterView = android.widget.AdapterView;
    import SpinnerAdapter = android.widget.SpinnerAdapter;
    import DataSetObservable = android.database.DataSetObservable;
    import DataSetObserver = android.database.DataSetObserver;

    export class HtmlDataListAdapter extends BaseAdapter implements HtmlDataAdapter{
        static RefElementTag = "ref-element".toUpperCase();
        static RefElementProperty = "RefElement";
        static BindAdapterProperty = "BindAdapter";

        bindElementData:HTMLElement;
        rootElement:HTMLElement;

        onInflateAdapter(bindElement:HTMLElement, rootElement:HTMLElement, parent:android.view.ViewGroup):void {
            this.bindElementData = bindElement;
            this.rootElement = rootElement;
            if(parent instanceof AbsListView){
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
            observer.observe(this.bindElementData, {childList:true});
        }


        getItemViewType(position:number):number {
            return AdapterView.ITEM_VIEW_TYPE_IGNORE;
        }

        getView(position:number, convertView:View, parent:ViewGroup):View{
            let element = this.getItem(position);
            let view:View = element[View.AndroidViewProperty];
            this.checkReplaceWithRef(element);
            if(!view){
                view = View.inflate(<HTMLElement>element, this.rootElement, parent);
                element[View.AndroidViewProperty] = view;
            }
            return view;
        }

        getCount():number{
            return this.bindElementData.children.length;
        }

        getItem(position:number):Element{
            let element = this.bindElementData.children[position];
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
        private checkReplaceWithRef(element):HTMLElement {
            let refElement = element[HtmlDataListAdapter.RefElementProperty] || document.createElement(HtmlDataListAdapter.RefElementTag);
            refElement[HtmlDataListAdapter.RefElementProperty] = element;
            element[HtmlDataListAdapter.RefElementProperty] = refElement;
            if(element.parentNode === this.bindElementData) {
                this.bindElementData.insertBefore(refElement, element);
                this.bindElementData.removeChild(element);
            }
            return refElement;
        }

        private removeElementRefAndRestoreToAdapter(elOrRefEl:Element){
            let element:Element;
            let refElement:Element;
            if(elOrRefEl.tagName === HtmlDataListAdapter.RefElementTag){
                element = elOrRefEl[HtmlDataListAdapter.RefElementProperty];
                refElement = elOrRefEl;

            }else if(elOrRefEl[HtmlDataListAdapter.RefElementProperty]){
                refElement = elOrRefEl[HtmlDataListAdapter.RefElementProperty];
                element = elOrRefEl;
            }
            if(element && refElement){
                this.bindElementData.insertBefore(element, refElement);
                this.bindElementData.removeChild(refElement);
            }
        }

        /**
         * restore real element to ref element, so the bindElement's children was origin children
         */
        notifyDataSizeMayChange(){
            for(let i = 0, count=this.bindElementData.children.length; i<count; i++){
                this.removeElementRefAndRestoreToAdapter(this.bindElementData.children[i]);
            }
            this.notifyDataSetChanged();
        }


        getItemId(position:number):number {
            let id:string = this.getItem(position).id;
            let idNumber = Number.parseInt(id);
            if(Number.isInteger(idNumber)) return idNumber;
            return -1;
        }

    }
}
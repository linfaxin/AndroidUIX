/**
 * Created by linfaxin on 15/11/16.
 */
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/widget/AbsListView.ts"/>
///<reference path="../../android/widget/ListAdapter.ts"/>
///<reference path="../../android/widget/BaseAdapter.ts"/>
///<reference path="../../android/widget/SpinnerAdapter.ts"/>
///<reference path="../../android/database/DataSetObservable.ts"/>
///<reference path="../../android/database/DataSetObserver.ts"/>

module androidui.widget{
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import AbsListView = android.widget.AbsListView;
    import ListAdapter = android.widget.ListAdapter;
    import BaseAdapter = android.widget.BaseAdapter;
    import SpinnerAdapter = android.widget.SpinnerAdapter;
    import DataSetObservable = android.database.DataSetObservable;
    import DataSetObserver = android.database.DataSetObserver;

    export class HtmlDataListAdapter extends BaseAdapter implements HtmlDataAdapter{

        bindElement:HTMLElement;
        rootElement:HTMLElement;

        onInflateAdapter(bindElement:HTMLElement, rootElement:HTMLElement, parent:android.view.ViewGroup):void {

            this.bindElement = bindElement;
            this.rootElement = rootElement;
            if(parent instanceof AbsListView){
                parent.setAdapter(this);
            }
            bindElement[View.AndroidViewProperty] = this;
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


        getView(position:number, convertView:View, parent:ViewGroup):View{
            let element = this.getItem(position);
            let view:View = element[View.AndroidViewProperty];
            //if(!view){
                view = View.inflate(<HTMLElement>element.cloneNode(true), this.rootElement, parent);
                //element[View.AndroidViewProperty] = view;
            //}
            return view;
        }


        getCount():number{
            return this.bindElement.children.length;
        }

        getItem(position:number):Element{
            return this.bindElement.children[position]
        }

        getItemId(position:number):number {
            let id:string = this.getItem(position).id;
            let idNumber = Number.parseInt(id);
            if(Number.isInteger(idNumber)) return idNumber;
            return -1;
        }

    }
}
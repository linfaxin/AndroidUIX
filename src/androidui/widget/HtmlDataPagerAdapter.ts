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
        bindElement:HTMLElement;
        rootElement:HTMLElement;

        onInflateAdapter(bindElement:HTMLElement, rootElement:HTMLElement, parent:android.view.ViewGroup):void {
            this.bindElement = bindElement;
            this.rootElement = rootElement;
            if(parent instanceof ViewPager){
                parent.setAdapter(this);
            }
        }


        getCount():number {
            return this.bindElement.children.length;
        }

        instantiateItem(container:android.view.ViewGroup, position:number):any {
            let element = this.bindElement.children[position];
            let view:View = element[View.AndroidViewProperty];
            //if(!view){
                view = View.inflate(<HTMLElement>element.cloneNode(true), this.rootElement, container);
                //element[View.AndroidViewProperty] = view;
            //}
            container.addView(view);
            return view;
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
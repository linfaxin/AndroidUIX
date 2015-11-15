/**
 * Created by linfaxin on 15/10/26.
 */
///<reference path="../../dist/android-ui.d.ts"/>

module sample.activity {
    import Activity = android.app.Activity;
    import TextView = android.widget.TextView;
    import Button = android.widget.Button;
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import LinearLayout = android.widget.LinearLayout;
    import Gravity = android.view.Gravity;
    import Log = android.util.Log;
    import Color = android.graphics.Color;
    import BaseAdapter = android.widget.BaseAdapter;
    import ListView = android.widget.ListView;


    export class SampleListViewActivity extends Activity {
        onCreate():void {
            let listView = <ListView>this.findViewById('listView');
            listView.setAdapter(new MyListAdapter());

        }
    }
    SampleListViewActivity.registerCustomElement();


    class MyListAdapter extends BaseAdapter{
        getView(position:number, convertView:View, parent:ViewGroup):View {
            if(convertView==null){
                convertView = View.inflate('@layout/item', parent.rootElement);
            }
            (<TextView>convertView.findViewById('item_text')).setText(this.getItem(position));
            return convertView;
        }

        getCount():number {
            return 200;
        }

        getItem(position:number):string {
            return (1+position) + '/' + this.getCount();
        }

        getItemId(position:number):number {
            return -1;
        }
    }
}
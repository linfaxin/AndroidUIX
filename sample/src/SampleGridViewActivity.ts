/**
 * Created by linfaxin on 15/10/26.
 */
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>

module sample.app {
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
    import R = sample.app.R;


    export class SampleGridViewActivity extends Activity {
        onCreate():void {
            this.setContentView(R.layout.sample_gridview);

            let listView = <ListView>this.findViewById('gridView');
            listView.setAdapter(new MyAdapter());

        }
    }


    class MyAdapter extends BaseAdapter{
        getView(position:number, convertView:View, parent:ViewGroup):View {
            if(convertView==null){
                convertView = View.inflate(parent.getContext(), R.layout.sample_gridview_item, null);
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
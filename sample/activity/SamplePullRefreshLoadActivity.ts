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
    import PullRefreshLoadLayout = androidui.widget.PullRefreshLoadLayout;


    export class SamplePullRefreshLoadActivity extends Activity {
        onCreate():void {
            let listView = <ListView>this.findViewById('listView');
            let adapter = new MyListAdapter();
            listView.setAdapter(adapter);

            let prll:PullRefreshLoadLayout = <PullRefreshLoadLayout>this.findViewById('prll');

            prll.setRefreshLoadListener({
                onRefresh(prll:PullRefreshLoadLayout):void {
                    setTimeout(()=>{
                        adapter.data =['Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item'];
                        adapter.notifyDataSetChanged();
                        prll.setHeaderState(PullRefreshLoadLayout.State_Header_Normal);
                    }, 1000);
                },
                onLoadMore(prll:PullRefreshLoadLayout):void {
                    setTimeout(()=>{
                        adapter.data.push('Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item');
                        adapter.notifyDataSetChanged();
                        prll.setFooterState(PullRefreshLoadLayout.State_Footer_Normal);
                    }, 1000);
                }
            });
        }
    }
    SamplePullRefreshLoadActivity.registerCustomElement();


    class MyListAdapter extends BaseAdapter{
        data = [];
        getView(position:number, convertView:View, parent:ViewGroup):View {
            if(convertView==null){
                convertView = View.inflate('@layout/item', parent.rootElement);
            }
            (<TextView>convertView.findViewById('item_text')).setText(this.getItem(position));
            return convertView;
        }

        getCount():number {
            return this.data.length;
        }

        getItem(position:number):string {
            return (1+position) + '. ' + this.data[position];
        }

        getItemId(position:number):number {
            return -1;
        }
    }
}
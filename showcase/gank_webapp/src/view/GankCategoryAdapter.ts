/**
 * Created by linfaxin on 16/2/15.
 */

///<reference path="../../androidui-sdk/android-ui.d.ts"/>
///<reference path="../../gen/R.ts"/>

module com.linfaxin.gankwebapp.view {
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
    import Toast = android.widget.Toast;
    import ImageView = android.widget.ImageView;
    import Context = android.content.Context;
    import Intent = android.content.Intent;

    export class GankCategoryAdapter extends BaseAdapter {

        data:Array<ItemModel> = [];

        getView(position:number, convertView:View, parent:ViewGroup):View {
            if(convertView==null){
                convertView = View.inflate(parent.getContext(), R.layout.main_list_item, null);
            }
            let item = this.getItem(position);
            let day = item.publishedAt.split('T')[0];
            (<TextView>convertView.findViewById(R.id.title)).setText(item.desc);
            (<TextView>convertView.findViewById(R.id.summary)).setText(day + ' ' + item.who);
            
            (<ImageView>convertView.findViewById(R.id.imageView)).setVisibility(View.GONE);
            convertView.setOnClickListener({
                onClick(view:View){
                    (<Activity>view.getContext()).startActivity(
                        new Intent("com.linfaxin.gankwebapp.WebViewActivity")
                            .putExtra(WebViewActivity.Extra_Title, item.desc)
                            .putExtra(WebViewActivity.Extra_Url, item.url)
                    );
                }
            });
            return convertView;
        }

        getCount():number {
            return this.data.length;
        }

        getItem(position:number):ItemModel {
            return this.data[position];
        }

        getItemId(position:number):number {
            return -1;
        }
    }

}
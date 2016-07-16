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


    export class GankRefreshLoadListener implements PullRefreshLoadLayout.RefreshLoadListener {
        static ListLoadCount = 20;

        nextLoadingPage = 1;
        category:string;
        adapter:GankFuliListAdapter|GankCategoryAdapter;
        constructor(category:string, adapter:GankFuliListAdapter|GankCategoryAdapter){
            this.category = category;
            this.adapter = adapter;
        }

        onRefresh(prll:PullRefreshLoadLayout):void {
            this.nextLoadingPage = 1;
            this.loadNextPage(prll.getContext()).then((items)=>{
                this.adapter.data = items;
                this.adapter.notifyDataSetChanged();
                prll.setHeaderState(PullRefreshLoadLayout.State_Header_Normal);
                prll.setFooterState(PullRefreshLoadLayout.State_Footer_Normal);//reset footer
            }, ()=>{
                prll.setHeaderState(PullRefreshLoadLayout.State_Header_RefreshFail);
            });
        }

        onLoadMore(prll:PullRefreshLoadLayout):void {
            this.loadNextPage(prll.getContext()).then((items)=>{
                this.adapter.data.push(...items);
                this.adapter.notifyDataSetChanged();
                if(items.length == GankRefreshLoadListener.ListLoadCount){
                    prll.setFooterState(PullRefreshLoadLayout.State_Footer_Normal);
                }else{
                    prll.setFooterState(PullRefreshLoadLayout.State_Footer_NoMoreToLoad);
                }
            }, ()=>{
                prll.setFooterState(PullRefreshLoadLayout.State_Footer_LoadFail);
            });
        }

        private loadNextPage(context:Context){
            let activity = this;
            return new Promise<Array<ItemModel>>((resolve, reject)=>{
                fetch(`http://faxnode.duapp.com/gank_api/data/${encodeURIComponent(this.category)}/${GankRefreshLoadListener.ListLoadCount}/${this.nextLoadingPage}`)
                    .then((response)=>{
                        return response.json();
                    }).then((json)=>{
                    resolve(json.results);
                    this.nextLoadingPage++;
                }).catch((ex)=>{
                    console.error(ex);
                    Toast.makeText(context, '载入失败', Toast.LENGTH_SHORT).show();
                    reject();
                })
            });
        }
    }
}
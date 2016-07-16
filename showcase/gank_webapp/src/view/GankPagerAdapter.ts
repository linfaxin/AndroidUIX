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
    import ViewPager = android.support.v4.view.ViewPager;
    import PagerAdapter = android.support.v4.view.PagerAdapter;
    import ListView = android.widget.ListView;
    import PullRefreshLoadLayout = androidui.widget.PullRefreshLoadLayout;
    import Toast = android.widget.Toast;
    import ImageView = android.widget.ImageView;
    import Context = android.content.Context;

    export class GankPagerAdapter extends PagerAdapter {
        static PagerCategory = ['福利', 'Android', 'iOS', 'App', '前端', '瞎推荐', '拓展资源', '休息视频'];
        static PagerTitle = ['每日', 'Android', 'iOS', 'App', '前端', '瞎推荐', '拓展资源', '休息视频'];

        views:Array<PullRefreshLoadLayout> = [];
        pageShowedFlags:Array<boolean> = [true];//第一页默认已显示
        
        viewPager:ViewPager;
        constructor(viewPager:ViewPager){
            super();
            this.viewPager = viewPager;
            
            const adapter = this;
            viewPager.addOnPageChangeListener({
                onPageScrolled(position: number, positionOffset: number, positionOffsetPixels: number): void{
                    if(adapter.pageShowedFlags[position]) return;
                    adapter.pageShowedFlags[position] = true;
                    adapter.getView(position);//ensure view created
                    //force trigger loading
                    adapter.views[position].setFooterState(PullRefreshLoadLayout.State_Footer_Normal);
                    adapter.views[position].setFooterState(PullRefreshLoadLayout.State_Footer_Loading);
                },
                onPageSelected(position: number): void{
                },
                onPageScrollStateChanged(state: number): void{
                }
            });
        }
        
        private getView(position:number):PullRefreshLoadLayout {
            let prll = this.views[position];

            if (!prll) {
                prll = new PullRefreshLoadLayout(this.viewPager.getContext());
                let listView = new ListView(this.viewPager.getContext());
                prll.addView(listView, -1, -1);

                let isFuli = position == 0;
                let adapter = isFuli ? new GankFuliListAdapter() : new GankCategoryAdapter();

                listView.setAdapter(adapter);

                if(position>0){
                    prll.setFooterState(PullRefreshLoadLayout.State_Footer_Loading);//default loading state before listener set
                }
                prll.setRefreshLoadListener(new GankRefreshLoadListener(GankPagerAdapter.PagerCategory[position], adapter));

                this.views[position] = prll;
            }
            return prll;
        }

        getCount():number {
            return GankPagerAdapter.PagerCategory.length;
        }

        instantiateItem(container:ViewGroup, position:number):View {
            let prll = this.getView(position);
            container.addView(prll, 0);
            return prll;
        }

        destroyItem(container:ViewGroup, position:number, object:any):void {
            container.removeView(<View>object);
        }

        isViewFromObject(view:View, object:any):boolean {
            return view == object;
        }

        getItemPosition(object:any):number {
            return this.views.indexOf(object);
        }

        getPageTitle(position:number):string {
            return GankPagerAdapter.PagerTitle[position];
        }
    }

}
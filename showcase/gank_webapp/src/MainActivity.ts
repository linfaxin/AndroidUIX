
///<reference path="../androidui-sdk/android-ui.d.ts"/>
///<reference path="../gen/R.ts"/>

module com.linfaxin.gankwebapp {
    import Activity = android.app.Activity;
    import ActionBarActivity = android.app.ActionBarActivity;
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
    import ViewPager = android.support.v4.view.ViewPager;


    export class MainActivity extends Activity {
        static AllDataTitle = new Map<string, string>();//<20016-01-01, 标题>


        onCreate(savedInstanceState?:android.os.Bundle):void {
            super.onCreate(savedInstanceState);
            const activity = this;
            this.setTitle('首页');
            this.setContentView(R.layout.activity_main);

            let progressBar = this.findViewById(R.id.progressBar);
            this.initAllDayTitle().then(()=>{
                this.initViewPager();
            }, ()=>{
                Toast.makeText(this, '标题数据获取失败', Toast.LENGTH_SHORT).show();
                //标题数据获取失败也继续展示列表
                this.initViewPager();
            });
            
            let drawerLayout = <android.support.v4.widget.DrawerLayout>this.findViewById(R.id.drawerLayout);
            let btn_menu = this.findViewById(R.id.btn_menu);
            btn_menu.setOnClickListener({
                onClick : function(view){
                    if(drawerLayout.isDrawerOpen(android.view.Gravity.LEFT)){
                        drawerLayout.closeDrawers();
                    }else{
                        drawerLayout.openDrawer(android.view.Gravity.LEFT);
                    }
                }
            });
        }

        private initAllDayTitle(){
            //get http://gank.io/history
            return new Promise<void>((resolve, reject)=>{
                fetch(`http://faxnode.duapp.com/gank_history`)
                    .then((response)=>{
                        return response.json();
                    }).then((json)=>{
                        for(let key in json){
                            MainActivity.AllDataTitle.set(key, json[key]);
                        }
                        resolve();
                    }).catch((ex)=>{
                        console.error(ex);
                        reject();
                    });
            });
        }

        private initViewPager(){
            let progressBar = this.findViewById(R.id.progressBar);
            (<ViewGroup>progressBar.getParent()).removeView(progressBar);
            
            let viewPager = <ViewPager>this.findViewById(R.id.viewPager);
	        viewPager.setAdapter(new view.GankPagerAdapter(viewPager));
            
            let indicator = <view.BorderBottomPagerIndicator>this.findViewById(R.id.indicator);
            indicator.bindViewPager(viewPager);
            indicator.checkFirstChild();
        }

    }


}
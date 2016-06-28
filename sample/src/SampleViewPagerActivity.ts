
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>

module sample.app {
    import Activity = android.app.Activity;
    import ActionBarActivity = android.app.ActionBarActivity;
    import TextView = android.widget.TextView;
    import Button = android.widget.Button;
    import View = android.view.View;
    import LinearLayout = android.widget.LinearLayout;
    import Gravity = android.view.Gravity;
    import Log = android.util.Log;
    import Color = android.graphics.Color;
    import ViewPager = android.support.v4.view.ViewPager;


    export class SampleViewPagerActivity extends ActionBarActivity {
        onCreate():void {
            super.onCreate();
            this.setTitle('ViewPager');
            this.setContentView(R.layout.sample_viewpager);

            let viewPager = <ViewPager>this.findViewById('viewPager');
            viewPager.setAdapter(new MyPageAdapter());
        }
    }


    class MyPageAdapter extends com.jakewharton.salvage.RecyclingPagerAdapter{
        getCount():number {
            return 100;
        }

        getView(position:number, convertView:android.view.View, parent:android.view.ViewGroup):android.view.View {
            if(convertView==null){
                convertView = View.inflate(parent.getContext(), R.layout.sample_viewpager_page, null);
            }
            let page_bg = convertView.findViewById('page_bg');
            let page_text = <TextView>convertView.findViewById('page_text');
            page_bg.setBackgroundColor(Color.rgb(position*20%200 + 50, position*20%200 + 50, position*20%200 + 50));
            page_text.setText((1+position) + '/' + this.getCount());

            return convertView;
        }
    }
}
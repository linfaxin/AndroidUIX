/**
 * Created by linfaxin on 15/10/26.
 */
///<reference path="../../dist/android-web-widget.d.ts"/>

module sample.activity {
    import Activity = android.app.Activity;
    import TextView = android.widget.TextView;
    import Button = android.widget.Button;
    import View = android.view.View;
    import LinearLayout = android.widget.LinearLayout;
    import Gravity = android.view.Gravity;
    import Log = android.util.Log;
    import Color = android.graphics.Color;
    import ViewPager = android.support.v4.view.ViewPager;

    export class SampleViewPagerNormalActivity extends Activity {
        onCreate():void {
            let viewPager = <ViewPager>this.findViewById('viewPager');
            viewPager.setAdapter(new MyPageAdapter());
        }
    }
    SampleViewPagerNormalActivity.registerCustomElement();


    class MyPageAdapter extends com.jakewharton.salvage.RecyclingPagerAdapter{
        getCount():number {
            return 100;
        }

        getView(position:number, convertView:android.view.View, parent:android.view.ViewGroup):android.view.View {
            if(convertView==null){
                let rootElement = parent.rootElement;
                let domTree = <HTMLElement>View.findReference('@layout/page', rootElement);
                convertView = View.inflate(domTree, rootElement);
            }
            let page_bg = convertView.findViewById('page_bg');
            let page_text = <TextView>convertView.findViewById('page_text');
            page_bg.setBackgroundColor(Color.rgb(position*20%255, position*20%255, position*20%255));
            page_text.setText((1+position) + '/' + this.getCount());

            return convertView;
        }
    }
}
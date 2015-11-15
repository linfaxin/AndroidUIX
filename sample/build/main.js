/**
 * Created by linfaxin on 15/10/26.
 */
///<reference path="../../dist/android-ui.d.ts"/>
var sample;
(function (sample) {
    var activity;
    (function (activity) {
        var Activity = android.app.Activity;
        class SampleButtonActivity extends Activity {
            onCreate() {
                let btn_click = this.findViewById('btn_click');
                btn_click.setOnClickListener({
                    onClick(v) {
                        btn_click.setText('点击:' + new Date().getTime() + '');
                    }
                });
                let btn_long_click = this.findViewById('btn_long_click');
                btn_long_click.setOnLongClickListener({
                    onLongClick(v) {
                        btn_long_click.setText('长按:' + new Date().getTime() + '');
                        return true;
                    }
                });
            }
        }
        activity.SampleButtonActivity = SampleButtonActivity;
        SampleButtonActivity.registerCustomElement();
    })(activity = sample.activity || (sample.activity = {}));
})(sample || (sample = {}));
/**
 * Created by linfaxin on 15/10/26.
 */
///<reference path="../../dist/android-ui.d.ts"/>
var sample;
(function (sample) {
    var activity;
    (function (activity) {
        var Activity = android.app.Activity;
        var View = android.view.View;
        var Color = android.graphics.Color;
        class SampleViewPagerActivity extends Activity {
            onCreate() {
                let viewPager = this.findViewById('viewPager');
                viewPager.setAdapter(new MyPageAdapter());
            }
        }
        activity.SampleViewPagerActivity = SampleViewPagerActivity;
        SampleViewPagerActivity.registerCustomElement();
        class MyPageAdapter extends com.jakewharton.salvage.RecyclingPagerAdapter {
            getCount() {
                return 100;
            }
            getView(position, convertView, parent) {
                if (convertView == null) {
                    convertView = View.inflate('@layout/page', parent.rootElement);
                }
                let page_bg = convertView.findViewById('page_bg');
                let page_text = convertView.findViewById('page_text');
                page_bg.setBackgroundColor(Color.rgb(position * 20 % 200 + 50, position * 20 % 200 + 50, position * 20 % 200 + 50));
                page_text.setText((1 + position) + '/' + this.getCount());
                return convertView;
            }
        }
    })(activity = sample.activity || (sample.activity = {}));
})(sample || (sample = {}));
/**
 * Created by linfaxin on 15/10/26.
 */
///<reference path="../../dist/android-ui.d.ts"/>
var sample;
(function (sample) {
    var activity;
    (function (activity) {
        var Activity = android.app.Activity;
        var View = android.view.View;
        var BaseAdapter = android.widget.BaseAdapter;
        class SampleListViewActivity extends Activity {
            onCreate() {
                let listView = this.findViewById('listView');
                listView.setAdapter(new MyListAdapter());
            }
        }
        activity.SampleListViewActivity = SampleListViewActivity;
        SampleListViewActivity.registerCustomElement();
        class MyListAdapter extends BaseAdapter {
            getView(position, convertView, parent) {
                if (convertView == null) {
                    convertView = View.inflate('@layout/item', parent.rootElement);
                }
                convertView.findViewById('item_text').setText(this.getItem(position));
                return convertView;
            }
            getCount() {
                return 200;
            }
            getItem(position) {
                return (1 + position) + '/' + this.getCount();
            }
            getItemId(position) {
                return -1;
            }
        }
    })(activity = sample.activity || (sample.activity = {}));
})(sample || (sample = {}));
///<reference path="../dist/android-ui.d.ts"/>
///<reference path="activity/SampleButtonActivity.ts"/>
///<reference path="activity/SampleViewPagerActivity.ts"/>
///<reference path="activity/SampleListViewActivity.ts"/>
class A {
}
class B {
    constructor() {
        this.A_this.a = '';
    }
}

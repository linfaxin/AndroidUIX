///<reference path="../../dist/android-web-widget.d.ts"/>
var Activity = android.app.Activity;
var TextView = android.widget.TextView;
var LinearLayout = android.widget.LinearLayout;
var Gravity = android.view.Gravity;
var Log = android.util.Log;
var sample;
(function (sample) {
    var activity;
    (function (activity) {
        class TextViewSampleActivity extends Activity {
            onCreate() {
                let linear = this.findViewById("linear");
                linear.setOrientation(LinearLayout.VERTICAL);
                let textView0 = this.findViewById("text0");
                let textView1 = this.findViewById("text1");
                let textView2 = this.findViewById("text2");
                let textView3 = this.findViewById("text3");
                textView0.getLayoutParams().height = -2;
                textView0.getLayoutParams().width = -2;
                textView0.setPadding(20, 20, 20, 20);
                textView1.getLayoutParams().height = -2;
                textView1.getLayoutParams().width = 200;
                textView1.setMaxLines(3);
                textView1.setPadding(20, 20, 20, 20);
                textView1.setGravity(Gravity.RIGHT);
                textView2.getLayoutParams().height = 100;
                textView2.setPadding(20, 20, 20, 20);
                textView2.setGravity(Gravity.RIGHT | Gravity.BOTTOM);
                textView3.getLayoutParams().height = 100;
                textView3.getLayoutParams().width = -2;
                textView3.setPadding(20, 20, 20, 20);
                textView3.setGravity(Gravity.CENTER);
            }
        }
        activity.TextViewSampleActivity = TextViewSampleActivity;
        TextViewSampleActivity.registerCustomElement();
    })(activity = sample.activity || (sample.activity = {}));
})(sample || (sample = {}));
///<reference path="../dist/android-web-widget.d.ts"/>
///<reference path="activity/TextViewSampleActivity.ts"/> 

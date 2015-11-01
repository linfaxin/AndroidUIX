///<reference path="../../dist/android-web-widget.d.ts"/>
var Activity = android.app.Activity;
var TextView = android.widget.TextView;
var View = android.view.View;
var LinearLayout = android.widget.LinearLayout;
var Gravity = android.view.Gravity;
var Log = android.util.Log;
var sample;
(function (sample) {
    var activity;
    (function (activity) {
        class TextViewSampleActivity extends Activity {
            onCreate() {
            }
        }
        activity.TextViewSampleActivity = TextViewSampleActivity;
        TextViewSampleActivity.registerCustomElement();
    })(activity = sample.activity || (sample.activity = {}));
})(sample || (sample = {}));
///<reference path="../dist/android-web-widget.d.ts"/>
///<reference path="activity/TextViewSampleActivity.ts"/>

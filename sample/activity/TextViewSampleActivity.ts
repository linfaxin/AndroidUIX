/**
 * Created by linfaxin on 15/10/26.
 */
///<reference path="../../dist/android-web-widget.d.ts"/>
import Activity = android.app.Activity;
import TextView = android.widget.TextView;
import View = android.view.View;
import LinearLayout = android.widget.LinearLayout;
import Gravity = android.view.Gravity;
import Log = android.util.Log;

module sample.activity {

    export class TextViewSampleActivity extends Activity {
        onCreate():void {
        }
    }
    TextViewSampleActivity.registerCustomElement();
}
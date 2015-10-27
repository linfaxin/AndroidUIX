/**
 * Created by linfaxin on 15/10/26.
 */
///<reference path="../../dist/android-web-widget.d.ts"/>
import Activity = android.app.Activity;
import TextView = android.widget.TextView;
import Gravity = android.view.Gravity;
import Log = android.util.Log;

module sample.activity {
    export class TextViewSampleActivity extends Activity {
        onCreate():void {
            //Log.d("fax", "!onCreate:" + this.constructor.name);
            let textView0:TextView = <TextView>this.findViewById("text0");
            let textView1:TextView = <TextView>this.findViewById("text1");
            let textView2:TextView = <TextView>this.findViewById("text2");
            let textView3:TextView = <TextView>this.findViewById("text3");

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
            textView2.setGravity(Gravity.RIGHT|Gravity.BOTTOM);

            textView3.getLayoutParams().height = 100;
            textView3.getLayoutParams().width = -2;
            textView3.setPadding(20, 20, 20, 20);
            textView3.setGravity(Gravity.CENTER);

        }
    }
    TextViewSampleActivity.registerCustomElement();
}
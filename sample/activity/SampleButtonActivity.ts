/**
 * Created by linfaxin on 15/10/26.
 */
///<reference path="../../dist/android-web-widget.d.ts"/>

module sample.activity {
    import Activity = android.app.Activity;
    import TextView = android.widget.TextView;
    import View = android.view.View;
    import LinearLayout = android.widget.LinearLayout;
    import Gravity = android.view.Gravity;
    import Log = android.util.Log;
    import Color = android.graphics.Color;
    import ColorStateList = android.content.res.ColorStateList;

    export class SampleButtonActivity extends Activity {
        onCreate():void {
        }
    }
    SampleButtonActivity.registerCustomElement();
}
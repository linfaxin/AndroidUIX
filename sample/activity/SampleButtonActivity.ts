/**
 * Created by linfaxin on 15/10/26.
 */
///<reference path="../../dist/android-ui.d.ts"/>

module sample.activity {
    import Activity = android.app.Activity;
    import TextView = android.widget.TextView;
    import Button = android.widget.Button;
    import View = android.view.View;
    import LinearLayout = android.widget.LinearLayout;
    import Gravity = android.view.Gravity;
    import Log = android.util.Log;
    import Color = android.graphics.Color;
    import ColorStateList = android.content.res.ColorStateList;

    export class SampleButtonActivity extends Activity {
        onCreate():void {

            let btn_click:Button = <Button>this.findViewById('btn_click');
            btn_click.setOnClickListener({
                onClick(v:View){
                    btn_click.setText('点击:'+new Date().getTime()+'');
                }
            });

            let btn_long_click:Button = <Button>this.findViewById('btn_long_click');
            btn_long_click.setOnLongClickListener({
                onLongClick(v:View){
                    btn_long_click.setText('长按:'+new Date().getTime()+'');
                    return true;
                }
            });

        }
    }
    SampleButtonActivity.registerCustomElement();
}
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>

module sample.app {
    import Activity = android.app.Activity;
    import Button = android.widget.Button;
    import View = android.view.View;
    import R = sample.app.R;

    export class SampleButtonActivity extends Activity {
        onCreate():void {
            super.onCreate();
            this.setContentView(R.layout.sample_button);

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
}
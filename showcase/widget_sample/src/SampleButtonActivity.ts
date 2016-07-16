///<reference path="../androidui-sdk/android-ui.d.ts"/>
///<reference path="../gen/R.ts"/>

module sample.app {
    import Activity = android.app.Activity;
    import ActionBarActivity = android.app.ActionBarActivity;
    import Button = android.widget.Button;
    import View = android.view.View;


    export class SampleButtonActivity extends ActionBarActivity {
        onCreate():void {
            super.onCreate();
            this.setTitle('Button');

            this.setContentView(R.layout.sample_button);

            let btn_click:Button = <Button>this.findViewById('btn_click');
            btn_click.setOnClickListener({
                onClick(v:View){
                    btn_click.setText('Click:'+new Date().getTime()+'');
                }
            });

            let btn_long_click:Button = <Button>this.findViewById('btn_long_click');
            btn_long_click.setOnLongClickListener({
                onLongClick(v:View){
                    btn_long_click.setText('LongClick:'+new Date().getTime()+'');
                    return true;
                }
            });

        }
    }
}
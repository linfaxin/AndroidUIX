
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R.ts"/>

module sample.app {
    import Activity = android.app.Activity;
    import ActionBarActivity = android.app.ActionBarActivity;


    export class SampleTextViewActivity extends ActionBarActivity {
        onCreate():void {
            super.onCreate();
            this.setTitle('TextView');
            this.setContentView(R.layout.sample_textview);
        }
    }
}
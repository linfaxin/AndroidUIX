
///<reference path="../androidui-sdk/android-ui.d.ts"/>
///<reference path="../gen/R.ts"/>

module sample.app {
    import Activity = android.app.Activity;
    import ActionBarActivity = android.app.ActionBarActivity;


    export class SampleImageViewActivity extends ActionBarActivity {
        onCreate():void {
            super.onCreate();
            this.setTitle('ImageView');
            this.setContentView(R.layout.sample_imageview);
        }
    }
}

///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R.ts"/>

module sample.app {
    import Activity = android.app.Activity;


    import ActionBarActivity = android.app.ActionBarActivity;
    export class SampleViewPagerGalleryActivity extends ActionBarActivity {
        onCreate():void {
            super.onCreate();
            this.setTitle('ImageGallery&Gesture')
            this.setContentView(R.layout.sample_viewpager_gallery);
        }
    }
}
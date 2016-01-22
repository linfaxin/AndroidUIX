
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>

module sample.app {
    import Activity = android.app.Activity;
    import R = sample.app.R;

    import ActionBarActivity = android.app.ActionBarActivity;
    export class SampleViewPagerGalleryActivity extends ActionBarActivity {
        onCreate():void {
            super.onCreate();
            this.setTitle('ImageGallery&Gesture')
            this.setContentView(R.layout.sample_viewpager_gallery);
        }
    }
}
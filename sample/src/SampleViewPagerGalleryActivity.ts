
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>

module sample.app {
    import Activity = android.app.Activity;
    import R = sample.app.R;

    export class SampleViewPagerGalleryActivity extends Activity {
        onCreate():void {
            super.onCreate();
            this.setContentView(R.layout.sample_viewpager_gallery);
        }
    }
}
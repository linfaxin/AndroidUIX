/**
 * Created by linfaxin on 16/2/14.
 */

///<reference path="../androidui-sdk/android-ui.d.ts"/>
///<reference path="../gen/R.ts"/>

module com.linfaxin.gankwebapp {
    import Activity = android.app.Activity;
    import ActionBarActivity = android.app.ActionBarActivity;
    import FrameLayout = android.widget.FrameLayout;
    import ImageView = android.widget.ImageView;
    import PhotoView = uk.co.senab.photoview.PhotoView;
    
    export class PhotoActivity extends Activity{
        protected onCreate(savedInstanceState?:android.os.Bundle):void {
            super.onCreate(savedInstanceState);

            let enterAnim = android.R.anim.grow_fade_in_center;
            enterAnim.setDuration(500);
            let exitAnim = android.R.anim.shrink_fade_out_center;
            exitAnim.setDuration(500);
            this.getWindow().setWindowAnimations(enterAnim, exitAnim, null, null);
            this.getWindow().setFloating(true);


            let photo = new PhotoView(this);
	        photo.setImageURI(this.getIntent().getStringExtra('url'));
            this.setContentView(photo);

            let activity = this;
            photo.setOnPhotoTapListener({
                onPhotoTap(){
                    activity.finish();
                }
            })
        }

    }
}
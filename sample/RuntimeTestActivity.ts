/**
 * Created by linfaxin on 16/2/12.
 */

///<reference path="../dist/android-ui.d.ts"/>
///<reference path="./gen/R/layout.ts"/>
///<reference path="./gen/R/image.ts"/>

module sample.app {
    import Activity = android.app.Activity;
    import ActionBarActivity = android.app.ActionBarActivity;
    import AlertDialog = android.app.AlertDialog;
    import R = sample.app.R;

    export class RuntimeTestActivity extends ActionBarActivity {

        protected onCreate(savedInstanceState?:android.os.Bundle):void {
            super.onCreate(savedInstanceState);

            //this.setContentView(R.layout.activity_main);
            //
            const activity = this;
            //
            //if(navigator.userAgent.match('Android')){
            //    this.findViewById('android_tip').setVisibility(android.view.View.VISIBLE);
            //}
            //
            //right menu icon
            var menu = new android.view.Menu(activity);
            var forkItem = menu.add('Fork me on GitHub');
            var aboutItem = menu.add('About');
            menu.setCallback({
                onMenuItemSelected : function(menu, item){
                    if(item == forkItem){
                        window.location.href = 'https://github.com/linfaxin/AndroidUI4Web';

                    }else if(item == aboutItem){
                        new android.app.AlertDialog.Builder(activity)
                            .setTitle('About')
                            .setMessage('AndroidUI4Web by LinFaXin.')
                            .setPositiveButton(android.R.string_.ok, null)
                            .show();
                    }
                    return true;
                }
            });
            var menuPopupHelper = new android.view.menu.MenuPopupHelper(activity, menu, activity.getActionBar().mActionRight);
            activity.getActionBar().setActionRight('', android.R.image.ic_menu_moreoverflow_normal_holo_dark, {
                onClick : function(view){
                    menuPopupHelper.show();
                }
            });
        }
    }
}
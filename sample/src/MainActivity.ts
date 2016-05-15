/**
 * Created by linfaxin on 16/2/12.
 */

///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
///<reference path="../gen/R/image.ts"/>

module sample.app {
    import Activity = android.app.Activity;
    import ActionBarActivity = android.app.ActionBarActivity;
    import AlertDialog = android.app.AlertDialog;
    import R = sample.app.R;

    export class MainActivity extends ActionBarActivity {

        protected onCreate(savedInstanceState?:android.os.Bundle):void {
            super.onCreate(savedInstanceState);
            const activity = this;

            this.setContentView(R.layout.activity_main);

            if(navigator.userAgent.match('Android')){
                this.findViewById('android_tip').setVisibility(android.view.View.VISIBLE);
            }

            //right menu icon
            var menu = new android.view.Menu(activity);
            var forkItem = menu.add('Fork me on GitHub');
            var aboutItem = menu.add('About');
            menu.setCallback({
                onMenuItemSelected : function(menu, item){
                    if(item == forkItem){
                        window.location.href = 'https://github.com/linfaxin/AndroidUI-WebApp';

                    }else if(item == aboutItem){
                        new android.app.AlertDialog.Builder(activity)
                            .setTitle('About')
                            .setMessage('AndroidU-WebApp by LinFaXin.')
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


        private confirmDialog;
        onBackPressed():void {
            if(!this.confirmDialog) {
                const activity = this;
                this.confirmDialog = new android.app.AlertDialog.Builder(activity)
                    .setTitle('Promt')
                    .setIcon(sample.app.R.image.icon_alert)
                    .setMessage('Exit confirm?')
                    .setNegativeButton(android.R.string_.cancel, null)
                    .setPositiveButton(android.R.string_.ok, {
                        onClick: function (dialog, which) {
                            activity.finish();
                        }
                    }).create();
            }
            this.confirmDialog.show();
        }
    }
}
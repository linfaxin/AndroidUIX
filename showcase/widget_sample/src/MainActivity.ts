/**
 * Created by linfaxin on 16/2/12.
 */

///<reference path="../androidui-sdk/android-ui.d.ts"/>
///<reference path="../gen/R.ts"/>

module sample.app {
    import Activity = android.app.Activity;
    import ActionBarActivity = android.app.ActionBarActivity;
    import AlertDialog = android.app.AlertDialog;


    export class MainActivity extends ActionBarActivity {
        private confirmDialog;

        protected onCreate(savedInstanceState?:android.os.Bundle):void {
            super.onCreate(savedInstanceState);
            const activity = this;

            this.setContentView(R.layout.activity_main);

            if(navigator.userAgent.match('Android')){
                this.findViewById(R.id.android_tip).setVisibility(android.view.View.VISIBLE);
            }

        }

        onCreateOptionsMenu(menu:android.view.Menu):boolean  {
            menu.add(android.view.Menu.NONE, 1, android.view.Menu.NONE, 'Fork me on GitHub');
            menu.add(android.view.Menu.NONE, 2, android.view.Menu.NONE, 'About');
            return true;
        }

        onOptionsItemSelected(item:android.view.MenuItem):boolean  {
            switch (item.getItemId()){
                case 1:
                    window.location.href = 'https://github.com/linfaxin/AndroidUIX';

                case 2:
                    new android.app.AlertDialog.Builder(this)
                        .setTitle('About')
                        .setMessage('Make a high-performance Web App with Android UI!')
                        .setPositiveButton(android.R.string_.ok, null)
                        .show();
            }
            return true;
        }


        onBackPressed():void {
            if(!this.confirmDialog) {
                const activity = this;
                this.confirmDialog = new android.app.AlertDialog.Builder(activity)
                    .setTitle('Promt')
                    .setIcon(R.drawable.icon_alert)
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
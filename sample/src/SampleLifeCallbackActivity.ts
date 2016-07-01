/**
 * Created by linfaxin on 16/1/12.
 */
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R.ts"/>

module sample.app {
    import Activity = android.app.Activity;
    import ActionBarActivity = android.app.ActionBarActivity;
    import Intent = android.content.Intent;
    import View = android.view.View;
    import TextView = android.widget.TextView;
    import Button = android.widget.Button;
    import Log = android.util.Log;
    import Gravity = android.view.Gravity;

    const TAG = 'SampleLifeCallbackActivity';
    export class SampleLifeCallbackActivity extends ActionBarActivity {

        private printTextView:TextView;
        protected onCreate(savedInstanceState:android.os.Bundle):void {
            super.onCreate(savedInstanceState);
            this.setTitle('Activity Life Circel');
            this.setContentView(R.layout.sample_life_callback);


            this.printTextView = <TextView>this.findViewById('console_tv');

            const activity = this;
            this.findViewById('open_activity_normal').setOnClickListener({
                onClick(view:View){
                    activity.startActivity('sample.app.SampleLifeCallbackNormalActivity');
                }
            });
            this.findViewById('open_activity_float').setOnClickListener({
                onClick(view:View){
                    activity.startActivity('sample.app.SampleLifeCallbackFloatingActivity');
                }
            });

            this.print('onCreate');
        }

        private print(message:string):void {
            Log.d(TAG, message);
            this.printTextView.setText(this.printTextView.getText() + '\n' + message);
        }

        protected onStart():void {
            super.onStart();
            this.print('onStart');
        }

        protected onRestart():void {
            super.onRestart();
            this.print('onRestart');
        }

        protected onResume():void {
            super.onResume();
            this.print('onResume\n');
        }

        protected onPause():void {
            super.onPause();
            this.print('onPause');
        }

        protected onStop():void {
            super.onStop();
            this.print('onStop');
        }

        protected onDestroy():void {
            super.onDestroy();
            this.print('onDestroy');
        }
    }

    export class SampleLifeCallbackNormalActivity extends ActionBarActivity{
        protected onCreate(savedInstanceState:android.os.Bundle):void {
            super.onCreate(savedInstanceState);
            this.setTitle('Normal Activity');
            const activity = this;
            
            activity.getActionBar().setActionRight('Home', null, {
                onClick : function(view){
                    activity.startActivity(new Intent('sample.app.MainActivity').setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP));
                }
            });

            let btn = new Button(this);
            btn.setText(android.R.string_.close);
            btn.setOnClickListener({
                onClick(view:View){
                    activity.finish();
                }
            });
            let params = new android.widget.FrameLayout.LayoutParams(-2, -2, Gravity.CENTER);
            this.setContentView(btn, params);
        }
    }

    export class SampleLifeCallbackFloatingActivity extends SampleLifeCallbackNormalActivity{
        protected onCreate(savedInstanceState:android.os.Bundle):void {
            super.onCreate(savedInstanceState);
            this.setTitle('Float Activity');
            this.getActionBar().hide();

            let density = this.getResources().getDisplayMetrics().density;
            this.getWindow().setFloating(true);
            this.getWindow().setLayout(200 * density, 200 * density);
            this.getWindow().setGravity(Gravity.CENTER);
        }
    }
}
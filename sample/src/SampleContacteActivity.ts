/**
 * Created by linfaxin on 16/1/12.
 */
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>

module sample.app {
    import Activity = android.app.Activity;
    import Intent = android.content.Intent;
    import View = android.view.View;
    import TextView = android.widget.TextView;
    import Button = android.widget.Button;
    import Log = android.util.Log;
    import Gravity = android.view.Gravity;

    const TAG = 'SampleContacteActivity';
    export class SampleContacteActivity extends Activity {

        private printTextView:TextView;
        protected onCreate(savedInstanceState:android.os.Bundle):void {
            super.onCreate(savedInstanceState);
            this.setContentView(R.layout.sample_contacte);


            this.printTextView = <TextView>this.findViewById('console_tv');

            const activity = this;
            this.findViewById('open_activity_intent').setOnClickListener({
                onClick(view:View){
                    let intent = new Intent('sample.app.SampleShowIntentActivity').putExtra('startTime', new Date().getTime());
                    activity.startActivity(intent);
                }
            });

            this.findViewById('open_activity_result').setOnClickListener({
                onClick(view:View){
                    let intent = new Intent('sample.app.SampleResultActivity');
                    activity.startActivityForResult(intent, 1);
                }
            });
        }

        private print(message:string):void {
            Log.d(TAG, message);
            this.printTextView.setText(this.printTextView.getText() + '\n' + message);
        }

        protected onActivityResult(requestCode:number, resultCode:number, data:android.content.Intent):void {
            super.onActivityResult(requestCode, resultCode, data);

            if(resultCode === Activity.RESULT_OK){
                if(requestCode === 1){
                    this.print('resultTime:' + data.getStringExtra('resultTime'));
                }
            }
        }
    }

    export class SampleShowIntentActivity extends Activity{
        protected onCreate(savedInstanceState:android.os.Bundle):void {
            super.onCreate(savedInstanceState);

            let info = new TextView(this);
            info.setText('\n startTime： '+this.getIntent().getStringExtra('startTime', null));
            this.addContentView(info, new android.widget.FrameLayout.LayoutParams(-2, -2, Gravity.CENTER));
        }
    }

    export class SampleResultActivity extends Activity{
        protected onCreate(savedInstanceState:android.os.Bundle):void {
            super.onCreate(savedInstanceState);
            const activity = this;

            let btn = new Button(this);
            btn.setText('关闭 & setResult');
            btn.setOnClickListener({
                onClick(view:View){
                    activity.setResult(Activity.RESULT_OK,
                        new Intent().putExtra('resultTime', new Date().getTime()+''));
                    activity.finish();
                }
            })
            let params = new android.widget.FrameLayout.LayoutParams(-2, -2, Gravity.CENTER);
            this.setContentView(btn, params);
        }
    }
}
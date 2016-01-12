
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
///<reference path="../gen/R/image.ts"/>

module sample.app {
    import Activity = android.app.Activity;
    import AlertDialog = android.app.AlertDialog;
    import NetDrawable = androidui.image.NetDrawable;
    import Toast = android.widget.Toast;
    import R = sample.app.R;

    export class SampleBaseWidgetActivity extends Activity {
        onCreate():void {
            super.onCreate();
            let activity = this;
            this.setContentView(R.layout.sample_base_widget);

            let btnOpenDialog = this.findViewById('btn_open_dialog');
            btnOpenDialog.setOnClickListener({
                onClick(view:android.view.View){
                    new AlertDialog.Builder(view.getContext())
                        .setTitle('标题')
                        .setMessage('内容内容\n*支持后退按钮关闭对话框:)')
                        .setPositiveButton(android.R.string_.ok, {
                            onClick(dialog:android.content.DialogInterface, which:number):void{
                                Toast.makeText(activity, '按下确定', Toast.LENGTH_SHORT).show();
                            }
                        })
                        .setIcon(R.image.icon_alert)
                        //.setCancelable(false)
                        .setNegativeButton(android.R.string_.cancel, null)
                        .show();
                }
            });
        }
    }
}
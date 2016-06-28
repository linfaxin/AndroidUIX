
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
///<reference path="../gen/R/image.ts"/>

module sample.app {
    import Activity = android.app.Activity;
    import ActionBarActivity = android.app.ActionBarActivity;
    import AlertDialog = android.app.AlertDialog;
    import NetDrawable = androidui.image.NetDrawable;
    import Toast = android.widget.Toast;
    import TextView = android.widget.TextView;
    import PopupWindow = android.widget.PopupWindow;


    export class SampleBaseWidgetActivity extends ActionBarActivity {
        onCreate():void {
            super.onCreate();
            this.setTitle('Base Widget');

            let activity = this;
            this.setContentView(R.layout.sample_base_widget);

            let btnOpenDialog = this.findViewById('btn_open_dialog');
            btnOpenDialog.setOnClickListener({
                onClick(view:android.view.View){
                    new AlertDialog.Builder(view.getContext())
                        .setTitle('Title')
                        .setMessage('ContentContent')
                        .setPositiveButton(android.R.string_.ok, {
                            onClick(dialog:android.content.DialogInterface, which:number):void{
                                Toast.makeText(activity, android.R.string_.ok, Toast.LENGTH_SHORT).show();
                            }
                        })
                        .setIcon(R.image.icon_alert)
                        //.setCancelable(false)
                        .setNegativeButton(android.R.string_.cancel, null)
                        .show();
                }
            });

            let popupContent = new TextView(this);
            popupContent.setGravity(android.view.Gravity.CENTER);
            popupContent.setText('PopupWindow');
            popupContent.setBackgroundColor(0xffcccccc);
            let popWindow = new PopupWindow(popupContent, -2, 40 * this.getResources().getDisplayMetrics().density, true);
            let btnShowPopup = this.findViewById('btn_show_popup');
            btnShowPopup.setOnClickListener({
                onClick(view:android.view.View){
                    popWindow.showAsDropDown(view);
                }
            });
        }
    }
}
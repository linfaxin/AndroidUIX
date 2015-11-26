/**
 * Created by linfaxin on 15/11/26.
 */
///<reference path="drawable.ts"/>
///<reference path="color.ts"/>
///<reference path="../view/Gravity.ts"/>

module android.R {
    import Gravity = android.view.Gravity;

    export class attr {

        static get buttonStyle() {
            return {
                background: drawable.button_background,
                focusable: true,
                clickable: true,
                textSize: '18sp',
                gravity: Gravity.CENTER
            };
        }

        static get textViewStyle() {
            return {
                textSize: '14sp',
                textColor: color.textView_textColor
            };
        }

        static get gridViewStyle() {
            return {
                numColumns: 1
            };
        }

        static get listViewStyle() {
            return {
                divider: android.R.drawable.list_divider,
                dividerHeight: 1
            };
        }

    }
}
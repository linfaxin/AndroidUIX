/**
 * Created by linfaxin on 15/11/26.
 */
///<reference path="drawable.ts"/>
///<reference path="image.ts"/>
///<reference path="color.ts"/>
///<reference path="../view/Gravity.ts"/>
///<reference path="../view/View.ts"/>
///<reference path="../view/animation/Animation.ts"/>
///<reference path="../content/res/Resources.ts"/>
///<reference path="../graphics/Color.ts"/>
///<reference path="../graphics/drawable/Drawable.ts"/>
///<reference path="../graphics/drawable/InsetDrawable.ts"/>
///<reference path="../graphics/drawable/ColorDrawable.ts"/>
///<reference path="../graphics/drawable/StateListDrawable.ts"/>

module android.R {
    import Gravity = android.view.Gravity;
    import Resources = android.content.res.Resources;
    import Color = android.graphics.Color;
    import Drawable = android.graphics.drawable.Drawable;
    import InsetDrawable = android.graphics.drawable.InsetDrawable;
    import ColorDrawable = android.graphics.drawable.ColorDrawable;
    import StateListDrawable = android.graphics.drawable.StateListDrawable;


    export class attr {

        static _viewStyle:any = {};
        static get viewStyle(){
            return attr._viewStyle;
        }


        static get textViewStyle() {
            return {
                textSize: '14sp',
                layerType: 'software',
                textColor: color.textView_textColor,
                textColorHint: 0xff808080
            };
        }

        static get buttonStyle() {
            return Object.assign(attr.textViewStyle, {
                background: drawable.btn_default,
                focusable: true,
                clickable: true,
                minHeight: '48dp',
                minWidth: '64dp',
                textSize: '18sp',
                gravity: Gravity.CENTER
            });
        }


        static get editTextStyle() {
            return Object.assign(attr.textViewStyle, {
                background: drawable.editbox_background,
                focusable: true,
                focusableInTouchMode: true,
                clickable: true,
                textSize: '18sp',
                gravity: Gravity.CENTER_VERTICAL
            });
        }

        static get imageButtonStyle() {
            return {
                background: drawable.btn_default,
                focusable: true,
                clickable: true,
                gravity: Gravity.CENTER
            };
        }

        static get listViewStyle() {
            return {
                divider: android.R.drawable.list_divider,
                listSelector: android.R.drawable.list_selector_background,
                dividerHeight: 1
            };
        }

        static get scrollViewStyle() {
            return {
                scrollbars: 'vertical',
                fadingEdge: 'vertical',
            };
        }
    }
}
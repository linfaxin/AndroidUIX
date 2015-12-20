/**
 * Created by linfaxin on 15/11/26.
 */
///<reference path="drawable.ts"/>
///<reference path="color.ts"/>
///<reference path="../view/Gravity.ts"/>
///<reference path="../view/View.ts"/>
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
                textColor: color.textView_textColor,
                layerType: 'none'
            };
        }

        static get imageButtonStyle() {
            return {
                background: drawable.button_background,
                focusable: true,
                clickable: true,
                gravity: Gravity.CENTER
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

        static get numberPickerStyle(){
            return {
                orientation : 'vertical',
                solidColor : 'transparent',
                selectionDivider : new ColorDrawable(0xcc33b5e5),
                selectionDividerHeight : '2dp',
                selectionDividersDistance : '48dp',
                internalMinWidth : '64dp',
                internalMaxHeight : '180dp',
                virtualButtonPressedDrawable : (()=>{
                    let stateList = new StateListDrawable();
                    stateList.addState([android.view.View.VIEW_STATE_PRESSED], new ColorDrawable(0x44888888));
                    stateList.addState([android.view.View.VIEW_STATE_PRESSED], new ColorDrawable(0x44888888));
                    stateList.addState([], new ColorDrawable(Color.TRANSPARENT));
                    return stateList;
                })(),
            }
        }

    }
}
/**
 * Created by linfaxin on 15/11/26.
 */
///<reference path="drawable.ts"/>
///<reference path="image.ts"/>
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


        static get textViewStyle() {
            return {
                textSize: '14sp',
                textColor: color.textView_textColor
            };
        }

        static get buttonStyle() {
            return Object.assign(attr.textViewStyle, {
                background: drawable.button_background,
                focusable: true,
                clickable: true,
                textSize: '18sp',
                gravity: Gravity.CENTER
            });
        }

        static get imageButtonStyle() {
            return {
                background: drawable.button_background,
                focusable: true,
                clickable: true,
                gravity: Gravity.CENTER
            };
        }

        static get checkboxStyle() {
            return Object.assign(this.buttonStyle, {
                background: null,
                button: drawable.btn_check
            });
        }

        static get radiobuttonStyle() {
            return Object.assign(this.buttonStyle, {
                background: null,
                button: drawable.btn_radio
            });
        }

        static get checkedTextViewStyle(){
            return {
                textAlignment : 'viewStart'
            }
        }

        static get progressBarStyle() {
            return {
                indeterminateOnly : true,
                indeterminateDrawable : R.drawable.progress_medium_holo,
                indeterminateBehavior : 'repeat',
                indeterminateDuration : 3500,
                minWidth : '48dp',
                maxWidth : '48dp',
                minHeight : '48dp',
                maxHeight : '48dp',
                mirrorForRtl : false,
            };
        }

        static get progressBarStyleHorizontal() {
            return {
                indeterminateOnly : false,
                progressDrawable : R.drawable.progress_horizontal_holo,
                indeterminateDrawable : R.drawable.progress_indeterminate_horizontal_holo,
                indeterminateBehavior : 'repeat',
                indeterminateDuration : 3500,
                minHeight : '20dp',
                maxHeight : '20dp',
                mirrorForRtl : true,
            };
        }

        static get progressBarStyleSmall() {
            return Object.assign(this.progressBarStyle, {
                indeterminateDrawable : R.drawable.progress_small_holo,
                minWidth : '16dp',
                maxWidth : '16dp',
                minHeight : '16dp',
                maxHeight : '16dp'
            });
        }

        static get progressBarStyleLarge() {
            return Object.assign(this.progressBarStyle, {
                indeterminateDrawable : R.drawable.progress_large_holo,
                minWidth : '76dp',
                maxWidth : '76dp',
                minHeight : '76dp',
                maxHeight : '76dp'
            });
        }

        static get seekBarStyle(){
            return {
                indeterminateOnly : false,
                progressDrawable : R.drawable.scrubber_progress_horizontal_holo_light,
                indeterminateDrawable : R.drawable.scrubber_progress_horizontal_holo_light,
                minHeight : '13dp',
                maxHeight : '13dp',
                thumb : R.drawable.scrubber_control_selector_holo,
                thumbOffset : '16dp',
                focusable : true,
                paddingLeft : '16dp',
                paddingRight : '16dp',
                mirrorForRtl : true,
            }
        }

        static get ratingBarStyle(){
            return {
                indeterminateOnly : false,
                progressDrawable : R.drawable.ratingbar_full_holo_light,
                indeterminateDrawable : R.drawable.ratingbar_full_holo_light,
                minHeight : '48dip',
                maxHeight : '48dip',
                numStars : '5',
                stepSize : '0.5',
                thumb : null,
                mirrorForRtl : true,
            }
        }

        static get ratingBarStyleIndicator(){
            return Object.assign(this.ratingBarStyle, {
                indeterminateOnly : false,
                progressDrawable : R.drawable.ratingbar_holo_light,
                indeterminateDrawable : R.drawable.ratingbar_holo_light,
                minHeight : '35dip',
                maxHeight : '35dip',
                thumb : null,
                isIndicator : true,
            })
        }

        static get ratingBarStyleSmall(){
            return Object.assign(this.ratingBarStyle, {
                indeterminateOnly : false,
                progressDrawable : R.drawable.ratingbar_small_holo_light,
                indeterminateDrawable : R.drawable.ratingbar_small_holo_light,
                minHeight : '16dip',
                maxHeight : '16dip',
                thumb : null,
                isIndicator : true,
            })
        }


        static get gridViewStyle() {
            return {
                listSelector: android.R.drawable.list_selector_background,
                numColumns: 1
            };
        }

        static get listViewStyle() {
            return {
                divider: android.R.drawable.list_divider,
                listSelector: android.R.drawable.list_selector_background,
                dividerHeight: 1
            };
        }


        static get expandableListViewStyle() {
            return Object.assign(this.listViewStyle, {
                childDivider: android.R.drawable.list_divider,
            });
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
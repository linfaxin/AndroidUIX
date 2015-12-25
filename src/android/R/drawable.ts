/**
 * Created by linfaxin on 15/11/15.
 */
///<reference path="../view/View.ts"/>
///<reference path="../content/res/Resources.ts"/>
///<reference path="../graphics/Color.ts"/>
///<reference path="../graphics/drawable/Drawable.ts"/>
///<reference path="../graphics/drawable/InsetDrawable.ts"/>
///<reference path="../graphics/drawable/ColorDrawable.ts"/>
///<reference path="../graphics/drawable/StateListDrawable.ts"/>

module android.R{
    import View = android.view.View;
    import Resources = android.content.res.Resources;
    import Color = android.graphics.Color;
    import Drawable = android.graphics.drawable.Drawable;
    import InsetDrawable = android.graphics.drawable.InsetDrawable;
    import ColorDrawable = android.graphics.drawable.ColorDrawable;
    import StateListDrawable = android.graphics.drawable.StateListDrawable;
    import Gravity = android.view.Gravity;
    window.addEventListener('AndroidUILoadFinish', ()=>{
        eval('View = android.view.View;');//real import now
    });


    const density = Resources.getDisplayMetrics().density;
    export class drawable{
        static get button_background():Drawable {
            class DefaultButtonBackgroundDrawable extends InsetDrawable {
                constructor() {
                    super(DefaultButtonBackgroundDrawable.createStateList(), 6 * density);
                }

                private static createStateList():Drawable {
                    let stateList = new StateListDrawable();
                    stateList.addState([View.VIEW_STATE_PRESSED], new ColorDrawable(Color.GRAY));
                    stateList.addState([View.VIEW_STATE_ACTIVATED], new ColorDrawable(Color.GRAY));
                    stateList.addState([View.VIEW_STATE_FOCUSED], new ColorDrawable(0xffaaaaaa));
                    stateList.addState([-View.VIEW_STATE_ENABLED], new ColorDrawable(0xffebebeb));
                    stateList.addState([], new ColorDrawable(Color.LTGRAY));
                    return stateList;
                }

                getPadding(padding:android.graphics.Rect):boolean {
                    let result = super.getPadding(padding);
                    //extra padding to text
                    padding.left += 12 * density;
                    padding.right += 12 * density;
                    padding.top += 6 * density;
                    padding.bottom += 6 * density;
                    return result;
                }

                getIntrinsicWidth():number {
                    return 64*density;
                }

                getIntrinsicHeight():number {
                    return 48*density;
                }
            }
            return new DefaultButtonBackgroundDrawable();
        }

        static get btn_check():Drawable {
            let stateList = new StateListDrawable();
            //Enabled states
            stateList.addState([View.VIEW_STATE_CHECKED, -View.VIEW_STATE_WINDOW_FOCUSED, View.VIEW_STATE_ENABLED], R.image.btn_check_on_holo_light);
            stateList.addState([-View.VIEW_STATE_CHECKED, -View.VIEW_STATE_WINDOW_FOCUSED, View.VIEW_STATE_ENABLED], R.image.btn_check_off_holo_light);

            stateList.addState([View.VIEW_STATE_CHECKED, View.VIEW_STATE_PRESSED, View.VIEW_STATE_ENABLED], R.image.btn_check_on_pressed_holo_light);
            stateList.addState([-View.VIEW_STATE_CHECKED, View.VIEW_STATE_PRESSED, View.VIEW_STATE_ENABLED], R.image.btn_check_off_pressed_holo_light);

            stateList.addState([View.VIEW_STATE_CHECKED, View.VIEW_STATE_FOCUSED, View.VIEW_STATE_ENABLED], R.image.btn_check_on_focused_holo_light);
            stateList.addState([-View.VIEW_STATE_CHECKED, View.VIEW_STATE_FOCUSED, View.VIEW_STATE_ENABLED], R.image.btn_check_off_focused_holo_light);

            stateList.addState([View.VIEW_STATE_CHECKED, View.VIEW_STATE_ENABLED], R.image.btn_check_on_holo_light);
            stateList.addState([-View.VIEW_STATE_CHECKED, View.VIEW_STATE_ENABLED], R.image.btn_check_off_holo_light);

            //Disabled states
            stateList.addState([View.VIEW_STATE_CHECKED, -View.VIEW_STATE_WINDOW_FOCUSED], R.image.btn_check_on_disabled_holo_light);
            stateList.addState([-View.VIEW_STATE_CHECKED, -View.VIEW_STATE_WINDOW_FOCUSED], R.image.btn_check_off_disabled_holo_light);

            stateList.addState([View.VIEW_STATE_CHECKED, View.VIEW_STATE_FOCUSED], R.image.btn_check_on_disabled_focused_holo_light);
            stateList.addState([-View.VIEW_STATE_CHECKED, View.VIEW_STATE_FOCUSED], R.image.btn_check_off_disabled_focused_holo_light);

            stateList.addState([-View.VIEW_STATE_CHECKED], R.image.btn_check_off_disabled_holo_light);
            stateList.addState([View.VIEW_STATE_CHECKED], R.image.btn_check_on_disabled_holo_light);

            return stateList;
        }

        static get btn_radio():Drawable {
            let stateList = new StateListDrawable();
            //Enabled states
            stateList.addState([View.VIEW_STATE_CHECKED, -View.VIEW_STATE_WINDOW_FOCUSED, View.VIEW_STATE_ENABLED], R.image.btn_radio_on_holo_light);
            stateList.addState([-View.VIEW_STATE_CHECKED, -View.VIEW_STATE_WINDOW_FOCUSED, View.VIEW_STATE_ENABLED], R.image.btn_radio_off_holo_light);

            stateList.addState([View.VIEW_STATE_CHECKED, View.VIEW_STATE_PRESSED, View.VIEW_STATE_ENABLED], R.image.btn_radio_on_pressed_holo_light);
            stateList.addState([-View.VIEW_STATE_CHECKED, View.VIEW_STATE_PRESSED, View.VIEW_STATE_ENABLED], R.image.btn_radio_off_pressed_holo_light);

            stateList.addState([View.VIEW_STATE_CHECKED, View.VIEW_STATE_FOCUSED, View.VIEW_STATE_ENABLED], R.image.btn_radio_on_focused_holo_light);
            stateList.addState([-View.VIEW_STATE_CHECKED, View.VIEW_STATE_FOCUSED, View.VIEW_STATE_ENABLED], R.image.btn_radio_off_focused_holo_light);

            stateList.addState([View.VIEW_STATE_CHECKED, View.VIEW_STATE_ENABLED], R.image.btn_radio_on_holo_light);
            stateList.addState([-View.VIEW_STATE_CHECKED, View.VIEW_STATE_ENABLED], R.image.btn_radio_off_holo_light);

            //Disabled states
            stateList.addState([View.VIEW_STATE_CHECKED, -View.VIEW_STATE_WINDOW_FOCUSED], R.image.btn_radio_on_disabled_holo_light);
            stateList.addState([-View.VIEW_STATE_CHECKED, -View.VIEW_STATE_WINDOW_FOCUSED], R.image.btn_radio_off_disabled_holo_light);

            stateList.addState([View.VIEW_STATE_CHECKED, View.VIEW_STATE_FOCUSED], R.image.btn_radio_on_disabled_focused_holo_light);
            stateList.addState([-View.VIEW_STATE_CHECKED, View.VIEW_STATE_FOCUSED], R.image.btn_radio_off_disabled_focused_holo_light);

            stateList.addState([-View.VIEW_STATE_CHECKED], R.image.btn_radio_off_disabled_holo_light);
            stateList.addState([View.VIEW_STATE_CHECKED], R.image.btn_radio_on_disabled_holo_light);

            return stateList;
        }

        static get list_selector_background():Drawable {
            let stateList = new StateListDrawable();
            stateList.addState([View.VIEW_STATE_FOCUSED, -View.VIEW_STATE_ENABLED], new ColorDrawable(0xffebebeb));
            stateList.addState([View.VIEW_STATE_FOCUSED, View.VIEW_STATE_PRESSED], new ColorDrawable(Color.LTGRAY));
            stateList.addState([-View.VIEW_STATE_FOCUSED, View.VIEW_STATE_PRESSED], new ColorDrawable(Color.LTGRAY));
            stateList.addState([View.VIEW_STATE_FOCUSED], new ColorDrawable(0xffaaaaaa));
            stateList.addState([], new ColorDrawable(Color.TRANSPARENT));
            return stateList;
        }

        static get list_divider():Drawable {
            let divider = new ColorDrawable(0xffcccccc);
            return divider;
        }

    }
}
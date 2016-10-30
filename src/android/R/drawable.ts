/**
 * Created by linfaxin on 15/11/15.
 */
///<reference path="../view/View.ts"/>
///<reference path="../content/res/Resources.ts"/>
///<reference path="../graphics/Color.ts"/>
///<reference path="../graphics/drawable/Drawable.ts"/>
///<reference path="../graphics/drawable/InsetDrawable.ts"/>
///<reference path="../graphics/drawable/ColorDrawable.ts"/>
///<reference path="../graphics/drawable/LayerDrawable.ts"/>
///<reference path="../graphics/drawable/RotateDrawable.ts"/>
///<reference path="../graphics/drawable/ScaleDrawable.ts"/>
///<reference path="../graphics/drawable/AnimationDrawable.ts"/>
///<reference path="../graphics/drawable/StateListDrawable.ts"/>
///<reference path="../graphics/drawable/RoundRectDrawable.ts"/>
///<reference path="../graphics/drawable/ShadowDrawable.ts"/>
///<reference path="id.ts"/>


module android.R{
    import Resources = android.content.res.Resources;
    import Color = android.graphics.Color;
    import Drawable = android.graphics.drawable.Drawable;
    import InsetDrawable = android.graphics.drawable.InsetDrawable;
    import ColorDrawable = android.graphics.drawable.ColorDrawable;
    import LayerDrawable = android.graphics.drawable.LayerDrawable;
    import RotateDrawable = android.graphics.drawable.RotateDrawable;
    import ScaleDrawable = android.graphics.drawable.ScaleDrawable;
    import AnimationDrawable = android.graphics.drawable.AnimationDrawable;
    import StateListDrawable = android.graphics.drawable.StateListDrawable;
    import RoundRectDrawable = android.graphics.drawable.RoundRectDrawable;
    import ShadowDrawable = android.graphics.drawable.ShadowDrawable;
    import Gravity = android.view.Gravity;

    const density = Resources.getDisplayMetrics().density;
    export class drawable {
        static get btn_default():Drawable {
            let stateList = new StateListDrawable();
            stateList.addState([-android.view.View.VIEW_STATE_WINDOW_FOCUSED, android.view.View.VIEW_STATE_ENABLED], R.image.btn_default_normal_holo_light);
            stateList.addState([-android.view.View.VIEW_STATE_WINDOW_FOCUSED, -android.view.View.VIEW_STATE_ENABLED], R.image.btn_default_disabled_holo_light);
            stateList.addState([android.view.View.VIEW_STATE_PRESSED], R.image.btn_default_pressed_holo_light);
            stateList.addState([android.view.View.VIEW_STATE_FOCUSED, android.view.View.VIEW_STATE_ENABLED], R.image.btn_default_focused_holo_light);
            stateList.addState([android.view.View.VIEW_STATE_ENABLED], R.image.btn_default_normal_holo_light);
            stateList.addState([android.view.View.VIEW_STATE_FOCUSED], R.image.btn_default_disabled_focused_holo_light);
            stateList.addState([], R.image.btn_default_disabled_holo_light);
            return stateList;
        }

        static get editbox_background():Drawable {
            let stateList = new StateListDrawable();
            stateList.addState([android.view.View.VIEW_STATE_FOCUSED], R.image.editbox_background_focus_yellow);
            stateList.addState([], R.image.editbox_background_normal);
            return stateList;
        }

        static get list_selector_background():Drawable {
            return this.item_background;
        }

        static get list_divider():Drawable {
            let divider = new ColorDrawable(0xffcccccc);
            return divider;
        }

        static get divider_vertical():Drawable {
            return this.divider_horizontal;
        }

        static get divider_horizontal():Drawable {
            let divider = new ColorDrawable(0xffdddddd);
            divider.getIntrinsicWidth = ()=> 1;
            divider.getIntrinsicHeight = ()=> 1;
            return divider;
        }

        static get item_background(){
            let stateList = new StateListDrawable();
            stateList.addState([android.view.View.VIEW_STATE_FOCUSED, -android.view.View.VIEW_STATE_ENABLED], new ColorDrawable(0xffebebeb));
            stateList.addState([android.view.View.VIEW_STATE_FOCUSED, android.view.View.VIEW_STATE_PRESSED], new ColorDrawable(0x88888888));
            stateList.addState([-android.view.View.VIEW_STATE_FOCUSED, android.view.View.VIEW_STATE_PRESSED], new ColorDrawable(0x88888888));
            stateList.addState([android.view.View.VIEW_STATE_FOCUSED], new ColorDrawable(0xffaaaaaa));
            stateList.addState([], new ColorDrawable(Color.TRANSPARENT));
            return stateList;
        }

        static get toast_frame(){
            let bg = new RoundRectDrawable(0xff333333, 2 * density,  2 * density,  2 * density,  2 * density);
            bg.getIntrinsicHeight = ()=> 32 * density;
            bg.getPadding = (rect)=>{
                rect.set(12 * density, 6 * density, 12 * density, 6 * density);
                return true;
            };
            let shadow = new ShadowDrawable(bg, 5 * density, 0, 2 * density, 0x44000000);
            return new InsetDrawable(shadow, 7 * density);//more space show shadow
        }

    }
}
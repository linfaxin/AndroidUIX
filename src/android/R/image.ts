///<reference path="../../androidui/image/NetImage.ts"/>
///<reference path="../../androidui/image/NetDrawable.ts"/>
///<reference path="../../androidui/image/RegionImageDrawable.ts"/>
///<reference path="../../androidui/image/OverrideSizeDrawable.ts"/>
///<reference path="image_base64.ts"/>


module android.R {
    import NetImage = androidui.image.NetImage;
    import NetDrawable = androidui.image.NetDrawable;
    import RegionImageDrawable = androidui.image.RegionImageDrawable;
    import OverrideSizeDrawable = androidui.image.ChangeImageSizeDrawable;
    import Rect = android.graphics.Rect;

    const density = android.content.res.Resources.getDisplayMetrics().density;

    export class image{
        static get btn_check_off_disabled_focused_holo_light(){return new NetDrawable(image_base64.x3.btn_check_off_disabled_focused_holo_light, null, null, 3);}
        static get btn_check_off_disabled_holo_light(){return new NetDrawable(image_base64.x3.btn_check_off_disabled_holo_light, null, null, 3);}
        static get btn_check_off_focused_holo_light(){return new NetDrawable(image_base64.x3.btn_check_off_focused_holo_light, null, null, 3);}
        static get btn_check_off_holo_light(){return new NetDrawable(image_base64.x3.btn_check_off_holo_light, null, null, 3);}
        static get btn_check_off_pressed_holo_light(){return new NetDrawable(image_base64.x3.btn_check_off_pressed_holo_light, null, null, 3);}
        static get btn_check_on_disabled_focused_holo_light(){return new NetDrawable(image_base64.x3.btn_check_on_disabled_focused_holo_light, null, null, 3);}
        static get btn_check_on_disabled_holo_light(){return new NetDrawable(image_base64.x3.btn_check_on_disabled_holo_light, null, null, 3);}
        static get btn_check_on_focused_holo_light(){return new NetDrawable(image_base64.x3.btn_check_on_focused_holo_light, null, null, 3);}
        static get btn_check_on_holo_light(){return new NetDrawable(image_base64.x3.btn_check_on_holo_light, null, null, 3);}
        static get btn_check_on_pressed_holo_light(){return new NetDrawable(image_base64.x3.btn_check_on_pressed_holo_light, null, null, 3);}
        static get btn_radio_off_disabled_focused_holo_light(){return new NetDrawable(image_base64.x3.btn_radio_off_disabled_focused_holo_light, null, null, 3);}
        static get btn_radio_off_disabled_holo_light(){return new NetDrawable(image_base64.x3.btn_radio_off_disabled_holo_light, null, null, 3);}
        static get btn_radio_off_focused_holo_light(){return new NetDrawable(image_base64.x3.btn_radio_off_focused_holo_light, null, null, 3);}
        static get btn_radio_off_holo_light(){return new NetDrawable(image_base64.x3.btn_radio_off_holo_light, null, null, 3);}
        static get btn_radio_off_pressed_holo_light(){return new NetDrawable(image_base64.x3.btn_radio_off_pressed_holo_light, null, null, 3);}
        static get btn_radio_on_disabled_focused_holo_light(){return new NetDrawable(image_base64.x3.btn_radio_on_disabled_focused_holo_light, null, null, 3);}
        static get btn_radio_on_disabled_holo_light(){return new NetDrawable(image_base64.x3.btn_radio_on_disabled_holo_light, null, null, 3);}
        static get btn_radio_on_focused_holo_light(){return new NetDrawable(image_base64.x3.btn_radio_on_focused_holo_light, null, null, 3);}
        static get btn_radio_on_holo_light(){return new NetDrawable(image_base64.x3.btn_radio_on_holo_light, null, null, 3);}
        static get btn_radio_on_pressed_holo_light(){return new NetDrawable(image_base64.x3.btn_radio_on_pressed_holo_light, null, null, 3);}
        static get progressbar_indeterminate_holo1(){return new NetDrawable(image_base64.x3.progressbar_indeterminate_holo1, null, null, 3);}
        static get progressbar_indeterminate_holo2(){return new NetDrawable(image_base64.x3.progressbar_indeterminate_holo2, null, null, 3);}
        static get progressbar_indeterminate_holo3(){return new NetDrawable(image_base64.x3.progressbar_indeterminate_holo3, null, null, 3);}
        static get progressbar_indeterminate_holo4(){return new NetDrawable(image_base64.x3.progressbar_indeterminate_holo4, null, null, 3);}
        static get progressbar_indeterminate_holo5(){return new NetDrawable(image_base64.x3.progressbar_indeterminate_holo5, null, null, 3);}
        static get progressbar_indeterminate_holo6(){return new NetDrawable(image_base64.x3.progressbar_indeterminate_holo6, null, null, 3);}
        static get progressbar_indeterminate_holo7(){return new NetDrawable(image_base64.x3.progressbar_indeterminate_holo7, null, null, 3);}
        static get progressbar_indeterminate_holo8(){return new NetDrawable(image_base64.x3.progressbar_indeterminate_holo8, null, null, 3);}
        static get rate_star_big_half_holo_light(){return new NetDrawable(image_base64.x3.rate_star_big_half_holo_light, null, null, 3);}
        static get rate_star_big_off_holo_light(){return new NetDrawable(image_base64.x3.rate_star_big_off_holo_light, null, null, 3);}
        static get rate_star_big_on_holo_light(){return new NetDrawable(image_base64.x3.rate_star_big_on_holo_light, null, null, 3);}
        static get scrubber_control_disabled_holo(){return new NetDrawable(image_base64.x3.scrubber_control_disabled_holo, null, null, 3);}
        static get scrubber_control_focused_holo(){return new NetDrawable(image_base64.x3.scrubber_control_focused_holo, null, null, 3);}
        static get scrubber_control_normal_holo(){return new NetDrawable(image_base64.x3.scrubber_control_normal_holo, null, null, 3);}
        static get scrubber_control_pressed_holo(){return new NetDrawable(image_base64.x3.scrubber_control_pressed_holo, null, null, 3);}
        static get spinner_76_inner_holo(){return new NetDrawable(image_base64.x3.spinner_76_inner_holo, null, null, 3);}
        static get spinner_76_outer_holo(){return new NetDrawable(image_base64.x3.spinner_76_outer_holo, null, null, 3);}

        //scale images
        static get spinner_48_outer_holo(){ return new OverrideSizeDrawable(image.spinner_76_outer_holo, 48 * density, 48 * density)}
        static get spinner_48_inner_holo(){ return new OverrideSizeDrawable(image.spinner_76_inner_holo, 48 * density, 48 * density)}
        static get spinner_16_outer_holo(){ return new OverrideSizeDrawable(image.spinner_76_outer_holo, 16 * density, 16 * density)}
        static get spinner_16_inner_holo(){ return new OverrideSizeDrawable(image.spinner_76_inner_holo, 16 * density, 16 * density)}
    }


}
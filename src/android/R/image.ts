///<reference path="../../androidui/image/NetDrawable.ts"/>
///<reference path="../../androidui/image/NinePatchDrawable.ts"/>
///<reference path="../../androidui/image/ChangeImageSizeDrawable.ts"/>
///<reference path="image_base64.ts"/>
module android.R {
    import NetDrawable = androidui.image.NetDrawable;
    import ChangeImageSizeDrawable = androidui.image.ChangeImageSizeDrawable;
    import NinePatchDrawable = androidui.image.NinePatchDrawable;

    const density = android.content.res.Resources.getDisplayMetrics().density;
    export class image{

        static get actionbar_ic_back_white(){return new NetDrawable(image_base64.actionbar_ic_back_white)}
        static get btn_check_off_disabled_focused_holo_light(){return new NetDrawable(image_base64.btn_check_off_disabled_focused_holo_light)}
        static get btn_check_off_disabled_holo_light(){return new NetDrawable(image_base64.btn_check_off_disabled_holo_light)}
        static get btn_check_off_focused_holo_light(){return new NetDrawable(image_base64.btn_check_off_focused_holo_light)}
        static get btn_check_off_holo_light(){return new NetDrawable(image_base64.btn_check_off_holo_light)}
        static get btn_check_off_pressed_holo_light(){return new NetDrawable(image_base64.btn_check_off_pressed_holo_light)}
        static get btn_check_on_disabled_focused_holo_light(){return new NetDrawable(image_base64.btn_check_on_disabled_focused_holo_light)}
        static get btn_check_on_disabled_holo_light(){return new NetDrawable(image_base64.btn_check_on_disabled_holo_light)}
        static get btn_check_on_focused_holo_light(){return new NetDrawable(image_base64.btn_check_on_focused_holo_light)}
        static get btn_check_on_holo_light(){return new NetDrawable(image_base64.btn_check_on_holo_light)}
        static get btn_check_on_pressed_holo_light(){return new NetDrawable(image_base64.btn_check_on_pressed_holo_light)}
        static get btn_default_disabled_focused_holo_light(){return new NinePatchDrawable(image_base64.btn_default_disabled_focused_holo_light)}
        static get btn_default_disabled_holo_light(){return new NinePatchDrawable(image_base64.btn_default_disabled_holo_light)}
        static get btn_default_focused_holo_light(){return new NinePatchDrawable(image_base64.btn_default_focused_holo_light)}
        static get btn_default_normal_holo_light(){return new NinePatchDrawable(image_base64.btn_default_normal_holo_light)}
        static get btn_default_pressed_holo_light(){return new NinePatchDrawable(image_base64.btn_default_pressed_holo_light)}
        static get btn_radio_off_disabled_focused_holo_light(){return new NetDrawable(image_base64.btn_radio_off_disabled_focused_holo_light)}
        static get btn_radio_off_disabled_holo_light(){return new NetDrawable(image_base64.btn_radio_off_disabled_holo_light)}
        static get btn_radio_off_focused_holo_light(){return new NetDrawable(image_base64.btn_radio_off_focused_holo_light)}
        static get btn_radio_off_holo_light(){return new NetDrawable(image_base64.btn_radio_off_holo_light)}
        static get btn_radio_off_pressed_holo_light(){return new NetDrawable(image_base64.btn_radio_off_pressed_holo_light)}
        static get btn_radio_on_disabled_focused_holo_light(){return new NetDrawable(image_base64.btn_radio_on_disabled_focused_holo_light)}
        static get btn_radio_on_disabled_holo_light(){return new NetDrawable(image_base64.btn_radio_on_disabled_holo_light)}
        static get btn_radio_on_focused_holo_light(){return new NetDrawable(image_base64.btn_radio_on_focused_holo_light)}
        static get btn_radio_on_holo_light(){return new NetDrawable(image_base64.btn_radio_on_holo_light)}
        static get btn_radio_on_pressed_holo_light(){return new NetDrawable(image_base64.btn_radio_on_pressed_holo_light)}
        static get btn_rating_star_off_normal_holo_light(){return new NetDrawable(image_base64.btn_rating_star_off_normal_holo_light)}
        static get btn_rating_star_off_pressed_holo_light(){return new NetDrawable(image_base64.btn_rating_star_off_pressed_holo_light)}
        static get btn_rating_star_on_normal_holo_light(){return new NetDrawable(image_base64.btn_rating_star_on_normal_holo_light)}
        static get btn_rating_star_on_pressed_holo_light(){return new NetDrawable(image_base64.btn_rating_star_on_pressed_holo_light)}
        static get dropdown_background_dark(){return new NinePatchDrawable(image_base64.dropdown_background_dark)}
        static get editbox_background_focus_yellow(){return new NinePatchDrawable(image_base64.editbox_background_focus_yellow)}
        static get editbox_background_normal(){return new NinePatchDrawable(image_base64.editbox_background_normal)}
        static get ic_menu_moreoverflow_normal_holo_dark(){return new NetDrawable(image_base64.ic_menu_moreoverflow_normal_holo_dark)}
        static get menu_panel_holo_dark(){return new NinePatchDrawable(image_base64.menu_panel_holo_dark)}
        static get menu_panel_holo_light(){return new NinePatchDrawable(image_base64.menu_panel_holo_light)}
        static get progressbar_indeterminate_holo1(){return new NetDrawable(image_base64.progressbar_indeterminate_holo1)}
        static get progressbar_indeterminate_holo2(){return new NetDrawable(image_base64.progressbar_indeterminate_holo2)}
        static get progressbar_indeterminate_holo3(){return new NetDrawable(image_base64.progressbar_indeterminate_holo3)}
        static get progressbar_indeterminate_holo4(){return new NetDrawable(image_base64.progressbar_indeterminate_holo4)}
        static get progressbar_indeterminate_holo5(){return new NetDrawable(image_base64.progressbar_indeterminate_holo5)}
        static get progressbar_indeterminate_holo6(){return new NetDrawable(image_base64.progressbar_indeterminate_holo6)}
        static get progressbar_indeterminate_holo7(){return new NetDrawable(image_base64.progressbar_indeterminate_holo7)}
        static get progressbar_indeterminate_holo8(){return new NetDrawable(image_base64.progressbar_indeterminate_holo8)}
        static get rate_star_big_half_holo_light(){return new NetDrawable(image_base64.rate_star_big_half_holo_light)}
        static get rate_star_big_off_holo_light(){return new NetDrawable(image_base64.rate_star_big_off_holo_light)}
        static get rate_star_big_on_holo_light(){return new NetDrawable(image_base64.rate_star_big_on_holo_light)}
        static get scrubber_control_disabled_holo(){return new NetDrawable(image_base64.scrubber_control_disabled_holo)}
        static get scrubber_control_focused_holo(){return new NetDrawable(image_base64.scrubber_control_focused_holo)}
        static get scrubber_control_normal_holo(){return new NetDrawable(image_base64.scrubber_control_normal_holo)}
        static get scrubber_control_pressed_holo(){return new NetDrawable(image_base64.scrubber_control_pressed_holo)}
        static get spinner_76_inner_holo(){return new NetDrawable(image_base64.spinner_76_inner_holo)}
        static get spinner_76_outer_holo(){return new NetDrawable(image_base64.spinner_76_outer_holo)}

        //scale images
        static get spinner_48_outer_holo(){ return new ChangeImageSizeDrawable(image.spinner_76_outer_holo, 48 * density, 48 * density)}
        static get spinner_48_inner_holo(){ return new ChangeImageSizeDrawable(image.spinner_76_inner_holo, 48 * density, 48 * density)}
        static get spinner_16_outer_holo(){ return new ChangeImageSizeDrawable(image.spinner_76_outer_holo, 16 * density, 16 * density)}
        static get spinner_16_inner_holo(){ return new ChangeImageSizeDrawable(image.spinner_76_inner_holo, 16 * density, 16 * density)}

        static get rate_star_small_off_holo_light(){ return new ChangeImageSizeDrawable(image.rate_star_big_half_holo_light, 16 * density, 16 * density)}
        static get rate_star_small_half_holo_light(){ return new ChangeImageSizeDrawable(image.rate_star_big_off_holo_light, 16 * density, 16 * density)}
        static get rate_star_small_on_holo_light(){ return new ChangeImageSizeDrawable(image.rate_star_big_on_holo_light, 16 * density, 16 * density)}
    }
}
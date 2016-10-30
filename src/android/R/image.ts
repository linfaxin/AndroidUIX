///<reference path="../../androidui/image/NetDrawable.ts"/>
///<reference path="../../androidui/image/NinePatchDrawable.ts"/>
///<reference path="image_base64.ts"/>
module android.R {
    import NetDrawable = androidui.image.NetDrawable;
    import NinePatchDrawable = androidui.image.NinePatchDrawable;

    const density = android.content.res.Resources.getDisplayMetrics().density;
    export class image{

        static get btn_default_disabled_focused_holo_light(){return new NinePatchDrawable(image_base64.btn_default_disabled_focused_holo_light)}
        static get btn_default_disabled_holo_light(){return new NinePatchDrawable(image_base64.btn_default_disabled_holo_light)}
        static get btn_default_focused_holo_light(){return new NinePatchDrawable(image_base64.btn_default_focused_holo_light)}
        static get btn_default_normal_holo_light(){return new NinePatchDrawable(image_base64.btn_default_normal_holo_light)}
        static get btn_default_pressed_holo_light(){return new NinePatchDrawable(image_base64.btn_default_pressed_holo_light)}
        static get editbox_background_focus_yellow(){return new NinePatchDrawable(image_base64.editbox_background_focus_yellow)}
        static get editbox_background_normal(){return new NinePatchDrawable(image_base64.editbox_background_normal)}
        static get popup_bottom_bright(){return new NinePatchDrawable(image_base64.popup_bottom_bright)}
        static get popup_center_bright(){return new NinePatchDrawable(image_base64.popup_center_bright)}
        static get popup_full_bright(){return new NinePatchDrawable(image_base64.popup_full_bright)}
        static get popup_top_bright(){return new NinePatchDrawable(image_base64.popup_top_bright)}

    }
}
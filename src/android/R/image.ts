///<reference path="../../androidui/image/NetImage.ts"/>
///<reference path="../../androidui/image/RegionImageDrawable.ts"/>
///<reference path="image_base64.ts"/>


module android.R {
    import NetImage = androidui.image.NetImage;
    import RegionImageDrawable = androidui.image.RegionImageDrawable;
    import Rect = android.graphics.Rect;
    const netImage = new NetImage(image_base64.x3, null, null, 3);
    export class image{
        static btn_check_off_disabled_focused_holo_light = new RegionImageDrawable(netImage, new Rect(96, 0, 96+96, 0+96));
        static btn_check_off_focused_holo_light = new RegionImageDrawable(netImage, new Rect(0, 96, 0+96, 96+96));
        static btn_check_off_holo_light = new RegionImageDrawable(netImage, new Rect(96, 96, 96+96, 96+96));
        static btn_check_off_pressed_holo_light = new RegionImageDrawable(netImage, new Rect(192, 0, 192+96, 0+96));
        static btn_check_on_disabled_focused_holo_light = new RegionImageDrawable(netImage, new Rect(192, 96, 192+96, 96+96));
        static btn_check_on_disabled_holo_light = new RegionImageDrawable(netImage, new Rect(0, 192, 0+96, 192+96));
        static btn_check_on_focused_holo_light = new RegionImageDrawable(netImage, new Rect(96, 192, 96+96, 192+96));
        static btn_check_on_holo_light = new RegionImageDrawable(netImage, new Rect(192, 192, 192+96, 192+96));
        static btn_check_on_pressed_holo_light = new RegionImageDrawable(netImage, new Rect(288, 0, 288+96, 0+96));
        static btn_check_off_disabled_holo_light = new RegionImageDrawable(netImage, new Rect(288, 96, 288+96, 96+96));
        static btn_radio_off_disabled_focused_holo_light = new RegionImageDrawable(netImage, new Rect(0, 0, 0+96, 0+96));
        static btn_radio_off_disabled_holo_light = new RegionImageDrawable(netImage, new Rect(288, 192, 288+96, 192+96));
        static btn_radio_off_focused_holo_light = new RegionImageDrawable(netImage, new Rect(0, 288, 0+96, 288+96));
        static btn_radio_off_holo_light = new RegionImageDrawable(netImage, new Rect(96, 288, 96+96, 288+96));
        static btn_radio_off_pressed_holo_light = new RegionImageDrawable(netImage, new Rect(192, 288, 192+96, 288+96));
        static btn_radio_on_disabled_focused_holo_light = new RegionImageDrawable(netImage, new Rect(288, 288, 288+96, 288+96));
        static btn_radio_on_disabled_holo_light = new RegionImageDrawable(netImage, new Rect(384, 0, 384+96, 0+96));
        static btn_radio_on_focused_holo_light = new RegionImageDrawable(netImage, new Rect(384, 96, 384+96, 96+96));
        static btn_radio_on_holo_light = new RegionImageDrawable(netImage, new Rect(384, 192, 384+96, 192+96));
        static btn_radio_on_pressed_holo_light = new RegionImageDrawable(netImage, new Rect(384, 288, 384+96, 288+96));

    }


}
///<reference path="../../../dist/android-ui.d.ts"/>
///<reference path="image_base64.ts"/>
module sample.app.R {
    import NetDrawable = androidui.image.NetDrawable;
    export class image{

        static get icon_alert(){return new NetDrawable(image_base64.icon_alert)}
    }
    android.content.res.Resources.buildDrawableFinder = (refString:string)=>{
        return image[refString];
    }
}
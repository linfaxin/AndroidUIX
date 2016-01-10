///<reference path="../../../dist/android-ui.d.ts"/>
///<reference path="image_base64.ts"/>
module sample.app.R.image {
    import NetDrawable = androidui.image.NetDrawable;
    export class image{

        static get sample_icon(){return new NetDrawable(image_base64.sample_icon)}
    }
    android.content.res.Resources.buildDrawableFinder = (refString:string)=>{
        return image[refString];
    }
}
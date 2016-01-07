/**
 * Created by linfaxin on 15/11/28.
 */
///<reference path="ImageView.ts"/>
///<reference path="../view/View.ts"/>
///<reference path="../R/attr.ts"/>

module android.widget{
    export class ImageButton extends ImageView {
        constructor(context?:android.content.Context, bindElement?:HTMLElement, defStyle = android.R.attr.imageButtonStyle){
            super(context, bindElement, defStyle);
        }
    }
}
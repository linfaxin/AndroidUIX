/**
 * Created by linfaxin on 15/11/28.
 */
///<reference path="ImageView.ts"/>
///<reference path="../view/View.ts"/>
///<reference path="../R/attr.ts"/>

module android.widget{
    export class ImageButton extends ImageView {
        constructor(bindElement?:HTMLElement, rootElement?:HTMLElement){
            super(bindElement, rootElement);
            this.applyDefaultAttributes(android.R.attr.imageButtonStyle);
        }
    }
}
/**
 * Created by linfaxin on 15/11/2.
 */
///<reference path="TextView.ts"/>
///<reference path="../view/View.ts"/>
///<reference path="../R/attr.ts"/>

module android.widget{
    import View = android.view.View;
    import Gravity = android.view.Gravity;

    export class Button extends TextView{
        constructor(bindElement?:HTMLElement, rootElement?:HTMLElement){
            super(bindElement, rootElement);
            this.applyDefaultAttributes(android.R.attr.buttonStyle);
        }
    }
}
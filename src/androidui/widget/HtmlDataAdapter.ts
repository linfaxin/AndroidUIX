/**
 * Created by linfaxin on 15/11/16.
 */
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>

module androidui.widget{
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;

    /**
     * adapter can defined in html
     */
    export interface HtmlDataAdapter {
        onInflateAdapter(bindElement:HTMLElement, rootElement?:HTMLElement, parent?:ViewGroup):void;
    }
}
/**
 * Created by linfaxin on 15/11/16.
 */
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/content/Context.ts"/>

module androidui.widget{
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import Context = android.content.Context;

    /**
     * adapter can defined in html
     */
    export interface HtmlDataAdapter {
        onInflateAdapter(bindElement:HTMLElement, context?:Context, parent?:ViewGroup):void;
    }
}
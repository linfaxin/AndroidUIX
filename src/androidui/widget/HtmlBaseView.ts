/**
 * Created by linfaxin on 15/10/26.
 */
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/content/res/Resources.ts"/>
///<reference path="../../android/R/attr.ts"/>
///<reference path="../../androidui/AndroidUI.ts"/>

module androidui.widget {
    import View = android.view.View;
    import Gravity = android.view.Gravity;
    import Resources = android.content.res.Resources;
    import Color = android.graphics.Color;
    import ColorStateList = android.content.res.ColorStateList;
    import MeasureSpec = View.MeasureSpec;
    import TypedValue = android.util.TypedValue;

    export class HtmlBaseView extends View {

        constructor(bindElement?:HTMLElement, rootElement?:HTMLElement) {
            super(bindElement, rootElement);

        }

        onTouchEvent(event:android.view.MotionEvent):boolean {
            event[android.view.ViewRootImpl.ContinueEventToDom] = true;
            return super.onTouchEvent(event) || true;
        }

        //default sync bound immediately
        requestSyncBoundToElement(immediately = true):void {
            super.requestSyncBoundToElement(immediately);
        }


        protected onAttachedToWindow():void {
            //HtmlBaseView show at debug layout
            if(this.rootElement){
                let androidUI:androidui.AndroidUI = this.rootElement[androidui.AndroidUI.BindToElementName];
                androidUI.showDebugLayout();
            }

            return super.onAttachedToWindow();
        }
    }

}
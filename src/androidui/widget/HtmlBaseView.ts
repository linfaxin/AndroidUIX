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
        private mHtmlTouchAble = false;

        constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle?:Map<string, string>) {
            super(context, bindElement, defStyle);
        }

        onTouchEvent(event:android.view.MotionEvent):boolean {
            if(this.mHtmlTouchAble){
                event[android.view.ViewRootImpl.ContinueEventToDom] = true;
            }
            return super.onTouchEvent(event) || this.mHtmlTouchAble;
        }

        setHtmlTouchAble(enable:boolean):void {
            this.mHtmlTouchAble = enable;
        }

        isHtmlTouchAble():boolean {
            return this.mHtmlTouchAble;
        }

        protected dependOnDebugLayout():boolean {
            return true;
        }
    }

}
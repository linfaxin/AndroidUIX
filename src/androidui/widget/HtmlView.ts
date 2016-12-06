/**
 * Created by linfaxin on 15/10/26.
 */
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/content/res/Resources.ts"/>
///<reference path="../../android/graphics/Color.ts"/>
///<reference path="../../android/content/res/ColorStateList.ts"/>
///<reference path="../../android/util/TypedValue.ts"/>
///<reference path="../../android/R/attr.ts"/>
///<reference path="../../androidui/AndroidUI.ts"/>
///<reference path="HtmlBaseView.ts"/>

module androidui.widget {
    import View = android.view.View;
    import Gravity = android.view.Gravity;
    import Resources = android.content.res.Resources;
    import Color = android.graphics.Color;
    import ColorStateList = android.content.res.ColorStateList;
    import MeasureSpec = View.MeasureSpec;
    import TypedValue = android.util.TypedValue;

    export class HtmlView extends HtmlBaseView {

        constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle?:Map<string, string>) {
            super(context, bindElement, defStyle);
        }

        protected onMeasure(widthMeasureSpec:any, heightMeasureSpec:any):void {
            let widthMode = MeasureSpec.getMode(widthMeasureSpec);
            let heightMode = MeasureSpec.getMode(heightMeasureSpec);
            let widthSize = MeasureSpec.getSize(widthMeasureSpec);
            let heightSize = MeasureSpec.getSize(heightMeasureSpec);

            let width:number, height:number;
            const density = this.getResources().getDisplayMetrics().density;

            if (widthMode == MeasureSpec.EXACTLY) {
                // Parent has told us how big to be. So be it.
                width = widthSize;

            } else {
                let sWidth = this.bindElement.style.width, sLeft = this.bindElement.style.left;
                this.bindElement.style.width = '';
                this.bindElement.style.left = '';
                width = this.bindElement.offsetWidth * density + 2;//more space (some case may wrap word)

                this.bindElement.style.width = sWidth;
                this.bindElement.style.left = sLeft;

                // Check against our minimum width
                width = Math.max(width, this.getSuggestedMinimumWidth());

                if (widthMode == MeasureSpec.AT_MOST) {
                    width = Math.min(widthSize, width);
                }
            }


            if (heightMode == MeasureSpec.EXACTLY) {
                // Parent has told us how big to be. So be it.
                height = heightSize;

            } else {
                let sWidth = this.bindElement.style.width;
                this.bindElement.style.width = width / density + "px";
                this.bindElement.style.height = '';
                height = this.bindElement.offsetHeight * density;

                this.bindElement.style.width = sWidth;

                // Check against our minimum height
                height = Math.max(height, this.getSuggestedMinimumHeight());

                if (heightMode == MeasureSpec.AT_MOST) {
                    height = Math.min(height, heightSize);
                }
            }

            this.setMeasuredDimension(width, height);
        }

        setHtml(html:string) {
            this.bindElement.innerHTML = html;
            this.requestLayout();
        }

        getHtml():string {
            return this.bindElement.innerHTML;
        }

    }

}
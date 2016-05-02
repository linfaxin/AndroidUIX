///<reference path="../widget/HtmlView.ts"/>
///<reference path="../../android/graphics/Rect.ts"/>

module androidui.native{
    import HtmlView = androidui.widget.HtmlView;
    import Rect = android.graphics.Rect;

    export class NativeHtmlView extends HtmlView {
        private mRectDrawHTMLBoundTmp = new Rect();

        protected _syncBoundAndScrollToElement():void {
            super._syncBoundAndScrollToElement();
            this.getGlobalVisibleRect(this.mRectDrawHTMLBoundTmp);
            NativeApi.drawHTML.showDrawHTMLBound(this.hashCode(), this.mRectDrawHTMLBoundTmp.left, this.mRectDrawHTMLBoundTmp.top, this.mRectDrawHTMLBoundTmp.right, this.mRectDrawHTMLBoundTmp.bottom);
        }

        protected onDetachedFromWindow():void {
            super.onDetachedFromWindow();
            NativeApi.drawHTML.hideDrawHTMLBound(this.hashCode());
        }
    }
}
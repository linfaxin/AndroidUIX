///<reference path="../../android/widget/EditText.ts"/>
///<reference path="NativeApi.ts"/>

module androidui.native {
    
    import Rect = android.graphics.Rect;
    export class NativeEditText extends android.widget.EditText {
        private mRectTmp = new Rect();
        // protected setForceDisableDrawText(disable:boolean){
        //     //always show text on canvas.
        // }
        private computeTextArea():void {
            this.getGlobalVisibleRect(this.mRectTmp);

            if (this.mLayout == null) {
                this.assumeLayout();
            }
            this.mRectTmp.left += this.getTotalPaddingLeft();
            this.mRectTmp.top += this.getTotalPaddingTop();
            this.mRectTmp.right -= (this.getTotalPaddingRight());
            this.mRectTmp.bottom -= (this.getTotalPaddingBottom());
        }

        protected onInputElementFocusChanged(focused:boolean):any {
            if(focused){
                this.computeTextArea();
                NativeApi.drawHTML.showDrawHTMLBound(this.hashCode(), this.mRectTmp.left, this.mRectTmp.top, this.mRectTmp.right, this.mRectTmp.bottom);
            }else{
                NativeApi.drawHTML.hideDrawHTMLBound(this.hashCode());
            }
            return super.onInputElementFocusChanged(focused);
        }

        protected tryShowInputElement():any {
            this.computeTextArea();
            NativeApi.drawHTML.showDrawHTMLBound(this.hashCode(), this.mRectTmp.left, this.mRectTmp.top, this.mRectTmp.right, this.mRectTmp.bottom);
            return super.tryShowInputElement();
        }

        protected tryDismissInputElement():any {
            NativeApi.drawHTML.hideDrawHTMLBound(this.hashCode());
            return super.tryDismissInputElement();
        }

        protected _syncBoundAndScrollToElement():void {
            super._syncBoundAndScrollToElement();
            if(this.isInputElementShowed() && this.isFocused() && this.getText().length>0) {
                this.computeTextArea();
                NativeApi.drawHTML.showDrawHTMLBound(this.hashCode(), this.mRectTmp.left, this.mRectTmp.top, this.mRectTmp.right, this.mRectTmp.bottom);
            }
        }
        
        protected onDetachedFromWindow():void {
            super.onDetachedFromWindow();
            NativeApi.drawHTML.hideDrawHTMLBound(this.hashCode());
        }
    }
}
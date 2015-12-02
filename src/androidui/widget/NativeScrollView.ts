/**
 * Created by linfaxin on 15/12/2.
 */
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/widget/ScrollView.ts"/>
module androidui.widget{
    import View = android.view.View;
    import ScrollView = android.widget.ScrollView;

    export class NativeScrollView extends ScrollView{
        isTouching = false;

        protected initBindElement(bindElement:HTMLElement, rootElement:HTMLElement):void {
            super.initBindElement(bindElement, rootElement);
            this.bindElement.style.cssText+=";overflow-y:auto;-webkit-overflow-scrolling:touch;";

            const density = this.getResources().getDisplayMetrics().density;
            this.bindElement.addEventListener('scroll', (e)=>{
                let oldX = this.mScrollX;
                let oldY = this.mScrollY;
                let x = this.bindElement.scrollLeft * density;
                let y = this.bindElement.scrollTop * density;

                if (oldX != x || oldY != y) {
                    const range = this.getScrollRange();

                    this.overScrollBy(x - oldX, y - oldY, oldX, oldY, 0, range,
                        0, this.mOverflingDistance, this.isTouching);
                    this.onScrollChanged(this.mScrollX, this.mScrollY, oldX, oldY);

                }

                this.awakenScrollBars();
            });

            //fix ios scroll bug
            this.bindElement.addEventListener("touchstart", ()=>{
                var maxScroll = this.bindElement.scrollHeight - this.bindElement.offsetHeight;
                if (this.bindElement.scrollTop === 0) this.bindElement.scrollTop = 1;
                else if (this.bindElement.scrollTop === maxScroll) this.bindElement.scrollTop = maxScroll - 1;
            });
        }

        onInterceptTouchEvent(ev:android.view.MotionEvent):boolean {

            const parent = this.getParent();
            var func;
            if (parent != null) {
                func = parent.requestDisallowInterceptTouchEvent;
                parent.requestDisallowInterceptTouchEvent = ()=>{};
            }

            try {
                return super.onInterceptTouchEvent(ev);
            } finally {
                if (parent != null && func) {
                    parent.requestDisallowInterceptTouchEvent = func;
                }
            }
        }

        onTouchEvent(ev:android.view.MotionEvent):boolean {
            switch (ev.getAction()) {
                case android.view.MotionEvent.ACTION_CANCEL:
                case android.view.MotionEvent.ACTION_UP:
                    this.isTouching = false;
                    break;
                case android.view.MotionEvent.ACTION_DOWN:
                case android.view.MotionEvent.ACTION_MOVE:
                    this.isTouching = true;
                    break;
            }
            return true;
        }

        protected _syncScrollToElement():boolean {
            return false;
        }

        onDrawVerticalScrollBar(canvas:android.graphics.Canvas, scrollBar:android.graphics.drawable.Drawable, l:number, t:number, r:number, b:number):void {
            //don't draw scroll bar
        }
    }
}
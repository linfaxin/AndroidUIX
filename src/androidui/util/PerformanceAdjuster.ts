/**
 * Created by linfaxin on 15/12/1.
 */
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/graphics/Canvas.ts"/>

module androidui.util{
    import Canvas = android.graphics.Canvas;
    import Drawable = android.graphics.drawable.Drawable;
    export class PerformanceAdjuster {

        static noCanvasMode(){
            android.graphics.Canvas.prototype = HackCanvas.prototype;

            android.view.View.prototype.onDrawVerticalScrollBar =
                function(canvas:Canvas, scrollBar:Drawable, l:number, t:number, r:number, b:number):void {
                    let scrollBarEl = this.bindElement['VerticalScrollBar'];
                    if(!scrollBarEl){
                        scrollBarEl = document.createElement('div');
                        this.bindElement['VerticalScrollBar'] = scrollBarEl;
                        scrollBarEl.style.zIndex = '9';
                        scrollBarEl.style.position = 'absolute';
                        scrollBarEl.style.background = 'black';
                        this.bindElement.appendChild(scrollBarEl);
                    }

                    let height = b - t;
                    let width = r - l;
                    let size = height;
                    let thickness = width;
                    let extent = this.mScrollCache.scrollBar.mExtent;
                    let range = this.mScrollCache.scrollBar.mRange;

                    let length = Math.round( size * extent / range);
                    let offset = Math.round( (size - length) * this.mScrollCache.scrollBar.mOffset / (range - extent));
                    if(t<0) t = 0;
                    if(offset<0) offset = 0;

                    scrollBarEl.style.transform = scrollBarEl.style.webkitTransform = `translate(${l}px, ${t + offset}px`;
                    scrollBarEl.style.width = (r-l)/2 + 'px';//half style
                    scrollBarEl.style.height = length + 'px';
                    scrollBarEl.style.opacity = this.mScrollCache.scrollBar.mVerticalThumb.getAlpha() / 255 + '';
            };
        }

    }

    class HackCanvas extends android.graphics.Canvas{

        protected init():void {
        }

        recycle():void {
        }

        translate(dx:number, dy:number):void {
        }

        scale(sx:number, sy:number, px:number, py:number):void {
        }

        rotate(degrees:number, px:number, py:number):void {
        }

        drawRGB(r:number, g:number, b:number):void {
        }

        drawARGB(a:number, r:number, g:number, b:number):void {
        }

        drawColor(color:number):void {
        }

        clearColor():void {
        }

        save():number {
            return 1;
        }

        restore():void {
        }

        restoreToCount(saveCount:number):void {
        }

        getSaveCount():number {
            return 1;
        }


        clipRect(rect: android.graphics.Rect): boolean;
        clipRect(left: number, top: number, right: number, bottom: number): boolean;
        clipRect(...args):boolean {
            return false;
        }

        getClipBounds(bounds:android.graphics.Rect):android.graphics.Rect {
            return null;
        }

        quickReject(rect:android.graphics.Rect): boolean;
        quickReject(left: number, top: number, right: number, bottom: number): boolean;
        quickReject(...args):boolean {
            return false;
        }

        drawCanvas(canvas:android.graphics.Canvas, offsetX:number, offsetY:number):void {
        }

        drawRect(rect:android.graphics.Rect, paint:android.graphics.Paint): any;
        drawRect(left: number, top: number, right: number, bottom: number, paint: android.graphics.Paint): any;
        drawRect(...args):any {
        }

        drawText(text:string, x:number, y:number, paint:android.graphics.Paint):void {
        }
    }
}
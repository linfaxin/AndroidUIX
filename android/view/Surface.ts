/**
 * Created by linfaxin on 15/10/13.
 */
///<reference path="../graphics/Rect.ts"/>
///<reference path="../graphics/Canvas.ts"/>

module android.view{
    import Rect = android.graphics.Rect;
    import Canvas = android.graphics.Canvas;

    export class Surface{
        private mCanvasElement:HTMLCanvasElement;
        private mLockedCanvasMap = new WeakMap<Canvas, Rect>();

        constructor(canvasElement:HTMLCanvasElement) {
            this.mCanvasElement = canvasElement;
        }

        /**
         * create a off-screen canvas to draw
         */
        lockCanvas(dirty:Rect):Canvas{
            let rect = new Rect(dirty);
            if(dirty.isEmpty()){
                rect.set(0, 0, this.mCanvasElement.offsetWidth, this.mCanvasElement.offsetHeight);
            }
            let width = rect.width();
            let height = rect.height();
            let canvas = Canvas.obtain(width, height);
            this.mLockedCanvasMap.set(canvas, rect);
            return canvas;
        }

        /**
         * draw the off-screen canvas to in-screen canvas
         * @param canvas
         */
        unlockCanvasAndPost(canvas:Canvas):void {
            let rect = this.mLockedCanvasMap.get(canvas);
            if(rect){
                let mCanvasContent = this.mCanvasElement.getContext('2d');
                mCanvasContent.clearRect(rect.left, rect.top, canvas.getWidth(), canvas.getHeight());
                mCanvasContent.drawImage(canvas.canvasElement, rect.left, rect.top);
            }
            canvas.recycle();
        }
    }
}
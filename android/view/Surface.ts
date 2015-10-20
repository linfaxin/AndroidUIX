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
            let fullWidth = this.mCanvasElement.offsetWidth;
            let fullHeight = this.mCanvasElement.offsetHeight;
            let rect = new Rect(dirty);
            if(dirty.isEmpty()){
                rect.set(0, 0, fullWidth, fullHeight);
            }
            let width = rect.width();
            let height = rect.height();
            let canvas = Canvas.obtain(fullWidth, fullHeight);
            canvas.clipRect(rect);

            this.mLockedCanvasMap.set(canvas, rect);

            let mCanvasContent = this.mCanvasElement.getContext('2d');
            mCanvasContent.clearRect(rect.left, rect.top, width, height);
            return canvas;
        }

        /**
         * draw the off-screen canvas to in-screen canvas
         * @param canvas
         */
        unlockCanvasAndPost(canvas:Canvas):void {
            let rect:Rect = this.mLockedCanvasMap.get(canvas);
            if(rect){
                //canvas.translate(rect.left, rect.top);
                let mCanvasContent = this.mCanvasElement.getContext('2d');
                //mCanvasContent.clearRect(rect.left, rect.top, canvas.getWidth(), canvas.getHeight());
                mCanvasContent.drawImage(canvas.canvasElement, 0, 0);
                //mCanvasContent.putImageData(canvas.canvasElement.getContext('2d').getImageData(rect.left, rect.top, rect.width(), rect.height()), rect.left, rect.top);
            }
            canvas.recycle();
        }
    }
}
/**
 * Created by linfaxin on 15/10/13.
 */
///<reference path="../graphics/Rect.ts"/>
///<reference path="../graphics/Canvas.ts"/>
///<reference path="../graphics/Canvas.ts"/>

module android.view{
    import Rect = android.graphics.Rect;
    import Canvas = android.graphics.Canvas;

    export class Surface{
        private mCanvasElement:HTMLCanvasElement;
        private mLockedRect:Rect = new Rect();

        constructor(canvasElement:HTMLCanvasElement) {
            this.mCanvasElement = canvasElement;
        }

        /**
         * create a off-screen canvas to draw
         */
        lockCanvas(dirty:Rect):Canvas{
            let fullWidth = this.mCanvasElement.width;
            let fullHeight = this.mCanvasElement.height;
            let rect:Rect = this.mLockedRect;
            if(dirty.isEmpty()){
                rect.set(0, 0, fullWidth, fullHeight);
            }else{
                // +1/-1: more space, insure dirty area clear and draw ok
                rect.set(Math.floor(dirty.left-1), Math.floor(dirty.top-1), Math.ceil(dirty.right+1), Math.ceil(dirty.bottom+1));
            }
            let width = rect.width();
            let height = rect.height();
            //this.mCanvas.clipRect(rect.left, rect.top, width, height);
            //this.mLockedCanvas.clipRect(rect.left, rect.top, width, height);

            let canvas = new Canvas(width, height);
            if(rect.left!=0||rect.top!=0) canvas.translate(-rect.left, -rect.top);

            let mCanvasContent = this.mCanvasElement.getContext('2d');
            mCanvasContent.clearRect(rect.left, rect.top, width, height);
            return canvas;
        }

        /**
         * draw the off-screen canvas to in-screen canvas
         * @param canvas
         */
        unlockCanvasAndPost(canvas:Canvas):void {
            let mCanvasContent:CanvasRenderingContext2D = this.mCanvasElement.getContext('2d');
            if(canvas.canvasElement) mCanvasContent.drawImage(canvas.canvasElement, this.mLockedRect.left, this.mLockedRect.top);
            //mCanvasContent.putImageData(canvas.canvasElement.getContext('2d').getImageData(rect.left, rect.top, rect.width(), rect.height()), rect.left, rect.top);
            canvas.recycle();
        }
    }
}
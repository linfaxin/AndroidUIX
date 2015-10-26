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
        private mLockedCanvasMap = new WeakMap<Canvas, Rect>();


        constructor(canvasElement:HTMLCanvasElement) {
            this.mCanvasElement = canvasElement;
        }

        /**
         * create a off-screen canvas to draw
         */
        lockCanvas(dirty:Rect):Canvas{
            let fullWidth = this.mCanvasElement.width;
            let fullHeight = this.mCanvasElement.height;
            let rect:Rect;
            if(dirty.isEmpty()){
                rect = new Rect(0, 0, fullWidth, fullHeight);
            }else{
                // +1/-1: more space, insure dirty area clear and draw ok
                rect = new Rect(Math.floor(dirty.left-1), Math.floor(dirty.top-1), Math.ceil(dirty.right+1), Math.ceil(dirty.bottom+1));
            }
            let width = rect.width();
            let height = rect.height();
            //this.mCanvas.clipRect(rect.left, rect.top, width, height);
            //this.mLockedCanvas.clipRect(rect.left, rect.top, width, height);

            let canvas = new Canvas(width, height);
            canvas.translate(-rect.left, -rect.top);

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
                let mCanvasContent:CanvasRenderingContext2D = this.mCanvasElement.getContext('2d');
                mCanvasContent.drawImage(canvas.canvasElement, rect.left, rect.top);
                //mCanvasContent.putImageData(canvas.canvasElement.getContext('2d').getImageData(rect.left, rect.top, rect.width(), rect.height()), rect.left, rect.top);
            }
        }
    }
}
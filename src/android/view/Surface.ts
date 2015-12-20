/**
 * Created by linfaxin on 15/10/13.
 */
///<reference path="../graphics/Rect.ts"/>
///<reference path="../graphics/Canvas.ts"/>
///<reference path="../graphics/Canvas.ts"/>
///<reference path="../view/ViewRootImpl.ts"/>

module android.view{
    import Rect = android.graphics.Rect;
    import Canvas = android.graphics.Canvas;
    import ViewRootImpl = android.view.ViewRootImpl;

    export class Surface{
        private mCanvasElement:HTMLCanvasElement;
        private viewRoot:ViewRootImpl;
        private mLockedRect:Rect = new Rect();
        protected mClientRect:ClientRect;
        protected mSupportDirtyDraw = true;

        constructor(canvasElement:HTMLCanvasElement, viewRoot:ViewRootImpl) {
            this.mCanvasElement = canvasElement;
            this.viewRoot = viewRoot;
            this.initImpl();
        }

        protected initImpl(){
            this.mClientRect = this.mCanvasElement.getBoundingClientRect();

        }

        notifyBoundChange(){
            this.mClientRect = this.mCanvasElement.getBoundingClientRect();
        }

        /**
         * create a off-screen canvas to draw
         */
        lockCanvas(dirty:Rect):Canvas{
            let fullWidth = this.mClientRect.width;
            let fullHeight = this.mClientRect.height;
            let rect:Rect = this.mLockedRect;
            if(dirty.isEmpty()){
                rect.set(0, 0, fullWidth, fullHeight);
            }else{
                rect.set(Math.floor(dirty.left), Math.floor(dirty.top), Math.ceil(dirty.right), Math.ceil(dirty.bottom));
            }

            return this.lockCanvasImpl(rect.left, rect.top, rect.width(), rect.height());
        }

        protected lockCanvasImpl(left:number, top:number, width:number, height:number):Canvas {
            let canvas = new Canvas(width, height);//TODO need off-screen canvas?
            if(left!=0||top!=0) canvas.translate(-left, -top);

            let mCanvasContent = this.mCanvasElement.getContext('2d');
            mCanvasContent.clearRect(left, top, width, height);
            return canvas;
        }

        /**
         * draw the off-screen canvas to in-screen canvas
         * @param canvas
         */
        unlockCanvasAndPost(canvas:Canvas):void {
            let mCanvasContent:CanvasRenderingContext2D = this.mCanvasElement.getContext('2d');
            if(canvas.mCanvasElement) mCanvasContent.drawImage(canvas.mCanvasElement, this.mLockedRect.left, this.mLockedRect.top);
            //mCanvasContent.putImageData(canvas.canvasElement.getContext('2d').getImageData(rect.left, rect.top, rect.width(), rect.height()), rect.left, rect.top);
            canvas.recycle();
        }
    }
}
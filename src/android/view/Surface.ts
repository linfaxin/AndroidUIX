/**
 * Created by linfaxin on 15/10/13.
 */
///<reference path="../graphics/Rect.ts"/>
///<reference path="../graphics/Canvas.ts"/>
///<reference path="../graphics/Canvas.ts"/>
///<reference path="../content/res/Resources.ts"/>
///<reference path="../view/ViewRootImpl.ts"/>

module android.view{
    import Rect = android.graphics.Rect;
    import Canvas = android.graphics.Canvas;
    import ViewRootImpl = android.view.ViewRootImpl;


    export class Surface{
        private mCanvasElement:HTMLCanvasElement;
        private viewRoot:ViewRootImpl;
        private mLockedRect:Rect = new Rect();
        protected mCanvasBound = new Rect();
        protected mSupportDirtyDraw = true;
        private mLockSaveCount = 1;

        constructor(canvasElement:HTMLCanvasElement, viewRoot:ViewRootImpl) {
            this.mCanvasElement = canvasElement;
            this.viewRoot = viewRoot;
            this.initImpl();
        }

        protected initImpl(){
            this.initCanvasBound();

        }

        isValid():boolean {
            return true;//web canvas always true
        }

        notifyBoundChange(){
            this.initCanvasBound();
        }

        protected initCanvasBound(){
            let density = android.content.res.Resources.getDisplayMetrics().density;
            let clientRect = this.mCanvasElement.getBoundingClientRect();
            this.mCanvasBound.set(clientRect.left * density, clientRect.top * density, clientRect.right*density, clientRect.bottom*density);
        }

        /**
         * create a off-screen canvas to draw
         */
        lockCanvas(dirty:Rect):Canvas{
            let rect:Rect = this.mLockedRect;
            rect.set(Math.floor(dirty.left), Math.floor(dirty.top), Math.ceil(dirty.right), Math.ceil(dirty.bottom));
            if(dirty.isEmpty()){
                let fullWidth = this.mCanvasBound.width();
                let fullHeight = this.mCanvasBound.height();
                rect.set(0, 0, fullWidth, fullHeight);
            }

            return this.lockCanvasImpl(rect.left, rect.top, rect.width(), rect.height());
        }

        protected lockCanvasImpl(left:number, top:number, width:number, height:number):Canvas {
            //let canvas = new Canvas(width, height);
            //if(left!=0||top!=0) canvas.translate(-left, -top);

            //let mCanvasContent = this.mCanvasElement.getContext('2d');
            //mCanvasContent.clearRect(left, top, width, height);

            let canvas = new SurfaceLockCanvas(this.mCanvasBound.width(), this.mCanvasBound.height(), this.mCanvasElement);
            this.mLockSaveCount = canvas.save();
            canvas.clipRect(left, top, left+width, top+height);
            canvas.clearColor();
            return canvas;
        }

        /**
         * draw the off-screen canvas to in-screen canvas
         * @param canvas
         */
        unlockCanvasAndPost(canvas:Canvas):void {
            canvas.restoreToCount(this.mLockSaveCount);

            //let mCanvasContent:CanvasRenderingContext2D = this.mCanvasElement.getContext('2d');
            //if(canvas.mCanvasElement) mCanvasContent.drawImage(canvas.mCanvasElement, this.mLockedRect.left, this.mLockedRect.top);
            //canvas.recycle();
        }
    }

    class SurfaceLockCanvas extends Canvas{

        constructor(width:number, height:number, canvasElement:HTMLCanvasElement) {
            super(width, height);
            this.mCanvasElement = canvasElement;
            this._mCanvasContent = this.mCanvasElement.getContext("2d");
        }

        protected initImpl():void {
        }

    }
}
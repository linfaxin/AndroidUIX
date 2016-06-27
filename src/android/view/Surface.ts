/**
 * Created by linfaxin on 15/10/13.
 * AndroidUI's impl
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
        static DrawToCacheFirstMode = false;
        private mCanvasElement:HTMLCanvasElement;
        private _showFPSNode:HTMLElement;
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
            return true;//always true
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
         * lock a canvas to draw
         */
        lockCanvas(dirty:Rect):Canvas{
            let fullWidth = this.mCanvasBound.width();
            let fullHeight = this.mCanvasBound.height();
            if(!this.mSupportDirtyDraw) dirty.set(0, 0, fullWidth, fullHeight);

            let rect:Rect = this.mLockedRect;
            rect.set(Math.floor(dirty.left), Math.floor(dirty.top), Math.ceil(dirty.right), Math.ceil(dirty.bottom));
            if(dirty.isEmpty()){
                rect.set(0, 0, fullWidth, fullHeight);
            }
            if(rect.isEmpty()) return null;//may canvas bound not ready.

            return this.lockCanvasImpl(rect.left, rect.top, rect.width(), rect.height());
        }

        protected lockCanvasImpl(left:number, top:number, width:number, height:number):Canvas {
            let canvas:Canvas;
            if(Surface.DrawToCacheFirstMode) {
                canvas = new Canvas(width, height);
                if (left != 0 || top != 0) canvas.translate(-left, -top);

                //let mCanvasContent = this.mCanvasElement.getContext('2d');
                //mCanvasContent.clearRect(left, top, width, height);

            }else {
                canvas = new SurfaceLockCanvas(this.mCanvasBound.width(), this.mCanvasBound.height(), this.mCanvasElement);
                this.mLockSaveCount = canvas.save();
                canvas.clipRect(left, top, left + width, top + height);
                //canvas.clearColor();
            }
            return canvas;
        }

        /**
         * draw the off-screen canvas to in-screen canvas
         * @param canvas
         */
        unlockCanvasAndPost(canvas:Canvas):void {
            if(Surface.DrawToCacheFirstMode) {
                let mCanvasContent:CanvasRenderingContext2D = this.mCanvasElement.getContext('2d');
                if(canvas.mCanvasElement) mCanvasContent.drawImage(canvas.mCanvasElement, this.mLockedRect.left, this.mLockedRect.top);
                canvas.recycle();

            }else{
                canvas.restoreToCount(this.mLockSaveCount);
            }

        }

        showFps(fps:number):void {
            if(!this._showFPSNode){
                this._showFPSNode = document.createElement('div');
                this._showFPSNode.style.position = 'absolute';
                this._showFPSNode.style.top = '0';
                this._showFPSNode.style.left = '0';
                this._showFPSNode.style.width = '60px';
                this._showFPSNode.style.fontSize = '14px';
                this._showFPSNode.style.background = 'black';
                this._showFPSNode.style.color = 'white';
                this._showFPSNode.style.opacity = '0.7';
                this._showFPSNode.style.zIndex = '1';
                this.mCanvasElement.parentNode.appendChild(this._showFPSNode);
            }
            this._showFPSNode.innerText = 'FPS:'+fps.toFixed(1);
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
/**
 * Created by linfaxin on 15/10/13.
 */
///<reference path="../util/Pools.ts"/>
///<reference path="../util/Log.ts"/>
///<reference path="Rect.ts"/>
///<reference path="Color.ts"/>
///<reference path="Paint.ts"/>
module android.graphics {
    import Pools = android.util.Pools;
    import Log = android.util.Log;
    import Rect = android.graphics.Rect;
    import Color = android.graphics.Color;

    export class Canvas {
        private static FullRect = new Rect(-1000000000, -1000000000, 1000000000, 1000000000);
        private mCanvasElement:HTMLCanvasElement;
        private mWidth = 0;
        private mHeight = 0;
        private _mCanvasContent:CanvasRenderingContext2D;
        private _saveCount = 0;
        mCurrentClip:Rect;
        private shouldDoRectBeforeRestoreMap = new Map<number, Array<Rect>>();
        private mClipStateMap = new Map<number, Rect>();

        private static sRectPool = new Pools.SynchronizedPool<Rect>(100);
        private static obtainRect(copy?:Rect):Rect {
            let rect = Canvas.sRectPool.acquire();
            if(!rect) rect = new Rect();
            if(copy) rect.set(copy);
            return rect;
        }
        private static recycleRect(...rects:Rect[]) {
            for(let rect of rects){
                rect.setEmpty();
                Canvas.sRectPool.release(rect);
            }
        }

        constructor(width:number, height:number) {
            this.mCanvasElement = document.createElement("canvas");
            this.mCanvasElement.width = width;
            this.mCanvasElement.height = height;
            this.mWidth = width;
            this.mHeight = height;
            this.init();
        }

        private init() {
            this._mCanvasContent = this.mCanvasElement.getContext("2d");
            this.mCurrentClip = Canvas.obtainRect();
            this.mCurrentClip.set(0, 0, this.mWidth, this.mHeight);
            this._saveCount = 0;

            //let content = this._mCanvasContent;
            //function logMethod (old){
            //    return function(...args){
            //        Log.d('canvas', old.name+"("+args+")");
            //        old.call(content, ...args);
            //    };
            //}
            //
            //content.save = logMethod(content.save);
            //content.restore = logMethod(content.restore);
            //content.rect = logMethod(content.rect);
            //content.clip = logMethod(content.clip);
            //content.translate = logMethod(content.translate);
            //content.fillRect = logMethod(content.fillRect);

            this.fullRectForClip();//ready for clip bound
            this._mCanvasContent.clip();
            this.save();
        }

        recycle(){
            Canvas.recycleRect(this.mCurrentClip);
            Canvas.recycleRect(...this.mClipStateMap.values());
            for(let rects of this.shouldDoRectBeforeRestoreMap.values()){
                Canvas.recycleRect(...rects);
            }
        }

        public get canvasElement():HTMLCanvasElement {
            return this.mCanvasElement;
        }

        public getHeight():number {
            return this.mHeight;
        }

        public getWidth():number {
            return this.mWidth;
        }


        translate(dx:number, dy:number):void {
            if(this.mCurrentClip) this.mCurrentClip.offset(-dx, -dy);
            this._mCanvasContent.translate(dx, dy);
        }

        scale(sx:number, sy:number, px?:number, py?:number):void {
            //TODO effect mCurrentClip
            if (px && py) this.translate(px, py);
            this._mCanvasContent.scale(sx, sy);
            if (px && py) this.translate(-px, -py);
        }

        rotate(degrees:number, px?:number, py?:number) {
            //TODO effect mCurrentClip
            if (px && py) this.translate(px, py);
            this._mCanvasContent.rotate(degrees);
            if (px && py) this.translate(-px, -py);
        }

        drawRGB(r:number, g:number, b:number) {
            this._mCanvasContent.fillStyle = `rgb(${r},${g},${b})`;
            this._mCanvasContent.fillRect(this.mCurrentClip.left, this.mCurrentClip.top, this.mCurrentClip.width(), this.mCurrentClip.height());
        }

        drawARGB(a:number, r:number, g:number, b:number) {
            this._mCanvasContent.fillStyle = `rgba(${r},${g},${b},${a/255})`;
            this._mCanvasContent.fillRect(this.mCurrentClip.left, this.mCurrentClip.top, this.mCurrentClip.width(), this.mCurrentClip.height());
        }

        drawColor(color:number){
            this.drawARGB(Color.alpha(color), Color.red(color), Color.green(color), Color.blue(color));
        }

        clearColor(){
            //this._mCanvasContent.clearRect(0, 0, this.getWidth(), this.getHeight());
            this._mCanvasContent.clearRect(this.mCurrentClip.left, this.mCurrentClip.top, this.mCurrentClip.width(), this.mCurrentClip.height());
        }


        save():number {
            this._mCanvasContent.save();
            if(this.mCurrentClip) this.mClipStateMap.set(this._saveCount, Canvas.obtainRect(this.mCurrentClip));
            this._saveCount++;

            return this._saveCount;
        }

        restore() {
            let doRects = this.shouldDoRectBeforeRestoreMap.get(this._saveCount);
            if(doRects && doRects.length>0){
                doRects.forEach((rect:Rect)=>{
                    this._mCanvasContent.rect(rect.left, rect.top, rect.width(), rect.height());
                });
                if(doRects.length%2 == 1){
                    this.fullRectForClip();
                }
                while(doRects.length>0){
                    Canvas.recycleRect(doRects.pop());
                }
            }


            this._saveCount--;
            this._mCanvasContent.restore();
            let savedClip = this.mClipStateMap.get(this._saveCount);
            if(savedClip){
                this.mClipStateMap.delete(this._saveCount);
                this.mCurrentClip.set(savedClip);
                Canvas.recycleRect(savedClip);
            }
        }

        restoreToCount(saveCount:number) {
            if (saveCount <= 0) throw Error('saveCount can\'t <= 0');
            while (saveCount <= this._saveCount) {
                this.restore();
            }
        }

        getSaveCount():number {
            return this._saveCount;
        }

        private fullRectForClip(){
            this._mCanvasContent.rect(Canvas.FullRect.left, Canvas.FullRect.top, Canvas.FullRect.width(), Canvas.FullRect.height());
        }

        clipRect(rect:Rect):boolean;
        clipRect(left:number, top:number, right:number, bottom:number):boolean;
        clipRect(...args):boolean {
            let rect = Canvas.obtainRect();

            if (args.length === 1) {
                rect.set(args[0]);

            } else {
                let [left=0, top=0, right=0, bottom=0] = args;
                rect.set(left, top, right, bottom);
            }

            this._mCanvasContent.rect(Math.floor(rect.left), Math.floor(rect.top),
                Math.ceil(rect.width()), Math.ceil(rect.height()));
            this.fullRectForClip();
            this._mCanvasContent.clip('evenodd');

            let doRects = this.shouldDoRectBeforeRestoreMap.get(this._saveCount);
            if(!doRects){
                doRects = [];
                this.shouldDoRectBeforeRestoreMap.set(this._saveCount, doRects);
            }
            doRects.push(rect);

            this.mCurrentClip.intersect(rect);

            return rect.isEmpty();
        }

        getClipBounds(bounds?:Rect):Rect {
            if (!this.mCurrentClip) this.mCurrentClip = Canvas.obtainRect();
            let rect = bounds || Canvas.obtainRect();
            rect.set(this.mCurrentClip);
            return rect;
        }

        quickReject(rect:Rect):boolean;
        quickReject(left:number, top:number, right:number, bottom:number):boolean;
        quickReject(...args):boolean {
            if (!this.mCurrentClip) return false;
            if (args.length == 1) {
                return !this.mCurrentClip.intersects(<Rect>args[0]);
            } else {
                let [left=0, t=0, right=0, bottom=0] = args;
                return !this.mCurrentClip.intersects(left, t, right, bottom);
            }
        }

        drawCanvas(canvas:Canvas, offsetX:number, offsetY:number):void {
            this._mCanvasContent.drawImage(canvas.canvasElement, offsetX, offsetY);
        }

        drawRect(rect:Rect, paint:Paint);
        drawRect(left:number, top:number, right:number, bottom:number, paint:Paint);
        drawRect(...args) {
            if (args.length == 2) {
                let rect:Rect = args[0];
                this.drawRect(rect.left, rect.top, rect.right, rect.bottom, args[1]);
            } else {
                let [left, top, right, bottom, paint] = args;
                this._mCanvasContent.save();
                paint._setToCanvasContent(this._mCanvasContent);
                this._mCanvasContent.fillRect(left, top, right-left, bottom-top);
                this._mCanvasContent.restore();
            }
        }

        /**
         * Draw the text, with origin at (x,y), using the specified paint. The
         * origin is interpreted based on the Align setting in the paint.
         *
         * @param text  The text to be drawn
         * @param x     The x-coordinate of the origin of the text being drawn
         * @param y     The y-coordinate of the origin of the text being drawn
         * @param paint The paint used for the text (e.g. color, size, style)
         */
        drawText(text:string, x:number, y:number, paint:Paint):void  {
            this._mCanvasContent.save();
            if(paint){
                paint._setToCanvasContent(this._mCanvasContent);
                switch (paint.getStyle()){
                    case Paint.Style.STROKE:
                        this._mCanvasContent.strokeText(text, x, y);
                        break;
                    case Paint.Style.FILL_AND_STROKE:
                        this._mCanvasContent.strokeText(text, x, y);
                        this._mCanvasContent.fillText(text, x, y);
                        break;
                    case Paint.Style.FILL:
                    default :
                        this._mCanvasContent.fillText(text, x, y);
                        break;
                }
            }else{
                this._mCanvasContent.fillText(text, x, y);
            }
            this._mCanvasContent.restore();
        }
    }
}
/**
 * Created by linfaxin on 15/10/13.
 */
///<reference path="../util/Pools.ts"/>
///<reference path="../util/Log.ts"/>
///<reference path="Rect.ts"/>
///<reference path="Color.ts"/>
///<reference path="Paint.ts"/>
///<reference path="Path.ts"/>
///<reference path="Matrix.ts"/>
///<reference path="../../androidui/image/PlatformImage.ts"/>

module android.graphics {
    import Pools = android.util.Pools;
    import Log = android.util.Log;
    import Rect = android.graphics.Rect;
    import Color = android.graphics.Color;
    import PlatformImage = androidui.image.PlatformImage;

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
        private mTempMatrixValue = new Array<number>(9);


        /**
         * Flag for drawTextRun indicating left-to-right run direction.
         * @hide
         */
        static DIRECTION_LTR = 0;

        /**
         * Flag for drawTextRun indicating right-to-left run direction.
         * @hide
         */
        static DIRECTION_RTL = 1;


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
            this.mWidth = width;
            this.mHeight = height;
            this.init();
        }

        protected init() {
            this.mCanvasElement = document.createElement("canvas");
            this.mCanvasElement.width = this.mWidth;
            this.mCanvasElement.height = this.mHeight;
            this._mCanvasContent = this.mCanvasElement.getContext("2d");
            this.mCurrentClip = Canvas.obtainRect();
            this.mCurrentClip.set(0, 0, this.mWidth, this.mHeight);
            this._saveCount = this.save();

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

        }

        recycle(){
            Canvas.recycleRect(this.mCurrentClip);
            Canvas.recycleRect(...this.mClipStateMap.values());
            for(let rects of this.shouldDoRectBeforeRestoreMap.values()){
                Canvas.recycleRect(...rects);
            }
            this.mCanvasElement.width = this.mCanvasElement.height = 0;
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

        concat(m:android.graphics.Matrix):void {
            //TODO effect mCurrentClip
            let v = this.mTempMatrixValue;
            m.getValues(v);
            this._mCanvasContent.transform(v[Matrix.MSCALE_X], v[Matrix.MSKEW_X], v[Matrix.MSKEW_Y], v[Matrix.MSCALE_Y],
                                            v[Matrix.MTRANS_X], v[Matrix.MTRANS_Y]);
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

            this._mCanvasContent.beginPath();
            this._mCanvasContent.rect(Math.floor(rect.left), Math.floor(rect.top),
                Math.ceil(rect.width()), Math.ceil(rect.height()));
            this._mCanvasContent.clip();

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

        drawImage(image:PlatformImage, dstRect?:Rect, paint?:Paint):void {

            if(paint){
                this._mCanvasContent.save();
                paint._setToCanvasContent(this._mCanvasContent);
            }

            if(!dstRect){
                this._mCanvasContent.drawImage(image.getImage(), 0, 0);
            }else{
                this._mCanvasContent.drawImage(image.getImage(), dstRect.left, dstRect.top, dstRect.width(), dstRect.height());
            }

            if(paint) this._mCanvasContent.restore();
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
         * Draw the specified path using the specified paint. The path will be
         * filled or framed based on the Style in the paint.
         *
         * @param path  The path to be drawn
         * @param paint The paint used to draw the path
         */
        drawPath(path:Path, paint:Paint):void  {
            //TODO set path
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
        drawText_count(text:string, index:number, count:number, x:number, y:number, paint:Paint):void  {
            if ((index | count | (index + count) | (text.length - index - count)) < 0) {
                throw Error(`new IndexOutOfBoundsException()`);
            }
            this.drawText(text.substr(index, count), x, y, paint);
        }

        /**
         * Draw the text, with origin at (x,y), using the specified paint.
         * The origin is interpreted based on the Align setting in the paint.
         *
         * @param text  The text to be drawn
         * @param start The index of the first character in text to draw
         * @param end   (end - 1) is the index of the last character in text to draw
         * @param x     The x-coordinate of the origin of the text being drawn
         * @param y     The y-coordinate of the origin of the text being drawn
         * @param paint The paint used for the text (e.g. color, size, style)
         */
        drawText_end(text:string, start:number, end:number, x:number, y:number, paint:Paint):void  {
            if ((start | end | (end - start) | (text.length - end)) < 0) {
                throw Error(`new IndexOutOfBoundsException()`);
            }
            this.drawText(text.substring(start, end), x, y, paint);
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


        /**
         * Render a run of all LTR or all RTL text, with shaping. This does not run
         * bidi on the provided text, but renders it as a uniform right-to-left or
         * left-to-right run, as indicated by dir. Alignment of the text is as
         * determined by the Paint's TextAlign value.
         *
         * @param text the text to render
         * @param index the start of the text to render
         * @param count the count of chars to render
         * @param contextIndex the start of the context for shaping.  Must be
         *         no greater than index.
         * @param contextCount the number of characters in the context for shaping.
         *         ContexIndex + contextCount must be no less than index
         *         + count.
         * @param x the x position at which to draw the text
         * @param y the y position at which to draw the text
         * @param dir the run direction, either {@link #DIRECTION_LTR} or
         *         {@link #DIRECTION_RTL}.
         * @param paint the paint
         * @hide
         */
        drawTextRun_count(text:string, index:number, count:number, contextIndex:number, contextCount:number, x:number, y:number, dir:number, paint:Paint):void  {
            //if (text == null) {
            //    throw Error(`new NullPointerException("text is null")`);
            //}
            //if (paint == null) {
            //    throw Error(`new NullPointerException("paint is null")`);
            //}
            //if ((index | count | text.length - index - count) < 0) {
            //    throw Error(`new IndexOutOfBoundsException()`);
            //}
            //if (dir != Canvas.DIRECTION_LTR && dir != Canvas.DIRECTION_RTL) {
            //    throw Error(`new IllegalArgumentException("unknown dir: " + dir)`);
            //}
            this.drawText_count(text, index, count, x, y, paint);
        }

        /**
         * Render a run of all LTR or all RTL text, with shaping. This does not run
         * bidi on the provided text, but renders it as a uniform right-to-left or
         * left-to-right run, as indicated by dir. Alignment of the text is as
         * determined by the Paint's TextAlign value.
         *
         * @param text the text to render
         * @param start the start of the text to render. Data before this position
         *            can be used for shaping context.
         * @param end the end of the text to render. Data at or after this
         *            position can be used for shaping context.
         * @param x the x position at which to draw the text
         * @param y the y position at which to draw the text
         * @param dir the run direction, either 0 for LTR or 1 for RTL.
         * @param paint the paint
         * @hide
         */
        drawTextRun_end(text:string, start:number, end:number, contextStart:number, contextEnd:number, x:number, y:number, dir:number, paint:Paint):void  {
            //if (text == null) {
            //    throw Error(`new NullPointerException("text is null")`);
            //}
            //if (paint == null) {
            //    throw Error(`new NullPointerException("paint is null")`);
            //}
            //if ((start | end | end - start | text.length() - end) < 0) {
            //    throw Error(`new IndexOutOfBoundsException()`);
            //}
            //let flags:number = dir == 0 ? 0 : 1;
            //if (text instanceof string || text instanceof SpannedString || text instanceof SpannableString) {
            //    Canvas.native_drawTextRun(this.mNativeCanvas, text.toString(), start, end, contextStart, contextEnd, x, y, flags, paint.mNativePaint);
            //} else if (text instanceof GraphicsOperations) {
            //    (<GraphicsOperations> text).drawTextRun(this, start, end, contextStart, contextEnd, x, y, flags, paint);
            //} else {
            //    let contextLen:number = contextEnd - contextStart;
            //    let len:number = end - start;
            //    let buf:char[] = TemporaryBuffer.obtain(contextLen);
            //    TextUtils.getChars(text, contextStart, contextEnd, buf, 0);
            //    Canvas.native_drawTextRun(this.mNativeCanvas, buf, start - contextStart, len, 0, contextLen, x, y, flags, paint.mNativePaint);
            //    TemporaryBuffer.recycle(buf);
            //}
            this.drawText_end(text, start, end, x, y, paint);
        }

    }
}
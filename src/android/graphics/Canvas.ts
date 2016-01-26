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
///<reference path="../../androidui/image/NetImage.ts"/>

module android.graphics {
    import Pools = android.util.Pools;
    import Log = android.util.Log;
    import Rect = android.graphics.Rect;
    import Color = android.graphics.Color;
    import NetImage = androidui.image.NetImage;

    export class Canvas {
        private mCanvasElement:HTMLCanvasElement;
        private mWidth = 0;
        private mHeight = 0;
        private _mCanvasContent:CanvasRenderingContext2D;
        private _saveCount = 0;
        private mCurrentClip:Rect;
        private mClipStateMap = new Map<number, Rect>();
        private static TempMatrixValue = new Array<number>(9);


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


        private static sRectPool = new Pools.SynchronizedPool<Rect>(20);
        private static obtainRect(copy?:Rect):Rect {
            let rect = Canvas.sRectPool.acquire();
            if(!rect) rect = new Rect();
            if(copy) rect.set(copy);
            return rect;
        }
        private static recycleRect(rect:Rect) {
                rect.setEmpty();
                Canvas.sRectPool.release(rect);
        }

        constructor(width:number, height:number) {
            this.mWidth = width;
            this.mHeight = height;
            this.mCurrentClip = Canvas.obtainRect();
            this.mCurrentClip.set(0, 0, this.mWidth, this.mHeight);
            this.initImpl();
        }

        protected initImpl():void {
            this.mCanvasElement = document.createElement("canvas");
            this.mCanvasElement.width = this.mWidth;
            this.mCanvasElement.height = this.mHeight;
            this._mCanvasContent = this.mCanvasElement.getContext("2d");
            this._saveCount = this.save();//is need?
        }

        recycle():void {
            Canvas.recycleRect(this.mCurrentClip);
            for(let rect of this.mClipStateMap.values()) {
                Canvas.recycleRect(rect);
            }
            this.recycleImpl();
        }
        protected recycleImpl():void {
            if(this.mCanvasElement) this.mCanvasElement.width = this.mCanvasElement.height = 0;
        }

        public getHeight():number {
            return this.mHeight;
        }

        public getWidth():number {
            return this.mWidth;
        }


        translate(dx:number, dy:number):void {
            if(dx==0 && dy==0) return;
            if(this.mCurrentClip) this.mCurrentClip.offset(-dx, -dy);
            this.translateImpl(dx, dy);
        }
        protected translateImpl(dx:number, dy:number):void {
            this._mCanvasContent.translate(dx, dy);
        }


        scale(sx:number, sy:number, px?:number, py?:number):void {
            //TODO effect mCurrentClip
            if (px || py) this.translate(px, py);
            this.scaleImpl(sx, sy);
            if (px || py) this.translate(-px, -py);
        }

        protected scaleImpl(sx:number, sy:number):void {
            this._mCanvasContent.scale(sx, sy);
        }

        rotate(degrees:number, px?:number, py?:number):void {
            //TODO effect mCurrentClip
            if (px || py) this.translate(px, py);
            this.rotateImpl(degrees);
            if (px || py) this.translate(-px, -py);
        }

        protected rotateImpl(degrees:number):void {
            this._mCanvasContent.rotate(degrees*Math.PI/180);
        }

        concat(m:android.graphics.Matrix):void {
            //TODO effect mCurrentClip
            let v = Canvas.TempMatrixValue;
            m.getValues(v);
            this.concatImpl(v[Matrix.MSCALE_X], v[Matrix.MSKEW_X], v[Matrix.MTRANS_X], v[Matrix.MSKEW_Y], v[Matrix.MSCALE_Y],
                v[Matrix.MTRANS_Y], v[Matrix.MPERSP_0], v[Matrix.MPERSP_1], v[Matrix.MPERSP_2]);
        }
        protected concatImpl(MSCALE_X:number, MSKEW_X:number, MTRANS_X:number, MSKEW_Y:number, MSCALE_Y:number,
                             MTRANS_Y:number, MPERSP_0:number, MPERSP_1:number, MPERSP_2:number){
            this._mCanvasContent.transform(MSCALE_X, -MSKEW_X, -MSKEW_Y, MSCALE_Y, MTRANS_X, MTRANS_Y);
        }

        drawRGB(r:number, g:number, b:number):void {
            this.drawARGB(255, r, g, b);
        }

        drawARGB(a:number, r:number, g:number, b:number):void {
            this.drawARGBImpl(a, r, g, b);
        }

        drawColor(color:number){
            this.drawARGB(Color.alpha(color), Color.red(color), Color.green(color), Color.blue(color));
        }

        protected drawARGBImpl(a:number, r:number, g:number, b:number):void {
            let preStyle = this._mCanvasContent.fillStyle;
            this._mCanvasContent.fillStyle = `rgba(${r},${g},${b},${a/255})`;
            this._mCanvasContent.fillRect(this.mCurrentClip.left, this.mCurrentClip.top, this.mCurrentClip.width(), this.mCurrentClip.height());
            this._mCanvasContent.fillStyle = preStyle;
        }

        clearColor():void {
            this.clearRectImpl(this.mCurrentClip.left, this.mCurrentClip.top, this.mCurrentClip.width(), this.mCurrentClip.height());
        }

        protected clearRectImpl(left:number, top:number, width:number, height:number):void {
            this._mCanvasContent.clearRect(left, top, width, height);
        }


        save():number {
            this.saveImpl();
            if(this.mCurrentClip) this.mClipStateMap.set(this._saveCount, Canvas.obtainRect(this.mCurrentClip));
            this._saveCount++;

            return this._saveCount;
        }

        protected saveImpl():void {
            this._mCanvasContent.save();
        }

        restore() {
            this._saveCount--;
            this.restoreImpl();
            let savedClip = this.mClipStateMap.get(this._saveCount);
            if(savedClip){
                this.mClipStateMap.delete(this._saveCount);
                this.mCurrentClip.set(savedClip);
                Canvas.recycleRect(savedClip);
            }
        }
        protected restoreImpl():void {
            this._mCanvasContent.restore();
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
        clipRect(left:number, top:number, right:number, bottom:number, radiusTopLeft:number, radiusTopRight:number, radiusBottomRight:number, radiusBottomLeft:number):boolean;
        clipRect(...args):boolean {
            let rect = Canvas.obtainRect();

            if (args.length === 1) {
                rect.set(args[0]);

            }else {
                let [left=0, t=0, right=0, bottom=0] = args;
                rect.set(left, t, right, bottom);
            }

            if(args.length === 4 || (!args[4] && !args[5] && !args[6] && !args[7])){
                this.clipRectImpl(Math.floor(rect.left), Math.floor(rect.top), Math.ceil(rect.width()), Math.ceil(rect.height()));

            }else if(args.length===8 && (args[4]!=0 || args[5]!= 0 || args[6]!=0 || args[7]!=0)){
                this.clipRoundRectImpl(Math.floor(rect.left), Math.floor(rect.top), Math.ceil(rect.width()), Math.ceil(rect.height()),
                    args[4], args[5], args[6], args[7]);
            }

            this.mCurrentClip.intersect(rect);

            let r = rect.isEmpty();
            Canvas.recycleRect(rect);
            return r;
        }

        protected clipRectImpl(left:number, top:number, width:number, height:number):void {
            this._mCanvasContent.beginPath();
            this._mCanvasContent.rect(left, top, width, height);
            this._mCanvasContent.clip();
        }

        clipRoundRect(r:Rect, radiusTopLeft:number, radiusTopRight:number, radiusBottomRight:number, radiusBottomLeft:number):boolean{
            let rect = Canvas.obtainRect(r);

            this.clipRoundRectImpl(Math.floor(rect.left), Math.floor(rect.top), Math.ceil(rect.width()), Math.ceil(rect.height()),
                radiusTopLeft, radiusTopRight, radiusBottomRight, radiusBottomLeft);
            this.mCurrentClip.intersect(rect);

            let empty = rect.isEmpty();
            Canvas.recycleRect(rect);
            return empty;

        }
        protected clipRoundRectImpl(left:number, top:number, width:number, height:number, radiusTopLeft:number,
                                    radiusTopRight:number, radiusBottomRight:number, radiusBottomLeft:number):void {
            this.doRoundRectPath(left, top, width, height, radiusTopLeft, radiusTopRight, radiusBottomRight, radiusBottomLeft);
            this._mCanvasContent.clip();
        }

        private doRoundRectPath(left:number, top:number, width:number, height:number, radiusTopLeft:number,
                                radiusTopRight:number, radiusBottomRight:number, radiusBottomLeft:number):void{

            let scale1 = height / (radiusTopLeft + radiusBottomLeft);
            let scale2 = height / (radiusTopRight + radiusBottomRight);
            let scale3 = width / (radiusTopLeft + radiusTopRight);
            let scale4 = width / (radiusBottomLeft + radiusBottomRight);
            let scale = Math.min(scale1, scale2, scale3, scale4);
            if(scale<1) {
                radiusTopLeft *= scale;
                radiusTopRight *= scale;
                radiusBottomRight *= scale;
                radiusBottomLeft *= scale;
            }

            let ctx = this._mCanvasContent;
            ctx.beginPath();
            ctx.moveTo(left+radiusTopLeft, top);
            ctx.arcTo(left+width, top, left+width, top+radiusTopRight, radiusTopRight);
            ctx.arcTo(left+width, top+height, left+width-radiusBottomRight, top+height, radiusBottomRight);
            ctx.arcTo(left, top+height, left, top+height-radiusBottomLeft, radiusBottomLeft);
            ctx.arcTo(left, top, left+radiusTopLeft, top, radiusTopLeft);

            ctx.closePath();
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

        drawCanvas(canvas:Canvas, offsetX=0, offsetY=0):void {
            this.drawCanvasImpl(canvas, offsetX, offsetY);
        }

        protected drawCanvasImpl(canvas:Canvas, offsetX:number, offsetY:number):void {
            this._mCanvasContent.drawImage(canvas.mCanvasElement, offsetX, offsetY);
        }

        drawImage(image:NetImage, srcRect?:Rect, dstRect?:Rect, paint?:Paint):void {
            let paintEmpty = !paint || paint.isEmpty();
            if(!paintEmpty){
                this.saveImpl();
                paint.applyToCanvas(this);
            }

            this.drawImageImpl(image, srcRect, dstRect);

            if(!paintEmpty) this.restoreImpl();
        }

        protected drawImageImpl(image:NetImage, srcRect?:Rect, dstRect?:Rect):void {
            if(!dstRect){
                if(!srcRect){
                    this._mCanvasContent.drawImage(image.browserImage, 0, 0);
                }else{
                    this._mCanvasContent.drawImage(image.browserImage,
                        srcRect.left, srcRect.top, srcRect.width(), srcRect.height(),
                        0, 0, image.browserImage.width, image.browserImage.height
                    );
                }

            }else{
                if(dstRect.isEmpty()) return;
                if(!srcRect){
                    this._mCanvasContent.drawImage(image.browserImage, dstRect.left, dstRect.top, dstRect.width(), dstRect.height());
                }else{
                    this._mCanvasContent.drawImage(image.browserImage,
                        srcRect.left, srcRect.top, srcRect.width(), srcRect.height(),
                        dstRect.left, dstRect.top, dstRect.width(), dstRect.height()
                    );
                }
            }
        }

        drawRect(rect:Rect, paint:Paint);
        drawRect(left:number, top:number, right:number, bottom:number, paint:Paint);
        drawRect(...args) {
            if (args.length == 2) {
                let rect:Rect = args[0];
                this.drawRect(rect.left, rect.top, rect.right, rect.bottom, args[1]);
            } else {
                let [left, top, right, bottom, paint] = args;
                let paintEmpty = !paint || paint.isEmpty();
                if(!paintEmpty){
                    this.saveImpl();
                    paint.applyToCanvas(this);
                }
                this.drawRectImpl(left, top, right-left, bottom-top, paint);
                if(!paintEmpty) this.restoreImpl();
            }
        }

        protected drawRectImpl(left:number, top:number, width:number, height:number, paint:Paint){
            switch (paint.getStyle()){
                case Paint.Style.STROKE:
                    this._mCanvasContent.strokeRect(left, top, width, height);
                    break;
                case Paint.Style.FILL_AND_STROKE:
                    this._mCanvasContent.fillRect(left, top, width, height);
                    this._mCanvasContent.strokeRect(left, top, width, height);
                    break;
                case Paint.Style.FILL:
                default :
                    this._mCanvasContent.fillRect(left, top, width, height);
                    break;
            }
        }

        private applyFillOrStrokeToContent(style:Paint.Style){
            switch (style){
                case Paint.Style.STROKE:
                    this._mCanvasContent.stroke();
                    break;
                case Paint.Style.FILL_AND_STROKE:
                    this._mCanvasContent.fill();
                    this._mCanvasContent.stroke();
                    break;
                case Paint.Style.FILL:
                default :
                    this._mCanvasContent.fill();
                    break;
            }
        }

        /**
         * Draw the specified oval using the specified paint. The oval will be
         * filled or framed based on the Style in the paint.
         *
         * @param oval The rectangle bounds of the oval to be drawn
         */
        drawOval(oval:RectF, paint:Paint):void {
            if (oval == null) {
                throw Error(`new NullPointerException()`);
            }
            this.drawOvalImpl(oval, paint);
        }

        protected drawOvalImpl(oval:RectF, paint:Paint):void {
            let paintEmpty = !paint || paint.isEmpty();
            if(!paintEmpty){
                this.saveImpl();
                paint.applyToCanvas(this);
            }

            let ctx = this._mCanvasContent;
            ctx.beginPath();
            let cx = oval.centerX();
            let cy = oval.centerY();
            let rx = oval.width()/2;
            let ry = oval.height()/2;
            ctx.save();
            ctx.translate(cx-rx, cy-ry);
            ctx.scale(rx, ry);
            ctx.arc(1, 1, 1, 0, 2 * Math.PI, false);
            ctx.restore();
            this.applyFillOrStrokeToContent(paint.getStyle());

            if(!paintEmpty) this.restoreImpl();
        }


        /**
         * Draw the specified circle using the specified paint. If radius is <= 0,
         * then nothing will be drawn. The circle will be filled or framed based
         * on the Style in the paint.
         *
         * @param cx     The x-coordinate of the center of the cirle to be drawn
         * @param cy     The y-coordinate of the center of the cirle to be drawn
         * @param radius The radius of the cirle to be drawn
         * @param paint  The paint used to draw the circle
         */
        drawCircle(cx:number, cy:number, radius:number, paint:Paint):void  {
            this.drawCircleImpl(cx, cy, radius, paint);
        }

        protected drawCircleImpl(cx:number, cy:number, radius:number, paint:Paint):void  {
            let paintEmpty = !paint || paint.isEmpty();
            if(!paintEmpty){
                this.saveImpl();
                paint.applyToCanvas(this);
            }

            let ctx = this._mCanvasContent;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, 2 * Math.PI, false);
            this.applyFillOrStrokeToContent(paint.getStyle());

            if(!paintEmpty) this.restoreImpl();
        }

        /**
         * <p>Draw the specified arc, which will be scaled to fit inside the
         * specified oval.</p>
         *
         * <p>If the start angle is negative or >= 360, the start angle is treated
         * as start angle modulo 360.</p>
         *
         * <p>If the sweep angle is >= 360, then the oval is drawn
         * completely. Note that this differs slightly from SkPath::arcTo, which
         * treats the sweep angle modulo 360. If the sweep angle is negative,
         * the sweep angle is treated as sweep angle modulo 360</p>
         *
         * <p>The arc is drawn clockwise. An angle of 0 degrees correspond to the
         * geometric angle of 0 degrees (3 o'clock on a watch.)</p>
         *
         * @param oval       The bounds of oval used to define the shape and size
         *                   of the arc
         * @param startAngle Starting angle (in degrees) where the arc begins
         * @param sweepAngle Sweep angle (in degrees) measured clockwise
         * @param useCenter If true, include the center of the oval in the arc, and
         close it if it is being stroked. This will draw a wedge
         * @param paint      The paint used to draw the arc
         */
        drawArc(oval:RectF, startAngle:number, sweepAngle:number, useCenter:boolean, paint:Paint):void  {
            if (oval == null) {
                throw Error(`new NullPointerException()`);
            }
            this.drawArcImpl(oval, startAngle, sweepAngle, useCenter, paint);
        }

        protected drawArcImpl(oval:RectF, startAngle:number, sweepAngle:number, useCenter:boolean, paint:Paint):void  {
            let paintEmpty = !paint || paint.isEmpty();
            if(!paintEmpty){
                this.saveImpl();
                paint.applyToCanvas(this);
            }
            let ctx = this._mCanvasContent;
            ctx.save();
            ctx.beginPath();
            let cx = oval.centerX();
            let cy = oval.centerY();
            let rx = oval.width()/2;
            let ry = oval.height()/2;

            ctx.translate(cx-rx, cy-ry);
            ctx.scale(rx, ry);
            ctx.arc(1, 1, 1, startAngle / 180 * Math.PI, (sweepAngle+startAngle) / 180 * Math.PI, false);
            if(useCenter){
                ctx.lineTo(1, 1);
                ctx.closePath();
            }
            ctx.restore();
            this.applyFillOrStrokeToContent(paint.getStyle());
            if(!paintEmpty) this.restoreImpl();
        }

        /**
         * Draw the specified round-rect using the specified paint. The roundrect
         * will be filled or framed based on the Style in the paint.
         *
         * @param rect  The rectangular bounds of the roundRect to be drawn
         * @param rx    The x-radius of the oval used to round the corners
         * @param ry    The y-radius of the oval used to round the corners
         * @param paint The paint used to draw the roundRect
         */
        drawRoundRect(rect:RectF, radiusTopLeft:number,
                      radiusTopRight:number, radiusBottomRight:number, radiusBottomLeft:number, paint:Paint):void {
            if (rect == null) {
                throw Error(`new NullPointerException()`);
            }
            this.drawRoundRectImpl(rect, radiusTopLeft, radiusTopRight, radiusBottomRight, radiusBottomLeft, paint);
        }

        protected drawRoundRectImpl(rect:RectF, radiusTopLeft:number,
                                    radiusTopRight:number, radiusBottomRight:number, radiusBottomLeft:number, paint:Paint):void  {
            let paintEmpty = !paint || paint.isEmpty();
            if(!paintEmpty){
                this.saveImpl();
                paint.applyToCanvas(this);
            }

            this.doRoundRectPath(rect.left, rect.top, rect.width(), rect.height(), radiusTopLeft, radiusTopRight, radiusBottomRight, radiusBottomLeft);
            this.applyFillOrStrokeToContent(paint.getStyle());

            if(!paintEmpty) this.restoreImpl();
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
        drawText(text:string, x:number, y:number, paint:Paint):void {
            let paintEmpty = !paint || paint.isEmpty();
            if(!paintEmpty){
                this.saveImpl();
                paint.applyToCanvas(this);
            }

            this.drawTextImpl(text, x, y, paint ? paint.getStyle() : null);

            if(!paintEmpty) this.restoreImpl();
        }


        protected drawTextImpl(text:string, x:number, y:number, style:Paint.Style):void {
            switch (style){
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

        static measureText(text:string, textSize:number):number {
            if(textSize==null || textSize===0) return 0;
            return Canvas.measureTextImpl(text, textSize);
        }

        private static _measureTextContext:CanvasRenderingContext2D = document.createElement('canvas').getContext('2d');
        private static _measureCacheTextSize = 1000;
        private static _static = (()=>{
            Canvas._measureTextContext.font = Canvas._measureCacheTextSize + 'px ' + Canvas.getMeasureTextFontFamily();
        })();
        private static _measureCacheMap = new Map<number, number>();//<char, width>;
        protected static measureTextImpl(text:string, textSize:number):number {
            let width = 0;
            for(let i=0,length=text.length; i<length; i++){
                let c = text.charCodeAt(i);

                let cWidth:number = Canvas._measureCacheMap.get(c);
                if(cWidth == null){
                    cWidth = Canvas._measureTextContext.measureText(text[i]).width;
                    Canvas._measureCacheMap.set(c, cWidth);
                }
                width += (cWidth * textSize / Canvas._measureCacheTextSize);
            }
            return width;
        }
        protected static getMeasureTextFontFamily():string {
            let fontParts = Canvas._measureTextContext.font.split(' ');
            return fontParts[fontParts.length - 1];
        }


        setColor(color:number, style?:Paint.Style):void {
            if(typeof color === 'number'){
                this.setColorImpl(color, style);
            }
        }

        protected setColorImpl(color:number, style?:Paint.Style):void {
            let colorS = Color.toRGBAFunc(color);
            switch (style){
                case Paint.Style.STROKE:
                    this._mCanvasContent.strokeStyle = colorS;
                    break;
                case Paint.Style.FILL:
                    this._mCanvasContent.fillStyle = colorS;
                    break;
                default :
                case Paint.Style.FILL_AND_STROKE:
                    this._mCanvasContent.fillStyle = colorS;
                    this._mCanvasContent.strokeStyle = colorS;
                    break;
            }
        }

        /**
         * @param alpha [0, 1]
         */
        multiplyAlpha(alpha:number):void {
            if(typeof alpha === 'number'){
                this.multiplyAlphaImpl(alpha);
            }
        }

        protected multiplyAlphaImpl(alpha:number):void {
            this._mCanvasContent.globalAlpha *= alpha;
        }

        /**
         * @param alpha [0, 1]
         */
        setAlpha(alpha:number):void {
            if(typeof alpha === 'number'){
                this.setAlphaImpl(alpha);
            }
        }

        protected setAlphaImpl(alpha:number):void {
            this._mCanvasContent.globalAlpha = alpha;
        }

        setTextAlign(align:string):void {
            if(align!=null) this.setTextAlignImpl(align);
        }

        protected setTextAlignImpl(align:string):void {
            this._mCanvasContent.textAlign = align;
        }

        setLineWidth(width:number):void {
            if(width!=null) this.setLineWidthImpl(width);
        }

        protected setLineWidthImpl(width:number):void {
            this._mCanvasContent.lineWidth = width;
        }

        setLineCap(lineCap:string):void {
            if(lineCap!=null) this.setLineCapImpl(lineCap);
        }

        protected setLineCapImpl(lineCap:string):void {
            this._mCanvasContent.lineCap = lineCap;
        }

        setLineJoin(lineJoin:string):void {
            if(lineJoin!=null) this.setLineJoinImpl(lineJoin);
        }

        protected setLineJoinImpl(lineJoin:string):void {
            this._mCanvasContent.lineJoin = lineJoin;
        }

        setShadow(radius:number, dx:number, dy:number, color:number):void {
            if(radius>0){
                this.setShadowImpl(radius, dx, dy, color);
            }
        }

        protected setShadowImpl(radius:number, dx:number, dy:number, color:number):void {
            this._mCanvasContent.shadowBlur = radius;
            this._mCanvasContent.shadowOffsetX = dx;
            this._mCanvasContent.shadowOffsetY = dy;
            this._mCanvasContent.shadowColor = Color.toRGBAFunc(color);
        }

        setFontSize(size:number):void {
            if(typeof size === 'number'){
                this.setFontSizeImpl(size);
            }
        }

        protected setFontSizeImpl(size:number):void {
            //font
            const fontStyles = [];
            if (size != null) {
                fontStyles.push(size + 'px');
            }
            if (fontStyles.length > 0) {
                let cFont = this._mCanvasContent.font;
                let fontParts = cFont.split(' ');
                fontStyles.push(fontParts[fontParts.length - 1]);//font family
                let font = fontStyles.join(' ');
                if(font!=cFont) this._mCanvasContent.font = font;
            }
        }

        setFont(fontName:string):void {
            if(fontName!=null){
                this.setFontImpl(fontName);
            }
        }
        protected setFontImpl(fontName:string):void {
            let cFont = this._mCanvasContent.font;
            let fontParts = cFont.split(' ');
            fontParts[fontParts.length - 1] = fontName;//font family
            let font = fontParts.join(' ');
            if(font!=cFont) this._mCanvasContent.font = font;
        }
    }
}
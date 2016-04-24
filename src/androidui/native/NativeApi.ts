/**
 * Created by linfaxin on 15/12/14.
 */
///<reference path="../../android/view/Surface.ts"/>
///<reference path="../../android/graphics/Canvas.ts"/>
///<reference path="NativeSurface.ts"/>
///<reference path="NativeCanvas.ts"/>
///<reference path="NativeImage.ts"/>


module androidui.native {

    const AndroidJsBridgeProperty = 'AndroidUIRuntime';//android js bridge name
    const JSBridge:Bridge = window[AndroidJsBridgeProperty];

    export class NativeApi {
        static surface:NativeApi.SurfaceApi;
        static canvas:NativeApi.CanvasApi;
        static image:NativeApi.ImageApi;
    }

    export module NativeApi {
        class BatchCall {
            //private calls:NativeCall[] = [];
            private calls:String[] = [];
            pushCall(method:string, methodArgs:any[]){
                //this.calls.push(new NativeCall(method, methodArgs));
                this.calls.push(method + JSON.stringify(methodArgs));
            }
            clear(){
                this.calls = [];
            }
            toString(){
                return this.calls.join('\n');
            }
        }
        //class NativeCall {
        //    method:string;
        //    args:any[];
        //
        //    constructor(methodName:string, methodArgs:any[]) {
        //        this.method = methodName;
        //        this.args = methodArgs;
        //    }
        //    toString(){
        //        return this.method + JSON.stringify(this.args);
        //    }
        //}

        let batchCall = new BatchCall();

        export class SurfaceApi {
            createSurface(surfaceId:number, left:number, top:number, right:number, bottom:number):void{
                JSBridge.createSurface(surfaceId, left, top, right, bottom);
            }
            onSurfaceBoundChange(surfaceId:number, left:number, top:number, right:number, bottom:number):void{
                JSBridge.onSurfaceBoundChange(surfaceId, left, top, right, bottom);
            }
            /** lock area to be draw on. The lock area can be modified.*/
            lockCanvas(surfaceId:number, canvasId:number, left:number, top:number, right:number, bottom:number):void{
                batchCall.pushCall('31', [surfaceId, canvasId, left, top, right, bottom]);
            }
            unlockCanvasAndPost(surfaceId:number, canvasId:number):void{
                batchCall.pushCall('32', [surfaceId, canvasId]);
                JSBridge.batchCall(batchCall.toString());
                batchCall.clear();
            }
        }

        export class CanvasApi {
            createCanvas(canvasId:number, width:number, height:number):void{
                batchCall.pushCall('33', [canvasId, width, height]);
            }
            recycleCanvas(canvasId:number):void{
                batchCall.pushCall('34', [canvasId]);
            }
            translate(canvasId:number, dx:number, dy:number):void{
                batchCall.pushCall('35', [canvasId, dx, dy]);
            }
            scale(canvasId:number, sx:number, sy:number):void{
                batchCall.pushCall('36', [canvasId, sx, sy]);
            }
            rotate(canvasId:number, degrees:number):void{
                batchCall.pushCall('37', [canvasId, degrees]);
            }
            concat(canvasId:number, MSCALE_X:number, MSKEW_X:number, MTRANS_X:number, MSKEW_Y:number, MSCALE_Y:number, MTRANS_Y:number):void{
                batchCall.pushCall('38', [canvasId, MSCALE_X, MSKEW_X, MTRANS_X, MSKEW_Y, MSCALE_Y, MTRANS_Y]);
            }
            drawColor(canvasId:number, color:number):void{
                batchCall.pushCall('39', [canvasId, color]);
            }
            clearColor(canvasId:number):void{
                batchCall.pushCall('40', [canvasId]);
            }
            drawRect(canvasId:number, left:number, top:number, width:number, height:number, style:android.graphics.Paint.Style):void{
                batchCall.pushCall('41', [canvasId, left, top, width, height, style||android.graphics.Paint.Style.FILL]);
            }
            clipRect(canvasId:number, left:number, top:number, width:number, height:number):void{
                batchCall.pushCall('42', [canvasId, left, top, width, height]);
            }
            save(canvasId:number):void{
                batchCall.pushCall('43', [canvasId]);
            }
            restore(canvasId:number):void{
                batchCall.pushCall('44', [canvasId]);
            }
            drawCanvas(canvasId:number, drawCanvasId:number, offsetX:number, offsetY:number){
                batchCall.pushCall('45', [canvasId, drawCanvasId, offsetX, offsetY]);
            }
            drawImage2args(canvasId:number, drawImageId:number, left:number, top:number):void {
                batchCall.pushCall('70', [canvasId, drawImageId, left, top]);
            }
            drawImage4args(canvasId:number, drawImageId:number, dstLeft:number, dstTop:number, dstRight:number, dstBottom:number):void {
                if(dstLeft==null || isNaN(dstLeft)) throw new Error('drawImage4args error');
                batchCall.pushCall('71', [canvasId, drawImageId, dstLeft, dstTop, dstRight, dstBottom]);
            }
            drawImage8args(canvasId:number, drawImageId:number, srcLeft:number, srcTop:number, srcRight:number, srcBottom:number,
                           dstLeft:number, dstTop:number, dstRight:number, dstBottom:number):void {
                batchCall.pushCall('72', [canvasId, drawImageId, srcLeft, srcTop, srcRight, srcBottom, dstLeft, dstTop, dstRight, dstBottom]);
            }
            /**
             * @param canvasId
             * @param text text to be draw
             * @param x left position to start draw text
             * @param y right position to start draw text
             * @param fillStyle 0:fill / 1:stroke / 2:fill&stroke
             */
            drawText(canvasId:number, text:string, x:number, y:number, fillStyle:android.graphics.Paint.Style):void{
                batchCall.pushCall('47', [canvasId, encodeURIComponent(text), x, y, fillStyle||android.graphics.Paint.Style.FILL]);
            }

            setFillColor(canvasId:number, color:number, style:android.graphics.Paint.Style):void{
                batchCall.pushCall('49', [canvasId, color, style||android.graphics.Paint.Style.FILL]);
            }
            /**
             * @param canvasId
             * @param alpha [0, 1]
             */
            multiplyAlpha(canvasId:number, alpha:number):void{
                batchCall.pushCall('50', [canvasId, alpha]);
            }
            /**
             * @param canvasId
             * @param alpha [0, 1]
             */
            setAlpha(canvasId:number, alpha:number):void{
                batchCall.pushCall('51', [canvasId, alpha]);
            }
            /**
             * @param canvasId
             * @param align left/center/right
             */
            setTextAlign(canvasId:number, align:string):void{
                batchCall.pushCall('52', [canvasId, align]);
            }
            setLineWidth(canvasId:number, width:number):void{
                batchCall.pushCall('53', [canvasId, width]);
            }
            /**
             * @param canvasId
             * @param lineCap butt/round/square
             */
            setLineCap(canvasId:number, lineCap:string):void{
                batchCall.pushCall('54', [canvasId, lineCap]);
            }
            /**
             * @param canvasId
             * @param lineJoin miter/round/bevel
             */
            setLineJoin(canvasId:number, lineJoin:string):void{
                batchCall.pushCall('55', [canvasId, lineJoin]);
            }
            setShadow(canvasId:number, radius:number, dx:number, dy:number, color:number):void{
                batchCall.pushCall('56', [canvasId, radius, dx, dy, color]);
            }
            setFontSize(canvasId:number, size:number):void{
                batchCall.pushCall('57', [canvasId, size]);
            }
            setFont(canvasId:number, fontName:string):void {
                batchCall.pushCall('58', [canvasId, fontName]);
            }
            drawOval(canvasId:number, left:number, top:number, right:number, bottom:number, style:android.graphics.Paint.Style):void{
                batchCall.pushCall('59', [canvasId, left, top, right, bottom, style||android.graphics.Paint.Style.FILL]);
            }
            drawCircle(canvasId:number, cx:number, cy:number, radius:number, style:android.graphics.Paint.Style):void{
                batchCall.pushCall('60', [canvasId, cx, cy, radius, style||android.graphics.Paint.Style.FILL]);
            }
            drawArc(canvasId:number, left:number, top:number, right:number, bottom:number, startAngle:number, sweepAngle:number, useCenter:boolean, style:android.graphics.Paint.Style):void{
                batchCall.pushCall('61', [canvasId, left, top, right, bottom, startAngle, sweepAngle, useCenter, style||android.graphics.Paint.Style.FILL]);
            }
            drawRoundRectImpl(canvasId:number, left:number, top:number, width:number, height:number, radiusTopLeft:number, radiusTopRight:number,
                              radiusBottomRight:number, radiusBottomLeft:number, style:android.graphics.Paint.Style):void {
                batchCall.pushCall('62', [canvasId, left, top, width, height, radiusTopLeft, radiusTopRight, radiusBottomRight, radiusBottomLeft, style||android.graphics.Paint.Style.FILL]);
            }

        }

        export interface ImageApi {
            createImage(imageId:number):void;
            loadImage(imageId:number, src:string):void;
            recycleImage(imageId:number):void;
            getPixels(imageId:number, callbackIndex:number, left:number, top:number, right:number, bottom:number):void;
        }
    }


    interface Bridge extends NativeApi.ImageApi{
        createSurface(surfaceId:number, left:number, top:number, right:number, bottom:number):void;
        onSurfaceBoundChange(surfaceId:number, left:number, top:number, right:number, bottom:number):void;
        batchCall(jsonString:string):void;
        measureText(text:string, textSize:number):number;
    }

    if(JSBridge){
        android.view.Surface.prototype = NativeSurface.prototype;
        android.graphics.Canvas.prototype = NativeCanvas.prototype;
        androidui.image.NetImage.prototype = NativeImage.prototype;

        //android.graphics.Canvas.measureTextImpl = function(text:string, textSize:number):number {
        //    return JSBridge.measureText(text, textSize);
        //};

        NativeApi.surface = new NativeApi.SurfaceApi();
        NativeApi.canvas = new NativeApi.CanvasApi();
        NativeApi.image = JSBridge;

        android.os.MessageQueue.requestNextLoop = ()=>{
            setTimeout(android.os.MessageQueue.loop, 0);
        };
        android.view.ViewRootImpl.prototype.trackFPS = ()=>{};//ignore web's trackFPS
    }

}
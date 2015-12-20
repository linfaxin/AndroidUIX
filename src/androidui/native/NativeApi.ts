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
        class CallQueues {
            private calls:NativeCall[] = [];
            pushCall(method:string, methodArgs:any[]){
                this.calls.push(new NativeCall(method, methodArgs));
            }
            clear(){
                this.calls = [];
            }
            toString(){
                return this.calls.join('\n');
            }
        }
        class NativeCall {
            method:string;
            args:any[];

            constructor(methodName:string, methodArgs:any[]) {
                this.method = methodName;
                this.args = methodArgs;
            }
            toString(){
                return this.method + JSON.stringify(this.args);
            }
        }

        let callQueues = new CallQueues();

        export class SurfaceApi {
            createSurface(surfaceId:number, left:number, top:number, right:number, bottom:number):void{
                JSBridge.createSurface(surfaceId, left, top, right, bottom);
            }
            onSurfaceBoundChange(surfaceId:number, left:number, top:number, right:number, bottom:number):void{
                JSBridge.onSurfaceBoundChange(surfaceId, left, top, right, bottom);
            }
            /** lock area to be draw on. The lock area can be modified.*/
            lockCanvas(surfaceId:number, canvasId:number, left:number, top:number, right:number, bottom:number):void{
                callQueues.pushCall('lockCanvas', [surfaceId, canvasId, left, top, right, bottom]);
            }
            unlockCanvasAndPost(surfaceId:number, canvasId:number):void{
                callQueues.pushCall('unlockCanvasAndPost', [surfaceId, canvasId]);
                JSBridge.batchCall(callQueues.toString());
                callQueues.clear();
            }
        }

        export class CanvasApi {
            createCanvas(canvasId:number, width:number, height:number):void{
                callQueues.pushCall('createCanvas', [canvasId, width, height]);
            }
            recycleCanvas(canvasId:number):void{
                callQueues.pushCall('recycleCanvas', [canvasId]);
            }
            translate(canvasId:number, dx:number, dy:number):void{
                callQueues.pushCall('translate', [canvasId, dx, dy]);
            }
            scale(canvasId:number, sx:number, sy:number):void{
                callQueues.pushCall('scale', [canvasId, sx, sy]);
            }
            rotate(canvasId:number, degrees:number):void{
                callQueues.pushCall('rotate', [canvasId, degrees]);
            }
            concat(canvasId:number, MSCALE_X:number, MSKEW_X:number, MTRANS_X:number, MSKEW_Y:number, MSCALE_Y:number, MTRANS_Y:number):void{
                callQueues.pushCall('concat', [canvasId, MSCALE_X, MSKEW_X, MTRANS_X, MSKEW_Y, MSCALE_Y, MTRANS_Y]);
            }
            drawColor(canvasId:number, color:number):void{
                callQueues.pushCall('drawColor', [canvasId, color]);
            }
            clearRect(canvasId:number, left:number, top:number, width:number, height:number):void{
                callQueues.pushCall('clearRect', [canvasId, left, top, width, height]);
            }
            drawRect(canvasId:number, left:number, top:number, width:number, height:number):void{
                callQueues.pushCall('drawRect', [canvasId, left, top, width, height]);
            }
            clipRect(canvasId:number, left:number, top:number, width:number, height:number):void{
                callQueues.pushCall('clipRect', [canvasId, left, top, width, height]);
            }
            save(canvasId:number):void{
                callQueues.pushCall('save', [canvasId]);
            }
            restore(canvasId:number):void{
                callQueues.pushCall('restore', [canvasId]);
            }
            drawCanvas(canvasId:number, drawCanvasId:number, offsetX:number, offsetY:number){
                callQueues.pushCall('drawCanvas', [canvasId, drawCanvasId, offsetX, offsetY]);
            }
            drawImage(canvasId:number, drawImageId:number, dstLeft:number, dstTop:number, dstWidth:number, dstHeight:number):void{
                callQueues.pushCall('drawImage', [canvasId, drawImageId, dstLeft, dstTop, dstWidth, dstHeight]);
            }
            /**
             * @x left position to start draw text
             * @y bottom position to start draw text
             * @param fillStyle 0:fill / 1:stroke / 2:fill&stroke
             */
            drawText(canvasId:number, text:string, x:number, y:number, fillStyle:number):void{
                callQueues.pushCall('drawText', [canvasId, encodeURIComponent(text), x, y, fillStyle]);
            }

            setFillColor(canvasId:number, color:number):void{
                callQueues.pushCall('setFillColor', [canvasId, color]);
            }
            /**
             * @param alpha [0, 1]
             */
            multiplyAlpha(canvasId:number, alpha:number):void{
                callQueues.pushCall('multiplyAlpha', [canvasId, alpha]);
            }
            /**
             * @param alpha [0, 1]
             */
            setAlpha(canvasId:number, alpha:number):void{
                callQueues.pushCall('setAlpha', [canvasId, alpha]);
            }
            /**
             * @param align left/center/right
             */
            setTextAlign(canvasId:number, align:string):void{
                callQueues.pushCall('setTextAlign', [canvasId, align]);
            }
            setLineWidth(canvasId:number, width:number):void{
                callQueues.pushCall('setLineWidth', [canvasId, width]);
            }
            /**
             * @param lineCap butt/round/square
             */
            setLineCap(canvasId:number, lineCap:string):void{
                callQueues.pushCall('setLineCap', [canvasId, lineCap]);
            }
            /**
             * @param lineJoin miter/round/bevel
             */
            setLineJoin(canvasId:number, lineJoin:string):void{
                callQueues.pushCall('setLineJoin', [canvasId, lineJoin]);
            }
            setShadow(canvasId:number, radius:number, dx:number, dy:number, color:number):void{
                callQueues.pushCall('setShadow', [canvasId, radius, dx, dy, color]);
            }
            setFontSize(canvasId:number, size:number):void{
                callQueues.pushCall('setFontSize', [canvasId, size]);
            }
            setFont(canvasId:number, fontName:string):void {
                callQueues.pushCall('setFont', [canvasId, fontName]);
            }

        }

        export interface ImageApi {
            createImage(imageId:number):void;
            loadImage(imageId:number, src:string):void;
            recycleImage(imageId:number):void;
            measureText(text:string, textSize:number):number;
        }
    }


    interface Bridge extends NativeApi.ImageApi{
        createSurface(surfaceId:number, left:number, top:number, right:number, bottom:number):void;
        onSurfaceBoundChange(surfaceId:number, left:number, top:number, right:number, bottom:number):void;
        batchCall(jsonString:string):void;
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

    }

}
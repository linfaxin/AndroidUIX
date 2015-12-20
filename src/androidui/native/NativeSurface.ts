/**
 * Created by linfaxin on 15/12/14.
 */
///<reference path="../../android/view/Surface.ts"/>
///<reference path="../../android/content/res/Resources.ts"/>
///<reference path="NativeCanvas.ts"/>
///<reference path="NativeApi.ts"/>


module androidui.native {
    import Surface = android.view.Surface;


    let sNextSurfaceID = 0;
    const SurfaceInstances = new Map<number, NativeSurface>();

    export class NativeSurface extends Surface{
        private surfaceId;

        protected initImpl() {
            this.mClientRect = this.mCanvasElement.getBoundingClientRect();
            this.surfaceId = ++sNextSurfaceID;
            SurfaceInstances.set(this.surfaceId, this);
            let bound = this.mClientRect;
            let density = android.content.res.Resources.getDisplayMetrics().density;
            NativeApi.surface.createSurface(this.surfaceId,
                bound.left * density, bound.top * density, bound.right * density, bound.bottom * density);
        }

        notifyBoundChange() {
            super.notifyBoundChange();
            let bound = this.mClientRect;
            NativeApi.surface.onSurfaceBoundChange(this.surfaceId, bound.left, bound.top, bound.right, bound.bottom);
        }

        protected lockCanvasImpl(left:number, top:number, width:number, height:number):android.graphics.Canvas {
            let canvas = new SurfaceLockCanvas(width, height);
            NativeApi.surface.lockCanvas(this.surfaceId, canvas.canvasId, left, top, left+width, top+height);
            return canvas;
        }

        unlockCanvasAndPost(canvas:android.graphics.Canvas):void {
            if(canvas instanceof NativeCanvas){
                NativeApi.surface.unlockCanvasAndPost(this.surfaceId, canvas.canvasId);
                NativeApi.canvas.recycleCanvas(canvas.canvasId);
            }else{
                throw Error('canvas is not NativeCanvas');
            }
        }

        //call from native
        private static notifySurfaceReady(surfaceId:number){
            let surface:NativeSurface = SurfaceInstances.get(surfaceId);
            surface.viewRoot.scheduleTraversals();
        }

        private static notifySurfaceSupportDirtyDraw(surfaceId:number, dirtyDrawSupport:boolean){
            let surface:NativeSurface = SurfaceInstances.get(surfaceId);
            surface.mSupportDirtyDraw = dirtyDrawSupport;
            surface.viewRoot.scheduleTraversals();
        }
    }

    class SurfaceLockCanvas extends NativeCanvas{

        protected createCanvasImpl():void {
            //no need create canvas, will create when lock canvas
        }
    }

}
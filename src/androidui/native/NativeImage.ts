/**
 * Created by linfaxin on 15/12/14.
 */
///<reference path="../image/NetImage"/>
///<reference path="../../android/graphics/Rect.ts"/>
///<reference path="NativeApi.ts"/>

module androidui.native {
    import NetImage = androidui.image.NetImage;
    import Rect = android.graphics.Rect;

    let sNextId = 0;
    const NativeImageInstances = new Map<number, NativeImage>();

    export class NativeImage extends NetImage{
        imageId:number;
        private getPixelsCallbacks:Array<(data:number[])=>void>;

        protected createImage(){
            this.imageId = sNextId++;
            NativeImageInstances.set(this.imageId, this);
            NativeApi.image.createImage(this.imageId);
        }

        protected loadImage(){
            NativeApi.image.loadImage(this.imageId, this.src);
        }

        recycle(){
            NativeApi.image.recycleImage(this.imageId);
            NativeImageInstances.delete(this.imageId);
        }

        getPixels(bound:Rect, callBack:(data:number[])=>void):void {
            if(!callBack) return;
            if(!bound) bound = new Rect(0, 0, this.width, this.height);
            if(bound.isEmpty()) {
                callBack([]);
                return;
            }
            if(!this.getPixelsCallbacks) this.getPixelsCallbacks = [];
            this.getPixelsCallbacks.push(callBack);
            let callBackIndex = this.getPixelsCallbacks.length-1;
            NativeApi.image.getPixels(this.imageId, callBackIndex, bound.left, bound.top, bound.right, bound.bottom);
        }

        //call from native
        private static notifyLoadFinish(imageId:number, width:number, height:number){
            let image:NativeImage = NativeImageInstances.get(imageId);
            image.mImageWidth = width;
            image.mImageHeight = height;
            image.fireOnLoad();
        }
        //call from native
        private static notifyLoadError(imageId:number){
            let image:NativeImage = NativeImageInstances.get(imageId);
            image.mImageWidth = image.mImageHeight = 0;
            image.fireOnError();
        }

        //call from native
        private static notifyGetPixels(imageId:number, callBackIndex:number, data:number[]){
            let image:NativeImage = NativeImageInstances.get(imageId);
            let callBack = image.getPixelsCallbacks[callBackIndex];
            image.getPixelsCallbacks[callBackIndex] = null;
            callBack(data);
        }
    }
}
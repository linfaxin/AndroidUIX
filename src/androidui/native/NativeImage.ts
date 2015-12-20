/**
 * Created by linfaxin on 15/12/14.
 */
///<reference path="../image/NetImage"/>
///<reference path="NativeApi.ts"/>

module androidui.native {
    import NetImage = androidui.image.NetImage;

    let sNextId = 0;
    const NativeImageInstances = new Map<number, NativeImage>();

    export class NativeImage extends NetImage{
        imageId:number;

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
    }
}
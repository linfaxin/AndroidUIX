/**
 * Created by linfaxin on 15/12/11.
 */

module androidui.image{

    export class NetImage {
        private platformImage;
        private mSrc:string;
        private mImageWidth=0;
        private mImageHeight=0;
        private mOnLoads = new Set<()=>void>();
        private mOnErrors = new Set<()=>void>();
        private mOverrideImageRatio:number;

        constructor(src:string, overrideImageRatio?:number) {
            this.init(src);
            this.mOverrideImageRatio = overrideImageRatio;
        }

        protected init(src:string){
            this.createImage();
            this.src = src;
        }

        protected createImage(){
            this.platformImage = new Image();
        }

        protected loadImage(){
            this.platformImage.src = this.mSrc;
            this.platformImage.onload = ()=>{
                this.mImageWidth = this.platformImage.width;
                this.mImageHeight = this.platformImage.height;
                this.fireOnLoad();
            };
            this.platformImage.onerror = ()=>{
                this.mImageWidth = this.mImageHeight = 0;
                this.fireOnError();
            };
        }

        public get src():string {
            return this.mSrc;
        }

        public set src(value:string) {
            value = convertToAbsUrl(value);
            if(value!==this.mSrc){
                this.mSrc = value;
                this.loadImage();
            }
        }

        public get width():number {
            return this.mImageWidth;
        }

        public get height():number {
            return this.mImageHeight;
        }

        getImageRatio(){
            if(this.mOverrideImageRatio!=null) return this.mOverrideImageRatio;
            let url = this.src;
            if(!url) return 1;
            if(url.startsWith('data:')) return 1;//may base64 encode
            let idx = url.lastIndexOf('.'); // xxx@3x.png
            if(idx>0){
                url = url.substring(0, idx);
            }
            if(url.endsWith('@2x')) return 2;
            if(url.endsWith('@3x')) return 3;
            if(url.endsWith('@4x')) return 4;
            if(url.endsWith('@5x')) return 5;
            return 1;
        }

        private fireOnLoad(){
            for(let load of this.mOnLoads){
                load();
            }
        }
        private fireOnError(){
            for(let error of this.mOnErrors){
                error();
            }
        }

        addLoadListener(onload:()=>void, onerror?:()=>void){
            if(onload){
                this.mOnLoads.add(onload);
            }
            if(onerror){
                this.mOnErrors.add(onerror);
            }
        }
        removeLoadListener(onload?:()=>void, onerror?:()=>void){
            if(onload){
                this.mOnLoads.delete(onload);
            }
            if(onerror){
                this.mOnErrors.delete(onerror);
            }
        }

        recycle():void {
            //no impl for web
        }

    }

    let convertA = document.createElement('a');
    function convertToAbsUrl(url:string){
        convertA.href = url;
        return convertA.href;
    }
}
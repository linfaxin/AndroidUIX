/**
 * Created by linfaxin on 15/12/11.
 */

module androidui.image{

    export class NetImage {
        private platformImage;
        private mSrc:string;
        private mImageWidth=0;
        private mImageHeight=0;
        private mOnLoad:()=>void;
        private mOnError:()=>void;

        constructor(src:string, onload?:()=>void, onerror?:()=>void) {
            this.init(src, onload, onerror);
        }

        protected init(src:string, onload?:()=>void, onerror?:()=>void){
            this.createImage();
            this.onload = onload;
            this.onerror = onerror;
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

        getImage() {
            return this.platformImage;
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

        public get onload():()=>void {
            return this.mOnLoad;
        }

        public set onload(value:()=>void) {
            this.mOnLoad = value;
        }

        public get onerror():()=>void {
            return this.mOnError;
        }

        public set onerror(value:()=>void) {
            this.mOnError = value;
        }

        public get width():number {
            return Math.floor(this.mImageWidth / this.getImageRatio());
        }

        public get height():number {
            return Math.floor(this.mImageHeight / this.getImageRatio());
        }

        private getImageRatio(){
            let url = this.src;
            if(!url) return 1;
            let idx = url.lastIndexOf('.');
            if(idx>0){
                url = url.substring(0, idx);
            }
            if(url.endsWith('@2x')) return 2;
            if(url.endsWith('@3x')) return 3;
            if(url.endsWith('@4x')) return 4;
            if(url.endsWith('@5x')) return 5;
            if(url.endsWith('@6x')) return 6;
            return 1;
        }
        private fireOnLoad(){
            if(this.mOnLoad) this.mOnLoad();
        }
        private fireOnError(){
            if(this.mOnError) this.mOnError();
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
/**
 * Created by linfaxin on 15/12/11.
 */

module androidui.image{


    export class PlatformImage {
        private platformImage;

        public get src():string {
            return this.platformImage.src;
        }

        public set src(value:string) {
            this.platformImage.src = value;
        }

        public get onload():()=>void {
            return this.platformImage.onload;
        }

        public set onload(value:()=>void) {
            this.platformImage.onload = value;
        }

        public get onerror():()=>void {
            return this.platformImage.onerror;
        }

        public set onerror(value:()=>void) {
            this.platformImage.onerror = value;
        }

        public get width():number {
            return Math.floor(this.platformImage.width / this.getImageRatio());
        }

        public get height():number {
            return Math.floor(this.platformImage.height / this.getImageRatio());
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

        constructor(src:string, onload?:()=>void, onerror?:()=>void) {
            this.init(src, onload, onerror);
        }

        protected init(src:string, onload?:()=>void, onerror?:()=>void){
            this.platformImage = new Image();
            this.onload = onload;
            this.onerror = onerror;
            this.src = src;
        }

        getImage(){
            return this.platformImage;
        }

    }
}
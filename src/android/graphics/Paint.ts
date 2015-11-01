/**
 * Created by linfaxin on 15/10/29.
 */
///<reference path="Canvas.ts"/>

module android.graphics{
    export class Paint{
        private mColor:number;
        private mAlpha:number;

        getColor():number{
            return this.mColor;
        }
        setColor(color:number){
            this.mColor = color;
        }
        getAlpha():number{
            return this.mAlpha;
        }
        setAlpha(alpha:number){
            this.mAlpha = alpha;
        }

        _setToCanvasContent(context:CanvasRenderingContext2D){

            if(Number.isInteger(this.mColor)) {
                let r = Color.red(this.mColor);
                let g = Color.green(this.mColor);
                let b = Color.blue(this.mColor);
                let a = Color.alpha(this.mColor);
                context.fillStyle = `rgba(${r},${g},${b},${a/255})`;
            }
        }
    }
}
/**
 * Created by linfaxin on 15/11/7.
 */
///<reference path="../view/View.ts"/>
///<reference path="../../androidui/widget/HtmlImageView.ts"/>
module android.widget{
    import View = android.view.View;

    export class ImageView extends androidui.widget.HtmlImageView{
        //TODO now use HtmlImageView to show the image. Later should draw to Image to canvas
    }

    export module ImageView{
        export class ScaleType{
            static MATRIX = new ScaleType("matrix");
            static FIT_XY = new ScaleType("fitXY");
            static FIT_START = new ScaleType("fitStart");
            static FIT_CENTER = new ScaleType("fitCenter");
            static FIT_END = new ScaleType("fitEnd");
            static CENTER = new ScaleType("center");
            static CENTER_CROP = new ScaleType("centerCrop");
            static CENTER_INSIDE = new ScaleType("centerInside");

            private mType:string;
            constructor(type:string) {
                this.mType = type;
            }
            toString(){
                return this.mType;
            }
            static parseScaleType(s:string, defaultType:ScaleType):ScaleType{
                if(s==null) return defaultType;
                if(s.toLowerCase() === ScaleType.MATRIX.mType.toLowerCase()) return ScaleType.MATRIX;
                if(s.toLowerCase() === ScaleType.FIT_XY.mType.toLowerCase()) return ScaleType.FIT_XY;
                if(s.toLowerCase() === ScaleType.FIT_START.mType.toLowerCase()) return ScaleType.FIT_START;
                if(s.toLowerCase() === ScaleType.FIT_CENTER.mType.toLowerCase()) return ScaleType.FIT_CENTER;
                if(s.toLowerCase() === ScaleType.FIT_END.mType.toLowerCase()) return ScaleType.FIT_END;
                if(s.toLowerCase() === ScaleType.CENTER.mType.toLowerCase()) return ScaleType.CENTER;
                if(s.toLowerCase() === ScaleType.CENTER_CROP.mType.toLowerCase()) return ScaleType.CENTER_CROP;
                if(s.toLowerCase() === ScaleType.CENTER_INSIDE.mType.toLowerCase()) return ScaleType.CENTER_INSIDE;
                return defaultType;
            }
        }
    }
}
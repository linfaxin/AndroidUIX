/**
 * Created by linfaxin on 15/10/27.
 */
///<reference path="DisplayMetrics.ts"/>
///<reference path="../content/res/Resources.ts"/>

module android.util{
    import Resources = android.content.res.Resources;

    export class TypedValue{
        static COMPLEX_UNIT_PX = 'px';
        static COMPLEX_UNIT_DP = 'dp';
        static COMPLEX_UNIT_DIP = 'dip';
        static COMPLEX_UNIT_SP = 'sp';
        static COMPLEX_UNIT_PT = 'pt';
        static COMPLEX_UNIT_IN = 'in';
        static COMPLEX_UNIT_MM = 'mm';
        static COMPLEX_UNIT_FRACTION = '%';

        static UNIT_SCALE_PT;
        static UNIT_SCALE_IN;
        static UNIT_SCALE_MM;
        static UNIT_SCALE_SP = 1;

        private static initUnit(){
            this.initUnit = null;
            let temp = document.createElement('div');
            document.body.appendChild(temp);

            temp.style.height = 100 + TypedValue.COMPLEX_UNIT_PT;
            TypedValue.UNIT_SCALE_PT = temp.offsetHeight / 100;
            temp.style.height = 1 + TypedValue.COMPLEX_UNIT_IN;
            TypedValue.UNIT_SCALE_IN = temp.offsetHeight;
            temp.style.height = 100 + TypedValue.COMPLEX_UNIT_MM;
            TypedValue.UNIT_SCALE_MM = temp.offsetHeight / 100;

            document.body.removeChild(temp);
        }


        static complexToDimensionPixelSize(valueWithUnit:string, baseValue = 0, metrics = Resources.getDisplayMetrics()):number {
            if(this.initUnit) this.initUnit();
            if(valueWithUnit===undefined || valueWithUnit===null) return 0;
            if(typeof valueWithUnit !== 'string') valueWithUnit = valueWithUnit+"";
            let scale = 1;
            if(valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_PX)){
                valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_PX, "");

            }else if(valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_DP)){
                valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_DP, "");
                scale = metrics.density;

            }else if(valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_DIP)){
                valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_DIP, "");
                scale = metrics.density;

            }else if(valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_SP)){
                valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_SP, "");
                scale = metrics.density * TypedValue.UNIT_SCALE_SP;

            }else if(valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_PT)){
                valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_PT, "");
                scale = TypedValue.UNIT_SCALE_PT;

            }else if(valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_IN)){
                valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_IN, "");
                scale = TypedValue.UNIT_SCALE_IN;

            }else if(valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_MM)){
                valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_MM, "");
                scale = TypedValue.UNIT_SCALE_MM;

            }else if(valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_FRACTION)){
                valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_FRACTION, "");
                scale = Number.parseInt(valueWithUnit) / 100;
                if(Number.isNaN(scale)) return 0;
                valueWithUnit = <any>baseValue;

            }
            let value = Number.parseInt(valueWithUnit);
            if(Number.isNaN(value)) return 0;
            return value * scale;
        }
    }
}
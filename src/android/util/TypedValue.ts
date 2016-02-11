/**
 * Created by linfaxin on 15/10/27.
 */
///<reference path="DisplayMetrics.ts"/>
///<reference path="../content/res/Resources.ts"/>

module android.util{

    export class TypedValue{
        static COMPLEX_UNIT_PX = 'px';
        static COMPLEX_UNIT_DP = 'dp';
        static COMPLEX_UNIT_DIP = 'dip';
        static COMPLEX_UNIT_SP = 'sp';
        static COMPLEX_UNIT_PT = 'pt';
        static COMPLEX_UNIT_IN = 'in';
        static COMPLEX_UNIT_MM = 'mm';
        static COMPLEX_UNIT_EM = 'em';
        static COMPLEX_UNIT_REM = 'rem';
        static COMPLEX_UNIT_VH = 'vh';
        static COMPLEX_UNIT_VW = 'vw';
        static COMPLEX_UNIT_FRACTION = '%';

        private static UNIT_SCALE_MAP = new Map<string, number>();

        private static initUnit(){
            this.initUnit = null;
            let temp = document.createElement('div');
            document.body.appendChild(temp);

            temp.style.height = 100 + TypedValue.COMPLEX_UNIT_PT;
            TypedValue.UNIT_SCALE_MAP.set(TypedValue.COMPLEX_UNIT_PT, temp.offsetHeight / 100);
            temp.style.height = 1 + TypedValue.COMPLEX_UNIT_IN;
            TypedValue.UNIT_SCALE_MAP.set(TypedValue.COMPLEX_UNIT_IN, temp.offsetHeight);
            temp.style.height = 100 + TypedValue.COMPLEX_UNIT_MM;
            TypedValue.UNIT_SCALE_MAP.set(TypedValue.COMPLEX_UNIT_MM, temp.offsetHeight / 100);
            temp.style.height = 10 + TypedValue.COMPLEX_UNIT_EM;
            TypedValue.UNIT_SCALE_MAP.set(TypedValue.COMPLEX_UNIT_EM, temp.offsetHeight / 10);
            temp.style.height = 10 + TypedValue.COMPLEX_UNIT_REM;
            TypedValue.UNIT_SCALE_MAP.set(TypedValue.COMPLEX_UNIT_REM, temp.offsetHeight / 10);

            document.body.removeChild(temp);
        }

        static applyDimension(unit:string, size:number, dm:DisplayMetrics):number {
            let scale = 1;
            if(unit===TypedValue.COMPLEX_UNIT_DP || unit===TypedValue.COMPLEX_UNIT_DIP || unit===TypedValue.COMPLEX_UNIT_SP){
                scale = dm.density;
            }else{
                scale = TypedValue.UNIT_SCALE_MAP.get(unit) || 1;
            }
            return size * scale;
        }

        static complexToDimensionPixelSize(valueWithUnit:string, baseValue = 0, metrics = android.content.res.Resources.getDisplayMetrics()):number {
            if(this.initUnit) this.initUnit();
            if(valueWithUnit===undefined || valueWithUnit===null){
                throw Error('complexToDimensionPixelSize error: valueWithUnit is '+valueWithUnit);
            }
            if(valueWithUnit === ''+(Number.parseFloat(valueWithUnit))) return Number.parseFloat(valueWithUnit);

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
                scale = metrics.density * (TypedValue.UNIT_SCALE_MAP.get(TypedValue.COMPLEX_UNIT_SP) || 1);

            }else if(valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_PT)){
                valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_PT, "");
                scale = TypedValue.UNIT_SCALE_MAP.get(TypedValue.COMPLEX_UNIT_PT) || 1;

            }else if(valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_IN)){
                valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_IN, "");
                scale = TypedValue.UNIT_SCALE_MAP.get(TypedValue.COMPLEX_UNIT_IN) || 1;

            }else if(valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_MM)){
                valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_MM, "");
                scale = TypedValue.UNIT_SCALE_MAP.get(TypedValue.COMPLEX_UNIT_MM) || 1;

            }else if(valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_EM)){
                valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_EM, "");
                scale = TypedValue.UNIT_SCALE_MAP.get(TypedValue.COMPLEX_UNIT_EM) || 1;

            }else if(valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_REM)){
                valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_REM, "");
                scale = TypedValue.UNIT_SCALE_MAP.get(TypedValue.COMPLEX_UNIT_REM) || 1;

            }else if(valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_VH)){
                valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_VH, "");
                scale = metrics.heightPixels / 100;

            }else if(valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_VW)){
                valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_VW, "");
                scale = metrics.widthPixels / 100;

            }else if(valueWithUnit.endsWith(TypedValue.COMPLEX_UNIT_FRACTION)){
                valueWithUnit = valueWithUnit.replace(TypedValue.COMPLEX_UNIT_FRACTION, "");
                scale = Number.parseFloat(valueWithUnit) / 100;
                if(Number.isNaN(scale)) return 0;
                valueWithUnit = <any>baseValue;

            }
            let value = Number.parseFloat(valueWithUnit);
            if(Number.isNaN(value)) throw Error('complexToDimensionPixelSize error: '+valueWithUnit);
            return value * scale;
        }
    }
}
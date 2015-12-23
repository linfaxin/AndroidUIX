/**
 * Created by linfaxin on 15/10/5.
 */
///<reference path="../../util/DisplayMetrics.ts"/>
module android.content.res{
    import DisplayMetrics = android.util.DisplayMetrics;

    export class Resources{
        static instance = new Resources();
        private displayMetrics:DisplayMetrics;

        static from(any){
            return Resources.instance;
        }


        static getDisplayMetrics():DisplayMetrics {
            return Resources.instance.getDisplayMetrics();
        }

        getDisplayMetrics():DisplayMetrics {
            if(this.displayMetrics) return this.displayMetrics;
            this.displayMetrics = new DisplayMetrics();
            let displayMetrics = this.displayMetrics;
            let density = window.devicePixelRatio;

            displayMetrics.xdpi = window.screen.deviceXDPI || DisplayMetrics.DENSITY_DEFAULT ;
            displayMetrics.ydpi = window.screen.deviceYDPI || DisplayMetrics.DENSITY_DEFAULT;
            displayMetrics.density = density;
            displayMetrics.densityDpi = density * DisplayMetrics.DENSITY_DEFAULT;
            displayMetrics.scaledDensity = density;

            displayMetrics.widthPixels = window.innerWidth * density;
            displayMetrics.heightPixels = window.innerHeight * density;

            return displayMetrics;
        }

    }
}
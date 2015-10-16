/**
 * Created by linfaxin on 15/10/5.
 */
///<reference path="../../util/DisplayMetrics.ts"/>
module android.content.res{
    import DisplayMetrics = android.util.DisplayMetrics;

    export class Resources{
        private static displayMetrics;

        static getDisplayMetrics():DisplayMetrics {
            let displayMetrics = Resources.displayMetrics;
            if(displayMetrics) return displayMetrics;
            displayMetrics = new DisplayMetrics();

            displayMetrics.widthPixels = window.innerWidth;
            displayMetrics.heightPixels = window.innerHeight;
            displayMetrics.xdpi = window.screen.deviceXDPI || DisplayMetrics.DENSITY_DEFAULT ;
            displayMetrics.ydpi = window.screen.deviceYDPI || DisplayMetrics.DENSITY_DEFAULT;
            displayMetrics.density = 1;//window.devicePixelRatio;
            displayMetrics.densityDpi = displayMetrics.density * DisplayMetrics.DENSITY_DEFAULT;
            displayMetrics.scaledDensity = displayMetrics.density;

            Resources.displayMetrics = displayMetrics;
            return displayMetrics;
        }
    }
}
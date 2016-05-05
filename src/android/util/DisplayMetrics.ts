/**
 * Created by linfaxin on 15/10/5.
 * AndroidUI's impl.
 */
module android.util{
    export class DisplayMetrics{
        static DENSITY_LOW = 120;
        static DENSITY_MEDIUM = 160;
        static DENSITY_HIGH = 240;
        static DENSITY_XHIGH = 320;
        static DENSITY_XXHIGH = 480;
        static DENSITY_XXXHIGH = 640;
        static DENSITY_DEFAULT = DisplayMetrics.DENSITY_MEDIUM;

        widthPixels:number;
        heightPixels:number;
        density:number;
        densityDpi:number;
        scaledDensity:number;
        xdpi:number;
        ydpi:number;
    }
}
/**
 * Created by linfaxin on 15/10/29.
 */
///<reference path="../../util/SparseArray.ts"/>
///<reference path="../../../java/lang/ref/WeakReference.ts"/>
///<reference path="../../util/StateSet.ts"/>


module android.content.res{
    import SparseArray = android.util.SparseArray;
    import StateSet = android.util.StateSet;
    import WeakReference = java.lang.ref.WeakReference;

    export class ColorStateList{
        mDefaultColor = 0xffff0000;
        mColors:Array<number>;
        mStateSpecs:Array<Array<number>>;

        private static EMPTY:Array<Array<number>> = [[]];
        private static sCache = new SparseArray<WeakReference<ColorStateList>>();

        constructor(states:Array<Array<number>>, colors:Array<number>){
            this.mStateSpecs = states;
            this.mColors = colors;

            if (states.length > 0) {
                this.mDefaultColor = colors[0];

                for (let i = 0; i < states.length; i++) {
                    if (states[i].length == 0) {
                        this.mDefaultColor = colors[i];
                    }
                }
            }
        }

        static valueOf(color:number):ColorStateList {
            let ref = ColorStateList.sCache.get(color);
            let csl = ref != null ? ref.get() : null;

            if (csl != null) {
                return csl;
            }

            csl = new ColorStateList(ColorStateList.EMPTY, [color]);
            ColorStateList.sCache.put(color, new WeakReference<ColorStateList>(csl));
            return csl;
        }

        withAlpha(alpha:number):ColorStateList {
            let colors = new Array<number>(this.mColors.length);

            let len = colors.length;
            for (let i = 0; i < len; i++) {
                colors[i] = (this.mColors[i] & 0xFFFFFF) | (alpha << 24);
            }

            return new ColorStateList(this.mStateSpecs, colors);
        }

        isStateful():boolean {
            return this.mStateSpecs.length > 1;
        }
        getColorForState(stateSet:Array<number>, defaultColor:number):number {
            const setLength = this.mStateSpecs.length;
            for (let i = 0; i < setLength; i++) {
                let stateSpec = this.mStateSpecs[i];
                if (StateSet.stateSetMatches(stateSpec, stateSet)) {
                    return this.mColors[i];
                }
            }
            return defaultColor;
        }

        getDefaultColor() {
            return this.mDefaultColor;
        }

        toString() {
            return "ColorStateList{" +
                "mStateSpecs=" + JSON.stringify(this.mStateSpecs) +
                "mColors=" + JSON.stringify(this.mColors) +
                "mDefaultColor=" + this.mDefaultColor + '}';
        }


    }
}
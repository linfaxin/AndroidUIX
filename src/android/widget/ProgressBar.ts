/**
 * Created by linfaxin on 15/12/23.
 */
///<reference path="../view/View.ts"/>
///<reference path="../../lib/com/pnikosis/materialishprogress/ProgressWheel.ts"/>

module android.widget {
    import View = android.view.View;
    import ProgressWheel = com.pnikosis.materialishprogress.ProgressWheel;

    //TODO current use third part impl, only circle loading style
    export class ProgressBar extends ProgressWheel {

        constructor(bindElement?:HTMLElement, rootElement?:HTMLElement) {
            super(bindElement, rootElement);
        }
    }
}
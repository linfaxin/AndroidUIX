/**
 * Created by linfaxin on 15/11/2.
 */
///<reference path="TextView.ts"/>
///<reference path="../view/View.ts"/>
///<reference path="../content/res/Resources.ts"/>
///<reference path="../graphics/Color.ts"/>
///<reference path="../graphics/drawable/Drawable.ts"/>
///<reference path="../graphics/drawable/InsetDrawable.ts"/>
///<reference path="../graphics/drawable/ColorDrawable.ts"/>
///<reference path="../graphics/drawable/StateListDrawable.ts"/>

module android.widget{
    import View = android.view.View;
    import Resources = android.content.res.Resources;
    import Color = android.graphics.Color;
    import Drawable = android.graphics.drawable.Drawable;
    import InsetDrawable = android.graphics.drawable.InsetDrawable;
    import ColorDrawable = android.graphics.drawable.ColorDrawable;
    import StateListDrawable = android.graphics.drawable.StateListDrawable;
    import Gravity = android.view.Gravity;

    export class Button extends TextView{
        constructor() {
            super();
            this._initDefaultStyle();
        }
        private _initDefaultStyle(){
            let density = Resources.getDisplayMetrics().density;
            this.setClickable(true);
            this.setTextSize(18);
            this.setMinimumHeight(48 * density);
            this.setMinimumWidth(64 * density);
            this.setBackground(new DefaultButtonBackgroundDrawable());
            this.setGravity(Gravity.CENTER);
        }
    }

    //init default button background
    const density = Resources.getDisplayMetrics().density;
    class DefaultButtonBackgroundDrawable extends InsetDrawable{
        constructor() {
            super(DefaultButtonBackgroundDrawable.createStateList(), 6 * density);
        }
        private static createStateList():Drawable{
            let stateList = new StateListDrawable();
            stateList.addState([View.VIEW_STATE_PRESSED], new ColorDrawable(Color.GRAY));
            stateList.addState([View.VIEW_STATE_ACTIVATED], new ColorDrawable(Color.GRAY));
            stateList.addState([View.VIEW_STATE_FOCUSED], new ColorDrawable(0xffaaaaaa));
            stateList.addState([-View.VIEW_STATE_ENABLED], new ColorDrawable(0xffebebeb));
            stateList.addState([], new ColorDrawable(Color.LTGRAY));
            return stateList;
        }

        getPadding(padding:android.graphics.Rect):boolean {
            let result = super.getPadding(padding);
            //extra padding to text
            padding.left += 12 * density;
            padding.right += 12 * density;
            padding.top += 6 * density;
            padding.bottom += 6 * density;
            return result;
        }
    }
}
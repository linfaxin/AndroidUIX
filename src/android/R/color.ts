/**
 * Created by linfaxin on 15/11/15.
 */
///<reference path="../view/View.ts"/>
///<reference path="../content/res/Resources.ts"/>
///<reference path="../content/res/ColorStateList.ts"/>
///<reference path="../graphics/Color.ts"/>
///<reference path="../graphics/drawable/Drawable.ts"/>
///<reference path="../graphics/drawable/InsetDrawable.ts"/>
///<reference path="../graphics/drawable/ColorDrawable.ts"/>
///<reference path="../graphics/drawable/StateListDrawable.ts"/>
module android.R{
    import Resources = android.content.res.Resources;
    import ColorStateList = android.content.res.ColorStateList;
    import Color = android.graphics.Color;
    import Drawable = android.graphics.drawable.Drawable;
    import InsetDrawable = android.graphics.drawable.InsetDrawable;
    import ColorDrawable = android.graphics.drawable.ColorDrawable;
    import StateListDrawable = android.graphics.drawable.StateListDrawable;
    import Gravity = android.view.Gravity;

    export class color {
        static get textView_textColor():ColorStateList {
            let _defaultStates = [[-android.view.View.VIEW_STATE_ENABLED], []];
            let _defaultColors = [0xffc0c0c0, 0xff333333];
            class DefaultStyleTextColor extends ColorStateList{
                constructor() {
                    super(_defaultStates, _defaultColors);
                }
            }
            return new DefaultStyleTextColor();
        }

        static get primary_text_light_disable_only():ColorStateList {
            let _defaultStates = [[-android.view.View.VIEW_STATE_ENABLED], []];
            let _defaultColors = [0x80000000, 0xff000000];
            class DefaultStyleTextColor extends ColorStateList{
                constructor() {
                    super(_defaultStates, _defaultColors);
                }
            }
            return new DefaultStyleTextColor();
        }

        static get primary_text_dark_disable_only():ColorStateList {
            let _defaultStates = [[-android.view.View.VIEW_STATE_ENABLED], []];
            let _defaultColors = [0x80000000, 0xffffffff];
            class DefaultStyleTextColor extends ColorStateList{
                constructor() {
                    super(_defaultStates, _defaultColors);
                }
            }
            return new DefaultStyleTextColor();
        }

        static white = Color.WHITE;
        static black = Color.BLACK;
        static transparent = Color.TRANSPARENT;
    }
}
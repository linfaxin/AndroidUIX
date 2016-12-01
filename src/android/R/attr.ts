/**
 * Created by linfaxin on 15/11/26.
 */
///<reference path="drawable.ts"/>
///<reference path="image.ts"/>
///<reference path="color.ts"/>
///<reference path="../view/Gravity.ts"/>
///<reference path="../view/View.ts"/>
///<reference path="../view/animation/Animation.ts"/>
///<reference path="../content/res/Resources.ts"/>
///<reference path="../graphics/Color.ts"/>
///<reference path="../graphics/drawable/Drawable.ts"/>
///<reference path="../graphics/drawable/InsetDrawable.ts"/>
///<reference path="../graphics/drawable/ColorDrawable.ts"/>
///<reference path="../graphics/drawable/StateListDrawable.ts"/>

module android.R {
    import Gravity = android.view.Gravity;
    import Resources = android.content.res.Resources;
    import Color = android.graphics.Color;
    import Drawable = android.graphics.drawable.Drawable;
    import InsetDrawable = android.graphics.drawable.InsetDrawable;
    import ColorDrawable = android.graphics.drawable.ColorDrawable;
    import StateListDrawable = android.graphics.drawable.StateListDrawable;


    const attrData = {
        textViewStyle: {
            textSize: '14sp',
            layerType: 'software',
            textColor: '@android:color/textColorPrimary',
            textColorHint: '#ff808080',
        },
        buttonStyle: {
            background: '@android:drawable/btn_default',
            focusable: 'true',
            clickable: 'true',
            minHeight: '48dp',
            minWidth: '64dp',
            textSize: '18sp',
            layerType: 'software',
            textColor: '@android:color/textColorPrimary',
            textColorHint: '#ff808080',
            gravity: 'center',
        },
        editTextStyle: {
            background: '@android:drawable/editbox_background',
            focusable: 'true',
            focusableInTouchMode: 'true',
            clickable: 'true',
            gravity: 'center',
            textSize: '18sp',
            textColor: '@android:color/textColorPrimary',
            textColorHint: '#ff808080',
        },
        imageButtonStyle: {
            background: '#android:drawable/btn_default',
            focusable: 'true',
            clickable: 'true',
            gravity: 'center',
        },
        listViewStyle: {
            divider: '@android:drawable/list_divider',
            listSelector: '@android:drawable/list_selector_background',
            dividerHeight: '1px',
        },
        scrollViewStyle: {
            scrollbars: 'vertical',
            fadingEdge: 'vertical',
        },
    };
    export class attr {
        static getAttrMap(attrName:string): Map<string, string> {
            let style = attrData[attrName];
            if (style) {
                let map = new Map<string, string>();
                for(let key in style) {
                    map.set(key, style[key]);
                }
                return map;
            }
            return null;
        }

        static textViewStyle = '@android:attr/textViewStyle';
        static buttonStyle = '@android:attr/buttonStyle';
        static editTextStyle = '@android:attr/editTextStyle';
        static imageButtonStyle = '@android:attr/imageButtonStyle';
        static listViewStyle = '@android:attr/listViewStyle';
        static scrollViewStyle = '@android:attr/scrollViewStyle';
    }
}
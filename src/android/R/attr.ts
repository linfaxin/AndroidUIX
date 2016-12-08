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


    export class attr {

        static textViewStyle = new Map<string, string>()
            .set('textSize', '14sp')
            .set('layerType', 'software')
            .set('textColor', '@android:color/textView_textColor')
            .set('textColorHint', '#ff808080');

        static buttonStyle = new Map<string, string>(attr.textViewStyle)
            .set('background', '@android:drawable/btn_default')
            .set('focusable', 'true')
            .set('clickable', 'true')
            .set('minHeight', '48dp')
            .set('minWidth', '64dp')
            .set('textSize', '18sp')
            .set('gravity', 'center');

        static editTextStyle = new Map<string, string>(attr.textViewStyle)
            .set('background', '@android:drawable/editbox_background')
            .set('focusable', 'true')
            .set('focusableInTouchMode', 'true')
            .set('clickable', 'true')
            .set('textSize', '18sp')
            .set('gravity', 'center_vertical');

        static imageButtonStyle = new Map<string, string>()
            .set('background', '@android:drawable/btn_default')
            .set('focusable', 'true')
            .set('clickable', 'true')
            .set('gravity', 'center');

        static checkboxStyle = new Map<string, string>(attr.buttonStyle)
            .set('background', '@null')
            .set('button', '@android:drawable/btn_check');

        static radiobuttonStyle = new Map<string, string>(attr.buttonStyle)
            .set('background', '@null')
            .set('button', '@android:drawable/btn_radio');

        static checkedTextViewStyle = new Map<string, string>()
            .set('textAlignment', 'viewStart');

        static progressBarStyle = new Map<string, string>()
            .set('indeterminateOnly', 'true')
            .set('indeterminateDrawable', '@android:drawable/progress_medium_holo')
            .set('indeterminateBehavior', 'repeat')
            .set('indeterminateDuration', '3500')
            .set('minWidth', '48dp')
            .set('maxWidth', '48dp')
            .set('minHeight', '48dp')
            .set('maxHeight', '48dp')
            .set('mirrorForRtl', 'false');

        static progressBarStyleHorizontal = new Map<string, string>()
            .set('indeterminateOnly', 'false')
            .set('progressDrawable', '@android:drawable/progress_horizontal_holo')
            .set('indeterminateDrawable', '@android:drawable/progress_indeterminate_horizontal_holo')
            .set('indeterminateBehavior', 'repeat')
            .set('indeterminateDuration', '3500')
            .set('minHeight', '20dp')
            .set('maxHeight', '20dp')
            .set('mirrorForRtl', 'true');

        static progressBarStyleSmall = new Map<string, string>(attr.progressBarStyle)
            .set('indeterminateDrawable', '@android:drawable/progress_small_holo')
            .set('minWidth', '16dp')
            .set('maxWidth', '16dp')
            .set('minHeight', '16dp')
            .set('maxHeight', '16dp');

        static progressBarStyleLarge = new Map<string, string>(attr.progressBarStyle)
            .set('indeterminateDrawable', '@android:drawable/progress_large_holo')
            .set('minWidth', '76dp')
            .set('maxWidth', '76dp')
            .set('minHeight', '76dp')
            .set('maxHeight', '76dp');

        static seekBarStyle = new Map<string, string>()
            .set('indeterminateOnly', 'false')
            .set('progressDrawable', '@android:drawable/scrubber_progress_horizontal_holo_light')
            .set('indeterminateDrawable', '@android:drawable/scrubber_progress_horizontal_holo_light')
            .set('minHeight', '13dp')
            .set('maxHeight', '13dp')
            .set('thumb', '@android:drawable/scrubber_control_selector_holo')
            .set('thumbOffset', '16dp')
            .set('focusable', 'true')
            .set('paddingLeft', '16dp')
            .set('paddingRight', '16dp')
            .set('mirrorForRtl', 'true');

        static ratingBarStyle = new Map<string, string>()
            .set('indeterminateOnly', 'false')
            .set('progressDrawable', '@android:drawable/ratingbar_full_holo_light')
            .set('indeterminateDrawable', '@android:drawable/ratingbar_full_holo_light')
            .set('minHeight', '48dip')
            .set('maxHeight', '48dip')
            .set('numStars', '5')
            .set('stepSize', '0.5')
            .set('thumb', '@null')
            .set('mirrorForRtl', 'true');

        static ratingBarStyleIndicator = new Map<string, string>(attr.ratingBarStyle)
            .set('indeterminateOnly', 'false')
            .set('progressDrawable', '@android:drawable/ratingbar_holo_light')
            .set('indeterminateDrawable', '@android:drawable/ratingbar_holo_light')
            .set('minHeight', '35dip')
            .set('maxHeight', '35dip')
            .set('thumb', '@null')
            .set('isIndicator', 'true');

        static ratingBarStyleSmall = new Map<string, string>(attr.ratingBarStyle)
            .set('indeterminateOnly', 'false')
            .set('progressDrawable', '@android:drawable/ratingbar_small_holo_light')
            .set('indeterminateDrawable', '@android:drawable/ratingbar_small_holo_light')
            .set('minHeight', '16dip')
            .set('maxHeight', '16dip')
            .set('thumb', '@null')
            .set('isIndicator', 'true');

        static gridViewStyle = new Map<string, string>()
            .set('listSelector', '@android:drawable/list_selector_background')
            .set('numColumns', '1');

        static listViewStyle = new Map<string, string>()
            .set('divider', '@android:drawable/list_divider')
            .set('listSelector', '@android:drawable/list_selector_background')
            .set('dividerHeight', '1');

        static expandableListViewStyle = new Map<string, string>(attr.listViewStyle)
            .set('childDivider', '@android:drawable/list_divider');

        static numberPickerStyle = new Map<string, string>()
            .set('orientation', 'vertical')
            .set('solidColor', 'transparent')
            .set('selectionDivider', '#cc33b5e5')
            .set('selectionDividerHeight', '2dp')
            .set('selectionDividersDistance', '48dp')
            .set('internalMinWidth', '64dp')
            .set('internalMaxHeight', '180dp')
            .set('virtualButtonPressedDrawable', '@android:drawable/item_background');

        static popupWindowStyle = new Map<string, string>()
            .set('popupBackground', '@android:drawable/dropdown_background_dark')
            .set('popupEnterAnimation', '@android:anim/grow_fade_in_center')
            .set('popupExitAnimation', '@android:anim/shrink_fade_out_center');

        static listPopupWindowStyle = new Map<string, string>()
            .set('popupBackground', '@android:drawable/menu_panel_holo_light')
            .set('popupEnterAnimation', '@android:anim/grow_fade_in_center')
            .set('popupExitAnimation', '@android:anim/shrink_fade_out_center');

        static popupMenuStyle = new Map<string, string>()
            .set('popupBackground', '@android:drawable/menu_panel_holo_dark');

        static dropDownListViewStyle = new Map<string, string>(attr.listViewStyle);

        static spinnerStyle = new Map<string, string>()
            .set('clickable', 'true')
            .set('spinnerMode', 'dropdown')
            .set('gravity', 'start|center_vertical')
            .set('disableChildrenWhenDisabled', 'true')
            .set('background', '@android:drawable/btn_default')
            .set('popupBackground', '@android:drawable/menu_panel_holo_light')
            .set('dropDownVerticalOffset', '0dp')
            .set('dropDownHorizontalOffset', '0dp')
            .set('dropDownWidth', 'wrap_content');

        static actionBarStyle = new Map<string, string>()
            .set('background', '#ff333333');

        static scrollViewStyle = new Map<string, string>()
            .set('scrollbars', 'vertical')
            .set('fadingEdge', 'vertical');

    }
}
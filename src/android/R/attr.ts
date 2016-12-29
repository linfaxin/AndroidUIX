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
            .set('android:textSize', '14sp')
            .set('android:layerType', 'software')
            .set('android:textColor', '@android:color/textView_textColor')
            .set('android:textColorHint', '#ff808080');

        static buttonStyle = new Map<string, string>(attr.textViewStyle)
            .set('android:background', '@android:drawable/btn_default')
            .set('android:focusable', 'true')
            .set('android:clickable', 'true')
            .set('android:minHeight', '48dp')
            .set('android:minWidth', '64dp')
            .set('android:textSize', '18sp')
            .set('android:gravity', 'center');

        static editTextStyle = new Map<string, string>(attr.textViewStyle)
            .set('android:background', '@android:drawable/editbox_background')
            .set('android:focusable', 'true')
            .set('android:focusableInTouchMode', 'true')
            .set('android:clickable', 'true')
            .set('android:textSize', '18sp')
            .set('android:gravity', 'center_vertical');

        static imageButtonStyle = new Map<string, string>()
            .set('android:background', '@android:drawable/btn_default')
            .set('android:focusable', 'true')
            .set('android:clickable', 'true')
            .set('android:gravity', 'center');

        static checkboxStyle = new Map<string, string>(attr.buttonStyle)
            .set('android:background', '@null')
            .set('android:button', '@android:drawable/btn_check');

        static radiobuttonStyle = new Map<string, string>(attr.buttonStyle)
            .set('android:background', '@null')
            .set('android:button', '@android:drawable/btn_radio');

        static checkedTextViewStyle = new Map<string, string>()
            .set('android:textAlignment', 'viewStart');

        static progressBarStyle = new Map<string, string>()
            .set('android:indeterminateOnly', 'true')
            .set('android:indeterminateDrawable', '@android:drawable/progress_medium_holo')
            .set('android:indeterminateBehavior', 'repeat')
            .set('android:indeterminateDuration', '3500')
            .set('android:minWidth', '48dp')
            .set('android:maxWidth', '48dp')
            .set('android:minHeight', '48dp')
            .set('android:maxHeight', '48dp')
            .set('android:mirrorForRtl', 'false');

        static progressBarStyleHorizontal = new Map<string, string>()
            .set('android:indeterminateOnly', 'false')
            .set('android:progressDrawable', '@android:drawable/progress_horizontal_holo')
            .set('android:indeterminateDrawable', '@android:drawable/progress_indeterminate_horizontal_holo')
            .set('android:indeterminateBehavior', 'repeat')
            .set('android:indeterminateDuration', '3500')
            .set('android:minHeight', '20dp')
            .set('android:maxHeight', '20dp')
            .set('android:mirrorForRtl', 'true');

        static progressBarStyleSmall = new Map<string, string>(attr.progressBarStyle)
            .set('android:indeterminateDrawable', '@android:drawable/progress_small_holo')
            .set('android:minWidth', '16dp')
            .set('android:maxWidth', '16dp')
            .set('android:minHeight', '16dp')
            .set('android:maxHeight', '16dp');

        static progressBarStyleLarge = new Map<string, string>(attr.progressBarStyle)
            .set('android:indeterminateDrawable', '@android:drawable/progress_large_holo')
            .set('android:minWidth', '76dp')
            .set('android:maxWidth', '76dp')
            .set('android:minHeight', '76dp')
            .set('android:maxHeight', '76dp');

        static seekBarStyle = new Map<string, string>()
            .set('android:indeterminateOnly', 'false')
            .set('android:progressDrawable', '@android:drawable/scrubber_progress_horizontal_holo_light')
            .set('android:indeterminateDrawable', '@android:drawable/scrubber_progress_horizontal_holo_light')
            .set('android:minHeight', '13dp')
            .set('android:maxHeight', '13dp')
            .set('android:thumb', '@android:drawable/scrubber_control_selector_holo')
            .set('android:thumbOffset', '16dp')
            .set('android:focusable', 'true')
            .set('android:paddingLeft', '16dp')
            .set('android:paddingRight', '16dp')
            .set('android:mirrorForRtl', 'true');

        static ratingBarStyle = new Map<string, string>()
            .set('android:indeterminateOnly', 'false')
            .set('android:progressDrawable', '@android:drawable/ratingbar_full_holo_light')
            .set('android:indeterminateDrawable', '@android:drawable/ratingbar_full_holo_light')
            .set('android:minHeight', '48dip')
            .set('android:maxHeight', '48dip')
            .set('android:numStars', '5')
            .set('android:stepSize', '0.5')
            .set('android:thumb', '@null')
            .set('android:mirrorForRtl', 'true');

        static ratingBarStyleIndicator = new Map<string, string>(attr.ratingBarStyle)
            .set('android:indeterminateOnly', 'false')
            .set('android:progressDrawable', '@android:drawable/ratingbar_holo_light')
            .set('android:indeterminateDrawable', '@android:drawable/ratingbar_holo_light')
            .set('android:minHeight', '35dip')
            .set('android:maxHeight', '35dip')
            .set('android:thumb', '@null')
            .set('android:isIndicator', 'true');

        static ratingBarStyleSmall = new Map<string, string>(attr.ratingBarStyle)
            .set('android:indeterminateOnly', 'false')
            .set('android:progressDrawable', '@android:drawable/ratingbar_small_holo_light')
            .set('android:indeterminateDrawable', '@android:drawable/ratingbar_small_holo_light')
            .set('android:minHeight', '16dip')
            .set('android:maxHeight', '16dip')
            .set('android:thumb', '@null')
            .set('android:isIndicator', 'true');

        static absListViewStyle = new Map<string, string>()
            .set('android:scrollbars', 'vertical')
            .set('android:fadingEdge', 'vertical');

        static gridViewStyle = new Map<string, string>(attr.absListViewStyle)
            .set('android:listSelector', '@android:drawable/list_selector_background')
            .set('android:numColumns', '1');

        static listViewStyle = new Map<string, string>(attr.absListViewStyle)
            .set('android:divider', '@android:drawable/list_divider')
            .set('android:listSelector', '@android:drawable/list_selector_background')
            .set('android:dividerHeight', '1');

        static expandableListViewStyle = new Map<string, string>(attr.listViewStyle)
            .set('android:childDivider', '@android:drawable/list_divider');

        static numberPickerStyle = new Map<string, string>()
            .set('android:orientation', 'vertical')
            .set('android:solidColor', 'transparent')
            .set('android:selectionDivider', '#cc33b5e5')
            .set('android:selectionDividerHeight', '2dp')
            .set('android:selectionDividersDistance', '48dp')
            .set('android:internalMinWidth', '64dp')
            .set('android:internalMaxHeight', '180dp')
            .set('android:virtualButtonPressedDrawable', '@android:drawable/item_background');

        static popupWindowStyle = new Map<string, string>()
            .set('android:popupBackground', '@android:drawable/dropdown_background_dark')
            .set('android:popupEnterAnimation', '@android:anim/grow_fade_in_center')
            .set('android:popupExitAnimation', '@android:anim/shrink_fade_out_center');

        static listPopupWindowStyle = new Map<string, string>()
            .set('android:popupBackground', '@android:drawable/menu_panel_holo_light')
            .set('android:popupEnterAnimation', '@android:anim/grow_fade_in_center')
            .set('android:popupExitAnimation', '@android:anim/shrink_fade_out_center');

        static popupMenuStyle = new Map<string, string>()
            .set('android:popupBackground', '@android:drawable/menu_panel_holo_dark');

        static dropDownListViewStyle = new Map<string, string>(attr.listViewStyle);

        static spinnerStyle = new Map<string, string>()
            .set('android:clickable', 'true')
            .set('android:spinnerMode', 'dropdown')
            .set('android:gravity', 'start|center_vertical')
            .set('android:disableChildrenWhenDisabled', 'true')
            .set('android:background', '@android:drawable/btn_default')
            .set('android:popupBackground', '@android:drawable/menu_panel_holo_light')
            .set('android:dropDownVerticalOffset', '0dp')
            .set('android:dropDownHorizontalOffset', '0dp')
            .set('android:dropDownWidth', 'wrap_content');

        static actionBarStyle = new Map<string, string>()
            .set('android:background', '#ff333333');

        static scrollViewStyle = new Map<string, string>()
            .set('android:scrollbars', 'vertical')
            .set('android:fadingEdge', 'vertical');

    }
}
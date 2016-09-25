"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var R;
(function (R) {
    R._res_data = {
        "color": {
            "btn_color": "<selector xmlns=\"android\" xmlns:android=\"http://schemas.android.com/apk/res/android\">\n    <item android:state_pressed=\"true\" android:color=\"#999\"></item>\n    <item android:state_enabled=\"false\" android:color=\"@color/light_gray\"></item>\n    <item android:color=\"@color/white\"></item>\n</selector>"
        },
        "drawable": {
            "btn_bg": "<selector xmlns=\"android\" xmlns:android=\"http://schemas.android.com/apk/res/android\">\n    <item android:state_pressed=\"true\" android:drawable=\"@color/red_press\"></item>\n    <item android:state_enabled=\"false\" android:drawable=\"@color/red_disable\"></item>\n    <item android:drawable=\"@color/red\"></item>\n</selector>",
            "icon_alert@3x": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAjVBMVEUAAAAzR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR198qNTWAAAALnRSTlMAsFf6A8T2D3vpgfBPMQbbnCMKzry2bY6JdWYsFeSUSuDW0cmhXEUnHjwaqEE2puKK5AAAA39JREFUeNrt2uey2jAQBeADcjcuGNNNb5eSff/Hy49MckMGw0oreyYz/p7goEXWam10Op2OkSI5RXd3lIWeile7Q5nPBxcHLfk6Hbf0ghrNNgWadl1n9IZygy805xJt6TN34aMRG5eYvHwI25z+iDSo+xJWDXakq2dxFYZjMuAFKaxIA4/MZGdYMNyTubUj3/ghSZQVZBaKZLIlBJw1icUbGPNLsmEOQ5eM7DimMPGIyZaDb/L7Y7KndKDLz8imNTQ5Jdm1gJ41WaYe0LEg68Ih+B6K7Nv54BqGxBLPBl/Fj8mYeMYOeNI9sYxv+KXPDByBJyCWGf6oMuJQS14BPOLYp/h2JRYXHMySJvjbjFhO+GxALDs8WRJL6OMTZ0csRzxxPFv/wz7xTPDMJZbYxwcj4unjWY94Ary3oYYDhAXecpsOQBO8c6HGA+zxTtR8AErwxraFAFPUu1ILAUIHtdZtBKAzamWtBJihzhe1EmCEOqd2ApCPGseWAgxqN6EsgHgjFtRSgBKvJW0FWMn+g/IAVOClSBpAehzcWwvQx0uuOICwJxjJA8j6skwYQHwahLIA8nmJ11qAHC+p1gIc8VIsmfmUFlZgJSljSPLTaEcaDuxehn9DPJAGr+JOtfjT45J09J4WICYLT8KctJzMx5obvDQnLSpw8MvFJT1DxmyEYzS4AemPyCM9ymHcTJlWe0XadnjNUdSOnmw6IhegxozacRXNZ+S8FDUKRW0YyyZEcnPGmJotG2eka4laX5pr+fAB+GeXDM5ReQ3CP4eBM/cEJ5HpqRre8O2HIi5V4Q3fM5z0RLLH4LfcsKtyRvzgbw0V8dwMi3fAB3fDK34iG898WxpWMlWCSbHBDWNq2NT3bb00K/GPSvTaTH9HxQ6ePey9OCy2JlOWwKhwgubUfV6CW8zZOj54cv2+asy7DjClLqeeffzhRJY/56m2xNC7/d44LnMowJd4xBDni6T4scg9YnBT6BiQZdsKegKyykug6042DaCtGJE9AQxULtkSwUiakxVeH6YmiuS2CcydY5JyK0hcMvnHjDL+WHgPFHNmikytNrBh6ZIRNfVhySkkfe4S9vhRTHr2fdjlByHxHQawr5jsiUX1zmhIMg3pk8OkQoOc82xEtbzxfInm+YNpuaJ/qF0vuKZoT5H0J8FsnR/zaTSfbIYOOp1Op9P5X/0Eg/+iUtRdaggAAAAASUVORK5CYII="
        },
        "layout": {
            "activity_main": "<scrollview android:layout_height=\"match_parent\" android:layout_width=\"match_parent\">\n    <linearlayout android:orientation=\"vertical\" android:padding=\"12dp\" android:gravity=\"center\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\">\n        <textview android:id=\"android_tip\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:text=\"NOTE:Suggest use Chrome for better experience\" android:visibility=\"gone\"></textview>\n        <button android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:onClick=\"this.getContext().startActivity('sample.app.SampleBaseWidgetActivity')\" android:text=\"Base Widget\"></button>\n        <button android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:onClick=\"this.getContext().startActivity('sample.app.SampleFrameLayoutActivity')\" android:text=\"FrameLayout\"></button>\n        <button android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:onClick=\"this.getContext().startActivity('sample.app.SampleLinearLayoutActivity')\" android:text=\"LinearLayout\"></button>\n        <button android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:onClick=\"this.getContext().startActivity('sample.app.SampleRelativeLayoutActivity')\" android:text=\"RelativeLayout\"></button>\n        <button android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:onClick=\"this.getContext().startActivity('sample.app.SampleTextViewActivity')\" android:text=\"TextView\"></button>\n        <button android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:onClick=\"this.getContext().startActivity('sample.app.SampleButtonActivity')\" android:text=\"Button\"></button>\n        <button android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:onClick=\"this.getContext().startActivity('sample.app.SampleImageViewActivity')\" android:text=\"ImageView\"></button>\n        <button android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:onClick=\"this.getContext().startActivity('sample.app.SampleEditTextActivity')\" android:text=\"EditText\"></button>\n        <button android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:onClick=\"this.getContext().startActivity('sample.app.SampleListViewActivity')\" android:text=\"ListView\"></button>\n        <button android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:onClick=\"this.getContext().startActivity('sample.app.SampleGridViewActivity')\" android:text=\"GridView\"></button>\n        <button android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:onClick=\"this.getContext().startActivity('sample.app.SampleExpandableListViewActivity')\" android:text=\"ExpandableListView\"></button>\n        <button android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:onClick=\"this.getContext().startActivity('sample.app.SampleViewPagerActivity')\" android:text=\"ViewPager\"></button>\n        <button android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:onClick=\"this.getContext().startActivity('sample.app.SampleDrawerLayoutActivity')\" android:text=\"DrawerLayout\"></button>\n        <button android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:onClick=\"this.getContext().startActivity('sample.app.SampleViewPagerGalleryActivity')\" android:text=\"ImageGallery&amp;Gesture\"></button>\n        <button android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:onClick=\"this.getContext().startActivity('sample.app.SamplePullRefreshLoadActivity')\" android:text=\"List pull refresh &amp; pull load\"></button>\n        <button android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:onClick=\"this.getContext().startActivity('sample.app.SamplePickerActivity')\" android:text=\"Picker\"></button>\n        <button android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:onClick=\"this.getContext().startActivity('sample.app.SampleAnimationActivity')\" android:text=\"Animation\"></button>\n        <button android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:onClick=\"this.getContext().startActivity('sample.app.SampleLifeCallbackActivity')\" android:text=\"Activity Life Circel\"></button>\n        <button android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:onClick=\"this.getContext().startActivity('sample.app.SampleContacteActivity')\" android:text=\"Activity Start&amp;Result\"></button>\n        <button android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:onClick=\"this.getContext().startActivity('sample.app.SampleWebViewActivity')\" android:text=\"WebView\"></button>\n        <button android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:onClick=\"this.getContext().startActivity('sample.app.SampleHtmlViewActivity')\" android:text=\"HtmlView\"></button>\n    </linearlayout>\n</scrollview>",
            "sample_animation": "<scrollview android:layout_height=\"match_parent\" android:layout_width=\"match_parent\">\n    <linearlayout android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:padding=\"0 6dp\" android:gravity=\"center\" android:orientation=\"vertical\">\n        <textview android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:gravity=\"center\" android:text=\"Rotate:\"></textview>\n        <imageview android:id=\"rotate_repeat\" android:src=\"assets/images/logo_android_1@2x.png\" android:layout_width=\"56dp\" android:layout_height=\"56dp\" android:layout_margin=\"20dp 12dp\"></imageview>\n        <textview android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:gravity=\"center\" android:text=\"Translate:\"></textview>\n        <imageview android:id=\"translate_repeat\" android:src=\"assets/images/logo_android_1@2x.png\" android:layout_width=\"56dp\" android:layout_height=\"56dp\" android:layout_margin=\"12dp\"></imageview>\n        <textview android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:text=\"Scale:\" android:gravity=\"center\"></textview>\n        <imageview android:id=\"scale_repeat\" android:src=\"assets/images/logo_android_1@2x.png\" android:layout_width=\"56dp\" android:layout_height=\"56dp\" android:layout_margin=\"12dp\"></imageview>\n        <textview android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:text=\"Alpha:\" android:gravity=\"center\"></textview>\n        <imageview android:id=\"alpha_repeat\" android:src=\"assets/images/logo_android_1@2x.png\" android:layout_width=\"56dp\" android:layout_height=\"56dp\" android:layout_margin=\"12dp\"></imageview>\n        <textview android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:text=\"Animation Set:\" android:gravity=\"center\"></textview>\n        <imageview android:id=\"anim_set\" android:src=\"assets/images/logo_android_1@2x.png\" android:layout_width=\"56dp\" android:layout_height=\"56dp\" android:layout_margin=\"12dp\"></imageview>\n    </linearlayout>\n</scrollview>",
            "sample_base_widget": "<scrollview android:layout_height=\"match_parent\" android:layout_width=\"match_parent\">\n    <linearlayout android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:orientation=\"vertical\" android:padding=\"12dp\" android:gravity=\"center\">\n        <textview android:text=\"TextView\" android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\"></textview>\n        <button android:text=\"Button\" android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\"></button>\n        <imageview android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:src=\"assets/images/logo_google_3.png\"></imageview>\n        <checkbox android:text=\"CheckBox\" android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\" android:layout_marginBottom=\"12dp\"></checkbox>\n        <radiogroup android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:gravity=\"center\" android:orientation=\"horizontal\" android:layout_marginBottom=\"12dp\">\n            <radiobutton android:text=\"Radio1\" android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\"></radiobutton>\n            <radiobutton android:text=\"Radio2\" android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\"></radiobutton>\n            <radiobutton android:text=\"Radio3\" android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\"></radiobutton>\n        </radiogroup>\n        <button android:id=\"btn_open_dialog\" android:text=\"OpenDialog\" android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\"></button>\n        <spinner android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\" android:entries=\"@array/spinner_array\"></spinner>\n        <button android:id=\"btn_show_popup\" android:text=\"PopupWindow\" android:visibility=\"gone\" android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\"></button>\n\n        <progressbar android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\" android:layout_marginBottom=\"12dp\"></progressbar>\n        <progressbar android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:layout_marginBottom=\"12dp\" style=\"@android:attr/progressBarStyleHorizontal\" android:max=\"100\" android:progress=\"50\" android:secondaryProgress=\"70\"></progressbar>\n\n        <seekbar android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:layout_marginBottom=\"12dp\"></seekbar>\n\n        <ratingbar android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\" android:layout_marginBottom=\"12dp\"></ratingbar>\n\n    </linearlayout>\n</scrollview>",
            "sample_button": "<scrollview android:layout_height=\"match_parent\" android:layout_width=\"match_parent\">\n    <linearlayout android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:orientation=\"vertical\" android:gravity=\"center\">\n        <button android:text=\"Button\" android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\"></button>\n        <button android:text=\"DisableButton\" android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\" android:enabled=\"false\"></button>\n        <button android:id=\"btn_click\" android:text=\"ButtonClick\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\"></button>\n        <button android:text=\"ButtonClick2\" android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\" android:onClick=\"this.setText('Click:'+new Date().getTime());\"></button>\n\n        <button android:id=\"btn_long_click\" android:text=\"ButtonLongClick\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\"></button>\n        <button android:text=\"ButtonStyled\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:style=\"@style/btn_custom1\"></button>\n        <button android:text=\"ButtonStyledDisable\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:style=\"@style/btn_custom1\" android:enabled=\"false\"></button>\n        <button android:text=\"ButtonStyled2\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:padding=\"8dp\" android:layout_margin=\"6dp\" android:textColor=\"@color/btn_color\" android:cornerRadius=\"4dp\" android:background=\"@color/red\" android:state_pressed=\"@style/btn_custom1_pressed\"></button>\n        <button android:text=\"ButtonStyled3\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:padding=\"8dp\" android:layout_margin=\"6dp\" android:textColor=\"@color/btn_color\" android:cornerRadius=\"4dp\" android:background=\"@color/red\" android:state_pressed=\"background:@color/red_press;\"></button>\n    </linearlayout>\n</scrollview>",
            "sample_contacte": "<linearlayout android:layout_height=\"match_parent\" android:layout_width=\"match_parent\" android:orientation=\"vertical\">\n    <button android:id=\"open_activity_intent\" android:text=\"startActivity with intent\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\"></button>\n    <button android:id=\"open_activity_result\" android:text=\"startActivity with result\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\"></button>\n    <scrollview android:layout_height=\"match_parent\" android:layout_width=\"match_parent\">\n        <linearlayout android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:orientation=\"vertical\">\n            <textview android:id=\"console_tv\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:gravity=\"center\"></textview>\n        </linearlayout>\n    </scrollview>\n</linearlayout>",
            "sample_drawerlayout": "<android.support.v4.widget.drawerlayout android:layout_height=\"match_parent\" android:layout_width=\"match_parent\">\n    <linearlayout android:orientation=\"vertical\" android:gravity=\"center\" android:layout_height=\"match_parent\" android:layout_width=\"match_parent\">\n        <button android:onClick=\"this.getParent().getParent().openDrawer(android.view.Gravity.LEFT);\" android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\" android:text=\"Open left drawer\"></button>\n        <button android:onClick=\"this.getParent().getParent().openDrawer(android.view.Gravity.RIGHT);\" android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\" android:text=\"Open right drawer\"></button>\n    </linearlayout>\n    <linearlayout android:layout_gravity=\"left\" android:background=\"white\" android:clickable=\"true\" android:layout_height=\"match_parent\" android:layout_width=\"220dp\">\n        <textview android:layout_height=\"match_parent\" android:layout_width=\"match_parent\" android:gravity=\"center\">Left drawer</textview>\n    </linearlayout>\n    <linearlayout android:layout_gravity=\"right\" android:background=\"white\" android:clickable=\"true\" android:layout_height=\"match_parent\" android:layout_width=\"220dp\">\n        <textview android:layout_height=\"match_parent\" android:layout_width=\"match_parent\" android:gravity=\"center\">Right drawer</textview>\n    </linearlayout>\n</android.support.v4.widget.drawerlayout>",
            "sample_edittext": "<scrollview android:layout_height=\"match_parent\" android:layout_width=\"match_parent\">\n    <linearlayout android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:orientation=\"vertical\">\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:hint=\"Place Input\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:hint=\"Input Type: textUri\" android:inputType=\"textUri\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:hint=\"Input Type: textEmailAddress\" android:inputType=\"textEmailAddress\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:hint=\"Input Type: textPassword\" android:inputType=\"textPassword\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:hint=\"Input Type: number\" android:inputType=\"number\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:hint=\"Input Type: numberDecimal\" android:inputType=\"numberDecimal\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:hint=\"Input Type: numberPassword\" android:inputType=\"numberPassword\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:hint=\"Input Type: phone\" android:inputType=\"phone\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:hint=\"maxLength11\" android:maxLength=\"11\" android:inputType=\"phone\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:maxLines=\"2\" android:padding=\"10dp\" android:text=\"maxLines=2\nmaxLines=2\nmaxLines=2\nmaxLines=2\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:minLines=\"2\" android:layout_width=\"match_parent\" android:gravity=\"center\" android:text=\"minLines=2\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:layout_height=\"100dp\" android:layout_width=\"match_parent\" android:text=\"static height\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\" android:gravity=\"center\" android:drawablePadding=\"12dp\" android:drawableLeft=\"url(assets/images/logo_android_1@2x.png)\" android:drawableTop=\"url(assets/images/logo_android_1@2x.png)\" android:drawableRight=\"url(assets/images/logo_android_1@2x.png)\" android:drawableBottom=\"url(assets/images/logo_android_1@2x.png)\" android:text=\"Image around EditText\" android:style=\"@style/editStyle\"></edittext>\n    </linearlayout>\n</scrollview>",
            "sample_expand_listview_item": "<framelayout android:id=\"item_child_layout\" android:layout_height=\"match_parent\" android:layout_width=\"match_parent\" android:padding=\"12dp\">\n    <textview android:id=\"item_child_text\" android:padding=\"12dp\" android:layout_width=\"wrap_content\" android:layout_height=\"wrap_content\" android:background=\"#55000000\" android:textColor=\"white\" android:layout_gravity=\"center\"></textview>\n</framelayout>",
            "sample_framelayout": "<framelayout android:layout_height=\"match_parent\" android:layout_width=\"match_parent\">\n\n    <textview android:text=\"Text\" android:layout_gravity=\"left|top\" android:style=\"@style/textStyle\"></textview>\n    <textview android:text=\"Text\" android:layout_gravity=\"right|top\" android:style=\"@style/textStyle\"></textview>\n    <textview android:text=\"Text\" android:layout_gravity=\"bottom|right\" android:style=\"@style/textStyle\"></textview>\n    <textview android:text=\"Text\" android:layout_gravity=\"bottom|left\" android:style=\"@style/textStyle\"></textview>\n    <textview android:text=\"Text\" android:layout_gravity=\"center\" android:style=\"@style/textStyle\"></textview>\n    <textview android:text=\"Text\" android:layout_gravity=\"left|center_vertical\" android:style=\"@style/textStyle\"></textview>\n    <textview android:text=\"Text\" android:layout_gravity=\"right|center_vertical\" android:style=\"@style/textStyle\"></textview>\n    <textview android:text=\"Text\" android:layout_gravity=\"top|center_horizontal\" android:style=\"@style/textStyle\"></textview>\n    <textview android:text=\"Text\" android:layout_gravity=\"bottom|center_horizontal\" android:style=\"@style/textStyle\"></textview>\n    <textview android:text=\"Text MarginBottom50\" android:layout_marginBottom=\"50dp\" android:layout_gravity=\"center\" android:style=\"@style/textStyle\"></textview>\n</framelayout>",
            "sample_gridview": "<gridview android:id=\"gridView\" android:numColumns=\"2\" android:layout_height=\"match_parent\" android:layout_width=\"match_parent\">\n</gridview>",
            "sample_gridview_item": "<framelayout android:layout_height=\"match_parent\" android:layout_width=\"match_parent\" android:id=\"item_layout\" android:padding=\"32dp\">\n    <textview android:id=\"item_text\" android:padding=\"16dp\" android:layout_width=\"wrap_content\" android:layout_height=\"wrap_content\" android:background=\"#55000000\" android:textColor=\"white\" android:layout_gravity=\"center\"></textview>\n</framelayout>",
            "sample_htmlview": "<scrollview android:fillviewport=\"true\">\n    <linearlayout android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:orientation=\"vertical\">\n        <htmlview>\n            <p style=\"font-size: 24px;text-align: center\">HtmlView</p>\n        </htmlview>\n        <htmlview style=\"padding:0 20px;box-sizing: border-box;line-height: 20px;\">\n            <p>HtmlView can wrap any <span style=\"color: red;font-weight: bold;\">HTML tag</span>, render with DOM, but too many HtmlView will reduce FPS.</p>\n            <p>HtmlView above on all Android Views</p>\n        </htmlview>\n        <textview android:gravity=\"center\">This is a Android View</textview>\n        <htmlview style=\"overflow: visible;text-align: center;\">\n            <p>This is a HtmlView</p>\n        </htmlview>\n    </linearlayout>\n</scrollview>",
            "sample_imageview": "<scrollview android:layout_height=\"match_parent\" android:layout_width=\"match_parent\">\n    <linearlayout android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:padding=\"0 6dp\" android:orientation=\"vertical\">\n        <textview android:text=\"Default(FitCenter):\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\"></textview>\n        <linearlayout android:orientation=\"horizontal\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\">\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:style=\"@style/imageStyle\"></imageview>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:layout_marginLeft=\"4dp\" android:layout_height=\"200dp\" android:style=\"@style/imageStyle\"></imageview>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:layout_width=\"match_parent\" android:layout_marginLeft=\"4dp\" android:style=\"@style/imageStyle\"></imageview>\n        </linearlayout>\n        <textview android:text=\"FitStart:\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\"></textview>\n        <linearlayout android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\">\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaleType=\"fitStart\" android:layout_height=\"200dp\" android:style=\"@style/imageStyle\"></imageview>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaleType=\"fitStart\" android:layout_width=\"match_parent\" android:layout_marginLeft=\"4dp\" android:style=\"@style/imageStyle\"></imageview>\n        </linearlayout>\n        <textview android:text=\"FitEnd:\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\"></textview>\n        <linearlayout android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\">\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaleType=\"fitEnd\" android:layout_height=\"200dp\" android:style=\"@style/imageStyle\"></imageview>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaleType=\"fitEnd\" android:layout_width=\"match_parent\" android:layout_marginLeft=\"4dp\" android:style=\"@style/imageStyle\"></imageview>\n        </linearlayout>\n        <textview android:text=\"FitXy:\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\"></textview>\n        <linearlayout android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\">\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaleType=\"fitXy\" android:layout_height=\"200dp\" android:style=\"@style/imageStyle\"></imageview>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaleType=\"fitXy\" android:layout_width=\"match_parent\" android:layout_marginLeft=\"4dp\" android:style=\"@style/imageStyle\"></imageview>\n        </linearlayout>\n        <textview android:text=\"Center:\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\"></textview>\n        <linearlayout android:orientation=\"horizontal\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\">\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaleType=\"center\" android:layout_height=\"80dp\" android:layout_width=\"80dp\" android:style=\"@style/imageStyle\"></imageview>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaleType=\"center\" android:layout_height=\"180dp\" android:layout_width=\"180dp\" android:layout_marginLeft=\"4dp\" android:style=\"@style/imageStyle\"></imageview>\n        </linearlayout>\n        <textview android:text=\"centerCrop:\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\"></textview>\n        <linearlayout android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\">\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaleType=\"centerCrop\" android:layout_height=\"80dp\" android:layout_width=\"80dp\" android:style=\"@style/imageStyle\"></imageview>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaleType=\"centerCrop\" android:layout_marginLeft=\"4dp\" android:layout_height=\"100dp\" android:layout_width=\"60dp\" android:style=\"@style/imageStyle\"></imageview>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaleType=\"centerCrop\" android:layout_height=\"60dp\" android:layout_width=\"100dp\" android:layout_marginLeft=\"4dp\" android:style=\"@style/imageStyle\"></imageview>\n        </linearlayout>\n        <textview android:text=\"centerInside:\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\"></textview>\n        <linearlayout android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\">\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaleType=\"centerInside\" android:layout_height=\"80dp\" android:layout_width=\"80dp\" android:style=\"@style/imageStyle\"></imageview>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaleType=\"centerInside\" android:layout_height=\"180dp\" android:layout_width=\"180dp\" android:layout_marginLeft=\"4dp\" android:style=\"@style/imageStyle\"></imageview>\n        </linearlayout>\n\n        <textview android:text=\"Background:\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\"></textview>\n        <framelayout android:style=\"@style/imageStyle\" android:background=\"url(assets/images/logo_android_1@2x.png)\"></framelayout>\n\n    </linearlayout>\n</scrollview>",
            "sample_life_callback": "<linearlayout android:layout_height=\"match_parent\" android:layout_width=\"match_parent\" android:orientation=\"vertical\">\n    <button android:id=\"open_activity_normal\" android:text=\"Open Normal Activity\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\"></button>\n    <button android:id=\"open_activity_float\" android:text=\"Open Floating Activity\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\"></button>\n    <scrollview android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\">\n        <linearlayout android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:orientation=\"vertical\">\n            <textview android:id=\"console_tv\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:gravity=\"center\"></textview>\n        </linearlayout>\n    </scrollview>\n</linearlayout>",
            "sample_linearlayout": "<linearlayout android:layout_height=\"match_parent\" android:layout_width=\"match_parent\" android:gravity=\"center_vertical\" android:orientation=\"vertical\">\n\n    <linearlayout android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:orientation=\"vertical\">\n        <textview android:text=\"Vertical\" android:style=\"@style/textStyle\"></textview>\n        <textview android:text=\"Vertical\" android:style=\"@style/textStyle\"></textview>\n\n    </linearlayout>\n    <linearlayout android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:layout_marginTop=\"12dp\" android:gravity=\"center\" android:orientation=\"vertical\">\n        <textview android:text=\"Vertical-Center\" android:style=\"@style/textStyle\"></textview>\n        <textview android:text=\"Vertical-Center\" android:style=\"@style/textStyle\"></textview>\n\n    </linearlayout>\n\n    <linearlayout android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:layout_marginTop=\"12dp\" android:orientation=\"horizontal\">\n        <textview android:text=\"horizontal\" android:style=\"@style/textStyle\"></textview>\n        <textview android:text=\"linear\" android:style=\"@style/textStyle\"></textview>\n        <textview android:text=\"layout\" android:style=\"@style/textStyle\"></textview>\n\n    </linearlayout>\n    <linearlayout android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:layout_marginTop=\"12dp\" android:gravity=\"center\" android:orientation=\"horizontal\">\n        <textview android:text=\"horizontal\" android:style=\"@style/textStyle\"></textview>\n        <textview android:text=\"linear\" android:style=\"@style/textStyle\"></textview>\n        <textview android:text=\"layout\" android:style=\"@style/textStyle\"></textview>\n        <textview android:text=\"-center\" android:style=\"@style/textStyle\"></textview>\n\n    </linearlayout>\n    <linearlayout android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:layout_marginTop=\"12dp\" android:gravity=\"right\" android:orientation=\"horizontal\">\n        <textview android:text=\"horizontal\" android:style=\"@style/textStyle\"></textview>\n        <textview android:text=\"linear\" android:style=\"@style/textStyle\"></textview>\n        <textview android:text=\"layout\" android:style=\"@style/textStyle\"></textview>\n        <textview android:text=\"-right\" android:style=\"@style/textStyle\"></textview>\n\n    </linearlayout>\n\n    <textview android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:layout_marginTop=\"12dp\" android:gravity=\"center\" android:text=\"more usage see Android's document\"></textview>\n\n</linearlayout>",
            "sample_listview": "<framelayout android:layout_height=\"match_parent\" android:layout_width=\"match_parent\">\n    <listview android:id=\"listView\" android:layout_height=\"match_parent\" android:layout_width=\"match_parent\"></listview>\n</framelayout>",
            "sample_listview_item": "<framelayout android:layout_height=\"match_parent\" android:layout_width=\"match_parent\" android:id=\"item_layout\" android:padding=\"32dp\">\n    <textview android:id=\"item_text\" android:padding=\"16dp\" android:layout_width=\"wrap_content\" android:layout_height=\"wrap_content\" android:background=\"#55000000\" android:textColor=\"white\" android:layout_gravity=\"center\"></textview>\n</framelayout>",
            "sample_picker": "<linearlayout android:layout_height=\"match_parent\" android:layout_width=\"match_parent\" android:orientation=\"vertical\" android:gravity=\"center\">\n    <numberpicker android:id=\"picker\" android:layout_height=\"280dp\" android:layout_width=\"match_parent\" android:itemCount=\"5\" android:minValue=\"1\" android:maxValue=\"9\">\n\n        <androidui.widget.htmldatapickeradapter>\n            <item>1</item>\n            <item>2</item>\n            <item>3</item>\n            <item>4</item>\n            <item>5</item>\n            <item>6</item>\n            <item>7</item>\n            <item>8</item>\n            <item>9</item>\n        </androidui.widget.htmldatapickeradapter>\n    </numberpicker>\n</linearlayout>",
            "sample_pullrefreshload": "<androidui.widget.pullrefreshloadlayout android:layout_height=\"match_parent\" android:layout_width=\"match_parent\" android:id=\"prll\">\n    <listview android:id=\"listView\" android:layout_height=\"match_parent\" android:layout_width=\"match_parent\"></listview>\n</androidui.widget.pullrefreshloadlayout>",
            "sample_pullrefreshload_item": "<framelayout android:layout_height=\"match_parent\" android:layout_width=\"match_parent\" android:id=\"item_layout\" android:padding=\"32dp\">\n    <textview android:id=\"item_text\" android:padding=\"16dp\" android:layout_width=\"wrap_content\" android:layout_height=\"wrap_content\" android:background=\"#55000000\" android:textColor=\"white\" android:layout_gravity=\"center\"></textview>\n</framelayout>",
            "sample_relativelayout": "<relativelayout android:layout_height=\"match_parent\" android:layout_width=\"match_parent\">\n    <textview android:id=\"text1\" android:style=\"@style/textStyle\" android:text=\"Left&amp;Top\"></textview>\n    <textview android:id=\"text2\" android:style=\"@style/textStyle\" android:text=\"Right&amp;Top\" android:layout_alignParentRight=\"true\"></textview>\n    <textview android:id=\"text3\" android:style=\"@style/textStyle\" android:text=\"Left&amp;Bottom\" android:layout_alignParentBottom=\"true\"></textview>\n    <textview android:id=\"text4\" android:style=\"@style/textStyle\" android:text=\"Right&amp;Bottom\" android:layout_alignParentRight=\"true\" android:layout_alignParentBottom=\"true\"></textview>\n    <textview android:id=\"text5\" android:style=\"@style/textStyle\" android:text=\"VerticalCenter\" android:layout_centerVertical=\"true\"></textview>\n    <textview android:id=\"text6\" android:style=\"@style/textStyle\" android:text=\"HorizontalCenter\" android:layout_centerHorizontal=\"true\"></textview>\n    <textview android:id=\"text7\" android:style=\"@style/textStyle\" android:text=\"Center\" android:layout_centerInParent=\"true\"></textview>\n\n    <textview android:style=\"@style/textStyle\" android:text=\"below\" android:layout_marginTop=\"4dp\" android:layout_below=\"text1\"></textview>\n\n    <textview android:style=\"@style/textStyle\" android:text=\"toRightOf\" android:layout_marginLeft=\"4dp\" android:layout_toRightOf=\"text3\" android:layout_alignParentBottom=\"true\"></textview>\n    <textview android:style=\"@style/textStyle\" android:text=\"above\" android:layout_marginBottom=\"4dp\" android:layout_above=\"text3\"></textview>\n    <textview android:style=\"@style/textStyle\" android:text=\"toLeftOf\" android:layout_marginRight=\"4dp\" android:layout_toLeftOf=\"text4\" android:layout_alignParentBottom=\"true\"></textview>\n\n    <textview android:id=\"alignLeft\" android:style=\"@style/textStyle\" android:text=\"  alignLeft  \" android:layout_marginTop=\"4dp\" android:layout_alignLeft=\"text6\" android:layout_below=\"text2\"></textview>\n    <textview android:style=\"@style/textStyle\" android:text=\"  alignRight  \" android:layout_marginTop=\"4dp\" android:layout_alignRight=\"text6\" android:layout_below=\"alignLeft\"></textview>\n    <textview android:id=\"alignTop\" android:style=\"@style/textStyle\" android:text=\"alignTop\" android:maxWidth=\"46dp\" android:layout_marginLeft=\"4dp\" android:layout_alignTop=\"text7\" android:layout_toRightOf=\"text7\"></textview>\n    <textview android:style=\"@style/textStyle\" android:text=\"alignBottom\" android:maxWidth=\"52dp\" android:layout_marginLeft=\"4dp\" android:layout_alignBottom=\"text7\" android:layout_toRightOf=\"alignTop\"></textview>\n    <textview android:style=\"@style/textStyle\" android:text=\"above&amp;toLeftOf\" android:layout_above=\"text7\" android:layout_toLeftOf=\"text7\"></textview>\n    <textview android:style=\"@style/textStyle\" android:text=\"toRightOf &amp; toLeftOf &amp; below\" android:layout_below=\"text7\" android:layout_toLeftOf=\"text7\" android:layout_toRightOf=\"text5\"></textview>\n</relativelayout>",
            "sample_textview": "<scrollview android:layout_height=\"match_parent\" android:layout_width=\"match_parent\">\n    <linearlayout android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:orientation=\"vertical\">\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:text=\"Text\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:padding=\"10dp\" android:text=\"Text Padding10\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:padding=\"10dp\" android:text=\"Line1\nLine2\nLine3\nLine4\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:maxLines=\"2\" android:ellipsize=\"end\" android:padding=\"10dp\" android:text=\"maxLines=2\nmaxLines=2\nmaxLines=2\nmaxLines=2\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:layout_width=\"match_parent\" android:padding=\"10dp\" android:gravity=\"center\" android:text=\"Text Center\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:minLines=\"2\" android:layout_width=\"match_parent\" android:padding=\"10dp\" android:gravity=\"center\" android:text=\"Text minLines=2\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:layout_width=\"match_parent\" android:padding=\"10dp\" android:gravity=\"right\" android:text=\"Text Right\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:layout_height=\"100dp\" android:layout_width=\"match_parent\" android:padding=\"10dp\" android:gravity=\"center\" android:text=\"Text Center\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:layout_height=\"100dp\" android:layout_width=\"match_parent\" android:padding=\"10dp\" android:gravity=\"bottom\" android:text=\"Text Bottom\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:layout_height=\"100dp\" android:layout_width=\"match_parent\" android:padding=\"10dp\" android:gravity=\"center_vertical\" android:text=\"Text center vertical\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:layout_height=\"100dp\" android:layout_width=\"match_parent\" android:padding=\"10dp\" android:gravity=\"center_horizontal\" android:text=\"Text center horizontal\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:layout_height=\"100dp\" android:layout_width=\"match_parent\" android:padding=\"10dp\" android:gravity=\"right|bottom\" android:text=\"Text right&amp;bottom\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\" android:padding=\"10dp\" android:gravity=\"center\" android:drawablePadding=\"12dp\" android:drawableLeft=\"url(assets/images/logo_android_1@2x.png)\" android:drawableTop=\"url(assets/images/logo_android_1@2x.png)\" android:drawableRight=\"url(assets/images/logo_android_1@2x.png)\" android:drawableBottom=\"url(assets/images/logo_android_1@2x.png)\" android:text=\"Image around text\" android:style=\"@style/textStyle\"></textview>\n    </linearlayout>\n</scrollview>",
            "sample_viewpager": "<framelayout android:layout_height=\"match_parent\" android:layout_width=\"match_parent\">\n    <android.support.v4.view.viewpager android:id=\"viewPager\" android:layout_height=\"match_parent\" android:layout_width=\"match_parent\">\n    </android.support.v4.view.viewpager>\n</framelayout>",
            "sample_viewpager_gallery": "<framelayout android:layout_height=\"match_parent\" android:layout_width=\"match_parent\">\n    <android.support.v4.view.viewpager android:layout_height=\"match_parent\" android:layout_width=\"match_parent\" android:background=\"#88000000\">\n        <androidui.widget.htmldatapageradapter>\n            <uk.co.senab.photoview.photoview android:src=\"assets/images/logo_android_3.png\">\n            </uk.co.senab.photoview.photoview>\n            <uk.co.senab.photoview.photoview android:src=\"assets/images/logo_android_2.png\">\n            </uk.co.senab.photoview.photoview>\n            <uk.co.senab.photoview.photoview android:src=\"assets/images/logo_google_1.jpg\">\n            </uk.co.senab.photoview.photoview>\n            <uk.co.senab.photoview.photoview android:src=\"assets/images/logo_google_2.png\">\n            </uk.co.senab.photoview.photoview>\n        </androidui.widget.htmldatapageradapter>\n    </android.support.v4.view.viewpager>\n    <linearlayout android:padding=\"4dp 12dp\" android:orientation=\"horizontal\" android:layout_gravity=\"bottom\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:background=\"#55000000\">\n        <textview android:text=\"Support gesture event, port from\" android:layout_height=\"match_parent\" android:layout_width=\"wrap_content\" android:textColor=\"white\"></textview>\n        <textview android:text=\"PhotoView\" android:layout_height=\"match_parent\" android:layout_width=\"wrap_content\" android:textColor=\"#FF0000cc\" android:padding=\"4dp\" android:state_pressed=\"background:#66ffffff\" android:onClick=\"location.href = 'https://github.com/chrisbanes/PhotoView'\"></textview>\n    </linearlayout>\n</framelayout>",
            "sample_viewpager_page": "<framelayout android:layout_height=\"match_parent\" android:layout_width=\"match_parent\" android:id=\"page_bg\">\n    <textview android:id=\"page_text\" android:padding=\"12dp\" android:layout_width=\"wrap_content\" android:layout_height=\"wrap_content\" android:background=\"#55000000\" android:textColor=\"white\" android:layout_gravity=\"center\"></textview>\n</framelayout>"
        },
        "values": {
            "color": {
                "white": "<color name=\"white\">white</color>",
                "light_gray": "<color name=\"light_gray\">#999</color>",
                "red": "<color name=\"red\">#fb3b00</color>",
                "red_press": "<color name=\"red_press\">#8A2000</color>",
                "red_disable": "<color name=\"red_disable\">#faa</color>",
                "green": "<color name=\"green\">#5fcf53</color>",
                "green_press": "<color name=\"green_press\">#45963C</color>"
            },
            "array": {
                "spinner_array": "<string-array name=\"spinner_array\">\n        <item>Item1</item>\n        <item>Item2</item>\n        <item>Item3</item>\n        <item>Item4</item>\n        <item>Item5</item>\n        <item>Item6</item>\n        <item>Item7</item>\n    </string-array>"
            },
            "style": {
                "page_text": "<android-style name=\"page_text\">\n       <item name=\"android:padding\">12dp</item>\n       <item name=\"android:layout_width\">wrap_content</item>\n       <item name=\"android:layout_height\">wrap_content</item>\n       <item name=\"android:background\">#5000000</item>\n       <item name=\"android:textColor\">white</item>\n       <item name=\"android:layout_gravity\">center</item>\n    </android-style>",
                "btn_custom1": "<android-style name=\"btn_custom1\">\n       <item name=\"android:padding\">8dp</item>\n       <item name=\"android:layout_margin\">6dp</item>\n       <item name=\"android:cornerRadius\">4dp</item>\n       <item name=\"android:textColor\">@color/btn_color</item>\n       <item name=\"android:background\">@drawable/btn_bg</item>\n    </android-style>",
                "btn_custom1_pressed": "<android-style name=\"btn_custom1_pressed\">\n        <item name=\"android:background\">@color/red_press</item>\n    </android-style>",
                "btn_custom1_disable": "<android-style name=\"btn_custom1_disable\">\n       <item name=\"android:background\">#faa</item>\n    </android-style>",
                "line_spit": "<android-style name=\"line_spit\">\n       <item name=\"android:layout_height\">4dp</item>\n       <item name=\"android:layout_width\">match_parent</item>\n    </android-style>",
                "textStyle": "<android-style name=\"textStyle\">\n       <item name=\"android:textSize\">12sp</item>\n       <item name=\"android:padding\">8dp</item>\n       <item name=\"android:textColor\">#333</item>\n       <item name=\"android:background\">#eee</item>\n       <item name=\"android:layout_width\">wrap_content</item>\n       <item name=\"android:layout_height\">wrap_content</item>\n    </android-style>",
                "editStyle": "<android-style name=\"editStyle\">\n       <item name=\"android:textColor\">#333</item>\n       <item name=\"android:layout_width\">wrap_content</item>\n       <item name=\"android:layout_height\">wrap_content</item>\n    </android-style>",
                "imageStyle": "<android-style name=\"imageStyle\">\n       <item name=\"android:background\">#eee</item>\n       <item name=\"android:layout_width\">wrap_content</item>\n       <item name=\"android:layout_height\">wrap_content</item>\n       <item name=\"android:layout_marginBottom\">12dp</item>\n    </android-style>"
            }
        }
    };
})(R || (R = {}));
var R;
(function (R) {
    var Resources = android.content.res.Resources;
    var NetDrawable = androidui.image.NetDrawable;
    var NinePatchDrawable = androidui.image.NinePatchDrawable;
    R.id = {
        android_tip: 'android_tip',
        rotate_repeat: 'rotate_repeat',
        translate_repeat: 'translate_repeat',
        scale_repeat: 'scale_repeat',
        alpha_repeat: 'alpha_repeat',
        anim_set: 'anim_set',
        btn_open_dialog: 'btn_open_dialog',
        btn_show_popup: 'btn_show_popup',
        btn_click: 'btn_click',
        btn_long_click: 'btn_long_click',
        open_activity_intent: 'open_activity_intent',
        open_activity_result: 'open_activity_result',
        console_tv: 'console_tv',
        item_child_layout: 'item_child_layout',
        item_child_text: 'item_child_text',
        gridView: 'gridView',
        item_layout: 'item_layout',
        item_text: 'item_text',
        open_activity_normal: 'open_activity_normal',
        open_activity_float: 'open_activity_float',
        listView: 'listView',
        picker: 'picker',
        prll: 'prll',
        text1: 'text1',
        text2: 'text2',
        text3: 'text3',
        text4: 'text4',
        text5: 'text5',
        text6: 'text6',
        text7: 'text7',
        alignLeft: 'alignLeft',
        alignTop: 'alignTop',
        viewPager: 'viewPager',
        page_bg: 'page_bg',
        page_text: 'page_text'
    };
    R.layout = {
        activity_main: '@layout/activity_main',
        sample_animation: '@layout/sample_animation',
        sample_base_widget: '@layout/sample_base_widget',
        sample_button: '@layout/sample_button',
        sample_contacte: '@layout/sample_contacte',
        sample_drawerlayout: '@layout/sample_drawerlayout',
        sample_edittext: '@layout/sample_edittext',
        sample_expand_listview_item: '@layout/sample_expand_listview_item',
        sample_framelayout: '@layout/sample_framelayout',
        sample_gridview: '@layout/sample_gridview',
        sample_gridview_item: '@layout/sample_gridview_item',
        sample_htmlview: '@layout/sample_htmlview',
        sample_imageview: '@layout/sample_imageview',
        sample_life_callback: '@layout/sample_life_callback',
        sample_linearlayout: '@layout/sample_linearlayout',
        sample_listview: '@layout/sample_listview',
        sample_listview_item: '@layout/sample_listview_item',
        sample_picker: '@layout/sample_picker',
        sample_pullrefreshload: '@layout/sample_pullrefreshload',
        sample_pullrefreshload_item: '@layout/sample_pullrefreshload_item',
        sample_relativelayout: '@layout/sample_relativelayout',
        sample_textview: '@layout/sample_textview',
        sample_viewpager: '@layout/sample_viewpager',
        sample_viewpager_gallery: '@layout/sample_viewpager_gallery',
        sample_viewpager_page: '@layout/sample_viewpager_page'
    };
    R.style = {
        page_text: '@style/page_text',
        btn_custom1: '@style/btn_custom1',
        btn_custom1_pressed: '@style/btn_custom1_pressed',
        btn_custom1_disable: '@style/btn_custom1_disable',
        line_spit: '@style/line_spit',
        textStyle: '@style/textStyle',
        editStyle: '@style/editStyle',
        imageStyle: '@style/imageStyle'
    };
    R.color = {
        btn_color: '@color/btn_color',
        white: '@color/white',
        light_gray: '@color/light_gray',
        red: '@color/red',
        red_press: '@color/red_press',
        red_disable: '@color/red_disable',
        green: '@color/green',
        green_press: '@color/green_press'
    };
    R.array = {
        spinner_array: '@array/spinner_array'
    };
    R.integer = {};
    R.fraction = {};

    var drawable = function () {
        function drawable() {
            _classCallCheck(this, drawable);
        }

        _createClass(drawable, null, [{
            key: "btn_bg",
            get: function get() {
                return Resources.getSystem().getDrawable('btn_bg');
            }
        }, {
            key: "icon_alert",
            get: function get() {
                return Resources.getSystem().getDrawable('icon_alert');
            }
        }]);

        return drawable;
    }();

    R.drawable = drawable;

    var string_ = function string_() {
        _classCallCheck(this, string_);
    };

    R.string_ = string_;

    var bool = function bool() {
        _classCallCheck(this, bool);
    };

    R.bool = bool;
    var res_data = R._res_data;
    function resDirSpecMatch(spec) {
        spec = spec.toLocaleLowerCase();
        var ratio = window.devicePixelRatio;
        if (ratio === 0.75 && spec === 'ldpi') return true;
        if (ratio === 1 && spec === 'mdpi') return true;
        if (ratio === 1.5 && spec === 'hdpi') return true;
        if (ratio === 2 && spec === 'xhdpi') return true;
        if (ratio === 3 && spec === 'xxhdpi') return true;
        if (ratio === 4 && spec === 'xxxhdpi') return true;
        var dpi = ratio * 160;
        if (spec === dpi + 'dpi') return true;
        var xdp = document.documentElement.offsetWidth;
        var ydp = document.documentElement.offsetHeight;
        var minDP = Math.min(xdp, ydp);
        var maxDP = Math.max(xdp, ydp);
        if (spec === 'xlarge' && maxDP > 960 && minDP > 720) return true;
        if (spec === 'large' && maxDP > 640 && minDP > 480) return true;
        if (spec === 'normal' && maxDP > 470 && minDP > 320) return true;
        if (spec === 'small' && maxDP > 426 && minDP > 320) return true;
        if (spec === 'port' && ydp > xdp) return true;
        if (spec === 'land' && xdp > ydp) return true;
        if (spec === xdp + 'x' + ydp || spec === ydp + 'x' + xdp) return true;
        var swMatch = spec.match(/sw(d*)dp/);
        if (swMatch && parseInt(swMatch[1]) >= minDP) return true;
        var wMatch = spec.match(/w(d*)dp/);
        if (wMatch && parseInt(wMatch[1]) >= xdp) return true;
        var hMatch = spec.match(/h(d*)dp/);
        if (hMatch && parseInt(hMatch[1]) >= ydp) return true;
        var lang = navigator.language.toLocaleLowerCase().split('-')[0];
        if (lang === spec) return true;
        if (spec.startsWith('r')) {
            var specArea = spec.substring(1);
            var langArea = navigator.language.toLocaleLowerCase().split('-')[1];
            if (langArea === specArea) return true;
        }
    }
    var matchDirNamesCache = {};
    function findMatchDirNames(baseDirName) {
        if (matchDirNamesCache[baseDirName]) return matchDirNamesCache[baseDirName];
        var matchDirNames = [];
        for (var dirName in res_data) {
            if (dirName == baseDirName || dirName.startsWith(baseDirName + '-')) {
                matchDirNames.push(dirName);
            }
        }
        matchDirNames = matchDirNames.sort(function (a, b) {
            var bSplits = b.split('-');
            bSplits.shift();
            var bMatchTimes = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = bSplits[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var split = _step.value;

                    if (resDirSpecMatch(split)) bMatchTimes++;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var aSplits = a.split('-');
            aSplits.shift();
            var aMatchTimes = 0;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = aSplits[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _split = _step2.value;

                    if (resDirSpecMatch(_split)) aMatchTimes++;
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return bMatchTimes - aMatchTimes;
        });
        matchDirNamesCache[baseDirName] = matchDirNames;
        return matchDirNames;
    }
    function findImageFile(fileName) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            var _loop = function _loop() {
                var dirName = _step3.value;

                var dir = res_data[dirName];
                if (dirName === 'drawable') {
                    var findImageWithRatioName = function findImageWithRatioName(ratio) {
                        var fileStr = dir[fileName + '@' + ratio + 'x'];
                        if (fileStr && fileStr.startsWith('data:image')) {
                            return new NetDrawable(fileStr, null, ratio);
                        }
                        var fileNameWithNinePatch = fileName + '@' + ratio + 'x' + '.9';
                        fileStr = dir[fileNameWithNinePatch];
                        if (fileStr && fileStr.startsWith('data:image')) {
                            return new NinePatchDrawable(fileStr, null, ratio);
                        }
                    };

                    var ratioDrawable = findImageWithRatioName(window.devicePixelRatio) || findImageWithRatioName(6) || findImageWithRatioName(5) || findImageWithRatioName(4) || findImageWithRatioName(3) || findImageWithRatioName(2) || findImageWithRatioName(1);
                    if (ratioDrawable) return {
                            v: ratioDrawable
                        };
                }
                var ratio = 1;
                if (dirName.includes('-')) {
                    if (dirName.includes('-ldpi')) ratio = 0.75;else if (dirName.includes('-mdpi')) ratio = 1;else if (dirName.includes('-hdpi')) ratio = 1.5;else if (dirName.includes('-xhdpi')) ratio = 2;else if (dirName.includes('-xxhdpi')) ratio = 3;else if (dirName.includes('-xxxhdpi')) ratio = 4;
                }
                var fileStr = dir[fileName];
                if (fileStr && fileStr.startsWith('data:image')) {
                    return {
                        v: new NetDrawable(fileStr, null, ratio)
                    };
                }
                var fileNameWithNinePatch = fileName + '.9';
                fileStr = dir[fileNameWithNinePatch];
                if (fileStr && fileStr.startsWith('data:image')) {
                    return {
                        v: new NinePatchDrawable(fileStr, null, ratio)
                    };
                }
            };

            for (var _iterator3 = findMatchDirNames('drawable')[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _ret = _loop();

                if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }
    }
    var _tempDiv = document.createElement('div');
    function findXmlFile(baseDirName, fileName) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = findMatchDirNames(baseDirName)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var _dirName = _step4.value;

                var _dir = res_data[_dirName];
                if (_dir[fileName]) {
                    _tempDiv.innerHTML = _dir[fileName];
                    var data = _tempDiv.firstElementChild;
                    _tempDiv.removeChild(data);
                    return data;
                }
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }
    }
    function findResourcesValue(valueType, valueName) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
            for (var _iterator5 = findMatchDirNames('values')[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var _dirName2 = _step5.value;

                var _dir2 = res_data[_dirName2];
                if (_dir2[valueType] && _dir2[valueType][valueName]) {
                    _tempDiv.innerHTML = _dir2[valueType][valueName];
                    var data = _tempDiv.firstElementChild;
                    _tempDiv.removeChild(data);
                    return data;
                }
            }
        } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                    _iterator5.return();
                }
            } finally {
                if (_didIteratorError5) {
                    throw _iteratorError5;
                }
            }
        }
    }
    if ('_AppBuildValueFinder' in android.content.res.Resources) {
        android.content.res.Resources._AppBuildImageFileFinder = function (refString) {
            if (refString.startsWith('@drawable/')) {
                refString = refString.substring('@drawable/'.length);
            }
            return findImageFile(refString);
        };
        android.content.res.Resources._AppBuildXmlFinder = function (refString) {
            if (!refString.startsWith('@')) {
                throw Error('refString must starts with @, current: ' + refString);
            }
            refString = refString.substring(1);
            var splits = refString.split('/');
            if (splits.length != 2) throw Error('refString must have one \'/\', current: ' + refString);
            return findXmlFile(splits[0], splits[1]);
        };
        android.content.res.Resources._AppBuildValueFinder = function (refString) {
            if (!refString.startsWith('@')) {
                throw Error('refString must starts with @, current: ' + refString);
            }
            refString = refString.substring(1);
            var splits = refString.split('/');
            if (splits.length != 2) throw Error('refString must have one \'/\', current: ' + refString);
            return findResourcesValue(splits[0], splits[1]);
        };
    } else {
        throw Error('Error: sdk version is too old. Please update your androidui sdk.');
    }
})(R || (R = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;

        var MainActivity = function (_ActionBarActivity) {
            _inherits(MainActivity, _ActionBarActivity);

            function MainActivity() {
                _classCallCheck(this, MainActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(MainActivity).apply(this, arguments));
            }

            _createClass(MainActivity, [{
                key: "onCreate",
                value: function onCreate(savedInstanceState) {
                    _get(Object.getPrototypeOf(MainActivity.prototype), "onCreate", this).call(this, savedInstanceState);
                    var activity = this;
                    this.setContentView(R.layout.activity_main);
                    if (navigator.userAgent.match('Android')) {
                        this.findViewById(R.id.android_tip).setVisibility(android.view.View.VISIBLE);
                    }
                }
            }, {
                key: "onCreateOptionsMenu",
                value: function onCreateOptionsMenu(menu) {
                    menu.add(android.view.Menu.NONE, 1, android.view.Menu.NONE, 'Fork me on GitHub');
                    menu.add(android.view.Menu.NONE, 2, android.view.Menu.NONE, 'About');
                    return true;
                }
            }, {
                key: "onOptionsItemSelected",
                value: function onOptionsItemSelected(item) {
                    switch (item.getItemId()) {
                        case 1:
                            window.location.href = 'https://github.com/linfaxin/AndroidUIX';
                        case 2:
                            new android.app.AlertDialog.Builder(this).setTitle('About').setMessage('Make a high-performance Web App with Android UI!').setPositiveButton(android.R.string_.ok, null).show();
                    }
                    return true;
                }
            }, {
                key: "onBackPressed",
                value: function onBackPressed() {
                    var _this2 = this;

                    if (!this.confirmDialog) {
                        (function () {
                            var activity = _this2;
                            _this2.confirmDialog = new android.app.AlertDialog.Builder(activity).setTitle('Promt').setIcon(R.drawable.icon_alert).setMessage('Exit confirm?').setNegativeButton(android.R.string_.cancel, null).setPositiveButton(android.R.string_.ok, {
                                onClick: function onClick(dialog, which) {
                                    activity.finish();
                                }
                            }).create();
                        })();
                    }
                    this.confirmDialog.show();
                }
            }]);

            return MainActivity;
        }(ActionBarActivity);

        app.MainActivity = MainActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;
        var Animation = android.view.animation.Animation;

        var SampleAnimationActivity = function (_ActionBarActivity2) {
            _inherits(SampleAnimationActivity, _ActionBarActivity2);

            function SampleAnimationActivity() {
                _classCallCheck(this, SampleAnimationActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleAnimationActivity).apply(this, arguments));
            }

            _createClass(SampleAnimationActivity, [{
                key: "onCreate",
                value: function onCreate() {
                    _get(Object.getPrototypeOf(SampleAnimationActivity.prototype), "onCreate", this).call(this);
                    this.setTitle('Animation');
                    this.setContentView(R.layout.sample_animation);
                    var rotateView = this.findViewById('rotate_repeat');
                    var rotateAnimation = new android.view.animation.RotateAnimation(0, 360, Animation.RELATIVE_TO_SELF, 0.5, Animation.RELATIVE_TO_SELF, 0.5);
                    rotateAnimation.setRepeatCount(Animation.INFINITE);
                    rotateAnimation.setDuration(1000);
                    rotateAnimation.setInterpolator(new android.view.animation.LinearInterpolator());
                    rotateView.startAnimation(rotateAnimation);
                    var transView = this.findViewById('translate_repeat');
                    var density = android.content.res.Resources.getDisplayMetrics().density;
                    var transAnimation = new android.view.animation.TranslateAnimation(-100 * density, 100 * density, 50 * density, -50 * density);
                    transAnimation.setRepeatCount(Animation.INFINITE);
                    transAnimation.setRepeatMode(Animation.REVERSE);
                    transAnimation.setDuration(1000);
                    transView.startAnimation(transAnimation);
                    var scaleView = this.findViewById('scale_repeat');
                    var scaleAnimation = new android.view.animation.ScaleAnimation(0.5, 1.5, 0.5, 1.5, Animation.RELATIVE_TO_SELF, 0.5, Animation.RELATIVE_TO_SELF, 0.5);
                    scaleAnimation.setRepeatCount(Animation.INFINITE);
                    scaleAnimation.setRepeatMode(Animation.REVERSE);
                    scaleAnimation.setDuration(1000);
                    scaleView.startAnimation(scaleAnimation);
                    var alphaView = this.findViewById('alpha_repeat');
                    var alphaAnimation = new android.view.animation.AlphaAnimation(1, 0.1);
                    alphaAnimation.setRepeatCount(Animation.INFINITE);
                    alphaAnimation.setRepeatMode(Animation.REVERSE);
                    alphaAnimation.setDuration(500);
                    alphaView.startAnimation(alphaAnimation);
                    var animSetView = this.findViewById('anim_set');
                    var animSet = new android.view.animation.AnimationSet();
                    animSet.addAnimation(rotateAnimation);
                    animSet.addAnimation(transAnimation);
                    animSet.addAnimation(scaleAnimation);
                    animSet.addAnimation(alphaAnimation);
                    animSetView.startAnimation(animSet);
                }
            }]);

            return SampleAnimationActivity;
        }(ActionBarActivity);

        app.SampleAnimationActivity = SampleAnimationActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;
        var AlertDialog = android.app.AlertDialog;
        var Toast = android.widget.Toast;
        var TextView = android.widget.TextView;
        var PopupWindow = android.widget.PopupWindow;

        var SampleBaseWidgetActivity = function (_ActionBarActivity3) {
            _inherits(SampleBaseWidgetActivity, _ActionBarActivity3);

            function SampleBaseWidgetActivity() {
                _classCallCheck(this, SampleBaseWidgetActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleBaseWidgetActivity).apply(this, arguments));
            }

            _createClass(SampleBaseWidgetActivity, [{
                key: "onCreate",
                value: function onCreate() {
                    _get(Object.getPrototypeOf(SampleBaseWidgetActivity.prototype), "onCreate", this).call(this);
                    this.setTitle('Base Widget');
                    var activity = this;
                    this.setContentView(R.layout.sample_base_widget);
                    var btnOpenDialog = this.findViewById('btn_open_dialog');
                    btnOpenDialog.setOnClickListener({
                        onClick: function onClick(view) {
                            new AlertDialog.Builder(view.getContext()).setTitle('Title').setMessage('ContentContent').setPositiveButton(android.R.string_.ok, {
                                onClick: function onClick(dialog, which) {
                                    Toast.makeText(activity, android.R.string_.ok, Toast.LENGTH_SHORT).show();
                                }
                            }).setIcon(R.drawable.icon_alert).setNegativeButton(android.R.string_.cancel, null).show();
                        }
                    });
                    var popupContent = new TextView(this);
                    popupContent.setGravity(android.view.Gravity.CENTER);
                    popupContent.setText('PopupWindow');
                    popupContent.setBackgroundColor(0xffcccccc);
                    var popWindow = new PopupWindow(popupContent, -2, 40 * this.getResources().getDisplayMetrics().density, true);
                    var btnShowPopup = this.findViewById('btn_show_popup');
                    btnShowPopup.setOnClickListener({
                        onClick: function onClick(view) {
                            popWindow.showAsDropDown(view);
                        }
                    });
                }
            }]);

            return SampleBaseWidgetActivity;
        }(ActionBarActivity);

        app.SampleBaseWidgetActivity = SampleBaseWidgetActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;

        var SampleButtonActivity = function (_ActionBarActivity4) {
            _inherits(SampleButtonActivity, _ActionBarActivity4);

            function SampleButtonActivity() {
                _classCallCheck(this, SampleButtonActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleButtonActivity).apply(this, arguments));
            }

            _createClass(SampleButtonActivity, [{
                key: "onCreate",
                value: function onCreate() {
                    _get(Object.getPrototypeOf(SampleButtonActivity.prototype), "onCreate", this).call(this);
                    this.setTitle('Button');
                    this.setContentView(R.layout.sample_button);
                    var btn_click = this.findViewById('btn_click');
                    btn_click.setOnClickListener({
                        onClick: function onClick(v) {
                            btn_click.setText('Click:' + new Date().getTime() + '');
                        }
                    });
                    var btn_long_click = this.findViewById('btn_long_click');
                    btn_long_click.setOnLongClickListener({
                        onLongClick: function onLongClick(v) {
                            btn_long_click.setText('LongClick:' + new Date().getTime() + '');
                            return true;
                        }
                    });
                }
            }]);

            return SampleButtonActivity;
        }(ActionBarActivity);

        app.SampleButtonActivity = SampleButtonActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var Activity = android.app.Activity;
        var ActionBarActivity = android.app.ActionBarActivity;
        var Intent = android.content.Intent;
        var TextView = android.widget.TextView;
        var Button = android.widget.Button;
        var Log = android.util.Log;
        var Gravity = android.view.Gravity;
        var TAG = 'SampleContacteActivity';

        var SampleContacteActivity = function (_ActionBarActivity5) {
            _inherits(SampleContacteActivity, _ActionBarActivity5);

            function SampleContacteActivity() {
                _classCallCheck(this, SampleContacteActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleContacteActivity).apply(this, arguments));
            }

            _createClass(SampleContacteActivity, [{
                key: "onCreate",
                value: function onCreate(savedInstanceState) {
                    _get(Object.getPrototypeOf(SampleContacteActivity.prototype), "onCreate", this).call(this, savedInstanceState);
                    this.setTitle('Activity Start&Result');
                    this.setContentView(R.layout.sample_contacte);
                    this.printTextView = this.findViewById('console_tv');
                    var activity = this;
                    this.findViewById('open_activity_intent').setOnClickListener({
                        onClick: function onClick(view) {
                            var intent = new Intent('sample.app.SampleShowIntentActivity').putExtra('startTime', new Date().getTime());
                            activity.startActivity(intent);
                        }
                    });
                    this.findViewById('open_activity_result').setOnClickListener({
                        onClick: function onClick(view) {
                            var intent = new Intent('sample.app.SampleResultActivity');
                            activity.startActivityForResult(intent, 1);
                        }
                    });
                }
            }, {
                key: "print",
                value: function print(message) {
                    Log.d(TAG, message);
                    this.printTextView.setText(this.printTextView.getText() + '\n' + message);
                }
            }, {
                key: "onActivityResult",
                value: function onActivityResult(requestCode, resultCode, data) {
                    _get(Object.getPrototypeOf(SampleContacteActivity.prototype), "onActivityResult", this).call(this, requestCode, resultCode, data);
                    if (resultCode === Activity.RESULT_OK) {
                        if (requestCode === 1) {
                            this.print('resultTime:' + data.getStringExtra('resultTime'));
                        }
                    }
                }
            }]);

            return SampleContacteActivity;
        }(ActionBarActivity);

        app.SampleContacteActivity = SampleContacteActivity;

        var SampleShowIntentActivity = function (_ActionBarActivity6) {
            _inherits(SampleShowIntentActivity, _ActionBarActivity6);

            function SampleShowIntentActivity() {
                _classCallCheck(this, SampleShowIntentActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleShowIntentActivity).apply(this, arguments));
            }

            _createClass(SampleShowIntentActivity, [{
                key: "onCreate",
                value: function onCreate(savedInstanceState) {
                    _get(Object.getPrototypeOf(SampleShowIntentActivity.prototype), "onCreate", this).call(this, savedInstanceState);
                    var info = new TextView(this);
                    info.setText('\n startTime： ' + this.getIntent().getStringExtra('startTime', null));
                    this.addContentView(info, new android.widget.FrameLayout.LayoutParams(-2, -2, Gravity.CENTER));
                }
            }]);

            return SampleShowIntentActivity;
        }(ActionBarActivity);

        app.SampleShowIntentActivity = SampleShowIntentActivity;

        var SampleResultActivity = function (_ActionBarActivity7) {
            _inherits(SampleResultActivity, _ActionBarActivity7);

            function SampleResultActivity() {
                _classCallCheck(this, SampleResultActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleResultActivity).apply(this, arguments));
            }

            _createClass(SampleResultActivity, [{
                key: "onCreate",
                value: function onCreate(savedInstanceState) {
                    _get(Object.getPrototypeOf(SampleResultActivity.prototype), "onCreate", this).call(this, savedInstanceState);
                    var activity = this;
                    var btn = new Button(this);
                    btn.setText('Close & setResult');
                    btn.setOnClickListener({
                        onClick: function onClick(view) {
                            activity.setResult(Activity.RESULT_OK, new Intent().putExtra('resultTime', new Date().getTime() + ''));
                            activity.finish();
                        }
                    });
                    var params = new android.widget.FrameLayout.LayoutParams(-2, -2, Gravity.CENTER);
                    this.setContentView(btn, params);
                }
            }]);

            return SampleResultActivity;
        }(ActionBarActivity);

        app.SampleResultActivity = SampleResultActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;

        var SampleDrawerLayoutActivity = function (_ActionBarActivity8) {
            _inherits(SampleDrawerLayoutActivity, _ActionBarActivity8);

            function SampleDrawerLayoutActivity() {
                _classCallCheck(this, SampleDrawerLayoutActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleDrawerLayoutActivity).apply(this, arguments));
            }

            _createClass(SampleDrawerLayoutActivity, [{
                key: "onCreate",
                value: function onCreate() {
                    _get(Object.getPrototypeOf(SampleDrawerLayoutActivity.prototype), "onCreate", this).call(this);
                    this.setTitle('DrawerLayout');
                    this.setContentView(R.layout.sample_drawerlayout);
                }
            }]);

            return SampleDrawerLayoutActivity;
        }(ActionBarActivity);

        app.SampleDrawerLayoutActivity = SampleDrawerLayoutActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;

        var SampleEditTextActivity = function (_ActionBarActivity9) {
            _inherits(SampleEditTextActivity, _ActionBarActivity9);

            function SampleEditTextActivity() {
                _classCallCheck(this, SampleEditTextActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleEditTextActivity).apply(this, arguments));
            }

            _createClass(SampleEditTextActivity, [{
                key: "onCreate",
                value: function onCreate() {
                    _get(Object.getPrototypeOf(SampleEditTextActivity.prototype), "onCreate", this).call(this);
                    this.setTitle('EditText');
                    this.setContentView(R.layout.sample_edittext);
                }
            }]);

            return SampleEditTextActivity;
        }(ActionBarActivity);

        app.SampleEditTextActivity = SampleEditTextActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;
        var TextView = android.widget.TextView;
        var View = android.view.View;
        var ExpandableListView = android.widget.ExpandableListView;
        var BaseExpandableListAdapter = android.widget.BaseExpandableListAdapter;

        var SampleExpandableListViewActivity = function (_ActionBarActivity10) {
            _inherits(SampleExpandableListViewActivity, _ActionBarActivity10);

            function SampleExpandableListViewActivity() {
                _classCallCheck(this, SampleExpandableListViewActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleExpandableListViewActivity).apply(this, arguments));
            }

            _createClass(SampleExpandableListViewActivity, [{
                key: "onCreate",
                value: function onCreate() {
                    _get(Object.getPrototypeOf(SampleExpandableListViewActivity.prototype), "onCreate", this).call(this);
                    this.setTitle('ExpandableListView');
                    var listView = new ExpandableListView(this);
                    this.setContentView(listView);
                    listView.setExpandableAdapter(new MyListAdapter());
                    listView.expandGroup(0);
                }
            }]);

            return SampleExpandableListViewActivity;
        }(ActionBarActivity);

        app.SampleExpandableListViewActivity = SampleExpandableListViewActivity;

        var MyListAdapter = function (_BaseExpandableListAd) {
            _inherits(MyListAdapter, _BaseExpandableListAd);

            function MyListAdapter() {
                var _Object$getPrototypeO;

                _classCallCheck(this, MyListAdapter);

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                var _this12 = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(MyListAdapter)).call.apply(_Object$getPrototypeO, [this].concat(args)));

                _this12.data = [{ 'name': 'A', 'items': ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'] }, { 'name': 'B', 'items': ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10'] }, { 'name': 'C', 'items': ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'] }, { 'name': 'D', 'items': ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'] }, { 'name': 'E', 'items': ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10'] }, { 'name': 'F', 'items': ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10'] }, { 'name': 'G', 'items': ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10'] }, { 'name': 'H', 'items': ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10'] }, { 'name': 'I', 'items': ['I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9', 'I10'] }, { 'name': 'J', 'items': ['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10'] }, { 'name': 'K', 'items': ['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8', 'K9', 'K10'] }];
                return _this12;
            }

            _createClass(MyListAdapter, [{
                key: "getGroupCount",
                value: function getGroupCount() {
                    return this.data.length;
                }
            }, {
                key: "getChildrenCount",
                value: function getChildrenCount(groupPosition) {
                    return this.data[groupPosition].items.length;
                }
            }, {
                key: "getGroup",
                value: function getGroup(groupPosition) {
                    return this.data[groupPosition].name;
                }
            }, {
                key: "getChild",
                value: function getChild(groupPosition, childPosition) {
                    return this.data[groupPosition].items[childPosition];
                }
            }, {
                key: "getGroupView",
                value: function getGroupView(groupPosition, isExpanded, convertView, parent) {
                    var tv = convertView;
                    if (tv == null) {
                        tv = new TextView();
                        var density = android.content.res.Resources.getDisplayMetrics().density;
                        tv.setTextSize(18);
                        tv.setPadding(12 * density, 6 * density, 6 * density, 6 * density);
                        tv.setBackgroundColor(0x88888888);
                    }
                    tv.setText(this.getGroup(groupPosition));
                    return tv;
                }
            }, {
                key: "getChildView",
                value: function getChildView(groupPosition, childPosition, isLastChild, convertView, parent) {
                    if (convertView == null) {
                        convertView = View.inflate(parent.getContext(), R.layout.sample_expand_listview_item, null);
                    }
                    convertView.findViewById('item_child_text').setText(this.getChild(groupPosition, childPosition));
                    return convertView;
                }
            }, {
                key: "getGroupId",
                value: function getGroupId(groupPosition) {
                    return 0;
                }
            }, {
                key: "getChildId",
                value: function getChildId(groupPosition, childPosition) {
                    return 0;
                }
            }, {
                key: "hasStableIds",
                value: function hasStableIds() {
                    return false;
                }
            }, {
                key: "isChildSelectable",
                value: function isChildSelectable(groupPosition, childPosition) {
                    return false;
                }
            }]);

            return MyListAdapter;
        }(BaseExpandableListAdapter);
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;

        var SampleFrameLayoutActivity = function (_ActionBarActivity11) {
            _inherits(SampleFrameLayoutActivity, _ActionBarActivity11);

            function SampleFrameLayoutActivity() {
                _classCallCheck(this, SampleFrameLayoutActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleFrameLayoutActivity).apply(this, arguments));
            }

            _createClass(SampleFrameLayoutActivity, [{
                key: "onCreate",
                value: function onCreate() {
                    _get(Object.getPrototypeOf(SampleFrameLayoutActivity.prototype), "onCreate", this).call(this);
                    this.setTitle('FrameLayout');
                    this.setContentView(R.layout.sample_framelayout);
                }
            }]);

            return SampleFrameLayoutActivity;
        }(ActionBarActivity);

        app.SampleFrameLayoutActivity = SampleFrameLayoutActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;
        var View = android.view.View;
        var BaseAdapter = android.widget.BaseAdapter;

        var SampleGridViewActivity = function (_ActionBarActivity12) {
            _inherits(SampleGridViewActivity, _ActionBarActivity12);

            function SampleGridViewActivity() {
                _classCallCheck(this, SampleGridViewActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleGridViewActivity).apply(this, arguments));
            }

            _createClass(SampleGridViewActivity, [{
                key: "onCreate",
                value: function onCreate() {
                    _get(Object.getPrototypeOf(SampleGridViewActivity.prototype), "onCreate", this).call(this);
                    this.setTitle('GridView');
                    this.setContentView(R.layout.sample_gridview);
                    var listView = this.findViewById('gridView');
                    listView.setAdapter(new MyAdapter());
                }
            }]);

            return SampleGridViewActivity;
        }(ActionBarActivity);

        app.SampleGridViewActivity = SampleGridViewActivity;

        var MyAdapter = function (_BaseAdapter) {
            _inherits(MyAdapter, _BaseAdapter);

            function MyAdapter() {
                _classCallCheck(this, MyAdapter);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(MyAdapter).apply(this, arguments));
            }

            _createClass(MyAdapter, [{
                key: "getView",
                value: function getView(position, convertView, parent) {
                    if (convertView == null) {
                        convertView = View.inflate(parent.getContext(), R.layout.sample_gridview_item, null);
                    }
                    convertView.findViewById('item_text').setText(this.getItem(position));
                    return convertView;
                }
            }, {
                key: "getCount",
                value: function getCount() {
                    return 200;
                }
            }, {
                key: "getItem",
                value: function getItem(position) {
                    return 1 + position + '/' + this.getCount();
                }
            }, {
                key: "getItemId",
                value: function getItemId(position) {
                    return -1;
                }
            }]);

            return MyAdapter;
        }(BaseAdapter);
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;

        var SampleHtmlViewActivity = function (_ActionBarActivity13) {
            _inherits(SampleHtmlViewActivity, _ActionBarActivity13);

            function SampleHtmlViewActivity() {
                _classCallCheck(this, SampleHtmlViewActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleHtmlViewActivity).apply(this, arguments));
            }

            _createClass(SampleHtmlViewActivity, [{
                key: "onCreate",
                value: function onCreate() {
                    _get(Object.getPrototypeOf(SampleHtmlViewActivity.prototype), "onCreate", this).call(this);
                    this.setTitle('HtmlView');
                    this.setContentView(R.layout.sample_htmlview);
                }
            }]);

            return SampleHtmlViewActivity;
        }(ActionBarActivity);

        app.SampleHtmlViewActivity = SampleHtmlViewActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;

        var SampleImageViewActivity = function (_ActionBarActivity14) {
            _inherits(SampleImageViewActivity, _ActionBarActivity14);

            function SampleImageViewActivity() {
                _classCallCheck(this, SampleImageViewActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleImageViewActivity).apply(this, arguments));
            }

            _createClass(SampleImageViewActivity, [{
                key: "onCreate",
                value: function onCreate() {
                    _get(Object.getPrototypeOf(SampleImageViewActivity.prototype), "onCreate", this).call(this);
                    this.setTitle('ImageView');
                    this.setContentView(R.layout.sample_imageview);
                }
            }]);

            return SampleImageViewActivity;
        }(ActionBarActivity);

        app.SampleImageViewActivity = SampleImageViewActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;
        var Intent = android.content.Intent;
        var Button = android.widget.Button;
        var Log = android.util.Log;
        var Gravity = android.view.Gravity;
        var TAG = 'SampleLifeCallbackActivity';

        var SampleLifeCallbackActivity = function (_ActionBarActivity15) {
            _inherits(SampleLifeCallbackActivity, _ActionBarActivity15);

            function SampleLifeCallbackActivity() {
                _classCallCheck(this, SampleLifeCallbackActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleLifeCallbackActivity).apply(this, arguments));
            }

            _createClass(SampleLifeCallbackActivity, [{
                key: "onCreate",
                value: function onCreate(savedInstanceState) {
                    _get(Object.getPrototypeOf(SampleLifeCallbackActivity.prototype), "onCreate", this).call(this, savedInstanceState);
                    this.setTitle('Activity Life Circel');
                    this.setContentView(R.layout.sample_life_callback);
                    this.printTextView = this.findViewById('console_tv');
                    var activity = this;
                    this.findViewById('open_activity_normal').setOnClickListener({
                        onClick: function onClick(view) {
                            activity.startActivity('sample.app.SampleLifeCallbackNormalActivity');
                        }
                    });
                    this.findViewById('open_activity_float').setOnClickListener({
                        onClick: function onClick(view) {
                            activity.startActivity('sample.app.SampleLifeCallbackFloatingActivity');
                        }
                    });
                    this.print('onCreate');
                }
            }, {
                key: "print",
                value: function print(message) {
                    Log.d(TAG, message);
                    this.printTextView.setText(this.printTextView.getText() + '\n' + message);
                }
            }, {
                key: "onStart",
                value: function onStart() {
                    _get(Object.getPrototypeOf(SampleLifeCallbackActivity.prototype), "onStart", this).call(this);
                    this.print('onStart');
                }
            }, {
                key: "onRestart",
                value: function onRestart() {
                    _get(Object.getPrototypeOf(SampleLifeCallbackActivity.prototype), "onRestart", this).call(this);
                    this.print('onRestart');
                }
            }, {
                key: "onResume",
                value: function onResume() {
                    _get(Object.getPrototypeOf(SampleLifeCallbackActivity.prototype), "onResume", this).call(this);
                    this.print('onResume\n');
                }
            }, {
                key: "onPause",
                value: function onPause() {
                    _get(Object.getPrototypeOf(SampleLifeCallbackActivity.prototype), "onPause", this).call(this);
                    this.print('onPause');
                }
            }, {
                key: "onStop",
                value: function onStop() {
                    _get(Object.getPrototypeOf(SampleLifeCallbackActivity.prototype), "onStop", this).call(this);
                    this.print('onStop');
                }
            }, {
                key: "onDestroy",
                value: function onDestroy() {
                    _get(Object.getPrototypeOf(SampleLifeCallbackActivity.prototype), "onDestroy", this).call(this);
                    this.print('onDestroy');
                }
            }]);

            return SampleLifeCallbackActivity;
        }(ActionBarActivity);

        app.SampleLifeCallbackActivity = SampleLifeCallbackActivity;

        var SampleLifeCallbackNormalActivity = function (_ActionBarActivity16) {
            _inherits(SampleLifeCallbackNormalActivity, _ActionBarActivity16);

            function SampleLifeCallbackNormalActivity() {
                _classCallCheck(this, SampleLifeCallbackNormalActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleLifeCallbackNormalActivity).apply(this, arguments));
            }

            _createClass(SampleLifeCallbackNormalActivity, [{
                key: "onCreate",
                value: function onCreate(savedInstanceState) {
                    _get(Object.getPrototypeOf(SampleLifeCallbackNormalActivity.prototype), "onCreate", this).call(this, savedInstanceState);
                    this.setTitle('Normal Activity');
                    var activity = this;
                    activity.getActionBar().setActionRight('Home', null, {
                        onClick: function onClick(view) {
                            activity.startActivity(new Intent('sample.app.MainActivity').setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP));
                        }
                    });
                    var btn = new Button(this);
                    btn.setText(android.R.string_.close);
                    btn.setOnClickListener({
                        onClick: function onClick(view) {
                            activity.finish();
                        }
                    });
                    var params = new android.widget.FrameLayout.LayoutParams(-2, -2, Gravity.CENTER);
                    this.setContentView(btn, params);
                }
            }]);

            return SampleLifeCallbackNormalActivity;
        }(ActionBarActivity);

        app.SampleLifeCallbackNormalActivity = SampleLifeCallbackNormalActivity;

        var SampleLifeCallbackFloatingActivity = function (_SampleLifeCallbackNo) {
            _inherits(SampleLifeCallbackFloatingActivity, _SampleLifeCallbackNo);

            function SampleLifeCallbackFloatingActivity() {
                _classCallCheck(this, SampleLifeCallbackFloatingActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleLifeCallbackFloatingActivity).apply(this, arguments));
            }

            _createClass(SampleLifeCallbackFloatingActivity, [{
                key: "onCreate",
                value: function onCreate(savedInstanceState) {
                    _get(Object.getPrototypeOf(SampleLifeCallbackFloatingActivity.prototype), "onCreate", this).call(this, savedInstanceState);
                    this.setTitle('Float Activity');
                    this.getActionBar().hide();
                    var density = this.getResources().getDisplayMetrics().density;
                    this.getWindow().setFloating(true);
                    this.getWindow().setLayout(200 * density, 200 * density);
                    this.getWindow().setGravity(Gravity.CENTER);
                }
            }]);

            return SampleLifeCallbackFloatingActivity;
        }(SampleLifeCallbackNormalActivity);

        app.SampleLifeCallbackFloatingActivity = SampleLifeCallbackFloatingActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;

        var SampleLinearLayoutActivity = function (_ActionBarActivity17) {
            _inherits(SampleLinearLayoutActivity, _ActionBarActivity17);

            function SampleLinearLayoutActivity() {
                _classCallCheck(this, SampleLinearLayoutActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleLinearLayoutActivity).apply(this, arguments));
            }

            _createClass(SampleLinearLayoutActivity, [{
                key: "onCreate",
                value: function onCreate() {
                    _get(Object.getPrototypeOf(SampleLinearLayoutActivity.prototype), "onCreate", this).call(this);
                    this.setTitle('LinearLayout');
                    this.setContentView(R.layout.sample_linearlayout);
                }
            }]);

            return SampleLinearLayoutActivity;
        }(ActionBarActivity);

        app.SampleLinearLayoutActivity = SampleLinearLayoutActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;
        var View = android.view.View;
        var BaseAdapter = android.widget.BaseAdapter;

        var SampleListViewActivity = function (_ActionBarActivity18) {
            _inherits(SampleListViewActivity, _ActionBarActivity18);

            function SampleListViewActivity() {
                _classCallCheck(this, SampleListViewActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleListViewActivity).apply(this, arguments));
            }

            _createClass(SampleListViewActivity, [{
                key: "onCreate",
                value: function onCreate() {
                    _get(Object.getPrototypeOf(SampleListViewActivity.prototype), "onCreate", this).call(this);
                    this.setTitle('ListView');
                    this.setContentView(R.layout.sample_listview);
                    var listView = this.findViewById('listView');
                    listView.setAdapter(new MyListAdapter());
                }
            }]);

            return SampleListViewActivity;
        }(ActionBarActivity);

        app.SampleListViewActivity = SampleListViewActivity;

        var MyListAdapter = function (_BaseAdapter2) {
            _inherits(MyListAdapter, _BaseAdapter2);

            function MyListAdapter() {
                _classCallCheck(this, MyListAdapter);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(MyListAdapter).apply(this, arguments));
            }

            _createClass(MyListAdapter, [{
                key: "getView",
                value: function getView(position, convertView, parent) {
                    if (convertView == null) {
                        convertView = View.inflate(parent.getContext(), R.layout.sample_listview_item, null);
                    }
                    convertView.findViewById('item_text').setText(this.getItem(position));
                    return convertView;
                }
            }, {
                key: "getCount",
                value: function getCount() {
                    return 1000;
                }
            }, {
                key: "getItem",
                value: function getItem(position) {
                    return 1 + position + '/' + this.getCount();
                }
            }, {
                key: "getItemId",
                value: function getItemId(position) {
                    return -1;
                }
            }]);

            return MyListAdapter;
        }(BaseAdapter);
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;

        var SamplePickerActivity = function (_ActionBarActivity19) {
            _inherits(SamplePickerActivity, _ActionBarActivity19);

            function SamplePickerActivity() {
                _classCallCheck(this, SamplePickerActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SamplePickerActivity).apply(this, arguments));
            }

            _createClass(SamplePickerActivity, [{
                key: "onCreate",
                value: function onCreate() {
                    _get(Object.getPrototypeOf(SamplePickerActivity.prototype), "onCreate", this).call(this);
                    this.setTitle('Picker');
                    this.setContentView(R.layout.sample_picker);
                }
            }]);

            return SamplePickerActivity;
        }(ActionBarActivity);

        app.SamplePickerActivity = SamplePickerActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;
        var View = android.view.View;
        var BaseAdapter = android.widget.BaseAdapter;
        var PullRefreshLoadLayout = androidui.widget.PullRefreshLoadLayout;

        var SamplePullRefreshLoadActivity = function (_ActionBarActivity20) {
            _inherits(SamplePullRefreshLoadActivity, _ActionBarActivity20);

            function SamplePullRefreshLoadActivity() {
                _classCallCheck(this, SamplePullRefreshLoadActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SamplePullRefreshLoadActivity).apply(this, arguments));
            }

            _createClass(SamplePullRefreshLoadActivity, [{
                key: "onCreate",
                value: function onCreate() {
                    _get(Object.getPrototypeOf(SamplePullRefreshLoadActivity.prototype), "onCreate", this).call(this);
                    this.setTitle('PullRefreshLoad');
                    this.setContentView(R.layout.sample_pullrefreshload);
                    var listView = this.findViewById('listView');
                    var adapter = new MyListAdapter();
                    listView.setAdapter(adapter);
                    var prll = this.findViewById('prll');
                    prll.setRefreshLoadListener({
                        onRefresh: function onRefresh(prll) {
                            setTimeout(function () {
                                adapter.data = ['Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item'];
                                adapter.notifyDataSetChanged();
                                prll.setHeaderState(PullRefreshLoadLayout.State_Header_Normal);
                            }, 1000);
                        },
                        onLoadMore: function onLoadMore(prll) {
                            setTimeout(function () {
                                adapter.data.push('Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item');
                                adapter.notifyDataSetChanged();
                                prll.setFooterState(PullRefreshLoadLayout.State_Footer_Normal);
                            }, 1000);
                        }
                    });
                }
            }]);

            return SamplePullRefreshLoadActivity;
        }(ActionBarActivity);

        app.SamplePullRefreshLoadActivity = SamplePullRefreshLoadActivity;

        var MyListAdapter = function (_BaseAdapter3) {
            _inherits(MyListAdapter, _BaseAdapter3);

            function MyListAdapter() {
                var _Object$getPrototypeO2;

                _classCallCheck(this, MyListAdapter);

                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                var _this26 = _possibleConstructorReturn(this, (_Object$getPrototypeO2 = Object.getPrototypeOf(MyListAdapter)).call.apply(_Object$getPrototypeO2, [this].concat(args)));

                _this26.data = [];
                return _this26;
            }

            _createClass(MyListAdapter, [{
                key: "getView",
                value: function getView(position, convertView, parent) {
                    if (convertView == null) {
                        convertView = View.inflate(parent.getContext(), R.layout.sample_pullrefreshload_item, null);
                    }
                    convertView.findViewById('item_text').setText(this.getItem(position));
                    return convertView;
                }
            }, {
                key: "getCount",
                value: function getCount() {
                    return this.data.length;
                }
            }, {
                key: "getItem",
                value: function getItem(position) {
                    return 1 + position + '. ' + this.data[position];
                }
            }, {
                key: "getItemId",
                value: function getItemId(position) {
                    return -1;
                }
            }]);

            return MyListAdapter;
        }(BaseAdapter);
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;

        var SampleRelativeLayoutActivity = function (_ActionBarActivity21) {
            _inherits(SampleRelativeLayoutActivity, _ActionBarActivity21);

            function SampleRelativeLayoutActivity() {
                _classCallCheck(this, SampleRelativeLayoutActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleRelativeLayoutActivity).apply(this, arguments));
            }

            _createClass(SampleRelativeLayoutActivity, [{
                key: "onCreate",
                value: function onCreate() {
                    _get(Object.getPrototypeOf(SampleRelativeLayoutActivity.prototype), "onCreate", this).call(this);
                    this.setTitle('RelatevieLayout');
                    this.setContentView(R.layout.sample_relativelayout);
                }
            }]);

            return SampleRelativeLayoutActivity;
        }(ActionBarActivity);

        app.SampleRelativeLayoutActivity = SampleRelativeLayoutActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;

        var SampleTextViewActivity = function (_ActionBarActivity22) {
            _inherits(SampleTextViewActivity, _ActionBarActivity22);

            function SampleTextViewActivity() {
                _classCallCheck(this, SampleTextViewActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleTextViewActivity).apply(this, arguments));
            }

            _createClass(SampleTextViewActivity, [{
                key: "onCreate",
                value: function onCreate() {
                    _get(Object.getPrototypeOf(SampleTextViewActivity.prototype), "onCreate", this).call(this);
                    this.setTitle('TextView');
                    this.setContentView(R.layout.sample_textview);
                }
            }]);

            return SampleTextViewActivity;
        }(ActionBarActivity);

        app.SampleTextViewActivity = SampleTextViewActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;
        var View = android.view.View;
        var Color = android.graphics.Color;

        var SampleViewPagerActivity = function (_ActionBarActivity23) {
            _inherits(SampleViewPagerActivity, _ActionBarActivity23);

            function SampleViewPagerActivity() {
                _classCallCheck(this, SampleViewPagerActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleViewPagerActivity).apply(this, arguments));
            }

            _createClass(SampleViewPagerActivity, [{
                key: "onCreate",
                value: function onCreate() {
                    _get(Object.getPrototypeOf(SampleViewPagerActivity.prototype), "onCreate", this).call(this);
                    this.setTitle('ViewPager');
                    this.setContentView(R.layout.sample_viewpager);
                    var viewPager = this.findViewById('viewPager');
                    viewPager.setAdapter(new MyPageAdapter());
                }
            }]);

            return SampleViewPagerActivity;
        }(ActionBarActivity);

        app.SampleViewPagerActivity = SampleViewPagerActivity;

        var MyPageAdapter = function (_com$jakewharton$salv) {
            _inherits(MyPageAdapter, _com$jakewharton$salv);

            function MyPageAdapter() {
                _classCallCheck(this, MyPageAdapter);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(MyPageAdapter).apply(this, arguments));
            }

            _createClass(MyPageAdapter, [{
                key: "getCount",
                value: function getCount() {
                    return 100;
                }
            }, {
                key: "getView",
                value: function getView(position, convertView, parent) {
                    if (convertView == null) {
                        convertView = View.inflate(parent.getContext(), R.layout.sample_viewpager_page, null);
                    }
                    var page_bg = convertView.findViewById('page_bg');
                    var page_text = convertView.findViewById('page_text');
                    page_bg.setBackgroundColor(Color.rgb(position * 20 % 200 + 50, position * 20 % 200 + 50, position * 20 % 200 + 50));
                    page_text.setText(1 + position + '/' + this.getCount());
                    return convertView;
                }
            }]);

            return MyPageAdapter;
        }(com.jakewharton.salvage.RecyclingPagerAdapter);
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;

        var SampleViewPagerGalleryActivity = function (_ActionBarActivity24) {
            _inherits(SampleViewPagerGalleryActivity, _ActionBarActivity24);

            function SampleViewPagerGalleryActivity() {
                _classCallCheck(this, SampleViewPagerGalleryActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleViewPagerGalleryActivity).apply(this, arguments));
            }

            _createClass(SampleViewPagerGalleryActivity, [{
                key: "onCreate",
                value: function onCreate() {
                    _get(Object.getPrototypeOf(SampleViewPagerGalleryActivity.prototype), "onCreate", this).call(this);
                    this.setTitle('ImageGallery&Gesture');
                    this.setContentView(R.layout.sample_viewpager_gallery);
                }
            }]);

            return SampleViewPagerGalleryActivity;
        }(ActionBarActivity);

        app.SampleViewPagerGalleryActivity = SampleViewPagerGalleryActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;
        var WebView = android.webkit.WebView;
        var WebViewClient = android.webkit.WebViewClient;

        var SampleWebViewActivity = function (_ActionBarActivity25) {
            _inherits(SampleWebViewActivity, _ActionBarActivity25);

            function SampleWebViewActivity() {
                _classCallCheck(this, SampleWebViewActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleWebViewActivity).apply(this, arguments));
            }

            _createClass(SampleWebViewActivity, [{
                key: "onCreate",
                value: function onCreate(savedInstanceState) {
                    _get(Object.getPrototypeOf(SampleWebViewActivity.prototype), "onCreate", this).call(this, savedInstanceState);
                    this.webView = new WebView(this);
                    this.setContentView(this.webView);
                    this.webView.setWebViewClient(new MyWebViewClient(this));
                    this.webView.loadUrl('assets/webviewpages/page1.html');
                }
            }, {
                key: "onBackPressed",
                value: function onBackPressed() {
                    if (this.webView.canGoBack()) {
                        this.webView.goBack();
                        return;
                    }
                    _get(Object.getPrototypeOf(SampleWebViewActivity.prototype), "onBackPressed", this).call(this);
                }
            }]);

            return SampleWebViewActivity;
        }(ActionBarActivity);

        app.SampleWebViewActivity = SampleWebViewActivity;

        var MyWebViewClient = function (_WebViewClient) {
            _inherits(MyWebViewClient, _WebViewClient);

            function MyWebViewClient(activity) {
                _classCallCheck(this, MyWebViewClient);

                var _this33 = _possibleConstructorReturn(this, Object.getPrototypeOf(MyWebViewClient).call(this));

                _this33.activity = activity;
                return _this33;
            }

            _createClass(MyWebViewClient, [{
                key: "onReceivedTitle",
                value: function onReceivedTitle(view, title) {
                    _get(Object.getPrototypeOf(MyWebViewClient.prototype), "onReceivedTitle", this).call(this, view, title);
                    this.activity.setTitle(title);
                }
            }]);

            return MyWebViewClient;
        }(WebViewClient);
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
//# sourceMappingURL=app.js.map

//# sourceMappingURL=app.es5.js.map
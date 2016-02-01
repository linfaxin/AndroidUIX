"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sample;
(function (sample) {
    var app;
    (function (app) {
        var R;
        (function (R) {
            R.id = {};
        })(R = app.R || (app.R = {}));
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var R;
        (function (R) {
            var NetImage = androidui.image.NetImage;
            var data = {
                "icon_alert": [null, null, null, "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAjVBMVEUAAAAzR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR198qNTWAAAALnRSTlMAsFf6A8T2D3vpgfBPMQbbnCMKzry2bY6JdWYsFeSUSuDW0cmhXEUnHjwaqEE2puKK5AAAA39JREFUeNrt2uey2jAQBeADcjcuGNNNb5eSff/Hy49MckMGw0oreyYz/p7goEXWam10Op2OkSI5RXd3lIWeile7Q5nPBxcHLfk6Hbf0ghrNNgWadl1n9IZygy805xJt6TN34aMRG5eYvHwI25z+iDSo+xJWDXakq2dxFYZjMuAFKaxIA4/MZGdYMNyTubUj3/ghSZQVZBaKZLIlBJw1icUbGPNLsmEOQ5eM7DimMPGIyZaDb/L7Y7KndKDLz8imNTQ5Jdm1gJ41WaYe0LEg68Ih+B6K7Nv54BqGxBLPBl/Fj8mYeMYOeNI9sYxv+KXPDByBJyCWGf6oMuJQS14BPOLYp/h2JRYXHMySJvjbjFhO+GxALDs8WRJL6OMTZ0csRzxxPFv/wz7xTPDMJZbYxwcj4unjWY94Ary3oYYDhAXecpsOQBO8c6HGA+zxTtR8AErwxraFAFPUu1ILAUIHtdZtBKAzamWtBJihzhe1EmCEOqd2ApCPGseWAgxqN6EsgHgjFtRSgBKvJW0FWMn+g/IAVOClSBpAehzcWwvQx0uuOICwJxjJA8j6skwYQHwahLIA8nmJ11qAHC+p1gIc8VIsmfmUFlZgJSljSPLTaEcaDuxehn9DPJAGr+JOtfjT45J09J4WICYLT8KctJzMx5obvDQnLSpw8MvFJT1DxmyEYzS4AemPyCM9ymHcTJlWe0XadnjNUdSOnmw6IhegxozacRXNZ+S8FDUKRW0YyyZEcnPGmJotG2eka4laX5pr+fAB+GeXDM5ReQ3CP4eBM/cEJ5HpqRre8O2HIi5V4Q3fM5z0RLLH4LfcsKtyRvzgbw0V8dwMi3fAB3fDK34iG898WxpWMlWCSbHBDWNq2NT3bb00K/GPSvTaTH9HxQ6ePey9OCy2JlOWwKhwgubUfV6CW8zZOj54cv2+asy7DjClLqeeffzhRJY/56m2xNC7/d44LnMowJd4xBDni6T4scg9YnBT6BiQZdsKegKyykug6042DaCtGJE9AQxULtkSwUiakxVeH6YmiuS2CcydY5JyK0hcMvnHjDL+WHgPFHNmikytNrBh6ZIRNfVhySkkfe4S9vhRTHr2fdjlByHxHQawr5jsiUX1zmhIMg3pk8OkQoOc82xEtbzxfInm+YNpuaJ/qF0vuKZoT5H0J8FsnR/zaTSfbIYOOp1Op9P5X/0Eg/+iUtRdaggAAAAASUVORK5CYII="]
            };
            var imageCache = {
                icon_alert: null
            };
            function findRatioImage(array) {
                if (array[window.devicePixelRatio]) return new NetImage(array[window.devicePixelRatio], window.devicePixelRatio);
                for (var i = array.length; i >= 0; i--) {
                    if (array[i]) {
                        return new NetImage(array[i], i);
                    }
                }
                throw Error('Not find radio image. May something error in build.');
            }

            var image_base64 = function () {
                function image_base64() {
                    _classCallCheck(this, image_base64);
                }

                _createClass(image_base64, null, [{
                    key: "icon_alert",
                    get: function get() {
                        return imageCache.icon_alert || (imageCache.icon_alert = findRatioImage(data.icon_alert));
                    }
                }]);

                return image_base64;
            }();

            R.image_base64 = image_base64;
        })(R = app.R || (app.R = {}));
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var R;
        (function (R) {
            var NetDrawable = androidui.image.NetDrawable;

            var image = function () {
                function image() {
                    _classCallCheck(this, image);
                }

                _createClass(image, null, [{
                    key: "icon_alert",
                    get: function get() {
                        return new NetDrawable(R.image_base64.icon_alert);
                    }
                }]);

                return image;
            }();

            R.image = image;
            android.content.res.Resources.buildDrawableFinder = function (refString) {
                return image[refString];
            };
        })(R = app.R || (app.R = {}));
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var R;
        (function (R) {
            var _layout_data = {
                "sample_animation": "<scrollview>\n    <linearlayout android:padding=\"0 6dp\" gravity=\"center\" android:orientation=\"vertical\">\n        <textview gravity=\"center\">Rotate:</textview>\n        <imageview id=\"rotate_repeat\" android:src=\"assets/images/logo_android_1@2x.png\" android:layout_width=\"56dp\" android:layout_height=\"56dp\" android:layout_margin=\"20dp 12dp\"></imageview>\n        <textview gravity=\"center\">Translate:</textview>\n        <imageview id=\"translate_repeat\" android:src=\"assets/images/logo_android_1@2x.png\" android:layout_width=\"56dp\" android:layout_height=\"56dp\" android:layout_margin=\"12dp\"></imageview>\n        <textview gravity=\"center\">Scale:</textview>\n        <imageview id=\"scale_repeat\" android:src=\"assets/images/logo_android_1@2x.png\" android:layout_width=\"56dp\" android:layout_height=\"56dp\" android:layout_margin=\"12dp\"></imageview>\n        <textview gravity=\"center\">Alpha:</textview>\n        <imageview id=\"alpha_repeat\" android:src=\"assets/images/logo_android_1@2x.png\" android:layout_width=\"56dp\" android:layout_height=\"56dp\" android:layout_margin=\"12dp\"></imageview>\n        <textview gravity=\"center\">Animation Set:</textview>\n        <imageview id=\"anim_set\" android:src=\"assets/images/logo_android_1@2x.png\" android:layout_width=\"56dp\" android:layout_height=\"56dp\" android:layout_margin=\"12dp\"></imageview>\n    </linearlayout>\n</scrollview>",
                "sample_base_widget": "<scrollview>\n    <linearlayout android:orientation=\"vertical\" android:padding=\"12dp\" android:gravity=\"center\">\n        <textview android:layout_width=\"wrap_content\">\n            TextView\n        </textview>\n        <button android:layout_width=\"wrap_content\">\n            Button\n        </button>\n        <imageview android:src=\"assets/images/logo_google_3.png\">\n        </imageview>\n        <checkbox android:layout_width=\"wrap_content\" android:layout_marginbottom=\"12dp\">\n            CheckBox\n        </checkbox>\n        <radiogroup android:gravity=\"center\" android:orientation=\"HORIZONTAL\" android:layout_marginbottom=\"12dp\">\n            <radiobutton android:layout_width=\"wrap_content\">\n                Radio1\n            </radiobutton>\n            <radiobutton android:layout_width=\"wrap_content\">\n                Radio2\n            </radiobutton>\n            <radiobutton android:layout_width=\"wrap_content\">\n                Radio3\n            </radiobutton>\n        </radiogroup>\n        <button id=\"btn_open_dialog\" android:layout_width=\"wrap_content\">\n            OpenDialog\n        </button>\n        <spinner android:layout_width=\"wrap_content\" android:entries=\"[&quot;Item1&quot;, &quot;Item2&quot;, &quot;Item3&quot;, &quot;Item4&quot;, &quot;Item5&quot;, &quot;Item6&quot;, &quot;Item7&quot;]\">\n        </spinner>\n        <button id=\"btn_show_popup\" android:layout_width=\"wrap_content\">\n            PopupWindow\n        </button>\n\n        <progressbar android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\" android:layout_marginbottom=\"12dp\"></progressbar>\n        <progressbar android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:layout_marginbottom=\"12dp\" style=\"@android:attr/progressBarStyleHorizontal\" android:max=\"100\" android:progress=\"50\" android:secondaryprogress=\"70\"></progressbar>\n\n        <seekbar android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:layout_marginbottom=\"12dp\"></seekbar>\n\n        <ratingbar android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\" android:layout_marginbottom=\"12dp\"></ratingbar>\n\n    </linearlayout>\n</scrollview>",
                "sample_button": "<scrollview>\n    <linearlayout android:orientation=\"vertical\" android:gravity=\"center\">\n        <button android:layout_width=\"wrap_content\">\n            Button\n        </button>\n        <button android:layout_width=\"wrap_content\" android:enabled=\"false\">\n            DisableButton\n        </button>\n        <button id=\"btn_click\">\n            ButtonClick\n        </button>\n        <button android:layout_width=\"wrap_content\" onclick=\"this.setText('Click:'+new Date().getTime());\">\n            ButtonClick2\n        </button>\n        <button id=\"btn_long_click\">\n            ButtonLongClick\n        </button>\n        <button android:style=\"@style/btn_custom1\">\n            ButtonStyled\n        </button>\n        <button android:style=\"@style/btn_custom1\" android:enabled=\"false\">\n            ButtonStyledDisable\n        </button>\n        <button android:padding=\"8dp\" android:layout_margin=\"6dp\" android:textcolor=\"@color/white\" android:background=\"#f00\" android:state_pressed=\"@style/btn_custom1/pressed\">\n            ButtonStyled2\n        </button>\n        <button android:padding=\"8dp\" android:layout_margin=\"6dp\" android:textcolor=\"@color/white\" android:background=\"#f00\" android:state_pressed=\"background:#f66;\">\n            ButtonStyled3\n        </button>\n    </linearlayout>\n</scrollview>",
                "sample_contacte": "<linearlayout android:orientation=\"vertical\">\n    <button id=\"open_activity_intent\">\n        startActivity with intent\n    </button>\n    <button id=\"open_activity_result\">\n        startActivity with result\n    </button>\n    <scrollview>\n        <linearlayout android:orientation=\"vertical\">\n            <textview id=\"console_tv\" android:gravity=\"center\">\n            </textview>\n        </linearlayout>\n    </scrollview>\n</linearlayout>",
                "sample_drawerlayout": "<android.support.v4.widget.drawerlayout>\n    <linearlayout android:orientation=\"vertical\" android:gravity=\"center\" android:layout_height=\"match_parent\" android:layout_width=\"match_parent\">\n        <button onclick=\"this.getParent().getParent().openDrawer(android.view.Gravity.LEFT);\" android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\">Open left drawer</button>\n        <button onclick=\"this.getParent().getParent().openDrawer(android.view.Gravity.RIGHT);\" android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\">Open right drawer</button>\n    </linearlayout>\n    <linearlayout android:layout_gravity=\"left\" android:background=\"white\" android:clickable=\"true\" android:layout_height=\"match_parent\" android:layout_width=\"220dp\">\n        <textview android:layout_height=\"match_parent\" android:layout_width=\"match_parent\" android:gravity=\"center\">Left drawer</textview>\n    </linearlayout>\n    <linearlayout android:layout_gravity=\"right\" android:background=\"white\" android:clickable=\"true\" android:layout_height=\"match_parent\" android:layout_width=\"220dp\">\n        <textview android:layout_height=\"match_parent\" android:layout_width=\"match_parent\" android:gravity=\"center\">Right drawer</textview>\n    </linearlayout>\n</android.support.v4.widget.drawerlayout>",
                "sample_edittext": "<scrollview>\n    <linearlayout android:orientation=\"vertical\">\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:hint=\"Place Input\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:hint=\"Input Type: textUri\" android:inputtype=\"textUri\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:hint=\"Input Type: textEmailAddress\" android:inputtype=\"textEmailAddress\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:hint=\"Input Type: textPassword\" android:inputtype=\"textPassword\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:hint=\"Input Type: textVisiblePassword\" android:inputtype=\"textVisiblePassword\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:hint=\"Input Type: number\" android:inputtype=\"number\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:hint=\"Input Type: numberPassword\" android:inputtype=\"numberPassword\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:hint=\"Input Type: phone\" android:inputtype=\"phone\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:maxlines=\"2\" android:padding=\"10dp\" android:text=\"maxLines=2\nmaxLines=2\nmaxLines=2\nmaxLines=2\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:minlines=\"2\" android:layout_width=\"match_parent\" android:gravity=\"center\" android:text=\"minLines=2\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:layout_height=\"100dp\" android:layout_width=\"match_parent\" android:text=\"static height\" android:style=\"@style/editStyle\"></edittext>\n        <view android:style=\"@style/line_spit\"></view>\n        <edittext android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\" android:gravity=\"center\" android:drawablepadding=\"12dp\" android:drawableleft=\"url(assets/images/logo_android_1@2x.png)\" android:drawabletop=\"url(assets/images/logo_android_1@2x.png)\" android:drawableright=\"url(assets/images/logo_android_1@2x.png)\" android:drawablebottom=\"url(assets/images/logo_android_1@2x.png)\" android:text=\"Image around EditText\" android:style=\"@style/editStyle\"></edittext>\n    </linearlayout>\n</scrollview>",
                "sample_expand_listview_item": "<framelayout id=\"item_child_layout\" android:layout_width=\"match_parent\" android:padding=\"12dp\">\n    <textview id=\"item_child_text\" android:padding=\"12dp\" android:layout_width=\"wrap_content\" android:layout_height=\"wrap_content\" android:background=\"#55000000\" android:textcolor=\"white\" android:layout_gravity=\"center\">\n    </textview>\n</framelayout>",
                "sample_framelayout": "<framelayout>\n\n    <textview android:text=\"Text\" android:layout_gravity=\"left|top\" android:style=\"@style/textStyle\"></textview>\n    <textview android:text=\"Text\" android:layout_gravity=\"right|top\" android:style=\"@style/textStyle\"></textview>\n    <textview android:text=\"Text\" android:layout_gravity=\"bottom|right\" android:style=\"@style/textStyle\"></textview>\n    <textview android:text=\"Text\" android:layout_gravity=\"bottom|left\" android:style=\"@style/textStyle\"></textview>\n    <textview android:text=\"Text\" android:layout_gravity=\"center\" android:style=\"@style/textStyle\"></textview>\n    <textview android:text=\"Text\" android:layout_gravity=\"left|center_vertical\" android:style=\"@style/textStyle\"></textview>\n    <textview android:text=\"Text\" android:layout_gravity=\"right|center_vertical\" android:style=\"@style/textStyle\"></textview>\n    <textview android:text=\"Text\" android:layout_gravity=\"top|center_horizontal\" android:style=\"@style/textStyle\"></textview>\n    <textview android:text=\"Text\" android:layout_gravity=\"bottom|center_horizontal\" android:style=\"@style/textStyle\"></textview>\n    <textview android:text=\"Text MarginBottom50\" android:layout_marginbottom=\"50dp\" android:layout_gravity=\"center\" android:style=\"@style/textStyle\"></textview>\n</framelayout>",
                "sample_gridview": "<framelayout>\n    <gridview id=\"gridView\" android:numcolumns=\"2\">\n    </gridview>\n</framelayout>",
                "sample_gridview_item": "<framelayout id=\"item_layout\" android:layout_width=\"match_parent\" android:padding=\"32dp\">\n    <textview id=\"item_text\" android:padding=\"16dp\" android:layout_width=\"wrap_content\" android:layout_height=\"wrap_content\" android:background=\"#55000000\" android:textcolor=\"white\" android:layout_gravity=\"center\">\n    </textview>\n</framelayout>",
                "sample_htmlview": "<scrollview android:fillviewport=\"true\">\n    <linearlayout android:orientation=\"vertical\">\n        <htmlview>\n            <p style=\"font-size: 24px;text-align: center\">HtmlView</p>\n        </htmlview>\n        <htmlview style=\"padding:0 20px;box-sizing: border-box;line-height: 20px;\">\n            <p>HtmlView can wrap any <span style=\"color: red;font-weight: bold;\">HTML tag</span>, render with DOM, but too many HtmlView will reduce FPS.</p>\n            <p>HtmlView above on all Android Views</p>\n        </htmlview>\n        <textview android:gravity=\"center\">TextView</textview>\n        <htmlview style=\"overflow: visible;text-align: center;\">\n            <input style=\"font-size: 16px;text-align: center;box-shadow: 0 0 1px black;margin: 12px 0; padding: 6px;\" placeholder=\"Place Input\">\n        </htmlview>\n    </linearlayout>\n</scrollview>",
                "sample_imageview": "<scrollview>\n    <linearlayout android:padding=\"0 6dp\" android:orientation=\"vertical\">\n        <textview>Default(FitCenter):</textview>\n        <linearlayout>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:style=\"@style/imageStyle\"></imageview>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:layout_marginleft=\"4dp\" android:layout_height=\"200dp\" android:style=\"@style/imageStyle\"></imageview>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:layout_width=\"match_parent\" android:layout_marginleft=\"4dp\" android:style=\"@style/imageStyle\"></imageview>\n        </linearlayout>\n        <textview>FitStart:</textview>\n        <linearlayout>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaletype=\"fitStart\" android:layout_height=\"200dp\" android:style=\"@style/imageStyle\"></imageview>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaletype=\"fitStart\" android:layout_width=\"match_parent\" android:layout_marginleft=\"4dp\" android:style=\"@style/imageStyle\"></imageview>\n        </linearlayout>\n        <textview>FitEnd:</textview>\n        <linearlayout>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaletype=\"fitEnd\" android:layout_height=\"200dp\" android:style=\"@style/imageStyle\"></imageview>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaletype=\"fitEnd\" android:layout_width=\"match_parent\" android:layout_marginleft=\"4dp\" android:style=\"@style/imageStyle\"></imageview>\n        </linearlayout>\n        <textview>FitXy:</textview>\n        <linearlayout>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaletype=\"fitXy\" android:layout_height=\"200dp\" android:style=\"@style/imageStyle\"></imageview>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaletype=\"fitXy\" android:layout_width=\"match_parent\" android:layout_marginleft=\"4dp\" android:style=\"@style/imageStyle\"></imageview>\n        </linearlayout>\n        <textview>Center:</textview>\n        <linearlayout>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaletype=\"center\" android:layout_height=\"80dp\" android:layout_width=\"80dp\" android:style=\"@style/imageStyle\"></imageview>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaletype=\"center\" android:layout_height=\"180dp\" android:layout_width=\"180dp\" android:layout_marginleft=\"4dp\" android:style=\"@style/imageStyle\"></imageview>\n        </linearlayout>\n        <textview>centerCrop:</textview>\n        <linearlayout>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaletype=\"centerCrop\" android:layout_height=\"80dp\" android:layout_width=\"80dp\" android:style=\"@style/imageStyle\"></imageview>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaletype=\"centerCrop\" android:layout_marginleft=\"4dp\" android:layout_height=\"100dp\" android:layout_width=\"60dp\" android:style=\"@style/imageStyle\"></imageview>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaletype=\"centerCrop\" android:layout_height=\"60dp\" android:layout_width=\"100dp\" android:layout_marginleft=\"4dp\" android:style=\"@style/imageStyle\"></imageview>\n        </linearlayout>\n        <textview>centerInside:</textview>\n        <linearlayout>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaletype=\"centerInside\" android:layout_height=\"80dp\" android:layout_width=\"80dp\" android:style=\"@style/imageStyle\"></imageview>\n            <imageview android:src=\"assets/images/logo_android_1@2x.png\" android:scaletype=\"centerInside\" android:layout_height=\"180dp\" android:layout_width=\"180dp\" android:layout_marginleft=\"4dp\" android:style=\"@style/imageStyle\"></imageview>\n        </linearlayout>\n\n        <textview>Background:</textview>\n        <framelayout android:style=\"@style/imageStyle\" android:background=\"url(assets/images/logo_android_1@2x.png)\"></framelayout>\n\n    </linearlayout>\n</scrollview>",
                "sample_life_callback": "<linearlayout android:orientation=\"vertical\">\n    <button id=\"open_activity_normal\">\n        Open Normal Activity\n    </button>\n    <button id=\"open_activity_float\">\n        Open Floating Activity\n    </button>\n    <scrollview>\n        <linearlayout android:orientation=\"vertical\">\n            <textview id=\"console_tv\" android:gravity=\"center\">\n            </textview>\n        </linearlayout>\n    </scrollview>\n</linearlayout>",
                "sample_linearlayout": "<linearlayout android:gravity=\"center_vertical\" android:orientation=\"vertical\">\n\n    <linearlayout android:orientation=\"vertical\">\n        <textview android:text=\"Vertical\" android:style=\"@style/textStyle\"></textview>\n        <textview android:text=\"Vertical\" android:style=\"@style/textStyle\"></textview>\n\n    </linearlayout>\n    <linearlayout android:layout_margintop=\"12dp\" android:gravity=\"center\" android:orientation=\"vertical\">\n        <textview android:text=\"Vertical-Center\" android:style=\"@style/textStyle\"></textview>\n        <textview android:text=\"Vertical-Center\" android:style=\"@style/textStyle\"></textview>\n\n    </linearlayout>\n\n    <linearlayout android:layout_margintop=\"12dp\" android:orientation=\"horizontal\">\n        <textview android:text=\"horizontal\" android:style=\"@style/textStyle\"></textview>\n        <textview android:text=\"linear\" android:style=\"@style/textStyle\"></textview>\n        <textview android:text=\"layout\" android:style=\"@style/textStyle\"></textview>\n\n    </linearlayout>\n    <linearlayout android:layout_margintop=\"12dp\" android:gravity=\"center\" android:orientation=\"horizontal\">\n        <textview android:text=\"horizontal\" android:style=\"@style/textStyle\"></textview>\n        <textview android:text=\"linear\" android:style=\"@style/textStyle\"></textview>\n        <textview android:text=\"layout\" android:style=\"@style/textStyle\"></textview>\n        <textview android:text=\"-center\" android:style=\"@style/textStyle\"></textview>\n\n    </linearlayout>\n    <linearlayout android:layout_margintop=\"12dp\" android:gravity=\"right\" android:orientation=\"horizontal\">\n        <textview android:text=\"horizontal\" android:style=\"@style/textStyle\"></textview>\n        <textview android:text=\"linear\" android:style=\"@style/textStyle\"></textview>\n        <textview android:text=\"layout\" android:style=\"@style/textStyle\"></textview>\n        <textview android:text=\"-right\" android:style=\"@style/textStyle\"></textview>\n\n    </linearlayout>\n\n    <textview android:layout_margintop=\"12dp\" android:gravity=\"center\" android:text=\"more usage see Android's document\"></textview>\n\n</linearlayout>",
                "sample_listview": "<framelayout>\n    <listview id=\"listView\">\n    </listview>\n</framelayout>",
                "sample_listview_item": "<framelayout id=\"item_layout\" android:layout_width=\"match_parent\" android:padding=\"32dp\">\n    <textview id=\"item_text\" android:padding=\"16dp\" android:layout_width=\"wrap_content\" android:layout_height=\"wrap_content\" android:background=\"#55000000\" android:textcolor=\"white\" android:layout_gravity=\"center\">\n    </textview>\n</framelayout>",
                "sample_picker": "<linearlayout android:orientation=\"vertical\" android:gravity=\"center\">\n    <numberpicker id=\"picker\" android:layout_height=\"280dp\" android:itemcount=\"5\" android:minvalue=\"1\" android:maxvalue=\"9\">\n        <androidui.widget.htmldatapickeradapter>\n            <item>1</item>\n            <item>2</item>\n            <item>3</item>\n            <item>4</item>\n            <item>5</item>\n            <item>6</item>\n            <item>7</item>\n            <item>8</item>\n            <item>9</item>\n        </androidui.widget.htmldatapickeradapter>\n    </numberpicker>\n</linearlayout>",
                "sample_pullrefreshload": "<androidui.widget.pullrefreshloadlayout id=\"prll\" android:layout_width=\"match_parent\" android:layout_height=\"match_parent\">\n    <listview id=\"listView\">\n    </listview>\n</androidui.widget.pullrefreshloadlayout>",
                "sample_pullrefreshload_item": "<framelayout id=\"item_layout\" android:layout_width=\"match_parent\" android:padding=\"32dp\">\n    <textview id=\"item_text\" android:padding=\"16dp\" android:layout_width=\"wrap_content\" android:layout_height=\"wrap_content\" android:background=\"#55000000\" android:textcolor=\"white\" android:layout_gravity=\"center\">\n    </textview>\n</framelayout>",
                "sample_relativelayout": "<relativelayout>\n    <textview id=\"text1\" android:style=\"@style/textStyle\" android:text=\"Left&amp;Top\"></textview>\n    <textview id=\"text2\" android:style=\"@style/textStyle\" android:text=\"Right&amp;Top\" android:layout_alignparentright=\"true\"></textview>\n    <textview id=\"text3\" android:style=\"@style/textStyle\" android:text=\"Left&amp;Bottom\" android:layout_alignparentbottom=\"true\"></textview>\n    <textview id=\"text4\" android:style=\"@style/textStyle\" android:text=\"Right&amp;Bottom\" android:layout_alignparentright=\"true\" android:layout_alignparentbottom=\"true\"></textview>\n    <textview id=\"text5\" android:style=\"@style/textStyle\" android:text=\"VerticalCenter\" android:layout_centervertical=\"true\"></textview>\n    <textview id=\"text6\" android:style=\"@style/textStyle\" android:text=\"HorizontalCenter\" android:layout_centerhorizontal=\"true\"></textview>\n    <textview id=\"text7\" android:style=\"@style/textStyle\" android:text=\"Center\" android:layout_centerinparent=\"true\"></textview>\n\n    <textview android:style=\"@style/textStyle\" android:text=\"below\" android:layout_margintop=\"4dp\" android:layout_below=\"text1\"></textview>\n\n    <textview android:style=\"@style/textStyle\" android:text=\"toRightOf\" android:layout_marginleft=\"4dp\" android:layout_torightof=\"text3\" android:layout_alignparentbottom=\"true\"></textview>\n    <textview android:style=\"@style/textStyle\" android:text=\"above\" android:layout_marginbottom=\"4dp\" android:layout_above=\"text3\"></textview>\n    <textview android:style=\"@style/textStyle\" android:text=\"toLeftOf\" android:layout_marginright=\"4dp\" android:layout_toleftof=\"text4\" android:layout_alignparentbottom=\"true\"></textview>\n\n    <textview id=\"alignLeft\" android:style=\"@style/textStyle\" android:text=\"  alignLeft  \" android:layout_margintop=\"4dp\" android:layout_alignleft=\"text6\" android:layout_below=\"text2\"></textview>\n    <textview android:style=\"@style/textStyle\" android:text=\"  alignRight  \" android:layout_margintop=\"4dp\" android:layout_alignright=\"text6\" android:layout_below=\"alignLeft\"></textview>\n    <textview id=\"alignTop\" android:style=\"@style/textStyle\" android:text=\"alignTop\" android:maxwidth=\"46dp\" android:layout_marginleft=\"4dp\" android:layout_aligntop=\"text7\" android:layout_torightof=\"text7\"></textview>\n    <textview android:style=\"@style/textStyle\" android:text=\"alignBottom\" android:maxwidth=\"52dp\" android:layout_marginleft=\"4dp\" android:layout_alignbottom=\"text7\" android:layout_torightof=\"alignTop\"></textview>\n    <textview android:style=\"@style/textStyle\" android:text=\"above&amp;toLeftOf\" android:layout_above=\"text7\" android:layout_toleftof=\"text7\"></textview>\n    <textview android:style=\"@style/textStyle\" android:text=\"toRightOf &amp; toLeftOf &amp; below\" android:layout_below=\"text7\" android:layout_toleftof=\"text7\" android:layout_torightof=\"text5\"></textview>\n</relativelayout>",
                "sample_textview": "<scrollview>\n    <linearlayout android:orientation=\"vertical\">\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:text=\"Text\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:padding=\"10dp\" android:text=\"Text Padding10\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:padding=\"10dp\" android:text=\"Line1\nLine2\nLine3\nLine4\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:maxlines=\"2\" android:ellipsize=\"END\" android:padding=\"10dp\" android:text=\"maxLines=2\nmaxLines=2\nmaxLines=2\nmaxLines=2\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:layout_width=\"match_parent\" android:padding=\"10dp\" android:gravity=\"center\" android:text=\"Text Center\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:minlines=\"2\" android:layout_width=\"match_parent\" android:padding=\"10dp\" android:gravity=\"center\" android:text=\"Text minLines=2\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:layout_width=\"match_parent\" android:padding=\"10dp\" android:gravity=\"right\" android:text=\"Text Right\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:layout_height=\"100dp\" android:layout_width=\"match_parent\" android:padding=\"10dp\" android:gravity=\"center\" android:text=\"Text Center\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:layout_height=\"100dp\" android:layout_width=\"match_parent\" android:padding=\"10dp\" android:gravity=\"bottom\" android:text=\"Text Bottom\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:layout_height=\"100dp\" android:layout_width=\"match_parent\" android:padding=\"10dp\" android:gravity=\"center_vertical\" android:text=\"Text center vertical\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:layout_height=\"100dp\" android:layout_width=\"match_parent\" android:padding=\"10dp\" android:gravity=\"center_horizontal\" android:text=\"Text center horizontal\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:layout_height=\"100dp\" android:layout_width=\"match_parent\" android:padding=\"10dp\" android:gravity=\"right|bottom\" android:text=\"Text right&amp;bottom\" android:style=\"@style/textStyle\"></textview>\n        <view android:style=\"@style/line_spit\"></view>\n        <textview android:layout_height=\"wrap_content\" android:layout_width=\"wrap_content\" android:padding=\"10dp\" android:gravity=\"center\" android:drawablepadding=\"12dp\" android:drawableleft=\"url(assets/images/logo_android_1@2x.png)\" android:drawabletop=\"url(assets/images/logo_android_1@2x.png)\" android:drawableright=\"url(assets/images/logo_android_1@2x.png)\" android:drawablebottom=\"url(assets/images/logo_android_1@2x.png)\" android:text=\"Image around text\" android:style=\"@style/textStyle\"></textview>\n    </linearlayout>\n</scrollview>",
                "sample_viewpager": "<framelayout>\n    <android.support.v4.view.viewpager id=\"viewPager\">\n    </android.support.v4.view.viewpager>\n</framelayout>",
                "sample_viewpager_gallery": "<framelayout>\n    <android.support.v4.view.viewpager android:background=\"#88000000\">\n        <androidui.widget.htmldatapageradapter>\n            <uk.co.senab.photoview.photoview android:src=\"assets/images/logo_android_3.png\">\n            </uk.co.senab.photoview.photoview>\n            <uk.co.senab.photoview.photoview android:src=\"assets/images/logo_android_2.png\">\n            </uk.co.senab.photoview.photoview>\n            <uk.co.senab.photoview.photoview android:src=\"assets/images/logo_google_1.jpg\">\n            </uk.co.senab.photoview.photoview>\n            <uk.co.senab.photoview.photoview android:src=\"assets/images/logo_google_2.png\">\n            </uk.co.senab.photoview.photoview>\n        </androidui.widget.htmldatapageradapter>\n    </android.support.v4.view.viewpager>\n    <linearlayout android:padding=\"4dp 12dp\" android:layout_gravity=\"bottom\" android:layout_height=\"wrap_content\" android:background=\"#55000000\">\n        <textview android:textcolor=\"white\">\n            Support gesture event, from\n        </textview>\n        <textview android:textcolor=\"#FF0000cc\" android:padding=\"4dp\" android:state_pressed=\"background:#66ffffff\" onclick=\"location.href = 'https://github.com/chrisbanes/PhotoView'\">\n            PhotoView\n        </textview>\n    </linearlayout>\n</framelayout>",
                "sample_viewpager_page": "<framelayout id=\"page_bg\">\n    <textview id=\"page_text\" android:padding=\"12dp\" android:layout_width=\"wrap_content\" android:layout_height=\"wrap_content\" android:background=\"#55000000\" android:textcolor=\"white\" android:layout_gravity=\"center\">\n    </textview>\n</framelayout>"
            };
            var _tempDiv = document.createElement('div');

            var layout = function () {
                function layout() {
                    _classCallCheck(this, layout);
                }

                _createClass(layout, null, [{
                    key: "getLayoutData",
                    value: function getLayoutData(layoutRef) {
                        if (!layoutRef) return null;
                        layoutRef = layoutRef.replace('/', '.').split('.').pop();
                        if (!_layout_data[layoutRef]) return null;
                        _tempDiv.innerHTML = _layout_data[layoutRef];
                        var data = _tempDiv.firstElementChild;
                        _tempDiv.removeChild(data);
                        return data;
                    }
                }]);

                return layout;
            }();

            layout.sample_animation = '@layout/sample_animation';
            layout.sample_base_widget = '@layout/sample_base_widget';
            layout.sample_button = '@layout/sample_button';
            layout.sample_contacte = '@layout/sample_contacte';
            layout.sample_drawerlayout = '@layout/sample_drawerlayout';
            layout.sample_edittext = '@layout/sample_edittext';
            layout.sample_expand_listview_item = '@layout/sample_expand_listview_item';
            layout.sample_framelayout = '@layout/sample_framelayout';
            layout.sample_gridview = '@layout/sample_gridview';
            layout.sample_gridview_item = '@layout/sample_gridview_item';
            layout.sample_htmlview = '@layout/sample_htmlview';
            layout.sample_imageview = '@layout/sample_imageview';
            layout.sample_life_callback = '@layout/sample_life_callback';
            layout.sample_linearlayout = '@layout/sample_linearlayout';
            layout.sample_listview = '@layout/sample_listview';
            layout.sample_listview_item = '@layout/sample_listview_item';
            layout.sample_picker = '@layout/sample_picker';
            layout.sample_pullrefreshload = '@layout/sample_pullrefreshload';
            layout.sample_pullrefreshload_item = '@layout/sample_pullrefreshload_item';
            layout.sample_relativelayout = '@layout/sample_relativelayout';
            layout.sample_textview = '@layout/sample_textview';
            layout.sample_viewpager = '@layout/sample_viewpager';
            layout.sample_viewpager_gallery = '@layout/sample_viewpager_gallery';
            layout.sample_viewpager_page = '@layout/sample_viewpager_page';
            R.layout = layout;
            android.content.res.Resources.buildLayoutFinder = function (refString) {
                return layout.getLayoutData(refString);
            };
        })(R = app.R || (app.R = {}));
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var R;
        (function (R) {
            android.content.res.Resources.buildResourcesElement.innerHTML = "\n<!-- color.html -->\n<android-color id=\"white\">white</android-color>\n<android-color id=\"light_gray\">#999</android-color>\n<android-color id=\"red\">#fb3b00</android-color>\n<android-color id=\"red_press\">#8A2000</android-color>\n<android-color id=\"green\">#5fcf53</android-color>\n<android-color id=\"green_press\">#45963C</android-color>\n\n\n<!-- styles.html -->\n<android-style id=\"page_text\"\n               android:padding=\"12dp\"\n               android:layout_width=\"wrap_content\"\n               android:layout_height=\"wrap_content\"\n               android:background=\"#55000000\"\n               android:textColor=\"white\"\n               android:layout_gravity=\"center\"></android-style>\n\n<android-style id=\"btn_custom1\"\n               android:padding=\"8dp\"\n               android:layout_margin=\"6dp\"\n               android:textColor=\"@color/white\"\n               android:cornerRadius=\"4dp\"\n               android:background=\"#f00\"\n               android:state_pressed=\"@style/btn_custom1/pressed\"\n               android:state_disable=\"@style/btn_custom1/disable\">\n    <android-style id=\"pressed\"\n                   android:background=\"#f66\">\n    </android-style>\n    <android-style id=\"disable\"\n                   android:textColor=\"@color/light_gray\"\n                   android:background=\"#faa\">\n    </android-style>\n</android-style>\n<android-style id=\"line_spit\"\n               android:layout_height=\"4dp\"\n               android:layout_width=\"match_parent\"\n        ></android-style>\n<android-style id=\"textStyle\"\n               android:textSize=\"12sp\"\n               android:padding=\"8dp\"\n               android:textColor=\"#333\"\n               android:background=\"#eee\"\n               android:layout_width=\"wrap_content\"\n               android:layout_height=\"wrap_content\"\n        ></android-style>\n\n<android-style id=\"editStyle\"\n               android:textColor=\"#333\"\n               android:layout_width=\"wrap_content\"\n               android:layout_height=\"wrap_content\"\n        ></android-style>\n\n<android-style id=\"imageStyle\"\n               android:background=\"#eee\"\n               android:layout_width=\"wrap_content\"\n               android:layout_height=\"wrap_content\"\n               android:layout_marginBottom=\"12dp\"\n        ></android-style>\n\n";
        })(R = app.R || (app.R = {}));
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
var sample;
(function (sample) {
    var app;
    (function (app) {
        var ActionBarActivity = android.app.ActionBarActivity;
        var Animation = android.view.animation.Animation;
        var R = sample.app.R;

        var SampleAnimationActivity = function (_ActionBarActivity) {
            _inherits(SampleAnimationActivity, _ActionBarActivity);

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
        var R = sample.app.R;

        var SampleBaseWidgetActivity = function (_ActionBarActivity2) {
            _inherits(SampleBaseWidgetActivity, _ActionBarActivity2);

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
                            }).setIcon(R.image.icon_alert).setNegativeButton(android.R.string_.cancel, null).show();
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
        var R = sample.app.R;

        var SampleButtonActivity = function (_ActionBarActivity3) {
            _inherits(SampleButtonActivity, _ActionBarActivity3);

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

        var SampleContacteActivity = function (_ActionBarActivity4) {
            _inherits(SampleContacteActivity, _ActionBarActivity4);

            function SampleContacteActivity() {
                _classCallCheck(this, SampleContacteActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleContacteActivity).apply(this, arguments));
            }

            _createClass(SampleContacteActivity, [{
                key: "onCreate",
                value: function onCreate(savedInstanceState) {
                    _get(Object.getPrototypeOf(SampleContacteActivity.prototype), "onCreate", this).call(this, savedInstanceState);
                    this.setTitle('Activity Start&Result');
                    this.setContentView(app.R.layout.sample_contacte);
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

        var SampleShowIntentActivity = function (_ActionBarActivity5) {
            _inherits(SampleShowIntentActivity, _ActionBarActivity5);

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

        var SampleResultActivity = function (_ActionBarActivity6) {
            _inherits(SampleResultActivity, _ActionBarActivity6);

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
        var R = sample.app.R;

        var SampleDrawerLayoutActivity = function (_ActionBarActivity7) {
            _inherits(SampleDrawerLayoutActivity, _ActionBarActivity7);

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
        var R = sample.app.R;

        var SampleEditTextActivity = function (_ActionBarActivity8) {
            _inherits(SampleEditTextActivity, _ActionBarActivity8);

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
        var R = sample.app.R;

        var SampleExpandableListViewActivity = function (_ActionBarActivity9) {
            _inherits(SampleExpandableListViewActivity, _ActionBarActivity9);

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

                var _this10 = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(MyListAdapter)).call.apply(_Object$getPrototypeO, [this].concat(args)));

                _this10.data = [{ 'name': 'A', 'items': ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'] }, { 'name': 'B', 'items': ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10'] }, { 'name': 'C', 'items': ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'] }, { 'name': 'D', 'items': ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'] }, { 'name': 'E', 'items': ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10'] }, { 'name': 'F', 'items': ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10'] }, { 'name': 'G', 'items': ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10'] }, { 'name': 'H', 'items': ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10'] }, { 'name': 'I', 'items': ['I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9', 'I10'] }, { 'name': 'J', 'items': ['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10'] }, { 'name': 'K', 'items': ['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8', 'K9', 'K10'] }];
                return _this10;
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
        var R = sample.app.R;

        var SampleFrameLayoutActivity = function (_ActionBarActivity10) {
            _inherits(SampleFrameLayoutActivity, _ActionBarActivity10);

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
        var R = sample.app.R;

        var SampleGridViewActivity = function (_ActionBarActivity11) {
            _inherits(SampleGridViewActivity, _ActionBarActivity11);

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
        var R = sample.app.R;

        var SampleHtmlViewActivity = function (_ActionBarActivity12) {
            _inherits(SampleHtmlViewActivity, _ActionBarActivity12);

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
        var R = sample.app.R;

        var SampleImageViewActivity = function (_ActionBarActivity13) {
            _inherits(SampleImageViewActivity, _ActionBarActivity13);

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
        var Button = android.widget.Button;
        var Log = android.util.Log;
        var Gravity = android.view.Gravity;
        var TAG = 'SampleLifeCallbackActivity';

        var SampleLifeCallbackActivity = function (_ActionBarActivity14) {
            _inherits(SampleLifeCallbackActivity, _ActionBarActivity14);

            function SampleLifeCallbackActivity() {
                _classCallCheck(this, SampleLifeCallbackActivity);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SampleLifeCallbackActivity).apply(this, arguments));
            }

            _createClass(SampleLifeCallbackActivity, [{
                key: "onCreate",
                value: function onCreate(savedInstanceState) {
                    _get(Object.getPrototypeOf(SampleLifeCallbackActivity.prototype), "onCreate", this).call(this, savedInstanceState);
                    this.setTitle('Activity Life Circel');
                    this.setContentView(app.R.layout.sample_life_callback);
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

        var SampleLifeCallbackNormalActivity = function (_ActionBarActivity15) {
            _inherits(SampleLifeCallbackNormalActivity, _ActionBarActivity15);

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
        var R = sample.app.R;

        var SampleLinearLayoutActivity = function (_ActionBarActivity16) {
            _inherits(SampleLinearLayoutActivity, _ActionBarActivity16);

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
        var R = sample.app.R;

        var SampleListViewActivity = function (_ActionBarActivity17) {
            _inherits(SampleListViewActivity, _ActionBarActivity17);

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
        var R = sample.app.R;

        var SamplePickerActivity = function (_ActionBarActivity18) {
            _inherits(SamplePickerActivity, _ActionBarActivity18);

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
        var R = sample.app.R;

        var SamplePullRefreshLoadActivity = function (_ActionBarActivity19) {
            _inherits(SamplePullRefreshLoadActivity, _ActionBarActivity19);

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

                var _this24 = _possibleConstructorReturn(this, (_Object$getPrototypeO2 = Object.getPrototypeOf(MyListAdapter)).call.apply(_Object$getPrototypeO2, [this].concat(args)));

                _this24.data = [];
                return _this24;
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
        var R = sample.app.R;

        var SampleRelativeLayoutActivity = function (_ActionBarActivity20) {
            _inherits(SampleRelativeLayoutActivity, _ActionBarActivity20);

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
        var R = sample.app.R;

        var SampleTextViewActivity = function (_ActionBarActivity21) {
            _inherits(SampleTextViewActivity, _ActionBarActivity21);

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
        var R = sample.app.R;

        var SampleViewPagerActivity = function (_ActionBarActivity22) {
            _inherits(SampleViewPagerActivity, _ActionBarActivity22);

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
        var R = sample.app.R;
        var ActionBarActivity = android.app.ActionBarActivity;

        var SampleViewPagerGalleryActivity = function (_ActionBarActivity23) {
            _inherits(SampleViewPagerGalleryActivity, _ActionBarActivity23);

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
//# sourceMappingURL=app.js.map

//# sourceMappingURL=app.es5.js.map
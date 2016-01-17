///<reference path="../../../dist/android-ui.d.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var R;
        (function (R) {
            var NetImage = androidui.image.NetImage;
            var data = {
                "icon_alert": [
                    null,
                    null,
                    null,
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAjVBMVEUAAAAzR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR18zR198qNTWAAAALnRSTlMAsFf6A8T2D3vpgfBPMQbbnCMKzry2bY6JdWYsFeSUSuDW0cmhXEUnHjwaqEE2puKK5AAAA39JREFUeNrt2uey2jAQBeADcjcuGNNNb5eSff/Hy49MckMGw0oreyYz/p7goEXWam10Op2OkSI5RXd3lIWeile7Q5nPBxcHLfk6Hbf0ghrNNgWadl1n9IZygy805xJt6TN34aMRG5eYvHwI25z+iDSo+xJWDXakq2dxFYZjMuAFKaxIA4/MZGdYMNyTubUj3/ghSZQVZBaKZLIlBJw1icUbGPNLsmEOQ5eM7DimMPGIyZaDb/L7Y7KndKDLz8imNTQ5Jdm1gJ41WaYe0LEg68Ih+B6K7Nv54BqGxBLPBl/Fj8mYeMYOeNI9sYxv+KXPDByBJyCWGf6oMuJQS14BPOLYp/h2JRYXHMySJvjbjFhO+GxALDs8WRJL6OMTZ0csRzxxPFv/wz7xTPDMJZbYxwcj4unjWY94Ary3oYYDhAXecpsOQBO8c6HGA+zxTtR8AErwxraFAFPUu1ILAUIHtdZtBKAzamWtBJihzhe1EmCEOqd2ApCPGseWAgxqN6EsgHgjFtRSgBKvJW0FWMn+g/IAVOClSBpAehzcWwvQx0uuOICwJxjJA8j6skwYQHwahLIA8nmJ11qAHC+p1gIc8VIsmfmUFlZgJSljSPLTaEcaDuxehn9DPJAGr+JOtfjT45J09J4WICYLT8KctJzMx5obvDQnLSpw8MvFJT1DxmyEYzS4AemPyCM9ymHcTJlWe0XadnjNUdSOnmw6IhegxozacRXNZ+S8FDUKRW0YyyZEcnPGmJotG2eka4laX5pr+fAB+GeXDM5ReQ3CP4eBM/cEJ5HpqRre8O2HIi5V4Q3fM5z0RLLH4LfcsKtyRvzgbw0V8dwMi3fAB3fDK34iG898WxpWMlWCSbHBDWNq2NT3bb00K/GPSvTaTH9HxQ6ePey9OCy2JlOWwKhwgubUfV6CW8zZOj54cv2+asy7DjClLqeeffzhRJY/56m2xNC7/d44LnMowJd4xBDni6T4scg9YnBT6BiQZdsKegKyykug6042DaCtGJE9AQxULtkSwUiakxVeH6YmiuS2CcydY5JyK0hcMvnHjDL+WHgPFHNmikytNrBh6ZIRNfVhySkkfe4S9vhRTHr2fdjlByHxHQawr5jsiUX1zmhIMg3pk8OkQoOc82xEtbzxfInm+YNpuaJ/qF0vuKZoT5H0J8FsnR/zaTSfbIYOOp1Op9P5X/0Eg/+iUtRdaggAAAAASUVORK5CYII="
                ]
            };
            var imageCache = {
                icon_alert: null
            };
            function findRatioImage(array) {
                if (array[window.devicePixelRatio])
                    return new NetImage(array[window.devicePixelRatio], window.devicePixelRatio);
                for (let i = array.length; i >= 0; i--) {
                    if (array[i]) {
                        return new NetImage(array[i], i);
                    }
                }
                throw Error('Not find radio image. May something error in build.');
            }
            class image_base64 {
                static get icon_alert() {
                    return imageCache.icon_alert || (imageCache.icon_alert = findRatioImage(data.icon_alert));
                }
            }
            R.image_base64 = image_base64;
        })(R = app.R || (app.R = {}));
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
///<reference path="../../../dist/android-ui.d.ts"/>
///<reference path="image_base64.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var R;
        (function (R) {
            var NetDrawable = androidui.image.NetDrawable;
            class image {
                static get icon_alert() { return new NetDrawable(R.image_base64.icon_alert); }
            }
            R.image = image;
            android.content.res.Resources.buildDrawableFinder = (refString) => {
                return image[refString];
            };
        })(R = app.R || (app.R = {}));
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
///<reference path="../../../dist/android-ui.d.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var R;
        (function (R) {
            const _layout_data = {
                "sample_animation": "<ScrollView>\n    <LinearLayout\n            android:padding=\"0 6dp\"\n            gravity=\"center\"\n            android:orientation=\"vertical\">\n        <TextView gravity=\"center\">Rotate:</TextView>\n        <ImageView\n                id=\"rotate_repeat\"\n                android:src=\"assets/images/logo_android_1@2x.png\"\n                android:layout_width=\"56dp\"\n                android:layout_height=\"56dp\"\n                android:layout_margin=\"20dp 12dp\"\n                ></ImageView>\n        <TextView gravity=\"center\">Translate:</TextView>\n        <ImageView\n                id=\"translate_repeat\"\n                android:src=\"assets/images/logo_android_1@2x.png\"\n                android:layout_width=\"56dp\"\n                android:layout_height=\"56dp\"\n                android:layout_margin=\"12dp\"\n                ></ImageView>\n        <TextView gravity=\"center\">Scale:</TextView>\n        <ImageView\n                id=\"scale_repeat\"\n                android:src=\"assets/images/logo_android_1@2x.png\"\n                android:layout_width=\"56dp\"\n                android:layout_height=\"56dp\"\n                android:layout_margin=\"12dp\"\n                ></ImageView>\n        <TextView gravity=\"center\">Alpha:</TextView>\n        <ImageView\n                id=\"alpha_repeat\"\n                android:src=\"assets/images/logo_android_1@2x.png\"\n                android:layout_width=\"56dp\"\n                android:layout_height=\"56dp\"\n                android:layout_margin=\"12dp\"\n                ></ImageView>\n        <TextView gravity=\"center\">Animation Set:</TextView>\n        <ImageView\n                id=\"anim_set\"\n                android:src=\"assets/images/logo_android_1@2x.png\"\n                android:layout_width=\"56dp\"\n                android:layout_height=\"56dp\"\n                android:layout_margin=\"12dp\"\n                ></ImageView>\n    </LinearLayout>\n</ScrollView>",
                "sample_base_widget": "<ScrollView>\n    <LinearLayout\n            android:orientation=\"vertical\"\n            android:padding=\"12dp\"\n            android:gravity=\"center\">\n        <TextView android:layout_width=\"wrap_content\">\n            TextView\n        </TextView>\n        <Button android:layout_width=\"wrap_content\">\n            Button\n        </Button>\n        <ImageView android:src=\"assets/images/logo_google_3.png\">\n        </ImageView>\n        <CheckBox android:layout_width=\"wrap_content\"\n                  android:layout_marginBottom=\"12dp\">\n            CheckBox\n        </CheckBox>\n        <RadioGroup\n                android:gravity=\"center\"\n                android:orientation=\"HORIZONTAL\"\n                android:layout_marginBottom=\"12dp\">\n            <RadioButton android:layout_width=\"wrap_content\">\n                Radio1\n            </RadioButton>\n            <RadioButton android:layout_width=\"wrap_content\">\n                Radio2\n            </RadioButton>\n            <RadioButton android:layout_width=\"wrap_content\">\n                Radio3\n            </RadioButton>\n        </RadioGroup>\n        <Button id=\"btn_open_dialog\"\n                android:layout_width=\"wrap_content\">\n            OpenDialog\n        </Button>\n        <Spinner android:layout_width=\"wrap_content\"\n                 android:entries='[\"Item1\", \"Item2\", \"Item3\", \"Item4\", \"Item5\", \"Item6\", \"Item7\"]'>\n        </Spinner>\n        <Button id=\"btn_show_popup\"\n                android:layout_width=\"wrap_content\">\n            PopupWindow\n        </Button>\n\n        <ProgressBar android:layout_height=\"wrap_content\"\n                     android:layout_width=\"wrap_content\"\n                     android:layout_marginBottom=\"12dp\"></ProgressBar>\n        <ProgressBar android:layout_height=\"wrap_content\"\n                     android:layout_width=\"match_parent\"\n                     android:layout_marginBottom=\"12dp\"\n                     style=\"@android:attr/progressBarStyleHorizontal\"\n                     android:max=\"100\"\n                     android:progress=\"50\"\n                     android:secondaryProgress=\"70\"></ProgressBar>\n\n        <SeekBar android:layout_height=\"wrap_content\"\n                 android:layout_width=\"match_parent\"\n                 android:layout_marginBottom=\"12dp\"></SeekBar>\n\n        <RatingBar android:layout_height=\"wrap_content\"\n                   android:layout_width=\"wrap_content\"\n                   android:layout_marginBottom=\"12dp\"></RatingBar>\n\n    </LinearLayout>\n</ScrollView>",
                "sample_button": "<ScrollView>\n    <LinearLayout\n            android:orientation=\"vertical\"\n            android:gravity=\"center\">\n        <Button\n                android:layout_width=\"wrap_content\">\n            Button\n        </Button>\n        <Button\n                android:layout_width=\"wrap_content\"\n                android:enabled=\"false\">\n            DisableButton\n        </Button>\n        <Button id=\"btn_click\">\n            ButtonClick\n        </Button>\n        <Button android:layout_width=\"wrap_content\"\n                onclick=\"this.setText('Click:'+new Date().getTime());\">\n            ButtonClick2\n        </Button>\n        <Button id=\"btn_long_click\">\n            ButtonLongClick\n        </Button>\n        <Button\n                android:style=\"@style/btn_custom1\"\n                >\n            ButtonStyled\n        </Button>\n        <Button\n                android:style=\"@style/btn_custom1\"\n                android:enabled=\"false\"\n                >\n            ButtonStyledDisable\n        </Button>\n        <Button\n                android:padding=\"8dp\"\n                android:layout_margin=\"6dp\"\n                android:textColor=\"@color/white\"\n                android:background=\"#f00\"\n                android:state_pressed=\"@style/btn_custom1/pressed\"\n                >\n            ButtonStyled2\n        </Button>\n        <Button\n                android:padding=\"8dp\"\n                android:layout_margin=\"6dp\"\n                android:textColor=\"@color/white\"\n                android:background=\"#f00\"\n                android:state_pressed=\"background:#f66;\"\n                >\n            ButtonStyled3\n        </Button>\n    </LinearLayout>\n</ScrollView>",
                "sample_contacte": "<LinearLayout\n        android:orientation=\"vertical\">\n    <Button id=\"open_activity_intent\">\n        startActivity with intent\n    </Button>\n    <Button id=\"open_activity_result\">\n        startActivity with result\n    </Button>\n    <ScrollView>\n        <LinearLayout android:orientation=\"vertical\">\n            <TextView id=\"console_tv\"\n                      android:gravity=\"center\">\n            </TextView>\n        </LinearLayout>\n    </ScrollView>\n</LinearLayout>",
                "sample_drawerlayout": "<android.support.v4.widget.DrawerLayout>\n    <LinearLayout\n            android:orientation=\"vertical\"\n            android:gravity=\"center\"\n            android:layout_height=\"match_parent\"\n            android:layout_width=\"match_parent\">\n        <Button\n                onclick=\"this.getParent().getParent().openDrawer(android.view.Gravity.LEFT);\"\n                android:layout_height=\"wrap_content\"\n                android:layout_width=\"wrap_content\"\n                >Open left drawer</Button>\n        <Button\n                onclick=\"this.getParent().getParent().openDrawer(android.view.Gravity.RIGHT);\"\n                android:layout_height=\"wrap_content\"\n                android:layout_width=\"wrap_content\"\n                >Open right drawer</Button>\n    </LinearLayout>\n    <LinearLayout\n            android:layout_gravity=\"left\"\n            android:background=\"white\"\n            android:clickable=\"true\"\n            android:layout_height=\"match_parent\"\n            android:layout_width=\"220dp\">\n        <TextView\n                android:layout_height=\"match_parent\"\n                android:layout_width=\"match_parent\"\n                android:gravity=\"center\"\n                >Left drawer</TextView>\n    </LinearLayout>\n    <LinearLayout\n            android:layout_gravity=\"right\"\n            android:background=\"white\"\n            android:clickable=\"true\"\n            android:layout_height=\"match_parent\"\n            android:layout_width=\"220dp\">\n        <TextView\n                android:layout_height=\"match_parent\"\n                android:layout_width=\"match_parent\"\n                android:gravity=\"center\"\n                >Right drawer</TextView>\n    </LinearLayout>\n</android.support.v4.widget.DrawerLayout>",
                "sample_expand_listview_item": "<FrameLayout id=\"item_child_layout\"\n             android:layout_width=\"match_parent\"\n             android:padding=\"12dp\">\n    <TextView id=\"item_child_text\"\n              android:padding=\"12dp\"\n              android:layout_width=\"wrap_content\"\n              android:layout_height=\"wrap_content\"\n              android:background=\"#55000000\"\n              android:textColor=\"white\"\n              android:layout_gravity=\"center\"\n            >\n    </TextView>\n</FrameLayout>",
                "sample_framelayout": "<FrameLayout>\n\n    <TextView\n            android:text=\"Text\"\n            android:layout_gravity=\"left|top\"\n            android:style=\"@style/textStyle\"\n            ></TextView>\n    <TextView\n            android:text=\"Text\"\n            android:layout_gravity=\"right|top\"\n            android:style=\"@style/textStyle\"\n            ></TextView>\n    <TextView\n            android:text=\"Text\"\n            android:layout_gravity=\"bottom|right\"\n            android:style=\"@style/textStyle\"\n            ></TextView>\n    <TextView\n            android:text=\"Text\"\n            android:layout_gravity=\"bottom|left\"\n            android:style=\"@style/textStyle\"\n            ></TextView>\n    <TextView\n            android:text=\"Text\"\n            android:layout_gravity=\"center\"\n            android:style=\"@style/textStyle\"\n            ></TextView>\n    <TextView\n            android:text=\"Text\"\n            android:layout_gravity=\"left|center_vertical\"\n            android:style=\"@style/textStyle\"\n            ></TextView>\n    <TextView\n            android:text=\"Text\"\n            android:layout_gravity=\"right|center_vertical\"\n            android:style=\"@style/textStyle\"\n            ></TextView>\n    <TextView\n            android:text=\"Text\"\n            android:layout_gravity=\"top|center_horizontal\"\n            android:style=\"@style/textStyle\"\n            ></TextView>\n    <TextView\n            android:text=\"Text\"\n            android:layout_gravity=\"bottom|center_horizontal\"\n            android:style=\"@style/textStyle\"\n            ></TextView>\n    <TextView\n            android:text=\"Text MarginBottom50\"\n            android:layout_marginBottom=\"50dp\"\n            android:layout_gravity=\"center\"\n            android:style=\"@style/textStyle\"\n            ></TextView>\n</FrameLayout>",
                "sample_gridview": "<FrameLayout>\n    <GridView id=\"gridView\"\n              android:numColumns=\"2\">\n    </GridView>\n</FrameLayout>",
                "sample_gridview_item": "<FrameLayout id=\"item_layout\"\n             android:layout_width=\"match_parent\"\n             android:padding=\"32dp\">\n    <TextView id=\"item_text\"\n              android:padding=\"16dp\"\n              android:layout_width=\"wrap_content\"\n              android:layout_height=\"wrap_content\"\n              android:background=\"#55000000\"\n              android:textColor=\"white\"\n              android:layout_gravity=\"center\"\n            >\n    </TextView>\n</FrameLayout>",
                "sample_htmlview": "<ScrollView android:fillViewport=\"true\">\n    <LinearLayout\n            android:orientation=\"vertical\">\n        <HtmlView>\n            <p style=\"font-size: 24px;text-align: center\">HtmlView</p>\n        </HtmlView>\n        <HtmlView style=\"padding:0 20px;box-sizing: border-box;line-height: 20px;\">\n            <p>HtmlView can wrap any <span style=\"color: red;font-weight: bold;\">HTML tag</span>, render with DOM, but too many HtmlView will reduce FPS.</p>\n            <p>HtmlView above on all Android Views</p>\n        </HtmlView>\n        <TextView android:gravity=\"center\">TextView</TextView>\n        <HtmlView style=\"overflow: visible;text-align: center;\">\n            <input style=\"font-size: 16px;text-align: center;box-shadow: 0 0 1px black;margin: 12px 0; padding: 6px;\" placeholder=\"Place Input\"/>\n        </HtmlView>\n    </LinearLayout>\n</ScrollView>",
                "sample_imageview": "<ScrollView>\n    <LinearLayout\n            android:padding=\"0 6dp\"\n            android:orientation=\"vertical\">\n        <TextView>Default(FitCenter):</TextView>\n        <LinearLayout>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:layout_marginLeft=\"4dp\"\n                    android:layout_height=\"200dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:layout_width=\"match_parent\"\n                    android:layout_marginLeft=\"4dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n        </LinearLayout>\n        <TextView>FitStart:</TextView>\n        <LinearLayout>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"fitStart\"\n                    android:layout_height=\"200dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"fitStart\"\n                    android:layout_width=\"match_parent\"\n                    android:layout_marginLeft=\"4dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n        </LinearLayout>\n        <TextView>FitEnd:</TextView>\n        <LinearLayout>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"fitEnd\"\n                    android:layout_height=\"200dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"fitEnd\"\n                    android:layout_width=\"match_parent\"\n                    android:layout_marginLeft=\"4dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n        </LinearLayout>\n        <TextView>FitXy:</TextView>\n        <LinearLayout>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"fitXy\"\n                    android:layout_height=\"200dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"fitXy\"\n                    android:layout_width=\"match_parent\"\n                    android:layout_marginLeft=\"4dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n        </LinearLayout>\n        <TextView>Center:</TextView>\n        <LinearLayout>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"center\"\n                    android:layout_height=\"80dp\"\n                    android:layout_width=\"80dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"center\"\n                    android:layout_height=\"180dp\"\n                    android:layout_width=\"180dp\"\n                    android:layout_marginLeft=\"4dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n        </LinearLayout>\n        <TextView>centerCrop:</TextView>\n        <LinearLayout>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"centerCrop\"\n                    android:layout_height=\"80dp\"\n                    android:layout_width=\"80dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"centerCrop\"\n                    android:layout_marginLeft=\"4dp\"\n                    android:layout_height=\"100dp\"\n                    android:layout_width=\"60dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"centerCrop\"\n                    android:layout_height=\"60dp\"\n                    android:layout_width=\"100dp\"\n                    android:layout_marginLeft=\"4dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n        </LinearLayout>\n        <TextView>centerInside:</TextView>\n        <LinearLayout>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"centerInside\"\n                    android:layout_height=\"80dp\"\n                    android:layout_width=\"80dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"centerInside\"\n                    android:layout_height=\"180dp\"\n                    android:layout_width=\"180dp\"\n                    android:layout_marginLeft=\"4dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n        </LinearLayout>\n\n        <TextView>Background:</TextView>\n        <FrameLayout\n                android:style=\"@style/imageStyle\"\n                android:backgroundUri=\"assets/images/logo_android_1@2x.png\"\n                ></FrameLayout>\n\n    </LinearLayout>\n</ScrollView>",
                "sample_life_callback": "<LinearLayout\n        android:orientation=\"vertical\">\n    <Button id=\"open_activity_normal\">\n        Open Normal Activity\n    </Button>\n    <Button id=\"open_activity_float\">\n        Open Floating Activity\n    </Button>\n    <ScrollView>\n        <LinearLayout android:orientation=\"vertical\">\n            <TextView id=\"console_tv\"\n                      android:gravity=\"center\">\n            </TextView>\n        </LinearLayout>\n    </ScrollView>\n</LinearLayout>",
                "sample_linearlayout": "<LinearLayout\n        android:gravity=\"center_vertical\"\n        android:orientation=\"vertical\">\n\n    <LinearLayout\n            android:orientation=\"vertical\">\n        <TextView\n                android:text=\"Vertical\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <TextView\n                android:text=\"Vertical\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n\n    </LinearLayout>\n    <LinearLayout\n            android:layout_marginTop=\"12dp\"\n            android:gravity=\"center\"\n            android:orientation=\"vertical\">\n        <TextView\n                android:text=\"Vertical-Center\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <TextView\n                android:text=\"Vertical-Center\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n\n    </LinearLayout>\n\n    <LinearLayout\n            android:layout_marginTop=\"12dp\"\n            android:orientation=\"horizontal\">\n        <TextView\n                android:text=\"horizontal\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <TextView\n                android:text=\"linear\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <TextView\n                android:text=\"layout\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n\n    </LinearLayout>\n    <LinearLayout\n            android:layout_marginTop=\"12dp\"\n            android:gravity=\"center\"\n            android:orientation=\"horizontal\">\n        <TextView\n                android:text=\"horizontal\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <TextView\n                android:text=\"linear\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <TextView\n                android:text=\"layout\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <TextView\n                android:text=\"-center\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n\n    </LinearLayout>\n    <LinearLayout\n            android:layout_marginTop=\"12dp\"\n            android:gravity=\"right\"\n            android:orientation=\"horizontal\">\n        <TextView\n                android:text=\"horizontal\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <TextView\n                android:text=\"linear\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <TextView\n                android:text=\"layout\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <TextView\n                android:text=\"-right\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n\n    </LinearLayout>\n\n    <TextView\n            android:layout_marginTop=\"12dp\"\n            android:gravity=\"center\"\n            android:text=\"more usage see Android's document\"\n            ></TextView>\n\n</LinearLayout>",
                "sample_listview": "<FrameLayout>\n    <ListView id=\"listView\">\n    </ListView>\n</FrameLayout>",
                "sample_listview_item": "<FrameLayout id=\"item_layout\"\n             android:layout_width=\"match_parent\"\n             android:padding=\"32dp\">\n    <TextView id=\"item_text\"\n              android:padding=\"16dp\"\n              android:layout_width=\"wrap_content\"\n              android:layout_height=\"wrap_content\"\n              android:background=\"#55000000\"\n              android:textColor=\"white\"\n              android:layout_gravity=\"center\"\n            >\n    </TextView>\n</FrameLayout>",
                "sample_picker": "<LinearLayout\n        android:orientation=\"vertical\"\n        android:gravity=\"center\">\n    <NumberPicker id=\"picker\"\n                  android:layout_height=\"280dp\"\n                  android:itemCount=\"5\"\n                  android:minValue=\"1\"\n                  android:maxValue=\"9\"\n            >\n        <androidui.widget.HtmlDataPickerAdapter>\n            <item>1</item>\n            <item>2</item>\n            <item>3</item>\n            <item>4</item>\n            <item>5</item>\n            <item>6</item>\n            <item>7</item>\n            <item>8</item>\n            <item>9</item>\n        </androidui.widget.HtmlDataPickerAdapter>\n    </NumberPicker>\n</LinearLayout>",
                "sample_pullrefreshload": "<androidui.widget.PullRefreshLoadLayout\n        id=\"prll\"\n        android:layout_width=\"match_parent\"\n        android:layout_height=\"match_parent\">\n    <ListView id=\"listView\">\n    </ListView>\n</androidui.widget.PullRefreshLoadLayout>",
                "sample_pullrefreshload_item": "<FrameLayout id=\"item_layout\"\n             android:layout_width=\"match_parent\"\n             android:padding=\"32dp\">\n    <TextView id=\"item_text\"\n              android:padding=\"16dp\"\n              android:layout_width=\"wrap_content\"\n              android:layout_height=\"wrap_content\"\n              android:background=\"#55000000\"\n              android:textColor=\"white\"\n              android:layout_gravity=\"center\"\n            >\n    </TextView>\n</FrameLayout>",
                "sample_relativelayout": "<RelativeLayout>\n    <TextView id=\"text1\"\n              android:style=\"@style/textStyle\"\n              android:text=\"Left&Top\"\n            ></TextView>\n    <TextView id=\"text2\"\n              android:style=\"@style/textStyle\"\n              android:text=\"Right&Top\"\n              android:layout_alignParentRight=\"true\"\n            ></TextView>\n    <TextView id=\"text3\"\n              android:style=\"@style/textStyle\"\n              android:text=\"Left&Bottom\"\n              android:layout_alignParentBottom=\"true\"\n            ></TextView>\n    <TextView id=\"text4\"\n              android:style=\"@style/textStyle\"\n              android:text=\"Right&Bottom\"\n              android:layout_alignParentRight=\"true\"\n              android:layout_alignParentBottom=\"true\"\n            ></TextView>\n    <TextView id=\"text5\"\n              android:style=\"@style/textStyle\"\n              android:text=\"VerticalCenter\"\n              android:layout_centerVertical=\"true\"\n            ></TextView>\n    <TextView id=\"text6\"\n              android:style=\"@style/textStyle\"\n              android:text=\"HorizontalCenter\"\n              android:layout_centerHorizontal=\"true\"\n            ></TextView>\n    <TextView id=\"text7\"\n              android:style=\"@style/textStyle\"\n              android:text=\"Center\"\n              android:layout_centerInParent=\"true\"\n            ></TextView>\n\n    <TextView\n            android:style=\"@style/textStyle\"\n            android:text=\"below\"\n            android:layout_marginTop=\"4dp\"\n            android:layout_below=\"text1\"\n            ></TextView>\n\n    <TextView\n              android:style=\"@style/textStyle\"\n              android:text=\"toRightOf\"\n              android:layout_marginLeft=\"4dp\"\n              android:layout_toRightOf=\"text3\"\n              android:layout_alignParentBottom=\"true\"\n            ></TextView>\n    <TextView\n              android:style=\"@style/textStyle\"\n              android:text=\"above\"\n              android:layout_marginBottom=\"4dp\"\n              android:layout_above=\"text3\"\n            ></TextView>\n    <TextView\n              android:style=\"@style/textStyle\"\n              android:text=\"toLeftOf\"\n              android:layout_marginRight=\"4dp\"\n              android:layout_toLeftOf=\"text4\"\n              android:layout_alignParentBottom=\"true\"\n            ></TextView>\n\n    <TextView\n            id=\"alignLeft\"\n              android:style=\"@style/textStyle\"\n              android:text=\"  alignLeft  \"\n              android:layout_marginTop=\"4dp\"\n              android:layout_alignLeft=\"text6\"\n              android:layout_below=\"text2\"\n            ></TextView>\n    <TextView\n              android:style=\"@style/textStyle\"\n              android:text=\"  alignRight  \"\n              android:layout_marginTop=\"4dp\"\n              android:layout_alignRight=\"text6\"\n              android:layout_below=\"alignLeft\"\n            ></TextView>\n    <TextView\n            id=\"alignTop\"\n              android:style=\"@style/textStyle\"\n              android:text=\"alignTop\"\n              android:maxWidth=\"46dp\"\n              android:layout_marginLeft=\"4dp\"\n              android:layout_alignTop=\"text7\"\n              android:layout_toRightOf=\"text7\"\n            ></TextView>\n    <TextView\n              android:style=\"@style/textStyle\"\n              android:text=\"alignBottom\"\n              android:maxWidth=\"52dp\"\n              android:layout_marginLeft=\"4dp\"\n              android:layout_alignBottom=\"text7\"\n              android:layout_toRightOf=\"alignTop\"\n            ></TextView>\n    <TextView\n              android:style=\"@style/textStyle\"\n              android:text=\"above&toLeftOf\"\n              android:layout_above=\"text7\"\n              android:layout_toLeftOf=\"text7\"\n            ></TextView>\n    <TextView\n              android:style=\"@style/textStyle\"\n              android:text=\"toRightOf & toLeftOf & below\"\n              android:layout_below=\"text7\"\n              android:layout_toLeftOf=\"text7\"\n              android:layout_toRightOf=\"text5\"\n            ></TextView>\n</RelativeLayout>",
                "sample_textview": "<ScrollView>\n    <LinearLayout\n            android:orientation=\"vertical\">\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:text=\"Text\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:padding=\"10dp\"\n                android:text=\"Text Padding10\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:padding=\"10dp\"\n                android:text=\"Line1\nLine2\nLine3\nLine4\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:maxLines=\"2\"\n                android:ellipsize=\"END\"\n                android:padding=\"10dp\"\n                android:text=\"maxLines=2\nmaxLines=2\nmaxLines=2\nmaxLines=2\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:layout_width=\"match_parent\"\n                android:padding=\"10dp\"\n                android:gravity=\"center\"\n                android:text=\"Text Center\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:minLines=\"2\"\n                android:layout_width=\"match_parent\"\n                android:padding=\"10dp\"\n                android:gravity=\"center\"\n                android:text=\"Text minLines=2\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:layout_width=\"match_parent\"\n                android:padding=\"10dp\"\n                android:gravity=\"right\"\n                android:text=\"Text Right\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:layout_height=\"100dp\"\n                android:layout_width=\"match_parent\"\n                android:padding=\"10dp\"\n                android:gravity=\"center\"\n                android:text=\"Text Center\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:layout_height=\"100dp\"\n                android:layout_width=\"match_parent\"\n                android:padding=\"10dp\"\n                android:gravity=\"bottom\"\n                android:text=\"Text Bottom\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:layout_height=\"100dp\"\n                android:layout_width=\"match_parent\"\n                android:padding=\"10dp\"\n                android:gravity=\"center_vertical\"\n                android:text=\"Text center vertical\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:layout_height=\"100dp\"\n                android:layout_width=\"match_parent\"\n                android:padding=\"10dp\"\n                android:gravity=\"center_horizontal\"\n                android:text=\"Text center horizontal\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:layout_height=\"100dp\"\n                android:layout_width=\"match_parent\"\n                android:padding=\"10dp\"\n                android:gravity=\"right|bottom\"\n                android:text=\"Text right&bottom\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:layout_height=\"wrap_content\"\n                android:layout_width=\"wrap_content\"\n                android:padding=\"10dp\"\n                android:gravity=\"center\"\n                android:drawablePadding=\"12dp\"\n                android:drawableLeftUri=\"assets/images/logo_android_1@2x.png\"\n                android:drawableTopUri=\"assets/images/logo_android_1@2x.png\"\n                android:drawableRightUri=\"assets/images/logo_android_1@2x.png\"\n                android:drawableBottomUri=\"assets/images/logo_android_1@2x.png\"\n                android:text=\"Image around text\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n    </LinearLayout>\n</ScrollView>",
                "sample_viewpager": "<FrameLayout>\n    <android.support.v4.view.ViewPager id=\"viewPager\">\n    </android.support.v4.view.ViewPager>\n</FrameLayout>",
                "sample_viewpager_gallery": "<FrameLayout>\n    <android.support.v4.view.ViewPager\n            android:background=\"#88000000\"\n            >\n        <androidui.widget.HtmlDataPagerAdapter>\n            <uk.co.senab.photoview.PhotoView\n                    android:src=\"assets/images/logo_android_3.png\">\n            </uk.co.senab.photoview.PhotoView>\n            <uk.co.senab.photoview.PhotoView\n                    android:src=\"assets/images/logo_android_2.png\">\n            </uk.co.senab.photoview.PhotoView>\n            <uk.co.senab.photoview.PhotoView\n                    android:src=\"assets/images/logo_google_1.jpg\">\n            </uk.co.senab.photoview.PhotoView>\n            <uk.co.senab.photoview.PhotoView\n                    android:src=\"assets/images/logo_google_2.png\">\n            </uk.co.senab.photoview.PhotoView>\n        </androidui.widget.HtmlDataPagerAdapter>\n    </android.support.v4.view.ViewPager>\n    <LinearLayout\n            android:padding=\"4dp 12dp\"\n            android:layout_gravity=\"bottom\"\n            android:layout_height=\"wrap_content\"\n            android:background=\"#55000000\"\n            >\n        <TextView android:textColor=\"white\">\n            Support gesture event, from\n        </TextView>\n        <TextView android:textColor=\"#FF0000cc\" android:padding=\"4dp\"\n                  android:state_pressed=\"background:#66ffffff\"\n                onclick=\"location.href = 'https://github.com/chrisbanes/PhotoView'\">\n            PhotoView\n        </TextView>\n    </LinearLayout>\n</FrameLayout>",
                "sample_viewpager_page": "<FrameLayout id=\"page_bg\">\n    <TextView id=\"page_text\"\n              android:padding=\"12dp\"\n              android:layout_width=\"wrap_content\"\n              android:layout_height=\"wrap_content\"\n              android:background=\"#55000000\"\n              android:textColor=\"white\"\n              android:layout_gravity=\"center\"\n            >\n    </TextView>\n</FrameLayout>"
            };
            const _tempDiv = document.createElement('div');
            class layout {
                static getLayoutData(layoutRef) {
                    if (!layoutRef)
                        return null;
                    layoutRef = layoutRef.replace('/', '.').split('.').pop();
                    if (!_layout_data[layoutRef])
                        return null;
                    _tempDiv.innerHTML = _layout_data[layoutRef];
                    let data = _tempDiv.firstElementChild;
                    _tempDiv.removeChild(data);
                    return data;
                }
            }
            layout.sample_animation = '@layout/sample_animation';
            layout.sample_base_widget = '@layout/sample_base_widget';
            layout.sample_button = '@layout/sample_button';
            layout.sample_contacte = '@layout/sample_contacte';
            layout.sample_drawerlayout = '@layout/sample_drawerlayout';
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
            android.content.res.Resources.buildLayoutFinder = (refString) => {
                return layout.getLayoutData(refString);
            };
        })(R = app.R || (app.R = {}));
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
///<reference path="../../../dist/android-ui.d.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var R;
        (function (R) {
            android.content.res.Resources.buildResourcesElement.innerHTML = `
<!-- color.html -->
<android-color id="white">white</android-color>
<android-color id="light_gray">#999</android-color>
<android-color id="red">#fb3b00</android-color>
<android-color id="red_press">#8A2000</android-color>
<android-color id="green">#5fcf53</android-color>
<android-color id="green_press">#45963C</android-color>


<!-- styles.html -->
<android-style id="page_text"
               android:padding="12dp"
               android:layout_width="wrap_content"
               android:layout_height="wrap_content"
               android:background="#55000000"
               android:textColor="white"
               android:layout_gravity="center"></android-style>

<android-style id="btn_custom1"
               android:padding="8dp"
               android:layout_margin="6dp"
               android:textColor="@color/white"
               android:background="#f00"
               android:state_pressed="@style/btn_custom1/pressed"
               android:state_disable="@style/btn_custom1/disable">
    <android-style id="pressed"
                   android:background="#f66">
    </android-style>
    <android-style id="disable"
                   android:textColor="@color/light_gray"
                   android:background="#faa">
    </android-style>
</android-style>
<android-style id="line_spit"
               android:layout_height="4dp"
               android:layout_width="match_parent"
        ></android-style>
<android-style id="textStyle"
               android:textSize="12sp"
               android:padding="8dp"
               android:textColor="#333"
               android:background="#eee"
               android:layout_width="wrap_content"
               android:layout_height="wrap_content"
        ></android-style>

<android-style id="imageStyle"
               android:background="#eee"
               android:layout_width="wrap_content"
               android:layout_height="wrap_content"
               android:layout_marginBottom="12dp"
        ></android-style>

`;
        })(R = app.R || (app.R = {}));
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var Activity = android.app.Activity;
        var Animation = android.view.animation.Animation;
        var R = sample.app.R;
        class SampleAnimationActivity extends Activity {
            onCreate() {
                super.onCreate();
                this.setContentView(R.layout.sample_animation);
                let rotateView = this.findViewById('rotate_repeat');
                let rotateAnimation = new android.view.animation.RotateAnimation(0, 360, Animation.RELATIVE_TO_SELF, 0.5, Animation.RELATIVE_TO_SELF, 0.5);
                rotateAnimation.setRepeatCount(Animation.INFINITE);
                rotateAnimation.setDuration(1000);
                rotateAnimation.setInterpolator(new android.view.animation.LinearInterpolator());
                rotateView.startAnimation(rotateAnimation);
                let transView = this.findViewById('translate_repeat');
                let density = android.content.res.Resources.getDisplayMetrics().density;
                let transAnimation = new android.view.animation.TranslateAnimation(-100 * density, 100 * density, 50 * density, -50 * density);
                transAnimation.setRepeatCount(Animation.INFINITE);
                transAnimation.setRepeatMode(Animation.REVERSE);
                transAnimation.setDuration(1000);
                transView.startAnimation(transAnimation);
                let scaleView = this.findViewById('scale_repeat');
                let scaleAnimation = new android.view.animation.ScaleAnimation(0.5, 1.5, 0.5, 1.5, Animation.RELATIVE_TO_SELF, 0.5, Animation.RELATIVE_TO_SELF, 0.5);
                scaleAnimation.setRepeatCount(Animation.INFINITE);
                scaleAnimation.setRepeatMode(Animation.REVERSE);
                scaleAnimation.setDuration(1000);
                scaleView.startAnimation(scaleAnimation);
                let alphaView = this.findViewById('alpha_repeat');
                let alphaAnimation = new android.view.animation.AlphaAnimation(1, 0.1);
                alphaAnimation.setRepeatCount(Animation.INFINITE);
                alphaAnimation.setRepeatMode(Animation.REVERSE);
                alphaAnimation.setDuration(500);
                alphaView.startAnimation(alphaAnimation);
                let animSetView = this.findViewById('anim_set');
                let animSet = new android.view.animation.AnimationSet();
                animSet.addAnimation(rotateAnimation);
                animSet.addAnimation(transAnimation);
                animSet.addAnimation(scaleAnimation);
                animSet.addAnimation(alphaAnimation);
                animSetView.startAnimation(animSet);
            }
        }
        app.SampleAnimationActivity = SampleAnimationActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
///<reference path="../gen/R/image.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var Activity = android.app.Activity;
        var AlertDialog = android.app.AlertDialog;
        var Toast = android.widget.Toast;
        var TextView = android.widget.TextView;
        var PopupWindow = android.widget.PopupWindow;
        var R = sample.app.R;
        class SampleBaseWidgetActivity extends Activity {
            onCreate() {
                super.onCreate();
                let activity = this;
                this.setContentView(R.layout.sample_base_widget);
                let btnOpenDialog = this.findViewById('btn_open_dialog');
                btnOpenDialog.setOnClickListener({
                    onClick(view) {
                        new AlertDialog.Builder(view.getContext())
                            .setTitle('Title')
                            .setMessage('ContentContent')
                            .setPositiveButton(android.R.string_.ok, {
                            onClick(dialog, which) {
                                Toast.makeText(activity, android.R.string_.ok, Toast.LENGTH_SHORT).show();
                            }
                        })
                            .setIcon(R.image.icon_alert)
                            .setNegativeButton(android.R.string_.cancel, null)
                            .show();
                    }
                });
                let popupContent = new TextView(this);
                popupContent.setGravity(android.view.Gravity.CENTER);
                popupContent.setText('PopupWindow');
                popupContent.setBackgroundColor(0xffcccccc);
                let popWindow = new PopupWindow(popupContent, -2, 40 * this.getResources().getDisplayMetrics().density, true);
                let btnShowPopup = this.findViewById('btn_show_popup');
                btnShowPopup.setOnClickListener({
                    onClick(view) {
                        popWindow.showAsDropDown(view);
                    }
                });
            }
        }
        app.SampleBaseWidgetActivity = SampleBaseWidgetActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var Activity = android.app.Activity;
        var R = sample.app.R;
        class SampleButtonActivity extends Activity {
            onCreate() {
                super.onCreate();
                this.setContentView(R.layout.sample_button);
                let btn_click = this.findViewById('btn_click');
                btn_click.setOnClickListener({
                    onClick(v) {
                        btn_click.setText('Click:' + new Date().getTime() + '');
                    }
                });
                let btn_long_click = this.findViewById('btn_long_click');
                btn_long_click.setOnLongClickListener({
                    onLongClick(v) {
                        btn_long_click.setText('LongClick:' + new Date().getTime() + '');
                        return true;
                    }
                });
            }
        }
        app.SampleButtonActivity = SampleButtonActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
/**
 * Created by linfaxin on 16/1/12.
 */
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var Activity = android.app.Activity;
        var Intent = android.content.Intent;
        var TextView = android.widget.TextView;
        var Button = android.widget.Button;
        var Log = android.util.Log;
        var Gravity = android.view.Gravity;
        const TAG = 'SampleContacteActivity';
        class SampleContacteActivity extends Activity {
            onCreate(savedInstanceState) {
                super.onCreate(savedInstanceState);
                this.setContentView(app.R.layout.sample_contacte);
                this.printTextView = this.findViewById('console_tv');
                const activity = this;
                this.findViewById('open_activity_intent').setOnClickListener({
                    onClick(view) {
                        let intent = new Intent('sample.app.SampleShowIntentActivity').putExtra('startTime', new Date().getTime());
                        activity.startActivity(intent);
                    }
                });
                this.findViewById('open_activity_result').setOnClickListener({
                    onClick(view) {
                        let intent = new Intent('sample.app.SampleResultActivity');
                        activity.startActivityForResult(intent, 1);
                    }
                });
            }
            print(message) {
                Log.d(TAG, message);
                this.printTextView.setText(this.printTextView.getText() + '\n' + message);
            }
            onActivityResult(requestCode, resultCode, data) {
                super.onActivityResult(requestCode, resultCode, data);
                if (resultCode === Activity.RESULT_OK) {
                    if (requestCode === 1) {
                        this.print('resultTime:' + data.getStringExtra('resultTime'));
                    }
                }
            }
        }
        app.SampleContacteActivity = SampleContacteActivity;
        class SampleShowIntentActivity extends Activity {
            onCreate(savedInstanceState) {
                super.onCreate(savedInstanceState);
                let info = new TextView(this);
                info.setText('\n startTime： ' + this.getIntent().getStringExtra('startTime', null));
                this.addContentView(info, new android.widget.FrameLayout.LayoutParams(-2, -2, Gravity.CENTER));
            }
        }
        app.SampleShowIntentActivity = SampleShowIntentActivity;
        class SampleResultActivity extends Activity {
            onCreate(savedInstanceState) {
                super.onCreate(savedInstanceState);
                const activity = this;
                let btn = new Button(this);
                btn.setText('Close & setResult');
                btn.setOnClickListener({
                    onClick(view) {
                        activity.setResult(Activity.RESULT_OK, new Intent().putExtra('resultTime', new Date().getTime() + ''));
                        activity.finish();
                    }
                });
                let params = new android.widget.FrameLayout.LayoutParams(-2, -2, Gravity.CENTER);
                this.setContentView(btn, params);
            }
        }
        app.SampleResultActivity = SampleResultActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var Activity = android.app.Activity;
        var R = sample.app.R;
        class SampleDrawerLayoutActivity extends Activity {
            onCreate() {
                super.onCreate();
                this.setContentView(R.layout.sample_drawerlayout);
            }
        }
        app.SampleDrawerLayoutActivity = SampleDrawerLayoutActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var Activity = android.app.Activity;
        var TextView = android.widget.TextView;
        var View = android.view.View;
        var ExpandableListView = android.widget.ExpandableListView;
        var BaseExpandableListAdapter = android.widget.BaseExpandableListAdapter;
        var R = sample.app.R;
        class SampleExpandableListViewActivity extends Activity {
            onCreate() {
                super.onCreate();
                let listView = new ExpandableListView(this);
                this.setContentView(listView);
                listView.setExpandableAdapter(new MyListAdapter());
                listView.expandGroup(0);
            }
        }
        app.SampleExpandableListViewActivity = SampleExpandableListViewActivity;
        class MyListAdapter extends BaseExpandableListAdapter {
            constructor(...args) {
                super(...args);
                this.data = [
                    { 'name': 'A', 'items': ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'] },
                    { 'name': 'B', 'items': ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10'] },
                    { 'name': 'C', 'items': ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'] },
                    { 'name': 'D', 'items': ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'] },
                    { 'name': 'E', 'items': ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10'] },
                    { 'name': 'F', 'items': ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10'] },
                    { 'name': 'G', 'items': ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10'] },
                    { 'name': 'H', 'items': ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10'] },
                    { 'name': 'I', 'items': ['I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9', 'I10'] },
                    { 'name': 'J', 'items': ['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10'] },
                    { 'name': 'K', 'items': ['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8', 'K9', 'K10'] },
                ];
            }
            getGroupCount() {
                return this.data.length;
            }
            getChildrenCount(groupPosition) {
                return this.data[groupPosition].items.length;
            }
            getGroup(groupPosition) {
                return this.data[groupPosition].name;
            }
            getChild(groupPosition, childPosition) {
                return this.data[groupPosition].items[childPosition];
            }
            getGroupView(groupPosition, isExpanded, convertView, parent) {
                let tv = convertView;
                if (tv == null) {
                    tv = new TextView();
                    const density = android.content.res.Resources.getDisplayMetrics().density;
                    tv.setTextSize(18);
                    tv.setPadding(12 * density, 6 * density, 6 * density, 6 * density);
                    tv.setBackgroundColor(0x88888888);
                }
                tv.setText(this.getGroup(groupPosition));
                return tv;
            }
            getChildView(groupPosition, childPosition, isLastChild, convertView, parent) {
                if (convertView == null) {
                    convertView = View.inflate(parent.getContext(), R.layout.sample_expand_listview_item, null);
                }
                convertView.findViewById('item_child_text').setText(this.getChild(groupPosition, childPosition));
                return convertView;
            }
            getGroupId(groupPosition) {
                return 0;
            }
            getChildId(groupPosition, childPosition) {
                return 0;
            }
            hasStableIds() {
                return false;
            }
            isChildSelectable(groupPosition, childPosition) {
                return false;
            }
        }
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var Activity = android.app.Activity;
        var R = sample.app.R;
        class SampleFrameLayoutActivity extends Activity {
            onCreate() {
                super.onCreate();
                this.setContentView(R.layout.sample_framelayout);
            }
        }
        app.SampleFrameLayoutActivity = SampleFrameLayoutActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
/**
 * Created by linfaxin on 15/10/26.
 */
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var Activity = android.app.Activity;
        var View = android.view.View;
        var BaseAdapter = android.widget.BaseAdapter;
        var R = sample.app.R;
        class SampleGridViewActivity extends Activity {
            onCreate() {
                super.onCreate();
                this.setContentView(R.layout.sample_gridview);
                let listView = this.findViewById('gridView');
                listView.setAdapter(new MyAdapter());
            }
        }
        app.SampleGridViewActivity = SampleGridViewActivity;
        class MyAdapter extends BaseAdapter {
            getView(position, convertView, parent) {
                if (convertView == null) {
                    convertView = View.inflate(parent.getContext(), R.layout.sample_gridview_item, null);
                }
                convertView.findViewById('item_text').setText(this.getItem(position));
                return convertView;
            }
            getCount() {
                return 200;
            }
            getItem(position) {
                return (1 + position) + '/' + this.getCount();
            }
            getItemId(position) {
                return -1;
            }
        }
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var Activity = android.app.Activity;
        var R = sample.app.R;
        class SampleHtmlViewActivity extends Activity {
            onCreate() {
                super.onCreate();
                this.setContentView(R.layout.sample_htmlview);
            }
        }
        app.SampleHtmlViewActivity = SampleHtmlViewActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var Activity = android.app.Activity;
        var R = sample.app.R;
        class SampleImageViewActivity extends Activity {
            onCreate() {
                super.onCreate();
                this.setContentView(R.layout.sample_imageview);
            }
        }
        app.SampleImageViewActivity = SampleImageViewActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
/**
 * Created by linfaxin on 16/1/12.
 */
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var Activity = android.app.Activity;
        var Button = android.widget.Button;
        var Log = android.util.Log;
        var Gravity = android.view.Gravity;
        const TAG = 'SampleLifeCallbackActivity';
        class SampleLifeCallbackActivity extends Activity {
            onCreate(savedInstanceState) {
                super.onCreate(savedInstanceState);
                this.setContentView(app.R.layout.sample_life_callback);
                this.printTextView = this.findViewById('console_tv');
                const activity = this;
                this.findViewById('open_activity_normal').setOnClickListener({
                    onClick(view) {
                        activity.startActivity('sample.app.SampleLifeCallbackNormalActivity');
                    }
                });
                this.findViewById('open_activity_float').setOnClickListener({
                    onClick(view) {
                        activity.startActivity('sample.app.SampleLifeCallbackFloatingActivity');
                    }
                });
                this.print('onCreate');
            }
            print(message) {
                Log.d(TAG, message);
                this.printTextView.setText(this.printTextView.getText() + '\n' + message);
            }
            onStart() {
                super.onStart();
                this.print('onStart');
            }
            onRestart() {
                super.onRestart();
                this.print('onRestart');
            }
            onResume() {
                super.onResume();
                this.print('onResume\n');
            }
            onPause() {
                super.onPause();
                this.print('onPause');
            }
            onStop() {
                super.onStop();
                this.print('onStop');
            }
            onDestroy() {
                super.onDestroy();
                this.print('onDestroy');
            }
        }
        app.SampleLifeCallbackActivity = SampleLifeCallbackActivity;
        class SampleLifeCallbackNormalActivity extends Activity {
            onCreate(savedInstanceState) {
                super.onCreate(savedInstanceState);
                const activity = this;
                let btn = new Button(this);
                btn.setText(android.R.string_.close);
                btn.setOnClickListener({
                    onClick(view) {
                        activity.finish();
                    }
                });
                let params = new android.widget.FrameLayout.LayoutParams(-2, -2, Gravity.CENTER);
                this.setContentView(btn, params);
            }
        }
        app.SampleLifeCallbackNormalActivity = SampleLifeCallbackNormalActivity;
        class SampleLifeCallbackFloatingActivity extends SampleLifeCallbackNormalActivity {
            onCreate(savedInstanceState) {
                super.onCreate(savedInstanceState);
                let density = this.getResources().getDisplayMetrics().density;
                this.getWindow().setFloating(true);
                this.getWindow().setLayout(200 * density, 200 * density);
                this.getWindow().setGravity(Gravity.CENTER);
            }
        }
        app.SampleLifeCallbackFloatingActivity = SampleLifeCallbackFloatingActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var Activity = android.app.Activity;
        var R = sample.app.R;
        class SampleLinearLayoutActivity extends Activity {
            onCreate() {
                super.onCreate();
                this.setContentView(R.layout.sample_linearlayout);
            }
        }
        app.SampleLinearLayoutActivity = SampleLinearLayoutActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var Activity = android.app.Activity;
        var View = android.view.View;
        var BaseAdapter = android.widget.BaseAdapter;
        var R = sample.app.R;
        class SampleListViewActivity extends Activity {
            onCreate() {
                super.onCreate();
                this.setContentView(R.layout.sample_listview);
                let listView = this.findViewById('listView');
                listView.setAdapter(new MyListAdapter());
            }
        }
        app.SampleListViewActivity = SampleListViewActivity;
        class MyListAdapter extends BaseAdapter {
            getView(position, convertView, parent) {
                if (convertView == null) {
                    convertView = View.inflate(parent.getContext(), R.layout.sample_listview_item, null);
                }
                convertView.findViewById('item_text').setText(this.getItem(position));
                return convertView;
            }
            getCount() {
                return 1000;
            }
            getItem(position) {
                return (1 + position) + '/' + this.getCount();
            }
            getItemId(position) {
                return -1;
            }
        }
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var Activity = android.app.Activity;
        var R = sample.app.R;
        class SamplePickerActivity extends Activity {
            onCreate() {
                super.onCreate();
                this.setContentView(R.layout.sample_picker);
            }
        }
        app.SamplePickerActivity = SamplePickerActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var Activity = android.app.Activity;
        var View = android.view.View;
        var BaseAdapter = android.widget.BaseAdapter;
        var PullRefreshLoadLayout = androidui.widget.PullRefreshLoadLayout;
        var R = sample.app.R;
        class SamplePullRefreshLoadActivity extends Activity {
            onCreate() {
                super.onCreate();
                this.setContentView(R.layout.sample_pullrefreshload);
                let listView = this.findViewById('listView');
                let adapter = new MyListAdapter();
                listView.setAdapter(adapter);
                let prll = this.findViewById('prll');
                prll.setRefreshLoadListener({
                    onRefresh(prll) {
                        setTimeout(() => {
                            adapter.data = ['Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item'];
                            adapter.notifyDataSetChanged();
                            prll.setHeaderState(PullRefreshLoadLayout.State_Header_Normal);
                        }, 1000);
                    },
                    onLoadMore(prll) {
                        setTimeout(() => {
                            adapter.data.push('Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item');
                            adapter.notifyDataSetChanged();
                            prll.setFooterState(PullRefreshLoadLayout.State_Footer_Normal);
                        }, 1000);
                    }
                });
            }
        }
        app.SamplePullRefreshLoadActivity = SamplePullRefreshLoadActivity;
        class MyListAdapter extends BaseAdapter {
            constructor(...args) {
                super(...args);
                this.data = [];
            }
            getView(position, convertView, parent) {
                if (convertView == null) {
                    convertView = View.inflate(parent.getContext(), R.layout.sample_pullrefreshload_item, null);
                }
                convertView.findViewById('item_text').setText(this.getItem(position));
                return convertView;
            }
            getCount() {
                return this.data.length;
            }
            getItem(position) {
                return (1 + position) + '. ' + this.data[position];
            }
            getItemId(position) {
                return -1;
            }
        }
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var Activity = android.app.Activity;
        var R = sample.app.R;
        class SampleRelativeLayoutActivity extends Activity {
            onCreate() {
                super.onCreate();
                this.setContentView(R.layout.sample_relativelayout);
            }
        }
        app.SampleRelativeLayoutActivity = SampleRelativeLayoutActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var Activity = android.app.Activity;
        var R = sample.app.R;
        class SampleTextViewActivity extends Activity {
            onCreate() {
                super.onCreate();
                this.setContentView(R.layout.sample_textview);
            }
        }
        app.SampleTextViewActivity = SampleTextViewActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var Activity = android.app.Activity;
        var View = android.view.View;
        var Color = android.graphics.Color;
        var R = sample.app.R;
        class SampleViewPagerActivity extends Activity {
            onCreate() {
                super.onCreate();
                this.setContentView(R.layout.sample_viewpager);
                let viewPager = this.findViewById('viewPager');
                viewPager.setAdapter(new MyPageAdapter());
            }
        }
        app.SampleViewPagerActivity = SampleViewPagerActivity;
        class MyPageAdapter extends com.jakewharton.salvage.RecyclingPagerAdapter {
            getCount() {
                return 100;
            }
            getView(position, convertView, parent) {
                if (convertView == null) {
                    convertView = View.inflate(parent.getContext(), R.layout.sample_viewpager_page, null);
                }
                let page_bg = convertView.findViewById('page_bg');
                let page_text = convertView.findViewById('page_text');
                page_bg.setBackgroundColor(Color.rgb(position * 20 % 200 + 50, position * 20 % 200 + 50, position * 20 % 200 + 50));
                page_text.setText((1 + position) + '/' + this.getCount());
                return convertView;
            }
        }
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var Activity = android.app.Activity;
        var R = sample.app.R;
        class SampleViewPagerGalleryActivity extends Activity {
            onCreate() {
                super.onCreate();
                this.setContentView(R.layout.sample_viewpager_gallery);
            }
        }
        app.SampleViewPagerGalleryActivity = SampleViewPagerGalleryActivity;
    })(app = sample.app || (sample.app = {}));
})(sample || (sample = {}));
//# sourceMappingURL=app.js.map
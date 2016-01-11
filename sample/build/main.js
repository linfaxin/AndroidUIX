///<reference path="../../../dist/android-ui.d.ts"/>
var sample;
(function (sample) {
    var app;
    (function (app) {
        var R;
        (function (R) {
            var image_base64;
            (function (image_base64) {
                var NetImage = androidui.image.NetImage;
                var x3 = {
                    "sample_icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgBAMAAAAQtmoLAAAAG1BMVEUAAAA9PT09PT09PT09PT09PT09PT09PT09PT1gyl+KAAAACXRSTlMAgE05QT1HMyNi/YIlAAAA6ElEQVRYw+3TwQ2CQBRFUaOo6x/AtRILGDvADrQESrAD7VwxQ+4G/I/EhSb/bcmZGzKwiMVise9v084EXTXxoBnZ/hUwa2eBzqyaAONvYEZCAV0Pdjoo7L27DM7Wr9YKBC4yuBKQwJqAAghIgECSAIFyoYIVAQ2cCLjADwCOUgCwtFYJAA5WCwHAcrjYbQ54oBtu9pYDDtgM3w6B5iN45HMJOKDIBxNwQP7DSgIeyIkc8AAJAi4oAMkFJAi4gETyAQkCLuAuBECCgANIJAWQyAEXkEgSIEFAA0USAQvwR2Bi80EsFov98J52GzL3vLeyTQAAAABJRU5ErkJggg=="
                };
                image_base64.sample_icon = new NetImage(x3.sample_icon, 3);
            })(image_base64 = R.image_base64 || (R.image_base64 = {}));
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
            var image;
            (function (image_1) {
                var NetDrawable = androidui.image.NetDrawable;
                class image {
                    static get sample_icon() { return new NetDrawable(R.image_base64.sample_icon); }
                }
                image_1.image = image;
                android.content.res.Resources.buildDrawableFinder = (refString) => {
                    return image[refString];
                };
            })(image = R.image || (R.image = {}));
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
                "sample_animation": "<ScrollView>\n    <LinearLayout\n            android:padding=\"0 6dp\"\n            gravity=\"center\"\n            android:orientation=\"vertical\">\n        <TextView gravity=\"center\">旋转:</TextView>\n        <ImageView\n                id=\"rotate_repeat\"\n                android:src=\"assets/images/logo_android_1@2x.png\"\n                android:layout_width=\"56dp\"\n                android:layout_height=\"56dp\"\n                android:layout_margin=\"20dp 12dp\"\n                ></ImageView>\n        <TextView gravity=\"center\">平移:</TextView>\n        <ImageView\n                id=\"translate_repeat\"\n                android:src=\"assets/images/logo_android_1@2x.png\"\n                android:layout_width=\"56dp\"\n                android:layout_height=\"56dp\"\n                android:layout_margin=\"12dp\"\n                ></ImageView>\n        <TextView gravity=\"center\">缩放:</TextView>\n        <ImageView\n                id=\"scale_repeat\"\n                android:src=\"assets/images/logo_android_1@2x.png\"\n                android:layout_width=\"56dp\"\n                android:layout_height=\"56dp\"\n                android:layout_margin=\"12dp\"\n                ></ImageView>\n        <TextView gravity=\"center\">透明:</TextView>\n        <ImageView\n                id=\"alpha_repeat\"\n                android:src=\"assets/images/logo_android_1@2x.png\"\n                android:layout_width=\"56dp\"\n                android:layout_height=\"56dp\"\n                android:layout_margin=\"12dp\"\n                ></ImageView>\n        <TextView gravity=\"center\">动画组合:</TextView>\n        <ImageView\n                id=\"anim_set\"\n                android:src=\"assets/images/logo_android_1@2x.png\"\n                android:layout_width=\"56dp\"\n                android:layout_height=\"56dp\"\n                android:layout_margin=\"12dp\"\n                ></ImageView>\n    </LinearLayout>\n</ScrollView>",
                "sample_base_widget": "<ScrollView>\n    <LinearLayout\n            android:orientation=\"vertical\"\n            android:padding=\"12dp\"\n            android:gravity=\"center\">\n        <TextView android:layout_width=\"wrap_content\">\n            文本\n        </TextView>\n        <Button android:layout_width=\"wrap_content\">\n            按钮\n        </Button>\n        <ImageView android:src=\"assets/images/logo_google_3.png\">\n        </ImageView>\n        <CheckBox android:layout_width=\"wrap_content\"\n                  android:layout_marginBottom=\"12dp\">\n            复选框\n        </CheckBox>\n        <RadioGroup\n                android:gravity=\"center\"\n                android:orientation=\"HORIZONTAL\"\n                android:layout_marginBottom=\"12dp\">\n            <RadioButton android:layout_width=\"wrap_content\">\n                单选框1\n            </RadioButton>\n            <RadioButton android:layout_width=\"wrap_content\">\n                单选框2\n            </RadioButton>\n            <RadioButton android:layout_width=\"wrap_content\">\n                单选框3\n            </RadioButton>\n        </RadioGroup>\n        <Button id=\"btn_open_dialog\"\n                android:layout_width=\"wrap_content\">\n            打开对话框\n        </Button>\n\n        <ProgressBar android:layout_height=\"wrap_content\"\n                     android:layout_width=\"wrap_content\"\n                     android:layout_marginBottom=\"12dp\"></ProgressBar>\n        <ProgressBar android:layout_height=\"wrap_content\"\n                     android:layout_width=\"match_parent\"\n                     android:layout_marginBottom=\"12dp\"\n                     style=\"@android:attr/progressBarStyleHorizontal\"\n                     android:max=\"100\"\n                     android:progress=\"50\"\n                     android:secondaryProgress=\"70\"></ProgressBar>\n\n        <SeekBar android:layout_height=\"wrap_content\"\n                 android:layout_width=\"match_parent\"\n                 android:layout_marginBottom=\"12dp\"></SeekBar>\n\n        <RatingBar android:layout_height=\"wrap_content\"\n                   android:layout_width=\"wrap_content\"\n                   android:layout_marginBottom=\"12dp\"></RatingBar>\n\n    </LinearLayout>\n</ScrollView>",
                "sample_button": "<ScrollView>\n    <LinearLayout\n            android:orientation=\"vertical\"\n            android:gravity=\"center\">\n        <Button\n                android:layout_width=\"wrap_content\">\n            普通-按钮\n        </Button>\n        <Button\n                android:layout_width=\"wrap_content\"\n                android:enabled=\"false\">\n            Disable按钮\n        </Button>\n        <Button id=\"btn_click\">\n            点击没有300msDelay\n        </Button>\n        <Button id=\"btn_long_click\">\n            长按LongClick\n        </Button>\n        <Button android:layout_width=\"wrap_content\"\n                onclick=\"this.AndroidView.setText('点击:'+new Date().getTime());\">\n            也可以用onclick属性/addEventListener设置监听\n        </Button>\n\n        <Button\n                android:style=\"@style/btn_custom1\"\n                >\n            引用样式\n        </Button>\n        <Button\n                android:style=\"@style/btn_custom1\"\n                android:enabled=\"false\"\n                >\n            引用样式Disable\n        </Button>\n        <Button\n                android:padding=\"8dp\"\n                android:layout_margin=\"6dp\"\n                android:textColor=\"@color/white\"\n                android:background=\"#f00\"\n                android:state_pressed=\"@style/btn_custom1/pressed\"\n                >\n            引用状态样式\n        </Button>\n        <Button\n                android:padding=\"8dp\"\n                android:layout_margin=\"6dp\"\n                android:textColor=\"@color/white\"\n                android:background=\"#f00\"\n                android:state_pressed=\"background:#f66;\"\n                >\n            内联状态样式\n        </Button>\n    </LinearLayout>\n</ScrollView>",
                "sample_drawerlayout": "<android.support.v4.widget.DrawerLayout>\n    <LinearLayout\n            android:orientation=\"vertical\"\n            android:gravity=\"center\"\n            android:layout_height=\"match_parent\"\n            android:layout_width=\"match_parent\">\n        <Button\n                onclick=\"this.AndroidView.getParent().getParent().openDrawer(android.view.Gravity.LEFT);\"\n                android:layout_height=\"wrap_content\"\n                android:layout_width=\"wrap_content\"\n                >打开左抽屉</Button>\n        <Button\n                onclick=\"this.AndroidView.getParent().getParent().openDrawer(android.view.Gravity.RIGHT);\"\n                android:layout_height=\"wrap_content\"\n                android:layout_width=\"wrap_content\"\n                >打开右抽屉</Button>\n    </LinearLayout>\n    <LinearLayout\n            android:layout_gravity=\"left\"\n            android:background=\"white\"\n            android:clickable=\"true\"\n            android:layout_height=\"match_parent\"\n            android:layout_width=\"220dp\">\n        <TextView\n                android:layout_height=\"match_parent\"\n                android:layout_width=\"match_parent\"\n                android:gravity=\"center\"\n                >左抽屉</TextView>\n    </LinearLayout>\n    <LinearLayout\n            android:layout_gravity=\"right\"\n            android:background=\"white\"\n            android:clickable=\"true\"\n            android:layout_height=\"match_parent\"\n            android:layout_width=\"220dp\">\n        <TextView\n                android:layout_height=\"match_parent\"\n                android:layout_width=\"match_parent\"\n                android:gravity=\"center\"\n                >右抽屉</TextView>\n    </LinearLayout>\n</android.support.v4.widget.DrawerLayout>",
                "sample_expand_listview_item": "<FrameLayout id=\"item_child_layout\"\n             android:layout_width=\"match_parent\"\n             android:padding=\"12dp\">\n    <TextView id=\"item_child_text\"\n              android:padding=\"12dp\"\n              android:layout_width=\"wrap_content\"\n              android:layout_height=\"wrap_content\"\n              android:background=\"#55000000\"\n              android:textColor=\"white\"\n              android:layout_gravity=\"center\"\n            >\n    </TextView>\n</FrameLayout>",
                "sample_framelayout": "<FrameLayout>\n\n    <TextView\n            android:text=\"文本\"\n            android:layout_gravity=\"left|top\"\n            android:style=\"@style/textStyle\"\n            ></TextView>\n    <TextView\n            android:text=\"文本\"\n            android:layout_gravity=\"right|top\"\n            android:style=\"@style/textStyle\"\n            ></TextView>\n    <TextView\n            android:text=\"文本\"\n            android:layout_gravity=\"bottom|right\"\n            android:style=\"@style/textStyle\"\n            ></TextView>\n    <TextView\n            android:text=\"文本\"\n            android:layout_gravity=\"bottom|left\"\n            android:style=\"@style/textStyle\"\n            ></TextView>\n    <TextView\n            android:text=\"文本\"\n            android:layout_gravity=\"center\"\n            android:style=\"@style/textStyle\"\n            ></TextView>\n    <TextView\n            android:text=\"文本\"\n            android:layout_gravity=\"left|center_vertical\"\n            android:style=\"@style/textStyle\"\n            ></TextView>\n    <TextView\n            android:text=\"文本\"\n            android:layout_gravity=\"right|center_vertical\"\n            android:style=\"@style/textStyle\"\n            ></TextView>\n    <TextView\n            android:text=\"文本\"\n            android:layout_gravity=\"top|center_horizontal\"\n            android:style=\"@style/textStyle\"\n            ></TextView>\n    <TextView\n            android:text=\"文本\"\n            android:layout_gravity=\"bottom|center_horizontal\"\n            android:style=\"@style/textStyle\"\n            ></TextView>\n    <TextView\n            android:text=\"文本MarginBottom50\"\n            android:layout_marginBottom=\"50dp\"\n            android:layout_gravity=\"center\"\n            android:style=\"@style/textStyle\"\n            ></TextView>\n</FrameLayout>",
                "sample_gridview": "<FrameLayout>\n    <GridView id=\"gridView\"\n              android:numColumns=\"2\">\n    </GridView>\n    <TextView\n            android:padding=\"12dp\"\n            android:layout_gravity=\"bottom\"\n            android:layout_height=\"wrap_content\"\n            android:textColor=\"white\"\n            android:background=\"rgba(0, 0, 0, 0.7)\"\n            >\n        GridView使用Adapter机制,移出屏幕的条目可以被回收再用,因此不用担心条目太多的内存问题\n    </TextView>\n</FrameLayout>",
                "sample_gridview_item": "<FrameLayout id=\"item_layout\"\n             android:layout_width=\"match_parent\"\n             android:padding=\"32dp\">\n    <TextView id=\"item_text\"\n              android:padding=\"16dp\"\n              android:layout_width=\"wrap_content\"\n              android:layout_height=\"wrap_content\"\n              android:background=\"#55000000\"\n              android:textColor=\"white\"\n              android:layout_gravity=\"center\"\n            >\n    </TextView>\n</FrameLayout>",
                "sample_htmlview": "<ScrollView android:fillViewport=\"true\">\n    <LinearLayout\n            android:orientation=\"vertical\">\n        <HtmlView>\n            <p style=\"font-size: 24px;text-align: center\">HtmlView</p>\n        </HtmlView>\n        <HtmlView style=\"padding:0 20px;box-sizing: border-box;line-height: 20px;\">\n            <p>HtmlView使用浏览器<span style=\"color: red;font-weight: bold;\">DOM</span>渲染, 可与Android的View混用, 但因为DOM的性能差, 会影响移动端流畅度.不提倡使用</p>\n            <p>HtmlView在Canvas DOM之上, 即会盖在所有Android的View之上.</p>\n        </HtmlView>\n        <TextView android:gravity=\"center\">TextView</TextView>\n        <HtmlView style=\"overflow: visible;text-align: center;\">\n            <input style=\"font-size: 16px;text-align: center;box-shadow: 0 0 1px black;margin: 12px 0; padding: 6px;\" placeholder=\"请输入\"/>\n        </HtmlView>\n    </LinearLayout>\n</ScrollView>",
                "sample_imageview": "<ScrollView>\n    <LinearLayout\n            android:padding=\"0 6dp\"\n            android:orientation=\"vertical\">\n        <TextView>自适应高宽:</TextView>\n        <ImageView\n                android:src=\"assets/images/logo_android_1@2x.png\"\n                android:style=\"@style/imageStyle\"\n                ></ImageView>\n        <TextView>FitCenter(默认ScaleType):</TextView>\n        <LinearLayout>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:layout_height=\"200dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:layout_width=\"match_parent\"\n                    android:layout_marginLeft=\"4dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n        </LinearLayout>\n        <TextView>FitStart:</TextView>\n        <LinearLayout>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"fitStart\"\n                    android:layout_height=\"200dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"fitStart\"\n                    android:layout_width=\"match_parent\"\n                    android:layout_marginLeft=\"4dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n        </LinearLayout>\n        <TextView>FitEnd:</TextView>\n        <LinearLayout>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"fitEnd\"\n                    android:layout_height=\"200dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"fitEnd\"\n                    android:layout_width=\"match_parent\"\n                    android:layout_marginLeft=\"4dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n        </LinearLayout>\n        <TextView>FitXy:</TextView>\n        <LinearLayout>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"fitXy\"\n                    android:layout_height=\"200dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"fitXy\"\n                    android:layout_width=\"match_parent\"\n                    android:layout_marginLeft=\"4dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n        </LinearLayout>\n        <TextView>Center:</TextView>\n        <LinearLayout>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"center\"\n                    android:layout_height=\"80dp\"\n                    android:layout_width=\"80dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"center\"\n                    android:layout_height=\"180dp\"\n                    android:layout_width=\"180dp\"\n                    android:layout_marginLeft=\"4dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n        </LinearLayout>\n        <TextView>centerCrop:</TextView>\n        <LinearLayout>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"centerCrop\"\n                    android:layout_height=\"80dp\"\n                    android:layout_width=\"80dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"centerCrop\"\n                    android:layout_marginLeft=\"4dp\"\n                    android:layout_height=\"100dp\"\n                    android:layout_width=\"60dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"centerCrop\"\n                    android:layout_height=\"60dp\"\n                    android:layout_width=\"100dp\"\n                    android:layout_marginLeft=\"4dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n        </LinearLayout>\n        <TextView>centerInside:</TextView>\n        <LinearLayout>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"centerInside\"\n                    android:layout_height=\"80dp\"\n                    android:layout_width=\"80dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n            <ImageView\n                    android:src=\"assets/images/logo_android_1@2x.png\"\n                    android:scaleType=\"centerInside\"\n                    android:layout_height=\"180dp\"\n                    android:layout_width=\"180dp\"\n                    android:layout_marginLeft=\"4dp\"\n                    android:style=\"@style/imageStyle\"\n                    ></ImageView>\n        </LinearLayout>\n\n        <TextView>Background:</TextView>\n        <FrameLayout\n                android:style=\"@style/imageStyle\"\n                android:backgroundUri=\"assets/images/logo_android_1@2x.png\"\n                ></FrameLayout>\n\n    </LinearLayout>\n</ScrollView>",
                "sample_linearlayout": "<LinearLayout\n        android:gravity=\"center_vertical\"\n        android:orientation=\"vertical\">\n\n    <LinearLayout\n            android:orientation=\"vertical\">\n        <TextView\n                android:text=\"垂直线性布局\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <TextView\n                android:text=\"垂直线性布局\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n\n    </LinearLayout>\n    <LinearLayout\n            android:layout_marginTop=\"12dp\"\n            android:gravity=\"center\"\n            android:orientation=\"vertical\">\n        <TextView\n                android:text=\"垂直线性布局-居中\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <TextView\n                android:text=\"垂直线性布局-居中\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n\n    </LinearLayout>\n\n    <LinearLayout\n            android:layout_marginTop=\"12dp\"\n            android:orientation=\"horizontal\">\n        <TextView\n                android:text=\"水平\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <TextView\n                android:text=\"线性\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <TextView\n                android:text=\"布局\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n\n    </LinearLayout>\n    <LinearLayout\n            android:layout_marginTop=\"12dp\"\n            android:gravity=\"center\"\n            android:orientation=\"horizontal\">\n        <TextView\n                android:text=\"水平\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <TextView\n                android:text=\"线性\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <TextView\n                android:text=\"布局\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <TextView\n                android:text=\"-居中\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n\n    </LinearLayout>\n    <LinearLayout\n            android:layout_marginTop=\"12dp\"\n            android:gravity=\"right\"\n            android:orientation=\"horizontal\">\n        <TextView\n                android:text=\"水平\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <TextView\n                android:text=\"线性\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <TextView\n                android:text=\"布局\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <TextView\n                android:text=\"-居右\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n\n    </LinearLayout>\n\n    <TextView\n            android:layout_marginTop=\"12dp\"\n            android:gravity=\"center\"\n            android:text=\"更多用法请看官方文档\"\n            ></TextView>\n\n</LinearLayout>",
                "sample_listview": "<FrameLayout>\n    <ListView id=\"listView\">\n    </ListView>\n    <TextView\n            android:padding=\"12dp\"\n            android:layout_gravity=\"bottom\"\n            android:layout_height=\"wrap_content\"\n            android:textColor=\"white\"\n            android:background=\"rgba(0, 0, 0, 0.7)\"\n            >\n        ListView使用Adapter机制,移出屏幕的条目可以被回收再用,因此不用担心条目太多的内存问题\n    </TextView>\n</FrameLayout>",
                "sample_listview_item": "<FrameLayout id=\"item_layout\"\n             android:layout_width=\"match_parent\"\n             android:padding=\"32dp\">\n    <TextView id=\"item_text\"\n              android:padding=\"16dp\"\n              android:layout_width=\"wrap_content\"\n              android:layout_height=\"wrap_content\"\n              android:background=\"#55000000\"\n              android:textColor=\"white\"\n              android:layout_gravity=\"center\"\n            >\n    </TextView>\n</FrameLayout>",
                "sample_picker": "<LinearLayout\n        android:orientation=\"vertical\"\n        android:gravity=\"center\">\n    <NumberPicker id=\"picker\"\n                  android:layout_height=\"280dp\"\n                  android:itemCount=\"5\"\n                  android:minValue=\"1\"\n                  android:maxValue=\"9\"\n            >\n        <androidui.widget.HtmlDataPickerAdapter>\n            <item>1</item>\n            <item>2</item>\n            <item>3</item>\n            <item>4</item>\n            <item>5</item>\n            <item>6</item>\n            <item>7</item>\n            <item>8</item>\n            <item>9</item>\n        </androidui.widget.HtmlDataPickerAdapter>\n    </NumberPicker>\n</LinearLayout>",
                "sample_pullrefreshload": "<androidui.widget.PullRefreshLoadLayout\n        id=\"prll\"\n        android:layout_width=\"match_parent\"\n        android:layout_height=\"match_parent\">\n    <ListView id=\"listView\">\n    </ListView>\n</androidui.widget.PullRefreshLoadLayout>",
                "sample_pullrefreshload_item": "<FrameLayout id=\"item_layout\"\n             android:layout_width=\"match_parent\"\n             android:padding=\"32dp\">\n    <TextView id=\"item_text\"\n              android:padding=\"16dp\"\n              android:layout_width=\"wrap_content\"\n              android:layout_height=\"wrap_content\"\n              android:background=\"#55000000\"\n              android:textColor=\"white\"\n              android:layout_gravity=\"center\"\n            >\n    </TextView>\n</FrameLayout>",
                "sample_relativelayout": "<RelativeLayout>\n    <TextView id=\"text1\"\n              android:style=\"@style/textStyle\"\n              android:text=\"左上角\"\n            ></TextView>\n    <TextView id=\"text2\"\n              android:style=\"@style/textStyle\"\n              android:text=\"右上角\"\n              android:layout_alignParentRight=\"true\"\n            ></TextView>\n    <TextView id=\"text3\"\n              android:style=\"@style/textStyle\"\n              android:text=\"左下角\"\n              android:layout_alignParentBottom=\"true\"\n            ></TextView>\n    <TextView id=\"text4\"\n              android:style=\"@style/textStyle\"\n              android:text=\"右下角\"\n              android:layout_alignParentRight=\"true\"\n              android:layout_alignParentBottom=\"true\"\n            ></TextView>\n    <TextView id=\"text5\"\n              android:style=\"@style/textStyle\"\n              android:text=\"垂直居中\"\n              android:layout_centerVertical=\"true\"\n            ></TextView>\n    <TextView id=\"text6\"\n              android:style=\"@style/textStyle\"\n              android:text=\"水平居中\"\n              android:layout_centerHorizontal=\"true\"\n            ></TextView>\n    <TextView id=\"text7\"\n              android:style=\"@style/textStyle\"\n              android:text=\"垂直水平居中\"\n              android:layout_centerInParent=\"true\"\n            ></TextView>\n\n    <TextView\n            android:style=\"@style/textStyle\"\n            android:text=\"below\"\n            android:layout_marginTop=\"4dp\"\n            android:layout_below=\"text1\"\n            ></TextView>\n\n    <TextView\n              android:style=\"@style/textStyle\"\n              android:text=\"toRightOf\"\n              android:layout_marginLeft=\"4dp\"\n              android:layout_toRightOf=\"text3\"\n              android:layout_alignParentBottom=\"true\"\n            ></TextView>\n    <TextView\n              android:style=\"@style/textStyle\"\n              android:text=\"above\"\n              android:layout_marginBottom=\"4dp\"\n              android:layout_above=\"text3\"\n            ></TextView>\n    <TextView\n              android:style=\"@style/textStyle\"\n              android:text=\"toLeftOf\"\n              android:layout_marginRight=\"4dp\"\n              android:layout_toLeftOf=\"text4\"\n              android:layout_alignParentBottom=\"true\"\n            ></TextView>\n\n    <TextView\n            id=\"alignLeft\"\n              android:style=\"@style/textStyle\"\n              android:text=\"  alignLeft  \"\n              android:layout_marginTop=\"4dp\"\n              android:layout_alignLeft=\"text6\"\n              android:layout_below=\"text2\"\n            ></TextView>\n    <TextView\n              android:style=\"@style/textStyle\"\n              android:text=\"  alignRight  \"\n              android:layout_marginTop=\"4dp\"\n              android:layout_alignRight=\"text6\"\n              android:layout_below=\"alignLeft\"\n            ></TextView>\n    <TextView\n            id=\"alignTop\"\n              android:style=\"@style/textStyle\"\n              android:text=\"alignTop\"\n              android:maxWidth=\"46dp\"\n              android:layout_marginLeft=\"4dp\"\n              android:layout_alignTop=\"text7\"\n              android:layout_toRightOf=\"text7\"\n            ></TextView>\n    <TextView\n              android:style=\"@style/textStyle\"\n              android:text=\"alignBottom\"\n              android:maxWidth=\"52dp\"\n              android:layout_marginLeft=\"4dp\"\n              android:layout_alignBottom=\"text7\"\n              android:layout_toRightOf=\"alignTop\"\n            ></TextView>\n    <TextView\n              android:style=\"@style/textStyle\"\n              android:text=\"above&toLeftOf\"\n              android:layout_above=\"text7\"\n              android:layout_toLeftOf=\"text7\"\n            ></TextView>\n    <TextView\n              android:style=\"@style/textStyle\"\n              android:text=\"toRightOf & toLeftOf & below\"\n              android:layout_below=\"text7\"\n              android:layout_toLeftOf=\"text7\"\n              android:layout_toRightOf=\"text5\"\n            ></TextView>\n</RelativeLayout>",
                "sample_textview": "<ScrollView>\n    <LinearLayout\n            android:orientation=\"vertical\">\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:text=\"文本\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:padding=\"10dp\"\n                android:text=\"文本Padding10\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:padding=\"10dp\"\n                android:text=\"Line1\nLine2\nLine3\nLine4\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:maxLines=\"2\"\n                android:ellipsize=\"END\"\n                android:padding=\"10dp\"\n                android:text=\"maxLines=2\nmaxLines=2\nmaxLines=2\nmaxLines=2\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:layout_width=\"match_parent\"\n                android:padding=\"10dp\"\n                android:gravity=\"center\"\n                android:text=\"文本居中\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:minLines=\"2\"\n                android:layout_width=\"match_parent\"\n                android:padding=\"10dp\"\n                android:gravity=\"center\"\n                android:text=\"文本居中minLines=2\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:layout_width=\"match_parent\"\n                android:padding=\"10dp\"\n                android:gravity=\"right\"\n                android:text=\"文本居右\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:layout_height=\"100dp\"\n                android:layout_width=\"match_parent\"\n                android:padding=\"10dp\"\n                android:gravity=\"center\"\n                android:text=\"文本居中\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:layout_height=\"100dp\"\n                android:layout_width=\"match_parent\"\n                android:padding=\"10dp\"\n                android:gravity=\"bottom\"\n                android:text=\"文本居下\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:layout_height=\"100dp\"\n                android:layout_width=\"match_parent\"\n                android:padding=\"10dp\"\n                android:gravity=\"center_vertical\"\n                android:text=\"文本垂直居中\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:layout_height=\"100dp\"\n                android:layout_width=\"match_parent\"\n                android:padding=\"10dp\"\n                android:gravity=\"center_horizontal\"\n                android:text=\"文本水平居中\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:layout_height=\"100dp\"\n                android:layout_width=\"match_parent\"\n                android:padding=\"10dp\"\n                android:gravity=\"right|bottom\"\n                android:text=\"文本居右居下\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n        <View android:style=\"@style/line_spit\"></View>\n        <TextView\n                android:layout_height=\"wrap_content\"\n                android:layout_width=\"wrap_content\"\n                android:padding=\"10dp\"\n                android:gravity=\"center\"\n                android:drawablePadding=\"12dp\"\n                android:drawableLeftUri=\"assets/images/logo_android_1@2x.png\"\n                android:drawableTopUri=\"assets/images/logo_android_1@2x.png\"\n                android:drawableRightUri=\"assets/images/logo_android_1@2x.png\"\n                android:drawableBottomUri=\"assets/images/logo_android_1@2x.png\"\n                android:text=\"文本四周可以设置图片\"\n                android:style=\"@style/textStyle\"\n                ></TextView>\n    </LinearLayout>\n</ScrollView>",
                "sample_viewpager": "<FrameLayout>\n    <android.support.v4.view.ViewPager id=\"viewPager\">\n    </android.support.v4.view.ViewPager>\n    <TextView\n            android:padding=\"12dp\"\n            android:layout_gravity=\"bottom\"\n            android:layout_height=\"wrap_content\"\n            android:background=\"#55000000\"\n            android:textColor=\"white\"\n            >\n        ViewPager使用Adapter机制,移出屏幕的页卡可以被回收再用,因此不用担心页卡太多的内存问题\n    </TextView>\n</FrameLayout>",
                "sample_viewpager_gallery": "<FrameLayout>\n    <android.support.v4.view.ViewPager\n            android:background=\"#88000000\"\n            >\n        <androidui.widget.HtmlDataPagerAdapter>\n            <uk.co.senab.photoview.PhotoView\n                    android:src=\"assets/images/logo_android_3.png\">\n            </uk.co.senab.photoview.PhotoView>\n            <uk.co.senab.photoview.PhotoView\n                    android:src=\"assets/images/logo_android_2.png\">\n            </uk.co.senab.photoview.PhotoView>\n            <uk.co.senab.photoview.PhotoView\n                    android:src=\"assets/images/logo_google_1.jpg\">\n            </uk.co.senab.photoview.PhotoView>\n            <uk.co.senab.photoview.PhotoView\n                    android:src=\"assets/images/logo_google_2.png\">\n            </uk.co.senab.photoview.PhotoView>\n        </androidui.widget.HtmlDataPagerAdapter>\n    </android.support.v4.view.ViewPager>\n    <LinearLayout\n            android:padding=\"4dp 12dp\"\n            android:layout_gravity=\"bottom\"\n            android:layout_height=\"wrap_content\"\n            android:background=\"#55000000\"\n            >\n        <TextView android:textColor=\"white\">\n            支持双击&双指缩放手势, 移植自\n        </TextView>\n        <TextView android:textColor=\"#990000FF\" android:padding=\"4dp\"\n                  android:state_pressed=\"background:#33ffffff\"\n                onclick=\"location.href = 'https://github.com/chrisbanes/PhotoView'\">\n            PhotoView\n        </TextView>\n    </LinearLayout>\n</FrameLayout>",
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
            layout.sample_drawerlayout = '@layout/sample_drawerlayout';
            layout.sample_expand_listview_item = '@layout/sample_expand_listview_item';
            layout.sample_framelayout = '@layout/sample_framelayout';
            layout.sample_gridview = '@layout/sample_gridview';
            layout.sample_gridview_item = '@layout/sample_gridview_item';
            layout.sample_htmlview = '@layout/sample_htmlview';
            layout.sample_imageview = '@layout/sample_imageview';
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
var sample;
(function (sample) {
    var app;
    (function (app) {
        var Activity = android.app.Activity;
        var AlertDialog = android.app.AlertDialog;
        var NetDrawable = androidui.image.NetDrawable;
        var Toast = android.widget.Toast;
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
                            .setTitle('标题')
                            .setMessage('内容内容\n*支持后退按钮关闭对话框:)')
                            .setPositiveButton(android.R.string_.ok, {
                            onClick(dialog, which) {
                                Toast.makeText(activity, '按下确定', Toast.LENGTH_SHORT).show();
                            }
                        })
                            .setIcon(new NetDrawable('assets/images/logo_android_1@2x.png'))
                            .setNegativeButton(android.R.string_.cancel, null)
                            .show();
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
                this.setContentView(R.layout.sample_button);
                let btn_click = this.findViewById('btn_click');
                btn_click.setOnClickListener({
                    onClick(v) {
                        btn_click.setText('点击:' + new Date().getTime() + '');
                    }
                });
                let btn_long_click = this.findViewById('btn_long_click');
                btn_long_click.setOnLongClickListener({
                    onLongClick(v) {
                        btn_long_click.setText('长按:' + new Date().getTime() + '');
                        return true;
                    }
                });
            }
        }
        app.SampleButtonActivity = SampleButtonActivity;
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

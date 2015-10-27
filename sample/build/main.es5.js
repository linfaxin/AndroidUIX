///<reference path="../../dist/android-web-widget.d.ts"/>
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Activity = android.app.Activity;
var TextView = android.widget.TextView;
var LinearLayout = android.widget.LinearLayout;
var Gravity = android.view.Gravity;
var Log = android.util.Log;
var sample;
(function (sample) {
    var activity;
    (function (activity) {
        var TextViewSampleActivity = (function (_Activity) {
            _inherits(TextViewSampleActivity, _Activity);

            function TextViewSampleActivity() {
                _classCallCheck(this, TextViewSampleActivity);

                _get(Object.getPrototypeOf(TextViewSampleActivity.prototype), "constructor", this).apply(this, arguments);
            }

            _createClass(TextViewSampleActivity, [{
                key: "onCreate",
                value: function onCreate() {
                    var linear = this.findViewById("linear");
                    linear.setOrientation(LinearLayout.VERTICAL);
                    var textView0 = this.findViewById("text0");
                    var textView1 = this.findViewById("text1");
                    var textView2 = this.findViewById("text2");
                    var textView3 = this.findViewById("text3");
                    textView0.getLayoutParams().height = -2;
                    textView0.getLayoutParams().width = -2;
                    textView0.setPadding(20, 20, 20, 20);
                    textView1.getLayoutParams().height = -2;
                    textView1.getLayoutParams().width = 200;
                    textView1.setMaxLines(3);
                    textView1.setPadding(20, 20, 20, 20);
                    textView1.setGravity(Gravity.RIGHT);
                    textView2.getLayoutParams().height = 100;
                    textView2.setPadding(20, 20, 20, 20);
                    textView2.setGravity(Gravity.RIGHT | Gravity.BOTTOM);
                    textView3.getLayoutParams().height = 100;
                    textView3.getLayoutParams().width = -2;
                    textView3.setPadding(20, 20, 20, 20);
                    textView3.setGravity(Gravity.CENTER);
                }
            }]);

            return TextViewSampleActivity;
        })(Activity);

        activity.TextViewSampleActivity = TextViewSampleActivity;
        TextViewSampleActivity.registerCustomElement();
    })(activity = sample.activity || (sample.activity = {}));
})(sample || (sample = {}));
///<reference path="../dist/android-web-widget.d.ts"/>
///<reference path="activity/TextViewSampleActivity.ts"/>

//# sourceMappingURL=main.es5.js.map
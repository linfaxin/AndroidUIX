/**
 * Created by linfaxin on 15/10/26.
 */
///<reference path="../../dist/android-ui.d.ts"/>
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var sample;
(function (sample) {
    var activity;
    (function (activity) {
        var Activity = android.app.Activity;

        var SampleButtonActivity = (function (_Activity) {
            _inherits(SampleButtonActivity, _Activity);

            function SampleButtonActivity() {
                _classCallCheck(this, SampleButtonActivity);

                _get(Object.getPrototypeOf(SampleButtonActivity.prototype), 'constructor', this).apply(this, arguments);
            }

            _createClass(SampleButtonActivity, [{
                key: 'onCreate',
                value: function onCreate() {
                    var btn_click = this.findViewById('btn_click');
                    btn_click.setOnClickListener({
                        onClick: function onClick(v) {
                            btn_click.setText('点击:' + new Date().getTime() + '');
                        }
                    });
                    var btn_long_click = this.findViewById('btn_long_click');
                    btn_long_click.setOnLongClickListener({
                        onLongClick: function onLongClick(v) {
                            btn_long_click.setText('长按:' + new Date().getTime() + '');
                            return true;
                        }
                    });
                }
            }]);

            return SampleButtonActivity;
        })(Activity);

        activity.SampleButtonActivity = SampleButtonActivity;
        SampleButtonActivity.registerCustomElement();
    })(activity = sample.activity || (sample.activity = {}));
})(sample || (sample = {}));
/**
 * Created by linfaxin on 15/10/26.
 */
///<reference path="../../dist/android-ui.d.ts"/>
var sample;
(function (sample) {
    var activity;
    (function (activity) {
        var Activity = android.app.Activity;
        var View = android.view.View;
        var Color = android.graphics.Color;

        var SampleViewPagerActivity = (function (_Activity2) {
            _inherits(SampleViewPagerActivity, _Activity2);

            function SampleViewPagerActivity() {
                _classCallCheck(this, SampleViewPagerActivity);

                _get(Object.getPrototypeOf(SampleViewPagerActivity.prototype), 'constructor', this).apply(this, arguments);
            }

            _createClass(SampleViewPagerActivity, [{
                key: 'onCreate',
                value: function onCreate() {
                    var viewPager = this.findViewById('viewPager');
                    viewPager.setAdapter(new MyPageAdapter());
                }
            }]);

            return SampleViewPagerActivity;
        })(Activity);

        activity.SampleViewPagerActivity = SampleViewPagerActivity;
        SampleViewPagerActivity.registerCustomElement();

        var MyPageAdapter = (function (_com$jakewharton$salvage$RecyclingPagerAdapter) {
            _inherits(MyPageAdapter, _com$jakewharton$salvage$RecyclingPagerAdapter);

            function MyPageAdapter() {
                _classCallCheck(this, MyPageAdapter);

                _get(Object.getPrototypeOf(MyPageAdapter.prototype), 'constructor', this).apply(this, arguments);
            }

            _createClass(MyPageAdapter, [{
                key: 'getCount',
                value: function getCount() {
                    return 100;
                }
            }, {
                key: 'getView',
                value: function getView(position, convertView, parent) {
                    if (convertView == null) {
                        convertView = View.inflate('@layout/page', parent.rootElement);
                    }
                    var page_bg = convertView.findViewById('page_bg');
                    var page_text = convertView.findViewById('page_text');
                    page_bg.setBackgroundColor(Color.rgb(position * 20 % 200 + 50, position * 20 % 200 + 50, position * 20 % 200 + 50));
                    page_text.setText(1 + position + '/' + this.getCount());
                    return convertView;
                }
            }]);

            return MyPageAdapter;
        })(com.jakewharton.salvage.RecyclingPagerAdapter);
    })(activity = sample.activity || (sample.activity = {}));
})(sample || (sample = {}));
/**
 * Created by linfaxin on 15/10/26.
 */
///<reference path="../../dist/android-ui.d.ts"/>
var sample;
(function (sample) {
    var activity;
    (function (activity) {
        var Activity = android.app.Activity;
        var View = android.view.View;
        var BaseAdapter = android.widget.BaseAdapter;

        var SampleListViewActivity = (function (_Activity3) {
            _inherits(SampleListViewActivity, _Activity3);

            function SampleListViewActivity() {
                _classCallCheck(this, SampleListViewActivity);

                _get(Object.getPrototypeOf(SampleListViewActivity.prototype), 'constructor', this).apply(this, arguments);
            }

            _createClass(SampleListViewActivity, [{
                key: 'onCreate',
                value: function onCreate() {
                    var listView = this.findViewById('listView');
                    listView.setAdapter(new MyListAdapter());
                }
            }]);

            return SampleListViewActivity;
        })(Activity);

        activity.SampleListViewActivity = SampleListViewActivity;
        SampleListViewActivity.registerCustomElement();

        var MyListAdapter = (function (_BaseAdapter) {
            _inherits(MyListAdapter, _BaseAdapter);

            function MyListAdapter() {
                _classCallCheck(this, MyListAdapter);

                _get(Object.getPrototypeOf(MyListAdapter.prototype), 'constructor', this).apply(this, arguments);
            }

            _createClass(MyListAdapter, [{
                key: 'getView',
                value: function getView(position, convertView, parent) {
                    if (convertView == null) {
                        convertView = View.inflate('@layout/item', parent.rootElement);
                    }
                    convertView.findViewById('item_text').setText(this.getItem(position));
                    return convertView;
                }
            }, {
                key: 'getCount',
                value: function getCount() {
                    return 200;
                }
            }, {
                key: 'getItem',
                value: function getItem(position) {
                    return 1 + position + '/' + this.getCount();
                }
            }, {
                key: 'getItemId',
                value: function getItemId(position) {
                    return -1;
                }
            }]);

            return MyListAdapter;
        })(BaseAdapter);
    })(activity = sample.activity || (sample.activity = {}));
})(sample || (sample = {}));
///<reference path="../dist/android-ui.d.ts"/>
///<reference path="activity/SampleButtonActivity.ts"/>
///<reference path="activity/SampleViewPagerActivity.ts"/>
///<reference path="activity/SampleListViewActivity.ts"/>

var A = function A() {
    _classCallCheck(this, A);
};

var B = function B() {
    _classCallCheck(this, B);

    this.A_this.a = '';
};

//# sourceMappingURL=main.es5.js.map
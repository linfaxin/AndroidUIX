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
        var TextView = android.widget.TextView;
        var View = android.view.View;
        var BaseExpandableListAdapter = android.widget.BaseExpandableListAdapter;

        var SampleExpandableListViewActivity = (function (_Activity2) {
            _inherits(SampleExpandableListViewActivity, _Activity2);

            function SampleExpandableListViewActivity() {
                _classCallCheck(this, SampleExpandableListViewActivity);

                _get(Object.getPrototypeOf(SampleExpandableListViewActivity.prototype), 'constructor', this).apply(this, arguments);
            }

            _createClass(SampleExpandableListViewActivity, [{
                key: 'onCreate',
                value: function onCreate() {
                    var listView = this.findViewById('listView');
                    listView.setExpandableAdapter(new MyListAdapter());
                    listView.expandGroup(0);
                }
            }]);

            return SampleExpandableListViewActivity;
        })(Activity);

        activity.SampleExpandableListViewActivity = SampleExpandableListViewActivity;
        SampleExpandableListViewActivity.registerCustomElement();

        var MyListAdapter = (function (_BaseExpandableListAdapter) {
            _inherits(MyListAdapter, _BaseExpandableListAdapter);

            function MyListAdapter() {
                _classCallCheck(this, MyListAdapter);

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                _get(Object.getPrototypeOf(MyListAdapter.prototype), 'constructor', this).apply(this, args);
                this.data = [{ 'name': 'A', 'items': ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'] }, { 'name': 'B', 'items': ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10'] }, { 'name': 'C', 'items': ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'] }, { 'name': 'D', 'items': ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'] }, { 'name': 'E', 'items': ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10'] }, { 'name': 'F', 'items': ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10'] }, { 'name': 'G', 'items': ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10'] }, { 'name': 'H', 'items': ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10'] }, { 'name': 'I', 'items': ['I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9', 'I10'] }, { 'name': 'J', 'items': ['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10'] }, { 'name': 'K', 'items': ['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8', 'K9', 'K10'] }];
            }

            _createClass(MyListAdapter, [{
                key: 'getGroupCount',
                value: function getGroupCount() {
                    return this.data.length;
                }
            }, {
                key: 'getChildrenCount',
                value: function getChildrenCount(groupPosition) {
                    return this.data[groupPosition].items.length;
                }
            }, {
                key: 'getGroup',
                value: function getGroup(groupPosition) {
                    return this.data[groupPosition].name;
                }
            }, {
                key: 'getChild',
                value: function getChild(groupPosition, childPosition) {
                    return this.data[groupPosition].items[childPosition];
                }
            }, {
                key: 'getGroupView',
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
                key: 'getChildView',
                value: function getChildView(groupPosition, childPosition, isLastChild, convertView, parent) {
                    if (convertView == null) {
                        convertView = View.inflate('@layout/item_child', parent.rootElement);
                    }
                    convertView.findViewById('item_child_text').setText(this.getChild(groupPosition, childPosition));
                    return convertView;
                }
            }, {
                key: 'getGroupId',
                value: function getGroupId(groupPosition) {
                    return 0;
                }
            }, {
                key: 'getChildId',
                value: function getChildId(groupPosition, childPosition) {
                    return 0;
                }
            }, {
                key: 'hasStableIds',
                value: function hasStableIds() {
                    return false;
                }
            }, {
                key: 'isChildSelectable',
                value: function isChildSelectable(groupPosition, childPosition) {
                    return false;
                }
            }]);

            return MyListAdapter;
        })(BaseExpandableListAdapter);
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

        var SampleGridViewActivity = (function (_Activity3) {
            _inherits(SampleGridViewActivity, _Activity3);

            function SampleGridViewActivity() {
                _classCallCheck(this, SampleGridViewActivity);

                _get(Object.getPrototypeOf(SampleGridViewActivity.prototype), 'constructor', this).apply(this, arguments);
            }

            _createClass(SampleGridViewActivity, [{
                key: 'onCreate',
                value: function onCreate() {
                    var listView = this.findViewById('gridView');
                    listView.setAdapter(new MyAdapter());
                }
            }]);

            return SampleGridViewActivity;
        })(Activity);

        activity.SampleGridViewActivity = SampleGridViewActivity;
        SampleGridViewActivity.registerCustomElement();

        var MyAdapter = (function (_BaseAdapter) {
            _inherits(MyAdapter, _BaseAdapter);

            function MyAdapter() {
                _classCallCheck(this, MyAdapter);

                _get(Object.getPrototypeOf(MyAdapter.prototype), 'constructor', this).apply(this, arguments);
            }

            _createClass(MyAdapter, [{
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

            return MyAdapter;
        })(BaseAdapter);
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

        var SampleListViewActivity = (function (_Activity4) {
            _inherits(SampleListViewActivity, _Activity4);

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

        var MyListAdapter = (function (_BaseAdapter2) {
            _inherits(MyListAdapter, _BaseAdapter2);

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
                    return 1000;
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
        var PullRefreshLoadLayout = androidui.widget.PullRefreshLoadLayout;

        var SamplePullRefreshLoadActivity = (function (_Activity5) {
            _inherits(SamplePullRefreshLoadActivity, _Activity5);

            function SamplePullRefreshLoadActivity() {
                _classCallCheck(this, SamplePullRefreshLoadActivity);

                _get(Object.getPrototypeOf(SamplePullRefreshLoadActivity.prototype), 'constructor', this).apply(this, arguments);
            }

            _createClass(SamplePullRefreshLoadActivity, [{
                key: 'onCreate',
                value: function onCreate() {
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
        })(Activity);

        activity.SamplePullRefreshLoadActivity = SamplePullRefreshLoadActivity;
        SamplePullRefreshLoadActivity.registerCustomElement();

        var MyListAdapter = (function (_BaseAdapter3) {
            _inherits(MyListAdapter, _BaseAdapter3);

            function MyListAdapter() {
                _classCallCheck(this, MyListAdapter);

                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                _get(Object.getPrototypeOf(MyListAdapter.prototype), 'constructor', this).apply(this, args);
                this.data = [];
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
                    return this.data.length;
                }
            }, {
                key: 'getItem',
                value: function getItem(position) {
                    return 1 + position + '. ' + this.data[position];
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

        var SampleViewPagerActivity = (function (_Activity6) {
            _inherits(SampleViewPagerActivity, _Activity6);

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

//# sourceMappingURL=main.es5.js.map
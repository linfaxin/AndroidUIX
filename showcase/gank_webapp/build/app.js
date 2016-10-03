var R;
(function (R) {
    R._res_data = {
        "drawable": {
            "icon_github@3x": "data:image/png;base64,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",
            "icon_menu@3x": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAAeFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVyEiIAAAAJ3RSTlMAWHDo4NAF9fEzDQHuyqaKZ1dPQCH62MW9t62RfnheRCkWoJxGLBoc2TUIAAAAy0lEQVRo3u3XWa7CQAxEUSeEzsAUkjBPj8fg/e+QNVxLCCTqLKDroy1bZSIiIiLyaU3X5kT2MGQ5dWqewPtD6dwRBLQeMAMBCw+oyBd4wIbMUOVcbkAdmKKJEdfFGNl2ExORX9Pk23VBzG5/RuwcK0nC3QP2IODkAQUIOHrAiNwbD/g3YO9YVRuQDitn1r0xQ4ZcdDFFvlCquwxY9ldDLoVDqwNZFs/pmwvI2QM231QCz++usU3p3MmAnifskhHDfISM22QiIiIi8jkvE8irSqK9lGYAAAAASUVORK5CYII=",
            "list_item_bg": "<selector xmlns=\"android\" xmlns:android=\"http://schemas.android.com/apk/res/android\">\n    <item android:state_pressed=\"true\" android:drawable=\"@color/gray_div\"></item>\n</selector>"
        },
        "layout": {
            "activity_main": "<android.support.v4.widget.drawerlayout android:id=\"drawerLayout\" android:layout_height=\"match_parent\" android:layout_width=\"match_parent\">\n    <framelayout android:layout_height=\"match_parent\" android:layout_width=\"match_parent\">\n        <linearlayout android:layout_width=\"match_parent\" android:layout_height=\"40dp\">\n            <imageview android:id=\"btn_menu\" android:state_pressed=\"background:#ddd\" android:layout_width=\"40dp\" android:drawableAlpha=\"200\" android:layout_height=\"match_parent\" android:src=\"@drawable/icon_menu\">\n            </imageview>\n            <view android:background=\"#ddd\" android:layout_width=\"1px\" android:layout_height=\"match_parent\">\n            </view>\n            <horizontalscrollview android:scrollbars=\"none\" android:layout_width=\"match_parent\" android:layout_height=\"match_parent\">\n                    <view class=\"com.linfaxin.gankwebapp.view.BorderBottomPagerIndicator\" android:id=\"indicator\" android:layout_width=\"wrap_content\" android:layout_height=\"match_parent\">\n                    </view>\n            </horizontalscrollview>\n        </linearlayout>\n        <view android:background=\"#ddd\" android:layout_marginTop=\"40dp\" android:layout_width=\"match_parent\" android:layout_height=\"1px\">\n        </view>\n        <android.support.v4.view.viewpager android:id=\"viewPager\" android:layout_marginTop=\"40dp\" android:layout_width=\"match_parent\" android:layout_height=\"match_parent\">\n        </android.support.v4.view.viewpager>\n        <progressbar android:id=\"progressBar\" android:layout_gravity=\"center\" android:layout_width=\"wrap_content\" android:layout_height=\"wrap_content\">\n        </progressbar>\n    </framelayout>\n\n    <!--侧滑内容-->\n    <linearlayout android:layout_gravity=\"left\" android:background=\"white\" android:padding=\"8dp\" android:orientation=\"vertical\" android:gravity=\"center\" android:layout_width=\"240dp\" android:clickable=\"true\" android:layout_height=\"match_parent\">\n        <textview android:layout_marginTop=\"12dp\" android:text=\"@string/app_name\" android:onClick=\"location.href = 'http://gank.io/'\" android:layout_width=\"wrap_content\" android:layout_height=\"wrap_content\" android:textSize=\"20sp\">\n        </textview>\n        <textview android:textColor=\"#999\" android:text=\"第三方社区版WebApp\" android:layout_width=\"wrap_content\" android:layout_height=\"wrap_content\" android:textSize=\"12sp\">\n        </textview>\n        <textview android:onClick=\"location.href = 'https://github.com/linfaxin/GankWebApp'\" android:layout_marginTop=\"20dp\" android:state_pressed=\"background:#ddd\" android:layout_width=\"wrap_content\" android:layout_height=\"wrap_content\" android:padding=\"8dp\" android:textColor=\"#999\" android:gravity=\"center\" android:text=\"欢迎Star&amp;PR :)\" android:drawableTop=\"@drawable/icon_github\">\n        </textview>\n        <linearlayout android:layout_margin=\"12dp\" android:layout_height=\"match_parent\" android:layout_width=\"wrap_content\" android:gravity=\"bottom\">\n            <textview android:onClick=\"location.href = 'https://github.com/linfaxin/AndroidUI-WebApp'\" android:state_pressed=\"background:#ccc\" android:layout_width=\"wrap_content\" android:layout_height=\"wrap_content\" android:background=\"#eee\" android:padding=\"8dp\" android:textColor=\"#999\" android:text=\"由AndroidUI框架驱动\">\n            </textview>\n        </linearlayout>\n    </linearlayout>\n</android.support.v4.widget.drawerlayout>",
            "day_detail_list_item": "<linearlayout android:background=\"@drawable/list_item_bg\" android:padding=\"8dp 8dp 8dp 24dp\" android:layout_width=\"match_parent\" android:layout_height=\"match_parent\" android:orientation=\"vertical\">\n    <textview android:id=\"title\" android:layout_width=\"match_parent\" android:layout_height=\"wrap_content\" android:maxLines=\"3\" android:ellipsize=\"end\" android:textSize=\"14sp\"></textview>\n    <textview android:id=\"summary\" android:layout_width=\"match_parent\" android:layout_height=\"wrap_content\" android:layout_marginTop=\"6dp\" android:textColor=\"#999\" android:textSize=\"12sp\"></textview>\n</linearlayout>",
            "main_list_item": "<linearlayout android:background=\"@drawable/list_item_bg\" android:padding=\"8dp\" android:layout_width=\"match_parent\" android:layout_height=\"match_parent\">\n    <imageview android:id=\"imageView\" android:scaleType=\"centerCrop\" android:layout_height=\"35vw\" android:layout_width=\"35vw\"></imageview>\n    <linearlayout android:layout_marginLeft=\"12dp\" android:layout_height=\"match_parent\" android:layout_width=\"match_parent\" android:gravity=\"center\" android:orientation=\"vertical\">\n        <textview android:id=\"title\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:maxLines=\"3\" android:lines=\"3\" android:gravity=\"center_vertical\" android:ellipsize=\"end\" android:textSize=\"18sp\"></textview>\n        <textview android:id=\"summary\" android:layout_height=\"wrap_content\" android:layout_width=\"match_parent\" android:layout_marginTop=\"4dp\" android:textColor=\"#999\" android:textSize=\"12sp\"></textview>\n    </linearlayout>\n</linearlayout>"
        },
        "values": {
            "color": {
                "gray_div": "<color name=\"gray_div\">#dddddd</color>"
            },
            "string": {
                "app_name": "<string name=\"app_name\">gank.io</string>"
            }
        },
        "values-zh": {
            "string": {
                "app_name": "<string name=\"app_name\">干货gank.io</string>"
            }
        }
    };
})(R || (R = {}));
var R;
(function (R) {
    var Resources = android.content.res.Resources;
    var NetDrawable = androidui.image.NetDrawable;
    var NinePatchDrawable = androidui.image.NinePatchDrawable;
    var NetImage = androidui.image.NetImage;
    R.id = {
        drawerLayout: 'drawerLayout',
        btn_menu: 'btn_menu',
        indicator: 'indicator',
        viewPager: 'viewPager',
        progressBar: 'progressBar',
        title: 'title',
        summary: 'summary',
        imageView: 'imageView',
    };
    R.layout = {
        activity_main: '@layout/activity_main',
        day_detail_list_item: '@layout/day_detail_list_item',
        main_list_item: '@layout/main_list_item',
    };
    R.style = {};
    R.color = {
        gray_div: '@color/gray_div',
    };
    R.array = {};
    R.integer = {};
    R.fraction = {};
    class drawable {
        static get icon_github() { return Resources.getSystem().getDrawable('icon_github'); }
        static get icon_menu() { return Resources.getSystem().getDrawable('icon_menu'); }
        static get list_item_bg() { return Resources.getSystem().getDrawable('list_item_bg'); }
    }
    R.drawable = drawable;
    class string_ {
        static get app_name() { return Resources.getSystem().getString('app_name'); }
    }
    R.string_ = string_;
    class bool {
    }
    R.bool = bool;
    const res_data = R._res_data;
    function resDirSpecMatch(spec) {
        spec = spec.toLocaleLowerCase();
        let ratio = window.devicePixelRatio;
        if (ratio === 0.75 && spec === 'ldpi')
            return true;
        if (ratio === 1 && spec === 'mdpi')
            return true;
        if (ratio === 1.5 && spec === 'hdpi')
            return true;
        if (ratio === 2 && spec === 'xhdpi')
            return true;
        if (ratio === 3 && spec === 'xxhdpi')
            return true;
        if (ratio === 4 && spec === 'xxxhdpi')
            return true;
        let dpi = ratio * 160;
        if (spec === dpi + 'dpi')
            return true;
        let xdp = document.documentElement.offsetWidth;
        let ydp = document.documentElement.offsetHeight;
        let minDP = Math.min(xdp, ydp);
        let maxDP = Math.max(xdp, ydp);
        if (spec === 'xlarge' && maxDP > 960 && minDP > 720)
            return true;
        if (spec === 'large' && maxDP > 640 && minDP > 480)
            return true;
        if (spec === 'normal' && maxDP > 470 && minDP > 320)
            return true;
        if (spec === 'small' && maxDP > 426 && minDP > 320)
            return true;
        if (spec === 'port' && ydp > xdp)
            return true;
        if (spec === 'land' && xdp > ydp)
            return true;
        if (spec === xdp + 'x' + ydp || spec === ydp + 'x' + xdp)
            return true;
        let swMatch = spec.match(/sw(d*)dp/);
        if (swMatch && parseInt(swMatch[1]) >= minDP)
            return true;
        let wMatch = spec.match(/w(d*)dp/);
        if (wMatch && parseInt(wMatch[1]) >= xdp)
            return true;
        let hMatch = spec.match(/h(d*)dp/);
        if (hMatch && parseInt(hMatch[1]) >= ydp)
            return true;
        const lang = navigator.language.toLocaleLowerCase().split('-')[0];
        if (lang === spec)
            return true;
        if (spec.startsWith('r')) {
            const specArea = spec.substring(1);
            const langArea = navigator.language.toLocaleLowerCase().split('-')[1];
            if (langArea === specArea)
                return true;
        }
    }
    const matchDirNamesCache = {};
    function findMatchDirNames(baseDirName) {
        if (matchDirNamesCache[baseDirName])
            return matchDirNamesCache[baseDirName];
        let matchDirNames = [];
        for (let dirName in res_data) {
            if (dirName == baseDirName || dirName.startsWith(baseDirName + '-')) {
                matchDirNames.push(dirName);
            }
        }
        matchDirNames = matchDirNames.sort((a, b) => {
            let bSplits = b.split('-');
            bSplits.shift();
            let bMatchTimes = 0;
            for (let split of bSplits) {
                if (resDirSpecMatch(split))
                    bMatchTimes++;
            }
            let aSplits = a.split('-');
            aSplits.shift();
            let aMatchTimes = 0;
            for (let split of aSplits) {
                if (resDirSpecMatch(split))
                    aMatchTimes++;
            }
            return bMatchTimes - aMatchTimes;
        });
        matchDirNamesCache[baseDirName] = matchDirNames;
        return matchDirNames;
    }
    const imageFileCache = new Map();
    function findImageFile(fileName) {
        for (let dirName of findMatchDirNames('drawable')) {
            let dir = res_data[dirName];
            if (dirName === 'drawable') {
                function findImageWithRatioName(ratio) {
                    let fileNameWithRatio = fileName + '@' + ratio + 'x';
                    let key = dirName + '/' + fileNameWithRatio;
                    let netImage = imageFileCache.get(key);
                    if (!netImage) {
                        let fileStr = dir[fileNameWithRatio];
                        if (fileStr && fileStr.startsWith('data:image')) {
                            netImage = new NetImage(fileStr, ratio);
                            imageFileCache.set(key, netImage);
                        }
                    }
                    if (netImage)
                        return new NetDrawable(netImage);
                    let fileNameWithNinePatch = fileName + '@' + ratio + 'x' + '.9';
                    key = dirName + '/' + fileNameWithNinePatch;
                    netImage = imageFileCache.get(key);
                    if (!netImage) {
                        let fileStr = dir[fileNameWithNinePatch];
                        if (fileStr && fileStr.startsWith('data:image')) {
                            netImage = new NetImage(fileStr, ratio);
                            imageFileCache.set(key, netImage);
                        }
                    }
                    if (netImage)
                        return new NinePatchDrawable(netImage);
                    return null;
                }
                let ratioDrawable = findImageWithRatioName(window.devicePixelRatio);
                if (!ratioDrawable && window.devicePixelRatio !== 3)
                    ratioDrawable = findImageWithRatioName(3);
                if (!ratioDrawable && window.devicePixelRatio !== 2)
                    ratioDrawable = findImageWithRatioName(2);
                if (!ratioDrawable && window.devicePixelRatio !== 4)
                    ratioDrawable = findImageWithRatioName(4);
                if (!ratioDrawable && window.devicePixelRatio !== 1)
                    ratioDrawable = findImageWithRatioName(1);
                if (!ratioDrawable && window.devicePixelRatio !== 5)
                    ratioDrawable = findImageWithRatioName(5);
                if (!ratioDrawable && window.devicePixelRatio !== 6)
                    ratioDrawable = findImageWithRatioName(6);
                return ratioDrawable;
            }
            let ratio = 1;
            if (dirName.includes('-')) {
                if (dirName.includes('-ldpi'))
                    ratio = 0.75;
                else if (dirName.includes('-mdpi'))
                    ratio = 1;
                else if (dirName.includes('-hdpi'))
                    ratio = 1.5;
                else if (dirName.includes('-xhdpi'))
                    ratio = 2;
                else if (dirName.includes('-xxhdpi'))
                    ratio = 3;
                else if (dirName.includes('-xxxhdpi'))
                    ratio = 4;
            }
            let key = dirName + '/' + fileName;
            let netImage = imageFileCache.get(key);
            if (!netImage) {
                let fileStr = dir[fileName];
                if (fileStr && fileStr.startsWith('data:image')) {
                    netImage = new NetImage(fileStr, ratio);
                    imageFileCache.set(key, netImage);
                }
            }
            if (netImage)
                return new NetDrawable(netImage);
            let fileNameWithNinePatch = fileName + '.9';
            key = dirName + '/' + fileNameWithNinePatch;
            netImage = imageFileCache.get(key);
            if (!netImage) {
                let fileStr = dir[fileNameWithNinePatch];
                if (fileStr && fileStr.startsWith('data:image')) {
                    netImage = new NetImage(fileStr, ratio);
                    imageFileCache.set(key, netImage);
                }
            }
            if (netImage)
                return new NinePatchDrawable(netImage);
        }
    }
    const _tempDiv = document.createElement('div');
    function findXmlFile(baseDirName, fileName) {
        for (let dirName of findMatchDirNames(baseDirName)) {
            let dir = res_data[dirName];
            if (dir[fileName]) {
                _tempDiv.innerHTML = dir[fileName];
                let data = _tempDiv.firstElementChild;
                _tempDiv.removeChild(data);
                return data;
            }
        }
    }
    function findResourcesValue(valueType, valueName) {
        for (let dirName of findMatchDirNames('values')) {
            let dir = res_data[dirName];
            if (dir[valueType] && dir[valueType][valueName]) {
                _tempDiv.innerHTML = dir[valueType][valueName];
                let data = _tempDiv.firstElementChild;
                _tempDiv.removeChild(data);
                return data;
            }
        }
    }
    if ('_AppBuildValueFinder' in android.content.res.Resources) {
        android.content.res.Resources._AppBuildImageFileFinder = (refString) => {
            if (refString.startsWith('@drawable/')) {
                refString = refString.substring('@drawable/'.length);
            }
            return findImageFile(refString);
        };
        android.content.res.Resources._AppBuildXmlFinder = (refString) => {
            if (!refString.startsWith('@')) {
                throw Error('refString must starts with @, current: ' + refString);
            }
            refString = refString.substring(1);
            let splits = refString.split('/');
            if (splits.length != 2)
                throw Error('refString must have one \'/\', current: ' + refString);
            return findXmlFile(splits[0], splits[1]);
        };
        android.content.res.Resources._AppBuildValueFinder = (refString) => {
            if (!refString.startsWith('@')) {
                throw Error('refString must starts with @, current: ' + refString);
            }
            refString = refString.substring(1);
            let splits = refString.split('/');
            if (splits.length != 2)
                throw Error('refString must have one \'/\', current: ' + refString);
            return findResourcesValue(splits[0], splits[1]);
        };
    }
    else {
        throw Error('Error: sdk version is too old. Please update your androidui sdk.');
    }
})(R || (R = {}));
var com;
(function (com) {
    var linfaxin;
    (function (linfaxin) {
        var gankwebapp;
        (function (gankwebapp) {
            var ActionBarActivity = android.app.ActionBarActivity;
            var ProgressBar = android.widget.ProgressBar;
            var FrameLayout = android.widget.FrameLayout;
            var Toast = android.widget.Toast;
            var TextView = android.widget.TextView;
            var ExpandableListView = android.widget.ExpandableListView;
            var BaseExpandableListAdapter = android.widget.BaseExpandableListAdapter;
            var ImageView = android.widget.ImageView;
            var Intent = android.content.Intent;
            class DayDetailActivity extends ActionBarActivity {
                onCreate(savedInstanceState) {
                    super.onCreate(savedInstanceState);
                    const activity = this;
                    this.date = this.getIntent().getStringExtra(DayDetailActivity.Extra_Date);
                    if (!this.date) {
                        this.finish();
                        return;
                    }
                    this.setTitle(this.date);
                    this.date = this.date.replace('-', '/').replace('-', '/');
                    let pd = new ProgressBar(this);
                    this.setContentView(pd, new FrameLayout.LayoutParams(-2, -2, android.view.Gravity.CENTER));
                    setTimeout(() => {
                        fetch('http://faxnode.duapp.com/gank_api/day/' + this.date)
                            .then((response) => {
                            return response.json();
                        }).then((json) => {
                            this.initPage(json.results);
                        }).catch((e) => {
                            console.error(e);
                            Toast.makeText(activity, '载入失败', Toast.LENGTH_SHORT).show();
                        });
                    }, 350);
                }
                initPage(mapData) {
                    let activity = this;
                    let fuliArray = mapData['福利'];
                    delete mapData['福利'];
                    let adapter = new DetailAdapter(mapData);
                    let list = new ExpandableListView(this);
                    if (fuliArray) {
                        let fuli = fuliArray[0];
                        let imageView = new ImageView(this);
                        imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
                        imageView.setLayoutParams(new android.widget.AbsListView.LayoutParams(-1, this.getResources().getDisplayMetrics().widthPixels * 0.8));
                        imageView.setImageURI(fuli.url);
                        imageView.setOnClickListener({
                            onClick(view) {
                                activity.startActivity(new android.content.Intent('com.linfaxin.gankwebapp.PhotoActivity')
                                    .putExtra('url', fuli.url));
                            }
                        });
                        list.addHeaderView(imageView);
                        let onScrollChanged = list.onScrollChanged;
                        list.onScrollChanged = (l, t, oldl, oldt) => {
                            if (t < 0) {
                                imageView.setPivotX(imageView.getWidth() / 2);
                                imageView.setPivotY(imageView.getHeight());
                                let scale = 1 - (t - 1) / imageView.getHeight();
                                imageView.setScaleX(scale);
                                imageView.setScaleY(scale);
                            }
                            onScrollChanged.call(list, l, t, oldl, oldt);
                        };
                    }
                    list.setExpandableAdapter(adapter);
                    for (let i = 0, count = adapter.getGroupCount(); i < count; i++) {
                        list.expandGroup(i);
                    }
                    this.setContentView(list);
                }
            }
            DayDetailActivity.Extra_Date = 'date';
            gankwebapp.DayDetailActivity = DayDetailActivity;
            class DetailAdapter extends BaseExpandableListAdapter {
                constructor(mapData) {
                    super();
                    this.data = new Map();
                    for (let key in mapData) {
                        this.data.set(key, mapData[key]);
                    }
                }
                getGroupCount() {
                    return this.data.size;
                }
                getChildrenCount(groupPosition) {
                    return Array.from(this.data.values())[groupPosition].length;
                }
                getGroup(groupPosition) {
                    return Array.from(this.data.keys())[groupPosition];
                }
                getChild(groupPosition, childPosition) {
                    return Array.from(this.data.values())[groupPosition][childPosition];
                }
                getGroupId(groupPosition) {
                    return -1;
                }
                getChildId(groupPosition, childPosition) {
                    return -1;
                }
                hasStableIds() {
                    return false;
                }
                isChildSelectable(groupPosition, childPosition) {
                    return false;
                }
                getGroupView(groupPosition, isExpanded, convertView, parent) {
                    let groupTitle = this.getGroup(groupPosition);
                    if (!isExpanded)
                        groupTitle = '+ ' + groupTitle;
                    let density = parent.getResources().getDisplayMetrics().density;
                    let textView = convertView || new TextView(parent.getContext());
                    textView.setTextSize(18);
                    textView.setText(groupTitle);
                    textView.setPadding(16 * density, 16 * density, 16 * density, 16 * density);
                    return textView;
                }
                getChildView(groupPosition, childPosition, isLastChild, convertView, parent) {
                    let item = this.getChild(groupPosition, childPosition);
                    convertView = convertView || android.view.View.inflate(parent.getContext(), R.layout.day_detail_list_item);
                    convertView.findViewById(R.id.title).setText(item.desc);
                    convertView.findViewById(R.id.summary).setText(item.who);
                    convertView.setOnClickListener({
                        onClick(v) {
                            v.getContext().startActivity(new Intent("com.linfaxin.gankwebapp.WebViewActivity")
                                .putExtra(gankwebapp.WebViewActivity.Extra_Title, item.desc)
                                .putExtra(gankwebapp.WebViewActivity.Extra_Url, item.url));
                        }
                    });
                    return convertView;
                }
            }
        })(gankwebapp = linfaxin.gankwebapp || (linfaxin.gankwebapp = {}));
    })(linfaxin = com.linfaxin || (com.linfaxin = {}));
})(com || (com = {}));
var com;
(function (com) {
    var linfaxin;
    (function (linfaxin) {
        var gankwebapp;
        (function (gankwebapp) {
            var Activity = android.app.Activity;
            var Toast = android.widget.Toast;
            class MainActivity extends Activity {
                onCreate(savedInstanceState) {
                    super.onCreate(savedInstanceState);
                    const activity = this;
                    this.setTitle('首页');
                    this.setContentView(R.layout.activity_main);
                    let progressBar = this.findViewById(R.id.progressBar);
                    this.initAllDayTitle().then(() => {
                        this.initViewPager();
                    }, () => {
                        Toast.makeText(this, '标题数据获取失败', Toast.LENGTH_SHORT).show();
                        this.initViewPager();
                    });
                    let drawerLayout = this.findViewById(R.id.drawerLayout);
                    let btn_menu = this.findViewById(R.id.btn_menu);
                    btn_menu.setOnClickListener({
                        onClick: function (view) {
                            if (drawerLayout.isDrawerOpen(android.view.Gravity.LEFT)) {
                                drawerLayout.closeDrawers();
                            }
                            else {
                                drawerLayout.openDrawer(android.view.Gravity.LEFT);
                            }
                        }
                    });
                }
                initAllDayTitle() {
                    return new Promise((resolve, reject) => {
                        fetch(`http://faxnode.duapp.com/gank_history`)
                            .then((response) => {
                            return response.json();
                        }).then((json) => {
                            for (let key in json) {
                                MainActivity.AllDataTitle.set(key, json[key]);
                            }
                            resolve();
                        }).catch((ex) => {
                            console.error(ex);
                            reject();
                        });
                    });
                }
                initViewPager() {
                    let progressBar = this.findViewById(R.id.progressBar);
                    progressBar.getParent().removeView(progressBar);
                    let viewPager = this.findViewById(R.id.viewPager);
                    viewPager.setAdapter(new gankwebapp.view.GankPagerAdapter(viewPager));
                    let indicator = this.findViewById(R.id.indicator);
                    indicator.bindViewPager(viewPager);
                    indicator.checkFirstChild();
                }
            }
            MainActivity.AllDataTitle = new Map();
            gankwebapp.MainActivity = MainActivity;
        })(gankwebapp = linfaxin.gankwebapp || (linfaxin.gankwebapp = {}));
    })(linfaxin = com.linfaxin || (com.linfaxin = {}));
})(com || (com = {}));
var com;
(function (com) {
    var linfaxin;
    (function (linfaxin) {
        var gankwebapp;
        (function (gankwebapp) {
            var Activity = android.app.Activity;
            var PhotoView = uk.co.senab.photoview.PhotoView;
            class PhotoActivity extends Activity {
                onCreate(savedInstanceState) {
                    super.onCreate(savedInstanceState);
                    let enterAnim = android.R.anim.grow_fade_in_center;
                    enterAnim.setDuration(500);
                    let exitAnim = android.R.anim.shrink_fade_out_center;
                    exitAnim.setDuration(500);
                    this.getWindow().setWindowAnimations(enterAnim, exitAnim, null, null);
                    this.getWindow().setFloating(true);
                    let photo = new PhotoView(this);
                    photo.setImageURI(this.getIntent().getStringExtra('url'));
                    this.setContentView(photo);
                    let activity = this;
                    photo.setOnPhotoTapListener({
                        onPhotoTap() {
                            activity.finish();
                        }
                    });
                }
            }
            gankwebapp.PhotoActivity = PhotoActivity;
        })(gankwebapp = linfaxin.gankwebapp || (linfaxin.gankwebapp = {}));
    })(linfaxin = com.linfaxin || (com.linfaxin = {}));
})(com || (com = {}));
var com;
(function (com) {
    var linfaxin;
    (function (linfaxin) {
        var gankwebapp;
        (function (gankwebapp) {
            var ActionBarActivity = android.app.ActionBarActivity;
            var WebView = android.webkit.WebView;
            var WebViewClient = android.webkit.WebViewClient;
            class WebViewActivity extends ActionBarActivity {
                onCreate(savedInstanceState) {
                    super.onCreate(savedInstanceState);
                    const activity = this;
                    var title = this.getIntent().getStringExtra(WebViewActivity.Extra_Title);
                    this.setTitle(title || '网页');
                    var url = this.getIntent().getStringExtra(WebViewActivity.Extra_Url);
                    if (!url) {
                        this.finish();
                        return;
                    }
                    this.webView = new WebView(this);
                    this.setContentView(this.webView);
                    this.webView.loadUrl(url);
                    let webViewClient = new WebViewClient();
                    webViewClient.onReceivedTitle = (view, title) => {
                        this.setTitle(title);
                    };
                    this.webView.setWebViewClient(webViewClient);
                }
                onBackPressed() {
                    if (this.webView.canGoBack()) {
                        this.webView.goBack();
                        return;
                    }
                    super.onBackPressed();
                }
            }
            WebViewActivity.Extra_Title = 'title';
            WebViewActivity.Extra_Url = 'url';
            gankwebapp.WebViewActivity = WebViewActivity;
        })(gankwebapp = linfaxin.gankwebapp || (linfaxin.gankwebapp = {}));
    })(linfaxin = com.linfaxin || (com.linfaxin = {}));
})(com || (com = {}));
var com;
(function (com) {
    var linfaxin;
    (function (linfaxin) {
        var gankwebapp;
        (function (gankwebapp) {
            var view;
            (function (view) {
                var View = android.view.View;
                var LinearLayout = android.widget.LinearLayout;
                var Gravity = android.view.Gravity;
                var Color = android.graphics.Color;
                var Paint = android.graphics.Paint;
                var ViewPager = android.support.v4.view.ViewPager;
                var RadioGroup = android.widget.RadioGroup;
                var CompoundButton = android.widget.CompoundButton;
                var RadioButton = android.widget.RadioButton;
                class BorderBottomPagerIndicator extends RadioGroup {
                    constructor(context, bindElement, defStyle) {
                        super(context, bindElement, defStyle);
                        this.mPosition = 0;
                        this.mPositionOffset = 0;
                        this.bottomLinePaint = new Paint();
                        this.mBottomIndicatorLeft = 0;
                        this.mBottomIndicatorRight = 0;
                        this.colorNormal = 0xff999999;
                        this.colorChecked = 0xff000000;
                        this.colorBottomLine = 0xff666666;
                        this.tempRect = new android.graphics.Rect();
                        this.setOrientation(LinearLayout.HORIZONTAL);
                        this.setGravity(Gravity.CENTER);
                        this.setMinimumHeight(40 * this.getResources().getDisplayMetrics().density);
                        this.bottomLinePaint.setColor(this.colorBottomLine);
                        this.setWillNotDraw(false);
                        super.setOnCheckedChangeListener({
                            onCheckedChanged(group, checkedId) {
                                group.invalidate();
                                let cb = group.findViewById(checkedId);
                                if (cb != null) {
                                    if (group.viewPager != null) {
                                        group.viewPager.setCurrentItem(group.indexOfChild(cb));
                                    }
                                }
                                cb.getDrawingRect(group.tempRect);
                                group.tempRect.left -= group.tempRect.width() / 2;
                                group.tempRect.right += group.tempRect.width() / 2;
                                cb.requestRectangleOnScreen(group.tempRect);
                                if (group.onCheckedChangedListener != null) {
                                    group.onCheckedChangedListener.onCheckedChanged(group, checkedId);
                                }
                            }
                        });
                    }
                    addRadioBtns(...btns) {
                        for (let s of btns) {
                            if (s == null)
                                continue;
                            this.addRadioBtn(s);
                        }
                    }
                    addRadioBtn(text, id = View.NO_ID) {
                        let radioButton = new RadioButton(this.getContext());
                        if (id == View.NO_ID) {
                            id = text + radioButton.hashCode();
                        }
                        radioButton.setId(id);
                        radioButton.setText(text);
                        radioButton.setTextSize(15);
                        radioButton.setButtonDrawable(new android.graphics.drawable.ColorDrawable(Color.TRANSPARENT));
                        let pad = this.getResources().getDisplayMetrics().density * 8;
                        radioButton.setPadding(pad, pad, pad, pad);
                        radioButton.setMinWidth(0);
                        radioButton.setGravity(Gravity.CENTER);
                        radioButton.setBackgroundDrawable(android.R.drawable.item_background);
                        let textColor = new android.content.res.ColorStateList([[View.VIEW_STATE_CHECKED], []], [this.colorChecked, this.colorNormal]);
                        radioButton.setTextColor(textColor);
                        this.addView(radioButton, new RadioGroup.LayoutParams(0, -1, 1));
                    }
                    setOnCheckedChangeListener(listener) {
                        this.onCheckedChangedListener = listener;
                    }
                    checkFirstChild() {
                        for (let i = 0, size = this.getChildCount(); i < size; i++) {
                            if (this.getChildAt(i) instanceof CompoundButton) {
                                this.getChildAt(i).setChecked(true);
                                return;
                            }
                        }
                    }
                    getBottomIndicatorRight() {
                        return this.mBottomIndicatorRight;
                    }
                    getBottomIndicatorLeft() {
                        return this.mBottomIndicatorLeft;
                    }
                    getBottomIndicatorWidth() {
                        return this.mBottomIndicatorRight - this.mBottomIndicatorLeft;
                    }
                    onDraw(canvas) {
                        let itemWidth = this.getWidth() / this.getChildCount();
                        let leftOffset = 0;
                        let linePadding = this.getResources().getDisplayMetrics().density * 6;
                        try {
                            let cb = this.getCurrentCB();
                            let positionOffsetFix = this.mPosition - this.indexOfChild(cb) + this.mPositionOffset;
                            leftOffset = cb.getLeft() + cb.getWidth() * positionOffsetFix;
                            itemWidth = cb.getWidth();
                            linePadding = ((itemWidth - cb.getPaint().measureText(cb.getText().toString())) / 2 - linePadding);
                        }
                        catch (e) {
                        }
                        this.mBottomIndicatorLeft = leftOffset + linePadding;
                        this.mBottomIndicatorRight = leftOffset + itemWidth - linePadding;
                        canvas.drawRect(this.mBottomIndicatorLeft, this.getHeight() - this.getResources().getDisplayMetrics().density * 4, this.mBottomIndicatorRight, this.getHeight(), this.bottomLinePaint);
                    }
                    getCBChild(index) {
                        try {
                            return this.getChildAt(index);
                        }
                        catch (e) {
                            console.warn(e);
                        }
                        return null;
                    }
                    getCurrentCB() {
                        try {
                            return this.findViewById(this.getCheckedRadioButtonId());
                        }
                        catch (e) {
                            console.warn(e);
                        }
                        return null;
                    }
                    bindViewPager(viewPager) {
                        this.viewPager = viewPager;
                        viewPager.addOnPageChangeListener(this);
                        let adapter = viewPager.getAdapter();
                        if (adapter) {
                            for (let i = 0, count = adapter.getCount(); i < count; i++) {
                                let title = adapter.getPageTitle(i);
                                if (title)
                                    this.addRadioBtn(title);
                            }
                        }
                    }
                    onPageSelected(position) {
                        this.invalidate();
                        try {
                            this.getCBChild(position).setChecked(true);
                        }
                        catch (e) {
                            console.warn(e);
                        }
                    }
                    onPageScrolled(position, positionOffset, positionOffsetPixels) {
                        this.mPosition = position;
                        this.mPositionOffset = positionOffset;
                        this.invalidate();
                    }
                    onPageScrollStateChanged(state) {
                        if (state == ViewPager.SCROLL_STATE_IDLE) {
                            this.mPositionOffset = 0;
                            this.mPosition = this.viewPager.getCurrentItem();
                            this.invalidate();
                        }
                    }
                }
                view.BorderBottomPagerIndicator = BorderBottomPagerIndicator;
            })(view = gankwebapp.view || (gankwebapp.view = {}));
        })(gankwebapp = linfaxin.gankwebapp || (linfaxin.gankwebapp = {}));
    })(linfaxin = com.linfaxin || (com.linfaxin = {}));
})(com || (com = {}));
var com;
(function (com) {
    var linfaxin;
    (function (linfaxin) {
        var gankwebapp;
        (function (gankwebapp) {
            var view;
            (function (view_1) {
                var View = android.view.View;
                var BaseAdapter = android.widget.BaseAdapter;
                var Intent = android.content.Intent;
                class GankCategoryAdapter extends BaseAdapter {
                    constructor(...args) {
                        super(...args);
                        this.data = [];
                    }
                    getView(position, convertView, parent) {
                        if (convertView == null) {
                            convertView = View.inflate(parent.getContext(), R.layout.main_list_item, null);
                        }
                        let item = this.getItem(position);
                        let day = item.publishedAt.split('T')[0];
                        convertView.findViewById(R.id.title).setText(item.desc);
                        convertView.findViewById(R.id.summary).setText(day + ' ' + item.who);
                        convertView.findViewById(R.id.imageView).setVisibility(View.GONE);
                        convertView.setOnClickListener({
                            onClick(view) {
                                view.getContext().startActivity(new Intent("com.linfaxin.gankwebapp.WebViewActivity")
                                    .putExtra(gankwebapp.WebViewActivity.Extra_Title, item.desc)
                                    .putExtra(gankwebapp.WebViewActivity.Extra_Url, item.url));
                            }
                        });
                        return convertView;
                    }
                    getCount() {
                        return this.data.length;
                    }
                    getItem(position) {
                        return this.data[position];
                    }
                    getItemId(position) {
                        return -1;
                    }
                }
                view_1.GankCategoryAdapter = GankCategoryAdapter;
            })(view = gankwebapp.view || (gankwebapp.view = {}));
        })(gankwebapp = linfaxin.gankwebapp || (linfaxin.gankwebapp = {}));
    })(linfaxin = com.linfaxin || (com.linfaxin = {}));
})(com || (com = {}));
var com;
(function (com) {
    var linfaxin;
    (function (linfaxin) {
        var gankwebapp;
        (function (gankwebapp) {
            var view;
            (function (view_2) {
                var View = android.view.View;
                var BaseAdapter = android.widget.BaseAdapter;
                class GankFuliListAdapter extends BaseAdapter {
                    constructor(...args) {
                        super(...args);
                        this.data = [];
                    }
                    getView(position, convertView, parent) {
                        if (convertView == null) {
                            convertView = View.inflate(parent.getContext(), R.layout.main_list_item, null);
                        }
                        let item = this.getItem(position);
                        let day = item.publishedAt.split('T')[0];
                        convertView.findViewById(R.id.title).setText(gankwebapp.MainActivity.AllDataTitle.get(day) || '暂无标题');
                        convertView.findViewById(R.id.summary).setText(day);
                        convertView.findViewById(R.id.imageView).setImageURI(item.url);
                        convertView.setOnClickListener({
                            onClick(view) {
                                let activity = view.getContext();
                                activity.startActivity(new android.content.Intent('com.linfaxin.gankwebapp.DayDetailActivity')
                                    .putExtra(gankwebapp.DayDetailActivity.Extra_Date, day));
                            }
                        });
                        return convertView;
                    }
                    getCount() {
                        return this.data.length;
                    }
                    getItem(position) {
                        return this.data[position];
                    }
                    getItemId(position) {
                        return -1;
                    }
                }
                view_2.GankFuliListAdapter = GankFuliListAdapter;
            })(view = gankwebapp.view || (gankwebapp.view = {}));
        })(gankwebapp = linfaxin.gankwebapp || (linfaxin.gankwebapp = {}));
    })(linfaxin = com.linfaxin || (com.linfaxin = {}));
})(com || (com = {}));
var com;
(function (com) {
    var linfaxin;
    (function (linfaxin) {
        var gankwebapp;
        (function (gankwebapp) {
            var view;
            (function (view_3) {
                var PagerAdapter = android.support.v4.view.PagerAdapter;
                var ListView = android.widget.ListView;
                var PullRefreshLoadLayout = androidui.widget.PullRefreshLoadLayout;
                class GankPagerAdapter extends PagerAdapter {
                    constructor(viewPager) {
                        super();
                        this.views = [];
                        this.pageShowedFlags = [true];
                        this.viewPager = viewPager;
                        const adapter = this;
                        viewPager.addOnPageChangeListener({
                            onPageScrolled(position, positionOffset, positionOffsetPixels) {
                                if (adapter.pageShowedFlags[position])
                                    return;
                                adapter.pageShowedFlags[position] = true;
                                adapter.getView(position);
                                adapter.views[position].setFooterState(PullRefreshLoadLayout.State_Footer_Normal);
                                adapter.views[position].setFooterState(PullRefreshLoadLayout.State_Footer_Loading);
                            },
                            onPageSelected(position) {
                            },
                            onPageScrollStateChanged(state) {
                            }
                        });
                    }
                    getView(position) {
                        let prll = this.views[position];
                        if (!prll) {
                            prll = new PullRefreshLoadLayout(this.viewPager.getContext());
                            let listView = new ListView(this.viewPager.getContext());
                            prll.addView(listView, -1, -1);
                            let isFuli = position == 0;
                            let adapter = isFuli ? new view_3.GankFuliListAdapter() : new view_3.GankCategoryAdapter();
                            listView.setAdapter(adapter);
                            if (position > 0) {
                                prll.setFooterState(PullRefreshLoadLayout.State_Footer_Loading);
                            }
                            prll.setRefreshLoadListener(new view_3.GankRefreshLoadListener(GankPagerAdapter.PagerCategory[position], adapter));
                            this.views[position] = prll;
                        }
                        return prll;
                    }
                    getCount() {
                        return GankPagerAdapter.PagerCategory.length;
                    }
                    instantiateItem(container, position) {
                        let prll = this.getView(position);
                        container.addView(prll, 0);
                        return prll;
                    }
                    destroyItem(container, position, object) {
                        container.removeView(object);
                    }
                    isViewFromObject(view, object) {
                        return view == object;
                    }
                    getItemPosition(object) {
                        return this.views.indexOf(object);
                    }
                    getPageTitle(position) {
                        return GankPagerAdapter.PagerTitle[position];
                    }
                }
                GankPagerAdapter.PagerCategory = ['福利', 'Android', 'iOS', 'App', '前端', '瞎推荐', '拓展资源', '休息视频'];
                GankPagerAdapter.PagerTitle = ['每日', 'Android', 'iOS', 'App', '前端', '瞎推荐', '拓展资源', '休息视频'];
                view_3.GankPagerAdapter = GankPagerAdapter;
            })(view = gankwebapp.view || (gankwebapp.view = {}));
        })(gankwebapp = linfaxin.gankwebapp || (linfaxin.gankwebapp = {}));
    })(linfaxin = com.linfaxin || (com.linfaxin = {}));
})(com || (com = {}));
var com;
(function (com) {
    var linfaxin;
    (function (linfaxin) {
        var gankwebapp;
        (function (gankwebapp) {
            var view;
            (function (view) {
                var PullRefreshLoadLayout = androidui.widget.PullRefreshLoadLayout;
                var Toast = android.widget.Toast;
                class GankRefreshLoadListener {
                    constructor(category, adapter) {
                        this.nextLoadingPage = 1;
                        this.category = category;
                        this.adapter = adapter;
                    }
                    onRefresh(prll) {
                        this.nextLoadingPage = 1;
                        this.loadNextPage(prll.getContext()).then((items) => {
                            this.adapter.data = items;
                            this.adapter.notifyDataSetChanged();
                            prll.setHeaderState(PullRefreshLoadLayout.State_Header_Normal);
                            prll.setFooterState(PullRefreshLoadLayout.State_Footer_Normal);
                        }, () => {
                            prll.setHeaderState(PullRefreshLoadLayout.State_Header_RefreshFail);
                        });
                    }
                    onLoadMore(prll) {
                        this.loadNextPage(prll.getContext()).then((items) => {
                            this.adapter.data.push(...items);
                            this.adapter.notifyDataSetChanged();
                            if (items.length == GankRefreshLoadListener.ListLoadCount) {
                                prll.setFooterState(PullRefreshLoadLayout.State_Footer_Normal);
                            }
                            else {
                                prll.setFooterState(PullRefreshLoadLayout.State_Footer_NoMoreToLoad);
                            }
                        }, () => {
                            prll.setFooterState(PullRefreshLoadLayout.State_Footer_LoadFail);
                        });
                    }
                    loadNextPage(context) {
                        let activity = this;
                        return new Promise((resolve, reject) => {
                            fetch(`http://faxnode.duapp.com/gank_api/data/${encodeURIComponent(this.category)}/${GankRefreshLoadListener.ListLoadCount}/${this.nextLoadingPage}`)
                                .then((response) => {
                                return response.json();
                            }).then((json) => {
                                resolve(json.results);
                                this.nextLoadingPage++;
                            }).catch((ex) => {
                                console.error(ex);
                                Toast.makeText(context, '载入失败', Toast.LENGTH_SHORT).show();
                                reject();
                            });
                        });
                    }
                }
                GankRefreshLoadListener.ListLoadCount = 20;
                view.GankRefreshLoadListener = GankRefreshLoadListener;
            })(view = gankwebapp.view || (gankwebapp.view = {}));
        })(gankwebapp = linfaxin.gankwebapp || (linfaxin.gankwebapp = {}));
    })(linfaxin = com.linfaxin || (com.linfaxin = {}));
})(com || (com = {}));
//# sourceMappingURL=app.js.map
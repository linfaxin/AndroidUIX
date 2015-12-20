/**
 * Created by linfaxin on 15/10/6.
 */

//use the deepest sub class as enter

///<reference path="android/view/ViewOverlay.ts"/>
///<reference path="android/view/GestureDetector.ts"/>

///<reference path="android/widget/FrameLayout.ts"/>
///<reference path="android/widget/ScrollView.ts"/>
///<reference path="android/widget/LinearLayout.ts"/>
///<reference path="android/widget/RelativeLayout.ts"/>
///<reference path="android/widget/TextView.ts"/>
///<reference path="android/widget/Button.ts"/>
///<reference path="android/widget/ImageView.ts"/>
///<reference path="android/widget/ImageButton.ts"/>
///<reference path="android/widget/ListView.ts"/>
///<reference path="android/widget/GridView.ts"/>
///<reference path="android/widget/HorizontalScrollView.ts"/>
///<reference path="android/widget/NumberPicker.ts"/>


///<reference path="android/support/v4/view/ViewPager.ts"/>
///<reference path="android/support/v4/widget/ViewDragHelper.ts"/>

///<reference path="lib/com/jakewharton/salvage/RecyclingPagerAdapter.ts"/>



///<reference path="android/app/Activity.ts"/>
///<reference path="androidui/AndroidUI.ts"/>
///<reference path="androidui/image/NetDrawable.ts"/>
///<reference path="androidui/widget/HtmlView.ts"/>
///<reference path="androidui/widget/HtmlImageView.ts"/>
///<reference path="androidui/widget/HtmlDataListAdapter.ts"/>
///<reference path="androidui/widget/HtmlDataPagerAdapter.ts"/>
///<reference path="androidui/widget/HtmlDataPickerAdapter.ts"/>
///<reference path="androidui/widget/PullRefreshLoadLayout.ts"/>

///<reference path="androidui/util/PerformanceAdjuster.ts"/>
///<reference path="androidui/native/NativeApi.ts"/>

window[`android`] = android;
window[`java`] = java;
window[`AndroidUI`] = androidui.AndroidUI;
window.dispatchEvent(new CustomEvent("AndroidUILoadFinish"));

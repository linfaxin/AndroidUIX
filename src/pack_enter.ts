/**
 * Created by linfaxin on 15/10/6.
 */
//use the deepest sub class as enter
///<reference path="android/view/ViewOverlay.ts"/>
///<reference path="android/app/Activity.ts"/>

///<reference path="android/widget/FrameLayout.ts"/>
///<reference path="android/widget/ScrollView.ts"/>
///<reference path="android/widget/LinearLayout.ts"/>
///<reference path="android/widget/TextView.ts"/>

///<reference path="runtime/AndroidUI.ts"/>

window[`android`] = android;
window[`java`] = java;
window[`runtime`] = runtime;
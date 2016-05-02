/**
 * Created by linfaxin on 16/2/11.
 */

///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R/layout.ts"/>

module sample.app {
    import Activity = android.app.Activity;
    import ActionBarActivity = android.app.ActionBarActivity;
    import View = android.view.View;
    import FrameLayout = android.widget.FrameLayout;
    import WebView = android.webkit.WebView;
    import WebViewClient = android.webkit.WebViewClient;

    export class SampleWebViewActivity extends ActionBarActivity{

        webView:WebView;
        protected onCreate(savedInstanceState?:android.os.Bundle):void {
            super.onCreate(savedInstanceState);

            this.webView = new WebView(this);
            this.setContentView(this.webView);
            this.webView.setWebViewClient(new MyWebViewClient(this));

            this.webView.loadUrl('assets/webviewpages/page1.html');
        }


        onBackPressed():void {
            if(this.webView.canGoBack()){
                this.webView.goBack();
                return;
            }
            super.onBackPressed();
        }
    }

    class MyWebViewClient extends WebViewClient{
        activity:SampleWebViewActivity;
        constructor(activity:SampleWebViewActivity) {
            super();
            this.activity = activity;
        }

        onReceivedTitle(view:android.webkit.WebView, title:string):void {
            super.onReceivedTitle(view, title);
            this.activity.setTitle(title);
        }
    }
}
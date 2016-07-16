
///<reference path="../androidui-sdk/android-ui.d.ts"/>
///<reference path="../gen/R.ts"/>

module com.linfaxin.gankwebapp {
    import Activity = android.app.Activity;
    import ActionBarActivity = android.app.ActionBarActivity;
    import TextView = android.widget.TextView;
    import Button = android.widget.Button;
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import LinearLayout = android.widget.LinearLayout;
    import Gravity = android.view.Gravity;
    import Log = android.util.Log;
    import Color = android.graphics.Color;
    import BaseAdapter = android.widget.BaseAdapter;
    import ListView = android.widget.ListView;
    import PullRefreshLoadLayout = androidui.widget.PullRefreshLoadLayout;
    import Toast = android.widget.Toast;
    import ImageView = android.widget.ImageView;
    import ViewPager = android.support.v4.view.ViewPager;
    import WebView = android.webkit.WebView;
    import WebViewClient = android.webkit.WebViewClient;


    export class WebViewActivity extends ActionBarActivity {
        static Extra_Title = 'title';
        static Extra_Url = 'url';

        private webView:WebView;
        onCreate(savedInstanceState?:android.os.Bundle):void {
            super.onCreate(savedInstanceState);
            const activity = this;

            var title = this.getIntent().getStringExtra(WebViewActivity.Extra_Title);
            this.setTitle(title || '网页');
            var url = this.getIntent().getStringExtra(WebViewActivity.Extra_Url);
            if(!url){
                this.finish();
                return;
            }

            this.webView = new WebView(this);
            this.setContentView(this.webView);

            this.webView.loadUrl(url);

            let webViewClient = new WebViewClient();
            webViewClient.onReceivedTitle = (view:WebView, title:string)=>{
                this.setTitle(title);
            };
            this.webView.setWebViewClient(webViewClient);
        }


        onBackPressed():void {
            if(this.webView.canGoBack()){
                this.webView.goBack();
                return;
            }
            super.onBackPressed();
        }
    }


}
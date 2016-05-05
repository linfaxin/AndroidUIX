///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/webkit/WebView.ts"/>
///<reference path="../../android/app/Activity.ts"/>
///<reference path="NativeApi.ts"/>

module androidui.native{
    import View = android.view.View;
    import WebView = android.webkit.WebView;
    import WebViewClient = android.webkit.WebViewClient;
    import Rect = android.graphics.Rect;
    import Activity = android.app.Activity;

    const anchor = document.createElement('a');
    const webViewMap = new Map<number, NativeWebView>();

    export class NativeWebView extends WebView{
        private mBoundRect = new Rect();
        private mRectTmp = new Rect();
        private mLocationTmp = androidui.util.ArrayCreator.newNumberArray(2);
        
        private mUrl:string;
        private mTitle:string;
        private mCanGoBack:boolean;

        constructor(context:android.content.Context, bindElement:HTMLElement, defStyle:any) {
            super(context, bindElement, defStyle);

            NativeApi.webView.createWebView(this.hashCode());
            webViewMap.set(this.hashCode(), this);

            //override activity's onDestroy
            let activity = <Activity>this.getContext();
            let onDestroy = activity.onDestroy;
            activity.onDestroy = ()=>{
                onDestroy.call(activity);
                webViewMap.delete(this.hashCode());
                NativeApi.webView.destroyWebView(this.hashCode());
            };
        }
        
        goBack():void {
            NativeApi.webView.webViewGoBack(this.hashCode());
        }

        canGoBack():boolean {
            return this.mCanGoBack;
        }

        loadUrl(url:string):void {
            anchor.href = url;
            url = anchor.href;
            
            this.mUrl = url;
            NativeApi.webView.webViewLoadUrl(this.hashCode(), url);
        }

        reload():void {
            NativeApi.webView.webViewReload(this.hashCode());
        }

        getUrl():string {
            return this.mUrl;
        }

        getTitle():string {
            return this.mTitle || this.getUrl();
        }

        setWebViewClient(client:android.webkit.WebViewClient):void {
            super.setWebViewClient(client);
        }

        protected dependOnDebugLayout():boolean {
            return false;
        }
        
        protected _syncBoundAndScrollToElement():void {
            super._syncBoundAndScrollToElement();

            this.getLocationOnScreen(this.mLocationTmp);
            this.mRectTmp.set(this.mLocationTmp[0], this.mLocationTmp[1], this.mLocationTmp[0] + this.getWidth(), this.mLocationTmp[1] + this.getHeight());
            if(!this.mRectTmp.equals(this.mBoundRect)){
                this.mBoundRect.set(this.mRectTmp);
                NativeApi.webView.webViewBoundChange(this.hashCode(), this.mBoundRect.left, this.mBoundRect.top, this.mBoundRect.right, this.mBoundRect.bottom);
            }
        }

        private static notifyLoadFinish(viewHash:number, url:string, title:string):void {
            let nativeWebView = webViewMap.get(viewHash);
            if(nativeWebView==null) return;
            nativeWebView.mUrl = url;
            nativeWebView.mTitle = title;
            if(nativeWebView.mClient!=null){
                nativeWebView.mClient.onReceivedTitle(nativeWebView, title);
                nativeWebView.mClient.onPageFinished(nativeWebView, url);
            }
        }

        private static notifyWebViewHistoryChange(viewHash:number, currentHistoryIndex:number, historySize:number):void {
            let nativeWebView = webViewMap.get(viewHash);
            if(nativeWebView==null) return;
            nativeWebView.mCanGoBack = currentHistoryIndex > 0;
        }
    }
}
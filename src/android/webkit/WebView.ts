///<reference path="../../androidui/widget/HtmlBaseView.ts"/>
///<reference path="WebViewClient.ts"/>



module android.webkit {
    import HtmlBaseView = androidui.widget.HtmlBaseView;
    import Activity = android.app.Activity;

    /**
     * AndroidUI NOTE: can't call any webview's methods when host activity was pause
     * some method can't work fine when load other host's page (Cross domain)
     * WARN: webView may make history stack weirdly when webView load to other url after first url loaded.
     */
    export class WebView extends HtmlBaseView {
        private iFrameElement:HTMLIFrameElement;
        private mClient:WebViewClient;
        private initIFrameHistoryLength = -1;

        constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle?:any) {
            super(context, bindElement, defStyle);

            //default size
            let density = this.getResources().getDisplayMetrics().density;
            this.setMinimumWidth(300 * density);
            this.setMinimumHeight(150 * density);
            // this.initIFrameElement(); //init when call loadUrl()
        }

        private initIFrameElement(url:string){
            this.iFrameElement = document.createElement('iframe');
            this.iFrameElement.style.border = 'none';
            this.iFrameElement.style.height = '100%';
            this.iFrameElement.style.width = '100%';
            this.iFrameElement.onload = ()=>{
                this.checkActivityResume();
                if(this.initIFrameHistoryLength<0) this.initIFrameHistoryLength = history.length;
                if(this.mClient){
                    this.mClient.onReceivedTitle(this, this.getTitle());
                    this.mClient.onPageFinished(this, this.getUrl());
                }
            };
            this.bindElement.style['webkitOverflowScrolling'] = this.bindElement.style['overflowScrolling'] = 'touch';
            this.bindElement.style.overflowY = 'auto';

            if(url) this.iFrameElement.src = url;
            this.bindElement.appendChild(this.iFrameElement);


            //override activity's onDestroy
            let activity = <Activity>this.getContext();
            let onDestroy = activity.onDestroy;
            activity.onDestroy = ()=>{
                onDestroy.call(activity);
                PageStack.preClosePageHasIFrame(this.initIFrameHistoryLength);
            };
        }

        private checkActivityResume(){
            if(!(<Activity>this.getContext()).mResumed){
                console.error('can\'t call any webview\'s methods when host activity was pause');
            }
        }

        goBack():void {
            this.checkActivityResume();
            if(this.canGoBack()){
                history.back();
            }
        }

        canGoBack():boolean {
            this.checkActivityResume();
            if(this.initIFrameHistoryLength<0) return false;
            return history.length > this.initIFrameHistoryLength;
        }

        /**
         * Loads the given URL.
         *
         * @param url the URL of the resource to load
         */
        loadUrl(url:string):void {
            if(this.initIFrameHistoryLength>0){//iframe already loaded, should check.
                this.checkActivityResume();
            }
            if(!this.iFrameElement){
                this.initIFrameElement(url);
            }

            if(this.mClient) this.mClient.onPageStarted(this, url);
            this.iFrameElement.src = url;
        }

        loadData(data:string):void  {
            if(!this.iFrameElement) this.initIFrameElement('');
            this.iFrameElement['srcdoc'] = data;
        }

        evaluateJavascript(script:string):any {
            try {
                eval.call(this.iFrameElement.contentWindow, script);
            } catch (e) {
                console.warn(e);
                eval(script);
            }
        }

        /**
         * Stops the current load.
         */
        stopLoading():void  {
            if(!this.iFrameElement) return;
            try {
                this.iFrameElement.contentWindow['stop']();
            } catch (e) {
                console.error(e);
            }
        }

        /**
         * Reloads the current URL.
         */
        reload():void {
            if(!this.iFrameElement) return;
            try {
                this.iFrameElement.contentWindow.location.reload();
            } catch (e) {
                this.iFrameElement.src = this.iFrameElement.src;
            }
        }

        /**
         * Gets the URL for the current page. This is not always the same as the URL
         * passed to WebViewClient.onPageStarted because although the load for
         * that URL has begun, the current page may not have changed.
         *
         * @return the URL for the current page
         */
        getUrl():string  {
            if(!this.iFrameElement) return '';
            try {
                return this.iFrameElement.contentWindow.document.URL;
            } catch (e) {
                return this.iFrameElement.src;
            }
        }

        /**
         * Gets the title for the current page. This is the title of the current page
         * until WebViewClient.onReceivedTitle is called.
         *
         * @return the title for the current page
         */
        getTitle():string  {
            try {
                return this.iFrameElement.contentWindow.document.title;
            } catch (e) {
                console.warn(e);
                return '';
            }
        }

        /**
         * Gets the height of the HTML content.
         *
         * @return the height of the HTML content
         */
        getContentHeight():number  {
            try {
                return this.iFrameElement.contentWindow.document.documentElement.offsetHeight;
            } catch (e) {
                console.warn(e);
                return 0;
            }
        }

        /**
         * Gets the width of the HTML content.
         *
         * @return the width of the HTML content
         * @hide
         */
        getContentWidth():number  {
            try {
                return this.iFrameElement.contentWindow.document.documentElement.offsetWidth;
            } catch (e) {
                console.warn(e);
                return 0;
            }
        }

        /**
         * Sets the WebViewClient that will receive various notifications and
         * requests. This will replace the current handler.
         *
         * @param client an implementation of WebViewClient
         */
        setWebViewClient(client:WebViewClient):void  {
            this.mClient = client;
        }
    }
}
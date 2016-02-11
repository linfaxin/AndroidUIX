///<reference path="../widget/FrameLayout.ts"/>
///<reference path="WebViewClient.ts"/>



module android.webkit {
    import FrameLayout = android.widget.FrameLayout;

    export class WebView extends FrameLayout {
        private iFrameElement:HTMLIFrameElement;
        private mClient:WebViewClient;

        constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle?:any) {
            super(context, bindElement, defStyle);

            //default size
            let density = this.getResources().getDisplayMetrics().density;
            this.setMinimumWidth(300 * density);
            this.setMinimumHeight(150 * density);
            this.initIFrameElement();
        }

        private initIFrameElement(){
            this.iFrameElement = document.createElement('iframe');
            this.iFrameElement.style.border = 'none';
            this.iFrameElement.style.height = '100%';
            this.iFrameElement.style.width = '100%';
            this.iFrameElement.onload = ()=>{
                if(this.mClient){
                    this.mClient.onReceivedTitle(this, this.getTitle());
                    this.mClient.onPageFinished(this, this.iFrameElement.src);
                }
            };
            this.bindElement.appendChild(this.iFrameElement);

        }

        /**
         * Loads the given URL.
         *
         * @param url the URL of the resource to load
         */
        loadUrl(url:string):void  {
            if(this.mClient) this.mClient.onPageStarted(this, url);
            this.iFrameElement.src = url;
        }

        loadData(data:string):void  {
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
            this.iFrameElement.src = this.iFrameElement.src;
        }

        /**
         * Gets the URL for the current page. This is not always the same as the URL
         * passed to WebViewClient.onPageStarted because although the load for
         * that URL has begun, the current page may not have changed.
         *
         * @return the URL for the current page
         */
        getUrl():string  {
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
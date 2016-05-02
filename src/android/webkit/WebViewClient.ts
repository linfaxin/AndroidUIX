///<reference path="WebView.ts"/>

module android.webkit {
    export class WebViewClient {
        onPageFinished(view:WebView, url:string):void  {

        }

        /**
         * Notify the host application of a change in the document title.
         * @param view The WebView that initiated the callback.
         * @param title A String containing the new title of the document.
         */
        onReceivedTitle(view:WebView, title:string):void  {
        }
    }
}
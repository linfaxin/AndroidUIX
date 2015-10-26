/**
 * Created by linfaxin on 15/10/11.
 */
///<reference path="../view/View.ts"/>
///<reference path="../view/ViewRootImpl.ts"/>
///<reference path="../widget/FrameLayout.ts"/>
///<reference path="../view/MotionEvent.ts"/>
///<reference path="../../runtime/AndroidUI.ts"/>

module android.app{
    import AndroidUI = runtime.AndroidUI;
    import View = android.view.View;
    import ViewRootImpl = android.view.ViewRootImpl;
    import FrameLayout = android.widget.FrameLayout;
    import MotionEvent = android.view.MotionEvent;


    if (typeof HTMLDivElement !== 'function'){
        var _HTMLDivElement = function(){};
        _HTMLDivElement.prototype = HTMLDivElement.prototype;
        HTMLDivElement = <any>_HTMLDivElement;
    }


    export class Activity extends HTMLDivElement{
        private androidUI:AndroidUI;
        onCreate():void{
        }

        createdCallback():void{
            this.androidUI = new AndroidUI(this);
            this.onCreate();
        }
        attachedCallback():void {
            this.androidUI.notifySizeChange(this.offsetWidth, this.offsetHeight);
        }
        detachedCallback():void {
        }
        attributeChangedCallback(attributeName:string, oldVal:string, newVal:string):void {
        }


        setContentView(view:View){
            this.androidUI.setContentView(view);
        }
        addContentView(view:View){
            this.androidUI.addContentView(view);
        }
        findViewById(id:string):View{
            return this.androidUI.findViewById(id);
        }
    }
}
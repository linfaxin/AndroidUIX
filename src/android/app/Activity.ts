/**
 * Created by linfaxin on 15/10/11.
 */
///<reference path="../view/View.ts"/>
///<reference path="../view/ViewRootImpl.ts"/>
///<reference path="../widget/FrameLayout.ts"/>
///<reference path="../view/MotionEvent.ts"/>
///<reference path="../../androidui/AndroidUI.ts"/>

module android.app{
    import AndroidUI = androidui.AndroidUI;
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
        private AndroidUI:AndroidUI;
        onCreate():void{
        }

        createdCallback():void{
            //delay call onCreate, insure browser load lib complete
            requestAnimationFrame(()=>{
                this.AndroidUI = new AndroidUI(this);
                this.onCreate();
                //activity could have a attribute defined callback when created
                let onCreateFunc = this.getAttribute('oncreate');
                if(onCreateFunc && typeof window[onCreateFunc] === "function"){
                    window[onCreateFunc].call(this, this);
                }
            });
        }
        attachedCallback():void {
            if(this.AndroidUI){
                this.AndroidUI.notifySizeChange();
            }else{
                //delay call onCreate, insure browser load lib complete
                setTimeout(()=>{
                    this.AndroidUI.notifySizeChange();
                }, 50);
            }
        }
        detachedCallback():void {
        }
        attributeChangedCallback(attributeName:string, oldVal:string, newVal:string):void {
        }


        setContentView(view:View){
            this.AndroidUI.setContentView(view);
        }
        addContentView(view:View){
            this.AndroidUI.addContentView(view);
        }
        findViewById(id:string):View{
            return this.AndroidUI.findViewById(id);
        }

        static registerCustomElement(){
            (<any> document).registerElement("android-"+this.name, this);
        }
    }
    Activity.registerCustomElement();
}
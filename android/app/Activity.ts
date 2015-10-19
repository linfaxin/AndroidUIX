/**
 * Created by linfaxin on 15/10/11.
 */
///<reference path="../view/View.ts"/>
///<reference path="../view/ViewRootImpl.ts"/>
///<reference path="../widget/FrameLayout.ts"/>
///<reference path="../view/MotionEvent.ts"/>


module android.app{
    import View = android.view.View;
    import ViewRootImpl = android.view.ViewRootImpl;
    import FrameLayout = android.widget.FrameLayout;
    import MotionEvent = android.view.MotionEvent;


    class RootLayout extends FrameLayout{
    }

    if (typeof HTMLDivElement !== 'function'){
        var _HTMLDivElement = function(){};
        _HTMLDivElement.prototype = HTMLDivElement.prototype;
        HTMLDivElement = <any>_HTMLDivElement;
    }
    export class Activity extends HTMLDivElement{
        viewRootImpl:ViewRootImpl;
        rootLayout:RootLayout;
        canvas:HTMLCanvasElement;
        createdCallback():void{
            this.viewRootImpl = new ViewRootImpl();
            this.rootLayout = new RootLayout();
            Array.from(this.children).forEach((item)=>{
                if(item instanceof HTMLElement){
                    let view = View.inflate(item);
                    if(view) this.addContentView(view);
                }
            });
            this.innerHTML = '';


            if(!this.style.position){
                this.style.position = "relative";
            }
            if(!this.style.display){
                this.style.display = "inline-block";
            }
            this.style.overflow = 'hidden';


            this.canvas = document.createElement("canvas");
            let canvas = this.canvas;
            this.appendChild(canvas);
            canvas.style.position = "absolute";
            canvas.style.left = '0px';
            canvas.style.top = '0px';
            canvas.style.right = '0px';
            canvas.style.bottom = '0px';
            //canvas.style.width = '100%';
            //canvas.style.height = '100%';

            this.appendChild(this.rootLayout.bindElement);


            this.viewRootImpl.setView(this.rootLayout);
            this.viewRootImpl.initSurface(canvas);

            this.initTouch();
        }
        attachedCallback():void {
            this.viewRootImpl.mWinFrame.set(0, 0, this.offsetWidth, this.offsetHeight);
            this.canvas.width = this.offsetWidth;
            this.canvas.height = this.offsetHeight;
            this.viewRootImpl.requestLayout();
        }
        detachedCallback():void {
        }
        attributeChangedCallback(attributeName:string, oldVal:string, newVal:string):void {
        }

        private initTouch(){
            let motionEvent:MotionEvent;
            let windowXOffset=0, windowYOffset=0;
            this.addEventListener('touchstart', (e)=>{
                e.preventDefault();
                e.stopPropagation();
                let rootViewBound = this.getBoundingClientRect();//do on touch start
                windowXOffset = rootViewBound.left;
                windowYOffset = rootViewBound.top;


                if(!motionEvent) motionEvent = MotionEvent.obtainWithTouchEvent(<any>e, MotionEvent.ACTION_DOWN);
                else motionEvent.init(<any>e, MotionEvent.ACTION_DOWN, windowXOffset, windowYOffset);
                this.rootLayout.dispatchTouchEvent(motionEvent);
            }, true);
            this.addEventListener('touchmove', (e)=>{
                e.preventDefault();
                e.stopPropagation();
                motionEvent.init(<any>e, MotionEvent.ACTION_MOVE, windowXOffset, windowYOffset);
                this.rootLayout.dispatchTouchEvent(motionEvent);
            }, true);
            this.addEventListener('touchend', (e)=>{
                e.preventDefault();
                e.stopPropagation();
                motionEvent.init(<any>e, MotionEvent.ACTION_UP);
                this.rootLayout.dispatchTouchEvent(motionEvent);
            }, true);
            this.addEventListener('touchcancel', (e)=>{
                e.preventDefault();
                e.stopPropagation();
                motionEvent.init(<any>e, MotionEvent.ACTION_CANCEL, windowXOffset, windowYOffset);
                this.rootLayout.dispatchTouchEvent(motionEvent);
            }, true);
        }

        setContentView(view:View){
            this.rootLayout.removeAllViews();
            this.rootLayout.addView(view);
        }
        addContentView(view:View){
            this.rootLayout.addView(view);
        }
        findViewById(id:string):View{
            return this.rootLayout.findViewById(id);
        }
    }

    class Root extends Activity{}

    (<any> document).registerElement("android-rootview", Root);
    (<any> document).registerElement("android-activity", Activity);


}
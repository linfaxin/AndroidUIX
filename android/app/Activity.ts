/**
 * Created by linfaxin on 15/10/11.
 */
///<reference path="../view/View.ts"/>
///<reference path="../view/ViewRootImpl.ts"/>
///<reference path="../widget/FrameLayout.ts"/>

module android.app{
    import View = android.view.View;
    import ViewRootImpl = android.view.ViewRootImpl;
    import FrameLayout = android.widget.FrameLayout;


    class RootLayout extends FrameLayout{
    }

    if (typeof HTMLDivElement !== 'function'){
        var _HTMLDivElement = function(){};
        _HTMLDivElement.prototype = HTMLDivElement.prototype;
        HTMLDivElement = <any>_HTMLDivElement;
    }
    export class Activity extends HTMLDivElement{
        viewRootImpl:ViewRootImpl;
        content:RootLayout;
        canvas:HTMLCanvasElement;
        createdCallback():void{
            this.viewRootImpl = new ViewRootImpl();
            this.content = new RootLayout();
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

            this.appendChild(this.content.bindElement);


            this.viewRootImpl.setView(this.content);
            this.viewRootImpl.initSurface(canvas);

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

        setContentView(view:View){
            this.content.removeAllViews();
            this.content.addView(view);
        }
        addContentView(view:View){
            this.content.addView(view);
        }
        findViewById(id:string):View{
            return this.content.findViewById(id);
        }
    }

    class Root extends Activity{}

    (<any> document).registerElement("android-rootview", Root);
    (<any> document).registerElement("android-activity", Activity);

}
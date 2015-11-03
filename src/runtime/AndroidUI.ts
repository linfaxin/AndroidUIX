/**
 * Created by linfaxin on 15/10/23.
 */
///<reference path="../android/view/View.ts"/>
///<reference path="../android/view/ViewGroup.ts"/>
///<reference path="../android/view/ViewRootImpl.ts"/>
///<reference path="../android/widget/FrameLayout.ts"/>
///<reference path="../android/view/MotionEvent.ts"/>

/**
 * Bridge between Html Element and Android View
 */
module runtime {
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import ViewRootImpl = android.view.ViewRootImpl;
    import FrameLayout = android.widget.FrameLayout;
    import MotionEvent = android.view.MotionEvent;

    export class AndroidUI {
        element:HTMLElement;

        private canvas:HTMLCanvasElement;
        viewRootImpl:ViewRootImpl;
        private rootLayout:RootLayout;
        private rootStyleElement:HTMLStyleElement;
        private rootResourceElement:Element;

        constructor(element:HTMLElement) {
            this.element = element;
            if(element['AndroidUI']){
                throw Error('already init a AndroidUI with this element');
            }
            element['AndroidUI'] = this;
            this.init();
        }


        private init() {
            this.viewRootImpl = new ViewRootImpl();
            this.viewRootImpl.rootElement = this.element;
            this.rootLayout = new RootLayout();
            this.canvas = document.createElement("canvas");

            this.initInflateView();
            this.initRootElementStyle();
            this.initCanvasStyle();
            this.initBindElementStyle();

            this.element.innerHTML = '';
            this.element.appendChild(this.rootStyleElement);
            this.element.appendChild(this.canvas);
            this.element.appendChild(this.rootLayout.bindElement);//can show the layout with dev mode in browser

            this.viewRootImpl.setView(this.rootLayout);
            this.viewRootImpl.initSurface(this.canvas);

            this.initTouch();

            this.tryStartLayoutAfterInit();
        }

        private initInflateView() {
            Array.from(this.element.children).forEach((item)=> {
                if(item.tagName==='resources'){
                    this.rootResourceElement = item;

                }else if (item instanceof HTMLStyleElement) {
                    this.rootStyleElement = item;

                }else if (item instanceof HTMLElement) {
                    let view = View.inflate(this.element, item);
                    if (view) this.rootLayout.addView(view, -1, -1);
                }
            });
        }

        private initRootElementStyle() {
            if (!this.element.style.position) {
                this.element.style.position = "relative";
            }
            if (!this.element.style.display || this.element.style.display=="none") {
                this.element.style.display = "inline-block";
            }
            this.element.style.overflow = 'hidden';
        }

        private initCanvasStyle() {
            let canvas = this.canvas;
            canvas.style.position = "absolute";
            canvas.style.left = '0px';
            canvas.style.top = '0px';
            //canvas.style.right = '0px';
            //canvas.style.bottom = '0px';
        }

        private initTouch() {
            let motionEvent:MotionEvent;
            let windowXOffset = 0, windowYOffset = 0;
            this.element.addEventListener('touchstart', (e)=> {
                e.preventDefault();
                e.stopPropagation();
                let rootViewBound = this.element.getBoundingClientRect();//get viewRoot bound on touch start
                windowXOffset = rootViewBound.left;
                windowYOffset = rootViewBound.top;


                if (!motionEvent) motionEvent = MotionEvent.obtainWithTouchEvent(<any>e, MotionEvent.ACTION_DOWN);
                else motionEvent.init(<any>e, MotionEvent.ACTION_DOWN, windowXOffset, windowYOffset);
                this.rootLayout.dispatchTouchEvent(motionEvent);
            }, true);
            this.element.addEventListener('touchmove', (e)=> {
                e.preventDefault();
                e.stopPropagation();
                motionEvent.init(<any>e, MotionEvent.ACTION_MOVE, windowXOffset, windowYOffset);
                this.rootLayout.dispatchTouchEvent(motionEvent);
            }, true);
            this.element.addEventListener('touchend', (e)=> {
                e.preventDefault();
                e.stopPropagation();
                motionEvent.init(<any>e, MotionEvent.ACTION_UP);
                this.rootLayout.dispatchTouchEvent(motionEvent);
            }, true);
            this.element.addEventListener('touchcancel', (e)=> {
                e.preventDefault();
                e.stopPropagation();
                motionEvent.init(<any>e, MotionEvent.ACTION_CANCEL, windowXOffset, windowYOffset);
                this.rootLayout.dispatchTouchEvent(motionEvent);
            }, true);
        }

        private initBindElementStyle() {
            if (!this.rootStyleElement) this.rootStyleElement = document.createElement("style");
            this.rootStyleElement.setAttribute("scoped", '');

            this.rootStyleElement.innerHTML += `
                * {
                    overflow : hidden;
                }
                Button {
                    border: none;
                    background: none;
                }
                `;

            let iOS = /iPad|iPhone|iPod/.test(navigator.platform);
            if (iOS) {
                this.rootStyleElement.innerHTML += `
                    android-ScrollView::-webkit-scrollbar {
                        -webkit-appearance: none;
                        width: 4px;
                    }
                    android-ScrollView::-webkit-scrollbar-thumb {
                        border-radius: 2px;
                        background-color: rgba(0,0,0,.3);
                    }
                `;
            }

            let density = android.content.res.Resources.getDisplayMetrics().density;
            if(density!=1){
                this.rootStyleElement.innerHTML += `
                android-RootLayout {
                    transform:scale(${1/density},${1/density});
                    -webkit-transform:scale(${1/density},${1/density});
                    transform-origin:0 0;
                    -webkit-transform-origin:0 0;
                }
                `;
            }
        }

        private tryStartLayoutAfterInit(){
            let width = this.element.offsetWidth;
            let height = this.element.offsetHeight;
            if(width>0 && height>0) this.notifySizeChange(width, height);
        }

        notifySizeChange(width:number, height:number){
            let density = android.content.res.Resources.getDisplayMetrics().density;
            this.viewRootImpl.mWinFrame.set(0, 0, width * density, height * density);
            this.canvas.width = width * density;
            this.canvas.height = height * density;
            this.canvas.style.width = width + "px";
            this.canvas.style.height = height + "px";
            this.viewRootImpl.requestLayout();
        }

        setContentView(view:View){
            this.rootLayout.removeAllViews();
            this.rootLayout.addView(view, -1, -1);
        }
        addContentView(view:View, params = new ViewGroup.LayoutParams(-1, -1)){
            this.rootLayout.addView(view, params);
        }
        findViewById(id:string):View{
            return this.rootLayout.findViewById(id);
        }
    }

    class RootLayout extends FrameLayout{}
}
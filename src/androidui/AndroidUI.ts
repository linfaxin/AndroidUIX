/**
 * Created by linfaxin on 15/10/23.
 */
///<reference path="../android/view/View.ts"/>
///<reference path="../android/view/ViewGroup.ts"/>
///<reference path="../android/view/ViewRootImpl.ts"/>
///<reference path="../android/widget/FrameLayout.ts"/>
///<reference path="../android/view/MotionEvent.ts"/>
///<reference path="../android/view/KeyEvent.ts"/>

/**
 * Bridge between Html Element and Android View
 */
module androidui {
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import ViewRootImpl = android.view.ViewRootImpl;
    import FrameLayout = android.widget.FrameLayout;
    import MotionEvent = android.view.MotionEvent;
    import KeyEvent = android.view.KeyEvent;

    let sNextAndroidID = 0;

    export class AndroidUI {
        static DomClassName = 'AndroidUI';
        static BindTOElementName = 'AndroidUI';

        element:HTMLElement;

        private _canvas:HTMLCanvasElement;
        private _viewRootImpl:ViewRootImpl;
        private _rootLayout:RootLayout;
        private rootStyleElement:HTMLStyleElement;
        private rootResourceElement:Element;

        private _windowBound = new android.graphics.Rect();
        private tempRect = new android.graphics.Rect();
        get windowBound():android.graphics.Rect{
            return this._windowBound;
        }
        private motionEvent = new MotionEvent();
        private ketEvent = new KeyEvent();
        private AndroidID:number;

        constructor(element:HTMLElement) {
            this.element = element;
            if(element[AndroidUI.BindTOElementName]){
                throw Error('already init a AndroidUI with this element');
            }
            element[AndroidUI.BindTOElementName] = this;
            this.init();
        }


        private init() {
            this.AndroidID = sNextAndroidID++;
            this.element.classList.add(AndroidUI.DomClassName);
            this.element.classList.add('id-'+this.AndroidID);

            this._viewRootImpl = new ViewRootImpl();
            this._viewRootImpl.rootElement = this.element;
            this._rootLayout = new RootLayout();
            this._canvas = document.createElement("canvas");

            this.initInflateView();
            this.element.innerHTML = '';

            this.initElementStyle();
            this.element.appendChild(this.rootResourceElement);
            if(this.rootStyleElement) this.element.appendChild(this.rootStyleElement);
            this.element.appendChild(this._canvas);
            this.element.appendChild(this._rootLayout.bindElement);

            this._viewRootImpl.setView(this._rootLayout);
            this._viewRootImpl.initSurface(this._canvas);

            this.initFocus();
            this.initEvent();

            this.initListenSizeChange();
        }

        private initInflateView() {
            Array.from(this.element.children).forEach((item)=> {
                if(item.tagName.toLowerCase()==='resources'){
                    this.rootResourceElement = item;

                }else if (item instanceof HTMLStyleElement) {
                    this.rootStyleElement = item;

                }else if (item instanceof HTMLElement) {
                    let view = View.inflate(item, this.element, this._rootLayout);
                    if (view) this._rootLayout.addView(view);
                }
            });
        }

        private initElementStyle() {
            if (!this.rootStyleElement){
                this.rootStyleElement = document.createElement("style");
            }
            this.rootStyleElement.setAttribute('scoped', '');//don't set scoped, or safari will lose the style

            let density = android.content.res.Resources.getDisplayMetrics().density;
            if(density!=1){
                this.rootStyleElement.innerHTML += `
                .${AndroidUI.DomClassName}.id-${this.AndroidID} RootLayout {
                    transform:scale(${1/density},${1/density});
                    -webkit-transform:scale(${1/density},${1/density});
                    transform-origin:0 0;
                    -webkit-transform-origin:0 0;
                }
                `;
            }

            if (this.element.style.display==='none') {
                this.element.style.display = '';
            }

            if(this.rootStyleElement.innerHTML.length==0){
                this.rootStyleElement = null;
            }
        }


        private refreshWindowBound(){
            let rootViewBound = this.element.getBoundingClientRect();//get viewRoot bound on touch start
            this._windowBound.set(rootViewBound.left, rootViewBound.top, rootViewBound.right, rootViewBound.bottom);
        }

        private initFocus(){
            this.element.setAttribute('tabindex', '0');//let element could get focus. so the key event can handle.
            this.element.focus();
        }

        private initEvent(){
            this.initTouchEvent();
            this.initMouseEvent();
            this.initKeyEvent();
            this.initGenericEvent();
        }

        private initTouchEvent() {
            this.element.addEventListener('touchstart', (e)=> {
                this.refreshWindowBound();

                e.preventDefault();
                e.stopPropagation();
                this.element.focus();

                this.motionEvent.initWithTouch(<any>e, MotionEvent.ACTION_DOWN, this._windowBound);
                this._viewRootImpl.dispatchInputEvent(this.motionEvent);
            }, true);
            this.element.addEventListener('touchmove', (e)=> {
                e.preventDefault();
                e.stopPropagation();
                this.motionEvent.initWithTouch(<any>e, MotionEvent.ACTION_MOVE, this._windowBound);
                this._viewRootImpl.dispatchInputEvent(this.motionEvent);
            }, true);
            this.element.addEventListener('touchend', (e)=> {
                e.preventDefault();
                e.stopPropagation();
                this.motionEvent.initWithTouch(<any>e, MotionEvent.ACTION_UP, this._windowBound);
                this._viewRootImpl.dispatchInputEvent(this.motionEvent);
            }, true);
            this.element.addEventListener('touchcancel', (e)=> {
                e.preventDefault();
                e.stopPropagation();
                this.motionEvent.initWithTouch(<any>e, MotionEvent.ACTION_CANCEL, this._windowBound);
                this._viewRootImpl.dispatchInputEvent(this.motionEvent);
            }, true);
        }

        private initMouseEvent(){
            function mouseToTouchEvent(e:MouseEvent){
                let touch:Touch = {
                    identifier: 0,
                    target: null,
                    screenX: e.screenX,
                    screenY: e.screenY,
                    clientX: e.clientX,
                    clientY: e.clientY,
                    pageX: e.pageX,
                    pageY: e.pageY
                };
                return {
                    changedTouches : [touch],
                    targetTouches : [touch],
                    touches : e.type === 'mouseup' ? [] : [touch],
                    timeStamp : e.timeStamp
                };
            }
            let isMouseDown = false;

            this.element.addEventListener('mousedown', (e:MouseEvent)=> {
                isMouseDown = true;
                this.refreshWindowBound();

                e.preventDefault();
                e.stopPropagation();
                this.element.focus();

                this.motionEvent.initWithTouch(<any>mouseToTouchEvent(e), MotionEvent.ACTION_DOWN, this._windowBound);
                this._viewRootImpl.dispatchInputEvent(this.motionEvent);
            }, true);

            this.element.addEventListener('mousemove', (e)=> {
                if(!isMouseDown) return;
                e.preventDefault();
                e.stopPropagation();
                this.motionEvent.initWithTouch(<any>mouseToTouchEvent(e), MotionEvent.ACTION_MOVE, this._windowBound);
                this._viewRootImpl.dispatchInputEvent(this.motionEvent);
            }, true);

            this.element.addEventListener('mouseup', (e)=> {
                isMouseDown = false;
                e.preventDefault();
                e.stopPropagation();
                this.motionEvent.initWithTouch(<any>mouseToTouchEvent(e), MotionEvent.ACTION_UP, this._windowBound);
                this._viewRootImpl.dispatchInputEvent(this.motionEvent);
            }, true);

            this.element.addEventListener('mouseleave', (e)=> {
                if(e.fromElement === this.element){
                    isMouseDown = false;
                    e.preventDefault();
                    e.stopPropagation();
                    this.motionEvent.initWithTouch(<any>mouseToTouchEvent(e), MotionEvent.ACTION_CANCEL, this._windowBound);
                    this._viewRootImpl.dispatchInputEvent(this.motionEvent);
                }
            }, true);

        }

        private initKeyEvent(){
            this.element.addEventListener('keydown', (e:KeyboardEvent)=> {
                this.ketEvent.appendKeyEvent(e, KeyEvent.ACTION_DOWN);
                if(this._viewRootImpl.dispatchInputEvent(this.ketEvent)){
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, true);
            this.element.addEventListener('keyup', (e:KeyboardEvent)=> {
                this.ketEvent.appendKeyEvent(e, KeyEvent.ACTION_UP);
                if(this._viewRootImpl.dispatchInputEvent(this.ketEvent)){
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, true);

        }
        private initGenericEvent(){
            //FIXME convert to MotionEvent
            this.element.addEventListener('mousewheel', (e:MouseWheelEvent)=> {
                let focus = this._rootLayout.findFocus();
                if(focus && focus.dispatchGenericMotionEvent(e)){
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, true);
        }

        private initListenSizeChange(){
            window.addEventListener('resize', ()=>{
                this.notifySizeChange();
            });

            let lastWidth = this.element.offsetWidth;
            let lastHeight = this.element.offsetHeight;
            if(lastWidth>0 && lastHeight>0) this.notifySizeChange();
            setInterval(()=>{
                let width = this.element.offsetWidth;
                let height = this.element.offsetHeight;
                if(lastHeight !== height || lastWidth !== width){
                    lastWidth = width;
                    lastHeight = height;
                    this.notifySizeChange();
                }
            }, 300);
        }

        notifySizeChange(){
            this.refreshWindowBound();
            let density = android.content.res.Resources.getDisplayMetrics().density;
            this.tempRect.set(this._windowBound.left* density, this._windowBound.top* density,
                this._windowBound.right * density, this._windowBound.bottom * density);
            this._viewRootImpl.dispatchResized(this.tempRect);
            let width = this._windowBound.width();
            let height = this._windowBound.height();
            this._canvas.width = width * density;
            this._canvas.height = height * density;
            this._canvas.style.width = width + "px";
            this._canvas.style.height = height + "px";
        }

        setContentView(view:View){
            this._rootLayout.removeAllViews();
            this._rootLayout.addView(view, -1, -1);
        }
        addContentView(view:View, params = new ViewGroup.LayoutParams(-1, -1)){
            this._rootLayout.addView(view, params);
        }
        findViewById(id:string):View{
            return this._rootLayout.findViewById(id);
        }
    }

    //init common style
    let styleElement = document.createElement('style');
    styleElement.innerHTML += `
        .${AndroidUI.DomClassName} {
            position : relative;
            overflow : hidden;
            display : block;
            outline: none;
        }
        .${AndroidUI.DomClassName} * {
            overflow : hidden;
            border : none;
            outline: none;
        }
        .${AndroidUI.DomClassName} resources {
            display: none;
        }
        .${AndroidUI.DomClassName} Button {
            border: none;
            background: none;
        }
        .${AndroidUI.DomClassName} > canvas {
            position: absolute;
            left: 0;
            top: 0;
        }
        `;
    document.head.appendChild(styleElement);

    class RootLayout extends FrameLayout{
    }
}
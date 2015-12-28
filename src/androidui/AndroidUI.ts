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
        static BindToElementName = 'AndroidUI';

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
        private touchEvent = new MotionEvent();
        private touchAvailable = false;
        private ketEvent = new KeyEvent();

        private AndroidID:number;

        constructor(element:HTMLElement) {
            this.element = element;
            if(element[AndroidUI.BindToElementName]){
                throw Error('already init a AndroidUI with this element');
            }
            element[AndroidUI.BindToElementName] = this;
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
            if(this.rootResourceElement) this.element.appendChild(this.rootResourceElement);
            if(this.rootStyleElement) this.element.appendChild(this.rootStyleElement);
            this.element.appendChild(this._canvas);


            this.initFocus();
            this.initEvent();

            this.initSizeChange();

            this._viewRootImpl.setView(this._rootLayout);
            this._viewRootImpl.initSurface(this._canvas);

            this.initVisibleChange();


            let debugAttr = this.element.getAttribute('debug');
            if(debugAttr!=null && debugAttr!='0' && debugAttr!='false') this.showDebugLayout();
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

            if (this.element.style.display==='none') {
                this.element.style.display = '';
            }

            if(this.rootStyleElement.innerHTML.length==0){
                this.rootStyleElement = null;
            }
        }


        /**
         * @returns {boolean} is bound change
         */
        private refreshWindowBound():boolean {
            let rootViewBound = this.element.getBoundingClientRect();//get viewRoot bound on touch start
            let boundLeft = rootViewBound.left;
            let boundTop = rootViewBound.top;
            let boundRight = rootViewBound.right;
            let boundBottom = rootViewBound.bottom;
            if(this._windowBound && this._windowBound.left == boundLeft && this._windowBound.top == boundTop
                && this._windowBound.right == boundRight && this._windowBound.bottom == boundBottom){
                return false;
            }
            this._windowBound.set(boundLeft, boundTop, boundRight, boundBottom);
            return true;
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
                this.touchAvailable = true;
                this.refreshWindowBound();

                this.element.focus();

                this.touchEvent.initWithTouch(<any>e, MotionEvent.ACTION_DOWN, this._windowBound);
                if(this._viewRootImpl.dispatchInputEvent(this.touchEvent)){
                    e.stopPropagation();
                    e.preventDefault();
                    return true;
                }

            }, true);
            this.element.addEventListener('touchmove', (e)=> {
                this.touchEvent.initWithTouch(<any>e, MotionEvent.ACTION_MOVE, this._windowBound);
                if(this._viewRootImpl.dispatchInputEvent(this.touchEvent)){
                    e.stopPropagation();
                    e.preventDefault();
                    return true;
                }
            }, true);
            this.element.addEventListener('touchend', (e)=> {
                this.touchEvent.initWithTouch(<any>e, MotionEvent.ACTION_UP, this._windowBound);
                if(this._viewRootImpl.dispatchInputEvent(this.touchEvent)){
                    e.stopPropagation();
                    e.preventDefault();
                    return true;
                }
            }, true);
            this.element.addEventListener('touchcancel', (e)=> {
                this.touchEvent.initWithTouch(<any>e, MotionEvent.ACTION_CANCEL, this._windowBound);
                if(this._viewRootImpl.dispatchInputEvent(this.touchEvent)){
                    e.stopPropagation();
                    e.preventDefault();
                    return true;
                }
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
                if(this.touchAvailable) return;
                isMouseDown = true;
                this.refreshWindowBound();

                this.element.focus();

                this.touchEvent.initWithTouch(<any>mouseToTouchEvent(e), MotionEvent.ACTION_DOWN, this._windowBound);
                if(this._viewRootImpl.dispatchInputEvent(this.touchEvent)){
                    e.stopPropagation();
                    e.preventDefault();
                    return true;
                }
            }, true);

            this.element.addEventListener('mousemove', (e)=> {
                if(this.touchAvailable) return;
                if(!isMouseDown) return;
                this.touchEvent.initWithTouch(<any>mouseToTouchEvent(e), MotionEvent.ACTION_MOVE, this._windowBound);
                if(this._viewRootImpl.dispatchInputEvent(this.touchEvent)){
                    e.stopPropagation();
                    e.preventDefault();
                    return true;
                }
            }, true);

            this.element.addEventListener('mouseup', (e)=> {
                if(this.touchAvailable) return;
                isMouseDown = false;
                this.touchEvent.initWithTouch(<any>mouseToTouchEvent(e), MotionEvent.ACTION_UP, this._windowBound);
                if(this._viewRootImpl.dispatchInputEvent(this.touchEvent)){
                    e.stopPropagation();
                    e.preventDefault();
                    return true;
                }
            }, true);

            this.element.addEventListener('mouseleave', (e)=> {
                if(this.touchAvailable) return;
                if(e.fromElement === this.element){
                    isMouseDown = false;
                    this.touchEvent.initWithTouch(<any>mouseToTouchEvent(e), MotionEvent.ACTION_CANCEL, this._windowBound);
                    if(this._viewRootImpl.dispatchInputEvent(this.touchEvent)){
                        e.stopPropagation();
                        e.preventDefault();
                        return true;
                    }
                }
            }, true);


            let scrollEvent = new MotionEvent();
            //Action_Scroll
            this.element.addEventListener('mousewheel', (e:MouseWheelEvent)=> {
                scrollEvent.initWithMouseWheel(<WheelEvent><any>e);
                if(this._viewRootImpl.dispatchInputEvent(scrollEvent)){
                    e.stopPropagation();
                    e.preventDefault();
                    return true;
                }
            }, true);
        }

        private initKeyEvent(){
            this.element.addEventListener('keydown', (e:KeyboardEvent)=> {
                this.ketEvent.appendKeyEvent(e, KeyEvent.ACTION_DOWN);
                if(this._viewRootImpl.dispatchInputEvent(this.ketEvent)){
                    e.stopPropagation();
                    e.preventDefault();
                    return true;
                }
            }, true);
            this.element.addEventListener('keyup', (e:KeyboardEvent)=> {
                this.ketEvent.appendKeyEvent(e, KeyEvent.ACTION_UP);
                if(this._viewRootImpl.dispatchInputEvent(this.ketEvent)){
                    e.stopPropagation();
                    e.preventDefault();
                    return true;
                }
            }, true);

        }
        private initGenericEvent(){
            // No generic Event current. Hover event should listen here
        }

        private initSizeChange(){
            const _this = this;
            window.addEventListener('resize', ()=>{
                _this.notifySizeChange();
            });

            let lastWidth = this.element.offsetWidth;
            let lastHeight = this.element.offsetHeight;
            if(lastWidth>0 && lastHeight>0) this.notifySizeChange();

            setInterval(()=>{
                let width = _this.element.offsetWidth;
                let height = _this.element.offsetHeight;
                if(lastHeight !== height || lastWidth !== width){
                    lastWidth = width;
                    lastHeight = height;
                    _this.notifySizeChange();
                }

            }, 500);
        }

        private initVisibleChange(){
            var eventName = 'visibilitychange';
            if (document['webkitHidden'] != undefined) {
                eventName = 'webkitvisibilitychange';
            }
            document.addEventListener(eventName, ()=>{
                if(document['hidden'] || document['webkitHidden']){
                    //hidden
                }else{
                    this._viewRootImpl.invalidate();
                }
            }, false);
        }

        notifySizeChange(){
            if(this.refreshWindowBound()) {
                let density = android.content.res.Resources.getDisplayMetrics().density;
                this.tempRect.set(this._windowBound.left * density, this._windowBound.top * density,
                    this._windowBound.right * density, this._windowBound.bottom * density);
                let width = this._windowBound.width();
                let height = this._windowBound.height();
                this._canvas.width = width * density;
                this._canvas.height = height * density;
                this._canvas.style.width = width + "px";
                this._canvas.style.height = height + "px";
                this._viewRootImpl.notifyResized(this.tempRect);
            }
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

        showDebugLayout(){
            if(this._rootLayout.bindElement.parentNode === null){
                this.element.appendChild(this._rootLayout.bindElement);
            }
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

    //debug layout show the layout in dom.
    class RootLayout extends FrameLayout{
        tagName():string {
            return 'debuglayout';
        }
    }
}
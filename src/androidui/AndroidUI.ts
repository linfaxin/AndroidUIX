/**
 * Created by linfaxin on 15/10/23.
 */
///<reference path="../android/app/Application.ts"/>
///<reference path="../android/view/View.ts"/>
///<reference path="../android/view/ViewGroup.ts"/>
///<reference path="../android/view/ViewRootImpl.ts"/>
///<reference path="../android/widget/FrameLayout.ts"/>
///<reference path="../android/view/MotionEvent.ts"/>
///<reference path="../android/view/KeyEvent.ts"/>
///<reference path="../android/view/WindowManager.ts"/>
///<reference path="../android/app/ActivityThread.ts"/>
///<reference path="../android/R/string.ts"/>
///<reference path="AndroidUIElement.ts"/>

/**
 * Bridge between Html Element and Android View
 */
module androidui {
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import FrameLayout = android.widget.FrameLayout;
    import MotionEvent = android.view.MotionEvent;
    import KeyEvent = android.view.KeyEvent;
    import Intent = android.content.Intent;
    import ActivityThread = android.app.ActivityThread;

    export class AndroidUI {
        static DomClassName = 'AndroidUI';
        static BindToElementName = 'AndroidUI';

        androidUIElement:AndroidUIElement;

        private _canvas:HTMLCanvasElement = document.createElement("canvas");
        get windowManager(){
            return this.mApplication.getWindowManager();
        }
        private mActivityThread:ActivityThread = new ActivityThread(this);
        private _viewRootImpl:android.view.ViewRootImpl;
        private mApplication:android.app.Application;

        private rootResourceElement:Element;

        private _windowBound = new android.graphics.Rect();
        private tempRect = new android.graphics.Rect();
        get windowBound():android.graphics.Rect{
            return this._windowBound;
        }
        private touchEvent = new MotionEvent();
        private touchAvailable = false;
        private ketEvent = new KeyEvent();

        constructor(androidUIElement:AndroidUIElement) {
            this.androidUIElement = androidUIElement;
            if(androidUIElement[AndroidUI.BindToElementName]){
                throw Error('already init a AndroidUI with this element');
            }
            androidUIElement[AndroidUI.BindToElementName] = this;
            this.init();
        }


        private init() {
            this.androidUIElement.classList.add(AndroidUI.DomClassName);

            this._viewRootImpl = new android.view.ViewRootImpl();
            this._viewRootImpl.androidUIElement = this.androidUIElement;

            this.rootResourceElement = this.androidUIElement.querySelector('resources');
            if(this.rootResourceElement) this.androidUIElement.removeChild(this.rootResourceElement)
            else this.rootResourceElement = document.createElement('resources')

            this.initApplication();

            this.androidUIElement.appendChild(this._canvas);


            this.initEvent();

            this.initRootSizeChange();

            this._viewRootImpl.setView(this.windowManager.getWindowsLayout());
            this._viewRootImpl.initSurface(this._canvas);

            this.initBrowserVisibleChange();

            this.initLaunchActivity();

            this.initAndroidUIElement();

            this.initGlobalCrashHandle();
        }

        private initApplication() {
            this.mApplication = new android.app.Application(this);
            this.mApplication.onCreate();
        }

        private initLaunchActivity(){
            //launch activity defined in 'android-ui' element
            for(let ele of Array.from(this.androidUIElement.children)){
                let tagName = ele.tagName;
                if(tagName != 'ACTIVITY') continue;
                let activityName = ele.getAttribute('name') || ele.getAttribute('android:name') || 'android.app.Activity';

                let intent = new Intent(activityName);
                let activity = this.mActivityThread.handleLaunchActivity(intent);
                if (activity) {
                    this.androidUIElement.removeChild(ele);

                    for(let element of Array.from((<HTMLElement>ele).children)){
                        android.view.LayoutInflater.from(activity).inflate(<HTMLElement>element, activity.getWindow().mContentParent, true);
                    }

                    //activity could have a attribute defined callback when created
                    let onCreateFunc = ele.getAttribute('oncreate');
                    if(onCreateFunc && typeof window[onCreateFunc] === "function"){
                        window[onCreateFunc].call(this, activity);
                    }

                }
            }
        }

        private initGlobalCrashHandle(){
            window.onerror = (sMsg,sUrl,sLine)=>{
                if(window.confirm(android.R.string_.crash_catch_alert+'\n'+sMsg)){
                    //reload will clear console's log.
                    window.location.reload();
                }
            }
        }


        /**
         * @returns {boolean} is bound change
         */
        private refreshWindowBound():boolean {
            let rootViewBound = this.androidUIElement.getBoundingClientRect();//get viewRoot bound on touch start
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

        private initAndroidUIElement(){
            if (this.androidUIElement.style.display==='none') {
                this.androidUIElement.style.display = '';
            }

            this.androidUIElement.setAttribute('tabindex', '0');//let element could get focus. so the key event can handle.
            this.androidUIElement.focus();
        }

        private initEvent(){
            this.initTouchEvent();
            this.initMouseEvent();
            this.initKeyEvent();
            this.initGenericEvent();
        }

        private initTouchEvent() {
            this.androidUIElement.addEventListener('touchstart', (e)=> {
                this.touchAvailable = true;
                this.refreshWindowBound();

                this.androidUIElement.focus();

                this.touchEvent.initWithTouch(<any>e, MotionEvent.ACTION_DOWN, this._windowBound);
                if(this._viewRootImpl.dispatchInputEvent(this.touchEvent)){
                    e.stopPropagation();
                    e.preventDefault();
                    return true;
                }

            }, true);
            this.androidUIElement.addEventListener('touchmove', (e)=> {
                this.touchEvent.initWithTouch(<any>e, MotionEvent.ACTION_MOVE, this._windowBound);
                if(this._viewRootImpl.dispatchInputEvent(this.touchEvent)){
                    e.stopPropagation();
                    e.preventDefault();
                    return true;
                }
            }, true);
            this.androidUIElement.addEventListener('touchend', (e)=> {
                this.touchEvent.initWithTouch(<any>e, MotionEvent.ACTION_UP, this._windowBound);
                if(this._viewRootImpl.dispatchInputEvent(this.touchEvent)){
                    e.stopPropagation();
                    e.preventDefault();
                    return true;
                }
            }, true);
            this.androidUIElement.addEventListener('touchcancel', (e)=> {
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

            this.androidUIElement.addEventListener('mousedown', (e:MouseEvent)=> {
                if(this.touchAvailable) return;
                isMouseDown = true;
                this.refreshWindowBound();

                this.androidUIElement.focus();

                this.touchEvent.initWithTouch(<any>mouseToTouchEvent(e), MotionEvent.ACTION_DOWN, this._windowBound);
                if(this._viewRootImpl.dispatchInputEvent(this.touchEvent)){
                    e.stopPropagation();
                    e.preventDefault();
                    return true;
                }
            }, true);

            this.androidUIElement.addEventListener('mousemove', (e)=> {
                if(this.touchAvailable) return;
                if(!isMouseDown) return;
                this.touchEvent.initWithTouch(<any>mouseToTouchEvent(e), MotionEvent.ACTION_MOVE, this._windowBound);
                if(this._viewRootImpl.dispatchInputEvent(this.touchEvent)){
                    e.stopPropagation();
                    e.preventDefault();
                    return true;
                }
            }, true);

            this.androidUIElement.addEventListener('mouseup', (e)=> {
                if(this.touchAvailable) return;
                isMouseDown = false;
                this.touchEvent.initWithTouch(<any>mouseToTouchEvent(e), MotionEvent.ACTION_UP, this._windowBound);
                if(this._viewRootImpl.dispatchInputEvent(this.touchEvent)){
                    e.stopPropagation();
                    e.preventDefault();
                    return true;
                }
            }, true);

            this.androidUIElement.addEventListener('mouseleave', (e)=> {
                if(this.touchAvailable) return;
                if(e.fromElement === this.androidUIElement){
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
            this.androidUIElement.addEventListener('mousewheel', (e:MouseWheelEvent)=> {
                scrollEvent.initWithMouseWheel(<WheelEvent><any>e);
                if(this._viewRootImpl.dispatchInputEvent(scrollEvent)){
                    e.stopPropagation();
                    e.preventDefault();
                    return true;
                }
            }, true);
        }

        private initKeyEvent(){
            this.androidUIElement.addEventListener('keydown', (e:KeyboardEvent)=> {
                this.ketEvent.initKeyEvent(e, KeyEvent.ACTION_DOWN);
                if(this._viewRootImpl.dispatchInputEvent(this.ketEvent)){
                    e.stopPropagation();
                    e.preventDefault();
                    return true;
                }
            }, true);
            this.androidUIElement.addEventListener('keyup', (e:KeyboardEvent)=> {
                this.ketEvent.initKeyEvent(e, KeyEvent.ACTION_UP);
                if(this._viewRootImpl.dispatchInputEvent(this.ketEvent)){
                    e.stopPropagation();
                    e.preventDefault();
                    return true;
                }
            }, true);

        }
        private initGenericEvent(){
            // No generic Event current. Hover event should listen & dispatch here
        }

        private initRootSizeChange(){
            const _this = this;
            window.addEventListener('resize', ()=>{
                _this.notifyRootSizeChange();
            });

            let lastWidth = this.androidUIElement.offsetWidth;
            let lastHeight = this.androidUIElement.offsetHeight;
            if(lastWidth>0 && lastHeight>0) this.notifyRootSizeChange();

            setInterval(()=>{
                let width = _this.androidUIElement.offsetWidth;
                let height = _this.androidUIElement.offsetHeight;
                if(lastHeight !== height || lastWidth !== width){
                    lastWidth = width;
                    lastHeight = height;
                    _this.notifyRootSizeChange();
                }

            }, 500);
        }

        private initBrowserVisibleChange(){
            var eventName = 'visibilitychange';
            if (document['webkitHidden'] != undefined) {
                eventName = 'webkitvisibilitychange';
            }
            document.addEventListener(eventName, ()=>{
                if(document['hidden'] || document['webkitHidden']){
                    //hidden
                    this.mActivityThread.scheduleApplicationHide();
                }else{
                    //show
                    this.mActivityThread.scheduleApplicationShow();
                    this._viewRootImpl.invalidate();
                }
            }, false);
        }

        private notifyRootSizeChange(){
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


        showDebugLayout(){
            if(this.windowManager.getWindowsLayout().bindElement.parentNode === null){
                this.androidUIElement.appendChild(this.windowManager.getWindowsLayout().bindElement);
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
            pointer-events: auto;
        }
        .${AndroidUI.DomClassName} resources {
            display: none;
        }
        .${AndroidUI.DomClassName} Button {
            border: none;
            background: none;
        }
        .${AndroidUI.DomClassName} windowsgroup {
            pointer-events: none;
        }
        .${AndroidUI.DomClassName} > canvas {
            position: absolute;
            left: 0;
            top: 0;
        }
        `;
    document.head.appendChild(styleElement);

}
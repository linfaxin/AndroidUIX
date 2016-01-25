/**
 * Created by linfaxin on 15/11/21.
 */
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/view/MotionEvent.ts"/>
///<reference path="../../android/widget/FrameLayout.ts"/>
///<reference path="../../android/widget/AbsListView.ts"/>
///<reference path="../../android/widget/ScrollView.ts"/>
///<reference path="../../android/widget/OverScroller.ts"/>
///<reference path="../../java/lang/Integer.ts"/>
module androidui.widget {
    import View = android.view.View;
    import Gravity = android.view.Gravity;
    import ViewGroup = android.view.ViewGroup;
    import MotionEvent = android.view.MotionEvent;
    import FrameLayout = android.widget.FrameLayout;
    import AbsListView = android.widget.AbsListView;
    import ScrollView = android.widget.ScrollView;
    import OverScroller = android.widget.OverScroller;
    import Integer = java.lang.Integer;
    export interface OverScrollLocker {
        lockOverScrollTop(lockTop:number):void;
        lockOverScrollBottom(lockBottom:number):void;
        getScrollContentBottom():number;
    }

    export module OverScrollLocker{
        const InstanceMap = new WeakMap<View, OverScrollLocker>();
        export function getFrom(view:View):OverScrollLocker {
            let scrollLocker = InstanceMap.get(view);
            if(!scrollLocker){
                if(view instanceof AbsListView){
                    scrollLocker = new ListViewOverScrollLocker(view);
                }else if(view instanceof ScrollView){
                    scrollLocker = new ScrollViewScrollLocker(view);
                }
                if(scrollLocker) InstanceMap.set(view, scrollLocker);
            }
            return scrollLocker;
        }

        abstract class BaseOverScrollLocker implements OverScrollLocker{
            lockTop:number;
            lockBottom:number;
            isInTouch:boolean;
            view:View;
            constructor(view:View){
                this.view = view;

                const onTouchEventFunc = view.onTouchEvent;
                view.onTouchEvent = (event:MotionEvent):boolean =>{
                    let result = onTouchEventFunc.call(view, event);
                    switch (event.getAction()){
                        case MotionEvent.ACTION_DOWN:
                        case MotionEvent.ACTION_MOVE:
                            this.isInTouch = true;
                            break;
                        case MotionEvent.ACTION_UP:
                        case MotionEvent.ACTION_CANCEL:
                            this.isInTouch = false;
                            break;
                    }
                    return result;
                }
            }

            lockOverScrollTop(lockTop:number):void {
                this.lockTop = lockTop;
                if(!this.isInTouch && this.getOverScrollY() < -lockTop){
                    this.springBackToLockTop();
                }
            }

            lockOverScrollBottom(lockBottom:number):void {
                this.lockBottom = lockBottom;
                if(!this.isInTouch && this.getOverScrollY() > lockBottom){
                    this.springBackToLockBottom();
                }
            }
            abstract getOverScrollY():number;

            abstract getScrollContentBottom():number;

            abstract springBackToLockTop():void;

            abstract springBackToLockBottom():void;

        }


        class ListViewOverScrollLocker extends BaseOverScrollLocker{
            listView:AbsListView;
            constructor(listView:AbsListView){
                super(listView);
                this.listView = listView;
                this.configListView();
            }

            private configListView(){
                let listView = this.listView;
                if(!listView.mFlingRunnable) listView.mFlingRunnable = new AbsListView.FlingRunnable(listView);
                const scroller:OverScroller = listView.mFlingRunnable.mScroller;

                listView.mFlingRunnable.startOverfling = (initialVelocity:number)=>{
                    scroller.setInterpolator(null);
                    let minY = Integer.MIN_VALUE, maxY = Integer.MAX_VALUE;
                    if(listView.mScrollY < 0) minY = -this.lockTop;
                    else if(listView.mScrollY > 0) maxY = this.lockBottom;

                    scroller.fling(0, listView.mScrollY, 0, initialVelocity, 0, 0, minY, maxY, 0, listView._mOverflingDistance);//listView.getHeight()
                    listView.mTouchMode = AbsListView.TOUCH_MODE_OVERFLING;
                    listView.invalidate();
                    listView.postOnAnimation(listView.mFlingRunnable);
                };

                const layoutChildrenFunc = listView.layoutChildren;
                listView.layoutChildren = () => {
                    const overScrollY = this.getOverScrollY();
                    layoutChildrenFunc.call(listView);
                    if(overScrollY!==0){
                        listView.overScrollBy(0, -overScrollY, 0, listView.mScrollY, 0, 0, 0, listView.mOverscrollDistance, false);

                        const atEdge:boolean = listView.trackMotionScroll(-overScrollY, -overScrollY);
                        if(atEdge){
                            listView.overScrollBy(0, overScrollY, 0, listView.mScrollY, 0, 0, 0, listView.mOverscrollDistance, false);
                        }else{
                            //listView.mTouchMode = AbsListView.TOUCH_MODE_SCROLL;
                            listView.mFlingRunnable.mScroller.abortAnimation();
                        }
                    }
                };

                listView.checkOverScrollStartScrollIfNeeded = ():boolean =>{
                    return listView.mScrollY > this.lockBottom || listView.mScrollY < this.lockTop;
                };


                listView.mFlingRunnable.edgeReached = (delta:number)=>{
                    let initialVelocity = listView.mFlingRunnable.mScroller.getCurrVelocity();
                    if(delta>0) initialVelocity = -initialVelocity;
                    listView.mFlingRunnable.startOverfling(initialVelocity);
                };

                const oldSpringBack = scroller.springBack;
                scroller.springBack = (startX:number, startY:number, minX:number, maxX:number, minY:number, maxY:number):boolean=> {
                    minY = -this.lockTop;
                    maxY = this.lockBottom;
                    return oldSpringBack.call(scroller, startX, startY, minX, maxX, minY, maxY);
                };

                const oldFling = scroller.fling;
                scroller.fling = (startX:number, startY:number, velocityX:number, velocityY:number,
                    minX:number, maxX:number, minY:number, maxY:number, overX=0, overY=0):void =>{
                    if(velocityY>0) overY += this.lockBottom;
                    else overY += this.lockTop;
                    oldFling.call(scroller, startX, startY, velocityX, velocityY, minX, maxX, minY, maxY, overX, overY);
                };
            }

            getScrollContentBottom():number {
                let childCount = this.listView.getChildCount();
                let maxBottom = 0;
                let minTop = 0;
                for(let i=0; i<childCount; i++){
                    let child = this.listView.getChildAt(i);
                    let childBottom = child.getBottom();
                    let childTop = child.getTop();
                    if(childBottom > maxBottom){
                        maxBottom = childBottom;
                    }
                    if(childTop < minTop){
                        minTop = childTop;
                    }
                }
                if(minTop>0) minTop = 0;
                if(this.listView.getAdapter() && childCount>0){
                    return (maxBottom - minTop) * this.listView.getAdapter().getCount() / childCount;
                }
                return 0;
            }

            getOverScrollY():number {
                return this.listView.mScrollY;
            }

            private startSpringBack(){
                this.listView.reportScrollStateChange(AbsListView.OnScrollListener.SCROLL_STATE_FLING);
                //springBack func has been override, the args will change later
                this.listView.mFlingRunnable.mScroller.springBack(0, this.listView.mScrollY, 0, 0, 0, 0);
                this.listView.mTouchMode = AbsListView.TOUCH_MODE_OVERFLING;
                this.listView.postOnAnimation(this.listView.mFlingRunnable);
            }
            springBackToLockTop():void {
                this.startSpringBack();
            }

            springBackToLockBottom():void {
                this.startSpringBack();
            }
        }

        class ScrollViewScrollLocker extends BaseOverScrollLocker{
            scrollView:ScrollView;
            constructor(scrollView:ScrollView){
                super(scrollView);
                this.scrollView = scrollView;

                const scroller = scrollView.mScroller;


                const oldSpringBack = scroller.springBack;
                scroller.springBack = (startX:number, startY:number, minX:number, maxX:number, minY:number, maxY:number):boolean=> {
                    minY = -this.lockTop;
                    maxY = this.scrollView.getScrollRange() + this.lockBottom;
                    return oldSpringBack.call(scroller, startX, startY, minX, maxX, minY, maxY);
                };

                const oldFling = scroller.fling;
                scroller.fling = (startX:number, startY:number, velocityX:number, velocityY:number,
                                  minX:number, maxX:number, minY:number, maxY:number, overX=0, overY=0):void =>{
                    if(velocityY>0) overY += this.lockBottom;
                    else overY += this.lockTop;
                    minY -= this.lockTop;
                    maxY += this.lockBottom;
                    oldFling.call(scroller, startX, startY, velocityX, velocityY, minX, maxX, minY, maxY, overX, overY);
                };
                this.listenScrollContentHeightChange();
            }

            private listenScrollContentHeightChange(){
                const listenHeightChange = (v:View)=>{
                    const onSizeChangedFunc = v.onSizeChanged;
                    v.onSizeChanged = (w: number, h: number, oldw: number, oldh: number): void =>{
                        onSizeChangedFunc.call(v, w, h, oldw, oldh);
                        //awake the scroll bar & check the footer header position
                        this.scrollView.overScrollBy(0, 0, 0, this.scrollView.mScrollY, 0,
                            this.scrollView.getScrollRange(), 0, this.scrollView.mOverscrollDistance, false);
                    }

                };
                if(this.scrollView.getChildCount()>0){
                    listenHeightChange(this.scrollView.getChildAt(0));
                }else{
                    const onViewAddedFunc = this.scrollView.onViewAdded;
                    this.scrollView.onViewAdded = (v:View):void =>{
                        onViewAddedFunc.call(this.scrollView, v);
                        listenHeightChange(v);
                    }
                }
            }

            getScrollContentBottom():number {
                if (this.scrollView.getChildCount() > 0) {
                    return this.scrollView.getChildAt(0).getBottom();
                }
                return this.scrollView.getPaddingTop();
            }

            getOverScrollY():number {
                let scrollY = this.scrollView.getScrollY();
                if(scrollY < 0) return scrollY;
                let scrollRange = this.scrollView.getScrollRange();
                if(scrollY > scrollRange){
                    return scrollY - scrollRange;
                }
                return 0;
            }

            private startSpringBack(){
                if (this.scrollView.mScroller.springBack(this.scrollView.mScrollX, this.scrollView.mScrollY,
                        0, 0, 0, this.scrollView.getScrollRange())) {
                    this.scrollView.postInvalidateOnAnimation();
                }
            }
            springBackToLockTop():void {
                this.startSpringBack();
            }

            springBackToLockBottom():void {
                this.startSpringBack();
            }
        }
    }


}
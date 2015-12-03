/**
 * Created by linfaxin on 15/12/2.
 */
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/widget/LinearLayout.ts"/>
///<reference path="../../android/widget/FrameLayout.ts"/>
///<reference path="../../android/widget/AbsListView.ts"/>
///<reference path="../../android/widget/ScrollView.ts"/>
///<reference path="../../android/widget/OverScroller.ts"/>
///<reference path="../../android/widget/TextView.ts"/>
///<reference path="../../android/R/string.ts"/>
///<reference path="../../java/lang/Integer.ts"/>
///<reference path="../../androidui/widget/NativeScrollView.ts"/>
module com.linfaxin{
    import NativeScrollView = androidui.widget.NativeScrollView;
    import LinearLayout = android.widget.LinearLayout;
    import FrameLayout = android.widget.FrameLayout;
    import View = android.view.View;
    import TextView = android.widget.TextView;
    import Gravity = android.view.Gravity;
    import R = android.R;
    import MarginLayoutParams = android.view.ViewGroup.MarginLayoutParams;

    /**
     * only support ios pull refresh now.
     */
    export class PullRefreshNativeScrollView extends NativeScrollView {
        static State_Disable = -1;
        static State_Header_Normal = 0;
        static State_Header_Refreshing = 1;
        static State_Header_ReadyToRefresh = 2;
        static State_Header_RefreshFail = 3;
        static State_Footer_Normal = 4;
        static State_Footer_Loading = 5;
        static State_Footer_ReadyToLoad = 6;
        static State_Footer_LoadFail = 7;
        static State_Footer_NoMoreToLoad = 8;
        static StateChangeLimit = {
            [PullRefreshNativeScrollView.State_Header_Refreshing] :
                [PullRefreshNativeScrollView.State_Header_ReadyToRefresh, PullRefreshNativeScrollView.State_Footer_Loading
                    , PullRefreshNativeScrollView.State_Footer_ReadyToLoad, PullRefreshNativeScrollView.State_Footer_LoadFail
                    , PullRefreshNativeScrollView.State_Footer_NoMoreToLoad, ],

            [PullRefreshNativeScrollView.State_Header_RefreshFail] :
                [PullRefreshNativeScrollView.State_Header_ReadyToRefresh, PullRefreshNativeScrollView.State_Footer_Loading
                    , PullRefreshNativeScrollView.State_Footer_ReadyToLoad, PullRefreshNativeScrollView.State_Footer_LoadFail
                    , PullRefreshNativeScrollView.State_Footer_NoMoreToLoad, ],
            [PullRefreshNativeScrollView.State_Footer_Loading] :
                [PullRefreshNativeScrollView.State_Header_ReadyToRefresh, PullRefreshNativeScrollView.State_Header_Refreshing
                    , PullRefreshNativeScrollView.State_Footer_ReadyToLoad, PullRefreshNativeScrollView.State_Header_RefreshFail],
            [PullRefreshNativeScrollView.State_Footer_NoMoreToLoad] : [PullRefreshNativeScrollView.State_Footer_ReadyToLoad]
        };

        scrollContentWrap:ScrollContentWrap;
        headerView:Header;
        footerView:Footer;
        contentOverY = 0;

        private autoLoadScrollAtBottom = true;
        private footerViewReadyDistance = 36 * android.content.res.Resources.getDisplayMetrics().density;
        private refreshLoadListener:PullRefreshNativeScrollView.RefreshLoadListener;

        addView(...args) {
            args[0] = this.scrollContentWrap = new ScrollContentWrap(args[0]);
            this.headerView = this.scrollContentWrap.header;
            this.footerView = this.scrollContentWrap.footer;
            return super.addView(...args);
        }

        protected overScrollBy(deltaX:number, deltaY:number, scrollX:number, scrollY:number, scrollRangeX:number, scrollRangeY:number, maxOverScrollX:number, maxOverScrollY:number, isTouchEvent:boolean):boolean {
            let newScrollY = deltaY + scrollY;
            const top = 0;
            scrollRangeY += (<MarginLayoutParams>this.scrollContentWrap.getLayoutParams()).topMargin;
            const bottom = scrollRangeY - this.footerView.getHeight();
            if (newScrollY > bottom) {
                this.contentOverY = newScrollY - bottom;
            } else if (newScrollY < top) {
                this.contentOverY = newScrollY - top;
            }else {
                this.contentOverY = 0;
            }


            if(this.headerView){
                if(this.contentOverY < -this.headerView.getHeight()){
                    if(isTouchEvent){
                        this.setHeaderState(PullRefreshNativeScrollView.State_Header_ReadyToRefresh);
                    }else if(this.headerView.state === PullRefreshNativeScrollView.State_Header_ReadyToRefresh){
                        this.setHeaderState(PullRefreshNativeScrollView.State_Header_Refreshing);
                    }
                }else if(this.headerView.state === PullRefreshNativeScrollView.State_Header_ReadyToRefresh){
                    this.setHeaderState(this.headerView.stateBeforeReady);
                }
            }
            if(this.footerView){
                const footerState = this.footerView.state;
                if(this.contentOverY > this.footerView.getHeight() + this.footerViewReadyDistance){
                    if(isTouchEvent){
                        this.setFooterState(PullRefreshNativeScrollView.State_Footer_ReadyToLoad);
                    }else if(footerState === PullRefreshNativeScrollView.State_Footer_ReadyToLoad){
                        this.setFooterState(PullRefreshNativeScrollView.State_Footer_Loading);
                    }
                }else if(footerState === PullRefreshNativeScrollView.State_Footer_ReadyToLoad){
                    this.setFooterState(this.footerView.stateBeforeReady);
                }

                if(this.contentOverY>0 && this.autoLoadScrollAtBottom
                    && footerState === PullRefreshNativeScrollView.State_Footer_Normal){
                    this.setFooterState(PullRefreshNativeScrollView.State_Footer_Loading);
                }
            }
            return super.overScrollBy(deltaX, deltaY, scrollX, scrollY, scrollRangeX, scrollRangeY, maxOverScrollX, maxOverScrollY, isTouchEvent);
        }


        onTouchEvent(ev:android.view.MotionEvent):boolean {
            if(ev.getAction()===android.view.MotionEvent.ACTION_UP
                && this.headerView.state === PullRefreshNativeScrollView.State_Header_ReadyToRefresh){
                this.setHeaderState(PullRefreshNativeScrollView.State_Header_Refreshing);
            }
            return super.onTouchEvent(ev);
        }

        setHeaderState(newState:number):void {
            if(!this.headerView) return;
            if(this.headerView.state === newState) return;
            const changeLimit:number[] = PullRefreshNativeScrollView.StateChangeLimit[this.headerView.state];
            if (changeLimit && changeLimit.indexOf(newState) !== -1) return;
            this.headerView.setStateInner(this, newState);
            if(newState === PullRefreshNativeScrollView.State_Header_Refreshing
                || newState === PullRefreshNativeScrollView.State_Header_Refreshing){
                this.scrollContentWrap.setShowHeader(true);
            }else{
                this.scrollContentWrap.setShowHeader(false);
            }

            if(newState === PullRefreshNativeScrollView.State_Header_Refreshing && this.refreshLoadListener){
                this.refreshLoadListener.onRefresh(this);
            }
        }
        getHeaderState():number {
            if(!this.headerView) return PullRefreshNativeScrollView.State_Disable;
            return this.headerView.state;
        }

        setFooterState(newState:number):void {
            if(!this.footerView) return;
            if(this.footerView.state === newState) return;
            const changeLimit:number[] = PullRefreshNativeScrollView.StateChangeLimit[this.footerView.state];
            if (changeLimit && changeLimit.indexOf(newState) !== -1) return;
            this.footerView.setStateInner(this, newState);

            if(newState === PullRefreshNativeScrollView.State_Footer_Loading && this.refreshLoadListener){
                this.refreshLoadListener.onLoadMore(this);
            }
        }
        getFooterState():number {
            if(!this.footerView) return PullRefreshNativeScrollView.State_Disable;
            return this.footerView.state;
        }

        setAutoLoadMoreWhenScrollBottom(autoLoad:boolean):void {
            this.autoLoadScrollAtBottom = autoLoad;
        }
        setRefreshLoadListener(refreshLoadListener:PullRefreshNativeScrollView.RefreshLoadListener){
            this.refreshLoadListener = refreshLoadListener;
        }

        startRefresh(){
            this.setHeaderState(PullRefreshNativeScrollView.State_Header_Refreshing);
        }

        startLoadMore(){
            this.setFooterState(PullRefreshNativeScrollView.State_Footer_Loading);
        }
    }
    export module PullRefreshNativeScrollView {
        export interface RefreshLoadListener{
            onRefresh(prScroll:PullRefreshNativeScrollView):void;
            onLoadMore(prScroll:PullRefreshNativeScrollView):void;
        }
    }

    class ScrollContentWrap extends LinearLayout{
        isShowHeader = false;
        header:Header;
        footer:Footer;
        constructor(content:View, bindElement?:HTMLElement, rootElement?:HTMLElement) {
            super(bindElement, rootElement);
            this.setOrientation(LinearLayout.VERTICAL);
            this.addView(this.header = new Header());
            this.addView(content);
            this.addView(this.footer = new Footer());

        }

        measure(widthMeasureSpec:number, heightMeasureSpec:number):void {
            super.measure(widthMeasureSpec, heightMeasureSpec);
            if(this.isShowHeader){
                (<MarginLayoutParams>this.getLayoutParams()).topMargin = 0;
            }else{
                (<MarginLayoutParams>this.getLayoutParams()).topMargin = -this.header.getMeasuredHeight();
            }
        }


        setShowHeader(enable:boolean){
            if(this.isShowHeader === enable) return;
            this.isShowHeader = enable;
            this.requestLayout();

            this.bindElement.style.transition = 'transform 0.2s ease-out';
            this.bindElement.style.webkitTransition = '-webkit-transform 0.2s ease-out';
        }
    }

    class Header extends FrameLayout {
        state = PullRefreshNativeScrollView.State_Header_Normal;
        stateBeforeReady = PullRefreshNativeScrollView.State_Header_Normal;

        textView:TextView;
        constructor(bindElement?:HTMLElement, rootElement?:HTMLElement) {
            super(bindElement, rootElement);
            this.textView = new TextView();
            const pad = 16 * android.content.res.Resources.getDisplayMetrics().density;
            this.textView.setPadding(pad, pad, pad, pad);
            this.textView.setGravity(Gravity.CENTER);
            this.addView(this.textView, -1, -2);
            this.onStateChange(PullRefreshNativeScrollView.State_Header_Normal);
        }

        setStateInner(prScroll:PullRefreshNativeScrollView, state:number):void {
            const oldState = this.state;
            this.state = state;
            this.onStateChange(state, oldState);

            const _this = this;
            switch (state){
                case PullRefreshNativeScrollView.State_Header_RefreshFail :
                    this.postDelayed({
                        run(){
                            if(state === _this.state){
                                prScroll.setHeaderState(PullRefreshNativeScrollView.State_Header_Normal);
                            }
                        }
                    }, 1000);
                    break;
                case PullRefreshNativeScrollView.State_Header_ReadyToRefresh:
                    this.stateBeforeReady = oldState;
                    break;
            }
        }

        onStateChange(newState:number, oldState=PullRefreshNativeScrollView.State_Disable):void{
            switch (newState){
                case PullRefreshNativeScrollView.State_Header_Refreshing:
                    this.textView.setText(R.string_.prll_header_state_loading);
                    break;
                case PullRefreshNativeScrollView.State_Header_ReadyToRefresh:
                    this.textView.setText(R.string_.prll_header_state_ready);
                    break;
                case PullRefreshNativeScrollView.State_Header_RefreshFail:
                    this.textView.setText(R.string_.prll_header_state_fail);
                    break;
                default:
                    this.textView.setText(R.string_.prll_header_state_normal);
            }
        }
    }
    class Footer extends FrameLayout {
        state = PullRefreshNativeScrollView.State_Footer_Normal;
        stateBeforeReady = PullRefreshNativeScrollView.State_Footer_Normal;

        textView:TextView;
        constructor(bindElement?:HTMLElement, rootElement?:HTMLElement) {
            super(bindElement, rootElement);
            this.textView = new TextView();
            const pad = 16 * android.content.res.Resources.getDisplayMetrics().density;
            this.textView.setPadding(pad, pad, pad, pad);
            this.textView.setGravity(Gravity.CENTER);
            this.addView(this.textView, -1, -2);
            this.onStateChange(PullRefreshNativeScrollView.State_Footer_Normal);
        }
        setStateInner(prScroll:PullRefreshNativeScrollView, state:number):void {
            const oldState = this.state;
            this.state = state;
            this.onStateChange(state, oldState);

            const _this = this;
            switch (state){
                case PullRefreshNativeScrollView.State_Footer_ReadyToLoad:
                    this.stateBeforeReady = oldState;
                    break;
            }
        }
        onStateChange(newState:number, oldState=PullRefreshNativeScrollView.State_Disable):void{
            switch (newState){
                case PullRefreshNativeScrollView.State_Footer_Loading:
                    this.textView.setText(R.string_.prll_footer_state_loading);
                    break;
                case PullRefreshNativeScrollView.State_Footer_ReadyToLoad:
                    this.textView.setText(R.string_.prll_footer_state_ready);
                    break;
                case PullRefreshNativeScrollView.State_Footer_LoadFail:
                    this.textView.setText(R.string_.prll_footer_state_fail);
                    break;
                case PullRefreshNativeScrollView.State_Footer_NoMoreToLoad:
                    this.textView.setText(R.string_.prll_footer_state_no_more);
                    break;
                default:
                    this.textView.setText(R.string_.prll_footer_state_normal);
            }
        }
    }

}
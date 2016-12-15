/**
 * Created by linfaxin on 15/11/19.
 */
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/widget/FrameLayout.ts"/>
///<reference path="../../android/widget/AbsListView.ts"/>
///<reference path="../../android/widget/ScrollView.ts"/>
///<reference path="../../android/widget/OverScroller.ts"/>
///<reference path="../../android/widget/TextView.ts"/>
///<reference path="../../android/widget/LinearLayout.ts"/>
///<reference path="../../android/widget/ProgressBar.ts"/>
///<reference path="../../android/R/string.ts"/>
///<reference path="../../java/lang/Integer.ts"/>
///<reference path="OverScrollLocker.ts"/>

module androidui.widget{
    import View = android.view.View;
    import Gravity = android.view.Gravity;
    import ViewGroup = android.view.ViewGroup;
    import FrameLayout = android.widget.FrameLayout;
    import AbsListView = android.widget.AbsListView;
    import ScrollView = android.widget.ScrollView;
    import OverScroller = android.widget.OverScroller;
    import TextView = android.widget.TextView;
    import LinearLayout = android.widget.LinearLayout;
    import ProgressBar = android.widget.ProgressBar;
    import Integer = java.lang.Integer;
    import R = android.R;

    export class PullRefreshLoadLayout extends FrameLayout{
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
            [PullRefreshLoadLayout.State_Header_Refreshing] :
                [PullRefreshLoadLayout.State_Header_ReadyToRefresh, PullRefreshLoadLayout.State_Footer_Loading
                    , PullRefreshLoadLayout.State_Footer_ReadyToLoad, PullRefreshLoadLayout.State_Footer_LoadFail
                    , PullRefreshLoadLayout.State_Footer_NoMoreToLoad, ],

            [PullRefreshLoadLayout.State_Header_RefreshFail] :
                [PullRefreshLoadLayout.State_Header_ReadyToRefresh, PullRefreshLoadLayout.State_Footer_Loading
                    , PullRefreshLoadLayout.State_Footer_ReadyToLoad, PullRefreshLoadLayout.State_Footer_LoadFail
                    , PullRefreshLoadLayout.State_Footer_NoMoreToLoad, ],
            [PullRefreshLoadLayout.State_Footer_Loading] :
                [PullRefreshLoadLayout.State_Header_ReadyToRefresh, PullRefreshLoadLayout.State_Header_Refreshing
                    , PullRefreshLoadLayout.State_Footer_ReadyToLoad, PullRefreshLoadLayout.State_Header_RefreshFail],
            [PullRefreshLoadLayout.State_Footer_NoMoreToLoad] : [PullRefreshLoadLayout.State_Footer_ReadyToLoad]
        };


        private autoLoadScrollAtBottom = true;
        private headerView:PullRefreshLoadLayout.HeaderView;
        private footerView:PullRefreshLoadLayout.FooterView;
        private footerViewReadyDistance = 36 * android.content.res.Resources.getDisplayMetrics().density;
        private contentView:View;
        private contentOverY = 0;
        private overScrollLocker:OverScrollLocker;
        private refreshLoadListener:PullRefreshLoadLayout.RefreshLoadListener;

        constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle?:Map<string, string>) {
            super(context, bindElement, defStyle);

            const a = context.obtainStyledAttributes(bindElement, defStyle);
            if (a.getBoolean('refreshEnable', true)) {
                this.setRefreshEnable(true);
            }
            if (a.getBoolean('loadEnable', true)) {
                this.setLoadEnable(true);
            }
            a.recycle();
        }

        protected onViewAdded(child:View):void {
            super.onViewAdded(child);
            if(child instanceof PullRefreshLoadLayout.HeaderView){
                if(child!=this.headerView) this.setHeaderView(child);
            } else if (child instanceof PullRefreshLoadLayout.FooterView){
                if(child!=this.footerView) this.setFooterView(child);
            } else {
                if(child!=this.contentView) this.setContentView(child);
            }
            if(this.footerView!=null){//foot should be click
                this.bringChildToFront(this.footerView);
            }
        }

        private configHeaderView(){
            let headerView = this.headerView;
            let params = <FrameLayout.LayoutParams>headerView.getLayoutParams();
            params.gravity = Gravity.TOP | Gravity.CENTER_HORIZONTAL;
            params.height = ViewGroup.LayoutParams.WRAP_CONTENT;
            params.width = ViewGroup.LayoutParams.MATCH_PARENT;
            headerView.setLayoutParams(params);
        }
        private configFooterView(){
            let footerView = this.footerView;
            let params = <FrameLayout.LayoutParams>footerView.getLayoutParams();
            params.gravity = Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL;
            params.height = ViewGroup.LayoutParams.WRAP_CONTENT;
            params.width = ViewGroup.LayoutParams.WRAP_CONTENT;
            footerView.setLayoutParams(params);
        }
        private configContentView(){
            let contentView = this.contentView;
            let params = <FrameLayout.LayoutParams>contentView.getLayoutParams();
            params.height = ViewGroup.LayoutParams.MATCH_PARENT;
            params.width = ViewGroup.LayoutParams.MATCH_PARENT;
            contentView.setLayoutParams(params);

            this.overScrollLocker = OverScrollLocker.getFrom(contentView);

            const overScrollByFunc = contentView.overScrollBy;
            contentView.overScrollBy = (deltaX:number, deltaY:number, scrollX:number, scrollY:number,
                                        scrollRangeX:number, scrollRangeY:number, maxOverScrollX:number, maxOverScrollY:number,
                                        isTouchEvent:boolean):boolean =>{
                let result = overScrollByFunc.call(contentView,
                    deltaX, deltaY, scrollX, scrollY, scrollRangeX, scrollRangeY, maxOverScrollX, maxOverScrollY, isTouchEvent);
                if(contentView === this.contentView){
                    this.onContentOverScroll(scrollRangeY, maxOverScrollY, isTouchEvent);
                }
                return result;
            }
        }

        private onContentOverScroll(scrollRangeY:number, maxOverScrollY:number, isTouchEvent:boolean):void{
            let newScrollY = this.contentView.mScrollY;
            const top = 0;
            const bottom = scrollRangeY;

            if (newScrollY > bottom) {
                this.contentOverY = newScrollY - bottom;
            } else if (newScrollY < top) {
                this.contentOverY = newScrollY - top;
            }else {
                this.contentOverY = 0;
            }
            this.checkHeaderFooterPosition();

            if(this.headerView){
                if(this.contentOverY < -this.headerView.getHeight()){
                    if(isTouchEvent){
                        this.setHeaderState(PullRefreshLoadLayout.State_Header_ReadyToRefresh);
                    }else if(this.headerView.state === PullRefreshLoadLayout.State_Header_ReadyToRefresh){
                        this.setHeaderState(PullRefreshLoadLayout.State_Header_Refreshing);
                    }
                }else if(this.headerView.state === PullRefreshLoadLayout.State_Header_ReadyToRefresh){
                    this.setHeaderState(this.headerView.stateBeforeReady);
                }
            }
            if(this.footerView){
                const footerState = this.footerView.state;
                if(this.contentOverY > this.footerView.getHeight() + this.footerViewReadyDistance){
                    if(isTouchEvent){
                        this.setFooterState(PullRefreshLoadLayout.State_Footer_ReadyToLoad);
                    }else if(footerState === PullRefreshLoadLayout.State_Footer_ReadyToLoad){
                        this.setFooterState(PullRefreshLoadLayout.State_Footer_Loading);
                    }
                }else if(footerState === PullRefreshLoadLayout.State_Footer_ReadyToLoad){
                    this.setFooterState(this.footerView.stateBeforeReady);
                }

                if(this.contentOverY>0 && this.autoLoadScrollAtBottom
                    && footerState === PullRefreshLoadLayout.State_Footer_Normal){
                    this.setFooterState(PullRefreshLoadLayout.State_Footer_Loading);
                }
            }
        }

        setHeaderView(headerView:PullRefreshLoadLayout.HeaderView):void{
            if(this.headerView){
                this.removeView(this.headerView);
            }
            this.headerView = headerView;
            if(headerView.getParent()==null) this.addView(headerView);
            this.configHeaderView();
        }
        setFooterView(footerView:PullRefreshLoadLayout.FooterView):void{
            if(this.footerView){
                this.removeView(this.footerView);
            }
            this.footerView = footerView;
            if(footerView.getParent()==null) this.addView(footerView);
            this.configFooterView();
        }
        setContentView(contentView:View):void{
            if(this.contentView){
                this.removeView(this.contentView);
            }
            this.contentView = contentView;
            if(contentView.getParent()==null) this.addView(contentView);
            this.configContentView();
        }

        setHeaderState(newState:number):void {
            if(!this.headerView) return;
            if(this.headerView.state === newState) return;
            const changeLimit:number[] = PullRefreshLoadLayout.StateChangeLimit[this.headerView.state];
            if (changeLimit && changeLimit.indexOf(newState) !== -1) return;
            this.headerView.setStateInner(this, newState);
            this.checkLockOverScroll();

            if(newState === PullRefreshLoadLayout.State_Header_Refreshing && this.refreshLoadListener){
                this.refreshLoadListener.onRefresh(this);
            }
        }
        getHeaderState():number {
            if(!this.headerView) return PullRefreshLoadLayout.State_Disable;
            return this.headerView.state;
        }

        setFooterState(newState:number):void {
            if(!this.footerView) return;
            if(this.footerView.state === newState) return;
            const changeLimit:number[] = PullRefreshLoadLayout.StateChangeLimit[this.footerView.state];
            if (changeLimit && changeLimit.indexOf(newState) !== -1) return;
            this.footerView.setStateInner(this, newState);
            this.checkLockOverScroll();

            if(newState === PullRefreshLoadLayout.State_Footer_Loading && this.refreshLoadListener){
                this.refreshLoadListener.onLoadMore(this);
            }
        }
        getFooterState():number {
            if(!this.footerView) return PullRefreshLoadLayout.State_Disable;
            return this.footerView.state;
        }


        private checkLockOverScroll(){
            if(!this.overScrollLocker) return;
            if(this.headerView) {
                switch (this.headerView.state) {
                    case PullRefreshLoadLayout.State_Header_Normal :
                        this.overScrollLocker.lockOverScrollTop(0);
                        break;
                    case PullRefreshLoadLayout.State_Header_Refreshing :
                        this.overScrollLocker.lockOverScrollTop(this.headerView.getHeight());
                        break;
                    case PullRefreshLoadLayout.State_Header_ReadyToRefresh :
                        this.overScrollLocker.lockOverScrollTop(this.headerView.getHeight());
                        break;
                    case PullRefreshLoadLayout.State_Header_RefreshFail :
                        this.overScrollLocker.lockOverScrollTop(this.headerView.getHeight());
                        break;
                }
            }else{
                this.overScrollLocker.lockOverScrollTop(0);
            }
            this.overScrollLocker.lockOverScrollBottom(this.footerView ? this.footerView.getHeight() : 0);
        }

        private checkHeaderFooterPosition(){
            if(this.contentOverY>0){
                this.setHeaderViewAppearDistance(0);
                this.setFooterViewAppearDistance(this.contentOverY);

            }else if(this.contentOverY<0){
                this.setHeaderViewAppearDistance(-this.contentOverY);
                this.setFooterViewAppearDistance(0);

            }else {
                this.setHeaderViewAppearDistance(0);
                this.setFooterViewAppearDistance(0);
            }
        }

        private setHeaderViewAppearDistance(distance:number){
            if(!this.headerView) return;
            let offset = -this.headerView.getHeight() - this.headerView.getTop() + distance;
            this.headerView.offsetTopAndBottom(offset);
        }

        private setFooterViewAppearDistance(distance:number){
            if(!this.contentView || !this.footerView) return;
            let bottomToParentBottom = Math.min(this.overScrollLocker.getScrollContentBottom(),this.contentView.getHeight()) - this.footerView.getBottom();
            if(this.contentOverY<0) bottomToParentBottom -= this.contentOverY;
            let offset = this.footerView.getHeight() + bottomToParentBottom - distance;
            this.footerView.offsetTopAndBottom(offset);
        }


        protected onLayout(changed:boolean, left:number, top:number, right:number, bottom:number):void {
            super.onLayout(changed, left, top, right, bottom);
            this.checkHeaderFooterPosition();
            this.checkLockOverScroll();

            if(!this.isLaidOut()){//first layout after attach window
                //check if start Load when init
                if(this.autoLoadScrollAtBottom && this.footerView!=null
                    && this.footerView.getGlobalVisibleRect(new android.graphics.Rect())){
                    this.setFooterState(PullRefreshLoadLayout.State_Footer_Loading);
                }
            }
        }

        setAutoLoadMoreWhenScrollBottom(autoLoad:boolean):void {
            this.autoLoadScrollAtBottom = autoLoad;
        }

        setRefreshEnable(enable:boolean):void {
            const oldEnable = this.headerView!=null;
            if(enable === oldEnable) return;
            if(!enable){
                this.removeView(this.headerView);
                this.headerView = null;
                if(this.overScrollLocker) this.overScrollLocker.lockOverScrollTop(0);
            }else{
                this.setHeaderView(new PullRefreshLoadLayout.DefaultHeaderView(this.getContext()));
            }
        }
        setLoadEnable(enable:boolean):void {
            const oldEnable = this.footerView!=null;
            if(enable === oldEnable) return;
            if(!enable){
                this.removeView(this.footerView);
                this.footerView = null;
                if(this.overScrollLocker) this.overScrollLocker.lockOverScrollBottom(0);
            }else{
                this.setFooterView(new PullRefreshLoadLayout.DefaultFooterView(this.getContext()));
            }
        }

        setRefreshLoadListener(refreshLoadListener:PullRefreshLoadLayout.RefreshLoadListener){
            this.refreshLoadListener = refreshLoadListener;
        }

        startRefresh(){
            this.setHeaderState(PullRefreshLoadLayout.State_Header_Refreshing);
        }

        startLoadMore(){
            this.setFooterState(PullRefreshLoadLayout.State_Footer_Loading);
        }
    }


    export module PullRefreshLoadLayout{
        export interface RefreshLoadListener{
            onRefresh(prll:PullRefreshLoadLayout):void;
            onLoadMore(prll:PullRefreshLoadLayout):void;
        }

        export abstract class HeaderView extends FrameLayout{
            private state:number = PullRefreshLoadLayout.State_Header_Normal;
            private stateBeforeReady = PullRefreshLoadLayout.State_Header_Normal;

            protected setStateInner(prll:PullRefreshLoadLayout, state:number):void {
                const oldState = this.state;
                this.state = state;
                this.onStateChange(state, oldState);

                const inner_this = this;
                switch (state){
                    case PullRefreshLoadLayout.State_Header_RefreshFail :
                        this.postDelayed({
                            run(){
                                if(state === inner_this.state){
                                    prll.setHeaderState(PullRefreshLoadLayout.State_Header_Normal);
                                }
                            }
                        }, 1000);
                        break;
                    case PullRefreshLoadLayout.State_Header_ReadyToRefresh:
                        this.stateBeforeReady = oldState;
                        break;
                }
            }
            abstract onStateChange(newState:number, oldState:number):void;
        }
        export abstract class FooterView extends FrameLayout{
            private state:number = PullRefreshLoadLayout.State_Footer_Normal;
            private stateBeforeReady = PullRefreshLoadLayout.State_Footer_Normal;

            protected setStateInner(prll:PullRefreshLoadLayout, state:number):void {
                const oldState = this.state;
                this.state = state;
                this.onStateChange(state, oldState);

                switch (state){
                    case PullRefreshLoadLayout.State_Footer_ReadyToLoad:
                        this.stateBeforeReady = oldState;
                        break;
                }
            }
            abstract onStateChange(newState:number, oldState:number):void;
        }
        export class DefaultHeaderView extends HeaderView{
            textView:TextView;
            progressBar:ProgressBar;
            constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle?:Map<string, string>) {
                super(context, bindElement, defStyle);
                this.progressBar = new ProgressBar(context);
                this.progressBar.setVisibility(View.GONE);
                this.textView = new TextView(context);
                let density = android.content.res.Resources.getDisplayMetrics().density;
                const pad = 16 * density;
                this.textView.setPadding(pad/2, pad, pad/2, pad);
                this.textView.setGravity(Gravity.CENTER);

                let linear = new LinearLayout(context);
                linear.addView(this.progressBar, 32 * density, 32 * density);
                linear.addView(this.textView);
                linear.setGravity(Gravity.CENTER);

                this.addView(linear, -1, -2);
                this.onStateChange(PullRefreshLoadLayout.State_Header_Normal, PullRefreshLoadLayout.State_Disable);
            }
            onStateChange(newState:number, oldState:number):void{
                switch (newState){
                    case PullRefreshLoadLayout.State_Header_Refreshing:
                        this.textView.setText(R.string_.prll_header_state_loading);
                        this.progressBar.setVisibility(View.VISIBLE);
                        break;
                    case PullRefreshLoadLayout.State_Header_ReadyToRefresh:
                        this.textView.setText(R.string_.prll_header_state_ready);
                        this.progressBar.setVisibility(View.GONE);
                        break;
                    case PullRefreshLoadLayout.State_Header_RefreshFail:
                        this.textView.setText(R.string_.prll_header_state_fail);
                        this.progressBar.setVisibility(View.GONE);
                        break;
                    default:
                        this.textView.setText(R.string_.prll_header_state_normal);
                        this.progressBar.setVisibility(View.GONE);
                }
            }
        }
        export class DefaultFooterView extends FooterView{
            textView:TextView;
            progressBar:ProgressBar;
            constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle?:Map<string, string>) {
                super(context, bindElement, defStyle);
                this.progressBar = new ProgressBar(context);
                this.progressBar.setVisibility(View.GONE);
                this.textView = new TextView(context);
                let density = android.content.res.Resources.getDisplayMetrics().density;
                const pad = 16 * density;
                this.textView.setPadding(pad/2, pad, pad/2, pad);
                this.textView.setGravity(Gravity.CENTER);

                let linear = new LinearLayout(context);
                linear.addView(this.progressBar);
                linear.addView(this.textView);
                linear.setGravity(Gravity.CENTER);

                this.addView(linear, -1, -2);
                this.onStateChange(PullRefreshLoadLayout.State_Footer_Normal, PullRefreshLoadLayout.State_Disable);

                this.setOnClickListener({
                    onClick(v:View){
                        let parent = v.getParent();
                        if(parent instanceof PullRefreshLoadLayout){
                            parent.setFooterState(PullRefreshLoadLayout.State_Footer_Loading);
                        }
                    }
                });
            }
            onStateChange(newState:number, oldState:number):void{
                switch (newState){
                    case PullRefreshLoadLayout.State_Footer_Loading:
                        this.textView.setText(R.string_.prll_footer_state_loading);
                        this.progressBar.setVisibility(View.VISIBLE);
                        break;
                    case PullRefreshLoadLayout.State_Footer_ReadyToLoad:
                        this.textView.setText(R.string_.prll_footer_state_ready);
                        this.progressBar.setVisibility(View.GONE);
                        break;
                    case PullRefreshLoadLayout.State_Footer_LoadFail:
                        this.textView.setText(R.string_.prll_footer_state_fail);
                        this.progressBar.setVisibility(View.GONE);
                        break;
                    case PullRefreshLoadLayout.State_Footer_NoMoreToLoad:
                        this.textView.setText(R.string_.prll_footer_state_no_more);
                        this.progressBar.setVisibility(View.GONE);
                        break;
                    default:
                        this.textView.setText(R.string_.prll_footer_state_normal);
                        this.progressBar.setVisibility(View.GONE);
                }
            }
        }
    }

}
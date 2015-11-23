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
    import Integer = java.lang.Integer;
    import R = android.R;

    export class PullRefreshLoadLayout extends FrameLayout{
        static State_Normal = 0;
        static State_Refreshing = 1;
        static State_ReadToRefresh = 2;
        static State_RefreshFail = 3;
        static State_Loading = 4;
        static State_ReadyToLoad = 5;
        static State_LoadFail = 6;
        static State_NoMoreToLoad = 7;
        static StateChangeLimit = {
            [PullRefreshLoadLayout.State_Normal] : [],
            [PullRefreshLoadLayout.State_Refreshing] :
                [PullRefreshLoadLayout.State_ReadToRefresh, PullRefreshLoadLayout.State_Loading
                    , PullRefreshLoadLayout.State_ReadyToLoad, PullRefreshLoadLayout.State_LoadFail
                    , PullRefreshLoadLayout.State_NoMoreToLoad, ],

            [PullRefreshLoadLayout.State_ReadToRefresh] : [],
            [PullRefreshLoadLayout.State_RefreshFail] :
                [PullRefreshLoadLayout.State_ReadToRefresh, PullRefreshLoadLayout.State_Loading
                    , PullRefreshLoadLayout.State_ReadyToLoad, PullRefreshLoadLayout.State_LoadFail
                    , PullRefreshLoadLayout.State_NoMoreToLoad, ],
            [PullRefreshLoadLayout.State_Loading] :
                [PullRefreshLoadLayout.State_ReadToRefresh, PullRefreshLoadLayout.State_Refreshing
                    , PullRefreshLoadLayout.State_ReadyToLoad, PullRefreshLoadLayout.State_RefreshFail],
            [PullRefreshLoadLayout.State_ReadyToLoad] : [],
            [PullRefreshLoadLayout.State_LoadFail] : [],
            [PullRefreshLoadLayout.State_NoMoreToLoad] : [PullRefreshLoadLayout.State_ReadyToLoad]
        };


        private state = PullRefreshLoadLayout.State_Normal;
        private autoLoadMoreWhenScrollBottom = true;
        private isRefreshEnable = true;
        private isLoadEnable = true;
        private headerView:PullRefreshLoadLayout.HeaderView;
        private footerView:PullRefreshLoadLayout.FooterView;
        private footerViewReadyDistance = 36 * android.content.res.Resources.getDisplayMetrics().density;
        private contentView:View;
        private contentOverY = 0;
        private overScrollLocker:OverScrollLocker;
        private stateChangeListener:PullRefreshLoadLayout.StateChangeListener;
        constructor(){
            super();
        }

        createAttrChangeHandler(mergeHandler:android.view.View.AttrChangeHandler):void {
            super.createAttrChangeHandler(mergeHandler);
            const prll = this;
            mergeHandler.add({
                set refreshEnable(value){
                    prll.setRefreshEnable(mergeHandler.parseBoolean(value, true));
                },
                set loadEnable(value){
                    prll.setLoadEnable(mergeHandler.parseBoolean(value, true));
                }
            });
        }

        protected onViewAdded(child:View):void {
            super.onViewAdded(child);
            if(child instanceof PullRefreshLoadLayout.HeaderView){
                this.headerView = child;
                this.configHeaderView();
            } else if (child instanceof PullRefreshLoadLayout.FooterView){
                this.footerView = child;
                this.configFooterView();
            } else {
                this.contentView = child;
                this.configContentView();
            }
        }

        protected onAttachedToWindow():void {
            super.onAttachedToWindow();
            if(this.headerView==null && this.isRefreshEnable){
                this.setHeaderView(new PullRefreshLoadLayout.DefaultHeaderView());
            }
            if(this.footerView==null && this.isLoadEnable){
                this.setFooterView(new PullRefreshLoadLayout.DefaultFooterView());
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
                    this.onContentOverScroll(deltaX, deltaY, scrollX, scrollY,
                        scrollRangeX, scrollRangeY, maxOverScrollX, maxOverScrollY, isTouchEvent);
                }
                return result;
            }
        }

        setHeaderView(headerView:PullRefreshLoadLayout.HeaderView):void{
            if(this.headerView){
                this.removeView(this.headerView);
            }
            this.headerView = headerView;
            this.addView(headerView);
            this.configHeaderView();
        }
        setFooterView(footerView:PullRefreshLoadLayout.FooterView):void{
            if(this.footerView){
                this.removeView(this.footerView);
            }
            this.footerView = footerView;
            this.addView(footerView);
            this.configFooterView();
        }
        setContentView(contentView:View):void{
            if(this.contentView){
                this.removeView(this.contentView);
            }
            this.contentView = contentView;
            this.addView(contentView);
            this.configContentView();
        }

        private onContentOverScroll(deltaX:number, deltaY:number, scrollX:number, scrollY:number,
                                    scrollRangeX:number, scrollRangeY:number, maxOverScrollX:number, maxOverScrollY:number,
                                    isTouchEvent:boolean):void{
            let newScrollY = scrollY + deltaY;
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

            if(this.headerView && this.contentOverY < -this.headerView.getHeight()){
                if(isTouchEvent){
                    this.setState(PullRefreshLoadLayout.State_ReadToRefresh);
                }else if(this.state === PullRefreshLoadLayout.State_ReadToRefresh){
                    this.setState(PullRefreshLoadLayout.State_Refreshing);
                }

            }else if(this.footerView && this.contentOverY > this.footerView.getHeight() + this.footerViewReadyDistance){
                if(isTouchEvent){
                    this.setState(PullRefreshLoadLayout.State_ReadyToLoad);
                }else if(this.state === PullRefreshLoadLayout.State_ReadyToLoad){
                    this.setState(PullRefreshLoadLayout.State_Loading);
                }

            }else{
                if(this.state === PullRefreshLoadLayout.State_ReadToRefresh || this.state === PullRefreshLoadLayout.State_ReadyToLoad){
                    this.setState(PullRefreshLoadLayout.State_Normal);
                }
                if(this.contentOverY>0 && this.autoLoadMoreWhenScrollBottom && this.isLoadEnable){
                    this.setState(PullRefreshLoadLayout.State_Loading);
                }
            }
        }

        public setState(newState:number){
            const changeLimit:number[] = PullRefreshLoadLayout.StateChangeLimit[this.state];
            if(changeLimit && changeLimit.indexOf(newState)!==-1) return;
            if(this.state === newState) return;
            this.setStateInner(newState);
        }
        private setStateInner(newState:number){
            const oldState = this.state;
            this.state = newState;
            const PullRefreshLoadLayout_this = this;
            this.checkLockOverScroll();
            switch (newState){
                case PullRefreshLoadLayout.State_RefreshFail :
                    this.postDelayed({
                        run(){
                            if(newState===PullRefreshLoadLayout_this.state){
                                PullRefreshLoadLayout_this.setState(PullRefreshLoadLayout.State_Normal);
                            }
                        }
                    }, 1000);
                    break;
            }
            if(this.headerView) this.headerView.onStateChange(newState, oldState);
            if(this.footerView) this.footerView.onStateChange(newState, oldState);
            if(this.stateChangeListener) this.stateChangeListener.onStateChange(this, newState, oldState);
        }
        public setStateChangeListener(listener:PullRefreshLoadLayout.StateChangeListener){
            this.stateChangeListener = listener;
        }

        private checkLockOverScroll(){
            if(!this.overScrollLocker) return;
            switch (this.state){
                case PullRefreshLoadLayout.State_Normal :
                    this.overScrollLocker.lockOverScrollTop(0);
                    break;
                case PullRefreshLoadLayout.State_Refreshing :
                    this.overScrollLocker.lockOverScrollTop(this.headerView ? this.headerView.getHeight() : 0);
                    break;
                case PullRefreshLoadLayout.State_ReadToRefresh :
                    this.overScrollLocker.lockOverScrollTop(this.headerView ? this.headerView.getHeight() : 0);
                    break;
                case PullRefreshLoadLayout.State_RefreshFail :
                    this.overScrollLocker.lockOverScrollTop(this.headerView ? this.headerView.getHeight() : 0);
                    break;
                case PullRefreshLoadLayout.State_Loading :
                    this.overScrollLocker.lockOverScrollTop(0);
                    break;
                case PullRefreshLoadLayout.State_ReadyToLoad :
                    this.overScrollLocker.lockOverScrollTop(0);
                    break;
                case PullRefreshLoadLayout.State_LoadFail :
                    this.overScrollLocker.lockOverScrollTop(0);
                    break;
                case PullRefreshLoadLayout.State_NoMoreToLoad :
                    this.overScrollLocker.lockOverScrollTop(0);
                    break;
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
            this.headerView.offsetTopAndBottom(Math.max(offset, -this.headerView.getHeight()));
        }

        private setFooterViewAppearDistance(distance:number){
            if(!this.contentView || !this.footerView) return;
            let bottomToParentBottom = Math.min(this.overScrollLocker.getScrollContentBottom(),this.contentView.getHeight()) - this.footerView.getBottom();
            if(this.contentOverY<0) bottomToParentBottom -= this.contentOverY;
            let offset = this.footerView.getHeight() + bottomToParentBottom - distance;
            this.footerView.offsetTopAndBottom(Math.min(this.footerView.getHeight(), offset));
        }


        protected onLayout(changed:boolean, left:number, top:number, right:number, bottom:number):void {
            super.onLayout(changed, left, top, right, bottom);
            this.checkHeaderFooterPosition();
            this.checkLockOverScroll();
        }

        setAutoLoadMoreWhenScrollBottom(autoLoad:boolean):void {
            this.autoLoadMoreWhenScrollBottom = autoLoad;
        }

        setRefreshEnable(enable:boolean):void {
            if(enable === this.isRefreshEnable) return;
            this.isRefreshEnable = enable;
            if(!enable){
                if(this.headerView){
                    this.removeView(this.headerView);
                    this.headerView = null;
                }
                if(this.overScrollLocker) this.overScrollLocker.lockOverScrollTop(0);
            }else{
                if(!this.headerView) this.setHeaderView(new PullRefreshLoadLayout.DefaultHeaderView());
            }
        }
        setLoadEnable(enable:boolean):void {
            if(enable === this.isLoadEnable) return;
            this.isLoadEnable = enable;
            if(!enable){
                if(this.footerView){
                    this.removeView(this.footerView);
                    this.footerView = null;
                }
                if(this.overScrollLocker) this.overScrollLocker.lockOverScrollBottom(0);
            }else{
                if(!this.footerView) this.setFooterView(new PullRefreshLoadLayout.DefaultFooterView());
            }
        }

    }


    export module PullRefreshLoadLayout{
        export interface StateChangeListener {
            onStateChange(pullRefreshLoadLayout:PullRefreshLoadLayout, newState:number, oldState:number):void;
        }
        export abstract
        class HeaderView extends FrameLayout{
            abstract
            onStateChange(newState:number, oldState:number):void;
        }
        export abstract
        class FooterView extends FrameLayout{
            abstract
            onStateChange(newState:number, oldState:number):void;
        }
        export class DefaultHeaderView extends HeaderView{
            textView:TextView;
            constructor(){
                super();
                this.textView = new TextView();
                const pad = 16 * android.content.res.Resources.getDisplayMetrics().density;
                this.textView.setPadding(pad, pad, pad, pad);
                this.textView.setGravity(Gravity.CENTER);
                this.addView(this.textView, -1, -2);
            }
            onStateChange(newState:number, oldState:number):void{
                switch (newState){
                    case PullRefreshLoadLayout.State_Refreshing:
                        this.textView.setText(R.string_.prll_header_state_loading);
                        break;
                    case PullRefreshLoadLayout.State_ReadToRefresh:
                        this.textView.setText(R.string_.prll_header_state_ready);
                        break;
                    case PullRefreshLoadLayout.State_RefreshFail:
                        this.textView.setText(R.string_.prll_header_state_fail);
                        break;
                    default:
                        this.textView.setText(R.string_.prll_header_state_normal);
                }
            }
        }
        export class DefaultFooterView extends FooterView{
            textView:TextView;
            constructor(){
                super();
                this.textView = new TextView();
                const pad = 16 * android.content.res.Resources.getDisplayMetrics().density;
                this.textView.setPadding(pad, pad, pad, pad);
                this.textView.setGravity(Gravity.CENTER);
                this.addView(this.textView, -1, -2);

                this.setOnClickListener({
                    onClick(v:View){
                        let parent = v.getParent();
                        if(parent instanceof PullRefreshLoadLayout){
                            parent.setState(PullRefreshLoadLayout.State_Loading);
                        }
                    }
                });
            }
            onStateChange(newState:number, oldState:number):void{
                switch (newState){
                    case PullRefreshLoadLayout.State_Loading:
                        this.textView.setText(R.string_.prll_footer_state_loading);
                        break;
                    case PullRefreshLoadLayout.State_ReadyToLoad:
                        this.textView.setText(R.string_.prll_footer_state_ready);
                        break;
                    case PullRefreshLoadLayout.State_LoadFail:
                        this.textView.setText(R.string_.prll_footer_state_fail);
                        break;
                    case PullRefreshLoadLayout.State_NoMoreToLoad:
                        this.textView.setText(R.string_.prll_footer_state_no_more);
                        break;
                    default:
                        this.textView.setText(R.string_.prll_footer_state_normal);
                }
            }
        }
    }

}
/**
 * Created by linfaxin on 16/1/21.
 */
///<reference path="Activity.ts"/>
///<reference path="ActionBar.ts"/>


module android.app {
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import MarginLayoutParams = android.view.ViewGroup.MarginLayoutParams;

    export class ActionBarActivity extends Activity {
        private mActionBar:ActionBar;

        protected onCreate(savedInstanceState?:android.os.Bundle):void {
            super.onCreate(savedInstanceState);
            this.initActionBar();
        }

        private initActionBar(){
            this.setActionBar(new ActionBar(this));
            this.initDefaultBackFinish();
        }

        private initDefaultBackFinish(){
            if(this.androidUI.mActivityThread.mLaunchedActivities.size === 0) return;//xxx not do check here
            const activity = this;
            this.mActionBar.setActionLeft(android.R.string_.back, android.R.image.actionbar_ic_back_white, {
                onClick(view:View){
                    activity.finish();
                }
            });
        }

        setActionBar(actionBar:ActionBar){
            const activity = this;
            let w = this.getWindow();
            let decorView:ViewGroup = w.mDecor;
            this.mActionBar = actionBar;
            decorView.addView(actionBar, -1, -2);
            const onMeasure = decorView.onMeasure;
            decorView.onMeasure = (widthMeasureSpec:number, heightMeasureSpec:number)=>{
                onMeasure.call(decorView, widthMeasureSpec, heightMeasureSpec);
                if(activity.mActionBar === actionBar){
                    let params = <MarginLayoutParams>w.mContentParent.getLayoutParams();
                    if(params.topMargin != actionBar.getMeasuredHeight()){
                        params.topMargin = actionBar.getMeasuredHeight();
                        onMeasure.call(decorView, widthMeasureSpec, heightMeasureSpec);
                    }
                }
            };
        }

        getActionBar():ActionBar {
            return this.mActionBar;
        }

        protected onTitleChanged(title:string, color:number):void {
            super.onTitleChanged(title, color);
            this.mActionBar.setTitle(title);
        }
    }
}
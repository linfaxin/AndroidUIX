/**
 * Created by linfaxin on 16/1/5.
 * simple impl of android ActivityThread
 */

///<reference path="Activity.ts"/>
///<reference path="../content/Intent.ts"/>
///<reference path="../os/Bundle.ts"/>
///<reference path="../view/ViewGroup.ts"/>
///<reference path="../view/KeyEvent.ts"/>
///<reference path="../view/animation/Animation.ts"/>
///<reference path="../../androidui/AndroidUI.ts"/>
///<reference path="../../androidui/util/PageStack.ts"/>

module android.app{
    import Bundle = android.os.Bundle;
    import Intent = android.content.Intent;
    import ViewGroup = android.view.ViewGroup;
    import View = android.view.View;
    import Animation = android.view.animation.Animation;


    /**
     * This manages the execution of the main thread in an
     * application process, scheduling and executing activities,
     * broadcasts, and other operations on it as the activity
     * manager requests.
     *
     * {@hide}
     */
    export class ActivityThread {
        androidUI: androidui.AndroidUI;
        mLaunchedActivities = new Set<Activity>();

        overrideExitAnimation:Animation;
        overrideEnterAnimation:Animation;
        overrideResumeAnimation:Animation;
        overrideHideAnimation:Animation;//null mean no animation, undefined mean not override

        constructor(androidUI:androidui.AndroidUI) {
            this.androidUI = androidUI;
        }

        private initWithPageStack(){
            let backKeyDownEvent = android.view.KeyEvent.obtain(android.view.KeyEvent.ACTION_DOWN, android.view.KeyEvent.KEYCODE_BACK);
            let backKeyUpEvent = android.view.KeyEvent.obtain(android.view.KeyEvent.ACTION_UP, android.view.KeyEvent.KEYCODE_BACK);
            PageStack.backListener = ():boolean=>{
                let handleDown = this.androidUI._viewRootImpl.dispatchInputEvent(backKeyDownEvent);
                let handleUp = this.androidUI._viewRootImpl.dispatchInputEvent(backKeyUpEvent);
                return handleDown || handleUp;
            };
            PageStack.pageOpenHandler = (pageId:string, pageExtra?:Intent, isRestore?:boolean):boolean=>{
                let intent = new Intent(pageId);
                if(pageExtra) intent.mExtras = new Bundle(pageExtra.mExtras);
                if(isRestore) this.overrideNextWindowAnimation(null, null, null, null);
                let activity = this.handleLaunchActivity(intent);
                return activity && !activity.mFinished;
            };
            PageStack.pageCloseHandler = (pageId:string, pageExtra?:Intent):boolean=>{
                //check is root activity
                if(this.mLaunchedActivities.size === 1){
                    let rootActivity = Array.from(this.mLaunchedActivities)[0];
                    if(pageId==null || rootActivity.getIntent().activityName == pageId){
                        this.handleDestroyActivity(rootActivity, true);
                        return true;
                    }
                    return false;
                }

                for(let activity of Array.from(this.mLaunchedActivities).reverse()){
                    let intent = activity.getIntent();
                    if(intent.activityName == pageId){
                        this.handleDestroyActivity(activity, true);
                        return true;
                    }
                }
            };
            PageStack.init();
        }


        overrideNextWindowAnimation(enterAnimation:Animation, exitAnimation:Animation, resumeAnimation:Animation, hideAnimation:Animation):void {
            this.overrideEnterAnimation = enterAnimation;
            this.overrideExitAnimation = exitAnimation;
            this.overrideResumeAnimation = resumeAnimation;
            this.overrideHideAnimation = hideAnimation;
        }
        getOverrideEnterAnimation():Animation {
            return this.overrideEnterAnimation;
        }
        getOverrideExitAnimation():Animation {
            return this.overrideExitAnimation;
        }
        getOverrideResumeAnimation():Animation {
            return this.overrideResumeAnimation;
        }
        getOverrideHideAnimation():Animation {
            return this.overrideHideAnimation;
        }

        scheduleApplicationHide():void {
            let visibleActivities = this.getVisibleToUserActivities();
            if(visibleActivities.length==0) return;

            this.handlePauseActivity(visibleActivities[visibleActivities.length - 1]);
            for(let visibleActivity of visibleActivities){
                this.handleStopActivity(visibleActivity, true);
            }
        }

        scheduleApplicationShow():void {
            this.scheduleActivityResume();
        }

        activityResumeTimeout;
        scheduleActivityResume():void {
            if(this.activityResumeTimeout) clearTimeout(this.activityResumeTimeout);
            this.activityResumeTimeout = setTimeout(()=>{
                let visibleActivities = this.getVisibleToUserActivities();
                if(visibleActivities.length==0) return;
                for(let visibleActivity of visibleActivities){
                    visibleActivity.performRestart();
                }

                let activity = visibleActivities.pop();
                this.handleResumeActivity(activity, false);

                //show activity behind the activity
                if(activity.getWindow().isFloating()) {
                    for (let visibleActivity of visibleActivities.reverse()) {
                        if (visibleActivity.mVisibleFromClient) {
                            visibleActivity.makeVisible();
                            if(!visibleActivity.getWindow().isFloating()){
                                break;
                            }
                        }
                    }
                }
            }, 0);
        }

        scheduleLaunchActivity(callActivity:Activity, intent:Intent, options?:android.os.Bundle):void {
            let activity = this.handleLaunchActivity(intent);
            activity.mCallActivity = callActivity;
            if(activity && !activity.mFinished){
                PageStack.notifyNewPageOpened(intent.activityName, intent);
            }
        }

        scheduleDestroyActivityByRequestCode(requestCode:number):void {
            for(let activity of Array.from(this.mLaunchedActivities).reverse()){
                if(activity.getIntent() && requestCode == activity.getIntent().mRequestCode){
                    this.scheduleDestroyActivity(activity);
                }
            }
        }

        scheduleDestroyActivity(activity:Activity, finishing = true):void {
            //delay destroy ensure activity call all start/resume life circel.
            setTimeout(()=>{
                let isCreateSuc = this.mLaunchedActivities.has(activity);//common case it's true, finish() in onCreate() will false here
                let isRootActivity = this.isRootActivity(activity);

                if(activity.mCallActivity && activity.getIntent() && activity.getIntent().mRequestCode>=0){
                    activity.mCallActivity.dispatchActivityResult(null, activity.getIntent().mRequestCode, activity.mResultCode, activity.mResultData)
                }


                this.handleDestroyActivity(activity, finishing);

                if(!isCreateSuc) return;

                if(isRootActivity){
                    PageStack.back(true);

                }else if(activity.getIntent()){
                    PageStack.notifyPageClosed(activity.getIntent().activityName);
                }
            }, 0);
        }

        scheduleBackTo(intent:Intent):boolean {
            let destroyList = [];
            let findActivity = false;
            for(let activity of Array.from(this.mLaunchedActivities).reverse()){
                if(activity.getIntent() && activity.getIntent().activityName == intent.activityName){
                    findActivity = true;
                    break;
                }
                destroyList.push(activity);
            }
            if(findActivity){
                for(let activity of destroyList){
                    this.scheduleDestroyActivity(activity);
                }
                return true;
            }
            return false;
        }

        canBackTo(intent:Intent):boolean {
            for(let activity of this.mLaunchedActivities){
                if(activity.getIntent().activityName == intent.activityName){
                    return true;
                }
            }
            return false;
        }

        scheduleBackToRoot():void {
            let destroyList = Array.from(this.mLaunchedActivities).reverse();
            destroyList.shift();//remove root
            for(let activity of destroyList){
                this.scheduleDestroyActivity(activity);
            }
        }

        private handlePauseActivity(activity:Activity){
            this.performPauseActivity(activity);
        }

        private performPauseActivity(activity:Activity):void {
            //if (finished) {
            //    activity.mFinished = true;
            //}

            // Now we are idle.
            activity.mCalled = false;
            activity.performPause();
            if (!activity.mCalled) {
                throw new Error(
                    "Activity " + ActivityThread.getActivityName(activity) + " did not call through to super.onPause()");
            }
        }

        private handleStopActivity(activity:Activity, show=false):void {
            this.performStopActivity(activity, true);
            this.updateVisibility(activity, show);

        }

        private performStopActivity(activity:Activity, saveState:boolean):void {
            // Next have the activity save its current state and managed dialogs...
            if (!activity.mFinished && saveState) {
                let state = new Bundle();
                //state.setAllowFds(false);
                activity.performSaveInstanceState(state);
            }

            // Now we are idle.
            activity.performStop();
        }


        private handleResumeActivity(a:Activity, launching:boolean){
            this.performResumeActivity(a, launching);

            // If the window hasn't yet been added to the window manager,
            // and this guy didn't finish itself or start another activity,
            // then go ahead and add the window.
            let willBeVisible = !a.mStartedActivity && !a.mFinished;

            if (willBeVisible && a.mVisibleFromClient) {
                a.makeVisible();

                //reset override Animation
                this.overrideEnterAnimation = undefined;
                this.overrideExitAnimation = undefined;
                this.overrideResumeAnimation = undefined;
                this.overrideHideAnimation = undefined;
            }
        }

        private performResumeActivity(a:Activity, launching:boolean){
            if(!launching){//clear mStartedActivity after onPause/onStop
                a.mStartedActivity = false;
            }
            a.performResume();
        }


        private handleLaunchActivity(intent:Intent):Activity {
            let visibleActivities = this.getVisibleToUserActivities();

            let a = this.performLaunchActivity(intent);
            if(a){
                this.handleResumeActivity(a, true);

                if(!a.mFinished && visibleActivities.length>0) {
                    //pause
                    this.handlePauseActivity(visibleActivities[visibleActivities.length - 1]);

                    if (!a.getWindow().getAttributes().isFloating()) {
                        //stop all visible activities
                        for (let visibleActivity of visibleActivities) {
                            this.handleStopActivity(visibleActivity);
                        }
                    }
                }
            }
            return a;
        }

        private performLaunchActivity(intent:Intent):Activity {
            let activity:Activity;
            let clazz:any = intent.activityName;

            try {
                if(typeof clazz === 'string') clazz = eval(clazz);
            } catch (e) {}
            if(typeof clazz === 'function') activity = new clazz(this.androidUI);


            if(activity instanceof Activity){
                try {
                    let savedInstanceState = null;//TODO saved state

                    activity.mIntent = intent;
                    activity.mStartedActivity = false;


                    activity.mCalled = false;
                    activity.performCreate(savedInstanceState);
                    if (!activity.mCalled) {
                        throw new Error("Activity " + intent.activityName + " did not call through to super.onCreate()");
                    }

                    if (!activity.mFinished) {
                        activity.performStart();
                        activity.performRestoreInstanceState(savedInstanceState);
                        activity.mCalled = false;
                        activity.onPostCreate(savedInstanceState);
                        if (!activity.mCalled) {
                            throw new Error("Activity " + intent.activityName + " did not call through to super.onPostCreate()");
                        }
                    }
                } catch (e) {
                    //launch Activity error
                    console.error(e);
                    return null;
                }

                if(!activity.mFinished){
                    this.mLaunchedActivities.add(activity);
                }

                return <Activity>activity;
            }
            return null;
        }

        private handleDestroyActivity(activity:Activity, finishing:boolean):void {
            let visibleActivities = this.getVisibleToUserActivities();
            let isTopVisibleActivity = activity == visibleActivities[visibleActivities.length - 1];
            let isRootActivity = this.isRootActivity(activity);

            this.performDestroyActivity(activity, finishing);

            if(isRootActivity) activity.getWindow().setWindowAnimations(null, null);//clear animation if root activity.
            this.androidUI.windowManager.removeWindow(activity.getWindow());

            if(isTopVisibleActivity && !isRootActivity){
                this.scheduleActivityResume();
            }
        }

        private performDestroyActivity(activity:Activity, finishing:boolean):void {
            if (finishing) {
                activity.mFinished = true;
            }
            //pause
            activity.mCalled = false;
            activity.performPause();
            if (!activity.mCalled) {
                throw new Error(
                    "Activity " + ActivityThread.getActivityName(activity) + " did not call through to super.onPause()");
            }
            //stop
            activity.performStop();

            //destory
            activity.mCalled = false;
            activity.performDestroy();
            if (!activity.mCalled) {
                throw new Error(
                    "Activity " + ActivityThread.getActivityName(activity) + " did not call through to super.onDestroy()");
            }
            this.mLaunchedActivities.delete(activity);
        }


        private updateVisibility(activity:Activity, show:boolean):void {
            if(show){
                if (activity.mVisibleFromClient) {
                    activity.makeVisible();
                }
            }else{
                activity.getWindow().getDecorView().setVisibility(View.INVISIBLE);
            }
        }

        private getVisibleToUserActivities():Activity[]{
            let list = [];
            for(let activity of Array.from(this.mLaunchedActivities).reverse()){
                list.push(activity);
                if(!activity.getWindow().getAttributes().isFloating()) break;
            }
            list.reverse();
            return list;
        }

        private isRootActivity(activity:Activity):boolean {
            return this.mLaunchedActivities.values().next().value == activity;
        }

        private static getActivityName(activity:Activity){
            if(activity.getIntent()) return activity.getIntent().activityName;
            return activity.constructor.name;
        }
    }
}
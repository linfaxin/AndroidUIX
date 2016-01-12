/**
 * Created by linfaxin on 16/1/5.
 * simple impl of android ActivityThread
 */

///<reference path="Activity.ts"/>
///<reference path="../content/Intent.ts"/>
///<reference path="../os/Bundle.ts"/>
///<reference path="../view/ViewGroup.ts"/>
///<reference path="../view/KeyEvent.ts"/>
///<reference path="../../androidui/AndroidUI.ts"/>
///<reference path="../../androidui/util/PageStack.ts"/>

module android.app{
    import Bundle = android.os.Bundle;
    import Intent = android.content.Intent;
    import ViewGroup = android.view.ViewGroup;
    import View = android.view.View;


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
        activityNameClassMap = new Map<string, any>();
        mLaunchedActivities = new Set<Activity>();

        constructor(androidUI:androidui.AndroidUI) {
            this.androidUI = androidUI;
            this.activityNameClassMap.set('activity', android.app.Activity);
            this.initWithPageStack();
        }

        private initWithPageStack(){
            let backKeyDownEvent = android.view.KeyEvent.obtain(android.view.KeyEvent.ACTION_DOWN, android.view.KeyEvent.KEYCODE_BACK);
            let backKeyUpEvent = android.view.KeyEvent.obtain(android.view.KeyEvent.ACTION_UP, android.view.KeyEvent.KEYCODE_BACK);
            PageStack.backListener = ():boolean=>{
                let handleDown = this.androidUI._viewRootImpl.dispatchInputEvent(backKeyDownEvent);
                let handleUp = this.androidUI._viewRootImpl.dispatchInputEvent(backKeyUpEvent);
                return handleDown || handleUp;
            };
            PageStack.pageOpenHandler = (pageId:string, pageExtra?:Intent):boolean=>{
                let intent = new Intent(pageId);
                if(pageExtra) intent.mExtras = new Bundle(pageExtra.mExtras);
                let activity = this.handleLaunchActivity(intent);
                return activity != null;
            };
            PageStack.pageCloseHandler = (pageId:string, pageExtra?:Intent):boolean=>{
                for(let activity of Array.from(this.mLaunchedActivities).reverse()){
                    let intent = activity.getIntent();
                    if(intent.activityName == pageId){
                        this.handleDestroyActivity(activity, true);
                        return true;
                    }
                }
            };
            PageStack.init();
            //TODO no window animation before inited PageStack
        }

        scheduleApplicationHide():void {
            let visibleActivities = this.getVisibleToUserActivities();
            this.handlePauseActivity(visibleActivities[visibleActivities.length - 1]);
            for(let visibleActivity of visibleActivities){
                this.handleStopActivity(visibleActivity, true);
            }
        }

        scheduleApplicationShow():void {
            let visibleActivities = this.getVisibleToUserActivities();
            for(let visibleActivity of visibleActivities){
                visibleActivity.performRestart();
            }
            this.handleResumeActivity(visibleActivities[visibleActivities.length - 1], false);
        }

        scheduleLaunchActivity(intent:Intent, options?:android.os.Bundle):void {
            let activity = this.handleLaunchActivity(intent);
            PageStack.notifyNewPageOpened(intent.activityName, intent);

        }

        scheduleDestroyActivity(activity:Activity, finishing = true):void {
            this.handleDestroyActivity(activity, finishing);

            //TODO notify result code & data

            if(this.isRootActivity(activity)){
                PageStack.back();

            }else if(activity.getIntent()){
                PageStack.notifyPageClosed(activity.getIntent().activityName);
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
            let willBeVisible = !a.mStartedActivity;

            if (willBeVisible && a.mVisibleFromClient) {
                a.makeVisible();
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

                if(visibleActivities.length>0) {
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
            let clazz = this.activityNameClassMap.get(intent.activityName.toLowerCase()) || intent.activityName;

            try {
                if(typeof clazz === 'string') clazz = eval(clazz);
            } catch (e) {}
            if(typeof clazz === 'function') activity = new clazz(this.androidUI);


            if(activity instanceof Activity){
                let savedInstanceState = null;//TODO saved state

                activity.mIntent = intent;
                activity.mStartedActivity = false;


                activity.mCalled = false;
                activity.performCreate(savedInstanceState);
                if (!activity.mCalled) {
                    throw new Error("Activity " + intent.activityName + " did not call through to super.onCreate()");
                }

                if(!activity.mFinished) {
                    activity.performStart();
                    activity.performRestoreInstanceState(savedInstanceState);
                    activity.mCalled = false;
                    activity.onPostCreate(savedInstanceState);
                    if (!activity.mCalled) {
                        throw new Error("Activity " + intent.activityName + " did not call through to super.onPostCreate()");
                    }
                }

                this.mLaunchedActivities.add(activity);

                return <Activity>activity;
            }
            return null;
        }

        private handleDestroyActivity(activity:Activity, finishing:boolean):void {
            let visibleActivities = this.getVisibleToUserActivities();
            let isTopVisibleActivity = activity == visibleActivities[visibleActivities.length - 1];

            this.performDestroyActivity(activity, finishing);
            this.androidUI.windowManager.removeWindow(activity.getWindow());

            if(isTopVisibleActivity){
                visibleActivities = this.getVisibleToUserActivities();
                if(visibleActivities.length>0) {
                    for (let visibleActivity of visibleActivities) {
                        visibleActivity.performRestart();
                    }
                    this.handleResumeActivity(visibleActivities[visibleActivities.length - 1], false);
                }
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
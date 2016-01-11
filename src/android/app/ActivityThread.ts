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
    import Intent = android.content.Intent;
    import ViewGroup = android.view.ViewGroup;


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
                //TODO hide dialog/popwindow
                let handerDown = this.androidUI._viewRootImpl.dispatchInputEvent(backKeyDownEvent);
                let handerUp = this.androidUI._viewRootImpl.dispatchInputEvent(backKeyUpEvent);
                return handerDown || handerUp;
            };
            PageStack.pageOpenHandler = (pageId:string, pageExtra?:any):boolean=>{
                let intent = new Intent(pageId);
                let activity = this.handleLaunchActivity(intent);
                return activity != null;
            };
            PageStack.pageCloseHandler = (pageId:string, pageExtra?:any):boolean=>{
                for(let activity of Array.from(this.mLaunchedActivities).reverse()){
                    let intent = activity.getIntent();
                    if(intent.activityName == pageId){
                        this.performDestroyActivity(activity);
                        return true;
                    }
                }
            };
            PageStack.init();
        }

        scheduleLaunchActivity(intent:Intent, options?:android.os.Bundle):void {
            //TODO launch delay?
            this.handleLaunchActivity(intent);
            PageStack.notifyNewPageOpened(intent.activityName, intent.getExtras());
        }

        handleLaunchActivity(intent:Intent):Activity {
            let a = this.performLaunchActivity(intent);
            if(a){
                this.handleResumeActivity(a);
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

                activity.performStart();
                activity.performRestoreInstanceState(savedInstanceState);

                activity.mCalled = false;
                activity.onPostCreate(savedInstanceState);
                if (!activity.mCalled) {
                    throw new Error("Activity " + intent.activityName + " did not call through to super.onPostCreate()");
                }

                this.androidUI.windowManager.addWindow(activity.getWindow());
                this.mLaunchedActivities.add(activity);

                return <Activity>activity;
            }
            return null;
        }

        handleResumeActivity(a:Activity){
            //TODO manager window visibility here from windowManager?
            a.performResume();
        }

        performFinishActivity(activity:Activity){
            PageStack.notifyPageClosed(activity.getIntent().activityName);
            this.performDestroyActivity(activity);

        }
        private performDestroyActivity(activity:Activity){
            this.mLaunchedActivities.delete(activity);
            this.androidUI.windowManager.removeWindow(activity.getWindow());
            //TODO activity life callback
        }
    }
}
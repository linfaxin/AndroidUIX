/**
 * Created by linfaxin on 16/1/4.
 * lite impl of Android's Intent.
 */
///<reference path="../os/Bundle.ts"/>


module android.content{
    import Bundle = android.os.Bundle;

    export class Intent{
        private mExtras:Bundle;
        private mRequestCode = -1;
        private mFlags = 0;
        private activityName:string;

        /**
         * If set, and the activity being launched is already running in the
         * current task, then instead of launching a new instance of that activity,
         * all of the other activities on top of it will be closed and this Intent
         * will be delivered to the (now on top) old activity as a new Intent.
         *
         * <p>For example, consider a task consisting of the activities: A, B, C, D.
         * If D calls startActivity() with an Intent that resolves to the component
         * of activity B, then C and D will be finished and B receive the given
         * Intent, resulting in the stack now being: A, B.
         *
         * <p>The currently running instance of activity B in the above example will
         * either receive the new intent you are starting here in its
         * onNewIntent() method, or be itself finished and restarted with the
         * new intent.  If it has declared its launch mode to be "multiple" (the
         * default) and you have not set {@link #FLAG_ACTIVITY_SINGLE_TOP} in
         * the same intent, then it will be finished and re-created; for all other
         * launch modes or if {@link #FLAG_ACTIVITY_SINGLE_TOP} is set then this
         * Intent will be delivered to the current instance's onNewIntent().
         *
         * <p>This launch mode can also be used to good effect in conjunction with
         * {@link #FLAG_ACTIVITY_NEW_TASK}: if used to start the root activity
         * of a task, it will bring any currently running instance of that task
         * to the foreground, and then clear it to its root state.  This is
         * especially useful, for example, when launching an activity from the
         * notification manager.
         *
         * <p>See
         * <a href="{@docRoot}guide/topics/fundamentals/tasks-and-back-stack.html">Tasks and Back
         * Stack</a> for more information about tasks.
         */
        public static FLAG_ACTIVITY_CLEAR_TOP = 0x04000000;

        constructor(activityName?:string) {
            this.activityName = activityName;
        }

        getBooleanExtra(name:string, defaultValue:boolean):boolean {
            return this.mExtras == null ? defaultValue : <boolean>this.mExtras.get(name, defaultValue);
        }
        getIntExtra(name:string, defaultValue:number):number {
            return this.mExtras == null ? defaultValue : <number>this.mExtras.get(name, defaultValue);
        }
        getLongExtra(name:string, defaultValue:number):number {
            return this.mExtras == null ? defaultValue : <number>this.mExtras.get(name, defaultValue);
        }
        getFloatExtra(name:string, defaultValue:number):number {
            return this.mExtras == null ? defaultValue : <number>this.mExtras.get(name, defaultValue);
        }
        getDoubleExtra(name:string, defaultValue:number):number {
            return this.mExtras == null ? defaultValue : <number>this.mExtras.get(name, defaultValue);
        }
        getStringExtra(name:string, defaultValue?:string):string {
            return this.mExtras == null ? defaultValue : <string>this.mExtras.get(name, defaultValue);
        }
        getStringArrayExtra(name:string, defaultValue?:string[]):string[] {
            return this.mExtras == null ? defaultValue : <string[]>this.mExtras.get(name, defaultValue);
        }
        getIntegerArrayExtra(name:string, defaultValue?:number[]):number[] {
            return this.mExtras == null ? defaultValue : <number[]>this.mExtras.get(name, defaultValue);
        }
        getLongArrayExtra(name:string, defaultValue?:number[]):number[] {
            return this.mExtras == null ? defaultValue : <number[]>this.mExtras.get(name, defaultValue);
        }
        getFloatArrayExtra(name:string, defaultValue?:number[]):number[] {
            return this.mExtras == null ? defaultValue : <number[]>this.mExtras.get(name, defaultValue);
        }
        getDoubleArrayExtra(name:string, defaultValue?:number[]):number[] {
            return this.mExtras == null ? defaultValue : <number[]>this.mExtras.get(name, defaultValue);
        }
        getBooleanArrayExtra(name:string, defaultValue?:boolean[]):boolean[] {
            return this.mExtras == null ? defaultValue : <boolean[]>this.mExtras.get(name, defaultValue);
        }

        hasExtra(name:string){
            return this.mExtras != null && this.mExtras.containsKey(name);
        }

        putExtra(name:string, value:any):Intent {
            if (this.mExtras == null) {
                this.mExtras = new Bundle();
            }
            this.mExtras.put(name, value);
            return this;
        }
        getExtras():Bundle {
            return (this.mExtras != null) ? new Bundle(this.mExtras) : null;
        }


        /**
         * Retrieve any special flags associated with this intent.  You will
         * normally just set them with {@link #setFlags} and let the system
         * take the appropriate action with them.
         *
         * @return int The currently set flags.
         *
         * @see #setFlags
         */
        getFlags():number {
            return this.mFlags;
        }

        /**
         * Set special flags controlling how this intent is handled.  Most values
         * here depend on the type of component being executed by the Intent,
         * specifically the FLAG_ACTIVITY_* flags are all for use with
         * {@link Context#startActivity Context.startActivity()} and the
         * FLAG_RECEIVER_* flags are all for use with
         * {@link Context#sendBroadcast(Intent) Context.sendBroadcast()}.
         *
         * <p>See the
         * <a href="{@docRoot}guide/topics/fundamentals/tasks-and-back-stack.html">Tasks and Back
         * Stack</a> documentation for important information on how some of these options impact
         * the behavior of your application.
         *
         * @param flags The desired flags.
         *
         * @return Returns the same Intent object, for chaining multiple calls
         * into a single statement.
         *
         * @see #getFlags
         * @see #addFlags
         *
         * @see #FLAG_GRANT_READ_URI_PERMISSION
         * @see #FLAG_GRANT_WRITE_URI_PERMISSION
         * @see #FLAG_GRANT_PERSISTABLE_URI_PERMISSION
         * @see #FLAG_GRANT_PREFIX_URI_PERMISSION
         * @see #FLAG_DEBUG_LOG_RESOLUTION
         * @see #FLAG_FROM_BACKGROUND
         * @see #FLAG_ACTIVITY_BROUGHT_TO_FRONT
         * @see #FLAG_ACTIVITY_CLEAR_TASK
         * @see #FLAG_ACTIVITY_CLEAR_TOP
         * @see #FLAG_ACTIVITY_CLEAR_WHEN_TASK_RESET
         * @see #FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS
         * @see #FLAG_ACTIVITY_FORWARD_RESULT
         * @see #FLAG_ACTIVITY_LAUNCHED_FROM_HISTORY
         * @see #FLAG_ACTIVITY_MULTIPLE_TASK
         * @see #FLAG_ACTIVITY_NEW_DOCUMENT
         * @see #FLAG_ACTIVITY_NEW_TASK
         * @see #FLAG_ACTIVITY_NO_ANIMATION
         * @see #FLAG_ACTIVITY_NO_HISTORY
         * @see #FLAG_ACTIVITY_NO_USER_ACTION
         * @see #FLAG_ACTIVITY_PREVIOUS_IS_TOP
         * @see #FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
         * @see #FLAG_ACTIVITY_REORDER_TO_FRONT
         * @see #FLAG_ACTIVITY_SINGLE_TOP
         * @see #FLAG_ACTIVITY_TASK_ON_HOME
         * @see #FLAG_RECEIVER_REGISTERED_ONLY
         */
        setFlags(flags:number):Intent {
            this.mFlags = flags;
            return this;
        }

        /**
         * Add additional flags to the intent (or with existing flags
         * value).
         *
         * @param flags The new flags to set.
         *
         * @return Returns the same Intent object, for chaining multiple calls
         * into a single statement.
         *
         * @see #setFlags
         */
        addFlags(flags:number):Intent {
            this.mFlags |= flags;
            return this;
        }
    }
}
/*
 * Copyright (C) 2006 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

///<reference path="../../java/util/ArrayList.ts"/>
///<reference path="../../android/os/Bundle.ts"/>
///<reference path="../../android/app/Activity.ts"/>
///<reference path="../../android/content/Context.ts"/>

module android.app {
import ArrayList = java.util.ArrayList;
import Bundle = android.os.Bundle;
import Context = android.content.Context;
import Activity = android.app.Activity;

/**
 * Base class for those who need to maintain global application state. You can
 * provide your own implementation by specifying its name in your
 * AndroidManifest.xml's &lt;application&gt; tag, which will cause that class
 * to be instantiated for you when the process for your application/package is
 * created.
 * 
 * <p class="note">There is normally no need to subclass Application.  In
 * most situation, static singletons can provide the same functionality in a
 * more modular way.  If your singleton needs a global context (for example
 * to register broadcast receivers), the function to retrieve it can be
 * given a {@link android.content.Context} which internally uses
 * {@link android.content.Context#getApplicationContext() Context.getApplicationContext()}
 * when first constructing the singleton.</p>
 */
export class Application extends Context{

    private mActivityLifecycleCallbacks:ArrayList<Application.ActivityLifecycleCallbacks> = new ArrayList<Application.ActivityLifecycleCallbacks>();


    /**
     * Called when the application is starting, before any activity, service,
     * or receiver objects (excluding content providers) have been created.
     * Implementations should be as quick as possible (for example using 
     * lazy initialization of state) since the time spent in this function
     * directly impacts the performance of starting the first activity,
     * service, or receiver in a process.
     * If you override this method, be sure to call super.onCreate().
     */
    onCreate():void  {
    }

    registerActivityLifecycleCallbacks(callback:Application.ActivityLifecycleCallbacks):void  {
        {
            this.mActivityLifecycleCallbacks.add(callback);
        }
    }

    unregisterActivityLifecycleCallbacks(callback:Application.ActivityLifecycleCallbacks):void  {
        {
            this.mActivityLifecycleCallbacks.remove(callback);
        }
    }

    // ------------------ Internal API ------------------

    /* package */
    dispatchActivityCreated(activity:Activity, savedInstanceState:Bundle):void  {
        let callbacks:any[] = this.collectActivityLifecycleCallbacks();
        if (callbacks != null) {
            for (let i:number = 0; i < callbacks.length; i++) {
                (<Application.ActivityLifecycleCallbacks> callbacks[i]).onActivityCreated(activity, savedInstanceState);
            }
        }
    }

    /* package */
    dispatchActivityStarted(activity:Activity):void  {
        let callbacks:any[] = this.collectActivityLifecycleCallbacks();
        if (callbacks != null) {
            for (let i:number = 0; i < callbacks.length; i++) {
                (<Application.ActivityLifecycleCallbacks> callbacks[i]).onActivityStarted(activity);
            }
        }
    }

    /* package */
    dispatchActivityResumed(activity:Activity):void  {
        let callbacks:any[] = this.collectActivityLifecycleCallbacks();
        if (callbacks != null) {
            for (let i:number = 0; i < callbacks.length; i++) {
                (<Application.ActivityLifecycleCallbacks> callbacks[i]).onActivityResumed(activity);
            }
        }
    }

    /* package */
    dispatchActivityPaused(activity:Activity):void  {
        let callbacks:any[] = this.collectActivityLifecycleCallbacks();
        if (callbacks != null) {
            for (let i:number = 0; i < callbacks.length; i++) {
                (<Application.ActivityLifecycleCallbacks> callbacks[i]).onActivityPaused(activity);
            }
        }
    }

    /* package */
    dispatchActivityStopped(activity:Activity):void  {
        let callbacks:any[] = this.collectActivityLifecycleCallbacks();
        if (callbacks != null) {
            for (let i:number = 0; i < callbacks.length; i++) {
                (<Application.ActivityLifecycleCallbacks> callbacks[i]).onActivityStopped(activity);
            }
        }
    }

    /* package */
    dispatchActivitySaveInstanceState(activity:Activity, outState:Bundle):void  {
        let callbacks:any[] = this.collectActivityLifecycleCallbacks();
        if (callbacks != null) {
            for (let i:number = 0; i < callbacks.length; i++) {
                (<Application.ActivityLifecycleCallbacks> callbacks[i]).onActivitySaveInstanceState(activity, outState);
            }
        }
    }

    /* package */
    dispatchActivityDestroyed(activity:Activity):void  {
        let callbacks:any[] = this.collectActivityLifecycleCallbacks();
        if (callbacks != null) {
            for (let i:number = 0; i < callbacks.length; i++) {
                (<Application.ActivityLifecycleCallbacks> callbacks[i]).onActivityDestroyed(activity);
            }
        }
    }

    private collectActivityLifecycleCallbacks():any[]  {
        let callbacks:any[] = null;
        {
            if (this.mActivityLifecycleCallbacks.size() > 0) {
                callbacks = this.mActivityLifecycleCallbacks.toArray();
            }
        }
        return callbacks;
    }
}

export module Application{
export interface ActivityLifecycleCallbacks {

    onActivityCreated(activity:Activity, savedInstanceState:Bundle):void ;

    onActivityStarted(activity:Activity):void ;

    onActivityResumed(activity:Activity):void ;

    onActivityPaused(activity:Activity):void ;

    onActivityStopped(activity:Activity):void ;

    onActivitySaveInstanceState(activity:Activity, outState:Bundle):void ;

    onActivityDestroyed(activity:Activity):void ;
}
}

}
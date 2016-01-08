/**
 * Created by linfaxin on 16/1/4.
 * lite impl of Android Content
 */
///<reference path="../view/WindowManager.ts"/>
///<reference path="res/Resources.ts"/>
///<reference path="../app/Application.ts"/>
///<reference path="../content/Intent.ts"/>
///<reference path="../os/Bundle.ts"/>
///<reference path="../view/LayoutInflater.ts"/>


module android.content {
    import Intent = android.content.Intent;
    import Bundle = android.os.Bundle;
    import LayoutInflater = android.view.LayoutInflater;

    export class Context {
        androidUI: androidui.AndroidUI;
        mLayoutInflater:LayoutInflater;
        mResources:android.content.res.Resources;
        mWindowManager:android.view.WindowManager;

        constructor(androidUI:androidui.AndroidUI) {
            this.androidUI = androidUI;
            this.mLayoutInflater = new LayoutInflater(this);
            this.mResources = new android.content.res.Resources(this);
            this.mWindowManager = new android.view.WindowManager(this);
        }

        getApplicationContext():android.app.Application{
            return this.androidUI.mApplication;
        }

        /** Return a Resources instance for your application's package. */
        getResources():android.content.res.Resources{
            return this.mResources;
        }

        getLayoutInflater():LayoutInflater{
            return this.mLayoutInflater;
        }

        getWindowManager():android.view.WindowManager{
            return this.mWindowManager;
        }

    }
}
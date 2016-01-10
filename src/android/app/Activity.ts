/**
 * Created by linfaxin on 15/10/11.
 */
///<reference path="../view/Window.ts"/>
///<reference path="../content/Context.ts"/>
///<reference path="../view/View.ts"/>
///<reference path="../view/ViewGroup.ts"/>
///<reference path="../view/ViewRootImpl.ts"/>
///<reference path="../widget/FrameLayout.ts"/>
///<reference path="../view/MotionEvent.ts"/>
///<reference path="../view/LayoutInflater.ts"/>
///<reference path="../os/Bundle.ts"/>
///<reference path="../content/Intent.ts"/>
///<reference path="../../androidui/AndroidUI.ts"/>

module android.app{
    import AndroidUI = androidui.AndroidUI;
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import ViewRootImpl = android.view.ViewRootImpl;
    import FrameLayout = android.widget.FrameLayout;
    import MotionEvent = android.view.MotionEvent;
    import Window = android.view.Window;
    import LayoutInflater = android.view.LayoutInflater;
    import Bundle = android.os.Bundle;
    import Context = android.content.Context;
    import Intent = android.content.Intent;

    export class Activity extends Context{
        private mWindow:Window;
        private mIntent:Intent;

        onCreate():void{
        }

        private performCreate(){
            this.mWindow = new Window(this);
            this.onCreate();
        }

        setIntent(intent:Intent){
            this.mIntent = intent;
        }
        getIntent():Intent {
            return this.mIntent;
        }

        getWindow():Window {
            return this.mWindow;
        }

        getWindowManager():android.view.WindowManager{
            return this.mWindow.getWindowManager();
        }

        startActivity(intent:Intent|string, options?:Bundle):void{
            if(typeof intent === 'string') intent = new Intent(<string>intent);
            this.androidUI.mActivityThread.scheduleLaunchActivity(<Intent>intent, options);
        }

        setContentView(view:View|HTMLElement|string){
            if(!(view instanceof View)){
                view = this.getLayoutInflater().inflate(<HTMLElement|string>view);
            }
            this.mWindow.setContentView(<View>view);
        }
        addContentView(view:View, params:ViewGroup.LayoutParams){
            this.mWindow.addContentView(view, params);
        }
        findViewById(id:string):View{
            return this.mWindow.findViewById(id);
        }
    }
}
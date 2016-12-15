/*
 * Copyright (C) 2007 The Android Open Source Project
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

///<reference path="../../android/content/res/Resources.ts"/>
///<reference path="../../android/content/Context.ts"/>
///<reference path="../../android/graphics/PixelFormat.ts"/>
///<reference path="../../android/os/Handler.ts"/>
///<reference path="../../android/util/Log.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/view/LayoutInflater.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/WindowManager.ts"/>
///<reference path="../../android/view/Window.ts"/>
///<reference path="../../android/widget/TextView.ts"/>
///<reference path="../../java/lang/Runnable.ts"/>

module android.widget {
    import Context = android.content.Context;
    import Resources = android.content.res.Resources;
    import PixelFormat = android.graphics.PixelFormat;
    import Handler = android.os.Handler;
    import Log = android.util.Log;
    import Gravity = android.view.Gravity;
    import LayoutInflater = android.view.LayoutInflater;
    import View = android.view.View;
    import OnClickListener = android.view.View.OnClickListener;
    import WindowManager = android.view.WindowManager;
    import Window = android.view.Window;
    import TextView = android.widget.TextView;
    import Runnable = java.lang.Runnable;
    /**
     * A toast is a view containing a quick little message for the user.  The toast class
     * helps you create and show those.
     * {@more}
     *
     * <p>
     * When the view is shown to the user, appears as a floating view over the
     * application.  It will never receive focus.  The user will probably be in the
     * middle of typing something else.  The idea is to be as unobtrusive as
     * possible, while still showing the user the information you want them to see.
     * Two examples are the volume control, and the brief message saying that your
     * settings have been saved.
     * <p>
     * The easiest way to use this class is to call one of the static methods that constructs
     * everything you need and returns a new Toast object.
     *
     * <div class="special reference">
     * <h3>Developer Guides</h3>
     * <p>For information about creating Toast notifications, read the
     * <a href="{@docRoot}guide/topics/ui/notifiers/toasts.html">Toast Notifications</a> developer
     * guide.</p>
     * </div>
     */
    export class Toast {

        static TAG:string = "Toast";

        static localLOGV:boolean = false;

        /**
         * Show the view or text notification for a short period of time.  This time
         * could be user-definable.  This is the default.
         * @see #setDuration
         */
        static LENGTH_SHORT:number = 0;

        /**
         * Show the view or text notification for a long period of time.  This time
         * could be user-definable.
         * @see #setDuration
         */
        static LENGTH_LONG:number = 1;

        mContext:Context;

        mTN:Toast.TN;

        mDuration:number = 0;

        mNextView:View;

        private mHandler = new Handler();
        private mDelayHide:Runnable = (()=> {
            const inner_this = this;
            return {
                run() {
                    inner_this.mTN.hide();
                }
            }
        })();

        /**
         * Construct an empty Toast object.  You must call {@link #setView} before you
         * can call {@link #show}.
         *
         * @param context  The context to use.  Usually your {@link android.app.Application}
         *                 or {@link android.app.Activity} object.
         */
        constructor(context:Context) {
            this.mContext = context;
            this.mTN = new Toast.TN();
            this.mTN.mY = context.getResources().getDisplayMetrics().density * 64;
            this.mTN.mGravity = Gravity.CENTER_HORIZONTAL | Gravity.BOTTOM;
        }

        /**
         * Show the view for the specified duration.
         */
        show():void {
            if (this.mNextView == null) {
                throw Error(`new RuntimeException("setView must have been called")`);
            }
            let tn:Toast.TN = this.mTN;
            tn.mNextView = this.mNextView;
            tn.show();

            this.mHandler.removeCallbacks(this.mDelayHide);
            let showDuration = this.mDuration === Toast.LENGTH_LONG ? 3500 : (this.mDuration === Toast.LENGTH_SHORT ? 2000 : this.mDuration);
            this.mHandler.postDelayed(this.mDelayHide, showDuration);
        }

        /**
         * Close the view if it's showing, or don't show it if it isn't showing yet.
         * You do not normally have to call this.  Normally view will disappear on its own
         * after the appropriate duration.
         */
        cancel():void {
            this.mTN.hide();
        }

        /**
         * Set the view to show.
         * @see #getView
         */
        setView(view:View):void {
            this.mNextView = view;
        }

        /**
         * Return the view.
         * @see #setView
         */
        getView():View {
            return this.mNextView;
        }

        /**
         * Set how long to show the view for.
         * @see #LENGTH_SHORT
         * @see #LENGTH_LONG
         */
        setDuration(duration:number):void {
            this.mDuration = duration;
        }

        /**
         * Return the duration.
         * @see #setDuration
         */
        getDuration():number {
            return this.mDuration;
        }

        ///**
        // * Set the margins of the view.
        // *
        // * @param horizontalMargin The horizontal margin, in percentage of the
        // *        container width, between the container's edges and the
        // *        notification
        // * @param verticalMargin The vertical margin, in percentage of the
        // *        container height, between the container's edges and the
        // *        notification
        // */
        //setMargin(horizontalMargin:number, verticalMargin:number):void  {
        //    this.mTN.mHorizontalMargin = horizontalMargin;
        //    this.mTN.mVerticalMargin = verticalMargin;
        //}
        //
        ///**
        // * Return the horizontal margin.
        // */
        //getHorizontalMargin():number  {
        //    return this.mTN.mHorizontalMargin;
        //}
        //
        ///**
        // * Return the vertical margin.
        // */
        //getVerticalMargin():number  {
        //    return this.mTN.mVerticalMargin;
        //}

        /**
         * Set the location at which the notification should appear on the screen.
         * @see android.view.Gravity
         * @see #getGravity
         */
        setGravity(gravity:number, xOffset:number, yOffset:number):void {
            this.mTN.mGravity = gravity;
            this.mTN.mX = xOffset;
            this.mTN.mY = yOffset;
        }

        /**
         * Get the location at which the notification should appear on the screen.
         * @see android.view.Gravity
         * @see #getGravity
         */
        getGravity():number {
            return this.mTN.mGravity;
        }

        /**
         * Return the X offset in pixels to apply to the gravity's location.
         */
        getXOffset():number {
            return this.mTN.mX;
        }

        /**
         * Return the Y offset in pixels to apply to the gravity's location.
         */
        getYOffset():number {
            return this.mTN.mY;
        }

        /**
         * Make a standard toast that just contains a text view.
         *
         * @param context  The context to use.  Usually your {@link android.app.Application}
         *                 or {@link android.app.Activity} object.
         * @param text     The text to show.  Can be formatted text.
         * @param duration How long to display the message.  Either {@link #LENGTH_SHORT} or
         *                 {@link #LENGTH_LONG}
         *
         */
        static makeText(context:Context, text:string, duration:number):Toast {
            let result:Toast = new Toast(context);
            let inflate:LayoutInflater = context.getLayoutInflater();//<LayoutInflater> context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            let v:View = inflate.inflate(android.R.layout.transient_notification, null);
            let tv:TextView = <TextView> v.findViewById(android.R.id.message);
            tv.setMaxWidth(260 * context.getResources().getDisplayMetrics().density);
            tv.setText(text);
            result.mNextView = v;
            result.mDuration = duration;
            return result;
        }

        ///**
        // * Make a standard toast that just contains a text view with the text from a resource.
        // *
        // * @param context  The context to use.  Usually your {@link android.app.Application}
        // *                 or {@link android.app.Activity} object.
        // * @param resId    The resource id of the string resource to use.  Can be formatted text.
        // * @param duration How long to display the message.  Either {@link #LENGTH_SHORT} or
        // *                 {@link #LENGTH_LONG}
        // *
        // * @throws Resources.NotFoundException if the resource can't be found.
        // */
        //static makeText(context:Context, resId:number, duration:number):Toast  {
        //    return Toast.makeText(context, context.getResources().getText(resId), duration);
        //}

        ///**
        // * Update the text in a Toast that was previously created using one of the makeText() methods.
        // * @param resId The new text for the Toast.
        // */
        //setText(resId:number):void  {
        //    this.setText(this.mContext.getText(resId));
        //}

        /**
         * Update the text in a Toast that was previously created using one of the makeText() methods.
         * @param s The new text for the Toast.
         */
        setText(s:string):void {
            if (this.mNextView == null) {
                throw Error(`new RuntimeException("This Toast was not created with Toast.makeText()")`);
            }
            let tv:TextView = <TextView> this.mNextView.findViewById(android.R.id.message);
            if (tv == null) {
                throw Error(`new RuntimeException("This Toast was not created with Toast.makeText()")`);
            }
            tv.setText(s);
        }
    }

    export module Toast {
        export class TN {

            mShow:Runnable = (()=> {
                const inner_this = this;
                class _Inner implements Runnable {

                    run():void {
                        inner_this.handleShow();
                    }
                }
                return new _Inner();
            })();

            mHide:Runnable = (()=> {
                const inner_this = this;
                class _Inner implements Runnable {

                    run():void {
                        inner_this.handleHide();
                        // Don't do this in handleHide() because it is also invoked by handleShow()
                        inner_this.mNextView = null;
                    }
                }
                return new _Inner();
            })();

            //private mParams:WindowManager.LayoutParams = new WindowManager.LayoutParams();

            mHandler:Handler = new Handler();

            mGravity:number = 0;

            mX:number = 0;
            mY:number = 0;

            //mHorizontalMargin:number = 0;
            //
            //mVerticalMargin:number = 0;

            mView:View;
            mWindow:Window;

            mNextView:View;

            mWM:WindowManager;

            /**
             * schedule handleShow into the right thread
             */
            show():void {
                if (Toast.localLOGV) Log.v(Toast.TAG, "SHOW: " + this);
                this.mHandler.post(this.mShow);
            }

            /**
             * schedule handleHide into the right thread
             */
            hide():void {
                if (Toast.localLOGV) Log.v(Toast.TAG, "HIDE: " + this);
                this.mHandler.post(this.mHide);
            }

            handleShow():void {
                if (Toast.localLOGV) Log.v(Toast.TAG, "HANDLE SHOW: " + this + " mView=" + this.mView + " mNextView=" + this.mNextView);
                if (this.mView != this.mNextView) {
                    // remove the old view if necessary
                    this.handleHide();
                    this.mView = this.mNextView;
                    if (!this.mWindow) {
                        this.mWindow = new Window(this.mView.getContext().getApplicationContext());

                        const params:WindowManager.LayoutParams = this.mWindow.getAttributes();
                        params.height = WindowManager.LayoutParams.WRAP_CONTENT;
                        params.width = WindowManager.LayoutParams.WRAP_CONTENT;
                        //params.format = PixelFormat.TRANSLUCENT;
                        //params.windowAnimations = com.android.internal.R.style.Animation_Toast;
                        params.dimAmount = 0;
                        params.type = WindowManager.LayoutParams.TYPE_TOAST;
                        params.setTitle("Toast");
                        params.leftMargin = params.rightMargin = 36 * this.mView.getContext().getResources().getDisplayMetrics().density;
                        params.flags =
                            //WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
                            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE | WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE;

                        this.mWindow.setFloating(true);
                        this.mWindow.setBackgroundColor(android.graphics.Color.TRANSPARENT);
                        this.mWindow.setWindowAnimations(android.R.anim.toast_enter, android.R.anim.toast_exit, null, null);
                    }
                    const params:WindowManager.LayoutParams = this.mWindow.getAttributes();
                    this.mWindow.setContentView(this.mView);

                    let context:Context = this.mView.getContext().getApplicationContext();
                    //if (context == null) {
                    //    context = this.mView.getContext();
                    //}
                    this.mWM = context.getWindowManager();//<WindowManager> context.getSystemService(Context.WINDOW_SERVICE);
                    // We can resolve the Gravity here by using the Locale for getting
                    // the layout direction
                    //const config:Configuration = this.mView.getContext().getResources().getConfiguration();
                    const gravity:number = Gravity.getAbsoluteGravity(this.mGravity/*, config.getLayoutDirection()*/);
                    params.gravity = gravity;
                    //if ((gravity & Gravity.HORIZONTAL_GRAVITY_MASK) == Gravity.FILL_HORIZONTAL) {
                    //    this.mParams.horizontalWeight = 1.0;
                    //}
                    //if ((gravity & Gravity.VERTICAL_GRAVITY_MASK) == Gravity.FILL_VERTICAL) {
                    //    this.mParams.verticalWeight = 1.0;
                    //}
                    params.x = this.mX;
                    params.y = this.mY;
                    //this.mParams.verticalMargin = this.mVerticalMargin;
                    //this.mParams.horizontalMargin = this.mHorizontalMargin;

                    if (this.mWindow.getDecorView().getParent() != null) {
                        if (Toast.localLOGV) Log.v(Toast.TAG, "REMOVE! " + this.mView + " in " + this);
                        this.mWM.removeWindow(this.mWindow);
                    }
                    if (Toast.localLOGV) Log.v(Toast.TAG, "ADD! " + this.mView + " in " + this);
                    this.mWM.addWindow(this.mWindow);
                    //this.trySendAccessibilityEvent();
                }
            }

            //private trySendAccessibilityEvent():void  {
            //    let accessibilityManager:AccessibilityManager = AccessibilityManager.getInstance(this.mView.getContext());
            //    if (!accessibilityManager.isEnabled()) {
            //        return;
            //    }
            //    // treat toasts as notifications since they are used to
            //    // announce a transient piece of information to the user
            //    let event:AccessibilityEvent = AccessibilityEvent.obtain(AccessibilityEvent.TYPE_NOTIFICATION_STATE_CHANGED);
            //    event.setClassName(this.getClass().getName());
            //    event.setPackageName(this.mView.getContext().getPackageName());
            //    this.mView.dispatchPopulateAccessibilityEvent(event);
            //    accessibilityManager.sendAccessibilityEvent(event);
            //}

            handleHide():void {
                if (Toast.localLOGV)
                    Log.v(Toast.TAG, "HANDLE HIDE: " + this + " mView=" + this.mView);
                if (this.mView != null) {
                    // the view isn't yet added, so let's try not to crash.
                    if (this.mView.getParent() != null) {
                        if (Toast.localLOGV) Log.v(Toast.TAG, "REMOVE! " + this.mView + " in " + this);
                        this.mWM.removeWindow(this.mWindow);
                    }
                    this.mView = null;
                }
            }
        }
    }

}
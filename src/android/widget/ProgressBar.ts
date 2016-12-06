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

///<reference path="../../android/graphics/Canvas.ts"/>
///<reference path="../../android/graphics/Rect.ts"/>
///<reference path="../../android/graphics/drawable/Animatable.ts"/>
///<reference path="../../android/graphics/drawable/AnimationDrawable.ts"/>
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/graphics/drawable/LayerDrawable.ts"/>
///<reference path="../../android/graphics/drawable/StateListDrawable.ts"/>
///<reference path="../../android/graphics/drawable/ClipDrawable.ts"/>
///<reference path="../../android/util/Pools.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/animation/AlphaAnimation.ts"/>
///<reference path="../../android/view/animation/Animation.ts"/>
///<reference path="../../android/view/animation/AnimationUtils.ts"/>
///<reference path="../../android/view/animation/Interpolator.ts"/>
///<reference path="../../android/view/animation/LinearInterpolator.ts"/>
///<reference path="../../android/view/animation/Transformation.ts"/>
///<reference path="../../java/util/ArrayList.ts"/>
///<reference path="../../android/widget/LinearLayout.ts"/>
///<reference path="../../android/widget/TextView.ts"/>
///<reference path="../../android/R/id.ts"/>
///<reference path="../../androidui/image/NetDrawable.ts"/>

module android.widget {
import Canvas = android.graphics.Canvas;
import Rect = android.graphics.Rect;
import Animatable = android.graphics.drawable.Animatable;
import AnimationDrawable = android.graphics.drawable.AnimationDrawable;
import Drawable = android.graphics.drawable.Drawable;
import LayerDrawable = android.graphics.drawable.LayerDrawable;
import StateListDrawable = android.graphics.drawable.StateListDrawable;
import ClipDrawable = android.graphics.drawable.ClipDrawable;
import SynchronizedPool = android.util.Pools.SynchronizedPool;
import Gravity = android.view.Gravity;
import View = android.view.View;
import AlphaAnimation = android.view.animation.AlphaAnimation;
import Animation = android.view.animation.Animation;
import AnimationUtils = android.view.animation.AnimationUtils;
import Interpolator = android.view.animation.Interpolator;
import LinearInterpolator = android.view.animation.LinearInterpolator;
import Transformation = android.view.animation.Transformation;
import ArrayList = java.util.ArrayList;
import LinearLayout = android.widget.LinearLayout;
import TextView = android.widget.TextView;
import R = android.R;
import NetDrawable = androidui.image.NetDrawable;
    import AttrBinder = androidui.attr.AttrBinder;

/**
 * <p>
 * Visual indicator of progress in some operation.  Displays a bar to the user
 * representing how far the operation has progressed; the application can 
 * change the amount of progress (modifying the length of the bar) as it moves 
 * forward.  There is also a secondary progress displayable on a progress bar
 * which is useful for displaying intermediate progress, such as the buffer
 * level during a streaming playback progress bar.
 * </p>
 *
 * <p>
 * A progress bar can also be made indeterminate. In indeterminate mode, the
 * progress bar shows a cyclic animation without an indication of progress. This mode is used by
 * applications when the length of the task is unknown. The indeterminate progress bar can be either
 * a spinning wheel or a horizontal bar.
 * </p>
 *
 * <p>The following code example shows how a progress bar can be used from
 * a worker thread to update the user interface to notify the user of progress:
 * </p>
 * 
 * <pre>
 * public class MyActivity extends Activity {
 *     private static final int PROGRESS = 0x1;
 *
 *     private ProgressBar mProgress;
 *     private int mProgressStatus = 0;
 *
 *     private Handler mHandler = new Handler();
 *
 *     protected void onCreate(Bundle icicle) {
 *         super.onCreate(icicle);
 *
 *         setContentView(R.layout.progressbar_activity);
 *
 *         mProgress = (ProgressBar) findViewById('progress'_bar);
 *
 *         // Start lengthy operation in a background thread
 *         new Thread(new Runnable() {
 *             public void run() {
 *                 while (mProgressStatus &lt; 100) {
 *                     mProgressStatus = doWork();
 *
 *                     // Update the progress bar
 *                     mHandler.post(new Runnable() {
 *                         public void run() {
 *                             mProgress.setProgress(mProgressStatus);
 *                         }
 *                     });
 *                 }
 *             }
 *         }).start();
 *     }
 * }</pre>
 *
 * <p>To add a progress bar to a layout file, you can use the {@code &lt;ProgressBar&gt;} element.
 * By default, the progress bar is a spinning wheel (an indeterminate indicator). To change to a
 * horizontal progress bar, apply the {@link android.R.style#Widget_ProgressBar_Horizontal
 * Widget.ProgressBar.Horizontal} style, like so:</p>
 *
 * <pre>
 * &lt;ProgressBar
 *     style="@android:style/Widget.ProgressBar.Horizontal"
 *     ... /&gt;</pre>
 *
 * <p>If you will use the progress bar to show real progress, you must use the horizontal bar. You
 * can then increment the  progress with {@link #incrementProgressBy incrementProgressBy()} or
 * {@link #setProgress setProgress()}. By default, the progress bar is full when it reaches 100. If
 * necessary, you can adjust the maximum value (the value for a full bar) using the {@link
 * android.R.styleable#ProgressBar_max android:max} attribute. Other attributes available are listed
 * below.</p>
 *
 * <p>Another common style to apply to the progress bar is {@link
 * android.R.style#Widget_ProgressBar_Small Widget.ProgressBar.Small}, which shows a smaller
 * version of the spinning wheel&mdash;useful when waiting for content to load.
 * For example, you can insert this kind of progress bar into your default layout for
 * a view that will be populated by some content fetched from the Internet&mdash;the spinning wheel
 * appears immediately and when your application receives the content, it replaces the progress bar
 * with the loaded content. For example:</p>
 *
 * <pre>
 * &lt;LinearLayout
 *     android:orientation="horizontal"
 *     ... &gt;
 *     &lt;ProgressBar
 *         android:layout_width="wrap_content"
 *         android:layout_height="wrap_content"
 *         style="@android:style/Widget.ProgressBar.Small"
 *         android:layout_marginRight="5dp" /&gt;
 *     &lt;TextView
 *         android:layout_width="wrap_content"
 *         android:layout_height="wrap_content"
 *         android:text="@string/loading" /&gt;
 * &lt;/LinearLayout&gt;</pre>
 *
 * <p>Other progress bar styles provided by the system include:</p>
 * <ul>
 * <li>{@link android.R.style#Widget_ProgressBar_Horizontal Widget.ProgressBar.Horizontal}</li>
 * <li>{@link android.R.style#Widget_ProgressBar_Small Widget.ProgressBar.Small}</li>
 * <li>{@link android.R.style#Widget_ProgressBar_Large Widget.ProgressBar.Large}</li>
 * <li>{@link android.R.style#Widget_ProgressBar_Inverse Widget.ProgressBar.Inverse}</li>
 * <li>{@link android.R.style#Widget_ProgressBar_Small_Inverse
 * Widget.ProgressBar.Small.Inverse}</li>
 * <li>{@link android.R.style#Widget_ProgressBar_Large_Inverse
 * Widget.ProgressBar.Large.Inverse}</li>
 * </ul>
 * <p>The "inverse" styles provide an inverse color scheme for the spinner, which may be necessary
 * if your application uses a light colored theme (a white background).</p>
 *  
 * <p><strong>XML attributes</b></strong> 
 * <p> 
 * See {@link android.R.styleable#ProgressBar ProgressBar Attributes}, 
 * {@link android.R.styleable#View View Attributes}
 * </p>
 * 
 * @attr ref android.R.styleable#ProgressBar_animationResolution
 * @attr ref android.R.styleable#ProgressBar_indeterminate
 * @attr ref android.R.styleable#ProgressBar_indeterminateBehavior
 * @attr ref android.R.styleable#ProgressBar_indeterminateDrawable
 * @attr ref android.R.styleable#ProgressBar_indeterminateDuration
 * @attr ref android.R.styleable#ProgressBar_indeterminateOnly
 * @attr ref android.R.styleable#ProgressBar_interpolator
 * @attr ref android.R.styleable#ProgressBar_max
 * @attr ref android.R.styleable#ProgressBar_maxHeight
 * @attr ref android.R.styleable#ProgressBar_maxWidth
 * @attr ref android.R.styleable#ProgressBar_minHeight
 * @attr ref android.R.styleable#ProgressBar_minWidth
 * @attr ref android.R.styleable#ProgressBar_mirrorForRtl
 * @attr ref android.R.styleable#ProgressBar_progress
 * @attr ref android.R.styleable#ProgressBar_progressDrawable
 * @attr ref android.R.styleable#ProgressBar_secondaryProgress
 */
export class ProgressBar extends View {

    private static MAX_LEVEL:number = 10000;

    private static TIMEOUT_SEND_ACCESSIBILITY_EVENT:number = 200;

    mMinWidth:number = 0;

    mMaxWidth:number = 0;

    mMinHeight:number = 0;

    mMaxHeight:number = 0;

    private mProgress:number = 0;

    private mSecondaryProgress:number = 0;

    private mMax:number = 0;

    private mBehavior:number = 0;

    private mDuration:number = 0;

    private mIndeterminate:boolean;

    private mOnlyIndeterminate:boolean;

    private mTransformation:Transformation;

    private mAnimation:AlphaAnimation;

    private mHasAnimation:boolean;

    private mIndeterminateDrawable:Drawable;

    private mProgressDrawable:Drawable;

    private mCurrentDrawable:Drawable;

    protected mSampleTile:NetDrawable;

    private mNoInvalidate:boolean;

    private mInterpolator:Interpolator;

    //private mRefreshProgressRunnable:ProgressBar.RefreshProgressRunnable;

    //private mUiThreadId:number = 0;

    private mShouldStartAnimationDrawable:boolean;

    private mInDrawing:boolean;

    private mAttached:boolean;

    private mRefreshIsPosted:boolean;

    mMirrorForRtl:boolean = false;

    private mRefreshData:ArrayList<ProgressBar.RefreshData> = new ArrayList<ProgressBar.RefreshData>();

    //private mAccessibilityEventSender:ProgressBar.AccessibilityEventSender;

    constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle=android.R.attr.progressBarStyle) {
        super(context, bindElement, defStyle);
        //this.mUiThreadId = Thread.currentThread().getId();

        this.initProgressBar();
        let a = context.obtainStyledAttributes(bindElement, defStyle);
        this.mNoInvalidate = true;
        let drawable: Drawable = a.getDrawable('progressDrawable');
        if (drawable != null) {
            drawable = this.tileify(drawable, false);
            // Calling this method can set mMaxHeight, make sure the corresponding
            // XML attribute for mMaxHeight is read after calling this method
            this.setProgressDrawable(drawable);
        }
        this.mDuration = a.getInt('indeterminateDuration', this.mDuration);
        this.mMinWidth = a.getDimensionPixelSize('minWidth', this.mMinWidth);
        this.mMaxWidth = a.getDimensionPixelSize('maxWidth', this.mMaxWidth);
        this.mMinHeight = a.getDimensionPixelSize('minHeight', this.mMinHeight);
        this.mMaxHeight = a.getDimensionPixelSize('maxHeight', this.mMaxHeight);
        if(a.getAttrValue('indeterminateBehavior') == 'cycle') {
            this.mBehavior = Animation.REVERSE;
        } else {
            this.mBehavior = Animation.RESTART;
        }
        // const resID: number = a.getResourceId(com.android.internal.R.styleable.ProgressBar_interpolator, // default to linear interpolator
        //     android.R.anim.linear_interpolator);
        // if (resID > 0) {
        //     this.setInterpolator(context, resID);
        // }
        this.setMax(a.getInt('max', this.mMax));
        this.setProgress(a.getInt('progress', this.mProgress));
        this.setSecondaryProgress(a.getInt('secondaryProgress', this.mSecondaryProgress));
        drawable = a.getDrawable('indeterminateDrawable');
        if (drawable != null) {
            drawable = this.tileifyIndeterminate(drawable);
            this.setIndeterminateDrawable(drawable);
        }
        this.mOnlyIndeterminate = a.getBoolean('indeterminateOnly', this.mOnlyIndeterminate);
        this.mNoInvalidate = false;
        this.setIndeterminate(this.mOnlyIndeterminate || a.getBoolean('indeterminate', this.mIndeterminate));
        this.mMirrorForRtl = a.getBoolean('mirrorForRtl', this.mMirrorForRtl);
        a.recycle();
    }

    protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
        return super.createClassAttrBinder().set('progressDrawable', {
            setter(v:ProgressBar, value:any, a:AttrBinder) {
                let drawable = a.parseDrawable(value);
                if(drawable!=null){
                    drawable = v.tileify(drawable, false);
                    v.setProgressDrawable(drawable);
                }
            }, getter(v:ProgressBar) {
                return v.getProgressDrawable();
            }
        }).set('indeterminateDuration', {
            setter(v:ProgressBar, value:any, a:AttrBinder) {
                v.mDuration = Math.floor(a.parseInt(value, v.mDuration));
            }, getter(v:ProgressBar) {
                return v.mDuration;
            }
        }).set('minWidth', {
            setter(v:ProgressBar, value:any, a:AttrBinder) {
                v.mMinWidth = Math.floor(a.parseNumberPixelSize(value, v.mMinWidth));
            }, getter(v:ProgressBar) {
                return v.mMinWidth;
            }
        }).set('maxWidth', {
            setter(v:ProgressBar, value:any, a:AttrBinder) {
                v.mMaxWidth = Math.floor(a.parseNumberPixelSize(value, v.mMaxWidth));
            }, getter(v:ProgressBar) {
                return v.mMaxWidth;
            }
        }).set('minHeight', {
            setter(v:ProgressBar, value:any, a:AttrBinder) {
                v.mMinHeight = Math.floor(a.parseNumberPixelSize(value, v.mMinHeight));
            }, getter(v:ProgressBar) {
                return v.mMinHeight;
            }
        }).set('maxHeight', {
            setter(v:ProgressBar, value:any, a:AttrBinder) {
                v.mMaxHeight = Math.floor(a.parseNumberPixelSize(value, v.mMaxHeight));
            }, getter(v:ProgressBar) {
                return v.mMaxHeight;
            }
        }).set('indeterminateBehavior', {
            setter(v:ProgressBar, value:any, a:AttrBinder) {
                if (Number.isInteger(Number.parseInt(value))) {
                    v.mBehavior = Number.parseInt(value);
                } else {
                    if (value + ''.toLowerCase() == 'cycle') {
                        v.mBehavior = Animation.REVERSE;
                    } else {
                        v.mBehavior = Animation.RESTART;
                    }
                }
            }, getter(v:ProgressBar) {
                return v.mBehavior;
            }
        }).set('interpolator', {
            setter(v:ProgressBar, value:any, a:AttrBinder) {
            }, getter(v:ProgressBar) {
            }
        }).set('max', {
            setter(v:ProgressBar, value:any, a:AttrBinder) {
                v.setMax(a.parseInt(value, v.mMax));
            }, getter(v:ProgressBar) {
                return v.mMax;
            }
        }).set('progress', {
            setter(v:ProgressBar, value:any, a:AttrBinder) {
                v.setProgress(a.parseInt(value, v.mProgress));
            }, getter(v:ProgressBar) {
                return v.mProgress;
            }
        }).set('secondaryProgress', {
            setter(v:ProgressBar, value:any, a:AttrBinder) {
                v.setSecondaryProgress(a.parseInt(value, v.mSecondaryProgress));
            }, getter(v:ProgressBar) {
                return v.mSecondaryProgress;
            }
        }).set('indeterminateDrawable', {
            setter(v:ProgressBar, value:any, a:AttrBinder) {
                let drawable = a.parseDrawable(value);
                if(drawable!=null){
                    drawable = v.tileifyIndeterminate(drawable);
                    v.setIndeterminateDrawable(drawable);
                }
            }, getter(v:ProgressBar) {
                return v.mIndeterminateDrawable;
            }
        }).set('indeterminateOnly', {
            setter(v:ProgressBar, value:any, a:AttrBinder) {
                v.mOnlyIndeterminate = a.parseBoolean(value, v.mOnlyIndeterminate);
                v.setIndeterminate(v.mOnlyIndeterminate || v.mIndeterminate);
            }, getter(v:ProgressBar) {
                return v.mOnlyIndeterminate;
            }
        }).set('indeterminate', {
            setter(v:ProgressBar, value:any, a:AttrBinder) {
                v.setIndeterminate(v.mOnlyIndeterminate || a.parseBoolean(value, v.mIndeterminate));
            }, getter(v:ProgressBar) {
                return v.mIndeterminate;
            }
        });
    }

    /**
     * Converts a drawable to a tiled version of itself. It will recursively
     * traverse layer and state list drawables.
     */
    private tileify(drawable:Drawable, clip:boolean):Drawable  {
        if (drawable instanceof LayerDrawable) {
            let background:LayerDrawable = <LayerDrawable> drawable;
            const N:number = background.getNumberOfLayers();
            let outDrawables:Drawable[] = new Array<Drawable>(N);
            let drawableChange = false;
            for (let i:number = 0; i < N; i++) {
                let id:string = background.getId(i);
                let orig = background.getDrawable(i);
                outDrawables[i] = this.tileify(orig, (id == R.id.progress || id == R.id.secondaryProgress));
                drawableChange = drawableChange || outDrawables[i] !== orig;
            }
            if(!drawableChange) return background;

            let newBg:LayerDrawable = new LayerDrawable(outDrawables);
            for (let i:number = 0; i < N; i++) {
                newBg.setId(i, background.getId(i));
            }
            return newBg;
        } else if (drawable instanceof StateListDrawable) {
            let _in:StateListDrawable = <StateListDrawable> drawable;
            let out:StateListDrawable = new StateListDrawable();
            let numStates:number = _in.getStateCount();
            for (let i:number = 0; i < numStates; i++) {
                out.addState(_in.getStateSet(i), this.tileify(_in.getStateDrawable(i), clip));
            }
            return out;
        //} else if (drawable instanceof BitmapDrawable) {
        //    const tileBitmap:Bitmap = (<BitmapDrawable> drawable).getBitmap();
        //    if (this.mSampleTile == null) {
        //        this.mSampleTile = tileBitmap;
        //    }
        //    const shapeDrawable:ShapeDrawable = new ShapeDrawable(this.getDrawableShape());
        //    const bitmapShader:BitmapShader = new BitmapShader(tileBitmap, Shader.TileMode.REPEAT, Shader.TileMode.CLAMP);
        //    shapeDrawable.getPaint().setShader(bitmapShader);
        //    return (clip) ? new ClipDrawable(shapeDrawable, Gravity.LEFT, ClipDrawable.HORIZONTAL) : shapeDrawable;
        } else if (drawable instanceof NetDrawable) {
            const netDrawable = (<NetDrawable> drawable);
            if (this.mSampleTile == null) {
                this.mSampleTile = netDrawable;
            }
            netDrawable.setTileMode(NetDrawable.TileMode.REPEAT, null);
            return (clip) ? new ClipDrawable(netDrawable, Gravity.LEFT, ClipDrawable.HORIZONTAL) : netDrawable;
        }
        return drawable;
    }

    //getDrawableShape():Shape  {
    //    const roundedCorners:number[] =  [ 5, 5, 5, 5, 5, 5, 5, 5 ];
    //    return new RoundRectShape(roundedCorners, null, null);
    //}

    /**
     * Convert a AnimationDrawable for use as a barberpole animation.
     * Each frame of the animation is wrapped in a ClipDrawable and
     * given a tiling BitmapShader.
     */
    private tileifyIndeterminate(drawable:Drawable):Drawable  {
        if (drawable instanceof AnimationDrawable) {
            let background:AnimationDrawable = <AnimationDrawable> drawable;
            const N:number = background.getNumberOfFrames();
            let newBg:AnimationDrawable = new AnimationDrawable();
            newBg.setOneShot(background.isOneShot());
            for (let i:number = 0; i < N; i++) {
                let frame:Drawable = this.tileify(background.getFrame(i), true);
                frame.setLevel(10000);
                newBg.addFrame(frame, background.getDuration(i));
            }
            newBg.setLevel(10000);
            drawable = newBg;
        }
        return drawable;
    }

    /**
     * <p>
     * Initialize the progress bar's default values:
     * </p>
     * <ul>
     * <li>progress = 0</li>
     * <li>max = 100</li>
     * <li>animation duration = 4000 ms</li>
     * <li>indeterminate = false</li>
     * <li>behavior = repeat</li>
     * </ul>
     */
    private initProgressBar():void  {
        this.mMax = 100;
        this.mProgress = 0;
        this.mSecondaryProgress = 0;
        this.mIndeterminate = false;
        this.mOnlyIndeterminate = false;
        this.mDuration = 4000;
        this.mBehavior = AlphaAnimation.RESTART;
        this.mMinWidth = 24;
        this.mMaxWidth = 48;
        this.mMinHeight = 24;
        this.mMaxHeight = 48;
    }

    /**
     * <p>Indicate whether this progress bar is in indeterminate mode.</p>
     *
     * @return true if the progress bar is in indeterminate mode
     */
    isIndeterminate():boolean  {
        return this.mIndeterminate;
    }

    /**
     * <p>Change the indeterminate mode for this progress bar. In indeterminate
     * mode, the progress is ignored and the progress bar shows an infinite
     * animation instead.</p>
     * 
     * If this progress bar's style only supports indeterminate mode (such as the circular
     * progress bars), then this will be ignored.
     *
     * @param indeterminate true to enable the indeterminate mode
     */
    setIndeterminate(indeterminate:boolean):void  {
        if ((!this.mOnlyIndeterminate || !this.mIndeterminate) && indeterminate != this.mIndeterminate) {
            this.mIndeterminate = indeterminate;
            if (indeterminate) {
                // swap between indeterminate and regular backgrounds
                this.mCurrentDrawable = this.mIndeterminateDrawable;
                this.startAnimation();
            } else {
                this.mCurrentDrawable = this.mProgressDrawable;
                this.stopAnimation();
            }
        }
    }

    /**
     * <p>Get the drawable used to draw the progress bar in
     * indeterminate mode.</p>
     *
     * @return a {@link android.graphics.drawable.Drawable} instance
     *
     * @see #setIndeterminateDrawable(android.graphics.drawable.Drawable)
     * @see #setIndeterminate(boolean)
     */
    getIndeterminateDrawable():Drawable  {
        return this.mIndeterminateDrawable;
    }

    /**
     * <p>Define the drawable used to draw the progress bar in
     * indeterminate mode.</p>
     *
     * @param d the new drawable
     *
     * @see #getIndeterminateDrawable()
     * @see #setIndeterminate(boolean)
     */
    setIndeterminateDrawable(d:Drawable):void  {
        if (d != null) {
            d.setCallback(this);
        }
        this.mIndeterminateDrawable = d;
        //if (this.mIndeterminateDrawable != null && this.canResolveLayoutDirection()) {
        //    this.mIndeterminateDrawable.setLayoutDirection(this.getLayoutDirection());
        //}
        if (this.mIndeterminate) {
            this.mCurrentDrawable = d;
            this.postInvalidate();
        }
    }

    /**
     * <p>Get the drawable used to draw the progress bar in
     * progress mode.</p>
     *
     * @return a {@link android.graphics.drawable.Drawable} instance
     *
     * @see #setProgressDrawable(android.graphics.drawable.Drawable)
     * @see #setIndeterminate(boolean)
     */
    getProgressDrawable():Drawable  {
        return this.mProgressDrawable;
    }

    /**
     * <p>Define the drawable used to draw the progress bar in
     * progress mode.</p>
     *
     * @param d the new drawable
     *
     * @see #getProgressDrawable()
     * @see #setIndeterminate(boolean)
     */
    setProgressDrawable(d:Drawable):void  {
        let needUpdate:boolean;
        if (this.mProgressDrawable != null && d != this.mProgressDrawable) {
            this.mProgressDrawable.setCallback(null);
            needUpdate = true;
        } else {
            needUpdate = false;
        }
        if (d != null) {
            d.setCallback(this);
            //if (this.canResolveLayoutDirection()) {
            //    d.setLayoutDirection(this.getLayoutDirection());
            //}
            // Make sure the ProgressBar is always tall enough
            let drawableHeight:number = d.getMinimumHeight();
            if (this.mMaxHeight < drawableHeight) {
                this.mMaxHeight = drawableHeight;
                this.requestLayout();
            }
        }
        this.mProgressDrawable = d;
        if (!this.mIndeterminate) {
            this.mCurrentDrawable = d;
            this.postInvalidate();
        }
        if (needUpdate) {
            this.updateDrawableBounds(this.getWidth(), this.getHeight());
            this.updateDrawableState();
            this.doRefreshProgress(R.id.progress, this.mProgress, false, false);
            this.doRefreshProgress(R.id.secondaryProgress, this.mSecondaryProgress, false, false);
        }
    }

    /**
     * @return The drawable currently used to draw the progress bar
     */
    getCurrentDrawable():Drawable  {
        return this.mCurrentDrawable;
    }

    protected verifyDrawable(who:Drawable):boolean  {
        return who == this.mProgressDrawable || who == this.mIndeterminateDrawable || super.verifyDrawable(who);
    }

    jumpDrawablesToCurrentState():void  {
        super.jumpDrawablesToCurrentState();
        if (this.mProgressDrawable != null)
            this.mProgressDrawable.jumpToCurrentState();
        if (this.mIndeterminateDrawable != null)
            this.mIndeterminateDrawable.jumpToCurrentState();
    }

    ///**
    // * @hide
    // */
    //onResolveDrawables(layoutDirection:number):void  {
    //    const d:Drawable = this.mCurrentDrawable;
    //    if (d != null) {
    //        d.setLayoutDirection(layoutDirection);
    //    }
    //    if (this.mIndeterminateDrawable != null) {
    //        this.mIndeterminateDrawable.setLayoutDirection(layoutDirection);
    //    }
    //    if (this.mProgressDrawable != null) {
    //        this.mProgressDrawable.setLayoutDirection(layoutDirection);
    //    }
    //}

    postInvalidate():void  {
        if (!this.mNoInvalidate) {
            super.postInvalidate();
        }
    }


    private doRefreshProgress(id:string, progress:number, fromUser:boolean, callBackToApp:boolean):void  {
        let scale:number = this.mMax > 0 ? <number> progress / <number> this.mMax : 0;
        const d:Drawable = this.mCurrentDrawable;
        if (d != null) {
            let progressDrawable:Drawable = null;
            if (d instanceof LayerDrawable) {
                progressDrawable = (<LayerDrawable> d).findDrawableByLayerId(id);
                //if (progressDrawable != null && this.canResolveLayoutDirection()) {
                //    progressDrawable.setLayoutDirection(this.getLayoutDirection());
                //}
            }
            const level:number = Math.floor((scale * ProgressBar.MAX_LEVEL));
            (progressDrawable != null ? progressDrawable : d).setLevel(level);
        } else {
            this.invalidate();
        }
        if (callBackToApp && id == R.id.progress) {
            this.onProgressRefresh(scale, fromUser);
        }
    }

    onProgressRefresh(scale:number, fromUser:boolean):void  {
        //if (AccessibilityManager.getInstance(this.mContext).isEnabled()) {
        //    this.scheduleAccessibilityEventSender();
        //}
    }

    private refreshProgress(id:string, progress:number, fromUser:boolean):void  {
        //if (this.mUiThreadId == Thread.currentThread().getId()) {
            this.doRefreshProgress(id, progress, fromUser, true);
        //} else {
        //    if (this.mRefreshProgressRunnable == null) {
        //        this.mRefreshProgressRunnable = new ProgressBar.RefreshProgressRunnable(this);
        //    }
        //    const rd:ProgressBar.RefreshData = ProgressBar.RefreshData.obtain(id, progress, fromUser);
        //    this.mRefreshData.add(rd);
        //    if (this.mAttached && !this.mRefreshIsPosted) {
        //        this.post(this.mRefreshProgressRunnable);
        //        this.mRefreshIsPosted = true;
        //    }
        //}
    }

    /**
     * <p>Set the current progress to the specified value. Does not do anything
     * if the progress bar is in indeterminate mode.</p>
     *
     * @param progress the new progress, between 0 and {@link #getMax()}
     *
     * @see #setIndeterminate(boolean)
     * @see #isIndeterminate()
     * @see #getProgress()
     * @see #incrementProgressBy(int) 
     */
    setProgress(progress:number, fromUser = false):void  {
        if (this.mIndeterminate) {
            return;
        }
        if (progress < 0) {
            progress = 0;
        }
        if (progress > this.mMax) {
            progress = this.mMax;
        }
        if (progress != this.mProgress) {
            this.mProgress = progress;
            this.refreshProgress(R.id.progress, this.mProgress, fromUser);
        }
    }

    /**
     * <p>
     * Set the current secondary progress to the specified value. Does not do
     * anything if the progress bar is in indeterminate mode.
     * </p>
     * 
     * @param secondaryProgress the new secondary progress, between 0 and {@link #getMax()}
     * @see #setIndeterminate(boolean)
     * @see #isIndeterminate()
     * @see #getSecondaryProgress()
     * @see #incrementSecondaryProgressBy(int)
     */
    setSecondaryProgress(secondaryProgress:number):void  {
        if (this.mIndeterminate) {
            return;
        }
        if (secondaryProgress < 0) {
            secondaryProgress = 0;
        }
        if (secondaryProgress > this.mMax) {
            secondaryProgress = this.mMax;
        }
        if (secondaryProgress != this.mSecondaryProgress) {
            this.mSecondaryProgress = secondaryProgress;
            this.refreshProgress(R.id.secondaryProgress, this.mSecondaryProgress, false);
        }
    }

    /**
     * <p>Get the progress bar's current level of progress. Return 0 when the
     * progress bar is in indeterminate mode.</p>
     *
     * @return the current progress, between 0 and {@link #getMax()}
     *
     * @see #setIndeterminate(boolean)
     * @see #isIndeterminate()
     * @see #setProgress(int)
     * @see #setMax(int)
     * @see #getMax()
     */
    getProgress():number  {
        return this.mIndeterminate ? 0 : this.mProgress;
    }

    /**
     * <p>Get the progress bar's current level of secondary progress. Return 0 when the
     * progress bar is in indeterminate mode.</p>
     *
     * @return the current secondary progress, between 0 and {@link #getMax()}
     *
     * @see #setIndeterminate(boolean)
     * @see #isIndeterminate()
     * @see #setSecondaryProgress(int)
     * @see #setMax(int)
     * @see #getMax()
     */
    getSecondaryProgress():number  {
        return this.mIndeterminate ? 0 : this.mSecondaryProgress;
    }

    /**
     * <p>Return the upper limit of this progress bar's range.</p>
     *
     * @return a positive integer
     *
     * @see #setMax(int)
     * @see #getProgress()
     * @see #getSecondaryProgress()
     */
    getMax():number  {
        return this.mMax;
    }

    /**
     * <p>Set the range of the progress bar to 0...<tt>max</tt>.</p>
     *
     * @param max the upper range of this progress bar
     *
     * @see #getMax()
     * @see #setProgress(int) 
     * @see #setSecondaryProgress(int) 
     */
    setMax(max:number):void  {
        if (max < 0) {
            max = 0;
        }
        if (max != this.mMax) {
            this.mMax = max;
            this.postInvalidate();
            if (this.mProgress > max) {
                this.mProgress = max;
            }
            this.refreshProgress(R.id.progress, this.mProgress, false);
        }
    }

    /**
     * <p>Increase the progress bar's progress by the specified amount.</p>
     *
     * @param diff the amount by which the progress must be increased
     *
     * @see #setProgress(int) 
     */
    incrementProgressBy(diff:number):void  {
        this.setProgress(this.mProgress + diff);
    }

    /**
     * <p>Increase the progress bar's secondary progress by the specified amount.</p>
     *
     * @param diff the amount by which the secondary progress must be increased
     *
     * @see #setSecondaryProgress(int) 
     */
    incrementSecondaryProgressBy(diff:number):void  {
        this.setSecondaryProgress(this.mSecondaryProgress + diff);
    }

    /**
     * <p>Start the indeterminate progress animation.</p>
     */
    startAnimation():void  {
        if (this.getVisibility() != ProgressBar.VISIBLE) {
            return;
        }
        if (Animatable.isImpl(this.mIndeterminateDrawable)) {
            this.mShouldStartAnimationDrawable = true;
            this.mHasAnimation = false;
        } else {
            this.mHasAnimation = true;
            if (this.mInterpolator == null) {
                this.mInterpolator = new LinearInterpolator();
            }
            if (this.mTransformation == null) {
                this.mTransformation = new Transformation();
            } else {
                this.mTransformation.clear();
            }
            if (this.mAnimation == null) {
                this.mAnimation = new AlphaAnimation(0.0, 1.0);
            } else {
                this.mAnimation.reset();
            }
            this.mAnimation.setRepeatMode(this.mBehavior);
            this.mAnimation.setRepeatCount(Animation.INFINITE);
            this.mAnimation.setDuration(this.mDuration);
            this.mAnimation.setInterpolator(this.mInterpolator);
            this.mAnimation.setStartTime(Animation.START_ON_FIRST_FRAME);
        }
        this.postInvalidate();
    }

    /**
     * <p>Stop the indeterminate progress animation.</p>
     */
    stopAnimation():void  {
        this.mHasAnimation = false;
        if (Animatable.isImpl(this.mIndeterminateDrawable)) {
            (<Animatable><any>this.mIndeterminateDrawable).stop();
            this.mShouldStartAnimationDrawable = false;
        }
        this.postInvalidate();
    }

    ///**
    // * Sets the acceleration curve for the indeterminate animation.
    // * The interpolator is loaded as a resource from the specified context.
    // *
    // * @param context The application environment
    // * @param resID The resource identifier of the interpolator to load
    // */
    //setInterpolator(context:Context, resID:number):void  {
    //    this.setInterpolator(AnimationUtils.loadInterpolator(context, resID));
    //}

    /**
     * Sets the acceleration curve for the indeterminate animation.
     * Defaults to a linear interpolation.
     *
     * @param interpolator The interpolator which defines the acceleration curve
     */
    setInterpolator(interpolator:Interpolator):void  {
        this.mInterpolator = interpolator;
    }

    /**
     * Gets the acceleration curve type for the indeterminate animation.
     *
     * @return the {@link Interpolator} associated to this animation
     */
    getInterpolator():Interpolator  {
        return this.mInterpolator;
    }

    setVisibility(v:number):void  {
        if (this.getVisibility() != v) {
            super.setVisibility(v);
            if (this.mIndeterminate) {
                // let's be nice with the UI thread
                if (v == ProgressBar.GONE || v == ProgressBar.INVISIBLE) {
                    this.stopAnimation();
                } else {
                    this.startAnimation();
                }
            }
        }
    }

    protected onVisibilityChanged(changedView:View, visibility:number):void  {
        super.onVisibilityChanged(changedView, visibility);
        if (this.mIndeterminate) {
            // let's be nice with the UI thread
            if (visibility == ProgressBar.GONE || visibility == ProgressBar.INVISIBLE) {
                this.stopAnimation();
            } else {
                this.startAnimation();
            }
        }
    }

    invalidateDrawable(dr:Drawable):void  {
        if (!this.mInDrawing) {
            if (this.verifyDrawable(dr)) {
                const dirty:Rect = dr.getBounds();
                const scrollX:number = this.mScrollX + this.mPaddingLeft;
                const scrollY:number = this.mScrollY + this.mPaddingTop;
                this.invalidate(dirty.left + scrollX, dirty.top + scrollY, dirty.right + scrollX, dirty.bottom + scrollY);
            } else {
                super.invalidateDrawable(dr);
            }
        }
    }

    protected onSizeChanged(w:number, h:number, oldw:number, oldh:number):void  {
        this.updateDrawableBounds(w, h);
    }

    private updateDrawableBounds(w:number, h:number):void  {
        // onDraw will translate the canvas so we draw starting at 0,0.
        // Subtract out padding for the purposes of the calculations below.
        w -= this.mPaddingRight + this.mPaddingLeft;
        h -= this.mPaddingTop + this.mPaddingBottom;
        let right:number = w;
        let bottom:number = h;
        let top:number = 0;
        let left:number = 0;
        if (this.mIndeterminateDrawable != null) {
            // Aspect ratio logic does not apply to AnimationDrawables
            if (this.mOnlyIndeterminate && !(this.mIndeterminateDrawable instanceof AnimationDrawable)) {
                // Maintain aspect ratio. Certain kinds of animated drawables
                // get very confused otherwise.
                const intrinsicWidth:number = this.mIndeterminateDrawable.getIntrinsicWidth();
                const intrinsicHeight:number = this.mIndeterminateDrawable.getIntrinsicHeight();
                const intrinsicAspect:number = <number> intrinsicWidth / intrinsicHeight;
                const boundAspect:number = <number> w / h;
                if (intrinsicAspect != boundAspect) {
                    if (boundAspect > intrinsicAspect) {
                        // New width is larger. Make it smaller to match height.
                        const width:number = Math.floor((h * intrinsicAspect));
                        left = (w - width) / 2;
                        right = left + width;
                    } else {
                        // New height is larger. Make it smaller to match width.
                        const height:number = Math.floor((w * (1 / intrinsicAspect)));
                        top = (h - height) / 2;
                        bottom = top + height;
                    }
                }
            }
            if (this.isLayoutRtl() && this.mMirrorForRtl) {
                let tempLeft:number = left;
                left = w - right;
                right = w - tempLeft;
            }
            this.mIndeterminateDrawable.setBounds(left, top, right, bottom);
        }
        if (this.mProgressDrawable != null) {
            this.mProgressDrawable.setBounds(0, 0, right, bottom);
        }
    }

    protected onDraw(canvas:Canvas):void  {
        super.onDraw(canvas);
        let d:Drawable = this.mCurrentDrawable;
        if (d != null) {
            // Translate canvas so a indeterminate circular progress bar with padding
            // rotates properly in its animation
            canvas.save();
            if (this.isLayoutRtl() && this.mMirrorForRtl) {
                canvas.translate(this.getWidth() - this.mPaddingRight, this.mPaddingTop);
                canvas.scale(-1.0, 1.0);
            } else {
                canvas.translate(this.mPaddingLeft, this.mPaddingTop);
            }
            let time:number = this.getDrawingTime();
            if (this.mHasAnimation) {
                this.mAnimation.getTransformation(time, this.mTransformation);
                let scale:number = this.mTransformation.getAlpha();
                try {
                    this.mInDrawing = true;
                    d.setLevel(Math.floor((scale * ProgressBar.MAX_LEVEL)));
                } finally {
                    this.mInDrawing = false;
                }
                this.postInvalidateOnAnimation();
            }
            d.draw(canvas);
            canvas.restore();
            if (this.mShouldStartAnimationDrawable && Animatable.isImpl(d) ) {
                (<Animatable><any>d).start();
                this.mShouldStartAnimationDrawable = false;
            }
        }
    }

    protected onMeasure(widthMeasureSpec:number, heightMeasureSpec:number):void  {
        let d:Drawable = this.mCurrentDrawable;
        let dw:number = 0;
        let dh:number = 0;
        if (d != null) {
            dw = Math.max(this.mMinWidth, Math.min(this.mMaxWidth, d.getIntrinsicWidth()));
            dh = Math.max(this.mMinHeight, Math.min(this.mMaxHeight, d.getIntrinsicHeight()));
        }
        this.updateDrawableState();
        dw += this.mPaddingLeft + this.mPaddingRight;
        dh += this.mPaddingTop + this.mPaddingBottom;
        this.setMeasuredDimension(ProgressBar.resolveSizeAndState(dw, widthMeasureSpec, 0), ProgressBar.resolveSizeAndState(dh, heightMeasureSpec, 0));
    }

    protected drawableStateChanged():void  {
        super.drawableStateChanged();
        this.updateDrawableState();
    }

    private updateDrawableState():void  {
        let state:number[] = this.getDrawableState();
        if (this.mProgressDrawable != null && this.mProgressDrawable.isStateful()) {
            this.mProgressDrawable.setState(state);
        }
        if (this.mIndeterminateDrawable != null && this.mIndeterminateDrawable.isStateful()) {
            this.mIndeterminateDrawable.setState(state);
        }
    }



    protected onAttachedToWindow():void  {
        super.onAttachedToWindow();
        if (this.mIndeterminate) {
            this.startAnimation();
        }
        if (this.mRefreshData != null) {
            {
                const count:number = this.mRefreshData.size();
                for (let i:number = 0; i < count; i++) {
                    const rd:ProgressBar.RefreshData = this.mRefreshData.get(i);
                    this.doRefreshProgress(rd.id, rd.progress, rd.fromUser, true);
                    rd.recycle();
                }
                this.mRefreshData.clear();
            }
        }
        this.mAttached = true;
    }

    protected onDetachedFromWindow():void  {
        if (this.mIndeterminate) {
            this.stopAnimation();
        }
        //if (this.mRefreshProgressRunnable != null) {
        //    this.removeCallbacks(this.mRefreshProgressRunnable);
        //}
        //if (this.mRefreshProgressRunnable != null && this.mRefreshIsPosted) {
        //    this.removeCallbacks(this.mRefreshProgressRunnable);
        //}
        //if (this.mAccessibilityEventSender != null) {
        //    this.removeCallbacks(this.mAccessibilityEventSender);
        //}
        // This should come after stopAnimation(), otherwise an invalidate message remains in the
        // queue, which can prevent the entire view hierarchy from being GC'ed during a rotation
        super.onDetachedFromWindow();
        this.mAttached = false;
    }


}

export module ProgressBar{
//export class RefreshProgressRunnable implements Runnable {
//    _ProgressBar_this:ProgressBar;
//    constructor(arg:ProgressBar){
//        this._ProgressBar_this = arg;
//    }
//
//    run():void  {
//        {
//            const count:number = this._ProgressBar_this.mRefreshData.size();
//            for (let i:number = 0; i < count; i++) {
//                const rd:ProgressBar.RefreshData = this._ProgressBar_this.mRefreshData.get(i);
//                this._ProgressBar_this.doRefreshProgress(rd.id, rd.progress, rd.fromUser, true);
//                rd.recycle();
//            }
//            this._ProgressBar_this.mRefreshData.clear();
//            this._ProgressBar_this.mRefreshIsPosted = false;
//        }
//    }
//}
export class RefreshData {

    private static POOL_MAX:number = 24;

    private static sPool:SynchronizedPool<RefreshData> = new SynchronizedPool<RefreshData>(RefreshData.POOL_MAX);

    id:string;

    progress:number = 0;

    fromUser:boolean;

    static obtain(id:string, progress:number, fromUser:boolean):RefreshData  {
        let rd:RefreshData = RefreshData.sPool.acquire();
        if (rd == null) {
            rd = new RefreshData();
        }
        rd.id = id;
        rd.progress = progress;
        rd.fromUser = fromUser;
        return rd;
    }

    recycle():void  {
        RefreshData.sPool.release(this);
    }
}
}

}
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

///<reference path="../../android/graphics/Canvas.ts"/>
///<reference path="../../android/graphics/Rect.ts"/>
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/view/KeyEvent.ts"/>
///<reference path="../../android/view/MotionEvent.ts"/>
///<reference path="../../android/view/ViewConfiguration.ts"/>
///<reference path="../../java/lang/Integer.ts"/>
///<reference path="../../android/widget/ProgressBar.ts"/>

module android.widget {
import Canvas = android.graphics.Canvas;
import Rect = android.graphics.Rect;
import Drawable = android.graphics.drawable.Drawable;
import KeyEvent = android.view.KeyEvent;
import MotionEvent = android.view.MotionEvent;
import ViewConfiguration = android.view.ViewConfiguration;
import Integer = java.lang.Integer;
import ProgressBar = android.widget.ProgressBar;
    import AttrBinder = androidui.attr.AttrBinder;

export abstract class AbsSeekBar extends ProgressBar {

    private mThumb:Drawable;

    private mThumbOffset:number = 0;

    /**
     * On touch, this offset plus the scaled value from the position of the
     * touch will form the progress value. Usually 0.
     */
    mTouchProgressOffset:number = 0;

    /**
     * Whether this is user seekable.
     */
    mIsUserSeekable:boolean = true;

    /**
     * On key presses (right or left), the amount to increment/decrement the
     * progress.
     */
    private mKeyProgressIncrement:number = 1;

    private static NO_ALPHA:number = 0xFF;

    private mDisabledAlpha:number = 0;

    private mTouchDownX:number = 0;

    private mIsDragging:boolean;


    constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle?:Map<string, string>) {
        super(context, bindElement, defStyle);

        let a = context.obtainStyledAttributes(bindElement, defStyle);
        const thumb = a.getDrawable('thumb');
        this.setThumb(thumb); // will guess mThumbOffset if thumb != null...
        // ...but allow layout to override this
        const thumbOffset = a.getDimensionPixelOffset('thumbOffset', this.getThumbOffset());
        this.setThumbOffset(thumbOffset);
        a.recycle();

        a = context.obtainStyledAttributes(bindElement, defStyle);
        this.mDisabledAlpha = a.getFloat('disabledAlpha', 0.5);
        a.recycle();
    }

    protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
        return super.createClassAttrBinder().set('thumb', {
            setter(v:AbsSeekBar, value:any, attrBinder:AttrBinder) {
                v.setThumb(attrBinder.parseDrawable(value));
            }, getter(v:AbsSeekBar) {
                return v.mThumb;
            }
        }).set('thumbOffset', {
            setter(v:AbsSeekBar, value:any, attrBinder:AttrBinder) {
                v.setThumbOffset(attrBinder.parseNumberPixelOffset(value));
            }, getter(v:AbsSeekBar) {
                return v.mThumbOffset;
            }
        }).set('disabledAlpha', {
            setter(v:AbsSeekBar, value:any, attrBinder:AttrBinder) {
                v.mDisabledAlpha = attrBinder.parseFloat(value, 0.5);
            }, getter(v:AbsSeekBar) {
                return v.mDisabledAlpha;
            }
        });
    }

    /**
     * Sets the thumb that will be drawn at the end of the progress meter within the SeekBar.
     * <p>
     * If the thumb is a valid drawable (i.e. not null), half its width will be
     * used as the new thumb offset (@see #setThumbOffset(int)).
     * 
     * @param thumb Drawable representing the thumb
     */
    setThumb(thumb:Drawable):void  {
        let needUpdate:boolean;
        // drawable changed)
        if (this.mThumb != null && thumb != this.mThumb) {
            this.mThumb.setCallback(null);
            needUpdate = true;
        } else {
            needUpdate = false;
        }
        if (thumb != null) {
            thumb.setCallback(this);
            //if (this.canResolveLayoutDirection()) {
            //    thumb.setLayoutDirection(this.getLayoutDirection());
            //}
            // Assuming the thumb drawable is symmetric, set the thumb offset
            // such that the thumb will hang halfway off either edge of the
            // progress bar.
            this.mThumbOffset = thumb.getIntrinsicWidth() / 2;
            // If we're updating get the new states
            if (needUpdate && (thumb.getIntrinsicWidth() != this.mThumb.getIntrinsicWidth() || thumb.getIntrinsicHeight() != this.mThumb.getIntrinsicHeight())) {
                this.requestLayout();
            }
        }
        this.mThumb = thumb;
        this.invalidate();
        if (needUpdate) {
            this.updateThumbPos(this.getWidth(), this.getHeight());
            if (thumb != null && thumb.isStateful()) {
                // Note that if the states are different this won't work.
                // For now, let's consider that an app bug.
                let state:number[] = this.getDrawableState();
                thumb.setState(state);
            }
        }
    }

    /**
     * Return the drawable used to represent the scroll thumb - the component that
     * the user can drag back and forth indicating the current value by its position.
     *
     * @return The current thumb drawable
     */
    getThumb():Drawable  {
        return this.mThumb;
    }

    /**
     * @see #setThumbOffset(int)
     */
    getThumbOffset():number  {
        return this.mThumbOffset;
    }

    /**
     * Sets the thumb offset that allows the thumb to extend out of the range of
     * the track.
     * 
     * @param thumbOffset The offset amount in pixels.
     */
    setThumbOffset(thumbOffset:number):void  {
        this.mThumbOffset = thumbOffset;
        this.invalidate();
    }

    /**
     * Sets the amount of progress changed via the arrow keys.
     * 
     * @param increment The amount to increment or decrement when the user
     *            presses the arrow keys.
     */
    setKeyProgressIncrement(increment:number):void  {
        this.mKeyProgressIncrement = increment < 0 ? -increment : increment;
    }

    /**
     * Returns the amount of progress changed via the arrow keys.
     * <p>
     * By default, this will be a value that is derived from the max progress.
     * 
     * @return The amount to increment or decrement when the user presses the
     *         arrow keys. This will be positive.
     */
    getKeyProgressIncrement():number  {
        return this.mKeyProgressIncrement;
    }

    setMax(max:number):void  {
        super.setMax(max);
        if ((this.mKeyProgressIncrement == 0) || (this.getMax() / this.mKeyProgressIncrement > 20)) {
            // It will take the user too long to change this via keys, change it
            // to something more reasonable
            this.setKeyProgressIncrement(Math.max(1, Math.round(<number> this.getMax() / 20)));
        }
    }

    protected verifyDrawable(who:Drawable):boolean  {
        return who == this.mThumb || super.verifyDrawable(who);
    }

    jumpDrawablesToCurrentState():void  {
        super.jumpDrawablesToCurrentState();
        if (this.mThumb != null)
            this.mThumb.jumpToCurrentState();
    }

    protected drawableStateChanged():void  {
        super.drawableStateChanged();
        let progressDrawable:Drawable = this.getProgressDrawable();
        if (progressDrawable != null) {
            progressDrawable.setAlpha(this.isEnabled() ? AbsSeekBar.NO_ALPHA : Math.floor((AbsSeekBar.NO_ALPHA * this.mDisabledAlpha)));
        }
        if (this.mThumb != null && this.mThumb.isStateful()) {
            let state:number[] = this.getDrawableState();
            this.mThumb.setState(state);
        }
    }

    onProgressRefresh(scale:number, fromUser:boolean):void  {
        super.onProgressRefresh(scale, fromUser);
        let thumb:Drawable = this.mThumb;
        if (thumb != null) {
            this.setThumbPos(this.getWidth(), thumb, scale, Integer.MIN_VALUE);
            /*
             * Since we draw translated, the drawable's bounds that it signals
             * for invalidation won't be the actual bounds we want invalidated,
             * so just invalidate this whole view.
             */
            this.invalidate();
        }
    }

    protected onSizeChanged(w:number, h:number, oldw:number, oldh:number):void  {
        super.onSizeChanged(w, h, oldw, oldh);
        this.updateThumbPos(w, h);
    }

    private updateThumbPos(w:number, h:number):void  {
        let d:Drawable = this.getCurrentDrawable();
        let thumb:Drawable = this.mThumb;
        let thumbHeight:number = thumb == null ? 0 : thumb.getIntrinsicHeight();
        // The max height does not incorporate padding, whereas the height
        // parameter does
        let trackHeight:number = Math.min(this.mMaxHeight, h - this.mPaddingTop - this.mPaddingBottom);
        let max:number = this.getMax();
        let scale:number = max > 0 ? <number> this.getProgress() / <number> max : 0;
        if (thumbHeight > trackHeight) {
            if (thumb != null) {
                this.setThumbPos(w, thumb, scale, 0);
            }
            let gapForCenteringTrack:number = (thumbHeight - trackHeight) / 2;
            if (d != null) {
                // Canvas will be translated by the padding, so 0,0 is where we start drawing
                d.setBounds(0, gapForCenteringTrack, w - this.mPaddingRight - this.mPaddingLeft, h - this.mPaddingBottom - gapForCenteringTrack - this.mPaddingTop);
            }
        } else {
            if (d != null) {
                // Canvas will be translated by the padding, so 0,0 is where we start drawing
                d.setBounds(0, 0, w - this.mPaddingRight - this.mPaddingLeft, h - this.mPaddingBottom - this.mPaddingTop);
            }
            let gap:number = (trackHeight - thumbHeight) / 2;
            if (thumb != null) {
                this.setThumbPos(w, thumb, scale, gap);
            }
        }
    }

    /**
     * @param gap If set to {@link Integer#MIN_VALUE}, this will be ignored and
     */
    private setThumbPos(w:number, thumb:Drawable, scale:number, gap:number):void  {
        let available:number = w - this.mPaddingLeft - this.mPaddingRight;
        let thumbWidth:number = thumb.getIntrinsicWidth();
        let thumbHeight:number = thumb.getIntrinsicHeight();
        available -= thumbWidth;
        // The extra space for the thumb to move on the track
        available += this.mThumbOffset * 2;
        let thumbPos:number = Math.floor((scale * available));
        let topBound:number, bottomBound:number;
        if (gap == Integer.MIN_VALUE) {
            let oldBounds:Rect = thumb.getBounds();
            topBound = oldBounds.top;
            bottomBound = oldBounds.bottom;
        } else {
            topBound = gap;
            bottomBound = gap + thumbHeight;
        }
        // Canvas will be translated, so 0,0 is where we start drawing
        const left:number = (this.isLayoutRtl() && this.mMirrorForRtl) ? available - thumbPos : thumbPos;
        thumb.setBounds(left, topBound, left + thumbWidth, bottomBound);
    }

    ///**
    // * @hide
    // */
    //onResolveDrawables(layoutDirection:number):void  {
    //    super.onResolveDrawables(layoutDirection);
    //    if (this.mThumb != null) {
    //        this.mThumb.setLayoutDirection(layoutDirection);
    //    }
    //}

    protected onDraw(canvas:Canvas):void  {
        super.onDraw(canvas);
        if (this.mThumb != null) {
            canvas.save();
            // Translate the padding. For the x, we need to allow the thumb to
            // draw in its extra space
            canvas.translate(this.mPaddingLeft - this.mThumbOffset, this.mPaddingTop);
            this.mThumb.draw(canvas);
            canvas.restore();
        }
    }

    protected onMeasure(widthMeasureSpec:number, heightMeasureSpec:number):void  {
        let d:Drawable = this.getCurrentDrawable();
        let thumbHeight:number = this.mThumb == null ? 0 : this.mThumb.getIntrinsicHeight();
        let dw:number = 0;
        let dh:number = 0;
        if (d != null) {
            dw = Math.max(this.mMinWidth, Math.min(this.mMaxWidth, d.getIntrinsicWidth()));
            dh = Math.max(this.mMinHeight, Math.min(this.mMaxHeight, d.getIntrinsicHeight()));
            dh = Math.max(thumbHeight, dh);
        }
        dw += this.mPaddingLeft + this.mPaddingRight;
        dh += this.mPaddingTop + this.mPaddingBottom;
        this.setMeasuredDimension(AbsSeekBar.resolveSizeAndState(dw, widthMeasureSpec, 0), AbsSeekBar.resolveSizeAndState(dh, heightMeasureSpec, 0));
    }

    onTouchEvent(event:MotionEvent):boolean  {
        if (!this.mIsUserSeekable || !this.isEnabled()) {
            return false;
        }
        switch(event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                if (this.isInScrollingContainer()) {
                    this.mTouchDownX = event.getX();
                } else {
                    this.setPressed(true);
                    if (this.mThumb != null) {
                        // This may be within the padding region
                        this.invalidate(this.mThumb.getBounds());
                    }
                    this.onStartTrackingTouch();
                    this.trackTouchEvent(event);
                    this.attemptClaimDrag();
                }
                break;
            case MotionEvent.ACTION_MOVE:
                if (this.mIsDragging) {
                    this.trackTouchEvent(event);
                } else {
                    const x:number = event.getX();
                    if (Math.abs(x - this.mTouchDownX) > this.mTouchSlop) {
                        this.setPressed(true);
                        if (this.mThumb != null) {
                            // This may be within the padding region
                            this.invalidate(this.mThumb.getBounds());
                        }
                        this.onStartTrackingTouch();
                        this.trackTouchEvent(event);
                        this.attemptClaimDrag();
                    }
                }
                break;
            case MotionEvent.ACTION_UP:
                if (this.mIsDragging) {
                    this.trackTouchEvent(event);
                    this.onStopTrackingTouch();
                    this.setPressed(false);
                } else {
                    // Touch up when we never crossed the touch slop threshold should
                    // be interpreted as a tap-seek to that location.
                    this.onStartTrackingTouch();
                    this.trackTouchEvent(event);
                    this.onStopTrackingTouch();
                }
                // ProgressBar doesn't know to repaint the thumb drawable
                // in its inactive state when the touch stops (because the
                // value has not apparently changed)
                this.invalidate();
                break;
            case MotionEvent.ACTION_CANCEL:
                if (this.mIsDragging) {
                    this.onStopTrackingTouch();
                    this.setPressed(false);
                }
                // see above explanation
                this.invalidate();
                break;
        }
        return true;
    }

    private trackTouchEvent(event:MotionEvent):void  {
        const width:number = this.getWidth();
        const available:number = width - this.mPaddingLeft - this.mPaddingRight;
        let x:number = Math.floor(event.getX());
        let scale:number;
        let progress:number = 0;
        if (this.isLayoutRtl() && this.mMirrorForRtl) {
            if (x > width - this.mPaddingRight) {
                scale = 0.0;
            } else if (x < this.mPaddingLeft) {
                scale = 1.0;
            } else {
                scale = <number> (available - x + this.mPaddingLeft) / <number> available;
                progress = this.mTouchProgressOffset;
            }
        } else {
            if (x < this.mPaddingLeft) {
                scale = 0.0;
            } else if (x > width - this.mPaddingRight) {
                scale = 1.0;
            } else {
                scale = <number> (x - this.mPaddingLeft) / <number> available;
                progress = this.mTouchProgressOffset;
            }
        }
        const max:number = this.getMax();
        progress += scale * max;
        this.setProgress(Math.floor(progress), true);
    }

    /**
     * Tries to claim the user's drag motion, and requests disallowing any
     * ancestors from stealing events in the drag.
     */
    private attemptClaimDrag():void  {
        if (this.mParent != null) {
            this.mParent.requestDisallowInterceptTouchEvent(true);
        }
    }

    /**
     * This is called when the user has started touching this widget.
     */
    onStartTrackingTouch():void  {
        this.mIsDragging = true;
    }

    /**
     * This is called when the user either releases his touch or the touch is
     * canceled.
     */
    onStopTrackingTouch():void  {
        this.mIsDragging = false;
    }

    /**
     * Called when the user changes the seekbar's progress by using a key event.
     */
    onKeyChange():void  {
    }

    onKeyDown(keyCode:number, event:KeyEvent):boolean  {
        if (this.isEnabled()) {
            let progress:number = this.getProgress();
            switch(keyCode) {
                case KeyEvent.KEYCODE_DPAD_LEFT:
                    if (progress <= 0)
                        break;
                    this.setProgress(progress - this.mKeyProgressIncrement, true);
                    this.onKeyChange();
                    return true;
                case KeyEvent.KEYCODE_DPAD_RIGHT:
                    if (progress >= this.getMax())
                        break;
                    this.setProgress(progress + this.mKeyProgressIncrement, true);
                    this.onKeyChange();
                    return true;
            }
        }
        return super.onKeyDown(keyCode, event);
    }

    //onRtlPropertiesChanged(layoutDirection:number):void  {
    //    super.onRtlPropertiesChanged(layoutDirection);
    //    let max:number = this.getMax();
    //    let scale:number = max > 0 ? <number> this.getProgress() / <number> max : 0;
    //    let thumb:Drawable = this.mThumb;
    //    if (thumb != null) {
    //        this.setThumbPos(this.getWidth(), thumb, scale, Integer.MIN_VALUE);
    //        /*
    //         * Since we draw translated, the drawable's bounds that it signals
    //         * for invalidation won't be the actual bounds we want invalidated,
    //         * so just invalidate this whole view.
    //         */
    //        this.invalidate();
    //    }
    //}
}
}
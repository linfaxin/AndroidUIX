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

///<reference path="../../android/widget/AbsSeekBar.ts"/>
///<reference path="../../android/widget/ProgressBar.ts"/>
///<reference path="../../android/widget/SeekBar.ts"/>

module android.widget {
import AbsSeekBar = android.widget.AbsSeekBar;
import ProgressBar = android.widget.ProgressBar;
import SeekBar = android.widget.SeekBar;
    import AttrBinder = androidui.attr.AttrBinder;
/**
 * A RatingBar is an extension of SeekBar and ProgressBar that shows a rating in
 * stars. The user can touch/drag or use arrow keys to set the rating when using
 * the default size RatingBar. The smaller RatingBar style (
 * {@link android.R.attr#ratingBarStyleSmall}) and the larger indicator-only
 * style ({@link android.R.attr#ratingBarStyleIndicator}) do not support user
 * interaction and should only be used as indicators.
 * <p>
 * When using a RatingBar that supports user interaction, placing widgets to the
 * left or right of the RatingBar is discouraged.
 * <p>
 * The number of stars set (via {@link #setNumStars(int)} or in an XML layout)
 * will be shown when the layout width is set to wrap content (if another layout
 * width is set, the results may be unpredictable).
 * <p>
 * The secondary progress should not be modified by the client as it is used
 * internally as the background for a fractionally filled star.
 * 
 * @attr ref android.R.styleable#RatingBar_numStars
 * @attr ref android.R.styleable#RatingBar_rating
 * @attr ref android.R.styleable#RatingBar_stepSize
 * @attr ref android.R.styleable#RatingBar_isIndicator
 */
export class RatingBar extends AbsSeekBar {



    private mNumStars:number = 5;

    private mProgressOnStartTracking:number = 0;

    private mOnRatingBarChangeListener:RatingBar.OnRatingBarChangeListener;


    constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle=android.R.attr.ratingBarStyle) {
        super(context, bindElement, defStyle);

        const a = context.obtainStyledAttributes(bindElement, defStyle);
        const numStars = a.getInt('numStars', this.mNumStars);
        this.setIsIndicator(a.getBoolean('isIndicator', !this.mIsUserSeekable));
        const rating = a.getFloat('rating', -1);
        const stepSize = a.getFloat('stepSize', -1);
        a.recycle();

        if (numStars > 0 && numStars != this.mNumStars) {
            this.setNumStars(numStars);
        }

        if (stepSize >= 0) {
            this.setStepSize(stepSize);
        } else {
            this.setStepSize(0.5);
        }

        if (rating >= 0) {
            this.setRating(rating);
        }

        // A touch inside a star fill up to that fractional area (slightly more
        // than 1 so boundaries round up).
        this.mTouchProgressOffset = 1.1;

    }

    protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
        return super.createClassAttrBinder().set('numStars', {
            setter(v:RatingBar, value:any, a:AttrBinder) {
                v.setNumStars(a.parseInt(value, v.mNumStars));
            }, getter(v:RatingBar) {
                return v.mNumStars;
            }
        }).set('isIndicator', {
            setter(v:RatingBar, value:any, a:AttrBinder) {
                v.setIsIndicator(a.parseBoolean(value, !v.mIsUserSeekable));
            }, getter(v:RatingBar) {
                return v.isIndicator();
            }
        }).set('stepSize', {
            setter(v:RatingBar, value:any, a:AttrBinder) {
                v.setStepSize(a.parseFloat(value, 0.5));
            }, getter(v:RatingBar) {
                return v.getStepSize();
            }
        }).set('rating', {
            setter(v:RatingBar, value:any, a:AttrBinder) {
                v.setRating(a.parseFloat(value, v.getRating()));
            }, getter(v:RatingBar) {
                return v.getRating();
            }
        });
    }

//constructor( context:Context, attrs:AttributeSet, defStyle:number) {
    //    super(context, attrs, defStyle);
    //    let a:TypedArray = context.obtainStyledAttributes(attrs, R.styleable.RatingBar, defStyle, 0);
    //    const numStars:number = a.getInt(R.styleable.RatingBar_numStars, this.mNumStars);
    //    this.setIsIndicator(a.getBoolean(R.styleable.RatingBar_isIndicator, !this.mIsUserSeekable));
    //    const rating:number = a.getFloat(R.styleable.RatingBar_rating, -1);
    //    const stepSize:number = a.getFloat(R.styleable.RatingBar_stepSize, -1);
    //    a.recycle();
    //    if (numStars > 0 && numStars != this.mNumStars) {
    //        this.setNumStars(numStars);
    //    }
    //    if (stepSize >= 0) {
    //        this.setStepSize(stepSize);
    //    } else {
    //        this.setStepSize(0.5);
    //    }
    //    if (rating >= 0) {
    //        this.setRating(rating);
    //    }
    //    // A touch inside a star fill up to that fractional area (slightly more
    //    // than 1 so boundaries round up).
    //    this.mTouchProgressOffset = 1.1;
    //}

    /**
     * Sets the listener to be called when the rating changes.
     * 
     * @param listener The listener.
     */
    setOnRatingBarChangeListener(listener:RatingBar.OnRatingBarChangeListener):void  {
        this.mOnRatingBarChangeListener = listener;
    }

    /**
     * @return The listener (may be null) that is listening for rating change
     *         events.
     */
    getOnRatingBarChangeListener():RatingBar.OnRatingBarChangeListener  {
        return this.mOnRatingBarChangeListener;
    }

    /**
     * Whether this rating bar should only be an indicator (thus non-changeable
     * by the user).
     * 
     * @param isIndicator Whether it should be an indicator.
     *
     * @attr ref android.R.styleable#RatingBar_isIndicator
     */
    setIsIndicator(isIndicator:boolean):void  {
        this.mIsUserSeekable = !isIndicator;
        this.setFocusable(!isIndicator);
    }

    /**
     * @return Whether this rating bar is only an indicator.
     *
     * @attr ref android.R.styleable#RatingBar_isIndicator
     */
    isIndicator():boolean  {
        return !this.mIsUserSeekable;
    }

    /**
     * Sets the number of stars to show. In order for these to be shown
     * properly, it is recommended the layout width of this widget be wrap
     * content.
     * 
     * @param numStars The number of stars.
     */
    setNumStars(numStars:number):void  {
        if (numStars <= 0) {
            return;
        }
        let step = this.getStepSize();
        this.mNumStars = numStars;
        this.setStepSize(step);

        // This causes the width to change, so re-layout
        this.requestLayout();

    }

    /**
     * Returns the number of stars shown.
     * @return The number of stars shown.
     */
    getNumStars():number  {
        return this.mNumStars;
    }

    /**
     * Sets the rating (the number of stars filled).
     * 
     * @param rating The rating to set.
     */
    setRating(rating:number):void  {
        this.setProgress(Math.round(rating * this.getProgressPerStar()));
    }

    /**
     * Gets the current rating (number of stars filled).
     * 
     * @return The current rating.
     */
    getRating():number  {
        return this.getProgress() / this.getProgressPerStar();
    }

    /**
     * Sets the step size (granularity) of this rating bar.
     * 
     * @param stepSize The step size of this rating bar. For example, if
     *            half-star granularity is wanted, this would be 0.5.
     */
    setStepSize(stepSize:number):void  {
        if (Number.isNaN(stepSize) || !Number.isFinite(stepSize) || stepSize <= 0) {
            return;
        }
        const newMax:number = this.mNumStars / stepSize;
        let newProgress:number = Math.floor((newMax / this.getMax() * this.getProgress()));
        if(Number.isNaN(newProgress)) newProgress = 0;
        this.setMax(Math.floor(newMax));
        this.setProgress(newProgress);
    }

    /**
     * Gets the step size of this rating bar.
     * 
     * @return The step size.
     */
    getStepSize():number  {
        return <number> this.getNumStars() / this.getMax();
    }

    /**
     * @return The amount of progress that fits into a star
     */
    private getProgressPerStar():number  {
        if (this.mNumStars > 0) {
            return 1 * this.getMax() / this.mNumStars;
        } else {
            return 1;
        }
    }

    //getDrawableShape():Shape  {
    //    // TODO: Once ProgressBar's TODOs are fixed, this won't be needed
    //    return new RectShape();
    //}

    onProgressRefresh(scale:number, fromUser:boolean):void  {
        super.onProgressRefresh(scale, fromUser);
        // Keep secondary progress in sync with primary
        this.updateSecondaryProgress(this.getProgress());
        if (!fromUser) {
            // Callback for non-user rating changes
            this.dispatchRatingChange(false);
        }
    }

    /**
     * The secondary progress is used to differentiate the background of a
     * partially filled star. This method keeps the secondary progress in sync
     * with the progress.
     * 
     * @param progress The primary progress level.
     */
    private updateSecondaryProgress(progress:number):void  {
        const ratio:number = this.getProgressPerStar();
        if (ratio > 0) {
            const progressInStars:number = progress / ratio;
            const secondaryProgress:number = Math.floor((Math.ceil(progressInStars) * ratio));
            this.setSecondaryProgress(secondaryProgress);
        }
    }

    protected onMeasure(widthMeasureSpec:number, heightMeasureSpec:number):void  {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        if (this.mSampleTile != null) {
            // TODO: Once ProgressBar's TODOs are gone, this can be done more
            // cleanly than mSampleTile
            const width:number = this.mSampleTile.getIntrinsicWidth() * this.mNumStars;
            this.setMeasuredDimension(RatingBar.resolveSizeAndState(width, widthMeasureSpec, 0), this.getMeasuredHeight());
        }
    }

    onStartTrackingTouch():void  {
        this.mProgressOnStartTracking = this.getProgress();
        super.onStartTrackingTouch();
    }

    onStopTrackingTouch():void  {
        super.onStopTrackingTouch();
        if (this.getProgress() != this.mProgressOnStartTracking) {
            this.dispatchRatingChange(true);
        }
    }

    onKeyChange():void  {
        super.onKeyChange();
        this.dispatchRatingChange(true);
    }

    dispatchRatingChange(fromUser:boolean):void  {
        if (this.mOnRatingBarChangeListener != null) {
            this.mOnRatingBarChangeListener.onRatingChanged(this, this.getRating(), fromUser);
        }
    }

    setMax(max:number):void  {
        // Disallow max progress = 0
        if (max <= 0) {
            return;
        }
        super.setMax(max);
    }
}

export module RatingBar{
/**
     * A callback that notifies clients when the rating has been changed. This
     * includes changes that were initiated by the user through a touch gesture
     * or arrow key/trackball as well as changes that were initiated
     * programmatically.
     */
export interface OnRatingBarChangeListener {

    /**
         * Notification that the rating has changed. Clients can use the
         * fromUser parameter to distinguish user-initiated changes from those
         * that occurred programmatically. This will not be called continuously
         * while the user is dragging, only when the user finalizes a rating by
         * lifting the touch.
         * 
         * @param ratingBar The RatingBar whose rating has changed.
         * @param rating The current rating. This will be in the range
         *            0..numStars.
         * @param fromUser True if the rating change was initiated by a user's
         *            touch gesture or arrow key/horizontal trackbell movement.
         */
    onRatingChanged(ratingBar:RatingBar, rating:number, fromUser:boolean):void ;
}
}

}
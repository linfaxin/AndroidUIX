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

///<reference path="../../android/widget/AbsSeekBar.ts"/>
///<reference path="../../android/widget/ProgressBar.ts"/>

module android.widget {
import AbsSeekBar = android.widget.AbsSeekBar;
import ProgressBar = android.widget.ProgressBar;
/**
 * A SeekBar is an extension of ProgressBar that adds a draggable thumb. The user can touch
 * the thumb and drag left or right to set the current progress level or use the arrow keys.
 * Placing focusable widgets to the left or right of a SeekBar is discouraged. 
 * <p>
 * Clients of the SeekBar can attach a {@link SeekBar.OnSeekBarChangeListener} to
 * be notified of the user's actions.
 *
 * @attr ref android.R.styleable#SeekBar_thumb
 */
export class SeekBar extends AbsSeekBar {

    private mOnSeekBarChangeListener:SeekBar.OnSeekBarChangeListener;


    constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle=android.R.attr.seekBarStyle){
        super(context, bindElement, defStyle);
    }

    onProgressRefresh(scale:number, fromUser:boolean):void  {
        super.onProgressRefresh(scale, fromUser);
        if (this.mOnSeekBarChangeListener != null) {
            this.mOnSeekBarChangeListener.onProgressChanged(this, this.getProgress(), fromUser);
        }
    }

    /**
     * Sets a listener to receive notifications of changes to the SeekBar's progress level. Also
     * provides notifications of when the user starts and stops a touch gesture within the SeekBar.
     * 
     * @param l The seek bar notification listener
     * 
     * @see SeekBar.OnSeekBarChangeListener
     */
    setOnSeekBarChangeListener(l:SeekBar.OnSeekBarChangeListener):void  {
        this.mOnSeekBarChangeListener = l;
    }

    onStartTrackingTouch():void  {
        super.onStartTrackingTouch();
        if (this.mOnSeekBarChangeListener != null) {
            this.mOnSeekBarChangeListener.onStartTrackingTouch(this);
        }
    }

    onStopTrackingTouch():void  {
        super.onStopTrackingTouch();
        if (this.mOnSeekBarChangeListener != null) {
            this.mOnSeekBarChangeListener.onStopTrackingTouch(this);
        }
    }
}

export module SeekBar{
/**
     * A callback that notifies clients when the progress level has been
     * changed. This includes changes that were initiated by the user through a
     * touch gesture or arrow key/trackball as well as changes that were initiated
     * programmatically.
     */
export interface OnSeekBarChangeListener {

    /**
         * Notification that the progress level has changed. Clients can use the fromUser parameter
         * to distinguish user-initiated changes from those that occurred programmatically.
         * 
         * @param seekBar The SeekBar whose progress has changed
         * @param progress The current progress level. This will be in the range 0..max where max
         *        was set by {@link ProgressBar#setMax(int)}. (The default value for max is 100.)
         * @param fromUser True if the progress change was initiated by the user.
         */
    onProgressChanged(seekBar:SeekBar, progress:number, fromUser:boolean):void ;

    /**
         * Notification that the user has started a touch gesture. Clients may want to use this
         * to disable advancing the seekbar. 
         * @param seekBar The SeekBar in which the touch gesture began
         */
    onStartTrackingTouch(seekBar:SeekBar):void ;

    /**
         * Notification that the user has finished a touch gesture. Clients may want to use this
         * to re-enable advancing the seekbar. 
         * @param seekBar The SeekBar in which the touch gesture began
         */
    onStopTrackingTouch(seekBar:SeekBar):void ;
}
}

}
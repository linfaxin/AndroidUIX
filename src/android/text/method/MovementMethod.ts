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

///<reference path="../../../android/widget/TextView.ts"/>
///<reference path="../../../android/view/KeyEvent.ts"/>
///<reference path="../../../android/view/MotionEvent.ts"/>
///<reference path="../../../android/text/Spannable.ts"/>

module android.text.method {
import TextView = android.widget.TextView;
import KeyEvent = android.view.KeyEvent;
import MotionEvent = android.view.MotionEvent;
import Spannable = android.text.Spannable;
/**
 * Provides cursor positioning, scrolling and text selection functionality in a {@link TextView}.
 * <p>
 * The {@link TextView} delegates handling of key events, trackball motions and touches to
 * the movement method for purposes of content navigation.  The framework automatically
 * selects an appropriate movement method based on the content of the {@link TextView}.
 * </p><p>
 * This interface is intended for use by the framework; it should not be implemented
 * directly by applications.
 * </p>
 */
export interface MovementMethod {

    initialize(widget:TextView, text:Spannable):void ;

    onKeyDown(widget:TextView, text:Spannable, keyCode:number, event:KeyEvent):boolean ;

    onKeyUp(widget:TextView, text:Spannable, keyCode:number, event:KeyEvent):boolean ;

    /**
     * If the key listener wants to other kinds of key events, return true,
     * otherwise return false and the caller (i.e. the widget host)
     * will handle the key.
     */
    onKeyOther(view:TextView, text:Spannable, event:KeyEvent):boolean ;

    onTakeFocus(widget:TextView, text:Spannable, direction:number):void ;

    onTrackballEvent(widget:TextView, text:Spannable, event:MotionEvent):boolean ;

    onTouchEvent(widget:TextView, text:Spannable, event:MotionEvent):boolean ;

    onGenericMotionEvent(widget:TextView, text:Spannable, event:MotionEvent):boolean ;

    /**
     * Returns true if this movement method allows arbitrary selection
     * of any text; false if it has no selection (like a movement method
     * that only scrolls) or a constrained selection (for example
     * limited to links.  The "Select All" menu item is disabled
     * if arbitrary selection is not allowed.
     */
    canSelectArbitrarily():boolean ;
}
}
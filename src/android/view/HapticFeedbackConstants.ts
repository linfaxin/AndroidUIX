/*
 * Copyright (C) 2009 The Android Open Source Project
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

///<reference path="../../android/view/View.ts"/>

module android.view {
import View = android.view.View;
/**
 * Constants to be used to perform haptic feedback effects via
 * {@link View#performHapticFeedback(int)} 
 */
export class HapticFeedbackConstants {

    /**
     * The user has performed a long press on an object that is resulting
     * in an action being performed.
     */
    static LONG_PRESS:number = 0;

    /**
     * The user has pressed on a virtual on-screen key.
     */
    static VIRTUAL_KEY:number = 1;

    /**
     * The user has pressed a soft keyboard key.
     */
    static KEYBOARD_TAP:number = 3;

    /**
     * This is a private constant.  Feel free to renumber as desired.
     * @hide
     */
    static SAFE_MODE_DISABLED:number = 10000;

    /**
     * This is a private constant.  Feel free to renumber as desired.
     * @hide
     */
    static SAFE_MODE_ENABLED:number = 10001;

    /**
     * Flag for {@link View#performHapticFeedback(int, int)
     * View.performHapticFeedback(int, int)}: Ignore the setting in the
     * view for whether to perform haptic feedback, do it always.
     */
    static FLAG_IGNORE_VIEW_SETTING:number = 0x0001;

    /**
     * Flag for {@link View#performHapticFeedback(int, int)
     * View.performHapticFeedback(int, int)}: Ignore the global setting
     * for whether to perform haptic feedback, do it always.
     */
    static FLAG_IGNORE_GLOBAL_SETTING:number = 0x0002;
}
}
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

///<reference path="../../os/SystemClock.ts"/>

module android.view.animation{
    import SystemClock = android.os.SystemClock;
    /**
     * Defines common utilities for working with animations.
     *
     */
    export class AnimationUtils{
        /**
         * Returns the current animation time in milliseconds. This time should be used when invoking
         * {@link Animation#setStartTime(long)}. Refer to {@link android.os.SystemClock} for more
         * information about the different available clocks. The clock used by this method is
         * <em>not</em> the "wall" clock (it is not {@link System#currentTimeMillis}).
         *
         * @return the current animation time in milliseconds
         *
         * @see android.os.SystemClock
         */
        static currentAnimationTimeMillis():number {
            return SystemClock.uptimeMillis();
        }
    }
}
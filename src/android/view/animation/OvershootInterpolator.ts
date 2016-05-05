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

///<reference path="Interpolator.ts"/>

module android.view.animation {
    /**
     * An interpolator where the change flings forward and overshoots the last value
     * then comes back.
     */
    export class OvershootInterpolator implements Interpolator {
        private mTension:number;

        /**
         * @param tension Amount of overshoot. When tension equals 0.0f, there is
         *                no overshoot and the interpolator becomes a simple
         *                deceleration interpolator.
         */
        constructor(tension = 2) {
            this.mTension = tension;
        }

        getInterpolation(t:number):number {
            // _o(t) = t * t * ((tension + 1) * t + tension)
            // o(t) = _o(t - 1) + 1
            t -= 1.0;
            return t * t * ((this.mTension + 1) * t + this.mTension) + 1.0;
        }
    }
}
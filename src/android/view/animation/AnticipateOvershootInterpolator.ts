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

module android.view.animation{
    /**
     * An interpolator where the change starts backward then flings forward and overshoots
     * the target value and finally goes back to the final value.
     */
    export class AnticipateOvershootInterpolator implements Interpolator{
        private mTension:number;
        /**
         * @param tension Amount of anticipation/overshoot. When tension equals 0.0f,
         *                there is no anticipation/overshoot and the interpolator becomes
         *                a simple acceleration/deceleration interpolator.
         * @param extraTension Amount by which to multiply the tension. For instance,
         *                     to get the same overshoot as an OvershootInterpolator with
         *                     a tension of 2.0f, you would use an extraTension of 1.5f.
         */
        constructor(tension=2, extraTension=1.5) {
            this.mTension = tension * extraTension;
        }

        private static a(t:number, s:number):number{
            return t * t * ((s + 1) * t - s);
        }
        private static o(t:number, s:number):number{
            return t * t * ((s + 1) * t + s);
        }


        getInterpolation(t:number):number {
            // a(t, s) = t * t * ((s + 1) * t - s)
            // o(t, s) = t * t * ((s + 1) * t + s)
            // f(t) = 0.5 * a(t * 2, tension * extraTension), when t < 0.5
            // f(t) = 0.5 * (o(t * 2 - 2, tension * extraTension) + 2), when t <= 1.0
            if (t < 0.5) return 0.5 * AnticipateOvershootInterpolator.a(t * 2.0, this.mTension);
            else return 0.5 * (AnticipateOvershootInterpolator.o(t * 2.0 - 2.0, this.mTension) + 2.0);
        }
    }
}
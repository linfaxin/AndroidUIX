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

///<reference path="Interpolator.ts"/>

module android.view.animation {
    /**
     * An interpolator where the rate of change starts out slowly and
     * and then accelerates.
     *
     */
    export class AccelerateInterpolator implements Interpolator {
        private mFactor:number;
        private mDoubleFactor:number;

        /**
         * Constructor
         *
         * @param factor Degree to which the animation should be eased. Seting
         *        factor to 1.0f produces a y=x^2 parabola. Increasing factor above
         *        1.0f  exaggerates the ease-in effect (i.e., it starts even
         *        slower and ends evens faster)
         */
        constructor(factor = 1) {
            this.mFactor = factor;
            this.mDoubleFactor = factor * 2;
        }

        getInterpolation(input:number):number {

            if (this.mFactor == 1.0) {
                return input * input;
            } else {
                return Math.pow(input, this.mDoubleFactor);
            }
        }
    }
}
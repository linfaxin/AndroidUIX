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
     * An interpolator where the change bounces at the end.
     */
    export class BounceInterpolator implements Interpolator {
        private static bounce(t:number):number {
            return t * t * 8.0;
        }

        getInterpolation(t:number):number {
            // _b(t) = t * t * 8
            // bs(t) = _b(t) for t < 0.3535
            // bs(t) = _b(t - 0.54719) + 0.7 for t < 0.7408
            // bs(t) = _b(t - 0.8526) + 0.9 for t < 0.9644
            // bs(t) = _b(t - 1.0435) + 0.95 for t <= 1.0
            // b(t) = bs(t * 1.1226)
            t *= 1.1226;
            if (t < 0.3535) return BounceInterpolator.bounce(t);
            else if (t < 0.7408) return BounceInterpolator.bounce(t - 0.54719) + 0.7;
            else if (t < 0.9644) return BounceInterpolator.bounce(t - 0.8526) + 0.9;
            else return BounceInterpolator.bounce(t - 1.0435) + 0.95;
        }

    }
}
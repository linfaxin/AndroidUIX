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

module android.database{
    export class DataSetObserver {
        /**
         * This method is called when the entire data set has changed,
         * most likely through a call to {@link Cursor#requery()} on a {@link Cursor}.
         */
        onChanged():void {
            // Do nothing
        }

        /**
         * This method is called when the entire data becomes invalid,
         * most likely through a call to {@link Cursor#deactivate()} or {@link Cursor#close()} on a
         * {@link Cursor}.
         */
        onInvalidated():void {
            // Do nothing
        }
    }
}
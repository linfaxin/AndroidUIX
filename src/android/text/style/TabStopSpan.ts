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

///<reference path="../../../android/text/style/ParagraphStyle.ts"/>

module android.text.style {
    import ParagraphStyle = android.text.style.ParagraphStyle;
    /**
     * Represents a single tab stop on a line.
     */
    export interface TabStopSpan extends ParagraphStyle {

        /**
         * Returns the offset of the tab stop from the leading margin of the
         * line.
         * @return the offset
         */
        getTabStop():number ;


    }

    export module TabStopSpan {
        export var type = Symbol();
        export function isImpl(obj):boolean{
            return obj && obj['getTabStop'];
        }

        /**
         * The default implementation of TabStopSpan.
         */
        export class Standard implements TabStopSpan {

            /**
             * Constructor.
             *
             * @param where the offset of the tab stop from the leading margin of
             *        the line
             */
            constructor(where:number) {
                this.mTab = where;
            }

            getTabStop():number {
                return this.mTab;
            }

            private mTab:number = 0;
        }
    }

}
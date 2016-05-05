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


///<reference path="../graphics/Paint.ts"/>

module android.text{

    /**
     * TextPaint is an extension of Paint that leaves room for some extra
     * data used during text measuring and drawing.
     */
    export class TextPaint extends android.graphics.Paint{
        baselineShift = 0;
        // Special value 0 means no background paint
        bgColor = 0;
        linkColor:number = 0;

        /**
         * Special value 0 means no custom underline
         * @hide
         */
        underlineColor = 0;
        /**
         * Defined as a multiplier of the default underline thickness. Use 1.0f for default thickness.
         * @hide
         */
        underlineThickness:number = 0;


        /**
         * Copy the fields from tp into this TextPaint, including the
         * fields inherited from Paint.
         */
        set(tp:TextPaint):void  {
            super.set(tp);
            this.bgColor = tp.bgColor;
            this.baselineShift = tp.baselineShift;
            this.linkColor = tp.linkColor;
            //this.drawableState = tp.drawableState;
            //this.density = tp.density;
            this.underlineColor = tp.underlineColor;
            this.underlineThickness = tp.underlineThickness;
        }

        /**
         * Defines a custom underline for this Paint.
         * @param color underline solid color
         * @param thickness underline thickness
         * @hide
         */
        setUnderlineText(color:number, thickness:number):void  {
            this.underlineColor = color;
            this.underlineThickness = thickness;
        }
    }
}
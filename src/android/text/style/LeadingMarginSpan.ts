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

///<reference path="../../../android/graphics/Paint.ts"/>
///<reference path="../../../android/graphics/Canvas.ts"/>
///<reference path="../../../android/text/Layout.ts"/>
///<reference path="../../../android/text/TextUtils.ts"/>
///<reference path="../../../android/text/style/ParagraphStyle.ts"/>
///<reference path="../../../android/text/style/WrapTogetherSpan.ts"/>

module android.text.style {
    import Paint = android.graphics.Paint;
    import Canvas = android.graphics.Canvas;
    import Layout = android.text.Layout;
    import TextUtils = android.text.TextUtils;
    import ParagraphStyle = android.text.style.ParagraphStyle;
    import WrapTogetherSpan = android.text.style.WrapTogetherSpan;
    /**
     * A paragraph style affecting the leading margin. There can be multiple leading
     * margin spans on a single paragraph; they will be rendered in order, each
     * adding its margin to the ones before it. The leading margin is on the right
     * for lines in a right-to-left paragraph.
     */
    export interface LeadingMarginSpan extends ParagraphStyle {

        /**
         * Returns the amount by which to adjust the leading margin. Positive values
         * move away from the leading edge of the paragraph, negative values move
         * towards it.
         *
         * @param first true if the request is for the first line of a paragraph,
         * false for subsequent lines
         * @return the offset for the margin.
         */
        getLeadingMargin(first:boolean):number ;

        /**
         * Renders the leading margin.  This is called before the margin has been
         * adjusted by the value returned by {@link #getLeadingMargin(boolean)}.
         *
         * @param c the canvas
         * @param p the paint. The this should be left unchanged on exit.
         * @param x the current position of the margin
         * @param dir the base direction of the paragraph; if negative, the margin
         * is to the right of the text, otherwise it is to the left.
         * @param top the top of the line
         * @param baseline the baseline of the line
         * @param bottom the bottom of the line
         * @param text the text
         * @param start the start of the line
         * @param end the end of the line
         * @param first true if this is the first line of its paragraph
         * @param layout the layout containing this line
         */
        drawLeadingMargin(c:Canvas, p:Paint, x:number, dir:number, top:number, baseline:number, bottom:number, text:String, start:number, end:number, first:boolean, layout:Layout):void ;

    }

    export module LeadingMarginSpan{
        export function isImpl(obj):boolean {
            return obj && obj['getLeadingMargin'] && obj['drawLeadingMargin'];
        }
        export var type = Symbol();

        /**
         * An extended version of {@link LeadingMarginSpan}, which allows
         * the implementor to specify the number of lines of text to which
         * this object is attached that the "first line of paragraph" margin
         * width will be applied to.
         */
        export interface LeadingMarginSpan2 extends LeadingMarginSpan, WrapTogetherSpan {

            /**
             * Returns the number of lines of text to which this object is
             * attached that the "first line" margin will apply to.
             * Note that if this returns N, the first N lines of the region,
             * not the first N lines of each paragraph, will be given the
             * special margin width.
             */
            getLeadingMarginLineCount():number ;
        }
        export module LeadingMarginSpan2{
            export function isImpl(obj):boolean {
                return obj['getLeadingMarginLineCount'];
            }
        }

        /**
         * The standard implementation of LeadingMarginSpan, which adjusts the
         * margin but does not do any rendering.
         */
        export class Standard implements LeadingMarginSpan {

            private mFirst:number = 0;
            private mRest:number = 0;

            /**
             * Constructor taking separate indents for the first and subsequent
             * lines.
             *
             * @param first the indent for the first line of the paragraph
             * @param rest the indent for the remaining lines of the paragraph
             */
            constructor( first:number, rest=first) {
                this.mFirst = first;
                this.mRest = rest;
            }

            getSpanTypeId():number  {
                return TextUtils.LEADING_MARGIN_SPAN;
            }

            describeContents():number  {
                return 0;
            }

            getLeadingMargin(first:boolean):number  {
                return first ? this.mFirst : this.mRest;
            }

            drawLeadingMargin(c:Canvas, p:Paint, x:number, dir:number, top:number, baseline:number, bottom:number, text:String, start:number, end:number, first:boolean, layout:Layout):void  {
                ;
            }
        }
    }

}
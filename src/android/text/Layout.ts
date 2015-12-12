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

///<reference path="../../android/graphics/Canvas.ts"/>
///<reference path="../../android/graphics/Paint.ts"/>
///<reference path="../../android/graphics/Rect.ts"/>
///<reference path="../../android/graphics/Path.ts"/>
///<reference path="../../android/text/style/LeadingMarginSpan.ts"/>
///<reference path="../../android/text/style/LineBackgroundSpan.ts"/>
///<reference path="../../android/text/style/ParagraphStyle.ts"/>
///<reference path="../../android/text/style/ReplacementSpan.ts"/>
///<reference path="../../android/text/style/TabStopSpan.ts"/>
///<reference path="../../java/util/Arrays.ts"/>
///<reference path="../../java/lang/Float.ts"/>
///<reference path="../../java/lang/System.ts"/>
///<reference path="../../java/lang/StringBuilder.ts"/>
///<reference path="../../android/text/MeasuredText.ts"/>
///<reference path="../../android/text/Spanned.ts"/>
///<reference path="../../android/text/SpanSet.ts"/>
///<reference path="../../android/text/TextDirectionHeuristic.ts"/>
///<reference path="../../android/text/TextDirectionHeuristics.ts"/>
///<reference path="../../android/text/TextLine.ts"/>
///<reference path="../../android/text/TextPaint.ts"/>
///<reference path="../../android/text/TextUtils.ts"/>
///<reference path="../../android/text/TextWatcher.ts"/>

module android.text {
import Canvas = android.graphics.Canvas;
import Paint = android.graphics.Paint;
import Rect = android.graphics.Rect;
import Path = android.graphics.Path;
import LeadingMarginSpan = android.text.style.LeadingMarginSpan;
import LeadingMarginSpan2 = android.text.style.LeadingMarginSpan.LeadingMarginSpan2;
import LineBackgroundSpan = android.text.style.LineBackgroundSpan;
import ParagraphStyle = android.text.style.ParagraphStyle;
import ReplacementSpan = android.text.style.ReplacementSpan;
import TabStopSpan = android.text.style.TabStopSpan;
import Arrays = java.util.Arrays;
import Float = java.lang.Float;
import System = java.lang.System;
import StringBuilder = java.lang.StringBuilder;
import MeasuredText = android.text.MeasuredText;
import Spanned = android.text.Spanned;
import SpanSet = android.text.SpanSet;
import TextDirectionHeuristic = android.text.TextDirectionHeuristic;
import TextDirectionHeuristics = android.text.TextDirectionHeuristics;
import TextLine = android.text.TextLine;
import TextPaint = android.text.TextPaint;
import TextUtils = android.text.TextUtils;
import TextWatcher = android.text.TextWatcher;
    window.addEventListener('AndroidUILoadFinish', ()=>{
        eval('TextUtils = android.text.TextUtils;');//real import now
    });

/**
 * A base class that manages text layout in visual elements on
 * the screen.
 * <p>For text that will be edited, use a {@link DynamicLayout},
 * which will be updated as the text changes.
 * For text that will not change, use a {@link StaticLayout}.
 */
export abstract

class Layout {

    private static NO_PARA_SPANS:ParagraphStyle[] = [];


    /**
     * Return how wide a layout must be in order to display the
     * specified text with one line per paragraph.
     */
    static getDesiredWidth(source:String, paint:TextPaint):number;
    static getDesiredWidth(source:String, start:number, end:number, paint:TextPaint):number;
    static getDesiredWidth(...args){
        if(args.length==2) return (<any>Layout).getDesiredWidth_2(...args);
        if(args.length==4) return (<any>Layout).getDesiredWidth_4(...args);
    }
    private static getDesiredWidth_2(source:String, paint:TextPaint):number  {
        return Layout.getDesiredWidth(source, 0, source.length, paint);
    }

    /**
     * Return how wide a layout must be in order to display the
     * specified text slice with one line per paragraph.
     */
    private static getDesiredWidth_4(source:String, start:number, end:number, paint:TextPaint):number  {
        let need:number = 0;
        let next:number;
        for (let i:number = start; i <= end; i = next) {
            next = source.substring(0, end).indexOf('\n', i);//TextUtils.indexOf(source, '\n', i, end);
            if (next < 0) next = end;
            // note, omits trailing paragraph char
            let w:number = Layout.measurePara(paint, source, i, next);
            if (w > need)
                need = w;
            next++;
        }
        return need;
    }

    /**
     * Subclasses of Layout use this constructor to set the display text,
     * width, and other standard properties.
     * @param text the text to render
     * @param paint the default paint for the layout.  Styles can override
     * various attributes of the paint.
     * @param width the wrapping width for the text.
     * @param align whether to left, right, or center the text.  Styles can
     * override the alignment.
     * @param textDir default FIRSTSTRONG_LTR
     * @param spacingMult factor by which to scale the font size to get the
     * default line spacing
     * @param spacingAdd amount to add to the default line spacing
     *
     * @hide
     */
    constructor(text:String, paint:TextPaint, width:number, align:Layout.Alignment,
                textDir:TextDirectionHeuristic = TextDirectionHeuristics.FIRSTSTRONG_LTR,
                spacingMult:number = 1, spacingAdd:number = 0) {
        if (width < 0)
            throw Error(`new IllegalArgumentException("Layout: " + width + " < 0")`);
        // baselineShift and bgColor.  We probably should reevaluate bgColor.
        if (paint != null) {
            paint.bgColor = 0;
            paint.baselineShift = 0;
        }
        this.mText = text;
        this.mPaint = paint;
        this.mWorkPaint = new TextPaint();
        this.mWidth = width;
        this.mAlignment = align;
        this.mSpacingMult = spacingMult;
        this.mSpacingAdd = spacingAdd;
        this.mSpannedText = Spanned.isImplements(text);
        this.mTextDir = textDir;
    }

    /**
     * Replace constructor properties of this Layout with new ones.  Be careful.
     */
    /* package */
    replaceWith(text:String, paint:TextPaint, width:number, align:Layout.Alignment, spacingmult:number, spacingadd:number):void  {
        if (width < 0) {
            throw Error(`new IllegalArgumentException("Layout: " + width + " < 0")`);
        }
        this.mText = text;
        this.mPaint = paint;
        this.mWidth = width;
        this.mAlignment = align;
        this.mSpacingMult = spacingmult;
        this.mSpacingAdd = spacingadd;
        this.mSpannedText = Spanned.isImplements(text);
    }


    /**
     * Draw this Layout on the specified canvas, with the highlight path drawn
     * between the background and the text.
     *
     * @param canvas the canvas
     * @param highlight the path of the highlight or cursor; can be null
     * @param highlightPaint the paint for the highlight
     * @param cursorOffsetVertical the amount to temporarily translate the
     *        canvas while rendering the highlight
     */
    draw(canvas:Canvas, highlight:Path=null, highlightPaint:Paint=null, cursorOffsetVertical:number=0):void  {
        const lineRange:number[] = this.getLineRangeForDraw(canvas);
        let firstLine:number = TextUtils.unpackRangeStartFromLong(lineRange);
        let lastLine:number = TextUtils.unpackRangeEndFromLong(lineRange);
        if (lastLine < 0)
            return;
        this.drawBackground(canvas, highlight, highlightPaint, cursorOffsetVertical, firstLine, lastLine);
        this.drawText(canvas, firstLine, lastLine);
    }

    /**
     * @hide
     */
    drawText(canvas:Canvas, firstLine:number, lastLine:number):void  {
        let previousLineBottom:number = this.getLineTop(firstLine);
        let previousLineEnd:number = this.getLineStart(firstLine);
        let spans:ParagraphStyle[] = Layout.NO_PARA_SPANS;
        let spanEnd:number = 0;
        let paint:TextPaint = this.mPaint;
        let buf:String = this.mText;
        let paraAlign:Layout.Alignment = this.mAlignment;
        let tabStops:Layout.TabStops = null;
        let tabStopsIsInitialized:boolean = false;
        let tl:TextLine = TextLine.obtain();
        // The baseline is the top of the following line minus the current line's descent.
        for (let i:number = firstLine; i <= lastLine; i++) {
            let start:number = previousLineEnd;
            previousLineEnd = this.getLineStart(i + 1);
            let end:number = this.getLineVisibleEnd(i, start, previousLineEnd);
            let ltop:number = previousLineBottom;
            let lbottom:number = this.getLineTop(i + 1);
            previousLineBottom = lbottom;
            let lbaseline:number = lbottom - this.getLineDescent(i);
            let dir:number = this.getParagraphDirection(i);
            let left:number = 0;
            let right:number = this.mWidth;
            if (this.mSpannedText) {
                let sp:Spanned = <Spanned> buf;
                let textLength:number = buf.length;
                let isFirstParaLine:boolean = (start == 0 || buf.charAt(start - 1) == '\n');
                // our problem.
                if (start >= spanEnd && (i == firstLine || isFirstParaLine)) {
                    spanEnd = sp.nextSpanTransition(start, textLength, ParagraphStyle.type);
                    spans = Layout.getParagraphSpans(sp, start, spanEnd, ParagraphStyle.type);
                    paraAlign = this.mAlignment;
                    //for (let n:number = spans.length - 1; n >= 0; n--) {
                    //    if (spans[n] instanceof AlignmentSpan) {
                    //        paraAlign = (<AlignmentSpan> spans[n]).getAlignment();
                    //        break;
                    //    }
                    //}
                    tabStopsIsInitialized = false;
                }
                // Draw all leading margin spans.  Adjust left or right according
                // to the paragraph direction of the line.
                const length:number = spans.length;
                for (let n:number = 0; n < length; n++) {
                    if (LeadingMarginSpan.isImpl(spans[n])) {
                        let margin:LeadingMarginSpan = <LeadingMarginSpan> spans[n];
                        let useFirstLineMargin:boolean = isFirstParaLine;
                        if (LeadingMarginSpan2.isImpl(margin)) {
                            let count:number = (<LeadingMarginSpan2> margin).getLeadingMarginLineCount();
                            let startLine:number = this.getLineForOffset(sp.getSpanStart(margin));
                            useFirstLineMargin = i < startLine + count;
                        }
                        if (dir == Layout.DIR_RIGHT_TO_LEFT) {
                            margin.drawLeadingMargin(canvas, paint, right, dir, ltop, lbaseline, lbottom, buf, start, end, isFirstParaLine, this);
                            right -= margin.getLeadingMargin(useFirstLineMargin);
                        } else {
                            margin.drawLeadingMargin(canvas, paint, left, dir, ltop, lbaseline, lbottom, buf, start, end, isFirstParaLine, this);
                            left += margin.getLeadingMargin(useFirstLineMargin);
                        }
                    }
                }
            }
            let hasTabOrEmoji:boolean = this.getLineContainsTab(i);
            // Can't tell if we have tabs for sure, currently
            if (hasTabOrEmoji && !tabStopsIsInitialized) {
                if (tabStops == null) {
                    tabStops = new Layout.TabStops(Layout.TAB_INCREMENT, spans);
                } else {
                    tabStops.reset(Layout.TAB_INCREMENT, spans);
                }
                tabStopsIsInitialized = true;
            }
            // Determine whether the line aligns to normal, opposite, or center.
            let align:Layout.Alignment = paraAlign;
            if (align == Layout.Alignment.ALIGN_LEFT) {
                align = (dir == Layout.DIR_LEFT_TO_RIGHT) ? Layout.Alignment.ALIGN_NORMAL : Layout.Alignment.ALIGN_OPPOSITE;
            } else if (align == Layout.Alignment.ALIGN_RIGHT) {
                align = (dir == Layout.DIR_LEFT_TO_RIGHT) ? Layout.Alignment.ALIGN_OPPOSITE : Layout.Alignment.ALIGN_NORMAL;
            }
            let x:number;
            if (align == Layout.Alignment.ALIGN_NORMAL) {
                if (dir == Layout.DIR_LEFT_TO_RIGHT) {
                    x = left;
                } else {
                    x = right;
                }
            } else {
                let max:number = Math.floor(this.getLineExtent(i, tabStops, false));
                if (align == Layout.Alignment.ALIGN_OPPOSITE) {
                    if (dir == Layout.DIR_LEFT_TO_RIGHT) {
                        x = right - max;
                    } else {
                        x = left - max;
                    }
                } else {
                    // Layout.Alignment.ALIGN_CENTER
                    max = max & ~1;
                    x = (right + left - max) >> 1;
                }
            }
            let directions:Layout.Directions = this.getLineDirections(i);
            if (directions == Layout.DIRS_ALL_LEFT_TO_RIGHT && !this.mSpannedText && !hasTabOrEmoji) {
                // XXX: assumes there's nothing additional to be done
                canvas.drawText_end(buf.toString(), start, end, x, lbaseline, paint);
            } else {
                tl.set(paint, buf, start, end, dir, directions, hasTabOrEmoji, tabStops);
                tl.draw(canvas, x, ltop, lbaseline, lbottom);
            }
        }
        TextLine.recycle(tl);
    }

    /**
     * @hide
     */
    drawBackground(canvas:Canvas, highlight:Path, highlightPaint:Paint, cursorOffsetVertical:number, firstLine:number, lastLine:number):void  {
        // They are evaluated at each line.
        if (this.mSpannedText) {
            if (this.mLineBackgroundSpans == null) {
                this.mLineBackgroundSpans = new SpanSet<LineBackgroundSpan>(LineBackgroundSpan.type);
            }
            let buffer:Spanned = <Spanned> this.mText;
            let textLength:number = buffer.length;
            this.mLineBackgroundSpans.init(buffer, 0, textLength);
            if (this.mLineBackgroundSpans.numberOfSpans > 0) {
                let previousLineBottom:number = this.getLineTop(firstLine);
                let previousLineEnd:number = this.getLineStart(firstLine);
                let spans:ParagraphStyle[] = Layout.NO_PARA_SPANS;
                let spansLength:number = 0;
                let paint:TextPaint = this.mPaint;
                let spanEnd:number = 0;
                const width:number = this.mWidth;
                for (let i:number = firstLine; i <= lastLine; i++) {
                    let start:number = previousLineEnd;
                    let end:number = this.getLineStart(i + 1);
                    previousLineEnd = end;
                    let ltop:number = previousLineBottom;
                    let lbottom:number = this.getLineTop(i + 1);
                    previousLineBottom = lbottom;
                    let lbaseline:number = lbottom - this.getLineDescent(i);
                    if (start >= spanEnd) {
                        // These should be infrequent, so we'll use this so that
                        // we don't have to check as often.
                        spanEnd = this.mLineBackgroundSpans.getNextTransition(start, textLength);
                        // All LineBackgroundSpans on a line contribute to its background.
                        spansLength = 0;
                        // Duplication of the logic of getParagraphSpans
                        if (start != end || start == 0) {
                            // array instead to reduce memory allocation
                            for (let j:number = 0; j < this.mLineBackgroundSpans.numberOfSpans; j++) {
                                // construction
                                if (this.mLineBackgroundSpans.spanStarts[j] >= end || this.mLineBackgroundSpans.spanEnds[j] <= start)
                                    continue;
                                if (spansLength == spans.length) {
                                    // The spans array needs to be expanded
                                    let newSize:number = (2 * spansLength);
                                    let newSpans:ParagraphStyle[] = new Array<ParagraphStyle>(newSize);
                                    System.arraycopy(spans, 0, newSpans, 0, spansLength);
                                    spans = newSpans;
                                }
                                spans[spansLength++] = this.mLineBackgroundSpans.spans[j];
                            }
                        }
                    }
                    for (let n:number = 0; n < spansLength; n++) {
                        let lineBackgroundSpan:LineBackgroundSpan = <LineBackgroundSpan> spans[n];
                        lineBackgroundSpan.drawBackground(canvas, paint, 0, width, ltop, lbaseline, lbottom, buffer, start, end, i);
                    }
                }
            }
            this.mLineBackgroundSpans.recycle();
        }
        // a non-spanned transformation of a spanned editing buffer.
        if (highlight != null) {
            if (cursorOffsetVertical != 0)
                canvas.translate(0, cursorOffsetVertical);
            canvas.drawPath(highlight, highlightPaint);
            if (cursorOffsetVertical != 0)
                canvas.translate(0, -cursorOffsetVertical);
        }
    }

    /**
     * @param canvas
     * @return The range of lines that need to be drawn, possibly empty.
     * @hide
     */
    getLineRangeForDraw(canvas:Canvas):number[]  {
        let dtop:number, dbottom:number;
        {
            if (!canvas.getClipBounds(Layout.sTempRect)) {
                // Negative range end used as a special flag
                return TextUtils.packRangeInLong(0, -1);
            }
            dtop = Layout.sTempRect.top;
            dbottom = Layout.sTempRect.bottom;
        }
        const top:number = Math.max(dtop, 0);
        const bottom:number = Math.min(this.getLineTop(this.getLineCount()), dbottom);
        if (top >= bottom)
            return TextUtils.packRangeInLong(0, -1);
        return TextUtils.packRangeInLong(this.getLineForVertical(top), this.getLineForVertical(bottom));
    }

    /**
     * Return the start position of the line, given the left and right bounds
     * of the margins.
     *
     * @param line the line index
     * @param left the left bounds (0, or leading margin if ltr para)
     * @param right the right bounds (width, minus leading margin if rtl para)
     * @return the start position of the line (to right of line if rtl para)
     */
    private getLineStartPos(line:number, left:number, right:number):number  {
        // Adjust the point at which to start rendering depending on the
        // alignment of the paragraph.
        let align:Layout.Alignment = this.getParagraphAlignment(line);
        let dir:number = this.getParagraphDirection(line);
        if (align == Layout.Alignment.ALIGN_LEFT) {
            align = (dir == Layout.DIR_LEFT_TO_RIGHT) ? Layout.Alignment.ALIGN_NORMAL : Layout.Alignment.ALIGN_OPPOSITE;
        } else if (align == Layout.Alignment.ALIGN_RIGHT) {
            align = (dir == Layout.DIR_LEFT_TO_RIGHT) ? Layout.Alignment.ALIGN_OPPOSITE : Layout.Alignment.ALIGN_NORMAL;
        }
        let x:number;
        if (align == Layout.Alignment.ALIGN_NORMAL) {
            if (dir == Layout.DIR_LEFT_TO_RIGHT) {
                x = left;
            } else {
                x = right;
            }
        } else {
            let tabStops:Layout.TabStops = null;
            if (this.mSpannedText && this.getLineContainsTab(line)) {
                let spanned:Spanned = <Spanned> this.mText;
                let start:number = this.getLineStart(line);
                let spanEnd:number = spanned.nextSpanTransition(start, spanned.length, TabStopSpan.type);
                let tabSpans:TabStopSpan[] = Layout.getParagraphSpans<TabStopSpan>(spanned, start, spanEnd, TabStopSpan.type);
                if (tabSpans.length > 0) {
                    tabStops = new Layout.TabStops(Layout.TAB_INCREMENT, tabSpans);
                }
            }
            let max:number = Math.floor(this.getLineExtent(line, tabStops, false));
            if (align == Layout.Alignment.ALIGN_OPPOSITE) {
                if (dir == Layout.DIR_LEFT_TO_RIGHT) {
                    x = right - max;
                } else {
                    // max is negative here
                    x = left - max;
                }
            } else {
                // Layout.Alignment.ALIGN_CENTER
                max = max & ~1;
                x = (left + right - max) >> 1;
            }
        }
        return x;
    }

    /**
     * Return the text that is displayed by this Layout.
     */
    getText():String  {
        return this.mText;
    }

    /**
     * Return the base Paint properties for this layout.
     * Do NOT change the paint, which may result in funny
     * drawing for this layout.
     */
    getPaint():TextPaint  {
        return this.mPaint;
    }

    /**
     * Return the width of this layout.
     */
    getWidth():number  {
        return this.mWidth;
    }

    /**
     * Return the width to which this Layout is ellipsizing, or
     * {@link #getWidth} if it is not doing anything special.
     */
    getEllipsizedWidth():number  {
        return this.mWidth;
    }

    /**
     * Increase the width of this layout to the specified width.
     * Be careful to use this only when you know it is appropriate&mdash;
     * it does not cause the text to reflow to use the full new width.
     */
    increaseWidthTo(wid:number):void  {
        if (wid < this.mWidth) {
            throw Error(`new RuntimeException("attempted to reduce Layout width")`);
        }
        this.mWidth = wid;
    }

    /**
     * Return the total height of this layout.
     */
    getHeight():number  {
        return this.getLineTop(this.getLineCount());
    }

    /**
     * Return the base alignment of this layout.
     */
    getAlignment():Layout.Alignment  {
        return this.mAlignment;
    }

    /**
     * Return what the text height is multiplied by to get the line height.
     */
    getSpacingMultiplier():number  {
        return this.mSpacingMult;
    }

    /**
     * Return the number of units of leading that are added to each line.
     */
    getSpacingAdd():number  {
        return this.mSpacingAdd;
    }

    /**
     * Return the heuristic used to determine paragraph text direction.
     * @hide
     */
    getTextDirectionHeuristic():TextDirectionHeuristic  {
        return this.mTextDir;
    }

    /**
     * Return the number of lines of text in this layout.
     */
    abstract 
getLineCount():number ;

    /**
     * Return the baseline for the specified line (0&hellip;getLineCount() - 1)
     * If bounds is not null, return the top, left, right, bottom extents
     * of the specified line in it.
     * @param line which line to examine (0..getLineCount() - 1)
     * @param bounds Optional. If not null, it returns the extent of the line
     * @return the Y-coordinate of the baseline
     */
    getLineBounds(line:number, bounds:Rect):number  {
        if (bounds != null) {
            // ???
            bounds.left = 0;
            bounds.top = this.getLineTop(line);
            // ???
            bounds.right = this.mWidth;
            bounds.bottom = this.getLineTop(line + 1);
        }
        return this.getLineBaseline(line);
    }

    /**
     * Return the vertical position of the top of the specified line
     * (0&hellip;getLineCount()).
     * If the specified line is equal to the line count, returns the
     * bottom of the last line.
     */
    abstract 
getLineTop(line:number):number ;

    /**
     * Return the descent of the specified line(0&hellip;getLineCount() - 1).
     */
    abstract 
getLineDescent(line:number):number ;

    /**
     * Return the text offset of the beginning of the specified line (
     * 0&hellip;getLineCount()). If the specified line is equal to the line
     * count, returns the length of the text.
     */
    abstract 
getLineStart(line:number):number ;

    /**
     * Returns the primary directionality of the paragraph containing the
     * specified line, either 1 for left-to-right lines, or -1 for right-to-left
     * lines (see {@link #DIR_LEFT_TO_RIGHT}, {@link #DIR_RIGHT_TO_LEFT}).
     */
    abstract 
getParagraphDirection(line:number):number ;

    /**
     * Returns whether the specified line contains one or more
     * characters that need to be handled specially, like tabs
     * or emoji.
     */
    abstract 
getLineContainsTab(line:number):boolean ;

    /**
     * Returns the directional run information for the specified line.
     * The array alternates counts of characters in left-to-right
     * and right-to-left segments of the line.
     *
     * <p>NOTE: this is inadequate to support bidirectional text, and will change.
     */
    abstract 
getLineDirections(line:number):Layout.Directions ;

    /**
     * Returns the (negative) number of extra pixels of ascent padding in the
     * top line of the Layout.
     */
    abstract 
getTopPadding():number ;

    /**
     * Returns the number of extra pixels of descent padding in the
     * bottom line of the Layout.
     */
    abstract 
getBottomPadding():number ;

    /**
     * Returns true if the character at offset and the preceding character
     * are at different run levels (and thus there's a split caret).
     * @param offset the offset
     * @return true if at a level boundary
     * @hide
     */
    isLevelBoundary(offset:number):boolean  {
        let line:number = this.getLineForOffset(offset);
        let dirs:Layout.Directions = this.getLineDirections(line);
        if (dirs == Layout.DIRS_ALL_LEFT_TO_RIGHT || dirs == Layout.DIRS_ALL_RIGHT_TO_LEFT) {
            return false;
        }
        let runs:number[] = dirs.mDirections;
        let lineStart:number = this.getLineStart(line);
        let lineEnd:number = this.getLineEnd(line);
        if (offset == lineStart || offset == lineEnd) {
            let paraLevel:number = this.getParagraphDirection(line) == 1 ? 0 : 1;
            let runIndex:number = offset == lineStart ? 0 : runs.length - 2;
            return ((runs[runIndex + 1] >>> Layout.RUN_LEVEL_SHIFT) & Layout.RUN_LEVEL_MASK) != paraLevel;
        }
        offset -= lineStart;
        for (let i:number = 0; i < runs.length; i += 2) {
            if (offset == runs[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns true if the character at offset is right to left (RTL).
     * @param offset the offset
     * @return true if the character is RTL, false if it is LTR
     */
    isRtlCharAt(offset:number):boolean  {
        let line:number = this.getLineForOffset(offset);
        let dirs:Layout.Directions = this.getLineDirections(line);
        if (dirs == Layout.DIRS_ALL_LEFT_TO_RIGHT) {
            return false;
        }
        if (dirs == Layout.DIRS_ALL_RIGHT_TO_LEFT) {
            return true;
        }
        let runs:number[] = dirs.mDirections;
        let lineStart:number = this.getLineStart(line);
        for (let i:number = 0; i < runs.length; i += 2) {
            let start:number = lineStart + (runs[i] & Layout.RUN_LENGTH_MASK);
            // corresponding of the last run
            if (offset >= start) {
                let level:number = (runs[i + 1] >>> Layout.RUN_LEVEL_SHIFT) & Layout.RUN_LEVEL_MASK;
                return ((level & 1) != 0);
            }
        }
        // Should happen only if the offset is "out of bounds"
        return false;
    }

    private primaryIsTrailingPrevious(offset:number):boolean  {
        let line:number = this.getLineForOffset(offset);
        let lineStart:number = this.getLineStart(line);
        let lineEnd:number = this.getLineEnd(line);
        let runs:number[] = this.getLineDirections(line).mDirections;
        let levelAt:number = -1;
        for (let i:number = 0; i < runs.length; i += 2) {
            let start:number = lineStart + runs[i];
            let limit:number = start + (runs[i + 1] & Layout.RUN_LENGTH_MASK);
            if (limit > lineEnd) {
                limit = lineEnd;
            }
            if (offset >= start && offset < limit) {
                if (offset > start) {
                    // Previous character is at same level, so don't use trailing.
                    return false;
                }
                levelAt = (runs[i + 1] >>> Layout.RUN_LEVEL_SHIFT) & Layout.RUN_LEVEL_MASK;
                break;
            }
        }
        if (levelAt == -1) {
            // Offset was limit of line.
            levelAt = this.getParagraphDirection(line) == 1 ? 0 : 1;
        }
        // At level boundary, check previous level.
        let levelBefore:number = -1;
        if (offset == lineStart) {
            levelBefore = this.getParagraphDirection(line) == 1 ? 0 : 1;
        } else {
            offset -= 1;
            for (let i:number = 0; i < runs.length; i += 2) {
                let start:number = lineStart + runs[i];
                let limit:number = start + (runs[i + 1] & Layout.RUN_LENGTH_MASK);
                if (limit > lineEnd) {
                    limit = lineEnd;
                }
                if (offset >= start && offset < limit) {
                    levelBefore = (runs[i + 1] >>> Layout.RUN_LEVEL_SHIFT) & Layout.RUN_LEVEL_MASK;
                    break;
                }
            }
        }
        return levelBefore < levelAt;
    }

    /**
     * Get the primary horizontal position for the specified text offset, but
     * optionally clamp it so that it doesn't exceed the width of the layout.
     * @hide
     */
    getPrimaryHorizontal(offset:number, clamped=false):number  {
        let trailing:boolean = this.primaryIsTrailingPrevious(offset);
        return this.getHorizontal(offset, trailing, clamped);
    }

    /**
     * Get the secondary horizontal position for the specified text offset, but
     * optionally clamp it so that it doesn't exceed the width of the layout.
     * @hide
     */
    getSecondaryHorizontal(offset:number, clamped=false):number  {
        let trailing:boolean = this.primaryIsTrailingPrevious(offset);
        return this.getHorizontal(offset, !trailing, clamped);
    }

    private getHorizontal(offset:number, trailing:boolean, clamped:boolean):number  {
        let line:number = this.getLineForOffset(offset);
        return this.getHorizontal_4(offset, trailing, line, clamped);
    }

    private getHorizontal_4(offset:number, trailing:boolean, line:number, clamped:boolean):number  {
        let start:number = this.getLineStart(line);
        let end:number = this.getLineEnd(line);
        let dir:number = this.getParagraphDirection(line);
        let hasTabOrEmoji:boolean = this.getLineContainsTab(line);
        let directions:Layout.Directions = this.getLineDirections(line);
        let tabStops:Layout.TabStops = null;
        if (hasTabOrEmoji && Spanned.isImplements(this.mText)) {
            // Just checking this line should be good enough, tabs should be
            // consistent across all lines in a paragraph.
            let tabs:TabStopSpan[] = Layout.getParagraphSpans<TabStopSpan>(<Spanned> this.mText, start, end, TabStopSpan.type);
            if (tabs.length > 0) {
                // XXX should reuse
                tabStops = new Layout.TabStops(Layout.TAB_INCREMENT, tabs);
            }
        }
        let tl:TextLine = TextLine.obtain();
        tl.set(this.mPaint, this.mText, start, end, dir, directions, hasTabOrEmoji, tabStops);
        let wid:number = tl.measure(offset - start, trailing, null);
        TextLine.recycle(tl);
        if (clamped && wid > this.mWidth) {
            wid = this.mWidth;
        }
        let left:number = this.getParagraphLeft(line);
        let right:number = this.getParagraphRight(line);
        return this.getLineStartPos(line, left, right) + wid;
    }

    /**
     * Get the leftmost position that should be exposed for horizontal
     * scrolling on the specified line.
     */
    getLineLeft(line:number):number  {
        let dir:number = this.getParagraphDirection(line);
        let align:Layout.Alignment = this.getParagraphAlignment(line);
        if (align == Layout.Alignment.ALIGN_LEFT) {
            return 0;
        } else if (align == Layout.Alignment.ALIGN_NORMAL) {
            if (dir == Layout.DIR_RIGHT_TO_LEFT)
                return this.getParagraphRight(line) - this.getLineMax(line);
            else
                return 0;
        } else if (align == Layout.Alignment.ALIGN_RIGHT) {
            return this.mWidth - this.getLineMax(line);
        } else if (align == Layout.Alignment.ALIGN_OPPOSITE) {
            if (dir == Layout.DIR_RIGHT_TO_LEFT)
                return 0;
            else
                return this.mWidth - this.getLineMax(line);
        } else {
            /* align == Layout.Alignment.ALIGN_CENTER */
            let left:number = this.getParagraphLeft(line);
            let right:number = this.getParagraphRight(line);
            let max:number = (Math.floor(this.getLineMax(line))) & ~1;
            return left + ((right - left) - max) / 2;
        }
    }

    /**
     * Get the rightmost position that should be exposed for horizontal
     * scrolling on the specified line.
     */
    getLineRight(line:number):number  {
        let dir:number = this.getParagraphDirection(line);
        let align:Layout.Alignment = this.getParagraphAlignment(line);
        if (align == Layout.Alignment.ALIGN_LEFT) {
            return this.getParagraphLeft(line) + this.getLineMax(line);
        } else if (align == Layout.Alignment.ALIGN_NORMAL) {
            if (dir == Layout.DIR_RIGHT_TO_LEFT)
                return this.mWidth;
            else
                return this.getParagraphLeft(line) + this.getLineMax(line);
        } else if (align == Layout.Alignment.ALIGN_RIGHT) {
            return this.mWidth;
        } else if (align == Layout.Alignment.ALIGN_OPPOSITE) {
            if (dir == Layout.DIR_RIGHT_TO_LEFT)
                return this.getLineMax(line);
            else
                return this.mWidth;
        } else {
            /* align == Layout.Alignment.ALIGN_CENTER */
            let left:number = this.getParagraphLeft(line);
            let right:number = this.getParagraphRight(line);
            let max:number = (Math.floor(this.getLineMax(line))) & ~1;
            return right - ((right - left) - max) / 2;
        }
    }

    /**
     * Gets the unsigned horizontal extent of the specified line, including
     * leading margin indent, but excluding trailing whitespace.
     */
    getLineMax(line:number):number  {
        let margin:number = this.getParagraphLeadingMargin(line);
        let signedExtent:number = this.getLineExtent(line, false);
        return margin + signedExtent >= 0 ? signedExtent : -signedExtent;
    }

    /**
     * Gets the unsigned horizontal extent of the specified line, including
     * leading margin indent and trailing whitespace.
     */
    getLineWidth(line:number):number  {
        let margin:number = this.getParagraphLeadingMargin(line);
        let signedExtent:number = this.getLineExtent(line, true);
        return margin + signedExtent >= 0 ? signedExtent : -signedExtent;
    }

    private getLineExtent(line:number, full:boolean):number;
    private getLineExtent(line:number, tabStops:Layout.TabStops, full:boolean):number;
    private getLineExtent(...args):number{
        if(args.length===2) return (<any>this).getLineExtent_2(...args);
        if(args.length===3) return (<any>this).getLineExtent_3(...args);
    }
    /**
     * Like {@link #getLineExtent(int,TabStops,boolean)} but determines the
     * tab stops instead of using the ones passed in.
     * @param line the index of the line
     * @param full whether to include trailing whitespace
     * @return the extent of the line
     */
    private getLineExtent_2(line:number, full:boolean):number  {
        let start:number = this.getLineStart(line);
        let end:number = full ? this.getLineEnd(line) : this.getLineVisibleEnd(line);
        let hasTabsOrEmoji:boolean = this.getLineContainsTab(line);
        let tabStops:Layout.TabStops = null;
        if (hasTabsOrEmoji && Spanned.isImplements(this.mText)) {
            // Just checking this line should be good enough, tabs should be
            // consistent across all lines in a paragraph.
            let tabs:TabStopSpan[] = Layout.getParagraphSpans<TabStopSpan>(<Spanned> this.mText, start, end, TabStopSpan.type);
            if (tabs.length > 0) {
                // XXX should reuse
                tabStops = new Layout.TabStops(Layout.TAB_INCREMENT, tabs);
            }
        }
        let directions:Layout.Directions = this.getLineDirections(line);
        // Returned directions can actually be null
        if (directions == null) {
            return 0;
        }
        let dir:number = this.getParagraphDirection(line);
        let tl:TextLine = TextLine.obtain();
        tl.set(this.mPaint, this.mText, start, end, dir, directions, hasTabsOrEmoji, tabStops);
        let width:number = tl.metrics(null);
        TextLine.recycle(tl);
        return width;
    }

    /**
     * Returns the signed horizontal extent of the specified line, excluding
     * leading margin.  If full is false, excludes trailing whitespace.
     * @param line the index of the line
     * @param tabStops the tab stops, can be null if we know they're not used.
     * @param full whether to include trailing whitespace
     * @return the extent of the text on this line
     */
    private getLineExtent_3(line:number, tabStops:Layout.TabStops, full:boolean):number  {
        let start:number = this.getLineStart(line);
        let end:number = full ? this.getLineEnd(line) : this.getLineVisibleEnd(line);
        let hasTabsOrEmoji:boolean = this.getLineContainsTab(line);
        let directions:Layout.Directions = this.getLineDirections(line);
        let dir:number = this.getParagraphDirection(line);
        let tl:TextLine = TextLine.obtain();
        tl.set(this.mPaint, this.mText, start, end, dir, directions, hasTabsOrEmoji, tabStops);
        let width:number = tl.metrics(null);
        TextLine.recycle(tl);
        return width;
    }

    /**
     * Get the line number corresponding to the specified vertical position.
     * If you ask for a position above 0, you get 0; if you ask for a position
     * below the bottom of the text, you get the last line.
     */
    // FIXME: It may be faster to do a linear search for layouts without many lines.
    getLineForVertical(vertical:number):number  {
        let high:number = this.getLineCount(), low:number = -1, guess:number;
        while (high - low > 1) {
            guess = Math.floor((high + low) / 2);
            if (this.getLineTop(guess) > vertical)
                high = guess;
            else
                low = guess;
        }
        if (low < 0)
            return 0;
        else
            return low;
    }

    /**
     * Get the line number on which the specified text offset appears.
     * If you ask for a position before 0, you get 0; if you ask for a position
     * beyond the end of the text, you get the last line.
     */
    getLineForOffset(offset:number):number  {
        let high:number = this.getLineCount(), low:number = -1, guess:number;
        while (high - low > 1) {
            guess = Math.floor((high + low) / 2);
            if (this.getLineStart(guess) > offset)
                high = guess;
            else
                low = guess;
        }
        if (low < 0)
            return 0;
        else
            return low;
    }

    /**
     * Get the character offset on the specified line whose position is
     * closest to the specified horizontal position.
     */
    getOffsetForHorizontal(line:number, horiz:number):number  {
        let max:number = this.getLineEnd(line) - 1;
        let min:number = this.getLineStart(line);
        let dirs:Layout.Directions = this.getLineDirections(line);
        if (line == this.getLineCount() - 1)
            max++;
        let best:number = min;
        let bestdist:number = Math.abs(this.getPrimaryHorizontal(best) - horiz);
        for (let i:number = 0; i < dirs.mDirections.length; i += 2) {
            let here:number = min + dirs.mDirections[i];
            let there:number = here + (dirs.mDirections[i + 1] & Layout.RUN_LENGTH_MASK);
            let swap:number = (dirs.mDirections[i + 1] & Layout.RUN_RTL_FLAG) != 0 ? -1 : 1;
            if (there > max)
                there = max;
            let high:number = there - 1 + 1, low:number = here + 1 - 1, guess:number;
            while (high - low > 1) {
                guess = Math.floor((high + low) / 2);
                let adguess:number = this.getOffsetAtStartOf(guess);
                if (this.getPrimaryHorizontal(adguess) * swap >= horiz * swap)
                    high = guess;
                else
                    low = guess;
            }
            if (low < here + 1)
                low = here + 1;
            if (low < there) {
                low = this.getOffsetAtStartOf(low);
                let dist:number = Math.abs(this.getPrimaryHorizontal(low) - horiz);
                let aft:number = TextUtils.getOffsetAfter(this.mText, low);
                if (aft < there) {
                    let other:number = Math.abs(this.getPrimaryHorizontal(aft) - horiz);
                    if (other < dist) {
                        dist = other;
                        low = aft;
                    }
                }
                if (dist < bestdist) {
                    bestdist = dist;
                    best = low;
                }
            }
            let dist:number = Math.abs(this.getPrimaryHorizontal(here) - horiz);
            if (dist < bestdist) {
                bestdist = dist;
                best = here;
            }
        }
        let dist:number = Math.abs(this.getPrimaryHorizontal(max) - horiz);
        if (dist <= bestdist) {
            bestdist = dist;
            best = max;
        }
        return best;
    }

    /**
     * Return the text offset after the last character on the specified line.
     */
    getLineEnd(line:number):number  {
        return this.getLineStart(line + 1);
    }

    /**
     * Return the text offset after the last visible character (so whitespace
     * is not counted) on the specified line.
     */
    private getLineVisibleEnd(line:number, start:number=this.getLineStart(line), end:number=this.getLineStart(line + 1)):number  {
        let text:String = this.mText;
        let ch:string;
        if (line == this.getLineCount() - 1) {
            return end;
        }
        for (; end > start; end--) {
            ch = text.charAt(end - 1);
            if (ch == '\n') {
                return end - 1;
            }
            if (ch != ' ' && ch != '\t') {
                break;
            }
        }
        return end;
    }

    /**
     * Return the vertical position of the bottom of the specified line.
     */
    getLineBottom(line:number):number  {
        return this.getLineTop(line + 1);
    }

    /**
     * Return the vertical position of the baseline of the specified line.
     */
    getLineBaseline(line:number):number  {
        // getLineTop(line+1) == getLineTop(line)
        return this.getLineTop(line + 1) - this.getLineDescent(line);
    }

    /**
     * Get the ascent of the text on the specified line.
     * The return value is negative to match the Paint.ascent() convention.
     */
    getLineAscent(line:number):number  {
        // getLineTop(line+1) - getLineDescent(line) == getLineBaseLine(line)
        return this.getLineTop(line) - (this.getLineTop(line + 1) - this.getLineDescent(line));
    }

    getOffsetToLeftOf(offset:number):number  {
        return this.getOffsetToLeftRightOf(offset, true);
    }

    getOffsetToRightOf(offset:number):number  {
        return this.getOffsetToLeftRightOf(offset, false);
    }

    private getOffsetToLeftRightOf(caret:number, toLeft:boolean):number  {
        let line:number = this.getLineForOffset(caret);
        let lineStart:number = this.getLineStart(line);
        let lineEnd:number = this.getLineEnd(line);
        let lineDir:number = this.getParagraphDirection(line);
        let lineChanged:boolean = false;
        let advance:boolean = toLeft == (lineDir == Layout.DIR_RIGHT_TO_LEFT);
        // if walking off line, look at the line we're headed to
        if (advance) {
            if (caret == lineEnd) {
                if (line < this.getLineCount() - 1) {
                    lineChanged = true;
                    ++line;
                } else {
                    // at very end, don't move
                    return caret;
                }
            }
        } else {
            if (caret == lineStart) {
                if (line > 0) {
                    lineChanged = true;
                    --line;
                } else {
                    // at very start, don't move
                    return caret;
                }
            }
        }
        if (lineChanged) {
            lineStart = this.getLineStart(line);
            lineEnd = this.getLineEnd(line);
            let newDir:number = this.getParagraphDirection(line);
            if (newDir != lineDir) {
                // unusual case.  we want to walk onto the line, but it runs
                // in a different direction than this one, so we fake movement
                // in the opposite direction.
                toLeft = !toLeft;
                lineDir = newDir;
            }
        }
        let directions:Layout.Directions = this.getLineDirections(line);
        let tl:TextLine = TextLine.obtain();
        // XXX: we don't care about tabs
        tl.set(this.mPaint, this.mText, lineStart, lineEnd, lineDir, directions, false, null);
        caret = lineStart + tl.getOffsetToLeftRightOf(caret - lineStart, toLeft);
        tl = TextLine.recycle(tl);
        return caret;
    }

    private getOffsetAtStartOf(offset:number):number  {
        // zero-width characters, look at callers
        if (offset == 0)
            return 0;
        let text:String = this.mText;
        let c:number = text.codePointAt(offset);
        let questionMark = '?'.codePointAt(0);
        if (c >= questionMark && c <= questionMark) {
            let c1:number = text.codePointAt(offset - 1);
            if (c1 >= questionMark && c1 <= questionMark)
                offset -= 1;
        }
        if (this.mSpannedText) {
            let spans:ReplacementSpan[] = (<Spanned> text).getSpans<ReplacementSpan>(offset, offset, ReplacementSpan.type);
            for (let i:number = 0; i < spans.length; i++) {
                let start:number = (<Spanned> text).getSpanStart(spans[i]);
                let end:number = (<Spanned> text).getSpanEnd(spans[i]);
                if (start < offset && end > offset)
                    offset = start;
            }
        }
        return offset;
    }

    /**
     * Determine whether we should clamp cursor position. Currently it's
     * only robust for left-aligned displays.
     * @hide
     */
    shouldClampCursor(line:number):boolean  {
        // Only clamp cursor position in left-aligned displays.
        switch(this.getParagraphAlignment(line)) {
            case Layout.Alignment.ALIGN_LEFT:
                return true;
            case Layout.Alignment.ALIGN_NORMAL:
                return this.getParagraphDirection(line) > 0;
            default:
                return false;
        }
    }

    /**
     * Fills in the specified Path with a representation of a cursor
     * at the specified offset.  This will often be a vertical line
     * but can be multiple discontinuous lines in text with multiple
     * directionalities.
     */
    getCursorPath(point:number, dest:Path, editingBuffer:String):void  {
        dest.reset();
        //let line:number = this.getLineForOffset(point);
        //let top:number = this.getLineTop(line);
        //let bottom:number = this.getLineTop(line + 1);
        //let clamped:boolean = this.shouldClampCursor(line);
        //let h1:number = this.getPrimaryHorizontal(point, clamped) - 0.5;
        //let h2:number = this.isLevelBoundary(point) ? this.getSecondaryHorizontal(point, clamped) - 0.5 : h1;
        //let caps:number = TextKeyListener.getMetaState(editingBuffer, TextKeyListener.META_SHIFT_ON) | TextKeyListener.getMetaState(editingBuffer, TextKeyListener.META_SELECTING);
        //let fn:number = TextKeyListener.getMetaState(editingBuffer, TextKeyListener.META_ALT_ON);
        //let dist:number = 0;
        //if (caps != 0 || fn != 0) {
        //    dist = (bottom - top) >> 2;
        //    if (fn != 0)
        //        top += dist;
        //    if (caps != 0)
        //        bottom -= dist;
        //}
        //if (h1 < 0.5)
        //    h1 = 0.5;
        //if (h2 < 0.5)
        //    h2 = 0.5;
        //if (Float.compare(h1, h2) == 0) {
        //    dest.moveTo(h1, top);
        //    dest.lineTo(h1, bottom);
        //} else {
        //    dest.moveTo(h1, top);
        //    dest.lineTo(h1, (top + bottom) >> 1);
        //    dest.moveTo(h2, (top + bottom) >> 1);
        //    dest.lineTo(h2, bottom);
        //}
        //if (caps == 2) {
        //    dest.moveTo(h2, bottom);
        //    dest.lineTo(h2 - dist, bottom + dist);
        //    dest.lineTo(h2, bottom);
        //    dest.lineTo(h2 + dist, bottom + dist);
        //} else if (caps == 1) {
        //    dest.moveTo(h2, bottom);
        //    dest.lineTo(h2 - dist, bottom + dist);
        //    dest.moveTo(h2 - dist, bottom + dist - 0.5);
        //    dest.lineTo(h2 + dist, bottom + dist - 0.5);
        //    dest.moveTo(h2 + dist, bottom + dist);
        //    dest.lineTo(h2, bottom);
        //}
        //if (fn == 2) {
        //    dest.moveTo(h1, top);
        //    dest.lineTo(h1 - dist, top - dist);
        //    dest.lineTo(h1, top);
        //    dest.lineTo(h1 + dist, top - dist);
        //} else if (fn == 1) {
        //    dest.moveTo(h1, top);
        //    dest.lineTo(h1 - dist, top - dist);
        //    dest.moveTo(h1 - dist, top - dist + 0.5);
        //    dest.lineTo(h1 + dist, top - dist + 0.5);
        //    dest.moveTo(h1 + dist, top - dist);
        //    dest.lineTo(h1, top);
        //}
    }

    private addSelection(line:number, start:number, end:number, top:number, bottom:number, dest:Path):void  {
        //TODO selection
        //let linestart:number = this.getLineStart(line);
        //let lineend:number = this.getLineEnd(line);
        //let dirs:Layout.Directions = this.getLineDirections(line);
        //if (lineend > linestart && this.mText.charAt(lineend - 1) == '\n')
        //    lineend--;
        //for (let i:number = 0; i < dirs.mDirections.length; i += 2) {
        //    let here:number = linestart + dirs.mDirections[i];
        //    let there:number = here + (dirs.mDirections[i + 1] & Layout.RUN_LENGTH_MASK);
        //    if (there > lineend)
        //        there = lineend;
        //    if (start <= there && end >= here) {
        //        let st:number = Math.max(start, here);
        //        let en:number = Math.min(end, there);
        //        if (st != en) {
        //            let h1:number = this.getHorizontal_4(st, false, line, false);
        //            let h2:number = this.getHorizontal_4(en, true, line, false);
        //            let left:number = Math.min(h1, h2);
        //            let right:number = Math.max(h1, h2);
        //            dest.addRect(left, top, right, bottom, Path.Direction.CW);
        //        }
        //    }
        //}
    }

    /**
     * Fills in the specified Path with a representation of a highlight
     * between the specified offsets.  This will often be a rectangle
     * or a potentially discontinuous set of rectangles.  If the start
     * and end are the same, the returned path is empty.
     */
    getSelectionPath(start:number, end:number, dest:Path):void  {
        dest.reset();
        //TODO selection
        //if (start == end)
        //    return;
        //if (end < start) {
        //    let temp:number = end;
        //    end = start;
        //    start = temp;
        //}
        //let startline:number = this.getLineForOffset(start);
        //let endline:number = this.getLineForOffset(end);
        //let top:number = this.getLineTop(startline);
        //let bottom:number = this.getLineBottom(endline);
        //if (startline == endline) {
        //    this.addSelection(startline, start, end, top, bottom, dest);
        //} else {
        //    const width:number = this.mWidth;
        //    this.addSelection(startline, start, this.getLineEnd(startline), top, this.getLineBottom(startline), dest);
        //    if (this.getParagraphDirection(startline) == Layout.DIR_RIGHT_TO_LEFT)
        //        dest.addRect(this.getLineLeft(startline), top, 0, this.getLineBottom(startline), Path.Direction.CW);
        //    else
        //        dest.addRect(this.getLineRight(startline), top, width, this.getLineBottom(startline), Path.Direction.CW);
        //    for (let i:number = startline + 1; i < endline; i++) {
        //        top = this.getLineTop(i);
        //        bottom = this.getLineBottom(i);
        //        dest.addRect(0, top, width, bottom, Path.Direction.CW);
        //    }
        //    top = this.getLineTop(endline);
        //    bottom = this.getLineBottom(endline);
        //    this.addSelection(endline, this.getLineStart(endline), end, top, bottom, dest);
        //    if (this.getParagraphDirection(endline) == Layout.DIR_RIGHT_TO_LEFT)
        //        dest.addRect(width, top, this.getLineRight(endline), bottom, Path.Direction.CW);
        //    else
        //        dest.addRect(0, top, this.getLineLeft(endline), bottom, Path.Direction.CW);
        //}
    }

    /**
     * Get the alignment of the specified paragraph, taking into account
     * markup attached to it.
     */
    getParagraphAlignment(line:number):Layout.Alignment  {
        let align:Layout.Alignment = this.mAlignment;
        //if (this.mSpannedText) {
        //    let sp:Spanned = <Spanned> this.mText;
        //    let spans:AlignmentSpan[] = Layout.getParagraphSpans(sp, this.getLineStart(line), this.getLineEnd(line), AlignmentSpan.class);
        //    let spanLength:number = spans.length;
        //    if (spanLength > 0) {
        //        align = spans[spanLength - 1].getAlignment();
        //    }
        //}
        return align;
    }

    /**
     * Get the left edge of the specified paragraph, inset by left margins.
     */
    getParagraphLeft(line:number):number  {
        let left:number = 0;
        let dir:number = this.getParagraphDirection(line);
        if (dir == Layout.DIR_RIGHT_TO_LEFT || !this.mSpannedText) {
            // leading margin has no impact, or no styles
            return left;
        }
        return this.getParagraphLeadingMargin(line);
    }

    /**
     * Get the right edge of the specified paragraph, inset by right margins.
     */
    getParagraphRight(line:number):number  {
        let right:number = this.mWidth;
        let dir:number = this.getParagraphDirection(line);
        if (dir == Layout.DIR_LEFT_TO_RIGHT || !this.mSpannedText) {
            // leading margin has no impact, or no styles
            return right;
        }
        return right - this.getParagraphLeadingMargin(line);
    }

    /**
     * Returns the effective leading margin (unsigned) for this line,
     * taking into account LeadingMarginSpan and LeadingMarginSpan2.
     * @param line the line index
     * @return the leading margin of this line
     */
    private getParagraphLeadingMargin(line:number):number  {
        if (!this.mSpannedText) {
            return 0;
        }
        let spanned:Spanned = <Spanned> this.mText;
        let lineStart:number = this.getLineStart(line);
        let lineEnd:number = this.getLineEnd(line);
        let spanEnd:number = spanned.nextSpanTransition(lineStart, lineEnd, LeadingMarginSpan.type);
        let spans:LeadingMarginSpan[] = Layout.getParagraphSpans<LeadingMarginSpan>(spanned, lineStart, spanEnd, LeadingMarginSpan.type);
        if (spans.length == 0) {
            // no leading margin span;
            return 0;
        }
        let margin:number = 0;
        let isFirstParaLine:boolean = lineStart == 0 || spanned.charAt(lineStart - 1) == '\n';
        for (let i:number = 0; i < spans.length; i++) {
            let span:LeadingMarginSpan = spans[i];
            let useFirstLineMargin:boolean = isFirstParaLine;
            if (LeadingMarginSpan2.isImpl(span)) {
                let spStart:number = spanned.getSpanStart(span);
                let spanLine:number = this.getLineForOffset(spStart);
                let count:number = (<LeadingMarginSpan2> span).getLeadingMarginLineCount();
                useFirstLineMargin = line < spanLine + count;
            }
            margin += span.getLeadingMargin(useFirstLineMargin);
        }
        return margin;
    }

    /* package */
    static measurePara(paint:TextPaint, text:String, start:number, end:number):number  {
        let mt:MeasuredText = MeasuredText.obtain();
        let tl:TextLine = TextLine.obtain();
        try {
            mt.setPara(text, start, end, TextDirectionHeuristics.LTR);
            let directions:Layout.Directions;
            let dir:number;
            //if (mt.mEasy) {
                directions = Layout.DIRS_ALL_LEFT_TO_RIGHT;
                dir = Layout.DIR_LEFT_TO_RIGHT;
            //} else {
            //    directions = AndroidBidi.directions(mt.mDir, mt.mLevels, 0, mt.mChars, 0, mt.mLen);
            //    dir = mt.mDir;
            //}
            let chars:string = mt.mChars;
            let len:number = mt.mLen;
            let hasTabs:boolean = false;
            let tabStops:Layout.TabStops = null;
            for (let i:number = 0; i < len; ++i) {
                if (chars[i] == '\t') {
                    hasTabs = true;
                    if (Spanned.isImplements(text)) {
                        let spanned:Spanned = <Spanned> text;
                        let spanEnd:number = spanned.nextSpanTransition(start, end, TabStopSpan.type);
                        let spans:TabStopSpan[] = Layout.getParagraphSpans<TabStopSpan>(spanned, start, spanEnd, TabStopSpan.type);
                        if (spans.length > 0) {
                            tabStops = new Layout.TabStops(Layout.TAB_INCREMENT, spans);
                        }
                    }
                    break;
                }
            }
            tl.set(paint, text, start, end, dir, directions, hasTabs, tabStops);
            return tl.metrics(null);
        } finally {
            TextLine.recycle(tl);
            MeasuredText.recycle(mt);
        }
    }



    /**
     * Returns the position of the next tab stop after h on the line.
     *
     * @param text the text
     * @param start start of the line
     * @param end limit of the line
     * @param h the current horizontal offset
     * @param tabs the tabs, can be null.  If it is null, any tabs in effect
     * on the line will be used.  If there are no tabs, a default offset
     * will be used to compute the tab stop.
     * @return the offset of the next tab stop.
     */
    /* package */
    static nextTab(text:String, start:number, end:number, h:number, tabs:any[]):number  {
        let nh:number = Float.MAX_VALUE;
        let alltabs:boolean = false;
        if (Spanned.isImplements(text)) {
            if (tabs == null) {
                tabs = Layout.getParagraphSpans(<Spanned> text, start, end, TabStopSpan.type);
                alltabs = true;
            }
            for (let i:number = 0; i < tabs.length; i++) {
                if (!alltabs) {
                    if (!(TabStopSpan.isImpl(tabs[i])))
                        continue;
                }
                let where:number = (<TabStopSpan> tabs[i]).getTabStop();
                if (where < nh && where > h)
                    nh = where;
            }
            if (nh != Float.MAX_VALUE)
                return nh;
        }
        return (Math.floor(((h + Layout.TAB_INCREMENT) / Layout.TAB_INCREMENT))) * Layout.TAB_INCREMENT;
    }

    protected isSpanned():boolean  {
        return this.mSpannedText;
    }

    /**
     * Returns the same as <code>text.getSpans()</code>, except where
     * <code>start</code> and <code>end</code> are the same and are not
     * at the very beginning of the text, in which case an empty array
     * is returned instead.
     * <p>
     * This is needed because of the special case that <code>getSpans()</code>
     * on an empty range returns the spans adjacent to that range, which is
     * primarily for the sake of <code>TextWatchers</code> so they will get
     * notifications when text goes from empty to non-empty.  But it also
     * has the unfortunate side effect that if the text ends with an empty
     * paragraph, that paragraph accidentally picks up the styles of the
     * preceding paragraph (even though those styles will not be picked up
     * by new text that is inserted into the empty paragraph).
     * <p>
     * The reason it just checks whether <code>start</code> and <code>end</code>
     * is the same is that the only time a line can contain 0 characters
     * is if it is the final paragraph of the Layout; otherwise any line will
     * contain at least one printing or newline character.  The reason for the
     * additional check if <code>start</code> is greater than 0 is that
     * if the empty paragraph is the entire content of the buffer, paragraph
     * styles that are already applied to the buffer will apply to text that
     * is inserted into it.
     */
    /* package */
    static getParagraphSpans<T> (text:Spanned, start:number, end:number, type:any):T[]  {
        if (start == end && start > 0) {
            return [];
        }
        return text.getSpans<T>(start, end, type);
    }

    private getEllipsisChar(method:TextUtils.TruncateAt):string  {
        return (method == TextUtils.TruncateAt.END_SMALL) ? Layout.ELLIPSIS_TWO_DOTS[0] : Layout.ELLIPSIS_NORMAL[0];
    }

    private ellipsize(start:number, end:number, line:number, dest:string[], destoff:number, method:TextUtils.TruncateAt):void  {
        let ellipsisCount:number = this.getEllipsisCount(line);
        if (ellipsisCount == 0) {
            return;
        }
        let ellipsisStart:number = this.getEllipsisStart(line);
        let linestart:number = this.getLineStart(line);
        for (let i:number = ellipsisStart; i < ellipsisStart + ellipsisCount; i++) {
            let c:string;
            if (i == ellipsisStart) {
                // ellipsis
                c = this.getEllipsisChar(method);
            } else {
                // 0-width space
                c = String.fromCharCode(20);// Java: ' '
            }
            let a:number = i + linestart;
            if (a >= start && a < end) {
                dest[destoff + a - start] = c;
            }
        }
    }



    /**
     * Return the offset of the first character to be ellipsized away,
     * relative to the start of the line.  (So 0 if the beginning of the
     * line is ellipsized, not getLineStart().)
     */
    abstract 
getEllipsisStart(line:number):number ;

    /**
     * Returns the number of characters to be ellipsized away, or 0 if
     * no ellipsis is to take place.
     */
    abstract 
getEllipsisCount(line:number):number ;





    private mText:String;

    private mPaint:TextPaint;

    /* package */
    mWorkPaint:TextPaint;

    private mWidth:number = 0;

    private mAlignment:Layout.Alignment = Layout.Alignment.ALIGN_NORMAL;

    private mSpacingMult:number = 0;

    private mSpacingAdd:number = 0;

    private static sTempRect:Rect = new Rect();

    private mSpannedText:boolean;

    private mTextDir:TextDirectionHeuristic;

    private mLineBackgroundSpans:SpanSet<LineBackgroundSpan>;

    static DIR_LEFT_TO_RIGHT:number = 1;

    static DIR_RIGHT_TO_LEFT:number = -1;

    /* package */
    static DIR_REQUEST_LTR:number = 1;

    /* package */
    static DIR_REQUEST_RTL:number = -1;

    /* package */
    static DIR_REQUEST_DEFAULT_LTR:number = 2;

    /* package */
    static DIR_REQUEST_DEFAULT_RTL:number = -2;

    /* package */
    static RUN_LENGTH_MASK:number = 0x03ffffff;

    /* package */
    static RUN_LEVEL_SHIFT:number = 26;

    /* package */
    static RUN_LEVEL_MASK:number = 0x3f;

    /* package */
    static RUN_RTL_FLAG:number = 1 << Layout.RUN_LEVEL_SHIFT;

    private static TAB_INCREMENT:number = 20;

    //init last
    /* package */
    static DIRS_ALL_LEFT_TO_RIGHT:Layout.Directions;
    /* package */
    static DIRS_ALL_RIGHT_TO_LEFT:Layout.Directions;

    /* package */
    // this is "..."
    static ELLIPSIS_NORMAL:string[] = [ '…' ];

    /* package */
    // this is ".."
    static ELLIPSIS_TWO_DOTS:string[] = [ '‥' ];
}

export module Layout{
/* package */
export class TabStops {

    private mStops:number[];

    private mNumStops:number = 0;

    private mIncrement:number = 0;

    constructor( increment:number, spans:any[]) {
        this.reset(increment, spans);
    }

    reset(increment:number, spans:any[]):void  {
        this.mIncrement = increment;
        let ns:number = 0;
        if (spans != null) {
            let stops:number[] = this.mStops;
            for (let o of spans) {
                if (TabStopSpan.isImpl(o)) {
                    if (stops == null) {
                        stops = new Array<number>(10);
                    } else if (ns == stops.length) {
                        let nstops:number[] = new Array<number>(ns * 2);
                        for (let i:number = 0; i < ns; ++i) {
                            nstops[i] = stops[i];
                        }
                        stops = nstops;
                    }
                    stops[ns++] = (<TabStopSpan> o).getTabStop();
                }
            }
            if (ns > 1) {
                Arrays.sort(stops, 0, ns);
            }
            if (stops != this.mStops) {
                this.mStops = stops;
            }
        }
        this.mNumStops = ns;
    }

    nextTab(h:number):number  {
        let ns:number = this.mNumStops;
        if (ns > 0) {
            let stops:number[] = this.mStops;
            for (let i:number = 0; i < ns; ++i) {
                let stop:number = stops[i];
                if (stop > h) {
                    return stop;
                }
            }
        }
        return TabStops.nextDefaultStop(h, this.mIncrement);
    }

    static nextDefaultStop(h:number, inc:number):number  {
        return (Math.floor(((h + inc) / inc))) * inc;
    }
}
/**
     * Stores information about bidirectional (left-to-right or right-to-left)
     * text within the layout of a line.
     */
export class Directions {

    // Directions represents directional runs within a line of text.
    // Runs are pairs of ints listed in visual order, starting from the
    // leading margin.  The first int of each pair is the offset from
    // the first character of the line to the start of the run.  The
    // second int represents both the length and level of the run.
    // The length is in the lower bits, accessed by masking with
    // DIR_LENGTH_MASK.  The level is in the higher bits, accessed
    // by shifting by DIR_LEVEL_SHIFT and masking by DIR_LEVEL_MASK.
    // To simply test for an RTL direction, test the bit using
    // DIR_RTL_FLAG, if set then the direction is rtl.
    /* package */
    mDirections:number[];

    /* package */
    constructor( dirs:number[]) {
        this.mDirections = dirs;
    }
}
/* package */
export class Ellipsizer extends String {

    /* package */
    mText:String;

    /* package */
    mLayout:Layout;

    /* package */
    mWidth:number = 0;

    /* package */
    mMethod:TextUtils.TruncateAt;

    constructor(s:String) {
        super(s);
        this.mText = s;
    }

    toString():string {
        //let line1:number = this.mLayout.getLineForOffset(start);
        //let line2:number = this.mLayout.getLineForOffset(end);
        let line1:number = this.mLayout.getLineForOffset(0);
        let line2:number = this.mLayout.getLineForOffset(this.mText.length);
        let dest = this.mText.split('');
        for (let i:number = line1; i <= line2; i++) {
            this.mLayout.ellipsize(0, this.mText.length, i, dest, 0, this.mMethod);
        }
        return dest.join('');
    }
}
/* package */
export class SpannedEllipsizer extends Layout.Ellipsizer implements Spanned {

    //FIXME no impl span when ellipsizer

    private mSpanned:Spanned;

    constructor(display:String) {
        super(display);
        this.mSpanned = <Spanned> display;
    }

    getSpans<T> (start:number, end:number, type:any):T[]  {
        return this.mSpanned.getSpans<T>(start, end, type);
    }

    getSpanStart(tag:any):number  {
        return this.mSpanned.getSpanStart(tag);
    }

    getSpanEnd(tag:any):number  {
        return this.mSpanned.getSpanEnd(tag);
    }

    getSpanFlags(tag:any):number  {
        return this.mSpanned.getSpanFlags(tag);
    }

    nextSpanTransition(start:number, limit:number, type:any):number  {
        return this.mSpanned.nextSpanTransition(start, limit, type);
    }

}
    export enum Alignment {

        ALIGN_NORMAL /*() {
         }
         */, ALIGN_OPPOSITE /*() {
         }
         */, ALIGN_CENTER /*() {
         }
         */, /** @hide */
        ALIGN_LEFT /*() {
         }
         */, /** @hide */
        ALIGN_RIGHT /*() {
     }
     */ /*;
     */}
}


    //init after module loaded
    /* package */
    Layout.DIRS_ALL_LEFT_TO_RIGHT = new Layout.Directions( [ 0, Layout.RUN_LENGTH_MASK ]);
    /* package */
    Layout.DIRS_ALL_RIGHT_TO_LEFT = new Layout.Directions( [ 0, Layout.RUN_LENGTH_MASK | Layout.RUN_RTL_FLAG ]);

}
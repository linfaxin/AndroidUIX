/*
 * Copyright (C) 2010 The Android Open Source Project
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
///<reference path="../../android/graphics/RectF.ts"/>
///<reference path="../../android/text/style/CharacterStyle.ts"/>
///<reference path="../../android/text/style/MetricAffectingSpan.ts"/>
///<reference path="../../android/text/style/ReplacementSpan.ts"/>
///<reference path="../../android/util/Log.ts"/>
///<reference path="../../android/text/Layout.ts"/>
///<reference path="../../android/text/Spanned.ts"/>
///<reference path="../../android/text/SpanSet.ts"/>
///<reference path="../../android/text/TextPaint.ts"/>
///<reference path="../../android/text/TextUtils.ts"/>

module android.text {
import Canvas = android.graphics.Canvas;
import Paint = android.graphics.Paint;
import FontMetricsInt = android.graphics.Paint.FontMetricsInt;
import RectF = android.graphics.RectF;
import CharacterStyle = android.text.style.CharacterStyle;
import MetricAffectingSpan = android.text.style.MetricAffectingSpan;
import ReplacementSpan = android.text.style.ReplacementSpan;
import Log = android.util.Log;
import Spanned = android.text.Spanned;
import SpanSet = android.text.SpanSet;
import TextPaint = android.text.TextPaint;
import TextUtils = android.text.TextUtils;
import Layout = android.text.Layout;
window.addEventListener('AndroidUILoadFinish', ()=>{
    eval('Layout = android.text.Layout;');//real import now
});

/**
 * Represents a line of styled text, for measuring in visual order and
 * for rendering.
 *
 * <p>Get a new instance using obtain(), and when finished with it, return it
 * to the pool using recycle().
 *
 * <p>Call set to prepare the instance for use, then either draw, measure,
 * metrics, or caretToLeftRightOf.
 *
 * @hide
 */
export class TextLine {

    private static DEBUG:boolean = false;

    private mPaint:TextPaint;

    private mText:String;

    private mStart:number = 0;

    private mLen:number = 0;

    private mDir:number = 0;

    private mDirections:Layout.Directions;

    private mHasTabs:boolean;

    private mTabs:Layout.TabStops;

    private mChars:String;

    private mCharsValid:boolean;

    private mSpanned:Spanned;

    private mWorkPaint:TextPaint = new TextPaint();

    private mMetricAffectingSpanSpanSet:SpanSet<MetricAffectingSpan> = new SpanSet<MetricAffectingSpan>(MetricAffectingSpan.type);

    private mCharacterStyleSpanSet:SpanSet<CharacterStyle> = new SpanSet<CharacterStyle>(CharacterStyle.type);

    private mReplacementSpanSpanSet:SpanSet<ReplacementSpan> = new SpanSet<ReplacementSpan>(ReplacementSpan.type);

    private static sCached:TextLine[] = new Array<TextLine>(3);

    /**
     * Returns a new TextLine from the shared pool.
     *
     * @return an uninitialized TextLine
     */
    static obtain():TextLine  {
        let tl:TextLine;
        {
            for (let i:number = TextLine.sCached.length; --i >= 0; ) {
                if (TextLine.sCached[i] != null) {
                    tl = TextLine.sCached[i];
                    TextLine.sCached[i] = null;
                    return tl;
                }
            }
        }
        tl = new TextLine();
        if (TextLine.DEBUG) {
            Log.v("TLINE", "new: " + tl);
        }
        return tl;
    }

    /**
     * Puts a TextLine back into the shared pool. Do not use this TextLine once
     * it has been returned.
     * @param tl the textLine
     * @return null, as a convenience from clearing references to the provided
     * TextLine
     */
    static recycle(tl:TextLine):TextLine  {
        tl.mText = null;
        tl.mPaint = null;
        tl.mDirections = null;
        tl.mMetricAffectingSpanSpanSet.recycle();
        tl.mCharacterStyleSpanSet.recycle();
        tl.mReplacementSpanSpanSet.recycle();
        {
            for (let i:number = 0; i < TextLine.sCached.length; ++i) {
                if (TextLine.sCached[i] == null) {
                    TextLine.sCached[i] = tl;
                    break;
                }
            }
        }
        return null;
    }

    /**
     * Initializes a TextLine and prepares it for use.
     *
     * @param paint the base paint for the line
     * @param text the text, can be Styled
     * @param start the start of the line relative to the text
     * @param limit the limit of the line relative to the text
     * @param dir the paragraph direction of this line
     * @param directions the directions information of this line
     * @param hasTabs true if the line might contain tabs or emoji
     * @param tabStops the tabStops. Can be null.
     */
    set(paint:TextPaint, text:String, start:number, limit:number, dir:number, directions:Layout.Directions, hasTabs:boolean, tabStops:Layout.TabStops):void  {
        this.mPaint = paint;
        this.mText = text;
        this.mStart = start;
        this.mLen = limit - start;
        this.mDir = dir;
        this.mDirections = directions;
        if (this.mDirections == null) {
            throw Error(`new IllegalArgumentException("Directions cannot be null")`);
        }
        this.mHasTabs = hasTabs;
        this.mSpanned = null;
        let hasReplacement:boolean = false;
        if (Spanned.isImplements(text)) {
            this.mSpanned = <Spanned> text;
            this.mReplacementSpanSpanSet.init(this.mSpanned, start, limit);
            hasReplacement = this.mReplacementSpanSpanSet.numberOfSpans > 0;
        }
        this.mCharsValid = hasReplacement || hasTabs || directions != Layout.DIRS_ALL_LEFT_TO_RIGHT;
        if (this.mCharsValid) {
            //if (this.mChars == null || this.mChars.length < this.mLen) {
            //    this.mChars = new Array<char>(ArrayUtils.idealCharArraySize(this.mLen));
            //}
            //TextUtils.getChars(text, start, limit, this.mChars, 0);
            this.mChars = text;
            if (hasReplacement) {
                // Handle these all at once so we don't have to do it as we go.
                // Replace the first character of each replacement run with the
                // object-replacement character and the remainder with zero width
                // non-break space aka BOM.  Cursor movement code skips these
                // zero-width characters.
                let chars = this.mChars.split('');
                for (let i:number = start, inext:number; i < limit; i = inext) {
                    inext = this.mReplacementSpanSpanSet.getNextTransition(i, limit);
                    if (this.mReplacementSpanSpanSet.hasSpansIntersecting(i, inext)) {
                        // transition into a span
                        chars[i - start] = '￼';
                        for (let j:number = i - start + 1, e:number = inext - start; j < e; ++j) {
                            // used as ZWNBS, marks positions to skip
                            chars[j] = '﻿';
                        }
                    }
                }
                this.mChars = chars.join('');
            }
        }
        this.mTabs = tabStops;
    }

    /**
     * Renders the TextLine.
     *
     * @param c the canvas to render on
     * @param x the leading margin position
     * @param top the top of the line
     * @param y the baseline
     * @param bottom the bottom of the line
     */
    draw(c:Canvas, x:number, top:number, y:number, bottom:number):void  {
        if (!this.mHasTabs) {
            if (this.mDirections == Layout.DIRS_ALL_LEFT_TO_RIGHT) {
                this.drawRun(c, 0, this.mLen, false, x, top, y, bottom, false);
                return;
            }
            if (this.mDirections == Layout.DIRS_ALL_RIGHT_TO_LEFT) {
                this.drawRun(c, 0, this.mLen, true, x, top, y, bottom, false);
                return;
            }
        }
        let h:number = 0;
        let runs:number[] = this.mDirections.mDirections;
        let emojiRect:RectF = null;
        let lastRunIndex:number = runs.length - 2;
        for (let i:number = 0; i < runs.length; i += 2) {
            let runStart:number = runs[i];
            let runLimit:number = runStart + (runs[i + 1] & Layout.RUN_LENGTH_MASK);
            if (runLimit > this.mLen) {
                runLimit = this.mLen;
            }
            let runIsRtl:boolean = (runs[i + 1] & Layout.RUN_RTL_FLAG) != 0;
            let segstart:number = runStart;
            for (let j:number = this.mHasTabs ? runStart : runLimit; j <= runLimit; j++) {
                let codept:number = 0;
                //let bm:Bitmap = null;
                if (this.mHasTabs && j < runLimit) {
                    codept = this.mChars.codePointAt(j);
                    if (codept >= 0xd800 && codept < 0xdc00 && j + 1 < runLimit) {
                        codept = this.mChars.codePointAt(j);
                        //if (codept >= Layout.MIN_EMOJI && codept <= Layout.MAX_EMOJI) {
                        //    bm = Layout.EMOJI_FACTORY.getBitmapFromAndroidPua(codept);
                        //} else
                        if (codept > 0xffff) {
                            ++j;
                            continue;
                        }
                    }
                }
                if (j == runLimit || codept == '\t'.codePointAt(0)
                    //|| bm != null
                ) {
                    h += this.drawRun(c, segstart, j, runIsRtl, x + h, top, y, bottom, i != lastRunIndex || j != this.mLen);
                    if (codept == '\t'.codePointAt(0)) {
                        h = this.mDir * this.nextTab(h * this.mDir);
                    }
                    //else if (bm != null) {
                    //    let bmAscent:number = this.ascent(j);
                    //    let bitmapHeight:number = bm.getHeight();
                    //    let scale:number = -bmAscent / bitmapHeight;
                    //    let width:number = bm.getWidth() * scale;
                    //    if (emojiRect == null) {
                    //        emojiRect = new RectF();
                    //    }
                    //    emojiRect.set(x + h, y + bmAscent, x + h + width, y);
                    //    c.drawBitmap(bm, null, emojiRect, this.mPaint);
                    //    h += width;
                    //    j++;
                    //}
                    segstart = j + 1;
                }
            }
        }
    }

    /**
     * Returns metrics information for the entire line.
     *
     * @param fmi receives font metrics information, can be null
     * @return the signed width of the line
     */
    metrics(fmi:FontMetricsInt):number  {
        return this.measure(this.mLen, false, fmi);
    }

    /**
     * Returns information about a position on the line.
     *
     * @param offset the line-relative character offset, between 0 and the
     * line length, inclusive
     * @param trailing true to measure the trailing edge of the character
     * before offset, false to measure the leading edge of the character
     * at offset.
     * @param fmi receives metrics information about the requested
     * character, can be null.
     * @return the signed offset from the leading margin to the requested
     * character edge.
     */
    measure(offset:number, trailing:boolean, fmi:FontMetricsInt):number  {
        let target:number = trailing ? offset - 1 : offset;
        if (target < 0) {
            return 0;
        }
        let h:number = 0;
        if (!this.mHasTabs) {
            if (this.mDirections == Layout.DIRS_ALL_LEFT_TO_RIGHT) {
                return this.measureRun(0, offset, this.mLen, false, fmi);
            }
            if (this.mDirections == Layout.DIRS_ALL_RIGHT_TO_LEFT) {
                return this.measureRun(0, offset, this.mLen, true, fmi);
            }
        }
        let chars = this.mChars;
        let runs:number[] = this.mDirections.mDirections;
        for (let i:number = 0; i < runs.length; i += 2) {
            let runStart:number = runs[i];
            let runLimit:number = runStart + (runs[i + 1] & Layout.RUN_LENGTH_MASK);
            if (runLimit > this.mLen) {
                runLimit = this.mLen;
            }
            let runIsRtl:boolean = (runs[i + 1] & Layout.RUN_RTL_FLAG) != 0;
            let segstart:number = runStart;
            for (let j:number = this.mHasTabs ? runStart : runLimit; j <= runLimit; j++) {
                let codept:number = 0;
                //let bm:Bitmap = null;
                if (this.mHasTabs && j < runLimit) {
                    codept = chars.codePointAt(j);
                    if (codept >= 0xd800 && codept < 0xdc00 && j + 1 < runLimit) {
                        codept = chars.codePointAt(j);
                        //if (codept >= Layout.MIN_EMOJI && codept <= Layout.MAX_EMOJI) {
                        //    bm = Layout.EMOJI_FACTORY.getBitmapFromAndroidPua(codept);
                        //} else
                        if (codept > 0xffff) {
                            ++j;
                            continue;
                        }
                    }
                }
                if (j == runLimit || codept == '\t'.codePointAt(0)
                    //|| bm != null
                ) {
                    let inSegment:boolean = target >= segstart && target < j;
                    let advance:boolean = (this.mDir == Layout.DIR_RIGHT_TO_LEFT) == runIsRtl;
                    if (inSegment && advance) {
                        return h += this.measureRun(segstart, offset, j, runIsRtl, fmi);
                    }
                    let w:number = this.measureRun(segstart, j, j, runIsRtl, fmi);
                    h += advance ? w : -w;
                    if (inSegment) {
                        return h += this.measureRun(segstart, offset, j, runIsRtl, null);
                    }
                    if (codept == '\t'.codePointAt(0)) {
                        if (offset == j) {
                            return h;
                        }
                        h = this.mDir * this.nextTab(h * this.mDir);
                        if (target == j) {
                            return h;
                        }
                    }
                    //if (bm != null) {
                    //    let bmAscent:number = this.ascent(j);
                    //    let wid:number = bm.getWidth() * -bmAscent / bm.getHeight();
                    //    h += this.mDir * wid;
                    //    j++;
                    //}
                    segstart = j + 1;
                }
            }
        }
        return h;
    }

    /**
     * Draws a unidirectional (but possibly multi-styled) run of text.
     *
     *
     * @param c the canvas to draw on
     * @param start the line-relative start
     * @param limit the line-relative limit
     * @param runIsRtl true if the run is right-to-left
     * @param x the position of the run that is closest to the leading margin
     * @param top the top of the line
     * @param y the baseline
     * @param bottom the bottom of the line
     * @param needWidth true if the width value is required.
     * @return the signed width of the run, based on the paragraph direction.
     * Only valid if needWidth is true.
     */
    private drawRun(c:Canvas, start:number, limit:number, runIsRtl:boolean, x:number, top:number, y:number, bottom:number, needWidth:boolean):number  {
        if ((this.mDir == Layout.DIR_LEFT_TO_RIGHT) == runIsRtl) {
            let w:number = -this.measureRun(start, limit, limit, runIsRtl, null);
            this.handleRun(start, limit, limit, runIsRtl, c, x + w, top, y, bottom, null, false);
            return w;
        }
        return this.handleRun(start, limit, limit, runIsRtl, c, x, top, y, bottom, null, needWidth);
    }

    /**
     * Measures a unidirectional (but possibly multi-styled) run of text.
     *
     *
     * @param start the line-relative start of the run
     * @param offset the offset to measure to, between start and limit inclusive
     * @param limit the line-relative limit of the run
     * @param runIsRtl true if the run is right-to-left
     * @param fmi receives metrics information about the requested
     * run, can be null.
     * @return the signed width from the start of the run to the leading edge
     * of the character at offset, based on the run (not paragraph) direction
     */
    private measureRun(start:number, offset:number, limit:number, runIsRtl:boolean, fmi:FontMetricsInt):number  {
        return this.handleRun(start, offset, limit, runIsRtl, null, 0, 0, 0, 0, fmi, true);
    }

    /**
     * Walk the cursor through this line, skipping conjuncts and
     * zero-width characters.
     *
     * <p>This function cannot properly walk the cursor off the ends of the line
     * since it does not know about any shaping on the previous/following line
     * that might affect the cursor position. Callers must either avoid these
     * situations or handle the result specially.
     *
     * @param cursor the starting position of the cursor, between 0 and the
     * length of the line, inclusive
     * @param toLeft true if the caret is moving to the left.
     * @return the new offset.  If it is less than 0 or greater than the length
     * of the line, the previous/following line should be examined to get the
     * actual offset.
     */
    getOffsetToLeftRightOf(cursor:number, toLeft:boolean):number  {
        // 1) The caret marks the leading edge of a character. The character
        // logically before it might be on a different level, and the active caret
        // position is on the character at the lower level. If that character
        // was the previous character, the caret is on its trailing edge.
        // 2) Take this character/edge and move it in the indicated direction.
        // This gives you a new character and a new edge.
        // 3) This position is between two visually adjacent characters.  One of
        // these might be at a lower level.  The active position is on the
        // character at the lower level.
        // 4) If the active position is on the trailing edge of the character,
        // the new caret position is the following logical character, else it
        // is the character.
        let lineStart:number = 0;
        let lineEnd:number = this.mLen;
        let paraIsRtl:boolean = this.mDir == -1;
        let runs:number[] = this.mDirections.mDirections;
        let runIndex:number, runLevel:number = 0, runStart:number = lineStart, runLimit:number = lineEnd, newCaret:number = -1;
        let trailing:boolean = false;
        if (cursor == lineStart) {
            runIndex = -2;
        } else if (cursor == lineEnd) {
            runIndex = runs.length;
        } else {
            // the active caret.
            for (runIndex = 0; runIndex < runs.length; runIndex += 2) {
                runStart = lineStart + runs[runIndex];
                if (cursor >= runStart) {
                    runLimit = runStart + (runs[runIndex + 1] & Layout.RUN_LENGTH_MASK);
                    if (runLimit > lineEnd) {
                        runLimit = lineEnd;
                    }
                    if (cursor < runLimit) {
                        runLevel = (runs[runIndex + 1] >>> Layout.RUN_LEVEL_SHIFT) & Layout.RUN_LEVEL_MASK;
                        if (cursor == runStart) {
                            // The caret is on a run boundary, see if we should
                            // use the position on the trailing edge of the previous
                            // logical character instead.
                            let prevRunIndex:number, prevRunLevel:number, prevRunStart:number, prevRunLimit:number;
                            let pos:number = cursor - 1;
                            for (prevRunIndex = 0; prevRunIndex < runs.length; prevRunIndex += 2) {
                                prevRunStart = lineStart + runs[prevRunIndex];
                                if (pos >= prevRunStart) {
                                    prevRunLimit = prevRunStart + (runs[prevRunIndex + 1] & Layout.RUN_LENGTH_MASK);
                                    if (prevRunLimit > lineEnd) {
                                        prevRunLimit = lineEnd;
                                    }
                                    if (pos < prevRunLimit) {
                                        prevRunLevel = (runs[prevRunIndex + 1] >>> Layout.RUN_LEVEL_SHIFT) & Layout.RUN_LEVEL_MASK;
                                        if (prevRunLevel < runLevel) {
                                            // Start from logically previous character.
                                            runIndex = prevRunIndex;
                                            runLevel = prevRunLevel;
                                            runStart = prevRunStart;
                                            runLimit = prevRunLimit;
                                            trailing = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    }
                }
            }
            // we are at a run boundary so we skip the below test.
            if (runIndex != runs.length) {
                let runIsRtl:boolean = (runLevel & 0x1) != 0;
                let advance:boolean = toLeft == runIsRtl;
                if (cursor != (advance ? runLimit : runStart) || advance != trailing) {
                    // Moving within or into the run, so we can move logically.
                    newCaret = this.getOffsetBeforeAfter(runIndex, runStart, runLimit, runIsRtl, cursor, advance);
                    // position already so we're finished.
                    if (newCaret != (advance ? runLimit : runStart)) {
                        return newCaret;
                    }
                }
            }
        }
        // another run boundary.
        while (true) {
            let advance:boolean = toLeft == paraIsRtl;
            let otherRunIndex:number = runIndex + (advance ? 2 : -2);
            if (otherRunIndex >= 0 && otherRunIndex < runs.length) {
                let otherRunStart:number = lineStart + runs[otherRunIndex];
                let otherRunLimit:number = otherRunStart + (runs[otherRunIndex + 1] & Layout.RUN_LENGTH_MASK);
                if (otherRunLimit > lineEnd) {
                    otherRunLimit = lineEnd;
                }
                let otherRunLevel:number = (runs[otherRunIndex + 1] >>> Layout.RUN_LEVEL_SHIFT) & Layout.RUN_LEVEL_MASK;
                let otherRunIsRtl:boolean = (otherRunLevel & 1) != 0;
                advance = toLeft == otherRunIsRtl;
                if (newCaret == -1) {
                    newCaret = this.getOffsetBeforeAfter(otherRunIndex, otherRunStart, otherRunLimit, otherRunIsRtl, advance ? otherRunStart : otherRunLimit, advance);
                    if (newCaret == (advance ? otherRunLimit : otherRunStart)) {
                        // Crossed and ended up at a new boundary,
                        // repeat a second and final time.
                        runIndex = otherRunIndex;
                        runLevel = otherRunLevel;
                        continue;
                    }
                    break;
                }
                // The new caret is at a boundary.
                if (otherRunLevel < runLevel) {
                    // The strong character is in the other run.
                    newCaret = advance ? otherRunStart : otherRunLimit;
                }
                break;
            }
            if (newCaret == -1) {
                // We're walking off the end of the line.  The paragraph
                // level is always equal to or lower than any internal level, so
                // the boundaries get the strong caret.
                newCaret = advance ? this.mLen + 1 : -1;
                break;
            }
            // the lineStart.
            if (newCaret <= lineEnd) {
                newCaret = advance ? lineEnd : lineStart;
            }
            break;
        }
        return newCaret;
    }

    /**
     * Returns the next valid offset within this directional run, skipping
     * conjuncts and zero-width characters.  This should not be called to walk
     * off the end of the line, since the returned values might not be valid
     * on neighboring lines.  If the returned offset is less than zero or
     * greater than the line length, the offset should be recomputed on the
     * preceding or following line, respectively.
     *
     * @param runIndex the run index
     * @param runStart the start of the run
     * @param runLimit the limit of the run
     * @param runIsRtl true if the run is right-to-left
     * @param offset the offset
     * @param after true if the new offset should logically follow the provided
     * offset
     * @return the new offset
     */
    private getOffsetBeforeAfter(runIndex:number, runStart:number, runLimit:number, runIsRtl:boolean, offset:number, after:boolean):number  {
        if (runIndex < 0 || offset == (after ? this.mLen : 0)) {
            // return accurate values.  These are a guess.
            if (after) {
                return TextUtils.getOffsetAfter(this.mText, offset + this.mStart) - this.mStart;
            }
            return TextUtils.getOffsetBefore(this.mText, offset + this.mStart) - this.mStart;
        }
        let wp:TextPaint = this.mWorkPaint;
        wp.set(this.mPaint);
        let spanStart:number = runStart;
        let spanLimit:number;
        if (this.mSpanned == null) {
            spanLimit = runLimit;
        } else {
            let target:number = after ? offset + 1 : offset;
            let limit:number = this.mStart + runLimit;
            while (true) {
                spanLimit = this.mSpanned.nextSpanTransition(this.mStart + spanStart, limit, MetricAffectingSpan.type) - this.mStart;
                if (spanLimit >= target) {
                    break;
                }
                spanStart = spanLimit;
            }
            let spans:MetricAffectingSpan[] = this.mSpanned.getSpans<MetricAffectingSpan>(this.mStart + spanStart, this.mStart + spanLimit, MetricAffectingSpan.type);
            spans = TextUtils.removeEmptySpans(spans, this.mSpanned, MetricAffectingSpan.type);
            if (spans.length > 0) {
                let replacement:ReplacementSpan = null;
                for (let j:number = 0; j < spans.length; j++) {
                    let span:MetricAffectingSpan = spans[j];
                    if (span instanceof ReplacementSpan) {
                        replacement = <ReplacementSpan> span;
                    } else {
                        span.updateMeasureState(wp);
                    }
                }
                if (replacement != null) {
                    // the start or end of this span.
                    return after ? spanLimit : spanStart;
                }
            }
        }
        let flags:number = runIsRtl ? Paint.DIRECTION_RTL : Paint.DIRECTION_LTR;
        let cursorOpt:number = after ? Paint.CURSOR_AFTER : Paint.CURSOR_BEFORE;
        if (this.mCharsValid) {
            return wp.getTextRunCursor_len(this.mChars.toString(), spanStart, spanLimit - spanStart, flags, offset, cursorOpt);
        } else {
            return wp.getTextRunCursor_end(this.mText.toString(), this.mStart + spanStart, this.mStart + spanLimit, flags, this.mStart + offset, cursorOpt) - this.mStart;
        }
    }

    /**
     * @param wp
     */
    private static expandMetricsFromPaint(fmi:FontMetricsInt, wp:TextPaint):void  {
        const previousTop:number = fmi.top;
        const previousAscent:number = fmi.ascent;
        const previousDescent:number = fmi.descent;
        const previousBottom:number = fmi.bottom;
        const previousLeading:number = fmi.leading;
        wp.getFontMetricsInt(fmi);
        TextLine.updateMetrics(fmi, previousTop, previousAscent, previousDescent, previousBottom, previousLeading);
    }

    static updateMetrics(fmi:FontMetricsInt, previousTop:number, previousAscent:number, previousDescent:number, previousBottom:number, previousLeading:number):void  {
        fmi.top = Math.min(fmi.top, previousTop);
        fmi.ascent = Math.min(fmi.ascent, previousAscent);
        fmi.descent = Math.max(fmi.descent, previousDescent);
        fmi.bottom = Math.max(fmi.bottom, previousBottom);
        fmi.leading = Math.max(fmi.leading, previousLeading);
    }

    /**
     * Utility function for measuring and rendering text.  The text must
     * not include a tab or emoji.
     *
     * @param wp the working paint
     * @param start the start of the text
     * @param end the end of the text
     * @param runIsRtl true if the run is right-to-left
     * @param c the canvas, can be null if rendering is not needed
     * @param x the edge of the run closest to the leading margin
     * @param top the top of the line
     * @param y the baseline
     * @param bottom the bottom of the line
     * @param fmi receives metrics information, can be null
     * @param needWidth true if the width of the run is needed
     * @return the signed width of the run based on the run direction; only
     * valid if needWidth is true
     */
    private handleText(wp:TextPaint, start:number, end:number, contextStart:number, contextEnd:number, runIsRtl:boolean, c:Canvas, x:number, top:number, y:number, bottom:number, fmi:FontMetricsInt, needWidth:boolean):number  {
        // Get metrics first (even for empty strings or "0" width runs)
        if (fmi != null) {
            TextLine.expandMetricsFromPaint(fmi, wp);
        }
        let runLen:number = end - start;
        // No need to do anything if the run width is "0"
        if (runLen == 0) {
            return 0;
        }
        let ret:number = 0;
        let contextLen:number = contextEnd - contextStart;
        if (needWidth || (c != null && (wp.bgColor != 0 || wp.underlineColor != 0 || runIsRtl))) {
            let flags:number = runIsRtl ? Paint.DIRECTION_RTL : Paint.DIRECTION_LTR;
            if (this.mCharsValid) {
                ret = wp.getTextRunAdvances_count(this.mChars.toString(), start, runLen, contextStart, contextLen, flags, null, 0);
            } else {
                let delta:number = this.mStart;
                ret = wp.getTextRunAdvances_end(this.mText.toString(), delta + start, delta + end, delta + contextStart, delta + contextEnd, flags, null, 0);
            }
        }
        if (c != null) {
            if (runIsRtl) {
                x -= ret;
            }
            if (wp.bgColor != 0) {
                let previousColor:number = wp.getColor();
                let previousStyle:Paint.Style = wp.getStyle();
                wp.setColor(wp.bgColor);
                wp.setStyle(Paint.Style.FILL);
                c.drawRect(x, top, x + ret, bottom, wp);
                wp.setStyle(previousStyle);
                wp.setColor(previousColor);
            }
            if (wp.underlineColor != 0) {
                // kStdUnderline_Offset = 1/9, defined in SkTextFormatParams.h
                let underlineTop:number = y + wp.baselineShift + (1.0 / 9.0) * wp.getTextSize();
                let previousColor:number = wp.getColor();
                let previousStyle:Paint.Style = wp.getStyle();
                let previousAntiAlias:boolean = wp.isAntiAlias();
                wp.setStyle(Paint.Style.FILL);
                wp.setAntiAlias(true);
                wp.setColor(wp.underlineColor);
                c.drawRect(x, underlineTop, x + ret, underlineTop + wp.underlineThickness, wp);
                wp.setStyle(previousStyle);
                wp.setColor(previousColor);
                wp.setAntiAlias(previousAntiAlias);
            }
            this.drawTextRun(c, wp, start, end, contextStart, contextEnd, runIsRtl, x, y + wp.baselineShift);
        }
        return runIsRtl ? -ret : ret;
    }

    /**
     * Utility function for measuring and rendering a replacement.
     *
     *
     * @param replacement the replacement
     * @param wp the work paint
     * @param start the start of the run
     * @param limit the limit of the run
     * @param runIsRtl true if the run is right-to-left
     * @param c the canvas, can be null if not rendering
     * @param x the edge of the replacement closest to the leading margin
     * @param top the top of the line
     * @param y the baseline
     * @param bottom the bottom of the line
     * @param fmi receives metrics information, can be null
     * @param needWidth true if the width of the replacement is needed
     * @return the signed width of the run based on the run direction; only
     * valid if needWidth is true
     */
    private handleReplacement(replacement:ReplacementSpan, wp:TextPaint, start:number, limit:number, runIsRtl:boolean, c:Canvas, x:number, top:number, y:number, bottom:number, fmi:FontMetricsInt, needWidth:boolean):number  {
        let ret:number = 0;
        let textStart:number = this.mStart + start;
        let textLimit:number = this.mStart + limit;
        if (needWidth || (c != null && runIsRtl)) {
            let previousTop:number = 0;
            let previousAscent:number = 0;
            let previousDescent:number = 0;
            let previousBottom:number = 0;
            let previousLeading:number = 0;
            let needUpdateMetrics:boolean = (fmi != null);
            if (needUpdateMetrics) {
                previousTop = fmi.top;
                previousAscent = fmi.ascent;
                previousDescent = fmi.descent;
                previousBottom = fmi.bottom;
                previousLeading = fmi.leading;
            }
            ret = replacement.getSize(wp, this.mText, textStart, textLimit, fmi);
            if (needUpdateMetrics) {
                TextLine.updateMetrics(fmi, previousTop, previousAscent, previousDescent, previousBottom, previousLeading);
            }
        }
        if (c != null) {
            if (runIsRtl) {
                x -= ret;
            }
            replacement.draw(c, this.mText, textStart, textLimit, x, top, y, bottom, wp);
        }
        return runIsRtl ? -ret : ret;
    }

    /**
     * Utility function for handling a unidirectional run.  The run must not
     * contain tabs or emoji but can contain styles.
     *
     *
     * @param start the line-relative start of the run
     * @param measureLimit the offset to measure to, between start and limit inclusive
     * @param limit the limit of the run
     * @param runIsRtl true if the run is right-to-left
     * @param c the canvas, can be null
     * @param x the end of the run closest to the leading margin
     * @param top the top of the line
     * @param y the baseline
     * @param bottom the bottom of the line
     * @param fmi receives metrics information, can be null
     * @param needWidth true if the width is required
     * @return the signed width of the run based on the run direction; only
     * valid if needWidth is true
     */
    private handleRun(start:number, measureLimit:number, limit:number, runIsRtl:boolean, c:Canvas, x:number, top:number, y:number, bottom:number, fmi:FontMetricsInt, needWidth:boolean):number  {
        // Case of an empty line, make sure we update fmi according to mPaint
        if (start == measureLimit) {
            let wp:TextPaint = this.mWorkPaint;
            wp.set(this.mPaint);
            if (fmi != null) {
                TextLine.expandMetricsFromPaint(fmi, wp);
            }
            return 0;
        }
        if (this.mSpanned == null) {
            let wp:TextPaint = this.mWorkPaint;
            wp.set(this.mPaint);
            const mlimit:number = measureLimit;
            return this.handleText(wp, start, mlimit, start, limit, runIsRtl, c, x, top, y, bottom, fmi, needWidth || mlimit < measureLimit);
        }
        this.mMetricAffectingSpanSpanSet.init(this.mSpanned, this.mStart + start, this.mStart + limit);
        this.mCharacterStyleSpanSet.init(this.mSpanned, this.mStart + start, this.mStart + limit);
        // Shaping needs to take into account context up to metric boundaries,
        // but rendering needs to take into account character style boundaries.
        // So we iterate through metric runs to get metric bounds,
        // then within each metric run iterate through character style runs
        // for the run bounds.
        const originalX:number = x;
        for (let i:number = start, inext:number; i < measureLimit; i = inext) {
            let wp:TextPaint = this.mWorkPaint;
            wp.set(this.mPaint);
            inext = this.mMetricAffectingSpanSpanSet.getNextTransition(this.mStart + i, this.mStart + limit) - this.mStart;
            let mlimit:number = Math.min(inext, measureLimit);
            let replacement:ReplacementSpan = null;
            for (let j:number = 0; j < this.mMetricAffectingSpanSpanSet.numberOfSpans; j++) {
                // empty by construction. This special case in getSpans() explains the >= & <= tests
                if ((this.mMetricAffectingSpanSpanSet.spanStarts[j] >= this.mStart + mlimit) || (this.mMetricAffectingSpanSpanSet.spanEnds[j] <= this.mStart + i))
                    continue;
                let span:MetricAffectingSpan = this.mMetricAffectingSpanSpanSet.spans[j];
                if (span instanceof ReplacementSpan) {
                    replacement = <ReplacementSpan> span;
                } else {
                    // We might have a replacement that uses the draw
                    // state, otherwise measure state would suffice.
                    span.updateDrawState(wp);
                }
            }
            if (replacement != null) {
                x += this.handleReplacement(replacement, wp, i, mlimit, runIsRtl, c, x, top, y, bottom, fmi, needWidth || mlimit < measureLimit);
                continue;
            }
            for (let j:number = i, jnext:number; j < mlimit; j = jnext) {
                jnext = this.mCharacterStyleSpanSet.getNextTransition(this.mStart + j, this.mStart + mlimit) - this.mStart;
                wp.set(this.mPaint);
                for (let k:number = 0; k < this.mCharacterStyleSpanSet.numberOfSpans; k++) {
                    // Intentionally using >= and <= as explained above
                    if ((this.mCharacterStyleSpanSet.spanStarts[k] >= this.mStart + jnext) || (this.mCharacterStyleSpanSet.spanEnds[k] <= this.mStart + j))
                        continue;
                    let span:CharacterStyle = this.mCharacterStyleSpanSet.spans[k];
                    span.updateDrawState(wp);
                }
                x += this.handleText(wp, j, jnext, i, inext, runIsRtl, c, x, top, y, bottom, fmi, needWidth || jnext < measureLimit);
            }
        }
        return x - originalX;
    }

    /**
     * Render a text run with the set-up paint.
     *
     * @param c the canvas
     * @param wp the paint used to render the text
     * @param start the start of the run
     * @param end the end of the run
     * @param contextStart the start of context for the run
     * @param contextEnd the end of the context for the run
     * @param runIsRtl true if the run is right-to-left
     * @param x the x position of the left edge of the run
     * @param y the baseline of the run
     */
    private drawTextRun(c:Canvas, wp:TextPaint, start:number, end:number, contextStart:number, contextEnd:number, runIsRtl:boolean, x:number, y:number):void  {
        let flags:number = runIsRtl ? Canvas.DIRECTION_RTL : Canvas.DIRECTION_LTR;
        if (this.mCharsValid) {
            let count:number = end - start;
            let contextCount:number = contextEnd - contextStart;
            c.drawTextRun_count(this.mChars.toString(), start, count, contextStart, contextCount, x, y, flags, wp);
        } else {
            let delta:number = this.mStart;
            c.drawTextRun_end(this.mText.toString(), delta + start, delta + end, delta + contextStart, delta + contextEnd, x, y, flags, wp);
        }
    }

    /**
     * Returns the ascent of the text at start.  This is used for scaling
     * emoji.
     *
     * @param pos the line-relative position
     * @return the ascent of the text at start
     */
    ascent(pos:number):number  {
        if (this.mSpanned == null) {
            return this.mPaint.ascent();
        }
        pos += this.mStart;
        let spans:MetricAffectingSpan[] = this.mSpanned.getSpans<MetricAffectingSpan>(pos, pos + 1, MetricAffectingSpan.type);
        if (spans.length == 0) {
            return this.mPaint.ascent();
        }
        let wp:TextPaint = this.mWorkPaint;
        wp.set(this.mPaint);
        for (let span of spans) {
            span.updateMeasureState(wp);
        }
        return wp.ascent();
    }

    /**
     * Returns the next tab position.
     *
     * @param h the (unsigned) offset from the leading margin
     * @return the (unsigned) tab position after this offset
     */
    nextTab(h:number):number  {
        if (this.mTabs != null) {
            return this.mTabs.nextTab(h);
        }
        return Layout.TabStops.nextDefaultStop(h, TextLine.TAB_INCREMENT);
    }

    private static TAB_INCREMENT:number = 20;
}
}
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

///<reference path="../../android/graphics/Paint.ts"/>
///<reference path="../../android/text/style/LeadingMarginSpan.ts"/>
///<reference path="../../android/text/style/LineHeightSpan.ts"/>
///<reference path="../../android/text/style/MetricAffectingSpan.ts"/>
///<reference path="../../android/text/style/TabStopSpan.ts"/>
///<reference path="../../android/util/Log.ts"/>
///<reference path="../../java/lang/Integer.ts"/>
///<reference path="../../java/lang/System.ts"/>
///<reference path="../../android/text/Layout.ts"/>
///<reference path="../../android/text/MeasuredText.ts"/>
///<reference path="../../android/text/Spanned.ts"/>
///<reference path="../../android/text/TextDirectionHeuristic.ts"/>
///<reference path="../../android/text/TextDirectionHeuristics.ts"/>
///<reference path="../../android/text/TextPaint.ts"/>
///<reference path="../../android/text/TextUtils.ts"/>

module android.text {
import Paint = android.graphics.Paint;
import LeadingMarginSpan = android.text.style.LeadingMarginSpan;
import LeadingMarginSpan2 = android.text.style.LeadingMarginSpan.LeadingMarginSpan2;
import LineHeightSpan = android.text.style.LineHeightSpan;
import MetricAffectingSpan = android.text.style.MetricAffectingSpan;
import TabStopSpan = android.text.style.TabStopSpan;
import Log = android.util.Log;
import Integer = java.lang.Integer;
import System = java.lang.System;
import Layout = android.text.Layout;
import MeasuredText = android.text.MeasuredText;
import Spanned = android.text.Spanned;
import TextDirectionHeuristic = android.text.TextDirectionHeuristic;
import TextDirectionHeuristics = android.text.TextDirectionHeuristics;
import TextPaint = android.text.TextPaint;
import TextUtils = android.text.TextUtils;
/**
 * StaticLayout is a Layout for text that will not be edited after it
 * is laid out.  Use {@link DynamicLayout} for text that may change.
 * <p>This is used by widgets to control text layout. You should not need
 * to use this class directly unless you are implementing your own widget
 * or custom display object, or would be tempted to call
 * {@link android.graphics.Canvas#drawText(java.lang.CharSequence, int, int,
 * float, float, android.graphics.Paint)
 * Canvas.drawText()} directly.</p>
 */
export class StaticLayout extends Layout {

    static TAG:string = "StaticLayout";

    /**
     * @hide
     */
    constructor(source:String, bufstart:number, bufend:number, paint:TextPaint, outerwidth:number, align:Layout.Alignment,
                 textDir:TextDirectionHeuristic, spacingmult:number, spacingadd:number, includepad:boolean,
                 ellipsize:TextUtils.TruncateAt=null, ellipsizedWidth=0, maxLines=Integer.MAX_VALUE) {
        super((ellipsize == null) ? source : (Spanned.isImplements(source)) ? new Layout.SpannedEllipsizer(source) : new Layout.Ellipsizer(source),
            paint, outerwidth, align, textDir, spacingmult, spacingadd);


        /* package */
        //constructor( text:CharSequence) {
        //    super(text, null, 0, null, 0, 0);
        //    this.mColumns = StaticLayout.COLUMNS_ELLIPSIZE;
        //    this.mLines = androidui.util.ArrayCreator.newNumberArray(ArrayUtils.idealIntArraySize(2 * this.mColumns));
        //    this.mLineDirections = new Array<Layout.Directions>(ArrayUtils.idealIntArraySize(2 * this.mColumns));
        //    // FIXME This is never recycled
        //    this.mMeasured = MeasuredText.obtain();
        //}
        if(source==null){
            this.mColumns = StaticLayout.COLUMNS_ELLIPSIZE;
            this.mLines = androidui.util.ArrayCreator.newNumberArray((2 * this.mColumns));
            this.mLineDirections = new Array<Layout.Directions>((2 * this.mColumns));
            // FIXME This is never recycled
            this.mMeasured = MeasuredText.obtain();
            return;
        }
        /*
         * This is annoying, but we can't refer to the layout until
         * superclass construction is finished, and the superclass
         * constructor wants the reference to the display text.
         *
         * This will break if the superclass constructor ever actually
         * cares about the content instead of just holding the reference.
         */
        if (ellipsize != null) {
            let e:Layout.Ellipsizer = <Layout.Ellipsizer> this.getText();
            e.mLayout = this;
            e.mWidth = ellipsizedWidth;
            e.mMethod = ellipsize;
            this.mEllipsizedWidth = ellipsizedWidth;
            this.mColumns = StaticLayout.COLUMNS_ELLIPSIZE;
        } else {
            this.mColumns = StaticLayout.COLUMNS_NORMAL;
            this.mEllipsizedWidth = outerwidth;
        }
        this.mLines = androidui.util.ArrayCreator.newNumberArray(2 * this.mColumns);
        this.mLineDirections = new Array<Layout.Directions>(2 * this.mColumns);
        this.mMaximumVisibleLineCount = maxLines;
        this.mMeasured = MeasuredText.obtain();
        this.generate(source, bufstart, bufend, paint, outerwidth, textDir, spacingmult, spacingadd, includepad, includepad, ellipsizedWidth, ellipsize);
        this.mMeasured = MeasuredText.recycle(this.mMeasured);
        this.mFontMetricsInt = null;
    }


    /* package */
    generate(source:String, bufStart:number, bufEnd:number, paint:TextPaint, outerWidth:number,
                textDir:TextDirectionHeuristic, spacingmult:number, spacingadd:number, includepad:boolean,
                trackpad:boolean, ellipsizedWidth:number, ellipsize:TextUtils.TruncateAt):void  {
        this.mLineCount = 0;
        let v:number = 0;
        let needMultiply:boolean = (spacingmult != 1 || spacingadd != 0);
        let fm:Paint.FontMetricsInt = this.mFontMetricsInt;
        let chooseHtv:number[] = null;
        let measured:MeasuredText = this.mMeasured;
        let spanned:Spanned = null;
        if (Spanned.isImplements(source))
            spanned = <Spanned> source;
        // XXX
        let DEFAULT_DIR:number = StaticLayout.DIR_LEFT_TO_RIGHT;
        let paraEnd:number;
        for (let paraStart:number = bufStart; paraStart <= bufEnd; paraStart = paraEnd) {
            paraEnd = source.substring(0, bufEnd).indexOf(StaticLayout.CHAR_NEW_LINE, paraStart);
            if (paraEnd < 0)
                paraEnd = bufEnd;
            else
                paraEnd++;
            let firstWidthLineLimit:number = this.mLineCount + 1;
            let firstWidth:number = outerWidth;
            let restWidth:number = outerWidth;
            let chooseHt:LineHeightSpan[] = null;
            if (spanned != null) {
                let sp:LeadingMarginSpan[] = StaticLayout.getParagraphSpans<LeadingMarginSpan>(spanned, paraStart, paraEnd, LeadingMarginSpan.type);
                for (let i:number = 0; i < sp.length; i++) {
                    let lms:LeadingMarginSpan = sp[i];
                    firstWidth -= sp[i].getLeadingMargin(true);
                    restWidth -= sp[i].getLeadingMargin(false);
                    // paragraph.
                    if (LeadingMarginSpan2.isImpl(lms)) {
                        let lms2:LeadingMarginSpan2 = <LeadingMarginSpan2> lms;
                        let lmsFirstLine:number = this.getLineForOffset(spanned.getSpanStart(lms2));
                        firstWidthLineLimit = lmsFirstLine + lms2.getLeadingMarginLineCount();
                    }
                }
                chooseHt = StaticLayout.getParagraphSpans<LineHeightSpan>(spanned, paraStart, paraEnd, LineHeightSpan.type);
                if (chooseHt.length != 0) {
                    if (chooseHtv == null || chooseHtv.length < chooseHt.length) {
                        chooseHtv = androidui.util.ArrayCreator.newNumberArray(chooseHt.length);
                    }
                    for (let i:number = 0; i < chooseHt.length; i++) {
                        let o:number = spanned.getSpanStart(chooseHt[i]);
                        if (o < paraStart) {
                            // starts in this layout, before the
                            // current paragraph
                            chooseHtv[i] = this.getLineTop(this.getLineForOffset(o));
                        } else {
                            // starts in this paragraph
                            chooseHtv[i] = v;
                        }
                    }
                }
            }
            measured.setPara(source, paraStart, paraEnd, textDir);
            let chs:string = measured.mChars;
            let widths:number[] = measured.mWidths;
            let chdirs:number[] = measured.mLevels;
            let dir:number = measured.mDir;
            let easy:boolean = measured.mEasy;
            let width:number = firstWidth;
            let w:number = 0;
            // here is the offset of the starting character of the line we are currently measuring
            let here:number = paraStart;
            // ok is a character offset located after a word separator (space, tab, number...) where
            // we would prefer to cut the current line. Equals to here when no such break was found.
            let ok:number = paraStart;
            let okWidth:number = w;
            let okAscent:number = 0, okDescent:number = 0, okTop:number = 0, okBottom:number = 0;
            // fit is a character offset such that the [here, fit[ range fits in the allowed width.
            // We will cut the line there if no ok position is found.
            let fit:number = paraStart;
            let fitWidth:number = w;
            let fitAscent:number = 0, fitDescent:number = 0, fitTop:number = 0, fitBottom:number = 0;
            let hasTabOrEmoji:boolean = false;
            let hasTab:boolean = false;
            let tabStops:Layout.TabStops = null;
            for (let spanStart:number = paraStart, spanEnd:number; spanStart < paraEnd; spanStart = spanEnd) {
                if (spanned == null) {
                    spanEnd = paraEnd;
                    let spanLen:number = spanEnd - spanStart;
                    measured.addStyleRun(paint, spanLen, fm);
                } else {
                    spanEnd = spanned.nextSpanTransition(spanStart, paraEnd, MetricAffectingSpan.type);
                    let spanLen:number = spanEnd - spanStart;
                    let spans:MetricAffectingSpan[] = spanned.getSpans<MetricAffectingSpan>(spanStart, spanEnd, MetricAffectingSpan.type);
                    spans = TextUtils.removeEmptySpans(spans, spanned, MetricAffectingSpan.type);
                    measured.addStyleRun(paint, spans, spanLen, fm);
                }
                let fmTop:number = fm.top;
                let fmBottom:number = fm.bottom;
                let fmAscent:number = fm.ascent;
                let fmDescent:number = fm.descent;
                for (let j:number = spanStart; j < spanEnd; j++) {
                    let c:string = chs[j - paraStart];
                    if (c == StaticLayout.CHAR_NEW_LINE) {
                    // intentionally left empty
                    } else if (c == StaticLayout.CHAR_TAB) {
                        if (hasTab == false) {
                            hasTab = true;
                            hasTabOrEmoji = true;
                            if (spanned != null) {
                                // First tab this para, check for tabstops
                                let spans:TabStopSpan[] = StaticLayout.getParagraphSpans<TabStopSpan>(spanned, paraStart, paraEnd, TabStopSpan.type);
                                if (spans.length > 0) {
                                    tabStops = new Layout.TabStops(StaticLayout.TAB_INCREMENT, spans);
                                }
                            }
                        }
                        if (tabStops != null) {
                            w = tabStops.nextTab(w);
                        } else {
                            w = StaticLayout.TabStops.nextDefaultStop(w, StaticLayout.TAB_INCREMENT);
                        }
                    } else if (c.codePointAt(0) >= StaticLayout.CHAR_FIRST_HIGH_SURROGATE
                        && c.codePointAt(0) <= StaticLayout.CHAR_LAST_LOW_SURROGATE && j + 1 < spanEnd) {
                        let emoji:number = chs.codePointAt(j - paraStart);
                        //if (emoji >= StaticLayout.MIN_EMOJI && emoji <= StaticLayout.MAX_EMOJI) {
                        //    let bm:Bitmap = StaticLayout.EMOJI_FACTORY.getBitmapFromAndroidPua(emoji);
                        //    if (bm != null) {
                        //        let whichPaint:Paint;
                        //        if (spanned == null) {
                        //            whichPaint = paint;
                        //        } else {
                        //            whichPaint = this.mWorkPaint;
                        //        }
                        //        let wid:number = bm.getWidth() * -whichPaint.ascent() / bm.getHeight();
                        //        w += wid;
                        //        hasTabOrEmoji = true;
                        //        j++;
                        //    } else {
                        //        w += widths[j - paraStart];
                        //    }
                        //} else {
                            w += widths[j - paraStart];
                        //}
                    } else {
                        w += widths[j - paraStart];
                    }
                    let isSpaceOrTab:boolean = c == StaticLayout.CHAR_SPACE || c == StaticLayout.CHAR_TAB || c == StaticLayout.CHAR_ZWSP;
                    if (w <= width || isSpaceOrTab) {
                        fitWidth = w;
                        fit = j + 1;
                        if (fmTop < fitTop)
                            fitTop = fmTop;
                        if (fmAscent < fitAscent)
                            fitAscent = fmAscent;
                        if (fmDescent > fitDescent)
                            fitDescent = fmDescent;
                        if (fmBottom > fitBottom)
                            fitBottom = fmBottom;
                        // From the Unicode Line Breaking Algorithm (at least approximately)
                        let isLineBreak:boolean = isSpaceOrTab || // / is class SY and - is class HY, except when followed by a digit
                        ((c == StaticLayout.CHAR_SLASH || c == StaticLayout.CHAR_HYPHEN) && (j + 1 >= spanEnd ||
                        !Number.isInteger(Number.parseInt(chs[j + 1 - paraStart])))) || // (non-starters), which can be broken after but not before
                        (c.codePointAt(0) >= StaticLayout.CHAR_FIRST_CJK.codePointAt(0) && StaticLayout.isIdeographic(c, true) && j + 1 < spanEnd && StaticLayout.isIdeographic(chs[j + 1 - paraStart], false));
                        if (isLineBreak) {
                            okWidth = w;
                            ok = j + 1;
                            if (fitTop < okTop)
                                okTop = fitTop;
                            if (fitAscent < okAscent)
                                okAscent = fitAscent;
                            if (fitDescent > okDescent)
                                okDescent = fitDescent;
                            if (fitBottom > okBottom)
                                okBottom = fitBottom;
                        }
                    } else {
                        const moreChars:boolean = (j + 1 < spanEnd);
                        let endPos:number;
                        let above:number, below:number, top:number, bottom:number;
                        let currentTextWidth:number;
                        if (ok != here) {
                            endPos = ok;
                            above = okAscent;
                            below = okDescent;
                            top = okTop;
                            bottom = okBottom;
                            currentTextWidth = okWidth;
                        } else if (fit != here) {
                            endPos = fit;
                            above = fitAscent;
                            below = fitDescent;
                            top = fitTop;
                            bottom = fitBottom;
                            currentTextWidth = fitWidth;
                        } else {
                            endPos = here + 1;
                            above = fm.ascent;
                            below = fm.descent;
                            top = fm.top;
                            bottom = fm.bottom;
                            currentTextWidth = widths[here - paraStart];
                        }
                        v = this.out(source, here, endPos, above, below, top, bottom, v, spacingmult, spacingadd, chooseHt, chooseHtv, fm, hasTabOrEmoji, needMultiply, chdirs, dir, easy, bufEnd, includepad, trackpad, chs, widths, paraStart, ellipsize, ellipsizedWidth, currentTextWidth, paint, moreChars);
                        here = endPos;
                        // restart j-span loop from here, compensating for the j++
                        j = here - 1;
                        ok = fit = here;
                        w = 0;
                        fitAscent = fitDescent = fitTop = fitBottom = 0;
                        okAscent = okDescent = okTop = okBottom = 0;
                        if (--firstWidthLineLimit <= 0) {
                            width = restWidth;
                        }
                        if (here < spanStart) {
                            // The text was cut before the beginning of the current span range.
                            // Exit the span loop, and get spanStart to start over from here.
                            measured.setPos(here);
                            spanEnd = here;
                            break;
                        }
                        if (this.mLineCount >= this.mMaximumVisibleLineCount) {
                            break;
                        }
                    }
                }
            }
            if (paraEnd != here && this.mLineCount < this.mMaximumVisibleLineCount) {
                if ((fitTop | fitBottom | fitDescent | fitAscent) == 0) {
                    paint.getFontMetricsInt(fm);
                    fitTop = fm.top;
                    fitBottom = fm.bottom;
                    fitAscent = fm.ascent;
                    fitDescent = fm.descent;
                }
                // Log.e("text", "output rest " + here + " to " + end);
                v = this.out(source, here, paraEnd, fitAscent, fitDescent, fitTop, fitBottom, v, spacingmult, spacingadd, chooseHt, chooseHtv, fm, hasTabOrEmoji, needMultiply, chdirs, dir, easy, bufEnd, includepad, trackpad, chs, widths, paraStart, ellipsize, ellipsizedWidth, w, paint, paraEnd != bufEnd);
            }
            paraStart = paraEnd;
            if (paraEnd == bufEnd)
                break;
        }
        if ((bufEnd == bufStart || source.charAt(bufEnd - 1) == StaticLayout.CHAR_NEW_LINE) && this.mLineCount < this.mMaximumVisibleLineCount) {
            // Log.e("text", "output last " + bufEnd);
            measured.setPara(source, bufStart, bufEnd, textDir);
            paint.getFontMetricsInt(fm);
            v = this.out(source, bufEnd, bufEnd, fm.ascent, fm.descent, fm.top, fm.bottom, v, spacingmult, spacingadd, null, null, fm, false, needMultiply, measured.mLevels, measured.mDir, measured.mEasy, bufEnd, includepad, trackpad, null, null, bufStart, ellipsize, ellipsizedWidth, 0, paint, false);
        }
    }

    /**
     * Returns true if the specified character is one of those specified
     * as being Ideographic (class ID) by the Unicode Line Breaking Algorithm
     * (http://www.unicode.org/unicode/reports/tr14/), and is therefore OK
     * to break between a pair of.
     *
     * @param includeNonStarters also return true for category NS
     *                           (non-starters), which can be broken
     *                           after but not before.
     */
    private static isIdeographic(c:string, includeNonStarters:boolean):boolean  {
        let code = c.codePointAt(0);
        if (code >= '⺀'.codePointAt(0) && code <= '⿿'.codePointAt(0)) {
            // CJK, KANGXI RADICALS, DESCRIPTION SYMBOLS
            return true;
        }
        if (c == '　') {
            // IDEOGRAPHIC SPACE
            return true;
        }
        if (code >= '぀'.codePointAt(0) && code <= 'ゟ'.codePointAt(0)) {
            if (!includeNonStarters) {
                switch(c) {
                    //  # HIRAGANA LETTER SMALL A
                    case 'ぁ':
                    //  # HIRAGANA LETTER SMALL I
                    case 'ぃ':
                    //  # HIRAGANA LETTER SMALL U
                    case 'ぅ':
                    //  # HIRAGANA LETTER SMALL E
                    case 'ぇ':
                    //  # HIRAGANA LETTER SMALL O
                    case 'ぉ':
                    //  # HIRAGANA LETTER SMALL TU
                    case 'っ':
                    //  # HIRAGANA LETTER SMALL YA
                    case 'ゃ':
                    //  # HIRAGANA LETTER SMALL YU
                    case 'ゅ':
                    //  # HIRAGANA LETTER SMALL YO
                    case 'ょ':
                    //  # HIRAGANA LETTER SMALL WA
                    case 'ゎ':
                    //  # HIRAGANA LETTER SMALL KA
                    case 'ゕ':
                    //  # HIRAGANA LETTER SMALL KE
                    case 'ゖ':
                    //  # KATAKANA-HIRAGANA VOICED SOUND MARK
                    case '゛':
                    //  # KATAKANA-HIRAGANA SEMI-VOICED SOUND MARK
                    case '゜':
                    //  # HIRAGANA ITERATION MARK
                    case 'ゝ':
                    case //  # HIRAGANA VOICED ITERATION MARK
                    'ゞ':
                        return false;
                }
            }
            // Hiragana (except small characters)
            return true;
        }
        if (code >= '゠'.codePointAt(0) && code <= 'ヿ'.codePointAt(0)) {
            if (!includeNonStarters) {
                switch(c) {
                    //  # KATAKANA-HIRAGANA DOUBLE HYPHEN
                    case '゠':
                    //  # KATAKANA LETTER SMALL A
                    case 'ァ':
                    //  # KATAKANA LETTER SMALL I
                    case 'ィ':
                    //  # KATAKANA LETTER SMALL U
                    case 'ゥ':
                    //  # KATAKANA LETTER SMALL E
                    case 'ェ':
                    //  # KATAKANA LETTER SMALL O
                    case 'ォ':
                    //  # KATAKANA LETTER SMALL TU
                    case 'ッ':
                    //  # KATAKANA LETTER SMALL YA
                    case 'ャ':
                    //  # KATAKANA LETTER SMALL YU
                    case 'ュ':
                    //  # KATAKANA LETTER SMALL YO
                    case 'ョ':
                    //  # KATAKANA LETTER SMALL WA
                    case 'ヮ':
                    //  # KATAKANA LETTER SMALL KA
                    case 'ヵ':
                    //  # KATAKANA LETTER SMALL KE
                    case 'ヶ':
                    //  # KATAKANA MIDDLE DOT
                    case '・':
                    //  # KATAKANA-HIRAGANA PROLONGED SOUND MARK
                    case 'ー':
                    //  # KATAKANA ITERATION MARK
                    case 'ヽ':
                    case //  # KATAKANA VOICED ITERATION MARK
                    'ヾ':
                        return false;
                }
            }
            // Katakana (except small characters)
            return true;
        }
        if (code >= '㐀'.codePointAt(0) && code <= '䶵'.codePointAt(0)) {
            // CJK UNIFIED IDEOGRAPHS EXTENSION A
            return true;
        }
        if (code >= '一'.codePointAt(0) && code <= '龻'.codePointAt(0)) {
            // CJK UNIFIED IDEOGRAPHS
            return true;
        }
        if (code >= '豈'.codePointAt(0) && code <= '龎'.codePointAt(0)) {
            // CJK COMPATIBILITY IDEOGRAPHS
            return true;
        }
        if (code >= 'ꀀ'.codePointAt(0) && code <= '꒏'.codePointAt(0)) {
            // YI SYLLABLES
            return true;
        }
        if (code >= '꒐'.codePointAt(0) && code <= '꓏'.codePointAt(0)) {
            // YI RADICALS
            return true;
        }
        if (code >= '﹢'.codePointAt(0) && code <= '﹦'.codePointAt(0)) {
            // SMALL PLUS SIGN to SMALL EQUALS SIGN
            return true;
        }
        if (code >= '０'.codePointAt(0) && code <= '９'.codePointAt(0)) {
            // WIDE DIGITS
            return true;
        }
        return false;
    }

    private out(text:String, start:number, end:number, above:number, below:number, top:number, bottom:number, v:number,
                spacingmult:number, spacingadd:number, chooseHt:LineHeightSpan[], chooseHtv:number[], fm:Paint.FontMetricsInt,
                hasTabOrEmoji:boolean, needMultiply:boolean, chdirs:number[], dir:number, easy:boolean, bufEnd:number,
                includePad:boolean, trackPad:boolean, chs:string, widths:number[], widthStart:number, ellipsize:TextUtils.TruncateAt,
                ellipsisWidth:number, textWidth:number, paint:TextPaint, moreChars:boolean):number  {
        let j:number = this.mLineCount;
        let off:number = j * this.mColumns;
        let want:number = off + this.mColumns + StaticLayout.TOP;
        let lines:number[] = this.mLines;
        if (want >= lines.length) {
            let nlen:number = (want + 1);
            let grow:number[] = androidui.util.ArrayCreator.newNumberArray(nlen);
            System.arraycopy(lines, 0, grow, 0, lines.length);
            this.mLines = grow;
            lines = grow;
            let grow2:Layout.Directions[] = new Array<Layout.Directions>(nlen);
            System.arraycopy(this.mLineDirections, 0, grow2, 0, this.mLineDirections.length);
            this.mLineDirections = grow2;
        }
        if (chooseHt != null) {
            fm.ascent = above;
            fm.descent = below;
            fm.top = top;
            fm.bottom = bottom;
            for (let i:number = 0; i < chooseHt.length; i++) {
                //if (chooseHt[i] instanceof LineHeightSpan.WithDensity) {
                    (<LineHeightSpan.WithDensity> chooseHt[i]).chooseHeight(text, start, end, chooseHtv[i], v, fm, paint);
                //} else {
                //    chooseHt[i].chooseHeight(text, start, end, chooseHtv[i], v, fm);
                //}
            }
            above = fm.ascent;
            below = fm.descent;
            top = fm.top;
            bottom = fm.bottom;
        }
        if (j == 0) {
            if (trackPad) {
                this.mTopPadding = top - above;
            }
            if (includePad) {
                above = top;
            }
        }
        if (end == bufEnd) {
            if (trackPad) {
                this.mBottomPadding = bottom - below;
            }
            if (includePad) {
                below = bottom;
            }
        }
        let extra:number;
        if (needMultiply) {
            let ex:number = (below - above) * (spacingmult - 1) + spacingadd;
            if (ex >= 0) {
                extra = Math.floor((ex + StaticLayout.EXTRA_ROUNDING));
            } else {
                extra = -Math.floor((-ex + StaticLayout.EXTRA_ROUNDING));
            }
        } else {
            extra = 0;
        }
        lines[off + StaticLayout.START] = start;
        lines[off + StaticLayout.TOP] = v;
        lines[off + StaticLayout.DESCENT] = below + extra;
        v += (below - above) + extra;
        lines[off + this.mColumns + StaticLayout.START] = end;
        lines[off + this.mColumns + StaticLayout.TOP] = v;
        if (hasTabOrEmoji)
            lines[off + StaticLayout.TAB] |= StaticLayout.TAB_MASK;
        lines[off + StaticLayout.DIR] |= dir << StaticLayout.DIR_SHIFT;
        let linedirs:Layout.Directions = StaticLayout.DIRS_ALL_LEFT_TO_RIGHT;
        // RTL paragraph.  Make sure easy is false if this is the case.
        //if (easy) {
            this.mLineDirections[j] = linedirs;
        //} else {
        //    this.mLineDirections[j] = AndroidBidi.directions(dir, chdirs, start - widthStart, chs, start - widthStart, end - start);
        //}
        if (ellipsize != null) {
            // If there is only one line, then do any type of ellipsis except when it is MARQUEE
            // if there are multiple lines, just allow END ellipsis on the last line
            let firstLine:boolean = (j == 0);
            let currentLineIsTheLastVisibleOne:boolean = (j + 1 == this.mMaximumVisibleLineCount);
            let forceEllipsis:boolean = moreChars && (this.mLineCount + 1 == this.mMaximumVisibleLineCount);
            let doEllipsis:boolean = (((this.mMaximumVisibleLineCount == 1 && moreChars) || (firstLine && !moreChars)) && ellipsize != TextUtils.TruncateAt.MARQUEE) || (!firstLine && (currentLineIsTheLastVisibleOne || !moreChars) && ellipsize == TextUtils.TruncateAt.END);
            if (doEllipsis) {
                this.calculateEllipsis(start, end, widths, widthStart, ellipsisWidth, ellipsize, j, textWidth, paint, forceEllipsis);
            }
        }
        this.mLineCount++;
        return v;
    }

    private calculateEllipsis(lineStart:number, lineEnd:number, widths:number[], widthStart:number, avail:number, where:TextUtils.TruncateAt, line:number, textWidth:number, paint:TextPaint, forceEllipsis:boolean):void  {
        if (textWidth <= avail && !forceEllipsis) {
            // Everything fits!
            this.mLines[this.mColumns * line + StaticLayout.ELLIPSIS_START] = 0;
            this.mLines[this.mColumns * line + StaticLayout.ELLIPSIS_COUNT] = 0;
            return;
        }
        let ellipsisWidth:number = paint.measureText(
            (where == TextUtils.TruncateAt.END_SMALL) ? StaticLayout.ELLIPSIS_TWO_DOTS[0] : StaticLayout.ELLIPSIS_NORMAL[0], 0, 1);
        let ellipsisStart:number = 0;
        let ellipsisCount:number = 0;
        let len:number = lineEnd - lineStart;
        // We only support start ellipsis on a single line
        if (where == TextUtils.TruncateAt.START) {
            if (this.mMaximumVisibleLineCount == 1) {
                let sum:number = 0;
                let i:number;
                for (i = len; i >= 0; i--) {
                    let w:number = widths[i - 1 + lineStart - widthStart];
                    if (w + sum + ellipsisWidth > avail) {
                        break;
                    }
                    sum += w;
                }
                ellipsisStart = 0;
                ellipsisCount = i;
            } else {
                //if (Log.isLoggable(StaticLayout.TAG, Log.WARN)) {
                //    Log.w(StaticLayout.TAG, "Start Ellipsis only supported with one line");
                //}
            }
        } else if (where == TextUtils.TruncateAt.END || where == TextUtils.TruncateAt.MARQUEE || where == TextUtils.TruncateAt.END_SMALL) {
            let sum:number = 0;
            let i:number;
            for (i = 0; i < len; i++) {
                let w:number = widths[i + lineStart - widthStart];
                if (w + sum + ellipsisWidth > avail) {
                    break;
                }
                sum += w;
            }
            ellipsisStart = i;
            ellipsisCount = len - i;
            if (forceEllipsis && ellipsisCount == 0 && len > 0) {
                ellipsisStart = len - 1;
                ellipsisCount = 1;
            }
        } else {
            // where = TextUtils.TruncateAt.MIDDLE We only support middle ellipsis on a single line
            if (this.mMaximumVisibleLineCount == 1) {
                let lsum:number = 0, rsum:number = 0;
                let left:number = 0, right:number = len;
                let ravail:number = (avail - ellipsisWidth) / 2;
                for (right = len; right >= 0; right--) {
                    let w:number = widths[right - 1 + lineStart - widthStart];
                    if (w + rsum > ravail) {
                        break;
                    }
                    rsum += w;
                }
                let lavail:number = avail - ellipsisWidth - rsum;
                for (left = 0; left < right; left++) {
                    let w:number = widths[left + lineStart - widthStart];
                    if (w + lsum > lavail) {
                        break;
                    }
                    lsum += w;
                }
                ellipsisStart = left;
                ellipsisCount = right - left;
            } else {
                //if (Log.isLoggable(StaticLayout.TAG, Log.WARN)) {
                //    Log.w(StaticLayout.TAG, "Middle Ellipsis only supported with one line");
                //}
            }
        }
        this.mLines[this.mColumns * line + StaticLayout.ELLIPSIS_START] = ellipsisStart;
        this.mLines[this.mColumns * line + StaticLayout.ELLIPSIS_COUNT] = ellipsisCount;
    }

    // Override the base class so we can directly access our members,
    // rather than relying on member functions.
    // The logic mirrors that of Layout.getLineForVertical
    // FIXME: It may be faster to do a linear search for layouts without many lines.
    getLineForVertical(vertical:number):number  {
        let high:number = this.mLineCount;
        let low:number = -1;
        let guess:number;
        let lines:number[] = this.mLines;
        while (high - low > 1) {
            guess = (high + low) >> 1;
            if (lines[this.mColumns * guess + StaticLayout.TOP] > vertical) {
                high = guess;
            } else {
                low = guess;
            }
        }
        if (low < 0) {
            return 0;
        } else {
            return low;
        }
    }

    getLineCount():number  {
        return this.mLineCount;
    }

    getLineTop(line:number):number  {
        let top:number = this.mLines[this.mColumns * line + StaticLayout.TOP];
        if (this.mMaximumVisibleLineCount > 0 && line >= this.mMaximumVisibleLineCount && line != this.mLineCount) {
            top += this.getBottomPadding();
        }
        return top;
    }

    getLineDescent(line:number):number  {
        let descent:number = this.mLines[this.mColumns * line + StaticLayout.DESCENT];
        if (// -1 intended
        this.mMaximumVisibleLineCount > 0 && line >= this.mMaximumVisibleLineCount - 1 && line != this.mLineCount) {
            descent += this.getBottomPadding();
        }
        return descent;
    }

    getLineStart(line:number):number  {
        return this.mLines[this.mColumns * line + StaticLayout.START] & StaticLayout.START_MASK;
    }

    getParagraphDirection(line:number):number  {
        return this.mLines[this.mColumns * line + StaticLayout.DIR] >> StaticLayout.DIR_SHIFT;
    }

    getLineContainsTab(line:number):boolean  {
        return (this.mLines[this.mColumns * line + StaticLayout.TAB] & StaticLayout.TAB_MASK) != 0;
    }

    getLineDirections(line:number):Layout.Directions  {
        return this.mLineDirections[line];
    }

    getTopPadding():number  {
        return this.mTopPadding;
    }

    getBottomPadding():number  {
        return this.mBottomPadding;
    }

    getEllipsisCount(line:number):number  {
        if (this.mColumns < StaticLayout.COLUMNS_ELLIPSIZE) {
            return 0;
        }
        return this.mLines[this.mColumns * line + StaticLayout.ELLIPSIS_COUNT];
    }

    getEllipsisStart(line:number):number  {
        if (this.mColumns < StaticLayout.COLUMNS_ELLIPSIZE) {
            return 0;
        }
        return this.mLines[this.mColumns * line + StaticLayout.ELLIPSIS_START];
    }

    getEllipsizedWidth():number  {
        return this.mEllipsizedWidth;
    }

    prepare():void  {
        this.mMeasured = MeasuredText.obtain();
    }

    finish():void  {
        this.mMeasured = MeasuredText.recycle(this.mMeasured);
    }

    private mLineCount:number = 0;

    private mTopPadding:number = 0;
    private mBottomPadding:number = 0;

    private mColumns:number = 0;

    private mEllipsizedWidth:number = 0;

    private static COLUMNS_NORMAL:number = 3;

    private static COLUMNS_ELLIPSIZE:number = 5;

    private static START:number = 0;

    private static DIR:number = StaticLayout.START;

    private static TAB:number = StaticLayout.START;

    private static TOP:number = 1;

    private static DESCENT:number = 2;

    private static ELLIPSIS_START:number = 3;

    private static ELLIPSIS_COUNT:number = 4;

    private mLines:number[];

    private mLineDirections:Layout.Directions[];

    private mMaximumVisibleLineCount:number = Integer.MAX_VALUE;

    private static START_MASK:number = 0x1FFFFFFF;

    private static DIR_SHIFT:number = 30;

    private static TAB_MASK:number = 0x20000000;

    // same as Layout, but that's private
    //private static TAB_INCREMENT:number = 20;

    private static CHAR_FIRST_CJK = '⺀';

    private static CHAR_NEW_LINE = '\n';

    private static CHAR_TAB = '\t';

    private static CHAR_SPACE = ' ';

    private static CHAR_SLASH = '/';

    private static CHAR_HYPHEN = '-';

    private static CHAR_ZWSP = '​';

    private static EXTRA_ROUNDING:number = 0.5;

    private static CHAR_FIRST_HIGH_SURROGATE:number = 0xD800;

    private static CHAR_LAST_LOW_SURROGATE:number = 0xDFFF;

    /*
     * This is reused across calls to generate()
     */
    private mMeasured:MeasuredText;

    private mFontMetricsInt:Paint.FontMetricsInt = new Paint.FontMetricsInt();
}
}
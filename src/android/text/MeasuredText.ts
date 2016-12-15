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
///<reference path="../../android/text/style/MetricAffectingSpan.ts"/>
///<reference path="../../android/text/style/ReplacementSpan.ts"/>
///<reference path="../../android/util/Log.ts"/>
///<reference path="../../android/text/Layout.ts"/>
///<reference path="../../android/text/Spanned.ts"/>
///<reference path="../../android/text/TextDirectionHeuristic.ts"/>
///<reference path="../../android/text/TextPaint.ts"/>
///<reference path="../../android/text/TextUtils.ts"/>

module android.text {
import Canvas = android.graphics.Canvas;
import Paint = android.graphics.Paint;
import MetricAffectingSpan = android.text.style.MetricAffectingSpan;
import ReplacementSpan = android.text.style.ReplacementSpan;
import Log = android.util.Log;
import Spanned = android.text.Spanned;
import TextDirectionHeuristic = android.text.TextDirectionHeuristic;
import TextPaint = android.text.TextPaint;
import TextUtils = android.text.TextUtils;
/**
 * @hide
 */
export class MeasuredText {

    private static localLOGV:boolean = false;

    mText:String;

    mTextStart:number = 0;

    mWidths:number[];

    mChars:string;

    mLevels:number[];

    mDir:number = 0;

    mEasy:boolean;

    mLen:number = 0;

    private mPos:number = 0;

    private mWorkPaint:TextPaint;

    constructor( ) {
        this.mWorkPaint = new TextPaint();
    }

    private static sLock:any[] = new Array<any>(0);

    private static sCached:MeasuredText[] = new Array<MeasuredText>(3);

    static obtain():MeasuredText  {
        let mt:MeasuredText;
        {
            for (let i:number = MeasuredText.sCached.length; --i >= 0; ) {
                if (MeasuredText.sCached[i] != null) {
                    mt = MeasuredText.sCached[i];
                    MeasuredText.sCached[i] = null;
                    return mt;
                }
            }
        }
        mt = new MeasuredText();
        if (MeasuredText.localLOGV) {
            Log.v("MEAS", "new: " + mt);
        }
        return mt;
    }

    static recycle(mt:MeasuredText):MeasuredText  {
        mt.mText = null;
        if (mt.mLen < 1000) {
            {
                for (let i:number = 0; i < MeasuredText.sCached.length; ++i) {
                    if (MeasuredText.sCached[i] == null) {
                        MeasuredText.sCached[i] = mt;
                        mt.mText = null;
                        break;
                    }
                }
            }
        }
        return null;
    }

    setPos(pos:number):void  {
        this.mPos = pos - this.mTextStart;
    }

    /**
     * Analyzes text for bidirectional runs.  Allocates working buffers.
     */
    setPara(text:String, start:number, end:number, textDir:TextDirectionHeuristic):void  {
        this.mText = text;
        this.mTextStart = start;
        let len:number = end - start;
        this.mLen = len;
        this.mPos = 0;
        if (this.mWidths == null || this.mWidths.length < len) {
            this.mWidths = androidui.util.ArrayCreator.newNumberArray(len);
        }
        //if (this.mChars == null || this.mChars.length < len) {
        //    this.mChars = new Array<string>(ArrayUtils.idealCharArraySize(len));
        //}
        //TextUtils.getChars(text, start, end, this.mChars, 0);
        this.mChars = text.toString().substring(start, end);
        if (Spanned.isImplements(text)) {
            let spanned:Spanned = <Spanned> text;
            let spans:ReplacementSpan[] = spanned.getSpans<ReplacementSpan>(start, end, ReplacementSpan.type);
            for (let i:number = 0; i < spans.length; i++) {
                let startInPara:number = spanned.getSpanStart(spans[i]) - start;
                let endInPara:number = spanned.getSpanEnd(spans[i]) - start;
                // The span interval may be larger and must be restricted to [start, end[
                if (startInPara < 0)
                    startInPara = 0;
                if (endInPara > len)
                    endInPara = len;
                for (let j:number = startInPara; j < endInPara; j++) {
                    // object replacement character
                    // this.mChars[j] = '￼';
                    this.mChars = this.mChars.substring(0, j) + ' ' + this.mChars.substring(j+1);
                }
            }
        }
        //if ((textDir == TextDirectionHeuristics.LTR || textDir == TextDirectionHeuristics.FIRSTSTRONG_LTR || textDir == TextDirectionHeuristics.ANYRTL_LTR) && TextUtils.doesNotNeedBidi(this.mChars, 0, len)) {
            this.mDir = android.text.Layout.DIR_LEFT_TO_RIGHT;
            this.mEasy = true;
        //} else {
        //    if (this.mLevels == null || this.mLevels.length < len) {
        //        this.mLevels = new Array<byte>(ArrayUtils.idealByteArraySize(len));
        //    }
        //    let bidiRequest:number;
        //    if (textDir == TextDirectionHeuristics.LTR) {
        //        bidiRequest = android.text.Layout.DIR_REQUEST_LTR;
        //    } else if (textDir == TextDirectionHeuristics.RTL) {
        //        bidiRequest = android.text.Layout.DIR_REQUEST_RTL;
        //    } else if (textDir == TextDirectionHeuristics.FIRSTSTRONG_LTR) {
        //        bidiRequest = android.text.Layout.DIR_REQUEST_DEFAULT_LTR;
        //    } else if (textDir == TextDirectionHeuristics.FIRSTSTRONG_RTL) {
        //        bidiRequest = android.text.Layout.DIR_REQUEST_DEFAULT_RTL;
        //    } else {
        //        let isRtl:boolean = textDir.isRtl(this.mChars, 0, len);
        //        bidiRequest = isRtl ? android.text.Layout.DIR_REQUEST_RTL : android.text.Layout.DIR_REQUEST_LTR;
        //    }
        //    this.mDir = AndroidBidi.bidi(bidiRequest, this.mChars, this.mLevels, len, false);
        //    this.mEasy = false;
        //}
    }

    addStyleRun(paint:TextPaint, len:number, fm:Paint.FontMetricsInt):number;
    addStyleRun(paint:TextPaint, spans:MetricAffectingSpan[], len:number, fm:Paint.FontMetricsInt):number;
    addStyleRun(...args):number{
        if(args.length===3) return (<any>this).addStyleRun_3(...args);
        if(args.length===4) return (<any>this).addStyleRun_4(...args);
    }

    private addStyleRun_3(paint:TextPaint, len:number, fm:Paint.FontMetricsInt):number  {
        if (fm != null) {
            paint.getFontMetricsInt(fm);
        }
        let p:number = this.mPos;
        this.mPos = p + len;
        if (this.mEasy) {
            let flags:number = this.mDir == android.text.Layout.DIR_LEFT_TO_RIGHT ? Canvas.DIRECTION_LTR : Canvas.DIRECTION_RTL;
            return paint.getTextRunAdvances_count(this.mChars, p, len, p, len, flags, this.mWidths, p);
        }
        let totalAdvance:number = 0;
        let level:number = this.mLevels[p];
        for (let q:number = p, i:number = p + 1, e:number = p + len; ; ++i) {
            if (i == e || this.mLevels[i] != level) {
                let flags:number = (level & 0x1) == 0 ? Canvas.DIRECTION_LTR : Canvas.DIRECTION_RTL;
                totalAdvance += paint.getTextRunAdvances_count(this.mChars, q, i - q, q, i - q, flags, this.mWidths, q);
                if (i == e) {
                    break;
                }
                q = i;
                level = this.mLevels[i];
            }
        }
        return totalAdvance;
    }

    private addStyleRun_4(paint:TextPaint, spans:MetricAffectingSpan[], len:number, fm:Paint.FontMetricsInt):number  {
        let workPaint:TextPaint = this.mWorkPaint;
        workPaint.set(paint);
        // XXX paint should not have a baseline shift, but...
        workPaint.baselineShift = 0;
        let replacement:ReplacementSpan = null;
        for (let i:number = 0; i < spans.length; i++) {
            let span:MetricAffectingSpan = spans[i];
            if (span instanceof ReplacementSpan) {
                replacement = <ReplacementSpan> span;
            } else {
                span.updateMeasureState(workPaint);
            }
        }
        let wid:number;
        if (replacement == null) {
            wid = this.addStyleRun(workPaint, len, fm);
        } else {
            // Use original text.  Shouldn't matter.
            wid = replacement.getSize(workPaint, this.mText, this.mTextStart + this.mPos, this.mTextStart + this.mPos + len, fm);
            let w:number[] = this.mWidths;
            w[this.mPos] = wid;
            for (let i:number = this.mPos + 1, e:number = this.mPos + len; i < e; i++) w[i] = 0;
            this.mPos += len;
        }
        if (fm != null) {
            if (workPaint.baselineShift < 0) {
                fm.ascent += workPaint.baselineShift;
                fm.top += workPaint.baselineShift;
            } else {
                fm.descent += workPaint.baselineShift;
                fm.bottom += workPaint.baselineShift;
            }
        }
        return wid;
    }

    breakText(limit:number, forwards:boolean, width:number):number  {
        let w:number[] = this.mWidths;
        if (forwards) {
            let i:number = 0;
            while (i < limit) {
                width -= w[i];
                if (width < 0.0)
                    break;
                i++;
            }
            while (i > 0 && this.mChars[i - 1] == ' ') i--;
            return i;
        } else {
            let i:number = limit - 1;
            while (i >= 0) {
                width -= w[i];
                if (width < 0.0)
                    break;
                i--;
            }
            while (i < limit - 1 && this.mChars[i + 1] == ' ') i++;
            return limit - i - 1;
        }
    }

    measure(start:number, limit:number):number  {
        let width:number = 0;
        let w:number[] = this.mWidths;
        for (let i:number = start; i < limit; ++i) {
            width += w[i];
        }
        return width;
    }
}
}
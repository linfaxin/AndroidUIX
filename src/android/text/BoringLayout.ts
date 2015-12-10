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
///<reference path="../../android/graphics/Path.ts"/>
///<reference path="../../android/text/style/ParagraphStyle.ts"/>
///<reference path="../../android/text/Layout.ts"/>
///<reference path="../../android/text/Spanned.ts"/>
///<reference path="../../android/text/TextDirectionHeuristic.ts"/>
///<reference path="../../android/text/TextDirectionHeuristics.ts"/>
///<reference path="../../android/text/TextLine.ts"/>
///<reference path="../../android/text/TextPaint.ts"/>
///<reference path="../../android/text/TextUtils.ts"/>

module android.text {
import Canvas = android.graphics.Canvas;
import Paint = android.graphics.Paint;
import Path = android.graphics.Path;
import ParagraphStyle = android.text.style.ParagraphStyle;
import Layout = android.text.Layout;
import Spanned = android.text.Spanned;
import TextDirectionHeuristic = android.text.TextDirectionHeuristic;
import TextDirectionHeuristics = android.text.TextDirectionHeuristics;
import TextLine = android.text.TextLine;
import TextPaint = android.text.TextPaint;
import TextUtils = android.text.TextUtils;
/**
 * A BoringLayout is a very simple Layout implementation for text that
 * fits on a single line and is all left-to-right characters.
 * You will probably never want to make one of these yourself;
 * if you do, be sure to call {@link #isBoring} first to make sure
 * the text meets the criteria.
 * <p>This class is used by widgets to control text layout. You should not need
 * to use this class directly unless you are implementing your own widget
 * or custom display object, in which case
 * you are encouraged to use a Layout instead of calling
 * {@link android.graphics.Canvas#drawText(java.lang.CharSequence, int, int, float, float, android.graphics.Paint)
 *  Canvas.drawText()} directly.</p>
 */
export class BoringLayout extends Layout implements TextUtils.EllipsizeCallback {

    static make(source:String, paint:TextPaint, outerwidth:number, align:Layout.Alignment, spacingmult:number, spacingadd:number,
                metrics:BoringLayout.Metrics, includepad:boolean, ellipsize:TextUtils.TruncateAt=null, ellipsizedWidth:number=outerwidth):BoringLayout  {
        return new BoringLayout(source, paint, outerwidth, align, spacingmult, spacingadd, metrics, includepad, ellipsize, ellipsizedWidth);
    }

    /**
     * Returns a BoringLayout for the specified text, potentially reusing
     * this one if it is already suitable.  The caller must make sure that
     * no one is still using this Layout.
     */
    replaceOrMake(source:String, paint:TextPaint, outerwidth:number, align:Layout.Alignment, spacingmult:number, spacingadd:number,
                  metrics:BoringLayout.Metrics, includepad:boolean, ellipsize:TextUtils.TruncateAt=null, ellipsizedWidth:number=outerwidth):BoringLayout  {
        let trust:boolean;
        if (ellipsize == null || ellipsize == TextUtils.TruncateAt.MARQUEE) {
            this.replaceWith(source, paint, outerwidth, align, spacingmult, spacingadd);
            this.mEllipsizedWidth = outerwidth;
            this.mEllipsizedStart = 0;
            this.mEllipsizedCount = 0;
            trust = true;
        } else {
            this.replaceWith(TextUtils.ellipsize(source, paint, ellipsizedWidth, ellipsize, true, this), paint, outerwidth, align, spacingmult, spacingadd);
            this.mEllipsizedWidth = ellipsizedWidth;
            trust = false;
        }
        this.init(this.getText(), paint, outerwidth, align, spacingmult, spacingadd, metrics, includepad, trust);
        return this;
    }

    constructor( source:String, paint:TextPaint, outerwidth:number, align:Layout.Alignment, spacingmult:number, spacingadd:number,
                 metrics:BoringLayout.Metrics, includepad:boolean, ellipsize:TextUtils.TruncateAt=null, ellipsizedWidth:number=outerwidth) {
        /*
         * It is silly to have to call super() and then replaceWith(),
         * but we can't use "this" for the callback until the call to
         * super() finishes.
         */
        super(source, paint, outerwidth, align, TextDirectionHeuristics.FIRSTSTRONG_LTR, spacingmult, spacingadd);
        let trust:boolean;
        if (ellipsize == null || ellipsize == TextUtils.TruncateAt.MARQUEE) {
            this.mEllipsizedWidth = outerwidth;
            this.mEllipsizedStart = 0;
            this.mEllipsizedCount = 0;
            trust = true;
        } else {
            this.replaceWith(TextUtils.ellipsize(source, paint, ellipsizedWidth, ellipsize, true, this), paint, outerwidth, align, spacingmult, spacingadd);
            this.mEllipsizedWidth = ellipsizedWidth;
            trust = false;
        }
        this.init(this.getText(), paint, outerwidth, align, spacingmult, spacingadd, metrics, includepad, trust);
    }

    /* package */
    init(source:String, paint:TextPaint, outerwidth:number, align:Layout.Alignment, spacingmult:number,
         spacingadd:number, metrics:BoringLayout.Metrics, includepad:boolean, trustWidth:boolean):void  {
        let spacing:number;
        if (Object.getPrototypeOf(source) === String.prototype && align == Layout.Alignment.ALIGN_NORMAL) {
            this.mDirect = source.toString();
        } else {
            this.mDirect = null;
        }
        this.mPaint = paint;
        if (includepad) {
            spacing = metrics.bottom - metrics.top;
        } else {
            spacing = metrics.descent - metrics.ascent;
        }
        if (spacingmult != 1 || spacingadd != 0) {
            spacing = Math.floor((spacing * spacingmult + spacingadd + 0.5));
        }
        this.mBottom = spacing;
        if (includepad) {
            this.mDesc = spacing + metrics.top;
        } else {
            this.mDesc = spacing + metrics.ascent;
        }
        if (trustWidth) {
            this.mMax = metrics.width;
        } else {
            /*
             * If we have ellipsized, we have to actually calculate the
             * width because the width that was passed in was for the
             * full text, not the ellipsized form.
             */
            let line:TextLine = TextLine.obtain();
            line.set(paint, source, 0, source.length, Layout.DIR_LEFT_TO_RIGHT, Layout.DIRS_ALL_LEFT_TO_RIGHT, false, null);
            this.mMax = Math.floor(Math.ceil(line.metrics(null)));
            TextLine.recycle(line);
        }
        if (includepad) {
            this.mTopPadding = metrics.top - metrics.ascent;
            this.mBottomPadding = metrics.bottom - metrics.descent;
        }
    }

    /**
     * Returns null if not boring; the width, ascent, and descent in the
     * provided Metrics object (or a new one if the provided one was null)
     * if boring.
     * @hide
     */
    static isBoring(text:String, paint:TextPaint, textDir:TextDirectionHeuristic=TextDirectionHeuristics.FIRSTSTRONG_LTR,
                    metrics:BoringLayout.Metrics=null):BoringLayout.Metrics  {
        let temp:string;
        let length:number = text.length;
        let boring:boolean = true;
        outer: for (let i:number = 0; i < length; i += 500) {
            let j:number = i + 500;
            if (j > length) j = length;
            temp = text.substring(i, j);
            let n:number = j - i;
            for (let a:number = 0; a < n; a++) {
                let c:string = temp[a];
                if (c == '\n' || c == '\t') { // || c.codePointAt(0) >= BoringLayout.FIRST_RIGHT_TO_LEFT) {
                    boring = false;
                    break outer;
                }
            }
            if (textDir != null && textDir.isRtl(temp, 0, n)) {
                boring = false;
                break outer;
            }
        }
        //TextUtils.recycle(temp);
        if (boring && Spanned.isImplements(text) ) {
            let sp:Spanned = <Spanned> text;
            let styles:any[] = sp.getSpans(0, length, ParagraphStyle.type);
            if (styles.length > 0) {
                boring = false;
            }
        }
        if (boring) {
            let fm:BoringLayout.Metrics = metrics;
            if (fm == null) {
                fm = new BoringLayout.Metrics();
            }
            let line:TextLine = TextLine.obtain();
            line.set(paint, text, 0, length, Layout.DIR_LEFT_TO_RIGHT, Layout.DIRS_ALL_LEFT_TO_RIGHT, false, null);
            fm.width = Math.floor(Math.ceil(line.metrics(fm)));
            TextLine.recycle(line);
            return fm;
        } else {
            return null;
        }
    }

    getHeight():number  {
        return this.mBottom;
    }

    getLineCount():number  {
        return 1;
    }

    getLineTop(line:number):number  {
        if (line == 0)
            return 0;
        else
            return this.mBottom;
    }

    getLineDescent(line:number):number  {
        return this.mDesc;
    }

    getLineStart(line:number):number  {
        if (line == 0)
            return 0;
        else
            return this.getText().length;
    }

    getParagraphDirection(line:number):number  {
        return BoringLayout.DIR_LEFT_TO_RIGHT;
    }

    getLineContainsTab(line:number):boolean  {
        return false;
    }

    getLineMax(line:number):number  {
        return this.mMax;
    }

    getLineDirections(line:number):Layout.Directions  {
        return Layout.DIRS_ALL_LEFT_TO_RIGHT;
    }

    getTopPadding():number  {
        return this.mTopPadding;
    }

    getBottomPadding():number  {
        return this.mBottomPadding;
    }

    getEllipsisCount(line:number):number  {
        return this.mEllipsizedCount;
    }

    getEllipsisStart(line:number):number  {
        return this.mEllipsizedStart;
    }

    getEllipsizedWidth():number  {
        return this.mEllipsizedWidth;
    }

    // Override draw so it will be faster.
    draw(c:Canvas, highlight:Path, highlightpaint:Paint, cursorOffset:number):void  {
        if (this.mDirect != null && highlight == null) {
            c.drawText(this.mDirect, 0, this.mBottom - this.mDesc, this.mPaint);
        } else {
            super.draw(c, highlight, highlightpaint, cursorOffset);
        }
    }

    /**
     * Callback for the ellipsizer to report what region it ellipsized.
     */
    ellipsized(start:number, end:number):void  {
        this.mEllipsizedStart = start;
        this.mEllipsizedCount = end - start;
    }

    private static FIRST_RIGHT_TO_LEFT = '֐'.codePointAt(0);

    private mDirect:string;

    //private mPaint:Paint;

    /* package */
    // for Direct
    mBottom:number = 0;
    mDesc:number = 0;

    private mTopPadding:number = 0
    private mBottomPadding:number = 0;

    private mMax:number = 0;

    private mEllipsizedWidth:number = 0;
    private mEllipsizedStart:number = 0;
    private mEllipsizedCount:number = 0;

    private static sTemp:TextPaint = new TextPaint();


}

export module BoringLayout{
export class Metrics extends Paint.FontMetricsInt {

    width:number = 0;

    toString():string  {
        return super.toString() + " width=" + this.width;
    }
}
}

}
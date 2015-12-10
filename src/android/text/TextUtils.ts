/**
 * Created by linfaxin on 15/11/14.
 */
///<reference path="Spanned.ts"/>
///<reference path="style/ReplacementSpan.ts"/>
///<reference path="../../java/lang/System.ts"/>
///<reference path="../../java/lang/StringBuilder.ts"/>
///<reference path="../../android/text/Layout.ts"/>
///<reference path="../../android/text/MeasuredText.ts"/>
///<reference path="../../android/text/Spanned.ts"/>
///<reference path="../../android/text/style/MetricAffectingSpan.ts"/>
///<reference path="../../android/text/TextDirectionHeuristic.ts"/>
///<reference path="../../android/text/TextDirectionHeuristics.ts"/>
///<reference path="../../android/text/TextPaint.ts"/>


module android.text{
    import System = java.lang.System;
    import StringBuilder = java.lang.StringBuilder;
    import MeasuredText = android.text.MeasuredText;
    import Spanned = android.text.Spanned;
    import TextDirectionHeuristic = android.text.TextDirectionHeuristic;
    import TextDirectionHeuristics = android.text.TextDirectionHeuristics;
    import TextPaint = android.text.TextPaint;

    export class TextUtils{

        /**
         * Returns true if the string is null or 0-length.
         * @param str the string to be examined
         * @return true if str is null or zero length
         */
        static isEmpty(str:string|String):boolean  {
            if (str == null || str.length == 0)
                return true;
            else
                return false;
        }


        /** @hide */
        static ALIGNMENT_SPAN:number = 1;

        /** @hide */
        static FIRST_SPAN:number = TextUtils.ALIGNMENT_SPAN;

        /** @hide */
        static FOREGROUND_COLOR_SPAN:number = 2;

        /** @hide */
        static RELATIVE_SIZE_SPAN:number = 3;

        /** @hide */
        static SCALE_X_SPAN:number = 4;

        /** @hide */
        static STRIKETHROUGH_SPAN:number = 5;

        /** @hide */
        static UNDERLINE_SPAN:number = 6;

        /** @hide */
        static STYLE_SPAN:number = 7;

        /** @hide */
        static BULLET_SPAN:number = 8;

        /** @hide */
        static QUOTE_SPAN:number = 9;

        /** @hide */
        static LEADING_MARGIN_SPAN:number = 10;

        /** @hide */
        static URL_SPAN:number = 11;

        /** @hide */
        static BACKGROUND_COLOR_SPAN:number = 12;

        /** @hide */
        static TYPEFACE_SPAN:number = 13;

        /** @hide */
        static SUPERSCRIPT_SPAN:number = 14;

        /** @hide */
        static SUBSCRIPT_SPAN:number = 15;

        /** @hide */
        static ABSOLUTE_SIZE_SPAN:number = 16;

        /** @hide */
        static TEXT_APPEARANCE_SPAN:number = 17;

        /** @hide */
        static ANNOTATION:number = 18;

        /** @hide */
        static SUGGESTION_SPAN:number = 19;

        /** @hide */
        static SPELL_CHECK_SPAN:number = 20;

        /** @hide */
        static SUGGESTION_RANGE_SPAN:number = 21;

        /** @hide */
        static EASY_EDIT_SPAN:number = 22;

        /** @hide */
        static LOCALE_SPAN:number = 23;

        /** @hide */
        static LAST_SPAN:number = TextUtils.LOCALE_SPAN;


        private static EMPTY_STRING_ARRAY:string[] =  [];

        private static ZWNBS_CHAR = String.fromCodePoint(20);

        private static ARAB_SCRIPT_SUBTAG:string = "Arab";

        private static HEBR_SCRIPT_SUBTAG:string = "Hebr";


        static getOffsetBefore(text:String, offset:number):number  {
            if (offset == 0)
                return 0;
            if (offset == 1)
                return 0;
            let c = text.codePointAt(offset - 1);
            if (c >= '?'.codePointAt(0) && c <= '?'.codePointAt(0)) {
                let c1 = text.codePointAt(offset - 2);
                if (c1 >= '?'.codePointAt(0) && c1 <= '?'.codePointAt(0))
                    offset -= 2;
                else
                    offset -= 1;
            } else {
                offset -= 1;
            }
            if (Spanned.isImplements(text)) {
                let spans:android.text.style.ReplacementSpan[] = (<Spanned> text).getSpans<android.text.style.ReplacementSpan>(offset, offset, android.text.style.ReplacementSpan.type);
                for (let i:number = 0; i < spans.length; i++) {
                    let start:number = (<Spanned> text).getSpanStart(spans[i]);
                    let end:number = (<Spanned> text).getSpanEnd(spans[i]);
                    if (start < offset && end > offset)
                        offset = start;
                }
            }
            return offset;
        }

        static getOffsetAfter(text:String, offset:number):number  {
            let len:number = text.length;
            if (offset == len)
                return len;
            if (offset == len - 1)
                return len;
            let c = text.codePointAt(offset);
            if (c >= '?'.codePointAt(0) && c <= '?'.codePointAt(0)) {
                let c1 = text.codePointAt(offset + 1);
                if (c1 >= '?'.codePointAt(0) && c1 <= '?'.codePointAt(0))
                    offset += 2;
                else
                    offset += 1;
            } else {
                offset += 1;
            }
            if (Spanned.isImplements(text)) {
                let spans:android.text.style.ReplacementSpan[] = (<Spanned> text).getSpans<android.text.style.ReplacementSpan>(offset, offset, android.text.style.ReplacementSpan.type);
                for (let i:number = 0; i < spans.length; i++) {
                    let start:number = (<Spanned> text).getSpanStart(spans[i]);
                    let end:number = (<Spanned> text).getSpanEnd(spans[i]);
                    if (start < offset && end > offset)
                        offset = end;
                }
            }
            return offset;
        }


        /**
         * Returns the original text if it fits in the specified width
         * given the properties of the specified Paint,
         * or, if it does not fit, a copy with ellipsis character added
         * at the specified edge or center.
         * If <code>preserveLength</code> is specified, the returned copy
         * will be padded with zero-width spaces to preserve the original
         * length and offsets instead of truncating.
         * If <code>callback</code> is non-null, it will be called to
         * report the start and end of the ellipsized range.
         *
         * @hide
         */
        static ellipsize(text:String, paint:TextPaint, avail:number, where:TextUtils.TruncateAt, preserveLength=false,
                         callback:TextUtils.EllipsizeCallback=null, textDir=TextDirectionHeuristics.FIRSTSTRONG_LTR,
                         ellipsis = undefined):String  {
            ellipsis = ellipsis || (where == TextUtils.TruncateAt.END_SMALL? android.text.Layout.ELLIPSIS_TWO_DOTS[0] : android.text.Layout.ELLIPSIS_NORMAL[0]);
            let len:number = text.length;
            let mt:MeasuredText = MeasuredText.obtain();
            try {
                let width:number = TextUtils.setPara(mt, paint, text, 0, text.length, textDir);
                if (width <= avail) {
                    if (callback != null) {
                        callback.ellipsized(0, 0);
                    }
                    return text;
                }
                // XXX assumes ellipsis string does not require shaping and
                // is unaffected by style
                let ellipsiswid:number = paint.measureText(ellipsis);
                avail -= ellipsiswid;
                let left:number = 0;
                let right:number = len;
                if (avail < 0) {
                    // it all goes
                } else if (where == TextUtils.TruncateAt.START) {
                    right = len - mt.breakText(len, false, avail);
                } else if (where == TextUtils.TruncateAt.END || where == TextUtils.TruncateAt.END_SMALL) {
                    left = mt.breakText(len, true, avail);
                } else {
                    right = len - mt.breakText(len, false, avail / 2);
                    avail -= mt.measure(right, len);
                    left = mt.breakText(right, true, avail);
                }
                if (callback != null) {
                    callback.ellipsized(left, right);
                }
                let buf:string[] = mt.mChars.split('');
                let sp:Spanned = Spanned.isImplements(text) ? <Spanned> text : null;
                let remaining:number = len - (right - left);
                if (preserveLength) {
                    if (remaining > 0) {
                        // else eliminate the ellipsis too
                        buf[left++] = ellipsis.charAt(0);
                    }
                    for (let i:number = left; i < right; i++) {
                        buf[i] = TextUtils.ZWNBS_CHAR;
                    }
                    let s:string = buf.join('');
                    //if (sp == null) {//TODO when span impl
                        return s;
                    //}
                    //let ss:SpannableString = new SpannableString(s);
                    //TextUtils.copySpansFrom(sp, 0, len, any.class, ss, 0);
                    //return ss;
                }
                if (remaining == 0) {
                    return "";
                }
                //if (sp == null) {//TODO when span impl
                    let sb:StringBuilder = new StringBuilder(remaining + ellipsis.length());
                    sb.append(buf.join('').substr(0, left));
                    sb.append(ellipsis);
                    sb.append(buf.join('').substr(right, len - right));
                    return sb.toString();
                //}
                //let ssb:SpannableStringBuilder = new SpannableStringBuilder();
                //ssb.append(text, 0, left);
                //ssb.append(ellipsis);
                //ssb.append(text, right, len);
                //return ssb;
            } finally {
                MeasuredText.recycle(mt);
            }
        }


        private static setPara(mt:MeasuredText, paint:TextPaint, text:String, start:number, end:number, textDir:TextDirectionHeuristic):number  {
            mt.setPara(text, start, end, textDir);
            let width:number;
            let sp:Spanned = Spanned.isImplements(text) ? <Spanned> text : null;
            let len:number = end - start;
            if (sp == null) {
                width = mt.addStyleRun(paint, len, null);
            } else {
                width = 0;
                let spanEnd:number;
                for (let spanStart:number = 0; spanStart < len; spanStart = spanEnd) {
                    spanEnd = sp.nextSpanTransition(spanStart, len, android.text.style.MetricAffectingSpan.type);
                    let spans:android.text.style.MetricAffectingSpan[] = sp.getSpans<android.text.style.MetricAffectingSpan>(spanStart, spanEnd, android.text.style.MetricAffectingSpan.type);
                    spans = TextUtils.removeEmptySpans(spans, sp, android.text.style.MetricAffectingSpan.type);
                    width += mt.addStyleRun(paint, spans, spanEnd - spanStart, null);
                }
            }
            return width;
        }

        /**
         * Removes empty spans from the <code>spans</code> array.
         *
         * When parsing a Spanned using {@link Spanned#nextSpanTransition(int, int, Class)}, empty spans
         * will (correctly) create span transitions, and calling getSpans on a slice of text bounded by
         * one of these transitions will (correctly) include the empty overlapping span.
         *
         * However, these empty spans should not be taken into account when layouting or rendering the
         * string and this method provides a way to filter getSpans' results accordingly.
         *
         * @param spans A list of spans retrieved using {@link Spanned#getSpans(int, int, Class)} from
         * the <code>spanned</code>
         * @param spanned The Spanned from which spans were extracted
         * @return A subset of spans where empty spans ({@link Spanned#getSpanStart(Object)}  ==
         * {@link Spanned#getSpanEnd(Object)} have been removed. The initial order is preserved
         * @hide
         */
        static removeEmptySpans<T> (spans:T[], spanned:Spanned, klass:any):T[]  {
            let copy:T[] = null;
            let count:number = 0;
            for (let i:number = 0; i < spans.length; i++) {
                const span:T = spans[i];
                const start:number = spanned.getSpanStart(span);
                const end:number = spanned.getSpanEnd(span);
                if (start == end) {
                    if (copy == null) {
                        copy = new Array<T>(spans.length - 1);
                        System.arraycopy(spans, 0, copy, 0, i);
                        count = i;
                    }
                } else {
                    if (copy != null) {
                        copy[count] = span;
                        count++;
                    }
                }
            }
            if (copy != null) {
                let result:T[] = new Array<T>(count);
                System.arraycopy(copy, 0, result, 0, count);
                return result;
            } else {
                return spans;
            }
        }

        /**
         * pack to a array, because javascript will do '<<' as int range
         * (Pack 2 int values into a long, useful as a return value for a range)
         * @see #unpackRangeStartFromLong(long)
         * @see #unpackRangeEndFromLong(long)
         * @hide
         */
        static packRangeInLong(start:number, end:number):number[]  {
            return [start, end];
        }

        /**
         * Get the start value from a range packed in a long by {@link #packRangeInLong(int, int)}
         * @see #unpackRangeEndFromLong(long)
         * @see #packRangeInLong(int, int)
         * @hide
         */
        static unpackRangeStartFromLong(range:number[]):number  {
            return range[0] || 0;
        }

        /**
         * Get the end value from a range packed in a long by {@link #packRangeInLong(int, int)}
         * @see #unpackRangeStartFromLong(long)
         * @see #packRangeInLong(int, int)
         * @hide
         */
        static unpackRangeEndFromLong(range:number[]):number  {
            return range[1] || 0;
        }
    }

    export module TextUtils{

        export enum TruncateAt {

            START /*() {
             }
             */, MIDDLE /*() {
             }
             */, END /*() {
             }
             */, MARQUEE /*() {
             }
             */, /**
             * @hide
             */
            END_SMALL /*() {
         }
         */ /*;
         */}


        export interface EllipsizeCallback {

            /**
             * This method is called to report that the specified region of
             * text was ellipsized away by a call to {@link #ellipsize}.
             */
            ellipsized(start:number, end:number):void ;
        }
    }
}
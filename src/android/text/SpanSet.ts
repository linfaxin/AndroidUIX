/*
 * Copyright (C) 2012 The Android Open Source Project
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

///<reference path="../../android/text/Spanned.ts"/>

module android.text {
import Spanned = android.text.Spanned;
/**
 * A cached set of spans. Caches the result of {@link Spanned#getSpans(int, int, Class)} and then
 * provides faster access to {@link Spanned#nextSpanTransition(int, int, Class)}.
 *
 * Fields are left public for a convenient direct access.
 *
 * Note that empty spans are ignored by this class.
 * @hide
 */
export class SpanSet<E> {

    private classType:any;

    numberOfSpans:number = 0;

    spans:E[];

    spanStarts:number[];

    spanEnds:number[];

    spanFlags:number[];

    constructor(type:any) {
        this.classType = type;
        this.numberOfSpans = 0;
    }

    init(spanned:Spanned, start:number, limit:number):void  {
        const allSpans:E[] = spanned.getSpans<E>(start, limit, this.classType);
        const length:number = allSpans.length;
        if (length > 0 && (this.spans == null || this.spans.length < length)) {
            // These arrays may end up being too large because of the discarded empty spans
            this.spans = new Array<E>(length);//<E[]> Array.newInstance(this.classType, length);
            this.spanStarts = androidui.util.ArrayCreator.newNumberArray(length);
            this.spanEnds = androidui.util.ArrayCreator.newNumberArray(length);
            this.spanFlags = androidui.util.ArrayCreator.newNumberArray(length);
        }
        this.numberOfSpans = 0;
        for (let i:number = 0; i < length; i++) {
            const span:E = allSpans[i];
            const spanStart:number = spanned.getSpanStart(span);
            const spanEnd:number = spanned.getSpanEnd(span);
            if (spanStart == spanEnd)
                continue;
            const spanFlag:number = spanned.getSpanFlags(span);
            this.spans[this.numberOfSpans] = span;
            this.spanStarts[this.numberOfSpans] = spanStart;
            this.spanEnds[this.numberOfSpans] = spanEnd;
            this.spanFlags[this.numberOfSpans] = spanFlag;
            this.numberOfSpans++;
        }
    }

    /**
     * Returns true if there are spans intersecting the given interval.
     * @param end must be strictly greater than start
     */
    hasSpansIntersecting(start:number, end:number):boolean  {
        for (let i:number = 0; i < this.numberOfSpans; i++) {
            // equal test is valid since both intervals are not empty by construction
            if (this.spanStarts[i] >= end || this.spanEnds[i] <= start)
                continue;
            return true;
        }
        return false;
    }

    /**
     * Similar to {@link Spanned#nextSpanTransition(int, int, Class)}
     */
    getNextTransition(start:number, limit:number):number  {
        for (let i:number = 0; i < this.numberOfSpans; i++) {
            const spanStart:number = this.spanStarts[i];
            const spanEnd:number = this.spanEnds[i];
            if (spanStart > start && spanStart < limit)
                limit = spanStart;
            if (spanEnd > start && spanEnd < limit)
                limit = spanEnd;
        }
        return limit;
    }

    /**
     * Removes all internal references to the spans to avoid memory leaks.
     */
    recycle():void  {
        // The spans array is guaranteed to be not null when numberOfSpans is > 0
        for (let i:number = 0; i < this.numberOfSpans; i++) {
            // prevent a leak: no reference kept when TextLine is recycled
            this.spans[i] = null;
        }
    }
}
}
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

module android.text {
/**
 * This is the interface for text that has markup objects attached to
 * ranges of it.  Not all text classes have mutable markup or text;
 * see {@link Spannable} for mutable markup and {@link Editable} for
 * mutable text.
 */
export interface Spanned extends String {

    /**
     * Return an array of the markup objects attached to the specified
     * slice of this CharSequence and whose type is the specified type
     * or a subclass of it.  Specify Object.class for the type if you
     * want all the objects regardless of type.
     */
    getSpans<T> (start:number, end:number, type:any):T[] ;

    /**
     * Return the beginning of the range of text to which the specified
     * markup object is attached, or -1 if the object is not attached.
     */
    getSpanStart(tag:any):number ;

    /**
     * Return the end of the range of text to which the specified
     * markup object is attached, or -1 if the object is not attached.
     */
    getSpanEnd(tag:any):number ;

    /**
     * Return the flags that were specified when {@link Spannable#setSpan} was
     * used to attach the specified markup object, or 0 if the specified
     * object has not been attached.
     */
    getSpanFlags(tag:any):number ;

    /**
     * Return the first offset greater than or equal to <code>start</code>
     * where a markup object of class <code>type</code> begins or ends,
     * or <code>limit</code> if there are no starts or ends greater than or
     * equal to <code>start</code> but less than <code>limit</code>.  Specify
     * <code>null</code> or Object.class for the type if you want every
     * transition regardless of type.
     */
    nextSpanTransition(start:number, limit:number, type:any):number ;
}

export module Spanned{
    export function isImplements(obj){
        return obj && obj['getSpans'] && obj['getSpanStart'] && obj['getSpanEnd']
            && obj['getSpanFlags'] && obj['nextSpanTransition'];
    }
    /**
     * Bitmask of bits that are relevent for controlling point/mark behavior
     * of spans.
     *
     * MARK and POINT are conceptually located <i>between</i> two adjacent characters.
     * A MARK is "attached" to the character before, while a POINT will stick to the character
     * after. The insertion cursor is conceptually located between the MARK and the POINT.
     *
     * As a result, inserting a new character between a MARK and a POINT will leave the MARK
     * unchanged, while the POINT will be shifted, now located after the inserted character and
     * still glued to the same character after it.
     *
     * Depending on whether the insertion happens at the beginning or the end of a span, the span
     * will hence be expanded to <i>include</i> the new character (when the span is using a MARK at
     * its beginning or a POINT at its end) or it will be <i>excluded</i>.
     *
     * Note that <i>before</i> and <i>after</i> here refer to offsets in the String, which are
     * independent from the visual representation of the text (left-to-right or right-to-left).
     */
export var SPAN_POINT_MARK_MASK:number = 0x33;/**
     * 0-length spans with type SPAN_MARK_MARK behave like text marks:
     * they remain at their original offset when text is inserted
     * at that offset. Conceptually, the text is added after the mark.
     */
export var SPAN_MARK_MARK:number = 0x11;/**
     * SPAN_MARK_POINT is a synonym for {@link #SPAN_INCLUSIVE_INCLUSIVE}.
     */
export var SPAN_MARK_POINT:number = 0x12;/**
     * SPAN_POINT_MARK is a synonym for {@link #SPAN_EXCLUSIVE_EXCLUSIVE}.
     */
export var SPAN_POINT_MARK:number = 0x21;/**
     * 0-length spans with type SPAN_POINT_POINT behave like cursors:
     * they are pushed forward by the length of the insertion when text
     * is inserted at their offset.
     * The text is conceptually inserted before the point.
     */
export var SPAN_POINT_POINT:number = 0x22;/**
     * SPAN_PARAGRAPH behaves like SPAN_INCLUSIVE_EXCLUSIVE
     * (SPAN_MARK_MARK), except that if either end of the span is
     * at the end of the buffer, that end behaves like _POINT
     * instead (so SPAN_INCLUSIVE_INCLUSIVE if it starts in the
     * middle and ends at the end, or SPAN_EXCLUSIVE_INCLUSIVE
     * if it both starts and ends at the end).
     * <p>
     * Its endpoints must be the start or end of the buffer or
     * immediately after a \n character, and if the \n
     * that anchors it is deleted, the endpoint is pulled to the
     * next \n that follows in the buffer (or to the end of
     * the buffer).
     */
export var SPAN_PARAGRAPH:number = 0x33;/**
     * Non-0-length spans of type SPAN_INCLUSIVE_EXCLUSIVE expand
     * to include text inserted at their starting point but not at their
     * ending point.  When 0-length, they behave like marks.
     */
export var SPAN_INCLUSIVE_EXCLUSIVE:number = Spanned.SPAN_MARK_MARK;/**
     * Spans of type SPAN_INCLUSIVE_INCLUSIVE expand
     * to include text inserted at either their starting or ending point.
     */
export var SPAN_INCLUSIVE_INCLUSIVE:number = Spanned.SPAN_MARK_POINT;/**
     * Spans of type SPAN_EXCLUSIVE_EXCLUSIVE do not expand
     * to include text inserted at either their starting or ending point.
     * They can never have a length of 0 and are automatically removed
     * from the buffer if all the text they cover is removed.
     */
export var SPAN_EXCLUSIVE_EXCLUSIVE:number = Spanned.SPAN_POINT_MARK;/**
     * Non-0-length spans of type SPAN_EXCLUSIVE_INCLUSIVE expand
     * to include text inserted at their ending point but not at their
     * starting point.  When 0-length, they behave like points.
     */
export var SPAN_EXCLUSIVE_INCLUSIVE:number = Spanned.SPAN_POINT_POINT;/**
     * This flag is set on spans that are being used to apply temporary
     * styling information on the composing text of an input method, so that
     * they can be found and removed when the composing text is being
     * replaced.
     */
export var SPAN_COMPOSING:number = 0x100;/**
     * This flag will be set for intermediate span changes, meaning there
     * is guaranteed to be another change following it.  Typically it is
     * used for {@link Selection} which automatically uses this with the first
     * offset it sets when updating the selection.
     */
export var SPAN_INTERMEDIATE:number = 0x200;/**
     * The bits numbered SPAN_USER_SHIFT and above are available
     * for callers to use to store scalar data associated with their
     * span object.
     */
export var SPAN_USER_SHIFT:number = 24;/**
     * The bits specified by the SPAN_USER bitfield are available
     * for callers to use to store scalar data associated with their
     * span object.
     */
export var SPAN_USER:number = 0xFFFFFFFF << Spanned.SPAN_USER_SHIFT;/**
     * The bits numbered just above SPAN_PRIORITY_SHIFT determine the order
     * of change notifications -- higher numbers go first.  You probably
     * don't need to set this; it is used so that when text changes, the
     * text layout gets the chance to update itself before any other
     * callbacks can inquire about the layout of the text.
     */
export var SPAN_PRIORITY_SHIFT:number = 16;/**
     * The bits specified by the SPAN_PRIORITY bitmap determine the order
     * of change notifications -- higher numbers go first.  You probably
     * don't need to set this; it is used so that when text changes, the
     * text layout gets the chance to update itself before any other
     * callbacks can inquire about the layout of the text.
     */
export var SPAN_PRIORITY:number = 0xFF << Spanned.SPAN_PRIORITY_SHIFT;}

}
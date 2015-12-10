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

///<reference path="../../android/text/Spanned.ts"/>
///<reference path="../../android/text/TextWatcher.ts"/>

module android.text {
import Spanned = android.text.Spanned;
import TextWatcher = android.text.TextWatcher;
/**
 * This is the interface for text to which markup objects can be
 * attached and detached.  Not all Spannable classes have mutable text;
 * see {@link Editable} for that.
 */
export interface Spannable extends Spanned {

    /**
     * Attach the specified markup object to the range <code>start&hellip;end</code>
     * of the text, or move the object to that range if it was already
     * attached elsewhere.  See {@link Spanned} for an explanation of
     * what the flags mean.  The object can be one that has meaning only
     * within your application, or it can be one that the text system will
     * use to affect text display or behavior.  Some noteworthy ones are
     * the subclasses of {@link android.text.style.CharacterStyle} and
     * {@link android.text.style.ParagraphStyle}, and
     * {@link android.text.TextWatcher} and
     * {@link android.text.SpanWatcher}.
     */
    setSpan(what:any, start:number, end:number, flags:number):void ;

    /**
     * Remove the specified object from the range of text to which it
     * was attached, if any.  It is OK to remove an object that was never
     * attached in the first place.
     */
    removeSpan(what:any):void ;


}

export module Spannable{
    export function isImpl(obj):boolean {
        return obj && obj['setSpan'] && obj['removeSpan'];
    }
/**
     * Factory used by TextView to create new Spannables.  You can subclass
     * it to provide something other than SpannableString.
     */
export class Factory {

    private static sInstance:Spannable.Factory = new Factory();

    /**
         * Returns the standard Spannable Factory.
         */
    static getInstance():Spannable.Factory  {
        return Factory.sInstance;
    }

    /**
         * Returns a new SpannableString from the specified CharSequence.
         * You can override this to provide a different kind of Spannable.
         */
    newSpannable(source:String):Spannable  {
        return <any>source;//FIXME when SpannableString impl
        //return new SpannableString(source);
    }
}
}

}
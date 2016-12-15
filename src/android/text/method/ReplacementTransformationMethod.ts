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

///<reference path="../../../android/graphics/Rect.ts"/>
///<reference path="../../../android/text/Spannable.ts"/>
///<reference path="../../../android/text/Spanned.ts"/>
///<reference path="../../../android/text/TextUtils.ts"/>
///<reference path="../../../android/view/View.ts"/>
///<reference path="../../../android/text/method/TransformationMethod.ts"/>

module android.text.method {
import Rect = android.graphics.Rect;
import Spannable = android.text.Spannable;
import Spanned = android.text.Spanned;
import TextUtils = android.text.TextUtils;
import View = android.view.View;
import TransformationMethod = android.text.method.TransformationMethod;
/**
 * This transformation method causes the characters in the {@link #getOriginal}
 * array to be replaced by the corresponding characters in the
 * {@link #getReplacement} array.
 */
export abstract class ReplacementTransformationMethod implements TransformationMethod {

    /**
     * Returns the list of characters that are to be replaced by other
     * characters when displayed.
     */
    protected abstract getOriginal():string[] ;

    /**
     * Returns a parallel array of replacement characters for the ones
     * that are to be replaced.
     */
    protected abstract getReplacement():string[] ;

    /**
     * Returns a CharSequence that will mirror the contents of the
     * source CharSequence but with the characters in {@link #getOriginal}
     * replaced by ones from {@link #getReplacement}.
     */
    getTransformation(source:String, v:View):String  {
        let original:string[] = this.getOriginal();
        let replacement:string[] = this.getReplacement();
        /*
         * Short circuit for faster display if the text will never change.
         */
        //if (!(source instanceof Editable)) {
            /*
             * Check whether the text does not contain any of the
             * source characters so can be used unchanged.
             */
            let doNothing:boolean = true;
            let n:number = original.length;
            for (let i:number = 0; i < n; i++) {
                if (source.indexOf(original[i]) >= 0) {
                    doNothing = false;
                    break;
                }
            }
            if (doNothing) {
                return source;
            }
            //if (!(source instanceof Spannable)) {
                /*
                 * The text contains some of the source characters,
                 * but they can be flattened out now instead of
                 * at display time.
                 */
                //if (source instanceof Spanned) {
                //    return new SpannedString(new ReplacementTransformationMethod.SpannedReplacementCharSequence(<Spanned> source, original, replacement));
                //} else {
                    return new ReplacementTransformationMethod.ReplacementCharSequence(source, original, replacement).toString();
                //}
            //}
        //}
        //if (source instanceof Spanned) {
        //    return new ReplacementTransformationMethod.SpannedReplacementCharSequence(<Spanned> source, original, replacement);
        //} else {

            //return new ReplacementTransformationMethod.ReplacementCharSequence(source, original, replacement);

        //}
    }

    onFocusChanged(view:View, sourceText:String, focused:boolean, direction:number, previouslyFocusedRect:Rect):void  {
    // This callback isn't used.
    }




}

export module ReplacementTransformationMethod{
export class ReplacementCharSequence extends String {

    private mOriginal:string[];
    private mReplacement:string[];

    constructor(source:String, original:string[], replacement:string[]) {
        super(source);
        this.mSource = source;
        this.mOriginal = original;
        this.mReplacement = replacement;
    }

    charAt(i:number):string  {
        let c:string = this.mSource.charAt(i);
        let n:number = this.mOriginal.length;
        for (let j:number = 0; j < n; j++) {
            if (c == this.mOriginal[j]) {
                c = this.mReplacement[j];
            }
        }
        return c;
    }

    toString():string  {
        return this.startReplace(0, this.length);
    }


    substr(from:number, length:number):string {
        return this.startReplace(from, from+length);
    }

    substring(start:number, end:number):string {
        return this.startReplace(start, end);
    }

    startReplace(start:number, end:number):string  {
        let dest:string[] = this.mSource.substring(start, end).split('');
        let offend:number = end - start;
        let n:number = this.mOriginal.length;
        for (let i = 0; i < offend; i++) {
            let c:string = dest[i];
            for (let j:number = 0; j < n; j++) {
                if (c == this.mOriginal[j]) {
                    dest[i] = this.mReplacement[j];
                }
            }
        }
        return dest.join('');
    }

    private mSource:String;
}
}

}
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
///<reference path="../../../android/view/View.ts"/>

module android.text.method {
import Rect = android.graphics.Rect;
import View = android.view.View;
/**
 * TextView uses TransformationMethods to do things like replacing the
 * characters of passwords with dots, or keeping the newline characters
 * from causing line breaks in single-line text fields.
 */
export interface TransformationMethod {

    /**
     * Returns a CharSequence that is a transformation of the source text --
     * for example, replacing each character with a dot in a password field.
     * Beware that the returned text must be exactly the same length as
     * the source text, and that if the source text is Editable, the returned
     * text must mirror it dynamically instead of doing a one-time copy.
     */
    getTransformation(source:String, view:View):String ;

    /**
     * This method is called when the TextView that uses this
     * TransformationMethod gains or loses focus.
     */
    onFocusChanged(view:View, sourceText:String, focused:boolean, direction:number, previouslyFocusedRect:Rect):void ;
}
    export module TransformationMethod{
        export function isImpl(obj):boolean {
            return obj['getTransformation'] && obj['onFocusChanged'];
        }
    }
}
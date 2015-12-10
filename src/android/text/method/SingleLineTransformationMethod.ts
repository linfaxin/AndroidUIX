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
///<reference path="../../../android/text/method/ReplacementTransformationMethod.ts"/>
///<reference path="../../../android/text/method/TransformationMethod.ts"/>

module android.text.method {
import Rect = android.graphics.Rect;
import Spannable = android.text.Spannable;
import Spanned = android.text.Spanned;
import TextUtils = android.text.TextUtils;
import View = android.view.View;
import ReplacementTransformationMethod = android.text.method.ReplacementTransformationMethod;
import TransformationMethod = android.text.method.TransformationMethod;
/**
 * This transformation method causes any newline characters (\n) to be
 * displayed as spaces instead of causing line breaks, and causes
 * carriage return characters (\r) to have no appearance.
 */
export class SingleLineTransformationMethod extends ReplacementTransformationMethod {

    private static ORIGINAL:string[] =  [ '\n', '\r' ];

    private static REPLACEMENT:string[] =  [ ' ', '﻿' ];

    /**
     * The characters to be replaced are \n and \r.
     */
    protected getOriginal():string[]  {
        return SingleLineTransformationMethod.ORIGINAL;
    }

    /**
     * The character \n is replaced with is space;
     * the character \r is replaced with is FEFF (zero width space).
     */
    protected getReplacement():string[]  {
        return SingleLineTransformationMethod.REPLACEMENT;
    }

    static getInstance():SingleLineTransformationMethod  {
        if (SingleLineTransformationMethod.sInstance != null)
            return SingleLineTransformationMethod.sInstance;
        SingleLineTransformationMethod.sInstance = new SingleLineTransformationMethod();
        return SingleLineTransformationMethod.sInstance;
    }

    private static sInstance:SingleLineTransformationMethod;
}
}
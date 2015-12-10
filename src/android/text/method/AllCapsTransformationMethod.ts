/*
 * Copyright (C) 2011 The Android Open Source Project
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
///<reference path="../../../android/util/Log.ts"/>
///<reference path="../../../android/view/View.ts"/>
///<reference path="../../../android/text/method/TransformationMethod.ts"/>
///<reference path="../../../android/text/method/TransformationMethod2.ts"/>

module android.text.method {
import Rect = android.graphics.Rect;
import Log = android.util.Log;
import View = android.view.View;
import TransformationMethod = android.text.method.TransformationMethod;
import TransformationMethod2 = android.text.method.TransformationMethod2;
/**
 * Transforms source text into an ALL CAPS string, locale-aware.
 *
 * @hide
 */
export class AllCapsTransformationMethod implements TransformationMethod2 {

    private static TAG:string = "AllCapsTransformationMethod";

    private mEnabled:boolean;


    constructor(context?:any) {
    }

    getTransformation(source:String, view:View):String  {
        if (this.mEnabled) {
            return source != null ? source.toLocaleUpperCase() : null;
        }
        Log.w(AllCapsTransformationMethod.TAG, "Caller did not enable length changes; not transforming text");
        return source;
    }

    onFocusChanged(view:View, sourceText:String, focused:boolean, direction:number, previouslyFocusedRect:Rect):void  {
    }

    setLengthChangesAllowed(allowLengthChanges:boolean):void  {
        this.mEnabled = allowLengthChanges;
    }
}
}
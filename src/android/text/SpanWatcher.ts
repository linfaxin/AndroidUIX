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

///<reference path="../../android/text/Spannable.ts"/>

module android.text {
import Spannable = android.text.Spannable;
/**
 * When an object of this type is attached to a Spannable, its methods
 * will be called to notify it that other markup objects have been
 * added, changed, or removed.
 */
export interface SpanWatcher {

    /**
     * This method is called to notify you that the specified object
     * has been attached to the specified range of the text.
     */
    onSpanAdded(text:Spannable, what:any, start:number, end:number):void ;

    /**
     * This method is called to notify you that the specified object
     * has been detached from the specified range of the text.
     */
    onSpanRemoved(text:Spannable, what:any, start:number, end:number):void ;

    /**
     * This method is called to notify you that the specified object
     * has been relocated from the range <code>ostart&hellip;oend</code>
     * to the new range <code>nstart&hellip;nend</code> of the text.
     */
    onSpanChanged(text:Spannable, what:any, ostart:number, oend:number, nstart:number, nend:number):void ;
}
}
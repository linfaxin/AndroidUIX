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

///<reference path="../../../android/graphics/Paint.ts"/>
///<reference path="../../../android/graphics/Canvas.ts"/>
///<reference path="../../../android/text/style/ParagraphStyle.ts"/>

module android.text.style {
    import Paint = android.graphics.Paint;
    import Canvas = android.graphics.Canvas;
    import ParagraphStyle = android.text.style.ParagraphStyle;
    export interface LineBackgroundSpan extends ParagraphStyle {

        drawBackground(c:Canvas, p:Paint, left:number, right:number, top:number, baseline:number, bottom:number,
                       text:String, start:number, end:number, lnum:number):void ;
    }

    export module LineBackgroundSpan{
        export var type = Symbol();
    }
}
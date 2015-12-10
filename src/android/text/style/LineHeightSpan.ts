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
///<reference path="../../../android/text/Layout.ts"/>
///<reference path="../../../android/text/TextPaint.ts"/>
///<reference path="../../../android/text/style/ParagraphStyle.ts"/>
///<reference path="../../../android/text/style/WrapTogetherSpan.ts"/>

module android.text.style {
    import Paint = android.graphics.Paint;
    import Canvas = android.graphics.Canvas;
    import Layout = android.text.Layout;
    import TextPaint = android.text.TextPaint;
    import ParagraphStyle = android.text.style.ParagraphStyle;
    import WrapTogetherSpan = android.text.style.WrapTogetherSpan;

    export interface LineHeightSpan extends ParagraphStyle, WrapTogetherSpan {
        chooseHeight(text:String, start:number, end:number, spanstartv:number, v:number, fm:Paint.FontMetricsInt):void ;
    }

    export module LineHeightSpan {
        export var type = Symbol();
        export interface WithDensity extends LineHeightSpan {
            chooseHeight(text:String, start:number, end:number, spanstartv:number, v:number, fm:Paint.FontMetricsInt, paint?:TextPaint):void ;
        }
    }

}
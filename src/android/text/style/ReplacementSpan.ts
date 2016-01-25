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
///<reference path="../../../android/text/TextPaint.ts"/>
///<reference path="../../../android/text/style/MetricAffectingSpan.ts"/>

module android.text.style {
import Paint = android.graphics.Paint;
import Canvas = android.graphics.Canvas;
import TextPaint = android.text.TextPaint;
import MetricAffectingSpan = android.text.style.MetricAffectingSpan;

export abstract class ReplacementSpan extends MetricAffectingSpan {
    static type = Symbol();
    mType = ReplacementSpan.type;

    abstract getSize(paint:Paint, text:String, start:number, end:number, fm:Paint.FontMetricsInt):number ;

    abstract draw(canvas:Canvas, text:String, start:number, end:number, x:number, top:number, y:number, bottom:number, paint:Paint):void ;

    /**
     * This method does nothing, since ReplacementSpans are measured
     * explicitly instead of affecting Paint properties.
     */
    updateMeasureState(p:TextPaint):void  {
    }

    /**
     * This method does nothing, since ReplacementSpans are drawn
     * explicitly instead of affecting Paint properties.
     */
    updateDrawState(ds:TextPaint):void  {
    }
}
}
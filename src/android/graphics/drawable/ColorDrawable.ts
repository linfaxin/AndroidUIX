/*
 * Copyright (C) 2008 The Android Open Source Project
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

///<reference path="Drawable.ts"/>
///<reference path="../Canvas.ts"/>
///<reference path="../Paint.ts"/>

module android.graphics.drawable{
    /**
     * A specialized Drawable that fills the Canvas with a specified color.
     * Note that a ColorDrawable ignores the ColorFilter.
     *
     * <p>It can be defined in an XML file with the <code>&lt;color></code> element.</p>
     *
     * @attr ref android.R.styleable#ColorDrawable_color
     */
    export class ColorDrawable extends Drawable{
        private mState:ColorState;
        private mMutated = false;
        private mPaint = new Paint();

        /**
         * Creates a new ColorDrawable with the specified color.
         *
         * @param color The color to draw.
         */
        constructor(color?:number){
            super();
            this.mState = new ColorState();
            if(color!==undefined){
                this.setColor(color);
            }
        }
        _setStateCopyFrom(state:any){
            this.mState = new ColorState(<ColorState>state);
        }
        /**
         * A mutable BitmapDrawable still shares its Bitmap with any other Drawable
         * that comes from the same resource.
         *
         * @return This drawable.
         */
        mutate():Drawable {
            if (!this.mMutated && super.mutate() == this) {
                this.mState = new ColorState(this.mState);
                this.mMutated = true;
            }
            return this;
        }
        draw(canvas:Canvas) {
            if ((this.mState.mUseColor >>> 24) != 0) {
                this.mPaint.setColor(this.mState.mUseColor);
                canvas.drawRect(this.getBounds(), this.mPaint);
            }
        }

        /**
         * Gets the drawable's color value.
         *
         * @return int The color to draw.
         */
        getColor():number {
            return this.mState.mUseColor;
        }

        /**
         * Sets the drawable's color value. This action will clobber the results of prior calls to
         * {@link #setAlpha(int)} on this object, which side-affected the underlying color.
         *
         * @param color The color to draw.
         */
        setColor(color:number) {
            if (this.mState.mBaseColor != color || this.mState.mUseColor != color) {
                this.invalidateSelf();
                this.mState.mBaseColor = this.mState.mUseColor = color;
            }
        }

        /**
         * Returns the alpha value of this drawable's color.
         *
         * @return A value between 0 and 255.
         */
        getAlpha():number {
            return this.mState.mUseColor >>> 24;
        }

        /**
         * Sets the color's alpha value.
         *
         * @param alpha The alpha value to set, between 0 and 255.
         */
        setAlpha(alpha:number) {
            alpha += alpha >> 7;   // make it 0..256
            let baseAlpha = this.mState.mBaseColor >>> 24;
            let useAlpha = baseAlpha * alpha >> 8;
            let oldUseColor = this.mState.mUseColor;
            this.mState.mUseColor = (this.mState.mBaseColor << 8 >>> 8) | (useAlpha << 24);
            if (oldUseColor != this.mState.mUseColor) {
                this.invalidateSelf();
            }
        }
        getOpacity():number {
            switch (this.mState.mUseColor >>> 24) {
                case 255:
                    return PixelFormat.OPAQUE;
                case 0:
                    return PixelFormat.TRANSPARENT;
            }
            return PixelFormat.TRANSLUCENT;
        }


        inflate(r:android.content.res.Resources, parser:HTMLElement):void {
            super.inflate(r, parser);

            const a = r.obtainAttributes(parser);
            let state = this.mState;
            state.mBaseColor = a.getColor("color", state.mBaseColor);
            state.mUseColor = state.mBaseColor;
            a.recycle();
        }

        getConstantState():Drawable.ConstantState {
            return this.mState;
        }

    }


    class ColorState implements Drawable.ConstantState{

        mBaseColor = 0;
        mUseColor = 0;
        constructor(state?:ColorState){
            if (state != null) {
                this.mBaseColor = state.mBaseColor;
                this.mUseColor = state.mUseColor;
            }
        }

        newDrawable():Drawable {
            let c =  new ColorDrawable();
            c._setStateCopyFrom(this);
            return c;
        }
    }
}
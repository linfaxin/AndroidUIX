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

///<reference path="../../../android/graphics/Matrix.ts"/>
///<reference path="../../../java/lang/StringBuilder.ts"/>
///<reference path="../../../android/view/animation/Animation.ts"/>

module android.view.animation {
import Matrix = android.graphics.Matrix;
import StringBuilder = java.lang.StringBuilder;
import Animation = android.view.animation.Animation;
/**
 * Defines the transformation to be applied at
 * one point in time of an Animation.
 *
 */
export class Transformation {

    /**
     * Indicates a transformation that has no effect (alpha = 1 and identity matrix.)
     */
    static TYPE_IDENTITY:number = 0x0;

    /**
     * Indicates a transformation that applies an alpha only (uses an identity matrix.)
     */
    static TYPE_ALPHA:number = 0x1;

    /**
     * Indicates a transformation that applies a matrix only (alpha = 1.)
     */
    static TYPE_MATRIX:number = 0x2;

    /**
     * Indicates a transformation that applies an alpha and a matrix.
     */
    static TYPE_BOTH:number = Transformation.TYPE_ALPHA | Transformation.TYPE_MATRIX;

    protected mMatrix:Matrix;

    protected mAlpha:number = 0;

    protected mTransformationType:number = 0;

    /**
     * Creates a new transformation with alpha = 1 and the identity matrix.
     */
    constructor( ) {
        this.clear();
    }

    /**
     * Reset the transformation to a state that leaves the object
     * being animated in an unmodified state. The transformation type is
     * {@link #TYPE_BOTH} by default.
     */
    clear():void  {
        if (this.mMatrix == null) {
            this.mMatrix = new Matrix();
        } else {
            this.mMatrix.reset();
        }
        this.mAlpha = 1.0;
        this.mTransformationType = Transformation.TYPE_BOTH;
    }

    /**
     * Indicates the nature of this transformation.
     *
     * @return {@link #TYPE_ALPHA}, {@link #TYPE_MATRIX},
     *         {@link #TYPE_BOTH} or {@link #TYPE_IDENTITY}.
     */
    getTransformationType():number  {
        return this.mTransformationType;
    }

    /**
     * Sets the transformation type.
     *
     * @param transformationType One of {@link #TYPE_ALPHA},
     *        {@link #TYPE_MATRIX}, {@link #TYPE_BOTH} or
     *        {@link #TYPE_IDENTITY}.
     */
    setTransformationType(transformationType:number):void  {
        this.mTransformationType = transformationType;
    }

    /**
     * Clones the specified transformation.
     *
     * @param t The transformation to clone.
     */
    set(t:Transformation):void  {
        this.mAlpha = t.getAlpha();
        this.mMatrix.set(t.getMatrix());
        this.mTransformationType = t.getTransformationType();
    }

    /**
     * Apply this Transformation to an existing Transformation, e.g. apply
     * a scale effect to something that has already been rotated.
     * @param t
     */
    compose(t:Transformation):void  {
        this.mAlpha *= t.getAlpha();
        this.mMatrix.preConcat(t.getMatrix());
    }

    /**
     * Like {@link #compose(Transformation)} but does this.postConcat(t) of
     * the transformation matrix.
     * @hide
     */
    postCompose(t:Transformation):void  {
        this.mAlpha *= t.getAlpha();
        this.mMatrix.postConcat(t.getMatrix());
    }

    /**
     * @return The 3x3 Matrix representing the trnasformation to apply to the
     * coordinates of the object being animated
     */
    getMatrix():Matrix  {
        return this.mMatrix;
    }

    /**
     * Sets the degree of transparency
     * @param alpha 1.0 means fully opaqe and 0.0 means fully transparent
     */
    setAlpha(alpha:number):void  {
        this.mAlpha = alpha;
    }

    /**
     * @return The degree of transparency
     */
    getAlpha():number  {
        return this.mAlpha;
    }

    toString():string  {
        let sb:StringBuilder = new StringBuilder(64);
        sb.append("Transformation");
        this.toShortString(sb);
        return sb.toString();
    }

    /**
     * Return a string representation of the transformation in a compact form.
     */
    toShortString(sb?:StringBuilder):void  {
        sb = sb || new StringBuilder(64);
        sb.append("{alpha=");
        sb.append(this.mAlpha);
        sb.append(" matrix=");
        this.mMatrix.toShortString(sb);
        sb.append('}');
    }
}
}
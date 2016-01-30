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

///<reference path="../../android/util/Log.ts"/>
///<reference path="../../java/lang/System.ts"/>
///<reference path="../../java/lang/StringBuilder.ts"/>
///<reference path="../../android/graphics/Point.ts"/>
///<reference path="../../android/graphics/Rect.ts"/>
///<reference path="../../android/graphics/RectF.ts"/>

module android.graphics {
import Log = android.util.Log;
import System = java.lang.System;
import StringBuilder = java.lang.StringBuilder;
import Point = android.graphics.Point;
import Rect = android.graphics.Rect;
import RectF = android.graphics.RectF;
/**
 * The Matrix class holds a 3x3 matrix for transforming coordinates.
 * FIXME recycle Array or share Array: new Array<number>(9)
 */
export class Matrix {

    //!< use with getValues/setValues
    static MSCALE_X:number = 0;

    //!< use with getValues/setValues
    static MSKEW_X:number = 1;

    //!< use with getValues/setValues
    static MTRANS_X:number = 2;

    //!< use with getValues/setValues
    static MSKEW_Y:number = 3;

    //!< use with getValues/setValues
    static MSCALE_Y:number = 4;

    //!< use with getValues/setValues
    static MTRANS_Y:number = 5;

    //!< use with getValues/setValues
    static MPERSP_0:number = 6;

    //!< use with getValues/setValues
    static MPERSP_1:number = 7;

    //!< use with getValues/setValues
    static MPERSP_2:number = 8;

    private static MATRIX_SIZE:number = 9;

    private mValues = new Array<number>(Matrix.MATRIX_SIZE);

    /** @hide */
    static IDENTITY_MATRIX:Matrix = (()=>{
        class _Inner extends Matrix {

            oops():void  {
                throw Error(`new IllegalStateException("Matrix can not be modified")`);
            }

            set(src:Matrix):void  {
                this.oops();
            }

            reset():void  {
                this.oops();
            }

            setTranslate(dx:number, dy:number):void  {
                this.oops();
            }

            setScale(sx:number, sy:number, px?:number, py?:number):void  {
                this.oops();
            }

            setRotate(degrees:number, px?:number, py?:number):void  {
                this.oops();
            }

            setSinCos(sinValue:number, cosValue:number, px?:number, py?:number):void  {
                this.oops();
            }

            setSkew(kx:number, ky:number, px?:number, py?:number):void  {
                this.oops();
            }

            setConcat(a:Matrix, b:Matrix):boolean  {
                this.oops();
                return false;
            }

            preTranslate(dx:number, dy:number):boolean  {
                this.oops();
                return false;
            }

            preScale(sx:number, sy:number, px?:number, py?:number):boolean  {
                this.oops();
                return false;
            }

            preRotate(degrees:number, px?:number, py?:number):boolean  {
                this.oops();
                return false;
            }

            preSkew(kx:number, ky:number, px?:number, py?:number):boolean  {
                this.oops();
                return false;
            }

            preConcat(other:Matrix):boolean  {
                this.oops();
                return false;
            }

            postTranslate(dx:number, dy:number):boolean  {
                this.oops();
                return false;
            }

            postScale(sx:number, sy:number, px?:number, py?:number):boolean  {
                this.oops();
                return false;
            }

            postRotate(degrees:number, px?:number, py?:number):boolean  {
                this.oops();
                return false;
            }

            postSkew(kx:number, ky:number, px?:number, py?:number):boolean  {
                this.oops();
                return false;
            }

            postConcat(other:Matrix):boolean  {
                this.oops();
                return false;
            }

            setRectToRect(src:RectF, dst:RectF, stf:Matrix.ScaleToFit):boolean  {
                this.oops();
                return false;
            }

            setPolyToPoly(src:number[], srcIndex:number, dst:number[], dstIndex:number, pointCount:number):boolean  {
                this.oops();
                return false;
            }

            setValues(values:number[]):void  {
                this.oops();
            }
        }
        return new _Inner();
    })();

    /**
     * Create an identity matrix
     */
    constructor();
    /**
     * Create a matrix that is a (deep) copy of src
     * @param src The matrix to copy into this matrix
     */
    constructor(src:Matrix);
    /**
     * Create a matrix that is a (deep) copy of src
     * @param values The matrix values to copy into this matrix
     */
    constructor(values:number[]);
    constructor(values?:Matrix|number[]) {
        if(values instanceof Matrix) this.set(values);
        else if(values instanceof Array){
            System.arraycopy(values, 0, this.mValues, 0, Matrix.MATRIX_SIZE);
        }else{
            Matrix.reset(this.mValues);
        }
    }

    /**
     * Returns true if the matrix is identity.
     * This maybe faster than testing if (getType() == 0)
     */
    isIdentity():boolean  {
        for (let i:number = 0, k:number = 0; i < 3; i++) {
            for (let j:number = 0; j < 3; j++, k++) {
                if (this.mValues[k] != ((i == j) ? 1 : 0)) {
                    return false;
                }
            }
        }
        return true;
    }

    hasPerspective():boolean  {
        return (this.mValues[6] != 0 || this.mValues[7] != 0 || this.mValues[8] != 1);
    }

    /**
     * Returns true if will map a rectangle to another rectangle. This can be
     * true if the matrix is identity, scale-only, or rotates a multiple of 90
     * degrees.
     */
    rectStaysRect():boolean  {
        return (this.computeTypeMask() & Matrix.kRectStaysRect_Mask) != 0;
    }

    /**
     * (deep) copy the src matrix into this matrix. If src is null, reset this
     * matrix to the identity matrix.
     */
    set(src:Matrix):void  {
        if (src == null) {
            this.reset();
        } else {
            System.arraycopy(src.mValues, 0, this.mValues, 0, Matrix.MATRIX_SIZE);
        }
    }

    /** Returns true iff obj is a Matrix and its values equal our values.
    */
    equals(obj:any):boolean  {
        //if (obj == this) return true;     -- NaN value would mean matrix != itself
        if (!(obj instanceof Matrix))
            return false;
        let another:Matrix = <Matrix> obj;
        for (let i:number = 0; i < Matrix.MATRIX_SIZE; i++) {
            if (this.mValues[i] != another.mValues[i]) {
                return false;
            }
        }
        return true;
    }

    hashCode():number  {
        // really using this at the moment, so we take the easy way out.
        return 44;
    }

    /** Set the matrix to identity */
    reset():void  {
        Matrix.reset(this.mValues);
    }

    /** Set the matrix to translate by (dx, dy). */
    setTranslate(dx:number, dy:number):void  {
        Matrix.setTranslate(this.mValues, dx, dy);
    }

    /**
     * Set the matrix to scale by sx and sy, with a pivot point at (px, py).
     * The pivot point is the coordinate that should remain unchanged by the
     * specified transformation.
     */
    setScale(sx:number, sy:number, px?:number, py?:number):void  {
        if(px==null || py==null){
            this.mValues[0] = sx;
            this.mValues[1] = 0;
            this.mValues[2] = 0;
            this.mValues[3] = 0;
            this.mValues[4] = sy;
            this.mValues[5] = 0;
            this.mValues[6] = 0;
            this.mValues[7] = 0;
            this.mValues[8] = 1;

        }else{
            this.mValues = Matrix.getScale(sx, sy, px, py);
        }
    }

    /**
     * Set the matrix to rotate by the specified number of degrees, with a pivot
     * point at (px, py). The pivot point is the coordinate that should remain
     * unchanged by the specified transformation.
     */
    setRotate(degrees:number, px?:number, py?:number):void  {
        if(px==null || py==null){
            Matrix.setRotate_1(this.mValues, degrees);

        }else{
            this.mValues = Matrix.getRotate_3(degrees, px, py);
        }
    }

    /**
     * Set the matrix to rotate by the specified sine and cosine values, with a
     * pivot point at (px, py). The pivot point is the coordinate that should
     * remain unchanged by the specified transformation.
     */
    setSinCos(sinValue:number, cosValue:number, px?:number, py?:number):void  {
        if(px==null || py==null){
            Matrix.setRotate_2(this.mValues, sinValue, cosValue);

        }else {
            // translate so that the pivot is in 0,0
            Matrix.setTranslate(this.mValues, -px, -py);
            // scale
            this.postTransform(Matrix.getRotate_2(sinValue, cosValue));
            // translate back the pivot
            this.postTransform(Matrix.getTranslate(px, py));
        }
    }

    /**
     * Set the matrix to skew by sx and sy, with a pivot point at (px, py).
     * The pivot point is the coordinate that should remain unchanged by the
     * specified transformation.
     */
    setSkew(kx:number, ky:number, px?:number, py?:number):void  {
        if(px==null || py==null){
            this.mValues[0] = 1;
            this.mValues[1] = kx;
            this.mValues[2] = -0;
            this.mValues[3] = ky;
            this.mValues[4] = 1;
            this.mValues[5] = 0;
            this.mValues[6] = 0;
            this.mValues[7] = 0;
            this.mValues[8] = 1;

        }else{
            this.mValues = Matrix.getSkew(kx, ky, px, py);
        }
    }

    /**
     * Set the matrix to the concatenation of the two specified matrices,
     * returning true if the the result can be represented. Either of the two
     * matrices may also be the target matrix. this = a * b
     */
    setConcat(a:Matrix, b:Matrix):boolean  {
        Matrix.multiply(this.mValues, a.mValues, b.mValues);
        return true;
    }

    /**
     * Preconcats the matrix with the specified translation.
     * M' = M * T(dx, dy)
     */
    preTranslate(dx:number, dy:number):boolean  {
        this.preTransform(Matrix.getTranslate(dx, dy));
        return true;
    }

    /**
     * Preconcats the matrix with the specified scale.
     * M' = M * S(sx, sy, px, py)
     */
    preScale(sx:number, sy:number, px?:number, py?:number):boolean  {
        this.preTransform(Matrix.getScale(sx, sy, px, py));
        return true;
    }


    /**
     * Preconcats the matrix with the specified rotation.
     * M' = M * R(degrees)
     * M' = M * R(degrees, px, py)
     */
    preRotate(degrees:number, px?:number, py?:number):boolean  {
        if(px==null || py==null){
            let rad:number = Math_toRadians(degrees);
            let sin:number = <number> Math.sin(rad);
            let cos:number = <number> Math.cos(rad);
            this.preTransform(Matrix.getRotate_2(sin, cos));
            return true;
        }

        this.preTransform(Matrix.getRotate_3(degrees, px, py));
        return true;
    }


    /**
     * Preconcats the matrix with the specified skew.
     * M' = M * K(kx, ky)
     * M' = M * K(kx, ky, px, py)
     */
    preSkew(kx:number, ky:number, px?:number, py?:number):boolean  {
        this.preTransform(Matrix.getSkew(kx, ky, px, py));
        return true;
    }

    /**
     * Preconcats the matrix with the specified matrix.
     * M' = M * other
     */
    preConcat(other:Matrix):boolean  {
        this.preTransform(other.mValues);
        return true;
    }

    /**
     * Postconcats the matrix with the specified translation.
     * M' = T(dx, dy) * M
     */
    postTranslate(dx:number, dy:number):boolean  {
        this.postTransform(Matrix.getTranslate(dx, dy));
        return true;
    }

    /**
     * Postconcats the matrix with the specified scale.
     * M' = S(sx, sy) * M
     * M' = S(sx, sy, px, py) * M
     */
    postScale(sx:number, sy:number, px?:number, py?:number):boolean  {
        this.postTransform(Matrix.getScale(sx, sy, px, py));
        return true;
    }

    /**
     * Postconcats the matrix with the specified rotation.
     * M' = R(degrees) * M
     * M' = R(degrees, px, py) * M
     */
    postRotate(degrees:number, px?:number, py?:number):boolean  {
        this.postTransform(Matrix.getRotate_3(degrees, px, py));
        return true;
    }

    /**
     * Postconcats the matrix with the specified skew.
     * M' = K(kx, ky) * M
     * M' = K(kx, ky, px, py) * M
     */
    postSkew(kx:number, ky:number, px?:number, py?:number):boolean  {
        this.postTransform(Matrix.getSkew(kx, ky, px, py));
        return true;
    }

    /**
     * Postconcats the matrix with the specified matrix.
     * M' = other * M
     */
    postConcat(other:Matrix):boolean  {
        this.postTransform(other.mValues);
        return true;
    }



    /**
     * Set the matrix to the scale and translate values that map the source
     * rectangle to the destination rectangle, returning true if the the result
     * can be represented.
     *
     * @param src the source rectangle to map from.
     * @param dst the destination rectangle to map to.
     * @param stf the ScaleToFit option
     * @return true if the matrix can be represented by the rectangle mapping.
     */
    setRectToRect(src:RectF, dst:RectF, stf:Matrix.ScaleToFit):boolean  {
        if (dst == null || src == null) {
            throw Error(`new NullPointerException()`);
        }
        let d:Matrix = this;
        if (src.isEmpty()) {
            Matrix.reset(d.mValues);
            return false;
        }
        if (dst.isEmpty()) {
            d.mValues[0] = d.mValues[1] = d.mValues[2] = d.mValues[3] = d.mValues[4] = d.mValues[5] = d.mValues[6] = d.mValues[7] = 0;
            d.mValues[8] = 1;
        } else {
            let tx:number, sx:number = dst.width() / src.width();
            let ty:number, sy:number = dst.height() / src.height();
            let xLarger:boolean = false;
            if (stf != Matrix.ScaleToFit.FILL) {
                if (sx > sy) {
                    xLarger = true;
                    sx = sy;
                } else {
                    sy = sx;
                }
            }
            tx = dst.left - src.left * sx;
            ty = dst.top - src.top * sy;
            if (stf == Matrix.ScaleToFit.CENTER || stf == Matrix.ScaleToFit.END) {
                let diff:number;
                if (xLarger) {
                    diff = dst.width() - src.width() * sy;
                } else {
                    diff = dst.height() - src.height() * sy;
                }
                if (stf == Matrix.ScaleToFit.CENTER) {
                    diff = diff / 2;
                }
                if (xLarger) {
                    tx += diff;
                } else {
                    ty += diff;
                }
            }
            d.mValues[0] = sx;
            d.mValues[4] = sy;
            d.mValues[2] = tx;
            d.mValues[5] = ty;
            d.mValues[1] = d.mValues[3] = d.mValues[6] = d.mValues[7] = 0;
        }
        // shared cleanup
        d.mValues[8] = 1;
        return true;
    }

    // private helper to perform range checks on arrays of "points"
    private static checkPointArrays(src:number[], srcIndex:number, dst:number[], dstIndex:number, pointCount:number):void  {
        // check for too-small and too-big indices
        let srcStop:number = srcIndex + (pointCount << 1);
        let dstStop:number = dstIndex + (pointCount << 1);
        if ((pointCount | srcIndex | dstIndex | srcStop | dstStop) < 0 || srcStop > src.length || dstStop > dst.length) {
            throw Error(`new ArrayIndexOutOfBoundsException()`);
        }
    }

    ///**
    // * Set the matrix such that the specified src points would map to the
    // * specified dst points. The "points" are represented as an array of floats,
    // * order [x0, y0, x1, y1, ...], where each "point" is 2 float values.
    // *
    // * @param src   The array of src [x,y] pairs (points)
    // * @param srcIndex Index of the first pair of src values
    // * @param dst   The array of dst [x,y] pairs (points)
    // * @param dstIndex Index of the first pair of dst values
    // * @param pointCount The number of pairs/points to be used. Must be [0..4]
    // * @return true if the matrix was set to the specified transformation
    // */
    //setPolyToPoly(src:number[], srcIndex:number, dst:number[], dstIndex:number, pointCount:number):boolean  {
    //    Log.e('Matrix', "Matrix.setPolyToPoly is not supported");
    //    return false;
    //}


    ///**
    // * If this matrix can be inverted, return true and if inverse is not null,
    // * set inverse to be the inverse of this matrix. If this matrix cannot be
    // * inverted, ignore inverse and return false.
    // */
    //invert(inverse:Matrix):boolean  {
    //    try {
    //        let matrixInverter:MatrixInverter = this.getAffineTransform();
    //        let inverseTransform:MatrixInverter = matrixInverter.createInverse();
    //        inverse.mValues[0] = <number> inverseTransform.getScaleX();
    //        inverse.mValues[1] = <number> inverseTransform.getShearX();
    //        inverse.mValues[2] = <number> inverseTransform.getTranslateX();
    //        inverse.mValues[3] = <number> inverseTransform.getScaleX();
    //        inverse.mValues[4] = <number> inverseTransform.getShearY();
    //        inverse.mValues[5] = <number> inverseTransform.getTranslateY();
    //        return true;
    //    } catch (e){
    //        return false;
    //    }
    //}

    /**
    * Apply this matrix to the array of 2D points specified by src, and write
     * the transformed points into the array of points specified by dst. The
     * two arrays represent their "points" as pairs of floats [x, y].
     *
     * @param dst   The array of dst points (x,y pairs)
     * @param dstIndex The index of the first [x,y] pair of dst floats
     * @param src   The array of src points (x,y pairs)
     * @param srcIndex The index of the first [x,y] pair of src floats
     * @param pointCount The number of points (x,y pairs) to transform
     */
    mapPoints(dst:number[], dstIndex=0, src=dst, srcIndex=0, pointCount=dst.length >> 1):void  {
        Matrix.checkPointArrays(src, srcIndex, dst, dstIndex, pointCount);
        const count:number = pointCount * 2;
        let tmpDest:number[] = dst;
        let inPlace:boolean = dst == src;
        if (inPlace) {
            tmpDest = new Array<number>(dstIndex + count);
        }
        for (let i:number = 0; i < count; i += 2) {
            // just in case we are doing in place, we better put this in temp vars
            let x:number = this.mValues[0] * src[i + srcIndex] + this.mValues[1] * src[i + srcIndex + 1] + this.mValues[2];
            let y:number = this.mValues[3] * src[i + srcIndex] + this.mValues[4] * src[i + srcIndex + 1] + this.mValues[5];
            tmpDest[i + dstIndex] = x;
            tmpDest[i + dstIndex + 1] = y;
        }
        if (inPlace) {
            System.arraycopy(tmpDest, dstIndex, dst, dstIndex, count);
        }
    }

    /**
    * Apply this matrix to the array of 2D vectors specified by src, and write
     * the transformed vectors into the array of vectors specified by dst. The
     * two arrays represent their "vectors" as pairs of floats [x, y].
     *
     * Note: this method does not apply the translation associated with the matrix. Use
     * {@link Matrix#mapPoints(float[], int, float[], int, int)} if you want the translation
     * to be applied.
     *
     * @param dst   The array of dst vectors (x,y pairs)
     * @param dstIndex The index of the first [x,y] pair of dst floats
     * @param src   The array of src vectors (x,y pairs)
     * @param srcIndex The index of the first [x,y] pair of src floats
     * @param ptCount The number of vectors (x,y pairs) to transform
     */
    mapVectors(dst:number[], dstIndex=0, src=dst, srcIndex=0, ptCount=dst.length >> 1):void  {
        Matrix.checkPointArrays(src, srcIndex, dst, dstIndex, ptCount);
        if (this.hasPerspective()) {
            // transform the (0,0) point
            let origin:number[] =  [ 0., 0. ];
            this.mapPoints(origin);
            // translate the vector data as points
            this.mapPoints(dst, dstIndex, src, srcIndex, ptCount);
            // then substract the transformed origin.
            const count:number = ptCount * 2;
            for (let i:number = 0; i < count; i += 2) {
                dst[dstIndex + i] = dst[dstIndex + i] - origin[0];
                dst[dstIndex + i + 1] = dst[dstIndex + i + 1] - origin[1];
            }
        } else {
            // make a copy of the matrix
            let copy:Matrix = new Matrix(this.mValues);
            // remove the translation
            Matrix.setTranslate(copy.mValues, 0, 0);
            // map the content as points.
            copy.mapPoints(dst, dstIndex, src, srcIndex, ptCount);
        }
    }

    /**
     * Apply this matrix to the src rectangle, and write the transformed
     * rectangle into dst. This is accomplished by transforming the 4 corners of
     * src, and then setting dst to the bounds of those points.
     *
     * @param dst Where the transformed rectangle is written.
     * @param src The original rectangle to be transformed.
     * @return the result of calling rectStaysRect()
     */
    mapRect(dst:RectF, src=dst):boolean  {
        if (dst == null || src == null) {
            throw Error(`new NullPointerException()`);
        }
        // array with 4 corners
        let corners:number[] =  [ src.left, src.top, src.right, src.top, src.right, src.bottom, src.left, src.bottom ];
        // apply the transform to them.
        this.mapPoints(corners);
        // now put the result in the rect. We take the min/max of Xs and min/max of Ys
        dst.left = Math.min(Math.min(corners[0], corners[2]), Math.min(corners[4], corners[6]));
        dst.right = Math.max(Math.max(corners[0], corners[2]), Math.max(corners[4], corners[6]));
        dst.top = Math.min(Math.min(corners[1], corners[3]), Math.min(corners[5], corners[7]));
        dst.bottom = Math.max(Math.max(corners[1], corners[3]), Math.max(corners[5], corners[7]));
        return (this.computeTypeMask() & Matrix.kRectStaysRect_Mask) != 0;
    }

    /**
     * Return the mean radius of a circle after it has been mapped by
     * this matrix. NOTE: in perspective this value assumes the circle
     * has its center at the origin.
     */
    mapRadius(radius:number):number  {
        let src:number[] =  [ radius, 0., 0., radius ];
        this.mapVectors(src, 0, src, 0, 2);
        let l1:number = Matrix.getPointLength(src, 0);
        let l2:number = Matrix.getPointLength(src, 2);
        return <number> Math.sqrt(l1 * l2);
    }

    /** Copy 9 values from the matrix into the array.
    */
    getValues(values:number[]):void  {
        if (values.length < 9) {
            throw Error(`new ArrayIndexOutOfBoundsException()`);
        }
        System.arraycopy(this.mValues, 0, values, 0, Matrix.MATRIX_SIZE);
    }

    /** Copy 9 values from the array into the matrix.
        Depending on the implementation of Matrix, these may be
        transformed into 16.16 integers in the Matrix, such that
        a subsequent call to getValues() will not yield exactly
        the same values.
    */
    setValues(values:number[]):void  {
        if (values.length < 9) {
            throw Error(`new ArrayIndexOutOfBoundsException()`);
        }
        System.arraycopy(values, 0, this.mValues, 0, Matrix.MATRIX_SIZE);
    }

    toString():string  {
        let sb:StringBuilder = new StringBuilder(64);
        sb.append("Matrix{");
        this.toShortString(sb);
        sb.append('}');
        return sb.toString();
    }

    /**
     * @hide
     */
    toShortString(sb:StringBuilder):void  {
        let values:number[] = new Array<number>(9);
        this.getValues(values);
        sb.append('[');
        sb.append(values[0]);
        sb.append(", ");
        sb.append(values[1]);
        sb.append(", ");
        sb.append(values[2]);
        sb.append("][");
        sb.append(values[3]);
        sb.append(", ");
        sb.append(values[4]);
        sb.append(", ");
        sb.append(values[5]);
        sb.append("][");
        sb.append(values[6]);
        sb.append(", ");
        sb.append(values[7]);
        sb.append(", ");
        sb.append(values[8]);
        sb.append(']');
    }

    /**
     * Adds the given transformation to the current Matrix
     * <p/>This in effect does this = this*matrix
     * @param matrix
     */
    private postTransform(matrix:number[]):void  {
        let tmp:number[] = new Array<number>(9);
        Matrix.multiply(tmp, this.mValues, matrix);
        this.mValues = tmp;
    }

    /**
     * Adds the given transformation to the current Matrix
     * <p/>This in effect does this = matrix*this
     * @param matrix
     */
    private preTransform(matrix:number[]):void  {
        let tmp:number[] = new Array<number>(9);
        Matrix.multiply(tmp, matrix, this.mValues);
        this.mValues = tmp;
    }

    private static getPointLength(src:number[], index:number):number  {
        return <number> Math.sqrt(src[index] * src[index] + src[index + 1] * src[index + 1]);
    }

    /**
     * multiply two matrices and store them in a 3rd.
     * <p/>This in effect does dest = a*b
     * dest cannot be the same as a or b.
     */
    /*package*/
    static multiply(dest:number[], a:number[], b:number[]):void  {
        // first row
        dest[0] = b[0] * a[0] + b[1] * a[3] + b[2] * a[6];
        dest[1] = b[0] * a[1] + b[1] * a[4] + b[2] * a[7];
        dest[2] = b[0] * a[2] + b[1] * a[5] + b[2] * a[8];
        // 2nd row
        dest[3] = b[3] * a[0] + b[4] * a[3] + b[5] * a[6];
        dest[4] = b[3] * a[1] + b[4] * a[4] + b[5] * a[7];
        dest[5] = b[3] * a[2] + b[4] * a[5] + b[5] * a[8];
        // 3rd row
        dest[6] = b[6] * a[0] + b[7] * a[3] + b[8] * a[6];
        dest[7] = b[6] * a[1] + b[7] * a[4] + b[8] * a[7];
        dest[8] = b[6] * a[2] + b[7] * a[5] + b[8] * a[8];
    }

    /**
     * Returns a matrix that represents a given translate
     * @param dx
     * @param dy
     * @return
     */
    /*package*/
    static getTranslate(dx:number, dy:number):number[]  {
        return this.setTranslate(new Array<number>(9), dx, dy);
    }

    /*package*/
    static setTranslate(dest:number[], dx:number, dy:number):number[]  {
        dest[0] = 1;
        dest[1] = 0;
        dest[2] = dx;
        dest[3] = 0;
        dest[4] = 1;
        dest[5] = dy;
        dest[6] = 0;
        dest[7] = 0;
        dest[8] = 1;
        return dest;
    }

    /**
     * Returns a matrix that represents the given scale info.
     * @param sx
     * @param sy
     * @param px
     * @param py
     */
    /*package*/
    static getScale(sx:number, sy:number, px?:number, py?:number):number[]  {
        if(px==null || py==null){
            return  [ sx, 0, 0, 0, sy, 0, 0, 0, 1 ];
        }
        let tmp:number[] = new Array<number>(9);
        let tmp2:number[] = new Array<number>(9);
        // TODO: do it in one pass
        // translate tmp so that the pivot is in 0,0
        this.setTranslate(tmp, -px, -py);
        // scale into tmp2
        Matrix.multiply(tmp2, tmp, Matrix.getScale(sx, sy));
        // translate back the pivot back into tmp
        Matrix.multiply(tmp, tmp2, Matrix.getTranslate(px, py));
        return tmp;
    }

    /*package*/
    static getRotate_1(degrees:number):number[]  {
        let rad:number = Math_toRadians(degrees);
        let sin:number = Math.sin(rad);
        let cos:number = Math.cos(rad);
        return Matrix.getRotate_2(sin, cos);
    }

    /*package*/
    static getRotate_2(sin:number, cos:number):number[]  {
        return this.setRotate_2(new Array<number>(9), sin, cos);
    }

    /*package*/
    static setRotate_1(dest:number[], degrees:number):number[]  {
        let rad:number = Math_toRadians(degrees);
        let sin:number = <number> Math.sin(rad);
        let cos:number = <number> Math.cos(rad);
        return Matrix.setRotate_2(dest, sin, cos);
    }

    /*package*/
    static setRotate_2(dest:number[], sin:number, cos:number):number[]  {
        dest[0] = cos;
        dest[1] = -sin;
        dest[2] = 0;
        dest[3] = sin;
        dest[4] = cos;
        dest[5] = 0;
        dest[6] = 0;
        dest[7] = 0;
        dest[8] = 1;
        return dest;
    }

    /*package*/
    static getRotate_3(degrees:number, px:number, py:number):number[]  {
        let tmp:number[] = new Array<number>(9);
        let tmp2:number[] = new Array<number>(9);
        // TODO: do it in one pass
        // translate so that the pivot is in 0,0
        this.setTranslate(tmp, -px, -py);
        // rotate into tmp2
        let rad:number = Math_toRadians(degrees);
        let cos:number = <number> Math.cos(rad);
        let sin:number = <number> Math.sin(rad);
        Matrix.multiply(tmp2, tmp, Matrix.getRotate_2(sin, cos));
        // translate back the pivot back into tmp
        Matrix.multiply(tmp, tmp2, Matrix.getTranslate(px, py));
        return tmp;
    }

    /*package*/
    static getSkew(kx:number, ky:number, px?:number, py?:number):number[]  {
        if(px==null || py==null){
            return  [ 1, kx, 0, ky, 1, 0, 0, 0, 1 ];
        }

        let tmp:number[] = new Array<number>(9);
        let tmp2:number[] = new Array<number>(9);
        // TODO: do it in one pass
        // translate so that the pivot is in 0,0
        this.setTranslate(tmp, -px, -py);
        // skew into tmp2
        Matrix.multiply(tmp2, tmp,  [ 1, kx, 0, ky, 1, 0, 0, 0, 1 ]);
        // translate back the pivot back into tmp
        Matrix.multiply(tmp, tmp2, Matrix.getTranslate(px, py));
        return tmp;
    }

    // ---- Private helper methods ----
    ///**
    // * Returns an {@link java.awt.geom.AffineTransform} matching the matrix.
    // */
    //getAffineTransform():MatrixInverter  {
    //    return this.getAffineTransform(this.mValues);
    //}
    //
    ///*package*/
    //static getAffineTransform(matrix:number[]):MatrixInverter  {
    //    // the order is 0, 3, 1, 4, 2, 5...
    //    return new MatrixInverter(matrix[0], matrix[3], matrix[1], matrix[4], matrix[2], matrix[5]);
    //}

    /**
     * Reset a matrix to the identity
     */
    private static reset(mtx:number[]):void  {
        mtx[0] = 1;
        mtx[1] = 0;
        mtx[2] = 0;

        mtx[3] = 0;
        mtx[4] = 1;
        mtx[5] = 0;

        mtx[6] = 0;
        mtx[7] = 0;
        mtx[8] = 1;
    }

    private static kIdentity_Mask:number = 0;

    //!< set if the matrix has translation
    private static kTranslate_Mask:number = 0x01;

    //!< set if the matrix has X or Y scale
    private static kScale_Mask:number = 0x02;

    //!< set if the matrix skews or rotates
    private static kAffine_Mask:number = 0x04;

    //!< set if the matrix is in perspective
    private static kPerspective_Mask:number = 0x08;

    private static kRectStaysRect_Mask:number = 0x10;

    private static kUnknown_Mask:number = 0x80;

    private static kAllMasks:number = Matrix.kTranslate_Mask | Matrix.kScale_Mask | Matrix.kAffine_Mask | Matrix.kPerspective_Mask | Matrix.kRectStaysRect_Mask;

    // these guys align with the masks, so we can compute a mask from a variable 0/1
    private static kTranslate_Shift:number = 0;

    private static kScale_Shift:number = 1;

    private static kAffine_Shift:number = 2;

    private static kPerspective_Shift:number = 3;

    private static kRectStaysRect_Shift:number = 4;

    private computeTypeMask():number  {
        let mask:number = 0;
        if (this.mValues[6] != 0. || this.mValues[7] != 0. || this.mValues[8] != 1.) {
            mask |= Matrix.kPerspective_Mask;
        }
        if (this.mValues[2] != 0. || this.mValues[5] != 0.) {
            mask |= Matrix.kTranslate_Mask;
        }
        let m00:number = this.mValues[0];
        let m01:number = this.mValues[1];
        let m10:number = this.mValues[3];
        let m11:number = this.mValues[4];
        if (m01 != 0. || m10 != 0.) {
            mask |= Matrix.kAffine_Mask;
        }
        if (m00 != 1. || m11 != 1.) {
            mask |= Matrix.kScale_Mask;
        }
        if ((mask & Matrix.kPerspective_Mask) == 0) {
            // map non-zero to 1
            let im00:number = m00 != 0 ? 1 : 0;
            let im01:number = m01 != 0 ? 1 : 0;
            let im10:number = m10 != 0 ? 1 : 0;
            let im11:number = m11 != 0 ? 1 : 0;
            // record if the (p)rimary and (s)econdary diagonals are all 0 or
            // all non-zero (answer is 0 or 1)
            // true if both are 0
            let dp0:number = (im00 | im11) ^ 1;
            // true if both are 1
            let dp1:number = im00 & im11;
            // true if both are 0
            let ds0:number = (im01 | im10) ^ 1;
            // true if both are 1
            let ds1:number = im01 & im10;
            // return 1 if primary is 1 and secondary is 0 or
            // primary is 0 and secondary is 1
            mask |= ((dp0 & ds1) | (dp1 & ds0)) << Matrix.kRectStaysRect_Shift;
        }
        return mask;
    }
}

export module Matrix{
/** Controlls how the src rect should align into the dst rect for
        setRectToRect().
    */
export enum ScaleToFit {

    /**
         * Scale in X and Y independently, so that src matches dst exactly.
         * This may change the aspect ratio of the src.
         */
    FILL /*() {
    }
     */, /**
         * Compute a scale that will maintain the original src aspect ratio,
         * but will also ensure that src fits entirely inside dst. At least one
         * axis (X or Y) will fit exactly. START aligns the result to the
         * left and top edges of dst.
         */
    START /*() {
    }
     */, /**
         * Compute a scale that will maintain the original src aspect ratio,
         * but will also ensure that src fits entirely inside dst. At least one
         * axis (X or Y) will fit exactly. The result is centered inside dst.
         */
    CENTER /*() {
    }
     */, /**
         * Compute a scale that will maintain the original src aspect ratio,
         * but will also ensure that src fits entirely inside dst. At least one
         * axis (X or Y) will fit exactly. END aligns the result to the
         * right and bottom edges of dst.
         */
    END /*() {
    }
     */ /*;
     */}}

    function Math_toRadians(angdeg:number):number {
        return angdeg / 180.0 * Math.PI;
    }
}
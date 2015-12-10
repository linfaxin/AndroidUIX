/*
 * Copyright (C) 2007 The Android Open Source Project
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

///<reference path="../../java/lang/System.ts"/>

module android.text {
import System = java.lang.System;
/**
 * PackedIntVector stores a two-dimensional array of integers,
 * optimized for inserting and deleting rows and for
 * offsetting the values in segments of a given column.
 */
export class PackedIntVector {

    private mColumns:number = 0;

    private mRows:number = 0;

    private mRowGapStart:number = 0;

    private mRowGapLength:number = 0;

    private mValues:number[];

    // starts, followed by lengths
    private mValueGap:number[];

    /**
     * Creates a new PackedIntVector with the specified width and
     * a height of 0.
     *
     * @param columns the width of the PackedIntVector.
     */
    constructor( columns:number) {
        this.mColumns = columns;
        this.mRows = 0;
        this.mRowGapStart = 0;
        this.mRowGapLength = this.mRows;
        this.mValues = null;
        this.mValueGap = new Array<number>(2 * columns);
    }

    /**
     * Returns the value at the specified row and column.
     *
     * @param row the index of the row to return.
     * @param column the index of the column to return.
     *
     * @return the value stored at the specified position.
     *
     * @throws IndexOutOfBoundsException if the row is out of range
     *         (row &lt; 0 || row >= size()) or the column is out of range
     *         (column &lt; 0 || column >= width()).
     */
    getValue(row:number, column:number):number  {
        const columns:number = this.mColumns;
        if (((row | column) < 0) || (row >= this.size()) || (column >= columns)) {
            throw Error(`new IndexOutOfBoundsException(row + ", " + column)`);
        }
        if (row >= this.mRowGapStart) {
            row += this.mRowGapLength;
        }
        let value:number = this.mValues[row * columns + column];
        let valuegap:number[] = this.mValueGap;
        if (row >= valuegap[column]) {
            value += valuegap[column + columns];
        }
        return value;
    }

    /**
     * Sets the value at the specified row and column.
     *
     * @param row the index of the row to set.
     * @param column the index of the column to set.
     *
     * @throws IndexOutOfBoundsException if the row is out of range
     *         (row &lt; 0 || row >= size()) or the column is out of range
     *         (column &lt; 0 || column >= width()).
     */
    setValue(row:number, column:number, value:number):void  {
        if (((row | column) < 0) || (row >= this.size()) || (column >= this.mColumns)) {
            throw Error(`new IndexOutOfBoundsException(row + ", " + column)`);
        }
        if (row >= this.mRowGapStart) {
            row += this.mRowGapLength;
        }
        let valuegap:number[] = this.mValueGap;
        if (row >= valuegap[column]) {
            value -= valuegap[column + this.mColumns];
        }
        this.mValues[row * this.mColumns + column] = value;
    }

    /**
     * Sets the value at the specified row and column.
     * Private internal version: does not check args.
     *
     * @param row the index of the row to set.
     * @param column the index of the column to set.
     *
     */
    private setValueInternal(row:number, column:number, value:number):void  {
        if (row >= this.mRowGapStart) {
            row += this.mRowGapLength;
        }
        let valuegap:number[] = this.mValueGap;
        if (row >= valuegap[column]) {
            value -= valuegap[column + this.mColumns];
        }
        this.mValues[row * this.mColumns + column] = value;
    }

    /**
     * Increments all values in the specified column whose row >= the
     * specified row by the specified delta.
     *
     * @param startRow the row at which to begin incrementing.
     *        This may be == size(), which case there is no effect.
     * @param column the index of the column to set.
     *
     * @throws IndexOutOfBoundsException if the row is out of range
     *         (startRow &lt; 0 || startRow > size()) or the column
     *         is out of range (column &lt; 0 || column >= width()).
     */
    adjustValuesBelow(startRow:number, column:number, delta:number):void  {
        if (((startRow | column) < 0) || (startRow > this.size()) || (column >= this.width())) {
            throw Error(`new IndexOutOfBoundsException(startRow + ", " + column)`);
        }
        if (startRow >= this.mRowGapStart) {
            startRow += this.mRowGapLength;
        }
        this.moveValueGapTo(column, startRow);
        this.mValueGap[column + this.mColumns] += delta;
    }

    /**
     * Inserts a new row of values at the specified row offset.
     *
     * @param row the row above which to insert the new row.
     *        This may be == size(), which case the new row is added
     *        at the end.
     * @param values the new values to be added.  If this is null,
     *        a row of zeroes is added.
     *
     * @throws IndexOutOfBoundsException if the row is out of range
     *         (row &lt; 0 || row > size()) or if the length of the
     *         values array is too small (values.length < width()).
     */
    insertAt(row:number, values:number[]):void  {
        if ((row < 0) || (row > this.size())) {
            throw Error(`new IndexOutOfBoundsException("row " + row)`);
        }
        if ((values != null) && (values.length < this.width())) {
            throw Error(`new IndexOutOfBoundsException("value count " + values.length)`);
        }
        this.moveRowGapTo(row);
        if (this.mRowGapLength == 0) {
            this.growBuffer();
        }
        this.mRowGapStart++;
        this.mRowGapLength--;
        if (values == null) {
            for (let i:number = this.mColumns - 1; i >= 0; i--) {
                this.setValueInternal(row, i, 0);
            }
        } else {
            for (let i:number = this.mColumns - 1; i >= 0; i--) {
                this.setValueInternal(row, i, values[i]);
            }
        }
    }

    /**
     * Deletes the specified number of rows starting with the specified
     * row.
     *
     * @param row the index of the first row to be deleted.
     * @param count the number of rows to delete.
     *
     * @throws IndexOutOfBoundsException if any of the rows to be deleted
     *         are out of range (row &lt; 0 || count &lt; 0 ||
     *         row + count > size()).
     */
    deleteAt(row:number, count:number):void  {
        if (((row | count) < 0) || (row + count > this.size())) {
            throw Error(`new IndexOutOfBoundsException(row + ", " + count)`);
        }
        this.moveRowGapTo(row + count);
        this.mRowGapStart -= count;
        this.mRowGapLength += count;
    // TODO: Reclaim memory when the new height is much smaller
    // than the allocated size.
    }

    /**
     * Returns the number of rows in the PackedIntVector.  This number
     * will change as rows are inserted and deleted.
     *
     * @return the number of rows.
     */
    size():number  {
        return this.mRows - this.mRowGapLength;
    }

    /**
     * Returns the width of the PackedIntVector.  This number is set
     * at construction and will not change.
     *
     * @return the number of columns.
     */
    width():number  {
        return this.mColumns;
    }

    /**
     * Grows the value and gap arrays to be large enough to store at least
     * one more than the current number of rows.
     */
    private growBuffer():void  {
        const columns:number = this.mColumns;
        let newsize:number = this.size() + 1;
        newsize = (newsize * columns) / columns;
        let newvalues:number[] = new Array<number>(newsize * columns);
        const valuegap:number[] = this.mValueGap;
        const rowgapstart:number = this.mRowGapStart;
        let after:number = this.mRows - (rowgapstart + this.mRowGapLength);
        if (this.mValues != null) {
            System.arraycopy(this.mValues, 0, newvalues, 0, columns * rowgapstart);
            System.arraycopy(this.mValues, (this.mRows - after) * columns, newvalues, (newsize - after) * columns, after * columns);
        }
        for (let i:number = 0; i < columns; i++) {
            if (valuegap[i] >= rowgapstart) {
                valuegap[i] += newsize - this.mRows;
                if (valuegap[i] < rowgapstart) {
                    valuegap[i] = rowgapstart;
                }
            }
        }
        this.mRowGapLength += newsize - this.mRows;
        this.mRows = newsize;
        this.mValues = newvalues;
    }

    /**
     * Moves the gap in the values of the specified column to begin at
     * the specified row.
     */
    private moveValueGapTo(column:number, where:number):void  {
        const valuegap:number[] = this.mValueGap;
        const values:number[] = this.mValues;
        const columns:number = this.mColumns;
        if (where == valuegap[column]) {
            return;
        } else if (where > valuegap[column]) {
            for (let i:number = valuegap[column]; i < where; i++) {
                values[i * columns + column] += valuegap[column + columns];
            }
        } else /* where < valuegap[column] */
        {
            for (let i:number = where; i < valuegap[column]; i++) {
                values[i * columns + column] -= valuegap[column + columns];
            }
        }
        valuegap[column] = where;
    }

    /**
     * Moves the gap in the row indices to begin at the specified row.
     */
    private moveRowGapTo(where:number):void  {
        if (where == this.mRowGapStart) {
            return;
        } else if (where > this.mRowGapStart) {
            let moving:number = where + this.mRowGapLength - (this.mRowGapStart + this.mRowGapLength);
            const columns:number = this.mColumns;
            const valuegap:number[] = this.mValueGap;
            const values:number[] = this.mValues;
            const gapend:number = this.mRowGapStart + this.mRowGapLength;
            for (let i:number = gapend; i < gapend + moving; i++) {
                let destrow:number = i - gapend + this.mRowGapStart;
                for (let j:number = 0; j < columns; j++) {
                    let val:number = values[i * columns + j];
                    if (i >= valuegap[j]) {
                        val += valuegap[j + columns];
                    }
                    if (destrow >= valuegap[j]) {
                        val -= valuegap[j + columns];
                    }
                    values[destrow * columns + j] = val;
                }
            }
        } else /* where < mRowGapStart */
        {
            let moving:number = this.mRowGapStart - where;
            const columns:number = this.mColumns;
            const valuegap:number[] = this.mValueGap;
            const values:number[] = this.mValues;
            const gapend:number = this.mRowGapStart + this.mRowGapLength;
            for (let i:number = where + moving - 1; i >= where; i--) {
                let destrow:number = i - where + gapend - moving;
                for (let j:number = 0; j < columns; j++) {
                    let val:number = values[i * columns + j];
                    if (i >= valuegap[j]) {
                        val += valuegap[j + columns];
                    }
                    if (destrow >= valuegap[j]) {
                        val -= valuegap[j + columns];
                    }
                    values[destrow * columns + j] = val;
                }
            }
        }
        this.mRowGapStart = where;
    }
}
}
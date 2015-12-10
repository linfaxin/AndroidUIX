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

///<reference path="../../java/lang/System.ts"/>

module android.text {
import System = java.lang.System;
export class PackedObjectVector<E> {

    private mColumns:number = 0;

    private mRows:number = 0;

    private mRowGapStart:number = 0;

    private mRowGapLength:number = 0;

    private mValues:any[];

    constructor( columns:number) {
        this.mColumns = columns;
        this.mRows = 1;//ArrayUtils.idealIntArraySize(0) / this.mColumns;
        this.mRowGapStart = 0;
        this.mRowGapLength = this.mRows;
        this.mValues = new Array<any>(this.mRows * this.mColumns);
    }

    getValue(row:number, column:number):E  {
        if (row >= this.mRowGapStart)
            row += this.mRowGapLength;
        let value:any = this.mValues[row * this.mColumns + column];
        return <E> value;
    }

    setValue(row:number, column:number, value:E):void  {
        if (row >= this.mRowGapStart)
            row += this.mRowGapLength;
        this.mValues[row * this.mColumns + column] = value;
    }

    insertAt(row:number, values:E[]):void  {
        this.moveRowGapTo(row);
        if (this.mRowGapLength == 0)
            this.growBuffer();
        this.mRowGapStart++;
        this.mRowGapLength--;
        if (values == null)
            for (let i:number = 0; i < this.mColumns; i++) this.setValue(row, i, null);
        else
            for (let i:number = 0; i < this.mColumns; i++) this.setValue(row, i, values[i]);
    }

    deleteAt(row:number, count:number):void  {
        this.moveRowGapTo(row + count);
        this.mRowGapStart -= count;
        this.mRowGapLength += count;
        if (this.mRowGapLength > this.size() * 2) {
        // dump();
        // growBuffer();
        }
    }

    size():number  {
        return this.mRows - this.mRowGapLength;
    }

    width():number  {
        return this.mColumns;
    }

    private growBuffer():void  {
        let newsize:number = this.size() + 1;
        newsize = (newsize * this.mColumns) / this.mColumns;
        let newvalues:any[] = new Array<any>(newsize * this.mColumns);
        let after:number = this.mRows - (this.mRowGapStart + this.mRowGapLength);
        System.arraycopy(this.mValues, 0, newvalues, 0, this.mColumns * this.mRowGapStart);
        System.arraycopy(this.mValues, (this.mRows - after) * this.mColumns, newvalues, (newsize - after) * this.mColumns, after * this.mColumns);
        this.mRowGapLength += newsize - this.mRows;
        this.mRows = newsize;
        this.mValues = newvalues;
    }

    private moveRowGapTo(where:number):void  {
        if (where == this.mRowGapStart)
            return;
        if (where > this.mRowGapStart) {
            let moving:number = where + this.mRowGapLength - (this.mRowGapStart + this.mRowGapLength);
            for (let i:number = this.mRowGapStart + this.mRowGapLength; i < this.mRowGapStart + this.mRowGapLength + moving; i++) {
                let destrow:number = i - (this.mRowGapStart + this.mRowGapLength) + this.mRowGapStart;
                for (let j:number = 0; j < this.mColumns; j++) {
                    let val:any = this.mValues[i * this.mColumns + j];
                    this.mValues[destrow * this.mColumns + j] = val;
                }
            }
        } else /* where < mRowGapStart */
        {
            let moving:number = this.mRowGapStart - where;
            for (let i:number = where + moving - 1; i >= where; i--) {
                let destrow:number = i - where + this.mRowGapStart + this.mRowGapLength - moving;
                for (let j:number = 0; j < this.mColumns; j++) {
                    let val:any = this.mValues[i * this.mColumns + j];
                    this.mValues[destrow * this.mColumns + j] = val;
                }
            }
        }
        this.mRowGapStart = where;
    }

    dump():// XXX
    void  {
        for (let i:number = 0; i < this.mRows; i++) {
            for (let j:number = 0; j < this.mColumns; j++) {
                let val:any = this.mValues[i * this.mColumns + j];
                if (i < this.mRowGapStart || i >= this.mRowGapStart + this.mRowGapLength)
                    System.out.print(val + " ");
                else
                    System.out.print("(" + val + ") ");
            }
            System.out.print(" << \n");
        }
        System.out.print("-----\n\n");
    }
}
}
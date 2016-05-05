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

///<reference path="../../android/graphics/Paint.ts"/>
///<reference path="../../android/text/style/UpdateLayout.ts"/>
///<reference path="../../android/text/style/WrapTogetherSpan.ts"/>
///<reference path="../../java/lang/ref/WeakReference.ts"/>
///<reference path="../../java/lang/System.ts"/>
///<reference path="../../android/text/Layout.ts"/>
///<reference path="../../android/text/PackedIntVector.ts"/>
///<reference path="../../android/text/PackedObjectVector.ts"/>
///<reference path="../../android/text/Spannable.ts"/>
///<reference path="../../android/text/Spanned.ts"/>
///<reference path="../../android/text/StaticLayout.ts"/>
///<reference path="../../android/text/TextDirectionHeuristic.ts"/>
///<reference path="../../android/text/TextDirectionHeuristics.ts"/>
///<reference path="../../android/text/TextPaint.ts"/>
///<reference path="../../android/text/TextUtils.ts"/>
///<reference path="../../android/text/TextWatcher.ts"/>

module android.text {
import Paint = android.graphics.Paint;
import UpdateLayout = android.text.style.UpdateLayout;
import WrapTogetherSpan = android.text.style.WrapTogetherSpan;
import WeakReference = java.lang.ref.WeakReference;
import System = java.lang.System;
import Layout = android.text.Layout;
import PackedIntVector = android.text.PackedIntVector;
import PackedObjectVector = android.text.PackedObjectVector;
import Spannable = android.text.Spannable;
import Spanned = android.text.Spanned;
import StaticLayout = android.text.StaticLayout;
import TextDirectionHeuristic = android.text.TextDirectionHeuristic;
import TextDirectionHeuristics = android.text.TextDirectionHeuristics;
import TextPaint = android.text.TextPaint;
import TextUtils = android.text.TextUtils;
import TextWatcher = android.text.TextWatcher;
/**
 * DynamicLayout is a text layout that updates itself as the text is edited.
 * <p>This is used by widgets to control text layout. You should not need
 * to use this class directly unless you are implementing your own widget
 * or custom display object, or need to call
 * {@link android.graphics.Canvas#drawText(java.lang.CharSequence, int, int, float, float, android.graphics.Paint)
 *  Canvas.drawText()} directly.</p>
 */
export class DynamicLayout extends Layout {

    private static PRIORITY:number = 128;

    private static BLOCK_MINIMUM_CHARACTER_LENGTH:number = 400;

    /**
     * Make a layout for the transformed text (password transformation
     * being the primary example of a transformation)
     * that will be updated as the base text is changed.
     * If ellipsize is non-null, the Layout will ellipsize the text
     * down to ellipsizedWidth.
     * *
     * *@hide
     */
    constructor( base:String, display:String, paint:TextPaint, width:number, align:Layout.Alignment,
                 textDir:TextDirectionHeuristic, spacingmult:number, spacingadd:number, includepad:boolean,
                 ellipsize:TextUtils.TruncateAt=null, ellipsizedWidth=0) {
        super((ellipsize == null) ? display : (Spanned.isImplements(display)) ? new Layout.SpannedEllipsizer(display) : new Layout.Ellipsizer(display),
            paint, width, align, textDir, spacingmult, spacingadd);
        this.mBase = base;
        this.mDisplay = display;
        if (ellipsize != null) {
            this.mInts = new PackedIntVector(DynamicLayout.COLUMNS_ELLIPSIZE);
            this.mEllipsizedWidth = ellipsizedWidth;
            this.mEllipsizeAt = ellipsize;
        } else {
            this.mInts = new PackedIntVector(DynamicLayout.COLUMNS_NORMAL);
            this.mEllipsizedWidth = width;
            this.mEllipsizeAt = null;
        }
        this.mObjects = new PackedObjectVector<Layout.Directions>(1);
        this.mIncludePad = includepad;
        /*
         * This is annoying, but we can't refer to the layout until
         * superclass construction is finished, and the superclass
         * constructor wants the reference to the display text.
         *
         * This will break if the superclass constructor ever actually
         * cares about the content instead of just holding the reference.
         */
        if (ellipsize != null) {
            let e:Layout.Ellipsizer = <Layout.Ellipsizer> this.getText();
            e.mLayout = this;
            e.mWidth = ellipsizedWidth;
            e.mMethod = ellipsize;
            this.mEllipsize = true;
        }
        // Initial state is a single line with 0 characters (0 to 0),
        // with top at 0 and bottom at whatever is natural, and
        // undefined ellipsis.
        let start:number[];
        if (ellipsize != null) {
            start = androidui.util.ArrayCreator.newNumberArray(DynamicLayout.COLUMNS_ELLIPSIZE);
            start[DynamicLayout.ELLIPSIS_START] = DynamicLayout.ELLIPSIS_UNDEFINED;
        } else {
            start = androidui.util.ArrayCreator.newNumberArray(DynamicLayout.COLUMNS_NORMAL);
        }
        let dirs:Layout.Directions[] =  [ DynamicLayout.DIRS_ALL_LEFT_TO_RIGHT ];
        let fm = new Paint.FontMetricsInt();
        paint.getFontMetricsInt(fm);
        let asc:number = fm.ascent;
        let desc:number = fm.descent;
        start[DynamicLayout.DIR] = DynamicLayout.DIR_LEFT_TO_RIGHT << DynamicLayout.DIR_SHIFT;
        start[DynamicLayout.TOP] = 0;
        start[DynamicLayout.DESCENT] = desc;
        this.mInts.insertAt(0, start);
        start[DynamicLayout.TOP] = desc - asc;
        this.mInts.insertAt(1, start);
        this.mObjects.insertAt(0, dirs);
        // Update from 0 characters to whatever the real text is
        this.reflow(base, 0, 0, base.length);
        //if (base instanceof Spannable) {
        //    if (this.mWatcher == null)
        //        this.mWatcher = new DynamicLayout.ChangeWatcher(this);
        //    // Strip out any watchers for other DynamicLayouts.
        //    let sp:Spannable = <Spannable> base;
        //    let spans:DynamicLayout.ChangeWatcher[] = sp.getSpans(0, sp.length(), DynamicLayout.ChangeWatcher.class);
        //    for (let i:number = 0; i < spans.length; i++) sp.removeSpan(spans[i]);
        //    sp.setSpan(this.mWatcher, 0, base.length(), Spannable.SPAN_INCLUSIVE_INCLUSIVE | (DynamicLayout.PRIORITY << Spannable.SPAN_PRIORITY_SHIFT));
        //}
    }

    private reflow(s:String, where:number, before:number, after:number):void  {
        if (s != this.mBase)
            return;
        let text:String = this.mDisplay;
        let len:number = text.length;
        // seek back to the start of the paragraph
        let find:number = text.lastIndexOf('\n', where - 1);
        if (find < 0)
            find = 0;
        else
            find = find + 1;
        {
            let diff:number = where - find;
            before += diff;
            after += diff;
            where -= diff;
        }
        // seek forward to the end of the paragraph
        let look:number = text.indexOf('\n', where + after);
        if (look < 0)
            look = len;
        else
            // we want the index after the \n
            look++;
        let change:number = look - (where + after);
        before += change;
        after += change;
        //if (Spanned.isImplements(text)) {
        //    let sp:Spanned = <Spanned> text;
        //    let again:boolean;
        //    do {
        //        again = false;
        //        let force:any[] = sp.getSpans(where, where + after, WrapTogetherSpan.class);
        //        for (let i:number = 0; i < force.length; i++) {
        //            let st:number = sp.getSpanStart(force[i]);
        //            let en:number = sp.getSpanEnd(force[i]);
        //            if (st < where) {
        //                again = true;
        //                let diff:number = where - st;
        //                before += diff;
        //                after += diff;
        //                where -= diff;
        //            }
        //            if (en > where + after) {
        //                again = true;
        //                let diff:number = en - (where + after);
        //                before += diff;
        //                after += diff;
        //            }
        //        }
        //    } while (again);
        //}
        // find affected region of old layout
        let startline:number = this.getLineForOffset(where);
        let startv:number = this.getLineTop(startline);
        let endline:number = this.getLineForOffset(where + before);
        if (where + after == len)
            endline = this.getLineCount();
        let endv:number = this.getLineTop(endline);
        let islast:boolean = (endline == this.getLineCount());
        // generate new layout for affected text
        let reflowed:StaticLayout;
        {
            reflowed = DynamicLayout.sStaticLayout;
            DynamicLayout.sStaticLayout = null;
        }
        if (reflowed == null) {
            reflowed = new StaticLayout(null, 0, 0, null, 0, null, null, 0, 1, true);
        } else {
            reflowed.prepare();
        }
        reflowed.generate(text, where, where + after, this.getPaint(), this.getWidth(), this.getTextDirectionHeuristic(), this.getSpacingMultiplier(), this.getSpacingAdd(), false, true, this.mEllipsizedWidth, this.mEllipsizeAt);
        let n:number = reflowed.getLineCount();
        if (where + after != len && reflowed.getLineStart(n - 1) == where + after)
            n--;
        // remove affected lines from old layout
        this.mInts.deleteAt(startline, endline - startline);
        this.mObjects.deleteAt(startline, endline - startline);
        // adjust offsets in layout for new height and offsets
        let ht:number = reflowed.getLineTop(n);
        let toppad:number = 0, botpad:number = 0;
        if (this.mIncludePad && startline == 0) {
            toppad = reflowed.getTopPadding();
            this.mTopPadding = toppad;
            ht -= toppad;
        }
        if (this.mIncludePad && islast) {
            botpad = reflowed.getBottomPadding();
            this.mBottomPadding = botpad;
            ht += botpad;
        }
        this.mInts.adjustValuesBelow(startline, DynamicLayout.START, after - before);
        this.mInts.adjustValuesBelow(startline, DynamicLayout.TOP, startv - endv + ht);
        // insert new layout
        let ints:number[];
        if (this.mEllipsize) {
            ints = androidui.util.ArrayCreator.newNumberArray(DynamicLayout.COLUMNS_ELLIPSIZE);
            ints[DynamicLayout.ELLIPSIS_START] = DynamicLayout.ELLIPSIS_UNDEFINED;
        } else {
            ints = androidui.util.ArrayCreator.newNumberArray(DynamicLayout.COLUMNS_NORMAL);
        }
        let objects:Layout.Directions[] = new Array<Layout.Directions>(1);
        for (let i:number = 0; i < n; i++) {
            ints[DynamicLayout.START] = reflowed.getLineStart(i) | (reflowed.getParagraphDirection(i) << DynamicLayout.DIR_SHIFT) | (reflowed.getLineContainsTab(i) ? DynamicLayout.TAB_MASK : 0);
            let top:number = reflowed.getLineTop(i) + startv;
            if (i > 0)
                top -= toppad;
            ints[DynamicLayout.TOP] = top;
            let desc:number = reflowed.getLineDescent(i);
            if (i == n - 1)
                desc += botpad;
            ints[DynamicLayout.DESCENT] = desc;
            objects[0] = reflowed.getLineDirections(i);
            if (this.mEllipsize) {
                ints[DynamicLayout.ELLIPSIS_START] = reflowed.getEllipsisStart(i);
                ints[DynamicLayout.ELLIPSIS_COUNT] = reflowed.getEllipsisCount(i);
            }
            this.mInts.insertAt(startline + i, ints);
            this.mObjects.insertAt(startline + i, objects);
        }
        this.updateBlocks(startline, endline - 1, n);
        {
            DynamicLayout.sStaticLayout = reflowed;
            reflowed.finish();
        }
    }

    /**
     * Create the initial block structure, cutting the text into blocks of at least
     * BLOCK_MINIMUM_CHARACTER_SIZE characters, aligned on the ends of paragraphs.
     */
    private createBlocks():void  {
        let offset:number = DynamicLayout.BLOCK_MINIMUM_CHARACTER_LENGTH;
        this.mNumberOfBlocks = 0;
        const text:String = this.mDisplay;
        while (true) {
            offset = text.indexOf('\n', offset);
            if (offset < 0) {
                this.addBlockAtOffset(text.length);
                break;
            } else {
                this.addBlockAtOffset(offset);
                offset += DynamicLayout.BLOCK_MINIMUM_CHARACTER_LENGTH;
            }
        }
        // mBlockIndices and mBlockEndLines should have the same length
        this.mBlockIndices = androidui.util.ArrayCreator.newNumberArray(this.mBlockEndLines.length);
        for (let i:number = 0; i < this.mBlockEndLines.length; i++) {
            this.mBlockIndices[i] = DynamicLayout.INVALID_BLOCK_INDEX;
        }
    }

    /**
     * Create a new block, ending at the specified character offset.
     * A block will actually be created only if has at least one line, i.e. this offset is
     * not on the end line of the previous block.
     */
    private addBlockAtOffset(offset:number):void  {
        const line:number = this.getLineForOffset(offset);
        if (this.mBlockEndLines == null) {
            // Initial creation of the array, no test on previous block ending line
            this.mBlockEndLines = androidui.util.ArrayCreator.newNumberArray((1));
            this.mBlockEndLines[this.mNumberOfBlocks] = line;
            this.mNumberOfBlocks++;
            return;
        }
        const previousBlockEndLine:number = this.mBlockEndLines[this.mNumberOfBlocks - 1];
        if (line > previousBlockEndLine) {
            if (this.mNumberOfBlocks == this.mBlockEndLines.length) {
                // Grow the array if needed
                let blockEndLines:number[] = androidui.util.ArrayCreator.newNumberArray((this.mNumberOfBlocks + 1));
                System.arraycopy(this.mBlockEndLines, 0, blockEndLines, 0, this.mNumberOfBlocks);
                this.mBlockEndLines = blockEndLines;
            }
            this.mBlockEndLines[this.mNumberOfBlocks] = line;
            this.mNumberOfBlocks++;
        }
    }

    /**
     * This method is called every time the layout is reflowed after an edition.
     * It updates the internal block data structure. The text is split in blocks
     * of contiguous lines, with at least one block for the entire text.
     * When a range of lines is edited, new blocks (from 0 to 3 depending on the
     * overlap structure) will replace the set of overlapping blocks.
     * Blocks are listed in order and are represented by their ending line number.
     * An index is associated to each block (which will be used by display lists),
     * this class simply invalidates the index of blocks overlapping a modification.
     *
     * This method is package private and not private so that it can be tested.
     *
     * @param startLine the first line of the range of modified lines
     * @param endLine the last line of the range, possibly equal to startLine, lower
     * than getLineCount()
     * @param newLineCount the number of lines that will replace the range, possibly 0
     *
     * @hide
     */
    updateBlocks(startLine:number, endLine:number, newLineCount:number):void  {
        if (this.mBlockEndLines == null) {
            this.createBlocks();
            return;
        }
        let firstBlock:number = -1;
        let lastBlock:number = -1;
        for (let i:number = 0; i < this.mNumberOfBlocks; i++) {
            if (this.mBlockEndLines[i] >= startLine) {
                firstBlock = i;
                break;
            }
        }
        for (let i:number = firstBlock; i < this.mNumberOfBlocks; i++) {
            if (this.mBlockEndLines[i] >= endLine) {
                lastBlock = i;
                break;
            }
        }
        const lastBlockEndLine:number = this.mBlockEndLines[lastBlock];
        let createBlockBefore:boolean = startLine > (firstBlock == 0 ? 0 : this.mBlockEndLines[firstBlock - 1] + 1);
        let createBlock:boolean = newLineCount > 0;
        let createBlockAfter:boolean = endLine < this.mBlockEndLines[lastBlock];
        let numAddedBlocks:number = 0;
        if (createBlockBefore)
            numAddedBlocks++;
        if (createBlock)
            numAddedBlocks++;
        if (createBlockAfter)
            numAddedBlocks++;
        const numRemovedBlocks:number = lastBlock - firstBlock + 1;
        const newNumberOfBlocks:number = this.mNumberOfBlocks + numAddedBlocks - numRemovedBlocks;
        if (newNumberOfBlocks == 0) {
            // Even when text is empty, there is actually one line and hence one block
            this.mBlockEndLines[0] = 0;
            this.mBlockIndices[0] = DynamicLayout.INVALID_BLOCK_INDEX;
            this.mNumberOfBlocks = 1;
            return;
        }
        if (newNumberOfBlocks > this.mBlockEndLines.length) {
            const newSize:number = (newNumberOfBlocks);
            let blockEndLines:number[] = androidui.util.ArrayCreator.newNumberArray(newSize);
            let blockIndices:number[] = androidui.util.ArrayCreator.newNumberArray(newSize);
            System.arraycopy(this.mBlockEndLines, 0, blockEndLines, 0, firstBlock);
            System.arraycopy(this.mBlockIndices, 0, blockIndices, 0, firstBlock);
            System.arraycopy(this.mBlockEndLines, lastBlock + 1, blockEndLines, firstBlock + numAddedBlocks, this.mNumberOfBlocks - lastBlock - 1);
            System.arraycopy(this.mBlockIndices, lastBlock + 1, blockIndices, firstBlock + numAddedBlocks, this.mNumberOfBlocks - lastBlock - 1);
            this.mBlockEndLines = blockEndLines;
            this.mBlockIndices = blockIndices;
        } else {
            System.arraycopy(this.mBlockEndLines, lastBlock + 1, this.mBlockEndLines, firstBlock + numAddedBlocks, this.mNumberOfBlocks - lastBlock - 1);
            System.arraycopy(this.mBlockIndices, lastBlock + 1, this.mBlockIndices, firstBlock + numAddedBlocks, this.mNumberOfBlocks - lastBlock - 1);
        }
        this.mNumberOfBlocks = newNumberOfBlocks;
        let newFirstChangedBlock:number;
        const deltaLines:number = newLineCount - (endLine - startLine + 1);
        if (deltaLines != 0) {
            // Display list whose index is >= mIndexFirstChangedBlock is valid
            // but it needs to update its drawing location.
            newFirstChangedBlock = firstBlock + numAddedBlocks;
            for (let i:number = newFirstChangedBlock; i < this.mNumberOfBlocks; i++) {
                this.mBlockEndLines[i] += deltaLines;
            }
        } else {
            newFirstChangedBlock = this.mNumberOfBlocks;
        }
        this.mIndexFirstChangedBlock = Math.min(this.mIndexFirstChangedBlock, newFirstChangedBlock);
        let blockIndex:number = firstBlock;
        if (createBlockBefore) {
            this.mBlockEndLines[blockIndex] = startLine - 1;
            this.mBlockIndices[blockIndex] = DynamicLayout.INVALID_BLOCK_INDEX;
            blockIndex++;
        }
        if (createBlock) {
            this.mBlockEndLines[blockIndex] = startLine + newLineCount - 1;
            this.mBlockIndices[blockIndex] = DynamicLayout.INVALID_BLOCK_INDEX;
            blockIndex++;
        }
        if (createBlockAfter) {
            this.mBlockEndLines[blockIndex] = lastBlockEndLine + deltaLines;
            this.mBlockIndices[blockIndex] = DynamicLayout.INVALID_BLOCK_INDEX;
        }
    }

    /**
     * This package private method is used for test purposes only
     * @hide
     */
    setBlocksDataForTest(blockEndLines:number[], blockIndices:number[], numberOfBlocks:number):void  {
        this.mBlockEndLines = androidui.util.ArrayCreator.newNumberArray(blockEndLines.length);
        this.mBlockIndices = androidui.util.ArrayCreator.newNumberArray(blockIndices.length);
        System.arraycopy(blockEndLines, 0, this.mBlockEndLines, 0, blockEndLines.length);
        System.arraycopy(blockIndices, 0, this.mBlockIndices, 0, blockIndices.length);
        this.mNumberOfBlocks = numberOfBlocks;
    }

    /**
     * @hide
     */
    getBlockEndLines():number[]  {
        return this.mBlockEndLines;
    }

    /**
     * @hide
     */
    getBlockIndices():number[]  {
        return this.mBlockIndices;
    }

    /**
     * @hide
     */
    getNumberOfBlocks():number  {
        return this.mNumberOfBlocks;
    }

    /**
     * @hide
     */
    getIndexFirstChangedBlock():number  {
        return this.mIndexFirstChangedBlock;
    }

    /**
     * @hide
     */
    setIndexFirstChangedBlock(i:number):void  {
        this.mIndexFirstChangedBlock = i;
    }

    getLineCount():number  {
        return this.mInts.size() - 1;
    }

    getLineTop(line:number):number  {
        return this.mInts.getValue(line, DynamicLayout.TOP);
    }

    getLineDescent(line:number):number  {
        return this.mInts.getValue(line, DynamicLayout.DESCENT);
    }

    getLineStart(line:number):number  {
        return this.mInts.getValue(line, DynamicLayout.START) & DynamicLayout.START_MASK;
    }

    getLineContainsTab(line:number):boolean  {
        return (this.mInts.getValue(line, DynamicLayout.TAB) & DynamicLayout.TAB_MASK) != 0;
    }

    getParagraphDirection(line:number):number  {
        return this.mInts.getValue(line, DynamicLayout.DIR) >> DynamicLayout.DIR_SHIFT;
    }

    getLineDirections(line:number):Layout.Directions  {
        return this.mObjects.getValue(line, 0);
    }

    getTopPadding():number  {
        return this.mTopPadding;
    }

    getBottomPadding():number  {
        return this.mBottomPadding;
    }

    getEllipsizedWidth():number  {
        return this.mEllipsizedWidth;
    }



    getEllipsisStart(line:number):number  {
        if (this.mEllipsizeAt == null) {
            return 0;
        }
        return this.mInts.getValue(line, DynamicLayout.ELLIPSIS_START);
    }

    getEllipsisCount(line:number):number  {
        if (this.mEllipsizeAt == null) {
            return 0;
        }
        return this.mInts.getValue(line, DynamicLayout.ELLIPSIS_COUNT);
    }

    private mBase:String;

    private mDisplay:String;

    private mWatcher;//:DynamicLayout.ChangeWatcher;

    private mIncludePad:boolean;

    private mEllipsize:boolean;

    private mEllipsizedWidth:number = 0;

    private mEllipsizeAt:TextUtils.TruncateAt;

    private mInts:PackedIntVector;

    private mObjects:PackedObjectVector<Layout.Directions>;

    /**
     * Value used in mBlockIndices when a block has been created or recycled and indicating that its
     * display list needs to be re-created.
     * @hide
     */
    static INVALID_BLOCK_INDEX:number = -1;

    // Stores the line numbers of the last line of each block (inclusive)
    private mBlockEndLines:number[];

    // The indices of this block's display list in TextView's internal display list array or
    // INVALID_BLOCK_INDEX if this block has been invalidated during an edition
    private mBlockIndices:number[];

    // Number of items actually currently being used in the above 2 arrays
    private mNumberOfBlocks:number = 0;

    // The first index of the blocks whose locations are changed
    private mIndexFirstChangedBlock:number = 0;

    private mTopPadding:number = 0
    private mBottomPadding:number = 0;

    private static sStaticLayout:StaticLayout = new StaticLayout(null, 0, 0, null, 0, null, null, 1, 0, true);

    private static sLock:any[] = new Array<any>(0);

    private static START:number = 0;

    private static DIR:number = DynamicLayout.START;

    private static TAB:number = DynamicLayout.START;

    private static TOP:number = 1;

    private static DESCENT:number = 2;

    private static COLUMNS_NORMAL:number = 3;

    private static ELLIPSIS_START:number = 3;

    private static ELLIPSIS_COUNT:number = 4;

    private static COLUMNS_ELLIPSIZE:number = 5;

    private static START_MASK:number = 0x1FFFFFFF;

    private static DIR_SHIFT:number = 30;

    private static TAB_MASK:number = 0x20000000;

    private static ELLIPSIS_UNDEFINED:number = 0x80000000;
}

export module DynamicLayout{
//export class ChangeWatcher implements TextWatcher, SpanWatcher {
//
//    constructor( layout:DynamicLayout) {
//        this.mLayout = new WeakReference<DynamicLayout>(layout);
//    }
//
//    private reflow(s:CharSequence, where:number, before:number, after:number):void  {
//        let ml:DynamicLayout = this.mLayout.get();
//        if (ml != null)
//            ml.reflow(s, where, before, after);
//        else if (s instanceof Spannable)
//            (<Spannable> s).removeSpan(this);
//    }
//
//    beforeTextChanged(s:CharSequence, where:number, before:number, after:number):void  {
//    // Intentionally empty
//    }
//
//    onTextChanged(s:CharSequence, where:number, before:number, after:number):void  {
//        this.reflow(s, where, before, after);
//    }
//
//    afterTextChanged(s:Editable):void  {
//    // Intentionally empty
//    }
//
//    onSpanAdded(s:Spannable, o:any, start:number, end:number):void  {
//        if (o instanceof UpdateLayout)
//            this.reflow(s, start, end - start, end - start);
//    }
//
//    onSpanRemoved(s:Spannable, o:any, start:number, end:number):void  {
//        if (o instanceof UpdateLayout)
//            this.reflow(s, start, end - start, end - start);
//    }
//
//    onSpanChanged(s:Spannable, o:any, start:number, end:number, nstart:number, nend:number):void  {
//        if (o instanceof UpdateLayout) {
//            this.reflow(s, start, end - start, end - start);
//            this.reflow(s, nstart, nend - nstart, nend - nstart);
//        }
//    }
//
//    private mLayout:WeakReference<DynamicLayout>;
//}
}

}
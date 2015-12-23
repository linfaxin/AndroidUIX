/**
 * Created by linfaxin on 15/10/29.
 */
///<reference path="Canvas.ts"/>

module android.graphics{

    export class Paint{

        private static FontMetrics_Size_Ascent = -0.9277344;
        private static FontMetrics_Size_Bottom = 0.2709961;
        private static FontMetrics_Size_Descent = 0.24414062;
        private static FontMetrics_Size_Leading = 0;
        private static FontMetrics_Size_Top = -1.05615234;

        static DIRECTION_LTR:number = 0;
        static DIRECTION_RTL:number = 1;

        /**
         * Option for getTextRunCursor to compute the valid cursor after
         * offset or the limit of the context, whichever is less.
         * @hide
         */
        static CURSOR_AFTER:number = 0;

        /**
         * Option for getTextRunCursor to compute the valid cursor at or after
         * the offset or the limit of the context, whichever is less.
         * @hide
         */
        static CURSOR_AT_OR_AFTER:number = 1;

        /**
         * Option for getTextRunCursor to compute the valid cursor before
         * offset or the start of the context, whichever is greater.
         * @hide
         */
        static CURSOR_BEFORE:number = 2;

        /**
         * Option for getTextRunCursor to compute the valid cursor at or before
         * offset or the start of the context, whichever is greater.
         * @hide
         */
        static CURSOR_AT_OR_BEFORE:number = 3;

        /**
         * Option for getTextRunCursor to return offset if the cursor at offset
         * is valid, or -1 if it isn't.
         * @hide
         */
        static CURSOR_AT:number = 4;

        /**
         * Maximum cursor option value.
         */
        private static CURSOR_OPT_MAX_VALUE:number = Paint.CURSOR_AT;


        /**
         * Paint flag that enables antialiasing when drawing.
         *
         * <p>Enabling this flag will cause all draw operations that support
         * antialiasing to use it.</p>
         *
         * @see #Paint(int)
         * @see #setFlags(int)
         */
        static ANTI_ALIAS_FLAG:number = 0x01;

        /**
         * Paint flag that enables bilinear sampling on scaled bitmaps.
         *
         * <p>If cleared, scaled bitmaps will be drawn with nearest neighbor
         * sampling, likely resulting in artifacts. This should generally be on
         * when drawing bitmaps, unless performance-bound (rendering to software
         * canvas) or preferring pixelation artifacts to blurriness when scaling
         * significantly.</p>
         *
         * <p>If bitmaps are scaled for device density at creation time (as
         * resource bitmaps often are) the filtering will already have been
         * done.</p>
         *
         * @see #Paint(int)
         * @see #setFlags(int)
         */
        static FILTER_BITMAP_FLAG:number = 0x02;

        /**
         * Paint flag that enables dithering when blitting.
         *
         * <p>Enabling this flag applies a dither to any blit operation where the
         * target's colour space is more constrained than the source.
         *
         * @see #Paint(int)
         * @see #setFlags(int)
         */
        static DITHER_FLAG:number = 0x04;

        /**
         * Paint flag that applies an underline decoration to drawn text.
         *
         * @see #Paint(int)
         * @see #setFlags(int)
         */
        static UNDERLINE_TEXT_FLAG:number = 0x08;

        /**
         * Paint flag that applies a strike-through decoration to drawn text.
         *
         * @see #Paint(int)
         * @see #setFlags(int)
         */
        static STRIKE_THRU_TEXT_FLAG:number = 0x10;

        /**
         * Paint flag that applies a synthetic bolding effect to drawn text.
         *
         * <p>Enabling this flag will cause text draw operations to apply a
         * simulated bold effect when drawing a {@link Typeface} that is not
         * already bold.</p>
         *
         * @see #Paint(int)
         * @see #setFlags(int)
         */
        static FAKE_BOLD_TEXT_FLAG:number = 0x20;

        /**
         * Paint flag that enables smooth linear scaling of text.
         *
         * <p>Enabling this flag does not actually scale text, but rather adjusts
         * text draw operations to deal gracefully with smooth adjustment of scale.
         * When this flag is enabled, font hinting is disabled to prevent shape
         * deformation between scale factors, and glyph caching is disabled due to
         * the large number of glyph images that will be generated.</p>
         *
         * <p>{@link #SUBPIXEL_TEXT_FLAG} should be used in conjunction with this
         * flag to prevent glyph positions from snapping to whole pixel values as
         * scale factor is adjusted.</p>
         *
         * @see #Paint(int)
         * @see #setFlags(int)
         */
        static LINEAR_TEXT_FLAG:number = 0x40;

        /**
         * Paint flag that enables subpixel positioning of text.
         *
         * <p>Enabling this flag causes glyph advances to be computed with subpixel
         * accuracy.</p>
         *
         * <p>This can be used with {@link #LINEAR_TEXT_FLAG} to prevent text from
         * jittering during smooth scale transitions.</p>
         *
         * @see #Paint(int)
         * @see #setFlags(int)
         */
        static SUBPIXEL_TEXT_FLAG:number = 0x80;

        /** Legacy Paint flag, no longer used. */
        static DEV_KERN_TEXT_FLAG:number = 0x100;

        /** @hide bit mask for the flag enabling subpixel glyph rendering for text */
        static LCD_RENDER_TEXT_FLAG:number = 0x200;

        /**
         * Paint flag that enables the use of bitmap fonts when drawing text.
         *
         * <p>Disabling this flag will prevent text draw operations from using
         * embedded bitmap strikes in fonts, causing fonts with both scalable
         * outlines and bitmap strikes to draw only the scalable outlines, and
         * fonts with only bitmap strikes to not draw at all.</p>
         *
         * @see #Paint(int)
         * @see #setFlags(int)
         */
        static EMBEDDED_BITMAP_TEXT_FLAG:number = 0x400;

        /** @hide bit mask for the flag forcing freetype's autohinter on for text */
        static AUTO_HINTING_TEXT_FLAG:number = 0x800;

        /** @hide bit mask for the flag enabling vertical rendering for text */
        static VERTICAL_TEXT_FLAG:number = 0x1000;

        // we use this when we first create a paint
        static DEFAULT_PAINT_FLAGS:number = Paint.DEV_KERN_TEXT_FLAG | Paint.EMBEDDED_BITMAP_TEXT_FLAG;



        private mTextStyle:Paint.Style;
        private mColor:number;
        private mAlpha:number;
        private mStrokeWidth:number;
        private align:Paint.Align;
        private mStrokeCap:Paint.Cap;
        private mStrokeJoin:Paint.Join;
        private textSize:number;

        private mFlag = 0;

        /**
         * @hide
         */
        hasShadow:boolean;

        /**
         * @hide
         */
        shadowDx:number = 0;

        /**
         * @hide
         */
        shadowDy:number = 0;

        /**
         * @hide
         */
        shadowRadius:number = 0;

        /**
         * @hide
         */
        shadowColor:number = 0;

        drawableState:number[];


        constructor(flag=0){
            this.mFlag = flag;
        }

        /**
         * Copy the fields from src into this paint. This is equivalent to calling
         * get() on all of the src fields, and calling the corresponding set()
         * methods on this.
         */
        set(src:Paint):void  {
            if (this != src) {
                // copy over the native settings
                this.setClassVariablesFrom(src);
            }
        }
        /**
         * Set all class variables using current values from the given
         * {@link Paint}.
         */
        private setClassVariablesFrom(paint:Paint):void  {
            this.mTextStyle = paint.mTextStyle;
            this.mColor = paint.mColor;
            this.mAlpha = paint.mAlpha;
            this.mStrokeWidth = paint.mStrokeWidth;
            this.align = paint.align;
            this.mStrokeCap = paint.mStrokeCap;
            this.mStrokeJoin = paint.mStrokeJoin;
            this.textSize = paint.textSize;
            this.mFlag = paint.mFlag;
            this.hasShadow = paint.hasShadow;
            this.shadowDx = paint.shadowDx;
            this.shadowDy = paint.shadowDy;
            this.shadowRadius = paint.shadowRadius;
            this.shadowColor = paint.shadowColor;
            this.drawableState = paint.drawableState;
            //Object.assign(this, paint);
        }

        /**
         * Return the paint's style, used for controlling how primitives'
         * geometries are interpreted (except for drawBitmap, which always assumes
         * FILL_STYLE).
         *
         * @return the paint's style setting (Fill, Stroke, StrokeAndFill)
         */
        getStyle():Paint.Style  {
            return this.mTextStyle;
        }

        /**
         * Set the paint's style, used for controlling how primitives'
         * geometries are interpreted (except for drawBitmap, which always assumes
         * Fill).
         *
         * @param style The new style to set in the paint
         */
        setStyle(style:Paint.Style):void  {
            this.mTextStyle = style;
        }

        /**
         * Return the paint's flags. Use the Flag enum to test flag values.
         *
         * @return the paint's flags (see enums ending in _Flag for bit masks)
         */
        getFlags():number{
            return this.mFlag;
        }

        /**
         * Set the paint's flags. Use the Flag enum to specific flag values.
         *
         * @param flags The new flag bits for the paint
         */
        setFlags(flags:number):void{
            this.mFlag = flags;
        }

        getTextScaleX():number {
            return 1;
        }
        setTextScaleX(scaleX:number):void {
        }

        getColor():number{
            return this.mColor;
        }
        setColor(color:number){
            this.mColor = color;
        }
        /**
         * Helper to setColor(), that takes a,r,g,b and constructs the color int
         *
         * @param a The new alpha component (0..255) of the paint's color.
         * @param r The new red component (0..255) of the paint's color.
         * @param g The new green component (0..255) of the paint's color.
         * @param b The new blue component (0..255) of the paint's color.
         */
        setARGB(a:number, r:number, g:number, b:number):void  {
            this.setColor((a << 24) | (r << 16) | (g << 8) | b);
        }
        getAlpha():number{
            if(this.mAlpha==null) return 255;
            return this.mAlpha;
        }
        setAlpha(alpha:number){
            this.mAlpha = alpha;
        }

        /**
         * Return the width for stroking.
         * <p />
         * A value of 0 strokes in hairline mode.
         * Hairlines always draws a single pixel independent of the canva's matrix.
         *
         * @return the paint's stroke width, used whenever the paint's style is
         *         Stroke or StrokeAndFill.
         */
        getStrokeWidth():number{
            return this.mStrokeWidth;
        }

        /**
         * Set the width for stroking.
         * Pass 0 to stroke in hairline mode.
         * Hairlines always draws a single pixel independent of the canva's matrix.
         *
         * @param width set the paint's stroke width, used whenever the paint's
         *              style is Stroke or StrokeAndFill.
         */
        setStrokeWidth(width:number):void{
            this.mStrokeWidth = width;
        }

        /**
         * Return the paint's Cap, controlling how the start and end of stroked
         * lines and paths are treated.
         *
         * @return the line cap style for the paint, used whenever the paint's
         *         style is Stroke or StrokeAndFill.
         */
        getStrokeCap():Paint.Cap  {
            return this.mStrokeCap;
        }

        /**
         * Set the paint's Cap.
         *
         * @param cap set the paint's line cap style, used whenever the paint's
         *            style is Stroke or StrokeAndFill.
         */
        setStrokeCap(cap:Paint.Cap):void  {
            this.mStrokeCap = cap;
        }

        /**
         * Return the paint's stroke join type.
         *
         * @return the paint's Join.
         */
        getStrokeJoin():Paint.Join  {
            return this.mStrokeJoin
        }

        /**
         * Set the paint's Join.
         *
         * @param join set the paint's Join, used whenever the paint's style is
         *             Stroke or StrokeAndFill.
         */
        setStrokeJoin(join:Paint.Join):void  {
            this.mStrokeJoin = join;
        }



        setAntiAlias(enable:boolean){
            //no effect on web canvas
            //http://stackoverflow.com/questions/4261090/html5-canvas-and-anti-aliasing
        }
        isAntiAlias():boolean {
            //default true on web canvas
            return true;
        }

        /**
         * This draws a shadow layer below the main layer, with the specified
         * offset and color, and blur radius. If radius is 0, then the shadow
         * layer is removed.
         */
        setShadowLayer(radius:number, dx:number, dy:number, color:number):void  {
            this.hasShadow = radius > 0.0;
            this.shadowRadius = radius;
            this.shadowDx = dx;
            this.shadowDy = dy;
            this.shadowColor = color;
        }

        /**
         * Clear the shadow layer.
         */
        clearShadowLayer():void  {
            this.hasShadow = false;
        }

        /**
         * Return the paint's Align value for drawing text. This controls how the
         * text is positioned relative to its origin. LEFT align means that all of
         * the text will be drawn to the right of its origin (i.e. the origin
         * specifieds the LEFT edge of the text) and so on.
         *
         * @return the paint's Align value for drawing text.
         */
        getTextAlign():Paint.Align  {
            return this.align;
        }

        /**
         * Set the paint's text alignment. This controls how the
         * text is positioned relative to its origin. LEFT align means that all of
         * the text will be drawn to the right of its origin (i.e. the origin
         * specifieds the LEFT edge of the text) and so on.
         *
         * @param align set the paint's Align value for drawing text.
         */
        setTextAlign(align:Paint.Align){
            this.align = align;
        }

        /**
         * Return the paint's text size.
         *
         * @return the paint's text size.
         */
        getTextSize():number{
            return this.textSize;
        }

        /**
         * Set the paint's text size. This value must be > 0
         *
         * @param textSize set the paint's text size.
         */
        setTextSize(textSize:number){
            this.textSize = textSize;
        }


        /**
         * Return the distance above (negative) the baseline (ascent) based on the
         * current typeface and text size.
         *
         * @return the distance above (negative) the baseline (ascent) based on the
         *         current typeface and text size.
         */
        ascent():number {
            return this.textSize * Paint.FontMetrics_Size_Ascent;
        }

        /**
         * Return the distance below (positive) the baseline (descent) based on the
         * current typeface and text size.
         *
         * @return the distance below (positive) the baseline (descent) based on
         *         the current typeface and text size.
         */
        descent():number {
            return this.textSize * Paint.FontMetrics_Size_Descent;
        }

        /**
         * Return the font's interline spacing, given the Paint's settings for
         * typeface, textSize, etc. If metrics is not null, return the fontmetric
         * values in it. Note: all values have been converted to integers from
         * floats, in such a way has to make the answers useful for both spacing
         * and clipping. If you want more control over the rounding, call
         * getFontMetrics().
         *
         * @return the font's interline spacing.
         */
        getFontMetricsInt(fmi:Paint.FontMetricsInt):number {
            if(fmi==null){
                return Math.floor((Paint.FontMetrics_Size_Descent - Paint.FontMetrics_Size_Ascent) * this.textSize);
            }
            fmi.ascent = Math.floor(Paint.FontMetrics_Size_Ascent * this.textSize);
            fmi.bottom = Math.floor(Paint.FontMetrics_Size_Bottom * this.textSize);
            fmi.descent = Math.floor(Paint.FontMetrics_Size_Descent * this.textSize);
            fmi.leading = Math.floor(Paint.FontMetrics_Size_Leading * this.textSize);
            fmi.top = Math.floor(Paint.FontMetrics_Size_Top * this.textSize);
            return fmi.descent - fmi.ascent;
        }

        /**
         * Return the font's recommended interline spacing, given the Paint's
         * settings for typeface, textSize, etc. If metrics is not null, return the
         * fontmetric values in it.
         *
         * @param metrics If this object is not null, its fields are filled with
         *                the appropriate values given the paint's text attributes.
         * @return the font's recommended interline spacing.
         */
        getFontMetrics(metrics:Paint.FontMetrics):number {
            if(metrics==null){
                return (Paint.FontMetrics_Size_Descent - Paint.FontMetrics_Size_Ascent) * this.textSize;
            }
            metrics.ascent = Paint.FontMetrics_Size_Ascent * this.textSize;
            metrics.bottom = Paint.FontMetrics_Size_Bottom * this.textSize;
            metrics.descent = Paint.FontMetrics_Size_Descent * this.textSize;
            metrics.leading = Paint.FontMetrics_Size_Leading * this.textSize;
            metrics.top = Paint.FontMetrics_Size_Top * this.textSize;
            return metrics.descent - metrics.ascent;
        }

        /**
         * Return the width of the text.
         *
         * @param text  The text to measure. Cannot be null.
         * @param index The index of the first character to start measuring
         * @param count THe number of characters to measure, beginning with start
         * @return      The width of the text
         */
        measureText(text:string, index=0, count=text.length):number  {
            return Canvas.measureText(text.substr(index, count), this.textSize);
        }

        /**
         * Return the advance widths for the characters in the string.
         *
         * @param text     The text to measure. Cannot be null.
         * @param index    The index of the first char to to measure
         * @param count    The number of chars starting with index to measure
         * @param widths   array to receive the advance widths of the characters.
         *                 Must be at least a large as count.
         * @return         the actual number of widths returned.
         */
        getTextWidths_count(text:string, index:number, count:number, widths:number[]):number  {
            return this.getTextWidths_end(text, index, index+count, widths);
        }
        /**
         * Return the advance widths for the characters in the string.
         *
         * @param text   The text to measure. Cannot be null.
         * @param start  The index of the first char to to measure
         * @param end    The end of the text slice to measure
         * @param widths array to receive the advance widths of the characters.
         *               Must be at least a large as the text.
         * @return       the number of unichars in the specified text.
         */
        getTextWidths_end(text:string, start:number, end:number, widths:number[]):number  {
            if (text == null) {
                throw Error(`new IllegalArgumentException("text cannot be null")`);
            }
            if ((start | end | (end - start) | (text.length - end)) < 0) {
                throw Error(`new IndexOutOfBoundsException()`);
            }
            if (end - start > widths.length) {
                throw Error(`new ArrayIndexOutOfBoundsException()`);
            }
            if (text.length == 0 || start == end) {
                return 0;
            }

            for (let i = start; i < end; i++) {
                widths[i-start] = this.measureText(text[i]);
            }
            return end - start;
        }

        /**
         * Return the advance widths for the characters in the string.
         *
         * @param text   The text to measure
         * @param widths array to receive the advance widths of the characters.
         *               Must be at least a large as the text.
         * @return       the number of unichars in the specified text.
         */
        getTextWidths_2(text:string, widths:number[]):number  {
            return this.getTextWidths_end(text, 0, text.length, widths);
        }

        /**
         * @hide
         */
        getTextRunAdvances_count(chars:string, index:number, count:number, contextIndex:number, contextCount:number,
                           flags:number, advances:number[], advancesIndex:number):number  {
            return this.getTextRunAdvances_end(chars, index, index+count, contextIndex, contextCount, flags, advances, advancesIndex);
        }

        /**
         * @hide
         */
        getTextRunAdvances_end(text:string, start:number, end:number, contextStart:number, contextEnd:number,
                               flags:number, advances:number[], advancesIndex:number):number  {
            if (text == null) {
                throw Error(`new IllegalArgumentException("text cannot be null")`);
            }
            if (flags != Paint.DIRECTION_LTR && flags != Paint.DIRECTION_RTL) {
                throw Error(`new IllegalArgumentException("unknown flags value: " + flags)`);
            }
            if ((start | end | contextStart | contextEnd | advancesIndex | (end - start)
                | (start - contextStart) | (contextEnd - end) | (text.length - contextEnd)
                | (advances == null ? 0 : (advances.length - advancesIndex - (end - start)))) < 0) {
                throw Error(`new IndexOutOfBoundsException()`);
            }
            if (text.length == 0 || start == end) {
                return 0;
            }

            let totalAdvance = 0;
            for (let i = start; i < end; i++) {
                let width = this.measureText(text[i]);
                if(advances) advances[i-start+advancesIndex] = width;
                totalAdvance += width;
            }
            return totalAdvance;
        }


        /**
         * Returns the next cursor position in the run.  This avoids placing the
         * cursor between surrogates, between characters that form conjuncts,
         * between base characters and combining marks, or within a reordering
         * cluster.
         *
         * <p>ContextStart and offset are relative to the start of text.
         * The context is the shaping context for cursor movement, generally
         * the bounds of the metric span enclosing the cursor in the direction of
         * movement.
         *
         * <p>If cursorOpt is {@link #CURSOR_AT} and the offset is not a valid
         * cursor position, this returns -1.  Otherwise this will never return a
         * value before contextStart or after contextStart + contextLength.
         *
         * @param text the text
         * @param contextStart the start of the context
         * @param contextLength the length of the context
         * @param flags either {@link #DIRECTION_RTL} or {@link #DIRECTION_LTR}
         * @param offset the cursor position to move from
         * @param cursorOpt how to move the cursor, one of {@link #CURSOR_AFTER},
         * {@link #CURSOR_AT_OR_AFTER}, {@link #CURSOR_BEFORE},
         * {@link #CURSOR_AT_OR_BEFORE}, or {@link #CURSOR_AT}
         * @return the offset of the next position, or -1
         * @hide
         */
        getTextRunCursor_len(text:string, contextStart:number, contextLength:number, flags:number, offset:number, cursorOpt:number):number {
            let contextEnd:number = contextStart + contextLength;
            if (((contextStart | contextEnd | offset | (contextEnd - contextStart) | (offset - contextStart) | (contextEnd - offset)
                | (text.length - contextEnd) | cursorOpt) < 0) || cursorOpt > Paint.CURSOR_OPT_MAX_VALUE) {
                throw Error(`new IndexOutOfBoundsException()`);
            }
            const scalarArray = new Array<number>(contextLength);
            this.getTextRunAdvances_count(text, contextStart, contextLength, contextStart, contextLength, flags, scalarArray, 0);
            let pos = offset - contextStart;
            switch (cursorOpt) {
                case Paint.CURSOR_AFTER:
                    if (pos < contextLength) {
                        pos += 1;
                    }
                // fall through
                case Paint.CURSOR_AT_OR_AFTER:
                    while (pos < contextLength && scalarArray[pos] == 0) {
                        ++pos;
                    }
                    break;
                case Paint.CURSOR_BEFORE:
                    if (pos > 0) {
                        --pos;
                    }
                // fall through
                case Paint.CURSOR_AT_OR_BEFORE:
                    while (pos > 0 && scalarArray[pos] == 0) {
                        --pos;
                    }
                    break;
                case Paint.CURSOR_AT:
                default:
                    if (scalarArray[pos] == 0) {
                        pos = -1;
                    }
                    break;
            }

            if (pos != -1) {
                pos += contextStart;
            }

            return pos;
        }

        /**
         * Returns the next cursor position in the run.  This avoids placing the
         * cursor between surrogates, between characters that form conjuncts,
         * between base characters and combining marks, or within a reordering
         * cluster.
         *
         * <p>ContextStart, contextEnd, and offset are relative to the start of
         * text.  The context is the shaping context for cursor movement, generally
         * the bounds of the metric span enclosing the cursor in the direction of
         * movement.
         *
         * <p>If cursorOpt is {@link #CURSOR_AT} and the offset is not a valid
         * cursor position, this returns -1.  Otherwise this will never return a
         * value before contextStart or after contextEnd.
         *
         * @param text the text
         * @param contextStart the start of the context
         * @param contextEnd the end of the context
         * @param flags either {@link #DIRECTION_RTL} or {@link #DIRECTION_LTR}
         * @param offset the cursor position to move from
         * @param cursorOpt how to move the cursor, one of {@link #CURSOR_AFTER},
         * {@link #CURSOR_AT_OR_AFTER}, {@link #CURSOR_BEFORE},
         * {@link #CURSOR_AT_OR_BEFORE}, or {@link #CURSOR_AT}
         * @return the offset of the next position, or -1
         * @hide
         */
        getTextRunCursor_end(text:string, contextStart:number, contextEnd:number, flags:number, offset:number, cursorOpt:number):number  {
            if (((contextStart | contextEnd | offset | (contextEnd - contextStart) | (offset - contextStart) | (contextEnd - offset)
                | (text.length - contextEnd) | cursorOpt) < 0) || cursorOpt > Paint.CURSOR_OPT_MAX_VALUE) {
                throw Error(`new IndexOutOfBoundsException()`);
            }
            let contextLen:number = contextEnd - contextStart;
            return this.getTextRunCursor_len(text, 0, contextLen, flags, offset - contextStart, cursorOpt);
        }

        applyToCanvas(canvas:Canvas){

            if(this.mColor!=null) {
                canvas.setColor(this.mColor, this.getStyle());
            }

            if(this.mAlpha!=null){
                canvas.multiplyAlpha(this.mAlpha);
            }

            if(this.align!=null){
                canvas.setTextAlign(Paint.Align[this.align].toLowerCase());
            }
            if(this.mStrokeWidth!=null){
                canvas.setLineWidth(this.mStrokeWidth);
            }
            if(this.mStrokeCap!=null){
                canvas.setLineCap(Paint.Cap[this.mStrokeCap].toLowerCase());
            }
            if(this.mStrokeJoin!=null){
                canvas.setLineJoin(Paint.Join[this.mStrokeJoin].toLowerCase());
            }

            if(this.hasShadow){
                canvas.setShadow(this.shadowRadius, this.shadowDx, this.shadowDy, this.shadowColor);
            }

            if(this.textSize!=null){
                canvas.setFontSize(this.textSize);
            }
        }
    }

    export module Paint{

        export enum Align{
            LEFT,
            CENTER,
            RIGHT,
        }

        /**
         * Class that describes the various metrics for a font at a given text size.
         * Remember, Y values increase going down, so those values will be positive,
         * and values that measure distances going up will be negative. This class
         * is returned by getFontMetrics().
         */
        export class FontMetrics {

            /**
             * The maximum distance above the baseline for the tallest glyph in
             * the font at a given text size.
             */
            top:number = 0;

            /**
             * The recommended distance above the baseline for singled spaced text.
             */
            ascent:number = 0;

            /**
             * The recommended distance below the baseline for singled spaced text.
             */
            descent:number = 0;

            /**
             * The maximum distance below the baseline for the lowest glyph in
             * the font at a given text size.
             */
            bottom:number = 0;

            /**
             * The recommended additional space to add between lines of text.
             */
            leading:number = 0;
        }

        /**
         * Convenience method for callers that want to have FontMetrics values as
         * integers.
         */
        export class FontMetricsInt {

            top:number = 0;

            ascent:number = 0;

            descent:number = 0;

            bottom:number = 0;

            leading:number = 0;

            toString():string  {
                return "FontMetricsInt: top=" + this.top + " ascent=" + this.ascent + " descent=" + this.descent + " bottom=" + this.bottom + " leading=" + this.leading;
            }
        }

        /**
         * The Style specifies if the primitive being drawn is filled, stroked, or
         * both (in the same color). The default is FILL.
         */
        export enum Style {

            /**
             * Geometry and text drawn with this style will be filled, ignoring all
             * stroke-related settings in the paint.
             */
            FILL,
            /**
             * Geometry and text drawn with this style will be stroked, respecting
             * the stroke-related fields on the paint.
             */
            STROKE,
            /**
             * Geometry and text drawn with this style will be both filled and
             * stroked at the same time, respecting the stroke-related fields on
             * the paint. This mode can give unexpected results if the geometry
             * is oriented counter-clockwise. This restriction does not apply to
             * either FILL or STROKE.
             */
            FILL_AND_STROKE
        }

            /**
             * The Cap specifies the treatment for the beginning and ending of
             * stroked lines and paths. The default is BUTT.
             */
        export enum Cap {

            /**
             * The stroke ends with the path, and does not project beyond it.
             */
            BUTT,
            /**
             * The stroke projects out as a semicircle, with the center at the
             * end of the path.
             */
            ROUND,
            /**
             * The stroke projects out as a square, with the center at the end
             * of the path.
             */
            SQUARE
        }

            /**
             * The Join specifies the treatment where lines and curve segments
             * join on a stroked path. The default is MITER.
             */
        export enum Join {

            /**
             * The outer edges of a join meet at a sharp angle
             */
            MITER,
            /**
             * The outer edges of a join meet in a circular arc.
             */
            ROUND,
            /**
             * The outer edges of a join meet with a straight line
             */
            BEVEL

        }
    }
}
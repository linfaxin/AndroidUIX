/**
 * Created by linfaxin on 15/10/29.
 */
///<reference path="Canvas.ts"/>

module android.graphics{
    export class Paint{
        private mTextStyle:Paint.Style;
        private mColor:number;
        private mAlpha:number;
        private mStrokeWidth:number;
        private align:Paint.Align;
        private mStrokeCap:Paint.Cap;
        private mStrokeJoin:Paint.Join;
        private textSize:number;

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


        private static _measureTextContext = document.createElement('canvas').getContext('2d');
        /**
         * Return the width of the text.
         *
         * @param text  The text to measure. Cannot be null.
         * @param index The index of the first character to start measuring
         * @param count THe number of characters to measure, beginning with start
         * @return      The width of the text
         */
        measureText(text:string, index=0, count=text.length):number  {
            if(this.textSize!=null){
                let fontParts = Paint._measureTextContext.font.split(' ');
                Paint._measureTextContext.font = this.textSize + ' ' + fontParts[fontParts.length-1];
            }else{
                Paint._measureTextContext.font = '';
            }
            return Paint._measureTextContext.measureText(text.substr(index, count)).width;
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
        getTextWidths(text:string, start:number, end:number, widths:number[]):number  {
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
                widths[i] = this.measureText(text[i]);
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
            return this.getTextWidths(text, 0, text.length, widths);
        }

        _setToCanvasContent(context:CanvasRenderingContext2D){

            if(Number.isInteger(this.mColor)) {
                context.fillStyle = Color.toRGBAFunc(this.mColor);
            }

            if(this.align!=null){
                context.textAlign = Paint.Align[this.align].toLowerCase();
            }
            if(this.mStrokeWidth!=null){
                context.lineWidth = this.mStrokeWidth;
            }
            if(this.mStrokeCap!=null){
                context.lineCap = Paint.Cap[this.mStrokeCap].toLowerCase();
            }
            if(this.mStrokeJoin!=null){
                context.lineJoin = Paint.Join[this.mStrokeJoin].toLowerCase();
            }

            if(this.hasShadow){
                context.shadowBlur = this.shadowRadius;
                context.shadowOffsetX = this.shadowDx;
                context.shadowOffsetY = this.shadowDy;
                context.shadowColor = Color.toRGBAFunc(this.shadowColor);
            }

            //font
            let fontStyles = [];
            if(this.textSize!=null){
                fontStyles.push(this.textSize+'px');
            }
            if(fontStyles.length>0){
                let fontParts = context.font.split(' ');
                fontStyles.push(fontParts[fontParts.length-1]);
                context.font = fontStyles.join(' ');
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
/**
 * Created by linfaxin on 15/10/26.
 */
///<reference path="../view/View.ts"/>
///<reference path="../view/Gravity.ts"/>
///<reference path="../content/res/Resources.ts"/>
///<reference path="../graphics/Color.ts"/>
///<reference path="../content/res/ColorStateList.ts"/>
///<reference path="../util/TypedValue.ts"/>
///<reference path="../R/color.ts"/>

module android.widget{
    import View = android.view.View;
    import Gravity = android.view.Gravity;
    import Resources = android.content.res.Resources;
    import Color = android.graphics.Color;
    import ColorStateList = android.content.res.ColorStateList;
    import MeasureSpec = View.MeasureSpec;
    import TypedValue = android.util.TypedValue;

    //FIXME current impl: use dom element to draw the text
    //FIXME may should change to draw by canvas later
    export class TextView extends View{
        private static Default_TextSize = 14;

        private mText:string;
        private mHint:string;
        private mGravity;
        private mSingleLine = false;
        private mTextSize; //default 14 dp
        private mTextColor = ColorStateList.valueOf(Color.BLACK);
        private mCurTextColor = Color.BLACK;
        private mHintColor = Color.LTGRAY;
        private mSpacingMult = 1.2;
        private mSpacingAdd = 0;

        private mMaxWidth = Number.MAX_SAFE_INTEGER;
        private mMaxHeight = Number.MAX_SAFE_INTEGER;
        private mMaxLineCount = Number.MAX_SAFE_INTEGER;
        private mMinLineCount = 0;

        private mTextElement : HTMLElement;//display with this element

        constructor() {
            super();
            this.initTextElement();
            this.setTextSize(TextView.Default_TextSize);
            this.setGravity(Gravity.TOP | Gravity.LEFT);
            this.setTextColor(android.R.color.textView_textColor);
        }


        createAttrChangeHandler(mergeHandler:android.view.View.AttrChangeHandler):void {
            super.createAttrChangeHandler(mergeHandler);
            let textView = this;
            mergeHandler.add({
                set enabled(value){
                    textView.setEnabled(mergeHandler.parseBoolean(value, true));
                },
                get enabled():any{
                    return textView.isEnabled();
                },
                set textColorHighlight(value){
                },
                set textColor(value){
                    let colorList = mergeHandler.parseColorList(value);
                    if(colorList instanceof ColorStateList){
                        textView.setTextColor(colorList);
                        return;
                    }
                    let color = mergeHandler.parseColor(value);
                    if(Number.isInteger(color)) textView.setTextColor(color);
                },
                get textColor():any{
                    if(textView.mTextColor.isStateful()) return textView.mTextColor;
                    return textView.mTextColor.getDefaultColor();
                },
                set textColorHint(value){

                },
                set textSize(value){
                    if(value !== undefined && value !== null){
                        value = TypedValue.complexToDimensionPixelSize(value, 0, Resources.getDisplayMetrics());
                        textView.setTextSize(value);
                    }
                },
                get textSize(){
                    return textView.mTextSize;
                },
                set textStyle(value){

                },
                set textAllCaps(value){

                },

                set drawableLeft(value){

                },
                set drawableTop(value){

                },
                set drawableRight(value){

                },
                set drawableBottom(value){

                },
                set drawablePadding(value){

                },
                set maxLines(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) textView.setMaxLines(value);
                },
                get maxLines():any{
                    return textView.mMaxLineCount;
                },
                set maxHeight(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) textView.setMaxHeight(value);
                },
                get maxHeight():any{
                    return textView.mMaxHeight;
                },
                set lines(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) textView.setLines(value);
                },
                get lines():any{
                    if(textView.mMaxLineCount === textView.mMinLineCount) return textView.mMaxLineCount;
                    return null;
                },
                set height(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) textView.setHeight(value);
                },
                get height():any{
                    if(textView.mMaxHeight === textView.getMinimumHeight()) return textView.mMaxHeight;
                    return null;
                },
                set minLines(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) textView.setMinLines(value);
                },
                get minLines():any{
                    return textView.mMinLineCount;
                },
                set minHeight(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) textView.setMinimumHeight(value);
                },
                set maxWidth(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) textView.setMaxWidth(value);
                },
                get maxWidth():any{
                    return textView.mMaxWidth;
                },
                set width(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) textView.setWidth(value);
                },
                get width():any{
                    if(textView.mMinWidth === textView.mMaxWidth) return textView.mMinWidth;
                    return null;
                },
                set gravity(value){
                    textView.setGravity(View.AttrChangeHandler.parseGravity(value, textView.mGravity));
                },
                get gravity():any{
                    return textView.mGravity;
                },
                set text(value){
                    textView.setText(value);
                },
                get text():any{
                    return textView.getText();
                },
                set singleLine(value){
                    if(View.AttrChangeHandler.parseBoolean(value, false)) textView.setSingleLine();
                },
                get singleLine(){
                    if(textView.mMinLineCount===1 && textView.mMaxLineCount===1) return true;
                    return false;
                },
                set textScaleX(value){
                },
                set lineSpacingExtra(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) textView.setLineSpacing(value, textView.mSpacingMult);
                },
                get lineSpacingExtra():any{
                    return textView.mSpacingAdd;
                },
                set lineSpacingMultiplier(value){
                    value = Number.parseInt(value);
                    if(Number.isInteger(value)) textView.setLineSpacing(textView.mSpacingAdd, value);
                },
                get lineSpacingMultiplier():any{
                    return textView.mSpacingMult;
                },
            })
        }

        private initTextElement(){
            this.mTextElement = document.createElement('div');
            this.mTextElement.style.position = "absolute";
            this.mTextElement.style.boxSizing = "border-box";
            this.mTextElement.style.overflow = "hidden";
            this.mTextElement.style.opacity = "0";//make context hide  before layout
        }


        initBindElement(bindElement:HTMLElement, rootElement:HTMLElement):void {
            super.initBindElement(bindElement, rootElement);
            this.bindElement.appendChild(this.mTextElement);
        }

        onLayout(changed:boolean, left:number, top:number, right:number, bottom:number):void {
            super.onLayout(changed, left, top, right, bottom);
            this.mTextElement.style.opacity = "";//layout ok
        }

        onFinishInflate():void {
            super.onFinishInflate();
            Array.from(this.bindElement.childNodes).forEach((item:Node)=>{
                if(item===this.mTextElement) return;
                this.bindElement.removeChild(item);
                this.mTextElement.appendChild(item);
            });
        }

        onMeasure(widthMeasureSpec:any, heightMeasureSpec:any):void {
            let widthMode = MeasureSpec.getMode(widthMeasureSpec);
            let heightMode = MeasureSpec.getMode(heightMeasureSpec);
            let widthSize = MeasureSpec.getSize(widthMeasureSpec);
            let heightSize = MeasureSpec.getSize(heightMeasureSpec);

            let width:number, height:number;
            let padLeft = this.getCompoundPaddingLeft();
            let padTop = this.getCompoundPaddingTop();
            let padRight = this.getCompoundPaddingRight();
            let padBottom = this.getCompoundPaddingBottom();

            this.mTextElement.style.height = "";
            this.mTextElement.style.width = "";
            this.mTextElement.style.left = -Resources.getDisplayMetrics().widthPixels + 'px';//measure width no limit
            this.mTextElement.style.top = "";

            if (widthMode == MeasureSpec.EXACTLY) {
                // Parent has told us how big to be. So be it.
                width = widthSize;

            } else {
                width = this.mTextElement.offsetWidth + 2;//more space (some case may wrap word)

                width += padLeft + padRight;

                width = Math.min(width, this.mMaxWidth);
                //width = Math.max(width, this.mMinWidth);

                // Check against our minimum width
                width = Math.max(width, this.getSuggestedMinimumWidth());
                if (widthMode == MeasureSpec.AT_MOST) {
                    width = Math.min(widthSize, width);
                }
            }

            let unpaddedWidth = width - padLeft - padRight;
            //let unpaddedWidth = want;

            this.mTextElement.style.width = unpaddedWidth + "px";
            this.mTextElement.style.left = padLeft + "px";

            if (heightMode == MeasureSpec.EXACTLY) {
                // Parent has told us how big to be. So be it.
                height = heightSize;
                //mDesiredHeightAtMeasure = -

                let pad = this.getCompoundPaddingTop() + this.getCompoundPaddingBottom();
                if(this.mMaxLineCount < Number.MAX_SAFE_INTEGER) {
                    let maxHeightWithLineCount = pad + this.mMaxLineCount * this.getLineHeight();
                    height = Math.min(maxHeightWithLineCount, height);
                }

            } else {

                let desired = this.getDesiredHeight();

                height = desired;
                //mDesiredHeightAtMeasure = desired;

                if (heightMode == MeasureSpec.AT_MOST) {
                    height = Math.min(desired, heightSize);
                }
            }

            let contextHeight = height - padTop - padBottom;
            let textHeight = this.mTextElement.offsetHeight;
            let finalTop = padTop;
            if(textHeight<contextHeight){
                const verticalGravity = this.mGravity & Gravity.VERTICAL_GRAVITY_MASK;
                switch (verticalGravity) {
                    case Gravity.CENTER_VERTICAL:
                        finalTop += (contextHeight - textHeight) / 2;
                        break;
                    case Gravity.BOTTOM:
                        finalTop += (contextHeight - textHeight);
                        break;
                    case Gravity.TOP:
                        break;
                }
                contextHeight = textHeight;
            }

            this.mTextElement.style.height = contextHeight + "px";
            this.mTextElement.style.top = finalTop + "px";

            this.setMeasuredDimension(width, height);
        }

        private getDesiredHeight():number{
            let desired = this.mTextElement.offsetHeight;
            let pad = this.getCompoundPaddingTop() + this.getCompoundPaddingBottom();
            desired += pad;
            desired = Math.min(this.mMaxHeight, desired);

            if(this.mMaxLineCount < Number.MAX_SAFE_INTEGER) {
                let maxHeightWithLineCount = pad + this.mMaxLineCount * this.getLineHeight();
                desired = Math.min(maxHeightWithLineCount, desired);
            }

            if(this.mMinLineCount>0) {
                let minHeightWithLineCount = pad + this.mMinLineCount * this.getLineHeight();
                desired = Math.max(minHeightWithLineCount, desired);
            }

            // Check against our minimum height
            desired = Math.max(desired, this.getSuggestedMinimumHeight());
            return desired;
        }


        onDraw(canvas:android.graphics.Canvas) {
            //update text color
            let r = Color.red(this.mCurTextColor);
            let g = Color.green(this.mCurTextColor);
            let b = Color.blue(this.mCurTextColor);
            let a = Color.alpha(this.mCurTextColor);
            this.mTextElement.style.color = `rgba(${r}, ${g}, ${b}, ${a/255})`;
            //this.mTextElement.style.opacity = a / 255 + '';

            return super.onDraw(canvas);
        }

        setTextColor(color:number|ColorStateList){
            if(Number.isInteger(<number>color)){
                this.mTextColor = ColorStateList.valueOf(<number>color);

            }else{
                if (color === null || color === undefined) {
                    throw new Error('colors is null');
                }
                this.mTextColor = <ColorStateList>color;
            }
            this.updateTextColors();
        }
        getTextColors():ColorStateList {
            return this.mTextColor;
        }
        getCurrentTextColor():number {
            return this.mCurTextColor;
        }
        private updateTextColors() {
            let inval = false;
            let color = this.mTextColor.getColorForState(this.getDrawableState(), 0);
            if (color != this.mCurTextColor) {
                this.mCurTextColor = color;
                inval = true;
            }
            //if (mLinkTextColor != null) {
            //    color = mLinkTextColor.getColorForState(getDrawableState(), 0);
            //    if (color != mTextPaint.linkColor) {
            //        mTextPaint.linkColor = color;
            //        inval = true;
            //    }
            //}
            //if (mHintTextColor != null) {
            //    color = mHintTextColor.getColorForState(getDrawableState(), 0);
            //    if (color != mCurHintTextColor && mText.length() == 0) {
            //        mCurHintTextColor = color;
            //        inval = true;
            //    }
            //}
            if (inval) {
                // Text needs to be redrawn with the new color
                //if (mEditor != null) mEditor.invalidateTextDisplayList();
                this.invalidate();
            }
        }
        drawableStateChanged() {
            super.drawableStateChanged();
            if (this.mTextColor != null && this.mTextColor.isStateful()
                //|| (mHintTextColor != null && mHintTextColor.isStateful())
                //|| (mLinkTextColor != null && mLinkTextColor.isStateful())
            ) {
                this.updateTextColors();
            }
        }

        getCompoundPaddingTop():number {
            return this.mPaddingTop;
        }
        getCompoundPaddingBottom():number {
            return this.mPaddingBottom;
        }
        getCompoundPaddingLeft():number {
            return this.mPaddingLeft;
        }
        getCompoundPaddingRight():number {
            return this.mPaddingRight;
        }

        setGravity(gravity:number){

            //horizontal don't need relayout
            switch (gravity & Gravity.HORIZONTAL_GRAVITY_MASK) {
                case Gravity.CENTER_HORIZONTAL:
                    this.mTextElement.style.textAlign = "center";
                    break;
                case Gravity.RIGHT:
                    this.mTextElement.style.textAlign = "right";
                    break;
                case Gravity.LEFT:
                    this.mTextElement.style.textAlign = "left";
                    break;
            }

            //horizontal gravity don need relayout
            if ((gravity & Gravity.VERTICAL_GRAVITY_MASK) !=
                (this.mGravity & Gravity.VERTICAL_GRAVITY_MASK)) {
                this.requestLayout();
            }
            this.mGravity = gravity;
        }

        setLineSpacing(add:number, mult:number){
            if (this.mSpacingAdd != add || this.mSpacingMult != mult) {
                this.mSpacingAdd = add;
                this.mSpacingMult = mult;

                this.setTextSize(this.mTextSize);
            }
        }

        setTextSizeInPx(sizeInPx:number){
            if(this.mTextSize!==sizeInPx) {
                this.mTextSize = sizeInPx;
                this.mTextElement.style.fontSize = sizeInPx + "px";
                this.mTextElement.style.lineHeight = this.getLineHeight() + "px";
                this.requestLayout();
            }
        }

        setTextSize(size:number){
            let sizeInPx = size * Resources.getDisplayMetrics().density;
            this.setTextSizeInPx(sizeInPx);
        }

        getLineHeight():number{
            return Math.ceil(this.mTextSize * this.mSpacingMult + this.mSpacingAdd);//line height should be Int in style
        }

        setHeight(pixels:number) {
            this.mMaxHeight = pixels;
            this.setMinimumHeight(pixels);

            this.requestLayout();
            this.invalidate();
        }
        setMaxLines(max:number){
            this.mMaxLineCount = max;
            this.requestLayout();
            this.invalidate();
        }
        getMaxLines():number{
            return this.mMaxLineCount;
        }
        setMaxHeight(maxHeight:number) {
            this.mMaxHeight = maxHeight;
            this.requestLayout();
            this.invalidate();
        }
        getMaxHeight():number{
            return this.mMaxHeight;
        }
        setMaxWidth(maxpixels:number) {
            this.mMaxWidth = maxpixels;
            this.requestLayout();
            this.invalidate();
        }
        getMaxWidth() {
            return this.mMaxWidth;
        }
        setWidth(pixels:number) {
            this.mMaxWidth = pixels;
            this.setMinimumWidth(pixels);

            this.requestLayout();
            this.invalidate();
        }
        setMinLines(min:number){
            this.mMinLineCount = min;
            this.requestLayout();
            this.invalidate();
        }
        getMinLines(){
            return this.mMinLineCount;
        }
        setSingleLine(singleLine=true){
            if(singleLine) this.setLines(1);
            else{
                this.mMaxLineCount = Number.MAX_SAFE_INTEGER;
                this.mMinLineCount = 0;
                this.requestLayout();
                this.invalidate();
            }
        }
        setLines(lines:number){
            this.mMaxLineCount = this.mMinLineCount = lines;
            this.requestLayout();
            this.invalidate();
        }

        setText(text=''){
            this.mTextElement.innerText = text;
            this.requestLayout();
        }

        getText():string{
            return this.mTextElement.innerText;
        }

        setHtml(html:string){
            this.mTextElement.innerHTML = html;
            this.requestLayout();
        }

        getHtml():string{
            return this.mTextElement.innerHTML;
        }

        getTextElement():HTMLElement{
            return this.mTextElement;
        }

    }

}
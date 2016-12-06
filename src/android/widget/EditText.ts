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

///<reference path="../../android/text/Spannable.ts"/>
///<reference path="../../android/text/TextUtils.ts"/>
///<reference path="../../android/widget/TextView.ts"/>
///<reference path="../../android/content/Context.ts"/>
///<reference path="../../android/graphics/Color.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/text/InputType.ts"/>
///<reference path="../../android/text/method/PasswordTransformationMethod.ts"/>
///<reference path="../../androidui/util/Platform.ts"/>

module android.widget {
import Spannable = android.text.Spannable;
import TextUtils = android.text.TextUtils;
import TextView = android.widget.TextView;
import View = android.view.View;
import Gravity = android.view.Gravity;
import Context = android.content.Context;
import Color = android.graphics.Color;
import Canvas = android.graphics.Canvas;
import Integer = java.lang.Integer;
import InputType = android.text.InputType;
import PasswordTransformationMethod = android.text.method.PasswordTransformationMethod;
import Platform = androidui.util.Platform;
    import AttrBinder = androidui.attr.AttrBinder;


/**
 * EditText is a thin veneer over TextView that configures itself
 * to be editable.
 *
 * <p>See the <a href="{@docRoot}guide/topics/ui/controls/text.html">Text Fields</a>
 * guide.</p>
 * <p>
 * <b>XML attributes</b>
 * <p>
 * See {@link android.R.styleable#EditText EditText Attributes},
 * {@link android.R.styleable#TextView TextView Attributes},
 * {@link android.R.styleable#View View Attributes}
 */
export class EditText extends TextView {
    private inputElement:HTMLTextAreaElement|HTMLInputElement;
    private mSingleLineInputElement:HTMLInputElement;
    private mMultiLineInputElement:HTMLTextAreaElement;

    private mInputType = InputType.TYPE_NULL;
    private mForceDisableDraw = false;
    private mMaxLength = Integer.MAX_VALUE;

    constructor(context:Context, bindElement?:HTMLElement, defStyle:any=android.R.attr.editTextStyle) {
        super(context, bindElement, defStyle);

        const a = context.obtainStyledAttributes(bindElement, defStyle);
        const inputTypeS = a.getAttrValue("inputType");
        if (inputTypeS) {
            this._setInputType(inputTypeS);
        }
        this.mMaxLength = a.getInteger('maxLength', this.mMaxLength);
    }

    protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
        return super.createClassAttrBinder().set('inputType', {
            setter(v:EditText, value:any, attrBinder:AttrBinder) {
                if (Number.isInteger(Number.parseInt(value))) {
                    v.setInputType(Number.parseInt(value));
                } else {
                    v._setInputType(value + '');
                }
            }, getter(v:EditText) {
                return v.getInputType();
            }
        }).set('maxLength', {
            setter(v:EditText, value:any, attrBinder:AttrBinder) {
                v.mMaxLength = attrBinder.parseInt(value, v.mMaxLength);
            }, getter(v:EditText) {
                return v.mMaxLength;
            }
        });
    }

    protected initBindElement(bindElement:HTMLElement):void {
        super.initBindElement(bindElement);
        this.switchToMultiLineInputElement();//default
    }

    protected onInputValueChange(e){
        let text = this.inputElement.value;//innerText;
        let filterText = '';
        for(let i = 0, length = text.length; i<length; i++){
            let c = text.codePointAt(i);
            if(!this.filterKeyCodeByInputType(c) && filterText.length < this.mMaxLength){
                filterText += text[i];
            }
        }
        if(text != filterText){
            text = filterText;
            this.inputElement.value = text;
        }

        if (!text || text.length === 0) {
            this.setForceDisableDrawText(false);
        } else {
            this.setForceDisableDrawText(true);
        }
        this.setText(text);
    }

    private onDomTextInput(e) {
        let text = e['data'];
        for(let i = 0, length = text.length; i<length; i++){
            let c = text.codePointAt(i);
            if(!this.filterKeyCodeOnInput(c)){
                return;
            }
        }
        // prevent
        e.preventDefault();
        e.stopPropagation();
    }

    private switchToInputElement(inputElement: HTMLInputElement|HTMLTextAreaElement) {
        if(this.inputElement === inputElement) return;
        inputElement.onblur = ()=>{
            inputElement.style.opacity = '0';
            this.setForceDisableDrawText(false);
            this.onInputElementFocusChanged(false);
        };
        inputElement.onfocus = ()=>{
            inputElement.style.opacity = '1';
            if(this.getText().length>0){
                this.setForceDisableDrawText(true);
            }
            this.onInputElementFocusChanged(true);
        };
        inputElement.oninput = (e) => this.onInputValueChange(e);
        inputElement.removeEventListener('textInput', (e) => this.onDomTextInput(e));
        inputElement.addEventListener('textInput', (e) => this.onDomTextInput(e));

        if(this.inputElement && this.inputElement.parentElement){
            this.bindElement.removeChild(this.inputElement);
            this.bindElement.appendChild(inputElement);
        }
        this.inputElement = inputElement;
    }
    private switchToSingleLineInputElement(){
        if(!this.mSingleLineInputElement){
            this.mSingleLineInputElement = document.createElement('input');
            this.mSingleLineInputElement.style.position = 'absolute';
            this.mSingleLineInputElement.style['webkitAppearance'] = 'none';
            this.mSingleLineInputElement.style.borderRadius = '0';
            this.mSingleLineInputElement.style.overflow = 'auto';
            this.mSingleLineInputElement.style.background = 'transparent';
            this.mSingleLineInputElement.style.fontFamily = Canvas.getMeasureTextFontFamily();
        }
        this.switchToInputElement(this.mSingleLineInputElement);
    }
    protected switchToMultiLineInputElement(){
        if(!this.mMultiLineInputElement) {
            this.mMultiLineInputElement = document.createElement('textarea');
            this.mMultiLineInputElement.style.position = 'absolute';
            this.mMultiLineInputElement.style['webkitAppearance'] = 'none';
            this.mMultiLineInputElement.style['resize'] = 'none';
            this.mMultiLineInputElement.style.borderRadius = '0';
            this.mMultiLineInputElement.style.overflow = 'auto';
            this.mMultiLineInputElement.style.background = 'transparent';
            this.mMultiLineInputElement.style.boxSizing = 'border-box';
            this.mMultiLineInputElement.style.fontFamily = Canvas.getMeasureTextFontFamily();
        }
        this.switchToInputElement(this.mMultiLineInputElement);
    }
    protected tryShowInputElement(){
        if(!this.isInputElementShowed()){
            this.inputElement.value = this.getText().toString();
            this.bindElement.appendChild(this.inputElement);
            this.inputElement.focus();
            if(this.getText().length>0){
                this.setForceDisableDrawText(true);
            }
            this.syncTextBoundInfoToInputElement();
            //TODO make cursor position friendly : move to first / move to touch position
        }
    }

    protected tryDismissInputElement(){
        try {
            if (this.inputElement.parentNode) this.bindElement.removeChild(this.inputElement);
        } catch (e) {
        }
        this.setForceDisableDrawText(false);
    }
    
    protected onInputElementFocusChanged(focused:boolean) {
    }

    isInputElementShowed():boolean {
        return this.inputElement.parentElement != null && this.inputElement.style.opacity != '0';
    }

    performClick(event:android.view.MotionEvent):boolean {
        this.tryShowInputElement();
        return super.performClick(event);
    }

    protected onFocusChanged(focused:boolean, direction:number, previouslyFocusedRect:android.graphics.Rect):void {
        super.onFocusChanged(focused, direction, previouslyFocusedRect);
        if(focused){
            this.tryShowInputElement();
        }else{
            this.tryDismissInputElement();
        }
    }

    protected setForceDisableDrawText(disable:boolean){
        if(this.mForceDisableDraw == disable) return;
        this.mForceDisableDraw = disable;
        if(disable){
            this.mSkipDrawText = true;
        }else{
            this.mSkipDrawText = false;
        }
        this.invalidate();
    }

    protected updateTextColors():void  {
        super.updateTextColors();
        if(this.isInputElementShowed()){
            this.syncTextBoundInfoToInputElement();
        }
    }

    onTouchEvent(event:android.view.MotionEvent):boolean {
        const superResult:boolean = super.onTouchEvent(event);
        if(this.isInputElementShowed()){
            event[android.view.ViewRootImpl.ContinueEventToDom] = true;

            // touch scroll in dom
            //TODO check touch direction
            if(this.inputElement.scrollHeight>this.inputElement.offsetHeight || this.inputElement.scrollWidth>this.inputElement.offsetWidth){
                this.getParent().requestDisallowInterceptTouchEvent(true);
            }

            return true;
        }
        return superResult;
    }

    private filterKeyEvent(event:android.view.KeyEvent):boolean {
        let keyCode = event.getKeyCode();
        if(keyCode == android.view.KeyEvent.KEYCODE_Backspace || keyCode == android.view.KeyEvent.KEYCODE_Del
            || event.isCtrlPressed() || event.isAltPressed() || event.isMetaPressed()){
            return false;
        }
        if(keyCode == android.view.KeyEvent.KEYCODE_ENTER && this.isSingleLine()){
            return true;
        }
        if(event.mIsTypingKey) {
            if(this.getText().length >= this.mMaxLength) {
                return true;
            }
            return this.filterKeyCodeOnInput(keyCode);
        }
        return false;
    }

    protected filterKeyCodeByInputType(keyCode:number):boolean {
        let filter = false;
        const inputType = this.mInputType;
        const typeClass = inputType & InputType.TYPE_MASK_CLASS;
        if (typeClass === InputType.TYPE_CLASS_NUMBER) {
            filter = InputType.LimitCode.TYPE_CLASS_NUMBER.indexOf(keyCode) === -1;
            if ((inputType & InputType.TYPE_NUMBER_FLAG_SIGNED) === InputType.TYPE_NUMBER_FLAG_SIGNED) {
                filter = filter && keyCode !== android.view.KeyEvent.KEYCODE_Minus;
            }
            if ((inputType & InputType.TYPE_NUMBER_FLAG_DECIMAL) === InputType.TYPE_NUMBER_FLAG_DECIMAL) {
                filter = filter && keyCode !== android.view.KeyEvent.KEYCODE_Period;
            }
        } else if (typeClass === InputType.TYPE_CLASS_PHONE) {
            filter = InputType.LimitCode.TYPE_CLASS_PHONE.indexOf(keyCode) === -1;
        }
        return filter;
    }

    protected filterKeyCodeOnInput(keyCode:number):boolean {
        let filter = false;
        const inputType = this.mInputType;
        const typeClass = inputType & InputType.TYPE_MASK_CLASS;
        if (typeClass === InputType.TYPE_CLASS_NUMBER) {
            if ((inputType & InputType.TYPE_NUMBER_FLAG_SIGNED) === InputType.TYPE_NUMBER_FLAG_SIGNED) {
                if(keyCode === android.view.KeyEvent.KEYCODE_Minus && this.getText().length > 0) {
                    filter = true;
                }
            }
            if ((inputType & InputType.TYPE_NUMBER_FLAG_DECIMAL) === InputType.TYPE_NUMBER_FLAG_DECIMAL) {
                if (keyCode === android.view.KeyEvent.KEYCODE_Period && (this.getText().includes('.') || this.getText().length === 0)) {
                    filter = true;
                }
            }
        }
        return filter || this.filterKeyCodeByInputType(keyCode);
    }

    private checkFilterKeyEventToDom(event:android.view.KeyEvent):boolean {
        if(this.isInputElementShowed()){
            if(this.filterKeyEvent(event)){
                event[android.view.ViewRootImpl.ContinueEventToDom] = false;
            }else{
                event[android.view.ViewRootImpl.ContinueEventToDom] = true;
            }
            return true;
        }
        return false;
    }

    onKeyDown(keyCode:number, event:android.view.KeyEvent):boolean {
        const filter = this.checkFilterKeyEventToDom(event);
        return super.onKeyDown(keyCode, event) || filter;
    }

    onKeyUp(keyCode:number, event:android.view.KeyEvent):boolean {
        const filter = this.checkFilterKeyEventToDom(event);
        return super.onKeyUp(keyCode, event) || filter;
    }

    requestSyncBoundToElement(immediately = false):void {
        if(this.isInputElementShowed()){
            immediately = true;
        }
        super.requestSyncBoundToElement(immediately);
    }


    protected setRawTextSize(size:number):void  {
        super.setRawTextSize(size);
        if(this.isInputElementShowed()){
            this.syncTextBoundInfoToInputElement();
        }
    }

    protected onTextChanged(text:String, start:number, lengthBefore:number, lengthAfter:number):void {
        if(this.isInputElementShowed()){
            this.syncTextBoundInfoToInputElement();
        }
    }

    protected onLayout(changed:boolean, left:number, top:number, right:number, bottom:number):void {
        super.onLayout(changed, left, top, right, bottom);

        if(this.isInputElementShowed()){
            this.syncTextBoundInfoToInputElement();
        }
    }

    setGravity(gravity:number):void {
        super.setGravity(gravity);
        if(this.isInputElementShowed()){
            this.syncTextBoundInfoToInputElement();
        }
    }

    setSingleLine(singleLine = true):void {
        if (singleLine) {
            this.switchToSingleLineInputElement();
        } else {
            this.switchToMultiLineInputElement();
        }
        super.setSingleLine(singleLine);
    }

    _setInputType(value:string):void {
        switch (value + ''){
            case 'none':
                this.setInputType(InputType.TYPE_NULL);
                break;
            case 'text':
                this.setInputType(InputType.TYPE_CLASS_TEXT);
                break;
            case 'textUri':
                this.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_URI);
                break;
            case 'textEmailAddress':
                this.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS);
                break;
            case 'textPassword':
                this.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
                break;
            case 'textVisiblePassword':
                this.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
                break;
            case 'number':
                this.setInputType(InputType.TYPE_CLASS_NUMBER);
                break;
            case 'numberSigned':
                this.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_SIGNED);
                break;
            case 'numberDecimal':
                this.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL);
                break;
            case 'numberPassword':
                this.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_VARIATION_PASSWORD);
                break;
            case 'phone':
                this.setInputType(InputType.TYPE_CLASS_PHONE);
                break;
            case 'datetime':
                this.setInputType(InputType.TYPE_CLASS_DATETIME);
                break;
            case 'date':
                this.setInputType(InputType.TYPE_CLASS_DATETIME | InputType.TYPE_DATETIME_VARIATION_DATE);
                break;
            case 'time':
                this.setInputType(InputType.TYPE_CLASS_DATETIME | InputType.TYPE_DATETIME_VARIATION_TIME);
                break;
        }
    }
    /**
     * Set the type of the content with a constant as defined for {@link EditorInfo#inputType}. This
     * will take care of changing the key listener, by calling {@link #setKeyListener(KeyListener)},
     * to match the given content type.  If the given content type is {@link EditorInfo#TYPE_NULL}
     * then a soft keyboard will not be displayed for this text view.
     *
     * Note that the maximum number of displayed lines (see {@link #setMaxLines(int)}) will be
     * modified if you change the {@link EditorInfo#TYPE_TEXT_FLAG_MULTI_LINE} flag of the input
     * type.
     *
     * @see #getInputType()
     * @see #setRawInputType(int)
     * @see android.text.InputType
     * @attr ref android.R.styleable#TextView_inputType
     */
    setInputType(type:number):void  {
        this.mInputType = type;
        const typeClass = type & InputType.TYPE_MASK_CLASS;
        this.inputElement.style['webkitTextSecurity'] = '';
        this.setTransformationMethod(null);

        switch (typeClass){
            case InputType.TYPE_NULL:
                this.setSingleLine(false);
                this.inputElement.removeAttribute('type');
                break;
            case InputType.TYPE_CLASS_TEXT:
                if ((type & InputType.TYPE_TEXT_VARIATION_URI) === InputType.TYPE_TEXT_VARIATION_URI) {
                    this.setSingleLine(true);
                    this.inputElement.setAttribute('type', 'url');
                } else if ((type & InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS) === InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS) {
                    this.setSingleLine(true);
                    this.inputElement.setAttribute('type', 'email');
                } else if ((type & InputType.TYPE_TEXT_VARIATION_PASSWORD) === InputType.TYPE_TEXT_VARIATION_PASSWORD) {
                    this.setSingleLine(true);
                    this.inputElement.setAttribute('type', 'password');
                    this.setTransformationMethod(PasswordTransformationMethod.getInstance());
                } else if ((type & InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD) === InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD) {
                    this.setSingleLine(true);
                    this.inputElement.setAttribute('type', 'email');//use email type as visible password
                } else {
                    this.setSingleLine(false);
                    this.inputElement.removeAttribute('type');
                }
                break;
            case InputType.TYPE_CLASS_NUMBER:
                this.setSingleLine(true);
                this.inputElement.setAttribute('type', 'number');
                if ((type & InputType.TYPE_NUMBER_VARIATION_PASSWORD) === InputType.TYPE_NUMBER_VARIATION_PASSWORD) {
                    this.inputElement.style['webkitTextSecurity'] = 'disc';
                    this.setTransformationMethod(PasswordTransformationMethod.getInstance());
                }
                break;
            case InputType.TYPE_CLASS_PHONE:
                this.setSingleLine(true);
                this.inputElement.setAttribute('type', 'tel');
                break;
            case InputType.TYPE_CLASS_DATETIME:
                this.setSingleLine(true);
                if ((type & InputType.TYPE_DATETIME_VARIATION_DATE) === InputType.TYPE_DATETIME_VARIATION_DATE) {
                    this.inputElement.setAttribute('type', 'date');
                } else if ((type & InputType.TYPE_DATETIME_VARIATION_TIME) === InputType.TYPE_DATETIME_VARIATION_TIME) {
                    this.inputElement.setAttribute('type', 'time');
                } else {
                    this.inputElement.setAttribute('type', 'datetime');
                }
                break;
        }
    }

    /**
     * Get the type of the editable content.
     *
     * @see #setInputType(int)
     * @see android.text.InputType
     */
    getInputType():number  {
        return this.mInputType;
    }


    private syncTextBoundInfoToInputElement(){
        let left = this.getLeft();
        let top = this.getTop();
        let right = this.getRight();
        let bottom = this.getBottom();

        const density = this.getResources().getDisplayMetrics().density;
        let maxHeight = this.getMaxHeight();
        if(maxHeight<=0 || maxHeight>=Integer.MAX_VALUE){
            let maxLine = this.getMaxLines();
            if(maxLine>0 && maxLine<Integer.MAX_VALUE){
                maxHeight =  maxLine * this.getLineHeight();
            }
        }
        let textHeight = bottom - top - this.getCompoundPaddingTop() - this.getCompoundPaddingBottom();
        if(maxHeight<=0 || maxHeight>textHeight){
            maxHeight = textHeight;
        }
        let layout:android.text.Layout = this.mLayout;
        if (this.mHint != null && this.mText.length == 0) {
            layout = this.mHintLayout;
        }
        let height = layout ? Math.min(layout.getLineTop(layout.getLineCount()), maxHeight) : maxHeight;
        this.inputElement.style.height = height / density + 1 + 'px';

        this.inputElement.style.top = '';
        this.inputElement.style.bottom = '';
        this.inputElement.style.transform = this.inputElement.style.webkitTransform = '';
        let gravity = this.getGravity();
        switch (gravity & Gravity.VERTICAL_GRAVITY_MASK) {
            case Gravity.TOP:
                this.inputElement.style.top = this.getCompoundPaddingTop() / density + 'px';
                break;
            case Gravity.BOTTOM:
                this.inputElement.style.bottom = this.getCompoundPaddingBottom() / density + 'px';
                break;
            default:
                this.inputElement.style.top = '50%';
                this.inputElement.style.transform = this.inputElement.style.webkitTransform = 'translate(0, -50%)';
                break;
        }

        switch (gravity & Gravity.HORIZONTAL_GRAVITY_MASK) {
            case Gravity.LEFT:
                this.inputElement.style.textAlign = 'left';
                break;
            case Gravity.RIGHT:
                this.inputElement.style.textAlign = 'right';
                break;
            default:
                this.inputElement.style.textAlign = 'center';
                break;
        }

        const isIOS = Platform.isIOS;
        this.inputElement.style.left = this.getCompoundPaddingLeft() / density - (isIOS?3:0) + 'px';
        //this.inputElement.style.right = this.getCompoundPaddingRight() / density + 'px';
        this.inputElement.style.width = (right - left - this.getCompoundPaddingRight() - this.getCompoundPaddingLeft()) / density + (isIOS?6:1) + 'px';
        this.inputElement.style.lineHeight = this.getLineHeight()/density + 'px';

        if(this.getLineCount() == 1){
            this.inputElement.style.whiteSpace = 'nowrap';
        }else{
            this.inputElement.style.whiteSpace = '';
        }

        let text = this.getText().toString();
        if(text!=this.inputElement.value) this.inputElement.value = text;
        this.inputElement.style.fontSize = this.getTextSize() / density + 'px';
        this.inputElement.style.color = Color.toRGBAFunc(this.getCurrentTextColor());

        if(this.inputElement == this.mMultiLineInputElement){
            this.inputElement.style.padding = (this.getTextSize()/density/5).toFixed(1) + 'px 0px 0px 0px';//textarea baseline adjust
        }else{
            this.inputElement.style.padding = '0px';
        }
    }
    
    protected dependOnDebugLayout():boolean {
        return true;
    }

//protected getDefaultEditable():boolean  {
    //    return true;
    //}
    //
    //protected getDefaultMovementMethod():MovementMethod  {
    //    return ArrowKeyMovementMethod.getInstance();
    //}
    //
    //getText():Editable  {
    //    return <Editable> super.getText();
    //}
    //
    //setText(text:CharSequence, type:BufferType):void  {
    //    super.setText(text, BufferType.EDITABLE);
    //}
    //
    ///**
    // * Convenience for {@link Selection#setSelection(Spannable, int, int)}.
    // */
    //setSelection(start:number, stop:number):void  {
    //    Selection.setSelection(this.getText(), start, stop);
    //}
    //
    ///**
    // * Convenience for {@link Selection#setSelection(Spannable, int)}.
    // */
    //setSelection(index:number):void  {
    //    Selection.setSelection(this.getText(), index);
    //}
    //
    ///**
    // * Convenience for {@link Selection#selectAll}.
    // */
    //selectAll():void  {
    //    Selection.selectAll(this.getText());
    //}
    //
    ///**
    // * Convenience for {@link Selection#extendSelection}.
    // */
    //extendSelection(index:number):void  {
    //    Selection.extendSelection(this.getText(), index);
    //}

    setEllipsize(ellipsis:TextUtils.TruncateAt):void  {
        if (ellipsis == TextUtils.TruncateAt.MARQUEE) {
            throw Error(`new IllegalArgumentException("EditText cannot use the ellipsize mode " + "TextUtils.TruncateAt.MARQUEE")`);
        }
        super.setEllipsize(ellipsis);
    }
}
}
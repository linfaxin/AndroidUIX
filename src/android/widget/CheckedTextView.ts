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

///<reference path="../../android/graphics/Canvas.ts"/>
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/widget/Checkable.ts"/>
///<reference path="../../android/widget/ListView.ts"/>
///<reference path="../../android/widget/TextView.ts"/>
///<reference path="../../android/content/Context.ts"/>

module android.widget {
import Canvas = android.graphics.Canvas;
import Drawable = android.graphics.drawable.Drawable;
import Gravity = android.view.Gravity;
import Checkable = android.widget.Checkable;
import ListView = android.widget.ListView;
import TextView = android.widget.TextView;
import View = android.view.View;
import Context = android.content.Context;
    import AttrBinder = androidui.attr.AttrBinder;
/**
 * An extension to TextView that supports the {@link android.widget.Checkable} interface.
 * This is useful when used in a {@link android.widget.ListView ListView} where the it's 
 * {@link android.widget.ListView#setChoiceMode(int) setChoiceMode} has been set to
 * something other than {@link android.widget.ListView#CHOICE_MODE_NONE CHOICE_MODE_NONE}.
 *
 * @attr ref android.R.styleable#CheckedTextView_checked
 * @attr ref android.R.styleable#CheckedTextView_checkMark
 */
export class CheckedTextView extends TextView implements Checkable {

    private mChecked:boolean;

    private mCheckMarkResource:number = 0;

    private mCheckMarkDrawable:Drawable;

    private mBasePadding:number = 0;

    private mCheckMarkWidth:number = 0;

    private mNeedRequestlayout:boolean;

    private static CHECKED_STATE_SET:number[] = [ View.VIEW_STATE_CHECKED ];

    constructor(context:Context, bindElement?:HTMLElement, defStyle=R.attr.checkedTextViewStyle) {
        super(context, bindElement, defStyle);

        const a = context.obtainStyledAttributes(bindElement, defStyle);

        const d = a.getDrawable('checkMark');
        if (d != null) {
            this.setCheckMarkDrawable(d);
        }

        const checked = a.getBoolean('checked', false);
        this.setChecked(checked);

        a.recycle();
    }

    protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
        return super.createClassAttrBinder().set('checkMark', {
            setter(v:CheckedTextView, value:any, attrBinder:AttrBinder) {
                v.setCheckMarkDrawable(attrBinder.parseDrawable(value));
            }, getter(v:CheckedTextView) {
                return v.getCheckMarkDrawable();
            }
        }).set('checked', {
            setter(v:CheckedTextView, value:any, attrBinder:AttrBinder) {
                v.setChecked(attrBinder.parseBoolean(value, false));
            }, getter(v:CheckedTextView) {
                return v.isChecked();
            }
        });
    }

    toggle():void  {
        this.setChecked(!this.mChecked);
    }

    isChecked():boolean  {
        return this.mChecked;
    }

    /**
     * <p>Changes the checked state of this text view.</p>
     *
     * @param checked true to check the text, false to uncheck it
     */
    setChecked(checked:boolean):void  {
        if (this.mChecked != checked) {
            this.mChecked = checked;
            this.refreshDrawableState();
            //this.notifyViewAccessibilityStateChangedIfNeeded(AccessibilityEvent.CONTENT_CHANGE_TYPE_UNDEFINED);
        }
    }

    ///**
    // * Set the checkmark to a given Drawable, identified by its resourece id. This will be drawn
    // * when {@link #isChecked()} is true.
    // *
    // * @param resid The Drawable to use for the checkmark.
    // *
    // * @see #setCheckMarkDrawable(Drawable)
    // * @see #getCheckMarkDrawable()
    // *
    // * @attr ref android.R.styleable#CheckedTextView_checkMark
    // */
    //setCheckMarkDrawable(resid:number):void  {
    //    if (resid != 0 && resid == this.mCheckMarkResource) {
    //        return;
    //    }
    //    this.mCheckMarkResource = resid;
    //    let d:Drawable = null;
    //    if (this.mCheckMarkResource != 0) {
    //        d = this.getResources().getDrawable(this.mCheckMarkResource);
    //    }
    //    this.setCheckMarkDrawable(d);
    //}

    /**
     * Set the checkmark to a given Drawable. This will be drawn when {@link #isChecked()} is true.
     *
     * @param d The Drawable to use for the checkmark.
     *
     * @see #setCheckMarkDrawable(int)
     * @see #getCheckMarkDrawable()
     *
     * @attr ref android.R.styleable#CheckedTextView_checkMark
     */
    setCheckMarkDrawable(d:Drawable):void  {
        if (this.mCheckMarkDrawable != null) {
            this.mCheckMarkDrawable.setCallback(null);
            this.unscheduleDrawable(this.mCheckMarkDrawable);
        }
        this.mNeedRequestlayout = (d != this.mCheckMarkDrawable);
        if (d != null) {
            d.setCallback(this);
            d.setVisible(this.getVisibility() == CheckedTextView.VISIBLE, false);
            d.setState(CheckedTextView.CHECKED_STATE_SET);
            this.setMinHeight(d.getIntrinsicHeight());
            this.mCheckMarkWidth = d.getIntrinsicWidth();
            d.setState(this.getDrawableState());
        } else {
            this.mCheckMarkWidth = 0;
        }
        this.mCheckMarkDrawable = d;
        // Do padding resolution. This will call internalSetPadding() and do a requestLayout() if needed.
        this.resolvePadding();
    }

    /**
     * Gets the checkmark drawable
     *
     * @return The drawable use to represent the checkmark, if any.
     *
     * @see #setCheckMarkDrawable(Drawable)
     * @see #setCheckMarkDrawable(int)
     *
     * @attr ref android.R.styleable#CheckedTextView_checkMark
     */
    getCheckMarkDrawable():Drawable  {
        return this.mCheckMarkDrawable;
    }

    ///**
    // * @hide
    // */
    //protected internalSetPadding(left:number, top:number, right:number, bottom:number):void  {
    //    super.internalSetPadding(left, top, right, bottom);
    //    this.setBasePadding(this.isLayoutRtl());
    //}

    setPadding(left:number, top:number, right:number, bottom:number):void {
        super.setPadding(left, top, right, bottom);
        this.setBasePadding(this.isLayoutRtl());
    }

    //onRtlPropertiesChanged(layoutDirection:number):void  {
    //    super.onRtlPropertiesChanged(layoutDirection);
    //    this.updatePadding();
    //}

    private updatePadding():void  {
        //this.resetPaddingToInitialValues();
        let newPadding:number = (this.mCheckMarkDrawable != null) ? this.mCheckMarkWidth + this.mBasePadding : this.mBasePadding;
        if (this.isLayoutRtl()) {
            this.mNeedRequestlayout = (this.mPaddingLeft != newPadding) || this.mNeedRequestlayout;
            this.mPaddingLeft = newPadding;
        } else {
            this.mNeedRequestlayout = (this.mPaddingRight != newPadding) || this.mNeedRequestlayout;
            this.mPaddingRight = newPadding;
        }
        if (this.mNeedRequestlayout) {
            this.requestLayout();
            this.mNeedRequestlayout = false;
        }
    }

    private setBasePadding(isLayoutRtl:boolean):void  {
        if (isLayoutRtl) {
            this.mBasePadding = this.mPaddingLeft;
        } else {
            this.mBasePadding = this.mPaddingRight;
        }
    }

    protected onDraw(canvas:Canvas):void  {
        super.onDraw(canvas);
        const checkMarkDrawable:Drawable = this.mCheckMarkDrawable;
        if (checkMarkDrawable != null) {
            const verticalGravity:number = this.getGravity() & Gravity.VERTICAL_GRAVITY_MASK;
            const height:number = checkMarkDrawable.getIntrinsicHeight();
            let y:number = 0;
            switch(verticalGravity) {
                case Gravity.BOTTOM:
                    y = this.getHeight() - height;
                    break;
                case Gravity.CENTER_VERTICAL:
                    y = (this.getHeight() - height) / 2;
                    break;
            }
            const isLayoutRtl:boolean = this.isLayoutRtl();
            const width:number = this.getWidth();
            const top:number = y;
            const bottom:number = top + height;
            let left:number;
            let right:number;
            if (isLayoutRtl) {
                left = this.mBasePadding;
                right = left + this.mCheckMarkWidth;
            } else {
                right = width - this.mBasePadding;
                left = right - this.mCheckMarkWidth;
            }
            checkMarkDrawable.setBounds(this.mScrollX + left, top, this.mScrollX + right, bottom);
            checkMarkDrawable.draw(canvas);
        }
    }

    protected onCreateDrawableState(extraSpace:number):number[]  {
        const drawableState:number[] = super.onCreateDrawableState(extraSpace + 1);
        if (this.isChecked()) {
            CheckedTextView.mergeDrawableStates(drawableState, CheckedTextView.CHECKED_STATE_SET);
        }
        return drawableState;
    }

    protected drawableStateChanged():void  {
        super.drawableStateChanged();
        if (this.mCheckMarkDrawable != null) {
            let myDrawableState:number[] = this.getDrawableState();
            // Set the state of the Drawable
            this.mCheckMarkDrawable.setState(myDrawableState);
            this.invalidate();
        }
    }

    //onInitializeAccessibilityEvent(event:AccessibilityEvent):void  {
    //    super.onInitializeAccessibilityEvent(event);
    //    event.setClassName(CheckedTextView.class.getName());
    //    event.setChecked(this.mChecked);
    //}
    //
    //onInitializeAccessibilityNodeInfo(info:AccessibilityNodeInfo):void  {
    //    super.onInitializeAccessibilityNodeInfo(info);
    //    info.setClassName(CheckedTextView.class.getName());
    //    info.setCheckable(true);
    //    info.setChecked(this.mChecked);
    //}
}
}
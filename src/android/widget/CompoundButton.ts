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
///<reference path="../../android/view/View.ts"/>
///<reference path="../../java/lang/Integer.ts"/>
///<reference path="../../java/lang/System.ts"/>
///<reference path="../../android/widget/Button.ts"/>
///<reference path="../../android/widget/Checkable.ts"/>
///<reference path="../../android/widget/TextView.ts"/>

module android.widget {
import Canvas = android.graphics.Canvas;
import Drawable = android.graphics.drawable.Drawable;
import Gravity = android.view.Gravity;
import View = android.view.View;
import Integer = java.lang.Integer;
import System = java.lang.System;
import Button = android.widget.Button;
import Checkable = android.widget.Checkable;
import TextView = android.widget.TextView;
    import AttrBinder = androidui.attr.AttrBinder;
/**
 * <p>
 * A button with two states, checked and unchecked. When the button is pressed
 * or clicked, the state changes automatically.
 * </p>
 *
 * <p><strong>XML attributes</strong></p>
 * <p>
 * See {@link android.R.styleable#CompoundButton
 * CompoundButton Attributes}, {@link android.R.styleable#Button Button
 * Attributes}, {@link android.R.styleable#TextView TextView Attributes}, {@link
 * android.R.styleable#View View Attributes}
 * </p>
 */
export abstract class CompoundButton extends Button implements Checkable {

    private mChecked:boolean;

    private mButtonResource:number = 0;

    private mBroadcasting:boolean;

    private mButtonDrawable:Drawable;

    private mOnCheckedChangeListener:CompoundButton.OnCheckedChangeListener;

    private mOnCheckedChangeWidgetListener:CompoundButton.OnCheckedChangeListener;

    private static CHECKED_STATE_SET:number[] = [ View.VIEW_STATE_CHECKED ];

    constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle?:Map<string, string>) {
        super(context, bindElement, defStyle);

    }

    protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
        return super.createClassAttrBinder().set('button', {
            setter(v:CompoundButton, value:any, attrBinder:AttrBinder) {
                v.setButtonDrawable(attrBinder.parseDrawable(value));
            }, getter(v:CompoundButton) {
                return v.mButtonDrawable;
            }
        }).set('checked', {
            setter(v:CompoundButton, value:any, attrBinder:AttrBinder) {
                v.setChecked(attrBinder.parseBoolean(value, v.isChecked()));
            }, getter(v:CompoundButton) {
                return v.isChecked();
            }
        });
    }

    toggle():void  {
        this.setChecked(!this.mChecked);
    }

    performClick():boolean  {
        /*
         * XXX: These are tiny, need some surrounding 'expanded touch area',
         * which will need to be implemented in Button if we only override
         * performClick()
         */
        /* When clicked, toggle the state */
        this.toggle();
        return super.performClick();
    }

    isChecked():boolean  {
        return this.mChecked;
    }

    /**
     * <p>Changes the checked state of this button.</p>
     *
     * @param checked true to check the button, false to uncheck it
     */
    setChecked(checked:boolean):void  {
        if (this.mChecked != checked) {
            this.mChecked = checked;
            this.refreshDrawableState();
            //this.notifyViewAccessibilityStateChangedIfNeeded(AccessibilityEvent.CONTENT_CHANGE_TYPE_UNDEFINED);
            // Avoid infinite recursions if setChecked() is called from a listener
            if (this.mBroadcasting) {
                return;
            }
            this.mBroadcasting = true;
            if (this.mOnCheckedChangeListener != null) {
                this.mOnCheckedChangeListener.onCheckedChanged(this, this.mChecked);
            }
            if (this.mOnCheckedChangeWidgetListener != null) {
                this.mOnCheckedChangeWidgetListener.onCheckedChanged(this, this.mChecked);
            }
            this.mBroadcasting = false;
        }
    }

    /**
     * Register a callback to be invoked when the checked state of this button
     * changes.
     *
     * @param listener the callback to call on checked state change
     */
    setOnCheckedChangeListener(listener:CompoundButton.OnCheckedChangeListener):void  {
        this.mOnCheckedChangeListener = listener;
    }

    /**
     * Register a callback to be invoked when the checked state of this button
     * changes. This callback is used for internal purpose only.
     *
     * @param listener the callback to call on checked state change
     * @hide
     */
    setOnCheckedChangeWidgetListener(listener:CompoundButton.OnCheckedChangeListener):void  {
        this.mOnCheckedChangeWidgetListener = listener;
    }



    ///**
    // * Set the background to a given Drawable, identified by its resource id.
    // *
    // * @param resid the resource id of the drawable to use as the background
    // */
    //setButtonDrawable(resid:number):void  {
    //    if (resid != 0 && resid == this.mButtonResource) {
    //        return;
    //    }
    //    this.mButtonResource = resid;
    //    let d:Drawable = null;
    //    if (this.mButtonResource != 0) {
    //        d = this.getResources().getDrawable(this.mButtonResource);
    //    }
    //    this.setButtonDrawable(d);
    //}

    /**
     * Set the background to a given Drawable
     *
     * @param d The Drawable to use as the background
     */
    setButtonDrawable(d:Drawable):void  {
        if (d != null) {
            if (this.mButtonDrawable != null) {
                this.mButtonDrawable.setCallback(null);
                this.unscheduleDrawable(this.mButtonDrawable);
            }
            d.setCallback(this);
            d.setVisible(this.getVisibility() == CompoundButton.VISIBLE, false);
            this.mButtonDrawable = d;
            this.setMinHeight(this.mButtonDrawable.getIntrinsicHeight());
        }
        this.refreshDrawableState();
    }

    //onInitializeAccessibilityEvent(event:AccessibilityEvent):void  {
    //    super.onInitializeAccessibilityEvent(event);
    //    event.setClassName(CompoundButton.class.getName());
    //    event.setChecked(this.mChecked);
    //}
    //
    //onInitializeAccessibilityNodeInfo(info:AccessibilityNodeInfo):void  {
    //    super.onInitializeAccessibilityNodeInfo(info);
    //    info.setClassName(CompoundButton.class.getName());
    //    info.setCheckable(true);
    //    info.setChecked(this.mChecked);
    //}

    getCompoundPaddingLeft():number  {
        let padding:number = super.getCompoundPaddingLeft();
        if (!this.isLayoutRtl()) {
            const buttonDrawable:Drawable = this.mButtonDrawable;
            if (buttonDrawable != null) {
                padding += buttonDrawable.getIntrinsicWidth();
            }
        }
        return padding;
    }

    getCompoundPaddingRight():number  {
        let padding:number = super.getCompoundPaddingRight();
        if (this.isLayoutRtl()) {
            const buttonDrawable:Drawable = this.mButtonDrawable;
            if (buttonDrawable != null) {
                padding += buttonDrawable.getIntrinsicWidth();
            }
        }
        return padding;
    }

    /**
     * @hide
     */
    getHorizontalOffsetForDrawables():number  {
        const buttonDrawable:Drawable = this.mButtonDrawable;
        return (buttonDrawable != null) ? buttonDrawable.getIntrinsicWidth() : 0;
    }

    protected onDraw(canvas:Canvas):void  {
        super.onDraw(canvas);
        const buttonDrawable:Drawable = this.mButtonDrawable;
        if (buttonDrawable != null) {
            const verticalGravity:number = this.getGravity() & Gravity.VERTICAL_GRAVITY_MASK;
            const drawableHeight:number = buttonDrawable.getIntrinsicHeight();
            const drawableWidth:number = buttonDrawable.getIntrinsicWidth();
            let top:number = 0;
            switch(verticalGravity) {
                case Gravity.BOTTOM:
                    top = this.getHeight() - drawableHeight;
                    break;
                case Gravity.CENTER_VERTICAL:
                    top = (this.getHeight() - drawableHeight) / 2;
                    break;
            }
            let bottom:number = top + drawableHeight;
            let left:number = this.isLayoutRtl() ? this.getWidth() - drawableWidth : 0;
            let right:number = this.isLayoutRtl() ? this.getWidth() : drawableWidth;
            buttonDrawable.setBounds(left, top, right, bottom);
            buttonDrawable.draw(canvas);
        }
    }

    protected onCreateDrawableState(extraSpace:number):number[]  {
        const drawableState:number[] = super.onCreateDrawableState(extraSpace + 1);
        if (this.isChecked()) {
            CompoundButton.mergeDrawableStates(drawableState, CompoundButton.CHECKED_STATE_SET);
        }
        return drawableState;
    }

    protected drawableStateChanged():void  {
        super.drawableStateChanged();
        if (this.mButtonDrawable != null) {
            let myDrawableState:number[] = this.getDrawableState();
            // Set the state of the Drawable
            this.mButtonDrawable.setState(myDrawableState);
            this.invalidate();
        }
    }

    drawableSizeChange(d:android.graphics.drawable.Drawable):void {
        if(d == this.mButtonDrawable){
            this.setButtonDrawable(d);
            this.requestLayout();
        }else{
            super.drawableSizeChange(d);
        }
    }

    protected verifyDrawable(who:Drawable):boolean  {
        return super.verifyDrawable(who) || who == this.mButtonDrawable;
    }

    jumpDrawablesToCurrentState():void  {
        super.jumpDrawablesToCurrentState();
        if (this.mButtonDrawable != null)
            this.mButtonDrawable.jumpToCurrentState();
    }

}

export module CompoundButton{
/**
     * Interface definition for a callback to be invoked when the checked state
     * of a compound button changed.
     */
export interface OnCheckedChangeListener {

    /**
         * Called when the checked state of a compound button has changed.
         *
         * @param buttonView The compound button view whose state has changed.
         * @param isChecked  The new checked state of buttonView.
         */
    onCheckedChanged(buttonView:CompoundButton, isChecked:boolean):void ;
}
}

}
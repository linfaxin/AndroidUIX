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

///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/widget/Button.ts"/>
///<reference path="../../android/widget/CompoundButton.ts"/>
///<reference path="../../android/widget/LinearLayout.ts"/>
///<reference path="../../android/widget/RadioButton.ts"/>

module android.widget {
import View = android.view.View;
import ViewGroup = android.view.ViewGroup;
import Button = android.widget.Button;
import CompoundButton = android.widget.CompoundButton;
import LinearLayout = android.widget.LinearLayout;
import RadioButton = android.widget.RadioButton;
    import AttrBinder = androidui.attr.AttrBinder;
/**
 * <p>This class is used to create a multiple-exclusion scope for a set of radio
 * buttons. Checking one radio button that belongs to a radio group unchecks
 * any previously checked radio button within the same group.</p>
 *
 * <p>Intially, all of the radio buttons are unchecked. While it is not possible
 * to uncheck a particular radio button, the radio group can be cleared to
 * remove the checked state.</p>
 *
 * <p>The selection is identified by the unique id of the radio button as defined
 * in the XML layout file.</p>
 *
 * <p><strong>XML Attributes</strong></p>
 * <p>See {@link android.R.styleable#RadioGroup RadioGroup Attributes}, 
 * {@link android.R.styleable#LinearLayout LinearLayout Attributes},
 * {@link android.R.styleable#ViewGroup ViewGroup Attributes},
 * {@link android.R.styleable#View View Attributes}</p>
 * <p>Also see
 * {@link android.widget.LinearLayout.LayoutParams LinearLayout.LayoutParams}
 * for layout attributes.</p>
 * 
 * @see RadioButton
 *
 */
export class RadioGroup extends LinearLayout {

    // holds the checked id; the selection is empty by default
    private mCheckedId:string = View.NO_ID;

    // tracks children radio buttons checked state
    private mChildOnCheckedChangeListener:CompoundButton.OnCheckedChangeListener;

    // when true, mOnCheckedChangeListener discards events
    private mProtectFromCheckedChange:boolean = false;

    private mOnCheckedChangeListener:RadioGroup.OnCheckedChangeListener;

    private mPassThroughListener:RadioGroup.PassThroughHierarchyChangeListener;

    constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle?:Map<string, string>) {
        super(context, bindElement, defStyle);

        // retrieve selected radio button as requested by the user in the
        // XML layout file
        let attributes = context.obtainStyledAttributes(
            bindElement, defStyle);

        let value = attributes.getString('checkedButton');
        if (value) {
            this.mCheckedId = value;
        }

        const orientation = attributes.getString('orientation');
        if (orientation === 'horizontal') {
            this.setOrientation(RadioGroup.HORIZONTAL);
        } else {
            this.setOrientation(RadioGroup.VERTICAL);
        }

        attributes.recycle();

        this.init();
    }

    protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
        return super.createClassAttrBinder().set('checkedButton', {
            setter(v:RadioGroup, value:any) {
                if (typeof value === 'string' || value == null) {
                    v.setCheckedId(value);
                }
            }
        });
    }

    private init():void  {
        this.mChildOnCheckedChangeListener = new RadioGroup.CheckedStateTracker(this);
        this.mPassThroughListener = new RadioGroup.PassThroughHierarchyChangeListener(this);
        super.setOnHierarchyChangeListener(this.mPassThroughListener);
    }

    /**
     * {@inheritDoc}
     */
    setOnHierarchyChangeListener(listener:ViewGroup.OnHierarchyChangeListener):void  {
        // the user listener is delegated to our pass-through listener
        this.mPassThroughListener.mOnHierarchyChangeListener = listener;
    }

    /**
     * {@inheritDoc}
     */
    protected onFinishInflate():void  {
        super.onFinishInflate();
        // checks the appropriate radio button as requested in the XML file
        if (this.mCheckedId != null) {
            this.mProtectFromCheckedChange = true;
            this.setCheckedStateForView(this.mCheckedId, true);
            this.mProtectFromCheckedChange = false;
            this.setCheckedId(this.mCheckedId);
        }
    }

    addView(...args) {
        let child = <View>args[0];
        if (child instanceof RadioButton) {
            const button:RadioButton = <RadioButton> child;
            if (button.isChecked()) {
                this.mProtectFromCheckedChange = true;
                if (this.mCheckedId != null) {
                    this.setCheckedStateForView(this.mCheckedId, false);
                }
                this.mProtectFromCheckedChange = false;
                this.setCheckedId(button.getId());
            }
        }
        super.addView(...args);
    }

    /**
     * <p>Sets the selection to the radio button whose identifier is passed in
     * parameter. Using -1 as the selection identifier clears the selection;
     * such an operation is equivalent to invoking {@link #clearCheck()}.</p>
     *
     * @param id the unique id of the radio button to select in this group
     *
     * @see #getCheckedRadioButtonId()
     * @see #clearCheck()
     */
    check(id:string):void  {
        // don't even bother
        if (id != null && (id == this.mCheckedId)) {
            return;
        }
        if (this.mCheckedId != null) {
            this.setCheckedStateForView(this.mCheckedId, false);
        }
        if (id != null) {
            this.setCheckedStateForView(id, true);
        }
        this.setCheckedId(id);
    }

    private setCheckedId(id:string):void  {
        this.mCheckedId = id;
        if (this.mOnCheckedChangeListener != null) {
            this.mOnCheckedChangeListener.onCheckedChanged(this, this.mCheckedId);
        }
    }

    private setCheckedStateForView(viewId:string, checked:boolean):void  {
        let checkedView:View = this.findViewById(viewId);
        if (checkedView != null && checkedView instanceof RadioButton) {
            (<RadioButton> checkedView).setChecked(checked);
        }
    }

    /**
     * <p>Returns the identifier of the selected radio button in this group.
     * Upon empty selection, the returned value is -1.</p>
     *
     * @return the unique id of the selected radio button in this group
     *
     * @see #check(int)
     * @see #clearCheck()
     *
     * @attr ref android.R.styleable#RadioGroup_checkedButton
     */
    getCheckedRadioButtonId():string  {
        return this.mCheckedId;
    }

    /**
     * <p>Clears the selection. When the selection is cleared, no radio button
     * in this group is selected and {@link #getCheckedRadioButtonId()} returns
     * null.</p>
     *
     * @see #check(int)
     * @see #getCheckedRadioButtonId()
     */
    clearCheck():void  {
        this.check(null);
    }

    /**
     * <p>Register a callback to be invoked when the checked radio button
     * changes in this group.</p>
     *
     * @param listener the callback to call on checked state change
     */
    setOnCheckedChangeListener(listener:RadioGroup.OnCheckedChangeListener):void  {
        this.mOnCheckedChangeListener = listener;
    }

    public generateLayoutParamsFromAttr(attrs: HTMLElement): android.view.ViewGroup.LayoutParams {
        return new RadioGroup.LayoutParams(this.getContext(), attrs);
    }

    /**
     * {@inheritDoc}
     */
    protected checkLayoutParams(p:ViewGroup.LayoutParams):boolean  {
        return p instanceof RadioGroup.LayoutParams;
    }

    protected generateDefaultLayoutParams():LinearLayout.LayoutParams  {
        return new RadioGroup.LayoutParams(RadioGroup.LayoutParams.WRAP_CONTENT, RadioGroup.LayoutParams.WRAP_CONTENT);
    }

}

export module RadioGroup{
export class LayoutParams extends LinearLayout.LayoutParams {

    protected setBaseAttributes(a: android.content.res.TypedArray, widthAttr: string, heightAttr: string): void {
        if (a.hasValue(widthAttr)) {
            this.width = a.getLayoutDimension(widthAttr, LayoutParams.WRAP_CONTENT);
        } else {
            this.width = LayoutParams.WRAP_CONTENT;
        }

        if (a.hasValue(heightAttr)) {
            this.height = a.getLayoutDimension(heightAttr, LayoutParams.WRAP_CONTENT);
        } else {
            this.height = LayoutParams.WRAP_CONTENT;
        }
    }
}
/**
     * <p>Interface definition for a callback to be invoked when the checked
     * radio button changed in this group.</p>
     */
export interface OnCheckedChangeListener {

    /**
         * <p>Called when the checked radio button has changed. When the
         * selection is cleared, checkedId is -1.</p>
         *
         * @param group the group in which the checked radio button has changed
         * @param checkedId the unique identifier of the newly checked radio button
         */
    onCheckedChanged(group:RadioGroup, checkedId:string):void ;
}
export class CheckedStateTracker implements CompoundButton.OnCheckedChangeListener {
    _RadioGroup_this:RadioGroup;
    constructor(arg:RadioGroup){
        this._RadioGroup_this = arg;
    }

    onCheckedChanged(buttonView:CompoundButton, isChecked:boolean):void  {
        // prevents from infinite recursion
        if (this._RadioGroup_this.mProtectFromCheckedChange) {
            return;
        }
        this._RadioGroup_this.mProtectFromCheckedChange = true;
        if (this._RadioGroup_this.mCheckedId != null) {
            this._RadioGroup_this.setCheckedStateForView(this._RadioGroup_this.mCheckedId, false);
        }
        this._RadioGroup_this.mProtectFromCheckedChange = false;
        let id:string = buttonView.getId();
        this._RadioGroup_this.setCheckedId(id);
    }
}
/**
     * <p>A pass-through listener acts upon the events and dispatches them
     * to another listener. This allows the table layout to set its own internal
     * hierarchy change listener without preventing the user to setup his.</p>
     */
export class PassThroughHierarchyChangeListener implements ViewGroup.OnHierarchyChangeListener {
    _RadioGroup_this:RadioGroup;
    constructor(arg:RadioGroup){
        this._RadioGroup_this = arg;
    }

    private mOnHierarchyChangeListener:ViewGroup.OnHierarchyChangeListener;

    onChildViewAdded(parent:View, child:View):void  {
        if (parent == this._RadioGroup_this && child instanceof RadioButton) {
            let id:string = child.getId();
            // generates an id if it's missing
            if (id == View.NO_ID) {
                id = 'hash' + child.hashCode();//View.generateViewId();
                child.setId(id);
            }
            (<RadioButton> child).setOnCheckedChangeWidgetListener(this._RadioGroup_this.mChildOnCheckedChangeListener);
        }
        if (this.mOnHierarchyChangeListener != null) {
            this.mOnHierarchyChangeListener.onChildViewAdded(parent, child);
        }
    }

    onChildViewRemoved(parent:View, child:View):void  {
        if (parent == this._RadioGroup_this && child instanceof RadioButton) {
            (<RadioButton> child).setOnCheckedChangeWidgetListener(null);
        }
        if (this.mOnHierarchyChangeListener != null) {
            this.mOnHierarchyChangeListener.onChildViewRemoved(parent, child);
        }
    }
}
}

}
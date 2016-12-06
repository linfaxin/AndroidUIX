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

///<reference path="../../android/widget/Button.ts"/>
///<reference path="../../android/widget/CheckBox.ts"/>
///<reference path="../../android/widget/CompoundButton.ts"/>
///<reference path="../../android/widget/TextView.ts"/>

module android.widget {
import Button = android.widget.Button;
import CheckBox = android.widget.CheckBox;
import CompoundButton = android.widget.CompoundButton;
import TextView = android.widget.TextView;
/**
 * <p>
 * A radio button is a two-states button that can be either checked or
 * unchecked. When the radio button is unchecked, the user can press or click it
 * to check it. However, contrary to a {@link android.widget.CheckBox}, a radio
 * button cannot be unchecked by the user once checked.
 * </p>
 *
 * <p>
 * Radio buttons are normally used together in a
 * {@link android.widget.RadioGroup}. When several radio buttons live inside
 * a radio group, checking one radio button unchecks all the others.</p>
 * </p>
 *
 * <p>See the <a href="{@docRoot}guide/topics/ui/controls/radiobutton.html">Radio Buttons</a>
 * guide.</p>
 *
 * <p><strong>XML attributes</strong></p>
 * <p> 
 * See {@link android.R.styleable#CompoundButton CompoundButton Attributes}, 
 * {@link android.R.styleable#Button Button Attributes}, 
 * {@link android.R.styleable#TextView TextView Attributes}, 
 * {@link android.R.styleable#View View Attributes}
 * </p>
 */
export class RadioButton extends CompoundButton {

    constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle = android.R.attr.radiobuttonStyle) {
        super(context, bindElement, defStyle);
    }

    /**
     * {@inheritDoc}
     * <p>
     * If the radio button is already checked, this method will not toggle the radio button.
     */
    toggle():void  {
        // checked (as opposed to check boxes widgets)
        if (!this.isChecked()) {
            super.toggle();
        }
    }
}
}
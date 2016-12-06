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
///<reference path="../../android/widget/CompoundButton.ts"/>
///<reference path="../../android/widget/TextView.ts"/>
///<reference path="../../android/R/attr.ts"/>

module android.widget {
    import Button = android.widget.Button;
    import CompoundButton = android.widget.CompoundButton;
    import TextView = android.widget.TextView;
    /**
     * <p>
     * A checkbox is a specific type of two-states button that can be either
     * checked or unchecked. A example usage of a checkbox inside your activity
     * would be the following:
     * </p>
     *
     * <pre class="prettyprint">
     * public class MyActivity extends Activity {
 *     protected void onCreate(Bundle icicle) {
 *         super.onCreate(icicle);
 *
 *         setContentView(R.layout.content_layout_id);
 *
 *         final CheckBox checkBox = (CheckBox) findViewById(R.id.checkbox_id);
 *         if (checkBox.isChecked()) {
 *             checkBox.setChecked(false);
 *         }
 *     }
 * }
     * </pre>
     *
     * <p>See the <a href="{@docRoot}guide/topics/ui/controls/checkbox.html">Checkboxes</a>
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
    export class CheckBox extends CompoundButton {

        constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle = android.R.attr.checkboxStyle) {
            super(context, bindElement, defStyle);
        }
    }
}
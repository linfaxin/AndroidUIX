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

///<reference path="../../util/SparseArray.ts"/>
///<reference path="../../../java/lang/ref/WeakReference.ts"/>
///<reference path="../../util/StateSet.ts"/>
///<reference path="../../../androidui/util/ArrayCreator.ts"/>


module android.content.res{
    import SparseArray = android.util.SparseArray;
    import StateSet = android.util.StateSet;
    import WeakReference = java.lang.ref.WeakReference;

    /**
     *
     * Lets you map {@link android.view.View} state sets to colors.
     *
     * {@link android.content.res.ColorStateList}s are created from XML resource files defined in the
     * "color" subdirectory directory of an application's resource directory.  The XML file contains
     * a single "selector" element with a number of "item" elements inside.  For example:
     *
     * <pre>
     * &lt;selector xmlns:android="http://schemas.android.com/apk/res/android"&gt;
     *   &lt;item android:state_focused="true" android:color="@color/testcolor1"/&gt;
     *   &lt;item android:state_pressed="true" android:state_enabled="false" android:color="@color/testcolor2" /&gt;
     *   &lt;item android:state_enabled="false" android:color="@color/testcolor3" /&gt;
     *   &lt;item android:color="@color/testcolor5"/&gt;
     * &lt;/selector&gt;
     * </pre>
     *
     * This defines a set of state spec / color pairs where each state spec specifies a set of
     * states that a view must either be in or not be in and the color specifies the color associated
     * with that spec.  The list of state specs will be processed in order of the items in the XML file.
     * An item with no state spec is considered to match any set of states and is generally useful as
     * a final item to be used as a default.  Note that if you have such an item before any other items
     * in the list then any subsequent items will end up being ignored.
     * <p>For more information, see the guide to <a
     * href="{@docRoot}guide/topics/resources/color-list-resource.html">Color State
     * List Resource</a>.</p>
     */
    export class ColorStateList{
        mStateSpecs:Array<Array<number>>;// must be parallel to mColors
        mColors:Array<number>;// must be parallel to mStateSpecs
        mDefaultColor = 0xffff0000;

        private static EMPTY:Array<Array<number>> = [[]];
        private static sCache = new SparseArray<WeakReference<ColorStateList>>();

        /**
         * Creates a ColorStateList that returns the specified mapping from
         * states to colors.
         */
        constructor(states:Array<Array<number>>, colors:Array<number>){
            this.mStateSpecs = states;
            this.mColors = colors;

            if (states.length > 0) {
                this.mDefaultColor = colors[0];

                for (let i = 0; i < states.length; i++) {
                    if (states[i].length == 0) {
                        this.mDefaultColor = colors[i];
                    }
                }
            }
        }

        /**
         * Creates or retrieves a ColorStateList that always returns a single color.
         */
        static valueOf(color:number):ColorStateList {
            let ref = ColorStateList.sCache.get(color);
            let csl = ref != null ? ref.get() : null;

            if (csl != null) {
                return csl;
            }

            csl = new ColorStateList(ColorStateList.EMPTY, [color]);
            ColorStateList.sCache.put(color, new WeakReference<ColorStateList>(csl));
            return csl;
        }

        /**
         * Creates a new ColorStateList that has the same states and
         * colors as this one but where each color has the specified alpha value
         * (0-255).
         */
        withAlpha(alpha:number):ColorStateList {
            let colors = androidui.util.ArrayCreator.newNumberArray(this.mColors.length);

            let len = colors.length;
            for (let i = 0; i < len; i++) {
                colors[i] = (this.mColors[i] & 0xFFFFFF) | (alpha << 24);
            }

            return new ColorStateList(this.mStateSpecs, colors);
        }

        isStateful():boolean {
            return this.mStateSpecs.length > 1;
        }

        /**
         * Return the color associated with the given set of {@link android.view.View} states.
         *
         * @param stateSet an array of {@link android.view.View} states
         * @param defaultColor the color to return if there's not state spec in this
         * {@link ColorStateList} that matches the stateSet.
         *
         * @return the color associated with that set of states in this {@link ColorStateList}.
         */
        getColorForState(stateSet:Array<number>, defaultColor:number):number {
            const setLength = this.mStateSpecs.length;
            for (let i = 0; i < setLength; i++) {
                let stateSpec = this.mStateSpecs[i];
                if (StateSet.stateSetMatches(stateSpec, stateSet)) {
                    return this.mColors[i];
                }
            }
            return defaultColor;
        }

        /**
         * Return the default color in this {@link ColorStateList}.
         *
         * @return the default color in this {@link ColorStateList}.
         */
        getDefaultColor() {
            return this.mDefaultColor;
        }

        toString() {
            return "ColorStateList{" +
                "mStateSpecs=" + JSON.stringify(this.mStateSpecs) +
                "mColors=" + JSON.stringify(this.mColors) +
                "mDefaultColor=" + this.mDefaultColor + '}';
        }


    }
}
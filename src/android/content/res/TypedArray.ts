/*
 * Copyright (C) 2008 The Android Open Source Project
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

///<reference path="../../../androidui/attr/AttrValueParser.ts"/>

module android.content.res {

    import DisplayMetrics = android.util.DisplayMetrics;
    import Color = android.graphics.Color;
    import TypedValue = android.util.TypedValue;
    import Drawable = android.graphics.drawable.Drawable;
    import ColorDrawable = android.graphics.drawable.ColorDrawable;
    import AttrValueParser = androidui.attr.AttrValueParser;

    /**
     * Container for an array of values that were retrieved with
     * {@link Resources.Theme#obtainStyledAttributes(AttributeSet, int[], int, int)}
     * or {@link Resources#obtainAttributes}.  Be
     * sure to call {@link #recycle} when done with them.
     *
     * The indices used to retrieve values from this structure correspond to
     * the positions of the attributes given to obtainStyledAttributes.
     */
    export class TypedArray {

        static obtain(res:android.content.res.Resources, xml:HTMLElement, defStyleAttr?:Map<string, string>):TypedArray {
            const attrMap = new Map<string, string>();
            if (defStyleAttr) {
                for(let [key, value] of defStyleAttr.entries()) {
                    attrMap.set(key.toLowerCase(), value); // lower case like dom's attribute
                }
            }
            if (xml) {
                const refStyleString = xml.getAttribute('android:style');
                if (refStyleString) {
                    const map = res.getStyleAsMap(refStyleString);
                    if (map) {
                        for(let [key, value] of map.entries()) {
                            attrMap.set(key.toLowerCase(), value);
                        }
                    }
                }
                for (let attr of Array.from(xml.attributes)) {
                    const name = attr.name;
                    if (name === 'android:style' || name === 'style') continue;
                    attrMap.set(name, attr.value);
                }
            }

            const attrs = res.mTypedArrayPool.acquire();
            if (attrs != null) {
                attrs.mRecycled = false;
                attrs.attrMap = attrMap;
                attrs.attrMapKeysCache = [];
                return attrs;
            }
            return new TypedArray(res, attrMap);
        }

        private mResources:android.content.res.Resources;
        private attrMap:Map<string, string>;
        private attrMapKeysCache:string[];
        private mRecycled:boolean;

        constructor(res:android.content.res.Resources, attrMap:Map<string, string>) {
            this.mResources = res;
            this.attrMap = attrMap;
        }

        private checkRecycled():void {
            if (this.mRecycled) {
                throw new Error("RuntimeException : Cannot make calls to a recycled instance!");
            }
        }

        /**
         * Return the number of values in this array.
         */
        public length():number {
            this.checkRecycled();
            if (!this.attrMap) return 0;
            return this.attrMap.size;
        }

        /**
         * Return the attrName for the the index in this array.
         * AndroidUIX Deprecated: please use {@link #getLowerCaseNoNamespaceAttrNames} to traverse the attrNames
         * @deprecated
         */
        public getIndex(keyIndex:number):string {
            if (!this.attrMapKeysCache) {
                this.attrMapKeysCache = Array.from(this.attrMap.keys());
            }
            return this.attrMapKeysCache[keyIndex];
        }

        public getLowerCaseNoNamespaceAttrNames():Array<string> {
            const keys = [];
            for(let key of this.attrMap.keys()) {
                keys.push(key.split(':').pop());
            }
            return keys;
        }

        /**
         * Return the Resources object this array was loaded from.
         */
        public getResources():android.content.res.Resources {
            return this.mResources;
        }

        public getAttrValue(attrName:string):string {
            const name = attrName.toLowerCase();
            return this.attrMap && (this.attrMap.get(name) || this.attrMap.get('android:' + name));
        }

        public getResourceId(attrName:string, defaultResourceId:string):string {
            if (this.hasValueOrEmpty(attrName)) {
                return this.getAttrValue(attrName);
            }
            return defaultResourceId;
        }

        /**
         * Retrieve the styled string value for the attribute at <var>index</var>.
         *
         * @param attrName attr name.
         *
         * @return CharSequence holding string data.  May be styled.  Returns
         *         null if the attribute is not defined.
         */
        public getText(attrName:string):string {
            return this.getString(attrName);
        }

        /**
         * Retrieve the string value for the attribute at <var>index</var>.
         *
         * @param attrName attr name.
         *
         * @return String holding string data.  Any styling information is
         * removed.  Returns null if the attribute is not defined.
         */
        public getString(attrName:string):string {
            this.checkRecycled();
            let value = this.getAttrValue(attrName);
            return AttrValueParser.parseString(this.mResources, value, value);
        }


        /**
         * Retrieve the boolean value for the attribute at <var>index</var>.
         *
         * @param attrName attr name.
         * @param defValue Value to return if the attribute is not defined.
         *
         * @return Attribute boolean value, or defValue if not defined.
         */
        public getBoolean(attrName:string, defValue:boolean):boolean {
            this.checkRecycled();
            let value = this.getAttrValue(attrName);
            return AttrValueParser.parseBoolean(this.mResources, value, defValue);
        }

        /**
         * Retrieve the integer value for the attribute at <var>index</var>.
         *
         * @param attrName attr name.
         * @param defValue Value to return if the attribute is not defined.
         *
         * @return Attribute int value, or defValue if not defined.
         */
        public getInt(attrName:string, defValue:number):number {
            this.checkRecycled();
            let value = this.getAttrValue(attrName);
            return AttrValueParser.parseInt(this.mResources, value, defValue);
        }


        /**
         * Retrieve the float value for the attribute at <var>index</var>.
         *
         * @param attrName attr name.
         * @param defValue Value to return if the attribute is not defined.
         *
         * @return Attribute float value, or defValue if not defined..
         */
        public getFloat(attrName:string, defValue:number):number {
            this.checkRecycled();
            let value = this.getAttrValue(attrName);
            return AttrValueParser.parseFloat(this.mResources, value, defValue);
        }

        /**
         * Retrieve the color value for the attribute at <var>index</var>.  If
         * the attribute references a color resource holding a complex
         * {@link android.content.res.ColorStateList}, then the default color from
         * the set is returned.
         *
         * @param attrName attr name.
         * @param defValue Value to return if the attribute is not defined or
         *                 not a resource.
         *
         * @return Attribute color value, or defValue if not defined.
         */
        public getColor(attrName:string, defValue:number):number {
            this.checkRecycled();
            let value = this.getAttrValue(attrName);
            return AttrValueParser.parseColor(this.mResources, value, defValue);
        }

        /**
         * Retrieve the ColorStateList for the attribute at <var>index</var>.
         * The value may be either a single solid color or a reference to
         * a color or complex {@link android.content.res.ColorStateList} description.
         *
         * @param attrName attr name.
         *
         * @return ColorStateList for the attribute, or null if not defined.
         */
        public getColorStateList(attrName:string):android.content.res.ColorStateList {
            this.checkRecycled();
            let value = this.getAttrValue(attrName);
            return AttrValueParser.parseColorStateList(this.mResources, value);
        }

        /**
         * Retrieve the integer value for the attribute at <var>index</var>.
         *
         * @param attrName attr name.
         * @param defValue Value to return if the attribute is not defined.
         *
         * @return Attribute int value, or defValue if not defined.
         */
        public getInteger(attrName:string, defValue:number):number {
            return this.getInt(attrName, defValue);
        }

        public getLayoutDimension(attrName:string, defValue:number):number {
            this.checkRecycled();
            let value = this.getAttrValue(attrName);
            if (value === 'wrap_content') return -2;
            if (value === 'fill_parent' || value === 'match_parent') return -1;
            return AttrValueParser.parseDimension(this.mResources, value, defValue);
        }

        /**
         * Retrieve a dimensional unit attribute at <var>index</var>.  Unit
         * conversions are based on the current {@link DisplayMetrics}
         * associated with the resources this {@link TypedArray} object
         * came from.
         *
         * @param attrName attr name.
         * @param defValue Value to return if the attribute is not defined or
         *                 not a resource.
         *
         * @return Attribute dimension value multiplied by the appropriate
         * metric, or defValue if not defined.
         *
         * @see #getDimensionPixelOffset
         * @see #getDimensionPixelSize
         */
        public getDimension(attrName:string, defValue:number):number {
            this.checkRecycled();
            let value = this.getAttrValue(attrName);
            return AttrValueParser.parseDimension(this.mResources, value, defValue);
        }

        /**
         * Retrieve a dimensional unit attribute at <var>index</var> for use
         * as an offset in raw pixels.  This is the same as
         * {@link #getDimension}, except the returned value is converted to
         * integer pixels for you.  An offset conversion involves simply
         * truncating the base value to an integer.
         *
         * @param attrName attr name.
         * @param defValue Value to return if the attribute is not defined or
         *                 not a resource.
         *
         * @return Attribute dimension value multiplied by the appropriate
         * metric and truncated to integer pixels, or defValue if not defined.
         *
         * @see #getDimension
         * @see #getDimensionPixelSize
         */
        public getDimensionPixelOffset(attrName:string, defValue:number):number {
            this.checkRecycled();
            let value = this.getAttrValue(attrName);
            return AttrValueParser.parseDimensionPixelOffset(this.mResources, value, defValue);
        }


        /**
         * Retrieve a dimensional unit attribute at <var>index</var> for use
         * as a size in raw pixels.  This is the same as
         * {@link #getDimension}, except the returned value is converted to
         * integer pixels for use as a size.  A size conversion involves
         * rounding the base value, and ensuring that a non-zero base value
         * is at least one pixel in size.
         *
         * @param attrName attr name.
         * @param defValue Value to return if the attribute is not defined or
         *                 not a resource.
         *
         * @return Attribute dimension value multiplied by the appropriate
         * metric and truncated to integer pixels, or defValue if not defined.
         *
         * @see #getDimension
         * @see #getDimensionPixelOffset
         */
        public getDimensionPixelSize(attrName:string, defValue:number):number {
            this.checkRecycled();
            let value = this.getAttrValue(attrName);
            return AttrValueParser.parseDimensionPixelSize(this.mResources, value, defValue);
        }

        /**
         * Retrieve the Drawable for the attribute at <var>index</var>.
         *
         * @param attrName attr name.
         *
         * @return Drawable for the attribute, or null if not defined.
         */
        public getDrawable(attrName:string):Drawable {
            this.checkRecycled();
            let value = this.getAttrValue(attrName);
            return AttrValueParser.parseDrawable(this.mResources, value);
        }

        /**
         * Retrieve the CharSequence[] for the attribute at <var>index</var>.
         * This gets the resource ID of the selected attribute, and uses
         * {@link Resources#getTextArray Resources.getTextArray} of the owning
         * Resources object to retrieve its String[].
         *
         * @param attrName attr name.
         *
         * @return CharSequence[] for the attribute, or null if not defined.
         */
        public getTextArray(attrName:string):string[] {
            this.checkRecycled();
            let value = this.getAttrValue(attrName);
            return AttrValueParser.parseTextArray(this.mResources, value);
        }

        /**
         * Determines whether there is an attribute at <var>index</var>.
         * <p>
         * <strong>Note:</strong> If the attribute was set to {@code @empty} or
         * {@code @undefined}, this method returns {@code false}.
         *
         * @param attrName attr name.
         *
         * @return True if the attribute has a value, false otherwise.
         */
        public hasValue(attrName:string):boolean {
            this.checkRecycled();
            return this.getAttrValue(attrName) != null;
        }


        /**
         * Determines whether there is an attribute at <var>index</var>, returning
         * {@code true} if the attribute was explicitly set to {@code @empty} and
         * {@code false} only if the attribute was undefined.
         *
         * @param attrName attr name.
         *
         * @return True if the attribute has a value or is empty, false otherwise.
         */
        public hasValueOrEmpty(attrName:string):boolean {
            this.checkRecycled();
            const name = attrName.toLowerCase();
            return this.attrMap && (this.attrMap.has(name) || this.attrMap.has('android:' + name));
        }


        /**
         * Recycle the TypedArray, to be re-used by a later caller. After calling
         * this function you must not ever touch the typed array again.
         */
        public recycle():void {
            this.mRecycled = true;
            this.attrMap = null;
            this.attrMapKeysCache = null;
            this.mResources.mTypedArrayPool.release(this);
        }

    }
}
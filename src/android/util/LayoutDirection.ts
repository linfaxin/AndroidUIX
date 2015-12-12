/*
 * Copyright (C) 2013 The Android Open Source Project
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


module android.util {
/**
 * A class for defining layout directions. A layout direction can be left-to-right (LTR)
 * or right-to-left (RTL). It can also be inherited (from a parent) or deduced from the default
 * language script of a locale.
 */
export class LayoutDirection {

    /**
     * Horizontal layout direction is from Left to Right.
     */
    static LTR:number = 0;

    /**
     * Horizontal layout direction is from Right to Left.
     */
    static RTL:number = 1;

    /**
     * Horizontal layout direction is inherited.
     */
    static INHERIT:number = 2;

    /**
     * Horizontal layout direction is deduced from the default language script for the locale.
     */
    static LOCALE:number = 3;
}
}
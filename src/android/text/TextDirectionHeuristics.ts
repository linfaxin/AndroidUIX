/*
 * Copyright (C) 2011 The Android Open Source Project
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
///<reference path="../../android/text/Layout.ts"/>
///<reference path="../../android/text/TextDirectionHeuristic.ts"/>
///<reference path="../../android/text/TextUtils.ts"/>

module android.text {
    import View = android.view.View;
    import Layout = android.text.Layout;
    import TextDirectionHeuristic = android.text.TextDirectionHeuristic;
    import TextUtils = android.text.TextUtils;

    /**
     * Some objects that implement {@link TextDirectionHeuristic}. Use these with
     * the {@link BidiFormatter#unicodeWrap unicodeWrap()} methods in {@link BidiFormatter}.
     * Also notice that these direction heuristics correspond to the same types of constants
     * provided in the {@link android.view.View} class for {@link android.view.View#setTextDirection
     * setTextDirection()}, such as {@link android.view.View#TEXT_DIRECTION_RTL}.
     * <p>To support versions lower than {@link android.os.Build.VERSION_CODES#JELLY_BEAN_MR2},
     * you can use the support library's {@link android.support.v4.text.TextDirectionHeuristicsCompat}
     * class.
     *
     */
    export class TextDirectionHeuristics {

        /**
         * Always decides that the direction is left to right.
         */
        static LTR:TextDirectionHeuristic;

        /**
         * Always decides that the direction is right to left.
         */
        static RTL:TextDirectionHeuristic;

        /**
         * Determines the direction based on the first strong directional character, including bidi
         * format chars, falling back to left to right if it finds none. This is the default behavior
         * of the Unicode Bidirectional Algorithm.
         */
        static FIRSTSTRONG_LTR:TextDirectionHeuristic;

        /**
         * Determines the direction based on the first strong directional character, including bidi
         * format chars, falling back to right to left if it finds none. This is similar to the default
         * behavior of the Unicode Bidirectional Algorithm, just with different fallback behavior.
         */
        static FIRSTSTRONG_RTL:TextDirectionHeuristic;

        /**
         * If the text contains any strong right to left non-format character, determines that the
         * direction is right to left, falling back to left to right if it finds none.
         */
        static ANYRTL_LTR:TextDirectionHeuristic;

        /**
         * Force the paragraph direction to the Locale direction. Falls back to left to right.
         */
        static LOCALE:TextDirectionHeuristic;

        /**
         * State constants for taking care about true / false / unknown
         */
        private static STATE_TRUE:number = 0;

        private static STATE_FALSE:number = 1;

        private static STATE_UNKNOWN:number = 2;

        private static isRtlText(directionality:number):number {
            return TextDirectionHeuristics.STATE_FALSE;
            //switch(directionality) {
            //    case Character.DIRECTIONALITY_LEFT_TO_RIGHT:
            //        return TextDirectionHeuristics.STATE_FALSE;
            //    case Character.DIRECTIONALITY_RIGHT_TO_LEFT:
            //    case Character.DIRECTIONALITY_RIGHT_TO_LEFT_ARABIC:
            //        return TextDirectionHeuristics.STATE_TRUE;
            //    default:
            //        return TextDirectionHeuristics.STATE_UNKNOWN;
            //}
        }

        private static isRtlTextOrFormat(directionality:number):number {
            return TextDirectionHeuristics.STATE_FALSE;
            //switch(directionality) {
            //    case Character.DIRECTIONALITY_LEFT_TO_RIGHT:
            //    case Character.DIRECTIONALITY_LEFT_TO_RIGHT_EMBEDDING:
            //    case Character.DIRECTIONALITY_LEFT_TO_RIGHT_OVERRIDE:
            //        return TextDirectionHeuristics.STATE_FALSE;
            //    case Character.DIRECTIONALITY_RIGHT_TO_LEFT:
            //    case Character.DIRECTIONALITY_RIGHT_TO_LEFT_ARABIC:
            //    case Character.DIRECTIONALITY_RIGHT_TO_LEFT_EMBEDDING:
            //    case Character.DIRECTIONALITY_RIGHT_TO_LEFT_OVERRIDE:
            //        return TextDirectionHeuristics.STATE_TRUE;
            //    default:
            //        return TextDirectionHeuristics.STATE_UNKNOWN;
            //}
        }
    }

    export module TextDirectionHeuristics {
        /**
         * Computes the text direction based on an algorithm.  Subclasses implement
         * {@link #defaultIsRtl} to handle cases where the algorithm cannot determine the
         * direction from the text alone.
         */
    export
        abstract

        class TextDirectionHeuristicImpl implements TextDirectionHeuristic {

            private mAlgorithm:TextDirectionHeuristics.TextDirectionAlgorithm;

            constructor(algorithm:TextDirectionHeuristics.TextDirectionAlgorithm) {
                this.mAlgorithm = algorithm;
            }

            /**
             * Return true if the default text direction is rtl.
             */
            protected abstract

            defaultIsRtl():boolean ;

            isRtl(cs:string, start:number, count:number):boolean {
                if (cs == null || start < 0 || count < 0 || cs.length - count < start) {
                    throw Error(`new IllegalArgumentException()`);
                }
                if (this.mAlgorithm == null) {
                    return this.defaultIsRtl();
                }
                return this.doCheck(cs, start, count);
            }

            private doCheck(cs:string, start:number, count:number):boolean {
                switch (this.mAlgorithm.checkRtl(cs, start, count)) {
                    case TextDirectionHeuristics.STATE_TRUE:
                        return true;
                    case TextDirectionHeuristics.STATE_FALSE:
                        return false;
                    default:
                        return this.defaultIsRtl();
                }
            }
        }
        export class TextDirectionHeuristicInternal extends TextDirectionHeuristics.TextDirectionHeuristicImpl {

            private mDefaultIsRtl:boolean;

            constructor(algorithm:TextDirectionHeuristics.TextDirectionAlgorithm, defaultIsRtl:boolean) {
                super(algorithm);
                this.mDefaultIsRtl = defaultIsRtl;
            }

            protected defaultIsRtl():boolean {
                return this.mDefaultIsRtl;
            }
        }
        /**
         * Interface for an algorithm to guess the direction of a paragraph of text.
         */
        export interface TextDirectionAlgorithm {

            /**
             * Returns whether the range of text is RTL according to the algorithm.
             */
            checkRtl(cs:string, start:number, count:number):number ;
        }
        /**
         * Algorithm that uses the first strong directional character to determine the paragraph
         * direction. This is the standard Unicode Bidirectional algorithm.
         */
        export class FirstStrong implements TextDirectionHeuristics.TextDirectionAlgorithm {

            checkRtl(cs:string, start:number, count:number):number {
                let result:number = TextDirectionHeuristics.STATE_UNKNOWN;
                for (let i:number = start, e:number = start + count; i < e && result == TextDirectionHeuristics.STATE_UNKNOWN; ++i) {
                    result = TextDirectionHeuristics.STATE_FALSE;
                    //result = TextDirectionHeuristics.isRtlTextOrFormat(Character.getDirectionality(cs.charAt(i)));
                }
                return result;
            }

            constructor() {
            }

            static INSTANCE:FirstStrong = new FirstStrong();
        }
        /**
         * Algorithm that uses the presence of any strong directional non-format
         * character (e.g. excludes LRE, LRO, RLE, RLO) to determine the
         * direction of text.
         */
        export class AnyStrong implements TextDirectionHeuristics.TextDirectionAlgorithm {

            private mLookForRtl:boolean;

            checkRtl(cs:string, start:number, count:number):number {
                let haveUnlookedFor:boolean = false;
                for (let i:number = start, e:number = start + count; i < e; ++i) {
                    switch (TextDirectionHeuristics.isRtlText(0/*Character.getDirectionality(cs.charAt(i))*/)) {
                        case TextDirectionHeuristics.STATE_TRUE:
                            if (this.mLookForRtl) {
                                return TextDirectionHeuristics.STATE_TRUE;
                            }
                            haveUnlookedFor = true;
                            break;
                        case TextDirectionHeuristics.STATE_FALSE:
                            if (!this.mLookForRtl) {
                                return TextDirectionHeuristics.STATE_FALSE;
                            }
                            haveUnlookedFor = true;
                            break;
                        default:
                            break;
                    }
                }
                if (haveUnlookedFor) {
                    return this.mLookForRtl ? TextDirectionHeuristics.STATE_FALSE : TextDirectionHeuristics.STATE_TRUE;
                }
                return TextDirectionHeuristics.STATE_UNKNOWN;
            }

            constructor(lookForRtl:boolean) {
                this.mLookForRtl = lookForRtl;
            }

            static INSTANCE_RTL:AnyStrong = new AnyStrong(true);

            static INSTANCE_LTR:AnyStrong = new AnyStrong(false);
        }
        /**
         * Algorithm that uses the Locale direction to force the direction of a paragraph.
         */
        export class TextDirectionHeuristicLocale extends TextDirectionHeuristics.TextDirectionHeuristicImpl {

            constructor() {
                super(null);
            }

            protected defaultIsRtl():boolean {
                return false;
                //const dir:number = TextUtils.getLayoutDirectionFromLocale(java.util.Locale.getDefault());
                //return (dir == View.LAYOUT_DIRECTION_RTL);
            }

            static INSTANCE:TextDirectionHeuristicLocale = new TextDirectionHeuristicLocale();
        }


    }

    //delay init
    TextDirectionHeuristics.LTR = new TextDirectionHeuristics.TextDirectionHeuristicInternal(null, /* no algorithm */false);
    TextDirectionHeuristics.RTL = new TextDirectionHeuristics.TextDirectionHeuristicInternal(null, /* no algorithm */true);
    TextDirectionHeuristics.FIRSTSTRONG_LTR = new TextDirectionHeuristics.TextDirectionHeuristicInternal(TextDirectionHeuristics.FirstStrong.INSTANCE, false);
    TextDirectionHeuristics.FIRSTSTRONG_RTL = new TextDirectionHeuristics.TextDirectionHeuristicInternal(TextDirectionHeuristics.FirstStrong.INSTANCE, true);
    TextDirectionHeuristics.ANYRTL_LTR = new TextDirectionHeuristics.TextDirectionHeuristicInternal(TextDirectionHeuristics.AnyStrong.INSTANCE_RTL, false);
    TextDirectionHeuristics.LOCALE = TextDirectionHeuristics.TextDirectionHeuristicLocale.INSTANCE;


}
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

///<reference path="../../java/lang/System.ts"/>
///<reference path="../../androidui/util/ArrayCreator.ts"/>

module android.util{
    import System = java.lang.System;

    /**
     * State sets are arrays of positive ints where each element
     * represents the state of a {@link android.view.View} (e.g. focused,
     * selected, visible, etc.).  A {@link android.view.View} may be in
     * one or more of those states.
     *
     * A state spec is an array of signed ints where each element
     * represents a required (if positive) or an undesired (if negative)
     * {@link android.view.View} state.
     *
     * Utils dealing with state sets.
     *
     * In theory we could encapsulate the state set and state spec arrays
     * and not have static methods here but there is some concern about
     * performance since these methods are called during view drawing.
     */
    export class StateSet{
        static WILD_CARD:Array<number> = [];
        static NOTHING:Array<number> = [0];

        /**
         * Return whether the stateSetOrSpec is matched by all StateSets.
         *
         * @param stateSetOrSpec a state set or state spec.
         */
        static isWildCard(stateSetOrSpec:Array<number>):boolean{
            return stateSetOrSpec.length == 0 || stateSetOrSpec[0] == 0;
        }

        /**
         * Return whether the stateSet matches the desired stateSpec.
         *
         * @param stateSpec an array of required (if positive) or
         *        prohibited (if negative) {@link android.view.View} states.
         * @param stateSet an array of {@link android.view.View} states
         */
        static stateSetMatches(stateSpec:Array<number>, stateSetOrState:Array<number>|number):boolean{
            if(Number.isInteger(<number>stateSetOrState)){
                return StateSet._stateSetMatches_single(stateSpec, <number>stateSetOrState);
            }
            let stateSet = <Array<number>>stateSetOrState;
            if (stateSet == null) {
                return (stateSpec == null || this.isWildCard(stateSpec));
            }
            let stateSpecSize = stateSpec.length;
            let stateSetSize = stateSet.length;
            for (let i = 0; i < stateSpecSize; i++) {
                let stateSpecState = stateSpec[i];
                if (stateSpecState == 0) {
                    // We've reached the end of the cases to match against.
                    return true;
                }
                let mustMatch;
                if (stateSpecState > 0) {
                    mustMatch = true;
                } else {
                    // We use negative values to indicate must-NOT-match states.
                    mustMatch = false;
                    stateSpecState = -stateSpecState;
                }
                let found = false;
                for (let j = 0; j < stateSetSize; j++) {
                    const state = stateSet[j];
                    if (state == 0) {
                        // We've reached the end of states to match.
                        if (mustMatch) {
                            // We didn't find this must-match state.
                            return false;
                        } else {
                            // Continue checking other must-not-match states.
                            break;
                        }
                    }
                    if (state == stateSpecState) {
                        if (mustMatch) {
                            found = true;
                            // Continue checking other other must-match states.
                            break;
                        } else {
                            // Any match of a must-not-match state returns false.
                            return false;
                        }
                    }
                }
                if (mustMatch && !found) {
                    // We've reached the end of states to match and we didn't
                    // find a must-match state.
                    return false;
                }
            }
            return true;
        }

        private static _stateSetMatches_single(stateSpec:Array<number>, state:number):boolean{
            let stateSpecSize = stateSpec.length;
            for (let i = 0; i < stateSpecSize; i++) {
                let stateSpecState = stateSpec[i];
                if (stateSpecState == 0) {
                    // We've reached the end of the cases to match against.
                    return true;
                }
                if (stateSpecState > 0) {
                    if (state != stateSpecState) {
                        return false;
                    }
                } else {
                    // We use negative values to indicate must-NOT-match states.
                    if (state == -stateSpecState) {
                        // We matched a must-not-match case.
                        return false;
                    }
                }
            }
            return true;
        }

        static trimStateSet(states:Array<number>, newSize:number):Array<number>{
            if (states.length == newSize) {
                return states;
            }
            let trimmedStates = androidui.util.ArrayCreator.newNumberArray(newSize);
            System.arraycopy(states, 0, trimmedStates, 0, newSize);
            return trimmedStates;
        }

    }
}
/**
 * Created by linfaxin on 15/10/29.
 */
///<reference path="../../java/lang/System.ts"/>

module android.util{
    import System = java.lang.System;

    export class StateSet{
        static WILD_CARD:Array<number> = [];
        static NOTHING:Array<number> = [0];

        static isWildCard(stateSetOrSpec:Array<number>):boolean{
            return stateSetOrSpec.length == 0 || stateSetOrSpec[0] == 0;
        }
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
            let trimmedStates = new Array<number>(newSize);
            System.arraycopy(states, 0, trimmedStates, 0, newSize);
            return trimmedStates;
        }

    }
}
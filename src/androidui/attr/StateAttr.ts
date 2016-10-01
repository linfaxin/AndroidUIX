/**
 * Created by linfaxin on 15/11/3.
 */
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/util/StateSet.ts"/>
///<reference path="../../java/util/Arrays.ts"/>

module androidui.attr{

    export class StateAttr {
        private stateSpec:number[];
        private attributes = new Map<string,string>();

        constructor(state:number[]) {
            this.stateSpec = state.concat().sort();
        }

        clone():StateAttr {
            let stateAttr = new StateAttr(this.stateSpec);
            stateAttr.attributes = new Map<string, string>(this.attributes);
            return stateAttr;
        }

        setAttr(name:string, value:string){
            this.attributes.set(name, value);
        }

        hasAttr(name:string){
            return this.attributes.has(name);
        }

        getAttrMap():Map<string, string>{
            return this.attributes;
        }

        putAll(stateAttr:StateAttr){
            for(let [key, value] of stateAttr.attributes.entries()){
                this.attributes.set(key, value);
            }
        }

        isDefaultState():boolean {
            return this.stateSpec.length === 0;
        }

        isStateEquals(state:number[]):boolean{
            if(!state) return false;
            return java.util.Arrays.equals(this.stateSpec, state.concat().sort());
        }

        isStateMatch(state:number[]):boolean{
            return android.util.StateSet.stateSetMatches(this.stateSpec, state);
        }


        /**
         * this:{'k1':'v1', 'k3':'v3-1'}
         * another:{'k2':'v2', 'k3':'v3-2'}
         * @returns {Map<K, V>} new map: {'k1':'v1', 'k2':null, 'k3':'v3-1'}
         */
        createDiffKeyAsNullValueAttrMap(another:StateAttr):Map<string,string>{
            if(!another) return this.attributes;
            let removed = new Map<string, string>(another.attributes);
            for(let key of this.attributes.keys()) removed.delete(key);

            let merge = new Map<string, string>(this.attributes);
            for(let key of removed.keys()) merge.set(key, <string>null);

            return merge;
        }
    }
}
/**
 * Created by linfaxin on 15/11/3.
 */
///<reference path="StateAttr.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/util/StateSet.ts"/>

module androidui.attr{
    import View = android.view.View;

    export class StateAttrList{
        private list:Array<StateAttr> = [];
        private matchedAttrCache:Array<StateAttr> = [];
        private mView:View;

        constructor(view:View){
            this.mView = view;
            this.optStateAttr([]);//ensure default stateAttr

            let attrMap = new Map<string, string>();
            let attributes = Array.from(view.bindElement.attributes);
            for(let attr of attributes){
                attrMap.set(attr.name, attr.value);
            }
            this._initStyleAttributes(attrMap, []);
        }

        private _initStyleAttributes(attrMap:Map<string,string>, inParseState:number[]){

            //parse ref style first
            let refStyleValue = attrMap.get('android:style');
            if(refStyleValue){
                attrMap.delete('android:style');
                this._initStyleAttr('android:style', refStyleValue, inParseState);
            }

            //parse inline style (override the ref style)
            for (let [key, value] of attrMap.entries()) {
                if(key.startsWith('android:state_')){
                    continue;
                }
                this._initStyleAttr(key, value, inParseState);
            }

            //parse ref stated style
            for (let [key, value] of attrMap.entries()) {
                if(key.startsWith('android:state_')){
                    this._initStyleAttr(key, value, inParseState);
                }
            }
        }

        private _initStyleAttr(attrName:string, attrValue:string, inParseState:number[]){
            if(!attrName.startsWith('android:')) return;
            attrName = attrName.substring('android:'.length);
            if(attrName==='id') return;

            if(attrName.startsWith('state_')){
                let state = attrName.substring('state_'.length);
                let stateValue = android.view.View['VIEW_STATE_' + state.toUpperCase()];
                if(typeof stateValue === "number"){
                    inParseState = inParseState.concat(stateValue).sort();
                }
            }

            let _stateAttr = this.optStateAttr(inParseState);

            //parse style or stated style
            if(attrName.startsWith('state_') || attrName==='style'){
                //attr with state
                if(attrValue.startsWith('@style/')){
                    //support: android:state_pressed="@style/myStyle"
                    let styleMap = this.mView.getResources().getStyleAsMap(attrValue);
                    if(styleMap && styleMap.size>0){
                        this._initStyleAttributes(styleMap, inParseState);
                    }

                }else{
                    //support: android:state_pressed="padding:10dp; background:#333;"
                    for(let part of attrValue.split(';')){
                        let [name, value] = part.split(':');
                        if(name) _stateAttr.setAttr(name.trim().toLowerCase(), value);
                    }
                }
            }else{
                _stateAttr.setAttr(attrName, attrValue);
            }
        }

        getDefaultStateAttr():StateAttr{
            for(let stateAttr of this.list){
                if(stateAttr.isDefaultState()) return stateAttr;
            }
        }

        private getStateAttr(state:number[]):StateAttr{
            for(let stateAttr of this.list){
                if(stateAttr.isStateEquals(state)) return stateAttr;
            }
        }

        private optStateAttr(state:number[]):StateAttr{
            let stateAttr = this.getStateAttr(state);
            if(!stateAttr){
                stateAttr = new StateAttr(state);
                this.list.push(stateAttr);
            }
            return stateAttr;
        }

        getMatchedStateAttr(state:number[]):StateAttr {
            if(state == null) return null;
            for(let stateAttr of this.matchedAttrCache){
                if(stateAttr.isStateEquals(state)) return stateAttr;
            }
            let matchedAttr:StateAttr = new StateAttr(state);
            for(let stateAttr of this.list){
                if(stateAttr.isDefaultState()) continue;//ignore default state
                if(stateAttr.isStateMatch(state)){
                    matchedAttr.putAll(stateAttr);
                }
            }
            this.matchedAttrCache.push(matchedAttr);
            return matchedAttr;
        }

        /**
         * call when the attr is not stateable (when user set a new value to the attr by code)
         * @param attrName this attr's name
         */
        removeAttrAllState(attrName:string){
            for(let stateAttr of this.list){
                stateAttr.getAttrMap().delete(attrName);
            }
            for(let stateAttr of this.matchedAttrCache){
                stateAttr.getAttrMap().delete(attrName);
            }
        }
    }
}
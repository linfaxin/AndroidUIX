/**
 * Created by linfaxin on 15/11/3.
 */
///<reference path="StateAttr.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/util/StateSet.ts"/>

let STATE_MAP:Map<string, number>; // delay init, because android.view.View was undefined now.

module androidui.attr {
    import View = android.view.View;

    export class StateAttrList {
        private originStateAttrList:Array<StateAttr> = [];
        private matchedStateAttrList:Array<StateAttr> = [];
        private mView:View;

        constructor(view:View){
            this.mView = view;
            this.getOrCreateStateAttr([]); // create default stateAttr
        }

        static getViewStateValue(attrName:string):number {
            if (!STATE_MAP) { // delay init
                STATE_MAP = new Map<string, number>()
                    .set('state_window_focused', android.view.View.VIEW_STATE_WINDOW_FOCUSED)
                    .set('state_selected', android.view.View.VIEW_STATE_SELECTED)
                    .set('state_focused', android.view.View.VIEW_STATE_FOCUSED)
                    .set('state_enabled', android.view.View.VIEW_STATE_ENABLED)
                    .set('state_disabled', -android.view.View.VIEW_STATE_ENABLED)
                    .set('state_pressed', android.view.View.VIEW_STATE_PRESSED)
                    .set('state_activated', android.view.View.VIEW_STATE_ACTIVATED)
                    .set('state_hovered', android.view.View.VIEW_STATE_HOVERED)
                    .set('state_checked', android.view.View.VIEW_STATE_CHECKED);
            }
            return STATE_MAP.get(attrName.split(':').pop());
        }

        public addStatedAttr(attrName:string, attrValue:string):void {
            this.addStatedAttrImpl(attrName, attrValue, []);
        }

        private addStatedAttrImpl(attrName:string, attrValue:string, inParseState:number[]){
            const stateValue = StateAttrList.getViewStateValue(attrName);
            if(stateValue != null) {
                const newInParseState = inParseState.concat(stateValue).sort();
                let _stateAttr = this.getOrCreateStateAttr(newInParseState);

                //attr with state
                if(attrValue.startsWith('@')){
                    //support: android:state_pressed="@style/myStyle"
                    let styleMap = this.mView.getResources().getStyleAsMap(attrValue);
                    if(styleMap && styleMap.size > 0) {
                        const statedEntries:Array<Array<any>> = [];
                        for(let entry of styleMap.entries()) {
                            const [key, value] = entry;
                            if (key.startsWith('android:state_')) {
                                statedEntries.push(entry);
                            } else {
                                _stateAttr.setAttr(key.toLowerCase(), value);
                            }
                        }
                        for(let entry of statedEntries) {
                            const [key, value] = entry;
                            this.addStatedAttrImpl(key, value, newInParseState);
                        }
                    }

                }else{
                    // support like: android:state_pressed="padding:10dp; background:#333;"
                    for(let part of attrValue.split(';')){
                        let [name, value] = part.split(':');
                        name = name.trim();
                        if(name) {
                            _stateAttr.setAttr('android:' + name.toLowerCase(), value.trim());
                        }
                    }
                }
            }
        }

        private getStateAttr(state:number[]):StateAttr{
            for(let stateAttr of this.originStateAttrList){
                if(stateAttr.isStateEquals(state)) return stateAttr;
            }
        }

        private getOrCreateStateAttr(state:number[]):StateAttr{
            let stateAttr = this.getStateAttr(state);
            if(!stateAttr) {
                stateAttr = new StateAttr(state);
                this.originStateAttrList.push(stateAttr);
            }
            return stateAttr;
        }

        getMatchedStateAttr(state:number[]):StateAttr {
            if(state == null) return null;
            for(let stateAttr of this.matchedStateAttrList){
                if(stateAttr.isStateEquals(state)) return stateAttr;
            }
            let matchedAttr:StateAttr = new StateAttr(state);
            for(let stateAttr of this.originStateAttrList){
                if(stateAttr.isDefaultState()) continue; // ignore default state
                if(stateAttr.isStateMatch(state)){
                    matchedAttr.putAll(stateAttr);
                }
            }
            this.matchedStateAttrList.push(matchedAttr);
            return matchedAttr;
        }

        /**
         * call when the attr is not stateable (when user set a new value to the attr by code)
         * @param attrName this attr's name
         */
        removeAttrAllState(attrName:string){
            for(let stateAttr of this.originStateAttrList){
                stateAttr.getAttrMap().delete(attrName);
            }
            for(let stateAttr of this.matchedStateAttrList){
                stateAttr.getAttrMap().delete(attrName);
            }
        }
    }
}
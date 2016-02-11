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
            this._initStyleAttributes(view.bindElement, []);
        }

        private _initStyleAttributes(ele:Element, inParseState:number[]){

            let attributes = Array.from(ele.attributes);
            //parse ref style first
            attributes.forEach((attr:Attr)=>{
                if(attr.name==='style' || attr.name==='android:style'){
                    this._initStyleAttr(attr, ele, inParseState);
                }
            });
            //parse inline style (override the ref style)
            attributes.forEach((attr:Attr)=>{
                if(attr.name==='style' || attr.name==='android:style'){
                    return;
                }
                if(attr.name.startsWith('android:state_') || attr.name.startsWith('state_')){
                    return;
                }
                this._initStyleAttr(attr, ele, inParseState);
            });
            //parse ref stated style
            attributes.forEach((attr:Attr)=>{
                if(attr.name.startsWith('android:state_') || attr.name.startsWith('state_')){
                    this._initStyleAttr(attr, ele, inParseState);
                }
            });

        }

        private _initStyleAttr(attr:Attr, ele:Element, inParseState:number[]){
            let attrName = attr.name;
            if(!attrName.startsWith('android:')) return;
            attrName = attrName.substring('android:'.length);
            if(attrName==='id') return;

            let attrValue = attr.value;


            if(attrName.startsWith('state_')){
                //merge new state
                let newStateSet = StateAttr.parseStateAttrName(attrName);
                for(let state of inParseState){
                    newStateSet.add(state);
                }
                inParseState = Array.from(newStateSet).sort();
            }


            let _stateAttr = this.optStateAttr(inParseState);

            //parse style or stated style
            if(attrName.startsWith('state_') || attrName==='style'){
                //attr with state
                if(attrValue.startsWith('@')){
                    //support: android:state_pressed="@style/myStyle"
                    let reference = this.mView.getResources().getReference(attrValue, false);
                    if(reference) this._initStyleAttributes(reference, inParseState);

                }else{
                    //support: android:state_pressed="padding:10dp; background:#333;"
                    for(let part of attrValue.split(';')){
                        let [name, value] = part.split(':');
                        value = value ? this.mView.getResources().getString(value) : '';
                        if(name) _stateAttr.setAttr(name.trim().toLowerCase(), value);
                    }
                }
            }else{
                attrValue = this.mView.getResources().getString(attrValue);
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
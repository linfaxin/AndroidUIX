/**
 * Created by linfaxin on 15/11/3.
 */
///<reference path="StateAttr.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/util/StateSet.ts"/>

module androidui.attr{

    export class StateAttrList{
        private list = new Array<StateAttr>(0);
        private list_reverse:StateAttr[];
        private match_list = new Array<StateAttr>(0);

        constructor(ele:Element, rootElement:HTMLElement){
            this.list.push(new StateAttr([]));//init state
            this._initStyleAttributes(ele, [], rootElement);
        }

        private _initStyleAttributes(ele:Element, inParseState:number[], rootElement:HTMLElement){
            let attributes = Array.from(ele.attributes);
            //parse ref style first
            attributes.forEach((attr:Attr)=>{
                if(attr.name==='style' || attr.name==='android:style'){
                    this._initStyleAttr(attr, ele, inParseState, rootElement);
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
                this._initStyleAttr(attr, ele, inParseState, rootElement);
            });
            //parse ref stated style
            attributes.forEach((attr:Attr)=>{
                if(attr.name.startsWith('android:state_') || attr.name.startsWith('state_')){
                    this._initStyleAttr(attr, ele, inParseState, rootElement);
                }
            });

            this.list_reverse = this.list.concat().reverse();
        }

        private _initStyleAttr(attr:Attr, ele:Element, inParseState:number[], rootElement:HTMLElement){
            let attrName = attr.name;
            if(!attrName.startsWith('android:')) return;
            attrName = attrName.substring('android:'.length);
            if(attrName==='id') return;

            let attrValue = attr.value;


            //check inParseState mar change
            if(attrName.startsWith('state_')){
                //attr with state
                let newStateSet = StateAttr.parseStateAttrName(attrName);
                inParseState = inParseState.concat(Array.from(newStateSet));
                inParseState = Array.from(new Set(inParseState)).sort();
            }


            let _stateAttr = this.optStateAttr(inParseState);

            //parse style or stated style
            if(attrName.startsWith('state_') || attrName==='style'){
                //attr with state
                if(attrValue.startsWith('@')){
                    let reference = android.view.View.findReference(attrValue, ele, rootElement, false);
                    this._initStyleAttributes(reference, inParseState, rootElement);

                }else{
                    for(let part of attrValue.split(';')){
                        let [name, value] = part.split(':');
                        value = value ? android.view.View.optReferenceString(value.trim(), ele, rootElement) : '';
                        if(name) _stateAttr.setAttr(name.trim().toLowerCase(), value);
                    }
                }
            }else{
                attrValue = android.view.View.optReferenceString(attrValue, ele, rootElement);
                _stateAttr.setAttr(attrName, attrValue);
            }
        }

        private static EmptyArray = [];
        getDefaultStateAttr():StateAttr{
            return this.getStateAttr(StateAttrList.EmptyArray);
        }

        getStateAttr(state:number[]):StateAttr{
            for(let stateAttr of this.list){
                if(stateAttr.isStateEquals(state)) return stateAttr;
            }
        }

        private optStateAttr(state:number[]):StateAttr{
            let stateAttr = this.getStateAttr(state);
            if(!stateAttr){
                stateAttr = new StateAttr(state);
                this.list.splice(0, 0, stateAttr);
            }
            return stateAttr;
        }

        getMatchedAttr(state:number[]):StateAttr {
            for(let stateAttr of this.match_list){
                if(stateAttr.isStateEquals(state)) return stateAttr;
            }
            let matchedAttr = new StateAttr(state);
            for(let stateAttr of this.list_reverse){
                if(stateAttr.isStateMatch(state)) matchedAttr.putAll(stateAttr);
            }
            this.match_list.push(matchedAttr);
            return matchedAttr;
        }
    }
}
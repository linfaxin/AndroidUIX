/**
 * Created by linfaxin on 15/11/16.
 */

///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/widget/NumberPicker.ts"/>

module androidui.widget{

    import ViewGroup = android.view.ViewGroup;
    import View = android.view.View;
    import NumberPicker = android.widget.NumberPicker;


    export class HtmlDataPickerAdapter implements HtmlDataAdapter{
        bindElementData:HTMLElement;
        rootElement:HTMLElement;

        onInflateAdapter(bindElement:HTMLElement, rootElement:HTMLElement, parent:android.view.ViewGroup):void {
            this.bindElementData = bindElement;
            this.rootElement = rootElement;
            if(parent instanceof NumberPicker){
                const callBack = (arr: MutationRecord[], observer: MutationObserver)=>{
                    const values = [];
                    for(let child of Array.from(this.bindElementData.children)){
                         values.push((<HTMLElement>child).innerText);
                    }
                    parent.setDisplayedValues(values);
                };
                callBack.call(this);

                let observer:MutationObserver = new MutationObserver(callBack);
                observer.observe(this.bindElementData, {childList:true});
            }
        }


    }
}
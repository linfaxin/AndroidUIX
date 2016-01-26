/**
 * Created by linfaxin on 15/11/16.
 */

///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/widget/NumberPicker.ts"/>
///<reference path="../../android/content/Context.ts"/>

module androidui.widget{

    import ViewGroup = android.view.ViewGroup;
    import View = android.view.View;
    import NumberPicker = android.widget.NumberPicker;
    import Context = android.content.Context;


    export class HtmlDataPickerAdapter implements HtmlDataAdapter{
        bindElementData:HTMLElement;

        onInflateAdapter(bindElement:HTMLElement, context?:Context, parent?:android.view.ViewGroup):void {
            this.bindElementData = bindElement;
            if(parent instanceof NumberPicker){
                if(!MutationObserver) return;
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
/**
 * Created by linfaxin on 16/1/4.
 */

///<reference path="AndroidUI.ts"/>

module androidui{

    if (typeof HTMLDivElement !== 'function'){
        var _HTMLDivElement = function(){};
        _HTMLDivElement.prototype = HTMLDivElement.prototype;
        HTMLDivElement = <any>_HTMLDivElement;
    }

    /**
     * Root Element of a android ui.
     */
    export class AndroidUIElement extends HTMLDivElement{
        AndroidUI:AndroidUI;

        private performCreate(){
            this.AndroidUI = new AndroidUI(this);

            let debugAttr = this.getAttribute('debug');
            if(debugAttr!=null && debugAttr!='0' && debugAttr!='false') this.AndroidUI.showDebugLayout();
        }

        createdCallback():void{
            $domReady( ()=>this.performCreate() );
        }

        attachedCallback():void {
        }

        detachedCallback():void {
        }

        attributeChangedCallback(attributeName:string, oldVal:string, newVal:string):void {
            if(attributeName==='debug' && newVal!=null && newVal!='false' && newVal!='0'){
                this.AndroidUI.showDebugLayout();
            }
        }
    }

    if(typeof document['registerElement'] === "function"){
        (<any>document).registerElement("android-ui", AndroidUIElement);
    }else{
        $domReady(()=>{
            let eles = document.getElementsByTagName('android-ui');
            for(let ele of Array.from(eles)){
                (<AndroidUIElement>ele).AndroidUI = new AndroidUI(<AndroidUIElement>ele);
            }
        });
    }
    function $domReady(func:()=>void){
        if(/^loaded|^complete|^interactive/.test(document.readyState)){//already loaded
            //delay call onCreate, insure browser load lib complete
            setTimeout(func, 0);
        }else{
            document.addEventListener('DOMContentLoaded', func);
        }
    }
}
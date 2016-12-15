/**
 * Created by linfaxin on 16/1/4.
 */

///<reference path="AndroidUI.ts"/>

module androidui{

    if (typeof HTMLDivElement !== 'function'){
        const _HTMLDivElement = function(){};
        _HTMLDivElement.prototype = (<any>HTMLDivElement).prototype;
        HTMLDivElement = <any>_HTMLDivElement;
    }

    /**
     * Root Element of a android ui.
     */
    export class AndroidUIElement extends HTMLDivElement {
        AndroidUI:AndroidUI;

        createdCallback():void{
            $domReady(()=>initElement(this));
        }

        attachedCallback():void {
        }

        detachedCallback():void {
        }

        attributeChangedCallback(attributeName:string, oldVal:string, newVal:string):void {
            if(attributeName==='debug' && newVal!=null && newVal!='false' && newVal!='0'){
                this.AndroidUI.setDebugEnable();
            }
        }
    }

    function runFunction(func:string){
        if(typeof window[func] === "function"){
            window[func]();
        }else{
            try {
                eval(func);
            } catch (e) {
                console.warn(e);
            }
        }
    }

    function $domReady(func:()=>void){
        if(/^loaded|^complete|^interactive/.test(document.readyState)){//already loaded
            //delay call onCreate, insure browser load lib complete
            setTimeout(func, 0);
        }else{
            document.addEventListener('DOMContentLoaded', func);
        }
    }

    function initElement(ele:AndroidUIElement){
        ele.AndroidUI = new AndroidUI(ele);
        let debugAttr = ele.getAttribute('debug');
        if(debugAttr!=null && debugAttr!='0' && debugAttr!='false') ele.AndroidUI.setDebugEnable();

        //life callback
        let onClose = ele.getAttribute('onclose');
        if(onClose){
            ele.AndroidUI.setUIClient({
                shouldShowAppClosed(androidUI:AndroidUI):void {
                    if(!onClose) return;
                    runFunction(onClose);
                }
            });
        }
        let onLoad = ele.getAttribute('onload');
        if(onLoad){
            runFunction(onLoad);
        }
    }

    if(typeof document['registerElement'] === "function"){
        (<any>document).registerElement("android-ui", AndroidUIElement);
    }else{
        $domReady(()=>{
            let eles = document.getElementsByTagName('android-ui');
            for(let ele of Array.from(eles)){
                initElement(<AndroidUIElement>ele);
            }
        });
    }



    //init common style
    let styleElement = document.createElement('style');
    styleElement.innerHTML += `
        android-ui {
            position : relative;
            overflow : hidden;
            display : block;
            outline: none;
        }
        android-ui * {
            overflow : hidden;
            border : none;
            outline: none;
            pointer-events: auto;
        }
        android-ui resources {
            display: none;
        }
        android-ui Button {
            border: none;
            background: none;
        }
        android-ui windowsgroup {
            pointer-events: none;
        }
        android-ui > canvas {
            position: absolute;
            left: 0;
            top: 0;
        }
        `;
    document.head.appendChild(styleElement);
}
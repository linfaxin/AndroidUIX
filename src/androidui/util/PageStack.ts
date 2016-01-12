/**
 * Created by linfaxin on 15/12/30.
 *
 */

module PageStack{
    const DEBUG = false;
    const history_go = history.go;
    export var currentStack:StateStack;

    export var backListener:()=>boolean;
    export var pageOpenHandler:(pageId:string, pageExtra?:any)=>boolean;
    export var pageCloseHandler:(pageId:string, pageExtra?:any)=>boolean;

    let historyLocking = false;//wait history go complete
    let pendingFuncLock = [];

    export function init(){
        removeLastHistoryIfFaked();
        ensureLockDo(_init);

        //override history go/back/forward
        history.go = function(delta:number){
            PageStack.go(delta);
        };
        history.back = function(){
            PageStack.go(-1);
        };
        history.forward = function(){
            PageStack.go(1);
        };
    }

    function _init(){
        currentStack = history.state;
        if(currentStack && !currentStack.isRoot){
            console.log('already has history.state when _init PageState, restore page');
            restorePageFromStackIfNeed();

        }else{
            currentStack = currentStack || {
                    pageId: '',
                    isRoot: true,
                    stack: [{pageId: null}]
                };

            //set root state when _init PageStack
            //location.hash = location.hash + '#';//force clear history forward
            history.replaceState(currentStack, null, '#');
        }
        ensureLastHistoryFaked();

        //_init onpopstate, deal when user press back / modify location hash
        window.onpopstate = (ev:PopStateEvent)=>{
            let stack = <StateStack>ev.state;

            if(historyLocking){
                //historyGo method will callback to here, do nothing only remember stack
                currentStack = stack;
                return;
            }

            if(DEBUG) console.log('onpopstate', stack);

            if(!stack){
                //no state, user modified the hash.

                let pageId = location.hash;
                if(pageId[0]==='#') pageId = pageId.substring(1);

                //back the changed hash page & fake page
                historyGo(-2, false);
                if(firePageOpen(pageId, null)){
                    notifyNewPageOpened(pageId);

                }else{
                    ensureLastHistoryFaked();
                }

            }else if(currentStack.stack.length!=stack.stack.length){
                //will happen when back multi page (long click back button on pc chrome)
                let delta = stack.stack.length - currentStack.stack.length;
                if(delta>=0){
                    console.warn('something error! stack: ', stack, 'last stack: ', currentStack);
                    return;
                }

                var stackList = currentStack.stack;
                currentStack = stack;
                //history already change, try close the pages
                tryClosePageAfterHistoryChanged(stackList, delta);

            }else{
                currentStack = stack;

                //user press back button.
                if(fireBackPressed()){
                    //user handle the back press.
                    ensureLastHistoryFaked();

                }else{
                    var stackList = currentStack.stack;
                    if(firePageClose(stackList[stackList.length-1].pageId, stackList[stackList.length-1].extra)){
                        //should go back real.
                        historyGo(-1);

                    }else{
                        ensureLastHistoryFaked();
                    }
                }
            }

        };
    }

    export function go(delta:number){
        if(historyLocking){
            console.error('cant change history when waiting history change finish');
            return;
        }
        var stackList = currentStack.stack;
        if(delta===-1){
            if(!firePageClose(stackList[stackList.length-1].pageId, stackList[stackList.length-1].extra)){
                //page not close, can't go back
                return;
            }
        }

        removeLastHistoryIfFaked();

        historyGo(delta);

        if(delta<-1) {
            ensureLockDo(()=> {
                //after history already change, fire close page
                tryClosePageAfterHistoryChanged(stackList, delta);
            });
        }
    }

    function tryClosePageAfterHistoryChanged(stateListBeforeHistoryChange:StateSaved[], delta:number){
        let historyLength = stateListBeforeHistoryChange.length;
        for(let i=historyLength+delta; i<historyLength; i++){
            let state = stateListBeforeHistoryChange[i];
            if(!firePageClose(state.pageId, state.extra)){
                //restore the page history if not close
                notifyNewPageOpened(state.pageId, state.extra);
            }
        }
    }

    export function back(){
        go(-1);
    }

    export function openPage(pageId:string, extra?:any){
        pageId+='';
        if(firePageOpen(pageId, extra)){
            notifyNewPageOpened(pageId);
        }
    }


    let releaseLockingTimeout;
    let requestHistoryGoWhenLocking = 0;
    function historyGo(delta:number, ensureFaked=true){
        if(delta>=0) return;//not support forward
        if(history.length === 1) return;//no history

        if(historyLocking){
            requestHistoryGoWhenLocking += delta;
            return;
        }

        if(DEBUG) console.log('historyGo', delta);

        historyLocking = true;
        const state = history.state;
        if(releaseLockingTimeout) clearTimeout(releaseLockingTimeout);
        function checkRelease(){
            clearTimeout(releaseLockingTimeout);
            if(history.state === state){
                releaseLockingTimeout = setTimeout(checkRelease, 0);
            }else{
                let continueGo = requestHistoryGoWhenLocking;
                if(continueGo!=0){
                    requestHistoryGoWhenLocking = 0;
                    historyLocking = false;
                    historyGo(continueGo);

                }else {
                    releaseLockingTimeout = setTimeout(()=> {
                        historyLocking = false;
                    }, 10);
                }
            }
        }
        releaseLockingTimeout = setTimeout(checkRelease, 0);

        history_go.call(history, delta);

        if(ensureFaked) ensureLastHistoryFaked();

    }

    //if page reload, but the page content will clear, should re-open pages
    function restorePageFromStackIfNeed(){
        if(currentStack){
            let copy = currentStack.stack.concat();
            copy.shift();//ignore root stack
            for(let saveState of copy){
                firePageOpen(saveState.pageId, saveState.extra);
            }
        }
    }

    function fireBackPressed():boolean {
        if(backListener){
            try {
                return backListener();
            } catch (e) {
                console.error(e);
            }
        }
    }
    function firePageOpen(pageId:string, pageExtra?:any):boolean {
        if(pageOpenHandler){
            try {
                return pageOpenHandler(pageId, pageExtra);
            } catch (e) {
                console.error(e);
            }
        }
    }
    function firePageClose(pageId:string, pageExtra?:any):boolean {
        if(pageCloseHandler){
            try {
                return pageCloseHandler(pageId, pageExtra);
            } catch (e) {
                console.error(e);
            }
        }
    }

    /**
     * call when app logic already close page. sync browser history here.
     */
    export function notifyPageClosed(pageId:string, pageExtra?:any):boolean{
        if(DEBUG) console.log('notifyPageClosed', pageId);
        if(historyLocking){
            console.error('cant notifyPageClosed when waiting history change finish');
            return;
        }
        let stackList = currentStack.stack;
        let historyLength = stackList.length;
        for(let i=historyLength-1; i>=0; i--){
            let state = stackList[i];
            if(state.pageId === pageId){//xxx should check pageExtra? may same pageId exist
                if(i === historyLength-1){//last page closed, back the history now
                    removeLastHistoryIfFaked();
                    historyGo(-1);
                }else{
                    let delta = i - historyLength;
                    (function(delta){
                        removeLastHistoryIfFaked();
                        //back history to the aim page first
                        historyGo(delta);
                        //then re-add other pages to history
                        ensureLockDo(()=> {
                            let historyLength = stackList.length;
                            let pageStartAddIndex = historyLength + delta + 1;
                            for(let j = pageStartAddIndex; j<historyLength; j++){
                                notifyNewPageOpened(stackList[j].pageId, stackList[j].extra);
                            }
                        });
                    })(delta);
                }
            }
        }
        return true;
    }

    /**
     * call when app logic already open page. sync browser history here.
     */
    export function notifyNewPageOpened(pageId:string, extra?:any){
        if(DEBUG) console.log('notifyNewPageOpened', pageId);
        let state:StateSaved = {
            pageId : pageId,
            extra : extra
        };

        ensureLockDo(function(){
            currentStack.stack.push(state);
            currentStack.pageId = pageId;
            currentStack.isRoot = false;

            if(history.state.isFake){
                //replace the fake page
                history.replaceState(currentStack, null, '#'+pageId);
            }else{
                history.pushState(currentStack, null, '#'+pageId);
            }
            ensureLastHistoryFakedImpl();
        });
    }


    let execLockedTimeoutId:number;
    function ensureLockDo(func:()=>any, runNowIfNotLock=false){
        if(!historyLocking && runNowIfNotLock){
            func();
            return;
        }

        pendingFuncLock.push(func);

        if(execLockedTimeoutId) clearTimeout(execLockedTimeoutId);

        function execLockedFunctions(){
            if(historyLocking){
                clearTimeout(execLockedTimeoutId);
                execLockedTimeoutId = setTimeout(execLockedFunctions, 0);

            }else{
                let copy = pendingFuncLock.concat();
                pendingFuncLock = [];
                for(let f of copy){
                    f();
                }
            }
        }
        execLockedTimeoutId = setTimeout(execLockedFunctions, 0);
    }


    function removeLastHistoryIfFaked(){
        if(history.state && history.state.isFake){
            history.replaceState({}, null, '');//make history.state.isFake = false
            historyGo(-1, false);
        }
    }

    function ensureLastHistoryFaked(){
        ensureLockDo(ensureLastHistoryFakedImpl);
    }
    function ensureLastHistoryFakedImpl(){
        if(!history.state.isFake){
            history.pushState({isFake:true}, null, '');
        }
    }

    export interface StateStack {
        pageId:string;
        isRoot?:boolean;
        stack:StateSaved[];
    }

    export interface StateSaved {
        pageId:string;
        extra?:any;
    }

}
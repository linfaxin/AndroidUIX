/**
 * Created by linfaxin on 15/10/5.
 */
///<reference path="Message.ts"/>
///<reference path="Handler.ts"/>
///<reference path="../util/Log.ts"/>
///<reference path="../../java/lang/Runnable.ts"/>

module android.os {
    import Runnable = java.lang.Runnable;
    import Log = android.util.Log;


    var requestAnimationFrame = window["requestAnimationFrame"] ||
        window["webkitRequestAnimationFrame"] ||
        window["mozRequestAnimationFrame"] ||
        window["oRequestAnimationFrame"] ||
        window["msRequestAnimationFrame"];
    if (!requestAnimationFrame) {
        requestAnimationFrame = function (callback) {
            return window.setTimeout(callback, 1000 / 60);
        };
    }

    export class MessageQueue {

        static messages = new Set<Message>();

        static getMessages(h:Handler, r:Runnable, object:any):Array<Message>;
        static getMessages(h:Handler, what:number, object:any):Array<Message>;
        static getMessages(h:Handler, args, object:any):Array<Message> {
            let msgs = [];
            if (h == null) {
                return msgs;
            }

            if (typeof args === "number") {
                let what:number = args;
                for (let p of MessageQueue.messages) {
                    if (p.target == h && p.what == what && (object == null || p.obj == object)) {
                        msgs.push(p);
                    }
                }

            } else {
                let r = args;
                for (let p of MessageQueue.messages) {
                    if (p.target == h && p.callback == r && (object == null || p.obj == object)) {
                        msgs.push(p);
                    }
                }

            }
            return msgs;
        }

        static hasMessages(h:Handler, r:Runnable, object:any):boolean;
        static hasMessages(h:Handler, what:number, object:any):boolean;
        static hasMessages(h:Handler, args, object:any):boolean {
            return MessageQueue.getMessages(h, args, object).length > 0;
        }

        static enqueueMessage(msg:Message, when:number):boolean{
            if (msg.target == null) {
                throw new Error("Message must have a target.");
            }
            msg.when = when;
            MessageQueue.messages.add(msg);
            MessageQueue.checkLoop();
            return true;
        }

        static recycleMessage(handler:Handler, message:Message) {
            message.recycle();
            MessageQueue.messages.delete(message);
        }

        static removeMessages(h:Handler, what:number, object:any);
        static removeMessages(h:Handler, r:Runnable, object:any);
        static removeMessages(h:Handler, args, object:any) {
            let p = MessageQueue.getMessages(h, args, object);
            if (p && p.length > 0) {
                for(let item of p){
                    MessageQueue.recycleMessage(h, item);
                }
            }
        }

        static removeCallbacksAndMessages(h:Handler, object:any) {
            if (h == null) {
                return;
            }
            for (let p of MessageQueue.messages) {
                if (p != null && p.target == h && (object == null || p.obj == object)) {
                    MessageQueue.recycleMessage(h, p);
                }
            }
        }

        private static _loopActive = false;
        private static checkLoop(){
            if(!MessageQueue._loopActive){
                MessageQueue._loopActive = true;

                requestAnimationFrame(MessageQueue.loop);
            }
        }

        private static loop(){
            let normalMessages:Message[] = [];
            let traversalMessages:Message[] = [];
            const now = SystemClock.uptimeMillis();
            for(let msg of MessageQueue.messages){
                if(msg.when<=now){
                    if(msg.mType === Message.Type_Traversal) traversalMessages.push(msg);
                    else normalMessages.push(msg);
                }
            }
            //dispatch normal messages first.
            for(let i = 0, length=normalMessages.length; i<length; i++){
                MessageQueue.dispatchMessage(normalMessages[i]);
            }
            //then dispatch traversal messages
            for(let i = 0, length=traversalMessages.length; i<length; i++){
                MessageQueue.dispatchMessage(traversalMessages[i]);
            }

            if(MessageQueue.messages.size>0) requestAnimationFrame(MessageQueue.loop);
            else MessageQueue._loopActive = false;
        }

        private static dispatchMessage(msg:Message){
            if(MessageQueue.messages.has(msg)){
                MessageQueue.messages.delete(msg);
                msg.target.dispatchMessage(msg);
                MessageQueue.recycleMessage(msg.target, msg);
            }
        }
    }
}
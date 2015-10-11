/**
 * Created by linfaxin on 15/10/5.
 */
///<reference path="Message.ts"/>
///<reference path="Handler.ts"/>
///<reference path="../../java/lang/Runnable.ts"/>

module android.os {
    import Runnable = java.lang.Runnable;
    export class MessageQueue {
        messages = new Map<Message, number>();

        getMessages(h:Handler, r:Runnable, object:any):Array<Message>;
        getMessages(h:Handler, what:number, object:any):Array<Message>;
        getMessages(h:Handler, args, object:any):Array<Message> {
            let msgs = [];
            if (h == null) {
                return msgs;
            }

            if (typeof args === "number") {
                let what:number = args;
                for (let p of this.messages.keys()) {
                    if (p.target == h && p.what == what && (object == null || p.obj == object)) {
                        msgs.push(p);
                    }
                }

            } else {
                let r = args;
                for (let p of this.messages.keys()) {
                    if (p.target == h && p.callback == r && (object == null || p.obj == object)) {
                        msgs.push(p);
                    }
                }

            }
            return msgs;
        }

        hasMessages(h:Handler, r:Runnable, object:any):boolean;
        hasMessages(h:Handler, what:number, object:any):boolean;
        hasMessages(h:Handler, args, object:any):boolean {
            return this.getMessages(h, args, object).length > 0;
        }

        addMessage(handler:Handler, msg:Message, delayHandleID:number){
            this.messages.set(msg, delayHandleID);
        }

        recycleMessage(handler:Handler, message:Message) {
            try {
                message.recycle();
            } catch (e) {
            }

            let oldId = this.messages.get(message);
            if (oldId !== undefined) {
                clearTimeout(oldId);
                this.messages.delete(message);
            }
        }

        removeMessages(h:Handler, what:number, object:any);
        removeMessages(h:Handler, r:Runnable, object:any);
        removeMessages(h:Handler, args, object:any) {
            let p = this.getMessages(h, args, object);
            if (p && p.length > 0) {
                p.forEach((item) => this.recycleMessage(h, item));
            }
        }

        removeCallbacksAndMessages(h:Handler, object:any) {
            if (h == null) {
                return;
            }
            for (let p of this.messages.keys()) {
                if (p != null && p.target == h && (object == null || p.obj == object)) {
                    this.recycleMessage(h, p);
                }
            }
        }
    }
}
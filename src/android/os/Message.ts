/**
 * Created by linfaxin on 15/10/5.
 */
///<reference path="Handler.ts"/>
///<reference path="../../java/lang/Runnable.ts"/>
///<reference path="../../java/lang/StringBuilder.ts"/>
///<reference path="../util/Pools.ts"/>
///<reference path="SystemClock.ts"/>

module android.os {
    import StringBuilder = java.lang.StringBuilder;
    import Runnable = java.lang.Runnable;
    import Pools = android.util.Pools;

    export class Message {
        private static Type_Normal = 0;
        private static Type_Traversal = 1;
        private mType:number = Message.Type_Normal;

        what:number = 0;
        arg1:number = 0;
        arg2:number = 0;
        obj:any;
        when:number = 0;
        target:Handler;
        callback:Runnable;

        private static sPool = new Pools.SynchronizedPool<Message>(10);

        recycle() {
            this.clearForRecycle();
            Message.sPool.release(this);
        }

        copyFrom(o:Message) {
            this.mType = o.mType;
            this.what = o.what;
            this.arg1 = o.arg1;
            this.arg2 = o.arg2;
            this.obj = o.obj;
        }

        sendToTarget() {
            this.target.sendMessage(this);
        }

        clearForRecycle() {
            this.mType = Message.Type_Normal;
            this.what = 0;
            this.arg1 = 0;
            this.arg2 = 0;
            this.obj = null;
            this.when = 0;
            this.target = null;
            this.callback = null;
        }

        toString(now = SystemClock.uptimeMillis()):string {
            let b = new StringBuilder();
            b.append("{ what=");
            b.append(this.what);
            b.append(" when=");
            b.append(this.when - now).append("ms");
            //TimeUtils.formatDuration(this.when - now, b);
            if (this.arg1 != 0) {
                b.append(" arg1=");
                b.append(this.arg1);
            }
            if (this.arg2 != 0) {
                b.append(" arg2=");
                b.append(this.arg2);
            }
            if (this.obj != null) {
                b.append(" obj=");
                b.append(this.obj);
            }
            b.append(" }");
            return b.toString()
        }


        static obtain():Message;
        static obtain(orig:Message):Message;
        static obtain(h:Handler, callback:Runnable):Message;
        static obtain(h:Handler, what:number, obj:any):Message;
        static obtain(h:Handler):Message;
        static obtain(h:Handler, what:number):Message;
        static obtain(h:Handler, what:number, arg1:number, arg2:number):Message;
        static obtain(h:Handler, what:number, arg1:number, arg2:number, obj:any):Message;
        static obtain(...args){
            let m = Message.sPool.acquire();
            m = m || new Message();
            if(args.length === 1 && args[0] instanceof Message){
                let orig = args[0];
                [m.target, m.what, m.arg1, m.arg2, m.obj, m.callback] =
                    [orig.target, orig.what, orig.arg1, orig.arg2, orig.obj, orig.callback];

            } else if(args.length===2){
                [m.what=0, m.callback] = args;

            } else if(args.length===3){
                [m.what=0, m.arg1=0, m.obj] = args;

            } else {
                [m.target, m.what=0, m.arg1=0, m.arg2=0, m.obj, m.callback] = args;
            }

            return m;
        }
    }
}
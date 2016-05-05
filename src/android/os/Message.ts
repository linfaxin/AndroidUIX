/*
 * Copyright (C) 2006 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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

    /**
     *
     * Defines a message containing a description and arbitrary data object that can be
     * sent to a {@link Handler}.  This object contains two extra int fields and an
     * extra object field that allow you to not do allocations in many cases.
     *
     * <p class="note">While the constructor of Message is public, the best way to get
     * one of these is to call {@link #obtain Message.obtain()} or one of the
     * {@link Handler#obtainMessage Handler.obtainMessage()} methods, which will pull
     * them from a pool of recycled objects.</p>
     */
    export class Message {
        protected static Type_Normal = 0;
        protected static Type_Traversal = 1;
        private mType:number = Message.Type_Normal;

        /**
         * User-defined message code so that the recipient can identify
         * what this message is about. Each {@link Handler} has its own name-space
         * for message codes, so you do not need to worry about yours conflicting
         * with other handlers.
         */
        what:number = 0;
        /**
         * arg1 and arg2 are lower-cost alternatives to using
         * {@link #setData(Bundle) setData()} if you only need to store a
         * few integer values.
         */
        arg1:number = 0;
        /**
         * arg1 and arg2 are lower-cost alternatives to using
         * {@link #setData(Bundle) setData()} if you only need to store a
         * few integer values.
         */
        arg2:number = 0;
        /**
         * An arbitrary object to send to the recipient.  When using
         * {@link Messenger} to send the message across processes this can only
         * be non-null if it contains a Parcelable of a framework class (not one
         * implemented by the application).   For other data transfer use
         * {@link #setData}.
         *
         * <p>Note that Parcelable objects here are not supported prior to
         * the {@link android.os.Build.VERSION_CODES#FROYO} release.
         */
        obj:any;
        protected when:number = 0;
        protected target:Handler;
        protected callback:Runnable;

        private static sPool = new Pools.SynchronizedPool<Message>(10);


        /**
         * Return a new Message instance from the global pool. Allows us to
         * avoid allocating new objects in many cases.
         */
        static obtain():Message;
        static obtain(orig:Message):Message;
        /**
         * Same as {@link #obtain()}, but sets the value for the <em>target</em> member on the Message returned.
         * @param h  Handler to assign to the returned Message object's <em>target</em> member.
         * @return A Message object from the global pool.
         */
        static obtain(h:Handler):Message;
        /**
         * Same as {@link #obtain(Handler)}, but assigns a callback Runnable on
         * the Message that is returned.
         * @param h  Handler to assign to the returned Message object's <em>target</em> member.
         * @param callback Runnable that will execute when the message is handled.
         * @return A Message object from the global pool.
         */
        static obtain(h:Handler, callback:Runnable):Message;
        /**
         * Same as {@link #obtain()}, but sets the values for both <em>target</em> and
         * <em>what</em> members on the Message.
         * @param h  Value to assign to the <em>target</em> member.
         * @param what  Value to assign to the <em>what</em> member.
         * @return A Message object from the global pool.
         */
        static obtain(h:Handler, what:number):Message;
        /**
         * Same as {@link #obtain()}, but sets the values of the <em>target</em>, <em>what</em>, and <em>obj</em>
         * members.
         * @param h  The <em>target</em> value to set.
         * @param what  The <em>what</em> value to set.
         * @param obj  The <em>object</em> method to set.
         * @return  A Message object from the global pool.
         */
        static obtain(h:Handler, what:number, obj:any):Message;
        /**
         * Same as {@link #obtain()}, but sets the values of the <em>target</em>, <em>what</em>,
         * <em>arg1</em>, and <em>arg2</em> members.
         *
         * @param h  The <em>target</em> value to set.
         * @param what  The <em>what</em> value to set.
         * @param arg1  The <em>arg1</em> value to set.
         * @param arg2  The <em>arg2</em> value to set.
         * @return  A Message object from the global pool.
         */
        static obtain(h:Handler, what:number, arg1:number, arg2:number):Message;
        /**
         * Same as {@link #obtain()}, but sets the values of the <em>target</em>, <em>what</em>,
         * <em>arg1</em>, <em>arg2</em>, and <em>obj</em> members.
         *
         * @param h  The <em>target</em> value to set.
         * @param what  The <em>what</em> value to set.
         * @param arg1  The <em>arg1</em> value to set.
         * @param arg2  The <em>arg2</em> value to set.
         * @param obj  The <em>obj</em> value to set.
         * @return  A Message object from the global pool.
         */
        static obtain(h:Handler, what:number, arg1:number, arg2:number, obj:any):Message;
        static obtain(...args){
            let m = Message.sPool.acquire();
            m = m || new Message();
            if(args.length === 1){
                if(args[0] instanceof Message){
                    let orig = args[0];
                    [m.target, m.what, m.arg1, m.arg2, m.obj, m.callback] =
                        [orig.target, orig.what, orig.arg1, orig.arg2, orig.obj, orig.callback];
                }else if(args[0] instanceof Handler){
                    m.target = args[0];
                }else{
                    throw new Error('unknown args');
                }

            } else if(args.length===2){
                m.target = args[0];
                if(typeof args[1] === 'number') m.what = args[1];
                else m.callback = args[1];

            } else if(args.length===3){
                [m.target, m.what, m.obj] = args;

            } else if(args.length===4){
                [m.target, m.what, m.arg1, m.arg2] = args;

            } else {
                [m.target, m.what, m.arg1=0, m.arg2, m.obj, m.callback] = args;
            }

            return m;
        }

        /**
         * Return a Message instance to the global pool.  You MUST NOT touch
         * the Message after calling this function -- it has effectively been
         * freed.
         */
        recycle() {
            this.clearForRecycle();
            Message.sPool.release(this);
        }

        /**
         * Make this message like o.  Performs a shallow copy of the data field.
         * Does not copy the linked list fields, nor the timestamp or
         * target/callback of the original message.
         */
        copyFrom(o:Message) {
            this.mType = o.mType;
            this.what = o.what;
            this.arg1 = o.arg1;
            this.arg2 = o.arg2;
            this.obj = o.obj;
        }

        setTarget(target:Handler):void  {
            this.target = target;
        }

        /**
         * Retrieve the a {@link android.os.Handler Handler} implementation that
         * will receive this message. The object must implement
         * {@link android.os.Handler#handleMessage(android.os.Message)
         * Handler.handleMessage()}. Each Handler has its own name-space for
         * message codes, so you do not need to
         * worry about yours conflicting with other handlers.
         */
        getTarget():Handler  {
            return this.target;
        }

        /**
         * Sends this Message to the Handler specified by {@link #getTarget}.
         * Throws a null pointer exception if this field has not been set.
         */
        sendToTarget() {
            this.target.sendMessage(this);
        }

        protected clearForRecycle() {
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
    }
}
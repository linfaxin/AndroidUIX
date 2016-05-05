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

///<reference path="Message.ts"/>
///<reference path="MessageQueue.ts"/>
///<reference path="../../java/lang/Runnable.ts"/>
///<reference path="SystemClock.ts"/>

module android.os {
    import Runnable = java.lang.Runnable;

    /**
     * A Handler allows you to send and process {@link Message} and Runnable
     * objects associated with a thread's {@link MessageQueue}.  Each Handler
     * instance is associated with a single thread and that thread's message
     * queue.  When you create a new Handler, it is bound to the thread /
     * message queue of the thread that is creating it -- from that point on,
     * it will deliver messages and runnables to that message queue and execute
     * them as they come out of the message queue.
     *
     * <p>There are two main uses for a Handler: (1) to schedule messages and
     * runnables to be executed as some point in the future; and (2) to enqueue
     * an action to be performed on a different thread than your own.
     *
     * <p>Scheduling messages is accomplished with the
     * {@link #post}, {@link #postAtTime(Runnable, long)},
     * {@link #postDelayed}, {@link #sendEmptyMessage},
     * {@link #sendMessage}, {@link #sendMessageAtTime}, and
     * {@link #sendMessageDelayed} methods.  The <em>post</em> versions allow
     * you to enqueue Runnable objects to be called by the message queue when
     * they are received; the <em>sendMessage</em> versions allow you to enqueue
     * a {@link Message} object containing a bundle of data that will be
     * processed by the Handler's {@link #handleMessage} method (requiring that
     * you implement a subclass of Handler).
     *
     * <p>When posting or sending to a Handler, you can either
     * allow the item to be processed as soon as the message queue is ready
     * to do so, or specify a delay before it gets processed or absolute time for
     * it to be processed.  The latter two allow you to implement timeouts,
     * ticks, and other timing-based behavior.
     *
     * <p>When a
     * process is created for your application, its main thread is dedicated to
     * running a message queue that takes care of managing the top-level
     * application objects (activities, broadcast receivers, etc) and any windows
     * they create.  You can create your own threads, and communicate back with
     * the main application thread through a Handler.  This is done by calling
     * the same <em>post</em> or <em>sendMessage</em> methods as before, but from
     * your new thread.  The given Runnable or Message will then be scheduled
     * in the Handler's message queue and processed when appropriate.
     */
    export class Handler {
        mCallback:Handler.Callback;

        /**
         * Constructor associates this handler with the {@link Looper} for the
         * current thread and takes a callback interface in which you can handle
         * messages.
         *
         * If this thread does not have a looper, this handler won't be able to receive messages
         * so an exception is thrown.
         *
         * @param callback The callback interface in which to handle messages, or null.
         */
        constructor(callback?:Handler.Callback) {
            this.mCallback = callback;
        }

        /**
         * Subclasses must implement this to receive messages.
         */
        handleMessage(msg:Message):void {
        }

        /**
         * Handle system messages here.
         */
        dispatchMessage(msg:Message) {
            if (msg.callback != null) {
                msg.callback.run.call(msg.callback);
            } else {
                if (this.mCallback != null) {
                    if (this.mCallback.handleMessage(msg)) {
                        return;
                    }
                }
                this.handleMessage(msg);
            }
        }

        /**
         * Returns a new {@link android.os.Message Message} from the global message pool. More efficient than
         * creating and allocating new instances. The retrieved message has its handler set to this instance (Message.target == this).
         *  If you don't want that facility, just call Message.obtain() instead.
         */
        obtainMessage():Message;
        /**
         * Same as {@link #obtainMessage()}, except that it also sets the what member of the returned Message.
         *
         * @param what Value to assign to the returned Message.what field.
         * @return A Message from the global message pool.
         */
        obtainMessage(what:number):Message;
        /**
         *
         * Same as {@link #obtainMessage()}, except that it also sets the what and obj members
         * of the returned Message.
         *
         * @param what Value to assign to the returned Message.what field.
         * @param obj Value to assign to the returned Message.obj field.
         * @return A Message from the global message pool.
         */
        obtainMessage(what:number, obj:any):Message;
        /**
         *
         * Same as {@link #obtainMessage()}, except that it also sets the what, arg1 and arg2 members of the returned
         * Message.
         * @param what Value to assign to the returned Message.what field.
         * @param arg1 Value to assign to the returned Message.arg1 field.
         * @param arg2 Value to assign to the returned Message.arg2 field.
         * @return A Message from the global message pool.
         */
        obtainMessage(what:number, arg1:number, arg2:number):Message;
        /**
         *
         * Same as {@link #obtainMessage()}, except that it also sets the what, obj, arg1,and arg2 values on the
         * returned Message.
         * @param what Value to assign to the returned Message.what field.
         * @param arg1 Value to assign to the returned Message.arg1 field.
         * @param arg2 Value to assign to the returned Message.arg2 field.
         * @param obj Value to assign to the returned Message.obj field.
         * @return A Message from the global message pool.
         */
        obtainMessage(what:number, arg1:number, arg2:number, obj:any):Message;
        obtainMessage(...args):Message {
            if (args.length === 2) {
                let [what, obj] = args;
                return Message.obtain(this, what, obj);
            } else {
                let [what, arg1, arg2, obj] = args;
                return Message.obtain(this, what, arg1, arg2, obj);
            }
        }

        /**
         * Causes the Runnable r to be added to the message queue.
         * The runnable will be run on the thread to which this handler is
         * attached.
         *
         * @param r The Runnable that will be executed.
         *
         * @return Returns true if the Runnable was successfully placed in to the
         *         message queue.  Returns false on failure, usually because the
         *         looper processing the message queue is exiting.
         */
        post(r:Runnable):boolean {
            return this.sendMessageDelayed(Handler.getPostMessage(r), 0);
        }

        protected postAsTraversal(r:Runnable):boolean {
            let msg = Handler.getPostMessage(r);
            msg.mType = Message.Type_Traversal;
            return this.sendMessageDelayed(msg, 0);
        }

        /**
         * Causes the Runnable r to be added to the message queue, to be run
         * at a specific time given by <var>uptimeMillis</var>.
         * <b>The time-base is {@link android.os.SystemClock#uptimeMillis}.</b>
         * The runnable will be run on the thread to which this handler is attached.
         *
         * @param r The Runnable that will be executed.
         * @param uptimeMillis The absolute time at which the callback should run,
         *         using the {@link android.os.SystemClock#uptimeMillis} time-base.
         *
         * @return Returns true if the Runnable was successfully placed in to the
         *         message queue.  Returns false on failure, usually because the
         *         looper processing the message queue is exiting.  Note that a
         *         result of true does not mean the Runnable will be processed -- if
         *         the looper is quit before the delivery time of the message
         *         occurs then the message will be dropped.
         */
        postAtTime(r:Runnable, uptimeMillis:number):boolean;
        /**
         * Causes the Runnable r to be added to the message queue, to be run
         * at a specific time given by <var>uptimeMillis</var>.
         * <b>The time-base is {@link android.os.SystemClock#uptimeMillis}.</b>
         * The runnable will be run on the thread to which this handler is attached.
         *
         * @param r The Runnable that will be executed.
         * @param uptimeMillis The absolute time at which the callback should run,
         *         using the {@link android.os.SystemClock#uptimeMillis} time-base.
         *
         * @return Returns true if the Runnable was successfully placed in to the
         *         message queue.  Returns false on failure, usually because the
         *         looper processing the message queue is exiting.  Note that a
         *         result of true does not mean the Runnable will be processed -- if
         *         the looper is quit before the delivery time of the message
         *         occurs then the message will be dropped.
         *
         * @see android.os.SystemClock#uptimeMillis
         */
        postAtTime(r:Runnable, token:any, uptimeMillis:number):boolean;
        postAtTime(...args):boolean {
            if (args.length === 2) {
                let [r, uptimeMillis] = args;
                return this.sendMessageAtTime(Handler.getPostMessage(r), uptimeMillis);
            } else {
                let [r, token, uptimeMillis] = args;
                return this.sendMessageAtTime(Handler.getPostMessage(r, token), uptimeMillis);
            }
        }

        /**
         * Causes the Runnable r to be added to the message queue, to be run
         * after the specified amount of time elapses.
         * The runnable will be run on the thread to which this handler
         * is attached.
         *
         * @param r The Runnable that will be executed.
         * @param delayMillis The delay (in milliseconds) until the Runnable
         *        will be executed.
         *
         * @return Returns true if the Runnable was successfully placed in to the
         *         message queue.  Returns false on failure, usually because the
         *         looper processing the message queue is exiting.  Note that a
         *         result of true does not mean the Runnable will be processed --
         *         if the looper is quit before the delivery time of the message
         *         occurs then the message will be dropped.
         */
        postDelayed(r:Runnable, delayMillis:number):boolean {
            return this.sendMessageDelayed(Handler.getPostMessage(r), delayMillis);
        }

        /**
         * Posts a message to an object that implements Runnable.
         * Causes the Runnable r to executed on the next iteration through the
         * message queue. The runnable will be run on the thread to which this
         * handler is attached.
         * <b>This method is only for use in very special circumstances -- it
         * can easily starve the message queue, cause ordering problems, or have
         * other unexpected side-effects.</b>
         *
         * @param r The Runnable that will be executed.
         *
         * @return Returns true if the message was successfully placed in to the
         *         message queue.  Returns false on failure, usually because the
         *         looper processing the message queue is exiting.
         */
        postAtFrontOfQueue(r:Runnable):boolean {
            return this.post(r);
        }

        /**
         * Remove any pending posts of Runnable <var>r</var> with Object
         * <var>token</var> that are in the message queue.  If <var>token</var> is null,
         * all callbacks will be removed.
         */
        removeCallbacks(r:Runnable, token?:any) {
            MessageQueue.removeMessages(this, r, token);
        }

        /**
         * Pushes a message onto the end of the message queue after all pending messages
         * before the current time. It will be received in {@link #handleMessage},
         * in the thread attached to this handler.
         *
         * @return Returns true if the message was successfully placed in to the
         *         message queue.  Returns false on failure, usually because the
         *         looper processing the message queue is exiting.
         */
        sendMessage(msg:Message):boolean {
            return this.sendMessageDelayed(msg, 0);
        }

        /**
         * Sends a Message containing only the what value.
         *
         * @return Returns true if the message was successfully placed in to the
         *         message queue.  Returns false on failure, usually because the
         *         looper processing the message queue is exiting.
         */
        sendEmptyMessage(what:number):boolean {
            return this.sendEmptyMessageDelayed(what, 0);
        }

        /**
         * Sends a Message containing only the what value, to be delivered
         * after the specified amount of time elapses.
         * @see #sendMessageDelayed(android.os.Message, long)
         *
         * @return Returns true if the message was successfully placed in to the
         *         message queue.  Returns false on failure, usually because the
         *         looper processing the message queue is exiting.
         */
        sendEmptyMessageDelayed(what:number, delayMillis:number):boolean {
            let msg = Message.obtain();
            msg.what = what;
            return this.sendMessageDelayed(msg, delayMillis);
        }

        /**
         * Sends a Message containing only the what value, to be delivered
         * at a specific time.
         * @see #sendMessageAtTime(android.os.Message, long)
         *
         * @return Returns true if the message was successfully placed in to the
         *         message queue.  Returns false on failure, usually because the
         *         looper processing the message queue is exiting.
         */
        sendEmptyMessageAtTime(what:number, uptimeMillis:number):boolean {
            let msg = Message.obtain();
            msg.what = what;
            return this.sendMessageAtTime(msg, uptimeMillis);
        }

        /**
         * Enqueue a message into the message queue after all pending messages
         * before (current time + delayMillis). You will receive it in
         * {@link #handleMessage}, in the thread attached to this handler.
         *
         * @return Returns true if the message was successfully placed in to the
         *         message queue.  Returns false on failure, usually because the
         *         looper processing the message queue is exiting.  Note that a
         *         result of true does not mean the message will be processed -- if
         *         the looper is quit before the delivery time of the message
         *         occurs then the message will be dropped.
         */
        sendMessageDelayed(msg:Message, delayMillis:number):boolean {
            if (delayMillis < 0) {
                delayMillis = 0;
            }
            return this.sendMessageAtTime(msg, SystemClock.uptimeMillis() + delayMillis);
        }

        /**
         * Enqueue a message into the message queue after all pending messages
         * before the absolute time (in milliseconds) <var>uptimeMillis</var>.
         * <b>The time-base is {@link android.os.SystemClock#uptimeMillis}.</b>
         * You will receive it in {@link #handleMessage}, in the thread attached
         * to this handler.
         *
         * @param uptimeMillis The absolute time at which the message should be
         *         delivered, using the
         *         {@link android.os.SystemClock#uptimeMillis} time-base.
         *
         * @return Returns true if the message was successfully placed in to the
         *         message queue.  Returns false on failure, usually because the
         *         looper processing the message queue is exiting.  Note that a
         *         result of true does not mean the message will be processed -- if
         *         the looper is quit before the delivery time of the message
         *         occurs then the message will be dropped.
         */
        sendMessageAtTime(msg:Message, uptimeMillis:number) {
            msg.target = this;
            return MessageQueue.enqueueMessage(msg, uptimeMillis);
        }

        /**
         * Enqueue a message at the front of the message queue, to be processed on
         * the next iteration of the message loop.  You will receive it in
         * {@link #handleMessage}, in the thread attached to this handler.
         * <b>This method is only for use in very special circumstances -- it
         * can easily starve the message queue, cause ordering problems, or have
         * other unexpected side-effects.</b>
         *
         * @return Returns true if the message was successfully placed in to the
         *         message queue.  Returns false on failure, usually because the
         *         looper processing the message queue is exiting.
         */
        sendMessageAtFrontOfQueue(msg:Message) {
            return this.sendMessage(msg);
        }

        /**
         * Remove any pending posts of messages with code 'what' and whose obj is
         * 'object' that are in the message queue.  If <var>object</var> is null,
         * all messages will be removed.
         */
        removeMessages(what:number, object?:any) {
            MessageQueue.removeMessages(this, what, object);
        }

        /**
         * Remove any pending posts of callbacks and sent messages whose
         * <var>obj</var> is <var>token</var>.  If <var>token</var> is null,
         * all callbacks and messages will be removed.
         */
        removeCallbacksAndMessages(token?:any) {
            MessageQueue.removeCallbacksAndMessages(this, token);
        }

        /**
         * Check if there are any pending posts of messages with code 'what' in
         * the message queue.
         */
        hasMessages(what:number, object?:any):boolean {
            return MessageQueue.hasMessages(this, what, object);
        }

        private static getPostMessage(r:Runnable, token?:any):Message {
            let m = Message.obtain();
            m.obj = token;
            m.callback = r;
            return m;
        }
    }

    export module Handler {
        /**
         * Callback interface you can use when instantiating a Handler to avoid
         * having to implement your own subclass of Handler.
         *
         * @param msg A {@link android.os.Message Message} object
         * @return True if no further handling is desired
         */
        export interface Callback {
            handleMessage(msg:Message):boolean;
        }

    }
}
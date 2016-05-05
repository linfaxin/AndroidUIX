/*
 * Copyright (C) 2007 The Android Open Source Project
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

///<reference path="../content/res/Resources.ts"/>
///<reference path="../graphics/Rect.ts"/>
///<reference path="../view/ViewConfiguration.ts"/>
///<reference path="../os/SystemClock.ts"/>


module android.view {
    import Rect = android.graphics.Rect;
    import ViewConfiguration = android.view.ViewConfiguration;


    const tempBound = new Rect();

    interface TouchEvent extends UIEvent {
        touches: TouchList;
        changedTouches: TouchList;
        type: string;
        //targetTouches: TouchList;
        //rotation: number;
        //scale: number;
    }
    interface TouchList {
        length: number;
        [index: number]: Touch;
        item: (index:number) => Touch;
    }
    interface Touch {
        //identifier: number;
        id_fix:number;
        target: EventTarget;
        screenX: number;
        screenY: number;
        clientX: number;
        clientY: number;
        pageX: number;
        pageY: number;

        //add as history
        mEventTime?:number;
    }


    const ID_FixID_Cache:Array<number> = [];

    /**
     * identifier on iOS safari was not same as other platform
     * http://stackoverflow.com/questions/25008690/javascript-ipad-touch-event-identifier-is-continually-incrementing
     */
    function fixEventId(e:TouchEvent){
        for (let i = 0, length = e.changedTouches.length; i < length; i++) {
            fixTouchId(e.changedTouches[i]);
        }
        for (let i = 0, length = e.touches.length; i < length; i++) {
            fixTouchId(e.touches[i]);
        }
        if(e.type == 'touchend' || e.type == 'touchcancel'){
            ID_FixID_Cache[e.changedTouches[0].id_fix] = null;
        }
    }
    function fixTouchId(touch:Touch){
        let originID = touch['identifier'];
        if(originID <= 10){
            //no need fix
            touch.id_fix = originID;
            ID_FixID_Cache[originID] = originID;
            return;
        }
        touch.id_fix = ID_FixID_Cache.indexOf(originID);
        if(touch.id_fix>=0) return;

        for(let i = 0, length=ID_FixID_Cache.length + 1; i<length; i++){
            if(ID_FixID_Cache[i] == null){
                ID_FixID_Cache[i] = originID;
                touch.id_fix = i;
                return;
            }
        }

    }


    /**
     * Object used to report movement (mouse, pen, finger, trackball) events.
     * Motion events may hold either absolute or relative movements and other data,
     * depending on the type of device.
     *
     * <h3>Overview</h3>
     * <p>
     * Motion events describe movements in terms of an action code and a set of axis values.
     * The action code specifies the state change that occurred such as a pointer going
     * down or up.  The axis values describe the position and other movement properties.
     * </p><p>
     * For example, when the user first touches the screen, the system delivers a touch
     * event to the appropriate {@link View} with the action code {@link #ACTION_DOWN}
     * and a set of axis values that include the X and Y coordinates of the touch and
     * information about the pressure, size and orientation of the contact area.
     * </p><p>
     * Some devices can report multiple movement traces at the same time.  Multi-touch
     * screens emit one movement trace for each finger.  The individual fingers or
     * other objects that generate movement traces are referred to as <em>pointers</em>.
     * Motion events contain information about all of the pointers that are currently active
     * even if some of them have not moved since the last event was delivered.
     * </p><p>
     * The number of pointers only ever changes by one as individual pointers go up and down,
     * except when the gesture is canceled.
     * </p><p>
     * Each pointer has a unique id that is assigned when it first goes down
     * (indicated by {@link #ACTION_DOWN} or {@link #ACTION_POINTER_DOWN}).  A pointer id
     * remains valid until the pointer eventually goes up (indicated by {@link #ACTION_UP}
     * or {@link #ACTION_POINTER_UP}) or when the gesture is canceled (indicated by
     * {@link #ACTION_CANCEL}).
     * </p><p>
     * The MotionEvent class provides many methods to query the position and other properties of
     * pointers, such as {@link #getX(int)}, {@link #getY(int)}, {@link #getAxisValue},
     * {@link #getPointerId(int)}, {@link #getToolType(int)}, and many others.  Most of these
     * methods accept the pointer index as a parameter rather than the pointer id.
     * The pointer index of each pointer in the event ranges from 0 to one less than the value
     * returned by {@link #getPointerCount()}.
     * </p><p>
     * The order in which individual pointers appear within a motion event is undefined.
     * Thus the pointer index of a pointer can change from one event to the next but
     * the pointer id of a pointer is guaranteed to remain constant as long as the pointer
     * remains active.  Use the {@link #getPointerId(int)} method to obtain the
     * pointer id of a pointer to track it across all subsequent motion events in a gesture.
     * Then for successive motion events, use the {@link #findPointerIndex(int)} method
     * to obtain the pointer index for a given pointer id in that motion event.
     * </p><p>
     * Mouse and stylus buttons can be retrieved using {@link #getButtonState()}.  It is a
     * good idea to check the button state while handling {@link #ACTION_DOWN} as part
     * of a touch event.  The application may choose to perform some different action
     * if the touch event starts due to a secondary button click, such as presenting a
     * context menu.
     * </p>
     *
     * <h3>Batching</h3>
     * <p>
     * For efficiency, motion events with {@link #ACTION_MOVE} may batch together
     * multiple movement samples within a single object.  The most current
     * pointer coordinates are available using {@link #getX(int)} and {@link #getY(int)}.
     * Earlier coordinates within the batch are accessed using {@link #getHistoricalX(int, int)}
     * and {@link #getHistoricalY(int, int)}.  The coordinates are "historical" only
     * insofar as they are older than the current coordinates in the batch; however,
     * they are still distinct from any other coordinates reported in prior motion events.
     * To process all coordinates in the batch in time order, first consume the historical
     * coordinates then consume the current coordinates.
     * </p><p>
     * Example: Consuming all samples for all pointers in a motion event in time order.
     * </p><p><pre><code>
     * void printSamples(MotionEvent ev) {
 *     final int historySize = ev.getHistorySize();
 *     final int pointerCount = ev.getPointerCount();
 *     for (int h = 0; h &lt; historySize; h++) {
 *         System.out.printf("At time %d:", ev.getHistoricalEventTime(h));
 *         for (int p = 0; p &lt; pointerCount; p++) {
 *             System.out.printf("  pointer %d: (%f,%f)",
 *                 ev.getPointerId(p), ev.getHistoricalX(p, h), ev.getHistoricalY(p, h));
 *         }
 *     }
 *     System.out.printf("At time %d:", ev.getEventTime());
 *     for (int p = 0; p &lt; pointerCount; p++) {
 *         System.out.printf("  pointer %d: (%f,%f)",
 *             ev.getPointerId(p), ev.getX(p), ev.getY(p));
 *     }
 * }
     * </code></pre></p>
     *
     * <h3>Device Types</h3>
     * <p>
     * The interpretation of the contents of a MotionEvent varies significantly depending
     * on the source class of the device.
     * </p><p>
     * On pointing devices with source class {@link InputDevice#SOURCE_CLASS_POINTER}
     * such as touch screens, the pointer coordinates specify absolute
     * positions such as view X/Y coordinates.  Each complete gesture is represented
     * by a sequence of motion events with actions that describe pointer state transitions
     * and movements.  A gesture starts with a motion event with {@link #ACTION_DOWN}
     * that provides the location of the first pointer down.  As each additional
     * pointer that goes down or up, the framework will generate a motion event with
     * {@link #ACTION_POINTER_DOWN} or {@link #ACTION_POINTER_UP} accordingly.
     * Pointer movements are described by motion events with {@link #ACTION_MOVE}.
     * Finally, a gesture end either when the final pointer goes up as represented
     * by a motion event with {@link #ACTION_UP} or when gesture is canceled
     * with {@link #ACTION_CANCEL}.
     * </p><p>
     * Some pointing devices such as mice may support vertical and/or horizontal scrolling.
     * A scroll event is reported as a generic motion event with {@link #ACTION_SCROLL} that
     * includes the relative scroll offset in the {@link #AXIS_VSCROLL} and
     * {@link #AXIS_HSCROLL} axes.  See {@link #getAxisValue(int)} for information
     * about retrieving these additional axes.
     * </p><p>
     * On trackball devices with source class {@link InputDevice#SOURCE_CLASS_TRACKBALL},
     * the pointer coordinates specify relative movements as X/Y deltas.
     * A trackball gesture consists of a sequence of movements described by motion
     * events with {@link #ACTION_MOVE} interspersed with occasional {@link #ACTION_DOWN}
     * or {@link #ACTION_UP} motion events when the trackball button is pressed or released.
     * </p><p>
     * On joystick devices with source class {@link InputDevice#SOURCE_CLASS_JOYSTICK},
     * the pointer coordinates specify the absolute position of the joystick axes.
     * The joystick axis values are normalized to a range of -1.0 to 1.0 where 0.0 corresponds
     * to the center position.  More information about the set of available axes and the
     * range of motion can be obtained using {@link InputDevice#getMotionRange}.
     * Some common joystick axes are {@link #AXIS_X}, {@link #AXIS_Y},
     * {@link #AXIS_HAT_X}, {@link #AXIS_HAT_Y}, {@link #AXIS_Z} and {@link #AXIS_RZ}.
     * </p><p>
     * Refer to {@link InputDevice} for more information about how different kinds of
     * input devices and sources represent pointer coordinates.
     * </p>
     *
     * <h3>Consistency Guarantees</h3>
     * <p>
     * Motion events are always delivered to views as a consistent stream of events.
     * What constitutes a consistent stream varies depending on the type of device.
     * For touch events, consistency implies that pointers go down one at a time,
     * move around as a group and then go up one at a time or are canceled.
     * </p><p>
     * While the framework tries to deliver consistent streams of motion events to
     * views, it cannot guarantee it.  Some events may be dropped or modified by
     * containing views in the application before they are delivered thereby making
     * the stream of events inconsistent.  Views should always be prepared to
     * handle {@link #ACTION_CANCEL} and should tolerate anomalous
     * situations such as receiving a new {@link #ACTION_DOWN} without first having
     * received an {@link #ACTION_UP} for the prior gesture.
     * </p>
     */
    export class MotionEvent {

        /**
         * An invalid pointer id.
         *
         * This value (-1) can be used as a placeholder to indicate that a pointer id
         * has not been assigned or is not available.  It cannot appear as
         * a pointer id inside a {@link MotionEvent}.
         */
        static INVALID_POINTER_ID:number = -1;

        static ACTION_MASK = 0xff;
        static ACTION_DOWN = 0;
        static ACTION_UP = 1;
        static ACTION_MOVE = 2;
        static ACTION_CANCEL = 3;
        static ACTION_OUTSIDE = 4;
        static ACTION_POINTER_DOWN = 5;
        static ACTION_POINTER_UP = 6;
        static ACTION_HOVER_MOVE = 7;
        static ACTION_SCROLL = 8;
        static ACTION_HOVER_ENTER = 9;
        static ACTION_HOVER_EXIT = 10;

        static EDGE_TOP = 0x00000001;
        static EDGE_BOTTOM = 0x00000002;
        static EDGE_LEFT = 0x00000004;
        static EDGE_RIGHT = 0x00000008;

        static ACTION_POINTER_INDEX_MASK = 0xff00;
        static ACTION_POINTER_INDEX_SHIFT = 8;

        static AXIS_VSCROLL = 9;
        static AXIS_HSCROLL = 10;

        static HistoryMaxSize = 10;

        private static TouchMoveRecord = new Map<number, Array<Touch>>();// (id, [])

        mAction = 0;
        mEdgeFlags = 0;
        mDownTime = 0;
        mEventTime = 0;
        //mActiveActionIndex = 0;
        mActivePointerId = 0;
        private mTouchingPointers:Array<Touch>;
        mXOffset = 0;
        mYOffset = 0;

        _activeTouch:any;
        //_event:any;
        private _axisValues = new Map<number, number>();

        static obtainWithTouchEvent(e, action:number):MotionEvent {
            let event = new MotionEvent();
            event.initWithTouch(e, action);
            return event;
        }

        static obtain(event:MotionEvent):MotionEvent {
            let newEv = new MotionEvent();
            Object.assign(newEv, event);
            return newEv;
        }
        static obtainWithAction(downTime:number, eventTime:number, action:number, x:number, y:number, metaState=0):MotionEvent {
            let newEv = new MotionEvent();
            newEv.mAction = action;
            newEv.mDownTime = downTime;
            newEv.mEventTime = eventTime;
            let touch:Touch = {
                //identifier: 0,
                id_fix: 0,
                target: null,
                screenX: x,
                screenY: y,
                clientX: x,
                clientY: y,
                pageX: x,
                pageY: y
            };
            newEv.mTouchingPointers = [touch];
            return newEv;
        }

        private static IdIndexCache = new Map<number, number>();

        initWithTouch(event, baseAction:number, windowBound = new Rect() ) {
            //this._event = event;
            let e = <TouchEvent>event;
            fixEventId(e);

            let now = android.os.SystemClock.uptimeMillis();
            //get actionIndex
            let action = baseAction;
            let actionIndex = -1;
            let activeTouch = e.changedTouches[0];
            this._activeTouch = activeTouch;
            let activePointerId = activeTouch.id_fix;
            for (let i = 0, length = e.touches.length; i < length; i++) {
                if (e.touches[i].id_fix === activePointerId) {
                    actionIndex = i;
                    MotionEvent.IdIndexCache.set(activePointerId, i);//cache the index, action_up will use
                    break;
                }
            }
            if (actionIndex < 0 && (baseAction === MotionEvent.ACTION_UP||baseAction === MotionEvent.ACTION_CANCEL)) {
                //if action is touchend, use last index (because it is not exist in webkit event.touches)
                actionIndex = MotionEvent.IdIndexCache.get(activePointerId);
            }
            if (actionIndex < 0) throw Error('not find action index');



            //touch move record
            switch (baseAction) {
                case MotionEvent.ACTION_DOWN:
                case MotionEvent.ACTION_UP:
                    MotionEvent.TouchMoveRecord.set(activePointerId, []);
                    break;
                case MotionEvent.ACTION_MOVE:
                    let moveHistory = MotionEvent.TouchMoveRecord.get(activePointerId);
                    if (moveHistory){
                        activeTouch.mEventTime = now;
                        moveHistory.push(activeTouch);
                        if(moveHistory.length>MotionEvent.HistoryMaxSize) moveHistory.shift();
                    }
                    break;
            }


            this.mTouchingPointers = Array.from(e.touches);
            if(baseAction === MotionEvent.ACTION_UP || baseAction === MotionEvent.ACTION_CANCEL){//add the touch end to touching list
                this.mTouchingPointers.splice(actionIndex, 0, activeTouch);
            }


            //check if ACTION_POINTER_UP/ACTION_POINTER_DOWN, and mask the action
            if (this.mTouchingPointers.length>1) {
                //the event is not the first event on screen
                switch (action) {
                    case MotionEvent.ACTION_DOWN:
                        action = MotionEvent.ACTION_POINTER_DOWN;
                        action = actionIndex << MotionEvent.ACTION_POINTER_INDEX_SHIFT | action;
                        break;
                    case MotionEvent.ACTION_UP:
                        action = MotionEvent.ACTION_POINTER_UP;
                        action = actionIndex << MotionEvent.ACTION_POINTER_INDEX_SHIFT | action;
                        break;
                }
            }


            //let lastAction = this.mAction;
            // index & id to action
            this.mAction = action;
            //this.mActiveActionIndex = actionIndex;
            this.mActivePointerId = activePointerId;

            if (action == MotionEvent.ACTION_DOWN) {
                this.mDownTime = now;
            }
            this.mEventTime = now;
            const density = android.content.res.Resources.getSystem().getDisplayMetrics().density;
            this.mXOffset = this.mYOffset = 0;

            //set edge flag
            let edgeFlag = 0;
            let unScaledX = activeTouch.pageX;
            let unScaledY = activeTouch.pageY;
            let edgeSlop = ViewConfiguration.EDGE_SLOP;

            tempBound.set(windowBound);
            tempBound.right = tempBound.left + edgeSlop;
            if(tempBound.contains(unScaledX, unScaledY)){
                edgeFlag |= MotionEvent.EDGE_LEFT;
            }

            tempBound.set(windowBound);
            tempBound.bottom = tempBound.top + edgeSlop;
            if(tempBound.contains(unScaledX, unScaledY)){
                edgeFlag |= MotionEvent.EDGE_TOP;
            }

            tempBound.set(windowBound);
            tempBound.left = tempBound.right - edgeSlop;
            if(tempBound.contains(unScaledX, unScaledY)){
                edgeFlag |= MotionEvent.EDGE_RIGHT;
            }

            tempBound.set(windowBound);
            tempBound.top = tempBound.bottom - edgeSlop;
            if(tempBound.contains(unScaledX, unScaledY)){
                edgeFlag |= MotionEvent.EDGE_BOTTOM;
            }
            this.mEdgeFlags = edgeFlag;

        }

        initWithMouseWheel(e:WheelEvent){
            this.mAction = MotionEvent.ACTION_SCROLL;
            this.mActivePointerId = 0;
            let touch:Touch = {
                //identifier: 0,
                id_fix: 0,
                target: null,
                screenX: e.screenX,
                screenY: e.screenY,
                clientX: e.clientX,
                clientY: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY
            };
            this.mTouchingPointers = [touch];
            this.mDownTime = this.mEventTime = android.os.SystemClock.uptimeMillis();
            this.mXOffset = this.mYOffset = 0;
            this._axisValues.clear();
            this._axisValues.set(MotionEvent.AXIS_VSCROLL, -e.deltaY);
            this._axisValues.set(MotionEvent.AXIS_HSCROLL, -e.deltaX);
        }

        /**
         * Recycle the MotionEvent, to be re-used by a later caller.  After calling
         * this function you must not ever touch the event again.
         */
        recycle() {
            //TODO recycle motionEvent
        }

        /**
         * Return the kind of action being performed -- one of either
         * {@link #ACTION_DOWN}, {@link #ACTION_MOVE}, {@link #ACTION_UP}, or
         * {@link #ACTION_CANCEL}.  Consider using {@link #getActionMasked}
         * and {@link #getActionIndex} to retrieve the separate masked action
         * and pointer index.
         */
        getAction():number {
            return this.mAction;
        }

        /**
         * Return the masked action being performed, without pointer index
         * information.  May be any of the actions: {@link #ACTION_DOWN},
         * {@link #ACTION_MOVE}, {@link #ACTION_UP}, {@link #ACTION_CANCEL},
         * {@link #ACTION_POINTER_DOWN}, or {@link #ACTION_POINTER_UP}.
         * Use {@link #getActionIndex} to return the index associated with
         * pointer actions.
         */
        getActionMasked():number {
            return this.mAction & MotionEvent.ACTION_MASK;
        }

        getActionIndex():number {
            return (this.mAction & MotionEvent.ACTION_POINTER_INDEX_MASK) >> MotionEvent.ACTION_POINTER_INDEX_SHIFT;
        }

        //return in ms(start time of event stream)
        getDownTime():number {
            return this.mDownTime;
        }

        //return in ms
        getEventTime():number {
            return this.mEventTime;
        }

        getX(pointerIndex = 0):number {
            let density = android.content.res.Resources.getDisplayMetrics().density;
            return (this.mTouchingPointers[pointerIndex].pageX) * density + this.mXOffset;
        }

        getY(pointerIndex = 0):number {
            let density = android.content.res.Resources.getDisplayMetrics().density;
            return (this.mTouchingPointers[pointerIndex].pageY) * density + this.mYOffset;
        }

        getPointerCount():number {
            return this.mTouchingPointers.length;
        }

        getPointerId(pointerIndex:number):number {
            return this.mTouchingPointers[pointerIndex].id_fix;
        }


        findPointerIndex(pointerId:number):number {
            for (let i = 0, length = this.mTouchingPointers.length; i < length; i++) {
                if (this.mTouchingPointers[i].id_fix === pointerId) {
                    return i;
                }
            }
            return -1;
        }

        getRawX():number {
            let density = android.content.res.Resources.getDisplayMetrics().density;
            return (this.mTouchingPointers[0].pageX) * density;
        }

        getRawY():number {
            let density = android.content.res.Resources.getDisplayMetrics().density;
            return (this.mTouchingPointers[0].pageY) * density;
        }

        getHistorySize(id=this.mActivePointerId):number {
            let moveHistory = MotionEvent.TouchMoveRecord.get(id);
            return moveHistory ? moveHistory.length : 0;
        }

        getHistoricalX(pointerIndex:number, pos:number):number {
            let density = android.content.res.Resources.getDisplayMetrics().density;
            let moveHistory = MotionEvent.TouchMoveRecord.get(this.mTouchingPointers[pointerIndex].id_fix);
            return (moveHistory[pos].pageX) * density + this.mXOffset;
        }

        getHistoricalY(pointerIndex:number, pos:number):number {
            let density = android.content.res.Resources.getDisplayMetrics().density;
            let moveHistory = MotionEvent.TouchMoveRecord.get(this.mTouchingPointers[pointerIndex].id_fix);
            return (moveHistory[pos].pageY) * density + this.mYOffset;
        }

        getHistoricalEventTime(pos:number):number;
        getHistoricalEventTime(pointerIndex:number, pos:number):number;
        getHistoricalEventTime(...args):number{
            let pos, activePointerId;
            if(args.length===1){
                pos = args[0];
                activePointerId = this.mActivePointerId;
            }else{
                pos = args[1];
                activePointerId = this.getPointerId(args[0]);
            }
            let moveHistory = MotionEvent.TouchMoveRecord.get(activePointerId);
            return moveHistory[pos].mEventTime;
        }

        getTouchMajor(pointerIndex?:number):number {
            return Math.floor(android.content.res.Resources.getDisplayMetrics().density);//no touch major impl
        }
        getHistoricalTouchMajor(pointerIndex?:number, pos?:number):number {
            return Math.floor(android.content.res.Resources.getDisplayMetrics().density);//no touch major impl
        }

        /**
         * Returns a bitfield indicating which edges, if any, were touched by this
         * MotionEvent. For touch events, clients can use this to determine if the
         * user's finger was touching the edge of the display.
         *
         * @see #EDGE_LEFT
         * @see #EDGE_TOP
         * @see #EDGE_RIGHT
         * @see #EDGE_BOTTOM
         */
        getEdgeFlags():number {
            return this.mEdgeFlags;
        }

        /**
         * Sets the bitfield indicating which edges, if any, were touched by this
         * MotionEvent.
         *
         * @see #getEdgeFlags()
         */
        setEdgeFlags(flags:number) {
            this.mEdgeFlags = flags;
        }
        setAction(action:number) {
            this.mAction = action;
        }
        isTouchEvent():boolean{
            let action = this.getActionMasked();
            switch (action){
                case MotionEvent.ACTION_DOWN:
                case MotionEvent.ACTION_UP:
                case MotionEvent.ACTION_MOVE:
                case MotionEvent.ACTION_CANCEL:
                case MotionEvent.ACTION_OUTSIDE:
                case MotionEvent.ACTION_POINTER_DOWN:
                case MotionEvent.ACTION_POINTER_UP:
                    return true;
            }
            return false;
        }
        isPointerEvent():boolean{
            return true;//all event was pointer event now
        }

        offsetLocation(deltaX:number, deltaY:number) {
            this.mXOffset += deltaX;
            this.mYOffset += deltaY;
        }

        setLocation(x:number, y:number) {
            this.mXOffset = x - this.getRawX();
            this.mYOffset = y - this.getRawY();
        }

        getPointerIdBits():number {
            let idBits = 0;
            let pointerCount = this.getPointerCount();
            for (let i = 0; i < pointerCount; i++) {
                idBits |= 1 << this.getPointerId(i);
            }
            return idBits;
        }

        split(idBits:number):MotionEvent {
            let ev = MotionEvent.obtain(this);

            let oldPointerCount = this.getPointerCount();
            const oldAction = this.getAction();
            const oldActionMasked = oldAction & MotionEvent.ACTION_MASK;

            let newPointerIds = [];
            for (let i = 0; i < oldPointerCount; i++) {
                let pointerId = this.getPointerId(i);
                let idBit = 1 << pointerId;
                if ((idBit & idBits) != 0) {
                    newPointerIds.push(pointerId);
                }
            }

            let newActionPointerIndex = newPointerIds.indexOf(this.mActivePointerId);
            let newPointerCount = newPointerIds.length;
            let newAction;
            if (oldActionMasked == MotionEvent.ACTION_POINTER_DOWN || oldActionMasked == MotionEvent.ACTION_POINTER_UP) {
                if (newActionPointerIndex < 0) {
                    // An unrelated pointer changed.
                    newAction = MotionEvent.ACTION_MOVE;
                } else if (newPointerCount == 1) {
                    // The first/last pointer went down/up.
                    newAction = oldActionMasked == MotionEvent.ACTION_POINTER_DOWN
                        ? MotionEvent.ACTION_DOWN : MotionEvent.ACTION_UP;
                } else {
                    // A secondary pointer went down/up.
                    newAction = oldActionMasked | (newActionPointerIndex << MotionEvent.ACTION_POINTER_INDEX_SHIFT);
                }
            } else {
                // Simple up/down/cancel/move or other motion action.
                newAction = oldAction;
            }

            ev.mAction = newAction;
            ev.mTouchingPointers = this.mTouchingPointers.filter((item:Touch)=> {
                return newPointerIds.indexOf(item.id_fix) >= 0;
            });

            return ev;
        }

        getAxisValue(axis:number):number{
            let value = this._axisValues.get(axis);
            return value ? value : 0;
        }

        toString() {
            return "MotionEvent{action=" + this.getAction() + " x=" + this.getX()
                + " y=" + this.getY() + "}";
        }

    }

}
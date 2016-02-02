/**
 * Created by linfaxin on 15/10/6.
 */
///<reference path="../content/res/Resources.ts"/>
///<reference path="../graphics/Rect.ts"/>
///<reference path="../view/ViewConfiguration.ts"/>
///<reference path="../os/SystemClock.ts"/>


module android.view {
    import Rect = android.graphics.Rect;
    import ViewConfiguration = android.view.ViewConfiguration;

    interface TouchEvent extends UIEvent {
        touches: TouchList;
        targetTouches: TouchList;
        changedTouches: TouchList;
        //rotation: number;
        //scale: number;
    }
    interface TouchList {
        length: number;
        [index: number]: Touch;
        item: (index:number) => Touch;
    }
    interface Touch {
        identifier: number;
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
                identifier: 0,
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
            let now = android.os.SystemClock.uptimeMillis();
            //get actionIndex
            let action = baseAction;
            let actionIndex = -1;
            let activeTouch = e.changedTouches[0];
            this._activeTouch = activeTouch;
            let activePointerId = activeTouch.identifier;
            for (let i = 0, length = e.touches.length; i < length; i++) {
                if (e.touches[i].identifier === activePointerId) {
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
            this.mXOffset = this.mYOffset = 0;

            //set edge flag
            let edgeFlag = 0;
            let unScaledX = activeTouch.clientX;
            let unScaledY = activeTouch.clientY;
            let edgeSlop = ViewConfiguration.EDGE_SLOP;
            let tempBound = new Rect();

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
                identifier: 0,
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
            return (this.mTouchingPointers[pointerIndex].clientX) * density + this.mXOffset;
        }

        getY(pointerIndex = 0):number {
            let density = android.content.res.Resources.getDisplayMetrics().density;
            return (this.mTouchingPointers[pointerIndex].clientY) * density + this.mYOffset;
        }

        getPointerCount():number {
            return this.mTouchingPointers.length;
        }

        getPointerId(pointerIndex:number):number {
            return this.mTouchingPointers[pointerIndex].identifier;
        }


        findPointerIndex(pointerId:number):number {
            for (let i = 0, length = this.mTouchingPointers.length; i < length; i++) {
                if (this.mTouchingPointers[i].identifier === pointerId) {
                    return i;
                }
            }
            return -1;
        }

        getRawX():number {
            let density = android.content.res.Resources.getDisplayMetrics().density;
            return (this.mTouchingPointers[0].clientX) * density;
        }

        getRawY():number {
            let density = android.content.res.Resources.getDisplayMetrics().density;
            return (this.mTouchingPointers[0].clientY) * density;
        }

        getHistorySize(id=this.mActivePointerId):number {
            let moveHistory = MotionEvent.TouchMoveRecord.get(id);
            return moveHistory ? moveHistory.length : 0;
        }

        getHistoricalX(pointerIndex:number, pos:number):number {
            let density = android.content.res.Resources.getDisplayMetrics().density;
            let moveHistory = MotionEvent.TouchMoveRecord.get(this.mTouchingPointers[pointerIndex].identifier);
            return (moveHistory[pos].clientX) * density + this.mXOffset;
        }

        getHistoricalY(pointerIndex:number, pos:number):number {
            let density = android.content.res.Resources.getDisplayMetrics().density;
            let moveHistory = MotionEvent.TouchMoveRecord.get(this.mTouchingPointers[pointerIndex].identifier);
            return (moveHistory[pos].clientY) * density + this.mYOffset;
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
                return newPointerIds.indexOf(item.identifier) >= 0;
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
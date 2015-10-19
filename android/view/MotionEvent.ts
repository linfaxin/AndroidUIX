/**
 * Created by linfaxin on 15/10/6.
 */
module android.view {

    interface TouchEvent extends UIEvent {
        touches: TouchList;
        targetTouches: TouchList;
        changedTouches: TouchList;
        rotation: number;
        scale: number;
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

        static ACTION_POINTER_INDEX_MASK = 0xff00;
        static ACTION_POINTER_INDEX_SHIFT = 8;

        static HistoryMaxSize = 100;

        private static TouchMoveRecord = new Map<number, Array<Touch>>();// (id, [])

        mAction = 0;
        mDownTime = 0;
        mEventTime = 0;
        //mActiveActionIndex = 0;
        mActivePointerId = 0;
        mTouchingPointers:Array<Touch>;
        mXOffset = 0;
        mYOffset = 0;

        constructor(e:TouchEvent, action:number) {
            this.mAction = action;
            if (e) this.init(e, action);
        }

        static obtainWithTouchEvent(e:TouchEvent, action:number):MotionEvent {
            return new MotionEvent(e, action);
        }

        static obtain(event:MotionEvent):MotionEvent {
            let newEv = new MotionEvent(null, 0);
            Object.assign(newEv, event);
            return newEv;
        }
        static obtainWithAction(downTime:number, eventTime:number, action:number, x:number, y:number):MotionEvent {
            let newEv = new MotionEvent(null, action);
            newEv.mDownTime = downTime;
            newEv.mEventTime = eventTime;
            let touch:Touch = {
                identifier: 0,
                target: null,
                screenX: 0,
                screenY: 0,
                clientX: 0,
                clientY: 0,
                pageX: 0,
                pageY: 0
            };
            newEv.mTouchingPointers = [touch];
            return newEv;
        }

        private static IdIndexCache = new Map<number, number>();

        init(e:TouchEvent, baseAction:number, windowXOffset = 0, windowYOffset = 0) {

            //get actionIndex
            let action = baseAction;
            let actionIndex = -1;
            let activeTouch = e.changedTouches[0];
            let activePointerId = activeTouch.identifier;
            for (let i = 0, length = e.touches.length; i < length; i++) {
                if (e.touches[i].identifier === activePointerId) {
                    actionIndex = i;
                    MotionEvent.IdIndexCache.set(activePointerId, i);//cache the index, action_up will use
                    break;
                }
            }
            if (actionIndex < 0 && baseAction === MotionEvent.ACTION_UP) {
                //if action is touchend, use last index (because it is not exist in webkit event.touches)
                actionIndex = MotionEvent.IdIndexCache.get(activePointerId);
            }
            if (actionIndex < 0) throw Error('not find action index');


            //check if ACTION_POINTER_UP/ACTION_POINTER_DOWN
            if (actionIndex > 0) {
                //the event is not the first event on screen
                switch (action) {
                    case MotionEvent.ACTION_DOWN:
                        action = MotionEvent.ACTION_POINTER_DOWN;
                        break;
                    case MotionEvent.ACTION_UP:
                        action = MotionEvent.ACTION_POINTER_UP;
                        break;
                }
            }

            // index & id to action
            action = actionIndex << MotionEvent.ACTION_POINTER_INDEX_SHIFT | action;


            //touch move record
            switch (baseAction) {
                case MotionEvent.ACTION_DOWN:
                case MotionEvent.ACTION_UP:
                    MotionEvent.TouchMoveRecord.set(activePointerId, []);
                    break;
                case MotionEvent.ACTION_MOVE:
                    let moveHistory = MotionEvent.TouchMoveRecord.get(activePointerId);
                    if (moveHistory){
                        activeTouch.mEventTime = e.timeStamp;
                        moveHistory.push(activeTouch);
                        if(moveHistory.length>MotionEvent.HistoryMaxSize) moveHistory.shift();
                    }
                    break;
            }


            let lastAction = this.mAction;
            this.mAction = action;
            //this.mActiveActionIndex = actionIndex;
            this.mActivePointerId = activePointerId;

            if (activePointerId === 0 && action == MotionEvent.ACTION_DOWN) {
                this.mDownTime = e.timeStamp;
            }
            this.mEventTime = e.timeStamp;
            this.mTouchingPointers = Array.from(e.touches);
            if(baseAction === MotionEvent.ACTION_UP){//add the touch end to touching list
                this.mTouchingPointers.splice(actionIndex, 0, activeTouch);
            }
            this.mXOffset = -windowXOffset;
            this.mYOffset = -windowYOffset;

            //TODO
        }


        /**
         * Recycle the MotionEvent, to be re-used by a later caller.  After calling
         * this function you must not ever touch the event again.
         */
        recycle() {
            //no need recycle, only one object trigger event
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
            return this.mTouchingPointers[pointerIndex].pageX + this.mXOffset;
        }

        getY(pointerIndex = 0):number {
            return this.mTouchingPointers[pointerIndex].pageY + this.mYOffset;
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
            return this.mTouchingPointers[0].pageX;
        }

        getRawY():number {
            return this.mTouchingPointers[0].pageY;
        }

        getHistorySize():number {
            let moveHistory = MotionEvent.TouchMoveRecord.get(this.mActivePointerId);
            return moveHistory ? moveHistory.length : 0;
        }

        getHistoricalX(pointerIndex:number, pos:number):number {
            let moveHistory = MotionEvent.TouchMoveRecord.get(this.mTouchingPointers[pointerIndex].identifier);
            return moveHistory[pos].pageX + this.mXOffset;
        }

        getHistoricalY(pointerIndex:number, pos:number):number {
            let moveHistory = MotionEvent.TouchMoveRecord.get(this.mTouchingPointers[pointerIndex].identifier);
            return moveHistory[pos].pageY + this.mYOffset;
        }
        getHistoricalEventTime(pos:number):number{
            let moveHistory = MotionEvent.TouchMoveRecord.get(this.mActivePointerId);
            return moveHistory[pos].mEventTime;
        }

        setAction(action:number) {
            this.mAction = action;
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
            let newPointerIds = [];
            for (let i = 0; i < oldPointerCount; i++) {
                let pointerId = this.getPointerId(i);
                let idBit = 1 << pointerId;
                if ((idBit & idBits) != 0) {
                    newPointerIds.push(pointerId);
                }
            }
            ev.mTouchingPointers = this.mTouchingPointers.filter((item:Touch)=> {
                return newPointerIds.indexOf(item.identifier) >= 0;
            });

            return ev;
        }

        toString() {
            return "MotionEvent{action=" + this.getAction() + " x=" + this.getX()
                + " y=" + this.getY() + "}";
        }

    }

}
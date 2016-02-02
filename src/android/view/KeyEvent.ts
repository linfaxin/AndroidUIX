/**
 * Created by linfaxin on 15/11/9.
 */
///<reference path="../content/res/Resources.ts"/>
///<reference path="../graphics/Rect.ts"/>
///<reference path="../view/ViewConfiguration.ts"/>
///<reference path="../os/SystemClock.ts"/>
///<reference path="../util/Log.ts"/>
module android.view{
    import Resources = android.content.res.Resources;
    import Rect = android.graphics.Rect;
    import ViewConfiguration = android.view.ViewConfiguration;
    import SystemClock = android.os.SystemClock;
    import Log = android.util.Log;

    const DEBUG = false;
    const TAG = "KeyEvent";

    export class KeyEvent{
        /** Key code constant: Directional Pad Up key.
         * May also be synthesized from trackball motions. */
        static KEYCODE_DPAD_UP         = 38;
        /** Key code constant: Directional Pad Down key.
         * May also be synthesized from trackball motions. */
        static KEYCODE_DPAD_DOWN       = 40;
        /** Key code constant: Directional Pad Left key.
         * May also be synthesized from trackball motions. */
        static KEYCODE_DPAD_LEFT       = 37;
        /** Key code constant: Directional Pad Right key.
         * May also be synthesized from trackball motions. */
        static KEYCODE_DPAD_RIGHT      = 39;
        /** Key code constant: Directional Pad Center key.
         * May also be synthesized from trackball motions. */
        static KEYCODE_DPAD_CENTER     = 13;
        /** Key code constant: Enter key. */
        static KEYCODE_ENTER           = 13;
        /** Key code constant: Tab key. */
        static KEYCODE_TAB             = 9;
        /** Key code constant: Space key. */
        static KEYCODE_SPACE           = 32;
        /** Key code constant: Escape key. */
        static KEYCODE_ESCAPE          = 27;
        static KEYCODE_Backspace          = 8;
        static KEYCODE_PAGE_UP          = 33;
        static KEYCODE_PAGE_DOWN          = 34;
        static KEYCODE_MOVE_HOME          = 36;
        static KEYCODE_MOVE_END          = 35;


        static KEYCODE_Digit0          = 48;//'0'
        static KEYCODE_Digit1          = 49;//'1'
        static KEYCODE_Digit2          = 50;//'2'
        static KEYCODE_Digit3          = 51;//'3'
        static KEYCODE_Digit4          = 52;//'4'
        static KEYCODE_Digit5          = 53;//'5'
        static KEYCODE_Digit6          = 54;//'6'
        static KEYCODE_Digit7          = 55;//'7'
        static KEYCODE_Digit8          = 56;//'8'
        static KEYCODE_Digit9          = 57;//'9'

        static KEYCODE_Key_a            = 65;//'a'
        static KEYCODE_Key_b            = 66;//'b'
        static KEYCODE_Key_c            = 67;//'c'
        static KEYCODE_Key_d            = 68;//'d'
        static KEYCODE_Key_e            = 69;//'e'
        static KEYCODE_Key_f            = 70;//'f'
        static KEYCODE_Key_g            = 71;//'g'
        static KEYCODE_Key_h            = 72;//'h'
        static KEYCODE_Key_i            = 73;//'i'
        static KEYCODE_Key_j            = 74;//'j'
        static KEYCODE_Key_k            = 75;//'k'
        static KEYCODE_Key_l            = 76;//'l'
        static KEYCODE_Key_m            = 77;//'m'
        static KEYCODE_Key_n            = 78;//'n'
        static KEYCODE_Key_o            = 79;//'o'
        static KEYCODE_Key_p            = 80;//'p'
        static KEYCODE_Key_q            = 81;//'q'
        static KEYCODE_Key_r            = 82;//'r'
        static KEYCODE_Key_s            = 83;//'s'
        static KEYCODE_Key_t            = 84;//'t'
        static KEYCODE_Key_u            = 85;//'u'
        static KEYCODE_Key_v            = 86;//'v'
        static KEYCODE_Key_w            = 87;//'w'
        static KEYCODE_Key_x            = 88;//'x'
        static KEYCODE_Key_y            = 89;//'y'
        static KEYCODE_Key_z            = 90;//'z'
        static KEYCODE_KeyA            = 65 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'A'
        static KEYCODE_KeyB            = 66 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'B'
        static KEYCODE_KeyC            = 67 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'C'
        static KEYCODE_KeyD            = 68 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'D'
        static KEYCODE_KeyE            = 69 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'E'
        static KEYCODE_KeyF            = 70 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'F'
        static KEYCODE_KeyG            = 71 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'G'
        static KEYCODE_KeyH            = 72 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'H'
        static KEYCODE_KeyI            = 73 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'I'
        static KEYCODE_KeyJ            = 74 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'J'
        static KEYCODE_KeyK            = 75 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'K'
        static KEYCODE_KeyL            = 76 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'L'
        static KEYCODE_KeyM            = 77 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'M'
        static KEYCODE_KeyN            = 78 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'N'
        static KEYCODE_KeyO            = 79 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'O'
        static KEYCODE_KeyP            = 80 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'P'
        static KEYCODE_KeyQ            = 81 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'Q'
        static KEYCODE_KeyR            = 82 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'R'
        static KEYCODE_KeyS            = 83 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'S'
        static KEYCODE_KeyT            = 84 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'T'
        static KEYCODE_KeyU            = 85 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'U'
        static KEYCODE_KeyV            = 86 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'V'
        static KEYCODE_KeyW            = 87 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'W'
        static KEYCODE_KeyX            = 88 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'X'
        static KEYCODE_KeyY            = 89 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'Y'
        static KEYCODE_KeyZ            = 90 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'Z'

        static KEYCODE_Semicolon       = 186;//';'
        static KEYCODE_Comma           = 188;//','
        static KEYCODE_Period          = 190;//'.'
        static KEYCODE_Slash           = 191;//'/'
        static KEYCODE_Quotation       = 192;//'''
        static KEYCODE_LeftBracket     = 219;//'['
        static KEYCODE_Backslash       = 220;//'\'
        static KEYCODE_RightBracket    = 221;//']'
        static KEYCODE_Minus           = 189;//'-'
        static KEYCODE_Equal           = 187;//'='

        static KEYCODE_Right_Parenthesis= KeyEvent.KEYCODE_Digit0 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//')'(shift + '0')
        static KEYCODE_Exclamation      = KeyEvent.KEYCODE_Digit1 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'!'(shift + '1')
        static KEYCODE_AT               = KeyEvent.KEYCODE_Digit2 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'@'(shift + '2')
        static KEYCODE_Sharp            = KeyEvent.KEYCODE_Digit3 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'#'(shift + '3')
        static KEYCODE_Dollar           = KeyEvent.KEYCODE_Digit4 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'$'(shift + '4')
        static KEYCODE_Percent          = KeyEvent.KEYCODE_Digit5 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'%'(shift + '5')
        static KEYCODE_Power            = KeyEvent.KEYCODE_Digit6 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'^'(shift + '6')
        static KEYCODE_And              = KeyEvent.KEYCODE_Digit7 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'&'(shift + '7')
        static KEYCODE_Asterisk         = KeyEvent.KEYCODE_Digit8 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'*'(shift + '8')
        static KEYCODE_Left_Parenthesis = KeyEvent.KEYCODE_Digit9 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'('(shift + '9')
        static KEYCODE_Underline        = KeyEvent.KEYCODE_Minus & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'_'(shift + '－')
        static KEYCODE_Add              = KeyEvent.KEYCODE_Equal & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'+'(shift + '=')


        //can't listen back on browser
        static KEYCODE_BACK          = -1;
        //can't listen menu on browser
        static KEYCODE_MENU          = -2;




        /**
         * {@link #getAction} value: the key has been pressed down.
         */
        static ACTION_DOWN             = 0;
        /**
         * {@link #getAction} value: the key has been released.
         */
        static ACTION_UP               = 1;
        /**
         * {@link #getAction} value: multiple duplicate key events have
         * occurred in a row, or a complex string is being delivered.  If the
         * key code is not {#link {@link #KEYCODE_UNKNOWN} then the
         * {#link {@link #getRepeatCount()} method returns the number of times
         * the given key code should be executed.
         * Otherwise, if the key code is {@link #KEYCODE_UNKNOWN}, then
         * this is a sequence of characters as returned by {@link #getCharacters}.
         */
        //static ACTION_MULTIPLE         = 2;


        static META_MASK_SHIFT:number = 16;
        static META_ALT_ON:number = 0x02;
        static META_SHIFT_ON:number = 0x1;
        static META_CTRL_ON:number = 0x1000;
        static META_META_ON:number = 0x10000;

        static FLAG_CANCELED = 0x20;
        static FLAG_CANCELED_LONG_PRESS = 0x100;
        private static FLAG_LONG_PRESS = 0x80;
        static FLAG_TRACKING = 0x200;
        private static FLAG_START_TRACKING = 0x40000000;
        mFlags:number;

        private mAction : number;
        private mKeyCode : number;
        private mDownTime : number;
        private mEventTime : number;
        private mAltKey : boolean;
        private mShiftKey : boolean;
        private mCtrlKey : boolean;
        private mMetaKey : boolean;


        private mIsTypingKey:boolean;
        //private _activeKeyEvent : KeyboardEvent;
        private _downingKeyEventMap = new Map<number, KeyboardEvent[]>();

        static obtain(action:number, code:number):KeyEvent  {
            let ev:KeyEvent = new KeyEvent();
            ev.mDownTime = SystemClock.uptimeMillis();
            ev.mEventTime = SystemClock.uptimeMillis();
            ev.mAction = action;
            ev.mKeyCode = code;
            //ev.mRepeatCount = repeat;
            //ev.mMetaState = metaState;
            //ev.mDeviceId = deviceId;
            //ev.mScanCode = scancode;
            //ev.mFlags = flags;
            //ev.mSource = source;
            //ev.mCharacters = characters;
            return ev;
        }

        initKeyEvent(keyEvent:KeyboardEvent, action:number){
            this.mEventTime = SystemClock.uptimeMillis();
            this.mKeyCode = keyEvent.keyCode;
            this.mAltKey = keyEvent.altKey;
            this.mShiftKey = keyEvent.shiftKey;
            this.mCtrlKey = keyEvent.ctrlKey;
            this.mMetaKey = keyEvent.metaKey;

            this.mIsTypingKey = (keyEvent['keyIdentifier']+'').startsWith('U+');//use for check should level touch mode

            if(action === KeyEvent.ACTION_DOWN){
                this.mDownTime = SystemClock.uptimeMillis();

                let keyEvents = this._downingKeyEventMap.get(keyEvent.keyCode);
                if(keyEvents == null){
                    keyEvents = [];
                    this._downingKeyEventMap.set(keyEvent.keyCode, keyEvents);
                }
                keyEvents.push(keyEvent);

            }else if(action === KeyEvent.ACTION_UP){
                this._downingKeyEventMap.delete(keyEvent.keyCode);
            }

            this.mAction = action;


        }


        /** Whether key will, by default, trigger a click on the focused view.
         * @hide
         */
        static isConfirmKey(keyCode:number):boolean {
            switch (keyCode) {
            case KeyEvent.KEYCODE_DPAD_CENTER:
            case KeyEvent.KEYCODE_ENTER:
                return true;
            default:
                return false;
            }
        }

        isAltPressed():boolean{
            return this.mAltKey;
        }

        isShiftPressed():boolean{
            return this.mShiftKey;
        }

        isCtrlPressed():boolean{
            return this.mCtrlKey;
        }

        isMetaPressed():boolean{
            return this.mMetaKey;
        }

        /**
         * Retrieve the action of this key event.  May be either
         * {@link #ACTION_DOWN}, {@link #ACTION_UP}
         *
         * @return The event action: ACTION_DOWN or ACTION_UP.
         */
        getAction():number {
            return this.mAction;
        }


        /**
         * Call this during {@link Callback#onKeyDown} to have the system track
         * the key through its final up (possibly including a long press).  Note
         * that only one key can be tracked at a time -- if another key down
         * event is received while a previous one is being tracked, tracking is
         * stopped on the previous event.
         */
        startTracking():void {
            this.mFlags |= KeyEvent.FLAG_START_TRACKING;
        }


        /**
         * For {@link #ACTION_UP} events, indicates that the event is still being
         * tracked from its initial down event as per
         * {@link #FLAG_TRACKING}.
         */
        isTracking():boolean {
            return (this.mFlags&KeyEvent.FLAG_TRACKING) != 0;
        }


        /**
         * For {@link #ACTION_DOWN} events, indicates that the event has been
         * canceled as per {@link #FLAG_LONG_PRESS}.
         */
        isLongPress() {
            return this.getRepeatCount()===1;
        }

        getKeyCode():number {
            return this.mKeyCode;
        }

        getKeyCodeWithMask():number {
            let mask = 0;
            if(this.isShiftPressed()) mask |= KeyEvent.META_SHIFT_ON;
            if(this.isAltPressed()) mask |= KeyEvent.META_ALT_ON;
            if(this.isCtrlPressed()) mask |= KeyEvent.META_CTRL_ON;
            return this.mKeyCode & (mask << KeyEvent.META_MASK_SHIFT);
        }

        /**
         * Retrieve the repeat count of the event.  For both key up and key down
         * events, this is the number of times the key has repeated with the first
         * down starting at 0 and counting up from there.  For multiple key
         * events, this is the number of down/up pairs that have occurred.
         *
         * @return The number of times the key has repeated.
         */
        getRepeatCount() {
            let downArray = this._downingKeyEventMap.get(this.mKeyCode);
            return downArray ? downArray.length-1 : 0;
        }

        /**
         * Retrieve the time of the most recent key down event,
         * in the {@link android.os.SystemClock#uptimeMillis} time base.  If this
         * is a down event, this will be the same as {@link #getEventTime()}.
         * Note that when chording keys, this value is the down time of the
         * most recently pressed key, which may <em>not</em> be the same physical
         * key of this event.
         *
         * @return Returns the most recent key down time, in the
         * {@link android.os.SystemClock#uptimeMillis} time base
         */
        getDownTime():number {
            return this.mDownTime;
        }

        /**
         * Retrieve the time this event occurred,
         * in the {@link android.os.SystemClock#uptimeMillis} time base.
         *
         * @return Returns the time this event occurred,
         * in the {@link android.os.SystemClock#uptimeMillis} time base.
         */
        getEventTime():number {
            return this.mEventTime;
        }


        /**
         * Deliver this key event to a {@link Callback} interface.  If this is
         * an ACTION_MULTIPLE event and it is not handled, then an attempt will
         * be made to deliver a single normal event.
         *
         * @param receiver The Callback that will be given the event.
         * @param state State information retained across events.
         * @param target The target of the dispatch, for use in tracking.
         *
         * @return The return value from the Callback method that was called.
         */
        dispatch(receiver:KeyEvent.Callback, state?:KeyEvent.DispatcherState, target?:any):boolean{
            switch (this.mAction) {
                case KeyEvent.ACTION_DOWN: {
                    this.mFlags &= ~KeyEvent.FLAG_START_TRACKING;
                    if (DEBUG) Log.v(TAG, "Key down to " + target + " in " + state
                        + ": " + this);
                    let res = receiver.onKeyDown(this.getKeyCode(), this);
                    if (state != null) {
                        if (res && this.getRepeatCount() == 0 && (this.mFlags&KeyEvent.FLAG_START_TRACKING) != 0) {
                            if (DEBUG) Log.v(TAG, "  Start tracking!");
                            state.startTracking(this, target);
                        } else if (this.isLongPress() && state.isTracking(this)) {
                            if (receiver.onKeyLongPress(this.getKeyCode(), this)) {
                                if (DEBUG) Log.v(TAG, "  Clear from long press!");
                                state.performedLongPress(this);
                                res = true;
                            }
                        }
                    }
                    return res;
                }
                case KeyEvent.ACTION_UP:
                    if (DEBUG) Log.v(TAG, "Key up to " + target + " in " + state
                        + ": " + this);
                    if (state != null) {
                        state.handleUpEvent(this);
                    }
                    return receiver.onKeyUp(this.getKeyCode(), this);
                //case ACTION_MULTIPLE:
                //    final int count = mRepeatCount;
                //    final int code = mKeyCode;
                //    if (receiver.onKeyMultiple(code, count, this)) {
                //        return true;
                //    }
                //    if (code != KeyEvent.KEYCODE_UNKNOWN) {
                //        mAction = ACTION_DOWN;
                //        mRepeatCount = 0;
                //        boolean handled = receiver.onKeyDown(code, this);
                //        if (handled) {
                //            mAction = ACTION_UP;
                //            receiver.onKeyUp(code, this);
                //        }
                //        mAction = ACTION_MULTIPLE;
                //        mRepeatCount = count;
                //        return handled;
                //    }
                //    return false;
            }
            return false;
        }

        hasNoModifiers(){
            if(this.isAltPressed()) return false;
            if(this.isShiftPressed()) return false;
            if(this.isCtrlPressed()) return false;
            if(this.isMetaPressed()) return false;
            return true;
        }
        hasModifiers(modifiers:number){
            if( (modifiers & KeyEvent.META_ALT_ON)===KeyEvent.META_ALT_ON && this.isAltPressed()) return true;
            if( (modifiers & KeyEvent.META_SHIFT_ON)===KeyEvent.META_SHIFT_ON && this.isShiftPressed()) return true;
            if( (modifiers & KeyEvent.META_META_ON)===KeyEvent.META_META_ON && this.isMetaPressed()) return true;
            if( (modifiers & KeyEvent.META_CTRL_ON)===KeyEvent.META_CTRL_ON && this.isCtrlPressed()) return true;
        }
        getMetaState():number {
            let meta = 0;
            if(this.isAltPressed()) meta |= KeyEvent.META_ALT_ON;
            if(this.isShiftPressed()) meta |= KeyEvent.META_SHIFT_ON;
            if(this.isCtrlPressed()) meta |= KeyEvent.META_CTRL_ON;
            if(this.isMetaPressed()) meta |= KeyEvent.META_META_ON;
            return meta;
        }

        toString() {
            return JSON.stringify(this);
        }

        isCanceled():boolean {
            return false;
        }

        static actionToString(action:number):string {
            switch (action) {
                case KeyEvent.ACTION_DOWN:
                    return "ACTION_DOWN";
                case KeyEvent.ACTION_UP:
                    return "ACTION_UP";
                //case ACTION_MULTIPLE:
                //    return "ACTION_MULTIPLE";
                default:
                    return '' + (action);
            }
        }

        static keyCodeToString(keyCode:number):string {
            return String.fromCharCode(keyCode);
        }

    }

    export module KeyEvent{
        export interface Callback{
            /**
             * Called when a key down event has occurred.  If you return true,
             * you can first call {@link KeyEvent#startTracking()
         * KeyEvent.startTracking()} to have the framework track the event
             * through its {@link #onKeyUp(int, KeyEvent)} and also call your
             * {@link #onKeyLongPress(int, KeyEvent)} if it occurs.
             *
             * @param keyCode The value in event.getKeyCode().
             * @param event Description of the key event.
             *
             * @return If you handled the event, return true.  If you want to allow
             *         the event to be handled by the next receiver, return false.
             */
            onKeyDown(keyCode:number, event:KeyEvent):boolean;

            /**
             * Called when a long press has occurred.  If you return true,
             * the final key up will have {@link KeyEvent#FLAG_CANCELED} and
             * {@link KeyEvent#FLAG_CANCELED_LONG_PRESS} set.  Note that in
             * order to receive this callback, someone in the event change
             * <em>must</em> return true from {@link #onKeyDown} <em>and</em>
             * call {@link KeyEvent#startTracking()} on the event.
             *
             * @param keyCode The value in event.getKeyCode().
             * @param event Description of the key event.
             *
             * @return If you handled the event, return true.  If you want to allow
             *         the event to be handled by the next receiver, return false.
             */
            onKeyLongPress(keyCode:number, event:KeyEvent):boolean;

            /**
             * Called when a key up event has occurred.
             *
             * @param keyCode The value in event.getKeyCode().
             * @param event Description of the key event.
             *
             * @return If you handled the event, return true.  If you want to allow
             *         the event to be handled by the next receiver, return false.
             */
            onKeyUp(keyCode:number, event:KeyEvent):boolean;
        }

        export class DispatcherState{
            mDownKeyCode:number;
            mDownTarget:any;
            mActiveLongPresses = new android.util.SparseArray<number>();

            /**
             * Reset back to initial state.
             * Stop any tracking associated with this target.
             */
            reset(target:any) {
                if(target==null) {
                    if (DEBUG) Log.v(TAG, "Reset: " + this);
                    this.mDownKeyCode = 0;
                    this.mDownTarget = null;
                    this.mActiveLongPresses.clear();
                }else{
                    if (this.mDownTarget == target) {
                        if (DEBUG) Log.v(TAG, "Reset in " + target + ": " + this);
                        this.mDownKeyCode = 0;
                        this.mDownTarget = null;
                    }
                }
            }


            /**
             * Start tracking the key code associated with the given event.  This
             * can only be called on a key down.  It will allow you to see any
             * long press associated with the key, and will result in
             * {@link KeyEvent#isTracking} return true on the long press and up
             * events.
             *
             * <p>This is only needed if you are directly dispatching events, rather
             * than handling them in {@link Callback#onKeyDown}.
             */
            startTracking(event:KeyEvent , target:any) {
                if (event.getAction() != KeyEvent.ACTION_DOWN) {
                    throw new Error(
                        "Can only start tracking on a down event");
                }
                if (DEBUG) Log.v(TAG, "Start trackingt in " + target + ": " + this);
                this.mDownKeyCode = event.getKeyCode();
                this.mDownTarget = target;
            }


            /**
             * Return true if the key event is for a key code that is currently
             * being tracked by the dispatcher.
             */
            isTracking(event:KeyEvent):boolean {
                return this.mDownKeyCode == event.getKeyCode();
            }

            /**
             * Keep track of the given event's key code as having performed an
             * action with a long press, so no action should occur on the up.
             * <p>This is only needed if you are directly dispatching events, rather
             * than handling them in {@link Callback#onKeyLongPress}.
             */
            performedLongPress(event:KeyEvent) {
                this.mActiveLongPresses.put(event.getKeyCode(), 1);
            }

            /**
             * Handle key up event to stop tracking.  This resets the dispatcher state,
             * and updates the key event state based on it.
             * <p>This is only needed if you are directly dispatching events, rather
             * than handling them in {@link Callback#onKeyUp}.
             */
            handleUpEvent(event:KeyEvent) {
                const keyCode = event.getKeyCode();
                if (DEBUG) Log.v(TAG, "Handle key up " + event + ": " + this);
                let index = this.mActiveLongPresses.indexOfKey(keyCode);
                if (index >= 0) {
                    if (DEBUG) Log.v(TAG, "  Index: " + index);
                    event.mFlags |= KeyEvent.FLAG_CANCELED | KeyEvent.FLAG_CANCELED_LONG_PRESS;
                    this.mActiveLongPresses.removeAt(index);
                }
                if (this.mDownKeyCode == keyCode) {
                    if (DEBUG) Log.v(TAG, "  Tracking!");
                    event.mFlags |= KeyEvent.FLAG_TRACKING;
                    this.mDownKeyCode = 0;
                    this.mDownTarget = null;
                }
            }

        }
    }
}
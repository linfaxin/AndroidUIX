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

///<reference path="../content/res/Resources.ts"/>
///<reference path="../graphics/Rect.ts"/>
///<reference path="../view/ViewConfiguration.ts"/>
///<reference path="../os/SystemClock.ts"/>
///<reference path="../util/Log.ts"/>
///<reference path="../../androidui/util/Platform.ts"/>

module android.view{
    import Resources = android.content.res.Resources;
    import Rect = android.graphics.Rect;
    import ViewConfiguration = android.view.ViewConfiguration;
    import SystemClock = android.os.SystemClock;
    import Log = android.util.Log;
    import Platform = androidui.util.Platform;

    const DEBUG = false;
    const TAG = "KeyEvent";


    /**
     * Object used to report key and button events.
     * <p>
     * Each key press is described by a sequence of key events.  A key press
     * starts with a key event with {@link #ACTION_DOWN}.  If the key is held
     * sufficiently long that it repeats, then the initial down is followed
     * additional key events with {@link #ACTION_DOWN} and a non-zero value for
     * {@link #getRepeatCount()}.  The last key event is a {@link #ACTION_UP}
     * for the key up.  If the key press is canceled, the key up event will have the
     * {@link #FLAG_CANCELED} flag set.
     * </p><p>
     * Key events are generally accompanied by a key code ({@link #getKeyCode()}),
     * scan code ({@link #getScanCode()}) and meta state ({@link #getMetaState()}).
     * Key code constants are defined in this class.  Scan code constants are raw
     * device-specific codes obtained from the OS and so are not generally meaningful
     * to applications unless interpreted using the {@link KeyCharacterMap}.
     * Meta states describe the pressed state of key modifiers
     * such as {@link #META_SHIFT_ON} or {@link #META_ALT_ON}.
     * </p><p>
     * Key codes typically correspond one-to-one with individual keys on an input device.
     * Many keys and key combinations serve quite different functions on different
     * input devices so care must be taken when interpreting them.  Always use the
     * {@link KeyCharacterMap} associated with the input device when mapping keys
     * to characters.  Be aware that there may be multiple key input devices active
     * at the same time and each will have its own key character map.
     * </p><p>
     * As soft input methods can use multiple and inventive ways of inputting text,
     * there is no guarantee that any key press on a soft keyboard will generate a key
     * event: this is left to the IME's discretion, and in fact sending such events is
     * discouraged.  You should never rely on receiving KeyEvents for any key on a soft
     * input method.  In particular, the default software keyboard will never send any
     * key event to any application targetting Jelly Bean or later, and will only send
     * events for some presses of the delete and return keys to applications targetting
     * Ice Cream Sandwich or earlier.  Be aware that other software input methods may
     * never send key events regardless of the version.  Consider using editor actions
     * like {@link android.view.inputmethod.EditorInfo#IME_ACTION_DONE} if you need
     * specific interaction with the software keyboard, as it gives more visibility to
     * the user as to how your application will react to key presses.
     * </p><p>
     * When interacting with an IME, the framework may deliver key events
     * with the special action {@link #ACTION_MULTIPLE} that either specifies
     * that single repeated key code or a sequence of characters to insert.
     * </p><p>
     * In general, the framework cannot guarantee that the key events it delivers
     * to a view always constitute complete key sequences since some events may be dropped
     * or modified by containing views before they are delivered.  The view implementation
     * should be prepared to handle {@link #FLAG_CANCELED} and should tolerate anomalous
     * situations such as receiving a new {@link #ACTION_DOWN} without first having
     * received an {@link #ACTION_UP} for the prior key press.
     * </p><p>
     * Refer to {@link InputDevice} for more information about how different kinds of
     * input devices and sources represent keys and buttons.
     * </p>
     * 
     * AndroidUI NOTE: some impl modified;
     */
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
        static KEYCODE_KeyA            = 0x41;//65 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'A'
        static KEYCODE_KeyB            = 0x42;//66 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'B'
        static KEYCODE_KeyC            = 0x43;//67 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'C'
        static KEYCODE_KeyD            = 0x44;//68 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'D'
        static KEYCODE_KeyE            = 0x45;//69 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'E'
        static KEYCODE_KeyF            = 0x46;//70 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'F'
        static KEYCODE_KeyG            = 0x47;//71 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'G'
        static KEYCODE_KeyH            = 0x48;//72 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'H'
        static KEYCODE_KeyI            = 0x49;//73 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'I'
        static KEYCODE_KeyJ            = 0x4a;//74 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'J'
        static KEYCODE_KeyK            = 0x4b;//75 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'K'
        static KEYCODE_KeyL            = 0x4c;//76 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'L'
        static KEYCODE_KeyM            = 0x4d;//77 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'M'
        static KEYCODE_KeyN            = 0x4e;//78 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'N'
        static KEYCODE_KeyO            = 0x4f;//79 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'O'
        static KEYCODE_KeyP            = 0x50;//80 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'P'
        static KEYCODE_KeyQ            = 0x51;//81 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'Q'
        static KEYCODE_KeyR            = 0x52;//82 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'R'
        static KEYCODE_KeyS            = 0x53;//83 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'S'
        static KEYCODE_KeyT            = 0x54;//84 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'T'
        static KEYCODE_KeyU            = 0x55;//85 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'U'
        static KEYCODE_KeyV            = 0x56;//86 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'V'
        static KEYCODE_KeyW            = 0x57;//87 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'W'
        static KEYCODE_KeyX            = 0x58;//88 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'X'
        static KEYCODE_KeyY            = 0x59;//89 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'Y'
        static KEYCODE_KeyZ            = 0x5a;//90 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'Z'

        static KEYCODE_Semicolon       = 0x3b;//';'
        static KEYCODE_LessThan        = 0x3c;//'<'
        static KEYCODE_Equal           = 0x3d;//'='
        static KEYCODE_MoreThan        = 0x3e;//'>'
        static KEYCODE_Question        = 0x3f;//'?'
        static KEYCODE_Comma           = 0x2c;//','
        static KEYCODE_Period          = 0x2e;//'.'
        static KEYCODE_Slash           = 0x2f;//'/'
        static KEYCODE_Quotation       = 0x27;//'''
        static KEYCODE_LeftBracket     = 0x5b;//'['
        static KEYCODE_Backslash       = 0x5c;//'\'
        static KEYCODE_RightBracket    = 0x5d;//']'
        static KEYCODE_Minus           = 0x2d;//'-'
        static KEYCODE_Colon           = 0x3a;//':'

        static KEYCODE_Double_Quotation= 0x22;//'"'
        static KEYCODE_Backquote       = 0x60;//'`'
        static KEYCODE_Tilde           = 0x7e;//'~'
        static KEYCODE_Left_Brace      = 0x7b;//'{'
        static KEYCODE_Or              = 0x7c;//'|'
        static KEYCODE_Right_Brace     = 0x7d;//'}'
        static KEYCODE_Del             = 0x7f;//'Del'

        static KEYCODE_Exclamation      = 0x21;//KeyEvent.KEYCODE_Digit1 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'!'(shift + '1')
        static KEYCODE_Right_Parenthesis= 0x29;//KeyEvent.KEYCODE_Digit0 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//')'(shift + '0')
        static KEYCODE_AT               = 0x40;//KeyEvent.KEYCODE_Digit2 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'@'(shift + '2')
        static KEYCODE_Sharp            = 0x23;//KeyEvent.KEYCODE_Digit3 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'#'(shift + '3')
        static KEYCODE_Dollar           = 0x24;//KeyEvent.KEYCODE_Digit4 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'$'(shift + '4')
        static KEYCODE_Percent          = 0x25;//KeyEvent.KEYCODE_Digit5 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'%'(shift + '5')
        static KEYCODE_Power            = 0x5e;//KeyEvent.KEYCODE_Digit6 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'^'(shift + '6')
        static KEYCODE_And              = 0x26;//KeyEvent.KEYCODE_Digit7 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'&'(shift + '7')
        static KEYCODE_Asterisk         = 0x2a;//KeyEvent.KEYCODE_Digit8 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'*'(shift + '8')
        static KEYCODE_Left_Parenthesis = 0x28;//KeyEvent.KEYCODE_Digit9 & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'('(shift + '9')
        static KEYCODE_Underline        = 0x5f;//KeyEvent.KEYCODE_Minus & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'_'(shift + '－')
        static KEYCODE_Add              = 0x2b;//KeyEvent.KEYCODE_Equal & (KeyEvent.META_SHIFT_ON << KeyEvent.META_MASK_SHIFT);//'+'(shift + '=')


        //can't listen back on browser
        static KEYCODE_BACK          = -1;
        //can't listen menu on browser
        static KEYCODE_MENU          = -2;

        static KEYCODE_CHANGE_ANDROID_CHROME = {
            noMeta : {
                186: KeyEvent.KEYCODE_Semicolon,//';'
                187: KeyEvent.KEYCODE_Equal,//'='
                188: KeyEvent.KEYCODE_Comma,//','
                189: KeyEvent.KEYCODE_Minus,//'-'
                190: KeyEvent.KEYCODE_Period,//'.'
                191: KeyEvent.KEYCODE_Slash,//'/'
                192: KeyEvent.KEYCODE_Quotation,//'''
                //192: KeyEvent.KEYCODE_Backquote,//'`'
                219: KeyEvent.KEYCODE_LeftBracket,//'['
                220: KeyEvent.KEYCODE_Backslash,//'\'
                221: KeyEvent.KEYCODE_RightBracket,//']'
            },
            shift : {
                186: KeyEvent.KEYCODE_Colon,//':'
                187: KeyEvent.KEYCODE_Add,//'+'
                188: KeyEvent.KEYCODE_LessThan,//'<'
                189: KeyEvent.KEYCODE_Underline,//'_'
                190: KeyEvent.KEYCODE_MoreThan,//'>'
                191: KeyEvent.KEYCODE_Question,//'?'
                192: KeyEvent.KEYCODE_Double_Quotation,//'"'
                //192: KeyEvent.KEYCODE_Tilde,//'~'
                219: KeyEvent.KEYCODE_Left_Brace,//'{'
                220: KeyEvent.KEYCODE_Or,//'|'
                221: KeyEvent.KEYCODE_Right_Brace,//'}'
            },
            ctrl : {},
            alt : {}
            //TODO more code
        };




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


        protected mIsTypingKey:boolean;
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

            let keyIdentifier = keyEvent['keyIdentifier']+'';
            if(keyIdentifier){
                this.mIsTypingKey = keyIdentifier.startsWith('U+');//use for check should level touch mode
                if(this.mIsTypingKey){
                    this.mKeyCode = Number.parseInt(keyIdentifier.substr(2), 16);
                }
            }
            //TODO check caps lock
            //a ==> A, b ==> B, ...
            if(this.mKeyCode>=KeyEvent.KEYCODE_Key_a && this.mKeyCode<=KeyEvent.KEYCODE_Key_z
                && this.mShiftKey && !this.mCtrlKey && !this.mAltKey && !this.mMetaKey){
                this.mKeyCode -= 32;
            }
            //A ==> a, B ==> a, ...
            if(this.mKeyCode>=KeyEvent.KEYCODE_KeyA && this.mKeyCode<=KeyEvent.KEYCODE_KeyZ
                && !this.mShiftKey && !this.mCtrlKey && !this.mAltKey && !this.mMetaKey){
                this.mKeyCode += 32;
            }
            //key code convert in android chrome
            if(Platform.isAndroid){
                if(!this.mShiftKey && !this.mCtrlKey && !this.mAltKey && !this.mMetaKey){
                    this.mKeyCode = KeyEvent.KEYCODE_CHANGE_ANDROID_CHROME.noMeta[this.mKeyCode] || this.mKeyCode;

                }else if(this.mShiftKey && !this.mCtrlKey && !this.mAltKey && !this.mMetaKey){
                    this.mKeyCode = KeyEvent.KEYCODE_CHANGE_ANDROID_CHROME.shift[this.mKeyCode] || this.mKeyCode;

                }else if(!this.mShiftKey && this.mCtrlKey && !this.mAltKey && !this.mMetaKey){
                    this.mKeyCode = KeyEvent.KEYCODE_CHANGE_ANDROID_CHROME.ctrl[this.mKeyCode] || this.mKeyCode;

                }else if(!this.mShiftKey && !this.mCtrlKey && this.mAltKey && !this.mMetaKey){
                    this.mKeyCode = KeyEvent.KEYCODE_CHANGE_ANDROID_CHROME.alt[this.mKeyCode] || this.mKeyCode;

                }
            }



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
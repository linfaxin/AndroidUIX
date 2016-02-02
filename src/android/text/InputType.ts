///<reference path="../view/KeyEvent.ts"/>

module android.text {
    import KeyEvent = android.view.KeyEvent;

    export enum InputType {
        TYPE_NULL,
        TYPE_CLASS_TEXT,
        TYPE_CLASS_URI,
        TYPE_CLASS_EMAIL_ADDRESS,
        TYPE_CLASS_NUMBER,
        TYPE_CLASS_PHONE,
        TYPE_PASSWORD,
        TYPE_TEXT_PASSWORD,
        TYPE_TEXT_VISIBLE_PASSWORD,
        TYPE_NUMBER_PASSWORD,
        TYPE_NUMBER_SIGNED,
        TYPE_NUMBER_DECIMAL,
    }
    export module InputType {
        export class LimitCode {
            static TYPE_CLASS_NUMBER = [
                KeyEvent.KEYCODE_Digit0,
                KeyEvent.KEYCODE_Digit1,
                KeyEvent.KEYCODE_Digit2,
                KeyEvent.KEYCODE_Digit3,
                KeyEvent.KEYCODE_Digit4,
                KeyEvent.KEYCODE_Digit5,
                KeyEvent.KEYCODE_Digit6,
                KeyEvent.KEYCODE_Digit7,
                KeyEvent.KEYCODE_Digit8,
                KeyEvent.KEYCODE_Digit9,
            ];
            static TYPE_CLASS_PHONE = [
                KeyEvent.KEYCODE_Sharp,
                KeyEvent.KEYCODE_Semicolon,
                KeyEvent.KEYCODE_Asterisk,
                KeyEvent.KEYCODE_Left_Parenthesis,
                KeyEvent.KEYCODE_Right_Parenthesis,
                KeyEvent.KEYCODE_Slash,
                KeyEvent.KEYCODE_KeyN,
                KeyEvent.KEYCODE_Period,
                KeyEvent.KEYCODE_SPACE,
                KeyEvent.KEYCODE_Add,
                KeyEvent.KEYCODE_Minus,
                KeyEvent.KEYCODE_Period,
                KeyEvent.KEYCODE_Digit0,
                KeyEvent.KEYCODE_Digit1,
                KeyEvent.KEYCODE_Digit2,
                KeyEvent.KEYCODE_Digit3,
                KeyEvent.KEYCODE_Digit4,
                KeyEvent.KEYCODE_Digit5,
                KeyEvent.KEYCODE_Digit6,
                KeyEvent.KEYCODE_Digit7,
                KeyEvent.KEYCODE_Digit8,
                KeyEvent.KEYCODE_Digit9,
            ];
            static TYPE_NUMBER_PASSWORD = [
                KeyEvent.KEYCODE_Digit0,
                KeyEvent.KEYCODE_Digit1,
                KeyEvent.KEYCODE_Digit2,
                KeyEvent.KEYCODE_Digit3,
                KeyEvent.KEYCODE_Digit4,
                KeyEvent.KEYCODE_Digit5,
                KeyEvent.KEYCODE_Digit6,
                KeyEvent.KEYCODE_Digit7,
                KeyEvent.KEYCODE_Digit8,
                KeyEvent.KEYCODE_Digit9,
            ];
            static TYPE_NUMBER_SIGNED = [
                KeyEvent.KEYCODE_Minus,
                KeyEvent.KEYCODE_Digit0,
                KeyEvent.KEYCODE_Digit1,
                KeyEvent.KEYCODE_Digit2,
                KeyEvent.KEYCODE_Digit3,
                KeyEvent.KEYCODE_Digit4,
                KeyEvent.KEYCODE_Digit5,
                KeyEvent.KEYCODE_Digit6,
                KeyEvent.KEYCODE_Digit7,
                KeyEvent.KEYCODE_Digit8,
                KeyEvent.KEYCODE_Digit9,
            ];
            static TYPE_NUMBER_DECIMAL = [
                KeyEvent.KEYCODE_Period,
                KeyEvent.KEYCODE_Digit0,
                KeyEvent.KEYCODE_Digit1,
                KeyEvent.KEYCODE_Digit2,
                KeyEvent.KEYCODE_Digit3,
                KeyEvent.KEYCODE_Digit4,
                KeyEvent.KEYCODE_Digit5,
                KeyEvent.KEYCODE_Digit6,
                KeyEvent.KEYCODE_Digit7,
                KeyEvent.KEYCODE_Digit8,
                KeyEvent.KEYCODE_Digit9,
            ];
        }
    }
}
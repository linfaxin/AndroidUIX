///<reference path="../view/KeyEvent.ts"/>

module android.text {
    import KeyEvent = android.view.KeyEvent;

    export class InputType {
        /**
         * Mask of bits that determine the overall class
         * of text being given.  Currently supported classes are:
         * {@link #TYPE_CLASS_TEXT}, {@link #TYPE_CLASS_NUMBER},
         * {@link #TYPE_CLASS_PHONE}, {@link #TYPE_CLASS_DATETIME}.
         * <p>IME authors: If the class is not one you
         * understand, assume {@link #TYPE_CLASS_TEXT} with NO variation
         * or flags.<p>
         */
        static TYPE_MASK_CLASS:number = 0x0000000f;
        /**
         * Mask of bits that determine the variation of
         * the base content class.
         */
        static TYPE_MASK_VARIATION:number = 0x00000ff0;
        /**
         * Mask of bits that provide addition bit flags
         * of options.
         */
        static TYPE_MASK_FLAGS:number = 0x00fff000;
        /**
         * Special content type for when no explicit type has been specified.
         * This should be interpreted to mean that the target input connection
         * is not rich, it can not process and show things like candidate text nor
         * retrieve the current text, so the input method will need to run in a
         * limited "generate key events" mode, if it supports it. Note that some
         * input methods may not support it, for example a voice-based input
         * method will likely not be able to generate key events even if this
         * flag is set.
         */
        static TYPE_NULL:number = 0x00000000;
        // ----------------------------------------------------------------------
        // ----------------------------------------------------------------------
        // ----------------------------------------------------------------------
        /**
         * Class for normal text.  This class supports the following flags (only
         * one of which should be set):
         * {@link #TYPE_TEXT_FLAG_CAP_CHARACTERS},
         * {@link #TYPE_TEXT_FLAG_CAP_WORDS}, and.
         * {@link #TYPE_TEXT_FLAG_CAP_SENTENCES}.  It also supports the
         * following variations:
         * {@link #TYPE_TEXT_VARIATION_NORMAL}, and
         * {@link #TYPE_TEXT_VARIATION_URI}.  If you do not recognize the
         * variation, normal should be assumed.
         */
        static TYPE_CLASS_TEXT:number = 0x00000001;
        /**
         * Flag for {@link #TYPE_CLASS_TEXT}: capitalize all characters.  Overrides
         * {@link #TYPE_TEXT_FLAG_CAP_WORDS} and
         * {@link #TYPE_TEXT_FLAG_CAP_SENTENCES}.  This value is explicitly defined
         * to be the same as {@link TextUtils#CAP_MODE_CHARACTERS}. Of course,
         * this only affects languages where there are upper-case and lower-case letters.
         */
        static TYPE_TEXT_FLAG_CAP_CHARACTERS:number = 0x00001000;
        /**
         * Flag for {@link #TYPE_CLASS_TEXT}: capitalize the first character of
         * every word.  Overrides {@link #TYPE_TEXT_FLAG_CAP_SENTENCES}.  This
         * value is explicitly defined
         * to be the same as {@link TextUtils#CAP_MODE_WORDS}. Of course,
         * this only affects languages where there are upper-case and lower-case letters.
         */
        static TYPE_TEXT_FLAG_CAP_WORDS:number = 0x00002000;
        /**
         * Flag for {@link #TYPE_CLASS_TEXT}: capitalize the first character of
         * each sentence.  This value is explicitly defined
         * to be the same as {@link TextUtils#CAP_MODE_SENTENCES}. For example
         * in English it means to capitalize after a period and a space (note that other
         * languages may have different characters for period, or not use spaces,
         * or use different grammatical rules). Of course,
         * this only affects languages where there are upper-case and lower-case letters.
         */
        static TYPE_TEXT_FLAG_CAP_SENTENCES:number = 0x00004000;
        /**
         * Flag for {@link #TYPE_CLASS_TEXT}: the user is entering free-form
         * text that should have auto-correction applied to it. Without this flag,
         * the IME will not try to correct typos. You should always set this flag
         * unless you really expect users to type non-words in this field, for
         * example to choose a name for a character in a game.
         * Contrast this with {@link #TYPE_TEXT_FLAG_AUTO_COMPLETE} and
         * {@link #TYPE_TEXT_FLAG_NO_SUGGESTIONS}:
         * {@code TYPE_TEXT_FLAG_AUTO_CORRECT} means that the IME will try to
         * auto-correct typos as the user is typing, but does not define whether
         * the IME offers an interface to show suggestions.
         */
        static TYPE_TEXT_FLAG_AUTO_CORRECT:number = 0x00008000;
        /**
         * Flag for {@link #TYPE_CLASS_TEXT}: the text editor (which means
         * the application) is performing auto-completion of the text being entered
         * based on its own semantics, which it will present to the user as they type.
         * This generally means that the input method should not be showing
         * candidates itself, but can expect the editor to supply its own
         * completions/candidates from
         * {@link android.view.inputmethod.InputMethodSession#displayCompletions
     * InputMethodSession.displayCompletions()} as a result of the editor calling
         * {@link android.view.inputmethod.InputMethodManager#displayCompletions
     * InputMethodManager.displayCompletions()}.
         * Note the contrast with {@link #TYPE_TEXT_FLAG_AUTO_CORRECT} and
         * {@link #TYPE_TEXT_FLAG_NO_SUGGESTIONS}:
         * {@code TYPE_TEXT_FLAG_AUTO_COMPLETE} means the editor should show an
         * interface for displaying suggestions, but instead of supplying its own
         * it will rely on the Editor to pass completions/corrections.
         */
        static TYPE_TEXT_FLAG_AUTO_COMPLETE:number = 0x00010000;
        /**
         * Flag for {@link #TYPE_CLASS_TEXT}: multiple lines of text can be
         * entered into the field.  If this flag is not set, the text field
         * will be constrained to a single line. The IME may also choose not to
         * display an enter key when this flag is not set, as there should be no
         * need to create new lines.
         */
        static TYPE_TEXT_FLAG_MULTI_LINE:number = 0x00020000;
        /**
         * Flag for {@link #TYPE_CLASS_TEXT}: the regular text view associated
         * with this should not be multi-line, but when a fullscreen input method
         * is providing text it should use multiple lines if it can.
         */
        static TYPE_TEXT_FLAG_IME_MULTI_LINE:number = 0x00040000;
        /**
         * Flag for {@link #TYPE_CLASS_TEXT}: the input method does not need to
         * display any dictionary-based candidates. This is useful for text views that
         * do not contain words from the language and do not benefit from any
         * dictionary-based completions or corrections. It overrides the
         * {@link #TYPE_TEXT_FLAG_AUTO_CORRECT} value when set.
         * Please avoid using this unless you are certain this is what you want.
         * Many input methods need suggestions to work well, for example the ones
         * based on gesture typing. Consider clearing
         * {@link #TYPE_TEXT_FLAG_AUTO_CORRECT} instead if you just do not
         * want the IME to correct typos.
         * Note the contrast with {@link #TYPE_TEXT_FLAG_AUTO_CORRECT} and
         * {@link #TYPE_TEXT_FLAG_AUTO_COMPLETE}:
         * {@code TYPE_TEXT_FLAG_NO_SUGGESTIONS} means the IME should never
         * show an interface to display suggestions. Most IMEs will also take this to
         * mean they should not try to auto-correct what the user is typing.
         */
        static TYPE_TEXT_FLAG_NO_SUGGESTIONS:number = 0x00080000;
        // ----------------------------------------------------------------------
        /**
         * Default variation of {@link #TYPE_CLASS_TEXT}: plain old normal text.
         */
        static TYPE_TEXT_VARIATION_NORMAL:number = 0x00000000;
        /**
         * Variation of {@link #TYPE_CLASS_TEXT}: entering a URI.
         */
        static TYPE_TEXT_VARIATION_URI:number = 0x00000010;
        /**
         * Variation of {@link #TYPE_CLASS_TEXT}: entering an e-mail address.
         */
        static TYPE_TEXT_VARIATION_EMAIL_ADDRESS:number = 0x00000020;
        /**
         * Variation of {@link #TYPE_CLASS_TEXT}: entering the subject line of
         * an e-mail.
         */
        static TYPE_TEXT_VARIATION_EMAIL_SUBJECT:number = 0x00000030;
        /**
         * Variation of {@link #TYPE_CLASS_TEXT}: entering a short, possibly informal
         * message such as an instant message or a text message.
         */
        static TYPE_TEXT_VARIATION_SHORT_MESSAGE:number = 0x00000040;
        /**
         * Variation of {@link #TYPE_CLASS_TEXT}: entering the content of a long, possibly
         * formal message such as the body of an e-mail.
         */
        static TYPE_TEXT_VARIATION_LONG_MESSAGE:number = 0x00000050;
        /**
         * Variation of {@link #TYPE_CLASS_TEXT}: entering the name of a person.
         */
        static TYPE_TEXT_VARIATION_PERSON_NAME:number = 0x00000060;
        /**
         * Variation of {@link #TYPE_CLASS_TEXT}: entering a postal mailing address.
         */
        static TYPE_TEXT_VARIATION_POSTAL_ADDRESS:number = 0x00000070;
        /**
         * Variation of {@link #TYPE_CLASS_TEXT}: entering a password.
         */
        static TYPE_TEXT_VARIATION_PASSWORD:number = 0x00000080;
        /**
         * Variation of {@link #TYPE_CLASS_TEXT}: entering a password, which should
         * be visible to the user.
         */
        static TYPE_TEXT_VARIATION_VISIBLE_PASSWORD:number = 0x00000090;
        /**
         * Variation of {@link #TYPE_CLASS_TEXT}: entering text inside of a web form.
         */
        static TYPE_TEXT_VARIATION_WEB_EDIT_TEXT:number = 0x000000a0;
        /**
         * Variation of {@link #TYPE_CLASS_TEXT}: entering text to filter contents
         * of a list etc.
         */
        static TYPE_TEXT_VARIATION_FILTER:number = 0x000000b0;
        /**
         * Variation of {@link #TYPE_CLASS_TEXT}: entering text for phonetic
         * pronunciation, such as a phonetic name field in contacts. This is mostly
         * useful for languages where one spelling may have several phonetic
         * readings, like Japanese.
         */
        static TYPE_TEXT_VARIATION_PHONETIC:number = 0x000000c0;
        /**
         * Variation of {@link #TYPE_CLASS_TEXT}: entering e-mail address inside
         * of a web form.  This was added in
         * {@link android.os.Build.VERSION_CODES#HONEYCOMB}.  An IME must target
         * this API version or later to see this input type; if it doesn't, a request
         * for this type will be seen as {@link #TYPE_TEXT_VARIATION_EMAIL_ADDRESS}
         * when passed through {@link android.view.inputmethod.EditorInfo#makeCompatible(int)
     * EditorInfo.makeCompatible(int)}.
         */
        static TYPE_TEXT_VARIATION_WEB_EMAIL_ADDRESS:number = 0x000000d0;
        /**
         * Variation of {@link #TYPE_CLASS_TEXT}: entering password inside
         * of a web form.  This was added in
         * {@link android.os.Build.VERSION_CODES#HONEYCOMB}.  An IME must target
         * this API version or later to see this input type; if it doesn't, a request
         * for this type will be seen as {@link #TYPE_TEXT_VARIATION_PASSWORD}
         * when passed through {@link android.view.inputmethod.EditorInfo#makeCompatible(int)
     * EditorInfo.makeCompatible(int)}.
         */
        static TYPE_TEXT_VARIATION_WEB_PASSWORD:number = 0x000000e0;
        // ----------------------------------------------------------------------
        // ----------------------------------------------------------------------
        // ----------------------------------------------------------------------
        /**
         * Class for numeric text.  This class supports the following flags:
         * {@link #TYPE_NUMBER_FLAG_SIGNED} and
         * {@link #TYPE_NUMBER_FLAG_DECIMAL}.  It also supports the following
         * variations: {@link #TYPE_NUMBER_VARIATION_NORMAL} and
         * {@link #TYPE_NUMBER_VARIATION_PASSWORD}.
         * <p>IME authors: If you do not recognize
         * the variation, normal should be assumed.</p>
         */
        static TYPE_CLASS_NUMBER:number = 0x00000002;
        /**
         * Flag of {@link #TYPE_CLASS_NUMBER}: the number is signed, allowing
         * a positive or negative sign at the start.
         */
        static TYPE_NUMBER_FLAG_SIGNED:number = 0x00001000;
        /**
         * Flag of {@link #TYPE_CLASS_NUMBER}: the number is decimal, allowing
         * a decimal point to provide fractional values.
         */
        static TYPE_NUMBER_FLAG_DECIMAL:number = 0x00002000;// ----------------------------------------------------------------------
        /**
         * Default variation of {@link #TYPE_CLASS_NUMBER}: plain normal
         * numeric text.  This was added in
         * {@link android.os.Build.VERSION_CODES#HONEYCOMB}.  An IME must target
         * this API version or later to see this input type; if it doesn't, a request
         * for this type will be dropped when passed through
         * {@link android.view.inputmethod.EditorInfo#makeCompatible(int)
     * EditorInfo.makeCompatible(int)}.
         */
        static TYPE_NUMBER_VARIATION_NORMAL:number = 0x00000000;
        /**
         * Variation of {@link #TYPE_CLASS_NUMBER}: entering a numeric password.
         * This was added in {@link android.os.Build.VERSION_CODES#HONEYCOMB}.  An
         * IME must target this API version or later to see this input type; if it
         * doesn't, a request for this type will be dropped when passed
         * through {@link android.view.inputmethod.EditorInfo#makeCompatible(int)
     * EditorInfo.makeCompatible(int)}.
         */
        static TYPE_NUMBER_VARIATION_PASSWORD:number = 0x00000010;
        // ----------------------------------------------------------------------
        // ----------------------------------------------------------------------
        // ----------------------------------------------------------------------
        /**
         * Class for a phone number.  This class currently supports no variations
         * or flags.
         */
        static TYPE_CLASS_PHONE:number = 0x00000003;
        // ----------------------------------------------------------------------
        // ----------------------------------------------------------------------
        // ----------------------------------------------------------------------
        /**
         * Class for dates and times.  It supports the
         * following variations:
         * {@link #TYPE_DATETIME_VARIATION_NORMAL}
         * {@link #TYPE_DATETIME_VARIATION_DATE}, and
         * {@link #TYPE_DATETIME_VARIATION_TIME}.
         */
        static TYPE_CLASS_DATETIME:number = 0x00000004;
        /**
         * Default variation of {@link #TYPE_CLASS_DATETIME}: allows entering
         * both a date and time.
         */
        static TYPE_DATETIME_VARIATION_NORMAL:number = 0x00000000;
        /**
         * Default variation of {@link #TYPE_CLASS_DATETIME}: allows entering
         * only a date.
         */
        static TYPE_DATETIME_VARIATION_DATE:number = 0x00000010;
        /**
         * Default variation of {@link #TYPE_CLASS_DATETIME}: allows entering
         * only a time.
         */
        static TYPE_DATETIME_VARIATION_TIME:number = 0x00000020;
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
                KeyEvent.KEYCODE_Comma,
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
        }
    }
}
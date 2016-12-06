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

///<reference path="../../android/R/attr.ts"/>
///<reference path="../../android/R/color.ts"/>
///<reference path="../../android/R/drawable.ts"/>
///<reference path="../../android/R/string.ts"/>
///<reference path="../../android/content/res/ColorStateList.ts"/>
///<reference path="../../android/content/res/Resources.ts"/>
///<reference path="../../android/graphics/Canvas.ts"/>
///<reference path="../../android/graphics/Paint.ts"/>
///<reference path="../../android/graphics/Path.ts"/>
///<reference path="../../android/graphics/Rect.ts"/>
///<reference path="../../android/graphics/RectF.ts"/>
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/os/Handler.ts"/>
///<reference path="../../android/os/Message.ts"/>
///<reference path="../../android/os/SystemClock.ts"/>
///<reference path="../../android/text/BoringLayout.ts"/>
///<reference path="../../android/text/DynamicLayout.ts"/>
///<reference path="../../android/text/InputType.ts"/>
///<reference path="../../android/text/Layout.ts"/>
///<reference path="../../android/text/SpanWatcher.ts"/>
///<reference path="../../android/text/Spannable.ts"/>
///<reference path="../../android/text/Spanned.ts"/>
///<reference path="../../android/text/StaticLayout.ts"/>
///<reference path="../../android/text/TextDirectionHeuristic.ts"/>
///<reference path="../../android/text/TextDirectionHeuristics.ts"/>
///<reference path="../../android/text/TextPaint.ts"/>
///<reference path="../../android/text/TextUtils.ts"/>
///<reference path="../../android/text/TextWatcher.ts"/>
///<reference path="../../android/text/method/AllCapsTransformationMethod.ts"/>
///<reference path="../../android/text/method/MovementMethod.ts"/>
///<reference path="../../android/text/method/SingleLineTransformationMethod.ts"/>
///<reference path="../../android/text/method/TransformationMethod.ts"/>
///<reference path="../../android/text/method/TransformationMethod2.ts"/>
///<reference path="../../android/text/style/CharacterStyle.ts"/>
///<reference path="../../android/text/style/ParagraphStyle.ts"/>
///<reference path="../../android/text/style/UpdateAppearance.ts"/>
///<reference path="../../android/util/Log.ts"/>
///<reference path="../../android/util/TypedValue.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/view/HapticFeedbackConstants.ts"/>
///<reference path="../../android/view/KeyEvent.ts"/>
///<reference path="../../android/view/MotionEvent.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewConfiguration.ts"/>
///<reference path="../../android/view/ViewRootImpl.ts"/>
///<reference path="../../android/view/ViewTreeObserver.ts"/>
///<reference path="../../android/view/animation/AnimationUtils.ts"/>
///<reference path="../../java/lang/ref/WeakReference.ts"/>
///<reference path="../../java/util/ArrayList.ts"/>
///<reference path="../../java/lang/Integer.ts"/>
///<reference path="../../java/lang/System.ts"/>
///<reference path="../../java/lang/Runnable.ts"/>
///<reference path="../../android/widget/OverScroller.ts"/>
///<reference path="../../androidui/image/NetDrawable.ts"/>

module android.widget {
import R = android.R;
import ColorStateList = android.content.res.ColorStateList;
import Resources = android.content.res.Resources;
import Canvas = android.graphics.Canvas;
import Paint = android.graphics.Paint;
import Path = android.graphics.Path;
import Rect = android.graphics.Rect;
import Color = android.graphics.Color;
import RectF = android.graphics.RectF;
import Drawable = android.graphics.drawable.Drawable;
import Handler = android.os.Handler;
import Message = android.os.Message;
import SystemClock = android.os.SystemClock;
import BoringLayout = android.text.BoringLayout;
import DynamicLayout = android.text.DynamicLayout;
import InputType = android.text.InputType;
import Layout = android.text.Layout;
import SpanWatcher = android.text.SpanWatcher;
import Spannable = android.text.Spannable;
import Spanned = android.text.Spanned;
import StaticLayout = android.text.StaticLayout;
import TextDirectionHeuristic = android.text.TextDirectionHeuristic;
import TextDirectionHeuristics = android.text.TextDirectionHeuristics;
import TextPaint = android.text.TextPaint;
import TextUtils = android.text.TextUtils;
import TruncateAt = android.text.TextUtils.TruncateAt;
import TextWatcher = android.text.TextWatcher;
import AllCapsTransformationMethod = android.text.method.AllCapsTransformationMethod;
import MovementMethod = android.text.method.MovementMethod;
import SingleLineTransformationMethod = android.text.method.SingleLineTransformationMethod;
import TransformationMethod = android.text.method.TransformationMethod;
import TransformationMethod2 = android.text.method.TransformationMethod2;
import CharacterStyle = android.text.style.CharacterStyle;
import ParagraphStyle = android.text.style.ParagraphStyle;
import UpdateAppearance = android.text.style.UpdateAppearance;
import Log = android.util.Log;
import TypedValue = android.util.TypedValue;
import Gravity = android.view.Gravity;
import HapticFeedbackConstants = android.view.HapticFeedbackConstants;
import KeyEvent = android.view.KeyEvent;
import MotionEvent = android.view.MotionEvent;
import View = android.view.View;
import ViewConfiguration = android.view.ViewConfiguration;
import LayoutParams = android.view.ViewGroup.LayoutParams;
import ViewRootImpl = android.view.ViewRootImpl;
import ViewTreeObserver = android.view.ViewTreeObserver;
import AnimationUtils = android.view.animation.AnimationUtils;
import WeakReference = java.lang.ref.WeakReference;
import ArrayList = java.util.ArrayList;
import Integer = java.lang.Integer;
import System = java.lang.System;
import Runnable = java.lang.Runnable;
import OverScroller = android.widget.OverScroller;
import NetDrawable = androidui.image.NetDrawable;
import AttrBinder = androidui.attr.AttrBinder;

/**
 * Displays text to the user and optionally allows them to edit it.  A TextView
 * is a complete text editor, however the basic class is configured to not
 * allow editing; see {@link EditText} for a subclass that configures the text
 * view for editing.
 *
 * <p>
 * To allow users to copy some or all of the TextView's value and paste it somewhere else, set the
 * XML attribute {@link android.R.styleable#TextView_textIsSelectable
 * android:textIsSelectable} to "true" or call
 * {@link #setTextIsSelectable setTextIsSelectable(true)}. The {@code textIsSelectable} flag
 * allows users to make selection gestures in the TextView, which in turn triggers the system's
 * built-in copy/paste controls.
 * <p>
 * <b>XML attributes</b>
 * <p>
 * See {@link android.R.styleable#TextView TextView Attributes},
 * {@link android.R.styleable#View View Attributes}
 *
 * @attr ref android.R.styleable#TextView_text
 * @attr ref android.R.styleable#TextView_bufferType
 * @attr ref android.R.styleable#TextView_hint
 * @attr ref android.R.styleable#TextView_textColor
 * @attr ref android.R.styleable#TextView_textColorHighlight
 * @attr ref android.R.styleable#TextView_textColorHint
 * @attr ref android.R.styleable#TextView_textAppearance
 * @attr ref android.R.styleable#TextView_textColorLink
 * @attr ref android.R.styleable#TextView_textSize
 * @attr ref android.R.styleable#TextView_textScaleX
 * @attr ref android.R.styleable#TextView_fontFamily
 * @attr ref android.R.styleable#TextView_typeface
 * @attr ref android.R.styleable#TextView_textStyle
 * @attr ref android.R.styleable#TextView_cursorVisible
 * @attr ref android.R.styleable#TextView_maxLines
 * @attr ref android.R.styleable#TextView_maxHeight
 * @attr ref android.R.styleable#TextView_lines
 * @attr ref android.R.styleable#TextView_height
 * @attr ref android.R.styleable#TextView_minLines
 * @attr ref android.R.styleable#TextView_minHeight
 * @attr ref android.R.styleable#TextView_maxEms
 * @attr ref android.R.styleable#TextView_maxWidth
 * @attr ref android.R.styleable#TextView_ems
 * @attr ref android.R.styleable#TextView_width
 * @attr ref android.R.styleable#TextView_minEms
 * @attr ref android.R.styleable#TextView_minWidth
 * @attr ref android.R.styleable#TextView_gravity
 * @attr ref android.R.styleable#TextView_scrollHorizontally
 * @attr ref android.R.styleable#TextView_password
 * @attr ref android.R.styleable#TextView_singleLine
 * @attr ref android.R.styleable#TextView_selectAllOnFocus
 * @attr ref android.R.styleable#TextView_includeFontPadding
 * @attr ref android.R.styleable#TextView_maxLength
 * @attr ref android.R.styleable#TextView_shadowColor
 * @attr ref android.R.styleable#TextView_shadowDx
 * @attr ref android.R.styleable#TextView_shadowDy
 * @attr ref android.R.styleable#TextView_shadowRadius
 * @attr ref android.R.styleable#TextView_autoLink
 * @attr ref android.R.styleable#TextView_linksClickable
 * @attr ref android.R.styleable#TextView_numeric
 * @attr ref android.R.styleable#TextView_digits
 * @attr ref android.R.styleable#TextView_phoneNumber
 * @attr ref android.R.styleable#TextView_inputMethod
 * @attr ref android.R.styleable#TextView_capitalize
 * @attr ref android.R.styleable#TextView_autoText
 * @attr ref android.R.styleable#TextView_editable
 * @attr ref android.R.styleable#TextView_freezesText
 * @attr ref android.R.styleable#TextView_ellipsize
 * @attr ref android.R.styleable#TextView_drawableTop
 * @attr ref android.R.styleable#TextView_drawableBottom
 * @attr ref android.R.styleable#TextView_drawableRight
 * @attr ref android.R.styleable#TextView_drawableLeft
 * @attr ref android.R.styleable#TextView_drawableStart
 * @attr ref android.R.styleable#TextView_drawableEnd
 * @attr ref android.R.styleable#TextView_drawablePadding
 * @attr ref android.R.styleable#TextView_lineSpacingExtra
 * @attr ref android.R.styleable#TextView_lineSpacingMultiplier
 * @attr ref android.R.styleable#TextView_marqueeRepeatLimit
 * @attr ref android.R.styleable#TextView_inputType
 * @attr ref android.R.styleable#TextView_imeOptions
 * @attr ref android.R.styleable#TextView_privateImeOptions
 * @attr ref android.R.styleable#TextView_imeActionLabel
 * @attr ref android.R.styleable#TextView_imeActionId
 * @attr ref android.R.styleable#TextView_editorExtras
 */
export class TextView extends View implements ViewTreeObserver.OnPreDrawListener {

    static LOG_TAG:string = "TextView";

    static DEBUG_EXTRACT:boolean = false;

    // Enum for the "typeface" XML parameter.
    // TODO: How can we get this from the XML instead of hardcoding it here?
    private static SANS:number = 1;

    private static SERIF:number = 2;

    private static MONOSPACE:number = 3;

    // Bitfield for the "numeric" XML parameter.
    // TODO: How can we get this from the XML instead of hardcoding it here?
    private static SIGNED:number = 2;

    private static DECIMAL:number = 4;

    /**
     * Draw marquee text with fading edges as usual
     */
    private static MARQUEE_FADE_NORMAL:number = 0;

    /**
     * Draw marquee text as ellipsize end while inactive instead of with the fade.
     * (Useful for devices where the fade can be expensive if overdone)
     */
    private static MARQUEE_FADE_SWITCH_SHOW_ELLIPSIS:number = 1;

    /**
     * Draw marquee text with fading edges because it is currently active/animating.
     */
    private static MARQUEE_FADE_SWITCH_SHOW_FADE:number = 2;

    private static LINES:number = 1;

    private static EMS:number = TextView.LINES;

    private static PIXELS:number = 2;

    private static TEMP_RECTF:RectF = new RectF();

    // XXX should be much larger
    private static VERY_WIDE:number = 1024 * 1024;

    private static ANIMATED_SCROLL_GAP:number = 250;

    private static NO_FILTERS = new Array<any>(0);

    //private static EMPTY_SPANNED:Spanned = new SpannedString("");

    private static CHANGE_WATCHER_PRIORITY:number = 100;

    // New state used to change background based on whether this TextView is multiline.
    private static MULTILINE_STATE_SET:number[] = [ View.VIEW_STATE_MULTILINE ];

    // System wide time for last cut or copy action.
    static LAST_CUT_OR_COPY_TIME:number = 0;

    private mTextColor:ColorStateList = ColorStateList.valueOf(Color.BLACK);

    private mHintTextColor:ColorStateList;

    private mLinkTextColor:ColorStateList;

    private mCurTextColor:number = 0;

    private mCurHintTextColor:number = 0;

    private mFreezesText:boolean;

    private mTemporaryDetach:boolean;

    private mDispatchTemporaryDetach:boolean;

    //private mEditableFactory:Editable.Factory = Editable.Factory.getInstance();

    private mSpannableFactory:Spannable.Factory = Spannable.Factory.getInstance();

    private mShadowRadius:number = 0;
    private mShadowDx:number = 0;
    private mShadowDy:number = 0;

    private mPreDrawRegistered:boolean;

    // A flag to prevent repeated movements from escaping the enclosing text view. The idea here is
    // that if a user is holding down a movement key to traverse text, we shouldn't also traverse
    // the view hierarchy. On the other hand, if the user is using the movement key to traverse views
    // (i.e. the first movement was to traverse out of this view, or this view was traversed into by
    // the user holding the movement key down) then we shouldn't prevent the focus from changing.
    private mPreventDefaultMovement:boolean;

    private mEllipsize:TextUtils.TruncateAt;



    mDrawables:TextView.Drawables;

    //private mCharWrapper:TextView.CharWrapper;

    private mMarquee:TextView.Marquee;

    private mRestartMarquee:boolean;

    private mMarqueeRepeatLimit:number = 3;

    private mLastLayoutDirection:number = -1;

    /**
     * On some devices the fading edges add a performance penalty if used
     * extensively in the same layout. This mode indicates how the marquee
     * is currently being shown, if applicable. (mEllipsize will == MARQUEE)
     */
    private mMarqueeFadeMode:number = TextView.MARQUEE_FADE_NORMAL;

    /**
     * When mMarqueeFadeMode is not MARQUEE_FADE_NORMAL, this stores
     * the layout that should be used when the mode switches.
     */
    private mSavedMarqueeModeLayout:Layout;

    private mText:String;

    private mTransformed:String;

    private mBufferType:TextView.BufferType = TextView.BufferType.NORMAL;

    private mHint:String;

    private mHintLayout:Layout;

    private mMovement:MovementMethod;

    private mTransformation:TransformationMethod;

    private mAllowTransformationLengthChange:boolean;

    private mChangeWatcher:TextView.ChangeWatcher;

    private mListeners:ArrayList<TextWatcher>;

    // display attributes
    private mTextPaint:TextPaint;

    private mUserSetTextScaleX:boolean;

    private mLayout:Layout;

    private mGravity:number = Gravity.TOP | Gravity.LEFT;

    private mHorizontallyScrolling:boolean;

    private mAutoLinkMask:number = 0;

    private mLinksClickable:boolean = true;

    private mSpacingMult:number = 1.0;

    private mSpacingAdd:number = 0.0;

    private mMaximum:number = Integer.MAX_VALUE;

    private mMaxMode:number = TextView.LINES;

    private mMinimum:number = 0;

    private mMinMode:number = TextView.LINES;

    private mOldMaximum:number = this.mMaximum;

    private mOldMaxMode:number = this.mMaxMode;

    private mMaxWidthValue:number = Integer.MAX_VALUE;

    private mMaxWidthMode:number = TextView.PIXELS;

    private mMinWidthValue:number = 0;

    private mMinWidthMode:number = TextView.PIXELS;

    private mSingleLine:boolean;

    private mDesiredHeightAtMeasure:number = -1;

    private mIncludePad:boolean = true;

    private mDeferScroll:number = -1;

    // tmp primitives, so we don't alloc them on each draw
    private mTempRect:Rect;

    private mLastScroll:number = 0;

    private mScroller:OverScroller;

    private mBoring:BoringLayout.Metrics;
    private mHintBoring:BoringLayout.Metrics;

    private mSavedLayout:BoringLayout;
    private mSavedHintLayout:BoringLayout;

    private mTextDir:TextDirectionHeuristic;

    private mFilters = TextView.NO_FILTERS;

    //private mCurrentSpellCheckerLocaleCache:Locale;

    // It is possible to have a selection even when mEditor is null (programmatically set, like when
    // a link is pressed). These highlight-related fields do not go in mEditor.
    mHighlightColor:number = 0x6633B5E5;

    private mHighlightPath:Path;

    private mHighlightPaint:Paint;

    private mHighlightPathBogus:boolean = true;

    // Although these fields are specific to editable text, they are not added to Editor because
    // they are defined by the TextView's style and are theme-dependent.
    mCursorDrawableRes:number = 0;

    // These four fields, could be moved to Editor, since we know their default values and we
    // could condition the creation of the Editor to a non standard value. This is however
    // brittle since the hardcoded values here (such as
    // com.android.internal.R.drawable.text_select_handle_left) would have to be updated if the
    // default style is modified.
    mTextSelectHandleLeftRes:number = 0;

    mTextSelectHandleRightRes:number = 0;

    mTextSelectHandleRes:number = 0;

    mTextEditSuggestionItemLayout:number = 0;

    /**
     * EditText specific data, created on demand when one of the Editor fields is used.
     * See {@link #createEditorIfNeeded()}.
     */
    private mEditor:any;

    //androidui: flag will set to true when editing.
    protected mSkipDrawText = false;

    /*
     * Kick-start the font cache for the zygote process (to pay the cost of
     * initializing freetype for our default font only once).
     */
    //static {
    //    let p:Paint = new Paint();
    //    p.setAntiAlias(true);
    //    // We don't care about the result, just the side-effect of measuring.
    //    p.measureText("H");
    //}

    constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle=android.R.attr.textViewStyle){
        super(context, bindElement, defStyle);

        this.mText = "";

        // const res = this.getResources();
        // const compat = res.getCompatibilityInfo();

        this.mTextPaint = new TextPaint(Paint.ANTI_ALIAS_FLAG);
        // this.mTextPaint.density = res.getDisplayMetrics().density;
        // mTextPaint.setCompatibilityScaling(compat.applicationScale);

        this.mHighlightPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        // mHighlightPaint.setCompatibilityScaling(compat.applicationScale);

        this.mMovement = this.getDefaultMovementMethod();

        this.mTransformation = null;

        let textColorHighlight = 0;
        let textColor:ColorStateList = null;
        let textColorHint:ColorStateList = null;
        let textColorLink:ColorStateList = null;
        let textSize = 15;
        // let fontFamily:string = null;
        // let typefaceIndex = -1;
        // let styleIndex = -1;
        let allCaps = false;
        let shadowcolor = 0;
        let dx = 0, dy = 0, r = 0;

        /*
         * Look the appearance up without checking first if it exists because
         * almost every TextView has one and it greatly simplifies the logic
         * to be able to parse the appearance first and then let specific tags
         * for this View override it.
         * AndroidUIX note : not support text appearance now.
         */
        // let a = context.obtainStyledAttributes(bindElement, defStyle);
        // let appearance = context.obtainStyledAttributes(bindElement, defStyle);
        // let appearance:android.content.res.TypedArray = null;
        // let ap = a.getString('textAppearance');
        // a.recycle();
        // if (ap) {
        //     appearance = theme.obtainStyledAttributes(
        //         ap, com.android.internal.R.styleable.TextAppearance);
        // }
        // if (appearance != null) {
        //     for (let attr of appearance.getLowerCaseAttrNames()) {
        //         switch (attr) {
        //             case 'textcolorhighlight':
        //                 textColorHighlight = appearance.getColor(attr, textColorHighlight);
        //                 break;
        //
        //             case 'textcolor':
        //                 textColor = appearance.getColorStateList(attr);
        //                 break;
        //
        //             case 'textcolorhint':
        //                 textColorHint = appearance.getColorStateList(attr);
        //                 break;
        //
        //             case 'textcolorlink':
        //                 textColorLink = appearance.getColorStateList(attr);
        //                 break;
        //
        //             case 'textsize':
        //                 textSize = appearance.getDimensionPixelSize(attr, textSize);
        //                 break;
        //
        //             case 'typeface':
        //                 typefaceIndex = appearance.getInt(attr, -1);
        //                 break;
        //
        //             case 'fontfamily':
        //                 fontFamily = appearance.getString(attr);
        //                 break;
        //
        //             case 'textstyle':
        //                 styleIndex = appearance.getInt(attr, -1);
        //                 break;
        //
        //             case 'textallcaps':
        //                 allCaps = appearance.getBoolean(attr, false);
        //                 break;
        //
        //             case 'shadowcolor':
        //                 shadowcolor = appearance.getInt(attr, 0);
        //                 break;
        //
        //             case 'shadowdx':
        //                 dx = appearance.getFloat(attr, 0);
        //                 break;
        //
        //             case 'shadowdy':
        //                 dy = appearance.getFloat(attr, 0);
        //                 break;
        //
        //             case 'shadowradius':
        //                 r = appearance.getFloat(attr, 0);
        //                 break;
        //         }
        //
        //         appearance.recycle();
        //     }
        // }

        let editable = this.getDefaultEditable();
        // let inputMethod:String = null;
        let numeric = 0;
        let digits:String = null;
        // let phone = false;
        // let autotext = false;
        // let autocap = -1;
        // let buffertype = 0;
        // let selectallonfocus = false;
        let drawableLeft:Drawable = null, drawableTop:Drawable = null, drawableRight:Drawable = null,
            drawableBottom:Drawable = null, drawableStart:Drawable = null, drawableEnd:Drawable = null;
        let drawablePadding = 0;
        let ellipsize:TextUtils.TruncateAt;
        let singleLine = false;
        let maxlength = -1;
        let text = "";
        let hint = null;
        // let password = false;
        // let inputType = 0; // EditorInfo.TYPE_NULL;

        let a = context.obtainStyledAttributes(bindElement, defStyle);

        for (let attr of a.getLowerCaseAttrNames()) {
            switch (attr) {
                case 'editable':
                    editable = a.getBoolean(attr, editable);
                    break;

                case 'inputmethod':
                    // inputMethod = a.getText(attr);
                    break;

                case 'numeric':
                    numeric = a.getInt(attr, numeric);
                    break;

                case 'digits':
                    digits = a.getText(attr);
                    break;

                case 'phonenumber':
                    // phone = a.getBoolean(attr, phone);
                    break;

                case 'autotext':
                    // autotext = a.getBoolean(attr, autotext);
                    break;

                case 'capitalize':
                    // autocap = a.getInt(attr, autocap);
                    break;

                case 'buffertype':
                    // buffertype = a.getInt(attr, buffertype);
                    break;

                case 'selectallonfocus':
                    // selectallonfocus = a.getBoolean(attr, selectallonfocus);
                    break;

                case 'autolink':
                    this.mAutoLinkMask = a.getInt(attr, 0);
                    break;

                case 'linksclickable':
                    this.mLinksClickable = a.getBoolean(attr, true);
                    break;

                case 'drawableleft':
                    drawableLeft = a.getDrawable(attr);
                    break;

                case 'drawabletop':
                    drawableTop = a.getDrawable(attr);
                    break;

                case 'drawableright':
                    drawableRight = a.getDrawable(attr);
                    break;

                case 'drawablebottom':
                    drawableBottom = a.getDrawable(attr);
                    break;

                case 'drawablestart':
                    drawableStart = a.getDrawable(attr);
                    break;

                case 'drawableend':
                    drawableEnd = a.getDrawable(attr);
                    break;

                case 'drawablepadding':
                    drawablePadding = a.getDimensionPixelSize(attr, drawablePadding);
                    break;

                case 'maxlines':
                    this.setMaxLines(a.getInt(attr, -1));
                    break;

                case 'maxheight':
                    this.setMaxHeight(a.getDimensionPixelSize(attr, -1));
                    break;

                case 'lines':
                    this.setLines(a.getInt(attr, -1));
                    break;

                case 'height':
                    this.setHeight(a.getDimensionPixelSize(attr, -1));
                    break;

                case 'minlines':
                    this.setMinLines(a.getInt(attr, -1));
                    break;

                case 'minheight':
                    this.setMinHeight(a.getDimensionPixelSize(attr, -1));
                    break;

                case 'maxems':
                    this.setMaxEms(a.getInt(attr, -1));
                    break;

                case 'maxwidth':
                    this.setMaxWidth(a.getDimensionPixelSize(attr, -1));
                    break;

                case 'ems':
                    this.setEms(a.getInt(attr, -1));
                    break;

                case 'width':
                    this.setWidth(a.getDimensionPixelSize(attr, -1));
                    break;

                case 'minems':
                    this.setMinEms(a.getInt(attr, -1));
                    break;

                case 'minwidth':
                    this.setMinWidth(a.getDimensionPixelSize(attr, -1));
                    break;

                case 'gravity':
                    this.setGravity(Gravity.parseGravity(a.getAttrValue(attr), -1));
                    break;

                case 'hint':
                    hint = a.getText(attr);
                    break;

                case 'text':
                    text = a.getText(attr);
                    break;

                case 'scrollhorizontally':
                    if (a.getBoolean(attr, false)) {
                        this.setHorizontallyScrolling(true);
                    }
                    break;

                case 'singleline':
                    singleLine = a.getBoolean(attr, singleLine);
                    break;

                case 'ellipsize':
                    ellipsize = TextUtils.TruncateAt[(a.getAttrValue(attr) + '').toUpperCase()];
                    break;

                case 'marqueerepeatlimit':
                    this.setMarqueeRepeatLimit(a.getInt(attr, this.mMarqueeRepeatLimit));
                    break;

                case 'includefontpadding':
                    if (!a.getBoolean(attr, true)) {
                        this.setIncludeFontPadding(false);
                    }
                    break;

                case 'cursorvisible':
                    if (!a.getBoolean(attr, true)) {
                        this.setCursorVisible(false);
                    }
                    break;

                case 'maxlength':
                    maxlength = a.getInt(attr, -1);
                    break;

                case 'textscalex':
                    this.setTextScaleX(a.getFloat(attr, 1.0));
                    break;

                case 'freezestext':
                    this.mFreezesText = a.getBoolean(attr, false);
                    break;

                case 'shadowcolor':
                    shadowcolor = a.getInt(attr, 0);
                    break;

                case 'shadowdx':
                    dx = a.getFloat(attr, 0);
                    break;

                case 'shadowdy':
                    dy = a.getFloat(attr, 0);
                    break;

                case 'shadowradius':
                    r = a.getFloat(attr, 0);
                    break;

                case 'enabled':
                    this.setEnabled(a.getBoolean(attr, this.isEnabled()));
                    break;

                case 'textcolorhighlight':
                    textColorHighlight = a.getColor(attr, textColorHighlight);
                    break;

                case 'textcolor':
                    textColor = a.getColorStateList(attr);
                    break;

                case 'textcolorhint':
                    textColorHint = a.getColorStateList(attr);
                    break;

                case 'textcolorlink':
                    textColorLink = a.getColorStateList(attr);
                    break;

                case 'textsize':
                    textSize = a.getDimensionPixelSize(attr, textSize);
                    break;

                case 'typeface':
                    // typefaceIndex = a.getInt(attr, typefaceIndex);
                    break;

                case 'textstyle':
                    // styleIndex = a.getInt(attr, styleIndex);
                    break;

                case 'fontfamily':
                    // fontFamily = a.getString(attr);
                    break;

                case 'password':
                    // password = a.getBoolean(attr, password);
                    break;

                case 'linespacingextra':
                    this.mSpacingAdd = a.getDimensionPixelSize(attr, Math.floor(this.mSpacingAdd));
                    break;

                case 'linespacingmultiplier':
                    this.mSpacingMult = a.getFloat(attr, this.mSpacingMult);
                    break;

                case 'inputtype':
                    // inputType = a.getInt(attr, EditorInfo.TYPE_NULL);
                    break;

                case 'imeoptions':
                    // createEditorIfNeeded();
                    // mEditor.createInputContentTypeIfNeeded();
                    // mEditor.mInputContentType.imeOptions = a.getInt(attr,
                    //     mEditor.mInputContentType.imeOptions);
                    break;

                case 'imeactionlabel':
                    // createEditorIfNeeded();
                    // mEditor.createInputContentTypeIfNeeded();
                    // mEditor.mInputContentType.imeActionLabel = a.getText(attr);
                    break;

                case 'imeactionid':
                    // createEditorIfNeeded();
                    // mEditor.createInputContentTypeIfNeeded();
                    // mEditor.mInputContentType.imeActionId = a.getInt(attr,
                    //     mEditor.mInputContentType.imeActionId);
                    break;

                case 'privateimeoptions':
                    // this.setPrivateImeOptions(a.getString(attr));
                    break;

                case 'editorextras':
                    // try {
                    //     this.setInputExtras(a.getResourceId(attr, 0));
                    // } catch (e) {
                    //     Log.w(LOG_TAG, "Failure reading input extras", e);
                    // } catch (IOException e) {
                    //     Log.w(LOG_TAG, "Failure reading input extras", e);
                    // }
                    break;

                case 'textcursordrawable':
                    // this.mCursorDrawableRes = a.getResourceId(attr, 0);
                    break;

                case 'textselecthandleleft':
                    // this.mTextSelectHandleLeftRes = a.getResourceId(attr, 0);
                    break;

                case 'textselecthandleright':
                    // this.mTextSelectHandleRightRes = a.getResourceId(attr, 0);
                    break;

                case 'textselecthandle':
                    // this.mTextSelectHandleRes = a.getResourceId(attr, 0);
                    break;

                case 'texteditsuggestionitemlayout':
                    // this.mTextEditSuggestionItemLayout = a.getResourceId(attr, 0);
                    break;

                case 'textisselectable':
                    this.setTextIsSelectable(a.getBoolean(attr, false));
                    break;

                case 'textallcaps':
                    allCaps = a.getBoolean(attr, false);
                    break;
            }
        }
        a.recycle();

        let bufferType = this.mBufferType;// TextView.BufferType.EDITABLE;

        // const variation =
        //     inputType & (EditorInfo.TYPE_MASK_CLASS | EditorInfo.TYPE_MASK_VARIATION);
        // final boolean passwordInputType = variation
        //     == (EditorInfo.TYPE_CLASS_TEXT | EditorInfo.TYPE_TEXT_VARIATION_PASSWORD);
        // final boolean webPasswordInputType = variation
        //     == (EditorInfo.TYPE_CLASS_TEXT | EditorInfo.TYPE_TEXT_VARIATION_WEB_PASSWORD);
        // final boolean numberPasswordInputType = variation
        //     == (EditorInfo.TYPE_CLASS_NUMBER | EditorInfo.TYPE_NUMBER_VARIATION_PASSWORD);

        // if (inputMethod != null) {
        //     Class<?> c;
        //
        //     try {
        //         c = Class.forName(inputMethod.toString());
        //     } catch (ClassNotFoundException ex) {
        //         throw new RuntimeException(ex);
        //     }
        //
        //     try {
        //         createEditorIfNeeded();
        //         mEditor.mKeyListener = (KeyListener) c.newInstance();
        //     } catch (InstantiationException ex) {
        //         throw new RuntimeException(ex);
        //     } catch (IllegalAccessException ex) {
        //         throw new RuntimeException(ex);
        //     }
        //     try {
        //         mEditor.mInputType = inputType != EditorInfo.TYPE_NULL
        //             ? inputType
        //             : mEditor.mKeyListener.getInputType();
        //     } catch (IncompatibleClassChangeError e) {
        //         mEditor.mInputType = EditorInfo.TYPE_CLASS_TEXT;
        //     }
        // } else if (digits != null) {
        //     createEditorIfNeeded();
        //     mEditor.mKeyListener = DigitsKeyListener.getInstance(digits.toString());
        //     // If no input type was specified, we will default to generic
        //     // text, since we can't tell the IME about the set of digits
        //     // that was selected.
        //     mEditor.mInputType = inputType != EditorInfo.TYPE_NULL
        //         ? inputType : EditorInfo.TYPE_CLASS_TEXT;
        // } else if (inputType != EditorInfo.TYPE_NULL) {
        //     setInputType(inputType, true);
        //     // If set, the input type overrides what was set using the deprecated singleLine flag.
        //     singleLine = !isMultilineInputType(inputType);
        // } else if (phone) {
        //     createEditorIfNeeded();
        //     mEditor.mKeyListener = DialerKeyListener.getInstance();
        //     mEditor.mInputType = inputType = EditorInfo.TYPE_CLASS_PHONE;
        // } else if (numeric != 0) {
        //     createEditorIfNeeded();
        //     mEditor.mKeyListener = DigitsKeyListener.getInstance((numeric & SIGNED) != 0,
        //         (numeric & DECIMAL) != 0);
        //     inputType = EditorInfo.TYPE_CLASS_NUMBER;
        //     if ((numeric & SIGNED) != 0) {
        //         inputType |= EditorInfo.TYPE_NUMBER_FLAG_SIGNED;
        //     }
        //     if ((numeric & DECIMAL) != 0) {
        //         inputType |= EditorInfo.TYPE_NUMBER_FLAG_DECIMAL;
        //     }
        //     mEditor.mInputType = inputType;
        // } else if (autotext || autocap != -1) {
        //     TextKeyListener.Capitalize cap;
        //
        //     inputType = EditorInfo.TYPE_CLASS_TEXT;
        //
        //     switch (autocap) {
        //         case 1:
        //             cap = TextKeyListener.Capitalize.SENTENCES;
        //             inputType |= EditorInfo.TYPE_TEXT_FLAG_CAP_SENTENCES;
        //             break;
        //
        //         case 2:
        //             cap = TextKeyListener.Capitalize.WORDS;
        //             inputType |= EditorInfo.TYPE_TEXT_FLAG_CAP_WORDS;
        //             break;
        //
        //         case 3:
        //             cap = TextKeyListener.Capitalize.CHARACTERS;
        //             inputType |= EditorInfo.TYPE_TEXT_FLAG_CAP_CHARACTERS;
        //             break;
        //
        //         default:
        //             cap = TextKeyListener.Capitalize.NONE;
        //             break;
        //     }
        //
        //     createEditorIfNeeded();
        //     mEditor.mKeyListener = TextKeyListener.getInstance(autotext, cap);
        //     mEditor.mInputType = inputType;
        // } else if (isTextSelectable()) {
        //     // Prevent text changes from keyboard.
        //     if (mEditor != null) {
        //         mEditor.mKeyListener = null;
        //         mEditor.mInputType = EditorInfo.TYPE_NULL;
        //     }
        //     bufferType = BufferType.SPANNABLE;
        //     // So that selection can be changed using arrow keys and touch is handled.
        //     setMovementMethod(ArrowKeyMovementMethod.getInstance());
        // } else if (editable) {
        //     createEditorIfNeeded();
        //     mEditor.mKeyListener = TextKeyListener.getInstance();
        //     mEditor.mInputType = EditorInfo.TYPE_CLASS_TEXT;
        // } else {
        //     if (mEditor != null) mEditor.mKeyListener = null;
        //
        //     switch (buffertype) {
        //         case 0:
        //             bufferType = BufferType.NORMAL;
        //             break;
        //         case 1:
        //             bufferType = BufferType.SPANNABLE;
        //             break;
        //         case 2:
        //             bufferType = BufferType.EDITABLE;
        //             break;
        //     }
        // }
        //
        // if (mEditor != null) mEditor.adjustInputType(password, passwordInputType,
        //     webPasswordInputType, numberPasswordInputType);
        //
        // if (selectallonfocus) {
        //     createEditorIfNeeded();
        //     mEditor.mSelectAllOnFocus = true;
        //
        //     if (bufferType == BufferType.NORMAL)
        //         bufferType = BufferType.SPANNABLE;
        // }

        // This call will save the initial left/right drawables
        this.setCompoundDrawablesWithIntrinsicBounds(
            drawableLeft, drawableTop, drawableRight, drawableBottom);
        this.setRelativeDrawablesIfNeeded(drawableStart, drawableEnd);
        this.setCompoundDrawablePadding(drawablePadding);

        // Same as setSingleLine(), but make sure the transformation method and the maximum number
        // of lines of height are unchanged for multi-line TextViews.
        this.setInputTypeSingleLine(singleLine);
        this.applySingleLine(singleLine, singleLine, singleLine);

        if (singleLine && this.getKeyListener() == null && ellipsize == null) {
            ellipsize = TextUtils.TruncateAt.END; // END
        }

        switch (ellipsize) {
            case TextUtils.TruncateAt.START:
                this.setEllipsize(TextUtils.TruncateAt.START);
                break;
            case TextUtils.TruncateAt.MIDDLE:
                this.setEllipsize(TextUtils.TruncateAt.MIDDLE);
                break;
            case TextUtils.TruncateAt.END:
                this.setEllipsize(TextUtils.TruncateAt.END);
                break;
            case TextUtils.TruncateAt.MARQUEE:
                // if (ViewConfiguration.get(context).isFadingMarqueeEnabled()) {
                //     this.setHorizontalFadingEdgeEnabled(true);
                //     this.mMarqueeFadeMode = MARQUEE_FADE_NORMAL;
                // } else {
                    this.setHorizontalFadingEdgeEnabled(false);
                    this.mMarqueeFadeMode = TextView.MARQUEE_FADE_SWITCH_SHOW_ELLIPSIS;
                // }
                this.setEllipsize(TextUtils.TruncateAt.MARQUEE);
                break;
        }

        this.setTextColor(textColor != null ? textColor : ColorStateList.valueOf(0xFF000000));
        this.setHintTextColor(textColorHint);
        this.setLinkTextColor(textColorLink);
        if (textColorHighlight != 0) {
            this.setHighlightColor(textColorHighlight);
        }
        this.setRawTextSize(textSize);

        if (allCaps) {
            this.setTransformationMethod(new AllCapsTransformationMethod(this.getContext()));
        }

        // if (password || passwordInputType || webPasswordInputType || numberPasswordInputType) {
        //     this.setTransformationMethod(android.text.method.PasswordTransformationMethod.PasswordTransformationMethod.getInstance());
        //     typefaceIndex = MONOSPACE;
        // } else if (mEditor != null &&
        //     (mEditor.mInputType & (EditorInfo.TYPE_MASK_CLASS | EditorInfo.TYPE_MASK_VARIATION))
        //     == (EditorInfo.TYPE_CLASS_TEXT | EditorInfo.TYPE_TEXT_VARIATION_PASSWORD)) {
        //     typefaceIndex = MONOSPACE;
        // }
        //
        // setTypefaceFromAttrs(fontFamily, typefaceIndex, styleIndex);

        if (shadowcolor != 0) {
            this.setShadowLayer(r, dx, dy, shadowcolor);
        }

        // if (maxlength >= 0) {
        //     this.setFilters(new InputFilter[] { new InputFilter.LengthFilter(maxlength) });
        // } else {
        //     this.setFilters(TextView.NO_FILTERS);
        // }

        this.setText(text, bufferType);
        if (hint != null) this.setHint(hint);

        // /*
        //  * Views are not normally focusable unless specified to be.
        //  * However, TextViews that have input or movement methods *are*
        //  * focusable by default.
        //  */
        // a = context.obtainStyledAttributes(attrs,
        //     com.android.internal.R.styleable.View,
        //     defStyle, 0);
        //
        // boolean focusable = mMovement != null || getKeyListener() != null;
        // boolean clickable = focusable;
        // boolean longClickable = focusable;
        //
        // n = a.getIndexCount();
        // for (int i = 0; i < n; i++) {
        //     int attr = a.getIndex(i);
        //
        //     switch (attr) {
        //         case com.android.internal.R.styleable.View_focusable:
        //             focusable = a.getBoolean(attr, focusable);
        //             break;
        //
        //         case com.android.internal.R.styleable.View_clickable:
        //             clickable = a.getBoolean(attr, clickable);
        //             break;
        //
        //         case com.android.internal.R.styleable.View_longClickable:
        //             longClickable = a.getBoolean(attr, longClickable);
        //             break;
        //     }
        // }
        // a.recycle();
        //
        // setFocusable(focusable);
        // setClickable(clickable);
        // setLongClickable(longClickable);
        //
        // if (mEditor != null) mEditor.prepareCursorControllers();
        //
        // // If not explicitly specified this view is important for accessibility.
        // if (getImportantForAccessibility() == IMPORTANT_FOR_ACCESSIBILITY_AUTO) {
        //     setImportantForAccessibility(IMPORTANT_FOR_ACCESSIBILITY_YES);
        // }
    }


    protected createClassAttrBinder(): androidui.attr.AttrBinder.ClassBinderMap {
        return super.createClassAttrBinder()
            .set('textColorHighlight', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    v.setHighlightColor(attrBinder.parseColor(value, v.mHighlightColor));
                },
                getter(v: TextView){
                    return v.getHighlightColor();
                }
            }).set('textColor', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    let color = attrBinder.parseColorList(value);
                    if (color) v.setTextColor(color);
                },
                getter(v: TextView){
                    return v.mTextColor;
                }
            }).set('textColorHint', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    let color = attrBinder.parseColorList(value);
                    if (color) v.setHintTextColor(color);
                },
                getter(v: TextView){
                    return v.mHintTextColor;
                }
            }).set('textSize', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    let size = attrBinder.parseNumberPixelSize(value, v.mTextPaint.getTextSize());
                    v.setTextSize(TypedValue.COMPLEX_UNIT_PX, size);
                },
                getter(v: TextView){
                    return v.mTextPaint.getTextSize();
                }
            }).set('textAllCaps', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    v.setAllCaps(attrBinder.parseBoolean(value, true));
                }
            }).set('shadowColor', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    v.setShadowLayer(v.mShadowRadius, v.mShadowDx, v.mShadowDy,
                        attrBinder.parseColor(value, v.mTextPaint.shadowColor));
                },
                getter(v: TextView){
                    return v.getShadowColor();
                }
            }).set('shadowDx', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    let dx = attrBinder.parseNumberPixelSize(value, v.mShadowDx);
                    v.setShadowLayer(v.mShadowRadius, dx, v.mShadowDy, v.mTextPaint.shadowColor);
                },
                getter(v: TextView){
                    return v.getShadowDx();
                }
            }).set('shadowDy', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    let dy = attrBinder.parseNumberPixelSize(value, v.mShadowDy);
                    v.setShadowLayer(v.mShadowRadius, v.mShadowDx, dy, v.mTextPaint.shadowColor);
                },
                getter(v: TextView){
                    return v.getShadowDy();
                }
            }).set('shadowRadius', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    let radius = attrBinder.parseNumberPixelSize(value, v.mShadowRadius);
                    v.setShadowLayer(radius, v.mShadowDx, v.mShadowDy, v.mTextPaint.shadowColor);
                },
                getter(v: TextView){
                    return v.getShadowRadius();
                }
            }).set('drawableLeft', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    let dr = v.mDrawables || <TextView.Drawables>{};
                    let drawable = attrBinder.parseDrawable(value);
                    v.setCompoundDrawablesWithIntrinsicBounds(drawable, dr.mDrawableTop, dr.mDrawableRight, dr.mDrawableBottom);
                },
                getter(v: TextView){
                    return v.getCompoundDrawables()[0];
                }
            }).set('drawableStart', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    let dr = v.mDrawables || <TextView.Drawables>{};
                    let drawable = attrBinder.parseDrawable(value);
                    v.setCompoundDrawablesWithIntrinsicBounds(drawable, dr.mDrawableTop, dr.mDrawableRight, dr.mDrawableBottom);
                },
                getter(v: TextView){
                    return v.getCompoundDrawables()[0];
                }
            }).set('drawableTop', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    let dr = v.mDrawables || <TextView.Drawables>{};
                    let drawable = attrBinder.parseDrawable(value);
                    v.setCompoundDrawablesWithIntrinsicBounds(dr.mDrawableLeft, drawable, dr.mDrawableRight, dr.mDrawableBottom);
                },
                getter(v: TextView){
                    return v.getCompoundDrawables()[1];
                }
            }).set('drawableRight', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    let dr = v.mDrawables || <TextView.Drawables>{};
                    let drawable = attrBinder.parseDrawable(value);
                    v.setCompoundDrawablesWithIntrinsicBounds(dr.mDrawableLeft, dr.mDrawableTop, drawable, dr.mDrawableBottom);
                },
                getter(v: TextView){
                    return v.getCompoundDrawables()[2];
                }
            }).set('drawableEnd', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    let dr = v.mDrawables || <TextView.Drawables>{};
                    let drawable = attrBinder.parseDrawable(value);
                    v.setCompoundDrawablesWithIntrinsicBounds(dr.mDrawableLeft, dr.mDrawableTop, drawable, dr.mDrawableBottom);
                },
                getter(v: TextView){
                    return v.getCompoundDrawables()[2];
                }
            }).set('drawableBottom', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    let dr = v.mDrawables || <TextView.Drawables>{};
                    let drawable = attrBinder.parseDrawable(value);
                    v.setCompoundDrawablesWithIntrinsicBounds(dr.mDrawableLeft, dr.mDrawableTop, dr.mDrawableRight, drawable);
                },
                getter(v: TextView){
                    return v.getCompoundDrawables()[3];
                }
            }).set('drawablePadding', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    v.setCompoundDrawablePadding(attrBinder.parseNumberPixelSize(value));
                },
                getter(v: TextView){
                    return v.getCompoundDrawablePadding();
                }
            }).set('maxLines', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    value = Number.parseInt(value);
                    if (Number.isInteger(value)) v.setMaxLines(value);
                },
                getter(v: TextView){
                    return v.getMaxLines();
                }
            }).set('maxHeight', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    v.setMaxHeight(attrBinder.parseNumberPixelSize(value, v.getMaxHeight()));
                },
                getter(v: TextView){
                    return v.getMaxHeight();
                }
            }).set('lines', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    value = Number.parseInt(value);
                    if (Number.isInteger(value)) v.setLines(value);
                },
                getter(v: TextView){
                    if (v.getMaxLines() === v.getMinLines()) return v.getMaxLines();
                    return null;
                }
            }).set('height', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    value = attrBinder.parseNumberPixelSize(value, -1);
                    if (value >= 0) v.setHeight(value);
                },
                getter(v: TextView){
                    if (v.getMaxHeight() === v.getMinimumHeight()) return v.getMaxHeight();
                    return null;
                }
            }).set('minLines', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    v.setMinLines(attrBinder.parseInt(value, v.getMinLines()));
                },
                getter(v: TextView){
                    return v.getMinLines();
                }
            }).set('minHeight', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    v.setMinHeight(attrBinder.parseNumberPixelSize(value, v.getMinHeight()));
                },
                getter(v: TextView){
                    return v.getMinHeight();
                }
            }).set('maxEms', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    v.setMaxEms(attrBinder.parseInt(value, v.getMaxEms()));
                },
                getter(v: TextView){
                    return v.getMaxEms();
                }
            }).set('maxWidth', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    v.setMaxWidth(attrBinder.parseNumberPixelSize(value, v.getMaxWidth()));
                },
                getter(v: TextView){
                    return v.getMaxWidth();
                }
            }).set('ems', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    let ems = attrBinder.parseInt(value, null);
                    if (ems != null) v.setEms(ems);
                },
                getter(v: TextView){
                    if (v.getMinEms() === v.getMaxEms()) return v.getMaxEms();
                    return null;
                }
            }).set('width', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    value = attrBinder.parseNumberPixelSize(value, -1);
                    if (value >= 0) v.setWidth(value);
                },
                getter(v: TextView){
                    if (v.getMinWidth() === v.getMaxWidth()) return v.getMinWidth();
                    return null;
                }
            }).set('minEms', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    v.setMinEms(attrBinder.parseInt(value, v.getMinEms()));
                },
                getter(v: TextView){
                    return v.getMinEms();
                }
            }).set('minWidth', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    v.setMinWidth(attrBinder.parseNumberPixelSize(value, v.getMinWidth()));
                },
                getter(v: TextView){
                    return v.getMinWidth();
                }
            }).set('gravity', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    v.setGravity(attrBinder.parseGravity(value, v.mGravity));
                },
                getter(v: TextView){
                    return v.mGravity;
                }
            }).set('hint', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    v.setHint(attrBinder.parseString(value));
                },
                getter(v: TextView){
                    return v.getHint();
                }
            }).set('text', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    v.setText(attrBinder.parseString(value));
                },
                getter(v: TextView){
                    return v.getText();
                }
            }).set('scrollHorizontally', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    v.setHorizontallyScrolling(attrBinder.parseBoolean(value, false));
                }
            }).set('singleLine', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    v.setSingleLine(attrBinder.parseBoolean(value, false));
                }
            }).set('ellipsize', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    let ellipsize = TextUtils.TruncateAt[(value + '').toUpperCase()];
                    if (ellipsize) v.setEllipsize(ellipsize);
                }
            }).set('marqueeRepeatLimit', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    let marqueeRepeatLimit = attrBinder.parseInt(value, -1);
                    if (marqueeRepeatLimit >= 0) v.setMarqueeRepeatLimit(marqueeRepeatLimit);
                }
            }).set('includeFontPadding', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    v.setIncludeFontPadding(attrBinder.parseBoolean(value, false));
                }
            }).set('enabled', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    v.setEnabled(attrBinder.parseBoolean(value, v.isEnabled()));
                },
                getter(v: TextView){
                    return v.isEnabled();
                }
            }).set('lineSpacingExtra', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    v.setLineSpacing(attrBinder.parseNumberPixelSize(value, v.mSpacingAdd), v.mSpacingMult);
                },
                getter(v: TextView){
                    return v.mSpacingAdd;
                }
            }).set('lineSpacingMultiplier', {
                setter(v: TextView, value: any, attrBinder: AttrBinder) {
                    v.setLineSpacing(v.mSpacingAdd, attrBinder.parseFloat(value, v.mSpacingMult));
                },
                getter(v: TextView){
                    return v.mSpacingMult;
                }
            });
    }

    private setTypefaceFromAttrs(familyName:string, typefaceIndex:number, styleIndex:number):void  {
        //let tf:Typeface = null;
        //if (familyName != null) {
        //    tf = Typeface.create(familyName, styleIndex);
        //    if (tf != null) {
        //        this.setTypeface(tf);
        //        return;
        //    }
        //}
        //switch(typefaceIndex) {
        //    case TextView.SANS:
        //        tf = Typeface.SANS_SERIF;
        //        break;
        //    case TextView.SERIF:
        //        tf = Typeface.SERIF;
        //        break;
        //    case TextView.MONOSPACE:
        //        tf = Typeface.MONOSPACE;
        //        break;
        //}
        //this.setTypeface(tf, styleIndex);
    }

    private setRelativeDrawablesIfNeeded(start:Drawable, end:Drawable):void  {
        let hasRelativeDrawables:boolean = (start != null) || (end != null);
        if (hasRelativeDrawables) {
            let dr:TextView.Drawables = this.mDrawables;
            if (dr == null) {
                this.mDrawables = dr = new TextView.Drawables();
            }
            this.mDrawables.mOverride = true;
            const compoundRect:Rect = dr.mCompoundRect;
            let state:number[] = this.getDrawableState();
            if (start != null) {
                start.setBounds(0, 0, start.getIntrinsicWidth(), start.getIntrinsicHeight());
                start.setState(state);
                start.copyBounds(compoundRect);
                start.setCallback(this);
                dr.mDrawableStart = start;
                dr.mDrawableSizeStart = compoundRect.width();
                dr.mDrawableHeightStart = compoundRect.height();
            } else {
                dr.mDrawableSizeStart = dr.mDrawableHeightStart = 0;
            }
            if (end != null) {
                end.setBounds(0, 0, end.getIntrinsicWidth(), end.getIntrinsicHeight());
                end.setState(state);
                end.copyBounds(compoundRect);
                end.setCallback(this);
                dr.mDrawableEnd = end;
                dr.mDrawableSizeEnd = compoundRect.width();
                dr.mDrawableHeightEnd = compoundRect.height();
            } else {
                dr.mDrawableSizeEnd = dr.mDrawableHeightEnd = 0;
            }
            this.resetResolvedDrawables();
            this.resolveDrawables();
        }
    }

    setEnabled(enabled:boolean):void  {
        if (enabled == this.isEnabled()) {
            return;
        }
        //if (!enabled) {
        //    // Hide the soft input if the currently active TextView is disabled
        //    let imm:InputMethodManager = InputMethodManager.peekInstance();
        //    if (imm != null && imm.isActive(this)) {
        //        imm.hideSoftInputFromWindow(this.getWindowToken(), 0);
        //    }
        //}
        super.setEnabled(enabled);
        //if (enabled) {
        //    // Make sure IME is updated with current editor info.
        //    let imm:InputMethodManager = InputMethodManager.peekInstance();
        //    if (imm != null)
        //        imm.restartInput(this);
        //}
        //// Will change text color
        //if (this.mEditor != null) {
        //    this.mEditor.invalidateTextDisplayList();
        //    this.mEditor.prepareCursorControllers();
        //    // start or stop the cursor blinking as appropriate
        //    this.mEditor.makeBlink();
        //}
    }

    /**
     * Sets the typeface and style in which the text should be displayed,
     * and turns on the fake bold and italic bits in the Paint if the
     * Typeface that you provided does not have all the bits in the
     * style that you specified.
     *
     * @attr ref android.R.styleable#TextView_typeface
     * @attr ref android.R.styleable#TextView_textStyle
     */
    setTypeface(tf:any, style:number):void  {
        //if (style > 0) {
        //    if (tf == null) {
        //        tf = Typeface.defaultFromStyle(style);
        //    } else {
        //        tf = Typeface.create(tf, style);
        //    }
        //    this.setTypeface(tf);
        //    // now compute what (if any) algorithmic styling is needed
        //    let typefaceStyle:number = tf != null ? tf.getStyle() : 0;
        //    let need:number = style & ~typefaceStyle;
        //    this.mTextPaint.setFakeBoldText((need & Typeface.BOLD) != 0);
        //    this.mTextPaint.setTextSkewX((need & Typeface.ITALIC) != 0 ? -0.25 : 0);
        //} else {
        //    this.mTextPaint.setFakeBoldText(false);
        //    this.mTextPaint.setTextSkewX(0);
        //    this.setTypeface(tf);
        //}
    }

    /**
     * Subclasses override this to specify that they have a KeyListener
     * by default even if not specifically called for in the XML options.
     */
    protected getDefaultEditable():boolean  {
        return false;
    }

    /**
     * Subclasses override this to specify a default movement method.
     */
    protected getDefaultMovementMethod():MovementMethod  {
        return null;
    }

    /**
     * Return the text the TextView is displaying. If setText() was called with
     * an argument of TextView.BufferType.SPANNABLE or TextView.BufferType.EDITABLE, you can cast
     * the return value from this method to Spannable or Editable, respectively.
     *
     * Note: The content of the return value should not be modified. If you want
     * a modifiable one, you should make your own copy first.
     *
     * @attr ref android.R.styleable#TextView_text
     */
    getText():String  {
        return this.mText;
    }

    /**
     * Returns the length, in characters, of the text managed by this TextView
     */
    length():number  {
        return this.mText.length;
    }

    /**
     * Return the text the TextView is displaying as an Editable object.  If
     * the text is not editable, null is returned.
     *
     * @see #getText
     */
    getEditableText():any  {
        return null;
        //return (this.mText instanceof Editable) ? <Editable> this.mText : null;
    }

    /**
     * @return the height of one standard line in pixels.  Note that markup
     * within the text can cause individual lines to be taller or shorter
     * than this height, and the layout may contain additional first-
     * or last-line padding.
     */
    getLineHeight():number  {
        return Math.round(this.mTextPaint.getFontMetricsInt(null) * this.mSpacingMult + this.mSpacingAdd);
    }

    /**
     * @return the Layout that is currently being used to display the text.
     * This can be null if the text or width has recently changes.
     */
    getLayout():Layout  {
        return this.mLayout;
    }

    /**
     * @return the Layout that is currently being used to display the hint text.
     * This can be null.
     */
    getHintLayout():Layout  {
        return this.mHintLayout;
    }

    /**
     * Retrieve the {@link android.content.UndoManager} that is currently associated
     * with this TextView.  By default there is no associated UndoManager, so null
     * is returned.  One can be associated with the TextView through
     * {@link #setUndoManager(android.content.UndoManager, String)}
     *
     * @hide
     */
    getUndoManager():any  {
        return null;
        //return this.mEditor == null ? null : this.mEditor.mUndoManager;
    }

    /**
     * Associate an {@link android.content.UndoManager} with this TextView.  Once
     * done, all edit operations on the TextView will result in appropriate
     * {@link android.content.UndoOperation} objects pushed on the given UndoManager's
     * stack.
     *
     * @param undoManager The {@link android.content.UndoManager} to associate with
     * this TextView, or null to clear any existing association.
     * @param tag String tag identifying this particular TextView owner in the
     * UndoManager.  This is used to keep the correct association with the
     * {@link android.content.UndoOwner} of any operations inside of the UndoManager.
     *
     * @hide
     */
    setUndoManager(undoManager:any, tag:string):void  {
        //not support now
        //if (undoManager != null) {
        //    this.createEditorIfNeeded();
        //    this.mEditor.mUndoManager = undoManager;
        //    this.mEditor.mUndoOwner = undoManager.getOwner(tag, this);
        //    this.mEditor.mUndoInputFilter = new Editor.UndoInputFilter(this.mEditor);
        //    if (!(this.mText instanceof Editable)) {
        //        this.setText(this.mText, TextView.BufferType.EDITABLE);
        //    }
        //    this.setFilters(<Editable> this.mText, this.mFilters);
        //} else if (this.mEditor != null) {
        //    // XXX need to destroy all associated state.
        //    this.mEditor.mUndoManager = null;
        //    this.mEditor.mUndoOwner = null;
        //    this.mEditor.mUndoInputFilter = null;
        //}
    }

    /**
     * @return the current key listener for this TextView.
     * This will frequently be null for non-EditText TextViews.
     *
     * @attr ref android.R.styleable#TextView_numeric
     * @attr ref android.R.styleable#TextView_digits
     * @attr ref android.R.styleable#TextView_phoneNumber
     * @attr ref android.R.styleable#TextView_inputMethod
     * @attr ref android.R.styleable#TextView_capitalize
     * @attr ref android.R.styleable#TextView_autoText
     */
    getKeyListener():any  {
        return null;
        //return this.mEditor == null ? null : this.mEditor.mKeyListener;
    }

    /**
     * Sets the key listener to be used with this TextView.  This can be null
     * to disallow user input.  Note that this method has significant and
     * subtle interactions with soft keyboards and other input method:
     * see {@link KeyListener#getInputType() KeyListener.getContentType()}
     * for important details.  Calling this method will replace the current
     * content type of the text view with the content type returned by the
     * key listener.
     * <p>
     * Be warned that if you want a TextView with a key listener or movement
     * method not to be focusable, or if you want a TextView without a
     * key listener or movement method to be focusable, you must call
     * {@link #setFocusable} again after calling this to get the focusability
     * back the way you want it.
     *
     * @attr ref android.R.styleable#TextView_numeric
     * @attr ref android.R.styleable#TextView_digits
     * @attr ref android.R.styleable#TextView_phoneNumber
     * @attr ref android.R.styleable#TextView_inputMethod
     * @attr ref android.R.styleable#TextView_capitalize
     * @attr ref android.R.styleable#TextView_autoText
     */
    setKeyListener(input:any):void  {
        //not support
        //this.setKeyListenerOnly(input);
        //this.fixFocusableAndClickableSettings();
        //if (input != null) {
        //    this.createEditorIfNeeded();
        //    try {
        //        this.mEditor.mInputType = this.mEditor.mKeyListener.getInputType();
        //    } catch (e){
        //        this.mEditor.mInputType = EditorInfo.TYPE_CLASS_TEXT;
        //    }
        //    // Change inputType, without affecting transformation.
        //    // No need to applySingleLine since mSingleLine is unchanged.
        //    this.setInputTypeSingleLine(this.mSingleLine);
        //} else {
        //    if (this.mEditor != null)
        //        this.mEditor.mInputType = EditorInfo.TYPE_NULL;
        //}
        //let imm:InputMethodManager = InputMethodManager.peekInstance();
        //if (imm != null)
        //    imm.restartInput(this);
    }

    private setKeyListenerOnly(input:any):void  {
        //not support
        // null is the default value
        //if (this.mEditor == null && input == null)
        //    return;
        //this.createEditorIfNeeded();
        //if (this.mEditor.mKeyListener != input) {
        //    this.mEditor.mKeyListener = input;
        //    if (input != null && !(this.mText instanceof Editable)) {
        //        this.setText(this.mText);
        //    }
        //    this.setFilters(<Editable> this.mText, this.mFilters);
        //}
    }

    /**
     * @return the movement method being used for this TextView.
     * This will frequently be null for non-EditText TextViews.
     */
    getMovementMethod():MovementMethod  {
        return this.mMovement;
    }

    /**
     * Sets the movement method (arrow key handler) to be used for
     * this TextView.  This can be null to disallow using the arrow keys
     * to move the cursor or scroll the view.
     * <p>
     * Be warned that if you want a TextView with a key listener or movement
     * method not to be focusable, or if you want a TextView without a
     * key listener or movement method to be focusable, you must call
     * {@link #setFocusable} again after calling this to get the focusability
     * back the way you want it.
     */
    setMovementMethod(movement:MovementMethod):void  {
        if (this.mMovement != movement) {
            this.mMovement = movement;
            if (movement != null && !Spannable.isImpl(this.mText)) {
                this.setText(this.mText);
            }
            this.fixFocusableAndClickableSettings();
            // mMovement
            //if (this.mEditor != null)
            //    this.mEditor.prepareCursorControllers();
        }
    }

    private fixFocusableAndClickableSettings():void  {
        if (this.mMovement != null
            //|| (this.mEditor != null && this.mEditor.mKeyListener != null)
        ) {
            this.setFocusable(true);
            this.setClickable(true);
            this.setLongClickable(true);
        } else {
            this.setFocusable(false);
            this.setClickable(false);
            this.setLongClickable(false);
        }
    }

    /**
     * @return the current transformation method for this TextView.
     * This will frequently be null except for single-line and password
     * fields.
     *
     * @attr ref android.R.styleable#TextView_password
     * @attr ref android.R.styleable#TextView_singleLine
     */
    getTransformationMethod():TransformationMethod  {
        return this.mTransformation;
    }

    /**
     * Sets the transformation that is applied to the text that this
     * TextView is displaying.
     *
     * @attr ref android.R.styleable#TextView_password
     * @attr ref android.R.styleable#TextView_singleLine
     */
    setTransformationMethod(method:TransformationMethod):void  {
        if (method == this.mTransformation) {
            // the same.
            return;
        }
        if (this.mTransformation != null) {
            if (Spannable.isImpl(this.mText)) {
                (<Spannable> this.mText).removeSpan(this.mTransformation);
            }
        }
        this.mTransformation = method;
        if (TransformationMethod2.isImpl(method)) {
            let method2:TransformationMethod2 = <TransformationMethod2> method;
            this.mAllowTransformationLengthChange = !this.isTextSelectable();// && !(this.mText instanceof Editable);
            method2.setLengthChangesAllowed(this.mAllowTransformationLengthChange);
        } else {
            this.mAllowTransformationLengthChange = false;
        }
        this.setText(this.mText);
        //if (this.hasPasswordTransformationMethod()) {
        //    this.notifyViewAccessibilityStateChangedIfNeeded(AccessibilityEvent.CONTENT_CHANGE_TYPE_UNDEFINED);
        //}
    }

    /**
     * Returns the top padding of the view, plus space for the top
     * Drawable if any.
     */
    getCompoundPaddingTop():number  {
        const dr:TextView.Drawables = this.mDrawables;
        if (dr == null || dr.mDrawableTop == null) {
            return this.mPaddingTop;
        } else {
            return this.mPaddingTop + dr.mDrawablePadding + dr.mDrawableSizeTop;
        }
    }

    /**
     * Returns the bottom padding of the view, plus space for the bottom
     * Drawable if any.
     */
    getCompoundPaddingBottom():number  {
        const dr:TextView.Drawables = this.mDrawables;
        if (dr == null || dr.mDrawableBottom == null) {
            return this.mPaddingBottom;
        } else {
            return this.mPaddingBottom + dr.mDrawablePadding + dr.mDrawableSizeBottom;
        }
    }

    /**
     * Returns the left padding of the view, plus space for the left
     * Drawable if any.
     */
    getCompoundPaddingLeft():number  {
        const dr:TextView.Drawables = this.mDrawables;
        if (dr == null || dr.mDrawableLeft == null) {
            return this.mPaddingLeft;
        } else {
            return this.mPaddingLeft + dr.mDrawablePadding + dr.mDrawableSizeLeft;
        }
    }

    /**
     * Returns the right padding of the view, plus space for the right
     * Drawable if any.
     */
    getCompoundPaddingRight():number  {
        const dr:TextView.Drawables = this.mDrawables;
        if (dr == null || dr.mDrawableRight == null) {
            return this.mPaddingRight;
        } else {
            return this.mPaddingRight + dr.mDrawablePadding + dr.mDrawableSizeRight;
        }
    }

    /**
     * Returns the start padding of the view, plus space for the start
     * Drawable if any.
     */
    getCompoundPaddingStart():number  {
        this.resolveDrawables();
        //switch(this.getLayoutDirection()) {
        //    default:
        //    case TextView.LAYOUT_DIRECTION_LTR:
                return this.getCompoundPaddingLeft();
        //    case TextView.LAYOUT_DIRECTION_RTL:
        //        return this.getCompoundPaddingRight();
        //}
    }

    /**
     * Returns the end padding of the view, plus space for the end
     * Drawable if any.
     */
    getCompoundPaddingEnd():number  {
        this.resolveDrawables();
        //switch(this.getLayoutDirection()) {
        //    default:
        //    case TextView.LAYOUT_DIRECTION_LTR:
                return this.getCompoundPaddingRight();
        //    case TextView.LAYOUT_DIRECTION_RTL:
        //        return this.getCompoundPaddingLeft();
        //}
    }

    /**
     * Returns the extended top padding of the view, including both the
     * top Drawable if any and any extra space to keep more than maxLines
     * of text from showing.  It is only valid to call this after measuring.
     */
    getExtendedPaddingTop():number  {
        if (this.mMaxMode != TextView.LINES) {
            return this.getCompoundPaddingTop();
        }
        if (this.mLayout.getLineCount() <= this.mMaximum) {
            return this.getCompoundPaddingTop();
        }
        let top:number = this.getCompoundPaddingTop();
        let bottom:number = this.getCompoundPaddingBottom();
        let viewht:number = this.getHeight() - top - bottom;
        let layoutht:number = this.mLayout.getLineTop(this.mMaximum);
        if (layoutht >= viewht) {
            return top;
        }
        const gravity:number = this.mGravity & Gravity.VERTICAL_GRAVITY_MASK;
        if (gravity == Gravity.TOP) {
            return top;
        } else if (gravity == Gravity.BOTTOM) {
            return top + viewht - layoutht;
        } else {
            // (gravity == Gravity.CENTER_VERTICAL)
            return top + (viewht - layoutht) / 2;
        }
    }

    /**
     * Returns the extended bottom padding of the view, including both the
     * bottom Drawable if any and any extra space to keep more than maxLines
     * of text from showing.  It is only valid to call this after measuring.
     */
    getExtendedPaddingBottom():number  {
        if (this.mMaxMode != TextView.LINES) {
            return this.getCompoundPaddingBottom();
        }
        if (this.mLayout.getLineCount() <= this.mMaximum) {
            return this.getCompoundPaddingBottom();
        }
        let top:number = this.getCompoundPaddingTop();
        let bottom:number = this.getCompoundPaddingBottom();
        let viewht:number = this.getHeight() - top - bottom;
        let layoutht:number = this.mLayout.getLineTop(this.mMaximum);
        if (layoutht >= viewht) {
            return bottom;
        }
        const gravity:number = this.mGravity & Gravity.VERTICAL_GRAVITY_MASK;
        if (gravity == Gravity.TOP) {
            return bottom + viewht - layoutht;
        } else if (gravity == Gravity.BOTTOM) {
            return bottom;
        } else {
            // (gravity == Gravity.CENTER_VERTICAL)
            return bottom + (viewht - layoutht) / 2;
        }
    }

    /**
     * Returns the total left padding of the view, including the left
     * Drawable if any.
     */
    getTotalPaddingLeft():number  {
        return this.getCompoundPaddingLeft();
    }

    /**
     * Returns the total right padding of the view, including the right
     * Drawable if any.
     */
    getTotalPaddingRight():number  {
        return this.getCompoundPaddingRight();
    }

    /**
     * Returns the total start padding of the view, including the start
     * Drawable if any.
     */
    getTotalPaddingStart():number  {
        return this.getCompoundPaddingStart();
    }

    /**
     * Returns the total end padding of the view, including the end
     * Drawable if any.
     */
    getTotalPaddingEnd():number  {
        return this.getCompoundPaddingEnd();
    }

    /**
     * Returns the total top padding of the view, including the top
     * Drawable if any, the extra space to keep more than maxLines
     * from showing, and the vertical offset for gravity, if any.
     */
    getTotalPaddingTop():number  {
        return this.getExtendedPaddingTop() + this.getVerticalOffset(true);
    }

    /**
     * Returns the total bottom padding of the view, including the bottom
     * Drawable if any, the extra space to keep more than maxLines
     * from showing, and the vertical offset for gravity, if any.
     */
    getTotalPaddingBottom():number  {
        return this.getExtendedPaddingBottom() + this.getBottomVerticalOffset(true);
    }

    /**
     * Sets the Drawables (if any) to appear to the left of, above,
     * to the right of, and below the text.  Use null if you do not
     * want a Drawable there.  The Drawables must already have had
     * {@link Drawable#setBounds} called.
     *
     * @attr ref android.R.styleable#TextView_drawableLeft
     * @attr ref android.R.styleable#TextView_drawableTop
     * @attr ref android.R.styleable#TextView_drawableRight
     * @attr ref android.R.styleable#TextView_drawableBottom
     */
    setCompoundDrawables(left:Drawable, top:Drawable, right:Drawable, bottom:Drawable):void  {
        let dr:TextView.Drawables = this.mDrawables;
        const drawables:boolean = left != null || top != null || right != null || bottom != null;
        if (!drawables) {
            // Clearing drawables...  can we free the data structure?
            if (dr != null) {
                if (dr.mDrawablePadding == 0) {
                    this.mDrawables = null;
                } else {
                    // out all of the fields in the existing structure.
                    if (dr.mDrawableLeft != null){
                        dr.mDrawableLeft.setCallback(null);
                    }
                    dr.mDrawableLeft = null;
                    if (dr.mDrawableTop != null){
                        dr.mDrawableTop.setCallback(null);
                    }
                    dr.mDrawableTop = null;
                    if (dr.mDrawableRight != null){
                        dr.mDrawableRight.setCallback(null);
                    }
                    dr.mDrawableRight = null;
                    if (dr.mDrawableBottom != null){
                        dr.mDrawableBottom.setCallback(null);
                    }
                    dr.mDrawableBottom = null;
                    dr.mDrawableSizeLeft = dr.mDrawableHeightLeft = 0;
                    dr.mDrawableSizeRight = dr.mDrawableHeightRight = 0;
                    dr.mDrawableSizeTop = dr.mDrawableWidthTop = 0;
                    dr.mDrawableSizeBottom = dr.mDrawableWidthBottom = 0;
                }
            }
        } else {
            if (dr == null) {
                this.mDrawables = dr = new TextView.Drawables();
            }
            this.mDrawables.mOverride = false;
            if (dr.mDrawableLeft != left && dr.mDrawableLeft != null) {
                dr.mDrawableLeft.setCallback(null);
            }
            dr.mDrawableLeft = left;
            if (dr.mDrawableTop != top && dr.mDrawableTop != null) {
                dr.mDrawableTop.setCallback(null);
            }
            dr.mDrawableTop = top;
            if (dr.mDrawableRight != right && dr.mDrawableRight != null) {
                dr.mDrawableRight.setCallback(null);
            }
            dr.mDrawableRight = right;
            if (dr.mDrawableBottom != bottom && dr.mDrawableBottom != null) {
                dr.mDrawableBottom.setCallback(null);
            }
            dr.mDrawableBottom = bottom;
            const compoundRect:Rect = dr.mCompoundRect;
            let state:number[];
            state = this.getDrawableState();
            if (left != null) {
                left.setState(state);
                left.copyBounds(compoundRect);
                left.setCallback(this);
                dr.mDrawableSizeLeft = compoundRect.width();
                dr.mDrawableHeightLeft = compoundRect.height();
            } else {
                dr.mDrawableSizeLeft = dr.mDrawableHeightLeft = 0;
            }
            if (right != null) {
                right.setState(state);
                right.copyBounds(compoundRect);
                right.setCallback(this);
                dr.mDrawableSizeRight = compoundRect.width();
                dr.mDrawableHeightRight = compoundRect.height();
            } else {
                dr.mDrawableSizeRight = dr.mDrawableHeightRight = 0;
            }
            if (top != null) {
                top.setState(state);
                top.copyBounds(compoundRect);
                top.setCallback(this);
                dr.mDrawableSizeTop = compoundRect.height();
                dr.mDrawableWidthTop = compoundRect.width();
            } else {
                dr.mDrawableSizeTop = dr.mDrawableWidthTop = 0;
            }
            if (bottom != null) {
                bottom.setState(state);
                bottom.copyBounds(compoundRect);
                bottom.setCallback(this);
                dr.mDrawableSizeBottom = compoundRect.height();
                dr.mDrawableWidthBottom = compoundRect.width();
            } else {
                dr.mDrawableSizeBottom = dr.mDrawableWidthBottom = 0;
            }
        }
        // Save initial left/right drawables
        if (dr != null) {
            dr.mDrawableLeftInitial = left;
            dr.mDrawableRightInitial = right;
        }
        this.resetResolvedDrawables();
        this.resolveDrawables();
        this.invalidate();
        this.requestLayout();
    }

    /**
     * Sets the Drawables (if any) to appear to the left of, above,
     * to the right of, and below the text.  Use null if you do not
     * want a Drawable there. The Drawables' bounds will be set to
     * their intrinsic bounds.
     *
     * @attr ref android.R.styleable#TextView_drawableLeft
     * @attr ref android.R.styleable#TextView_drawableTop
     * @attr ref android.R.styleable#TextView_drawableRight
     * @attr ref android.R.styleable#TextView_drawableBottom
     */
    setCompoundDrawablesWithIntrinsicBounds(left:Drawable, top:Drawable, right:Drawable, bottom:Drawable):void  {
        if (left != null) {
            left.setBounds(0, 0, left.getIntrinsicWidth(), left.getIntrinsicHeight());
        }
        if (right != null) {
            right.setBounds(0, 0, right.getIntrinsicWidth(), right.getIntrinsicHeight());
        }
        if (top != null) {
            top.setBounds(0, 0, top.getIntrinsicWidth(), top.getIntrinsicHeight());
        }
        if (bottom != null) {
            bottom.setBounds(0, 0, bottom.getIntrinsicWidth(), bottom.getIntrinsicHeight());
        }
        this.setCompoundDrawables(left, top, right, bottom);
    }

    /**
     * Sets the Drawables (if any) to appear to the start of, above,
     * to the end of, and below the text.  Use null if you do not
     * want a Drawable there.  The Drawables must already have had
     * {@link Drawable#setBounds} called.
     *
     * @attr ref android.R.styleable#TextView_drawableStart
     * @attr ref android.R.styleable#TextView_drawableTop
     * @attr ref android.R.styleable#TextView_drawableEnd
     * @attr ref android.R.styleable#TextView_drawableBottom
     */
    setCompoundDrawablesRelative(start:Drawable, top:Drawable, end:Drawable, bottom:Drawable):void  {
        let dr:TextView.Drawables = this.mDrawables;
        const drawables:boolean = start != null || top != null || end != null || bottom != null;
        if (!drawables) {
            // Clearing drawables...  can we free the data structure?
            if (dr != null) {
                if (dr.mDrawablePadding == 0) {
                    this.mDrawables = null;
                } else {
                    // out all of the fields in the existing structure.
                    if (dr.mDrawableStart != null){
                        dr.mDrawableStart.setCallback(null);
                    }
                    dr.mDrawableStart = null;
                    if (dr.mDrawableTop != null){
                        dr.mDrawableTop.setCallback(null);
                    }
                    dr.mDrawableTop = null;
                    if (dr.mDrawableEnd != null){
                        dr.mDrawableEnd.setCallback(null);
                    }
                    dr.mDrawableEnd = null;
                    if (dr.mDrawableBottom != null){
                        dr.mDrawableBottom.setCallback(null);
                    }
                    dr.mDrawableBottom = null;
                    dr.mDrawableSizeStart = dr.mDrawableHeightStart = 0;
                    dr.mDrawableSizeEnd = dr.mDrawableHeightEnd = 0;
                    dr.mDrawableSizeTop = dr.mDrawableWidthTop = 0;
                    dr.mDrawableSizeBottom = dr.mDrawableWidthBottom = 0;
                }
            }
        } else {
            if (dr == null) {
                this.mDrawables = dr = new TextView.Drawables();
            }
            this.mDrawables.mOverride = true;
            if (dr.mDrawableStart != start && dr.mDrawableStart != null) {
                dr.mDrawableStart.setCallback(null);
            }
            dr.mDrawableStart = start;
            if (dr.mDrawableTop != top && dr.mDrawableTop != null) {
                dr.mDrawableTop.setCallback(null);
            }
            dr.mDrawableTop = top;
            if (dr.mDrawableEnd != end && dr.mDrawableEnd != null) {
                dr.mDrawableEnd.setCallback(null);
            }
            dr.mDrawableEnd = end;
            if (dr.mDrawableBottom != bottom && dr.mDrawableBottom != null) {
                dr.mDrawableBottom.setCallback(null);
            }
            dr.mDrawableBottom = bottom;
            const compoundRect:Rect = dr.mCompoundRect;
            let state:number[];
            state = this.getDrawableState();
            if (start != null) {
                start.setState(state);
                start.copyBounds(compoundRect);
                start.setCallback(this);
                dr.mDrawableSizeStart = compoundRect.width();
                dr.mDrawableHeightStart = compoundRect.height();
            } else {
                dr.mDrawableSizeStart = dr.mDrawableHeightStart = 0;
            }
            if (end != null) {
                end.setState(state);
                end.copyBounds(compoundRect);
                end.setCallback(this);
                dr.mDrawableSizeEnd = compoundRect.width();
                dr.mDrawableHeightEnd = compoundRect.height();
            } else {
                dr.mDrawableSizeEnd = dr.mDrawableHeightEnd = 0;
            }
            if (top != null) {
                top.setState(state);
                top.copyBounds(compoundRect);
                top.setCallback(this);
                dr.mDrawableSizeTop = compoundRect.height();
                dr.mDrawableWidthTop = compoundRect.width();
            } else {
                dr.mDrawableSizeTop = dr.mDrawableWidthTop = 0;
            }
            if (bottom != null) {
                bottom.setState(state);
                bottom.copyBounds(compoundRect);
                bottom.setCallback(this);
                dr.mDrawableSizeBottom = compoundRect.height();
                dr.mDrawableWidthBottom = compoundRect.width();
            } else {
                dr.mDrawableSizeBottom = dr.mDrawableWidthBottom = 0;
            }
        }
        this.resetResolvedDrawables();
        this.resolveDrawables();
        this.invalidate();
        this.requestLayout();
    }

    ///**
    // * Sets the Drawables (if any) to appear to the start of, above,
    // * to the end of, and below the text.  Use 0 if you do not
    // * want a Drawable there. The Drawables' bounds will be set to
    // * their intrinsic bounds.
    // *
    // * @param start Resource identifier of the start Drawable.
    // * @param top Resource identifier of the top Drawable.
    // * @param end Resource identifier of the end Drawable.
    // * @param bottom Resource identifier of the bottom Drawable.
    // *
    // * @attr ref android.R.styleable#TextView_drawableStart
    // * @attr ref android.R.styleable#TextView_drawableTop
    // * @attr ref android.R.styleable#TextView_drawableEnd
    // * @attr ref android.R.styleable#TextView_drawableBottom
    // */
    //setCompoundDrawablesRelativeWithIntrinsicBounds(start:number, top:number, end:number, bottom:number):void  {
    //    const resources:Resources = this.getResources();
    //    this.setCompoundDrawablesRelativeWithIntrinsicBounds(start != 0 ? resources.getDrawable(start) : null, top != 0 ? resources.getDrawable(top) : null, end != 0 ? resources.getDrawable(end) : null, bottom != 0 ? resources.getDrawable(bottom) : null);
    //}

    /**
     * Sets the Drawables (if any) to appear to the start of, above,
     * to the end of, and below the text.  Use null if you do not
     * want a Drawable there. The Drawables' bounds will be set to
     * their intrinsic bounds.
     *
     * @attr ref android.R.styleable#TextView_drawableStart
     * @attr ref android.R.styleable#TextView_drawableTop
     * @attr ref android.R.styleable#TextView_drawableEnd
     * @attr ref android.R.styleable#TextView_drawableBottom
     */
    setCompoundDrawablesRelativeWithIntrinsicBounds(start:Drawable, top:Drawable, end:Drawable, bottom:Drawable):void  {
        if (start != null) {
            start.setBounds(0, 0, start.getIntrinsicWidth(), start.getIntrinsicHeight());
        }
        if (end != null) {
            end.setBounds(0, 0, end.getIntrinsicWidth(), end.getIntrinsicHeight());
        }
        if (top != null) {
            top.setBounds(0, 0, top.getIntrinsicWidth(), top.getIntrinsicHeight());
        }
        if (bottom != null) {
            bottom.setBounds(0, 0, bottom.getIntrinsicWidth(), bottom.getIntrinsicHeight());
        }
        this.setCompoundDrawablesRelative(start, top, end, bottom);
    }

    /**
     * Returns drawables for the left, top, right, and bottom borders.
     *
     * @attr ref android.R.styleable#TextView_drawableLeft
     * @attr ref android.R.styleable#TextView_drawableTop
     * @attr ref android.R.styleable#TextView_drawableRight
     * @attr ref android.R.styleable#TextView_drawableBottom
     */
    getCompoundDrawables():Drawable[]  {
        const dr:TextView.Drawables = this.mDrawables;
        if (dr != null) {
            return  [ dr.mDrawableLeft, dr.mDrawableTop, dr.mDrawableRight, dr.mDrawableBottom ];
        } else {
            return  [ null, null, null, null ];
        }
    }

    /**
     * Returns drawables for the start, top, end, and bottom borders.
     *
     * @attr ref android.R.styleable#TextView_drawableStart
     * @attr ref android.R.styleable#TextView_drawableTop
     * @attr ref android.R.styleable#TextView_drawableEnd
     * @attr ref android.R.styleable#TextView_drawableBottom
     */
    getCompoundDrawablesRelative():Drawable[]  {
        const dr:TextView.Drawables = this.mDrawables;
        if (dr != null) {
            return  [ dr.mDrawableStart, dr.mDrawableTop, dr.mDrawableEnd, dr.mDrawableBottom ];
        } else {
            return  [ null, null, null, null ];
        }
    }

    /**
     * Sets the size of the padding between the compound drawables and
     * the text.
     *
     * @attr ref android.R.styleable#TextView_drawablePadding
     */
    setCompoundDrawablePadding(pad:number):void  {
        let dr:TextView.Drawables = this.mDrawables;
        if (pad == 0) {
            if (dr != null) {
                dr.mDrawablePadding = pad;
            }
        } else {
            if (dr == null) {
                this.mDrawables = dr = new TextView.Drawables();
            }
            dr.mDrawablePadding = pad;
        }
        this.invalidate();
        this.requestLayout();
    }

    /**
     * Returns the padding between the compound drawables and the text.
     *
     * @attr ref android.R.styleable#TextView_drawablePadding
     */
    getCompoundDrawablePadding():number  {
        const dr:TextView.Drawables = this.mDrawables;
        return dr != null ? dr.mDrawablePadding : 0;
    }

    setPadding(left:number, top:number, right:number, bottom:number):void  {
        if (left != this.mPaddingLeft || right != this.mPaddingRight || top != this.mPaddingTop || bottom != this.mPaddingBottom) {
            this.nullLayouts();
        }
        // the super call will requestLayout()
        super.setPadding(left, top, right, bottom);
        this.invalidate();
    }

    //setPaddingRelative(start:number, top:number, end:number, bottom:number):void  {
    //    if (start != this.getPaddingStart() || end != this.getPaddingEnd() || top != this.mPaddingTop || bottom != this.mPaddingBottom) {
    //        this.nullLayouts();
    //    }
    //    // the super call will requestLayout()
    //    super.setPaddingRelative(start, top, end, bottom);
    //    this.invalidate();
    //}

    /**
     * Gets the autolink mask of the text.  See {@link
     * android.text.util.Linkify#ALL Linkify.ALL} and peers for
     * possible values.
     *
     * @attr ref android.R.styleable#TextView_autoLink
     */
    getAutoLinkMask():number  {
        return this.mAutoLinkMask;
    }

    ///**
    // * Sets the text color, size, style, hint color, and highlight color
    // * from the specified TextAppearance resource.
    // */
    //setTextAppearance(context:Context, resid:number):void  {
    //    let appearance:TypedArray = context.obtainStyledAttributes(resid, com.android.internal.R.styleable.TextAppearance);
    //    let color:number;
    //    let colors:ColorStateList;
    //    let ts:number;
    //    color = appearance.getColor(com.android.internal.R.styleable.TextAppearance_textColorHighlight, 0);
    //    if (color != 0) {
    //        this.setHighlightColor(color);
    //    }
    //    colors = appearance.getColorStateList(com.android.internal.R.styleable.TextAppearance_textColor);
    //    if (colors != null) {
    //        this.setTextColor(colors);
    //    }
    //    ts = appearance.getDimensionPixelSize(com.android.internal.R.styleable.TextAppearance_textSize, 0);
    //    if (ts != 0) {
    //        this.setRawTextSize(ts);
    //    }
    //    colors = appearance.getColorStateList(com.android.internal.R.styleable.TextAppearance_textColorHint);
    //    if (colors != null) {
    //        this.setHintTextColor(colors);
    //    }
    //    colors = appearance.getColorStateList(com.android.internal.R.styleable.TextAppearance_textColorLink);
    //    if (colors != null) {
    //        this.setLinkTextColor(colors);
    //    }
    //    let familyName:string;
    //    let typefaceIndex:number, styleIndex:number;
    //    familyName = appearance.getString(com.android.internal.R.styleable.TextAppearance_fontFamily);
    //    typefaceIndex = appearance.getInt(com.android.internal.R.styleable.TextAppearance_typeface, -1);
    //    styleIndex = appearance.getInt(com.android.internal.R.styleable.TextAppearance_textStyle, -1);
    //    this.setTypefaceFromAttrs(familyName, typefaceIndex, styleIndex);
    //    const shadowcolor:number = appearance.getInt(com.android.internal.R.styleable.TextAppearance_shadowColor, 0);
    //    if (shadowcolor != 0) {
    //        const dx:number = appearance.getFloat(com.android.internal.R.styleable.TextAppearance_shadowDx, 0);
    //        const dy:number = appearance.getFloat(com.android.internal.R.styleable.TextAppearance_shadowDy, 0);
    //        const r:number = appearance.getFloat(com.android.internal.R.styleable.TextAppearance_shadowRadius, 0);
    //        this.setShadowLayer(r, dx, dy, shadowcolor);
    //    }
    //    if (appearance.getBoolean(com.android.internal.R.styleable.TextAppearance_textAllCaps, false)) {
    //        this.setTransformationMethod(new AllCapsTransformationMethod());
    //    }
    //    appearance.recycle();
    //}

    /**
     * Get the default {@link Locale} of the text in this TextView.
     * @return the default {@link Locale} of the text in this TextView.
     */
    getTextLocale():any  {
        return null;
        //return this.mTextPaint.getTextLocale();
    }

    /**
     * Set the default {@link Locale} of the text in this TextView to the given value. This value
     * is used to choose appropriate typefaces for ambiguous characters. Typically used for CJK
     * locales to disambiguate Hanzi/Kanji/Hanja characters.
     *
     * @param locale the {@link Locale} for drawing text, must not be null.
     *
     * @see Paint#setTextLocale
     */
    setTextLocale(locale:any):void  {
        //this.mTextPaint.setTextLocale(locale);
    }

    /**
     * @return the size (in pixels) of the default text size in this TextView.
     */
    getTextSize():number  {
        return this.mTextPaint.getTextSize();
    }

    /**
     * Set the default text size to the given value, interpreted as "scaled
     * pixel" units.  This size is adjusted based on the current density and
     * user font size preference.
     *
     * @param size The scaled pixel size.
     *
     * @attr ref android.R.styleable#TextView_textSize
     */
    setTextSize(size:number):void;

    /**
     * Set the default text size to a given unit and value.  See {@link
     * TypedValue} for the possible dimension units.
     *
     * @param unit The desired dimension unit.
     * @param size The desired size in the given units.
     *
     * @attr ref android.R.styleable#TextView_textSize
     */
    setTextSize(unit:string, size:number):void;
    setTextSize(...args):void  {
        if(args.length==1){
            this.setTextSize(TypedValue.COMPLEX_UNIT_SP, <number>args[0]);
            return;
        }
        let [unit, size] = args;
        this.setRawTextSize(TypedValue.applyDimension(unit, size, this.getResources().getDisplayMetrics()));
    }

    protected setRawTextSize(size:number):void  {
        if (size != this.mTextPaint.getTextSize()) {
            this.mTextPaint.setTextSize(size);
            if (this.mLayout != null) {
                this.nullLayouts();
                this.requestLayout();
                this.invalidate();
            }
        }
    }

    /**
     * @return the extent by which text is currently being stretched
     * horizontally.  This will usually be 1.
     */
    getTextScaleX():number  {
        return 1;
        //return this.mTextPaint.getTextScaleX();
    }

    /**
     * Sets the extent by which text should be stretched horizontally.
     *
     * @attr ref android.R.styleable#TextView_textScaleX
     */
    setTextScaleX(size:number):void  {
        //if (size != this.mTextPaint.getTextScaleX()) {
        //    this.mUserSetTextScaleX = true;
        //    this.mTextPaint.setTextScaleX(size);
        //    if (this.mLayout != null) {
        //        this.nullLayouts();
        //        this.requestLayout();
        //        this.invalidate();
        //    }
        //}
    }

    ///**
    // * Sets the typeface and style in which the text should be displayed.
    // * Note that not all Typeface families actually have bold and italic
    // * variants, so you may need to use
    // * {@link #setTypeface(Typeface, int)} to get the appearance
    // * that you actually want.
    // *
    // * @see #getTypeface()
    // *
    // * @attr ref android.R.styleable#TextView_fontFamily
    // * @attr ref android.R.styleable#TextView_typeface
    // * @attr ref android.R.styleable#TextView_textStyle
    // */
    //setTypeface(tf:any):void  {
    //    if (this.mTextPaint.getTypeface() != tf) {
    //        this.mTextPaint.setTypeface(tf);
    //        if (this.mLayout != null) {
    //            this.nullLayouts();
    //            this.requestLayout();
    //            this.invalidate();
    //        }
    //    }
    //}

    /**
     * @return the current typeface and style in which the text is being
     * displayed.
     *
     * @see #setTypeface(Typeface)
     *
     * @attr ref android.R.styleable#TextView_fontFamily
     * @attr ref android.R.styleable#TextView_typeface
     * @attr ref android.R.styleable#TextView_textStyle
     */
    getTypeface():any  {
        return null;//TODO when Typeface impl
        //return this.mTextPaint.getTypeface();
    }

    /**
     * Sets the text color.
     *
     * @see #setTextColor(int)
     * @see #getTextColors()
     * @see #setHintTextColor(ColorStateList)
     * @see #setLinkTextColor(ColorStateList)
     *
     * @attr ref android.R.styleable#TextView_textColor
     */
    setTextColor(colors:ColorStateList|number):void  {
        if(typeof colors === 'number'){
            colors = ColorStateList.valueOf(<number>colors);
        }
        if (colors == null) {
            throw Error(`new NullPointerException()`);
        }
        this.mTextColor = <ColorStateList>colors;
        this.updateTextColors();
    }

    /**
     * Gets the text colors for the different states (normal, selected, focused) of the TextView.
     *
     * @see #setTextColor(ColorStateList)
     * @see #setTextColor(int)
     *
     * @attr ref android.R.styleable#TextView_textColor
     */
    getTextColors():ColorStateList  {
        return this.mTextColor;
    }

    /**
     * <p>Return the current color selected for normal text.</p>
     *
     * @return Returns the current text color.
     */
    getCurrentTextColor():number  {
        return this.mCurTextColor;
    }

    /**
     * Sets the color used to display the selection highlight.
     *
     * @attr ref android.R.styleable#TextView_textColorHighlight
     */
    setHighlightColor(color:number):void  {
        if (this.mHighlightColor != color) {
            this.mHighlightColor = color;
            this.invalidate();
        }
    }

    /**
     * @return the color used to display the selection highlight
     *
     * @see #setHighlightColor(int)
     *
     * @attr ref android.R.styleable#TextView_textColorHighlight
     */
    getHighlightColor():number  {
        return this.mHighlightColor;
    }

    /**
     * Sets whether the soft input method will be made visible when this
     * TextView gets focused. The default is true.
     * @hide
     */
    setShowSoftInputOnFocus(show:boolean):void  {
        this.createEditorIfNeeded();
        //this.mEditor.mShowSoftInputOnFocus = show;
    }

    /**
     * Returns whether the soft input method will be made visible when this
     * TextView gets focused. The default is true.
     * @hide
     */
    getShowSoftInputOnFocus():boolean  {
        return false;
        // When there is no Editor, return default true value
        //return this.mEditor == null || this.mEditor.mShowSoftInputOnFocus;
    }

    /**
     * Gives the text a shadow of the specified radius and color, the specified
     * distance from its normal position.
     *
     * @attr ref android.R.styleable#TextView_shadowColor
     * @attr ref android.R.styleable#TextView_shadowDx
     * @attr ref android.R.styleable#TextView_shadowDy
     * @attr ref android.R.styleable#TextView_shadowRadius
     */
    setShadowLayer(radius:number, dx:number, dy:number, color:number):void  {
        this.mTextPaint.setShadowLayer(radius, dx, dy, color);
        this.mShadowRadius = radius;
        this.mShadowDx = dx;
        this.mShadowDy = dy;
        // Will change text clip region
        //if (this.mEditor != null)
        //    this.mEditor.invalidateTextDisplayList();
        this.invalidate();
    }

    /**
     * Gets the radius of the shadow layer.
     *
     * @return the radius of the shadow layer. If 0, the shadow layer is not visible
     *
     * @see #setShadowLayer(float, float, float, int)
     *
     * @attr ref android.R.styleable#TextView_shadowRadius
     */
    getShadowRadius():number  {
        return this.mShadowRadius;
    }

    /**
     * @return the horizontal offset of the shadow layer
     *
     * @see #setShadowLayer(float, float, float, int)
     *
     * @attr ref android.R.styleable#TextView_shadowDx
     */
    getShadowDx():number  {
        return this.mShadowDx;
    }

    /**
     * @return the vertical offset of the shadow layer
     *
     * @see #setShadowLayer(float, float, float, int)
     *
     * @attr ref android.R.styleable#TextView_shadowDy
     */
    getShadowDy():number  {
        return this.mShadowDy;
    }

    /**
     * @return the color of the shadow layer
     *
     * @see #setShadowLayer(float, float, float, int)
     *
     * @attr ref android.R.styleable#TextView_shadowColor
     */
    getShadowColor():number  {
        return this.mTextPaint.shadowColor;
    }

    /**
     * @return the base paint used for the text.  Please use this only to
     * consult the Paint's properties and not to change them.
     */
    getPaint():TextPaint  {
        return this.mTextPaint;
    }

    /**
     * Sets the autolink mask of the text.  See {@link
     * android.text.util.Linkify#ALL Linkify.ALL} and peers for
     * possible values.
     *
     * @attr ref android.R.styleable#TextView_autoLink
     */
    setAutoLinkMask(mask:number):void  {
        this.mAutoLinkMask = mask;
    }

    /**
     * Sets whether the movement method will automatically be set to
     * {@link LinkMovementMethod} if {@link #setAutoLinkMask} has been
     * set to nonzero and links are detected in {@link #setText}.
     * The default is true.
     *
     * @attr ref android.R.styleable#TextView_linksClickable
     */
    setLinksClickable(whether:boolean):void  {
        this.mLinksClickable = whether;
    }

    /**
     * Returns whether the movement method will automatically be set to
     * {@link LinkMovementMethod} if {@link #setAutoLinkMask} has been
     * set to nonzero and links are detected in {@link #setText}.
     * The default is true.
     *
     * @attr ref android.R.styleable#TextView_linksClickable
     */
    getLinksClickable():boolean  {
        return this.mLinksClickable;
    }

    /**
     * Returns the list of URLSpans attached to the text
     * (by {@link Linkify} or otherwise) if any.  You can call
     * {@link URLSpan#getURL} on them to find where they link to
     * or use {@link Spanned#getSpanStart} and {@link Spanned#getSpanEnd}
     * to find the region of the text they are attached to.
     */
    getUrls():any[]  {
        //if (this.mText instanceof Spanned) {
        //    return (<Spanned> this.mText).getSpans(0, this.mText.length(), URLSpan.class);
        //} else {
            return new Array<any>(0);
        //}
    }

    /**
     * Sets the color of the hint text.
     *
     * @see #getHintTextColors()
     * @see #setHintTextColor(int)
     * @see #setTextColor(ColorStateList)
     * @see #setLinkTextColor(ColorStateList)
     *
     * @attr ref android.R.styleable#TextView_textColorHint
     */
    setHintTextColor(colors:ColorStateList|number):void  {
        if(typeof colors === 'number'){
            colors = ColorStateList.valueOf(<number>colors);
        }
        this.mHintTextColor = <ColorStateList>colors;
        this.updateTextColors();
    }

    /**
     * @return the color of the hint text, for the different states of this TextView.
     *
     * @see #setHintTextColor(ColorStateList)
     * @see #setHintTextColor(int)
     * @see #setTextColor(ColorStateList)
     * @see #setLinkTextColor(ColorStateList)
     *
     * @attr ref android.R.styleable#TextView_textColorHint
     */
    getHintTextColors():ColorStateList  {
        return this.mHintTextColor;
    }

    /**
     * <p>Return the current color selected to paint the hint text.</p>
     *
     * @return Returns the current hint text color.
     */
    getCurrentHintTextColor():number  {
        return this.mHintTextColor != null ? this.mCurHintTextColor : this.mCurTextColor;
    }

    /**
    * Sets the color of links in the text.
    *
    * @see #setLinkTextColor(int)
    * @see #getLinkTextColors()
    * @see #setTextColor(ColorStateList)
    * @see #setHintTextColor(ColorStateList)
    *
    * @attr ref android.R.styleable#TextView_textColorLink
    */
    setLinkTextColor(colors: number|ColorStateList): void {
        if (typeof colors === 'number') {
            colors = ColorStateList.valueOf(<number>colors);
        }
        this.mLinkTextColor = <ColorStateList>colors;
        this.updateTextColors();
    }

    /**
    * @return the list of colors used to paint the links in the text, for the different states of
    * this TextView
    *
    * @see #setLinkTextColor(ColorStateList)
    * @see #setLinkTextColor(int)
    *
    * @attr ref android.R.styleable#TextView_textColorLink
    */
    getLinkTextColors():ColorStateList  {
        return this.mLinkTextColor;
    }

    /**
     * Sets the horizontal alignment of the text and the
     * vertical gravity that will be used when there is extra space
     * in the TextView beyond what is required for the text itself.
     *
     * @see android.view.Gravity
     * @attr ref android.R.styleable#TextView_gravity
     */
    setGravity(gravity:number):void  {
        if ((gravity & Gravity.HORIZONTAL_GRAVITY_MASK) == 0) {
            gravity |= Gravity.LEFT;
        }
        if ((gravity & Gravity.VERTICAL_GRAVITY_MASK) == 0) {
            gravity |= Gravity.TOP;
        }
        let newLayout:boolean = false;
        if ((gravity & Gravity.HORIZONTAL_GRAVITY_MASK) != (this.mGravity & Gravity.HORIZONTAL_GRAVITY_MASK)) {
            newLayout = true;
        }
        if (gravity != this.mGravity) {
            this.invalidate();
        }
        this.mGravity = gravity;
        if (this.mLayout != null && newLayout) {
            // XXX this is heavy-handed because no actual content changes.
            let want:number = this.mLayout.getWidth();
            let hintWant:number = this.mHintLayout == null ? 0 : this.mHintLayout.getWidth();
            this.makeNewLayout(want, hintWant, TextView.UNKNOWN_BORING, TextView.UNKNOWN_BORING, this.mRight - this.mLeft - this.getCompoundPaddingLeft() - this.getCompoundPaddingRight(), true);
        }
    }

    /**
     * Returns the horizontal and vertical alignment of this TextView.
     *
     * @see android.view.Gravity
     * @attr ref android.R.styleable#TextView_gravity
     */
    getGravity():number  {
        return this.mGravity;
    }

    /**
     * @return the flags on the Paint being used to display the text.
     * @see Paint#getFlags
     */
    getPaintFlags():number  {
        return this.mTextPaint.getFlags();
    }

    /**
     * Sets flags on the Paint being used to display the text and
     * reflows the text if they are different from the old flags.
     * @see Paint#setFlags
     */
    setPaintFlags(flags:number):void  {
        if (this.mTextPaint.getFlags() != flags) {
            this.mTextPaint.setFlags(flags);
            if (this.mLayout != null) {
                this.nullLayouts();
                this.requestLayout();
                this.invalidate();
            }
        }
    }

    /**
     * Sets whether the text should be allowed to be wider than the
     * View is.  If false, it will be wrapped to the width of the View.
     *
     * @attr ref android.R.styleable#TextView_scrollHorizontally
     */
    setHorizontallyScrolling(whether:boolean):void  {
        if (this.mHorizontallyScrolling != whether) {
            this.mHorizontallyScrolling = whether;
            if (this.mLayout != null) {
                this.nullLayouts();
                this.requestLayout();
                this.invalidate();
            }
        }
    }

    /**
     * Returns whether the text is allowed to be wider than the View is.
     * If false, the text will be wrapped to the width of the View.
     *
     * @attr ref android.R.styleable#TextView_scrollHorizontally
     * @hide
     */
    getHorizontallyScrolling():boolean  {
        return this.mHorizontallyScrolling;
    }

    /**
     * Makes the TextView at least this many lines tall.
     *
     * Setting this value overrides any other (minimum) height setting. A single line TextView will
     * set this value to 1.
     *
     * @see #getMinLines()
     *
     * @attr ref android.R.styleable#TextView_minLines
     */
    setMinLines(minlines:number):void  {
        this.mMinimum = minlines;
        this.mMinMode = TextView.LINES;
        this.requestLayout();
        this.invalidate();
    }

    /**
     * @return the minimum number of lines displayed in this TextView, or -1 if the minimum
     * height was set in pixels instead using {@link #setMinHeight(int) or #setHeight(int)}.
     *
     * @see #setMinLines(int)
     *
     * @attr ref android.R.styleable#TextView_minLines
     */
    getMinLines():number  {
        return this.mMinMode == TextView.LINES ? this.mMinimum : -1;
    }

    /**
     * Makes the TextView at least this many pixels tall.
     *
     * Setting this value overrides any other (minimum) number of lines setting.
     *
     * @attr ref android.R.styleable#TextView_minHeight
     */
    setMinHeight(minHeight:number):void  {
        this.mMinimum = minHeight;
        this.mMinMode = TextView.PIXELS;
        this.requestLayout();
        this.invalidate();
    }

    /**
     * @return the minimum height of this TextView expressed in pixels, or -1 if the minimum
     * height was set in number of lines instead using {@link #setMinLines(int) or #setLines(int)}.
     *
     * @see #setMinHeight(int)
     *
     * @attr ref android.R.styleable#TextView_minHeight
     */
    getMinHeight():number  {
        return this.mMinMode == TextView.PIXELS ? this.mMinimum : -1;
    }

    /**
     * Makes the TextView at most this many lines tall.
     *
     * Setting this value overrides any other (maximum) height setting.
     *
     * @attr ref android.R.styleable#TextView_maxLines
     */
    setMaxLines(maxlines:number):void  {
        this.mMaximum = maxlines;
        this.mMaxMode = TextView.LINES;
        this.requestLayout();
        this.invalidate();
    }

    /**
     * @return the maximum number of lines displayed in this TextView, or -1 if the maximum
     * height was set in pixels instead using {@link #setMaxHeight(int) or #setHeight(int)}.
     *
     * @see #setMaxLines(int)
     *
     * @attr ref android.R.styleable#TextView_maxLines
     */
    getMaxLines():number  {
        return this.mMaxMode == TextView.LINES ? this.mMaximum : -1;
    }

    /**
     * Makes the TextView at most this many pixels tall.  This option is mutually exclusive with the
     * {@link #setMaxLines(int)} method.
     *
     * Setting this value overrides any other (maximum) number of lines setting.
     *
     * @attr ref android.R.styleable#TextView_maxHeight
     */
    setMaxHeight(maxHeight:number):void  {
        this.mMaximum = maxHeight;
        this.mMaxMode = TextView.PIXELS;
        this.requestLayout();
        this.invalidate();
    }

    /**
     * @return the maximum height of this TextView expressed in pixels, or -1 if the maximum
     * height was set in number of lines instead using {@link #setMaxLines(int) or #setLines(int)}.
     *
     * @see #setMaxHeight(int)
     *
     * @attr ref android.R.styleable#TextView_maxHeight
     */
    getMaxHeight():number  {
        return this.mMaxMode == TextView.PIXELS ? this.mMaximum : -1;
    }

    /**
     * Makes the TextView exactly this many lines tall.
     *
     * Note that setting this value overrides any other (minimum / maximum) number of lines or
     * height setting. A single line TextView will set this value to 1.
     *
     * @attr ref android.R.styleable#TextView_lines
     */
    setLines(lines:number):void  {
        this.mMaximum = this.mMinimum = lines;
        this.mMaxMode = this.mMinMode = TextView.LINES;
        this.requestLayout();
        this.invalidate();
    }

    /**
     * Makes the TextView exactly this many pixels tall.
     * You could do the same thing by specifying this number in the
     * LayoutParams.
     *
     * Note that setting this value overrides any other (minimum / maximum) number of lines or
     * height setting.
     *
     * @attr ref android.R.styleable#TextView_height
     */
    setHeight(pixels:number):void  {
        this.mMaximum = this.mMinimum = pixels;
        this.mMaxMode = this.mMinMode = TextView.PIXELS;
        this.requestLayout();
        this.invalidate();
    }

    /**
     * Makes the TextView at least this many ems wide
     *
     * @attr ref android.R.styleable#TextView_minEms
     */
    setMinEms(minems:number):void  {
        this.mMinWidthValue = minems;
        this.mMinWidthMode = TextView.EMS;
        this.requestLayout();
        this.invalidate();
    }

    /**
     * @return the minimum width of the TextView, expressed in ems or -1 if the minimum width
     * was set in pixels instead (using {@link #setMinWidth(int)} or {@link #setWidth(int)}).
     *
     * @see #setMinEms(int)
     * @see #setEms(int)
     *
     * @attr ref android.R.styleable#TextView_minEms
     */
    getMinEms():number  {
        return this.mMinWidthMode == TextView.EMS ? this.mMinWidthValue : -1;
    }

    /**
     * Makes the TextView at least this many pixels wide
     *
     * @attr ref android.R.styleable#TextView_minWidth
     */
    setMinWidth(minpixels:number):void  {
        this.mMinWidthValue = minpixels;
        this.mMinWidthMode = TextView.PIXELS;
        this.requestLayout();
        this.invalidate();
    }

    /**
     * @return the minimum width of the TextView, in pixels or -1 if the minimum width
     * was set in ems instead (using {@link #setMinEms(int)} or {@link #setEms(int)}).
     *
     * @see #setMinWidth(int)
     * @see #setWidth(int)
     *
     * @attr ref android.R.styleable#TextView_minWidth
     */
    getMinWidth():number  {
        return this.mMinWidthMode == TextView.PIXELS ? this.mMinWidthValue : -1;
    }

    /**
     * Makes the TextView at most this many ems wide
     *
     * @attr ref android.R.styleable#TextView_maxEms
     */
    setMaxEms(maxems:number):void  {
        this.mMaxWidthValue = maxems;
        this.mMaxWidthMode = TextView.EMS;
        this.requestLayout();
        this.invalidate();
    }

    /**
     * @return the maximum width of the TextView, expressed in ems or -1 if the maximum width
     * was set in pixels instead (using {@link #setMaxWidth(int)} or {@link #setWidth(int)}).
     *
     * @see #setMaxEms(int)
     * @see #setEms(int)
     *
     * @attr ref android.R.styleable#TextView_maxEms
     */
    getMaxEms():number  {
        return this.mMaxWidthMode == TextView.EMS ? this.mMaxWidthValue : -1;
    }

    /**
     * Makes the TextView at most this many pixels wide
     *
     * @attr ref android.R.styleable#TextView_maxWidth
     */
    setMaxWidth(maxpixels:number):void  {
        this.mMaxWidthValue = maxpixels;
        this.mMaxWidthMode = TextView.PIXELS;
        this.requestLayout();
        this.invalidate();
    }

    /**
     * @return the maximum width of the TextView, in pixels or -1 if the maximum width
     * was set in ems instead (using {@link #setMaxEms(int)} or {@link #setEms(int)}).
     *
     * @see #setMaxWidth(int)
     * @see #setWidth(int)
     *
     * @attr ref android.R.styleable#TextView_maxWidth
     */
    getMaxWidth():number  {
        return this.mMaxWidthMode == TextView.PIXELS ? this.mMaxWidthValue : -1;
    }

    /**
     * Makes the TextView exactly this many ems wide
     *
     * @see #setMaxEms(int)
     * @see #setMinEms(int)
     * @see #getMinEms()
     * @see #getMaxEms()
     *
     * @attr ref android.R.styleable#TextView_ems
     */
    setEms(ems:number):void  {
        this.mMaxWidthValue = this.mMinWidthValue = ems;
        this.mMaxWidthMode = this.mMinWidthMode = TextView.EMS;
        this.requestLayout();
        this.invalidate();
    }

    /**
     * Makes the TextView exactly this many pixels wide.
     * You could do the same thing by specifying this number in the
     * LayoutParams.
     *
     * @see #setMaxWidth(int)
     * @see #setMinWidth(int)
     * @see #getMinWidth()
     * @see #getMaxWidth()
     *
     * @attr ref android.R.styleable#TextView_width
     */
    setWidth(pixels:number):void  {
        this.mMaxWidthValue = this.mMinWidthValue = pixels;
        this.mMaxWidthMode = this.mMinWidthMode = TextView.PIXELS;
        this.requestLayout();
        this.invalidate();
    }

    /**
     * Sets line spacing for this TextView.  Each line will have its height
     * multiplied by <code>mult</code> and have <code>add</code> added to it.
     *
     * @attr ref android.R.styleable#TextView_lineSpacingExtra
     * @attr ref android.R.styleable#TextView_lineSpacingMultiplier
     */
    setLineSpacing(add:number, mult:number):void  {
        if (this.mSpacingAdd != add || this.mSpacingMult != mult) {
            this.mSpacingAdd = add;
            this.mSpacingMult = mult;
            if (this.mLayout != null) {
                this.nullLayouts();
                this.requestLayout();
                this.invalidate();
            }
        }
    }

    /**
     * Gets the line spacing multiplier
     *
     * @return the value by which each line's height is multiplied to get its actual height.
     *
     * @see #setLineSpacing(float, float)
     * @see #getLineSpacingExtra()
     *
     * @attr ref android.R.styleable#TextView_lineSpacingMultiplier
     */
    getLineSpacingMultiplier():number  {
        return this.mSpacingMult;
    }

    /**
     * Gets the line spacing extra space
     *
     * @return the extra space that is added to the height of each lines of this TextView.
     *
     * @see #setLineSpacing(float, float)
     * @see #getLineSpacingMultiplier()
     *
     * @attr ref android.R.styleable#TextView_lineSpacingExtra
     */
    getLineSpacingExtra():number  {
        return this.mSpacingAdd;
    }

    ///**
    // * Convenience method: Append the specified text slice to the TextView's
    // * display buffer, upgrading it to TextView.BufferType.EDITABLE if it was
    // * not already editable.
    // */
    //append(text:String, start=0, end=text.length):void  {
    //    if (!(this.mText instanceof Editable)) {
    //        this.setText(this.mText, TextView.BufferType.EDITABLE);
    //    }
    //    (<Editable> this.mText).append(text, start, end);
    //}

    protected updateTextColors():void  {
        let inval:boolean = false;
        let color:number = this.mTextColor.getColorForState(this.getDrawableState(), 0);
        if (color != this.mCurTextColor) {
            this.mCurTextColor = color;
            inval = true;
        }
        if (this.mLinkTextColor != null) {
            color = this.mLinkTextColor.getColorForState(this.getDrawableState(), 0);
            if (color != this.mTextPaint.linkColor) {
                this.mTextPaint.linkColor = color;
                inval = true;
            }
        }
        if (this.mHintTextColor != null) {
            color = this.mHintTextColor.getColorForState(this.getDrawableState(), 0);
            if (color != this.mCurHintTextColor && this.mText.length == 0) {
                this.mCurHintTextColor = color;
                inval = true;
            }
        }
        if (inval) {
            // Text needs to be redrawn with the new color
            //if (this.mEditor != null)
            //    this.mEditor.invalidateTextDisplayList();
            this.invalidate();
        }
    }

    protected drawableStateChanged():void  {
        super.drawableStateChanged();
        if (this.mTextColor != null && this.mTextColor.isStateful() || (this.mHintTextColor != null && this.mHintTextColor.isStateful()) || (this.mLinkTextColor != null && this.mLinkTextColor.isStateful())) {
            this.updateTextColors();
        }
        const dr:TextView.Drawables = this.mDrawables;
        if (dr != null) {
            let state:number[] = this.getDrawableState();
            if (dr.mDrawableTop != null && dr.mDrawableTop.isStateful()) {
                dr.mDrawableTop.setState(state);
            }
            if (dr.mDrawableBottom != null && dr.mDrawableBottom.isStateful()) {
                dr.mDrawableBottom.setState(state);
            }
            if (dr.mDrawableLeft != null && dr.mDrawableLeft.isStateful()) {
                dr.mDrawableLeft.setState(state);
            }
            if (dr.mDrawableRight != null && dr.mDrawableRight.isStateful()) {
                dr.mDrawableRight.setState(state);
            }
            if (dr.mDrawableStart != null && dr.mDrawableStart.isStateful()) {
                dr.mDrawableStart.setState(state);
            }
            if (dr.mDrawableEnd != null && dr.mDrawableEnd.isStateful()) {
                dr.mDrawableEnd.setState(state);
            }
        }
    }

    //onSaveInstanceState():Parcelable  {
    //    let superState:Parcelable = super.onSaveInstanceState();
    //    // Save state if we are forced to
    //    let save:boolean = this.mFreezesText;
    //    let start:number = 0;
    //    let end:number = 0;
    //    if (this.mText != null) {
    //        start = this.getSelectionStart();
    //        end = this.getSelectionEnd();
    //        if (start >= 0 || end >= 0) {
    //            // Or save state if there is a selection
    //            save = true;
    //        }
    //    }
    //    if (save) {
    //        let ss:TextView.SavedState = new TextView.SavedState(superState);
    //        // XXX Should also save the current scroll position!
    //        ss.selStart = start;
    //        ss.selEnd = end;
    //        if (this.mText instanceof Spanned) {
    //            let sp:Spannable = new SpannableStringBuilder(this.mText);
    //            if (this.mEditor != null) {
    //                this.removeMisspelledSpans(sp);
    //                sp.removeSpan(this.mEditor.mSuggestionRangeSpan);
    //            }
    //            ss.text = sp;
    //        } else {
    //            ss.text = this.mText.toString();
    //        }
    //        if (this.isFocused() && start >= 0 && end >= 0) {
    //            ss.frozenWithFocus = true;
    //        }
    //        ss.error = this.getError();
    //        return ss;
    //    }
    //    return superState;
    //}

    removeMisspelledSpans(spannable:Spannable):void  {
        //let suggestionSpans:SuggestionSpan[] = spannable.getSpans(0, spannable.length(), SuggestionSpan.class);
        //for (let i:number = 0; i < suggestionSpans.length; i++) {
        //    let flags:number = suggestionSpans[i].getFlags();
        //    if ((flags & SuggestionSpan.FLAG_EASY_CORRECT) != 0 && (flags & SuggestionSpan.FLAG_MISSPELLED) != 0) {
        //        spannable.removeSpan(suggestionSpans[i]);
        //    }
        //}
    }

    //onRestoreInstanceState(state:Parcelable):void  {
    //    if (!(state instanceof TextView.SavedState)) {
    //        super.onRestoreInstanceState(state);
    //        return;
    //    }
    //    let ss:TextView.SavedState = <TextView.SavedState> state;
    //    super.onRestoreInstanceState(ss.getSuperState());
    //    // XXX restore buffer type too, as well as lots of other stuff
    //    if (ss.text != null) {
    //        this.setText(ss.text);
    //    }
    //    if (ss.selStart >= 0 && ss.selEnd >= 0) {
    //        if (this.mText instanceof Spannable) {
    //            let len:number = this.mText.length();
    //            if (ss.selStart > len || ss.selEnd > len) {
    //                let restored:string = "";
    //                if (ss.text != null) {
    //                    restored = "(restored) ";
    //                }
    //                Log.e(TextView.LOG_TAG, "Saved cursor position " + ss.selStart + "/" + ss.selEnd + " out of range for " + restored + "text " + this.mText);
    //            } else {
    //                Selection.setSelection(<Spannable> this.mText, ss.selStart, ss.selEnd);
    //                if (ss.frozenWithFocus) {
    //                    this.createEditorIfNeeded();
    //                    this.mEditor.mFrozenWithFocus = true;
    //                }
    //            }
    //        }
    //    }
    //    if (ss.error != null) {
    //        const error:CharSequence = ss.error;
    //        // Display the error later, after the first layout pass
    //        this.post((()=>{
    //            const _this=this;
    //            class _Inner extends Runnable {
    //
    //                run():void  {
    //                    _this.setError(error);
    //                }
    //            }
    //            return new _Inner();
    //        })());
    //    }
    //}

    /**
     * Control whether this text view saves its entire text contents when
     * freezing to an icicle, in addition to dynamic state such as cursor
     * position.  By default this is false, not saving the text.  Set to true
     * if the text in the text view is not being saved somewhere else in
     * persistent storage (such as in a content provider) so that if the
     * view is later thawed the user will not lose their data.
     *
     * @param freezesText Controls whether a frozen icicle should include the
     * entire text data: true to include it, false to not.
     *
     * @attr ref android.R.styleable#TextView_freezesText
     */
    setFreezesText(freezesText:boolean):void  {
        this.mFreezesText = freezesText;
    }

    /**
     * Return whether this text view is including its entire text contents
     * in frozen icicles.
     *
     * @return Returns true if text is included, false if it isn't.
     *
     * @see #setFreezesText
     */
    getFreezesText():boolean  {
        return this.mFreezesText;
    }

    ///////////////////////////////////////////////////////////////////////////
    ///**
    // * Sets the Factory used to create new Editables.
    // */
    //setEditableFactory(factory:Editable.Factory):void  {
    //    this.mEditableFactory = factory;
    //    this.setText(this.mText);
    //}

    /**
     * Sets the Factory used to create new Spannables.
     */
    setSpannableFactory(factory:Spannable.Factory):void  {
        this.mSpannableFactory = factory;
        this.setText(this.mText);
    }

    /**
     * Like {@link #setText(CharSequence)},
     * except that the cursor position (if any) is retained in the new text.
     *
     * @param text The new text to place in the text view.
     *
     * @see #setText(CharSequence)
     */
    //setTextKeepState(text:CharSequence):void  {
    //    this.setTextKeepState(text, this.mBufferType);
    //}

    setText(text:String, type=this.mBufferType, notifyBefore=true, oldlen=0):void  {
        if (text == null) {
            text = "";
        }
        // If suggestions are not enabled, remove the suggestion spans from the text
        if (!this.isSuggestionsEnabled()) {
            text = this.removeSuggestionSpans(text);
        }
        //if (!this.mUserSetTextScaleX) this.mTextPaint.setTextScaleX(1.0);
        if (Spanned.isImplements(text) && (<Spanned> text).getSpanStart(TextUtils.TruncateAt.MARQUEE) >= 0) {
            //if (ViewConfiguration.get().isFadingMarqueeEnabled()) {
                this.setHorizontalFadingEdgeEnabled(true);
                this.mMarqueeFadeMode = TextView.MARQUEE_FADE_NORMAL;
            //} else {
            //    this.setHorizontalFadingEdgeEnabled(false);
            //    this.mMarqueeFadeMode = TextView.MARQUEE_FADE_SWITCH_SHOW_ELLIPSIS;
            //}
            this.setEllipsize(TextUtils.TruncateAt.MARQUEE);
        }
        //let n:number = this.mFilters.length;//TODO when filter impl
        //for (let i:number = 0; i < n; i++) {
        //    let out:CharSequence = this.mFilters[i].filter(text, 0, text.length(), TextView.EMPTY_SPANNED, 0, 0);
        //    if (out != null) {
        //        text = out;
        //    }
        //}
        if (notifyBefore) {
            if (this.mText != null) {
                oldlen = this.mText.length;
                this.sendBeforeTextChanged(this.mText, 0, oldlen, text.length);
            } else {
                this.sendBeforeTextChanged("", 0, 0, text.length);
            }
        }
        let needEditableForNotification:boolean = false;
        if (this.mListeners != null && this.mListeners.size() != 0) {
            needEditableForNotification = true;
        }
        //if (type == TextView.BufferType.EDITABLE || this.getKeyListener() != null || needEditableForNotification) {
        //    this.createEditorIfNeeded();
        //    let t:Editable = this.mEditableFactory.newEditable(text);
        //    text = t;
        //    this.setFilters(t, this.mFilters);
        //    let imm:InputMethodManager = InputMethodManager.peekInstance();
        //    if (imm != null)
        //        imm.restartInput(this);
        //
        // } else
        if (type == TextView.BufferType.SPANNABLE || this.mMovement != null) {
            text = this.mSpannableFactory.newSpannable(text);
        }
        //else if (!(text instanceof TextView.CharWrapper)) {
        //    text = TextUtils.stringOrSpannedString(text);
        //}
        //if (this.mAutoLinkMask != 0) {
        //    let s2:Spannable;
        //    if (type == TextView.BufferType.EDITABLE || text instanceof Spannable) {
        //        s2 = <Spannable> text;
        //    } else {
        //        s2 = this.mSpannableFactory.newSpannable(text);
        //    }
        //    if (Linkify.addLinks(s2, this.mAutoLinkMask)) {
        //        text = s2;
        //        type = (type == TextView.BufferType.EDITABLE) ? TextView.BufferType.EDITABLE : TextView.BufferType.SPANNABLE;
        //        /*
        //         * We must go ahead and set the text before changing the
        //         * movement method, because setMovementMethod() may call
        //         * setText() again to try to upgrade the buffer type.
        //         */
        //        this.mText = text;
        //        // would prevent an arbitrary cursor displacement.
        //        if (this.mLinksClickable && !this.textCanBeSelected()) {
        //            this.setMovementMethod(LinkMovementMethod.getInstance());
        //        }
        //    }
        //}
        this.mBufferType = type;
        this.mText = text;
        if (this.mTransformation == null) {
            this.mTransformed = text;
        } else {
            this.mTransformed = this.mTransformation.getTransformation(text, this);
        }
        const textLength:number = text.length;
        //if (Spannable.isImpl(text) && !this.mAllowTransformationLengthChange) {
        //    let sp:Spannable = <Spannable> text;
        //    // Remove any ChangeWatchers that might have come from other TextViews.
        //    const watchers:TextView.ChangeWatcher[] = sp.getSpans(0, sp.length, TextView.ChangeWatcher.type);
        //    const count:number = watchers.length;
        //    for (let i:number = 0; i < count; i++) {
        //        sp.removeSpan(watchers[i]);
        //    }
        //    if (this.mChangeWatcher == null)
        //        this.mChangeWatcher = new TextView.ChangeWatcher(this);
        //    sp.setSpan(this.mChangeWatcher, 0, textLength, Spanned.SPAN_INCLUSIVE_INCLUSIVE | (TextView.CHANGE_WATCHER_PRIORITY << Spanned.SPAN_PRIORITY_SHIFT));
        //    //if (this.mEditor != null) this.mEditor.addSpanWatchers(sp);
        //    if (this.mTransformation != null) {
        //        sp.setSpan(this.mTransformation, 0, textLength, Spanned.SPAN_INCLUSIVE_INCLUSIVE);
        //    }
        //    if (this.mMovement != null) {
        //        this.mMovement.initialize(this, <Spannable> text);
        //        /*
        //         * Initializing the movement method will have set the
        //         * selection, so reset mSelectionMoved to keep that from
        //         * interfering with the normal on-focus selection-setting.
        //         */
        //        //if (this.mEditor != null)
        //        //    this.mEditor.mSelectionMoved = false;
        //    }
        //}
        if (this.mLayout != null) {
            this.checkForRelayout();
        }
        this.sendOnTextChanged(text, 0, oldlen, textLength);
        this.onTextChanged(text, 0, oldlen, textLength);
        //this.notifyViewAccessibilityStateChangedIfNeeded(AccessibilityEvent.CONTENT_CHANGE_TYPE_TEXT);
        //if (needEditableForNotification) {
        //    this.sendAfterTextChanged(<Editable> text);
        //}
        // SelectionModifierCursorController depends on textCanBeSelected, which depends on text
        //if (this.mEditor != null)
        //    this.mEditor.prepareCursorControllers();
    }

    /**
     * Sets the TextView to display the specified slice of the specified
     * char array.  You must promise that you will not change the contents
     * of the array except for right before another call to setText(),
     * since the TextView has no way to know that the text
     * has changed and that it needs to invalidate and re-layout.
     */
    //setText(text:string[], start:number, len:number):void  {
    //    let oldlen:number = 0;
    //    if (start < 0 || len < 0 || start + len > text.length) {
    //        throw Error(`new IndexOutOfBoundsException(start + ", " + len)`);
    //    }
    //    /*
    //     * We must do the before-notification here ourselves because if
    //     * the old text is a CharWrapper we destroy it before calling
    //     * into the normal path.
    //     */
    //    if (this.mText != null) {
    //        oldlen = this.mText.length();
    //        this.sendBeforeTextChanged(this.mText, 0, oldlen, len);
    //    } else {
    //        this.sendBeforeTextChanged("", 0, 0, len);
    //    }
    //    if (this.mCharWrapper == null) {
    //        this.mCharWrapper = new TextView.CharWrapper(text, start, len);
    //    } else {
    //        this.mCharWrapper.set(text, start, len);
    //    }
    //    this.setText(this.mCharWrapper, this.mBufferType, false, oldlen);
    //}

    ///**
    // * Like {@link #setText(CharSequence, android.widget.TextView.BufferType)},
    // * except that the cursor position (if any) is retained in the new text.
    // *
    // * @see #setText(CharSequence, android.widget.TextView.BufferType)
    // */
    //setTextKeepState(text:CharSequence, type:TextView.BufferType):void  {
    //    let start:number = this.getSelectionStart();
    //    let end:number = this.getSelectionEnd();
    //    let len:number = text.length();
    //    this.setText(text, type);
    //    if (start >= 0 || end >= 0) {
    //        if (this.mText instanceof Spannable) {
    //            Selection.setSelection(<Spannable> this.mText, Math.max(0, Math.min(start, len)), Math.max(0, Math.min(end, len)));
    //        }
    //    }
    //}

    /**
     * Sets the text to be displayed when the text of the TextView is empty.
     * Null means to use the normal empty text. The hint does not currently
     * participate in determining the size of the view.
     *
     * @attr ref android.R.styleable#TextView_hint
     */
    setHint(hint:String):void  {
        this.mHint = hint;//TextUtils.stringOrSpannedString(hint);
        if (this.mLayout != null) {
            this.checkForRelayout();
        }
        if (this.mText.length == 0) {
            this.invalidate();
        }
        // Invalidate display list if hint is currently used
        //if (this.mEditor != null && this.mText.length() == 0 && this.mHint != null) {
        //    this.mEditor.invalidateTextDisplayList();
        //}
    }

    /**
     * Returns the hint that is displayed when the text of the TextView
     * is empty.
     *
     * @attr ref android.R.styleable#TextView_hint
     */
    getHint():String  {
        return this.mHint;
    }

    isSingleLine():boolean  {
        return this.mSingleLine;
    }

    private static isMultilineInputType(type:number):boolean  {
        return true;
        //return (type & (EditorInfo.TYPE_MASK_CLASS | EditorInfo.TYPE_TEXT_FLAG_MULTI_LINE)) == (EditorInfo.TYPE_CLASS_TEXT | EditorInfo.TYPE_TEXT_FLAG_MULTI_LINE);
    }

    /**
     * Removes the suggestion spans.
     */
    removeSuggestionSpans(text:String):String  {
        //if (text instanceof Spanned) {
        //    let spannable:Spannable;
        //    if (text instanceof Spannable) {
        //        spannable = <Spannable> text;
        //    } else {
        //        spannable = new SpannableString(text);
        //        text = spannable;
        //    }
        //    let spans:SuggestionSpan[] = spannable.getSpans(0, text.length(), SuggestionSpan.class);
        //    for (let i:number = 0; i < spans.length; i++) {
        //        spannable.removeSpan(spans[i]);
        //    }
        //}
        return text;
    }

    ///**
    // * Set the type of the content with a constant as defined for {@link EditorInfo#inputType}. This
    // * will take care of changing the key listener, by calling {@link #setKeyListener(KeyListener)},
    // * to match the given content type.  If the given content type is {@link EditorInfo#TYPE_NULL}
    // * then a soft keyboard will not be displayed for this text view.
    // *
    // * Note that the maximum number of displayed lines (see {@link #setMaxLines(int)}) will be
    // * modified if you change the {@link EditorInfo#TYPE_TEXT_FLAG_MULTI_LINE} flag of the input
    // * type.
    // *
    // * @see #getInputType()
    // * @see #setRawInputType(int)
    // * @see android.text.InputType
    // * @attr ref android.R.styleable#TextView_inputType
    // */
    //setInputType(type:number):void  {
    //    const wasPassword:boolean = TextView.isPasswordInputType(this.getInputType());
    //    const wasVisiblePassword:boolean = TextView.isVisiblePasswordInputType(this.getInputType());
    //    this.setInputType(type, false);
    //    const isPassword:boolean = TextView.isPasswordInputType(type);
    //    const isVisiblePassword:boolean = TextView.isVisiblePasswordInputType(type);
    //    let forceUpdate:boolean = false;
    //    if (isPassword) {
    //        this.setTransformationMethod(PasswordTransformationMethod.getInstance());
    //        this.setTypefaceFromAttrs(null, /* fontFamily */
    //        TextView.MONOSPACE, 0);
    //    } else if (isVisiblePassword) {
    //        if (this.mTransformation == PasswordTransformationMethod.getInstance()) {
    //            forceUpdate = true;
    //        }
    //        this.setTypefaceFromAttrs(null, /* fontFamily */
    //        TextView.MONOSPACE, 0);
    //    } else if (wasPassword || wasVisiblePassword) {
    //        // not in password mode, clean up typeface and transformation
    //        this.setTypefaceFromAttrs(null, /* fontFamily */
    //        -1, -1);
    //        if (this.mTransformation == PasswordTransformationMethod.getInstance()) {
    //            forceUpdate = true;
    //        }
    //    }
    //    let singleLine:boolean = !TextView.isMultilineInputType(type);
    //    // were previously in password mode.
    //    if (this.mSingleLine != singleLine || forceUpdate) {
    //        // Change single line mode, but only change the transformation if
    //        // we are not in password mode.
    //        this.applySingleLine(singleLine, !isPassword, true);
    //    }
    //    if (!this.isSuggestionsEnabled()) {
    //        this.mText = this.removeSuggestionSpans(this.mText);
    //    }
    //    let imm:InputMethodManager = InputMethodManager.peekInstance();
    //    if (imm != null)
    //        imm.restartInput(this);
    //}

    /**
     * It would be better to rely on the input type for everything. A password inputType should have
     * a password transformation. We should hence use isPasswordInputType instead of this method.
     *
     * We should:
     * - Call setInputType in setKeyListener instead of changing the input type directly (which
     * would install the correct transformation).
     * - Refuse the installation of a non-password transformation in setTransformation if the input
     * type is password.
     *
     * However, this is like this for legacy reasons and we cannot break existing apps. This method
     * is useful since it matches what the user can see (obfuscated text or not).
     *
     * @return true if the current transformation method is of the password type.
     */
    private hasPasswordTransformationMethod():boolean  {
        return false;
        //return this.mTransformation instanceof PasswordTransformationMethod;
    }

    private static isPasswordInputType(inputType:number):boolean  {
        return false;
        //const variation:number = inputType & (EditorInfo.TYPE_MASK_CLASS | EditorInfo.TYPE_MASK_VARIATION);
        //return variation == (EditorInfo.TYPE_CLASS_TEXT | EditorInfo.TYPE_TEXT_VARIATION_PASSWORD) || variation == (EditorInfo.TYPE_CLASS_TEXT | EditorInfo.TYPE_TEXT_VARIATION_WEB_PASSWORD) || variation == (EditorInfo.TYPE_CLASS_NUMBER | EditorInfo.TYPE_NUMBER_VARIATION_PASSWORD);
    }

    private static isVisiblePasswordInputType(inputType:number):boolean  {
        return true;
        //const variation:number = inputType & (EditorInfo.TYPE_MASK_CLASS | EditorInfo.TYPE_MASK_VARIATION);
        //return variation == (EditorInfo.TYPE_CLASS_TEXT | EditorInfo.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD);
    }

    /**
     * Directly change the content type integer of the text view, without
     * modifying any other state.
     * @see #setInputType(int)
     * @see android.text.InputType
     * @attr ref android.R.styleable#TextView_inputType
     */
    setRawInputType(type:number):void  {
        //TYPE_NULL is the default value
        //if (type == InputType.TYPE_NULL && this.mEditor == null)
        //    return;
        //this.createEditorIfNeeded();
        //this.mEditor.mInputType = type;
    }

    setInputType(type:number, direct:boolean=false):void  {
        //const cls:number = type & EditorInfo.TYPE_MASK_CLASS;
        //let input:KeyListener;
        //if (cls == EditorInfo.TYPE_CLASS_TEXT) {
        //    let autotext:boolean = (type & EditorInfo.TYPE_TEXT_FLAG_AUTO_CORRECT) != 0;
        //    let cap:TextKeyListener.Capitalize;
        //    if ((type & EditorInfo.TYPE_TEXT_FLAG_CAP_CHARACTERS) != 0) {
        //        cap = TextKeyListener.Capitalize.CHARACTERS;
        //    } else if ((type & EditorInfo.TYPE_TEXT_FLAG_CAP_WORDS) != 0) {
        //        cap = TextKeyListener.Capitalize.WORDS;
        //    } else if ((type & EditorInfo.TYPE_TEXT_FLAG_CAP_SENTENCES) != 0) {
        //        cap = TextKeyListener.Capitalize.SENTENCES;
        //    } else {
        //        cap = TextKeyListener.Capitalize.NONE;
        //    }
        //    input = TextKeyListener.getInstance(autotext, cap);
        //} else if (cls == EditorInfo.TYPE_CLASS_NUMBER) {
        //    input = DigitsKeyListener.getInstance((type & EditorInfo.TYPE_NUMBER_FLAG_SIGNED) != 0, (type & EditorInfo.TYPE_NUMBER_FLAG_DECIMAL) != 0);
        //} else if (cls == EditorInfo.TYPE_CLASS_DATETIME) {
        //    switch(type & EditorInfo.TYPE_MASK_VARIATION) {
        //        case EditorInfo.TYPE_DATETIME_VARIATION_DATE:
        //            input = DateKeyListener.getInstance();
        //            break;
        //        case EditorInfo.TYPE_DATETIME_VARIATION_TIME:
        //            input = TimeKeyListener.getInstance();
        //            break;
        //        default:
        //            input = DateTimeKeyListener.getInstance();
        //            break;
        //    }
        //} else if (cls == EditorInfo.TYPE_CLASS_PHONE) {
        //    input = DialerKeyListener.getInstance();
        //} else {
        //    input = TextKeyListener.getInstance();
        //}
        //this.setRawInputType(type);
        //if (direct) {
        //    this.createEditorIfNeeded();
        //    this.mEditor.mKeyListener = input;
        //} else {
        //    this.setKeyListenerOnly(input);
        //}
    }

    /**
     * Get the type of the editable content.
     *
     * @see #setInputType(int)
     * @see android.text.InputType
     */
    getInputType():number  {
        return 0;
        //return this.mEditor == null ? EditorInfo.TYPE_NULL : this.mEditor.mInputType;
    }

    /**
     * Change the editor type integer associated with the text view, which
     * will be reported to an IME with {@link EditorInfo#imeOptions} when it
     * has focus.
     * @see #getImeOptions
     * @see android.view.inputmethod.EditorInfo
     * @attr ref android.R.styleable#TextView_imeOptions
     */
    setImeOptions(imeOptions:number):void  {
        //this.createEditorIfNeeded();
        //this.mEditor.createInputContentTypeIfNeeded();
        //this.mEditor.mInputContentType.imeOptions = imeOptions;
    }

    /**
     * Get the type of the IME editor.
     *
     * @see #setImeOptions(int)
     * @see android.view.inputmethod.EditorInfo
     */
    getImeOptions():number  {
        return -1;
        //return this.mEditor != null && this.mEditor.mInputContentType != null ? this.mEditor.mInputContentType.imeOptions : EditorInfo.IME_NULL;
    }

    /**
     * Change the custom IME action associated with the text view, which
     * will be reported to an IME with {@link EditorInfo#actionLabel}
     * and {@link EditorInfo#actionId} when it has focus.
     * @see #getImeActionLabel
     * @see #getImeActionId
     * @see android.view.inputmethod.EditorInfo
     * @attr ref android.R.styleable#TextView_imeActionLabel
     * @attr ref android.R.styleable#TextView_imeActionId
     */
    setImeActionLabel(label:String, actionId:number):void  {
        this.createEditorIfNeeded();
        //this.mEditor.createInputContentTypeIfNeeded();
        //this.mEditor.mInputContentType.imeActionLabel = label;
        //this.mEditor.mInputContentType.imeActionId = actionId;
    }

    /**
     * Get the IME action label previous set with {@link #setImeActionLabel}.
     *
     * @see #setImeActionLabel
     * @see android.view.inputmethod.EditorInfo
     */
    getImeActionLabel():String  {
        return '';
        //return this.mEditor != null && this.mEditor.mInputContentType != null ? this.mEditor.mInputContentType.imeActionLabel : null;
    }

    /**
     * Get the IME action ID previous set with {@link #setImeActionLabel}.
     *
     * @see #setImeActionLabel
     * @see android.view.inputmethod.EditorInfo
     */
    getImeActionId():number  {
        return 0;
        //return this.mEditor != null && this.mEditor.mInputContentType != null ? this.mEditor.mInputContentType.imeActionId : 0;
    }

    /**
     * Set a special listener to be called when an action is performed
     * on the text view.  This will be called when the enter key is pressed,
     * or when an action supplied to the IME is selected by the user.  Setting
     * this means that the normal hard key event will not insert a newline
     * into the text view, even if it is multi-line; holding down the ALT
     * modifier will, however, allow the user to insert a newline character.
     */
    setOnEditorActionListener(l:TextView.OnEditorActionListener):void  {
        this.createEditorIfNeeded();
        //this.mEditor.createInputContentTypeIfNeeded();
        //this.mEditor.mInputContentType.onEditorActionListener = l;
    }

    /**
     * Called when an attached input method calls
     * {@link InputConnection#performEditorAction(int)
     * InputConnection.performEditorAction()}
     * for this text view.  The default implementation will call your action
     * listener supplied to {@link #setOnEditorActionListener}, or perform
     * a standard operation for {@link EditorInfo#IME_ACTION_NEXT
     * EditorInfo.IME_ACTION_NEXT}, {@link EditorInfo#IME_ACTION_PREVIOUS
     * EditorInfo.IME_ACTION_PREVIOUS}, or {@link EditorInfo#IME_ACTION_DONE
     * EditorInfo.IME_ACTION_DONE}.
     *
     * <p>For backwards compatibility, if no IME options have been set and the
     * text view would not normally advance focus on enter, then
     * the NEXT and DONE actions received here will be turned into an enter
     * key down/up pair to go through the normal key handling.
     *
     * @param actionCode The code of the action being performed.
     *
     * @see #setOnEditorActionListener
     */
    //onEditorAction(actionCode:number):void  {
    //    const ict:Editor.InputContentType = this.mEditor == null ? null : this.mEditor.mInputContentType;
    //    if (ict != null) {
    //        if (ict.onEditorActionListener != null) {
    //            if (ict.onEditorActionListener.onEditorAction(this, actionCode, null)) {
    //                return;
    //            }
    //        }
    //        // app may be expecting.
    //        if (actionCode == EditorInfo.IME_ACTION_NEXT) {
    //            let v:View = this.focusSearch(TextView.FOCUS_FORWARD);
    //            if (v != null) {
    //                if (!v.requestFocus(TextView.FOCUS_FORWARD)) {
    //                    throw Error(`new IllegalStateException("focus search returned a view " + "that wasn't able to take focus!")`);
    //                }
    //            }
    //            return;
    //        } else if (actionCode == EditorInfo.IME_ACTION_PREVIOUS) {
    //            let v:View = this.focusSearch(TextView.FOCUS_BACKWARD);
    //            if (v != null) {
    //                if (!v.requestFocus(TextView.FOCUS_BACKWARD)) {
    //                    throw Error(`new IllegalStateException("focus search returned a view " + "that wasn't able to take focus!")`);
    //                }
    //            }
    //            return;
    //        } else if (actionCode == EditorInfo.IME_ACTION_DONE) {
    //            let imm:InputMethodManager = InputMethodManager.peekInstance();
    //            if (imm != null && imm.isActive(this)) {
    //                imm.hideSoftInputFromWindow(this.getWindowToken(), 0);
    //            }
    //            return;
    //        }
    //    }
    //    let viewRootImpl:ViewRootImpl = this.getViewRootImpl();
    //    if (viewRootImpl != null) {
    //        let eventTime:number = SystemClock.uptimeMillis();
    //        viewRootImpl.dispatchKeyFromIme(new KeyEvent(eventTime, eventTime, KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_ENTER, 0, 0, KeyCharacterMap.VIRTUAL_KEYBOARD, 0, KeyEvent.FLAG_SOFT_KEYBOARD | KeyEvent.FLAG_KEEP_TOUCH_MODE | KeyEvent.FLAG_EDITOR_ACTION));
    //        viewRootImpl.dispatchKeyFromIme(new KeyEvent(SystemClock.uptimeMillis(), eventTime, KeyEvent.ACTION_UP, KeyEvent.KEYCODE_ENTER, 0, 0, KeyCharacterMap.VIRTUAL_KEYBOARD, 0, KeyEvent.FLAG_SOFT_KEYBOARD | KeyEvent.FLAG_KEEP_TOUCH_MODE | KeyEvent.FLAG_EDITOR_ACTION));
    //    }
    //}

    ///**
    // * Set the private content type of the text, which is the
    // * {@link EditorInfo#privateImeOptions EditorInfo.privateImeOptions}
    // * field that will be filled in when creating an input connection.
    // *
    // * @see #getPrivateImeOptions()
    // * @see EditorInfo#privateImeOptions
    // * @attr ref android.R.styleable#TextView_privateImeOptions
    // */
    //setPrivateImeOptions(type:string):void  {
    //    this.createEditorIfNeeded();
    //    this.mEditor.createInputContentTypeIfNeeded();
    //    this.mEditor.mInputContentType.privateImeOptions = type;
    //}
    //
    ///**
    // * Get the private type of the content.
    // *
    // * @see #setPrivateImeOptions(String)
    // * @see EditorInfo#privateImeOptions
    // */
    //getPrivateImeOptions():string  {
    //    return this.mEditor != null && this.mEditor.mInputContentType != null ? this.mEditor.mInputContentType.privateImeOptions : null;
    //}
    //
    ///**
    // * Set the extra input data of the text, which is the
    // * {@link EditorInfo#extras TextBoxAttribute.extras}
    // * Bundle that will be filled in when creating an input connection.  The
    // * given integer is the resource ID of an XML resource holding an
    // * {@link android.R.styleable#InputExtras &lt;input-extras&gt;} XML tree.
    // *
    // * @see #getInputExtras(boolean)
    // * @see EditorInfo#extras
    // * @attr ref android.R.styleable#TextView_editorExtras
    // */
    //setInputExtras(xmlResId:number):void  {
    //    this.createEditorIfNeeded();
    //    let parser:XmlResourceParser = this.getResources().getXml(xmlResId);
    //    this.mEditor.createInputContentTypeIfNeeded();
    //    this.mEditor.mInputContentType.extras = new Bundle();
    //    this.getResources().parseBundleExtras(parser, this.mEditor.mInputContentType.extras);
    //}
    //
    ///**
    // * Retrieve the input extras currently associated with the text view, which
    // * can be viewed as well as modified.
    // *
    // * @param create If true, the extras will be created if they don't already
    // * exist.  Otherwise, null will be returned if none have been created.
    // * @see #setInputExtras(int)
    // * @see EditorInfo#extras
    // * @attr ref android.R.styleable#TextView_editorExtras
    // */
    //getInputExtras(create:boolean):any  {
    //    if (this.mEditor == null && !create)
    //        return null;
    //    this.createEditorIfNeeded();
    //    if (this.mEditor.mInputContentType == null) {
    //        if (!create)
    //            return null;
    //        this.mEditor.createInputContentTypeIfNeeded();
    //    }
    //    if (this.mEditor.mInputContentType.extras == null) {
    //        if (!create)
    //            return null;
    //        this.mEditor.mInputContentType.extras = new Bundle();
    //    }
    //    return this.mEditor.mInputContentType.extras;
    //}
    //
    ///**
    // * Returns the error message that was set to be displayed with
    // * {@link #setError}, or <code>null</code> if no error was set
    // * or if it the error was cleared by the widget after user input.
    // */
    //getError():String  {
    //    return this.mEditor == null ? null : this.mEditor.mError;
    //}
    //
    ///**
    // * Sets the right-hand compound drawable of the TextView to the specified
    // * icon and sets an error message that will be displayed in a popup when
    // * the TextView has focus.  The icon and error message will be reset to
    // * null when any key events cause changes to the TextView's text.  The
    // * drawable must already have had {@link Drawable#setBounds} set on it.
    // * If the <code>error</code> is <code>null</code>, the error message will
    // * be cleared (and you should provide a <code>null</code> icon as well).
    // */
    //setError(error:String, icon:Drawable=null):void  {
    //    this.createEditorIfNeeded();
    //    this.mEditor.setError(error, icon);
    //    this.notifyViewAccessibilityStateChangedIfNeeded(AccessibilityEvent.CONTENT_CHANGE_TYPE_UNDEFINED);
    //}

    protected setFrame(l:number, t:number, r:number, b:number):boolean  {
        let result:boolean = super.setFrame(l, t, r, b);
        //if (this.mEditor != null)
        //    this.mEditor.setFrame();
        this.restartMarqueeIfNeeded();
        return result;
    }

    private restartMarqueeIfNeeded():void  {
        if (this.mRestartMarquee && this.mEllipsize == TextUtils.TruncateAt.MARQUEE) {
            this.mRestartMarquee = false;
            this.startMarquee();
        }
    }

    /**
     * Sets the list of input filters that will be used if the buffer is
     * Editable. Has no effect otherwise.
     *
     * @attr ref android.R.styleable#TextView_maxLength
     */
    setFilters(filters:any[]):void;
    setFilters(e:any, filters:any[]):void;
    setFilters(...args):void  {
        //if (this.mEditor != null) {
        //    const undoFilter:boolean = this.mEditor.mUndoInputFilter != null;
        //    const keyFilter:boolean = this.mEditor.mKeyListener instanceof InputFilter;
        //    let num:number = 0;
        //    if (undoFilter)
        //        num++;
        //    if (keyFilter)
        //        num++;
        //    if (num > 0) {
        //        let nf:InputFilter[] = new Array<InputFilter>(filters.length + num);
        //        System.arraycopy(filters, 0, nf, 0, filters.length);
        //        num = 0;
        //        if (undoFilter) {
        //            nf[filters.length] = this.mEditor.mUndoInputFilter;
        //            num++;
        //        }
        //        if (keyFilter) {
        //            nf[filters.length + num] = <InputFilter> this.mEditor.mKeyListener;
        //        }
        //        e.setFilters(nf);
        //        return;
        //    }
        //}
        //e.setFilters(filters);
    }

    /**
     * Returns the current list of input filters.
     *
     * @attr ref android.R.styleable#TextView_maxLength
     */
    getFilters():any[]  {
        return this.mFilters;
    }

    /////////////////////////////////////////////////////////////////////////
    private getBoxHeight(l:Layout):number  {
        //let opticalInsets:Insets = TextView.isLayoutModeOptical(this.mParent) ? this.getOpticalInsets() : Insets.NONE;
        let padding:number = (l == this.mHintLayout) ? this.getCompoundPaddingTop() + this.getCompoundPaddingBottom() : this.getExtendedPaddingTop() + this.getExtendedPaddingBottom();
        return this.getMeasuredHeight() - padding;// + opticalInsets.top + opticalInsets.bottom;
    }

    getVerticalOffset(forceNormal:boolean):number  {
        let voffset:number = 0;
        const gravity:number = this.mGravity & Gravity.VERTICAL_GRAVITY_MASK;
        let l:Layout = this.mLayout;
        if (!forceNormal && this.mText.length == 0 && this.mHintLayout != null) {
            l = this.mHintLayout;
        }
        if (gravity != Gravity.TOP) {
            let boxht:number = this.getBoxHeight(l);
            let textht:number = l.getHeight();
            if (textht < boxht) {
                if (gravity == Gravity.BOTTOM)
                    voffset = boxht - textht;
                else
                    // (gravity == Gravity.CENTER_VERTICAL)
                    voffset = (boxht - textht) >> 1;
            }
        }
        return voffset;
    }

    private getBottomVerticalOffset(forceNormal:boolean):number  {
        let voffset:number = 0;
        const gravity:number = this.mGravity & Gravity.VERTICAL_GRAVITY_MASK;
        let l:Layout = this.mLayout;
        if (!forceNormal && this.mText.length == 0 && this.mHintLayout != null) {
            l = this.mHintLayout;
        }
        if (gravity != Gravity.BOTTOM) {
            let boxht:number = this.getBoxHeight(l);
            let textht:number = l.getHeight();
            if (textht < boxht) {
                if (gravity == Gravity.TOP)
                    voffset = boxht - textht;
                else
                    // (gravity == Gravity.CENTER_VERTICAL)
                    voffset = (boxht - textht) >> 1;
            }
        }
        return voffset;
    }

    //invalidateCursorPath():void  {
    //    if (this.mHighlightPathBogus) {
    //        this.invalidateCursor();
    //    } else {
    //        const horizontalPadding:number = this.getCompoundPaddingLeft();
    //        const verticalPadding:number = this.getExtendedPaddingTop() + this.getVerticalOffset(true);
    //        if (this.mEditor.mCursorCount == 0) {
    //            {
    //                /*
    //                 * The reason for this concern about the thickness of the
    //                 * cursor and doing the floor/ceil on the coordinates is that
    //                 * some EditTexts (notably textfields in the Browser) have
    //                 * anti-aliased text where not all the characters are
    //                 * necessarily at integer-multiple locations.  This should
    //                 * make sure the entire cursor gets invalidated instead of
    //                 * sometimes missing half a pixel.
    //                 */
    //                let thick:number = Math.ceil(this.mTextPaint.getStrokeWidth());
    //                if (thick < 1.0) {
    //                    thick = 1.0;
    //                }
    //                thick /= 2.0;
    //                // mHighlightPath is guaranteed to be non null at that point.
    //                this.mHighlightPath.computeBounds(TextView.TEMP_RECTF, false);
    //                this.invalidate(Math.floor(Math.floor(horizontalPadding + TextView.TEMP_RECTF.left - thick)), Math.floor(Math.floor(verticalPadding + TextView.TEMP_RECTF.top - thick)), Math.floor(Math.ceil(horizontalPadding + TextView.TEMP_RECTF.right + thick)), Math.floor(Math.ceil(verticalPadding + TextView.TEMP_RECTF.bottom + thick)));
    //            }
    //        } else {
    //            for (let i:number = 0; i < this.mEditor.mCursorCount; i++) {
    //                let bounds:Rect = this.mEditor.mCursorDrawable[i].getBounds();
    //                this.invalidate(bounds.left + horizontalPadding, bounds.top + verticalPadding, bounds.right + horizontalPadding, bounds.bottom + verticalPadding);
    //            }
    //        }
    //    }
    //}
    //
    //invalidateCursor():void  {
    //    let where:number = this.getSelectionEnd();
    //    this.invalidateCursor(where, where, where);
    //}
    //
    //private invalidateCursor(a:number, b:number, c:number):void  {
    //    if (a >= 0 || b >= 0 || c >= 0) {
    //        let start:number = Math.min(Math.min(a, b), c);
    //        let end:number = Math.max(Math.max(a, b), c);
    //        this.invalidateRegion(start, end, true);
    //    }
    //}

    /**
     * Invalidates the region of text enclosed between the start and end text offsets.
     */
    invalidateRegion(start:number, end:number, invalidateCursor:boolean):void  {
        if (this.mLayout == null) {
            this.invalidate();
        } else {
            let lineStart:number = this.mLayout.getLineForOffset(start);
            let top:number = this.mLayout.getLineTop(lineStart);
            // the same problem with the descenders on the line above it!)
            if (lineStart > 0) {
                top -= this.mLayout.getLineDescent(lineStart - 1);
            }
            let lineEnd:number;
            if (start == end)
                lineEnd = lineStart;
            else
                lineEnd = this.mLayout.getLineForOffset(end);
            let bottom:number = this.mLayout.getLineBottom(lineEnd);
            // mEditor can be null in case selection is set programmatically.
            //if (invalidateCursor && this.mEditor != null) {
            //    for (let i:number = 0; i < this.mEditor.mCursorCount; i++) {
            //        let bounds:Rect = this.mEditor.mCursorDrawable[i].getBounds();
            //        top = Math.min(top, bounds.top);
            //        bottom = Math.max(bottom, bounds.bottom);
            //    }
            //}
            const compoundPaddingLeft:number = this.getCompoundPaddingLeft();
            const verticalPadding:number = this.getExtendedPaddingTop() + this.getVerticalOffset(true);
            let left:number, right:number;
            if (lineStart == lineEnd && !invalidateCursor) {
                left = Math.floor(this.mLayout.getPrimaryHorizontal(start));
                right = Math.floor((this.mLayout.getPrimaryHorizontal(end) + 1.0));
                left += compoundPaddingLeft;
                right += compoundPaddingLeft;
            } else {
                // Rectangle bounding box when the region spans several lines
                left = compoundPaddingLeft;
                right = this.getWidth() - this.getCompoundPaddingRight();
            }
            this.invalidate(this.mScrollX + left, verticalPadding + top, this.mScrollX + right, verticalPadding + bottom);
        }
    }

    private registerForPreDraw():void  {
        if (!this.mPreDrawRegistered) {
            this.getViewTreeObserver().addOnPreDrawListener(this);
            this.mPreDrawRegistered = true;
        }
    }

    /**
     * {@inheritDoc}
     */
    onPreDraw():boolean  {
        if (this.mLayout == null) {
            this.assumeLayout();
        }
        if (this.mMovement != null) {
            /* This code also provides auto-scrolling when a cursor is moved using a
             * CursorController (insertion point or selection limits).
             * For selection, ensure start or end is visible depending on controller's state.
             */
            let curs:number = this.getSelectionEnd();
            // Do not create the controller if it is not already created.
            //if (this.mEditor != null && this.mEditor.mSelectionModifierCursorController != null && this.mEditor.mSelectionModifierCursorController.isSelectionStartDragged()) {
            //    curs = this.getSelectionStart();
            //}
            /*
             * TODO: This should really only keep the end in view if
             * it already was before the text changed.  I'm not sure
             * of a good way to tell from here if it was.
             */
            if (curs < 0 && (this.mGravity & Gravity.VERTICAL_GRAVITY_MASK) == Gravity.BOTTOM) {
                curs = this.mText.length;
            }
            if (curs >= 0) {
                this.bringPointIntoView(curs);
            }
        } else {
            this.bringTextIntoView();
        }
        //   a screen rotation) since layout is not yet initialized at that point.
        //if (this.mEditor != null && this.mEditor.mCreatedWithASelection) {
        //    this.mEditor.startSelectionActionMode();
        //    this.mEditor.mCreatedWithASelection = false;
        //}
        // not be set. Do the test here instead.
        //if (this instanceof ExtractEditText && this.hasSelection() && this.mEditor != null) {
        //    this.mEditor.startSelectionActionMode();
        //}
        this.getViewTreeObserver().removeOnPreDrawListener(this);
        this.mPreDrawRegistered = false;
        return true;
    }

    protected onAttachedToWindow():void  {
        super.onAttachedToWindow();
        this.mTemporaryDetach = false;
        //if (this.mEditor != null)
        //    this.mEditor.onAttachedToWindow();
    }

    protected onDetachedFromWindow():void  {
        super.onDetachedFromWindow();
        if (this.mPreDrawRegistered) {
            this.getViewTreeObserver().removeOnPreDrawListener(this);
            this.mPreDrawRegistered = false;
        }
        this.resetResolvedDrawables();
        //if (this.mEditor != null)
        //    this.mEditor.onDetachedFromWindow();
    }

    //onScreenStateChanged(screenState:number):void  {
    //    super.onScreenStateChanged(screenState);
    //    if (this.mEditor != null)
    //        this.mEditor.onScreenStateChanged(screenState);
    //}

    protected isPaddingOffsetRequired():boolean  {
        return this.mShadowRadius != 0 || this.mDrawables != null;
    }

    protected getLeftPaddingOffset():number  {
        return this.getCompoundPaddingLeft() - this.mPaddingLeft + Math.floor(Math.min(0, this.mShadowDx - this.mShadowRadius));
    }

    protected getTopPaddingOffset():number  {
        return Math.floor(Math.min(0, this.mShadowDy - this.mShadowRadius));
    }

    protected getBottomPaddingOffset():number  {
        return Math.floor(Math.max(0, this.mShadowDy + this.mShadowRadius));
    }

    protected getRightPaddingOffset():number  {
        return -(this.getCompoundPaddingRight() - this.mPaddingRight) + Math.floor(Math.max(0, this.mShadowDx + this.mShadowRadius));
    }

    protected verifyDrawable(who:Drawable):boolean  {
        const verified:boolean = super.verifyDrawable(who);
        if (!verified && this.mDrawables != null) {
            return who == this.mDrawables.mDrawableLeft || who == this.mDrawables.mDrawableTop || who == this.mDrawables.mDrawableRight || who == this.mDrawables.mDrawableBottom || who == this.mDrawables.mDrawableStart || who == this.mDrawables.mDrawableEnd;
        }
        return verified;
    }

    jumpDrawablesToCurrentState():void  {
        super.jumpDrawablesToCurrentState();
        if (this.mDrawables != null) {
            if (this.mDrawables.mDrawableLeft != null) {
                this.mDrawables.mDrawableLeft.jumpToCurrentState();
            }
            if (this.mDrawables.mDrawableTop != null) {
                this.mDrawables.mDrawableTop.jumpToCurrentState();
            }
            if (this.mDrawables.mDrawableRight != null) {
                this.mDrawables.mDrawableRight.jumpToCurrentState();
            }
            if (this.mDrawables.mDrawableBottom != null) {
                this.mDrawables.mDrawableBottom.jumpToCurrentState();
            }
            if (this.mDrawables.mDrawableStart != null) {
                this.mDrawables.mDrawableStart.jumpToCurrentState();
            }
            if (this.mDrawables.mDrawableEnd != null) {
                this.mDrawables.mDrawableEnd.jumpToCurrentState();
            }
        }
    }


    drawableSizeChange(d:android.graphics.drawable.Drawable):void {
        const drawables:TextView.Drawables = this.mDrawables;
        const isCompoundDrawable = drawables!=null && (d == drawables.mDrawableLeft || d == drawables.mDrawableTop
            || d == drawables.mDrawableRight || d == drawables.mDrawableBottom || d == drawables.mDrawableStart || d == drawables.mDrawableEnd);

        if(isCompoundDrawable){
            d.setBounds(0, 0, d.getIntrinsicWidth(), d.getIntrinsicHeight());
            this.setCompoundDrawables(drawables.mDrawableLeft, drawables.mDrawableTop, drawables.mDrawableRight, drawables.mDrawableBottom);
        }else{
            super.drawableSizeChange(d);
        }
    }

    invalidateDrawable(drawable:Drawable):void  {
        if (this.verifyDrawable(drawable)) {
            const dirty:Rect = drawable.getBounds();
            let scrollX:number = this.mScrollX;
            let scrollY:number = this.mScrollY;
            // IMPORTANT: The coordinates below are based on the coordinates computed
            // for each compound drawable in onDraw(). Make sure to update each section
            // accordingly.
            const drawables:TextView.Drawables = this.mDrawables;

            if (drawables != null) {
                if (drawable == drawables.mDrawableLeft) {
                    const compoundPaddingTop:number = this.getCompoundPaddingTop();
                    const compoundPaddingBottom:number = this.getCompoundPaddingBottom();
                    const vspace:number = this.mBottom - this.mTop - compoundPaddingBottom - compoundPaddingTop;
                    scrollX += this.mPaddingLeft;
                    scrollY += compoundPaddingTop + (vspace - drawables.mDrawableHeightLeft) / 2;
                } else if (drawable == drawables.mDrawableRight) {
                    const compoundPaddingTop:number = this.getCompoundPaddingTop();
                    const compoundPaddingBottom:number = this.getCompoundPaddingBottom();
                    const vspace:number = this.mBottom - this.mTop - compoundPaddingBottom - compoundPaddingTop;
                    scrollX += (this.mRight - this.mLeft - this.mPaddingRight - drawables.mDrawableSizeRight);
                    scrollY += compoundPaddingTop + (vspace - drawables.mDrawableHeightRight) / 2;
                } else if (drawable == drawables.mDrawableTop) {
                    const compoundPaddingLeft:number = this.getCompoundPaddingLeft();
                    const compoundPaddingRight:number = this.getCompoundPaddingRight();
                    const hspace:number = this.mRight - this.mLeft - compoundPaddingRight - compoundPaddingLeft;
                    scrollX += compoundPaddingLeft + (hspace - drawables.mDrawableWidthTop) / 2;
                    scrollY += this.mPaddingTop;
                } else if (drawable == drawables.mDrawableBottom) {
                    const compoundPaddingLeft:number = this.getCompoundPaddingLeft();
                    const compoundPaddingRight:number = this.getCompoundPaddingRight();
                    const hspace:number = this.mRight - this.mLeft - compoundPaddingRight - compoundPaddingLeft;
                    scrollX += compoundPaddingLeft + (hspace - drawables.mDrawableWidthBottom) / 2;
                    scrollY += (this.mBottom - this.mTop - this.mPaddingBottom - drawables.mDrawableSizeBottom);
                }
            }

            this.invalidate(dirty.left + scrollX, dirty.top + scrollY, dirty.right + scrollX, dirty.bottom + scrollY);
        }
    }

    //hasOverlappingRendering():boolean  {
    //    // horizontal fading edge causes SaveLayerAlpha, which doesn't support alpha modulation
    //    return ((this.getBackground() != null && this.getBackground().getCurrent() != null) || this.mText instanceof Spannable || this.hasSelection() || this.isHorizontalFadingEdgeEnabled());
    //}

    /**
     *
     * Returns the state of the {@code textIsSelectable} flag (See
     * {@link #setTextIsSelectable setTextIsSelectable()}). Although you have to set this flag
     * to allow users to select and copy text in a non-editable TextView, the content of an
     * {@link EditText} can always be selected, independently of the value of this flag.
     * <p>
     *
     * @return True if the text displayed in this TextView can be selected by the user.
     *
     * @attr ref android.R.styleable#TextView_textIsSelectable
     */
    isTextSelectable():boolean  {
        return false;
        //return this.mEditor == null ? false : this.mEditor.mTextIsSelectable;
    }

    /**
     * Sets whether the content of this view is selectable by the user. The default is
     * {@code false}, meaning that the content is not selectable.
     * <p>
     * When you use a TextView to display a useful piece of information to the user (such as a
     * contact's address), make it selectable, so that the user can select and copy its
     * content. You can also use set the XML attribute
     * {@link android.R.styleable#TextView_textIsSelectable} to "true".
     * <p>
     * When you call this method to set the value of {@code textIsSelectable}, it sets
     * the flags {@code focusable}, {@code focusableInTouchMode}, {@code clickable},
     * and {@code longClickable} to the same value. These flags correspond to the attributes
     * {@link android.R.styleable#View_focusable android:focusable},
     * {@link android.R.styleable#View_focusableInTouchMode android:focusableInTouchMode},
     * {@link android.R.styleable#View_clickable android:clickable}, and
     * {@link android.R.styleable#View_longClickable android:longClickable}. To restore any of these
     * flags to a state you had set previously, call one or more of the following methods:
     * {@link #setFocusable(boolean) setFocusable()},
     * {@link #setFocusableInTouchMode(boolean) setFocusableInTouchMode()},
     * {@link #setClickable(boolean) setClickable()} or
     * {@link #setLongClickable(boolean) setLongClickable()}.
     *
     * @param selectable Whether the content of this TextView should be selectable.
     */
    setTextIsSelectable(selectable:boolean):void  {
        //// false is default value with no edit data
        //if (!selectable && this.mEditor == null)
        //    return;
        //this.createEditorIfNeeded();
        //if (this.mEditor.mTextIsSelectable == selectable)
        //    return;
        //this.mEditor.mTextIsSelectable = selectable;
        //this.setFocusableInTouchMode(selectable);
        //this.setFocusable(selectable);
        //this.setClickable(selectable);
        //this.setLongClickable(selectable);
        //// mInputType should already be EditorInfo.TYPE_NULL and mInput should be null
        //this.setMovementMethod(selectable ? ArrowKeyMovementMethod.getInstance() : null);
        //this.setText(this.mText, selectable ? TextView.BufferType.SPANNABLE : TextView.BufferType.NORMAL);
        //// Called by setText above, but safer in case of future code changes
        //this.mEditor.prepareCursorControllers();
    }

    protected onCreateDrawableState(extraSpace:number):number[]  {
        let drawableState:number[];
        if (this.mSingleLine) {
            drawableState = super.onCreateDrawableState(extraSpace);
        } else {
            drawableState = super.onCreateDrawableState(extraSpace + 1);
            TextView.mergeDrawableStates(drawableState, TextView.MULTILINE_STATE_SET);
        }
        if (this.isTextSelectable()) {
            // Disable pressed state, which was introduced when TextView was made clickable.
            // Prevents text color change.
            // setClickable(false) would have a similar effect, but it also disables focus changes
            // and long press actions, which are both needed by text selection.
            const length:number = drawableState.length;
            for (let i:number = 0; i < length; i++) {
                if (drawableState[i] == View.VIEW_STATE_PRESSED) {
                    const nonPressedState:number[] = androidui.util.ArrayCreator.newNumberArray(length - 1);
                    System.arraycopy(drawableState, 0, nonPressedState, 0, i);
                    System.arraycopy(drawableState, i + 1, nonPressedState, i, length - i - 1);
                    return nonPressedState;
                }
            }
        }
        return drawableState;
    }

    private getUpdatedHighlightPath():Path  {
        let highlight:Path = null;
        let highlightPaint:Paint = this.mHighlightPaint;
        const selStart:number = this.getSelectionStart();
        const selEnd:number = this.getSelectionEnd();
        if (this.mMovement != null && (this.isFocused() || this.isPressed()) && selStart >= 0) {
            if (selStart == selEnd) {
                //if (this.mEditor != null && this.mEditor.isCursorVisible() && (SystemClock.uptimeMillis() - this.mEditor.mShowCursor) % (2 * Editor.BLINK) < Editor.BLINK) {
                //    if (this.mHighlightPathBogus) {
                //        if (this.mHighlightPath == null)
                //            this.mHighlightPath = new Path();
                //        this.mHighlightPath.reset();
                //        this.mLayout.getCursorPath(selStart, this.mHighlightPath, this.mText);
                //        this.mEditor.updateCursorsPositions();
                //        this.mHighlightPathBogus = false;
                //    }
                //    // XXX should pass to skin instead of drawing directly
                //    highlightPaint.setColor(this.mCurTextColor);
                //    highlightPaint.setStyle(Paint.Style.STROKE);
                //    highlight = this.mHighlightPath;
                //}
            } else {
                if (this.mHighlightPathBogus) {
                    if (this.mHighlightPath == null)
                        this.mHighlightPath = new Path();
                    this.mHighlightPath.reset();
                    this.mLayout.getSelectionPath(selStart, selEnd, this.mHighlightPath);
                    this.mHighlightPathBogus = false;
                }
                // XXX should pass to skin instead of drawing directly
                highlightPaint.setColor(this.mHighlightColor);
                highlightPaint.setStyle(Paint.Style.FILL);
                highlight = this.mHighlightPath;
            }
        }
        return highlight;
    }

    /**
     * @hide
     */
    getHorizontalOffsetForDrawables():number  {
        return 0;
    }

    protected onDraw(canvas:Canvas):void  {
        this.restartMarqueeIfNeeded();
        // Draw the background for this view
        super.onDraw(canvas);
        const compoundPaddingLeft:number = this.getCompoundPaddingLeft();
        const compoundPaddingTop:number = this.getCompoundPaddingTop();
        const compoundPaddingRight:number = this.getCompoundPaddingRight();
        const compoundPaddingBottom:number = this.getCompoundPaddingBottom();
        const scrollX:number = this.mScrollX;
        const scrollY:number = this.mScrollY;
        const right:number = this.mRight;
        const left:number = this.mLeft;
        const bottom:number = this.mBottom;
        const top:number = this.mTop;
        const isLayoutRtl:boolean = this.isLayoutRtl();
        const offset:number = this.getHorizontalOffsetForDrawables();
        const leftOffset:number = isLayoutRtl ? 0 : offset;
        const rightOffset:number = isLayoutRtl ? offset : 0;
        const dr:TextView.Drawables = this.mDrawables;
        if (dr != null) {
            /*
             * Compound, not extended, because the icon is not clipped
             * if the text height is smaller.
             */
            let vspace:number = bottom - top - compoundPaddingBottom - compoundPaddingTop;
            let hspace:number = right - left - compoundPaddingRight - compoundPaddingLeft;
            // Make sure to update invalidateDrawable() when changing this code.
            if (dr.mDrawableLeft != null) {
                canvas.save();
                canvas.translate(scrollX + this.mPaddingLeft + leftOffset, scrollY + compoundPaddingTop + (vspace - dr.mDrawableHeightLeft) / 2);
                dr.mDrawableLeft.draw(canvas);
                canvas.restore();
            }
            // Make sure to update invalidateDrawable() when changing this code.
            if (dr.mDrawableRight != null) {
                canvas.save();
                canvas.translate(scrollX + right - left - this.mPaddingRight - dr.mDrawableSizeRight - rightOffset, scrollY + compoundPaddingTop + (vspace - dr.mDrawableHeightRight) / 2);
                dr.mDrawableRight.draw(canvas);
                canvas.restore();
            }
            // Make sure to update invalidateDrawable() when changing this code.
            if (dr.mDrawableTop != null) {
                canvas.save();
                canvas.translate(scrollX + compoundPaddingLeft + (hspace - dr.mDrawableWidthTop) / 2, scrollY + this.mPaddingTop);
                dr.mDrawableTop.draw(canvas);
                canvas.restore();
            }
            // Make sure to update invalidateDrawable() when changing this code.
            if (dr.mDrawableBottom != null) {
                canvas.save();
                canvas.translate(scrollX + compoundPaddingLeft + (hspace - dr.mDrawableWidthBottom) / 2, scrollY + bottom - top - this.mPaddingBottom - dr.mDrawableSizeBottom);
                dr.mDrawableBottom.draw(canvas);
                canvas.restore();
            }
        }
        let color:number = this.mCurTextColor;
        if (this.mLayout == null) {
            this.assumeLayout();
        }
        let layout:Layout = this.mLayout;
        if (this.mHint != null && this.mText.length == 0) {
            if (this.mHintTextColor != null) {
                color = this.mCurHintTextColor;
            }
            layout = this.mHintLayout;
        }
        this.mTextPaint.setColor(color);
        this.mTextPaint.drawableState = this.getDrawableState();

        //androidui: will set to true by EditText (when editing)
        if(this.mSkipDrawText) return;

        canvas.save();

        /*  Would be faster if we didn't have to do this. Can we chop the
            (displayable) text so that we don't need to do this ever?
        */
        let extendedPaddingTop:number = this.getExtendedPaddingTop();
        let extendedPaddingBottom:number = this.getExtendedPaddingBottom();
        const vspace:number = this.mBottom - this.mTop - compoundPaddingBottom - compoundPaddingTop;
        const maxScrollY:number = this.mLayout.getHeight() - vspace;
        let clipLeft:number = compoundPaddingLeft + scrollX;
        let clipTop:number = (scrollY == 0) ? 0 : extendedPaddingTop + scrollY;
        let clipRight:number = right - left - compoundPaddingRight + scrollX;
        let clipBottom:number = bottom - top + scrollY - ((scrollY == maxScrollY) ? 0 : extendedPaddingBottom);
        if (this.mShadowRadius != 0) {
            clipLeft += Math.min(0, this.mShadowDx - this.mShadowRadius);
            clipRight += Math.max(0, this.mShadowDx + this.mShadowRadius);
            clipTop += Math.min(0, this.mShadowDy - this.mShadowRadius);
            clipBottom += Math.max(0, this.mShadowDy + this.mShadowRadius);
        }
        canvas.clipRect(clipLeft, clipTop, clipRight, clipBottom);
        let voffsetText:number = 0;
        let voffsetCursor:number = 0;
        /* shortcircuit calling getVerticaOffset() */
        if ((this.mGravity & Gravity.VERTICAL_GRAVITY_MASK) != Gravity.TOP) {
            voffsetText = this.getVerticalOffset(false);
            voffsetCursor = this.getVerticalOffset(true);
        }
        canvas.translate(compoundPaddingLeft, extendedPaddingTop + voffsetText);
        //const layoutDirection:number = this.getLayoutDirection();
        const absoluteGravity:number = this.mGravity;//Gravity.getAbsoluteGravity(this.mGravity, layoutDirection);
        if (this.mEllipsize == TextUtils.TruncateAt.MARQUEE && this.mMarqueeFadeMode != TextView.MARQUEE_FADE_SWITCH_SHOW_ELLIPSIS) {
            if (!this.mSingleLine && this.getLineCount() == 1 && this.canMarquee() && (absoluteGravity & Gravity.HORIZONTAL_GRAVITY_MASK) != Gravity.LEFT) {
                const width:number = this.mRight - this.mLeft;
                const padding:number = this.getCompoundPaddingLeft() + this.getCompoundPaddingRight();
                const dx:number = this.mLayout.getLineRight(0) - (width - padding);
                canvas.translate(isLayoutRtl ? -dx : +dx, 0.0);
            }
            if (this.mMarquee != null && this.mMarquee.isRunning()) {
                const dx:number = -this.mMarquee.getScroll();
                canvas.translate(isLayoutRtl ? -dx : +dx, 0.0);
            }
        }
        const cursorOffsetVertical:number = voffsetCursor - voffsetText;
        let highlight:Path = this.getUpdatedHighlightPath();
        //if (this.mEditor != null) {
        //    this.mEditor.onDraw(canvas, layout, highlight, this.mHighlightPaint, cursorOffsetVertical);
        //} else {
            layout.draw(canvas, highlight, this.mHighlightPaint, cursorOffsetVertical);
        //}
        if (this.mMarquee != null && this.mMarquee.shouldDrawGhost()) {
            const dx:number = Math.floor(this.mMarquee.getGhostOffset());
            canvas.translate(isLayoutRtl ? -dx : dx, 0.0);
            layout.draw(canvas, highlight, this.mHighlightPaint, cursorOffsetVertical);
        }
        canvas.restore();
    }

    getFocusedRect(r:Rect):void  {
        if (this.mLayout == null) {
            super.getFocusedRect(r);
            return;
        }
        let selEnd:number = this.getSelectionEnd();
        if (selEnd < 0) {
            super.getFocusedRect(r);
            return;
        }
        //let selStart:number = this.getSelectionStart();
        //if (selStart < 0 || selStart >= selEnd) {
        //    let line:number = this.mLayout.getLineForOffset(selEnd);
        //    r.top = this.mLayout.getLineTop(line);
        //    r.bottom = this.mLayout.getLineBottom(line);
        //    r.left = Math.floor(this.mLayout.getPrimaryHorizontal(selEnd)) - 2;
        //    r.right = r.left + 4;
        //} else {
        //    let lineStart:number = this.mLayout.getLineForOffset(selStart);
        //    let lineEnd:number = this.mLayout.getLineForOffset(selEnd);
        //    r.top = this.mLayout.getLineTop(lineStart);
        //    r.bottom = this.mLayout.getLineBottom(lineEnd);
        //    if (lineStart == lineEnd) {
        //        r.left = Math.floor(this.mLayout.getPrimaryHorizontal(selStart));
        //        r.right = Math.floor(this.mLayout.getPrimaryHorizontal(selEnd));
        //    } else {
        //        // rect cover the entire width.
        //        if (this.mHighlightPathBogus) {
        //            if (this.mHighlightPath == null)
        //                this.mHighlightPath = new Path();
        //            this.mHighlightPath.reset();
        //            this.mLayout.getSelectionPath(selStart, selEnd, this.mHighlightPath);
        //            this.mHighlightPathBogus = false;
        //        }
        //        {
        //            this.mHighlightPath.computeBounds(TextView.TEMP_RECTF, true);
        //            r.left = Math.floor(TextView.TEMP_RECTF.left) - 1;
        //            r.right = Math.floor(TextView.TEMP_RECTF.right) + 1;
        //        }
        //    }
        //}
        //// Adjust for padding and gravity.
        //let paddingLeft:number = this.getCompoundPaddingLeft();
        //let paddingTop:number = this.getExtendedPaddingTop();
        //if ((this.mGravity & Gravity.VERTICAL_GRAVITY_MASK) != Gravity.TOP) {
        //    paddingTop += this.getVerticalOffset(false);
        //}
        //r.offset(paddingLeft, paddingTop);
        //let paddingBottom:number = this.getExtendedPaddingBottom();
        //r.bottom += paddingBottom;
    }

    /**
     * Return the number of lines of text, or 0 if the internal Layout has not
     * been built.
     */
    getLineCount():number  {
        return this.mLayout != null ? this.mLayout.getLineCount() : 0;
    }

    /**
     * Return the baseline for the specified line (0...getLineCount() - 1)
     * If bounds is not null, return the top, left, right, bottom extents
     * of the specified line in it. If the internal Layout has not been built,
     * return 0 and set bounds to (0, 0, 0, 0)
     * @param line which line to examine (0..getLineCount() - 1)
     * @param bounds Optional. If not null, it returns the extent of the line
     * @return the Y-coordinate of the baseline
     */
    getLineBounds(line:number, bounds:Rect):number  {
        if (this.mLayout == null) {
            if (bounds != null) {
                bounds.set(0, 0, 0, 0);
            }
            return 0;
        } else {
            let baseline:number = this.mLayout.getLineBounds(line, bounds);
            let voffset:number = this.getExtendedPaddingTop();
            if ((this.mGravity & Gravity.VERTICAL_GRAVITY_MASK) != Gravity.TOP) {
                voffset += this.getVerticalOffset(true);
            }
            if (bounds != null) {
                bounds.offset(this.getCompoundPaddingLeft(), voffset);
            }
            return baseline + voffset;
        }
    }

    getBaseline():number  {
        if (this.mLayout == null) {
            return super.getBaseline();
        }
        let voffset:number = 0;
        if ((this.mGravity & Gravity.VERTICAL_GRAVITY_MASK) != Gravity.TOP) {
            voffset = this.getVerticalOffset(true);
        }
        //if (TextView.isLayoutModeOptical(this.mParent)) {
        //    voffset -= this.getOpticalInsets().top;
        //}
        return this.getExtendedPaddingTop() + voffset + this.mLayout.getLineBaseline(0);
    }

    /**
     * @hide
     */
    protected getFadeTop(offsetRequired:boolean):number  {
        if (this.mLayout == null)
            return 0;
        let voffset:number = 0;
        if ((this.mGravity & Gravity.VERTICAL_GRAVITY_MASK) != Gravity.TOP) {
            voffset = this.getVerticalOffset(true);
        }
        if (offsetRequired)
            voffset += this.getTopPaddingOffset();
        return this.getExtendedPaddingTop() + voffset;
    }

    /**
     * @hide
     */
    protected getFadeHeight(offsetRequired:boolean):number  {
        return this.mLayout != null ? this.mLayout.getHeight() : 0;
    }

    //onKeyPreIme(keyCode:number, event:KeyEvent):boolean  {
    //    if (keyCode == KeyEvent.KEYCODE_BACK) {
    //        let isInSelectionMode:boolean = this.mEditor != null && this.mEditor.mSelectionActionMode != null;
    //        if (isInSelectionMode) {
    //            if (event.getAction() == KeyEvent.ACTION_DOWN && event.getRepeatCount() == 0) {
    //                let state:KeyEvent.DispatcherState = this.getKeyDispatcherState();
    //                if (state != null) {
    //                    state.startTracking(event, this);
    //                }
    //                return true;
    //            } else if (event.getAction() == KeyEvent.ACTION_UP) {
    //                let state:KeyEvent.DispatcherState = this.getKeyDispatcherState();
    //                if (state != null) {
    //                    state.handleUpEvent(event);
    //                }
    //                if (event.isTracking() && !event.isCanceled()) {
    //                    this.stopSelectionActionMode();
    //                    return true;
    //                }
    //            }
    //        }
    //    }
    //    return super.onKeyPreIme(keyCode, event);
    //}

    onKeyDown(keyCode:number, event:KeyEvent):boolean  {
        let which:number = this.doKeyDown(keyCode, event, null);
        if (which == 0) {
            return super.onKeyDown(keyCode, event);
        }
        return true;
    }

    //onKeyMultiple(keyCode:number, repeatCount:number, event:KeyEvent):boolean  {
    //    let down:KeyEvent = KeyEvent.changeAction(event, KeyEvent.ACTION_DOWN);
    //    let which:number = this.doKeyDown(keyCode, down, event);
    //    if (which == 0) {
    //        // Go through default dispatching.
    //        return super.onKeyMultiple(keyCode, repeatCount, event);
    //    }
    //    if (which == -1) {
    //        // Consumed the whole thing.
    //        return true;
    //    }
    //    repeatCount--;
    //    // We are going to dispatch the remaining events to either the input
    //    // or movement method.  To do this, we will just send a repeated stream
    //    // of down and up events until we have done the complete repeatCount.
    //    // It would be nice if those interfaces had an onKeyMultiple() method,
    //    // but adding that is a more complicated change.
    //    let up:KeyEvent = KeyEvent.changeAction(event, KeyEvent.ACTION_UP);
    //    if (which == 1) {
    //        // mEditor and mEditor.mInput are not null from doKeyDown
    //        this.mEditor.mKeyListener.onKeyUp(this, <Editable> this.mText, keyCode, up);
    //        while (--repeatCount > 0) {
    //            this.mEditor.mKeyListener.onKeyDown(this, <Editable> this.mText, keyCode, down);
    //            this.mEditor.mKeyListener.onKeyUp(this, <Editable> this.mText, keyCode, up);
    //        }
    //        this.hideErrorIfUnchanged();
    //    } else if (which == 2) {
    //        // mMovement is not null from doKeyDown
    //        this.mMovement.onKeyUp(this, <Spannable> this.mText, keyCode, up);
    //        while (--repeatCount > 0) {
    //            this.mMovement.onKeyDown(this, <Spannable> this.mText, keyCode, down);
    //            this.mMovement.onKeyUp(this, <Spannable> this.mText, keyCode, up);
    //        }
    //    }
    //    return true;
    //}

    /**
     * Returns true if pressing ENTER in this field advances focus instead
     * of inserting the character.  This is true mostly in single-line fields,
     * but also in mail addresses and subjects which will display on multiple
     * lines but where it doesn't make sense to insert newlines.
     */
    private shouldAdvanceFocusOnEnter():boolean  {
        if (this.getKeyListener() == null) {
            return false;
        }
        if (this.mSingleLine) {
            return true;
        }
        //if (this.mEditor != null && (this.mEditor.mInputType & EditorInfo.TYPE_MASK_CLASS) == EditorInfo.TYPE_CLASS_TEXT) {
        //    let variation:number = this.mEditor.mInputType & EditorInfo.TYPE_MASK_VARIATION;
        //    if (variation == EditorInfo.TYPE_TEXT_VARIATION_EMAIL_ADDRESS || variation == EditorInfo.TYPE_TEXT_VARIATION_EMAIL_SUBJECT) {
        //        return true;
        //    }
        //}
        return false;
    }

    /**
     * Returns true if pressing TAB in this field advances focus instead
     * of inserting the character.  Insert tabs only in multi-line editors.
     */
    private shouldAdvanceFocusOnTab():boolean  {
        //if (this.getKeyListener() != null && !this.mSingleLine && this.mEditor != null && (this.mEditor.mInputType & EditorInfo.TYPE_MASK_CLASS) == EditorInfo.TYPE_CLASS_TEXT) {
        //    let variation:number = this.mEditor.mInputType & EditorInfo.TYPE_MASK_VARIATION;
        //    if (variation == EditorInfo.TYPE_TEXT_FLAG_IME_MULTI_LINE || variation == EditorInfo.TYPE_TEXT_FLAG_MULTI_LINE) {
        //        return false;
        //    }
        //}
        return true;
    }

    private doKeyDown(keyCode:number, event:KeyEvent, otherEvent:KeyEvent):number  {
        //if (!this.isEnabled()) {
            return 0;
        //}
        //// prevent the user from traversing out of this on the next key down.
        //if (event.getRepeatCount() == 0 && !KeyEvent.isModifierKey(keyCode)) {
        //    this.mPreventDefaultMovement = false;
        //}
        //switch(keyCode) {
        //    case KeyEvent.KEYCODE_ENTER:
        //        if (event.hasNoModifiers()) {
        //            // enter key events.
        //            if (this.mEditor != null && this.mEditor.mInputContentType != null) {
        //                // chance to consume the event.
        //                if (this.mEditor.mInputContentType.onEditorActionListener != null && this.mEditor.mInputContentType.onEditorActionListener.onEditorAction(this, EditorInfo.IME_NULL, event)) {
        //                    this.mEditor.mInputContentType.enterDown = true;
        //                    // We are consuming the enter key for them.
        //                    return -1;
        //                }
        //            }
        //            // don't let it be inserted into the text.
        //            if ((event.getFlags() & KeyEvent.FLAG_EDITOR_ACTION) != 0 || this.shouldAdvanceFocusOnEnter()) {
        //                if (this.hasOnClickListeners()) {
        //                    return 0;
        //                }
        //                return -1;
        //            }
        //        }
        //        break;
        //    case KeyEvent.KEYCODE_DPAD_CENTER:
        //        if (event.hasNoModifiers()) {
        //            if (this.shouldAdvanceFocusOnEnter()) {
        //                return 0;
        //            }
        //        }
        //        break;
        //    case KeyEvent.KEYCODE_TAB:
        //        if (event.hasNoModifiers() || event.hasModifiers(KeyEvent.META_SHIFT_ON)) {
        //            if (this.shouldAdvanceFocusOnTab()) {
        //                return 0;
        //            }
        //        }
        //        break;
        //    // Has to be done on key down (and not on key up) to correctly be intercepted.
        //    case KeyEvent.KEYCODE_BACK:
        //        if (this.mEditor != null && this.mEditor.mSelectionActionMode != null) {
        //            this.stopSelectionActionMode();
        //            return -1;
        //        }
        //        break;
        //}
        //if (this.mEditor != null && this.mEditor.mKeyListener != null) {
        //    this.resetErrorChangedFlag();
        //    let doDown:boolean = true;
        //    if (otherEvent != null) {
        //        try {
        //            this.beginBatchEdit();
        //            const handled:boolean = this.mEditor.mKeyListener.onKeyOther(this, <Editable> this.mText, otherEvent);
        //            this.hideErrorIfUnchanged();
        //            doDown = false;
        //            if (handled) {
        //                return -1;
        //            }
        //        } catch (e){
        //        } finally {
        //            this.endBatchEdit();
        //        }
        //    }
        //    if (doDown) {
        //        this.beginBatchEdit();
        //        const handled:boolean = this.mEditor.mKeyListener.onKeyDown(this, <Editable> this.mText, keyCode, event);
        //        this.endBatchEdit();
        //        this.hideErrorIfUnchanged();
        //        if (handled)
        //            return 1;
        //    }
        //}
        //if (this.mMovement != null && this.mLayout != null) {
        //    let doDown:boolean = true;
        //    if (otherEvent != null) {
        //        try {
        //            let handled:boolean = this.mMovement.onKeyOther(this, <Spannable> this.mText, otherEvent);
        //            doDown = false;
        //            if (handled) {
        //                return -1;
        //            }
        //        } catch (e){
        //        }
        //    }
        //    if (doDown) {
        //        if (this.mMovement.onKeyDown(this, <Spannable> this.mText, keyCode, event)) {
        //            if (event.getRepeatCount() == 0 && !KeyEvent.isModifierKey(keyCode)) {
        //                this.mPreventDefaultMovement = true;
        //            }
        //            return 2;
        //        }
        //    }
        //}
        //return this.mPreventDefaultMovement && !KeyEvent.isModifierKey(keyCode) ? -1 : 0;
    }

    /**
     * Resets the mErrorWasChanged flag, so that future calls to {@link #setError(CharSequence)}
     * can be recorded.
     * @hide
     */
    resetErrorChangedFlag():void  {
        /*
         * Keep track of what the error was before doing the input
         * so that if an input filter changed the error, we leave
         * that error showing.  Otherwise, we take down whatever
         * error was showing when the user types something.
         */
        //if (this.mEditor != null)
        //    this.mEditor.mErrorWasChanged = false;
    }

    /**
     * @hide
     */
    hideErrorIfUnchanged():void  {
        //if (this.mEditor != null && this.mEditor.mError != null && !this.mEditor.mErrorWasChanged) {
        //    this.setError(null, null);
        //}
    }

    onKeyUp(keyCode:number, event:KeyEvent):boolean  {
        //if (!this.isEnabled()) {
            return super.onKeyUp(keyCode, event);
        //}
        //if (!KeyEvent.isModifierKey(keyCode)) {
        //    this.mPreventDefaultMovement = false;
        //}
        //switch(keyCode) {
        //    case KeyEvent.KEYCODE_DPAD_CENTER:
        //        if (event.hasNoModifiers()) {
        //            /*
        //             * If there is a click listener, just call through to
        //             * super, which will invoke it.
        //             *
        //             * If there isn't a click listener, try to show the soft
        //             * input method.  (It will also
        //             * call performClick(), but that won't do anything in
        //             * this case.)
        //             */
        //            if (!this.hasOnClickListeners()) {
        //                if (this.mMovement != null && this.mText instanceof Editable && this.mLayout != null && this.onCheckIsTextEditor()) {
        //                    let imm:InputMethodManager = InputMethodManager.peekInstance();
        //                    this.viewClicked(imm);
        //                    if (imm != null && this.getShowSoftInputOnFocus()) {
        //                        imm.showSoftInput(this, 0);
        //                    }
        //                }
        //            }
        //        }
        //        return super.onKeyUp(keyCode, event);
        //    case KeyEvent.KEYCODE_ENTER:
        //        if (event.hasNoModifiers()) {
        //            if (this.mEditor != null && this.mEditor.mInputContentType != null && this.mEditor.mInputContentType.onEditorActionListener != null && this.mEditor.mInputContentType.enterDown) {
        //                this.mEditor.mInputContentType.enterDown = false;
        //                if (this.mEditor.mInputContentType.onEditorActionListener.onEditorAction(this, EditorInfo.IME_NULL, event)) {
        //                    return true;
        //                }
        //            }
        //            if ((event.getFlags() & KeyEvent.FLAG_EDITOR_ACTION) != 0 || this.shouldAdvanceFocusOnEnter()) {
        //                /*
        //                 * If there is a click listener, just call through to
        //                 * super, which will invoke it.
        //                 *
        //                 * If there isn't a click listener, try to advance focus,
        //                 * but still call through to super, which will reset the
        //                 * pressed state and longpress state.  (It will also
        //                 * call performClick(), but that won't do anything in
        //                 * this case.)
        //                 */
        //                if (!this.hasOnClickListeners()) {
        //                    let v:View = this.focusSearch(TextView.FOCUS_DOWN);
        //                    if (v != null) {
        //                        if (!v.requestFocus(TextView.FOCUS_DOWN)) {
        //                            throw Error(`new IllegalStateException("focus search returned a view " + "that wasn't able to take focus!")`);
        //                        }
        //                        /*
        //                         * Return true because we handled the key; super
        //                         * will return false because there was no click
        //                         * listener.
        //                         */
        //                        super.onKeyUp(keyCode, event);
        //                        return true;
        //                    } else if ((event.getFlags() & KeyEvent.FLAG_EDITOR_ACTION) != 0) {
        //                        // No target for next focus, but make sure the IME
        //                        // if this came from it.
        //                        let imm:InputMethodManager = InputMethodManager.peekInstance();
        //                        if (imm != null && imm.isActive(this)) {
        //                            imm.hideSoftInputFromWindow(this.getWindowToken(), 0);
        //                        }
        //                    }
        //                }
        //            }
        //            return super.onKeyUp(keyCode, event);
        //        }
        //        break;
        //}
        //if (this.mEditor != null && this.mEditor.mKeyListener != null)
        //    if (this.mEditor.mKeyListener.onKeyUp(this, <Editable> this.mText, keyCode, event))
        //        return true;
        //if (this.mMovement != null && this.mLayout != null)
        //    if (this.mMovement.onKeyUp(this, <Spannable> this.mText, keyCode, event))
        //        return true;
        //return super.onKeyUp(keyCode, event);
    }

    onCheckIsTextEditor():boolean  {
        return false;
        //return this.mEditor != null && this.mEditor.mInputType != EditorInfo.TYPE_NULL;
    }

    //onCreateInputConnection(outAttrs:EditorInfo):InputConnection  {
    //    if (this.onCheckIsTextEditor() && this.isEnabled()) {
    //        this.mEditor.createInputMethodStateIfNeeded();
    //        outAttrs.inputType = this.getInputType();
    //        if (this.mEditor.mInputContentType != null) {
    //            outAttrs.imeOptions = this.mEditor.mInputContentType.imeOptions;
    //            outAttrs.privateImeOptions = this.mEditor.mInputContentType.privateImeOptions;
    //            outAttrs.actionLabel = this.mEditor.mInputContentType.imeActionLabel;
    //            outAttrs.actionId = this.mEditor.mInputContentType.imeActionId;
    //            outAttrs.extras = this.mEditor.mInputContentType.extras;
    //        } else {
    //            outAttrs.imeOptions = EditorInfo.IME_NULL;
    //        }
    //        if (this.focusSearch(TextView.FOCUS_DOWN) != null) {
    //            outAttrs.imeOptions |= EditorInfo.IME_FLAG_NAVIGATE_NEXT;
    //        }
    //        if (this.focusSearch(TextView.FOCUS_UP) != null) {
    //            outAttrs.imeOptions |= EditorInfo.IME_FLAG_NAVIGATE_PREVIOUS;
    //        }
    //        if ((outAttrs.imeOptions & EditorInfo.IME_MASK_ACTION) == EditorInfo.IME_ACTION_UNSPECIFIED) {
    //            if ((outAttrs.imeOptions & EditorInfo.IME_FLAG_NAVIGATE_NEXT) != 0) {
    //                // An action has not been set, but the enter key will move to
    //                // the next focus, so set the action to that.
    //                outAttrs.imeOptions |= EditorInfo.IME_ACTION_NEXT;
    //            } else {
    //                // An action has not been set, and there is no focus to move
    //                // to, so let's just supply a "done" action.
    //                outAttrs.imeOptions |= EditorInfo.IME_ACTION_DONE;
    //            }
    //            if (!this.shouldAdvanceFocusOnEnter()) {
    //                outAttrs.imeOptions |= EditorInfo.IME_FLAG_NO_ENTER_ACTION;
    //            }
    //        }
    //        if (TextView.isMultilineInputType(outAttrs.inputType)) {
    //            // Multi-line text editors should always show an enter key.
    //            outAttrs.imeOptions |= EditorInfo.IME_FLAG_NO_ENTER_ACTION;
    //        }
    //        outAttrs.hintText = this.mHint;
    //        if (this.mText instanceof Editable) {
    //            let ic:InputConnection = new EditableInputConnection(this);
    //            outAttrs.initialSelStart = this.getSelectionStart();
    //            outAttrs.initialSelEnd = this.getSelectionEnd();
    //            outAttrs.initialCapsMode = ic.getCursorCapsMode(this.getInputType());
    //            return ic;
    //        }
    //    }
    //    return null;
    //}
    //
    ///**
    // * If this TextView contains editable content, extract a portion of it
    // * based on the information in <var>request</var> in to <var>outText</var>.
    // * @return Returns true if the text was successfully extracted, else false.
    // */
    //extractText(request:ExtractedTextRequest, outText:ExtractedText):boolean  {
    //    this.createEditorIfNeeded();
    //    return this.mEditor.extractText(request, outText);
    //}
    //
    ///**
    // * This is used to remove all style-impacting spans from text before new
    // * extracted text is being replaced into it, so that we don't have any
    // * lingering spans applied during the replace.
    // */
    //static removeParcelableSpans(spannable:Spannable, start:number, end:number):void  {
    //    let spans:any[] = spannable.getSpans(start, end, ParcelableSpan.class);
    //    let i:number = spans.length;
    //    while (i > 0) {
    //        i--;
    //        spannable.removeSpan(spans[i]);
    //    }
    //}
    //
    ///**
    // * Apply to this text view the given extracted text, as previously
    // * returned by {@link #extractText(ExtractedTextRequest, ExtractedText)}.
    // */
    //setExtractedText(text:ExtractedText):void  {
    //    let content:Editable = this.getEditableText();
    //    if (text.text != null) {
    //        if (content == null) {
    //            this.setText(text.text, TextView.BufferType.EDITABLE);
    //        } else if (text.partialStartOffset < 0) {
    //            TextView.removeParcelableSpans(content, 0, content.length());
    //            content.replace(0, content.length(), text.text);
    //        } else {
    //            const N:number = content.length();
    //            let start:number = text.partialStartOffset;
    //            if (start > N)
    //                start = N;
    //            let end:number = text.partialEndOffset;
    //            if (end > N)
    //                end = N;
    //            TextView.removeParcelableSpans(content, start, end);
    //            content.replace(start, end, text.text);
    //        }
    //    }
    //    // Now set the selection position...  make sure it is in range, to
    //    // avoid crashes.  If this is a partial update, it is possible that
    //    // the underlying text may have changed, causing us problems here.
    //    // Also we just don't want to trust clients to do the right thing.
    //    let sp:Spannable = <Spannable> this.getText();
    //    const N:number = sp.length();
    //    let start:number = text.selectionStart;
    //    if (start < 0)
    //        start = 0;
    //    else if (start > N)
    //        start = N;
    //    let end:number = text.selectionEnd;
    //    if (end < 0)
    //        end = 0;
    //    else if (end > N)
    //        end = N;
    //    Selection.setSelection(sp, start, end);
    //    // Finally, update the selection mode.
    //    if ((text.flags & ExtractedText.FLAG_SELECTING) != 0) {
    //        MetaKeyKeyListener.startSelecting(this, sp);
    //    } else {
    //        MetaKeyKeyListener.stopSelecting(this, sp);
    //    }
    //}
    //
    ///**
    // * @hide
    // */
    //setExtracting(req:ExtractedTextRequest):void  {
    //    if (this.mEditor.mInputMethodState != null) {
    //        this.mEditor.mInputMethodState.mExtractedTextRequest = req;
    //    }
    //    // This would stop a possible selection mode, but no such mode is started in case
    //    // extracted mode will start. Some text is selected though, and will trigger an action mode
    //    // in the extracted view.
    //    this.mEditor.hideControllers();
    //}
    //
    ///**
    // * Called by the framework in response to a text completion from
    // * the current input method, provided by it calling
    // * {@link InputConnection#commitCompletion
    // * InputConnection.commitCompletion()}.  The default implementation does
    // * nothing; text views that are supporting auto-completion should override
    // * this to do their desired behavior.
    // *
    // * @param text The auto complete text the user has selected.
    // */
    //onCommitCompletion(text:CompletionInfo):void  {
    //// intentionally empty
    //}
    //
    ///**
    // * Called by the framework in response to a text auto-correction (such as fixing a typo using a
    // * a dictionnary) from the current input method, provided by it calling
    // * {@link InputConnection#commitCorrection} InputConnection.commitCorrection()}. The default
    // * implementation flashes the background of the corrected word to provide feedback to the user.
    // *
    // * @param info The auto correct info about the text that was corrected.
    // */
    //onCommitCorrection(info:CorrectionInfo):void  {
    //    if (this.mEditor != null)
    //        this.mEditor.onCommitCorrection(info);
    //}
    //
    //beginBatchEdit():void  {
    //    if (this.mEditor != null)
    //        this.mEditor.beginBatchEdit();
    //}
    //
    //endBatchEdit():void  {
    //    if (this.mEditor != null)
    //        this.mEditor.endBatchEdit();
    //}
    //
    ///**
    // * Called by the framework in response to a request to begin a batch
    // * of edit operations through a call to link {@link #beginBatchEdit()}.
    // */
    //onBeginBatchEdit():void  {
    //// intentionally empty
    //}
    //
    ///**
    // * Called by the framework in response to a request to end a batch
    // * of edit operations through a call to link {@link #endBatchEdit}.
    // */
    //onEndBatchEdit():void  {
    //// intentionally empty
    //}

    /**
     * Called by the framework in response to a private command from the
     * current method, provided by it calling
     * {@link InputConnection#performPrivateCommand
     * InputConnection.performPrivateCommand()}.
     *
     * @param action The action name of the command.
     * @param data Any additional data for the command.  This may be null.
     * @return Return true if you handled the command, else false.
     */
    //onPrivateIMECommand(action:string, data:Bundle):boolean  {
    //    return false;
    //}

    private nullLayouts():void  {
        if (this.mLayout instanceof BoringLayout && this.mSavedLayout == null) {
            this.mSavedLayout = <BoringLayout> this.mLayout;
        }
        if (this.mHintLayout instanceof BoringLayout && this.mSavedHintLayout == null) {
            this.mSavedHintLayout = <BoringLayout> this.mHintLayout;
        }
        this.mSavedMarqueeModeLayout = this.mLayout = this.mHintLayout = null;
        this.mBoring = this.mHintBoring = null;
        // Since it depends on the value of mLayout
        //if (this.mEditor != null)
        //    this.mEditor.prepareCursorControllers();
    }

    /**
     * Make a new Layout based on the already-measured size of the view,
     * on the assumption that it was measured correctly at some point.
     */
    private assumeLayout():void  {
        let width:number = this.mRight - this.mLeft - this.getCompoundPaddingLeft() - this.getCompoundPaddingRight();
        if (width < 1) {
            width = 0;
        }
        let physicalWidth:number = width;
        if (this.mHorizontallyScrolling) {
            width = TextView.VERY_WIDE;
        }
        this.makeNewLayout(width, physicalWidth, TextView.UNKNOWN_BORING, TextView.UNKNOWN_BORING, physicalWidth, false);
    }

    private getLayoutAlignment():Layout.Alignment  {
        let alignment:Layout.Alignment;
        //switch(this.getTextAlignment()) {
        //    case TextView.TEXT_ALIGNMENT_GRAVITY:
                switch(this.mGravity & Gravity.HORIZONTAL_GRAVITY_MASK) {
                    //case Gravity.START:
                    //    alignment = Layout.Alignment.ALIGN_NORMAL;
                    //    break;
                    //case Gravity.END:
                    //    alignment = Layout.Alignment.ALIGN_OPPOSITE;
                    //    break;
                    case Gravity.LEFT:
                        alignment = Layout.Alignment.ALIGN_LEFT;
                        break;
                    case Gravity.RIGHT:
                        alignment = Layout.Alignment.ALIGN_RIGHT;
                        break;
                    case Gravity.CENTER_HORIZONTAL:
                        alignment = Layout.Alignment.ALIGN_CENTER;
                        break;
                    default:
                        alignment = Layout.Alignment.ALIGN_NORMAL;
                        break;
                }
        //        break;
        //    case TextView.TEXT_ALIGNMENT_TEXT_START:
        //        alignment = Layout.Alignment.ALIGN_NORMAL;
        //        break;
        //    case TextView.TEXT_ALIGNMENT_TEXT_END:
        //        alignment = Layout.Alignment.ALIGN_OPPOSITE;
        //        break;
        //    case TextView.TEXT_ALIGNMENT_CENTER:
        //        alignment = Layout.Alignment.ALIGN_CENTER;
        //        break;
        //    case TextView.TEXT_ALIGNMENT_VIEW_START:
        //        alignment = (this.getLayoutDirection() == TextView.LAYOUT_DIRECTION_RTL) ? Layout.Alignment.ALIGN_RIGHT : Layout.Alignment.ALIGN_LEFT;
        //        break;
        //    case TextView.TEXT_ALIGNMENT_VIEW_END:
        //        alignment = (this.getLayoutDirection() == TextView.LAYOUT_DIRECTION_RTL) ? Layout.Alignment.ALIGN_LEFT : Layout.Alignment.ALIGN_RIGHT;
        //        break;
        //    case TextView.TEXT_ALIGNMENT_INHERIT:
        //    // but better safe than sorry so we just fall through
        //    default:
        //        alignment = Layout.Alignment.ALIGN_NORMAL;
        //        break;
        //}
        return alignment;
    }

    /**
     * The width passed in is now the desired layout width,
     * not the full view width with padding.
     * {@hide}
     */
    protected makeNewLayout(wantWidth:number, hintWidth:number, boring:BoringLayout.Metrics, hintBoring:BoringLayout.Metrics, ellipsisWidth:number, bringIntoView:boolean):void  {
        this.stopMarquee();
        // Update "old" cached values
        this.mOldMaximum = this.mMaximum;
        this.mOldMaxMode = this.mMaxMode;
        this.mHighlightPathBogus = true;
        if (wantWidth < 0) {
            wantWidth = 0;
        }
        if (hintWidth < 0) {
            hintWidth = 0;
        }
        let alignment:Layout.Alignment = this.getLayoutAlignment();
        const testDirChange:boolean = this.mSingleLine && this.mLayout != null && (alignment == Layout.Alignment.ALIGN_NORMAL || alignment == Layout.Alignment.ALIGN_OPPOSITE);
        let oldDir:number = 0;
        if (testDirChange)
            oldDir = this.mLayout.getParagraphDirection(0);
        let shouldEllipsize:boolean = this.mEllipsize != null && this.getKeyListener() == null;
        const switchEllipsize:boolean = this.mEllipsize == TruncateAt.MARQUEE && this.mMarqueeFadeMode != TextView.MARQUEE_FADE_NORMAL;
        let effectiveEllipsize:TruncateAt = this.mEllipsize;
        if (this.mEllipsize == TruncateAt.MARQUEE && this.mMarqueeFadeMode == TextView.MARQUEE_FADE_SWITCH_SHOW_ELLIPSIS) {
            effectiveEllipsize = TruncateAt.END_SMALL;
        }
        if (this.mTextDir == null) {
            this.mTextDir = this.getTextDirectionHeuristic();
        }
        this.mLayout = this.makeSingleLayout(wantWidth, boring, ellipsisWidth, alignment, shouldEllipsize, effectiveEllipsize, effectiveEllipsize == this.mEllipsize);
        if (switchEllipsize) {
            let oppositeEllipsize:TruncateAt = effectiveEllipsize == TruncateAt.MARQUEE ? TruncateAt.END : TruncateAt.MARQUEE;
            this.mSavedMarqueeModeLayout = this.makeSingleLayout(wantWidth, boring, ellipsisWidth, alignment, shouldEllipsize, oppositeEllipsize, effectiveEllipsize != this.mEllipsize);
        }
        shouldEllipsize = this.mEllipsize != null;
        this.mHintLayout = null;
        if (this.mHint != null) {
            if (shouldEllipsize)
                hintWidth = wantWidth;
            if (hintBoring == TextView.UNKNOWN_BORING) {
                hintBoring = BoringLayout.isBoring(this.mHint, this.mTextPaint, this.mTextDir, this.mHintBoring);
                if (hintBoring != null) {
                    this.mHintBoring = hintBoring;
                }
            }
            if (hintBoring != null) {
                if (hintBoring.width <= hintWidth && (!shouldEllipsize || hintBoring.width <= ellipsisWidth)) {
                    if (this.mSavedHintLayout != null) {
                        this.mHintLayout = this.mSavedHintLayout.replaceOrMake(this.mHint, this.mTextPaint, hintWidth, alignment, this.mSpacingMult, this.mSpacingAdd, hintBoring, this.mIncludePad);
                    } else {
                        this.mHintLayout = BoringLayout.make(this.mHint, this.mTextPaint, hintWidth, alignment, this.mSpacingMult, this.mSpacingAdd, hintBoring, this.mIncludePad);
                    }
                    this.mSavedHintLayout = <BoringLayout> this.mHintLayout;
                } else if (shouldEllipsize && hintBoring.width <= hintWidth) {
                    if (this.mSavedHintLayout != null) {
                        this.mHintLayout = this.mSavedHintLayout.replaceOrMake(this.mHint, this.mTextPaint, hintWidth, alignment, this.mSpacingMult, this.mSpacingAdd, hintBoring, this.mIncludePad, this.mEllipsize, ellipsisWidth);
                    } else {
                        this.mHintLayout = BoringLayout.make(this.mHint, this.mTextPaint, hintWidth, alignment, this.mSpacingMult, this.mSpacingAdd, hintBoring, this.mIncludePad, this.mEllipsize, ellipsisWidth);
                    }
                } else if (shouldEllipsize) {
                    this.mHintLayout = new StaticLayout(this.mHint, 0, this.mHint.length, this.mTextPaint, hintWidth, alignment, this.mTextDir, this.mSpacingMult, this.mSpacingAdd, this.mIncludePad, this.mEllipsize, ellipsisWidth, this.mMaxMode == TextView.LINES ? this.mMaximum : Integer.MAX_VALUE);
                } else {
                    this.mHintLayout = new StaticLayout(this.mHint, 0, this.mHint.length, this.mTextPaint, hintWidth, alignment, this.mTextDir, this.mSpacingMult, this.mSpacingAdd, this.mIncludePad);
                }
            } else if (shouldEllipsize) {
                this.mHintLayout = new StaticLayout(this.mHint, 0, this.mHint.length, this.mTextPaint, hintWidth, alignment, this.mTextDir, this.mSpacingMult, this.mSpacingAdd, this.mIncludePad, this.mEllipsize, ellipsisWidth, this.mMaxMode == TextView.LINES ? this.mMaximum : Integer.MAX_VALUE);
            } else {
                this.mHintLayout = new StaticLayout(this.mHint, 0, this.mHint.length, this.mTextPaint, hintWidth, alignment, this.mTextDir, this.mSpacingMult, this.mSpacingAdd, this.mIncludePad);
            }
        }
        if (bringIntoView || (testDirChange && oldDir != this.mLayout.getParagraphDirection(0))) {
            this.registerForPreDraw();
        }
        if (this.mEllipsize == TextUtils.TruncateAt.MARQUEE) {
            if (!this.compressText(ellipsisWidth)) {
                const height:number = this.mLayoutParams.height;
                // start the marquee immediately
                if (height != LayoutParams.WRAP_CONTENT && height != LayoutParams.MATCH_PARENT) {
                    this.startMarquee();
                } else {
                    // Defer the start of the marquee until we know our width (see setFrame())
                    this.mRestartMarquee = true;
                }
            }
        }
        // CursorControllers need a non-null mLayout
        //if (this.mEditor != null)
        //    this.mEditor.prepareCursorControllers();
    }

    private makeSingleLayout(wantWidth:number, boring:BoringLayout.Metrics, ellipsisWidth:number, alignment:Layout.Alignment, shouldEllipsize:boolean, effectiveEllipsize:TruncateAt, useSaved:boolean):Layout  {
        let result:Layout = null;
        if (Spannable.isImpl(this.mText)) {
            result = new DynamicLayout(this.mText, this.mTransformed, this.mTextPaint, wantWidth, alignment, this.mTextDir, this.mSpacingMult, this.mSpacingAdd, this.mIncludePad, this.getKeyListener() == null ? effectiveEllipsize : null, ellipsisWidth);
        } else {
            if (boring == TextView.UNKNOWN_BORING) {
                boring = BoringLayout.isBoring(this.mTransformed, this.mTextPaint, this.mTextDir, this.mBoring);
                if (boring != null) {
                    this.mBoring = boring;
                }
            }
            if (boring != null) {
                if (boring.width <= wantWidth && (effectiveEllipsize == null || boring.width <= ellipsisWidth)) {
                    if (useSaved && this.mSavedLayout != null) {
                        result = this.mSavedLayout.replaceOrMake(this.mTransformed, this.mTextPaint, wantWidth, alignment, this.mSpacingMult, this.mSpacingAdd, boring, this.mIncludePad);
                    } else {
                        result = BoringLayout.make(this.mTransformed, this.mTextPaint, wantWidth, alignment, this.mSpacingMult, this.mSpacingAdd, boring, this.mIncludePad);
                    }
                    if (useSaved) {
                        this.mSavedLayout = <BoringLayout> result;
                    }
                } else if (shouldEllipsize && boring.width <= wantWidth) {
                    if (useSaved && this.mSavedLayout != null) {
                        result = this.mSavedLayout.replaceOrMake(this.mTransformed, this.mTextPaint, wantWidth, alignment, this.mSpacingMult, this.mSpacingAdd, boring, this.mIncludePad, effectiveEllipsize, ellipsisWidth);
                    } else {
                        result = BoringLayout.make(this.mTransformed, this.mTextPaint, wantWidth, alignment, this.mSpacingMult, this.mSpacingAdd, boring, this.mIncludePad, effectiveEllipsize, ellipsisWidth);
                    }
                } else if (shouldEllipsize) {
                    result = new StaticLayout(this.mTransformed, 0, this.mTransformed.length, this.mTextPaint, wantWidth, alignment, this.mTextDir, this.mSpacingMult, this.mSpacingAdd, this.mIncludePad, effectiveEllipsize, ellipsisWidth, this.mMaxMode == TextView.LINES ? this.mMaximum : Integer.MAX_VALUE);
                } else {
                    result = new StaticLayout(this.mTransformed, 0, this.mTransformed.length, this.mTextPaint, wantWidth, alignment, this.mTextDir, this.mSpacingMult, this.mSpacingAdd, this.mIncludePad);
                }
            } else if (shouldEllipsize) {
                result = new StaticLayout(this.mTransformed, 0, this.mTransformed.length, this.mTextPaint, wantWidth, alignment, this.mTextDir, this.mSpacingMult, this.mSpacingAdd, this.mIncludePad, effectiveEllipsize, ellipsisWidth, this.mMaxMode == TextView.LINES ? this.mMaximum : Integer.MAX_VALUE);
            } else {
                result = new StaticLayout(this.mTransformed, 0, this.mTransformed.length, this.mTextPaint, wantWidth, alignment, this.mTextDir, this.mSpacingMult, this.mSpacingAdd, this.mIncludePad);
            }
        }
        return result;
    }

    private compressText(width:number):boolean  {
        if (this.isHardwareAccelerated())
            return false;
        // Only compress the text if it hasn't been compressed by the previous pass
        if (width > 0.0 && this.mLayout != null && this.getLineCount() == 1 && !this.mUserSetTextScaleX && this.mTextPaint.getTextScaleX() == 1.0) {
            const textWidth:number = this.mLayout.getLineWidth(0);
            const overflow:number = (textWidth + 1.0 - width) / width;
            if (overflow > 0.0 && overflow <= TextView.Marquee.MARQUEE_DELTA_MAX) {
                this.mTextPaint.setTextScaleX(1.0 - overflow - 0.005);
                this.post((()=>{
                    const _this=this;
                    class _Inner implements Runnable {

                        run():void  {
                            _this.requestLayout();
                        }
                    }
                    return new _Inner();
                })());
                return true;
            }
        }
        return false;
    }

    private static desired(layout:Layout):number  {
        let n:number = layout.getLineCount();
        let text:String = layout.getText();
        let max:number = 0;
        for (let i:number = 0; i < n - 1; i++) {
            if (text.charAt(layout.getLineEnd(i) - 1) != '\n')
                return -1;
        }
        for (let i:number = 0; i < n; i++) {
            max = Math.max(max, layout.getLineWidth(i));
        }
        return Math.floor(Math.ceil(max));
    }

    /**
     * Set whether the TextView includes extra top and bottom padding to make
     * room for accents that go above the normal ascent and descent.
     * The default is true.
     *
     * @see #getIncludeFontPadding()
     *
     * @attr ref android.R.styleable#TextView_includeFontPadding
     */
    setIncludeFontPadding(includepad:boolean):void  {
        if (this.mIncludePad != includepad) {
            this.mIncludePad = includepad;
            if (this.mLayout != null) {
                this.nullLayouts();
                this.requestLayout();
                this.invalidate();
            }
        }
    }

    /**
     * Gets whether the TextView includes extra top and bottom padding to make
     * room for accents that go above the normal ascent and descent.
     *
     * @see #setIncludeFontPadding(boolean)
     *
     * @attr ref android.R.styleable#TextView_includeFontPadding
     */
    getIncludeFontPadding():boolean  {
        return this.mIncludePad;
    }

    private static UNKNOWN_BORING:BoringLayout.Metrics = new BoringLayout.Metrics();

    protected onMeasure(widthMeasureSpec:number, heightMeasureSpec:number):void  {
        let widthMode:number = TextView.MeasureSpec.getMode(widthMeasureSpec);
        let heightMode:number = TextView.MeasureSpec.getMode(heightMeasureSpec);
        let widthSize:number = TextView.MeasureSpec.getSize(widthMeasureSpec);
        let heightSize:number = TextView.MeasureSpec.getSize(heightMeasureSpec);
        let width:number;
        let height:number;
        let boring:BoringLayout.Metrics = TextView.UNKNOWN_BORING;
        let hintBoring:BoringLayout.Metrics = TextView.UNKNOWN_BORING;
        if (this.mTextDir == null) {
            this.mTextDir = this.getTextDirectionHeuristic();
        }
        let des:number = -1;
        let fromexisting:boolean = false;
        if (widthMode == TextView.MeasureSpec.EXACTLY) {
            // Parent has told us how big to be. So be it.
            width = widthSize;
        } else {
            if (this.mLayout != null && this.mEllipsize == null) {
                des = TextView.desired(this.mLayout);
            }
            if (des < 0) {
                boring = BoringLayout.isBoring(this.mTransformed, this.mTextPaint, this.mTextDir, this.mBoring);
                if (boring != null) {
                    this.mBoring = boring;
                }
            } else {
                fromexisting = true;
            }
            if (boring == null || boring == TextView.UNKNOWN_BORING) {
                if (des < 0) {
                    des = Math.floor(Math.ceil(Layout.getDesiredWidth(this.mTransformed, this.mTextPaint)));
                }
                width = des;
            } else {
                width = boring.width;
            }
            const dr:TextView.Drawables = this.mDrawables;
            if (dr != null) {
                width = Math.max(width, dr.mDrawableWidthTop);
                width = Math.max(width, dr.mDrawableWidthBottom);
            }
            if (this.mHint != null) {
                let hintDes:number = -1;
                let hintWidth:number;
                if (this.mHintLayout != null && this.mEllipsize == null) {
                    hintDes = TextView.desired(this.mHintLayout);
                }
                if (hintDes < 0) {
                    hintBoring = BoringLayout.isBoring(this.mHint, this.mTextPaint, this.mTextDir, this.mHintBoring);
                    if (hintBoring != null) {
                        this.mHintBoring = hintBoring;
                    }
                }
                if (hintBoring == null || hintBoring == TextView.UNKNOWN_BORING) {
                    if (hintDes < 0) {
                        hintDes = Math.floor(Math.ceil(Layout.getDesiredWidth(this.mHint, this.mTextPaint)));
                    }
                    hintWidth = hintDes;
                } else {
                    hintWidth = hintBoring.width;
                }
                if (hintWidth > width) {
                    width = hintWidth;
                }
            }
            width += this.getCompoundPaddingLeft() + this.getCompoundPaddingRight();
            if (this.mMaxWidthMode == TextView.EMS) {
                width = Math.min(width, this.mMaxWidthValue * this.getLineHeight());
            } else {
                width = Math.min(width, this.mMaxWidthValue);
            }
            if (this.mMinWidthMode == TextView.EMS) {
                width = Math.max(width, this.mMinWidthValue * this.getLineHeight());
            } else {
                width = Math.max(width, this.mMinWidthValue);
            }
            // Check against our minimum width
            width = Math.max(width, this.getSuggestedMinimumWidth());
            if (widthMode == TextView.MeasureSpec.AT_MOST) {
                width = Math.min(widthSize, width);
            }
        }
        let want:number = width - this.getCompoundPaddingLeft() - this.getCompoundPaddingRight();
        let unpaddedWidth:number = want;
        if (this.mHorizontallyScrolling)
            want = TextView.VERY_WIDE;
        let hintWant:number = want;
        let hintWidth:number = (this.mHintLayout == null) ? hintWant : this.mHintLayout.getWidth();
        if (this.mLayout == null) {
            this.makeNewLayout(want, hintWant, boring, hintBoring, width - this.getCompoundPaddingLeft() - this.getCompoundPaddingRight(), false);
        } else {
            const layoutChanged:boolean = (this.mLayout.getWidth() != want) || (hintWidth != hintWant) || (this.mLayout.getEllipsizedWidth() != width - this.getCompoundPaddingLeft() - this.getCompoundPaddingRight());
            const widthChanged:boolean = (this.mHint == null) && (this.mEllipsize == null) && (want > this.mLayout.getWidth()) && (this.mLayout instanceof BoringLayout || (fromexisting && des >= 0 && des <= want));
            const maximumChanged:boolean = (this.mMaxMode != this.mOldMaxMode) || (this.mMaximum != this.mOldMaximum);
            if (layoutChanged || maximumChanged) {
                if (!maximumChanged && widthChanged) {
                    this.mLayout.increaseWidthTo(want);
                } else {
                    this.makeNewLayout(want, hintWant, boring, hintBoring, width - this.getCompoundPaddingLeft() - this.getCompoundPaddingRight(), false);
                }
            } else {
            // Nothing has changed
            }
        }
        if (heightMode == TextView.MeasureSpec.EXACTLY) {
            // Parent has told us how big to be. So be it.
            height = heightSize;
            this.mDesiredHeightAtMeasure = -1;
        } else {
            let desired:number = this.getDesiredHeight();
            height = desired;
            this.mDesiredHeightAtMeasure = desired;
            if (heightMode == TextView.MeasureSpec.AT_MOST) {
                height = Math.min(desired, heightSize);
            }
        }
        let unpaddedHeight:number = height - this.getCompoundPaddingTop() - this.getCompoundPaddingBottom();
        if (this.mMaxMode == TextView.LINES && this.mLayout.getLineCount() > this.mMaximum) {
            unpaddedHeight = Math.min(unpaddedHeight, this.mLayout.getLineTop(this.mMaximum));
        }
        /*
         * We didn't let makeNewLayout() register to bring the cursor into view,
         * so do it here if there is any possibility that it is needed.
         */
        if (this.mMovement != null || this.mLayout.getWidth() > unpaddedWidth || this.mLayout.getHeight() > unpaddedHeight) {
            this.registerForPreDraw();
        } else {
            this.scrollTo(0, 0);
        }
        this.setMeasuredDimension(width, height);
    }

    private getDesiredHeight(layout?:Layout, cap=true):number  {
        if(arguments.length===0){
            return Math.max(this.getDesiredHeight(this.mLayout, true), this.getDesiredHeight(this.mHintLayout, this.mEllipsize != null));
        }
        
        if (layout == null) {
            return 0;
        }
        let linecount:number = layout.getLineCount();
        let pad:number = this.getCompoundPaddingTop() + this.getCompoundPaddingBottom();
        let desired:number = layout.getLineTop(linecount);
        const dr:TextView.Drawables = this.mDrawables;
        if (dr != null) {
            desired = Math.max(desired, dr.mDrawableHeightLeft);
            desired = Math.max(desired, dr.mDrawableHeightRight);
        }
        desired += pad;
        if (this.mMaxMode == TextView.LINES) {
            /*
             * Don't cap the hint to a certain number of lines.
             * (Do cap it, though, if we have a maximum pixel height.)
             */
            if (cap) {
                if (linecount > this.mMaximum) {
                    desired = layout.getLineTop(this.mMaximum);
                    if (dr != null) {
                        desired = Math.max(desired, dr.mDrawableHeightLeft);
                        desired = Math.max(desired, dr.mDrawableHeightRight);
                    }
                    desired += pad;
                    linecount = this.mMaximum;
                }
            }
        } else {
            desired = Math.min(desired, this.mMaximum);
        }
        if (this.mMinMode == TextView.LINES) {
            if (linecount < this.mMinimum) {
                desired += this.getLineHeight() * (this.mMinimum - linecount);
            }
        } else {
            desired = Math.max(desired, this.mMinimum);
        }
        // Check against our minimum height
        desired = Math.max(desired, this.getSuggestedMinimumHeight());
        return desired;
    }

    /**
     * Check whether a change to the existing text layout requires a
     * new view layout.
     */
    private checkForResize():void  {
        let sizeChanged:boolean = false;
        if (this.mLayout != null) {
            // Check if our width changed
            if (this.mLayoutParams.width == LayoutParams.WRAP_CONTENT) {
                sizeChanged = true;
                this.invalidate();
            }
            // Check if our height changed
            if (this.mLayoutParams.height == LayoutParams.WRAP_CONTENT) {
                let desiredHeight:number = this.getDesiredHeight();
                if (desiredHeight != this.getHeight()) {
                    sizeChanged = true;
                }
            } else if (this.mLayoutParams.height == LayoutParams.MATCH_PARENT) {
                if (this.mDesiredHeightAtMeasure >= 0) {
                    let desiredHeight:number = this.getDesiredHeight();
                    if (desiredHeight != this.mDesiredHeightAtMeasure) {
                        sizeChanged = true;
                    }
                }
            }
        }
        if (sizeChanged) {
            this.requestLayout();
            // caller will have already invalidated
        }
    }

    /**
     * Check whether entirely new text requires a new view layout
     * or merely a new text layout.
     */
    private checkForRelayout():void  {
        if ((this.mLayoutParams.width != LayoutParams.WRAP_CONTENT || (this.mMaxWidthMode == this.mMinWidthMode && this.mMaxWidthValue == this.mMinWidthValue)) && (this.mHint == null || this.mHintLayout != null) && (this.mRight - this.mLeft - this.getCompoundPaddingLeft() - this.getCompoundPaddingRight() > 0)) {
            // Static width, so try making a new text layout.
            let oldht:number = this.mLayout.getHeight();
            let want:number = this.mLayout.getWidth();
            let hintWant:number = this.mHintLayout == null ? 0 : this.mHintLayout.getWidth();
            /*
             * No need to bring the text into view, since the size is not
             * changing (unless we do the requestLayout(), in which case it
             * will happen at measure).
             */
            this.makeNewLayout(want, hintWant, TextView.UNKNOWN_BORING, TextView.UNKNOWN_BORING, this.mRight - this.mLeft - this.getCompoundPaddingLeft() - this.getCompoundPaddingRight(), false);
            if (this.mEllipsize != TextUtils.TruncateAt.MARQUEE) {
                // In a fixed-height view, so use our new text layout.
                if (this.mLayoutParams.height != LayoutParams.WRAP_CONTENT && this.mLayoutParams.height != LayoutParams.MATCH_PARENT) {
                    this.invalidate();
                    return;
                }
                // so use our new text layout.
                if (this.mLayout.getHeight() == oldht && (this.mHintLayout == null || this.mHintLayout.getHeight() == oldht)) {
                    this.invalidate();
                    return;
                }
            }
            // We lose: the height has changed and we have a dynamic height.
            // Request a new view layout using our new text layout.
            this.requestLayout();
            this.invalidate();
        } else {
            // Dynamic width, so we have no choice but to request a new
            // view layout with a new text layout.
            this.nullLayouts();
            this.requestLayout();
            this.invalidate();
        }
    }

    protected onLayout(changed:boolean, left:number, top:number, right:number, bottom:number):void  {
        super.onLayout(changed, left, top, right, bottom);
        if (this.mDeferScroll >= 0) {
            let curs:number = this.mDeferScroll;
            this.mDeferScroll = -1;
            this.bringPointIntoView(Math.min(curs, this.mText.length));
        }
    }

    private isShowingHint():boolean  {
        return TextUtils.isEmpty(this.mText) && !TextUtils.isEmpty(this.mHint);
    }

    /**
     * Returns true if anything changed.
     */
    private bringTextIntoView():boolean  {
        let layout:Layout = this.isShowingHint() ? this.mHintLayout : this.mLayout;
        let line:number = 0;
        if ((this.mGravity & Gravity.VERTICAL_GRAVITY_MASK) == Gravity.BOTTOM) {
            line = layout.getLineCount() - 1;
        }
        let a:Layout.Alignment = layout.getParagraphAlignment(line);
        let dir:number = layout.getParagraphDirection(line);
        let hspace:number = this.mRight - this.mLeft - this.getCompoundPaddingLeft() - this.getCompoundPaddingRight();
        let vspace:number = this.mBottom - this.mTop - this.getExtendedPaddingTop() - this.getExtendedPaddingBottom();
        let ht:number = layout.getHeight();
        let scrollx:number, scrolly:number;
        // Convert to left, center, or right alignment.
        if (a == Layout.Alignment.ALIGN_NORMAL) {
            a = dir == Layout.DIR_LEFT_TO_RIGHT ? Layout.Alignment.ALIGN_LEFT : Layout.Alignment.ALIGN_RIGHT;
        } else if (a == Layout.Alignment.ALIGN_OPPOSITE) {
            a = dir == Layout.DIR_LEFT_TO_RIGHT ? Layout.Alignment.ALIGN_RIGHT : Layout.Alignment.ALIGN_LEFT;
        }
        if (a == Layout.Alignment.ALIGN_CENTER) {
            /*
             * Keep centered if possible, or, if it is too wide to fit,
             * keep leading edge in view.
             */
            let left:number = Math.floor(Math.floor(layout.getLineLeft(line)));
            let right:number = Math.floor(Math.ceil(layout.getLineRight(line)));
            if (right - left < hspace) {
                scrollx = (right + left) / 2 - hspace / 2;
            } else {
                if (dir < 0) {
                    scrollx = right - hspace;
                } else {
                    scrollx = left;
                }
            }
        } else if (a == Layout.Alignment.ALIGN_RIGHT) {
            let right:number = Math.floor(Math.ceil(layout.getLineRight(line)));
            scrollx = right - hspace;
        } else {
            // a == Layout.Alignment.ALIGN_LEFT (will also be the default)
            scrollx = Math.floor(Math.floor(layout.getLineLeft(line)));
        }
        if (ht < vspace) {
            scrolly = 0;
        } else {
            if ((this.mGravity & Gravity.VERTICAL_GRAVITY_MASK) == Gravity.BOTTOM) {
                scrolly = ht - vspace;
            } else {
                scrolly = 0;
            }
        }
        if (scrollx != this.mScrollX || scrolly != this.mScrollY) {
            this.scrollTo(scrollx, scrolly);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Move the point, specified by the offset, into the view if it is needed.
     * This has to be called after layout. Returns true if anything changed.
     */
    bringPointIntoView(offset:number):boolean  {
        if (this.isLayoutRequested()) {
            this.mDeferScroll = offset;
            return false;
        }
        let changed:boolean = false;
        let layout:Layout = this.isShowingHint() ? this.mHintLayout : this.mLayout;
        if (layout == null)
            return changed;
        let line:number = layout.getLineForOffset(offset);
        let grav:number;
        switch(layout.getParagraphAlignment(line)) {
            case Layout.Alignment.ALIGN_LEFT:
                grav = 1;
                break;
            case Layout.Alignment.ALIGN_RIGHT:
                grav = -1;
                break;
            case Layout.Alignment.ALIGN_NORMAL:
                grav = layout.getParagraphDirection(line);
                break;
            case Layout.Alignment.ALIGN_OPPOSITE:
                grav = -layout.getParagraphDirection(line);
                break;
            case Layout.Alignment.ALIGN_CENTER:
            default:
                grav = 0;
                break;
        }
        // We only want to clamp the cursor to fit within the layout width
        // in left-to-right modes, because in a right to left alignment,
        // we want to scroll to keep the line-right on the screen, as other
        // lines are likely to have text flush with the right margin, which
        // we want to keep visible.
        // A better long-term solution would probably be to measure both
        // the full line and a blank-trimmed version, and, for example, use
        // the latter measurement for centering and right alignment, but for
        // the time being we only implement the cursor clamping in left to
        // right where it is most likely to be annoying.
        const clamped:boolean = grav > 0;
        // FIXME: Is it okay to truncate this, or should we round?
        const x:number = Math.floor(layout.getPrimaryHorizontal(offset, clamped));
        const top:number = layout.getLineTop(line);
        const bottom:number = layout.getLineTop(line + 1);
        let left:number = Math.floor(Math.floor(layout.getLineLeft(line)));
        let right:number = Math.floor(Math.ceil(layout.getLineRight(line)));
        let ht:number = layout.getHeight();
        let hspace:number = this.mRight - this.mLeft - this.getCompoundPaddingLeft() - this.getCompoundPaddingRight();
        let vspace:number = this.mBottom - this.mTop - this.getExtendedPaddingTop() - this.getExtendedPaddingBottom();
        if (!this.mHorizontallyScrolling && right - left > hspace && right > x) {
            // If cursor has been clamped, make sure we don't scroll.
            right = Math.max(x, left + hspace);
        }
        let hslack:number = (bottom - top) / 2;
        let vslack:number = hslack;
        if (vslack > vspace / 4)
            vslack = vspace / 4;
        if (hslack > hspace / 4)
            hslack = hspace / 4;
        let hs:number = this.mScrollX;
        let vs:number = this.mScrollY;
        if (top - vs < vslack)
            vs = top - vslack;
        if (bottom - vs > vspace - vslack)
            vs = bottom - (vspace - vslack);
        if (ht - vs < vspace)
            vs = ht - vspace;
        if (0 - vs > 0)
            vs = 0;
        if (grav != 0) {
            if (x - hs < hslack) {
                hs = x - hslack;
            }
            if (x - hs > hspace - hslack) {
                hs = x - (hspace - hslack);
            }
        }
        if (grav < 0) {
            if (left - hs > 0)
                hs = left;
            if (right - hs < hspace)
                hs = right - hspace;
        } else if (grav > 0) {
            if (right - hs < hspace)
                hs = right - hspace;
            if (left - hs > 0)
                hs = left;
        } else /* grav == 0 */
        {
            if (right - left <= hspace) {
                /*
                 * If the entire text fits, center it exactly.
                 */
                hs = left - (hspace - (right - left)) / 2;
            } else if (x > right - hslack) {
                /*
                 * If we are near the right edge, keep the right edge
                 * at the edge of the view.
                 */
                hs = right - hspace;
            } else if (x < left + hslack) {
                /*
                 * If we are near the left edge, keep the left edge
                 * at the edge of the view.
                 */
                hs = left;
            } else if (left > hs) {
                /*
                 * Is there whitespace visible at the left?  Fix it if so.
                 */
                hs = left;
            } else if (right < hs + hspace) {
                /*
                 * Is there whitespace visible at the right?  Fix it if so.
                 */
                hs = right - hspace;
            } else {
                /*
                 * Otherwise, float as needed.
                 */
                if (x - hs < hslack) {
                    hs = x - hslack;
                }
                if (x - hs > hspace - hslack) {
                    hs = x - (hspace - hslack);
                }
            }
        }
        if (hs != this.mScrollX || vs != this.mScrollY) {
            if (this.mScroller == null) {
                this.scrollTo(hs, vs);
            } else {
                let duration:number = AnimationUtils.currentAnimationTimeMillis() - this.mLastScroll;
                let dx:number = hs - this.mScrollX;
                let dy:number = vs - this.mScrollY;
                if (duration > TextView.ANIMATED_SCROLL_GAP) {
                    this.mScroller.startScroll(this.mScrollX, this.mScrollY, dx, dy);
                    this.awakenScrollBars(this.mScroller.getDuration());
                    this.invalidate();
                } else {
                    if (!this.mScroller.isFinished()) {
                        this.mScroller.abortAnimation();
                    }
                    this.scrollBy(dx, dy);
                }
                this.mLastScroll = AnimationUtils.currentAnimationTimeMillis();
            }
            changed = true;
        }
        if (this.isFocused()) {
            // will be ignored.
            if (this.mTempRect == null)
                this.mTempRect = new Rect();
            this.mTempRect.set(x - 2, top, x + 2, bottom);
            this.getInterestingRect(this.mTempRect, line);
            this.mTempRect.offset(this.mScrollX, this.mScrollY);
            //if (this.requestRectangleOnScreen(this.mTempRect)) {
            //    changed = true;
            //}
        }
        return changed;
    }

    /**
     * Move the cursor, if needed, so that it is at an offset that is visible
     * to the user.  This will not move the cursor if it represents more than
     * one character (a selection range).  This will only work if the
     * TextView contains spannable text; otherwise it will do nothing.
     *
     * @return True if the cursor was actually moved, false otherwise.
     */
    moveCursorToVisibleOffset():boolean  {
        //if (!(this.mText instanceof Spannable)) {
        //    return false;
        //}
        //let start:number = this.getSelectionStart();
        //let end:number = this.getSelectionEnd();
        //if (start != end) {
        //    return false;
        //}
        //// First: make sure the line is visible on screen:
        //let line:number = this.mLayout.getLineForOffset(start);
        //const top:number = this.mLayout.getLineTop(line);
        //const bottom:number = this.mLayout.getLineTop(line + 1);
        //const vspace:number = this.mBottom - this.mTop - this.getExtendedPaddingTop() - this.getExtendedPaddingBottom();
        //let vslack:number = (bottom - top) / 2;
        //if (vslack > vspace / 4)
        //    vslack = vspace / 4;
        //const vs:number = this.mScrollY;
        //if (top < (vs + vslack)) {
        //    line = this.mLayout.getLineForVertical(vs + vslack + (bottom - top));
        //} else if (bottom > (vspace + vs - vslack)) {
        //    line = this.mLayout.getLineForVertical(vspace + vs - vslack - (bottom - top));
        //}
        //// Next: make sure the character is visible on screen:
        //const hspace:number = this.mRight - this.mLeft - this.getCompoundPaddingLeft() - this.getCompoundPaddingRight();
        //const hs:number = this.mScrollX;
        //const leftChar:number = this.mLayout.getOffsetForHorizontal(line, hs);
        //const rightChar:number = this.mLayout.getOffsetForHorizontal(line, hspace + hs);
        //// line might contain bidirectional text
        //const lowChar:number = leftChar < rightChar ? leftChar : rightChar;
        //const highChar:number = leftChar > rightChar ? leftChar : rightChar;
        //let newStart:number = start;
        //if (newStart < lowChar) {
        //    newStart = lowChar;
        //} else if (newStart > highChar) {
        //    newStart = highChar;
        //}
        //if (newStart != start) {
        //    Selection.setSelection(<Spannable> this.mText, newStart);
        //    return true;
        //}
        return false;
    }

    computeScroll():void  {
        if (this.mScroller != null) {
            if (this.mScroller.computeScrollOffset()) {
                this.mScrollX = this.mScroller.getCurrX();
                this.mScrollY = this.mScroller.getCurrY();
                this.invalidateParentCaches();
                // So we draw again
                this.postInvalidate();
            }
        }
    }

    private getInterestingRect(r:Rect, line:number):void  {
        this.convertFromViewportToContentCoordinates(r);
        // TODO Take left/right padding into account too?
        if (line == 0)
            r.top -= this.getExtendedPaddingTop();
        if (line == this.mLayout.getLineCount() - 1)
            r.bottom += this.getExtendedPaddingBottom();
    }

    private convertFromViewportToContentCoordinates(r:Rect):void  {
        const horizontalOffset:number = this.viewportToContentHorizontalOffset();
        r.left += horizontalOffset;
        r.right += horizontalOffset;
        const verticalOffset:number = this.viewportToContentVerticalOffset();
        r.top += verticalOffset;
        r.bottom += verticalOffset;
    }

    viewportToContentHorizontalOffset():number  {
        return this.getCompoundPaddingLeft() - this.mScrollX;
    }

    viewportToContentVerticalOffset():number  {
        let offset:number = this.getExtendedPaddingTop() - this.mScrollY;
        if ((this.mGravity & Gravity.VERTICAL_GRAVITY_MASK) != Gravity.TOP) {
            offset += this.getVerticalOffset(false);
        }
        return offset;
    }

    //debug(depth:number):void  {
    //    super.debug(depth);
    //    let output:string = TextView.debugIndent(depth);
    //    output += "frame={" + this.mLeft + ", " + this.mTop + ", " + this.mRight + ", " + this.mBottom + "} scroll={" + this.mScrollX + ", " + this.mScrollY + "} ";
    //    if (this.mText != null) {
    //        output += "mText=\"" + this.mText + "\" ";
    //        if (this.mLayout != null) {
    //            output += "mLayout width=" + this.mLayout.getWidth() + " height=" + this.mLayout.getHeight();
    //        }
    //    } else {
    //        output += "mText=NULL";
    //    }
    //    Log.d(TextView.VIEW_LOG_TAG, output);
    //}

    /**
     * Convenience for {@link Selection#getSelectionStart}.
     */
    getSelectionStart():number  {
        return -1;
        //return Selection.getSelectionStart(this.getText());
    }

    /**
     * Convenience for {@link Selection#getSelectionEnd}.
     */
    getSelectionEnd():number  {
        return -1;
        //return Selection.getSelectionEnd(this.getText());
    }

    /**
     * Return true iff there is a selection inside this text view.
     */
    hasSelection():boolean  {
        const selectionStart:number = this.getSelectionStart();
        const selectionEnd:number = this.getSelectionEnd();
        return selectionStart >= 0 && selectionStart != selectionEnd;
    }

    ///**
    // * Sets the properties of this field (lines, horizontally scrolling,
    // * transformation method) to be for a single-line input.
    // *
    // * @attr ref android.R.styleable#TextView_singleLine
    // */
    //setSingleLine():void  {
    //    this.setSingleLine(true);
    //}

    /**
     * Sets the properties of this field to transform input to ALL CAPS
     * display. This may use a "small caps" formatting if available.
     * This setting will be ignored if this field is editable or selectable.
     *
     * This call replaces the current transformation method. Disabling this
     * will not necessarily restore the previous behavior from before this
     * was enabled.
     *
     * @see #setTransformationMethod(TransformationMethod)
     * @attr ref android.R.styleable#TextView_textAllCaps
     */
    setAllCaps(allCaps:boolean):void  {
        if (allCaps) {
            this.setTransformationMethod(new AllCapsTransformationMethod());
        } else {
            this.setTransformationMethod(null);
        }
    }

    /**
     * If true, sets the properties of this field (number of lines, horizontally scrolling,
     * transformation method) to be for a single-line input; if false, restores these to the default
     * conditions.
     *
     * Note that the default conditions are not necessarily those that were in effect prior this
     * method, and you may want to reset these properties to your custom values.
     *
     * @attr ref android.R.styleable#TextView_singleLine
     */
    setSingleLine(singleLine = true):void  {
        // Could be used, but may break backward compatibility.
        if (this.mSingleLine == singleLine) return;
        this.setInputTypeSingleLine(singleLine);
        this.applySingleLine(singleLine, true, true);
    }

    /**
     * Adds or remove the EditorInfo.TYPE_TEXT_FLAG_MULTI_LINE on the mInputType.
     * @param singleLine
     */
    private setInputTypeSingleLine(singleLine:boolean):void  {
        //if (this.mEditor != null && (this.mEditor.mInputType & EditorInfo.TYPE_MASK_CLASS) == EditorInfo.TYPE_CLASS_TEXT) {
        //    if (singleLine) {
        //        this.mEditor.mInputType &= ~EditorInfo.TYPE_TEXT_FLAG_MULTI_LINE;
        //    } else {
        //        this.mEditor.mInputType |= EditorInfo.TYPE_TEXT_FLAG_MULTI_LINE;
        //    }
        //}
    }

    private applySingleLine(singleLine:boolean, applyTransformation:boolean, changeMaxLines:boolean):void  {
        this.mSingleLine = singleLine;
        if (singleLine) {
            this.setLines(1);
            this.setHorizontallyScrolling(true);
            if (applyTransformation) {
                this.setTransformationMethod(SingleLineTransformationMethod.getInstance());
            }
        } else {
            if (changeMaxLines) {
                this.setMaxLines(Integer.MAX_VALUE);
            }
            this.setHorizontallyScrolling(false);
            if (applyTransformation) {
                this.setTransformationMethod(null);
            }
        }
    }

    /**
     * Causes words in the text that are longer than the view is wide
     * to be ellipsized instead of broken in the middle.  You may also
     * want to {@link #setSingleLine} or {@link #setHorizontallyScrolling}
     * to constrain the text to a single line.  Use <code>null</code>
     * to turn off ellipsizing.
     *
     * If {@link #setMaxLines} has been used to set two or more lines,
     * {@link android.text.TextUtils.TruncateAt#END} and
     * {@link android.text.TextUtils.TruncateAt#MARQUEE}* are only supported
     * (other ellipsizing types will not do anything).
     *
     * @attr ref android.R.styleable#TextView_ellipsize
     */
    setEllipsize(where:TextUtils.TruncateAt):void  {
        // TruncateAt is an enum. != comparison is ok between these singleton objects.
        if (this.mEllipsize != where) {
            this.mEllipsize = where;
            if (this.mLayout != null) {
                this.nullLayouts();
                this.requestLayout();
                this.invalidate();
            }
        }
    }

    /**
     * Sets how many times to repeat the marquee animation. Only applied if the
     * TextView has marquee enabled. Set to -1 to repeat indefinitely.
     *
     * @see #getMarqueeRepeatLimit()
     *
     * @attr ref android.R.styleable#TextView_marqueeRepeatLimit
     */
    setMarqueeRepeatLimit(marqueeLimit:number):void  {
        this.mMarqueeRepeatLimit = marqueeLimit;
    }

    /**
     * Gets the number of times the marquee animation is repeated. Only meaningful if the
     * TextView has marquee enabled.
     *
     * @return the number of times the marquee animation is repeated. -1 if the animation
     * repeats indefinitely
     *
     * @see #setMarqueeRepeatLimit(int)
     *
     * @attr ref android.R.styleable#TextView_marqueeRepeatLimit
     */
    getMarqueeRepeatLimit():number  {
        return this.mMarqueeRepeatLimit;
    }

    /**
     * Returns where, if anywhere, words that are longer than the view
     * is wide should be ellipsized.
     */
    getEllipsize():TextUtils.TruncateAt  {
        return this.mEllipsize;
    }

    /**
     * Set the TextView so that when it takes focus, all the text is
     * selected.
     *
     * @attr ref android.R.styleable#TextView_selectAllOnFocus
     */
    setSelectAllOnFocus(selectAllOnFocus:boolean):void  {
        this.createEditorIfNeeded();
        this.mEditor.mSelectAllOnFocus = selectAllOnFocus;
        if (selectAllOnFocus && !Spannable.isImpl(this.mText)) {
            this.setText(this.mText, TextView.BufferType.SPANNABLE);
        }
    }

    /**
     * Set whether the cursor is visible. The default is true. Note that this property only
     * makes sense for editable TextView.
     *
     * @see #isCursorVisible()
     *
     * @attr ref android.R.styleable#TextView_cursorVisible
     */
    setCursorVisible(visible:boolean):void  {
        // visible is the default value with no edit data
        //if (visible && this.mEditor == null)
        //    return;
        //this.createEditorIfNeeded();
        //if (this.mEditor.mCursorVisible != visible) {
        //    this.mEditor.mCursorVisible = visible;
        //    this.invalidate();
        //    this.mEditor.makeBlink();
        //    // InsertionPointCursorController depends on mCursorVisible
        //    this.mEditor.prepareCursorControllers();
        //}
    }

    /**
     * @return whether or not the cursor is visible (assuming this TextView is editable)
     *
     * @see #setCursorVisible(boolean)
     *
     * @attr ref android.R.styleable#TextView_cursorVisible
     */
    isCursorVisible():boolean  {
        // true is the default value
        return null;
        //return this.mEditor == null ? true : this.mEditor.mCursorVisible;
    }

    private canMarquee():boolean  {
        let width:number = (this.mRight - this.mLeft - this.getCompoundPaddingLeft() - this.getCompoundPaddingRight());
        return width > 0 && (this.mLayout.getLineWidth(0) > width || (this.mMarqueeFadeMode != TextView.MARQUEE_FADE_NORMAL && this.mSavedMarqueeModeLayout != null && this.mSavedMarqueeModeLayout.getLineWidth(0) > width));
    }

    private startMarquee():void  {
        // Do not ellipsize EditText
        if (this.getKeyListener() != null)
            return;
        if (this.compressText(this.getWidth() - this.getCompoundPaddingLeft() - this.getCompoundPaddingRight())) {
            return;
        }
        if ((this.mMarquee == null || this.mMarquee.isStopped()) && (this.isFocused() || this.isSelected()) && this.getLineCount() == 1 && this.canMarquee()) {
            if (this.mMarqueeFadeMode == TextView.MARQUEE_FADE_SWITCH_SHOW_ELLIPSIS) {
                this.mMarqueeFadeMode = TextView.MARQUEE_FADE_SWITCH_SHOW_FADE;
                const tmp:Layout = this.mLayout;
                this.mLayout = this.mSavedMarqueeModeLayout;
                this.mSavedMarqueeModeLayout = tmp;
                this.setHorizontalFadingEdgeEnabled(true);
                this.requestLayout();
                this.invalidate();
            }
            if (this.mMarquee == null)
                this.mMarquee = new TextView.Marquee(this);
            this.mMarquee.start(this.mMarqueeRepeatLimit);
        }
    }

    private stopMarquee():void  {
        if (this.mMarquee != null && !this.mMarquee.isStopped()) {
            this.mMarquee.stop();
        }
        if (this.mMarqueeFadeMode == TextView.MARQUEE_FADE_SWITCH_SHOW_FADE) {
            this.mMarqueeFadeMode = TextView.MARQUEE_FADE_SWITCH_SHOW_ELLIPSIS;
            const tmp:Layout = this.mSavedMarqueeModeLayout;
            this.mSavedMarqueeModeLayout = this.mLayout;
            this.mLayout = tmp;
            this.setHorizontalFadingEdgeEnabled(false);
            this.requestLayout();
            this.invalidate();
        }
    }

    private startStopMarquee(start:boolean):void  {
        if (this.mEllipsize == TextUtils.TruncateAt.MARQUEE) {
            if (start) {
                this.startMarquee();
            } else {
                this.stopMarquee();
            }
        }
    }

    /**
     * This method is called when the text is changed, in case any subclasses
     * would like to know.
     *
     * Within <code>text</code>, the <code>lengthAfter</code> characters
     * beginning at <code>start</code> have just replaced old text that had
     * length <code>lengthBefore</code>. It is an error to attempt to make
     * changes to <code>text</code> from this callback.
     *
     * @param text The text the TextView is displaying
     * @param start The offset of the start of the range of the text that was
     * modified
     * @param lengthBefore The length of the former text that has been replaced
     * @param lengthAfter The length of the replacement modified text
     */
    protected onTextChanged(text:String, start:number, lengthBefore:number, lengthAfter:number):void  {
    // intentionally empty, template pattern method can be overridden by subclasses
    }

    /**
     * This method is called when the selection has changed, in case any
     * subclasses would like to know.
     *
     * @param selStart The new selection start location.
     * @param selEnd The new selection end location.
     */
    protected onSelectionChanged(selStart:number, selEnd:number):void  {
        //this.sendAccessibilityEvent(AccessibilityEvent.TYPE_VIEW_TEXT_SELECTION_CHANGED);
    }

    /**
     * Adds a TextWatcher to the list of those whose methods are called
     * whenever this TextView's text changes.
     * <p>
     * In 1.0, the {@link TextWatcher#afterTextChanged} method was erroneously
     * not called after {@link #setText} calls.  Now, doing {@link #setText}
     * if there are any text changed listeners forces the buffer type to
     * Editable if it would not otherwise be and does call this method.
     */
    addTextChangedListener(watcher:TextWatcher):void  {
        if (this.mListeners == null) {
            this.mListeners = new ArrayList<TextWatcher>();
        }
        this.mListeners.add(watcher);
    }

    /**
     * Removes the specified TextWatcher from the list of those whose
     * methods are called
     * whenever this TextView's text changes.
     */
    removeTextChangedListener(watcher:TextWatcher):void  {
        if (this.mListeners != null) {
            let i:number = this.mListeners.indexOf(watcher);
            if (i >= 0) {
                this.mListeners.remove(i);
            }
        }
    }

    private sendBeforeTextChanged(text:String, start:number, before:number, after:number):void  {
        if (this.mListeners != null) {
            const list:ArrayList<TextWatcher> = this.mListeners;
            const count:number = list.size();
            for (let i:number = 0; i < count; i++) {
                list.get(i).beforeTextChanged(text, start, before, after);
            }
        }
        // The spans that are inside or intersect the modified region no longer make sense
        //this.removeIntersectingNonAdjacentSpans(start, start + before, SpellCheckSpan.class);
        //this.removeIntersectingNonAdjacentSpans(start, start + before, SuggestionSpan.class);
    }

    // Removes all spans that are inside or actually overlap the start..end range
    //private removeIntersectingNonAdjacentSpans<T> (start:number, end:number, type:Class<T>):void  {
    //    if (!(this.mText instanceof Editable))
    //        return;
    //    let text:Editable = <Editable> this.mText;
    //    let spans:T[] = text.getSpans(start, end, type);
    //    const length:number = spans.length;
    //    for (let i:number = 0; i < length; i++) {
    //        const spanStart:number = text.getSpanStart(spans[i]);
    //        const spanEnd:number = text.getSpanEnd(spans[i]);
    //        if (spanEnd == start || spanStart == end)
    //            break;
    //        text.removeSpan(spans[i]);
    //    }
    //}

    removeAdjacentSuggestionSpans(pos:number):void  {
        //if (!(this.mText instanceof Editable))
        //    return;
        //const text:Editable = <Editable> this.mText;
        //const spans:SuggestionSpan[] = text.getSpans(pos, pos, SuggestionSpan.class);
        //const length:number = spans.length;
        //for (let i:number = 0; i < length; i++) {
        //    const spanStart:number = text.getSpanStart(spans[i]);
        //    const spanEnd:number = text.getSpanEnd(spans[i]);
        //    if (spanEnd == pos || spanStart == pos) {
        //        if (SpellChecker.haveWordBoundariesChanged(text, pos, pos, spanStart, spanEnd)) {
        //            text.removeSpan(spans[i]);
        //        }
        //    }
        //}
    }

    /**
     * Not private so it can be called from an inner class without going
     * through a thunk.
     */
    sendOnTextChanged(text:String, start:number, before:number, after:number):void  {
        if (this.mListeners != null) {
            const list:ArrayList<TextWatcher> = this.mListeners;
            const count:number = list.size();
            for (let i:number = 0; i < count; i++) {
                list.get(i).onTextChanged(text, start, before, after);
            }
        }
        //if (this.mEditor != null)
        //    this.mEditor.sendOnTextChanged(start, after);
    }

    /**
     * Not private so it can be called from an inner class without going
     * through a thunk.
     */
    sendAfterTextChanged(text:any):void  {
        if (this.mListeners != null) {
            const list:ArrayList<TextWatcher> = this.mListeners;
            const count:number = list.size();
            for (let i:number = 0; i < count; i++) {
                list.get(i).afterTextChanged(text+'');
            }
        }
    }

    updateAfterEdit():void  {
        this.invalidate();
        let curs:number = this.getSelectionStart();
        if (curs >= 0 || (this.mGravity & Gravity.VERTICAL_GRAVITY_MASK) == Gravity.BOTTOM) {
            this.registerForPreDraw();
        }
        this.checkForResize();
        if (curs >= 0) {
            this.mHighlightPathBogus = true;
            //if (this.mEditor != null)
            //    this.mEditor.makeBlink();
            this.bringPointIntoView(curs);
        }
    }

    /**
     * Not private so it can be called from an inner class without going
     * through a thunk.
     */
    handleTextChanged(buffer:String, start:number, before:number, after:number):void  {
        //const ims:Editor.InputMethodState = this.mEditor == null ? null : this.mEditor.mInputMethodState;
        //if (ims == null || ims.mBatchEditNesting == 0) {
            this.updateAfterEdit();
        //}
        //if (ims != null) {
        //    ims.mContentChanged = true;
        //    if (ims.mChangedStart < 0) {
        //        ims.mChangedStart = start;
        //        ims.mChangedEnd = start + before;
        //    } else {
        //        ims.mChangedStart = Math.min(ims.mChangedStart, start);
        //        ims.mChangedEnd = Math.max(ims.mChangedEnd, start + before - ims.mChangedDelta);
        //    }
        //    ims.mChangedDelta += after - before;
        //}
        this.sendOnTextChanged(buffer, start, before, after);
        this.onTextChanged(buffer, start, before, after);
    }

    /**
     * Not private so it can be called from an inner class without going
     * through a thunk.
     */
    spanChange(buf:Spanned, what:any, oldStart:number, newStart:number, oldEnd:number, newEnd:number):void  {
        // XXX Make the start and end move together if this ends up
        // spending too much time invalidating.
        let selChanged:boolean = false;
        let newSelStart:number = -1, newSelEnd:number = -1;
        //const ims:Editor.InputMethodState = this.mEditor == null ? null : this.mEditor.mInputMethodState;
        //if (what == Selection.SELECTION_END) {
        //    selChanged = true;
        //    newSelEnd = newStart;
        //    if (oldStart >= 0 || newStart >= 0) {
        //        this.invalidateCursor(Selection.getSelectionStart(buf), oldStart, newStart);
        //        this.checkForResize();
        //        this.registerForPreDraw();
        //        if (this.mEditor != null)
        //            this.mEditor.makeBlink();
        //    }
        //}
        //if (what == Selection.SELECTION_START) {
        //    selChanged = true;
        //    newSelStart = newStart;
        //    if (oldStart >= 0 || newStart >= 0) {
        //        let end:number = Selection.getSelectionEnd(buf);
        //        this.invalidateCursor(end, oldStart, newStart);
        //    }
        //}
        //if (selChanged) {
        //    this.mHighlightPathBogus = true;
        //    if (this.mEditor != null && !this.isFocused())
        //        this.mEditor.mSelectionMoved = true;
        //    if ((buf.getSpanFlags(what) & Spanned.SPAN_INTERMEDIATE) == 0) {
        //        if (newSelStart < 0) {
        //            newSelStart = Selection.getSelectionStart(buf);
        //        }
        //        if (newSelEnd < 0) {
        //            newSelEnd = Selection.getSelectionEnd(buf);
        //        }
        //        this.onSelectionChanged(newSelStart, newSelEnd);
        //    }
        //}
        //if (what instanceof UpdateAppearance || what instanceof ParagraphStyle || what instanceof CharacterStyle) {
            //if (ims == null || ims.mBatchEditNesting == 0) {
                this.invalidate();
                this.mHighlightPathBogus = true;
                this.checkForResize();
            //} else {
            //    ims.mContentChanged = true;
            //}
            //if (this.mEditor != null) {
            //    if (oldStart >= 0)
            //        this.mEditor.invalidateTextDisplayList(this.mLayout, oldStart, oldEnd);
            //    if (newStart >= 0)
            //        this.mEditor.invalidateTextDisplayList(this.mLayout, newStart, newEnd);
            //}
        //}
        //if (MetaKeyKeyListener.isMetaTracker(buf, what)) {
        //    this.mHighlightPathBogus = true;
        //    if (ims != null && MetaKeyKeyListener.isSelectingMetaTracker(buf, what)) {
        //        ims.mSelectionModeChanged = true;
        //    }
        //    if (Selection.getSelectionStart(buf) >= 0) {
        //        if (ims == null || ims.mBatchEditNesting == 0) {
        //            this.invalidateCursor();
        //        } else {
        //            ims.mCursorChanged = true;
        //        }
        //    }
        //}
        //if (what instanceof ParcelableSpan) {
        //    // the current extract editor would be interested in it.
        //    if (ims != null && ims.mExtractedTextRequest != null) {
        //        if (ims.mBatchEditNesting != 0) {
        //            if (oldStart >= 0) {
        //                if (ims.mChangedStart > oldStart) {
        //                    ims.mChangedStart = oldStart;
        //                }
        //                if (ims.mChangedStart > oldEnd) {
        //                    ims.mChangedStart = oldEnd;
        //                }
        //            }
        //            if (newStart >= 0) {
        //                if (ims.mChangedStart > newStart) {
        //                    ims.mChangedStart = newStart;
        //                }
        //                if (ims.mChangedStart > newEnd) {
        //                    ims.mChangedStart = newEnd;
        //                }
        //            }
        //        } else {
        //            if (TextView.DEBUG_EXTRACT)
        //                Log.v(TextView.LOG_TAG, "Span change outside of batch: " + oldStart + "-" + oldEnd + "," + newStart + "-" + newEnd + " " + what);
        //            ims.mContentChanged = true;
        //        }
        //    }
        //}
        //if (this.mEditor != null && this.mEditor.mSpellChecker != null && newStart < 0 && what instanceof SpellCheckSpan) {
        //    this.mEditor.mSpellChecker.onSpellCheckSpanRemoved(<SpellCheckSpan> what);
        //}
    }

    /**
     * @hide
     */
    dispatchFinishTemporaryDetach():void  {
        this.mDispatchTemporaryDetach = true;
        super.dispatchFinishTemporaryDetach();
        this.mDispatchTemporaryDetach = false;
    }

    onStartTemporaryDetach():void  {
        super.onStartTemporaryDetach();
        // usually because this instance is an editable field in a list
        if (!this.mDispatchTemporaryDetach)
            this.mTemporaryDetach = true;
        // selection state as needed.
        //if (this.mEditor != null)
        //    this.mEditor.mTemporaryDetach = true;
    }

    onFinishTemporaryDetach():void  {
        super.onFinishTemporaryDetach();
        // usually because this instance is an editable field in a list
        if (!this.mDispatchTemporaryDetach)
            this.mTemporaryDetach = false;
        //if (this.mEditor != null)
        //    this.mEditor.mTemporaryDetach = false;
    }

    protected onFocusChanged(focused:boolean, direction:number, previouslyFocusedRect:Rect):void  {
        if (this.mTemporaryDetach) {
            // If we are temporarily in the detach state, then do nothing.
            super.onFocusChanged(focused, direction, previouslyFocusedRect);
            return;
        }
        //if (this.mEditor != null)
        //    this.mEditor.onFocusChanged(focused, direction);
        //if (focused) {
        //    if (this.mText instanceof Spannable) {
        //        let sp:Spannable = <Spannable> this.mText;
        //        MetaKeyKeyListener.resetMetaState(sp);
        //    }
        //}
        this.startStopMarquee(focused);
        if (this.mTransformation != null) {
            this.mTransformation.onFocusChanged(this, this.mText, focused, direction, previouslyFocusedRect);
        }
        super.onFocusChanged(focused, direction, previouslyFocusedRect);
    }

    onWindowFocusChanged(hasWindowFocus:boolean):void  {
        super.onWindowFocusChanged(hasWindowFocus);
        //if (this.mEditor != null)
        //    this.mEditor.onWindowFocusChanged(hasWindowFocus);
        this.startStopMarquee(hasWindowFocus);
    }

    protected onVisibilityChanged(changedView:View, visibility:number):void  {
        super.onVisibilityChanged(changedView, visibility);
        //if (this.mEditor != null && visibility != TextView.VISIBLE) {
        //    this.mEditor.hideControllers();
        //}
    }

    /**
     * Use {@link BaseInputConnection#removeComposingSpans
     * BaseInputConnection.removeComposingSpans()} to remove any IME composing
     * state from this text view.
     */
    clearComposingText():void  {
        //if (this.mText instanceof Spannable) {
        //    BaseInputConnection.removeComposingSpans(<Spannable> this.mText);
        //}
    }

    setSelected(selected:boolean):void  {
        let wasSelected:boolean = this.isSelected();
        super.setSelected(selected);
        if (selected != wasSelected && this.mEllipsize == TextUtils.TruncateAt.MARQUEE) {
            if (selected) {
                this.startMarquee();
            } else {
                this.stopMarquee();
            }
        }
    }

    onTouchEvent(event:MotionEvent):boolean  {
        const action:number = event.getActionMasked();
        //if (this.mEditor != null)
        //    this.mEditor.onTouchEvent(event);
        const superResult:boolean = super.onTouchEvent(event);
        /*
         * Don't handle the release after a long press, because it will
         * move the selection away from whatever the menu action was
         * trying to affect.
         */
        //if (this.mEditor != null && this.mEditor.mDiscardNextActionUp && action == MotionEvent.ACTION_UP) {
        //    this.mEditor.mDiscardNextActionUp = false;
        //    return superResult;
        //}
        const touchIsFinished:boolean = (action == MotionEvent.ACTION_UP)
            //&& (this.mEditor == null || !this.mEditor.mIgnoreActionUpEvent)
            && this.isFocused();
        if ((this.mMovement != null || this.onCheckIsTextEditor()) && this.isEnabled() && Spannable.isImpl(this.mText) && this.mLayout != null) {
            let handled:boolean = false;
            if (this.mMovement != null) {
                handled = this.mMovement.onTouchEvent(this, <Spannable> this.mText, event) || handled;
            }
            //const textIsSelectable:boolean = this.isTextSelectable();
            //if (touchIsFinished && this.mLinksClickable && this.mAutoLinkMask != 0 && textIsSelectable) {
            //    // The LinkMovementMethod which should handle taps on links has not been installed
            //    // on non editable text that support text selection.
            //    // We reproduce its behavior here to open links for these.
            //    let links:ClickableSpan[] = (<Spannable> this.mText).getSpans(this.getSelectionStart(), this.getSelectionEnd(), ClickableSpan.class);
            //    if (links.length > 0) {
            //        links[0].onClick(this);
            //        handled = true;
            //    }
            //}
            //if (touchIsFinished && (this.isTextEditable() || textIsSelectable)) {
            //    // Show the IME, except when selecting in read-only text.
            //    const imm:InputMethodManager = InputMethodManager.peekInstance();
            //    this.viewClicked(imm);
            //    if (!textIsSelectable && this.mEditor.mShowSoftInputOnFocus) {
            //        handled |= imm != null && imm.showSoftInput(this, 0);
            //    }
            //    // The above condition ensures that the mEditor is not null
            //    this.mEditor.onTouchUpEvent(event);
            //    handled = true;
            //}
            if (handled) {
                return true;
            }
        }
        return superResult;
    }

    onGenericMotionEvent(event:MotionEvent):boolean  {
        if (this.mMovement != null && Spannable.isImpl(this.mText) && this.mLayout != null) {
            try {
                if (this.mMovement.onGenericMotionEvent(this, <Spannable> this.mText, event)) {
                    return true;
                }
            } catch (e){
            }
        }
        return super.onGenericMotionEvent(event);
    }

    /**
     * @return True iff this TextView contains a text that can be edited, or if this is
     * a selectable TextView.
     */
    isTextEditable():boolean  {
        return false;
        //return this.mText instanceof Editable && this.onCheckIsTextEditor() && this.isEnabled();
    }

    /**
     * Returns true, only while processing a touch gesture, if the initial
     * touch down event caused focus to move to the text view and as a result
     * its selection changed.  Only valid while processing the touch gesture
     * of interest, in an editable text view.
     */
    didTouchFocusSelect():boolean  {
        return false;
        //return this.mEditor != null && this.mEditor.mTouchFocusSelected;
    }

    cancelLongPress():void  {
        super.cancelLongPress();
        //if (this.mEditor != null)
        //    this.mEditor.mIgnoreActionUpEvent = true;
    }

    //onTrackballEvent(event:MotionEvent):boolean  {
    //    if (this.mMovement != null && Spannable.isImpl(this.mText) && this.mLayout != null) {
    //        if (this.mMovement.onTrackballEvent(this, <Spannable> this.mText, event)) {
    //            return true;
    //        }
    //    }
    //    return super.onTrackballEvent(event);
    //}

    setScroller(s:OverScroller):void  {
        this.mScroller = s;
    }

    protected getLeftFadingEdgeStrength():number  {
        if (this.mEllipsize == TextUtils.TruncateAt.MARQUEE && this.mMarqueeFadeMode != TextView.MARQUEE_FADE_SWITCH_SHOW_ELLIPSIS) {
            if (this.mMarquee != null && !this.mMarquee.isStopped()) {
                const marquee:TextView.Marquee = this.mMarquee;
                if (marquee.shouldDrawLeftFade()) {
                    const scroll:number = marquee.getScroll();
                    return scroll / this.getHorizontalFadingEdgeLength();
                } else {
                    return 0.0;
                }
            } else if (this.getLineCount() == 1) {
                //const layoutDirection:number = this.getLayoutDirection();
                const absoluteGravity:number = this.mGravity;//Gravity.getAbsoluteGravity(this.mGravity, layoutDirection);
                switch(absoluteGravity & Gravity.HORIZONTAL_GRAVITY_MASK) {
                    case Gravity.LEFT:
                        return 0.0;
                    case Gravity.RIGHT:
                        return (this.mLayout.getLineRight(0) - (this.mRight - this.mLeft) - this.getCompoundPaddingLeft() - this.getCompoundPaddingRight() - this.mLayout.getLineLeft(0)) / this.getHorizontalFadingEdgeLength();
                    case Gravity.CENTER_HORIZONTAL:
                    case Gravity.FILL_HORIZONTAL:
                        const textDirection:number = this.mLayout.getParagraphDirection(0);
                        if (textDirection == Layout.DIR_LEFT_TO_RIGHT) {
                            return 0.0;
                        } else {
                            return (this.mLayout.getLineRight(0) - (this.mRight - this.mLeft) - this.getCompoundPaddingLeft() - this.getCompoundPaddingRight() - this.mLayout.getLineLeft(0)) / this.getHorizontalFadingEdgeLength();
                        }
                }
            }
        }
        return super.getLeftFadingEdgeStrength();
    }

    protected getRightFadingEdgeStrength():number  {
        if (this.mEllipsize == TextUtils.TruncateAt.MARQUEE && this.mMarqueeFadeMode != TextView.MARQUEE_FADE_SWITCH_SHOW_ELLIPSIS) {
            if (this.mMarquee != null && !this.mMarquee.isStopped()) {
                const marquee:TextView.Marquee = this.mMarquee;
                const maxFadeScroll:number = marquee.getMaxFadeScroll();
                const scroll:number = marquee.getScroll();
                return (maxFadeScroll - scroll) / this.getHorizontalFadingEdgeLength();
            } else if (this.getLineCount() == 1) {
                //const layoutDirection:number = this.getLayoutDirection();
                const absoluteGravity:number = this.mGravity;//Gravity.getAbsoluteGravity(this.mGravity, layoutDirection);
                switch(absoluteGravity & Gravity.HORIZONTAL_GRAVITY_MASK) {
                    case Gravity.LEFT:
                        const textWidth:number = (this.mRight - this.mLeft) - this.getCompoundPaddingLeft() - this.getCompoundPaddingRight();
                        const lineWidth:number = this.mLayout.getLineWidth(0);
                        return (lineWidth - textWidth) / this.getHorizontalFadingEdgeLength();
                    case Gravity.RIGHT:
                        return 0.0;
                    case Gravity.CENTER_HORIZONTAL:
                    case Gravity.FILL_HORIZONTAL:
                        const textDirection:number = this.mLayout.getParagraphDirection(0);
                        if (textDirection == Layout.DIR_RIGHT_TO_LEFT) {
                            return 0.0;
                        } else {
                            return (this.mLayout.getLineWidth(0) - ((this.mRight - this.mLeft) - this.getCompoundPaddingLeft() - this.getCompoundPaddingRight())) / this.getHorizontalFadingEdgeLength();
                        }
                }
            }
        }
        return super.getRightFadingEdgeStrength();
    }

    protected computeHorizontalScrollRange():number  {
        if (this.mLayout != null) {
            return this.mSingleLine && (this.mGravity & Gravity.HORIZONTAL_GRAVITY_MASK) == Gravity.LEFT ? Math.floor(this.mLayout.getLineWidth(0)) : this.mLayout.getWidth();
        }
        return super.computeHorizontalScrollRange();
    }

    protected computeVerticalScrollRange():number  {
        if (this.mLayout != null)
            return this.mLayout.getHeight();
        return super.computeVerticalScrollRange();
    }

    protected computeVerticalScrollExtent():number  {
        return this.getHeight() - this.getCompoundPaddingTop() - this.getCompoundPaddingBottom();
    }

    //findViewsWithText(outViews:ArrayList<View>, searched:String, flags:number):void  {
    //    super.findViewsWithText(outViews, searched, flags);
    //    if (!outViews.contains(this) && (flags & TextView.FIND_VIEWS_WITH_TEXT) != 0 && !TextUtils.isEmpty(searched) && !TextUtils.isEmpty(this.mText)) {
    //        let searchedLowerCase:string = searched.toString().toLowerCase();
    //        let textLowerCase:string = this.mText.toString().toLowerCase();
    //        if (textLowerCase.contains(searchedLowerCase)) {
    //            outViews.add(this);
    //        }
    //    }
    //}



    /**
     * Returns the TextView_textColor attribute from the
     * TypedArray, if set, or the TextAppearance_textColor
     * from the TextView_textAppearance attribute, if TextView_textColor
     * was not set directly.
     */
    static getTextColors():ColorStateList  {
        return android.R.attr.textViewStyle.textColor;
    }

    /**
     * Returns the default color from the TextView_textColor attribute
     * from the AttributeSet, if set, or the default color from the
     * TextAppearance_textColor from the TextView_textAppearance attribute,
     * if TextView_textColor was not set directly.
     */
    static getTextColor(def:number):number  {
        let colors:ColorStateList = this.getTextColors();
        if (colors == null) {
            return def;
        } else {
            return colors.getDefaultColor();
        }
    }

    //onKeyShortcut(keyCode:number, event:KeyEvent):boolean  {
    //    const filteredMetaState:number = event.getMetaState() & ~KeyEvent.META_CTRL_MASK;
    //    if (KeyEvent.metaStateHasNoModifiers(filteredMetaState)) {
    //        switch(keyCode) {
    //            case KeyEvent.KEYCODE_A:
    //                if (this.canSelectText()) {
    //                    return this.onTextContextMenuItem(TextView.ID_SELECT_ALL);
    //                }
    //                break;
    //            case KeyEvent.KEYCODE_X:
    //                if (this.canCut()) {
    //                    return this.onTextContextMenuItem(TextView.ID_CUT);
    //                }
    //                break;
    //            case KeyEvent.KEYCODE_C:
    //                if (this.canCopy()) {
    //                    return this.onTextContextMenuItem(TextView.ID_COPY);
    //                }
    //                break;
    //            case KeyEvent.KEYCODE_V:
    //                if (this.canPaste()) {
    //                    return this.onTextContextMenuItem(TextView.ID_PASTE);
    //                }
    //                break;
    //        }
    //    }
    //    return super.onKeyShortcut(keyCode, event);
    //}

    /**
     * Unlike {@link #textCanBeSelected()}, this method is based on the <i>current</i> state of the
     * TextView. {@link #textCanBeSelected()} has to be true (this is one of the conditions to have
     * a selection controller (see {@link Editor#prepareCursorControllers()}), but this is not
     * sufficient.
     */
    private canSelectText():boolean  {
        return false;
        //return this.mText.length() != 0 && this.mEditor != null && this.mEditor.hasSelectionController();
    }

    /**
     * Test based on the <i>intrinsic</i> charateristics of the TextView.
     * The text must be spannable and the movement method must allow for arbitary selection.
     *
     * See also {@link #canSelectText()}.
     */
    textCanBeSelected():boolean  {
        return false;
        //// the value of this condition might be changed.
        //if (this.mMovement == null || !this.mMovement.canSelectArbitrarily())
        //    return false;
        //return this.isTextEditable() || (this.isTextSelectable() && this.mText instanceof Spannable && this.isEnabled());
    }

    //private getTextServicesLocale(allowNullLocale:boolean):Locale  {
    //    // Start fetching the text services locale asynchronously.
    //    this.updateTextServicesLocaleAsync();
    //    // locale.
    //    return (this.mCurrentSpellCheckerLocaleCache == null && !allowNullLocale) ? Locale.getDefault() : this.mCurrentSpellCheckerLocaleCache;
    //}
    //
    ///**
    // * This is a temporary method. Future versions may support multi-locale text.
    // * Caveat: This method may not return the latest text services locale, but this should be
    // * acceptable and it's more important to make this method asynchronous.
    // *
    // * @return The locale that should be used for a word iterator
    // * in this TextView, based on the current spell checker settings,
    // * the current IME's locale, or the system default locale.
    // * Please note that a word iterator in this TextView is different from another word iterator
    // * used by SpellChecker.java of TextView. This method should be used for the former.
    // * @hide
    // */
    //// TODO: Support multi-locale
    //// TODO: Update the text services locale immediately after the keyboard locale is switched
    //// by catching intent of keyboard switch event
    //getTextServicesLocale():Locale  {
    //    return this.getTextServicesLocale(false);
    //}
    //
    ///**
    // * This is a temporary method. Future versions may support multi-locale text.
    // * Caveat: This method may not return the latest spell checker locale, but this should be
    // * acceptable and it's more important to make this method asynchronous.
    // *
    // * @return The locale that should be used for a spell checker in this TextView,
    // * based on the current spell checker settings, the current IME's locale, or the system default
    // * locale.
    // * @hide
    // */
    //getSpellCheckerLocale():Locale  {
    //    return this.getTextServicesLocale(true);
    //}
    //
    //private updateTextServicesLocaleAsync():void  {
    //    // AsyncTask.execute() uses a serial executor which means we don't have
    //    // to lock around updateTextServicesLocaleLocked() to prevent it from
    //    // being executed n times in parallel.
    //    AsyncTask.execute((()=>{
    //        const _this=this;
    //        class _Inner extends Runnable {
    //
    //            run():void  {
    //                _this.updateTextServicesLocaleLocked();
    //            }
    //        }
    //        return new _Inner();
    //    })());
    //}
    //
    //private updateTextServicesLocaleLocked():void  {
    //    const textServicesManager:TextServicesManager = <TextServicesManager> this.mContext.getSystemService(Context.TEXT_SERVICES_MANAGER_SERVICE);
    //    const subtype:SpellCheckerSubtype = textServicesManager.getCurrentSpellCheckerSubtype(true);
    //    let locale:Locale;
    //    if (subtype != null) {
    //        locale = SpellCheckerSubtype.constructLocaleFromString(subtype.getLocale());
    //    } else {
    //        locale = null;
    //    }
    //    this.mCurrentSpellCheckerLocaleCache = locale;
    //}

    //onLocaleChanged():void  {
    //    // Will be re-created on demand in getWordIterator with the proper new locale
    //    this.mEditor.mWordIterator = null;
    //}
    //
    ///**
    // * This method is used by the ArrowKeyMovementMethod to jump from one word to the other.
    // * Made available to achieve a consistent behavior.
    // * @hide
    // */
    //getWordIterator():WordIterator  {
    //    if (this.mEditor != null) {
    //        return this.mEditor.getWordIterator();
    //    } else {
    //        return null;
    //    }
    //}
    //
    //onPopulateAccessibilityEvent(event:AccessibilityEvent):void  {
    //    super.onPopulateAccessibilityEvent(event);
    //    const isPassword:boolean = this.hasPasswordTransformationMethod();
    //    if (!isPassword || this.shouldSpeakPasswordsForAccessibility()) {
    //        const text:CharSequence = this.getTextForAccessibility();
    //        if (!TextUtils.isEmpty(text)) {
    //            event.getText().add(text);
    //        }
    //    }
    //}
    //
    ///**
    // * @return true if the user has explicitly allowed accessibility services
    // * to speak passwords.
    // */
    //private shouldSpeakPasswordsForAccessibility():boolean  {
    //    return (Settings.Secure.getInt(this.mContext.getContentResolver(), Settings.Secure.ACCESSIBILITY_SPEAK_PASSWORD, 0) == 1);
    //}
    //
    //onInitializeAccessibilityEvent(event:AccessibilityEvent):void  {
    //    super.onInitializeAccessibilityEvent(event);
    //    event.setClassName(TextView.class.getName());
    //    const isPassword:boolean = this.hasPasswordTransformationMethod();
    //    event.setPassword(isPassword);
    //    if (event.getEventType() == AccessibilityEvent.TYPE_VIEW_TEXT_SELECTION_CHANGED) {
    //        event.setFromIndex(Selection.getSelectionStart(this.mText));
    //        event.setToIndex(Selection.getSelectionEnd(this.mText));
    //        event.setItemCount(this.mText.length());
    //    }
    //}
    //
    //onInitializeAccessibilityNodeInfo(info:AccessibilityNodeInfo):void  {
    //    super.onInitializeAccessibilityNodeInfo(info);
    //    info.setClassName(TextView.class.getName());
    //    const isPassword:boolean = this.hasPasswordTransformationMethod();
    //    info.setPassword(isPassword);
    //    if (!isPassword) {
    //        info.setText(this.getTextForAccessibility());
    //    }
    //    if (this.mBufferType == TextView.BufferType.EDITABLE) {
    //        info.setEditable(true);
    //    }
    //    if (this.mEditor != null) {
    //        info.setInputType(this.mEditor.mInputType);
    //        if (this.mEditor.mError != null) {
    //            info.setContentInvalid(true);
    //        }
    //    }
    //    if (!TextUtils.isEmpty(this.mText)) {
    //        info.addAction(AccessibilityNodeInfo.ACTION_NEXT_AT_MOVEMENT_GRANULARITY);
    //        info.addAction(AccessibilityNodeInfo.ACTION_PREVIOUS_AT_MOVEMENT_GRANULARITY);
    //        info.setMovementGranularities(AccessibilityNodeInfo.MOVEMENT_GRANULARITY_CHARACTER | AccessibilityNodeInfo.MOVEMENT_GRANULARITY_WORD | AccessibilityNodeInfo.MOVEMENT_GRANULARITY_LINE | AccessibilityNodeInfo.MOVEMENT_GRANULARITY_PARAGRAPH | AccessibilityNodeInfo.MOVEMENT_GRANULARITY_PAGE);
    //    }
    //    if (this.isFocused()) {
    //        if (this.canSelectText()) {
    //            info.addAction(AccessibilityNodeInfo.ACTION_SET_SELECTION);
    //        }
    //        if (this.canCopy()) {
    //            info.addAction(AccessibilityNodeInfo.ACTION_COPY);
    //        }
    //        if (this.canPaste()) {
    //            info.addAction(AccessibilityNodeInfo.ACTION_PASTE);
    //        }
    //        if (this.canCut()) {
    //            info.addAction(AccessibilityNodeInfo.ACTION_CUT);
    //        }
    //    }
    //    if (!this.isSingleLine()) {
    //        info.setMultiLine(true);
    //    }
    //}

    //performAccessibilityAction(action:number, arguments:Bundle):boolean  {
    //    switch(action) {
    //        case AccessibilityNodeInfo.ACTION_COPY:
    //            {
    //                if (this.isFocused() && this.canCopy()) {
    //                    if (this.onTextContextMenuItem(TextView.ID_COPY)) {
    //                        return true;
    //                    }
    //                }
    //            }
    //            return false;
    //        case AccessibilityNodeInfo.ACTION_PASTE:
    //            {
    //                if (this.isFocused() && this.canPaste()) {
    //                    if (this.onTextContextMenuItem(TextView.ID_PASTE)) {
    //                        return true;
    //                    }
    //                }
    //            }
    //            return false;
    //        case AccessibilityNodeInfo.ACTION_CUT:
    //            {
    //                if (this.isFocused() && this.canCut()) {
    //                    if (this.onTextContextMenuItem(TextView.ID_CUT)) {
    //                        return true;
    //                    }
    //                }
    //            }
    //            return false;
    //        case AccessibilityNodeInfo.ACTION_SET_SELECTION:
    //            {
    //                if (this.isFocused() && this.canSelectText()) {
    //                    let text:CharSequence = this.getIterableTextForAccessibility();
    //                    if (text == null) {
    //                        return false;
    //                    }
    //                    const start:number = (arguments != null) ? arguments.getInt(AccessibilityNodeInfo.ACTION_ARGUMENT_SELECTION_START_INT, -1) : -1;
    //                    const end:number = (arguments != null) ? arguments.getInt(AccessibilityNodeInfo.ACTION_ARGUMENT_SELECTION_END_INT, -1) : -1;
    //                    if ((this.getSelectionStart() != start || this.getSelectionEnd() != end)) {
    //                        // No arguments clears the selection.
    //                        if (start == end && end == -1) {
    //                            Selection.removeSelection(<Spannable> text);
    //                            return true;
    //                        }
    //                        if (start >= 0 && start <= end && end <= text.length()) {
    //                            Selection.setSelection(<Spannable> text, start, end);
    //                            // Make sure selection mode is engaged.
    //                            if (this.mEditor != null) {
    //                                this.mEditor.startSelectionActionMode();
    //                            }
    //                            return true;
    //                        }
    //                    }
    //                }
    //            }
    //            return false;
    //        default:
    //            {
    //                return super.performAccessibilityAction(action, arguments);
    //            }
    //    }
    //}
    //
    //sendAccessibilityEvent(eventType:number):void  {
    //    // For details see the implementation of bringTextIntoView().
    //    if (eventType == AccessibilityEvent.TYPE_VIEW_SCROLLED) {
    //        return;
    //    }
    //    super.sendAccessibilityEvent(eventType);
    //}
    //
    ///**
    // * Gets the text reported for accessibility purposes.
    // *
    // * @return The accessibility text.
    // *
    // * @hide
    // */
    //getTextForAccessibility():CharSequence  {
    //    let text:CharSequence = this.getText();
    //    if (TextUtils.isEmpty(text)) {
    //        text = this.getHint();
    //    }
    //    return text;
    //}
    //
    //sendAccessibilityEventTypeViewTextChanged(beforeText:CharSequence, fromIndex:number, removedCount:number, addedCount:number):void  {
    //    let event:AccessibilityEvent = AccessibilityEvent.obtain(AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED);
    //    event.setFromIndex(fromIndex);
    //    event.setRemovedCount(removedCount);
    //    event.setAddedCount(addedCount);
    //    event.setBeforeText(beforeText);
    //    this.sendAccessibilityEventUnchecked(event);
    //}
    //
    ///**
    // * Returns whether this text view is a current input method target.  The
    // * default implementation just checks with {@link InputMethodManager}.
    // */
    //isInputMethodTarget():boolean  {
    //    let imm:InputMethodManager = InputMethodManager.peekInstance();
    //    return imm != null && imm.isActive(this);
    //}
    //
    //static ID_SELECT_ALL:number = android.R.id.selectAll;
    //
    //static ID_CUT:number = android.R.id.cut;
    //
    //static ID_COPY:number = android.R.id.copy;
    //
    //static ID_PASTE:number = android.R.id.paste;
    //
    ///**
    // * Called when a context menu option for the text view is selected.  Currently
    // * this will be one of {@link android.R.id#selectAll}, {@link android.R.id#cut},
    // * {@link android.R.id#copy} or {@link android.R.id#paste}.
    // *
    // * @return true if the context menu item action was performed.
    // */
    //onTextContextMenuItem(id:number):boolean  {
    //    let min:number = 0;
    //    let max:number = this.mText.length();
    //    if (this.isFocused()) {
    //        const selStart:number = this.getSelectionStart();
    //        const selEnd:number = this.getSelectionEnd();
    //        min = Math.max(0, Math.min(selStart, selEnd));
    //        max = Math.max(0, Math.max(selStart, selEnd));
    //    }
    //    switch(id) {
    //        case TextView.ID_SELECT_ALL:
    //            // This does not enter text selection mode. Text is highlighted, so that it can be
    //            // bulk edited, like selectAllOnFocus does. Returns true even if text is empty.
    //            this.selectAllText();
    //            return true;
    //        case TextView.ID_PASTE:
    //            this.paste(min, max);
    //            return true;
    //        case TextView.ID_CUT:
    //            this.setPrimaryClip(ClipData.newPlainText(null, this.getTransformedText(min, max)));
    //            this.deleteText_internal(min, max);
    //            this.stopSelectionActionMode();
    //            return true;
    //        case TextView.ID_COPY:
    //            this.setPrimaryClip(ClipData.newPlainText(null, this.getTransformedText(min, max)));
    //            this.stopSelectionActionMode();
    //            return true;
    //    }
    //    return false;
    //}

    getTransformedText(start:number, end:number):String  {
        return this.removeSuggestionSpans(this.mTransformed.substring(start, end));
    }

    performLongClick():boolean  {
        let handled:boolean = false;
        if (super.performLongClick()) {
            handled = true;
        }
        //if (this.mEditor != null) {
        //    handled |= this.mEditor.performLongClick(handled);
        //}
        if (handled) {
            this.performHapticFeedback(HapticFeedbackConstants.LONG_PRESS);
            //if (this.mEditor != null)
            //    this.mEditor.mDiscardNextActionUp = true;
        }
        return handled;
    }

    //protected onScrollChanged(horiz:number, vert:number, oldHoriz:number, oldVert:number):void  {
    //    super.onScrollChanged(horiz, vert, oldHoriz, oldVert);
    //    if (this.mEditor != null) {
    //        this.mEditor.onScrollChanged();
    //    }
    //}

    /**
     * Return whether or not suggestions are enabled on this TextView. The suggestions are generated
     * by the IME or by the spell checker as the user types. This is done by adding
     * {@link SuggestionSpan}s to the text.
     *
     * When suggestions are enabled (default), this list of suggestions will be displayed when the
     * user asks for them on these parts of the text. This value depends on the inputType of this
     * TextView.
     *
     * The class of the input type must be {@link InputType#TYPE_CLASS_TEXT}.
     *
     * In addition, the type variation must be one of
     * {@link InputType#TYPE_TEXT_VARIATION_NORMAL},
     * {@link InputType#TYPE_TEXT_VARIATION_EMAIL_SUBJECT},
     * {@link InputType#TYPE_TEXT_VARIATION_LONG_MESSAGE},
     * {@link InputType#TYPE_TEXT_VARIATION_SHORT_MESSAGE} or
     * {@link InputType#TYPE_TEXT_VARIATION_WEB_EDIT_TEXT}.
     *
     * And finally, the {@link InputType#TYPE_TEXT_FLAG_NO_SUGGESTIONS} flag must <i>not</i> be set.
     *
     * @return true if the suggestions popup window is enabled, based on the inputType.
     */
    isSuggestionsEnabled():boolean  {
        return false;
        //if (this.mEditor == null)
        //    return false;
        //if ((this.mEditor.mInputType & InputType.TYPE_MASK_CLASS) != InputType.TYPE_CLASS_TEXT) {
        //    return false;
        //}
        //if ((this.mEditor.mInputType & InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS) > 0)
        //    return false;
        //const variation:number = this.mEditor.mInputType & EditorInfo.TYPE_MASK_VARIATION;
        //return (variation == EditorInfo.TYPE_TEXT_VARIATION_NORMAL || variation == EditorInfo.TYPE_TEXT_VARIATION_EMAIL_SUBJECT || variation == EditorInfo.TYPE_TEXT_VARIATION_LONG_MESSAGE || variation == EditorInfo.TYPE_TEXT_VARIATION_SHORT_MESSAGE || variation == EditorInfo.TYPE_TEXT_VARIATION_WEB_EDIT_TEXT);
    }

    /**
     * If provided, this ActionMode.Callback will be used to create the ActionMode when text
     * selection is initiated in this View.
     *
     * The standard implementation populates the menu with a subset of Select All, Cut, Copy and
     * Paste actions, depending on what this View supports.
     *
     * A custom implementation can add new entries in the default menu in its
     * {@link android.view.ActionMode.Callback#onPrepareActionMode(ActionMode, Menu)} method. The
     * default actions can also be removed from the menu using {@link Menu#removeItem(int)} and
     * passing {@link android.R.id#selectAll}, {@link android.R.id#cut}, {@link android.R.id#copy}
     * or {@link android.R.id#paste} ids as parameters.
     *
     * Returning false from
     * {@link android.view.ActionMode.Callback#onCreateActionMode(ActionMode, Menu)} will prevent
     * the action mode from being started.
     *
     * Action click events should be handled by the custom implementation of
     * {@link android.view.ActionMode.Callback#onActionItemClicked(ActionMode, MenuItem)}.
     *
     * Note that text selection mode is not started when a TextView receives focus and the
     * {@link android.R.attr#selectAllOnFocus} flag has been set. The content is highlighted in
     * that case, to allow for quick replacement.
     */
    setCustomSelectionActionModeCallback(actionModeCallback:any):void  {
        this.createEditorIfNeeded();
        //this.mEditor.mCustomSelectionActionModeCallback = actionModeCallback;
    }

    /**
     * Retrieves the value set in {@link #setCustomSelectionActionModeCallback}. Default is null.
     *
     * @return The current custom selection callback.
     */
    getCustomSelectionActionModeCallback():any  {
        return null;
        //return this.mEditor == null ? null : this.mEditor.mCustomSelectionActionModeCallback;
    }

    /**
     * @hide
     */
    protected stopSelectionActionMode():void  {
        //this.mEditor.stopSelectionActionMode();
    }

    canCut():boolean  {
        //if (this.hasPasswordTransformationMethod()) {
        //    return false;
        //}
        //if (this.mText.length() > 0 && this.hasSelection() && this.mText instanceof Editable && this.mEditor != null && this.mEditor.mKeyListener != null) {
        //    return true;
        //}
        return false;
    }

    canCopy():boolean  {
        return true;
        //if (this.hasPasswordTransformationMethod()) {
        //    return false;
        //}
        //if (this.mText.length() > 0 && this.hasSelection()) {
        //    return true;
        //}
        //return false;
    }

    canPaste():boolean  {
        return false;
        //return (this.mText instanceof Editable && this.mEditor != null && this.mEditor.mKeyListener != null
        //&& this.getSelectionStart() >= 0 && this.getSelectionEnd() >= 0
        //&& (<ClipboardManager> this.getContext().getSystemService(Context.CLIPBOARD_SERVICE)).hasPrimaryClip());
    }

    selectAllText():boolean  {
        return false;
        //const length:number = this.mText.length();
        //Selection.setSelection(<Spannable> this.mText, 0, length);
        //return length > 0;
    }

    ///**
    // * Prepare text so that there are not zero or two spaces at beginning and end of region defined
    // * by [min, max] when replacing this region by paste.
    // * Note that if there were two spaces (or more) at that position before, they are kept. We just
    // * make sure we do not add an extra one from the paste content.
    // */
    //prepareSpacesAroundPaste(min:number, max:number, paste:String):number  {
    //    if (paste.length() > 0) {
    //        if (min > 0) {
    //            const charBefore:string = this.mTransformed.charAt(min - 1);
    //            const charAfter:string = paste.charAt(0);
    //            if (Character.isSpaceChar(charBefore) && Character.isSpaceChar(charAfter)) {
    //                // Two spaces at beginning of paste: remove one
    //                const originalLength:number = this.mText.length();
    //                this.deleteText_internal(min - 1, min);
    //                // Due to filters, there is no guarantee that exactly one character was
    //                // removed: count instead.
    //                const delta:number = this.mText.length() - originalLength;
    //                min += delta;
    //                max += delta;
    //            } else if (!Character.isSpaceChar(charBefore) && charBefore != '\n' && !Character.isSpaceChar(charAfter) && charAfter != '\n') {
    //                // No space at beginning of paste: add one
    //                const originalLength:number = this.mText.length();
    //                this.replaceText_internal(min, min, " ");
    //                // Taking possible filters into account as above.
    //                const delta:number = this.mText.length() - originalLength;
    //                min += delta;
    //                max += delta;
    //            }
    //        }
    //        if (max < this.mText.length()) {
    //            const charBefore:string = paste.charAt(paste.length() - 1);
    //            const charAfter:string = this.mTransformed.charAt(max);
    //            if (Character.isSpaceChar(charBefore) && Character.isSpaceChar(charAfter)) {
    //                // Two spaces at end of paste: remove one
    //                this.deleteText_internal(max, max + 1);
    //            } else if (!Character.isSpaceChar(charBefore) && charBefore != '\n' && !Character.isSpaceChar(charAfter) && charAfter != '\n') {
    //                // No space at end of paste: add one
    //                this.replaceText_internal(max, max, " ");
    //            }
    //        }
    //    }
    //    return TextUtils.packRangeInLong(min, max);
    //}
    //
    ///**
    // * Paste clipboard content between min and max positions.
    // */
    //private paste(min:number, max:number):void  {
    //    let clipboard:ClipboardManager = <ClipboardManager> this.getContext().getSystemService(Context.CLIPBOARD_SERVICE);
    //    let clip:ClipData = clipboard.getPrimaryClip();
    //    if (clip != null) {
    //        let didFirst:boolean = false;
    //        for (let i:number = 0; i < clip.getItemCount(); i++) {
    //            let paste:CharSequence = clip.getItemAt(i).coerceToStyledText(this.getContext());
    //            if (paste != null) {
    //                if (!didFirst) {
    //                    let minMax:number = this.prepareSpacesAroundPaste(min, max, paste);
    //                    min = TextUtils.unpackRangeStartFromLong(minMax);
    //                    max = TextUtils.unpackRangeEndFromLong(minMax);
    //                    Selection.setSelection(<Spannable> this.mText, max);
    //                    (<Editable> this.mText).replace(min, max, paste);
    //                    didFirst = true;
    //                } else {
    //                    (<Editable> this.mText).insert(this.getSelectionEnd(), "\n");
    //                    (<Editable> this.mText).insert(this.getSelectionEnd(), paste);
    //                }
    //            }
    //        }
    //        this.stopSelectionActionMode();
    //        TextView.LAST_CUT_OR_COPY_TIME = 0;
    //    }
    //}

    //private setPrimaryClip(clip:ClipData):void  {
    //    let clipboard:ClipboardManager = <ClipboardManager> this.getContext().getSystemService(Context.CLIPBOARD_SERVICE);
    //    clipboard.setPrimaryClip(clip);
    //    TextView.LAST_CUT_OR_COPY_TIME = SystemClock.uptimeMillis();
    //}

    /**
     * Get the character offset closest to the specified absolute position. A typical use case is to
     * pass the result of {@link MotionEvent#getX()} and {@link MotionEvent#getY()} to this method.
     *
     * @param x The horizontal absolute position of a point on screen
     * @param y The vertical absolute position of a point on screen
     * @return the character offset for the character whose position is closest to the specified
     *  position. Returns -1 if there is no layout.
     */
    getOffsetForPosition(x:number, y:number):number  {
        if (this.getLayout() == null)
            return -1;
        const line:number = this.getLineAtCoordinate(y);
        const offset:number = this.getOffsetAtCoordinate(line, x);
        return offset;
    }

    convertToLocalHorizontalCoordinate(x:number):number  {
        x -= this.getTotalPaddingLeft();
        // Clamp the position to inside of the view.
        x = Math.max(0.0, x);
        x = Math.min(this.getWidth() - this.getTotalPaddingRight() - 1, x);
        x += this.getScrollX();
        return x;
    }

    getLineAtCoordinate(y:number):number  {
        y -= this.getTotalPaddingTop();
        // Clamp the position to inside of the view.
        y = Math.max(0.0, y);
        y = Math.min(this.getHeight() - this.getTotalPaddingBottom() - 1, y);
        y += this.getScrollY();
        return this.getLayout().getLineForVertical(Math.floor(y));
    }

    private getOffsetAtCoordinate(line:number, x:number):number  {
        x = this.convertToLocalHorizontalCoordinate(x);
        return this.getLayout().getOffsetForHorizontal(line, x);
    }

    //onDragEvent(event:DragEvent):boolean  {
    //    switch(event.getAction()) {
    //        case DragEvent.ACTION_DRAG_STARTED:
    //            return this.mEditor != null && this.mEditor.hasInsertionController();
    //        case DragEvent.ACTION_DRAG_ENTERED:
    //            TextView.this.requestFocus();
    //            return true;
    //        case DragEvent.ACTION_DRAG_LOCATION:
    //            const offset:number = this.getOffsetForPosition(event.getX(), event.getY());
    //            Selection.setSelection(<Spannable> this.mText, offset);
    //            return true;
    //        case DragEvent.ACTION_DROP:
    //            if (this.mEditor != null)
    //                this.mEditor.onDrop(event);
    //            return true;
    //        case DragEvent.ACTION_DRAG_ENDED:
    //        case DragEvent.ACTION_DRAG_EXITED:
    //        default:
    //            return true;
    //    }
    //}

    isInBatchEditMode():boolean  {
        //if (this.mEditor == null)
            return false;
        //const ims:Editor.InputMethodState = this.mEditor.mInputMethodState;
        //if (ims != null) {
        //    return ims.mBatchEditNesting > 0;
        //}
        //return this.mEditor.mInBatchEditControllers;
    }

    //onRtlPropertiesChanged(layoutDirection:number):void  {
    //    super.onRtlPropertiesChanged(layoutDirection);
    //    this.mTextDir = this.getTextDirectionHeuristic();
    //}

    getTextDirectionHeuristic():TextDirectionHeuristic  {
        return TextDirectionHeuristics.LTR;
        //if (this.hasPasswordTransformationMethod()) {
        //    // passwords fields should be LTR
        //    return TextDirectionHeuristics.LTR;
        //}
        //// Always need to resolve layout direction first
        //const defaultIsRtl:boolean = (this.getLayoutDirection() == TextView.LAYOUT_DIRECTION_RTL);
        //// Now, we can select the heuristic
        //switch(this.getTextDirection()) {
        //    default:
        //    case TextView.TEXT_DIRECTION_FIRST_STRONG:
        //        return (defaultIsRtl ? TextDirectionHeuristics.FIRSTSTRONG_RTL : TextDirectionHeuristics.FIRSTSTRONG_LTR);
        //    case TextView.TEXT_DIRECTION_ANY_RTL:
        //        return TextDirectionHeuristics.ANYRTL_LTR;
        //    case TextView.TEXT_DIRECTION_LTR:
        //        return TextDirectionHeuristics.LTR;
        //    case TextView.TEXT_DIRECTION_RTL:
        //        return TextDirectionHeuristics.RTL;
        //    case TextView.TEXT_DIRECTION_LOCALE:
        //        return TextDirectionHeuristics.LOCALE;
        //}
    }

    /**
     * @hide
     */
    onResolveDrawables(layoutDirection:number):void  {
        // No need to resolve twice
        if (this.mLastLayoutDirection == layoutDirection) {
            return;
        }
        this.mLastLayoutDirection = layoutDirection;
        // Resolve drawables
        if (this.mDrawables != null) {
            this.mDrawables.resolveWithLayoutDirection(layoutDirection);
        }
    }

    /**
     * @hide
     */
    protected resetResolvedDrawables():void  {
        //super.resetResolvedDrawables();
        this.mLastLayoutDirection = -1;
    }

    ///**
    // * @hide
    // */
    //protected viewClicked(imm:InputMethodManager):void  {
    //    if (imm != null) {
    //        imm.viewClicked(this);
    //    }
    //}

    /**
     * Deletes the range of text [start, end[.
     * @hide
     */
    protected deleteText_internal(start:number, end:number):void  {
        //(<Editable> this.mText).delete(start, end);
    }

    /**
     * Replaces the range of text [start, end[ by replacement text
     * @hide
     */
    protected replaceText_internal(start:number, end:number, text:String):void  {
        //(<Editable> this.mText).replace(start, end, text);
    }

    /**
     * Sets a span on the specified range of text
     * @hide
     */
    protected setSpan_internal(span:any, start:number, end:number, flags:number):void  {
        //(<Editable> this.mText).setSpan(span, start, end, flags);
    }

    /**
     * Moves the cursor to the specified offset position in text
     * @hide
     */
    protected setCursorPosition_internal(start:number, end:number):void  {
        //Selection.setSelection((<Editable> this.mText), start, end);
    }

    /**
     * An Editor should be created as soon as any of the editable-specific fields (grouped
     * inside the Editor object) is assigned to a non-default value.
     * This method will create the Editor if needed.
     *
     * A standard TextView (as well as buttons, checkboxes...) should not qualify and hence will
     * have a null Editor, unlike an EditText. Inconsistent in-between states will have an
     * Editor for backward compatibility, as soon as one of these fields is assigned.
     *
     * Also note that for performance reasons, the mEditor is created when needed, but not
     * reset when no more edit-specific fields are needed.
     */
    private createEditorIfNeeded():void  {
        //if (this.mEditor == null) {
        //    this.mEditor = new Editor(this);
        //}
    }

    ///**
    // * @hide
    // */
    //getIterableTextForAccessibility():CharSequence  {
    //    if (!(this.mText instanceof Spannable)) {
    //        this.setText(this.mText, TextView.BufferType.SPANNABLE);
    //    }
    //    return this.mText;
    //}
    //
    ///**
    // * @hide
    // */
    //getIteratorForGranularity(granularity:number):TextSegmentIterator  {
    //    switch(granularity) {
    //        case AccessibilityNodeInfo.MOVEMENT_GRANULARITY_LINE:
    //            {
    //                let text:Spannable = <Spannable> this.getIterableTextForAccessibility();
    //                if (!TextUtils.isEmpty(text) && this.getLayout() != null) {
    //                    let iterator:AccessibilityIterators.LineTextSegmentIterator = AccessibilityIterators.LineTextSegmentIterator.getInstance();
    //                    iterator.initialize(text, this.getLayout());
    //                    return iterator;
    //                }
    //            }
    //            break;
    //        case AccessibilityNodeInfo.MOVEMENT_GRANULARITY_PAGE:
    //            {
    //                let text:Spannable = <Spannable> this.getIterableTextForAccessibility();
    //                if (!TextUtils.isEmpty(text) && this.getLayout() != null) {
    //                    let iterator:AccessibilityIterators.PageTextSegmentIterator = AccessibilityIterators.PageTextSegmentIterator.getInstance();
    //                    iterator.initialize(this);
    //                    return iterator;
    //                }
    //            }
    //            break;
    //    }
    //    return super.getIteratorForGranularity(granularity);
    //}
    //
    ///**
    // * @hide
    // */
    //getAccessibilitySelectionStart():number  {
    //    return this.getSelectionStart();
    //}
    //
    ///**
    // * @hide
    // */
    //isAccessibilitySelectionExtendable():boolean  {
    //    return true;
    //}
    //
    ///**
    // * @hide
    // */
    //getAccessibilitySelectionEnd():number  {
    //    return this.getSelectionEnd();
    //}
    //
    ///**
    // * @hide
    // */
    //setAccessibilitySelection(start:number, end:number):void  {
    //    if (this.getAccessibilitySelectionStart() == start && this.getAccessibilitySelectionEnd() == end) {
    //        return;
    //    }
    //    // controllers interact with how selection behaves.
    //    if (this.mEditor != null) {
    //        this.mEditor.hideControllers();
    //    }
    //    let text:CharSequence = this.getIterableTextForAccessibility();
    //    if (Math.min(start, end) >= 0 && Math.max(start, end) <= text.length()) {
    //        Selection.setSelection(<Spannable> text, start, end);
    //    } else {
    //        Selection.removeSelection(<Spannable> text);
    //    }
    //}








}

export module TextView{
export class Drawables {

    static DRAWABLE_NONE:number = -1;

    static DRAWABLE_RIGHT:number = 0;

    static DRAWABLE_LEFT:number = 1;

    mCompoundRect:Rect = new Rect();

    mDrawableTop:Drawable;
    mDrawableBottom:Drawable;
    mDrawableLeft:Drawable;
    mDrawableRight:Drawable;
    mDrawableStart:Drawable;
    mDrawableEnd:Drawable;
    mDrawableError:Drawable;
    mDrawableTemp:Drawable;

    mDrawableLeftInitial:Drawable;
    mDrawableRightInitial:Drawable;

    mIsRtlCompatibilityMode:boolean;

    mOverride:boolean;

    mDrawableSizeTop:number = 0;
    mDrawableSizeBottom:number = 0;
    mDrawableSizeLeft:number = 0;
    mDrawableSizeRight:number = 0;
    mDrawableSizeStart:number = 0;
    mDrawableSizeEnd:number = 0;
    mDrawableSizeError:number = 0;
    mDrawableSizeTemp:number = 0;

    mDrawableWidthTop:number = 0;
    mDrawableWidthBottom:number = 0;
    mDrawableHeightLeft:number = 0;
    mDrawableHeightRight:number = 0;
    mDrawableHeightStart:number = 0;
    mDrawableHeightEnd:number = 0;
    mDrawableHeightError:number = 0;
    mDrawableHeightTemp:number = 0;

    mDrawablePadding:number = 0;

    mDrawableSaved:number = Drawables.DRAWABLE_NONE;

    constructor( context?:any) {
        //const targetSdkVersion:number = context.getApplicationInfo().targetSdkVersion;
        this.mIsRtlCompatibilityMode = false;//(targetSdkVersion < JELLY_BEAN_MR1 || !context.getApplicationInfo().hasRtlSupport());
        this.mOverride = false;
    }

    resolveWithLayoutDirection(layoutDirection:number):void  {
        // First reset "left" and "right" drawables to their initial values
        this.mDrawableLeft = this.mDrawableLeftInitial;
        this.mDrawableRight = this.mDrawableRightInitial;
        //if (this.mIsRtlCompatibilityMode) {
        //    // Use "start" drawable as "left" drawable if the "left" drawable was not defined
        //    if (this.mDrawableStart != null && this.mDrawableLeft == null) {
        //        this.mDrawableLeft = this.mDrawableStart;
        //        this.mDrawableSizeLeft = this.mDrawableSizeStart;
        //        this.mDrawableHeightLeft = this.mDrawableHeightStart;
        //    }
        //    // Use "end" drawable as "right" drawable if the "right" drawable was not defined
        //    if (this.mDrawableEnd != null && this.mDrawableRight == null) {
        //        this.mDrawableRight = this.mDrawableEnd;
        //        this.mDrawableSizeRight = this.mDrawableSizeEnd;
        //        this.mDrawableHeightRight = this.mDrawableHeightEnd;
        //    }
        //} else {
        //    // drawable if and only if they have been defined
        //    switch(layoutDirection) {
        //        case TextView.LAYOUT_DIRECTION_RTL:
        //            if (this.mOverride) {
        //                this.mDrawableRight = this.mDrawableStart;
        //                this.mDrawableSizeRight = this.mDrawableSizeStart;
        //                this.mDrawableHeightRight = this.mDrawableHeightStart;
        //                this.mDrawableLeft = this.mDrawableEnd;
        //                this.mDrawableSizeLeft = this.mDrawableSizeEnd;
        //                this.mDrawableHeightLeft = this.mDrawableHeightEnd;
        //            }
        //            break;
        //        case TextView.LAYOUT_DIRECTION_LTR:
        //        default:
                    if (this.mOverride) {
                        this.mDrawableLeft = this.mDrawableStart;
                        this.mDrawableSizeLeft = this.mDrawableSizeStart;
                        this.mDrawableHeightLeft = this.mDrawableHeightStart;
                        this.mDrawableRight = this.mDrawableEnd;
                        this.mDrawableSizeRight = this.mDrawableSizeEnd;
                        this.mDrawableHeightRight = this.mDrawableHeightEnd;
                    }
        //            break;
        //    }
        //}
        this.applyErrorDrawableIfNeeded(layoutDirection);
        this.updateDrawablesLayoutDirection(layoutDirection);
    }

    private updateDrawablesLayoutDirection(layoutDirection:number):void  {
        //if (this.mDrawableLeft != null) {
        //    this.mDrawableLeft.setLayoutDirection(layoutDirection);
        //}
        //if (this.mDrawableRight != null) {
        //    this.mDrawableRight.setLayoutDirection(layoutDirection);
        //}
        //if (this.mDrawableTop != null) {
        //    this.mDrawableTop.setLayoutDirection(layoutDirection);
        //}
        //if (this.mDrawableBottom != null) {
        //    this.mDrawableBottom.setLayoutDirection(layoutDirection);
        //}
    }

    setErrorDrawable(dr:Drawable, tv:TextView):void  {
        if (this.mDrawableError != dr && this.mDrawableError != null) {
            this.mDrawableError.setCallback(null);
        }
        this.mDrawableError = dr;
        const compoundRect:Rect = this.mCompoundRect;
        let state:number[] = tv.getDrawableState();
        if (this.mDrawableError != null) {
            this.mDrawableError.setState(state);
            this.mDrawableError.copyBounds(compoundRect);
            this.mDrawableError.setCallback(tv);
            this.mDrawableSizeError = compoundRect.width();
            this.mDrawableHeightError = compoundRect.height();
        } else {
            this.mDrawableSizeError = this.mDrawableHeightError = 0;
        }
    }

    private applyErrorDrawableIfNeeded(layoutDirection:number):void  {
        // first restore the initial state if needed
        switch(this.mDrawableSaved) {
            case Drawables.DRAWABLE_LEFT:
                this.mDrawableLeft = this.mDrawableTemp;
                this.mDrawableSizeLeft = this.mDrawableSizeTemp;
                this.mDrawableHeightLeft = this.mDrawableHeightTemp;
                break;
            case Drawables.DRAWABLE_RIGHT:
                this.mDrawableRight = this.mDrawableTemp;
                this.mDrawableSizeRight = this.mDrawableSizeTemp;
                this.mDrawableHeightRight = this.mDrawableHeightTemp;
                break;
            case Drawables.DRAWABLE_NONE:
            default:
        }
        // then, if needed, assign the Error drawable to the correct location
        //if (this.mDrawableError != null) {
        //    switch(layoutDirection) {
        //        case TextView.LAYOUT_DIRECTION_RTL:
        //            this.mDrawableSaved = Drawables.DRAWABLE_LEFT;
        //            this.mDrawableTemp = this.mDrawableLeft;
        //            this.mDrawableSizeTemp = this.mDrawableSizeLeft;
        //            this.mDrawableHeightTemp = this.mDrawableHeightLeft;
        //            this.mDrawableLeft = this.mDrawableError;
        //            this.mDrawableSizeLeft = this.mDrawableSizeError;
        //            this.mDrawableHeightLeft = this.mDrawableHeightError;
        //            break;
        //        case TextView.LAYOUT_DIRECTION_LTR:
        //        default:
                    this.mDrawableSaved = Drawables.DRAWABLE_RIGHT;
                    this.mDrawableTemp = this.mDrawableRight;
                    this.mDrawableSizeTemp = this.mDrawableSizeRight;
                    this.mDrawableHeightTemp = this.mDrawableHeightRight;
                    this.mDrawableRight = this.mDrawableError;
                    this.mDrawableSizeRight = this.mDrawableSizeError;
                    this.mDrawableHeightRight = this.mDrawableHeightError;
        //            break;
        //    }
        //}
    }
}
/**
     * Interface definition for a callback to be invoked when an action is
     * performed on the editor.
     */
export interface OnEditorActionListener {

    /**
         * Called when an action is being performed.
         *
         * @param v The view that was clicked.
         * @param actionId Identifier of the action.  This will be either the
         * identifier you supplied, or {@link EditorInfo#IME_NULL
         * EditorInfo.IME_NULL} if being called due to the enter key
         * being pressed.
         * @param event If triggered by an enter key, this is the event;
         * otherwise, this is null.
         * @return Return true if you have consumed the action, else false.
         */
    onEditorAction(v:TextView, actionId:number, event:KeyEvent):boolean ;
}
///**
//     * User interface state that is stored by TextView for implementing
//     * {@link View#onSaveInstanceState}.
//     */
//export class SavedState extends View.BaseSavedState {
//
//    selStart:number = 0;
//
//    selEnd:number = 0;
//
//    text:CharSequence;
//
//    frozenWithFocus:boolean;
//
//    error:CharSequence;
//
//    constructor( superState:Parcelable) {
//        super(superState);
//    }
//
//    writeToParcel(out:Parcel, flags:number):void  {
//        super.writeToParcel(out, flags);
//        out.writeInt(this.selStart);
//        out.writeInt(this.selEnd);
//        out.writeInt(this.frozenWithFocus ? 1 : 0);
//        TextUtils.writeToParcel(this.text, out, flags);
//        if (this.error == null) {
//            out.writeInt(0);
//        } else {
//            out.writeInt(1);
//            TextUtils.writeToParcel(this.error, out, flags);
//        }
//    }
//
//    toString():string  {
//        let str:string = "TextView.SavedState{" + Integer.toHexString(System.identityHashCode(this)) + " start=" + this.selStart + " end=" + this.selEnd;
//        if (this.text != null) {
//            str += " text=" + this.text;
//        }
//        return str + "}";
//    }
//
//    static CREATOR:Parcelable.Creator<SavedState> = (()=>{
//        const _this=this;
//        class _Inner extends Parcelable.Creator<SavedState> {
//
//            createFromParcel(_in:Parcel):SavedState  {
//                return new SavedState(_in);
//            }
//
//            newArray(size:number):SavedState[]  {
//                return new Array<SavedState>(size);
//            }
//        }
//        return new _Inner();
//    })();
//
//    constructor( _in:Parcel) {
//        super(_in);
//        this.selStart = _in.readInt();
//        this.selEnd = _in.readInt();
//        this.frozenWithFocus = (_in.readInt() != 0);
//        this.text = TextUtils.CHAR_SEQUENCE_CREATOR.createFromParcel(_in);
//        if (_in.readInt() != 0) {
//            this.error = TextUtils.CHAR_SEQUENCE_CREATOR.createFromParcel(_in);
//        }
//    }
//}
//export class CharWrapper implements CharSequence, GetChars, GraphicsOperations {
//
//    private mChars:string[];
//
//    private mStart:number = 0;
//    private mLength:number = 0;
//
//    constructor( chars:string[], start:number, len:number) {
//        this.mChars = chars;
//        this.mStart = start;
//        this.mLength = len;
//    }
//
//    /* package */
//    set(chars:string[], start:number, len:number):void  {
//        this.mChars = chars;
//        this.mStart = start;
//        this.mLength = len;
//    }
//
//    length():number  {
//        return this.mLength;
//    }
//
//    charAt(off:number):string  {
//        return this.mChars[off + this.mStart];
//    }
//
//    toString():string  {
//        return new string(this.mChars, this.mStart, this.mLength);
//    }
//
//    subSequence(start:number, end:number):CharSequence  {
//        if (start < 0 || end < 0 || start > this.mLength || end > this.mLength) {
//            throw Error(`new IndexOutOfBoundsException(start + ", " + end)`);
//        }
//        return new string(this.mChars, start + this.mStart, end - start);
//    }
//
//    getChars(start:number, end:number, buf:string[], off:number):void  {
//        if (start < 0 || end < 0 || start > this.mLength || end > this.mLength) {
//            throw Error(`new IndexOutOfBoundsException(start + ", " + end)`);
//        }
//        System.arraycopy(this.mChars, start + this.mStart, buf, off, end - start);
//    }
//
//    drawText(c:Canvas, start:number, end:number, x:number, y:number, p:Paint):void  {
//        c.drawText(this.mChars, start + this.mStart, end - start, x, y, p);
//    }
//
//    drawTextRun(c:Canvas, start:number, end:number, contextStart:number, contextEnd:number, x:number, y:number, flags:number, p:Paint):void  {
//        let count:number = end - start;
//        let contextCount:number = contextEnd - contextStart;
//        c.drawTextRun(this.mChars, start + this.mStart, count, contextStart + this.mStart, contextCount, x, y, flags, p);
//    }
//
//    measureText(start:number, end:number, p:Paint):number  {
//        return p.measureText(this.mChars, start + this.mStart, end - start);
//    }
//
//    getTextWidths(start:number, end:number, widths:number[], p:Paint):number  {
//        return p.getTextWidths(this.mChars, start + this.mStart, end - start, widths);
//    }
//
//    getTextRunAdvances(start:number, end:number, contextStart:number, contextEnd:number, flags:number, advances:number[], advancesIndex:number, p:Paint):number  {
//        let count:number = end - start;
//        let contextCount:number = contextEnd - contextStart;
//        return p.getTextRunAdvances(this.mChars, start + this.mStart, count, contextStart + this.mStart, contextCount, flags, advances, advancesIndex);
//    }
//
//    getTextRunCursor(contextStart:number, contextEnd:number, flags:number, offset:number, cursorOpt:number, p:Paint):number  {
//        let contextCount:number = contextEnd - contextStart;
//        return p.getTextRunCursor(this.mChars, contextStart + this.mStart, contextCount, flags, offset + this.mStart, cursorOpt);
//    }
//}
export class Marquee extends Handler {

    // TODO: Add an option to configure this
    private static MARQUEE_DELTA_MAX:number = 0.07;

    private static MARQUEE_DELAY:number = 1200;

    private static MARQUEE_RESTART_DELAY:number = 1200;

    private static MARQUEE_RESOLUTION:number = 1000 / 30;

    private static MARQUEE_PIXELS_PER_SECOND:number = 30;

    private static MARQUEE_STOPPED:number = 0x0;

    private static MARQUEE_STARTING:number = 0x1;

    private static MARQUEE_RUNNING:number = 0x2;

    private static MESSAGE_START:number = 0x1;

    private static MESSAGE_TICK:number = 0x2;

    private static MESSAGE_RESTART:number = 0x3;

    private mView:WeakReference<TextView>;

    private mStatus:number = Marquee.MARQUEE_STOPPED;

    private mScrollUnit:number = 0;

    private mMaxScroll:number = 0;

    private mMaxFadeScroll:number = 0;

    private mGhostStart:number = 0;

    private mGhostOffset:number = 0;

    private mFadeStop:number = 0;

    private mRepeatLimit:number = 0;

    private mScroll:number = 0;

    constructor(v:TextView) {
        super();
        const density:number = v.getResources().getDisplayMetrics().density;
        this.mScrollUnit = (Marquee.MARQUEE_PIXELS_PER_SECOND * density) / Marquee.MARQUEE_RESOLUTION;
        this.mView = new WeakReference<TextView>(v);
    }

    handleMessage(msg:Message):void  {
        switch(msg.what) {
            case Marquee.MESSAGE_START:
                this.mStatus = Marquee.MARQUEE_RUNNING;
                this.tick();
                break;
            case Marquee.MESSAGE_TICK:
                this.tick();
                break;
            case Marquee.MESSAGE_RESTART:
                if (this.mStatus == Marquee.MARQUEE_RUNNING) {
                    if (this.mRepeatLimit >= 0) {
                        this.mRepeatLimit--;
                    }
                    this.start(this.mRepeatLimit);
                }
                break;
        }
    }

    tick():void  {
        if (this.mStatus != Marquee.MARQUEE_RUNNING) {
            return;
        }
        this.removeMessages(Marquee.MESSAGE_TICK);
        const textView:TextView = this.mView.get();
        if (textView != null && (textView.isFocused() || textView.isSelected())) {
            this.mScroll += this.mScrollUnit;
            if (this.mScroll > this.mMaxScroll) {
                this.mScroll = this.mMaxScroll;
                this.sendEmptyMessageDelayed(Marquee.MESSAGE_RESTART, Marquee.MARQUEE_RESTART_DELAY);
            } else {
                this.sendEmptyMessageDelayed(Marquee.MESSAGE_TICK, Marquee.MARQUEE_RESOLUTION);
            }
            textView.invalidate();
        }
    }

    stop():void  {
        this.mStatus = Marquee.MARQUEE_STOPPED;
        this.removeMessages(Marquee.MESSAGE_START);
        this.removeMessages(Marquee.MESSAGE_RESTART);
        this.removeMessages(Marquee.MESSAGE_TICK);
        this.resetScroll();
    }

    private resetScroll():void  {
        this.mScroll = 0.0;
        const textView:TextView = this.mView.get();
        if (textView != null)
            textView.invalidate();
    }

    start(repeatLimit:number):void  {
        if (repeatLimit == 0) {
            this.stop();
            return;
        }
        this.mRepeatLimit = repeatLimit;
        const textView:TextView = this.mView.get();
        if (textView != null && textView.mLayout != null) {
            this.mStatus = Marquee.MARQUEE_STARTING;
            this.mScroll = 0.0;
            const textWidth:number = textView.getWidth() - textView.getCompoundPaddingLeft() - textView.getCompoundPaddingRight();
            const lineWidth:number = textView.mLayout.getLineWidth(0);
            const gap:number = textWidth / 3.0;
            this.mGhostStart = lineWidth - textWidth + gap;
            this.mMaxScroll = this.mGhostStart + textWidth;
            this.mGhostOffset = lineWidth + gap;
            this.mFadeStop = lineWidth + textWidth / 6.0;
            this.mMaxFadeScroll = this.mGhostStart + lineWidth + lineWidth;
            textView.invalidate();
            this.sendEmptyMessageDelayed(Marquee.MESSAGE_START, Marquee.MARQUEE_DELAY);
        }
    }

    getGhostOffset():number  {
        return this.mGhostOffset;
    }

    getScroll():number  {
        return this.mScroll;
    }

    getMaxFadeScroll():number  {
        return this.mMaxFadeScroll;
    }

    shouldDrawLeftFade():boolean  {
        return this.mScroll <= this.mFadeStop;
    }

    shouldDrawGhost():boolean  {
        return this.mStatus == Marquee.MARQUEE_RUNNING && this.mScroll > this.mGhostStart;
    }

    isRunning():boolean  {
        return this.mStatus == Marquee.MARQUEE_RUNNING;
    }

    isStopped():boolean  {
        return this.mStatus == Marquee.MARQUEE_STOPPED;
    }
}
export class ChangeWatcher implements TextWatcher, SpanWatcher {
    _TextView_this:TextView;
    constructor(arg:TextView){
        this._TextView_this = arg;
    }

    private mBeforeText:String;

    beforeTextChanged(buffer:String, start:number, before:number, after:number):void  {
        if (TextView.DEBUG_EXTRACT)
            Log.v(TextView.LOG_TAG, "beforeTextChanged start=" + start + " before=" + before + " after=" + after + ": " + buffer);
        //if (AccessibilityManager.getInstance(this._TextView_this.mContext).isEnabled() && ((!TextView.isPasswordInputType(this._TextView_this.getInputType()) && !this._TextView_this.hasPasswordTransformationMethod()) || this._TextView_this.shouldSpeakPasswordsForAccessibility())) {
        //    this.mBeforeText = buffer.toString();
        //}
        this._TextView_this.sendBeforeTextChanged(buffer, start, before, after);
    }

    onTextChanged(buffer:String, start:number, before:number, after:number):void  {
        if (TextView.DEBUG_EXTRACT)
            Log.v(TextView.LOG_TAG, "onTextChanged start=" + start + " before=" + before + " after=" + after + ": " + buffer);
        this._TextView_this.handleTextChanged(buffer, start, before, after);
        //if (AccessibilityManager.getInstance(this._TextView_this.mContext).isEnabled() && (this._TextView_this.isFocused() || this._TextView_this.isSelected() && this._TextView_this.isShown())) {
        //    this._TextView_this.sendAccessibilityEventTypeViewTextChanged(this.mBeforeText, start, before, after);
        //    this.mBeforeText = null;
        //}
    }

    afterTextChanged(buffer:String):void  {
        if (TextView.DEBUG_EXTRACT)
            Log.v(TextView.LOG_TAG, "afterTextChanged: " + buffer);
        this._TextView_this.sendAfterTextChanged(buffer);
        //if (MetaKeyKeyListener.getMetaState(buffer, MetaKeyKeyListener.META_SELECTING) != 0) {
        //    MetaKeyKeyListener.stopSelecting(this._TextView_this, buffer);
        //}
    }

    onSpanChanged(buf:Spannable, what:any, s:number, e:number, st:number, en:number):void  {
        if (TextView.DEBUG_EXTRACT)
            Log.v(TextView.LOG_TAG, "onSpanChanged s=" + s + " e=" + e + " st=" + st + " en=" + en + " what=" + what + ": " + buf);
        this._TextView_this.spanChange(buf, what, s, st, e, en);
    }

    onSpanAdded(buf:Spannable, what:any, s:number, e:number):void  {
        if (TextView.DEBUG_EXTRACT)
            Log.v(TextView.LOG_TAG, "onSpanAdded s=" + s + " e=" + e + " what=" + what + ": " + buf);
        this._TextView_this.spanChange(buf, what, -1, s, -1, e);
    }

    onSpanRemoved(buf:Spannable, what:any, s:number, e:number):void  {
        if (TextView.DEBUG_EXTRACT)
            Log.v(TextView.LOG_TAG, "onSpanRemoved s=" + s + " e=" + e + " what=" + what + ": " + buf);
        this._TextView_this.spanChange(buf, what, s, -1, e, -1);
    }
}
export enum BufferType {

    NORMAL /*() {
    }
     */, SPANNABLE /*() {
    }
     */, EDITABLE /*() {
    }
     */ /*;
     */}}

}
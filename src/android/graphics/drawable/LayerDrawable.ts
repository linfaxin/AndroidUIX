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

///<reference path="../../../android/content/res/Resources.ts"/>
///<reference path="../../../android/graphics/Canvas.ts"/>
///<reference path="../../../android/graphics/PixelFormat.ts"/>
///<reference path="../../../android/graphics/Rect.ts"/>
///<reference path="../../../android/view/View.ts"/>
///<reference path="../../../java/lang/System.ts"/>
///<reference path="../../../java/lang/Runnable.ts"/>
///<reference path="../../../android/graphics/drawable/Drawable.ts"/>

module android.graphics.drawable {
import Resources = android.content.res.Resources;
import Canvas = android.graphics.Canvas;
import PixelFormat = android.graphics.PixelFormat;
import Rect = android.graphics.Rect;
import View = android.view.View;
import System = java.lang.System;
import Runnable = java.lang.Runnable;
import Drawable = android.graphics.drawable.Drawable;
/** 
 * A Drawable that manages an array of other Drawables. These are drawn in array
 * order, so the element with the largest index will be drawn on top.
 * <p>
 * It can be defined in an XML file with the <code>&lt;layer-list></code> element.
 * Each Drawable in the layer is defined in a nested <code>&lt;item></code>. For more
 * information, see the guide to <a
 * href="{@docRoot}guide/topics/resources/drawable-resource.html">Drawable Resources</a>.</p>
 *
 * @attr ref android.R.styleable#LayerDrawableItem_left
 * @attr ref android.R.styleable#LayerDrawableItem_top
 * @attr ref android.R.styleable#LayerDrawableItem_right
 * @attr ref android.R.styleable#LayerDrawableItem_bottom
 * @attr ref android.R.styleable#LayerDrawableItem_drawable
 * @attr ref android.R.styleable#LayerDrawableItem_id
*/
export class LayerDrawable extends Drawable implements Drawable.Callback {

    mLayerState:LayerDrawable.LayerState;

    private mOpacityOverride:number = PixelFormat.UNKNOWN;

    private mPaddingL:number[];

    private mPaddingT:number[];

    private mPaddingR:number[];

    private mPaddingB:number[];

    private mTmpRect:Rect = new Rect();

    private mMutated:boolean;

    /**
     * Create a new layer drawable with the specified list of layers and the specified
     * constant state.
     *
     * @param layers The list of layers to add to this drawable.
     * @param state The constant drawable state.
     */
    constructor(layers:Drawable[], state:LayerDrawable.LayerState = null) {
        super();
        let _as:LayerDrawable.LayerState = this.createConstantState(state);
        this.mLayerState = _as;
        if (_as.mNum > 0) {
            this.ensurePadding();
        }

        if(layers!=null) {
            let length:number = layers.length;
            let r:LayerDrawable.ChildDrawable[] = new Array<LayerDrawable.ChildDrawable>(length);
            for (let i:number = 0; i < length; i++) {
                r[i] = new LayerDrawable.ChildDrawable();
                r[i].mDrawable = layers[i];
                layers[i].setCallback(this);
                //this.mLayerState.mChildrenChangingConfigurations |= layers[i].getChangingConfigurations();
            }
            this.mLayerState.mNum = length;
            this.mLayerState.mChildren = r;
            this.ensurePadding();
        }
    }

    createConstantState(state:LayerDrawable.LayerState):LayerDrawable.LayerState  {
        return new LayerDrawable.LayerState(state, this);
    }

    //inflate(r:Resources, parser:XmlPullParser, attrs:AttributeSet):void  {
    //    super.inflate(r, parser, attrs);
    //    let type:number;
    //    let a:TypedArray = r.obtainAttributes(attrs, com.android.internal.R.styleable.LayerDrawable);
    //    this.mOpacityOverride = a.getInt(com.android.internal.R.styleable.LayerDrawable_opacity, PixelFormat.UNKNOWN);
    //    this.setAutoMirrored(a.getBoolean(com.android.internal.R.styleable.LayerDrawable_autoMirrored, false));
    //    a.recycle();
    //    const innerDepth:number = parser.getDepth() + 1;
    //    let depth:number;
    //    while ((type = parser.next()) != XmlPullParser.END_DOCUMENT && ((depth = parser.getDepth()) >= innerDepth || type != XmlPullParser.END_TAG)) {
    //        if (type != XmlPullParser.START_TAG) {
    //            continue;
    //        }
    //        if (depth > innerDepth || !parser.getName().equals("item")) {
    //            continue;
    //        }
    //        a = r.obtainAttributes(attrs, com.android.internal.R.styleable.LayerDrawableItem);
    //        let left:number = a.getDimensionPixelOffset(com.android.internal.R.styleable.LayerDrawableItem_left, 0);
    //        let top:number = a.getDimensionPixelOffset(com.android.internal.R.styleable.LayerDrawableItem_top, 0);
    //        let right:number = a.getDimensionPixelOffset(com.android.internal.R.styleable.LayerDrawableItem_right, 0);
    //        let bottom:number = a.getDimensionPixelOffset(com.android.internal.R.styleable.LayerDrawableItem_bottom, 0);
    //        let drawableRes:number = a.getResourceId(com.android.internal.R.styleable.LayerDrawableItem_drawable, 0);
    //        let id:number = a.getResourceId(com.android.internal.R.styleable.LayerDrawableItem_id, View.NO_ID);
    //        a.recycle();
    //        let dr:Drawable;
    //        if (drawableRes != 0) {
    //            dr = r.getDrawable(drawableRes);
    //        } else {
    //            while ((type = parser.next()) == XmlPullParser.TEXT) {
    //            }
    //            if (type != XmlPullParser.START_TAG) {
    //                throw Error(`new XmlPullParserException(parser.getPositionDescription() + ": <item> tag requires a 'drawable' attribute or " + "child tag defining a drawable")`);
    //            }
    //            dr = Drawable.createFromXmlInner(r, parser, attrs);
    //        }
    //        this.addLayer(dr, id, left, top, right, bottom);
    //    }
    //    this.ensurePadding();
    //    this.onStateChange(this.getState());
    //}

    /**
     * Add a new layer to this drawable. The new layer is identified by an id.
     *
     * @param layer The drawable to add as a layer.
     * @param id The id of the new layer.
     * @param left The left padding of the new layer.
     * @param top The top padding of the new layer.
     * @param right The right padding of the new layer.
     * @param bottom The bottom padding of the new layer.
     */
    private addLayer(layer:Drawable, id:string, left=0, top=0, right=0, bottom=0):void  {
        const st:LayerDrawable.LayerState = this.mLayerState;
        let N:number = st.mChildren != null ? st.mChildren.length : 0;
        let i:number = st.mNum;
        if (i >= N) {
            let nu:LayerDrawable.ChildDrawable[] = new Array<LayerDrawable.ChildDrawable>(N + 10);
            if (i > 0) {
                System.arraycopy(st.mChildren, 0, nu, 0, i);
            }
            st.mChildren = nu;
        }
        //this.mLayerState.mChildrenChangingConfigurations |= layer.getChangingConfigurations();
        let childDrawable:LayerDrawable.ChildDrawable = new LayerDrawable.ChildDrawable();
        st.mChildren[i] = childDrawable;
        childDrawable.mId = id;
        childDrawable.mDrawable = layer;
        childDrawable.mDrawable.setAutoMirrored(this.isAutoMirrored());
        childDrawable.mInsetL = left;
        childDrawable.mInsetT = top;
        childDrawable.mInsetR = right;
        childDrawable.mInsetB = bottom;
        st.mNum++;
        layer.setCallback(this);
    }

    /**
     * Look for a layer with the given id, and returns its {@link Drawable}.
     *
     * @param id The layer ID to search for.
     * @return The {@link Drawable} of the layer that has the given id in the hierarchy or null.
     */
    findDrawableByLayerId(id:string):Drawable  {
        const layers:LayerDrawable.ChildDrawable[] = this.mLayerState.mChildren;
        for (let i:number = this.mLayerState.mNum - 1; i >= 0; i--) {
            if (layers[i].mId == id) {
                return layers[i].mDrawable;
            }
        }
        return null;
    }

    /**
     * Sets the ID of a layer.
     * 
     * @param index The index of the layer which will received the ID. 
     * @param id The ID to assign to the layer.
     */
    setId(index:number, id:string):void  {
        this.mLayerState.mChildren[index].mId = id;
    }

    /**
     * Returns the number of layers contained within this.
     * @return The number of layers.
     */
    getNumberOfLayers():number  {
        return this.mLayerState.mNum;
    }

    /**
     * Returns the drawable at the specified layer index.
     *
     * @param index The layer index of the drawable to retrieve.
     *
     * @return The {@link android.graphics.drawable.Drawable} at the specified layer index.
     */
    getDrawable(index:number):Drawable  {
        return this.mLayerState.mChildren[index].mDrawable;
    }

    /**
     * Returns the id of the specified layer.
     *
     * @param index The index of the layer.
     *
     * @return The id of the layer or {@link android.view.View#NO_ID} if the layer has no id. 
     */
    getId(index:number):string  {
        return this.mLayerState.mChildren[index].mId;
    }

    /**
     * Sets (or replaces) the {@link Drawable} for the layer with the given id.
     * 
     * @param id The layer ID to search for.
     * @param drawable The replacement {@link Drawable}.
     * @return Whether the {@link Drawable} was replaced (could return false if
     *         the id was not found).
     */
    setDrawableByLayerId(id:string, drawable:Drawable):boolean  {
        const layers:LayerDrawable.ChildDrawable[] = this.mLayerState.mChildren;
        for (let i:number = this.mLayerState.mNum - 1; i >= 0; i--) {
            if (layers[i].mId == id) {
                if (layers[i].mDrawable != null) {
                    if (drawable != null) {
                        let bounds:Rect = layers[i].mDrawable.getBounds();
                        drawable.setBounds(bounds);
                    }
                    layers[i].mDrawable.setCallback(null);
                }
                if (drawable != null) {
                    drawable.setCallback(this);
                }
                layers[i].mDrawable = drawable;
                return true;
            }
        }
        return false;
    }

    /** Specify modifiers to the bounds for the drawable[index].
        left += l
        top += t;
        right -= r;
        bottom -= b;
    */
    setLayerInset(index:number, l:number, t:number, r:number, b:number):void  {
        let childDrawable:LayerDrawable.ChildDrawable = this.mLayerState.mChildren[index];
        childDrawable.mInsetL = l;
        childDrawable.mInsetT = t;
        childDrawable.mInsetR = r;
        childDrawable.mInsetB = b;
    }

    drawableSizeChange(who:android.graphics.drawable.Drawable):void {
        let callback = this.getCallback();
        if (callback != null && callback.drawableSizeChange) {
            callback.drawableSizeChange(this);
        }
    }

    // overrides from Drawable.Callback
    invalidateDrawable(who:Drawable):void  {
        const callback:Drawable.Callback = this.getCallback();
        if (callback != null) {
            callback.invalidateDrawable(this);
        }
    }

    scheduleDrawable(who:Drawable, what:Runnable, when:number):void  {
        const callback:Drawable.Callback = this.getCallback();
        if (callback != null) {
            callback.scheduleDrawable(this, what, when);
        }
    }

    unscheduleDrawable(who:Drawable, what:Runnable):void  {
        const callback:Drawable.Callback = this.getCallback();
        if (callback != null) {
            callback.unscheduleDrawable(this, what);
        }
    }

    // overrides from Drawable
    draw(canvas:Canvas):void  {
        const array:LayerDrawable.ChildDrawable[] = this.mLayerState.mChildren;
        const N:number = this.mLayerState.mNum;
        for (let i:number = 0; i < N; i++) {
            array[i].mDrawable.draw(canvas);
        }
    }

    //getChangingConfigurations():number  {
    //    return super.getChangingConfigurations() | this.mLayerState.mChangingConfigurations | this.mLayerState.mChildrenChangingConfigurations;
    //}

    getPadding(padding:Rect):boolean  {
        // Arbitrarily get the padding from the first image.
        // Technically we should maybe do something more intelligent,
        // like take the max padding of all the images.
        padding.left = 0;
        padding.top = 0;
        padding.right = 0;
        padding.bottom = 0;
        const array:LayerDrawable.ChildDrawable[] = this.mLayerState.mChildren;
        const N:number = this.mLayerState.mNum;
        for (let i:number = 0; i < N; i++) {
            this.reapplyPadding(i, array[i]);
            padding.left += this.mPaddingL[i];
            padding.top += this.mPaddingT[i];
            padding.right += this.mPaddingR[i];
            padding.bottom += this.mPaddingB[i];
        }
        return true;
    }

    setVisible(visible:boolean, restart:boolean):boolean  {
        let changed:boolean = super.setVisible(visible, restart);
        const array:LayerDrawable.ChildDrawable[] = this.mLayerState.mChildren;
        const N:number = this.mLayerState.mNum;
        for (let i:number = 0; i < N; i++) {
            array[i].mDrawable.setVisible(visible, restart);
        }
        return changed;
    }

    setDither(dither:boolean):void  {
        const array:LayerDrawable.ChildDrawable[] = this.mLayerState.mChildren;
        const N:number = this.mLayerState.mNum;
        for (let i:number = 0; i < N; i++) {
            array[i].mDrawable.setDither(dither);
        }
    }

    setAlpha(alpha:number):void  {
        const array:LayerDrawable.ChildDrawable[] = this.mLayerState.mChildren;
        const N:number = this.mLayerState.mNum;
        for (let i:number = 0; i < N; i++) {
            array[i].mDrawable.setAlpha(alpha);
        }
    }

    getAlpha():number  {
        const array:LayerDrawable.ChildDrawable[] = this.mLayerState.mChildren;
        if (this.mLayerState.mNum > 0) {
            // All layers should have the same alpha set on them - just return the first one
            return array[0].mDrawable.getAlpha();
        } else {
            return super.getAlpha();
        }
    }

    //setColorFilter(cf:ColorFilter):void  {
    //    const array:LayerDrawable.ChildDrawable[] = this.mLayerState.mChildren;
    //    const N:number = this.mLayerState.mNum;
    //    for (let i:number = 0; i < N; i++) {
    //        array[i].mDrawable.setColorFilter(cf);
    //    }
    //}

    /**
     * Sets the opacity of this drawable directly, instead of collecting the states from
     * the layers
     *
     * @param opacity The opacity to use, or {@link PixelFormat#UNKNOWN PixelFormat.UNKNOWN}
     * for the default behavior
     *
     * @see PixelFormat#UNKNOWN
     * @see PixelFormat#TRANSLUCENT
     * @see PixelFormat#TRANSPARENT
     * @see PixelFormat#OPAQUE
     */
    setOpacity(opacity:number):void  {
        this.mOpacityOverride = opacity;
    }

    getOpacity():number  {
        if (this.mOpacityOverride != PixelFormat.UNKNOWN) {
            return this.mOpacityOverride;
        }
        return this.mLayerState.getOpacity();
    }

    setAutoMirrored(mirrored:boolean):void  {
        this.mLayerState.mAutoMirrored = mirrored;
        const array:LayerDrawable.ChildDrawable[] = this.mLayerState.mChildren;
        const N:number = this.mLayerState.mNum;
        for (let i:number = 0; i < N; i++) {
            array[i].mDrawable.setAutoMirrored(mirrored);
        }
    }

    isAutoMirrored():boolean  {
        return this.mLayerState.mAutoMirrored;
    }

    isStateful():boolean  {
        return this.mLayerState.isStateful();
    }

    protected onStateChange(state:number[]):boolean  {
        const array:LayerDrawable.ChildDrawable[] = this.mLayerState.mChildren;
        const N:number = this.mLayerState.mNum;
        let paddingChanged:boolean = false;
        let changed:boolean = false;
        for (let i:number = 0; i < N; i++) {
            const r:LayerDrawable.ChildDrawable = array[i];
            if (r.mDrawable.setState(state)) {
                changed = true;
            }
            if (this.reapplyPadding(i, r)) {
                paddingChanged = true;
            }
        }
        if (paddingChanged) {
            this.onBoundsChange(this.getBounds());
        }
        return changed;
    }

    protected onLevelChange(level:number):boolean  {
        const array:LayerDrawable.ChildDrawable[] = this.mLayerState.mChildren;
        const N:number = this.mLayerState.mNum;
        let paddingChanged:boolean = false;
        let changed:boolean = false;
        for (let i:number = 0; i < N; i++) {
            const r:LayerDrawable.ChildDrawable = array[i];
            if (r.mDrawable.setLevel(level)) {
                changed = true;
            }
            if (this.reapplyPadding(i, r)) {
                paddingChanged = true;
            }
        }
        if (paddingChanged) {
            this.onBoundsChange(this.getBounds());
        }
        return changed;
    }

    protected onBoundsChange(bounds:Rect):void  {
        const array:LayerDrawable.ChildDrawable[] = this.mLayerState.mChildren;
        const N:number = this.mLayerState.mNum;
        let padL:number = 0, padT:number = 0, padR:number = 0, padB:number = 0;
        for (let i:number = 0; i < N; i++) {
            const r:LayerDrawable.ChildDrawable = array[i];
            r.mDrawable.setBounds(bounds.left + r.mInsetL + padL, bounds.top + r.mInsetT + padT, bounds.right - r.mInsetR - padR, bounds.bottom - r.mInsetB - padB);
            padL += this.mPaddingL[i];
            padR += this.mPaddingR[i];
            padT += this.mPaddingT[i];
            padB += this.mPaddingB[i];
        }
    }

    getIntrinsicWidth():number  {
        let width:number = -1;
        const array:LayerDrawable.ChildDrawable[] = this.mLayerState.mChildren;
        const N:number = this.mLayerState.mNum;
        let padL:number = 0, padR:number = 0;
        for (let i:number = 0; i < N; i++) {
            const r:LayerDrawable.ChildDrawable = array[i];
            let w:number = r.mDrawable.getIntrinsicWidth() + r.mInsetL + r.mInsetR + padL + padR;
            if (w > width) {
                width = w;
            }
            padL += this.mPaddingL[i];
            padR += this.mPaddingR[i];
        }
        return width;
    }

    getIntrinsicHeight():number  {
        let height:number = -1;
        const array:LayerDrawable.ChildDrawable[] = this.mLayerState.mChildren;
        const N:number = this.mLayerState.mNum;
        let padT:number = 0, padB:number = 0;
        for (let i:number = 0; i < N; i++) {
            const r:LayerDrawable.ChildDrawable = array[i];
            let h:number = r.mDrawable.getIntrinsicHeight() + r.mInsetT + r.mInsetB + padT + padB;
            if (h > height) {
                height = h;
            }
            padT += this.mPaddingT[i];
            padB += this.mPaddingB[i];
        }
        return height;
    }

    private reapplyPadding(i:number, r:LayerDrawable.ChildDrawable):boolean  {
        const rect:Rect = this.mTmpRect;
        r.mDrawable.getPadding(rect);
        if (rect.left != this.mPaddingL[i] || rect.top != this.mPaddingT[i] || rect.right != this.mPaddingR[i] || rect.bottom != this.mPaddingB[i]) {
            this.mPaddingL[i] = rect.left;
            this.mPaddingT[i] = rect.top;
            this.mPaddingR[i] = rect.right;
            this.mPaddingB[i] = rect.bottom;
            return true;
        }
        return false;
    }

    private ensurePadding():void  {
        const N:number = this.mLayerState.mNum;
        if (this.mPaddingL != null && this.mPaddingL.length >= N) {
            return;
        }
        this.mPaddingL = new Array<number>(N);
        this.mPaddingT = new Array<number>(N);
        this.mPaddingR = new Array<number>(N);
        this.mPaddingB = new Array<number>(N);
    }

    getConstantState():Drawable.ConstantState  {
        if (this.mLayerState.canConstantState()) {
            //this.mLayerState.mChangingConfigurations = this.getChangingConfigurations();
            return this.mLayerState;
        }
        return null;
    }

    mutate():Drawable  {
        if (!this.mMutated && super.mutate() == this) {
            this.mLayerState = this.createConstantState(this.mLayerState);
            const array:LayerDrawable.ChildDrawable[] = this.mLayerState.mChildren;
            const N:number = this.mLayerState.mNum;
            for (let i:number = 0; i < N; i++) {
                array[i].mDrawable.mutate();
            }
            this.mMutated = true;
        }
        return this;
    }

    ///** @hide */
    //setLayoutDirection(layoutDirection:number):void  {
    //    const array:LayerDrawable.ChildDrawable[] = this.mLayerState.mChildren;
    //    const N:number = this.mLayerState.mNum;
    //    for (let i:number = 0; i < N; i++) {
    //        array[i].mDrawable.setLayoutDirection(layoutDirection);
    //    }
    //    super.setLayoutDirection(layoutDirection);
    //}




}

export module LayerDrawable{
export class ChildDrawable {

    mDrawable:Drawable;

    mInsetL:number = 0;
    mInsetT:number = 0;
    mInsetR:number = 0;
    mInsetB:number = 0;

    mId:string;
}
export class LayerState implements Drawable.ConstantState {

    mNum:number = 0;

    mChildren:LayerDrawable.ChildDrawable[];

    //mChangingConfigurations:number = 0;

    //mChildrenChangingConfigurations:number = 0;

    private mHaveOpacity:boolean = false;

    private mOpacity:number = 0;

    private mHaveStateful:boolean = false;

    private mStateful:boolean;

    private mCheckedConstantState:boolean;

    private mCanConstantState:boolean;

    private mAutoMirrored:boolean;

    constructor(orig:LayerState, owner:LayerDrawable) {
        if (orig != null) {
            const origChildDrawable:LayerDrawable.ChildDrawable[] = orig.mChildren;
            const N:number = orig.mNum;
            this.mNum = N;
            this.mChildren = new Array<LayerDrawable.ChildDrawable>(N);
            //this.mChangingConfigurations = orig.mChangingConfigurations;
            //this.mChildrenChangingConfigurations = orig.mChildrenChangingConfigurations;
            for (let i:number = 0; i < N; i++) {
                const r:LayerDrawable.ChildDrawable = this.mChildren[i] = new LayerDrawable.ChildDrawable();
                const or:LayerDrawable.ChildDrawable = origChildDrawable[i];
                //if (res != null) {
                //    r.mDrawable = or.mDrawable.getConstantState().newDrawable(res);
                //} else {
                    r.mDrawable = or.mDrawable.getConstantState().newDrawable();
                //}
                r.mDrawable.setCallback(owner);
                //r.mDrawable.setLayoutDirection(or.mDrawable.getLayoutDirection());
                r.mInsetL = or.mInsetL;
                r.mInsetT = or.mInsetT;
                r.mInsetR = or.mInsetR;
                r.mInsetB = or.mInsetB;
                r.mId = or.mId;
            }
            this.mHaveOpacity = orig.mHaveOpacity;
            this.mOpacity = orig.mOpacity;
            this.mHaveStateful = orig.mHaveStateful;
            this.mStateful = orig.mStateful;
            this.mCheckedConstantState = this.mCanConstantState = true;
            this.mAutoMirrored = orig.mAutoMirrored;
        } else {
            this.mNum = 0;
            this.mChildren = null;
        }
    }

    newDrawable():Drawable  {
        return new LayerDrawable(null, this);
    }

    //getChangingConfigurations():number  {
    //    return this.mChangingConfigurations;
    //}

    getOpacity():number  {
        if (this.mHaveOpacity) {
            return this.mOpacity;
        }
        const N:number = this.mNum;
        let op:number = N > 0 ? this.mChildren[0].mDrawable.getOpacity() : PixelFormat.TRANSPARENT;
        for (let i:number = 1; i < N; i++) {
            op = Drawable.resolveOpacity(op, this.mChildren[i].mDrawable.getOpacity());
        }
        this.mOpacity = op;
        this.mHaveOpacity = true;
        return op;
    }

    isStateful():boolean  {
        if (this.mHaveStateful) {
            return this.mStateful;
        }
        let stateful:boolean = false;
        const N:number = this.mNum;
        for (let i:number = 0; i < N; i++) {
            if (this.mChildren[i].mDrawable.isStateful()) {
                stateful = true;
                break;
            }
        }
        this.mStateful = stateful;
        this.mHaveStateful = true;
        return stateful;
    }

    canConstantState():boolean  {
        if (!this.mCheckedConstantState && this.mChildren != null) {
            this.mCanConstantState = true;
            const N:number = this.mNum;
            for (let i:number = 0; i < N; i++) {
                if (this.mChildren[i].mDrawable.getConstantState() == null) {
                    this.mCanConstantState = false;
                    break;
                }
            }
            this.mCheckedConstantState = true;
        }
        return this.mCanConstantState;
    }
}
}

}
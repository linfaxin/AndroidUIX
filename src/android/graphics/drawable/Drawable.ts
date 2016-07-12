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

///<reference path="../Rect.ts"/>
///<reference path="../PixelFormat.ts"/>
///<reference path="../../../java/lang/ref/WeakReference.ts"/>
///<reference path="../../../java/lang/Runnable.ts"/>
///<reference path="../../util/StateSet.ts"/>
///<reference path="../Canvas.ts"/>

module android.graphics.drawable {

    import Rect = android.graphics.Rect;
    import PixelFormat = android.graphics.PixelFormat;
    import WeakReference = java.lang.ref.WeakReference;
    import Runnable = java.lang.Runnable;
    import StateSet = android.util.StateSet;
    import Canvas = android.graphics.Canvas;
    import Resources = android.content.res.Resources;
    import NetDrawable = androidui.image.NetDrawable;

    /**
     * A Drawable is a general abstraction for "something that can be drawn."  Most
     * often you will deal with Drawable as the type of resource retrieved for
     * drawing things to the screen; the Drawable class provides a generic API for
     * dealing with an underlying visual resource that may take a variety of forms.
     * Unlike a {@link android.view.View}, a Drawable does not have any facility to
     * receive events or otherwise interact with the user.
     *
     * <p>In addition to simple drawing, Drawable provides a number of generic
     * mechanisms for its client to interact with what is being drawn:
     *
     * <ul>
     *     <li> The {@link #setBounds} method <var>must</var> be called to tell the
     *     Drawable where it is drawn and how large it should be.  All Drawables
     *     should respect the requested size, often simply by scaling their
     *     imagery.  A client can find the preferred size for some Drawables with
     *     the {@link #getIntrinsicHeight} and {@link #getIntrinsicWidth} methods.
     *
     *     <li> The {@link #getPadding} method can return from some Drawables
     *     information about how to frame content that is placed inside of them.
     *     For example, a Drawable that is intended to be the frame for a button
     *     widget would need to return padding that correctly places the label
     *     inside of itself.
     *
     *     <li> The {@link #setState} method allows the client to tell the Drawable
     *     in which state it is to be drawn, such as "focused", "selected", etc.
     *     Some drawables may modify their imagery based on the selected state.
     *
     *     <li> The {@link #setLevel} method allows the client to supply a single
     *     continuous controller that can modify the Drawable is displayed, such as
     *     a battery level or progress level.  Some drawables may modify their
     *     imagery based on the current level.
     *
     *     <li> A Drawable can perform animations by calling back to its client
     *     through the {@link Callback} interface.  All clients should support this
     *     interface (via {@link #setCallback}) so that animations will work.  A
     *     simple way to do this is through the system facilities such as
     *     {@link android.view.View#setBackgroundDrawable(Drawable)} and
     *     {@link android.widget.ImageView}.
     * </ul>
     *
     * Though usually not visible to the application, Drawables may take a variety
     * of forms:
     *
     * <ul>
     *     <li> <b>Bitmap</b>: the simplest Drawable, a PNG or JPEG image.
     *     <li> <b>Nine Patch</b>: an extension to the PNG format allows it to
     *     specify information about how to stretch it and place things inside of
     *     it.
     *     <li> <b>Shape</b>: contains simple drawing commands instead of a raw
     *     bitmap, allowing it to resize better in some cases.
     *     <li> <b>Layers</b>: a compound drawable, which draws multiple underlying
     *     drawables on top of each other.
     *     <li> <b>States</b>: a compound drawable that selects one of a set of
     *     drawables based on its state.
     *     <li> <b>Levels</b>: a compound drawable that selects one of a set of
     *     drawables based on its level.
     *     <li> <b>Scale</b>: a compound drawable with a single child drawable,
     *     whose overall size is modified based on the current level.
     * </ul>
     *
     * <div class="special reference">
     * <h3>Developer Guides</h3>
     * <p>For more information about how to use drawables, read the
     * <a href="{@docRoot}guide/topics/graphics/2d-graphics.html">Canvas and Drawables</a> developer
     * guide. For information and examples of creating drawable resources (XML or bitmap files that
     * can be loaded in code), read the
     * <a href="{@docRoot}guide/topics/resources/drawable-resource.html">Drawable Resources</a>
     * document.</p></div>
     */
    export abstract class Drawable {
        private static ZERO_BOUNDS_RECT = new Rect();

        mBounds:Rect = Drawable.ZERO_BOUNDS_RECT;// lazily becomes a new Rect()
        mStateSet = StateSet.WILD_CARD;
        mLevel = 0;
        mVisible = true;
        mCallback:WeakReference<Drawable.Callback>;

        private mIgnoreNotifySizeChange = false;

        constructor() {
        }

        /**
         * Draw in its bounds (set via setBounds) respecting optional effects such
         * as alpha (set via setAlpha) and color filter (set via setColorFilter).
         *
         * @param canvas The canvas to draw into
         */
        abstract draw(canvas:Canvas);

        /**
         * Specify a bounding rectangle for the Drawable. This is where the drawable
         * will draw when its draw() method is called.
         */
        setBounds(rect:Rect);
        /**
         * Specify a bounding rectangle for the Drawable. This is where the drawable
         * will draw when its draw() method is called.
         */
        setBounds(left, top, right, bottom);
        setBounds(...args) {
            if (args.length === 1) {
                let rect = args[0];
                return this.setBounds(rect.left, rect.top, rect.right, rect.bottom);
            } else {
                let [left=0, top=0, right=0, bottom=0] = args;
                let oldBounds = this.mBounds;

                if (oldBounds == Drawable.ZERO_BOUNDS_RECT) {
                    oldBounds = this.mBounds = new Rect();
                }

                if (oldBounds.left != left || oldBounds.top != top ||
                    oldBounds.right != right || oldBounds.bottom != bottom) {
                    if (!oldBounds.isEmpty()) {
                        // first invalidate the previous bounds
                        this.invalidateSelf();
                    }
                    this.mBounds.set(left, top, right, bottom);
                    this.onBoundsChange(this.mBounds);
                }
            }
        }

        /**
         * Return a copy of the drawable's bounds in the specified Rect (allocated
         * by the caller). The bounds specify where this will draw when its draw()
         * method is called.
         *
         * @param bounds Rect to receive the drawable's bounds (allocated by the
         *               caller).
         */
        copyBounds(bounds = new Rect()) {
            bounds.set(this.mBounds);
            return bounds;
        }

        /**
         * Return the drawable's bounds Rect. Note: for efficiency, the returned
         * object may be the same object stored in the drawable (though this is not
         * guaranteed), so if a persistent copy of the bounds is needed, call
         * copyBounds(rect) instead.
         * You should also not change the object returned by this method as it may
         * be the same object stored in the drawable.
         *
         * @return The bounds of the drawable (which may change later, so caller
         *         beware). DO NOT ALTER the returned object as it may change the
         *         stored bounds of this drawable.
         *
         * @see #copyBounds()
         * @see #copyBounds(android.graphics.Rect)
         */
        getBounds():Rect {
            if (this.mBounds == Drawable.ZERO_BOUNDS_RECT) {
                this.mBounds = new Rect();
            }

            return this.mBounds;
        }

        /**
         * Set to true to have the drawable dither its colors when drawn to a device
         * with fewer than 8-bits per color component. This can improve the look on
         * those devices, but can also slow down the drawing a little.
         */
        setDither(dither:boolean) {}

        /**
         * Bind a {@link Callback} object to this Drawable.  Required for clients
         * that want to support animated drawables.
         *
         * @param cb The client's Callback implementation.
         *
         * @see #getCallback()
         */
        setCallback(cb:Drawable.Callback) {
            this.mCallback = new WeakReference(cb);
        }

        /**
         * Return the current {@link Callback} implementation attached to this
         * Drawable.
         *
         * @return A {@link Callback} instance or null if no callback was set.
         *
         * @see #setCallback(android.graphics.drawable.Drawable.Callback)
         */
        getCallback():Drawable.Callback {
            if (this.mCallback != null) {
                return this.mCallback.get();
            }
            return null;
        }

        /**
         * by default, NetDrawable will change it's bound when load image finish.
         * If you wan lock a bound to a NetDrawable, you shound call this method to ignore it.
         */
        setIgnoreNotifySizeChange(isIgnore:boolean):void {
            this.mIgnoreNotifySizeChange = isIgnore;
        }

        /**
         * AndroidUI add: notity size change
         */
        notifySizeChangeSelf() {
            if(this.mIgnoreNotifySizeChange) return;
            let callback = this.getCallback();
            if (callback != null && callback.drawableSizeChange) {
                callback.drawableSizeChange(this);
            }
        }

        /**
         * Use the current {@link Callback} implementation to have this Drawable
         * redrawn.  Does nothing if there is no Callback attached to the
         * Drawable.
         *
         * @see Callback#invalidateDrawable
         * @see #getCallback()
         * @see #setCallback(android.graphics.drawable.Drawable.Callback)
         */
        invalidateSelf() {
            let callback = this.getCallback();
            if (callback != null) {
                callback.invalidateDrawable(this);
            }
        }

        /**
         * Use the current {@link Callback} implementation to have this Drawable
         * scheduled.  Does nothing if there is no Callback attached to the
         * Drawable.
         *
         * @param what The action being scheduled.
         * @param when The time (in milliseconds) to run.
         *
         * @see Callback#scheduleDrawable
         */
        scheduleSelf(what, when) {
            let callback = this.getCallback();
            if (callback != null) {
                callback.scheduleDrawable(this, what, when);
            }
        }

        /**
         * Use the current {@link Callback} implementation to have this Drawable
         * unscheduled.  Does nothing if there is no Callback attached to the
         * Drawable.
         *
         * @param what The runnable that you no longer want called.
         *
         * @see Callback#unscheduleDrawable
         */
        unscheduleSelf(what) {
            let callback = this.getCallback();
            if (callback != null) {
                callback.unscheduleDrawable(this, what);
            }
        }

        /**
         * Specify an alpha value for the drawable. 0 means fully transparent, and
         * 255 means fully opaque.
         */
        abstract setAlpha(alpha:number):void;

        /**
         * Gets the current alpha value for the drawable. 0 means fully transparent,
         * 255 means fully opaque. This method is implemented by
         * Drawable subclasses and the value returned is specific to how that class treats alpha.
         * The default return value is 255 if the class does not override this method to return a value
         * specific to its use of alpha.
         */
        getAlpha():number {
            return 0xFF;
        }

        /**
         * Indicates whether this view will change its appearance based on state.
         * Clients can use this to determine whether it is necessary to calculate
         * their state and call setState.
         *
         * @return True if this view changes its appearance based on state, false
         *         otherwise.
         *
         * @see #setState(int[])
         */
        isStateful():boolean {
            return false;
        }

        /**
         * Specify a set of states for the drawable. These are use-case specific,
         * so see the relevant documentation. As an example, the background for
         * widgets like Button understand the following states:
         * [{@link android.R.attr#state_focused},
         *  {@link android.R.attr#state_pressed}].
         *
         * <p>If the new state you are supplying causes the appearance of the
         * Drawable to change, then it is responsible for calling
         * {@link #invalidateSelf} in order to have itself redrawn, <em>and</em>
         * true will be returned from this function.
         *
         * <p>Note: The Drawable holds a reference on to <var>stateSet</var>
         * until a new state array is given to it, so you must not modify this
         * array during that time.</p>
         *
         * @param stateSet The new set of states to be displayed.
         *
         * @return Returns true if this change in state has caused the appearance
         * of the Drawable to change (hence requiring an invalidate), otherwise
         * returns false.
         */
        setState(stateSet:Array<number>) {
            if (this.mStateSet+'' !== stateSet+'') {
                this.mStateSet = stateSet;
                return this.onStateChange(stateSet);
            }
            return false;
        }

        /**
         * Describes the current state, as a union of primitve states, such as
         * {@link android.R.attr#state_focused},
         * {@link android.R.attr#state_selected}, etc.
         * Some drawables may modify their imagery based on the selected state.
         * @return An array of resource Ids describing the current state.
         */
        getState():Array<number> {
            return this.mStateSet;
        }

        /**
         * If this Drawable does transition animations between states, ask that
         * it immediately jump to the current state and skip any active animations.
         */
        jumpToCurrentState() {
        }

        /**
         * @return The current drawable that will be used by this drawable. For simple drawables, this
         *         is just the drawable itself. For drawables that change state like
         *         {@link StateListDrawable} and {@link LevelListDrawable} this will be the child drawable
         *         currently in use.
         */
        getCurrent():Drawable {
            return this;
        }

        /**
         * Specify the level for the drawable.  This allows a drawable to vary its
         * imagery based on a continuous controller, for example to show progress
         * or volume level.
         *
         * <p>If the new level you are supplying causes the appearance of the
         * Drawable to change, then it is responsible for calling
         * {@link #invalidateSelf} in order to have itself redrawn, <em>and</em>
         * true will be returned from this function.
         *
         * @param level The new level, from 0 (minimum) to 10000 (maximum).
         *
         * @return Returns true if this change in level has caused the appearance
         * of the Drawable to change (hence requiring an invalidate), otherwise
         * returns false.
         */
        setLevel(level:number):boolean {
            if (this.mLevel != level) {
                this.mLevel = level;
                return this.onLevelChange(level);
            }
            return false;
        }

        /**
         * Retrieve the current level.
         *
         * @return int Current level, from 0 (minimum) to 10000 (maximum).
         */
        getLevel():number {
            return this.mLevel;
        }

        /**
         * Set whether this Drawable is visible.  This generally does not impact
         * the Drawable's behavior, but is a hint that can be used by some
         * Drawables, for example, to decide whether run animations.
         *
         * @param visible Set to true if visible, false if not.
         * @param restart You can supply true here to force the drawable to behave
         *                as if it has just become visible, even if it had last
         *                been set visible.  Used for example to force animations
         *                to restart.
         *
         * @return boolean Returns true if the new visibility is different than
         *         its previous state.
         */
        setVisible(visible:boolean, restart:boolean) {
            let changed = this.mVisible != visible;
            if (changed) {
                this.mVisible = visible;
                this.invalidateSelf();
            }
            return changed;
        }

        isVisible():boolean {
            return this.mVisible;
        }

        /**
         * Set whether this Drawable is automatically mirrored when its layout direction is RTL
         * (right-to left). See {@link android.util.LayoutDirection}.
         *
         * @param mirrored Set to true if the Drawable should be mirrored, false if not.
         */
        setAutoMirrored(mirrored:boolean) {
        }

        /**
         * Tells if this Drawable will be automatically mirrored  when its layout direction is RTL
         * right-to-left. See {@link android.util.LayoutDirection}.
         *
         * @return boolean Returns true if this Drawable will be automatically mirrored.
         */
        isAutoMirrored():boolean {
            return false;
        }

        /**
         * Return the opacity/transparency of this Drawable.  The returned value is
         * one of the abstract format constants in
         * {@link android.graphics.PixelFormat}:
         * {@link android.graphics.PixelFormat#UNKNOWN},
         * {@link android.graphics.PixelFormat#TRANSLUCENT},
         * {@link android.graphics.PixelFormat#TRANSPARENT}, or
         * {@link android.graphics.PixelFormat#OPAQUE}.
         *
         * <p>Generally a Drawable should be as conservative as possible with the
         * value it returns.  For example, if it contains multiple child drawables
         * and only shows one of them at a time, if only one of the children is
         * TRANSLUCENT and the others are OPAQUE then TRANSLUCENT should be
         * returned.  You can use the method {@link #resolveOpacity} to perform a
         * standard reduction of two opacities to the appropriate single output.
         *
         * <p>Note that the returned value does <em>not</em> take into account a
         * custom alpha or color filter that has been applied by the client through
         * the {@link #setAlpha} or {@link #setColorFilter} methods.
         *
         * @return int The opacity class of the Drawable.
         *
         * @see android.graphics.PixelFormat
         */
        //abstract
        getOpacity():number {
            return PixelFormat.TRANSLUCENT;
        }

        /**
         * Return the appropriate opacity value for two source opacities.  If
         * either is UNKNOWN, that is returned; else, if either is TRANSLUCENT,
         * that is returned; else, if either is TRANSPARENT, that is returned;
         * else, OPAQUE is returned.
         *
         * <p>This is to help in implementing {@link #getOpacity}.
         *
         * @param op1 One opacity value.
         * @param op2 Another opacity value.
         *
         * @return int The combined opacity value.
         *
         * @see #getOpacity
         */
        static resolveOpacity(op1:number, op2:number) {
            if (op1 == op2) {
                return op1;
            }
            if (op1 == PixelFormat.UNKNOWN || op2 == PixelFormat.UNKNOWN) {
                return PixelFormat.UNKNOWN;
            }
            if (op1 == PixelFormat.TRANSLUCENT || op2 == PixelFormat.TRANSLUCENT) {
                return PixelFormat.TRANSLUCENT;
            }
            if (op1 == PixelFormat.TRANSPARENT || op2 == PixelFormat.TRANSPARENT) {
                return PixelFormat.TRANSPARENT;
            }
            return PixelFormat.OPAQUE;
        }

        /**
         * Override this in your subclass to change appearance if you recognize the
         * specified state.
         *
         * @return Returns true if the state change has caused the appearance of
         * the Drawable to change (that is, it needs to be drawn), else false
         * if it looks the same and there is no need to redraw it since its
         * last state.
         */
        protected onStateChange(state:Array<number>):boolean {
            return false;
        }

        /** Override this in your subclass to change appearance if you vary based
         *  on level.
         * @return Returns true if the level change has caused the appearance of
         * the Drawable to change (that is, it needs to be drawn), else false
         * if it looks the same and there is no need to redraw it since its
         * last level.
         */
        protected onLevelChange(level:number):boolean {
            return false;
        }

        /**
         * Override this in your subclass to change appearance if you recognize the
         * specified state.
         */
        protected onBoundsChange(bounds:Rect):void {
        }

        /**
         * Return the intrinsic width of the underlying drawable object.  Returns
         * -1 if it has no intrinsic width, such as with a solid color.
         */
        getIntrinsicWidth():number {
            return -1;
        }

        /**
         * Return the intrinsic height of the underlying drawable object. Returns
         * -1 if it has no intrinsic height, such as with a solid color.
         */
        getIntrinsicHeight():number {
            return -1;
        }

        /**
         * Returns the minimum width suggested by this Drawable. If a View uses this
         * Drawable as a background, it is suggested that the View use at least this
         * value for its width. (There will be some scenarios where this will not be
         * possible.) This value should INCLUDE any padding.
         *
         * @return The minimum width suggested by this Drawable. If this Drawable
         *         doesn't have a suggested minimum width, 0 is returned.
         */
        getMinimumWidth() {
            let intrinsicWidth = this.getIntrinsicWidth();
            return intrinsicWidth > 0 ? intrinsicWidth : 0;
        }

        /**
         * Returns the minimum height suggested by this Drawable. If a View uses this
         * Drawable as a background, it is suggested that the View use at least this
         * value for its height. (There will be some scenarios where this will not be
         * possible.) This value should INCLUDE any padding.
         *
         * @return The minimum height suggested by this Drawable. If this Drawable
         *         doesn't have a suggested minimum height, 0 is returned.
         */
        getMinimumHeight() {
            let intrinsicHeight = this.getIntrinsicHeight();
            return intrinsicHeight > 0 ? intrinsicHeight : 0;
        }

        /**
         * Return in padding the insets suggested by this Drawable for placing
         * content inside the drawable's bounds. Positive values move toward the
         * center of the Drawable (set Rect.inset). Returns true if this drawable
         * actually has a padding, else false. When false is returned, the padding
         * is always set to 0.
         */
        getPadding(padding:Rect):boolean {
            padding.set(0, 0, 0, 0);
            return false;
        }

        /**
         * Make this drawable mutable. This operation cannot be reversed. A mutable
         * drawable is guaranteed to not share its state with any other drawable.
         * This is especially useful when you need to modify properties of drawables
         * loaded from resources. By default, all drawables instances loaded from
         * the same resource share a common state; if you modify the state of one
         * instance, all the other instances will receive the same modification.
         *
         * Calling this method on a mutable Drawable will have no effect.
         *
         * @return This drawable.
         * @see ConstantState
         * @see #getConstantState()
         */
        mutate(): Drawable {
            return this;
        }

        /**
         * Return a {@link ConstantState} instance that holds the shared state of this Drawable.
         *q
         * @return The ConstantState associated to that Drawable.
         * @see ConstantState
         * @see Drawable#mutate()
         */
        getConstantState():Drawable.ConstantState {
            return null;
        }

        /**
         * Create a drawable from an XML document. For more information on how to
         * create resources in XML, see
         * <a href="{@docRoot}guide/topics/resources/drawable-resource.html">Drawable Resources</a>.
         */
        static createFromXml(r:Resources, parser:HTMLElement):Drawable {
            let drawable:Drawable;
            let name = parser.tagName.toLowerCase();
            switch (name) {
                case "selector":
                    drawable = new StateListDrawable();
                    break;
                // case "animated-selector":
                //     drawable = new AnimatedStateListDrawable();
                //     break;
                // case "level-list":
                //     drawable = new LevelListDrawable();
                //     break;
                case "layer-list":
                    drawable = new LayerDrawable(null);
                    break;
                // case "transition":
                //     drawable = new TransitionDrawable();
                //     break;
                // case "ripple":
                //     drawable = new RippleDrawable();
                //     break;
                case "color":
                    drawable = new ColorDrawable();
                    break;
                // case "shape":
                //     drawable = new GradientDrawable();
                //     break;
                // case "vector":
                //     drawable = new VectorDrawable();
                //     break;
                // case "animated-vector":
                //     drawable = new AnimatedVectorDrawable();
                //     break;
                case "scale":
                    drawable = new ScaleDrawable();
                    break;
                case "clip":
                    drawable = new ClipDrawable();
                    break;
                case "rotate":
                    drawable = new RotateDrawable();
                    break;
                // case "animated-rotate":
                //     drawable = new AnimatedRotateDrawable();
                //     break;
                case "animation-list":
                    drawable = new AnimationDrawable();
                    break;
                case "inset":
                    drawable = new InsetDrawable(null, 0);
                    break;
                case "bitmap":
                    drawable = r.getDrawable(parser.getAttribute('src'));
                    break;
                // case "bitmap":
                //     drawable = new BitmapDrawable(r);
                //     if (r != null) {
                //         ((BitmapDrawable) drawable).setTargetDensity(r.getDisplayMetrics());
                //     }
                //     break;
                // case "nine-patch":
                //     drawable = new NinePatchDrawable();
                //     if (r != null) {
                //         ((NinePatchDrawable) drawable).setTargetDensity(r.getDisplayMetrics());
                //     }
                //     break;
                default:
                    throw Error("XmlPullParserException: invalid drawable tag " + name);

            }
            drawable.inflate(r, parser);
            return drawable;
        }

        inflate(r:Resources, parser:HTMLElement):void {
            this.mVisible = (parser.getAttribute('android:visible') !== 'false');
        }

    }

    export module Drawable{
        /**
         * Implement this interface if you want to create an animated drawable that
         * extends {@link android.graphics.drawable.Drawable Drawable}.
         * Upon retrieving a drawable, use
         * {@link Drawable#setCallback(android.graphics.drawable.Drawable.Callback)}
         * to supply your implementation of the interface to the drawable; it uses
         * this interface to schedule and execute animation changes.
         */
        export interface Callback{
            /**
             * Called when the drawable needs to be redrawn.  A view at this point
             * should invalidate itself (or at least the part of itself where the
             * drawable appears).
             *
             * @param who The drawable that is requesting the update.
             */
            invalidateDrawable(who : Drawable):void;
            /**
             * androidui add: when drawable size change, view's size may change
             */
            drawableSizeChange?(who : Drawable):void;
            /**
             * A Drawable can call this to schedule the next frame of its
             * animation.  An implementation can generally simply call
             * {@link android.os.Handler#postAtTime(Runnable, Object, long)} with
             * the parameters <var>(what, who, when)</var> to perform the
             * scheduling.
             *
             * @param who The drawable being scheduled.
             * @param what The action to execute.
             * @param when The time (in milliseconds) to run.  The timebase is
             *             {@link android.os.SystemClock#uptimeMillis}
             */
            scheduleDrawable(who : Drawable, what:Runnable, when:number):void;

            /**
             * A Drawable can call this to unschedule an action previously
             * scheduled with {@link #scheduleDrawable}.  An implementation can
             * generally simply call
             * {@link android.os.Handler#removeCallbacks(Runnable, Object)} with
             * the parameters <var>(what, who)</var> to unschedule the drawable.
             *
             * @param who The drawable being unscheduled.
             * @param what The action being unscheduled.
             */
            unscheduleDrawable(who: Drawable, what:Runnable):void;
        }

        /**
         * This abstract class is used by {@link Drawable}s to store shared constant state and data
         * between Drawables. {@link BitmapDrawable}s created from the same resource will for instance
         * share a unique bitmap stored in their ConstantState.
         *
         * <p>
         * {@link #newDrawable(Resources)} can be used as a factory to create new Drawable instances
         * from this ConstantState.
         * </p>
         *
         * Use {@link Drawable#getConstantState()} to retrieve the ConstantState of a Drawable. Calling
         * {@link Drawable#mutate()} on a Drawable should typically create a new ConstantState for that
         * Drawable.
         */
        export interface ConstantState{
            /**
             * Create a new drawable without supplying resources the caller
             * is running in.  Note that using this means the density-dependent
             * drawables (like bitmaps) will not be able to update their target
             * density correctly. One should use {@link #newDrawable(Resources)}
             * instead to provide a resource.
             */
            newDrawable():Drawable;
        }
    }

}

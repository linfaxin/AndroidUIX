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
///<reference path="DrawableContainer.ts"/>

module android.graphics.drawable{


    const DEBUG = android.util.Log.DBG_StateListDrawable;
    const TAG = "StateListDrawable";
    /**
     * To be proper, we should have a getter for dither (and alpha, etc.)
     * so that proxy classes like this can save/restore their delegates'
     * values, but we don't have getters. Since we do have setters
     * (e.g. setDither), which this proxy forwards on, we have to have some
     * default/initial setting.
     *
     * The initial setting for dither is now true, since it almost always seems
     * to improve the quality at negligible cost.
     */
    const DEFAULT_DITHER = true;

    /**
     * Lets you assign a number of graphic images to a single Drawable and swap out the visible item by a string
     * ID value.
     * <p/>
     * <p>It can be defined in an XML file with the <code>&lt;selector></code> element.
     * Each state Drawable is defined in a nested <code>&lt;item></code> element. For more
     * information, see the guide to <a
     * href="{@docRoot}guide/topics/resources/drawable-resource.html">Drawable Resources</a>.</p>
     *
     * @attr ref android.R.styleable#StateListDrawable_visible
     * @attr ref android.R.styleable#StateListDrawable_variablePadding
     * @attr ref android.R.styleable#StateListDrawable_constantSize
     * @attr ref android.R.styleable#DrawableStates_state_focused
     * @attr ref android.R.styleable#DrawableStates_state_window_focused
     * @attr ref android.R.styleable#DrawableStates_state_enabled
     * @attr ref android.R.styleable#DrawableStates_state_checkable
     * @attr ref android.R.styleable#DrawableStates_state_checked
     * @attr ref android.R.styleable#DrawableStates_state_selected
     * @attr ref android.R.styleable#DrawableStates_state_activated
     * @attr ref android.R.styleable#DrawableStates_state_active
     * @attr ref android.R.styleable#DrawableStates_state_single
     * @attr ref android.R.styleable#DrawableStates_state_first
     * @attr ref android.R.styleable#DrawableStates_state_middle
     * @attr ref android.R.styleable#DrawableStates_state_last
     * @attr ref android.R.styleable#DrawableStates_state_pressed
     */
    export class StateListDrawable extends DrawableContainer {
        private mStateListState:StateListState;

        constructor() {
            super();
            this.initWithState(null);
        }

        private initWithState(state:StateListState){
            let _as = new StateListState(state, this);
            this.mStateListState = _as;
            this.setConstantState(_as);
            this.onStateChange(this.getState());
        }
        /**
         * Add a new image/string ID to the set of images.
         *
         * @param stateSet - An array of resource Ids to associate with the image.
         *                 Switch to this image by calling setState().
         * @param drawable -The image to show.
         */
        addState(stateSet:Array<number>, drawable:Drawable) {
            if (drawable != null) {
                this.mStateListState.addStateSet(stateSet, drawable);
                // in case the new state matches our current state...
                this.onStateChange(this.getState());
            }
        }
        isStateful():boolean {
            return true;
        }
        protected onStateChange(stateSet:Array<number>):boolean {
            let idx = this.mStateListState.indexOfStateSet(stateSet);
            if (DEBUG) android.util.Log.i(TAG, "onStateChange " + this + " states "
                + stateSet + " found " + idx);
            if (idx < 0) {
                idx = this.mStateListState.indexOfStateSet(android.util.StateSet.WILD_CARD);
            }
            if (this.selectDrawable(idx)) {
                return true;
            }
            return super.onStateChange(stateSet);
        }

        inflate(r:android.content.res.Resources, parser:HTMLElement):void {
            super.inflate(r, parser);
            let a = r.obtainAttributes(parser);

            const state = this.mStateListState;
            //parse attribute
            state.mVariablePadding = a.getBoolean("android:variablePadding", state.mVariablePadding);
            state.mConstantSize = a.getBoolean("android:constantSize", state.mConstantSize);
            state.mEnterFadeDuration = a.getInt("android:enterFadeDuration", state.mEnterFadeDuration);
            state.mExitFadeDuration = a.getInt("android:exitFadeDuration", state.mExitFadeDuration);
            state.mDither = a.getBoolean("android:dither", state.mDither);
            state.mAutoMirrored = a.getBoolean("android:autoMirrored", state.mAutoMirrored);
            a.recycle();

            //parse children
            for(let child of Array.from(parser.children)){
                let item = <HTMLElement>child;
                if(item.tagName.toLowerCase() !== 'item'){
                    continue;
                }
                let dr:Drawable;
                let stateSpec:number[] = [];
                let typedArray = r.obtainAttributes(item);
                for(let attrName of typedArray.getLowerCaseAttrNames()) {
                    if(attrName === 'drawable'){
                        dr = typedArray.getDrawable(attrName);

                    }else if(attrName.startsWith('state_')){
                        let state = attrName.substring('state_'.length);
                        let stateValue = android.view.View['VIEW_STATE_' + state.toUpperCase()];
                        if(typeof stateValue === "number"){
                            stateSpec.push(typedArray.getBoolean(attrName, true) ? stateValue : -stateValue);
                        }
                    }
                }
                if(!dr && item.children[0] instanceof HTMLElement){
                    dr = Drawable.createFromXml(r, <HTMLElement>item.children[0]);
                }
                if(!dr){
                    throw new Error(": <item> tag requires a 'drawable' attribute or child tag defining a drawable");
                }
                state.addStateSet(stateSpec, dr);
            }

            this.onStateChange(this.getState());
        }

        private getStateListState():StateListState {
           return this.mStateListState;
        }
        /**
         * Gets the number of states contained in this drawable.
         *
         * @return The number of states contained in this drawable.
         * @hide pending API council
         * @see #getStateSet(int)
         * @see #getStateDrawable(int)
         */
        getStateCount():number {
            return this.mStateListState.getChildCount();
        }
        /**
         * Gets the state set at an index.
         *
         * @param index The index of the state set.
         * @return The state set at the index.
         * @hide pending API council
         * @see #getStateCount()
         * @see #getStateDrawable(int)
         */
        getStateSet(index:number):Array<number> {
            return this.mStateListState.mStateSets[index];
        }
        /**
         * Gets the drawable at an index.
         *
         * @param index The index of the drawable.
         * @return The drawable at the index.
         * @hide pending API council
         * @see #getStateCount()
         * @see #getStateSet(int)
         */
        getStateDrawable(index:number):Drawable {
            return this.mStateListState.getChild(index);
        }
        /**
         * Gets the index of the drawable with the provided state set.
         *
         * @param stateSet the state set to look up
         * @return the index of the provided state set, or -1 if not found
         * @hide pending API council
         * @see #getStateDrawable(int)
         * @see #getStateSet(int)
         */
        getStateDrawableIndex(stateSet:Array<number>):number {
            return this.mStateListState.indexOfStateSet(stateSet);
        }
        mutate():Drawable {
            if (!this.mMutated && super.mutate() == this) {
                const sets = this.mStateListState.mStateSets;
                const count = sets.length;
                this.mStateListState.mStateSets = new Array<Array<number>>(count);
                for (let i = 0; i < count; i++) {
                    const _set = sets[i];
                    if (_set != null) {
                        this.mStateListState.mStateSets[i] = _set.concat();
                    }
                }
                this.mMutated = true;
            }
            return this;
        }
    }

    class StateListState extends DrawableContainer.DrawableContainerState{
        mStateSets:Array<Array<number>>;
        constructor(orig:StateListState, owner:StateListDrawable){
            super(orig, owner);
            if (orig != null) {
                this.mStateSets = orig.mStateSets.concat();
            } else {
                this.mStateSets = new Array<Array<number>>(this.getCapacity());
            }
        }
        addStateSet(stateSet:Array<number>, drawable:Drawable) {
            let pos = this.addChild(drawable);
            this.mStateSets[pos] = stateSet;
            return pos;
        }
        indexOfStateSet(stateSet:Array<number>):number {
            const stateSets = this.mStateSets;
            const N = this.getChildCount();
            for (let i = 0; i < N; i++) {
                if (android.util.StateSet.stateSetMatches(stateSets[i], stateSet)) {
                    return i;
                }
            }
            return -1;
        }
        newDrawable():Drawable {
            let drawable = new StateListDrawable();
            (<any>drawable).initWithState(this);
            return drawable;
        }

    }
}
/**
 * Created by linfaxin on 15/11/2.
 */
///<reference path="DrawableContainer.ts"/>

module android.graphics.drawable{


    const DEBUG = android.util.Log.DBG_StateListDrawable;
    const TAG = "StateListDrawable";
    const DEFAULT_DITHER = true;
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
        onStateChange(stateSet:Array<number>):boolean {
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
        //getStateListState():StateListState {
        //    return this.mStateListState;
        //}
        getStateCount():number {
            return this.mStateListState.getChildCount();
        }
        getStateSet(index:number):Array<number> {
            return this.mStateListState.mStateSets[index];
        }
        getStateDrawable(index:number):Drawable {
            return this.mStateListState.getChild(index);
        }
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
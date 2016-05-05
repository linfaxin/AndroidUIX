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

///<reference path="../util/Log.ts"/>
///<reference path="../util/Pools.ts"/>
///<reference path="MotionEvent.ts"/>
///<reference path="KeyEvent.ts"/>

module android.view{
    import Log = android.util.Log;
    import Pools = android.util.Pools;
    import MotionEvent = android.view.MotionEvent;
    import KeyEvent = android.view.KeyEvent;
    /**
     * Helper for tracking the velocity of touch events, for implementing
     * flinging and other such gestures.
     *
     * Use {@link #obtain} to retrieve a new instance of the class when you are going
     * to begin tracking.  Put the motion events you receive into it with
     * {@link #addMovement(MotionEvent)}.  When you want to determine the velocity call
     * {@link #computeCurrentVelocity(int)} and then call {@link #getXVelocity(int)}
     * and {@link #getYVelocity(int)} to retrieve the velocity for each pointer id.
     */
    export class VelocityTracker{
        private static TAG = "VelocityTracker";
        private static DEBUG = Log.VelocityTracker_DBG;
        private static localLOGV = VelocityTracker.DEBUG;

        private static NUM_PAST = 10;
        private static MAX_AGE_MILLISECONDS = 200;

        private static POINTER_POOL_CAPACITY = 20;

        private static sPool = new Pools.SynchronizedPool<VelocityTracker>(2);

        private static sRecycledPointerListHead:Pointer;
        private static sRecycledPointerCount = 0;


        private mPointerListHead:Pointer;
        private mLastTouchIndex = 0;
        private mGeneration = 0;

        private mNext:VelocityTracker;

        /**
         * Retrieve a new VelocityTracker object to watch the velocity of a
         * motion.  Be sure to call {@link #recycle} when done.  You should
         * generally only maintain an active object while tracking a movement,
         * so that the VelocityTracker can be re-used elsewhere.
         *
         * @return Returns a new VelocityTracker.
         */
        static obtain():VelocityTracker {
            let instance = VelocityTracker.sPool.acquire();
            return (instance != null) ? instance : new VelocityTracker();
        }
        /**
         * Return a VelocityTracker object back to be re-used by others.  You must
         * not touch the object after calling this function.
         */
        recycle() {
            this.clear();
            VelocityTracker.sPool.release(this);
        }
        setNextPoolable(element:VelocityTracker) {
            this.mNext = element;
        }
        getNextPoolable():VelocityTracker {
            return this.mNext;
        }
        constructor(){
            this.clear();
        }

        /**
         * Reset the velocity tracker back to its initial state.
         */
        clear() {
            VelocityTracker.releasePointerList(this.mPointerListHead);

            this.mPointerListHead = null;
            this.mLastTouchIndex = 0;
        }

        /**
         * Add a user's movement to the tracker.  You should call this for the
         * initial {@link MotionEvent#ACTION_DOWN}, the following
         * {@link MotionEvent#ACTION_MOVE} events that you receive, and the
         * final {@link MotionEvent#ACTION_UP}.  You can, however, call this
         * for whichever events you desire.
         *
         * @param ev The MotionEvent you received and would like to track.
         */
        addMovement(ev:MotionEvent) {
            let historySize = ev.getHistorySize();
            const pointerCount = ev.getPointerCount();
            const lastTouchIndex = this.mLastTouchIndex;
            const nextTouchIndex = (lastTouchIndex + 1) % VelocityTracker.NUM_PAST;
            const finalTouchIndex = (nextTouchIndex + historySize) % VelocityTracker.NUM_PAST;
            const generation = this.mGeneration++;

            this.mLastTouchIndex = finalTouchIndex;

            // Update pointer data.
            let previousPointer:Pointer = null;
            for (let i = 0; i < pointerCount; i++){
                const pointerId = ev.getPointerId(i);

                // Find the pointer data for this pointer id.
                // This loop is optimized for the common case where pointer ids in the event
                // are in sorted order.  However, we check for this case explicitly and
                // perform a full linear scan from the start if needed.
                let nextPointer:Pointer;
                if (previousPointer == null || pointerId < previousPointer.id) {
                    previousPointer = null;
                    nextPointer = this.mPointerListHead;
                } else {
                    nextPointer = previousPointer.next;
                }

                let pointer:Pointer;
                for (;;) {
                    if (nextPointer != null) {
                        const nextPointerId = nextPointer.id;
                        if (nextPointerId == pointerId) {
                            pointer = nextPointer;
                            break;
                        }
                        if (nextPointerId < pointerId) {
                            nextPointer = nextPointer.next;
                            continue;
                        }
                    }

                    // Pointer went down.  Add it to the list.
                    // Write a sentinel at the end of the pastTime trace so we will be able to
                    // tell when the trace started.
                    pointer = VelocityTracker.obtainPointer();
                    pointer.id = pointerId;
                    pointer.pastTime[lastTouchIndex] = Number.MIN_VALUE;
                    pointer.next = nextPointer;
                    if (previousPointer == null) {
                        this.mPointerListHead = pointer;
                    } else {
                        previousPointer.next = pointer;
                    }
                    break;
                }

                pointer.generation = generation;
                previousPointer = pointer;

                const pastX = pointer.pastX;
                const pastY = pointer.pastY;
                const pastTime = pointer.pastTime;

                historySize = ev.getHistorySize(pointerId);
                for (let j = 0; j < historySize; j++) {
                    const touchIndex = (nextTouchIndex + j) % VelocityTracker.NUM_PAST;
                    pastX[touchIndex] = ev.getHistoricalX(i, j);
                    pastY[touchIndex] = ev.getHistoricalY(i, j);
                    pastTime[touchIndex] = ev.getHistoricalEventTime(i, j);
                }
                pastX[finalTouchIndex] = ev.getX(i);
                pastY[finalTouchIndex] = ev.getY(i);
                pastTime[finalTouchIndex] = ev.getEventTime();
            }

            // Find removed pointers.
            previousPointer = null;
            for (let pointer = this.mPointerListHead; pointer != null; ) {
                const nextPointer = pointer.next;
                if (pointer.generation != generation) {
                    // Pointer went up.  Remove it from the list.
                    if (previousPointer == null) {
                        this.mPointerListHead = nextPointer;
                    } else {
                        previousPointer.next = nextPointer;
                    }
                    VelocityTracker.releasePointer(pointer);
                } else {
                    previousPointer = pointer;
                }
                pointer = nextPointer;
            }
        }
        /**
         * Compute the current velocity based on the points that have been
         * collected.  Only call this when you actually want to retrieve velocity
         * information, as it is relatively expensive.  You can then retrieve
         * the velocity with {@link #getXVelocity()} and
         * {@link #getYVelocity()}.
         *
         * @param units The units you would like the velocity in.  A value of 1
         * provides pixels per millisecond, 1000 provides pixels per second, etc.
         * @param maxVelocity The maximum velocity that can be computed by this method.
         * This value must be declared in the same unit as the units parameter. This value
         * must be positive.
         */
        computeCurrentVelocity(units:number, maxVelocity=Number.MAX_SAFE_INTEGER) {
            const lastTouchIndex = this.mLastTouchIndex;

            for (let pointer = this.mPointerListHead; pointer != null; pointer = pointer.next) {
                const pastTime = pointer.pastTime;

                // Search backwards in time for oldest acceptable time.
                // Stop at the beginning of the trace as indicated by the sentinel time Long.MIN_VALUE.
                let oldestTouchIndex = lastTouchIndex;
                let numTouches = 1;
                const minTime = pastTime[lastTouchIndex] - VelocityTracker.MAX_AGE_MILLISECONDS;
                while (numTouches < VelocityTracker.NUM_PAST) {
                    const nextOldestTouchIndex = (oldestTouchIndex + VelocityTracker.NUM_PAST - 1) % VelocityTracker.NUM_PAST;
                    const nextOldestTime = pastTime[nextOldestTouchIndex];
                    if (nextOldestTime < minTime) { // also handles end of trace sentinel
                        break;
                    }
                    oldestTouchIndex = nextOldestTouchIndex;
                    numTouches += 1;
                }

                // If we have a lot of samples, skip the last received sample since it is
                // probably pretty noisy compared to the sum of all of the traces already acquired.
                if (numTouches > 3) {
                    numTouches -= 1;
                }

                // Kind-of stupid.
                const pastX = pointer.pastX;
                const pastY = pointer.pastY;

                const oldestX = pastX[oldestTouchIndex];
                const oldestY = pastY[oldestTouchIndex];
                const oldestTime = pastTime[oldestTouchIndex];

                let accumX = 0;
                let accumY = 0;

                for (let i = 1; i < numTouches; i++) {
                    const touchIndex = (oldestTouchIndex + i) % VelocityTracker.NUM_PAST;
                    const duration = (pastTime[touchIndex] - oldestTime);

                    if (duration == 0) continue;

                    let delta = pastX[touchIndex] - oldestX;
                    let velocity = (delta / duration) * units; // pixels/frame.
                    accumX = (accumX == 0) ? velocity : (accumX + velocity) * .5;

                    delta = pastY[touchIndex] - oldestY;
                    velocity = (delta / duration) * units; // pixels/frame.
                    accumY = (accumY == 0) ? velocity : (accumY + velocity) * .5;
                }

                if (accumX < -maxVelocity) {
                    accumX = - maxVelocity;
                } else if (accumX > maxVelocity) {
                    accumX = maxVelocity;
                }

                if (accumY < -maxVelocity) {
                    accumY = - maxVelocity;
                } else if (accumY > maxVelocity) {
                    accumY = maxVelocity;
                }

                pointer.xVelocity = accumX;
                pointer.yVelocity = accumY;

                if (VelocityTracker.localLOGV) {
                    Log.v(VelocityTracker.TAG, "Pointer " + pointer.id
                        + ": Y velocity=" + accumX +" X velocity=" + accumY + " N=" + numTouches);
                }
            }
        }
        /**
         * Retrieve the last computed X velocity.  You must first call
         * {@link #computeCurrentVelocity(int)} before calling this function.
         *
         * @param id Which pointer's velocity to return.
         * @return The previously computed X velocity.
         */
        getXVelocity(id=0):number {
            let pointer = this.getPointer(id);
            return pointer != null ? pointer.xVelocity : 0;
        }
        /**
         * Retrieve the last computed Y velocity.  You must first call
         * {@link #computeCurrentVelocity(int)} before calling this function.
         *
         * @param id Which pointer's velocity to return.
         * @return The previously computed Y velocity.
         */
        getYVelocity(id=0):number {
            let pointer = this.getPointer(id);
            return pointer != null ? pointer.yVelocity : 0;
        }
        private getPointer(id:number):Pointer {
            for (let pointer = this.mPointerListHead; pointer != null; pointer = pointer.next) {
                if (pointer.id == id) {
                    return pointer;
                }
            }
            return null;
        }
        private static obtainPointer():Pointer {
            if (VelocityTracker.sRecycledPointerCount != 0) {
                let element = VelocityTracker.sRecycledPointerListHead;
                VelocityTracker.sRecycledPointerCount -= 1;
                VelocityTracker.sRecycledPointerListHead = element.next;
                element.next = null;
                return element;
            }
            return new Pointer();
        }

        private static releasePointer(pointer:Pointer) {
            if (VelocityTracker.sRecycledPointerCount < VelocityTracker.POINTER_POOL_CAPACITY) {
                pointer.next = VelocityTracker.sRecycledPointerListHead;
                VelocityTracker.sRecycledPointerCount += 1;
                VelocityTracker.sRecycledPointerListHead = pointer;
            }
        }

        private static releasePointerList(pointer:Pointer) {
            if (pointer != null) {
                let count = VelocityTracker.sRecycledPointerCount;
                if (count >= VelocityTracker.POINTER_POOL_CAPACITY) {
                    return;
                }

                let tail = pointer;
                for (;;) {
                    count += 1;
                    if (count >= VelocityTracker.POINTER_POOL_CAPACITY) {
                        break;
                    }

                    let next = tail.next;
                    if (next == null) {
                        break;
                    }
                    tail = next;
                }

                tail.next = VelocityTracker.sRecycledPointerListHead;
                VelocityTracker.sRecycledPointerCount = count;
                VelocityTracker.sRecycledPointerListHead = pointer;
            }
        }


    }

    class Pointer {
        next:Pointer;

        id=0;
        xVelocity=0;
        yVelocity=0;

        pastX = androidui.util.ArrayCreator.newNumberArray((<any>VelocityTracker).NUM_PAST);
        pastY = androidui.util.ArrayCreator.newNumberArray((<any>VelocityTracker).NUM_PAST);
        pastTime = androidui.util.ArrayCreator.newNumberArray((<any>VelocityTracker).NUM_PAST);// uses Long.MIN_VALUE as a sentinel

        generation = 0;
    }
}
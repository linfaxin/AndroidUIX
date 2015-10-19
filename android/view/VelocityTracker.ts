/**
 * Created by linfaxin on 15/10/17.
 */
///<reference path="../util/Log.ts"/>
///<reference path="../util/Pools.ts"/>
///<reference path="MotionEvent.ts"/>

module android.view{
    import Log = android.util.Log;
    import Pools = android.util.Pools;
    import MotionEvent = android.view.MotionEvent;

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

        static obtain():VelocityTracker {
            let instance = VelocityTracker.sPool.acquire();
            return (instance != null) ? instance : new VelocityTracker();
        }
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

        clear() {
            VelocityTracker.releasePointerList(this.mPointerListHead);

            this.mPointerListHead = null;
            this.mLastTouchIndex = 0;
        }

        addMovement(ev:MotionEvent) {
            const historySize = ev.getHistorySize();
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

                for (let j = 0; j < historySize; j++) {
                    const touchIndex = (nextTouchIndex + j) % VelocityTracker.NUM_PAST;
                    pastX[touchIndex] = ev.getHistoricalX(i, j);
                    pastY[touchIndex] = ev.getHistoricalY(i, j);
                    pastTime[touchIndex] = ev.getHistoricalEventTime(j);
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
        getXVelocity(id=0):number {
            let pointer = this.getPointer(id);
            return pointer != null ? pointer.xVelocity : 0;
        }
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

        pastX = new Array<number>((<any>VelocityTracker).NUM_PAST);
        pastY = new Array<number>((<any>VelocityTracker).NUM_PAST);
        pastTime = new Array<number>((<any>VelocityTracker).NUM_PAST);// uses Long.MIN_VALUE as a sentinel

        generation = 0;
    }
}
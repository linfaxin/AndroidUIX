/**
 * Created by linfaxin on 15/10/5.
 */
module android.util {

    export class Pools {
        a : Pools.SimplePool<string>;
    }

    export module Pools {
        export interface Pool<T> {
            acquire() : T;
            release(instance:T) : boolean;
        }

        export class SimplePool<T> implements Pools.Pool<T> {
            mPool:Array<T>;
            mPoolSize:number = 0;

            constructor(maxPoolSize:number) {
                if (maxPoolSize <= 0) {
                    throw new Error("The max pool size must be > 0");
                }
                this.mPool = new Array<T>(maxPoolSize);
            }

            acquire():T {
                if (this.mPoolSize > 0) {
                    const lastPooledIndex = this.mPoolSize - 1;
                    let instance:T = this.mPool[lastPooledIndex];
                    this.mPool[lastPooledIndex] = null;
                    this.mPoolSize--;
                    return instance;
                }
                return null;
            }

            release(instance:T):boolean {
                if (this.isInPool(instance)) {
                    throw new Error("Already in the pool!");
                }
                if (this.mPoolSize < this.mPool.length) {
                    this.mPool[this.mPoolSize] = instance;
                    this.mPoolSize++;
                    return true;
                }
                return false;
            }

            private isInPool(instance:T):boolean {
                for (let i = 0; i < this.mPoolSize; i++) {
                    if (this.mPool[i] == instance) {
                        return true;
                    }
                }
                return false;
            }
        }

        export class SynchronizedPool<T> extends SimplePool<T>{
            //no need to impl Synchronized
        }
    }
}
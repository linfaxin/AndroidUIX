/*
 * Copyright (C) 2009 The Android Open Source Project
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

module android.util {

    /**
     * Helper class for crating pools of objects. An example use looks like this:
     * <pre>
     * public class MyPooledClass {
     *
     *     private static final SynchronizedPool<MyPooledClass> sPool =
     *             new SynchronizedPool<MyPooledClass>(10);
     *
     *     public static MyPooledClass obtain() {
     *         MyPooledClass instance = sPool.acquire();
     *         return (instance != null) ? instance : new MyPooledClass();
     *     }
     *
     *     public void recycle() {
     *          // Clear state if needed.
     *          sPool.release(this);
     *     }
     *
     *     . . .
     * }
     * </pre>
     *
     * @hide
     */
    export class Pools {
        a : Pools.SimplePool<string>;
    }

    export module Pools {

        /**
         * Interface for managing a pool of objects.
         *
         * @param <T> The pooled type.
         */
        export interface Pool<T> {

            /**
             * @return An instance from the pool if such, null otherwise.
             */
            acquire() : T;

            /**
             * Release an instance to the pool.
             *
             * @param instance The instance to release.
             * @return Whether the instance was put in the pool.
             *
             * @throws IllegalStateException If the instance is already in the pool.
             */
            release(instance:T) : boolean;
        }

        /**
         * Simple (non-synchronized) pool of objects.
         *
         * @param <T> The pooled type.
         */
        export class SimplePool<T> implements Pools.Pool<T> {
            mPool:Array<T>;
            mPoolSize:number = 0;

            /**
             * Creates a new instance.
             *
             * @param maxPoolSize The max pool size.
             *
             * @throws IllegalArgumentException If the max pool size is less than zero.
             */
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

        /**
         * Synchronized) pool of objects.
         *
         * @param <T> The pooled type.
         */
        export class SynchronizedPool<T> extends SimplePool<T>{
            //no need to impl Synchronized
        }
    }
}
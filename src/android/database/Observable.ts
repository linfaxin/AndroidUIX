/*
 * Copyright (C) 2007 The Android Open Source Project
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

///<reference path="../../java/util/ArrayList.ts"/>

module android.database{
    import ArrayList = java.util.ArrayList;

    /**
     * Provides methods for registering or unregistering arbitrary observers in an {@link ArrayList}.
     *
     * This abstract class is intended to be subclassed and specialized to maintain
     * a registry of observers of specific types and dispatch notifications to them.
     *
     * @param T The observer type.
     */
    export abstract class Observable<T>{
        /**
         * The list of observers.  An observer can be in the list at most
         * once and will never be null.
         */
        protected mObservers = new ArrayList<T>()

        /**
         * Adds an observer to the list. The observer cannot be null and it must not already
         * be registered.
         * @param observer the observer to register
         * @throws IllegalArgumentException the observer is null
         * @throws IllegalStateException the observer is already registered
         */
        registerObserver(observer:T):void {
            if (observer == null) {
                throw new Error("The observer is null.");
            }
            if (this.mObservers.contains(observer)) {
                throw new Error("Observer " + observer + " is already registered.");
            }
            this.mObservers.add(observer);
        }

        /**
         * Removes a previously registered observer. The observer must not be null and it
         * must already have been registered.
         * @param observer the observer to unregister
         * @throws IllegalArgumentException the observer is null
         * @throws IllegalStateException the observer is not yet registered
         */
        unregisterObserver(observer:T) {
            if (observer == null) {
                throw new Error("The observer is null.");
            }
            let index = this.mObservers.indexOf(observer);
            if (index == -1) {
                throw new Error("Observer " + observer + " was not registered.");
            }
            this.mObservers.remove(index);
        }

        /**
         * Remove all registered observers.
         */
        unregisterAll():void {
            this.mObservers.clear();
        }
    }
}
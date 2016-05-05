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

///<reference path="Observable.ts"/>
///<reference path="DataSetObserver.ts"/>
///<reference path="../../java/util/ArrayList.ts"/>

module android.database{
    import ArrayList = java.util.ArrayList;
    import Observable = android.database.Observable;
    import DataSetObserver = android.database.DataSetObserver;

    /**
     * A specialization of {@link Observable} for {@link DataSetObserver}
     * that provides methods for sending notifications to a list of
     * {@link DataSetObserver} objects.
     */
    export class DataSetObservable extends Observable<DataSetObserver>{
        /**
         * Invokes {@link DataSetObserver#onChanged} on each observer.
         * Called when the contents of the data set have changed.  The recipient
         * will obtain the new contents the next time it queries the data set.
         */
        notifyChanged():void {
            // to avoid such problems, just march thru the list in the reverse order.
            for (let i = this.mObservers.size() - 1; i >= 0; i--) {
                this.mObservers.get(i).onChanged();
            }
        }
        /**
         * Invokes {@link DataSetObserver#onInvalidated} on each observer.
         * Called when the data set is no longer valid and cannot be queried again,
         * such as when the data set has been closed.
         */
        notifyInvalidated():void {
            for (let i = this.mObservers.size() - 1; i >= 0; i--) {
                this.mObservers.get(i).onInvalidated();
            }
        }
    }
}
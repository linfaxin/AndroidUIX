/**
 * Created by linfaxin on 15/11/5.
 */
///<reference path="Observable.ts"/>
///<reference path="DataSetObserver.ts"/>
///<reference path="../../java/util/ArrayList.ts"/>

module android.database{
    import ArrayList = java.util.ArrayList;
    import Observable = android.database.Observable;
    import DataSetObserver = android.database.DataSetObserver;

    export class DataSetObservable extends Observable<DataSetObserver>{
        notifyChanged():void {
            for (let i = this.mObservers.size() - 1; i >= 0; i--) {
                this.mObservers.get(i).onChanged();
            }
        }
        notifyInvalidated():void {
            for (let i = this.mObservers.size() - 1; i >= 0; i--) {
                this.mObservers.get(i).onInvalidated();
            }
        }
    }
}
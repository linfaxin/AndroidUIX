/**
 * Created by linfaxin on 15/11/5.
 */
///<reference path="../../java/util/ArrayList.ts"/>

module android.database{
    import ArrayList = java.util.ArrayList;

    export abstract
    class Observable<T>{
        mObservers = new ArrayList<T>()
        registerObserver(observer:T):void {
            if (observer == null) {
                throw new Error("The observer is null.");
            }
            if (this.mObservers.contains(observer)) {
                throw new Error("Observer " + observer + " is already registered.");
            }
            this.mObservers.add(observer);
        }
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

        unregisterAll():void {
            this.mObservers.clear();
        }
    }
}
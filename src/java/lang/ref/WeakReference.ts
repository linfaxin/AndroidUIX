module java.lang.ref {
    //TODO may not weak
    export class WeakReference<T> {
        weakMap:WeakMap<any, T>;

        constructor(referent:T) {
            this.weakMap = new WeakMap();
            this.weakMap.set(this, referent);
        }

        get():T {
            return this.weakMap.get(this);
        }

        set(value:T) {
            this.weakMap.set(this, value);
        }

        clear() {
            this.weakMap.delete(this);
        }
    }
}

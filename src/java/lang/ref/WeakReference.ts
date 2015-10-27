module java.lang.ref {
    const key = "referent";
    export class WeakReference<T> {
        weakMap:WeakMap<string, T>;

        constructor(referent:T) {
            this.weakMap = new WeakMap();
            this.weakMap.set(key, referent);
        }

        get():T {
            return this.weakMap.get(key);
        }

        set(value:T) {
            this.weakMap.set(key, value);
        }

        clear() {
            this.weakMap.delete(key);
        }
    }
}

/**
 * Created by linfaxin on 15/10/3.
 */
module android.util {

    export class SparseArray<T> {
        map:Map<number, T>;

        constructor(initialCapacity?:number) {
            this.map = new Map();
        }

        clone():SparseArray<T> {
            let clone = new SparseArray<T>();
            clone.map = new Map(this.map);
            return clone;
        }

        get(key:number, valueIfKeyNotFound:T) {
            return this.map.get(key) || valueIfKeyNotFound;
        }

        delete(key:number) {
            this.map.delete(key);
        }

        remove(key:number) {
            this.delete(key);
        }

        removeAt(index:number) {
            this.removeAtRange(index);
        }

        removeAtRange(index:number, size = 1) {
            let keys = [...this.map.keys()];
            let end = Math.min(this.map.size, index + size);
            for (let i = index; i < end; i++) {
                this.map.delete(keys[i]);
            }
        }

        put(key:number, value:T) {
            this.map.set(key, value);
        }

        size():number {
            return this.map.size;
        }

        keyAt(index:number):number {
            return [...this.map.keys()][index];
        }

        valueAt(index:number):T {
            return [...this.map.values()][index];
        }

        setValueAt(index:number, value:T) {
            let key = this.keyAt(index);
            this.map.set(key, value);
        }

        indexOfKey(key:number):number {
            return [...this.map.keys()].indexOf(key);
        }

        indexOfValue(value:T):number {
            return [...this.map.values()].indexOf(value);
        }

        clear() {
            this.map.clear();
        }

        append(key, value) {
            this.put(key, value);
        }
    }
}
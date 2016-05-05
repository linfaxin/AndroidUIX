/**
 * Created by linfaxin on 15/10/3.
 * AndroidUI's impl.
 */
module android.util {

    //AndroidUI only.
    export class SparseMap<K, T> {
        map:Map<K, T>;

        constructor(initialCapacity?:number) {
            this.map = new Map();
        }

        clone():SparseMap<K ,T> {
            let clone = new SparseMap<K, T>();
            clone.map = new Map(this.map);
            return clone;
        }

        get(key:K, valueIfKeyNotFound:T=null) {
            let value = this.map.get(key);
            if(value===undefined) return valueIfKeyNotFound;
            return  value;
        }

        delete(key:K) {
            this.map.delete(key);
        }

        remove(key:K) {
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

        put(key:K, value:T) {
            this.map.set(key, value);
        }

        size():number {
            return this.map.size;
        }

        keyAt(index:number):K {
            return [...this.map.keys()][index];
        }

        valueAt(index:number):T {
            return [...this.map.values()][index];
        }

        setValueAt(index:number, value:T) {
            let key = this.keyAt(index);
            this.map.set(key, value);
        }

        indexOfKey(key:K):number {
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
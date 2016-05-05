/**
 * Created by linfaxin on 15/12/12.
 * AndroidUI's impl.
 */
module android.util{
    export class ArrayMap<K, V>{
        private map = new Map<K, V>();

        constructor(capacity?:number){
        }
        clear() {
            this.map.clear();
        }
        erase() {
            this.map.clear();
        }


        ensureCapacity(minimumCapacity:number):void  {
            //do nothing
        }

        containsKey(key:K):boolean  {
            return this.map.has(key);
        }


        indexOfValue(value:V):number  {
            return [...this.map.values()].indexOf(value);
        }

        containsValue(value:V):boolean  {
            return this.indexOfValue(value) >= 0;
        }
        get(key:K):V {
            return this.map.get(key);
        }

        keyAt(index:number):K  {
            return [...this.map.keys()][index];
        }

        valueAt(index:number):V  {
            return [...this.map.values()][index];
        }

        setValueAt(index:number, value:V):V  {
            let key = this.keyAt(index);
            if(key==null) throw Error('index error');
            let oldV = this.get(key);
            this.map.set(key, value);
            return oldV;
        }

        isEmpty():boolean {
            return this.map.size <= 0;
        }

        put(key:K, value:V):V  {
            let oldV = this.get(key);
            this.map.set(key, value);
            return oldV;
        }

        append(key:K, value:V):void  {
            this.map.set(key, value);
        }

        remove(key:K):V  {
            let oldV = this.get(key);
            this.map.delete(key);
            return oldV;
        }

        removeAt(index:number):V  {
            let key = this.keyAt(index);
            if(key==null) throw Error('index error');
            let oldV = this.get(key);
            this.map.delete(key);
            return oldV;
        }

        keySet():Set<K>  {
            return new Set(this.map.keys());
        }
        size() {
            return this.map.size;
        }


    }
}
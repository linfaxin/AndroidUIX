/**
 * Created by linfaxin on 15/10/6.
 */
module android.util {

    class Access<T>{
        mData:Array<T>;
        mSize:number;

        get(index:number):T {
            return this.mData[index];
        }

        size():number {
            return this.mSize;
        }

    }
    export class CopyOnWriteArray<T> {
        private mData:Array<T> = [];
        private mDataCopy:Array<T>;
        private mAccess = new Access<T>();

        private mStart:boolean;

        private getArray():Array<T> {
            if (this.mStart) {
                if (this.mDataCopy == null) this.mDataCopy = [...this.mData];
                return this.mDataCopy;
            }
            return this.mData;
        }

        start():Array<T> {
            if (this.mStart) throw new Error("Iteration already started");
            this.mStart = true;
            this.mDataCopy = null;
            this.mAccess.mData = this.mData;
            this.mAccess.mSize = this.mData.length;

            return this.mAccess.mData;
        }
        end() {
            if (!this.mStart) throw new Error("Iteration not started");
            this.mStart = false;
            if (this.mDataCopy != null) {
                this.mData = this.mDataCopy;
                this.mAccess.mData = [];
                this.mAccess.mSize = 0;
            }
            this.mDataCopy = null;
        }

        //[Symbol.iterator](){
        //    return this.start()[Symbol.iterator]();
        //}

        size():number {
            return this.getArray().length;
        }
        add(...items: T[]) {
            this.getArray().push(...items);
        }
        addAll(array:CopyOnWriteArray<T>) {
            this.getArray().push(...array.mData);
        }
        remove(item:T ) {
            this.getArray().splice(this.getArray().indexOf(item), 1);
        }

    }
}
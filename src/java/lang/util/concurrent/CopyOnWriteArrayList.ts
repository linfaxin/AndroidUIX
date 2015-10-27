/**
 * Created by linfaxin on 15/10/6.
 */
module java.lang.util.concurrent {

    export class CopyOnWriteArrayList<T> {
        private mData:Array<T> = [];
        private isDataNew = true;

        iterator(){
            this.isDataNew = false;
            return this.mData;
        }

        [Symbol.iterator](){
            this.isDataNew = false;
            return this.mData[Symbol.iterator]();
        }

        private checkNewData(){
            if(!this.isDataNew){
                this.isDataNew = true;
                this.mData = [...this.mData];
            }
        }

        size():number {
            return this.mData.length;
        }
        add(...items: T[]) {
            this.checkNewData();
            this.mData.push(...items);
        }
        addAll(array:CopyOnWriteArrayList<T>) {
            this.checkNewData();
            this.mData.push(...array.mData);
        }
        remove(item:T ) {
            this.checkNewData();
            this.mData.splice(this.mData.indexOf(item), 1);
        }

    }
}
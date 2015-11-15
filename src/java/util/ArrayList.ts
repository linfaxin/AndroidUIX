/**
 * Created by linfaxin on 15/10/28.
 */
///<reference path="List.ts"/>

module java.util{
    export class ArrayList<T> implements List<T>{
        array : Array<T> = [];

        constructor(initialCapacity=0) {
        }

        size():number{
            return this.array.length;
        }
        isEmpty():boolean {
            return this.size() === 0;
        }
        contains(o:T) {
            return this.indexOf(o) >= 0;
        }
        indexOf(o:T) {
            return this.array.indexOf(o);
        }
        lastIndexOf(o:T) {
            return this.array.lastIndexOf(o);
        }
        clone():ArrayList<T> {
            let arrayList = new ArrayList<T>();
            arrayList.array.push(...this.array);
            return arrayList;
        }
        toArray(a=new Array<T>(this.size())):Array<T>{
            let size = this.size();
            for (let i = 0; i < size; i++) {
                a[i] = this.array[i];

            }
            return a;
        }
        get(index:number):T {
            return this.array[index];
        }
        set(index:number, element:T):T {
            let old = this.array[index];
            this.array[index] = element;
            return old;
        }

        add(t:T);
        add(index:number, t:T);
        add(...args){
            let index:number, t:T;
            if(args.length===1) t=args[0];
            else if(args.length===2){
                index = args[0];
                t = args[1];
            }
            if(index===undefined) this.array.push(t);
            else this.array.splice(index, 0, t);
        }

        remove(o:number|T) {
            let index : number;
            if(Number.isInteger(<number>o)){
                index = <number>o;
            }else{
                index = this.array.indexOf(<T>o);
            }
            let old = this.array[index];
            this.array.splice(index, 1);
            return old;
        }
        clear() {
            this.array = [];
        }
        addAll(list:ArrayList<T>);
        addAll(index:number, list:ArrayList<T>);
        addAll(...args){
            let index:number, list:ArrayList<T>;
            if(args.length===1){
                list = args[0];
            }else if(args.length===2){
                index = args[0];
                list = args[1];
            }
            if(index===undefined){
                this.array.push(...list.array);
            }else{
                this.array.splice(index, 0, ...list.array);
            }
        }
        removeAll(list:ArrayList<T>):boolean{
            let oldSize = this.size();
            list.array.forEach((item)=>{
                let index = this.array.indexOf(item);
                this.array.splice(index, 1);
            });
            return this.size()===oldSize;
        }

        [Symbol.iterator](){
            return this.array[Symbol.iterator];
        }

        subList(fromIndex:number, toIndex:number):ArrayList<T> {
            let list = new ArrayList<T>();
            for (var i = fromIndex; i < toIndex; i++) {
                list.array.push(this.array[i]);
            }
            return list;
        }

        toString(){
            return this.array.toString();
        }

        sort(compareFn?: (a: T, b: T) => number){
            this.array.sort(compareFn);
        }
    }
}
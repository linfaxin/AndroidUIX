/**
 * Created by linfaxin on 15/10/28.
 */
module java.util{
    export interface List<T>{
        size():number;
        isEmpty():boolean;
        contains(o:T);
        indexOf(o:T);
        lastIndexOf(o:T);
        clone():List<T>;
        toArray(a:Array<T>):Array<T>;
        getArray():Array<T>;
        get(index:number):T;
        set(index:number, element:T):T;

        add(t:T);
        add(index:number, t:T);

        remove(o:number|T);
        clear();
        addAll(list:List<T>);
        addAll(index:number, list:List<T>);
        removeAll(list:List<T>):boolean;

        subList(fromIndex:number, toIndex:number):List<T>;

        sort(compareFn?: (a: T, b: T) => number);
    }
}
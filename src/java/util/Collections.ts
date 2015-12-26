/**
 * Created by linfaxin on 15/11/28.
 */
///<reference path="List.ts"/>
///<reference path="ArrayList.ts"/>
///<reference path="Comparator.ts"/>
///<reference path="../lang/Comparable.ts"/>



module java.util{
    import Comparable = java.lang.Comparable;

    export class Collections{

        private static EMPTY_LIST = new ArrayList();
        static emptyList():List<any> {
            return Collections.EMPTY_LIST;
        }

        static sort<T>(list:List<T>, c?:Comparator<T>){
            if(c) {
                list.sort((t1, t2):number=> {
                    return c.compare(t1, t2);
                });
            }else {
                list.sort((t1, t2):number=> {
                    if(Comparable.isImpl(t1) && Comparable.isImpl(t2)){
                        return (<Comparable<any>><any>t1).compareTo(t2);
                    }
                    return 0;
                });
            }
        }
    }
}
/**
 * Created by linfaxin on 15/12/6.
 */
///<reference path="List.ts"/>
///<reference path="ArrayList.ts"/>

module java.util {
    export class Arrays {

        /**
         * Sorts the specified range of the array into ascending order. The range
         * to be sorted extends from the index {@code fromIndex}, inclusive, to
         * the index {@code toIndex}, exclusive. If {@code fromIndex == toIndex},
         * the range to be sorted is empty.
         *
         * <p>Implementation note: The sorting algorithm is a Dual-Pivot Quicksort
         * by Vladimir Yaroslavskiy, Jon Bentley, and Joshua Bloch. This algorithm
         * offers O(n log(n)) performance on many data sets that cause other
         * quicksorts to degrade to quadratic performance, and is typically
         * faster than traditional (one-pivot) Quicksort implementations.
         *
         * @param a the array to be sorted
         * @param fromIndex the index of the first element, inclusive, to be sorted
         * @param toIndex the index of the last element, exclusive, to be sorted
         *
         * @throws IllegalArgumentException if {@code fromIndex > toIndex}
         * @throws ArrayIndexOutOfBoundsException
         *     if {@code fromIndex < 0} or {@code toIndex > a.length}
         */

        static sort(a:number[], fromIndex:number, toIndex:number) {
            Arrays.rangeCheck(a.length, fromIndex, toIndex);

            var sort = new Array<number>(toIndex-fromIndex);
            for(let i = fromIndex; i < toIndex; i++){
                sort[i-fromIndex] = a[i];
            }
            sort.sort((a:number, b:number)=> {
                return a > b ? 1 : -1
            });
            for(let i = fromIndex; i < toIndex; i++){
                a[i] = sort[i-fromIndex];
            }
        }

        /**
         * Checks that {@code fromIndex} and {@code toIndex} are in
         * the range and throws an exception if they aren't.
         */
        private static rangeCheck(arrayLength:number, fromIndex:number, toIndex:number) {
            if (fromIndex > toIndex) {
                throw new Error(
                    "ArrayIndexOutOfBoundsException:fromIndex(" + fromIndex + ") > toIndex(" + toIndex + ")");
            }
            if (fromIndex < 0) {
                throw new Error('ArrayIndexOutOfBoundsException:' + fromIndex);
            }
            if (toIndex > arrayLength) {
                throw new Error('ArrayIndexOutOfBoundsException:' + toIndex);
            }
        }

        static asList<T>(array:T[]):List<T> {
            let list = new ArrayList<T>();
            list.array.push(...array);
            return list;
        }
    }
}
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


        /**
         * Returns <tt>true</tt> if the two specified arrays of Objects are
         * <i>equal</i> to one another.  The two arrays are considered equal if
         * both arrays contain the same number of elements, and all corresponding
         * pairs of elements in the two arrays are equal.  Two objects <tt>e1</tt>
         * and <tt>e2</tt> are considered <i>equal</i> if <tt>(e1==null ? e2==null
         * : e1.equals(e2))</tt>.  In other words, the two arrays are equal if
         * they contain the same elements in the same order.  Also, two array
         * references are considered equal if both are <tt>null</tt>.<p>
         *
         * @param a one array to be tested for equality
         * @param a2 the other array to be tested for equality
         * @return <tt>true</tt> if the two arrays are equal
         */
        static equals(a:any[], a2:any[]):boolean {
            if (a == a2) return true;
            if (a == null || a2 == null) return false;

            let length = a.length;
            if (a2.length != length) return false;

            for (let i=0; i<length; i++) {
                if (a[i]!=a2[i]) return false;
            }
            return true;
        }
    }
}
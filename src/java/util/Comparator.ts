module java.util {
    export interface Comparator<T> {

        /**
         * Compares its two arguments for order.  Returns a negative integer,
         * zero, or a positive integer as the first argument is less than, equal
         * to, or greater than the second.<p>
         *
         * @param o1 the first object to be compared.
         * @param o2 the second object to be compared.
         * @return a negative integer, zero, or a positive integer as the
         *         first argument is less than, equal to, or greater than the
         *         second.
         * @throws NullPointerException if an argument is null and this
         *         comparator does not permit null arguments
         * @throws ClassCastException if the arguments' types prevent them from
         *         being compared by this comparator.
         */
        compare(o1:T, o2:T):number;
    }
}
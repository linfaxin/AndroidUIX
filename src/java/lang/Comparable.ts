
module java.lang {

    export interface Comparable<T> {

        /**
         * @param   o the object to be compared.
         * @return  a negative integer, zero, or a positive integer as this object
         *          is less than, equal to, or greater than the specified object.
         *
         * @throws NullPointerException if the specified object is null
         * @throws ClassCastException if the specified object's type prevents it
         *         from being compared to this object.
         */
        compareTo(o:T):number;
    }

    export module Comparable{
        export function isImpl(obj){
            return obj && obj['compareTo'];
        }
    }
}
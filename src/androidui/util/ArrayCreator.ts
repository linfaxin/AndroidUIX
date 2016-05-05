module androidui.util{
    export class ArrayCreator {

        /**
         * In Java, number array will default fill 0.
         * @param size
         * @returns {number[]}
         */
        static newNumberArray(size:number):Array<number> {
            let array = new Array<number>(size);
            if(size>0) ArrayCreator.fillArray(array, 0);
            return array;
        }

        /**
         * In Java, boolean array will default fill false.
         * @param size
         * @returns {boolean[]}
         */
        static newBooleanArray(size:number):Array<boolean> {
            let array = new Array<boolean>(size);
            ArrayCreator.fillArray(array, false);
            return array;
        }

        /**
         * fill value to array
         * @param array
         * @param value
         */
        static fillArray(array:Array<any>, value:any){
            for (var i = 0, length = array.length; i < length; i++) {
                array[i] = value;
            }
        }
    }
}
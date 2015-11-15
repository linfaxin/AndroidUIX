/**
 * Created by linfaxin on 15/11/14.
 */
module android.text{
    export class TextUtils{

        /**
         * Returns true if the string is null or 0-length.
         * @param str the string to be examined
         * @return true if str is null or zero length
         */
        static isEmpty(str:string):boolean  {
            if (str == null || str.length == 0)
                return true;
            else
                return false;
        }
    }
}
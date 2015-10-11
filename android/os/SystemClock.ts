/**
 * Created by linfaxin on 15/10/5.
 */
module android.os{
    export class SystemClock{
        static uptimeMillis() : number{
            return new Date().getTime();
        }
    }
}
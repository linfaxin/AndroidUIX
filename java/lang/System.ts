/**
 * Created by linfaxin on 15/10/8.
 */
module java.lang{
    export class System{
        static out = {
            println(any?){
                console.log('\n');
                console.log(any);
            },
            print(any){
                console.log(any);
            }
        };

        static currentTimeMillis():number {
            return new Date().getTime();
        }
    }
}
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

        static arraycopy(src:any[], srcPos:number, dest:any[], destPos:number, length:number):void {
            let srcLength = src.length;
            let destLength = dest.length;
            for(let i=0; i<length; i++){
                let srcIndex = i+srcPos;
                if(srcIndex>=srcLength) return;
                let destIndex = i+destPos;
                if(destIndex>=destLength) return;
                dest[destIndex] = src[srcIndex];
            }
        }
    }
}
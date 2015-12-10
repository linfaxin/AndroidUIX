module java.lang{
    export class StringBuilder{
        array : Array<string>;

        constructor();
        constructor(capacity : number);
        constructor(str : string);
        constructor(arg?) {
            this.array = [];
            if(!Number.isInteger(arg) && arg){//number means capacity, miss
                this.append(arg);
            }
        }
        length() : number {
            return this.array.length;
        }
        append(a:any) : StringBuilder{
            let str:string = a + '';
            this.array.push(...str.split(''));
            return this;
        }

        /**
         * @throws StringIndexOutOfBoundsException {@inheritDoc}
         */
        deleteCharAt(index:number):StringBuilder {
            this.array.splice(index, 1);
            return this;
        }

        replace(start:number, end:number, str:string):StringBuilder {
            this.array.splice(start, end-start, ...str.split(''));
            return this;
        }

        setLength(length : number){
            let arrayLength = this.array.length;
            if(length===arrayLength) return;
            if(length<arrayLength){
                this.array = this.array.splice(length, arrayLength-length);
            }else{
                for(let i = 0; i<arrayLength-length; i++){
                    this.array.push('\0');
                }
            }
        }
        toString() : string{
            return this.array.join('');
        }
    }
}
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
        append(str) : StringBuilder{
            str = str + "";
            this.array.push(...str.split(''));
            return this;
        }
        setLength(length : number){
            let arrayLength = this.array.length;
            if(length===arrayLength) return;
            if(length<arrayLength){
                this.array = this.array.splice(length, arrayLength-length);
            }else{
                for(let i = 0; i<arrayLength-length; i++){
                    this.array.push(' ');
                }
            }
        }
        toString() : string{
            return this.array.join("");
        }
    }
}
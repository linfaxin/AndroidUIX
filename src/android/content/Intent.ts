/**
 * Created by linfaxin on 16/1/4.
 * lite impl of Android Intent. Only use for startActivity
 */
///<reference path="../os/Bundle.ts"/>


module android.content{
    import Bundle = android.os.Bundle;

    export class Intent{
        private mExtras:Bundle;
        private mRequestCode = -1;
        private activityName:string;

        constructor(activityClassOrName?:string) {
            this.activityName = activityClassOrName;
        }

        getBooleanExtra(name:string, defaultValue:boolean):boolean {
            return this.mExtras == null ? defaultValue : <boolean>this.mExtras.get(name, defaultValue);
        }
        getIntExtra(name:string, defaultValue:number):number {
            return this.mExtras == null ? defaultValue : <number>this.mExtras.get(name, defaultValue);
        }
        getLongExtra(name:string, defaultValue:number):number {
            return this.mExtras == null ? defaultValue : <number>this.mExtras.get(name, defaultValue);
        }
        getFloatExtra(name:string, defaultValue:number):number {
            return this.mExtras == null ? defaultValue : <number>this.mExtras.get(name, defaultValue);
        }
        getDoubleExtra(name:string, defaultValue:number):number {
            return this.mExtras == null ? defaultValue : <number>this.mExtras.get(name, defaultValue);
        }
        getStringExtra(name:string, defaultValue?:string):string {
            return this.mExtras == null ? defaultValue : <string>this.mExtras.get(name, defaultValue);
        }
        getStringArrayExtra(name:string, defaultValue?:string[]):string[] {
            return this.mExtras == null ? defaultValue : <string[]>this.mExtras.get(name, defaultValue);
        }
        getIntegerArrayExtra(name:string, defaultValue?:number[]):number[] {
            return this.mExtras == null ? defaultValue : <number[]>this.mExtras.get(name, defaultValue);
        }
        getLongArrayExtra(name:string, defaultValue?:number[]):number[] {
            return this.mExtras == null ? defaultValue : <number[]>this.mExtras.get(name, defaultValue);
        }
        getFloatArrayExtra(name:string, defaultValue?:number[]):number[] {
            return this.mExtras == null ? defaultValue : <number[]>this.mExtras.get(name, defaultValue);
        }
        getDoubleArrayExtra(name:string, defaultValue?:number[]):number[] {
            return this.mExtras == null ? defaultValue : <number[]>this.mExtras.get(name, defaultValue);
        }
        getBooleanArrayExtra(name:string, defaultValue?:boolean[]):boolean[] {
            return this.mExtras == null ? defaultValue : <boolean[]>this.mExtras.get(name, defaultValue);
        }

        hasExtra(name:string){
            return this.mExtras != null && this.mExtras.containsKey(name);
        }

        putExtra(name:string, value:any):Intent {
            if (this.mExtras == null) {
                this.mExtras = new Bundle();
            }
            this.mExtras.put(name, value);
            return this;
        }
        getExtras():Bundle {
            return (this.mExtras != null) ? new Bundle(this.mExtras) : null;
        }
    }
}
/**
 * Created by linfaxin on 15/11/26.
 */
module java.lang{

    let hashCodeGenerator = 0;
    export class JavaObject{
        static get class():Class {
            return new Class(this.name);
        }

        private hash = hashCodeGenerator++;
        private _class = new Class(this.constructor.name);
        hashCode():number{
            return this.hash;
        }

        getClass():Class {
            return this._class;
        }

        equals(o):boolean {
            return this === o;
        }

    }

    export class Class{
        name:string;

        constructor(name:string) {
            this.name = name;
        }

        getName():string {
            return this.name;
        }
        getSimpleName():string {
            return this.name;
        }
    }
}
/**
 * Created by linfaxin on 15/11/26.
 */
module java.lang{

    let hashCodeGenerator = 0;
    export class JavaObject{
        static get class():Class {
            return new Class(this);
        }

        private hash = hashCodeGenerator++;
        private _class:Class;
        hashCode():number{
            return this.hash;
        }

        getClass():Class {
            if (!this._class) {
                this._class = new Class(this.constructor);
            }
            return this._class;
        }

        equals(o):boolean {
            return this === o;
        }

    }

    export class Class{
        clazz:Function;

        constructor(clazz:Function) {
            this.clazz = clazz;
        }

        getName():string {
            return this.clazz.name;
        }
        getSimpleName():string {
            return this.clazz.name;
        }
    }
}
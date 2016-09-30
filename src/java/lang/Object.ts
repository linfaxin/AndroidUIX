/**
 * Created by linfaxin on 15/11/26.
 */
module java.lang{

    let hashCodeGenerator = 0;
    export class JavaObject {
        static get class():Class {
            return Class.getClass(this);
        }

        private hash = hashCodeGenerator++;
        hashCode():number{
            return this.hash;
        }

        getClass():Class {
            return Class.getClass(this.constructor);
        }

        equals(o):boolean {
            return this === o;
        }

    }

    export class Class{
        private static classCache = new Map();
        private static getClass(clazz:Function) {
            let c = Class.classCache.get(clazz);
            if (!c) {
                c = new Class(clazz);
                Class.classCache.set(clazz, c);
            }
            return c;
        }

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
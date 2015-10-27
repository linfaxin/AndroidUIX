/**
 * Created by linfaxin on 15/10/5.
 */
module android.graphics {
    export class Point {
        x:number = 0;
        y:number = 0;

        constructor();
        constructor(x:number, y:number);
        constructor(src:Point);
        constructor(...args) {
            if (args.length === 1) {
                let src:Point = args[0];
                this.x = src.x;
                this.y = src.y;
            } else {
                let [x=0, y=0] = args;
                this.x = x;
                this.y = y;
            }
        }

        /**
         * Set the point's x and y coordinates
         */
        set(x:number, y:number) {
            this.x = x;
            this.y = y;
        }

        /**
         * Negate the point's coordinates
         */
        negate() {
            this.x = -this.x;
            this.y = -this.y;
        }

        /**
         * Offset the point's coordinates by dx, dy
         */
        offset(dx:number, dy:number) {
            this.x += dx;
            this.y += dy;
        }

        /**
         * Returns true if the point's coordinates equal (x,y)
         */
        equals(x:number, y:number):boolean ;
        equals(o:any):boolean;
        equals(...args):boolean {
            if (args.length === 2) {
                let [x=0,y=0] = args;
                return this.x == x && this.y == y
            } else {
                let o = args[0];
                if (this === o) return true;
                if (!o || !(o instanceof Point)) return false;
                let point = o;
                if (this.x != point.x) return false;
                if (this.y != point.y) return false;
                return true;
            }
        }

        toString():String {
            return "Point(" + this.x + ", " + this.y + ")";
        }
    }
}
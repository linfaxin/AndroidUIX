/**
 * Created by linfaxin on 15/10/3.
 */
///<reference path="../../java/lang/StringBuilder.ts"/>
module android.graphics{
    import StringBuilder = java.lang.StringBuilder;
    export class Rect {
        left : number = 0;
        top : number = 0;
        right : number = 0;
        bottom : number = 0;

        constructor();
        constructor(rect : Rect);
        constructor(left : number, top : number, right : number, bottom : number);
        constructor(...args){
            if(args.length===1){
                let rect : Rect = args[0];
                this.left = rect.left;
                this.top = rect.top;
                this.right = rect.right;
                this.bottom = rect.bottom;
            }else if(args.length === 4 || args.length === 0){
                let [left = 0, t = 0, right = 0, bottom = 0] = args;
                this.left = left;
                this.top = t;
                this.right = right;
                this.bottom = bottom;
            }
        }

        equals(r : Rect) : boolean{
            if (this === r) return true;
            if (!r || !(r instanceof Rect)) return false;

            return this.left === r.left && this.top === r.top
                && this.right === r.right && this.bottom === r.bottom;
        }

        toString() : string {
            let sb = new StringBuilder();
            sb.append("Rect("); sb.append(this.left); sb.append(", ");
            sb.append(this.top); sb.append(" - "); sb.append(this.right);
            sb.append(", "); sb.append(this.bottom); sb.append(")");
            return sb.toString();
        }

        toShortString(sb = new StringBuilder()) : string {
            sb.setLength(0);
            sb.append('['); sb.append(this.left); sb.append(',');
            sb.append(this.top); sb.append("]["); sb.append(this.right);
            sb.append(','); sb.append(this.bottom); sb.append(']');
            return sb.toString();
        }

        flattenToString() : string {
            let sb = new StringBuilder(32);
            // WARNING: Do not change the format of this string, it must be
            // preserved because Rects are saved in this flattened format.
            sb.append(this.left);
            sb.append(' ');
            sb.append(this.top);
            sb.append(' ');
            sb.append(this.right);
            sb.append(' ');
            sb.append(this.bottom);
            return sb.toString();
        }
        static unflattenFromString(str : string) : Rect {
            let parts = str.split(" ");
            return new Rect(Number.parseInt(parts[0]),
                Number.parseInt(parts[1]),
                Number.parseInt(parts[2]),
                Number.parseInt(parts[3]));
        }

        isEmpty() : boolean {
            return this.left >= this.right || this.top >= this.bottom;
        }
        width() : number {
            return this.right - this.left;
        }
        height() : number {
            return this.bottom - this.top;
        }
        centerX() : number {
            return (this.left + this.right) >> 1;
        }
        centerY() : number {
            return (this.top + this.bottom) >> 1;
        }
        exactCenterX() : number {
            return (this.left + this.right) * 0.5;
        }
        exactCenterY() : number {
            return (this.top + this.bottom) * 0.5;
        }
        setEmpty() {
            this.left = this.right = this.top = this.bottom = 0;
        }
        set(rect : Rect);
        set(left, top, right, bottom);
        set(...args){
            if (args.length === 1) {
                let rect : Rect = args[0];
                [this.left, this.top, this.right, this.bottom] = [rect.left, rect.top, rect.right, rect.bottom];
            }else {
                let [left = 0, t = 0, right = 0, bottom = 0] = args;
                this.left = left;
                this.top = t;
                this.right = right;
                this.bottom = bottom;
            }
        }
        offset(dx, dy) {
            this.left += dx;
            this.top += dy;
            this.right += dx;
            this.bottom += dy;
        }
        offsetTo(newLeft, newTop) {
            this.right += newLeft - this.left;
            this.bottom += newTop - this.top;
            this.left = newLeft;
            this.top = newTop;
        }
        inset(dx, dy) {
            this.left += dx;
            this.top += dy;
            this.right -= dx;
            this.bottom -= dy;
        }
        contains(x : number , y : number) : boolean;
        contains(left : number, top : number, right : number, bottom : number) :boolean;
        contains(r:Rect) : boolean;
        contains(...args) : boolean{
            if(args.length === 1){
                let r : Rect = args[0];
                // check for empty first
                return this.left < this.right && this.top < this.bottom
                        // now check for containment
                    && this.left <= r.left && this.top <= r.top && this.right >= r.right && this.bottom >= r.bottom;

            }else if(args.length === 2){
                let [x, y] = args;
                return this.left < this.right && this.top < this.bottom  // check for empty first
                    && x >= this.left && x < this.right && y >= this.top && y < this.bottom;

            }else{
                let [left = 0, t = 0, right = 0, bottom = 0] = args;
                // check for empty first
                return this.left < this.right && this.top < this.bottom
                        // now check for containment
                    && this.left <= left && this.top <= t
                    && this.right >= right && this.bottom >= bottom;
            }
        }

        intersect(rect : Rect) : boolean;
        intersect(left : number, top : number, right : number, bottom : number) : boolean;
        intersect(...args) : boolean{
            if(args.length===1){
                let rect : Rect = args[0];
                return this.intersect(rect.left, rect.top, rect.right, rect.bottom);
            }else{
                let [left = 0, t = 0, right = 0, bottom = 0] = args;
                if (this.left < right && left < this.right && this.top < bottom && t < this.bottom) {
                    if (this.left < left) this.left = left;
                    if (this.top < t) this.top = t;
                    if (this.right > right) this.right = right;
                    if (this.bottom > bottom) this.bottom = bottom;
                    return true;
                }
                return false;
            }
        }

        intersects(rect : Rect) : boolean;
        intersects(left : number, top : number, right : number, bottom : number) : boolean;
        intersects(...args) : boolean{
            if(args.length===1){
                let rect : Rect = args[0];
                return this.intersects(rect.left, rect.top, rect.right, rect.bottom);
            }else{
                let [left = 0, t = 0, right = 0, bottom = 0] = args;
                return this.left < right && left < this.right && this.top < bottom && t < this.bottom;
            }
        }
        union(rect : Rect);
        union(x : number, y : number);
        union(left : number, top : number, right : number, bottom :number);
        union(...args) {
            if(arguments.length === 1){
                let rect : Rect = args[0];
                this.union(rect.left, rect.top, rect.right, rect.bottom);

            }else if(arguments.length === 2){
                let [x=0, y=0] = args;
                if (x < this.left) {
                    this.left = x;
                } else if (x > this.right) {
                    this.right = x;
                }
                if (y < this.top) {
                    this.top = y;
                } else if (y > this.bottom) {
                    this.bottom = y;
                }
            }else{
                let left = args[0];
                let top = args[1];
                let right = args[2];
                let bottom = args[3];

                if ((left < right) && (top < bottom)) {
                    if ((this.left < this.right) && (this.top < this.bottom)) {
                        if (this.left > left) this.left = left;
                        if (this.top > top) this.top = top;
                        if (this.right < right) this.right = right;
                        if (this.bottom < bottom) this.bottom = bottom;
                    } else {
                        this.left = left;
                        this.top = top;
                        this.right = right;
                        this.bottom = bottom;
                    }
                }
            }

        }
        sort() {
            if (this.left > this.right) {
                [this.left, this.right] = [this.right, this.left];
            }
            if (this.top > this.bottom) {
                [this.top, this.bottom] = [this.bottom, this.top];
            }
        }
        scale(scale : number) {
            if (scale != 1) {
                this.left = this.left * scale;
                this.top = this.top * scale;
                this.right = this.right * scale;
                this.bottom = this.bottom * scale;
            }
        }
    }
}
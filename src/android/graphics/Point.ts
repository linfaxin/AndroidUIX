/*
 * Copyright (C) 2007 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module android.graphics {
    /**
     * Point holds two integer coordinates
     */
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
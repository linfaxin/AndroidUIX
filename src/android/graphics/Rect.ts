/*
 * Copyright (C) 2006 The Android Open Source Project
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

///<reference path="../../java/lang/StringBuilder.ts"/>
module android.graphics{
    import StringBuilder = java.lang.StringBuilder;
    /**
     * Rect holds four integer coordinates for a rectangle. The rectangle is
     * represented by the coordinates of its 4 edges (left, top, right bottom).
     * These fields can be accessed directly. Use width() and height() to retrieve
     * the rectangle's width and height. Note: most methods do not check to see that
     * the coordinates are sorted correctly (i.e. left <= right and top <= bottom).
     * AndroidUI NOTE: current impl not limit integer to set.
     */
    export class Rect {
        left : number = 0;
        top : number = 0;
        right : number = 0;
        bottom : number = 0;

        /**
         * Create a new empty Rect. All coordinates are initialized to 0.
         */
        constructor();
        /**
         * Create a new rectangle, initialized with the values in the specified
         * rectangle (which is left unmodified).
         *
         * @param r The rectangle whose coordinates are copied into the new
         *          rectangle.
         */
        constructor(r : Rect);
        /**
         * Create a new rectangle with the specified coordinates. Note: no range
         * checking is performed, so the caller must ensure that left <= right and
         * top <= bottom.
         *
         * @param left   The X coordinate of the left side of the rectangle
         * @param top    The Y coordinate of the top of the rectangle
         * @param right  The X coordinate of the right side of the rectangle
         * @param bottom The Y coordinate of the bottom of the rectangle
         */
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
                this.left = left || 0;
                this.top = t || 0;
                this.right = right || 0;
                this.bottom = bottom || 0;
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

        /**
         * Return a string representation of the rectangle in a compact form.
         */
        toShortString(sb = new StringBuilder()) : string {
            sb.setLength(0);
            sb.append('['); sb.append(this.left); sb.append(',');
            sb.append(this.top); sb.append("]["); sb.append(this.right);
            sb.append(','); sb.append(this.bottom); sb.append(']');
            return sb.toString();
        }

        /**
         * Return a string representation of the rectangle in a well-defined format.
         *
         * <p>You can later recover the Rect from this string through
         * {@link #unflattenFromString(String)}.
         *
         * @return Returns a new String of the form "left top right bottom"
         */
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

        /**
         * Returns a Rect from a string of the form returned by {@link #flattenToString},
         * or null if the string is not of that form.
         */
        static unflattenFromString(str : string) : Rect {
            let parts = str.split(" ");
            return new Rect(Number.parseInt(parts[0]),
                Number.parseInt(parts[1]),
                Number.parseInt(parts[2]),
                Number.parseInt(parts[3]));
        }

        /**
         * Returns true if the rectangle is empty (left >= right or top >= bottom)
         */
        isEmpty() : boolean {
            return this.left >= this.right || this.top >= this.bottom;
        }

        /**
         * @return the rectangle's width. This does not check for a valid rectangle
         * (i.e. left <= right) so the result may be negative.
         */
        width() : number {
            return this.right - this.left;
        }

        /**
         * @return the rectangle's height. This does not check for a valid rectangle
         * (i.e. top <= bottom) so the result may be negative.
         */
        height() : number {
            return this.bottom - this.top;
        }

        /**
         * @return the horizontal center of the rectangle. If the computed value
         *         is fractional, this method returns the largest integer that is
         *         less than the computed value.
         */
        centerX() : number {
            return (this.left + this.right) >> 1;
        }

        /**
         * @return the vertical center of the rectangle. If the computed value
         *         is fractional, this method returns the largest integer that is
         *         less than the computed value.
         */
        centerY() : number {
            return (this.top + this.bottom) >> 1;
        }

        /**
         * @return the exact horizontal center of the rectangle as a float.
         */
        exactCenterX() : number {
            return (this.left + this.right) * 0.5;
        }

        /**
         * @return the exact vertical center of the rectangle as a float.
         */
        exactCenterY() : number {
            return (this.top + this.bottom) * 0.5;
        }

        /**
         * Set the rectangle to (0,0,0,0)
         */
        setEmpty() {
            this.left = this.right = this.top = this.bottom = 0;
        }
        /**
         * Copy the coordinates from src into this rectangle.
         *
         * @param src The rectangle whose coordinates are copied into this
         *           rectangle.
         */
        set(src : Rect);
        /**
         * Set the rectangle's coordinates to the specified values. Note: no range
         * checking is performed, so it is up to the caller to ensure that
         * left <= right and top <= bottom.
         *
         * @param left   The X coordinate of the left side of the rectangle
         * @param top    The Y coordinate of the top of the rectangle
         * @param right  The X coordinate of the right side of the rectangle
         * @param bottom The Y coordinate of the bottom of the rectangle
         */
        set(left, top, right, bottom);
        set(...args){
            if (args.length === 1) {
                let rect : Rect = args[0];
                [this.left, this.top, this.right, this.bottom] = [rect.left, rect.top, rect.right, rect.bottom];
            }else {
                let [left = 0, t = 0, right = 0, bottom = 0] = args;
                this.left = left || 0;
                this.top = t || 0;
                this.right = right || 0;
                this.bottom = bottom || 0;
            }
        }

        /**
         * Offset the rectangle by adding dx to its left and right coordinates, and
         * adding dy to its top and bottom coordinates.
         *
         * @param dx The amount to add to the rectangle's left and right coordinates
         * @param dy The amount to add to the rectangle's top and bottom coordinates
         */
        offset(dx, dy) {
            this.left += dx;
            this.top += dy;
            this.right += dx;
            this.bottom += dy;
        }

        /**
         * Offset the rectangle to a specific (left, top) position,
         * keeping its width and height the same.
         *
         * @param newLeft   The new "left" coordinate for the rectangle
         * @param newTop    The new "top" coordinate for the rectangle
         */
        offsetTo(newLeft, newTop) {
            this.right += newLeft - this.left;
            this.bottom += newTop - this.top;
            this.left = newLeft;
            this.top = newTop;
        }

        /**
         * Inset the rectangle by (dx,dy). If dx is positive, then the sides are
         * moved inwards, making the rectangle narrower. If dx is negative, then the
         * sides are moved outwards, making the rectangle wider. The same holds true
         * for dy and the top and bottom.
         *
         * @param dx The amount to add(subtract) from the rectangle's left(right)
         * @param dy The amount to add(subtract) from the rectangle's top(bottom)
         */
        inset(dx, dy) {
            this.left += dx;
            this.top += dy;
            this.right -= dx;
            this.bottom -= dy;
        }

        /**
         * Returns true if (x,y) is inside the rectangle. The left and top are
         * considered to be inside, while the right and bottom are not. This means
         * that for a x,y to be contained: left <= x < right and top <= y < bottom.
         * An empty rectangle never contains any point.
         *
         * @param x The X coordinate of the point being tested for containment
         * @param y The Y coordinate of the point being tested for containment
         * @return true iff (x,y) are contained by the rectangle, where containment
         *              means left <= x < right and top <= y < bottom
         */
        contains(x : number , y : number) : boolean;
        /**
         * Returns true iff the 4 specified sides of a rectangle are inside or equal
         * to this rectangle. i.e. is this rectangle a superset of the specified
         * rectangle. An empty rectangle never contains another rectangle.
         *
         * @param left The left side of the rectangle being tested for containment
         * @param top The top of the rectangle being tested for containment
         * @param right The right side of the rectangle being tested for containment
         * @param bottom The bottom of the rectangle being tested for containment
         * @return true iff the the 4 specified sides of a rectangle are inside or
         *              equal to this rectangle
         */
        contains(left : number, top : number, right : number, bottom : number) :boolean;
        /**
         * Returns true iff the specified rectangle r is inside or equal to this
         * rectangle. An empty rectangle never contains another rectangle.
         *
         * @param r The rectangle being tested for containment.
         * @return true iff the specified rectangle r is inside or equal to this
         *              rectangle
         */
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

        /**
         * If the specified rectangle intersects this rectangle, return true and set
         * this rectangle to that intersection, otherwise return false and do not
         * change this rectangle. No check is performed to see if either rectangle
         * is empty. To just test for intersection, use intersects()
         *
         * @param r The rectangle being intersected with this rectangle.
         * @return true if the specified rectangle and this rectangle intersect
         *              (and this rectangle is then set to that intersection) else
         *              return false and do not change this rectangle.
         */
        intersect(r : Rect) : boolean;
        /**
         * If the rectangle specified by left,top,right,bottom intersects this
         * rectangle, return true and set this rectangle to that intersection,
         * otherwise return false and do not change this rectangle. No check is
         * performed to see if either rectangle is empty. Note: To just test for
         * intersection, use {@link #intersects(Rect, Rect)}.
         *
         * @param left The left side of the rectangle being intersected with this
         *             rectangle
         * @param top The top of the rectangle being intersected with this rectangle
         * @param right The right side of the rectangle being intersected with this
         *              rectangle.
         * @param bottom The bottom of the rectangle being intersected with this
         *             rectangle.
         * @return true if the specified rectangle and this rectangle intersect
         *              (and this rectangle is then set to that intersection) else
         *              return false and do not change this rectangle.
         */
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

        /**
         * If rectangles a and b intersect, return true and set this rectangle to
         * that intersection, otherwise return false and do not change this
         * rectangle. No check is performed to see if either rectangle is empty.
         * To just test for intersection, use intersects()
         *
         * @param a The first rectangle being intersected with
         * @param b The second rectangle being intersected with
         * @return true iff the two specified rectangles intersect. If they do, set
         *              this rectangle to that intersection. If they do not, return
         *              false and do not change this rectangle.
         */
        public setIntersect(a:Rect, b:Rect):boolean {
            if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) {
                this.left = Math.max(a.left, b.left);
                this.top = Math.max(a.top, b.top);
                this.right = Math.min(a.right, b.right);
                this.bottom = Math.min(a.bottom, b.bottom);
                return true;
            }
            return false;
        }

        /**
         * Returns true if this rectangle intersects the specified rectangle.
         * In no event is this rectangle modified. No check is performed to see
         * if either rectangle is empty. To record the intersection, use intersect()
         * or setIntersect().
         *
         * @param rect the rect
         * @return true iff the specified rectangle intersects this rectangle. In
         *              no event is this rectangle modified.
         */
        intersects(rect : Rect) : boolean;
        /**
         * Returns true if this rectangle intersects the specified rectangle.
         * In no event is this rectangle modified. No check is performed to see
         * if either rectangle is empty. To record the intersection, use intersect()
         * or setIntersect().
         *
         * @param left The left side of the rectangle being tested for intersection
         * @param top The top of the rectangle being tested for intersection
         * @param right The right side of the rectangle being tested for
         *              intersection
         * @param bottom The bottom of the rectangle being tested for intersection
         * @return true iff the specified rectangle intersects this rectangle. In
         *              no event is this rectangle modified.
         */
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

        /**
         * Returns true iff the two specified rectangles intersect. In no event are
         * either of the rectangles modified. To record the intersection,
         * use {@link #intersect(Rect)} or {@link #setIntersect(Rect, Rect)}.
         *
         * @param a The first rectangle being tested for intersection
         * @param b The second rectangle being tested for intersection
         * @return true iff the two specified rectangles intersect. In no event are
         *              either of the rectangles modified.
         */
        public static intersects(a:Rect, b:Rect):boolean {
            return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
        }


        /**
         * Update this Rect to enclose itself and the specified rectangle. If the
         * specified rectangle is empty, nothing is done. If this rectangle is empty
         * it is set to the specified rectangle.
         *
         * @param r The rectangle being unioned with this rectangle
         */
        union(r : Rect);
        /**
         * Update this Rect to enclose itself and the [x,y] coordinate. There is no
         * check to see that this rectangle is non-empty.
         *
         * @param x The x coordinate of the point to add to the rectangle
         * @param y The y coordinate of the point to add to the rectangle
         */
        union(x : number, y : number);
        /**
         * Update this Rect to enclose itself and the specified rectangle. If the
         * specified rectangle is empty, nothing is done. If this rectangle is empty
         * it is set to the specified rectangle.
         *
         * @param left The left edge being unioned with this rectangle
         * @param top The top edge being unioned with this rectangle
         * @param right The right edge being unioned with this rectangle
         * @param bottom The bottom edge being unioned with this rectangle
         */
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

        /**
         * Swap top/bottom or left/right if there are flipped (i.e. left > right
         * and/or top > bottom). This can be called if
         * the edges are computed separately, and may have crossed over each other.
         * If the edges are already correct (i.e. left <= right and top <= bottom)
         * then nothing is done.
         */
        sort() {
            if (this.left > this.right) {
                [this.left, this.right] = [this.right, this.left];
            }
            if (this.top > this.bottom) {
                [this.top, this.bottom] = [this.bottom, this.top];
            }
        }

        /**
         * Scales up the rect by the given scale.
         * @hide
         */
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
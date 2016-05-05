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

///<reference path="View.ts"/>
///<reference path="ViewGroup.ts"/>

module android.view{
    import View = android.view.View;
    import Rect = android.graphics.Rect;
    import ArrayList = java.util.ArrayList;


    /**
     * The algorithm used for finding the next focusable view in a given direction
     * from a view that currently has focus.
     */
    export class FocusFinder{
        private static sFocusFinder:FocusFinder;
        /**
         * Get the focus finder for this thread.
         */
        static getInstance():FocusFinder{
            if(!FocusFinder.sFocusFinder){
                FocusFinder.sFocusFinder = new FocusFinder();
            }
            return FocusFinder.sFocusFinder;
        }

        mFocusedRect = new Rect();
        mOtherRect = new Rect();
        mBestCandidateRect = new Rect();
        private mSequentialFocusComparator = new SequentialFocusComparator();
        private mTempList = new ArrayList<View>();

        /**
         * Find the next view to take focus in root's descendants, starting from the view
         * that currently is focused.
         * @param root Contains focused. Cannot be null.
         * @param focused Has focus now.
         * @param direction Direction to look.
         * @return The next focusable view, or null if none exists.
         */
        findNextFocus(root:ViewGroup, focused:View, direction:number):View{
            return this._findNextFocus(root, focused, null, direction);
        }

        /**
         * Find the next view to take focus in root's descendants, searching from
         * a particular rectangle in root's coordinates.
         * @param root Contains focusedRect. Cannot be null.
         * @param focusedRect The starting point of the search.
         * @param direction Direction to look.
         * @return The next focusable view, or null if none exists.
         */
        findNextFocusFromRect(root:ViewGroup, focusedRect:Rect, direction:number) {
            this.mFocusedRect.set(focusedRect);
            return this._findNextFocus(root, null, this.mFocusedRect, direction);
        }
        private _findNextFocus(root:ViewGroup, focused:View, focusedRect:android.graphics.Rect,
                               direction:number):View {
            let next = null;
            if (focused != null) {
                next = this.findNextUserSpecifiedFocus(root, focused, direction);
            }
            if (next != null) {
                return next;
            }
            let focusables = this.mTempList;
            try {
                focusables.clear();
                root.addFocusables(focusables, direction);
                if (!focusables.isEmpty()) {
                    next = this.__findNextFocus(root, focused, focusedRect, direction, focusables);
                }
            } finally {
                focusables.clear();
            }
            return next;
        }
        private findNextUserSpecifiedFocus(root:ViewGroup, focused:View, direction:number):View {
            // check for user specified next focus
            let userSetNextFocus = focused.findUserSetNextFocus(root, direction);
            if (userSetNextFocus != null && userSetNextFocus.isFocusable()
                && (!userSetNextFocus.isInTouchMode()
                || userSetNextFocus.isFocusableInTouchMode())) {
                return userSetNextFocus;
            }
            return null;
        }

        private __findNextFocus(root:ViewGroup, focused:View, focusedRect:android.graphics.Rect,
                               direction:number, focusables:ArrayList<View>):View {
            if (focused != null) {
                if (focusedRect == null) {
                    focusedRect = this.mFocusedRect;
                }
                // fill in interesting rect from focused
                focused.getFocusedRect(focusedRect);
                root.offsetDescendantRectToMyCoords(focused, focusedRect);
            } else {
                if (focusedRect == null) {
                    focusedRect = this.mFocusedRect;
                    // make up a rect at top left or bottom right of root
                    switch (direction) {
                        case View.FOCUS_RIGHT:
                        case View.FOCUS_DOWN:
                            this.setFocusTopLeft(root, focusedRect);
                            break;
                        case View.FOCUS_FORWARD:
                            this.setFocusTopLeft(root, focusedRect);
                            break;

                        case View.FOCUS_LEFT:
                        case View.FOCUS_UP:
                            this.setFocusBottomRight(root, focusedRect);
                            break;
                        case View.FOCUS_BACKWARD:
                            this.setFocusBottomRight(root, focusedRect);
                    }
                }
            }

            switch (direction) {
                case View.FOCUS_FORWARD:
                case View.FOCUS_BACKWARD:
                    return this.findNextFocusInRelativeDirection(focusables, root, focused, focusedRect, direction);
                case View.FOCUS_UP:
                case View.FOCUS_DOWN:
                case View.FOCUS_LEFT:
                case View.FOCUS_RIGHT:
                    return this.findNextFocusInAbsoluteDirection(focusables, root, focused, focusedRect, direction);
                default:
                    throw new Error("Unknown direction: " + direction);
            }

        }
        private findNextFocusInRelativeDirection(focusables:ArrayList<View>, root:ViewGroup, focused:View,
                                         focusedRect:Rect, direction:number) {
            try {
                // Note: This sort is stable.
                this.mSequentialFocusComparator.setRoot(root);
                //this.mSequentialFocusComparator.setIsLayoutRtl(root.isLayoutRtl());
                this.mSequentialFocusComparator.sort(focusables);
                //Collections.sort(focusables, mSequentialFocusComparator);
            } finally {
                this.mSequentialFocusComparator.recycle();
            }

            const count = focusables.size();
            switch (direction) {
                case View.FOCUS_FORWARD:
                    return FocusFinder.getNextFocusable(focused, focusables, count);
                case View.FOCUS_BACKWARD:
                    return FocusFinder.getPreviousFocusable(focused, focusables, count);
            }
            return focusables.get(count - 1);
        }

        private setFocusBottomRight(root:ViewGroup, focusedRect:Rect) {
            const rootBottom = root.getScrollY() + root.getHeight();
            const rootRight = root.getScrollX() + root.getWidth();
            focusedRect.set(rootRight, rootBottom, rootRight, rootBottom);
        }
        private setFocusTopLeft(root:ViewGroup, focusedRect:Rect) {
            const rootTop = root.getScrollY();
            const rootLeft = root.getScrollX();
            focusedRect.set(rootLeft, rootTop, rootLeft, rootTop);
        }
        private findNextFocusInAbsoluteDirection(focusables:ArrayList<View>, root:ViewGroup, focused:View,
                                                 focusedRect:Rect, direction:number) {
            // initialize the best candidate to something impossible
            // (so the first plausible view will become the best choice)
            this.mBestCandidateRect.set(focusedRect);
            switch(direction) {
                case View.FOCUS_LEFT:
                    this.mBestCandidateRect.offset(focusedRect.width() + 1, 0);
                    break;
                case View.FOCUS_RIGHT:
                    this.mBestCandidateRect.offset(-(focusedRect.width() + 1), 0);
                    break;
                case View.FOCUS_UP:
                    this.mBestCandidateRect.offset(0, focusedRect.height() + 1);
                    break;
                case View.FOCUS_DOWN:
                    this.mBestCandidateRect.offset(0, -(focusedRect.height() + 1));
            }

            let closest:View = null;

            let numFocusables = focusables.size();
            for (let i = 0; i < numFocusables; i++) {
                let focusable = focusables.get(i);

                // only interested in other non-root views
                if (focusable == focused || focusable == root) continue;

                // get focus bounds of other view in same coordinate system
                focusable.getFocusedRect(this.mOtherRect);
                root.offsetDescendantRectToMyCoords(focusable, this.mOtherRect);

                if (this.isBetterCandidate(direction, focusedRect, this.mOtherRect, this.mBestCandidateRect)) {
                    this.mBestCandidateRect.set(this.mOtherRect);
                    closest = focusable;
                }
            }
            return closest;
        }

        private static getNextFocusable(focused:View, focusables:ArrayList<View>, count:number):View {
            if (focused != null) {
                let position = focusables.lastIndexOf(focused);
                if (position >= 0 && position + 1 < count) {
                    return focusables.get(position + 1);
                }
            }
            if (!focusables.isEmpty()) {
                return focusables.get(0);
            }
            return null;
        }


        private static getPreviousFocusable(focused:View, focusables:ArrayList<View>, count:number):View {
            if (focused != null) {
                let position = focusables.indexOf(focused);
                if (position > 0) {
                    return focusables.get(position - 1);
                }
            }
            if (!focusables.isEmpty()) {
                return focusables.get(count - 1);
            }
            return null;
        }

        /**
         * Is rect1 a better candidate than rect2 for a focus search in a particular
         * direction from a source rect?  This is the core routine that determines
         * the order of focus searching.
         * @param direction the direction (up, down, left, right)
         * @param source The source we are searching from
         * @param rect1 The candidate rectangle
         * @param rect2 The current best candidate.
         * @return Whether the candidate is the new best.
         */
        isBetterCandidate(direction:number, source:Rect, rect1:Rect, rect2:Rect):boolean {

            // to be a better candidate, need to at least be a candidate in the first
            // place :)
            if (!this.isCandidate(source, rect1, direction)) {
                return false;
            }

            // we know that rect1 is a candidate.. if rect2 is not a candidate,
            // rect1 is better
            if (!this.isCandidate(source, rect2, direction)) {
                return true;
            }

            // if rect1 is better by beam, it wins
            if (this.beamBeats(direction, source, rect1, rect2)) {
                return true;
            }

            // if rect2 is better, then rect1 cant' be :)
            if (this.beamBeats(direction, source, rect2, rect1)) {
                return false;
            }

            // otherwise, do fudge-tastic comparison of the major and minor axis
            return (this.getWeightedDistanceFor(
                FocusFinder.majorAxisDistance(direction, source, rect1),
                FocusFinder.minorAxisDistance(direction, source, rect1))
            < this.getWeightedDistanceFor(
                FocusFinder.majorAxisDistance(direction, source, rect2),
                FocusFinder.minorAxisDistance(direction, source, rect2)));
        }

        /**
         * One rectangle may be another candidate than another by virtue of being
         * exclusively in the beam of the source rect.
         * @return Whether rect1 is a better candidate than rect2 by virtue of it being in src's
         *      beam
         */
        beamBeats(direction:number, source:Rect, rect1:Rect, rect2:Rect):boolean {
            const rect1InSrcBeam = this.beamsOverlap(direction, source, rect1);
            const rect2InSrcBeam = this.beamsOverlap(direction, source, rect2);

            // if rect1 isn't exclusively in the src beam, it doesn't win
            if (rect2InSrcBeam || !rect1InSrcBeam) {
                return false;
            }

            // we know rect1 is in the beam, and rect2 is not

            // if rect1 is to the direction of, and rect2 is not, rect1 wins.
            // for example, for direction left, if rect1 is to the left of the source
            // and rect2 is below, then we always prefer the in beam rect1, since rect2
            // could be reached by going down.
            if (!this.isToDirectionOf(direction, source, rect2)) {
                return true;
            }

            // for horizontal directions, being exclusively in beam always wins
            if ((direction == View.FOCUS_LEFT || direction == View.FOCUS_RIGHT)) {
                return true;
            }

            // for vertical directions, beams only beat up to a point:
            // now, as long as rect2 isn't completely closer, rect1 wins
            // e.g for direction down, completely closer means for rect2's top
            // edge to be closer to the source's top edge than rect1's bottom edge.
            return (FocusFinder.majorAxisDistance(direction, source, rect1)
            < FocusFinder.majorAxisDistanceToFarEdge(direction, source, rect2));
        }

        /**
         * Fudge-factor opportunity: how to calculate distance given major and minor
         * axis distances.  Warning: this fudge factor is finely tuned, be sure to
         * run all focus tests if you dare tweak it.
         */
        getWeightedDistanceFor(majorAxisDistance:number, minorAxisDistance:number):number {
            return 13 * majorAxisDistance * majorAxisDistance
                + minorAxisDistance * minorAxisDistance;
        }

        /**
         * Is destRect a candidate for the next focus given the direction?  This
         * checks whether the dest is at least partially to the direction of (e.g left of)
         * from source.
         *
         * Includes an edge case for an empty rect (which is used in some cases when
         * searching from a point on the screen).
         */
        isCandidate(srcRect:Rect, destRect:Rect, direction:number):boolean {
            switch (direction) {
                case View.FOCUS_LEFT:
                    return (srcRect.right > destRect.right || srcRect.left >= destRect.right)
                        && srcRect.left > destRect.left;
                case View.FOCUS_RIGHT:
                    return (srcRect.left < destRect.left || srcRect.right <= destRect.left)
                        && srcRect.right < destRect.right;
                case View.FOCUS_UP:
                    return (srcRect.bottom > destRect.bottom || srcRect.top >= destRect.bottom)
                        && srcRect.top > destRect.top;
                case View.FOCUS_DOWN:
                    return (srcRect.top < destRect.top || srcRect.bottom <= destRect.top)
                        && srcRect.bottom < destRect.bottom;
            }
            throw new Error("direction must be one of "
                + "{FOCUS_UP, FOCUS_DOWN, FOCUS_LEFT, FOCUS_RIGHT}.");
        }

        /**
         * Do the "beams" w.r.t the given direction's axis of rect1 and rect2 overlap?
         * @param direction the direction (up, down, left, right)
         * @param rect1 The first rectangle
         * @param rect2 The second rectangle
         * @return whether the beams overlap
         */
        beamsOverlap(direction:number, rect1:Rect, rect2:Rect):boolean {
            switch (direction) {
                case View.FOCUS_LEFT:
                case View.FOCUS_RIGHT:
                    return (rect2.bottom >= rect1.top) && (rect2.top <= rect1.bottom);
                case View.FOCUS_UP:
                case View.FOCUS_DOWN:
                    return (rect2.right >= rect1.left) && (rect2.left <= rect1.right);
            }
            throw new Error("direction must be one of "
                + "{FOCUS_UP, FOCUS_DOWN, FOCUS_LEFT, FOCUS_RIGHT}.");
        }

        /**
         * e.g for left, is 'to left of'
         */
        isToDirectionOf(direction:number, src:Rect, dest:Rect):boolean {
            switch (direction) {
                case View.FOCUS_LEFT:
                    return src.left >= dest.right;
                case View.FOCUS_RIGHT:
                    return src.right <= dest.left;
                case View.FOCUS_UP:
                    return src.top >= dest.bottom;
                case View.FOCUS_DOWN:
                    return src.bottom <= dest.top;
            }
            throw new Error("direction must be one of "
                + "{FOCUS_UP, FOCUS_DOWN, FOCUS_LEFT, FOCUS_RIGHT}.");
        }
        /**
         * @return The distance from the edge furthest in the given direction
         *   of source to the edge nearest in the given direction of dest.  If the
         *   dest is not in the direction from source, return 0.
         */
        static majorAxisDistance(direction:number, source:Rect, dest:Rect):number {
            return Math.max(0, FocusFinder.majorAxisDistanceRaw(direction, source, dest));
        }
        static majorAxisDistanceRaw(direction:number, source:Rect, dest:Rect):number {
            switch (direction) {
                case View.FOCUS_LEFT:
                    return source.left - dest.right;
                case View.FOCUS_RIGHT:
                    return dest.left - source.right;
                case View.FOCUS_UP:
                    return source.top - dest.bottom;
                case View.FOCUS_DOWN:
                    return dest.top - source.bottom;
            }
            throw new Error("direction must be one of "
                + "{FOCUS_UP, FOCUS_DOWN, FOCUS_LEFT, FOCUS_RIGHT}.");
        }
        /**
         * @return The distance along the major axis w.r.t the direction from the
         *   edge of source to the far edge of dest. If the
         *   dest is not in the direction from source, return 1 (to break ties with
         *   {@link #majorAxisDistance}).
         */
        static majorAxisDistanceToFarEdge(direction:number, source:Rect, dest:Rect):number {
            return Math.max(1, FocusFinder.majorAxisDistanceToFarEdgeRaw(direction, source, dest));
        }
        static majorAxisDistanceToFarEdgeRaw(direction:number, source:Rect, dest:Rect):number {
            switch (direction) {
                case View.FOCUS_LEFT:
                    return source.left - dest.left;
                case View.FOCUS_RIGHT:
                    return dest.right - source.right;
                case View.FOCUS_UP:
                    return source.top - dest.top;
                case View.FOCUS_DOWN:
                    return dest.bottom - source.bottom;
            }
            throw new Error("direction must be one of "
                + "{FOCUS_UP, FOCUS_DOWN, FOCUS_LEFT, FOCUS_RIGHT}.");
        }
        /**
         * Find the distance on the minor axis w.r.t the direction to the nearest
         * edge of the destination rectangle.
         * @param direction the direction (up, down, left, right)
         * @param source The source rect.
         * @param dest The destination rect.
         * @return The distance.
         */
        static minorAxisDistance(direction:number, source:Rect, dest:Rect):number {
            switch (direction) {
                case View.FOCUS_LEFT:
                case View.FOCUS_RIGHT:
                    // the distance between the center verticals
                    return Math.abs(
                        ((source.top + source.height() / 2) -
                        ((dest.top + dest.height() / 2))));
                case View.FOCUS_UP:
                case View.FOCUS_DOWN:
                    // the distance between the center horizontals
                    return Math.abs(
                        ((source.left + source.width() / 2) -
                        ((dest.left + dest.width() / 2))));
            }
            throw new Error("direction must be one of "
                + "{FOCUS_UP, FOCUS_DOWN, FOCUS_LEFT, FOCUS_RIGHT}.");
        }

        /**
         * Find the nearest touchable view to the specified view.
         *
         * @param root The root of the tree in which to search
         * @param x X coordinate from which to start the search
         * @param y Y coordinate from which to start the search
         * @param direction Direction to look
         * @param deltas Offset from the <x, y> to the edge of the nearest view. Note that this array
         *        may already be populated with values.
         * @return The nearest touchable view, or null if none exists.
         */
        findNearestTouchable(root:ViewGroup, x:number, y:number, direction:number, deltas:number[]):View {
            let touchables = root.getTouchables();
            let minDistance = Number.MAX_SAFE_INTEGER;
            let closest = null;

            let numTouchables = touchables.size();

            let edgeSlop = ViewConfiguration.get().getScaledEdgeSlop();

            let closestBounds = new Rect();
            let touchableBounds = this.mOtherRect;

            for (let i = 0; i < numTouchables; i++) {
                let touchable = touchables.get(i);

                // get visible bounds of other view in same coordinate system
                touchable.getDrawingRect(touchableBounds);

                root.offsetRectBetweenParentAndChild(touchable, touchableBounds, true, true);

                if (!this.isTouchCandidate(x, y, touchableBounds, direction)) {
                    continue;
                }

                let distance = Number.MAX_SAFE_INTEGER;

                switch (direction) {
                    case View.FOCUS_LEFT:
                        distance = x - touchableBounds.right + 1;
                        break;
                    case View.FOCUS_RIGHT:
                        distance = touchableBounds.left;
                        break;
                    case View.FOCUS_UP:
                        distance = y - touchableBounds.bottom + 1;
                        break;
                    case View.FOCUS_DOWN:
                        distance = touchableBounds.top;
                        break;
                }

                if (distance < edgeSlop) {
                    // Give preference to innermost views
                    if (closest == null ||
                        closestBounds.contains(touchableBounds) ||
                        (!touchableBounds.contains(closestBounds) && distance < minDistance)) {
                        minDistance = distance;
                        closest = touchable;
                        closestBounds.set(touchableBounds);
                        switch (direction) {
                            case View.FOCUS_LEFT:
                                deltas[0] = -distance;
                                break;
                            case View.FOCUS_RIGHT:
                                deltas[0] = distance;
                                break;
                            case View.FOCUS_UP:
                                deltas[1] = -distance;
                                break;
                            case View.FOCUS_DOWN:
                                deltas[1] = distance;
                                break;
                        }
                    }
                }
            }
            return closest;
        }


        /**
         * Is destRect a candidate for the next touch given the direction?
         */
        private isTouchCandidate(x:number, y:number, destRect:Rect, direction:number):boolean {
            switch (direction) {
                case View.FOCUS_LEFT:
                    return destRect.left <= x && destRect.top <= y && y <= destRect.bottom;
                case View.FOCUS_RIGHT:
                    return destRect.left >= x && destRect.top <= y && y <= destRect.bottom;
                case View.FOCUS_UP:
                    return destRect.top <= y && destRect.left <= x && x <= destRect.right;
                case View.FOCUS_DOWN:
                    return destRect.top >= y && destRect.left <= x && x <= destRect.right;
            }
            throw new Error("direction must be one of "
                + "{FOCUS_UP, FOCUS_DOWN, FOCUS_LEFT, FOCUS_RIGHT}.");
        }


    }


    /**
     * Sorts views according to their visual layout and geometry for default tab order.
     * This is used for sequential focus traversal.
     */
    class SequentialFocusComparator {
        mFirstRect = new Rect();
        mSecondRect = new Rect();
        mRoot:ViewGroup;
        private mIsLayoutRtl = false;

        recycle() {
            this.mRoot = null;
        }
        setRoot(root:ViewGroup) {
            this.mRoot = root;
        }
        private getRect(view:View, rect:Rect) {
            view.getDrawingRect(rect);
            this.mRoot.offsetDescendantRectToMyCoords(view, rect);
        }

        private compareFn = (first:View, second:View):number=>{
            if (first == second) {
                return 0;
            }

            this.getRect(first, this.mFirstRect);
            this.getRect(second, this.mSecondRect);

            if (this.mFirstRect.top < this.mSecondRect.top) {
                return -1;
            } else if (this.mFirstRect.top > this.mSecondRect.top) {
                return 1;
            } else if (this.mFirstRect.left < this.mSecondRect.left) {
                return this.mIsLayoutRtl ? 1 : -1;
            } else if (this.mFirstRect.left > this.mSecondRect.left) {
                return this.mIsLayoutRtl ? -1 : 1;
            } else if (this.mFirstRect.bottom < this.mSecondRect.bottom) {
                return -1;
            } else if (this.mFirstRect.bottom > this.mSecondRect.bottom) {
                return 1;
            } else if (this.mFirstRect.right < this.mSecondRect.right) {
                return this.mIsLayoutRtl ? 1 : -1;
            } else if (this.mFirstRect.right > this.mSecondRect.right) {
                return this.mIsLayoutRtl ? -1 : 1;
            } else {
                // The view are distinct but completely coincident so we consider
                // them equal for our purposes.  Since the sort is stable, this
                // means that the views will retain their layout order relative to one another.
                return 0;
            }
        }
        sort(array:ArrayList<View>){
            array.sort(this.compareFn);
        }
    }
}
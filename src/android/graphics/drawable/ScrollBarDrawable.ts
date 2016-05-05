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

///<reference path="Drawable.ts"/>
///<reference path="../Canvas.ts"/>

module android.graphics.drawable{
    import Drawable = android.graphics.drawable.Drawable;
    import Canvas = android.graphics.Canvas;

    export class ScrollBarDrawable extends Drawable {
        private mVerticalTrack:Drawable;
        private mHorizontalTrack:Drawable;
        private mVerticalThumb:Drawable;
        private mHorizontalThumb:Drawable;

        private mRange = 0;
        private mOffset = 0;
        private mExtent = 0;
        private mVertical = false;
        private mChanged = false;
        private mRangeChanged = false;
        private mTempBounds = new Rect();
        private mAlwaysDrawHorizontalTrack= false;
        private mAlwaysDrawVerticalTrack= false;

        /**
         * Indicate whether the horizontal scrollbar track should always be drawn regardless of the
         * extent. Defaults to false.
         *
         * @param alwaysDrawTrack Set to true if the track should always be drawn
         */
        setAlwaysDrawHorizontalTrack(alwaysDrawTrack:boolean) {
            this.mAlwaysDrawHorizontalTrack = alwaysDrawTrack;
        }
        /**
         * Indicate whether the vertical scrollbar track should always be drawn regardless of the
         * extent. Defaults to false.
         *
         * @param alwaysDrawTrack Set to true if the track should always be drawn
         */
        setAlwaysDrawVerticalTrack(alwaysDrawTrack:boolean) {
            this.mAlwaysDrawVerticalTrack = alwaysDrawTrack;
        }
        /**
         * Indicates whether the vertical scrollbar track should always be drawn regardless of the
         * extent.
         */
        getAlwaysDrawVerticalTrack() {
            return this.mAlwaysDrawVerticalTrack;
        }
        /**
         * Indicates whether the horizontal scrollbar track should always be drawn regardless of the
         * extent.
         */
        getAlwaysDrawHorizontalTrack() {
            return this.mAlwaysDrawHorizontalTrack;
        }
        setParameters(range:number, offset:number, extent:number, vertical:boolean) {
            if (this.mVertical != vertical) {
                this.mChanged = true;
            }

            if (this.mRange != range || this.mOffset != offset || this.mExtent != extent) {
                this.mRangeChanged = true;
            }

            this.mRange = range;
            this.mOffset = offset;
            this.mExtent = extent;
            this.mVertical = vertical;
        }


        draw(canvas) {
            const vertical = this.mVertical;
            const extent = this.mExtent;
            const range = this.mRange;

            let drawTrack = true;
            let drawThumb = true;
            if (extent <= 0 || range <= extent) {
                drawTrack = vertical ? this.mAlwaysDrawVerticalTrack : this.mAlwaysDrawHorizontalTrack;
                drawThumb = false;
            }

            let r = this.getBounds();
            //if (canvas.quickReject(r.left, r.top, r.right, r.bottom, Canvas.EdgeType.AA)) {
            //    return;
            //}
            if (drawTrack) {
                this.drawTrack(canvas, r, vertical);
            }

            if (drawThumb) {
                let size = vertical ? r.height() : r.width();
                let thickness = vertical ? r.width() : r.height();
                let length = Math.round( size * extent / range);
                let offset = Math.round( (size - length) * this.mOffset / (range - extent));

                // avoid the tiny thumb
                let minLength = thickness * 2;
                if (length < minLength) {
                    length = minLength;
                }
                // avoid the too-big thumb
                if (offset + length > size) {
                    offset = size - length;
                }

                this.drawThumb(canvas, r, offset, length, vertical);
            }
        }

        protected onBoundsChange(bounds:android.graphics.Rect) {
            super.onBoundsChange(bounds);
            this.mChanged = true;
        }

        drawTrack(canvas:Canvas, bounds:Rect, vertical:boolean) {
            let track:Drawable;
            if (vertical) {
                track = this.mVerticalTrack;
            } else {
                track = this.mHorizontalTrack;
            }
            if (track != null) {
                if (this.mChanged) {
                    track.setBounds(bounds);
                }
                track.draw(canvas);
            }
        }

        drawThumb(canvas:Canvas, bounds:Rect, offset:number, length:number, vertical:boolean) {
            const thumbRect = this.mTempBounds;
            const changed = this.mRangeChanged || this.mChanged;
            if (changed) {
                if (vertical) {
                    thumbRect.set(bounds.left,  bounds.top + offset,
                        bounds.right, bounds.top + offset + length);
                } else {
                    thumbRect.set(bounds.left + offset, bounds.top,
                        bounds.left + offset + length, bounds.bottom);
                }
            }

            if (vertical) {
                const thumb = this.mVerticalThumb;
                if (changed) thumb.setBounds(thumbRect);
                thumb.draw(canvas);
            } else {
                const thumb = this.mHorizontalThumb;
                if (changed) thumb.setBounds(thumbRect);
                thumb.draw(canvas);
            }
        }

        setVerticalThumbDrawable(thumb:Drawable) {
            if (thumb != null) {
                this.mVerticalThumb = thumb;
            }
        }

        setVerticalTrackDrawable(track:Drawable) {
            this.mVerticalTrack = track;
        }

        setHorizontalThumbDrawable(thumb:Drawable) {
            if (thumb != null) {
                this.mHorizontalThumb = thumb;
            }
        }

        setHorizontalTrackDrawable(track:Drawable) {
            this.mHorizontalTrack = track;
        }

        getSize(vertical:boolean):number {
            if (vertical) {
                return (this.mVerticalTrack != null ?
                    this.mVerticalTrack : this.mVerticalThumb).getIntrinsicWidth();
            } else {
                return (this.mHorizontalTrack != null ?
                    this.mHorizontalTrack : this.mHorizontalThumb).getIntrinsicHeight();
            }
        }

        setAlpha(alpha:number) {
            if (this.mVerticalTrack != null) {
                this.mVerticalTrack.setAlpha(alpha);
            }
            this.mVerticalThumb.setAlpha(alpha);
            if (this.mHorizontalTrack != null) {
                this.mHorizontalTrack.setAlpha(alpha);
            }
            this.mHorizontalThumb.setAlpha(alpha);
        }

        getAlpha():number {
            // All elements should have same alpha, just return one of them
            return this.mVerticalThumb.getAlpha();
        }

        getOpacity():number {
            return PixelFormat.TRANSLUCENT;
        }

        toString() {
            return "ScrollBarDrawable: range=" + this.mRange + " offset=" + this.mOffset +
                " extent=" + this.mExtent + (this.mVertical ? " V" : " H");
        }

    }
}
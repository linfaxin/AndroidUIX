/**
 * Created by linfaxin on 15/10/9.
 */
///<reference path="../graphics/Rect.ts"/>

module android.view{
    import Rect = android.graphics.Rect;

    export class Gravity{
        /** Constant indicating that no gravity has been set **/
        static NO_GRAVITY = 0x0000;

        /** Raw bit indicating the gravity for an axis has been specified. */
        static AXIS_SPECIFIED = 0x0001;

        /** Raw bit controlling how the left/top edge is placed. */
        static AXIS_PULL_BEFORE = 0x0002;
        /** Raw bit controlling how the right/bottom edge is placed. */
        static AXIS_PULL_AFTER = 0x0004;
        /** Raw bit controlling whether the right/bottom edge is clipped to its
         * container, based on the gravity direction being applied. */
        static AXIS_CLIP = 0x0008;

        /** Bits defining the horizontal axis. */
        static AXIS_X_SHIFT = 0;
        /** Bits defining the vertical axis. */
        static AXIS_Y_SHIFT = 4;

        /** Push object to the top of its container, not changing its size. */
        static TOP = (Gravity.AXIS_PULL_BEFORE|Gravity.AXIS_SPECIFIED)<<Gravity.AXIS_Y_SHIFT;
        /** Push object to the bottom of its container, not changing its size. */
        static BOTTOM = (Gravity.AXIS_PULL_AFTER|Gravity.AXIS_SPECIFIED)<<Gravity.AXIS_Y_SHIFT;
        /** Push object to the left of its container, not changing its size. */
        static LEFT = (Gravity.AXIS_PULL_BEFORE|Gravity.AXIS_SPECIFIED)<<Gravity.AXIS_X_SHIFT;
        /** Push object to the right of its container, not changing its size. */
        static RIGHT = (Gravity.AXIS_PULL_AFTER|Gravity.AXIS_SPECIFIED)<<Gravity.AXIS_X_SHIFT;
        static START = Gravity.LEFT;
        static END = Gravity.RIGHT;

        /** Place object in the vertical center of its container, not changing its
         *  size. */
        static CENTER_VERTICAL = Gravity.AXIS_SPECIFIED<<Gravity.AXIS_Y_SHIFT;
        /** Grow the vertical size of the object if needed so it completely fills
         *  its container. */
        static FILL_VERTICAL = Gravity.TOP|Gravity.BOTTOM;

        /** Place object in the horizontal center of its container, not changing its
         *  size. */
        static CENTER_HORIZONTAL = Gravity.AXIS_SPECIFIED<<Gravity.AXIS_X_SHIFT;
        /** Grow the horizontal size of the object if needed so it completely fills
         *  its container. */
        static FILL_HORIZONTAL = Gravity.LEFT|Gravity.RIGHT;

        /** Place the object in the center of its container in both the vertical
         *  and horizontal axis, not changing its size. */
        static CENTER = Gravity.CENTER_VERTICAL|Gravity.CENTER_HORIZONTAL;

        /** Grow the horizontal and vertical size of the object if needed so it
         *  completely fills its container. */
        static FILL = Gravity.FILL_VERTICAL|Gravity.FILL_HORIZONTAL;

        /** Flag to clip the edges of the object to its container along the
         *  vertical axis. */
        static CLIP_VERTICAL = Gravity.AXIS_CLIP<<Gravity.AXIS_Y_SHIFT;

        /** Flag to clip the edges of the object to its container along the
         *  horizontal axis. */
        static CLIP_HORIZONTAL = Gravity.AXIS_CLIP<<Gravity.AXIS_X_SHIFT;

        /** Raw bit controlling whether the layout direction is relative or not (Gravity.START/Gravity.END instead of
         * absolute Gravity.LEFT/Gravity.RIGHT).
         */
        //static RELATIVE_LAYOUT_DIRECTION = 0x00800000;

        /**
         * Binary mask to get the absolute horizontal gravity of a gravity.
         */
        static HORIZONTAL_GRAVITY_MASK = (Gravity.AXIS_SPECIFIED |
        Gravity.AXIS_PULL_BEFORE | Gravity.AXIS_PULL_AFTER) << Gravity.AXIS_X_SHIFT;
        /**
         * Binary mask to get the vertical gravity of a gravity.
         */
        static VERTICAL_GRAVITY_MASK = (Gravity.AXIS_SPECIFIED |
            Gravity.AXIS_PULL_BEFORE | Gravity.AXIS_PULL_AFTER) << Gravity.AXIS_Y_SHIFT;

        static RELATIVE_HORIZONTAL_GRAVITY_MASK = Gravity.HORIZONTAL_GRAVITY_MASK;

        /** Special constant to enable clipping to an overall display along the
         *  vertical dimension.  This is not applied by default by
         *  {@link #apply(int, int, int, Rect, int, int, Rect)}; you must do so
         *  yourself by calling {@link #applyDisplay}.
         */
        static DISPLAY_CLIP_VERTICAL = 0x10000000;

        /** Special constant to enable clipping to an overall display along the
         *  horizontal dimension.  This is not applied by default by
         *  {@link #apply(int, int, int, Rect, int, int, Rect)}; you must do so
         *  yourself by calling {@link #applyDisplay}.
         */
        static DISPLAY_CLIP_HORIZONTAL = 0x01000000;

        /** Push object to x-axis position at the start of its container, not changing its size. */
        //static START = Gravity.RELATIVE_LAYOUT_DIRECTION | Gravity.LEFT;

        /** Push object to x-axis position at the end of its container, not changing its size. */
        //static END = Gravity.RELATIVE_LAYOUT_DIRECTION | Gravity.RIGHT;

        /**
         * Binary mask for the horizontal gravity and script specific direction bit.
         */
        //static RELATIVE_HORIZONTAL_GRAVITY_MASK = Gravity.START | Gravity.END;

        static apply(gravity:number, w:number, h:number, container:Rect, outRect:Rect, layoutDirection?:number) {
            let xAdj = 0, yAdj = 0;
            if(layoutDirection!=null) gravity = Gravity.getAbsoluteGravity(gravity, layoutDirection);

            switch (gravity & ((Gravity.AXIS_PULL_BEFORE | Gravity.AXIS_PULL_AFTER) << Gravity.AXIS_X_SHIFT)) {
                case 0:
                    outRect.left = container.left + ((container.right - container.left - w) / 2) + xAdj;
                    outRect.right = outRect.left + w;
                    if ((gravity & (Gravity.AXIS_CLIP << Gravity.AXIS_X_SHIFT)) == (Gravity.AXIS_CLIP << Gravity.AXIS_X_SHIFT)) {
                        if (outRect.left < container.left) {
                            outRect.left = container.left;
                        }
                        if (outRect.right > container.right) {
                            outRect.right = container.right;
                        }
                    }
                    break;
                case Gravity.AXIS_PULL_BEFORE << Gravity.AXIS_X_SHIFT:
                    outRect.left = container.left + xAdj;
                    outRect.right = outRect.left + w;
                    if ((gravity & (Gravity.AXIS_CLIP << Gravity.AXIS_X_SHIFT)) == (Gravity.AXIS_CLIP << Gravity.AXIS_X_SHIFT)) {
                        if (outRect.right > container.right) {
                            outRect.right = container.right;
                        }
                    }
                    break;
                case Gravity.AXIS_PULL_AFTER << Gravity.AXIS_X_SHIFT:
                    outRect.right = container.right - xAdj;
                    outRect.left = outRect.right - w;
                    if ((gravity & (Gravity.AXIS_CLIP << Gravity.AXIS_X_SHIFT)) == (Gravity.AXIS_CLIP << Gravity.AXIS_X_SHIFT)) {
                        if (outRect.left < container.left) {
                            outRect.left = container.left;
                        }
                    }
                    break;
                default:
                    outRect.left = container.left + xAdj;
                    outRect.right = container.right + xAdj;
                    break;
            }
            switch (gravity & ((Gravity.AXIS_PULL_BEFORE | Gravity.AXIS_PULL_AFTER) << Gravity.AXIS_Y_SHIFT)) {
                case 0:
                    outRect.top = container.top + ((container.bottom - container.top - h) / 2) + yAdj;
                    outRect.bottom = outRect.top + h;
                    if ((gravity & (Gravity.AXIS_CLIP << Gravity.AXIS_Y_SHIFT)) == (Gravity.AXIS_CLIP << Gravity.AXIS_Y_SHIFT)) {
                        if (outRect.top < container.top) {
                            outRect.top = container.top;
                        }
                        if (outRect.bottom > container.bottom) {
                            outRect.bottom = container.bottom;
                        }
                    }
                    break;
                case Gravity.AXIS_PULL_BEFORE << Gravity.AXIS_Y_SHIFT:
                    outRect.top = container.top + yAdj;
                    outRect.bottom = outRect.top + h;
                    if ((gravity & (Gravity.AXIS_CLIP << Gravity.AXIS_Y_SHIFT)) == (Gravity.AXIS_CLIP << Gravity.AXIS_Y_SHIFT)) {
                        if (outRect.bottom > container.bottom) {
                            outRect.bottom = container.bottom;
                        }
                    }
                    break;
                case Gravity.AXIS_PULL_AFTER << Gravity.AXIS_Y_SHIFT:
                    outRect.bottom = container.bottom - yAdj;
                    outRect.top = outRect.bottom - h;
                    if ((gravity & (Gravity.AXIS_CLIP << Gravity.AXIS_Y_SHIFT)) == (Gravity.AXIS_CLIP << Gravity.AXIS_Y_SHIFT)) {
                        if (outRect.top < container.top) {
                            outRect.top = container.top;
                        }
                    }
                    break;
                default:
                    outRect.top = container.top + yAdj;
                    outRect.bottom = container.bottom + yAdj;
                    break;
            }
        }

        static getAbsoluteGravity(gravity:number, layoutDirection:number):number {
            return gravity;//no need parse.
        }
        
    }
}
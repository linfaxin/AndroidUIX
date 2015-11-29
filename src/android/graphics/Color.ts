/**
 * Created by linfaxin on 15/10/14.
 */
module android.graphics{
    export class Color {
        static BLACK = 0xFF000000;
        static DKGRAY = 0xFF444444;
        static GRAY = 0xFF888888;
        static LTGRAY = 0xFFCCCCCC;
        static WHITE = 0xFFFFFFFF;
        static RED = 0xFFFF0000;
        static GREEN = 0xFF00FF00;
        static BLUE = 0xFF0000FF;
        static YELLOW = 0xFFFFFF00;
        static CYAN = 0xFF00FFFF;
        static MAGENTA = 0xFFFF00FF;
        static TRANSPARENT = 0;

        /**
         * Return the alpha component of a color int. This is the same as saying
         * color >>> 24
         */
        static alpha(color:number):number {
            return color >>> 24;
        }

        /**
         * Return the red component of a color int. This is the same as saying
         * (color >> 16) & 0xFF
         */
        static red(color:number):number {
            return (color >> 16) & 0xFF;
        }

        /**
         * Return the green component of a color int. This is the same as saying
         * (color >> 8) & 0xFF
         */
        static green(color:number):number {
            return (color >> 8) & 0xFF;
        }

        /**
         * Return the blue component of a color int. This is the same as saying
         * color & 0xFF
         */
        static blue(color:number):number {
            return color & 0xFF;
        }

        /**
         * Return a color-int from red, green, blue components.
         * The alpha component is implicity 255 (fully opaque).
         * These component values should be [0..255], but there is no
         * range check performed, so if they are out of range, the
         * returned color is undefined.
         * @param red  Red component [0..255] of the color
         * @param green Green component [0..255] of the color
         * @param blue  Blue component [0..255] of the color
         */
        static rgb(red:number, green:number, blue:number):number {
            return (0xFF << 24) | (red << 16) | (green << 8) | blue;
        }

        /**
         * Return a color-int from alpha, red, green, blue components.
         * These component values should be [0..255], but there is no
         * range check performed, so if they are out of range, the
         * returned color is undefined.
         * @param alpha Alpha component [0..255] of the color
         * @param red   Red component [0..255] of the color
         * @param green Green component [0..255] of the color
         * @param blue  Blue component [0..255] of the color
         */
        static argb(alpha:number, red:number, green:number, blue:number):number {
            return (alpha << 24) | (red << 16) | (green << 8) | blue;
        }
        static rgba(red:number, green:number, blue:number, alpha:number):number {
            return (alpha << 24) | (red << 16) | (green << 8) | blue;
        }

        /**
         * Parse the color string, and return the corresponding color-int.
         * If the string cannot be parsed, throws an IllegalArgumentException
         * exception. Supported formats are:
         * #RRGGBB
         * #AARRGGBB
         * 'red', 'blue', 'green', 'black', 'white', 'gray', 'cyan', 'magenta',
         * 'yellow', 'lightgray', 'darkgray', 'grey', 'lightgrey', 'darkgrey',
         * 'aqua', 'fuschia', 'lime', 'maroon', 'navy', 'olive', 'purple',
         * 'silver', 'teal'
         */
        static parseColor(colorString:string):number {
            if (colorString.charAt(0) == '#') {
                // Use a long to avoid rollovers on #ffXXXXXX
                let color = parseInt(colorString.substring(1), 16);
                if (colorString.length == 7) {
                    // Set the alpha value
                    color |= 0x00000000ff000000;
                } else if (colorString.length != 9) {
                    throw new Error("Unknown color");
                }
                return color;
            } else {
                let color = Color.sColorNameMap.get(colorString.toLowerCase());
                if (color != null) {
                    return color;
                }
            }
            throw new Error("Unknown color");
        }

        static toARGBHex(color:number):string {
            let r = Color.red(color);
            let g = Color.green(color);
            let b = Color.blue(color);
            let a = Color.alpha(color);
            let hR = r<16 ? '0'+r.toString(16) : r.toString(16);
            let hG = g<16 ? '0'+g.toString(16) : g.toString(16);
            let hB = b<16 ? '0'+b.toString(16) : b.toString(16);
            let hA = a<16 ? '0'+a.toString(16) : a.toString(16);
            return "#"+hA+hR+hG+hB;
        }
        static toRGBAFunc(color:number):string {
            let r = Color.red(color);
            let g = Color.green(color);
            let b = Color.blue(color);
            let a = Color.alpha(color);
            return`rgba(${r},${g},${b},${a/255})`;
        }


        /**
         * Converts an HTML color (named or numeric) to an integer RGB value.
         *
         * @param color Non-null color string.
         *
         * @return A color value, or {@code -1} if the color string could not be interpreted.
         *
         * @hide
         */
        static getHtmlColor(color:string):number {
            let i = Color.sColorNameMap.get(color.toLowerCase());
            return i;
        }

        static sColorNameMap:Map<String, number> = new Map();
    }

    Color.sColorNameMap = new Map<String, number>();
    Color.sColorNameMap.set("black", Color.BLACK);
    Color.sColorNameMap.set("darkgray", Color.DKGRAY);
    Color.sColorNameMap.set("gray", Color.GRAY);
    Color.sColorNameMap.set("lightgray", Color.LTGRAY);
    Color.sColorNameMap.set("white", Color.WHITE);
    Color.sColorNameMap.set("red", Color.RED);
    Color.sColorNameMap.set("green", Color.GREEN);
    Color.sColorNameMap.set("blue", Color.BLUE);
    Color.sColorNameMap.set("yellow", Color.YELLOW);
    Color.sColorNameMap.set("cyan", Color.CYAN);
    Color.sColorNameMap.set("magenta", Color.MAGENTA);
    Color.sColorNameMap.set("aqua", 0xFF00FFFF);
    Color.sColorNameMap.set("fuchsia", 0xFFFF00FF);
    Color.sColorNameMap.set("darkgrey", Color.DKGRAY);
    Color.sColorNameMap.set("grey", Color.GRAY);
    Color.sColorNameMap.set("lightgrey", Color.LTGRAY);
    Color.sColorNameMap.set("lime", 0xFF00FF00);
    Color.sColorNameMap.set("maroon", 0xFF800000);
    Color.sColorNameMap.set("navy", 0xFF000080);
    Color.sColorNameMap.set("olive", 0xFF808000);
    Color.sColorNameMap.set("purple", 0xFF800080);
    Color.sColorNameMap.set("silver", 0xFFC0C0C0);
    Color.sColorNameMap.set("teal", 0xFF008080);
}
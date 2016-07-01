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

module android.graphics{
    /**
     * The Color class defines methods for creating and converting color ints.
     * Colors are represented as packed ints, made up of 4 bytes: alpha, red,
     * green, blue. The values are unpremultiplied, meaning any transparency is
     * stored solely in the alpha component, and not in the color components. The
     * components are stored as follows (alpha << 24) | (red << 16) |
     * (green << 8) | blue. Each component ranges between 0..255 with 0
     * meaning no contribution for that component, and 255 meaning 100%
     * contribution. Thus opaque-black would be 0xFF000000 (100% opaque but
     * no contributions from red, green, or blue), and opaque-white would be
     * 0xFFFFFFFF
     */
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

        /**
         * Return a color-int from alpha, red, green, blue components.
         * These component values should be [0..255], but there is no
         * range check performed, so if they are out of range, the
         * returned color is undefined.
         * @param red   Red component [0..255] of the color
         * @param green Green component [0..255] of the color
         * @param blue  Blue component [0..255] of the color
         * @param alpha Alpha component [0..255] of the color
         */
        static rgba(red:number, green:number, blue:number, alpha:number):number {
            return (alpha << 24) | (red << 16) | (green << 8) | blue;
        }

        /**
         * Parse the color string, and return the corresponding color-int.
         * If the string cannot be parsed, throws an IllegalArgumentException
         * exception. Supported formats are:
         * #RGB
         * #RRGGBB
         * #AARRGGBB
         * rgb(r, g, b)
         * rgba(r, g, b)
         * 'red', 'blue', 'green', 'black', 'white', 'gray', 'cyan', 'magenta',
         * 'yellow', 'lightgray', 'darkgray', 'grey', 'lightgrey', 'darkgrey',
         * 'aqua', 'fuschia', 'lime', 'maroon', 'navy', 'olive', 'purple',
         * 'silver', 'teal', 'transparent'
         */
        static parseColor(colorString:string, defaultColor?:number):number {
            if (colorString.charAt(0) == '#') {
                if (colorString.length === 4) {//support parse #333
                    colorString = '#' + colorString[1] + colorString[1] + colorString[2] + colorString[2] + colorString[3] + colorString[3];
                }
                // Use a long to avoid rollovers on #ffXXXXXX
                let color = parseInt(colorString.substring(1), 16);
                if (colorString.length == 7) {
                    // Set the alpha value
                    color |= 0x00000000ff000000;
                } else if (colorString.length != 9) {
                    if(defaultColor!=null) return defaultColor;
                    throw new Error("Unknown color : " + colorString);
                }
                return color;

            } else if (colorString.startsWith('rgb(')) {
                colorString = colorString.substring(colorString.indexOf('(')+1, colorString.lastIndexOf(')'));
                let parts = colorString.split(',');
                return Color.rgb(Number.parseInt(parts[0]), Number.parseInt(parts[1]), Number.parseInt(parts[2]));

            } else if (colorString.startsWith('rgba(')) {
                colorString = colorString.substring(colorString.indexOf('(')+1, colorString.lastIndexOf(')'));
                let parts = colorString.split(',');
                return Color.rgba(Number.parseInt(parts[0]), Number.parseInt(parts[1]),
                    Number.parseInt(parts[2]), Number.parseFloat(parts[3]) * 255);

            } else {
                let color = Color.sColorNameMap.get(colorString.toLowerCase());
                if (color != null) {
                    return color;
                }
            }
            if(defaultColor!=null) return defaultColor;
            throw new Error("Unknown color : " + colorString);
        }

        /**
         * convert color value to hex color string (#xxxxxxxx)
         * @param color c
         * @returns {string} #xxxxxxxx
         */
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
        /**
         * convert color value to css color func string rgba(xx,xx,xx,x)
         * @param color c
         * @returns {string} rgba(xx,xx,xx,x)
         */
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
    //androidui add
    Color.sColorNameMap.set("transparent", Color.TRANSPARENT);
}
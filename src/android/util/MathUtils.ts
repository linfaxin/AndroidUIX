/*
 * Copyright (C) 2009 The Android Open Source Project
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

module android.util {
/**
 * A class that contains utility methods related to numbers.
 * 
 * @hide Pending API council approval
 */
export class MathUtils {

    private static DEG_TO_RAD:number = 3.1415926 / 180.0;

    private static RAD_TO_DEG:number = 180.0 / 3.1415926;

     constructor() {
    }

    static abs(v:number):number  {
        return v > 0 ? v : -v;
    }

    static constrain(amount:number, low:number, high:number):number  {
        return amount < low ? low : (amount > high ? high : amount);
    }

    static log(a:number):number  {
        return <number> Math.log(a);
    }

    static exp(a:number):number  {
        return <number> Math.exp(a);
    }

    static pow(a:number, b:number):number  {
        return <number> Math.pow(a, b);
    }

    static max(a:number, b:number, c?:number):number  {
        if(c==null) return a > b ? a : b;
        return a > b ? (a > c ? a : c) : (b > c ? b : c);
    }

    static min(a:number, b:number, c?:number):number  {
        if(c==null) return a < b ? a : b;
        return a < b ? (a < c ? a : c) : (b < c ? b : c);
    }

    static dist(x1:number, y1:number, x2:number, y2:number):number  {
        const x:number = (x2 - x1);
        const y:number = (y2 - y1);
        return <number> Math.sqrt(x * x + y * y);
    }

    static dist3(x1:number, y1:number, z1:number, x2:number, y2:number, z2:number):number  {
        const x:number = (x2 - x1);
        const y:number = (y2 - y1);
        const z:number = (z2 - z1);
        return <number> Math.sqrt(x * x + y * y + z * z);
    }

    static mag(a:number, b:number, c?:number):number  {
        if(c==null) return <number> Math.sqrt(a * a + b * b);
        return <number> Math.sqrt(a * a + b * b + c * c);
    }

    static sq(v:number):number  {
        return v * v;
    }

    static radians(degrees:number):number  {
        return degrees * MathUtils.DEG_TO_RAD;
    }

    static degrees(radians:number):number  {
        return radians * MathUtils.RAD_TO_DEG;
    }

    static acos(value:number):number  {
        return <number> Math.acos(value);
    }

    static asin(value:number):number  {
        return <number> Math.asin(value);
    }

    static atan(value:number):number  {
        return <number> Math.atan(value);
    }

    static atan2(a:number, b:number):number  {
        return <number> Math.atan2(a, b);
    }

    static tan(angle:number):number  {
        return <number> Math.tan(angle);
    }

    static lerp(start:number, stop:number, amount:number):number  {
        return start + (stop - start) * amount;
    }

    static norm(start:number, stop:number, value:number):number  {
        return (value - start) / (stop - start);
    }

    static map(minStart:number, minStop:number, maxStart:number, maxStop:number, value:number):number  {
        return maxStart + (maxStart - maxStop) * ((value - minStart) / (minStop - minStart));
    }

    static random(howbig:number):number ;
    static random(howsmall:number, howbig:number):number;
    static random(...args):number  {
        if(args.length==1) return Math.random() * args[0];
        let [howsmall, howbig] = args;
        if (howsmall >= howbig) return howsmall;
        return Math.random() * (howbig - howsmall) + howsmall;
    }

}
}
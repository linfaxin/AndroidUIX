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


module android.os{
    /**
     * A mapping from String values to various Parcelable types.
     * NOTE: lite impl of Android Bundle
     */
    export class Bundle{
        constructor(copy?:Bundle){
            if(copy) Object.assign(this, copy);
        }

        get(key:string, defaultValue:any){
            if(this.containsKey(key)){
                return this[key];
            }
            return defaultValue;
        }

        put(key:string, value:any){
            this[key] = value;
        }

        containsKey(key:string){
            return key in this;
        }
    }
}
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


module android.graphics.drawable {
/**
 * Interface that drawables suporting animations should implement.
 */
export interface Animatable {

    /**
     * Starts the drawable's animation.
     */
    start():void ;

    /**
     * Stops the drawable's animation.
     */
    stop():void ;

    /**
     * Indicates whether the animation is running.
     * 
     * @return True if the animation is running, false otherwise.
     */
    isRunning():boolean ;
}
    export module Animatable{
        export function isImpl(obj){
            return obj && obj['start'] && obj['stop'] && obj['isRunning'];
        }
    }
}
/*
 * Copyright (C) 2012 The Android Open Source Project
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

///<reference path="../../android/util/Log.ts"/>

module android.os {
import Log = android.util.Log;
/**
 * Writes trace events to the system trace buffer.  These trace events can be
 * collected and visualized using the Systrace tool.
 *
 * This tracing mechanism is independent of the method tracing mechanism
 * offered by {@link Debug#startMethodTracing}.  In particular, it enables
 * tracing of events that occur across multiple processes.
 */
export class Trace {

    /*
     * Writes trace events to the kernel trace buffer.  These trace events can be
     * collected using the "atrace" program for offline analysis.
     */
    private static TAG:string = "Trace";

    // These tags must be kept in sync with system/core/include/cutils/trace.h.
    /** @hide */
    static TRACE_TAG_NEVER:number = 0;

    /** @hide */
    static TRACE_TAG_ALWAYS:number = 1 << 0;

    /** @hide */
    static TRACE_TAG_GRAPHICS:number = 1 << 1;

    /** @hide */
    static TRACE_TAG_INPUT:number = 1 << 2;

    /** @hide */
    static TRACE_TAG_VIEW:number = 1 << 3;

    /** @hide */
    static TRACE_TAG_WEBVIEW:number = 1 << 4;

    /** @hide */
    static TRACE_TAG_WINDOW_MANAGER:number = 1 << 5;

    /** @hide */
    static TRACE_TAG_ACTIVITY_MANAGER:number = 1 << 6;

    /** @hide */
    static TRACE_TAG_SYNC_MANAGER:number = 1 << 7;

    /** @hide */
    static TRACE_TAG_AUDIO:number = 1 << 8;

    /** @hide */
    static TRACE_TAG_VIDEO:number = 1 << 9;

    /** @hide */
    static TRACE_TAG_CAMERA:number = 1 << 10;

    /** @hide */
    static TRACE_TAG_HAL:number = 1 << 11;

    /** @hide */
    static TRACE_TAG_APP:number = 1 << 12;

    /** @hide */
    static TRACE_TAG_RESOURCES:number = 1 << 13;

    /** @hide */
    static TRACE_TAG_DALVIK:number = 1 << 14;

    /** @hide */
    static TRACE_TAG_RS:number = 1 << 15;

    private static TRACE_TAG_NOT_READY:number = 1 << 63;

    private static MAX_SECTION_NAME_LEN:number = 127;

    // Must be volatile to avoid word tearing.
    private static sEnabledTags:number = Trace.TRACE_TAG_NOT_READY;

    private static nativeGetEnabledTags():number {
        return Trace.TRACE_TAG_ALWAYS;
    }

    private static nativeTraceCounter(tag:number, name:string, value:number):void {
    }

    private static nativeTraceBegin(tag:number, name:string):void {}

    private static nativeTraceEnd(tag:number):void {}

    private static nativeAsyncTraceBegin(tag:number, name:string, cookie:number):void {}

    private static nativeAsyncTraceEnd(tag:number, name:string, cookie:number):void {}

    private static nativeSetAppTracingAllowed(allowed:boolean):void {}

    private static nativeSetTracingEnabled(allowed:boolean):void {}


    /**
     * Caches a copy of the enabled-tag bits.  The "master" copy is held by the native code,
     * and comes from the PROPERTY_TRACE_TAG_ENABLEFLAGS property.
     * <p>
     * If the native code hasn't yet read the property, we will cause it to do one-time
     * initialization.  We don't want to do this during class init, because this class is
     * preloaded, so all apps would be stuck with whatever the zygote saw.  (The zygote
     * doesn't see the system-property update broadcasts.)
     * <p>
     * We want to defer initialization until the first use by an app, post-zygote.
     * <p>
     * We're okay if multiple threads call here simultaneously -- the native state is
     * synchronized, and sEnabledTags is volatile (prevents word tearing).
     */
    private static cacheEnabledTags():number  {
        let tags:number = Trace.nativeGetEnabledTags();
        Trace.sEnabledTags = tags;
        return tags;
    }

    /**
     * Returns true if a trace tag is enabled.
     *
     * @param traceTag The trace tag to check.
     * @return True if the trace tag is valid.
     *
     * @hide
     */
    static isTagEnabled(traceTag:number):boolean  {
        let tags:number = Trace.sEnabledTags;
        if (tags == Trace.TRACE_TAG_NOT_READY) {
            tags = Trace.cacheEnabledTags();
        }
        return (tags & traceTag) != 0;
    }

    /**
     * Writes trace message to indicate the value of a given counter.
     *
     * @param traceTag The trace tag.
     * @param counterName The counter name to appear in the trace.
     * @param counterValue The counter value.
     *
     * @hide
     */
    static traceCounter(traceTag:number, counterName:string, counterValue:number):void  {
        if (Trace.isTagEnabled(traceTag)) {
            Trace.nativeTraceCounter(traceTag, counterName, counterValue);
        }
    }

    /**
     * Set whether application tracing is allowed for this process.  This is intended to be set
     * once at application start-up time based on whether the application is debuggable.
     *
     * @hide
     */
    static setAppTracingAllowed(allowed:boolean):void  {
        Trace.nativeSetAppTracingAllowed(allowed);
        // Setting whether app tracing is allowed may change the tags, so we update the cached
        // tags here.
        Trace.cacheEnabledTags();
    }

    /**
     * Set whether tracing is enabled in this process.  Tracing is disabled shortly after Zygote
     * initializes and re-enabled after processes fork from Zygote.  This is done because Zygote
     * has no way to be notified about changes to the tracing tags, and if Zygote ever reads and
     * caches the tracing tags, forked processes will inherit those stale tags.
     *
     * @hide
     */
    static setTracingEnabled(enabled:boolean):void  {
        Trace.nativeSetTracingEnabled(enabled);
        // Setting whether tracing is enabled may change the tags, so we update the cached tags
        // here.
        Trace.cacheEnabledTags();
    }

    /**
     * Writes a trace message to indicate that a given section of code has
     * begun. Must be followed by a call to {@link #traceEnd} using the same
     * tag.
     *
     * @param traceTag The trace tag.
     * @param methodName The method name to appear in the trace.
     *
     * @hide
     */
    static traceBegin(traceTag:number, methodName:string):void  {
        if (Trace.isTagEnabled(traceTag)) {
            Trace.nativeTraceBegin(traceTag, methodName);
        }
    }

    /**
     * Writes a trace message to indicate that the current method has ended.
     * Must be called exactly once for each call to {@link #traceBegin} using the same tag.
     *
     * @param traceTag The trace tag.
     *
     * @hide
     */
    static traceEnd(traceTag:number):void  {
        if (Trace.isTagEnabled(traceTag)) {
            Trace.nativeTraceEnd(traceTag);
        }
    }

    /**
     * Writes a trace message to indicate that a given section of code has
     * begun. Must be followed by a call to {@link #asyncTraceEnd} using the same
     * tag. Unlike {@link #traceBegin(long, String)} and {@link #traceEnd(long)},
     * asynchronous events do not need to be nested. The name and cookie used to
     * begin an event must be used to end it.
     *
     * @param traceTag The trace tag.
     * @param methodName The method name to appear in the trace.
     * @param cookie Unique identifier for distinguishing simultaneous events
     *
     * @hide
     */
    static asyncTraceBegin(traceTag:number, methodName:string, cookie:number):void  {
        if (Trace.isTagEnabled(traceTag)) {
            Trace.nativeAsyncTraceBegin(traceTag, methodName, cookie);
        }
    }

    /**
     * Writes a trace message to indicate that the current method has ended.
     * Must be called exactly once for each call to {@link #asyncTraceBegin(long, String, int)}
     * using the same tag, name and cookie.
     *
     * @param traceTag The trace tag.
     * @param methodName The method name to appear in the trace.
     * @param cookie Unique identifier for distinguishing simultaneous events
     *
     * @hide
     */
    static asyncTraceEnd(traceTag:number, methodName:string, cookie:number):void  {
        if (Trace.isTagEnabled(traceTag)) {
            Trace.nativeAsyncTraceEnd(traceTag, methodName, cookie);
        }
    }

    /**
     * Writes a trace message to indicate that a given section of code has begun. This call must
     * be followed by a corresponding call to {@link #endSection()} on the same thread.
     *
     * <p class="note"> At this time the vertical bar character '|', newline character '\n', and
     * null character '\0' are used internally by the tracing mechanism.  If sectionName contains
     * these characters they will be replaced with a space character in the trace.
     *
     * @param sectionName The name of the code section to appear in the trace.  This may be at
     * most 127 Unicode code units long.
     */
    static beginSection(sectionName:string):void  {
        if (Trace.isTagEnabled(Trace.TRACE_TAG_APP)) {
            if (sectionName.length > Trace.MAX_SECTION_NAME_LEN) {
                throw Error(`new IllegalArgumentException("sectionName is too long")`);
            }
            Trace.nativeTraceBegin(Trace.TRACE_TAG_APP, sectionName);
        }
    }

    /**
     * Writes a trace message to indicate that a given section of code has ended. This call must
     * be preceeded by a corresponding call to {@link #beginSection(String)}. Calling this method
     * will mark the end of the most recently begun section of code, so care must be taken to
     * ensure that beginSection / endSection pairs are properly nested and called from the same
     * thread.
     */
    static endSection():void  {
        if (Trace.isTagEnabled(Trace.TRACE_TAG_APP)) {
            Trace.nativeTraceEnd(Trace.TRACE_TAG_APP);
        }
    }
}
}
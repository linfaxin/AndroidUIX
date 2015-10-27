/**
 * Created by linfaxin on 15/10/5.
 */
module android.util {
    export class Log {
        static View_DBG = false;
        static VelocityTracker_DBG = false;

        /**
         * Priority constant for the getLogMsg method; use Log.v.
         */
        static VERBOSE = 2;
        /**
         * Priority constant for the getLogMsg method; use Log.d.
         */
        static DEBUG = 3;
        /**
         * Priority constant for the getLogMsg method; use Log.i.
         */
        static INFO = 4;
        /**
         * Priority constant for the getLogMsg method; use Log.w.
         */
        static WARN = 5;
        /**
         * Priority constant for the getLogMsg method; use Log.e.
         */
        static ERROR = 6;
        /**
         * Priority constant for the getLogMsg method.
         */
        static ASSERT = 7;
        static PriorityString = ["VERBOSE", "DEBUG", "INFO", "WARN", "ERROR", "ASSERT"];

        static getPriorityString(priority:number):string {
            if (priority > Log.PriorityString.length) return "";
            return Log.PriorityString[priority - 2]
        }


        /**
         * Send a {@link #VERBOSE} log message and log the exception.
         * @param tag Used to identify the source of a log message. It usually identifies
         * the class or activity where the log call occurs.
         * @param msg The message you would like logged.
         * @param tr An exception to log
         */
        static v(tag:string, msg:string, tr?:Error) {
            console.log(Log.getLogMsg(Log.VERBOSE, tag, msg));
            if (tr) console.log(tr);
        }

        /**
         * Send a {@link #DEBUG} log message and log the exception.
         * @param tag Used to identify the source of a log message. It usually identifies
         * the class or activity where the log call occurs.
         * @param msg The message you would like logged.
         * @param tr An exception to log
         */
        static d(tag:string, msg:string) {
            console.debug(Log.getLogMsg(Log.DEBUG, tag, msg));
        }

        /**
         * Send a {@link #INFO} log message and log the exception.
         * @param tag Used to identify the source of a log message. It usually identifies
         * the class or activity where the log call occurs.
         * @param msg The message you would like logged.
         * @param tr An exception to log
         */
        static i(tag:string, msg:string, tr?:Error) {
            console.info(Log.getLogMsg(Log.INFO, tag, msg));
            if (tr) console.info(tr);
        }

        /**
         * Send a {@link #WARN} log message and log the exception.
         * @param tag Used to identify the source of a log message. It usually identifies
         * the class or activity where the log call occurs.
         * @param msg The message you would like logged.
         * @param tr An exception to log
         */
        static w(tag:string, msg:string, tr?:Error) {
            console.warn(Log.getLogMsg(Log.WARN, tag, msg));
            if (tr) console.warn(tr);
        }


        /**
         * Send a {@link #ERROR} log message and log the exception.
         * @param tag Used to identify the source of a log message. It usually identifies
         * the class or activity where the log call occurs.
         * @param msg The message you would like logged.
         * @param tr An exception to log
         */
        static e(tag:string, msg:string, tr?:Error) {
            console.error(Log.getLogMsg(Log.ERROR, tag, msg));
            if (tr) console.error(tr);
        }

        private static getLogMsg(priority:number, tag:string, msg:string):string {
            let d = new Date();
            let dateFormat = d.toLocaleTimeString() + '.' + d.getUTCMilliseconds();
            return "[" + Log.getPriorityString(priority) + "] " + dateFormat + " \t " + tag + " \t " + msg;
        }
    }
}
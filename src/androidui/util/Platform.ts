/**
 * Created by linfaxin on 16/2/4.
 */
module androidui.util {
    export class Platform {
        static isIOS = navigator.userAgent.match(/(iPhone|iPad|iPod|ios)/i) ? true : false;
        static isAndroid = navigator.userAgent.match('Android') ? true : false;
        static isWeChat = navigator.userAgent.match(/MicroMessenger/i) ? true : false;
    }
}
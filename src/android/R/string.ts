/**
 * Created by linfaxin on 15/11/21.
 */
module android.R {
    export module string {
        export var ok = 'ok';
        export var cancel = 'Cancel';
        export var close = 'Close';
        export var back = 'Back';
        export var crash_catch_alert = 'Some error happen, will refresh page:';
    }

    const data = {
        zh: {
            ok: '确定',
            cancel: '取消',
            close: '关闭',
            back: '返回',
            crash_catch_alert: '程序发生错误, 即将重载网页:',
        }
    };

    //merge language special to main
    const lang = navigator.language.split('-')[0].toLowerCase();
    if (data[lang]) {
        Object.assign(string, data[lang]);
    }
}
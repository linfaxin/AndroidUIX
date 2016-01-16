/**
 * Created by linfaxin on 15/11/21.
 */
module android.R{
    export class string_{
        static ok = 'OK';
        static cancel = 'Cancel';
        static crash_catch_alert = 'Some error happen, will refresh page:';

        static prll_header_state_normal = 'Pull to refresh';
        static prll_header_state_ready = 'Release to refresh';
        static prll_header_state_loading = 'Loading';
        static prll_header_state_fail = 'Refresh fail';
        static prll_footer_state_normal = 'Load more';
        static prll_footer_state_loading = 'Loading';
        static prll_footer_state_ready = 'Pull to load more';
        static prll_footer_state_fail = 'Click to reload';
        static prll_footer_state_no_more = 'Load Finish';

        static zh(){
            this.ok = '确定';
            this.cancel = '取消';
            this.crash_catch_alert = '程序发生错误, 即将重载网页:';

            this.prll_header_state_normal = '下拉以刷新';
            this.prll_header_state_ready = '松开马上刷新';
            this.prll_header_state_loading = '正在刷新...';
            this.prll_header_state_fail = '刷新失败';
            this.prll_footer_state_normal = '点击加载更多';
            this.prll_footer_state_loading = '正在加载...';
            this.prll_footer_state_ready = '松开加载更多';
            this.prll_footer_state_no_more = '加载完毕';
            this.prll_footer_state_fail = '加载失败,点击重试';
        }
    }

    //merge language special to main
    const lang = navigator.language.split('-')[0].toLowerCase();
    if(typeof string_[lang] === 'function') string_[lang].call(string_);
}
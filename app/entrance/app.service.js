/**
 * @Author : MILES .
 * @Create : 2017/10/31.
 * @Module : 服务模块
 */
module.exports = ngModule => {
    // 在url中添加时间戳 以注入方式使用
    ngModule.factory("AuthInterceptor", ["$q", "$rootScope", function ($q, $rootScope) {
        return {
            responseError: function (response) {
                return $q.reject(response);
            },
            request: function (config) {
                // 成功的请求方法
                var ts = '?^=' + new Date().getTime();
                if (config.url.indexOf('?') > 0)
                    config.url = config.url.replace('?', ts + '&');
                else
                    config.url = config.url + ts;
                return config;
            }
        };
    }])
}
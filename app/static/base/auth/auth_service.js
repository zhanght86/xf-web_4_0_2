/**
 * Created by Administrator on 2016/6/6.
 */
angular.module('know.auth').factory('AuthService', ['$resource', '$rootScope', '$location', 'Session', 'AUTH_EVENTS','localStorageService', function ($resource, $rootScope, $location, Session, AUTH_EVENTS,localStorageService) {

    var authService = {};
    var loginSuccessFunction = function (fun, result) {
        var data = result.data;
        Session.create(data.id);
        localStorageService.set('SessionId',data.id);
        localStorageService.set('privileges',data.privileges);
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        fun(data);
    }

    var logoutSuccessFunction = function (fun, result) {
        var data = result.data;
        Session.destroy(data.id);
        localStorageService.clearAll();
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        fun(data);
    }

    var authFun = $resource('/back/system/user/:action', {}, {
        login: {
            method: 'POST',
            params: {
                action: 'login'
            },
            isArray: false,
            responseType: 'json'
        },
        checkLoginStatus: {
            method: 'GET',
            params: {
                action: 'loadUser'
            },
            isArray: false,
            responseType: 'json'
        },
        logout: {
            method: 'POST',
            params: {
                action: 'logout'
            },
            isArray: false,
            responseType: 'json'
        },
    });

    authService.login = function (credentials, successFunction,failedFunction) {
        //console.log(credentials)
        authFun.login({
                loginName: credentials.loginName,
                loginPwd: credentials.loginPwd,
                randCheckCode: credentials.randCheckCode,
                rember: credentials.rememberUser
            },
            function (result, b, c) {
                if (result.status == '200') {
                    loginSuccessFunction(successFunction, result)
                    $location.path('/index/home');
                }else{
                    failedFunction(result.err);
                }
            },
            function (a, b, c) {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            })
    };

    authService.logout = function (successFunction,failedFunction) {
        authFun.logout({},
            function (result, b, c) {
                if (result.status == '200') {
                    logoutSuccessFunction(successFunction, result)
                    $location.path('/login');
                }else{
                    failedFunction(result.err);
                }
            },
            function (a, b, c) {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            })
    };

    authService.checkLoginStatus = function (credentials, fun) {
        authFun.checkLoginStatus({}, function (result, b, c) {
            if (result.status == '200') {
                loginSuccessFunction(fun,result)
            }
        }, function (a, b, c) {
            Session.destroy(data.id);
            localStorageService.clearAll();
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        })
    };

    // authService.isAuthenticated = function () {
    //     var isAuthenticated = false;
    //     if(Session.userId)
    //         isAuthenticated = true;
    //     else {
    //         var sessionId = localStorageService.get('SessionId');
    //         if(sessionId)
    //             isAuthenticated = true;
    //     }
    //     return  isAuthenticated;
    // };

    // authService.isAuthorized = function (privileges,name) {
    //     //把路由传进来进行校验
    //     var isAuthorized = true;
    //     if(name != "" && name != null && name.indexOf("index") == -1 && name.indexOf("help") == -1){
    //         if(privileges.indexOf(name) == -1){
    //             isAuthorized = false;
    //         }
    //         if(!authService.isAuthenticated()){
    //             isAuthorized = false;
    //         }
    //     }
    //     return isAuthorized;
    // };
    return authService;
}])

angular.module('know.auth').factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    return {
        responseError: function (response) {
            $rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
                403: AUTH_EVENTS.notAuthorized,
                419: AUTH_EVENTS.sessionTimeout,
                440: AUTH_EVENTS.sessionTimeout
            }[response.status], response);
            return $q.reject(response);
        },
        request: function (config) {
            // 成功的请求方法
            var ts = '?^=' + new Date().getTime();
            if (config.url.indexOf('?') > 0)
                config.url = config.url.replace('?', ts + '&');
            else
                config.url = config.url + ts;
            return config; // 或者 $q.when(config);
        },
    };
})
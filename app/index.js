/**
 * @Author : MILES .
 * @Create : 2017/11/22.
 * @Module :  项目入口模块 以及加载依赖关系
 */
// require('./assets/libs/ng-dialog/css/ngDialog.css');
let routeStates,
    angular,
    ngDepModules = [];
angular = require('angular');
// require("oclazyload") ;
// require("angular-cookies") ;
// require("angular-ui-router");
// require("angular-local-storage");
// require("ng-dialog");
// require("angular-route");
function loadBasicModules() {
    // 按需加载
    require('oclazyload');
    ngDepModules.push('oc.lazyLoad');
    // 路由
    require('angular-ui-router');
    ngDepModules.push('ui.router');
    // resource
    require('angular-resource');
    ngDepModules.push('ngResource');
    // 本地存储
    require('angular-local-storage');
    ngDepModules.push('LocalStorageModule');
    //cookie
    require('angular-cookies');
    ngDepModules.push('ngCookies');
    //弹框
    require('./assets/libs/ng-dialog/js/ngDialog');
    ngDepModules.push('ngDialog');
    // 路由
    require('angular-route');
    ngDepModules.push('ngRoute');
}
loadBasicModules()  ;
// define one angular module
const xf_web = angular.module('xf_web', ngDepModules) ;
// 加载controller
require('./entrance/app.controller')(xf_web);
// 加载指令
require('./entrance/app.directive')(xf_web);
// 加载config
require('./entrance/app.config')(xf_web);
// 加载router
// require('./entrance/app.router')(xf_web);
// 加载service
require('./entrance/app.service')(xf_web);
// 加载filter
require('./components/length_limit/length_limit')(xf_web);
/**
 * 配置路由。
 * 注意这里采用的是ui-router这个路由，而不是ng原生的路由，为了实现路由的多层嵌套
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
xf_web
.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", "localStorageServiceProvider","$routeProvider","$locationProvider",
    "$provide", "$compileProvider", "$controllerProvider", "$filterProvider", "$ocLazyLoadProvider", "constantMethod", "$rootScopeProvider","$cookiesProvider" ,
    function ($stateProvider, $urlRouterProvider, $httpProvider, localStorageServiceProvider,$routeProvider,$locationProvider,
              $provide, $compileProvider, $controllerProvider, $filterProvider, $ocLazyLoadProvider, constantMethod, $rootScopeProvider,$cookiesProvider) {
        $rootScopeProvider.digestTtl(15);
        //--------------------------------------------------
        //            配置ajax请求
        //--------------------------------------------------
        $httpProvider.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
        $httpProvider.defaults.headers.post["Content-Type"] = "application/json";
        // 禁止ajax缓存
        // $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        // $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        //    地址时间戳显示
        // /* 根据url的变化加载内容 */
        $httpProvider.interceptors.push([
            '$injector',
            function ($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);
        //--------------------------------------------------
        //            配置 cookie
        //--------------------------------------------------
        // $cookiesProvider.defaults = {
        //     path: "/",
        //     secure: true
        // };
        //--------------------------------------------------
        //            配置localStorageServiceProvider
        //--------------------------------------------------
        localStorageServiceProvider.setPrefix("xf");
        localStorageServiceProvider.setNotify(true, true);

        //--------------------------------------------------
        //            配置 将依赖的脚本进行注入操作
        //--------------------------------------------------
        xf_web.controller = $controllerProvider.register;
        xf_web.directive = $compileProvider.directive;
        xf_web.filter = $filterProvider.register;
        xf_web.factory = $provide.factory;
        xf_web.service = $provide.service;
        xf_web.constant = $provide.constant;
        xf_web.value = $provide.value;
        //--------------------------------------------------
        //            配置 将依赖的脚本进行注入操作
        //--------------------------------------------------
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            modules: constantMethod.Modules_Config
        });
        //--------------------------------------------------
        //            路由 配置
        //--------------------------------------------------
        // $locationProvider.hashPrefix('!');
        // $locationProvider.html5Mode(true);    // 如果不设置 路由不会生效
        routeStates = require('./entrance/app.router')(angular,constantMethod);
        routeStates.forEach(state => {
            $stateProvider.state(state);
        });
        $urlRouterProvider.otherwise(function($injector, $location){
            $location.path('/login');
        });
    }]);




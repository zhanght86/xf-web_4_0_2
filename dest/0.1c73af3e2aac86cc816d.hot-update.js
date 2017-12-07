webpackHotUpdate(0,[
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/11/22.
	 * @Module :  项目入口模块 以及加载依赖关系
	 */
	// require('./assets/libs/ng-dialog/css/ngDialog.css');
	var routeStates = void 0,
	    angular = void 0,
	    ngDepModules = [];
	angular = __webpack_require__(2);
	// require("oclazyload") ;
	// require("angular-cookies") ;
	// require("angular-ui-router");
	// require("angular-local-storage");
	// require("ng-dialog");
	// require("angular-route");
	function loadBasicModules() {
	    // 按需加载
	    __webpack_require__(5);
	    ngDepModules.push('oc.lazyLoad');
	    // 路由
	    __webpack_require__(6);
	    ngDepModules.push('ui.router');
	    // resource
	    __webpack_require__(7);
	    ngDepModules.push('ngResource');
	    // 本地存储
	    __webpack_require__(9);
	    ngDepModules.push('LocalStorageModule');
	    //cookie
	    __webpack_require__(11);
	    ngDepModules.push('ngCookies');
	    //弹框
	    __webpack_require__(13);
	    ngDepModules.push('ngDialog');
	    // 路由
	    __webpack_require__(14);
	    ngDepModules.push('ngRoute');
	}
	loadBasicModules();
	// define one angular module
	var xf_web = angular.module('xf_web', ngDepModules);
	// 加载controller
	__webpack_require__(16)(xf_web);
	// 加载指令
	__webpack_require__(17)(xf_web);
	// 加载config
	__webpack_require__(18)(xf_web);
	// 加载router
	// require('./entrance/app.router')(xf_web);
	// 加载service
	__webpack_require__(126)(xf_web);
	/**
	 * 配置路由。
	 * 注意这里采用的是ui-router这个路由，而不是ng原生的路由，为了实现路由的多层嵌套
	 * @param  {[type]} $stateProvider
	 * @param  {[type]} $urlRouterProvider
	 * @return {[type]}
	 */
	xf_web.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", "localStorageServiceProvider", "$routeProvider", "$locationProvider", "$provide", "$compileProvider", "$controllerProvider", "$filterProvider", "$ocLazyLoadProvider", "constantMethod", "$rootScopeProvider", function ($stateProvider, $urlRouterProvider, $httpProvider, localStorageServiceProvider, $routeProvider, $locationProvider, $provide, $compileProvider, $controllerProvider, $filterProvider, $ocLazyLoadProvider, constantMethod, $rootScopeProvider) {
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
	    $httpProvider.interceptors.push(['$injector', function ($injector) {
	        return $injector.get('AuthInterceptor');
	    }]);

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
	    routeStates = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./entrance/app.router\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))(angular, constantMethod);
	    routeStates.forEach(function (state) {
	        $stateProvider.state(state);
	    });
	    $urlRouterProvider.otherwise(function ($injector, $location) {
	        $location.path('/HP/define');
	    });
	}]);

/***/ })
])
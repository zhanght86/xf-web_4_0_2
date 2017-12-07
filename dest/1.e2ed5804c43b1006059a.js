webpackJsonp([1],{

/***/ 19:
/***/ (function(module, exports, __webpack_require__) {

	var map = {
		"./app.config": 18,
		"./app.config.js": 18,
		"./app.controller": 16,
		"./app.controller.js": 16,
		"./app.directive": 17,
		"./app.directive.js": 17,
		"./app.module": 20,
		"./app.module.js": 20,
		"./app.router": 21,
		"./app.router.js": 21,
		"./app.service": 64,
		"./app.service.js": 64
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 19;


/***/ }),

/***/ 20:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @Author : MILES .
	 * @Create : 2017/10/26.
	 * @Module : 项目入口模块 以及加载依赖关系
	 */
	// require('babel-polyfill')
	// "angular": "^1.2.29",dist/assets/css/base_5.0.css
	// require("/app/assets/css/base_5.0")
	// require("./assets/css/common_5.0.css")
	// require("./assets/css/nav.css")
	// require("./assets/css/style_5.0.css")
	__webpack_require__(2);
	__webpack_require__(5);
	__webpack_require__(11);
	__webpack_require__(6);
	__webpack_require__(9);
	__webpack_require__(13);
	__webpack_require__(14);
	var xf_web = angular.module("xf_web", [
	//公共模块
	"ui.router", "oc.lazyLoad", "ngDialog", "ngCookies", "LocalStorageModule", "ngRoute",
	//登录
	"loginModule",
	// 应用管理
	"applicationManagementModule",
	//首页
	"HPModule",
	//系统管理
	"SMModule"]);
	// require('../static/index/controllers/home_page/_nav.controller')(xf_web);  // 导航
	// 登录
	// angular.module("loginModule",[]);
	// angular.module("HPModule",[]);
	// angular.module("SMModule",[]) ;

/***/ })

});
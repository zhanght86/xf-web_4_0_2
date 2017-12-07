webpackHotUpdate(1,{

/***/ 18:
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
	__webpack_require__(9);
	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(11);
	__webpack_require__(12);
	var xf_web = angular.module("xf_web", [
	//公共模块
	"ui.router", "oc.lazyLoad", "ngDialog", "ngCookies", "LocalStorageModule", "ngRoute",
	//登录
	"loginModule",
	//首页
	"HPModule",
	//系统管理
	"SMModule"]);
	__webpack_require__(28)(xf_web); // 导航
	// 登录
	// angular.module("loginModule",[]);
	// angular.module("HPModule",[]);
	// angular.module("SMModule",[]) ;

/***/ })

})
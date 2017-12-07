webpackHotUpdate(8,{

/***/ 27:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/11/23.
	 * @Module :  首页模块
	 */
	module.exports = function (angular) {
	    var homePageModule = angular.module('homePageModule', []);
	    // require('../controllers/home_page/_nav.controller')(homePageModule);  // 导航
	    __webpack_require__(29)(homePageModule); // 主体
	    __webpack_require__(30)(homePageModule); // 应用管理
	    __webpack_require__(31)(homePageModule); // 权限管理
	};

/***/ })

})
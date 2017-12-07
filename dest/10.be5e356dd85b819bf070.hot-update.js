webpackHotUpdate(10,{

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/5.
	 * @Module :  应用管理模块 ， 加载依赖
	 */
	module.exports = function (angular) {
	    var applicationManagementModule = angular.module('applicationManagementModule', []);
	    __webpack_require__(76)(applicationManagementModule); // 控制器
	    __webpack_require__(28)(applicationManagementModule); // 导航
	    //--------------------------------------------------
	    //          directive
	    //--------------------------------------------------
	    __webpack_require__(77)(applicationManagementModule); // 开关
	    //--------------------------------------------------
	    //          controller
	    //--------------------------------------------------
	    // 应用信息
	    __webpack_require__(40)(applicationManagementModule); // 应用信息
	    __webpack_require__(41)(applicationManagementModule); // 备份还原
	    // 应用配置
	    __webpack_require__(66)(applicationManagementModule); // 授权管理
	    __webpack_require__(67)(applicationManagementModule); // 渠道管理
	    __webpack_require__(68)(applicationManagementModule); // 热点知识设置
	    __webpack_require__(69)(applicationManagementModule); // 授权管理
	    __webpack_require__(70)(applicationManagementModule); // 授权管理
	    __webpack_require__(71)(applicationManagementModule); // 授权管理
	    __webpack_require__(72)(applicationManagementModule); // 授权管理
	    // 应用发布
	    __webpack_require__(49)(applicationManagementModule); // 节点管理
	    __webpack_require__(50)(applicationManagementModule); // 发布管理
	    //--------------------------------------------------
	    //          server
	    //--------------------------------------------------
	    __webpack_require__(73)(applicationManagementModule);
	    //--------------------------------------------------
	    //         directive
	    //--------------------------------------------------
	    __webpack_require__(52)(applicationManagementModule); //  验证服务名称
	    __webpack_require__(53)(applicationManagementModule); // 验证应用名称
	    __webpack_require__(54)(applicationManagementModule); // 验证节点名称
	};

/***/ }),

/***/ 77:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/5.
	 * @Module : 开关按钮
	 */
	module.exports = function (module) {
	    module.directive('switch', function () {
	        return {
	            restrict: 'EA',
	            scope: {
	                title: '=expanderTitle',
	                value: '=' // 1  true   0  false
	            },

	            template: '<div class="b_box" ng-click="toggle()" ng-class="value?\'open1\':\'close1\'" style="float:left;margin-right:10px;">' + '<div class="s_box"  ng-class="value?\'open2\':\'close2\'"></div>' + '</div>',
	            link: function link(scope, element, attrs) {
	                //scope.$apply(function () {
	                scope.toggle = function toggle() {
	                    scope.value = scope.value ? 0 : 1;
	                };
	                //});
	            }
	        };
	    });
	};

/***/ })

})
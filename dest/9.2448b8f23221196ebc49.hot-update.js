webpackHotUpdate(9,{

/***/ 113:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/5.
	 * @Module :  业务建模  ， 加载依赖
	 */
	module.exports = function (angular) {
	    var businessModelingModule = angular.module('businessModelingModule', []);
	    __webpack_require__(123)(businessModelingModule); // 控制器
	    __webpack_require__(53)(businessModelingModule); // 导航
	    //--------------------------------------------------
	    //          directive
	    //--------------------------------------------------
	    __webpack_require__(60)(businessModelingModule); // 开关
	    //--------------------------------------------------
	    //          controller
	    //--------------------------------------------------
	    // BOT
	    __webpack_require__(114)(businessModelingModule); // bot
	    __webpack_require__(115)(businessModelingModule); // bot套用

	    // 框架库
	    __webpack_require__(116)(businessModelingModule); // 同义
	    __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../controllers/concept/_synony.controller\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))(businessModelingModule); // 集合
	    __webpack_require__(117)(businessModelingModule); // 业务
	    __webpack_require__(118)(businessModelingModule); // 敏感
	    __webpack_require__(119)(businessModelingModule); // 停用
	    __webpack_require__(120)(businessModelingModule); // 强制分词
	    __webpack_require__(117)(businessModelingModule); // bot

	    // 概念库
	    __webpack_require__(121)(businessModelingModule); // 节点管理

	    //--------------------------------------------------
	    //          server
	    //--------------------------------------------------
	    __webpack_require__(122)(businessModelingModule);
	    //--------------------------------------------------
	    //         directive
	    //--------------------------------------------------
	};

/***/ }),

/***/ 123:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Created by 41212 on 2017/3/23.
	 */
	/**
	 * Created by Administrator on 2016/6/3.
	 * 控制器
	 */

	angular.module('businessModelingModule').controller('conceptLibraryController', ['$scope', "$state", "$stateParams", function ($scope, $state, $stateParams) {
	    //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
	    //$scope.vm = {
	    //    isSlide : isSlide,
	    //};
	    //function isSlide(event){
	    //    var self=event.target;
	    //    if($(self).hasClass("slideActive")){
	    //        $(self).removeClass("slideActive").next(".menu_1").stop().slideToggle();
	    //    }else{
	    //        $(self).addClass("slideActive").next(".menu_1").stop().slideToggle();
	    //    }
	    //}
	}]);

/***/ })

})
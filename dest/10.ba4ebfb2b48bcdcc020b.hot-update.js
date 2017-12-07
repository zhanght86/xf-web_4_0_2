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
	    __webpack_require__(78)(applicationManagementModule); //  验证服务名称
	    __webpack_require__(79)(applicationManagementModule); // 验证应用名称
	    __webpack_require__(80)(applicationManagementModule); // 验证节点名称
	};

/***/ }),

/***/ 78:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/9/8.
	 * @Module : 检验服务名称是否重复
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.directive('checkServiceName', function ($http, ApplicationServer) {
	        return {
	            require: 'ngModel',
	            link: function link(scope, ele, attrs, c) {
	                scope.$watch(attrs.ngModel, function (n) {
	                    if (!n) {
	                        return;
	                    } else {
	                        ApplicationServer.verifyServiceName.save({
	                            serviceName: scope.vm.serviceName,
	                            serviceId: scope.vm.serviceId
	                        }, function (data) {
	                            if (data.data) {
	                                c.$setValidity('unique', true);
	                                scope.vm.allowSubmit = 1;
	                            } else {
	                                c.$setValidity('unique', false);
	                                scope.vm.allowSubmit = 0;
	                            }
	                        }, function (data) {
	                            c.$setValidity('unique', false);
	                            scope.vm.allowSubmit = 0;
	                        });
	                    }
	                });
	            }
	        };
	    });
	};

/***/ }),

/***/ 79:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/9/11.
	 * @Module :  验证应用名称
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.directive('checkName', function (ApplicationServer, $log) {
	        return {
	            require: 'ngModel',
	            link: function link(scope, ele, attrs, c) {
	                scope.$watch(attrs.ngModel, function (n) {
	                    if (!n) return;
	                    ApplicationServer.verifyApplicationName.save({
	                        applicationId: APPLICATION_ID,
	                        applicationName: scope.vm.applicationNewName
	                    }, function (response) {
	                        if (response.data) {
	                            c.$setValidity('unique', true);
	                            scope.vm.allowSubmit = 1;
	                        } else {
	                            c.$setValidity('unique', false);
	                            scope.vm.allowSubmit = 0;
	                        }
	                    }, function (error) {
	                        c.$setValidity('unique', false);
	                        scope.vm.allowSubmit = 0;
	                        $log.log(error);
	                    });
	                });
	            }
	        };
	    });
	};

/***/ }),

/***/ 80:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/9/8.
	 * @Module : 检验节点是否合理
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.directive('checkIp', function ($http, ApplicationServer) {
	        return {
	            require: 'ngModel',
	            link: function link(scope, ele, attrs, c) {
	                scope.$watch(attrs.ngModel, function (n) {
	                    if (!n) return;
	                    ApplicationServer.verifyNode.save({
	                        nodeAccessIp: scope.vm.nodeAccessIp,
	                        nodeCode: scope.vm.nodeCode
	                    }, function (data) {
	                        if (data.status == 200) {
	                            c.$setValidity('unique', true);
	                            scope.vm.allowSubmit = 1;
	                        } else {
	                            c.$setValidity('unique', false);
	                            scope.vm.allowSubmit = 0;
	                            scope.vm.errorTip = data.info;
	                        }
	                    }, function (data) {
	                        c.$setValidity('unique', false);
	                        scope.vm.allowSubmit = 0;
	                    });
	                });
	            }
	        };
	    }).directive('checkNode', function ($http, ApplicationServer) {
	        return {
	            require: 'ngModel',
	            link: function link(scope, ele, attrs, c) {
	                scope.$watch(attrs.ngModel, function (n) {
	                    if (!n) return;
	                    ApplicationServer.verifyNode.save({
	                        nodeId: scope.vm.nodeId,
	                        nodeAccessIp: scope.vm.nodeAccessIp,
	                        nodeCode: scope.vm.nodeCode
	                    }, function (data) {
	                        if (data.status == 200) {
	                            c.$setValidity('unique', true);
	                            scope.vm.allowSubmit = 1;
	                        } else {
	                            c.$setValidity('unique', false);
	                            scope.vm.allowSubmit = 0;
	                            scope.vm.errorNodeIdTip = data.info;
	                        }
	                    }, function (data) {
	                        c.$setValidity('unique', false);
	                        scope.vm.allowSubmit = 0;
	                    });
	                });
	            }
	        };
	    });
	};

/***/ })

})
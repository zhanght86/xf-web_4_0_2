webpackHotUpdate(0,{

/***/ 19:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @Author : MILES .
	 * @Create : 2017/10/26.
	 * @Module : 路由配置
	 */
	module.exports = function (angular) {
	    //  导航条 公共
	    var nav = __webpack_require__(20),

	    // 定义basePath
	    loginPath = "../static/login",
	        // 登录
	    homePath = "../static/index",
	        // 应用管理
	    applicationPath = "../static/login",
	        // 应用管理
	    knowledgePath = "../static/login",
	        // 知识管理
	    modelingPath = "../static/login",
	        // 业务建模
	    testingPath = "../static/login",
	        // 测试功能
	    analysisPath = "../static/login",
	        // 应用分析
	    materialgPath = "../static/login",
	        // 素材管理
	    deepLearningPath = "../static/login",
	        // 深度学习
	    systemPath = "../static/login"; // 系统监控
	    return [
	    //--------------------------------------------------
	    //           ##登录页面##
	    //--------------------------------------------------
	    {
	        name: "login",
	        url: "/login",
	        data: {
	            roles: []
	        },
	        title: "登录",
	        templateProvider: ["$q", function ($q) {
	            var deferred = $q.defer();
	            __webpack_require__.e/* nsure */(6, function () {
	                var template = __webpack_require__(24);
	                deferred.resolve(template);
	            });
	            return deferred.promise;
	        }],
	        controller: "LoginController",
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(7, function () {
	                    var loginModule = __webpack_require__(36)(angular); //动态加载Module
	                    $ocLazyLoad.load({
	                        name: "loginModule" //name就是你module的名称
	                    });
	                    defer.resolve(loginModule);
	                });
	                return defer.promise;
	            }]
	        }
	    },
	    //--------------------------------------------------
	    //          ##首页##
	    //--------------------------------------------------
	    {
	        name: "HP",
	        url: "/HP",
	        data: {
	            roles: []
	        },
	        title: "首页容器加载依赖",
	        template: __webpack_require__(21),
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(8, function () {
	                    var homePageModule = __webpack_require__(27)(angular); //动态加载Module
	                    $ocLazyLoad.load({
	                        name: "homePageModule" //name就是你module的名称
	                    });
	                    defer.resolve(homePageModule);
	                });
	                return defer.promise;
	            }]
	        }
	    },
	    // 首页
	    {
	        name: "HP.define",
	        url: "/define",
	        data: {
	            roles: []
	        },
	        parent: "HP",
	        title: "首页",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(22),
	                controller: "HomePageContentController"
	            }
	        }
	    },
	    // 应用 管理
	    {
	        name: "HP.management",
	        url: "/management",
	        data: {
	            roles: []
	        },
	        parent: "HP",
	        title: "应用管理",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(35),
	                controller: "homePageContentController"
	            }
	        }
	    },
	    // 权限管理
	    {
	        name: "HP.permission",
	        url: "/permission",
	        data: {
	            roles: []
	        },
	        parent: "HP",
	        title: "默认首页",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(23),
	                controller: "PermissionController"
	            }
	        }
	    },
	    //--------------------------------------------------
	    //          ##应用管理MP##
	    //--------------------------------------------------
	    {
	        name: "AM",
	        url: "/AM",
	        data: {
	            roles: []
	        },
	        title: "应用管理",
	        templateProvider: ["$q", function ($q) {
	            var deferred = $q.defer();
	            __webpack_require__.e/* nsure */(9, function () {
	                var template = __webpack_require__(38);
	                deferred.resolve(template);
	            });
	            return deferred.promise;
	        }],
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(10, function () {
	                    var applicationManagementModule = __webpack_require__(39)(angular);
	                    $ocLazyLoad.load({
	                        name: "applicationManagementModule"
	                    });
	                    defer.resolve(applicationManagementModule);
	                });
	                return defer.promise;
	            }]
	        }
	    },
	    // --------------------应用信息-------------------- //
	    // 应用信息
	    {
	        name: "AM.info",
	        url: "/info",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "应用信息",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(55),
	                controller: "ApplicationInfoController"
	            }
	        }
	    },
	    // 备份还原
	    {
	        name: "AM.restore",
	        url: "/restore",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "备份还原",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(56),
	                controller: "BackupRestoreController"
	            }
	        }
	    },
	    // --------------------应用配置-------------------- //
	    // 机器人设置
	    {
	        name: "AM.robot",
	        url: "/robot",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "机器人设置",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(57),
	                controller: "RobotSetupController"
	            }
	        }
	    },
	    // 参数设置
	    {
	        name: "AM.parameter",
	        url: "/parameter",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "参数设置",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(58),
	                controller: "ParameterSetupController"
	            }
	        }
	    },
	    // 机器人设置
	    {
	        name: "AM.robot",
	        url: "/robot",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "机器人设置",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(57),
	                controller: "RobotSetupController"
	            }
	        }
	    }];
	};

/***/ }),

/***/ 58:
/***/ (function(module, exports) {

	module.exports = "<div class=\"r-cont pd30 parameterSetting\">\r\n    <div class=\"r-cont-hd\">\r\n        <span>参数设置</span>\r\n    </div>\r\n    <div class=\"r-cont-bd oh pt30 \">\r\n        <div class=\"jqrsz-item jqrsz-item2\">\r\n            <div class=\"item-line\">\r\n                <div class=\"lable\">\r\n                    评论小尾巴：\r\n                </div>\r\n                <div class=\"value\">\r\n                    <div class=\"dib pt-5 mr-15\">\r\n                        <div switch value=\"vm.settingCommentOn\"></div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"jqrsz-item jqrsz-item2\">\r\n            <div class=\"item-line\">\r\n                <div class=\"lable\">\r\n                    寒暄开关：\r\n                </div>\r\n                <div class=\"value\">\r\n                    <div class=\"dib pt-5 mr-15\">\r\n                        <div switch value=\"vm.settingGreetingOn\"></div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <!--<div class=\"jqrsz-item jqrsz-item2\">-->\r\n            <!--<div class=\"item-line\">-->\r\n                <!--<div class=\"lable\">-->\r\n                    <!--话轮识别：-->\r\n                <!--</div>-->\r\n                <!--<div class=\"value\">-->\r\n                    <!--<div class=\"dib pt-5 mr-15\">-->\r\n                        <!--<div ng-class=\"{1: 'open1 b_box', 0: 'close1 b_box'}[vm.settingTurnRoundOn]\"-->\r\n                             <!--ng-click=\"vm.turnOn(vm.settingTurnRoundOn,'settingTurnRoundOn')\"-->\r\n                             <!--style=\"float:left;margin-right:10px;\">-->\r\n                            <!--<div ng-class=\"{1: 'open2 s_box', 0: 'close2 s_box'}[vm.settingTurnRoundOn]\"></div>-->\r\n                        <!--</div>-->\r\n                    <!--</div>-->\r\n                <!--</div>-->\r\n            <!--</div>-->\r\n        <!--</div>-->\r\n        <div class=\"jqrsz-item jqrsz-item2\">\r\n            <div class=\"item-line\">\r\n                <div class=\"lable\">\r\n                    关联个数：\r\n                </div>\r\n                <div class=\"value\">\r\n                    <input class=\"input-text\" type=\"number\" ng-model=\"vm.settingRelateNumber\"\r\n                           ng-change=\"vm.parameterLimit(1,'settingRelateNumber')\" step=\"1\"\r\n                           placeholder=\"配置关联问题的个数，标准格式为数字型\" style=\"width: 350px;\" required>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"jqrsz-item jqrsz-item2\">\r\n            <div class=\"item-line\">\r\n                <div class=\"lable\">\r\n                    推荐个数：\r\n                </div>\r\n                <div class=\"value\">\r\n                    <input class=\"input-text\" type=\"number\" ng-model=\"vm.settingRecommendNumber\"\r\n                           ng-change=\"vm.parameterLimit(1,'settingRecommendNumber')\" step=\"1\"\r\n                           placeholder=\"配置推荐问题个数，标准格式为数字型\" style=\"width: 350px;\" required>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <!--<div class=\"jqrsz-item jqrsz-item2\">-->\r\n            <!--<div class=\"item-line\">-->\r\n                <!--<div class=\"lable\">-->\r\n                    <!--获取数据时间：-->\r\n                <!--</div>-->\r\n                <!--<div class=\"value\">-->\r\n                    <!--<input class=\"input-text\" type=\"number\" ng-model=\"vm.settingDataTimeoutLimit\"-->\r\n                           <!--ng-change=\"vm.parameterLimit(1,'settingDataTimeoutLimit')\" step=\"1\"-->\r\n                           <!--placeholder=\"获取数据时间限制，标准格式为数字型\" style=\"width: 350px;\" required>-->\r\n                <!--</div>-->\r\n            <!--</div>-->\r\n        <!--</div>-->\r\n        <div class=\"jqrsz-item jqrsz-item2\">\r\n            <div class=\"item-line\">\r\n                <div class=\"lable\">\r\n                    上限阈值：\r\n                </div>\r\n                <div class=\"value\">\r\n                    <input class=\"input-text\" type=\"number\" ng-model=\"vm.settingUpperLimit\"\r\n                           ng-change=\"vm.parameterLimit(0,'settingUpperLimit')\" step=\"0.1\"\r\n                           placeholder=\"配置上限阈值，标准格式为float型\" style=\"width: 350px;\" required>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"jqrsz-item jqrsz-item2\">\r\n            <div class=\"item-line\">\r\n                <div class=\"lable\">\r\n                    下限阈值：\r\n                </div>\r\n                <div class=\"value\">\r\n\r\n                    <input class=\"input-text\" type=\"number\" ng-model=\"vm.settingLowerLimit\"\r\n                           ng-change=\"vm.parameterLimit(0,'settingLowerLimit')\" step=\"0.1\"\r\n                           placeholder=\"配置下线阈值，标准格式为float型\" style=\"width: 350px;\" required>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"jqrsz-item jqrsz-item2\">\r\n            <div class=\"item-line\">\r\n                <div class=\"lable\">\r\n                    寒暄阈值：\r\n                </div>\r\n                <div class=\"value\">\r\n                    <input class=\"input-text\" type=\"number\" ng-model=\"vm.settingGreetingThreshold\"\r\n                           ng-change=\"vm.parameterLimit(0,'settingGreetingThreshold')\" step=\"0.1\"\r\n                           placeholder=\"配置寒暄阈值，标准格式为float型\" style=\"width: 350px;\" required>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"jqrsz-btn-box\">\r\n            <a class=\"btn btn-blue mr10\" ng-click=\"vm.updateParameter()\">保存</a>\r\n            <a class=\"btn btn-gray\" ng-click=\"vm.queryParameter()\">取消</a>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n\r\n"

/***/ })

})
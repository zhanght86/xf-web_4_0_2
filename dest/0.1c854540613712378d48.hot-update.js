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
	    }];
	};

/***/ }),

/***/ 57:
/***/ (function(module, exports) {

	module.exports = "<div class=\"robotSetup r-cont pd30\">\r\n    <div class=\"r-cont-hd\">\r\n        <span>机器人设置</span>\r\n    </div>\r\n    <div class=\"r-cont-bd oh\">\r\n        <!--<form name=\"mySetting\" class=\"css-form\" novalidate ng-submit=\"vm.editRobot(mySetting.$valid)\">-->\r\n        <form name=\"mySetting\" class=\"css-form\" novalidate>\r\n        <div class=\"jqrsz-item\">\r\n\r\n            <div class=\"setting_div\">\r\n                <span class=\"setting_span\">机器人昵称：</span>\r\n                <div>\r\n                    <input name=\"robotName\" class=\"input-text\" type=\"text\" placeholder=\"给机器人起个名字吧\"\r\n                           ng-model=\"vm.robotName\" ng-maxlength=\"8\" ng-pattern=\"/^[\\u2E80-\\uFE4F]+$/\"/>\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotName.$dirty && mySetting.robotName.$invalid\">\r\n                        昵称输入不能超过8个汉字，请重新输入！\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"item-line mt15 mb10\">\r\n                <div class=\"lable\">\r\n                    机器人头像：\r\n                </div>\r\n                <div class=\"value\">\r\n                    <div class=\"poto-box\">\r\n                        <!--<img ng-src=\"{{vm.imgUrl}}{{vm.robotHead}}\"/>-->\r\n                        <img ng-src=\"/img/{{vm.robotHead}}\"/>\r\n                    </div>\r\n                    <div class=\"up-tip\">\r\n                        网页聊天中左上角展示的圆形头像，<br />设置像素为70*70\r\n                    </div>\r\n                    <div class=\"up-btn\">\r\n                        <a class=\"js-jdbtn\" ng-click=\"vm.addClassic()\">经典</a>\r\n                        <a class=\"js-zdybtn\" ng-click=\"vm.addCustom()\">自定义</a>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"setting_div\">\r\n                <span class=\"setting_span\">欢迎语：</span>\r\n                <div>\r\n                    <textarea class=\"textarea\" name=\"robotWelcome\" check-welcome=\"robotWelcome\" placeholder=\"请再次输入欢迎语!\"\r\n                              ng-model=\"vm.robotWelcome\"\r\n                              ng-pattern=\"/^[\\u2E80-\\uFE4F\\（\\）\\《\\》\\——\\；\\，\\。\\“\\”\\<\\>\\！\\\\r\\n]+$/\"/> >小富机器人欢迎您！</textarea>\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotWelcome.$error.pattern\">\r\n                        欢迎语只能是汉字，请重新输入\r\n                    </div>\r\n                    <!--{{mySetting.robotWelcome.$error.len}}-->\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotWelcome.$error.len\">\r\n                        欢迎语不能超过10条，请重新输入\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!--<div class=\"setting_div\">-->\r\n                <!--<span class=\"setting_span\">企业名称设置：</span>-->\r\n                <!--<div>-->\r\n                    <!--<input class=\"input-text\" type=\"text\" name=\"\" placeholder=\"\" />-->\r\n                    <!--<div class=\"error-tip c-red\" >-->\r\n                        <!--错误提示-->\r\n                    <!--&lt;!&ndash;</div>&ndash;&gt;-->\r\n                <!--</div>-->\r\n            <!--</div>-->\r\n\r\n        </div>\r\n\r\n        <div class=\"jqrsz-item\">\r\n\r\n            <div class=\"setting_div\">\r\n                <span class=\"setting_span\">热点知识更新频率：</span>\r\n                <div>\r\n                    <input class=\"input-text\" type=\"text\" name=\"robotHotQuestionTimeout\" placeholder=\"热点问题的更新频率，只限正整数\"\r\n                           ng-model=\"vm.robotHotQuestionTimeout\" style=\"width: 190px;\" ng-pattern=\"/^([1-9][0-9]*){1,3}$/\" />\r\n                    <span>分钟</span>\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotHotQuestionTimeout.$dirty && mySetting.robotHotQuestionTimeout.$invalid\">\r\n                        热点知识更新频率必须大于0，请重新输入\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"setting_div\">\r\n                <span class=\"setting_span\">未知回答：</span>\r\n                <div>\r\n                    <input class=\"input-text\" type=\"text\" name=\"robotUnknown\" placeholder=\"当机器人答不上来时，机器人的回复\"\r\n                           ng-model=\"vm.robotUnknown\" ng-maxlength=\"50\"\r\n                           ng-pattern=\"/^[\\u2E80-\\uFE4F\\（\\）\\《\\》\\——\\；\\，\\。\\“\\”\\<\\>\\！]+$/\"/>\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotUnknown.$dirty && mySetting.robotUnknown.$invalid\">\r\n                        您输入的未知回答不能超过50个汉字，请重新输入\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"setting_div\">\r\n                <span class=\"setting_span\">敏感词回答：</span>\r\n                <div>\r\n                    <input class=\"input-text\" type=\"text\" name=\"robotSensitive\" placeholder=\"当会话中包含敏感词时，机器人的回复\"\r\n                           ng-model=\"vm.robotSensitive\" ng-maxlength=\"50\"\r\n                           ng-pattern=\"/^[\\u2E80-\\uFE4F\\（\\）\\《\\》\\——\\；\\，\\。\\“\\”\\<\\>\\！]+$/\"/>\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotSensitive.$dirty && mySetting.robotSensitive.$invalid\">\r\n                        您输入的敏感词回答不能超过50个汉字，请重新输入\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"setting_div\">\r\n                <span class=\"setting_span\">过期知识回答：</span>\r\n                <div>\r\n                    <input class=\"input-text\" name=\"robotExpire\" type=\"text\" placeholder=\"当问答的知识已经过期了，机器人的回复\"\r\n                           ng-model=\"vm.robotExpire\" ng-maxlength=\"50\"\r\n                           ng-pattern=\"/^[\\u2E80-\\uFE4F\\（\\）\\《\\》\\——\\；\\，\\。\\“\\”\\<\\>\\！]+$/\"/>\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotExpire.$dirty && mySetting.robotExpire.$invalid\">\r\n                        过期知识回答不能超过50个汉字，请重新输入\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n        </div>\r\n\r\n        <div class=\"jqrsz-item\">\r\n            <div class=\"setting_div\">\r\n                <span class=\"setting_span\">重复回答次数：</span>\r\n                <div>\r\n                    <input class=\"input-text\" type=\"text\" name=\"robotRepeatNumber\"\r\n                           ng-model=\"vm.robotRepeatNumber\" style=\"width: 190px;\" ng-pattern=\"/^([1-9][0-9]*){1,3}$/\"/>\r\n                    <span>次</span>\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotRepeatNumber.$dirty && mySetting.robotRepeatNumber.$invalid\">\r\n                        重复回答次数必须设置为大于0，请重新输入\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"setting_div\">\r\n                <span class=\"setting_span\">重复回答提示：</span>\r\n                <div>\r\n                    <input class=\"input-text\" type=\"text\" name=\"robotRepeat\" placeholder=\"当用户重复回答超过设置次数时，机器人的回复\"\r\n                           ng-model=\"vm.robotRepeat\" ng-maxlength=\"50\"\r\n                           ng-pattern=\"/^[\\u2E80-\\uFE4F\\（\\）\\《\\》\\——\\；\\，\\。\\“\\”\\<\\>\\！]+$/\"/>\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotRepeat.$dirty && mySetting.robotRepeat.$invalid\">\r\n                        重复回答提示不能超过50个字，请重新输入\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"setting_div\">\r\n                <span class=\"setting_span\">会话超时时间：</span>\r\n                <div>\r\n                    <input class=\"input-text\" name=\"robotTimeoutLimit\" type=\"text\"\r\n                           ng-model=\"vm.robotTimeoutLimit\" style=\"width: 190px;\" ng-pattern=\"/^([1-9][0-9]*){1,3}$/\"/>\r\n                    <span>分钟</span>\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotTimeoutLimit.$dirty && mySetting.robotTimeoutLimit.$invalid\">\r\n                        会话超时时间必须设置为大于0，请重新设置\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"setting_div\">\r\n                <span class=\"setting_span\">会话超时提示：</span>\r\n                <div>\r\n                    <input class=\"input-text\" name=\"robotTimeout\" type=\"text\" placeholder=\"当会话超时后，机器人的回复\"\r\n                           ng-model=\"vm.robotTimeout\" ng-maxlength=\"50\"\r\n                           ng-pattern=\"/^[\\u2E80-\\uFE4F\\（\\）\\《\\》\\——\\；\\，\\。\\“\\”\\<\\>\\！]+$/\"/>\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotTimeout.$dirty && mySetting.robotTimeout.$invalid\">\r\n                        会话超时提示不能超过50个汉字，请重新输入\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"tc\">\r\n            <button class=\"btn1 btn1_blue mr10\" ng-click=\"vm.editRobot(mySetting.$valid)\">保存</button>\r\n            <!--<button  class=\"btn btn-blue mr10\" type=\"submit\">保存</button>-->\r\n            <button class=\"btn1 btn_gray\" ng-click=\"vm.queryRobotParameter()\">取消</button>\r\n        </div>\r\n        </form>\r\n    </div>\r\n\r\n</div>\r\n"

/***/ })

})
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
	    // 转人工
	    {
	        name: "AM.manual",
	        url: "/manual",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "转人工",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(59),
	                controller: "ManualSettingController"
	            }
	        }
	    },
	    // 转人工
	    {
	        name: "AM.manual",
	        url: "/manual",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "转人工",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(59),
	                controller: "ManualSettingController"
	            }
	        }
	    },
	    // 转人工
	    {
	        name: "AM.manual",
	        url: "/manual",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "转人工",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(59),
	                controller: "ManualSettingController"
	            }
	        }
	    },
	    // 转人工
	    {
	        name: "AM.manual",
	        url: "/manual",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "转人工",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(59),
	                controller: "ManualSettingController"
	            }
	        }
	    },
	    // 转人工
	    {
	        name: "AM.manual",
	        url: "/manual",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "转人工",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(59),
	                controller: "ManualSettingController"
	            }
	        }
	    },
	    // 转人工
	    {
	        name: "AM.manual",
	        url: "/manual",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "转人工",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(59),
	                controller: "ManualSettingController"
	            }
	        }
	    }];
	};

/***/ }),

/***/ 59:
/***/ (function(module, exports) {

	module.exports = "<div class=\"robotSetup r-cont pd30 manual\">\r\n    <div class=\"r-cont-hd\">\r\n        <span>转人工设置</span>\r\n    </div>\r\n    <div class=\"r-cont-bd oh mb20 mt30 \" style=\"padding-left:85px;\">\r\n        <div class=\"setting_div mb20 pr\" style=\"padding-left:130px;\">\r\n            <span class=\"setting_span pa\" style=\"width:130px;\">人工客服有效期：</span>\r\n            <div class=\"clearfix\">\r\n                <span class=\"L mr10\">\r\n                    <input type=\"text\" id=\"startTime\" onchange=\"\" ng-model=\"vm.workStartTime\" onclick=\"WdatePicker({dateFmt:'HH:mm:ss',maxDate:'#F{$dp.$D(\\'endTime\\')}',onpicked:function(){}})\" class=\"input-text Wdate\" style=\"width:185px;border:1px solid #e1e1e1;height:31px;font-size:14px;\" placeholder=\"HH:mm:ss\" readonly=\"readonly\">\r\n                    -\r\n                    <input type=\"text\" id=\"endTime\" onchange=\"\" ng-model=\"vm.workEndTime\" onclick=\"WdatePicker({dateFmt:'HH:mm:ss',maxDate:'#F{$dp.$D(\\'endTime\\')}',onpicked:function(){}})\" class=\"input-text Wdate\" style=\"width:185px;border:1px solid #e1e1e1;height:31px;font-size:14px;\" placeholder=\"HH:mm:ss\" readonly=\"readonly\">\r\n                </span>\r\n                <span class=\"L pt-5\" >\r\n                    <a href=\"javascript:;\" class=\"tool_tip\" ng-mouseenter=\"vm.showTip($event)\" ng-mouseleave =\"vm.hideTip($event)\"></a>\r\n                    <span class=\"pd-5 tooltip_span\" >人工客服有效期</span>\r\n                </span>\r\n            </div>\r\n        </div>\r\n        <div class=\"setting_div mb20 pr\" style=\"padding-left:130px;\">\r\n            <span class=\"setting_span pa\" style=\"width:130px;line-height:20px;\">转人工条件：</span>\r\n            <div class=\"clearfix mb30\">\r\n                <label class=\"L mr30\"><input type=\"checkbox\" ng-model=\"vm.commandOn\"  ng-checked=\"vm.commandOn\"/> 人工命令</label>\r\n\r\n                <!--<div class=\"L mr30\"><div checkbox-backup class=\"L\"></div><span class=\"L\">人工命令</span></div>-->\r\n                <span class=\"L\" >\r\n                    <a href=\"javascript:;\" class=\"tool_tip\" ng-mouseenter=\"vm.showTip($event)\" ng-mouseleave=\"vm.hideTip($event)\"></a>\r\n                    <span class=\"pd-5 tooltip_span \" >人工命令</span>\r\n                </span>\r\n            </div>\r\n            <div class=\"clearfix mb30\">\r\n                <label class=\"L mr30\"><input type=\"checkbox\"  ng-model=\"vm.noAnswerOn\"  name=\"checkbox\"  ng-checked=\"vm.noAnswerOn\"/> 机器人未直接回答</label>\r\n                <!--<div class=\"L mr30\"><div checkbox-backup class=\"L\" ng-model=\"vm.noAnswerOn\" ng-click=\"toggleNum()\"></div><span class=\"L\">机器人未直接回答</span></div>-->\r\n                <span class=\"L\" >\r\n                    <a href=\"javascript:;\" class=\"tool_tip\" ng-mouseenter=\"vm.showTip($event)\" ng-mouseleave=\"vm.hideTip($event)\"></a>\r\n                    <span class=\"pd-5 tooltip_span\" >机器人未直接回答</span>\r\n                </span>\r\n            </div>\r\n            <div class=\"clearfix mb20\">\r\n                未直接回答次数：\r\n                <input type=\"text\" class=\"bd txt input_xs\" ng-model=\"vm.noAnswerNumber\" ng-keyup=\"vm.checkNum()\" ng-disabled=\"!vm.noAnswerOn\"/>\r\n            </div>\r\n        </div>\r\n        <div class=\" pt30 pb30 pl130\">\r\n            <button class=\"btn btn-primary\" ng-click=\"vm.saveData()\">保存</button>\r\n        </div>\r\n    </div>\r\n</div>\r\n<script>\r\n\r\n</script>\r\n"

/***/ })

})
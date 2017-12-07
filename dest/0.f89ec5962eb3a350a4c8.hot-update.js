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
	    // 授权管理
	    {
	        name: "AM.authorization",
	        url: "/authorization",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "授权管理",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(59),
	                controller: "AuthorizationManagementController"
	            }
	        }
	    },
	    // 热点知识配置
	    {
	        name: "AM.hot",
	        url: "/hot",
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
	                template: __webpack_require__(60),
	                controller: "HotKnowledgeSetupController"
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
	    // 场景管理
	    {
	        name: "AM.scene",
	        url: "/scene",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "场景管理",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(61),
	                controller: "SceneManageController"
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

/***/ 60:
/***/ (function(module, exports) {

	module.exports = "<div class=\"r-cont pd30\">\r\n    <div class=\"r-cont-hd\">\r\n        <span>热点知识设置</span>\r\n    </div>\r\n    <div class=\"r-cont-bd oh \">\r\n        <div class=\"con_box  mb25\">\r\n            <div class=\"pr con_box_serl bd mr10\" style=\"margin:0 auto 20px;\">\r\n                <input type=\"text\" class=\"txt L\" placeholder=\"\" ng-model=\"vm.hotQuestionTitle\" style=\"width:257px;\">\r\n                <!--<input type=\"button\" class=\"btn1\" value=\"查找\" >-->\r\n                <button class=\"btn1\" type=\"button\"  ng-click=\"vm.queryHotKnowledgeList()\">查找</button>\r\n            </div>\r\n            <div class=\"mb10 bd p20 cl\" style=\"background:#fcfdfd;border-color:#f2f4f7;\">\r\n                <div class=\"cl mb-20\">\r\n                    \t<span class=\"L\">\r\n                            <button class=\"L btn1 btn_delete mr-10\" ng-click=\"vm.removeHotKnowledge()\">批量删除</button>\r\n                        \t<button class=\"L btn1 btn1_blue mr-10\" ng-click=\"vm.addHotHotKnow()\">添加</button>\r\n                            <button class=\"btn1 btn_green\" ng-click=\"vm.setFlag=!vm.setFlag\"><span style=\"color:#fff;\" ng-if=\"vm.setFlag\">手动设置</span><span style=\"color:#fff;\" ng-if=\"!vm.setFlag\">自动设置</span></button>\r\n                        </span>\r\n                        <span class=\"R\">\r\n                            <!--<span>共有数据：<b >3</b> 条</span>-->\r\n                             <span class=\"c-999 pl-10\">共有数据：<b >{{vm.hotPaginationConf.totalItems}}</b> 条</span>\r\n                        </span>\r\n                </div>\r\n                <div>\r\n                    <table class=\"stop_word_tab\" >\r\n                        <thead>\r\n                        <tr>\r\n                            <th class=\"bold\" width=\"5%\"><input class=\"selectAllBtn\" type=\"checkbox\" ng-click=\"vm.selectAllHotKnow()\" ng-checked=\"vm.isAllHotKnowSelected\"/></th>\r\n                            <th class=\"bold\" width=\"15%\">热点知识</th>\r\n                            <th class=\"bold\" width=\"12%\">排序</th>\r\n                            <th class=\"bold\" width=\"18%\">最终问及时间</th>\r\n                            <th class=\"bold\" width=\"17%\">操作</th>\r\n                        </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                        <tr ng-repeat=\"item in vm.hotKnowList\">\r\n                            <!--{{vm.hotKnowList}}-->\r\n                            <!--<td><input type=\"checkbox\" ng-checked=\"vm.isAllHotKnowSelected\" ng-click=\"vm.selectSingle($event,item.hotQuestionId)\"/></td>-->\r\n                            <td><input type=\"checkbox\" ng-checked=\"vm.hotKnowDelIds.inArray(item.hotQuestionId)\" ng-click=\"vm.selectSingleHotKnow(item.hotQuestionId)\"/></td>\r\n                            <td>{{item.hotQuestionTitle}}</td>\r\n                            <td>{{item.hotQuestionOrder}}</td>\r\n                            <td>{{item.hotQuestionUpdateTime | date : 'yyyy-MM-dd HH:mm:ss'}}</td>\r\n                            <td>\r\n                                <input type=\"button\" ng-disabled=\"!vm.setFlag\"  style=\"display: inline-block;background:#fff\" class=\"c-primary mr-10\" ng-class=\"{true:'cur-point',false:'cur-disable'}[vm.setFlag]\"  ng-click=\"vm.toTop(item)\"  ng-if=\"item.hotQuestionOrder!=1\" value=\"置顶\">\r\n                                <input type=\"button\" ng-disabled=\"!vm.setFlag\"  style=\"display: inline-block;background:#fff\" class=\"c-primary mr-10\"  ng-click=\"vm.move(item)\" ng-class=\"{true:'cur-point',false:'cur-disable'}[vm.setFlag]\" ng-if=\"item.hotQuestionOrder!=1\" value=\"上移\">\r\n                                <input type=\"button\" ng-disabled=\"!vm.setFlag\"  style=\"display: inline-block;background:#fff\" class=\"c-primary\"  ng-click=\"vm.down(item)\" ng-class=\"{true:'cur-point',false:'cur-disable'}[vm.setFlag]\"  ng-if=\"item.hotQuestionOrder!=vm.vm.hotPaginationConf.totalItems || item.hotQuestionOrder == 1\" value=\"下移\">\r\n                                <!--<input class=\"c-primary mr-10\" href=\"javascript:;\" ng-click=\"vm.move(item)\"  ng-if=\"item.hotQuestionOrder!=1\">上移</a>-->\r\n                                <!--<a  class=\"c-primary\" href=\"javascript:;\" ng-click=\"vm.down(item)\"  ng-if=\"item.hotQuestionOrder!=vm.vm.hotPaginationConf.totalItems || item.hotQuestionOrder == 1\">下移</a>-->\r\n                            </td>\r\n                        </tr>\r\n                        </tbody>\r\n                    </table>\r\n                </div>\r\n                <pagination ng-if=\"vm.hotPaginationConf.totalItems && vm.hotPaginationConf.totalItems>0\" conf=\"vm.hotPaginationConf\"></pagination>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<style>\r\n\r\n</style>"

/***/ }),

/***/ 61:
/***/ (function(module, exports) {

	module.exports = "<div class=\"r-cont pd30\">\r\n    <div class=\"r-cont-hd mb-20\">\r\n        <span>场景管理</span>\r\n    </div>\r\n    <div class=\"scene_box\">\r\n        <div class=\"scene_box_top\">\r\n            <span  ng-click=\"vm.showType=0\" ng-class=\"{1: '', 0: 'cur'}[vm.showType]\">知识类型</span>\r\n            <span id=\"exchangeMode\"  ng-click=\"vm.showType=1\" ng-class=\"{1: 'cur', 0: ''}[vm.showType]\">交互方式</span>\r\n        </div>\r\n        <div class=\"scene_box_bot\">\r\n            <div style=\"display:block;\" ng-show=\"!vm.showType\">\r\n                <h3 ng-if=\"vm.sceneId==1\" class=\"pt-20 pb-20 f16\">客服型场景所包含的知识类型</h3>\r\n                <h3 ng-if=\"vm.sceneId==2\" class=\"pt-20 pb-20 f16\">营销型场景所包含的知识类型</h3>                <div class=\"mb-20\" >\r\n                    <input type=\"text\" class=\"bd input-text \" ng-model=\"vm.wordsForKnowType\" placeholder=\"请输入知识框架\" style=\"width:257px;\">\r\n                    <input type=\"button\" class=\"btn1 btn1_blue \" value=\"查找\" ng-click=\"vm.queryKnowledgeType(vm.wordsForKnowType)\">\r\n                </div>\r\n                <div class=\"cl\" >\r\n                    <div class=\"bd know_style\" style=\"height:180px;\" ng-repeat=\"item in vm.knowledgeTypeData\">\r\n                        <p class=\"tc\">{{item.knowledgeTypeName}}</p>\r\n                        <dl class=\"bd_bot text-c pb-10 mb-10\">\r\n                            <dt><img src=\"../../../images/images/u1435.png \" width=\"50\" height=\"50\"/></dt>\r\n                            <!--<dd>-->\r\n                                <!--<a ng-click=\"vm.updateKnowledgeType(item);\" ng-if=\"item.statusId==20001\">禁用</a>-->\r\n                                <!--<a ng-click=\"vm.updateKnowledgeType(item);\" ng-if=\"item.statusId==20002\">启用</a>-->\r\n                            <!--</dd>-->\r\n                        </dl>\r\n                        <p class=\"c-999\">*{{item.knowledgeTypeDescription}}</p>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div  ng-show=\"vm.showType\">\r\n                <h3 ng-if=\"vm.sceneId==1\" class=\"pt-20 pb-20 f16\">客服型场景所包含的知识类型</h3>\r\n                <h3 ng-if=\"vm.sceneId==2\" class=\"pt-20 pb-20 f16\">营销型场景所包含的知识类型</h3>\r\n                <div class=\"mb-20\" >\r\n                    <input type=\"text\" class=\"bd input-text \" ng-model=\"vm.wordsInterviewMode\" placeholder=\"请输入交互方式\" style=\"width:257px;\">\r\n                    <input type=\"button\" class=\"btn1 btn1_blue \" value=\"查找\" ng-click=\"vm.listExchangeMode(vm.wordsInterviewMode)\">\r\n                </div>\r\n                <div class=\"cl\">\r\n                    <!--<div class=\"bd know_style\" style=\"height:180px;\" ng-repeat=\"item in vm.exchangeModeData\">-->\r\n                        <!--<p class=\"tc\">{{item.exchangeModeName}}</p>-->\r\n                        <!--<dl class=\"bd_bot text-c pb-10 mb-10\">-->\r\n                            <!--<dt><img src=\"../../../images/images/u1456.png \" width=\"50\" height=\"50\"/></dt>-->\r\n                            <!--<dd>-->\r\n                                <!--&lt;!&ndash;<a ng-click=\"vm.updateExchangeMode(item);\" ng-if=\"item.statusId==20001\">禁用</a>&ndash;&gt;-->\r\n                                <!--&lt;!&ndash;<a ng-click=\"vm.updateExchangeMode(item);\" ng-if=\"item.statusId==20002\">启用</a>&ndash;&gt;-->\r\n                                <!--<a ng-if=\"item.exchangeModeId==13&&item.statusId==20001\" ng-click=\"vm.saveMultiInteractive()\">配置</a>-->\r\n                            <!--</dd>-->\r\n                        <!--</dl>-->\r\n                        <!--<p class=\"c-999\">{{item.exchangeDescription}}</p>-->\r\n                    <!--</div>-->\r\n                    <div>\r\n                        <table class=\"stop_word_tab\">\r\n                            <tr>\r\n                                <td width=\"20%\" class=\"bold\">交互方式</td>\r\n                                <td width=\"60%\" class=\"bold\">详情</td>\r\n                                <td width=\"20%\" class=\"bold\">操作</td>\r\n                            </tr>\r\n                            <tr ng-repeat=\"item in vm.exchangeModeData\">\r\n                                <td>{{item.exchangeModeName}}</td>\r\n                                <td>{{item.exchangeDescription}}</td>\r\n                                <td><a ng-if=\"item.exchangeModeId==13&&item.statusId==20001\" ng-click=\"vm.multipleConversationSetup()\">多轮会话配置</a></td>\r\n                            </tr>\r\n                        </table>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ })

})